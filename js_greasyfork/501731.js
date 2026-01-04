// ==UserScript==
// @name        虎扑移除gif表情
// @namespace   Violentmonkey Scripts
// @match       https://bbs.hupu.com/*
// @grant       none
// @version     1.1
// @author      test11
// @description 虎扑移除gif表情1
// @require     https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @license     Apache Licence 2.0
// @downloadURL https://update.greasyfork.org/scripts/501731/%E8%99%8E%E6%89%91%E7%A7%BB%E9%99%A4gif%E8%A1%A8%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/501731/%E8%99%8E%E6%89%91%E7%A7%BB%E9%99%A4gif%E8%A1%A8%E6%83%85.meta.js
// ==/UserScript==


(function() {
	'use strict';

	gifRemove()
	window.addEventListener('scroll', () => {
		gifRemove()
	})

	window.addEventListener('load', () => {
		gifRemove()
	})

  var contentImgSize = 200; //内容区域图片大小
  var ImgSize = 50; //评论区域图片大小

	function gifRemove() {
    $('.thread-content-detail').find('img').each(function(i, v) {
      if ($(v).width() > contentImgSize) {
        $(v).css({'width': contentImgSize});
      }
    })

		$('img').each(function() {
				var src = $(this).attr('src');
				if (src.indexOf('.gif') != -1) {
					$(this).remove();
				}
			});

		$('.wrapper-container').find('img').each(function(i, v) {
        if ($(v).width() > ImgSize) {
          $(v).css({'width': ImgSize});
        }
			});

		$('.bbs-thread-comp.quote-thread').each(function(index, div) {
				var $div = $(div);
				$div.parents('.post-reply-list').hide();
			});
	}


})();