// ==UserScript==
// @name        KA Editor Tools
// @version     0.1.4
// @namespace   https://www.khanacademy.org/profile/KnowMoreStuff/
// @icon        https://dl.dropboxusercontent.com/u/57161259/icons/cs-ohnoes-icon.png
// @homepageURL http://codeyourown.site/
// @author      Robert Stone
// @description Modifications/fixes for the Ace Editor embedded in Khan Academys programming projects.
// @include     http*://www.khanacademy.org/computer-programming/*
// @include     http*://www.khanacademy.org/computing/computer-programming/*/*/p/*
// @grant       GM_log
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/23213/KA%20Editor%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/23213/KA%20Editor%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForAjax() {
        var ed;
        var liveEd;
        try {
            liveEd = ScratchpadUI.liveEditor;
            ed = ScratchpadUI.liveEditor.editor.editor;
        } catch (e) {
            GM_log("KAET: Ajax not loaded yet.");
            return;
        }
        clearTimeout(timer);
        GM_log("KAET: Ajax loaded. Timer cleared.");

        ed.setShowInvisibles(true);

        $(".scratchpad-wrap-outer>div:first-child").attr("style","max-width: 100% !important");

        if (liveEd.editorType === "ace_webpage" || liveEd.editorType === "ace_sql" ) {
            $("div.scratchpad-canvas-wrap").attr("style","width: 50%; right: 0; left: auto;");
            ed.resize();
        }

        $("div[class^=\"bubble_\"]")
            .attr("style","top: auto !important; max-width: none !important;" +
                  " padding: 5px !important;" +
                  " position: fixed !important;" +
                  " right: 0px !important; left: 0px; width: 440px;" +
                  " bottom: 10px; height: 28px;");
    }

    var timer = setInterval(waitForAjax, 1000);
    GM_Log("KAET: Started ajax wait timer.");

})();
