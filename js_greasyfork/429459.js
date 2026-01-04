// ==UserScript==
// @name         广东省财政电子票据公共服务平台 电子票号查验助手
// @namespace      https://greasyfork.org/users/3128
// @version      0.2
// @description    添加文本框用于自动填充信息内容
// @author       You
// @match        http://dzpj.czt.gd.gov.cn/billcheck/html/index.html

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant          GM_setClipboard
// @grant          GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/429459/%E5%B9%BF%E4%B8%9C%E7%9C%81%E8%B4%A2%E6%94%BF%E7%94%B5%E5%AD%90%E7%A5%A8%E6%8D%AE%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%20%E7%94%B5%E5%AD%90%E7%A5%A8%E5%8F%B7%E6%9F%A5%E9%AA%8C%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/429459/%E5%B9%BF%E4%B8%9C%E7%9C%81%E8%B4%A2%E6%94%BF%E7%94%B5%E5%AD%90%E7%A5%A8%E6%8D%AE%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%20%E7%94%B5%E5%AD%90%E7%A5%A8%E5%8F%B7%E6%9F%A5%E9%AA%8C%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let u=unsafeWindow,
        $=u.$,
        webHost=location.host.toLowerCase(),
        webPath=location.pathname.toLowerCase();

    GM_addStyle('.nsn{width:500px;height:100px;background:#ccc;padding:2px;} .find{min-height:700px!important;}');

    $('<textarea class="nsn">').attr({'placeholder':'把短信息文本粘贴至此处，自动提取文本内容填充到对应的文本框'}).appendTo('.findForm').on({
        'change': function(){
            let txt=$(this).val(),
                name=txt.match(/向 ([^ ]+) 开具/)[1],
                pjCode=txt.match(/票据代码(\w+)/)[1],
                pjNumber=txt.match(/票据号码(\w+)/)[1],
                pjCRC=txt.match(/校验码(\w+)/)[1];
            $('#pay_name').val(name);
            $('#daima').val(pjCode);
            $('#num').val(pjNumber);
            $('#jym').val(pjCRC);
            $('#code').focus();

        },
        'blur': function(){
        $(this).val('');
        },
        'focus': function(){
            $('#pay_name').val('');
            $('#daima').val('');
            $('#num').val('');
            $('#jym').val('');
        }
    });

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