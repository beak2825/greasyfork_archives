// ==UserScript==
// @name         booru图站汉化插件
// @version      0.9.3
// @description  汉化danbooru/yande/gelbooru/chan.sankakucomplex 四个图站中的标签 （konachan尚未完成）
// @author       Yellow Rush
// @match        https://danbooru.donmai.us/*
// @match        https://yande.re/*
// @match        https://gelbooru.com/*
// @match        https://chan.sankakucomplex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1081192
// @downloadURL https://update.greasyfork.org/scripts/473170/booru%E5%9B%BE%E7%AB%99%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/473170/booru%E5%9B%BE%E7%AB%99%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    console.log("脚本开始执行");

    // dannboru所需代码
    if (window.location.hostname === 'danbooru.donmai.us') {
        console.log("运行dannboru所需代码");

        var translationMap = {
            "Login": "登录",
            "Posts": "投稿",
            "Comments": "评论",
            "Notes": "附注",
            "Artists": "艺术家",
            "Tags": "标签",
            "Pools": "图集",
            "Wiki": "百科",
            "Forum": "论坛",
            "More": "更多",
            "Gallery": "画廊",
            "Listing": "列出",
            "Changes": "投稿改动",
            "Help": "帮助",
            "Hot": "热门",
            "Upload": "上传投稿",
            "Favorites": "收藏",
            "Fav groups": "收藏夹",
            "Recommended": "推荐",
            "Saved searches": "已保存的搜索",
            "My Account": "我的账户"

        };

        var contentElement = document.getElementById("nav");

        if (contentElement) {
            console.log("找到导航栏父元素");

            var elementsToTranslate = contentElement.querySelectorAll("a");

            elementsToTranslate.forEach(function (element) {
                var originalText = element.textContent;

                for (var key in translationMap) {
                    if (originalText.includes(key)) {
                        var translatedText = originalText.replace(key, translationMap[key]);
                        element.textContent = translatedText;
                        console.log(`翻译完成: ${originalText} -> ${translatedText}`);
                    }
                }
            });

            console.log("替换完成");
        } else {
            console.log("未找到导航栏父元素");
        }




        // 标签汉化过程
        // 获取对照表
        async function loadTranslationData() {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://raw.githubusercontent.com/Yellow-Rush/zh_CN-Tags/main/danbooru.csv",
                    onload: function (response) {
                        const csvData = response.responseText;
                        const translationMap = {};
                        const lines = csvData.split('\n');
                        for (const line of lines) {
                            const [englishTag, chineseTranslation] = line.split(',');
                            translationMap[englishTag] = chineseTranslation;
                        }
                        resolve(translationMap);
                    },
                    onerror: function (error) {
                        reject(error);
                    }
                });
            });
        }

        // 获取标签的英文名称，将空格转换为下划线
        function getSanitizedEnglishTagName(tagElement) {
            const englishTag = tagElement.getAttribute('data-tag-name');
            return englishTag.replace(/ /g, '_');
        }

        // 替换属性值为中文翻译
        async function replaceAttributeValuesWithTranslations() {
            console.log("标签汉化过程开始");
            const translationMap = await loadTranslationData();
            const tagElements = document.querySelectorAll('li[data-tag-name]');
            const untranslatedTags = [];

            tagElements.forEach(tagElement => {
                const sanitizedEnglishTag = getSanitizedEnglishTagName(tagElement);
                if (translationMap[sanitizedEnglishTag]) {
                    const chineseTranslation = translationMap[sanitizedEnglishTag];

                    const translationElement = document.createElement('a');
                    translationElement.className = 'tag-CN';
                    translationElement.href = tagElement.querySelector('.search-tag').getAttribute('href');
                    translationElement.textContent = chineseTranslation;

                    tagElement.insertBefore(translationElement, tagElement.querySelector('.wiki-link'));
                    // console.log(`标签翻译完成: ${sanitizedEnglishTag} -> ${chineseTranslation}`);
                } else {
                    untranslatedTags.push(sanitizedEnglishTag);
                }
            });

            console.log("标签汉化过程结束");

            // 输出找不到中文翻译的英文标签列表
            console.log("找不到中文翻译的英文标签列表：");
            const csvContent = untranslatedTags.map(tag => `${tag}`).join(',\n');
            console.log(csvContent);
        }

        // 在页面加载完毕后执行替换操作
        await replaceAttributeValuesWithTranslations();


        // 插入自定义的 CSS 样式
        var customStylesForDanbooru = document.createElement("style");
        customStylesForDanbooru.textContent = `
            :root{
                --body-background-color: #f1f1f1;
            }
            li[data-tag-name] {
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            padding: 0.2rem 0.5rem 0.2rem 0.5rem;
            background-color: #ffffff;
            box-shadow: 0 0 0 0.07rem grey;
            font-size: 0.5rem;
            min-height: 2.5em;
            align-content: center;
            align-items: center;
            }
            .tag-CN{
                display: block;
                padding: 0;
                margin-right: 0.2rem;
                font-size: 0.98rem;
                filter: contrast(1.5) brightness(0.5);
            }
            .sidebar-container #sidebar {
                min-width: 350px;
            }
            .post-count {
                margin-left: auto;
            }
            .tag-list a.wiki-link {
                position: absolute;
                left: 2.1em;
            }
            .fit-width {
                max-height: 124vh;
                width: auto;
            }
`;
        document.head.appendChild(customStylesForDanbooru);
    }

    // 给另外的网站用的
    if (window.location.hostname === 'yande.re') {
        console.log("运行yande.re所需代码");

        //获取对照表
        async function loadTranslationData() {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://raw.githubusercontent.com/Yellow-Rush/zh_CN-Tags/main/yande.csv",
                    onload: function (response) {
                        const csvData = response.responseText;
                        const translationMap = {};
                        const lines = csvData.split('\n');
                        for (const line of lines) {
                            const [englishTag, chineseTranslation] = line.split(',');
                            translationMap[englishTag] = chineseTranslation;
                        }
                        resolve(translationMap);
                    },
                    onerror: function (error) {
                        reject(error);
                    }
                });
            });
        }

        // 替换属性值为中文翻译
        async function replaceAttributeValuesWithTranslations() {
            console.log("标签汉化过程开始");
            const translationMap = await loadTranslationData();
            const tagElements = document.querySelectorAll('a[onmouseover*="Post.highlight_posts_with_tag"], li.tag-type-general > a[href^="/post?tags="]');

            tagElements.forEach(tagElement => {
                let englishTag;

                if (tagElement.hasAttribute('onmouseover')) {
                    const onmouseoverAttributeValue = tagElement.getAttribute('onmouseover');
                    const startIndex = onmouseoverAttributeValue.indexOf("'");
                    const endIndex = onmouseoverAttributeValue.lastIndexOf("'");
                    englishTag = onmouseoverAttributeValue.substring(startIndex + 1, endIndex);
                } else {
                    const href = tagElement.getAttribute('href');
                    const startIndex = href.indexOf('=') + 1;
                    englishTag = href.substring(startIndex);
                }

                if (translationMap[englishTag]) {
                    const chineseTranslation = translationMap[englishTag];

                    const translationElement = document.createElement('a');
                    translationElement.className = 'tag-CN';
                    translationElement.href = tagElement.getAttribute('href');
                    translationElement.textContent = chineseTranslation;

                    if (tagElement.parentNode.classList.contains('tag-type')) {
                        const thirdChild = tagElement.parentNode.children[2];
                        tagElement.parentNode.insertBefore(translationElement, thirdChild.nextSibling);
                    } else {
                        tagElement.parentNode.insertBefore(translationElement, tagElement);
                    }

                    console.log(`标签翻译完成: ${englishTag} -> ${chineseTranslation}`);
                }
            });
            console.log("标签汉化过程结束");
        }


        //汉化标签大列表以检查哪些热门标签没翻译
        async function replaceTagsInTdElements() {
            console.log("在td元素中替换标签开始");

            const translationMap = await loadTranslationData();
            const tdElements = document.querySelectorAll('[class^="tag-type-"]');

            tdElements.forEach(tdElement => {
                const tagLink = tdElement.querySelector('a[href^="/post?tags="]');
                if (tagLink) {
                    const href = tagLink.getAttribute('href');
                    const startIndex = href.indexOf('=') + 1;
                    const englishTag = href.substring(startIndex);

                    if (translationMap[englishTag]) {
                        const chineseTranslation = translationMap[englishTag];

                        const translationElement = document.createElement('a');
                        translationElement.className = 'tag-CN';
                        translationElement.href = href;
                        translationElement.textContent = chineseTranslation;

                        tdElement.insertBefore(translationElement, tagLink);
                        console.log(`标签翻译完成: ${englishTag} -> ${chineseTranslation}`);
                    }
                }
            });

            console.log("在td元素中替换标签结束");
        }

        // 使用 DOMContentLoaded 事件来确保页面已加载完成
        document.addEventListener('DOMContentLoaded', async () => {
            await replaceAttributeValuesWithTranslations();
            await replaceTagsInTdElements(); // 调用新添加的函数
        });



        // 在页面加载完毕后执行替换操作
        await replaceAttributeValuesWithTranslations();
        await replaceTagsInTdElements(); // 调用新添加的函数

        // 插入自定义的 CSS 样式
        var customStyles = document.createElement("style");
        customStyles.textContent = `
            #tag-sidebar>li {
                background-color: #181818;
                box-shadow: 0 0 0 1px #474747;
                padding: 0.4em 0 0.4em 0.4em;
            }

            div.sidebar{
                width: 20%;
                max-width: 15vw;
            }

            div.content {
                width: 67%;
            }

            #tag-sidebar>li>a:nth-child(1){
                position:absolute;
                left: 0.1em;
                opacity: 0.7;
            }
            #tag-sidebar>li>a:nth-child(2){
                position:absolute;
                left: 0.9em;
                opacity: 0.7;
            }

            #tag-sidebar>li>a:nth-child(3){
                position:absolute;
                left: 2em;
                opacity: 0.7;
            }

            a.tag-CN {
                font-size: 1.2em !important;
                margin: 0.3em;
                filter: contrast(1.1);
                font-weight: bold;
            }

            #tag-sidebar>li>*:not(.tag-CN){
                opacity:0.8
            }

            .tag-type-copyright > a, #history .tag-type-copyright, .color-tag-types .tag-type-copyright {
                color: #ff669d;
            }

            .action-post-show > body {
                background: #2d2d2d;
            }

.image.js-notes-manager--toggle.js-notes-manager--image {
    max-width: 75vw;
    height: auto;
}


        `;
        document.head.appendChild(customStyles);

    }


    if (window.location.hostname === 'chan.sankakucomplex.com') {
        console.log("Running code for chan.sankakucomplex.com");

        // 获取对照表
        async function loadTranslationData() {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://raw.githubusercontent.com/Yellow-Rush/zh_CN-Tags/main/sankakucomplex_chan.csv",
                    onload: function (response) {
                        const csvData = response.responseText;
                        const translationMap = {};
                        const lines = csvData.split('\n');
                        for (const line of lines) {
                            const [englishTag, chineseTranslation] = line.split(',');
                            translationMap[englishTag] = chineseTranslation;
                        }
                        resolve(translationMap);
                    },
                    onerror: function (error) {
                        reject(error);
                    }
                });
            });
        }

        // 查找id为tag-sidebar的元素
        var tagSidebar = document.getElementById("tag-sidebar");

        if (tagSidebar) {
            // 加载对照表
            loadTranslationData().then((translationMap) => {
                // 查找所有li元素
                var tagListItems = tagSidebar.querySelectorAll("li");

                // 用于存储找不到中文标签的英文标签的数组
                var untranslatedTags = [];

                tagListItems.forEach(function (listItem) {
                    // 查找li元素下的a元素
                    var tagLink = listItem.querySelector("a");

                    if (tagLink) {
                        // 获取标签的英文名称
                        var englishTagName = tagLink.textContent.trim();

                        // 根据映射表进行翻译
                        var translatedTag = translationMap[englishTagName];

                        if (translatedTag) {
                            // 创建一个新的a元素包含中文翻译，并设置相同的链接
                            var translationElement = document.createElement('a');
                            translationElement.className = 'tag-CN';
                            translationElement.href = tagLink.href;
                            translationElement.textContent = translatedTag;

                            // 添加role="tooltip"属性
                            translationElement.setAttribute('role', 'tooltip');

                            // 将新元素插入到a元素之前
                            tagLink.parentNode.insertBefore(translationElement, tagLink);
                        } else {
                            // 将找不到中文标签的英文标签添加到数组
                            untranslatedTags.push(englishTagName);
                        }
                    }
                });

                // 输出找不到中文标签的英文标签列表
                console.log("找不到中文翻译的英文标签列表：");
                const csvContent = untranslatedTags.map(tag => `${tag}`).join(',\n');
                console.log(csvContent);
            });


        }

        // 插入自定义的 CSS 样式
        var customStyles = document.createElement("style");
        customStyles.textContent = `
        li[class*="tag-type"]{
            background:#f7f7f7;
            border:1px solid #656565;
            padding: 4px;
        }

        .tag-CN{
            margin-right: 0.5em;
        }

        [href*="/?tags="]:not(.tag-CN){
            color:#916849 ;
            font-weight:400;
            font-size:0.7rem !important;
        }
        [href*="/?tags="]:not(.tag-CN):hover{
            color:#ff0000;
        }

        #has-mail-notice{
            display:none;
        }
        #headerlogo{
            display:none;
        }

        #tag-sidebar{
            overflow: visible;
        }
        .tooltip {
            z-index: 10 !important;
            position: relative;
        }
        div.sidebar {
            overflow-y: visible;
        }
        .tooltip[data-show]{
            line-height: 1.5em;
            border-radius:0.2em;
            border:1px black solid;
            background:white
        }
    `;
        document.head.appendChild(customStyles);
    }


    // 给另外的网站用的
    if (window.location.hostname === 'gelbooru.com') {
        console.log("Running code for gelbooru.com");

        // 获取对照表
        async function loadTranslationData() {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://raw.githubusercontent.com/Yellow-Rush/zh_CN-Tags/main/gelbooru.csv",
                    onload: function (response) {
                        const csvData = response.responseText;
                        const translationMap = {};
                        const lines = csvData.split('\n');
                        for (const line of lines) {
                            const [englishTag, chineseTranslation] = line.split(',');
                            translationMap[englishTag] = chineseTranslation;
                        }
                        resolve(translationMap);
                    },
                    onerror: function (error) {
                        reject(error);
                    }
                });
            });
        }

        // 查找class为tag-list的元素
        var tagList = document.querySelector(".tag-list");

        if (tagList) {
            // 加载对照表
            loadTranslationData().then((translationMap) => {
                // 查找所有包含标签的a元素
                var tagLinks = tagList.querySelectorAll("a[href*='tags=']");

                // 用于存储找不到中文标签的英文标签的数组
                var untranslatedTags = [];

                tagLinks.forEach(function (tagLink) {
                    // 获取标签的英文名称
                    var englishTagName = tagLink.textContent.trim();
                    var sanitizedEnglishTagName = englishTagName.replace(/ /g, '_'); // 将空格替换为下划线

                    // 根据映射表进行翻译
                    var translatedTag = translationMap[sanitizedEnglishTagName];

                    if (translatedTag) {
                        // 创建一个新的a元素包含中文翻译，并设置相同的链接
                        var translationElement = document.createElement('a');
                        translationElement.className = 'tag-CN';
                        translationElement.href = tagLink.href;
                        translationElement.textContent = translatedTag;

                        // 将新元素插入到a元素之前
                        tagLink.parentNode.insertBefore(translationElement, tagLink);
                    } else {
                        // 将找不到中文标签的英文标签添加到数组
                        untranslatedTags.push(sanitizedEnglishTagName);
                    }
                });

                // 输出找不到中文翻译的英文标签列表
                console.log("找不到中文翻译的英文标签列表：");
                const csvContent = untranslatedTags.map(tag => `${tag}`).join(',\n');
                console.log(csvContent);
            });
        }


        // 插入自定义的 CSS 样式
        var customStyles = document.createElement("style");
        customStyles.textContent = `
        .tag-CN {
            margin-right: 0.5em;
        }
        
        a.tag-CN {
            font-size: 1.3em;
        }
        
        a.mobile-spacing {}
        
        li>a[title="Wiki"] {
            position: absolute;
            left: -2em;
            opacity: 50%;
        }
        
        li>a[title="Wiki"]:hover {
            opacity: 100%;
        }
        
        li[class*="tag-type"]>.sm-hidden {
            position: relative;
        }
        li[class*="tag-type"]>.sm-hidden>a[href*="wiki"]{
            position: absolute;
            left: -1.5em;
            opacity: 50%;
            z-index: 2;
        }
        
        [title="Remove from search"] {
            display: none;
        }
        
        [title="Add to search"] {
            left: -1.1em;
            position: absolute;
            opacity: 50%;
        }
        
        [title="Add to search"]:hover {
            opacity: 100%;
        }
        
        #tag-list>li[class*="tag-type"] {
            position: relative;
        }
        
        li[class*="tag-type"]>span {
            right: 0.2em;
            top: 30%;
            position: absolute;
            color: #cacaca !important;
        }
        
        .aside {
            margin-left: 1.6em;
        }
        
        #container {
            grid-template-columns: 285px auto;
        }
        
        ul.tag-list li[class*="tag-type"] {
            background: #ffffff;
            display: inline-block;
            width: 230px;
            margin: 0px 4px 0px 15px;
            border: none;
            box-shadow: 0 0 0 0.07rem grey;
            padding: 0.2em 0.5em 0.3em 0.5em;
        }
        
        ul.tag-list a[href*="tags"]:not(a.tag-CN) {
            opacity: 60% !important;
            filter: hue-rotate(-15deg) saturate(0.5);
        }
        
        a.tag-CN {
            filter: saturate(1.3) brightness(0.8)
        }

        body{
            background:#f7f7f7;

        }
`;
        document.head.appendChild(customStyles);
    }

    // 给另外的网站用的
    if (window.location.hostname === 'another-example.com') {
        console.log("Running code for another-example.com");


    }

    // 全部网站所通用规则
    console.log("Common code for all matched websites");


    console.log("脚本执行结束");

})();
