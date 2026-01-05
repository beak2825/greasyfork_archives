// ==UserScript==
// @name         RemedyUI
// @namespace    http://remedy/
// @version      0.3.6
// @description  RemedyUI modification
// @author       Dejan
// @copyright    2016
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @match        http://remedy/arsys/forms/*
// @match        http://remedy.otn.local/arsys/forms/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @run-at       document-end
// @noframes
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/16804/RemedyUI.user.js
// @updateURL https://update.greasyfork.org/scripts/16804/RemedyUI.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

//Debug information
console.log('sandbox: me', window.jQuery().jquery);
console.log('sandbox: global', unsafeWindow.jQuery().jquery);

if (typeof jQuery == 'undefined') {  
  // jQuery is not loaded
  console.log('jQuery NOT loaded');
} else {
  // jQuery is loaded
  console.log('jQuery loaded '+$.fn.jquery);  
}


var usrText="";
//Get logged in users name
waitForKeyElements("#label301354000", getUser);


function getUser(jNode) {
    usrText = jNode.text ().trim ();
    if (usrText) {
        //console.log ("User is " + usrText);        
        //Process all rows
        waitForKeyElements("#T301444200 > tbody > tr", setStyle);  //overview console
        waitForKeyElements("#T302087200 > tbody > tr", setStyle);  //incident console
    }
    else
        return true;  //-- Keep waiting.
}


function setStyle (jNode) {
    var reLow = new RegExp(".*low.*"+usrText+".*", 'ig');
    var reMed = new RegExp(".*medium.*"+usrText+".*", 'ig');
    var reHigh = new RegExp(".*high.*"+usrText+".*", 'ig');
    var reCritical = new RegExp(".*critical.*"+usrText+".*", 'ig');
    
    //remove highlighting selected row
    jNode.removeClass("SelPrimary");
    jNode.click(function(){
      $(this).removeClass("SelPrimary"); 
    });
    
    //Process all columns
    jNode.each(function (k, v) {
        //set cell padding in table
        $(this).find("td").css("padding", "5px 0 5px 0");           
        
        if ($(this).text().match(reLow)) {  //Hightlight current signed in user
            $(this).css ("color", "#33691e");  //light green 900
            $(this).find("td").css("background-color", "#aed581");  //light green 300
        }else if($(this).text().match(reMed)){
            $(this).css ("color", "#e65100");  //orange 900
            $(this).find("td").css("background-color", "#ffb74d");  //orange 300
        }else if($(this).text().match(reHigh)){
            $(this).css ("color", "#b71c1c");  //red 900
            $(this).find("td").css("background-color", "#e57373");  //red 300
        }else if($(this).text().match(reCritical)){
            $(this).css ("color", "#fff");  //white
            $(this).find("td").css("background-color", "#d32f2f");  //red 700
        }else if($(this).text().match("Low")){  //Hightlight Other users
            $(this).css ("color", "#33691e");  //light green 900
            $(this).find("td").css("background-color", "#dcedc8");  //light green 100
        }else if($(this).text().match("Medium")){
            $(this).css ("color", "#e65100");  //orange 900
            $(this).find("td").css("background-color", "#ffe0b2");  //orange 100
        }else if($(this).text().match("High")){
            $(this).css ("color", "#b71c1c");  //red 900
            $(this).find("td").css("background-color", "#ffcdd2");  //red 100
        }else if($(this).text().match("Critical")){
            $(this).css ("color", "#fff");  //white
            $(this).find("td").css("background-color", "#ef5350");  //red 400
        }
    });
}

//change title color
$("#WIN_0_301493400 > table > tbody > tr > td").css("color","#8cc63c");


//no space after \
GM_addStyle("                                       \
/*hide annoying summary tooltip*/                   \
#artooltip{                                         \
  visibility: hidden !important                     \
}                                                   \
/*highlight on mouse hover*/                        \
#T301444200 > tbody > tr:nth-child(n+1):hover td,   \
#T302087200 > tbody > tr:nth-child(n+1):hover td{   \
  background-color: yellow !important;              \
}                                                   \
@font-face {                                                                                                               \
  font-family: 'Ubuntu';                                                                                                   \
  font-style: normal;                                                                                                      \
  font-weight: 400;                                                                                                        \
  src: local('Ubuntu'), url('https://fonts.gstatic.com/s/ubuntu/v8/sDGTilo5QRsfWu6Yc11AXg.woff2') format('woff2');         \
}                                                                                                                          \
*{                                                                                                                         \
  font-family: 'Ubuntu', sans-serif !important;                                                                            \
}                                                                                                                          \
/*change table heading*/                                           \
#WIN_2_301444200 > div.TableInner > div > div.BaseTableColHeaders, \
#WIN_3_302087200 > div.TableInner > div > div.BaseTableColHeaders, \
#WIN_2_302087200 > div.TableInner > div > div.BaseTableColHeaders{ \
  padding: 0 0 30px 0;                                             \
  background: #2196f3;                                             \
}                                                                  \
#WIN_2_301444200 > div.TableInner > div > div.BaseTableColHeaders > div:nth-child(n+1),  \
#WIN_3_302087200 > div.TableInner > div > div.BaseTableColHeaders > div:nth-child(n+1),  \
#WIN_2_302087200 > div.TableInner > div > div.BaseTableColHeaders > div:nth-child(n+1){  \
  padding: 10px 0 20px 4px;                                                              \
  color: #fff;                                                                           \
  background: transparent;                                                               \
}                                                                                        \
#WIN_2_301444200 > div.TableInner > div > div.BaseTableInner,                            \
#WIN_3_302087200 > div.TableInner > div > div.BaseTableInner,                            \
#WIN_2_302087200 > div.TableInner > div > div.BaseTableInner{                            \
  top:30px !important;                                                                   \
  height: calc(100% - 30px) !important;                                                  \
}                                                                                        \
/*Increase text size in Notes window*/  \
#editor{                                \
  font-size: 14px;                      \
}                                       \
");



/*Reference link: https://gist.github.com/raw/2625891/waitForKeyElements.js */
/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
