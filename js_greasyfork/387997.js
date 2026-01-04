// ==UserScript==
// @name         百度首页简化_[ 随机壁纸 ]
// @namespace    http://tampermonkey.net/
// @icon         https://www.baidu.com/favicon.ico
// @version      0.2
// @description  百度首页简化_随机壁纸
// @author       Guy
// @match        https://www.baidu.com/
// @downloadURL https://update.greasyfork.org/scripts/387997/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%AE%80%E5%8C%96_%5B%20%E9%9A%8F%E6%9C%BA%E5%A3%81%E7%BA%B8%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/387997/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%AE%80%E5%8C%96_%5B%20%E9%9A%8F%E6%9C%BA%E5%A3%81%E7%BA%B8%20%5D.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

(function () {
    'use strict';
    var w; //屏幕宽
    var h; //屏幕高
    var x; //光标水平坐标
    var y; //光标垂直坐标
    var xc; //壁纸初始水平坐标
    var yc; //壁纸初始垂直坐标
    var xzxd; //中心点水平坐标
    var yzxd; //中心点垂直坐标
    $('.head_wrapper #u1').css({
        "margin":"5px",
        "background-color":"rgba(64,112,178,0.7)",
        "border-radius":"12px",
        "height":"40px"
    });//
    $('#u1').css("padding","0px 20px 0px 0px");
    $('#u1').html("<a href='http://news.baidu.com' name='tj_trnews' class='mnav' style='line-height: 40px; text-decoration: none; color: white;'>新闻</a><a href='http://map.baidu.com' name='tj_trmap' class='mnav' style='line-height: 40px; text-decoration: none; color: white;'>地图</a><a href='http://v.baidu.com' name='tj_trvideo' class='mnav' style='line-height: 40px; text-decoration: none; color: white;'>视频</a><a href='http://tieba.baidu.com' name='tj_trtieba' class='mnav' style='line-height: 40px; text-decoration: none; color: white;'>贴吧</a><a href='http://xueshu.baidu.com' name='tj_trxueshu' class='mnav' style='line-height: 40px; text-decoration: none; color: white;'>学术</a><a href='http://www.baidu.com/gaoji/preferences.html' name='tj_settingicon' id='pf' style='line-height: 40px; text-decoration: none; color: white;'>设置</a><a href='http://music.taihe.com' name='tj_mp3'><span class='bdbriimgitem_3'></span>音乐</a><a href='http://image.baidu.com' name='tj_img'><span class='bdbriimgitem_4'></span>图片</a><a href='http://zhidao.baidu.com' name='tj_zhidao'><span class='bdbriimgitem_2'></span>知道</a><a href='http://wenku.baidu.com' name='tj_wenku'><span class='bdbriimgitem_5'></span>文库</a>");
    $('#u1 a').removeClass();
    $('#u1 a').addClass("mnav");
    $('#pf').addClass("pf");
    $('.head_wrapper #u1 a').css({
        "line-height":"40px",
        "text-decoration":"none",
        "color":"white"
    });
    //右上角导航栏
    $('.head_wrapper').css('background-image','url(http://api.btstu.cn/sjbz/?lx=dongman)');
    //背景壁纸
    $('#lg').html("");
    $('#lg').css("height","132px");
    $('.qrcodeCon').css("display","none");
    $('#ftCon').css("display","none");

    $('.s_ipt_wr').css({
        "border-radius":"12px",
        "background-color":"rgba(225,225,225,0.5)"
    });
    $('.s_btn').css({
        "border-radius":"12px"
    });
    //搜索框

    $('.head_wrapper').css("background-size","110% 110%");
    w = $('.head_wrapper').width();
    h = $('.head_wrapper').height();
    xc = (w - w * 1.1) / 2;
    yc = (h - h * 1.1) / 2;
    xzxd = w / 2;
    yzxd = h / 2;
    $('.head_wrapper').css("background-position", xc + "px " + yc + "px");
    var set = setInterval(function() {
        if(w != $('.head_wrapper').width() || h != $('.head_wrapper').height()) {
            w = $('.head_wrapper').width();
            h = $('.head_wrapper').height();
            xc = (w - w * 1.1);
            yc = (h - h * 1.1);
            xzxd = w / 2;
            yzxd = h / 2;
            $('.head_wrapper').css("background-position", xc + "px " + yc + "px");
        }
    }, 1);
    $('.head_wrapper').mousemove(function(e) {
        x = e.pageX;
        y = e.pageY;
        $('.head_wrapper').css("background-position", xc*(x/w) + "px " + yc*(y/h) + "px");

    });
    console.clear();
    console.log('%c 已启用:[百度首页美化] ','background:#000; color:#dbb99d');

})();
