// ==UserScript==
// @name         vclass test
// @icon        https://ae01.alicdn.com/kf/Hea204b09a9c648adb1960bcdfd163155L.jpg
// @namespace    https://www.luogu.com.cn/user/45415
// @version      1.2
// @description  老师使用网络工具来攻破学生的暑假，学生必须作出回应。
// @author       kekjy
// @match        live.polyv.cn/watch/*
// @grant        kekjy
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/427307/vclass%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/427307/vclass%20test.meta.js
// ==/UserScript==

//'use strict';
var beat = "1.2"
var datas = "kevp-20200403";
var named = "vclass自动签到"
function hasClass(element, cls) {
 return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
}