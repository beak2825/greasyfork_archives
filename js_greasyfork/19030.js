// ==UserScript==
// @name         insertDIVs_new_v4
// @namespace    
// @version      0.1
// @datetime     19.04.2016 05:31
// @description  ...
// @require      https://code.jquery.com/jquery-latest.js
// @author       S.K.
// @match        http://uni4.xorbit.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19030/insertDIVs_new_v4.user.js
// @updateURL https://update.greasyfork.org/scripts/19030/insertDIVs_new_v4.meta.js
// ==/UserScript==

var uni = 4;
var serverURL = 'http://uni' + uni + '.xorbit.de/';
var url_raumschiffswerft = serverURL + 'buildings.php?mode=fleet';

var dom;
var pselector_dom;
var sHTML;
var doc_menu;
var doc_main;
var iframe;
var doc_iframe;
var ausgewaehlte_planetenID;

var s_getHTML__fn_get_planeten = -1;
var s_checkDIVs = -1;
var s_addEventListener = -1;

var waitCode = -1;
var index = 0;
var counter = 0;
var i_wait = true;
var i_anzahlFunktionen = 0;
var o_functions = {};
var reload = false;
var firstStart = true;
var s_getHTML = -1;
var timer;

o_functions[0] = {
    fnName: 'fn_insertHTML', waitFor: true, parameteranzahl: 0, callback: '', fn: function(){ fn_insertHTML({}); }
};

o_functions[1] = {
    fnName: 'fn_reloadRessis', waitFor: true, parameteranzahl: 0, callback: fn_get_rohstoffe_schiffe, fn: function(){ fn_reloadRessis(); }
};

o_functions[2] = {
    fnName: 'fn_addEventListener', waitFor: true, parameteranzahl: 0, callback: '', fn: function(){ fn_addEventListener(); }
};

o_functions[3] = {
    fnName: 'fn_reloadRessis', waitFor: true, parameteranzahl: 0, callback: fn_get_rohstoffe_schiffe, fn: function(){ fn_reloadRessis(); }
};

o_functions[4] = {
    fnName: 'fn_scriptEnde', waitFor: true, parameteranzahl: 0, callback: '', fn: function(){ fn_scriptEnde(); }
};

// o_functions[4] = {
//     fnName: 'fn_scriptEnde', waitFor: false, parameteranzahl: 0, callback: '', fn: function(){ fn_scriptEnde(); }
// };

for( var el in o_functions ){
    console.info( el + ': ' + o_functions[el].fnName );
    i_anzahlFunktionen = i_anzahlFunktionen + 1;
}

function fn_scriptEnde(){
        console.info( '============ ENDE ============ ' + index );
        return 0;
}

console.info( 'i_anzahlFunktionen: ' + i_anzahlFunktionen );
fn_functions();

function fn_functions(){
    if( counter === 0 ){
        console.info( '============ START ============' );
    }
    counter++;

    if( index < i_anzahlFunktionen ){
        console.log( 'fn_functions: ' + getTime() + '  |  ' + 'firstStart: ' + firstStart + '  index: ' + index + '  i_wait: ' + i_wait + '  |  waitFor: ' + o_functions[index].fnName + '  |  counter: ' + counter);
        if( firstStart === true ){
            firstStart = false;
            $( 'frame' ).bind( 'load', function () { fn_frameLoaded( $( this ), 'load' ); } );    // ==> beim Neuladen eines Frames
            $( window ).bind( 'load', function () { fn_framesetLoaded( $( this ), 'load' ); } );
            i_wait = true;
        }
        if( i_wait === false ){
            console.error( 'index: ' + index + '  |  ' );
            console.error( 'fnName: ' + o_functions[index].fnName );
            var callback = o_functions[index].callback;
            var waitFor = o_functions[index].waitFor;
            var fn = o_functions[index].fn;
            var fnName = o_functions[index].fnName;
            if( typeof(callback) === 'function' ){
                console.log( '%%%%%%%%%%%%%%%%%%%% ' + 'fnName: ' + fnName + '  waitFor: ' + waitFor + '  callback: ' + callback.toString().match( /(function.*?).{/ )[1] );
            } else {
                console.log( '%%%%%%%%%%%%%%%%%%%% ' + 'fnName: ' + fnName + '  waitFor: ' + waitFor + '  callback: ' + callback );
            }
            console.info( 'callback: ' + fnName + '  |  ' + typeof(callback) );
            if( waitFor === true ){ i_wait = true; }
            console.info( 'fn: ' + fn );
            fn();
            if( index < i_anzahlFunktionen){ index++; }
        }

        if( index < i_anzahlFunktionen ){
            timer = setTimeout( function(){ fn_functions(); }, 50 );
        }
    }
}

function fn_frameLoaded( obj, val ) {
    console.info( '\n**********************************************************************************************************************************' +
                  '\n************************************** ' + 'fn_frameLoaded:  ' + obj[0].contentDocument.URL + ' **************************************' +
                  '\n**********************************************************************************************************************************' );
    console.warn( '116__fn_frameLoaded: ' + 'val: ' + val + '  |  url:  ' + obj[0].contentDocument.URL + '  |  ' + 'firstStart: ' + firstStart );
    console.info( 'URL: ' + obj[0].contentDocument.URL + '  |  ' + obj[0].contentDocument.readyState + '  |  ' + val );
    fn_set_global_vars( 'fn_frameLoaded: ' + obj[0].contentDocument.URL );
    if( typeof( $('#id_o_div1', doc_menu)[0] ) !== 'undefined' ){
        // fn_reloadRessis();
        fn_aktualisiere_und_baue_schiffe()
    }
}

function fn_framesetLoaded( obj, val ) {
    console.info( '\n----------------------------------------------------------------------------------------------------------------------------------' +
                  '\n-------------------------------------- ' + 'fn_framesetLoaded: ' + obj[0].document.URL + ' --------------------------------------' +
                  '\n----------------------------------------------------------------------------------------------------------------------------------' );
    console.warn( '125__fn_framesetLoaded: ' + 'val: ' + val + '  |  url:  ' + document.URL + '  |  ' + 'firstStart: ' + firstStart );
    window['o_doc'] = obj;
    fn_set_global_vars( 'fn_framesetLoaded: ' + document.URL );
    console.debug( 'readyState:\n' +
				  'frameset: ' + document.readyState + '\n' +
				  'frame0  : ' + top.frames[0].window.document.readyState + '\n' +
				  'frame1  : ' + top.frames[1].window.document.readyState + '\n'
				 );

    window['WINDOW'] = top.window;
    $( 'a', doc_menu ).click( function () { fn_link_clicked( $( this ), 'doc_menu' ); } );
    $( 'a', doc_main ).click( function () { fn_link_clicked( $( this ), 'doc_main' ); } );
    i_wait = false;
    fn_functions();
}

function fn_link_clicked( obj, sourceWindow ) {
    console.warn( '142__fn_link_clicked: ' + 'sourceWindow: ' + sourceWindow + '  |  ' + 'URL: ' + obj[0].URL );
    window['doc_linkClicked'] = obj;
}

function fn_set_global_vars( val ) {
    console.warn( '147__fn_set_global_vars:' + 'val: ' + val );
    if ( frames.length === 2 ) {
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
    return 0;
}

function fn_insertHTML() {
    console.warn( '166__fn_insertHTML:' );
    firstStart = false;
    // insert html_stammdaten
    var o_div1 = document.createElement( 'div' );
    o_div1.id = 'id_o_div1';
    doc_menu.body.insertBefore( o_div1, doc_menu.body.childNodes[0] );

    var o_div2 = document.createElement( 'div' );
    o_div2.id = 'id_o_div2';
    doc_menu.body.insertBefore( o_div2, doc_menu.body.childNodes[1] );

    var o_iframe = document.createElement( 'iframe' );
    o_iframe.id = 'id_o_iframe';
    o_iframe.width = '50';
    o_iframe.height = '50';
    o_iframe.src = 'http://uni4.xorbit.de/buildings.php?mode=fleet';
    doc_menu.getElementById( 'id_o_div1' ).appendChild( o_iframe );

    iframe = doc_menu.getElementById( 'id_o_iframe' );
    doc_iframe = iframe.contentWindow.document;

    iframe.contentWindow.addEventListener( "DOMContentLoaded", iFrameDOMContentLoaded, true );

    function iFrameDOMContentLoaded() {
        console.debug( '##############_DOMContentLoaded_iFrame_##############' + '\n' + iframe.contentWindow.document.location.href );
    }

    // insert tabellen + buttons
    $( '#id_o_div2', doc_menu )[0].innerHTML = `
                <table width="150">
                    <tr>
                        <iframe id="id_o_iframe" width="150" height="50" src=""></iframe>
                    </tr>
                </table>
                <table width="150">
                    <tr>
                        <td>algo:</td>
                        <td id="algo">1234</td>
                    </tr>
                </table>
                <table>
                    <tr>
                        <td width="55">Evos</td>
                        <td width="10"><input type="text" name="fmenge[217]" id="217" alt="Evolution Transporter" size="5" maxlength="5" value="30" tabindex="1"></td>
                        <td width="50" id="evos_vorhanden"></td>
                    </tr>
                    <tr>
                        <td>Sol.Sats</td>
                        <td><input type="text" name="fmenge[212]" id="212" alt="Solarsatellit" size="5" maxlength="10" value="3000" tabindex="2"></td>
                        <td id="solarsatelliten_vorhanden"></td>
                    </tr>
                    <tr>
                        <td>Recycler</td>
                        <td><input type="text" name="fmenge[209]" id="209" alt="Recycler" size="5" maxlength="10" value="1" tabindex="3"></td>
                        <td id="recycler_vorhanden"></td>
                    </tr>
                    <tr>
                        <td>Todesstern</td>
                        <td><input type="text" name="fmenge[214]" id="214" alt="Todesstern" size="5" maxlength="10" value="1" tabindex="4"></td>
                        <td id="todessterne_vorhanden"></td>
                    </tr>
                    <tr>
                        <td><input type="button" id="leer" value="leer"></input></td>
                        <td><input type="button" id="clear" value="cls"></input></td>
                    </tr>
                    <tr>
                        <td><input type="button" id="baue" value="baue"></input></td>
                        <td><input type="button" id="ermittle_benoetigte_schiffe" value="get"></input></td>
                    </tr>
                </table>
            <table>
                <tr>
                    <td>
                        <input style="width: 20px;" value="&lt;" type="button" id="planetwechsel_davor"></input>
                    </td>
                    <td id="planetenliste">
                        <select id="pselector_auswahl" size="1">

                        </select>
                    </td>
                    <td>
                        <input style="width: 20px;" value="&gt;" type="button" id="planetwechsel_danach"></input>
                    </td>
                    <td>
                        <input type="text" id="reloadTime" maxlength="3" size="3" value="30"></input>
                    </td>
                </tr>
            <table>
            </table>
                <tr>
                    <td>
                        <input type="checkbox" id="saveRessis">saveRessis</input>
                        <input type="checkbox" id="reloadMainframe">reloadMainframe</input>
                    <td>
                <tr>
            </table>
        `;

    // insert Planetenliste
    pselector_main = $( '#pselector', doc_main )[0];
    var sHTML_planeten = pselector_main.innerHTML;
    sHTML_planeten = sHTML_planeten.replace( /">.*?\[/g, '">' );
    sHTML_planeten = sHTML_planeten.replace( /\]/g, '' );
    sHTML_planeten = sHTML_planeten.replace( /&nbsp;/g, '');
    $( '#planetenliste', doc_menu )[0].children[0].innerHTML = sHTML_planeten;
    i_wait = false;
    return 0;
}

// function fn_postHTML( url, data, callback, wait_bool, waitCode_tmp ) {
function fn_postHTML( o ) {
    url = o.url;
    data = o.data;
    callback = o.callback;
    wait_bool = o.wait_bool;
    waitCode_tmp = o.waitCode_tmp;
    var o_neu = {};
    if( typeof(o.anzahl) === 'number' && o.anzahl > 1 ){
        // evtl. mehrere callbacks
        callback = o[0];
        o_neu.url = o.url;
        o_neu.anzahl = o.anzahl - 1;
        for( var i = 1; i < o.anzahl; i++){
            // console.log( '\n' + i + ': ' + o[i] );
            o_neu[i] = o[i];
        }
        console.warn( '304__fn_getHTML: ' + 'URL: ' + o.url + '  |  ' + 'callback: ' + callback.toString().match( /(function.*?).{/ )[1] );
    } else {
        console.warn( '304__fn_getHTML: ' + 'URL: ' + o.url + '  |  ' + 'callback: ' + o.callback.toString().match( /(function.*?).{/ )[1] );
        callback = o.callback;
    }
    window['O_NEU_POST'] = o_neu;
    // console.warn( '275__fn_postHTML: ' + 'URL: ' + url + '  |  ' + 'data: ' + data + '  |  ' + 'callback: ' + callback.toString().match( /(function.*?).{/ )[1] + '  |  ' + 'wait_bool: ' + wait_bool );
    // console.warn( '275__fn_postHTML: ' + 'URL: ' + url + '  |  ' + 'data: ' + data + '  |  ' + 'callback: ' + callback + '  |  ' + 'wait_bool: ' + wait_bool );
    var parser = new DOMParser();
    var html = $.ajax( {
        method: "POST",
        url: o.url,
        data: o.data,
        cache: false,
        async: true
    } )
    .done( function ( returnedData ) {
        dom = parser.parseFromString( returnedData, 'text/html' );
        sHTML = dom.body.innerHTML;
        window['DOM_POST'] = dom;

        if ( wait_bool === 'wait' ) {
            console.info( '290__ wait_bool: 500 ==>  ' + callback( dom ) );
            setTimeout( function () {
                window.eval( callback({ dom: dom, mode: 'post', callback: o_neu }) );
                return 0;
            }, 500 );
        } else {
            console.info( '296__callback...' );
            window.eval( callback({ dom: dom, mode: 'post', callback: o_neu }) );
            return 0;
        }
    } );
}

function fn_aktualisiere_und_baue_schiffe(){
    fn_getHTML({ url: url_raumschiffswerft, anzahl: 4, 0: fn_get_rohstoffe_schiffe, 1: fn_baueSchiffe, 2: fn_postHTML, 3: fn_get_rohstoffe_schiffe });
}

function fn_getHTML( o ) {
    
    // 

    // console.info( 'callee: ' + arguments.callee.toString().match( /(function.*?).{/ )[1] );
    // console.info( '::::::::::::::::::::::::::::::::::::::::::::\n' + 'typeof:  ' + typeof(o.anzahl) );
    window['ARGUMENTS'] = arguments;
    window['CALLEE'] = arguments.callee;
    // console.error( '360__callback: ' + o.callback );
    var o_neu = {};
    var callback = o.callback;
    if( typeof(o.anzahl) === 'number' && o.anzahl > 1 ){
        // evtl. mehrere callbacks
        callback = o[0];
        o_neu.url = o.url;
        o_neu.anzahl = o.anzahl - 1;
        for( var i = 1; i < o.anzahl; i++){
            // console.log( '\n' + i + ': ' + o[i] );
            o_neu[i] = o[i];
        }
        console.warn( '304__fn_getHTML: ' + 'URL: ' + o.url + '  |  ' + 'callback: ' + callback.toString().match( /(function.*?).{/ )[1] );
    } else {
        console.warn( '304__fn_getHTML: ' + 'URL: ' + o.url + '  |  ' + 'callback: ' + o.callback.toString().match( /(function.*?).{/ )[1] );
        callback = o.callback;
    }
    var parser = new DOMParser();
    var html = $.ajax( {
        type:  'GET',
        url:   o.url,
        cache: false,
        async: true
    } )
    .done( function ( returnedData ) {
        dom = parser.parseFromString( returnedData, 'text/html' );
        sHTML = dom.body.innerHTML;
        window['DOM_GET'] = dom;
        // console.info( '#################################################\n' + ' ' + ': ' + 'fn_getHTML:  ' + 'url: ' + o.url + '  |  ' + 'callback: ' + o.callback.toString().match( /(function.*?).{/ )[1] );
        window.eval( callback({ dom: dom, mode: 'get', o_neu }) );
        return 0;
    } );
}

function fn_reloadRessis(){
    fn_getHTML({url: url_raumschiffswerft, anzahl: 1, callback: fn_get_rohstoffe_schiffe});
}

// function fn_get_rohstoffe_schiffe( dom, mode ) {
function fn_get_rohstoffe_schiffe( o ) {
    dom = o.dom;
    mode = o.mode;
    window['O'] = o;
    console.warn( '330__fn_get_rohstoffe_schiffe: ' + 'mode: ' + mode );
    
//    if (mode === 'post') {    //  ==> schiffe wurden gerade gebaut => html_quellcode aktualisieren
//        setTimeout(function() {
//            fn_reloadRessis();    //  da die gerade erst gebauten Schiffe nicht in dem html_quellcode sind
//        }, 200);
//        return 0;
//    }


    window['DOM'] = dom;
    algo = dom.body.innerHTML.match( /<input type="hidden" value="(.*?)" name="algo"/ ) // globale Variable, da sonst von der Funktion
    window['ALGO'] = algo;
    // if( typeof(algo) === 'null' ){ } else if( typeof(algo) === 'undefined' ){ } else if( algo === null ) { } else {
    if( typeof(algo) === 'object' ){
        // console.info( '437__algo: ' + ' object ' );
        window['ALGO_438'] = algo;
        if( algo.length === 2 ){
            // console.info( '440__algo -> OK' );
            algo = algo[1];
        } else {
            // console.error( '443__algo: ' + algo );
        }
    } else if( typeof(algo) === 'string' ){
        // console.info('446__algo !== null  typeof:  ' + typeof(algo) );
        window['ALGO_436'] = algo;
        // console.error( 'algo.length: ' + algo.length );
        if( algo.length === 32 ){
            // algo = algo[1];
            // console.info( '450__algo: ' + ' len: 1 +   ' + algo.length + '  |  ' + algo );
        } else {
            // console.error( '453__algo: ' + ' len: +   ' + algo.length );
        }
    } else {
        // console.error( '454__algo: ' + 'typeof: ' + typeof(algo) );
    }
    
    if( dom.body.innerHTML.match(/errormessage/) === 1 ){
        console.error( 'errormessage' );
        setTimeout( function(){ fn_get_rohstoffe_schiffe( o ); }, 150);
        return 0;
    } else {
        // console.info( '464__algo: ' + '' + algo );
        // algo = algo[1];
        // console.info( '464__algo[1]: ' + '' + algo );
    }
        
        
    window['ALGO_nachher'] = algo;

    aktuelle_planetenID = dom.getElementById( 'pselector' ).selectedIndex;

    console.info( '472__aktuelle_planetenID: ' + aktuelle_planetenID );
    console.info( '473__algo: ' + algo );

    met_vorhanden = parseInt( dom.getElementById( 'met' ).innerText.replace( /\./g, '' ).match( /(\d+)/ )[1] );
    kris_vorhanden = parseInt( dom.getElementById( 'cry' ).innerText.replace( /\./g, '' ).match( /(\d+)/ )[1] );
    deut_vorhanden = parseInt( dom.getElementById( 'deut_rechner' ).innerText.replace( /\./g, '' ).match( /(\d+)/ )[1] );
    ress_gesamt = parseInt( met_vorhanden + kris_vorhanden + deut_vorhanden );

    met_vorhanden_MIO = parseInt( met_vorhanden / 1000000 );
    kris_vorhanden_MIO = parseInt( kris_vorhanden / 1000000 );
    deut_vorhanden_MIO = parseInt( deut_vorhanden / 1000000 );
    ress_gesamt_MIO = parseInt( ress_gesamt / 1000000 );

    met_vorhanden_MRD = parseInt( met_vorhanden_MIO / 1000 );
    kris_vorhanden_MRD = parseInt( kris_vorhanden_MIO / 1000 );
    deut_vorhanden_MRD = parseInt( deut_vorhanden_MIO / 1000 );
    ress_gesamt_MRD = parseInt( ress_gesamt_MIO / 1000 );

    anzahl_evos_benoetigt = parseInt( ress_gesamt / 400000000 + 1 );

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

    var TDs = dom.querySelectorAll( 'td' );
    for ( var i = 0; i < TDs.length; i++ ) {
        if ( TDs[i].innerHTML.match( 'form action' ) ) { } else {
            var anzahl_tmp = TDs[i].innerHTML.replace( /\./g, '' ).match( /\(Anzahl: (\d+)\)/ );
            if ( anzahl_tmp !== null ) {
                var anzahl_vorhanden = parseInt( anzahl_tmp[1] );
                if ( TDs[i].innerHTML.match( '209' ) ) {
                    anzahl_recycler_vorhanden = anzahl_vorhanden;
                }
                if ( TDs[i].innerHTML.match( '217' ) ) {
                    anzahl_evos_vorhanden = anzahl_vorhanden;
                }
                if ( TDs[i].innerHTML.match( '214' ) ) {
                    anzahl_todessterne_vorhanden = anzahl_vorhanden;
                }
                if ( TDs[i].innerHTML.match( '212' ) ) {
                    anzahl_solarsatelliten_vorhanden = anzahl_vorhanden;
                }
            }
        }
    }

    if ( anzahl_recycler_vorhanden < anzahl_recycler_benoetigt ) {
        if ( anzahl_recycler_vorhanden === 0 ) { }
        anzahl_recycler_noch_bauen = anzahl_recycler_benoetigt - anzahl_recycler_vorhanden;
    }
    if ( anzahl_evos_vorhanden < anzahl_evos_benoetigt ) {
        anzahl_evos_noch_bauen = anzahl_evos_benoetigt - anzahl_evos_vorhanden;
    }
    if ( anzahl_todessterne_vorhanden < anzahl_todessterne_benoetigt ) {
        anzahl_todessterne_noch_bauen = anzahl_todessterne_benoetigt - anzahl_todessterne_vorhanden;
    }
    if ( anzahl_solarsatelliten_vorhanden < anzahl_solarsatelliten_benoetigt ) {
        anzahl_solarsatelliten_noch_bauen = anzahl_solarsatelliten_benoetigt - anzahl_solarsatelliten_vorhanden;
    }

    window['DOC_MENU'] = doc_menu;
    doc_menu.getElementById( '217' ).value = anzahl_evos_noch_bauen;
    doc_menu.getElementById( '212' ).value = anzahl_solarsatelliten_noch_bauen;
    doc_menu.getElementById( '209' ).value = anzahl_recycler_noch_bauen;
    doc_menu.getElementById( '214' ).value = anzahl_todessterne_noch_bauen;
    doc_menu.getElementById( 'evos_vorhanden' ).innerHTML = anzahl_evos_benoetigt + ' / ' + anzahl_evos_vorhanden;
    doc_menu.getElementById( 'todessterne_vorhanden' ).innerHTML = anzahl_todessterne_vorhanden;
    doc_menu.getElementById( 'recycler_vorhanden' ).innerHTML = anzahl_recycler_vorhanden;
    doc_menu.getElementById( 'solarsatelliten_vorhanden' ).innerHTML = anzahl_solarsatelliten_vorhanden;

    if ( $( '#saveRessis', doc_menu )[0].checked === false ) {
        $( '#pselector_auswahl', doc_menu )[0].selectedIndex = $( '#pselector', doc_main )[0].selectedIndex;
    }

    if ( $( '#217', doc_menu )[0].value > 1 ) {    // falls mehr als 5 Evos gebaut werden muessen, werden diese automatisch gebaut
        // $( '#baue', doc_menu )[0].click();
        console.info( '\n>>>>>>>>>>>>>>>>>>>>>>>>>>>> baueSchiffe' );
        fn_baueSchiffe(true, false);    // rohstoffe_schiffe_aktuell, i_wait = false
    } else {
        fn_write_table();
        i_wait = false;
    }
    return 0;
}

function fn_write_table() {
    console.warn( '445__fn_write_table' );
    var schiffe = {};
    var rohstoffe = {};

    schiffe.evos = new Schiff( anzahl_evos_noch_bauen, anzahl_evos_vorhanden, anzahl_evos_benoetigt );
    schiffe.rips = new Schiff( anzahl_todessterne_noch_bauen, anzahl_todessterne_vorhanden, anzahl_todessterne_benoetigt );
    schiffe.recs = new Schiff( anzahl_recycler_noch_bauen, anzahl_recycler_vorhanden, anzahl_recycler_benoetigt );
    schiffe.solSats = new Schiff( anzahl_solarsatelliten_noch_bauen, anzahl_solarsatelliten_vorhanden, anzahl_solarsatelliten_benoetigt );

    rohstoffe.met = new Rohstoff( met_vorhanden, met_vorhanden_MIO, met_vorhanden_MRD );
    rohstoffe.kris = new Rohstoff( kris_vorhanden, kris_vorhanden_MIO, kris_vorhanden_MRD );
    rohstoffe.deut = new Rohstoff( deut_vorhanden, deut_vorhanden_MIO, deut_vorhanden_MRD );
    rohstoffe.gesamt = new Rohstoff( ress_gesamt, ress_gesamt_MIO, ress_gesamt_MRD );

    function Schiff( nochBauen, vorhanden, benoetigt ) {
        this.nochBauen = nochBauen;
        this.vorhanden = vorhanden;
        this.benoetigt = benoetigt;
    }

    function Rohstoff( vorhanden, vorhanden_in_MIO, vorhanden_in_MRD ) {
        this.vorhanden = vorhanden;
        this.vorhanden_in_MIO = vorhanden_in_MIO;
        this.vorhanden_in_MRD = vorhanden_in_MRD;
    }

    console.table( rohstoffe );
    console.table( schiffe );
}

function getTime() {
    var time_tmp = new Date();
    var i_hours         = time_tmp.getHours();
    var i_minutes       = time_tmp.getMinutes();
    var i_seconds       = time_tmp.getSeconds();
    var i_milliseconds  = time_tmp.getMilliseconds();

    if ( i_seconds.toString().length === 1 ) { i_seconds = '0' + i_seconds };
    if ( i_minutes.toString().length === 1 ) { i_minutes = '0' + i_minutes };
    if ( i_hours.toString().length   === 1 ) { i_hours   = '0' + i_hours };
    if ( i_milliseconds.toString().length   === 1 ) { i_milliseconds   = '00' + i_milliseconds };
    if ( i_milliseconds.toString().length   === 2 ) { i_milliseconds   = '0' + i_milliseconds };

    var s_time = i_hours + ':' + i_minutes + ':' + i_seconds + '.' + i_milliseconds;
    return s_time;
}

function fn_baueSchiffe(schiffe_aktualisiert, waitFor) {
    console.warn( '506__fn_baueSchiffe: ' + schiffe_aktualisiert );
    fn_write_table('baue');
    
//	if (schiffe_aktualisiert === false) {
//		schiffe_aktualisiert = true;
//		setTimeout(function() {
//			fn_getHTML('http://uni4.xorbit.de/buildings.php?mode=fleet', fn_baueSchiffe);
//		}, 200);
//		return 1;
//	}


	if (typeof(anzahl_recycler_noch_bauen) === 'undefined') {
		anzahl_recycler_noch_bauen = doc_menu.getElementById('209').value;
	}
	if (typeof(anzahl_solarsatelliten_noch_bauen) === 'undefined') {
		anzahl_solarsatelliten_noch_bauen = doc_menu.getElementById('212').value;
	}
	if (typeof(anzahl_todessterne_noch_bauen) === 'undefined') {
		anzahl_todessterne_noch_bauen = doc_menu.getElementById('214').value;
	}
	if (typeof(anzahl_evos_noch_bauen) === 'undefined') {
		anzahl_evos_noch_bauen = doc_menu.getElementById('217').value;
	}


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
		// var callback = fn_get_rohstoffe_schiffe;
		// fn_postHTML(url, postData, callback, 'wait', waitCode, 'fn_baueSchiffe');
        fn_postHTML({ url: url, data: postData, callback: fn_get_rohstoffe_schiffe, wait: true, name: 'fn_baueSchiffe' });
	}
}

function fn_reloadMainframe() {
    console.warn( '543__fn_reloadMainframe');
}

function fn_clearInput() {
    console.warn( '547__fn_clearInput:' );
	doc_menu.getElementById('217').value = 0;
	doc_menu.getElementById('212').value = 0;
	doc_menu.getElementById('209').value = 0;
	doc_menu.getElementById('214').value = 0;
}

function fn_addEventListener() {
    console.info( '@@@@@@@@@: 248__fn_addEventListener' + '  |  url:  ' + document.location.href );
    console.warn( '556__fn_addEventListener' );
    $('#clear', doc_menu).bind('click', function() { console.info( 'clicked: clear' ); fn_clearInput(); });
    $('#leer', doc_menu).bind('click', function() { console.info( 'clicked: leer' ); });
    $('#ermittle_benoetigte_schiffe', doc_menu).bind('click', function() { console.info( 'clicked: ermittle_benoetigte_schiffe' ); fn_reloadRessis(); });
    $('#baue', doc_menu).bind('click', function() { console.info( 'clicked: baue' ); fn_baueSchiffe(false); });

	$('#planetwechsel_davor', doc_menu).bind('click', function() { console.info( 'clicked: planetwechsel_davor' ); fn_planetwechsel('davor'); });
	$('#planetwechsel_danach', doc_menu).bind('click', function() { console.info( 'clicked: planetwechsel_danach' ); fn_planetwechsel('danach'); });
	$('#pselector_auswahl', doc_menu).on( 'change', function() { console.info( 'changed: planetwechsel_auswahl' ); fn_planetwechsel('auswahl'); });

    $('#reloadMainframe', doc_menu).bind('click', function() { console.info( 'clicked: reloadMainframe' ); fn_reloadMainframe(0, 0); });
    
    ausgewaehlte_planetenID = $('#pselector_auswahl',doc_menu)[0].selectedIndex;
    ziel_koordinaten = $('#pselector_auswahl',doc_menu)[0].options[ausgewaehlte_planetenID].innerHTML;
    url_fleet_tmp = 'http://uni4.xorbit.de/fleet.php?galaxy=8&system=43&planet=4&planettype=1&target_mission=3'
    // '?galaxy=' + gala_ziel + '&system=' + system_ziel + '&planet=' + planet_ziel + '&planettype=' + planettype_ziel + '&target_mission=4'
    
//    $('#dynamic_select').on('change', function () {
//          var url = $(this).val(); // get selected value
//          if (url) { // require a URL
//              window.location = url; // redirect
//          }
//          return false;
//    });

    i_wait = false;
}

function fn_planetwechsel(richtung) {
    console.warn( '581__fn_planetwechsel: ' + richtung );
    console.info( '@@@@@@@@@: 284__fn_planetwechsel' + '  |  url:  ' + document.location.href );
    pselector_dom = $('#pselector_auswahl',doc_menu)[0];
    ausgewaehlte_planetenID = $('#pselector_auswahl',doc_menu)[0].selectedIndex;
    aktuelle_planetenID = $('#pselector_auswahl',doc_menu)[0].selectedIndex;
	var planetenanzahl = pselector_dom.length;
	// var url_main = frames[1].document.location.href.replace(/\?cp=\d+&re=0/g,'');
    var url_main = doc_main.location.origin + doc_main.location.pathname;
	console.info('saveRessis_checked: ' + $('#saveRessis', doc_menu)[0].checked );

	if (richtung === 'davor') {
		if (pselector_dom.selectedIndex > 0) {
            $('#pselector_auswahl',doc_menu)[0].selectedIndex = aktuelle_planetenID - 1;
            console.info( 'url: ' + doc_main.location.href );
			doc_main.location.href = url_main + pselector_dom.options[aktuelle_planetenID - 1].value;
		} else {
			alert('erste Planet!');
		}
	}
	if (richtung === 'danach') {
		if (pselector_dom.selectedIndex + 1 < planetenanzahl) {
            $('#pselector_auswahl',doc_menu)[0].options.selectedIndex = aktuelle_planetenID + 1;
			doc_main.location.href = url_main + pselector_dom.options[aktuelle_planetenID + 1].value;
		} else {
			alert('bereits der letzte Planet');
		}
	}
	if (richtung === 'auswahl') {
		var url_fleet = serverURL + "fleet.php" + doc_menu.getElementById('pselector_auswahl').selectedOptions[0].value;
		if ( $('#saveRessis',doc_menu)[0].checked === false) {

			console.debug('fn_planetwechsel / auswahl / if ( checked=false ) => location = ' + pselector_dom.options[ausgewaehlte_planetenID].value);
			doc_main.location.href = url_main + pselector_dom.options[ausgewaehlte_planetenID].value;
		} else {
            console.info( 'planetenwechsel__auswahl__else' );
			// document.getElementsByTagName('a[href="fleet.php"]')[0].click();
			// fn_getHTML(url_fleet, fn_sendShips_fleet);
			// doc_main.location = url_fleet;
		}
		console.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n' + 'ausgewaehlte_planetenID: ' + doc_menu.getElementById('pselector_auswahl').selectedIndex);
	}
}
