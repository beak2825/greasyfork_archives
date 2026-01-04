// ==UserScript==
// @name         99Automation
// @namespace    undefined
// @version      0.2
// @description  在话费直充接单页和特价专区增加一个红色按钮
// @author       phoetry
// @match        *://99shou.cn/charge/phone/table?type=doing*
// @include      *://99shou.cn/charge/phone/table/tjzq*
// @license      GPL-3.0-only
// @run-at       document-end
// @grant        nothing
// @downloadURL https://update.greasyfork.org/scripts/381134/99Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/381134/99Automation.meta.js
// ==/UserScript==

(function(){
	if(jQuery){
		var x=$(".layui-btn.layui-btn-danger.layui-btn-sm");
		if(x.length>0)
		x.after('<button id="newx" class="layui-btn layui-btn-sm" style="margin-left:4px;background-color:#f0033a" onclick="fastReceive();setInterval(function(){fastReceive();},3333);">我要开挂</button>');
	}
})();