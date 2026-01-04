// ==UserScript==
// @name         新版CSDN阅读体验提升
// @namespace    http://www.csdn.net/
// @version      0.0.5-20180201
// @description  自动阅读全文；布局位置格式优化；删除上方导航、左侧分享、右下侧广告、下侧内容推荐；保留作者、相关文章、评论 ；图片居中；删除空段落；去除首行缩进；支持MathJax；
// @author       limity
// @license      GPL version 3
// @match        http://blog.csdn.net/*/article/details/*
// @grant        none
// @run-at  document-end
// @downloadURL https://update.greasyfork.org/scripts/33973/%E6%96%B0%E7%89%88CSDN%E9%98%85%E8%AF%BB%E4%BD%93%E9%AA%8C%E6%8F%90%E5%8D%87.user.js
// @updateURL https://update.greasyfork.org/scripts/33973/%E6%96%B0%E7%89%88CSDN%E9%98%85%E8%AF%BB%E4%BD%93%E9%AA%8C%E6%8F%90%E5%8D%87.meta.js
// ==/UserScript==
(function() {
	'use strict';
	var jQuery = $ || window.$;

	var orig = $.fn.css;
	jQuery.fn.css = function() {
		var ev = new jQuery.Event('style');
		orig.apply(this, arguments);
		jQuery(this).trigger(ev);
	}

	try {
    
		jQuery('.article_content').on("style", function() {
			var _contentStyle = jQuery(".article_content").get(0).style;
			_contentStyle.overflow = "";
			_contentStyle.height = "";
			jQuery('.article_content').removeClass('article_Hide');
			jQuery('.readall_box').hide().addClass('readall_box_nobg');
		});
		jQuery("h1").css({
			"text-align": "center"
		});
		jQuery("body > .container").css({
			"width": "1300px",
			"padding": "20px 0 0"
		});
		jQuery(".container main").css({
			"width": "1024px",
			"padding": "0 0 0 20px"
		});
    
		jQuery(".container aside").css({
			"width": "250px"
		});
		jQuery(".article_content p").filter(function() {
			return jQuery(this).has("img,a").length === 0 && !jQuery.trim(jQuery(this).text());
		}).remove();
    jQuery(".article_content p").css({
			"margin": "1em 0",
			"line-height": "1.75em",
      "color":"#2F2F2F"
    });
		jQuery(".article_content,.article_content p,.article_content p span:not([class^=MathJax] span):not([class^=MathJax]):not([id^=MathJax] span):not([id^=MathJax])").css({
			"font-family": "Microsoft YaHei,Consolas",
			"font-size": "15px"
		});
    jQuery(".article_content p .MathJax").css({
			"font-size": "16px"
		});
		jQuery(".article_content p img").css({
			"display": "block",
			"margin": "0 auto"
		});
		jQuery("header,.left_fixed,.recommend_tit,.recommend_list,.fixRight").hide();

	} catch (e) {
		console.log(e);
	}
})();