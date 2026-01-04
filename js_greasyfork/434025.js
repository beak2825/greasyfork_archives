// ==UserScript==
// @name         中国天气网精简
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  中国天气网天气页面精简，匹配了新版和旧版
// @author       AiniyoMua
// @home-url     https://greasyfork.org/zh-CN/scripts/434025
// @homepageURL  https://greasyfork.org/zh-CN/scripts/434025
// @supportURL   https://greasyfork.org/zh-CN/scripts/434025/feedback
// @grant        GM_addStyle
// @match        *://www.weather.com.cn/*
// @icon         data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAAEEfUpiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDFEMTBDQTQ5MjQ3MTFFOEJGNjZEMUNBMkFFNTQzREYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDFEMTBDQTU5MjQ3MTFFOEJGNjZEMUNBMkFFNTQzREYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMUQxMENBMjkyNDcxMUU4QkY2NkQxQ0EyQUU1NDNERiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowMUQxMENBMzkyNDcxMUU4QkY2NkQxQ0EyQUU1NDNERiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ph72yOoAAAaDSURBVHja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
// @downloadURL https://update.greasyfork.org/scripts/434025/%E4%B8%AD%E5%9B%BD%E5%A4%A9%E6%B0%94%E7%BD%91%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/434025/%E4%B8%AD%E5%9B%BD%E5%A4%A9%E6%B0%94%E7%BD%91%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==
// ██ 注意 注意 ██：在本脚本 设置>通用>运行时期 里选择 document-start 以获得无感知脚本加载体验
// ██ 注意 注意 ██：在本脚本 设置>通用>运行时期 里选择 document-start 以获得无感知脚本加载体验
(function() {
	// "体验新版"的白底图片
	const img1="url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADlQTFRF////19fX4eHh0dHRxcXF7e3t5eXl2dnZ+/v7ycnJ9PT01dXV+Pj4zc3N8PDw6enp3d3d8/PzAAAABm+mFwAAABN0Uk5T////////////////////////ALJ93AgAAAHFSURBVHja5JbZctswDEVpgFi4M/n/jy1AuXYzoifWpE8tHqyxfURegBeQwuftQnyG20d4Oz5u4RYuxL+N9/oCz9H/EVhfGADY6cgvcMDwBS9i11KS7vHG8RE5QABYSwDqDufkn6Wl4dca1XBOpm8++Sdek+OKsjQEamEypK4WcqzwBTeRrh8EmmdMGHCUQx5yPuFChmuqAuzJQsKEPWgeqnWn3XGZXplmi1UiQsI+rFyF9/hozTdPq6LaE8nUqMd5nPEe+1H3UqwcacZqayNx2YtZm65jKjxMd9SQMlPjV9qfp+pqDK+P37/BBaRMtGgJrUTfOdJMo53uoX/B76SX8CXbBJh3zfwZ5PA1zHg2AXtWlpRnN6EeONihiSWxcSQPImZFurfWwuWlGEZVO5E3cQAEROAH7uaBo7dwh6/wFCw4r/SguI3m3FbGmzMgkwjVOy5umDbOuJevAJjJ1215abDeKqGn8AZeGa1dcuy4dSRnk57dho6b4Qw3GZBwVxmvnFXHm81xboZ7H3HczhlZcwgKHLgpYBSppdTn3PhTO5HdQT6HHC9qG+DRSaOd54wNN0f4d0H/w4fND/FrD/lrrxC/BBgAoREPRdbVYgUAAAAASUVORK5CYII=) no-repeat";
	// 获取域名后的文本，a为获取的字母数
	function getCaption(obj,a){
		const index=obj.lastIndexOf(".cn/");
		return obj.substring(index+4,index+4+a);
	}
	// 旧版通用精简代码
	function old1(a){
		// 屏蔽顶部广告
		// 屏蔽中间广告
		// 网页右边栏
		// 网页顶部蓝色导航栏
		// 高清图集元素
		// 网页底部栏
		// 获取子项，精简新闻
		// 把内容1000px的长度改一下
		// 把最顶部的栏 的长度改一下
		// 更改顶部搜索栏的margin,不然挤不下
		// 把悬浮的按钮 往下面移一些
		const css1=`
			.topad_bg{display: none !important;}
			div.left-div > div:nth-child(1) > iframe{display: none !important;}
			.right.fr{display: none !important;}
			.weather_li{display: none !important;}
			.left-div.hd-img{display: none !important;}
			.block{display: none !important;}
			.greatEvent > ul > li:nth-child(n+6){display: none !important;}
			.con.today.clearfix{width:680px !important;}
			.weather_li_box{width:680px !important;}
			.search-box.fr{margin-left:16px !important;}
			.r-x-box{margin-top:450px !important;}
			.r-x1.r-x-5{display: none !important;}
		`
		GM_addStyle(css1);
		// GM_addStyle(`.greatEvent{display: none !important;} .tq_zx{display: none !important;}`);// 重大天气事件,天气资讯
		window.onload = function(){
			// 添加logo文字
			document.getElementsByClassName("w_li_logo fl")[0].children[1].children[0].innerHTML = '中国天气网';
			// 把"体验新版"的橙色图片改成白底的
			document.getElementsByClassName("r-x1 r-x-8")[0].style.background=img1;
		};
	}

	// 主线程开始：
	// 获取网址，获取网址域名后面的8，10，11个字母
	const str=window.location.href;
	const str8=getCaption(str,8);
	const str10=getCaption(str,10);
	const str11=getCaption(str,11);

	if(str8=="weather/"||str10=="weather1d/"||str11=="weather15d/"||str11=="weather40d/"){// 旧版网页
		old1(str11=="weather15d/");
	}else if(str11=="weather40dn"||str11=="weather15dn"||str10=="weather1dn"||str8=="weathern"){// 新版网页
		if(str10!="weather1dn"){
			// 网页右边栏 一天这个移除后，比较难看，所以做个判断
			GM_addStyle(`.fr.weather_right{display: none !important;}`);
		}
		// 网页顶部广告
		// 网页底部广告
		// 网页顶部蓝色导航栏
		// 天气资讯
		// 网页底部栏
		// 把悬浮的按钮 往下面移一些
		// 更改颜色
		const css2=`
			body > div > div:nth-child(1) > iframe:nth-child(1){display: none !important;}
			div.fl.weather_left > div > iframe{display: none !important;}
			.weather_li{display: none !important;}
			.newsMore.clearfix{display: none !important;}
			.block{display: none !important;}
			.r-x-box{margin-top:450px !important;}
			.weather_tab{background:#89c6f5 !important;}
		`
		GM_addStyle(css2);
		window.onload = function(){
			// 更改为logo文本
			document.getElementsByClassName("w_li_logo fl")[0].children[1].children[0].innerHTML = '中国天气网';
		};

		// 因为15、40天、1天7天有一些区别，做一下区分判断
		if(str11=="weather15dn"||str8=="weathern"){// 这里是15天和7天

			// 更改7天15天宽度
			// 更改最顶栏的宽度
			// 更改天气位置栏的宽度
			// 更改顶部搜索栏的margin,不然挤不下
			// .weather_tab{padding-left:60px !important;}
			const css3=`
				.L_weather{width: 680px !important;}
				.weather_li_box{width: 680px !important;}
				.weather_location{width: 680px !important;}
				.search-box.fr{margin-left:16px !important;}
			`
			GM_addStyle(css3);
		}else if(str11=="weather40dn"){
			// 网页底部广告
			GM_addStyle(`div.L_weather > div.fl.weather_left{display: none !important;}`);
		}else if(str10=="weather1dn"){// 这里是1天
			GM_addStyle(`#ab_zan{display: none !important;}`);
		}
	}
})();