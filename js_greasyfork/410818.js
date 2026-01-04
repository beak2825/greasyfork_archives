// ==UserScript==
// @name         GLPI GUI
// @namespace    https://greasyfork.org/fr/scripts/410818-glpi-gui
// @version      1.2
// @description  try to take over the world!
// @author       cdavid@equipages.fr
// @include      https://support.equipages.fr/*
// @include      http://support.equipages.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410818/GLPI%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/410818/GLPI%20GUI.meta.js
// ==/UserScript==


//============================= CHECK ENV.

var base_url =  window.location.origin;
var host =      window.location.host;
var pathArray = window.location.pathname.toString();
console.info(new Date(Date.now()),      'GLPI GUI: Start from  ', document.location.href);
console.info(new Date(Date.now()),      'GLPI GUI: base_url    ', base_url );
console.info(new Date(Date.now()),      'GLPI GUI: host        ', host     );
console.info(new Date(Date.now()),      'GLPI GUI: pathArray   ', pathArray);

//============================= LOAD JQUERY
function run() {
    console.log('GLPI GUI: *** jQuery RUNNING');
    // jQuery loading
    function addJQuery(callback) {
        var script = document.createElement("script");
        script.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
        script.addEventListener('load', function() {
            var script = document.createElement("script");
            script.textContent = "window.JQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
            document.body.appendChild(script);
        }, false);
        document.body.appendChild(script);
    }

    function main() {

        console.log('GLPI GUI: *** jQuery Supprime la largeur max du formulaire');
        JQ('#tab_cadre_fixe').remove;
        //JQ('#mainformtable').css('width','1500px');
        //JQ('span.mainmenu').html(JQ('span.mainmenu').html().replace(/Vous n.avez pas de nouveaux messages/, 'Messages'));  // Reduit ligne de Menu
        //JQ('.liteoption.button2:submit').val("Prévisualisation");             // Reduit Button d'envoi
        //JQ('.liteoption.button2:button').val("Prévisualisation & Ortho.");    // Reduit Button d'envoi2
        //JQ('select[name=f]').width('100px');                                  // Selecteur bas de page 'Sauter vers'
        //JQ('select[name=postorder]').width('100px');                          // Selecteur bas de page 'Ordre des Posts'
        //JQ('#helpbox1').remove();                                             // Ligne d'aide Edition commentaire trop longue.


    } // END MAIN

    // load jQuery and execute the main function
    //console.time('MODIFICATION TIME');
    addJQuery(main);
    //console.timeEnd('MODIFICATION TIME');

}

//============================= DIRECT OLD SCHOOL START

function LOAD(){
    console.info(new Date(Date.now()),     'GLPI GUI: function START  ',arguments.callee.name);
    'use strict';
    var elements = '';

    //-------------------------
    elements           =    document.getElementById("mainformtable")                ;
    if (elements)    {
        console.info('Found ',elements.length ,' Id mainformtable : '        ,elements );
        // elements.value =    USER;
        // elements.focus();
    }

    //-------------------------
    elements           =    document.getElementsByClassName('tab_cadre_fixe')          ;           // TICKET FORM
    if (elements)    {
        console.info('Found ',elements.length ,' Class tab_cadre_fixe    : ' ,elements );
        for(var i=0, len=elements.length; i<len; i++)
        {
            elements[i].style['max-width'] =    'initial';
        }

    }

    //-------------------------
    elements           =    document.getElementsByClassName("tab_cadre_fixehov")          ;         // TABLES
    if (elements.length>0)    {
        console.info('Found ',elements.length ,' Class tab_cadre_fixehov : ' ,elements );
        for(var i=0, len=elements.length; i<len; i++)
        {
            elements[i].style['max-width'] =    'initial';
            elements[i].style['border-spacing'] =    '4px'; // Ajout bordure sur cellules tableaux
        }
    }

    //-------------------------
    elements           =    document.getElementsByClassName("tab_cadrehov")          ;              // TABLES
    if (elements.length>0)    {
        console.info('Found ',elements.length ,' Class tab_cadrehov      : ' ,elements );
        for(var i=0, len=elements.length; i<len; i++)
        {
            elements[i].style['max-width'] =    'initial';
            elements[i].style['border-spacing'] =    '4px'; // Ajout bordure sur cellules tableaux
        }
    }

    //-------------------------
    elements           =    document.getElementsByClassName('tab_glpi')          ;                  //  TABLE HEADER (Bouton ACTION)
    if (elements.length>0)    {
        console.info('Found ',elements.length ,' Class tab_glpi          : ' ,elements );
        for(var i=0, len=elements.length; i<len; i++)
        {
            elements[i].style['width']     =    'initial';
        }
    }
    //-------------------------
    elements           =    document.getElementsByClassName('ui-tabs-anchor')          ;             // LI Menu Top gauche ONClick ?
    if (elements.length>0)    {
        console.info('Found ',elements.length ,' Class ui-tabs-anchor    : ' ,elements );
        for(var i=0, len=elements.length; i<len; i++)
        {
            //elements[i].onclick =    'LOAD()';
            elements[i].setAttribute("onclick","LOAD()");
            //elements[i].style['width']     =    'initial';
        }
    }

    //-------------------------
    elements           =    document.getElementsByClassName('tab_bg_2')          ;             // Essai d'elargir les colonnes DATE/TIME en no-wrap
    if (elements[5])    {
        console.info('Found ',elements.length ,' Class tab_bg_2 TICKET ? : ' ,elements );

        if (elements[5].childNodes[24])    {
            console.info('Found ',elements.length ,' Class tab_bg_2 COLL     : ' ,elements[5].childNodes[24] );
            elements[5].childNodes[24].style['white-space'] = 'nowrap';
        }

        if (elements[5].childNodes[28])    {
            console.info('Found ',elements.length ,' Class tab_bg_2 COLL     : ' ,elements[5].childNodes[28] );
            elements[5].childNodes[28].style['white-space'] = 'nowrap';
        }

    } // ENDIF


    // window.setTimeout(function(){     elements[0].click();        }, 2000)      ;               //---------> 2 SECOND DELAY

    console.info(new Date(Date.now()),     'GLPI GUI: function STOP   ',arguments.callee.name);

} // LOAD STOP

//============================= DIRECT OLD SCHOOL END






//============================= START FUNCTION run ONCE LOADED

window.setTimeout(LOAD, 1000);
console.info(new Date(Date.now()),     'GLPI GUI: INITIAL LOAD OK   ',arguments.callee.name);
window.addEventListener('click',LOAD, false);
console.info(new Date(Date.now()),     'GLPI GUI: ADD EventListener OK   ',arguments.callee.name);

document.body.onclick = LOAD();

//window.setTimeout(run, 1);
//window.setInterval(LOAD, 2000);

