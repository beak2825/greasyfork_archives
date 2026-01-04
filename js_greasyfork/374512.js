// ==UserScript==
// @name        강제 출처 붙이기 방지 I
// @description   일부 광고 제거, 쓰레기같은 'autosourcing' 스크립트를 차단
// @include     *://www.ilbe.com/*
// @author      리드(http://www.suyongso.com)
// @version      1.201R
// @run-at      document-start
// @namespace https://greasyfork.org/users/226807
// @downloadURL https://update.greasyfork.org/scripts/374512/%EA%B0%95%EC%A0%9C%20%EC%B6%9C%EC%B2%98%20%EB%B6%99%EC%9D%B4%EA%B8%B0%20%EB%B0%A9%EC%A7%80%20I.user.js
// @updateURL https://update.greasyfork.org/scripts/374512/%EA%B0%95%EC%A0%9C%20%EC%B6%9C%EC%B2%98%20%EB%B6%99%EC%9D%B4%EA%B8%B0%20%EB%B0%A9%EC%A7%80%20I.meta.js
// ==/UserScript==


function completeGetList () {
//     var newParagraph            = document.createElement ('p');
//     newParagraph.textContent    = "I was added by the new, good init() function!";
//     document.body.appendChild (newParagraph);3
    console.log("test");
}

/*--- Check for bad scripts to intercept and specify any actions to take.
*/

checkForBadJavascripts ( [
    [true,  /teamcsp/g,  null ],
    [true,  /ad_board_print.js/,  null ],
    [true,  /ad_bbs_list.js/,  null ],
    [true,  /showad.js/,  null ],
    [true,  /extFile01.js/,  null ],
    [true,  /sxp2\/fo.js/,  null ],
    [true,  /geniee/,  null ],
    [true,  /1.0\/jstag/,  null ],
    [true,  /impactify.io/,  null ],
    [true,  /autosourcing.open.js/,  null ],
    [true,  /gpt.js/, null ],
    [false,  /openx/,  null ],
    [false,  /teamcsp/g,  null ],
    [false,  /pubads/g,  null ],
//     [false,  /completeDeleteTrackback/,   function () {addJS_Node (completeGetList);}   ],
   
] );
function checkForBadJavascripts (controlArray) {
    /*--- Note that this is a self-initializing function.  The controlArray
        parameter is only active for the FIRST call.  After that, it is an
        event listener.

        The control array row is  defines like so:
        [bSearchSrcAttr, identifyingRegex, callbackFunction]
        Where:
            bSearchSrcAttr      True to search the SRC attribute of a script tag
                                        example: <script type="text/javascript" src="http://jsbin.com/evilExternalJS/js"></script> ==> true
                                false to search the TEXT content of a script tag.
                                        example: newParagraph.textContent    = "I was added by the old, evil init() function!"; ==> false
            identifyingRegex    A valid regular expression that should be unique
                                to that particular script tag.
            callbackFunction    An optional function to execute when the script is
                                found.  Use null if not needed.
    */
    if ( ! controlArray.length) return null;

    checkForBadJavascripts      = function (zEvent) {

        for (var J = controlArray.length - 1;  J >= 0;  --J) {
            var bSearchSrcAttr      = controlArray[J][0];
            var identifyingRegex    = controlArray[J][1];

            if (bSearchSrcAttr) {
                if (identifyingRegex.test (zEvent.target.src) ) {
                    stopBadJavascript (J);
                    return false;
                }
            }
            else {
                if (identifyingRegex.test (zEvent.target.textContent) ) {
                    stopBadJavascript (J);
                    return false;
                }
            }
        }

        function stopBadJavascript (controlIndex) {
            zEvent.stopPropagation ();
            zEvent.preventDefault ();

            var callbackFunction    = controlArray[J][2];
            if (typeof callbackFunction == "function")
                callbackFunction ();

            //--- Remove the node just to clear clutter from Firebug inspection.
            zEvent.target.parentNode.removeChild (zEvent.target);

            //--- Script is intercepted, remove it from the list.
            controlArray.splice (J, 1);
            if ( ! controlArray.length) {
                //--- All done, remove the listener.
                window.removeEventListener (
                    'beforescriptexecute', checkForBadJavascripts, true
                );
            }
        }
    }

    /*--- Use the "beforescriptexecute" event to monitor scipts as they are loaded.
        See https://developer.mozilla.org/en/DOM/element.onbeforescriptexecute
        Note that it does not work on acripts that are dynamically created.
    */
    window.addEventListener ('beforescriptexecute', checkForBadJavascripts, true);

    return checkForBadJavascripts;
}

function addJS_Node (text, s_URL, funcToRun) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    //--- Don't error check here. if DOM not available, should throw error.
    targ.appendChild (scriptNode);
}