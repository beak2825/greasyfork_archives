// ==UserScript==
// @name         Display
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Display your remaining data of the Campus Network.
// @author       Ricardo
// @match        http://59.67.0.220/
// @icon         http://pan-yz.chaoxing.com/thumbnail/origin/5009eb87d4e6ad14c7ecc0a70794e003?type=img
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434739/Display.user.js
// @updateURL https://update.greasyfork.org/scripts/434739/Display.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function() {
        const all=5120;//总流量
        var s=document.getElementsByName('PageTips')[0].innerText;//获取字符串
        var nums=s.match(/\d+\.\d+/g);//通过正则表达式提取字符串中的包含小数点的数字
        /*该字符串中一共有三个数字：已用时间、已用流量、余额，一般只有已用流量包含小数*/
        //var used=Number(s.slice(24,31));
        var used=nums[0];
        var left=document.createElement('div')
        document.getElementsByName('PageTips')[0].children[6].append(left);
        left.innerText='剩余流量：'+(all-used).toFixed(3)+" MByte";
};
    // Your code here...
})();