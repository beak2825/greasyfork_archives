// ==UserScript==
// @name       获取淘宝天猫、京东、拼多多、唯品会、抖音等网购平台隐藏优惠券。单纯优惠券领取脚本，无广告。让你购物实实在在省钱。
// @namespace       https://gouwu.xunhuo.vip
// @version       1.86
// @description  单纯优惠券领取插件，购物省钱持家好助手，自动显示淘宝天猫、京东、拼多多、聚划算、国际频道、图书、大药房隐藏优惠券，让您购物省钱少花费，注意本插件会对商品地址进行转换，但不会造成安全问题，双方互惠的，你购买商品我获得一点推广收入。无法接受请不要使用，毕竟维护、服务器也需要成本
// @icon         https://tk.xunhuo.vip/favicon.ico
// @author       寻货购物
// @connect      xunhuo.vip
// @match       *.taobao.com/*
// @match       *.tmall.com/*
// @match       *chaoshi.detail.tmall.com/*
// @match       *.tmall.hk/*
// @match       *.jd.com/*
// @match       *.jd.hk/*
// @match       *.liangxinyao.com/*
// @match       *.yiyaojd.com/*
// @match       *.vip.com/*
// @match       *.pinduoduo.com/*

// @homepageURL       https://tk.xunhuo.vip/?id=24557
// @require           https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js

// @require           https://cdn.bootcdn.net/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js
// @license MIT
// @antifeature       referral-link 【本优惠券查询脚本将会对商品地址进行转换，但不会自动进行转跳，需自己点击领取或转跳，便不会隐私泄漏或支付安全等问题，请放心使用...】
// @grant       unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/405110/%E8%8E%B7%E5%8F%96%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E6%8B%BC%E5%A4%9A%E5%A4%9A%E3%80%81%E5%94%AF%E5%93%81%E4%BC%9A%E3%80%81%E6%8A%96%E9%9F%B3%E7%AD%89%E7%BD%91%E8%B4%AD%E5%B9%B3%E5%8F%B0%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E3%80%82%E5%8D%95%E7%BA%AF%E4%BC%98%E6%83%A0%E5%88%B8%E9%A2%86%E5%8F%96%E8%84%9A%E6%9C%AC%EF%BC%8C%E6%97%A0%E5%B9%BF%E5%91%8A%E3%80%82%E8%AE%A9%E4%BD%A0%E8%B4%AD%E7%89%A9%E5%AE%9E%E5%AE%9E%E5%9C%A8%E5%9C%A8%E7%9C%81%E9%92%B1%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/405110/%E8%8E%B7%E5%8F%96%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E6%8B%BC%E5%A4%9A%E5%A4%9A%E3%80%81%E5%94%AF%E5%93%81%E4%BC%9A%E3%80%81%E6%8A%96%E9%9F%B3%E7%AD%89%E7%BD%91%E8%B4%AD%E5%B9%B3%E5%8F%B0%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E3%80%82%E5%8D%95%E7%BA%AF%E4%BC%98%E6%83%A0%E5%88%B8%E9%A2%86%E5%8F%96%E8%84%9A%E6%9C%AC%EF%BC%8C%E6%97%A0%E5%B9%BF%E5%91%8A%E3%80%82%E8%AE%A9%E4%BD%A0%E8%B4%AD%E7%89%A9%E5%AE%9E%E5%AE%9E%E5%9C%A8%E5%9C%A8%E7%9C%81%E9%92%B1%E3%80%82.meta.js
// ==/UserScript==

(function () {
    // 菜单
    GM_registerMenuCommand("多网优惠券网站", function () {
        window.open("https://gouwu.xunhuo.vip/", "_blank");
    });
    GM_registerMenuCommand("备用领券脚本更新地址", function () {
        window.open(" https://tk.xunhuo.vip/?id=24557", "_blank");
    });
  GM_registerMenuCommand("京东代挂福利", function () {
        window.open(" http://jdfl01.kuaigou.link/", "_blank");
    });
})();
(function () {
    'use strict';
    var style = document.createElement('link');

    style.href = 'https://tb.xunhuo.vip/api/style2.css';

    style.rel = 'stylesheet';

    style.type = 'text/css';

    document.getElementsByTagName('HEAD').item(0).appendChild(style);

    var url = location.href;
    var name = $(document).attr('title');//$('input[name=title]').attr('value');
    var biaoti = name.split('-');
    var tbname = $('.tb-main-title').attr('data-title');
    var api = 'https://tb.xunhuo.vip/api/tbhd.php';
    var so="https://tk.xunhuo.vip/m/item/list_s_super.aspx?id=24557&keyword=";
    var maapi="https://api.qrserver.com/v1/create-qr-code/?data=";
    //天猫
    if (url.indexOf("//item.taobao.com/item.htm") > 0 || url.indexOf("//detail.tmall.com/item.htm") > 0 || url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 || url.indexOf("//detail.tmall.hk/hk/item.htm") > 0 || url.indexOf("//detail.tmall.hk/item.htm") > 0) {

        function QueryString(item)

        {
      var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));

      return svalue ? svalue[1] : svalue;
        }
       var taobao = '<div class="tb-btn-buy" style="padding-top:10px;"><a href="https://tk.xunhuo.vip/api_gaoyong_url_m.aspx?id=24557&type=0&type2=0&code='+ QueryString("id") +'" title="进入后请选择浏览器打开" target="_blank">领取优惠券</a></div><div class="tb-btn-add" style="padding-top:10px;"><a href="https://tk.xunhuo.vip/m/item/list_s_super.aspx?id=24557&sid=&relatioid=&keyword='+ encodeURI(biaoti[0]) +'"  title="搜索全部宝贝，如果想要搜索到更多商品，请修改搜索关键字，尽量简短，因为很多商家为了做优化添加了很多无用的词，造成无法搜索到更多商品。！" target="_blank">全网搜券</a></div>';
            var taobao2 = '<div class="tb-btn-buy" style="padding-top:10px;"><a href="https://tk.xunhuo.vip/jiudianjiu.aspx?id=24557" target="_blank">九块九包邮</a></div><div class="tb-btn-add" style="padding-top:10px;"><a href="https://tk.xunhuo.vip/jingxuan.aspx?id=24557" target="_blank">每日精选</a></div>';
            //var taobao2 = '<div class="tb-btn-buy" style="padding-top:10px;"><a href="https://s.click.taobao.com/dL1gB7u" title="淘宝双十一超级红包" target="_blank">淘宝双十一超级红包</a></div><div class="tb-btn-add" style="padding-top:10px;"><a href="https://u.jd.com/BqQgUO5" title="京东双十一红包" target="_blank">京东双十一红包</a></div>';
            //var taobao2 = '<div class="tb-btn-buy" style="padding-top:10px;"><a href="https://gouwu.xunhuo.vip/?cid=buO4PPLk&tmp=rt_xb&code=buO4PPLk&sp=#/sp" title="福利线报" target="_blank">福利线报</a></div><div class="tb-btn-add" style="padding-top:10px;"><a href="https://gouwu.xunhuo.vip/" title="福利购物" target="_blank">全网领券福利购物</a></div>';
            var taobao3 = '<div class="tb-btn-buy" style="padding-top:10px;"><a href="https://jk.xunhuo.vip/?ah=total&kw='+ encodeURI(biaoti[0]) +'" target="_blank" title="搜索京东有优惠券的商品，请自行输入关键字，尽量简短。">京东搜索</a></div><div class="tb-btn-add" style="padding-top:10px;"><a href="https://gouwu.xunhuo.vip/?cid=sUMNV07a#/search?pt=1&keyword='+ encodeURI(biaoti[0]) +'" target="_blank" title="搜索不到或商品较少，请自行修改关键字，尽量简短。">拼多多搜索</a></div>';
            var taobao4 = '<div class="xunhuo" style="padding-top: 250px;"><a class="xunhuoapp" href="javascript:" role="button" data-spm-anchor-id="a220o.1000855.0.0"><img class="xunhuoapp qrcode" src="https://api.qrserver.com/v1/create-qr-code/?data=https://tb.xunhuo.vip/app_download/" alt="领券版app只支持淘宝、天猫" title="领券版app只支持淘宝、天猫">领券版app下载（安卓）</a></div>';
            var taobao5 = '<div class="xunhuo" style="padding-top: 50px;"><a class="xunhuoapp" href="javascript:"><img class="xunhuoapp qrcode" src="https://api.qrserver.com/v1/create-qr-code/?data='+ encodeURIComponent(so) +''+ encodeURI(biaoti[0]) +'" ><p style="color: #F40;">扫码领券</p></a><a class="xunhuoapp" href="javascript:"><img class="xunhuoapp qrcode" src="https://api.qrserver.com/v1/create-qr-code/?data=https://tk.xunhuo.vip/m/?id=24557" >手机网页领券版（扫码后，保存书签）</a></div>';
            var taobao6 = '<div class="xunhuo" style="padding-top: 20px;"><a class="xunhuoapp" href="javascript:" title="无需下载安卓、苹果通用，扫码后可保存到桌面，支持多个平台，集成各种活动，强力推荐。活动加速更新"><img class="xunhuoapp qrcode" src="https://api.qrserver.com/v1/create-qr-code/?data=https://gouwu.xunhuo.vip/" >手机端多平台领券，无需安装支持android、ios，推荐！</a></div><br/>';

            var tmall =   '<div class="tb-btn-buy tb-btn-sku" style="padding-top:10px;"><a href="https://tk.xunhuo.vip/m/item/list_s_super.aspx?id=24557&keyword='+ QueryString("id") +'" title="进入后请选择浏览器打开" target="_blank">领取优惠券</a></div><div class="tb-btn-basket tb-btn-sku" style="padding-top:10px;"><a href="https://tk.xunhuo.vip/m/item/list_s_super.aspx?id=24557&sid=&relatioid=&keyword='+ encodeURI(biaoti[0]) +'" title="点这里可以搜索全部店铺相同名称的全部宝贝，如果想要搜索到更多商品，请修改搜索关键字，尽量简短，因为很多商家为了做优化添加了很多无用的词，造成无法搜索到更多商品。！" target="_blank">全网搜券</a></div>';

            var tmall2 =   '<div class="tb-btn-buy tb-btn-sku" style="padding-top:10px;"><a href="https://gouwu.xunhuo.vip/?cid=buO4PPLk&tmp=rt_xb&code=buO4PPLk&sp=#/sp" title="福利线报" target="_blank">福利线报</a></div><div class="tb-btn-basket tb-btn-sku" style="padding-top:10px;"><a href="https://api.qrserver.com/v1/create-qr-code/?data=https://m.tb.cn/h.ffL6hGH?sm=633443" title="喵糖组队一起赢20亿红包" target="_blank">喵糖组队一起赢20亿红包</a></div>';
            //var tmall2 =   '<div class="tb-btn-buy tb-btn-sku" style="padding-top:10px;"><a href="https://s.click.taobao.com/dL1gB7u" title="淘宝双十一超级红包。" target="_blank">淘宝双十一超级红包</a></div><div class="tb-btn-basket tb-btn-sku" style="padding-top:10px;"><a href="https://u.jd.com/BqQgUO5" title="京东双十一红包" target="_blank">京东双十一红包</a></div>';
            //var tmall2 =   '<div class="tb-btn-buy tb-btn-sku" style="padding-top:10px;"><a href="https://gouwu.xunhuo.vip/?cid=buO4PPLk&tmp=rt_xb&code=buO4PPLk&sp=#/sp" target="_blank">福利线报</a></div><div class="tb-btn-basket tb-btn-sku" style="padding-top:10px;"><a href="https://gouwu.xunhuo.vip/" target="_blank">全网领券购物</a></div>';
            var tmall3 =   '<div class="tb-btn-buy tb-btn-sku" style="padding-top:10px;"><a href="https://jk.xunhuo.vip/?ah=total&kw='+ encodeURI(biaoti[0]) +'" target="_blank" title="搜索京东有优惠券的商品，请自行输入关键字，尽量简短。">京东搜索</a></div><div class="tb-btn-basket tb-btn-sku" style="padding-top:10px;"><a href="https://gouwu.xunhuo.vip/?cid=sUMNV07a#/search?pt=1&keyword='+ encodeURI(biaoti[0]) +'" target="_blank" title="搜索不到或商品较少，请自行修改关键字，尽量简短。">拼多多搜索</a></div>';
            var tmall4 =   '<div style="padding-top: 250px;"><a class="xunhuoapp" href="javascript:"><img class="xunhuoapp qrcode" src="https://api.qrserver.com/v1/create-qr-code/?data=https://tb.xunhuo.vip/app_download/" alt="领券版app只支持淘宝、天猫" title="领券版app只支持淘宝、天猫>领券版app下载</a></div>';
            var tmall5 =   '<a class="xunhuoapp" href="https://api.qrserver.com/v1/create-qr-code/?data=https://m.tb.cn/h.4G3mvez?sm=b55619" target="_blank" title="活动互助，点击后手淘扫码">618超级星秀猫互助群</a><br/><a class="xunhuoapp" href="javascript:"><img class="xunhuoapp qrcode" src="https://api.qrserver.com/v1/create-qr-code/?data='+ encodeURIComponent(so) +''+ encodeURI(biaoti[0]) +'" >扫码领券</a><br/><a class="xunhuoapp" href="javascript:"><img class="xunhuoapp qrcode" src="https://api.qrserver.com/v1/create-qr-code/?data=https://tk.xunhuo.vip/m/?id=24557" >手机网页领券版（扫码后，保存书签）</a>';
         var tmall6 = '<div class="xunhuo" style="padding-top: 20px;"><a class="xunhuoapp" href="javascript:" title="无需下载安卓、苹果通用，扫码后可保存到桌面，支持多个平台，集成各种活动，强力推荐。活动加速更新"><img class="xunhuoapp qrcode" src="https://api.qrserver.com/v1/create-qr-code/?data=https://gouwu.xunhuo.vip/" >手机端多平台领券，无需安装支持android、ios，推荐！</a></div>';


        var tui = '<div id="qrcode"><p class="ma-top">多平台领券+最新活动<br/>保存书签到桌面快捷方便</p></div>';

        $.getJSON(api+'?id='+QueryString("id"),function(data) {

           console.log(data);

             var quan = ' <div class="quan"><b class="quan-jine">优惠券 ' + data.data.couponmoney + '元</b><a target="_blank" href="' + data.data.coupon_click_url + '" class="quan-get">领取</a></div>';

            var wuquan = '<div class="quan"><b class="quan-jine">无优惠券,支持我们<a target="blank" href="' + data.data.coupon_click_url + '"id="by">请点这里购买</a></b>'+
              '<a class="quan-get" target="blank" href="' + so +''+ encodeURI(biaoti[0]) +'">搜索类似商品</a></div>';
            var wuyouhui = '<div class="quan"><b class="quan-jine">未查询到优惠券,本商品没有优惠，请尝试搜索</b>'+
              '<a class="quan-get" target="blank" href="' + so +''+ encodeURI(biaoti[0]) +'">搜索类似商品</a></div>';

            var saoma = '<div id="qrcode2"><p class="ma-top">手机扫码领取优惠券</p></div>';


            if (url.indexOf('//chaoshi.detail.tmall.') != -1 || url.indexOf('//detail.tmall.') != -1)
            {

           if (data.data.couponmoney > 1)
           {
                    $('.tm-fcs-panel').after(quan + saoma);
              $('.tb-action').append(tmall + tmall2 + tmall3 + tmall6 + tui);
          }
                else{
              if (data.data.couponmoney == 0 || data.data.status_code == 200)
              {
                  $('.tm-fcs-panel').after(wuquan);
                  $('.tb-action').append(tmall + tmall2 + tmall3 + tmall6 + tui);
              }
                 else {
                   if (data.data == '' || data.data.status_code == 1)
                   {
                       $('.tm-fcs-panel').after(wuyouhui);
                       $('.tb-action').append(tmall + tmall2 + tmall3 + tmall6 + tui);
                   }
                  //window.location.replace(data.data.coupon_short_url);
              }
          }

            }
//淘宝市集
            else {

          if (data.data.couponmoney > 1) {
              $('ul.tb-meta').after(quan + saoma);
              $('.tb-action').append(taobao + taobao2 + taobao3 + taobao4 + taobao6 + tui);
          }
                else{
              if (data.data.couponmoney == 0 || data.data.status_code == 200) {
                  $('ul.tb-meta').after(wuquan);
                  $('.tb-action').append(taobao + taobao2 + taobao3 + taobao4 + taobao6 + tui);
              } else {
                  if (data.code == 0) {
                      $('ul.tb-meta').after(wuyouhui);
                      $('.tb-action').append(taobao + taobao2 + taobao3 + taobao4 + taobao6 + tui);
                  }
                 //window.location.replace(data.data.coupon_short_url);
              }

          }
            }

            $("#qrcode2").qrcode({
          width:150,
          height:150,
          text:'https://tk.xunhuo.vip/api_gaoyong_url.aspx?id=24557&code='+QueryString("id")
            })

           $("#qrcode").qrcode({
          width:150,
          height:150,
          text:'https://gouwu.xunhuo.vip'
            })
        })
    }

//京东
  else if (url.indexOf("//item.jd.com/") > 0 || url.indexOf("//item.yiyaojd.com/") > 0 || url.indexOf("//npcitem.jd.hk/") > 0 || url.indexOf("//pcitem.jd.hk/") > 0 || url.indexOf("//pro.jd.com/") > 0 || url.indexOf("//pro.m.jd.com/") > 0 || url.indexOf("//story.m.jd.com/") > 0 || url.indexOf("//prodev.m.jd.com/") > 0 || url.indexOf("//prodev.jd.com/") > 0) {

   var sojd='http://jk.xunhuo.vip/?ah=total&kw=';
            var id=window.location.pathname;

            id = id.split("/")[1];
            id = id.split(".html")[0];
            name = $('meta[name=keywords]').attr('content');
      $.getJSON('https://tb.xunhuo.vip/api/jd.php?id='+id,function(data) {
            console.log(data);
       var tui = '<div id="qrcode"><p class="ma-top">多平台领券+最新活动<br/>保存书签到桌面快捷方便</p></div>';

            var saoma = '<div id="qrcode2"><p class="ma-top"><b>使用手机扫码领取优惠券</b></p></div>';
            //var jd =   '<a href="https://jk.xunhuo.vip/?ah=detail&id='+ encodeURI(id) +'" class="btn-special2 btn-lg" style="margin-right: 10px;" target="_blank">领取优惠券</a>';
            var jd =   '<a href="https://gouwu.xunhuo.vip/?cid=sUMNV07a#/detail?id='+ encodeURI(id) +'&platform=2&super=1" class="btn-special2 btn-lg" style="margin-right: 10px;" target="_blank">领取优惠券</a>';
            //var jd2 =   '<a href="http://jk.xunhuo.vip/?ah=total&kw=' + data.data.goods_name + '" class="btn-special2 btn-lg" style="margin-right: 10px;" title="搜索全网有优惠券的商品，请自行输入关键字，尽量简短。" target="_blank">京东全网搜索</a>';
            var jd2 =   '<a href="https://gouwu.xunhuo.vip/?cid=sUMNV07a#/search?pt=2&keyword=' + data.data.goods_name + '" class="btn-special2 btn-lg" style="margin-right: 10px;" title="搜索全网有优惠券的商品，请自行输入关键字，尽量简短。" target="_blank">京东全网搜索</a>';
            var jd3 =   '<a href="https://gouwu.xunhuo.vip/?cid=zWTme4n#/search?keyword=' + data.data.goods_name + '" class="btn-special2 btn-lg"  title="搜索淘宝有优惠券的商品，请自行输入关键字，尽量简短。" target="_blank">淘宝搜索</a>';
            var jd4 =   '<a href="https://youhui.pinduoduo.com/search/landing?keyword=' + data.data.goods_name + '&pid=1687692_15178080&cpsSign=CM_200617_1687692_15178080_73246e704c0b4a7cc45c9fbf914dc98c&duoduo_type=2" class="btn-special2 btn-lg" style="margin-left: 10px; margin-top: 10px;" title="搜索拼多多有优惠券的商品，请复制标题或自行输入关键字，尽量简短。" target="_blank">拼多多搜索</a>';
        var jd5 =   '<a href="https://www.loapi.com/14.html" title="各平台活动汇总" class="btn-special2 btn-lg" style="margin-right: 10px;" target="_blank">活动汇总</a>';
          //var jd5 =   '<a href="https://gouwu.xunhuo.vip/?cid=buO4PPLk&tmp=rt_xb&code=buO4PPLk&sp=#/sp" title="福利线报" class="btn-special2 btn-lg" style="margin-right: 10px;" target="_blank">福利线报</a>';
         var jd6 =   '<a href="https://gouwu.xunhuo.vip/" title="全网领券福利购物" class="btn-special2 btn-lg" style="margin-top: 10px;" target="_blank">全网领券福利购物</a>';

            if (data.data.discount) {
                var quan = '<div class="quan"><b class="quan-jine">优惠券 ' + data.data.discount + '元</b><a target="_blank" href="' + data.data.couponurl + '" class="quan-get">领取</a></div>';
          $('.summary-top').after(quan + saoma);
           $('div#choose-btns').after(jd + jd2 + jd3 + jd4 + jd5 + jd6);
            } else {
          if (data.data.discount ==0 || data.status_code ==-200) {
               var wuquan = '<div class="quan"><b class="quan-jine">无优惠券,支持我们<a href="https://gouwu.xunhuo.vip/?cid=sUMNV07a#/detail?id=' + id + '&platform=2&super=1" id="by">点我购买</a></b><a target="_blank" href="https://gouwu.xunhuo.vip/?cid=sUMNV07a#/search?pt=2&keyword=' + data.data.goods_name + '" class="quan-get">搜索类似商品</a></div>';
              $('.summary-top').after(wuquan);
              $('div#choose-btns').after(jd + jd2 + jd3 + jd4 + jd5 + jd6 + tui);
          }else {
              //window.location.replace();

            }
            }
            $("#qrcode2").qrcode({
          width:150,
          height:150,
          text:"https://gouwu.xunhuo.vip/?cid=sUMNV07a#/detail?id=' +id&'platform=2&super=1"
            })
            $("#qrcode").qrcode({
          width:150,
          height:150,
          text:'https://gouwu.xunhuo.vip'
            })
        })
    }

//vip
    else if (url.indexOf("//detail.vip.com/detail") > 0 || url.indexOf("//www.vipglobal.hk/detail") > 0) {
        if (url.indexOf("?") > 0) {
            url = url.substr(0, url.indexOf("?"));
        }
        id=window.location.pathname;
            id = id.split("-")[2];
            id = id.split(".html")[0];
       //name = $('meta[name=keywords]').attr('content');
        var chaquan =   '<div class="quan-btn-sku"><a href="https://gouwu.xunhuo.vip/?cid=sUMNV07a#/detail?platform=5&itemid='+ id +'" title="点击进去看下有没有券" target="_blank">查券</a></div>';
        var soso =   '<div class="quan-btn-sku"><a href="https://gouwu.xunhuo.vip/?cid=sUMNV07a#/search?keyword=" title="请手动复制标题搜索，搜不到请修改、简短关键字" target="_blank">全网搜索</a></div>';
        var ma = '<div id="qrcode"><p class="ma-top"><b>使用微信或唯品会APP扫码购买</b></p></div>';
        $('div#J_detail_buy').after(chaquan+soso);
 $("#qrcode").qrcode({
                    width:150,
                    height:150,
                    text:'https://gouwu.xunhuo.vip/?cid=sUMNV07a#/detail?platform=5&itemid='+id
                })

        $.getJSON('https://tb.xunhuo.vip/api/vip.php?id='+id,function(data) {
            var saoma = '<div id="qrcode2"><p class="ma-top"><b>请用唯品会APP或微信扫码直接购买</b></p></div>';
            if (data.result.urlInfoList[0].url) {
                $('.pi-title-box').after(saoma);
                $("#qrcode2").qrcode({
                    width:150,
                    height:150,
                    text:data.result.urlInfoList[0].url
                })
            }
        })
    }

             //拼多多
             else if(url.indexOf("//youhui.pinduoduo.com/") > 0){

                 if(location.href.indexOf('?') ==-1){
                     window.location.replace(location.href+"?pid=1687692_15178080&cpsSign=CM_200617_1687692_15178080_73246e704c0b4a7cc45c9fbf914dc98c&duoduo_type=2");
   //location.href=location.href+"?pid=1687692_15178080&cpsSign=CM_200617_1687692_15178080_73246e704c0b4a7cc45c9fbf914dc98c&duoduo_type=2";
    }
                 function QueryString(Id)

        {
      var svalue = location.search.match(new RegExp("[\?\&]" + Id + "=([^\&]*)(\&?)","i"));

      return svalue ? svalue[1] : svalue;
        }
             id = window.location.href;
            id = id.split("goodsId=")[1];
            name = $('meta[name=keywords]').attr('content');
            var pdd =   '<style>.goods-detail-wrapper .top-wrapper {height: 100%; !important;}.goods-detail-wrapper .buy-btn {float: left; margin: 10px 0 0 10px;}</style>';

           var pdd2 =   '<a href="https://api.qrserver.com/v1/create-qr-code/?data=https://p.pinduoduo.com/mnh9jLZZ" title="红包福利专享会场，超多大额优惠券发放中，一键立抢，点击后扫码获取。" class="buy-with-coupon" style="background-color: #171616;" target="_blank">天天拆红包</a>';
                 var pdd3 =   '<a href="https://api.qrserver.com/v1/create-qr-code/?data=https://p.pinduoduo.com/0sR9jgWK" title="【今日可领】点一下就能领15元现金，先到先得！，点击后扫码获取。" class="buy-btn" style="background-color: #171616;" target="_blank">现金刮刮卡</a>';
                 var pdd4 =   '<a href="https://youhui.pinduoduo.com/search/landing?keyword=&pid=1687692_15178080&cpsSign=CM_200617_1687692_15178080_73246e704c0b4a7cc45c9fbf914dc98c&duoduo_type=2" class="buy-btn" style="background-color: #171616;" target="_blank">拼多多全网搜索</a>';
                 var pdd5 =   '<a href="https://api.qrserver.com/v1/create-qr-code/?data=https://p.pinduoduo.com/oLn9wGsH" title="今日爆款数量有限，更有超多大额优惠券发放中，一键立抢，点击后扫码获取。" class="buy-btn" style="background-color: #171616;" target="_blank">今日爆款</a>';
                  var pdd6 =   '<a href="https://tk.xunhuo.vip/m/index_super.aspx?id=24557&sid=&relationId=" title="请复制标题自行搜索相关关键字。" class="buy-btn" style="background-color: #171616;" target="_blank">淘宝搜索</a>';
                  var pdd7 =   '<a href="https://jk.xunhuo.vip/?ah=total&kw=" title="请复制标题自行搜索相关关键字。" class="buy-btn" style="background-color: #171616;" target="_blank">京东搜索</a>';
			//$('div.buy-btns').append(pdd,pdd2,pdd3,pdd5,pdd4,pdd6,pdd7);
                         //券链接
          //url = 'https://pdd.xunhuo.vip/api/2.php?id='+ QueryString("goodsId");
          //$.getJSON(url, function(json){
        //$('.top-right-wrapper').append('<a href="https://api.qrserver.com/v1/create-qr-code/?data='+ json.data.data +'" title="点击打开后请用拼多多app或微信扫码领取，可以使用浏览器等扫码。" class="buy-btn"  target="_blank">领取优惠券</a>');
//});

                      }


    //so
else {
        var jc = {};
        jc.initSearchItem = function (selector) {
            var $sousuo = $(selector);
            if ($sousuo.hasClass("tb-quan"))
            {
          return;
            }
            else{
          $sousuo.addClass("tb-quan")
            }
            var id = $sousuo.attr("data-id");
            if (!id || parseInt(id) != id || id <= 10000)
            {
          id = $sousuo.attr("data-itemid");
            }
            if (!id || parseInt(id) != id || id <= 10000)
            {
          if ($sousuo.attr("href")) {
              id = location.protocol + $sousuo.attr("href");
          }
           else{
              var $tma = $sousuo.find("a");
              if (!$tma.length)
              {
                  return;
              }
              id = $tma.attr("data-nid");
              if (!id || parseInt(id) != id || id <= 10000)
              {
                  if ($tma.hasClass("j_ReceiveCoupon") && $tma.length > 1)
                  {
                id = location.protocol + $($tma[1]).attr("href");
                  }
                  else
                  {
                id = location.protocol + $tma.attr("href");
                  }
              }
          }
            }
//淘宝搜
            var soquan = '<div class="tb-quan-area tb-quan-wait" data-nid="' + id + '"><a class="tb-quan-info tb-quan-info-default">待查询</a></div>'

            if (id.indexOf('http') >= 0) {

          if (id.indexOf("//item.taobao.com/item.htm") > 0 || id.indexOf("//detail.tmall.com/item.htm") > 0 || id.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 || id.indexOf("//detail.ju.taobao.com/home.htm") > 0 || id.indexOf("//detail.tmall.hk/hk/item.htm") > 0 || id.indexOf("//detail.tmall.hk/item.htm") > 0) {
              $sousuo.append(soquan);
          }
            } else if (id) {
          $sousuo.append(soquan);
            }
        };
        jc.basicQueryItem = function (selector) {

            var $sousuo = $(selector);
            $sousuo.removeClass("tb-quan-wait");
            var id = $sousuo.attr("data-nid");
            $.getJSON('https://tb.xunhuo.vip/api/tbhd.php?id='+id,function(data) {
          if (data.data.couponmoney > 1) {
              $sousuo.html('<a target="_blank" class="tb-quan-info tb-quan-info-find" >有优惠（有' + data.data.couponmoney + '元券）</a>');
          } else {
              $sousuo.addClass("tb-quan-tmd");
              $sousuo.html('<a href="javascript:void(0);" class="tb-quan-info tb-quan-info-empty">暂无优惠券</a>');
          }
            })
        };
        var tianmaolist = [];
        if (url.indexOf("//s.taobao.com/search") > 0 || url.indexOf("//s.taobao.com/list") > 0)
        {
            tianmaolist.push(".items .item");
        }
		else if (url.indexOf("//list.tmall.com/search_product.htm") > 0 || url.indexOf("//list.tmall.com/coudan/search_product.htm") > 0)
		{
            tianmaolist.push(".product");

            tianmaolist.push(".chaoshi-recommend-list .chaoshi-recommend-item");
        }

		else if (url.indexOf("//list.tmall.hk/search_product.htm") > 0)

		{
            tianmaolist.push("#J_ItemList .product");
        }

		else if (document.getElementById('J_ShopSearchResult'))
		{
            tianmaolist.push("#J_ShopSearchResult .item");
        }

        if (tianmaolist && tianmaolist.length > 0)
		{
          setInterval(function ()

          {
          tianmaolist.forEach(function (selector)
         {
          $(selector).each(function ()

                {
                  jc.initSearchItem(this);
              });
          });
            }, 2500);

           $(document).on("click", ".tb-quan-area", function ()
          {
          var $sousuo = $(this);

          if ($sousuo.hasClass("tb-quan-wait"))
		  {
              jc.basicQueryItem(this);
          }

		  else if ($sousuo.hasClass("tb-quan-tmd"))

		  {
              $sousuo.removeClass("tb-quan-tmd");
          }

		  else
		  {
              $sousuo.addClass("tb-quan-tmd");
          }
            });


            setInterval(function ()
          {
          $(".tb-quan-wait").each(function ()
           {
              jc.basicQueryItem(this);
          });
            }, 2500);
        }
    }
})();
