// ==UserScript==
// @name         字母导航
// @namespace    https://www.zhihu.com/people/yin-xiao-bo-11
// @version      0.1.5
// @description  提供网页元素的字母导航
// @author       Veg
// @include    http://*/*
// @include    https://*/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/373935/%E5%AD%97%E6%AF%8D%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/373935/%E5%AD%97%E6%AF%8D%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==
"use strict";
let navigationTTSToken;
//TTS 函数
function navigationTTS(TTStext) {
var zhText = encodeURI(TTStext);
var parameter = "&vol=7&per=0&spd=9&pit=7";
var voicebbUrl = "https://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=xiaobo&tok=" + navigationTTSToken + "&tex=" + zhText + parameter;
var audio = document.querySelector('audio.audio-navigation'); {
if (audio !== null) {
audio.src = voicebbUrl;
audio.volume = 0.6;
audio.playbackRate = 1.4;
audio.play();
}
}
}
(function () {
//插入播放器
var audio = document.createElement('audio');
audio.className = 'audio-navigation';
audio.volume = 0.6;
document.body.appendChild(audio);
GM_xmlhttpRequest({
method: "GET",
headers: { "Accept": "Content-Type:application/json" },
url: "https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=DmRzeWmTGgwPuPrFyHPhxLFH&client_secret=iYUz9bmANfuDBhlpacObRCq4qutDHfSe",
onload: function (response) {
var data = response.responseText;
var datas = JSON.parse(data);
navigationTTSToken = datas.access_token;
}
});
})();

let element = [];
let nFES;
let nState = localStorage.getItem('navigationState');
function textNavigation(k) {
//文本框导航
let textSubscript = [];
var text = textFunction(textSubscript);
//组合框导航
let comboSubscript = [];
var combo = formimg('SELECT', 'combobox', comboSubscript);

element.length = 0;

if (ifTrue(document.activeElement) == true) return false;

if (k.shiftKey && k.keyCode == 67) {
reverseJump(combo, comboSubscript);
}
if (k.shiftKey && k.keyCode == 69) {
reverseJump(text, textSubscript);
}

if (k.altKey || k.shiftKey || k.ctrlKey) return false;
if (k.keyCode == 67) {
positiveJump(combo, comboSubscript);
}
if (k.keyCode == 69) {
positiveJump(text, textSubscript);
}
}

document.body.addEventListener('keyup', function (k) {
if (nState == 'open' || nState == null) {
if (k.keyCode !== 67 &&
k.keyCode !== 69 &&
k.keyCode !== 87) {
return false;
}
else {
var all = document.all;
for (var i = 0, l = all.length; i < l; i++) {
if (all[i].nodeType == 1) {
element.push(all[i]);
}
}
nFES = getArraySubscript(element, document.activeElement);
textNavigation(k);
}
}
}, null);

function switchCtrl(k) {
if (k.keyCode == 119) {
if (nState === 'open' || nState == null) {
localStorage.setItem('navigationState', 'close');
nState = localStorage.getItem('navigationState');
navigationTTS('关闭字母导航');
}
else {
localStorage.setItem('navigationState', 'open');
nState = localStorage.getItem('navigationState');
navigationTTS('开启字母导航');
}
}
if (nState == 'open' || nState == null) {
if (k.keyCode !== 49 &&
k.keyCode !== 50 &&
k.keyCode !== 51 &&
k.keyCode !== 52 &&
k.keyCode !== 53 &&
k.keyCode !== 54 &&
k.keyCode !== 33 &&
k.keyCode !== 34 &&
k.keyCode !== 66 &&
k.keyCode !== 67 &&
k.keyCode !== 68 &&
k.keyCode !== 70 &&
k.keyCode !== 71 &&
k.keyCode !== 72 &&
k.keyCode !== 75 &&
k.keyCode !== 76 &&
k.keyCode !== 82 &&
k.keyCode !== 84 &&
k.keyCode !== 87 &&
k.keyCode !== 88 &&
k.keyCode !== 119 &&
k.keyCode !== 222) {
return false;
}
else {
var all = document.all;
for (var i = 0, l = all.length; i < l; i++) {
if (all[i].nodeType == 1) {
element.push(all[i]);
}
}
nFES = getArraySubscript(element, document.activeElement);
lnavigation(k);
}
}
}

document.body.addEventListener('keydown', function (k) {
//keydown
//keypress
//keyup
switchCtrl(k);
//setNavigation(k);
}, null);

function lnavigation(k) {
//按钮导航
let buttonSubscript = [];
var button = element.filter(function (t) {
if (t.tagName == 'BUTTON' ||
t.hasAttribute && t.hasAttribute('role') && t.getAttribute('role') == 'button' ||
(t.type == 'file' || t.type == 'button' || t.type == 'submit') && t.tagName == 'INPUT') {
if (abilityDetection(t) == true) {
buttonSubscript.push(getArraySubscript(element, t));
return t;
}
}
});

//界标导航
let landmarkSubscript = [];
var landmark = element.filter(function (t) {
var role = t.getAttribute('role');
if (role == 'banner' || role == 'navigation' || role == 'search' || role == 'main' || role == 'complementary' || role == 'form' || role == 'application' || role == 'contentinfo') {
if (abilityDetection2(t) == true) {
if (!t.hasAttribute('tabindex')) {
t.setAttribute('tabindex', '-1');
if (role == 'banner') {
t.setAttribute('aria-label', '横幅区');
}
if (role == 'navigation') {
t.setAttribute('aria-label', '导航区');
}
if (role == 'search') {
t.setAttribute('aria-label', '搜索区');
}
if (role == 'main') {
t.setAttribute('aria-label', '主内容区');
}
if (role == 'complementary') {
t.setAttribute('aria-label', '补充内容区');
}
if (role == 'form') {
t.setAttribute('aria-label', '表单区');
}
if (role == 'application') {
t.setAttribute('aria-label', '应用程序区');
}
if (role == 'contentinfo') {
t.setAttribute('aria-label', '隐私版权区');
}
}
landmarkSubscript.push(getArraySubscript(element, t));
return t;
}
}
});

//表单导航
let formSubscript = [];
var form = formimg('FORM', 'form', formSubscript);
//图片导航
let imgSubscript = [];
var img = formimg('IMG', 'image', imgSubscript);
//链接导航
let linkSubscript = [];
var link = element.filter(function (t) {
if (t.tagName == 'A' ||
t.hasAttribute && t.hasAttribute('role') && t.getAttribute('role') == 'link') {
if (t.getAttribute('role') !== 'button')
if (abilityDetection(t) == true) {
linkSubscript.push(getArraySubscript(element, t));
return t;
}
}
});
//复选框导航
let checkSubscript = [];
var check = formFunction('INPUT', 'checkbox', checkSubscript);

//单选复选框导航
let radioSubscript = [];
var radio = formFunction('INPUT', 'radio', radioSubscript);

//标题导航
let heaSubscript = [];
var hea = element.filter(function (t) {
var tag = t.tagName;
if (tag == 'H1' || tag == 'H2' || tag == 'H3' || tag == 'H4' || tag == 'H5' || tag == 'H6') {
if (abilityDetection2(t) == true) {
if (t.getAttribute('tabindex') == null) {
t.setAttribute('tabindex', '-1');
t.setAttribute('role', 'heading');
t.addEventListener('keydown', function (k) {
if (k.keyCode == 13) {
if (t.querySelector('a') !== null) {
this.querySelector('a').setAttribute('target', 'blank');
this.querySelector('a').click();
}
var host = window.location.host;
if (host === 'www.google.com' || host === 'www.google.com.hk') {
var parent = this.parentNode.parentNode;
var link = parent.querySelector('a');
if (link !== null)
link.setAttribute('target', 'blank');
link.click();
}
}
}, null);
}
heaSubscript.push(getArraySubscript(element, t));
return t;
}
}
});
//一级标题
let hea1Subscript = [];
var hea1 = head('H1', '1', hea1Subscript);
//二级标题
let hea2Subscript = [];
var hea2 = head('H2', '2', hea2Subscript);
//三级标题
let hea3Subscript = [];
var hea3 = head('H3', '3', hea3Subscript);
//四级标题
let hea4Subscript = [];
var hea4 = head('H4', '4', hea4Subscript);
//五级标题
let hea5Subscript = [];
var hea5 = head('H5', '5', hea5Subscript);
//六级标题
let hea6Subscript = [];
var hea6 = head('H6', '6', hea6Subscript);
//列表导航
let ulSubscript = [];
var ul = formimg('UL', 'list', ulSubscript);

//表格导航
let tableSubscript = [];
var table = element.filter(function (t) {
if (t.tagName == 'TABLE') {
if (abilityDetection2(t) == true) {
if (!t.hasAttribute('tabindex')) {
t.setAttribute('tabindex', '-1');
}
tableSubscript.push(getArraySubscript(element, t));
return t;
}
}
});
//组合框和文本框
let combo1Subscript = [];
var combo1 = formimg('SELECT', 'combobox', combo1Subscript);
let text1Subscript = [];
var text1 = textFunction(text1Subscript);

element.length = 0;

if (k.altKey && k.keyCode == 67) {
positiveJump(combo1, combo1Subscript);
}
if (!k.shiftKey) {
if (k.altKey && k.keyCode == 87) {
positiveJump(text1, text1Subscript);
}
}
if (k.shiftKey && k.altKey && k.keyCode == 87) {
reverseJump(text1, text1Subscript);
}
if (ifTrue(document.activeElement) == true) return false;
if (k.ctrlKey || k.altKey) return false;
//反向切换
if (k.shiftKey && k.keyCode == 66) {
reverseJump(button, buttonSubscript);
}
if (k.shiftKey && k.keyCode == 68) {
reverseJump(landmark, landmarkSubscript);
}
if (k.shiftKey && k.keyCode == 70) {
reverseJump(form, formSubscript);
}
if (k.shiftKey && k.keyCode == 71) {
for (var i = 0, l = img.length; i < l; i++) {
img[i].setAttribute('title', '图片' + (i + 1));
}
reverseJump(img, imgSubscript);
}
if (k.shiftKey && k.keyCode == 75) {
reverseJump(link, linkSubscript);
}
if (k.shiftKey && k.keyCode == 76) {
reverseJump(ul, ulSubscript);
}
if (k.shiftKey && k.keyCode == 82) {
reverseJump(radio, radioSubscript);
}
if (k.shiftKey && k.keyCode == 84) {
reverseJump(table, tableSubscript);
tableSupport();
}
if (k.shiftKey && k.keyCode == 88) {
reverseJump(check, checkSubscript);
}
if (k.shiftKey && k.keyCode == 72) {
reverseJump(hea, heaSubscript);
}
if (k.shiftKey && k.keyCode == 49) {
reverseJump(hea1, hea1Subscript);
}
if (k.shiftKey && k.keyCode == 50) {
reverseJump(hea2, hea2Subscript);
}
if (k.shiftKey && k.keyCode == 51) {
reverseJump(hea3, hea3Subscript);
}
if (k.shiftKey && k.keyCode == 52) {
reverseJump(hea4, hea4Subscript);
}
if (k.shiftKey && k.keyCode == 53) {
reverseJump(hea5, hea5Subscript);
}
if (k.shiftKey && k.keyCode == 54) {
reverseJump(hea6, hea6Subscript);
}

//正向切换
if (k.shiftKey) return false;
if (k.keyCode == 66) {
positiveJump(button, buttonSubscript);
}

if (k.keyCode == 68) {
positiveJump(landmark, landmarkSubscript);
}
if (k.keyCode == 70) {
positiveJump(form, formSubscript);
}
if (k.keyCode == 71) {
for (var i = 0, l = img.length; i < l; i++) {
img[i].setAttribute('title', '图片' + (i + 1));
}
positiveJump(img, imgSubscript);
}
if (k.keyCode == 75) {
positiveJump(link, linkSubscript);
}
if (k.keyCode == 76) {
positiveJump(ul, ulSubscript);
}
if (k.keyCode == 82) {
positiveJump(radio, radioSubscript);
}
if (k.keyCode == 84) {
positiveJump(table, tableSubscript);
tableSupport();
}
if (k.keyCode == 88) {
positiveJump(check, checkSubscript);
}

if (k.keyCode == 72) {
positiveJump(hea, heaSubscript);
}
if (k.keyCode == 49) {
positiveJump(hea1, hea1Subscript);
}
if (k.keyCode == 50) {
positiveJump(hea2, hea2Subscript);
}
if (k.keyCode == 51) {
positiveJump(hea3, hea3Subscript);
}
if (k.keyCode == 52) {
positiveJump(hea4, hea4Subscript);
}
if (k.keyCode == 53) {
positiveJump(hea5, hea5Subscript);
}
if (k.keyCode == 54) {
positiveJump(hea6, hea6Subscript);
}
}
//正向导航函数
function positiveJump(a, b) {
for (var i = 0, l = a.length || b.length; i < l; i++) {
if (nFES < b[i]) {
var xv = getArraySubscript(a, a[i]);
a[xv].focus();
while (a[xv].isSameNode(document.activeElement) !== true) {
xv++
a[xv].focus();
}
break;
}
else {
if (nFES < b[0] || nFES >= b[l - 1]) {
a[0].focus();
break;
}
}
}
}
//反向导航函数
function reverseJump(a, b) {
for (var i = 0, l = a.length || b.length; i < l; i++) {
if (nFES > b[l - 1] || nFES <= b[0]) {
a[l - 1].focus();
break;
}
else {
if (nFES <= b[i]) {
var xv = getArraySubscript(a, a[i]);
a[xv - 1].focus();
while (a[xv - 1].isSameNode(document.activeElement) !== true) {
xv--
a[xv - 1].focus();
}
break;
}
}
}
}
//获取数组下标
function getArraySubscript(arrays, obj) {
var i = arrays.length;
while (i--) {
if (arrays[i] === obj) {
return i;
}
}
return false;
}
//分级标题函数
function head(a, b, c) {
var d = element.filter(function (t) {
if (t.tagName == a) {
if (abilityDetection2(t) == true) {
if (t.getAttribute('aria-level') == null) {
t.setAttribute('aria-level', b);
t.setAttribute('title', a);
}
c.push(getArraySubscript(element, t));
return t;
}
}
});
return d;
}
//文本框函数
function textFunction(c) {
var d = element.filter(function (t) {
if (ifTrue(t) == true) {
if (abilityDetection(t) == true) {
c.push(getArraySubscript(element, t));
return t;
}
}
});
return d;
}

//部分表单函数
function formFunction(a, b, c) {
var d = element.filter(function (t) {
if (t.tagName == a && t.getAttribute('type') == b ||
t.hasAttribute && t.hasAttribute('role') && t.getAttribute('role') == b) {
if (abilityDetection(t) == true) {
c.push(getArraySubscript(element, t));
return t;
}
}
});
return d;
}
//表单图片等
function formimg(a, b, c) {
var d = element.filter(function (t) {
if (t.tagName == a ||
t.hasAttribute && t.hasAttribute('role') && t.getAttribute('role') == b) {
if (abilityDetection2(t) == true) {
if (a !== 'SELECT' && b !== 'combobox') {
if (!t.hasAttribute('tabindex')) {
t.setAttribute('tabindex', '-1');
if (a == 'FORM') {
t.setAttribute('aria-label', '表单');
}
}
}
c.push(getArraySubscript(element, t));
return t;
}
}
});
return d;
}
//条件函数
function ifTrue(t) {
if ((t.type == 'text' || t.type == 'password' || t.type == 'email' || t.type == 'number' || t.type == 'search' || t.type == 'tel' || t.type == 'url') && t.tagName == 'INPUT' ||
t.tagName == 'PRE' ||
t.tagName == 'TEXTAREA' ||
t.tagName == 'INPUT' && t.getAttribute('type') == null ||
t.hasAttribute && t.hasAttribute('role') && t.getAttribute('role') == 'textbox')
return true;
}

function abilityDetection(t) {
if ((t.tabIndex >= 0 || t.hasAttribute && t.hasAttribute('tabindex') && t.getAttribute('tabindex') == '-1') &&
!t.hasAttribute('disabled') &&
t.getAttribute('aria-hidden') !== 'true' &&
t.offsetParent !== null)
return true;
}

function abilityDetection2(t) {
if (!t.hasAttribute('disabled') &&
t.getAttribute('aria-hidden') !== 'true' &&
t.offsetParent !== null)
return true;
}
//表格支持
function tableSupport() {
var fes = document.activeElement;
if (fes.tagName == 'TABLE') {
let trs = [];
let tds = [];
fes.addEventListener('keydown', function (k) {
trs.length = 0;
tds.length = 0;
var tr = this.querySelectorAll('tr');
for (var i = 0, l = tr.length; i < l; i++) {
if (!tr[i].hasAttribute('tabindex')) {
tr[i].setAttribute('tabindex', '-1');
}
trs.push(tr[i]);

var td = tr[i].querySelectorAll('th,td');
for (var j = 0, w = td.length; j < w; j++) {
if (!td[j].hasAttribute('tabindex')) {
td[j].setAttribute('tabindex', '-1');
}
tds.push(td[j]);
}
}
var fe = document.activeElement;
if (k.altKey && k.shiftKey && k.keyCode == 33) {
if (fe.tagName == 'TABLE') {
var len = trs.length;
trs[len - 1].focus();
}
else if (fe.tagName == 'TR') {
var xv = getArraySubscript(trs, fe);
trs[xv - 1].focus();
}
else if (fe.tagName !== 'TR') {
if (fe.tagName == 'TD' || fe.tagName == 'TH') {
incrementTR(fe, trs);
}
else {
while (fe.parentNode.tagName !== 'TR') {
fe = fe.parentNode;
var ttr = fe.parentNode;
if (ttr.tagName == 'TR') {
var xv = getArraySubscript(trs, ttr);
trs[xv].focus();
}
}
}
}
}

if (k.altKey && k.shiftKey && k.keyCode == 34) {
if (fe.tagName == 'TABLE') {
trs[0].focus();
}
else if (fe.tagName == 'TR') {
var xv = getArraySubscript(trs, fe);
trs[xv + 1].focus();
}
else if (fe.tagName !== 'TR') {
if (fe.tagName == 'TD' || fe.tagName == 'TH') {
incrementTR(fe, trs);
}
else {
while (fe.parentNode.tagName !== 'TR') {
fe = fe.parentNode;
var ttr = fe.parentNode;
if (ttr.tagName == 'TR') {
var xv = getArraySubscript(trs, ttr);
trs[xv + 1].focus();
}
}
}
}
}
if (k.altKey && k.shiftKey && k.keyCode == 37) {
if (fe.tagName == 'TR') {
var lastTD = fe.querySelectorAll('td,th');
var lastTD = fe.querySelectorAll('td');
for (var i = 0, l = lastTD.length; i < l; i++) {
lastTD[l - 1].focus();
}
}
else if (fe.tagName == 'TD' || fe.tagName == 'TH') {
var xv = getArraySubscript(tds, fe);
tds[xv - 1].focus();
}
}
if (k.altKey && k.shiftKey && k.keyCode == 39) {
if (fe.tagName == 'TR') {
if (fe.querySelector('th') !== null) {
fe.querySelector('th').focus();
}
else {
fe.querySelector('td').focus();
}
}
else if (fe.tagName == 'TD' || fe.tagName == 'TH') {
var xv = getArraySubscript(tds, fe);
tds[xv + 1].focus();
}
}

}, null);
}
}


function incrementTR(fe, trs) {
while (fe.tagName == 'TD' || fe.tagName == 'TH') {
fe = fe.parentNode;
var ttr = fe;
if (ttr.tagName == 'TR') {
var xv = getArraySubscript(trs, ttr);
trs[xv].focus();
}
}
}
/*
let vx = false;
funcion setNavigation(k) {
//alert(timeout);
let timeout;
var ax=function() {
alert('ok');
vx=false;
};
if(k.keyCode == 192) {
vx = true;
timeout = setTimeout(ax,3000);
}
else if(vx == true && k.key=='v') {
alert(timeout);
clearTimeout(timeout);
vx = false;
var video = document.querySelector('video');
if(video!==null) {
video.controls = true;
video.focus();
return false;
}
}
else if(vx == true && k.key=='a') {
clearTimeout(timeout);
vx = false;
var audio = document.querySelector('audio');
if(audio!==null) {
audio.controls = true;
audio.focus();
return false;
}
}
else if(vx == true && k.key=='w') {
clearTimeout(timeout);
vx = false;
var article = document.querySelector('article');
if(article!==null) {
var div=article.querySelector('div');
div.setAttribute('tabindex','0');
div.focus();
return false;
}
}

}
*/
