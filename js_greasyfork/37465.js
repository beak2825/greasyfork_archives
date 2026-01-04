// ==UserScript==
// @name         markdown to bbcode
// @namespace    https://bbs.kafan.cn/thread-2113607-1-1.html
// @description  将markdown文本粘贴至textarea，右键单击文本区，弹出菜单中选择“markdown -> bbcode”
// @version      0.1
// @author       halffog
// @include      http*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37465/markdown%20to%20bbcode.user.js
// @updateURL https://update.greasyfork.org/scripts/37465/markdown%20to%20bbcode.meta.js
// ==/UserScript==
(function() {
'use strict';

var textareas = document.getElementsByTagName('textarea');
if (!textareas) return;
function $C(type, arr){
	var e = document.createElement(type);
	for(var [name, val] in Iterator(arr)){
		e.setAttribute(name, val);
	}
	return e;
}
for (var i = 0; i < textareas.length; i++){
	var textarea = textareas[i];
	var menuitem = $C('menuitem',{label:'markdown -> bbcode'});
	menuitem.addEventListener('click', function(){
		var value = textarea.value;
		var texts = value.split(/^>\s((?:.|\n>\s)*.*)$/gm);
		value = '';
		for (var j = 0; j < texts.length; j++){
			var text = texts[j];
			if (j%2 ==0){
				text = text.replace(/^(\#{1,6})((?:.|\n)*?)(\#{1,6})$/gm, function(wholeMatch,m1,m2,m3){
					var h_level = m1.length;
					return (h_level == m3.length)?'<h' + h_level + '>' + m2 + '</h' + h_level + '>':wholeMatch;
				});
				text = text.replace(/\*((?:.|\n)*?)\*/g,'[i]$1[/i]');
				text = text.replace(/__((?:.|\n)*?)__/g,'[b]$1[/b]');
				text = text.replace(/\!\[((?:.|\n)*?)\]\((.*)\)/g,'[img=$2]$1[/img]');
				text = text.replace(/\[((?:.|\n)*?)\]\((.*)\)/g,'[url=$2]$1[/url]');
			}else{
				text = '[code]' + text.replace(/^>\s/gm,'') + '[/code]';
			}
			value += text;
		}
		textarea.value = value;
	},false);
	var menu = $C('menu',{id:'markdown-to-bbcode-' + i,type:'context'});
	menu.appendChild(menuitem);
	textarea.appendChild(menu);
	textarea.setAttribute('contextmenu', menu.id);
}

})();   