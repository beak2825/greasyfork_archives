// ==UserScript==
// @name         废人岛Vip视频解析-一键VIP视频解析、去广告（全网）
// @namespace    http://www.9frd.com/
// @version      1.0.0
// @description  支持优酷vip，腾讯vip，爱奇艺vip，芒果vip，乐视vip等视频网站
// @author       Wandhi
// @icon         https://www.wandhi.com/favicon.ico
// @match        *://m.youku.com/v*
// @match        *://m.youku.com/a*
// @match        *://v.youku.com/v_show/*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/w_*
// @match        *://*.iqiyi.com/a_*
// @match        *://*.iqiyi.com/adv*
// @match        *://*.iqiyi.com/dianying/*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://v.qq.com/x/cover/*
// @match        *://v.qq.com/x/page/*
// @match        *://v.qq.com/play*
// @match        *://*.tudou.com/listplay/*
// @match        *://*.tudou.com/albumplay/*
// @match        *://*.tudou.com/programs/view/*
// @match        *://*.mgtv.com/b/*
// @match        *://film.sohu.com/album/*
// @match        *://tv.sohu.com/v/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.pptv.com/show/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.wasu.cn/Play/show/*
// @match        *://music.taihe.com/song*
// @match        *://item.taobao.com/*
// @match        *://detail.tmall.com/*
// @match        *://item.jd.com/*
// @match        *://music.163.com/song*
// @match        *://music.163.com/m/song*
// @match        *://y.qq.com/*
// @match        *://www.kugou.com/*
// @match        *://www.kuwo.cn/*
// @match        *://www.xiami.com/*
// @match        *://music.baidu.com/*
// @match        *://www.qingting.fm/*
// @match        *://www.lizhi.fm/*
// @match        *://music.migu.cn/*
// @match        *://www.shangxueba.com/ask/*.html
// @match        *://www.ximalaya.com/*
// @match        *://www.shangxueba.com/ask/*.html
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://greasyfork.org/scripts/373336-layer-wandhi/code/layer_wandhi.js?version=637587
// @grant        GM_setClipboard
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/384143/%E5%BA%9F%E4%BA%BA%E5%B2%9BVip%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90-%E4%B8%80%E9%94%AEVIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E3%80%81%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%88%E5%85%A8%E7%BD%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/384143/%E5%BA%9F%E4%BA%BA%E5%B2%9BVip%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90-%E4%B8%80%E9%94%AEVIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E3%80%81%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%88%E5%85%A8%E7%BD%91%EF%BC%89.meta.js
// ==/UserScript==

(function() {

    $("body").append($('<link rel="stylesheet" href="https://tv.9frd.com/tv/Frd-tv-css.css">'));





    var htm=$(' <div id="frd-tv-2" class="frd-tv-box-yin frd-tv-yin ">        <img src="http://tv.9frd.com/tv/33.png" />    </div>    <div id="frd-tv" class="frd-tv-box frd-tv-tou">        <div class="frd-tv-box-body">            <div>                <img src="http://tv.9frd.com/tv/22.png" width="100%" />            </div>            <div class="frd-tv-box-body-d">                <div id="frd-jiexi">                    <img src="http://tv.9frd.com/tv/播放.png" width="70%" style="margin:0 auto;"/>                    <a href="http://tv.9frd.com/">解析</a>                </div>                <div id="frd-gangwang">                    <img src="http://tv.9frd.com/tv/官网.png" width="70%" style="margin:0 auto;"/>                    <a href="http://www.9frd.com/">官网</a>                </div>                <div id="frd-yinchang">                    <img src="http://tv.9frd.com/tv/隐藏.png" width="70%"  style="margin:0 auto;"/>                    <a href="#">隐藏</a>                </div>            </div>        </div>    </div>');
    $("body").append(htm);

    $("#frd-tv").mouseout(function () {

        $("#frd-tv").addClass("frd-tv-tou");

    })


    $("#frd-tv").mouseover(function () {

        $("#frd-tv").removeClass("frd-tv-tou");

    })


    $("#frd-yinchang").click(function () {


        $("#frd-tv").addClass("frd-tv-yin");
        $("#frd-tv-2").removeClass("frd-tv-yin");


    })

    $("#frd-tv-2").mouseover(function () {

        $("#frd-tv").removeClass("frd-tv-yin");
        $("#frd-tv-2").addClass("frd-tv-yin");

    })

    $("#frd-gangwang").click(function () {
        // window.location.href = $(this).children("a").attr("href");

        window.open($(this).children("a").attr("href"));
    })


    $("#frd-jiexi").click(function () {
        window.location.href = $(this).children("a").attr("href") + "?url="+ window.location.href;
    })

    // Your code here...
})();