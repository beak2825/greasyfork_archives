// ==UserScript==
// @name         cdsn标题优化
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  下载markdown优化 , cdsn标题优化,稀土掘金
// @author       小明
// @match        https://blog.csdn.net/*
// @match        https://*.csdn.net/*
// @match        https://juejin.cn/post/*
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/p/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454275/cdsn%E6%A0%87%E9%A2%98%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/454275/cdsn%E6%A0%87%E9%A2%98%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';


	window.onload = function(){
			var url = window.location.host;
			//------csdn------csdn------csdn------
			if(url.indexOf('csdn') != -1){
                //1001.优化csdn标题
				var patt = /\(\d*条消息\)/;
				var title = document.getElementsByTagName('title')[0].innerText
				if(title!=null && patt.test(title)){
					document.getElementsByTagName('title')[0].innerText = title.replace(patt,"")
				}
                //1002.优化csdn正文热点关键词样式
				setTimeout(function(){
                    let solist = document.getElementsByClassName('hl-1');
                    if(solist!=null){
                        let len = solist.length;
                        for(var s=len-1;s>=0;s--){
                            solist[s].outerHTML = solist[s].outerText
                        }
                    }
				}, 1800 )

				setTimeout(function(){
					$('.toolbar-advert').remove()
				}, 1800 )

				//1003.优化csdn礼盒
                GM_addStyle('.luck-draw-entry {display:none !important}');
                GM_addStyle('.ivu-carousel {display:none !important}');

                //1004.优化搜索框
                document.getElementById('toolbar-search-input').placeholder=''
                document.getElementById('csdn-toolbar').style.opacity=0.4;
                GM_addStyle('.icon-fire {display:none !important}');

                //1005.优化点赞条
                document.getElementsByClassName('left-toolbox')[0].style.opacity=0.3

                
                //1006.展开代码
				//document.getElementsByClassName('set-code-hide')[0].classList.add('set-code-show');
				//var child_1 = document.getElementsByClassName('set-code-hide')[0].lastElementChild.previousSibling;
				//document.getElementsByClassName('set-code-hide')[0].removeChild(child_1);
				//document.getElementsByClassName('set-code-hide')[0].classList.remove('set-code-hide');
				setTimeout(function(){
				   if(document.getElementsByClassName('set-code-hide')){
					var clist = document.getElementsByClassName('set-code-hide');
					var clen = clist.length;
						if(clen>0){
							for(let s = clen-1;s>=0;s--){
								//代码长度小于50行的就展开
								if(clist[s].lastElementChild.childElementCount<=50){
									clist[s].classList.add('set-code-show');
									var child_1 = clist[s].lastElementChild.previousSibling;
									clist[s].removeChild(child_1);
									clist[s].classList.remove('set-code-hide');

									//clist[s].classList.toggle('set-code-show');
								}
							}
						}
					}
				},3800)


			}
			//------juejin------juejin------juejin------
			if(url.indexOf('juejin') != -1){
                //2001.优化代码块样式
				let slist = document.getElementsByClassName('copy-code-btn')
				let len   = document.getElementsByClassName('copy-code-btn').length
				for(let s=len-1;s>=0;s--){
					slist[s].remove()
				}
			}
			//------zhihu------zhihu------zhihu------
			if(url.indexOf('zhihu') != -1){
				//1001.优化zhihu标题

                //1002.优化zhihu正文热点关键词样式
				setTimeout(function(){
                    let solist = document.getElementsByClassName('css-pgtd2j');
                    if(solist!=null){
                        let len = solist.length;
                        for(var s=len-1;s>=0;s--){
                            solist[s].outerHTML = solist[s].outerText
                        }
                    }
				}, 1800 )

				//1003.优化zhihu文章头部图片
				if(document.getElementsByClassName('css-78p1r9')){
					setTimeout(function(){
						document.getElementsByClassName('css-78p1r9')[0].remove()
					}, 1800 )
				}

				//1005.优化点赞条
				if(document.getElementsByClassName('RichContent-actions')){
					document.getElementsByClassName('ColumnPageHeader')[0].style.opacity=0.3
					document.getElementsByClassName('RichContent-actions')[0].style.opacity=0.3
				}

			}
	}
})();