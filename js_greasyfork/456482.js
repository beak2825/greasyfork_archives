// ==UserScript==
// @name         解除小草检测去广告插件及贴子净化
// @description  解除小草对去广告插件的检测，净化小草贴子内容。请配合各类去广告插件一起使用，如ABP。
// @version      0.5
// @author       StartMenu
// @run-at       document-start
// @match        https://t66y.com/htm_data/2212/2/5428451.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=t66y.com
// @match       *://*.t66y.com/*
// @match       *://cl.*/*
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @grant        none
// @namespace https://greasyfork.org/users/84164
// @downloadURL https://update.greasyfork.org/scripts/456482/%E8%A7%A3%E9%99%A4%E5%B0%8F%E8%8D%89%E6%A3%80%E6%B5%8B%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%8F%92%E4%BB%B6%E5%8F%8A%E8%B4%B4%E5%AD%90%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/456482/%E8%A7%A3%E9%99%A4%E5%B0%8F%E8%8D%89%E6%A3%80%E6%B5%8B%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%8F%92%E4%BB%B6%E5%8F%8A%E8%B4%B4%E5%AD%90%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    $('#header').append('<div class="tpc_content" style="display:none;height: 2px;overflow:hidden;"></div>');

    //页面加载完成执行
    document.addEventListener ("DOMContentLoaded", doit);

	function doit(){
		    $(".tpc_content iframe,.tips,iframe,#player-advertising").height(2).remove();

			var _keywords = ["【影片名稱】","【影片名称】","【影片名称代号】", "種子連結", "商品名称：","商品発売日：","収録時間：","出演：","品番：","年齢：","名称：","[FHD/","[HD/","MP4"];
			var _keywords_in = false;

			var ttt_html = $(".tpc_content").eq(1).html();
			$.each(_keywords,function(i, _n) {
				var ttt = ttt_html.split(_n);
				if (typeof(ttt[1]) != "undefined" && !_keywords_in) {
					_keywords_in = true;
					ttt[0] = "";
					$(".tpc_content").eq(1).html(ttt.join(_n).replace(/(<br\s?\/?>)+/gi, '$1').replace(/(<br\s?\/?>\s?&nbsp;)+/gi, '$1'));
				}
			});
			$(".tpc_content:eq(1) a").each(function(i) {
				if ($(this).text().indexOf("以下內容被隱藏") != -1) {
					$(this).remove();
				}
				if ($(this).text().indexOf("點擊這里打開新視窗") != -1) {
					$(this).remove();
				}
			});
            torlink();
	}

    //链接处理
    function torlink(){
        //中转链接
        $("a[href*=\'redircdn\']").each(function() {
            //console.log($(this).attr('href'));
            let sourcelink = $(this).attr('href').replace(/https?:\/\/.*?redircdn\.com\/\?(.*?)\&z/gi, '$1').replace(/______/gi, '.');
            $(this).attr('href',sourcelink);
            //console.log(sourcelink);
        });
        //磁力链
        $("a[href*=\'?hash\=\']").each(function() {
            let torrent = $(this).attr('href');
            let hash = torrent.split('hash=')[1].substring(3);
            let magnet = 'magnet:?xt=urn:btih:' + hash;
            let tmpNode = '<p><a target="_blank" href="' + magnet + '">磁力链:　' + magnet + '</a></p>';
            $(this).after(tmpNode);
        });
        //图片跳转连接
        $('img[ess-data]').each(function(){
            $(this).unbind("click").click(function(){
                window.open($(this).attr('ess-data'));
                return false;
            });
        });

    }
})();