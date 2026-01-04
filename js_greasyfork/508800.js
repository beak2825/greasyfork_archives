// ==UserScript==
// @name         Anti AFK
// @namespace    http://tampermonkey.net/
// @version      2024-09-17
// @description  Antri afk
// @author       You
// @match        https://florr.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=florr.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508800/Anti%20AFK.user.js
// @updateURL https://update.greasyfork.org/scripts/508800/Anti%20AFK.meta.js
// ==/UserScript==

(function() {
    let AFKTimeout = null;
    function handlerAFK(text, _this) {
        if (text === "I'm here" && !AFKTimeout) {
            let {e: x, f: y} = _this.getTransform();
            AFKTimeout = true;
            setTimeout(() => {
                var audio = new Audio('https://zvukogram.com/index.php?r=site/download&id=77737');
                audio.play();
                canvas.dispatchEvent(new MouseEvent("mousemove", {clientX: x, clientY: y}));
                canvas.dispatchEvent(new MouseEvent("mousedown"));
                document.dispatchEvent(new MouseEvent("mouseup"));
                AFKTimeout = false;
            }, (Math.floor(Math.random() * 15) + 3) * 1_000)
        }
    }
    function rewriteFillText() {
        function getCompatibleCanvas() {
            if (typeof (OffscreenCanvasRenderingContext2D) == 'undefined') {
                return [CanvasRenderingContext2D]
            }
            return [OffscreenCanvasRenderingContext2D, CanvasRenderingContext2D];
        }

        const idSymbol = Symbol('id');
        for (const {prototype} of getCompatibleCanvas()) {
            prototype[idSymbol] = prototype.fillText
        }

        for (const {prototype} of getCompatibleCanvas()) {
            prototype.fillText = function (text, x, y) {
                handlerAFK(text, this);
                return this[idSymbol](text, x, y);
            }

            prototype.fillText.toString = () => 'function toString() { [native code] }';
        }

    }
    rewriteFillText();
})();