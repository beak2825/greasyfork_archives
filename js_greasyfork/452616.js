// ==UserScript==
// @name         TD運輸署預約版面自動完成
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  運輸署預約版面自動完成
// @author       You
// @match        https://eapps-queue.td.gov.hk/*
// @match        https://eapps1.td.gov.hk/*
// @match        https://eapps2.td.gov.hk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.hk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452616/TD%E9%81%8B%E8%BC%B8%E7%BD%B2%E9%A0%90%E7%B4%84%E7%89%88%E9%9D%A2%E8%87%AA%E5%8B%95%E5%AE%8C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/452616/TD%E9%81%8B%E8%BC%B8%E7%BD%B2%E9%A0%90%E7%B4%84%E7%89%88%E9%9D%A2%E8%87%AA%E5%8B%95%E5%AE%8C%E6%88%90.meta.js
// ==/UserScript==
 
 
//當遇到put into a new quene時自動click入去
setTimeout(function(){
document.querySelector("#MainPart_divWarningBox > p > a > span.l").click()
}
,)
 
 
 
//select預約重考生快期
setTimeout(function(){
document.querySelector("#contentPanel > div:nth-child(4) > div.cell > div > div.formContent > table > tbody > tr > td > table > tbody > tr > td > form > input[type=radio]:nth-child(6)").click()
}
,)
 
//select再考預約並按下一頁
setTimeout(function(){
document.querySelector("#contentPanel > div.buttonPanel.screenOnly.clearfix > div > a.redbutton").click()
}
,100)
 
 
//自動click"本人已詳閱及明白以上所載的資料及規條，並願意遵守。"
setTimeout(function(){
document.querySelector("#contentPanel > form > div:nth-child(4) > div > div > input[type=checkbox]:nth-child(4)").checked=true
}
,)
setTimeout(function(){
document.querySelector("#contentPanel > form > div:nth-child(4) > div > div > input[type=checkbox]:nth-child(2)").checked=true
}
,)
setTimeout(function(){
document.querySelector("#contentPanel > form > div:nth-child(4) > div > div > input[type=checkbox]:nth-child(3)").checked=true
}
,)
setTimeout(function(){
document.querySelector("#contentPanel > form > div:nth-child(4) > div > div > input[type=checkbox]:nth-child(5)").checked=true
}
,)
 
//在預約駕駛考試裡面填返正確"上次不及格的考試日期"年份,月份,日期
setTimeout(function(){
document.querySelector("input#lastAttemptYear").value=2022
document.querySelector("input#lastAttemptMonth").value=09
document.querySelector("input#lastAttemptDay").value=28
}
,)
 
 
//在最後位置修改"日間聯絡電話號碼"
setTimeout(function(){
document.querySelector("#contentPanel > form > div.formPanel > div.cell > div.contenttable > div.formContent > table > tbody > tr > td > table > tbody > tr:nth-child(6) > td:nth-child(2) > input[type=text]").value=65999610
}
,)
 
//駕駛時須戴眼鏡或矯正視力的鏡片, 第一條entry為"是", 第二條entry為"否", 預設為"否"
setTimeout(function(){
//document.querySelector("#contentPanel > form > div.formPanel > div.cell > div.contenttable > div.formContent > table > tbody > tr > td > table > tbody > tr:nth-child(7) > td:nth-child(2) > input[type=radio]:nth-child(1)").click()
document.querySelector("#contentPanel > form > div.formPanel > div.cell > div.contenttable > div.formContent > table > tbody > tr > td > table > tbody > tr:nth-child(7) > td:nth-child(2) > input[type=radio]:nth-child(2)").click()
}
,)
 
//駕駛時須戴助聽器, 預設為"否"
setTimeout(function(){
document.querySelector("#contentPanel > form > div.formPanel > div.cell > div.contenttable > div.formContent > table > tbody > tr > td > table > tbody > tr:nth-child(8) > td:nth-child(2) > input[type=radio]:nth-child(2)").click()
}
,)
 
//身體有傷殘（如四肢不全或手足活動不靈）, 預設為"否"
setTimeout(function(){
document.querySelector("#contentPanel > form > div.formPanel > div.cell > div.contenttable > div.formContent > table > tbody > tr > td > table > tbody > tr:nth-child(9) > td:nth-child(2) > input[type=radio]:nth-child(2)").click()
}
,)
 
 
 
;