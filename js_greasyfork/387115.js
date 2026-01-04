// ==UserScript==
// @name         btn_神腦_會員中心
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://online.senao.com.tw/eventsite/checkin/9
// @grant    GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/387115/btn_%E7%A5%9E%E8%85%A6_%E6%9C%83%E5%93%A1%E4%B8%AD%E5%BF%83.user.js
// @updateURL https://update.greasyfork.org/scripts/387115/btn_%E7%A5%9E%E8%85%A6_%E6%9C%83%E5%93%A1%E4%B8%AD%E5%BF%83.meta.js
// ==/UserScript==

/*
            GM_openInTab(url, options)：開啟新的tabe
            active：焦點放在新開的頁面
            insert：將新的頁面放在目前頁面的後面
            setParent：取代目前頁面
*/
(function() {
     'use strict';
     var input=document.createElement("input");
     input.id="dm1";
     input.name="daimom";
     input.type="button";
     input.value="會員中心";
     input.onclick = showAlert;
     input.setAttribute("style", "font-size:26px;position:absolute;top:90px;left:10px;");
     document.body.appendChild(input);
})();

function showAlert(){
    var curTab = GM_openInTab ('https://online.senao.com.tw/Member','active');
}