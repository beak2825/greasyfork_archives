// ==UserScript==
// @name         优惠券净化器
// @namespace    youhuiquanjinghuaqi
// @version      0.1
// @description  净化流氓脚本插件在淘宝和京东网站插入的优惠券推广窗口
// @author       fanxiaopang
// @match        *://item.taobao.com/*
// @match        *://chaoshi.detail.tmall.com/*
// @match        *://detail.tmall.com/*
// @match        *://detail.tmall.hk/*
// @match        *://item.yiyaojd.com/*
// @match        *://item.jd.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/449625/%E4%BC%98%E6%83%A0%E5%88%B8%E5%87%80%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/449625/%E4%BC%98%E6%83%A0%E5%88%B8%E5%87%80%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {

    'use strict';

    GM_registerMenuCommand(`净化优惠券${GM_getValue('couponHide',1)?'✅':'❌'}`, () => couponSet());

    var couponSet = function (){

        GM_getValue('couponHide')?GM_setValue('couponHide',0):GM_setValue('couponHide',1);

        location.href=location.href;

    }

    var data = [
        {
            match:/https:\/\/item.taobao.com\/item\.htm/,
            domName:'#detail',
            domId:['J_Pinus_Enterprise_Module','detail', 'J_ZoomIcon', 'J_Social', 'J_Title', 'J_TEditItem', 'J_Report', 'J_Banner', 'J_Promo', 'J_PromoHd', 'J_PromoBd', 'J_StepPrice', 'J_logistic', 'J_LogisticInfo', 'J_WlServiceInfo', 'serviceFeeListInfo', 'J_WlServiceTitleMark', 'J_SepLine', 'J_isku', 'J_SureSKU', 'J_juValid', 'J_tbExtra', 'J_ShopInfo', 'J_Pine', 'J_PPayGuide', 'tad_head_area', 'tad_first_area', 'J_Tad'],
            domClass:['tb-rate-counter','loading','hidden','tb-detail-bd', 'tb-clear', 'tb-summary', 'tb-item-info', 'tb-item-info-l', 'tb-gallery', 'tb-booth', 'tb-pic', 'tb-main-pic', 'tb-video-mode', 'zoom-icon', 'tb-iconfont', 'tb-video', 'lib-video', 'vjs-has-started', 'vjs-center-poster', 'vjs-hidden', 'vjs-center-container', 'error-content', 'vjs-control-bar', '', 'progress-wrap', 'vjs-progress-bar', 'progress-bar-wrap', 'playback-rate-wrap', 'volume-wrap', 'volume-show', 'vjs-volume-bar', 'tb-s50', 'tb-social', 'tb-clearfix', 'tb-item-info-r', 'tb-property', 'tb-property-x', 'tb-wrap', 'tb-wrap-newshop', 'tb-title', 'tb-editor-menu', 'tb-report', 'tb-banner', 'tb-banner-in-promotion', 'J_BigProm', 'tb-big-prom', 'tb-property-cont', 'tb-promo-mod', 'tb-promo-hd', 'tb-promo-item', 'tb-promo-item-bd', 'tb-promo-item-ft', 'tb-promo-bd', 'tb-activity-price', 'tb-other-discount', 'tb-other-discount-content', 'J_coin', 'tb-other-discount-split', 'tb-coupon', 'tb-counter-bd', 'tb-sell-counter', 'post-script', 'tb-logistic', 'tb-logistic-info', 'wl-areainfo', 'clearfix', 'wl-serviceinfo', 'sep-line', 'tb-key', 'tb-key-sku', 'tb-skin', 'tb-sure', 'tb-msg', 'tb-hidden', 'tb-action', 'tb-btn-buy', 'tb-btn-add', 'tb-extra', 'tb-sidebar', 'tb-shop-info', 'tb-shop-info-gold-border', 'tb-shop-age', 'tb-shop-age-content', 'tb-shop-info-wrap', 'tb-shop-info-hd', 'tb-shop-name', 'tb-shop-rank', 'tb-rank-cap', 'tb-shop-seller', 'tb-shop-ww', 'tb-shop-icon', 'tb-shop-info-bd', 'tb-shop-rate', 'tb-shop-info-ft', 'tb-pine', 'tuijian-module', 'tuijian-module-detail-pine', 'tuijian-hd', 'tuijian-l', 'tuijian-r', 'refresh', 'tuijian-bd', 'tuijian-img',"pic-con",'tuijian-extra','tuijian-switch',"tb-tad-first-area","tb-tad-tabbar-inner-wrap","tb-selected-indicator","tb-tad-tabcon-inner-wrap","tad-tabcon-anchor","tb-tad-hidden"]

        },
        {
            match:/https:\/\/detail.tmall.com\/item.htm/,
            domName:'#detail',
            domId:['detail', 'J_DetailMeta', 'J_PostageToggleCont', 'friInfo', 'ald-skuRight'],
            domClass: ['tm-detail-meta', 'tm-clear', 'tb-property', 'tb-wrap', 'tb-detail-hd', 'tb-detail-sellpoint', 'tm-fcs-panel', 'tm-promo-price', 'tm-shopPromotion-title', 'tm-gold', '', 'tm-floater-Box', 'hidden', 'floater', 'fold', 'hd', 'ft', 'tb-meta', 'tb-postAge', 'tb-postAge-info', 'tm-indcon', 'tb-key', 'tb-skin', 'tb-sku', 'tb-prop', 'J_tmSaleTime', 'tb-action', 'tb-btn-buy', 'tb-btn-sku', 'tb-btn-basket', 'tb-btn-add', 'tb-hidden', 'tm-ser', 'tm-pay-box', 'tm-pay', 'pay-credit', 'J_Paylist', 'tb-gallery', 'tb-booth', 'tb-thumb-warp', 'tb-thumb-content', 'ald-skuRight', 'ald', 'ald-03054', 'ald-inner', 'ald-showTitle', 'ald-hd', 'ald-carousel', 'wrapCon', 'img']
        },
        {
            match:/https:\/\/detail.tmall.hk\/hk\/item.htm/,
            domName:'#detail',
            domId:['detail', 'J_DetailMeta', 'J_PostageToggleCont', 'friInfo', 'ald-skuRight'],
            domClass: ['tm-detail-meta', 'tm-clear', 'tb-property', 'tb-wrap', 'tb-detail-hd', 'fromName', 'tb-detail-sellpoint', 'tm-fcs-panel', 'tm-promo-price', 'tb-meta', 'tb-postAge', 'tb-postAge-info', 'signText', 'tm-indcon', 'tb-key', 'tb-skin', 'tb-sku', 'tb-prop', 'J_tmSaleTime', 'tb-action', 'tb-btn-buy', 'tb-btn-sku', 'tb-btn-basket', 'tb-btn-add', 'tb-hidden', 'tm-ser', 'tm-pay-box', 'tm-pay', 'pay-credit', 'J_Paylist', 'tb-gallery', 'tb-booth', 'tm-video-box', 'lib-video', 'vjs-has-started', 'vjs-center-poster', 'vjs-hidden', 'vjs-center-container', 'error-content', 'vjs-control-bar', '', 'progress-wrap', 'vjs-progress-bar', 'progress-bar-wrap', 'playback-rate-wrap', 'volume-wrap', 'volume-show', 'vjs-volume-bar', 'tb-thumb-warp', 'tb-thumb-content', 'ald-skuRight', 'ald', 'ald-03054', 'ald-inner', 'ald-hd', 'ald-carousel', 'wrapCon', 'img']
        },
         {
            match:/https:\/\/chaoshi.detail.tmall.com\/item.htm/,
            domName:'#detail',
            domId:['detail', 'J_DetailMeta', 'J_PostageToggleCont', 'friInfo', 'ald-skuRight'],
            domClass: ['tm-detail-meta', 'tm-clear', 'tb-property', 'tb-wrap', 'tb-detail-hd', 'tb-detail-sellpoint', 'tm-fcs-panel', 'tm-promo-price', 'tb-meta', 'tb-postAge', 'tb-postAge-info', 'tm-indcon', 'tb-key', 'tb-skin', 'tb-sku', 'tb-prop', 'J_tmSaleTime', 'tb-action', 'tb-btn-buy', 'tb-btn-sku', 'tb-hidden', 'tb-btn-basket', 'tm-chaoshi-add', 'tb-btn-add', 'tm-ser', 'tm-pay-box', 'tm-pay', 'pay-credit', 'J_Paylist', 'tb-gallery', 'tb-booth', 'tm-video-box', 'lib-video', 'vjs-has-started', 'vjs-center-poster', 'vjs-hidden', 'vjs-center-container', 'error-content', 'vjs-control-bar', '', 'progress-wrap', 'vjs-progress-bar', 'progress-bar-wrap', 'playback-rate-wrap', 'volume-wrap', 'volume-show', 'vjs-volume-bar', 'tb-thumb-warp', 'tb-thumb-content', 'ald-skuRight', 'ald', 'ald-03054']
         },
        {
            match:/https:\/\/item.jd.com/,
            domName:'.product-intro',
            domId:['J_atmosphere_banner','preview', 'spec-n1', 'belt', 'v-video', 'spec-list', 'p-ad', 'p-ad-phone', 'banner-miaosha', 'comment-count', 'summary-quan', 'J-summary-top', 'summary-promotion', 'summary-support', 'area1', 'store-prompt', 'ns_services', 'J_LogisticsService', 'summary-supply', 'summary-service', 'summary-weight', 'J_SelfAssuredPurchase', 'choose-attrs', 'choose-attr-1', 'choose-results', 'choose-luodipei', 'choose-suits', 'choose-gift', 'choose-serviceyc', 'choose-service', 'choose-service+', 'choose-baitiao', 'choose-jincai', 'choose-btns', 'local-tips', 'summary-tips', 'track','banner-shangou','choose-attr-2'],
            domClass:['product-intro', 'clearfix', 'preview-wrap', 'preview', 'jqzoom', 'main-img', 'video', 'J-v-player', 'spec-list', 'spec-items', 'preview-info', 'left-btns', 'right-btns', 'itemInfo-wrap', 'sku-name', 'news', 'item', 'hide', 'activity-banner', '', 'J-seckill', 'seckilling', 'activity-type', 'activity-price', 'activity-message', 'summary', 'summary-first', 'summary-price-wrap', 'summary-price', 'J-summary-price', 'dt', 'dd', 'fans-price', 'J-fans-price', 'plus-price', 'J-plus-price', 'firm-price', 'J-firm-price', 'meet-price', 'J-meet-price', 'user-price', 'J-user-price', 'summary-info', 'J-summary-info', 'comment-count', 'fl', 'li', 'p-choose', 'summary-top', 'summary-promotion', 'J-prom-wrap', 'p-promotions-wrap', 'p-promotions', 'J-prom-gift', 'prom-gifts', 'prom-gift-list', 'prom-gift-item', 'J-gift-limit', 'gift-limit', 'J-prom', 'prom-item', 'J-prom-more', 'view-all-promotions', 'p-choose-wrap', 'summary-stock', 'store', 'stock-address', 'ui-area-wrap', 'ui-area-oversea-mode', 'ui-area-text-wrap', 'ui-area-text', 'ui-area-content-wrap', 'ui-area-w-max', 'ui-area-tab', 'ui-area-content', 'ui-switchable-panel', 'ui-switchable-panel-selected', 'store-prompt', 'J-promise-icon', 'promise-icon', 'promise-icon-more', 'services', 'J-dcashDesc', 'dcashDesc', 'SelfAssuredPurchase', 'summary-service', 'summary-line', 'selected', 'choose-luodipei', 'choose-suits', 'choose-gift', 'gift', 'J-gift', 'J-gift-selected', 'choosed', 'J-gift-choosed', 'choose-btns', 'choose-amount', 'wrap-input', 'summary-tips',"track","extra-trigger","extra","track-tit","track-con","track-more",'title', 'icon-list', 'choose-baitiao', 'choose-jincai', 'brand-logo', 'z-has-more-promotion', 'icon-wl', 'services--more', 'service-type-yb', 'after', 'service-tips', 'content', 'service-wrap','jincai-list','J-jincai-list', 'bt-info-tips', 'J-more-prom-ins', 'yb-item-cat', 'tips', 'service', 'baitiao-list', 'baitiao-text-wrap','more-prom-ins', 'yb-item', 'more-item','sprite-arrow', 'service__head', 'service__body', 'J-baitiao-list', 'baitiao-text','baitiao-tips', 'J-baitiao-text','purchase-op', 'icon-SelfAssuredPurchase', 'promises']

        },
        {
            match:/https:\/\/item.yiyaojd.com/,
            domName:'.product-intro',
            domId:['preview', 'spec-n1', 'belt', 'v-video', 'spec-list', 'p-ad', 'p-ad-phone', 'banner-miaosha', 'comment-count', 'summary-quan', 'J-summary-top', 'summary-promotion', 'summary-support', 'area1', 'store-prompt', 'ns_services', 'J_LogisticsService', 'summary-supply', 'summary-service', 'summary-weight', 'J_SelfAssuredPurchase', 'choose-attrs', 'choose-attr-1', 'choose-results', 'choose-luodipei', 'choose-suits', 'choose-gift', 'choose-serviceyc', 'choose-service', 'choose-service+', 'choose-baitiao', 'choose-jincai', 'choose-btns', 'local-tips', 'summary-tips', 'track'],
            domClass:['product-intro', 'clearfix', 'preview-wrap', 'preview', 'jqzoom', 'main-img', 'video', 'J-v-player', 'spec-list', 'spec-items', 'preview-info', 'left-btns', 'right-btns', 'itemInfo-wrap', 'sku-name', 'news', 'item', 'hide', 'activity-banner', '', 'J-seckill', 'seckilling', 'activity-type', 'activity-price', 'activity-message', 'summary', 'summary-first', 'summary-price-wrap', 'summary-price', 'J-summary-price', 'dt', 'dd', 'fans-price', 'J-fans-price', 'plus-price', 'J-plus-price', 'firm-price', 'J-firm-price', 'meet-price', 'J-meet-price', 'user-price', 'J-user-price', 'summary-info', 'J-summary-info', 'comment-count', 'fl', 'li', 'p-choose', 'summary-top', 'z-has-more-promotion', 'summary-promotion', 'J-prom-wrap', 'p-promotions-wrap', 'p-promotions', 'J-prom', 'prom-item', 'J-more-prom-ins', 'more-prom-ins', 'J-prom-more', 'view-all-promotions', 'p-choose-wrap', 'summary-stock', 'store', 'stock-address', 'ui-area-wrap', 'ui-area-oversea-mode', 'ui-area-text-wrap', 'ui-area-text', 'ui-area-content-wrap', 'ui-area-w-max', 'ui-area-tab', 'ui-area-content', 'ui-switchable-panel', 'ui-switchable-panel-selected', 'store-prompt', 'J-promise-icon', 'promise-icon', 'promise-icon-more', 'services', 'J-dcashDesc', 'dcashDesc', 'SelfAssuredPurchase', 'icon-wl', 'summary-service', 'summary-line', 'selected', 'choose-luodipei', 'choose-suits', 'choose-gift', 'gift', 'J-gift', 'J-gift-selected', 'choosed', 'J-gift-choosed', 'choose-baitiao', 'baitiao-list', 'J-baitiao-list', 'baitiao-tips', 'bt-info-tips', 'baitiao-text-wrap',"baitiao-text","J-baitiao-text","choose-jincai","jincai-list","J-jincai-list","choose-btns","choose-amount","wrap-input","summary-tips","track","extra-trigger","extra","track-tit","track-con","track-more"]
        }
    ];

    var divIdName=[];

    var getDivId = function(dom){

        for(let i=0;i<dom.length;i++){

            let domId = dom[i].getAttribute('id');

            if(domId){

                if(divIdName.indexOf(domId) == -1){

                    divIdName.push(domId);
                }

                let a = dom[i].querySelectorAll('div');

                if(a.length>0){

                    getDivId(a);
                }

            }else{

                let a = dom[i].querySelectorAll('div');

                if(a.length>0){

                    getDivId(a);
                }
            }

        }

    }

    var divClassName = [];

    var getDivClass=function(dom){

        for(let i=0;i<dom.length;i++){

            let domClass = dom[i].getAttribute('class');

            if(domClass){

                let classArr = domClass.split(' ');

                for(let n=0;n<classArr.length;n++){

                    if(divClassName.indexOf(classArr[n]) == -1){

                        divClassName.push(classArr[n]);
                    }
                }

                let a = dom[i].querySelectorAll('div');

                if(a.length>0){

                    getDivClass(a);
                }

            }else{

                let a = dom[i].querySelectorAll('div');

                if(a.length>0){

                    getDivClass(a);

                }

            }

        }

    }

    var getStyleElement = function(style){

        let str = style.replace(/^\s*|\s*$/g,"");

        let reg = /([^?;+#]+):([^?;+#]+)/g;

        let obj=[];

        str.replace(reg,(res,$1,$2)=>{obj.push($1)});

        return obj;

    }

    var divStyleName=[];

    var domStyleArr=['display','position','background','width','height','top','left','z-index','overflow','visibility'];

    var getDivStyle = function(dom){

        for(let i=0;i<dom.length;i++){

            let domStyle = dom[i].getAttribute('style');

            if(dom[i].style.display.trim() == 'none' || dom[i].style.visibility.trim() =='hidden'){

                continue;
            }

            if(domStyle){

                let style = getStyleElement(domStyle);

                for(let n=0;n<style.length;n++){

                    if(domStyleArr.indexOf(style[n].trim()) == -1){

                        dom[i].parentNode.removeChild(dom[i]);

                        break;

                    }

                }

                let a = dom[i].querySelectorAll('div');

                if(a.length>0){

                    getDivStyle(a);
                }

            }else{

                let a = dom[i].querySelectorAll('div');

                if(a.length>0){

                    getDivStyle(a);

                }
            }

        }

    }

    var getUrlParams = function(url){
        let reg = /([^?&+#]+)=([^?&+#]+)/g;
        let obj={};
        url.replace(reg,(res,$1,$2)=>{obj[$1]=$2});
        return obj;
    }

    var getQueryString = function(e) {
        var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)");
        var a = window.location.search.substr(1).match(t);
        if (a != null) return a[2];
        return "";
    }

    var dome = [];

    if(GM_getValue('couponHide',1)){

        for(let i=0;i<data.length;i++){

            if(location.href.match(data[i].match)){

                let dom = document.querySelectorAll(data[i].domName);

                let numTime = 0;

                let getTimer = setInterval(function(){

                    if(numTime++<30){

                        getDivId(dom);

                        for(let n=0;n<divIdName.length;n++){

                            if(data[i].domId.indexOf(divIdName[n]) == -1){

                                let idDom = document.getElementById(divIdName[n]);

                                if(idDom){

                                    idDom.parentNode.removeChild(idDom);
                                }
                            }

                        }

                        getDivClass(dom);

                        for(let m=0;m<divClassName.length;m++){

                            if(data[i].domClass.indexOf(divClassName[m]) == -1){

                                let classDom = document.querySelectorAll('.'+divClassName[m]);

                                if(classDom.length>0){

                                    for(let n=0;n<classDom.length;n++){
                                        dome.push(divClassName[m]);
                                        classDom[n].parentNode.removeChild(classDom[n]);

                                    }

                                }
                            }

                        }

                        getDivStyle(dom);

                    }else{

                        clearInterval(getTimer);
                    }

                },100);
            }
        }

    }

    setTimeout(function(){
        console.log(dome);
    },6000)

    if(GM_getValue('couponHide',1) && location.href.match(/https?:\/\/item.jd.com/)){

        let dom = document.querySelectorAll('.btn-special1');

        if(dom.length>0){

            let exceptionText = ['查询优惠券'];

            for(let i=0;i<dom.length;i++){

                if(exceptionText.indexOf(dom[i].innerText) != -1){

                    dom[i].parentNode.removeChild(dom[i]);

                }

            }

        }

    }


})();