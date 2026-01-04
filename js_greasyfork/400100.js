// ==UserScript==
// @name         zoom.us加速
// @namespace    scarlet-laevateinn.ml
// @version      0.11
// @description  把表单里的zoom.us转成zoom.com.cn
// @author       You
// @match        http://write.blog.csdn.net/mdeditor
// @grant        none
// @include       https://www.umjicanvas.com/*
// @downloadURL https://update.greasyfork.org/scripts/400100/zoomus%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/400100/zoomus%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==
var x=document.getElementById("tool_form")
if (x.action=="https://applications.zoom.us/lti/rich")
{
    x.action="https://applications.zoom.com.cn/lti/rich"
}