// ==UserScript==
// @name         南阳理工学院旺旺版自动点赞
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  旺旺版自动点赞
// @author       Nianchen
// @match        QQ空间
// @icon         QQ空间
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433205/%E5%8D%97%E9%98%B3%E7%90%86%E5%B7%A5%E5%AD%A6%E9%99%A2%E6%97%BA%E6%97%BA%E7%89%88%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/433205/%E5%8D%97%E9%98%B3%E7%90%86%E5%B7%A5%E5%AD%A6%E9%99%A2%E6%97%BA%E6%97%BA%E7%89%88%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

var x=5,y=100; //滚动长度
function autoClick()
{
 y=y+5;
var zan=document.getElementsByClassName('item qz_like_btn_v3');
for(var i=0;i<zan.length;i++){
if(zan[i].attributes[6].value=='like'){
zan[i].firstChild.click();
}
};
window.scrollBy(x,y);
}
window.setInterval(autoClick,2000);
