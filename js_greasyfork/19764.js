// ==UserScript==
// @name         baueSchiffe_saveRessis_handy_v0.7
// @namespace    http://tampermonkey.net/
// @version      0.1
// @datetime     16.05.2016 08:27
// @description  try to take over the world!
// @author       S.K.
// @match        http://*.xorbit.de/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

var b_btn_baueSchiffe_clicked = false;
var b_debug = false;


var win_menu = top.window;
var win_main = top.window;
var doc_menu = top.window.document;
var doc_main = top.window.document;

var b_firstStart = true;
var b_firstStart_saveAllRessis = true;
var aktuellerPlanetenindex = 0;
var b_waitFor = false;
var i_reloadMainframe = -1;
var time_until_reload = 30;
var i_index_aktuellerPlanet = -1;
var a_planeten_ressis_gesichert = [];

var i_uni = parseInt( top.window.location.href.match(/uni(\d)/)[1] );
var serverURL = 'http://uni' + i_uni + '.xorbit.de/';
var url_raumschiffswerft = serverURL + 'buildings.php?mode=fleet';
var url_fleet = serverURL + 'fleet.php';

var ausgewaehlte_planetenID;
var url_zum_oeffnen = 'fleet.php';

var start_koords, a_start_koords, start_galaxy, start_system, start_planet, start_planettype;
var ziel_koords, a_ziel_koords, ziel_galaxy, ziel_system, ziel_planet, ziel_planettype;
var aktuelle_galaxy, ziel_galaxy;

var met_vorhanden = -1;
var kris_vorhanden = -1;
var deut_vorhanden = -1;
var ress_gesamt = -1;

var met_vorhanden_MIO = -1;
var kris_vorhanden_MIO = -1;
var deut_vorhanden_MIO = -1;
var ress_gesamt_MIO = -1;

var met_vorhanden_MRD = -1;
var kris_vorhanden_MRD = -1;
var deut_vorhanden_MRD = -1;
var ress_gesamt_MRD = -1;

var anzahl_evos_benoetigt = -1;
var anzahl_gTr_benoetigt = -1;

var anzahl_solSats_benoetigt = '';
var anzahl_rips_benoetigt = '';
var anzahl_recs_benoetigt = '';

var anzahl_recs_vorhanden = -1;
var anzahl_gTr_vorhanden = -1;
var anzahl_evos_vorhanden = -1;
var anzahl_rips_vorhanden = -1;
var anzahl_solSats_vorhanden = -1;

var anzahl_recs_noch_bauen = -1;
var anzahl_gTr_noch_bauen = -1;
var anzahl_evos_noch_bauen = -1;
var anzahl_rips_noch_bauen = -1;
var anzahl_solSats_noch_bauen = -1;

var b_exit = false;
var i_reloadCounter_baueSchiffe = 0;
var algo = '';

var i_energie_pro_solSat;
if( i_uni === 2 ){
    i_energie_pro_solSat = 3000000;
} else {
    i_energie_pro_solSat = 140000;
}

if (top.window.document.location.href.match(/http:\/\/uni\d\.xorbit\.de/)) {
    if( top.window.frames.length === 2 ) {
        $(window).bind('load', function(){
            fn_framesetLoaded($(this), 'window_load');
        });
    }
}


function fn_frameLoaded(o, val) {
    fn_set_global_vars('fn_frameLoaded: ' + o[0].contentDocument.URL);
    b_exit = false;
    i_reloadCounter_baueSchiffe = 0;
    // if( b_firstStart === false ){

        console.info( '********************************************************************************************' +
                     '\n********** ' + 'fn_frameLoaded:  ' + o[0].contentDocument.URL + ' | b_firstStart: ' + b_firstStart + ' **********' +
                     '\n********************************************************************************************' );
        window['O_fn_frameLoaded'] = o;

        // if( top.window.frames.length === 2 ) {
            // if( b_firstStart === false ){
                var b_cb_baueAlle = $('#id_cb_baueAlle',doc_menu)[0].checked;
                if( b_cb_baueAlle === true ){ // min. 1 SeitenReload seit ButtonClick  ==>  i_aktuelle_PlanetenID != 0
                    // if( ! b_btn_baueSchiffe_clicked === true ){
                        b_btn_baueSchiffe_clicked = true;
                        i_index_aktuellerPlanet = $('#pselector',doc_main)[0].selectedIndex;
                        i_planetenID = $('#pselector',doc_main)[0].selectedOptions[0].innerHTML.match(/(\d+:\d+:\d+)/)[1];
                        fn_baueAlle({ checked: b_cb_baueAlle });
                    // }
                }
        // }
    // }
}

function fn_framesetLoaded(o, val) {
    
    console.info( '--------------------------------------------------------------------------------------------' +
        '\n--------- ' + 'fn_framesetLoaded: ' + o[0].document.URL + ' | b_firstStart: ' + b_firstStart + ' ---------' +
        '\n--------------------------------------------------------------------------------------------' );
    window['O_fn_framesetLoaded'] = o;

    b_firstStart = false;

    $('frame').bind('load', function(){
        fn_frameLoaded($(this), 'frame_load');
    }); // ==> beim Neuladen eines Frames

    $('a', doc_menu).click(function() {
        fn_link_clicked($(this), 'doc_menu');
    });

    $('a', doc_main).click(function() {
        fn_link_clicked($(this), 'doc_main');
    });

    fn_set_global_vars('fn_framesetLoaded: ' + document.URL);
    fn_insertHTML();
}

function fn_link_clicked(o, sourceWindow) {
    console.warn( '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n132__fn_link_clicked: ' );
    window['O_fn_link_clicked'] = o;
    var sText = '';
    if( o[0].getAttribute('href') === '#' ){
        sText = o[0].getAttribute('onclick').match(/rollower\('(.*?)'\)/)[1];
    } else {

    }
    console.log( '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n140__fn_link_clicked: ' + 'sourceWindow: ' + sourceWindow + '  |  ' + o[0].href + '  |  ' + 'text: ' + sText );
    // console.debug( "o[0].getAttribute('href'): " + o[0].getAttribute('href') + '\n' + 'o[0].href: ' + o[0].href );
}

function fn_set_global_vars(val) {
    // console.warn( '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n145__fn_set_global_vars: ' + '  |  ' + 'val: ' + val );
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
    window['WIN_fn_set_global_vars'] = window;
    window['WIN_MENU_fn_set_global_vars'] = win_menu;
    window['WIN_MAIN_fn_set_global_vars'] = win_main;

    window['DOC_fn_set_global_vars'] = document;
    window['DOC_MENU_fn_set_global_vars'] = doc_menu;
    window['DOC_MAIN_fn_set_global_vars'] = doc_main;
    return 0;
}

function fn_insertHTML() {
    // console.warn( '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n168__fn_insertHTML:' );
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
    // o_iframe.src = url_raumschiffswerft;
    doc_menu.getElementById('id_o_div1').appendChild(o_iframe);

    function iFrameDOMContentLoaded() {
        console.debug( '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n233\n##############_DOMContentLoaded_iFrame_##############' + '\n' + iframe.contentWindow.document.location.href );
    }

    $('#id_o_div2', doc_menu)[0].innerHTML = '\
        <table width="100"> \
            <tr> \
                <iframe id="id_o_iframe" width="100" height="50" src=""></iframe> \
            </tr> \
        </table> \
        <table> \
            <tr> \
                <td>algo:</td> \
                <td id="algo">....</td> \
            </tr> \
        </table> \
        <table> \
            <tr> \
                <td>Evos</td> \
                <td><input type="text" name="fmenge[217]" id="id_evos_noch_bauen" alt="Evolution Transporter" size="5" maxlength="5" value="30" tabindex="1"></td> \
                <td id="id_evos_benoetigt">00</td> \
                <td id="id_evos_vorhanden">XXXX</td> \
            </tr> \
            <tr> \
                <td>Sol.Sats</td> \
                <td><input type="text" name="fmenge[212]" id="id_solSats_noch_bauen" alt="Solarsatellit" size="5" maxlength="10" value="1000" tabindex="2"></td> \
                <td id="id_solSats_benoetigt">0000</td> \
                <td id="id_solSats_vorhanden">XXXX</td> \
            </tr> \
            <tr> \
                <td>Recs</td> \
                <td><input type="text" name="fmenge[209]" id="id_recs_noch_bauen" alt="Recycler" size="5" maxlength="5" value="1" tabindex="1"></td> \
                <td id="id_recs_benoetigt">0000</td> \
                <td id="id_recs_vorhanden">XXXX</td> \
            </tr> \
            <tr> \
                <td>Rips</td> \
                <td><input type="text" name="fmenge[214]" id="id_rips_noch_bauen" alt="Todesstern" size="5" maxlength="5" value="1" tabindex="1"></td> \
                <td id="id_rips_benoetigt">0000</td> \
                <td id="id_rips_vorhanden">XXXX</td> \
            </tr> \
            <tr> \
                <td><input type="button" id="id_btn_leer" value="leer"></input></td> \
                <td><input type="button" id="id_btn_clear" value="clear"></input></td> \
                <td><input type="button" id="id_btn_get" value="get"></input></td> \
                <td><input type="button" id="id_btn_baue" value="baue"></input></td> \
            </tr> \
        </table> \
        <table> \
            <tr> \
                <td> \
                    <input style="width: 15px;" value="&lt;" type="button" id="id_planetwechsel_davor"></input> \
                </td> \
                <td id="id_planetenliste"> \
                    <select id="id_pselector_auswahl" size="1"> \
                    </select> \
                </td> \
                <td> \
                    <input style="width: 15px;" value="&gt;" type="button" id="id_planetwechsel_danach"></input> \
                </td> \
                <td> \
                    <text id="id_reloadTime_verbleibend">  30</text> \
                    / \
                    <input type="text" id="id_reloadTime" maxlength="3" size="3" value="30"></input> \
                </td> \
            </tr> \
        </table> \
            <tr> \
                <td> \
                    <input type="checkbox" id="id_cb_saveRessis">saveRessis</input> \
                    <input type="checkbox" id="id_cb_reloadMainframe">reloadMainframe</input> \
                <td> \
                <td> \
                    <input type="checkbox" id="id_cb_saveAllRessis">saveAllRessis</input> \
                    <input type="checkbox" id="id_cb_baueAlle">baueAlle</input> \
                <td> \
            <tr> \
        </table> \
    ';

    // insert Planetenliste
    pselector_main = $('#pselector', doc_main)[0];
    window['Pselector_main'] = pselector_main;
    var sHTML_planetenliste_ohnePlanetname = pselector_main.innerHTML;
    sHTML_planetenliste_ohnePlanetname = sHTML_planetenliste_ohnePlanetname.replace(/">.*?\[/g, '">');
    sHTML_planetenliste_ohnePlanetname = sHTML_planetenliste_ohnePlanetname.replace(/\]/g, '');
    sHTML_planetenliste_ohnePlanetname = sHTML_planetenliste_ohnePlanetname.replace(/&nbsp;/g, '');
    $('#id_planetenliste', doc_menu)[0].children[0].innerHTML = sHTML_planetenliste_ohnePlanetname;
    // console.warn( 'planetenliste: ' + sHTML_planetenliste_ohnePlanetname );

    fn_addEventListener();
}

function fn_addEventListener() {
    // console.warn( '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n273__fn_addEventListener: ' + ' |  url:  ' + document.location.href );
    $('#id_btn_clear', doc_menu).bind('click', function() {
        // console.warn( '############### clicked: clear ###############' );
        fn_clearInput();
    });
    $('#id_btn_leer', doc_menu).bind('click', function() {
        // console.warn( '############### clicked: leer ###############' );
    });
    $('#id_btn_ermittle_benoetigte_schiffe', doc_menu).bind('click', function() {
        // console.warn( '############### clicked: ermittle_benoetigte_schiffe ###############' );
        fn_reloadRessis({ dom: doc_main });
    });
    $('#id_btn_baue', doc_menu).bind('click', function() {
        // console.warn( '############### clicked: baue ###############' );
        b_btn_baueSchiffe_clicked = false;
        // fn_baueSchiffe({ callback: 'fn_pruefeSchiffe', type: 'clicked_btn_baue' });
        fn_baueSchiffe({ callback: 'fn_pruefeSchiffe({ type: "clicked_btn_baue", dom: doc_main })' });
    });

    $('#id_cb_saveAllRessis', doc_menu).bind('click', function() {
        // console.warn( '############### clicked: saveAllRessis ###############' );
        var url_raumschiffswerft_benoetigterPlanet = url_raumschiffswerft + $('#pselector', doc_main)[0].options[0].value.replace('?','&');
        fn_getHTML({ url: url_raumschiffswerft_benoetigterPlanet, i_callback: 1, callback: 'fn_saveAllRessis' });
    });

    $('#id_cb_baueAlle', doc_menu).bind('click', function() {
        console.warn( '############### clicked: baueAlle ###############' );
        fn_baueAlle({ checked: $(this)[0].checked });
    });

    $('#id_btn_planetwechsel_davor', doc_menu).bind('click', function() {
        // console.warn( '############### clicked: planetwechsel_davor ###############' );
        fn_planetwechsel('davor');
    });
    $('#id_btn_planetwechsel_danach', doc_menu).bind('click', function() {
        // console.warn( '############### clicked: planetwechsel_danach ###############' );
        fn_planetwechsel('danach');
    });
    $('#id_sel_pselector_auswahl', doc_menu).on('change', function() {
        // console.warn( 'changed: planetwechsel_auswahl ###############' );
        fn_planetwechsel('auswahl');
    });

    $('#id_cb_saveRessis', doc_menu).bind('change', function() {
        // console.warn( '############### clicked: checkbox_saveRessis -> ' + $('#saveRessis', doc_menu)[0].checked );
        fn_get_aktuellen_planet();
        fn_get_ausgewaehlten_planet();
        // console.error( '########################################################################################## ###############' );
        // console.error( '########################################################################################## ###############' );
        // console.error( '########################################################################################## ###############' );
        // console.error( 'start_galaxy: ' + start_galaxy );
        // console.error( 'ziel_galaxy: ' + ziel_galaxy );
        // console.error( 'start: ' + start_galaxy + ':' + start_system + ':' + start_planet );
        // console.error( 'ziel: ' + ziel_galaxy + ':' + ziel_system + ':' + ziel_planet );
    });

    $('#id_cb_reloadMainframe', doc_menu).bind('click', function() {
        console.warn( '############### clicked: reloadMainframe ' + '  |  ' + 'checked: ' + $('#id_cb_reloadMainframe', doc_menu)[0].checked + ' ###############' );
        fn_reloadMainframe();
    });
}

function fn_write_table() {
    // console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n493__fn_write_table:');
    var schiffe = {};
    var rohstoffe = {};

    schiffe.gTr = new Schiff(anzahl_gTr_noch_bauen, anzahl_gTr_vorhanden, anzahl_gTr_benoetigt);
    schiffe.evos = new Schiff(anzahl_evos_noch_bauen, anzahl_evos_vorhanden, anzahl_evos_benoetigt);
    schiffe.rips = new Schiff(anzahl_rips_noch_bauen, anzahl_rips_vorhanden, anzahl_rips_benoetigt);
    schiffe.recs = new Schiff(anzahl_recs_noch_bauen, anzahl_recs_vorhanden, anzahl_recs_benoetigt);
    schiffe.solSats = new Schiff(anzahl_solSats_noch_bauen, anzahl_solSats_vorhanden, anzahl_solSats_benoetigt);

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

function fn_postHTML(o) {
    console.warn( '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n383__fn_postHTML: ' + o.url + '  |  ' + 'callback: ' + o.callback.toString() );
    window['O_fn_postHTML'] = o;
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
    } else {
        callback = o.callback;
    }
    window['O_neu_fn_postHTML'] = o_neu;
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
            window['Dom_fn_postHTML'] = dom;

            if (wait_bool === 'wait') {
                console.debug( '417__fn_postHTML: ' + 'wait_bool: ' + wait_bool );
                setTimeout(function() {
                    window.eval(callback({
                        dom: dom,
                        mode: 'get',
                        callback: "'" + o_neu + "'"
                    }));
                    return 0;
                }, 500);
            } else {
                window['O_fn_postHTML'] = o;
                console.warn( '426__fn_postHTML: ' + 'callback: ' + o.callback.toString() );
                fn_getHTML({ i_callback: 1, callback: o.callback, dom: dom, mode: 'get', url: o.url });
                return 0;
            }
        });
}

function fn_getHTML(o) {
    // if( b_debug === true ){ return 0; }
    b_debug = true;
    window['O_fn_getHTML'] = o;
    console.warn( '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n437__fn_getHTML: ' + o.url + '  |  ' + 'callback: ' + o.callback.toString() + '  |  ' + 'b_exit: ' + b_exit + '  |  ' + 'i_callback: ' + i_callback );
    window['Arguments_fn_getHTML'] = arguments;
    window['Calee_fn_getHTML'] = arguments.callee;
    window['Callback_fn_getHTML'] = o.callback;
    var o_neu = {};
    var callback = o.callback;
    var callback_name;
    var i_callback = o.callback.split('|').length;
    // if( o.callback.match(
    if ( i_callback > 1 ) {
        console.debug( '452__fn_getHTML: i_callback > 1  ==>  i_callback = ' + i_callback + '  |  ' + 'callback: ' + o.callback );
        // mehrere callbacks
        callback = eval( o.callback.split('|')[0] );
        callback_name = callback.toString();
        o_neu.url = o.url;
        o_neu.callback = '';
        o_neu.i_callback = i_callback - 1;
        var j = 0;
        for (var i = 1; i < i_callback; i++) {  // 1. callback wird ignoriert
            var cb = o.callback.split('|')[i];
            try{
                if( typeof(eval(cb)) !== 'undefined' ){
                    if( o_neu.callback.length === 0 ){
                        window['O_neu_fn_getHTML'] = eval(cb);
                        o_neu.callback = eval(cb).toString().match(/function\s*(.*?)\(/)[1];
                    } else {
                        o_neu.callback = o_neu.callback + '|' + eval(cb).toString().match(/function\s*(.*?)\(/)[1];
                    }
                    j++;
                }
            } catch(e){
                window['E_fn_getHTML'] = e;
                console.warn('468__e: ' + e );
            }
        }
        window['J_fn_getHTML'] = j;
        window['O_neu_fn_getHTML'] = o_neu;
    } else {
        callback = o.callback;
        callback_name = o.callback;
        window['Callback_fn_getHTML'] = callback;
    }
    // console.info( '484__fn_getHTML: ' + 'i_callback: ' + i_callback + '  |  ' + 'callback: ' + callback );
    // return 0;
    var parser = new DOMParser();
    var html = $.ajax({
            type: 'GET',
            url: o.url,
            cache: false,
            async: true
        })
        .done(function(returnedData) {
            // console.debug( '485__fn_getHTML:  =>  callback_name: ' + callback_name + '  |  ' + 'callback: ' + callback );
            dom = parser.parseFromString(returnedData, 'text/html');
            window['Dom_fn_getHTML'] = dom;
            sHTML = dom.body.innerHTML;
            // window.eval( eval(callback) ({
            if( i_callback > 1 ){
                console.debug( '500__fn_postHTML: i_callback > 1' );
                window.eval( eval(callback) ({
                    dom: dom,
                    mode: 'get',
                    i_callback: 1,
                    callback: o.callback,
                    type: o.type
                }))
                return 0;
            } else {
                console.debug( '509__fn_postHTML: i_callback <= 1' );
                console.info( '516__fn_postHMTL: callback: ' + callback );
                window.eval( eval(callback) ({
                    dom: dom,
                    mode: 'get',
                    i_callback: 0,
                    callback: '-',
                    type: o.type
                }))
                return 0;
            }
            
        });
}

function fn_baueAlle(o){
    console.debug( '499__clicked: fnbaueAlle  ===>  checked: ' + o.checked );
    if( o.checked === true ){
        var pID = parseInt( $('#id_pselector_auswahl',doc_menu)[0].selectedOptions[0].value.match(/(\d+)/)[1] );
        var sKoordinaten = $('#id_pselector_auswahl',doc_menu)[0].selectedOptions[0].innerHTML;
        b_exit = false;
        fn_getHTML({ url: url_raumschiffswerft, type: o.type, i_callback: 1, callback: 'fn_pruefeSchiffe' });
    }
}

function fn_pruefeSchiffe(o){
    window['O_fn_pruefeSchiffe'] = o;
    console.log( '538__fn_pruefeSchiffe: ' + 'i_callback: ' + o.i_callback + '  |  ' + 'callback: ' + o.callback + '  |  ' + 'b_exit: ' + b_exit );
    console.debug( '539__fn_pruefeSchiffe: ' + 'b_exit: ' + b_exit );
    if( b_exit === true ){
        if( ! o.type === 'clicked_btn_baue' ){
            alert('544');
            console.log( '542__fn_pruefeSchiffe' );
            b_btn_baueSchiffe_clicked = true;
            fn_getHTML({ url: url_raumschiffswerft, i_callback: 2, callback: 'fn_reloadRessis(dom: o.dom)|fn_write_table' });
            return 0;
        } else {
            console.log( '549__fn_pruefeSchiffe: ' + 'type: ' + o.type );
        }
        console.info( '553__fn_pruefeSchiffe: ' + 'anzahl_evos_noch_bauen: ' + anzahl_evos_noch_bauen );
        if( anzahl_evos_noch_bauen >= 1 || anzahl_solSats_noch_bauen >= 1 ){
            if( ! doc_main.URL.match(/floten\d\.php/) ){
                fn_reloadRessis({ callback: fn_write_table, dom: o.dom });
                doc_main.location.href = doc_main.location.href;
            }
        }
        return 0;
    }
    b_exit = true;
    var i_callback = 0;
    var callback = '';
    console.info( '566_fn_pruefeSchiffe: ' + 'callback: ' + callback );
    if( typeof( o.callback ) !== 'undefined' && o.callback !== '-' ){
        alert( '542__!' );
        i_callback = o.callback.split('|').length;
        // callback = eval( o.callback.split('|')[0] );
        callback = eval( o.callback );
    }

    window['I_callback_fn_pruefeSchiffe'] = i_callback;
    window['O_fn_pruefeSchiffe'] = o;

    window['Dom_fn_pruefeSchiffe'] = o.dom;

    fn_reloadRessis({ dom: o.dom });
    if( i_reloadCounter_baueSchiffe === 0 ){ fn_write_table(); }
    i_reloadCounter_baueSchiffe++;

    fn_baueSchiffe({ callback: 'fn_pruefeSchiffe', type: 'function' });
}

function fn_baueSchiffe(o){
    // console.warn( '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n661__fn_baueSchiffe: ' + ' type: ' + o.type + '  |  ' + 'callback: ' + o.callback.toString() + '  |  ' + 'b_exit: ' + b_exit );
    window['O_fn_baueSchiffe'] = o;
    anzahl_evos_noch_bauen = $('#id_evos_noch_bauen',doc_menu)[0].value;
    anzahl_solSats_noch_bauen = $('#id_solSats_noch_bauen',doc_menu)[0].value;
    anzahl_recs_noch_bauen = $('#id_recs_noch_bauen',doc_menu)[0].value;
    anzahl_rips_noch_bauen = $('#id_rips_noch_bauen',doc_menu)[0].value;

    console.warn( 'anzahl_evos_noch_bauen: ' + anzahl_evos_noch_bauen );

    b_exit = true;

    var postData = {
        algo: algo,
        'fmenge[203]': anzahl_gTr_noch_bauen,
        'fmenge[209]': anzahl_recs_noch_bauen,
        'fmenge[212]': anzahl_solSats_noch_bauen,
        'fmenge[214]': anzahl_rips_noch_bauen,
        'fmenge[217]': anzahl_evos_noch_bauen
    };

    if( anzahl_evos_noch_bauen >= 1 || anzahl_solSats_noch_bauen >= 1 ){
        if( met_vorhanden < 500000 || kris_vorhanden < 500000 || deut_vorhanden < 500000 ){ return 0; }
        console.warn( '586__fn_baueSchiffe: ' + 'callback: ' + o.callback );
        fn_postHTML({
            url: url_raumschiffswerft,
            data: postData,
            callback: o.callback,
            type: o.type
        });
    }
}

function fn_ermittle_schiffanzahl_nochBauen(o){
    var i_nochBauen = o.benoetigt - o.vorhanden;
    if( i_nochBauen <= 0 ){ i_nochBauen = 0; }
    return parseInt(i_nochBauen);
}

function fn_get_schiffanzahl(o){
    var i_schiffID = o.id;
    var schiffe_vorhanden = 0;
    var o_schiff = $('td>a[href*="gid=' + i_schiffID + '"]',o.doc);
    if( o_schiff.length > 0 ){
        var o_schiffe_vorhanden = o_schiff[0].parentElement.innerHTML.replace(/\./g,'').match(/Anzahl: (\d+)/);
        if( o_schiffe_vorhanden !== null ){ schiffe_vorhanden = o_schiffe_vorhanden[1];
        }
    }
    return parseInt(schiffe_vorhanden);
}

function fn_reloadRessis(o){
    window['O_fn_reloadRessis'] = o;
    console.log( '627__fn_reloadRessis' );
    if( $('tbody>input',o.dom).length > 0 ){ algo = $('tbody>input',o.dom)[0].value; }

    met_vorhanden = parseInt( $('#met',o.dom)[0].innerText.replace(/\./g,'') );
    kris_vorhanden = parseInt( $('#cry',o.dom)[0].innerText.replace(/\./g,'') );
    deut_vorhanden = parseInt( $('#deut_rechner',o.dom)[0].innerText.replace(/\./g,'') );

    ress_gesamt = parseInt(met_vorhanden + kris_vorhanden + deut_vorhanden);

    anzahl_gTr_vorhanden = fn_get_schiffanzahl({ doc: o.dom, id: 203 });
    anzahl_evos_vorhanden = fn_get_schiffanzahl({ doc: o.dom, id: 217 });
    anzahl_recs_vorhanden = fn_get_schiffanzahl({ doc: o.dom, id: 209 });
    anzahl_rips_vorhanden = fn_get_schiffanzahl({ doc: o.dom, id: 214 });
    anzahl_solSats_vorhanden = fn_get_schiffanzahl({ doc: o.dom, id: 212 });

    anzahl_evos_benoetigt = parseInt(ress_gesamt / 400000000 + 1);

    anzahl_gTr_noch_bauen = fn_ermittle_schiffanzahl_nochBauen({ vorhanden: anzahl_gTr_vorhanden, benoetigt: anzahl_gTr_benoetigt });
    anzahl_evos_noch_bauen = fn_ermittle_schiffanzahl_nochBauen({ vorhanden: anzahl_evos_vorhanden, benoetigt: anzahl_evos_benoetigt });
    anzahl_recs_noch_bauen = fn_ermittle_schiffanzahl_nochBauen({ vorhanden: anzahl_recs_vorhanden, benoetigt: 1 });
    anzahl_rips_noch_bauen = fn_ermittle_schiffanzahl_nochBauen({ vorhanden: anzahl_rips_vorhanden, benoetigt: 1 });

    o_energie_vorhanden = $('td.header>font',o.dom)[0].innerText.replace(/\./g,'');
    window['O_fn_reloadRessis_energie_vorhanden'] = o_energie_vorhanden;
    if( o_energie_vorhanden.startsWith('-') ){
        i_energie_noch_benoetigt = o_energie_vorhanden.substr(1);   // entfernt das Minus am Zeichenanfang
        anzahl_solSats_noch_bauen = parseInt( i_energie_noch_benoetigt / i_energie_pro_solSat + 5 );
        console.debug( 'i_energie_noch_benoetigt: ' + i_energie_noch_benoetigt );
        console.debug( 'i_energie_pro_solSat: ' + i_energie_pro_solSat );
        console.debug( 'anzahl_solSats_noch_bauen: ' + anzahl_solSats_noch_bauen );
    } else {
        anzahl_solSats_noch_bauen = 0;
    }

    anzahl_solSats_benoetigt = anzahl_solSats_noch_bauen + anzahl_solSats_vorhanden;

    $('#id_evos_noch_bauen',doc_menu)[0].value = anzahl_evos_noch_bauen;
    $('#id_solSats_noch_bauen',doc_menu)[0].value = anzahl_solSats_noch_bauen;
    $('#id_recs_noch_bauen',doc_menu)[0].value = anzahl_recs_noch_bauen;
    $('#id_rips_noch_bauen',doc_menu)[0].value = anzahl_rips_noch_bauen;

    $('#id_evos_benoetigt',doc_menu)[0].innerHTML = anzahl_evos_benoetigt;
    $('#id_solSats_benoetigt',doc_menu)[0].innerHTML = anzahl_solSats_benoetigt;
    $('#id_recs_benoetigt',doc_menu)[0].innerHTML = anzahl_recs_benoetigt;
    $('#id_rips_benoetigt',doc_menu)[0].innerHTML = anzahl_rips_benoetigt;

    $('#id_evos_vorhanden',doc_menu)[0].innerHTML = anzahl_evos_vorhanden;
    $('#id_solSats_vorhanden',doc_menu)[0].innerHTML = anzahl_solSats_vorhanden;
    $('#id_recs_vorhanden',doc_menu)[0].innerHTML = anzahl_recs_vorhanden;
    $('#id_rips_vorhanden',doc_menu)[0].innerHTML = anzahl_rips_vorhanden;
}

function fn_reloadMainframe(i_reloadMainframe) {
    console.info( '624__fn_reloadMainframe' );
    reloadTime = parseInt($('#id_reloadTime', doc_menu)[0].value);
    var url = doc_main.URL;
    if ($('#id_cb_reloadMainframe', doc_menu)[0].checked === true) {
        if (typeof(i_reloadMainframe) === 'undefined' || i_reloadMainframe === -1 ) {
            console.warn('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n625__fn_reloadMainframe: ' + url + '  |  ' + i_reloadMainframe);
            time_until_reload = reloadTime;
            i_reloadMainframe = win_menu.setInterval(function() {
                fn_reloadMainframe(i_reloadMainframe);
            }, 1000);
            return 0;
        }
        time_until_reload = time_until_reload - 1;
        if (time_until_reload < 10) {
            $('#id_reloadTime_verbleibend', doc_menu)[0].innerHTML = '&nbsp;&nbsp;' + time_until_reload;
        } else {
            $('#id_reloadTime_verbleibend', doc_menu)[0].innerHTML = time_until_reload;
        }
        $('#id_reloadTime', doc_menu)[0].value = reloadTime;
        if (time_until_reload === 0) {
            time_until_reload = reloadTime;
            doc_main.location.href = url;
        }
        return 0;
    } else {
        win_menu.clearInterval(i_reloadMainframe);
    }
}