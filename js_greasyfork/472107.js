// ==UserScript==
// @name         自用工具箱
// @namespace    http://tampermonkey.net/
// @version      1.04
// @license      Every one
// @description  该脚本是自己用的工具箱！
// @author       不染伤痕
// @match        *://*/*
// @icon         http://localhost:4090/chfs/shared/share/%E6%88%91%E7%9A%84%E9%A1%B9%E7%9B%AE%E8%B5%84%E6%BA%90/%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E7%B1%BB/%E7%A7%81%E7%94%A8%E5%B7%A5%E5%85%B7%E7%AE%B1/%E5%9B%BE%E6%A0%87/icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472107/%E8%87%AA%E7%94%A8%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/472107/%E8%87%AA%E7%94%A8%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

window.onload = function(){

    let sourceAddress = "http://brshfilesystem.kele.plus/";

    //如果在iframe中就跳过渲染
    if (self.frameElement && self.frameElement.tagName == "IFRAME") {
        console.log("跳过iframe");
　　    return;
    }
    if (window.frames.length != parent.frames.length) {
        console.log("跳过iframe");
　　    return;
    }
    if (self != top) {
        console.log("跳过iframe");
        return;
    }
    console.log("已加载不染伤痕工具箱");
	var script = document.createElement('script');
	script.src = sourceAddress + 'chfs/shared/share/%E6%88%91%E7%9A%84%E9%A1%B9%E7%9B%AE%E8%B5%84%E6%BA%90/%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E7%B1%BB/%E7%A7%81%E7%94%A8%E5%B7%A5%E5%85%B7%E7%AE%B1/Script/Main.js';
	document.head.appendChild(script);
}