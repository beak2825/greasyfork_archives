// ==UserScript==
// @name         什么值得买显示值率
// @namespace    https://greasyfork.org/zh-CN/scripts/376306
// @version      0.6
// @description  在什么值得买显示值率,并以颜色高亮区分高低。
// @author       AngryEagle
// @match        *://search.smzdm.com/*
// @match        *://www.smzdm.com/fenlei/*
// @match        *://www.smzdm.com/jingxuan/*
// @match        *://www.smzdm.com/tag/*
// @match        *://search.smzdm.com/?c=*&s=*
// @match        *://www.smzdm.com
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376306/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%E6%98%BE%E7%A4%BA%E5%80%BC%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/376306/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%E6%98%BE%E7%A4%BA%E5%80%BC%E7%8E%87.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Your code here...
    var $listItems = $('#feed-main-list .feed-row-wide');
    var $followItems = $('.leftWrap .list');

    $.each($listItems, function (i, item) {
        var zhi = $(item).find('[data-zhi-type="1"]').text();
        var buzhi = $(item).find('[data-zhi-type="-1"]').text() || 0;
        var result = 0;
        if (parseInt(buzhi) === 0) {
			if (parseInt(zhi) ===0) result = 'N/A';
			else result = 1;
        } else {
            result = parseInt(zhi) / (parseInt(zhi) + parseInt(buzhi));
        }
        if (isNaN(result)) $(item).find('.feed-btn-group').prepend(`<span class="95" style="color:#8b8b8b; margin-right:10px; font-size:14px">值率:${result}</span>`);
        else {
            var percent = parseFloat(result*100).toFixed(0);
            if (percent > 59){
                if (percent > 69){
                    if (percent > 79){
                        if (percent > 89){
                            if (percent > 95){
                                $(item).find('.feed-btn-group').prepend(`<span class="95" style="color:#ff00dd; margin-right:10px; font-size:14px">值率:${percent}%</span>`);
                            } else {$(item).find('.feed-btn-group').prepend(`<span class="90" style="color:#ff0000; margin-right:10px; font-size:14px">值率:${percent}%</span>`); };
                        } else {$(item).find('.feed-btn-group').prepend(`<span class="80" style="color:#ff7000; margin-right:10px; font-size:14px">值率:${percent}%</span>`);};
                    } else {$(item).find('.feed-btn-group').prepend(`<span class="70" style="color:#0cb00c; margin-right:10px; font-size:14px">值率:${percent}%</span>`);};
                } else {$(item).find('.feed-btn-group').prepend(`<span class="60" style="color:#00d5e2; margin-right:10px; font-size:14px">值率:${percent}%</span>`);};
            } else {$(item).find('.feed-btn-group').prepend(`<span class="60-" style="color:#8b8b8b; margin-right:10px; font-size:14px">值率:${percent}%</span>`);};
        }
    });

     $.each($followItems, function (i, item) {
        var num = $(item).find('em');
        var zhi = $(num[0]).text();
        var buzhi = $(num[1]).text() || 0;
        var result = 0;
        if (parseInt(buzhi) === 0) {
            if (parseInt(zhi) !== 0) result = 1;
        } else {
            result = parseInt(zhi) / (parseInt(zhi) + parseInt(buzhi));
        }
        $(item).find('.zhilevel').css({"padding":"0 6px",
                                       "border":"1px solid #ccc",
                                       "line-height":"28px",
                                       "position":"relative",
                                       "min-width":"44px",
                                       "text-align":"center"});

        var percent = parseFloat(result*100).toFixed(0);
		if (percent > 59){
			if (percent > 69){
				if (percent > 79){
					if (percent > 89){
						if (percent > 95){
							$(item).find('.lrBot').prepend(`<span class="zhilevel" style="color:#ff00dd; margin-right:10px; font-size:12px; float:left;padding-top: 5px;">值率:${percent}%</span>`);
						} else {$(item).find('.lrBot').prepend(`<span class="zhilevel" style="color:#ff0000; margin-right:10px; font-size:12px; float:left;padding-top: 5px;">值率:${percent}%</span>`); };
					} else {$(item).find('.lrBot').prepend(`<span class="zhilevel" style="color:#ff7000; margin-right:10px; font-size:12px; float:left;padding-top: 5px;">值率:${percent}%</span>`);};
				} else {$(item).find('.lrBot').prepend(`<span class="zhilevel" style="color:#0cb00c; margin-right:10px; font-size:12px; float:left;padding-top: 5px;">值率:${percent}%</span>`);};
			} else {$(item).find('.lrBot').prepend(`<span class="zhilevel" style="color:#00d5e2; margin-right:10px; font-size:12px; float:left;padding-top: 5px;">值率:${percent}%</span>`);};
		} else {$(item).find('.lrBot').prepend(`<span class="zhilevel" style="color:#8b8b8b; margin-right:10px; font-size:12px; float:left;padding-top: 5px;">值率:${percent}%</span>`);};
        $(item).find('.zhilevel').css({"padding":"0 6px","border":"1px solid #ccc", "line-height":"28px", "position":"relative", "min-width":"44px", "text-align":"center"});
     });
})();