// ==UserScript==
// @name         查找评论
// @namespace    https://www.zhihu.com/people/yin-xiao-bo-11
// @version      0.1.1
// @description  可访问性优化
// @author       Veg
// @include    https://zhuanlan.zhihu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39777/%E6%9F%A5%E6%89%BE%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/39777/%E6%9F%A5%E6%89%BE%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

var x = document.querySelector('a'); {
var ac = x.parentNode;
var button = document.createElement("button");
button.innerHTML = "查找评论";
button.setAttribute('tabindex', '-1');
button.setAttribute('style', 'background:#00BFFF;color : #000000;');
button.addEventListener("click", function () {
lookup();
}, null);
ac.insertBefore(button, x);
}
document.addEventListener("keydown", function (e) {
if (e.altKey && e.keyCode == 83) {
lookup();
}
}, null);
function lookup() {
var ex = document.querySelector(".input-search"); {
if (ex == null) {
var sort = document.querySelectorAll('button.Button--withLabel');
for (var i = 0; i < sort.length; i++) {
var name = sort[i].innerText;
if (name == '​切换为时间排序') {
var ac = sort[i].parentNode;
var input = document.createElement("input");
input.className = "input-search";
input.type = "text";
input.placeholder = "查找评论";
input.setAttribute('style', 'background:#00BFFF;color : #000000;');
input.addEventListener("keydown", function (k) { if (k.keyCode == 13) { plq(); } }, null);
ac.insertBefore(input, sort[i]);
var buttons = document.createElement("button");
buttons.innerHTML = '开始查找';
buttons.setAttribute('style', 'background:#00BFFF;color : #000000;');
buttons.addEventListener("click", function () { plq(); }, null);
ac.insertBefore(buttons, sort[i]);
}
}
}
}
document.querySelector('.input-search').focus();
}

function plq() {
var pl = document.querySelectorAll('div.CommentItem-content');
for (var i = 0; i < pl.length; i++) {
var pls = pl[i].innerHTML;
var value = document.querySelector(".input-search").value;
var values = pls.split(value);
var r = '<span style="background:red;" class="fqpl" role="link">' + value + '</span>';
pl[i].innerHTML = values.join(r);
aq = values.length - 1;
if (aq > 0) {
var q = document.querySelector('span.fqpl');
q.setAttribute('tabindex', '0');
q.focus();
var audio = new Audio("http://www.qt06.com/msg.mp3");
audio.volume = 0.2;
audio.play();
return false;
}
(function () {
setTimeout(function () {
if (aq == 0) {
var fy = document.querySelector('button.PaginationButton-next');
{
fy.addEventListener("click", function () {
setTimeout(function () { document.querySelector('button.PaginationButton-next').focus(); }, 500);
setTimeout(function () { plq(); }, 1000);
}, null);
fy.click();
}
}
}, 400);
})();
}
}
