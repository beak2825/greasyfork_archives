// ==UserScript==
// @name         ✅最新可用！持续维护✅👍👍网购优惠券助手👍👍，自动显示京东、淘宝、天猫隐藏优惠券。简洁无广告，使用超级方便，持续维护中，一直可用！
// @namespace    http://tbtmycyhq.yhq
// @version      1.7
// @description  🔥🔥网购优惠券助手🔥🔥，在浏览淘宝京东、淘宝、天猫的时候自动显示当前商品是否有内部优惠券(隐藏优惠券、内部券、隐藏券)，让你买的比别人更便宜！❌拒绝任何干扰。⭕持续更新。
// @author       无声风雪
// @match             *://*.taobao.com/*
// @match             *://*.tmall.com/*
// @match             *://chaoshi.detail.tmall.com/*
// @match             *://*.tmall.hk/*
// @match             *://*.jd.com/*
// @match             *://*.jd.hk/*
// @exclude           *://login.taobao.com/*
// @exclude           *://login.tmall.com/*
// @exclude           *://uland.taobao.com/*
// @exclude           *://pages.tmall.com/*
// @exclude           *://wq.jd.com/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @connect *
// @require           https://cdn.bootcdn.net/ajax/libs/jquery/1.8.3/jquery.min.js
// @require           https://cdn.bootcdn.net/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js
// @license MIT
// @antifeature       referral-link 【按照规范要求，本脚本因包含查询优惠券需要添加此提示，感谢大家支持】
// @downloadURL https://update.greasyfork.org/scripts/453674/%E2%9C%85%E6%9C%80%E6%96%B0%E5%8F%AF%E7%94%A8%EF%BC%81%E6%8C%81%E7%BB%AD%E7%BB%B4%E6%8A%A4%E2%9C%85%F0%9F%91%8D%F0%9F%91%8D%E7%BD%91%E8%B4%AD%E4%BC%98%E6%83%A0%E5%88%B8%E5%8A%A9%E6%89%8B%F0%9F%91%8D%F0%9F%91%8D%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E4%BA%AC%E4%B8%9C%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E3%80%82%E7%AE%80%E6%B4%81%E6%97%A0%E5%B9%BF%E5%91%8A%EF%BC%8C%E4%BD%BF%E7%94%A8%E8%B6%85%E7%BA%A7%E6%96%B9%E4%BE%BF%EF%BC%8C%E6%8C%81%E7%BB%AD%E7%BB%B4%E6%8A%A4%E4%B8%AD%EF%BC%8C%E4%B8%80%E7%9B%B4%E5%8F%AF%E7%94%A8%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/453674/%E2%9C%85%E6%9C%80%E6%96%B0%E5%8F%AF%E7%94%A8%EF%BC%81%E6%8C%81%E7%BB%AD%E7%BB%B4%E6%8A%A4%E2%9C%85%F0%9F%91%8D%F0%9F%91%8D%E7%BD%91%E8%B4%AD%E4%BC%98%E6%83%A0%E5%88%B8%E5%8A%A9%E6%89%8B%F0%9F%91%8D%F0%9F%91%8D%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E4%BA%AC%E4%B8%9C%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E3%80%82%E7%AE%80%E6%B4%81%E6%97%A0%E5%B9%BF%E5%91%8A%EF%BC%8C%E4%BD%BF%E7%94%A8%E8%B6%85%E7%BA%A7%E6%96%B9%E4%BE%BF%EF%BC%8C%E6%8C%81%E7%BB%AD%E7%BB%B4%E6%8A%A4%E4%B8%AD%EF%BC%8C%E4%B8%80%E7%9B%B4%E5%8F%AF%E7%94%A8%EF%BC%81.meta.js
// ==/UserScript==
 
(function() {
    console.log("=====yh==========");
    'use strict';
    var style = document.createElement('link');
    style.href = 'https://qxm.iwapan.com/yh_style.css';
    style.rel = 'stylesheet';
    style.type = 'text/css';
    document.getElementsByTagName('head').item(0).appendChild(style);
    var serv = 'https://qxm.iwapan.com/yhq_chajian_js.aspx?ly=yh&';
    var jdserv = 'https://jd.zhihaohuo.com/jd_helper_chajian.aspx?ver=yc360102&ly=yh&';
    var url = location.href;
    var time = 50;
   function QueryString(item){
            var sValue = location.search.match(new RegExp("[\?\&]"+item+"=([^\&]*)(\&?)", "i"))
            return sValue?sValue[1]:sValue
        }
    function jd_getid() {
    var r = window.location.pathname.replace("/","").replace(".html","");
    if (r != null) return unescape(r);
    return null;
}


        ////////////////////////TB////////////////////

     if (url.indexOf("//item.taobao.com/item") != -1 || url.indexOf("//detail.tmall.com/item") != -1 || url.indexOf("//chaoshi.detail.tmall.com/item") != -1 || url.indexOf("//detail.tmall.hk/hk/item") != -1 || url.indexOf("//detail.tmall.hk/item") != -1) {
 
       


         $.get(serv+'tb_shangpin_id='+QueryString("id")+'&tb_shangpin_name=tb'+"&tb_dianbunick=tb&v=201", function(data) {
            var dis_res_html="";
            if(data.length!=0){
                  console.log("=====yh_not_null==========");
            var obj=$.parseJSON(data);
            console.log(data.length);
          dis_res_html=dis_res_html+"<div class='qxm_yhq_rq'>";
	 dis_res_html=dis_res_html+obj.yhq[0].html;
	 dis_res_html=dis_res_html+"";
	 dis_res_html=dis_res_html+"</div>";
            }else
            {
                                  console.log("=====yh_null==========");

                dis_res_html=dis_res_html+"<div class='qxm_yhq'>";
	 dis_res_html=dis_res_html+"<a style='font-size: 10px;color:#fff' target='_blank'  href='#'><div class='par'><span>未找到优惠券</span></div></a>";
	 dis_res_html=dis_res_html+"";
	 dis_res_html=dis_res_html+"</div>";
            }
      setTimeout( function () {
             if(document.getElementById('J_isku')){$('.J_isku').after(dis_res_html);}
             if(document.getElementById('tb-key')){$('.tb-key').after(dis_res_html);}
             if(document.getElementById('skuWrapper')){ $('.skuWrapper').after(dis_res_html);}
             if(document.getElementsByClassName('J_isku')){$('.J_isku').after(dis_res_html);}
             if(document.getElementsByClassName('tb-key')){$('.tb-key').after(dis_res_html);}
             if(document.getElementsByClassName('skuWrapper')){ $('.skuWrapper').after(dis_res_html);}
            }, 1000);
        })
    }

    ////////////////////////jd////////////////////

     if (url.indexOf('item.jd.com') >= 0 || url.indexOf('item.jd.hk') >= 0) {
      var jdid=jd_getid();
         $.get(jdserv+'jd_spid='+jdid, function(data) {
            var dis_res_html="";
            if(data!="null"){
            //var obj=$.parseJSON(data);
           // console.log(obj.yhq[0].yhq_url);
          dis_res_html=dis_res_html+"<div class='qxm_yhq_rq'>";
	 dis_res_html=dis_res_html+data;
	 dis_res_html=dis_res_html+"";
	 dis_res_html=dis_res_html+"</div>";
            }else
            {
                dis_res_html=dis_res_html+"<div class='qxm_yhq'>";
	 dis_res_html=dis_res_html+"<a style='font-size: 10px;color:#fff' target='_blank'  href='#'><div class='par'><span>未找到优惠券</span></div></a>";
	 dis_res_html=dis_res_html+"";
	 dis_res_html=dis_res_html+"</div>";
            }
      setTimeout( function () {
             if(document.getElementsByClassName('summary-price-wrap')){$('.summary-price-wrap').after(dis_res_html);}
            }, 1000);
        })
     }
})();
