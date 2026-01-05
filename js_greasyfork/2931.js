// ==UserScript==
// @name		Yahoo sign up for iranian V4(jasoos1991)
// @description 	اسکریپتی جهت دور زدن تحریم‌های یاهو بر علیه ایران
// @version		4.0.1.3
// @createdate	        2013-09-05
// @update		2014-07-12
// @namespace	http://forum.soft98.ir/member10182.html
// @author		jasoos1991 (from Soft98.ir)
// @homepage	http://forum.soft98.ir/member10182.html
// @license		GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html 
// @include		https://edit.europe.yahoo.com/registration*
// @include		https://na.edit.yahoo.com/registration*
// @include		https://edit.yahoo.com/registration*
// @downloadURL https://update.greasyfork.org/scripts/2931/Yahoo%20sign%20up%20for%20iranian%20V4%28jasoos1991%29.user.js
// @updateURL https://update.greasyfork.org/scripts/2931/Yahoo%20sign%20up%20for%20iranian%20V4%28jasoos1991%29.meta.js
// ==/UserScript==

["", "-rec"].forEach(function(entry) {
	var parent = document.getElementById('country-code'+entry);
	var child = parent.children[0];
	var node = document.createElement("option");
	node.value = '98';
	node.setAttribute('data-country-code', 'ir');
	node.setAttribute('aria-label', 'Iran');
	if (parent.value == '1')
		node.setAttribute('selected', 'selected');
	node.innerHTML = 'Iran (+98)';
	parent.insertBefore(node, child);
});
var referenceNode = document.getElementById('general-message');
var newNode = document.createElement("span");
newNode.setAttribute('style', 'display:block; direction:rtl; text-align:right; font:12px tahoma; color:#bbb;');
newNode.innerHTML = 'http://forum.soft98.ir/member10182.html  ویرایش توسط قاسم صالحی چلچه';
referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);