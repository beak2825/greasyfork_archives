// ==UserScript==
// @name         Porn_Plus
// @namespace    J8Trade
// @version      0.3.1_beta
// @description  Make a better Porn Website browsing experience!</br> 让你有一个更好的簧片站浏览体验！
// @author       Lord2333
// @include      /^https?:\/\/(\w*\.)?javdb(\d)*\.com.*$/
// @match        http*://jable.tv/*
// @match        http*://twitter.com/*
// @match        http*://x.com/*
// @match        http*://www.summer-plus.net/*
// @match        https://jinjier.art/*
// @icon         https://c0.jdbstatic.com/images/logo_120x120.png
// @connect      jable.tv
// @connect      missav.com
// @connect      avgle.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/485832/Porn_Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/485832/Porn_Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const Config={
        MyPage: ["https://www.summer-plus.net/read.php?tid=2080398", "https://t.me/MrHenti"],
        javDBOfficial: "https://javdb.com",//==============================================================》JAVDB主站
        onlineWatch: ["https://jable.tv", "https://missav.com", "https://avgle.com"],//====================》在线观看网站
        removeAppAD: true, //==============================================================================》*关闭广告和APP推广
        vpnNotice: true, //================================================================================》*镜像网站提示
        loadThreshold: 0.75,//=============================================================================》*瀑布流预加载滚动阈值（滚动到页面的哪里才开始加载下一页），填写1.1即可关闭全部瀑布流功能
        loadForTextinfo: false,//==========================================================================》瀑布流加载是否在文字页面启用（关闭则只在首页和搜索结果页面启用瀑布流）
        settingMenu: true,//===============================================================================》设置按钮
        autoDarkMode: false,//=============================================================================》自动切换暗色模式
        safeMode: 0,//=====================================================================================》*安全标题模式，0-关闭；1-宽松模式；2-伪装模式;3-自毁模式
        titleInfo: ["百度一下，你就知道", "https://www.baidu.com/favicon.ico", "passwd"],//================》伪装页面的参数，第一个是favicon地址，第二个是标题，第三个是伪装页面的密码
        codeJump:true,//===================================================================================》自动搜索全局文本，替换疑似番号的文本为Javdb的链接
    }

    var Var = {
        nextPageUrl: "",
        isLoading: false,
        lastDigit: 0
    }

    //=====================================================================================================》正则匹配公式
    var Regex = {
        Num: /\d+$/, //=============================================================================》匹配链接最后的数字
        JAVDBhome: /^https?:\/\/(\w*\.)?javdb(\d)*\.com\/$/,//======================================》匹配JAVDB首页
        JAVDBpages: /^https?:\/\/(\w*\.)?javdb(\d)*\.com\/[a-zA-Z]+/,//=============================》匹配JAVDB列表页面
        JAVDBpage: /https:\/\/javdb\.com\/.*\?[^=]+=[^&]+&page=\d+/,//==============================》匹配page参数
        JAVDBvideo: /^https?:\/\/(\w*\.)?javdb(\d)*\.com\/v\/[a-zA-Z0-9]+$/,//======================》匹配JAVDB视频详情页
        JAVDBuser: /^https?:\/\/(\w*\.)?javdb(\d)*\.com\/users+$/,//================================》匹配JAVDB个人页面
        JAVDBrankings: /^https?:\/\/(\w*\.)?javdb(\d)*\.com\/rankings+/, //=========================》匹配JAVDB推荐
        JABLEvideo: /https?:\/\/(\w*\.)?jable.tv\/videos+/,//=======================================》匹配JABLE视频页面
        CodeForm: /\b([a-zA-Z]{4,}-?\d{3,})\b/g,//==================================================》匹配番号
    };

    //=========================================================================================================》toolkit
    // 安全模式，不怕社死啦
    function safeMode(){
        // 宽松模式，修改title和favicon
        var existingFavicons = document.querySelectorAll('link[rel="icon"]');
        existingFavicons.forEach(function(fav){fav.remove();});
        existingFavicons = document.querySelector('link[rel="apple-touch-icon"]');
        existingFavicons.remove();

        var newFavicon = document.createElement('link');
        newFavicon.rel = 'icon';
        newFavicon.type = 'image/png';
        newFavicon.href = Config.titleInfo[1];
        document.title = Config.titleInfo[0];
        document.head.appendChild(newFavicon);
        if(Config.safeMode == 2){ // 严格模式，添加蒙版伪装为百度
            fakePage(Config.titleInfo[2]);
        }else if(Config.safeMode == 3){ // 自毁模式，在切回原页面时直接关闭
            document.addEventListener('visibilitychange', function() {
                if (document.visibilityState != 'visible'){
                    try {
                        window.opener = window;
                        var win = window.open("", "_self");
                        win.close();
                    } catch (e) {
                    }
                }
            });
        }
    }

    // 伪装页面
    function fakePage(passwd){
        var overlay = document.createElement('div');
        overlay.id = 'page-overlay';
        overlay.innerHTML = `
        <div class="baidu-bg">
            <div class="baidu-container">
                <img src="https://www.baidu.com/img/flexible/logo/pc/result.png" alt="Baidu Logo" class="baidu-logo">
                <div class="baidu-box">
                    <input type="text" class="baidu-input" placeholder="百度一下，你就知道">
                    <button class="baidu-btn">百度一下</button>
                </div>
            </div>
        </div>
    `;
        document.body.appendChild(overlay);

        // 添加样式
        GM_addStyle(`
        #page-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: white;
            display: none;
            z-index: 9999;
            text-align: center;
            font-family: 'Arial', sans-serif;
        }

        .baidu-bg {
            background-size: cover;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: auto;
            margin-right: auto;
            margin-top: auto;
        }

        .baidu-container {
            background-color: rgba(255, 255, 255, 0.8);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }

        .baidu-logo {
            width: 100px;
            margin-bottom: 20px;
        }

        .baidu-box {
            display: flex;
            flex-direction: center;
            align-items: center;
        }

        .baidu-input {
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-bottom: 10px;
        }

        .baidu-btn {
            width: 40%;
            padding: 10px;
            font-size: 16px;
            background-color: #3385ff;
            color: white;
            border: none;
            border-radius: 5px;
            margin-bottom: 10px;
            cursor: pointer;
        }
    `);

        // 监听可见性变化事件
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                overlay.style.display = 'flex';
            } else {
                overlay.style.display = 'none';
            }
        });

        // 监听搜索按钮点击事件
        var searchBtn = document.querySelector('.baidu-btn');
        searchBtn.addEventListener('click', function() {
            var searchInput = document.querySelector('.baidu-input');
            if (searchInput.value === passwd) {
                overlay.style.display = 'none';
                searchInput.value = ''; // 清空搜索框防止露馅
            }else{
                window.open('https://www.baidu.com/s?wd=' + searchInput.value, '_blank');
            }
        });
    }

    // 获取Cookie参数
    function getCookieValue(cookieName) {
        var name = cookieName + '=';
        var decodedCookie = decodeURIComponent(document.cookie);
        var cookieArray = decodedCookie.split(';');
        for (var i = 0; i < cookieArray.length; i++) {
            var cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return '';
    }

    // 修改回到顶部按钮并添加菜单按钮
    function addButton(){
        var navbars = document.querySelectorAll('.navbar-link');
        navbars[5].remove();
        navbars[6].remove();
        var settingButton = document.createElement('div');
        settingButton.className = 'setting-button';
        settingButton.textContent = '⚙设置';
        document.body.appendChild(settingButton);

        var menuContainer = document.createElement('div');
        menuContainer.className = 'menu-container';
        menuContainer.innerHTML = `
            <button id="darkModeButton">🌙黑暗模式</button><br>
            <button id="languageButton">🔤English</button><br>
            <button id="nanjia">南加：shixiong</button>
            <button id="tg">TG：隔壁的混子</button>
        `;

        // 将弹窗添加到页面
        document.body.appendChild(menuContainer);

        // 添加菜单按钮
        GM_addStyle(`
            .setting-button {
                position: fixed;
                top: 60px;
                right: 5px;
                overflow: show;
                outline: none;
                border: none;
                cursor: hand;
                font-size: .8rem;
                z-index: 1000;
                display: table
            }
            .menu-container {
                position: fixed;
                top: 60px;
                right: 5px;
                width: 150px;
                padding: 10px;
                background-color: RGBA(255,255,255, 0.3);
                border: 1px solid #ccc;
                border-radius: 5px;
                display: none;
                z-index: 1001;
            }
        `);

        // 按钮点击事件处理
        settingButton.addEventListener('click', function() {
            settingButton.style.display = (settingButton.style.display === 'table') ? 'none' : 'table';
            menuContainer.style.display = (menuContainer.style.display === 'none') ? 'block' : 'none';
        });
        var darkModeButton = document.getElementById('darkModeButton');
        var languageButton = document.getElementById('languageButton');
        var nanjiaButton = document.getElementById('nanjia');
        var tgButton = document.getElementById('tg');

        var theme, langUrl;
        if(getCookieValue("locale") == "zh"){langUrl = window.location.origin+"/?locale=en";languageButton.innerText="English";}else{langUrl = window.location.origin+"/?locale=zh";languageButton.innerText="中文";}
        darkModeButton.addEventListener('click', function() {
            theme = document.documentElement.getAttribute('data-theme');
            if(theme == "auto" || theme == "light"){theme = "dark";darkModeButton.innerText="☀️亮色模式";}else{theme = "light";darkModeButton.innerText="🌙黑暗模式";}
            document.documentElement.setAttribute('data-theme', theme)
        });
        languageButton.addEventListener('click', function() {
            GM_xmlhttpRequest({
                method: 'GET',
                url: langUrl,
                headers: {
                    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                },
                onload: function(response) {
                    window.location.reload();
                },
            });
        });
        nanjiaButton.addEventListener('click', function(){window.open(Config.MyPage[0], "_blank");});
        tgButton.addEventListener('click', function(){window.open(Config.MyPage[1], "_blank");});
        document.addEventListener('click', function(event) {
            if (!settingButton.contains(event.target) && event.target !== settingButton) {
                menuContainer.style.display = 'none';
                settingButton.style.display = 'table';
            }
        });
    }

    // 关闭顶部和底部安装APP提示，和页面内广告
    function removeAppAD(){
        var app = document.querySelector(".app-desktop-banner");
        var sub_header = document.querySelector(".sub-header");
        var page_AD = document.querySelector(".top-meta");
        if(app){try{
            app.remove();sub_header.remove();page_AD.remove();
        }catch{}}
    }

    // 检查网站连通性
    function checkWebsites(websites, outtime) {
        var promises = websites.map(function(website) {
            return new Promise(function(resolve) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: website,
                    outtime: outtime,
                    onload: function(response) {
                        resolve({ website: website, status: response.status });
                    },
                    onerror: function(error) {
                        resolve({ website: website, error: error.message });
                    }
                });
            });
        });
        return Promise.all(promises);
    }

    // 镜像站检测
    function vpnNotice(){
        const url = window.location.href;
        if(!Regex.JAVDBhome.test(url)){return;}
        if (!url.startsWith(Config.javDBOfficial) ) {
            var confirmation = confirm("您正在使用镜像站，javPlus脚本可能无法正常工作！\n点击确定将跳转到主站。");
            if (confirmation) {
                var newPath = url.replace(/^(https?:\/\/)[a-zA-Z0-9]+\.com\//, "$1www.javdb.com/");
                window.location.href = newPath;
            }else{
                var temp;
                checkWebsites(Config.onlineWatch, 1500).then(function(results) {
                    temp = results.map(function(reslut) {
                        if (reslut.status == 200) {
                            return "可以连接至："+ reslut.website;
                        } else {
                            return "无法连接至："+ reslut.website;
                        }
                    }).join("\n");
                    window.alert(temp);
                });
            }
        }
    }

    // 检查是否滚动到页面底部或当前页面无下一页
    function isScrollAtBottom() {
        var scrollHeight = document.documentElement.scrollHeight;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var clientHeight = document.documentElement.clientHeight;

        return (scrollHeight - scrollTop - clientHeight) < ((1 - Config.loadThreshold) * scrollHeight);
    }

    // 获取下页数据
    function getNextPage(pageurl){
        GM_xmlhttpRequest({
            method: 'GET',
            url: pageurl,
            headers: {
                'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            onload: function(response) {
                try{
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(response.responseText, 'text/html');
                    var targetDiv = doc.querySelector('div.movie-list.h');
                    var itemsArray = extractItems(targetDiv);
                    renderData(itemsArray);
                }
                catch{ return;}
            },
            onerror: function(error) {
                console.error('Error loading page:', error);
            }
        });
    }

    // 提取 <item> 标签的内容
    function extractItems(targetDiv) {
        var itemsArray = [];
        if (targetDiv) {
            var items = targetDiv.querySelectorAll('.item');
            items.forEach(function(item) {
                var cover = item.querySelector('.cover');
                cover.classList.add('contain');
                itemsArray.push(item.outerHTML.trim());
            });
        }
        return itemsArray;
    }

    // 模拟渲染数据到页面
    function renderData(items) {
        var container = document.querySelector('.movie-list.h');
        items.forEach(function(item){
            container.innerHTML += item;
        });
        Var.isLoading = false;
    }

    // 检测当前页面链接
    function checkPageUrl(){
        var currentUrl = window.location.href;
        if (currentUrl.includes("javdb")){ //=============================================================》JavDB
            if(!Regex.JAVDBvideo.test(currentUrl) && !Regex.JAVDBuser.test(currentUrl) && !Regex.JAVDBrankings.test(currentUrl)){ // 排除的页面
                if (Regex.JAVDBhome.test(currentUrl)) { // 如果当前页面是网站首页
                    if(!Var.lastDigit){Var.lastDigit=1;}
                    Var.lastDigit += 1;
                    Var.nextPageUrl = currentUrl + "?page=" + Var.lastDigit.toString();
                    return Var.nextPageUrl;
                }else if(Regex.JAVDBpages.test(currentUrl)){ // 在非首页的页面里
                    if(Regex.JAVDBpage.test(currentUrl)){ Var.lastDigit = parseInt(currentUrl.match(Regex.Num));}
                    else if(!Var.lastDigit){Var.lastDigit = 1}
                    Var.lastDigit += 1;
                    Var.nextPageUrl = currentUrl+ "&page=" +Var.lastDigit.toString();
                    return Var.nextPageUrl;
                }
            }
        }
    }

    // 添加页面下载按钮
    function downloadButton(){
        var pageUrl = window.location.href;
        if(Regex.JABLEvideo.test(pageUrl)){
            var my3 = document.querySelector('.my-3');
            var secondChild = my3.children[1];
            var buttonElement = '<button id="downloadBtn" data-fav-type="1" class="btn btn-action "><svg height="18" width="16"><use xlink:href="#icon-download"></use></svg></button>';
            secondChild.insertAdjacentHTML('afterend', buttonElement);
        }
    }

    // 移除推特敏感内容遮罩
    function removeXfilter(){
        GM_addStyle(`
                    .media-preview-with-warning > .js-media-preview-container,
                    .media-preview-with-warning > [class^='media-grid'] {
            filter: blur(0px) !important;
        }

        .js-media.full-bleed-media-preview-with-warning > .js-media-preview-container > .js-media-image-link,
            .js-media.full-bleed-media-preview-with-warning > [class^='media-grid'] {
                filter: blur(0px) !important;
            }

        .media-warning {
            display: none !important;
        }

        .r-yfv4eo {
            filter: blur(0px) !important;
        }
        .r-drfeu3 {
            display: none !important;
        }
        .r-yfv4eo + .r-1777fci {
            display: none !important;
        }
        `);
    }

    function codeJump(){
        //正则规则
        const pattern = /(^|\b|[^a-z0-9])([a-z]{3,6}-?\d{3})(\b|[^a-z0-9]|$)/gi;
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            { acceptNode: node => node.parentNode.closest('a') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT }
        );

        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);

        nodes.forEach(node => {
            let lastIndex = 0;
            const newHTML = node.nodeValue.replace(pattern, (match, prefix, code, suffix, offset) => {
                // 边界验证（防止部分匹配）
                const validPrefix = !prefix || /[\s\[({]/.test(prefix);
                const validSuffix = !suffix || /[\s\])}]/.test(suffix);
                if (validPrefix && validSuffix) { // 总长度验证
                    return `${prefix}<a href="https://javdb.com/search?q=${encodeURIComponent(code.toUpperCase())}&f=all"
                        style="all:unset; cursor:pointer; color:inherit; text-decoration:underline"
                        target="_blank">${code}</a>${suffix}`;
                }
                return match;
            });

            if (newHTML !== node.nodeValue) {
                const wrapper = document.createElement('span');
                wrapper.innerHTML = newHTML;
                node.parentNode.replaceChild(wrapper, node);
            }
        });
    }

    //=========================================================================================================》Main
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        if (isScrollAtBottom()) {
            if (Var.isLoading){return;}
            Var.isLoading = true;
            if(checkPageUrl()){
                getNextPage(Var.nextPageUrl);
            }
        }
    });

    function main(){
        if(Config.vpnNotice){vpnNotice();}
        if(Config.removeAppAD){removeAppAD();}
        if(Config.safeMode){safeMode();}
        if(Config.codeJump){codeJump();}
        if(!GM_getValue('init')){window.alert("注意！\n您正在使用测试中的版本，遇到任何问题可以点击设置按钮中的跳转按钮进行反馈！");GM_setValue('init', true);}
        removeXfilter();
    }
    downloadButton();
    window.onload = main();
    window.onload = addButton;

})();