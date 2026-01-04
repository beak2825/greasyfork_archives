// ==UserScript==
// @name         油ToYou
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Map words in the url
// @author       yjsx86
// @match        *://*.hostloc.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499425/%E6%B2%B9ToYou.user.js
// @updateURL https://update.greasyfork.org/scripts/499425/%E6%B2%B9ToYou.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    const dict = {
        "youtube": ["有图比", "油管", "右图比", "油土比"]
    }
    document.addEventListener('copy', (event) => {
        let selection = document.getSelection();
        let text = selection.toString().trim();
        const regex = /(?:http(s)?:\/\/)?(?:[\u4e00-\u9fa5\w-]+[.。])+[A-Za-z]+(?:\/[\w\-\._~:?#[\]@!\$&'\*\+,;=.]*)*/g;
        let found = text.match(regex);
        if (found == null){
            return
        }
        let url = found[0];
        url = url.replace("。", ".")
        outLoop:
        for (let [en, cns] of Object.entries(dict)) {
            for (let cn of cns){
                if(url.includes(cn)){
                    url = url.replace(cn, en);
                    break outLoop;
                }
            }
        }
        event.clipboardData.setData('text/plain', url);
        event.preventDefault();
    });
})();