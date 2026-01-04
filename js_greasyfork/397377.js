// ==UserScript==
// @name        防控信息自动填写 - neu.edu.cn
// @namespace   Violentmonkey Scripts
// @match       http://stuinfo.neu.edu.cn/cloud-xxbl/studentinfo
// @grant       none
// @version     2.0
// @author      做好事就留名
// @description 2020/3/5 上午9:08:50
// @downloadURL https://update.greasyfork.org/scripts/397377/%E9%98%B2%E6%8E%A7%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%20-%20neueducn.user.js
// @updateURL https://update.greasyfork.org/scripts/397377/%E9%98%B2%E6%8E%A7%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%20-%20neueducn.meta.js
// ==/UserScript==
var x=document.getElementsByTagName("input");
var y=document.getElementsByTagName("select");
var z=document.getElementsByTagName("textarea");
x[20].value="家";
x[21].value="无";
y[18].value="否";
y[20].value="否";
y[21].value="否";
y[22].value="否";
y[23].value="否";
y[24].value="否";
y[25].value="否";
y[26].value="无";
y[27].value="无";
y[28].value="无";
z[0].value="居家学习";