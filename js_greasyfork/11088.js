// ==UserScript==
// @name           Flvcd Download Links for Jacob
// @name:en        Flvcd Download Links for Jacob
// @name:zh-CN     Flvcd Download Links 星月改进版
// @name:zh-TW     Flvcd Download Links 星月改進版

// @description       Download online video By flvcd.com
// @description:zh-CN 替换在线视频的下载链接为 flvcd.com 的解析链接
// @description:zh-TW 替換線上視頻的下載連結為 flvcd.com 的解析連結
// @description:en    Download online video By flvcd.com

// @author         Jacob Yang<snquentin>
// @namespace      http://firelove.sinaapp.com
// @version        0.0.1.20150803234200

// @include        http://v.youku.com/v_show/*.htm*
// @include        http://v.youku.com/v_playlist/*.htm*
// @include        http://www.tudou.com/playlist/*.htm*
// @include        http://www.tudou.com/albumplay/*.htm*
// @include        http://www.tudou.com/programs/view/*
// @include        http://tv.sohu.com/*.shtml
// @include        http://my.tv.sohu.com/*.shtml
// @downloadURL https://update.greasyfork.org/scripts/11088/Flvcd%20Download%20Links%20for%20Jacob.user.js
// @updateURL https://update.greasyfork.org/scripts/11088/Flvcd%20Download%20Links%20for%20Jacob.meta.js
// ==/UserScript==

function create_flvcd_url(format) {
    return 'http://www.flvcd.com/parse.php?kw=' + encodeURIComponent(document.URL) + '&flag=&format=' + format;
}

var title = '用 Flvcd 下载视频';
var sites = [
    {
        domain: 'youku.com',
        handler:function() {
			var fn_download_node = document.getElementById('fn_download');
			var source_link_node = fn_download_node.getElementsByTagName('a')[0];
            var new_link_node = source_link_node.cloneNode('include_all');
            new_link_node.href = create_flvcd_url('super');
            new_link_node.title = title;
            new_link_node.target = '_blank';
            source_link_node.parentNode.replaceChild(new_link_node, source_link_node);
        }
    },
    {
        domain: 'tudou.com',
        handler: function() {
            var fn_download_node = document.getElementById('downloadBtn');
			var source_link_node = fn_download_node.getElementsByTagName('a')[0];
            var new_link_node = source_link_node.cloneNode('include_all');
            new_link_node.href = create_flvcd_url('real');
            new_link_node.title = title;
            new_link_node.target = '_blank';
            source_link_node.parentNode.replaceChild(new_link_node, source_link_node);
        }
    },
    {
        domain: 'sohu.com',
        handler:function() {
            var source_link_node = document.getElementById('playtoolbar');
            var new_link_node = document.createElement('div');
            source_link_node.appendChild(new_link_node);
            new_link_node.innerHTML = '<a target="_blank" href="' + create_flvcd_url('real') + '" class="vbtn"><em>用 Flvcd 下载视频</em></a>';
            new_link_node.className = 'vBox vBox-xia';
        }
    }
];

function jacobfdl() {
	var url = document.URL;
	var i, site;
	for (i = 0; i < sites.length; i += 1) {
	    site = sites[i];
	    if (url.indexOf(site.domain) != -1) {
	        site.handler();
	        break;
	    }
	}
}
window.onload = jacobfdl;