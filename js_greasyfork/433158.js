// ==UserScript==
// @name         潘晓来
// @include      http://web.chinahrt.com
// @version      1.3
// @description  进入视频自动开始并静音。移除自动暂停
// @match        https://web.chinahrt.com/course/*
// @author       cnmice
// @grant        none
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.min.js
/* globals jQuery, $, waitForKeyElements */
// @run-at       document-body
// @namespace https://github.com/yikuaibaiban/chinahrt
// @downloadURL https://update.greasyfork.org/scripts/433158/%E6%BD%98%E6%99%93%E6%9D%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/433158/%E6%BD%98%E6%99%93%E6%9D%A5.meta.js
// ==/UserScript==

function start(){
    var e = $("#iframe");
    var s = e.prop('src').replace('ifDrag=0','ifDrag=1');
    e.prop({'src':s});
}

setTimeout(start,2000)