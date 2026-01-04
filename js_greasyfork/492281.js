// ==UserScript==
// @name         suizhikuo-VisualEvent
// @namespace    http://tampermonkey.net/
// @version      2024-04-12
// @description  把 https://sprymedia.co.uk/article/Visual+Event+2 官网的 VisualEvent 做成篡改猴脚本
// @author       suizhikuo
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sprymedia.co.uk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492281/suizhikuo-VisualEvent.user.js
// @updateURL https://update.greasyfork.org/scripts/492281/suizhikuo-VisualEvent.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // debugger;
    console.log("篡改猴(Tampermonkey)脚本 ---> 加载VisualEvent ---> 完成");

    var protocol = window.location.protocol === 'file:' ? 'http:' : '';
    var url = protocol + '//www.sprymedia.co.uk/VisualEvent/VisualEvent_Loader.js';
    if (typeof VisualEvent != 'undefined') {
        if (VisualEvent.instance !== null) {
            VisualEvent.close();
        } else {
            new VisualEvent();
        }
    } else {
        var n = document.createElement('script');
        n.setAttribute('language', 'JavaScript');
        n.setAttribute('src', url + '?rand=' + new Date().getTime());
        document.body.appendChild(n);
    }
})();