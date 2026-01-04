// ==UserScript==
// @name         My Ref on Amazon (auch über MD)
// @namespace    http://dealz.rrr.de/
// @version      20.09.222
// @description  Unterstütze einen Ref deiner Wahl
// @author       Gnadelwartz
// @match        https://www.amazon.de/*
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-3.5.1.slim.min.js
// @require      https://cdn.jsdelivr.net/gh/gnadelwartz/GM_config@3bfccb1cb4238694566ec491ee83d8df94da18d5/GM_config-min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/406537/My%20Ref%20on%20Amazon%20%28auch%20%C3%BCber%20MD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/406537/My%20Ref%20on%20Amazon%20%28auch%20%C3%BCber%20MD%29.meta.js
// ==/UserScript==
var myRef=GM_getValue( "myRef", "tag=offtopic-21");
var startDate = new Date().getTime();
var lastDate = GM_getValue( "lastDate", "0");

var enMyLocation=window.location.href;
// redirect smile to www
enMyLocation.replace(/smile\.amazon\.de\//i, "www.amazon.de/");
// valid order done
if( enMyLocation.includes(".amazon.de/gp/buy/thankyou")) {
    setTimeout(function() {
        window.location.href="https://www.amazon.de/?"+myRef;
    }, 2000);
}
// current tag= is not in URL
if( enMyLocation.includes(".amazon.de") && ! enMyLocation.includes(myRef)) {
    // convert old format to current
    if (enMyLocation.includes("/exec/obidos/")) {
        GM_setValue( "lastDate", startDate);
        window.location.href=enMyLocation.replace(/\/exec\/obidos\/ASIN\/(..........).*/i, "/dp/$1/?"+myRef);
    }
    // found tag, replace with myRef
    if (/[?&]tag=/i.test(enMyLocation)) {
        GM_setValue( "lastDate", startDate);
        window.location.href=enMyLocation.replace(/([?&])tag=.*(-21)*/i, "$1"+myRef);
    } else {
        // no tag, add myRef every x minutes
        if ( (startDate - parseInt(lastDate)) > 60000*5) {
            GM_setValue( "lastDate", startDate);
            if(enMyLocation.includes("?")) {
                // no parameter, use ? for ref
                window.location.href=enMyLocation+"&"+myRef;
            } else {
                // parameter, use & for ref
                window.location.href=enMyLocation+"?"+myRef;
            }
        }

    }
}

GM_config.init(
{
  'id': 'MyRef', // The id used for this instance of GM_config
  'title': 'My Ref Config',
  'fields': // Fields object
  {
   'select':
    {
      'label': '<br>W&auml;hle einen vordefinierten Ref oder Freitext f&uuml;r einen eigenen Ref', // Appears next to field
      'section': ['Setze einen Ref für Amazon.de', 'Es wurde noch kein Ref ausgew&auml;hlt oder Du willst den Ref &auml;ndern'],
      'type': 'radio', // Makes this setting a series of radio elements
      'options': ['dealz.rrr.de  <a target="_blank" href="https://dealz.rrr.de">&gt;&gt;</a><br>',
                  'suppentanten.de <a target="_blank" href="http://suppentanten.de">&gt;&gt;</a><br>',
                  'elektriker-ohne-grenzen.de <a target="_blank" href="https://elektriker-ohne-grenzen.de">&gt;&gt;</a><br>',
                  'BoD Zirkel - geheim ;-)<br>',
                  'Do not track!<br><br>',
                  'Freitext'], // Possible choices
      'default': '' // Default value if user doesn't change it
    },
    'text': // This is the id of the field
    {
      'label': 'Ref in der Form <em>"tag=xxx-21"</em>', // Appears next to field
      'type': 'text', // Makes this setting a text field
      'default': myRef // Default value if user doesn't change it
    }
  },
  'css': '#myRef {margin: 0.4em; background-color: gainsboro;} #MyRef .config_var {margin: 0px; padding: 0 10 0 3em;} #myRef div, #myRef button, #MyRef_section_desc_0 {padding: 0.2em; border-radius: 4px}',
  'events': // Callback functions object
  {
    'save': function() { setConfig(); },
  }
});

function setConfig() {
    switch (GM_config.get('select').charAt(0)) {
        case "d":
            myRef="tag=offtopic-21";
            break;
        case "s":
            myRef="tag=suppentante-21";
            break;
        case "e":
            myRef="tag=elekohnegren-21";
            break;
        case "B":
            myRef="tag=speck-21";
            break;
        case "D":
            myRef="tag=donotrack-21";
            break;
        case "F":
            var tmp=GM_config.get('text')
            if (tmp.startsWith("tag=") &&  tmp.endsWith("-21")) {
                myRef=tmp;
            } else {
                alert("Eingegebener Text entspricht nicht dem Muster tag=xxx-21, setze auf default.")
                myRef="tag=offtopic-21"
            }
            break;
        default:
            myRef="tag=offtopic-21";
            break;
    }
    GM_setValue("myRef",myRef);
    GM_config.close();
}

function setRef() {
    GM_config.open();
}

function readyFn( jQuery ) {
    // insert button for config
    $( "#nav-tools" ).prepend(
        "<div id='myRefConfig' class='nav-a nav-a-2 icp-link-style-2' style='color: #FFCC00; padding-top: .5em; cursor: pointer;'>myR</div>"+
        "<style>.nav-search-field {min-width: 15em !important;}</style>"
    );
    $( "#myRefConfig" ).click(function() {
        setRef();
    });
    // no ref saved, ask for one
    if (GM_getValue( "myRef", "") == "") {
        setRef();
    }
}

$( document ).ready( readyFn );