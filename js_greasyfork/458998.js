// ==UserScript==
// @name           自用腳本修改
// @license MIT
// @version        1.1
// @description    自用腳本修改說明

// @match       https://www.youtube.com/*
// @match        https://www.pixiv.net/*

// @namespace https://greasyfork.org/users/4839
// @downloadURL https://update.greasyfork.org/scripts/458998/%E8%87%AA%E7%94%A8%E8%85%B3%E6%9C%AC%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/458998/%E8%87%AA%E7%94%A8%E8%85%B3%E6%9C%AC%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==
//top按鈕已去除
//哆啦B梦的弟弟https://greasyfork.org/scripts/794
//翻頁快捷键
(function () {
    var newHeight = document.body.scrollHeight + 9999999999;
  //var newWidth = document.body.scrollWidth + 9999999999;

    var scroll = {
	'4' : function() { scrollBy(-window.innerHeight/3,  0) }, //往左1/3
	'f' : function() { scrollBy(-window.innerHeight/3,  0) }, //往左1/3
	'F' : function() { scrollBy(-window.innerHeight/3,  0) }, //往左1/3

	'5' : function() { scrollBy(window.innerHeight/3,  0) }, //往右1/3
	'6' : function() { scrollBy(window.innerHeight/3,  0) }, //往右1/3
	'g' : function() { scrollBy(window.innerHeight/3,  0) }, //往右1/3
	'G' : function() { scrollBy(window.innerHeight/3,  0) }, //往右1/3

	'' : function() { scrollBy(0,  window.innerHeight / 2) },
  'D' : function() { scrollBy(0,  window.innerHeight / 2) },
	'c' : function() { scrollBy(0,  window.innerHeight / 2) },
  'C' : function() { scrollBy(0,  window.innerHeight / 2) },
	'3' : function() { scrollBy(0,  window.innerHeight / 2) },  // 往下半

	'' : function() { scrollBy(0, -window.innerHeight / 2) },
  'A' : function() { scrollBy(0, -window.innerHeight / 2) },
	'z' : function() { scrollBy(0, -window.innerHeight / 2) },
  'Z' : function() { scrollBy(0, -window.innerHeight / 2) },
	'1' : function() { scrollBy(0, -window.innerHeight / 2) },  // 往上半

	'' : function() { scrollBy(0, -window.innerHeight-1) },// 往下頁
  '' : function() { scrollBy(0, -window.innerHeight-1) },// 往下頁

	'' : function() { scrollBy(0, window.innerHeight+1) },// 往上頁
	'' : function() { scrollBy(0, window.innerHeight+1) },// 往上頁

	'w' : function() { scrollTo(0, 0) },
	'W' : function() { scrollTo(0, 0) },// 回頁首

	's' : function() { scrollTo(0,document.body.scrollHeight) },
	'S' : function() { scrollTo(0,document.body.scrollHeight) },// 回頁尾
    };
    var formElement = { 'input':true, 'button':true, 'select':true, 'textarea':true };
    window.addEventListener('keypress',
        function(e) {
            if (e.metaKey || e.ctrlKey || e.altKey ||
                formElement[e.target.tagName.toLowerCase()] || e.target.isContentEditable || document.designMode ==="on") {
                return; }
            var key = (e.shiftKey? 'S-' : '') + String.fromCharCode(e.charCode);
            if (scroll[key]) {
                scroll[key]();
                e.preventDefault();
                e.stopPropagation();
            }
        }, false);
})();