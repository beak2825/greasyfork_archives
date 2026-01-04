// ==UserScript==
// @name        accessibility 京东脚本
// @namespace    https://www.zhihu.com/people/yin-xiao-bo-11
// @version      0.1
// @description  给京东增加一些快捷键，处理商品评价和创建收货地址无法通过键盘操作的问题
// @author       Veg
// @include *.jd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39657/accessibility%20%E4%BA%AC%E4%B8%9C%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/39657/accessibility%20%E4%BA%AC%E4%B8%9C%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==   

$('input[id="ip_keyword"]').attr({ "aria-label": "商品名称/商品编号/订单号" });
$('div[id="text_in"]').attr({ "role": "textbox", "aria-label": "输入消息" });
$('div.sku-name,a.submit-btn').attr({ "tabindex": "0" });

(function () {
setTimeout(function () { proc(document); amo(proc); }, 10);
function proc(d) {
var url = window.location.href;
var tokens = url.substring(4);
var token = tokens.split('/');
//搜索和购物车
if (token[2] == 'search.jd.com' || token[2] == 'cart.jd.com') {
var timeline = document.querySelectorAll('div.gl-i-wrap,div.item-form');
for (var i = 0, l = timeline.length; i < l; i++) {
timeline[i].setAttribute('tabindex', '-1');
timeline[i].setAttribute('focuss', i);
timeline[i].addEventListener("keydown", feedShortcutKey, null);
}
}
//签到
if (token[2] == 'vip.jd.com') {
var qd = document.querySelectorAll("span.name");
for (var i = 0; i < qd.length; i++) {
var qdName = qd[i].innerText;
if (qdName == "签到" || qdName == "已签到") {
qd[i].setAttribute("tabindex", "0");
qd[i].setAttribute("role", "button");
qd[i].classList.add("focus-qd");
}
}
}
if (token[2] == 'vip.jr.jd.com') { document.querySelector("a.m-qian").classList.add("focus-qd"); }
//处理评价
if (token[2] == 'club.jd.com' && url.length > 68) {
var star = document.querySelectorAll("span.star");
for (var i = 0, l = star.length; i < l; i++) {
star[i].setAttribute("tabindex", "0");
star[i].setAttribute("role", "button");
star[i].classList.add("span-click");
if (star[i].classList.contains('star1')) { star[i].setAttribute('title', '非常不满意'); }
if (star[i].classList.contains('star2')) { star[i].setAttribute('title', '不满意'); }
if (star[i].classList.contains('star3')) { star[i].setAttribute('title', '一般'); }
if (star[i].classList.contains('star4')) { star[i].setAttribute('title', '满意'); }
if (star[i].classList.contains('star5')) { star[i].setAttribute('title', '非常满意'); }
}
}
//处理新增收货地址
if (token[2] == 'easybuy.jd.com') {
$('a.e-btn').click(function () {
setTimeout(function () {
$('#jd_area').attr({ 'tabindex': '0', 'role': 'button', 'title': '空格或回车可展开城市选择菜单，tab 可进行访问' }).keydown(function (e) {
if (e.which == 32 || e.which == 13) { $('div.ui-area-text').trigger('mouseover'); }
if (e.which == 27) { $('div.ui-area-text').trigger('mouseout'); }
});

$('#consigneeName').attr({ 'aria-label': '收货人（必填项）' }).focus();
$('#consigneeAddress').attr({ 'aria-label': '详细地址（必填项）' });
$('#consigneeMobile').attr({ 'aria-label': '手机号码' });
$('#consigneePhone').attr({ 'aria-label': '固定电话：' });
$('#consigneeEmail').attr({ 'aria-label': '邮箱' });
$('#consigneeAlias').attr({ 'aria-label': '地址别名' });
}, 1000);
});
}

}

function amo(processFunction) {
var mcallback = function (records) { records.forEach(function (record) { if (record.type == 'childList' && record.addedNodes.length > 0) { var newNodes = record.addedNodes; for (var i = 0, len = newNodes.length; i < len; i++) { if (newNodes[i].nodeType == 1) { processFunction(newNodes[i]); } } } }); };
var mo = new MutationObserver(mcallback); var moption = { 'childList': true, 'subtree': true };
mo.observe(document.body, moption);
}
})();


function feedShortcutKey(k) {
var feed = document.querySelectorAll('div[focuss]');
var focussValue = this.getAttribute('focuss'); var number = parseInt(focussValue);
if (k.keyCode == 65) {
if (focussValue !== null) {
k.stopPropagation();
feed[number + 1].focus();
}
}
if (k.keyCode == 90) {
if (focussValue !== null) {
k.stopPropagation();
feed[number - 1].focus();
}
}
}

document.body.addEventListener("keydown", function (k) {
var t = k.target;
if (k.keyCode == 13 || k.keyCode == 32) {
if (t.classList.contains("focus-qd") || t.classList.contains("add") || t.classList.contains("J-popbox-im") || t.classList.contains("span-click")) {
t.click();
}
}
kjj(k);
var focusElement = document.activeElement;
var input = focusElement.tagName;
if (input == 'INPUT' || k.ctrlKey) return false;
var content = document.querySelectorAll('div[focuss]');
for (var i = 0, l = content.length; i < l; i++) {
if (k.keyCode == 65) { content[0].focus(); }
if (k.keyCode == 90) { content[l - 1].focus(); }
}
}, null);

var audio = new Audio("http://veg.ink/music/sound.mp3");
audio.volume = 0.15;
audio.play();

function kjj(k) {
if (k.which == 49 && k.altKey) { $('input[id="ip_keyword"],div.sku-name,a.submit-btn,div[id="text_in"],a.e-btn,a[clstag="homepage|keycount|home2013|Homeadd2"]').focus(); }
if (k.which == 50 && k.altKey) { $("a.notice,a.pn-prev,a.prev").focus(); }
if (k.which == 51 && k.altKey) { $('a.pn-next,a.next').focus(); }
if (k.which == 81 && k.ctrlKey) {
$('li[data-anchor="#detail"]').eq(0).attr({ 'tabindex': '-1', 'role': 'link' }).focus();
$('a[id="InitCartUrl-mini"]').focus();
}
if (k.altKey && k.keyCode == 51) {
var r = document.querySelectorAll("div.dt");
for (var i = 0; i < r.length; i++) {
var rName = r[i].innerText;
if (rName == "配 送 至") {
var c = r[i].parentNode;
c.setAttribute("tabindex", "0");
c.focus();
}
}
}
if (k.altKey && k.keyCode == 81) {
var lx = document.querySelector("a.J-popbox-im"); {
lx.setAttribute("tabindex", "0");
lx.focus();
lx.addEventListener("click", function () { document.querySelector("a.J-popbox-im").querySelector("div").click(); }, null);
}
}
if (k.keyCode == 113) {
document.querySelector(".focus-qd").focus();
}
}

