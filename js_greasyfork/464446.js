// ==UserScript==
// @name         广告屏蔽:dytt8.net,dygod.net,jdwx.info,sogou.com,bing.com
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  学习一下油猴脚本的编写，去除电影天堂的漂浮广告
// @author       You
// @match        *://*.dytt8.net/*
// @match        *://*.ygdy8.net/*
// @match        *://*.ygdy8.com/*
// @match        *://*.dygod.net/*
// @match        *://*.jdwx.info/*
// @match        *://*.sogou.com/*
// @match        *://*.bing.com/*
// @match        *://*.baidu.com/*
// @match        *://*.sohu.com/*
// @match        *://*.csdn.net/*
// @match        *://*.163.com/*
// @match        *://*.csdn.net/*
// @match        *://*.hao123.com/*
// @match        *://*.hao123.baidu.com/*
// @match        *://*.elecfans.com/*
// @match        *://*.yiyouliao.com/*
// @match        *://*.bilibili.com/*

// @icon         https://is5-ssl.mzstatic.com/image/thumb/Purple114/v4/f0/59/37/f0593767-3694-6140-a140-94cea31a942c/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.webp
// @grant        none
// @run-at document-start
// @license      可以自由更改
// @downloadURL https://update.greasyfork.org/scripts/464446/%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%3Adytt8net%2Cdygodnet%2Cjdwxinfo%2Csogoucom%2Cbingcom.user.js
// @updateURL https://update.greasyfork.org/scripts/464446/%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%3Adytt8net%2Cdygodnet%2Cjdwxinfo%2Csogoucom%2Cbingcom.meta.js
// ==/UserScript==
(function(){
    //获取网址域名
    var domain=window.location.hostname.toLowerCase();
    var domains=domain.split('.');
    if (domains.length<2) return;
    domain='';
    for(var i=1;i<domains.length;i++)
    {
        domain=domain+"."+ domains[i];
    }
    //console.log(domain);
    //domain=domains[domains.length-2]+"."+domains[domains.length-1];
    var shuzu=Array();
    var obj;
    var tm=window.setInterval(preventAD, 1000);
    //根据不同的网址选择不同的元素消除
    function preventAD(){
        switch (domain)
        {
            case '.bilibili.com':
                shuzu=[['div.login-tip',0],['svg.bili-video-card__info--ad',6],['div.bili-mini-mask',0]];
                break;

            case '.sohu.com':
                shuzu=[['iframe',0],['div.god_header',0],['div.columnAd',0],['div.godR',0],['#sideAd4',2],['#columnAd7',0],
                    ['div.godA',0],['div.god-article-bottom',0],['div.comment',0],['#articleAllsee',0],['div.groom-read',0],
                    ['div.bottom-rec-box',0],['div.sidebar',0]];
                break;
            case '.163.com':
                shuzu=[['div.mod_js_ad',0],['div.second2016_top_ad',0]];
                break;
            case '.csdn.net':
                shuzu=[['#passportbox',0],['div.el-dialog__wrapper',0]];
                break;
            case '.jdwx.info':
                shuzu=[['iframe',0]];
                break;
            case '.baidu.com':
                shuzu=[['#content_right',0],['div._2z1q32z',0],['div[tpl="sp_hot_sale"]',0],['div.result[id="1"]',0],['div[id="s_wrap"]',0],['div.blank-frame',0],
                ['div[id="bottom"]',0],['div.ec_wise_ad',0],['span.c-color-source',8,'搜索智能聚合'],['div._6rgmX',9,'入手榜'],['div.single-text',8,'京东'],
                ['div.landrightbanner',0],['#aside-ad',0]];
                break;
            case '.hao123.baidu.com':
                shuzu=[['#BAIDU_SSP__wrapper_u3041224_0',0]];
                break;

            case '.sogou.com':
                shuzu=[['#promotion_adv_container',0],['#right',0]];
                break;
            case 'bing.com':
                shuzu=[['.b_ad',0],['#vs_cont',0]];
                break;
            case '.greasyfork.org':
                shuzu=[['#card',0]];
                break;
            case '.csdn.net':
                shuzu=[['ins.adsbygoogle',0]];
                break;
            case '.elecfans.com':
                shuzu=[['#f_bannerAd',0],['div.ysErCode',0],['#AD-background',0],['#new-middle-berry',0],
                ['body > section > div:nth-child(1)',0],['div.advertWrap',0],['#new-adsm-berry',0],
                ['#new-company-berry',0],['#new-course-berry',0],['#new-webinar-berry',0],['#IndexRightBottom',0]];
                break;
            case '.yiyouliao.com':
                shuzu=[['iframe',0],['div.yyl-weiruan-ads-main',0]];
                break;
            case '.hao123.com':
                shuzu=[['#topbeWrapper',0],['iframe',0],['#recommArticle',0]];
                break;
            default:
                //电影天堂
                shuzu=[['#ccc123',0],['.hmcakes11',0],['.bd4l',0],['#HMcoupletDivleft',0],['#HMcoupletDivright',0],['.bd6',0],['#HMRichBox',0]];


        }
        //times--;//计次30次则退出定时
        //var counter=shuzu.length;
        for(var i=0;i<shuzu.length;i++)
        {
            obj=document.querySelectorAll(shuzu[i][0]);
            var obj2;
            if(obj.length>0)
            {
                //循环遍历所有找到的元素
                for (var j=0;j<obj.length;j++)
                {
                    obj2=obj[j];
                    if(shuzu[i].length>2)
                    {
                        if(obj2.textContent!=shuzu[i][2]) continue;
                    }
                    //根据前面shuzu中的元素2确定需要向上找几层父元素
                    for (var k=0;k<shuzu[i][1];k++)
                    {
                        obj2=obj2.parentNode;
                    }
                    obj2.remove();
                }
                //counter--;
            }

        }
       // if(counter<=0 || times<=0)clearInterval(tm);
    }

})();

