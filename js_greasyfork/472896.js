// ==UserScript==
// @name         采石场放置（Into The Quarry）自动点击完美按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  采石场放置（Into The Quarry）自动点击完美按钮，须停留在按钮界面方可生效
// @author       Ymmzy
// @match        https://g1tyx.github.io/into-the-quarry/
// @match        https://into-the-quarry.g8hh.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=g8hh.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472896/%E9%87%87%E7%9F%B3%E5%9C%BA%E6%94%BE%E7%BD%AE%EF%BC%88Into%20The%20Quarry%EF%BC%89%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%AE%8C%E7%BE%8E%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/472896/%E9%87%87%E7%9F%B3%E5%9C%BA%E6%94%BE%E7%BD%AE%EF%BC%88Into%20The%20Quarry%EF%BC%89%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%AE%8C%E7%BE%8E%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function imitateClick(oElement, iClientX, iClientY) {
        var oEvent;
        if (document.createEventObject) {
            oEvent = document.createEventObject();
            oEvent.clientX = iClientX;
            oEvent.clientY = iClientY;
            oElement.fireEvent("onclick", oEvent)
        } else {
            oEvent = document.createEvent("MouseEvents");
            oEvent.initMouseEvent("click", true, true, document.defaultView, 0, 0, 0, iClientX, iClientY);
            oElement.dispatchEvent(oEvent)
        }
    };
    function pxToInteger(str) {
        return Math.round(Number(str.slice(0,-2)).toFixed(0));
    };
    self.autoClickButton = setInterval(() => {
        const btn = document.querySelector("#button");
        if (btn) {
            imitateClick(btn, pxToInteger(btn.style.left) + 50, pxToInteger(btn.style.top) + 50);
        }
    }, 10);
})();