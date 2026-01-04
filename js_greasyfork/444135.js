// ==UserScript==
// @name         fuck Edge主页的在线office
// @namespace
// @version      0.1
// @description  将Edge首页的在线offcie四套件链接重新跳转到office.com
// @author       abola
// @match        https://www.microsoft.com/zh-cn/microsoft-365/free-productivity-apps?ocid=PROD_Edge_CONS_WebXT_FM_EDG_NTP-Waffle-*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/324454
// @downloadURL https://update.greasyfork.org/scripts/444135/fuck%20Edge%E4%B8%BB%E9%A1%B5%E7%9A%84%E5%9C%A8%E7%BA%BFoffice.user.js
// @updateURL https://update.greasyfork.org/scripts/444135/fuck%20Edge%E4%B8%BB%E9%A1%B5%E7%9A%84%E5%9C%A8%E7%BA%BFoffice.meta.js
// ==/UserScript==

var newurl = "https://www.office.com/launch/"+document.URL.match('(?<=Waffle-).*(?=&rtc=1)');
if (newurl != document.URL) location.replace(newurl);