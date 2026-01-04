// ==UserScript==
// @name         问卷星自动填写信息
// @version      0.1
// @description 问卷星自动填写个人信息并提交,适合对时间与名额有要求的情况
// @author       ZainCheung
// @include     https://www.wjx.top/jq/*.aspx
// @include     https://www.wjx.cn/jq/*.aspx
// @grant        GM_xmlhttpRequest
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/418639/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/418639/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // URL 填写json文件的直链，比如可以使用jsdelivr加速
    var URL = "";
    // 是否自动提交，true为自动提交，false为手动提交
    var autoPost = false;
    // 提交时间，默认2000毫秒，即2秒
    var time = 2000;

    /**
    URL指向文件格式，内容与数量可以根据自己的需求进行更改，这段注释可以删除
    [
        {
            key: "学院名称",
            content: "管理学院"
        },
        {
            key: "学号",
            content: "20201101"
        },
        {
            key: "姓名",
            content: "张三"
        },
        {
            key: "专业",
            content: "市场营销"
        }
    ]
    */


    /**
     * @config 配置文件
     */
    function task(config) {
        var div_question = document.getElementsByClassName("div_question");
        for (var i = 0; i < div_question.length; i++) {
            var title = div_question[i].getElementsByClassName("div_title_question")[0].innerText;
            var textarea = div_question[i].getElementsByTagName("textarea")[0];

            for (var j = 0; j < config.length; j++) {
                if(config[j].key==title){
                    textarea.innerText = config[j].content;
                }
            }
        }

        try {
            var scrollvalue = document.getElementById("submit_button").offsetParent.offsetParent.offsetTop;
            window.scrollTo({
                top: scrollvalue,
                behavior: "smooth"
            });
        } catch (error) {}

        if(autoPost){
            setTimeout(function(){
                document.getElementById("submit_button").click();
                console.log("提交成功!");
            },time);
        }else{console.warn("自动提交已关闭，请手动开启")}

    }
        /**
     *
     * @name 主入口
     * @description 填入个人信息
     *
     */
    function start() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: URL,
            headers: {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'Accept': 'application/atom+xml,application/xml,text/xml',
            },
            onload: function(responseDetails) {
                var config = JSON.parse(responseDetails.responseText);
                task(config);
            }
        });
    }

    start();//脚本入口
})();