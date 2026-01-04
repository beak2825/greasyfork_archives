// ==UserScript==
// @name         图书查找
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  鼠标选中文字，快捷键alt+1/2/3/4,依次跳转到豆瓣，当当，图灵，京东图书界面，并进行搜索
// @author       You
// @match        http://*/*
// @match        https://*/*
// @exclude      http://*.baidu.com/*
// @exclude      https://*.baidu.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @supportURL   dianligegege@163.com
// @downloadURl  https://github.com/dianligegege/Tampermonkey-script

// @downloadURL https://update.greasyfork.org/scripts/371825/%E5%9B%BE%E4%B9%A6%E6%9F%A5%E6%89%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/371825/%E5%9B%BE%E4%B9%A6%E6%9F%A5%E6%89%BE.meta.js
// ==/UserScript==

(function() {
   $(document).keydown(function (e) {

			var sel = window.getSelection().toString();
			if (sel !== '' && e.altKey) {
				switch (e.which) {
                        // alt+1
                        //豆瓣读书
					case 49:
						window.open('https://book.douban.com/subject_search?search_text=' + sel);
						break;
                        //alt+2
                        //当当图书
					case 50:
						window.open('http://search.dangdang.com/?key=' + sel);
						break;
                        //alt+3
                        //图灵社区
					case 51:
						window.open('http://www.ituring.com.cn/search?q=' + sel);
						break;
                        //alt+4
                        //京东图书
					case 52:
                        //document.execCommand("Copy")
						window.open('https://search.jd.com/Search?keyword='+sel+'&enc=utf-8&wq='+sel)
						break;
					default:
						break;
				}
			}

		});

//		if (window.url = 'https://www.jiumodiary.com/') {
//			var search = $('#SearchWord');
//			var searchbtn = $('#SearchButton');
//			console.log(search);
//			search.val(sel) ;
//            console.log(search.val());
//			searchbtn.click();
//			console.log(123)
//		};
})();