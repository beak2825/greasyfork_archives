// ==UserScript==
// @name         rjno1.com Clean Script
// @name:zh-CN      rjno1.com 清理脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  clean rjno1.com's ad-disable plugin warning.
// @description:zh-CN 清理rjno1.com的广告屏蔽插件警告
// @author       ZhangHua
// @match        https://www.rjno1.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401810/rjno1com%20Clean%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/401810/rjno1com%20Clean%20Script.meta.js
// ==/UserScript==
(function()
{
    var target = document.getElementsByTagName("img")[0]
    if (target.getAttribute("style")=="display:none")
    {
        target.parentNode.removeChild(target)
    }
    var divTarget=document.getElementsByTagName("div")[0]
    if (divTarget.getAttribute("style")=="width: 0px;height: 0px;overflow: hidden;visibility: hidden;")
    {
        divTarget.parentNode.removeChild(divTarget)
    }
    var textTarget1=document.getElementsByTagName("div")[0]
    textTarget1.remove()
    var textTarget2=document.getElementsByTagName("div")[0]
    textTarget2.remove()
}
)();