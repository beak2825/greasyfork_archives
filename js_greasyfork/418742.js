// ==UserScript==
// @name         Github左栏加宽
// @namespace    blog.whscat.top
// @version      0.1
// @description  调整左栏避免名字长的仓库在左栏折行显示
// @author       Anxys Uaen
// @match        https://github.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418742/Github%E5%B7%A6%E6%A0%8F%E5%8A%A0%E5%AE%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/418742/Github%E5%B7%A6%E6%A0%8F%E5%8A%A0%E5%AE%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var obj= document.getElementsByClassName("team-left-column");
    obj.item(0).style.cssText = "max-width:900px;width: 450px;";
})();