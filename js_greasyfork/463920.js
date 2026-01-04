// ==UserScript==
// @name         获取美团TOKEN
// @namespace    http://tampermonkey.net/
// @version      0.8
// @license MIT
// @description  撒实打实try to take over the world!
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js

// @author       You
// @match        https://*.meituan.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463920/%E8%8E%B7%E5%8F%96%E7%BE%8E%E5%9B%A2TOKEN.user.js
// @updateURL https://update.greasyfork.org/scripts/463920/%E8%8E%B7%E5%8F%96%E7%BE%8E%E5%9B%A2TOKEN.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //var newCSS = GM_getResourceText ("customCSS");
//    var b_window = window
  //  GM_addStyle (newCSS);
    var log_str = '';
    var conpon_id = '9E5277BC958F4AD192F9EECED4A51D90';
    var gdPageId = '279881';
    var pageId = '279434';
    var instanceId = '16475077287170.30502103309212225';
    var couponList = [
        {   name: '15:00 30-15',
            conpon_id:'96ED3F5E94434D9280FB201FE66315C3',
            gdPageId: '389984',
            pageId: '389528',
            instanceId: '',
        }
    ]
    window.H5guard.init({});
    // Your code here...
    var btn = `<div style="z-index:1000000;position:absolute;background-color:#fff;width:100%;">
    <button type="button" class="search_info am-btn am-btn-default">获取券信息</button>
    <button type="button" class="ttttest am-btn am-btn-default">测试</button>
    <button  type="button" class="start_fetch am-btn am-btn-default">开始抢券</button>
    <div class="log_wrap">
    </div>
</div>`;
    $("body").prepend(btn);
    $('.search_info').on('click', function(){
        var url = 'https://promotion.waimai.meituan.com/lottery/limitcouponcomponent/info?couponReferIds='+conpon_id+'&actualLng=0&actualLat=0&geoType=2';
        $.get({url: url,
              xhrFields:{withCredentials: true},
              success:function(res){
                  log_in('获取券信息成功')

            console.log(res)
        },
               error: function(err){
                   console.log(err)
                   log_in('获取券信息失败')

               }
              })
       // alert('获取到token:' + window.H5guard.getfp())
    })
        $('.ttttest').on('click', ttttest)
    $('.start_fetch').on('click', function(){
        var index = 0;
        if(window.H5guardCount == 0){
             alert('请等待页面加载完成后，在执行此操作！')
            return;
        }
        var fp = window.H5guard.getfp();
        var a = setInterval(function(){
            start_fetch_coupon(fp)
            index += 1;
        }, 80)
        setTimeout(function(){
            clearInterval(a);
        }, 2500)
    })
    function log_in(str){
        log_str = new Date().toLocaleString() + ':' + str + '<br/>' + log_str;
        $('.log_wrap').html(log_str)
    }
    function ttttest(){
        var fp = window.H5guard.getfp();
        start_fetch_coupon(fp)
    }
    function start_fetch_coupon(fp){
        var url = "https://promotion.waimai.meituan.com/lottery/limitcouponcomponent/fetchcoupon?couponReferId=" +conpon_id+ "&actualLng=120.74082265625&actualLat=31.265381859375&geoType=2&gdPageId="+gdPageId+"&pageId="+pageId;
        instanceId.length > 0 ? url += "&instanceId="+instanceId+"&componentId="+instanceId : url;
        console.log(url);
        $.post({url: url,
              xhrFields:{
                  withCredentials: true
              },
               dataType: 'json',
               contentType:"application/json; charset=utf-8",
               headers:{
               'mtgsig': '{}'
               },
               data: JSON.stringify({
                    "cType": "wm_wxapp",
                    "fpPlatform": 13,
                    "wxOpenId": "",
                    "appVersion": "",
                    mtFingerprint: fp,
                }),
              success:function(res){
                  console.log(res)
                  log_in(res.msg)
                  if (res.code == 0){
                      alert('抢券成功！')

                  }
              },
               error: function(err){
                   console.log(err)
               }
              })
    }
})();