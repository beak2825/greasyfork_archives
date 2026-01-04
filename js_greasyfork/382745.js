// ==UserScript==
// @name         CC_2019_1
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://www.neopets.com/inventory.phtml
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/382745/CC_2019_1.user.js
// @updateURL https://update.greasyfork.org/scripts/382745/CC_2019_1.meta.js
// ==/UserScript==

var index = 0
$("#invNav").append("<br><a style='font-size:3em' id='CC_auto_2019'>CC auto</a>")

$("#CC_auto_2019").click(function(){
setTimeout(function(){
$(".inventory > tbody > tr > td > a")[0 + index * 10].click()}, 1000)
setTimeout(function(){
$(".inventory > tbody > tr > td > a")[1 + index * 10].click()}, 10000)
setTimeout(function(){
$(".inventory > tbody > tr > td > a")[2 + index * 10].click()}, 20000)
    setTimeout(function(){
$(".inventory > tbody > tr > td > a")[3 + index * 10].click()}, 30000)
    setTimeout(function(){
$(".inventory > tbody > tr > td > a")[4 + index * 10].click()}, 40000)
    setTimeout(function(){
$(".inventory > tbody > tr > td > a")[5 + index * 10].click()}, 50000)
    setTimeout(function(){
$(".inventory > tbody > tr > td > a")[6 + index * 10].click()}, 60000)
    setTimeout(function(){
$(".inventory > tbody > tr > td > a")[7 + index * 10].click()}, 70000)
    setTimeout(function(){
$(".inventory > tbody > tr > td > a")[8 + index * 10].click()}, 80000)
    setTimeout(function(){
            function chrome_notification_c(mystring) {
	window.focus();
	var notificationDetails = {
		text: mystring,
		title: '剪贴板',
		timeout: 0,
		onclick: function() {
			window.focus();
		},
	};
	GM_notification(notificationDetails);
}
chrome_notification_c("搞完了，去搖拉桿")


$(".inventory > tbody > tr > td > a")[9 + index * 10].click()}, 90000)
    setTimeout(function(){
index = index + 1 }, 95000)



})