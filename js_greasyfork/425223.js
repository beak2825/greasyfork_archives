// ==UserScript==
// @name         baidu&google：为百度搜索结果页添加Google搜索按钮，为Google添加百度搜索按钮
// @description  为百度搜索结果页添加Google搜索按钮，为Google添加百度搜索按钮
// @icon         https://www.baidu.com/cache/icon/favicon.ico
// @version      1.1
// @author       Soul
// @run-at       document-start
// @include      http*://*baidu.com/s*
// @include      http*://*baidu.com/baidu*
// @include      *://www.google.com/search?*
// @include      *://www.google.com.*/search?*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @note         原脚本因账号丢失弃用，现在再此连接下更新；

// @namespace https://greasyfork.org/users/308136
// @downloadURL https://update.greasyfork.org/scripts/425223/baidugoogle%EF%BC%9A%E4%B8%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5%E6%B7%BB%E5%8A%A0Google%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE%EF%BC%8C%E4%B8%BAGoogle%E6%B7%BB%E5%8A%A0%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/425223/baidugoogle%EF%BC%9A%E4%B8%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5%E6%B7%BB%E5%8A%A0Google%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE%EF%BC%8C%E4%B8%BAGoogle%E6%B7%BB%E5%8A%A0%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var hostname = window.location.hostname;

    if(hostname.match(RegExp(/baidu.com/))){
        // 去除一些无用的百度广告
        var style_tag_baidu = document.createElement('style');
        style_tag_baidu.innerHTML = '#content_right{display:none;}'; // 移除百度右侧栏
        document.head.appendChild(style_tag_baidu);
        document.addEventListener ("DOMContentLoaded",show_button_baidu); 
        $('#content_left>div').has('span:contains("广告")').remove();// 去除常规广告
        
        // 在百度结果首页开始添加按钮
        function show_button_baidu () {
		
            //添加Google搜索按钮
            $('.s_btn_wr,#s_btn_wr').after('<input type="button" id="google" value="Google搜索" class="btn self-btn bg" style="float:right; font-size:14px; text-align:center; text-decoration:none; width:112px; height:40px; border-radius:10px 10px; line-height:33px; margin-left:5px;-webkit-appearance:none;border: 0;color:#fff;letter-spacing:1px;background:#CC3333;border-bottom:1px solid #CC0033;outline:medium;" onmouseover="this.style.background=\'#CC0033\'" onmouseout="this.style.background=\'#CC3333\'">')
            $("#google").click(function(){
            window.open('https://www.google.com/search?q=' + encodeURIComponent($('#kw').val()));
            }) // 结束         
                          
		
            function del_delayed_ads(){
                $('.c-container').has('.f13>span:contains("广告")').remove();
            }
            setTimeout(function () { del_delayed_ads(); }, 2100); // 去除顽固性的延迟加载广告，一般延迟2秒左右。例如搜索“淘宝”，当页面加载完毕之后在搜索结果最前或最后会再插入一个广告。
        }
    }
    else if(hostname.match(RegExp(/google.com/))){
        //Google上添加百度搜索
        document.addEventListener ("DOMContentLoaded", show_button_google);
        function show_button_google () {
            const kvl =(location.search.substr(1).split('&'));
            var url_baidu = "https://www.baidu.com/s?wd=" +decodeURI(kvl[0].slice(2)) + "&from=TsingScript";
            $(".RNNXgb:first").append('<div style="display:inline-block; height:100%; width:0px; box-sizing: border-box; border-radius:30px;"><button id="google++" type="button" style="height:100%; width:100%; border:none; outline:none; border-radius:30px; font-size:15px; cursor:pointer; display:block; float:left; font-size:14px; text-align:center; text-decoration:none; width:100px;  margin-left:30px; color:#fff; letter-spacing:1px; background:#3385ff; " onclick="window.open(\''+ url_baidu + '\')" title="使用百度搜索引擎检索该关键词">百度一下</button></div>');
            $(".gLFyf.gsfi:first").change(function(){
                var url_baidu_new = "https://www.baidu.com/s?wd=" + decodeURI((kvl[0].slice(2))) + "&from=TsingScript";
                $("#google++").attr('onclick','window.open("'+ url_baidu_new + '")');
             });
           }
          } // 结束
})();