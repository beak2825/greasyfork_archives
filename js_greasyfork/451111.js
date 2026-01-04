// ==UserScript==
// @name         百度谷歌便捷搜索跳转，聚合搜索
// @description  为百度搜索添加谷歌按钮，为谷歌添加百度按钮，可以携带搜索词自动跳转。
// @icon         https://www.baidu.com/cache/icon/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/scripts/451111
// @license	     MIT
// @version      0.1.0
// @author       crimson
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
// @note         代码是在这位大佬的基础上修改了一点点 https://greasyfork.org/zh-CN/scripts/396960，非常感谢这位大佬

// @downloadURL https://update.greasyfork.org/scripts/451111/%E7%99%BE%E5%BA%A6%E8%B0%B7%E6%AD%8C%E4%BE%BF%E6%8D%B7%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%EF%BC%8C%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/451111/%E7%99%BE%E5%BA%A6%E8%B0%B7%E6%AD%8C%E4%BE%BF%E6%8D%B7%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%EF%BC%8C%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hostname = window.location.hostname;

    if(hostname.match(RegExp(/baidu.com/))){

        // 在百度结果首页开始添加按钮
        function show_button_baidu () {
            //添加Google搜索按钮
            let baiduSearchDiv = $('.s_btn_wr,#s_btn_wr');
            baiduSearchDiv.css({ 'width': '60px'})
            $('#su').val('百度').css({'border-radius': '0 0 0 0', 'width': '60px'})
            baiduSearchDiv.after('<span class="bg s_btn_wr" style="width: 70px;"><input type="submit" style="width: 70px; color:#fff; background:#FF6461" id="google" value="Google" class="bg s_btn"></span>')

            $("#google").click(function(){
                 window.open('https://www.google.com/search?&q=' + encodeURIComponent($('#kw').val()).replace(/[!'()*]/g, escape));
            }) // 结束
        
       }
       document.addEventListener ("DOMContentLoaded",show_button_baidu); 

    } // 百度上添加其他搜索结束

    else if(hostname.match(RegExp(/google.com/))){
        //Google上添加百度搜索
        document.addEventListener ("DOMContentLoaded", show_button_google);
        function show_button_google () {
            let googleSearch = $(".gLFyf.gsfi[name=q]");
            $(".RNNXgb:first").append('<div style="display:inline-block; height:100%; width:0px; box-sizing: border-box; border-radius:30px;"><button id="baidu99" type="button" style="height:100%; width:100%; border:none; outline:none; border-radius:30px; font-size:15px; cursor:pointer; display:block; float:left; font-size:14px; text-align:center; text-decoration:none; width:50px;  margin-left:15px; color:#fff; letter-spacing:1px; background:#3385ff; "  title="使用百度搜索引擎检索该关键词">百度</button></div>');
            $("#baidu99").click(function() {
                window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(googleSearch.val()).replace(/[!'()*]/g, escape) + '&from=TsingScript');
            })
         }
    } // 结束

    GM_registerMenuCommand ("反馈", menu_func, ""); // 注册脚本的菜单选项
    function menu_func () {
        window.open("https://greasyfork.org/zh-CN/scripts/451111/feedback");
    }
})();