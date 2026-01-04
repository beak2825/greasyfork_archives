// ==UserScript==
// @name         图书与资料查找-基于“图书查找”脚本制作
// @namespace    tszl-wikipedia-douban-dangdang
// @version      0.1.02.180926
// @description  基于@You的脚本“图书查找”修改，与原脚本互斥！新增对中文维基百科、百度百科的搜索支持，调整快捷键顺序使之更适合所有资料的查找。鼠标选中文字，快捷键alt+1/2/3/4/5,依次跳转到中文维基百科，百度百科，豆瓣，当当，图灵，京东，天猫界面，并进行搜索
// @author       You
// @match        http://*/*
// @match        https://*/*
// @exclude      http://*.baidu.com/*
// @exclude      https://*.baidu.com/*
// @grant        0.1 （修改版）@zzhjim:新增对中文维基百科的支持（alt+1），相应调整各搜索引擎快捷键
//@grant        0.1.01.180926  @zzhjim:新增对百度百科（alt+2）、天猫（alt+7）的支持，相应调整各搜索引擎快捷键（Alt+1-2：百科，Alt+3-4:豆瓣图灵，Alt5-7:网购）
//@grant        0.1.02.180926  @zzhjim:将“豆瓣图书”频道调整为“豆瓣网”，从而支持更多门类资料信息的搜索
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @supportURL    zzhjim@vip.qq.com  dianligegege@163.com

// @downloadURL https://update.greasyfork.org/scripts/372592/%E5%9B%BE%E4%B9%A6%E4%B8%8E%E8%B5%84%E6%96%99%E6%9F%A5%E6%89%BE-%E5%9F%BA%E4%BA%8E%E2%80%9C%E5%9B%BE%E4%B9%A6%E6%9F%A5%E6%89%BE%E2%80%9D%E8%84%9A%E6%9C%AC%E5%88%B6%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/372592/%E5%9B%BE%E4%B9%A6%E4%B8%8E%E8%B5%84%E6%96%99%E6%9F%A5%E6%89%BE-%E5%9F%BA%E4%BA%8E%E2%80%9C%E5%9B%BE%E4%B9%A6%E6%9F%A5%E6%89%BE%E2%80%9D%E8%84%9A%E6%9C%AC%E5%88%B6%E4%BD%9C.meta.js
// ==/UserScript==

(function() {
   $(document).keydown(function (e) {

			var sel = window.getSelection().toString();
			if (sel !== '' && e.altKey) {
				switch (e.which) {
                        // alt+1
                        //中文维基百科
					case 49:
						window.open( 'http://zh.wikipedia.org/w/index.php?search=' + sel);
						break;
                        // alt+2
                        //百度百科
					case 50:
						window.open( 'https://baike.baidu.com/search?word=' + sel);
						break;
                        // alt+3
                        //豆瓣
					case 51:
						window.open('https://douban.com/subject_search?search_text=' + sel);
						break;
                        //alt+4
                        //图灵社区
					case 52:
						window.open('http://www.ituring.com.cn/search?q=' + sel);
						break;
                        //alt+5
                        //当当
					case 53:
						window.open('http://search.dangdang.com/?key=' + sel);
						break;
                        //alt+6
                        //京东
					case 54:
                        //document.execCommand("Copy")
						window.open('https://search.jd.com/Search?keyword='+sel+'&enc=utf-8&wq='+sel)
						break;
                       //alt+7
                        //天猫
					case 55:
                        //document.execCommand("Copy")
						window.open('https://list.tmall.com/search_product.htm?q='+sel)
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