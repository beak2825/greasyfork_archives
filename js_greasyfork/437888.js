// ==UserScript==
// @name         淘宝，天猫，京东，拼多多，全网比价领券-大额优惠券-内部优惠券 先比价再领券更划算：免费解析主流视频网站的VIP视频
// @namespace    http://shop.kuailaifan.com/ShopShare/?code=JCKEBXCDWHB
// @description  一键比价，一键领券。看看相同商品哪家店铺价格便宜，哪家有隐藏优惠券，直接领取优惠券购买。省钱就是赚钱！智能解析为您免费解析主流视频网站的VIP视频,支持爱奇艺、腾讯、优酷、乐视、芒果、搜狐、PPTV等等，可搜索最新的免费福利视频、电影和电视剧资源，欢迎使用！线路更稳定流畅无广告
// @author       bingci
// @match        *://m.youku.com/v*
// @match        *://m.youku.com/a*
// @match        *://v.youku.com/v_*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/w_*
// @match        *://*.iqiyi.com/a_*
// @match        *://*.iqiyi.com/adv*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://v.qq.com/x/cover/*
// @match        *://m.v.qq.com/x/cover/*
// @match        *://v.qq.com/cover*
// @match        *://m.v.qq.com/cover*
// @match        *://v.qq.com/x/page/*
// @match        *://m.v.qq.com/x/page/*
// @match        *://v.qq.com/play*
// @match        *://m.v.qq.com/play*
// @match        *://*.tudou.com/listplay/*
// @match        *://*.tudou.com/albumplay/*
// @match        *://*.tudou.com/programs/view/*
// @match        *://*.tudou.com/v/*
// @match        *://*.mgtv.com/b/*
// @match        *://film.sohu.com/album/*
// @match        *://tv.sohu.com/v/*
// @match        *://m.tv.sohu.com/v*
// @match        *://m.tv.sohu.com/phone_*
// @match        *://*.pptv.com/show/*
// @match        *://*.wasu.cn/Play/show*
// @match        *://*.wasu.cn/Play/show/*
// @match        *://*.wasu.cn/wap/Play/show/*
// @match        *://vip.1905.com/play/*
// @match        *://*.baofeng.com/play/*
// @include      http*://item.taobao.com/*
// @include      http*://detail.tmall.com/*
// @include      http*://item.jd.com/*
// @include      http*://detail.tmall.hk/*
// @include        *://*.baidu.com/*
// @include        *://*.hao123.com/*
// @include        *://*.weibo.com/*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @require      https://cdn.staticfile.org/twitter-bootstrap/3.3.7/js/bootstrap.min.js
// @resource     mycss1  https://cdn.staticfile.org/twitter-bootstrap/3.3.7/css/bootstrap.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @version      2.3.8
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/437888/%E6%B7%98%E5%AE%9D%EF%BC%8C%E5%A4%A9%E7%8C%AB%EF%BC%8C%E4%BA%AC%E4%B8%9C%EF%BC%8C%E6%8B%BC%E5%A4%9A%E5%A4%9A%EF%BC%8C%E5%85%A8%E7%BD%91%E6%AF%94%E4%BB%B7%E9%A2%86%E5%88%B8-%E5%A4%A7%E9%A2%9D%E4%BC%98%E6%83%A0%E5%88%B8-%E5%86%85%E9%83%A8%E4%BC%98%E6%83%A0%E5%88%B8%20%E5%85%88%E6%AF%94%E4%BB%B7%E5%86%8D%E9%A2%86%E5%88%B8%E6%9B%B4%E5%88%92%E7%AE%97%EF%BC%9A%E5%85%8D%E8%B4%B9%E8%A7%A3%E6%9E%90%E4%B8%BB%E6%B5%81%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E7%9A%84VIP%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/437888/%E6%B7%98%E5%AE%9D%EF%BC%8C%E5%A4%A9%E7%8C%AB%EF%BC%8C%E4%BA%AC%E4%B8%9C%EF%BC%8C%E6%8B%BC%E5%A4%9A%E5%A4%9A%EF%BC%8C%E5%85%A8%E7%BD%91%E6%AF%94%E4%BB%B7%E9%A2%86%E5%88%B8-%E5%A4%A7%E9%A2%9D%E4%BC%98%E6%83%A0%E5%88%B8-%E5%86%85%E9%83%A8%E4%BC%98%E6%83%A0%E5%88%B8%20%E5%85%88%E6%AF%94%E4%BB%B7%E5%86%8D%E9%A2%86%E5%88%B8%E6%9B%B4%E5%88%92%E7%AE%97%EF%BC%9A%E5%85%8D%E8%B4%B9%E8%A7%A3%E6%9E%90%E4%B8%BB%E6%B5%81%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E7%9A%84VIP%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    $(document).ready(function () {
        var host = window.location.host;
        var productNm = '';
        var url = "https://shop.55uu.wang";
        var urll = "https://shop.55uu.wang/tz.php?keyWords=";
        var label = "严选好货";
        var labell = "全网比价领券";
        var cssSelector = '';
        var ho = "";
        if (host.indexOf('taobao.com') > 0) {
            productNm = $.trim($('.tb-main-title').text());
            cssSelector = '.tb-action';
            ho = "t";
        } else if (host.indexOf('tmall.com') > 0  || host.indexOf('tmall.hk')> 0) {
            productNm = $.trim($('.tb-detail-hd h1').text());
            cssSelector = '.tb-action';
            ho = "t";
        } else if (host.indexOf('jd.com') > 0) {
            productNm = $.trim($('.sku-name').text());
            cssSelector = '#choose-btns';
            productNm = $.trim($('.sku-name').text());
            ho = "j";
 
            urll = "https://shop.55uu.wang/?r=/l&kw=";
        }
        $(cssSelector).append(obtainAppendHtml(host, url, productNm, label, urll, labell,ho));
 
 
 ///////////////////////////////////////////////////
  var currentUrl = window.location.href;
    var reYk = /youku/i;
    var reAqy = /iqiyi/i;
    var reLS = /le.com/i;
    var reTX = /v.qq/i;
    var reTD = /tudou/i;
    var reMG = /mgtv/i;
    var reSH = /sohu/i;
    var reAF = /acfun/i;
    var reBL = /bilibili/i;
    var reYJ = /1905/i;
    var rePP = /pptv/i;
    var reYYT = /yinyuetai/i;
    var reTaoBao = /taobao.com/i;
    var reTmall = /tmall/i;
    var reJd = /jd/i;
    var reWY = /163(.*)song/i;
    var reQQ = /y.QQ(.*)song/i;
    var reKG = /kugou(.*)song/i;
    var reKW = /kuwo(.*)yinyue/i;
    var reXM = /xiami/i;
    var reBD = /taihe.com/i;
    var reQT = /qingting/i;
    var reLZ = /lizhi/i;
    var reMiGu = /miguvideo/i;
    var reXMLY = /ximalaya/i;
    var reSXB = /shangxueba/i;
    var reBili = /bilibili.com\/video\/av/i;
    var reWS = /wasu.cn/i;
    var reBF = /baofeng/i;
    var t = $.now();
    if (reAqy.test(currentUrl) || reLS.test(currentUrl) || reTX.test(currentUrl) || reTD.test(currentUrl) || reMG.test(currentUrl) || reSH.test(currentUrl) || rePP.test(currentUrl) || reYk.test(currentUrl) || reYJ.test(currentUrl) || reWS.test(currentUrl)  || reBF.test(currentUrl) || reMiGu.test(currentUrl))
    {
GM_addStyle('#floatDivBoxs{width:170px;background:#fff;position:fixed;top:180px;right:0;z-index:999;}')
GM_addStyle('#floatDivBoxs a{color:#666;text-decoration:none;outline:none;}')
GM_addStyle('#floatDivBoxs a:hover{color:#e8431f;}')
GM_addStyle('#floatDivBoxs .floatDtt{width:100%;height:50px;line-height:50px; background:#4E5345;color:#fff;font-size:20px;text-indent:22px;position:relative;}')
GM_addStyle('#floatDivBoxs .floatDqq{padding:0 14px;}')
GM_addStyle('#floatDivBoxs .floatDqq li{height:45px;line-height:45px;font-size:15px;border-bottom:1px solid #e3e3e3;}')
GM_addStyle('#floatDivBoxs .floatDbg{width:100%;height:20px;box-shadow:-2px 0 3px rgba(104,111,92);}')
GM_addStyle('.floatShadow{box-shadow:-2px 0 3px rgba(104,111,92);}')
GM_addStyle('#rightArrow{width:50px;height:45px;position:fixed;top:180px;right:170px;z-index:999;}')
GM_addStyle('#rightArrow a{background:#4E5345;display:block;height:50px;}')
GM_addStyle('#rightArrow a img{background:#4E5345;display:block;height:50px;width:45px;}')
 
var html = '<div id="rightArrow"><a href="javascript:;" title=""><img id="rightImg" src="http://pic.qqtn.com/up/2020-2/2020228165131895.png" /></a></div>'
  html += '<div id="floatDivBoxs">'
  html += '<div class="floatDtt">VIP解析通道</div>'
  html += '<div class="floatShadow">'
  html += '<ul class="floatDqq">'
       html += '<li><a href="#" name="vip" url="https://video.55uu.wang/jx.php?url=">无忧影视解析</a></li>'
 
   html += ' </ul>'
  html += '</div>'
  html += '</div>'
// 添加到页面上
$("body").append(html);
//浮动代码
var flag=1;
$('#rightArrow').click(function(){
	if(flag==1){
		$("#floatDivBoxs").animate({right: '-175px'},300);
		$(this).animate({right: '-5px'},300);
		$(this).css('background-position','-50px 0');
        $("#rightImg").attr("src","http://pic.qqtn.com/up/2020-2/2020228165131895.png");
		flag=0;
	}else{
		$("#floatDivBoxs").animate({right: '0'},300);
		$(this).animate({right: '170px'},300);
		$(this).css('background-position','0px 0');
        $("#rightImg").attr("src","http://pic.qqtn.com/up/2020-2/2020228165131895.png");
		flag=1;
	}
 
});
 
 
// 监听每一个接口点击事件
$("a[name='vip']").on("click",function(){
    //获取当前网址
    var url = window.location;
    var api = $(this).attr("url");
    window.open(api+url);
	return false;
})
    }
 
 
 
////////////////////////////////////////
 
    });
 
 
     $('body').on('click', '[data-cat=yx]', function () {
        window.open('https://shop.55uu.wang');
    });
 
   $('body').on('click', '[data-cat=tmbj]', function () {
        var productNm = $.trim($('.tb-detail-hd h1').text());
        window.open('https://shop.55uu.wang/?r=/l&kw='+ encodeURI(productNm));
    });
 
   $('body').on('click', '[data-cat=tbbj]', function () {
       var productNm = $.trim($('.tb-main-title').text());
        window.open('https://shop.55uu.wang/?r=/l&kw='+ encodeURI(productNm));
    });
  $('body').on('click', '[data-cat=jdbj]', function () {
       var productNm = $.trim($('.sku-name').text());
        window.open('https://shop.55uu.wang/?r=/l/jdlist&kw='+ encodeURI(productNm));
    });
 
 
 GM_addStyle(GM_getResourceText('mycss1'));
 
 
    function obtainAppendHtml(host, url, productNm, label, urll, labell,ho) {
 
        ////////////////////////////////
    $(function(){
        $("[rel=drevil]").popover({
 
            trigger:'manual',
            placement : 'bottom', //placement of the popover. also can use top, bottom, left or right
            title : '手机扫码', //this is the top title bar of the popover. add some basic css
            html: 'true', //needed to show html of course
           // container: '#J_AddFavorite',
           // selector: '#J_Title',
            content : '<div class="container-fluid" width="130" height="130"><div><br> 使用浏览器扫码查看优惠券,<br>支持<br>淘宝天猫京东拼多多</div><img src= "https://shop.55uu.wang/taobao/qr1.php?host='+ho+'&keyword='+encodeURI(productNm)+'" width="130" height="130" /></div>', //this is the content of the html box. add the image here or anything you want really.
            animation: false
        }).on("mouseenter", function () {
                    var _this = this;
                    $(this).popover("show");
                    $(this).siblings(".popover").on("mouseleave", function () {
                        $(_this).popover('hide');
                    });
                }).on("mouseleave", function () {
                    var _this = this;
                    setTimeout(function () {
                        if (!$(".popoverhover").length) {
                            $(_this).popover("hide")
                        }
                    }, 100);
                });
	});
////////////////////////////////////////
    if ( host.indexOf('taobao.com') > 0)
    {

         return '  <div class="div-inline" > <div class="tb-btn-buy"  style="padding-top:11px;" rel="drevil" data-container="#J_Title" z-index: 99999999999;><a >扫码领券  </a>  </div></div> <div class="div-inline" ><div class="tb-btn-add " style="padding-top:11px;" data-cat="tbbj" ><a href="javascript:void(0)">' + labell + '</a></div></div>'
 
 
        }
   
     else if (host.indexOf('tmall.com') > 0 ||host.indexOf('tmall.hk')> 0 ) 
     {
            return '<div ><div class="tb-btn-buy tb-btn-sku" style="padding-top:11px;" rel="drevil" data-container="#J_AddFavorite" z-index: 99999999999;><a >扫码领券 </a></div></div> <div class="div-inline"><div class="tb-btn-basket tb-btn-sku " style="padding-top:11px;" data-cat="tmbj"><a href="javascript:void()">' + labell + '</a></div></div>'
 
        }
        else if (host.indexOf('jd.com') > 0) 
        {
         return '<a  class="btn-special1 btn-lg" rel="drevil">扫码领券</a><a  class="btn-special1 btn-lg" href="javascript:void()" data-cat="jdbj">' + labell + '</a>';
    }
 
    }
})();