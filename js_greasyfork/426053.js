// ==UserScript==
// @name              常工具收藏夹
// @version           1.0
// @description       各种常用工具，可当书签收藏，随时唤出，使用方便
// @author            小艾特
// @require           https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @include           *://*/*
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

// @namespace https://greasyfork.org/users/466206
// @downloadURL https://update.greasyfork.org/scripts/426053/%E5%B8%B8%E5%B7%A5%E5%85%B7%E6%94%B6%E8%97%8F%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/426053/%E5%B8%B8%E5%B7%A5%E5%85%B7%E6%94%B6%E8%97%8F%E5%A4%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $ = $ || window.$;
    var host = location.host;
    function GMgetValue(name, value) {
        if (typeof GM_getValue === "function") {
            return GM_getValue(name, value);
        } else {
            return GM.getValue(name, value);
        }
    }

    function GMsetValue(name, value) {
        if (typeof GM_setValue === "function") {
            GM_setValue(name, value);
        } else {
            GM.setValue(name, value);
        }
    }
    function GMaddStyle(css) {
        var myStyle = document.createElement('style');
        myStyle.textContent = css;
        var doc = document.head || document.documentElement;
        doc.appendChild(myStyle);
    }

    var ImgBase64 =`
       data:image/png;base64,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`;

    //图片按钮定位
    var left = 0;
    var top = 0;
    var Position = GMgetValue("Position_" + host);
    if(!!Position){
        left = Position.left;
        top = Position.top;
    }
    GMaddStyle(`#vip_movie_box {cursor:pointer; position:fixed; top:` + top + `px; left:` + left + `px; width:29px; background-color:#FF0040; z-index:2147483647; }
		        #vip_movie_box .item_text {width:28px; padding:4px 0px; text-align:center;}
		        #vip_movie_box .item_text img {width:22px; height:22px; display:inline-block; vertical-align:middle;}
                #vip_movie_box .vip_mod_box_action {display:none; position:absolute; left:28px; top:0; text-align:center;}
                <style type="text/css">body {margin: 0;padding: 0;background: #000;font-size: 12px;font-family: Tahoma, Geneva, Verdana, sans-serif; }ul{list-style: none; }a {text-decoration: none;}.content div{width: 1000px;margin: 0px auto 0px;}.content ul li {height: 60px;width: 120px;float: left;margin: 4px 2px;text-align: center;line-height: 60px;background: #d6d6d6;border-radius: 2px; border: 1px dotted red;} .content #unzip ul li { background: #8a2be2; }.content #input ul li {background: #2be2d1;}.content #funny ul li {background: #e2772b73;}.content #browser ul li {background: #2be252;}.content #office ul li {background:  #e2dc2b;}.content #other ul li {background: #ef371a;}.content ul li:hover {filter: alpha(opacity=50);-moz-opacity: 0.5;opacity: 0.50;cursor: pointer; -o-transform: rotateZ(-10deg);-moz-transform: rotateZ(-10deg);-webkit-transform: rotateZ(-10deg);transform: rotateZ(-10deg);}.content ul li .description {display: none; }</style>`);
    var html = $(`<div id='vip_movie_box'>
                    <div class='item_text'>
                       <img src='`+ ImgBase64 +`' title='工具收藏夹'/>
                       <div class='vip_mod_box_action' >
                       <div style='width:885px; padding:1px 0;'>
                       <div class="container">
                       <div class="content">
                       <div id="unzip">
                  <ul>
                    <li><a href="https://www.rarlab.com/" target="_blank">WinRAR</a></li>
                    <li><a href="http://haozip.2345.cc/" target="_blank">2345好压</a></li>
                    <li><a href="https://www.7-zip.org/" target="_blank">7zip</a></li>
					<li><a href="" target="_blank"></a></li>
                    <li><a href="" target="_blank"></a></li>
					<li><a href="" target="_blank"></a></li>
                    <li><a href="" target="_blank"></a></li>
                </ul>
            </div><!-- ./unzip -->
            <div id="input">
                <ul>
                    <li><a href="https://pinyin.sogou.com/" target="_blank">搜狗拼音输入法</a></li>
                    <li><a href="http://wubi.sogou.com/" target="_blank">搜狗五笔输入法</a></li>
                    <li><a href="http://pinyin.2345.cc/" target="_blank">2345王牌输入法</a></li>
                    <li><a href="http://qq.pinyin.cn/" target="_blank">QQ拼音输入法</a></li>
                    <li><a href="http://qq.pinyin.cn/index_wubi.php" target="_blank">QQ五笔输入法</a></li>
					<li><a href="" target="_blank"></a></li>
                    <li><a href="" target="_blank"></a></li>
                </ul>
            </div><!-- .input -->
			<div id="funny">
                <ul>
                    <li><a href="https://y.qq.com/" target="_blank">QQ音乐</a></li>
                    <li><a href="http://download.kugou.com/" target="_blank">酷狗音乐</a></li>
                    <li><a href="https://music.163.com/#/download" target="_blank">网易云音乐</a></li>
                    <li><a href="http://music.taihe.com/download/" target="_blank">千千音乐</a></li>
					<li><a href="" target="_blank"></a></li>
                    <li><a href="" target="_blank"></a></li>
					<li><a href="" target="_blank"></a></li>
                </ul>
            </div><!-- ./funny -->
            <div id="browser">
                <ul>
                    <li><a href="http://www.chromedownloads.net/" target="_blank">chrome浏览器</a></li>
                    <li><a href="https://www.mozilla.org/zh-CN/firefox/new/?utm_campaign=non-fx-button&utm_content=header-download-button&utm_medium=referral&utm_source=addons.mozilla.org" target="_blank">Firefox</a></li>
					<li><a href="https://browser.360.cn/" target="_blank">360安全浏览器</a></li>
                    <li><a href="https://browser.qq.com/" target="_blank">QQ浏览器</a></li>
					<li><a href="https://browser.360.cn/ee/" target="_blank">360极速浏览器</a></li>
                    <li><a href="https://ie.sogou.com/" target="_blank">搜狗浏览器</a></li>
					<li><a href="" target="_blank"></a></li>
                </ul>
            </div><!-- ./browser -->
            <div id="office">
                <ul class="item">
                    <li><a href="https://work.weixin.qq.com/" target="_blank">企业微信</a></li>
                    <li><a href="https://weixin.qq.com/cgi-bin/readtemplate?uin=&stype=&promote=&fr=&lang=zh_CN&ADTAG=&check=false&nav=download&t=weixin_download_list&loc=readtemplate,weixin,body,6" target="_blank">微信</a></li>
                    <li><a href="https://office.qq.com/download.html" target="_blank">TIM</a></li>
                    <li><a href="http://www.wps.cn/" target="_blank">WPS Office</a></li>
                    <li><a href="https://tms.dingtalk.com/markets/dingtalk/download" target="_blank">钉钉</a></li>
                    <li><a href="https://www.teamviewer.com/cn/" target="_blank">TeamViewer</a></li>
                    <li><a href="http://mail.163.com/dashi/" target="_blank">网易邮箱大师</a></li>
                    <li><a href="https://yun.baidu.com/" target="_blank">百度网盘</a></li>
                    <li><a href="http://cidian.youdao.com/" target="_blank">有道词典</a></li>
                    <li><a href="https://im.qq.com/download/" target="_blank">腾讯QQ</a></li>
					<li><a href="https://www.jianguoyun.com/s/downloads" target="_blank">坚果云</a></li>
                    <li><a href="https://cts.alibaba.com/product/qianniu.htm" target="_blank">千牛</a></li>
					<li><a href="http://wangwang.taobao.com/" target="_blank">阿里旺旺</a></li>
                    <li><a href="https://guanjia.qq.com/" target="_blank">腾讯电脑管家</a></li>
                    <li><a href="https://www.360.cn/" target="_blank">360官网</a></li>
                    <li><a href="" target="_blank"></a></li>
                    <li><a href="" target="_blank"></a></li>
                    <li><a href="" target="_blank"></a></li>
					<li><a href="" target="_blank"></a></li>
                    <li><a href="" target="_blank"></a></li>
					<li><a href="" target="_blank"></a></li>
                </ul>
            </div><!-- ./office -->
			<div id="other">
                <ul>
                    <li><a href="https://notepad-plus-plus.org/" target="_blank">notepad++</a></li>
                    <li><a href="" target="_blank"></a></li>
                    <li><a href="" target="_blank"></a></li>
                    <li><a href="" target="_blank"></a></li>
                    <li><a href="" target="_blank"></a></li>
					<li><a href="" target="_blank"></a></li>
                    <li><a href="" target="_blank"></a></li>
                </ul>
            </div><!-- .other -->
        </div>
    </div>
    </div>
    </div>
    </div>
    </div>`);

    $("body").append(html);
    $(".item_text").on("mouseover", () => {
        $(".vip_mod_box_action").show();
    });
    $(".item_text").on("mouseout", () => {
        $(".vip_mod_box_action").hide();
    });
    var movie_box = $("#vip_movie_box");
    movie_box.mousedown(function(e) {

        if (e.which == 3) {
            e.preventDefault() // 阻止默认行为
            movie_box.css("cursor", "move");//设置样式
            var positionDiv = $(this).offset();
            var distenceX = e.pageX - positionDiv.left;
            var distenceY = e.pageY - positionDiv.top;

            $(document).mousemove(function(e) {
                var x = e.pageX - distenceX;
                var y = e.pageY - distenceY;
                if (x < 0) {
                    x = 0;
                } else if (x > $(document).width() - movie_box.outerWidth(true)) {
                    x = $(document).width() - movie_box.outerWidth(true);
                }
                if (y < 0) {
                    y = 0;
                } else if (y > $(document).height() - movie_box.outerHeight(true)) {
                    y = $(document).height() - movie_box.outerHeight(true);
                }

                movie_box.css("left", x);
                movie_box.css("top", y);
                GMsetValue("Position_" + host,{ "left":x, "top":y});
            });
            $(document).mouseup(function() {
                $(document).off('mousemove');
                movie_box.css("cursor", "pointer");
            });
            $(document).contextmenu(function(e) {
                e.preventDefault();
            })
        }
    });

})();
