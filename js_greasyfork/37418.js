// ==UserScript==
// @name        accessibility_知乎键盘访问优化
// @namespace    https://www.zhihu.com/people/yin-xiao-bo-11
// @require    https://greasyfork.org/scripts/432103-az-%E5%BF%AB%E6%8D%B7%E9%94%AE/code/AZ%20%E5%BF%AB%E6%8D%B7%E9%94%AE.js?version=968636
// @version      0.7.1
// @description  针对知乎的屏幕阅读器可访问性优化
// @author       Veg
// @include        https://*.zhihu.com/*
// @include        https://zhuanlan.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37418/accessibility_%E7%9F%A5%E4%B9%8E%E9%94%AE%E7%9B%98%E8%AE%BF%E9%97%AE%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/37418/accessibility_%E7%9F%A5%E4%B9%8E%E9%94%AE%E7%9B%98%E8%AE%BF%E9%97%AE%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function () {
'use strict';
let exclude = ':not(.veg-mark)';
let mo = new MutationObserver((mutationRecord) => {
middleFunction();
});
mo.observe(document.body, {
'childList': true,
'subtree': true
});
function middleFunction() {
globalShortcutKey();
middlewareFunction();
proc();
}
function middlewareFunction() {
let token = window.location.href.substring(20).split('/');
if (token[1] == 'follow' || token[1] == 'hot' || token[1] == '') {
let aside = document.querySelector('div.TopstoryPageHeader-aside' + exclude);
if (aside) {
aside.classList.add('veg-mark');
aside.parentNode.setAttribute('style', 'display:none');
}
}
if (token[1] == 'topic') {
//
}
if (token[1] == 'question') {
let title = document.querySelector('h1.QuestionHeader-title');
if (title) {
title.setAttribute('style', 'display:none');
}
let expandable = document.querySelector('div.QuestionRichText');
if (expandable) {
expandable.setAttribute('tabindex', '-1');
let more = expandable.querySelector('button.QuestionRichText-more');
if (more) {
more.addEventListener('click', () => {
expandable.focus();
}, null);
}
}
}
if (token[1] == 'people' || token[1] == 'org') {
let profile = document.querySelector('ul.ProfileMain-tabs');
if (profile) {
profile.setAttribute('style', 'display:none');
}
}
if (token[3] === 'log' || token[3] === 'logs' || token[3] === 'topic_logs') {
insdel();
}
//endFunction
}
//内容快捷键
function globalShortcutKey() {
let timelineStr = 'div.TopstoryItem' + exclude + ', div.QuestionAnswer-content' + exclude + ', div.List-item' + exclude + ', section.HotItem' + exclude + ', div.TopstoryItem-isFollow' + exclude;
let timeline = document.querySelectorAll(timelineStr);
for (let i = 0, l = timeline.length; i < l; i++) {
timeline[i].classList.add('veg-mark');
if (!timeline[i].classList.contains('hotkey-AZ') && timeline[i].hasAttribute('tabindex')) {
timeline[i].classList.add('hotkey-AZ');
}
let modalWrap = timeline[i].querySelector('div.ModalWrap');
if (modalWrap) {
modalWrap.style = 'display:none';
}
}
// end
}
//细节优化
function proc() {
let videoPackage = document.querySelectorAll('div.ZVideo-video' + exclude + ', div.VideoCard-player' + exclude);
for (let i = 0, l = videoPackage.length; i < l; i++) {
if (!videoPackage[i].classList.contains('veg-mark')) {
videoPackage[i].classList.add('veg-mark');
let button = document.createElement('button');
button.innerHTML = '播放';
button.style = 'background:#FFA500;';
button.addEventListener('click', function () {
let iframe = this.parentNode.querySelector('iframe');
if (iframe)
window.open(iframe.src);
}, null);
videoPackage[i].insertBefore(button, videoPackage[i].firstChild);
}
}
//选项卡
let tab = document.querySelectorAll('[role="tab"]' + exclude + ', [role="tablist"]' + exclude);
for (let i = 0, l = tab.length; i < l; i++) {
tab[i].classList.add('veg-mark');
tab[i].removeAttribute('role');
}
let tooltip = document.querySelectorAll('[data-tooltip]' + exclude);
for (let i = 0, l = tooltip.length; i < l; i++) {
tooltip[i].classList.add('veg-mark');
let label = tooltip[i].getAttribute('data-tooltip');
tooltip[i].setAttribute('aria-label', label);
}
//搜索
let search = document.querySelector('label.SearchBar-input' + exclude);
if (search) {
search.classList.add('veg-mark')
search.querySelector('input[placeholder]').setAttribute('aria-label', '知乎搜索');
}
//优化一些菜单项
let hdxx = document.querySelectorAll('button[aria-haspopup]' + exclude);
for (let i = 0, l = hdxx.length; i < l; i++) {
hdxx[i].classList.add('veg-mark');
hdxx[i].removeAttribute('role');
hdxx[i].removeAttribute('aria-haspopup');
}
/*
//补货通知
let notice = document.querySelector('div.Notification-textSection' + exclude);
if (notice) {
notice.classList.add('veg-mark')
let text = notice.innerText;
chrome.runtime.sendMessage({
ttsState: "speak",
text: text,
enqueue: false
});
}
*/
//公共编辑理由、上传视频、上传文档
//注册、登录
//发视频、写想法
let lyStr = 'div.css-stef5c' + exclude + ', div.SignFlow-tab' + exclude + ', div.Login-socialButton' + exclude + ', div.Editable-docModal-uploader-text' + exclude + ',div.Editable-videoModal-uploader-text' + exclude + ', div.NewGlobalWrite-topTitle' + exclude;
let ly = document.querySelectorAll(lyStr);
for (let i = 0, l = ly.length; i < l; i++) {
ly[i].classList.add('veg-mark')
ly[i].classList.add('zhihu-click');
ly[i].setAttribute('role', 'button');
ly[i].setAttribute('tabindex', '0');
}

// 隐藏选择语言、用户头像、匿名用户头像、动态中的原点
let hiddenElementStr = 'span.Footer-dot' + exclude + ', img[alt="匿名用户"]' + exclude + ', a.UserLink-link' + exclude + ', input[placeholder="选择语言"]' + exclude + ', span.Bull' + exclude;
let hiddenElement = document.querySelectorAll(hiddenElementStr);
for (let i = 0, l = hiddenElement.length; i < l; i++) {
hiddenElement[i].classList.add('veg-mark')
if (hiddenElement[i].hasAttribute('alt') ||
hiddenElement[i].hasAttribute('placeholder') ||
hiddenElement[i].querySelector('img[src]') ||
hiddenElement[i].classList.contains('Bull') ||
hiddenElement[i].classList.contains('Footer-dot')
) {
hiddenElement[i].setAttribute('style', 'display:none');
}
}
// 优化对话框访问
(function () {
setTimeout(function () {
let dhk = document.querySelectorAll("div.Modal" + exclude);
for (let i = 0, l = dhk.length; i < l; i++) {
dhk[i].classList.add('veg-mark')
dhk[i].setAttribute("role", "dialog");
dhk[i].setAttribute("aria-labelledby", ":1");
let dhks = dhk[i].querySelectorAll("h3.Modal-title,div.Topbar-title,.CommentTopbar-title");
for (let i = 0, l = dhks.length; i < l; i++) {
dhks[i].setAttribute("id", ":1");
}
let yc = dhk[i].querySelectorAll("button.Tag-remove");
for (let i = 0, l = yc.length; i < l; i++) {
yc[i].setAttribute('aria-label', '移除');
}
}
}, 80);
})();
//给匿名用户文本增加焦点
let users = document.querySelectorAll('span.UserLink' + exclude);
for (let i = 0; i < users.length; i++) {
users[i].classList.add('veg-mark')
let names = users[i].innerText;
if (names == '匿名用户') {
users[i].setAttribute('tabindex', '0');
users[i].setAttribute('role', 'link');
}
}
//处理评论
let plButton = document.querySelectorAll('div.CommentItem-footer' + exclude + ',div.CommentItemV2-footer' + exclude);
for (let i = 0, l = plButton.length; i < l; i++) {
plButton[i].classList.add('veg-mark')
plButton[i].setAttribute('tabindex', '-1');
plButton[i].setAttribute('role', 'link');
}
// endFunction
}
document.body.addEventListener("keydown", function (k) {
shareShortcutKey(k);
//键盘点击
let t = k.target;
if (t.classList.contains('hotkey-AZ')) {
if (k.altKey && k.keyCode == 13) {
let text = ClearBr(t.innerText);
navigator.clipboard.writeText(text);
}
}
if (t.classList.contains('zhihu-click')) {
if (k.keyCode == 13 || k.keyCode == 32) {
t.click();
}
}
}, null);
// 阅读全文和收起的焦点管理
document.body.addEventListener('click', (e) => {
let t = e.target;
if (t.classList.contains('ContentItem-more') || t.classList.contains('ContentItem-expandButton') || t.classList.contains('ContentItem-action')) {
let parent = t.parentNode;
while (!parent.classList.contains('hotkey-AZ')) {
parent = parent.parentNode;
}
if (parent.classList.contains('hotkey-AZ')) {
let heading = parent.querySelector('h2.ContentItem-title');
if (heading) {
heading.querySelector('a').focus();
}
else {
parent.focus();
}
}
}
}, null);
//全局快捷键函数
function shareShortcutKey(k) {
let hotkey = document.querySelectorAll('.hotkey-AZ');
for (let i=0, l=hotkey.length; i<l; i++) {
if (k.altKey && k.keyCode == 65) {
hotkey[0].focus();
}
if (k.altKey && k.keyCode == 90) {
hotkey[l - 1].focus();
}
}
//获取页面代码
if (k.altKey && k.keyCode == 66) {
console.log(document.body.innerHTML);
var input = document.createElement('input');
input.value = document.body.innerHTML;
document.body.appendChild(input);
}
if (k.altKey && k.keyCode == 82) {
document.querySelector('button[aria-label="更多"]').focus();
}
if (k.keyCode == 113) {
let Comment = document.querySelector('div.CommentItemV2');
if (Comment !== null) {
Comment.setAttribute('tabindex', '-1');
Comment.focus();
} else {
let pinComment = document.querySelector('div.CommentItem');
if (pinComment !== null)
pinComment.setAttribute('tabindex', '-1');
pinComment.focus();
}
}
if (k.altKey && k.keyCode == 81) {
var gb = document.querySelectorAll("button.ContentItem-action");
for (var i = 0; i < gb.length; i++) {
var gbName = gb[i].innerText;
var gbNames = gbName.substring(2, 6);
if (gbName == '​收起评论' || gbNames == '收起评论') {
gb[i].click();
gb[i].focus();
}
}
}
if (k.altKey && k.keyCode == 49) {
var f = document.querySelectorAll('a.QuestionMainAction,a.NumberBoard-item,a[href="/lives"],button.follow-button,button.NumberBoard-itemWrapper');
for (var i = 0; i < f.length; i++) {
//a.zg-btn-white,
f[0].focus();
}
}
if (k.altKey && k.keyCode == 50) {
document.querySelector("button.PaginationButton-prev").focus();
}
if (k.altKey && k.keyCode == 51) {
document.querySelector("button.PaginationButton-next").focus();
}
if (k.altKey && k.keyCode == 52) {
var more = document.querySelector('a.zu-button-more'); {
more.setAttribute('tabindex', '0');
more.focus();
}
}
if (k.ctrlKey && k.keyCode == 81) {
document.querySelector('a[href="/community"]').focus();
}
if (k.altKey && k.keyCode == 88) {
if (document.querySelector('button.QuestionHeader-edit') !== null) {
document.querySelector('button.QuestionHeader-edit').focus();
} else {
document.querySelector('button.NumberBoard-item').focus();
}
}
}

function insdel() {
let ins = document.querySelectorAll('ins' + exclude);
for (let i = 0, l = ins.length; i < l; i++) {
if (!ins[i].classList.contains('veg-mark')) {
ins[i].classList.add('veg-mark');
let parent = ins[i].parentNode;
let div1 = document.createElement("div");
div1.innerHTML = "「已插入：";
parent.insertBefore(div1, ins[i]);
div1.appendChild(ins[i]);
let div2 = document.createElement("span");
div2.innerHTML = "：插入结束」";
ins[i].appendChild(div2);
}
}
let del = document.querySelectorAll('del' + exclude);
for (let i = 0, l = del.length; i < l; i++) {
if (!del[i].classList.contains('veg-mark')) {
del[i].classList.add('veg-mark');
let parent = del[i].parentNode;
let div1 = document.createElement("div");
div1.innerHTML = "「已删除：";
parent.insertBefore(div1, del[i]);
div1.appendChild(del[i]);
let div2 = document.createElement("span");
div2.innerHTML = "：删除结束」";
del[i].appendChild(div2);
}
}
let fh = document.querySelectorAll('span.zg-bull' + exclude);
for (let i = 0, l = fh.length; i < l; i++) {
fh[i].classList.add('veg-mark');
let name = fh[i].innerText;
if (name == '•') {
fh[i].setAttribute('style', 'display:none');
}
}
let gly = document.querySelectorAll('a' + exclude);
for (let i = 0; i < gly.length; i++) {
gly[i].classList.add('veg-mark');
let name = gly[i].innerText;
if (name == '知乎管理员') {
gly[i].setAttribute('href', 'javascript:;');
}
}
}
function ClearBr(key) {
key = key.replace(
/\n(\n)*( )*(\n)*\n/g,
"\n");
return key;
}
//判断是否有可被 focus 的能力
function abilityDetection(t) {
if ((t.tabIndex >= 0 || t.hasAttribute && t.hasAttribute('tabindex') && t.getAttribute('tabindex') == '-1') &&
!t.hasAttribute('disabled') &&
t.getAttribute('aria-hidden') !== 'true' &&
t.offsetParent !== null)
return true;
}
})();