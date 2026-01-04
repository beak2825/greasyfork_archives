// ==UserScript==
// @name         高亮隐藏
// @namespace    https://www.gitlink.org.cn/sonichy
// @version      1.1.1
// @description  高亮含有关键字的链接，隐藏含有关键字的链接，隐藏GIF图片。
// @author       sonichy@163.com
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/498001/%E9%AB%98%E4%BA%AE%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/498001/%E9%AB%98%E4%BA%AE%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function(){
	'use strict';
	
	GM_registerMenuCommand('设置', function() {
        var dialog = document.createElement('dialog');
		var div = document.createElement('div');
        div.style.textAlign = 'right';
		var button = document.createElement('button');
        button.textContent = 'X';
        button.onclick = function(){ dialog.close(); }
        div.appendChild(button);
		dialog.appendChild(div);
        var h3 = document.createElement('h3');
        h3.textContent = '设置';
        h3.style.textAlign = 'center';
		h3.style.margin = '0';
        dialog.appendChild(h3);
        var p = document.createElement('p');
        p.style.whiteSpace = 'nowrap';
		var checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.checked = GM_getValue('is_light', true);
		checkbox.style.verticalAlign = 'top';
		checkbox.onchange = function(){
			GM_setValue('is_light', checkbox.checked);
			if (checkbox.checked) {
				msg.textContent = '开启高亮关键字';
			} else {
				msg.textContent = '关闭高亮关键字';
			}
		}
		p.appendChild(checkbox);
        var span = document.createElement('span');
        span.textContent = '高亮关键字';
        span.style.verticalAlign = 'top';
        p.appendChild(span);
        var textarea_light = document.createElement('textarea');
        textarea_light.rows = '5';
		textarea_light.value = GM_getValue('keyword_light', '');
		textarea_light.style.margin = '0 5px';
        p.appendChild(textarea_light);
        var button_save_light = document.createElement('button');
        button_save_light.textContent = '保存';
        button_save_light.style.verticalAlign = 'top';
        p.appendChild(button_save_light);
        dialog.appendChild(p);
		
		p = document.createElement('p');
		p.style.whiteSpace = 'nowrap';
		checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.checked = GM_getValue('is_hide', true);
		checkbox.style.verticalAlign = 'top';
		checkbox.onchange = function(){
			GM_setValue('is_hide', checkbox.checked);
			if (checkbox.checked) {
				msg.textContent = '开启隐藏关键字';
			} else {
				msg.textContent = '关闭隐藏关键字';
			}
		}
		p.appendChild(checkbox);
        span = document.createElement('span');
        span.textContent = '隐藏关键字';
        span.style.verticalAlign = 'top';
        p.appendChild(span);
        var textarea_hide = document.createElement('textarea');
        textarea_hide.rows = '5';
		textarea_hide.value = GM_getValue('keyword_hide', '');
		textarea_hide.style.margin = '0 5px';
        p.appendChild(textarea_hide);
        var button_save_hide = document.createElement('button');
        button_save_hide.textContent = '保存';
        button_save_hide.style.verticalAlign = 'top';
        p.appendChild(button_save_hide);
        dialog.appendChild(p);

        p = document.createElement('p');
        checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.checked = GM_getValue('is_hideGIF', false);
		//checkbox.style.verticalAlign = 'top';
		checkbox.onchange = function(){
			GM_setValue('is_hideGIF', checkbox.checked);
			if (checkbox.checked) {
				msg.textContent = '开启隐藏GIF';
			} else {
				msg.textContent = '关闭隐藏GIF';
			}
		}
        p.appendChild(checkbox);
        span = document.createElement('span');
        span.textContent = '隐藏GIF';
        //span.style.verticalAlign = 'top';
        p.appendChild(span);
        dialog.appendChild(p);

		var msg = document.createElement('p');
		msg.textContent = '关键字使用;分隔';
		dialog.appendChild(msg);
		button_save_light.onclick = function(){
			GM_setValue('keyword_light', textarea_light.value);
			msg.textContent = '已经保存：高亮关键字';
		}
		button_save_hide.onclick = function(){
			GM_setValue('keyword_hide', textarea_hide.value);
			msg.textContent = '已经保存：隐藏关键字';
		}
        document.body.appendChild(dialog);
        dialog.showModal();
    });

    var s = GM_getValue('keyword_light', '');
	if (s != '' && GM_getValue('is_light', true)) {
		var sl = s.split(';');
		var a = document.getElementsByTagName('a');
		for (var i=0; i<a.length; i++) {
			for (var j=0; j<sl.length; j++) {
				if (a[i].textContent.indexOf(sl[j]) != -1) {
					a[i].style.color = 'white';
					a[i].style.backgroundColor = '#DA3434';
					a[i].innerHTML = a[i].textContent;
				}
			}
		}
	}
	
	s = GM_getValue('keyword_hide', '');
	if (s != '' && GM_getValue('is_hide', true)) {
		sl = s.split(';');
		a = document.getElementsByTagName('a');
		for (i=0; i<a.length; i++) {
			for (j=0; j<sl.length; j++) {
				if (a[i].textContent.indexOf(sl[j]) != -1) {
					a[i].style.display = 'none';
				}
			}
		}
	}

    if (GM_getValue('is_hideGIF', false)) {
		var img = document.getElementsByTagName('img');
		for (i=0; i<img.length; i++) {
			if (img[i].src.toLowerCase().endsWith('.gif')) {
                img[i].style.display = 'none';
			}
		}
	}
	
})();