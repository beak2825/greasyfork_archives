// ==UserScript==
// @name         baueSchiffe_sendRessis
// @namespace    http://tampermonkey.net/
// @version      0.2
// @datetime     04.05.2016 23:22
// @description  try to take over the world!
// @author       S.K.
// @match        http://*.xorbit.de/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

var win_menu=window;
var win_main = window;
var doc_menu = window.document;
var doc_main = window.document;

var b_firstStart = true;
var b_waitFor = false;
var time_until_reload = 30;

var uni = top.window.location.href.match(/uni(\d)/)[1];
var serverURL = 'http://uni' + uni + '.xorbit.de/';
var url_raumschiffswerft = serverURL + 'buildings.php?mode=fleet';
var url_fleet = serverURL + 'fleet.php';

var ausgewaehlte_planetenID;
var url_zum_oeffnen = 'fleet.php';

var start_koords, a_start_koords, start_galaxy, start_system, start_planet, start_planettype
var ziel_koords, a_ziel_koords, ziel_galaxy, ziel_system, ziel_planet, ziel_planettype
var aktuelle_galaxy, ziel_galaxy

var met_vorhanden = 0;
var kris_vorhanden = 0;
var deut_vorhanden = 0;
var ress_gesamt = 0;

var met_vorhanden_MIO = 0;
var kris_vorhanden_MIO = 0;
var deut_vorhanden_MIO = 0;
var ress_gesamt_MIO = 0;

var met_vorhanden_MRD = 0;
var kris_vorhanden_MRD = 0;
var deut_vorhanden_MRD = 0;
var ress_gesamt_MRD = 0;

var anzahl_evos_benoetigt = 0;

var anzahl_solarsatelliten_benoetigt = 0;
var anzahl_todessterne_benoetigt = 0;
var anzahl_recycler_benoetigt = 0;

var anzahl_recycler_vorhanden = 0;
var anzahl_evos_vorhanden = 0;
var anzahl_todessterne_vorhanden = 0;
var anzahl_solarsatelliten_vorhanden = 0;

var anzahl_recycler_noch_bauen = 0;
var anzahl_evos_noch_bauen = 0;
var anzahl_todessterne_noch_bauen = 0;
var anzahl_solarsatelliten_noch_bauen = 0;

if (top.window.location.href.match(/http:\/\/uni\d\.xorbit\.de/)) {
    $('frame').bind('load', function() {
        fn_frameLoaded($(this), 'load');
    }); // ==> beim Neuladen eines Frames
    $(window).bind('load', function() {
        fn_framesetLoaded($(this), 'load');
    });
}

function fn_start() {
    console.info('70__fn_start:');
    if (frames.length === 2) {
        win_menu = top.frames[0].window;
        win_main = top.frames[1].window;
        doc_menu = top.frames[0].window.document;
        doc_main = top.frames[1].window.document;
    }

    if (typeof($('#id_o_div1', doc_menu)[0]) === 'undefined') {
        console.info('79__insert...');
        fn_insertHTML();
        fn_addEventListener();
        fn_reloadRessis_baueSchiffe_reloadRessis({
            counter: 1
        });
    }
}

function fn_frameLoaded(obj, val) {
    console.info('\n**********************************************************************************************************************************' +
        '\n************************************** ' + 'fn_frameLoaded:  ' + obj[0].contentDocument.URL + ' **************************************' +
        '\n**********************************************************************************************************************************');
    console.warn('90__fn_frameLoaded: ' + 'val: ' + val + '  |  url:  ' + obj[0].contentDocument.URL + '  |  ' + 'b_firstStart: ' + b_firstStart);
    console.info('URL: ' + obj[0].contentDocument.URL + '  |  ' + obj[0].contentDocument.readyState + '  |  ' + val);
    fn_set_global_vars('fn_frameLoaded: ' + obj[0].contentDocument.URL);
    console.info(' ______________________________----> ' + $('input', obj[0].contentDocument).attr('onclick'));

    if (b_firstStart !== true) {
        console.debug('53__id_o_div1 !== undefined');
        if (obj[0].contentDocument.URL.match(/leftmenu\.php/)) {
            console.debug('56__url = leftmenu');
            fn_firstStart();
        } else {
            console.debug('58__url <> leftmenu');
            fn_reloadRessis_baueSchiffe_reloadRessis({
                counter: 1
            });
            if ($('#saveRessis', doc_menu)[0].checked === true) {
                if (doc_main.URL.match('fleet.php')) {
                    url_zum_oeffnen = 'floten1.php';
                    returnCode = fn_flotte_auswaehlen(doc_main);
                }
                if (doc_main.URL.match('floten1.php')) {
                    url_zum_oeffnen = 'floten2.php';
                    returnCode = fn_flotte_koordinaten_eingeben(doc_main);
                }
                if (doc_main.URL.match('floten2.php')) {
                    url_zum_oeffnen = 'floten3.php';
                    returnCode = fn_flotte_rohstoffe_eingeben(doc_main);
                }
                if (doc_main.URL.match('floten3.php')) {
                    returnCode = 1;
                }
            }
        }
    }
}

function fn_framesetLoaded(obj, val) {
    console.info('\n----------------------------------------------------------------------------------------------------------------------------------' +
        '\n-------------------------------------- ' + 'fn_framesetLoaded: ' + obj[0].document.URL + ' --------------------------------------' +
        '\n----------------------------------------------------------------------------------------------------------------------------------');
    console.warn('128__fn_framesetLoaded: ' + 'val: ' + val + '  |  url:  ' + document.URL + '  |  ' + 'b_firstStart: ' + b_firstStart);
    window['o_doc'] = obj;
    fn_set_global_vars('fn_framesetLoaded: ' + document.URL);

    window['WINDOW'] = top.window;
    $('a', doc_menu).click(function() {
        fn_link_clicked($(this), 'doc_menu');
    });
    $('a', doc_main).click(function() {
        fn_link_clicked($(this), 'doc_main');
    });
    i_wait = false;
    fn_firstStart();
}

function fn_link_clicked(obj, sourceWindow) {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n146__fn_link_clicked: ' + 'sourceWindow: ' + sourceWindow + '  |  ' + obj[0].href);
    console.info(eval(sourceWindow + '.URL'));
    window['doc_linkClicked'] = obj;
}

function fn_set_global_vars(val) {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n152__fn_set_global_vars:' + 'val: ' + val);
    if (frames.length === 2) {
        doc_menu = frames[0].document;
        doc_main = frames[1].document;
        win_menu = frames[0].window;
        win_main = frames[1].window;
    } else {
        doc_menu = document;
        doc_main = document;
        win_menu = window;
        win_main = window;
    }
    window['DOC'] = document;
    window['DOC_MENU'] = doc_menu;
    window['DOC_MAIN'] = doc_main;
    //b_waitFor = false;
    return 0;
}

function fn_firstStart() {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n171__fn_firstStart:');
    fn_insertHTML();
    fn_addEventListener();
    b_firstStart = false;
    fn_reloadRessis_baueSchiffe_reloadRessis({
        counter: 1
    });

}

function fn_insertHTML() {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n179__fn_insertHTML:');
    // insert html_stammdaten
    var o_div1 = document.createElement('div');
    o_div1.id = 'id_o_div1';
    doc_menu.body.insertBefore(o_div1, doc_menu.body.childNodes[0]);

    var o_div2 = document.createElement('div');
    o_div2.id = 'id_o_div2';
    doc_menu.body.insertBefore(o_div2, doc_menu.body.childNodes[1]);

    var o_iframe = document.createElement('iframe');
    o_iframe.id = 'id_o_iframe';
    o_iframe.width = '50';
    o_iframe.height = '50';
    o_iframe.src = url_raumschiffswerft;
    doc_menu.getElementById('id_o_div1').appendChild(o_iframe);

    function iFrameDOMContentLoaded() {
        console.debug('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n233\n##############_DOMContentLoaded_iFrame_##############' + '\n' + iframe.contentWindow.document.location.href);
    }

    // insert tabellen + buttons
    $('#id_o_div2', doc_menu)[0].innerHTML = '\
        <table width="150"> \
            <tr> \
                <iframe id="id_o_iframe" width="150" height="50" src=""></iframe> \
            </tr> \
        </table> \
        <table width="150"> \
            <tr> \
                <td>algo:</td> \
                <td id="algo">....</td> \
            </tr> \
        </table> \
        <table> \
            <tr> \
                <td width="55">Evos</td> \
                <td width="10"><input type="text" name="fmenge[217]" id="217" alt="Evolution Transporter" size="5" maxlength="5" value="30" tabindex="1"></td> \
                <td width="50" id="evos_vorhanden"></td> \
            </tr> \
            <tr> \
                <td>Sol.Sats</td> \
                <td><input type="text" name="fmenge[212]" id="212" alt="Solarsatellit" size="5" maxlength="10" value="3000" tabindex="2"></td> \
                <td id="solarsatelliten_vorhanden"></td> \
            </tr> \
            <tr> \
                <td>Recycler</td> \
                <td><input type="text" name="fmenge[209]" id="209" alt="Recycler" size="5" maxlength="10" value="1" tabindex="3"></td> \
                <td id="recycler_vorhanden"></td> \
            </tr> \
            <tr> \
                <td>Todesstern</td> \
                <td><input type="text" name="fmenge[214]" id="214" alt="Todesstern" size="5" maxlength="10" value="1" tabindex="4"></td> \
                <td id="todessterne_vorhanden"></td> \
            </tr> \
            <tr> \
                <td><input type="button" id="leer" value="leer"></input></td> \
                <td><input type="button" id="clear" value="cls"></input></td> \
            </tr> \
            <tr> \
                <td><input type="button" id="baue" value="baue"></input></td> \
                <td><input type="button" id="ermittle_benoetigte_schiffe" value="get"></input></td> \
            </tr> \
        </table> \
        <table> \
            <tr> \
                <td> \
                    <input style="width: 15px;" value="&lt;" type="button" id="planetwechsel_davor"></input> \
                </td> \
                <td id="planetenliste"> \
                    <select id="pselector_auswahl" size="1"> \
                    </select> \
                </td> \
                <td> \
                    <input style="width: 15px;" value="&gt;" type="button" id="planetwechsel_danach"></input> \
                </td> \
                <td> \
                    <!-- <input style="width: 20px" type="text" id="reloadTime_verbleibend" maxlength="3" size="3" value="30"></input> --> \
                    <r id=reloadTime_verbleibend>30</r> \
                    / \
                    <input style="width: 20px" type="text" id="reloadTime" maxlength="3" size="3" value="30"></input> \
                </td> \
            </tr> \
        <table> \
        </table> \
            <tr> \
                <td> \
                    <input type="checkbox" id="saveRessis">saveRessis</input> \
                    <input type="checkbox" id="reloadMainframe">reloadMainframe</input> \
                <td> \
                <td> \
                    <input type="checkbox" id="saveAllRessis">saveAllRessis</input> \
                    <input type="checkbox" id="leer2">...</input> \
                <td> \
            <tr> \
        </table> \
    ';

    // insert Planetenliste
    pselector_main = $('#pselector', doc_main)[0];
    var sHTML_planeten = pselector_main.innerHTML;
    sHTML_planeten = sHTML_planeten.replace(/">.*?\[/g, '">');
    sHTML_planeten = sHTML_planeten.replace(/\]/g, '');
    sHTML_planeten = sHTML_planeten.replace(/&nbsp;/g, '');
    $('#planetenliste', doc_menu)[0].children[0].innerHTML = sHTML_planeten;
    i_wait = false;
    return 0;
}

function fn_addEventListener() {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n284__fn_addEventListener: ' + ' |  url:  ' + document.location.href);
    $('#clear', doc_menu).bind('click', function() {
        console.info('clicked: clear');
        fn_clearInput();
    });
    $('#leer', doc_menu).bind('click', function() {
        console.info('clicked: leer');
    });
    $('#ermittle_benoetigte_schiffe', doc_menu).bind('click', function() {
        console.info('clicked: ermittle_benoetigte_schiffe');
        fn_reloadRessis();
    });
    $('#baue', doc_menu).bind('click', function() {
        console.info('clicked: baue');
        fn_baueSchiffe(false);
    });
 
    $('#planetwechsel_davor', doc_menu).bind('click', function() {
        console.info('clicked: planetwechsel_davor');
        fn_planetwechsel('davor');
    });
    $('#planetwechsel_danach', doc_menu).bind('click', function() {
        console.info('clicked: planetwechsel_danach');
        fn_planetwechsel('danach');
    });
    $('#pselector_auswahl', doc_menu).on('change', function() {
        console.info('changed: planetwechsel_auswahl');
        fn_planetwechsel('auswahl');
    });
 
    $('#saveRessis', doc_menu).bind('change', function() {
        console.info('clicked: checkbox_saveRessis -> ' + $('#saveRessis', doc_menu)[0].checked);
        fn_get_aktuellen_planet();
        fn_get_ausgewaehlten_planet();
        console.error( '##########################################################################################' );
        console.error( '##########################################################################################' );
        console.error( '##########################################################################################' );
        console.error( 'start_galaxy: ' + start_galaxy );
        console.error( 'ziel_galaxy: ' + ziel_galaxy );
        console.error( 'start: ' + start_galaxy + ':' + start_system + ':' + start_planet );
        console.error( 'ziel: ' + ziel_galaxy + ':' + ziel_system + ':' + ziel_planet );
        
        
    });
 
    $('#reloadMainframe', doc_menu).bind('click', function() {
        console.info('clicked: reloadMainframe');
        fn_reloadMainframe();
    });
 
    ausgewaehlte_planetenID = $('#pselector_auswahl', doc_menu)[0].selectedIndex;
    ziel_koordinaten = $('#pselector_auswahl', doc_menu)[0].options[ausgewaehlte_planetenID].innerHTML;
}
 
function fn_reloadRessis_baueSchiffe_reloadRessis(o) {
    if (b_waitFor === false) {
        console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n304__fn_set_global_vars:' + o.counter + ' / ' + o.counter_davor + '  |  ' + b_waitFor);
        clearTimeout(o.i_timeout);
        o.counter_davor = o.counter;
        switch (o.counter) {
            case 1:
                b_waitFor = true;
                o.counter = parseInt(o.counter) + 1;
                console.error('fn_1: ' + o.counter_davor + ' / ' + o.counter + '  |  ' + b_waitFor);
                fn_getHTML({
                    url: url_raumschiffswerft,
                    callback: fn_get_rohstoffe_schiffe
                });
                break;
            case 2:
                b_waitFor = true;
                o.counter = 'ende';
                console.error('fn_2: ' + o.counter_davor + ' / ' + o.counter + '  |  ' + b_waitFor);
                if (anzahl_evos_noch_bauen > 0) {
                    fn_postHTML({
                        url: url_raumschiffswerft,
                        callback: fn_baueSchiffe
                    });
                } else {
                    b_waitFor = false;
                    return 0;
                }
                break;
            case 'ende':
                console.error('ende: ' + o.counter_davor + ' / ' + o.counter + '  |  ' + b_waitFor);
                b_waitFor = false;
                clearTimeout(o.i_timeout);
                return 0;
                break;
        }
    }
    if (b_waitFor === true) {
        o.i_timeout = setTimeout(function() {
            fn_reloadRessis_baueSchiffe_reloadRessis(o);
        }, 50);
    } else {
        fn_reloadRessis_baueSchiffe_reloadRessis(o);
    }
}
 
function fn_aktualisiere_und_baue_schiffe() {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n343__fn_aktualisiere_und_baue_schiffe:')
    fn_getHTML({
        url: url_raumschiffswerft,
        anzahl: 4,
        0: fn_get_rohstoffe_schiffe,
        1: fn_baueSchiffe,
        2: fn_postHTML,
        3: fn_get_rohstoffe_schiffe
    });
}
 
function fn_get_rohstoffe_schiffe(o) {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n348__fn_get_rohstoffe_schiffe: ' + o.mode)
    var dom = o.dom;
    var mode = o.mode;
    window['O'] = o;
 
    window['DOM'] = dom;
    algo = dom.body.innerHTML.match(/<input type="hidden" value="(.*?)" name="algo"/) // globale Variable, da sonst von der Funktion
    window['ALGO'] = algo;
    if (typeof(algo) === 'object') {
        window['ALGO_438'] = algo;
        if (algo.length === 2) {
            algo = algo[1];
        }
    } else if (typeof(algo) === 'string') {
        window['ALGO_436'] = algo;
    }
 
    if (dom.body.innerHTML.match(/errormessage/) === 1) {
        console.error('errormessage');
        setTimeout(function() {
            fn_get_rohstoffe_schiffe(o);
        }, 150);
        return 0;
    }
 
    window['ALGO_nachher'] = algo;
 
    aktuelle_planetenID = dom.getElementById('pselector').selectedIndex;
 
    met_vorhanden = parseInt(dom.getElementById('met').innerText.replace(/\./g, '').match(/(\d+)/)[1]);
    kris_vorhanden = parseInt(dom.getElementById('cry').innerText.replace(/\./g, '').match(/(\d+)/)[1]);
    deut_vorhanden = parseInt(dom.getElementById('deut_rechner').innerText.replace(/\./g, '').match(/(\d+)/)[1]);
    ress_gesamt = parseInt(met_vorhanden + kris_vorhanden + deut_vorhanden);
 
    met_vorhanden_MIO = parseInt(met_vorhanden / 1000000);
    kris_vorhanden_MIO = parseInt(kris_vorhanden / 1000000);
    deut_vorhanden_MIO = parseInt(deut_vorhanden / 1000000);
    ress_gesamt_MIO = parseInt(ress_gesamt / 1000000);
 
    met_vorhanden_MRD = parseInt(met_vorhanden_MIO / 1000);
    kris_vorhanden_MRD = parseInt(kris_vorhanden_MIO / 1000);
    deut_vorhanden_MRD = parseInt(deut_vorhanden_MIO / 1000);
    ress_gesamt_MRD = parseInt(ress_gesamt_MIO / 1000);
 
    rohstoffspeed = parseInt( $('td:contains("Rohstoffspeed")', doc_menu)[0].parentElement.children[1].innerHTML.match(/\d+/)[0] )
    anzahl_evos_benoetigt = parseInt(ress_gesamt / 400000000 + 2);
    
 
    anzahl_solarsatelliten_benoetigt = 3000;
    anzahl_todessterne_benoetigt = 1;
    anzahl_recycler_benoetigt = 1;
 
    anzahl_recycler_vorhanden = 0;
    anzahl_evos_vorhanden = 0;
    anzahl_todessterne_vorhanden = 0;
    anzahl_solarsatelliten_vorhanden = 0;
 
    anzahl_recycler_noch_bauen = 0;
    anzahl_evos_noch_bauen = 0;
    anzahl_todessterne_noch_bauen = 0;
    anzahl_solarsatelliten_noch_bauen = 0;
 
    var TDs = dom.querySelectorAll('td');
    for (var i = 0; i < TDs.length; i++) {
        if (TDs[i].innerHTML.match('form action')) {} else {
            var anzahl_tmp = TDs[i].innerHTML.replace(/\./g, '').match(/\(Anzahl: (\d+)\)/);
            if (anzahl_tmp !== null) {
                var anzahl_vorhanden = parseInt(anzahl_tmp[1]);
                if (TDs[i].innerHTML.match('209')) {
                    anzahl_recycler_vorhanden = anzahl_vorhanden;
                }
                if (TDs[i].innerHTML.match('217')) {
                    anzahl_evos_vorhanden = anzahl_vorhanden;
                }
                if (TDs[i].innerHTML.match('214')) {
                    anzahl_todessterne_vorhanden = anzahl_vorhanden;
                }
                if (TDs[i].innerHTML.match('212')) {
                    anzahl_solarsatelliten_vorhanden = anzahl_vorhanden;
                }
            }
        }
    }
 
    if (anzahl_recycler_vorhanden < anzahl_recycler_benoetigt) {
        if (anzahl_recycler_vorhanden === 0) {}
        anzahl_recycler_noch_bauen = anzahl_recycler_benoetigt - anzahl_recycler_vorhanden;
    }
    if (anzahl_evos_vorhanden < anzahl_evos_benoetigt) {
        anzahl_evos_noch_bauen = anzahl_evos_benoetigt - anzahl_evos_vorhanden;
    }
    if (anzahl_todessterne_vorhanden < anzahl_todessterne_benoetigt) {
        anzahl_todessterne_noch_bauen = anzahl_todessterne_benoetigt - anzahl_todessterne_vorhanden;
    }
    if (anzahl_solarsatelliten_vorhanden < anzahl_solarsatelliten_benoetigt) {
        anzahl_solarsatelliten_noch_bauen = anzahl_solarsatelliten_benoetigt - anzahl_solarsatelliten_vorhanden;
    }
 
    window['DOC_MENU'] = doc_menu;
    console.info('algo: ' + algo);
    doc_menu.getElementById('algo').innerHTML = algo;
    doc_menu.getElementById('217').value = anzahl_evos_noch_bauen;
    doc_menu.getElementById('212').value = anzahl_solarsatelliten_noch_bauen;
    doc_menu.getElementById('209').value = anzahl_recycler_noch_bauen;
    doc_menu.getElementById('214').value = anzahl_todessterne_noch_bauen;
    doc_menu.getElementById('evos_vorhanden').innerHTML = anzahl_evos_benoetigt + ' / ' + anzahl_evos_vorhanden;
    doc_menu.getElementById('todessterne_vorhanden').innerHTML = anzahl_todessterne_vorhanden;
    doc_menu.getElementById('recycler_vorhanden').innerHTML = anzahl_recycler_vorhanden;
    doc_menu.getElementById('solarsatelliten_vorhanden').innerHTML = anzahl_solarsatelliten_vorhanden;
 
    if ($('#saveRessis', doc_menu)[0].checked === false) {
        $('#pselector_auswahl', doc_menu)[0].selectedIndex = $('#pselector', doc_main)[0].selectedIndex;
    }
 
    fn_write_table();
    b_waitFor = false;
    return 0;
}
 
function fn_baueSchiffe() {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n464__fn_baueSchiffe: ');
 
    console.info('fn_baueSchiffe__: ' + Date() + '\n' +
        'algo: ' + algo + '\n' +
        'anzahl_recycler:        ' + anzahl_recycler_noch_bauen + '\n' +
        'anzahl_solarsatelliten: ' + anzahl_solarsatelliten_noch_bauen + '\n' +
        'anzahl_todessterne:     ' + anzahl_todessterne_noch_bauen + '\n' +
        'anzahl_evos:            ' + anzahl_evos_noch_bauen
    );
 
    if (anzahl_recycler_noch_bauen > 0 || anzahl_solarsatelliten_noch_bauen > 0 || anzahl_todessterne_noch_bauen > 0 || anzahl_evos_noch_bauen > 0) {
        var url = "buildings.php?mode=fleet";
        var postData = {
            algo: algo,
            'fmenge[209]': anzahl_recycler_noch_bauen,
            'fmenge[212]': anzahl_solarsatelliten_noch_bauen,
            'fmenge[214]': anzahl_todessterne_noch_bauen,
            'fmenge[217]': anzahl_evos_noch_bauen
        };
        fn_postHTML({
            url: url,
            data: postData,
            callback: fn_reloadRessis,
            wait: true,
            name: 'fn_baueSchiffe'
        });
    }
}
 
function fn_reloadRessis() {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n488__fn_reloadRessis:');
    fn_getHTML({
        url: url_raumschiffswerft,
        callback: fn_get_rohstoffe_schiffe
    });
}
 
function fn_write_table() {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n493__fn_write_table:');
    var schiffe = {};
    var rohstoffe = {};
 
    schiffe.evos = new Schiff(anzahl_evos_noch_bauen, anzahl_evos_vorhanden, anzahl_evos_benoetigt);
    schiffe.rips = new Schiff(anzahl_todessterne_noch_bauen, anzahl_todessterne_vorhanden, anzahl_todessterne_benoetigt);
    schiffe.recs = new Schiff(anzahl_recycler_noch_bauen, anzahl_recycler_vorhanden, anzahl_recycler_benoetigt);
    schiffe.solSats = new Schiff(anzahl_solarsatelliten_noch_bauen, anzahl_solarsatelliten_vorhanden, anzahl_solarsatelliten_benoetigt);
 
    rohstoffe.met = new Rohstoff(met_vorhanden, met_vorhanden_MIO, met_vorhanden_MRD);
    rohstoffe.kris = new Rohstoff(kris_vorhanden, kris_vorhanden_MIO, kris_vorhanden_MRD);
    rohstoffe.deut = new Rohstoff(deut_vorhanden, deut_vorhanden_MIO, deut_vorhanden_MRD);
    rohstoffe.gesamt = new Rohstoff(ress_gesamt, ress_gesamt_MIO, ress_gesamt_MRD);
 
    function Schiff(nochBauen, vorhanden, benoetigt) {
        this.nochBauen = nochBauen;
        this.vorhanden = vorhanden;
        this.benoetigt = benoetigt;
    }
 
    function Rohstoff(vorhanden, vorhanden_in_MIO, vorhanden_in_MRD) {
        this.vorhanden = vorhanden;
        this.vorhanden_in_MIO = vorhanden_in_MIO;
        this.vorhanden_in_MRD = vorhanden_in_MRD;
    }
 
    console.table(rohstoffe);
    console.table(schiffe);
}
 
function getTime() {
    var time_tmp = new Date();
    var i_hours = time_tmp.getHours();
    var i_minutes = time_tmp.getMinutes();
    var i_seconds = time_tmp.getSeconds();
    var i_milliseconds = time_tmp.getMilliseconds();
 
    if (i_seconds.toString().length === 1) {
        i_seconds = '0' + i_seconds
    };
    if (i_minutes.toString().length === 1) {
        i_minutes = '0' + i_minutes
    };
    if (i_hours.toString().length === 1) {
        i_hours = '0' + i_hours
    };
    if (i_milliseconds.toString().length === 1) {
        i_milliseconds = '00' + i_milliseconds
    };
    if (i_milliseconds.toString().length === 2) {
        i_milliseconds = '0' + i_milliseconds
    };
 
    var s_time = i_hours + ':' + i_minutes + ':' + i_seconds + '.' + i_milliseconds;
    return s_time;
}
 
function fn_postHTML(o) {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n541__fn_postHTML: ' + o.url + '  |  ' + o.data)
    url = o.url;
    data = o.data;
    callback = o.callback;
    wait_bool = o.wait_bool;
    waitCode_tmp = o.waitCode_tmp;
    var o_neu = {};
    if (typeof(o.anzahl) === 'number' && o.anzahl > 1) {
        // evtl. mehrere callbacks
        callback = o[0];
        o_neu.url = o.url;
        o_neu.anzahl = o.anzahl - 1;
        for (var i = 1; i < o.anzahl; i++) {
            o_neu[i] = o[i];
        }
        console.info('559__fn_getHTML: ' + 'URL: ' + o.url + '  |  ' + 'callback: ' + callback.toString().match(/(function.*?).{/)[1]);
    } else {
        console.info('561__fn_getHTML: ' + 'URL: ' + o.url + '  |  ' + 'callback: ' + o.callback.toString().match(/(function.*?).{/)[1]);
        callback = o.callback;
    }
    window['O_NEU_POST'] = o_neu;
    var parser = new DOMParser();
    var html = $.ajax({
            method: "POST",
            url: o.url,
            data: o.data,
            cache: false,
            async: true
        })
        .done(function(returnedData) {
            var dom = parser.parseFromString(returnedData, 'text/html');
            sHTML = dom.body.innerHTML;
            window['DOM_POST'] = dom;
 
            if (wait_bool === 'wait') {
                console.info('290__ wait_bool: 500 ==>  ' + callback(dom));
                setTimeout(function() {
                    window.eval(callback({
                        dom: dom,
                        mode: 'get',
                        callback: o_neu
                    }));
                    return 0;
                }, 500);
            } else {
                console.info('296__callback...');
                window.eval(callback({
                    dom: dom,
                    mode: 'get',
                    callback: o_neu
                }));
                return 0;
            }
        });
}
 
function fn_getHTML(o) {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n590__fn_getHTML: ' + o.url)
    window['ARGUMENTS'] = arguments;
    window['CALLEE'] = arguments.callee;
    var o_neu = {};
    var callback;
    if (typeof(o.anzahl) === 'number' && o.anzahl > 1) {
        // evtl. mehrere callbacks
        callback = o[0];
        o_neu.url = o.url;
        o_neu.anzahl = o.anzahl - 1;
        for (var i = 1; i < o.anzahl; i++) {
            o_neu[i] = o[i];
        }
        console.info('606__fn_getHTML: ' + 'URL: ' + o.url + '  |  ' + 'callback: ' + callback.toString().match(/(function.*?).{/)[1]);
    } else {
        console.info('608__fn_getHTML: ' + 'URL: ' + o.url + '  |  ' + 'callback: ' + o.callback.toString().match(/(function.*?).{/)[1]);
        callback = o.callback;
    }
    var parser = new DOMParser();
    var html = $.ajax({
            type: 'GET',
            url: o.url,
            cache: false,
            async: true
        })
        .done(function(returnedData) {
            dom = parser.parseFromString(returnedData, 'text/html');
            sHTML = dom.body.innerHTML;
            window['DOM_GET'] = dom;
            window.eval(callback({
                dom: dom,
                mode: 'get',
                callback: o_neu
            }));
            return 0;
        });
}
 
function fn_reloadMainframe(url, i_reloadMainframe) {
    reloadTime = parseInt($('#reloadTime', doc_menu)[0].value);
    if (typeof(i_reloadMainframe) === 'undefined') {
        console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n625__fn_reloadMainframe: ' + url + '  |  ' + i_reloadMainframe);
        time_until_reload = reloadTime;
    }
 
    if ($('#reloadMainframe', doc_menu)[0].checked === true) {
        var url = doc_main.URL;
        if (typeof(i_reloadMainframe) === 'undefined') {
            time_until_reload = reloadTime;
            i_reloadMainframe = setInterval(function() {
                fn_reloadMainframe(url, i_reloadMainframe);
            }, 1000);
            return 0;
        }
        time_until_reload = time_until_reload - 1;
        if (time_until_reload < 10) {
            $('#reloadTime_verbleibend', doc_menu)[0].innerHTML = '&nbsp;&nbsp;' + time_until_reload;
        } else {
            $('#reloadTime_verbleibend', doc_menu)[0].innerHTML = time_until_reload;
        }
 
        $('#reloadTime', doc_menu)[0].value = reloadTime;
 
        if (time_until_reload === 0) {
            time_until_reload = reloadTime;
            doc_main.location.href = url;
        }
        return 0;
    }
}
 
function fn_planetwechsel(richtung) {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n640__fn_planetwechsel: ' + richtung + '  |  url:  ' + document.location.href + '  |  saveRessis_checked: ' + $('#saveRessis', doc_menu)[0].checked);
    pselector_dom = $('#pselector_auswahl', doc_menu)[0];
    ausgewaehlte_planetenID = $('#pselector_auswahl', doc_menu)[0].selectedIndex;
    aktuelle_planetenID = $('#pselector_auswahl', doc_menu)[0].selectedIndex;
    var planetenanzahl = pselector_dom.length;
    var url_main = doc_main.location.origin + doc_main.location.pathname;
    if (richtung === 'davor') {
        if (pselector_dom.selectedIndex > 0) {
            $('#pselector_auswahl', doc_menu)[0].selectedIndex = aktuelle_planetenID - 1;
            doc_main.location.href = url_main + pselector_dom.options[aktuelle_planetenID - 1].value;
        } else {
            alert('erste Planet!');
        }
    }
    if (richtung === 'danach') {
        if (pselector_dom.selectedIndex + 1 < planetenanzahl) {
            $('#pselector_auswahl', doc_menu)[0].options.selectedIndex = aktuelle_planetenID + 1;
            doc_main.location.href = url_main + pselector_dom.options[aktuelle_planetenID + 1].value;
        } else {
            alert('bereits der letzte Planet');
        }
    }
    if (richtung === 'auswahl') {
        var url_fleet = serverURL + "fleet.php" + doc_menu.getElementById('pselector_auswahl').selectedOptions[0].value;
        if ($('#saveRessis', doc_menu)[0].checked === false) {
            doc_main.location.href = url_main + pselector_dom.options[ausgewaehlte_planetenID].value;
        }
    }
}

function fn_get_aktuellen_planet(){
    aktuelle_planetenID = $('#pselector',doc_main)[0].selectedIndex;
    start_koords = $('#pselector', doc_main)[0].options[aktuelle_planetenID].innerHTML.match(/(\d+:\d+:\d+)/)[1];
    a_start_koords = start_koords.split(':');
    start_galaxy = a_start_koords[0];
    start_system = a_start_koords[1];
    start_planet = a_start_koords[2];
}

function fn_get_ausgewaehlten_planet(){
    ziel_koords = $('#pselector_auswahl', doc_menu)[0].options[ausgewaehlte_planetenID].innerHTML;
    a_ziel_koords = ziel_koords.split(':');
    ziel_galaxy = parseInt(a_ziel_koords[0]);
    ziel_system = a_ziel_koords[1];
    ziel_planet = a_ziel_koords[2];

    // aktuelle_galaxy = parseInt(doc_main.getElementsByName("thisgalaxy")[0].value);

    
}

function fn_flotte_auswaehlen() {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n671__fn_flotte_auswaehlen: ');
    var rohstoffe_vorhanden = fn_get_rohstoffe(doc_main);
    var evos_zu_verschicken = parseInt(rohstoffe_vorhanden / 400000000);
    var evos_vorhanden = fn_get_anzahl_evos(doc_main);
    console.warn('evos_zu_verschicken: ' + evos_zu_verschicken);
    if (evos_zu_verschicken >= 1) {
        // if( evos_vorhanden === 0 ){
        if (evos_vorhanden < evos_zu_verschicken) {
            console.warn('evos_vorhanden < evos_zu_verschicken: ' + evos_vorhanden + ' | ' + evos_zu_verschicken);
            doc_main.location.href = url_fleet;
            return 1;
        } else {
            if (top.frames.length === 2) {
                top.frames[1].eval("javascript:maxShip('ship217'); ");
            } else {
                window.eval("javascript:maxShip('ship217'); ");
            }
            $(':submit[value=" Weiter "]', doc_main).click();
            return 0;
        }
    }
}
 
function fn_flotte_koordinaten_eingeben() {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n692__fn_flotte_koordinaten_eingeben: ');
    var start_koords = $('#pselector', doc_main)[0].options[aktuelle_planetenID].innerHTML.match(/(\d+:\d+:\d+)/)[1];
    var a_start_koords = start_koords.split(':');
    var start_galaxy = a_start_koords[0];
    var start_system = a_start_koords[1];
    var start_planet = a_start_koords[2];
 
    var ziel_koords = $('#pselector_auswahl', doc_menu)[0].options[ausgewaehlte_planetenID].innerHTML;
    var a_ziel_koords = ziel_koords.split(':');
    var ziel_galaxy = parseInt(a_ziel_koords[0]);
    var ziel_system = a_ziel_koords[1];
    var ziel_planet = a_ziel_koords[2];
 
    console.info('start: ' + start_koords);
    console.info('ziel: ' + ziel_koords);
    console.log(' g -> ' + ziel_galaxy);
 
    $(':input[name=galaxy]', doc_main)[0].value = ziel_galaxy;
    $(':input[name=system]', doc_main)[0].value = ziel_system;
    $(':input[name=planet]', doc_main)[0].value = ziel_planet;
    $(':input[name=planettype]', doc_main)[0].value = 1;
 
    var aktuelle_galaxy = parseInt(doc_main.getElementsByName("thisgalaxy")[0].value);
 
    switch (ziel_galaxy) {
        case 1:
            if (aktuelle_galaxy === 2) {
                doc_main.getElementsByName("speed")[0].value = 4;
            } // -> 20%  30:33
            if (aktuelle_galaxy === 3) {
                doc_main.getElementsByName("speed")[0].value = 6;
            } // -> 40%  28:49
            if (aktuelle_galaxy === 4) {
                doc_main.getElementsByName("speed")[0].value = 7;
            } // -> 50%  30:15
            if (aktuelle_galaxy === 5) {
                doc_main.getElementsByName("speed")[0].value = 8;
            } // -> 60%  30:33
            if (aktuelle_galaxy === 6) {
                doc_main.getElementsByName("speed")[0].value = 9;
            } // -> 70%  30:22
            if (aktuelle_galaxy === 7) {
                doc_main.getElementsByName("speed")[0].value = 10;
            } // -> 80% 29:56
            if (aktuelle_galaxy === 8) {
                doc_main.getElementsByName("speed")[0].value = 11;
            } // -> 90% 29:24
            if (aktuelle_galaxy === 9) {
                doc_main.getElementsByName("speed")[0].value = 12;
            } //-> 100% 28:49
            break;
        case 2:
            if (aktuelle_galaxy === 1) {
                doc_main.getElementsByName("speed")[0].value = 4;
            } // -> 30%  24:27
            if (aktuelle_galaxy === 3) {
                doc_main.getElementsByName("speed")[0].value = 6;
            } // -> 30%  24:27
            if (aktuelle_galaxy === 4) {
                doc_main.getElementsByName("speed")[0].value = 7;
            } // -> 50%  24:42
            if (aktuelle_galaxy === 5) {
                doc_main.getElementsByName("speed")[0].value = 8;
            } // -> 60%  26:28
            if (aktuelle_galaxy === 6) {
                doc_main.getElementsByName("speed")[0].value = 9;
            } // -> 70%  27:10
            if (aktuelle_galaxy === 7) {
                doc_main.getElementsByName("speed")[0].value = 10;
            } // -> 80% 27:20
            if (aktuelle_galaxy === 8) {
                doc_main.getElementsByName("speed")[0].value = 11;
            } // -> 90% 27:13
            if (aktuelle_galaxy === 9) {
                doc_main.getElementsByName("speed")[0].value = 12;
            } //-> 100% 26:57
            break;
        case 3:
            if (aktuelle_galaxy === 1) {
                doc_main.getElementsByName("speed")[0].value = 7;
            } // -> 50%  24:42
            if (aktuelle_galaxy === 2) {
                doc_main.getElementsByName("speed")[0].value = 6;
            } // -> 30%  24:27
            if (aktuelle_galaxy === 4) {
                doc_main.getElementsByName("speed")[0].value = 6;
            } // -> 30%  24:27
            if (aktuelle_galaxy === 5) {
                doc_main.getElementsByName("speed")[0].value = 7;
            } // -> 50%  24:42
            if (aktuelle_galaxy === 6) {
                doc_main.getElementsByName("speed")[0].value = 9;
            } // -> 70%  23:32
            if (aktuelle_galaxy === 7) {
                doc_main.getElementsByName("speed")[0].value = 10;
            } // -> 80% 24:27
            if (aktuelle_galaxy === 8) {
                doc_main.getElementsByName("speed")[0].value = 11;
            } // -> 90% 24:51
            if (aktuelle_galaxy === 9) {
                doc_main.getElementsByName("speed")[0].value = 12;
            } //-> 100% 24:57
            break;
        case 4:
            if (aktuelle_galaxy === 1) {
                doc_main.getElementsByName("speed")[0].value = 7;
            } // -> 80%  21:11
            if (aktuelle_galaxy === 2) {
                doc_main.getElementsByName("speed")[0].value = 6;
            } // -> 60%  21:37
            if (aktuelle_galaxy === 3) {
                doc_main.getElementsByName("speed")[0].value = 6;
            } // -> 40%  20:23
            if (aktuelle_galaxy === 4) {
                doc_main.getElementsByName("speed")[0].value = 6;
            } // -> 30%  22:57
            if (aktuelle_galaxy === 5) {
                doc_main.getElementsByName("speed")[0].value = 7;
            } // -> 40%  20:23
            if (aktuelle_galaxy === 6) {
                doc_main.getElementsByName("speed")[0].value = 9;
            } // -> 60%  21:37
            if (aktuelle_galaxy === 7) {
                doc_main.getElementsByName("speed")[0].value = 10;
            } // -> 80% 21:11
            if (aktuelle_galaxy === 8) {
                doc_main.getElementsByName("speed")[0].value = 11;
            } // -> 90% 22:14
            if (aktuelle_galaxy === 9) {
                doc_main.getElementsByName("speed")[0].value = 12;
            } //-> 100% 22:47
            break;
        case 5:
            console.info('speed: ' + doc_main.getElementsByName("speed")[0].value);
            if (aktuelle_galaxy === 1 || aktuelle_galaxy === 9) {
                doc_main.getElementsByName("speed")[0].value = 12;
            } // -> 100%
            if (aktuelle_galaxy === 2 || aktuelle_galaxy === 8) {
                doc_main.getElementsByName("speed")[0].value = 11;
            } // -> 90%
            if (aktuelle_galaxy === 3 || aktuelle_galaxy === 7) {
                doc_main.getElementsByName("speed")[0].value = 9;
            } // -> 70%
            if (aktuelle_galaxy === 4 || aktuelle_galaxy === 6) {
                doc_main.getElementsByName("speed")[0].value = 6;
            } // -> 40%
            if (aktuelle_galaxy === 5) {
                doc_main.getElementsByName("speed")[0].value = 5;
            } // -> 30%
            break;
 
    }
 
    if (start_koords !== ziel_koords) {
        // $(':input[value="Weiter"]', doc_main)[0].click();
    } else {
        $('#saveRessis', doc_menu)[0].checked = false;
        doc_main.location.href = url_fleet;
    }
    return 0;
}
 
function fn_flotte_rohstoffe_eingeben() {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n734__fn_flotte_rohstoffe_eingeben: ');
    var met_vorhanden = parseInt($('#met', doc_main)[0].innerText.replace(/\./g, ''));
    var kris_vorhanden = parseInt($('#cry', doc_main)[0].innerText.replace(/\./g, ''));
    var deut_vorhanden = parseInt($('#deut_rechner', doc_main)[0].innerText.replace(/\./g, ''));
 
    $('a', doc_main)[3].click();
    $('a', doc_main)[2].click();
    $('a', doc_main)[1].click();
 
    var missionsID = $(':input[id=inpuT_1]', frames[1].document)[0].value;
    var mission = missionsID;
    if (missionsID === 4) {
        mission = 'stationieren';
    }
 
    var met_verschicken = $(':input[name=thisresource1]', frames[1].document)[0].value;
    var kris_verschicken = $(':input[name=thisresource2]', frames[1].document)[0].value;
    var deut_verschicken = $(':input[name=thisresource3]', frames[1].document)[0].value;
 
    var planettypeID_start = $(':input[name=thisplanettype]', frames[1].document)[0].value;
    var planettypeID_ziel = $(':input[name=planettype]', frames[1].document)[0].value;
 
    var planettype_start;
    var planettype_ziel;
    if (planettypeID_start === '1') {
        planettype_start = 'P';
    } else {
        planettype_start = 'M';
    }
    if (planettypeID_ziel === '1') {
        planettype_ziel = 'P';
    } else {
        planettype_ziel = 'M';
    }
 
    var koordinaten_start = $(':input[name=thisgalaxy]', frames[1].document)[0].value + ':' +
        $(':input[name=thissystem]', frames[1].document)[0].value + ':' +
        $(':input[name=thisplanet]', frames[1].document)[0].value + '_' +
        planettype_start;
 
    var koordinaten_ziel = $(':input[name=galaxy]', frames[1].document)[0].value + ':' +
        $(':input[name=system]', frames[1].document)[0].value + ':' +
        $(':input[name=planet]', frames[1].document)[0].value + '_' +
        planettype_ziel;
 
    console.debug('flotte verschicken:' + '  |  ' + 'mission: ' + mission + '\n' +
        'vorhanden: ' + met_vorhanden + '  |  ' + kris_vorhanden + '  |  ' + deut_vorhanden + '\n' +
        'verschicken: ' + met_verschicken + '  |  ' + kris_verschicken + '  |  ' + deut_verschicken + '\n' +
        'Start: ' + koordinaten_start + '  ==>  ' + koordinaten_ziel
    );
    $(':input[value="4"]', doc_main).click(); // statio
    return 0;
}
 
function fn_get_rohstoffe(doc_main) {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n779__fn_get_rohstoffe: ');
    var met = parseInt($('#met', doc_main)[0].innerText.replace(/\./g, ''));
    var kris = parseInt($('#cry', doc_main)[0].innerText.replace(/\./g, ''));
    var deut = parseInt($('#deut_rechner', doc_main)[0].innerText.replace(/\./g, ''));
    var gesamt = met + kris + deut;
    return gesamt;
}
 
function fn_get_anzahl_evos(doc_main) {
    console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n789__fn_get_anzahl_evos: ');
    if ($(':input[name=ship217]', doc_main).length === 1) {
        var evos_vorhanden = parseInt($(':input[name=ship217]', doc_main)[0].parentElement.previousSibling.previousSibling.innerHTML.replace(/\./g, ''));
        return evos_vorhanden;
    } else {
        return parseInt(0);
    }
}