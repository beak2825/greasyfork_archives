// ==UserScript==
// @name         Accessibility 小米论坛快捷键
// @namespace    https://www.zhihu.com/people/yin-xiao-bo-11
// @version      0.1
// @description  可访问性优化
// @author       Veg
// @include    http://www.miui.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38947/Accessibility%20%E5%B0%8F%E7%B1%B3%E8%AE%BA%E5%9D%9B%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/38947/Accessibility%20%E5%B0%8F%E7%B1%B3%E8%AE%BA%E5%9D%9B%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function () {
setTimeout(function () {
proc(document); amo(proc);
}, 10);
function proc(d) {

document.querySelector('input[name="srchtxt"]').setAttribute('accesskey', 's');
document.querySelector('input[name="searchsubmit"]').value = '搜索';
var px = document.querySelector('input.px'); { if (px !== null) { px.setAttribute('accesskey', 'z'); } }

var tab = document.querySelectorAll('[tabindex="1"],[tabindex="2"],[tabindex="3"],[tabindex="4"],[tabindex="5"],[tabindex="6"]');
for (var i = 0, l = tab.length; i < l; i++) {
tab[i].removeAttribute('tabindex', '*');
}

var x = document.querySelector('input[id="seccodeverify_S00"]'); { if (x !== null) { x.setAttribute('aria-label', '验证码'); } }
var xx = document.querySelector('textarea.pt'); { if (xx !== null) { xx.setAttribute('aria-label', '输入回复内容'); } }
var xxx = document.querySelector('button[name="replysubmit"]'); { if (xxx == true) { xxx.removeAttribute('tabindex', '*'); } }

//帖子页
var timeline = document.querySelectorAll('a.xst');
for (var i = 0, l = timeline.length; i < l; i++) {
var tbody = timeline[i].parentNode.parentNode.parentNode;
var qn = tbody.parentNode;
if (qn.getAttribute('focuss') == null) {
var div = document.createElement("div");
div.className = "focusDiv";
div.setAttribute('focuss', i);
div.setAttribute('tabindex', '-1');
div.addEventListener("keydown", feedShortcutKey, null);
qn.insertBefore(div, tbody);
div.appendChild(tbody);
}
}

//楼层页
var timeline = document.querySelectorAll('td .pls');
for (var i = 0, l = timeline.length; i < l; i++) {
var tbody = timeline[i].parentNode.parentNode.parentNode;
var qn = tbody.parentNode;
var name = qn.querySelector('a.xi2').innerText;
var sj = qn.querySelector('em[id]').innerText;
var text = qn.querySelector('td.t_f').innerText;
var label = i + 1 + '楼 ' + name + '， ' + sj + '， ' + text;

if (qn.getAttribute('focuss') == null) {
var div = document.createElement("div");
div.className = "focusDiv";
div.setAttribute('focuss', i);
div.setAttribute('aria-label', label);
div.setAttribute('tabindex', '-1');
div.addEventListener("keydown", fShortcutKey, null);
qn.insertBefore(div, tbody);
div.appendChild(tbody);
}
}

}
function amo(processFunction) {
var mcallback = function (records) {
records.forEach(function (record) {
if (record.type == 'childList' && record.addedNodes.length > 0) {
var newNodes = record.addedNodes;
for (var i = 0, len = newNodes.length; i < len; i++) {
if (newNodes[i].nodeType == 1) {
processFunction(newNodes[i]);
}
}
}
});
};
var mo = new MutationObserver(mcallback);
mo.observe(document.body, { 'childList': true, 'subtree': true });
}
})();

function feedShortcutKey(k) {
k.stopPropagation();
kjj(k);
var feed = document.querySelectorAll('div[focuss]');
for (var i = 0, l = feed.length; i < l; i++) {
var focussValue = this.getAttribute('focuss'); var number = parseInt(focussValue);
if (k.altKey && k.keyCode == 88) {
if (number == l - 1) { feed[0].querySelector('a.xst').focus(); }
else { feed[number + 1].querySelector('a.xst').focus(); }
}
if (k.altKey && k.shiftKey && k.keyCode == 88) {
if (number == 0) { feed[l - 1].querySelector('.xst').focus(); }
else { feed[number - 1].querySelector('.xst').focus(); }
}
}
}

document.body.addEventListener("keydown", function (k) {
kjj(k);
var content = document.querySelectorAll('div[focuss]');
for (var i = 0, l = content.length; i < l; i++) {
if (k.altKey && k.shiftKey && k.keyCode == 88) {
content[l - 1].focus();
content[l - 1].querySelector('a.xst').focus();
}
if (k.altKey && k.keyCode == 88) {
content[0].focus();
content[0].querySelector('a.xst').focus();
}
if (k.altKey && k.shiftKey && k.keyCode == 88) {
content[l - 1].focus();
content[l - 1].querySelector('a.xst').focus();
}
}
}, null);

var audio = new Audio("http://veg.ink/music/sound.mp3");
audio.volume = 0.15;
audio.play();

function fShortcutKey(k) {
k.stopPropagation();
kjj(k);
var feed = document.querySelectorAll('div[focuss]');
for (var i = 0, l = feed.length; i < l; i++) {
var focussValue = this.getAttribute('focuss'); var number = parseInt(focussValue);
if (k.altKey && k.keyCode == 88) {
if (number == l - 1) { feed[0].focus(); }
else { feed[number + 1].focus(); }
}
if (k.altKey && k.shiftKey && k.keyCode == 88) {
if (number == 0) { feed[l - 1].focus(); }
else { feed[number - 1].focus(); }
}
}
}

function kjj(k) {
if (k.altKey && k.keyCode == 49) { document.querySelector('textarea.pt').focus(); }
}
