// ==UserScript==
// @name         双击右键粘贴
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  双击右键粘贴，Chrome 浏览器测试通过
// @author       hostloc @大师兄
// @match        http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401732/%E5%8F%8C%E5%87%BB%E5%8F%B3%E9%94%AE%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/401732/%E5%8F%8C%E5%87%BB%E5%8F%B3%E9%94%AE%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var CONFIG = {
        threshold: 500,
        _storageKey: 'rightClickTime'
    };
    document.addEventListener('mouseup', function (e) {
        if (e.button === 2) {
            if (!window.localStorage.getItem(CONFIG._storageKey)) {
                window.localStorage.setItem(CONFIG._storageKey, String((new Date()).valueOf()));
            } else {
                var lastTime = Number(window.localStorage.getItem(CONFIG._storageKey));
                var thisTime = (new Date()).valueOf();
                window.localStorage.setItem(CONFIG._storageKey, String(thisTime));
                if (thisTime - lastTime <= CONFIG.threshold) {
                    if ((e.target.localName.toLowerCase() === 'input' || e.target.localName.toLowerCase() === 'textarea') && e.target.disabled === false) {
                        var inp = e.target;
                        console.log('pasted')
                        window.navigator.clipboard.readText().then(function (d) {
                            var cursurPosition = (inp.selectionStart) ? inp.selectionStart : null;
                            if (!cursurPosition && document.selection) {
                                var range = document.selection.createRange();
                                range.moveStart("character", -inp.value.length);
                                cursurPosition = range.text.length;
                            }
                            var oldVal = inp.value;
                            var newVal = oldVal.slice(0, cursurPosition) + d + oldVal.slice(cursurPosition);
                            inp.value = newVal;
                            window.localStorage.removeItem(CONFIG._storageKey);
                        })
                    }
                }
            }
        }
    });
})();