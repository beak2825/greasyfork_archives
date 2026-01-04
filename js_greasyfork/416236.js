// ==UserScript==
// @name         抓取公众号文章
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动抓取指定公众号文章并推送至指定服务器，推送参数为data数组格式
// @author       Mr.Zhao
// @match        https://mp.weixin.qq.com/cgi-bin/appmsg*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416236/%E6%8A%93%E5%8F%96%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/416236/%E6%8A%93%E5%8F%96%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*===================================抓取参数配置===========================================*/
    /*公众号标识*/var fakeid = "MzI2NzE2MzYwOQ==",/*公众号名称*/name="陕西西交康桥";
    /*抓取开始索引*/var begin=0,/*抓取条数*/app_msg_cnt=50,/*抓取间隔(毫秒)*/freq=2000;
    /*文章推送地址*/var APIHost = "http://test.kangqiao.org.cn/WXArticle/PostArticle";
    /*==================================抓取参数配置END==========================================*/






    var list = [];
    $(function(){
        $("#vue_app").append('<div class="weui-toptips weui-toptips_error errorMsg"><div class="weui-toptips__inner">准备抓取【'+name+'】公众号文章……<a id="start" onclick="window.start()">开始</a></div></div>');
    });
    window.start = function ()
    {
        $("#start").remove();
        $.get("https://mp.weixin.qq.com/cgi-bin/appmsg?action=list_ex&begin=0&count=5&fakeid="+fakeid+"&type=9&token="+getUrlParam("token"),function(result){
            debugger
            if(result.app_msg_cnt)
            {
                app_msg_cnt=app_msg_cnt||result.app_msg_cnt;
                GetWechatArticle();
            }
            else{
                $("#vue_app .errorMsg div").text('抓取频率限制，已停止抓取【'+name+'】公众号文章');
            }
        });
    }

    //获取微信文章
    function GetWechatArticle()
    {
        var getArticle = setInterval(function(){
            if(begin < app_msg_cnt)
            {
                $.get("https://mp.weixin.qq.com/cgi-bin/appmsg?action=list_ex&begin="+begin+"&count=5&fakeid="+fakeid+"&type=9&token="+getUrlParam("token")+"&lang=zh_CN&f=json&ajax=1",function(data){
                    if(data.app_msg_cnt)
                    {
                        list = list.concat(data.app_msg_list);
                        $("#vue_app .errorMsg div").text('已抓取'+begin+'/'+app_msg_cnt+'条');
                        begin=begin+5;
                        $.post(APIHost,{data:data.app_msg_list},function(data){
                            console.log(data);
                        });
                    }else{
                        $("#vue_app .errorMsg div").text('抓取频率限制，停止在第'+begin+'条');
                        clearInterval(getArticle);
                    }
                    console.log(list);
                });
            }
            else{
                clearInterval(getArticle);
            }
        },freq)
    }
    //获取url中的参数
    function getUrlParam(name) {
         var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
         var r = window.location.search.substr(1).match(reg);  //匹配目标参数
         if (r != null) return unescape(r[2]); return null; //返回参数值
    }
})();