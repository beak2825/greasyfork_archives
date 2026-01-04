// ==UserScript==
// @name         蓝墨云班课·教师工具箱
// @namespace      https://greasyfork.org/users/3128
// @version      0.1
// @description  try to take over the world!
// @author        极品小猫
// @match        https://www.mosoteach.cn/web/index.php?c=*
// @require      https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js

// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/420222/%E8%93%9D%E5%A2%A8%E4%BA%91%E7%8F%AD%E8%AF%BE%C2%B7%E6%95%99%E5%B8%88%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/420222/%E8%93%9D%E5%A2%A8%E4%BA%91%E7%8F%AD%E8%AF%BE%C2%B7%E6%95%99%E5%B8%88%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let u=unsafeWindow,
        webHost=location.host.toLowerCase(),
        webPath=location.pathname.toLowerCase(),
        webParamPage={
            c: getUrlParam('c'), //页面模板
            m: getUrlParam('m') //页面模板模式
        }

    switch(webParamPage.c) {
        case 'interaction_performance':
            if(webParamPage.m=='sign_in') {
                GM_addStyle('.get_no_sign{word-break:break-word;line-height:initial;width:250px;margin-right:20px} .ellipsis{;display:inline;padding:0px;} .ellipsis::after{content:", "}')
                $('.sign-in-record-item').each(function(){
                    let sign_edit_url=$(this).find('a.sign-in-time').attr('href');
                    let no_sign_btn=$('<div>').attr({'class':'get_no_sign'}).text('获取缺勤名单').click(function(){
                        $(this).load(sign_edit_url+' .no-sign-in-table .ellipsis:not(.color-grey)')
                    }).data('url', sign_edit_url);
                    $(this).find('.sign-in-time').after(no_sign_btn);
                });
                $('.sign-in-record').append($('<button>获取所有缺勤名单</button>').click(function(){
                    $('.get_no_sign').each(function(){
                        $(this).load($(this).data('url')+' .no-sign-in-table .ellipsis:not(.color-grey)');
                    })
                }))
            }
            break;
        default :
    }

    // Your code here...
    function getUrlParam(name, url, option, newVal) {//筛选参数，url 参数为数字时
        var search = url ? url.replace(/^.+\?/,'') : location.search;
        //网址传递的参数提取，如果传入了url参数则使用传入的参数，否则使用当前页面的网址参数
        var reg = new RegExp("(?:^|&)(" + name + ")=([^&]*)(?:&|$)", "i");		//正则筛选参数
        var str = search.replace(/^\?/,'').match(reg);

        if (str !== null) {
            switch(option) {
                case 0:
                    return unescape(str[0]);		//所筛选的完整参数串
                case 1:
                    return unescape(str[1]);		//所筛选的参数名
                case 2:
                    return unescape(str[2]);		//所筛选的参数值
                case 'new':
                    return url.replace(str[1]+'='+str[2], str[1]+'='+newVal);
                default:
                    return unescape(str[2]);        //默认返回参数值
            }
        } else {
            return null;
        }
    }
})();