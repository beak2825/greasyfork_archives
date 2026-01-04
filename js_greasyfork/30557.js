// ==UserScript==
// @name     Auto_APPLY_In_NZ_VISA
// @description  申請頁面5秒自動刷新
// @include  https://onlineservices.immigration.govt.nz/WorkingHoliday/Application/Create.aspx*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://greasyfork.org/scripts/30548-waitforkeyelements/code/waitForKeyElements.js?version=200253
// @grant  GM_getValue
// @grant  GM_setValue
// @grant  GM_deleteValue
// @grant    GM_addStyle
// @version 0.0.1.20170612205029
// @namespace https://greasyfork.org/users/132067
// @downloadURL https://update.greasyfork.org/scripts/30557/Auto_APPLY_In_NZ_VISA.user.js
// @updateURL https://update.greasyfork.org/scripts/30557/Auto_APPLY_In_NZ_VISA.meta.js
// ==/UserScript==


if($("#ContentPlaceHolder1_statusLabel").text().trim()=="There is no scheme open for this country."){
    location.reload();
}

if($("#ContentPlaceHolder1_errorMessageLabel").text().trim()=="Multiple applications are not supported. All previous applications must be lodged before a new one can be created."){
  window.location ="https://onlineservices.immigration.govt.nz/WorkingHoliday/"
}

setTimeout(function(){ location.reload(); }, 5*1000);
waitForKeyElements ($("#ContentPlaceHolder1_applyNowButton"), actionFunction);
function actionFunction (jNode) {
    jNode.click();
}