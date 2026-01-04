// ==UserScript==
// @name         期末教學意見調查問卷 自動填寫
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  自動填寫期末教學意見調查問卷
// @author       Been_Yan <asdfghjkl42045@gmail.com>
// @match        https://webapp.yuntech.edu.tw/WebNewCAS/TeachSurvey/Survey/LastEval.aspx?current_subj=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457123/%E6%9C%9F%E6%9C%AB%E6%95%99%E5%AD%B8%E6%84%8F%E8%A6%8B%E8%AA%BF%E6%9F%A5%E5%95%8F%E5%8D%B7%20%E8%87%AA%E5%8B%95%E5%A1%AB%E5%AF%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/457123/%E6%9C%9F%E6%9C%AB%E6%95%99%E5%AD%B8%E6%84%8F%E8%A6%8B%E8%AA%BF%E6%9F%A5%E5%95%8F%E5%8D%B7%20%E8%87%AA%E5%8B%95%E5%A1%AB%E5%AF%AB.meta.js
// ==/UserScript==



$('.GridView_General tr:has(input)').map((_, e) => $(e).find('input:radio:first').click());
$('.button_green').click()

