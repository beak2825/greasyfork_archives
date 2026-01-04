// ==UserScript==
// @name        爱恋BT、漫猫BT种子直下
// @icon        http://www.kisssub.org/images/favicon/kisssub.ico
// @namespace   http://www.kisssub.org/
// @namespace   http://www.comicat.org/
// @match       http://www.kisssub.org/show-*.html
// @match       http://www.comicat.org/show-*.html
// @grant       none
// @version     1.05
// @author      0772Boy
// @description 在爱恋BT、漫猫BT中，"特征码"处增加超链接，点击即可下载该种子；并追加磁力链接。
// @downloadURL https://update.greasyfork.org/scripts/392941/%E7%88%B1%E6%81%8BBT%E3%80%81%E6%BC%AB%E7%8C%ABBT%E7%A7%8D%E5%AD%90%E7%9B%B4%E4%B8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/392941/%E7%88%B1%E6%81%8BBT%E3%80%81%E6%BC%AB%E7%8C%ABBT%E7%A7%8D%E5%AD%90%E7%9B%B4%E4%B8%8B.meta.js
// ==/UserScript==

//种子链接(必须)
var C1=document.getElementsByClassName('right');
var k, i, s, t, m, a, g;
g=' target="_blank" title="点击下载该种子。"';
k='特征码：';
a='http://v2.uploadbt.com/?r=down&hash=';
s='';
for (i=0; i<C1.length; i++) {
    s = C1[i].innerHTML;
    m = s.indexOf(k);
    if (m > 0){
        t = s.substring(0,m+k.length);
        s = s.substring(m+k.length);
        C1[i].innerHTML = t + '<a href="'+ a + s + '"' + g + '>' + s + '</a>';
        break;
    }
}

//磁力链接(可选，不需要的话可以删除以下所有代码。)
var C2=document.getElementsByClassName('tracker-item-show-hide');
var s2;
s2='';
for (i=0; i<C2.length; i++) {
	s2 = s2 + '&tr=' + C2[i].innerHTML;
}
g=' title="磁力链接"';
a='magnet:?xt=urn:btih:';
for (i=0; i<C1.length; i++) {
    m = C1[i].innerHTML.indexOf(k);
    if (m > 0){
        C1[i].innerHTML = C1[i].innerHTML + '&nbsp;&nbsp;&nbsp;&nbsp;<a href="' + a + s + s2 + '"' + g + '>磁力链接</a>&nbsp;&nbsp;';
        break;
    }
}