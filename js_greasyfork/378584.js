// ==UserScript==
// @name         (持续更新)Greener系列：知乎主页与问题浏览缓存自动清除|全面优化广告过滤(浏览文章回答过多内存优化|去侧栏广告|浏览知乎再也不会卡顿了|不登录浏览)
var name = "Greener系列：知乎主页与问题浏览缓存自动清除|全面优化广告过滤";
var siteName = "知乎";
// @namespace    https://github.com/AdlerED
// @version      1.1.6
var version = "1.1.6";
// @description  轻量级TamperMonkey插件：你有没有遇到过浏览知乎过多过长导致页面崩溃/占用内存过多的情况? 本插件对其进行全面优化, 不用再刷新页面释放内存了! By Adler
// @author       Adler
// @connect      zhihu.com
// @include      *://*.zhihu.com/*
// @require      https://code.jquery.com/jquery-1.11.0.min.js
// @note         19-03-03 1.1.0 重要更新：优化了缓存清除流程，更加无缝的体验
// @note         19-03-02 1.0.1 优化了主页的浏览体验
// @note         19-03-02 1.0.0 初版发布
// @downloadURL https://update.greasyfork.org/scripts/378584/%28%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%29Greener%E7%B3%BB%E5%88%97%EF%BC%9A%E7%9F%A5%E4%B9%8E%E4%B8%BB%E9%A1%B5%E4%B8%8E%E9%97%AE%E9%A2%98%E6%B5%8F%E8%A7%88%E7%BC%93%E5%AD%98%E8%87%AA%E5%8A%A8%E6%B8%85%E9%99%A4%7C%E5%85%A8%E9%9D%A2%E4%BC%98%E5%8C%96%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%28%E6%B5%8F%E8%A7%88%E6%96%87%E7%AB%A0%E5%9B%9E%E7%AD%94%E8%BF%87%E5%A4%9A%E5%86%85%E5%AD%98%E4%BC%98%E5%8C%96%7C%E5%8E%BB%E4%BE%A7%E6%A0%8F%E5%B9%BF%E5%91%8A%7C%E6%B5%8F%E8%A7%88%E7%9F%A5%E4%B9%8E%E5%86%8D%E4%B9%9F%E4%B8%8D%E4%BC%9A%E5%8D%A1%E9%A1%BF%E4%BA%86%7C%E4%B8%8D%E7%99%BB%E5%BD%95%E6%B5%8F%E8%A7%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/378584/%28%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%29Greener%E7%B3%BB%E5%88%97%EF%BC%9A%E7%9F%A5%E4%B9%8E%E4%B8%BB%E9%A1%B5%E4%B8%8E%E9%97%AE%E9%A2%98%E6%B5%8F%E8%A7%88%E7%BC%93%E5%AD%98%E8%87%AA%E5%8A%A8%E6%B8%85%E9%99%A4%7C%E5%85%A8%E9%9D%A2%E4%BC%98%E5%8C%96%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%28%E6%B5%8F%E8%A7%88%E6%96%87%E7%AB%A0%E5%9B%9E%E7%AD%94%E8%BF%87%E5%A4%9A%E5%86%85%E5%AD%98%E4%BC%98%E5%8C%96%7C%E5%8E%BB%E4%BE%A7%E6%A0%8F%E5%B9%BF%E5%91%8A%7C%E6%B5%8F%E8%A7%88%E7%9F%A5%E4%B9%8E%E5%86%8D%E4%B9%9F%E4%B8%8D%E4%BC%9A%E5%8D%A1%E9%A1%BF%E4%BA%86%7C%E4%B8%8D%E7%99%BB%E5%BD%95%E6%B5%8F%E8%A7%88%29.meta.js
// ==/UserScript==

//如果你不希望脚本会将知乎主页的内容由于需要节约内存而删除, 请将此项改为false, 反之改为true;
var memSaveMode = true;
//如果你不希望脚本会将知乎问题浏览的页面由于需要节约内存而删除, 请将此项改为false, 反之改为true;
var memSaveModeArticle = true;

(function() {
    var currentURL = window.location.href;
    console.log("你正在访问 " + currentURL + " , 正在为你匹配过滤规则......");
    var signUp = /signup/;
    var question = /question/;
    if (signUp.test(currentURL)){
        $(".SignContainer-switch").append("&nbsp;&nbsp;&nbsp;&nbsp;<span><a href='https://www.zhihu.com/explore'>跳过登录, 直接浏览</a></span>");
    }
    console.log("欢迎, 正在执行" + name + "插件! Powered By Adler WeChat: 1101635162");
    var count = 0;
    if (count == 0){
        console.log("正在进行第一次Kill操作......");
        killAll();
    }

    var starting = setInterval(function(){
        count++;
        if (count > 50) {
            console.log("净化已完成! 请享受绿色的" + siteName + "~");
            clearInterval(starting);
        } else {
            if (count == 5) {
                //预留
                //进度条
                console.log("正在干掉遗漏的浮窗(不会影响性能, 请无视该消息)......");
                killAll();
            }
        }
    }, 100);
    //由于部分交互非即时打开, 所以一直循环
    setInterval(function(){
        //预留
        //删除主页卡片广告
        $(".Pc-feedAd-container").remove();
        if (question.test(currentURL)){
            if (memSaveModeArticle == true) {
                //重要：检查卡片数量并进行部分删除
                var cardsArticle = document.getElementsByClassName("List-item");
                //限制卡片数量
                var limitsArticle = 12;
                //计算应该删除多少个卡片
                var needToDelArticle = cardsArticle.length - limitsArticle;
                console.log("问题页：卡片数量：" + cardsArticle.length + " 需要删除：" + needToDelArticle);
                if (cardsArticle.length > limitsArticle) {
                    for (var iArticle = 0; iArticle < needToDelArticle; iArticle++){
                        console.log(iArticle);
                        try {
                            //cardsArticle[iArticle].parentNode.removeChild(cardsArticle[iArticle]);
                            cardsArticle[0].parentNode.removeChild(cardsArticle[0]);
                        } catch (err) { console.log("出现非致命性错误"); continue; }
                    }
                    //删除已经展开的内容
                    //$(".RichContent").remove();
                }
            }
        } else {
            if (memSaveMode == true) {
                    //重要：检查卡片数量并进行部分删除
                    var cards = document.getElementsByClassName("TopstoryItem");
                    //限制卡片数量
                    var limits = 30;
                    //计算应该删除多少个卡片
                    var needToDel = cards.length - limits;
                    console.log("主页：卡片数量：" + cards.length + " 需要删除：" + needToDel);
                    //if (cards.length > limits) {
                    if (needToDel > 0) {
                        console.log("触发");
                        //for (var del = 0; del < limits; del++) {
                        for (var del = 0; del < needToDel; del++) {
                        console.log(del);
                        try {
                            //cards[del].parentNode.removeChild(cards[del]);
                            cards[0].parentNode.removeChild(cards[0]);
                            //$(".TopstoryItem").remove();
                        } catch (err) { console.log("出现非致命性错误"); continue; }
                    }
                    //$(".TopstoryItem").remove();
                }
            }
        }
    }, 1000);
})();

function killAll() {
    //修改问题回答宽度
    //$(".Question-mainColumn").css("width", "100%");
    //$(".Question-main").css("display", "!important");
    //核心代码
    //CLASSES
    var classLists = new Array(
        "Pc-card",
        "Banner-image",
        //"Sticky",
        "Pc-word",
        //评论推荐内容
        "Recommendations-Main",
    );

    //IDS
    var idLists = new Array(

    );

    for(var i = 0; i < classLists.length; i++) {
        var tempName = classLists[i];
        $("." + tempName).remove();
    }

    for(var j = 0; j < idLists.length; j++) {
        var tempID = idLists[j];
        $("#" + tempID).remove();
    }
}
