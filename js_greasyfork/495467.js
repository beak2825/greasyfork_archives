// ==UserScript==
// @name         我的脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  测试的脚本描述
// @author       喜树
// @connect     www.lliuliangjia.com
// @match        https://www.baidu.com/
// @match        https://blog.csdn.net/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.js
// @resource     bootstrapCSS https://oss.ihzxy.com/program/web/css/bootstrap.css
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @license      我的license
// @downloadURL https://update.greasyfork.org/scripts/495467/%E6%88%91%E7%9A%84%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/495467/%E6%88%91%E7%9A%84%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    // 删除百度的新闻页面
    $('#s_main').remove();
    // GM_openInTab("https://www.bilibili.com/",{ active: true, setParent :true});

    // GM_setValue('safeIconHis','123123');
    // console.log(GM_getValue('BIDUPSID','1231'));
    // console.log("GM_listValues",GM_listValues())

    // 获取localstorage
    // console.log(localStorage.getItem('ai-bubble-options'));

    // 设置Cookies
    // document.cookie ="xishuaccesstoken=" +"123123"+";domain=.baidu.com; path=/";
    // console.log(document.cookie)

    // 剪切板
/*     GM_setClipboard('这些文本会被放入到剪切板之中')
    var pres = $('pre');
    pres.each(i => {
       $(pres[i]).prev().after('<p id="copy'+i+'" click="copy()">复制</p>');
       $('#copy'+i).on('click', function() {
           GM_setClipboard($(this).next().find('code').text())
       });
       console.log($(pres[i]).text())
    }) */

    // 添加样式
    //GM_addStyle('#su{background-color:black !important;}');
    //GM_addStyle(GM_getResourceText("bootstrapCSS"));
    //$('#su').removeClass().addClass('btn-warning btn');

    // 监听键盘输入
/*     document.addEventListener('keydown', function (event) {
        if (event.shiftKey && event.ctrlKey && event.key.toLowerCase() === 'x') {
            alert("按下了shift+ctrl+"+event.key.toLowerCase());
        }
    }); */

    // 监听请求
    // 拦截响应
/*     var originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        // 全部请求相关信息
        var self = this;

        // 监听readystatechange事件
        this.onreadystatechange = function() {
            // 当readyState变为4时获取响应
            if (self.readyState === 4) {
                // self 里面就是请求的全部信息
                //JSON.parse(self.response); //可以获取到返回的数据
                console.log(self.response);
            }
        };
        // 调用原始的send方法
        originalSend.apply(this, arguments);
    };
    XMLHttpRequest.prototype.open = function (method, url) {
        console.log(method)
        console.log(url)
        // 调用原始的open方法
        originalOpen.apply(this, arguments);
    }; */

    // 发送请求
/*      GM_xmlhttpRequest({
         method: "POST",
         url: "https://www.lliuliangjia.com:10001/index.ashx?type=XY.BPF.Service.GetOmsInventoryInfoService&code=M9QN7B006303",
         headers: {
             "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
         },
         onload: function(response){
             console.log("Ajax请求成功，响应为:", response.responseText);
         },
         onerror: function(response){
             console.log("请求失败");
         }
     }); */

})();
