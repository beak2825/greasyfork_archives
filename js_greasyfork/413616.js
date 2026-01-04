// ==UserScript==
// @name           Mazda.co.jp Patcher
// @name:en        Mazda.co.jp Patcher
// @version        1.0.5
// @author         Pavvel071
// @description    Восстановление ссылок для backup материалов с mazda.co.jp
// @description:en Restore links for backup of mazda.co.jp 
// @grant          none
// @include        *://euroesi.mazda.co.jp/*
// @namespace https://greasyfork.org/users/695881
// @downloadURL https://update.greasyfork.org/scripts/413616/Mazdacojp%20Patcher.user.js
// @updateURL https://update.greasyfork.org/scripts/413616/Mazdacojp%20Patcher.meta.js
// ==/UserScript==
var r=/(.*mazda.co.jp\/).*\?path=(.*\/html\/).*/g;var rr=r.exec(document.URL);var t=rr[1]+rr[2]+'{0}.html';
for(var l of document.getElementsByTagName('a')){if(l.onclick!=null){l.href=t.replace('{0}', l.name)}}