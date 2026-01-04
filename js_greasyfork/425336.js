// ==UserScript==
// @name              视频下载
// @version           0.0.3
// @author            hx
// @require           https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @match             *://v.qq.com/x/cover/*
// @match             *://m.v.qq.com/x/cover/*
// @match             *://v.qq.com/x/page/*
// @match             *://m.v.qq.com/x/page/*
// @match             *://m.v.qq.com/*
// @match             *://www.iqiyi.com/v*
// @match             *://m.iqiyi.com/*
// @match             *://www.iqiyi.com/*
// @match             *://m.iqiyi.com/kszt/*
// @match             *://www.iqiyi.com/kszt/*
// @match             *://v.youku.com/v_show/*
// @match             *://m.youku.com/alipay_video/*
// @match             *://w.mgtv.com/b/*
// @match             *://m.mgtv.com/b/*
// @match             *://www.mgtv.com/b/*
// @match             *://tv.sohu.com/v/*
// @match             *://m.tv.sohu.com/v/*
// @match             *://film.sohu.com/album/*
// @match             *://m.film.sohu.com/album/*
// @match             *://www.le.com/ptv/vplay/*
// @match             *://m.le.com/ptv/vplay/*
// @match             *://v.pptv.com/show/*
// @match             *://m.pptv.com/show/*
// @match             *://vip.pptv.com/show/*
// @match             *://www.acfun.cn/v/*
// @match             *://m.acfun.cn/v/*
// @match             *://www.bilibili.com/video/*
// @match             *://m.bilibili.com/video/*
// @match             *://www.bilibili.com/anime/*
// @match             *://m.bilibili.com/anime/*
// @match             *://www.bilibili.com/bangumi/play/*
// @match             *://m.bilibili.com/bangumi/play/*
// @match             *://vip.1905.com/play/*
// @match             *://www.youtube.com/watch*
// @match             *://www.facebook.com/*
// @license           GPL License
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @charset		      UTF-8
// @namespace https://greasyfork.org/users/762977
// @description 自己用打开链接
// @downloadURL https://update.greasyfork.org/scripts/425336/%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/425336/%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var $ = $ || window.$;
	var player_nodes = [
		{ url:"v.qq.com", node:"#mod_player", param: ''},
		{ url:"www.iqiyi.com", node:"#flashbox", isTV: function() {
            return '电视剧' == document.querySelector('.channel-name').innerText;
        }},
		{ url:"v.youku.com", node:"#player", param: ' -ccode=0532 ', isTV: function() {
            return '电视剧' == document.querySelector('[name="irCategory"]').getAttribute('content');
        }},
		{ url:"w.mgtv.com", node:"#mgtv-player-wrap"},
		{ url:"www.mgtv.com", node:"#mgtv-player-wrap"},
		{ url:"tv.sohu.com", node:"#player"},
		{ url:"film.sohu.com", node:"#playerWrap"},
		{ url:"www.le.com", node:"#le_playbox"},
		{ url:"video.tudou.com", node:".td-playbox"},
		{ url:"v.pptv.com", node:"#pptv_playpage_box"},
		{ url:"vip.pptv.com", node:".w-video"},
		{ url:"www.wasu.cn", node:"#flashContent"},
		{ url:"www.acfun.cn", node:"#player"},
		{ url:"www.bilibili.com", node:"#player_module"},
		{ url:"vip.1905.com", node:"#player"},
	];

    //从github上获取最新地址
    function init(){
        let node = '';
        for(var i in player_nodes) {
            if (player_nodes[i].url == window.location.host) {
                node = player_nodes[i];
                break;
            }
        }
        (new fun(node)).start();
    }
    init();

	//具体的操作对象
	function fun(node){
		this.node = node;
		this.GMgetValue = function (name, value) {
			if (typeof GM_getValue === "function") {
				return GM_getValue(name, value);
			} else {
				return GM.getValue(name, value);
			}
		};
		this.GMaddStyle = function(css){
			var myStyle = document.createElement('style');
			myStyle.textContent = css;
			var doc = document.head || document.documentElement;
			doc.appendChild(myStyle);
		};
		this.addScript = function(url){
			var s = document.createElement('script');
			s.setAttribute('src',url);
			document.body.appendChild(s);
		};
		this.addCssHtml = function(){
			var left = 0;
			var top = 100;
			var Position = this.GMgetValue("Position_" + window.location.host);
			if(!!Position){
				left = Position.left;
				top = Position.top;
			}
			this.GMaddStyle(`#myDown {cursor:pointer; position:fixed; top:` + top + `px; left:` + left + `px; width:0px; z-index:2147483647; font-size:16px; text-align:left;}
				#myDown .myText {width:70px; height:35px;line-height:35px;text-align:center;background-color:#E5212E;border-radius:9%;color: #efffff;}`);
            var html = $(
                '<div id="myDown">'
                + '    <div class="myText">'
                + '        下载'
                + '    </div>'
                + '</div>'
            );
            $("body").append(html);
        };
		this.bindEvent = function(){
			$(".myText").on("click", function() {
                downVideo(location.href.replace(/\?.*/g, ''));
            });
            function downVideo(url) {
                if (null == url || '' == url) {
                    alert('链接丢失');
                }
                // let script = 'openTest:-i "' + url + '"';
                if (null == node['isTV']) {
                    node['isTV'] = function() {
                        return false;
                    }
                }
                if (null == node['param']) {
                    node.param = "";
                }
                // let script = 'openTest:' + node['isTV']() + ': ' + url + '';
                let script = 'openAnnie:' + url + '#' + node['isTV']() + '#' + node.param + '-c ' + node.url + '.txt';
                script = encodeURI(script);
                script = script.replace(/%/g, '###');
                location.href = script;
                console.log(location.href + "-");
                let timeout = setTimeout(function () {
                    alert("未注册, 请先添加注册表");
                }, 1000)
                window.addEventListener('blur', function() { clearTimeout(timeout); })
            }
        }
        this.start = function(){
            this.addCssHtml();
            this.bindEvent();
        }
    };
})();