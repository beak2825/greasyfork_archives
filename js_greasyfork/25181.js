// ==UserScript==
// @name         Quiz Time Bypasser
// @namespace    Quiz Time Bypasser
// @version      2.0.1
// @copyright    2016+, Pakdefndr
// @description  The userscript helps you to loop timer again and again until you solve this quiz question.
// @author       Pak Defndr
// @include      http://quiz.vu.edu.pk/QuizQuestion.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25181/Quiz%20Time%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/25181/Quiz%20Time%20Bypasser.meta.js
// ==/UserScript==

(function() {
    function display() {
        if (sec >= 0) {
            document.getElementById("lblTime").innerHTML = sec;

        }
        if (sec <= 0) {
            if (document.getElementById('msgSubmit').innerHTML != 'Saving...') {
                document.getElementById("btnSave").style.visibility = 'hidden';
                document.getElementById("btnSave").style.display = 'none';
                document.getElementById('msgSubmit').style.visibility = 'visible';
                document.getElementById('msgSubmit').style.color = "Red";
                document.getElementById('msgSubmit').innerHTML = 'Question Timeout: Now loading next question...';
                document.location.href = 'GetQuestion.aspx';


            }
        }

        if (sec < 45) {

            if (document.getElementById("btnSave").disabled) {
                document.getElementById("imgAlertSelect").style.visibility = 'visible';
                document.getElementById("imgAlertSelect").style.display = 'inline';
            }
            else {
                document.getElementById("imgAlertSelect").style.visibility = 'hidden';
                document.getElementById("imgAlertSelect").style.display = 'none';
                document.getElementById("imgAlertSave").style.visibility = 'visible';
            }

        }


        if (sec > 0) {
            if (document.getElementById('msgSubmit').innerHTML != 'Saving...') {
                setTimeout(function() {display(); }, 1000);
            }

        }

    }
    addJS_Node (display);
    function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
        var D                                   = document;
        var scriptNode                          = D.createElement ('script');
        if (runOnLoad) {
            scriptNode.addEventListener ("load", runOnLoad, false);
        }
        scriptNode.type                         = "text/javascript";
        if (text)       scriptNode.textContent  = text;
        if (s_URL)      scriptNode.src          = s_URL;
        if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

        var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
        targ.appendChild (scriptNode);
    }
})();
