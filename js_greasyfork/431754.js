// ==UserScript==
// @name         真白萌新站阅读插件
// @namespace    mashiro_me
// @version      0.8.7
// @description  去除字体样式，添加功能按钮等。
// @author       MikaRyu
// @match        https://masiro.me/admin/
// @match        https://masiro.me/admin/novel*
// @license      BSD
// @icon         https://masiro.me/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431754/%E7%9C%9F%E7%99%BD%E8%90%8C%E6%96%B0%E7%AB%99%E9%98%85%E8%AF%BB%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/431754/%E7%9C%9F%E7%99%BD%E8%90%8C%E6%96%B0%E7%AB%99%E9%98%85%E8%AF%BB%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //最大连续换行数
    window.AddIn_MaxBreakLines = 4;
    //纯文本模式Flag（改为true使用纯文本模式）
    window.AddIn_TextModFlag = false;
    //当前地址
    var curHref = window.location.href;

    //小说阅读页面
    if ( /\/novelReading\?cid=[\d]+(?=&|$|#)/.test(curHref) ){
        InitReadingPage();
        return;
    }

    //小说目录页面
    if ( /\/novelView\?novel_id=[\d]+(?=&|$|#)/.test(curHref) ){
        InitViewPage();
        return;
    }

    //定时刷新
    if ( "https://masiro.me/admin/" == curHref){
        setInterval(function(){
            location.reload();
        },10800000);
    }else{
        /*let req = new XMLHttpRequest();
        req.open('GET', curHref, true);
        req.send(null);*/
    }

})();

function InitViewPage(){

    //目录按钮组
    var baseBox = document.getElementsByClassName("btn-box")[0];

    //全部购买按钮
    var payButton = document.createElement("span");
    payButton.setAttribute("class", "n-btn btn-read btn-font");
    payButton.appendChild(document.createTextNode("购买全部章节"));
    payButton.onclick = function(){

        var chapters = document.getElementsByClassName("chapter-ul")[0].querySelectorAll("a");
        window.AddIn_PayList = [];
        window.AddIn_TotalPay = 0;

        for (var i = 0; i < chapters.length; i++){
            if ((chapters[i].getAttribute("data-cost") > 0) &&
                (chapters[i].getAttribute("data-payed") == "0")){
                window.AddIn_PayList[window.AddIn_PayList.length] = chapters[i];
                window.AddIn_TotalPay += Number(chapters[i].getAttribute("data-cost"));
            }
        }

        //以下部分依赖于站点对于layui和jQuery的原始引用
        window.layui.use(['layer'], function () {
            let layer = window.layui.layer;
            if (window.AddIn_PayList.length == 0){
                layer.msg("本书暂无未购买章节", {icon: 2});
                return;
            }
            layer.confirm(
                "确定要支付"+ window.AddIn_TotalPay + "金币吗?" +
                "（共" + window.AddIn_PayList.length + "章未购买）",
                {icon: 3, title:"积分支付"},
                function(index){
                    window.AddIn_PayListIndex = 0;
                    window.AddIn_PayInterval = setInterval(BuyAllChapters(),200);
            });
        });
    }

    //按钮追加
    baseBox.appendChild(payButton);

    //样式跟随系统主题
    FollowSystemTheme();

    //追加插件按钮组
    AddButtonGroupForView();

}

function InitReadingPage(){

    //小说内容Box
    var textBox;
    var baseBox = document.getElementsByClassName("box-body nvl-content")[0];

    //加载保存配置
    InitAddinConfig();

    //替换翻页动作（全屏适配）
    ReplacePageAction();

    //样式跟随系统主题
    FollowSystemTheme();

    //追加插件按钮组
    AddButtonGroup();

    //允许点击任意区域隐藏目录
    LetAnyClickHideChapter();

    if (window.AddIn_TextModFlag){

        //复制纯文本用Box
        textBox = baseBox.parentNode.insertBefore(baseBox.cloneNode(false), baseBox);

        //文本内容复制
        FormartNodesAsText(textBox, baseBox);

    }else{

        //原内容Box复制
        textBox = baseBox.parentNode.insertBefore(baseBox.cloneNode(true), baseBox);

        //删除空行
        DeleteEmptyRows(textBox);

        //删除字体、字体大小、字体颜色
        DeleteFontStyles(textBox);

    }

    //删除【maxBreakLines】个以上的换行
    DeleteMultiBrs(textBox, window.AddIn_MaxBreakLines);

    //根据配置隐藏对应Box
    if (window.AddIn_ClearDefault) {
        textBox.style.display = "block";
        baseBox.style.display = "none";
    }else{
        textBox.style.display = "none";
        baseBox.style.display = "block";
    }
}

function InitAddinConfig(){

    //默认表示状态
    window.AddIn_ClearDefaultKey = "MsrAddIn_ClearDefault_" + GetNovelID();
    window.AddIn_ClearDefault = (localStorage.getItem(window.AddIn_ClearDefaultKey) != "false");
    localStorage.setItem(window.AddIn_ClearDefaultKey, window.AddIn_ClearDefault);

}

function BuyAllChapters(){

    return function(){

        window.layui.use(['layer'], function () {
            let layer = window.layui.layer;
            window.AddIn_ToPay = window.AddIn_PayList[window.AddIn_PayListIndex];

            window.$.ajax({
                type:"post",
                url:"/admin/pay",
                dataType:"json",
                data:{"type":2,
                      "object_id":window.AddIn_ToPay.getAttribute("data-id"),
                      "cost":window.AddIn_ToPay.getAttribute("data-cost")
                     },
                success:function(data){
                    if (data.code == 1){
                        window.AddIn_ToPay.setAttribute("data-payed", "1");
                    }else{
                        window.AddIn_PayError = data;
                    }
                },
                error:function(data){
                    window.AddIn_PayError = data;
                }
            });

            if (!!window.AddIn_PayError){
                clearInterval(window.AddIn_PayInterval);
                if (window.AddIn_PayError.hasOwnProperty('msg')){
                    layer.msg("网络错误，稍后重试!", {icon: 2});
                }else{
                    layer.msg(window.AddIn_PayError.msg, {icon: 2});
                }
                window.location.href = window.location.href;
                window.AddIn_PayError = null;
                return;
            }

            window.AddIn_PayListIndex += 1;
            if (window.AddIn_PayListIndex >= window.AddIn_PayList.length){
                clearInterval(window.AddIn_PayInterval);
                layer.open({
                    title: "积分支付",
                    content: "共" + window.AddIn_PayList.length + "章节, 支付成功",
                    yes: function(index, layero){
                        window.location.href = window.location.href;
                        layer.close(index);
                    }
                });
            }
        });
    }
}

function ReplacePageAction(){

    //页脚
    var footer = document.querySelector(".box-footer")

    //【上一话】跳转动作替换
    var lastPage = footer.firstElementChild.firstElementChild;
    if (!!lastPage){
        window.AddIn_LastPage = lastPage.getAttribute("href");
        lastPage.removeAttribute("href");
        lastPage.setAttribute("style", "cursor: pointer;");
        lastPage.onclick = function(){ RequestInPage(window.AddIn_LastPage); };
    }

    //【下一话】跳转动作替换
    //※最后一章的下一页链接的Class会变成last而非next。。。
    var nextPage = footer.lastElementChild.firstElementChild;
    if (!!nextPage){
        window.AddIn_NextPage = nextPage.getAttribute("href");
        nextPage.removeAttribute("href");
        nextPage.setAttribute("style", "cursor: pointer;");
        nextPage.onclick = function(){ RequestInPage(window.AddIn_NextPage); };
    }

}

function RequestInPage(requestUrl){

    if (!!window.AddIn_IsFull){

        //全屏状态下通过保留document维持全屏状态
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if ((req.readyState == 4) && (req.status == 200)) {
                const parser = new DOMParser();
                let htmlData = parser.parseFromString(req.responseText,"text/html");
                ReplaceDocuments(document, htmlData, requestUrl);
            }
        }
        req.open('GET', requestUrl, true);
        req.send(null);

    }else{
        window.location = requestUrl;
    }
}

function ReplaceDocuments(documentData, htmlData, currentUrl){

    //标题替换
    document.head.querySelector("title").innerHTML =
        htmlData.head.querySelector("title").innerHTML;

    //主要显示区域替换
    var baseObject = documentData.querySelector("#pjax-container");
    var newApp = htmlData.querySelector("#app").cloneNode(true);
    baseObject.appendChild(newApp);
    baseObject.replaceChild(newApp, documentData.querySelector("#app"));

    //日期标签转换
    var time, timeObject = documentData.querySelectorAll("data-time");
    for(let i = 0; i < timeObject.length; i++){
        time = new Date(timeObject[i].getAttribute("time") * 1000);
        timeObject[i].outerHTML =
            "<span title=\"" + GetDateTimeString(time) + "\" class=\"time\">" +
            GetPassTimeString(time) + "</span>";
    }

    //URL更新
    history.pushState(null, null, window.location.origin + currentUrl);
    //layui组件刷新
    window.layui.use(["element"], function(){ window.layui.element.init(); });
    //滚动条复位
    documentData.documentElement.scrollTop = newApp.offsetTop;
    //插件刷新
    InitReadingPage();

}

function GetDateTimeString(dateInput){

    let dateNum, result = "";
    result += dateInput.getFullYear() + "-";

    dateNum = dateInput.getMonth() + 1
    result += (dateNum < 10 ? "0" : "") + dateNum + "-";
    dateNum = dateInput.getDate()
    result += (dateNum < 10 ? "0" : "") + dateNum + " ";

    dateNum = dateInput.getHours()
    result += (dateNum < 10 ? "0" : "") + dateNum + ":";
    dateNum = dateInput.getMinutes()
    result += (dateNum < 10 ? "0" : "") + dateNum + ":";
    dateNum = dateInput.getSeconds()
    result += (dateNum < 10 ? "0" : "") + dateNum;

    return result;
}

function GetPassTimeString(dateInput){

    let dateNum = 0;
    let dateNow = new Date(Date.now());

    dateNum = dateNow.getFullYear() - dateInput.getFullYear();
    if (dateNum > 1){
        return dateNum + "年前";

    }else if (dateNum > 0){
        dateNum = dateNow.getMonth() - dateInput.getMonth();
        return (dateNum < 0 ? (dateNum + 12) + "个月前" : "1年前");

    }else{
        dateNum = dateNow.getMonth() - dateInput.getMonth();
        if (dateNum > 0) return dateNum + "个月前";
    }

    dateNum = dateNow.getDate() - dateInput.getDate();
    if (dateNum > 0) return dateNum + "天前";

    dateNum = dateNow.getHours() - dateInput.getHours();
    if (dateNum > 0) return dateNum + "小时前";

    dateNum = dateNow.getMinutes() - dateInput.getMinutes();
    if (dateNum > 0) return dateNum + "分钟前";

    dateNum = dateNow.getSeconds() - dateInput.getSeconds();
    return dateNum + "秒前";

}

function FollowSystemTheme(){

    //显示模式获取
    let displaymode = document.documentElement.getAttribute("data-theme");
    let styleTag = document.createElement("style");
    styleTag.setAttribute("type", "text/css");

    //解除box内联样式
    let displayBoxs = document.querySelectorAll(".box");
    if (displayBoxs.length > 0) {

        if (!! displayBoxs[0].style){
            styleTag.innerHTML =
                ".box { "+
                "       color: " + displayBoxs[0].style.color +";" +
                "       background-color: " + displayBoxs[0].style.backgroundColor +";" +
                "}"
            document.head.appendChild(styleTag);
            styleTag = document.createElement("style");
            styleTag.setAttribute("type", "text/css");
        }

        for(let i = 0; i < displayBoxs.length; i++){
            displayBoxs[0].style.color = null;
            displayBoxs[0].style.backgroundColor = null;
        }
    }

    //明亮模式
    if (displaymode == "1"){

        styleTag.innerHTML =
            ".addin-f-button { background-color: white; }"
        document.head.appendChild(styleTag);

    //暗黑＆跟随系统模式
    }else{

        styleTag.innerHTML =
            "@media (prefers-color-scheme: light) {"+
            "    .addin-f-button { background-color: white; }"+
            "}"+
            "@media (prefers-color-scheme: dark) {"+
            "    .box { "+
            "           color: white;" +
            "           background-color: var(--secondary-background);"+
            "    }"+
            "}"
        document.head.appendChild(styleTag);

        //系统主题覆盖
        const themeMedia = window.matchMedia("(prefers-color-scheme: light)");
        if (!themeMedia.matches) {
            document.querySelector(".logo").style.setProperty(
                "background-color", "var(--secondary-background)", "important");
            document.querySelector(".navbar").style.setProperty(
                "background-color", "var(--secondary-background)", "important");
            document.querySelector(".main-sidebar").style.setProperty(
                "background-color", "var(--secondary-background)", "important");
        }

        //监听主题变更
        themeMedia.addListener(lightTheme => {
            if (lightTheme.matches) {
                document.querySelector(".logo").style.backgroundColor = null;
                document.querySelector(".navbar").style.backgroundColor = null;
                document.querySelector(".sidebar").style.backgroundColor = null;
            } else {
                document.querySelector(".logo").style.setProperty(
                    "background-color", "var(--secondary-background)", "important");
                document.querySelector(".navbar").style.setProperty(
                    "background-color", "var(--secondary-background)", "important");
                document.querySelector(".sidebar").style.setProperty(
                    "background-color", "var(--secondary-background)", "important");
            }
        });
    }

}

function AddButtonGroup(){

    //按钮组父对象
    var appBox = document.getElementById("app");

    //移除默认回到顶部按钮
    var originToTop = document.getElementById("totop");
    if (!!originToTop){
        document.body.removeChild(originToTop);
    }

    //隐藏顶部标题
    var originHeader = document.getElementById("novel-header");
    if (!!originHeader){
        originHeader.style.display = "none";
    }

    //插件按钮组
    window.Addin_ButtonBox = document.createElement("div");
    window.Addin_ButtonBox.setAttribute(
        "style", "position: fixed; bottom: 50px; width: 35px; height: 280px;");

    //原内容/编辑后内容切换按钮
    window.AddIn_DPIcon = AddFunctionButton(
        window.Addin_ButtonBox, (window.AddIn_ClearDefault ? "fa-refresh" : "fa-ban"),
        "bottom: 240px; left: 0px; position: absolute;",
        function() {
            var contents = document.getElementsByClassName("box-body nvl-content");
            if (contents.length < 2) { return; }

            var toHide, toShow, toHideBlockHeight, originPosition, positionCoeff;
            if (contents[0].style.display == "block"){
                toHide = contents[0];
                toShow = contents[1];
                localStorage.setItem(window.AddIn_ClearDefaultKey, false);
                ReplaceClass(window.AddIn_DPIcon, "fa-refresh", "fa-ban");
            }else{
                toHide = contents[1];
                toShow = contents[0];
                localStorage.setItem(window.AddIn_ClearDefaultKey, true);
                ReplaceClass(window.AddIn_DPIcon, "fa-ban", "fa-refresh");
            }

            toHideBlockHeight = toHide.offsetHeight;
            originPosition = document.documentElement.scrollTop;
            positionCoeff = (originPosition - toHide.offsetTop) /
                toHideBlockHeight;

            toHide.style.display = "none";
            toShow.style.display = "block";

            if ( positionCoeff > 1 ){
                document.documentElement.scrollTop = originPosition +
                    ( toShow.offsetHeight - toHideBlockHeight );
            }
            else if ( positionCoeff > 0 ){
                document.documentElement.scrollTop = ( positionCoeff * toShow.offsetHeight ) +
                    toShow.offsetTop;
            }
        }
    ).children[0];

    //目录按钮
    AddFunctionButton(
        window.Addin_ButtonBox, "fa-list", "bottom: 200px; left: 0px; position: absolute;",
        function() {
            let chapter = window.AddIn_Chapter;
            if (chapter.offsetWidth === 0){
                var baseWidth = document.body.clientWidth;
                var bookMark = chapter.querySelector(".marked");
                var chapterWidth;

                if (baseWidth > 1000) {
                    chapterWidth = ((baseWidth * 0.3) - 5) + "px";
                    chapter.style.width = "30%";
                }else{
                    chapterWidth = ((baseWidth * 0.6) - 5) + "px";
                    chapter.style.width = "60%";
                }

                //固定内部元素宽度，避免滚动定位错误以及长目录造成的卡顿
                chapter.children[0].style.width = chapterWidth;
                chapter.children[1].style.width = chapterWidth;
                chapter.children[2].style.width = chapterWidth;

                //滚动至当前章节
                chapter.scrollTop = bookMark.offsetTop - bookMark.offsetHeight;
                ResetTitleBoxWidth();
            }
        }
    );

    //全屏按钮
    var iconClass = "fa-expand";
    if (IsFullScreen()){ iconClass = "fa-compress"; }
    window.AddIn_FSIcon = AddFunctionButton(
        window.Addin_ButtonBox, iconClass, "bottom: 160px; left: 0px; position: absolute;",
        function() {
            if (IsFullScreen()){
                document.exitFullscreen();
            }else{
                document.documentElement.requestFullscreen();
            }
        }
    ).children[0];

    //直达评论区按钮
    window.AddIn_OP1 = -1;
    AddFunctionButton(
        window.Addin_ButtonBox, "fa-comments-o", "bottom: 120px; left: 0px; position: absolute;",
        function() {
            let cmtPosition = document.getElementsByClassName("col-md-12")[1].offsetTop;
            if (window.AddIn_OP1 < 0) {
                window.AddIn_OP1 = document.documentElement.scrollTop;
                document.documentElement.scrollTop = cmtPosition;
            }else{
                if (document.documentElement.scrollTop != cmtPosition){
                    window.AddIn_OP1 = document.documentElement.scrollTop;
                    document.documentElement.scrollTop = cmtPosition;
                }else{
                    document.documentElement.scrollTop = window.AddIn_OP1;
                    window.AddIn_OP1 = -1;
                }
            }
        }
    );

    //返回顶部按钮
    window.AddIn_OP2 = -1;
    AddFunctionButton(
        window.Addin_ButtonBox, "fa-chevron-up", "bottom: 0px; left: 0px; position: absolute;",
        function() {
            if (document.documentElement.scrollTop > 0) {
                window.AddIn_OP2 = document.documentElement.scrollTop;
                document.documentElement.scrollTop = 0;
            }else{
                document.documentElement.scrollTop = window.AddIn_OP2;
                window.AddIn_OP2 = -1;
            }
        }
    );

    //追加按钮组，重设位置
    appBox.appendChild(window.Addin_ButtonBox);
    window.Addin_MainBox = document.querySelector(".content");
    KeepButtonPosition();
    window.addEventListener("resize", function(){ KeepButtonPosition(); ChangFullScreenIcon(); });

}

function AddButtonGroupForView(){

    //按钮组父对象
    var appBox = document.getElementById("app");

    //插件按钮组
    window.Addin_ButtonBox = document.createElement("div");
    window.Addin_ButtonBox.setAttribute(
        "style", "position: fixed; bottom: 100px; width: 36px; height: 280px;");

    //全部折叠按钮
    AddFunctionButton(
        window.Addin_ButtonBox, "fa-minus-square-o", "bottom: 200px; left: 0px; position: absolute;",
        function() {
            let chapterBase = document.querySelector(".chapter-ul");
            let titleList = chapterBase.querySelectorAll(".episode-ul");
            for( let i = 0; i < titleList.length; i++ ){
                titleList[i].style.height = "0px";
            }
            let signList = chapterBase.querySelectorAll(".minus");
            for( let i = 0; i < signList.length; i++ ){
                ReplaceClass(signList[i], "minus", "plus");
                signList[i].innerHTML = "+";
            }
        }
    );

    //移至当前章节按钮
    AddFunctionButton(
        window.Addin_ButtonBox, "fa-indent", "bottom: 160px; left: 0px; position: absolute;",
        function() {

            let chapterBase = document.querySelector(".chapter-ul");
            let readingChapter = chapterBase.querySelector(".history-read");
            if (!readingChapter){
                window.layui.layer.msg("本书尚无阅读记录!", {icon: 0});
                return;
            }

            let chapterBox = readingChapter.parentNode.parentNode;
            let scrollTimeout = 0;
            window.AddIn_ScrollPosition = readingChapter.offsetTop;

            if (chapterBox.offsetHeight === 0){
                chapterBox.style.height =
                    (chapterBox.querySelectorAll(".episode-box").length * 50) + "px";

                let titleBox =
                    chapterBox.parentNode.previousSibling.previousSibling.firstChild;
                ReplaceClass(titleBox, "plus", "minus");
                titleBox.innerHTML = "-";

                let maxScroll =
                    document.documentElement.offsetHeight - document.documentElement.clientHeight;
                if (window.AddIn_ScrollPosition > maxScroll) {
                    //加延时，避免滚动快过目录展开后卡住
                    scrollTimeout = 200;
                    //setTimeout(()=>{window.scrollTo({top: window.AddIn_ScrollPosition, behavior: "smooth"});}, 0);
                    //readingChapter.scrollIntoView(false);
                    //document.documentElement.scrollTo({top: window.AddIn_ScrollPosition , behavior: "smooth"});
                }
            }
            setTimeout(()=>{document.documentElement.scrollTop = window.AddIn_ScrollPosition;}, scrollTimeout);
        }
    );

    //直达评论区按钮
    window.AddIn_OP1 = -1;
    AddFunctionButton(
        window.Addin_ButtonBox, "fa-comments-o", "bottom: 120px; left: 0px; position: absolute;",
        function() {
            let cmtPosition = document.getElementsByClassName("col-md-12")[2].offsetTop;
            if (window.AddIn_OP1 < 0) {
                window.AddIn_OP1 = document.documentElement.scrollTop;
                document.documentElement.scrollTop = cmtPosition;
            }else{
                if (document.documentElement.scrollTop != cmtPosition){
                    window.AddIn_OP1 = document.documentElement.scrollTop;
                    document.documentElement.scrollTop = cmtPosition;
                }else{
                    document.documentElement.scrollTop = window.AddIn_OP1;
                    window.AddIn_OP1 = -1;
                }
            }
        }
    );

    //返回顶部按钮
    window.AddIn_OP2 = -1;
    AddFunctionButton(
        window.Addin_ButtonBox, "fa-chevron-up", "bottom: 0px; left: 0px; position: absolute;",
        function() {
            if (document.documentElement.scrollTop > 0) {
                window.AddIn_OP2 = document.documentElement.scrollTop;
                document.documentElement.scrollTop = 0;
            }else{
                document.documentElement.scrollTop = window.AddIn_OP2;
                window.AddIn_OP2 = -1;
            }
        }
    );

    //追加按钮组，重设位置
    appBox.appendChild(window.Addin_ButtonBox);
    window.Addin_MainBox = document.querySelector(".box");
    KeepButtonPositionForView();
    window.addEventListener("resize", function(){ KeepButtonPositionForView(); });

}

function IsFullScreen(){

    //显示区域与屏幕区域比较
    window.AddIn_IsFull =
        (document.documentElement.clientHeight === window.screen.height);

    return window.AddIn_IsFull;
}

function ChangFullScreenIcon(){

    if (IsFullScreen()){
        ReplaceClass(window.AddIn_FSIcon, "fa-expand", "fa-compress");
    }else{
        ReplaceClass(window.AddIn_FSIcon, "fa-compress", "fa-expand");
    }

}

function AddFunctionButton(buttonBox, iconClass, positionInfo, buttonAction){

    var icon, button, styleList;

    //按钮图标设置
    icon = document.createElement("i");
    icon.setAttribute("class", "fa " + iconClass);
    icon.setAttribute("style", "margin-top: 10px;margin-left: 10px;");

    //按钮设置
    button = document.createElement("div");
    button.appendChild(icon);

    styleList = positionInfo +
        "width: 35px; height: 35px;"+
        "border-radius: 3px; border: 1px solid; border-color: #E6E6E6;"+
        "cursor: pointer;";

    button.setAttribute("class", "addin-f-button");
    button.setAttribute("style", styleList);
    button.onclick = buttonAction;

    buttonBox.appendChild(button);
    return button;
}

function LetAnyClickHideChapter(){

    //鼠标在目录中时设定为利用中
    window.AddIn_Chapter = document.querySelector(".chapter-nav");
    let chapter = window.AddIn_Chapter;
    chapter.addEventListener("mouseenter", function(event){
        AddClass(window.AddIn_Chapter, "AddIn_Using");
    });
    chapter.addEventListener("mouseleave", function(event){
        RemoveClass(window.AddIn_Chapter, "AddIn_Using");
    });

    //文档全体添加隐藏目录事件
    document.addEventListener("click", function(event){
        let chapter = window.AddIn_Chapter;
        if ((! /(?<=^| )AddIn_Using(?= |$)/.test(chapter.className)) &&
            (chapter.offsetWidth > 0)){

            var baseWidth = document.body.clientWidth;
            var chapterWidth = ((baseWidth > 1000) ? (baseWidth * 0.3) : (baseWidth * 0.6));
            chapterWidth = (chapterWidth - 5) + "px";

            //固定内部元素宽度，避免滚动定位错误以及长目录造成的卡顿
            chapter.children[0].style.width = chapterWidth;
            chapter.children[1].style.width = chapterWidth;
            chapter.children[2].style.width = chapterWidth;

            chapter.style.width = "0px";
            ResetTitleBoxWidth();
        }
    });
}

function ResetTitleBoxWidth(){
    window.AddIn_Reset && clearTimeout(window.AddIn_Reset);
    window.AddIn_Reset =
    setTimeout(function(){
        window.AddIn_Chapter.firstElementChild.style.width = "100%"
        window.AddIn_Reset = null;
    }, 600);
}

function AddClass(item, className){

    var reg = new RegExp("(?<=^| )" + className + "(?= |$)");
    var allClasses = item.className;
    if (! reg.test(allClasses)){
        item.setAttribute("class", allClasses + " " + className);
    }
}

function RemoveClass(item, className){

    var reg = new RegExp("(?<=^| )" + className + "(?= |$)");
    var allClasses = item.className;
    if (reg.test(allClasses)){
        item.setAttribute("class", allClasses.replace(reg, ""));
    }
}

function ReplaceClass(item, className, classNameNew){

    var reg = new RegExp("(?<=^| )" + className + "(?= |$)");
    var allClasses = item.className;
    if (reg.test(allClasses)){
        item.setAttribute("class", allClasses.replace(reg, classNameNew));
    }
}

function KeepButtonPosition(){

    let button = window.Addin_ButtonBox;
    var marginWidth = window.Addin_MainBox.offsetLeft -
        document.querySelector("#app").offsetLeft;

    if ( marginWidth > 136 ){
        button.style.right = (marginWidth - 86) + "px";
        if (button.style.opacity != 1){
            button.style.opacity = 1;
        }
    }else{
        if (button.style.right != "50px"){
            button.style.right = "50px";
        }
        if (marginWidth < 71){
            if (button.style.opacity != 0.4){
                button.style.opacity = 0.4;
            }
        }else{
            if (button.style.opacity != 1){
                button.style.opacity = 1;
            }
        }
    }

}

function KeepButtonPositionForView(){

    let button = window.Addin_ButtonBox;
    var marginWidth = window.Addin_MainBox.offsetLeft;

    if ( marginWidth > 0 ){
        button.style.right = ( marginWidth - 70 ) + "px";
        if (button.style.opacity != 1){
            button.style.opacity = 1;
        }
    }else{
        if (button.style.right != "34px"){
            button.style.right = "34px";
        }
        if (button.style.opacity != 0.4){
            button.style.opacity = 0.4;
        }
    }

}

function FormartNodesAsText(base, parent){

    var childs = parent.childNodes;
    for(let i = 0; i < childs.length; i++){


        if (childs[i].nodeType == 3){

            let innerText = childs[i].data;
            if (/^(&nbsp;|\s)*$/.test(innerText)){
                continue;
            }

            base.appendChild(childs[i].cloneNode(false));

        }else{

            let tagName = childs[i].localName;

            if (tagName == "br" || tagName == "img" || tagName == "ruby"){

                base.appendChild(childs[i].cloneNode(true));

            }else{

                if (( tagName == "p" ) &&
                    ( !!childs[i].style ) &&
                    ( !!childs[i].style.textIndent ) ){
                    base.appendChild(document.createElement("br"));
                }

                if (childs[i].hasChildNodes()){

                    FormartNodesAsText(base, childs[i]);

                }
                if (tagName != "span"){
                    base.appendChild(document.createElement("br"));
                }
            }
        }
    }
}

function DeleteFontStyles(parent){

    var childNode, nodeLength = parent.children.length;
    for(let i = 0; i < nodeLength; i++){

        childNode = parent.children[i];
        if (!!childNode.style){
            childNode.style.fontFamily = null;
            childNode.style.fontSize = null;
            childNode.style.color = null;
            childNode.style.backgroundColor = null;
        }

        if ((childNode.tagName === "FONT") ||
            (childNode.tagName === "STRONG")){
            parent.children[i].outerHTML = "<span>" + childNode.innerHTML + "</span>";
            childNode = parent.children[i];
        }

        if (childNode.hasChildNodes()){
            DeleteFontStyles(childNode);
        }

    }

}

function DeleteEmptyRows(parent){

    var childs = parent.childNodes;
    var tagName, innerText;

    for(var i = 0; i < childs.length; i++){

        tagName = childs[i].localName;

        if (tagName == "br" ||
            tagName == "img"){
            continue;
        }

        innerText = childs[i].innerHTML;
        if (!innerText){
            innerText = childs[i].data;
        }

        if ((/^(&nbsp;|\s)*$/g.test(innerText)) ||
            ((! childs[i].hasChildNodes()) && (!!tagName))){

            parent.removeChild(childs[i]);
            i -= 1;
            continue;

        }

        DeleteEmptyRows(childs[i]);

    }
}

function DeleteMultiBrs(parent, num){

    var j = 0;
    var childs = parent.childNodes;

    for(var i = 0; i < childs.length; i++){

        if (childs[i].localName == "br"){

            if ( j == num ){
                parent.removeChild(childs[i]);
                i -= 1;
            }else{
                j += 1;
            }
            continue;
        }

        j = 0;
        if (childs[i].hasChildNodes()){
            DeleteMultiBrs(childs[i], num);
        }

    }

}

function GetNovelID(){

    let id = document.getElementsByClassName("layui-breadcrumb")[0].
        children[0].href.match(/(?<=\=)[0-9]+(?=$)/)
    return (!!id ? id : "Default");
}