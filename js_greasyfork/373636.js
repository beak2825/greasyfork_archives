// ==UserScript==
// @name css-巴哈姆特文章列表廣告欄位刪除
// @namespace http://tampermonkey.net/
// @version 1.0.0
// @description BAHA NO AD
// @author MinoRaiNy
// @include https://forum.gamer.com.tw*
// @match http://*/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/373636/css-%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%96%87%E7%AB%A0%E5%88%97%E8%A1%A8%E5%BB%A3%E5%91%8A%E6%AC%84%E4%BD%8D%E5%88%AA%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/373636/css-%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%96%87%E7%AB%A0%E5%88%97%E8%A1%A8%E5%BB%A3%E5%91%8A%E6%AC%84%E4%BD%8D%E5%88%AA%E9%99%A4.meta.js
// ==/UserScript==

(function() {
'use strict';
var elements = document.getElementsByClassName("b-list_ad");
while(elements.length > 0)
{
    elements[0].parentNode.removeChild(elements[0]);
}
})();