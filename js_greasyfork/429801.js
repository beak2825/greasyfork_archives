// ==UserScript==
// @name         OpenWeb
// @namespace    OpenWebweb
// @version      1.023
// @description  自己测试
// @author       you
// @match		http://www.ip138.com
// @match		https://www.ip138.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429801/OpenWeb.user.js
// @updateURL https://update.greasyfork.org/scripts/429801/OpenWeb.meta.js
// ==/UserScript==
var UrlName = 'qquqq';
var urlHead = 'https://en.ddzhuan.cn/survey/agsurvey?asi=';
var urlEnd = '&guid=';

var items = [
'Ak3hgkxxbh4F286cemug1AcaBpv4ev8zD3D',
'Aifhgkxxbh4C286cemug1AcaBalEl0aa2D3D',
'A235gkxxbh4A286cemug1AcaBalExa5t1D3D',
'Ayl5gkxxbh4B286cemug1AcaBalE9vp12D3D',
'A8ujp2Ey5ml2C286cemug1AcaBalE1e062D3D',

];

(function() {
for(var i=0;i<5;i++) {
 (function(i) {
 setTimeout(function() {
 window.open(urlHead+getRandomArr(items,1)+urlEnd+UrlName+Math.round(Math.random()*9999999),'_blank')
}, (i + 1) * getRandomArbitrary(6500,10500));
 })(i)
 }
})();

function getRandomArr(arr, count) {
var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
while (i-- > min) {
index = Math.floor((i + 1) * Math.random());
temp = shuffled[index];
shuffled[index] = shuffled[i];
shuffled[i] = temp;
}
return shuffled.slice(min);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}