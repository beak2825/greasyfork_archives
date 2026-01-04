// ==UserScript==
// @name         98搜索增强
// @version      1.2.4
// @description  在搜索页进行搜索结果过滤、自动翻页、帖子预览，划词搜索
// @author       etai2019
// @license      GPL-3.0 License
// @match        https://*.sehuatang.net/*
// @match        https://*.sehuatang.org/*
// @match        https://*.30fjp.com/*
// @match        https://*.18stm.cn/*
// @match        https://*.jq2t4.com/*
// @match        https://*.xo6c5.com/search.php?*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @require      https://update.greasyfork.org/scripts/447533/1214813/findAndReplaceDOMText%20v%20046.js
// @namespace    etai2019
// @downloadURL https://update.greasyfork.org/scripts/465663/98%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/465663/98%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

const clearCfg = false,
      clearCfgDebug = false;

// 初始化参数
if (clearCfgDebug || (clearCfg && GM_getValue('version') != GM_info.script.version) ){
    for (let i of GM_listValues()) {
        GM_deleteValue(i)
    }

    GM_setValue('version', GM_info.script.version)
}

// 初始化 setting
var default_settings = {
    "AutoScroll": {
        "Description": "自动翻页",
        "Enable": true,
    },
    "Includes": {
        "Description": "只看关键词",
        "Keywords": ["综合讨论区","高清中文字幕"],
    },
    "Excludes": {
        "Description": "排除关键词",
        "Keywords": ["资源出售","求片问答","内容隐藏","搬运","SHA1"],
    },
    "Banned": {
        "Description": "关键词黑名单，作用相当于排除关键词，但不会出现在搜索结果的可选框里",
        "Keywords": [],
    },
    "SelectSearch": {
        "Description": "划词搜索",
        "Enable": true,
    },
    "PreviewImage" : {
        "Enable": false,
        "Width": "90vw",
        "Height": "50vh",
    },
    "ScaleImageByWheel": {
        "Description": "滑鼠标缩放",
        "Unit": 0.3,
        "Enable": true
    },
    "Highlight": {
        "Description": "高亮关键词",
        "Keywords": "明里",
        "Enable": false,
    }
};
const settings = Object.assign({}, default_settings, GM_getValue("_98settings") || {});

// 初始化 脚本内部setting
var default_settings2 = {
    "ExcludedValues": [],
    "IncludedValues": [],
}
const settings2 = Object.assign({}, default_settings2, GM_getValue("_98settings2") || {});

// 添加样式
GM_addStyle(`
    .highlight {
        font-size: 1.2em;
        font-weight: bolder;
        background-color: yellow;
    }
    .slst {
        width: 1200px;
        margin-left: 30px;
    }
    .s2-sav-menu{
        font-family: Microsoft YaHei,sans-serif;
        position:fixed;
        display: block;
        text-align: left;
        color: #000;
        background:rgba(255,255,255,.8);
        backdrop-filter: blur(5px);
        border-radius: 4px;
        padding:6px 12px 10px 9px;
        /* margin-top: -2px; */
        z-index: 99999;
        font-size: 14px;
        max-width: 600px;
        box-shadow: 4px 4px 12px #ccc, -1px -1px 5px #eee;
        border-top: 2px solid #fff;
        border-left: 2px solid #fff;
        transform:scale(1);
        transition:0.2s;
        transition-timing-function: ease-out;
        animation: savOpenAnim 0.15s;
    }
    .savlink{
        margin: 4px 4px 4px 4px;
        border-radius: 4px;
        padding: 3px 5px;
        background: #fff;
        display: inline-block;
        transition: 0.2s;
        transition-timing-function: ease-out;
        box-shadow: -2px -2px 4px rgb(240 240 240), 2px 2px 4px rgb(70 70 70 / 50%);
        cursor: pointer;
        user-select: none;
    }
    .savlink:not(.RPdisabled):hover{
        background: aliceblue;
        box-shadow: -2px -2px 6px rgb(255 255 255 / 50%), 1px 1px 2px rgb(70 70 70 / 50%), inset -2px -2px 6px rgb(255 255 255 / 50%),inset 2px 2px 6px rgb(100 100 100 / 50%);
    }
    .s2-sav-menu .savlink a{
        color:#459df5;
        text-decoration:none;
        transition:0.4s;
    }
    .s2-sav-menu .savlink:not(.RPdisabled):hover a {
        color: #039cff;
        text-shadow: 0 0 #7cfb80;
    }

    .settings-container {
        font-family: Arial;
        font-size: 16px;
        color: #333;
        border: 1px solid #ccc;
        padding: 2px;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
    }

    .checkbox-group {
        display: flex;
        gap:.5em;
        font-family: Arial;
        font-size: 16px;
    }

    .checkbox-group label {
        display: block;
    }

    .like-popup {
        width: 30%;
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 999;
        background-color: #ddd;
        border: 1px solid;
        padding: 5px;
    }

    .like-popup-content{
        font-size: 2em;
        margin-bottom: 1.5em;
    }

    .like-popup h5{
        font-size: 1.5em;
    }

    .preview-img {
        max-width: 49%;
        max-height: 100%;
        border: 1px solid;
        position: relative;
    }
`);

(function() {
    'use strict';

    // 设置菜单
    GM_registerMenuCommand("设置", function() {
        var editbox = document.createElement("div");
        editbox.id = "sav-editCodeBox";
        editbox.style.cssText = "position:fixed;" +
            "z-index:99999;" +
            "top:50%;left:50%;" +
            "transform:translate(-50%,-50%);" +
            "background:#ccc;" +
            "border-radius:4px;" +
            "padding:10px 20px;" ;
        editbox.innerHTML = " "+
            "<textarea wrap='off' cols='66' rows='20' style='overflow:auto;border-radius:4px;'>" + JSON.stringify(settings, false, 4) + "</textarea>" +
            "<br>" +
            "<button id='savDebug'>还原默认设置</button> &nbsp;&nbsp;&nbsp;" +
            "<button id='savEditBoxCloase' >关闭</button> &nbsp;&nbsp;&nbsp;" +
            "<button id='savEditBoxSave' >保存</button>" +
            "";

        // 还原默认设置
        editbox.querySelector("#savDebug").addEventListener("click", function() {
            document.querySelector("#sav-editCodeBox textarea").value = JSON.stringify(default_settings, false, 4);
        })

        // 关闭设置
        editbox.querySelector("#savEditBoxCloase").addEventListener("click", function() {
            editbox.parentNode.removeChild(editbox);
        });

        // 保存设置
        editbox.querySelector("#savEditBoxSave").addEventListener("click", function() {
            var codevalue = document.querySelector("#sav-editCodeBox textarea").value;
            var new_settings;
            try {
                new_settings = JSON.parse(codevalue);
            } catch(err){
                alert("保存失败,请按照下方提示修改后重新保存\n"+err);
                return;
            }

            GM_setValue("_98settings", new_settings);
            editbox.parentNode.removeChild(editbox);
            setTimeout(function(){
                window.location.reload();
            }, 100);
        })

        document.body.appendChild(editbox);
    })

    // 高亮关键词
    if (settings.Highlight.Enable) {
        HighlightKeywords();
    }


    // 划词搜索
    if (settings.SelectSearch.Enable) {
        document.onmouseup = SelectSearch;
    }

    // 搜索增强
    var curSite = {}
    const isSearchResultPage = window.location.href.includes('search.php');
    if (isSearchResultPage) {
        SetupNewSearch();
    }

    // 函数区域

    // 搜索增强
    function SetupNewSearch() {
        // 自动翻页
        if (settings.AutoScroll.Enable) {
            curSite = {
                SiteTypeID: 641,
                pageurl: "",
                pager: {
                    forceHTTPS: true,
                    interval: 500,
                    nextL: "a.nxt:not([href^=\"javascript\"]) ,a.next:not([href^=\"javascript\"])",
                    pageE: "#threadlist > ul",
                    replaceE: ".pg, .pages",
                    scrollD: 2000,
                    type: 1
                },
                pausePage: false,
                pageNum: { now: 1, _now: 1 },
            }

            RegisterAutoScroll();

            // 分页放在最上面
            const pgDiv = document.querySelector('.pgs');
            if (pgDiv != null) {
                document.querySelector('.sttl').insertAdjacentElement('afterend', pgDiv);
            }
        }


        // 推广弹窗
        const likePopup = document.createElement('div');
        likePopup.className = 'like-popup';
        likePopup.style.setProperty('display', 'none')
        document.body.appendChild(likePopup);
        likePopup.innerHTML = `
            <div class='like-popup-content'>
                <p>好用请给作者评分点赞吧~</p>
                <p>（版本大更新，弹窗一次，望理解）</p>
            </div>
            <h5><a href="forum.php?mod=viewthread&tid=1508541" target="_blank">好的，打开帖子</a></h5>
            <h5><a href="javascript:document.querySelector('.like-popup').style.setProperty('display', 'none')">关闭</a></h5>
        `;

        // 创建多选框组
        const exclusionCheckboxGroup = document.createElement('div');
        exclusionCheckboxGroup.className = 'checkbox-group';
        exclusionCheckboxGroup.appendChild(ele('<span>排除</span>'));
        for (const keyword of settings.Excludes.Keywords) {
            exclusionCheckboxGroup.appendChild(ele(`<label><input type="checkbox" class="exclusion" value="${keyword}"/>${keyword}</label>`));
        }

        const inclusionCheckboxGroup = document.createElement('div');
        inclusionCheckboxGroup.className = 'checkbox-group';
        inclusionCheckboxGroup.appendChild(ele('<span>只看</span>'));
        for (const keyword of settings.Includes.Keywords) {
            inclusionCheckboxGroup.appendChild(ele(`<label><input type="checkbox" value="${keyword}"/>${keyword}</label>`));
        }

        // 当多选框选项更改时，将所选值保存到脚本中
        exclusionCheckboxGroup.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            checkbox.addEventListener('change', (event) => {
                const excludedValues = Array.from(exclusionCheckboxGroup.querySelectorAll('input[type="checkbox"]:checked')).map((checked) => checked.value);
                settings2.ExcludedValues = excludedValues;
                SaveSettings2();

                // 移除搜索结果
                RemoveSearchResutls();
            });
        });

        inclusionCheckboxGroup.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            checkbox.addEventListener('change', (event) => {
                const includedValues = Array.from(inclusionCheckboxGroup.querySelectorAll('input[type="checkbox"]:checked')).map((checked) => checked.value);
                settings2.IncludedValues = includedValues;
                SaveSettings2();

                // 移除搜索结果
                RemoveSearchResutls();
            });
        });

        // 读取所选值
        const excludedValues = settings2.ExcludedValues;
        const includedValues = settings2.IncludedValues;

        // 恢复之前的选择
        excludedValues.forEach((selectedValue) => {
            const checkboxElement = exclusionCheckboxGroup.querySelector(`input[value="${selectedValue}"]`);
            if (checkboxElement) {
                checkboxElement.checked = true;
            }
        });

        includedValues.forEach((selectedValue) => {
            const checkboxElement = inclusionCheckboxGroup.querySelector(`input[value="${selectedValue}"]`);
            if (checkboxElement) {
                checkboxElement.checked = true;
            }
        });

        // 超级模式快捷方式
        const turboModeSwitch = ele(`<div><label><input type="checkbox" value="超级模式"/>超级模式</label></div>`);
        turboModeSwitch.querySelector(`input`).checked = settings.PreviewImage.Enable;
        turboModeSwitch.querySelector(`input`).addEventListener('change', (event) => {
            settings.PreviewImage.Enable = !settings.PreviewImage.Enable;
            GM_setValue("_98settings", settings);
            setTimeout(function(){
                window.location.reload();
            }, 100);
        });

        // 添加页面元素
        const searchForm = document.querySelector('.searchform');
        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'settings-container';
        searchForm.appendChild(settingsContainer);

        // 将多选框组添加到页面中
        const keywordSettings = document.createElement('div');
        keywordSettings.appendChild(exclusionCheckboxGroup);
        keywordSettings.appendChild(inclusionCheckboxGroup);
        settingsContainer.appendChild(keywordSettings);

        // 将超级模式快捷方式添加到页面中
        settingsContainer.appendChild(turboModeSwitch)

        // 初始时移除搜索结果
        RemoveSearchResutls();
    }

    // 高亮关键词
    function HighlightKeywords() {
        const oRegex = new RegExp(`${settings.Highlight.Keywords}`, "gi");
        findAndReplaceDOMText(document.body, {
            find: oRegex,
            wrap: 'avem',
            wrapClass: 'highlight'
        });
        // 创建观察者对象
        var observerConfig = {childList: true, characterData: true ,subtree:true,};
        var observer = new window.MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if(mutation.target.innerText.length < 5) {
                    return;
                }

                if(IsContentDom(mutation.target)) {
                    return;
                }

                if (mutation.target.innerText?.search(oRegex) <= -1) {
                    return;
                }

                observer.disconnect();  // 关闭对 dom 的监听

                console.log(mutation.target);
                // findAndReplaceDOMText(document.body, {
                //     find: new RegExp(`${settings.Highlight.Keywords}`, "gi"),
                //     wrap: 'avem',
                //     wrapClass: 'highlight'
                // });

                observer.observe(document.body, observerConfig);   // 开启对 dom 的监听
            })
        });

        // observer.observe(document.body, observerConfig)
    }

    // 检查是否为包含正文的Dom
    function IsContentDom(startDom){
        const RE_Exclude_className = /(?<!file)name|auth|user|(?<!home)code|^pstatus$|(?<!_tl_|ql-)editor|time|sav-id|sidebar|menu|TbwUpd/gi;

        if(startDom.classList && startDom.classList.length && startDom.className.match(RE_Exclude_className)){
            return true;
        }
        if(startDom.parentElement && "body" !== startDom.parentElement.nodeName){
            return IsContentDom(startDom.parentElement)
        } else {
            return false
        }
    }

    // 图片预览弹窗
    function DisplayPreviewBox(url) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                var parser = new DOMParser();
                var htmlDoc = parser.parseFromString(response.responseText, "text/html");
                var images = Array.from(htmlDoc.querySelectorAll(".zoom")).filter(image => !(image.getAttribute("zoomfile") || image.src || image.getAttribute('file')).includes('static'));
                if (!images || images.length == 0) return;
                if (images.length > 2) images.length = 2;

                var box = document.createElement("div");
                document.body.appendChild(box);
                box.classList.add("tk_preview");
                box.style.cssText = `
                    width: 99%;
                    border: 1px solid;
                    background-color: #ddd;
                    position: fixed;
                    top: 50%;
                    transform: translate(0%, -50%);
                    zIndex = 99999;
                `;

                box.addEventListener("click", function() {
                    document.body.removeChild(box);
                });

                for (let image of images) {
                    var preview = document.createElement("img");
                    box.appendChild(preview);

                    var src = image.getAttribute("zoomfile") || image.src || image.getAttribute('file');
                    preview.src = src;
                    preview.className = "preview-img"

                    if (settings.ScaleImageByWheel.Enable) {
                        preview.addEventListener("wheel",ImgScaleWheel);
                    }
                }
            }
        });
    }

    // 在搜索结果中直接加载图片
    function LoadPreviewsAndLinks(item) {
        if (!settings.PreviewImage.Enable) return;

        let linkTag = item.querySelector('a');

        GM_xmlhttpRequest({
            method: "GET",
            url: linkTag.href,
            onload: function(response) {
                const debug = false;
                var parser = new DOMParser();
                var htmlDoc = parser.parseFromString(response.responseText, "text/html");
                var images = Array.from(htmlDoc.querySelectorAll(".zoom")).filter(image => !(image.getAttribute("zoomfile") || image.src || image.getAttribute('file')).includes('static'));
                if  (!images || images.length == 0) return;
                if (images.length > 2) images.length = 2;

                let div = document.createElement('div');
                item.appendChild(div);
                div.style.width = settings.PreviewImage.Width;
                div.style.height = settings.PreviewImage.Height;
                div.classList.add('tk_preview_div');

                for (let image of images) {
                    var preview = document.createElement("img");
                    div.appendChild(preview);

                    const src = image.getAttribute("zoomfile") || image.src || image.getAttribute('file');
                    preview.src = src;
                    preview.className = "preview-img"

                    if (settings.ScaleImageByWheel.Enable) {
                        preview.addEventListener("wheel",ImgScaleWheel);
                        preview.addEventListener("click",ImgScaleClick);
                    }
                }

                if (debug) {
                    const code = htmlDoc.querySelector('.blockcode');
                    if (code != null) {
                        const magnet = code.querySelector('li').innerText
                        const magnetA = document.createElement('a');
                        magnetA.setAttribute('href', magnet);
                        magnetA.innerText = '🧲';
                        linkTag.parentNode.appendChild(magnetA);
                    }

                    const bt = htmlDoc.querySelector('.attnm');
                    if (bt != null) {
                        const btlink = bt.querySelector('a').href;
                        const btA = document.createElement('a');
                        btA.setAttribute('target', '_blank');
                        btA.setAttribute('href', btlink);
                        btA.innerText = '💾';
                        linkTag.parentNode.appendChild(btA);
                    }
                }
            }
        });
    }

    // 图片缩放
    const likePopupLifetimePages = 100;
    function ImgScaleWheel(e){
        if (!e.target.ImageScale) e.target.ImageScale = 1.0;
        if (!window.ImgIndex) window.ImgIndex = 100;

        var imageScale = e.target.ImageScale;
        if(e.target.tagName == "IMG"){
            e.target.style.zIndex = window.ImgIndex++;
            if(e.wheelDelta > 0){
                imageScale += settings.ScaleImageByWheel.Unit;

            // 推广弹窗
            const lifetimePages = (GM_getValue("lifetime_pages") ?? 0) + 1;
            const likePopupDisplayTimes = GM_getValue("likePopupDisplayTimes") ?? 0;
            if (likePopupDisplayTimes == 0 && lifetimePages >= likePopupLifetimePages) {
                document.querySelector('.like-popup').style.setProperty('display', 'block');
                GM_setValue("likePopupDisplayTimes", likePopupDisplayTimes + 1);
            }

            GM_setValue("lifetime_pages", lifetimePages);
            console.log("lifetime_pages:", lifetimePages);
            } else if(e.wheelDelta < 0){
                if(imageScale > 1){
                    imageScale -= settings.ScaleImageByWheel.Unit;
                }

                // 最小减至1
                if(imageScale <= 1){
                    imageScale = 1.0;
                    e.target.style = "";
                };
            }

            e.target.style.transform = "scale(" + imageScale +")";
        }

        e.target.ImageScale = imageScale;

        e.preventDefault();

        return false;
    }

    // 取消图片缩放
    function ImgScaleClick(e) {
        if(e.target.tagName == "IMG"){
            if (e.target.ImageScale) {
                e.target.ImageScale = 1.0;
            }

            e.target.style = "";
        }
    }

    // 尝试显示图片预览
    function DecorateResultItem(item) {
        if (item.styleDone) return;

        item.styleDone = true;

        // 删除搜索结果文本
        let p = item.querySelectorAll('p')[1]
        p.style.display = 'none';

        // 超级模式直接显示预览
        if (settings.PreviewImage.Enable) {
            LoadPreviewsAndLinks(item);
            return;
        }

        // 添加预览图片按钮
        var button = document.createElement("button");
        button.classList.add('tk-preview-button');
        button.style.marginRight = "10px";
        button.innerHTML = "预览图片";

        // 添加按钮点击事件
        let linkTag = item.querySelector('a');
        button.onclick = function() {
            // 获取链接的href属性
            DisplayPreviewBox(linkTag.href);
        };

        linkTag.parentNode.insertBefore(button, linkTag);
    }

    // 筛选搜索结果
    function RemoveSearchResutls() {
        // 读取所选值
        const excludedValues = settings2.ExcludedValues.concat(settings.Banned.Keywords);
        const includedValues = settings2.IncludedValues;

        // 获取搜索结果
        var items = document.querySelectorAll('.slst li');

        // 处理每一个搜索结果
        for (let item of items){
            const titleText = item.querySelector('a').innerText.toUpperCase();
            const forum = item.querySelector('.xi1').innerText;
            const preview = item.querySelector('.xg1').nextElementSibling.innerText;
            const resultText = titleText + forum + preview;

            // 只显示关键词
            let shouldShow = includedValues.length == 0 || includedValues.some(word => resultText.includes(word));

            if (shouldShow) {
                item.style.removeProperty('display');
            } else {
                item.style.display = "none";
                continue;
            }

            // 排除关键词
            let shouldHide = excludedValues.some(word => resultText.includes(word));
            if (shouldHide) {
                item.style.display = "none";
            } else {
                item.style.removeProperty('display');
                DecorateResultItem(item)
            }
        }
    };

    // 监听滚动条事件
    function WindowScroll(fn) {
        var beforeScrollTop = document.documentElement.scrollTop || document.body.scrollTop
        fn = fn || function () {};
        // 延时 1 秒执行，避免刚载入到页面就触发翻页事件
        setTimeout(function () {
            // 避免网页内容太少，高度撑不起来，不显示滚动条而无法触发翻页事件
            let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop,
                scrollHeight = window.innerHeight || document.documentElement.clientHeight
            if (scrollTop === 0 && document.documentElement.scrollHeight === scrollHeight) {
                const style = `html, body {min-height: ${document.documentElement.scrollHeight+10}px;}`;

                console.log('网页内容太少，高度撑不起来！！', style);
                document.documentElement.appendChild(document.createElement('style')).textContent = style;
            }

            window.addEventListener('scroll', function (e) {
                var afterScrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                    delta = afterScrollTop - beforeScrollTop;
                if (delta == 0) return false;
                fn(delta > 0 ? 'down' : 'up', e);
                beforeScrollTop = afterScrollTop;
            }, false);
        }, 1000)
    }

    // 将无缝翻页注册进监听器
    function RegisterAutoScroll() {
        if (curSite.pager.scrollD === undefined) curSite.pager.scrollD = 2000; // 默认翻页触发线 2000
        if (curSite.pager.interval === undefined) curSite.pager.interval = 500; // 默认间隔时间 500ms
        curSite.pageUrl = ''; // 下一页URL
        WindowScroll(function (direction, e) {
            // 下滑 且 未暂停翻页 且 SiteTypeID > 0 时，才准备翻页
            if (direction != 'down' || curSite.pausePage || curSite.SiteTypeID == 0) return

            let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
            let scrollHeight = window.innerHeight || document.documentElement.clientHeight
            let scrollD = curSite.pager.scrollD;

            if (document.documentElement.scrollHeight <= scrollHeight + scrollTop + scrollD) {
                intervalPause();
                GoToNextPage(LoadNextPage);
            }
        });

        function intervalPause() {
            if (curSite.pager.interval) {
                curSite.pausePage = true
                setTimeout(function(){curSite.pausePage = false;}, curSite.pager.interval)
            }
        }
    }

    // 检查 URL
    function GoToNextPage(func) {
        if (GetNextPageLink()) {
            func(curSite.pageUrl);
        }
    }

    // 通用型获取下一页地址（从 元素 中获取页码）
    function GetNextPageLink(css) {
        if (!css) css = curSite.pager.nextL;
        let next = QueryElement(css);
        if (next && next.nodeType === 1 && next.href && next.href.slice(0,4) === 'http' && next.getAttribute('href').slice(0,1) !== '#') {
            if (next.href != curSite.pageUrl) {
                if (curSite.pager.forceHTTPS && location.protocol === 'https:') {
                    if (next.href.replace(/^http:/,'https:') === curSite.pageUrl) {
                        return false
                    }
                    curSite.pageUrl = next.href.replace(/^http:/,'https:');
                } else {
                    curSite.pageUrl = next.href;
                }
            } else {
                return false
            }

            return true
        }
        return false
    }

    // 查询单个元素
    function QueryElement(selector, contextNode = undefined, doc = document) {
        if (!selector) return;

        contextNode = contextNode || doc;
        return contextNode.querySelector(selector);
    }

    function CreateDocumentByString(e) {
        if (e) {
            if ('HTML' !== document.documentElement.nodeName) return (new DOMParser).parseFromString(e, 'application/xhtml+xml');
            var t;
            try { t = (new DOMParser).parseFromString(e, 'text/html');} catch (e) {}
            if (t) return t;
            if (document.implementation.createHTMLDocument) {
                t = document.implementation.createHTMLDocument('ADocument');
            } else {
                try {((t = document.cloneNode(!1)).appendChild(t.importNode(document.documentElement, !1)), t.documentElement.appendChild(t.createElement('head')), t.documentElement.appendChild(t.createElement('body')));} catch (e) {}
            }
            if (t) {
                var r = document.createRange(),
                    n = r.createContextualFragment(e);
                r.selectNodeContents(document.body);
                t.body.appendChild(n);
                for (var a, o = { TITLE: !0, META: !0, LINK: !0, STYLE: !0, BASE: !0}, i = t.body, s = i.childNodes, c = s.length - 1; c >= 0; c--) o[(a = s[c]).nodeName] && i.removeChild(a);
                return t;
            }
        } else console.error('没有找到要转成 DOM 的字符串', e);
    }

    // 读取下一页内容
    function LoadNextPage(url) {
        // 读取下一页
        GM_xmlhttpRequest({
            url: url,
            method: 'GET',
            overrideMimeType: 'text/html; charset=' + (document.characterSet||document.charset||document.inputEncoding),
            headers: {
                'Referer': (curSite.noReferer === true) ? '':location.href,
                'User-Agent': navigator.userAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml'
            },
            timeout: 10000,
            onload: function (response) {
                try {
                    // console.log('URL：' + url, '最终 URL：' + response.finalUrl, '返回内容：' + response.responseText)
                    console.log('成功载入下一页:', url, 'Response URL:', response.finalUrl)

                    ProcessNewPageElems(CreateDocumentByString(response.responseText));

                    // 筛选搜索结果
                    RemoveSearchResutls();

                    // 微移一个像素，这样可以直接用滚轮载入下一页
                    document.documentElement.scrollTop -= 0.1;
                } catch (e) {
                    console.error('[自动无缝翻页] - 处理获取到的下一页内容时出现问题，请检查！', e, response.responseText);
                }
            },
            onerror: function (response) {
                console.log('❌ 获取下一页失败...URL：' + url, response)
            },
            ontimeout: function (response) {
                setTimeout(function(){curSite.pageUrl = '';}, 3000)
                console.log('❌ 获取下一页超时，可 3 秒后再次滚动网页重试（或尝试刷新网页）...URL：' + url, response)
            }
        });
    }

    // 获取最后一个元素，排除 <script> <style> <link> 标签
    function GetLastElement(a) {
        if (a.length === 0) return
        let b = a.pop();
        if (b.tagName === 'SCRIPT' || b.tagName === 'STYLE' || b.tagName === 'LINK') {
            return GetLastElement(a);
        }
        return b
    }

    // 查询多个元素
    function QueryElementsAll(selector, contextNode = undefined, doc = document) {
        if (!selector) return [];
        contextNode = contextNode || doc;
        return [].slice.call(contextNode.querySelectorAll(selector));
    }

    // 替换元素
    function ReplaceNewPageElems(pageE, o = curSite.pager.replaceE, r = curSite.pager.replaceE) {
        let oE = QueryElementsAll(o),
            rE = QueryElementsAll(r, pageE, pageE);
        if (oE.length != 0 && rE.length != 0 && oE.length === rE.length) {
            for (let i = 0; i < oE.length; i++) {
                oE[i].outerHTML = rE[i].outerHTML;
            }
            return true
        } else {console.log(pageE,oE,rE)}
        return false
    }

    // XHR 后处理结果，插入、替换元素等（适用于翻页类型 1/3/6）
    function ProcessNewPageElems(response) {
        if (!curSite.pager.insertP) {curSite.pager.insertP = [curSite.pager.pageE, 5]}
        let pageE = QueryElementsAll(curSite.pager.pageE, response, response), toE;
        if (curSite.pager.insertP[1] === 5) { // 插入 pageE 列表最后一个元素的后面
            toE = GetLastElement(QueryElementsAll(curSite.pager.insertP[0]));
        }

        if (pageE.length > 0 && toE) {

            // 插入位置
            let addTo = 'afterend';

            // 插入新页面元素
            if (curSite.pager.insertP[1] === 2 || curSite.pager.insertP[1] === 4 || curSite.pager.insertP[1] === 5) pageE.reverse(); // 插入到 [元素内头部]、[目标本身后面] 时，需要反转顺序
            pageE.forEach(function (one) {toE.insertAdjacentElement(addTo, one);});

            // 当前页码 + 1
            curSite.pageNum.now = curSite.pageNum._now + 1

            // 替换待替换元素
            if (curSite.pager.replaceE) ReplaceNewPageElems(response);

        } else { // 获取主体元素失败
            console.error('[自动无缝翻页] 获取主体元素失败...')
        }
    }

    // 划词搜索
    function SelectSearch(e) {
        if(e.button != 0) return;    // 排除非左键点击
        if(document.activeElement.tagName.toUpperCase() == "INPUT" || document.activeElement.tagName.toUpperCase() == "TEXTAREA") return;   // 排除inpu和textarea内的文本
        var selectText = window.getSelection().toString().trim();
        if (selectText.length < 2) {
            var odiv = document.querySelector(".s2-sav-menu");
            if (odiv != null) {
                odiv.parentNode.removeChild(odiv);
            }

            return;
        }

        if(document.querySelector(".s2-sav-menu")) return; //如果已经存在菜单, 退出

        var odiv = CreateSearchPopup(selectText);
        var divClientRect = odiv.getBoundingClientRect()
        var divWidth = divClientRect.right - divClientRect.left;
        odiv.style.left = e.pageX - divWidth/2 - 5 + "px";
        odiv.style.top = e.pageY - 5 + "px";
        odiv.style.position = "absolute";

        document.body.appendChild(odiv);
    }

    // 创建搜索菜单
    function CreateSearchPopup(selectText){
        console.log(selectText)
        let aPattern = `
            <avdivbutton>
                <avdiv class='savlink savsehuatang' data-avid=${selectText}> 搜索 </avdiv>
            </avdivbutton>
            `;

        Sehuatang_GetFormHash();

        var odiv = document.createElement("avdiv")
        odiv.classList.add("s2-sav-menu","idExistent");
        odiv.innerHTML = aPattern;

        odiv.addEventListener("click",SearchPopupClick)
        return odiv;
    }

    // 点击划词搜索
    function SearchPopupClick(e) {
        if(e.target.classList.contains("savsehuatang")){
            // 防止多次点击导致重复发送请求
            e.target.classList.remove("savsehuatang");
            SearchSehuatang(e.target.dataset.avid);
        }

        var odiv = document.querySelector(".s2-sav-menu");
        odiv.parentNode.removeChild(odiv);
    }

    // 获取色花堂的formhash
    function Sehuatang_GetFormHash(){
        let sehuatang_getTime = settings2.sehuatang_getTime;
        let nowTime = new Date().getTime();
        let sehuatangURL = `https://${window.location.host}`;

        const debug = false;
        // 不确定这个值会不会变动, 12小时获取一次
        if(!sehuatang_getTime || nowTime-sehuatang_getTime > 43200000 || settings2.sehuatang_url != sehuatangURL){
            GM_xmlhttpRequest({
                method:"get",
                url:sehuatangURL,
                onload:function(data){
                    // console.log(data);
                    var parser=new DOMParser();
                    let htmlDoc=parser.parseFromString(data.responseText, "text/html");
                    let odom = htmlDoc.querySelector('input[name="formhash"]');
                    // console.log(odom);
                    let formhash_value = odom.value;
                    // console.log(formhash_value);

                    settings2.sehuatang_formhash = formhash_value;
                    settings2.sehuatang_getTime = nowTime;
                    settings2.sehuatang_url = sehuatangURL;
                    SaveSettings2();
                }
            })
            if(debug){console.log(`重新获取色花堂的formhash`)};
        }else{
            if(debug){console.log(`没有重新获取色花堂的formhash`)}
        }
    }

    // 色花堂搜索
    function SearchSehuatang(avID){
        let formhash = settings2.sehuatang_formhash;
        let sehuatangURL = `https://${window.location.host}`;

        if (formhash) {
            GM_xmlhttpRequest({
                method: "post",
                url: sehuatangURL+"/search.php?mod=forum",
                data: `formhash=${formhash}&srchtxt=${avID}&searchsubmit=yes`,
                headers:  {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Origin":sehuatangURL,
                    "Referer":sehuatangURL
                },
                onload: function(data){
                    if(data.finalUrl){
                        window.open(data.finalUrl);
                    } else{
                        GM_setClipboard(avID)
                        window.open(`${sehuatangURL}/search.php`);
                    }
                },
                onerror : function(err){
                    console.log('SearchSehuatang error')
                    console.log(err)
                }
            });
        } else {
            GM_setClipboard(avID)
            window.open(`${sehuatangURL}/search.php`);
        }
    }

    // 保存设置
    function SaveSettings2() {
        GM_setValue("_98settings2", settings2);
    }

    // 创建元素
    function ele(html) {
        let temp = document.createElement('template');
        html = html.trim();
        temp.innerHTML = html;
        return temp.content.firstChild;
    }
})();
