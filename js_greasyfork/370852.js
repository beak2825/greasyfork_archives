// ==UserScript==
// @name         Bilibili首页添加订阅番剧
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  anime is trash, so am I
// @author       ementt
// @match        https://www.bilibili.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370852/Bilibili%E9%A6%96%E9%A1%B5%E6%B7%BB%E5%8A%A0%E8%AE%A2%E9%98%85%E7%95%AA%E5%89%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/370852/Bilibili%E9%A6%96%E9%A1%B5%E6%B7%BB%E5%8A%A0%E8%AE%A2%E9%98%85%E7%95%AA%E5%89%A7.meta.js
// ==/UserScript==
(function() {
    'use strict';


    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

        var xmlhttp = new XMLHttpRequest();
        var t_mid = getCookie('DedeUserID')
        var url = 'https://space.bilibili.com/ajax/Bangumi/getList?mid=' + t_mid;
        var list = {};
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                list = JSON.parse(xmlhttp.responseText).data.result
                var bangumi = document.getElementById('bili_anime');
                var bans = '<div style="margin: 10px 0 20px 0">';
                for (var i = 0; i < 9; i++) {
                    var div = `<a href=${list[i].share_url.substring(5)} target="_blank" class="cover" style="margin-right:10px"><img src=${list[i].cover.substring(5)+'@110w_144h_100Q_1c.webp'}></img></a>`;
                    bans += div;
                }
                bans += '</div>'
                var doc = document.createRange().createContextualFragment(`<div class="zone-wrap-module report-wrap-module report-scroll-module clearfix"><a class="name" style="font-size:24px">订阅番剧</a>${bans}</div>`);
                bangumi.parentNode.insertBefore(doc, bangumi.nextSibling);

            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send()



})();