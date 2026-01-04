// ==UserScript==
// @name         Baidu+
// @description  给百度搜索引擎的结果页加入头条、哔哩哔哩、软件、网盘搜索按钮，一键跳转到磁力、种子、网盘、软件、头条、哔哩哔哩、Google搜索进行相同关键词的检索；在google搜索结果页添加百度搜索按钮，一键跳转到百度搜索进行相同关键词的检索。支持去除百度结果页面的广告和右边栏。
// @icon         https://www.baidu.com/cache/icon/favicon.ico
// @version      1.0
// @author       cc
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
// @note         2020.2.22 V1.0 在百度搜索的结果页加入磁力、种子、网盘、Google搜索按钮；
// @note         2020.2.23 V1.1 在google搜索的结果页加入百度搜索按钮；
// @note         2020.2.25 V1.2 增加软件搜索、增加头条搜索、哔哩哔哩搜索；
// @note         2020.2.26 V1.3 重写代码，将种子搜索、磁力搜索集成到网盘搜索中、同时软件搜索增加多个搜索网址；
// @note         2020.2.27 V1.4 今日头条和bilibili集成到头条搜索中，知乎和CSDN集成到问答搜索中；
// @namespace https://greasyfork.org/zh-CN/scripts/396960
// @downloadURL https://update.greasyfork.org/scripts/403149/Baidu%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/403149/Baidu%2B.meta.js
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
            $('.s_btn_wr,#s_btn_wr').after('<input type="button" id="google" value="谷歌" class="btn self-btn bg" style="float:right; font-size:14px; text-align:center; text-decoration:none; width:50px; height:33px; line-height:33px; margin-left:5px;-webkit-appearance:none;-webkit-border-radius:0;border: 0;color:#fff;letter-spacing:1px;background:#CC3333;border-bottom:1px solid #CC0033;outline:medium;" onmouseover="this.style.background=\'#CC0033\'" onmouseout="this.style.background=\'#CC3333\'">')
            $("#google").click(function(){
            window.open('https://www.google.com/ncr?gws_rd=ssl#newwindow=1&q=' + encodeURIComponent($('#kw').val()));
            }) // 结束

            //添加头条搜索按钮
            $('.s_btn_wr,#s_btn_wr').after('<input type="button" id="toutiao_bilibili" value="头条" class="btn self-btn bg" style="float:right; font-size:14px; text-align:center; text-decoration:none; width:50px; height:33px; line-height:33px; margin-left:5px;-webkit-appearance:none;-webkit-border-radius:0;border: 0;color:#fff;letter-spacing:1px;background:#FF9966; border-bottom:1px solid #FF9900; outline:medium;" onmouseover="this.style.background=\'#FF9933\'" onmouseout="this.style.background=\'#FF9966\'">')
            $("#toutiao_bilibili").click(function(){
            window.open('https://www.toutiao.com/search/?keyword=' + encodeURIComponent($('#kw').val()));
            }) // 结束

            //添加B站搜索按钮
            $('.s_btn_wr,#s_btn_wr').after('<input type="button" id="zhihu_CSDN" value="B站" class="btn self-btn bg" style="float:right; font-size:14px; text-align:center; text-decoration:none; width:50px; height:33px; line-height:33px; margin-left:5px;-webkit-appearance:none;-webkit-border-radius:0;border: 0;color:#fff;letter-spacing:1px; background:#d14d94; border-bottom:1px solid #d14d94; outline:medium;" onmouseover="this.style.background=\'#d14d94\'" onmouseout="this.style.background=\'#DB7093\'">')
            $("#zhihu_CSDN").click(function(){
            window.open('https://search.bilibili.com/all?keyword=' + encodeURIComponent($('#kw').val()));
            }) // 结束

      	    //添加知乎搜索按钮
            $('.s_btn_wr,#s_btn_wr').after('<input type="button" id="zhihu_CSDN" value="知乎" class="btn self-btn bg" style="float:right; font-size:14px; text-align:center; text-decoration:none; width:50px; height:33px; line-height:33px; margin-left:5px;-webkit-appearance:none;-webkit-border-radius:0;border: 0;color:#fff;letter-spacing:1px; background:#66CC00; border-bottom:1px solid #00CC00; outline:medium;" onmouseover="this.style.background=\'#33CC00\'" onmouseout="this.style.background=\'#66CC00\'">')
            $("#zhihu_CSDN").click(function(){
            window.open('https://www.zhihu.com/search?type=content&q=' + encodeURIComponent($('#kw').val()));
            }) // 结束

			//添加博客园搜索按钮
            $('.s_btn_wr,#s_btn_wr').after('<input type="button" id="google" value="博客园" class="btn self-btn bg" style="float:right; font-size:14px; text-align:center; text-decoration:none; width:60px; height:33px; line-height:33px; margin-left:5px;-webkit-appearance:none;-webkit-border-radius:0;border: 0;color:#fff;letter-spacing:1px;background:#CC3333;border-bottom:1px solid #CC0033;outline:medium;" onmouseover="this.style.background=\'#CC0033\'" onmouseout="this.style.background=\'#CC3333\'">')
            $("#google").click(function(){
            window.open("https://zzk.cnblogs.com/s?t=b&w=" + encodeURIComponent($('#kw').val()));
            }) // 结束

            //添加豆瓣搜索按钮
            $('.s_btn_wr,#s_btn_wr').after('<input type="button" id="toutiao_bilibili" value="豆瓣" class="btn self-btn bg" style="float:right; font-size:14px; text-align:center; text-decoration:none; width:50px; height:33px; line-height:33px; margin-left:5px;-webkit-appearance:none;-webkit-border-radius:0;border: 0;color:#fff;letter-spacing:1px;background:#FF9966; border-bottom:1px solid #FF9900; outline:medium;" onmouseover="this.style.background=\'#FF9933\'" onmouseout="this.style.background=\'#FF9966\'">')
            $("#toutiao_bilibili").click(function(){
            window.open('http://www.douban.com/search?source=suggest&q=' + encodeURIComponent($('#kw').val()));
            }) // 结束

            //添加有道词典搜索按钮
            $('.s_btn_wr,#s_btn_wr').after('<input type="button" id="zhihu_CSDN" value="有道" class="btn self-btn bg" style="float:right; font-size:14px; text-align:center; text-decoration:none; width:50px; height:33px; line-height:33px; margin-left:5px;-webkit-appearance:none;-webkit-border-radius:0;border: 0;color:#fff;letter-spacing:1px; background:#d14d94; border-bottom:1px solid #d14d94; outline:medium;" onmouseover="this.style.background=\'#d14d94\'" onmouseout="this.style.background=\'#DB7093\'">')
            $("#zhihu_CSDN").click(function(){
            window.open('http://dict.youdao.com/search?q=' + encodeURIComponent($('#kw').val()));
            }) // 结束

      	    //添加微信搜索按钮
            $('.s_btn_wr,#s_btn_wr').after('<input type="button" id="zhihu_CSDN" value="微信" class="btn self-btn bg" style="float:right; font-size:14px; text-align:center; text-decoration:none; width:50px; height:33px; line-height:33px; margin-left:5px;-webkit-appearance:none;-webkit-border-radius:0;border: 0;color:#fff;letter-spacing:1px; background:#66CC00; border-bottom:1px solid #00CC00; outline:medium;" onmouseover="this.style.background=\'#33CC00\'" onmouseout="this.style.background=\'#66CC00\'">')
            $("#zhihu_CSDN").click(function(){
            window.open('https://weixin.sogou.com/weixin?type=2&query=' + encodeURIComponent($('#kw').val()));
            }) // 结束
            function del_delayed_ads(){
                $('.c-container').has('.f13>span:contains("广告")').remove();
            }
            setTimeout(function () { del_delayed_ads(); }, 2100); // 去除顽固性的延迟加载广告，一般延迟2秒左右。例如搜索“淘宝”，当页面加载完毕之后在搜索结果最前或最后会再插入一个广告。
            }

            } // 百度上添加其他搜索结束

    else if(hostname.match(RegExp(/google.com/))){
        //Google上添加百度搜索
        document.addEventListener ("DOMContentLoaded", show_button_google);
        function show_button_google () {
            var url_baidu = "https://www.baidu.com/s?wd=" + encodeURIComponent($(".gLFyf.gsfi:first").val()) + "&from=TsingScript";
            $(".RNNXgb:first").append('<div style="display:inline-block; height:100%; width:0px; box-sizing: border-box; border-radius:30px;"><button id="google++" type="button" style="height:100%; width:100%; border:none; outline:none; border-radius:30px; font-size:15px; cursor:pointer; display:block; float:left; font-size:14px; text-align:center; text-decoration:none; width:100px;  margin-left:30px; color:#fff; letter-spacing:1px; background:#3385ff; " onclick="window.open(\''+ url_baidu + '\')" title="使用百度搜索引擎检索该关键词">百度一下</button></div>');
            $(".gLFyf.gsfi:first").change(function(){
                var url_baidu_new = "https://www.baidu.com/s?wd=" + encodeURIComponent($(".gLFyf.gsfi:first").val()) + "&from=TsingScript";
                $("#google++").attr('onclick','window.open("'+ url_baidu_new + '")');
             });
           }
          } // 结束

    GM_registerMenuCommand ("欢迎提出建议和意见", menu_func, ""); // 注册脚本的菜单选项
    function menu_func () {
        window.open("https://greasyfork.org/zh-CN/scripts/396960/feedback");
    }

    console.log("%cThanks for using baidu++ script, enjoy your time here."," font-size:14px; background:#444; border-radius:3px; padding:2px 5px; color:#ffff66; margin:10px 0;","--by ddrwin");

})();