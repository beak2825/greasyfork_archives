// ==UserScript==
// @name         SYNU-OA
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        http*://oa*.synu.edu.cn/index_tt.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415715/SYNU-OA.user.js
// @updateURL https://update.greasyfork.org/scripts/415715/SYNU-OA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.frames["iFrame1"].location.href = "list.aspx?is_parent=1&class_id=4";
})();