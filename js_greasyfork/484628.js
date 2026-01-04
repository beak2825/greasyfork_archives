// ==UserScript==
// @name        更换背景色
// @namespace   0xFF336699
// @match       *://*/*
// @grant        GM_addStyle
// @run-at document-start
// @grant GM_registerMenuCommand
// @grant GM_setValue
// @grant GM_getValue
// @run-at context-menu
// @version     0.0.1
// @license      GPL-3.0 License
// @author       0xFF336699
// @description 如果网站body没有设置默认颜色就更换它。有的网站并不适合更换背景色，所以在右键里有个排除菜单，不需要时您设置为排除就行。现在颜色是写死在代码里的，还没想好怎么样让用户动态设置，您要改的话先从代码里改吧，改了的话记得备份到别处，免得脚本升级给覆盖没了您自定义的颜色，肥肠抱歉啊！
// @downloadURL https://update.greasyfork.org/scripts/484628/%E6%9B%B4%E6%8D%A2%E8%83%8C%E6%99%AF%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/484628/%E6%9B%B4%E6%8D%A2%E8%83%8C%E6%99%AF%E8%89%B2.meta.js
// ==/UserScript==


GM_registerMenuCommand("更换body背景色[排除此网站/取消排除]", onSwitchExclude, "H");
let hv
let h = window.location.hostname;
let body;
let favor = "#e8e2d6";
function onSwitchExclude(){
    hv = !hv;
    GM_setValue(h,hv);
   body.style.backgroundColor = hv ? "" : favor ;
}

function later(){
    body = document.getElementsByTagName("body")[0];
    let color = body.style.backgroundColor;
    if(color){
        return;
    }

    hv = GM_getValue(h);
    hv = !!hv;
    if(!hv){
        body.style.backgroundColor = favor;
    }
}

setTimeout(later, 100);