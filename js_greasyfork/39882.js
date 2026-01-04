// ==UserScript==
// @name hwm_war5
// @description hwm_html5war
// @version 0.1
// @encoding utf-8
// @include http://www.heroeswm.ru/war.php*
// @exclude */rightcol.php*
// @exclude */ch_box.php*
// @exclude */chat*
// @exclude */ticker.html*
// @exclude */frames*
// @exclude */brd.php*
// @grant GM_getValue

// @namespace https://greasyfork.org/users/176333
// @downloadURL https://update.greasyfork.org/scripts/39882/hwm_war5.user.js
// @updateURL https://update.greasyfork.org/scripts/39882/hwm_war5.meta.js
// ==/UserScript==
var url_cur = location.href;
if(url_cur.indexOf('html5')===-1){
location.href = url_cur + '&html5=1';
}
//===