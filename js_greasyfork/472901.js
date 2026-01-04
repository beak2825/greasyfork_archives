
// ==UserScript==
// @name         知乎网站手机浏览器增强
// @namespace    https://kenjinghuizhao.github.io/S3-02-Dev/KenBrowser/KenBrowser_homepage.html
// @version      v3.0.0812
// @description  用手机浏览器看知乎网站有很多限制。可以在手机浏览器设置UserAgent为PC，模拟电脑端访问，然后此脚本可以让知乎电脑版的网页自适应手机屏幕宽度。
// @author       ken.jinghui.zhao
// @match        https://*.zhihu.com
// @icon
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472901/%E7%9F%A5%E4%B9%8E%E7%BD%91%E7%AB%99%E6%89%8B%E6%9C%BA%E6%B5%8F%E8%A7%88%E5%99%A8%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/472901/%E7%9F%A5%E4%B9%8E%E7%BD%91%E7%AB%99%E6%89%8B%E6%9C%BA%E6%B5%8F%E8%A7%88%E5%99%A8%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var display_width   = document.documentElement.clientWidth-10;
    var total_width     = display_width+300;
    var padding         = Math.round(display_width/120);
    var nod             = document.createElement('style');
    var str=
        'div.Topstory-container, \n'+               //知乎主页主框
        'div.Topstory-mainColumn, \n'+              //知乎主页左边文章列表框
        'div.Topstory-mainColumn img._1sezuny, \n'+ //知乎主页文章列表图片
        'div.Topstory-mainColumn video, \n'+        //知乎主页文章列表视频
        'div.QuestionHeader-main, \n'+              //知乎答案顶栏
        'div.Question-mainColumn, \n'+              //知乎答案左边文章内容
        'div.css-78p1r9, header.Post-Header, div.Post-RichTextContainer,\n'+ //知乎专栏文章
        'div.Post-Sub.Post-NormalSub>div, \n'+      //知乎专栏评论区
        'div.css-1cqr2ue, \n'+                      //知乎答案评论回复
        'div.Search-container, div.SearchMain \n'+  //知乎搜索结果列表
            '{width:' +display_width+ 'px !important;} \n'+

        'div.Topstory-container, \n'+               //知乎主页主框
        'div.Card.TopstoryItem.TopstoryItem-isRecommend, \n'+                //知乎主页文章列表卡片
        'div.Pc-feedAd-container, div.Pc-feedAd-card-content-detail, \n'+    //知乎主页广告卡片
        'div.QuestionHeader-main, \n'+              //知乎答案顶栏
        'div.Question-main, \n'+                    //知乎答案包括右边栏
        'div.QuestionAnswer-content, \n'+           //知乎答案页主答案
        'div.List-item, \n'+                        //知乎答案页后续答案
        'div.css-78p1r9, header.Post-Header, div.Post-RichTextContainer, \n'+ //知乎专栏
        'div.Search-container, div.List-item, ContentItem-actions \n'+        //知乎搜索结果列表
            '{padding-left:'  +padding+ 'px !important; \n'+
            ' padding-right:' +padding+ 'px !important; \n'+
            ' margin-left:2px !important; \n'+
            ' margin-right:0px !important;} \n'+

        'div.Pc-feedAd-card-content \n'+            //知乎主页广告外框
            '{flex-direction:column;} \n'+
        'div.Question-main \n'+                     //知乎答案包括右边栏
            '{width:' +total_width+ 'px;} \n'+
        'div.Post-content \n'+                      //知乎专栏?
            '{min-width:' +display_width+ 'px;} \n'+
        'div.RichContent-inner \n'+                 //知乎搜索结果
            '{overflow:hidden !important;} \n'+
        'Button.css-1x9te0t \n'+                    //知乎回答评论回复关闭按钮
            '{background:teal; right:8px; padding:0px} \n'
        ;
    nod.innerHTML=str;
    document.getElementsByTagName('head')[0].appendChild(nod);
    void(0);

})();
