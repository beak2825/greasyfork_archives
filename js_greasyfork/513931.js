// ==UserScript==
// @name          thsrc_auto_fill
// @description   thsrc form auto fill and submit
// @include       https://irs.thsrc.com.tw/IMINT/*
// @version       1.1
// @license MIT
// @namespace https://greasyfork.org/users/1385804
// @downloadURL https://update.greasyfork.org/scripts/513931/thsrc_auto_fill.user.js
// @updateURL https://update.greasyfork.org/scripts/513931/thsrc_auto_fill.meta.js
// ==/UserScript==
// 搜尋方式
$('input[data-target="search-by-trainNo"]').prop("checked", true);
// 出發站
$('select[name="selectStartStation"]').val("1");
// 扺達站
$('select[name="selectDestinationStation"]').val("12");
// 出發日期
$("#toTimeInputField").val("2024/11/02");
// 車次
$('input[name="toTrainIDInputField"]').val("821");
// 張數, 設定張數時需要多加一個F, 例如：2張設定為 2F
$('select[name="ticketPanel:rows:0:ticketAmount"]').val("2F");
// 自動送出
let auto_submit = true;
setInterval(() => {
$("#cookiePolicy").remove();
if(auto_submit){
if($("#securityCode").length && $("#securityCode").val().length == 4) {
webdriver_location_click(settings, "#SubmitButton", document.location.href);
}
}
}, 200);