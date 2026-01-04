// ==UserScript==
// @name         AVG 163 Butler
// @namespace    http://tampermonkey.net/
// @version      2025-06-07.2
// @description  The ultimate tool to take over the AVG 163 commnunity
// @author       AVG 163 Butler
// @match        https://avg.163.com/*
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/431853/AVG%20163%20Butler.user.js
// @updateURL https://update.greasyfork.org/scripts/431853/AVG%20163%20Butler.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const E = encodeURIComponent;

    const VER = E(`${GM_info.script.name} - ${GM_info.script.version}`);

    const D = window.document;

    const L = window.location;

    const LS = window.localStorage;

    const communityTopicListQuery = '.avg-list.forums-list > ul';
    const searchTopicListQuery = '.search-result-container';

    const configMigrationOnUpgrade = () => {
        try {
            const supportedFields = ['已配置', '动态类型', '回复人', '隐藏作者', '主题排序', '展开工具栏', '启用话题页面发言报告自动复制'];
            const versionParts = GM_info.script.version.split('.');
            const minorVersionDigit = parseInt(versionParts[versionParts.length - 1], 10);
            const getVerStr = ver => E(`${GM_info.script.name} - ${ver}`);
            const getFieldKeyWithVer = (field, ver) => `${getVerStr(ver)}-${E(field)}`;
            const getFieldWithVersion = (field, ver) => LS.getItem(getFieldKeyWithVer(field, ver));
            const setFieldWithVersion = (field, value, ver) => LS.setItem(getFieldKeyWithVer(field, ver), value);
            const removeFieldWithVersion = (field, ver) => LS.removeItem(getFieldKeyWithVer(field, ver));
            // support all minor versions
            if (supportedFields.every(f => typeof getFieldWithVersion(f, GM_info.script.version) !== 'string')) {
                console.info('未找到当前版本配置 - 尝试从以前的版本升级');
                for (let i = minorVersionDigit - 1; i >= 0; i--) {
                    const previousVersionParts = versionParts.slice(0);
                    previousVersionParts[versionParts.length - 1] = String(i);
                    const previousVer = previousVersionParts.join('.');
                    if (supportedFields.some(f => typeof getFieldWithVersion(f, previousVer) === 'string')) {
                        for (const f of supportedFields) {
                            if (typeof getFieldWithVersion(f, previousVer) === 'string') {
                                setFieldWithVersion(f, getFieldWithVersion(f, previousVer), GM_info.script.version);
                                removeFieldWithVersion(f, previousVer);
                            }
                        }
                        console.info(`升级配置完成 - ${previousVer} => ${GM_info.script.version}`);
                        break;
                    }

                }
            }
            setFieldWithVersion('已配置', JSON.stringify(true), GM_info.script.version);
        } catch (err) {
            createToastWithText(`升级配置时发生错误`);
            console.error('升级配置时发生错误 - ', err);
        }
    };

    configMigrationOnUpgrade();

    const {
        addStorageKeyListener,
        removeStorageKeyListener
    } = (() => {
        // This is used to sync changes from other pages across the same domain
        // NOT on the same page!!!
        const keyListeners = [];
        window.addEventListener('storage', (event) => {
            const {
                key,
                newValue
            } = event;
            for (const keyListener of keyListeners) {
                if (key === keyListener.key) {
                    keyListener.callback(newValue);
                }
            }
        });
        return {
            addStorageKeyListener: (key, callback) => {
                keyListeners.push({
                    key,
                    callback
                });
            },
            removeStorageKeyListener: (key, callback) => {
                const index = keyListeners.findIndex(
                    (keyListener) => keyListener.key === key &&
                    keyListener.callback === callback
                );
                if (index >= 0) {
                    keyListeners.splice(index, 1);
                    return true;
                } else {
                    return false;
                }
            }
        };
    })();

    const getBinaryIntByStorageKey = (key) => {
        const binaryStatusValue = parseInt(LS.getItem(key), 10);
        if (isNaN(binaryStatusValue)) {
            return 1;
        }
        // should only be 1(enabled) or 0(disabled)
        if (binaryStatusValue !== 0) {
            return 1;
        }
        return 0;
    };

    const createDebouncerByTimeout = (
        debounceBeginCallback = () => {},
        debounceEndCallback = () => {},
        timeoutInMs = 1000
    ) => {
        let timeoutId = null;
        const setTimeoutWithCallback = () => setTimeout(
            () => {
                timeoutId = null;
                debounceEndCallback();
            },
            timeoutInMs
        );
        const debouncer = () => {
            if (timeoutId === null) {
                debounceBeginCallback();
            } else {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeoutWithCallback();
        };
        return debouncer;
    };

    const waitForElement = (query, callback) => {
        if (D.querySelector(query) instanceof HTMLElement) {
            callback();
        } else {
            setTimeout(
                () => waitForElement(query, callback),
                1000
            );
        }
    };

    const createOrderMemorizeStore = () => {
        // a weak map that keep the original index of the elements
        let store = new WeakMap();
        const memorize = (arr) => {
            // This array might be partially sorted
            // so we only memorize those are new
            for (let i = 0; i < arr.length; i++) {
                if (!store.has(arr[i])) {
                    store.set(arr[i], i);
                }
            }
        };
        const getOriginalIndexByElement = (element) => store.has(element) ? store.get(element) : -1;
        const clear = () => {
            store = new WeakMap();
        };

        return {
            memorize,
            getOriginalIndexByElement,
            clear
        };
    };

    const restoreHTMLElementsOrderInParentByQueryAndOriginalIndexGetter = (parentQuery, getOriginalIndexByElement) => {
        const parent = D.querySelector(parentQuery);
        if (parent instanceof HTMLElement) {
            let sortedChildren = [...parent.children];
            sortedChildren.sort(
                (l, r) => getOriginalIndexByElement(l) - getOriginalIndexByElement(r)
            );
            parent.append(...sortedChildren);
            return true;
        }
        return false;
    };

    const sortHTMLElementsInParentByQueryAndCompare = (parentQuery, compareOrCompares, memorize) => {
        const parent = D.querySelector(parentQuery);
        if (parent instanceof HTMLElement) {
            let sortedChildren = [...parent.children];
            if (typeof memorize === 'function') {
                // used for order restoration
                memorize(sortedChildren);
            }
            if (typeof compareOrCompares === 'function') {
                sortedChildren.sort(compareOrCompares);
            } else if (
                Array.isArray(compareOrCompares) &&
                compareOrCompares.every(c => typeof c === 'function')
            ) {
                compareOrCompares.forEach(
                    (compare) => {
                        sortedChildren.sort(compare);
                    }
                );
            } else {
                return false;
            }
            parent.append(...sortedChildren);
            return true;
        }
        return false;
    };

    // eventTypes must be event does bubble, focus event does not bubble
    const onElementEventTypesByClassList = (eventTypes = ['mouseover'], classList, callback, config = {
        capture: false,
        once: false,
        passive: true,
        subtree: true
    }) => {
        const isElementWithClassList = (element) => (element instanceof HTMLElement) && classList.every(c => element.classList.contains(c));
        const callbackWithListenerRemoval = (event, element) => {
            callback(event, element);
            if (config.once) {
                for (const eventType of eventTypes) {
                    window.document.removeEventListener(eventType, wrappedCallback);
                }
            }
        };
        const wrappedCallback = (event) => {
            if (isElementWithClassList(event.target)) {
                callbackWithListenerRemoval(event, event.target);
            } else if (config.subtree) {
                let currentElement = event.target.parentElement;
                while (currentElement instanceof HTMLElement) {
                    if (isElementWithClassList(currentElement)) {
                        callbackWithListenerRemoval(event, currentElement);
                        break;
                    } else {
                        currentElement = currentElement.parentElement;
                    }
                }
            }
        };
        for (const eventType of eventTypes) {
            window.document.addEventListener(
                eventType,
                wrappedCallback,
                Object.assign({},
                    config, {
                        // first event may not be triggered by target
                        once: false
                    }
                )
            );
        }
    };

    const isUserLoggedIn = () => {
        const userNavButton = D.querySelector('.nav-tool-button.nav-user-button');
        if (userNavButton instanceof HTMLElement) {
            return true;
        }
        return false;
    };

    const getCurrentPageLink = () => {
        return window.location.href;
    };

    const getMyInfo = async () => {
        if (isUserLoggedIn()) {
            const infoEndpoint = new URL(L.href);
            infoEndpoint.search = '';
            infoEndpoint.pathname = '/avg-portal-api/user/info';
            if (!!getCsrfToken()) {
                const params = {
                    csrf_token: getCsrfToken()
                };
                Object.keys(params).forEach(key => infoEndpoint.searchParams.append(key, params[key]));
            }
            const infoResult = await fetch(infoEndpoint).then(r => r.json());
            const {
                state: {
                    code: infoCode,
                    message: infoMessage
                } = {
                    code: 0,
                    message: '未知错误'
                },
                data = {
                    id: -1
                }
            } = infoResult;
            if (infoCode !== 200000) {
                createToastWithText(`当前用户信息加载错误 - ${infoMessage}`);
            } else {
                return data;
            }
        }
        createToastWithText('当前用户信息加载失败 - 用户未登陆');
        return {
            id: -1
        };
    };

    const getComments = () => {
        return [...D.querySelectorAll('.topic-comment-list .topic-comment-item')];
    };

    const getOnPageCommentsCountByAuthorId = (authorId) => {
        return getComments().filter(
            (comment) => {
                if (comment.querySelector(`[href="/user/${authorId}"]`) instanceof HTMLElement) {
                    // const topicTime = comment.querySelector('.topic-time');
                    // if (topicTime instanceof HTMLElement && topicTime.innerText === getCurrentDateInCommentFormat()) return true;
                    return true;
                }
                return false;
            }
        ).length;
    };

    const getCommentsCountFromDataByAuthorId = (comments, myAuthorId) => {
        let count = 0;
        if (Array.isArray(comments)) {
            for (const comment of comments) {
                const {
                    authorId,
                    children = []
                } = comment;
                if (authorId === myAuthorId) {
                    count++;
                }
                count += getCommentsCountFromDataByAuthorId(children, myAuthorId);
            }
        }
        return count;
    };

    const getMyAuthorId = async () => {
        if (isUserLoggedIn()) {
            const {
                id = -1
            } = await getMyInfo();
            return id;
        }
        return -1;
    };

    const getCsrfToken = () => {
        const CSRF_TOKEN_KEY = 'TOKEN';
        const cookies = D.cookie.split(';').map(p => String(p).trim()).map(kv => kv.split('=')).reduce(
            (cookiesMap, [k, v]) => {
                cookiesMap[k] = v;
                return cookiesMap;
            }, {}
        );
        return cookies[CSRF_TOKEN_KEY];
    };

    const createMyUserNameAndAuthorIdStore = () => {
        let currnetUserName = '';
        let currentAuthorId = -1;
        const updateStore = async () => {
            const {
                userName = '', id = -1
            } = await getMyInfo();
            currnetUserName = userName;
            currentAuthorId = id;
        };
        const getMyUserNameAndAuthorId = () =>
            ({
                userName: currnetUserName,
                authorId: currentAuthorId
            });
        waitForElement(
            '.nav-bar',
            updateStore
        );
        return {
            updateStore,
            getMyUserNameAndAuthorId
        };
    };

    const createElementWithInnerTextAndStyle = (ElementName, innerText, style = {}) => {
        const element = D.createElement(ElementName);
        if (typeof innerText === 'string') {
            element.innerText = innerText;
        }
        Object.assign(
            element.style,
            style
        );
        return element;
    };

    const createToastWithText = (() => {
        const showToast = (text, disappearDelayInMs = 1000) => {
            const defaultStyle = {
                position: 'fixed',
                top: '10vh',
                zIndex: 9999,
                transform: 'translateX(-50%)',
                left: '50%',
                transition: 'all 0.25s ease',
                borderRadius: '2em',
                backgroundColor: 'black',
                padding: '0.5em 2em',
                color: 'white',
                textAlign: 'center',
                opacity: '0',
            };
            const toast = createElementWithInnerTextAndStyle('div', text, defaultStyle);
            D.body.append(toast);
            setTimeout(
                () => {
                    Object.assign(
                        toast.style, {
                            opacity: '100%'
                        }
                    );
                },
                0
            );
            const removeToast = () => {
                Object.assign(
                    toast.style, {
                        opacity: '0'
                    }
                );
                setTimeout(
                    () => {
                        D.body.removeChild(toast);
                    },
                    250
                );
            };
            if (disappearDelayInMs > 0) {
                setTimeout(
                    removeToast,
                    disappearDelayInMs
                );
            } else {
                return removeToast;
            }
        };
        return showToast;
    })();

    const createSingletonObserverByQueryAndClassList = (
        ancestorQuery,
        classList,
        observeStartCallback = () => {},
        nodeAddedCallback = () => {},
        nodeRemovedCallback = () => {},
        config = {
            attributes: false,
            childList: true,
            subtree: true
        }
    ) => {
        let singletonObserver = null;
        let currentTargetNode = null;

        const addObserver = () => {
            const targetNode = D.querySelector(ancestorQuery);
            if (targetNode === currentTargetNode) {
                return;
            }
            currentTargetNode = targetNode;
            observeStartCallback();
            if (singletonObserver instanceof MutationObserver) {
                singletonObserver.disconnect();
            }

            // Callback function to execute when mutations are observed
            const callback = function (mutationsList, observer) {
                // Use traditional 'for loops' for IE 11
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        for (const n of mutation.addedNodes) {
                            if (
                                n instanceof HTMLElement &&
                                classList.some(c => n.classList.contains(c))
                            ) {
                                nodeAddedCallback(n);
                                break;
                            }
                        }
                        for (const n of mutation.removedNodes) {
                            if (
                                n instanceof HTMLElement &&
                                classList.some(c => n.classList.contains(c))
                            ) {
                                nodeRemovedCallback(n);
                                break;
                            }
                        }
                    }
                }
            };

            // Create an observer instance linked to the callback function
            const observer = new MutationObserver(callback);

            // Start observing the target node for configured mutations
            observer.observe(targetNode, config);
            singletonObserver = observer;
            // Return artifacts
            return {
                disconnect: () => singletonObserver.disconnect(),
                reconnect: () => observer.observe(targetNode, config),
                getObserver: () => singletonObserver
            };
        };
        return addObserver;
    };

    const copyTextToClipboard = (text) => {
        try {
            const type = 'text/plain';
            navigator.clipboard.write([
                new ClipboardItem({
                    [type]: new Blob([text], {
                        type
                    })
                }),
            ]).catch(
                (err) => {
                    GM_setClipboard(text, 'text/plain');
                }
            );
        } catch (err) {
            createToastWithText(`复制到剪贴板时出错 - 无法复制内容`);
            console.error('复制到剪贴板时出错 - 无法复制内容', err);
            return false;
        }
        return true;
    };

    const copyFormattedReportForCurrentPageByUserNameAndAuthorId = (userName, authorId, foreseeSubmit = false) => {
        // 动态链接 - 该动态回复数量 - 回复人不同的异次元昵称 - 动态类型 - 回复人
        const topicType = LS.getItem(`${VER}-${E('动态类型')}`) || '';
        const owner = LS.getItem(`${VER}-${E('回复人')}`) || '';
        let currentOnPageCommentsCountByAuthorId = getOnPageCommentsCountByAuthorId(authorId);
        if (foreseeSubmit) {
            currentOnPageCommentsCountByAuthorId += 1;
        }
        let formatted = `${getCurrentPageLink()}\t${currentOnPageCommentsCountByAuthorId}\t${userName}`;
        if (!!topicType) {
            formatted = `${formatted}\t${topicType}`;
        }
        if (!!owner) {
            formatted = `${formatted}\t${owner}`;
        }
        return copyTextToClipboard(formatted);
    };

    const getAllHiddenAuthor = () => {
        let authors = [];
        try {
            authors = JSON.parse(LS.getItem(`${VER}-${E('隐藏作者')}`) || '[]').filter(
                author => (typeof author.id === 'number' || typeof author.name === 'string')
            );
        } catch (err) {
            createToastWithText('配置读取错误 - 无法取得已经隐藏的作者');
            console.error('配置读取错误 - 无法取得已经隐藏的作者', err);
        }
        return authors;
    };

    const getHiddenAuthorById = (authorId) => getAllHiddenAuthor().find(a => a.id === authorId);

    const getAllHiddenAuthorId = () =>
        getAllHiddenAuthor().map(author => author.id);

    const isAuthorIdHidden = (authorId) =>
        getAllHiddenAuthorId().includes(authorId);

    const addHiddenAuthorByIdAndName = (authorId, authorName = '无名氏') => {
        const authorIds = getAllHiddenAuthorId();
        const authors = getAllHiddenAuthor();
        if (!authorIds.includes(authorId)) {
            authors.push({
                id: authorId,
                name: authorName
            });
            LS.setItem(`${VER}-${E('隐藏作者')}`, JSON.stringify(authors));
        }
    };

    const removeHiddenAuthorById = (authorId) => {
        const authorIds = getAllHiddenAuthorId();
        const authors = getAllHiddenAuthor();
        if (authorIds.includes(authorId)) {
            authors.splice(authorIds.indexOf(authorId), 1);
            LS.setItem(`${VER}-${E('隐藏作者')}`, JSON.stringify(authors));
        }
    };

    const clearHiddenAuthor = () => LS.removeItem(`${VER}-${E('隐藏作者')}`);

    const sortableFields = [
        // { field: 'authorName' },
        // { field: 'authorId' },
        { name: 'VIP 用户', field: 'vip' },
        { name: '点击数', field: 'clickCount' },
        { name: '评论数', field: 'commentCount' },
        { name: '收藏数', field: 'favoriteCount' },
        { name: '图片数', field: 'imageCount' },
        { name: '音频数', field: 'audioCount' },
        { name: '视频数', field: 'videoCount' },
        { name: '字数', field: 'charCount' },
        { name: '我的回复数', field: 'myCommentsCount' },
        { name: '发布时间', field: 'createTime' }
    ];

    const sortableOrders = [
        { name: '升序', order: 'ASC' },
        { name: '降序', order: 'DESC' }
    ];

    const getAllSortConfigs = () => {
        const sortConfigs = [];
        try {
            const parsedSortConfigs = JSON.parse(LS.getItem(`${VER}-${E('主题排序')}`) || '[]');
            for (const parsedSortConfig of parsedSortConfigs) {
                const {
                    field,
                    order
                } = parsedSortConfig;
                if (
                    sortableFields.some(f => f.field === field) &&
                    sortableOrders.some(o => o.order === order)) {
                    sortConfigs.push({
                        field,
                        order
                    });
                }
            }
        } catch (err) {
            createToastWithText('配置读取错误 - 无法取得主题排序设置');
            console.error('配置读取错误 - 无法取得主题排序设置', err);
        }
        return sortConfigs;
    };

    const saveAllSortConfigs = (sortConfigs) => {
        const uniqueSortConfigs = [];
        for (const sortConfig of sortConfigs) {
            if (uniqueSortConfigs.findIndex(c => c.field === sortConfig.field) === -1) {
                uniqueSortConfigs.push(sortConfig);
            }
        }
        LS.setItem(`${VER}-${E('主题排序')}`, JSON.stringify(uniqueSortConfigs))
    };

    const getSortConfigByField = (field) => getAllSortConfigs().find(c => c.field === field);

    const deleteSortConfigByField = (field) => {
        const sortConfigs = getAllSortConfigs();
        const index = sortConfigs.findIndex(c => c.field === field);
        if (index >= 0) {
            const deletedSortConfig = sortConfigs.splice(
                index,
                1
            );
            saveAllSortConfigs(sortConfigs);
            return deletedSortConfig;
        }
    };

    const addSortConfig = (sortConfig, index = 0) => {
        const sortConfigs = getAllSortConfigs();
        if (index < 0) {
            sortConfigs.push(sortConfig);
        } else {
            sortConfigs.splice(index, 0, sortConfig);
        }
        saveAllSortConfigs(sortConfigs);
    };

    // createMyUserNameAndAuthorIdStore to avoid reading userName and authorId async
    const myUserNameAndAuthorIdStore = createMyUserNameAndAuthorIdStore();

    const addExpandAndShrinkButtonToToolBelt = (toolBelt) => {
        const isToolBeltExpanded = () => getBinaryIntByStorageKey(`${VER}-${E('展开工具栏')}`) === 1;

        const expandToolBeltButton = createElementWithInnerTextAndStyle(
            'button',
            '⇲', {
                position: 'relative',
                padding: '5px 10px',
                borderRadius: '5px',
                display: !isToolBeltExpanded() ? 'initial' : 'none'
            }
        );

        const expandToolBelt = () => {
            [...toolBelt.children].forEach(
                (element) => {
                    if (
                        element instanceof HTMLElement &&
                        element !== expandToolBeltButton
                    ) {
                        element.style.display = 'initial';
                    }
                    expandToolBeltButton.style.display = 'none';
                    LS.setItem(`${VER}-${E('展开工具栏')}`, '1');
                }
            );
        };

        expandToolBeltButton.addEventListener(
            'click',
            expandToolBelt
        );

        toolBelt.append(expandToolBeltButton);

        const shrinkToolBeltButton = createElementWithInnerTextAndStyle(
            'button',
            '⇱', {
                position: 'absolute',
                right: '5px',
                bottom: '5px',
                padding: '5px 10px',
                borderRadius: '5px',
                display: isToolBeltExpanded() ? 'initial' : 'none'
            }
        );

        const shrinkToolBelt = () => {
            [...toolBelt.children].forEach(
                (element) => {
                    if (
                        element instanceof HTMLElement &&
                        element !== expandToolBeltButton
                    ) {
                        element.style.display = 'none';
                    }
                    expandToolBeltButton.style.display = 'initial';
                    LS.setItem(`${VER}-${E('展开工具栏')}`, '0');
                }
            );
        };

        shrinkToolBeltButton.addEventListener(
            'click',
            shrinkToolBelt
        );

        if (!isToolBeltExpanded()) {
            shrinkToolBelt();
        } else {
            expandToolBelt();
        }

        addStorageKeyListener(
            `${VER}-${E('展开工具栏')}`,
            () => {
                if (isToolBeltExpanded()) {
                    expandToolBelt();
                } else {
                    shrinkToolBelt();
                }
            }
        );

        toolBelt.append(shrinkToolBeltButton);
    };

    const createTopicToolBelt = () => {
        const toolBelt = createElementWithInnerTextAndStyle(
            'div',
            null, {
                position: 'fixed',
                left: '20px',
                bottom: '40px',
                padding: '5px 10px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '5px'
            }
        );

        const copyFormattedReport = createElementWithInnerTextAndStyle(
            'button',
            '复制报告到剪贴板', {
                padding: '0.5em',
                width: '12em'
            }
        );

        const copyFormattedReportHandler = (event) => {
            if (
                copyFormattedReport.disabled === false
            ) {
                copyFormattedReport.disabled = true;
                const originalText = copyFormattedReport.innerText;
                const restore = () => {
                    copyFormattedReport.innerText = originalText;
                    copyFormattedReport.disabled = false;
                };
                const {
                    userName,
                    authorId
                } = myUserNameAndAuthorIdStore.getMyUserNameAndAuthorId();
                if (copyFormattedReportForCurrentPageByUserNameAndAuthorId(userName, authorId)) {
                    copyFormattedReport.innerText = '复制成功✓';
                    createToastWithText('报告复制成功✓');
                    setTimeout(restore, 2000);
                } else {
                    restore();
                }
            }
        };
        copyFormattedReport.addEventListener(
            'click',
            copyFormattedReportHandler
        );

        const addSingletonCommentsObserver = createSingletonObserverByQueryAndClassList(
            '.topic-comment-list',
            ['topic-comment-item', 'topic-comment-reply-containter', 'topic-comment-reply-item'],
            () => {
                myUserNameAndAuthorIdStore.updateStore();
                // show toolBelt after comment input active
                D.body.append(toolBelt);
            }
        );

        onElementEventTypesByClassList(
            ['mouseover', 'focusin'],
            ['text-input'],
            () => waitForElement('.topic-comment-list', addSingletonCommentsObserver), {
                once: true
            }
        );

        toolBelt.append(copyFormattedReport);

        const topicTypeInput = createElementWithInnerTextAndStyle(
            'input',
            null, {
                width: '8em'
            }
        );

        topicTypeInput.placeholder = '动态类型';
        topicTypeInput.value = LS.getItem(`${VER}-${E('动态类型')}`) || '';
        topicTypeInput.addEventListener(
            'keyup',
            (event) => {
                LS.setItem(`${VER}-${E('动态类型')}`, event.target.value);
            }
        );
        addStorageKeyListener(
            `${VER}-${E('动态类型')}`,
            (newValue) => {
                topicTypeInput.value = newValue;
            }
        );

        toolBelt.append(topicTypeInput);

        const ownerInput = createElementWithInnerTextAndStyle(
            'input',
            null, {
                width: '5em'
            }
        );

        ownerInput.placeholder = '回复人';
        ownerInput.value = LS.getItem(`${VER}-${E('回复人')}`) || '';
        ownerInput.addEventListener(
            'keyup',
            (event) => {
                LS.setItem(`${VER}-${E('回复人')}`, event.target.value);
            }
        );
        addStorageKeyListener(
            `${VER}-${E('回复人')}`,
            (newValue) => {
                ownerInput.value = newValue;
            }
        );

        toolBelt.append(ownerInput);

        const enableCommentReportAutoCopy = createElementWithInnerTextAndStyle(
            'input',
            null, {
                marginLeft: '0.5em',
                width: '1.8em',
                height: '1.8em',
                verticalAlign: 'middle'
            }
        );

        const isCommentReportAutoCopyEnabled = () => getBinaryIntByStorageKey(`${VER}-${E('启用话题页面发言报告自动复制')}`) === 1;

        if (isCommentReportAutoCopyEnabled()) {
            createToastWithText('自动报告复制已启用');
        }

        enableCommentReportAutoCopy.id = 'enable-comment-report-auto-copy';

        enableCommentReportAutoCopy.type = 'checkbox';

        enableCommentReportAutoCopy.checked = isCommentReportAutoCopyEnabled();

        enableCommentReportAutoCopy.addEventListener(
            'change',
            (event) => {
                if (!!event.target.checked) {
                    LS.setItem(`${VER}-${E('启用话题页面发言报告自动复制')}`, '1');
                    createToastWithText('自动报告复制已启用');
                } else {
                    LS.setItem(`${VER}-${E('启用话题页面发言报告自动复制')}`, '0');
                }
            }
        );

        addStorageKeyListener(
            `${VER}-${E('启用话题页面发言报告自动复制')}`,
            () => {
                enableCommentReportAutoCopy.checked = isCommentReportAutoCopyEnabled();
            }
        );

        toolBelt.append(enableCommentReportAutoCopy);

        const enableCommentReportAutoCopyLabel = createElementWithInnerTextAndStyle(
            'label',
            '自动复制报告', {
                padding: '0.5em',
                width: '12em',
                color: 'white'
            }
        );

        enableCommentReportAutoCopyLabel.setAttribute('for', enableCommentReportAutoCopy.id);

        toolBelt.append(enableCommentReportAutoCopyLabel);

        // make some room for shrink button
        const shrinkButtonPlaceholder = createElementWithInnerTextAndStyle(
            'div',
            null, {
                padding: '0.8em'
            }
        );

        toolBelt.append(shrinkButtonPlaceholder);

        addExpandAndShrinkButtonToToolBelt(toolBelt);

        // Do not show toolBelt by default
        // D.body.append(toolBelt);
    };

    if (window.location.pathname.startsWith('/topic/detail')) {
        createTopicToolBelt();
    }

    const createTopicListToolBelt = () => {
        const toolBelt = createElementWithInnerTextAndStyle(
            'div',
            null, {
                position: 'fixed',
                left: '20px',
                bottom: '40px',
                padding: '5px 10px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '5px',
                // display only after topic detail enabled
                display: 'none'
            }
        );
        toolBelt.classList.add('topic-list-tool-belt');

        const removeHiddenAuthorSelect = createElementWithInnerTextAndStyle('select');
        removeHiddenAuthorSelect.name = 'remove-hidden-author';
        const hintOption = createElementWithInnerTextAndStyle('option', '--- 选择作者以取消隐藏 ---');
        hintOption.value = 0 - Math.round(Math.random() * 1000);
        hintOption.disabled = true;
        removeHiddenAuthorSelect.append(hintOption);
        removeHiddenAuthorSelect.value = hintOption.value;
        const updateHiddenAuthorSelectOptions = () => {
            // create latest list of hidden authors
            while (removeHiddenAuthorSelect.firstChild) {
                removeHiddenAuthorSelect.removeChild(removeHiddenAuthorSelect.firstChild);
            }
            removeHiddenAuthorSelect.append(hintOption);
            for (const {
                    id,
                    name
                } of getAllHiddenAuthor()) {
                const option = createElementWithInnerTextAndStyle('option', name);
                option.value = id;
                removeHiddenAuthorSelect.append(option);
            }
        };
        updateHiddenAuthorSelectOptions();
        window.addEventListener(
            'topicdisplaytoggle',
            // addHiddenAuthorByIdAndName or removeHiddenAuthorById must be called before event dispatch
            updateHiddenAuthorSelectOptions
        );
        addStorageKeyListener(
            `${VER}-${E('隐藏作者')}`,
            updateHiddenAuthorSelectOptions
        );

        const removeHiddenAuthorByIdAndDispatch = (authorId) => {
            removeHiddenAuthorById(authorId);
            window.dispatchEvent(
                new CustomEvent(
                    'topicdisplaytoggle', {
                        detail: {
                            authorId,
                            display: true
                        },
                        bubbles: true,
                        cancelable: true
                    }
                )
            );
        };
        removeHiddenAuthorSelect.addEventListener(
            'change',
            (event) => {
                try {
                    const authorId = parseInt(event.target.value, 10);
                    if (isNaN(authorId)) {
                        throw new TypeError('authorId 无法转换为数字 - ', event.target.value);
                    }
                    const selectedAuthor = getHiddenAuthorById(authorId);
                    if (typeof selectedAuthor === 'undefined') {
                        createToastWithText('取消作者隐藏错误 - 该作者当前没有被隐藏');
                        return;
                    }
                    const {
                        name: authorName
                    } = selectedAuthor;
                    removeHiddenAuthorSelect.value = hintOption.value;
                    removeHiddenAuthorByIdAndDispatch(authorId);
                    createToastWithText(`已经取消对作者 ${authorName} 的隐藏`);
                } catch (err) {
                    clearHiddenAuthor();
                    createToastWithText('取消作者隐藏错误 - 已\清除所有隐藏的作者');
                    console.error('取消作者隐藏错误', err);
                }
            }
        );

        toolBelt.append(removeHiddenAuthorSelect);

        const clearAllHiddenAuthor = createElementWithInnerTextAndStyle(
            'button',
            '取消所有作者隐藏', {
                padding: '0.5em',
                width: '12em'
            }
        );

        clearAllHiddenAuthor.addEventListener(
            'click',
            () => {
                getAllHiddenAuthorId().forEach(
                    (authorId) => removeHiddenAuthorByIdAndDispatch(authorId)
                );
                createToastWithText('已经取消对所有作者的隐藏');
            }
        );

        toolBelt.append(clearAllHiddenAuthor);

        toolBelt.append(createElementWithInnerTextAndStyle('br'));

        const addSortConfigWithToastAndDispatchEvent = (sortConfig, index) => {
            const initialSortConfigCount = getAllSortConfigs().length;
            addSortConfig(sortConfig, index);
            window.dispatchEvent(
                new CustomEvent(
                    'topiclistreadytosort', {
                        bubbles: true,
                        cancelable: true
                    }
                )
            );
            if (initialSortConfigCount === 0) {
                createToastWithText('主题列表自动排序已启用');
            } else {
                createToastWithText('主题列表自动排序规则已变化');
            }
        };

        const deleteSortConfigByFieldWithToastAndDispatchEvent = (field) => {
            const initialSortConfigCount = getAllSortConfigs().length;
            deleteSortConfigByField(field);
            window.dispatchEvent(
                new CustomEvent(
                    'topiclistreadytosort', {
                        bubbles: true,
                        cancelable: true
                    }
                )
            );
            if (initialSortConfigCount === 1) {
                createToastWithText('主题列表自动排序已停用\n已恢复初始排序');
                window.dispatchEvent(
                    new CustomEvent(
                        'topiclistreadytorestore', {
                            bubbles: true,
                            cancelable: true
                        }
                    )
                );
            } else {
                createToastWithText('主题列表自动排序规则已变化');
            }
        }

        const sortByTopicTotalCommentsAsc = createElementWithInnerTextAndStyle(
            'input',
            null, {
                width: '1.8em',
                height: '1.8em',
                verticalAlign: 'middle'
            }
        );

        sortByTopicTotalCommentsAsc.id = 'sort-by-topic-total-comments';

        sortByTopicTotalCommentsAsc.type = 'checkbox';

        sortByTopicTotalCommentsAsc.checked = !!getSortConfigByField('commentCount');

        sortByTopicTotalCommentsAsc.addEventListener(
            'change',
            (event) => {
                // console.warn('=== commentCount change event ===', event)
                if (!!event.target.checked) {
                    addSortConfigWithToastAndDispatchEvent({
                        field: 'commentCount',
                        order: 'ASC'
                    }, -1);
                } else {
                    deleteSortConfigByFieldWithToastAndDispatchEvent('commentCount');
                }
            }
        );

        // Sync checkbox status is pointless as sort status won't sync
        // Syncing sort status is too resource heavy
        /*
        addStorageKeyListener(
            `${VER}-${E('主题排序')}`,
            () => {
                const sortByCommentCountEnabled = !!getSortConfigByField('commentCount');
                sortByTopicTotalCommentsAsc.checked = sortByCommentCountEnabled;
            }
        );
        */

        toolBelt.append(sortByTopicTotalCommentsAsc);

        const sortByTopicTotalCommentsAscLabel = createElementWithInnerTextAndStyle(
            'label',
            '按主题回复数量升序排列', {
                padding: '0.5em',
                width: '12em',
                color: 'white'
            }
        );

        sortByTopicTotalCommentsAscLabel.setAttribute('for', sortByTopicTotalCommentsAsc.id);

        toolBelt.append(sortByTopicTotalCommentsAscLabel);

        toolBelt.append(createElementWithInnerTextAndStyle('br'));

        const sortByMyCommentsCountAsc = createElementWithInnerTextAndStyle(
            'input',
            null, {
                width: '1.8em',
                height: '1.8em',
                verticalAlign: 'middle'
            }
        );

        sortByMyCommentsCountAsc.id = 'sort-by-topic-my-comments-count';

        sortByMyCommentsCountAsc.type = 'checkbox';

        sortByMyCommentsCountAsc.checked = !!getSortConfigByField('myCommentsCount');

        sortByMyCommentsCountAsc.addEventListener(
            'change',
            (event) => {
                if (!!event.target.checked) {
                    addSortConfigWithToastAndDispatchEvent({
                        field: 'myCommentsCount',
                        order: 'ASC'
                    });
                } else {
                    deleteSortConfigByFieldWithToastAndDispatchEvent('myCommentsCount');
                }
            }
        );

        // Sync checkbox status is pointless as sort status won't sync
        // Syncing sort status is too resource heavy
        /*
        addStorageKeyListener(
            `${VER}-${E('主题排序')}`,
            () => {
                const sortByMyCommentsCountEnabled = !!getSortConfigByField('myCommentsCount');
                sortByMyCommentsCountAsc.checked = sortByMyCommentsCountEnabled;
            }
        );
        */

        toolBelt.append(sortByMyCommentsCountAsc);

        const sortByMyCommentsCountAscLabel = createElementWithInnerTextAndStyle(
            'label',
            '优先按我的回复数量升序排列', {
                padding: '0.5em',
                width: '12em',
                color: 'white'
            }
        );

        sortByMyCommentsCountAscLabel.setAttribute('for', sortByMyCommentsCountAscLabel.id);

        toolBelt.append(sortByMyCommentsCountAscLabel);

        toolBelt.append(createElementWithInnerTextAndStyle('br'));

        const topicCountDisplay = createElementWithInnerTextAndStyle(
            'span',
            '尚未开始对主题计数', {
                padding: '0.5em',
                width: '12em',
                color: 'white'
            }
        );

        window.addEventListener(
            'topiclistreadytocount',
            () => {
                let topicCount = -1;
                if (D.querySelector(communityTopicListQuery) instanceof HTMLElement) {
                    topicCount = D.querySelector(communityTopicListQuery).children.length;
                }
                if (D.querySelector(searchTopicListQuery) instanceof HTMLElement) {
                    topicCount = D.querySelector(searchTopicListQuery).querySelectorAll('.avg-content-block').length;
                }
                topicCountDisplay.innerText = `共有 ${topicCount} 条主题`;
                topicCountDisplay.dataset.topicCount = topicCount;
                window.dispatchEvent(
                    new CustomEvent(
                        'topiclistcountfinish', {
                            bubbles: true,
                            cancelable: true
                        }
                    )
                );
            }
        );

        toolBelt.append(topicCountDisplay);

        const autoLoadUntilTotalCountSelect = createElementWithInnerTextAndStyle('select');
        const updateAutoLoadUntilTotalCountSelectOptions = () => {
            while (autoLoadUntilTotalCountSelect.firstChild) {
                autoLoadUntilTotalCountSelect.removeChild(autoLoadUntilTotalCountSelect.firstChild);
            }
            const hintOption = createElementWithInnerTextAndStyle('option', '--- 仅在当前页面生效 ---');
            hintOption.value = 0 - Math.round(Math.random() * 1000);
            hintOption.disabled = true;
            autoLoadUntilTotalCountSelect.append(hintOption);
            const defaultOption = createElementWithInnerTextAndStyle('option', '--- 不启动自动读取 ---');
            defaultOption.value = 0 - Math.round(Math.random() * 1000);
            autoLoadUntilTotalCountSelect.append(defaultOption);
            autoLoadUntilTotalCountSelect.value = defaultOption.value;
            const loadUntilTotalCountOption = [
                50,
                150,
                350,
                650,
                1050
            ];
            for (const totalCount of loadUntilTotalCountOption) {
                const option = createElementWithInnerTextAndStyle('option', `读取至少 ${totalCount} 条主题`);
                option.value = totalCount;
                autoLoadUntilTotalCountSelect.append(option);
            }
        };
        updateAutoLoadUntilTotalCountSelectOptions();
        const attemptLoadMore = () => {
            const loadMoreButton = D.querySelector('.avg-load-more-footer.list-load-more button.avg-button');
            if (loadMoreButton instanceof HTMLElement) {
                loadMoreButton.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                }));
                return true;
            }
            return false;
        };
        const autoLoadUntilTotalCountHandler = () => {
            const desiredTopicCount = parseInt(autoLoadUntilTotalCountSelect.value, 10);
            const currentTopicCount = parseInt(topicCountDisplay.dataset.topicCount, 10);
            if (desiredTopicCount < 0) {
                return;
            }
            if (desiredTopicCount > currentTopicCount) {
                if (attemptLoadMore()) {
                    if (getAllSortConfigs().length > 0) {
                        createToastWithText('正在读取更多主题\n自动读取启用时建议取消勾选排序选项');
                    } else {
                        createToastWithText('正在读取更多主题');
                    }
                } else {
                    createToastWithText('没有更多主题可供读取\n页面可能不支持无限滚动');
                }
            }
        };
        autoLoadUntilTotalCountSelect.addEventListener(
            'change',
            autoLoadUntilTotalCountHandler
        );
        window.addEventListener(
            'topiclistcountfinish',
            autoLoadUntilTotalCountHandler
        );

        toolBelt.append(autoLoadUntilTotalCountSelect);

        addExpandAndShrinkButtonToToolBelt(toolBelt);

        D.body.append(toolBelt);
    };

    // topic list can load everywhere, thanks to SPA
    createTopicListToolBelt();

    const createPageMagic = () => {
        // auto agreed to tos
        onElementEventTypesByClassList(
            ['mouseover', 'focusin'],
            ['avg-login-form'],
            () => {
                const tosCheckbox = event.target.parentElement.querySelector('.avg-login-agree-info button');
                if (tosCheckbox instanceof HTMLElement && !tosCheckbox.classList.contains('checked')) {
                    createToastWithText('自动同意条款与政策');
                    tosCheckbox.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true
                    }));
                }
            }
        );

        const isCommentReportAutoCopyEnabled = () => getBinaryIntByStorageKey(`${VER}-${E('启用话题页面发言报告自动复制')}`) === 1;
        const copyCommentReport = () => {
            const {
                userName,
                authorId
            } = myUserNameAndAuthorIdStore.getMyUserNameAndAuthorId();
            copyFormattedReportForCurrentPageByUserNameAndAuthorId(userName, authorId, true);
            createToastWithText('报告复制成功✓');
        };

        // submit on ctrl + enter
        window.addEventListener(
            'keypress',
            (event) => {
                const {
                    keyCode,
                    ctrlKey,
                    shiftKey,
                    altKey
                } = event;
                if (keyCode === 13 && (ctrlKey || shiftKey || altKey)) {
                    if (
                        D.activeElement instanceof HTMLElement &&
                        D.activeElement.classList.contains('text-input')
                    ) {
                        let currentElement = D.activeElement;
                        let commentInputArea = null;
                        while (currentElement instanceof HTMLElement) {
                            if (currentElement.classList.contains('comment-input-area')) {
                                commentInputArea = currentElement;
                                break;
                            } else {
                                currentElement = currentElement.parentElement;
                            }
                        }
                        if (
                            commentInputArea instanceof HTMLElement &&
                            commentInputArea.querySelector('button.avg-button.avg-button-primary') instanceof HTMLElement
                        ) {
                            const submit = commentInputArea.querySelector('button.avg-button.avg-button-primary');
                            createToastWithText('正在使用快捷键提交');
                            event.preventDefault();
                            if (isCommentReportAutoCopyEnabled()) {
                                // copy before submit to avoid delay
                                copyCommentReport();
                            }
                            submit.dispatchEvent(
                                new MouseEvent(
                                    'click', {
                                        bubbles: true,
                                        cancelable: true
                                    }
                                )
                            );
                        }
                    }
                }
            }
        );

        // copy formatted report on submit button click
        onElementEventTypesByClassList(
            ['click'],
            ['submit-button', 'avg-button', 'avg-button-primary'],
            (event) => {
                if (isCommentReportAutoCopyEnabled()) {
                    copyCommentReport();
                }
            }
        );

        // copy formatted report on submit button click
        onElementEventTypesByClassList(
            ['click'],
            ['avg-button-text'],
            (event) => {
                if (isCommentReportAutoCopyEnabled()) {
                    copyCommentReport();
                }
            }
        );

        // show topic insight
        const fetchTopicDetail = (element, myAuthorId = -1) => {
            if (element.querySelector('.topic-detail') !== null) {
                return;
            }

            // topic detail block creation
            const topicDetail = createElementWithInnerTextAndStyle(
                'div',
                null, {
                    margin: '1em 0',
                    lineHeight: '2em'
                }
            );
            topicDetail.classList.add('topic-detail');
            const contentBlock = element.classList.contains('avg-content-block') ? element : element.querySelector('.avg-content-block');
            const itemContent = contentBlock.querySelector(':scope > .item-content');
            if (itemContent instanceof HTMLElement) {
                contentBlock.insertBefore(topicDetail, itemContent);
            } else {
                // not on topic search result
                createToastWithText('页面可能不包含主题 - 对象结构无法探知');
                console.error('页面可能不包含主题 - 对象结构无法探知', contentBlock);
                return;
            }

            // topic option block creation
            const topicOption = createElementWithInnerTextAndStyle(
                'div',
                null, {
                    margin: '1em 0',
                    lineHeight: '2em'
                }
            );
            topicOption.classList.add('topic-option');
            contentBlock.prepend(topicOption);

            let topicId = -1;
            if (
                element.querySelector('.avg-content-block') instanceof HTMLElement &&
                typeof element.querySelector('.avg-content-block').id === 'string'
            ) {
                const contentBlockId = element.querySelector('.avg-content-block').id;
                const idRegex = new RegExp(/\d+$/);
                if (contentBlockId.match(idRegex) && contentBlockId.match(idRegex)[0]) {
                    topicId = contentBlockId.match(idRegex)[0];
                } else {
                    createToastWithText('页面可能包含主题 - 但无法通过结构探知取得 topicId');
                    console.error('页面可能包含主题 - 但无法通过结构探知取得 topicId', element.querySelector('.avg-content-block'));
                    return;
                }
            } else if (element.querySelector('.content-body') instanceof HTMLElement) {
                // fallback to simulated mouse click
                let topicHref = '';
                const originalOpen = unsafeWindow.open;
                unsafeWindow.open = (href) => {
                    topicHref = href
                };
                element.querySelector('.content-body').dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                }));
                unsafeWindow.open = originalOpen;
                if (topicHref.startsWith('/topic/detail/')) {
                    // topicHref should be shaped like '/topic/detail/123456'
                    topicId = topicHref.replace('/topic/detail/', '');
                } else {
                    createToastWithText('页面可能包含主题 - 但无法通过模拟点击取得 topicId');
                    console.error('页面可能包含主题 - 但无法通过模拟点击取得 topicId', element.querySelector('.content-body'));
                    return;
                }
            } else {
                createToastWithText('详情加载失败 - 无法取得 topicId');
                console.error('详情加载失败 - 无法取得 topicId', contentBlock);
                return;
            }
            const topicEndpoint = new URL(L.href);
            topicEndpoint.search = '';
            topicEndpoint.pathname = `/avg-portal-api/topic/${topicId}`;
            const commentEndpoint = new URL(L.href);
            commentEndpoint.search = '';
            commentEndpoint.pathname = `/avg-portal-api/topic/${topicId}/comment/new`;
            if (!!getCsrfToken()) {
                const params = {
                    csrf_token: getCsrfToken()
                };
                Object.keys(params).forEach(key => topicEndpoint.searchParams.append(key, params[key]));
                Object.keys(params).forEach(key => commentEndpoint.searchParams.append(key, params[key]));
            }

            return Promise.all([fetch(topicEndpoint), fetch(commentEndpoint)]).then(
                ([tr, cr]) => Promise.all([tr.json(), cr.json()])
            ).then(
                async ([topicResult, commentResult]) => {
                    const {
                        state: {
                            code: topicCode,
                            message: topicMessage
                        } = {
                            code: 0,
                            message: '未知错误'
                        }
                    } = topicResult;
                    const {
                        state: {
                            code: commentCode,
                            message: commentMessage
                        } = {
                            code: 0,
                            message: '未知错误'
                        }
                    } = commentResult;
                    if (topicCode !== 200000 || commentCode !== 200000) {
                        createToastWithText(`${topicId} 详情加载错误 - 内容：${topicMessage} - 回复：${commentMessage}`);
                        console.error(`${topicId} 详情加载错误 - 内容：${topicMessage} - 回复：${commentMessage}`);
                    } else {
                        const {
                            data: topicData
                        } = topicResult;
                        // console.warn('=== topicData ===', topicData.id, topicData)
                        const {
                            clickCount = -1,
                                commentCount = -1,
                                favoriteCount = -1,
                                authorId = -1,
                                createTime = 0,
                                author: {
                                    verificationInfo = '',
                                    lv = -1,
                                    vip = 0
                                } = {
                                    verificationInfo: '',
                                    lv: -1,
                                    vip: 0
                                },
                                authorName = '无名氏',
                                content = '',
                                imageInfo = '',
                                audioInfo = '',
                                videoInfo = '',
                                themes = []
                        } = topicData;
                        const vipStatus = vip === 1 ? 'VIP 用户' : '';
                        const parseCountFromInfo = (info) => {
                            let count = 0;
                            if (info.length > 0) {
                                try {
                                    count = JSON.parse(info).length;
                                } catch (err) {
                                    count = -1;
                                    createToastWithText(`${topicId} 回复数量计算错误`);
                                    console.error(`${topicId} 回复数量计算错误`, err);
                                }
                            }
                            return count;
                        };
                        const imageCount = parseCountFromInfo(imageInfo);
                        const audioCount = parseCountFromInfo(audioInfo);
                        const videoCount = parseCountFromInfo(videoInfo);
                        const charCount = escape(content).split('%u').length - 1;
                        const valueStyle = {
                            margin: '0 0.1em',
                            color: 'red'
                        };
                        const highlightStyle = {
                            color: 'red',
                            borderRadius: '2em',
                            padding: '0.25em 0.8em',
                            color: 'white',
                            backgroundColor: 'red'
                        };
                        const defaultStyle = {
                            margin: '0 0.1em'
                        };
                        const {
                            data: commentData
                        } = commentResult;
                        // console.warn('=== commentData ===', topicData.id, commentData)
                        const createDetailInParent = (parentElement) => {
                            if (!!vipStatus) {
                                parentElement.append(
                                    createElementWithInnerTextAndStyle('span', vipStatus, valueStyle)
                                );
                            }
                            parentElement.append(
                                createElementWithInnerTextAndStyle('span', '发布于', defaultStyle)
                            );
                            parentElement.append(
                                createElementWithInnerTextAndStyle('span', (new Date(createTime)).toLocaleString(), valueStyle)
                            );
                            parentElement.append(
                                createElementWithInnerTextAndStyle('span', '共', defaultStyle)
                            );
                            parentElement.append(
                                createElementWithInnerTextAndStyle('span', String(charCount), valueStyle)
                            );
                            parentElement.append(
                                createElementWithInnerTextAndStyle('span', '字 总点击', defaultStyle)
                            );
                            parentElement.append(
                                createElementWithInnerTextAndStyle('span', String(clickCount), valueStyle)
                            );
                            parentElement.append(
                                createElementWithInnerTextAndStyle('span', '总评论', defaultStyle)
                            );
                            parentElement.append(
                                createElementWithInnerTextAndStyle('span', String(commentCount), valueStyle)
                            );
                            parentElement.append(
                                createElementWithInnerTextAndStyle('span', '总收藏', defaultStyle)
                            );
                            parentElement.append(
                                createElementWithInnerTextAndStyle('span', String(favoriteCount), valueStyle)
                            );
                            [imageCount, audioCount, videoCount].forEach(
                                (count, idx) => {
                                    if (count !== 0) {
                                        const label = ['图片', '音频', '视频'];
                                        parentElement.append(
                                            createElementWithInnerTextAndStyle('span', label[idx], defaultStyle)
                                        );
                                        parentElement.append(
                                            createElementWithInnerTextAndStyle('span', String(count), valueStyle)
                                        );
                                    }
                                }
                            );
                            const myCommentsCount = getCommentsCountFromDataByAuthorId(commentData, myAuthorId);
                            if (myCommentsCount > 0) {
                                parentElement.append(createElementWithInnerTextAndStyle('br'));
                                parentElement.append(
                                    createElementWithInnerTextAndStyle('span', `已经回复了 ${myCommentsCount} 次`, highlightStyle)
                                );
                            }

                            // dataset assigning for sorting
                            Object.assign(
                                parentElement.dataset, {
                                    authorName,
                                    authorId,
                                    vip,
                                    clickCount,
                                    commentCount,
                                    favoriteCount,
                                    imageCount,
                                    audioCount,
                                    videoCount,
                                    charCount,
                                    myCommentsCount,
                                    createTime
                                }
                            );
                        };
                        createDetailInParent(topicDetail);
                        const createOptionInParent = (parentElement) => {
                            const hideTopicFromAuthorButton = createElementWithInnerTextAndStyle(
                                'button',
                                '隐藏此作者的主题', {
                                    padding: '0.5em'
                                }
                            );
                            hideTopicFromAuthorButton.classList.add('hide-topic-from-author');
                            hideTopicFromAuthorButton.addEventListener(
                                'click',
                                () => {
                                    addHiddenAuthorByIdAndName(authorId, authorName);
                                    window.dispatchEvent(
                                        new CustomEvent(
                                            'topicdisplaytoggle', {
                                                detail: {
                                                    authorId,
                                                    display: false
                                                },
                                                bubbles: true,
                                                cancelable: true
                                            }
                                        )
                                    );
                                    createToastWithText(`已经设置对作者 ${authorName} 的隐藏`);
                                }
                            );
                            parentElement.append(hideTopicFromAuthorButton);
                        };
                        createOptionInParent(topicOption);

                        // event based automata
                        const handleTopicDisplay = (display) => {
                            const getCurrentDisplayStatus = () => {
                                let display = true;
                                for (const child of contentBlock.children) {
                                    if (!child.classList.contains('topic-option')) {
                                        if (child.style.display === 'none') {
                                            display = false;
                                            break;
                                        }
                                    }
                                }
                                return display;
                            };
                            for (const child of contentBlock.children) {
                                if (!child.classList.contains('topic-option')) {
                                    child.style.display = display ? '' : 'none';
                                }
                            }
                            const hideTopicFromAuthorButton = topicOption.querySelector('.hide-topic-from-author');
                            if (hideTopicFromAuthorButton instanceof HTMLElement) {
                                hideTopicFromAuthorButton.style.display = display ? '' : 'none';
                            }
                            const toggleTopicDisplayButton = topicOption.querySelector('.toggle-topic-display');
                            if (!display) {
                                const getTopicDisplayButtonText = () => getCurrentDisplayStatus() ? '已隐藏该作者 - 不想看了' : '已隐藏该作者 - 想看一眼';
                                if (!(toggleTopicDisplayButton instanceof HTMLElement)) {
                                    // add a button to toggle current display
                                    const toggleTopicDisplayButton = createElementWithInnerTextAndStyle(
                                        'button',
                                        getTopicDisplayButtonText(), {
                                            padding: '0.5em'
                                        }
                                    );
                                    toggleTopicDisplayButton.classList.add('toggle-topic-display');
                                    toggleTopicDisplayButton.addEventListener(
                                        'click',
                                        () => {
                                            const currentDisplayStatus = getCurrentDisplayStatus();
                                            for (const child of contentBlock.children) {
                                                if (!child.classList.contains('topic-option')) {
                                                    child.style.display = !currentDisplayStatus ? '' : 'none';
                                                }
                                            }
                                            toggleTopicDisplayButton.innerText = getTopicDisplayButtonText();
                                        }
                                    );
                                    topicOption.append(toggleTopicDisplayButton);
                                } else {
                                    toggleTopicDisplayButton.innerText = getTopicDisplayButtonText();
                                }
                            } else {
                                // author removed from hidden list
                                if (toggleTopicDisplayButton instanceof HTMLElement) {
                                    topicOption.removeChild(toggleTopicDisplayButton);
                                }
                            }
                        };
                        handleTopicDisplay(!isAuthorIdHidden(authorId));
                        window.addEventListener(
                            'topicdisplaytoggle',
                            (event) => {
                                const {
                                    detail: {
                                        authorId: targetAuthorId = -1,
                                        display = true
                                    }
                                } = event;
                                if (targetAuthorId === authorId) {
                                    handleTopicDisplay(display);
                                }
                            }
                        );
                    }
                }
            ).catch(
                (err) => {
                    createToastWithText(`${topicId} 详情加载失败`);
                    console.error(`${topicId} 详情加载失败`, err);
                }
            );
        };

        // remember to disconnect observer before calling this
        const sortTopicsWithParentQuery = (parentQuery, memorize) => {
            // last sort means highest priority
            const sortConfigs = getAllSortConfigs().reverse();
            if (sortConfigs.length > 0) {
                const compares = [];
                for (const {
                        field,
                        order
                    } of sortConfigs) {
                    const compare = (l, r) => {
                        const getDataset = (element) => {
                            if (element instanceof HTMLElement) {
                                const topicDetail = element.querySelector('.topic-detail');
                                if (topicDetail instanceof HTMLElement) {
                                    return topicDetail.dataset;
                                }
                            }
                            return null;
                        };

                        if (
                            getDataset(l) !== null && getDataset(r) !== null &&
                            typeof getDataset(l)[field] !== 'undefined' &&
                            typeof getDataset(r)[field] !== 'undefined'
                        ) {
                            switch (order) {
                                case 'DESC':
                                    return getDataset(r)[field] - getDataset(l)[field];
                                case 'ASC':
                                default:
                                    return getDataset(l)[field] - getDataset(r)[field];
                            }
                        }
                        return 0;
                    };
                    compares.push(compare);
                }
                sortHTMLElementsInParentByQueryAndCompare(
                    parentQuery,
                    compares,
                    memorize
                );
                createToastWithText('主题列表排序完成');
            }
        };

        const singletonMutationObserverStore = (() => {
            let disconnect = () => {};
            let reconnect = () => {};
            let getObserver = () => null;
            return {
                saveObserverArtifacts: ({
                    disconnect: originalDisconnect,
                    reconnect: originalReconnect,
                    getObserver: originalGetObserver
                }) => {
                    disconnect = originalDisconnect;
                    reconnect = originalReconnect;
                    getObserver = originalGetObserver;
                },
                disconnect: () => disconnect(),
                reconnect: () => reconnect(),
                getObserver: () => getObserver()
            };
        })();

        const topicListOrderMemorizeStore = createOrderMemorizeStore();

        window.addEventListener(
            'topiclistreadytosort',
            () => {
                singletonMutationObserverStore.disconnect();
                if (D.querySelector(communityTopicListQuery) instanceof HTMLElement) {
                    sortTopicsWithParentQuery(communityTopicListQuery, topicListOrderMemorizeStore.memorize);
                }
                if (D.querySelector(searchTopicListQuery) instanceof HTMLElement) {
                    sortTopicsWithParentQuery(searchTopicListQuery, topicListOrderMemorizeStore.memorize);
                }
                singletonMutationObserverStore.reconnect();
            }
        );

        window.addEventListener(
            'topiclistreadytorestore',
            () => {
                singletonMutationObserverStore.disconnect();
                if (D.querySelector(communityTopicListQuery) instanceof HTMLElement) {
                    restoreHTMLElementsOrderInParentByQueryAndOriginalIndexGetter(
                        communityTopicListQuery,
                        topicListOrderMemorizeStore.getOriginalIndexByElement
                    );
                }
                if (D.querySelector(searchTopicListQuery) instanceof HTMLElement) {
                    restoreHTMLElementsOrderInParentByQueryAndOriginalIndexGetter(
                        searchTopicListQuery,
                        topicListOrderMemorizeStore.getOriginalIndexByElement
                    );
                }
                singletonMutationObserverStore.reconnect();
            }
        );

        const {
            topicObserveStartCallback,
            topicNodeAddedCallback
        } = (() => {
            let myCurrentAuthorIdPromise = Promise.resolve(-1);
            const debounceSort = createDebouncerByTimeout(
                () => createToastWithText('侦测到主题列表发生变动'),
                () => {
                    window.dispatchEvent(
                        new CustomEvent(
                            'topiclistreadytosort', {
                                bubbles: true,
                                cancelable: true
                            }
                        )
                    );
                    window.dispatchEvent(
                        new CustomEvent(
                            'topiclistreadytocount', {
                                bubbles: true,
                                cancelable: true
                            }
                        )
                    );
                }
            );
            const topicObserveStartCallback = () => {
                createToastWithText('自动读取主题详情已启用');
                // clear topic list order memorize store
                topicListOrderMemorizeStore.clear();
                // we only upadte authorId once when observe start
                myCurrentAuthorIdPromise = getMyAuthorId();
                const topicListToolBelt = D.querySelector('.topic-list-tool-belt');
                if (topicListToolBelt instanceof HTMLElement) {
                    topicListToolBelt.style.display = '';
                }
            };
            const topicNodeAddedCallback = async (element) => {
                const myCurrentAuthorId = await myCurrentAuthorIdPromise;
                const fetchTopicDetailFinished = await fetchTopicDetail(element, myCurrentAuthorId);
                debounceSort();
                return fetchTopicDetailFinished;
            };
            return {
                topicObserveStartCallback,
                topicNodeAddedCallback
            };
        })();

        const addSingletonListObserver = createSingletonObserverByQueryAndClassList(
            communityTopicListQuery,
            ['avg-list-line'],
            topicObserveStartCallback,
            topicNodeAddedCallback
        );

        const addDedupListInit = (() => {
            let targetNode = null;
            const addListInit = async (event, element) => {
                if (targetNode === element) {
                    return;
                }
                targetNode = element;
                const myAuthorId = await getMyAuthorId();
                const allFetchTopicDetailPromises = [...element.querySelectorAll('.avg-list-line')].map(
                    (element) => fetchTopicDetail(element, myAuthorId)
                );
                await Promise.all(allFetchTopicDetailPromises);
                sortTopicsWithParentQuery(communityTopicListQuery);
                singletonMutationObserverStore.saveObserverArtifacts(addSingletonListObserver());
                window.dispatchEvent(
                    new CustomEvent(
                        'topiclistreadytocount', {
                            bubbles: true,
                            cancelable: true
                        }
                    )
                );
            };
            return addListInit;
        })();

        onElementEventTypesByClassList(
            ['mouseover'],
            ['avg-list', 'forums-list'],
            addDedupListInit
        );

        const addSingletonSearchObserver = createSingletonObserverByQueryAndClassList(
            searchTopicListQuery,
            ['avg-forums-list-item', 'avg-content-block'],
            topicObserveStartCallback,
            topicNodeAddedCallback
        );

        const addDedupSearchInit = (() => {
            let targetNode = null;
            const addSearchInit = async (event, element) => {
                if (targetNode === element) {
                    return;
                }
                targetNode = element;
                const myAuthorId = await getMyAuthorId();
                const allFetchTopicDetailPromises = [...element.querySelectorAll('.avg-forums-list-item.avg-content-block')].map(
                    (element) => fetchTopicDetail(element, myAuthorId)
                );
                await Promise.all(allFetchTopicDetailPromises);
                sortTopicsWithParentQuery(searchTopicListQuery);
                singletonMutationObserverStore.saveObserverArtifacts(addSingletonSearchObserver());
                window.dispatchEvent(
                    new CustomEvent(
                        'topiclistreadytocount', {
                            bubbles: true,
                            cancelable: true
                        }
                    )
                );
            };
            return addSearchInit;
        })();

        onElementEventTypesByClassList(
            ['mouseover'],
            ['search-result-container'],
            addDedupSearchInit
        );
    };

    createPageMagic();
})();