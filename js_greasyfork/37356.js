// ==UserScript==
// @name         插入和删除线提示
// @namespace    https://www.zhihu.com/people/yin-xiao-bo-11
// @version      0.1
// @description  可访问性优化
// @author       Veg
// @include *.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37356/%E6%8F%92%E5%85%A5%E5%92%8C%E5%88%A0%E9%99%A4%E7%BA%BF%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/37356/%E6%8F%92%E5%85%A5%E5%92%8C%E5%88%A0%E9%99%A4%E7%BA%BF%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {setTimeout(function() {
proc(document);amo(proc);
}, 10);
function proc(d) {

var ins=d.querySelectorAll("ins");
for (var i=0, l=ins.length; i<l; i++) {
var ac=ins[i].parentNode;
var ad=ins[i].querySelector("span");
if(ad==null) {
var ab=document.createElement("div");
ab.innerHTML="「已插入：";
ac.insertBefore(ab,ins[i]);
ab.appendChild(ins[i]);
var aa=document.createElement("span");
aa.innerHTML="：插入结束」";
ins[i].appendChild(aa);
} }


var del=d.querySelectorAll("del");
for (var i=0, l=del.length; i<l; i++) {
var ac=del[i].parentNode;
var ad=del[i].querySelector("span");
if(ad==null) {
var ab=document.createElement("div");
ab.innerHTML="「已删除：";
ac.insertBefore(ab,del[i]);
ab.appendChild(del[i]);
var aa=document.createElement("span");
aa.innerHTML="：删除结束」";
del[i].appendChild(aa);
} }


}

function amo(processFunction) {
var mcallback = function(records) {
records.forEach(function(record) {
if (record.type == 'childList' && record.addedNodes.length > 0) {
var newNodes = record.addedNodes;
for (var i = 0, len = newNodes.length; i < len; i++) {
if (newNodes[i].nodeType == 1) {
processFunction(newNodes[i]);
} } }
});};
var mo = new MutationObserver(mcallback);
mo.observe(document.body, {'childList': true, 'subtree': true}); }
})();


