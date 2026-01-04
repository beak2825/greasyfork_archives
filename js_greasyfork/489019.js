// ==UserScript==
// @name         一汽学辅助
// @namespace    https://blog.csdn.net/shelley_chason
// @version      0.1.4
// @description  完成一汽学学习任务
// @author       shelley_chason
// @match        https://yqdx.yunxuetang.cn/sty/index.htm
// @icon         https://picobd.yunxuetang.cn/sys/15943078752/images/202311/333df9f705574d4e824663dd836b25c9.png
// @license      GPL-3.0 License
// @run-at       document-idle
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/489019/%E4%B8%80%E6%B1%BD%E5%AD%A6%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/489019/%E4%B8%80%E6%B1%BD%E5%AD%A6%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    function sleep(time){
        var timeStamp = new Date().getTime();
        var endTime = timeStamp + time;
        while(true){
            if (new Date().getTime() > endTime){
                return;
            }
        }
    }

    const $ = window.jQuery;
/*     if($.find("input.btnok").length > 2){ // 点击继续学习
        $.find("input.btnok").last().click();
        console.log("学习进度：9097896");
        if($("video").length > 0){ // 自动点击播放按钮
            //if($("video")[0].paused){
            $("video")[0].play();
            //}
        }
    } */

    // var IndexLink = "https://yqdx.yunxuetang.cn/sty/index.htm";
    // 添加开始刷课按钮
    $("span[data-localize='sty_tit_plancenter']").append('&nbsp;&nbsp;<a id="start" class="btn btn-text-info lh20 w-100">立即刷课</a>');
    // 点击按钮事件
    $("#start").click(function() {
        console.log("\n---------------开始刷课！！！---------------");
        var ClassList = []; // 课程列表，包括每个任务中的课程
        var TaskList = $("ul.task-list").find("div.el-new-progress-container"); // 任务列表
        for(var i=0;i<TaskList.length;i++){
            if ($(TaskList[i]).parent().text() != "100%"){
                let ClassLink = $(TaskList[i]).parents("li").find("a")[0].href;
                let ClassName = $(TaskList[i]).parents("li").find("a")[0].innerText;
                $.ajax({
                    url: ClassLink,
                    type: 'GET',
                    async: false,
                    success: function(response) {
                        $(response).find("tr.hand").each(function(index){
                            let SubClassPercent = $(this).find("span")[18].innerText;
                            if(SubClassPercent != "100%"){
                                let SubClassLink = 'https://yqdx.yunxuetang.cn/kng/' + /\/.*l/.exec($(this).attr("onclick"))[0];
                                // let SubClassTime = parseFloat(/\s\d+/.exec($(this).find("span.times")[0].innerText)[1]) - parseFloat(/\s\d+/.exec($(this).find("span.times")[0].innerText)[0]) * 1000 * 60;
                                if (parseFloat($(this).find("span.times")[0].innerText.match(/\d+/g)[1]) == 0){
                                    var SubClassTime = 1 * 1000 * 60;
                                } else {
                                    SubClassTime = (parseFloat($(this).find("span.times")[0].innerText.match(/\d+/g)[1]) - parseFloat($(this).find("span.times")[0].innerText.match(/\d+/g)[0])) * 1000 * 60;
                                }
                                let SubClassTitle = $(this).find("span")[3].innerText;
                                ClassList.push({"SubClassLink": SubClassLink, "SubClassTime": SubClassTime, "SubClassTitle": ClassName + "--" + SubClassTitle, "SubClassPercent": SubClassPercent});
                            }
                        });
                    },
                    error: function(xhr, status, error) {
                        console.error(error);
                    }
                });
            }
        }
        console.log("\n课程列表：");
        $(ClassList).each(function(i, c){
            console.log(c);
        });

        // 定义一个函数，用于逐个打开网页并进行学习
        function learnClass(index) {
            if (index >= ClassList.length) {
                console.log("\n所有课程已学习！！！！！");
                $("#myIframe").remove();
                return;
            }
            console.log("\n学习课程[" + String(index+1) + "/" + ClassList.length + "]：" + ClassList[index].SubClassTitle);
            // var newWindow = window.open(ClassList[index].SubClassLink);
            // 网页加载完成后开始学习
            $("#myIframe").remove();
            $("#divCustom_MyRank").after('<div id="myIframe" style="position: relative;overflow: hidden;height:450px;width: 980px;background-color: white;"><iframe style="position: relative;transform:scale(0.5);left: -470px;top: -230px;" src="' + ClassList[index].SubClassLink + '" width="1920px" height="920px"></iframe></div>');
            //$(newWindow).load('on', function(){
                var j = 0;
                const intervalID = setInterval(function() { // 每秒触发器
                    //if($(newWindow).find("input.btnok").length > 2){ // 点击继续学习
                    if($.find("input.btnok").length > 2){ // 点击继续学习
                        $.find("input.btnok").last().click();
                        console.log("学习进度：9097896");
                    }
/*                     $(document).on("DOMSubtreeModified", function(){
                        console.log($(document).find("input.btnok").length);
                    }); */
                    if(j % 10000 == 0){
                        console.log("学习进度："+ j / ClassList[index].SubClassTime * 100 + "%");
                    }
                    if($("video").length > 0){ // 自动点击播放按钮
                        //if($("video")[0].paused){
                            $("video")[0].play();
                        //}
                    }
                    j += 1000;
                }, 1000);
                // 学习对应时间后关闭当前网页，并打开下一个网页
                setTimeout(function(){
                    console.log("\n课程《" + ClassList[index].SubClassTitle + "》学习完成！");
                    clearInterval(intervalID);
                    //newWindow.close();
                    //location.assign('about:blank');
                    learnClass(index + 1); // 打开下一个网页
                }, ClassList[index].SubClassTime);
            //});
        }

        // 调用函数打开第一个网页
        if (ClassList.length > 0) {
            learnClass(0);
        } else {
            console.log("没有可学习的课程！！！！！");
        }
    });
})();