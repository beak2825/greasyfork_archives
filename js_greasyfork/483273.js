// ==UserScript==
// @name         兼容PointerEvent与MouseEvent
// @version      1.0
// @description  解决PointerEvent中没有e.path的问题
// @author       期期
// @match        *
// @grant        none
// @namespace https://greasyfork.org/users/1240077
// @downloadURL https://update.greasyfork.org/scripts/483273/%E5%85%BC%E5%AE%B9PointerEvent%E4%B8%8EMouseEvent.user.js
// @updateURL https://update.greasyfork.org/scripts/483273/%E5%85%BC%E5%AE%B9PointerEvent%E4%B8%8EMouseEvent.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("click",e=>e.path=e.path||[e.target],true)
    // Your code here...
})();