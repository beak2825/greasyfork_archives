// ==UserScript==
// @name         网页效果增强
// @namespace    https://github.com/xjl456852
// @version      0.1.18
// @description  长期更新:去除csdn等其它网站代码行号,复制代码时,会粘贴到行号,此脚本可以去除行号.折叠代码展开,去除CSDN关注才能看全文,展开全文,可以限制kaggle子页面的完整页面.清除一些网站的隐藏文字,干扰码.
// @author       解江磊
// @connect      www.csdn.net
// @match        *://www.kaggleusercontent.com/*
// @match        *://*.csdn.net/*
// @match        *://*.forbes.com/*
// @match        *://*/*
// @require      http://code.jquery.com/jquery-1.10.2.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/nprogress/0.2.0/nprogress.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/clipboard.js/2.0.10/clipboard.min.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license           LGPLv3
// @note         24-01-12 0.1.18 处理部分csdn样式内容显示不全问题
// @note         24-01-12 0.1.17 csdn的特殊页面进行显示处理
// @note         24-01-12 0.1.16 去除github.io中的代码块行号
// @note         23-11-24 0.1.15 移除csdn文库中的阅读全文,并展开文章
// @note         23-11-22 0.1.14 替换完行号后,展示全部代码
// @note         23-11-21 0.1.13 去除折叠代码,去除关注博客才能继续浏览
// @note         23-11-20 0.1.11 去除csdn的代码行高限制
// @note         22-06-25 0.1.9 清除一些网站的干扰码,隐藏文字
// @note         22-06-25 0.1.5 优化循环代码,对kaggle内嵌页优化
// @note         22-06-25 0.1.4 增加forbes.com自动弹窗取消,滚动条支持
// @note         22-06-25 0.1.3 增加kaggle子网页单独取出来,显示不完整问题.并增加匹配,修改插件名,并取消:@include      *://*.csdn.net/*
// @note         22-06-25 0.1.2 修改动态无缝支持各种语言正确显示.不转义
// @note         22-06-20 0.1.1 修改动态无缝支持各种语言正确显示.不转义
// @note         22-06-20 0.1.0 修改单独页面不同的动态语言
// @note         22-06-18 0.0.9 修改为动态语言
// @note         22-06-17 0.0.8 调整加载时间
// @note         22-06-17 0.0.7 支持csdn两种代码格式
// @note         22-06-17 0.0.6 去除csdn行号,调整缩进

// @downloadURL https://update.greasyfork.org/scripts/446603/%E7%BD%91%E9%A1%B5%E6%95%88%E6%9E%9C%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/446603/%E7%BD%91%E9%A1%B5%E6%95%88%E6%9E%9C%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function loopTemplate(name,e, count){
        let ref = "";
        let changeCount = 0;
        let loopResult = false;
        function startMonitor() {
            ref = setInterval(function () {
                changeCount++;
                console.log("effect loop monitor",name);
                if(changeCount>count){
                    clearInterval(ref);
                }
                loopResult = e();
                console.log('effect loop',name,loopResult);
                if(loopResult){
                    clearInterval(ref);
                    console.log('effect done',name);
                }
            }, 100);
        }
        startMonitor();
    }


    // Your code here...
    let csdn = {
        init() {
                $(".pre-numbering").remove();
                $(".prettyprint").css({"padding-left":"6px"});
                $(".hljs-ln-numbers").remove();

                let ref = "";
                let changeCount = 0;
                let refProcess = "";
                let changeProcessCount = 0;
                function getText(totalLi) {
                    var text = "";
                    for(var i=0; i<totalLi.length; i++){
                        text +=$(totalLi[i]).text()+"\n";
                    }
                    return text;
                }

                function changeCode() {
                    var data = $("code[class~='hljs']");
                    var len = data.length;
                    if(len<=0) {
                        return;
                    }
                    for(var i=0; i<len; i++){
                        var languageArr = $(data[i]).attr("class").split(" ");
                        var language="";
                        for (var j in languageArr ) {
                            if(languageArr[j].startsWith("language-")){
                                language = languageArr[j];
                                break;
                            }
                        }

                        var _par = $(data[i]).parent();
                        var totalLi = $(data[i]).find("li");
                        if(totalLi.length<=0) {
                            continue;
                        }
                        var current = '<pre class="prettyprint" style="padding: 8px 16px 6px 10px; user-select: auto;"><code class="prism '+language+' has-numbering" onclick="mdcp.copyCode(event)" style="position: unset; user-select: auto;"></code></pre>';
                        var newCurrent = $(current);
                        _par.replaceWith(newCurrent);
                        newCurrent.find("code").text(getText(totalLi));
                    }
                    console.log("去行号完成");
                    clearInterval(ref);
                    //去除行号后,也需要对隐藏处理
                    processHide();
                }

                function startChange() {
                    var src_class = $('pre').attr('class');
                    if("prettyprint" != src_class){
                        ref = setInterval(function () {
                            changeCount++;
                            // console.log(changeCount)
                            if(changeCount>200){
                                clearInterval(ref);
                            }
                            changeCode();
                        }, 10);
                    }
                }
                
                function processHide() {
                    clearInterval(refProcess);
                    //行的限高去掉
                    $("pre").css("max-height","none");
                    //去除折叠代码
                    $(".hide-preCode-box").remove();
                    $("pre.set-code-hide").css("height", "initial");
                    $("pre.set-code-hide").css("overflow", "initial");
                    //去除关注博主才能继续浏览
                    let needRemoveList = [".hide-article-box","div.open"];
                    $("#article_content").css("height", "initial");
                    $("#article_content").css("overflow", "initial");
                    //文库中的阅读全文
                    $("div.cont").css("max-height", "unset");
                    for(let i in needRemoveList){
                        $(needRemoveList[i]).remove();
                    }
                    startProcessByInterval(needRemoveList);
                }
                function startProcessByInterval(removelistEle) {
                    refProcess = setInterval(function () {
                        changeProcessCount++;
                        if(changeProcessCount>200){
                            clearInterval(refProcess);
                        }
                        console.log("process reading experience");
                        for(let i=0; i<removelistEle.length;i++){
                            if ($(removelistEle[i]).length > 0) {
                                console.log("移除隐藏:"+changeProcessCount);
                                processHide();
                                break;
                            }
                        }
                    }, 50);
                }
                
                startChange();
                //去除隐藏和关注功能
                processHide();

        }
    }
    let kaggle  = {
        init(){
            loopTemplate("kaggle",function(){
                if("hidden" == $("body").css("overflow-y")){
                    console.log("kaggle effect done");
                    $("body").css("overflow-y","auto");
                    return true;
                }
            },1000);
        }
    }
    
    let forbes  = {
        init(){
            let ref = "";
            let changeCount = 0;
            function startMonitor() {
                ref = setInterval(function () {
                    changeCount++;
                    console.log("loop monitor forbess");
                    if(changeCount>1000){
                        clearInterval(ref);
                    }
                    if(true == $("div").is(".tp-modal")){
                        console.log("remove forbes");
                        changeForbesCss();
                        clearInterval(ref);
                    }
                }, 100);
            }
            startMonitor();
            function changeForbesCss(){
                $("div.tp-backdrop").remove();
                $("div.tp-modal").remove();
                $("body").css("cssText", "overflow:auto !important;");
            }
        }
    }
    let cleanHide = {
        init(){
            $("font[style='color:rgb(255, 255, 255)']").remove();
            $("font[class='jammer']").remove();
        }
    }
    let github = {
        init() {
            $(".line-numbers-wrapper").remove();
        }
    }
    let removeLineNumver = {
        run(){
            let ref = "";
            let changeCount = 0;
            function startMonitor() {
                ref = setInterval(function () {
                    changeCount++;
                    removeLineNumver.process();
                    if(changeCount>200){
                        clearInterval(ref);
                    }
                }, 100);
            }
            startMonitor();
        },
        process(){
            github.init();
        }
        
    }
    let main = {
        init() {
            if (/.csdn.net/.test(location.host)) {
                csdn.init();
            }
            if (/.kaggleusercontent.com/.test(location.host)) {
                kaggle.init();
            }
            if (/.forbes.com/.test(location.host)) {
                forbes.init();
            }
            if (/.github.io/.test(location.host)) {
                removeLineNumver.run();
            }
            cleanHide.init();
        }
    };

    main.init();
})();