// ==UserScript==
// @name        OSChinaJsonCopyer
// @author      rjw
// @description OSChina在线JSON代码格式化工具 添加 一键复制
// @namespace   com.uestc.rjw
// @icon        https://raw.githubusercontent.com/babyrjw/StaticFiles/master/logo_oschina.gif
// @license     Apache Licence V2
// @encoding    utf-8
// @date        18/10/2015
// @modified    18/10/2015
// @include     http://tool.oschina.net/codeformat/json
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant unsafeWindow
// @run-at      document-end
// @version     1.0.3
// @downloadURL https://update.greasyfork.org/scripts/13157/OSChinaJsonCopyer.user.js
// @updateURL https://update.greasyfork.org/scripts/13157/OSChinaJsonCopyer.meta.js
// ==/UserScript==


/*
 * === 说明 ===
 *@作者:rjw
 *@Email:babyrjw@163.com
 * */

var onekey = $('<input class="btn btn-small btn-primary" id="onkey_copy" type="button" onclick="copy_result()" value="复制">');
$('#format').parent().append(onekey);

unsafeWindow.copy_result = function copy_result(){
	var containerid = 'Canvas';
	if (document.selection) {
		var range = document.body.createTextRange();
		range.moveToElementText(document.getElementById(containerid));
		range.select();
	} else if (window.getSelection) {
		var range = document.createRange();
		range.selectNode(document.getElementById(containerid));
		window.getSelection().removeAllRanges();
		window.getSelection().addRange(range);
	}
	try {  
    // Now that we've selected the anchor text, execute the copy command  
		var successful = document.execCommand('copy');  
		var msg = successful ? 'successful' : 'unsuccessful';  
		alert('Copy  ' + msg);  
	} catch(err) {  
		alert('Oops, unable to copy');  
	}  
}