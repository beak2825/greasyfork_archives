// ==UserScript==
// @name        iciba
// @namespace   http://j.mozest.com/zh-CN/userscript/script/122/
// @description 根据设置的 URL 规则自动在访问匹配的网站时开启爱词霸划译。需要在脚本的 URLs 变量中添加规则。
// @version     2015.10.12
// @include		http://*
// @include		https://*
// @exclude		http://www.iciba.com*
// @exclude		/http(s){0,1}://.*?wp-admin/post.php.*/
// @grant		GM_xmlhttpRequest
// @grant		GM_addStyle
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_registerMenuCommand
// @icon		http://www.iciba.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/5030/iciba.user.js
// @updateURL https://update.greasyfork.org/scripts/5030/iciba.meta.js
// ==/UserScript==

(function()
{
	/*规则（正则表达式）*/
	var URLs =
	[
		'[a-zA-z]+://[^\s]*',
	];
	
	/**********************************************************************************/

	var scriptContent = 'var ICIBA_HUAYI_ALLOW = 1;\nvar iciba_huaci_url = \'http:\/\/open.iciba.com\/huaci\/\';\n\nvoid((function(){\n\tif( document.getElementById(\'icIBahyI-yi\') )\n\t{\n\t\treturn;\n\t}\n\telse\n\t{\n\t\tvar el_icIBahyI_yi = document.createElement(\'div\');\n\t\tel_icIBahyI_yi.id = \'icIBahyI-yi\';\n\t\tel_icIBahyI_yi.style.display = \'none\';\n\t\tel_icIBahyI_yi.style.zIndex = \'4294967295\';\n\t\tdocument.body.insertBefore(el_icIBahyI_yi,document.body.firstChild);\n\t\t\n\t\tvar el_icIBahyI_main_box = document.createElement(\'div\');\n\t\tel_icIBahyI_main_box.id = \'icIBahyI-main_box\';\n\t\tel_icIBahyI_main_box.style.display = \'none\';\n\t\tdocument.body.insertBefore(el_icIBahyI_main_box,document.body.firstChild);\n\t\t\n\t\tvar el_icIBahyI_main_box_html = \'\';\n\t\tel_icIBahyI_main_box_html += \'<link type=\"text\/css\" rel=\"stylesheet\" href=\"\' + iciba_huaci_url + \'mini.css\" \/>\';\n\t\tel_icIBahyI_main_box_html += \'<object style=\"height:0px;width:0px;overflow:hidden;\" classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" codebase=\"http:\/\/fpdownload.macromedia.com\/pub\/shockwave\/cabs\/flash\/swflash.cab#version=6,0,0,0\" width=\"0\" height=\"0\" id=\"asound_hanci\" align=\"absmiddle\">\';\n\t\tel_icIBahyI_main_box_html += \'\t<param name=\"allowScriptAccess\" value=\"always\" \/>\';\n\t\tel_icIBahyI_main_box_html += \'\t<param name=\"movie\" value=\"http:\/\/www.iciba.com\/top\/asound.swf\" \/>\';\n\t\tel_icIBahyI_main_box_html += \'\t<param name=\"quality\" value=\"high\" \/>\';\n\t\tel_icIBahyI_main_box_html += \'\t<embed src=\"http:\/\/www.iciba.com\/top\/asound.swf\" quality=\"high\" width=\"0\" height=\"0\" name=\"asound_hanci\" align=\"absmiddle\" allowScriptAccess=\"always\" type=\"application\/x-shockwave-flash\" pluginspage=\"http:\/\/www.macromedia.com\/go\/getflashplayer\" \/>\';\n\t\tel_icIBahyI_main_box_html += \'<\/object>\';\n\t\tel_icIBahyI_main_box_html += \'<div class=\"icIBahyI-main_title\" id=\"icIBahyI-main_title\" >\';\n\t\tel_icIBahyI_main_box_html += \'\t<a href=\"javascript:;\" id=\"icIBahyI-gb\" class=\"icIBahyI-gb\" title=\"关闭\"><\/a>\';\n\t\tel_icIBahyI_main_box_html += \'\t<a href=\"javascript:;\" id=\"icIBahyI-dq\" class=\"icIBahyI-dq2\" title=\"点击固定结果\"><\/a>\';\n\t\tel_icIBahyI_main_box_html += \'\t爱词霸 即划即译\';\n\t\tel_icIBahyI_main_box_html += \'\t<div class=\"icIBahyI-sz_list\" id=\"icIBahyI-sz_list\">\';\n\t\tel_icIBahyI_main_box_html += \'\t\t<a href=\"javascript:;\">关闭即划即译<\/a>\';\n\t\tel_icIBahyI_main_box_html += \'\t\t<a href=\"#\" target=\"_blank\">反馈<\/a>\';\n\t\tel_icIBahyI_main_box_html += \'\t\t<a href=\"#\" style=\"border:none;\" target=\"_blank\">帮助<\/a>\';\n\t\tel_icIBahyI_main_box_html += \'\t\t<span class=\"icIBahyI-j icIBahyI-tl\"><\/span>\';\n\t\tel_icIBahyI_main_box_html += \'\t\t<span class=\"icIBahyI-j icIBahyI-tr\"><\/span>\';\n\t\tel_icIBahyI_main_box_html += \'\t\t<span class=\"icIBahyI-j icIBahyI-bl\"><\/span>\';\n\t\tel_icIBahyI_main_box_html += \'\t\t<span class=\"icIBahyI-j icIBahyI-br\"><\/span>\';\n\t\tel_icIBahyI_main_box_html += \'\t<\/div>\';\n\t\tel_icIBahyI_main_box_html += \'<\/div>\';\n\t\tel_icIBahyI_main_box_html += \'<div class=\"icIBahyI-search\">\';\n\t\tel_icIBahyI_main_box_html += \'\t<input id=\"ICIBA_HUAYI_input\" name=\"\" type=\"text\" onkeydown=\"ICIBA_HUAYI_KEYDOWN(event);\">\';\n\t\tel_icIBahyI_main_box_html += \'\t<a href=\"javascript:;\" class=\"icIBahyI-sear\" onclick=\"ICIBA_HUAYI_searchword()\" >查 词<\/a>\';\n\t\tel_icIBahyI_main_box_html += \'<\/div>\';\n\t\tel_icIBahyI_main_box_html += \'<span class=\"icIBahyI-contTop\"><\/span>\';\n\t\tel_icIBahyI_main_box_html += \'<div class=\"icIBahyI-loading\" id=\"loading\"> <\/div>\';\n\t\tel_icIBahyI_main_box_html += \'<div class=\"icIBahyI-main_cont\" id=\"icIBahyI-main_cont\"><\/div>\';\n\t\tel_icIBahyI_main_box_html += \'<div class=\"icIBahyI-CB\" id=\"icIBahyI-scbiframe\" style=\"display:none\"><\/div>\';\n\t\tel_icIBahyI_main_box_html += \'<div id=\"ICIBA_TOO_LONG\" style=\"height:150px\" class=\"icIBahyI-footer\">您划取的内容太长，建议您去爱词霸<a href=\"http:\/\/fy.iciba.com\">翻译<\/a>页面。<\/div>\';\n\t\tel_icIBahyI_main_box_html += \'<span class=\"icIBahyI-contB\"><\/span>\';\n\t\tdocument.getElementById(\'icIBahyI-main_box\').innerHTML = el_icIBahyI_main_box_html;\n\t\t\n\t\tvar el_script_dict = document.createElement(\'script\');\n\t\tel_script_dict.setAttribute(\'src\', iciba_huaci_url + \'dict.php\');\n\t\tdocument.body.appendChild(el_script_dict);\n\t\t\n\t\tvar el_icIBahyI_main_box = document.createElement(\'div\');\n\t\tel_icIBahyI_main_box.id = \'icIBahyI-USER_LOGIN\';\n\t\tel_icIBahyI_main_box.className = \'icIBahyI-USER_LOGIN\';\n\t\tel_icIBahyI_main_box.style.display = \'none\';\n\t\tdocument.body.insertBefore(el_icIBahyI_main_box,document.body.firstChild);\n\t\t\n\t\tvar el_script_com = document.createElement(\'script\');\n\t\tel_script_com.setAttribute(\'src\', iciba_huaci_url + \'ICIBA_HUACI_COM.js\');\n\t\tdocument.body.appendChild(el_script_com);\n\t}\n})())';

	function insertScript()
	{
		var element = document.createElement( 'script' );
		element.setAttribute( 'type', 'text/javascript' );
		element.appendChild( document.createTextNode( scriptContent ) );
		document.body.appendChild( element );
	}
	
	function match( URL )
	{
		for ( var i = 0; i < URLs.length; ++ i )
		{
			if ( URL.match( new RegExp( URLs[i] ) ) != null )
			{
				return true;
			}
		}
		
		return false;
	};

	function start()
	{
		if ( match( window.location.href ) )
		{
			insertScript();
		}
	};

	start();
})();