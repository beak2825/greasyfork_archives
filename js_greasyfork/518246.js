// ==UserScript==
// @name              bilibili favlist hidden video detection
// @name:zh-CN        哔哩哔哩(B站|Bilibili)收藏夹Fix (检测隐藏视频)
// @name:zh-TW        哔哩哔哩(B站|Bilibili)收藏夹Fix (检测隐藏视频)
// @namespace         http://tampermonkey.net/
// @version           16
// @description       detect videos in favlist that only visiable to upper
// @description:zh-CN 检测收藏夹中被UP主设置为仅自己可见的视频
// @description:zh-TW 检测收藏夹中被UP主设置为仅自己可见的视频
// @author            YTB0710
// @match             https://space.bilibili.com/*
// @connect           bilibili.com
// @grant             GM_openInTab
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_xmlhttpRequest
// @grant             GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/518246/bilibili%20favlist%20hidden%20video%20detection.user.js
// @updateURL https://update.greasyfork.org/scripts/518246/bilibili%20favlist%20hidden%20video%20detection.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const AVRegex = /^[1-9]\d*$/;
    const BVRegex = /^BV[A-Za-z0-9]{10}$/;
    const startsWithAVRegex = /^av/i;
    const favlistURLRegex = /https:\/\/space\.bilibili\.com\/\d+\/favlist.*/;
    const getFidFromURLRegex = /fid=(\d+)/;
    const getUIDFromURLRegex = /https:\/\/space\.bilibili\.com\/(\d+)/;
    const getBVFromURLRegex = /video\/(\w+)/;
    const getHttpsFromURLRegex = /^(https?:\/\/|\/\/)/;
    const getAvifFromURLRegex = /@.*/;

    let onFavlistPage = false;
    let debug = false;
    let newFreshSpace;
    let classAppendNewFreshSpace;
    let pageSize;
    let divMessage;
    let divMessageHeightFixed = false;
    let order = 'mtime';
    const activeControllers = new Set();

    let removeURL = 1;
    let type = 2;

    const detectionScope2Range = {
        apiURL1DetectionScope2RangeStart: 1,
        apiURL1DetectionScope2RangeEnd: 1000,
        apiURL2DetectionScope2RangeStart: 1,
        apiURL2DetectionScope2RangeEnd: 200
    };

    const settings = {
        ...{
            apiURL: 1, // v9
            apiURL1DetectionScope: 1, // v8 v9 v15
            apiURL2DetectionScope: 1, // v14 v15
            displayAdvancedControls: false, // v14
            apiDelay: 500, // v13 v14
            divMessageHeight: 25, // v14
            addMessageJumpRemoveAdd: false, // v14
            autoClearMessage: true, // v9
            detectionScope2DisplayPosition: false, // v16
            apiURL2DisplayTime: true, // v16
        },
        ...GM_getValue('settings', null)
    };

    ///////////////////////////////////////////////////////////////////////////////////
    // debug = true;
    // settings.apiDelay = 300;
    // v9
    if (GM_getValue('detectionScope', '')) {
        settings.apiURL1DetectionScope = GM_getValue('detectionScope', '');
        GM_setValue('detectionScope', '');
        GM_setValue('settings', settings);
    }
    // v14
    if (settings.hasOwnProperty('apiURL1Delay')) {
        settings.apiDelay = settings.apiURL1Delay;
        delete settings.apiURL1Delay;
        GM_setValue('settings', settings);
    }
    // v15
    if (typeof settings.apiURL1DetectionScope === 'string') {
        settings.apiURL1DetectionScope = settings.apiURL1DetectionScope === 'page' ? 1 : 2;
        GM_setValue('settings', settings);
    }
    // v15
    if (typeof settings.apiURL2DetectionScope === 'string') {
        settings.apiURL2DetectionScope = settings.apiURL2DetectionScope === 'page' ? 1 : 2;
        GM_setValue('settings', settings);
    }
    ///////////////////////////////////////////////////////////////////////////////////

    const sideObserver = new MutationObserver((_mutations, observer) => {
        if (document.querySelector('div.favlist-aside')) {
            observer.disconnect();
            newFreshSpace = true;
            classAppendNewFreshSpace = '-newFreshSpace';
            pageSize = window.innerWidth < 1760 ? 40 : 36;
            initControls();
            radioFilterObserver.observe(document.querySelector('div.fav-list-header-filter__left > div'), { subtree: true, characterData: false, attributeFilter: ['class'] });
            headerFilterLeftChildListObserver.observe(document.querySelector('div.fav-list-header-filter__left'), { childList: true, attributes: false, characterData: false });
            return;
        }
        if (document.querySelector('div.fav-sidenav')) {
            observer.disconnect();
            newFreshSpace = false;
            classAppendNewFreshSpace = '';
            pageSize = 20;
            initControls();
            return;
        }
    });

    const radioFilterObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.target.classList.contains('radio-filter__item--active')) {
                const orderText = mutation.target.textContent;
                if (orderText.includes('收藏')) {
                    order = 'mtime';
                } else if (orderText.includes('播放')) {
                    order = 'view';
                } else if (orderText.includes('投稿')) {
                    order = 'pubtime';
                } else {
                    addMessage('无法确定各个视频的排序方式, 请反馈该问题', false, 'red');
                }
            }
        }
    });

    const headerFilterLeftChildListObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.nodeType === 1 && addedNode.classList.contains('radio-filter')) {
                    order = 'mtime';
                    radioFilterObserver.observe(addedNode, { subtree: true, characterData: false, attributeFilter: ['class'] });
                }
            }
            for (const removedNode of mutation.removedNodes) {
                if (removedNode.nodeType === 1 && removedNode.classList.contains('radio-filter')) {
                    radioFilterObserver.disconnect();
                }
            }
        }
    });

    checkURL();

    const originalPushState = history.pushState;
    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        checkURL();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        checkURL();
    };

    window.addEventListener('popstate', checkURL);

    function checkURL() {
        if (favlistURLRegex.test(location.href)) {
            if (!onFavlistPage) {
                onFavlistPage = true;
                sideObserver.observe(document.body, { subtree: true, childList: true, attributes: false, characterData: false });
            }
        } else {
            if (onFavlistPage) {
                abortActiveControllers();
                onFavlistPage = false;
                sideObserver.disconnect();
            }
        }
    }

    function initControls() {

        const style = document.createElement('style');
        style.textContent = `
            .detect-div-first {
                padding: 2px;
            }
            .detect-div-first-newFreshSpace {
                padding: 2px 0;
            }
            .detect-div-second {
                padding: 2px 0 2px 16px;
            }
            .detect-div-second-newFreshSpace {
                padding: 2px 0 2px 16px;
            }
            .detect-button, .detect-button-newFreshSpace {
                border: 1px solid var(--Ga3, #cccccc);
                color: var(--Ga10, #000000);
                background-color: var(--Ga1, #f0f0f0);
                line-height: 1;
                cursor: pointer;
            }
            .detect-button {
                border-radius: 2px;
                padding: 2px;
                font-size: 14px;
            }
            .detect-button-newFreshSpace {
                border-radius: 3px;
                padding: 3px;
                font-size: 16px;
            }
            .detect-label, .detect-label-newFreshSpace {
                line-height: 1;
            }
            .detect-inputCheckbox, .detect-inputCheckbox-newFreshSpace {
                margin-left: 0;
            }
            .detect-inputCheckbox {
                margin-right: 1px;
            }
            .detect-inputCheckbox-newFreshSpace {
                margin-right: 3px;
            }
            .detect-inputRadio, .detect-inputRadio-newFreshSpace {
                margin-left: 0;
            }
            .detect-inputRadio {
                margin-right: 1px;
            }
            .detect-inputRadio-newFreshSpace {
                margin-right: 3px;
            }
            .detect-inputText1, .detect-inputText1-newFreshSpace {
                box-sizing: content-box;
                border: 1px solid var(--Ga3, #cccccc);
                color: var(--Ga10, #000000);
                background-color: var(--Ga0, #ffffff);
                line-height: 1;
            }
            .detect-inputText1 {
                width: 140px;
                height: 14px;
                border-radius: 2px;
                padding: 2px;
                font-size: 14px;
            }
            .detect-inputText1-newFreshSpace {
                width: 160px;
                height: 16px;
                border-radius: 3px;
                padding: 3px;
                font-size: 16px;
            }
            .detect-inputText2, .detect-inputText2-newFreshSpace {
                box-sizing: content-box;
                border: 1px solid var(--Ga3, #cccccc);
                color: var(--Ga10, #000000);
                background-color: var(--Ga0, #ffffff);
                padding: 1px 2px;
                line-height: 1;
            }
            .detect-inputText2 {
                width: 28px;
                height: 14px;
                border-radius: 2px;
                font-size: 14px;
            }
            .detect-inputText2-newFreshSpace {
                width: 32px;
                height: 16px;
                border-radius: 3px;
                font-size: 16px;
            }
            .detect-inputText3, .detect-inputText3-newFreshSpace {
                box-sizing: content-box;
                border: 1px solid var(--Ga3, #cccccc);
                color: var(--Ga10, #000000);
                background-color: var(--Ga0, #ffffff);
                padding: 1px 2px;
                line-height: 1;
            }
            .detect-inputText3 {
                width: 56px;
                height: 14px;
                border-radius: 2px;
                font-size: 14px;
            }
            .detect-inputText3-newFreshSpace {
                width: 64px;
                height: 16px;
                border-radius: 3px;
                font-size: 16px;
            }
            .detect-divMessage, .detect-divMessage-newFreshSpace {
                overflow-y: auto;
                background-color: var(--Ga1, #eeeeee);
                line-height: 1.5;
                scrollbar-width: none;
            }
            .detect-divMessage {
                margin: 2px;
            }
            .detect-divMessage::-webkit-scrollbar {
                display: none;
            }
            .detect-divMessage-newFreshSpace {
                margin: 2px 0;
            }
            .detect-divMessage-newFreshSpace::-webkit-scrollbar {
                display: none;
            }
            .detect-disabled, .detect-disabled-newFreshSpace {
                opacity: 0.5;
                pointer-events: none;
            }
            .detect-hidden, .detect-hidden-newFreshSpace {
                display: none;
            }
        `;
        document.head.appendChild(style);

        const styleDivMessageHeightFixed = document.createElement('style');
        styleDivMessageHeightFixed.id = 'detect-style-divMessage-heightFixed';
        styleDivMessageHeightFixed.textContent = `
            .detect-divMessage-heightFixed {
                height: ${settings.divMessageHeight * 18}px;
            }
            .detect-divMessage-heightFixed-newFreshSpace {
                height: ${settings.divMessageHeight * 20}px;
            }
        `;
        document.head.appendChild(styleDivMessageHeightFixed);

        const divSide = document.querySelector(newFreshSpace ? 'div.favlist-aside' : 'div.fav-sidenav');
        if (!newFreshSpace && divSide.querySelector('a.watch-later')) {
            divSide.querySelector('a.watch-later').style.borderBottom = '1px solid #eeeeee';
        }

        const divControls = document.createElement('div');
        divControls.classList.add('detect-div-first' + classAppendNewFreshSpace);
        divControls.style.color = 'var(--Ga10, #000000)';
        if (!newFreshSpace) {
            divControls.style.borderTop = '1px solid #e4e9f0';
        }
        divSide.appendChild(divControls);

        const divInputTextAVBV = document.createElement('div');
        divInputTextAVBV.classList.add('detect-div-first' + classAppendNewFreshSpace);
        divControls.appendChild(divInputTextAVBV);

        const inputTextAVBV = document.createElement('input');
        inputTextAVBV.type = 'text';
        inputTextAVBV.classList.add('detect-inputText1' + classAppendNewFreshSpace);
        inputTextAVBV.placeholder = '输入AV号或BV号';
        divInputTextAVBV.appendChild(inputTextAVBV);

        const divButtonDetect = document.createElement('div');
        divButtonDetect.classList.add('detect-div-first' + classAppendNewFreshSpace);
        divButtonDetect.setAttribute('title',
            '接口1和接口2在未来可能会失效。');
        divControls.appendChild(divButtonDetect);

        const buttonDetect = document.createElement('button');
        buttonDetect.type = 'button';
        buttonDetect.classList.add('detect-button' + classAppendNewFreshSpace);
        buttonDetect.textContent = '检测隐藏视频';
        buttonDetect.addEventListener('click', async () => {

            abortActiveControllers();
            let controller;

            try {

                controller = new AbortController();
                activeControllers.add(controller);

                if (settings.autoClearMessage) {
                    clearMessage();
                }

                let currentFavlist;
                if (newFreshSpace) {
                    currentFavlist = document.querySelector('div.vui_sidebar-item--active');
                    if (!document.querySelector('div.fav-collapse').contains(currentFavlist)) {
                        throw ['不支持处理特殊收藏夹'];
                    }
                } else {
                    currentFavlist = document.querySelector('.fav-item.cur');
                    if (!document.querySelector('div.nav-container').contains(currentFavlist)) {
                        throw ['不支持处理特殊收藏夹'];
                    }
                }

                let fid;
                if (newFreshSpace) {
                    const getFidFromURLMatch = location.href.match(getFidFromURLRegex);
                    if (getFidFromURLMatch) {
                        fid = parseInt(getFidFromURLMatch[1], 10);
                    } else {
                        throw ['无法获取当前收藏夹的fid, 刷新页面可能有帮助'];
                    }
                } else {
                    fid = document.querySelector('.fav-item.cur').getAttribute('fid');
                }

                let pageNumber;
                if (newFreshSpace) {
                    const pagenation = document.querySelector('button.vui_pagenation--btn-num.vui_button--active');
                    if (!pagenation) {
                        pageNumber = 1;
                    } else {
                        pageNumber = parseInt(pagenation.textContent, 10);
                    }
                } else {
                    pageNumber = parseInt(document.querySelector('li.be-pager-item-active > a').textContent, 10);
                }

                let searchKeyword = '';
                const inputKeyword = document.querySelector(newFreshSpace ? 'input.fav-list-header-filter__search' : 'input.search-fav-input');
                if (inputKeyword) {
                    searchKeyword = inputKeyword.value;
                }

                let searchType;
                const divType = document.querySelector(newFreshSpace ? 'div.vui_input__prepend' : 'div.search-types');
                let typeText = '当前';
                if (divType) {
                    typeText = divType.innerText;
                }
                if (newFreshSpace && !searchKeyword) {
                    typeText = '当前';
                }
                if (typeText.includes('当前')) {
                    searchType = 0;
                } else if (typeText.includes('全部')) {
                    searchType = 1;
                } else {
                    throw ['无法确定搜索的范围为当前收藏夹还是全部收藏夹, 请反馈该问题'];
                }

                const defaultFilter = await appendParamsForApiURL2(fid, 1, 20) === `https://api.bilibili.com/medialist/gateway/base/spaceDetail?media_id=${fid}&pn=1&ps=20&keyword=&order=mtime&type=0&tid=0&jsonp=jsonp`;

                if (settings.apiURL === 1) {
                    if (settings.apiURL1DetectionScope === 1) {
                        if (!defaultFilter) {
                            throw ['请刷新页面, 恢复默认的排序方式和筛选条件'];
                        }
                        await apiURL1DetectionScope1(fid, pageNumber);
                    } else {
                        await apiURL1DetectionScope2(fid, defaultFilter, controller, spanDetect);
                    }
                } else {
                    if (settings.apiURL2DetectionScope === 1) {
                        if (searchType) {
                            throw ['不支持搜索范围为全部收藏夹'];
                        }
                        await apiURL2DetectionScope1(fid, pageNumber);
                    } else {
                        await apiURL2DetectionScope2(fid, defaultFilter, controller, spanDetect);
                    }
                }

            } catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'AbortError') {
                        return;
                    }
                    catchUnknownError(error);

                } else {
                    addMessage(error[0], false, 'red');
                    for (let i = 1; i < error.length; i++) {
                        addMessage(error[i], true);
                    }
                }

            } finally {
                activeControllers.delete(controller);
            }
        });
        divButtonDetect.appendChild(buttonDetect);

        const spanDetect = document.createElement('span');
        divButtonDetect.appendChild(spanDetect);

        const divLabelApiURL1 = document.createElement('div');
        divLabelApiURL1.classList.add('detect-div-first' + classAppendNewFreshSpace);
        divLabelApiURL1.setAttribute('title',
            '地址: https://api.bilibili.com/x/v3/fav/resource/ids?media_id={收藏夹fid}&pn={页码}&platform=web\n' +
            '数据: AV号, BV号 (一次请求最多可获取1000个视频, 按最近收藏排序)');
        divControls.appendChild(divLabelApiURL1);

        const labelApiURL1 = document.createElement('label');
        labelApiURL1.classList.add('detect-label' + classAppendNewFreshSpace);
        labelApiURL1.textContent = '从接口1获取数据';
        divLabelApiURL1.appendChild(labelApiURL1);

        const radioApiURL1 = document.createElement('input');
        radioApiURL1.type = 'radio';
        radioApiURL1.classList.add('detect-inputRadio' + classAppendNewFreshSpace);
        radioApiURL1.name = 'apiURL';
        radioApiURL1.value = 1;
        radioApiURL1.checked = settings.apiURL === 1;
        radioApiURL1.addEventListener('change', () => {
            try {
                settings.apiURL = 1;
                divLabelApiURL1DetectionScope1.classList.remove('detect-disabled' + classAppendNewFreshSpace);
                divLabelApiURL1DetectionScope2.classList.remove('detect-disabled' + classAppendNewFreshSpace);
                if (settings.apiURL1DetectionScope === 2) {
                    divLabelApiURL1DetectionScope2Range.classList.remove('detect-disabled' + classAppendNewFreshSpace);
                }
                divLabelApiURL2DetectionScope1.classList.add('detect-disabled' + classAppendNewFreshSpace);
                divLabelApiURL2DetectionScope2.classList.add('detect-disabled' + classAppendNewFreshSpace);
                divLabelApiURL2DetectionScope2Range.classList.add('detect-disabled' + classAppendNewFreshSpace);
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelApiURL1.insertAdjacentElement('afterbegin', radioApiURL1);

        const divLabelApiURL1DetectionScope1 = document.createElement('div');
        divLabelApiURL1DetectionScope1.classList.add('detect-div-second' + classAppendNewFreshSpace, 'detect-disabled' + classAppendNewFreshSpace);
        divLabelApiURL1DetectionScope1.setAttribute('title',
            '如果您刚刚在当前收藏夹添加或移除了视频, 请刷新页面后再使用此功能。\n' +
            '如果您正在使用的其他脚本或插件修改了视频封面和标题的链接地址, 请将其关闭后刷新页面再使用此功能。');
        divControls.appendChild(divLabelApiURL1DetectionScope1);

        const labelApiURL1DetectionScope1 = document.createElement('label');
        labelApiURL1DetectionScope1.classList.add('detect-label' + classAppendNewFreshSpace);
        labelApiURL1DetectionScope1.textContent = '检测当前页';
        divLabelApiURL1DetectionScope1.appendChild(labelApiURL1DetectionScope1);

        const radioApiURL1DetectionScope1 = document.createElement('input');
        radioApiURL1DetectionScope1.type = 'radio';
        radioApiURL1DetectionScope1.classList.add('detect-inputRadio' + classAppendNewFreshSpace);
        radioApiURL1DetectionScope1.name = 'apiURL1DetectionScope';
        radioApiURL1DetectionScope1.value = 1;
        radioApiURL1DetectionScope1.checked = settings.apiURL1DetectionScope === 1;
        radioApiURL1DetectionScope1.addEventListener('change', () => {
            try {
                settings.apiURL1DetectionScope = 1;
                divLabelApiURL1DetectionScope2Range.classList.add('detect-disabled' + classAppendNewFreshSpace);
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelApiURL1DetectionScope1.insertAdjacentElement('afterbegin', radioApiURL1DetectionScope1);

        const divLabelApiURL1DetectionScope2 = document.createElement('div');
        divLabelApiURL1DetectionScope2.classList.add('detect-div-second' + classAppendNewFreshSpace, 'detect-disabled' + classAppendNewFreshSpace);
        divControls.appendChild(divLabelApiURL1DetectionScope2);

        const labelApiURL1DetectionScope2 = document.createElement('label');
        labelApiURL1DetectionScope2.classList.add('detect-label' + classAppendNewFreshSpace);
        labelApiURL1DetectionScope2.textContent = '检测当前收藏夹';
        divLabelApiURL1DetectionScope2.appendChild(labelApiURL1DetectionScope2);

        const radioApiURL1DetectionScope2 = document.createElement('input');
        radioApiURL1DetectionScope2.type = 'radio';
        radioApiURL1DetectionScope2.classList.add('detect-inputRadio' + classAppendNewFreshSpace);
        radioApiURL1DetectionScope2.name = 'apiURL1DetectionScope';
        radioApiURL1DetectionScope2.value = 2;
        radioApiURL1DetectionScope2.checked = settings.apiURL1DetectionScope === 2;
        radioApiURL1DetectionScope2.addEventListener('change', () => {
            try {
                settings.apiURL1DetectionScope = 2;
                divLabelApiURL1DetectionScope2Range.classList.remove('detect-disabled' + classAppendNewFreshSpace);
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelApiURL1DetectionScope2.insertAdjacentElement('afterbegin', radioApiURL1DetectionScope2);

        const divLabelApiURL1DetectionScope2Range = document.createElement('div');
        divLabelApiURL1DetectionScope2Range.classList.add('detect-div-second' + classAppendNewFreshSpace, 'detect-disabled' + classAppendNewFreshSpace);
        divControls.appendChild(divLabelApiURL1DetectionScope2Range);

        const labelApiURL1DetectionScope2RangeStart = document.createElement('label');
        labelApiURL1DetectionScope2RangeStart.classList.add('detect-label' + classAppendNewFreshSpace);
        divLabelApiURL1DetectionScope2Range.appendChild(labelApiURL1DetectionScope2RangeStart);

        const inputTextApiURL1DetectionScope2RangeStart = document.createElement('input');
        inputTextApiURL1DetectionScope2RangeStart.type = 'number';
        inputTextApiURL1DetectionScope2RangeStart.classList.add('detect-inputText3' + classAppendNewFreshSpace);
        inputTextApiURL1DetectionScope2RangeStart.value = 1;
        inputTextApiURL1DetectionScope2RangeStart.min = 1;
        inputTextApiURL1DetectionScope2RangeStart.max = 49001;
        inputTextApiURL1DetectionScope2RangeStart.step = 1000;
        inputTextApiURL1DetectionScope2RangeStart.setAttribute('detect-def', 1);
        inputTextApiURL1DetectionScope2RangeStart.setAttribute('detect-min', 1);
        inputTextApiURL1DetectionScope2RangeStart.setAttribute('detect-max', 49001);
        inputTextApiURL1DetectionScope2RangeStart.setAttribute('detect-step', 1000);
        inputTextApiURL1DetectionScope2RangeStart.setAttribute('detect-setting', 'apiURL1DetectionScope2RangeStart');
        inputTextApiURL1DetectionScope2RangeStart.addEventListener('blur', validateInputTextRangeStart);

        labelApiURL1DetectionScope2RangeStart.appendChild(document.createTextNode('范围'));
        labelApiURL1DetectionScope2RangeStart.appendChild(inputTextApiURL1DetectionScope2RangeStart);

        const labelApiURL1DetectionScope2RangeEnd = document.createElement('label');
        labelApiURL1DetectionScope2RangeEnd.classList.add('detect-label' + classAppendNewFreshSpace);
        divLabelApiURL1DetectionScope2Range.appendChild(labelApiURL1DetectionScope2RangeEnd);

        const inputTextApiURL1DetectionScope2RangeEnd = document.createElement('input');
        inputTextApiURL1DetectionScope2RangeEnd.type = 'number';
        inputTextApiURL1DetectionScope2RangeEnd.classList.add('detect-inputText3' + classAppendNewFreshSpace);
        inputTextApiURL1DetectionScope2RangeEnd.value = 1000;
        inputTextApiURL1DetectionScope2RangeEnd.min = 1000;
        inputTextApiURL1DetectionScope2RangeEnd.max = 50000;
        inputTextApiURL1DetectionScope2RangeEnd.step = 1000;
        inputTextApiURL1DetectionScope2RangeEnd.setAttribute('detect-def', 1000);
        inputTextApiURL1DetectionScope2RangeEnd.setAttribute('detect-min', 1000);
        inputTextApiURL1DetectionScope2RangeEnd.setAttribute('detect-max', 50000);
        inputTextApiURL1DetectionScope2RangeEnd.setAttribute('detect-step', 1000);
        inputTextApiURL1DetectionScope2RangeEnd.setAttribute('detect-setting', 'apiURL1DetectionScope2RangeEnd');
        inputTextApiURL1DetectionScope2RangeEnd.addEventListener('blur', validateInputTextRangeEnd);

        labelApiURL1DetectionScope2RangeEnd.appendChild(document.createTextNode(' ~ '));
        labelApiURL1DetectionScope2RangeEnd.appendChild(inputTextApiURL1DetectionScope2RangeEnd);

        const divLabelApiURL2 = document.createElement('div');
        divLabelApiURL2.classList.add('detect-div-first' + classAppendNewFreshSpace);
        divLabelApiURL2.setAttribute('title',
            '地址: https://api.bilibili.com/medialist/gateway/base/spaceDetail?media_id={收藏夹fid}&pn={页码}&ps={每页展示视频数量}\n' +
            '数据: AV号, BV号, 简介, UP主, 上传时间, 发布时间, 收藏时间, 每个分集的标题, cid\n' +
            '极少数视频可以获取到标题和封面地址。\n' +
            '您需要将当前收藏夹设置为公开后才能获取到数据。如果收藏夹内第一个视频不是失效视频, 修改可见性会导致收藏夹的封面被固定为该视频的封面, 建议修改可见性之前先复制一个失效视频到当前收藏夹的首位。');
        divControls.appendChild(divLabelApiURL2);

        const labelApiURL2 = document.createElement('label');
        labelApiURL2.classList.add('detect-label' + classAppendNewFreshSpace);
        labelApiURL2.textContent = '从接口2获取数据';
        divLabelApiURL2.appendChild(labelApiURL2);

        const radioApiURL2 = document.createElement('input');
        radioApiURL2.type = 'radio';
        radioApiURL2.classList.add('detect-inputRadio' + classAppendNewFreshSpace);
        radioApiURL2.name = 'apiURL';
        radioApiURL2.value = 2;
        radioApiURL2.checked = settings.apiURL === 2;
        radioApiURL2.addEventListener('change', () => {
            try {
                settings.apiURL = 2;
                divLabelApiURL1DetectionScope1.classList.add('detect-disabled' + classAppendNewFreshSpace);
                divLabelApiURL1DetectionScope2.classList.add('detect-disabled' + classAppendNewFreshSpace);
                divLabelApiURL1DetectionScope2Range.classList.add('detect-disabled' + classAppendNewFreshSpace);
                divLabelApiURL2DetectionScope1.classList.remove('detect-disabled' + classAppendNewFreshSpace);
                divLabelApiURL2DetectionScope2.classList.remove('detect-disabled' + classAppendNewFreshSpace);
                if (settings.apiURL2DetectionScope === 2) {
                    divLabelApiURL2DetectionScope2Range.classList.remove('detect-disabled' + classAppendNewFreshSpace);
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelApiURL2.insertAdjacentElement('afterbegin', radioApiURL2);

        const divLabelApiURL2DetectionScope1 = document.createElement('div');
        divLabelApiURL2DetectionScope1.classList.add('detect-div-second' + classAppendNewFreshSpace, 'detect-disabled' + classAppendNewFreshSpace);
        divLabelApiURL2DetectionScope1.setAttribute('title',
            '如果您刚刚在当前收藏夹添加或移除了视频, 请刷新页面后再使用此功能。\n' +
            '如果您正在使用的其他脚本或插件修改了视频封面和标题的链接地址, 请将其关闭后刷新页面再使用此功能。');
        divControls.appendChild(divLabelApiURL2DetectionScope1);

        const labelApiURL2DetectionScope1 = document.createElement('label');
        labelApiURL2DetectionScope1.classList.add('detect-label' + classAppendNewFreshSpace);
        labelApiURL2DetectionScope1.textContent = '检测当前页';
        divLabelApiURL2DetectionScope1.appendChild(labelApiURL2DetectionScope1);

        const radioApiURL2DetectionScope1 = document.createElement('input');
        radioApiURL2DetectionScope1.type = 'radio';
        radioApiURL2DetectionScope1.classList.add('detect-inputRadio' + classAppendNewFreshSpace);
        radioApiURL2DetectionScope1.name = 'apiURL2DetectionScope';
        radioApiURL2DetectionScope1.value = 1;
        radioApiURL2DetectionScope1.checked = settings.apiURL2DetectionScope === 1;
        radioApiURL2DetectionScope1.addEventListener('change', () => {
            try {
                settings.apiURL2DetectionScope = 1;
                divLabelApiURL2DetectionScope2Range.classList.add('detect-disabled' + classAppendNewFreshSpace);
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelApiURL2DetectionScope1.insertAdjacentElement('afterbegin', radioApiURL2DetectionScope1);

        const divLabelApiURL2DetectionScope2 = document.createElement('div');
        divLabelApiURL2DetectionScope2.classList.add('detect-div-second' + classAppendNewFreshSpace, 'detect-disabled' + classAppendNewFreshSpace);
        divControls.appendChild(divLabelApiURL2DetectionScope2);

        const labelApiURL2DetectionScope2 = document.createElement('label');
        labelApiURL2DetectionScope2.classList.add('detect-label' + classAppendNewFreshSpace);
        labelApiURL2DetectionScope2.textContent = '检测当前收藏夹';
        divLabelApiURL2DetectionScope2.appendChild(labelApiURL2DetectionScope2);

        const radioApiURL2DetectionScope2 = document.createElement('input');
        radioApiURL2DetectionScope2.type = 'radio';
        radioApiURL2DetectionScope2.classList.add('detect-inputRadio' + classAppendNewFreshSpace);
        radioApiURL2DetectionScope2.name = 'apiURL2DetectionScope';
        radioApiURL2DetectionScope2.value = 2;
        radioApiURL2DetectionScope2.checked = settings.apiURL2DetectionScope === 2;
        radioApiURL2DetectionScope2.addEventListener('change', () => {
            try {
                settings.apiURL2DetectionScope = 2;
                divLabelApiURL2DetectionScope2Range.classList.remove('detect-disabled' + classAppendNewFreshSpace);
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelApiURL2DetectionScope2.insertAdjacentElement('afterbegin', radioApiURL2DetectionScope2);

        const divLabelApiURL2DetectionScope2Range = document.createElement('div');
        divLabelApiURL2DetectionScope2Range.classList.add('detect-div-second' + classAppendNewFreshSpace, 'detect-disabled' + classAppendNewFreshSpace);
        divControls.appendChild(divLabelApiURL2DetectionScope2Range);

        const labelApiURL2DetectionScope2RangeStart = document.createElement('label');
        labelApiURL2DetectionScope2RangeStart.classList.add('detect-label' + classAppendNewFreshSpace);
        divLabelApiURL2DetectionScope2Range.appendChild(labelApiURL2DetectionScope2RangeStart);

        const inputTextApiURL2DetectionScope2RangeStart = document.createElement('input');
        inputTextApiURL2DetectionScope2RangeStart.type = 'number';
        inputTextApiURL2DetectionScope2RangeStart.classList.add('detect-inputText3' + classAppendNewFreshSpace);
        inputTextApiURL2DetectionScope2RangeStart.value = 1;
        inputTextApiURL2DetectionScope2RangeStart.min = 1;
        inputTextApiURL2DetectionScope2RangeStart.max = 49801;
        inputTextApiURL2DetectionScope2RangeStart.step = 200;
        inputTextApiURL2DetectionScope2RangeStart.setAttribute('detect-def', 1);
        inputTextApiURL2DetectionScope2RangeStart.setAttribute('detect-min', 1);
        inputTextApiURL2DetectionScope2RangeStart.setAttribute('detect-max', 49801);
        inputTextApiURL2DetectionScope2RangeStart.setAttribute('detect-step', 200);
        inputTextApiURL2DetectionScope2RangeStart.setAttribute('detect-setting', 'apiURL2DetectionScope2RangeStart');
        inputTextApiURL2DetectionScope2RangeStart.addEventListener('blur', validateInputTextRangeStart);

        labelApiURL2DetectionScope2RangeStart.appendChild(document.createTextNode('范围'));
        labelApiURL2DetectionScope2RangeStart.appendChild(inputTextApiURL2DetectionScope2RangeStart);

        const labelApiURL2DetectionScope2RangeEnd = document.createElement('label');
        labelApiURL2DetectionScope2RangeEnd.classList.add('detect-label' + classAppendNewFreshSpace);
        divLabelApiURL2DetectionScope2Range.appendChild(labelApiURL2DetectionScope2RangeEnd);

        const inputTextApiURL2DetectionScope2RangeEnd = document.createElement('input');
        inputTextApiURL2DetectionScope2RangeEnd.type = 'number';
        inputTextApiURL2DetectionScope2RangeEnd.classList.add('detect-inputText3' + classAppendNewFreshSpace);
        inputTextApiURL2DetectionScope2RangeEnd.value = 200;
        inputTextApiURL2DetectionScope2RangeEnd.min = 200;
        inputTextApiURL2DetectionScope2RangeEnd.max = 50000;
        inputTextApiURL2DetectionScope2RangeEnd.step = 200;
        inputTextApiURL2DetectionScope2RangeEnd.setAttribute('detect-def', 200);
        inputTextApiURL2DetectionScope2RangeEnd.setAttribute('detect-min', 200);
        inputTextApiURL2DetectionScope2RangeEnd.setAttribute('detect-max', 50000);
        inputTextApiURL2DetectionScope2RangeEnd.setAttribute('detect-step', 200);
        inputTextApiURL2DetectionScope2RangeEnd.setAttribute('detect-setting', 'apiURL2DetectionScope2RangeEnd');
        inputTextApiURL2DetectionScope2RangeEnd.addEventListener('blur', validateInputTextRangeEnd);

        labelApiURL2DetectionScope2RangeEnd.appendChild(document.createTextNode(' ~ '));
        labelApiURL2DetectionScope2RangeEnd.appendChild(inputTextApiURL2DetectionScope2RangeEnd);

        const divButtonJump = document.createElement('div');
        divButtonJump.classList.add('detect-div-first' + classAppendNewFreshSpace);
        divButtonJump.setAttribute('title',
            '在文本框内输入某个视频的AV号或BV号后, 点击此按钮, 将会跳转至该视频在各个第三方网站的页面。');
        divControls.appendChild(divButtonJump);

        const buttonJump = document.createElement('button');
        buttonJump.type = 'button';
        buttonJump.classList.add('detect-button' + classAppendNewFreshSpace);
        buttonJump.textContent = '查询视频信息';
        buttonJump.addEventListener('click', () => {
            try {
                let BV = inputTextAVBV.value;
                if (!BVRegex.test(BV)) {
                    if (startsWithAVRegex.test(BV)) {
                        BV = BV.slice(2);
                    }
                    if (AVRegex.test(BV)) {
                        BV = av2bv(BV);
                    } else {
                        throw ['请输入AV号或BV号'];
                    }
                }

                jump(BV);

            } catch (error) {
                if (error instanceof Error) {
                    catchUnknownError(error);
                } else {
                    addMessage(error[0], false, 'red');
                    for (let i = 1; i < error.length; i++) {
                        addMessage(error[i], true);
                    }
                }
            }
        });
        divButtonJump.appendChild(buttonJump);

        const divButtonRemove = document.createElement('div');
        divButtonRemove.classList.add('detect-div-first' + classAppendNewFreshSpace);
        divButtonRemove.setAttribute('title',
            '在文本框内输入某个视频的AV号或BV号后, 点击此按钮, 将会从当前收藏夹中移除该视频。');
        divControls.appendChild(divButtonRemove);

        const buttonRemove = document.createElement('button');
        buttonRemove.type = 'button';
        buttonRemove.classList.add('detect-button' + classAppendNewFreshSpace);
        buttonRemove.textContent = '取消收藏';
        buttonRemove.addEventListener('click', () => {
            try {
                GM_cookie.list({ name: 'bili_jct' }, async (cookies, error) => {
                    if (error) {
                        throw ['无法读取cookie, 更新Tampermonkey可能有帮助'];
                    }

                    try {
                        let AV = inputTextAVBV.value;
                        if (startsWithAVRegex.test(AV)) {
                            AV = AV.slice(2);
                        }
                        if (!AVRegex.test(AV)) {
                            if (BVRegex.test(AV)) {
                                AV = bv2av(AV);
                            } else {
                                throw ['请输入AV号或BV号'];
                            }
                        }

                        await remove(AV, cookies, spanRemove);

                    } catch (error) {
                        if (error instanceof Error) {
                            catchUnknownError(error);
                        } else {
                            addMessage(error[0], false, 'red');
                            for (let i = 1; i < error.length; i++) {
                                addMessage(error[i], true);
                            }
                        }
                    }
                });

            } catch (error) {
                catchUnknownError(error);
            }
        });
        divButtonRemove.appendChild(buttonRemove);

        const spanRemove = document.createElement('span');
        divButtonRemove.appendChild(spanRemove);

        if (debug) {
            const divLabelRemoveURL1 = document.createElement('div');
            divLabelRemoveURL1.classList.add('detect-div-first' + classAppendNewFreshSpace, 'detect-advanced');
            divControls.appendChild(divLabelRemoveURL1);

            const labelRemoveURL1 = document.createElement('label');
            labelRemoveURL1.classList.add('detect-label' + classAppendNewFreshSpace);
            labelRemoveURL1.textContent = '/x/v3/fav/resource/batch-del';
            divLabelRemoveURL1.appendChild(labelRemoveURL1);

            const radioRemoveURL1 = document.createElement('input');
            radioRemoveURL1.type = 'radio';
            radioRemoveURL1.classList.add('detect-inputRadio' + classAppendNewFreshSpace);
            radioRemoveURL1.name = 'removeURL';
            radioRemoveURL1.value = 1;
            radioRemoveURL1.checked = removeURL === 1;
            radioRemoveURL1.addEventListener('change', () => {
                try {
                    removeURL = 1;
                } catch (error) {
                    catchUnknownError(error);
                }
            });
            labelRemoveURL1.insertAdjacentElement('afterbegin', radioRemoveURL1);

            const divLabelRemoveURL2 = document.createElement('div');
            divLabelRemoveURL2.classList.add('detect-div-first' + classAppendNewFreshSpace, 'detect-advanced');
            divControls.appendChild(divLabelRemoveURL2);

            const labelRemoveURL2 = document.createElement('label');
            labelRemoveURL2.classList.add('detect-label' + classAppendNewFreshSpace);
            labelRemoveURL2.textContent = '/x/v3/fav/resource/deal';
            divLabelRemoveURL2.appendChild(labelRemoveURL2);

            const radioRemoveURL2 = document.createElement('input');
            radioRemoveURL2.type = 'radio';
            radioRemoveURL2.classList.add('detect-inputRadio' + classAppendNewFreshSpace);
            radioRemoveURL2.name = 'removeURL';
            radioRemoveURL2.value = 2;
            radioRemoveURL2.checked = removeURL === 2;
            radioRemoveURL2.addEventListener('change', () => {
                try {
                    removeURL = 2;
                } catch (error) {
                    catchUnknownError(error);
                }
            });
            labelRemoveURL2.insertAdjacentElement('afterbegin', radioRemoveURL2);
        }

        const divButtonAdd = document.createElement('div');
        divButtonAdd.classList.add('detect-div-first' + classAppendNewFreshSpace);
        divButtonAdd.setAttribute('title',
            '在文本框内输入某个视频的AV号或BV号后, 点击此按钮, 将会添加该视频到当前收藏夹的首位。');
        divControls.appendChild(divButtonAdd);

        const buttonAdd = document.createElement('button');
        buttonAdd.type = 'button';
        buttonAdd.classList.add('detect-button' + classAppendNewFreshSpace);
        buttonAdd.textContent = '添加收藏';
        buttonAdd.addEventListener('click', () => {
            try {
                GM_cookie.list({ name: 'bili_jct' }, async (cookies, error) => {
                    if (error) {
                        throw ['无法读取cookie, 更新Tampermonkey可能有帮助'];
                    }

                    try {
                        let AV = inputTextAVBV.value;
                        if (startsWithAVRegex.test(AV)) {
                            AV = AV.slice(2);
                        }
                        if (!AVRegex.test(AV)) {
                            if (BVRegex.test(AV)) {
                                AV = bv2av(AV);
                            } else {
                                throw ['请输入AV号或BV号'];
                            }
                        }

                        await add(AV, cookies, spanAdd);

                    } catch (error) {
                        if (error instanceof Error) {
                            catchUnknownError(error);
                        } else {
                            addMessage(error[0], false, 'red');
                            for (let i = 1; i < error.length; i++) {
                                addMessage(error[i], true);
                            }
                        }
                    }
                });

            } catch (error) {
                catchUnknownError(error);
            }
        });
        divButtonAdd.appendChild(buttonAdd);

        const spanAdd = document.createElement('span');
        divButtonAdd.appendChild(spanAdd);

        if (debug) {
            const divLabelType2 = document.createElement('div');
            divLabelType2.classList.add('detect-div-first' + classAppendNewFreshSpace, 'detect-advanced');
            divControls.appendChild(divLabelType2);

            const labelType2 = document.createElement('label');
            labelType2.classList.add('detect-label' + classAppendNewFreshSpace);
            labelType2.textContent = 'type=2';
            divLabelType2.appendChild(labelType2);

            const radioType2 = document.createElement('input');
            radioType2.type = 'radio';
            radioType2.classList.add('detect-inputRadio' + classAppendNewFreshSpace);
            radioType2.name = 'type';
            radioType2.value = 2;
            radioType2.checked = type === 2;
            radioType2.addEventListener('change', () => {
                try {
                    type = 2;
                } catch (error) {
                    catchUnknownError(error);
                }
            });
            labelType2.insertAdjacentElement('afterbegin', radioType2);

            const divLabelType24 = document.createElement('div');
            divLabelType24.classList.add('detect-div-first' + classAppendNewFreshSpace, 'detect-advanced');
            divControls.appendChild(divLabelType24);

            const labelType24 = document.createElement('label');
            labelType24.classList.add('detect-label' + classAppendNewFreshSpace);
            labelType24.textContent = 'type=24';
            divLabelType24.appendChild(labelType24);

            const radioType24 = document.createElement('input');
            radioType24.type = 'radio';
            radioType24.classList.add('detect-inputRadio' + classAppendNewFreshSpace);
            radioType24.name = 'type';
            radioType24.value = 24;
            radioType24.checked = type === 24;
            radioType24.addEventListener('change', () => {
                try {
                    type = 24;
                } catch (error) {
                    catchUnknownError(error);
                }
            });
            labelType24.insertAdjacentElement('afterbegin', radioType24);

            const divLabelType42 = document.createElement('div');
            divLabelType42.classList.add('detect-div-first' + classAppendNewFreshSpace, 'detect-advanced');
            divControls.appendChild(divLabelType42);

            const labelType42 = document.createElement('label');
            labelType42.classList.add('detect-label' + classAppendNewFreshSpace);
            labelType42.textContent = 'type=42';
            divLabelType42.appendChild(labelType42);

            const radioType42 = document.createElement('input');
            radioType42.type = 'radio';
            radioType42.classList.add('detect-inputRadio' + classAppendNewFreshSpace);
            radioType42.name = 'type';
            radioType42.value = 42;
            radioType42.checked = type === 42;
            radioType42.addEventListener('change', () => {
                try {
                    type = 42;
                } catch (error) {
                    catchUnknownError(error);
                }
            });
            labelType42.insertAdjacentElement('afterbegin', radioType42);
        }

        const divLabelDisplayAdvancedControls = document.createElement('div');
        divLabelDisplayAdvancedControls.classList.add('detect-div-first' + classAppendNewFreshSpace);
        divControls.appendChild(divLabelDisplayAdvancedControls);

        const labelDisplayAdvancedControls = document.createElement('label');
        labelDisplayAdvancedControls.classList.add('detect-label' + classAppendNewFreshSpace);
        labelDisplayAdvancedControls.textContent = '显示全部选项和功能';
        divLabelDisplayAdvancedControls.appendChild(labelDisplayAdvancedControls);

        const checkboxDisplayAdvancedControls = document.createElement('input');
        checkboxDisplayAdvancedControls.type = 'checkbox';
        checkboxDisplayAdvancedControls.classList.add('detect-inputCheckbox' + classAppendNewFreshSpace);
        checkboxDisplayAdvancedControls.checked = settings.displayAdvancedControls;
        checkboxDisplayAdvancedControls.addEventListener('change', () => {
            try {
                settings.displayAdvancedControls = checkboxDisplayAdvancedControls.checked;
                if (!settings.displayAdvancedControls) {
                    divControls.querySelectorAll('.detect-advanced').forEach(el => { el.classList.add('detect-hidden' + classAppendNewFreshSpace) });
                } else {
                    divControls.querySelectorAll('.detect-advanced').forEach(el => { el.classList.remove('detect-hidden' + classAppendNewFreshSpace) });
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelDisplayAdvancedControls.insertAdjacentElement('afterbegin', checkboxDisplayAdvancedControls);

        const divButtonAVBV = document.createElement('div');
        divButtonAVBV.classList.add('detect-div-first' + classAppendNewFreshSpace, 'detect-advanced');
        divButtonAVBV.setAttribute('title',
            '在文本框内输入某个视频的BV号后, 点击此按钮, 将会转换为其AV号, 反之亦然。');
        divControls.appendChild(divButtonAVBV);

        const buttonAVBV = document.createElement('button');
        buttonAVBV.type = 'button';
        buttonAVBV.classList.add('detect-button' + classAppendNewFreshSpace);
        buttonAVBV.textContent = 'AV号BV号互转';
        buttonAVBV.addEventListener('click', () => {
            try {
                let AVBV = inputTextAVBV.value;
                if (BVRegex.test(AVBV)) {
                    inputTextAVBV.value = bv2av(AVBV);
                    return;
                }
                if (startsWithAVRegex.test(AVBV)) {
                    AVBV = AVBV.slice(2);
                }
                if (AVRegex.test(AVBV)) {
                    inputTextAVBV.value = av2bv(AVBV);
                    return;
                }
                throw ['请输入AV号或BV号'];

            } catch (error) {
                if (error instanceof Error) {
                    catchUnknownError(error);
                } else {
                    addMessage(error[0], false, 'red');
                    for (let i = 1; i < error.length; i++) {
                        addMessage(error[i], true);
                    }
                }
            }
        });
        divButtonAVBV.appendChild(buttonAVBV);

        const divButtonPublic = document.createElement('div');
        divButtonPublic.classList.add('detect-div-first' + classAppendNewFreshSpace, 'detect-advanced');
        divButtonPublic.setAttribute('title',
            '请注意: 该功能会将当前收藏夹的封面恢复为默认 (总是显示第一个视频的封面)。');
        divControls.appendChild(divButtonPublic);

        const buttonPublic = document.createElement('button');
        buttonPublic.type = 'button';
        buttonPublic.classList.add('detect-button' + classAppendNewFreshSpace);
        buttonPublic.textContent = '将当前收藏夹设置为公开';
        buttonPublic.addEventListener('click', () => {
            try {
                GM_cookie.list({ name: 'bili_jct' }, async (cookies, error) => {
                    if (error) {
                        throw ['无法读取cookie, 更新Tampermonkey可能有帮助'];
                    }

                    try {
                        let fid;
                        if (newFreshSpace) {
                            const getFidFromURLMatch = location.href.match(getFidFromURLRegex);
                            if (getFidFromURLMatch) {
                                fid = parseInt(getFidFromURLMatch[1], 10);
                            } else {
                                throw ['无法获取当前收藏夹的fid, 刷新页面可能有帮助'];
                            }
                        } else {
                            fid = document.querySelector('.fav-item.cur').getAttribute('fid');
                        }

                        const response1 = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: `https://api.bilibili.com/x/v3/fav/folder/info?media_id=${fid}` + (newFreshSpace ? '&web_location=333.1387' : ''),
                                timeout: 5000,
                                responseType: 'json',
                                onload: (res) => resolve(res),
                                onerror: (res) => reject(['请求失败', 'api.bilibili.com/x/v3/fav/folder/info', res.error]),
                                ontimeout: () => reject(['请求超时', 'api.bilibili.com/x/v3/fav/folder/info'])
                            });
                        });
                        if (response1.status !== 200) {
                            throw ['请求失败', 'api.bilibili.com/x/v3/fav/folder/info', `${response1.status} ${response1.statusText}`];
                        }

                        const csrf = cookies[0].value;
                        const data = `media_id=${fid}&title=${encodeURIComponent(response1.response.data.title)}&intro=${encodeURIComponent(response1.response.data.intro)}&privacy=0&cover=&csrf=${csrf}`;
                        const response2 = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: 'https://api.bilibili.com/x/v3/fav/folder/edit',
                                data: data,
                                timeout: 5000,
                                responseType: 'json',
                                headers: {
                                    'Content-Length': data.length,
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                onload: (res) => resolve(res),
                                onerror: (res) => reject(['请求失败', 'api.bilibili.com/x/v3/fav/folder/edit', res.error]),
                                ontimeout: () => reject(['请求超时', 'api.bilibili.com/x/v3/fav/folder/edit'])
                            });
                        });
                        if (response2.status !== 200) {
                            throw ['请求失败', 'api.bilibili.com/x/v3/fav/folder/edit', `${response2.status} ${response2.statusText}`];
                        }

                        console.log(response2.response);
                        spanPublic.textContent = ' ✔';
                        setTimeout(() => {
                            spanPublic.textContent = '';
                        }, 1000);

                    } catch (error) {
                        if (error instanceof Error) {
                            catchUnknownError(error);
                        } else {
                            addMessage(error[0], false, 'red');
                            for (let i = 1; i < error.length; i++) {
                                addMessage(error[i], true);
                            }
                        }
                    }
                });

            } catch (error) {
                catchUnknownError(error);
            }
        });
        divButtonPublic.appendChild(buttonPublic);

        const spanPublic = document.createElement('span');
        divButtonPublic.appendChild(spanPublic);

        const divButtonPrivate = document.createElement('div');
        divButtonPrivate.classList.add('detect-div-first' + classAppendNewFreshSpace, 'detect-advanced');
        divButtonPrivate.setAttribute('title',
            '请注意: 该功能会将当前收藏夹的封面恢复为默认 (总是显示第一个视频的封面)。');
        divControls.appendChild(divButtonPrivate);

        const buttonPrivate = document.createElement('button');
        buttonPrivate.type = 'button';
        buttonPrivate.classList.add('detect-button' + classAppendNewFreshSpace);
        buttonPrivate.textContent = '将当前收藏夹设置为私密';
        buttonPrivate.addEventListener('click', () => {
            try {
                GM_cookie.list({ name: 'bili_jct' }, async (cookies, error) => {
                    if (error) {
                        throw ['无法读取cookie, 更新Tampermonkey可能有帮助'];
                    }

                    try {
                        let fid;
                        if (newFreshSpace) {
                            const getFidFromURLMatch = location.href.match(getFidFromURLRegex);
                            if (getFidFromURLMatch) {
                                fid = parseInt(getFidFromURLMatch[1], 10);
                            } else {
                                throw ['无法获取当前收藏夹的fid, 刷新页面可能有帮助'];
                            }
                        } else {
                            fid = document.querySelector('.fav-item.cur').getAttribute('fid');
                        }

                        const response1 = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: `https://api.bilibili.com/x/v3/fav/folder/info?media_id=${fid}` + (newFreshSpace ? '&web_location=333.1387' : ''),
                                timeout: 5000,
                                responseType: 'json',
                                onload: (res) => resolve(res),
                                onerror: (res) => reject(['请求失败', 'api.bilibili.com/x/v3/fav/folder/info', res.error]),
                                ontimeout: () => reject(['请求超时', 'api.bilibili.com/x/v3/fav/folder/info'])
                            });
                        });
                        if (response1.status !== 200) {
                            throw ['请求失败', 'api.bilibili.com/x/v3/fav/folder/info', `${response1.status} ${response1.statusText}`];
                        }

                        const csrf = cookies[0].value;
                        const data = `media_id=${fid}&title=${encodeURIComponent(response1.response.data.title)}&intro=${encodeURIComponent(response1.response.data.intro)}&privacy=1&cover=&csrf=${csrf}`;
                        const response2 = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: 'https://api.bilibili.com/x/v3/fav/folder/edit',
                                data: data,
                                timeout: 5000,
                                responseType: 'json',
                                headers: {
                                    'Content-Length': data.length,
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                onload: (res) => resolve(res),
                                onerror: (res) => reject(['请求失败', 'api.bilibili.com/x/v3/fav/folder/edit', res.error]),
                                ontimeout: () => reject(['请求超时', 'api.bilibili.com/x/v3/fav/folder/edit'])
                            });
                        });
                        if (response2.status !== 200) {
                            throw ['请求失败', 'api.bilibili.com/x/v3/fav/folder/edit', `${response2.status} ${response2.statusText}`];
                        }

                        console.log(response2.response);
                        spanPrivate.textContent = ' ✔';
                        setTimeout(() => {
                            spanPrivate.textContent = '';
                        }, 1000);

                    } catch (error) {
                        if (error instanceof Error) {
                            catchUnknownError(error);
                        } else {
                            addMessage(error[0], false, 'red');
                            for (let i = 1; i < error.length; i++) {
                                addMessage(error[i], true);
                            }
                        }
                    }
                });

            } catch (error) {
                catchUnknownError(error);
            }
        });
        divButtonPrivate.appendChild(buttonPrivate);

        const spanPrivate = document.createElement('span');
        divButtonPrivate.appendChild(spanPrivate);

        const divLabelApiDelay = document.createElement('div');
        divLabelApiDelay.classList.add('detect-div-first' + classAppendNewFreshSpace, 'detect-advanced');
        divLabelApiDelay.setAttribute('title',
            '默认: 500毫秒\n' +
            '请将其设置在400毫秒以上, 否则在短时间内频繁获取数据之后, 会出现请求失败的情况, 并且收藏夹无法使用, 需要若干分钟才能恢复。');
        divControls.appendChild(divLabelApiDelay);

        const labelApiDelay = document.createElement('label');
        labelApiDelay.classList.add('detect-label' + classAppendNewFreshSpace);
        divLabelApiDelay.appendChild(labelApiDelay);

        const inputTextApiDelay = document.createElement('input');
        inputTextApiDelay.type = 'text';
        inputTextApiDelay.classList.add('detect-inputText2' + classAppendNewFreshSpace);
        inputTextApiDelay.value = settings.apiDelay;
        inputTextApiDelay.setAttribute('detect-def', 500);
        inputTextApiDelay.setAttribute('detect-min', 0);
        inputTextApiDelay.setAttribute('detect-max', 1000);
        inputTextApiDelay.setAttribute('detect-setting', 'apiDelay');
        inputTextApiDelay.addEventListener('blur', validateInputText);

        labelApiDelay.appendChild(document.createTextNode('获取数据前等待'));
        labelApiDelay.appendChild(inputTextApiDelay);
        labelApiDelay.appendChild(document.createTextNode('毫秒'));

        const divLabelDivMessageHeight = document.createElement('div');
        divLabelDivMessageHeight.classList.add('detect-div-first' + classAppendNewFreshSpace, 'detect-advanced');
        divLabelDivMessageHeight.setAttribute('title',
            '默认: 25行');
        divControls.appendChild(divLabelDivMessageHeight);

        const labelDivMessageHeight = document.createElement('label');
        labelDivMessageHeight.classList.add('detect-label' + classAppendNewFreshSpace);
        divLabelDivMessageHeight.appendChild(labelDivMessageHeight);

        const inputTextDivMessageHeight = document.createElement('input');
        inputTextDivMessageHeight.type = 'text';
        inputTextDivMessageHeight.classList.add('detect-inputText2' + classAppendNewFreshSpace);
        inputTextDivMessageHeight.value = settings.divMessageHeight;
        inputTextDivMessageHeight.setAttribute('detect-def', 25);
        inputTextDivMessageHeight.setAttribute('detect-min', 10);
        inputTextDivMessageHeight.setAttribute('detect-max', 100);
        inputTextDivMessageHeight.setAttribute('detect-setting', 'divMessageHeight');
        inputTextDivMessageHeight.addEventListener('blur', validateInputTextDivMessageHeight);

        labelDivMessageHeight.appendChild(document.createTextNode('提示信息区域高度'));
        labelDivMessageHeight.appendChild(inputTextDivMessageHeight);
        labelDivMessageHeight.appendChild(document.createTextNode('行'));

        const divLabelAddMessageJumpRemoveAdd = document.createElement('div');
        divLabelAddMessageJumpRemoveAdd.classList.add('detect-div-first' + classAppendNewFreshSpace, 'detect-advanced');
        divLabelAddMessageJumpRemoveAdd.setAttribute('title',
            '开启后脚本将在检测结果信息中每个视频的下方添加查询视频信息, 取消收藏, 添加收藏的功能入口, 无需手动输入AV号或BV号。');
        divControls.appendChild(divLabelAddMessageJumpRemoveAdd);

        const labelAddMessageJumpRemoveAdd = document.createElement('label');
        labelAddMessageJumpRemoveAdd.classList.add('detect-label' + classAppendNewFreshSpace);
        labelAddMessageJumpRemoveAdd.textContent = '在检测结果信息中添加功能入口';
        divLabelAddMessageJumpRemoveAdd.appendChild(labelAddMessageJumpRemoveAdd);

        const checkboxAddMessageJumpRemoveAdd = document.createElement('input');
        checkboxAddMessageJumpRemoveAdd.type = 'checkbox';
        checkboxAddMessageJumpRemoveAdd.classList.add('detect-inputCheckbox' + classAppendNewFreshSpace);
        checkboxAddMessageJumpRemoveAdd.checked = settings.addMessageJumpRemoveAdd;
        checkboxAddMessageJumpRemoveAdd.addEventListener('change', () => {
            try {
                settings.addMessageJumpRemoveAdd = checkboxAddMessageJumpRemoveAdd.checked;
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelAddMessageJumpRemoveAdd.insertAdjacentElement('afterbegin', checkboxAddMessageJumpRemoveAdd);

        const divLabelAutoClearMessage = document.createElement('div');
        divLabelAutoClearMessage.classList.add('detect-div-first' + classAppendNewFreshSpace, 'detect-advanced');
        divLabelAutoClearMessage.setAttribute('title',
            '开启后脚本将在每次检测隐藏视频之前清空提示信息。');
        divControls.appendChild(divLabelAutoClearMessage);

        const labelAutoClearMessage = document.createElement('label');
        labelAutoClearMessage.classList.add('detect-label' + classAppendNewFreshSpace);
        labelAutoClearMessage.textContent = '自动清空提示信息';
        divLabelAutoClearMessage.appendChild(labelAutoClearMessage);

        const checkboxAutoClearMessage = document.createElement('input');
        checkboxAutoClearMessage.type = 'checkbox';
        checkboxAutoClearMessage.classList.add('detect-inputCheckbox' + classAppendNewFreshSpace);
        checkboxAutoClearMessage.checked = settings.autoClearMessage;
        checkboxAutoClearMessage.addEventListener('change', () => {
            try {
                settings.autoClearMessage = checkboxAutoClearMessage.checked;
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelAutoClearMessage.insertAdjacentElement('afterbegin', checkboxAutoClearMessage);

        const divLabelDetectionScope2DisplayPosition = document.createElement('div');
        divLabelDetectionScope2DisplayPosition.classList.add('detect-div-first' + classAppendNewFreshSpace, 'detect-advanced');
        divControls.appendChild(divLabelDetectionScope2DisplayPosition);

        const labelDetectionScope2DisplayPosition = document.createElement('label');
        labelDetectionScope2DisplayPosition.classList.add('detect-label' + classAppendNewFreshSpace);
        labelDetectionScope2DisplayPosition.textContent = '检测当前收藏夹展示视频在每一页的位置';
        divLabelDetectionScope2DisplayPosition.appendChild(labelDetectionScope2DisplayPosition);

        const checkboxDetectionScope2DisplayPosition = document.createElement('input');
        checkboxDetectionScope2DisplayPosition.type = 'checkbox';
        checkboxDetectionScope2DisplayPosition.classList.add('detect-inputCheckbox' + classAppendNewFreshSpace);
        checkboxDetectionScope2DisplayPosition.checked = settings.detectionScope2DisplayPosition;
        checkboxDetectionScope2DisplayPosition.addEventListener('change', () => {
            try {
                settings.detectionScope2DisplayPosition = checkboxDetectionScope2DisplayPosition.checked;
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelDetectionScope2DisplayPosition.insertAdjacentElement('afterbegin', checkboxDetectionScope2DisplayPosition);

        const divLabelApiURL2DisplayTime = document.createElement('div');
        divLabelApiURL2DisplayTime.classList.add('detect-div-first' + classAppendNewFreshSpace, 'detect-advanced');
        divControls.appendChild(divLabelApiURL2DisplayTime);

        const labelApiURL2DisplayTime = document.createElement('label');
        labelApiURL2DisplayTime.classList.add('detect-label' + classAppendNewFreshSpace);
        labelApiURL2DisplayTime.textContent = '接口2数据展示上传时间发布时间收藏时间';
        divLabelApiURL2DisplayTime.appendChild(labelApiURL2DisplayTime);

        const checkboxApiURL2DisplayTime = document.createElement('input');
        checkboxApiURL2DisplayTime.type = 'checkbox';
        checkboxApiURL2DisplayTime.classList.add('detect-inputCheckbox' + classAppendNewFreshSpace);
        checkboxApiURL2DisplayTime.checked = settings.apiURL2DisplayTime;
        checkboxApiURL2DisplayTime.addEventListener('change', () => {
            try {
                settings.apiURL2DisplayTime = checkboxApiURL2DisplayTime.checked;
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelApiURL2DisplayTime.insertAdjacentElement('afterbegin', checkboxApiURL2DisplayTime);

        divMessage = document.createElement('div');
        divMessage.classList.add('detect-divMessage' + classAppendNewFreshSpace);
        divControls.appendChild(divMessage);

        if (settings.apiURL === 1) {
            divLabelApiURL1DetectionScope1.classList.remove('detect-disabled' + classAppendNewFreshSpace);
            divLabelApiURL1DetectionScope2.classList.remove('detect-disabled' + classAppendNewFreshSpace);
            if (settings.apiURL1DetectionScope === 2) {
                divLabelApiURL1DetectionScope2Range.classList.remove('detect-disabled' + classAppendNewFreshSpace);
            }
        } else {
            divLabelApiURL2DetectionScope1.classList.remove('detect-disabled' + classAppendNewFreshSpace);
            divLabelApiURL2DetectionScope2.classList.remove('detect-disabled' + classAppendNewFreshSpace);
            if (settings.apiURL2DetectionScope === 2) {
                divLabelApiURL2DetectionScope2Range.classList.remove('detect-disabled' + classAppendNewFreshSpace);
            }
        }

        if (!settings.displayAdvancedControls) {
            divControls.querySelectorAll('.detect-advanced').forEach(el => {
                el.classList.add('detect-hidden' + classAppendNewFreshSpace);
            });
        }
    }

    async function apiURL1DetectionScope1(fid, pageNumber) {

        const newRequests = [];
        const oldPageStart = (pageNumber - 1) * pageSize;
        const oldPageEnd = oldPageStart + pageSize;
        let newPageNumber = Math.floor(oldPageStart / 1000) + 1;
        while ((newPageNumber - 1) * 1000 < oldPageEnd) {
            const newPageStart = (newPageNumber - 1) * 1000;
            const newPageEnd = newPageStart + 1000;
            const sliceStart = Math.max(oldPageStart, newPageStart);
            const sliceEnd = Math.min(oldPageEnd, newPageEnd);
            newRequests.push({ newPageNumber, sliceStart, sliceEnd });
            newPageNumber++;
        }

        const AVBVsPageAll = [];
        for (const newRequest of newRequests) {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://api.bilibili.com/x/v3/fav/resource/ids?media_id=${fid}&pn=${newRequest.newPageNumber}&platform=web`,
                    timeout: 5000,
                    responseType: 'json',
                    onload: (res) => resolve(res),
                    onerror: (res) => reject(['请求失败', 'api.bilibili.com/x/v3/fav/resource/ids', res.error]),
                    ontimeout: () => reject(['请求超时', 'api.bilibili.com/x/v3/fav/resource/ids'])
                });
            });
            if (response.status !== 200) {
                throw ['请求失败', 'api.bilibili.com/x/v3/fav/resource/ids', `${response.status} ${response.statusText}`];
            }

            const sliceStart = newRequest.sliceStart - (newRequest.newPageNumber - 1) * 1000;
            const sliceEnd = newRequest.sliceEnd - (newRequest.newPageNumber - 1) * 1000;
            AVBVsPageAll.push(...response.response.data.slice(sliceStart, sliceEnd));
        }

        const videosPageVisable = document.querySelectorAll(newFreshSpace ? 'div.items__item' : 'li.small-item');
        let BVsPageVisable;
        if (newFreshSpace) {
            BVsPageVisable = Array.from(videosPageVisable).map(el => el.querySelector('a').getAttribute('href').match(getBVFromURLRegex)[1]);
        } else {
            BVsPageVisable = Array.from(videosPageVisable).map(el => el.getAttribute('data-aid'));
        }

        const AVBVsPageHidden = AVBVsPageAll.filter(el => !BVsPageVisable.includes(el.bvid) && el.type === 2);
        if (!AVBVsPageHidden.length) {
            addMessage('没有找到隐藏的视频', false, 'green');
            return;
        }
        AVBVsPageHidden.forEach(el => {
            addMessage(`在当前页的位置: ${AVBVsPageAll.findIndex(ele => ele.bvid === el.bvid) + 1}`, false, 'green');
            addMessage(`AV号: ${el.id}`);
            addMessage(`BV号: ${el.bvid}`);
            if (settings.addMessageJumpRemoveAdd) {
                addMessageJumpRemoveAdd(el.id, el.bvid, true);
            }
        });
    }

    async function apiURL1DetectionScope2(fid, defaultFilter, controller, spanDetect) {

        const AVBVsFavlistAll = [];
        const BVsFavlistVisable = [];
        let newPageNumber = (detectionScope2Range.apiURL1DetectionScope2RangeStart - 1) / 1000 + 1;

        while (newPageNumber * 1000 <= detectionScope2Range.apiURL1DetectionScope2RangeEnd) {
            if (controller.signal.aborted) {
                throw new DOMException('', 'AbortError');
            }

            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://api.bilibili.com/x/v3/fav/resource/ids?media_id=${fid}&pn=${newPageNumber}&platform=web`,
                    timeout: 5000,
                    responseType: 'json',
                    onload: (res) => resolve(res),
                    onerror: (res) => reject(['请求失败', 'api.bilibili.com/x/v3/fav/resource/ids', res.error]),
                    ontimeout: () => reject(['请求超时', 'api.bilibili.com/x/v3/fav/resource/ids'])
                });
            });
            if (response.status !== 200) {
                throw ['请求失败', 'api.bilibili.com/x/v3/fav/resource/ids', `${response.status} ${response.statusText}`];
            }

            if (!response.response.data.length) {
                break;
            }

            AVBVsFavlistAll.push(...response.response.data);

            let pn = (newPageNumber - 1) * 25 + 1;
            let finish = false;
            while (true) {
                if (controller.signal.aborted) {
                    throw new DOMException('', 'AbortError');
                }

                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${fid}&pn=${pn}&ps=40&keyword=&order=mtime&type=0&tid=0&platform=web` + (newFreshSpace ? '&web_location=333.1387' : ''),
                        timeout: 5000,
                        responseType: 'json',
                        onload: (res) => resolve(res),
                        onerror: (res) => reject(['请求失败', 'api.bilibili.com/x/v3/fav/resource/list', res.error]),
                        ontimeout: () => reject(['请求超时', 'api.bilibili.com/x/v3/fav/resource/list'])
                    });
                });
                if (response.status !== 200) {
                    throw ['请求失败', 'api.bilibili.com/x/v3/fav/resource/list', `${response.status} ${response.statusText}`];
                }

                if (response.response.data.medias) {
                    BVsFavlistVisable.push(...response.response.data.medias.map(el => el.bvid));
                }
                spanDetect.textContent = ` (${BVsFavlistVisable.length} / ${detectionScope2Range.apiURL1DetectionScope2RangeEnd - detectionScope2Range.apiURL1DetectionScope2RangeStart + 1})`;
                if (!response.response.data.has_more) {
                    finish = true;
                    break;
                }
                if (pn === newPageNumber * 25) {
                    break;
                }
                pn++;

                await delay(settings.apiDelay);
            }

            if (finish) {
                break;
            }
            newPageNumber++;
        }

        setTimeout(() => {
            spanDetect.textContent = '';
        }, 1000);

        const AVBVsFavlistHidden = AVBVsFavlistAll.filter(el => !BVsFavlistVisable.includes(el.bvid) && el.type === 2);
        if (!AVBVsFavlistHidden.length) {
            addMessage('没有找到隐藏的视频', false, 'green');
            return;
        }
        let count = 1;
        AVBVsFavlistHidden.forEach(el => {
            if (defaultFilter) {
                addMessage(`第 ${Math.floor((AVBVsFavlistAll.findIndex(ele => ele.bvid === el.bvid) + detectionScope2Range.apiURL1DetectionScope2RangeStart - 1) / pageSize) + 1} 页${settings.detectionScope2DisplayPosition ? `的第 ${(AVBVsFavlistAll.findIndex(ele => ele.bvid === el.bvid) + detectionScope2Range.apiURL1DetectionScope2RangeStart - 1) % pageSize + 1} 个` : ''}:`, false, 'green');
            } else {
                addMessage(`第 ${count++} 个:`, false, 'green');
            }
            addMessage(`AV号: ${el.id}`);
            addMessage(`BV号: ${el.bvid}`);
            if (settings.addMessageJumpRemoveAdd) {
                addMessageJumpRemoveAdd(el.id, el.bvid, true);
            }
        });
    }

    async function apiURL2DetectionScope1(fid, pageNumber) {

        const newRequests = [];
        const oldPageStart = (pageNumber - 1) * pageSize;
        const oldPageEnd = oldPageStart + pageSize;
        let newPageNumber = Math.floor(oldPageStart / 20) + 1;
        while ((newPageNumber - 1) * 20 < oldPageEnd) {
            const newPageStart = (newPageNumber - 1) * 20;
            const newPageEnd = newPageStart + 20;
            const sliceStart = Math.max(oldPageStart, newPageStart);
            const sliceEnd = Math.min(oldPageEnd, newPageEnd);
            newRequests.push({ newPageNumber, sliceStart, sliceEnd });
            newPageNumber++;
        }

        const InfosPageAll = [];
        for (const newRequest of newRequests) {
            const urlWithParams = await appendParamsForApiURL2(fid, newRequest.newPageNumber, 20);
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: urlWithParams,
                    timeout: 5000,
                    responseType: 'json',
                    onload: (res) => resolve(res),
                    onerror: (res) => reject(['请求失败', 'api.bilibili.com/medialist/gateway/base/spaceDetail', res.error]),
                    ontimeout: () => reject(['请求超时', 'api.bilibili.com/medialist/gateway/base/spaceDetail'])
                });
            });
            if (response.status !== 200) {
                throw ['请求失败', 'api.bilibili.com/medialist/gateway/base/spaceDetail', `${response.status} ${response.statusText}`];
            }

            if (response.response.code === -403 || response.response.code === 7201004) {
                throw ['不支持处理私密收藏夹'];
            } else if (response.response.code) {
                throw ['发生未知错误, 请反馈该问题', JSON.stringify(response.response)];
            }

            if (!response.response.data.medias) {
                break;
            }

            const sliceStart = newRequest.sliceStart - (newRequest.newPageNumber - 1) * 20;
            const sliceEnd = newRequest.sliceEnd - (newRequest.newPageNumber - 1) * 20;
            InfosPageAll.push(...response.response.data.medias.slice(sliceStart, sliceEnd));
        }

        const videosPageVisable = document.querySelectorAll(newFreshSpace ? 'div.items__item' : 'li.small-item');
        let BVsPageVisable;
        if (newFreshSpace) {
            BVsPageVisable = Array.from(videosPageVisable).map(el => el.querySelector('a').getAttribute('href').match(getBVFromURLRegex)[1]);
        } else {
            BVsPageVisable = Array.from(videosPageVisable).map(el => el.getAttribute('data-aid'));
        }

        const InfosPageHidden = InfosPageAll.filter(el => !BVsPageVisable.includes(el.bvid));
        if (!InfosPageHidden.length) {
            addMessage('没有找到隐藏的视频', false, 'green');
            return;
        }
        InfosPageHidden.forEach(el => {
            addMessage(`在当前页的位置: ${InfosPageAll.findIndex(ele => ele.bvid === el.bvid) + 1}`, false, 'green');
            if (el.cover && !el.cover.includes('be27fd62c99036dce67efface486fb0a88ffed06')) {
                addMessage(`<img src="//${el.cover.replace(getHttpsFromURLRegex, '').replace(getAvifFromURLRegex, '')}@672w_378h_1c.avif" style="max-width: 100%; height: auto;">`);
            }
            if (el.title && el.title !== '已失效视频') {
                addMessage(`标题: ${el.title}`);
            }
            addMessage(`AV号: ${el.id}`);
            addMessage(`BV号: ${el.bvid}`);
            addMessage(`简介: ${el.intro}`);
            addMessage(`UP主: <a href="https://space.bilibili.com/${el.upper.mid}" target="_blank" style="text-decoration-line: underline;">${el.upper.name}</a>`, true);
            if (settings.apiURL2DisplayTime) {
                addMessage(`上传时间: ${new Date(1000 * el.ctime).toLocaleString()}`, true);
                addMessage(`发布时间: ${new Date(1000 * el.pubtime).toLocaleString()}`, true);
                addMessage(`收藏时间: ${new Date(1000 * el.fav_time).toLocaleString()}`, true);
            }
            if (Array.isArray(el.pages)) {
                el.pages.forEach(ele => {
                    addMessage(`分集${ele.page}: cid: ${ele.id}`, true);
                    addMessage(`标题: ${ele.title}`);
                });
            }
            if (settings.addMessageJumpRemoveAdd) {
                addMessageJumpRemoveAdd(el.id, el.bvid, true);
            }
        });
    }

    async function apiURL2DetectionScope2(fid, defaultFilter, controller, spanDetect) {

        const InfosPageAll = [];
        const BVsFavlistVisable = [];
        let newPageNumber = (detectionScope2Range.apiURL2DetectionScope2RangeStart - 1) / 40 + 1;
        let finish = false;

        while (newPageNumber * 40 <= detectionScope2Range.apiURL2DetectionScope2RangeEnd) {
            if (controller.signal.aborted) {
                throw new DOMException('', 'AbortError');
            }

            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${fid}&pn=${newPageNumber}&ps=40&keyword=&order=mtime&type=0&tid=0&platform=web` + (newFreshSpace ? '&web_location=333.1387' : ''),
                    timeout: 5000,
                    responseType: 'json',
                    onload: (res) => resolve(res),
                    onerror: (res) => reject(['请求失败', 'api.bilibili.com/x/v3/fav/resource/list', res.error]),
                    ontimeout: () => reject(['请求超时', 'api.bilibili.com/x/v3/fav/resource/list'])
                });
            });
            if (response.status !== 200) {
                throw ['请求失败', 'api.bilibili.com/x/v3/fav/resource/list', `${response.status} ${response.statusText}`];
            }

            if (response.response.data.medias) {
                BVsFavlistVisable.push(...response.response.data.medias.map(el => el.bvid));
            }
            if (!response.response.data.has_more) {
                finish = true;
            }

            if (controller.signal.aborted) {
                throw new DOMException('', 'AbortError');
            }

            const response1 = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://api.bilibili.com/medialist/gateway/base/spaceDetail?media_id=${fid}&pn=${newPageNumber * 2 - 1}&ps=20&keyword=&order=mtime&type=0&tid=0&jsonp=jsonp`,
                    timeout: 5000,
                    responseType: 'json',
                    onload: (res) => resolve(res),
                    onerror: (res) => reject(['请求失败', 'api.bilibili.com/medialist/gateway/base/spaceDetail', res.error]),
                    ontimeout: () => reject(['请求超时', 'api.bilibili.com/medialist/gateway/base/spaceDetail'])
                });
            });
            if (response1.status !== 200) {
                throw ['请求失败', 'api.bilibili.com/medialist/gateway/base/spaceDetail', `${response1.status} ${response1.statusText}`];
            }

            if (response1.response.code === -403 || response1.response.code === 7201004) {
                throw ['不支持处理私密收藏夹'];
            } else if (response1.response.code) {
                throw ['发生未知错误, 请反馈该问题', JSON.stringify(response1.response)];
            }

            if (!response1.response.data.medias) {
                break;
            }
            InfosPageAll.push(...response1.response.data.medias);

            if (controller.signal.aborted) {
                throw new DOMException('', 'AbortError');
            }

            const response2 = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://api.bilibili.com/medialist/gateway/base/spaceDetail?media_id=${fid}&pn=${newPageNumber * 2}&ps=20&keyword=&order=mtime&type=0&tid=0&jsonp=jsonp`,
                    timeout: 5000,
                    responseType: 'json',
                    onload: (res) => resolve(res),
                    onerror: (res) => reject(['请求失败', 'api.bilibili.com/medialist/gateway/base/spaceDetail', res.error]),
                    ontimeout: () => reject(['请求超时', 'api.bilibili.com/medialist/gateway/base/spaceDetail'])
                });
            });
            if (response2.status !== 200) {
                throw ['请求失败', 'api.bilibili.com/medialist/gateway/base/spaceDetail', `${response2.status} ${response2.statusText}`];
            }

            if (response2.response.code === -403 || response2.response.code === 7201004) {
                throw ['不支持处理私密收藏夹'];
            } else if (response2.response.code) {
                throw ['发生未知错误, 请反馈该问题', JSON.stringify(response2.response)];
            }

            spanDetect.textContent = ` (${BVsFavlistVisable.length} / ${detectionScope2Range.apiURL2DetectionScope2RangeEnd - detectionScope2Range.apiURL2DetectionScope2RangeStart + 1})`;

            if (!response2.response.data.medias) {
                break;
            }
            InfosPageAll.push(...response2.response.data.medias);

            if (finish) {
                break;
            }
            newPageNumber++;

            await delay(settings.apiDelay);
        }

        setTimeout(() => {
            spanDetect.textContent = '';
        }, 1000);

        const InfosPageHidden = InfosPageAll.filter(el => !BVsFavlistVisable.includes(el.bvid));
        if (!InfosPageHidden.length) {
            addMessage('没有找到隐藏的视频', false, 'green');
            return;
        }

        let count = 1;
        InfosPageHidden.forEach(el => {
            if (defaultFilter) {
                addMessage(`第 ${Math.floor((InfosPageAll.findIndex(ele => ele.bvid === el.bvid) + detectionScope2Range.apiURL2DetectionScope2RangeStart - 1) / pageSize) + 1} 页${settings.detectionScope2DisplayPosition ? `的第 ${(InfosPageAll.findIndex(ele => ele.bvid === el.bvid) + detectionScope2Range.apiURL2DetectionScope2RangeStart - 1) % pageSize + 1} 个` : ''}:`, false, 'green');
            } else {
                addMessage(`第 ${count++} 个:`, false, 'green');
            }

            if (el.cover && !el.cover.includes('be27fd62c99036dce67efface486fb0a88ffed06')) {
                addMessage(`<img src="//${el.cover.replace(getHttpsFromURLRegex, '').replace(getAvifFromURLRegex, '')}@672w_378h_1c.avif" style="max-width: 100%; height: auto;">`);
            }
            if (el.title && el.title !== '已失效视频') {
                addMessage(`标题: ${el.title}`);
            }
            addMessage(`AV号: ${el.id}`);
            addMessage(`BV号: ${el.bvid}`);
            addMessage(`简介: ${el.intro}`);
            addMessage(`UP主: <a href="https://space.bilibili.com/${el.upper.mid}" target="_blank" style="text-decoration-line: underline;">${el.upper.name}</a>`, true);
            if (settings.apiURL2DisplayTime) {
                addMessage(`上传时间: ${new Date(1000 * el.ctime).toLocaleString()}`, true);
                addMessage(`发布时间: ${new Date(1000 * el.pubtime).toLocaleString()}`, true);
                addMessage(`收藏时间: ${new Date(1000 * el.fav_time).toLocaleString()}`, true);
            }
            if (Array.isArray(el.pages)) {
                el.pages.forEach(ele => {
                    addMessage(`分集${ele.page}: cid: ${ele.id}`, true);
                    addMessage(`标题: ${ele.title}`);
                });
            }
            if (settings.addMessageJumpRemoveAdd) {
                addMessageJumpRemoveAdd(el.id, el.bvid, true);
            }
        });
    }

    function jump(BV) {

        GM_openInTab(`https://www.biliplus.com/video/${BV}`, { active: true, insert: false, setParent: true });
        GM_openInTab(`https://xbeibeix.com/video/${BV}`, { insert: false, setParent: true });
        GM_openInTab(`https://www.jijidown.com/video/${BV}`, { insert: false, setParent: true });
    }

    async function remove(AV, cookies, spanRemove) {

        let fid;
        if (newFreshSpace) {
            const getFidFromURLMatch = location.href.match(getFidFromURLRegex);
            if (getFidFromURLMatch) {
                fid = parseInt(getFidFromURLMatch[1], 10);
            } else {
                throw ['无法获取当前收藏夹的fid, 刷新页面可能有帮助'];
            }
        } else {
            fid = document.querySelector('.fav-item.cur').getAttribute('fid');
        }

        const csrf = cookies[0].value;
        if (removeURL === 1) {
            const data = `resources=${AV}:${type}&media_id=${fid}&platform=web&csrf=${csrf}`;
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://api.bilibili.com/x/v3/fav/resource/batch-del',
                    data: data,
                    timeout: 5000,
                    responseType: 'json',
                    headers: {
                        'Content-Length': data.length,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    onload: (res) => resolve(res),
                    onerror: (res) => reject(['请求失败', 'api.bilibili.com/x/v3/fav/resource/batch-del', res.error]),
                    ontimeout: () => reject(['请求超时', 'api.bilibili.com/x/v3/fav/resource/batch-del'])
                });
            });
            if (response.status !== 200) {
                throw ['请求失败', 'api.bilibili.com/x/v3/fav/resource/batch-del', `${response.status} ${response.statusText}`];
            }
            console.log(response.response);

        } else {
            const data = `rid=${AV}&type=${type}&add_media_ids=&del_media_ids=${fid}&platform=web&csrf=${csrf}`;
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://api.bilibili.com/x/v3/fav/resource/deal',
                    data: data,
                    timeout: 5000,
                    responseType: 'json',
                    headers: {
                        'Content-Length': data.length,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    onload: (res) => resolve(res),
                    onerror: (res) => reject(['请求失败', 'api.bilibili.com/x/v3/fav/resource/deal', res.error]),
                    ontimeout: () => reject(['请求超时', 'api.bilibili.com/x/v3/fav/resource/deal'])
                });
            });
            if (response.status !== 200) {
                throw ['请求失败', 'api.bilibili.com/x/v3/fav/resource/deal', `${response.status} ${response.statusText}`];
            }
            console.log(response.response);
        }

        spanRemove.textContent = ' ✔';
        setTimeout(() => {
            spanRemove.textContent = '';
        }, 1000);
    }

    async function add(AV, cookies, spanAdd) {

        let fid;
        if (newFreshSpace) {
            const getFidFromURLMatch = location.href.match(getFidFromURLRegex);
            if (getFidFromURLMatch) {
                fid = parseInt(getFidFromURLMatch[1], 10);
            } else {
                throw ['无法获取当前收藏夹的fid, 刷新页面可能有帮助'];
            }
        } else {
            fid = document.querySelector('.fav-item.cur').getAttribute('fid');
        }

        const csrf = cookies[0].value;
        const data = `rid=${AV}&type=${type}&add_media_ids=${fid}&del_media_ids=&platform=web&csrf=${csrf}`;
        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.bilibili.com/x/v3/fav/resource/deal',
                data: data,
                timeout: 5000,
                responseType: 'json',
                headers: {
                    'Content-Length': data.length,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                onload: (res) => resolve(res),
                onerror: (res) => reject(['请求失败', 'api.bilibili.com/x/v3/fav/resource/deal', res.error]),
                ontimeout: () => reject(['请求超时', 'api.bilibili.com/x/v3/fav/resource/deal'])
            });
        });
        if (response.status !== 200) {
            throw ['请求失败', 'api.bilibili.com/x/v3/fav/resource/deal', `${response.status} ${response.statusText}`];
        }

        console.log(response.response);
        spanAdd.textContent = ' ✔';
        setTimeout(() => {
            spanAdd.textContent = '';
        }, 1000);
    }

    function addMessage(msg, smallFontSize, border) {
        let px;
        if (smallFontSize) {
            px = newFreshSpace ? 11 : 10;
        } else {
            px = newFreshSpace ? 13 : 12;
        }
        const p = document.createElement('p');
        p.innerHTML = msg;
        p.style.fontSize = `${px}px`;
        if (border === 'red') {
            p.style.borderTop = '1px solid #800000';
        } else if (border === 'green') {
            p.style.borderTop = '1px solid #008000';
        }
        divMessage.appendChild(p);

        if (!divMessageHeightFixed && (divMessage.scrollHeight > settings.divMessageHeight * (newFreshSpace ? 20 : 18))) {
            divMessage.classList.add('detect-divMessage-heightFixed' + classAppendNewFreshSpace);
            divMessageHeightFixed = true;
        }

        p.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }

    function addMessageJumpRemoveAdd(AV, BV, smallFontSize, border) {
        let px;
        if (smallFontSize) {
            px = newFreshSpace ? 11 : 10;
        } else {
            px = newFreshSpace ? 13 : 12;
        }
        const p = document.createElement('p');
        p.style.fontSize = `${px}px`;
        if (border === 'red') {
            p.style.borderTop = '1px solid #800000';
        } else if (border === 'green') {
            p.style.borderTop = '1px solid #008000';
        }
        divMessage.appendChild(p);

        const spanButtonJump = document.createElement('span');
        spanButtonJump.textContent = '查询视频信息';
        spanButtonJump.style.textDecorationLine = 'underline';
        spanButtonJump.style.cursor = 'pointer';
        spanButtonJump.addEventListener('click', () => {
            try {
                jump(BV);
            } catch (error) {
                if (error instanceof Error) {
                    catchUnknownError(error);
                } else {
                    addMessage(error[0], false, 'red');
                    for (let i = 1; i < error.length; i++) {
                        addMessage(error[i], true);
                    }
                }
            }
        });
        p.appendChild(spanButtonJump);

        p.appendChild(document.createTextNode(' '));

        const spanButtonRemove = document.createElement('span');
        spanButtonRemove.textContent = '取消收藏';
        spanButtonRemove.style.textDecorationLine = 'underline';
        spanButtonRemove.style.cursor = 'pointer';
        spanButtonRemove.addEventListener('click', () => {
            try {
                GM_cookie.list({ name: 'bili_jct' }, async (cookies, error) => {
                    if (error) {
                        throw ['无法读取cookie, 更新Tampermonkey可能有帮助'];
                    }

                    try {
                        await remove(AV, cookies, spanRemove);
                    } catch (error) {
                        if (error instanceof Error) {
                            catchUnknownError(error);
                        } else {
                            addMessage(error[0], false, 'red');
                            for (let i = 1; i < error.length; i++) {
                                addMessage(error[i], true);
                            }
                        }
                    }
                });

            } catch (error) {
                catchUnknownError(error);
            }
        });
        p.appendChild(spanButtonRemove);

        const spanRemove = document.createElement('span');
        p.appendChild(spanRemove);

        p.appendChild(document.createTextNode(' '));

        const spanButtonAdd = document.createElement('span');
        spanButtonAdd.textContent = '添加收藏';
        spanButtonAdd.style.textDecorationLine = 'underline';
        spanButtonAdd.style.cursor = 'pointer';
        spanButtonAdd.addEventListener('click', () => {
            try {
                GM_cookie.list({ name: 'bili_jct' }, async (cookies, error) => {
                    if (error) {
                        throw ['无法读取cookie, 更新Tampermonkey可能有帮助'];
                    }

                    try {
                        await add(AV, cookies, spanAdd);
                    } catch (error) {
                        if (error instanceof Error) {
                            catchUnknownError(error);
                        } else {
                            addMessage(error[0], false, 'red');
                            for (let i = 1; i < error.length; i++) {
                                addMessage(error[i], true);
                            }
                        }
                    }
                });

            } catch (error) {
                catchUnknownError(error);
            }
        });
        p.appendChild(spanButtonAdd);

        const spanAdd = document.createElement('span');
        p.appendChild(spanAdd);

        if (!divMessageHeightFixed && (divMessage.scrollHeight > settings.divMessageHeight * (newFreshSpace ? 20 : 18))) {
            divMessage.classList.add('detect-divMessage-heightFixed' + classAppendNewFreshSpace);
            divMessageHeightFixed = true;
        }

        p.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }

    function clearMessage() {
        while (divMessage.firstChild) {
            divMessage.removeChild(divMessage.firstChild);
        }
        divMessage.classList.remove('detect-divMessage-heightFixed' + classAppendNewFreshSpace);
        divMessageHeightFixed = false;
    }

    function catchUnknownError(error) {
        addMessage('发生未知错误, 请反馈该问题', false, 'red');
        addMessage(error.stack, true);
        console.error(error);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function abortActiveControllers() {
        for (const controller of activeControllers) {
            controller.abort();
        }
    }

    async function appendParamsForApiURL2(fid, pageNumber, pageSize) {
        const inputKeyword = document.querySelector(newFreshSpace ? 'input.fav-list-header-filter__search' : 'input.search-fav-input');
        let keyword = '';
        if (inputKeyword) {
            keyword = encodeURIComponent(inputKeyword.value);
        }

        let divFilterOrder;
        let divTid;

        if (!newFreshSpace) {
            const divDropdownFilterItems = document.querySelectorAll('div.fav-filters > div.be-dropdown.filter-item');
            if (divDropdownFilterItems.length === 2) {
                divFilterOrder = divDropdownFilterItems[1].querySelector('span');
                divTid = divDropdownFilterItems[0].querySelector('span');
            } else if (divDropdownFilterItems.length === 1) {
                divFilterOrder = divDropdownFilterItems[0].querySelector('span');
                divTid = null;
            } else {
                divFilterOrder = null;
                divTid = null;
            }
        }

        if (!newFreshSpace) {
            let orderText = '收藏';
            if (divFilterOrder) {
                orderText = divFilterOrder.textContent;
            }
            if (orderText.includes('收藏')) {
                order = 'mtime';
            } else if (orderText.includes('播放')) {
                order = 'view';
            } else if (orderText.includes('投稿')) {
                order = 'pubtime';
            } else {
                throw ['无法确定各个视频的排序方式, 请反馈该问题'];
            }
        }

        const divType = document.querySelector(newFreshSpace ? 'div.vui_input__prepend' : 'div.search-types');
        let typeText = '当前';
        if (divType) {
            typeText = divType.innerText;
        }
        if (newFreshSpace && !keyword) {
            typeText = '当前';
        }
        let type;
        if (typeText.includes('当前')) {
            type = 0;
        } else if (typeText.includes('全部')) {
            type = 1;
        } else {
            throw ['无法确定搜索的范围为当前收藏夹还是全部收藏夹, 请反馈该问题'];
        }

        if (newFreshSpace) {
            divTid = document.querySelector('div.fav-list-header-collapse div.radio-filter__item--active');
        }
        let tidText = '全部分区';
        if (divTid) {
            tidText = divTid.innerText;
        }
        let tid;
        if (tidText.includes('全部')) {
            tid = 0;
        } else {
            const UID = parseInt(location.href.match(getUIDFromURLRegex)[1], 10);
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://api.bilibili.com/x/v3/fav/resource/partition?up_mid=${UID}&media_id=${fid}` + (newFreshSpace ? '&web_location=333.1387' : ''),
                    timeout: 5000,
                    responseType: 'json',
                    onload: (res) => resolve(res),
                    onerror: (res) => reject(['请求失败', 'api.bilibili.com/x/v3/fav/resource/partition', res.error]),
                    ontimeout: () => reject(['请求超时', 'api.bilibili.com/x/v3/fav/resource/partition'])
                });
            });
            if (response.status !== 200) {
                throw ['请求失败', 'api.bilibili.com/x/v3/fav/resource/partition', `${response.status} ${response.statusText}`];
            }

            const found = response.response.data.find(el => tidText.includes(el.name));
            if (found) {
                tid = found.tid;
            } else {
                throw ['无法确定选择的分区, 请反馈该问题'];
            }
        }

        return (`https://api.bilibili.com/medialist/gateway/base/spaceDetail?media_id=${fid}&pn=${pageNumber}&ps=${pageSize}&keyword=${keyword}&order=${order}&type=${type}&tid=${tid}&jsonp=jsonp`);
    }

    function validateInputText(event) {
        try {
            const inputText = event.target;
            let value = inputText.value.trim();
            if (!value || isNaN(value)) {
                value = Number(inputText.getAttribute('detect-def'));
            } else {
                value = Math.floor(Number(value));
                if (value < Number(inputText.getAttribute('detect-min'))) {
                    value = Number(inputText.getAttribute('detect-min'));
                } else if (value > Number(inputText.getAttribute('detect-max'))) {
                    value = Number(inputText.getAttribute('detect-max'));
                }
            }
            inputText.value = value;
            settings[(inputText.getAttribute('detect-setting'))] = value;
            GM_setValue('settings', settings);
        } catch (error) {
            catchUnknownError(error);
        }
    }

    function validateInputTextRangeStart(event) {
        try {
            const inputTextRangeStart = event.target;
            const inputTextRangeEnd = inputTextRangeStart.parentNode.nextElementSibling.childNodes[1];
            const keyRangeStart = inputTextRangeStart.getAttribute('detect-setting');
            const keyRangeEnd = inputTextRangeEnd.getAttribute('detect-setting');
            const step = Number(inputTextRangeStart.getAttribute('detect-step'));
            let value = inputTextRangeStart.value.trim();
            if (!value || isNaN(value)) {
                value = Number(inputTextRangeStart.getAttribute('detect-def'));
                inputTextRangeEnd.value = detectionScope2Range[keyRangeEnd] = Number(inputTextRangeEnd.getAttribute('detect-def'));
            } else {
                value = Math.floor(Number(value));
                if (value < Number(inputTextRangeStart.getAttribute('detect-min'))) {
                    value = Number(inputTextRangeStart.getAttribute('detect-min'));
                } else if (value > Number(inputTextRangeStart.getAttribute('detect-max'))) {
                    value = Number(inputTextRangeStart.getAttribute('detect-max'));
                }
            }
            value -= ((value - 1) % step);
            if (value > detectionScope2Range[keyRangeEnd]) {
                if (value - detectionScope2Range[keyRangeEnd] === 1) {
                    inputTextRangeEnd.value = detectionScope2Range[keyRangeEnd] = Math.min(value + detectionScope2Range[keyRangeEnd] - detectionScope2Range[keyRangeStart], Number(inputTextRangeEnd.getAttribute('detect-max')));
                } else {
                    inputTextRangeEnd.value = detectionScope2Range[keyRangeEnd] = value + step - 1;
                }
            }
            inputTextRangeStart.value = detectionScope2Range[keyRangeStart] = value;
        } catch (error) {
            catchUnknownError(error);
        }
    }

    function validateInputTextRangeEnd(event) {
        try {
            const inputTextRangeEnd = event.target;
            const inputTextRangeStart = inputTextRangeEnd.parentNode.previousElementSibling.childNodes[1];
            const keyRangeEnd = inputTextRangeEnd.getAttribute('detect-setting');
            const keyRangeStart = inputTextRangeStart.getAttribute('detect-setting');
            const step = Number(inputTextRangeEnd.getAttribute('detect-step'));
            let value = inputTextRangeEnd.value.trim();
            if (!value || isNaN(value)) {
                value = Number(inputTextRangeEnd.getAttribute('detect-def'));
                inputTextRangeStart.value = detectionScope2Range[keyRangeStart] = Number(inputTextRangeStart.getAttribute('detect-def'));
            } else {
                value = Math.floor(Number(value));
                if (value < Number(inputTextRangeEnd.getAttribute('detect-min'))) {
                    value = Number(inputTextRangeEnd.getAttribute('detect-min'));
                } else if (value > Number(inputTextRangeEnd.getAttribute('detect-max'))) {
                    value = Number(inputTextRangeEnd.getAttribute('detect-max'));
                }
            }
            value = Math.ceil(value / step) * step;
            if (value < detectionScope2Range[keyRangeStart]) {
                if (detectionScope2Range[keyRangeStart] - value === 1) {
                    inputTextRangeStart.value = detectionScope2Range[keyRangeStart] = Math.max(value - detectionScope2Range[keyRangeEnd] + detectionScope2Range[keyRangeStart], Number(inputTextRangeStart.getAttribute('detect-min')));
                } else {
                    inputTextRangeStart.value = detectionScope2Range[keyRangeStart] = value - step + 1;
                }
            }
            inputTextRangeEnd.value = detectionScope2Range[keyRangeEnd] = value;
        } catch (error) {
            catchUnknownError(error);
        }
    }

    function validateInputTextDivMessageHeight(event) {
        try {
            const inputText = event.target;
            let value = inputText.value.trim();
            if (!value || isNaN(value)) {
                value = Number(inputText.getAttribute('detect-def'));
            } else {
                value = Math.floor(Number(value));
                if (value < Number(inputText.getAttribute('detect-min'))) {
                    value = Number(inputText.getAttribute('detect-min'));
                } else if (value > Number(inputText.getAttribute('detect-max'))) {
                    value = Number(inputText.getAttribute('detect-max'));
                }
            }
            inputText.value = value;
            settings[(inputText.getAttribute('detect-setting'))] = value;
            GM_setValue('settings', settings);
            document.querySelector('#detect-style-divMessage-heightFixed').textContent = `
                .detect-divMessage-heightFixed {
                    height: ${value * 18}px;
                }
                .detect-divMessage-heightFixed-newFreshSpace {
                    height: ${value * 20}px;
                }
            `;
            if (divMessage.scrollHeight > value * (newFreshSpace ? 20 : 18)) {
                divMessage.classList.add('detect-divMessage-heightFixed' + classAppendNewFreshSpace);
                divMessageHeightFixed = true;
            } else {
                divMessage.classList.remove('detect-divMessage-heightFixed' + classAppendNewFreshSpace);
                divMessageHeightFixed = false;
            }
        } catch (error) {
            catchUnknownError(error);
        }
    }

    const XOR_CODE = 23442827791579n;
    const MASK_CODE = 2251799813685247n;
    const MAX_AID = 1n << 51n;
    const BASE = 58n;
    const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';

    function av2bv(aid) {
        const bytes = ['B', 'V', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
        let bvIndex = bytes.length - 1;
        let tmp = (MAX_AID | BigInt(aid)) ^ XOR_CODE;
        while (tmp > 0) {
            bytes[bvIndex] = data[Number(tmp % BigInt(BASE))];
            tmp = tmp / BASE;
            bvIndex -= 1;
        }
        [bytes[3], bytes[9]] = [bytes[9], bytes[3]];
        [bytes[4], bytes[7]] = [bytes[7], bytes[4]];
        return bytes.join('');
    }

    function bv2av(bvid) {
        const bvidArr = Array.from(bvid);
        [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
        [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
        bvidArr.splice(0, 3);
        const tmp = bvidArr.reduce((pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar)), 0n);
        return Number((tmp & MASK_CODE) ^ XOR_CODE);
    }
})();