// ==UserScript==
// @name        华医辅助 - 91huayi.com
// @namespace   Violentmonkey Scripts
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *://*.91huayi.com/*
// @grant       小小梁
// @version     1.0
// @author      -
// @description 2023/6/30 19:43:11
// @downloadURL https://update.greasyfork.org/scripts/478801/%E5%8D%8E%E5%8C%BB%E8%BE%85%E5%8A%A9%20-%2091huayicom.user.js
// @updateURL https://update.greasyfork.org/scripts/478801/%E5%8D%8E%E5%8C%BB%E8%BE%85%E5%8A%A9%20-%2091huayicom.meta.js
// ==/UserScript==
window.onload=(function () {


   setTimeout(function () {
     document.querySelector("#top_body > div.video-container > div.coent > div.r > div.r_bnt > a:nth-child(10)").click()

},5000)
 setTimeout(function () {
     document.querySelector("#div_processbar_tip > div > div > div.login_box2 > div.btn_box > button").click()

},8000)

     setTimeout(function () {
    document.querySelector("#div_processbar_tip > div > div > div.login_box2 > div.btn_box > button").click()
},11000)


   setTimeout(function () {
    document.querySelector("#jrks").click()
},13000)



              }
)();
