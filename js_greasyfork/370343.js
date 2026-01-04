// ==UserScript==
// @name         lilysilk_magento图片采集
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  !
// @author       leseul
// @match        https://www.lilysilk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370343/lilysilk_magento%E5%9B%BE%E7%89%87%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/370343/lilysilk_magento%E5%9B%BE%E7%89%87%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

(function(){
	var script=document.createElement('script');
	/*jshint multistr: true */
	script.innerHTML="\
		function create_table(){\
			var text='<tr>';\
			var imgs=document.getElementById('product-main-image-list').getElementsByTagName('img');\
			for (var i=0;i<imgs.length;i++){\
				url=imgs[i].src;\
				text+='<td style=\\'width:100%;word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;\\'>'+url+'</td>';\
				}\
			text+='</tr>';\
		var table=document.createElement('table');\
		table.setAttribute('border','1');\
		table.setAttribute('width','500px');\
		table.setAttribute('style','table-layout:fixed');\
		table.innerHTML=text;\
		document.getElementsByClassName('product-type-data')[0].appendChild(table);}";
	document.getElementsByTagName('head')[0].appendChild(script);

	var button1=document.createElement('button');
	button1.setAttribute('type','button');
	button1.innerHTML='生成表格';
	button1.setAttribute('onclick','create_table()');

	document.getElementsByClassName('sku')[0].appendChild(button1);

	})();
