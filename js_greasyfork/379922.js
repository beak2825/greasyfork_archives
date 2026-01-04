// ==UserScript==
// @name         AutoCloseTheStrong
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  automatically closes torn profile pages if target is not a punchbag
// @author       WizardRubic
// @match        *.torn.com/profiles.php*
// @grant        window.close

// @downloadURL https://update.greasyfork.org/scripts/379922/AutoCloseTheStrong.user.js
// @updateURL https://update.greasyfork.org/scripts/379922/AutoCloseTheStrong.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var isWeak = function(title) {
        // returns true if the targets is any of the following titles
        return title=="Punchbag" || title=="Healer" || title=="Loser";
    };
    var profileElement = (document.getElementsByClassName("content-wrapper")[0]);
    var callback = function(mutationsList) {
        var rankTitleElement = document.getElementsByClassName("two-row");
        if(rankTitleElement==undefined) {
            return;
        }
        var rankTitleArray = rankTitleElement[0];
        if(rankTitleArray == undefined) {
            return;
        }
        var title = rankTitleArray.children[1].innerText;
        if(title!=undefined && !isWeak(title)) {
            window.close();
        }
        observer.disconnect();
    };
    var mutationConfig = { attributes: true, childList: true, subtree: true };
    var observer = new MutationObserver(callback);
    observer.observe(profileElement, mutationConfig);
})();