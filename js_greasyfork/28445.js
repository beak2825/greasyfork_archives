// ==UserScript==
// @name       百合居图片预览
// @namespace  https://greasyfork.org/zh-CN/users/6065-hatn
// @version    0.1.6
// @description  首页图片点击直接预览/取消图片惰性加载
// @icon           http://www.gravatar.com/avatar/10670da5cbd7779dcb70c28594abbe56?r=PG&s=92&default=identicon
// @include		*//yuriimg.com*
// @require0		http://cdn.staticfile.org/jquery/2.1.1-rc2/jquery.min.js
// @copyright	2017, hatn
// @author		hatn
// @run-at     	document-end
// @grant0       GM_xmlhttpRequest
// @grant0       GM_getValue
// @grant0       GM_setValue
// @grant0       GM_deleteValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/28445/%E7%99%BE%E5%90%88%E5%B1%85%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/28445/%E7%99%BE%E5%90%88%E5%B1%85%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

/**
* 百合居图片预览
* 功能：首页图片点击直接预览/取消图片惰性加载
*/

/* #########  参数设置 S ######### */

var config = {
	unlazy_status: 1, // 取消图片惰性加载
};
/* ##########  参数设置 E ########## */

var yuriimgObj = {
	/* 数据集 */
    DATA: {
		config: {},
		defaultConfig: {
			unlazy_status: 1
		},
		lazySelector: 'img.lazy[data-original]'
	},
	init: function() {
		var s = this;
		s.band();
		s.unLazy();
		console.log('log: yuriimg JS Run...');
	},
	setConfig: function(config) {
		var s = this;
		if (typeof config != 'obnject') {
			s.DATA.config = s.DATA.defaultConfig;
			return false;
		}
		$.extend(s.DATA.config, s.DATA.defaultConfig, config);
	},
	launcher: function(config) {
		var s = this;
		s.setConfig();
		s.init();
	},
	// 取消图片惰性加载
	unLazy: function() {
		var s = this, $s;
		//if (s.DATA.config.unlazy_status != 1) return false;
		var $lazys = $(s.DATA.lazySelector);
		var total = $lazys.size();
		if (total < 1) {
			console.log('log: no photo .');
			return false;
		}
		$lazys.each(function() {
			$s = $(this);
			//if ($s.attr('style') != null) return true;
			//$s.removeAttr('data-original');
			getTrueImg($s[0].id, $s.data('href'));
            $s.attr('data-href', '');
		});
		console.log('log: deal ' + total + ' photos .');

		function getTrueImg(id, url) {
			$.get(url, function(data) {
				var img_src = $('.img-control>a', data).attr('href');
				var $s = $('#' + id);
				if (s.DATA.config.unlazy_status == 1) $s.attr('data-original', 'url("' + img_src + '")').attr('data-original', img_src);
				$s.attr('data-src', img_src);
			});
		}
	},
	// 事件绑定
	band: function() {
        // 方案一：
        unsafeWindow.cntrlIsPressed = true; // 开启源站的点击预览，按住ctrl点击图片时不跳转
        $(unsafeWindow.document).keyup(function() {
            cntrlIsPressed = true;
        });
        return;

        // 方案二：
		var s = this;
		s.addHTML();
		$(document).on('click', '#preview-box, ' + s.DATA.lazySelector, function(event) {
			event.preventDefault();
			var id = this.id;
			if (id == 'preview-box') {
				$('body').removeClass('_h');
				$(this).addClass('hidden');
			} else {
				var $a = $(this), $img = $('#preview-img');
				$img.attr('src', $a.attr('data-src')).attr('alt', $a.attr('alt'));
				$('body').addClass('_h');
				$('#preview-box').removeClass('hidden');
			}
		});
	},
	// 插入预览box
	addHTML: function() {
		var max_width = $(document).width();
		var html = '\
		<div id="preview-box" class="_illust_modal hidden" style="background-color: rgb(61,46,40);">\
			<nav class="page-menu">\
				<div class="page-button switch toggle-image-mode" data-tools="tooltip" title="放大图片">\
					<i class="_icon-12 size-2x _icon-exit-full-size"></i>\
					<i class="_icon-12 size-2x _icon-full-size"></i>\
				</div>\
				<div class="page-button switch" data-tools="tooltip" title="关闭预览">\
					<i class="_icon-12 size-2x _icon-close"></i>\
				</div>\
			</nav>\
			<img style="max-width: ' + max_width + 'px;" id="preview-img" alt="" class="original-image" data-src="" src="" >\
		</div>';
		$('body').append($(html));
	}
};

yuriimgObj.launcher(config);