// ==UserScript==
// @name         GT798自动挂刀折扣
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://gt798.com/?m=trade*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24597/GT798%E8%87%AA%E5%8A%A8%E6%8C%82%E5%88%80%E6%8A%98%E6%89%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/24597/GT798%E8%87%AA%E5%8A%A8%E6%8C%82%E5%88%80%E6%8A%98%E6%89%A3.meta.js
// ==/UserScript==

var target_discount=25;
items=document.getElementsByClassName('badge');
for (i=0;i<items.length;i++)
{
    discount=items[i].innerText.split('%')[0];
    items[i].innerText +=" "+ Math.round((100-Number(discount))*1.15*100)/100 +"折";
    if(Number(discount)>target_discount)
    {
        items[i].parentElement.parentElement.parentElement.style.backgroundColor='#000';
    }
}