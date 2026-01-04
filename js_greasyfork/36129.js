// ==UserScript==
// @name         APU_LS
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  !
// @author       You
// @match        https://www.lilysilk.com/*
// @match        https://www.lilysilk.jp/*
// @match        https://www.lilysilk.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36129/APU_LS.user.js
// @updateURL https://update.greasyfork.org/scripts/36129/APU_LS.meta.js
// ==/UserScript==

(function(){
	var script=document.createElement('script');
	/*jshint multistr: true */
	script.innerHTML="\
	function create_table(){var text='<tr>';\
	if (document.getElementById('detailImg')===null){var pp=document.getElementsByClassName('detail_img')[0].getElementsByTagName('img');}\
	else{var pp=document.getElementById('detailImg').getElementsByTagName('img');}\
	for (var i=0;i<pp.length;i++){text+='<td style=\\'width:100%;word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;\\'>'+pp[i].src.replace(/100-/g,'1000-')+'</td>';}\
	text+='</tr>';\
	var table=document.createElement('table');\
	table.setAttribute('border','1');\
	table.setAttribute('width','500px');\
	table.setAttribute('style','table-layout:fixed');\
	table.innerHTML=text;\
	if (document.getElementById('product_description')===null){document.getElementsByClassName('productModel')[0].appendChild(table);}\
	else{document.getElementsByClassName('product_model')[0].appendChild(table);}}\
	\
	function remove_table(){\
	$('table:last').remove();}";
	document.getElementsByTagName('head')[0].appendChild(script);

	var button1=document.createElement('button');
	button1.setAttribute('type','button');
	button1.innerHTML='生成表格';
	button1.setAttribute('onclick','create_table()');

	var button2=document.createElement('button');
	button2.setAttribute('type','button');
	button2.innerHTML='删除表格';
	button2.setAttribute('onclick','remove_table()');

	if (document.getElementsByClassName('productModel').length===1){
		document.getElementsByClassName('productModel')[0].appendChild(button1);
		document.getElementsByClassName('productModel')[0].appendChild(button2);
		}
	else{
		document.getElementsByClassName('product_model')[0].appendChild(button1);
        var ss=document.getElementsByClassName('extra_product_attribute_color')[0];
        document.getElementsByClassName('product_model')[0].innerHTML+='<br>';
        for (var i=0;i<ss.getElementsByTagName('img').length;i++){
            document.getElementsByClassName('product_model')[0].innerHTML+=ss.getElementsByTagName('img')[i].alt+'<br>';}
		}
	})();

