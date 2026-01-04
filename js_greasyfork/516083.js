// ==UserScript==
// @name         网站掌控者（Website Manager）
// @namespace    http://tampermonkey.net/
// @version      5.2.0
// @description  隐藏或者高亮以指定网址以及标题开头的搜索结果，屏蔽掉一些垃圾内容、减少阅读重复内容。
// @author       Ryanli
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/jpeg;base64,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
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/516083/%E7%BD%91%E7%AB%99%E6%8E%8C%E6%8E%A7%E8%80%85%EF%BC%88Website%20Manager%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/516083/%E7%BD%91%E7%AB%99%E6%8E%8C%E6%8E%A7%E8%80%85%EF%BC%88Website%20Manager%EF%BC%89.meta.js
// ==/UserScript==


(function () {
    'use strict';
    let observer = null; // 用于MutationObserver监听handle用于控制是否暂停
    const matchedTitle = document.title; // 网页标题
    const currentUrl = window.location.href; // 网页的链接
    const matchedUrl = currentUrl.split('?')[0]; // 截取网页链接 ? 前面的部分作为匹配的链接
    let insertedParents = new Set(); // 用于记录已经插入过button的节点，也就已经blocked的节点
    let highlightedParents = new Set(); // 用于记录已经highlighted的节点

    // 相关通用样式，还有一些ConfigBar以及label的样式不在这里
    const commonStyles = "font-size: 15px; font-weight: bold; font-family: Arial, sans-serif; line-height: 1.5; color: #333333;"
    const tabButtonCommonStyle = commonStyles + "padding: 0.2em 0.1em; user-select: none; cursor: pointer; display: flex; justify-content: center; alignItems: center; height: 2em; width: 30%; min-width: 4.5em; border-top-left-radius: 0.5em; border-top-right-radius: 0.5em; border: none;"
    const popupCommonStyle = commonStyles + `position: fixed; overflow: visible; top: ${parseInt(window.innerHeight * 0.5)}px; left: ${parseInt(window.innerWidth * 0.5)}px;; transform: translate(-50%, -50%); background-color: #ffffff; padding: 0.5em; border-radius: 1em; border: none; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5); width: 30%; min-width: 200px; max-width: 350px;  max-height: 200px; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 1999999;`
    const buttonCommonStyle = commonStyles + 'padding: 8px; border-radius: 10px; border: none; cursor: pointer;'
    const textareaCommonStyle = commonStyles + 'padding: 0px 5px; border-radius: 6px; border: 1px solid #D1D5DB; width: 100%; height: 2em; margin-bottom: 10px; background-color: #cccccc;'
    const checkboxContainerCommonStyle = commonStyles + 'display: flex; flex-direction: row; justify-content: center; width: 100%; align-items: center; margin-bottom: 10px;'
    const checkboxCommonStyle = commonStyles + "margin: 10px; border: 1px solid #333; padding: 0; width: 15px; height: 15px; appearance: none; outline: none; border-radius: 6px; transform: scale(1.2);"
    const buttonsContainerCommonStyle = commonStyles + 'display: flex; flex-direction: row; justify-content: space-between; width: 100%;'

    let insertedButtonStyle = `word-wrap: break-word; width: 100%; display: ${GM_getValue('buttonShow') ? 'block' : 'none'}; justify-content: center; align-items: center; position: related; top: 0; left:0; line-height: 1.0; padding: 0.5em; border-radius: 6px; cursor: pointer; border: 1px solid #D1D5DB; background-color: rgba(255, 255, 255, 0.5); color: #CCCCCC; font-size: 12px;`
    // 在脚本注入时运行的相关初始化函数
    registerSearchEngineMenu();
    initializeStorage();
    initializeGM_addValueChangeListener();
    initializeMutationObserver()
    initializeShortKeyListener();
    runWithoutObserver(initializeConfigBar);
    runWithoutObserver(startProcess);


    document.addEventListener('visibilitychange', function () { runWithoutObserver(applySettingsData) });
    /**重写原本的方法，防止触发observer */
    // 封装一个新的 removeChild 函数
    function customRemoveChild(child) {
        runWithoutObserver(() => {
            document.body.removeChild(child);
        });
    }

    // 封装一个新的 appendChild 函数
    function customAppendChild(child) {
        runWithoutObserver(() => {
            document.body.appendChild(child);
        });
    }


    /**初始化存储参数 */
    function initializeStorage() {
        if (GM_getValue('resetStorage', true)) {
            // rest flag, 让其只在安装脚本时默认执行一次，后续可以通过修改存储中的rest值来确认是否修改
            GM_setValue('resetStorage', false);
            // search engines
            GM_setValue('searchEngines', [
                "https://www.google.com/search",
                "https://duckduckgo.com/",
                "https://www.ecosia.org/search",
                "https://www.ecosia.org/videos",
                "https://www.qwant.com/",
                "https://search.brave.com/search",
                "https://cn.bing.com/search",
                "https://www.bing.com/search",
                "https://www.so.com/s",
                "https://yandex.com/search/",
                "https://exa.ai/search",
                "https://searx.oakleycord.dev/search",
                "https://kaifa.baidu.com/searchPage",
                "https://www.baidu.com/s",
                "https://so.csdn.net/so/search",
                "https://www.sogou.com/web",
                "https://so.toutiao.com/search/",
                "https://search.bilibili.com/all",
                "https://www.bilibili.com/"
            ]);
            // url
            GM_setValue('urlsToBlock', {});
            GM_setValue('urlsToHighlight', {});
            // title
            GM_setValue('titlesToBlock', {});
            GM_setValue('titlesToHighLight', {});
            // initializeSettingPopup
            GM_setValue('elementsMaxFatherLevel', {
                "https://www.google.com/search": "6",
                "https://duckduckgo.com/": "1",
                "https://www.ecosia.org/search": "3",
                "https://www.ecosia.org/videos": "1",
                "https://www.qwant.com/": "2",
                "https://search.brave.com/search": "1",
                "https://cn.bing.com/search": "1",
                "https://www.bing.com/search": "1",
                "https://www.so.com/s": "2",
                "https://yandex.com/search": "2",
                "https://exa.ai/search": "0",
                "https://searx.oakleycord.dev/search": "1",
                "https://kaifa.baidu.com/searchPage": "1",
                "https://www.baidu.com/s": "4",
                "https://so.csdn.net/so/search": "2",
                "https://www.sogou.com/web": "1",
                "https://so.toutiao.com/search/": "2",
                "https://search.bilibili.com/all": "2",
                "https://www.bilibili.com/": "4"
            });
            GM_setValue('elementsMaxChildrenNum', {
                "https://www.google.com/search": "6",
                "https://duckduckgo.com/": "4",
                "https://www.ecosia.org/search": "3",
                "https://www.ecosia.org/videos": "3",
                "https://www.qwant.com/": "2",
                "https://search.brave.com/search": "2",
                "https://cn.bing.com/search": "2",
                "https://www.bing.com/search": "5",
                "https://www.so.com/s": "3",
                "https://yandex.com/search": "2",
                "https://exa.ai/search": "2",
                "https://searx.oakleycord.dev/search": "2",
                "https://kaifa.baidu.com/searchPage": "5",
                "https://www.baidu.com/s": "4",
                "https://so.csdn.net/so/search": "3",
                "https://www.sogou.com/web": "5",
                "https://so.toutiao.com/search/": "2",
                "https://search.bilibili.com/all": "2",
                "https://www.bilibili.com/": "4"
            });

            GM_setValue('buttonShow', true);
            // invisible initializeSettingPopup
            GM_setValue('thresholdDistanceFactor', 0.3);
            GM_setValue('thresholdChildElementCount', 50);
        }
    }
    /**监听存储值变化 */
    function initializeGM_addValueChangeListener() {
        // 对resetStorage进行监控
        GM_addValueChangeListener('resetStorage', function (name, old_value, new_value, remote) {
            // runWithoutObserver(startProcess);
            console.log('监听到了resetStorage更改', name, old_value, new_value, remote);
        });

        // 对searchEngines进行监控
        GM_addValueChangeListener('searchEngines', function (name, old_value, new_value, remote) {
            // runWithoutObserver(startProcess);
            console.log('监听到了searchEngines更改', name, old_value, new_value, remote);
        });

        // 对urlsToBlock进行监控
        GM_addValueChangeListener('urlsToBlock', function (name, old_value, new_value, remote) {
            runWithoutObserver(applySettingsData);
            console.log('监听到了urlsToBlock更改', name, old_value, new_value, remote);
        });

        // 对urlsToHighlight进行监控
        GM_addValueChangeListener('urlsToHighlight', function (name, old_value, new_value, remote) {
            runWithoutObserver(applySettingsData);
            console.log('监听到了urlsToHighlight更改', name, old_value, new_value, remote);
        });

        // 对titlesToBlock进行监控
        GM_addValueChangeListener('titlesToBlock', function (name, old_value, new_value, remote) {
            runWithoutObserver(applySettingsData);
            console.log('监听到了titlesToBlock更改', name, old_value, new_value, remote);
        });

        // 对titlesToHighLight进行监控
        GM_addValueChangeListener('titlesToHighLight', function (name, old_value, new_value, remote) {
            runWithoutObserver(applySettingsData);
            console.log('监听到了titlesToHighLight更改', name, old_value, new_value, remote);
        });

        // 对elementsMaxFatherLevel进行监控
        GM_addValueChangeListener('elementsMaxFatherLevel', function (name, old_value, new_value, remote) {
            runWithoutObserver(applySettingsData);
            console.log('监听到了elementsMaxFatherLevel更改', name, old_value, new_value, remote);
        });

        // 对elementsMaxChildrenNum进行监控
        GM_addValueChangeListener('elementsMaxChildrenNum', function (name, old_value, new_value, remote) {
            runWithoutObserver(applySettingsData);
            console.log('监听到了elementsMaxChildrenNum更改', name, old_value, new_value, remote);
        });

        // 对buttonShow进行监控
        GM_addValueChangeListener('buttonShow', function (name, old_value, new_value, remote) {
            runWithoutObserver(startProcess);
            console.log('监听到了buttonShow更改', name, old_value, new_value, remote);
        });

        // 对thresholdDistanceFactor进行监控
        GM_addValueChangeListener('thresholdDistanceFactor', function (name, old_value, new_value, remote) {
            // runWithoutObserver(startProcess);
            console.log('监听到了thresholdDistanceFactor更改', name, old_value, new_value, remote);
        });

        // 对thresholdChildElementCount进行监控
        GM_addValueChangeListener('thresholdChildElementCount', function (name, old_value, new_value, remote) {
            // runWithoutObserver(startProcess);
            console.log('监听到了thresholdChildElementCount更改', name, old_value, new_value, remote);
        });
    }
    /**监听快捷键 */
    function initializeShortKeyListener() {
        // 打开设置页面
        document.addEventListener('keyup', function (event) {
            if (event.altKey && event.shiftKey && event.key === 'S') {
                runWithoutObserver(initializeSettingPopup);
            }
        });
        // 打开添加页面
        document.addEventListener('keyup', function (event) {
            if (event.altKey && event.shiftKey && event.key === 'B') {
                runWithoutObserver(initializeAddingPopup);
            }
        });
    }
    /**监听document节点变化 */
    function initializeMutationObserver() {
        /** 500ms防抖*/
        function debounce(func, wait) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
        const debouncedStartProcess = debounce(startProcess, 500); // 500毫秒的延迟
        // 创建监听
        observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    runWithoutObserver(receiveMsgFromMouseGesture);
                    runWithoutObserver(debouncedStartProcess);
                    console.log('A child node has been added or removed.');
                    console.log('GM_getValue("urlsToBlock", {})', GM_getValue('urlsToBlock', {}), 'GM_getValue("urlsToHighlight", {})', GM_getValue('urlsToHighlight', {}), 'GM_getValue("titlesToBlock", {})', GM_getValue('titlesToBlock', {}), 'GM_getValue("titlesToHighLight", {})', GM_getValue('titlesToHighLight', {}), 'GM_getValue("elementsMaxFatherLevel", {})', GM_getValue('elementsMaxFatherLevel', {}), 'GM_getValue("elementsMaxChildrenNum", {})', GM_getValue('elementsMaxChildrenNum', {}), 'GM_getValue("buttonShow", {})', GM_getValue('buttonShow', {}), 'GM_getValue("thresholdDistanceFactor", {})', GM_getValue('thresholdDistanceFactor', {}))
                }
            }
        });
        // 设置监听类型
        observer.observe(document.body, {
            childList: true, // 观察子节点的添加和删除
            subtree: true // 观察目标节点及其所有后代节点
        });
    }
    /**初始化侧边栏 */
    function initializeConfigBar() {
        // 如果已经存在侧边栏，则删除旧的侧边栏
        if (document.getElementById('configsideBar')) {
            customRemoveChild(document.getElementById('configsideBar'));
        }
        let siderBar = document.createElement('div');
        siderBar.id = 'configsideBar';
        siderBar.style.cssText = commonStyles + "display: flex; flex-direction: column; position: fixed; top: 50%; right: 0; z-index: 1999999; cursor: pointer; padding: 2px 5px; transition: transform 0.3s; transform: translateY(0) translateX(50%); border-top-left-radius: 15px; border-bottom-left-radius: 15px; box-shadow: -2px 2px 5px rgba(0,0,0,0.5); margin: 0px";
        const siderBarButtonCommonStyle = 'font-size: 15px; font-weight: bold; font-family: Arial, sans-serif; line-height: 1.5; margin: 5px 0px; padding: 5px 5px; border-radius: 20px; border: none; cursor: pointer; '

        function chooseSiderBarType() {
            console.log('searchEngines.includes(matchedUrl)', GM_getValue('searchEngines', []).includes(matchedUrl))
            return GM_getValue('searchEngines', []).includes(matchedUrl)
        }
        if (chooseSiderBarType()) {
            siderBar.innerHTML =
                `<button id="addUrlTabButton" style="${siderBarButtonCommonStyle} background-color: #D1D5DB; color: #111111;">添加</button>` +
                `<button id="openSettingsButton" style="${siderBarButtonCommonStyle} background-color: #0092EE; color: white;">设置</button>`;
            siderBar.querySelector("#addUrlTabButton").addEventListener('click', function () { runWithoutObserver(initializeAddingPopup) });
            siderBar.querySelector("#openSettingsButton").addEventListener('click', function () { runWithoutObserver(initializeSettingPopup) });
        } else {
            const siderBarIconStyle = 'font-size: 15px; font-weight: bold; font-family: Arial, sans-serif; line-height: 1.5; margin: 2px 2px; padding: 5px 10px; border-radius: 20px; border: none; cursor: pointer; '

            siderBar.innerHTML =
                `<button id="addUrlButton" click-times="0"; style="${siderBarIconStyle} background-color: #D1D5DB; color: #111111;">N</button>`
            let flagIcon = siderBar.querySelector("#addUrlButton")
            let urlsToBlockStorage = GM_getValue('urlsToBlock', {});
            let urlsToHighlightStorage = GM_getValue('urlsToHighlight', {});
            initializeIcon()
            flagIcon.addEventListener('click', updateIcon);
            /**初始化Icon Bar */
            function initializeIcon() {
                if (matchedUrl in urlsToHighlightStorage) {
                    flagIcon.style.backgroundColor = "#DA9816"
                    flagIcon.textContent = 'H'
                    flagIcon.setAttribute('click-times', '2')
                } else if (matchedUrl in urlsToBlockStorage) {
                    flagIcon.style.backgroundColor = "#B0352A"
                    flagIcon.textContent = 'B'
                    flagIcon.setAttribute('click-times', '1')
                } else {
                    flagIcon.style.backgroundColor = "#D1D5DB"
                    flagIcon.textContent = 'N'
                    flagIcon.setAttribute('click-times', '0')
                }
            }
            /**点击之后更新Icon Bar颜色、文本以及存储 */
            function updateIcon() {
                let clickTimes = parseInt(flagIcon.getAttribute('click-times')) + 1
                flagIcon.setAttribute('click-times', clickTimes.toString())

                // let urlsToBlockStorage = GM_getValue('urlsToBlock', {});
                // let urlsToHighlightStorage = GM_getValue('urlsToHighlight', {});
                if (clickTimes % 3 == 1) {
                    flagIcon.style.backgroundColor = "#B0352A"
                    flagIcon.textContent = 'B'
                    urlsToBlockStorage[matchedUrl] = matchedTitle
                    delete urlsToHighlightStorage[matchedUrl]
                } else if (clickTimes % 3 == 2) {
                    flagIcon.style.backgroundColor = "#DA9816"
                    flagIcon.textContent = 'H'
                    delete urlsToBlockStorage[matchedUrl]
                    urlsToHighlightStorage[matchedUrl] = matchedTitle
                } else {
                    flagIcon.style.backgroundColor = "#D1D5DB"
                    flagIcon.textContent = 'N'
                    delete urlsToBlockStorage[matchedUrl]
                    delete urlsToHighlightStorage[matchedUrl]
                }
                GM_setValue('urlsToBlock', urlsToBlockStorage);
                GM_setValue('urlsToHighlight', urlsToHighlightStorage);
            }
        }
        customAppendChild(siderBar);
        siderBar.addEventListener('mouseenter', function (e) {
            console.log(e);
            siderBar.style.transform = "translateY(0) translateX(0)";
        });
        siderBar.addEventListener('mouseleave', function (e) {
            console.log(e);
            setTimeout(function () {
                if (!siderBar.matches(':hover')) {
                    siderBar.style.transform = "translateY(0) translateX(50%)";
                }
            }, 1000);
        });
    }

    /**判断元素包含关系 */
    function elementContains(parent, child) {
        return parent.contains(child);
    }

    /**获取网页对应的元素最大父节点级别 */
    function getMaxFatherLevel() {
        let MaxFatherLevel = GM_getValue('elementsMaxFatherLevel', {});
        for (const [siteName, level] of Object.entries(MaxFatherLevel)) {
            if (matchedUrl.includes(siteName)) {
                return level;
            }
        }
        // 默认返回0表示隐藏a标签元素
        return 0;
    }
    /**获取网页对应的元素最大子节点数量 */
    function getMaxChildrenNum() {
        let elementMaxNum = GM_getValue('elementsMaxChildrenNum', {});
        for (const [siteName, num] of Object.entries(elementMaxNum)) {
            if (matchedUrl.includes(siteName)) {
                return num;
            }
        }
        // 默认返回-1表示不限制元素层级
        return -1;
    }

    /**按url进行分组 */
    function groupedByUrl(url) {
        const links = findMatchingLinks(url)
        const linksArray = Array.from(links);
        const groupedLinks = {};
        linksArray.forEach((link) => {
            const href = link.href;
            if (!groupedLinks[href]) {
                groupedLinks[href] = [];
            }
            groupedLinks[href].push(link);
        });
        return transformGroupedLinks(groupedLinks);
        /**返回href与url匹配的 a 元素 */
        function findMatchingLinks(url) {
            const baseUrl = document.location.origin;
            const allLinks = document.querySelectorAll('a');  // common
            // const allLinks = document.querySelectorAll('#b_results a'); // bing
            // const allLinks = document.querySelectorAll('#rso a'); // google
            // const allLinks = document.querySelectorAll('#search-result a'); // yandex
            // console.log('allLinks', allLinks)
            const matchingLinks = [];

            allLinks.forEach((link) => {
                const href = link.getAttribute('href');
                if (href != null) {
                    // 如果href是相对路径，就拼接上基础URL
                    const absoluteHref = href.startsWith('/') ? href.startsWith('//') ? 'https:' + href : baseUrl + href : href;
                    // if (absoluteHref.startsWith(url)) {
                    //     matchingLinks.push(link);
                    // }
                    if (matchWithWildcards(url, absoluteHref)) {
                        matchingLinks.push(link);
                    }
                }
            });
            return matchingLinks;
        }
        // 新增通配符匹配函数
        function matchWithWildcards(pattern, str) {
            // 将通配符转换为正则表达式
            const regexPattern = pattern
                .replace(/\*/g, '.*') // * 匹配任意字符
                .replace(/\?/g, '.'); // ? 匹配单个字符
            
            const regex = new RegExp(`^${regexPattern}$`);
            return regex.test(str);
        }
        /**进一步对已经按url分组的再根据条件进行拆分，防止同一个url出现在不同位置导致找到的最小父元素过大 */
        function transformGroupedLinks(groupedLinks) {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const thresholdHeightDistance = screenHeight * GM_getValue('thresholdDistanceFactor');
            const thresholdWidthDistance = screenWidth * GM_getValue('thresholdDistanceFactor');
            const finalGroupedLinks = {};
            Object.keys(groupedLinks).forEach((href) => {
                const linksGroup = groupedLinks[href];
                let processedLinks = [];
                let groupId = 0;
                linksGroup.forEach((link, index) => {
                    if (!processedLinks.includes(link)) {
                        const groupKey = `${href}_${groupId++}`;
                        if (!finalGroupedLinks[groupKey]) {
                            finalGroupedLinks[groupKey] = [];
                        }
                        finalGroupedLinks[groupKey].push(link);
                        processedLinks.push(link);
                        const rect = link.getBoundingClientRect();
                        linksGroup.forEach((otherLink, otherIndex) => {
                            if (index !== otherIndex) {
                                const otherRect = otherLink.getBoundingClientRect();

                                // 计算X轴上相邻边最近的距离
                                const xDistance = Math.min(
                                    Math.abs(rect.right - otherRect.left),
                                    Math.abs(rect.left - otherRect.right),
                                    Math.abs(rect.right - otherRect.right),
                                    Math.abs(rect.left - otherRect.left)
                                );

                                // 计算Y轴上相邻边最近的距离
                                const yDistance = Math.min(
                                    Math.abs(rect.bottom - otherRect.top),
                                    Math.abs(rect.top - otherRect.bottom),
                                    Math.abs(rect.bottom - otherRect.bottom),
                                    Math.abs(rect.top - otherRect.top)
                                );
                                // 只要距离符合X轴或者Y轴距离，同时符合子孙节点数量，就认为是同一个隐藏块
                                if ((yDistance < thresholdHeightDistance || xDistance < thresholdWidthDistance) && countSpecificDescendants(findLeastCommonParent([link, otherLink])) < GM_getValue('thresholdChildElementCount')) {
                                    processedLinks.push(otherLink);
                                    finalGroupedLinks[groupKey].push(otherLink);
                                }
                            }
                        });
                    }
                });
            });
            return finalGroupedLinks;
            /**某个元素查找指定类型的子孙元素 */
            function countSpecificDescendants(node) {
                const nodeTypes = ['div', 'span', 'ol', 'li']; // 需要统计数量的节点类型
                let count = 0;
                // 使用 querySelectorAll 查找特定类型的子孙节点
                nodeTypes.forEach(type => {
                    count += node.querySelectorAll(type).length;
                });

                return count;
            }
        }
    }
    /**查找元素的最小父节点，用于作为隐藏的单元 */
    function findLeastCommonParent(links) {
        if (!links.length) return null;
        let current = links[0];
        let commonParent = current.parentElement;
        while (commonParent) {
            let isCommon = true;
            for (let i = 0; i < links.length; i++) {
                if (!elementContains(commonParent, links[i])) {
                    isCommon = false;
                    break;
                }
            }
            if (isCommon) console.log('commonParent', commonParent, 'links', links);
            if (isCommon) return commonParent;
            commonParent = commonParent.parentElement;
        }
        return null;
    }
    /**过滤相互覆盖的leastCommonParents */
    function filterLeastCommonParent(leastCommonParents) {
        let toRemove = [];

        for (let i = 0; i < leastCommonParents.length; i++) {
            for (let j = i + 1; j < leastCommonParents.length; j++) {
                if (elementContains(leastCommonParents[i], leastCommonParents[j])) {
                    toRemove.push(leastCommonParents[j]);
                } else if (elementContains(leastCommonParents[j], leastCommonParents[i])) {
                    toRemove.push(leastCommonParents[i]);
                }
            }
        }

        // 去除重复标记要剔除的元素
        let uniqueToRemove = [...new Set(toRemove)];

        // 过滤掉要剔除的元素
        return leastCommonParents.filter(element => !uniqueToRemove.includes(element));
    }
    /**按类型屏蔽或高亮处理某一个元素 */
    function handleParentElement(parent, type, tag) {
        // 如果parent元素已经处理过，则只是更新button文字
        if (insertedParents.has(parent) || highlightedParents.has(parent)) {
            updateInsertButtonsDisplay(parent);
        } else {
            if (type == 'block') {// 屏蔽部分
                let insertedButton = createInsertedButton(parent, tag);
                if (parent.nextSibling) {
                    parent.parentNode.insertBefore(insertedButton, parent.nextElementSibling);
                    // parent.appendChild(insertedButton);
                    // parent.insertAdjacentHTML("beforeend", `<button style='display:unset;' class='insertedButton' " data-host="11" title='点击显示被 blocked 的结果，可以通过设置界面来隐藏按钮。'>block</button>`);

                } else {
                    parent.parentNode.appendChild(insertedButton);
                }
                parent.style.display = 'none';
                insertedParents.add(parent);
            } else {// 高亮逻辑部分
                // 为 parent 元素添加 highlight 类
                parent.classList.add('highlight');
                // 为parent元素中所有img类型的子孙节点添加highlight类
                function addHighlightClass(node) {
                    if (node.nodeType === 1) { // 只处理元素节点，nodeType为1表示元素节点
                        if (node.tagName !== 'IMG') { // 如果是img类型的节点
                            node.classList.add('highlight');
                        }
                        // 继续遍历当前节点的子节点
                        Array.from(node.children).forEach(child => {
                            addHighlightClass(child);
                        });
                    }
                }
                addHighlightClass(parent);
                // 使用 GM_addStyle 设置 highlight 类的样式
                GM_addStyle(`
                        .highlight {
                                background-color: #FFFFE0!important;
                            }
                        `);
                highlightedParents.add(parent);
            }
        }
        /**根据传入元素创建一个位于其后的button，并将其返回 */
        function createInsertedButton(parent) {
            let insertedButton = document.createElement('button');
            insertedButton.classList.add('insertedButton');
            insertedButton.textContent = 'Show  blocked by ' + tag;
            insertedButton.title = '点击显示被 blocked 的结果，可以通过设置界面来隐藏按钮。';
            insertedButton.setAttribute('click-count', '0'); // 添加自定义属性并初始化为0
            insertedButton.style.cssText = insertedButtonStyle 
            // 使用GM_addStyle来设置按钮样式
            // GM_addStyle(insertedButtonStyle);
            insertedButton.addEventListener('click', () => { runWithoutObserver(updateInsertButtonsText, insertedButton, parent) });
            function updateInsertButtonsText(insertedButton, parent) {
                let clickCount = parseInt(insertedButton.getAttribute('click-count'));
                if (clickCount % 2 === 0) {
                    insertedButton.textContent = 'Hide  blocked by ' + tag;
                    insertedButton.title = '点击隐藏被 blocked 的结果，可以通过设置界面来隐藏按钮。';
                    insertedButton.style.backgroundColor = '#f56565';
                    insertedButton.style.color = 'white';
                    insertedButton.style.borderColor = 'white';
                    parent.style.display = 'inline-block'; // 显示元素
                } else {
                    insertedButton.textContent = 'Show  blocked by ' + tag;
                    insertedButton.title = '点击显示被 blocked 的结果，可以通过设置界面来隐藏按钮。';
                    insertedButton.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                    insertedButton.style.color = '#CCCCCC';
                    insertedButton.style.borderColor = '#D1D5DB';
                    parent.style.display = 'none'; // 隐藏元素
                }
                clickCount++
                insertedButton.setAttribute('click-count', clickCount.toString()); // 更新按钮的点击次数属性
            }
            return insertedButton
        }

        /**更新插入按钮的文字 */
        function updateInsertButtonsDisplay(parent) {
            if (insertedParents.has(parent) || highlightedParents.has(parent)) {
                const buttons = document.querySelectorAll(".insertedButton");
                // 更新button文字状态
                Array.from(buttons).forEach((insertedButton) => {
                    if (!GM_getValue('buttonShow')) {
                        insertedButton.style.display = 'none';
                    } else {
                        insertedButton.style.display = 'inline-block';
                    }
                });
            }

        }
    }
    /**对链接执行屏蔽或高亮 */
    function iterateProcessedLinks(processedLinks, blockOrhighlight, tag) {
        let leastCommonParents = []
        Object.values(processedLinks).forEach((commonLinks) => {
            let hiddenLevel = getMaxFatherLevel();
            if (hiddenLevel < 0) {// 如果hiddlevel小于0则直接返回
                return
            } else if (hiddenLevel == 0) {
                Array.from(commonLinks).forEach((commonLink) => {
                    leastCommonParents.push(commonLink)
                });
            } else {
                leastCommonParents.push(findLeastCommonParent(commonLinks))
            }
        })
        leastCommonParents = filterLeastCommonParent(leastCommonParents)


        Object.values(leastCommonParents).forEach((leastCommonParent) => {
            let hiddenLevel = getMaxFatherLevel();
            let maxChildrenNum = getMaxChildrenNum();
            for (let j = 0; j < hiddenLevel; j++) {
                if ((maxChildrenNum > -1) && leastCommonParent.parentNode.childElementCount > maxChildrenNum) break;
                if (leastCommonParent === document.body || leastCommonParent === document.documentElement) break;
                leastCommonParent = leastCommonParent.parentNode;
            }
            handleParentElement(leastCommonParent, blockOrhighlight, tag);
        })
    }
    /**作为开始处理的入口，调用其他函数来进行相关操作 */
    function startProcess() {
        console.log('run startProcess');
        // 链接查找
        const urlsToHighlight = GM_getValue('urlsToHighlight', {});
        const urlsToBlock = GM_getValue('urlsToBlock', {});
        const urls = [urlsToHighlight, urlsToBlock];
        for (let i = 0; i < urls.length; i++) {
            for (const url of Object.keys(urls[i])) {
                const groupedLinks = groupedByUrl(url)
                iterateProcessedLinks(groupedLinks, i ? 'block' : 'highlight', url)
            }
        }
        // 标题查找
        let titlesToHighLight = GM_getValue('titlesToHighLight', {});
        let titlesToBlock = GM_getValue('titlesToBlock', {});

        const aElements = document.querySelectorAll('a');
        let aElementBlockedHrefs = {};
        let aElementHighlightedHrefs = {};
        // 获取标题对应的链接
        aElements.forEach((aElement) => {
            let aElementHref = aElement.href;
            const aElementTextContent = aElement.textContent;
            if (aElementHref && aElementTextContent && aElementTextContent.trim() !== '') {
                let foundInHighlight = false
                // for (const highlightTitle in titlesToHighLight) {
                //     if (highlightTitle.trim() !== '' && aElementTextContent.includes(highlightTitle)) {
                //         console.log(`Match found for title "${aElementTextContent}" with URL: ${aElementHref}`);
                //         aElementHighlightedHrefs[aElementHref] = highlightTitle.trim();
                //         foundInHighlight = true
                //         break;
                //     }
                // }
                for (const highlightTitle in titlesToHighLight) {
                    if (highlightTitle.trim() !== '' && matchWithWildcards(highlightTitle.trim(), aElementTextContent)) {
                        console.log(`Match found for title "${aElementTextContent}" with URL: ${aElementHref}`);
                        aElementHighlightedHrefs[aElementHref] = highlightTitle.trim();
                        foundInHighlight = true
                        break;
                    }
                }
                // 如果没找到就去highlight找，如果找到就不需要找了
                // if (!foundInHighlight)
                //     for (const blockTitle in titlesToBlock) {
                //         if (blockTitle.trim() !== '' && aElementTextContent.includes(blockTitle)) {
                //             console.log(`Match found for title "${aElementTextContent}" with URL: ${aElementHref}`);
                //             aElementBlockedHrefs[aElementHref] = blockTitle.trim();
                //             break;
                //         }
                //     }
                if (!foundInHighlight) {
                    for (const blockTitle in titlesToBlock) {
                        if (blockTitle.trim() !== '' && matchWithWildcards(blockTitle.trim(), aElementTextContent)) {
                            console.log(`Match found for title "${aElementTextContent}" with URL: ${aElementHref}`);
                            aElementBlockedHrefs[aElementHref] = blockTitle.trim();
                            break;
                        }
                    }
                }
            }
        });
        for (const url in aElementHighlightedHrefs) {
            const groupedLinks = groupedByUrl(url);
            iterateProcessedLinks(groupedLinks, 'highlight', aElementHighlightedHrefs[url]);
        }
        for (const url of Object.keys(aElementBlockedHrefs)) {
            const groupedLinks = groupedByUrl(url)
            iterateProcessedLinks(groupedLinks, 'block', aElementBlockedHrefs[url]);
        }
    }
    /**让元素可以被拖动 */
    function makeDraggable(element, header) {
        let offsetX, offsetY;

        // 处理鼠标按下事件
        header.addEventListener('mousedown', function (e) {
            offsetX = e.clientX - parseInt(element.style.left);
            offsetY = e.clientY - parseInt(element.style.top);
            document.addEventListener('mousemove', moveElement);
            document.addEventListener('mouseup', stopMoving);
        });

        // 处理触摸开始事件
        header.addEventListener('touchstart', function (e) {
            const touch = e.touches[0];
            offsetX = touch.clientX - parseInt(element.style.left);
            offsetY = touch.clientY - parseInt(element.style.top);
            document.addEventListener('touchmove', moveElement);
            document.addEventListener('touchend', stopMoving);
        });

        function moveElement(e) {
            if (e.type === 'mousemove') {
                element.style.left = (e.clientX - offsetX) + 'px';
                element.style.top = (e.clientY - offsetY) + 'px';
            } else if (e.type === 'touchmove') {
                const touch = e.touches[0];
                element.style.left = (touch.clientX - offsetX) + 'px';
                element.style.top = (touch.clientY - offsetY) + 'px';
            }
        }

        function stopMoving() {
            document.removeEventListener('mousemove', moveElement);
            document.removeEventListener('mouseup', stopMoving);
            document.removeEventListener('touchmove', moveElement);
            document.removeEventListener('touchend', stopMoving);
        }
    }
    /**初始化添加界面，将添加界面添加到网页 */
    function initializeAddingPopup() {
        if (document.getElementById('addingPopup')) return;
        const addingPopup = document.createElement('div');
        addingPopup.id = "addingPopup";
        addingPopup.style.cssText = popupCommonStyle;

        const addPopupTabButtons = document.createElement('span');
        addPopupTabButtons.id = 'addPopupTabButtons';
        addPopupTabButtons.style.cssText = "user-select: none; cursor: move; color: #333; font-size: 16px; display: flex; flex-direction: row; justify-content: space-around; alignItems: bottom; height: 20%; width: 100%; border-top-left-radius: 10px; border-top-right-radius: 10px; border: none;";

        function checkHasOwnProperty(isBlocked, chooseUrl, updatedKey) {
            const storage = chooseStorage(isBlocked, chooseUrl);
            return storage.hasOwnProperty(updatedKey);
        }

        function updateAddButton(hasKey) {
            if (hasKey) {
                addButton.textContent = '删除';
                addButton.style.backgroundColor = '#f56565';
            } else {
                addButton.textContent = '添加';
                addButton.style.backgroundColor = '#4CAF50';
            }
        }

        function updateaddPopupTabButtons(chooseUrl) {
            addUrlTabButton.choose = chooseUrl;

            if (chooseUrl) {
                urlOrTitleTextarea.value = matchedUrl;
                addUrlTabButton.style.backgroundColor = '#999999';
                addTitleTabButton.style.backgroundColor = '#e0e0e0';
            } else {
                urlOrTitleTextarea.value = matchedTitle;
                addUrlTabButton.style.backgroundColor = '#e0e0e0';
                addTitleTabButton.style.backgroundColor = '#999999';
            }

        }



        const addUrlTabButton = document.createElement('button');
        addUrlTabButton.id = 'addUrlTabButton';
        addUrlTabButton.textContent = '添加网址';
        addUrlTabButton.choose = true;
        addUrlTabButton.style.cssText = tabButtonCommonStyle;
        addUrlTabButton.style.backgroundColor = ' #999999';
        addUrlTabButton.addEventListener('click', function () {
            updateaddPopupTabButtons(true);
            const hasKey = checkHasOwnProperty(blockCheckbox.checked, addUrlTabButton.choose, urlOrTitleTextarea.value);
            updateAddButton(hasKey);
        });

        const addTitleTabButton = document.createElement('button');
        addTitleTabButton.id = 'addTitleTabButton';
        addTitleTabButton.textContent = '添加标题';
        addTitleTabButton.choose = false;
        addTitleTabButton.style.cssText = tabButtonCommonStyle;
        addTitleTabButton.style.backgroundColor = ' #e0e0e0';

        addTitleTabButton.addEventListener('click', function () {
            updateaddPopupTabButtons(false);
            const hasKey = checkHasOwnProperty(blockCheckbox.checked, addUrlTabButton.choose, urlOrTitleTextarea.value);
            updateAddButton(hasKey);
        });

        addPopupTabButtons.appendChild(addUrlTabButton);
        addPopupTabButtons.appendChild(addTitleTabButton);

        const urlOrTitleTextarea = document.createElement('input');

        urlOrTitleTextarea.value = matchedUrl;
        urlOrTitleTextarea.style.cssText = textareaCommonStyle
        urlOrTitleTextarea.addEventListener('input', function (e) {
            updateAddButton(checkHasOwnProperty(blockCheckbox.checked, addUrlTabButton.choose, urlOrTitleTextarea.value));
        });
        urlOrTitleTextarea.addEventListener('focus', function (e) {
            updateAddButton(checkHasOwnProperty(blockCheckbox.checked, addUrlTabButton.choose, urlOrTitleTextarea.value));
        });


        const checkboxsContainer = document.createElement('span');
        checkboxsContainer.style.cssText = 'display: flex; justify-content: space-around; width: 100%; align-items: center; margin-bottom: 10px;';

        const blockCheckboxContainer = document.createElement('span');
        blockCheckboxContainer.style.cssText = checkboxContainerCommonStyle
        const blockCheckboxLable = document.createElement('label');
        blockCheckboxLable.textContent = '拦截';
        // blockCheckboxLable.style.color = '#666'

        const blockCheckbox = document.createElement('input');
        blockCheckbox.type = 'checkbox';
        blockCheckbox.checked = true; // 默认选中
        blockCheckbox.style.cssText = checkboxCommonStyle + 'background-color: #0092EE;'
        blockCheckbox.addEventListener('click', function () {
            highlightCheckbox.checked = false;
            highlightCheckbox.style.backgroundColor = '#fff';
            blockCheckbox.style.backgroundColor = '#0092EE';
            updateAddButton(checkHasOwnProperty(blockCheckbox.checked, addUrlTabButton.choose, urlOrTitleTextarea.value));
        })
        blockCheckboxContainer.appendChild(blockCheckboxLable);
        blockCheckboxContainer.appendChild(blockCheckbox);

        const highlightCheckboxContainer = document.createElement('span');
        highlightCheckboxContainer.style.cssText = checkboxContainerCommonStyle

        const highlightCheckboxLable = document.createElement('label');
        highlightCheckboxLable.textContent = '高亮';
        // highlightCheckboxLable.style.color = '#666'

        const highlightCheckbox = document.createElement('input');
        highlightCheckbox.type = 'checkbox';
        highlightCheckbox.checked = false; // 默认不选中
        highlightCheckbox.style.cssText = checkboxCommonStyle + 'background-color: #fff;';
        highlightCheckbox.addEventListener('click', function () {
            blockCheckbox.checked = false;
            blockCheckbox.style.backgroundColor = '#fff';
            highlightCheckbox.style.backgroundColor = '#0092EE';
            updateAddButton(checkHasOwnProperty(blockCheckbox.checked, addUrlTabButton.choose, urlOrTitleTextarea.value));
        })
        highlightCheckboxContainer.appendChild(highlightCheckboxLable);
        highlightCheckboxContainer.appendChild(highlightCheckbox);

        checkboxsContainer.appendChild(blockCheckboxContainer);
        checkboxsContainer.appendChild(highlightCheckboxContainer);

        const addButton = document.createElement('button');
        addButton.textContent = '添加';
        addButton.style.cssText = buttonCommonStyle;
        addButton.style.backgroundColor = "#4CAF50";
        addButton.addEventListener('click', function () {
            let updatedKey = null;
            let updatedValue = null;

            // 判断是输入的Url还Title
            updatedKey = urlOrTitleTextarea.value;
            // 设置输入的Url或Title的为Key
            const chooseUrl = addUrlTabButton.choose;
            // 设置更新的值 URL 和标题
            if (chooseUrl) {
                updatedValue = matchedTitle;
            } else {
                updatedValue = matchedUrl;
            }
            updateStorage(updatedKey, updatedValue)
            function updateStorage(updatedKey, updatedValue) {
                // 判断是保存还是删除
                const action = addButton.textContent;
                const isBlocked = blockCheckbox.checked;
                const storage = chooseStorage(isBlocked, chooseUrl);
                const storageKey = chooseStorageKey(isBlocked, chooseUrl);
                if (action === '添加') {
                    storage[updatedKey] = updatedValue;
                } else {
                    delete storage[updatedKey];
                }
                GM_setValue(storageKey, storage);
                console.log('GM_setValue(storageKey, storage);', (storageKey, storage))
            }

            customRemoveChild(addingPopup);
            runWithoutObserver(applySettingsData);
        });
        function chooseStorageKey(isBlocked, chooseUrl) {
            // 根据是否被阻止和保存或删除操作，选择操作对象
            return isBlocked ? (chooseUrl ? 'urlsToBlock' : 'titlesToBlock') : (chooseUrl ? 'urlsToHighlight' : 'titlesToHighLight');
        }
        function chooseStorage(isBlocked, chooseUrl) {
            const storage = GM_getValue(chooseStorageKey(isBlocked, chooseUrl), {});
            return storage;
        }
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.cssText = buttonCommonStyle;
        cancelButton.style.backgroundColor = "#c3c3c3";
        cancelButton.addEventListener('click', function () {
            customRemoveChild(addingPopup);
        });
        const buttonsContainer = document.createElement('span');
        buttonsContainer.style.cssText = buttonsContainerCommonStyle

        buttonsContainer.appendChild(cancelButton);
        buttonsContainer.appendChild(addButton);
        addingPopup.appendChild(addPopupTabButtons);
        addingPopup.appendChild(urlOrTitleTextarea);
        addingPopup.appendChild(checkboxsContainer); // 添加开关元素
        addingPopup.appendChild(buttonsContainer);

        customAppendChild(addingPopup);


        makeDraggable(addingPopup, addPopupTabButtons);

        updateAddButton(checkHasOwnProperty(blockCheckbox.checked, addUrlTabButton.choose, urlOrTitleTextarea.value));
    }
    /**初始设置界面，将设置界面添加到网页 */
    function initializeSettingPopup() {
        if (document.getElementById('settingPopup')) return;
        let settingPopup = document.createElement('div');
        settingPopup.id = 'settingPopup';
        settingPopup.style.cssText = popupCommonStyle;

        const settingPopupTabButton = document.createElement('button');
        settingPopupTabButton.id = 'settingPopupTabButton';
        settingPopupTabButton.textContent = '参数设置';
        settingPopupTabButton.style.cssText = tabButtonCommonStyle;
        settingPopupTabButton.style.cursor = 'move';
        settingPopupTabButton.style.backgroundColor = " #c3c3c3";

        let searchEngineUrlInput = document.createElement('input');
        searchEngineUrlInput.id = 'searchEngineUrl'
        searchEngineUrlInput.placeholder = "搜索引擎网址";
        searchEngineUrlInput.value = matchedUrl;
        searchEngineUrlInput.rows = 2;
        searchEngineUrlInput.cols = 50;
        searchEngineUrlInput.style.cssText = textareaCommonStyle
        // searchEngineUrlInput.style.backgroundColor = " #c3c3c3";

        let settingValueInputContainer = document.createElement('span');
        settingValueInputContainer.style.cssText = "justify-content: space-between; align-items: center; width: 100%; margin-bottom: 10px; display: flex; justify-content: space-between;";
        settingValueInputContainer.innerHTML =
            `<span style="display: flex; flex-direction: row; align-items: center"><label title = '设置隐藏/高亮元素是当前找到的最小公共元素再往上找几级父元素。因为有时候根据链接找到的最小公共父元素不一定能很好地实现隐藏/高亮，所以需要继续找更高级别的父元素。
            1.没有配置的网页“父元素级别上限”默认值为 -1
            2.在“父元素级别上限”小于 0 时，不进行元素隐藏/高亮
            3.在“父元素级别上限”为 0 时，只隐藏a元素，不寻找最小公共父元素' style="margin-right: 5px; ">父元素级别上限</label><input id="maxFatherLevel" type="text" value = "${getMaxFatherLevel()}" style="font-weight: bold; padding:5px; width:20%; border-radius: 6px; border: 1px solid #D1D5DB; background-color: #cccccc; ${commonStyles}"/></span>` +

            `<span  style="display: flex; flex-direction: row; align-items: center"><label title = '设置隐藏的这个元素的子元素的数量最多为多少，这个主要配合“父元素级别上限”这个参数。用于处理在一个页面当中不同的搜索结果它具有不一样的层级，这时候可以提高“父元素级别上限”这个参数，同时调节该参数。
            例如，现在有 10 个搜索结果，第 1 个搜索结果的链接较深，需要“父元素级别上限”设置为 2，但其他搜索结果只需要 1。如果单纯将“父元素级别上限”调节为 2，就会将所有结果都隐藏，这时候就可以将“父元素级别上限”设置为 2，然后将“子元素数量上限”设置为小于 10 的数。这样就算“父元素级别上限”用 2，也会因为不符合“子元素数量上限”小于 10 而让其他搜索结果只隐藏 1 级父元素。
            1.没有配置的网页“子元素数量上限”默认值为 -1
            2.在“子元素数量上限”小于 0 时，表示不限制子元素数量。' style="margin-right: 5px; ">子元素数量上限</label><input id="maxChildrenNum" type="text" value="${getMaxChildrenNum()}" style="font-weight: bold; padding:5px;width:20%; border-radius: 6px; border: 1px solid #D1D5DB; background-color: #cccccc; ${commonStyles}"/></span>`;

        let buttonShowCheckboxContainer = document.createElement('span');
        buttonShowCheckboxContainer.style.cssText = checkboxContainerCommonStyle
        buttonShowCheckboxContainer.innerHTML =
            '<label style="margin-right: 10px; ">显示按钮</label>' +
            `<input id="buttonshowCheckbox" type="checkbox" style="${checkboxCommonStyle} background-color: #fff;"/>`
        const buttonshowCheckbox = buttonShowCheckboxContainer.querySelector('#buttonshowCheckbox');
        buttonshowCheckbox.checked = GM_getValue("buttonShow");
        if (buttonshowCheckbox.checked) {
            buttonshowCheckbox.style.backgroundColor = '#0092EE';
        }
        buttonshowCheckbox.addEventListener('click', function (event) {
            if (buttonshowCheckbox.checked) {
                buttonshowCheckbox.style.backgroundColor = '#0092EE';
            } else {
                buttonshowCheckbox.style.backgroundColor = '#fff';
            }
        });
        let buttonsContainer = document.createElement('span');
        buttonsContainer.style.cssText = buttonsContainerCommonStyle
        buttonsContainer.innerHTML =
            `<button id="cancelSaveSettings" style="${buttonCommonStyle} background-color: #C3C3C3;">取消</button>` +
            `<button id="testSettings" style="${buttonCommonStyle} background-color: #D75959;">测试</button>` +
            `<button id="saveSettings" style="${buttonCommonStyle} background-color: #4CAF50;">保存</button>`;
        settingPopup.appendChild(settingPopupTabButton);
        settingPopup.appendChild(searchEngineUrlInput);
        settingPopup.appendChild(settingValueInputContainer);
        settingPopup.appendChild(buttonShowCheckboxContainer);
        settingPopup.appendChild(buttonsContainer);

        customAppendChild(settingPopup);
        document.getElementById('cancelSaveSettings').addEventListener('click', function (e) {
            customRemoveChild(settingPopup);
        });
        document.getElementById('testSettings').addEventListener('click', function () { saveSettingsData(); runWithoutObserver(startProcess) });
        document.getElementById('saveSettings').addEventListener('click', function () { saveSettingsData(); runWithoutObserver(startProcess); customRemoveChild(settingPopup); });

        makeDraggable(settingPopup, settingPopupTabButton);
    }
    // 保存设置参数
    function saveSettingsData() {
        const isShow = document.getElementById('buttonshowCheckbox').checked;
        GM_setValue('buttonShow', isShow);

        const searchEngineUrl = document.getElementById('searchEngineUrl').value;

        let elementsMaxChildrenNum = GM_getValue('elementsMaxChildrenNum', {});
        elementsMaxChildrenNum[searchEngineUrl] = document.getElementById('maxChildrenNum').value
        GM_setValue('elementsMaxChildrenNum', elementsMaxChildrenNum);

        let elementsMaxFatherLevel = GM_getValue('elementsMaxFatherLevel', {});
        elementsMaxFatherLevel[searchEngineUrl] = document.getElementById('maxFatherLevel').value
        GM_setValue('elementsMaxFatherLevel', elementsMaxFatherLevel);
    }

    /**重新应用设置参数 */
    function applySettingsData() {
        const buttons = document.querySelectorAll('.insertedButton');

        // 查找前面可以设置style的元素，防止因为网页结构所导致前面出现一个text类型，无法设置style导致的错误
        function getStyleablePreviousSibling(insertedButton) {
            // 确保 insertedButton 是一个 DOM 元素
            if (insertedButton instanceof HTMLElement) {
                // 获取前一个兄弟节点
                let buttonPreviousSibling = insertedButton.previousSibling;
                // 检查前一个兄弟节点是否存在
                if (buttonPreviousSibling) {
                    while (buttonPreviousSibling.nodeType !== Node.ELEMENT_NODE) {//检查前一个兄弟节点是否是元素节点，如果不满足条件，继续查找
                        buttonPreviousSibling = buttonPreviousSibling.previousSibling
                    }
                    return buttonPreviousSibling;
                } else console.error('无法找到兄弟节点！')
            }
        }
        // 遍历这些元素并删除
        buttons.forEach(function (insertedButton) {
            getStyleablePreviousSibling(insertedButton).style.display = 'block'; // 显示元素
            insertedButton.parentNode.removeChild(insertedButton);

        });
        // 去除背景
        for (const parent of highlightedParents) {
            // 删除parent 元素的 highlight 类
            parent.classList.remove('highlight');
            function removeHighlightClass(node) {
                if (node.nodeType === 1) { // 只处理元素节点，nodeType为1表示元素节点
                    if (node.tagName !== 'IMG') { // 如果是img类型的节点
                        node.classList.remove('highlight');
                    }
                    // 继续遍历当前节点的子节点
                    Array.from(node.children).forEach(child => {
                        removeHighlightClass(child);
                    });
                }
            }
            removeHighlightClass(parent)
        }


        // 重置高亮和屏蔽
        insertedParents = new Set();
        highlightedParents = new Set();
        runWithoutObserver(startProcess);
    }

    /**注册油猴脚本菜单，用于添加currentTabUrl到searchEngines */
    function registerSearchEngineMenu() {
        console.log('registerSearchEngineMenu');
        // 获取存储的搜索引擎列表
        const searchEngines = GM_getValue('searchEngines') || [];
        // 检查当前网址是否已在搜索引擎列表中
        const matchedUrlIsSearchEngine = searchEngines.includes(matchedUrl);
        // 注册菜单命令及设置初始文本
        let menuCommandText = matchedUrlIsSearchEngine ? `排除${matchedUrl}到搜索引擎` : `添加${matchedUrl}为搜索引擎`;
        const menuCommandId = GM_registerMenuCommand(menuCommandText, function () {
            if (matchedUrlIsSearchEngine) {
                // 从searchEngines中移除matchedUrl
                searchEngines.splice(searchEngines.indexOf(matchedUrl), 1);
                console.log('排除成功！');
            } else {
                // 添加matchedUrl到searchEngines
                searchEngines.push(matchedUrl);
                console.log('添加成功！');
            }
            // 更新存储的搜索引擎列表
            GM_setValue('searchEngines', searchEngines);
            // 重新初始化配置栏（假设这里的函数实现了更新界面相关配置的功能）
            runWithoutObserver(initializeConfigBar);
            GM_unregisterMenuCommand(menuCommandId)
            // 重新注册菜单命令以更新菜单文本
            registerSearchEngineMenu();
        });
    }
    /**通过读取span来和mouse gesture脚本通信 */
    function receiveMsgFromMouseGesture() {
        let targetSpan = document.querySelector('span[id="send_to_website_manager"]')
        if (targetSpan) {
            console.log('receiveMsgFromMouseGesture', targetSpan, targetSpan.getAttribute('key'), targetSpan.getAttribute('value'))
            // 读取span的数据
            let type = targetSpan.getAttribute('type');
            let key = targetSpan.getAttribute('key');
            let value = targetSpan.getAttribute('value');

            if (type.includes('Text')) {
                // 读取原本的存储数据
                let titlesToBlockStorage = GM_getValue('titlesToBlock', {});
                let titlesToHighlightStorage = GM_getValue('titlesToHighLight', {});
                // 根据span的类型，更新对应的存储数据
                if (type === 'blockText') {
                    if (titlesToBlockStorage.hasOwnProperty(key)) {
                        delete titlesToBlockStorage[key]
                    } else {
                        titlesToBlockStorage[key] = value;
                        delete titlesToHighlightStorage[key]
                    }
                } else if (type === 'highlightText') {
                    if (titlesToHighlightStorage.hasOwnProperty(key)) {
                        delete titlesToHighlightStorage[key]
                    } else {
                        titlesToHighlightStorage[key] = value;
                        delete titlesToBlockStorage[key]
                    }
                }
                // 更新存储数据
                GM_setValue('titlesToBlock', titlesToBlockStorage);
                GM_setValue('titlesToHighLight', titlesToHighlightStorage);
            } else {
                // 读取原本的存储数据
                let urlsToBlockStorage = GM_getValue('urlsToBlock', {});
                let urlsToHighlightStorage = GM_getValue('urlsToHighlight', {});
                if (type === 'blockLink') {
                    if (urlsToBlockStorage.hasOwnProperty(key)) {
                        delete urlsToBlockStorage[key]
                    } else {
                        urlsToBlockStorage[key] = value;
                        delete urlsToHighlightStorage[key]
                    }
                } else if (type === 'highlightLink') {
                    console.log('urlsToHighlightStorage', urlsToHighlightStorage)
                    console.log('urlsToHighlightStorage.hasOwnProperty(key)', urlsToHighlightStorage.hasOwnProperty(key))
                    if (urlsToHighlightStorage.hasOwnProperty(key)) {
                        delete urlsToHighlightStorage[key]
                    } else {
                        urlsToHighlightStorage[key] = value;
                        delete urlsToBlockStorage[key]
                    }
                }
                // 更新存储数据
                GM_setValue('urlsToBlock', urlsToBlockStorage);
                GM_setValue('urlsToHighlight', urlsToHighlightStorage);
            }
            customRemoveChild(targetSpan);
            runWithoutObserver(applySettingsData)
        }
    }

    /**函数运行时屏蔽observer */
    function runWithoutObserver(func, ...args) {
        pauseMonitoring();
        func.apply(this, args); // 使用 apply 方法调用函数并传递参数
        resumeMonitoring();
        /**暂停监测 */
        function pauseMonitoring() {
            if (observer) {
                observer.disconnect();
                console.log('Mutation observer paused.');
            }
        }
        /**恢复监测 */
        function resumeMonitoring() {
            if (observer) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                console.log('Mutation observer resumed.');
            }
        }
    }
})();