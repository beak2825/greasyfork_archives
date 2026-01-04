// ==UserScript==
// @name         【Sydowlle】B 站多功能菜单 SyBili
// @namespace    https://space.bilibili.com/346631924
// @version      2024-12-09
// @description  B 站页面多功能
// @author       Sydowlle
// @match        https://www.bilibili.com/*
// @match        https://t.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535559/%E3%80%90Sydowlle%E3%80%91B%20%E7%AB%99%E5%A4%9A%E5%8A%9F%E8%83%BD%E8%8F%9C%E5%8D%95%20SyBili.user.js
// @updateURL https://update.greasyfork.org/scripts/535559/%E3%80%90Sydowlle%E3%80%91B%20%E7%AB%99%E5%A4%9A%E5%8A%9F%E8%83%BD%E8%8F%9C%E5%8D%95%20SyBili.meta.js
// ==/UserScript==


console.log("SyBili: 正在装载 SyBili 脚本");




// 工具函数实现

// 函数：根据 cookieName 获取 cookieValue
function getCookieByName(name) {
    var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    var r = document.cookie.match(reg)
    return r ? unescape(r[2]) : null
}

// 函数：设置一个十年后过期的 cookie
function setCookiePermanent(name, value) {
    var expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 10);
    document.cookie = name + "=" + value + "; expires=" + expiryDate.toUTCString();
}

// 函数；转换 cookie，在 yes 与 no 中转换
function toggleCookie(name) {
    var temp = getCookieByName(name);
    if (temp === null) return null;
    else if (temp == "yes") setCookiePermanent(name, "no");
    else if (temp == "no") setCookiePermanent(name, "yes");
    return null;
}



// 脚本函数实现

// 函数：首页简化顶部栏
function forepageSimpleTopbar() {

    // 确定容器
    const leftBar = document.querySelector(".left-entry");


    // 第一次清除
    for (var i = 1; i <= leftBar.children.length - 1; i = i + 1) {
        if(leftBar.children[i].id == "SyBiliMenuButtom") continue; // 如果是主页按钮或菜单按钮就不管
        leftBar.children[i].style.display = "none";
    }

    // 设置观察器，如果再次加入其他按钮，则处理
    const observer = new MutationObserver(function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node !== leftBar) {
                        // 如果新出现的不是首页按钮，则处理
                        // 下拉出现悬浮顶部导航栏，首页按钮会重新添加，b 站你屎山那么多的？
                        if(!node.innerHTML.includes("首页")){
                            node.style.display = 'none';
                        }
                    }
                });
            }
        }
    });
    const config = { attributes: true, childList: true, subtree: true };
    observer.observe(leftBar, config);

}

// 函数：不显示首页推荐中的直播或番剧推荐卡片
function dontShowStreamCard() {
    if(window.location.href.split("/")[2] !== "www.bilibili.com") return;
    var newStyle = document.createElement('style');
    newStyle.innerHTML = ".floor-single-card{display:none !important} .bili-live-card{display:none !important}";
    document.head.appendChild(newStyle);
}

// 函数：不显示首页滚动框
function dontShowSwipeAd(){
    if(window.location.href.split("/")[2] !== "www.bilibili.com") return;
    document.querySelector(".recommended-swipe").style.display = "none";
}

// 函数：首页专注模式（不显示 feed）
function forepageFocusMode(){
    if(window.location.href.split("/")[2] !== "www.bilibili.com") return;
    document.getElementsByClassName("feed2")[0].innerHTML = "<h1 style=\"line-height: 5em; text-align: center; color: #343738;\">专注模式已启用</h1>";
    document.getElementsByClassName("bili-header__channel")[0].style.display = 'none';
    document.querySelector(".palette-button-outer").style.display = "none";

}

// 函数：首页去除 adblock 标志栏
function removeAdblockWarning(){
    if (document.getElementsByClassName("adblock-tips").length != 0){
        document.getElementsByClassName("adblock-tips")[0].style.display = 'none';
    }
    // console.log("adblock 提示已删除");
}

// 函数：播放页简化顶部栏
function videopageSimpleTopbar(){
    var leftBar = document.querySelector(".left-entry");
    for (var i = 2; i <= leftBar.children.length - 1; i = i + 1) {
        leftBar.children[i].style.display = "none";
    }
    var rightBar = document.querySelector(".right-entry");
    rightBar.children[1].style.display = "none";
    rightBar.children[6].style.display = "none";
    rightBar.children[7].style.display = "none";
}

// 函数：播放页不显示推荐栏
function videopageHideRecommend(){
    document.querySelector(".recommend-list-v1").style.display = "none";

    // 观察直播栏，出现即杀
    const targetNode = document.querySelector(".rcmd-tab");
    const targetClassName = 'pop-live-small-mode';
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && node.classList.contains(targetClassName)) {
                        console.log("SyBili: 侦测到直播推荐，进行删除");
                        node.style.display = "none";
                    }
                });
            }
        }
    });
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);


    // 定时检查直播栏，爆杀
    var maxExecutionCount = 6;
    var intervalId = setInterval(function(){
        if(document.querySelector(".pop-live-small-mode") != null){
            if(document.querySelector(".pop-live-small-mode").style.display != "none"){
                console.log("SyBili: 侦测失败，定时捕获并删除");
            }
            document.querySelector(".pop-live-small-mode").style.display = "none"
        }
        maxExecutionCount -= 1;
        if(maxExecutionCount <= 0) clearInterval(intervalId);
    }, 500)

}


// 函数：菜单加载函数
function mainMenu(){

    // 元素：菜单按钮，插入到顶栏左侧
    var SyBiliMenuButtom = document.createElement('li');
    SyBiliMenuButtom.id = "SyBiliMenuButtom"
    document.querySelector(".left-entry").insertBefore(SyBiliMenuButtom, document.querySelector(".left-entry").children[1]);
    SyBiliMenuButtom.className = 'v-popover-wrap';
    SyBiliMenuButtom.onclick = openMenu;
    // 内部与其他并排的按钮保持一致
    var SyBiliMenuButtomInner = document.createElement('a');
    SyBiliMenuButtom.appendChild(SyBiliMenuButtomInner);
    SyBiliMenuButtomInner.className = "default-entry";
    SyBiliMenuButtomInner.innerHTML = "<span>SyBili</span>";

    // 元素：style
    var SyBiliCSS = document.createElement('style');
    // SyBiliCSS.type = 'text/css';
    var SyBiliCSSString = "";
    SyBiliCSSString = SyBiliCSSString + ".SyBiliMenuLeftListContent { margin: 10px 0 10px 0; padding: 1em 0 1em 2em }\n ";
    SyBiliCSSString = SyBiliCSSString + ".SyBiliMenuLeftListContent:hover{ background-color: #dddddd}\n";
    SyBiliCSSString = SyBiliCSSString + ".SyBiliMenuLeftListContent:active{ background-color: #ffffff}\n";
    SyBiliCSSString = SyBiliCSSString + ".SyBiliMenuPages{ position: fixed; left: 20%; bottom: 0; height: 478px; background-color: yellow}\n";
    SyBiliCSS.innerHTML = SyBiliCSSString;
    document.head.appendChild(SyBiliCSS);

    // 函数：显示遮罩层，即打开菜单
    function openMenu() {
        SyBiliOverlay.style.display = "block";
        // console.log("呼出菜单")
    }

    // 函数：关闭遮罩层，即关闭菜单
    function closeMenu() {
        SyBiliOverlay.style.display = "none";
    }

    // 元素：遮罩层
    var SyBiliOverlay = document.createElement('div');
    document.body.insertBefore(SyBiliOverlay, document.body.firstChild);
    SyBiliOverlay.style.userSelect = "none";
    SyBiliOverlay.style.position = "fixed";
    SyBiliOverlay.style.display = "none";
    SyBiliOverlay.style.top = 0;
    SyBiliOverlay.style.left = 0;
    SyBiliOverlay.style.width = "100%";
    SyBiliOverlay.style.height = "100%";
    SyBiliOverlay.style.backgroundColor = "rgba(0,0,0,0.8)";
    SyBiliOverlay.style.zIndex = 999;

    // 元素：菜单主体 SyBiliMenu
    var SyBiliMenu = document.createElement('div');
    SyBiliOverlay.appendChild(SyBiliMenu);
    SyBiliMenu.style.position = "fixed";
    SyBiliMenu.style.top = "50%";
    SyBiliMenu.style.left = "50%";
    SyBiliMenu.style.width = "700px";
    SyBiliMenu.style.height = "500px";
    SyBiliMenu.style.backgroundColor = "white";
    SyBiliMenu.style.transform = "translate(-50%, -50%)";

    // 元素：菜单内部：顶栏
    var SyBiliMenuTopbar = document.createElement('div');
    SyBiliMenu.appendChild(SyBiliMenuTopbar);
    SyBiliMenuTopbar.innerText = "【SyBili】 B站自定义菜单 by Sydowlle （部分选项在页面刷新后生效）";
    SyBiliMenuTopbar.style.position = "fixed";
    SyBiliMenuTopbar.style.height = "22px";
    SyBiliMenuTopbar.style.width = "calc(100% - 10px)";
    SyBiliMenuTopbar.style.backgroundColor = "#aaaaaa";
    SyBiliMenuTopbar.style.paddingLeft = "10px";

    // 元素：菜单内部：顶栏：退出按键
    var SyBiliMenuTopbarQuit = document.createElement('a');
    SyBiliMenuTopbar.appendChild(SyBiliMenuTopbarQuit);
    SyBiliMenuTopbarQuit.innerHTML = "X";
    SyBiliMenuTopbarQuit.onclick = closeMenu;
    SyBiliMenuTopbarQuit.style.position = "fixed";
    SyBiliMenuTopbarQuit.style.right = 0;
    SyBiliMenuTopbarQuit.style.height = "22px";
    SyBiliMenuTopbarQuit.style.width = "22px";
    SyBiliMenuTopbarQuit.style.textAlign = "center";
    SyBiliMenuTopbarQuit.style.backgroundColor = "#e35b56";

    // 元素：菜单内部：侧栏容器
    var SyBiliMenuLeft = document.createElement('div');
    SyBiliMenu.appendChild(SyBiliMenuLeft);
    SyBiliMenuLeft.style.position = "fixed";
    SyBiliMenuLeft.style.left = 0;
    SyBiliMenuLeft.style.top = "22px";
    SyBiliMenuLeft.style.height = "calc(100% - 22px)";
    SyBiliMenuLeft.style.width = "140px";
    SyBiliMenuLeft.style.backgroundColor = "#cccccc";

    // 元素：菜单内部：侧栏容器：侧栏列表
    var SyBiliMenuLeftList = document.createElement('ul');
    SyBiliMenuLeft.appendChild(SyBiliMenuLeftList);
    // 第一个选择项：预设
    var SyBiliMenuLeftListContent_0 = document.createElement('li');
    SyBiliMenuLeftList.appendChild(SyBiliMenuLeftListContent_0);
    SyBiliMenuLeftListContent_0.innerText = "预设";
    SyBiliMenuLeftListContent_0.className = "SyBiliMenuLeftListContent";
    SyBiliMenuLeftListContent_0.onclick = () => {
        // console.log("li_0");
        switchPage(0);
    }
    // 第二个选择项：首页设置
    var SyBiliMenuLeftListContent_1 = document.createElement('li');
    SyBiliMenuLeftList.appendChild(SyBiliMenuLeftListContent_1);
    SyBiliMenuLeftListContent_1.innerText = "首页设置";
    SyBiliMenuLeftListContent_1.className = "SyBiliMenuLeftListContent";
    SyBiliMenuLeftListContent_1.onclick = () => {
        // console.log("li_1");
        switchPage(1);
    }
    // 第三个选择项：播放页设置
    var SyBiliMenuLeftListContent_2 = document.createElement('li');
    SyBiliMenuLeftList.appendChild(SyBiliMenuLeftListContent_2);
    SyBiliMenuLeftListContent_2.innerText = "播放页设置";
    SyBiliMenuLeftListContent_2.className = "SyBiliMenuLeftListContent";
    SyBiliMenuLeftListContent_2.onclick = () => {
        // console.log("li_2");
        switchPage(2);
    }

    // 元素：菜单内部：设置页面
    // 页面队列，准备三个页面
    var SyBiliMenuPages = [];
    SyBiliMenuPages.push(document.createElement("div"));
    SyBiliMenuPages.push(document.createElement("div"));
    SyBiliMenuPages.push(document.createElement("div"));
    // SyBiliMenuPages[0].className = "SyBiliMenuPages";
    // 页面统一设置
    SyBiliMenuPages.forEach(function (page, pageIndex) {
        page.style.display = "none";
        page.style.position = "fixed";
        page.style.right = 0;
        page.style.bottom = 0;
        page.style.height = "478px";
        page.style.width = "560px";
        page.style.backgroundColor = "white";
        SyBiliMenu.appendChild(page);
    });
    SyBiliMenuPages[0].style.display = "block"; // 默认显示第 0 页



    // 函数：将菜单页面切换到第 pageIndex 页，pageIndex 从 0 开始
    function switchPage(pageIndex) {
        SyBiliMenuPages.forEach(function (page) {
            page.style.display = "none";
        });
        SyBiliMenuPages[pageIndex].style.display = "block";
    }


    // 函数：增加一个设置项，返回设置项对应的 <li> 元素；不包含 onclick 函数，需要额外设置
    function addBinarySetting(pageIndex, settingName, cookieName) {
        var mainList = SyBiliMenuPages[pageIndex].firstChild; // 获取列表元素
        var tempLi = document.createElement('li'); // 创建临时列表项
        mainList.appendChild(tempLi);
        tempLi.className = "SyBiliMenuLeftListContent";
        var tempOption = getCookieByName(cookieName); // 获取 cookie
        if (tempOption === null) { // 如果没有对应cookie，则置零
            setCookiePermanent(cookieName, "no");
            tempOption = "no";
        }
        tempLi.innerHTML = settingName + ": " + tempOption;
        return tempLi;
    }

    // 元素：菜单内部：页面一（预设）
    var SyBiliMenuMainList_0 = document.createElement('ul');
    SyBiliMenuPages[0].appendChild(SyBiliMenuMainList_0);
    // 设置项 0.1
    var tempLi = addBinarySetting(0, "首页简化（优先于首页设置页面中的选项）", "simpleForepage")
    tempLi.onclick = function () {
        toggleCookie("simpleForepage"); // 转换二元 cookie
        this.innerHTML = "首页简化（刷新生效）: " + getCookieByName("simpleForepage");
        if (getCookieByName("simpleTopbar") == "yes") forepageSimpleTopbar();
    }

    // 设置项 0.2
    var tempLi = addBinarySetting(0, "首页专注模式", "forepageFocusMode")
    tempLi.onclick = function(){
        toggleCookie("forepageFocusMode");
        this.innerHTML = "首页专注模式（刷新生效）: " + getCookieByName("forepageFocusMode");
        if (getCookieByName("forepageFocusMode") == "yes") forepageFocusMode();
    }

    // 未完成 ........................


    // 元素：菜单内部：页面二（首页设置）
    var SyBiliMenuMainList_1 = document.createElement('ul');
    SyBiliMenuPages[1].appendChild(SyBiliMenuMainList_1);
    // 设置项 1.1
    var tempLi = addBinarySetting(1, "简化顶部导航栏", "forepageSimpleTopbar")
    tempLi.onclick = function () {
        toggleCookie("forepageSimpleTopbar"); // 转换二元 cookie
        this.innerHTML = "简化顶部导航栏: " + getCookieByName("forepageSimpleTopbar"); // 修改设置项的字符串
        if (getCookieByName("forepageSimpleTopbar") == "yes") forepageSimpleTopbar();
    }
    // 设置项 1.2
    var tempLi = addBinarySetting(1, "不显示推广卡片", "dontShowStreamCard")
    tempLi.onclick = function(){
        toggleCookie("dontShowStreamCard");
        this.innerHTML = "不显示推广卡片: " + getCookieByName("dontShowStreamCard");
        if (getCookieByName("dontShowStreamCard") == "yes") dontShowStreamCard();
    }
    // 设置项 1.3
    var tempLi = addBinarySetting(1, "不显示首页滚动框", "dontShowSwipeAd")
    tempLi.onclick = function(){
        toggleCookie("dontShowSwipeAd");
        this.innerHTML = "不显示首页滚动框: " + getCookieByName("dontShowSwipeAd");
        if (getCookieByName("dontShowSwipeAd") == "yes") dontShowSwipeAd();
    }


    // 元素：菜单内部：页面三（播放页设置）
    var SyBiliMenuMainList_2 = document.createElement('ul');
    SyBiliMenuPages[2].appendChild(SyBiliMenuMainList_2);
    // 设置项 2.1
    var tempLi = addBinarySetting(2, "播放页简化顶部导航栏", "videopageSimpleTopbar")
    tempLi.onclick = function () {
        toggleCookie("videopageSimpleTopbar"); // 转换二元 cookie
        this.innerHTML = "播放页简化顶部导航栏: " + getCookieByName("videopageSimpleTopbar"); // 修改设置项的字符串
        if (getCookieByName("videopageSimpleTopbar") == "yes") videopageSimpleTopbar();
    }
    // 设置项 2.2
    var tempLi = addBinarySetting(2, "播放页不显示推荐栏", "videopageHideRecommend")
    tempLi.onclick = function () {
        toggleCookie("videopageHideRecommend"); // 转换二元 cookie
        this.innerHTML = "播放页不显示推荐栏: " + getCookieByName("videopageHideRecommend"); // 修改设置项的字符串
        if (getCookieByName("videopageHideRecommend") == "yes") videopageHideRecommend();
    }

} // mainMenu 菜单加载函数


// 主逻辑：页面加载后执行
window.onload = function(){
    // 加载主菜单按钮与主菜单
    if(window.location.href.split("/")[3] == 'video'){
        // 播放页中，要等到评论区加载完成后加载，否则会被覆盖
        var commentapp = document.querySelector("#commentapp");
        const observer = new MutationObserver(function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === "childList") {
                    // console.log("播放页：加载 SyBili 主菜单")
                    mainMenu();
                    setTimeout(function(){mainMenu()}, 1000);
                }
            }
        });
        const config = { attributes: true, childList: true, subtree: true };
        observer.observe(commentapp, config);
    }else{
        // 其他情况，直接加载即可
        mainMenu();
    }

    // 脚本函数随页面启动
    // 常驻：删除 adblock 警告栏
    removeAdblockWarning()
    // 首页部分
    if(window.location.href.split("/")[2] == 'www.bilibili.com' && window.location.href.split("/")[3] != 'video'){
        if(getCookieByName("forepageSimpleTopbar") == "yes" || getCookieByName("simpleForepage") == "yes"){
            forepageSimpleTopbar();
        }
        if(getCookieByName("dontShowStreamCard") == "yes" || getCookieByName("simpleForepage") == "yes"){
            dontShowStreamCard();
        }
        if(getCookieByName("dontShowSwipeAd") == "yes" || getCookieByName("simpleForepage") == "yes"){
            dontShowSwipeAd();
        }
        if(getCookieByName("forepageFocusMode") == "yes"){
            forepageFocusMode();
        }
    }
    if(window.location.href.split("/")[3] == 'video'){
        if(getCookieByName("videopageSimpleTopbar") == "yes"){
            setTimeout(function(){ // 页面会检测，延迟执行
                videopageSimpleTopbar();
            }, 3000);
        }
        if(getCookieByName("videopageHideRecommend") == "yes"){
            videopageHideRecommend();
        }
    }




} // window.onload function