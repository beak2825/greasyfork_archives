// ==UserScript==
// @name         RPH星空插件 by 銀芽
// @version      1.2.2
// @description  Costum-skins, Better UI, Profile System, Hotkeys and TAG!!! and Multiboxxing!!!
// @author       Yinya銀芽
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @match        https://agario.xingkong.tw/
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agario.xingkong.tw
// @connect      rph-xk.web.app
// @connect      fuchsia.onrender.com
// @license      MIT
// @namespace https://greasyfork.org/users/912109
// @downloadURL https://update.greasyfork.org/scripts/500309/RPH%E6%98%9F%E7%A9%BA%E6%8F%92%E4%BB%B6%20by%20%E9%8A%80%E8%8A%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/500309/RPH%E6%98%9F%E7%A9%BA%E6%8F%92%E4%BB%B6%20by%20%E9%8A%80%E8%8A%BD.meta.js
// ==/UserScript==

document.documentElement.innerHTML = null, GM_xmlhttpRequest({
    method : "GET",
    url : 'https://rph-xk.web.app/RPH122enc.html',
    onload : function(e) {
        console.log(e.responseText)
        //var doc = inject(e.responseText);
        var doc = e.responseText
        console.log(doc)
        document.open();
        document.write(doc);
        document.close();
    }
});