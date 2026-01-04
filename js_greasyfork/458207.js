// ==UserScript==
// @name         头条自动发布
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  头条自动发布脚本，发布段子
// @author       You
// @match        https://mp.toutiao.com/profile_v4/graphic/publish
// @icon         https://www.google.com/s2/favicons?domain=toutiao.com
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/458207/%E5%A4%B4%E6%9D%A1%E8%87%AA%E5%8A%A8%E5%8F%91%E5%B8%83.user.js
// @updateURL https://update.greasyfork.org/scripts/458207/%E5%A4%B4%E6%9D%A1%E8%87%AA%E5%8A%A8%E5%8F%91%E5%B8%83.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function changeReactInputValue(inputDom,newText){
        let lastValue = inputDom.value;
        inputDom.value = newText;
        let event = new Event('input', { bubbles: true });
        event.simulated = true;
        let tracker = inputDom._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        inputDom.dispatchEvent(event);
    }
    var suiji = 0.1;// Math.floor(Math.random() * 15);
    var jishi = 0;
    var article_length = 20;
    var content = "";
    var t = setInterval(() => {


        //修改标题
        var title = $("textarea");
        changeReactInputValue(title[0],"每天一笑，菜叶剔掉");
        //获取段落
        var p_length = 0;
        //关闭发文助手
        if($(".icon-wrap").length > 0){
            $(".icon-wrap")[0].click();
        }
        for(var j=0;j<article_length;j++){
            $.ajax({
                type: "post",
                url: "https://cash.cantecsoft.com/public/index.php/index/test",
                success: function (response) {
                    response = JSON.parse(response);
                    content += "<p>" + response.duanzi.replace("<br>","") +"<hr contenteditable=\"false\" draggable=\"true\"></p >";
                    p_length++;
                    console.log(p_length);
                    if(article_length == p_length){
                        $(".ProseMirror").html(content);
                        content = "";
                        //设置无封面
                        var fengmian = $(".byte-radio-inner-text");
                        for (var f=0;f<fengmian.length;f++) {
                            console.log(f+fengmian[f].innerHTML);
                            if(fengmian[f].innerHTML == "无封面"){
                                fengmian[f].click();
                            }
                        }
                        //执行发布
                        console.log($('button'));
                        var wait1 = setInterval(()=>{
                            if($(".byte-input-suffix")[0].value.length != 0){
                                clearInterval(wait1);
                                var publishBtn = $(".publish-btn");
                                for(var b=0;b<publishBtn.length;b++){
                                    if(publishBtn[b].innerText == "预览并发布"){
                                        publishBtn[b].click();
                                        var wait2 = setInterval(()=>{
                                            publishBtn = $(".publish-btn");
                                            for(b=0;b<publishBtn.length;b++){
                                                if(publishBtn[b].innerText == "确认发布"){
                                                    publishBtn[b].click();
                                                    //进入创作页面，等待下一次时间到达
                                                    var wait3 = setInterval(()=>{
                                                        publishBtn = $("a");
                                                        for(b=0;b<publishBtn.length;b++){
                                                            if(publishBtn[b].innerText == "文章"){
                                                                publishBtn[b].click();
                                                            }
                                                        }
                                                    },1000);
                                                    }
                                            }
                                        },1000)
                                    }
                                }
                            }
                        },1000);
                        /*
                        var wait = setInterval(()=>{
                            if($(".publish-btn").html() == "<span>确认发布</span>"){
                                $(".publish-btn").click();
                            }
                        },1000)
                        */
                    }
                }
            });
            if(j == article_length-1){
                console.log(j);
                clearInterval(t);
            }
        }
        suiji = Math.floor(Math.random() * 120);
        console.log(suiji)
    },1000*60*suiji);



    // Your code here...
})();