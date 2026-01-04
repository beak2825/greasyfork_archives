// ==UserScript==
// @name         显示lofter.com图片的原图网址
// @namespace    https://saber.love/?p=4073
// @version      0.1
// @description  在lofter.com的文章页，显示图片的原图网址，方便下载。
// @author       雪见仙尊 xuejianxianzun
// @match        *.lofter.com/post/*
// @icon 		http://ssf91.lofter.com/favicon.ico
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/39730/%E6%98%BE%E7%A4%BAloftercom%E5%9B%BE%E7%89%87%E7%9A%84%E5%8E%9F%E5%9B%BE%E7%BD%91%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/39730/%E6%98%BE%E7%A4%BAloftercom%E5%9B%BE%E7%89%87%E7%9A%84%E5%8E%9F%E5%9B%BE%E7%BD%91%E5%9D%80.meta.js
// ==/UserScript==

'user strict';

let pic_urls = '';
let pic_elements = document.querySelectorAll('.imgclasstag');
if (pic_elements.length > 0) {
	for (const e of pic_elements) {
		pic_urls += e.getAttribute('bigimgsrc').split('?')[0] + '<br>';
	}
	pic_elements[0].parentNode.parentNode.parentNode.parentNode.insertAdjacentHTML('afterbegin', pic_urls);
}