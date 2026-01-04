// ==UserScript==
// @name         FTool
// @namespace    http://www.theoft.cn/
// @version      0.3.2
// @description  开发工具快捷链接集合
// @author       Theo Ft
// @match        *://*/*
// @match        chrome://newtab/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/422858/FTool.user.js
// @updateURL https://update.greasyfork.org/scripts/422858/FTool.meta.js
// ==/UserScript==

GM_addStyle ( `
    .ftool {
        position: fixed;
		right: 0;top: 50%;
		margin-top: -50px;
		width: 100px;
		background-color: #e4f7ce;
		text-align: center;
		border: solid 1px #ccc;
		border-bottom-left-radius: 8px;
		border-top-left-radius: 8px;
		z-index: 999999;"
    }
	.ftool a{
		color: #755a19;
		text-decoration: none;
		display:block;
		padding: 4px 8px;
		border-top: 1px solid #ccc;
	}
	.ftool a:first-child{
		border-top: none;
	}
	.ftool a:hover{
		background: #e6e851;
		text-decoration: none;
	}
` );

(function() {
	'use strict';

	var div = document.createElement("div");
	div.classList.add("ftool");
	div.innerHTML = '<a href="https://tool.chinaz.com/tools/unixtime.aspx" target="timestamp">时间戳</a>' +
		'<a href="https://www.json.cn/" target="json">Json序列化</a>' +
		'<a href="https://tool.oschina.net/regex" target="regex">正则表达式</a>' +
		'<a href="http://tools.jb51.net/static/colorpicker/index.html" target="color">颜色选择器</a>' +
		'<a href="https://greasyfork.org/zh-CN" target="greasyfork">greasyfork</a>'
	document.body.appendChild(div)
    if(document.location.href=="https://www.cordcloud.biz/auth/login"){
        $(function(){
            $('#login').click();
        })
    }

    if(document.location.href=="https://www.cordcloud.biz/user"){
        $(function(){
            $('#checkin').click();
        })
    }

})();
