
// ==UserScript==
// @name         screeps-chinese-pack
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  用于汉化 screeps.com 网站的油猴脚本
// @author       hopgoldy
// @match        https://screeps.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/416651/screeps-chinese-pack.user.js
// @updateURL https://update.greasyfork.org/scripts/416651/screeps-chinese-pack.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 要被翻译的语种
     *
     * 当 TranslationContent 中包含 selector 属性时，该设置将失效（因为翻译源由 selector 选择器指定了）
     */
    const TRANSLATE_FROM = 'en-US';
    /**
     * 要翻译到的语种
     */
    const TRANSLATE_TO = 'zh-CN';
    /**
     * 中文文档的域名
     */
    const DOCUMENT_CN = 'https://screeps-cn.gitee.io';

    /**
     * 判断一个节点是否为 HTMLElement
     *
     * @param el 要判断的节点
     */
    const isHTMLElement = function (el) {
        return el.nodeType === Node.ELEMENT_NODE;
    };
    /**
     * 判断一个节点是否为 Text
     *
     * @param el 要判断的节点
     */
    const isText = function (el) {
        return el.nodeType === Node.TEXT_NODE;
    };
    /**
     * 去除 hash 中的 query 字符串
     * @param hash 可能包含 query 的 hash
     */
    const getNoQueryHash = function (hash) {
        return hash.split('?')[0];
    };
    /**
     * 判断一个节点是否被禁止翻译
     *
     * 会顺着 dom 树一直往上找，遇到设置有 stopTranslateSearch 属性的祖先节点的话就禁止翻译
     *
     * @param el 要进行判断的节点
     * @returns 是否为被禁止翻译的节点
     */
    const isExceptElement = function (el) {
        if (el.stopTranslateSearch)
            return true;
        if (el.parentNode)
            return isExceptElement(el.parentNode);
        return false;
    };
    /**
     * 将一个 html 元素及其子元素设置为禁止翻译
     *
     * @param selector 禁止翻译的 css 选择器
     */
    const dontTranslate = function (selector) {
        return {
            'selector': selector,
            'zh-CN': (el) => el.stopTranslateSearch = true
        };
    };
    /**
     * 去掉字符串两端的空白字符
     *
     * @param str 要修剪的字符串
     */
    const trim = function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    };
    /**
     * 多行翻译
     *
     * 当一个 css 选择器会选中多个元素时，就可以使用该函数快速生成一个翻译源
     * 会根据传入的数据源的键值对进行翻译
     *
     * @param contents 多行翻译源
     */
    const translateMultiple = function (contents) {
        return (el) => {
            const newContent = contents[trim(el.innerHTML)];
            if (newContent)
                el.innerHTML = newContent;
        };
    };

    /**
     * 实际的存储对象
     *
     * 脚本执行时访问的翻译源都保存在这里
     */
    const currentPageContent = {
        hash: undefined,
        content: [],
        queryContent: []
    };
    /**
     * 当前使用的所有翻译数据来源
     * 可以通过 updateSource 指定和更新
     */
    let allPageContent = [];
    /**
     * HTML 元素内容缓存
     *
     * 会缓存上次翻译后的内容，如果下次获取元素发现没有变化就不会执行翻译
     */
    const contentCache = new Map();
    /**
     * 获取当前的翻译源文本
     *
     * @return 当前使用的翻译源 [ 普通翻译对象，包含选择器的翻译对象 ]
     */
    const getContent = function () {
        return currentPageContent;
    };
    /**
     * 更新翻译内容
     *
     * @param newContent 新的翻译内容
     */
    const updateContent = function (newContent) {
        // 遍历所有键尝试更新
        Object.keys(newContent).forEach(key => {
            // 如果没有值或者当前数据源不包含该键就不更新
            if (!newContent[key] || !(key in currentPageContent))
                return;
            currentPageContent[key] = newContent[key];
        });
    };
    /**
     * 尝试更新翻译源文本
     *
     * 会去检查 hash 是否匹配，当 hash 变更（切换到了新页面）时会重新从 allPageContent 里选择翻译源
     *
     * @param hash 要进行翻译源匹配的 hash 值
     * @param allSource 当前使用的所有翻译源
     * @returns 更新后的翻译源
     */
    const updateSource = function (hash, allSource) {
        if (allSource)
            allPageContent = allSource;
        const currentHash = getNoQueryHash(hash);
        // 没有变更就不进行搜索
        if (currentHash === currentPageContent.hash)
            return currentPageContent;
        const newContent = [];
        const newQueryContent = [];
        // 找到所有匹配的翻译源
        for (const page of allPageContent) {
            const matched = page.hashs.find(pageHash => {
                // 如果 hash 为空的话就精确匹配，不然太多了
                if (currentHash === '')
                    return currentHash === pageHash;
                // 有 hash 的话就进行首匹配
                if (pageHash !== '')
                    return currentHash.startsWith(pageHash);
                return false;
            });
            if (matched === undefined)
                continue;
            // 根据是否由 selector 分开存储
            page.content.forEach(content => {
                if (content.selector)
                    newQueryContent.push(content);
                else
                    newContent.push(content);
            });
        }
        // 更新当前存储
        currentPageContent.hash = currentHash;
        currentPageContent.content = newContent;
        currentPageContent.queryContent = newQueryContent;
        // 页面切换了，清空缓存
        contentCache.clear();
        return currentPageContent;
    };

    /**
     * 递归获取该元素下所有包含内容的 text 元素
     *
     * @param el 要进行查询的 html 节点
     * @return 包含内容的 text 元素数组
     */
    const getContentElement = function (el) {
        if (isHTMLElement(el)) {
            // 该元素被禁止翻译了就跳过
            if (el.stopTranslateSearch)
                return [];
            const contentElement = [];
            // 遍历所有子节点递归拿到内容节点
            for (let i = 0; i < el.childNodes.length; i += 1) {
                const children = el.childNodes[i];
                if (children.nodeType === Node.TEXT_NODE) {
                    // Text 节点中有很多只有换行符或者空格的，这里将其剔除掉
                    // 正则含义：包含除“换行”“回车”“空格”以外的其他字符
                    if (!/[^(\n|\r| )]/g.test(children.wholeText))
                        continue;
                    contentElement.push(children);
                }
                // 元素节点的话就递归继续获取（不会搜索 script 标签）
                else if (isHTMLElement(children) && children.nodeName !== 'SCRIPT') {
                    contentElement.push(...getContentElement(children));
                }
            }
            return contentElement;
        }
        // 如果是文本节点的话就直接返回
        if (isText(el))
            return [el];
        return [];
    };
    /**
     * 使用对应的翻译内容更新 html 元素
     *
     * @param el 要更新的元素
     * @param content 要更新的翻译内容
     */
    const updateElement = function (el, content) {
        const newContent = content[TRANSLATE_TO];
        if (typeof newContent === 'string')
            el.innerHTML = newContent;
        else if (typeof newContent === 'function')
            newContent(el);
        return el.innerHTML;
    };
    /**
     * 使用对应的翻译内容更新 html 元素
     *
     * @param el 要更新的元素
     * @param content 要更新的翻译内容
     *
     * @returns 翻译后的内容，若未翻译则为 undefined
     */
    const updateProtectElement = function (el, content) {
        const newContent = content[TRANSLATE_TO];
        // 是替身节点的话就不执行任何操作
        if (el.isStandNode)
            return '';
        el.style.display = 'none';
        // 创建替身并进行基础设置
        const newEl = el.cloneNode(true);
        newEl.style.display = null;
        newEl.isStandNode = true;
        // 翻译替身
        if (typeof newContent === 'string')
            newEl.innerHTML = newContent;
        else if (typeof newContent === 'function')
            newContent(newEl);
        // 更新替身
        if (el.standNode)
            el.parentElement.replaceChild(newEl, el.standNode);
        else
            el.parentElement.appendChild(newEl);
        el.standNode = newEl;
        // 由于某些节点可能会存在 class 变化的问题
        // （比如 map 界面中房间介绍的储量，会通过加入临时的 class 来实现 in-out 效果，但是这些临时 class 会一直在替身节点身上，导致样式有问题）
        // 所以这里开启一个监听，以保证替身节点的样式一致
        const observer = new MutationObserver(() => {
            el.standNode.className = el.className;
        });
        observer.observe(el, { attributes: true });
        // 受保护节点会一直返回翻译前的内容
        return el.innerHTML;
    };
    /**
     * 使用对应的翻译内容更新 text 元素
     *
     * @param el 要更新的文本节点
     * @param content 要更新的翻译内容
     */
    const updateText = function (el, content) {
        const newContent = content[TRANSLATE_TO];
        if (typeof newContent === 'string')
            el.parentElement.replaceChild(new Text(newContent), el);
        else if (typeof newContent === 'function') {
            const newText = newContent(el.wholeText);
            el.parentElement.replaceChild(new Text(newText), el);
        }
    };
    /**
     * 翻译所有带选择器的内容
     *
     * @param el 要翻译的 html 元素
     * @param allQueryContents 所有包含选择器的翻译项
     */
    const translateQueryContent = function (allQueryContents) {
        // 翻译所有有选择器的元素
        return allQueryContents.filter(content => {
            const targetElements = document.body.querySelectorAll(content.selector);
            if (targetElements.length === 0)
                return true;
            // 执行翻译
            targetElements.forEach((element, index) => {
                if (!isHTMLElement(element) || isExceptElement(element))
                    return;
                // 没有跳过检查的就从缓存里读出之前的内容进行检查
                if (!content.ingnoreRepeatedCheck) {
                    const cacheKey = content.selector + index;
                    // 如果元素的内容没有发生变更，就不执行更新
                    const preContent = contentCache.get(cacheKey);
                    if (preContent !== undefined && preContent === element.innerHTML)
                        return;
                    const newContent = content.protect ?
                        updateProtectElement(element, content) :
                        updateElement(element, content);
                    // 更新缓存
                    contentCache.set(cacheKey, newContent);
                    return;
                }
                // 不然就直接进行更新
                if (content.protect)
                    updateProtectElement(element, content);
                else
                    updateElement(element, content);
            });
            return content.reuse;
        });
    };
    /**
     * 翻译所有不带 css 选择器的内容
     *
     * 会遍历取出 el 下的待翻译文本（Text 对象），然后和翻译项进行文本对比，若对比完全匹配则进行翻译
     * **注意**，会自动移除待对比文本前后的空白字符
     *
     * @param el 要翻译的 html 元素
     * @param allContents 所有不带选择器的翻译内容
     */
    const translateNormalContent = function (el, allContents) {
        if (isExceptElement(el))
            return allContents;
        // 取出所有待翻译元素
        const needTranslateText = getContentElement(el);
        // 遍历所有节点进行翻译
        needTranslateText.forEach(text => {
            // 这个文本有可能在之前已经被翻译了（被从其父节点上剔除），所以这里不再进行无效翻译
            if (!text.parentElement)
                return;
            const originContent = text.wholeText;
            // 找到符合的翻译内容，并保存其索引
            let translationIndex;
            const currentTranslation = allContents.find((content, index) => {
                const matchContent = content[TRANSLATE_FROM];
                const targetContent = trim(originContent);
                // 使用字符串匹配
                if (typeof matchContent === 'string') {
                    if (matchContent !== targetContent)
                        return false;
                }
                // 不然就使用正则进行匹配
                else if (!matchContent.test(targetContent))
                    return false;
                translationIndex = index;
                return true;
            });
            // 没找到就下一个
            if (!currentTranslation) {
                // console.warn(`文本 ${originContent} 未翻译`)
                return;
            }
            // 更新文本，如果没指定重用的话就将其移除
            updateText(text, currentTranslation);
            if (!currentTranslation.reuse)
                allContents.splice(translationIndex, 1);
        });
        return allContents;
    };
    /**
     * 翻译指定节点
     *
     * 会使用当前数据源递归翻译其子元素
     * 该方法会修改 全局存储 currentPageContent 的内容（会将完成翻译的内容从 content 取出以提高性能，除非该 content 指定了 reuse）
     *
     * @param changedNode 发生变更的节点
     */
    const translate = function (changedNode) {
        const { content: allContents, queryContent: allQueryContents } = getContent();
        // 有选择器的内容每次变更只会被翻译一次
        const nextSearchdQueryContents = translateQueryContent(allQueryContents);
        updateContent({ queryContent: nextSearchdQueryContents });
        // 文本内容每个都会被执行翻译
        for (const node of changedNode) {
            const nextSearchContents = translateNormalContent(node, allContents);
            // 把没有使用或者启用了重用的翻译内容更新回数据源
            updateContent({ content: nextSearchContents });
        }
    };

    /**
     * 翻译的大致流程是：发现路由变化 > 重新加载翻译源，发现 html 元素变化 > 重新翻译内容
     *
     * 实现的方式有两种：
     * 1. 监听 onHashChange 事件，触发时加载翻译源，再用 MutationObserver 单独监听元素变化
     * 2. 使用 MutationObserver 监听元素变化，变化之前检查路由是否有变更，有的话重载翻译源
     *
     * 第一种方法无法保证先加载翻译源再重新翻译内容，就会出现翻译内容时还是用的之前的翻译源
     * 为了解决这个问题就需要再加载翻译源后再全量翻译一次，而这些翻译内容很多都是和 MutationObserver 里的翻译是重复的，造成了性能浪费，故弃用。
     * 下面则为第二种方法的实现。
     */
    /**
     * 设置该插件所需的回调
     *
     * @param callbacks 要触发的回调
     */
    function listener (callbacks) {
        const observer = new MutationObserver(getMutationCallback(callbacks));
        // 启动监听
        observer.observe(document.body, {
            childList: true,
            characterData: true,
            subtree: true
        });
        return observer;
    }
    /**
     * 包装回调
     *
     * MutationObserver 接受回调的入参不是单纯的 html 元素数组
     * 这里将其格式化后再执行业务回调
     *
     * @param callback 要触发的实际回调
     */
    const getMutationCallback = function ({ onHashChange, onElementChange }) {
        return function (mutationsList) {
            // 获取发生变更的节点
            const changedNodes = [].concat(...mutationsList.map(mutation => {
                if (isExceptElement(mutation.target))
                    return [];
                if (mutation.type === 'childList') {
                    if (mutation.addedNodes.length > 0)
                        return [...mutation.addedNodes];
                }
                // 是节点内容变更的话就直接返回变更的节点
                else if (mutation.type === 'characterData') {
                    return [mutation.target];
                }
                return [];
            }));
            // 如果没有发生变化的节点，就不需要翻译
            if (changedNodes.length <= 0)
                return;
            // 翻译前检查下 hash 有没有变
            const { hash } = getContent();
            const newHash = getNoQueryHash(document.location.hash);
            // hash 变了，重新加载翻译源然后再更新
            if (hash !== newHash) {
                onHashChange(document.location.hash);
                updateContent({ hash: newHash });
            }
            // 触发回调
            onElementChange(changedNodes);
        };
    };

    /**
     * 中间横排的信息一览
     */
    const OVERVIEW_HEADER = {
        'Control<br>points': '控制点数',
        'Energy<br>harvested': '能量采集',
        'Energy<br>on construct': '能量 - 建筑消耗',
        'Energy<br>on creeps': '能量 - 孵化消耗',
        'Creeps<br>produced': 'creep 孵化',
        'Creeps<br>lost': 'creep 损失',
        'Power<br>processed': 'power 处理'
    };
    /**
     * 图表右上角的下拉框选项
     */
    const GRAPH_SELECT_LIST = {
        'Power processed': 'power 处理',
        'Control points': '控制点数',
        'Energy harvested': '能量采集',
        'Energy spent on construction': '能量 - 建筑消耗',
        'Energy spent on creeps': '能量 - 孵化消耗',
        'Creeps produced': 'creep 孵化',
        'Creeps lost': 'creep 损失'
    };
    /**
     * 获取翻译总览数据统计
     */
    const getOverviewHeaderContent = function () {
        return {
            'selector': '.profile-stat-title',
            'zh-CN': translateMultiple(OVERVIEW_HEADER),
            'reuse': true
        };
    };
    const content = {
        hashs: ['#!/overview'],
        content: [
            { 'en-US': 'Overview', 'zh-CN': '总览' },
            { 'en-US': 'Global Control Level', 'zh-CN': '全局控制等级' },
            { 'en-US': 'Global Power Level', 'zh-CN': '全局超能等级' },
            { 'en-US': 'Manage Power Creeps', 'zh-CN': '管理 power creep' },
            { 'en-US': 'Stats Period', 'zh-CN': '统计时长', 'reuse': true },
            { 'en-US': /Graph(:|)/, 'zh-CN': '图表', 'reuse': true },
            { 'en-US': 'Owner:', 'zh-CN': '所有者:' },
            { 'en-US': 'View leaderboard', 'zh-CN': '查看排行榜', 'reuse': true },
            getOverviewHeaderContent(),
            // 翻译下拉框当前选中值
            {
                'selector': 'button > span.toggle-text.ng-scope > span',
                'zh-CN': translateMultiple(GRAPH_SELECT_LIST),
                'reuse': true
            },
            // 翻译下拉框选项
            {
                'selector': 'a.ng-binding.ng-scope',
                'zh-CN': translateMultiple(GRAPH_SELECT_LIST),
                'reuse': true
            },
            // 点开房间后的图表
            {
                'selector': 'div.graph-item label',
                'zh-CN': translateMultiple(GRAPH_SELECT_LIST),
                'reuse': true
            }
        ]
    };

    const content$1 = {
        hashs: ['#!/'],
        content: [
            // 阻止翻译右上角的 CPU 及内存使用量
            dontTranslate('.cpu > .sysbar-title > strong'),
            dontTranslate('.mem > div.sysbar-title > strong'),
            { 'en-US': 'Persistent world:', 'zh-CN': '永恒世界：', 'reuse': true },
            { 'en-US': 'Overview', 'zh-CN': '总览', 'reuse': true },
            { 'en-US': 'World', 'zh-CN': '世界', 'reuse': true },
            { 'en-US': 'Market', 'zh-CN': '市场', 'reuse': true },
            { 'en-US': 'Inventory', 'zh-CN': '库存', 'reuse': true },
            { 'en-US': 'Documentation', 'zh-CN': '文档', 'reuse': true },
            { 'en-US': 'Training', 'zh-CN': '练习', 'reuse': true },
            { 'en-US': 'Public Test Realm', 'zh-CN': '公共测试服务器', 'reuse': true },
            { 'en-US': 'Messages', 'zh-CN': '消息', 'reuse': true },
            { 'en-US': 'Report a problem', 'zh-CN': '问题上报', 'reuse': true },
            { 'en-US': 'Blog', 'zh-CN': '博客', 'reuse': true },
            { 'en-US': 'Forum', 'zh-CN': '论坛', 'reuse': true },
            { 'en-US': 'Terms of Service', 'zh-CN': '服务条款', 'reuse': true },
            { 'en-US': 'Privacy policy', 'zh-CN': '隐私政策', 'reuse': true },
            { 'en-US': 'Respawn', 'zh-CN': '重生', 'reuse': true },
            { 'en-US': 'View profile', 'zh-CN': '查看资料', 'reuse': true },
            { 'en-US': 'Manage account', 'zh-CN': '账户管理', 'reuse': true },
            { 'en-US': 'Sign out', 'zh-CN': '登出', 'reuse': true },
            { 'en-US': 'New update is available', 'zh-CN': '有可用的更新' },
            { 'en-US': 'RELOAD', 'zh-CN': '重新加载' },
            { 'en-US': 'Your CPU is limited', 'zh-CN': '您的 CPU 受限' },
            { 'en-US': 'Order a subscription here', 'zh-CN': '点此购买一个订阅 ' },
            // 登陆弹窗
            { 'en-US': 'Sign In', 'zh-CN': '登陆', 'reuse': true },
            { 'en-US': 'E-mail or username', 'zh-CN': '邮箱或用户名', 'reuse': true },
            { 'en-US': 'Password', 'zh-CN': '密码', 'reuse': true },
            { 'en-US': 'SIGN IN', 'zh-CN': '登陆', 'reuse': true },
            { 'en-US': 'OR', 'zh-CN': '或', 'reuse': true },
            { 'en-US': 'I forgot my password', 'zh-CN': '我忘记密码了', 'reuse': true },
            { 'en-US': 'Create a new account', 'zh-CN': '创建一个新账户', 'reuse': true },
            { 'en-US': 'Account credentials are invalid', 'zh-CN': '账号验证失败', 'reuse': true },
            // 右上角登陆按钮
            { 'en-US': 'Sign in', 'zh-CN': '登陆 ', 'reuse': true },
            { 'en-US': 'or register', 'zh-CN': '或注册', 'reuse': true },
            { 'en-US': 'Global Control Level has been increased!', 'zh-CN': '全局控制等级（GCL）已提升！' },
            { 'en-US': 'You can control', 'zh-CN': '您现在可以控制 ' },
            { 'en-US': /\d+ rooms/, 'zh-CN': (text) => text.replace('rooms', '个房间') },
            { 'en-US': 'now.', 'zh-CN': '了。' },
            // 阻止翻译左侧边栏头部的赛季服倒计时
            {
                'selector': 'app-time-left',
                /**
                 * 因为这个元素会因为未知原因销毁重建一次，导致单纯通过 dontTranslate 设置的禁止翻译被清掉了
                 * 所以这里加个延迟，等元素重建完成后再添加禁止翻译
                 */
                'zh-CN': () => setTimeout(() => {
                    const el = document.body.querySelector('app-time-left');
                    el.stopTranslateSearch = true;
                }, 1000)
            },
            // 重生确认框
            {
                'en-US': 'All your buildings and creeps will become unowned so that you\n        can reset your spawn in any vacant room on the map.',
                'zh-CN': '您将失去所有的建筑和 creep，然后您就可以在地图上的任意无主房间重新放置 spawn。',
                'reuse': true
            },
            { 'en-US': 'Learn more', 'zh-CN': '了解更多', 'reuse': true },
            { 'en-US': 'Note:', 'zh-CN': '注意：', 'reuse': true },
            {
                'en-US': 'you will NOT be able to spawn again in the same\n        room within 3 days since the initial spawn placement!',
                'zh-CN': '在放置第一个 spawn 之后的三天内，您将无法再次重生在相同房间中。',
                'reuse': true
            },
            { 'en-US': 'Cancel', 'zh-CN': '取消', 'reuse': true }
        ]
    };

    const content$2 = {
        hashs: ['#!/sim'],
        content: [
            { 'en-US': 'Simulation mode', 'zh-CN': '模拟模式' },
            {
                'en-US': 'In this mode your script runs not on the server, but locally on your machine, so that you can pause and debug it.',
                'zh-CN': '该模式下，您的代码将运行在本地机器而不是服务器上。因此，您可以暂停并对代码进行调试。'
            },
            { 'en-US': 'Tutorial', 'zh-CN': '教程', 'reuse': true },
            {
                'en-US': 'Learn basic game concepts step by step.',
                'zh-CN': '逐步了解游戏中的基本概念。'
            },
            { 'en-US': 'Training', 'zh-CN': '练习' },
            // 练习的文本介绍里有个换行，很气
            {
                'selector': 'div:nth-child(4) > a > section',
                'zh-CN': '在一个预定义布局的虚拟房间中实践您的代码。',
                'reuse': true
            },
            { 'en-US': 'Custom', 'zh-CN': '自定义' },
            {
                'en-US': 'Modify the landscape, create any objects, and test your scripts playing for two virtual players at once.',
                'zh-CN': '修改地形、创建任何对象并同时操控两个虚拟玩家来测试您的代码。'
            },
            {
                'en-US': 'Your script will be saved, but your simulation progress will be lost! Are you sure?',
                'zh-CN': '您的代码将会保存，但是您的模拟器进度将会丢失！确定要退出么？',
                'reuse': true
            },
            { 'en-US': 'Cancel', 'zh-CN': '取消', 'reuse': true },
            { 'en-US': 'OK', 'zh-CN': '确定', 'reuse': true }
        ]
    };

    const TIP_CONTENT = {
        'Inscreasing the <code>reusePath</code> option in the <code>Creep.moveTo</code> method helps saving CPU.': '提高 <code>Creep.moveTo</code> 方法中的 <code>reusePath</code> 参数有助于节省 CPU。',
        'Set up a grunt task to write scripts on your local machine and commit them to Screeps.': '设置一个 grunt（或者 rollup）任务来在本地编辑你的代码并将其提交到 Screep。',
        'Each game action has a constant cost of 0.2 CPU.': '每个会影响游戏世界的动作都有 0.2 CPU 的固定成本。',
        'Towers can aim at any object in a room even through walls and obstacles.': 'tower 可以透过墙壁和障碍物瞄准同房间中的任何对象。',
        'Power banks appear only in neutral rooms that divide living sectors on the map.': 'power bank 仅出现在过道房间中，过道房是指分隔不同区块的空旷中立房间。',
        'Modular architecture of a script will allow easy testing of individual functions in the simulator.': '脚本的模块化架构使得你可以在模拟器中轻松测试单个函数。',
        'Test various game scenarios in the simulator in order to be prepared for surprises.': '在模拟器中测试各种游戏场景，以应对随时可能发生的意外。',
        'Sources in neutral rooms have reduced capacity. Reserve or claim the room to restore it to full capacity.': '中立房间矿的能量矿（Source）上限只有1500。预订（reserve）或占领（claim）房间可以使其恢复到最大容量。',
        'To save your CPU, use less creeps of a larger size.': '生成数量更少、身体部件更多的 creep 来节省你的 CPU。',
        'Spawn extensions capacity increases on room levels 7 and 8.': 'RCL7 和 RCL8 将提升 extension 的容量。',
        'Use towers to set up automatic defense of your room.': '使用 tower 来建立你房间的自动防御。',
        'If CPU limit raises, your script will execute only partially.': '如果运算量超过 CPU 限制，未执行的脚本将会被强行终止。',
        'Walking over swamps is 5 times slower compared to plain land.': '在沼泽上行走比平原慢 5 倍。',
        'Use loop architecture to save CPU on the logic you do not have to run each tick.': '可以把不需要每个 tick 都运行的逻辑放在 loop 之外执行。',
        'A tower’s effectiveness depends on the distance to the target.': 'tower 的工作效率取决于该 tower 到目标的距离。',
        'You can create any objects in the simulator to test your script.': '你可以在模拟器中创建任何对象来测试脚本。',
        'Unless you use up your CPU limit each tick, it is stored for future use.': '除非你每 tick 都用光了你的 CPU，不然没有用掉的部分会被存起来以备后续使用。',
        'Your CPU Limit depends on your Global Control Level.': '你的 CPU 上线取决于您的全局控制级别（GCL）。',
        'You can use more CPU than your CPU limit allows in short bursts.': '你的 CPU 使用量可以在短时间内使用超过你的 CPU 上限。（“短时间”取决于 cpu 桶中的余额）',
        'Energy in a storage can not be used to spawn creeps. Transfer it to a spawn or extensions instead.': 'storage 里储存的能量不能直接用来孵化 creep，要先将能量转移到一个 spawn 或 extension 中。',
        'The more body parts of one type a creep has, the greater its productivity.': '一个 creep 的身体部件越多，其效率也就越高。',
        'More spawns in a room allows building more creeps at a time.': '一个房间中存在的 spawn 越多，能同时孵化的 creep 也就越多。',
        'The more spawn extensions in a room, the more energy you can spend on building one creep.': '一个房间中的 spawn 和 extension 越多，可以用来孵化单个 creep 的能量也就越多。',
        'You can address from your script only those rooms that contain your creeps or structures.': '只有房间中存在你的 creep 或者建筑时，你的代码才可以访问到它。',
        'Ramparts can be built not just on empty squares but on existing structures too.': 'Rampart 不仅可以在空旷的地块上建造，还可以建造在已有的建筑上。',
        'Ramparts and walls initially have 1 hit point. Repair them after construction.': 'rampart 和 wall 最初仅有 1 点生命值（hit），记得在建筑好后及时进行维修（repair）。',
        'It is too costly and senseless to maintain an army of military creeps in the peacetime.': '在和平时期维持一支由战斗 creep 组成的军队代价太高且毫无意义。',
        'Links can pass energy to other links at any point inside the same room.': 'link 可以将能量传递到同一房间内任何位置的其他 link。',
        'A good way to save CPU is caching often-used paths.': '缓存常用路径是节省 CPU 的好方法。',
        'While not destroyed, a rampart protects a creep or building on its square from any type of attack.': '只要一个 rampart 没有被摧毁，它就可以保护同地块上的 creep 或者建筑免受任何形式的攻击。',
        'The game is fully recorded, so you can see replay of any room for the past several days.': '游戏已经被完整录制，所以你可以随时回放过去几天发生的事情。',
        'The more small objects in the Memory, the more CPU spent on its parsing.': 'Memory 中的对象越简单，解析它所花费的 CPU 也就越少。',
        'Use try/catch blocks in right places to avoid a complete halt of your script due to errors.': '在适当的位置使用 try/catch 代码块，以避免由异常导致的脚本崩溃。',
        'Respawning in a chosen room would automatically destroy all structures except walls and roads.': '在选定的房间重生会自动摧毁房间内除墙和道路以外的所有建筑。',
        'Creeps can miss each other if they walk towards each other simultaneously or follow step by step.': '两个相邻的 creep 可以无视彼此的存在进行面对面移动或者紧随移动。',
        'If you want to play from scratch, you can always Respawn in a new room.': '如果你想从头开始玩，你可以随时在一个新房间里重生。',
        'You can output HTML content to the console, like links to rooms.': '你可以将 HTML 内容输出到控制台，例如一个跳转到指定房间的超链接。',
        'You can have as many rooms under your control as your Global Control Level.': '你可以控制的房间数与全局控制等级（GCL）一样多。',
        'You can apply <code>transfer</code> and <code>heal</code> to another player’s creep, and <code>transfer,</code> <code>build</code> and <code>repair</code> to others’ structures.': '你可以 <code>transfer</code> 和 <code>heal</code> 另一个玩家的 creep，以及 <code>transfer</code>，<code>build</code> 和 <code>repair</code> 其他玩家的建筑。',
        '<code>require</code> spends CPU depending on the size and complexity of the module loaded.': '<code>require</code> 所花费的 CPU 取决于要加载模块的大小及复杂度。',
        'Spawn extensions do not have to be placed near spawns, their range is the whole room.': 'extension 不用放在 spawn 的边上，它们的有效范围是整个房间。',
        'You can speed up downgrading of hostile room controller by using <code>Creep.attackController</code> on it.': '你可以通过使用 <code>Creep.attackController</code> 方法来加速敌对房间控制器的降级。',
        'To output an object content into the console, use <code>JSON.stringify</code>.': '要将对象内容输出到控制台，请使用 <code>JSON.stringify</code>。',
        'Build roads to save on <code>MOVE</code> body parts of your creeps.': '建造道路可以让你的 creep 使用更少的 <code>MOVE</code> 部件。',
        'Always try to control as many rooms as your GCL allows. It will allow your colony to develop at the maximum speed.': '始终尝试控制 GCL 所允许的房间数量，这将可以使你的殖民地以最大的速率发展。',
        'A resource abandoned on the ground eventually vanishes.': '丢弃在地面上的资源最终将会消失。',
        'A creep can execute some commands simultaneously in one tick, for example <code>move</code>+<code>build</code>+<code>dropEnergy</code>.': '一个 creep 可以在同 tick 内同时执行多个不冲突命令，例如 <code>move</code>+<code>build</code>+<code>dropEnergy</code>。',
        'Walls, roads, and containers don’t belong to any player, so they should be searched with the help of <code>FIND_STRUCTURES</code>, not <code>FIND_MY_STRUCTURES</code>.': 'wall，road 和 container 不属于任何玩家，所以搜索它们需要使用 <code>FIND_STRUCTURES</code> 而不是 <code>FIND_MY_STRUCTURES</code> 常量。',
        'The <code>RANGED_ATTACK</code> body part is 3 times weaker than <code>ATTACK</code> and 2 times costlier at that.': '<code>RANGED_ATTACK</code> 身体部件的相对伤害是 <code>ATTACK</code> 部件的 1/3，但是其造价却是 <code>ATTACK</code> 的两倍。',
        'Use <code>Room.energyAvailable</code> and <code>Room.energyCapacityAvailable</code> to determine how much energy all the spawns and extensions in the room contain.': '使用 <code>Room.energyAvailable</code> 和 <code>Room.energyCapacityAvailable</code> 来确定房间中所有 spawn 和 extensions 包含多少能量及能量上限是多少。',
        'Observers allow to get the <code>Room</code> object for the rooms that have no objects of yours.': 'Observer 允许获取那些没有你单位存在的 <code>Room</code> 对象。',
        'To control a room continuously, you need to upgrade your controller from time to time.': '想要持续控制一个房间，你需要经常的升级（upgrade）你的房间控制器（controller）。',
        'The <code>Game.notify</code> function automatically groups identical messages using the specified interval.': '<code>Game.notify</code> 方法将把信息按照指定的时间间隔分组并发送。',
        'Dead body parts have weight and generate fatigue as well.': '一个坏掉的身体部件也会产生疲劳。',
        'Use branches to test and debug your temporary code and also do backups.': '使用分支（branch）来测试和调试您的临时代码，并记得时刻进行备份。',
        'There is a keyword <code>debugger</code> in the simulator that stops your script in the browser.': '模拟器中有一个关键字 <code>debugger</code>，可以用于在浏览器中暂停脚本。',
        'Roads wear out as they are used, so don’t forget to repair them.': '道路（road）在使用中会逐渐磨损，因此请不要忘记对其进行修复（repair）。',
        'You can build and repair roads and containers in any rooms, even neutral ones.': '你可以在任何房间，哪怕是是中立房间中建造和维修 road 和 container。',
        'To prevent other players from seizing a neutral room you want, use <code>Creep.reserveController</code>.': '使用 <code>Creep.reserveController</code> 可以防止其他玩家占领你想要的中立房间。',
        'Creeps cannot move faster than 1 square per tick.': 'creep 的速度上限是 1 格/秒',
        'Send emails to yourself with the function <code>Game.notify</code> to be aware of everything happening in the game.': '使用 <code>Game.notify</code> 方法向自己发送 email 来了解游戏中发生的一切。',
        'The <code>console.log</code> function of the simulator displays a live expandable object in the browser console.': '<code>console.log</code> 方法（在模拟器中）将在浏览器的控制台中同步显示可展开的 object 对象。',
        'Every creep dies after 1500 ticks, however you can prolong its life using the <code>Spawn.renewCreep</code> method.': '每个 creep 都会在 1500 tick 后死亡，然而你通过对其调用 <code>Spawn.renewCreep</code> 方法来延长它们的生命。',
        'The creep memory is saved upon death, so clear <code>Memory.creeps.*</code> to prevent overflowing.': 'creep 死亡后其内存依旧存在，所以请清除 <code>Memory.creeps.*</code> 以避免内存溢出。',
        'A creep with an <code>ATTACK</code> part automatically strikes back at every attacker by <code>ATTACK</code>.': '一个带有 <code>ATTACK</code> 身体部件的 creep 将会对敌方 <code>ATTACK</code> 进行自动反击。',
        'A spawn automatically replenishes itself with power until the energy in the room reaches 300 units.': '当房间中用于孵化的能量小于 300 时，spawn 将会自动开始恢复能量，直到其能量等于 300 点。',
        'Leaderboards reset to zero each month, while your game process continues.': '排行榜每个月都会进行重置，你的游戏进度并不会受到影响。',
        'Use links to save on creep building and CPU.': '使用 link 来节省要孵化的 creep 以及 CPU',
        'Use storage to not lose surplus of mined resources.': '使用 storage 来存储开采出来的过量资源。'
    };
    const tips = [
        { 'en-US': 'Do you want to turn off tips of the day?', 'zh-CN': '你想要关闭每日 TIP 么？', 'reuse': true },
        { 'en-US': 'Tip of the day:', 'zh-CN': '每日 TIP：' },
        { 'en-US': 'Don\'t show tips', 'zh-CN': '不再显示' },
        { 'en-US': 'Next tip', 'zh-CN': '下个 tip' },
        {
            'selector': '.tutorial-content > section > p > span',
            'zh-CN': translateMultiple(TIP_CONTENT),
            'reuse': true
        },
        {
            // 后面这个奇葩的"3个房间"是因为在 sidebar 中会有一个 /\d+ rooms/ 正则先将其翻译为中文，所以这里需要调整一下
            'en-US': /You cannot have more than 3 (rooms|个房间) in the Novice Area./,
            'zh-CN': '在新手区（Novice Area）中你最多可以控制 3 个房间。',
            'reuse': true
        }
    ];
    /**
     * 添加每日提示
     * 因为每日提示内容较多，并且不是每次都能看到，所以这里做成动态引入以提高性能
     */
    const getTips = function () {
        const tipTipOfTheDay = localStorage.getItem('tipTipOfTheDay');
        // 已经禁用了每日提示
        if (Number(tipTipOfTheDay) === -1)
            return [];
        // 如果还没看过每日提示，或者提示显示日期已经过了一天了，就添加每日提示内容
        if (!tipTipOfTheDay || Number(tipTipOfTheDay) + (24 * 60 * 60 * 1000) < new Date().getTime()) {
            return tips;
        }
        return [];
    };

    const CONSTRUCT_NOTICE = {
        'Choose location': '选择位置',
        'Place your spawn': '放置您的 Spawn'
    };
    const TOOLTIP_LABEL = {
        'World': '世界',
        'Room overview': '房间总览',
        'Replay room history': '回放房间录像',
        'View / Pan': '查看 / 拖动',
        'Create Flag': '创建旗帜',
        'Construct': '建筑',
        'Customize': '自定义房间设置',
        'Pause&nbsp;tracking': '停止追踪',
        'Clear': '清空日志',
        'Main&nbsp;memory': '主内存',
        'Segments': '分段内存',
        'Hide side panel': '隐藏侧边栏',
        'Display options': '显示设置',
        'Place spawn': '放置 spawn'
    };
    const content$3 = {
        hashs: ['#!/room', '#!/sim/custom', '#!/sim/survival', '#!/sim/tutorial/', '#!/history'],
        content: [
            // 禁止翻译代码、控制台、内存字段
            dontTranslate('.ace_editor'),
            dontTranslate('.console-messages-list'),
            dontTranslate('.memory-content'),
            dontTranslate('.memory-segment-content'),
            dontTranslate('form.console-input'),
            {
                'selector': 'div.tooltip.ng-scope.ng-isolate-scope > div.tooltip-inner.ng-binding',
                'zh-CN': (el) => {
                    const newContent = TOOLTIP_LABEL[el.innerHTML];
                    if (newContent) {
                        el.innerHTML = newContent;
                        // 某些中文的 tooltip 会每个字都换行，非常难看，所以指定一个宽度将其撑开
                        el.style.minWidth = `${18 * newContent.length}px`;
                    }
                },
                'reuse': true
            },
            // 下方 Script 面板
            { 'en-US': 'Script', 'zh-CN': '脚本' },
            { 'en-US': 'Branch:', 'zh-CN': '分支:', 'reuse': true },
            { 'en-US': 'Modules', 'zh-CN': '模块', 'reuse': true },
            { 'en-US': 'Choose active branch:', 'zh-CN': '选择活动分支', 'reuse': true },
            { 'en-US': 'Add normal module', 'zh-CN': '添加普通模块', 'reuse': true },
            { 'en-US': 'Add binary module', 'zh-CN': '添加二进制模块', 'reuse': true },
            {
                'selector': 'section > section > div:nth-child(2) > div.modules-list > form > input',
                'zh-CN': (el) => {
                    el.placeholder = '输入新模块名称...';
                },
                'reuse': true
            },
            // // 下方 Console 面板
            { 'en-US': 'Console', 'zh-CN': '控制台' },
            // // 下方 Memory 面板
            { 'en-US': 'Memory', 'zh-CN': '内存' },
            // 为了放置内存字段被错误翻译，内存面板被整个禁止翻译了，所以这个也就用不到了
            // {
            //     'selector': 'div.tab-pane > .ng-scope > section > div:nth-child(2) > div > form > input',
            //     'zh-CN': (el: HTMLInputElement) => {
            //         el.placeholder = '添加新的内存监视路径，例如：creeps.John'
            //     }
            // },
            { 'en-US': 'SEGMENT #:', 'zh-CN': '片段 #:', 'reuse': true },
            { 'en-US': 'Sign:', 'zh-CN': '签名:', 'reuse': true },
            // 右侧 panel 名
            // 装扮面板
            { 'en-US': 'Decorations', 'zh-CN': '装饰' },
            { 'en-US': 'View in inventory', 'zh-CN': '在库存中查看' },
            { 'en-US': 'World Map', 'zh-CN': '世界地图' },
            // 入侵者面板
            { 'en-US': 'Invasion', 'zh-CN': '入侵' },
            { 'en-US': 'Type', 'zh-CN': '类型' },
            { 'en-US': 'Melee', 'zh-CN': '近战' },
            { 'en-US': 'Ranged', 'zh-CN': '远程' },
            { 'en-US': 'Healer', 'zh-CN': '治疗' },
            { 'en-US': 'Size', 'zh-CN': '大小' },
            { 'en-US': 'Small', 'zh-CN': '小型' },
            { 'en-US': 'Big', 'zh-CN': '大型' },
            { 'en-US': 'Boosted', 'zh-CN': '强化' },
            { 'en-US': 'Create an invader', 'zh-CN': '创造入侵者' },
            // 坐标面板
            { 'en-US': 'Cursor', 'zh-CN': '坐标' },
            { 'en-US': 'Terrain:', 'zh-CN': '地形' },
            {
                'selector': '.cursor.ng-isolate-scope > div > div > div > span',
                'zh-CN': translateMultiple({
                    'plain': '平原（plain）',
                    'swamp': '沼泽（swamp）',
                    'wall': '墙壁（wall）'
                }),
                'protect': true,
                'reuse': true
            },
            // RoomObject 面板
            { 'en-US': 'Position:', 'zh-CN': '位置 position:', 'reuse': true },
            { 'en-US': 'Hits:', 'zh-CN': '生命值 hits:', 'reuse': true },
            { 'en-US': 'Owner:', 'zh-CN': '所有者 owner:', 'reuse': true },
            { 'en-US': 'Energy:', 'zh-CN': '能量 energy:', 'reuse': true },
            { 'en-US': 'Cooldown:', 'zh-CN': '冷却 cooldown:', 'reuse': true },
            { 'en-US': 'Decay in:', 'zh-CN': '老化 decay:', 'reuse': true },
            { 'en-US': 'Public:', 'zh-CN': '开放 public:', 'reuse': true },
            { 'en-US': 'Name:', 'zh-CN': '名称 name:', 'reuse': true },
            { 'en-US': 'Fatigue:', 'zh-CN': '疲劳 fatigue:', 'reuse': true },
            { 'en-US': 'Time to live:', 'zh-CN': '剩余存活时间:', 'reuse': true },
            { 'en-US': 'Make public', 'zh-CN': '设为开放', 'reuse': true },
            { 'en-US': 'Make non-public', 'zh-CN': '设为非开放', 'reuse': true },
            { 'en-US': 'Notify me when attacked', 'zh-CN': '被攻击时通知我', 'reuse': true },
            { 'en-US': 'Destroy this structure', 'zh-CN': '摧毁该建筑', 'reuse': true },
            { 'en-US': 'Click again to confirm', 'zh-CN': '再次点击以确认', 'reuse': true },
            { 'en-US': 'Mineral:', 'zh-CN': '矿藏 mineral:', 'reuse': true },
            { 'en-US': 'Density:', 'zh-CN': '丰度 density:', 'reuse': true },
            { 'en-US': 'Amount:', 'zh-CN': '余量 amount:', 'reuse': true },
            { 'en-US': 'Regeneration in:', 'zh-CN': '重新生成于:', 'reuse': true },
            { 'en-US': 'Learn more', 'zh-CN': '了解更多', 'reuse': true },
            { 'en-US': 'Build an extractor here to mine this mineral deposit.', 'zh-CN': '在此处建筑一个 extractor 以采集该矿藏。', 'reuse': true },
            { 'en-US': 'Amount:', 'zh-CN': '余量 amount:', 'reuse': true },
            { 'en-US': 'Level:', 'zh-CN': '等级 level:', 'reuse': true },
            { 'en-US': 'Safe modes available:', 'zh-CN': '剩余安全模式:', 'reuse': true },
            { 'en-US': 'Downgrade in:', 'zh-CN': '降级时间:', 'reuse': true },
            { 'en-US': 'Power enabled:', 'zh-CN': '是否启用 Power:', 'reuse': true },
            { 'en-US': 'Activate safe mode', 'zh-CN': '激活安全模式', 'reuse': true },
            { 'en-US': 'This action will consume 1 available safe mode activation. Proceed?', 'zh-CN': '这将会消耗掉一次安全模式激活次数，确定继续？', 'reuse': true },
            { 'en-US': 'Unclaim', 'zh-CN': '取消占领', 'reuse': true },
            // 建筑面板
            // 建筑
            { 'en-US': 'Construct', 'zh-CN': '建筑', 'reuse': true },
            // 建筑过多弹窗
            {
                'en-US': 'You have too many construction sites. The maximum number of construction sites per player is 100.',
                'zh-CN': '您创建的 construction site 过多。每个玩家能够创建的 construction site 上限为 100。',
                'reuse': true
            },
            // 下方提示
            {
                'selector': 'g > text',
                'zh-CN': translateMultiple(CONSTRUCT_NOTICE),
                'reuse': true
            },
            // 建筑状态
            // 无法更新可建筑数量，暂时禁用
            // {
            //     'selector': 'div > div > div > button > .ng-scope > div',
            //     'zh-CN': (el: HTMLElement) => {
            //         el.innerHTML = el.innerHTML.replace('Available:', '可建造数:')
            //         el.innerHTML = el.innerHTML.replace('required', '')
            //         el.innerHTML = el.innerHTML.replace('RCL ', '要求RCL')
            //         el.innerHTML = el.innerHTML.replace('Available', '可建造')
            //         el.innerHTML = el.innerHTML.replace('No controller', '控制器无效')
            //     },
            //     'reuse': true
            // },
            // Spawn 建造弹窗
            { 'en-US': 'Create', 'zh-CN': '建造', 'reuse': true },
            { 'en-US': 'Enter name:', 'zh-CN': '输入名称', 'reuse': true },
            { 'en-US': 'Cancel', 'zh-CN': '取消', 'reuse': true },
            { 'en-US': 'OK', 'zh-CN': '确认', 'reuse': true },
            // 建筑描述
            { 'en-US': 'Contains additional energy which can be used by spawns for spawning bigger creeps.', 'zh-CN': '为 Spawn 提供生产更大体型 creep 所需要的储能空间。', 'reuse': true },
            { 'en-US': 'Decreases movement cost. Decays over time and requires repair.', 'zh-CN': '降低移动的消耗。会随着时间推移而老化并需要维护。', 'reuse': true },
            { 'en-US': 'Blocks movement of all creeps. Requires repair after construction.', 'zh-CN': '能够阻挡所有 creep。建造之后需要维护。', 'reuse': true },
            {
                'en-US': 'Defends creeps and structures on the same tile and blocks enemy movement. Decays over time and requires repair.',
                'zh-CN': '保护位于同一位置的 creep 及建筑，能够阻挡敌人。会随着时间推移而老化并需要维护。',
                'reuse': true
            },
            {
                'en-US': 'Remotely attacks or heals any creep in a room, or repairs a structure.',
                'zh-CN': '能够对同房间的任意 creep 进行远距离攻击或治疗，也可对建筑进行维护。',
                'reuse': true
            },
            { 'en-US': 'Stores up to 2,000 resource units. Decays over time and requires repair.', 'zh-CN': '能够存储 2,000 点资源。会随着时间推移而老化并需要维护。', 'reuse': true },
            { 'en-US': 'Stores up to 1,000,000 resource units.', 'zh-CN': '能够存储 1,000,000 点资源。', 'reuse': true },
            { 'en-US': 'Remotely transfers energy to another Link in the same room.', 'zh-CN': '能够向同房间的 Link 远距离传送能量。', 'reuse': true },
            { 'en-US': 'Allows to mine a mineral deposit.', 'zh-CN': '允许玩家采集矿物。', 'reuse': true },
            { 'en-US': 'Produces mineral compounds and boosts creeps.', 'zh-CN': '能够制造矿物化合物并强化 creep。', 'reuse': true },
            { 'en-US': 'Sends any resources to a\u00A0Terminal in another room.', 'zh-CN': '能够向另一房间的 Terminal 发送任意资源。', 'reuse': true },
            { 'en-US': 'Produces trade commodities.', 'zh-CN': '能够生产可交易商品。', 'reuse': true },
            { 'en-US': 'Spawns creeps using energy contained in the room spawns and extensions.', 'zh-CN': '使用房间内 Spawn 与 Extension 储备的能量生产 creep。', 'reuse': true },
            { 'en-US': 'Provides visibility into a distant room from your script.', 'zh-CN': '能够使您的脚本获取远处一房间的视野。', 'reuse': true },
            { 'en-US': 'Spawns power creeps with special unique powers.', 'zh-CN': '能够生产拥有特殊技能的超能 creep。', 'reuse': true },
            { 'en-US': 'Launches a nuke to a distant room dealing huge damage to the landing area.', 'zh-CN': '能够向远处一房间发射核弹，对命中区域造成巨大伤害。', 'reuse': true },
            // 右侧面板相关提示
            {
                'selector': 'a.help.ng-scope',
                'zh-CN': (el) => {
                    el.setAttribute('title', '该 controller 在降级时间达到最大之前无法升级（点击了解详情)');
                },
                'reuse': true
            },
            {
                'selector': 'div.damaged.ng-binding.ng-scope > a',
                'zh-CN': (el) => {
                    el.setAttribute('title', '通过升级 controller 避免降级（点击了解详情）');
                },
                'reuse': true
            },
            // 建筑工地面板
            { 'en-US': 'Construction Site', 'zh-CN': '建筑工地', 'reuse': true },
            { 'en-US': 'Structure:', 'zh-CN': '建筑(structure):', 'reuse': true },
            { 'en-US': 'Progress:', 'zh-CN': '进度(progress):', 'reuse': true },
            { 'en-US': 'Remove construction site', 'zh-CN': '移除建筑工地', 'reuse': true },
            // creep 面板
            { 'en-US': 'Suicide', 'zh-CN': '自杀 suicide' },
            { 'en-US': 'View memory', 'zh-CN': '查看 memory' },
            { 'en-US': 'Body', 'zh-CN': '部件' },
            // powercreep
            { 'en-US': 'Class:', 'zh-CN': '种类：', 'reuse': true },
            // 房间显示设置 
            { 'en-US': 'Show my names', 'zh-CN': '显示己方名称', 'reuse': true },
            { 'en-US': 'Show hostile names', 'zh-CN': '显示敌方名称', 'reuse': true },
            { 'en-US': 'Show flags', 'zh-CN': '显示旗帜（flag）', 'reuse': true },
            { 'en-US': 'Show flags names', 'zh-CN': '显示旗帜（flag）名称', 'reuse': true },
            { 'en-US': 'Show creeps speech', 'zh-CN': '显示 creep 的对话气泡', 'reuse': true },
            { 'en-US': 'Show visuals', 'zh-CN': '显示房间视觉效果（RoomVisual）', 'reuse': true },
            { 'en-US': 'Lighting:', 'zh-CN': '单位提供光照:', 'reuse': true },
            { 'en-US': 'Swamp texture:', 'zh-CN': '沼泽纹理:', 'reuse': true },
            { 'en-US': 'Hardware acceleration (WebGL)', 'zh-CN': '硬件加速（WebGL）', 'reuse': true },
            { 'en-US': 'Show metrics', 'zh-CN': '显示相关参数', 'reuse': true },
            { 'en-US': 'HD resolution:', 'zh-CN': '高清显示设置:', 'reuse': true },
            { 'en-US': 'Upscaling (performance)', 'zh-CN': 'Upscaling（性能）', 'reuse': true },
            { 'en-US': 'Native (quality)', 'zh-CN': 'Native（效果）', 'reuse': true },
            { 'en-US': 'Normal', 'zh-CN': '正常', 'reuse': true },
            { 'en-US': 'Low', 'zh-CN': '低', 'reuse': true },
            { 'en-US': 'Disabled', 'zh-CN': '关闭', 'reuse': true },
            { 'en-US': 'Animated', 'zh-CN': '动态', 'reuse': true },
            { 'en-US': 'Static', 'zh-CN': '静态', 'reuse': true },
            // effect面板
            { 'en-US': 'Effects', 'zh-CN': '效果', 'reuse': true },
            // {
            //     'selector': 'div.effect-icon',
            //     'zh-CN': (el: HTMLElement) => {
            //         let text = el.getAttribute('title')
            //         text = text.replace('Ticks remaining', '剩余时长')
            //         el.setAttribute('title', text)
            //     },
            //     'reuse': true
            // },
            {
                'en-US': 'While this structure is alive, it will send invader creeps to all rooms in this sector. It also seems there are some valuable resources inside.',
                'zh-CN': '当该建筑存在时, 会在本 sector 的全部房间生成 invader creeps。其内部似乎有贵重的资源。',
                'reuse': true
            },
            // 特殊建筑面板
            // portal
            { 'en-US': 'Destination:', 'zh-CN': '目的地 destination:', 'reuse': true },
            // controller
            { 'en-US': 'Reserved:', 'zh-CN': '预定:', 'reuse': true },
            // invader core
            { 'en-US': 'This structure is spawned by its parent nearby.', 'zh-CN': '该建筑由位于附近的父建筑生成', 'reuse': true },
            { 'en-US': 'Deploying in:', 'zh-CN': '剩余部署时间:', 'reuse': true },
            // invader core creep
            {
                'en-US': 'This creep is angry with your harvesting activity here. Its home is located somewhere in this sector.',
                'zh-CN': '您的采集行为激怒了这个 creep。它的出生点位于本 sector 的某个位置。',
                'reuse': true
            },
            // source keeper lair
            { 'en-US': 'Spawning in:', 'zh-CN': '下一次生成单位:', 'reuse': true },
            // deposite
            { 'en-US': 'Deposit:', 'zh-CN': '沉积物 Deposit:', 'reuse': true },
            { 'en-US': 'Last cooldown:', 'zh-CN': '上一次采集冷却:', 'reuse': true },
            // powerbank
            { 'en-US': 'Power:', 'zh-CN': 'Power 容量:', 'reuse': true },
            { 'en-US': 'This structure emits bright light and splashes of sparks.', 'zh-CN': '这个建筑散发着亮光，飞溅出火星。', 'reuse': true },
            // tombstone
            { 'en-US': 'Death time:', 'zh-CN': '死亡时间:', 'reuse': true },
            // {
            //     'selector': 'div.ng-scope > div.ng-binding.ng-scope',
            //     'zh-CN': (el: HTMLElement) => {
            //         el.innerHTML = el.innerHTML.replace('ago', '之前')
            //     },
            //     'reuse': true
            // }
            // 旗帜放置面板
            { 'en-US': 'Change position', 'zh-CN': '修改位置', 'reuse': true },
            { 'en-US': 'Change color', 'zh-CN': '修改颜色', 'reuse': true },
            { 'en-US': 'Remove flag', 'zh-CN': '移除旗帜', 'reuse': true },
            { 'en-US': 'Color:', 'zh-CN': '主要颜色 color:', 'reuse': true },
            { 'en-US': 'Secondary color:', 'zh-CN': '次要颜色 secondaryColor:', 'reuse': true },
            {
                'en-US': 'Flag with the same name already exists and will be overwritten!',
                'zh-CN': '相同名称的旗帜已存在，继续创建将覆盖原旗帜！',
                'reuse': true
            },
            ...getTips()
        ]
    };

    const content$4 = {
        hashs: ['#!/sim/custom', '#!/sim/survival', '#!/sim/tutorial/'],
        content: [
            // 自定义面板
            { 'en-US': 'Customize', 'zh-CN': '自定义房间设置', 'reuse': true },
            { 'en-US': 'Choose action:', 'zh-CN': '选择操作：', 'reuse': true },
            { 'en-US': 'Erase', 'zh-CN': '清除目标', 'reuse': true },
            // 建筑列表里也会被翻译，会有点怪，暂时不用
            // { 'en-US': 'Wall', 'zh-CN': 'Wall 地形', 'reuse': true },
            // { 'en-US': 'C. Wall', 'zh-CN': 'Wall 建筑', 'reuse': true },
            // 练习/模拟房间面板
            // ticks速度调整面板
            { 'en-US': 'Simulation Room', 'zh-CN': '模拟器房间', 'reuse': true },
            // {
            //     'selector': 'div.speed.ng-scope > span.ng-binding',
            //     'zh-CN': (el: HTMLElement) => {
            //         el.innerHTML = el.innerHTML.replace('Speed', '速度(Speed)')
            //     },
            //     'reuse': true
            // },
            { 'en-US': 'Leave simulation', 'zh-CN': '退出模拟器', 'reuse': true },
            // 玩家控制权面板
            { 'en-US': 'Player Control', 'zh-CN': '玩家控制', 'reuse': true },
            { 'en-US': 'Player 2', 'zh-CN': '玩家2', 'reuse': true },
            // 模拟器 controller
            { 'en-US': 'Increase level', 'zh-CN': '提升等级', 'reuse': true },
            { 'en-US': 'Decrease level', 'zh-CN': '降低等级', 'reuse': true }
        ]
    };

    const content$5 = {
        hashs: ['#!/sim/tutorial'],
        content: [
            // 在 simTab 页里已经翻译了主要的标题文本，所以这里不再重复翻译
            { 'en-US': 'View scripts on GitHub', 'zh-CN': '在 GitHub 上查看代码' },
            { 'en-US': 'Game UI and basic scripting', 'zh-CN': '游戏 UI 与基础编程' },
            { 'en-US': 'Upgrading controller', 'zh-CN': '升级控制器' },
            { 'en-US': 'Building structures', 'zh-CN': '建造建筑' },
            { 'en-US': 'Auto-spawning creeps', 'zh-CN': '自动孵化 creep' },
            { 'en-US': 'Defending your room', 'zh-CN': '防守您的房间' },
            { 'en-US': 'Don\'t know how to code in JavaScript?', 'zh-CN': '不知道如何编写 JavaScript 代码？', 'reuse': true },
            { 'en-US': 'Check out this free interactive course!', 'zh-CN': '看看这个免费的互动教程！', 'reuse': true },
            { 'en-US': 'Ok', 'zh-CN': '确定', 'reuse': true },
            // 重玩章节提示，因为里边包含动态字符串（章节名），所以这里用选择器拿到并翻译
            {
                'selector': 'app-dlg-confirm > app-confirm > main > p',
                'zh-CN': (el) => {
                    const oldContent = trim(el.innerHTML);
                    if (!oldContent.startsWith('This will remove your existing code from the'))
                        return;
                    const tutorialName = oldContent.match(/"tutorial-\d{1,}"/g);
                    el.innerHTML = `这将会移除 ${tutorialName} 分支上现存的代码，确定要重新开始这一教程部分么？`;
                },
                'reuse': true
            }
        ]
    };

    /**
     * 翻译 Objective 元素
     *
     * 目标元素（Objective）是指教程中加粗的文本，分为以下两种：
     * - 目标型元素：指示下一步应该做什么（例如：点击控制台面板）
     * - 文档型元素：一个列表，列出了相关的文档
     *
     * @param contents 正文替换内容
     * @param linkHrefs 链接替换内容
     * @returns 用于翻译 Objective 元素的内容
     */
    const getObjectiveTranslationContent = function (contents, linkHrefs) {
        const contentsIndex = Object.keys(contents);
        return [
            // 翻译所有行动目标，注意这里的选择器是目标元素最前面的小箭头，向右的就作为行动目标解析
            {
                'selector': '.objective > .fa-caret-right',
                'zh-CN': (el) => {
                    // 获取到原始对象
                    const objectiveEl = el.parentElement;
                    // 倒叙匹配翻译文本，因为前面有个小箭头，匹配起来会更浪费性能
                    const targetContentKey = contentsIndex.find(key => trim(objectiveEl.innerHTML).endsWith(key));
                    if (!targetContentKey)
                        return;
                    // 匹配成功，进行翻译，这里是肯定能取到值的，因为 targetContentKey 一定是 contents 的键
                    const newContent = contents[targetContentKey];
                    objectiveEl.innerHTML = objectiveEl.innerHTML.replace(targetContentKey, newContent);
                },
                'reuse': true,
                // 因为这里 selector 获取的是前面的小箭头，而这个是不会变的，所以需要跳过查重检查
                'ingnoreRepeatedCheck': true
            },
            // 翻译所有文档目标，注意这里的选择器是目标元素最前面的小箭头，向下的就作为文档目标解析
            {
                'selector': '.objective a',
                'zh-CN': (el) => {
                    // 翻译链接文本
                    const newContent = contents[trim(el.innerHTML)];
                    if (newContent)
                        el.innerHTML = newContent;
                    // 翻译链接网址
                    const newHref = linkHrefs[el.href];
                    if (newHref)
                        el.href = newHref;
                },
                'reuse': true
            }
        ];
    };
    /**
     * 获取每个教程章节中都包含的 UI 翻译内容
     */
    const getBaseUIContent = function () {
        return [
            { 'en-US': 'Back', 'zh-CN': '返回', 'reuse': true },
            { 'en-US': 'Start', 'zh-CN': '开始', 'reuse': true },
            { 'en-US': 'Next', 'zh-CN': '下一步', 'reuse': true },
            { 'en-US': 'Got it', 'zh-CN': '明白了', 'reuse': true },
            { 'en-US': 'Code', 'zh-CN': '代码', 'reuse': true },
            { 'en-US': 'Stay', 'zh-CN': '留在这里', 'reuse': true },
            { 'en-US': 'Documentation:', 'zh-CN': '文档：', 'reuse': true }
        ];
    };

    /**
     * 教程正文
     */
    const TUTORIAL_CONTENT = {
        'This tutorial will help you learn basic game concepts step by step.\nYou can take it later, but we strongly advise you to do it now, before you start a real game.': '这个教程将帮助您一步步地了解这个游戏的基础概念。您可以稍后再进行这个教程，但是我们强烈建议您在开始真正的游戏前先来试试手。',
        'If you experience any performance issues, please note that Screeps is best played in Chrome browser.': '如果您遇到了任何异常的问题，请记住，Screeps 在 Chrome 浏览器上可以带来最佳的表现。',
        'Screeps is a game for programmers. If you don\'t know how to code in JavaScript, check out this&nbsp;<a app-nw-external-link="" href="https://codecademy.com/learn/javascript" target="_blank">free interactive course</a>.': 'Screeps 是一个为程序员们设计的游戏，如果您不知道如何编写 JavaScript 代码，来试试这个 <a app-nw-external-link="" href="https://codecademy.com/learn/javascript" target="_blank">免费的交互式课程</a>',
        'Remember that if you accidentally close a hint window in the tutorial, you can always open it again with this button.': '请记住，如果您不小心关闭了教程中的提示窗口，只需要点一下这个按钮就能重新打开它。',
        'Let\'s begin. This is a playing field called a "room". In the real game, rooms are connected to each other with\nexits, but in the simulation mode only one room is available to you.': '让我们开始吧！这是一个被称为 “房间（room）” 的游戏窗口，在实际游戏中，房间会通过出口（exit）与其他房间相连，但是在模拟模式下，只有一个房间可以供您使用。',
        'The object in the center of the screen is your first spawn, your colony center.': '屏幕中心的这个小东西是您的第一个 Spawn，它是您的殖民地核心。',
        'You play by writing code in the panel in the bottom of the screen.': '您将通过在屏幕底部的面板中编写代码来进行游戏',
        'You can enter your code in this field. It will run once.': '您可以在这个输入框中执行您的代码，它们只会被执行一次。',
        'Your command returns a response (or execution error) in the console below. All output is duplicated into your browser console (<strong>Ctrl+Shift+J</strong>) where you can expand objects for debugging purposes.\nYou can open and close the bottom panel by pressing <strong>Alt+Enter</strong>.': '您的命令在下面的控制台中返回响应（或执行错误）。所有日志都同步复制到了浏览器的控制台中（<strong>Ctrl+Shift+J</strong>）中，您可以在其中展开对象以更好的进行调试。您可以通过按下 <strong>Alt+Enter</strong> 打开和关闭底部面板。',
        'Now we\'ll write something real.': '现在，让我们写点真正的代码。',
        'Your spawn creates new units called "creeps" by its method <code>spawnCreep</code>.\nUsage of this method is described in the <a href="http://docs.screeps.com" app-nw-external-link="" target="_blank">documentation</a>. Each creep has a name and certain body parts that give it\nvarious skills.': '您的 Spawn 可以通过 <code>spawnCreep</code> 方法创建名为 “creep” 的新单位。可以在 <a href="https://screeps-cn.gitee.io/index.html" app-nw-external-link="" target="_blank">本文档</a> 中找到该方法的介绍。每个 creep 都有一个名字（name）和一定量的身体部件（body part），不同的身体部件会带来不同的能力。',
        'You can address your spawn by its name the following way: <code>Game.spawns[\'Spawn1\']</code>.': '您可以使用您 spawn 的名字来获取到它，就像这样：<code>Game.spawns[\'Spawn1\']</code>。',
        'Great! You now have a creep with the name "Harvester1" that you can control.': '棒极了！您现在拥有了一个名为 “Harvester1” 的 creep，您可以控制它做很多事情。',
        'You can see all the characteristics of your creep (or other objects) by utilizing the "View" action.': '通过 “查看” 功能，您可以看到您 creep（或者其他任何对象）的所有属性。',
        'Here you can see the characteristics of the object you are now looking at.\nValues of each characteristic and functions of body parts are described in the documentation.': '在这里您可以看到选中对象的属性。每个属性的值和身体部件的功能都可以在文档中找到相关介绍。',
        'It is time to put the creep to work! This yellow square is an energy source — a valuable game resource.\nIt can be harvested by creeps with one or more <code>WORK</code> body parts and transported to the spawn by creeps with <code>CARRY</code> parts.': '现在是时候让这个 creep 去工作了！这个黄色小方块是一个能量源（Source） —— 一种宝贵的游戏资源。它可以被带有一个或多个 <code>WORK</code> 身体部件的 creep 采集，并由带有 <code>CARRY</code> 部件的 creep 运送到 spawn。',
        'To give your creep a permanently working command, the console is not enough, since we want the creep to work all the time.\nSo we\'ll be using the Script tab rather than the console.': '要给您的 creep 设置一个永久工作指令光靠控制台是不够的，因为我们更希望 creep 可以一直工作下去。所以我们将使用脚本面板而不是控制台。',
        'Here you can write scripts that will run on a permanent basis, each game tick in a loop.\nIt allows writing constantly working programs to control behaviour of your creeps which will work even while you\nare offline (in the real game only, not the Simulation Room mode).': '您在这里写下的代码每个游戏 tick 都会执行一遍。所以您可以编写一段持续工作的程序来让 creep 一直干活，哪怕您已经离线了（仅就实际游戏而言，对于模拟模式并不生效）。',
        'To commit a script to the game so it can run, use this button or <strong>Ctrl+Enter</strong>.': '使用 <strong>Ctrl+Enter</strong> 来向游戏提交代码，这样就可以让代码开始运行。',
        'The code for each Tutorial section is created in its own branch. You can view code from these branches for\nfurther use in your scripts.': '每个教程章节的代码都会创建并保存到独有的分支中。您可以从这些分支中查看代码以便以后使用。',
        'To send a creep to harvest energy, you need to use the methods described in the documentation section below.\nCommands will be passed each game tick. The <code>harvest</code> method requires that the energy source is adjacent to the creep.': '想让 creep 去采集能量，您需要使用下面 “文档” 小节中介绍的方法，这些指令每个游戏 tick 都会被执行。而 <code>harvest</code> 方法则需要在 creep 相邻的位置上有一个能量源。',
        'You give orders to a creep by its name this way: <code>Game.creeps[\'Harvester1\']</code>.\nUse the <code>FIND_SOURCES</code> constant as an argument to the <code>Room.find</code> method.': '您可以通过 creep 的名字来获取到它并对其下达命令，就像这样：<code>Game.creeps[\'Harvester1\']</code>。把 <code>FIND_SOURCES</code> 常量作为参数传递给 <code>Room.find</code> 方法可以房间中的能量源。',
        'A bubbling yellow spot inside the creep means that it has started collecting energy from the source.': 'creep 身体里逐渐变大的黄色圆点代表它已经开始从能量源中采集能量了。',
        'To make the creep transfer energy back to the spawn, you need to use the method\n<code>Creep.transfer</code>.\nHowever, remember that it should be done when the creep is next to the spawn, so the creep needs to walk back.': '想要让 creep 把能量运送回 spawn，您需要使用 <code>Creep.transfer</code> 方法。但是请记住，这个方法只有在 creep 和 spawn 相邻的时候才能正确执行，所以需要让 creep 先走回来。',
        'If you modify the code by adding the check <code>.store.getFreeCapacity()&nbsp;&gt;&nbsp;0</code> to the creep,\nit will be able to go back and forth on its own, giving energy to the spawn and returning to the source.': '当您把 <code>.store.getFreeCapacity()&nbsp;&gt;&nbsp;0</code> 作为检查条件添加到代码里时，creep 应该就可以自己一步步的把能量搬运回 spawn 然后走回能量源。',
        'Great! This creep will now work as a harvester until it dies. Remember that almost any creep has a life cycle of 1500\ngame ticks, then it "ages" and dies (this behavior is disabled in the Tutorial).': 'Nice！现在这个 creep 将会一直作为采集者（harvester）工作直到去世。请记住，几乎所有的 creep 都有 1500 游戏 tick 的生命周期，在此之后它就会 “老去” 然后死掉（这个设定在本教程中并不生效）。',
        'Let\'s create another worker creep to help the first one. It will cost another 200 energy units, so you may\nneed to wait until your harvester collects enough energy. The <code>spawnCreep</code> method will return an\nerror code <code>ERR_NOT_ENOUGH_ENERGY</code> (-6) until then.': '让我们孵化新的 creep 来帮助第一个。这会消耗掉 200 点能量，所以您可能需要等到采集单位收集到足够的能量。<code>spawnCreep</code> 方法会返回错误码 <code>ERR_NOT_ENOUGH_ENERGY</code>（-6）直到您能量足够为止。',
        'Remember: to execute code once just type it in the "Console" tab.': '请记住：想要执行一次性的代码的话，直接在 “控制台” 面板中输入就可以了。',
        'The second creep is ready, but it won\'t move until we include it into the program.': '第二个 creep 已经就绪了，但是它现在还不会动，所以我们需要将其添加进我们的程序。',
        'To set the behavior of both creeps we could just duplicate the entire script for the second one,\nbut it\'s much better to use the <code>for</code> loop against all the screeps in <code>Game.creeps</code>.': '想要给所有的 creep 都设置行为，只需要把整个脚本为新的 creep 复制一遍就好了，但是更好的做法是使用 <code>for</code> 循环来遍历 <code>Game.creeps</code> 中的所有 creep。',
        'Now let\'s improve our code by taking the workers\' behavior out into a separate <em>module</em>. Create a module called <code>role.harvester</code>\nwith the help of the Modules section on the left of the script editor and define a <code>run</code> function inside the <code>module.exports</code> object,\ncontaining the creep behavior.': '现在，让我们把工作单位的行为逻辑封装到一个单独的 <em>module</em> 里来改善我们的代码。使用模块功能创建一个名为 <code>role.harvester</code> 的模块，您可以在脚本编辑器的左侧找到它。然后在 <code>module.exports</code> 对象中定义一个 <code>run</code> 函数来存放 creep 的行为逻辑。',
        'Now you can rewrite the main module code, leaving only the loop and a call to your new module by the method\n<code>require(\'role.harvester\')</code>.': '现在，您可以重写 main 模块的代码，只留下 loop 函数，并通过 <code>require(\'role.harvester\')</code> 方法调用您的新模块。',
        'It\'s much better now!': '现在看起来好多了！',
        'By adding new roles and modules to your creeps this way, you can control and manage the work of many creeps.\nIn the next Tutorial section, we’ll develop a new creep role.': '通过这种方法向您的 creep 添加新的角色和模块，由此控制和管理众多 creep 的工作。在下一关里，我们将开发一个新的 creep 角色。'
    };
    /**
     * 行动目标文本
     */
    const OBJECTIVE_CONTENT = {
        'Game world': '游戏世界',
        'Your colony': '您的殖民地',
        'Game object': '游戏对象',
        'Scripting basics': '脚本基础',
        'Create a worker creep with the body array <code>[WORK,CARRY,MOVE]</code> and name <code>Harvester1</code> (the name is important for the tutorial!).\nYou can type the code in the console yourself or copy&nbsp;&amp;&nbsp;paste the hint below.': '创建一个身体部件为 <code>[WORK,CARRY,MOVE]</code> 并且名字叫做 <code>Harvester1</code>（这个名字对本教程来说非常重要！）的工人 creep。您可以自己在控制台中输入这些代码，或者复制&nbsp;&amp;&nbsp;粘贴下面的提示。',
        'Hide the editor panel with <strong>Alt+Enter</strong> and select your creep with the help of the "View" action.': '按下 <strong>Alt+Enter</strong> 键来隐藏编辑器面板并在 “查看” 功能下选中您的 creep',
        'Click the "Console" tab.': '点击 “控制台” 面板。',
        'Type anything in this field and press Enter.': '在这里随便输点什么然后按回车键。',
        'Click the "Script" tab.': '点击 “脚本” 面板。',
        'Send your creep to harvest energy by typing code in the "Script" tab.': '通过在 “脚本” 面板中键入代码来让您的 creep 前去采集能量。',
        'Extend the creep program so that it can transfer harvested energy to the spawn and return back to work.': '拓展您的 creep 程序，使其可以将采集到的能量运送（transfer）回 spawn 中并重新开始工作。',
        'Spawn a second creep with the body <code>[WORK,CARRY,MOVE]</code> and name <code>Harvester2</code>.': '孵化第二个 creep，其身体部件为 <code>[WORK,CARRY,MOVE]</code> 并命名为 <code>Harvester2</code>。',
        'Expand your program to both the creeps.': '拓展您的程序，使其可以适用到所有 creep 上。',
        'Create a <code>role.harvester</code> module.': '创建 <code>role.harvester</code> 模块。',
        'Organizing scripts using modules': '使用模块组织代码',
        'Include the <code>role.harvester</code> module in the main module.': '将 <code>role.harvester</code> 模块引入到 main 模块中。'
    };
    /**
     * 帮助文档更换
     */
    const OBJECTIVE_LINK = {
        'http://docs.screeps.com/introduction.html#Game-world': `${DOCUMENT_CN}/introduction.html#%E6%B8%B8%E6%88%8F%E4%B8%96%E7%95%8C`,
        'http://docs.screeps.com/introduction.html#Your-colony': `${DOCUMENT_CN}/introduction.html#%E5%B1%9E%E5%9C%B0%EF%BC%88Colony%EF%BC%89`,
        'http://docs.screeps.com/creeps.html': `${DOCUMENT_CN}/creeps.html`,
        'http://docs.screeps.com/global-objects.html#Game-object': `${DOCUMENT_CN}/global-objects.html#Game-%E5%AF%B9%E8%B1%A1`,
        'http://docs.screeps.com/api/#StructureSpawn.spawnCreep': `${DOCUMENT_CN}/api/#StructureSpawn.spawnCreep`,
        'http://docs.screeps.com/scripting-basics.html': `${DOCUMENT_CN}/scripting-basics.html`,
        'http://docs.screeps.com/api/#Game.creeps': `${DOCUMENT_CN}/api/#Game.creeps`,
        'http://docs.screeps.com/api/#RoomObject.room': `${DOCUMENT_CN}/api/#RoomObject.room`,
        'http://docs.screeps.com/api/#Room.find': `${DOCUMENT_CN}/api/#Room.find`,
        'http://docs.screeps.com/api/#Creep.moveTo': `${DOCUMENT_CN}/api/#Creep.moveTo`,
        'http://docs.screeps.com/api/#Creep.harvest': `${DOCUMENT_CN}/api/#Creep.harvest`,
        'http://docs.screeps.com/modules.html': `${DOCUMENT_CN}/modules.html`,
        'http://docs.screeps.com/api/#Creep.store': `${DOCUMENT_CN}/api/#Creep.store`,
        'http://docs.screeps.com/api/#Creep.transfer': `${DOCUMENT_CN}/api/#Creep.transfer`
    };
    const content$6 = {
        hashs: ['#!/sim/tutorial/1'],
        content: [
            ...getBaseUIContent(),
            { 'en-US': 'Next section', 'zh-CN': '下一关', 'reuse': true },
            { 'en-US': 'Welcome to Screeps!', 'zh-CN': '欢迎来到 Screeps！', 'reuse': true },
            { 'en-US': 'JavaScript Reference:', 'zh-CN': 'JavaScript 参考：', 'reuse': true },
            // 翻译所有教程文本
            {
                'selector': '.tutorial-content.ng-scope > section > p',
                'zh-CN': translateMultiple(TUTORIAL_CONTENT),
                'reuse': true
            },
            // 翻译所有目标文本
            ...getObjectiveTranslationContent(OBJECTIVE_CONTENT, OBJECTIVE_LINK)
        ]
    };

    /**
     * 教程正文
     */
    const TUTORIAL_CONTENT$1 = {
        'In this Tutorial section we’ll talk about a key strategic object in your room: <strong>Room Controller</strong>.\nBy controlling this invincible structure you can build facilities in the room.\nThe higher the controller level, the more structures available to build.': '在本教程部分中，我们将来介绍您房间中的重要战略目标：<strong>房间控制器</strong>（controller）。控制这个不可摧毁的小东西将允许您在房间中建造建筑。控制器的等级越高，允许建造的建筑就越多。',
        'You will need a new worker creep to upgrade your controller level. Let\'s call it "Upgrader1".\nIn following sections we\'ll discuss how to create creeps automatically, but for now let\'s send a\ncommand manually to the console.': '您将需要一个新 creep 工作单位去升级您的控制器等级，让我们称其为 “Upgrader1”。在接下来的章节中我们将介绍如何自动创建 creep，但是现在让我们还是和之前一样在控制器里输入下面的命令。',
        'Creep "Upgrader1" went to perform the same task as the harvester, but we don\'t want it to. We need to differentiate creep roles.': 'creep “Upgrader1” 将执行和 harvester 相同的任务，但是我们并不想让它这么做。我们需要一个不同的 creep 角色（role）。',
        'To do that, we need to utilize the <code>memory</code> property of each creep that allows writing custom information\ninto the creep\'s "memory". Let\'s do this to assign different roles to our creeps.': '为此，我们需要利用每个 creep 都有的 <code>memory</code> 属性，该属性允许在 creep 的“内存”中写入自定义信息。这样，我们就可以给 creep 分配不同的角色。',
        'All your stored memory is accessible via the global <code>Memory</code> object. You can use it any way you like.': '您储存的所有内存信息可以通过全局对象 <code>Memory</code> 访问。这两种方式您想用哪种都可以。',
        'You can check your creeps\' memory in either the creep information panel on the left or on the "Memory" tab.': '您可以在左侧的 creep 信息面板或者 “内存” 面板中查看您 creep 的内存。',
        'Now let\'s define the behavior of the new creep. Both creeps should harvest energy, but the creep with the role\n<code>harvester</code> should bring it to the spawn, while the creep with the role <code>upgrader</code>\nshould go to the Controller and apply the function <code>upgradeController</code> to it (you can get the\nController object with the help of the <code>Creep.room.controller</code> property).': '现在，让我们来定义新 creep 的行为逻辑。两种 creep 都需要采集能量，但是角色为 <code>harvester</code> 的 creep 需要把能量带回到 spawn，而角色为 <code>upgrader</code> 的 creep 需要走到 controller 旁然后对其执行 <code>upgradeController</code> 方法（您可以通过 <code>Creep.room.controller</code> 属性获取到 creep 所在房间的 controller 对象）。',
        'In order to do this, we’ll create a new module called <code>role.upgrader</code>.': '为此，我们需要创建一个名为 <code>role.upgrader</code> 的新模块。',
        'In our main module, all creeps run the same role. We need to divide their behavior depending on the previously\ndefined property <code>Creep.memory.role</code> by connecting the new module.': '在我们的 main 模块中，所有的 creep 都在扮演相同的角色。我们需要使用先前定义的 <code>Creep.memory.role</code> 属性区分它们的行为，注意不要忘记导入新模块哦。',
        'Perfect, you have upgraded your Controller level!': '干得好，您已经成功升级了您控制器的等级！',
        '<strong>Important:</strong> If you don’t upgrade your Controller within 20,000 game ticks, it loses one level.\nOn reaching level 0, you will lose control over the room, and another player will be able to capture it freely.\nMake sure that at least one of your creeps regularly performs the function <code>upgradeController</code>.': '<strong>重要：</strong>如果您在 20,000 游戏 tick 内都没有升级您的控制器的话，它将会损失一个等级。当降至 0 级时，您将失去对房间的控制权，并且其他的玩家可以毫无代价的将其占领。请确保至少有一个 creep 定期执行 <code>upgradeController</code> 方法。'
    };
    /**
     * 行动目标文本
     */
    const OBJECTIVE_CONTENT$1 = {
        'Spawn a creep with the body <code>[WORK,CARRY,MOVE]</code> and the name <code>Upgrader1</code>.': '孵化一个身体为 <code>[WORK,CARRY,MOVE]</code> 且名称为 <code>Upgrader1</code> 的 creep。',
        'Write a property <code>role=\'harvester\'</code> into the memory of the harvester creep and <code>role=\'upgrader\'</code>\n— to the upgrader creep with the help of the console.': '使用控制台将属性 <code>role=\'harvester\'</code> 写入采集单位的内存，将 <code>role=\'upgrader\'</code> 写入升级单位的内存。',
        'Create a new module <code>role.upgrader</code> with the behavior logic of your new creep.': '创建名为 <code>role.upgrader</code> 的新模块，并写入您新 creep 的行为逻辑。',
        'Apply the logic from the module <code>role.upgrader</code> to the creep with the role <code>upgrader</code>\nand check how it performed.': '将 <code>role.upgrader</code> 模块中的逻辑应用到拥有 <code>upgrader</code> 角色的 creep 身上并检查其表现。'
    };
    /**
     * 帮助文档更换
     */
    const OBJECTIVE_LINK$1 = {
        'http://docs.screeps.com/control.html': `${DOCUMENT_CN}/control.html`,
        'http://docs.screeps.com/api/#Game.spawns': `${DOCUMENT_CN}/control`,
        'http://docs.screeps.com/api/#StructureSpawn.spawnCreep': `${DOCUMENT_CN}/api/#StructureSpawn.spawnCreep`,
        'http://docs.screeps.com/global-objects#Memory-object': `${DOCUMENT_CN}/global-objects.html#Memory-%E5%AF%B9%E8%B1%A1`,
        'http://docs.screeps.com/api/#Creep.memory': `${DOCUMENT_CN}/api/#Creep.memory`,
        'http://docs.screeps.com/api/#RoomObject.room': `${DOCUMENT_CN}/api/#RoomObject.room`,
        'http://docs.screeps.com/api/#Room.controller': `${DOCUMENT_CN}/api/#Room.controller`,
        'http://docs.screeps.com/api/#Creep.upgradeController': `${DOCUMENT_CN}/api/#Creep.upgradeController`
    };
    const content$7 = {
        hashs: ['#!/sim/tutorial/2'],
        content: [
            ...getBaseUIContent(),
            { 'en-US': 'Next section', 'zh-CN': '下一关', 'reuse': true },
            { 'en-US': 'Control', 'zh-CN': '控制', 'reuse': true },
            { 'en-US': 'Memory object', 'zh-CN': 'Memory 对象', 'reuse': true },
            // 翻译所有教程文本
            {
                'selector': '.tutorial-content.ng-scope > section > p',
                'zh-CN': translateMultiple(TUTORIAL_CONTENT$1),
                'reuse': true
            },
            // 翻译所有目标文本
            ...getObjectiveTranslationContent(OBJECTIVE_CONTENT$1, OBJECTIVE_LINK$1)
        ]
    };

    /**
     * 教程正文
     */
    const TUTORIAL_CONTENT$2 = {
        'The Controller upgrade gives access to some new structures: walls, ramparts, and extensions.\nWe’ll discuss walls and ramparts in the next Tutorial section, for now let’s talk about extensions.': '控制器升级解锁了新的建筑：wall、rampart 以及 extension。我们将在下个教程部分讨论 wall 和 rampart，现在让我们先来了解一下 extension。',
        '<b>Extensions</b> are required to build larger creeps. A creep with only one body part of one type works poorly.\nGiving it several <code>WORKs</code> will make him work proportionally faster.': '<b>Extension</b> 被用来孵化更大型的 creep。每种身体类型只有一个部件的 creep 工作并不高效。多为其添加几个 <code>WORK</code> 部件可以让它们成比例的提高效率。',
        'However, such a creep will be costly and a lone spawn can only contain 300 energy units.\nTo build creeps costing over 300 energy units you need spawn extensions.': '但是，这样的 creep 会更加的昂贵，并且单独一个 spawn 只能容纳最多 300 点能量。想要孵化成本超过 300 点能量的 creep，您需要 spawn 拓展（即 extension）。',
        'The second Controller level has <strong>5 extensions</strong> available for you to build.\nThis number increases with each new level.': '二级 controller 将允许您建造 <strong>5 个 extension</strong>。每次 controller 升级都会解锁更多的 extension。',
        'You can place extensions at any spot in your room, and a spawn can use them regardless of the distance.\nIn this Tutorial we have already placed corresponding construction sites for your convenience.': '您可以在您房间中的任何位置放置 extension，并且 spawn 可以无视彼此之间的距离直接使用 extension 中的能量。为了方便起见，我们已经放置好了对应的建筑工地（construction site）。',
        'Let’s create a new creep whose purpose is to build structures. This process will be similar to the previous Tutorial sections.\nBut this time let’s set <code>memory</code> for the new creep right in the method <code>Spawn.spawnCreep</code> by\npassing it in the third argument.': '让我们创建一个用于建造建筑的新 creep。这个过程和之前的教程章节类似。但是这次我们将使用 <code>Spawn.spawnCreep</code> 方法的第三个参数直接为新的 creep 设置 <code>memory</code>。',
        'Our new creep won’t move until we define the behavior for the role <code>builder</code>.': '在我们为 <code>builder</code> 角色定义行为逻辑之前，新的 creep 都会傻乎乎的呆在原地。',
        'As before, let’s move this role into a separate module <code>role.builder</code>. The building is carried out\nby applying the method <code>Creep.build</code> to the construction sites searchable by\n<code>Room.find(FIND_CONSTRUCTION_SITES)</code>. The structure requires energy which your creep can harvest on its own.': '和之前一样，我们把这个角色放到单独的模块 <code>role.builder</code> 中。建造是通过对建筑工地执行 <code>Creep.build</code> 方法进行的，而工地则可以通过 <code>Room.find(FIND_CONSTRUCTION_SITES)</code> 搜索得到。建造建筑需要能量，您的 creep 应该自己去采集它们。',
        'To avoid having the creep run back and forth too often but make it deplete the cargo, let’s complicate our logic by\ncreating a new Boolean variable <code>creep.memory.building</code> which will tell the creep when to switch tasks.\nWe\'ll also add new <code>creep.say</code> call and <code>visualizePathStyle</code> option to the <code>moveTo</code>\nmethod to visualize the creep\'s intentions.': '为了避免由于身上资源耗尽而频繁的来回移动，让我们通过添加一个新的布尔变量 <code>creep.memory.building</code> 来增强一下代码，这个变量将会告诉 creep 应该何时切换任务。我们还调用了 <code>creep.say</code> 并且在 <code>moveTo</code> 方法中添加了 <code>visualizePathStyle</code> 选项来可视化 creep 的移动路径。',
        'Let’s create a call of the new role in the main module and wait for the result.': '让我们在 main 模块中引用新的角色并瞧瞧会发生什么。',
        'Your extensions have been built. Now let’s learn to work with them.': '您的 extension 已经造好了。现在让我们了解一下如何使用它们。',
        'Maintaining extensions requires you to teach your harvesters to carry energy not just to a spawn but also to\nextensions. To do this, you can either use the <code>Game.structures</code> object or search within the room\nwith the help of <code>Room.find(FIND_STRUCTURES)</code>. In both cases, you will need to filter the list of\nitems on the condition <code>structure.structureType == STRUCTURE_EXTENSION</code> (or, alternatively, <code>structure instanceof StructureExtension</code>)\nand also check them for energy load, as before.': '想要维护 extension，您需要教会您的采集单位把能量运输到 extension 而不仅仅是 spawn。为此，您需要使用 <code>Game.structures</code> 对象或者在对应的房间执行 <code>Room.find(FIND_STRUCTURES)</code> 方法进行搜索。无论使用哪种方式，您都需要用判断条件 <code>structure.structureType == STRUCTURE_EXTENSION</code>（或者 <code>structure\n instanceof StructureExtension</code>）对结果列表进行筛选，还有别忘了检查它们存有多少能量（就像之前检查 creep 一样）。',
        'To know the total amount of energy in the room, you can use the property <code>Room.energyAvailable</code>.\nLet’s add the output of this property into the console in order to track it during the filling of extensions.': '想要了解房间里总共有多少能量可以用于孵化，您可以使用 <code>Room.energyAvailable</code> 属性。让我们把这个属性输出到控制台中以便在 extension 填充期间对其进行追踪。',
        'Excellent, all the structures are filled with energy. It’s time to build somebody large!': '非常好，所有的建筑都填满了能量。是时候建造一些大家伙了！',
        'In total, we have 550 energy units in our spawn and extensions. It is enough to build a creep with the body\n<code>[WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE]</code>. This creep will work 4 times faster than a regular worker\ncreep. Its body is heavier, so we’ll add another <code>MOVE</code> to it. However, two parts are still not\nenough to move it at the speed of a small fast creep which would require 4x<code>MOVEs</code> or building a road.': '现在我们的 spawn 和 extension 中总共有 550 点能量。这已经足够建造一个身体部件为 <code>[WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE]</code> 的 creep 了。这个 creep 的效率是普通工作单位的 4 倍。但是这也让它变得更重，所以我们给它添加了额外的 <code>MOVE</code> 部件。但是，两个 <code>MOVE</code> 也没办法让它跑得像小 creep 那样快，除非我们给他添加 4 个 <code>MOVE</code> 或者修一条路。',
        'Building this creep took energy from all storages and completely drained them.': '孵化这个 creep 会把所有存储的能量完全耗尽。',
        'Now let’s select our creep and watch it work.': '现在，选中我们的 creep 然后看着它努力的工作（<i>译者注：没有人不喜欢看蚂蚁搬家</i>）。',
        'As you can see on the right panel, this powerful creep harvests 8 energy units per tick.\nA few such creeps can completely drain an energy source before it refills thus giving your colony a\nmaximum energy boost.': '您可以在右边的这个面板中看到，这个超强的 creep 每 tick 能采集 8 点能量。两三个这样的 creep 就可以在一个 source 恢复能量之前将其完全采干，并由此为您的殖民地带来最大化的能量收益。',
        'Hence, by upgrading your Controller, constructing new extensions and more powerful creeps, you\nconsiderably improve the effectiveness of your colony work. Also, by replacing a lot of small creeps\nwith fewer large ones, you save CPU resources on controlling them which is an important prerequisite to\nplay in the online mode.': '因此，通过升级您的 controller，建造新的 extension 和更强大的 creep，您殖民地的效率将会被极大的提升。并且，您可以用大型的 creep 代替一群小型的 creep 来减少用于操控它们的 CPU，请记住它，这在多人游戏里非常重要。',
        'In the next section, we’ll talk about how to set up the automatic manufacturing of new creeps.': '在下一小节中，我们将介绍如何建立起新 creep 的自动孵化机制。'
    };
    /**
     * 行动目标文本
     */
    const OBJECTIVE_CONTENT$2 = {
        'Spawn a creep with the body <code>[WORK,CARRY,MOVE]</code>, the name <code>Builder1</code>, and <code>{role:\'builder\'}</code>\nas its memory.': '孵化一个身体部件为 <code>[WORK,CARRY,MOVE]</code>，名字为 <code>Builder1</code>，并且内存为 <code>{role:\'builder\'}</code> 的 creep。',
        'Create the module <code>role.builder</code> with a behavior logic for a new creep.': '创建一个名为 <code>role.builder</code> 的模块，并写入新 creep 的行为逻辑。',
        'By using the module <code>role.builder</code> in the new creep, build all 5 extensions.': '通过在新 creep 上应用 <code>role.builder</code> 模块来建造全部 5 个 extension。',
        'Refine the logic in the module <code>role.harvester</code>.': '优化 <code>role.harvester</code> 模块中的逻辑。',
        'Fill all the 5 extensions and the spawn with energy.': '找到全部的 5 个 extension 以及 spawn 并填充能量。',
        'Spawn a creep with the body <code>[WORK,WORK,WORK,CARRY,MOVE,MOVE]</code>, the name <code>HarvesterBig</code>, and\n<code>harvester</code> role.': '孵化一个身体部件为 <code>[WORK,WORK,WORK,CARRY,MOVE,MOVE]</code>，名称为 <code>HarvesterBig</code> 的 creep 并且设为 <code>harvester</code> 角色。',
        'Click on the creep Harvester2.': '点击 creep Harvester2'
    };
    /**
     * 帮助文档更换
     */
    const OBJECTIVE_LINK$2 = {
        'http://docs.screeps.com/api/#StructureSpawn.spawnCreep': `${DOCUMENT_CN}/api/#StructureSpawn.spawnCreep`,
        'http://docs.screeps.com/api/#RoomObject.room': `${DOCUMENT_CN}/api/#RoomObject.room`,
        'http://docs.screeps.com/api/#Room.find': `${DOCUMENT_CN}/api/#Room.find`,
        'http://docs.screeps.com/api/#Creep.build': `${DOCUMENT_CN}/api/#Creep.build`,
        'http://docs.screeps.com/api/#Creep.say': `${DOCUMENT_CN}/api/#Creep.say`,
        'http://docs.screeps.com/api/#Game.structures': `${DOCUMENT_CN}/api/#Game.structures`,
        'http://docs.screeps.com/api/#StructureExtension': `${DOCUMENT_CN}/api/#StructureExtension`,
        'http://docs.screeps.com/api/#Room.energyAvailable': `${DOCUMENT_CN}/api/#Room.energyAvailable`
    };
    const content$8 = {
        hashs: ['#!/sim/tutorial/3'],
        content: [
            ...getBaseUIContent(),
            { 'en-US': 'Next section', 'zh-CN': '下一关', 'reuse': true },
            // 翻译所有教程文本
            {
                'selector': '.tutorial-content.ng-scope > section > p',
                'zh-CN': translateMultiple(TUTORIAL_CONTENT$2),
                'reuse': true
            },
            // 翻译所有目标文本
            ...getObjectiveTranslationContent(OBJECTIVE_CONTENT$2, OBJECTIVE_LINK$2)
        ]
    };

    /**
     * 教程正文
     */
    const TUTORIAL_CONTENT$3 = {
        'Until now, we have created new creeps directly in the console. It’s not a good idea to do it constantly since\nthe very idea of Screeps is making your colony control itself. You will do well if you teach your spawn to\nproduce creeps in the room on its own.': '到目前为止，我们都是通过在控制台中输入命令来手动创建新的 creep。我们并不推荐经常这么做，因为 Screeps 的主旨就是让您的殖民地实现自我控制。更好的做法是教会您这个房间中的 spawn 自己生产 creep。',
        'This is a rather complicated topic and many players spend months perfecting and refining their auto-spawning\ncode. But let’s try at least something simple and master some basic principles to start with.': '这是一个相当复杂的问题，许多玩家会花费几个月的时间来完善和增强他们的自动孵化代码。但是先让我们从简单开始，来了解一些相关的基本原则。',
        'You will have to create new creeps when old ones die from age or some other reasons. Since there are no\nevents in the game to report death of a particular creep, the easiest way is to just count the number of\nrequired creeps, and if it becomes less than a defined value, to start spawning.': '您需要在老的 creep 因为寿命或其他原因死掉时孵化新的 creep。由于游戏中没有事件机制来报告特定 creep 的死亡。所以最简单的方式就是通过统计每种 creep 的数量，一旦其数量低于给定值，就开始孵化。',
        'There are several ways to count the number of creeps of the required type. One of them is filtering\n<code>Game.creeps</code> with the help of the <code>_.filter</code> function and using the role in\ntheir memory. Let’s try to do that and bring the number of creeps into the console.': '有很多种方法可以统计指定类型的 creep 数量。其中一种就是通过 <code>_.filter</code> 方法以及 creep 内存中的 role 字段对 <code>Game.creeps</code> 进行筛选。让我们尝试一下，并把 creep 的数量显示在控制台中。',
        'Let’s say we want to have at least two harvesters at any time. The easiest way to achieve this is to run\n<code>StructureSpawn.spawnCreep</code> each time we discover it’s less than this number. You may not define its\nname (it will be given automatically in this case), but don’t forget to define the needed role.': '假设我们最少需要维持两个采集单位（harvester），最简单的办法就是：每当我们发现它们的数量小于这个值时，就执行 <code>StructureSpawn.spawnCreep</code> 方法。您可能还没想好它们应该叫什么（这一步我们会自动给它们起名字），但是不要忘了给他们设置需要的角色（role）。',
        'We may also add some new <code>RoomVisual</code> call in order to visualize what creep is being spawned.': '我们还会添加一些新的 <code>RoomVisual</code> 来显示当前正在孵化的 creep。',
        'Now let’s try to emulate a situation when one of our harvesters dies. You can now give the command\n<code>suicide</code> to the creep via the console or its properties panel on the right.': '现在让我们模拟一下，当一个采集单位死掉了的情况。您可以在控制台中对指定 creep 执行 <code>suicide</code> 命令，或者直接在右侧的属性面板中点击 “自杀” 按钮。',
        'As you can see from the console, after we lacked one harvester, the spawn instantly started building a new\none with a new name.': '您可以看到，当我们失去了一个采集单位后，spawn 会立刻开始孵化新的 creep，并且它还有个全新的名字。',
        'An important point here is that the memory of dead creeps is not erased but kept for later reuse.\nIf you create creeps with random names each time it may lead to memory overflow, so you should clear\nit in the beginning of each tick (prior to the creep creation code).': '还有一件事，由于死亡 creep 的内存我们之后可能会用到，所以它们并不会被自动清除。如果您每次都用随机名称去孵化新 creep 的话，内存可能会因此溢出，所以您需要在每个 tick 开始的时候将它们清除掉（creep 创建代码之前）。',
        'Now the memory of the deceased is relegated to oblivion which saves us resources.': '现在，死者的内存被回收掉了，这有助于帮助我们节省资源。',
        'Apart from creating new creeps after the death of old ones, there is another way to maintain the needed number\nof creeps: the method <code>StructureSpawn.renewCreep</code>. Creep aging is disabled in the Tutorial, so we recommend\nthat you familiarize yourself with it on your own.': '除了在老 creep 死掉之后再创建一个新的，还有其他的方法可以把 creep 的数量维持在期望值：<code>StructureSpawn.renewCreep</code> 方法。不过在本教程中 creep 的老化已经被禁用了，所以我们建议您自己尝试了解一下。'
    };
    /**
     * 行动目标文本
     */
    const OBJECTIVE_CONTENT$3 = {
        'Add the output of the number of creeps with the role <code>harvester</code> into the console.': '把 <code>harvester</code> 角色的 creep 数量显示在控制台中。',
        'Add the logic for <code>StructureSpawn.spawnCreep</code> in your main module.': '在您的 main 模块中添加 <code>StructureSpawn.spawnCreep</code> 相关逻辑。',
        'Make one of the harvesters suicide.': '让某个采集单位自杀。',
        'Add code to clear the memory.': '添加清理内存的代码。'
    };
    /**
     * 帮助文档更换
     */
    const OBJECTIVE_LINK$3 = {
        'http://docs.screeps.com/api/#Game.creeps': `${DOCUMENT_CN}/api/#Game.creeps`,
        'http://docs.screeps.com/api/#StructureSpawn.spawnCreep': `${DOCUMENT_CN}/api/#StructureSpawn.spawnCreep`,
        'http://docs.screeps.com/api/#RoomVisual': `${DOCUMENT_CN}/api/#RoomVisual`,
        'http://docs.screeps.com/api/#Creep.suicide': `${DOCUMENT_CN}/api/#Creep.suicide`,
        'http://docs.screeps.com/api/#StructureSpawn.renewCreep': `${DOCUMENT_CN}/api/#StructureSpawn.renewCreep`
    };
    const content$9 = {
        hashs: ['#!/sim/tutorial/4'],
        content: [
            ...getBaseUIContent(),
            { 'en-US': 'Next section', 'zh-CN': '下一关', 'reuse': true },
            // 翻译所有教程文本
            {
                'selector': '.tutorial-content.ng-scope > section > p',
                'zh-CN': translateMultiple(TUTORIAL_CONTENT$3),
                'reuse': true
            },
            // 翻译所有目标文本
            ...getObjectiveTranslationContent(OBJECTIVE_CONTENT$3, OBJECTIVE_LINK$3)
        ]
    };

    /**
     * 教程正文
     */
    const TUTORIAL_CONTENT$4 = {
        'The world of Screeps is not the safest place. Other players may have claims on your territory.\nBesides, your room may be raided by neutral NPC creeps occasionally. So you ought to think about your\ncolony defense in order to develop it successfully.': 'Screeps 的世界并不安全。其他玩家可能想要占领您的领土。此外，您的房间也会偶尔遭到中立 NPC creep 的袭击。所以，您需要好好考虑下殖民地的防御，这样您才能更加安全的发展自己。',
        'This hostile creep has come from the left entry and attacked your colony. It’s good that we have walls to\nrestrain it temporarily. But they will fall sooner or later, so we need to deal with the problem.': '敌方 creep 从房间左边的入口入侵并袭击了您的殖民地。由于我们有墙壁可以暂时抵挡它的进攻，所以目前问题不大。但是墙壁迟早会被打穿，所以我们需要尽快解决这个问题。',
        'The surest way to fend off an attack is using the room <strong>Safe Mode</strong>.\nIn safe mode, no other creep will be able to use any harmful methods in the room (but you’ll still be able to defend against strangers).': '抵御进攻最可靠的方法就是使用房间的 <strong>安全模式</strong>（Safe Mode）。在安全模式中，房间中任何非己方 creep 都无法执行任何有害的操作（但是您依旧可以进行反抗。）',
        'The safe mode is activated via the room controller which should have activations available to use.\nLet’s spend one activation to turn it on in our room.': '安全模式是通过房间控制器（controller）激活的，不过首先我们要有可用的激活次数。现在让我们在房间中启动安全模式。',
        'As you can see, the enemy creep stopped attacking the wall – its harmful methods are blocked.\nWe recommend that you activate safe mode when your defenses fail.': '如您所见，敌方 creep 已经不再进攻墙壁了 - 它的有害操作被阻止了。我们建议您在房间的防御失效时再激活安全模式。',
        'Now let’s cleanse the room from unwanted guests.': '现在，让我们把这些不速之客清理掉。',
        'Towers are the easiest way to actively defend a room. They use energy and can be targeted at any creep in a room\nto attack or heal it. The effect depends on the distance between the tower and the target.': '防御塔（tower）是防御房间最简单直接的手段。它们可以消耗能量来治疗或攻击房间中的任何 creep。治疗/攻击效果取决于 tower 和目标之间的直线距离。',
        'To start with, let’s lay a foundation for our new tower. You can set any place you wish inside the walls\nand place the construction site there with the help of the button “Construct” on the upper panel.': '首先，让我们给新 tower 打好地基。您可以在墙壁之内的任何位置放置 tower 的工地，通过顶部面板中的 “建造” 按钮找到它。',
        'The creep Builder1 has immediately started the construction. Let’s wait until it finishes.': 'creep Builder1 立刻反应过来并开始了建造。现在让我们等它造好。',
        'A tower uses energy, so let’s set the harvester role to bring energy to the tower along with other structures.\nTo do this, you need to add the constant <code>STRUCTURE_TOWER</code> to the filter of structures your\nharvester is aimed at.': 'tower 需要能量，所以让我们改造一下 harvester 角色，让其可以把能量带到 tower 和其他建筑中。想要实现这个功能，您需要将 <code>STRUCTURE_TOWER</code> 常量添加到用于筛选您采集单位目标的 filter 中。',
        'Excellent, your tower is ready to use!': '棒极了，您的 tower 已经准备就绪了！',
        'Like a creep, a tower has several similar methods: <code>attack</code>, <code>heal</code>, and\n<code>repair</code>. Each action spends 10 energy units. We need to use <code>attack</code> on the closest\nenemy creep upon its discovery. Remember that distance is vital: the effect can be several times stronger\nwith the same energy cost!': '就像 creep 一样，tower 也有几个类似的方法：<code>attack</code> - 攻击，<code>heal</code> - 治疗，以及 <code>repair</code> - 维修。每个操作都会消耗 10 点能量。一旦发现了敌人，我们就需要使用 <code>attack</code> 方法攻击距离最近的敌方 creep。请记住，距离非常重要：在相同的能量消耗下，操作带来的效果可能会有好几倍的差距。',
        'To get the tower object directly you can use its ID from the right panel and the method <code>Game.getObjectById</code>.': '想要获取 tower 的对象，您可以使用它的 ID（右侧面板中）以及 <code>Game.getObjectById</code> 方法。',
        'The enemy creep is eliminated and our colony can breathe easy. However, the invader has damaged some walls during the brief\nattack. You’d better set up auto-repair.': '敌方 creep 被消灭，我们终于可以松口气了。但是，在刚才短暂的袭击中，入侵者还是对一些墙壁造成了伤害。您最好设置一下自动维修机制。',
        'Damaged structures can be repaired by both creeps and towers. Let’s try to use a tower for that.\nWe’ll need the method <code>repair</code>. You will also need the method <code>Room.find</code> and a filter to locate the damaged walls.': 'creep 和 tower 都可以修复受损的建筑，这次让我们用 tower 来试一下。使用 <code>repair</code> 方法可以完成这个任务。除此之外，您还需要使用 <code>Room.find</code> 方法和一个 filter 去筛选除那些受损的墙壁（wall）。',
        'Note that since walls don’t belong to any player, finding them requires the constant <code>FIND_STRUCTURES</code>\nrather than <code>FIND_MY_STRUCTURES</code>.': '请注意，由于墙壁不属于任何玩家，所以我们需要使用 <code>FIND_STRUCTURES</code> 常量进行搜索而不是 <code>FIND_MY_STRUCTURES</code>。',
        'All the damage from the attack has been repaired!': '所有在袭击中受损的建筑都被修好了！',
        'Congratulations, you have completed the Tutorial! Now you have enough knowledge and code to start playing in\nthe online mode. Choose your room, found a colony, and set out on your own quest for domination in the\nworld of Screeps!': '恭喜，您已经完成了全部的教程！现在您已经有足够的知识和代码可以在线上模式中游玩了。挑选您的房间，建立殖民地，然后按照您的意愿在 Screeps 的世界中建立统治！',
        'If you want to delve deeper in the subtleties of the game or have any questions, please feel free to refer to:': '如果您想更深入的了解游戏或者有任何疑问，请随时参考：'
    };
    /**
     * 行动目标文本
     */
    const OBJECTIVE_CONTENT$4 = {
        'Defending your room': '防御您的房间',
        'Activate safe mode.': '激活安全模式。',
        'Place the construction site for the tower (manually or using the code below).': '放置 Tower 的工地（手动或使用下面的代码）。',
        'Add <code>STRUCTURE_TOWER</code> to the module <code>role.harvester</code> and wait for the energy to appear in the tower.': '在 <code>role.harvester</code> 模块中添加 <code>STRUCTURE_TOWER</code>，然后等待能量运送到 tower 中。',
        'Destroy the enemy creep with the help of the tower.': '使用 tower 消灭敌方 creep。',
        'Repair all the damaged walls.': '修复所有受损的墙壁（wall）。'
    };
    /**
     * 帮助文档更换
     */
    const OBJECTIVE_LINK$4 = {
        'http://docs.screeps.com/defense.html': `${DOCUMENT_CN}/defense.html`,
        'http://docs.screeps.com/api/#StructureController.activateSafeMode': `${DOCUMENT_CN}/api/#StructureController.activateSafeMode`,
        'http://docs.screeps.com/api/#StructureTower': `${DOCUMENT_CN}/api/#StructureTower`,
        'http://docs.screeps.com/api/#Room.createConstructionSite': `${DOCUMENT_CN}/api/#Room.createConstructionSite`,
        'http://docs.screeps.com/api/#Game.getObjectById': `${DOCUMENT_CN}/api/#Game.getObjectById`,
        'http://docs.screeps.com/api/#RoomObject.pos': `${DOCUMENT_CN}/api/#RoomObject.pos`,
        'http://docs.screeps.com/api/#RoomPosition.findClosestByRange': `${DOCUMENT_CN}/api/#RoomPosition.findClosestByRange`,
        'http://docs.screeps.com/api/#StructureTower.attack': `${DOCUMENT_CN}/api/#StructureTower.attack`,
        'http://docs.screeps.com/api/#Room.find': `${DOCUMENT_CN}/api/#Room.find`,
        'http://docs.screeps.com/api/#StructureTower.repair': `${DOCUMENT_CN}/api/#StructureTower.repair`
    };
    const content$a = {
        hashs: ['#!/sim/tutorial/5'],
        content: [
            ...getBaseUIContent(),
            { 'en-US': 'Slack chat', 'zh-CN': 'Slack 聊天', 'reuse': true },
            { 'en-US': 'Finish', 'zh-CN': '完成', 'reuse': true },
            // 翻译所有教程文本
            {
                'selector': '.tutorial-content.ng-scope > section > p',
                'zh-CN': translateMultiple(TUTORIAL_CONTENT$4),
                'reuse': true
            },
            // 翻译所有目标文本
            ...getObjectiveTranslationContent(OBJECTIVE_CONTENT$4, OBJECTIVE_LINK$4)
        ]
    };

    var tutorial = [content$5, content$6, content$7, content$8, content$9, content$a];

    /**
     * 生成一个用于替换类名的翻译内容
     *
     * @param selector 要替换的 html 元素的选择器
     * @param oldClass 要替换的旧类名
     * @param newClass 要替换成的新类名
     */
    const changeElementClassName = function (selector, oldClass, newClass) {
        return {
            selector,
            'zh-CN': (el) => {
                el.className = el.className.replace(oldClass, newClass);
            },
            'reuse': true
        };
    };
    const content$b = {
        hashs: ['#!/overview/power'],
        content: [
            // 无 Power Creep 时
            { 'en-US': 'You have no Power Creeps yet.', 'zh-CN': '您还没有 Power Creeps' },
            { 'en-US': 'You need 1 free Power Level in your account to create a new Power Creep.', 'zh-CN': '需要一个您账号内空余的超能等级来创建一个新的 Power Creep' },
            { 'en-US': 'Upgrade', 'zh-CN': '升级' },
            { 'en-US': 'Back', 'zh-CN': '返回', 'reuse': true },
            { 'en-US': 'Create creep', 'zh-CN': '创建 creep' },
            { 'en-US': 'Learn more', 'zh-CN': '了解更多' },
            { 'en-US': 'Global Power Level:', 'zh-CN': '全局超能等级：', 'reuse': true },
            { 'en-US': '.', 'zh-CN': '。', 'reuse': true },
            { 'en-US': 'Required creep level:', 'zh-CN': 'creep 等级需求：', 'reuse': true },
            { 'en-US': 'Required level', 'zh-CN': '等级需求', 'reuse': true },
            // 有 Power Creep 时
            { 'en-US': 'Back to Overview', 'zh-CN': '返回总览', 'reuse': true },
            {
                'en-US': /You have \d+ experimentation periods left/,
                'zh-CN': (text) => text.replace('You have', '您还剩余').replace('experimentation periods left', '个实验期')
            },
            { 'en-US': 'Collapse all', 'zh-CN': '收起所有', 'reuse': true },
            { 'en-US': 'Expand all', 'zh-CN': '展开所有', 'reuse': true },
            { 'en-US': 'Create new creep', 'zh-CN': '创建新的 creep' },
            { 'en-US': 'not spawned', 'zh-CN': '未孵化', 'reuse': true },
            {
                'en-US': /lvl \d/,
                'zh-CN': (text) => text.replace('lvl', '等级 '),
                'reuse': true
            },
            // pc技能
            // 通用
            {
                'en-US': /Consumes \d+ ops resource units./,
                'zh-CN': (text) => text.replace('Consumes', '消耗 ').replace('ops resource units.', '点 ops 资源。'),
                'reuse': true
            },
            {
                'en-US': /Cooldown \d+ ticks./,
                'zh-CN': (text) => text.replace('Cooldown', '冷却').replace('ticks.', 'tick。'),
                'reuse': true
            },
            {
                'en-US': /Effect duration \d+ ticks./,
                'zh-CN': (text) => text.replace('Effect duration', '效果持续').replace('ticks.', 'tick。'),
                'reuse': true
            },
            {
                'en-US': /Range \d+ squares./,
                'zh-CN': (text) => text.replace('Range', '距离').replace('squares.', '格。'),
                'reuse': true
            },
            // GENERATE_OPS
            { 'en-US': 'Generate', 'zh-CN': '生产 ', 'reuse': true },
            { 'en-US': 'Consumes', 'zh-CN': '消耗', 'reuse': true },
            { 'en-US': 'ops resource units.', 'zh-CN': ' 单位的 ops。', 'reuse': true },
            // OPERATE_SPAWN
            { 'en-US': 'Reduce spawn time by', 'zh-CN': '减少孵化时间 ', 'reuse': true },
            // OPERATE_EXTENSION
            { 'en-US': 'Instantly fill', 'zh-CN': '使用目标（container, storage, terminal）内的能量立即充满房间内 ', 'reuse': true },
            { 'en-US': 'of all extensions in the room using energy from the target structure (container, storage, or terminal).', 'zh-CN': ' 的 extension。', 'reuse': true },
            { 'en-US': 'Cooldown 50 ticks.', 'zh-CN': ' 冷却 50 ticks。 ', 'reuse': true },
            // OPERATE_TOWER
            { 'en-US': 'Increase damage, repair and heal amount by', 'zh-CN': '提升 tower 的伤害、修复与治疗效果 ', 'reuse': true },
            // OPERATE_STORAGE
            { 'en-US': 'Increase capacity by', 'zh-CN': '提高 storage 的容量 ', 'reuse': true },
            { 'en-US': 'units.', 'zh-CN': ' 点。', 'reuse': true },
            // OPERATE_LAB
            { 'en-US': 'Increase reaction amount by', 'zh-CN': '提高 lab 的反应产物数量 ', 'reuse': true },
            // OPERATE_OBSERVER
            { 'en-US': 'Grant unlimited range.', 'zh-CN': '给予无限制的观察范围。', 'reuse': true },
            { 'en-US': 'Effect duration', 'zh-CN': '效果持续 ', 'reuse': true },
            { 'en-US': 'ticks.', 'zh-CN': ' tick。', 'reuse': true },
            // OPERATE_TERMINAL
            { 'en-US': 'Decrease transfer energy cost and cooldown by', 'zh-CN': '降低传送所需能量以及冷却 ', 'reuse': true },
            // DISRUPT_SPAWN
            { 'en-US': 'Pause spawning process.', 'zh-CN': '暂停孵化进程。', 'reuse': true },
            // DISRUPT_TOWER
            { 'en-US': 'Reduce effectiveness by', 'zh-CN': '减少 tower 效果', 'reuse': true },
            // DISRUPT_SOURCE
            { 'en-US': 'Pause energy regeneration.', 'zh-CN': '暂停 source 能量重生。', 'reuse': true },
            // SHIELD
            {
                'en-US': 'Create a temporary non-repairable rampart structure on the same square with',
                'zh-CN': '在相同位置上创造一个临时的、不可修复的 rampart，其血量为 ',
                'reuse': true
            },
            {
                'en-US': 'hits.\nCannot be used on top of another rampart.',
                'zh-CN': '点。已经位于 rampart 中时无法使用。',
                'reuse': true
            },
            // FORTIFY
            {
                'en-US': 'Make a wall or rampart tile invulnerable to all creep attacks and powers.',
                'zh-CN': '使一个 wall 或者 rampart 免疫所有来自 creep 的攻击和超能效果。',
                'reuse': true
            },
            // OPERATE_FACTORY
            {
                'en-US': 'Set the level of the factory to the level of the power. This action is permanent, it cannot be undone, and another power level cannot be applied. Apply the same power again to renew its effect.',
                'zh-CN': '将 factory 的等级设置为该超能的等级。该操作是永久性的，无法撤销，并且无法用其他等级的同类超能进行覆盖。施加相同等级的超能来重新激活该效果。',
                'reuse': true
            },
            // REGEN_SOURCE
            { 'en-US': 'Regenerate', 'zh-CN': '重新生成 ', 'reuse': true },
            { 'en-US': 'energy units in a source every 15 ticks.', 'zh-CN': ' 点能量于 source 中 / 每 15 tick。', 'reuse': true },
            // REGEN_MINERAL
            { 'en-US': 'mineral units in a deposit every 10 ticks.', 'zh-CN': ' 点矿物于 mineral 中 / 每 10 tick。', 'reuse': true },
            // OPERATE_POWER
            { 'en-US': 'Increase power processing speed of a Power Spawn by', 'zh-CN': '提高 PowerSpawn 的单次 power 处理速率', 'reuse': true },
            { 'en-US': 'units per tick.', 'zh-CN': ' 点每 tick。', 'reuse': true },
            // DISRUPT_TERMINAL
            { 'en-US': 'Block withdrawing resources from the terminal.', 'zh-CN': '阻止从 terminal 中取出资源。', 'reuse': true },
            // OPERATE_CONTROLLER
            {
                'en-US': 'Increase max limit of energy that can be used for upgrading a Level 8 Controller each tick by',
                'zh-CN': '增加 8 级 controller 的每 tick 能量升级上限 ',
                'reuse': true
            },
            { 'en-US': 'energy units.', 'zh-CN': ' 点。', 'reuse': true },
            // 翻译血量、容量以及升级按钮，这些文本都是放在 ::before 伪类的 content 里的
            changeElementClassName('.creep-char--ca', 'creep-char--ca', 'creep-char--ca-cn'),
            changeElementClassName('.creep-char--xp', 'creep-char--xp', 'creep-char--xp-cn'),
            changeElementClassName('._actions > ._upgrade', '_upgrade', '_upgrade-cn'),
            {
                'en-US': 'You cannot delete a Power Creep which is spawned in the world',
                'zh-CN': '您不能删除一个已经孵化的 Power Creep',
                'reuse': true
            },
            { 'en-US': 'Ok', 'zh-CN': '确定', 'reuse': true },
            { 'en-US': 'Activate', 'zh-CN': '激活', 'reuse': true },
            { 'en-US': 'Cancel', 'zh-CN': '取消', 'reuse': true },
            { 'en-US': 'Enter creep name', 'zh-CN': '输入 creep 名称', 'reuse': true },
            { 'en-US': 'Required Field', 'zh-CN': '必填内容', 'reuse': true },
            { 'en-US': 'This action cannot be undone without deleting the creep.', 'zh-CN': '该操作将无法撤销，除非直接删除该 creep。', 'reuse': true },
            { 'en-US': 'Do you want to proceed and use', 'zh-CN': '您确定要使用 ', 'reuse': true },
            { 'en-US': 'for this creep?', 'zh-CN': ' 为该 creep 提升等级么？', 'reuse': true },
            {
                'en-US': 'You can activate a 24-hour experimentation period to work on your Power Creeps builds without losing levels.                 During an experimentation period:',
                'zh-CN': '通过激活一个 24 小时的实验期，您可以在不消耗 GPL 等级的情况下创建一个新的 Power Creep。在实验期间：',
                'reuse': true
            },
            {
                'en-US': 'Power Creeps are deleted immediately without delay.',
                'zh-CN': 'Power Creep 可以被立刻删除，而不会启动删除倒计时。',
                'reuse': true
            },
            {
                'en-US': 'You don\'t lose Global Power Levels when you delete a Power Creep.',
                'zh-CN': '删除 Power Creep 时不会损失 GPL 等级。',
                'reuse': true
            },
            {
                'en-US': /You have \d+ periods left. Would you like to activate it?/,
                'zh-CN': (text) => text.replace('You have', '您还有 ').replace('periods left. Would you like to activate it?', ' 个试用期，您确定要激活一个么？'),
                'reuse': true
            },
            {
                'en-US': 'Experimentation period active:',
                'zh-CN': '实验期已激活，剩余时间：',
                'reuse': true
            }
        ]
    };
    // 由于 pc 的血量、容量和升级按钮的文本都是放在 ::before 里的，所以这里需要伪造一个新的 ::before 来替换内容
    // 升级按钮也用 before 就 nm 离谱
    const style = document.createElement('style');
    style.innerHTML = `
.creep-char--ca-cn::before {
    content: '容量';
    color: #4B4B4B;
    margin-right: 3px;
    display: inline-block;
}
.creep-char--xp-cn::before {
    content: '血量';
    color: #4B4B4B;
    margin-right: 3px;
    display: inline-block;
}
._upgrade-cn {
    display: inline-flex;
    justify-content: center;
    height: 21px;
    width: 62px;
    border: 1px solid rgba(89, 115, 255, 0.4);
    border-radius: 10.5px;
    cursor: pointer;
    color: #5973ff;
    transition: all .3s ease;
}
._upgrade-cn::before {
    content: '升级';
    position: relative;
    top: 1px;
    font-size: 11px;
}
`;
    document.querySelector('head').appendChild(style);

    const content$c = {
        hashs: ['#!/market/all', '#!/market/my', '#!/market/history'],
        content: [
            // 市场 header 部分
            { 'en-US': 'Market allows to automatically trade resources with other players.', 'zh-CN': '市场允许您和其他玩家自动交易资源。' },
            { 'en-US': 'Learn more', 'zh-CN': '了解更多' },
            { 'en-US': 'All orders', 'zh-CN': '全部订单' },
            { 'en-US': 'My orders', 'zh-CN': '我的订单' },
            { 'en-US': 'History', 'zh-CN': '订单历史' },
            // 无订单时的翻译
            { 'en-US': 'You have no orders', 'zh-CN': '你还没有订单', 'reuse': true },
            { 'en-US': 'Create an order using the', 'zh-CN': '创建订单请参考', 'reuse': true },
            { 'en-US': 'Market API.', 'zh-CN': '市场API', 'reuse': true }
        ]
    };

    const content$d = {
        hashs: ['#!/market/all'],
        content: [
            // 市场->全部订单
            { 'en-US': 'Raw resources', 'zh-CN': '原始资源' },
            { 'en-US': 'Factory production', 'zh-CN': '工厂产物' },
            { 'en-US': 'Lab production', 'zh-CN': '实验室产物' },
            // 订单明细
            { 'en-US': 'Refresh', 'zh-CN': '刷新' },
            { 'en-US': 'Target room:', 'zh-CN': '目标房间' },
            { 'en-US': 'Selling', 'zh-CN': '出售中' },
            { 'en-US': 'Buying', 'zh-CN': '求购中' },
            { 'en-US': 'Order ID', 'zh-CN': '订单标识', 'reuse': true },
            { 'en-US': 'Price', 'zh-CN': '单价', 'reuse': true },
            { 'en-US': 'Available', 'zh-CN': '可用', 'reuse': true },
            { 'en-US': 'Remaining', 'zh-CN': '剩余', 'reuse': true },
            { 'en-US': 'Total', 'zh-CN': '总量', 'reuse': true },
            { 'en-US': 'Room', 'zh-CN': '房间', 'reuse': true },
            { 'en-US': 'Range', 'zh-CN': '范围', 'reuse': true },
            { 'en-US': 'Price history', 'zh-CN': '历史单价' },
            { 'en-US': 'Date', 'zh-CN': '日期' },
            { 'en-US': 'Transactions', 'zh-CN': '交易次数' },
            { 'en-US': 'Total volume', 'zh-CN': '总成交量' },
            { 'en-US': 'Price (avg ± stddev)', 'zh-CN': '单价 (均价 ± 标准差)' },
            // 翻译订单
            {
                'selector': '#mat-dialog-0 > app-dlg-resource-orders > header:nth-child(6) > div:nth-child(1) > span',
                'zh-CN': (el) => {
                    el.innerHTML = el.innerHTML.replace('orders', '个订单');
                }
            },
            {
                'selector': '#mat-dialog-0 > app-dlg-resource-orders > header:nth-child(8) > div > span',
                'zh-CN': (el) => {
                    el.innerHTML = el.innerHTML.replace('orders', '个订单');
                }
            }
        ]
    };

    const content$e = {
        hashs: ['#!/market/my'],
        content: [
            // 市场->我的订单
            { 'en-US': 'Refresh', 'zh-CN': '刷新' },
            { 'en-US': 'Order ID', 'zh-CN': '订单标识' },
            { 'en-US': 'Type', 'zh-CN': '类型' },
            { 'en-US': 'Active', 'zh-CN': '激活' },
            { 'en-US': 'Price', 'zh-CN': '单价' },
            { 'en-US': 'Available', 'zh-CN': '可用' },
            { 'en-US': 'Remaining', 'zh-CN': '剩余' },
            { 'en-US': 'Total', 'zh-CN': '总量' },
            { 'en-US': 'Room', 'zh-CN': '房间' },
            { 'en-US': 'Expires in', 'zh-CN': '过期于' }
        ]
    };

    const content$f = {
        hashs: ['#!/market/history'],
        content: [
            // 市场->订单历史
            // 表头
            { 'en-US': 'Expand all', 'zh-CN': '展开全部' },
            { 'en-US': 'Refresh', 'zh-CN': '刷新' },
            { 'en-US': 'Date', 'zh-CN': '成交时间', 'reuse': true },
            { 'en-US': 'Shard', 'zh-CN': '位面', 'reuse': true },
            { 'en-US': 'Tick', 'zh-CN': '时刻', 'reuse': true },
            { 'en-US': 'Change', 'zh-CN': '成交金额', 'reuse': true },
            { 'en-US': 'Balance', 'zh-CN': '余额', 'reuse': true },
            { 'en-US': 'Description', 'zh-CN': '描述', 'reuse': true },
            // 明细
            { 'en-US': 'Resources', 'zh-CN': '资源', 'reuse': true },
            { 'en-US': 'Owner', 'zh-CN': '订单发起人', 'reuse': true },
            { 'en-US': 'Dealer', 'zh-CN': '成交人', 'reuse': true },
            { 'en-US': 'Fee type', 'zh-CN': '费用类型', 'reuse': true },
            { 'en-US': 'Add amount', 'zh-CN': '订单量增加', 'reuse': true },
            { 'en-US': 'Order ID', 'zh-CN': '订单标识', 'reuse': true },
            { 'en-US': 'Price', 'zh-CN': '单价', 'reuse': true },
            // 费用类型
            { 'en-US': 'Extend order', 'zh-CN': '扩充订单', 'reuse': true },
            { 'en-US': 'Change price', 'zh-CN': '变更单价', 'reuse': true },
            // 描述类
            { 'en-US': 'Market fee', 'zh-CN': '市场费用', 'reuse': true },
            {
                'en-US': 'Resources sold via market order',
                'zh-CN': '通过市场订单卖出资源',
                'reuse': true
            },
            {
                'en-US': 'Resources bought via market order',
                'zh-CN': '通过市场订单买入资源',
                'reuse': true
            },
            // 历史为空
            { 'en-US': 'You have no orders', 'zh-CN': '您还没有订单' },
            { 'en-US': 'Create an order using the', 'zh-CN': '若要创建订单请使用' },
            { 'en-US': 'Market API', 'zh-CN': '市场API' },
            // 页尾
            { 'en-US': 'Newer', 'zh-CN': '更新的记录' },
            { 'en-US': 'Older', 'zh-CN': '更早的记录' }
        ]
    };

    var market = [content$c, content$d, content$e, content$f];

    const content$g = {
        hashs: ['#!/inventory'],
        content: [
            // 介绍
            {
                'en-US': 'This section contains ephemeral resources that are stored directly in your account.',
                'zh-CN': '这里展示了直接存储在您帐户中的临时资源。',
                'reuse': true
            },
            // 装饰状态
            { 'en-US': 'Activate', 'zh-CN': '启用', 'reuse': true },
            { 'en-US': 'Active', 'zh-CN': '启用', 'reuse': true },
            { 'en-US': 'Global active', 'zh-CN': '全局启用', 'reuse': true },
            { 'en-US': 'Not active', 'zh-CN': '未启用', 'reuse': true },
            // 全局通用
            { 'en-US': 'All', 'zh-CN': '全部', 'reuse': true },
            { 'en-US': 'Ok', 'zh-CN': '好的', 'reuse': true },
            // 类型选择框
            { 'en-US': 'Type', 'zh-CN': '类别', 'reuse': true },
            { 'en-US': 'Badge', 'zh-CN': '徽章', 'reuse': true },
            { 'en-US': 'Creep', 'zh-CN': 'creep皮肤', 'reuse': true },
            { 'en-US': 'Graffiti', 'zh-CN': '涂鸦', 'reuse': true },
            { 'en-US': 'Wall texture', 'zh-CN': '墙壁材质', 'reuse': true },
            { 'en-US': 'Floor texture', 'zh-CN': '地面材质', 'reuse': true },
            // 主题选择框
            { 'en-US': 'Theme', 'zh-CN': '主题', 'reuse': true },
            { 'en-US': 'Nature', 'zh-CN': '自然', 'reuse': true },
            { 'en-US': 'Winter', 'zh-CN': '凛冬', 'reuse': true },
            { 'en-US': 'Alien', 'zh-CN': '异域', 'reuse': true },
            { 'en-US': 'Sea', 'zh-CN': '海洋', 'reuse': true },
            { 'en-US': 'Fire', 'zh-CN': '火热', 'reuse': true },
            { 'en-US': 'Desert', 'zh-CN': '沙漠', 'reuse': true },
            { 'en-US': 'Mono', 'zh-CN': '独行', 'reuse': true },
            { 'en-US': 'Custom Color', 'zh-CN': '自定义颜色', 'reuse': true },
            // 排序选择框
            { 'en-US': 'Sort', 'zh-CN': '排序', 'reuse': true },
            { 'en-US': 'New to old', 'zh-CN': '获取时间从早到晚', 'reuse': true },
            { 'en-US': 'Old to new', 'zh-CN': '获取时间从晚到早', 'reuse': true },
            { 'en-US': 'Rare to common', 'zh-CN': '品质从稀有到常见', 'reuse': true },
            { 'en-US': 'Common to rare', 'zh-CN': '品质从常见到稀有', 'reuse': true },
            { 'en-US': 'Rooms', 'zh-CN': '按激活状态', 'reuse': true },
            // 目标房间
            { 'en-US': 'Target room:', 'zh-CN': '目标房间:', 'reuse': true },
            // 中央抽奖区域
            {
                'en-US': 'Pixelization is available',
                'zh-CN': '使用 pixel 来抽取装饰物',
                'reuse': true
            },
            { 'en-US': 'You need', 'zh-CN': '您需要\u00A0', 'reuse': true },
            { 'en-US': 'to pixelize one decoration.', 'zh-CN': '\u00A0来抽取装饰物', 'reuse': true },
            {
                'en-US': 'Only decorations from this set will be pixelized, but the cost will be higher.',
                'zh-CN': '只有限定主题的装饰物会被抽到，但是价格会更高。',
                'reuse': true
            },
            { 'en-US': 'Restrict by theme', 'zh-CN': '限定主题', 'reuse': true },
            { 'en-US': 'How to get pixels?', 'zh-CN': '如何获取 pixel?', 'reuse': true },
            { 'en-US': 'Pixelization progress', 'zh-CN': 'pixel 收集进度', 'reuse': true },
            // 侧边栏 Steam 交互相关
            { 'en-US': 'error connecting to Steam', 'zh-CN': '连接至 Steam 时发生错误', 'reuse': true },
            { 'en-US': 'Drag to Transfer to Steam', 'zh-CN': '拖拽物品转移到 Steam 库存', 'reuse': true },
            {
                'en-US': 'Dragged decorations will be deactivated.',
                'zh-CN': '被拖拽的物品将会变为未启用状态',
                'reuse': true
            },
            { 'en-US': 'Transfer to Steam', 'zh-CN': '转移到 Steam 库存', 'reuse': true },
            { 'en-US': 'Convert to pixels', 'zh-CN': '分解为 pixel', 'reuse': true },
            { 'en-US': 'Convert to Pixels', 'zh-CN': '分解为 pixel', 'reuse': true },
            { 'en-US': 'Are you sure you want to convert decoration(s) back to pixels?', 'zh-CN': '确定要将装饰物们分解为pixel吗？', 'reuse': true },
            { 'en-US': 'You', 'zh-CN': '你', 'reuse': true },
            { 'en-US': 'can not', 'zh-CN': '将不能', 'reuse': true },
            { 'en-US': 'use decoration in the future.', 'zh-CN': '继续使用此装饰物', 'reuse': true },
            { 'en-US': 'Steam inventory', 'zh-CN': 'Steam 库存', 'reuse': true },
            {
                'en-US': 'Steam Community Market',
                'zh-CN': 'Steam 社区市场',
                'reuse': true
            },
            {
                'en-US': 'Taking from Steam...',
                'zh-CN': '正在从 Steam 库存获取...',
                'reuse': true
            },
            {
                'en-US': 'Transfering to Steam...',
                'zh-CN': '正在转移至 Steam 库存...',
                'reuse': true
            },
            // 分解
            { 'en-US': 'Convert', 'zh-CN': '分解', 'reuse': true },
            {
                'en-US': 'These decorations will be converted back to',
                'zh-CN': '这些装饰物将会分解为',
                'reuse': true
            },
            {
                'en-US': 'This decoration will be converted back to',
                'zh-CN': '这个装饰物将会分解为',
                'reuse': true
            },
            { 'en-US': 'This action', 'zh-CN': '这个操作', 'reuse': true },
            { 'en-US': 'can not be undone', 'zh-CN': '不能被撤销', 'reuse': true },
            {
                'en-US': '. Your decorations will be lost.',
                'zh-CN': '。您的装饰物会消失。',
                'reuse': true
            },
            {
                'en-US': '. Your decoration will be lost.',
                'zh-CN': '。您的装饰物会消失。',
                'reuse': true
            },
            {
                'en-US': 'Decoration successfully converted.',
                'zh-CN': '装饰物分解成功',
                'reuse': true
            },
            {
                'en-US': 'Decorations successfully converted.',
                'zh-CN': '装饰物分解成功',
                'reuse': true
            },
            { 'en-US': 'You got', 'zh-CN': '您获得了', 'reuse': true },
            {
                'en-US': 'Congratulations! You have pixelized new decorations!',
                'zh-CN': '恭喜！您抽到了新的装饰物！',
                'reuse': true
            },
            // 底边栏
            { 'en-US': 'Select all', 'zh-CN': '全选', 'reuse': true },
            {
                'en-US': 'Are you sure you want to deactivate decoration(s)?',
                'zh-CN': '确定要停用勾选的装饰吗?',
                'reuse': true
            },
            {
                'en-US': 'They will be saved in your account and can be reactivated in the future.',
                'zh-CN': '这些装饰将会继续存储在您的账户中，您可以之后再启用他们。',
                'reuse': true
            },
            { 'en-US': 'Deactivate', 'zh-CN': '停用', 'reuse': true },
            { 'en-US': 'Cancel', 'zh-CN': '取消', 'reuse': true },
            // 这里暂时放弃显示选中了多少个内容
            { 'en-US': /Unselect \(\d+\)/, 'zh-CN': () => '取消选中', 'reuse': true },
            // {
            //     'selector': 'button.btn.btn--transparent',
            //     'zh-CN': (el: HTMLElement) => {
            //         el.innerHTML = el.innerHTML.replace('Unselect', '撤销选择')
            //     },
            //     'protect': true,
            //     'reuse': true
            // },
            // 明细
            // 皮肤明细
            {
                'en-US': 'You can use this image to decorate your creeps.',
                'zh-CN': '您可以用此物品来装饰您的 creep。',
                'reuse': true
            },
            { 'en-US': 'Name Filter', 'zh-CN': '名称过滤器', 'reuse': true },
            {
                'en-US': 'You can enter multiple filters.',
                'zh-CN': '您可以输入多个过滤器',
                'reuse': true
            },
            { 'en-US': 'Exclude', 'zh-CN': '除外', 'reuse': true },
            { 'en-US': 'Alpha', 'zh-CN': '透明度', 'reuse': true },
            { 'en-US': 'Brightness', 'zh-CN': '亮度', 'reuse': true },
            { 'en-US': 'Convert back to', 'zh-CN': '分解为 ', 'reuse': true },
            { 'en-US': 'Back edit', 'zh-CN': '返回编辑', 'reuse': true },
            { 'en-US': 'Decoration activated', 'zh-CN': '装饰已启用', 'reuse': true },
            { 'en-US': 'Activate now', 'zh-CN': '立刻启用', 'reuse': true },
            { 'en-US': 'Got it', 'zh-CN': '好的', 'reuse': true },
            // {
            //     'selector': 'p.ng-star-inserted > div',
            //     'zh-CN': (el: HTMLElement) => {
            //         el.innerHTML = el.innerHTML.replace('Decoration', '装饰')
            //         el.innerHTML = el.innerHTML.replace('activated.', '已启用')
            //     }
            // },
            {
                'en-US': 'You can convert it back to',
                'zh-CN': '您可以在停用之后把它分解为 ',
                'reuse': true
            },
            { 'en-US': 'after deactivation', 'zh-CN': '', 'reuse': true },
            // 涂鸦明细
            {
                'en-US': 'You can place this image as a graffiti on walls.',
                'zh-CN': '您可以将涂鸦放置在墙面上。',
                'reuse': true
            },
            {
                'en-US': 'Adjustable brightness and lighting animation.',
                'zh-CN': '可调节的亮度和发光动画',
                'reuse': true
            },
            { 'en-US': 'Animation', 'zh-CN': '动画', 'reuse': true },
            { 'en-US': 'Flash', 'zh-CN': '闪光', 'reuse': true },
            { 'en-US': 'None', 'zh-CN': '静止', 'reuse': true },
            { 'en-US': 'Slow', 'zh-CN': '慢速', 'reuse': true },
            { 'en-US': 'Fast', 'zh-CN': '快速', 'reuse': true },
            { 'en-US': 'Blink', 'zh-CN': '闪烁', 'reuse': true },
            { 'en-US': 'Neon', 'zh-CN': '霓虹', 'reuse': true },
            // 墙纸
            {
                'en-US': 'You can place this image as a room-wide wall texture.',
                'zh-CN': '您可以将此墙壁材质应用于一个房间',
                'reuse': true
            },
            { 'en-US': 'Stroke Brightness', 'zh-CN': '描边亮度', 'reuse': true },
            { 'en-US': 'Choose room', 'zh-CN': '选择房间', 'reuse': true },
            // 地砖
            {
                'en-US': 'You can place this image as a room-wide floor texture.',
                'zh-CN': '您可以将此地面材质应用于一个房间',
                'reuse': true
            },
            {
                'en-US': 'Adjustable brightness.',
                'zh-CN': '可调节亮度',
                'reuse': true
            },
            { 'en-US': 'Background Brightness', 'zh-CN': '背景亮度', 'reuse': true },
            { 'en-US': 'Foreground Alpha', 'zh-CN': '前景透明度', 'reuse': true },
            { 'en-US': 'Roads Brightness', 'zh-CN': '道路亮度', 'reuse': true },
            { 'en-US': 'Foreground Brightness', 'zh-CN': '前景亮度', 'reuse': true },
            // 徽章/头像
            {
                'en-US': 'You can choose this icon as your account badge',
                'zh-CN': '您可以将此图标作为您的账户徽章（头像）',
                'reuse': true
            },
            // 购买CPU
            {
                'en-US': 'This item allows you to unlock full CPU in your account for 1 day.',
                'zh-CN': '此物品可以让您解锁账户中的全额 CPU 1天。',
                'reuse': true
            },
            {
                'en-US': 'Remember that by buying resources in our store',
                'zh-CN': '请记住，通过在我们的商店购买物品，',
                'reuse': true
            },
            {
                'en-US': 'you support game development! ☻',
                'zh-CN': '您就是在支持我们的游戏开发！☻',
                'reuse': true
            },
            {
                'en-US': 'All prices exclude VAT where applicable.',
                'zh-CN': '所有价格均不含增值税（如适用）。',
                'reuse': true
            },
            { 'en-US': 'or', 'zh-CN': '或者', 'reuse': true },
            { 'en-US': 'in-game market', 'zh-CN': '在游戏内市场购买', 'reuse': true },
            {
                'en-US': 'Activates full unlocked',
                'zh-CN': '完全激活全额 CPU',
                'reuse': true
            },
            { 'en-US': 'CPU indefinitely!', 'zh-CN': '无限期！', 'reuse': true },
            { 'en-US': 'Lifetime CPU', 'zh-CN': '终生 CPU', 'reuse': true },
            { 'en-US': 'You have', 'zh-CN': '您目前拥有 ', 'reuse': true },
            // pixel
            {
                'en-US': 'Pixels are used to pixelize new decorations.',
                'zh-CN': 'Pixels 可以用来抽取新装饰物。',
                'reuse': true
            },
            {
                'en-US': 'Generate pixels in-game',
                'zh-CN': '通过游戏内指令',
                'reuse': true
            },
            { 'en-US': 'using command', 'zh-CN': '生成 pixel', 'reuse': true },
            {
                'en-US': 'This will consume 5,000 CPU.',
                'zh-CN': '这会消耗 5000 CPU。',
                'reuse': true
            },
            {
                'en-US': 'Learn more about CPU.',
                'zh-CN': '了解更多 CPU 的知识',
                'reuse': true
            },
            // 会导致无法更新内容，暂时禁用
            // {
            //     'selector': 'app-store-pixel > section > div > button.btn',
            //     'zh-CN': (el: HTMLElement) => {
            //         el.innerHTML = el.innerHTML.replace('Buy', '购买')
            //         el.innerHTML = el.innerHTML.replace('for', '仅需')
            //     },
            //     'reuse': true
            // },
            // access key
            {
                'en-US': 'Grants access to the Seasonal World or a special event in the Persistent World.',
                'zh-CN': '获得参与赛季服务器或者特殊事件的权限。',
                'reuse': true
            }
        ]
    };

    const content$h = {
        hashs: ['#!/profile'],
        content: [
            { 'en-US': 'View Steam profile', 'zh-CN': '查看 Steam 个人资料' },
            { 'en-US': 'Send message', 'zh-CN': '发送信息' },
            { 'en-US': 'My overview', 'zh-CN': '我的总览' },
            { 'en-US': 'Current month', 'zh-CN': '本月统计' },
            { 'en-US': 'EXPANSION', 'zh-CN': '扩张' },
            { 'en-US': 'CONTROL', 'zh-CN': '控制' },
            { 'en-US': 'POINTS', 'zh-CN': '点数', 'reuse': true },
            { 'en-US': 'RANK', 'zh-CN': '排名', 'reuse': true },
            { 'en-US': 'Show all', 'zh-CN': '显示全部', 'reuse': true },
            { 'en-US': 'Hide', 'zh-CN': '收起', 'reuse': true },
            getOverviewHeaderContent()
        ]
    };

    const content$i = {
        hashs: ['#!/rank'],
        content: [
            { 'en-US': 'Search by name', 'zh-CN': '搜索玩家名' },
            { 'en-US': 'Rank', 'zh-CN': '排名' },
            { 'en-US': 'Player', 'zh-CN': '玩家' },
            { 'en-US': 'Control points', 'zh-CN': '控制点数' },
            { 'en-US': 'Power points', 'zh-CN': 'Power 点数' },
            { 'en-US': 'Expansion Rank', 'zh-CN': '扩张排行榜' },
            { 'en-US': 'Power Rank', 'zh-CN': 'Power 排行榜' },
            {
                'en-US': 'The leaderboard of players expansion during a month. You earn rating points for upgrading any of your Controllers.',
                'zh-CN': '本排行统计了玩家在本月的扩张程度。您可以通过升级任何属于您的控制器（Controller）来获得评分。'
            },
            {
                'en-US': 'The leaderboard of power gained during a month. You earn rating points for processing power in your Power Spawns.',
                'zh-CN': '本排行统计了玩家本月的 power 点数。您可以通过在 Power Spawn 中处理 power 来获得评分。'
            },
            {
                'en-US': 'In the end of the month, your rank is reset.',
                'zh-CN': '在月末时您的排名将会被重置。'
            },
            { 'en-US': 'YOUR RANK', 'zh-CN': '您的排名' },
            { 'en-US': 'Learn more', 'zh-CN': '了解更多' }
        ]
    };

    /**
     * 账户管理入口页面
     * @see https://screeps.com/a/#!/account
     */
    const content$j = {
        hashs: ['#!/account'],
        content: [
            { 'en-US': 'Account', 'zh-CN': '账户' },
            { 'en-US': 'Notifications', 'zh-CN': '通知' },
            { 'en-US': 'Player name', 'zh-CN': '玩家昵称' },
            { 'en-US': 'Badge', 'zh-CN': '徽标' },
            { 'en-US': 'E-mail', 'zh-CN': '邮箱' },
            { 'en-US': 'Password', 'zh-CN': '密码', 'reuse': true },
            { 'en-US': 'Auth tokens', 'zh-CN': '验证令牌' },
            {
                'en-US': 'Keep yourself notified about what is happening in the game.',
                'zh-CN': '让自己时刻了解游戏中发生了什么。'
            },
            { 'en-US': 'Learn more', 'zh-CN': '了解更多', 'reuse': true },
            {
                'en-US': 'Link your Steam account to use the same account in both web and Steam versions of the game.',
                'zh-CN': '关联您的 Steam 账户来同步 Web 和 Steam 版本的游戏内容。'
            },
            {
                'en-US': 'You can link your GitHub account and automatically pull code to Screeps from any of your GitHub repositories.',
                'zh-CN': '您可以关联您的 Github 账户并从任何仓库中自动推送代码到 Screeps。'
            },
            { 'en-US': 'CPU Unlock', 'zh-CN': 'CPU 解锁', 'reuse': true },
            { 'en-US': 'CPU Unlock:', 'zh-CN': 'CPU 解锁：', 'reuse': true },
            { 'en-US': 'Notifications enabled', 'zh-CN': '启用通知' },
            { 'en-US': 'Send interval', 'zh-CN': '通知发送间隔', 'reuse': true },
            { 'en-US': 'Send when online', 'zh-CN': '在线时是否发送', 'reuse': true },
            { 'en-US': 'Notify on errors', 'zh-CN': '代码异常时通知', 'reuse': true },
            { 'en-US': 'Notify on new messages', 'zh-CN': '有新消息时通知', 'reuse': true },
            // steam 关联
            {
                'en-US': 'Do you really want to unlink your Steam account?',
                'zh-CN': '您确定要解除和 Steam 账户的关联么？',
                'reuse': true
            },
            { 'en-US': 'LINK TO STEAM', 'zh-CN': '关联至 STEAM', 'reuse': true },
            { 'en-US': 'Steam user', 'zh-CN': 'Steam 用户' },
            { 'en-US': 'Steam profile link visible', 'zh-CN': 'Steam 个人资料是否可见' },
            // github 关联
            {
                'en-US': 'Do you really want to unlink your GitHub account?',
                'zh-CN': '您确定要解除和 GitHub 账户的关联么？',
                'reuse': true
            },
            { 'en-US': 'LINK TO GITHUB', 'zh-CN': '关联至 GITHUB', 'reuse': true },
            { 'en-US': 'GitHub user', 'zh-CN': 'GitHub 用户' },
            { 'en-US': 'Sync from repository', 'zh-CN': '启用同步的仓库' },
            { 'en-US': 'Not set', 'zh-CN': '未设置' },
            { 'en-US': 'Cancel', 'zh-CN': '取消', 'reuse': true },
            { 'en-US': 'OK', 'zh-CN': '确定', 'reuse': true },
            { 'en-US': 'Learn how to commit scripts from local machine', 'zh-CN': '了解如何从本地机器提交代码' }
        ]
    };

    /**
     * 徽标配置页
     * @see https://screeps.com/a/#!/account/badge
     */
    const content$k = {
        hashs: ['#!/account/badge'],
        content: [
            { 'en-US': 'Shape', 'zh-CN': '形态', 'reuse': true },
            { 'en-US': 'Color 1', 'zh-CN': '颜色 1', 'reuse': true },
            { 'en-US': 'Color 2', 'zh-CN': '颜色 2', 'reuse': true },
            { 'en-US': 'Color 3', 'zh-CN': '颜色 3', 'reuse': true },
            { 'en-US': 'Save', 'zh-CN': '保存', 'reuse': true },
            { 'en-US': 'Change symbol', 'zh-CN': '选择图案', 'reuse': true },
            { 'en-US': 'Cancel', 'zh-CN': '取消', 'reuse': true },
            { 'en-US': 'Flip', 'zh-CN': '反转', 'reuse': true },
            { 'en-US': 'Random badge', 'zh-CN': '随机徽标', 'reuse': true },
            { 'en-US': 'Choose your symbol:', 'zh-CN': '选择您的图案', 'reuse': true }
        ]
    };

    /**
     * 邮箱配置页
     * @see https://screeps.com/a/#!/account/email
     */
    const content$l = {
        hashs: ['#!/account/email'],
        content: [
            { 'en-US': 'Change e-mail', 'zh-CN': '邮箱设置' },
            { 'en-US': 'New e-mail', 'zh-CN': '新的邮箱' },
            { 'en-US': 'Save', 'zh-CN': '保存' },
            { 'en-US': 'Cancel', 'zh-CN': '取消' }
        ]
    };

    /**
     * 密码重置配置页
     * @see https://screeps.com/a/#!/account/password
     */
    const content$m = {
        hashs: ['#!/account/password'],
        content: [
            { 'en-US': 'Change password', 'zh-CN': '修改密码' },
            { 'en-US': 'Old Password', 'zh-CN': '先前密码' },
            { 'en-US': 'New Password', 'zh-CN': '新的密码' },
            { 'en-US': 'Confirm Password', 'zh-CN': '确认密码' },
            { 'en-US': 'Password doesn\'t match.', 'zh-CN': '密码不匹配', 'reuse': true },
            { 'en-US': 'Your current password.', 'zh-CN': '您的当前密码。', 'reuse': true },
            {
                'en-US': 'Must be at least 8 characters including one uppercase letter, one special character and alphanumeric characters.',
                'zh-CN': '最少需要 8 个字符，包含一个大写字母、一个特殊字符以及数字和字母字符。',
                'reuse': true
            },
            { 'en-US': 'Once again please.', 'zh-CN': '请重复一遍新密码', 'reuse': true },
            { 'en-US': 'Save', 'zh-CN': '保存' },
            { 'en-US': 'Cancel', 'zh-CN': '取消' }
        ]
    };

    const TOOLTIP_LABEL$1 = {
        'Turn off rate limiting for 2 hours': '解除 2 小时的访问速率限制',
        'Remove': '移除'
    };
    /**
     * 验证令牌管理
     * @see https://screeps.com/a/#!/account/auth-tokens
     */
    const content$n = {
        hashs: ['#!/account/auth-tokens'],
        content: [
            { 'en-US': 'Auth Tokens', 'zh-CN': '验证令牌' },
            { 'en-US': 'Add new auth token', 'zh-CN': '添加一个新的验证令牌' },
            { 'en-US': 'Description (optional)', 'zh-CN': '介绍（可选）' },
            { 'en-US': 'Only selected endpoints:', 'zh-CN': '仅允许访问选中接口' },
            { 'en-US': 'Generate token', 'zh-CN': '生成令牌' },
            {
                'en-US': 'You can create tokens to authenticate to our Web API endpoints in external tools.\nThese tokens allow to skip solving CAPTCHA on login, but rate limiting is applied.',
                'zh-CN': '您可以创建一个令牌来使外部工具可以访问我们的 Web API。这些令牌允许在访问时跳过验证码，但是会有一定的访问速率限制。'
            },
            { 'en-US': 'Full access', 'zh-CN': '完全访问权限', 'reuse': true },
            { 'en-US': 'WebSockets (console)', 'zh-CN': 'WebSockets (控制台)', 'reuse': true },
            { 'en-US': 'WebSockets (rooms)', 'zh-CN': 'WebSockets (房间)', 'reuse': true },
            {
                'en-US': 'Be sure to record your generated token, it will not be shown again!',
                'zh-CN': '请务必妥善保管该令牌，它将不会再次显示！',
                'reuse': true
            },
            { 'en-US': 'OK', 'zh-CN': '明白', 'reuse': true },
            {
                'selector': 'div.tooltip.ng-scope.ng-isolate-scope > div.tooltip-inner.ng-binding',
                'zh-CN': (el) => {
                    const newContent = TOOLTIP_LABEL$1[el.innerHTML];
                    if (newContent)
                        el.innerHTML = newContent;
                },
                'reuse': true
            }
        ]
    };

    var account = [content$j, content$k, content$l, content$m, content$n];

    const content$o = {
        hashs: ['#!/enter'],
        content: [
            { 'en-US': 'Persistent World', 'zh-CN': '永恒世界' },
            {
                'selector': 'body > app2-router-outlet > app-enter-base > section > p',
                'zh-CN': '无限制地发展您的殖民地，在这个巨大的永恒世界的历史上留下您的印记。'
            },
            {
                'selector': 'body > app2-router-outlet > app-enter-base > section > p',
                'zh-CN': '无限制地发展您的殖民地，在这个巨大的永恒世界的历史上留下您的印记。'
            },
            // 这两个 enter，一个是主世界的进入按钮，一个是赛季服的进入按钮
            // 主世界的进入按钮有图标，所以需要加一个空格
            { 'en-US': 'Enter', 'zh-CN': '\u00A0进入' },
            { 'en-US': 'Enter', 'zh-CN': '进入' },
            { 'en-US': 'Seasonal World', 'zh-CN': '赛季世界' },
            {
                'selector': 'body > app2-router-outlet > app-enter-base > aside > div.__intro.--flex.--hcenter.--vcenter.--column > p',
                'zh-CN': '在赛季排名中拔得头筹，<br _ngcontent-yvh-c3="">并在和其他玩家的竞争中<br _ngcontent-yvh-c3="">赢取超棒的奖励。'
            },
            {
                'en-US': 'The season entry fee is changed according to the following schedule:',
                'zh-CN': '赛季服门票将会根据以下时间表进行调整：'
            },
            {
                'en-US': 'Grants access to the Seasonal World or a special event in the Persistent World.',
                'zh-CN': '解锁赛季世界或者永恒世界中的特殊事件',
                'reuse': true
            },
            {
                'en-US': 'Remember that by buying resources in our store',
                'zh-CN': '请记住，在我们的商店中购买物品',
                'reuse': true
            },
            {
                'en-US': 'you support game development! ☻',
                'zh-CN': '就是在支持游戏开发！☻',
                'reuse': true
            },
            {
                'en-US': 'All prices exclude VAT where applicable.',
                'zh-CN': '所有价格均不含增值税（如适用）。 ',
                'reuse': true
            },
            { 'en-US': 'or', 'zh-CN': '或者' },
            { 'en-US': 'in-game market', 'zh-CN': '\u00A0游戏内市场' },
            /* {
                'selector': 'body > app2-router-outlet > app-enter-base > aside > div.__intro.--flex.--hcenter.--vcenter.--column > div.--flex.--column > app-time-left',
                'zh-CN': (el: HTMLElement) => {
                     el.innerHTML = el.innerHTML.replace('d', '天')
                    // el.innerHTML = el.innerHTML.replace('left', ' 剩余')
                },
                'reuse': true
            }, */
            { 'en-US': 'View details', 'zh-CN': '了解更多细节' },
            { 'en-US': 'To join the season you need to have', 'zh-CN': '您需要' },
            { 'en-US': 'season keys.', 'zh-CN': '赛季key。' },
            {
                'en-US': 'You need a Steam license or full unlocked CPU to start playing in the Persistent World.',
                'zh-CN': '在永恒世界游玩您需要一个 Steam 许可或完全解锁的 CPU 权限。'
            },
            { 'en-US': 'Screeps on Steam', 'zh-CN': '在 Steam 上的 Screeps' },
            { 'en-US': 'Gives limited 20 CPU indefinitely', 'zh-CN': '永远拥有有限的20 CPU' },
            { 'en-US': 'CPU Unlocks', 'zh-CN': '解锁 CPU' },
            { 'en-US': 'Activates full unlocked CPU for 1 day each', 'zh-CN': '每一个可以激活一天完全解锁的 CPU 权限' },
            { 'en-US': 'I have a coupon', 'zh-CN': '我有一个优惠码' },
            { 'en-US': 'Enter your coupon code', 'zh-CN': '输入您的优惠码' },
            { 'en-US': 'Code', 'zh-CN': '优惠码' },
            { 'en-US': 'Required Field', 'zh-CN': '必填' },
            { 'en-US': 'Ok', 'zh-CN': '确定' },
            { 'en-US': 'Cancel', 'zh-CN': '取消' }
        ]
    };

    const content$p = {
        hashs: ['#!/shards'],
        content: [
            { 'en-US': 'Shards', 'zh-CN': '位面 Shards' },
            {
                'selector': '._back',
                'zh-CN': (el) => {
                    el.setAttribute('content', '选择世界');
                }
            },
            { 'en-US': 'World shards are isolated from each other and run your code separately.', 'zh-CN': ' 在世界中的不同位面是独立的，并且会分开运行您的代码。' },
            { 'en-US': 'Your creeps can travel between them using special portals.', 'zh-CN': '通过使用特殊的传送门。您的 creep 可以在不同位面间穿行。' },
            { 'en-US': 'Learn more', 'zh-CN': '了解更多' },
            { 'en-US': 'claimable rooms', 'zh-CN': '可占领房间', 'reuse': true },
            { 'en-US': 'active players', 'zh-CN': '活跃玩家', 'reuse': true },
            { 'en-US': 'avg tick duration', 'zh-CN': '每 tick 平均时间', 'reuse': true },
            { 'en-US': 'CPU limit', 'zh-CN': 'CPU 限制', 'reuse': true },
            // 重新分配后不会立刻显示，暂时隐藏
            // { 'en-US': /CPU assigned/, 'zh-CN': (text: string) => text.replace('assigned', '被分配'), 'reuse': true, 'protect': true },
            { 'en-US': 'Re-assign CPU', 'zh-CN': '重新分配 CPU', 'reuse': true },
            { 'en-US': 'Unused CPU left:', 'zh-CN': '未使用的 CPU 剩余：' },
            { 'en-US': 'Save CPU', 'zh-CN': '保存 CPU 分配' },
            { 'en-US': 'Cancel', 'zh-CN': '取消' },
            // 分配确认提示
            { 'en-US': 'You\'re going to re-assign your CPU to the following shards:', 'zh-CN': '您将要重新分配您的 CPU 到以下 shard：', 'reuse': true },
            { 'en-US': 'You will not be able to change these settings in the next', 'zh-CN': '在接下来的 ', 'reuse': true },
            { 'en-US': /hours/, 'zh-CN': (text) => text.replace('hours', '小时里您将无法再次编辑该配置'), 'reuse': true },
            { 'en-US': 'Do you want to proceed?', 'zh-CN': '确定要继续么？', 'reuse': true },
            { 'en-US': 'Ok', 'zh-CN': '确定', 'reuse': true },
            { 'en-US': 'Cancel', 'zh-CN': '取消', 'reuse': true }
        ]
    };

    /**
     * 图表右上角的下拉框选项
     */
    const GRAPH_SELECT_LIST$1 = {
        'None': '无',
        'Owner control level': '房间拥有者房间控制等级',
        'Claimable': '是否可被占领',
        'Minerals': '矿物类型',
        'Power enabled': '可否使用 Power 技能',
        'Control points for the last 1 hour': '过去1小时控制点数增长',
        'Control points for the last 24 hours': '过去24小时控制点数增长',
        'Control points for the last 7 days': '过去7天控制点数增长',
        'Energy harvested for the last 1 hour': '过去1小时能量采集',
        'Energy harvested for the last 24 hours': '过去24小时能量采集',
        'Energy harvested for the last 7 days': '过去7天能量采集',
        'Energy spent on construction for the last 1 hour': '过去1小时的能量 - 建筑消耗',
        'Energy spent on construction for the last 24 hours': '过去24小时的能量 - 建筑消耗',
        'Energy spent on construction for the last 7 days': '过去7天的能量 - 建筑消耗',
        'Energy spent on creeps for the last 1 hour': '过去1小时的能量 - 孵化消耗',
        'Energy spent on creeps for the last 24 hours': '过去24小时的能量 - 孵化消耗',
        'Energy spent on creeps for the last 7 days': '过去7天的能量 - 孵化消耗',
        'Creeps produced for the last 1 hour': '过去1小时的 creep 孵化',
        'Creeps produced for the last 24 hours': '过去24小时的 creep 孵化',
        'Creeps produced for the last 7 days': '过去7天的 creep 孵化',
        'Creeps lost for the last 1 hour': '过去1小时的 creep 损失',
        'Creeps lost for the last 24 hours': '过去24小时的 creep 损失',
        'Creeps lost for the last 7 days': '过去7天的 creep 损失',
        'Power processed for the last 1 hour': '过去1小时的 power 处理',
        'Power processed for the last 24 hours': '过去24小时的 power 处理',
        'Power processed for the last 7 days': '过去7天的 power 处理'
    };
    /**
     * 旧版本地图
     * @see https://screeps.com/a/#!/map/shard3
     */
    const content$q = {
        hashs: ['#!/map/'],
        content: [
            {
                'en-US': 'Check out alpha version of the new world map with support of Decorations and Map Visuals (coming soon)',
                'zh-CN': '切换为支持装饰与地图可视化（即将来临）的世界地图 a 测版本'
            },
            {
                'selector': '.room-search > input',
                'zh-CN': (el) => {
                    el.setAttribute('placeholder', '通过房间名或玩家名来搜索 ...');
                },
                'reuse': true
            },
            { 'en-US': 'Display:', 'zh-CN': '展示项目: ', 'reuse': true },
            { 'en-US': 'Toggle units', 'zh-CN': '开关单位显示', 'reuse': true },
            { 'en-US': 'Owner:', 'zh-CN': '所有者: ', 'reuse': true },
            { 'en-US': 'None', 'zh-CN': '无', 'reuse': true },
            /* {
                'selector': 'map-float-info .room-novice.ng-binding.ng-scope',
                'zh-CN': (el: HTMLElement) => {
                    el.innerHTML = el.innerHTML.replace('Novice area', '新手区')
                    el.innerHTML = el.innerHTML.replace('days left', '天剩余')
                },
                'reuse': true
            }, */
            /* {
                'selector': '.room-name.ng-binding',
                'zh-CN': (el: HTMLElement) => {
                    el.innerHTML = el.innerHTML.replace('Room', '房间')
                },
                'reuse': true
            }, */
            // { 'en-US': 'Room', 'zh-CN': '房间', 'reuse': true },
            { 'en-US': 'Safe mode', 'zh-CN': '安全模式', 'reuse': true },
            { 'en-US': 'Not available', 'zh-CN': '未开放', 'reuse': true },
            { 'en-US': 'Sign:', 'zh-CN': '签名: ', 'reuse': true },
            { 'en-US': 'Reservation:', 'zh-CN': '预定: ', 'reuse': true },
            { 'en-US': 'Mineral:', 'zh-CN': '矿物类型: ', 'reuse': true },
            { 'en-US': 'Density:', 'zh-CN': '储量: ', 'reuse': true },
            { 'en-US': 'Power enabled:', 'zh-CN': '可否使用 Power 技能: ', 'reuse': true },
            { 'en-US': 'Control points:', 'zh-CN': '控制点数增长: ', 'reuse': true },
            { 'en-US': 'Energy harvested:', 'zh-CN': '能量采集: ', 'reuse': true },
            { 'en-US': 'Energy spent:', 'zh-CN': '能量消耗: ', 'reuse': true },
            { 'en-US': 'Body parts produced:', 'zh-CN': '身体部件生产数量: ', 'reuse': true },
            { 'en-US': 'Body parts lost:', 'zh-CN': '身体部件损失数量: ', 'reuse': true },
            { 'en-US': 'Power processed:', 'zh-CN': 'power 精炼: ', 'reuse': true },
            // 未选择房间时
            { 'en-US': 'Welcome to the', 'zh-CN': '欢迎来到 ', 'reuse': true },
            { 'en-US': 'screeps world', 'zh-CN': 'SCREEPS 世界', 'reuse': true },
            { 'en-US': 'Choose a room to found your colony.', 'zh-CN': '选择一个房间来建立您的殖民地', 'reuse': true },
            { 'en-US': 'First time?', 'zh-CN': '第一次尝试? ', 'reuse': true },
            { 'en-US': 'See tips how to choose', 'zh-CN': '看看这个帮您选择的小贴士', 'reuse': true },
            { 'en-US': 'OK', 'zh-CN': '好的', 'reuse': true },
            { 'en-US': 'Select your room', 'zh-CN': '挑选您的房间', 'reuse': true },
            { 'en-US': 'Another area', 'zh-CN': '另一个区域', 'reuse': true },
            { 'en-US': 'Random room', 'zh-CN': '随机房间', 'reuse': true },
            {
                'selector': '.stats > div:nth-child(2) > span',
                'zh-CN': translateMultiple({
                    'Ultra': '超高',
                    'High': '高',
                    'Moderate': '中等',
                    'Low': '低'
                }),
                'protect': true,
                'reuse': true
            },
            // 翻译下拉框当前选中值
            {
                'selector': 'button > span.toggle-text.ng-scope > span > b',
                'zh-CN': translateMultiple(GRAPH_SELECT_LIST$1),
                'reuse': true
            },
            // 翻译下拉框选项
            {
                'selector': 'a.ng-binding.ng-scope',
                'zh-CN': translateMultiple(GRAPH_SELECT_LIST$1),
                'reuse': true
            },
            { 'en-US': 'Room not found', 'zh-CN': '未找到该房间' },
            // 失败之后的提示框
            { 'en-US': 'Oops!', 'zh-CN': '真糟糕！' },
            {
                'selector': '.modal-body.alert > div > p',
                'zh-CN': translateMultiple({
                    'It seems that you have lost all your spawns. But cheer up! Losing is fun in Screeps! Your scripts are always with you, your Global Control Level is well and alive, and you can start from scratch and quickly regain your former glory.': '看起来您好像已经失去了所有的 spawn。但是不要灰心！在 Screeps 中失败何尝不是一种乐趣！您的代码始终都在，您的全局控制等级也没有损失，现在您可以从零开始轻松重现往日的荣光！',
                    'Click on the Respawn button below, and all your buildings and creeps will become unowned so that you can reset your spawn in any vacant room on the map. And don\'t forget to <a href="http://docs.screeps.com/defense.html" app-nw-external-link="">build defenses</a> this time!': `点击下方的重生按钮，您将失去现存所有的建筑和 creep，然后您就可以在地图上的任意无主房间重新放置 spawn。这次可不要忘了 <a href="${DOCUMENT_CN}/defense.html" app-nw-external-link="">构建防御</a>！`,
                    'Learn more about birth and death in <a href="http://docs.screeps.com/respawn.html" app-nw-external-link="">this article</a>.': `点击 <a href="${DOCUMENT_CN}/respawn.html" app-nw-external-link="">本文</a> 来了解更多重生与失败的信息。`
                })
            },
            { 'en-US': 'Cancel', 'zh-CN': '取消' }
        ]
    };

    /**
     * 新版本地图
     * @see https://screeps.com/a/#!/map2/shard3
     */
    const content$r = {
        hashs: ['#!/map2'],
        content: [
            { 'en-US': 'Owner:', 'zh-CN': '所有者: ', 'reuse': true },
            { 'en-US': 'None', 'zh-CN': '无', 'reuse': true },
            { 'en-US': 'Safe mode', 'zh-CN': '安全模式', 'reuse': true },
            { 'en-US': 'Not available', 'zh-CN': '未开放', 'reuse': true },
            { 'en-US': 'Sign:', 'zh-CN': '签名: ', 'reuse': true },
            { 'en-US': 'Reservation:', 'zh-CN': '预定: ', 'reuse': true },
            { 'en-US': 'Mineral:', 'zh-CN': '矿物类型: ', 'reuse': true },
            { 'en-US': 'Density:', 'zh-CN': '储量: ', 'reuse': true },
            { 'en-US': 'Random Room', 'zh-CN': '随机房间', 'reuse': true },
            { 'en-US': 'Display', 'zh-CN': '展示项目：', 'reuse': true },
            { 'en-US': 'Owner control level', 'zh-CN': '房间拥有者房间控制等级', 'reuse': true },
            { 'en-US': 'Minerals', 'zh-CN': '矿物类型', 'reuse': true },
            { 'en-US': 'Settings', 'zh-CN': '设置', 'reuse': true },
            { 'en-US': 'Preferences', 'zh-CN': '偏好' },
            { 'en-US': 'Show player units', 'zh-CN': '显示玩家单位' },
            { 'en-US': 'Show map visuals', 'zh-CN': '显示地图视觉效果' },
            { 'en-US': 'Highlight claimable areas', 'zh-CN': '高亮可占领房间' },
            {
                'selector': '.__search > input',
                'zh-CN': (el) => {
                    el.setAttribute('placeholder', '通过房间名或玩家名来搜索 ...');
                }
            }
        ]
    };

    var map = [content$q, content$r];

    /**
     * 游戏首页
     * @see https://screeps.com/
     */
    const content$s = {
        hashs: [''],
        content: [
            // 右顶栏
            { 'en-US': 'Status', 'zh-CN': '服务器状态' },
            { 'en-US': 'Docs', 'zh-CN': '文档' },
            { 'en-US': 'Blogs', 'zh-CN': '博客' },
            { 'en-US': 'Forum', 'zh-CN': '讨论组' },
            { 'en-US': 'Sign in', 'zh-CN': '登录' },
            { 'en-US': 'MMO sandbox game for programmers', 'zh-CN': '为程序员量身打造的 MMO 沙盒游戏' },
            { 'en-US': 'It means "scripting creeps"', 'zh-CN': 'Screeps 的含义是编程（scripting）您的爬虫（creep）。' },
            {
                'en-US': 'It\'s an open-source game for programmers,\nwherein the core mechanic is programming',
                'zh-CN': 'Screeps 是一款面向编程爱好者的开源 MMO RTS 沙盒游戏，其核心机制是为您的单位编写 AI。'
            },
            {
                'en-US': 'your units\' AI.\nYou control your colony by writing JavaScript.',
                'zh-CN': '您可以通过书写 JavaScript 代码来掌控自己的殖民地。'
            },
            { 'en-US': 'MMO real-time sandbox with huge persistent world', 'zh-CN': '在广阔永恒的世界中畅玩 MMO 实时沙盒游戏' },
            { 'en-US': 'View on', 'zh-CN': '浏览' },
            { 'en-US': 'Live demo', 'zh-CN': '在线试玩' },
            { 'en-US': 'No registration required', 'zh-CN': '无需注册' },
            { 'en-US': 'Coming soon', 'zh-CN': '即将开放' },
            {
                'selector': 'section.sc-products > div.sc-products__arena > div.sc-products__arena-header > div',
                'zh-CN': (el) => {
                    el.innerHTML = el.innerHTML.replace('Match-based gameplay versus <br> other players', '与其他玩家对抗的匹配对战机制');
                }
            },
            { 'en-US': 'Steam page', 'zh-CN': 'Steam 页面' },
            { 'en-US': 'Subscribe for news', 'zh-CN': '订阅获取新闻' },
            {
                'selector': '#subscribe-dialog > div > h2',
                'zh-CN': (el) => {
                    el.innerHTML = el.innerHTML.replace('Enter your email to stay tuned <br> for news about Screeps Arena development:', '输入您的邮箱来获取 Screeps Arena 的最新进展');
                }
            },
            { 'en-US': 'Subscribe', 'zh-CN': '订阅' },
            { 'en-US': 'Cancel', 'zh-CN': '取消' },
            {
                'selector': 'section.sc-scripting > div > div.sc-block > header > div',
                'zh-CN': (el) => {
                    el.innerHTML = el.innerHTML.replace('Play by', '游戏方式');
                    el.innerHTML = el.innerHTML.replace('<b>S</b>cripting', '写<b>代码<b>');
                }
            },
            {
                'selector': 'section.sc-scripting > div > div.sc-block > ul > li',
                'zh-CN': (el) => {
                    el.innerHTML = el.innerHTML.replace('<em>Real programming</em>, not just pseudocode. You can use libs from real projects.', '<em>用真实的代码编程</em>，而不是伪代码。您可以调用任何真正的第三方库。');
                    el.innerHTML = el.innerHTML.replace('Use JavaScript or ', '使用 JavaScript 或者通过 WebAssembly');
                    el.innerHTML = el.innerHTML.replace('compile other languages', '编译其它语言。');
                    el.innerHTML = el.innerHTML.replace(' via WebAssembly.', '');
                    el.innerHTML = el.innerHTML.replace('<a class="link" href="http://docs.screeps.com/">Docs and game API</a> of a full-fledged platform.', '包含完整详细的 <a class="link" href="https://screeps-cn.gitee.io/">游戏文档及 API</a>。');
                }
            },
            {
                'selector': 'body > main > section.sc-world > div > div.sc-block',
                'zh-CN': (el) => {
                    el.innerHTML = el.innerHTML.replace('Programmable', '可编程的');
                    el.innerHTML = el.innerHTML.replace('<b>W</b>orld', '<b>世</b>界');
                    el.innerHTML = el.innerHTML.replace('<em>Huge persistent world</em> consisting of 70,000 interconnected game rooms.', '拥有 70,000 个内部相通的游戏房间的<em>巨大永恒世界</em>。');
                    el.innerHTML = el.innerHTML.replace('<em>40-server cluster</em> (160 CPU cores) processing player scripts using Node.js.', '<em>40 个服务器集群</em>（160 CPU核心）运行基于 Node.js 的玩家脚本。');
                    el.innerHTML = el.innerHTML.replace('Programmable world living a continuous life <em>24/7 in real-time</em> even when you\'re offline.', '可编程世界 <em>在现实中 24/7 不停歇地运行</em>，当您下线后亦是如此。');
                }
            },
            {
                'selector': 'body > main > section.sc-sandbox > div > div.sc-block',
                'zh-CN': (el) => {
                    el.innerHTML = el.innerHTML.replace('Open Source', '开源');
                    el.innerHTML = el.innerHTML.replace('<b>S</b>andbox', '<b>沙</b>盒');
                    el.innerHTML = el.innerHTML.replace('Engine released on <a class="link" href="https://github.com/screeps/screeps">GitHub</a> as an open and moddable program platform.', '游戏引擎在 <a class="link" href="https://github.com/screeps/screeps">GitHub</a> 上作为一个开源且可修改的程序平台发布。');
                    el.innerHTML = el.innerHTML.replace('You can <em>change any aspect</em> of game objects\' behavior.', '您可以 <em>修改</em> 游戏内部对象的 <em>任何行为特征</em>。');
                    el.innerHTML = el.innerHTML.replace('<em>Contribute</em> to the game engine development and <em>earn in-game benefits</em>.', '为游戏引擎做出 <em>贡献</em> 来获得 <em>游戏内的回报</em>。');
                }
            },
            { 'en-US': 'What people say', 'zh-CN': '人们的评价' },
            {
                'selector': 'div.sc-reviews__left-side > a > div',
                'zh-CN': (el) => {
                    el.innerHTML = el.innerHTML.replace('Read reviews on Steam', '浏览 Steam 上的评论');
                    el.innerHTML = el.innerHTML.replace('%&nbsp;of&nbsp;', '%\u00A0中有\u00A0');
                    el.innerHTML = el.innerHTML.replace('&nbsp;reviews are positive', '\u00A0条积极评论');
                }
            },
            {
                'selector': 'body > footer > div > section > header > div',
                'zh-CN': (el) => {
                    el.innerHTML = el.innerHTML.replace('Our news ', '相关新闻');
                    el.innerHTML = el.innerHTML.replace('in Twitter', '来自 Twitter');
                }
            }
        ]
    };

    /**
     * 注册页
     * @see https://screeps.com/a/#!/register
     */
    const content$t = {
        hashs: ['#!/register'],
        content: [
            { 'en-US': 'Player Name', 'zh-CN': '玩家名' },
            { 'en-US': 'E-mail', 'zh-CN': '邮箱' },
            // 用户名
            {
                'en-US': 'Other players will see this unique name at your rooms, creeps, and structures. At least 3 alphanumeric characters.',
                'zh-CN': '其他玩家会在您的房间、creep 以及建筑上看到这个唯一的名字。需要至少三个数字或字母字符。',
                'reuse': true
            },
            {
                'en-US': /Minimum \d characters./,
                'zh-CN': (text) => text.replace('Minimum', '至少').replace('characters.', '个字符。'),
                'reuse': true
            },
            {
                'en-US': 'This name is already used by another user.',
                'zh-CN': '该名称已经被其他玩家使用了。',
                'reuse': true
            },
            {
                'en-US': 'Only alphanumeric characters are allowed.',
                'zh-CN': '仅允许使用数字或字母字符。',
                'reuse': true
            },
            // 邮箱
            {
                'en-US': 'You will be able to use this e-mail to notify yourself on custom events via in-game API. No spam, we promise.',
                'zh-CN': '您可以通过游戏内 API 向该邮箱发送邮件来提醒您自己游戏内发生了什么事，我们保证不会发送垃圾邮件。',
                'reuse': true
            },
            {
                'en-US': 'Must be a valid e-mail address.',
                'zh-CN': '必须为有效的邮箱地址。',
                'reuse': true
            },
            {
                'en-US': 'This e-mail is already used by another user.',
                'zh-CN': '该邮箱已经被其他玩家使用了。',
                'reuse': true
            },
            // 密码
            {
                'en-US': 'Must be at least 8 characters including at least one numeric character.',
                'zh-CN': '最少需要 8 个字符，包括至少一个数字字符。',
                'reuse': true
            },
            {
                'en-US': 'Please include at least one non-numeric character.',
                'zh-CN': '请确保至少有一个非数字字符。',
                'reuse': true
            },
            {
                'en-US': 'Confirm Password',
                'zh-CN': '重复密码。'
            },
            {
                'en-US': 'Once again please.',
                'zh-CN': '请重复一遍您的密码。',
                'reuse': true
            },
            {
                'en-US': 'Password doesn\'t match.',
                'zh-CN': '密码不匹配',
                'reuse': true
            },
            // 邮箱确认
            { 'en-US': 'Verify E-mail', 'zh-CN': '邮箱确认', 'reuse': true },
            { 'en-US': 'We have sent a confirmation e-mail to you.', 'zh-CN': '我们已向您发送了一份确认邮件。', 'reuse': true },
            { 'en-US': 'Please check your mail and click the link there.', 'zh-CN': '请检查您的邮件并点击其中的链接。', 'reuse': true },
            {
                'en-US': 'By submitting this information you acknowledge that you have read and agree to be bound by the',
                'zh-CN': '提交这些信息，即表示您确认您已阅读并同意 '
            },
            { 'en-US': 'Register', 'zh-CN': '注册' }
        ]
    };

    /**
     * 消息面板
     * @see https://screeps.com/a/#!/messages
     */
    const content$u = {
        hashs: ['#!/messages'],
        content: [
            { 'en-US': /Messages to \S+/, 'zh-CN': (text) => `${text.replace('Messages to', '与')} 的聊天消息` },
            { 'en-US': 'View user profile', 'zh-CN': '查看用户资料' },
            { 'en-US': 'Send', 'zh-CN': '发送' },
            { 'en-US': 'You can use', 'zh-CN': '您可以使用 ' },
            { 'en-US': 'to format your message', 'zh-CN': ' 来格式化您的消息' },
            {
                'selector': '.page-content.ng-scope textarea',
                'zh-CN': (el) => el.setAttribute('placeholder', '输入新消息...'),
                'reuse': true
            }
        ]
    };

    var pages = [
        content,
        content$1,
        content$2,
        ...tutorial,
        content$3,
        content$4,
        content$b,
        content$3,
        ...market,
        content$h,
        content$i,
        ...account,
        content$o,
        content$p,
        ...map,
        content$g,
        content$s,
        content$t,
        content$u
    ];

    // 设置初始翻译源
    updateSource(document.location.hash, pages);
    // 翻译初始内容
    translate([document.body]);
    listener({
        // 页面变更时重新加载翻译源
        onHashChange: updateSource,
        // 内容变更时翻译后续内容
        onElementChange: translate
    });

}());
