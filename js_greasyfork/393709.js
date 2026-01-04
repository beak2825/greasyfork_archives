// ==UserScript==
// @name         蜜柑计划/Mikan Project/mikanani.me 订阅列表
// @namespace    mikanani.me
// @homepage     https://gist.github.com/MakeHui/120ba3aabe846b0af54a538f45d5ed80
// @version      1.0.2
// @description  https://mikanani.me 进入 MyBangumi 显示完整订阅列表, 不需要再麻烦的去点击番组
// @author       MakeHui
// @match        https://mikanani.me/Home/MyBangumi*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/393709/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92Mikan%20Projectmikananime%20%E8%AE%A2%E9%98%85%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/393709/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92Mikan%20Projectmikananime%20%E8%AE%A2%E9%98%85%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==


;(function() {
    'use strict';

	var MeMikanani = function() {
		this.bangumiDoms = $('ul.dropdown-menu ul.dropdown-menu a');
		this.index = 0;

		this.header = function(r, u) {
			var header = '<div id="' + r + u + '" class="row an-res-row-frame" style="height: 20px;font-size: 28px;line-height: 30px;">';
				header += r + '  ' + u + '季度番组</div>';
			return header;
		}

		this.UpdateBangumiCoverFlow = function () {
			var d = $(this.bangumiDoms[this.index]);
			var r = d.data("year");
			var u = d.data("season");

			$.ajax({
				type: "POST",
				url: "/Home/BangumiCoverFlow",
				data: JSON.stringify({year: r, seasonStr: u}),
				contentType: "application/json; charset=utf-8",
				success: function(n) {
					var d = $('<div>' + n + '</div>');
					if (d.find('.no-subscribe-bangumi').length > 0) {
						return;
					}

					if ($('.sk-bangumi .no-subscribe-bangumi').length > 0) {
						$(this.header(r, u)).insertBefore(d.find('.sk-bangumi > *').eq(0));
						$('#sk-body').html(d.html());
						return;
					}

					var html = this.header(r, u) + d.find('.sk-bangumi').html();
					$('#sk-body .sk-bangumi').append(html);
				}.bind(this),
				complete: function(xhr, textString) {
					if (this.bangumiDoms.length === this.index + 1) {
						InitExpandBangumi();
						InitToggleButton();
						InitSubscribeBangumi();
						scrollBangumi();
                		new Blazy();
					}
					else {
						this.index += 1;
						this.UpdateBangumiCoverFlow();
					}
				}.bind(this)
			});
		}

		this.run = function() {
			if (this.bangumiDoms.length > 0) {
				$(".sk-col.date-text").html('全部 订阅番剧 <span class="caret"><\/span>');
				this.index = 0;
				this.UpdateBangumiCoverFlow();
			}
			else {
				$(".sk-col.date-text").html('没有 番组列表 <span class="caret"><\/span>');
			}
		}
	}

	UpdateBangumiCoverFlow = function(n) {
		var r = $(n).data("year"),
	        u = $(n).data("season");
		window.location.href = '#' + r + u;
        $(".sk-col.date-text").html(r + " " + u + '季番组 <span class="caret"><\/span>');
	}

	var meMikanani = new MeMikanani();
	meMikanani.run();

})();