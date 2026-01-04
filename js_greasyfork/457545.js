// ==UserScript==
// @name         JD京东评论增加查看原图按钮
// @name:zh      JD京东评论增加查看原图按钮
// @name:zh-CN   JD京东评论增加查看原图按钮
// @name:zh-TW   JD京东评论增加查看原图按钮
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  无任何不相关代码,就增加一个查看原图!健康绿色
// @description:zh      无任何不相关代码,就增加一个查看原图!健康绿色
// @description:zh-CN   无任何不相关代码,就增加一个查看原图!健康绿色
// @description:zh-TW   无任何不相关代码,就增加一个查看原图!健康绿色
// @author       You
// @match        https://*.jd.com/*
// @icon         https://www.jd.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457545/JD%E4%BA%AC%E4%B8%9C%E8%AF%84%E8%AE%BA%E5%A2%9E%E5%8A%A0%E6%9F%A5%E7%9C%8B%E5%8E%9F%E5%9B%BE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/457545/JD%E4%BA%AC%E4%B8%9C%E8%AF%84%E8%AE%BA%E5%A2%9E%E5%8A%A0%E6%9F%A5%E7%9C%8B%E5%8E%9F%E5%9B%BE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //console.log($().jquery)

    $(document).delegate(".J-thumb-img","click",function () {
        let $J_pic_view_wrap = $(this).parent().next();

        let original_src = $(this).find('img').attr('src');

        original_src = "https://img30.360buyimg.com/shaidan/s800x600"+original_src.substr(original_src.indexOf('_jfs/'));

        if($J_pic_view_wrap.attr("data-ind")==undefined)
        {
            setTimeout(function(){
              updateBtn($J_pic_view_wrap,original_src);
            },300);
        }
        else
        {
            updateBtn($J_pic_view_wrap,original_src);
        }
    })

    function updateBtn($view,imgsrc)
    {
       let $picop = $view.find('.pic-op');
       if($picop.children().length==2)
       {
           $picop.append('<a class="turn-left originalImg" target="_blank" href="'+imgsrc+'"><i></i>原图</a>')
       }
       else
       {
           $picop.find('.originalImg').attr('href',imgsrc)
       }
    }
})();