// ==UserScript==
// @name         屏蔽经纪人入口二维码,复制反屏蔽(失效)
// @namespace    https://greasyfork.org/users/184803
// @version      1.0.7
// @description  Auto display 58 Login form (失效)
// @author       PythonK
// @include      http*://*.58.com/ershoufang/*
// @exclude      http*://*.58.com/
// @exclude      http*://*.58.com/index.html
// @match        *://vip.58ganji.com/portal/login/*

// @grant GM_log
// @grant             GM_xmlhttpRequest
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_deleteValue
// @grant             GM_addStyle
// @grant             GM_registerMenuCommand
// @grant             GM_info
// @grant             GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/367713/%E5%B1%8F%E8%94%BD%E7%BB%8F%E7%BA%AA%E4%BA%BA%E5%85%A5%E5%8F%A3%E4%BA%8C%E7%BB%B4%E7%A0%81%2C%E5%A4%8D%E5%88%B6%E5%8F%8D%E5%B1%8F%E8%94%BD%28%E5%A4%B1%E6%95%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/367713/%E5%B1%8F%E8%94%BD%E7%BB%8F%E7%BA%AA%E4%BA%BA%E5%85%A5%E5%8F%A3%E4%BA%8C%E7%BB%B4%E7%A0%81%2C%E5%A4%8D%E5%88%B6%E5%8F%8D%E5%B1%8F%E8%94%BD%28%E5%A4%B1%E6%95%88%29.meta.js
// ==/UserScript==

(async () => {
})();

$(document).ready(function(){

    var flag = false; //列表时间读取开关
    var util = {};
    util.xhr = function (details) {
        util.debug('XHRURL: %o', details.url);
        return GM_xmlhttpRequest(details);
    };
    util.script = {};
    // 检查是否是压缩版本
    util.script.ismin = (function () {
        try {
            // 检查多余的空格或分号、布尔字面常量、未消除的死代码、if语句，判断是否是压缩后的代码
            var func = function () {
                return
                if (false) {
                    true;;
                }
            } + '';
            return !func.match(/return[\s\S]*if[\s\S]*\s\strue;;[\r\n\s]/);
        } catch (e) {
            console.log( e   );
            return true; // 不知道哪里出的问题，当作是压缩的比较安全
        }
    }());

    // 检查是否开启了调试
    util.script.isdebug = (function () {
        //return true;
        if (util.script.ismin) return false;
        return !!GM_getValue('debug', false);
    }());
    // 函数相关操作
    util.func = {};
    // 基本函数
    var noop = util.func.noop = function () { };
    // 打印调试信息
    util.debug = util.script.isdebug && console && console.log && console.log.bind(console) || util.func.noop;
    util.error = util.script.isdebug && console && console.error && console.error.bind(console) || util.func.noop;
    // 网络访问相关
    var network = {};
    network.get = function (url, callback) {
        util.xhr({
            method : "GET",
            headers: {// "Accept": "application/atom+xml,application/xml,text/xml",// "Accept": "application/json",
                "user-agent": "mozilla/4.0 (compatible)" } ,
            url : url,
            onload :function(response) {
                var data ;
                if (response.readyState === 4) {
                    if (response.status === 200) {
                        datax = $(response.responseText).find('.house-update-info span.up:eq(0)').text() ;
                        //GM_log(  url + datax );
                        callback (datax);
                    } else {
                        console.error(response.statusText);
                    }
                }
            }
        });
    };
    if ((window.location.href).indexOf("xf.58.com/ershoufang") > 0 ) {
        var dataR = '1';
        $(".house-list-wrap li").each(function(i){
            //$(".house-list-wrap li:first div:first").attr('class')
            //$(".house-list-wrap li:first").attr("logr")
            if($("div:first",this).attr("class") == 'pic'){
                var logr = $(this).attr('logr'); isbn = logr.substr(19,14);
                var url1 = $("div.list-info h2 a",this).attr('href');
                var _pos = $(this).attr('_pos');
                var ds = $("div.list-info h2 a",this);
                if (flag){
                    network.get( url1,function ( xx ) { ds.text ( function(index, currentText){ return currentText + xx; }); } );
                }
            }

        });//each end

    }

    /*
    var ret = GM_xmlhttpRequest({
        method: "GET",
        url: "http://xf.58.com/ershoufang/33796928802636x.shtml",
        onload: function(response) { GM_log(  "test:"+$(response.responseText).find('.house-update-info span:eq(1)').text() );
        },
        onerror: function(res) {
            var msg = "An error occurred."
            + "\nresponseText: " + res.responseText
            + "\nreadyState: " + res.readyState
            + "\nresponseHeaders: " + res.responseHeaders
            + "\nstatus: " + res.status
            + "\nstatusText: " + res.statusText
            + "\nfinalUrl: " + res.finalUrl;
            GM_log(msg);
        }
    });

    if ((window.location.href).indexOf("x.shtml") > 0 ) {
        //获取网页标题
        $.ajax({
            "url":'http://xf.58.com/ershoufang/33860251471406x.shtml',
            method: "GET",
            success:function(e){
                var doc = document.implementation.createHTMLDocument("");
                doc.documentElement.innerHTML = e;
                document.title = $(doc).find('title').text();
            }
        });
    }*/
    
    //右键反屏蔽
    setTimeout(function () {
        //$(".general-desc").unbind("copy");$(".general-item").unbind("copy");
        $(".general-item").unbind();
    }, 1000);

   /*
    setInterval(function () {
        (function (a) {
            // $("#generalDesc").unbind("copy");
        })(123)
    }, 1000);
    setInterval(function(){
        //$("#generalDesc").unbind("copy");
        //alert('s啊');
        //$("#generalDesc").on("copy", function() { alert('s啊'); });
        $("#generalDesc").unbind('copy').bind('copy',function(){
             $("#generalDesc").unbind("copy");
         });
    }, 5000);*/
});

(function(){
    'use strict';
    //-------------------------经纪人登录
    var  content= document.querySelector('.login-mod-container');
    if(content){content.style.cssText = "display:block;";}

    var e = document.createEvent("MouseEvents");
    e.initEvent("click", true, true);
    content = document.querySelector("#login-mod-container > div > div.login-header > ul > li.switch-pwd.switch-default");
    if(content){  content.dispatchEvent(e);  }
    //-------------------------经纪人登录end

    var err;
    try {
        //电话
        $('.show-phone').click();
        $('.phone-belong a').css("font-size","16px");

        if(____json4fe._trackURL){
            var testJson = eval("(" + ____json4fe._trackURL + ")");
            testJson = jQuery.parseJSON(  JSON.stringify( testJson )  );
            console.log(testJson.product);//1085 楼层
            $(".mapNavIcon").append('                   推广方式  = >'+testJson.product)
        }

        $('.xiaoqu-desc').children("li:first").remove().children().appendTo('.house-basic-item3>li:first'); //小区均价移动到上部
        $('.xiaoqu-desc').children("li:last").remove().children().appendTo('.house-basic-item3>li:first') ;//小区在售 移动到上部
        $('.house-basic-item3 li:first span').removeClass('mr_25').removeClass('mr_20').addClass('mr_10'); //小区css 调整


        $(".agent-info a").on("mouseover",function(){
            var value = $(this).attr("href");
            console.log("我的value属性值为："+value);
        });

        $(document).on('mouseover','.agent-info a',function(){
            $(this).attr('href',____json4fe.shopUrl+'/house');
            var value = $(this).attr("href"); console.log("我的href为："+value);
        });

        $('.house-erweima').appendTo(".house-detail-right"); //手机二维码降到底部
        //小区环境移到右侧 $('#xiaoWrap').prependTo(".house-detail-right");
        $('.loan-purshasing-house ').remove();
        //document.querySelector('.txt_share_box').remove();
        //document.querySelector('.yc_con_l').style.width = '100%';
        //throw err = new Error( '用户自定义异常信息' );
    } catch( e ) {
        //console.log( e   );
    }
    //console.log( document.querySelector('#commonTopbar_appQR')   );
    //$('#commonTopbar_appQR').remove();
    //$('.Popover.TopstoryItem-rightButton').parentNode.remove();
})();