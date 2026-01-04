// ==UserScript== 
// @name         oa test 
// @version      0.6
// @description  oa  modification
// @author       Weismann 
// @match        *://oa.sspu.edu.cn/*
// @license      GPL License
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @connect      *
// @namespace https://greasyfork.org/users/710039
// @downloadURL https://update.greasyfork.org/scripts/416979/oa%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/416979/oa%20test.meta.js
// ==/UserScript==

function date(){
        var date = new Date();
        var year = date.getFullYear(); 
        var month = date.getMonth() + 1; 
        month= month < 10 ? ('0' + month) : month;
        var day = date.getDate(); 
        day = day < 10 ? ('0' + day) : day;
        return year + '-' + month + '-' + day;
      };
function date1(){
        var date = new Date();
        var year = date.getFullYear(); 
        var month = date.getMonth() + 1; 
        month= month < 10 ? ('0' + month) : month;
        var day = date.getDate(); 
        day = day < 10 ? ('0' + day) : day;
        day = day - 1;
        return year + '-' + month + '-' + day;
      };
var t = date1();
(function() {
setInterval(function(){
var d = document.getElementById("divWfBill").childNodes[1].contentDocument;
d.getElementsByTagName('span')[53].innerHTML = date();
d.getElementsByTagName('span')[109].innerHTML = t+" &nbsp  10:54:42";
d.getElementsByTagName('span')[116].innerHTML = t+" &nbsp  07:48:51";
     },100);
})();