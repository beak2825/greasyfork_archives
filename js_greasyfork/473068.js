// ==UserScript==
// @name         让链接可点击
// @namespace    https://viayoo.com/
// @version      0.1
// @homepageURL  https://app.viayoo.com/addons/31
// @author       谷花泰
// @run-at       document-start
// @match        *
// @description  如其名
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473068/%E8%AE%A9%E9%93%BE%E6%8E%A5%E5%8F%AF%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/473068/%E8%AE%A9%E9%93%BE%E6%8E%A5%E5%8F%AF%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==
(function () {
/* 判断是否该执行 */
/* 网址黑名单制，遇到这些域名不执行 */
const blackList = ['example.com'];

const hostname = window.location.hostname;
const key = encodeURIComponent('谷花泰:让链接可点击:执行判断');
const isBlack = blackList.some(keyword => {
if (hostname.match(keyword)) {
return true;
};
return false;
});

if (isBlack || window[key]) {
return;
};
window[key] = true;

class ClickLink {
constructor() {
this.init();
};
init() {
console.log('嘿嘿嘿');
this.url_regexp = /((https?:\/\/|www\.)[\x21-\x7e]+[\w\/=]|\w([\w._-])+@\w[\w\._-]+\.(com|cn|org|net|info|tv|cc|gov|edu)|(\w[\w._-]+\.(com|cn|org|net|info|tv|cc|gov|edu))(\/[\x21-\x7e]*[\w\/])?|ed2k:\/\/[\x21-\x7e]+\|\/|thunder:\/\/[\x21-\x7e]+=)/gi;
this.urlPrefixes = ['http://', 'https://', 'ftp://', 'thunder://', 'ed2k://', 'mailto://', 'file://'];
document.addEventListener("mouseover", this.clearLink.bind(this));
this.excludedTags = "a,svg,canvas,applet,input,button,area,pre,embed,frame,frameset,head,iframe,img,option,map,meta,noscript,object,script,style,textarea,code".split(",");
this.xPath = "//text()[not(ancestor::" + this.excludedTags.join(') and not(ancestor::') + ")]";
this.startObserve();
setTimeout(this.linkMixInit.bind(this), 100);
};
clearLink(event) {
let j, len, link, prefix, ref, ref1, url;
link = (ref = event.originalTarget) != null ? ref : event.target;

if (!(link != null && link.localName === "a" && ((ref1 = link.className) != null ? ref1.indexOf("textToLink") : void 0) !== -1)) {
return;
};

url = link.getAttribute("href");

for (j = 0, len = this.urlPrefixes.length; j < len; j++) {
prefix = this.urlPrefixes[j];

if (url.indexOf(prefix) === 0) {
return;
};
};
};
setLink(candidate) {
let ref, ref1, ref2, span, text;

if (candidate == null || ((ref = candidate.parentNode) != null ? (ref1 = ref.className) != null ? typeof ref1.indexOf === "function" ? ref1.indexOf("textToLink") : void 0 : void 0 : void 0) !== -1 || candidate.nodeName === "#cdata-section") {
return;
};

text = candidate.textContent.replace(this.url_regexp, '<a href="$1" target="_blank" class="textToLink">$1</a>');

if (((ref2 = candidate.textContent) != null ? ref2.length : void 0) === text.length) {
return;
};

span = document.createElement("span");
span.innerHTML = text;
return candidate.parentNode.replaceChild(span, candidate);
};
linkPack(result, start) {
let i, j, k, ref, ref1, ref2, ref3, startTime;
startTime = Date.now();

while (start + 10000 < result.snapshotLength) {
for (i = j = ref = start, ref1 = start + 10000; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
this.setLink(result.snapshotItem(i));
};

start += 10000;

if (Date.now() - startTime > 2500) {
return;
};
};

for (i = k = ref2 = start, ref3 = result.snapshotLength; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
this.setLink(result.snapshotItem(i));
};
};
linkify(node) {
let result;
result = document.evaluate(this.xPath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
return this.linkPack(result, 0);
};
linkFilter(node) {
let j, len, tag;

for (j = 0, len = this.excludedTags.length; j < len; j++) {
tag = this.excludedTags[j];

if (tag === node.parentNode.localName.toLowerCase()) {
return NodeFilter.FILTER_REJECT;
};
};

return NodeFilter.FILTER_ACCEPT;
};
observePage(root) {
const tW = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
acceptNode: this.linkFilter
}, false);

while (tW.nextNode()) {
this.setLink(tW.currentNode);
};
};
startObserve() {
this.observer = new window.MutationObserver(mutations => {
let Node, j, k, len, len1, mutation, ref;

for (j = 0, len = mutations.length; j < len; j++) {
mutation = mutations[j];

if (mutation.type === "childList") {
ref = mutation.addedNodes;

for (k = 0, len1 = ref.length; k < len1; k++) {
Node = ref[k];
this.observePage(Node);
};
};
};
});

};
linkMixInit() {
if (window !== window.top || window.document.title === "") {
return;
};

this.linkify(document.body);

return this.observer.observe(document.body, {
childList: true,
subtree: true
});
};
};

try {
new ClickLink();
} catch (err) {
console.log('via插件：让链接可点击：加载失败', err);
};
})();
