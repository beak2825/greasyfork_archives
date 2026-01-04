// ==UserScript==
// @name         yande.re keypress a-d-favs 快速收藏
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  使用键A添加收藏，键D移除收藏
// @author       rowink
// @match        https://yande.re/post/show*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437325/yandere%20keypress%20a-d-favs%20%E5%BF%AB%E9%80%9F%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/437325/yandere%20keypress%20a-d-favs%20%E5%BF%AB%E9%80%9F%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==

(function () {
    "use strict";
    window.addEventListener('keypress', function (e) {
        if (e.code == "KeyA") {
            let to_favs = document.querySelector('#add-to-favs>a');
            if (to_favs != null) {
                to_favs.click();
            }
        } else if (e.code == "KeyD") {
            let un_favs = document.querySelector('#remove-from-favs>a');
            if (un_favs != null) {
                un_favs.click();
            }
        }
    });
})();