// ==UserScript==
// @license MIT
// @name         lexiang-helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  lexiang video auto play
// @author       You
// @match        https://lexiangla.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lexiangla.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450574/lexiang-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/450574/lexiang-helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getElementsByXPath(xpath, parent)
    {
        let results = [];
        let query = document.evaluate(xpath, parent || document,
                                      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0, length = query.snapshotLength; i < length; ++i) {
            results.push(query.snapshotItem(i));
        }
        return results;
    };

    function autoClick(xpath, log) {
        var buttons = getElementsByXPath(xpath);
        if (buttons.length > 0){
            buttons[0].click();
        }else{
            console.log(log);
        };
    };

    function AutoNext(){
        autoClick('//*[@id="app-layout"]/div[4]/div/div/div[3]/button[1]', 'waiting for windows button...');
        AutoPlay()
    };
    function AutoPlay(){
        autoClick('//*[@id="video-player"]/button', 'waiting for auto paly button...');
        setTimeout(AutoNext, 1000);
    }
    AutoNext();

})();