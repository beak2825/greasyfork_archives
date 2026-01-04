// ==UserScript==
// @name         iStudy_test
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  bypass iStudy test win alert
// @author       maxyeh
// @match        https://istudy.ntut.edu.tw/learn/exam/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479282/iStudy_test.user.js
// @updateURL https://update.greasyfork.org/scripts/479282/iStudy_test.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function warningDetectSpot () {
        // WHATEVER YOU WANT FOR THE NEW CODE GOES HERE.
        console.log("已解除切窗限制:warningDetectSpot")
    }

    function init_winlock(){
        console.log("已解除切窗限制:init_winlock")
    }



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

    addJS_Node (warningDetectSpot);
    addJS_Node (init_winlock);

    // Your code here...
})();