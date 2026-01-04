// ==UserScript==
// @name         学习强国辅助 带辅助模式切换(js基础学习资料脚本 仅供学习)
// @namespace    http://tampermonkey.net/
// @version      0.18
// @description  本学习资料脚本适用于初学者基础学习； 可在每日答题\每周答题\专项答题页面运行本学习资料脚本后 通过观察页面提示内容的辅助填写测试过程 帮助学习理解js基础知识； 【某些人直接复制此脚本老版本代码发布吸引人气并诱导用户加入QQ群 为了您的利益不受危害 请注意鉴别】
// @author       little child
// @match        https://pc.xuexi.cn/points/exam-weekly-detail.html*
// @match        https://pc.xuexi.cn/points/exam-practice.html*
// @match        https://pc.xuexi.cn/points/exam-paper-detail.html*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/421703/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E8%BE%85%E5%8A%A9%20%E5%B8%A6%E8%BE%85%E5%8A%A9%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2%28js%E5%9F%BA%E7%A1%80%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%96%99%E8%84%9A%E6%9C%AC%20%E4%BB%85%E4%BE%9B%E5%AD%A6%E4%B9%A0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/421703/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E8%BE%85%E5%8A%A9%20%E5%B8%A6%E8%BE%85%E5%8A%A9%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2%28js%E5%9F%BA%E7%A1%80%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%96%99%E8%84%9A%E6%9C%AC%20%E4%BB%85%E4%BE%9B%E5%AD%A6%E4%B9%A0%29.meta.js
// ==/UserScript==


(function() {
'use strict';

var ttds = 15;
var tttg = null;
var tttdst = null;
var tttdstm = 'auto';
var onaaaaace=0;
function ngttttstxytinps() {
var tttdstmc = 0;
var tttts = [];
var ttttsw = {};
var ttttswx = 0;
var ttttswxy = 0;
var ttttsta = false;
if (document.querySelector(".q-header") == null)
{
if (document.querySelector(".ant-btn.action.ant-btn-primary") != null)
{
document.querySelector("#my_div").remove();
return;
} else {
setTimeout(ngttttstxytinps, 1000);
return;
}
}
if(onaaaaace==0) {ttttstxytinpseoidv(); onaaaaace++};
var ttttstx = document.querySelector(".q-header").innerText.substr(0, 3);
if (document.querySelector(".q-footer .tips") != null) {
document.querySelector(".q-footer .tips").click();
} else
{
nttttstxytinps(1);
return;
}
document.querySelectorAll('.line-feed [color=red]').forEach(function(a, b, c) {
let i = a.innerText;
if (i != "") tttts.push(i);
});
switch (ttttstx) {
case "单选题":
ttttswxy = 1;
case "多选题":
tttdstmc = document.querySelectorAll('.q-answers .chosen').length;
if (tttdstmc <= 0) {

let tertetetetret=document.querySelectorAll('.q-answer');
for(let i=0;i<tertetetetret.length;i++){
let a=tertetetetret[i];
var ttttstxxx = a.innerHTML.split('. ').slice(-1)[0];
var ttttstxxxs = false;
var ttttstxxxsz = 0;
var ttttstxxxszc = false;
var ttttstxytxtzc = tttts.join('');
ttttstxxxszc = Boolean(a.className.indexOf("chosen") != -1);
ttttstxxxs = (ttttstxxx.indexOf(ttttstxytxtzc) != -1 || ttttstxytxtzc.indexOf(ttttstxxx) != -1) && ttttstxytxtzc != "";
if (ttttstxxxs && !ttttstxxxszc) {
a.click();
tttdstmc++;
}
if (!ttttstxxxs) {
ttttstxxxsz += ttttstxytinpseoidvzz(ttttstxytxtzc, a.innerHTML);
ttttsw[ttttstxxxsz] = a;
}
if(ttttstxxx==ttttstxytxtzc&&tttdstmc>0) break;
}



if (tttdstmc == 0) {
for (let i in ttttsw) {
ttttswx = Number(ttttswx) >= Number(i) ? Number(ttttswx) : Number(i);
}
ttttsw[ttttswx].click();
tttdstmc++;
ttttsta = true;
}
ttttswxy = ttttswxy == 0 ? 2500 : 1500;
}
break;
case "填空题":
var ttttstxytinps = document.querySelectorAll('.q-body input');
var ttttstxytinpse = document.querySelectorAll('.q-body input[value=""]');
tttdstmc = ttttstxytinps.length - ttttstxytinpse.length;
if (ttttstxytinpse.length > 0) {
var ev = new Event('input', {bubbles: true});
ttttstxytinps.forEach(function(a, b, c) {
if (tttts[0] == undefined) {
ttttsta = true;
let a = document.querySelector(".q-body").innerText;
let n = parseInt(Math.random() * 2 + 2);
let i = parseInt(Math.random() * (a.length - n - 1));
tttts[0] = a.substr(i, n);
}
var value = "";
if (c.length == 1)
value = tttts.join('');
else
value = b < tttts.length ? tttts[b] : tttts[0];
if (a.value == "") {

a.setAttribute("value", value);
a.dispatchEvent(ev);
tttdstmc++;
}
})
ttttswxy = 3000;
}
break;
}
ttttstxytinpseo(tttdstmc, ttttsta, ttttswxy);
}

function nttttstxytinps(tttdstmc = 0) {
if (tttdstmc > 0 && tttdstm == 'auto') {
let b=document.querySelector(".detail-body button:not(:disabled)");     //detail-body为题目div
if(b!=null)
{
b.click();
tttg = setTimeout(ngttttstxytinps, parseInt(Math.random() * 1000 + 2000));
}
else
{
let p = document.querySelector("#my_p");
p.innerHTML ="请手动做题后，点击下面按钮切换到自动模式";
tttdstm = "manual";
document.querySelector("#manual").style.display="none";
document.querySelector("#auto").style.removeProperty('display');
}
}
}

function ttttstxytinpseo(tttdstmc = 0, ttttsta = false, ttttswxy = 0) {
if (!ttttsta) {
tttg = setTimeout(function() {nttttstxytinps(tttdstmc)}, parseInt(Math.random() * 1500 + ttttswxy));
return;
}
tttdstm = "wait";
let ds_c = 0;
let p = document.querySelector("#my_p");
p.innerHTML ="<span style='color:red;'>此题无完全匹配答案，已填写(选择)一个相对最匹配的答案(可能是错误的)。<br>你可以点击下面按钮切换到手动模式并修正答案后再次点击按钮切换到自动模式。<br>若 <span id='my_ds_c'>" +
ttds + "</span> 秒无操作则继续自动测试</span>";
tttdst = setInterval(function() {
ds_c++;
document.querySelector("#my_ds_c").innerText = ttds - ds_c;
if (ds_c >= ttds) {
p.innerHTML="自动测试中...";
clearInterval(tttdst);
tttdst = null;
tttdstm = 'auto';
ngttttstxytinps();
}
}, 1000);

}

function ttttstxytinpseoidvzz(a = '', b = '') {
let c = 0;
for (let i = 0; i < b.length; i++) {
if (a.indexOf(b.substr(i, 1)) != -1) {
c++;
}
}
return c;
}

function ttttstxytinpseoidv(){
let d= document.createElement("div");
d.id = "my_div";
d.style.cssText='text-align: center;border: 1px solid #f0f0f0; background-color: rgb(200,227,255); padding: 10px; margin: -20px auto 10px auto;'
let p = document.createElement("p");
p.id = "my_p";
p.style.fontSize = '22px';
p.innerHTML= '自动测试中...';
d.appendChild(p);
let exam=document.querySelector(".detail-body");
exam.parentNode.insertBefore(d,exam);

let b1 = document.createElement("button");
let b2 = document.createElement("button");
b1.style.cssText='color:green; font-size: 20px; text-align: center; margin-top: 10px; cursor: pointer; width: 200px; height: 40px;';
b2.style.cssText='color:red;   font-size: 20px; text-align: center; margin-top: 10px; cursor: pointer; width: 200px; height: 40px;';
b1.id = 'manual';
b2.id = 'auto';
b1.innerText = '切换到手动模式';
b2.innerText = '切换到自动模式';
b2.style.display="none";
b1.onclick = function() {
let p=document.querySelector("#my_p");
if (tttdst != null) {
clearInterval(tttdst);
tttdst = null;
}
if (tttg != null) {
clearInterval(tttg);
tttg = null;
}
tttdstm = "manual";
p.innerHTML= '手动测试中...';
b1.style.display="none";
b2.style.removeProperty('display');
}
b2.onclick = function() {
let p=document.querySelector("#my_p");
if (tttdst != null) {
clearInterval(tttdst);
tttdst = null;
}
tttdstm = 'auto';
p.innerHTML= '自动测试中...';
ngttttstxytinps();
b2.style.display="none";
b1.style.removeProperty('display');
}
d.appendChild(b1);
d.appendChild(b2);

}

tttg = setTimeout(function(){ngttttstxytinps();}, parseInt(Math.random() * 1000 + 2000));

})();