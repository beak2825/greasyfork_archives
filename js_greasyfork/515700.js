// ==UserScript==
// @name         rally-the-troops.com 中文化插件
// @namespace    https://github.com/klingeling/18xx-i18n-plugin/
// @description  中文化 rally-the-troops.com 界面的部分菜单及内容。
// @copyright    2023, klingeling
// @icon         ttps://rally-the-troops.com/images/rally-the-troops.svg
// @version      1.0.5
// @author       klingeling
// @license      GPL-3.0
// @match        https://rally-the-troops.com/*
// @require      https://update.greasyfork.org/scripts/515699/1614394/rally-the-troopscom%20%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6%E8%AF%8D%E5%BA%93.js
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @supportURL   https://github.com/klingeling/18xx-i18n-plugin/issues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515700/rally-the-troopscom%20%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/515700/rally-the-troopscom%20%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


(function (window, document, undefined) {
    'use strict';

    const lang = 'zh'; // 设置默认语言
    let page;
    //let enable_RegExp = GM_getValue("enable_RegExp", 1);
    let enable_RegExp = 1;
    const letters = new Set();
    let letters_size = 0;

    /**
     * watchUpdate 函数：监视页面变化，根据变化的节点进行翻译
     */
    function watchUpdate() {
        // 检测浏览器是否支持 MutationObserver
        const MutationObserver =
            window.MutationObserver ||
            window.WebKitMutationObserver ||
            window.MozMutationObserver;

        // 获取当前页面的 URL
        const getCurrentURL = () => document.URL;
        getCurrentURL.previousURL = getCurrentURL();

        // 创建 MutationObserver 实例，监听 DOM 变化
        const observer = new MutationObserver((mutations, observer) => {
            const currentURL = getCurrentURL();

            // 如果页面的 URL 发生变化
            if (currentURL !== getCurrentURL.previousURL) {
                getCurrentURL.previousURL = currentURL;
                page = getPage(); // 当页面地址发生变化时，更新全局变量 page
                console.log(`链接变化 page= ${page}`);

                transTitle(); // 翻译页面标题
                transBySelector();
                if (page) {
                    setTimeout(() => {
                        // 使用 CSS 选择器找到页面上的元素，并将其文本内容替换为预定义的翻译
                        transTitle(); // 翻译页面标题
                        transBySelector();
                    }, 500);
                }
            }

            if (page) {
                // 使用 filter 方法对 mutations 数组进行筛选，
                // 返回 `节点增加 或 属性更改的 mutation` 组成的新数组 filteredMutations。
                const filteredMutations = mutations.filter(mutation => mutation.addedNodes.length > 0 || mutation.type === 'attributes' || mutation.type === 'characterData');

                // 处理每个变化
                transTitle(); // 翻译页面标题
                filteredMutations.forEach(mutation => traverseNode(mutation.target));
            }
        });

        // 配置 MutationObserver
        const config = {
            subtree: true,
            childList: true,
            characterData: true,
            attributeFilter: ['value', 'placeholder', 'aria-label', 'data-confirm', 'title'], // 仅观察特定属性变化
        };

        // 开始观察 document.body 的变化
        observer.observe(document.body, config);
    }

    /**
     * traverseNode 函数：遍历指定的节点，并对节点进行翻译。
     * @param {Node} node - 需要遍历的节点。
     */
    function traverseNode(node) {
        // 跳过忽略
        if (I18N.conf.reIgnoreId.includes(node.id) ||
            I18N.conf.reIgnoreClass.test(node.className) ||
            I18N.conf.reIgnoreTag.includes(node.tagName) ||
            (node.getAttribute && I18N.conf.reIgnoreItemprop.includes(node.getAttribute("itemprop"))) ||
            (node.getAttribute && I18N.conf.reIgnorehrefprop.includes(node.getAttribute("href"))) ||
            (page === 'homepage' && node.id === 'chatlog')
           ) {
            return;
        }

        if (node.nodeType === Node.ELEMENT_NODE) { // 元素节点处理

            // 翻译时间元素
            if (
                ["RELATIVE-TIME", "TIME-AGO", "TIME", "LOCAL-TIME"].includes(node.tagName)
            ) {
                if (node.shadowRoot) {
                    transTimeElement(node.shadowRoot);
                    watchTimeElement(node.shadowRoot);
                } else {
                    transTimeElement(node);
                }
                return;
            }

            // 元素节点属性翻译
            if (["INPUT", "TEXTAREA"].includes(node.tagName)) { // 输入框 按钮 文本域
                if (node.hasAttribute('title')) {
                    transElement(node, 'title', true); // 翻译 浏览器 提示对话框
                }
                if (["button", "submit", "reset"].includes(node.type)) {
                    if (node.hasAttribute('data-confirm')) { // 翻译 浏览器 提示对话框
                        transElement(node, 'data-confirm', true);
                    }
                    transElement(node, 'value');
                } else {
                    transElement(node, 'placeholder');
                }
            } else if (node.tagName === 'BUTTON') {
                if (node.hasAttribute('aria-label') && ["tooltipped"].includes(node.className)) {
                    transElement(node, 'aria-label', true); // 翻译 浏览器 提示对话框
                }
                if (node.hasAttribute('title')) {
                    transElement(node, 'title', true); // 翻译 浏览器 提示对话框
                }
                if (node.hasAttribute('data-confirm')) {
                    transElement(node, 'data-confirm', true); // 翻译 浏览器 提示对话框 ok
                }
                if (node.hasAttribute('data-confirm-text')) {
                    transElement(node, 'data-confirm-text', true); // 翻译 浏览器 提示对话框 ok
                }
                if (node.hasAttribute('data-confirm-cancel-text')) {
                    transElement(node, 'data-confirm-cancel-text', true); // 取消按钮 提醒
                }
                if (node.hasAttribute('cancel-confirm-text')) {
                    transElement(node, 'cancel-confirm-text', true); // 取消按钮 提醒
                }
                if (node.hasAttribute('data-disable-with')) { // 按钮等待提示
                    transElement(node.dataset, 'disableWith');
                }
            } else if (node.tagName === 'OPTGROUP') { // 翻译 <optgroup> 的 label 属性
                transElement(node, 'label');
            } else if (["tooltipped"].includes(node.className)) { // 仅当 元素存在'tooltipped'样式 aria-label 才起效果
                transElement(node, 'aria-label', true); // 带提示的元素，类似 tooltip 效果的
            } else if (node.tagName === 'LABEL') { // 翻译 <LABEL> 的 label 属性
                if (node.hasAttribute('title')) {
                    transElement(node, 'title', true); // 翻译 浏览器 提示对话框
                }
            } else if (node.tagName === 'A') {
                if (node.hasAttribute('title')) {
                    transElement(node, 'title', true); // 翻译 浏览器 提示对话框
                }
                if (node.hasAttribute('data-hovercard-type')) {
                    return; // 不翻译
                }
            } else if (node.tagName === 'DIV') {
                if (node.hasAttribute('title')) {
                    transElement(node, 'title', true); // 翻译 浏览器 提示对话框
                }
            }

            let childNodes = node.childNodes;
            childNodes.forEach(traverseNode); // 遍历子节点

        } else if (node.nodeType === Node.TEXT_NODE) { // 文本节点翻译
            if (node.length <= 1000) { // 修复 许可证编辑框初始化载入内容被翻译
                transElement(node, 'data');
            }
        }
    }

    /**
     * getPage 函数：获取当前页面的类型。
     * @returns {string|boolean} 当前页面的类型，如果无法确定类型，那么返回 false。
     */
    function getPage() {

        // 站点，如 gist, developer, help 等，默认主站是 github
        const site = location.hostname === "rally-the-troops.com" ? "rally-the-troops" : "rally-the-troops"; // 站点
        const pathname = location.pathname; // 当前路径

        // 是否登录
        // const isLogin = document.body.classList.contains("logged-in");

        // 用于确定 个人首页，组织首页，仓库页 然后做判断
        // const analyticsLocation = (document.getElementsByName('analytics-location')[0] || {}).content || '';
        // 组织页
        // const isOrganization = /\/<org-login>/.test(analyticsLocation)||/^\/(?:orgs|organizations)/.test(pathname);
        // 仓库页
        // const isRepository = /\/<user-name>\/<repo-name>/.test(analyticsLocation);

        // 优先匹配 body 的 class
        let page, t = document.body.className.match(I18N.conf.rePageClass);
        // if (t) {
        // if (t[1] === 'page-profile') {
        //     let matchResult = location.search.match(/tab=(\w+)/);
        //     if (matchResult) {
        //         page = 'page-profile/' + matchResult[1];
        //     } else {
        //         page = pathname.match(/\/(stars)/) ? 'page-profile/stars' : 'page-profile';
        //     }
        // } else {
        //     page = t[1];
        // }
        // } else if (site === 'gist') { // Gist 站点
        //     page = 'gist';
        // } else
        if (pathname === '/' && site === 'rally-the-troops') { // 18xx.games 首页
            page = 'homepage';
            // } else if  (isRepository) { // 仓库页
            //     t = pathname.match(I18N.conf.rePagePathRepo);
            //     page = t ? 'repository/'+ t[1] : 'repository';
            // } else if  (isOrganization) { // 组织页
            //     t = pathname.match(I18N.conf.rePagePathOrg);
            //     page = t ? 'orgs/'+ t[1] : 'orgs';
        } else {
            t = pathname.match(I18N.conf.rePagePath);
            page = t ? t[1] : false; // 取页面 key
        }

        if (!page || !I18N[lang][page]) {
            console.log(`请注意对应 page: ${page} 词库节点不存在`);
            console.log(`当前路径: ${pathname}`)
            page = false;
        }
        return page;
    }

    /**
     * transTitle 函数：翻译页面标题
     */
    function transTitle() {
        let key = document.title; // 标题文本内容
        let str = I18N[lang]['title']['static'][key] || '';
        if (!str) {
            let res = I18N[lang]['title'].regexp || [];
            for (let [a, b] of res) {
                str = key.replace(a, b);
                if (str !== key) {
                    break;
                }
            }
        }
        document.title = str;
    }

    /**
     * transTimeElement 函数：翻译时间元素文本内容。
     * @param {Element} el - 需要翻译的元素。
     */
    function transTimeElement(el) {
        let key = el.childNodes.length > 0 ? el.lastChild.textContent : el.textContent;
        let res = I18N[lang]['pubilc']['time-regexp']; // 时间正则规则

        for (let [a, b] of res) {
            let str = key.replace(a, b);
            if (str !== key) {
                el.textContent = str;
                break;
            }
        }
    }

    /**
     * watchTimeElement 函数：监视时间元素变化, 触发和调用时间元素翻译
     * @param {Element} el - 需要监视的元素。
     */
    function watchTimeElement(el) {
        const MutationObserver =
            window.MutationObserver ||
            window.WebKitMutationObserver ||
            window.MozMutationObserver;

        new MutationObserver(mutations => {
            transTimeElement(mutations[0].addedNodes[0]);
        }).observe(el, {
            childList: true
        });
    }

    /**
     * transElement 函数：翻译指定元素的文本内容或属性。
     * @param {Element} el - 需要翻译的元素。
     * @param {string} field - 需要翻译的文本内容或属性的名称。
     * @param {boolean} isAttr - 是否需要翻译属性。
     */
    function transElement(el, field, isAttr = false) {
        let text = isAttr ? el.getAttribute(field) : el[field]; // 需要翻译的文本
        let str = translateText(text); // 翻译后的文本

        // 替换翻译后的内容
        if (str) {
            if (!isAttr) {
                el[field] = str;
            } else {
                el.setAttribute(field, str);
            }
        }
    }

    /**
     * translateText 函数：翻译文本内容。
     * @param {string} text - 需要翻译的文本内容。
     * @returns {string|boolean} 翻译后的文本内容，如果没有找到对应的翻译，那么返回 false。
     */
    function translateText(text) { // 翻译

        // 内容为空, 空白字符和或数字, 不存在英文字母和符号,. 跳过
        if (!isNaN(text) || !/[a-zA-Z,.]+/.test(text)) {
            return false;
        }

        let _key = text.trim(); // 去除首尾空格的 key
        let _key_neat = _key.replace(/\xa0|[\s]+/g, ' ') // 去除多余空白字符(&nbsp; 空格 换行符)

        let str = fetchTranslatedText(_key_neat); // 翻译已知页面 (局部优先)

        if (str && str !== _key_neat) { // 已知页面翻译完成
            return text.replace(_key, str); // 替换原字符，保留首尾空白部分
        }

        if (!_key_neat.match(I18N.conf.keyClass) && !_key_neat.match(I18N.conf.userCompanyClass)) {
            // console.log(_key);
            letters.add(_key_neat);
        }

        return false;
    }

    /**
     * fetchTranslatedText 函数：从特定页面的词库中获得翻译文本内容。
     * @param {string} key - 需要翻译的文本内容。
     * @returns {string|boolean} 翻译后的文本内容，如果没有找到对应的翻译，那么返回 false。
     */
    function fetchTranslatedText(key) {

        // 静态翻译
        let str = I18N[lang][page]['static'][key] || I18N[lang]['pubilc']['static'][key]; // 默认翻译 公共部分

        if (typeof str === 'string') {
            return str;
        }

        // 正则翻译
        if (enable_RegExp) {
            let res = (I18N[lang][page].regexp || []).concat(I18N[lang]['pubilc'].regexp || []); // 正则数组

            for (let [a, b] of res) {
                str = key.replace(a, b);
                if (str !== key) {
                    return str;
                }
            }
        }

        return false; // 没有翻译条目
    }

    /**
     * transDesc 函数：为指定的元素添加一个翻译按钮，并为该按钮添加点击事件。
     * @param {string} el - CSS选择器，用于选择需要添加翻译按钮的元素。
     */
    function transDesc(el) {
        // 使用 CSS 选择器选择元素
        let element = document.querySelector(el);

        // 如果元素不存在，那么直接返回
        if (!element) {
            return false;
        }

        // 在元素后面插入一个翻译按钮
        let button = document.createElement('div');
        button.id = 'translate-me';
        button.style.cssText = 'color: rgb(27, 149, 224); font-size: small; cursor: pointer';
        button.textContent = '翻译';

        element.insertAdjacentElement('afterend', button);

        // 为翻译按钮添加点击事件
        button.addEventListener('click', () => {
            // 获取元素的文本内容
            const desc = element.textContent.trim();

            // 如果文本内容为空，那么直接返回
            if (!desc) {
                return false;
            }

            // 调用 translateDescText 函数进行翻译
            translateDescText(desc, text => {
                // 翻译完成后，隐藏翻译按钮，并在元素后面插入翻译结果
                button.style.display = "none";
                const translationHTML = `<span style='font-size: small'>由 <a target='_blank' style='color:rgb(27, 149, 224);' href='https://www.iflyrec.com/html/translate.html'>讯飞听见</a> 翻译👇</span><br/>${text}`;
                element.insertAdjacentHTML('afterend', translationHTML);
            });
        });
    }

    /**
     * translateDescText 函数：将指定的文本发送到讯飞的翻译服务进行翻译。
     * @param {string} text - 需要翻译的文本。
     * @param {function} callback - 翻译完成后的回调函数，该函数接受一个参数，即翻译后的文本。
     */
    function translateDescText(text, callback) {
        // 使用 GM_xmlhttpRequest 函数发送 HTTP 请求
        GM_xmlhttpRequest({
            method: "POST", // 请求方法为 POST
            url: "https://www.iflyrec.com/TranslationService/v1/textTranslation", // 请求的 URL
            headers: { // 请求头
                'Content-Type': 'application/json',
                'Origin': 'https://www.iflyrec.com',
            },
            data: JSON.stringify({
                "from": "2",
                "to": "1",
                "contents": [{
                    "text": text,
                    "frontBlankLine": 0
                }]
            }), // 请求的数据
            responseType: "json", // 响应的数据类型为 JSON
            onload: (res) => {
                try {
                    const { status, response } = res;
                    const translatedText = (status === 200) ? response.biz[0].translateResult : "翻译失败";
                    callback(translatedText);
                } catch (error) {
                    callback("翻译失败");
                }
            }
        });
    }

    /**
     * transBySelector 函数：通过 CSS 选择器找到页面上的元素，并将其文本内容替换为预定义的翻译。
     */
    function transBySelector() {
        // 获取当前页面的翻译规则，如果没有找到，那么使用公共的翻译规则
        let res = (I18N[lang][page]?.selector || []).concat(I18N[lang]['pubilc'].selector || []); // 数组

        // 如果找到了翻译规则
        if (res.length > 0) {
            // 遍历每个翻译规则
            for (let [selector, translation] of res) {
                // 使用 CSS 选择器找到对应的元素
                let element = document.querySelector(selector);
                // 如果找到了元素，那么将其文本内容替换为翻译后的文本
                if (element) {
                    element.textContent = translation;
                }
            }
        }
    }

    // GM_registerMenuCommand("正则切换", () => {
    //     enable_RegExp = enable_RegExp ? 0 : 1;
    //     GM_setValue("enable_RegExp", enable_RegExp);
    //     GM_notification(`已${enable_RegExp ? '开启' : '关闭'}正则功能`);
    //     if (enable_RegExp) {
    //         location.reload();
    //     }
    // });

    let weburl=window.location.href
    // if(weburl.indexOf('rally-the-troops.com/pax-pamir')!=-1)
    // {
    //     for (i = 1; i < 117; i += 1) {
    //         image = '.card_'+i+'{background-image:url(https://raw.githubusercontent.com/klingeling/pax-pamir/master/cards/zh-cn/card_'+i+'.jpg)}';
    //         GM_addStyle(image);
    //     }
    // }

    // if(weburl.indexOf('rally-the-troops.com/pax-pamir/info/cards.html')!=-1)
    // {
    //     var reg = new RegExp('https://rally-the-troops.com/pax-pamir/cards/card');
    //     var images = document.querySelectorAll('img');
    //     var i, image;
    //     for (i = 0; i < images.length; i += 1) {
    //         image = images[i];
    //         if (image.src.match(reg)) {
    //             image.src = image.src.replace('rally-the-troops.com/pax-pamir/cards/card', 'raw.githubusercontent.com/klingeling/pax-pamir/master/cards/zh-cn/card');
    //         }
    //     }
    // }
    if(weburl.indexOf('rally-the-troops.com/pax-pamir')!=-1)
    {
        GM_addStyle('.card_116{background-image:url(https://img.picgo.net/2024/11/04/card_1161058b40f8498b898.jpg)}');
        GM_addStyle('.card_114{background-image:url(https://img.picgo.net/2024/11/04/card_1149d15d3e8cc721e5d.jpg)}');
        GM_addStyle('.card_115{background-image:url(https://img.picgo.net/2024/11/04/card_1158871ae52079b03e1.jpg)}');
        GM_addStyle('.card_113{background-image:url(https://img.picgo.net/2024/11/04/card_113bf086372330bc956.jpg)}');
        GM_addStyle('.card_111{background-image:url(https://img.picgo.net/2024/11/04/card_111fc007a20eef8596d.jpg)}');
        GM_addStyle('.card_110{background-image:url(https://img.picgo.net/2024/11/04/card_1107b5588ae34084b31.jpg)}');
        GM_addStyle('.card_112{background-image:url(https://img.picgo.net/2024/11/04/card_11210b97f2437af1c6c.jpg)}');
        GM_addStyle('.card_108{background-image:url(https://img.picgo.net/2024/11/04/card_108a190d402b1b5708d.jpg)}');
        GM_addStyle('.card_109{background-image:url(https://img.picgo.net/2024/11/04/card_1095e6063968a9f9c44.jpg)}');
        GM_addStyle('.card_107{background-image:url(https://img.picgo.net/2024/11/04/card_10768ad0a56c4df3d59.jpg)}');
        GM_addStyle('.card_106{background-image:url(https://img.picgo.net/2024/11/04/card_106d93944c710f27b1d.jpg)}');
        GM_addStyle('.card_104{background-image:url(https://img.picgo.net/2024/11/04/card_1041b8649fed28c437c.jpg)}');
        GM_addStyle('.card_105{background-image:url(https://img.picgo.net/2024/11/04/card_105fccec79b3f89bbd4.jpg)}');
        GM_addStyle('.card_103{background-image:url(https://img.picgo.net/2024/11/04/card_103988899d87675861c.jpg)}');
        GM_addStyle('.card_102{background-image:url(https://img.picgo.net/2024/11/04/card_10274f8535a2d5fe702.jpg)}');
        GM_addStyle('.card_101{background-image:url(https://img.picgo.net/2024/11/04/card_101d36a4b944ba371eb.jpg)}');
        GM_addStyle('.card_100{background-image:url(https://img.picgo.net/2024/11/04/card_100c9d64a4a2ad36dcd.jpg)}');
        GM_addStyle('.card_98{background-image:url(https://img.picgo.net/2024/11/04/card_980d2bf6652372de77.jpg)}');
        GM_addStyle('.card_99{background-image:url(https://img.picgo.net/2024/11/04/card_99c6d2cb2709ae967e.jpg)}');
        GM_addStyle('.card_97{background-image:url(https://img.picgo.net/2024/11/04/card_9703107cbab2a169fb.jpg)}');
        GM_addStyle('.card_93{background-image:url(https://img.picgo.net/2024/11/04/card_93b1e4388a56bc424a.jpg)}');
        GM_addStyle('.card_96{background-image:url(https://img.picgo.net/2024/11/04/card_96205c11459a70de7e.jpg)}');
        GM_addStyle('.card_94{background-image:url(https://img.picgo.net/2024/11/04/card_94e0e52a8892d3bf8b.jpg)}');
        GM_addStyle('.card_92{background-image:url(https://img.picgo.net/2024/11/04/card_921b4f5c176f57e52f.jpg)}');
        GM_addStyle('.card_95{background-image:url(https://img.picgo.net/2024/11/04/card_95bf9e53f5cb81eebe.jpg)}');
        GM_addStyle('.card_91{background-image:url(https://img.picgo.net/2024/11/04/card_911171f148d4764087.jpg)}');
        GM_addStyle('.card_89{background-image:url(https://img.picgo.net/2024/11/04/card_890c29e507622ccf6a.jpg)}');
        GM_addStyle('.card_88{background-image:url(https://img.picgo.net/2024/11/04/card_885b05e240adf6f44f.jpg)}');
        GM_addStyle('.card_85{background-image:url(https://img.picgo.net/2024/11/04/card_8528ec1140c1f23b85.jpg)}');
        GM_addStyle('.card_84{background-image:url(https://img.picgo.net/2024/11/04/card_84699cdc57361690f6.jpg)}');
        GM_addStyle('.card_87{background-image:url(https://img.picgo.net/2024/11/04/card_8751d4ab79ce634ca7.jpg)}');
        GM_addStyle('.card_86{background-image:url(https://img.picgo.net/2024/11/04/card_86b129311f749d11ab.jpg)}');
        GM_addStyle('.card_90{background-image:url(https://img.picgo.net/2024/11/04/card_907ecf0c47e72df051.jpg)}');
        GM_addStyle('.card_82{background-image:url(https://img.picgo.net/2024/11/04/card_821fe688c0b9911a4d.jpg)}');
        GM_addStyle('.card_81{background-image:url(https://img.picgo.net/2024/11/04/card_81ab685117fc114e16.jpg)}');
        GM_addStyle('.card_83{background-image:url(https://img.picgo.net/2024/11/04/card_83112598dadc72254f.jpg)}');
        GM_addStyle('.card_80{background-image:url(https://img.picgo.net/2024/11/04/card_8071390be2f9a078da.jpg)}');
        GM_addStyle('.card_79{background-image:url(https://img.picgo.net/2024/11/04/card_7920a7fd7735e29987.jpg)}');
        GM_addStyle('.card_77{background-image:url(https://img.picgo.net/2024/11/04/card_770b96451d5293e47a.jpg)}');
        GM_addStyle('.card_76{background-image:url(https://img.picgo.net/2024/11/04/card_76f05704099b50464e.jpg)}');
        GM_addStyle('.card_78{background-image:url(https://img.picgo.net/2024/11/04/card_78b5554bae6e8691a1.jpg)}');
        GM_addStyle('.card_73{background-image:url(https://img.picgo.net/2024/11/04/card_73232df4b59579aa81.jpg)}');
        GM_addStyle('.card_75{background-image:url(https://img.picgo.net/2024/11/04/card_755e424dc8e5abcb45.jpg)}');
        GM_addStyle('.card_74{background-image:url(https://img.picgo.net/2024/11/04/card_74af28b313d7eae79f.jpg)}');
        GM_addStyle('.card_71{background-image:url(https://img.picgo.net/2024/11/04/card_714c6b5d02a5dd251e.jpg)}');
        GM_addStyle('.card_72{background-image:url(https://img.picgo.net/2024/11/04/card_728dad1457a35ea8d3.jpg)}');
        GM_addStyle('.card_68{background-image:url(https://img.picgo.net/2024/11/04/card_6847bc341e085278c9.jpg)}');
        GM_addStyle('.card_70{background-image:url(https://img.picgo.net/2024/11/04/card_7013da9c945f366ed2.jpg)}');
        GM_addStyle('.card_69{background-image:url(https://img.picgo.net/2024/11/04/card_69b2d65dd754afc302.jpg)}');
        GM_addStyle('.card_58{background-image:url(https://img.picgo.net/2024/11/04/card_586c7cb78f021b488f.jpg)}');
        GM_addStyle('.card_62{background-image:url(https://img.picgo.net/2024/11/04/card_62022087f97d0cfc78.jpg)}');
        GM_addStyle('.card_61{background-image:url(https://img.picgo.net/2024/11/04/card_61615a55060abb49f9.jpg)}');
        GM_addStyle('.card_59{background-image:url(https://img.picgo.net/2024/11/04/card_59c2f425de48cf64c4.jpg)}');
        GM_addStyle('.card_63{background-image:url(https://img.picgo.net/2024/11/04/card_6356dda75624ac993c.jpg)}');
        GM_addStyle('.card_64{background-image:url(https://img.picgo.net/2024/11/04/card_64960c34d1d7624405.jpg)}');
        GM_addStyle('.card_65{background-image:url(https://img.picgo.net/2024/11/04/card_65d685c21d989eee67.jpg)}');
        GM_addStyle('.card_60{background-image:url(https://img.picgo.net/2024/11/04/card_604e9527abc41a4a1a.jpg)}');
        GM_addStyle('.card_66{background-image:url(https://img.picgo.net/2024/11/04/card_66a362260fd5d8879f.jpg)}');
        GM_addStyle('.card_67{background-image:url(https://img.picgo.net/2024/11/04/card_6701695649f454fc80.jpg)}');
        GM_addStyle('.card_57{background-image:url(https://img.picgo.net/2024/11/04/card_57c1e8988e7ebab57c.jpg)}');
        GM_addStyle('.card_56{background-image:url(https://img.picgo.net/2024/11/04/card_56f05ef0e95f7de376.jpg)}');
        GM_addStyle('.card_52{background-image:url(https://img.picgo.net/2024/11/04/card_52a8bb8309c6be92bb.jpg)}');
        GM_addStyle('.card_55{background-image:url(https://img.picgo.net/2024/11/04/card_550261755c1daafdaa.jpg)}');
        GM_addStyle('.card_53{background-image:url(https://img.picgo.net/2024/11/04/card_53c4f163a7bf929d8a.jpg)}');
        GM_addStyle('.card_54{background-image:url(https://img.picgo.net/2024/11/04/card_5477f5e402575764e3.jpg)}');
        GM_addStyle('.card_51{background-image:url(https://img.picgo.net/2024/11/04/card_519904db6d8bceef4a.jpg)}');
        GM_addStyle('.card_49{background-image:url(https://img.picgo.net/2024/11/04/card_492bc058131883a405.jpg)}');
        GM_addStyle('.card_50{background-image:url(https://img.picgo.net/2024/11/04/card_5096547f66d779b89c.jpg)}');
        GM_addStyle('.card_43{background-image:url(https://img.picgo.net/2024/11/04/card_432216338f1c47ece8.jpg)}');
        GM_addStyle('.card_46{background-image:url(https://img.picgo.net/2024/11/04/card_46bdaef7ff11ba9dde.jpg)}');
        GM_addStyle('.card_45{background-image:url(https://img.picgo.net/2024/11/04/card_45a59bf7228f704377.jpg)}');
        GM_addStyle('.card_48{background-image:url(https://img.picgo.net/2024/11/04/card_48182482ea53860ce9.jpg)}');
        GM_addStyle('.card_44{background-image:url(https://img.picgo.net/2024/11/04/card_442dd645517abbf0f5.jpg)}');
        GM_addStyle('.card_47{background-image:url(https://img.picgo.net/2024/11/04/card_47126fa89bde955f58.jpg)}');
        GM_addStyle('.card_42{background-image:url(https://img.picgo.net/2024/11/04/card_428c50956420164760.jpg)}');
        GM_addStyle('.card_41{background-image:url(https://img.picgo.net/2024/11/04/card_41d5336ddf00b84d55.jpg)}');
        GM_addStyle('.card_40{background-image:url(https://img.picgo.net/2024/11/04/card_4013a2a11f8ca19c7e.jpg)}');
        GM_addStyle('.card_39{background-image:url(https://img.picgo.net/2024/11/04/card_397158c213158a9891.jpg)}');
        GM_addStyle('.card_38{background-image:url(https://img.picgo.net/2024/11/04/card_38406eb2f277f1323b.jpg)}');
        GM_addStyle('.card_34{background-image:url(https://img.picgo.net/2024/11/04/card_349f6433638082a26b.jpg)}');
        GM_addStyle('.card_35{background-image:url(https://img.picgo.net/2024/11/04/card_3532dec3e016c87f6c.jpg)}');
        GM_addStyle('.card_37{background-image:url(https://img.picgo.net/2024/11/04/card_37102fda61d6cd7ed1.jpg)}');
        GM_addStyle('.card_36{background-image:url(https://img.picgo.net/2024/11/04/card_36c5081c539c956414.jpg)}');
        GM_addStyle('.card_33{background-image:url(https://img.picgo.net/2024/11/04/card_336287e66c149e7fe4.jpg)}');
        GM_addStyle('.card_32{background-image:url(https://img.picgo.net/2024/11/04/card_32b02b6126db063aa7.jpg)}');
        GM_addStyle('.card_31{background-image:url(https://img.picgo.net/2024/11/04/card_31b2d9a9c369df1615.jpg)}');
        GM_addStyle('.card_30{background-image:url(https://img.picgo.net/2024/11/04/card_30bee2e51ec0adf547.jpg)}');
        GM_addStyle('.card_29{background-image:url(https://img.picgo.net/2024/11/04/card_299761f5efd8b8835d.jpg)}');
        GM_addStyle('.card_28{background-image:url(https://img.picgo.net/2024/11/04/card_28aaf7c771145ae682.jpg)}');
        GM_addStyle('.card_27{background-image:url(https://img.picgo.net/2024/11/04/card_2786db5bf6d4a22311.jpg)}');
        GM_addStyle('.card_23{background-image:url(https://img.picgo.net/2024/11/04/card_23b6f9ece66face2ec.jpg)}');
        GM_addStyle('.card_24{background-image:url(https://img.picgo.net/2024/11/04/card_24470f155c6566e750.jpg)}');
        GM_addStyle('.card_26{background-image:url(https://img.picgo.net/2024/11/04/card_26090a61d83aa8155d.jpg)}');
        GM_addStyle('.card_25{background-image:url(https://img.picgo.net/2024/11/04/card_2522b5f00ef8487ed0.jpg)}');
        GM_addStyle('.card_21{background-image:url(https://img.picgo.net/2024/11/04/card_21129088cb7b2b15b3.jpg)}');
        GM_addStyle('.card_22{background-image:url(https://img.picgo.net/2024/11/04/card_22d7d05a11cc775fd3.jpg)}');
        GM_addStyle('.card_20{background-image:url(https://img.picgo.net/2024/11/04/card_2042832bfbf1ea4059.jpg)}');
        GM_addStyle('.card_19{background-image:url(https://img.picgo.net/2024/11/04/card_19b5daa4ee02897a81.jpg)}');
        GM_addStyle('.card_16{background-image:url(https://img.picgo.net/2024/11/04/card_164207069e933d479a.jpg)}');
        GM_addStyle('.card_15{background-image:url(https://img.picgo.net/2024/11/04/card_1580a6e6ae9de22b3d.jpg)}');
        GM_addStyle('.card_17{background-image:url(https://img.picgo.net/2024/11/04/card_1715d223b772f7a73b.jpg)}');
        GM_addStyle('.card_18{background-image:url(https://img.picgo.net/2024/11/04/card_186c3ab9aed1707aab.jpg)}');
        GM_addStyle('.card_14{background-image:url(https://img.picgo.net/2024/11/04/card_1492d027ec1085e100.jpg)}');
        GM_addStyle('.card_11{background-image:url(https://img.picgo.net/2024/11/04/card_11cc8c8e15863e7200.jpg)}');
        GM_addStyle('.card_12{background-image:url(https://img.picgo.net/2024/11/04/card_12fd7affba774afe9c.jpg)}');
        GM_addStyle('.card_13{background-image:url(https://img.picgo.net/2024/11/04/card_13c52693870f071a2c.jpg)}');
        GM_addStyle('.card_10{background-image:url(https://img.picgo.net/2024/11/04/card_101827309eedbbeb3f.jpg)}');
        GM_addStyle('.card_4{background-image:url(https://img.picgo.net/2024/11/04/card_4c32caa6062a94b30.jpg)}');
        GM_addStyle('.card_1{background-image:url(https://img.picgo.net/2024/11/04/card_1256af3ec08e27397.jpg)}');
        GM_addStyle('.card_8{background-image:url(https://img.picgo.net/2024/11/04/card_8dba340c294986aa1.jpg)}');
        GM_addStyle('.card_3{background-image:url(https://img.picgo.net/2024/11/04/card_31db1d4e1831a7942.jpg)}');
        GM_addStyle('.card_5{background-image:url(https://img.picgo.net/2024/11/04/card_5d9c144b6458a3c11.jpg)}');
        GM_addStyle('.card_6{background-image:url(https://img.picgo.net/2024/11/04/card_6df3552d0c060d8ad.jpg)}');
        GM_addStyle('.card_9{background-image:url(https://img.picgo.net/2024/11/04/card_925826e2560bfe44c.jpg)}');
        GM_addStyle('.card_2{background-image:url(https://img.picgo.net/2024/11/04/card_2a435d297f44e5add.jpg)}');
        GM_addStyle('.card_7{background-image:url(https://img.picgo.net/2024/11/04/card_7ec0678ea882d6e5a.jpg)}');
    }

    if(weburl.indexOf('rally-the-troops.com/pax-pamir/info/cards.html')!=-1)
    {
        var reg = new RegExp('https://rally-the-troops.com/pax-pamir/cards/card');
        var images = document.querySelectorAll('img');
        var i, image;
        for (i = 0; i < images.length; i += 1) {
            image = images[i];
            if (image.src.match(reg)) {
                image.src = image.src.replace('rally-the-troops.com/pax-pamir/cards/card_116', 'img.picgo.net/2024/11/04/card_1161058b40f8498b898')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_114', 'img.picgo.net/2024/11/04/card_1149d15d3e8cc721e5d')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_115', 'img.picgo.net/2024/11/04/card_1158871ae52079b03e1')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_113', 'img.picgo.net/2024/11/04/card_113bf086372330bc956')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_111', 'img.picgo.net/2024/11/04/card_111fc007a20eef8596d')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_110', 'img.picgo.net/2024/11/04/card_1107b5588ae34084b31')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_112', 'img.picgo.net/2024/11/04/card_11210b97f2437af1c6c')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_108', 'img.picgo.net/2024/11/04/card_108a190d402b1b5708d')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_109', 'img.picgo.net/2024/11/04/card_1095e6063968a9f9c44')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_107', 'img.picgo.net/2024/11/04/card_10768ad0a56c4df3d59')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_106', 'img.picgo.net/2024/11/04/card_106d93944c710f27b1d')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_104', 'img.picgo.net/2024/11/04/card_1041b8649fed28c437c')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_105', 'img.picgo.net/2024/11/04/card_105fccec79b3f89bbd4')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_103', 'img.picgo.net/2024/11/04/card_103988899d87675861c')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_102', 'img.picgo.net/2024/11/04/card_10274f8535a2d5fe702')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_101', 'img.picgo.net/2024/11/04/card_101d36a4b944ba371eb')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_100', 'img.picgo.net/2024/11/04/card_100c9d64a4a2ad36dcd')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_98', 'img.picgo.net/2024/11/04/card_980d2bf6652372de77')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_99', 'img.picgo.net/2024/11/04/card_99c6d2cb2709ae967e')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_97', 'img.picgo.net/2024/11/04/card_9703107cbab2a169fb')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_93', 'img.picgo.net/2024/11/04/card_93b1e4388a56bc424a')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_96', 'img.picgo.net/2024/11/04/card_96205c11459a70de7e')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_94', 'img.picgo.net/2024/11/04/card_94e0e52a8892d3bf8b')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_92', 'img.picgo.net/2024/11/04/card_921b4f5c176f57e52f')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_95', 'img.picgo.net/2024/11/04/card_95bf9e53f5cb81eebe')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_91', 'img.picgo.net/2024/11/04/card_911171f148d4764087')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_89', 'img.picgo.net/2024/11/04/card_890c29e507622ccf6a')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_88', 'img.picgo.net/2024/11/04/card_885b05e240adf6f44f')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_85', 'img.picgo.net/2024/11/04/card_8528ec1140c1f23b85')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_84', 'img.picgo.net/2024/11/04/card_84699cdc57361690f6')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_87', 'img.picgo.net/2024/11/04/card_8751d4ab79ce634ca7')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_86', 'img.picgo.net/2024/11/04/card_86b129311f749d11ab')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_90', 'img.picgo.net/2024/11/04/card_907ecf0c47e72df051')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_82', 'img.picgo.net/2024/11/04/card_821fe688c0b9911a4d')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_81', 'img.picgo.net/2024/11/04/card_81ab685117fc114e16')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_83', 'img.picgo.net/2024/11/04/card_83112598dadc72254f')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_80', 'img.picgo.net/2024/11/04/card_8071390be2f9a078da')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_79', 'img.picgo.net/2024/11/04/card_7920a7fd7735e29987')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_77', 'img.picgo.net/2024/11/04/card_770b96451d5293e47a')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_76', 'img.picgo.net/2024/11/04/card_76f05704099b50464e')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_78', 'img.picgo.net/2024/11/04/card_78b5554bae6e8691a1')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_73', 'img.picgo.net/2024/11/04/card_73232df4b59579aa81')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_75', 'img.picgo.net/2024/11/04/card_755e424dc8e5abcb45')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_74', 'img.picgo.net/2024/11/04/card_74af28b313d7eae79f')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_71', 'img.picgo.net/2024/11/04/card_714c6b5d02a5dd251e')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_72', 'img.picgo.net/2024/11/04/card_728dad1457a35ea8d3')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_68', 'img.picgo.net/2024/11/04/card_6847bc341e085278c9')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_70', 'img.picgo.net/2024/11/04/card_7013da9c945f366ed2')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_69', 'img.picgo.net/2024/11/04/card_69b2d65dd754afc302')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_58', 'img.picgo.net/2024/11/04/card_586c7cb78f021b488f')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_62', 'img.picgo.net/2024/11/04/card_62022087f97d0cfc78')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_61', 'img.picgo.net/2024/11/04/card_61615a55060abb49f9')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_59', 'img.picgo.net/2024/11/04/card_59c2f425de48cf64c4')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_63', 'img.picgo.net/2024/11/04/card_6356dda75624ac993c')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_64', 'img.picgo.net/2024/11/04/card_64960c34d1d7624405')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_65', 'img.picgo.net/2024/11/04/card_65d685c21d989eee67')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_60', 'img.picgo.net/2024/11/04/card_604e9527abc41a4a1a')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_66', 'img.picgo.net/2024/11/04/card_66a362260fd5d8879f')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_67', 'img.picgo.net/2024/11/04/card_6701695649f454fc80')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_57', 'img.picgo.net/2024/11/04/card_57c1e8988e7ebab57c')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_56', 'img.picgo.net/2024/11/04/card_56f05ef0e95f7de376')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_52', 'img.picgo.net/2024/11/04/card_52a8bb8309c6be92bb')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_55', 'img.picgo.net/2024/11/04/card_550261755c1daafdaa')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_53', 'img.picgo.net/2024/11/04/card_53c4f163a7bf929d8a')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_54', 'img.picgo.net/2024/11/04/card_5477f5e402575764e3')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_51', 'img.picgo.net/2024/11/04/card_519904db6d8bceef4a')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_49', 'img.picgo.net/2024/11/04/card_492bc058131883a405')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_50', 'img.picgo.net/2024/11/04/card_5096547f66d779b89c')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_43', 'img.picgo.net/2024/11/04/card_432216338f1c47ece8')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_46', 'img.picgo.net/2024/11/04/card_46bdaef7ff11ba9dde')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_45', 'img.picgo.net/2024/11/04/card_45a59bf7228f704377')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_48', 'img.picgo.net/2024/11/04/card_48182482ea53860ce9')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_44', 'img.picgo.net/2024/11/04/card_442dd645517abbf0f5')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_47', 'img.picgo.net/2024/11/04/card_47126fa89bde955f58')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_42', 'img.picgo.net/2024/11/04/card_428c50956420164760')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_41', 'img.picgo.net/2024/11/04/card_41d5336ddf00b84d55')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_40', 'img.picgo.net/2024/11/04/card_4013a2a11f8ca19c7e')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_39', 'img.picgo.net/2024/11/04/card_397158c213158a9891')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_38', 'img.picgo.net/2024/11/04/card_38406eb2f277f1323b')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_34', 'img.picgo.net/2024/11/04/card_349f6433638082a26b')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_35', 'img.picgo.net/2024/11/04/card_3532dec3e016c87f6c')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_37', 'img.picgo.net/2024/11/04/card_37102fda61d6cd7ed1')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_36', 'img.picgo.net/2024/11/04/card_36c5081c539c956414')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_33', 'img.picgo.net/2024/11/04/card_336287e66c149e7fe4')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_32', 'img.picgo.net/2024/11/04/card_32b02b6126db063aa7')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_31', 'img.picgo.net/2024/11/04/card_31b2d9a9c369df1615')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_30', 'img.picgo.net/2024/11/04/card_30bee2e51ec0adf547')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_29', 'img.picgo.net/2024/11/04/card_299761f5efd8b8835d')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_28', 'img.picgo.net/2024/11/04/card_28aaf7c771145ae682')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_27', 'img.picgo.net/2024/11/04/card_2786db5bf6d4a22311')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_23', 'img.picgo.net/2024/11/04/card_23b6f9ece66face2ec')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_24', 'img.picgo.net/2024/11/04/card_24470f155c6566e750')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_26', 'img.picgo.net/2024/11/04/card_26090a61d83aa8155d')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_25', 'img.picgo.net/2024/11/04/card_2522b5f00ef8487ed0')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_21', 'img.picgo.net/2024/11/04/card_21129088cb7b2b15b3')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_22', 'img.picgo.net/2024/11/04/card_22d7d05a11cc775fd3')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_20', 'img.picgo.net/2024/11/04/card_2042832bfbf1ea4059')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_19', 'img.picgo.net/2024/11/04/card_19b5daa4ee02897a81')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_16', 'img.picgo.net/2024/11/04/card_164207069e933d479a')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_15', 'img.picgo.net/2024/11/04/card_1580a6e6ae9de22b3d')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_17', 'img.picgo.net/2024/11/04/card_1715d223b772f7a73b')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_18', 'img.picgo.net/2024/11/04/card_186c3ab9aed1707aab')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_14', 'img.picgo.net/2024/11/04/card_1492d027ec1085e100')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_11', 'img.picgo.net/2024/11/04/card_11cc8c8e15863e7200')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_12', 'img.picgo.net/2024/11/04/card_12fd7affba774afe9c')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_13', 'img.picgo.net/2024/11/04/card_13c52693870f071a2c')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_10', 'img.picgo.net/2024/11/04/card_101827309eedbbeb3f')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_4', 'img.picgo.net/2024/11/04/card_4c32caa6062a94b30')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_1', 'img.picgo.net/2024/11/04/card_1256af3ec08e27397')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_8', 'img.picgo.net/2024/11/04/card_8dba340c294986aa1')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_3', 'img.picgo.net/2024/11/04/card_31db1d4e1831a7942')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_5', 'img.picgo.net/2024/11/04/card_5d9c144b6458a3c11')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_6', 'img.picgo.net/2024/11/04/card_6df3552d0c060d8ad')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_9', 'img.picgo.net/2024/11/04/card_925826e2560bfe44c')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_2', 'img.picgo.net/2024/11/04/card_2a435d297f44e5add')
                                     .replace('rally-the-troops.com/pax-pamir/cards/card_7', 'img.picgo.net/2024/11/04/card_7ec0678ea882d6e5a')
            }
        }
    }
    if(weburl.indexOf('rally-the-troops.com/pax-pamir/info/pac.html')!=-1)
    {
        document.getElementById('page1').style.backgroundImage='url("https://img.picgo.net/2024/11/04/pac6dec9b79227cf286.jpg")';
        document.getElementById('page1').style.backgroundSize='cover';
        //document.getElementById('page1').style.width='527pt';
        //document.getElementById('page1').style.height='657pt';
        document.getElementById('page1').style.width='538pt';
        document.getElementById('page1').style.height='670pt';
    }


    /**
     * init 函数：初始化翻译功能。
     */
    function init() {
        // 获取当前页面的翻译规则
        page = getPage();
        console.log(`开始page = ${page}`);

        // 翻译页面标题
        transTitle();

        if (page) {
            // 立即翻译页面
            traverseNode(document.body);

            setTimeout(() => {
                // 使用 CSS 选择器找到页面上的元素，并将其文本内容替换为预定义的翻译
                // 翻译页面标题
                transTitle();
                transBySelector();
            }, 500);
        }
        // 监视页面变化
        watchUpdate();
    }
    window.addEventListener('mousedown', () => {
        if (page) {
            transTitle(); // 翻译页面标题
            transBySelector();
            if (letters.size !== 0 &&  letters.size !== letters_size) {
                letters_size = letters.size;
                console.log([...letters]);
            }
        }
    });
    // 执行初始化
    init();
})(window, document);