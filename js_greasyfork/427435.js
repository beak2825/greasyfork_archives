// ==UserScript==
// @name         学习通自行填写学校名称
// @version      1.0
// @description  仅仅提供自行填写网页版学习通的学校名称。
// @author       Tan-xiansen
// @match        https://passport2.chaoxing.com/login?loginType=3&newversion=true&fid=-1*
// @grant        none
// @namespace https://greasyfork.org/users/668849
// @downloadURL https://update.greasyfork.org/scripts/427435/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E8%A1%8C%E5%A1%AB%E5%86%99%E5%AD%A6%E6%A0%A1%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/427435/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E8%A1%8C%E5%A1%AB%E5%86%99%E5%AD%A6%E6%A0%A1%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==
var inputunitname=document.querySelector('#inputunitname');
inputunitname.value="河北工程大学";//将此处改为自己学校名称。