// ==UserScript==
// @name         loc添加超链接
// @namespace    http://tampermonkey.net/
// @version      0.5.0
// @description  添加超链接的同时，能够清除斯巴达、搬瓦工、vir、hetzner、dmit、绿云、RN的aff
// @author       Faxlok
// @match        https://hostloc.com/thread-*.html
// @match        https://hostloc.com/forum.php?mod=viewthread&tid=*&highlight=*
// @match        https://hostloc.com/forum.php?mod=viewthread&tid=*&page=*
// @icon         https://www.google.com/s2/favicons?domain=hostloc.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442843/loc%E6%B7%BB%E5%8A%A0%E8%B6%85%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/442843/loc%E6%B7%BB%E5%8A%A0%E8%B6%85%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

       let c = document.querySelectorAll('.plhin'),
           r = new RegExp('(?<!font size="2"><a href="|">)((?<!src="|href="|url=)https?:\/\/.*?)(<|&nbsp;|，|,|[\u4e00-\u9fa5]|）| )', 'gm');

       for (let i = 0; i < c.length; i++)
       {
           // 转换为超链接
           let t = c[i];
           if (r.test(t.innerHTML))
              t.innerHTML = t.innerHTML.replace(/油管|有图比/gm,'youtube').replace(/推特/gm,'twitter').replace(r,'<a href="$1" target="_blank">$1</a>$2');
           // 去掉aff
           t.innerHTML = t.innerHTML.replace(/aff\.php/gm,'cart.php').replace(/aff=\d+/gm,'a=add').replace(/\/aff\/\w*|ref=\w+/gm,'');
       }
})();