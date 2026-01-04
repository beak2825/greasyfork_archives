// ==UserScript==
// @name              bilibili favlist backup
// @name:zh-CN        哔哩哔哩(B站|Bilibili)收藏夹Fix (备份视频信息)
// @name:zh-TW        哔哩哔哩(B站|Bilibili)收藏夹Fix (备份视频信息)
// @namespace         http://tampermonkey.net/
// @version           39
// @description       automatically backup info of videos in favlist
// @description:zh-CN 自动备份视频信息至本地和第三方网站, 失效视频信息回显
// @description:zh-TW 自动备份视频信息至本地和第三方网站, 失效视频信息回显
// @author            YTB0710
// @match             https://space.bilibili.com/*
// @connect           bbdownloader.com
// @connect           beibeigame.com
// @connect           bilibili.com
// @connect           biliplus.com
// @connect           jiji.moe
// @connect           jijidown.com
// @connect           xbeibeix.com
// @grant             GM_openInTab
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_deleteValue
// @grant             GM_listValues
// @grant             GM_getValues
// @grant             GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/521668/bilibili%20favlist%20backup.user.js
// @updateURL https://update.greasyfork.org/scripts/521668/bilibili%20favlist%20backup.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const version = 39;

    const favlistURLRegex = /https:\/\/space\.bilibili\.com\/\d+\/favlist.*/;
    const localeTimeStringRegex = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/;
    const getFidFromURLRegex = /fid=(\d+)/;
    const getUIDFromURLRegex = /https:\/\/space\.bilibili\.com\/(\d+)/;
    const getBVFromURLRegex = /video\/(BV\w{10})/;
    const getHttpsFromURLRegex = /^(https?:\/\/|\/\/)/;
    const getJsonFromBiliplusRegex = /window\.addEventListener\('DOMContentLoaded',function\(\){view\((.+)\);}\);/;
    const getParamsWithSignFromBiliplusRegex = /api\/view_all(.+)'/;
    const getFilenameFromURLRegex = /[^/]+(?:\.[a-zA-Z0-9]+)$/;
    const getBmgSrcNextFromURLRegex = /@.*/;

    let onFavlistPage = false;
    let autoNextPage = false;
    let autoNextFavlist = false;
    let debug = false;
    let newFreshSpace;
    let classAppendNewFreshSpace;
    let pageSize;
    let firstTimeMain = true;
    let divMessage;
    let divMessageHeightFixed = false;
    let lastTimeDivMessageScrollIntoView;
    let order = 'mtime';
    let bmgSrcNext = '@672w_378h_1c.avif';
    const activeControllers = new Set();
    const getFromApiExtraThumbnailsSkip = [];

    let getFromApiExtraDelay = true;

    let checkboxGetFromBiliplus;
    let checkboxGetFromBiliplusExtra;
    let checkboxGetFromXbeibeix;
    let checkboxGetFromXbeibeixExtra;

    let getFromBiliplusCounter = 0;
    let divMessageScrollIntoViewCounter = 0;

    setInterval(() => {
        if (getFromBiliplusCounter > 0) {
            getFromBiliplusCounter--;
        }
        if (divMessageScrollIntoViewCounter > 0) {
            divMessageScrollIntoViewCounter--;
        }
    }, 1000);

    const keys = [
        'BV',
        'AV',
        'title',
        'intro',
        'cover',
        'upperUID',
        'upperName',
        'upperAvatar',
        'timeUpload',
        'timePublish',
        'timeFavorite',
        'dynamic',
        'pages',
        'api',
        'apiExtra',
        'biliplus',
        'biliplusExtra',
        'jijidown',
        'jijidownExtra',
        'xbeibeix',
    ];

    const settings = GM_getValue('settings', {
        processOthersFavlist: false,
        processNormal: true,
        processDisabled: true,
        getFromApi: true,
        getFromApiUpdate: true,
        getFromApiUpdateInterval: 5,
        getFromApiExtra: false,
        getFromApiExtraThumbnails: false,
        getFromApiExtraUpdate: true,
        getFromApiExtraUpdateAll: false,
        getFromApiExtraUpdateInterval: 5,
        getFromBiliplus: false,
        getFromBiliplusUpdate: false,
        getFromBiliplusUpdateInterval: 10,
        getFromBiliplusURL: 'www.biliplus.com/video',
        getFromBiliplusExtra: false,
        getFromBiliplusExtraUpdate: false,
        getFromBiliplusExtraUpdateInterval: 10,
        getFromJijidown: false,
        getFromJijidownUpdate: false,
        getFromJijidownUpdateInterval: 10,
        getFromJijidownExtra: false,
        getFromJijidownExtraUpdate: false,
        getFromJijidownExtraUpdateInterval: 10,
        getFromJijidownURL: 'www.jijidown.com',
        getFromXbeibeix: false,
        getFromXbeibeixUpdate: false,
        getFromXbeibeixUpdateInterval: 10,
        getFromXbeibeixURL: 'xbeibeix.com',
        autoNextPageInterval: 5,
        requestTimeout: 10,
        delayBeforeMain: 300,
        appendDropdownsOrder: 'abcdefg',
        TCABJXOpacity: 100,
        autoDisableGetFromBJX: true,
        displayAdvancedControls: false,
        exportBackupWithoutTsFrom: false,
        version: 0,
        defaultUID: null,
        defaultFavlistFid: null,
    });

    // debug = true;
    // getFromApiExtraDelay = false;
    // settings.autoNextPageInterval = 1;
    // settings.delayBeforeMain = 0;
    // settings.exportBackupWithoutTsFrom = true;
    // keys.push('xbeibeixExtra');
    // settings.getFromXbeibeixExtra ??= false;

    const favlistObserver = new MutationObserver(async (_mutations, observer) => {
        if (debug) console.debug('callback favlistObserver');
        if (document.querySelector('div.items')) {
            if (debug) console.debug('disconnect favlistObserver');
            observer.disconnect();
            newFreshSpace = true;
            classAppendNewFreshSpace = '-newFreshSpace';
            pageSize = window.innerWidth < 1760 ? 40 : 36;
            initControls();
            if (!firstTimeMain) {
                await delay(settings.delayBeforeMain + 300);
                main();
            }
            if (debug) console.debug('observe itemsObserver');
            itemsObserver.observe(document.querySelector('div.items'), { childList: true, attributes: false, characterData: false });
            if (debug) console.debug('observe bodyChildListObserver');
            bodyChildListObserver.observe(document.body, { childList: true, attributes: false, characterData: false });
            if (debug) console.debug('observe radioFilterObserver');
            radioFilterObserver.observe(document.querySelector('div.fav-list-header-filter__left > div'), { subtree: true, characterData: false, attributeFilter: ['class'] });
            if (debug) console.debug('observe headerFilterLeftChildListObserver');
            headerFilterLeftChildListObserver.observe(document.querySelector('div.fav-list-header-filter__left'), { childList: true, attributes: false, characterData: false });
            return;
        }
        if (document.querySelector('div.fav-content.section')) {
            if (debug) console.debug('disconnect favlistObserver');
            observer.disconnect();
            newFreshSpace = false;
            classAppendNewFreshSpace = '';
            pageSize = 20;
            initControls();
            if (debug) console.debug('observe favContentSectionObserver');
            favContentSectionObserver.observe(document.querySelector('div.fav-content.section'), { characterData: false, attributeFilter: ['class'] });
            return;
        }
    });

    const itemsObserver = new MutationObserver(async () => {
        abortActiveControllers();
        if (debug) console.debug('callback itemsObserver');
        if (settings.delayBeforeMain) {
            await delay(settings.delayBeforeMain);
        }
        main();
    });

    const bodyChildListObserver = new MutationObserver(mutations => {
        if (debug) console.debug('callback bodyChildListObserver');
        if (debug) console.debug(mutations);
        for (const mutation of mutations) {
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.nodeType === 1 && addedNode.classList.contains('bili-card-dropdown-popper')) {
                    appendDropdowns(addedNode);
                    // return;
                }
                // if (addedNode.nodeType === 1 && addedNode.classList.contains('vui_toast--wrapper')) {
                //     abortActiveControllers();
                //     if (debug) console.debug('disconncet itemsObserver');
                //     itemsObserver.disconnect();
                //     // return;
                // }
            }
            // for (const removedNode of mutation.removedNodes) {
            //     if (removedNode.nodeType === 1 && removedNode.classList.contains('vui_toast--wrapper')) {
            //         abortActiveControllers();
            //         // mainNewFreshSpace();
            //         main();
            //         if (debug) console.debug('observe itemsObserver');
            //         itemsObserver.observe(document.querySelector('div.items'), { childList: true, attributes: false, characterData: false });
            //         // return;
            //     }
            // }
        }
    });

    const radioFilterObserver = new MutationObserver(mutations => {
        if (debug) console.debug('callback radioFilterObserver');
        if (debug) console.debug(mutations);
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
                    addMessage({ msg: '无法确定各个视频的排序方式, 请反馈该问题', border: 'red' });
                }
                if (debug) console.log(`order: ${order}`);
            }
        }
    });

    const headerFilterLeftChildListObserver = new MutationObserver(mutations => {
        if (debug) console.debug('callback headerFilterLeftChildListObserver');
        if (debug) console.debug(mutations);
        for (const mutation of mutations) {
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.nodeType === 1 && addedNode.classList.contains('radio-filter')) {
                    order = 'mtime';
                    if (debug) console.log(`order: ${order}`);
                    if (debug) console.debug('observe radioFilterObserver');
                    radioFilterObserver.observe(addedNode, { subtree: true, characterData: false, attributeFilter: ['class'] });
                }
            }
            for (const removedNode of mutation.removedNodes) {
                if (removedNode.nodeType === 1 && removedNode.classList.contains('radio-filter')) {
                    if (debug) console.debug('disconncet radioFilterObserver');
                    radioFilterObserver.disconnect();
                }
            }
        }
    });

    const favContentSectionObserver = new MutationObserver(mutations => {
        if (debug) console.debug('callback favContentSectionObserver');
        for (const mutation of mutations) {
            if (!mutation.target.classList.contains('loading')) {
                abortActiveControllers();
                main();
                return;
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
        if (debug) console.debug('checkURL');
        if (favlistURLRegex.test(location.href)) {
            if (!onFavlistPage) {
                onFavlistPage = true;
                autoNextPage = false;
                autoNextFavlist = false;
                if (debug) console.debug('observe favlistObserver');
                favlistObserver.observe(document.body, { subtree: true, childList: true, attributes: false, characterData: false });
            }
        } else {
            if (onFavlistPage) {
                abortActiveControllers();
                onFavlistPage = false;
                if (debug) console.debug('disconnect favlistObserver');
                favlistObserver.disconnect();
                if (debug) console.debug('disconncet itemsObserver');
                itemsObserver.disconnect();
                if (debug) console.debug('disconncet bodyChildListObserver');
                bodyChildListObserver.disconnect();
                if (debug) console.debug('disconncet radioFilterObserver');
                radioFilterObserver.disconnect();
                if (debug) console.debug('disconncet headerFilterLeftChildListObserver');
                headerFilterLeftChildListObserver.disconnect();
                if (debug) console.debug('disconncet favContentSectionObserver');
                favContentSectionObserver.disconnect();
            }
        }
    }

    async function main() {

        if (debug) console.log('============main============');

        let controller;
        firstTimeMain = false;

        try {

            controller = new AbortController();
            activeControllers.add(controller);

            if (settings.defaultUID) {
                if (settings.defaultUID !== parseInt(location.href.match(getUIDFromURLRegex)[1], 10) && !settings.processOthersFavlist) {
                    if (debug) console.log('不处理他人收藏夹');
                    return;
                }
            } else {
                settings.defaultUID = parseInt(location.href.match(getUIDFromURLRegex)[1], 10);
                GM_setValue('settings', settings);
            }

            let currentFavlist;
            if (newFreshSpace) {
                currentFavlist = document.querySelector('div.vui_sidebar-item--active');
                if (!document.querySelector('div.fav-collapse').contains(currentFavlist)) {
                    if (debug) console.log('不处理特殊收藏夹');
                    return;
                }
            } else {
                currentFavlist = document.querySelector('.fav-item.cur');
                if (!document.querySelector('div.nav-container').contains(currentFavlist)) {
                    if (debug) console.log('不处理特殊收藏夹');
                    return;
                }
            }

            let fid;
            if (newFreshSpace) {
                const getFidFromURLMatch = location.href.match(getFidFromURLRegex);
                if (getFidFromURLMatch) {
                    fid = parseInt(getFidFromURLMatch[1], 10);
                    if (!settings.defaultFavlistFid && !currentFavlist.parentNode.getAttribute('id') && settings.defaultUID === parseInt(location.href.match(getUIDFromURLRegex)[1], 10)) {
                        settings.defaultFavlistFid = fid;
                        GM_setValue('settings', settings);
                    }
                } else if (settings.defaultFavlistFid && settings.defaultUID === parseInt(location.href.match(getUIDFromURLRegex)[1], 10)) {
                    fid = settings.defaultFavlistFid;
                } else {
                    throw ['无法获取当前收藏夹的fid, 刷新页面可能有帮助'];
                }
            } else {
                fid = parseInt(currentFavlist.getAttribute('fid'), 10);
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

            const videos = document.querySelectorAll(newFreshSpace ? 'div.items__item' : 'li.small-item');

            const getFromApiResponse = {};

            for (const [index, video] of videos.entries()) {

                let as;
                const AVBVTitle = {
                    AV: null,
                    BV: null,
                    title: null
                };

                try {

                    if (controller.signal.aborted) {
                        throw new DOMException('', 'AbortError');
                    }

                    if (video.querySelector(newFreshSpace ? 'div.bili-cover-card__tags' : 'div.ogv-corner-tag')) {
                        if (debug) console.log('不处理特殊视频');
                        continue;
                    }

                    let disabled = false;
                    if (newFreshSpace) {
                        const divStats = video.querySelector('div.bili-cover-card__stats');
                        if (!searchKeyword && !divStats) {
                            disabled = true;
                        }
                        if (searchKeyword) {
                            const result = video.querySelector('img')?.getAttribute('src').includes('be27fd62c99036dce67efface486fb0a88ffed06');
                            if (result === undefined) {
                                continue;
                            } else if (result === true) {
                                disabled = true;
                                if (divStats) {
                                    divStats.remove();
                                } else {
                                    if (debug) {
                                        addMessage({ msg: 'divStats已移除', border: 'red' });
                                        console.warn('divStats已移除');
                                    }
                                }
                            }
                        }

                    } else {
                        if (video.classList.contains('disabled')) {
                            disabled = true;
                        }
                    }

                    if (!settings.processNormal && !disabled) {
                        continue;
                    }
                    if (!settings.processDisabled && disabled) {
                        continue;
                    }

                    as = video.querySelectorAll('a');

                    const divTitleNewFreshSpace = video.querySelector('div.bili-video-card__title');

                    if (controller.signal.aborted) {
                        throw new DOMException('', 'AbortError');
                    }

                    if (newFreshSpace) {
                        const getBVFromURLMatch = as[0]?.getAttribute('href').match(getBVFromURLRegex);
                        if (!getBVFromURLMatch) {
                            continue;
                        }
                        AVBVTitle.BV = getBVFromURLMatch[1];
                    } else {
                        AVBVTitle.BV = video.getAttribute('data-aid');
                    }

                    AVBVTitle.title = as[1].textContent;

                    if (debug) {
                        console.log('========video========');
                        console.log(`收藏夹fid: ${fid} 位置: 第${pageNumber}页的第${index + 1}个`);
                        console.log(`BV号: ${AVBVTitle.BV} 标题: ${AVBVTitle.title.slice(0, 10)}`);
                    }

                    let spanTimeFavorite;
                    let divTCABJX;
                    let spanTimePublish;

                    if (newFreshSpace) {
                        const divSubtitle = document.createElement('div');
                        divSubtitle.classList.add('bili-video-card__subtitle');
                        video.querySelector('div.bili-video-card__details').appendChild(divSubtitle);
                        spanTimePublish = document.createElement('span');
                        spanTimePublish.textContent = '投稿于：';
                        divSubtitle.appendChild(spanTimePublish);

                        divTCABJX = document.createElement('div');
                        divTCABJX.style.marginLeft = 'auto';
                        divTCABJX.style.display = 'block';
                        divSubtitle.appendChild(divTCABJX);

                        spanTimeFavorite = as[2].querySelectorAll('span')[1];

                    } else {
                        const divMetaPubdate = video.querySelector('div.meta.pubdate');
                        const metaText = divMetaPubdate.innerText;
                        divMetaPubdate.innerHTML = null;

                        spanTimeFavorite = document.createElement('span');
                        spanTimeFavorite.textContent = metaText.replace('： ', '：');
                        spanTimeFavorite.style.width = 'auto';
                        spanTimeFavorite.style.lineHeight = '16px';
                        divMetaPubdate.appendChild(spanTimeFavorite);

                        divTCABJX = divMetaPubdate;
                    }

                    const spanX = document.createElement('span');
                    spanX.classList.add('backup-spanTCABJX' + classAppendNewFreshSpace);
                    spanX.textContent = 'X';
                    spanX.style.opacity = settings.TCABJXOpacity / 100;
                    if (!newFreshSpace) {
                        // spanX.style.marginRight = '11px';
                        spanX.style.marginRight = '9px';
                        spanX.style.lineHeight = '16px';
                    }
                    spanX.addEventListener('click', () => {
                        try {
                            GM_openInTab(`https://${settings.getFromXbeibeixURL}/video/${AVBVTitle.BV}`, { active: true, insert: false, setParent: true });
                        } catch (error) {
                            catchUnknownError(error);
                        }
                    });
                    divTCABJX.appendChild(spanX);

                    const spanJ = document.createElement('span');
                    spanJ.classList.add('backup-spanTCABJX' + classAppendNewFreshSpace);
                    spanJ.textContent = 'J';
                    spanJ.style.opacity = settings.TCABJXOpacity / 100;
                    spanJ.style.marginRight = '3px';
                    if (!newFreshSpace) {
                        spanJ.style.lineHeight = '16px';
                    }
                    spanJ.addEventListener('click', () => {
                        try {
                            GM_openInTab(`https://${settings.getFromJijidownURL}/video/${AVBVTitle.BV}`, { active: true, insert: false, setParent: true });
                            if (debug) {
                                GM_openInTab(`https://${settings.getFromJijidownURL}/api/v1/video_bv/get_info?id=${AVBVTitle.BV.slice(2)}`, { active: false, insert: false, setParent: true });
                                GM_openInTab(`https://${settings.getFromJijidownURL}/api/v1/video_bv/get_download_info?id=${AVBVTitle.BV.slice(2)}`, { active: false, insert: false, setParent: true });
                            }
                        } catch (error) {
                            catchUnknownError(error);
                        }
                    });
                    divTCABJX.appendChild(spanJ);

                    const spanB = document.createElement('span');
                    spanB.classList.add('backup-spanTCABJX' + classAppendNewFreshSpace);
                    spanB.textContent = 'B';
                    spanB.style.opacity = settings.TCABJXOpacity / 100;
                    spanB.style.marginRight = '3px';
                    if (!newFreshSpace) {
                        spanB.style.lineHeight = '16px';
                    }
                    spanB.addEventListener('click', () => {
                        try {
                            GM_openInTab(`https://www.biliplus.com/video/${AVBVTitle.BV}`, { active: true, insert: false, setParent: true });
                            if (debug) {
                                if (AVBVTitle.AV) {
                                    GM_openInTab(`https://www.biliplus.com/api/view?id=${AVBVTitle.AV}`, { active: false, insert: false, setParent: true });
                                } else {
                                    GM_openInTab(`https://www.biliplus.com/api/view?id=${AVBVTitle.BV}`, { active: false, insert: false, setParent: true });
                                }
                            }
                        } catch (error) {
                            catchUnknownError(error);
                        }
                    });
                    divTCABJX.appendChild(spanB);

                    const spanA = document.createElement('span');
                    spanA.classList.add('backup-spanTCABJX' + classAppendNewFreshSpace);
                    spanA.textContent = 'A';
                    spanA.style.opacity = settings.TCABJXOpacity / 100;
                    spanA.style.marginRight = '3px';
                    if (!newFreshSpace) {
                        spanA.style.lineHeight = '16px';
                    }
                    spanA.addEventListener('click', async () => {
                        try {
                            GM_openInTab(`https://api.bilibili.com/x/web-interface/view?bvid=${AVBVTitle.BV}`, { active: true, insert: false, setParent: true });
                            if (debug) {
                                GM_openInTab(`https://api.bilibili.com/x/web-interface/archive/desc?bvid=${AVBVTitle.BV}`, { active: false, insert: false, setParent: true });
                                if (AVBVTitle.AV) {
                                    GM_openInTab(`https://api.bilibili.com/x/v3/fav/resource/infos?resources=${AVBVTitle.AV}%3A2&platform=web&folder_id=${fid}`, { active: false, insert: false, setParent: true });
                                }
                                GM_openInTab(await appendParamsForGetFromApi(fid, ((pageNumber - 1) * pageSize + index + 1), 1), { active: false, insert: false, setParent: true });
                            }
                        } catch (error) {
                            catchUnknownError(error);
                        }
                    });
                    divTCABJX.appendChild(spanA);

                    const setValueNeeded = { value: false };

                    const backup = GM_getValue(AVBVTitle.BV, {
                        BV: null,
                        AV: null,
                        title: null,
                        intro: null,
                        cover: null,
                        upperUID: null,
                        upperName: null,
                        upperAvatar: null,
                        timeUpload: null,
                        timePublish: null,
                        timeFavorite: null,
                        dynamic: null,
                        pages: null,
                        api: null,
                        apiExtra: null,
                        biliplus: null,
                        biliplusExtra: null,
                        jijidown: null,
                        jijidownExtra: null,
                        xbeibeix: null,
                    });

                    formatBackup(backup);

                    backup.BV = AVBVTitle.BV;
                    AVBVTitle.AV = backup.AV;

                    if (!searchType && updateTimeFavoriteInBackup(backup, undefined, fid)) {
                        setValueNeeded.value = true;
                    }

                    const getFromBJX = [];
                    const getFromApiExtraNeeded = { value: false };

                    if (settings.getFromApi) {
                        if (!backup.api || (settings.getFromApiUpdate && getCurrentTs() - backup.api.ts > 3600 * settings.getFromApiUpdateInterval)) {
                            const result = await getFromApi(AVBVTitle, backup, spanA, getFromApiResponse, fid, pageNumber, disabled, searchType, getFromApiExtraNeeded, setValueNeeded);
                            if (result === 'continue') {
                                continue;
                            } else if (result === 'return') {
                                return;
                            }

                        } else {
                            spanA.style.color = backup.api.value ? '#00ff00' : '#ff0000';
                            if (!searchType && getFromApiResponse.value) {
                                const found = getFromApiResponse.value.find?.(el => el.bvid === AVBVTitle.BV);
                                if (found) {
                                    if (updateTimeFavoriteInBackup(backup, found.fav_time, fid)) {
                                        setValueNeeded.value = true;
                                    }
                                }
                            }
                        }
                    }

                    if (controller.signal.aborted) {
                        throw new DOMException('', 'AbortError');
                    }

                    if (settings.getFromApiExtra) {
                        if (!backup.apiExtra) {
                            await getFromApiExtra(AVBVTitle, backup, spanA, disabled, setValueNeeded);
                        } else if (settings.getFromApiExtraUpdate && settings.getFromApiExtraUpdateAll && getCurrentTs() - backup.apiExtra.ts > 3600 * 24 * settings.getFromApiExtraUpdateInterval) {
                            await getFromApiExtra(AVBVTitle, backup, spanA, disabled, setValueNeeded);
                        } else if (settings.getFromApiExtraUpdate && !settings.getFromApiExtraUpdateAll && getFromApiExtraNeeded.value) {
                            await getFromApiExtra(AVBVTitle, backup, spanA, disabled, setValueNeeded);
                        } else {
                            spanA.style.color = backup.apiExtra.value ? '#008000' : '#800000';
                        }
                    }

                    if (controller.signal.aborted) {
                        throw new DOMException('', 'AbortError');
                    }

                    if (settings.getFromJijidown) {
                        if (!backup.jijidown || (settings.getFromJijidownUpdate && getCurrentTs() - backup.jijidown.ts > 3600 * 24 * 7 * settings.getFromJijidownUpdateInterval)) {
                            getFromBJX.push(getFromJijidown(AVBVTitle, backup, spanJ, controller));
                        } else if (settings.getFromJijidownExtra) {
                            if (!backup.jijidownExtra || (settings.getFromJijidownExtraUpdate && getCurrentTs() - backup.jijidownExtra.ts > 3600 * 24 * 7 * settings.getFromJijidownExtraUpdateInterval)) {
                                getFromBJX.push(getFromJijidown(AVBVTitle, backup, spanJ, controller));
                            } else {
                                spanJ.style.color = backup.jijidownExtra.value ? '#008000' : '#800000';
                            }
                        } else {
                            spanJ.style.color = backup.jijidown.value ? '#00ff00' : '#ff0000';
                        }
                    }

                    if (settings.getFromXbeibeix) {
                        if (!backup.xbeibeix || (settings.getFromXbeibeixUpdate && getCurrentTs() - backup.xbeibeix.ts > 3600 * 24 * 7 * settings.getFromXbeibeixUpdateInterval)) {
                            getFromBJX.push(getFromXbeibeix(AVBVTitle, backup, spanX, controller));
                        } else if (settings.getFromXbeibeixExtra) {
                            if (!backup.xbeibeixExtra) {
                                getFromBJX.push(getFromXbeibeixExtra(AVBVTitle, backup, spanX));
                            } else {
                                spanX.style.color = backup.xbeibeixExtra.value ? '#008000' : '#800000';
                            }
                        } else {
                            spanX.style.color = backup.xbeibeix.value ? '#00ff00' : '#ff0000';
                        }
                    }

                    if (settings.getFromBiliplus) {
                        if (!backup.biliplus || (settings.getFromBiliplusUpdate && getCurrentTs() - backup.biliplus.ts > 3600 * 24 * 7 * settings.getFromBiliplusUpdateInterval)) {
                            getFromBJX.push(getFromBiliplus(AVBVTitle, backup, spanB, as, controller));
                        } else if (settings.getFromBiliplusExtra) {
                            if (!backup.biliplusExtra || (settings.getFromBiliplusExtraUpdate && getCurrentTs() - backup.biliplusExtra.ts > 3600 * 24 * 7 * settings.getFromBiliplusExtraUpdateInterval)) {
                                getFromBJX.push(getFromBiliplusExtra(AVBVTitle, backup, spanB, as, controller));
                            } else {
                                spanB.style.color = backup.biliplusExtra.value ? '#008000' : '#800000';
                            }
                        } else {
                            spanB.style.color = backup.biliplus.value ? '#00ff00' : '#ff0000';
                        }
                    }

                    if (getFromBJX.length) {
                        await Promise.all(getFromBJX);
                        setValueNeeded.value = true;
                    }

                    if (settings.getFromApiExtraThumbnails && !disabled && backup.AV && backup.pages) {
                        await getFromApiExtraThumbnails(AVBVTitle, backup, as, controller, setValueNeeded);
                    }

                    if (setValueNeeded.value) {
                        const tempBackup = {};
                        for (const key of keys) {
                            tempBackup[key] = backup[key];
                        }
                        GM_setValue(AVBVTitle.BV, tempBackup);
                    }

                    const found = backup.timeFavorite?.find(el => el.fid === fid);

                    if (newFreshSpace) {
                        if (found?.value) {
                            const spanTimeFavoriteSplit = spanTimeFavorite.textContent.split(' · ');
                            spanTimeFavorite.textContent = `${spanTimeFavoriteSplit[0]} · 收藏于${formatTsTimePublish(1000 * found.value)}`;
                            spanTimeFavorite.setAttribute('title', `${spanTimeFavoriteSplit[0]} · 收藏于${new Date(1000 * found.value).toLocaleString()}`);
                        }
                        if (backup.timePublish) {
                            spanTimePublish.textContent = `投稿于：${formatTsTimePublish(1000 * backup.timePublish)}`;
                            spanTimePublish.setAttribute('title', new Date(1000 * backup.timePublish).toLocaleString());
                        }

                    } else {
                        if (found?.value) {
                            spanTimeFavorite.textContent = `收藏于：${formatTsTimeFavorite(new Date(1000 * found.value))}`;
                            spanTimeFavorite.setAttribute('title', new Date(1000 * found.value).toLocaleString());
                        }
                    }

                    let picture;
                    let sourceAvif;
                    let sourceWebp;
                    let img;

                    if (newFreshSpace) {
                        img = video.querySelector('img');
                        if (!img.getAttribute('src').endsWith(bmgSrcNext)) {
                            const getBmgSrcNextFromURLMatch = img.getAttribute('src').match(getBmgSrcNextFromURLRegex);
                            if (getBmgSrcNextFromURLMatch) {
                                bmgSrcNext = getBmgSrcNextFromURLMatch[0];
                            } else {
                                bmgSrcNext = '';
                            }
                            if (debug) {
                                addMessage({ msg: `封面地址后缀: ${bmgSrcNext}`, border: 'red' });
                                console.warn(`封面地址后缀: ${bmgSrcNext}`);
                            }
                        }
                        if (debug) {
                            if (disabled && !searchKeyword && !img.getAttribute('src').includes('be27fd62c99036dce67efface486fb0a88ffed06')) {
                                addMessage({ msg: '失效视频封面已更改', border: 'red' });
                                console.warn('失效视频封面已更改');
                            }
                        }
                    } else {
                        picture = video.querySelector('picture');
                        sourceAvif = picture.querySelector('source[type="image/avif"]');
                        sourceWebp = picture.querySelector('source[type="image/webp"]');
                        img = picture.querySelector('img');
                    }

                    if (disabled) {

                        if (newFreshSpace) {
                            as[2].style.textDecoration = 'line-through';
                            as[2].style.opacity = '0.7';
                            spanTimePublish.style.textDecoration = 'line-through';
                            spanTimePublish.style.opacity = '0.7';

                            if (backup.cover) {
                                img.setAttribute('src', `//${backup.cover[backup.cover.length - 1].value.slice(8)}${bmgSrcNext}`);
                                img.setAttribute('alt', '这个版本的封面已无法访问');
                            }

                        } else {
                            video.classList.remove('disabled');
                            as[0].classList.remove('disabled');

                            as[0].setAttribute('href', `//www.bilibili.com/video/${AVBVTitle.BV}/`);
                            as[0].setAttribute('target', '_blank');
                            as[1].setAttribute('target', '_blank');
                            as[1].setAttribute('href', `//www.bilibili.com/video/${AVBVTitle.BV}/`);

                            spanTimeFavorite.style.textDecoration = 'line-through';
                            spanTimeFavorite.style.opacity = '0.7';

                            if (backup.cover) {
                                sourceAvif.setAttribute('srcset', `//${backup.cover[backup.cover.length - 1].value.slice(8)}@320w_200h_1c_!web-space-favlist-video.avif`);
                                sourceWebp.setAttribute('srcset', `//${backup.cover[backup.cover.length - 1].value.slice(8)}@320w_200h_1c_!web-space-favlist-video.webp`);
                                img.setAttribute('src', `//${backup.cover[backup.cover.length - 1].value.slice(8)}@320w_200h_1c_!web-space-favlist-video.webp`);
                                img.setAttribute('alt', '这个版本的封面已无法访问');
                            }
                        }

                        as[1].style.textDecoration = 'line-through';
                        as[1].style.opacity = '0.5';

                        if (backup.title) {
                            as[1].textContent = backup.title[backup.title.length - 1].value;
                            if (newFreshSpace) {
                                divTitleNewFreshSpace.setAttribute('title', backup.title[backup.title.length - 1].value);
                            } else {
                                as[1].setAttribute('title', backup.title[backup.title.length - 1].value);
                            }
                        }
                    }

                    if (backup.cover?.length > 1) {

                        const spanC = document.createElement('span');
                        spanC.classList.add('backup-spanTCABJX' + classAppendNewFreshSpace);
                        spanC.textContent = 'C';
                        spanC.style.opacity = settings.TCABJXOpacity / 100;
                        spanC.style.marginRight = '3px';
                        spanC.style.color = 'var(--Ga10, #000000)';
                        if (!newFreshSpace) {
                            spanC.style.lineHeight = '16px';
                        }
                        let i = backup.cover.length - 2;
                        spanC.addEventListener('click', () => {
                            try {
                                if (i < 0) {
                                    i = backup.cover.length - 1;
                                }

                                if (newFreshSpace) {
                                    img.setAttribute('src', `//${backup.cover[i].value.slice(8)}${bmgSrcNext}`);
                                } else {
                                    sourceAvif.setAttribute('srcset', `//${backup.cover[i].value.slice(8)}@320w_200h_1c_!web-space-favlist-video.avif`);
                                    sourceWebp.setAttribute('srcset', `//${backup.cover[i].value.slice(8)}@320w_200h_1c_!web-space-favlist-video.webp`);
                                    img.setAttribute('src', `//${backup.cover[i].value.slice(8)}@320w_200h_1c_!web-space-favlist-video.webp`);
                                }

                                img.setAttribute('alt', '这个版本的封面已无法访问');

                                if (i !== backup.cover.length - 1) {
                                    spanC.style.color = 'var(--Ga5, #9499a0)';
                                } else {
                                    spanC.style.color = 'var(--Ga10, #000000)';
                                }

                                i--;

                            } catch (error) {
                                catchUnknownError(error);
                            }
                        });
                        divTCABJX.appendChild(spanC);
                    }

                    if (backup.title?.length > 1) {

                        const spanT = document.createElement('span');
                        spanT.classList.add('backup-spanTCABJX' + classAppendNewFreshSpace);
                        spanT.textContent = 'T';
                        spanT.style.opacity = settings.TCABJXOpacity / 100;
                        spanT.style.marginRight = '3px';
                        spanT.style.color = 'var(--Ga10, #000000)';
                        if (!newFreshSpace) {
                            spanT.style.lineHeight = '16px';
                        }
                        let i = backup.title.length - 2;
                        spanT.addEventListener('click', () => {
                            try {
                                if (i < 0) {
                                    i = backup.title.length - 1;
                                }

                                as[1].textContent = backup.title[i].value;

                                if (newFreshSpace) {
                                    divTitleNewFreshSpace.setAttribute('title', backup.title[i].value);
                                } else {
                                    as[1].setAttribute('title', backup.title[i].value);
                                }

                                if (i !== backup.title.length - 1) {
                                    spanT.style.color = 'var(--Ga5, #9499a0)';
                                } else {
                                    spanT.style.color = 'var(--Ga10, #000000)';
                                }

                                i--;

                            } catch (error) {
                                catchUnknownError(error);
                            }
                        });
                        divTCABJX.appendChild(spanT);
                    }

                    if (controller.signal.aborted) {
                        throw new DOMException('', 'AbortError');
                    }

                    let countCover = 0;
                    let countFirstFrame = 0;
                    let countThumbnails = 0;
                    let countUpperAvatar = 0;
                    countCover = backup.cover?.length ?? 0;
                    backup.pages?.forEach(el => {
                        countFirstFrame += el.firstFrame ? 1 : 0;
                        countThumbnails += el.thumbnails?.length ?? 0;
                    });
                    countUpperAvatar = backup.upperAvatar?.length ?? 0;

                    if (newFreshSpace) {
                        video.setAttribute('backup-counts', `${countCover},${countFirstFrame},${countThumbnails},${countUpperAvatar}`);
                    } else {
                        const ul = video.querySelector('ul.be-dropdown-menu');
                        if (ul) {
                            appendDropdowns(ul, AVBVTitle.BV, { countCover, countFirstFrame, countThumbnails, countUpperAvatar });
                        }
                    }

                } catch (error) {
                    if (error instanceof Error) {
                        if (error.name === 'AbortError') {
                            throw error;
                        }

                        addMessage({ msg: '发生未知错误, 请反馈该问题', border: 'red' });
                        addMessage({ msg: `收藏夹fid: ${fid} 位置: 第${pageNumber}页的第${index + 1}个`, small: true });
                        addMessage({ msg: `BV号: ${AVBVTitle.BV} 标题: ${AVBVTitle.title?.slice(0, 10)}`, small: true });
                        addMessage({ msg: error.stack, small: true })
                        console.error(error);
                        if (as[1]) {
                            as[1].style.color = '#ff0000';
                        }

                    } else {
                        addMessage({ msg: error[0], border: 'red' })
                        for (let i = 1; i < error.length; i++) {
                            addMessage({ msg: error[i], small: true })
                        }
                        addMessage({ msg: `收藏夹fid: ${fid} 位置: 第${pageNumber}页的第${index + 1}个`, small: true });
                        addMessage({ msg: `BV号: ${AVBVTitle.BV} 标题: ${AVBVTitle.title?.slice(0, 10)}`, small: true });
                        if (as[1]) {
                            as[1].style.color = '#ff0000';
                        }
                    }
                }
            }

            if (autoNextPage) {
                if (newFreshSpace) {
                    const pager = Array.from(document.querySelectorAll('button.vui_pagenation--btn-side')).find(el => el.textContent === '下一页');
                    if (pager && !pager.classList.contains('vui_button--disabled')) {
                        await delay(1000 * settings.autoNextPageInterval);
                        if (controller.signal.aborted) {
                            throw new DOMException('', 'AbortError');
                        }
                        if (autoNextPage) {
                            pager.click();
                        }

                    } else if (autoNextFavlist) {
                        if (!currentFavlist.parentNode.getAttribute('id')) {
                            if (document.querySelector('div.fav-sortable-list').childElementCount) {
                                await delay(1000 * settings.autoNextPageInterval);
                                if (controller.signal.aborted) {
                                    throw new DOMException('', 'AbortError');
                                }
                                if (autoNextFavlist) {
                                    document.querySelector('div.fav-sortable-list').firstElementChild.querySelector('div').click();
                                }
                            }

                        } else {
                            const nextFavlist = currentFavlist.parentNode.nextElementSibling;
                            if (nextFavlist) {
                                await delay(1000 * settings.autoNextPageInterval);
                                if (controller.signal.aborted) {
                                    throw new DOMException('', 'AbortError');
                                }
                                if (autoNextFavlist) {
                                    nextFavlist.querySelector('div').click();
                                }
                            }
                        }
                    }

                } else {
                    const pager = document.querySelector('li.be-pager-next');
                    if (pager && !pager.classList.contains('be-pager-disabled')) {
                        await delay(1000 * settings.autoNextPageInterval);
                        if (controller.signal.aborted) {
                            throw new DOMException('', 'AbortError');
                        }
                        if (autoNextPage) {
                            pager.click();
                        }

                    } else if (autoNextFavlist) {
                        if (currentFavlist.nodeName === 'DIV') {
                            if (document.querySelector('ul.fav-list').childElementCount) {
                                await delay(1000 * settings.autoNextPageInterval);
                                if (controller.signal.aborted) {
                                    throw new DOMException('', 'AbortError');
                                }
                                if (autoNextFavlist) {
                                    document.querySelector('ul.fav-list').firstElementChild.querySelector('a').click();
                                }
                            }

                        } else {
                            const nextFavlist = currentFavlist.nextElementSibling;
                            if (nextFavlist) {
                                await delay(1000 * settings.autoNextPageInterval);
                                if (controller.signal.aborted) {
                                    throw new DOMException('', 'AbortError');
                                }
                                if (autoNextFavlist) {
                                    nextFavlist.querySelector('a').click();
                                }
                            }
                        }
                    }
                }
            }

        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    return;
                }
                catchUnknownError(error);

            } else {
                addMessage({ msg: error[0], border: 'red' })
                for (let i = 1; i < error.length; i++) {
                    addMessage({ msg: error[i], small: true })
                }
            }

        } finally {
            activeControllers.delete(controller);
        }
    }

    function initControls() {

        let updates = ['更新内容:'];
        if (settings.version < version) {
            if (settings.version) {
                formatSettings(updates);
            }
            settings.version = version;
            GM_setValue('settings', settings);
        }

        const style = document.createElement('style');
        style.textContent = `
            .backup-div-first {
                padding: 2px;
            }
            .backup-div-first-newFreshSpace {
                padding: 2px 0;
            }
            .backup-div-second {
                padding: 2px 0 2px 16px;
            }
            .backup-div-second-newFreshSpace {
                padding: 2px 0 2px 16px;
            }
            .backup-button, .backup-button-newFreshSpace {
                border: 1px solid var(--Ga3, #cccccc);
                color: var(--Ga10, #000000);
                background-color: var(--Ga1, #f0f0f0);
                line-height: 1;
                cursor: pointer;
            }
            .backup-button {
                border-radius: 2px;
                padding: 2px;
                font-size: 14px;
            }
            .backup-button-newFreshSpace {
                border-radius: 3px;
                padding: 3px;
                font-size: 16px;
            }
            .backup-label, .backup-label-newFreshSpace {
                line-height: 1;
            }
            .backup-inputCheckbox, .backup-inputCheckbox-newFreshSpace {
                margin-left: 0;
            }
            .backup-inputCheckbox {
                margin-right: 1px;
            }
            .backup-inputCheckbox-newFreshSpace {
                margin-right: 3px;
            }
            .backup-inputRadio, .backup-inputRadio-newFreshSpace {
                margin-left: 0;
            }
            .backup-inputRadio {
                margin-right: 1px;
            }
            .backup-inputRadio-newFreshSpace {
                margin-right: 3px;
            }
            .backup-inputText1, .backup-inputText1-newFreshSpace {
                box-sizing: content-box;
                border: 1px solid var(--Ga3, #cccccc);
                color: var(--Ga10, #000000);
                background-color: var(--Ga0, #ffffff);
                padding: 1px 2px;
                line-height: 1;
            }
            .backup-inputText1 {
                width: 28px;
                height: 14px;
                border-radius: 2px;
                font-size: 14px;
            }
            .backup-inputText1-newFreshSpace {
                width: 32px;
                height: 16px;
                border-radius: 3px;
                font-size: 16px;
            }
            .backup-inputText2, .backup-inputText2-newFreshSpace {
                box-sizing: content-box;
                border: 1px solid var(--Ga3, #cccccc);
                color: var(--Ga10, #000000);
                background-color: var(--Ga0, #ffffff);
                padding: 1px 2px;
                line-height: 1;
            }
            .backup-inputText2 {
                width: 56px;
                height: 14px;
                border-radius: 2px;
                font-size: 14px;
            }
            .backup-inputText2-newFreshSpace {
                width: 64px;
                height: 16px;
                border-radius: 3px;
                font-size: 16px;
            }
            .backup-divMessage, .backup-divMessage-newFreshSpace {
                overflow-y: auto;
                background-color: var(--Ga1, #eeeeee);
                line-height: 1.5;
                scrollbar-width: none;
            }
            .backup-divMessage {
                margin: 2px;
            }
            .backup-divMessage-heightFixed {
                height: 270px;
            }
            .backup-divMessage::-webkit-scrollbar {
                display: none;
            }
            .backup-divMessage-newFreshSpace {
                margin: 2px 0;
            }
            .backup-divMessage-heightFixed-newFreshSpace {
                height: 300px;
            }
            .backup-divMessage-newFreshSpace::-webkit-scrollbar {
                display: none;
            }
            .backup-disabled, .backup-disabled-newFreshSpace {
                opacity: 0.5;
                pointer-events: none;
            }
            .backup-hidden, .backup-hidden-newFreshSpace {
                display: none;
            }
            .backup-spanTCABJX, .backup-spanTCABJX-newFreshSpace {
                float: right;
                font-weight: bold;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);

        const divSide = document.querySelector(newFreshSpace ? 'div.favlist-aside' : 'div.fav-sidenav');
        if (!newFreshSpace && divSide.querySelector('a.watch-later')) {
            divSide.querySelector('a.watch-later').style.borderBottom = '1px solid #eeeeee';
        }

        const divControls = document.createElement('div');
        divControls.classList.add('backup-div-first' + classAppendNewFreshSpace);
        divControls.style.color = 'var(--Ga10, #000000)';
        if (!newFreshSpace) {
            divControls.style.borderTop = '1px solid #e4e9f0';
        }
        divSide.appendChild(divControls);

        if (settings.defaultUID && settings.defaultUID !== parseInt(location.href.match(getUIDFromURLRegex)[1], 10)) {
            const divLabelProcessOthersFavlist = document.createElement('div');
            divLabelProcessOthersFavlist.classList.add('backup-div-first' + classAppendNewFreshSpace);
            divLabelProcessOthersFavlist.setAttribute('title',
                '默认: 关闭\n' +
                '默认情况下脚本不会处理其他用户个人空间收藏夹中的视频。\n' +
                '如果您在自己的收藏夹中看到了此选项, 可能是因为您第一次使用脚本时访问的是别人的收藏夹。\n' +
                '这时请先导出本地备份数据, 然后删除脚本内所有已保存的数据: 依次点击: Tampermonkey > 管理面板 >\n' +
                '哔哩哔哩(B站|Bilibili)收藏夹Fix (备份视频信息) > 开发者 > 重置到出厂, 然后访问您自己的收藏夹, 重新导入本地备份数据即可。');
            divControls.appendChild(divLabelProcessOthersFavlist);

            const labelProcessOthersFavlist = document.createElement('label');
            labelProcessOthersFavlist.classList.add('backup-label' + classAppendNewFreshSpace);
            labelProcessOthersFavlist.textContent = '处理他人收藏夹';
            divLabelProcessOthersFavlist.appendChild(labelProcessOthersFavlist);

            const checkboxProcessOthersFavlist = document.createElement('input');
            checkboxProcessOthersFavlist.type = 'checkbox';
            checkboxProcessOthersFavlist.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
            checkboxProcessOthersFavlist.checked = settings.processOthersFavlist;
            checkboxProcessOthersFavlist.addEventListener('change', () => {
                try {
                    settings.processOthersFavlist = checkboxProcessOthersFavlist.checked;
                    if (!settings.processOthersFavlist) {
                        divLabelProcessNormal.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelProcessDisabled.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromApi.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromApiUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromApiUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromApiExtra.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromApiExtraThumbnails.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromApiExtraDelay.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromApiExtraUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromApiExtraUpdatePart.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromApiExtraUpdateAll.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromApiExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromBiliplus.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromBiliplusUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromBiliplusUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromBiliplusURL1.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromBiliplusURL2.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromBiliplusExtra.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromBiliplusExtraUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromBiliplusExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromJijidown.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromJijidownUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromJijidownUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromJijidownExtra.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromJijidownExtraUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromJijidownExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromJijidownURL1.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromJijidownURL2.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromXbeibeix.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromXbeibeixUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromXbeibeixUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromXbeibeixURL1.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromXbeibeixURL2.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromXbeibeixURL3.classList.add('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromXbeibeixExtra.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    } else {
                        divLabelProcessNormal.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        divLabelProcessDisabled.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.processNormal || settings.processDisabled) {
                            divLabelGetFromApi.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            if (settings.getFromApi) {
                                divLabelGetFromApiUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                if (settings.getFromApiUpdate) {
                                    divLabelGetFromApiUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                }
                                divLabelGetFromApiExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                if (settings.getFromApiExtra) {
                                    divLabelGetFromApiExtraThumbnails.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                    divLabelGetFromApiExtraDelay.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                    divLabelGetFromApiExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                    if (settings.getFromApiExtraUpdate) {
                                        divLabelGetFromApiExtraUpdatePart.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                        divLabelGetFromApiExtraUpdateAll.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                        if (settings.getFromApiExtraUpdateAll) {
                                            divLabelGetFromApiExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                        }
                                    }
                                }
                            }
                            divLabelGetFromBiliplus.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            if (settings.getFromBiliplus) {
                                divLabelGetFromBiliplusUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                if (settings.getFromBiliplusUpdate) {
                                    divLabelGetFromBiliplusUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                }
                                divLabelGetFromBiliplusURL1.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                divLabelGetFromBiliplusURL2.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                if (settings.getFromApi && settings.getFromBiliplus) {
                                    divLabelGetFromBiliplusExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                    if (settings.getFromBiliplusExtra) {
                                        divLabelGetFromBiliplusExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                        if (settings.getFromBiliplusExtraUpdate) {
                                            divLabelGetFromBiliplusExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                        }
                                    }
                                }
                            }
                            divLabelGetFromJijidown.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            if (settings.getFromJijidown) {
                                divLabelGetFromJijidownUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                if (settings.getFromJijidownUpdate) {
                                    divLabelGetFromJijidownUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                }
                                divLabelGetFromJijidownExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                if (settings.getFromJijidownExtra) {
                                    divLabelGetFromJijidownExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                    if (settings.getFromJijidownExtraUpdate) {
                                        divLabelGetFromJijidownExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                    }
                                }
                                divLabelGetFromJijidownURL1.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                divLabelGetFromJijidownURL2.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            }
                            divLabelGetFromXbeibeix.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            if (settings.getFromXbeibeix) {
                                divLabelGetFromXbeibeixUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                if (settings.getFromXbeibeixUpdate) {
                                    divLabelGetFromXbeibeixUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                }
                                divLabelGetFromXbeibeixURL1.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                divLabelGetFromXbeibeixURL2.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                divLabelGetFromXbeibeixURL3.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                divLabelGetFromXbeibeixExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            }
                        }
                    }
                    GM_setValue('settings', settings);
                } catch (error) {
                    catchUnknownError(error);
                }
            });
            labelProcessOthersFavlist.insertAdjacentElement('afterbegin', checkboxProcessOthersFavlist);
        }

        const divLabelProcessNormal = document.createElement('div');
        divLabelProcessNormal.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-disabled' + classAppendNewFreshSpace);
        divLabelProcessNormal.setAttribute('title',
            '默认: 开启\n' +
            '由于新视频的BV号随机生成, 各个第三方网站无法自动地爬取新视频的信息。\n' +
            '开启该选项的同时开启下面的从第三方网站获取数据, 脚本将代替您访问相应的第三方网站。\n' +
            '如果处理的视频第三方网站还没有备份, 这将使其备份该视频当前版本的信息。\n' +
            '如果处理的视频之前有人备份过了, 这将获取到该视频的信息备份到第三方网站时的版本。');
        divControls.appendChild(divLabelProcessNormal);

        const labelProcessNormal = document.createElement('label');
        labelProcessNormal.classList.add('backup-label' + classAppendNewFreshSpace);
        labelProcessNormal.textContent = '处理正常视频';
        divLabelProcessNormal.appendChild(labelProcessNormal);

        const checkboxProcessNormal = document.createElement('input');
        checkboxProcessNormal.type = 'checkbox';
        checkboxProcessNormal.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxProcessNormal.checked = settings.processNormal;
        checkboxProcessNormal.addEventListener('change', () => {
            try {
                settings.processNormal = checkboxProcessNormal.checked;
                if (!settings.processNormal && !settings.processDisabled) {
                    divLabelGetFromApi.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtra.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraThumbnails.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraDelay.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdatePart.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdateAll.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplus.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusURL1.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusURL2.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusExtra.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusExtraUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidown.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownExtra.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownExtraUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownURL1.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownURL2.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeix.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixURL1.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixURL2.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixURL3.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixExtra.classList.add('backup-disabled' + classAppendNewFreshSpace);
                } else {
                    divLabelGetFromApi.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromApi) {
                        divLabelGetFromApiUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromApiUpdate) {
                            divLabelGetFromApiUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        }
                        divLabelGetFromApiExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromApiExtra) {
                            divLabelGetFromApiExtraThumbnails.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            divLabelGetFromApiExtraDelay.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            divLabelGetFromApiExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            if (settings.getFromApiExtraUpdate) {
                                divLabelGetFromApiExtraUpdatePart.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                divLabelGetFromApiExtraUpdateAll.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                if (settings.getFromApiExtraUpdateAll) {
                                    divLabelGetFromApiExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                }
                            }
                        }
                    }
                    divLabelGetFromBiliplus.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromBiliplus) {
                        divLabelGetFromBiliplusUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromBiliplusUpdate) {
                            divLabelGetFromBiliplusUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        }
                        divLabelGetFromBiliplusURL1.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromBiliplusURL2.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromApi && settings.getFromBiliplus) {
                            divLabelGetFromBiliplusExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            if (settings.getFromBiliplusExtra) {
                                divLabelGetFromBiliplusExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                if (settings.getFromBiliplusExtraUpdate) {
                                    divLabelGetFromBiliplusExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                }
                            }
                        }
                    }
                    divLabelGetFromJijidown.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromJijidown) {
                        divLabelGetFromJijidownUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromJijidownUpdate) {
                            divLabelGetFromJijidownUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        }
                        divLabelGetFromJijidownExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromJijidownExtra) {
                            divLabelGetFromJijidownExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            if (settings.getFromJijidownExtraUpdate) {
                                divLabelGetFromJijidownExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            }
                        }
                        divLabelGetFromJijidownURL1.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromJijidownURL2.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    }
                    divLabelGetFromXbeibeix.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromXbeibeix) {
                        divLabelGetFromXbeibeixUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromXbeibeixUpdate) {
                            divLabelGetFromXbeibeixUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        }
                        divLabelGetFromXbeibeixURL1.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromXbeibeixURL2.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromXbeibeixURL3.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromXbeibeixExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    }
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelProcessNormal.insertAdjacentElement('afterbegin', checkboxProcessNormal);

        const divLabelProcessDisabled = document.createElement('div');
        divLabelProcessDisabled.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-disabled' + classAppendNewFreshSpace);
        divLabelProcessDisabled.setAttribute('title',
            '默认: 开启\n' +
            '开启该选项的同时开启下面的从第三方网站获取数据, 脚本将尝试从相应的第三方网站获取失效视频的信息。');
        divControls.appendChild(divLabelProcessDisabled);

        const labelProcessDisabled = document.createElement('label');
        labelProcessDisabled.classList.add('backup-label' + classAppendNewFreshSpace);
        labelProcessDisabled.textContent = '处理失效视频';
        divLabelProcessDisabled.appendChild(labelProcessDisabled);

        const checkboxProcessDisabled = document.createElement('input');
        checkboxProcessDisabled.type = 'checkbox';
        checkboxProcessDisabled.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxProcessDisabled.checked = settings.processDisabled;
        checkboxProcessDisabled.addEventListener('change', () => {
            try {
                settings.processDisabled = checkboxProcessDisabled.checked;
                if (!settings.processNormal && !settings.processDisabled) {
                    divLabelGetFromApi.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtra.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraThumbnails.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraDelay.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdatePart.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdateAll.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplus.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusURL1.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusURL2.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusExtra.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusExtraUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidown.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownExtra.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownExtraUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownURL1.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownURL2.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeix.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixURL1.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixURL2.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixURL3.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixExtra.classList.add('backup-disabled' + classAppendNewFreshSpace);
                } else {
                    divLabelGetFromApi.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromApi) {
                        divLabelGetFromApiUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromApiUpdate) {
                            divLabelGetFromApiUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        }
                        divLabelGetFromApiExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromApiExtra) {
                            divLabelGetFromApiExtraThumbnails.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            divLabelGetFromApiExtraDelay.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            divLabelGetFromApiExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            if (settings.getFromApiExtraUpdate) {
                                divLabelGetFromApiExtraUpdatePart.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                divLabelGetFromApiExtraUpdateAll.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                if (settings.getFromApiExtraUpdateAll) {
                                    divLabelGetFromApiExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                }
                            }
                        }
                    }
                    divLabelGetFromBiliplus.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromBiliplus) {
                        divLabelGetFromBiliplusUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromBiliplusUpdate) {
                            divLabelGetFromBiliplusUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        }
                        divLabelGetFromBiliplusURL1.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromBiliplusURL2.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromApi && settings.getFromBiliplus) {
                            divLabelGetFromBiliplusExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            if (settings.getFromBiliplusExtra) {
                                divLabelGetFromBiliplusExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                if (settings.getFromBiliplusExtraUpdate) {
                                    divLabelGetFromBiliplusExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                                }
                            }
                        }
                    }
                    divLabelGetFromJijidown.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromJijidown) {
                        divLabelGetFromJijidownUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromJijidownUpdate) {
                            divLabelGetFromJijidownUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        }
                        divLabelGetFromJijidownExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromJijidownExtra) {
                            divLabelGetFromJijidownExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            if (settings.getFromJijidownExtraUpdate) {
                                divLabelGetFromJijidownExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            }
                        }
                        divLabelGetFromJijidownURL1.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromJijidownURL2.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    }
                    divLabelGetFromXbeibeix.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromXbeibeix) {
                        divLabelGetFromXbeibeixUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromXbeibeixUpdate) {
                            divLabelGetFromXbeibeixUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        }
                        divLabelGetFromXbeibeixURL1.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromXbeibeixURL2.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromXbeibeixURL3.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromXbeibeixExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    }
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelProcessDisabled.insertAdjacentElement('afterbegin', checkboxProcessDisabled);

        const divLabelGetFromApi = document.createElement('div');
        divLabelGetFromApi.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromApi.setAttribute('title',
            '默认: 开启\n' +
            '地址: https://api.bilibili.com/x/v3/fav/resource/list?media_id={收藏夹fid}&pn={页码}&ps={每页展示视频数量}\n' +
            '数据: AV号, 标题 (失效视频无法获取), 简介 (仅能获取前255个字符), 封面地址 (失效视频无法获取), UP主UID, UP主昵称, UP主头像地址, 上传时间, 发布时间, 添加到当前收藏夹的时间, 第1个分集的cid (均为最新版本)\n' +
            '上述接口一次请求即可获取当前页所有视频的数据。\n' +
            '地址: https://api.bilibili.com/x/web-interface/archive/desc?bvid={BV号}\n' +
            '数据: 完整简介 (最新版本, 非必要不会调用该接口)');
        divControls.appendChild(divLabelGetFromApi);

        const labelGetFromApi = document.createElement('label');
        labelGetFromApi.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromApi.textContent = '从B站接口获取数据';
        divLabelGetFromApi.appendChild(labelGetFromApi);

        const checkboxGetFromApi = document.createElement('input');
        checkboxGetFromApi.type = 'checkbox';
        checkboxGetFromApi.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxGetFromApi.checked = settings.getFromApi;
        checkboxGetFromApi.addEventListener('change', () => {
            try {
                settings.getFromApi = checkboxGetFromApi.checked;
                if (!settings.getFromApi) {
                    settings.getFromApiExtra = false;
                    checkboxGetFromApiExtra.checked = false;
                    settings.getFromApiExtraThumbnails = false;
                    checkboxGetFromApiExtraThumbnails.checked = false;
                    settings.getFromBiliplusExtra = false;
                    checkboxGetFromBiliplusExtra.checked = false;
                    divLabelGetFromApiUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtra.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraThumbnails.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraDelay.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdatePart.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdateAll.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusExtra.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusExtraUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                } else {
                    divLabelGetFromApiUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromApiUpdate) {
                        divLabelGetFromApiUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    }
                    divLabelGetFromApiExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromApiExtra) {
                        divLabelGetFromApiExtraThumbnails.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromApiExtraDelay.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromApiExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromApiExtraUpdate) {
                            divLabelGetFromApiExtraUpdatePart.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            divLabelGetFromApiExtraUpdateAll.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            if (settings.getFromApiExtraUpdateAll) {
                                divLabelGetFromApiExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            }
                        }
                    }
                    if (settings.getFromApi && settings.getFromBiliplus) {
                        divLabelGetFromBiliplusExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromBiliplusExtra) {
                            divLabelGetFromBiliplusExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            if (settings.getFromBiliplusExtraUpdate) {
                                divLabelGetFromBiliplusExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            }
                        }
                    }
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromApi.insertAdjacentElement('afterbegin', checkboxGetFromApi);

        const divLabelGetFromApiUpdate = document.createElement('div');
        divLabelGetFromApiUpdate.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromApiUpdate.setAttribute('title',
            '默认: 开启\n' +
            '关闭后每个视频从B站接口只会获取一次数据。\n' +
            '不建议关闭, 因为某些视频的信息可能会经常更新。');
        divControls.appendChild(divLabelGetFromApiUpdate);

        const labelGetFromApiUpdate = document.createElement('label');
        labelGetFromApiUpdate.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromApiUpdate.textContent = '启用更新';
        divLabelGetFromApiUpdate.appendChild(labelGetFromApiUpdate);

        const checkboxGetFromApiUpdate = document.createElement('input');
        checkboxGetFromApiUpdate.type = 'checkbox';
        checkboxGetFromApiUpdate.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxGetFromApiUpdate.checked = settings.getFromApiUpdate;
        checkboxGetFromApiUpdate.addEventListener('change', () => {
            try {
                settings.getFromApiUpdate = checkboxGetFromApiUpdate.checked;
                if (!settings.getFromApiUpdate) {
                    divLabelGetFromApiUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                } else {
                    divLabelGetFromApiUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromApiUpdate.insertAdjacentElement('afterbegin', checkboxGetFromApiUpdate);

        const divLabelGetFromApiUpdateInterval = document.createElement('div');
        divLabelGetFromApiUpdateInterval.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromApiUpdateInterval.setAttribute('title',
            '默认: 5小时\n' +
            '脚本处理某个视频时, 如果发现距离上次从B站接口获取到该视频的数据已经超过了设定的时间间隔, 则会再次从B站接口获取该视频的数据。');
        divControls.appendChild(divLabelGetFromApiUpdateInterval);

        const labelGetFromApiUpdateInterval = document.createElement('label');
        labelGetFromApiUpdateInterval.classList.add('backup-label' + classAppendNewFreshSpace);
        divLabelGetFromApiUpdateInterval.appendChild(labelGetFromApiUpdateInterval);

        const inputTextGetFromApiUpdateInterval = document.createElement('input');
        inputTextGetFromApiUpdateInterval.type = 'text';
        inputTextGetFromApiUpdateInterval.classList.add('backup-inputText1' + classAppendNewFreshSpace);
        inputTextGetFromApiUpdateInterval.value = settings.getFromApiUpdateInterval;
        inputTextGetFromApiUpdateInterval.setAttribute('backup-def', 5);
        inputTextGetFromApiUpdateInterval.setAttribute('backup-min', 0);
        inputTextGetFromApiUpdateInterval.setAttribute('backup-max', 100);
        inputTextGetFromApiUpdateInterval.setAttribute('backup-setting', 'getFromApiUpdateInterval');
        inputTextGetFromApiUpdateInterval.addEventListener('blur', validateInputText);

        labelGetFromApiUpdateInterval.appendChild(document.createTextNode('最小更新间隔'));
        labelGetFromApiUpdateInterval.appendChild(inputTextGetFromApiUpdateInterval);
        labelGetFromApiUpdateInterval.appendChild(document.createTextNode('小时'));

        const divLabelGetFromApiExtra = document.createElement('div');
        divLabelGetFromApiExtra.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        if (debug) divLabelGetFromApiExtra.classList.remove('backup-advanced');
        divLabelGetFromApiExtra.setAttribute('title',
            '默认: 关闭\n' +
            '地址: https://api.bilibili.com/x/web-interface/view?bvid={BV号}\n' +
            '数据: 完整简介, 视频发布动态内容, 每个分集的标题, 首帧截图地址 (远古视频无法获取), cid (均为最新版本, 失效视频均无法获取)');
        divControls.appendChild(divLabelGetFromApiExtra);

        const labelGetFromApiExtra = document.createElement('label');
        labelGetFromApiExtra.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromApiExtra.textContent = '从B站接口获取额外数据';
        divLabelGetFromApiExtra.appendChild(labelGetFromApiExtra);

        const checkboxGetFromApiExtra = document.createElement('input');
        checkboxGetFromApiExtra.type = 'checkbox';
        checkboxGetFromApiExtra.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxGetFromApiExtra.checked = settings.getFromApiExtra;
        checkboxGetFromApiExtra.addEventListener('change', () => {
            try {
                settings.getFromApiExtra = checkboxGetFromApiExtra.checked;
                if (!settings.getFromApiExtra) {
                    settings.getFromApiExtraThumbnails = false;
                    checkboxGetFromApiExtraThumbnails.checked = false;
                    divLabelGetFromApiExtraThumbnails.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraDelay.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdatePart.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdateAll.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                } else {
                    divLabelGetFromApiExtraThumbnails.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraDelay.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromApiExtraUpdate) {
                        divLabelGetFromApiExtraUpdatePart.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromApiExtraUpdateAll.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromApiExtraUpdateAll) {
                            divLabelGetFromApiExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        }
                    }
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromApiExtra.insertAdjacentElement('afterbegin', checkboxGetFromApiExtra);

        const divLabelGetFromApiExtraThumbnails = document.createElement('div');
        divLabelGetFromApiExtraThumbnails.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        if (debug) divLabelGetFromApiExtraThumbnails.classList.remove('backup-advanced');
        divLabelGetFromApiExtraThumbnails.setAttribute('title',
            '默认: 关闭\n' +
            '地址: https://api.bilibili.com/x/player/videoshot?aid={AV号}&cid={分集cid}\n' +
            '数据: 进度条缩略图地址 (失效视频以及部分远古视频无法获取)\n' +
            '如果UP主对某个视频进行了换源, 只要该视频的本地备份数据中保存了旧源的cid, 就可以尝试获取旧源的进度条缩略图地址。\n' +
            '一次请求只能获取一个分集的进度条缩略图地址, 如果某个视频的分集较多, 则需要等待一段时间。');
        divControls.appendChild(divLabelGetFromApiExtraThumbnails);

        const labelGetFromApiExtraThumbnails = document.createElement('label');
        labelGetFromApiExtraThumbnails.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromApiExtraThumbnails.textContent = '获取进度条缩略图地址';
        divLabelGetFromApiExtraThumbnails.appendChild(labelGetFromApiExtraThumbnails);

        const checkboxGetFromApiExtraThumbnails = document.createElement('input');
        checkboxGetFromApiExtraThumbnails.type = 'checkbox';
        checkboxGetFromApiExtraThumbnails.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxGetFromApiExtraThumbnails.checked = settings.getFromApiExtraThumbnails;
        checkboxGetFromApiExtraThumbnails.addEventListener('change', () => {
            try {
                settings.getFromApiExtraThumbnails = checkboxGetFromApiExtraThumbnails.checked;
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromApiExtraThumbnails.insertAdjacentElement('afterbegin', checkboxGetFromApiExtraThumbnails);

        const divLabelGetFromApiExtraDelay = document.createElement('div');
        divLabelGetFromApiExtraDelay.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        if (debug) divControls.appendChild(divLabelGetFromApiExtraDelay);

        const labelGetFromApiExtraDelay = document.createElement('label');
        labelGetFromApiExtraDelay.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromApiExtraDelay.textContent = '停留500毫秒';
        if (debug) divLabelGetFromApiExtraDelay.appendChild(labelGetFromApiExtraDelay);

        const checkboxGetFromApiExtraDelay = document.createElement('input');
        checkboxGetFromApiExtraDelay.type = 'checkbox';
        checkboxGetFromApiExtraDelay.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxGetFromApiExtraDelay.checked = getFromApiExtraDelay;
        checkboxGetFromApiExtraDelay.addEventListener('change', () => {
            try {
                getFromApiExtraDelay = checkboxGetFromApiExtraDelay.checked;
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        if (debug) labelGetFromApiExtraDelay.insertAdjacentElement('afterbegin', checkboxGetFromApiExtraDelay);

        const divLabelGetFromApiExtraUpdate = document.createElement('div');
        divLabelGetFromApiExtraUpdate.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromApiExtraUpdate.setAttribute('title',
            '默认: 开启');
        divControls.appendChild(divLabelGetFromApiExtraUpdate);

        const labelGetFromApiExtraUpdate = document.createElement('label');
        labelGetFromApiExtraUpdate.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromApiExtraUpdate.textContent = '启用更新';
        divLabelGetFromApiExtraUpdate.appendChild(labelGetFromApiExtraUpdate);

        const checkboxGetFromApiExtraUpdate = document.createElement('input');
        checkboxGetFromApiExtraUpdate.type = 'checkbox';
        checkboxGetFromApiExtraUpdate.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxGetFromApiExtraUpdate.checked = settings.getFromApiExtraUpdate;
        checkboxGetFromApiExtraUpdate.addEventListener('change', () => {
            try {
                settings.getFromApiExtraUpdate = checkboxGetFromApiExtraUpdate.checked;
                if (!settings.getFromApiExtraUpdate) {
                    divLabelGetFromApiExtraUpdatePart.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdateAll.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                } else {
                    divLabelGetFromApiExtraUpdatePart.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromApiExtraUpdateAll.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromApiExtraUpdateAll) {
                        divLabelGetFromApiExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    }
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromApiExtraUpdate.insertAdjacentElement('afterbegin', checkboxGetFromApiExtraUpdate);

        const divLabelGetFromApiExtraUpdatePart = document.createElement('div');
        divLabelGetFromApiExtraUpdatePart.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromApiExtraUpdatePart.setAttribute('title',
            '默认: 只更新可能换源的视频\n' +
            '只更新可能换源的视频: 脚本处理某个视频时, 从接口 "api.bilibili.com/x/v3/fav/resource/list" 中可以获取到该视频的分集数量以及第1个分集的cid, 如果发现该视频可能进行了换源 (获取的第1个分集的cid在本地备份数据中找不到, 或者获取的分集数量大于1), 才会再次从接口 "api.bilibili.com/x/web-interface/view" 获取该视频的数据。\n' +
            '总是更新所有视频: 脚本处理某个视频时, 如果发现距离上次从接口 "api.bilibili.com/x/web-interface/view" 获取到该视频的数据已经超过了设定的时间间隔, 则会再次从该接口获取该视频的数据。一次请求只能获取一个视频的数据, 频繁调用该接口不仅耗费时间, 如果该接口设置了调用频率限制还可能出现问题。');
        divControls.appendChild(divLabelGetFromApiExtraUpdatePart);

        const labelGetFromApiExtraUpdatePart = document.createElement('label');
        labelGetFromApiExtraUpdatePart.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromApiExtraUpdatePart.textContent = '只更新可能换源的视频';
        divLabelGetFromApiExtraUpdatePart.appendChild(labelGetFromApiExtraUpdatePart);

        const radioGetFromApiExtraUpdatePart = document.createElement('input');
        radioGetFromApiExtraUpdatePart.type = 'radio';
        radioGetFromApiExtraUpdatePart.classList.add('backup-inputRadio' + classAppendNewFreshSpace);
        radioGetFromApiExtraUpdatePart.name = 'getFromApiExtraUpdateAll';
        radioGetFromApiExtraUpdatePart.value = false;
        radioGetFromApiExtraUpdatePart.checked = !settings.getFromApiExtraUpdateAll;
        radioGetFromApiExtraUpdatePart.addEventListener('change', () => {
            try {
                settings.getFromApiExtraUpdateAll = false;
                divLabelGetFromApiExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromApiExtraUpdatePart.insertAdjacentElement('afterbegin', radioGetFromApiExtraUpdatePart);

        const divLabelGetFromApiExtraUpdateAll = document.createElement('div');
        divLabelGetFromApiExtraUpdateAll.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromApiExtraUpdateAll.setAttribute('title',
            '默认: 只更新可能换源的视频\n' +
            '只更新可能换源的视频: 脚本处理某个视频时, 从接口 "api.bilibili.com/x/v3/fav/resource/list" 中可以获取到该视频的分集数量以及第1个分集的cid, 如果发现该视频可能进行了换源 (获取的第1个分集的cid在本地备份数据中找不到, 或者获取的分集数量大于1), 才会再次从接口 "api.bilibili.com/x/web-interface/view" 获取该视频的数据。\n' +
            '总是更新所有视频: 脚本处理某个视频时, 如果发现距离上次从接口 "api.bilibili.com/x/web-interface/view" 获取到该视频的数据已经超过了设定的时间间隔, 则会再次从该接口获取该视频的数据。一次请求只能获取一个视频的数据, 频繁调用该接口不仅耗费时间, 如果该接口设置了调用频率限制还可能出现问题。');
        divControls.appendChild(divLabelGetFromApiExtraUpdateAll);

        const labelGetFromApiExtraUpdateAll = document.createElement('label');
        labelGetFromApiExtraUpdateAll.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromApiExtraUpdateAll.textContent = '总是更新所有视频';
        divLabelGetFromApiExtraUpdateAll.appendChild(labelGetFromApiExtraUpdateAll);

        const radioGetFromApiExtraUpdateAll = document.createElement('input');
        radioGetFromApiExtraUpdateAll.type = 'radio';
        radioGetFromApiExtraUpdateAll.classList.add('backup-inputRadio' + classAppendNewFreshSpace);
        radioGetFromApiExtraUpdateAll.name = 'getFromApiExtraUpdateAll';
        radioGetFromApiExtraUpdateAll.value = true;
        radioGetFromApiExtraUpdateAll.checked = settings.getFromApiExtraUpdateAll;
        radioGetFromApiExtraUpdateAll.addEventListener('change', () => {
            try {
                settings.getFromApiExtraUpdateAll = true;
                divLabelGetFromApiExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromApiExtraUpdateAll.insertAdjacentElement('afterbegin', radioGetFromApiExtraUpdateAll);

        const divLabelGetFromApiExtraUpdateInterval = document.createElement('div');
        divLabelGetFromApiExtraUpdateInterval.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromApiExtraUpdateInterval.setAttribute('title',
            '默认: 5天');
        divControls.appendChild(divLabelGetFromApiExtraUpdateInterval);

        const labelGetFromApiExtraUpdateInterval = document.createElement('label');
        labelGetFromApiExtraUpdateInterval.classList.add('backup-label' + classAppendNewFreshSpace);
        divLabelGetFromApiExtraUpdateInterval.appendChild(labelGetFromApiExtraUpdateInterval);

        const inputTextGetFromApiExtraUpdateInterval = document.createElement('input');
        inputTextGetFromApiExtraUpdateInterval.type = 'text';
        inputTextGetFromApiExtraUpdateInterval.classList.add('backup-inputText1' + classAppendNewFreshSpace);
        inputTextGetFromApiExtraUpdateInterval.value = settings.getFromApiExtraUpdateInterval;
        inputTextGetFromApiExtraUpdateInterval.setAttribute('backup-def', 5);
        inputTextGetFromApiExtraUpdateInterval.setAttribute('backup-min', 0);
        inputTextGetFromApiExtraUpdateInterval.setAttribute('backup-max', 100);
        inputTextGetFromApiExtraUpdateInterval.setAttribute('backup-setting', 'getFromApiExtraUpdateInterval');
        inputTextGetFromApiExtraUpdateInterval.addEventListener('blur', validateInputText);

        labelGetFromApiExtraUpdateInterval.appendChild(document.createTextNode('最小更新间隔'));
        labelGetFromApiExtraUpdateInterval.appendChild(inputTextGetFromApiExtraUpdateInterval);
        labelGetFromApiExtraUpdateInterval.appendChild(document.createTextNode('天'));

        const divLabelGetFromBiliplus = document.createElement('div');
        divLabelGetFromBiliplus.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromBiliplus.setAttribute('title',
            '默认: 关闭\n' +
            '从BiliPlus获取数据时可能会出现问题。\n' +
            '地址: https://www.biliplus.com/video/{BV号}\n' +
            '或 https://www.biliplus.com/api/view?id={BV号} (在高级选项中进行设置)\n' +
            '数据: 标题, 简介, 封面地址, UP主昵称, 每个分集的标题, cid (均为备份时的版本)');
        divControls.appendChild(divLabelGetFromBiliplus);

        const labelGetFromBiliplus = document.createElement('label');
        labelGetFromBiliplus.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromBiliplus.textContent = '从BiliPlus获取数据';
        divLabelGetFromBiliplus.appendChild(labelGetFromBiliplus);

        checkboxGetFromBiliplus = document.createElement('input');
        checkboxGetFromBiliplus.type = 'checkbox';
        checkboxGetFromBiliplus.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxGetFromBiliplus.checked = settings.getFromBiliplus;
        checkboxGetFromBiliplus.addEventListener('change', () => {
            try {
                settings.getFromBiliplus = checkboxGetFromBiliplus.checked;
                if (!settings.getFromBiliplus) {
                    settings.getFromBiliplusExtra = false;
                    checkboxGetFromBiliplusExtra.checked = false;
                    divLabelGetFromBiliplusUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusURL1.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusURL2.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusExtra.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusExtraUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                } else {
                    divLabelGetFromBiliplusUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromBiliplusUpdate) {
                        divLabelGetFromBiliplusUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    }
                    divLabelGetFromBiliplusURL1.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusURL2.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromApi && settings.getFromBiliplus) {
                        divLabelGetFromBiliplusExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromBiliplusExtra) {
                            divLabelGetFromBiliplusExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            if (settings.getFromBiliplusExtraUpdate) {
                                divLabelGetFromBiliplusExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            }
                        }
                    }
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromBiliplus.insertAdjacentElement('afterbegin', checkboxGetFromBiliplus);

        const divLabelGetFromBiliplusUpdate = document.createElement('div');
        divLabelGetFromBiliplusUpdate.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromBiliplusUpdate.setAttribute('title',
            '默认: 关闭');
        divControls.appendChild(divLabelGetFromBiliplusUpdate);

        const labelGetFromBiliplusUpdate = document.createElement('label');
        labelGetFromBiliplusUpdate.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromBiliplusUpdate.textContent = '启用更新';
        divLabelGetFromBiliplusUpdate.appendChild(labelGetFromBiliplusUpdate);

        const checkboxGetFromBiliplusUpdate = document.createElement('input');
        checkboxGetFromBiliplusUpdate.type = 'checkbox';
        checkboxGetFromBiliplusUpdate.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxGetFromBiliplusUpdate.checked = settings.getFromBiliplusUpdate;
        checkboxGetFromBiliplusUpdate.addEventListener('change', () => {
            try {
                settings.getFromBiliplusUpdate = checkboxGetFromBiliplusUpdate.checked;
                if (!settings.getFromBiliplusUpdate) {
                    divLabelGetFromBiliplusUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                } else {
                    divLabelGetFromBiliplusUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromBiliplusUpdate.insertAdjacentElement('afterbegin', checkboxGetFromBiliplusUpdate);

        const divLabelGetFromBiliplusUpdateInterval = document.createElement('div');
        divLabelGetFromBiliplusUpdateInterval.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromBiliplusUpdateInterval.setAttribute('title',
            '默认: 10星期');
        divControls.appendChild(divLabelGetFromBiliplusUpdateInterval);

        const labelGetFromBiliplusUpdateInterval = document.createElement('label');
        labelGetFromBiliplusUpdateInterval.classList.add('backup-label' + classAppendNewFreshSpace);
        divLabelGetFromBiliplusUpdateInterval.appendChild(labelGetFromBiliplusUpdateInterval);

        const inputTextGetFromBiliplusUpdateInterval = document.createElement('input');
        inputTextGetFromBiliplusUpdateInterval.type = 'text';
        inputTextGetFromBiliplusUpdateInterval.classList.add('backup-inputText1' + classAppendNewFreshSpace);
        inputTextGetFromBiliplusUpdateInterval.value = settings.getFromBiliplusUpdateInterval;
        inputTextGetFromBiliplusUpdateInterval.setAttribute('backup-def', 10);
        inputTextGetFromBiliplusUpdateInterval.setAttribute('backup-min', 0);
        inputTextGetFromBiliplusUpdateInterval.setAttribute('backup-max', 100);
        inputTextGetFromBiliplusUpdateInterval.setAttribute('backup-setting', 'getFromBiliplusUpdateInterval');
        inputTextGetFromBiliplusUpdateInterval.addEventListener('blur', validateInputText);

        labelGetFromBiliplusUpdateInterval.appendChild(document.createTextNode('最小更新间隔'));
        labelGetFromBiliplusUpdateInterval.appendChild(inputTextGetFromBiliplusUpdateInterval);
        labelGetFromBiliplusUpdateInterval.appendChild(document.createTextNode('星期'));

        const divLabelGetFromBiliplusURL1 = document.createElement('div');
        divLabelGetFromBiliplusURL1.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromBiliplusURL1.setAttribute('title',
            '默认: www.biliplus.com/video\n' +
            'www.biliplus.com/video: 没有调用频率限制, 但是可能需要进行人机验证, 手动访问一次BiliPlus的原始页面可能有帮助。\n' +
            'www.biliplus.com/api/view: 无需进行人机验证, 但是有调用频率限制, 短时间内频繁获取数据之后将会暂时限制在每分钟5次左右。');
        divControls.appendChild(divLabelGetFromBiliplusURL1);

        const labelGetFromBiliplusURL1 = document.createElement('label');
        labelGetFromBiliplusURL1.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromBiliplusURL1.textContent = 'www.biliplus.com/video';
        divLabelGetFromBiliplusURL1.appendChild(labelGetFromBiliplusURL1);

        const radioGetFromBiliplusURL1 = document.createElement('input');
        radioGetFromBiliplusURL1.type = 'radio';
        radioGetFromBiliplusURL1.classList.add('backup-inputRadio' + classAppendNewFreshSpace);
        radioGetFromBiliplusURL1.name = 'getFromBiliplusURL';
        radioGetFromBiliplusURL1.value = 'www.biliplus.com/video';
        radioGetFromBiliplusURL1.checked = settings.getFromBiliplusURL === 'www.biliplus.com/video';
        radioGetFromBiliplusURL1.addEventListener('change', () => {
            try {
                settings.getFromBiliplusURL = 'www.biliplus.com/video';
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromBiliplusURL1.insertAdjacentElement('afterbegin', radioGetFromBiliplusURL1);

        const divLabelGetFromBiliplusURL2 = document.createElement('div');
        divLabelGetFromBiliplusURL2.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromBiliplusURL2.setAttribute('title',
            '默认: www.biliplus.com/video\n' +
            'www.biliplus.com/video: 没有调用频率限制, 但是可能需要进行人机验证, 手动访问一次BiliPlus的原始页面可能有帮助。\n' +
            'www.biliplus.com/api/view: 无需进行人机验证, 但是有调用频率限制, 短时间内频繁获取数据之后将会暂时限制在每分钟5次左右。');
        divControls.appendChild(divLabelGetFromBiliplusURL2);

        const labelGetFromBiliplusURL2 = document.createElement('label');
        labelGetFromBiliplusURL2.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromBiliplusURL2.textContent = 'www.biliplus.com/api/view';
        divLabelGetFromBiliplusURL2.appendChild(labelGetFromBiliplusURL2);

        const radioGetFromBiliplusURL2 = document.createElement('input');
        radioGetFromBiliplusURL2.type = 'radio';
        radioGetFromBiliplusURL2.classList.add('backup-inputRadio' + classAppendNewFreshSpace);
        radioGetFromBiliplusURL2.name = 'getFromBiliplusURL';
        radioGetFromBiliplusURL2.value = 'www.biliplus.com/api/view';
        radioGetFromBiliplusURL2.checked = settings.getFromBiliplusURL === 'www.biliplus.com/api/view';
        radioGetFromBiliplusURL2.addEventListener('change', () => {
            try {
                settings.getFromBiliplusURL = 'www.biliplus.com/api/view';
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromBiliplusURL2.insertAdjacentElement('afterbegin', radioGetFromBiliplusURL2);

        const divLabelGetFromBiliplusExtra = document.createElement('div');
        divLabelGetFromBiliplusExtra.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        if (debug) divLabelGetFromBiliplusExtra.classList.remove('backup-advanced');
        divLabelGetFromBiliplusExtra.setAttribute('title',
            '默认: 关闭\n' +
            '从BiliPlus获取额外数据时可能会出现问题。\n' +
            '地址: https://www.biliplus.com/all/video/av{AV号}/\n' +
            '数据: 调用下面的接口所需的验证参数\n' +
            '地址: https://www.biliplus.com/api/view_all?av={AV号}&ts={验证参数1}&sign={验证参数2}\n' +
            '数据: 标题, 封面地址, UP主昵称 (第一次备份到BiliPlus时的版本); 每个分集的标题, cid (所有曾经备份到BiliPlus的版本)\n' +
            'BiliPlus原始页面的底部有一个刷新数据的功能, 该功能会让BiliPlus再次从B站接口获取某个视频的最新信息并保存在其数据库中。\n' +
            'BiliPlus原始页面显示的信息为最后一次备份到BiliPlus时的版本, 而此接口可以获取到之前备份到BiliPlus时的版本。\n' +
            '此接口有调用频率限制, 短时间内频繁获取数据之后将会暂时限制在每分钟5次左右。\n' +
            '此接口可能需要进行人机验证, 手动访问一次BiliPlus的原始页面可能有帮助。');
        divControls.appendChild(divLabelGetFromBiliplusExtra);

        const labelGetFromBiliplusExtra = document.createElement('label');
        labelGetFromBiliplusExtra.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromBiliplusExtra.textContent = '从BiliPlus获取额外数据';
        divLabelGetFromBiliplusExtra.appendChild(labelGetFromBiliplusExtra);

        checkboxGetFromBiliplusExtra = document.createElement('input');
        checkboxGetFromBiliplusExtra.type = 'checkbox';
        checkboxGetFromBiliplusExtra.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxGetFromBiliplusExtra.checked = settings.getFromBiliplusExtra;
        checkboxGetFromBiliplusExtra.addEventListener('change', () => {
            try {
                settings.getFromBiliplusExtra = checkboxGetFromBiliplusExtra.checked;
                if (!settings.getFromBiliplusExtra) {
                    divLabelGetFromBiliplusExtraUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                } else {
                    divLabelGetFromBiliplusExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromBiliplusExtraUpdate) {
                        divLabelGetFromBiliplusExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    }
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromBiliplusExtra.insertAdjacentElement('afterbegin', checkboxGetFromBiliplusExtra);

        const divLabelGetFromBiliplusExtraUpdate = document.createElement('div');
        divLabelGetFromBiliplusExtraUpdate.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromBiliplusExtraUpdate.setAttribute('title',
            '默认: 关闭');
        divControls.appendChild(divLabelGetFromBiliplusExtraUpdate);

        const labelGetFromBiliplusExtraUpdate = document.createElement('label');
        labelGetFromBiliplusExtraUpdate.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromBiliplusExtraUpdate.textContent = '启用更新';
        divLabelGetFromBiliplusExtraUpdate.appendChild(labelGetFromBiliplusExtraUpdate);

        const checkboxGetFromBiliplusExtraUpdate = document.createElement('input');
        checkboxGetFromBiliplusExtraUpdate.type = 'checkbox';
        checkboxGetFromBiliplusExtraUpdate.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxGetFromBiliplusExtraUpdate.checked = settings.getFromBiliplusExtraUpdate;
        checkboxGetFromBiliplusExtraUpdate.addEventListener('change', () => {
            try {
                settings.getFromBiliplusExtraUpdate = checkboxGetFromBiliplusExtraUpdate.checked;
                if (!settings.getFromBiliplusExtraUpdate) {
                    divLabelGetFromBiliplusExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                } else {
                    divLabelGetFromBiliplusExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromBiliplusExtraUpdate.insertAdjacentElement('afterbegin', checkboxGetFromBiliplusExtraUpdate);

        const divLabelGetFromBiliplusExtraUpdateInterval = document.createElement('div');
        divLabelGetFromBiliplusExtraUpdateInterval.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromBiliplusExtraUpdateInterval.setAttribute('title',
            '默认: 10星期');
        divControls.appendChild(divLabelGetFromBiliplusExtraUpdateInterval);

        const labelGetFromBiliplusExtraUpdateInterval = document.createElement('label');
        labelGetFromBiliplusExtraUpdateInterval.classList.add('backup-label' + classAppendNewFreshSpace);
        divLabelGetFromBiliplusExtraUpdateInterval.appendChild(labelGetFromBiliplusExtraUpdateInterval);

        const inputTextGetFromBiliplusExtraUpdateInterval = document.createElement('input');
        inputTextGetFromBiliplusExtraUpdateInterval.type = 'text';
        inputTextGetFromBiliplusExtraUpdateInterval.classList.add('backup-inputText1' + classAppendNewFreshSpace);
        inputTextGetFromBiliplusExtraUpdateInterval.value = settings.getFromBiliplusExtraUpdateInterval;
        inputTextGetFromBiliplusExtraUpdateInterval.setAttribute('backup-def', 10);
        inputTextGetFromBiliplusExtraUpdateInterval.setAttribute('backup-min', 0);
        inputTextGetFromBiliplusExtraUpdateInterval.setAttribute('backup-max', 100);
        inputTextGetFromBiliplusExtraUpdateInterval.setAttribute('backup-setting', 'getFromBiliplusExtraUpdateInterval');
        inputTextGetFromBiliplusExtraUpdateInterval.addEventListener('blur', validateInputText);

        labelGetFromBiliplusExtraUpdateInterval.appendChild(document.createTextNode('最小更新间隔'));
        labelGetFromBiliplusExtraUpdateInterval.appendChild(inputTextGetFromBiliplusExtraUpdateInterval);
        labelGetFromBiliplusExtraUpdateInterval.appendChild(document.createTextNode('星期'));

        const divLabelGetFromJijidown = document.createElement('div');
        divLabelGetFromJijidown.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromJijidown.setAttribute('title',
            '默认: 关闭\n' +
            '从唧唧获取数据时可能会出现问题。\n' +
            '地址: https://www.jijidown.com/api/v1/video_bv/get_info?id={BV号后10位}\n' +
            '或 https://www.jiji.moe/api/v1/video_bv/get_info?id={BV号后10位} (在高级选项中进行设置)\n' +
            '数据: 标题, 简介, 封面地址, UP主昵称, UP主头像地址 (均为备份时的版本)');
        divControls.appendChild(divLabelGetFromJijidown);

        const labelGetFromJijidown = document.createElement('label');
        labelGetFromJijidown.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromJijidown.textContent = '从唧唧获取数据';
        divLabelGetFromJijidown.appendChild(labelGetFromJijidown);

        const checkboxGetFromJijidown = document.createElement('input');
        checkboxGetFromJijidown.type = 'checkbox';
        checkboxGetFromJijidown.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxGetFromJijidown.checked = settings.getFromJijidown;
        checkboxGetFromJijidown.addEventListener('change', () => {
            try {
                settings.getFromJijidown = checkboxGetFromJijidown.checked;
                if (!settings.getFromJijidown) {
                    settings.getFromJijidownExtra = false;
                    checkboxGetFromJijidownExtra.checked = false;
                    divLabelGetFromJijidownUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownExtra.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownExtraUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownURL1.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownURL2.classList.add('backup-disabled' + classAppendNewFreshSpace);
                } else {
                    divLabelGetFromJijidownUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromJijidownUpdate) {
                        divLabelGetFromJijidownUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    }
                    divLabelGetFromJijidownExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromJijidownExtra) {
                        divLabelGetFromJijidownExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromJijidownExtraUpdate) {
                            divLabelGetFromJijidownExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        }
                    }
                    divLabelGetFromJijidownURL1.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownURL2.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromJijidown.insertAdjacentElement('afterbegin', checkboxGetFromJijidown);

        const divLabelGetFromJijidownUpdate = document.createElement('div');
        divLabelGetFromJijidownUpdate.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromJijidownUpdate.setAttribute('title',
            '默认: 关闭');
        divControls.appendChild(divLabelGetFromJijidownUpdate);

        const labelGetFromJijidownUpdate = document.createElement('label');
        labelGetFromJijidownUpdate.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromJijidownUpdate.textContent = '启用更新';
        divLabelGetFromJijidownUpdate.appendChild(labelGetFromJijidownUpdate);

        const checkboxGetFromJijidownUpdate = document.createElement('input');
        checkboxGetFromJijidownUpdate.type = 'checkbox';
        checkboxGetFromJijidownUpdate.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxGetFromJijidownUpdate.checked = settings.getFromJijidownUpdate;
        checkboxGetFromJijidownUpdate.addEventListener('change', () => {
            try {
                settings.getFromJijidownUpdate = checkboxGetFromJijidownUpdate.checked;
                if (!settings.getFromJijidownUpdate) {
                    divLabelGetFromJijidownUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                } else {
                    divLabelGetFromJijidownUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromJijidownUpdate.insertAdjacentElement('afterbegin', checkboxGetFromJijidownUpdate);

        const divLabelGetFromJijidownUpdateInterval = document.createElement('div');
        divLabelGetFromJijidownUpdateInterval.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromJijidownUpdateInterval.setAttribute('title',
            '默认: 10星期');
        divControls.appendChild(divLabelGetFromJijidownUpdateInterval);

        const labelGetFromJijidownUpdateInterval = document.createElement('label');
        labelGetFromJijidownUpdateInterval.classList.add('backup-label' + classAppendNewFreshSpace);
        divLabelGetFromJijidownUpdateInterval.appendChild(labelGetFromJijidownUpdateInterval);

        const inputTextGetFromJijidownUpdateInterval = document.createElement('input');
        inputTextGetFromJijidownUpdateInterval.type = 'text';
        inputTextGetFromJijidownUpdateInterval.classList.add('backup-inputText1' + classAppendNewFreshSpace);
        inputTextGetFromJijidownUpdateInterval.value = settings.getFromJijidownUpdateInterval;
        inputTextGetFromJijidownUpdateInterval.setAttribute('backup-def', 10);
        inputTextGetFromJijidownUpdateInterval.setAttribute('backup-min', 0);
        inputTextGetFromJijidownUpdateInterval.setAttribute('backup-max', 100);
        inputTextGetFromJijidownUpdateInterval.setAttribute('backup-setting', 'getFromJijidownUpdateInterval');
        inputTextGetFromJijidownUpdateInterval.addEventListener('blur', validateInputText);

        labelGetFromJijidownUpdateInterval.appendChild(document.createTextNode('最小更新间隔'));
        labelGetFromJijidownUpdateInterval.appendChild(inputTextGetFromJijidownUpdateInterval);
        labelGetFromJijidownUpdateInterval.appendChild(document.createTextNode('星期'));

        const divLabelGetFromJijidownExtra = document.createElement('div');
        divLabelGetFromJijidownExtra.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        if (debug) divLabelGetFromJijidownExtra.classList.remove('backup-advanced');
        divLabelGetFromJijidownExtra.setAttribute('title',
            '默认: 关闭\n' +
            '从唧唧获取额外数据时可能会出现问题。\n' +
            '地址: https://www.jijidown.com/api/v1/video_bv/get_download_info?id={BV号后10位}\n' +
            '或 https://www.jiji.moe/api/v1/video_bv/get_download_info?id={BV号后10位} (在高级选项中进行设置)\n' +
            '数据: 每个分集的标题, cid (均为备份时的版本)');
        divControls.appendChild(divLabelGetFromJijidownExtra);

        const labelGetFromJijidownExtra = document.createElement('label');
        labelGetFromJijidownExtra.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromJijidownExtra.textContent = '从唧唧获取额外数据';
        divLabelGetFromJijidownExtra.appendChild(labelGetFromJijidownExtra);

        const checkboxGetFromJijidownExtra = document.createElement('input');
        checkboxGetFromJijidownExtra.type = 'checkbox';
        checkboxGetFromJijidownExtra.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxGetFromJijidownExtra.checked = settings.getFromJijidownExtra;
        checkboxGetFromJijidownExtra.addEventListener('change', () => {
            try {
                settings.getFromJijidownExtra = checkboxGetFromJijidownExtra.checked;
                if (!settings.getFromJijidownExtra) {
                    divLabelGetFromJijidownExtraUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                } else {
                    divLabelGetFromJijidownExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromJijidownExtraUpdate) {
                        divLabelGetFromJijidownExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    }
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromJijidownExtra.insertAdjacentElement('afterbegin', checkboxGetFromJijidownExtra);

        const divLabelGetFromJijidownExtraUpdate = document.createElement('div');
        divLabelGetFromJijidownExtraUpdate.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromJijidownExtraUpdate.setAttribute('title',
            '默认: 关闭');
        divControls.appendChild(divLabelGetFromJijidownExtraUpdate);

        const labelGetFromJijidownExtraUpdate = document.createElement('label');
        labelGetFromJijidownExtraUpdate.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromJijidownExtraUpdate.textContent = '启用更新';
        divLabelGetFromJijidownExtraUpdate.appendChild(labelGetFromJijidownExtraUpdate);

        const checkboxGetFromJijidownExtraUpdate = document.createElement('input');
        checkboxGetFromJijidownExtraUpdate.type = 'checkbox';
        checkboxGetFromJijidownExtraUpdate.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxGetFromJijidownExtraUpdate.checked = settings.getFromJijidownExtraUpdate;
        checkboxGetFromJijidownExtraUpdate.addEventListener('change', () => {
            try {
                settings.getFromJijidownExtraUpdate = checkboxGetFromJijidownExtraUpdate.checked;
                if (!settings.getFromJijidownExtraUpdate) {
                    divLabelGetFromJijidownExtraUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                } else {
                    divLabelGetFromJijidownExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromJijidownExtraUpdate.insertAdjacentElement('afterbegin', checkboxGetFromJijidownExtraUpdate);

        const divLabelGetFromJijidownExtraUpdateInterval = document.createElement('div');
        divLabelGetFromJijidownExtraUpdateInterval.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromJijidownExtraUpdateInterval.setAttribute('title',
            '默认: 10星期');
        divControls.appendChild(divLabelGetFromJijidownExtraUpdateInterval);

        const labelGetFromJijidownExtraUpdateInterval = document.createElement('label');
        labelGetFromJijidownExtraUpdateInterval.classList.add('backup-label' + classAppendNewFreshSpace);
        divLabelGetFromJijidownExtraUpdateInterval.appendChild(labelGetFromJijidownExtraUpdateInterval);

        const inputTextGetFromJijidownExtraUpdateInterval = document.createElement('input');
        inputTextGetFromJijidownExtraUpdateInterval.type = 'text';
        inputTextGetFromJijidownExtraUpdateInterval.classList.add('backup-inputText1' + classAppendNewFreshSpace);
        inputTextGetFromJijidownExtraUpdateInterval.value = settings.getFromJijidownExtraUpdateInterval;
        inputTextGetFromJijidownExtraUpdateInterval.setAttribute('backup-def', 10);
        inputTextGetFromJijidownExtraUpdateInterval.setAttribute('backup-min', 0);
        inputTextGetFromJijidownExtraUpdateInterval.setAttribute('backup-max', 100);
        inputTextGetFromJijidownExtraUpdateInterval.setAttribute('backup-setting', 'getFromJijidownExtraUpdateInterval');
        inputTextGetFromJijidownExtraUpdateInterval.addEventListener('blur', validateInputText);

        labelGetFromJijidownExtraUpdateInterval.appendChild(document.createTextNode('最小更新间隔'));
        labelGetFromJijidownExtraUpdateInterval.appendChild(inputTextGetFromJijidownExtraUpdateInterval);
        labelGetFromJijidownExtraUpdateInterval.appendChild(document.createTextNode('星期'));

        const divLabelGetFromJijidownURL1 = document.createElement('div');
        divLabelGetFromJijidownURL1.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromJijidownURL1.setAttribute('title',
            '默认: www.jijidown.com\n' +
            'www.jiji.moe为唧唧的新域名。\n' +
            '如果脚本从唧唧获取数据时反复出现问题, 切换至另一域名可能有帮助。');
        divControls.appendChild(divLabelGetFromJijidownURL1);

        const labelGetFromJijidownURL1 = document.createElement('label');
        labelGetFromJijidownURL1.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromJijidownURL1.textContent = 'www.jijidown.com';
        divLabelGetFromJijidownURL1.appendChild(labelGetFromJijidownURL1);

        const radioGetFromJijidownURL1 = document.createElement('input');
        radioGetFromJijidownURL1.type = 'radio';
        radioGetFromJijidownURL1.classList.add('backup-inputRadio' + classAppendNewFreshSpace);
        radioGetFromJijidownURL1.name = 'getFromJijidownURL';
        radioGetFromJijidownURL1.value = 'www.jijidown.com';
        radioGetFromJijidownURL1.checked = settings.getFromJijidownURL === 'www.jijidown.com';
        radioGetFromJijidownURL1.addEventListener('change', () => {
            try {
                settings.getFromJijidownURL = 'www.jijidown.com';
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromJijidownURL1.insertAdjacentElement('afterbegin', radioGetFromJijidownURL1);

        const divLabelGetFromJijidownURL2 = document.createElement('div');
        divLabelGetFromJijidownURL2.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromJijidownURL2.setAttribute('title',
            '默认: www.jijidown.com\n' +
            'www.jiji.moe为唧唧的新域名。\n' +
            '如果脚本从唧唧获取数据时反复出现问题, 切换至另一域名可能有帮助。');
        divControls.appendChild(divLabelGetFromJijidownURL2);

        const labelGetFromJijidownURL2 = document.createElement('label');
        labelGetFromJijidownURL2.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromJijidownURL2.textContent = 'www.jiji.moe';
        divLabelGetFromJijidownURL2.appendChild(labelGetFromJijidownURL2);

        const radioGetFromJijidownURL2 = document.createElement('input');
        radioGetFromJijidownURL2.type = 'radio';
        radioGetFromJijidownURL2.classList.add('backup-inputRadio' + classAppendNewFreshSpace);
        radioGetFromJijidownURL2.name = 'getFromJijidownURL';
        radioGetFromJijidownURL2.value = 'www.jiji.moe';
        radioGetFromJijidownURL2.checked = settings.getFromJijidownURL === 'www.jiji.moe';
        radioGetFromJijidownURL2.addEventListener('change', () => {
            try {
                settings.getFromJijidownURL = 'www.jiji.moe';
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromJijidownURL2.insertAdjacentElement('afterbegin', radioGetFromJijidownURL2);

        const divLabelGetFromXbeibeix = document.createElement('div');
        divLabelGetFromXbeibeix.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromXbeibeix.setAttribute('title',
            '默认: 关闭\n' +
            '从贝贝工具站获取数据时可能会出现问题。\n' +
            '地址: https://xbeibeix.com/video/{BV号}\n' +
            '或 https://beibeigame.com/video/{BV号}\n' +
            '或 https://bbdownloader.com/video/{BV号} (在高级选项中进行设置)\n' +
            '数据: 标题, 简介, 封面地址, UP主昵称 (均为备份时的版本)\n' +
            '此接口可能需要进行人机验证, 手动访问一次贝贝工具站的原始页面可能有帮助。');
        divControls.appendChild(divLabelGetFromXbeibeix);

        const labelGetFromXbeibeix = document.createElement('label');
        labelGetFromXbeibeix.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromXbeibeix.textContent = '从贝贝工具站获取数据';
        divLabelGetFromXbeibeix.appendChild(labelGetFromXbeibeix);

        checkboxGetFromXbeibeix = document.createElement('input');
        checkboxGetFromXbeibeix.type = 'checkbox';
        checkboxGetFromXbeibeix.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxGetFromXbeibeix.checked = settings.getFromXbeibeix;
        checkboxGetFromXbeibeix.addEventListener('change', () => {
            try {
                settings.getFromXbeibeix = checkboxGetFromXbeibeix.checked;
                if (!settings.getFromXbeibeix) {
                    if (debug) {
                        settings.getFromXbeibeixExtra = false;
                        checkboxGetFromXbeibeixExtra.checked = false;
                    }
                    divLabelGetFromXbeibeixUpdate.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixURL1.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixURL2.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixURL3.classList.add('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixExtra.classList.add('backup-disabled' + classAppendNewFreshSpace);
                } else {
                    divLabelGetFromXbeibeixUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromXbeibeixUpdate) {
                        divLabelGetFromXbeibeixUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    }
                    divLabelGetFromXbeibeixURL1.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixURL2.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixURL3.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromXbeibeix.insertAdjacentElement('afterbegin', checkboxGetFromXbeibeix);

        const divLabelGetFromXbeibeixUpdate = document.createElement('div');
        divLabelGetFromXbeibeixUpdate.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromXbeibeixUpdate.setAttribute('title',
            '默认: 关闭');
        divControls.appendChild(divLabelGetFromXbeibeixUpdate);

        const labelGetFromXbeibeixUpdate = document.createElement('label');
        labelGetFromXbeibeixUpdate.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromXbeibeixUpdate.textContent = '启用更新';
        divLabelGetFromXbeibeixUpdate.appendChild(labelGetFromXbeibeixUpdate);

        const checkboxGetFromXbeibeixUpdate = document.createElement('input');
        checkboxGetFromXbeibeixUpdate.type = 'checkbox';
        checkboxGetFromXbeibeixUpdate.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxGetFromXbeibeixUpdate.checked = settings.getFromXbeibeixUpdate;
        checkboxGetFromXbeibeixUpdate.addEventListener('change', () => {
            try {
                settings.getFromXbeibeixUpdate = checkboxGetFromXbeibeixUpdate.checked;
                if (!settings.getFromXbeibeixUpdate) {
                    divLabelGetFromXbeibeixUpdateInterval.classList.add('backup-disabled' + classAppendNewFreshSpace);
                } else {
                    divLabelGetFromXbeibeixUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromXbeibeixUpdate.insertAdjacentElement('afterbegin', checkboxGetFromXbeibeixUpdate);

        const divLabelGetFromXbeibeixUpdateInterval = document.createElement('div');
        divLabelGetFromXbeibeixUpdateInterval.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromXbeibeixUpdateInterval.setAttribute('title',
            '默认: 10星期');
        divControls.appendChild(divLabelGetFromXbeibeixUpdateInterval);

        const labelGetFromXbeibeixUpdateInterval = document.createElement('label');
        labelGetFromXbeibeixUpdateInterval.classList.add('backup-label' + classAppendNewFreshSpace);
        divLabelGetFromXbeibeixUpdateInterval.appendChild(labelGetFromXbeibeixUpdateInterval);

        const inputTextGetFromXbeibeixUpdateInterval = document.createElement('input');
        inputTextGetFromXbeibeixUpdateInterval.type = 'text';
        inputTextGetFromXbeibeixUpdateInterval.classList.add('backup-inputText1' + classAppendNewFreshSpace);
        inputTextGetFromXbeibeixUpdateInterval.value = settings.getFromXbeibeixUpdateInterval;
        inputTextGetFromXbeibeixUpdateInterval.setAttribute('backup-def', 10);
        inputTextGetFromXbeibeixUpdateInterval.setAttribute('backup-min', 0);
        inputTextGetFromXbeibeixUpdateInterval.setAttribute('backup-max', 100);
        inputTextGetFromXbeibeixUpdateInterval.setAttribute('backup-setting', 'getFromXbeibeixUpdateInterval');
        inputTextGetFromXbeibeixUpdateInterval.addEventListener('blur', validateInputText);

        labelGetFromXbeibeixUpdateInterval.appendChild(document.createTextNode('最小更新间隔'));
        labelGetFromXbeibeixUpdateInterval.appendChild(inputTextGetFromXbeibeixUpdateInterval);
        labelGetFromXbeibeixUpdateInterval.appendChild(document.createTextNode('星期'));

        const divLabelGetFromXbeibeixURL1 = document.createElement('div');
        divLabelGetFromXbeibeixURL1.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromXbeibeixURL1.setAttribute('title',
            '默认: xbeibeix.com\n' +
            'beibeigame.com和bbdownloader.com为贝贝工具站的新域名。\n' +
            '如果脚本从贝贝工具站获取数据时反复出现问题, 切换至另一域名可能有帮助。');
        divControls.appendChild(divLabelGetFromXbeibeixURL1);

        const labelGetFromXbeibeixURL1 = document.createElement('label');
        labelGetFromXbeibeixURL1.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromXbeibeixURL1.textContent = 'xbeibeix.com';
        divLabelGetFromXbeibeixURL1.appendChild(labelGetFromXbeibeixURL1);

        const radioGetFromXbeibeixURL1 = document.createElement('input');
        radioGetFromXbeibeixURL1.type = 'radio';
        radioGetFromXbeibeixURL1.classList.add('backup-inputRadio' + classAppendNewFreshSpace);
        radioGetFromXbeibeixURL1.name = 'getFromXbeibeixURL';
        radioGetFromXbeibeixURL1.value = 'xbeibeix.com';
        radioGetFromXbeibeixURL1.checked = settings.getFromXbeibeixURL === 'xbeibeix.com';
        radioGetFromXbeibeixURL1.addEventListener('change', () => {
            try {
                settings.getFromXbeibeixURL = 'xbeibeix.com';
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromXbeibeixURL1.insertAdjacentElement('afterbegin', radioGetFromXbeibeixURL1);

        const divLabelGetFromXbeibeixURL2 = document.createElement('div');
        divLabelGetFromXbeibeixURL2.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromXbeibeixURL2.setAttribute('title',
            '默认: xbeibeix.com\n' +
            'beibeigame.com和bbdownloader.com为贝贝工具站的新域名。\n' +
            '如果脚本从贝贝工具站获取数据时反复出现问题, 切换至另一域名可能有帮助。');
        divControls.appendChild(divLabelGetFromXbeibeixURL2);

        const labelGetFromXbeibeixURL2 = document.createElement('label');
        labelGetFromXbeibeixURL2.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromXbeibeixURL2.textContent = 'beibeigame.com';
        divLabelGetFromXbeibeixURL2.appendChild(labelGetFromXbeibeixURL2);

        const radioGetFromXbeibeixURL2 = document.createElement('input');
        radioGetFromXbeibeixURL2.type = 'radio';
        radioGetFromXbeibeixURL2.classList.add('backup-inputRadio' + classAppendNewFreshSpace);
        radioGetFromXbeibeixURL2.name = 'getFromXbeibeixURL';
        radioGetFromXbeibeixURL2.value = 'beibeigame.com';
        radioGetFromXbeibeixURL2.checked = settings.getFromXbeibeixURL === 'beibeigame.com';
        radioGetFromXbeibeixURL2.addEventListener('change', () => {
            try {
                settings.getFromXbeibeixURL = 'beibeigame.com';
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromXbeibeixURL2.insertAdjacentElement('afterbegin', radioGetFromXbeibeixURL2);

        const divLabelGetFromXbeibeixURL3 = document.createElement('div');
        divLabelGetFromXbeibeixURL3.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        divLabelGetFromXbeibeixURL3.setAttribute('title',
            '默认: xbeibeix.com\n' +
            'beibeigame.com和bbdownloader.com为贝贝工具站的新域名。\n' +
            '如果脚本从贝贝工具站获取数据时反复出现问题, 切换至另一域名可能有帮助。');
        divControls.appendChild(divLabelGetFromXbeibeixURL3);

        const labelGetFromXbeibeixURL3 = document.createElement('label');
        labelGetFromXbeibeixURL3.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromXbeibeixURL3.textContent = 'bbdownloader.com';
        divLabelGetFromXbeibeixURL3.appendChild(labelGetFromXbeibeixURL3);

        const radioGetFromXbeibeixURL3 = document.createElement('input');
        radioGetFromXbeibeixURL3.type = 'radio';
        radioGetFromXbeibeixURL3.classList.add('backup-inputRadio' + classAppendNewFreshSpace);
        radioGetFromXbeibeixURL3.name = 'getFromXbeibeixURL';
        radioGetFromXbeibeixURL3.value = 'bbdownloader.com';
        radioGetFromXbeibeixURL3.checked = settings.getFromXbeibeixURL === 'bbdownloader.com';
        radioGetFromXbeibeixURL3.addEventListener('change', () => {
            try {
                settings.getFromXbeibeixURL = 'bbdownloader.com';
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelGetFromXbeibeixURL3.insertAdjacentElement('afterbegin', radioGetFromXbeibeixURL3);

        const divLabelGetFromXbeibeixExtra = document.createElement('div');
        divLabelGetFromXbeibeixExtra.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-advanced', 'backup-disabled' + classAppendNewFreshSpace);
        if (debug) divLabelGetFromXbeibeixExtra.classList.remove('backup-advanced');
        if (debug) divControls.appendChild(divLabelGetFromXbeibeixExtra);

        const labelGetFromXbeibeixExtra = document.createElement('label');
        labelGetFromXbeibeixExtra.classList.add('backup-label' + classAppendNewFreshSpace);
        labelGetFromXbeibeixExtra.textContent = '从贝贝工具站获取额外数据';
        if (debug) divLabelGetFromXbeibeixExtra.appendChild(labelGetFromXbeibeixExtra);

        checkboxGetFromXbeibeixExtra = document.createElement('input');
        checkboxGetFromXbeibeixExtra.type = 'checkbox';
        checkboxGetFromXbeibeixExtra.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxGetFromXbeibeixExtra.checked = !!settings.getFromXbeibeixExtra;
        checkboxGetFromXbeibeixExtra.addEventListener('change', () => {
            try {
                settings.getFromXbeibeixExtra = checkboxGetFromXbeibeixExtra.checked;
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        if (debug) labelGetFromXbeibeixExtra.insertAdjacentElement('afterbegin', checkboxGetFromXbeibeixExtra);

        const divLabelAutoNextPage = document.createElement('div');
        divLabelAutoNextPage.classList.add('backup-div-first' + classAppendNewFreshSpace);
        divLabelAutoNextPage.setAttribute('title',
            '开启后脚本将在当前页的视频都处理完毕之后点击下一页, 继续处理下一页的视频。');
        divControls.appendChild(divLabelAutoNextPage);

        const labelAutoNextPage = document.createElement('label');
        labelAutoNextPage.classList.add('backup-label' + classAppendNewFreshSpace);
        labelAutoNextPage.textContent = '自动点击下一页';
        divLabelAutoNextPage.appendChild(labelAutoNextPage);

        const checkboxAutoNextPage = document.createElement('input');
        checkboxAutoNextPage.type = 'checkbox';
        checkboxAutoNextPage.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxAutoNextPage.checked = autoNextPage;
        checkboxAutoNextPage.addEventListener('change', async () => {
            try {
                autoNextPage = checkboxAutoNextPage.checked;
                if (autoNextPage) {
                    divLabelAutoNextFavlist.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (!activeControllers.size) {
                        if (newFreshSpace) {
                            if (!document.querySelector('div.fav-collapse').contains(document.querySelector('div.vui_sidebar-item--active'))) {
                                return;
                            }
                            const pager = Array.from(document.querySelectorAll('button.vui_pagenation--btn-side')).find(el => el.textContent === '下一页');
                            if (pager && !pager.classList.contains('vui_button--disabled')) {
                                await delay(500);
                                if (autoNextPage) {
                                    pager.click();
                                }
                            }

                        } else {
                            if (!document.querySelector('div.nav-container').contains(document.querySelector('.fav-item.cur'))) {
                                return;
                            }
                            const pager = document.querySelector('li.be-pager-next');
                            if (pager && !pager.classList.contains('be-pager-disabled')) {
                                await delay(500);
                                if (autoNextPage) {
                                    pager.click();
                                }
                            }
                        }
                    }

                } else {
                    autoNextFavlist = false;
                    checkboxAutoNextFavlist.checked = false;
                    divLabelAutoNextFavlist.classList.add('backup-disabled' + classAppendNewFreshSpace);
                }
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelAutoNextPage.insertAdjacentElement('afterbegin', checkboxAutoNextPage);

        const divLabelAutoNextFavlist = document.createElement('div');
        divLabelAutoNextFavlist.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-disabled' + classAppendNewFreshSpace);
        divLabelAutoNextFavlist.setAttribute('title',
            '开启后脚本将在当前收藏夹的视频都处理完毕之后点击下一收藏夹, 继续处理下一收藏夹的视频。');
        divControls.appendChild(divLabelAutoNextFavlist);

        const labelAutoNextFavlist = document.createElement('label');
        labelAutoNextFavlist.classList.add('backup-label' + classAppendNewFreshSpace);
        labelAutoNextFavlist.textContent = '自动点击下一收藏夹';
        divLabelAutoNextFavlist.appendChild(labelAutoNextFavlist);

        const checkboxAutoNextFavlist = document.createElement('input');
        checkboxAutoNextFavlist.type = 'checkbox';
        checkboxAutoNextFavlist.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxAutoNextFavlist.checked = autoNextFavlist;
        checkboxAutoNextFavlist.addEventListener('change', async () => {
            try {
                autoNextFavlist = checkboxAutoNextFavlist.checked;
                if (autoNextFavlist && !activeControllers.size) {
                    let currentFavlist;
                    if (newFreshSpace) {
                        currentFavlist = document.querySelector('div.vui_sidebar-item--active');
                        if (!document.querySelector('div.fav-collapse').contains(currentFavlist)) {
                            return;
                        }
                        const pager = Array.from(document.querySelectorAll('button.vui_pagenation--btn-side')).find(el => el.textContent === '下一页');
                        if (pager && !pager.classList.contains('vui_button--disabled')) {

                        } else {
                            if (!currentFavlist.parentNode.getAttribute('id')) {
                                if (document.querySelector('div.fav-sortable-list').childElementCount) {
                                    await delay(500);
                                    if (autoNextFavlist) {
                                        document.querySelector('div.fav-sortable-list').firstElementChild.querySelector('div').click();
                                    }
                                }

                            } else {
                                const nextFavlist = currentFavlist.parentNode.nextElementSibling;
                                if (nextFavlist) {
                                    await delay(500);
                                    if (autoNextFavlist) {
                                        nextFavlist.querySelector('div').click();
                                    }
                                }
                            }
                        }

                    } else {
                        currentFavlist = document.querySelector('.fav-item.cur');
                        if (!document.querySelector('div.nav-container').contains(currentFavlist)) {
                            return;
                        }
                        const pager = document.querySelector('li.be-pager-next');
                        if (pager && !pager.classList.contains('be-pager-disabled')) {

                        } else {
                            if (currentFavlist.nodeName === 'DIV') {
                                if (document.querySelector('ul.fav-list').childElementCount) {
                                    await delay(500);
                                    if (autoNextFavlist) {
                                        document.querySelector('ul.fav-list').firstElementChild.querySelector('a').click();
                                    }
                                }

                            } else {
                                const nextFavlist = currentFavlist.nextElementSibling;
                                if (nextFavlist) {
                                    await delay(500);
                                    if (autoNextFavlist) {
                                        nextFavlist.querySelector('a').click();
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelAutoNextFavlist.insertAdjacentElement('afterbegin', checkboxAutoNextFavlist);

        const divLabelAutoNextPageInterval = document.createElement('div');
        divLabelAutoNextPageInterval.classList.add('backup-div-second' + classAppendNewFreshSpace, 'backup-advanced');
        divLabelAutoNextPageInterval.setAttribute('title',
            '默认: 5秒\n' +
            '每次点击下一页或下一收藏夹之前停留在当前页的时间。');
        divControls.appendChild(divLabelAutoNextPageInterval);

        const labelAutoNextPageInterval = document.createElement('label');
        labelAutoNextPageInterval.classList.add('backup-label' + classAppendNewFreshSpace);
        divLabelAutoNextPageInterval.appendChild(labelAutoNextPageInterval);

        const inputTextAutoNextPageInterval = document.createElement('input');
        inputTextAutoNextPageInterval.type = 'text';
        inputTextAutoNextPageInterval.classList.add('backup-inputText1' + classAppendNewFreshSpace);
        inputTextAutoNextPageInterval.value = settings.autoNextPageInterval;
        inputTextAutoNextPageInterval.setAttribute('backup-def', 5);
        inputTextAutoNextPageInterval.setAttribute('backup-min', 1);
        inputTextAutoNextPageInterval.setAttribute('backup-max', 100);
        inputTextAutoNextPageInterval.setAttribute('backup-setting', 'autoNextPageInterval');
        inputTextAutoNextPageInterval.addEventListener('blur', validateInputText);

        labelAutoNextPageInterval.appendChild(document.createTextNode('停留间隔'));
        labelAutoNextPageInterval.appendChild(inputTextAutoNextPageInterval);
        labelAutoNextPageInterval.appendChild(document.createTextNode('秒'));

        const divLabelRequestTimeout = document.createElement('div');
        divLabelRequestTimeout.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-advanced');
        divLabelRequestTimeout.setAttribute('title',
            '默认: 10秒\n' +
            '脚本获取数据时, 如果等待了设定的时长后仍未得到响应数据, 则暂时跳过处理当前视频。');
        divControls.appendChild(divLabelRequestTimeout);

        const labelRequestTimeout = document.createElement('label');
        labelRequestTimeout.classList.add('backup-label' + classAppendNewFreshSpace);
        divLabelRequestTimeout.appendChild(labelRequestTimeout);

        const inputTextRequestTimeout = document.createElement('input');
        inputTextRequestTimeout.type = 'text';
        inputTextRequestTimeout.classList.add('backup-inputText1' + classAppendNewFreshSpace);
        inputTextRequestTimeout.value = settings.requestTimeout;
        inputTextRequestTimeout.setAttribute('backup-def', 10);
        inputTextRequestTimeout.setAttribute('backup-min', 1);
        inputTextRequestTimeout.setAttribute('backup-max', 100);
        inputTextRequestTimeout.setAttribute('backup-setting', 'requestTimeout');
        inputTextRequestTimeout.addEventListener('blur', validateInputText);

        labelRequestTimeout.appendChild(document.createTextNode('请求超时时间'));
        labelRequestTimeout.appendChild(inputTextRequestTimeout);
        labelRequestTimeout.appendChild(document.createTextNode('秒'));

        if (newFreshSpace) {
            const divLabelDelayBeforeMain = document.createElement('div');
            divLabelDelayBeforeMain.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-advanced');
            divLabelDelayBeforeMain.setAttribute('title',
                '默认: 300毫秒\n' +
                '如果您遇到了视频标题下方的信息展示出来后又突然消失的问题, 请将这个时长调大一些。\n' +
                '如果您想将其设置为0, 则需要避免取消收藏, 移动视频, 指定排序方式或筛选条件等操作, 否则可能会出现问题。');
            divControls.appendChild(divLabelDelayBeforeMain);

            const labelDelayBeforeMain = document.createElement('label');
            labelDelayBeforeMain.classList.add('backup-label' + classAppendNewFreshSpace);
            divLabelDelayBeforeMain.appendChild(labelDelayBeforeMain);

            const inputTextDelayBeforeMain = document.createElement('input');
            inputTextDelayBeforeMain.type = 'text';
            inputTextDelayBeforeMain.classList.add('backup-inputText1' + classAppendNewFreshSpace);
            inputTextDelayBeforeMain.value = settings.delayBeforeMain;
            inputTextDelayBeforeMain.setAttribute('backup-def', 300);
            inputTextDelayBeforeMain.setAttribute('backup-min', 0);
            inputTextDelayBeforeMain.setAttribute('backup-max', 1000);
            inputTextDelayBeforeMain.setAttribute('backup-setting', 'delayBeforeMain');
            inputTextDelayBeforeMain.addEventListener('blur', validateInputText);

            labelDelayBeforeMain.appendChild(document.createTextNode('开始处理视频前等待'));
            labelDelayBeforeMain.appendChild(inputTextDelayBeforeMain);
            labelDelayBeforeMain.appendChild(document.createTextNode('毫秒'));
        }

        const divLabelAppendDropdownsOrder = document.createElement('div');
        divLabelAppendDropdownsOrder.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-advanced');
        divLabelAppendDropdownsOrder.setAttribute('title',
            '默认: abcdefg\n' +
            'a: 本地备份数据\n' +
            'b: 封面原图\n' +
            'c: 首帧截图\n' +
            'd: 进度略图\n' +
            'e: UP主头像\n' +
            'f: 跳转至BJX\n' +
            'g: 重置备份数据\n' +
            '如果您不需要某个功能, 将其所对应的编号删除即可。');
        divControls.appendChild(divLabelAppendDropdownsOrder);

        const labelAppendDropdownsOrder = document.createElement('label');
        labelAppendDropdownsOrder.classList.add('backup-label' + classAppendNewFreshSpace);
        divLabelAppendDropdownsOrder.appendChild(labelAppendDropdownsOrder);

        const inputTextAppendDropdownsOrder = document.createElement('input');
        inputTextAppendDropdownsOrder.type = 'text';
        inputTextAppendDropdownsOrder.classList.add('backup-inputText2' + classAppendNewFreshSpace);
        inputTextAppendDropdownsOrder.value = settings.appendDropdownsOrder;
        inputTextAppendDropdownsOrder.addEventListener('blur', validateInputTextAppendDropdownsOrder);

        labelAppendDropdownsOrder.appendChild(document.createTextNode('下拉列表顺序'));
        labelAppendDropdownsOrder.appendChild(inputTextAppendDropdownsOrder);

        const divLabelTCABJXOpacity = document.createElement('div');
        divLabelTCABJXOpacity.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-advanced');
        divLabelTCABJXOpacity.setAttribute('title',
            '默认: 100%\n' +
            '如果您觉得视频标题下方的TCABJX太显眼, 可以将其不透明度调低一些。');
        divControls.appendChild(divLabelTCABJXOpacity);

        const labelTCABJXOpacity = document.createElement('label');
        labelTCABJXOpacity.classList.add('backup-label' + classAppendNewFreshSpace);
        divLabelTCABJXOpacity.appendChild(labelTCABJXOpacity);

        const inputTextTCABJXOpacity = document.createElement('input');
        inputTextTCABJXOpacity.type = 'text';
        inputTextTCABJXOpacity.classList.add('backup-inputText1' + classAppendNewFreshSpace);
        inputTextTCABJXOpacity.value = settings.TCABJXOpacity;
        inputTextTCABJXOpacity.setAttribute('backup-def', 100);
        inputTextTCABJXOpacity.setAttribute('backup-min', 0);
        inputTextTCABJXOpacity.setAttribute('backup-max', 100);
        inputTextTCABJXOpacity.setAttribute('backup-setting', 'TCABJXOpacity');
        inputTextTCABJXOpacity.addEventListener('blur', validateInputText);

        labelTCABJXOpacity.appendChild(document.createTextNode('TCABJX不透明度'));
        labelTCABJXOpacity.appendChild(inputTextTCABJXOpacity);
        labelTCABJXOpacity.appendChild(document.createTextNode('%'));

        const divLabelAutoDisableGetFromBJX = document.createElement('div');
        divLabelAutoDisableGetFromBJX.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-advanced');
        divLabelAutoDisableGetFromBJX.setAttribute('title',
            '默认: 开启\n' +
            '开启后脚本从BiliPlus获取数据, 从BiliPlus获取额外数据, 从贝贝工具站获取数据时, 如果因为需要人机验证而无法继续进行下去, 则自动取消获取数据。');
        divControls.appendChild(divLabelAutoDisableGetFromBJX);

        const labelAutoDisableGetFromBJX = document.createElement('label');
        labelAutoDisableGetFromBJX.classList.add('backup-label' + classAppendNewFreshSpace);
        labelAutoDisableGetFromBJX.textContent = '从第三方网站获取数据需要人机验证时自动关闭';
        divLabelAutoDisableGetFromBJX.appendChild(labelAutoDisableGetFromBJX);

        const checkboxAutoDisableGetFromBJX = document.createElement('input');
        checkboxAutoDisableGetFromBJX.type = 'checkbox';
        checkboxAutoDisableGetFromBJX.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxAutoDisableGetFromBJX.checked = settings.autoDisableGetFromBJX;
        checkboxAutoDisableGetFromBJX.addEventListener('change', () => {
            try {
                settings.autoDisableGetFromBJX = checkboxAutoDisableGetFromBJX.checked;
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelAutoDisableGetFromBJX.insertAdjacentElement('afterbegin', checkboxAutoDisableGetFromBJX);

        const divLabelDisplayAdvancedControls = document.createElement('div');
        divLabelDisplayAdvancedControls.classList.add('backup-div-first' + classAppendNewFreshSpace);
        divControls.appendChild(divLabelDisplayAdvancedControls);

        const labelDisplayAdvancedControls = document.createElement('label');
        labelDisplayAdvancedControls.classList.add('backup-label' + classAppendNewFreshSpace);
        labelDisplayAdvancedControls.textContent = '显示全部选项和功能';
        divLabelDisplayAdvancedControls.appendChild(labelDisplayAdvancedControls);

        const checkboxDisplayAdvancedControls = document.createElement('input');
        checkboxDisplayAdvancedControls.type = 'checkbox';
        checkboxDisplayAdvancedControls.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxDisplayAdvancedControls.checked = settings.displayAdvancedControls;
        checkboxDisplayAdvancedControls.addEventListener('change', () => {
            try {
                settings.displayAdvancedControls = checkboxDisplayAdvancedControls.checked;
                if (!settings.displayAdvancedControls) {
                    divControls.querySelectorAll('.backup-advanced').forEach(el => { el.classList.add('backup-hidden' + classAppendNewFreshSpace) });
                } else {
                    divControls.querySelectorAll('.backup-advanced').forEach(el => { el.classList.remove('backup-hidden' + classAppendNewFreshSpace) });
                }
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelDisplayAdvancedControls.insertAdjacentElement('afterbegin', checkboxDisplayAdvancedControls);

        const divButtonExportBackup = document.createElement('div');
        divButtonExportBackup.classList.add('backup-div-first' + classAppendNewFreshSpace);
        divButtonExportBackup.setAttribute('title',
            '脚本内已有的备份数据会与导入的备份数据合并在一起。\n' +
            '请不要随意修改导出的备份数据文件中的内容, 否则导入时可能会出错。');
        divControls.appendChild(divButtonExportBackup);

        const buttonExportBackup = document.createElement('button');
        buttonExportBackup.type = 'button';
        buttonExportBackup.classList.add('backup-button' + classAppendNewFreshSpace);
        buttonExportBackup.textContent = '导出本地备份数据';
        buttonExportBackup.addEventListener('click', () => {
            try {
                const backupsToExport = GM_getValues(GM_listValues().sort());
                delete backupsToExport.settings;
                const currentTs = getCurrentTs();

                const link = document.createElement('a');
                link.href = URL.createObjectURL(new Blob([JSON.stringify(backupsToExport, null, 4)], { type: 'application/json' }));
                link.download = `${formatTsYYMMDD_HHMMSS(currentTs)}.json`;
                link.click();
                URL.revokeObjectURL(link.href);

                if (settings.exportBackupWithoutTsFrom) {
                    removeTsFromInBackup(backupsToExport);
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(new Blob([JSON.stringify(backupsToExport, null, 4)], { type: 'application/json' }));
                    link.download = `${formatTsYYMMDD_HHMMSS(currentTs)}_without_ts_from.json`;
                    link.click();
                    URL.revokeObjectURL(link.href);
                }

            } catch (error) {
                catchUnknownError(error);
            }
        });
        divButtonExportBackup.appendChild(buttonExportBackup);

        const divLabelExportBackupWithoutTsFrom = document.createElement('div');
        divLabelExportBackupWithoutTsFrom.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-advanced');
        divLabelExportBackupWithoutTsFrom.setAttribute('title',
            '默认: 关闭\n' +
            '本地备份数据中各个信息的ts代表上一次从B站接口获取到该信息的时间戳或第三方网站备份该信息的时间戳, from代表该信息的获取来源。\n' +
            '如果您想要对比两个备份数据文件内容的差异, 对比两个文件去除ts和from的副本会更容易一些。\n' +
            '导入本地备份数据时请导入原始文件, 不要导入去除ts和from的副本。');
        divControls.appendChild(divLabelExportBackupWithoutTsFrom);

        const labelExportBackupWithoutTsFrom = document.createElement('label');
        labelExportBackupWithoutTsFrom.classList.add('backup-label' + classAppendNewFreshSpace);
        labelExportBackupWithoutTsFrom.textContent = '同时导出去除ts和from的副本';
        divLabelExportBackupWithoutTsFrom.appendChild(labelExportBackupWithoutTsFrom);

        const checkboxExportBackupWithoutTsFrom = document.createElement('input');
        checkboxExportBackupWithoutTsFrom.type = 'checkbox';
        checkboxExportBackupWithoutTsFrom.classList.add('backup-inputCheckbox' + classAppendNewFreshSpace);
        checkboxExportBackupWithoutTsFrom.checked = settings.exportBackupWithoutTsFrom;
        checkboxExportBackupWithoutTsFrom.addEventListener('change', () => {
            try {
                settings.exportBackupWithoutTsFrom = checkboxExportBackupWithoutTsFrom.checked;
                GM_setValue('settings', settings);
            } catch (error) {
                catchUnknownError(error);
            }
        });
        labelExportBackupWithoutTsFrom.insertAdjacentElement('afterbegin', checkboxExportBackupWithoutTsFrom);

        const divButtonImportBackup = document.createElement('div');
        divButtonImportBackup.classList.add('backup-div-first' + classAppendNewFreshSpace);
        divButtonImportBackup.setAttribute('title',
            '脚本内已有的备份数据会与导入的备份数据合并在一起。\n' +
            '请不要随意修改导出的备份数据文件中的内容, 否则导入时可能会出错。');
        divControls.appendChild(divButtonImportBackup);

        const buttonImportBackup = document.createElement('button');
        buttonImportBackup.type = 'button';
        buttonImportBackup.classList.add('backup-button' + classAppendNewFreshSpace);
        buttonImportBackup.textContent = '导入本地备份数据';
        divButtonImportBackup.appendChild(buttonImportBackup);

        const divInputFile = document.createElement('div');
        divInputFile.style.display = 'none';
        divControls.appendChild(divInputFile);

        const inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.accept = '.json';
        divInputFile.appendChild(inputFile);

        buttonImportBackup.addEventListener('click', () => {
            try {
                inputFile.click();
            } catch (error) {
                catchUnknownError(error);
            }
        });

        inputFile.addEventListener('change', (event) => {
            try {
                const file = event.target.files[0];
                if (!file) {
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const backupsToImport = JSON.parse(e.target.result);
                        if (typeof backupsToImport !== 'object') {
                            addMessage({ msg: '文件内容有误, 无法导入', border: 'red' });
                            return;
                        }

                        for (const BVOfBackupToImport in backupsToImport) {
                            const backupToImport = backupsToImport[BVOfBackupToImport];

                            try {

                                formatBackup(backupToImport);

                                const backup = GM_getValue(BVOfBackupToImport, {
                                    BV: null,
                                    AV: null,
                                    title: null,
                                    intro: null,
                                    cover: null,
                                    upperUID: null,
                                    upperName: null,
                                    upperAvatar: null,
                                    timeUpload: null,
                                    timePublish: null,
                                    timeFavorite: null,
                                    dynamic: null,
                                    pages: null,
                                    api: null,
                                    apiExtra: null,
                                    biliplus: null,
                                    biliplusExtra: null,
                                    jijidown: null,
                                    jijidownExtra: null,
                                    xbeibeix: null,
                                });

                                formatBackup(backup);

                                if (backupToImport.AV) {
                                    backup.AV = backupToImport.AV;
                                }
                                if (backupToImport.BV) {
                                    backup.BV = backupToImport.BV;
                                }
                                if (backupToImport.title) {
                                    backupToImport.title.forEach(el => {
                                        updateArrayDataInBackup(backup, 'title', el.value, el.ts, el.from);
                                    });
                                }
                                if (backupToImport.intro) {
                                    backupToImport.intro.forEach(el => {
                                        updateArrayDataInBackup(backup, 'intro', el.value, el.ts, el.from);
                                    });
                                }
                                if (backupToImport.cover) {
                                    backupToImport.cover.forEach(el => {
                                        updateArrayDataInBackup(backup, 'cover', el.value, el.ts, el.from);
                                    });
                                }
                                if (backupToImport.upperUID) {
                                    backup.upperUID = backupToImport.upperUID;
                                }
                                if (backupToImport.upperName) {
                                    backupToImport.upperName.forEach(el => {
                                        updateArrayDataInBackup(backup, 'upperName', el.value, el.ts, el.from);
                                    });
                                }
                                if (backupToImport.upperAvatar) {
                                    backupToImport.upperAvatar.forEach(el => {
                                        updateArrayDataInBackup(backup, 'upperAvatar', el.value, el.ts, el.from);
                                    });
                                }
                                if (backupToImport.timeUpload) {
                                    backup.timeUpload = backupToImport.timeUpload;
                                }
                                if (backupToImport.timePublish) {
                                    backup.timePublish = backupToImport.timePublish;
                                }
                                if (backupToImport.timeFavorite) {
                                    backupToImport.timeFavorite.forEach(el => {
                                        updateTimeFavoriteInBackup(backup, el.value, el.fid);
                                    });
                                }
                                if (backupToImport.dynamic) {
                                    backupToImport.dynamic.forEach(el => {
                                        updateArrayDataInBackup(backup, 'dynamic', el.value, el.ts, el.from);
                                    });
                                }
                                if (backupToImport.pages) {
                                    backupToImport.pages.forEach(el => {
                                        updatePagesInBackup(backup, el.index, el.title, el.firstFrame, el.thumbnails, el.cid, el.ts, el.from);
                                    });
                                }
                                ['api', 'apiExtra', 'biliplus', 'biliplusExtra', 'jijidown', 'jijidownExtra', 'xbeibeix', 'xbeibeixExtra'].forEach(key => {
                                    if (backupToImport[key]) {
                                        if (!backup[key]) {
                                            backup[key] = { value: backupToImport[key].value, ts: backupToImport[key].ts };
                                        } else {
                                            if (backup[key].ts < backupToImport[key].ts) {
                                                backup[key].value = backupToImport[key].value;
                                                backup[key].ts = backupToImport[key].ts;
                                            }
                                        }
                                    }
                                });
                                const tempBackup = {};
                                for (const key of keys) {
                                    tempBackup[key] = backup[key];
                                }
                                GM_setValue(BVOfBackupToImport, tempBackup);

                            } catch (error) {
                                addMessage({ msg: `导入${BVOfBackupToImport}失败`, border: 'red' });
                                if (error instanceof Error) {
                                    addMessage({ msg: error.stack, small: true })
                                    console.error(error);
                                } else {
                                    addMessage({ msg: error[0], small: true });
                                    for (let i = 1; i < error.length; i++) {
                                        addMessage({ msg: error[i], small: true })
                                    }
                                }
                                console.error('需要导入的数据');
                                console.error(backupToImport);
                                console.error('本地已有的数据');
                                console.error(GM_getValue(BVOfBackupToImport, {}));
                            }
                        }

                        addMessage({ msg: '导入完成', border: 'green' });

                    } catch (error) {
                        catchUnknownError(error);
                    }
                };

                reader.readAsText(file);

            } catch (error) {
                catchUnknownError(error);
            }
        });

        const divButtonGetFromApiLegacy = document.createElement('div');
        divButtonGetFromApiLegacy.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-advanced');
        divButtonGetFromApiLegacy.setAttribute('title',
            '地址: https://api.bilibili.com/medialist/gateway/base/spaceDetail?media_id={收藏夹fid}&pn={页码}&ps={每页展示视频数量}\n' +
            '数据: AV号, 标题 (失效视频无法获取), 简介 (仅能获取前255个字符), 封面地址 (失效视频无法获取), UP主UID, UP主昵称, UP主头像地址, 上传时间, 发布时间, 添加到当前收藏夹的时间, 每个分集的标题, cid (均为最新版本)\n' +
            '此功能将会从旧版B站接口获取当前收藏夹内所有视频的数据。与目前的B站接口相比, 旧版接口可以获取到每个分集的标题和cid, 无论视频是否失效。\n' +
            '您需要将当前收藏夹设置为公开后才能获取到数据。如果收藏夹内第一个视频不是失效视频, 修改可见性会导致收藏夹的封面被固定为该视频的封面, 建议修改可见性之前先复制一个失效视频到当前收藏夹的首位。');
        divControls.appendChild(divButtonGetFromApiLegacy);

        const buttonGetFromApiLegacy = document.createElement('button');
        buttonGetFromApiLegacy.type = 'button';
        buttonGetFromApiLegacy.classList.add('backup-button' + classAppendNewFreshSpace);
        buttonGetFromApiLegacy.textContent = '从旧版B站接口获取数据';
        buttonGetFromApiLegacy.addEventListener('click', async () => {
            try {
                clearMessage();

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
                    } else if (settings.defaultFavlistFid && settings.defaultUID === parseInt(location.href.match(getUIDFromURLRegex)[1], 10)) {
                        fid = settings.defaultFavlistFid;
                    } else {
                        throw ['无法获取当前收藏夹的fid, 刷新页面可能有帮助'];
                    }

                } else {
                    fid = parseInt(currentFavlist.getAttribute('fid'), 10);
                }

                let pageNumber = 1;
                let count = 0;
                while (true) {
                    const response = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: `https://api.bilibili.com/medialist/gateway/base/spaceDetail?media_id=${fid}&pn=${pageNumber}&ps=20&keyword=&order=mtime&type=0&tid=0&jsonp=jsonp`,
                            timeout: 1000 * settings.requestTimeout,
                            responseType: 'json',
                            onload: (res) => resolve(res),
                            onerror: (res) => reject(['请求失败', 'api.bilibili.com/medialist/gateway/base/spaceDetail', res.error]),
                            ontimeout: () => reject(['请求超时', 'api.bilibili.com/medialist/gateway/base/spaceDetail'])
                        });
                    });
                    if (response.status !== 200) {
                        throw ['请求失败', 'api.bilibili.com/medialist/gateway/base/spaceDetail', `${response.status} ${response.statusText}`];
                    }
                    if (debug) console.log('getFromApiLegacy', response.response);

                    if (response.response.code === -403 || response.response.code === 7201004) {
                        throw ['不支持处理私密收藏夹'];
                    } else if (response.response.code) {
                        throw ['发生未知错误, 请反馈该问题', JSON.stringify(response.response)];
                    }

                    if (!response.response.data.medias) {
                        addMessage({ msg: '已完成', border: 'green' });
                        return;
                    }

                    response.response.data.medias.forEach(media => {
                        const backup = GM_getValue(media.bvid, {
                            BV: null,
                            AV: null,
                            title: null,
                            intro: null,
                            cover: null,
                            upperUID: null,
                            upperName: null,
                            upperAvatar: null,
                            timeUpload: null,
                            timePublish: null,
                            timeFavorite: null,
                            dynamic: null,
                            pages: null,
                            api: null,
                            apiExtra: null,
                            biliplus: null,
                            biliplusExtra: null,
                            jijidown: null,
                            jijidownExtra: null,
                            xbeibeix: null,
                        });

                        formatBackup(backup);

                        let disabled = false;
                        if (media.cover.includes('be27fd62c99036dce67efface486fb0a88ffed06')) {
                            disabled = true;
                        }

                        backup.BV ??= media.bvid;
                        backup.AV ??= media.id;

                        if (!disabled) {
                            updateArrayDataInBackup(backup, 'title', media.title, getCurrentTs(), 'api.bilibili.com/medialist/gateway/base/spaceDetail');
                            updateArrayDataInBackup(backup, 'cover', media.cover, getCurrentTs(), 'api.bilibili.com/medialist/gateway/base/spaceDetail');
                        }
                        updateArrayDataInBackup(backup, 'intro', media.intro, getCurrentTs(), 'api.bilibili.com/medialist/gateway/base/spaceDetail');

                        backup.upperUID ??= media.upper.mid;
                        updateArrayDataInBackup(backup, 'upperName', media.upper.name, getCurrentTs(), 'api.bilibili.com/medialist/gateway/base/spaceDetail');
                        updateArrayDataInBackup(backup, 'upperAvatar', media.upper.face, getCurrentTs(), 'api.bilibili.com/medialist/gateway/base/spaceDetail');

                        backup.timeUpload ??= media.ctime;
                        backup.timePublish ??= media.pubtime;
                        updateTimeFavoriteInBackup(backup, media.fav_time, fid);

                        if (Array.isArray(media.pages)) {
                            media.pages.forEach(el => {
                                updatePagesInBackup(backup, el.page, el.title, undefined, undefined, el.id, getCurrentTs(), 'api.bilibili.com/medialist/gateway/base/spaceDetail');
                            });
                        } else {
                            if (debug) {
                                addMessage({ msg: 'getFromApiLegacy 无pages', border: 'red' });
                                addMessage({ msg: `BV号: ${media.bvid} 标题: ${media.title.slice(0, 10)}`, small: true });
                                console.warn('getFromApiLegacy 无pages');
                                console.warn(`BV号: ${media.bvid} 标题: ${media.title.slice(0, 10)}`);
                            }
                        }

                        const tempBackup = {};
                        for (const key of keys) {
                            tempBackup[key] = backup[key];
                        }
                        GM_setValue(media.bvid, tempBackup);
                    });

                    count += response.response.data.medias.length;
                    addMessage({ msg: `已处理视频个数: ${count}`, small: true, scrollIntoView: false });
                    pageNumber++;
                }

            } catch (error) {
                if (error instanceof Error) {
                    catchUnknownError(error);
                } else {
                    addMessage({ msg: error[0], border: 'red' })
                    for (let i = 1; i < error.length; i++) {
                        addMessage({ msg: error[i], small: true })
                    }
                }
            }
        });
        divButtonGetFromApiLegacy.appendChild(buttonGetFromApiLegacy);

        if (debug) {
            const divButton = document.createElement('div');
            divButton.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-advanced');
            divControls.appendChild(divButton);

            const button = document.createElement('button');
            button.type = 'button';
            button.classList.add('backup-button' + classAppendNewFreshSpace);
            button.textContent = '清空提示信息';
            button.addEventListener('click', () => {
                try {
                    clearMessage();
                } catch (error) {
                    catchUnknownError(error);
                }
            });
            divButton.appendChild(button);
        }

        if (debug) {
            const divButton = document.createElement('div');
            divButton.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-advanced');
            divControls.appendChild(divButton);

            const button = document.createElement('button');
            button.type = 'button';
            button.classList.add('backup-button' + classAppendNewFreshSpace);
            button.textContent = '重置timeFavorite';
            button.addEventListener('click', () => {
                try {
                    const backups = GM_getValues(GM_listValues());
                    delete backups.settings;
                    for (const BVOfBackup in backups) {
                        const backup = backups[BVOfBackup];
                        backup.timeFavorite = null;
                        GM_setValue(BVOfBackup, backup);
                    }
                    addMessage({ msg: '已完成', border: 'green' });

                } catch (error) {
                    catchUnknownError(error);
                }
            });
            divButton.appendChild(button);
        }

        if (debug) {
            const divButton = document.createElement('div');
            divButton.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-advanced');
            divControls.appendChild(divButton);

            const button = document.createElement('button');
            button.type = 'button';
            button.classList.add('backup-button' + classAppendNewFreshSpace);
            button.textContent = '删除timeFavorite为null';
            button.addEventListener('click', () => {
                try {
                    const backups = GM_getValues(GM_listValues());
                    delete backups.settings;
                    for (const BVOfBackup in backups) {
                        if (!backups[BVOfBackup].timeFavorite) {
                            GM_deleteValue(BVOfBackup);
                        }
                    }
                    addMessage({ msg: '已完成', border: 'green' });

                } catch (error) {
                    catchUnknownError(error);
                }
            });
            divButton.appendChild(button);
        }

        if (debug) {
            const divButton = document.createElement('div');
            divButton.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-advanced');
            divControls.appendChild(divButton);

            const button = document.createElement('button');
            button.type = 'button';
            button.classList.add('backup-button' + classAppendNewFreshSpace);
            button.textContent = '保留timeFavorite为null';
            button.addEventListener('click', () => {
                try {
                    const backups = GM_getValues(GM_listValues());
                    delete backups.settings;
                    for (const BVOfBackup in backups) {
                        if (backups[BVOfBackup].timeFavorite) {
                            GM_deleteValue(BVOfBackup);
                        }
                    }
                    addMessage({ msg: '已完成', border: 'green' });

                } catch (error) {
                    catchUnknownError(error);
                }
            });
            divButton.appendChild(button);
        }

        if (debug) {
            const divButton = document.createElement('div');
            divButton.classList.add('backup-div-first' + classAppendNewFreshSpace, 'backup-advanced');
            divControls.appendChild(divButton);

            const button = document.createElement('button');
            button.type = 'button';
            button.classList.add('backup-button' + classAppendNewFreshSpace);
            button.textContent = '清空本地备份数据';
            button.addEventListener('click', () => {
                try {
                    const backups = GM_getValues(GM_listValues());
                    delete backups.settings;
                    for (const BVOfBackup in backups) {
                        GM_deleteValue(BVOfBackup);
                    }
                    addMessage({ msg: '已完成', border: 'green' });

                } catch (error) {
                    catchUnknownError(error);
                }
            });
            divButton.appendChild(button);
        }

        const divButtonStopProcessing = document.createElement('div');
        divButtonStopProcessing.classList.add('backup-div-first' + classAppendNewFreshSpace);
        divButtonStopProcessing.setAttribute('title',
            '此功能适用于脚本处理视频时反复出现问题的情况。');
        divControls.appendChild(divButtonStopProcessing);

        const buttonStopProcessing = document.createElement('button');
        buttonStopProcessing.type = 'button';
        buttonStopProcessing.classList.add('backup-button' + classAppendNewFreshSpace);
        buttonStopProcessing.textContent = '停止处理当前页视频';
        buttonStopProcessing.addEventListener('click', () => {
            try {
                abortActiveControllers();
            } catch (error) {
                catchUnknownError(error);
            }
        });
        divButtonStopProcessing.appendChild(buttonStopProcessing);

        divMessage = document.createElement('div');
        divMessage.classList.add('backup-divMessage' + classAppendNewFreshSpace);
        divControls.appendChild(divMessage);

        if (updates.length > 1) {
            updates.forEach(el => {
                addMessage({ msg: el, small: el.startsWith('版本'), scrollIntoView: false });
            });
        }

        if (!settings.defaultUID || settings.defaultUID === parseInt(location.href.match(getUIDFromURLRegex)[1], 10) || settings.processOthersFavlist) {
            divLabelProcessNormal.classList.remove('backup-disabled' + classAppendNewFreshSpace);
            divLabelProcessDisabled.classList.remove('backup-disabled' + classAppendNewFreshSpace);
            if (settings.processNormal || settings.processDisabled) {
                divLabelGetFromApi.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                if (settings.getFromApi) {
                    divLabelGetFromApiUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromApiUpdate) {
                        divLabelGetFromApiUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    }
                    divLabelGetFromApiExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromApiExtra) {
                        divLabelGetFromApiExtraThumbnails.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromApiExtraDelay.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        divLabelGetFromApiExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromApiExtraUpdate) {
                            divLabelGetFromApiExtraUpdatePart.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            divLabelGetFromApiExtraUpdateAll.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            if (settings.getFromApiExtraUpdateAll) {
                                divLabelGetFromApiExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            }
                        }
                    }
                }
                divLabelGetFromBiliplus.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                if (settings.getFromBiliplus) {
                    divLabelGetFromBiliplusUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromBiliplusUpdate) {
                        divLabelGetFromBiliplusUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    }
                    divLabelGetFromBiliplusURL1.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromBiliplusURL2.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromApi && settings.getFromBiliplus) {
                        divLabelGetFromBiliplusExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromBiliplusExtra) {
                            divLabelGetFromBiliplusExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            if (settings.getFromBiliplusExtraUpdate) {
                                divLabelGetFromBiliplusExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                            }
                        }
                    }
                }
                divLabelGetFromJijidown.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                if (settings.getFromJijidown) {
                    divLabelGetFromJijidownUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromJijidownUpdate) {
                        divLabelGetFromJijidownUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    }
                    divLabelGetFromJijidownExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromJijidownExtra) {
                        divLabelGetFromJijidownExtraUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        if (settings.getFromJijidownExtraUpdate) {
                            divLabelGetFromJijidownExtraUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                        }
                    }
                    divLabelGetFromJijidownURL1.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromJijidownURL2.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                }
                divLabelGetFromXbeibeix.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                if (settings.getFromXbeibeix) {
                    divLabelGetFromXbeibeixUpdate.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    if (settings.getFromXbeibeixUpdate) {
                        divLabelGetFromXbeibeixUpdateInterval.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    }
                    divLabelGetFromXbeibeixURL1.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixURL2.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixURL3.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                    divLabelGetFromXbeibeixExtra.classList.remove('backup-disabled' + classAppendNewFreshSpace);
                }
            }
        }

        if (!settings.displayAdvancedControls) {
            divControls.querySelectorAll('.backup-advanced').forEach(el => {
                el.classList.add('backup-hidden' + classAppendNewFreshSpace);
            });
        }
    }

    function appendDropdowns(dropdownContainer, BV, counts) {

        try {
            if (newFreshSpace) {
                if (dropdownContainer.childElementCount === 1) {
                    return;
                }

                const biliCardDropdownVisible = document.querySelectorAll('div.bili-card-dropdown--visible');
                if (biliCardDropdownVisible.length !== 1) {
                    addMessage({ msg: '下拉列表开关不存在或不唯一, 无法确定下拉列表所对应的视频, 刷新页面可能有帮助', border: 'red' });
                    return;
                }

                let divTargetVideo;
                try {
                    divTargetVideo = document.querySelector('div.items__item:has(div.bili-card-dropdown--visible)');
                } catch {
                    const items = document.querySelectorAll('div.items__item');
                    for (const item of items) {
                        if (item.contains(biliCardDropdownVisible[0])) {
                            divTargetVideo = item;
                            break;
                        }
                    }
                }
                if (!divTargetVideo) {
                    addMessage({ msg: '无法确定下拉列表所对应的视频, 请反馈该问题', border: 'red' });
                    return;
                }

                if (divTargetVideo.querySelector('div.bili-cover-card__tags')) {
                    if (debug) console.log('不处理特殊视频');
                    return;
                }

                if (!settings.processNormal && divTargetVideo.querySelector('div.bili-cover-card__stats')) {
                    return;
                }
                if (!settings.processDisabled && !divTargetVideo.querySelector('div.bili-cover-card__stats')) {
                    return;
                }

                const getBVFromURLMatch = biliCardDropdownVisible[0].parentNode.querySelector('a').getAttribute('href').match(getBVFromURLRegex);
                if (!getBVFromURLMatch) {
                    addMessage({ msg: '无法获取该视频的BV号, 请检查是否有其他脚本或插件修改了该视频封面和标题的链接地址, 并将其关闭', border: 'red' });
                    return;
                }
                BV = getBVFromURLMatch[1];

                const countsSplit = divTargetVideo.getAttribute('backup-counts')?.split(',');
                if (countsSplit) {
                    counts = { countCover: Number(countsSplit[0]), countFirstFrame: Number(countsSplit[1]), countThumbnails: Number(countsSplit[2]), countUpperAvatar: Number(countsSplit[3]) };
                } else {
                    const backup = GM_getValue(BV, {});
                    let countCover = 0;
                    let countFirstFrame = 0;
                    let countThumbnails = 0;
                    let countUpperAvatar = 0;
                    countCover = backup.cover?.length ?? 0;
                    backup.pages?.forEach(el => {
                        countFirstFrame += el.firstFrame ? 1 : 0;
                        countThumbnails += el.thumbnails?.length ?? 0;
                    });
                    countUpperAvatar = backup.upperAvatar?.length ?? 0;
                    counts = { countCover, countFirstFrame, countThumbnails, countUpperAvatar };
                    divTargetVideo.setAttribute('backup-counts', `${countCover},${countFirstFrame},${countThumbnails},${countUpperAvatar}`);
                }

            } else {
                if (dropdownContainer.lastElementChild.classList.contains('backup-appendDropdown')) {
                    return;
                }
                if (settings.appendDropdownsOrder) {
                    dropdownContainer.lastElementChild.classList.add('be-dropdown-item-delimiter');
                }
            }

            let confirmCover = counts.countCover < 10;
            let confirmFirstFrame = counts.countFirstFrame < 10;
            let confirmThumbnails = counts.countThumbnails < 10;
            let confirmUpperAvatar = counts.countUpperAvatar < 10;
            let confirmReset = false;

            for (const el of settings.appendDropdownsOrder) {
                switch (el) {
                    case 'a':
                        const dropdownLocal = document.createElement(newFreshSpace ? 'div' : 'li');
                        dropdownLocal.classList.add(newFreshSpace ? 'bili-card-dropdown-popper__item' : 'be-dropdown-item');
                        if (!newFreshSpace) {
                            dropdownLocal.classList.add('backup-appendDropdown');
                        }
                        dropdownLocal.setAttribute('title',
                            '查看该视频的本地备份数据');
                        dropdownLocal.textContent = '本地备份数据';
                        dropdownLocal.addEventListener('click', () => {
                            try {
                                if (newFreshSpace) {
                                    dropdownContainer.classList.remove('visible');
                                }
                                GM_openInTab('data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(GM_getValue(BV, {}))), { active: true, insert: false, setParent: true });

                            } catch (error) {
                                catchUnknownError(error);
                            }
                        });
                        dropdownContainer.appendChild(dropdownLocal);
                        break;

                    case 'b':
                        const dropdownCover = document.createElement(newFreshSpace ? 'div' : 'li');
                        dropdownCover.classList.add(newFreshSpace ? 'bili-card-dropdown-popper__item' : 'be-dropdown-item');
                        if (!newFreshSpace) {
                            dropdownCover.classList.add('backup-appendDropdown');
                        }
                        dropdownCover.setAttribute('title',
                            '查看该视频所有版本的封面原图');
                        dropdownCover.textContent = `封面原图${counts.countCover}`;
                        dropdownCover.addEventListener('click', (event) => {
                            try {
                                if (confirmCover) {
                                    if (newFreshSpace) {
                                        dropdownContainer.classList.remove('visible');
                                    }
                                    let first = true;
                                    GM_getValue(BV, {}).cover?.forEach(el => {
                                        GM_openInTab(el.value, { active: first, insert: false, setParent: true });
                                        first = false;
                                    });

                                } else {
                                    if (!newFreshSpace) {
                                        event.stopPropagation();
                                    }
                                    confirmCover = true;
                                    dropdownCover.textContent = `${counts.countCover}个标签页`;
                                    setTimeout(() => {
                                        dropdownCover.textContent = '确定打开?';
                                        setTimeout(() => {
                                            confirmCover = false;
                                            dropdownCover.textContent = `封面原图${counts.countCover}`;
                                        }, 1000);
                                    }, 1000);
                                }

                            } catch (error) {
                                catchUnknownError(error);
                            }
                        });
                        dropdownContainer.appendChild(dropdownCover);
                        break;

                    case 'c':
                        const dropdownFirstFrame = document.createElement(newFreshSpace ? 'div' : 'li');
                        dropdownFirstFrame.classList.add(newFreshSpace ? 'bili-card-dropdown-popper__item' : 'be-dropdown-item');
                        if (!newFreshSpace) {
                            dropdownFirstFrame.classList.add('backup-appendDropdown');
                        }
                        dropdownFirstFrame.setAttribute('title',
                            '查看该视频每个分集的首帧截图');
                        dropdownFirstFrame.textContent = `首帧截图${counts.countFirstFrame}`;
                        dropdownFirstFrame.addEventListener('click', (event) => {
                            try {
                                if (confirmFirstFrame) {
                                    if (newFreshSpace) {
                                        dropdownContainer.classList.remove('visible');
                                    }
                                    let first = true;
                                    GM_getValue(BV, {}).pages?.forEach(el => {
                                        if (el.firstFrame) {
                                            GM_openInTab(el.firstFrame, { active: first, insert: false, setParent: true });
                                            first = false;
                                        }
                                    });

                                } else {
                                    if (!newFreshSpace) {
                                        event.stopPropagation();
                                    }
                                    confirmFirstFrame = true;
                                    dropdownFirstFrame.textContent = `${counts.countFirstFrame}个标签页`;
                                    setTimeout(() => {
                                        dropdownFirstFrame.textContent = '确定打开?';
                                        setTimeout(() => {
                                            confirmFirstFrame = false;
                                            dropdownFirstFrame.textContent = `首帧截图${counts.countFirstFrame}`;
                                        }, 1000);
                                    }, 1000);
                                }

                            } catch (error) {
                                catchUnknownError(error);
                            }
                        });
                        dropdownContainer.appendChild(dropdownFirstFrame);
                        break;

                    case 'd':
                        const dropdownThumbnails = document.createElement(newFreshSpace ? 'div' : 'li');
                        dropdownThumbnails.classList.add(newFreshSpace ? 'bili-card-dropdown-popper__item' : 'be-dropdown-item');
                        if (!newFreshSpace) {
                            dropdownThumbnails.classList.add('backup-appendDropdown');
                        }
                        dropdownThumbnails.setAttribute('title',
                            '查看该视频每个分集的进度条缩略图');
                        dropdownThumbnails.textContent = `进度略图${counts.countThumbnails}`;
                        dropdownThumbnails.addEventListener('click', (event) => {
                            try {
                                if (confirmThumbnails) {
                                    if (newFreshSpace) {
                                        dropdownContainer.classList.remove('visible');
                                    }
                                    let first = true;
                                    GM_getValue(BV, {}).pages?.forEach(el => {
                                        el.thumbnails?.forEach(ele => {
                                            GM_openInTab(ele, { active: first, insert: false, setParent: true });
                                            first = false;
                                        });
                                    });

                                } else {
                                    if (!newFreshSpace) {
                                        event.stopPropagation();
                                    }
                                    confirmThumbnails = true;
                                    dropdownThumbnails.textContent = `${counts.countThumbnails}个标签页`;
                                    setTimeout(() => {
                                        dropdownThumbnails.textContent = '确定打开?';
                                        setTimeout(() => {
                                            confirmThumbnails = false;
                                            dropdownThumbnails.textContent = `进度略图${counts.countThumbnails}`;
                                        }, 1000);
                                    }, 1000);
                                }

                            } catch (error) {
                                catchUnknownError(error);
                            }
                        });
                        dropdownContainer.appendChild(dropdownThumbnails);
                        break;

                    case 'e':
                        const dropdownUpperAvatar = document.createElement(newFreshSpace ? 'div' : 'li');
                        dropdownUpperAvatar.classList.add(newFreshSpace ? 'bili-card-dropdown-popper__item' : 'be-dropdown-item');
                        if (!newFreshSpace) {
                            dropdownUpperAvatar.classList.add('backup-appendDropdown');
                        }
                        dropdownUpperAvatar.setAttribute('title',
                            '查看该视频所有版本的UP主头像');
                        dropdownUpperAvatar.textContent = `UP主头像${counts.countUpperAvatar}`;
                        dropdownUpperAvatar.addEventListener('click', (event) => {
                            try {
                                if (confirmUpperAvatar) {
                                    if (newFreshSpace) {
                                        dropdownContainer.classList.remove('visible');
                                    }
                                    let first = true;
                                    GM_getValue(BV, {}).upperAvatar?.forEach(el => {
                                        GM_openInTab(el.value, { active: first, insert: false, setParent: true });
                                        first = false;
                                    });

                                } else {
                                    if (!newFreshSpace) {
                                        event.stopPropagation();
                                    }
                                    confirmUpperAvatar = true;
                                    dropdownUpperAvatar.textContent = `${counts.countUpperAvatar}个标签页`;
                                    setTimeout(() => {
                                        dropdownUpperAvatar.textContent = '确定打开?';
                                        setTimeout(() => {
                                            confirmUpperAvatar = false;
                                            dropdownUpperAvatar.textContent = `UP主头像${counts.countUpperAvatar}`;
                                        }, 1000);
                                    }, 1000);
                                }

                            } catch (error) {
                                catchUnknownError(error);
                            }
                        });
                        dropdownContainer.appendChild(dropdownUpperAvatar);
                        break;

                    case 'f':
                        const dropdownJump = document.createElement(newFreshSpace ? 'div' : 'li');
                        dropdownJump.classList.add(newFreshSpace ? 'bili-card-dropdown-popper__item' : 'be-dropdown-item');
                        if (!newFreshSpace) {
                            dropdownJump.classList.add('backup-appendDropdown');
                        }
                        dropdownJump.setAttribute('title',
                            '同时打开该视频在BiliPlus, 唧唧, 贝贝工具站的原始页面');
                        dropdownJump.textContent = '跳转至BJX';
                        dropdownJump.addEventListener('click', () => {
                            try {
                                if (newFreshSpace) {
                                    dropdownContainer.classList.remove('visible');
                                }
                                GM_openInTab(`https://www.biliplus.com/video/${BV}`, { active: true, insert: false, setParent: true });
                                GM_openInTab(`https://${settings.getFromJijidownURL}/video/${BV}`, { active: false, insert: false, setParent: true });
                                GM_openInTab(`https://${settings.getFromXbeibeixURL}/video/${BV}`, { active: false, insert: false, setParent: true });

                            } catch (error) {
                                catchUnknownError(error);
                            }
                        });
                        dropdownContainer.appendChild(dropdownJump);
                        break;

                    case 'g':
                        const dropdownReset = document.createElement(newFreshSpace ? 'div' : 'li');
                        dropdownReset.classList.add(newFreshSpace ? 'bili-card-dropdown-popper__item' : 'be-dropdown-item');
                        if (!newFreshSpace) {
                            dropdownReset.classList.add('backup-appendDropdown');
                        }
                        dropdownReset.setAttribute('title',
                            '如果该视频的本地备份数据出现错乱, 请使用此功能将其删除以便重新备份该视频。\n' +
                            '如果您想删除脚本内所有已保存的数据, 请依次点击: Tampermonkey > 管理面板 >\n' +
                            '哔哩哔哩(B站|Bilibili)收藏夹Fix (备份视频信息) > 开发者 > 重置到出厂。');
                        dropdownReset.textContent = '重置备份数据';
                        dropdownReset.addEventListener('click', (event) => {
                            try {
                                if (confirmReset) {
                                    if (newFreshSpace) {
                                        dropdownContainer.classList.remove('visible');
                                    }
                                    GM_deleteValue(BV);

                                } else {
                                    if (!newFreshSpace) {
                                        event.stopPropagation();
                                    }
                                    confirmReset = true;
                                    dropdownReset.textContent = '确定删除?';
                                    setTimeout(() => {
                                        confirmReset = false;
                                        dropdownReset.textContent = '重置备份数据';
                                    }, 1000);
                                }

                            } catch (error) {
                                catchUnknownError(error);
                            }
                        });
                        dropdownContainer.appendChild(dropdownReset);
                        break;

                    default:
                }
            }

        } catch (error) {
            catchUnknownError(error);
        }
    }

    async function getFromApi(AVBVTitle, backup, spanA, getFromApiResponse, fid, pageNumber, disabled, searchType, getFromApiExtraNeeded, setValueNeeded) {

        if (!getFromApiResponse.value) {
            const urlWithParams = await appendParamsForGetFromApi(fid, pageNumber, pageSize);
            if (!urlWithParams) {
                return 'return';
            }
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: urlWithParams,
                    timeout: 1000 * settings.requestTimeout,
                    responseType: 'json',
                    onload: (res) => resolve(res),
                    onerror: (res) => reject(['请求失败', 'api.bilibili.com/x/v3/fav/resource/list', res.error]),
                    ontimeout: () => reject(['请求超时', 'api.bilibili.com/x/v3/fav/resource/list'])
                });
            });
            if (response.status !== 200) {
                throw ['请求失败', 'api.bilibili.com/x/v3/fav/resource/list', `${response.status} ${response.statusText}`];
            }
            if (debug) console.log('getFromApi', response.response);
            getFromApiResponse.value = response.response?.data?.medias ?? [];
        }

        const found = getFromApiResponse.value.find?.(el => el.bvid === AVBVTitle.BV);
        if (!found) {
            if (debug) {
                addMessage({ msg: 'getFromApi 从B站接口获取的数据中没有该视频', border: 'red' });
                addMessage({ msg: `BV号: ${AVBVTitle.BV} 标题: ${AVBVTitle.title.slice(0, 10)}`, small: true });
                console.warn('getFromApi 从B站接口获取的数据中没有该视频');
            }
            return 'continue';
        }

        if (debug && bv2av(AVBVTitle.BV) !== found.id) {
            addMessage({ msg: 'BV号转AV号算法已失效', border: 'red' });
            console.warn('BV号转AV号算法已失效');
        }

        AVBVTitle.AV ??= found.id;
        backup.AV ??= found.id;

        if (!disabled) {
            updateArrayDataInBackup(backup, 'title', found.title, getCurrentTs(), 'api.bilibili.com/x/v3/fav/resource/list');
            updateArrayDataInBackup(backup, 'cover', found.cover, getCurrentTs(), 'api.bilibili.com/x/v3/fav/resource/list');
        } else {
            if (debug) {
                if (found.title !== '已失效视频') {
                    addMessage({ msg: '失效视频标题已更改', border: 'red' });
                    console.warn('失效视频标题已更改');
                }
                if (!found.cover.includes('be27fd62c99036dce67efface486fb0a88ffed06')) {
                    addMessage({ msg: '失效视频封面已更改', border: 'red' });
                    console.warn('失效视频封面已更改');
                }
            }
        }
        updateArrayDataInBackup(backup, 'intro', found.intro, getCurrentTs(), 'api.bilibili.com/x/v3/fav/resource/list');

        backup.upperUID ??= found.upper.mid;
        updateArrayDataInBackup(backup, 'upperName', found.upper.name, getCurrentTs(), 'api.bilibili.com/x/v3/fav/resource/list');
        updateArrayDataInBackup(backup, 'upperAvatar', found.upper.face, getCurrentTs(), 'api.bilibili.com/x/v3/fav/resource/list');

        if (debug && backup.timeUpload && backup.timeUpload !== found.ctime) {
            addMessage({ msg: 'getFromApi timeUpload 不一致', border: 'red' });
            addMessage({ msg: `旧: ${backup.timeUpload}`, small: true });
            addMessage({ msg: `新: ${found.ctime}`, small: true });
            addMessage({ msg: `BV号: ${AVBVTitle.BV} 标题: ${AVBVTitle.title.slice(0, 10)}`, small: true });
            console.warn('getFromApi timeUpload 不一致');
            console.warn(`旧: ${backup.timeUpload}`);
            console.warn(`新: ${found.ctime}`);
        }
        backup.timeUpload = found.ctime;

        if (debug && backup.timePublish && backup.timePublish !== found.pubtime) {
            addMessage({ msg: 'getFromApi timePublish 不一致', border: 'red' });
            addMessage({ msg: `旧: ${backup.timePublish}`, small: true });
            addMessage({ msg: `新: ${found.pubtime}`, small: true });
            addMessage({ msg: `BV号: ${AVBVTitle.BV} 标题: ${AVBVTitle.title.slice(0, 10)}`, small: true });
            console.warn('getFromApi timePublish 不一致');
            console.warn(`旧: ${backup.timePublish}`);
            console.warn(`新: ${found.pubtime}`);
        }
        backup.timePublish = found.pubtime;

        if (!searchType) {
            updateTimeFavoriteInBackup(backup, found.fav_time, fid);
        }

        if (found.ugc?.first_cid) {
            if (updatePagesInBackup(backup, 1, undefined, undefined, undefined, found.ugc.first_cid, getCurrentTs(), 'api.bilibili.com/x/v3/fav/resource/list')) {
                getFromApiExtraNeeded.value = true;
            }
        } else if (!disabled) {
            if (debug) {
                addMessage({ msg: 'getFromApi 无first_cid', border: 'red' });
                addMessage({ msg: `BV号: ${AVBVTitle.BV} 标题: ${AVBVTitle.title.slice(0, 10)}`, small: true });
                console.warn('getFromApi 无first_cid');
            }
            getFromApiExtraNeeded.value = true;
        }

        if (found.page) {
            if (found.page > 1) {
                getFromApiExtraNeeded.value = true;
            }
        } else if (!disabled) {
            if (debug) {
                addMessage({ msg: 'getFromApi 无page', border: 'red' });
                addMessage({ msg: `BV号: ${AVBVTitle.BV} 标题: ${AVBVTitle.title.slice(0, 10)}`, small: true });
                console.warn('getFromApi 无page');
            }
            getFromApiExtraNeeded.value = true;
        }

        if (!disabled && found.intro.length >= 255) {
            let getIntroNeeded = true;
            if (settings.getFromApiExtra) {
                if (!backup.apiExtra) {
                    getIntroNeeded = false;
                } else if (settings.getFromApiExtraUpdate && settings.getFromApiExtraUpdateAll && getCurrentTs() - backup.apiExtra.ts > 3600 * 24 * settings.getFromApiExtraUpdateInterval) {
                    getIntroNeeded = false;
                } else if (settings.getFromApiExtraUpdate && !settings.getFromApiExtraUpdateAll && getFromApiExtraNeeded.value) {
                    getIntroNeeded = false;
                }
            }

            if (getIntroNeeded) {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://api.bilibili.com/x/web-interface/archive/desc?bvid=${AVBVTitle.BV}`,
                        timeout: 1000 * settings.requestTimeout,
                        responseType: 'json',
                        onload: (res) => resolve(res),
                        onerror: (res) => reject(['请求失败', 'api.bilibili.com/x/web-interface/archive/desc', res.error]),
                        ontimeout: () => reject(['请求超时', 'api.bilibili.com/x/web-interface/archive/desc'])
                    });
                });
                if (response.status !== 200) {
                    throw ['请求失败', 'api.bilibili.com/x/web-interface/archive/desc', `${response.status} ${response.statusText}`];
                }
                if (debug) console.log('getFromApiIntro', response.response);

                updateArrayDataInBackup(backup, 'intro', response.response.data, getCurrentTs(), 'api.bilibili.com/x/web-interface/archive/desc');
            }
        }

        if (disabled) {
            backup.api = { value: false, ts: getCurrentTs() };
            spanA.style.color = '#ff0000';
        } else {
            backup.api = { value: true, ts: getCurrentTs() };
            spanA.style.color = '#00ff00';
        }

        setValueNeeded.value = true;
    }

    async function getFromApiExtra(AVBVTitle, backup, spanA, disabled, setValueNeeded) {

        if (disabled) {
            backup.apiExtra = { value: false, ts: getCurrentTs() };
            spanA.style.color = '#800000';

        } else {
            if (getFromApiExtraDelay) {
                await delay(500);
            }

            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://api.bilibili.com/x/web-interface/view?bvid=${AVBVTitle.BV}`,
                    timeout: 1000 * settings.requestTimeout,
                    responseType: 'json',
                    onload: (res) => resolve(res),
                    onerror: (res) => reject(['请求失败', 'api.bilibili.com/x/web-interface/view', res.error]),
                    ontimeout: () => reject(['请求超时', 'api.bilibili.com/x/web-interface/view'])
                });
            });
            if (response.status !== 200) {
                throw ['请求失败', 'api.bilibili.com/x/web-interface/view', `${response.status} ${response.statusText}`];
            }
            if (debug) console.log('getFromApiExtra', response.response);

            const currentTs = getCurrentTs();

            updateArrayDataInBackup(backup, 'intro', response.response.data.desc, currentTs, 'api.bilibili.com/x/web-interface/view');

            if (response.response.data.desc_v2) {
                let introWithUID = '';
                for (const [index, desc] of response.response.data.desc_v2.entries()) {
                    if (desc.type === 1) {
                        introWithUID = introWithUID + desc.raw_text;
                    } else if (desc.type === 2) {
                        introWithUID = introWithUID + `@${desc.raw_text}{{UID:${desc.biz_id}}}` + (index === response.response.data.desc_v2.length - 1 ? '' : ' ');
                    } else {
                        if (debug) {
                            addMessage({ msg: `getFromApiExtra desc_v2未知type: ${desc.type}`, border: 'red' });
                            addMessage({ msg: `BV号: ${AVBVTitle.BV} 标题: ${AVBVTitle.title.slice(0, 10)}`, small: true });
                            console.warn(`getFromApiExtra desc_v2未知type: ${desc.type}`);
                        }
                    }
                }
                updateArrayDataInBackup(backup, 'intro', introWithUID, currentTs, 'api.bilibili.com/x/web-interface/view');
            }

            updateArrayDataInBackup(backup, 'dynamic', response.response.data.dynamic, getCurrentTs(), 'api.bilibili.com/x/web-interface/view');

            response.response.data.pages?.forEach(el => {
                updatePagesInBackup(backup, el.page, el.part, el.first_frame, undefined, el.cid, getCurrentTs(), 'api.bilibili.com/x/web-interface/view');
            });

            backup.apiExtra = { value: true, ts: getCurrentTs() };
            spanA.style.color = '#008000';
        }

        setValueNeeded.value = true;
    }

    async function getFromApiExtraThumbnails(AVBVTitle, backup, as, controller, setValueNeeded) {
        for (const [index, page] of backup.pages.entries()) {
            if (controller.signal.aborted) {
                throw new DOMException('', 'AbortError');
            }

            if (!page.cid) {
                continue;
            }

            let getThumbnailsNeeded = true;
            if (page.thumbnails) {
                if (true) {
                    getThumbnailsNeeded = false;
                } else {
                    for (const thumbnail of page.thumbnails) {
                        if (thumbnail.includes('videoshotpvhdboss')) {
                            getThumbnailsNeeded = false;
                            break;
                        }
                    }
                }
            }

            if (getThumbnailsNeeded) {
                if (getFromApiExtraThumbnailsSkip.includes(`${backup.AV}_${page.cid}`)) {
                    continue;
                }

                if (backup.pages.length > 10) {
                    as[1].textContent = `获取缩略图${index + 1}/${backup.pages.length} | ${AVBVTitle.title}`;
                }

                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://api.bilibili.com/x/player/videoshot?aid=${backup.AV}&cid=${page.cid}`,
                        timeout: 1000 * settings.requestTimeout,
                        responseType: 'json',
                        onload: (res) => resolve(res),
                        onerror: (res) => reject(['请求失败', 'api.bilibili.com/x/player/videoshot', res.error]),
                        ontimeout: () => reject(['请求超时', 'api.bilibili.com/x/player/videoshot'])
                    });
                });
                if (response.status !== 200) {
                    throw ['请求失败', 'api.bilibili.com/x/player/videoshot', `${response.status} ${response.statusText}`];
                }
                if (debug) console.log('getFromApiExtraThumbnails', response.response);

                if (!response.response.data?.image?.length) {
                    if (debug) {
                        addMessage({ msg: 'getFromApiExtraThumbnails 无法获取thumbnails', border: 'red' });
                        addMessage({ msg: `BV号: ${AVBVTitle.BV} 标题: ${AVBVTitle.title.slice(0, 10)}`, small: true });
                        console.warn('getFromApiExtraThumbnails 无法获取thumbnails');
                    }
                    getFromApiExtraThumbnailsSkip.push(`${backup.AV}_${page.cid}`);
                    continue;
                }

                response.response.data.image.forEach(el => {
                    updatePagesInBackup(backup, undefined, undefined, undefined, el, page.cid, undefined, undefined);
                });

                setValueNeeded.value = true;
            }
        }

        if (backup.pages.length > 10) {
            as[1].textContent = AVBVTitle.title;
        }
    }

    async function getFromBiliplus(AVBVTitle, backup, spanB, as, controller) {

        let json;
        if (settings.getFromBiliplusURL === 'www.biliplus.com/video') {
            const response = await surroundWithRetry(controller, undefined, async () => {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://www.biliplus.com/video/${AVBVTitle.BV}`,
                        timeout: 1000 * settings.requestTimeout,
                        cookiePartition: {
                            topLevelSite: 'https://biliplus.com'
                        },
                        onload: (res) => resolve(res),
                        onerror: (res) => reject(['请求失败', settings.getFromBiliplusURL, res.error]),
                        ontimeout: () => reject(['请求超时', settings.getFromBiliplusURL])
                    });
                });
                if (debug) console.debug('getFromBiliplus', response);
                if (response.status === 403) {
                    if (settings.autoDisableGetFromBJX) {
                        addMessage({ msg: '需要进行人机验证, 手动访问一次BiliPlus的原始页面可能有帮助', border: 'red' });
                        addMessage({ msg: '请求失败', small: true });
                        addMessage({ msg: settings.getFromBiliplusURL, small: true });
                        addMessage({ msg: `${response.status} ${response.statusText}`, small: true });
                        if (settings.getFromBiliplus) {
                            checkboxGetFromBiliplus.click();
                            addMessage({ msg: '已自动关闭从BiliPlus获取数据', small: true });
                        }
                        return;
                    } else {
                        throw ['需要进行人机验证, 手动访问一次BiliPlus的原始页面可能有帮助', '请求失败', `${settings.getFromXbeibeixURL}/video`, `${response.status} ${response.statusText}`];
                    }
                } else if (response.status !== 200) {
                    throw ['请求失败', settings.getFromBiliplusURL, `${response.status} ${response.statusText}`];
                }
                return response;
            });
            if (!response) {
                return;
            }
            if (debug) console.debug('getFromBiliplus', response.responseXML);

            const getJsonFromBiliplusMatch = response.response.match(getJsonFromBiliplusRegex);
            if (getJsonFromBiliplusMatch) {
                json = JSON.parse(getJsonFromBiliplusMatch[1]);
            }

        } else {
            const response = await surroundWithRetry(controller, async () => {
                if (getFromBiliplusCounter > 350) {
                    as[1].textContent = `${getFromBiliplusCounter - 350}秒后从BiliPlus获取数据 | ${AVBVTitle.title}`;
                    await new Promise((resolve, reject) => {
                        const timer = setInterval(() => {
                            if (controller.signal.aborted) {
                                clearInterval(timer);
                                reject(new DOMException('', 'AbortError'));
                                return;
                            }
                            if (getFromBiliplusCounter <= 350) {
                                clearInterval(timer);
                                resolve();
                                return;
                            }
                            as[1].textContent = `${getFromBiliplusCounter - 350}秒后从BiliPlus获取数据 | ${AVBVTitle.title}`;
                        }, 1000);
                    });
                    as[1].textContent = AVBVTitle.title;
                }

            }, async () => {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://www.biliplus.com/api/view?id=${AVBVTitle.BV}`,
                        timeout: 1000 * settings.requestTimeout,
                        responseType: 'json',
                        onload: (res) => resolve(res),
                        onerror: (res) => reject(['请求失败', settings.getFromBiliplusURL, res.error]),
                        ontimeout: () => reject(['请求超时', settings.getFromBiliplusURL])
                    });
                });
                if (debug) console.debug('getFromBiliplus', response);
                if (response.status === 503) {
                    getFromBiliplusCounter = 372;
                    throw ['从BiliPlus获取数据的频率过快'];
                } else if (response.status !== 200) {
                    throw ['请求失败', settings.getFromBiliplusURL, `${response.status} ${response.statusText}`];
                }
                getFromBiliplusCounter += 12;
                return response;
            });
            json = response.response;
        }
        if (debug) console.log('getFromBiliplus', json);

        if (!json) {
            if (debug) {
                addMessage({ msg: 'getFromBiliplus 获取数据为空', border: 'red' });
                addMessage({ msg: `BV号: ${AVBVTitle.BV} 标题: ${AVBVTitle.title.slice(0, 10)}`, small: true });
                console.warn('getFromBiliplus 获取数据为空');
            }
        }

        if (json?.title) {
            if (!json.lastupdatets) {
                if (!json.lastupdate) {
                    throw ['从BiliPlus获取的数据中无备份时间, 请反馈该问题'];
                }
                if (!localeTimeStringRegex.test(json.lastupdate)) {
                    throw ['从BiliPlus获取的数据中备份时间不符合规范, 请反馈该问题'];
                }
                if (isNaN(new Date(json.lastupdate).getTime())) {
                    throw ['从BiliPlus获取的数据中备份时间不符合规范, 请反馈该问题'];
                }
                json.lastupdatets = new Date(json.lastupdate).getTime() / 1000;
            }

            updateArrayDataInBackup(backup, 'title', json.title, json.lastupdatets, settings.getFromBiliplusURL);
            updateArrayDataInBackup(backup, 'intro', json.description, json.lastupdatets, settings.getFromBiliplusURL);
            updateArrayDataInBackup(backup, 'cover', json.pic, json.lastupdatets, settings.getFromBiliplusURL);
            updateArrayDataInBackup(backup, 'upperName', json.author, json.lastupdatets, settings.getFromBiliplusURL);

            if (Array.isArray(json.list)) {
                json.list.forEach(el => {
                    updatePagesInBackup(backup, el.page, el.part, undefined, undefined, el.cid, json.lastupdatets, settings.getFromBiliplusURL);
                });
            }

            if (json.v2_app_api) {
                updateArrayDataInBackup(backup, 'title', json.v2_app_api.title, json.lastupdatets, settings.getFromBiliplusURL);
                updateArrayDataInBackup(backup, 'intro', json.v2_app_api.desc, json.lastupdatets, settings.getFromBiliplusURL);
                updateArrayDataInBackup(backup, 'cover', json.v2_app_api.pic, json.lastupdatets, settings.getFromBiliplusURL);
                updateArrayDataInBackup(backup, 'upperName', json.v2_app_api.owner?.name, json.lastupdatets, settings.getFromBiliplusURL);
                updateArrayDataInBackup(backup, 'dynamic', json.v2_app_api.dynamic, json.lastupdatets, settings.getFromBiliplusURL);
            }

            backup.biliplus = { value: true, ts: getCurrentTs() };
            spanB.style.color = '#00ff00';

        } else {
            backup.biliplus = { value: false, ts: getCurrentTs() };
            spanB.style.color = '#ff0000';
        }

        if (settings.getFromBiliplusExtra && (!backup.biliplusExtra || (settings.getFromBiliplusExtraUpdate && getCurrentTs() - backup.biliplusExtra.ts > 3600 * 24 * 7 * settings.getFromBiliplusExtraUpdateInterval))) {
            await getFromBiliplusExtra(AVBVTitle, backup, spanB, as, controller);
        }
    }

    async function getFromBiliplusExtra(AVBVTitle, backup, spanB, as, controller) {

        const response = await surroundWithRetry(controller, async () => {
            if (getFromBiliplusCounter > 350) {
                as[1].textContent = `${getFromBiliplusCounter - 350}秒后从BiliPlus获取额外数据 | ${AVBVTitle.title}`;
                await new Promise((resolve, reject) => {
                    const timer = setInterval(() => {
                        if (controller.signal.aborted) {
                            clearInterval(timer);
                            reject(new DOMException('', 'AbortError'));
                            return;
                        }
                        if (getFromBiliplusCounter <= 350) {
                            clearInterval(timer);
                            resolve();
                            return;
                        }
                        as[1].textContent = `${getFromBiliplusCounter - 350}秒后从BiliPlus获取额外数据 | ${AVBVTitle.title}`;
                    }, 1000);
                });
                as[1].textContent = AVBVTitle.title;
            }

        }, async () => {
            const response1 = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://www.biliplus.com/all/video/av${AVBVTitle.AV}/`,
                    timeout: 1000 * settings.requestTimeout,
                    cookiePartition: {
                        topLevelSite: 'https://biliplus.com'
                    },
                    onload: (res) => resolve(res),
                    onerror: (res) => reject(['请求失败', 'www.biliplus.com/all/video', res.error]),
                    ontimeout: () => reject(['请求超时', 'www.biliplus.com/all/video'])
                });
            });
            if (debug) console.debug('getFromBiliplusExtra', response1);
            if (response1.status === 403) {
                if (settings.autoDisableGetFromBJX) {
                    addMessage({ msg: '需要进行人机验证, 手动访问一次BiliPlus的原始页面可能有帮助', border: 'red' });
                    addMessage({ msg: '请求失败', small: true });
                    addMessage({ msg: 'www.biliplus.com/all/video', small: true });
                    addMessage({ msg: `${response1.status} ${response1.statusText}`, small: true });
                    if (settings.getFromBiliplusExtra) {
                        checkboxGetFromBiliplusExtra.click();
                        addMessage({ msg: '已自动关闭从BiliPlus获取额外数据', small: true });
                    }
                    return;
                } else {
                    throw ['需要进行人机验证, 手动访问一次BiliPlus的原始页面可能有帮助', '请求失败', 'www.biliplus.com/all/video', `${response1.status} ${response1.statusText}`];
                }
            } else if (response1.status !== 200) {
                throw ['请求失败', 'www.biliplus.com/all/video', `${response1.status} ${response1.statusText}`];
            }
            if (!response1) {
                return;
            }
            if (debug) console.debug('getFromBiliplusExtra', response1.responseXML);

            const paramsWithSign = response1.response.match(getParamsWithSignFromBiliplusRegex)[1];

            if (controller.signal.aborted) {
                throw new DOMException('', 'AbortError');
            }

            const response2 = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://www.biliplus.com/api/view_all${paramsWithSign}`,
                    timeout: 1000 * settings.requestTimeout,
                    responseType: 'json',
                    cookiePartition: {
                        topLevelSite: 'https://biliplus.com'
                    },
                    onload: (res) => resolve(res),
                    onerror: (res) => reject(['请求失败', 'www.biliplus.com/api/view_all', res.error]),
                    ontimeout: () => reject(['请求超时', 'www.biliplus.com/api/view_all'])
                });
            });
            if (debug) console.debug('getFromBiliplusExtra', response2);
            if (response2.status === 503) {
                getFromBiliplusCounter = 372;
                throw ['从BiliPlus获取额外数据的频率过快'];
            } else if (response2.status !== 200) {
                throw ['请求失败', 'www.biliplus.com/api/view_all', `${response2.status} ${response2.statusText}`];
            }
            getFromBiliplusCounter += 12;
            return response2;
        });
        if (debug) console.log('getFromBiliplusExtra', response.response);

        if (response.response.code === 0) {
            if (!backup.biliplus.value) {
                if (debug) {
                    addMessage({ msg: 'getFromBiliplusExtra 无法获取数据但可获取额外数据', border: 'red' });
                    addMessage({ msg: `BV号: ${AVBVTitle.BV} 标题: ${AVBVTitle.title.slice(0, 10)}`, small: true });
                    console.warn('getFromBiliplusExtra 无法获取数据但可获取额外数据');
                }
            }

            updateArrayDataInBackup(backup, 'title', response.response.data.info.title, undefined, 'www.biliplus.com/api/view_all');
            updateArrayDataInBackup(backup, 'cover', response.response.data.info.pic, undefined, 'www.biliplus.com/api/view_all');
            updateArrayDataInBackup(backup, 'upperName', response.response.data.info.author, undefined, 'www.biliplus.com/api/view_all');

            response.response.data.parts.forEach(el => {
                updatePagesInBackup(backup, el.page, el.part, undefined, undefined, el.cid, undefined, 'www.biliplus.com/api/view_all');
            });

            backup.biliplusExtra = { value: true, ts: getCurrentTs() };
            spanB.style.color = '#008000';

        } else if (response.response.code === -404) {
            backup.biliplusExtra = { value: false, ts: getCurrentTs() };
            spanB.style.color = '#800000';

        } else {
            if (debug) {
                addMessage({ msg: 'getFromBiliplusExtra 未知错误', border: 'red' });
                addMessage({ msg: `BV号: ${AVBVTitle.BV} 标题: ${AVBVTitle.title.slice(0, 10)}`, small: true });
                console.warn('getFromBiliplusExtra 未知错误');
            }

            backup.biliplusExtra = { value: false, ts: getCurrentTs() };
            spanB.style.color = '#800000';
        }
    }

    async function getFromJijidown(AVBVTitle, backup, spanJ, controller) {

        let retryCount = 0;
        while (true) {
            const response = await surroundWithRetry(controller, undefined, async () => {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://${settings.getFromJijidownURL}/api/v1/video_bv/get_info?id=${AVBVTitle.BV.slice(2)}`,
                        timeout: 1000 * settings.requestTimeout,
                        responseType: 'json',
                        onload: (res) => resolve(res),
                        onerror: (res) => reject(['请求失败', `${settings.getFromJijidownURL}/api/v1/video_bv/get_info`, res.error]),
                        ontimeout: () => reject(['请求超时', `${settings.getFromJijidownURL}/api/v1/video_bv/get_info`])
                    });
                });
                if (debug) console.debug('getFromJijidown', response);
                if (response.status !== 200) {
                    throw ['请求失败', `${settings.getFromJijidownURL}/api/v1/video_bv/get_info`, `${response.status} ${response.statusText}`];
                }
                return response;
            });
            if (debug) console.log('getFromJijidown', response.response);

            if (response.response.upid > 0) {
                updateArrayDataInBackup(backup, 'title', response.response.title, response.response.ltime, `${settings.getFromJijidownURL}/api/v1/video_bv/get_info`);
                updateArrayDataInBackup(backup, 'intro', decodeHTMLEntities(response.response.desc?.replaceAll('<br/>', '\n').replaceAll('\r', '\\r')).replaceAll('\\r', '\r'), response.response.ltime, `${settings.getFromJijidownURL}/api/v1/video_bv/get_info`);
                updateArrayDataInBackup(backup, 'cover', response.response.img, response.response.ltime, `${settings.getFromJijidownURL}/api/v1/video_bv/get_info`);
                if (response.response.up.id > 0) {
                    updateArrayDataInBackup(backup, 'upperName', response.response.up.author, response.response.ltime, `${settings.getFromJijidownURL}/api/v1/video_bv/get_info`);
                    updateArrayDataInBackup(backup, 'upperAvatar', response.response.up.avatar, response.response.ltime, `${settings.getFromJijidownURL}/api/v1/video_bv/get_info`);
                }

                backup.jijidown = { value: true, ts: getCurrentTs() };
                spanJ.style.color = '#00ff00';

                if (settings.getFromJijidownExtra && (!backup.jijidownExtra || (settings.getFromJijidownExtraUpdate && getCurrentTs() - backup.jijidownExtra.ts > 3600 * 24 * 7 * settings.getFromJijidownExtraUpdateInterval))) {
                    await getFromJijidownExtra(AVBVTitle, backup, spanJ, response.response.ltime, controller);
                }

                return;

            } else if (response.response.msg === 'loading') {
                retryCount++;
                if (retryCount > 4) {
                    throw ['请求重试次数过多', `${settings.getFromJijidownURL}/api/v1/video_bv/get_info`];
                }

            } else {
                backup.jijidown = { value: false, ts: getCurrentTs() };
                if (settings.getFromJijidownExtra && (!backup.jijidownExtra || (settings.getFromJijidownExtraUpdate && getCurrentTs() - backup.jijidownExtra.ts > 3600 * 24 * 7 * settings.getFromJijidownExtraUpdateInterval))) {
                    backup.jijidownExtra = { value: false, ts: getCurrentTs() };
                    spanJ.style.color = '#800000';
                } else {
                    spanJ.style.color = '#ff0000';
                }
                return;
            }

            if (controller.signal.aborted) {
                throw new DOMException('', 'AbortError');
            }

            await delay(600);
        }
    }

    async function getFromJijidownExtra(AVBVTitle, backup, spanJ, ts, controller) {

        const response = await surroundWithRetry(controller, undefined, async () => {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://${settings.getFromJijidownURL}/api/v1/video_bv/get_download_info?id=${AVBVTitle.BV.slice(2)}`,
                    timeout: 1000 * settings.requestTimeout,
                    responseType: 'json',
                    onload: (res) => resolve(res),
                    onerror: (res) => reject(['请求失败', `${settings.getFromJijidownURL}/api/v1/video_bv/get_download_info`, res.error]),
                    ontimeout: () => reject(['请求超时', `${settings.getFromJijidownURL}/api/v1/video_bv/get_download_info`])
                });
            });
            if (debug) console.debug('getFromJijidownExtra', response);
            if (response.status !== 200) {
                throw ['请求失败', `${settings.getFromJijidownURL}/api/v1/video_bv/get_download_info`, `${response.status} ${response.statusText}`];
            }
            return response;
        });
        if (debug) console.log('getFromJijidownExtra', response.response);

        if (response.response.res?.length) {
            response.response.res.forEach(el => {
                updatePagesInBackup(backup, 0, el.part, undefined, undefined, el.cid, ts, `${settings.getFromJijidownURL}/api/v1/video_bv/get_download_info`);
            });

            backup.jijidownExtra = { value: true, ts: getCurrentTs() };
            spanJ.style.color = '#008000';

        } else {
            backup.jijidownExtra = { value: false, ts: getCurrentTs() };
            spanJ.style.color = '#800000';
        }
    }

    async function getFromXbeibeix(AVBVTitle, backup, spanX, controller) {

        const response = await surroundWithRetry(controller, undefined, async () => {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://${settings.getFromXbeibeixURL}/video/${AVBVTitle.BV}`,
                    timeout: 1000 * settings.requestTimeout,
                    cookiePartition: {
                        topLevelSite: `https://${settings.getFromXbeibeixURL}`
                    },
                    onload: (res) => resolve(res),
                    onerror: (res) => reject(['请求失败', `${settings.getFromXbeibeixURL}/video`, res.error]),
                    ontimeout: () => reject(['请求超时', `${settings.getFromXbeibeixURL}/video`])
                });
            });
            if (debug) console.debug('getFromXbeibeix', response);
            if (response.status === 403) {
                if (settings.autoDisableGetFromBJX) {
                    addMessage({ msg: '需要进行人机验证, 手动访问一次贝贝工具站的原始页面可能有帮助', border: 'red' });
                    addMessage({ msg: '请求失败', small: true });
                    addMessage({ msg: `${settings.getFromXbeibeixURL}/video`, small: true });
                    addMessage({ msg: `${response.status} ${response.statusText}`, small: true });
                    if (settings.getFromXbeibeix) {
                        checkboxGetFromXbeibeix.click();
                        addMessage({ msg: '已自动关闭从贝贝工具站获取数据', small: true });
                    }
                    return;
                } else {
                    throw ['需要进行人机验证, 手动访问一次贝贝工具站的原始页面可能有帮助', '请求失败', `${settings.getFromXbeibeixURL}/video`, `${response.status} ${response.statusText}`];
                }
            } else if (response.status !== 200) {
                throw ['请求失败', `${settings.getFromXbeibeixURL}/video`, `${response.status} ${response.statusText}`];
            }
            return response;
        });
        if (!response) {
            return;
        }
        if (debug) console.log('getFromXbeibeix', response.responseXML);

        if (response.finalUrl !== `https://${settings.getFromXbeibeixURL}/`) {
            const responseDOM = new DOMParser().parseFromString(response.response, 'text/html');
            updateArrayDataInBackup(backup, 'title', responseDOM.querySelector('h5.fw-bold').textContent, undefined, `${settings.getFromXbeibeixURL}/video`);
            updateArrayDataInBackup(backup, 'intro', decodeHTMLEntities(responseDOM.querySelector('div.col-8 > textarea').value), undefined, `${settings.getFromXbeibeixURL}/video`);
            updateArrayDataInBackup(backup, 'cover', responseDOM.querySelector('div.col-4 > img').getAttribute('src'), undefined, `${settings.getFromXbeibeixURL}/video`);
            updateArrayDataInBackup(backup, 'upperName', responseDOM.querySelector('div.input-group.mb-2 > input').value, undefined, `${settings.getFromXbeibeixURL}/video`);

            backup.xbeibeix = { value: true, ts: getCurrentTs() };
            spanX.style.color = '#00ff00';

        } else {
            backup.xbeibeix = { value: false, ts: getCurrentTs() };
            spanX.style.color = '#ff0000';
        }

        if (settings.getFromXbeibeixExtra && !backup.xbeibeixExtra) {
            await getFromXbeibeixExtra(AVBVTitle, backup, spanX);
        }
    }

    async function getFromXbeibeixExtra(AVBVTitle, backup, spanX) {

    }

    function addMessage({ msg, small = false, border, scrollIntoView = true }) {
        let px;
        if (small) {
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

        if (divMessageHeightFixed) {
            divMessage.scrollTop = divMessage.scrollHeight;
        } else if (divMessage.scrollHeight > (newFreshSpace ? 300 : 270)) {
            divMessage.classList.add('backup-divMessage-heightFixed' + classAppendNewFreshSpace);
            divMessageHeightFixed = true;
            divMessage.scrollTop = divMessage.scrollHeight;
        }

        if (scrollIntoView) {
            if (border) {
                if (divMessageScrollIntoViewCounter) {
                    lastTimeDivMessageScrollIntoView = false;
                } else {
                    divMessage.scrollIntoView({ behavior: 'instant', block: 'nearest' });
                    lastTimeDivMessageScrollIntoView = true;
                }
                divMessageScrollIntoViewCounter = 5;
            } else if (lastTimeDivMessageScrollIntoView) {
                divMessage.scrollIntoView({ behavior: 'instant', block: 'nearest' });
            }
        }
    }

    function clearMessage() {
        while (divMessage.firstChild) {
            divMessage.removeChild(divMessage.firstChild);
        }
        divMessage.classList.remove('backup-divMessage-heightFixed' + classAppendNewFreshSpace);
        divMessageHeightFixed = false;
    }

    function catchUnknownError(error) {
        addMessage({ msg: '发生未知错误, 请反馈该问题', border: 'red' });
        addMessage({ msg: error.stack, small: true })
        console.error(error);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getCurrentTs() {
        return Math.floor(Date.now() / 1000);
    }

    function abortActiveControllers() {
        for (const controller of activeControllers) {
            controller.abort();
        }
    }

    function formatTsTimeFavorite(t) {
        const e = new Date();
        const n = e.getTime();
        const r = t.getTime();
        const o = n - r;
        return o < 6e4
            ? '刚刚'
            : o < 36e5
                ? Math.floor(o / 6e4) + '分钟前'
                : o < 864e5
                    ? Math.floor(o / 36e5) + '小时前'
                    : r >= new Date(e.getFullYear(), e.getMonth(), e.getDate() - 1).getTime()
                        ? '昨天'
                        : r >= new Date(e.getFullYear(), 0, 1).getTime()
                            ? (t.getMonth() + 1) + '-' + t.getDate()
                            : t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate();
    }

    function formatTsYYMMDD_HHMMSS(ts) {
        const date = new Date(1000 * ts);
        const year = String(date.getFullYear()).slice(2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}_${hours}${minutes}${seconds}`;
    }

    function formatTsTimePublish(e) {
        const n = new Date(e);
        const u = Date.now();
        if (u - e <= 6e4) {
            return '刚刚';
        }
        if (u - e < 36e5) {
            return Math.floor((u - e) / 6e4) + '分钟前';
        }
        if (u - e < 864e5) {
            return Math.floor((u - e) / 36e5) + '小时前';
        }
        if (new Date().setHours(0, 0, 0, 0) - e < 864e5) {
            return '昨天';
        }
        const l = n.getFullYear();
        const c = '0'.concat(n.getMonth() + 1).slice(-2);
        const f = '0'.concat(n.getDate()).slice(-2);
        return l === new Date().getFullYear() ? ''.concat(c, '-').concat(f) : ''.concat(l, '-').concat(c, '-').concat(f);
    }

    function decodeHTMLEntities(str) {
        if (!str) {
            return '';
        }
        return new DOMParser().parseFromString(`<!doctype html><body>${str}`, 'text/html').body.textContent;
    }

    function updateArrayDataInBackup(backup, key, value, ts, from) {
        if (!value) {
            return;
        }
        if (!ts) {
            ts = 0;
        }
        if (key === 'cover' || key === 'upperAvatar') {
            value = 'https://' + value.replace(getHttpsFromURLRegex, '').replace(getBmgSrcNextFromURLRegex, '');
        }

        if (!backup[key]) {
            backup[key] = [];
            const data = { value, ts, from };
            backup[key].push(data);
            return;
        }

        let found;
        found = backup[key].find(el => el.value === value);
        if (found) {
            if (found.ts <= ts) {
                found.ts = ts;
                found.from = from;
                backup[key].sort((a, b) => a.ts - b.ts);
            }
            return;
        }

        if (key === 'cover' || key === 'upperAvatar') {
            found = backup[key].find(el => el.value.match(getFilenameFromURLRegex)[0] === value.match(getFilenameFromURLRegex)[0]);
            if (found) {
                if (found.ts <= ts) {
                    found.value = value;
                    found.ts = ts;
                    found.from = from;
                    backup[key].sort((a, b) => a.ts - b.ts);
                }
                return;
            }

        } else if (key === 'intro') {
            found = backup.intro.find(el => el.value.replaceAll('\r', '') === value);
            if (found) {
                return;
            }

            found = backup.intro.find(el => el.value === value.replaceAll('\r', ''));
            if (found) {
                found.value = value;
                found.ts = ts;
                found.from = from;
                backup.intro.sort((a, b) => a.ts - b.ts);
                return;
            }

            found = backup.intro.find(el => el.value.replaceAll('\r', '').startsWith(value.replaceAll('\r', '')));
            if (found) {
                return;
            }

            found = backup.intro.find(el => value.replaceAll('\r', '').startsWith(el.value.replaceAll('\r', '')));
            if (found) {
                found.value = value;
                found.ts = ts;
                found.from = from;
                backup.intro.sort((a, b) => a.ts - b.ts);
                return;
            }
        }

        const data = { value, ts, from };
        backup[key].push(data);
        backup[key].sort((a, b) => a.ts - b.ts);
    }

    function updateTimeFavoriteInBackup(backup, value, fid) {
        if (!value) {
            value = 0;
        }
        if (!backup.timeFavorite) {
            backup.timeFavorite = [];
            const data = { value, fid };
            backup.timeFavorite.push(data);
            return true;

        } else {
            const found = backup.timeFavorite.find(el => el.fid === fid);
            if (found) {
                if (found.value < value) {
                    found.value = value;
                    backup.timeFavorite.sort((a, b) => a.value - b.value);
                    return true;
                }
            } else {
                const data = { value, fid };
                backup.timeFavorite.push(data);
                backup.timeFavorite.sort((a, b) => a.value - b.value);
                return true;
            }
        }
    }

    function updatePagesInBackup(backup, index, title, firstFrame, thumbnails, cid, ts, from) {
        if (!index && index !== 0) {
            index = null;
        }
        if (title) {
            if (!Array.isArray(title)) {
                title = [title];
            }
        } else {
            title = null;
        }
        if (firstFrame) {
            firstFrame = 'https://' + firstFrame.replace(getHttpsFromURLRegex, '').replace(getBmgSrcNextFromURLRegex, '');
        } else {
            firstFrame = null;
        }
        if (thumbnails) {
            if (!Array.isArray(thumbnails)) {
                thumbnails = ['https://' + thumbnails.replace(getHttpsFromURLRegex, '').replace(getBmgSrcNextFromURLRegex, '')];
            } else {
                thumbnails = thumbnails.map(el => 'https://' + el.replace(getHttpsFromURLRegex, '').replace(getBmgSrcNextFromURLRegex, ''));
            }
        } else {
            thumbnails = null;
        }
        if (!cid && cid !== 0) {
            cid = null;
        }
        if (!ts) {
            ts = 0;
        }
        if (!from) {
            from = null;
        }

        if (!backup.pages) {
            backup.pages = [];
            const data = { index, title, firstFrame, thumbnails, cid, ts, from };
            backup.pages.push(data);
            return true;

        } else {
            const found = backup.pages.find(el => el.cid === cid);
            if (found) {
                let modified = false;
                if (index) {
                    if (!found.index) {
                        found.index = index;
                        modified = true;
                    } else if (found.index !== index && found.ts <= ts) {
                        found.index = index;
                        modified = true;
                    }
                }
                if (title) {
                    if (!found.title) {
                        found.title = title;
                        modified = true;
                    } else {
                        title.forEach(el => {
                            if (!found.title.find(ele => ele === el)) {
                                found.title.push(el);
                                modified = true;
                            }
                        });
                    }
                }
                if (firstFrame) {
                    if (!found.firstFrame) {
                        found.firstFrame = firstFrame;
                        modified = true;
                    } else if (found.firstFrame !== firstFrame) {
                        if (debug) {
                            addMessage({ msg: 'updatePagesInBackup firstFrame 不一致', border: 'red' });
                            addMessage({ msg: `旧: ${found.firstFrame}`, small: true });
                            addMessage({ msg: `新: ${firstFrame}`, small: true });
                            console.warn('updatePagesInBackup firstFrame 不一致');
                            console.warn(`旧: ${found.firstFrame}`);
                            console.warn(`新: ${firstFrame}`);
                        }
                        // target.firstFrame = firstFrame;
                        // modified = true;
                    }
                }
                if (thumbnails) {
                    if (!found.thumbnails) {
                        found.thumbnails = thumbnails;
                        modified = true;
                    } else {
                        thumbnails.forEach(el => {
                            if (!found.thumbnails.find(ele => ele === el)) {
                                found.thumbnails.push(el);
                                modified = true;
                            }
                        });
                    }
                }
                if (found.ts <= ts) {
                    found.ts = ts;
                    modified = true;
                }
                if (modified) {
                    if (from) {
                        found.from = from;
                    }
                    backup.pages.sort((a, b) => {
                        if (a.index !== b.index) {
                            return a.index - b.index;
                        } else if (a.ts !== b.ts) {
                            return a.ts - b.ts;
                        } else {
                            return a.cid - b.cid;
                        }
                    });
                }

            } else {
                const data = { index, title, firstFrame, thumbnails, cid, ts, from };
                backup.pages.push(data);
                backup.pages.sort((a, b) => {
                    if (a.index !== b.index) {
                        return a.index - b.index;
                    } else if (a.ts !== b.ts) {
                        return a.ts - b.ts;
                    } else {
                        return a.cid - b.cid;
                    }
                });
                return true;
            }
        }
    }

    async function appendParamsForGetFromApi(fid, pageNumber, pageSize) {
        const inputKeyword = document.querySelector(newFreshSpace ? 'input.fav-list-header-filter__search' : 'input.search-fav-input');
        let keyword = '';
        if (inputKeyword) {
            keyword = encodeURIComponent(inputKeyword.value);
        }
        if (debug) {
            console.log(`keyword: ${keyword}`);
            console.log(`keyword: ${decodeURIComponent(keyword)}`);
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
        if (debug) console.log(`order: ${order}`);

        const divType = document.querySelector(newFreshSpace ? 'div.vui_input__prepend' : 'div.search-types');
        let typeText = '当前';
        if (divType) {
            typeText = divType.innerText;
        }
        if (newFreshSpace && !keyword) {
            typeText = '当前';
        }
        if (debug) console.log(`typeText: ${typeText}`);
        let type;
        if (typeText.includes('当前')) {
            type = 0;
        } else if (typeText.includes('全部')) {
            type = 1;
        } else {
            throw ['无法确定搜索的范围为当前收藏夹还是全部收藏夹, 请反馈该问题'];
        }
        if (debug) console.log(`type: ${type}`);

        if (!newFreshSpace && type && !keyword && order === 'mtime') {
            return;
        }

        if (newFreshSpace) {
            divTid = document.querySelector('div.fav-list-header-collapse div.radio-filter__item--active');
        }
        let tidText = '全部分区';
        if (divTid) {
            tidText = divTid.innerText;
        }
        if (debug) console.log(`tidText: ${tidText}`);
        let tid;
        if (tidText.includes('全部')) {
            tid = 0;
        } else {
            const UID = parseInt(location.href.match(getUIDFromURLRegex)[1], 10);
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://api.bilibili.com/x/v3/fav/resource/partition?up_mid=${UID}&media_id=${fid}` + (newFreshSpace ? '&web_location=333.1387' : ''),
                    timeout: 1000 * settings.requestTimeout,
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
        if (debug) console.log(`tid: ${tid}`);

        if (debug) console.log(`https://api.bilibili.com/x/v3/fav/resource/list?media_id=${fid}&pn=${pageNumber}&ps=${pageSize}&keyword=${keyword}&order=${order}&type=${type}&tid=${tid}&platform=web` + (newFreshSpace ? '&web_location=333.1387' : ''));
        return (`https://api.bilibili.com/x/v3/fav/resource/list?media_id=${fid}&pn=${pageNumber}&ps=${pageSize}&keyword=${keyword}&order=${order}&type=${type}&tid=${tid}&platform=web` + (newFreshSpace ? '&web_location=333.1387' : ''));
    }

    function validateInputText(event) {
        try {
            const inputText = event.target;
            let value = inputText.value.trim();
            if (!value || isNaN(value)) {
                value = Number(inputText.getAttribute('backup-def'));
            } else {
                value = Math.floor(Number(value));
                if (value < Number(inputText.getAttribute('backup-min'))) {
                    value = Number(inputText.getAttribute('backup-min'));
                } else if (value > Number(inputText.getAttribute('backup-max'))) {
                    value = Number(inputText.getAttribute('backup-max'));
                }
            }
            inputText.value = value;
            settings[(inputText.getAttribute('backup-setting'))] = value;
            GM_setValue('settings', settings);
        } catch (error) {
            catchUnknownError(error);
        }
    }

    function validateInputTextAppendDropdownsOrder(event) {
        try {
            const inputText = event.target;
            let value = inputText.value.trim().toLowerCase();
            let result = '';
            for (const el of value) {
                if ('abcdefg'.includes(el) && !result.includes(el)) {
                    result += el;
                }
            }
            inputText.value = result;
            settings.appendDropdownsOrder = result;
            GM_setValue('settings', settings);
        } catch (error) {
            catchUnknownError(error);
        }
    }

    function removeTsFromInBackup(obj) {
        if (Array.isArray(obj)) {
            obj.forEach(el => removeTsFromInBackup(el));
        } else if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (key === 'ts' || key === 'from') {
                    delete obj[key];
                } else {
                    removeTsFromInBackup(obj[key]);
                }
            }
        }
    }

    function formatBackup(backup) {
        // v9
        if (backup.timeFavorite) {
            backup.timeFavorite.forEach(el => {
                if (typeof el.fid === 'string') {
                    el.fid = parseInt(el.fid, 10);
                }
            });
        }
        // v9
        ['timeUpload', 'timePublish'].forEach(key => {
            if (Array.isArray(backup[key])) {
                if (backup[key].length === 1) {
                    backup[key] = backup[key][0].value;
                } else {
                    backup[key] = null;
                }
            }
        });
        // v10
        if (backup.hasOwnProperty('jiji')) {
            backup.jijidown = backup.jiji;
            delete backup.jiji;
        }
        // v10
        if (backup.hasOwnProperty('bbdownloader')) {
            backup.xbeibeix = backup.bbdownloader;
            delete backup.bbdownloader;
        }
        // v16 v21
        ['intro', 'cover', 'upperAvatar'].forEach(key => {
            if (backup[key]) {
                const tempBackup = {};
                backup[key].forEach(el => {
                    updateArrayDataInBackup(tempBackup, key, el.value, el.ts, el.from);
                });
                backup[key] = tempBackup[key];
            }
        });
        // v21
        if (backup.pages) {
            const tempBackup = {};
            backup.pages.forEach(el => {
                updatePagesInBackup(tempBackup, el.index, el.title, el.firstFrame, el.thumbnails, el.cid, el.ts, el.from);
            });
            backup.pages = tempBackup.pages;
        }
    }

    async function surroundWithRetry(controller, before, execute) {
        let retryCount = 0;
        while (true) {
            if (controller.signal.aborted) {
                throw new DOMException('', 'AbortError');
            }
            if (before) {
                await before();
            }
            try {
                return await execute();
            } catch (error) {
                if (retryCount > 0) {
                    throw error;
                }
                console.error(error);
                retryCount++;
            }
            if (controller.signal.aborted) {
                throw new DOMException('', 'AbortError');
            }
            await delay(1000);
        }
    }

    function formatSettings(updates) {
        switch (settings.version) {
            case 1:
                updates.push('版本2 20241224');
                updates.push('修复: 开启自动点击下一页后, 当前页的视频未处理完就切换至下一页的问题');
            case 2:
                updates.push('版本3 20241225');
                updates.push('新增: 设置是否处理正常或失效视频的功能');
                updates.push('新增: 设置是否从api, biliplus, jijidown, xbeibeix获取数据的功能');
                updates.push('修复: 切换至其他页再切换回收藏页, 无法获取默认收藏夹fid的问题');
                settings.processNormal = true;
                settings.processDisabled = true;
                settings.enableGetFromApi = true;
                settings.enableGetFromBiliplus = false;
                settings.enableGetFromJijidown = false;
                settings.enableGetFromXbeibeix = false;
                settings.defaultFavlistFid = null;
                delete settings.onlyProcessDisabled;
                delete settings.usageCount;
                delete settings.usageCountNewFreshSpace;
            case 3:
                updates.push('版本4 20241226');
                updates.push('修复: 正常视频失效后, 本地备份数据无法更新的问题');
            case 4:
                updates.push('版本5 20241228');
                updates.push('修复: 唧唧域名更换后无法获取数据的问题');
                settings.enableGetFromJiji = settings.enableGetFromJijidown;
                delete settings.enableGetFromJijidown;
            case 5:
                updates.push('版本6 20241228');
                updates.push('其他: 目前唧唧尚不稳定, 默认关闭从唧唧获取数据');
            case 6:
                updates.push('版本7 20241228');
                updates.push('其他: 目前贝贝工具站尚不稳定, 默认关闭从贝贝工具站获取数据');
                settings.enableGetFromBbdownloader = settings.enableGetFromXbeibeix;
                delete settings.enableGetFromXbeibeix;
            case 7:
                updates.push('版本8 20241229');
                updates.push('其他: 优化提示信息的展示效果');
                settings.defaultUID = null;
            case 8:
                updates.push('版本9 20250105');
                updates.push('新增: 导出本地备份数据的功能');
                updates.push('新增: 导入本地备份数据的功能');
                updates.push('新增: 停止处理当前页视频的功能');
                updates.push('修复: 本地备份数据中部分信息重复存储的问题');
                if (settings.defaultFavlistFid) {
                    settings.defaultFavlistFid = parseInt(settings.defaultFavlistFid, 10);
                }
            case 9:
                updates.push('版本10 20250107');
                updates.push('修复: 无法从贝贝工具站获取数据的问题');
                settings.getFromJijidownURL = 'www.jijidown.com';
                settings.getFromXbeibeixURL = 'xbeibeix.com';
                settings.enableGetFromJijidown = settings.enableGetFromJiji;
                delete settings.enableGetFromJiji;
                settings.enableGetFromXbeibeix = settings.enableGetFromBbdownloader;
                delete settings.enableGetFromBbdownloader;
            case 10:
                updates.push('版本11 20250108');
                updates.push('修复: 新版个人空间中收藏时间重复展示的问题');
            case 11:
                updates.push('版本12 20250111');
                updates.push('修复: 从贝贝工具站获取的封面无法正常展示的问题');
            case 12:
                updates.push('版本13 20250114');
                updates.push('修复: 指定排序方式或筛选条件后无法从B站接口获取数据的问题');
                delete settings.enableDebug;
            case 13:
                updates.push('版本14 20250118');
                updates.push('新增: 设置是否从B站接口获取额外数据的功能');
                updates.push('新增: 设置是否从唧唧获取额外数据的功能');
                settings.enableGetFromApiExtra = false;
                settings.enableGetFromJijidownExtra = false;
            case 14:
                updates.push('版本15 20250124');
                updates.push('修复: 新版个人空间中复制视频后标题下方的信息重复展示的问题');
            case 15:
                updates.push('版本16 20250201');
                updates.push('新增: 设置获取数据的最小更新间隔的功能');
                settings.displayAdvancedControls = false;
                settings.advancedDisableUpdateGetFromApi = false;
                settings.advancedDisableUpdateGetFromApiExtra = false;
                settings.advancedDisableUpdateGetFromBiliplus = true;
                settings.advancedDisableUpdateGetFromJijidown = true;
                settings.advancedDisableUpdateGetFromJijidownExtra = true;
                settings.advancedDisableUpdateGetFromXbeibeix = true;
                settings.advancedIntervalGetFromApi = 5;
                settings.advancedIntervalGetFromApiExtra = 5;
                settings.advancedIntervalGetFromBiliplus = 10;
                settings.advancedIntervalGetFromJijidown = 10;
                settings.advancedIntervalGetFromJijidownExtra = 10;
                settings.advancedIntervalGetFromXbeibeix = 10;
                settings.advancedIntervalAutoNextPage = 5;
                if (!settings.enableGetFromApi) {
                    settings.enableGetFromApiExtra = false;
                }
            case 16:
                updates.push('版本17 20250204');
                updates.push('新增: 自动点击下一收藏夹的功能');
                updates.push('新增: 设置自动点击下一页或下一收藏夹的等待间隔的功能');
            case 17:
                updates.push('版本18 20250208');
                updates.push('新增: 设置请求超时时间的功能');
                settings.advancedRequestTimeout = 10;
            case 18:
                updates.push('版本19 20250219');
                updates.push('新增: 导出本地备份数据的同时导出去除ts和from的副本的功能');
                settings.advancedExportBackupWithoutTsFrom = false;
                settings.advancedEnableUpdateGetFromApi = !settings.advancedDisableUpdateGetFromApi;
                delete settings.advancedDisableUpdateGetFromApi;
                settings.advancedEnableUpdateGetFromApiExtra = !settings.advancedDisableUpdateGetFromApiExtra;
                delete settings.advancedDisableUpdateGetFromApiExtra;
                settings.advancedEnableUpdateGetFromBiliplus = !settings.advancedDisableUpdateGetFromBiliplus;
                delete settings.advancedDisableUpdateGetFromBiliplus;
                settings.advancedEnableUpdateGetFromJijidown = !settings.advancedDisableUpdateGetFromJijidown;
                delete settings.advancedDisableUpdateGetFromJijidown;
                settings.advancedEnableUpdateGetFromJijidownExtra = !settings.advancedDisableUpdateGetFromJijidownExtra;
                delete settings.advancedDisableUpdateGetFromJijidownExtra;
                settings.advancedEnableUpdateGetFromXbeibeix = !settings.advancedDisableUpdateGetFromXbeibeix;
                delete settings.advancedDisableUpdateGetFromXbeibeix;
            case 19:
                updates.push('版本20 20250225');
                updates.push('新增: 获取进度条缩略图地址的功能');
                settings.enableGetThumbnails = false;
                settings.enableUpdateGetFromApi = settings.advancedEnableUpdateGetFromApi;
                delete settings.advancedEnableUpdateGetFromApi;
                settings.enableUpdateGetFromApiExtra = settings.advancedEnableUpdateGetFromApiExtra;
                delete settings.advancedEnableUpdateGetFromApiExtra;
                settings.enableUpdateGetFromBiliplus = settings.advancedEnableUpdateGetFromBiliplus;
                delete settings.advancedEnableUpdateGetFromBiliplus;
                settings.enableUpdateGetFromJijidown = settings.advancedEnableUpdateGetFromJijidown;
                delete settings.advancedEnableUpdateGetFromJijidown;
                settings.enableUpdateGetFromJijidownExtra = settings.advancedEnableUpdateGetFromJijidownExtra;
                delete settings.advancedEnableUpdateGetFromJijidownExtra;
                settings.enableUpdateGetFromXbeibeix = settings.advancedEnableUpdateGetFromXbeibeix;
                delete settings.advancedEnableUpdateGetFromXbeibeix;
                settings.intervalGetFromApi = settings.advancedIntervalGetFromApi;
                delete settings.advancedIntervalGetFromApi;
                settings.intervalGetFromApiExtra = settings.advancedIntervalGetFromApiExtra;
                delete settings.advancedIntervalGetFromApiExtra;
                settings.intervalGetFromBiliplus = settings.advancedIntervalGetFromBiliplus;
                delete settings.advancedIntervalGetFromBiliplus;
                settings.intervalGetFromJijidown = settings.advancedIntervalGetFromJijidown;
                delete settings.advancedIntervalGetFromJijidown;
                settings.intervalGetFromJijidownExtra = settings.advancedIntervalGetFromJijidownExtra;
                delete settings.advancedIntervalGetFromJijidownExtra;
                settings.intervalGetFromXbeibeix = settings.advancedIntervalGetFromXbeibeix;
                delete settings.advancedIntervalGetFromXbeibeix;
                settings.intervalAutoNextPage = settings.advancedIntervalAutoNextPage;
                delete settings.advancedIntervalAutoNextPage;
                settings.requestTimeout = settings.advancedRequestTimeout;
                delete settings.advancedRequestTimeout;
                settings.exportBackupWithoutTsFrom = settings.advancedExportBackupWithoutTsFrom;
                delete settings.advancedExportBackupWithoutTsFrom;
            case 20:
                updates.push('版本21 20250227');
                updates.push('新增: 设置开始处理视频前等待时长的功能');
                updates.push('新增: 设置视频下拉列表中添加哪些按钮的功能');
                settings.delayBeforeMain = 300;
                settings.appendDropdownCover = true;
                settings.appendDropdownLocal = true;
                settings.appendDropdownJump = true;
                settings.appendDropdownReset = true;
            case 21:
                updates.push('版本22 20250304');
                updates.push('新增: 从BiliPlus获取额外数据的功能');
                settings.enableGetFromBiliplusExtra = false;
                settings.enableUpdateGetFromBiliplusExtra = false;
                settings.intervalGetFromBiliplusExtra = 10;
            case 22:
                updates.push('版本23 20250306');
                updates.push('新增: 从旧版B站接口获取数据的功能');
            case 23:
                updates.push('版本24 20250313');
                updates.push('修复: 旧版个人空间中分区筛选被禁用后无法从B站接口获取数据的问题');
            case 24:
                updates.push('版本25 20250318');
                updates.push('修复: 旧版个人空间中指定关键词后无法从B站接口获取数据的问题');
            case 25:
                updates.push('版本26 20250323');
                updates.push('修复: 新版个人空间中指定关键词后无法分辨视频是否失效的问题');
            case 26:
                updates.push('版本27 20250625');
                updates.push('修复: 贝贝工具站域名更换后无法获取数据的问题');
            case 27:
                updates.push('版本28 20250729');
                updates.push('新增: 设置视频标题下方TCABJX不透明度的功能');
                settings.enableDelayGetFromBiliplusExtra = true;
                settings.TCABJXOpacity = 100;
            case 28:
                updates.push('版本29 20250806');
                updates.push('其他: 目前BiliPlus不稳定, 默认关闭从BiliPlus获取数据');
            case 29:
                updates.push('版本30 20250810');
                updates.push('修复: 从BiliPlus获取的数据为空时报错的问题');
            case 30:
                updates.push('版本31 20250820');
                updates.push('新增: 设置从B站接口获取额外数据启用更新时, 只更新可能换源的视频还是总是更新所有视频的功能');
                settings.getFromApiExtraUpdateAll = false;
                settings.getFromApi = settings.enableGetFromApi;
                delete settings.enableGetFromApi;
                settings.getFromApiUpdate = settings.enableUpdateGetFromApi;
                delete settings.enableUpdateGetFromApi;
                settings.getFromApiUpdateInterval = settings.intervalGetFromApi;
                delete settings.intervalGetFromApi;
                settings.getFromApiExtra = settings.enableGetFromApiExtra;
                delete settings.enableGetFromApiExtra;
                settings.getFromApiExtraThumbnails = settings.enableGetThumbnails;
                delete settings.enableGetThumbnails;
                settings.getFromApiExtraUpdate = settings.enableUpdateGetFromApiExtra;
                delete settings.enableUpdateGetFromApiExtra;
                settings.getFromApiExtraUpdateInterval = settings.intervalGetFromApiExtra;
                delete settings.intervalGetFromApiExtra;
                settings.getFromBiliplus = settings.enableGetFromBiliplus;
                delete settings.enableGetFromBiliplus;
                settings.getFromBiliplusUpdate = settings.enableUpdateGetFromBiliplus;
                delete settings.enableUpdateGetFromBiliplus;
                settings.getFromBiliplusUpdateInterval = settings.intervalGetFromBiliplus;
                delete settings.intervalGetFromBiliplus;
                settings.getFromBiliplusExtra = settings.enableGetFromBiliplusExtra;
                delete settings.enableGetFromBiliplusExtra;
                settings.getFromBiliplusExtraUpdate = settings.enableUpdateGetFromBiliplusExtra;
                delete settings.enableUpdateGetFromBiliplusExtra;
                settings.getFromBiliplusExtraUpdateInterval = settings.intervalGetFromBiliplusExtra;
                delete settings.intervalGetFromBiliplusExtra;
                settings.getFromJijidown = settings.enableGetFromJijidown;
                delete settings.enableGetFromJijidown;
                settings.getFromJijidownUpdate = settings.enableUpdateGetFromJijidown;
                delete settings.enableUpdateGetFromJijidown;
                settings.getFromJijidownUpdateInterval = settings.intervalGetFromJijidown;
                delete settings.intervalGetFromJijidown;
                settings.getFromJijidownExtra = settings.enableGetFromJijidownExtra;
                delete settings.enableGetFromJijidownExtra;
                settings.getFromJijidownExtraUpdate = settings.enableUpdateGetFromJijidownExtra;
                delete settings.enableUpdateGetFromJijidownExtra;
                settings.getFromJijidownExtraUpdateInterval = settings.intervalGetFromJijidownExtra;
                delete settings.intervalGetFromJijidownExtra;
                settings.getFromXbeibeix = settings.enableGetFromXbeibeix;
                delete settings.enableGetFromXbeibeix;
                settings.getFromXbeibeixUpdate = settings.enableUpdateGetFromXbeibeix;
                delete settings.enableUpdateGetFromXbeibeix;
                settings.getFromXbeibeixUpdateInterval = settings.intervalGetFromXbeibeix;
                delete settings.intervalGetFromXbeibeix;
                settings.autoNextPageInterval = settings.intervalAutoNextPage;
                delete settings.intervalAutoNextPage;
                delete settings.enableDelayGetFromBiliplusExtra;
            case 31:
                updates.push('版本32 20250917');
                updates.push('其他: 适配B站深色主题');
            case 32:
                updates.push('版本33 20250923');
                updates.push('修复: 旧版个人空间中指定搜索范围为全部收藏夹后无法从B站接口获取数据的问题');
            case 33:
                updates.push('版本34 20251003');
                updates.push('其他: 为从第三方网站获取数据添加请求重试的逻辑');
                settings.processOthersFavlist = false;
            case 34:
                updates.push('版本35 20251107');
                updates.push('新增: 查看首帧截图, 进度条缩略图, UP主头像的视频下拉列表功能');
                updates.push('新增: 设置视频下拉列表顺序的功能');
                settings.appendDropdownsOrder = '';
                if (settings.appendDropdownLocal) {
                    settings.appendDropdownsOrder += 'a';
                }
                delete settings.appendDropdownLocal;
                if (settings.appendDropdownCover) {
                    settings.appendDropdownsOrder += 'b';
                }
                delete settings.appendDropdownCover;
                settings.appendDropdownsOrder += 'cde';
                if (settings.appendDropdownJump) {
                    settings.appendDropdownsOrder += 'f';
                }
                delete settings.appendDropdownJump;
                if (settings.appendDropdownReset) {
                    settings.appendDropdownsOrder += 'g';
                }
                delete settings.appendDropdownReset;
            case 35:
                updates.push('版本36 20251107');
                updates.push('修复: 仅开启从第三方网站获取数据时可能不会将数据保存至本地的问题');
            case 36:
                updates.push('版本37 20251119');
                updates.push('其他: 现在访问BiliPlus时需要先进行人机验证, 从BiliPlus获取数据时默认使用另外一个无需进行人机验证但是有调用频率限制的接口');
                settings.getFromBiliplusURL = 'www.biliplus.com/video';
            case 37:
                updates.push('版本38 20251205');
                updates.push('新增: 设置从第三方网站获取数据需要人机验证时是否自动关闭的功能');
                settings.autoDisableGetFromBJX = true;
            case 38:
                updates.push('版本39 20251227');
                updates.push('修复: 从BiliPlus获取数据和从BiliPlus获取额外数据时等待的时间可能比预期更长的问题');
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