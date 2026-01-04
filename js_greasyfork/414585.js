// ==UserScript==
// @name         东方第二组
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       有一科技 微信hury88
// @match        *://quote.eastmoney.com/zs000905.html?mine2
// @match        *://finance.eastmoney.com/yaowen.html
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.min.js

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414585/%E4%B8%9C%E6%96%B9%E7%AC%AC%E4%BA%8C%E7%BB%84.user.js
// @updateURL https://update.greasyfork.org/scripts/414585/%E4%B8%9C%E6%96%B9%E7%AC%AC%E4%BA%8C%E7%BB%84.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var url = window.location.href;
    if(url.indexOf("zs000905.html?mine") >= 0 ) { //判断url地址中是否包含link字符串
        //$(document.body).find(".qphox ").hide();
        $(document.body).empty();

        //引入layer弹窗css
        $(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.min.css" rel="stylesheet">`)

    } else {

        //引入layer弹窗css
        $(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.min.css" rel="stylesheet">`)
        layer.open({
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            area: ['150px', '100px'], //宽高
            title: "有一科技提示",
            closeBtn: 0,
            shade: 0,
            offset: 'lt',
            content: '<button style="margin-left:20%" class="layui-btn"><a target="_blank" href="http://quote.eastmoney.com/zs000905.html?mine">点击查看简约股指</a></button>'
        });
        /*
        layer.alert('点击查看简约股指', {
            //skin: 'layui-layer-molv' //样式类名
            title: "有一科技提示",
            closeBtn: 0,
            shade: 0,
            offset: 'lt',
        }, function(){
            window.location.href = "https://quote.eastmoney.com/youyi.html";
        });
        */

        return;
    }

    /*
// @require      https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.19/lodash.js
// @require      https://cdn.bootcdn.net/ajax/libs/mobx/5.15.5/mobx.umd.js
// @require      https://cdn.bootcdn.net/ajax/libs/dayjs/1.8.32/dayjs.min.js
    */


    getpage("上证指数 000001", "zs000001", "l");
    getpage("深证成指 399001", "zs399001", "auto");
    getpage("创业板指 399006", "zs399006", "r");
    var index = layer.load(2, {
        time:10000,
        title:"初始化中",
        shade: [0.5,'#000'] //0.1透明度的白色背景
    });
    function getpage(title, link, left) {


        layer.open({
            type: 2,
            title: title,
            //shadeClose: true,
            shade: 0,
            resize: true,
            offset: left,
            area: ['600px', '1000px'],
            //btn: ['按钮一', '按钮二', '按钮三'],
            yes:function(index, layero){
                var body = layer.getChildFrame('body', index);
                //var iframeWin = window[layero.find('iframe')[0]['name']].contentWindow; //得到iframe页的窗口对象，执行iframe页的方法：
                var thewindow = $(layero).find('iframe')[0].contentWindow;
                console.log($(thewindow))
                alert($(thewindow).find("#js_box").html());
            },
            content: 'http://quote.eastmoney.com/'+link+'.html#fullScreenChart', //iframe的url
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();比如iframeWin.alert11();
                //console.log(body.html()) //得到iframe页的body内容
                //body.prepend("<style>.qphox{display:none}</style>")
                var echart = body.find('#js_box');
                body.find(".top-nav-wrap").hide()

                //echart.parents(".qphox").siblings().hide();
                var w578 = echart.parents(".w578");
                w578.siblings().hide();
                w578.find("#luyangg").hide();
                w578.find(".gszb").hide();

                echart.parents(".fr.w790").css("float", "left").siblings().hide();

                //全屏iframe
                var fullscreen = body.find('.full-box iframe')[0].contentWindow.document;
                $(fullscreen).find("#timechartbox").css("width", "594px");


            }
        });
    }
    return;


    let div = document.createElement('div');


    div.innerHTML = `

<link type="text/css" href="http://www.layuicdn.com/layui/css/layui.css" />

<style>
//#iframe200,#iframe300,#frame905 {width:300px; height:1000px;float:left}
//#flow-ad-4376{display:none}
</style>

<iframe id="iframe200" style="width:400px; height:1000px;float:left" src="http://quote.eastmoney.com/zs000905.html" frameborder="0"></iframe>
<iframe id="frame300" style="width:400px; height:1000px;float:left" src="http://quote.eastmoney.com/zs000300.html" frameborder="0"></iframe>
<iframe id="frame905" style="width:400px; height:1000px;float:left" src="http://quote.eastmoney.com/zs000905.html" frameborder="0"></iframe>

`;
    $("html").html(div)
    //document.body.appendChild(div);


   setTimeout(function(){



       //alert($("#frame300").contents().find("#js_box").html());
       var frame200 = $("#frame200").contents();
       var frame300 = $("#frame300").contents();
       var frame905 = $("#frame905").contents();
       frame200.find("body").html(frame200.find("#js_box").html());
        frame300.find("body").html(frame300.find("#js_box").html());
       frame905.find("body").html(frame905.find("#js_box").html());
       //frame905.html(frame905.find("#js_box").html());

        $("html").append($("#frame300").contents().find("#js_box").html());
        // $("body").append($("#frame905").contents().find("#js_box").html());

   }, 5000)
})();