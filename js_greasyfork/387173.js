// ==UserScript==
// @name         自动跳转百度智能小程序至真实地址
// @version      0.1
// @description  在百度智能小程序的mbd.baidu.com和po.baidu.com域名中自动跳转至真实地址。
// @namespace undefined
// @author       MC_Myth
// @match        http://*/*
// @match        https://*/*
// @downloadURL https://update.greasyfork.org/scripts/387173/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%99%BE%E5%BA%A6%E6%99%BA%E8%83%BD%E5%B0%8F%E7%A8%8B%E5%BA%8F%E8%87%B3%E7%9C%9F%E5%AE%9E%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/387173/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%99%BE%E5%BA%A6%E6%99%BA%E8%83%BD%E5%B0%8F%E7%A8%8B%E5%BA%8F%E8%87%B3%E7%9C%9F%E5%AE%9E%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
/*自动跳转百度小程序脚本*/
/*更新时间:2019/7/4 23:04*/
var domain=["mbd.baidu.com","po.baidu.com"];
function isStrInArray(str, arr) {
let n = arr.length;
for (let i = 0; i < n; i++) {
if (arr[i] == str) {return true;}}return false;}
if(isStrInArray(window.location.host,domain)){
function getQueryString(name) { var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); var r = window.location.search.substr(1).match(reg); if (r != null) return unescape(r[2]); return null; }
var source = getQueryString("web_url");
if(source==null){source = getQueryString("webUrl");}
if(source!=null){
setTimeout(function () {
window.location=source;
  }, 800);}}
/*酷安@MC_Myth*/
})();
