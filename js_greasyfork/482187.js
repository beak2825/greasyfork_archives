// ==UserScript==
// @name        bilibili-显示精确时间
// @namespace   http://tampermonkey.net/
// @description bilibili动态与评论发布时间替换为精确时间，格式为“yyyy-MM-dd hh:mm:ss”。
// @version     1.3.6
// @author      Y_jun
// @license     GPL-3.0
// @icon        https://www.bilibili.com/favicon.ico
// @grant       none
// @match       https://www.bilibili.com/*
// @match       https://live.bilibili.com/*
// @match       https://space.bilibili.com/*
// @match       https://t.bilibili.com/*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/482187/bilibili-%E6%98%BE%E7%A4%BA%E7%B2%BE%E7%A1%AE%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/482187/bilibili-%E6%98%BE%E7%A4%BA%E7%B2%BE%E7%A1%AE%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

// 1打开，0关闭
const editDyn = 1; // 动态
const editReply = 1; // 评论
const editVideo = 1; // 视频
const editPlaylist = 1; // 待播列表
const editPics = 1; // 显示转发图片

const REPLY_API_PREFIX = 'https://api.bilibili.com/x/v2/reply';
const DYN_API_PREFIX = 'https://api.bilibili.com/x/polymer/web-dynamic';
const VIDEO_API_PREFIX = 'https://api.bilibili.com/x/web-interface/view';
const VIDEO_DETAIL_API_PREFIX = 'https://api.bilibili.com/x/web-interface/wbi/view/detail';
const SPACE_VIDEO_API_PREFIX = 'https://api.bilibili.com/x/space/wbi/arc/search';
const SPACE_SEASONS_API_PREFIX = 'https://api.bilibili.com/x/polymer/web-space/seasons_archives_list';
const SPACE_SERIES_API_PREFIX = 'https://api.bilibili.com/x/series/archives';
const SPACE_HOME_COLLECTIONS_API_PREFIX = 'https://api.bilibili.com/x/polymer/web-space/home/seasons_series';
const TOTAL_PLAYER_API_PREFIX = 'https://api.bilibili.com/x/player/online/total';

const TS_REGEX = /^\d{10}$/;
const FULL_DATETIME_REGEX = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/;
const MIN_DATETIME_REGEX = /[0-9]{2}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/;

function getDateTime(ts, type) {
    if (TS_REGEX.test(ts)) {
        let date = new Date(ts * 1000);
        if (!isNaN(date.getTime())) {
            let y = date.getFullYear();
            if (y < 2000) return;
            let m = date.getMonth() + 1;
            let d = date.getDate();
            if (type === 'full') {
                return `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d} ${date.toTimeString().substring(0, 8)}`;
            } else if (type === 'min') {
                return `${y.toString().substring(2)}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d} ${date.toTimeString().substring(0, 5)}`;
            } else if (type === 'date') {
                return `${y.toString().substring(2)}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
            }
        }
    }
    return null;
}

function getNewText(origTxt, datetime, isJoin) {
    origTxt = origTxt.trim();
    if (isJoin && /前|直播/.test(origTxt)) {
        return datetime + ' · ' + origTxt;
    }
    if (origTxt.includes(' · ')) {
        let origTxtArr = origTxt.split(' · ');
        origTxtArr[0] = datetime;
        return origTxtArr.join(' · ');
    }
    return datetime;
}


const console = Object.create(Object.getPrototypeOf(window.console), Object.getOwnPropertyDescriptors(window.console));

const addTimeToReply = function addTimeToReply(rootId, rpId, userId, datetime) {
    const id = rootId === 0 ? rpId : rootId;
    let intervalCount = 1;
    let interval = setInterval(() => {
        const container = document.querySelector(`.reply-wrap[data-id="${rpId}"]`);
        const containers = document.querySelectorAll(`[data-root-reply-id="${id}"][data-user-id="${userId}"]`);
        if (intervalCount > 20) clearInterval(interval);
        intervalCount++;
        if (container) {
            clearInterval(interval);
            // old page: 直接在对应评论元素更改时间
            const info = container.querySelector('.info');
            const time = info.querySelector('.reply-time,.time');
            if (time && !FULL_DATETIME_REGEX.test(time.textContent)) {
                time.textContent = getNewText(time.textContent, datetime, 1);
            }
        } else if (containers.length > 0) {
            clearInterval(interval);
            // new page: 由于无法直接定位评论元素，只能先定位其他有标识符的元素（比如用户头像），然后使用其父元素间接定位评论元素。
            for (let i = 0; i < containers.length; i++) {
                const container2 = containers[i];
                let parentElement = container2.parentElement;
                const isSub = parentElement.classList.toString().includes('sub-');
                if (isSub) {
                    parentElement = parentElement.parentElement;
                }
                const info = parentElement.querySelector(isSub ? '.sub-reply-info' : '.reply-info');
                if (info && !FULL_DATETIME_REGEX.test(info.textContent)) {
                    const time = info.querySelector('.reply-time,.sub-reply-time');
                    if (time) {
                        time.textContent = getNewText(time.textContent, datetime, 1);
                    }
                    break;
                }
            }
        }
    }, 100);
};

const addTimeToDyn = function addTimeToDyn(dynId, datetime, isDetail) {
    let container;
    let intervalCount = 1;
    let interval = setInterval(() => {
        if (isDetail === 0) {
            container = document.querySelector(`.bili-dyn-list__item[data-did="${dynId}"]`);
        } else if (isDetail === 1) {
            container = document.querySelector(`.bili-dyn-item[data-did="${dynId}"]`);
        }
        if (intervalCount > 20) clearInterval(interval);
        intervalCount++;
        if (container) {
            clearInterval(interval);
            // old page: 直接在对应评论元素更改时间
            const dynMain = container.querySelector('.bili-dyn-item__main');
            const time = dynMain.querySelector('.bili-dyn-time');
            if (time && !FULL_DATETIME_REGEX.test(time.textContent)) {
                time.textContent = getNewText(time.textContent, datetime, 1);
            }
        }
    }, 100);
};

const addDynPics = function addDynPics(dyn, isDetail) {
    const dynId = dyn.id_str;
    let container;
    let intervalCount = 1;
    let interval = setInterval(() => {
        if (isDetail === 0) {
            container = document.querySelector(`.bili-dyn-list__item[data-did="${dynId}"]`);
        } else if (isDetail === 1) {
            container = document.querySelector(`.bili-dyn-item[data-did="${dynId}"]`);
        }
        if (intervalCount > 20) clearInterval(interval);
        intervalCount++;
        if (container) {
            clearInterval(interval);
            // old page: 直接在对应评论元素更改时间
            const dynJsons = dyn.modules?.module_dynamic?.desc?.rich_text_nodes;
            if (dynJsons) {
                dynJsons.forEach(json => {
                    if (json.type === 'RICH_TEXT_NODE_TYPE_VIEW_PICTURE') {
                        const dynMain = container.querySelector('.bili-dyn-content__forw__desc');
                        if (!dynMain.querySelector(".timer-show-pic")) {
                            let picContainer = document.createElement("div");
                            picContainer.className = 'timer-show-pic';
                            picContainer.style.display = 'flex';
                            picContainer.style.justifyContent = 'start';
                            picContainer.style.position = 'relative';
                            picContainer.style.overflow = 'auto';
                            picContainer.style.flexWrap = 'wrap';
                            dynMain.appendChild(picContainer);
                            const pics = json.pics;
                            pics.forEach(pic => {
                                let picImg = document.createElement("img");
                                picImg.onclick = new Function(`event.stopPropagation();window.open('${pic.src}')`);
                                picImg.src = `${pic.src}@135h_!web-comment-note.webp`;
                                picImg.style.width = '135px';
                                picImg.style.height = '135px';
                                picImg.style.objectFit = 'cover';
                                picImg.style.objectFit = 'cover';
                                picImg.style.borderRadius = '5px';
                                picImg.style.margin = '2px';
                                picImg.style.cursor = 'pointer';
                                picContainer.appendChild(picImg);
                            });
                        }
                    }
                });
            }
        }
    }, 100);
};

const addTimeToVideo = function addTimeToVideo(videoId, datetime) {
    let intervalCount = 1;
    let interval = setInterval(() => {
        const containers = document.querySelectorAll(`[data-aid="${videoId}"]`);
        if (intervalCount > 20) clearInterval(interval);
        intervalCount++;
        if (containers.length > 0) {
            clearInterval(interval);
            for (let i = 0; i < containers.length; i++) {
                // old page: 直接在对应视频元素更改时间
                const container = containers[i];
                const time = container.querySelector('.time');
                if (time && !MIN_DATETIME_REGEX.test(time.textContent)) {
                    time.textContent = getNewText(time.textContent, datetime, 0);
                    time.style.overflow = 'visible';
                }
            }
        }
    }, 100);
};

const addTimeToRelatedVideo = function addTimeToRelatedVideo(videoId, datetime) {
    let intervalCount = 1;
    let interval = setInterval(() => {
        const title = document.querySelector(`.info [href*="${videoId}"]`);
        if (intervalCount > 20) clearInterval(interval);
        intervalCount++;
        if (title) {
            clearInterval(interval);
            // old page: 直接在对应视频元素更改时间
            const container = title.parentElement;
            if (!container.textContent.includes(datetime)) {
                let time = document.createElement("div");
                time.textContent = datetime;
                time.style.overflow = 'visible';
                time.classList.add('playinfo');
                container.appendChild(time);
            }
        }
    }, 100);
};

const addTimeToCollectionVideo = function addTimeToCollectionVideo(videoId, datetime) {
    let intervalCount = 1;
    let interval = setInterval(() => {
        const item = document.querySelector(`[data-key="${videoId}"]`);
        if (intervalCount > 20) clearInterval(interval);
        intervalCount++;
        if (item) {
            clearInterval(interval);
            // old page: 直接在对应视频元素更改时间
            const stats = item.querySelector('.stats');
            if (!stats.innerHTML.includes('stat-date')) {
                let dateStat = stats.firstChild.cloneNode();
                dateStat.classList.add("stat-date");
                dateStat.textContent = datetime;
                stats.appendChild(dateStat);
            }
        }
    }, 100);
};

const handleComment = function handleReplies(replies) {
    replies.forEach((reply) => {
        const datetime = getDateTime(reply.ctime, 'full');
        if (datetime) {
            try {
                addTimeToReply(reply.root, reply.rpid, reply.mid, datetime);
            } catch (ex) {
                console.error(ex);
            }
        }
        if (reply.replies) {
            handleReplies(reply.replies);
        }
    });
};

const handleDyns = function handleDyns(dyns, isDetail) {
    dyns.forEach((dyn) => {
        const ts = dyn?.modules?.module_author?.pub_ts || null;
        const datetime = getDateTime(ts, 'full');
        if (datetime) {
            try {
                addTimeToDyn(dyn.id_str, datetime, isDetail);
            } catch (ex) {
                console.error(ex);
            }
        }
    });
};

const handleVideos = function handleVideos(videos) {
    videos.forEach((video) => {
        const datetime = getDateTime(video.created ?? video.pubdate, 'min');
        if (datetime) {
            try {
                addTimeToVideo(video.bvid, datetime);
            } catch (ex) {
                console.error(ex);
            }
        }
    });
};

const handleRelatedVideos = function handleRelatedVideos(videos) {
    videos.forEach((video) => {
        const datetime = getDateTime(video.pubdate, 'full');
        if (datetime) {
            try {
                addTimeToRelatedVideo(video.bvid, datetime);
            } catch (ex) {
                console.error(ex);
            }
        }
    });
};

const handleCollectionVideos = function handleCollectionVideos(videos) {
    videos.forEach((video) => {
        const datetime = getDateTime(video.arc.pubdate, 'date');
        if (datetime) {
            try {
                addTimeToCollectionVideo(video.bvid, datetime);
            } catch (ex) {
                console.error(ex);
            }
        }
    });
};

const handleDynPics = function handleDynPics(dyns, isDetail) {
    dyns.forEach((dyn) => {
        if (dyn) {
            try {
                addDynPics(dyn, isDetail);
            } catch (ex) {
                console.error(ex);
            }
        }
    });
};

const handleResponse = async function handleResponse(url, response) {
    if (editReply && url.startsWith(REPLY_API_PREFIX)) {
        const body = response instanceof Response ? await response.clone().text() : response.toString();
        try {
            const json = JSON.parse(body);
            if (json.code === 0) {
                setTimeout(() => {
                    handleComment(Array.isArray(json.data.replies) ? json.data.replies : []);
                    handleComment(Array.isArray(json.data.top_replies) ? json.data.top_replies : []);
                }, 50);
            }
        } catch (ex) {
            console.error(ex);
        }
    }
    if (editDyn && url.startsWith(DYN_API_PREFIX)) {
        const body = response instanceof Response ? await response.clone().text() : response.toString();
        try {
            const json = JSON.parse(body);
            if (json.code === 0) {
                setTimeout(() => {
                    handleDyns(Array.isArray(json.data.items) ? json.data.items : [], 0);
                    handleDyns(json.data.item ? [json.data.item] : [], 1);
                    if (editPics) {
                        handleDynPics(Array.isArray(json.data.items) ? json.data.items : [], 0)
                        handleDynPics(json.data.item ? [json.data.item] : [], 1);
                    }
                }, 50);
            }
        } catch (ex) {
            console.error(ex);
        }
    }
    if (editPlaylist && (url.startsWith(VIDEO_API_PREFIX) || url.startsWith(VIDEO_DETAIL_API_PREFIX))) {
        const body = response instanceof Response ? await response.clone().text() : response.toString();
        try {
            const json = JSON.parse(body);
            if (json.code === 0) {
                setTimeout(() => {
                    handleRelatedVideos(Array.isArray(json.data.Related) ? json.data.Related : []);
                }, 50);
            }
        } catch (ex) {
            console.error(ex);
        }
    }
    if (editPlaylist && url.startsWith(TOTAL_PLAYER_API_PREFIX)) {
        const body = response instanceof Response ? await response.clone().text() : response.toString();
        try {
            const json = JSON.parse(body);
            if (json.code === 0) {
                let initialState = window.__INITIAL_STATE__;
                setTimeout(() => {
                    if (initialState?.sectionsInfo?.sections) {
                        initialState.sectionsInfo.sections.forEach((collection) => {
                            handleCollectionVideos(Array.isArray(collection.episodes) ? collection.episodes : []);
                        });
                    }
                }, 50);
            }
        } catch (ex) {
            console.error(ex);
        }
    }
    if (editVideo && url.startsWith(SPACE_VIDEO_API_PREFIX)) {
        const body = response instanceof Response ? await response.clone().text() : response.toString();
        try {
            const json = JSON.parse(body);
            if (json.code === 0) {
                setTimeout(() => {
                    handleVideos(Array.isArray(json.data.list?.vlist) ? json.data.list.vlist : []);
                }, 50);
            }
        } catch (ex) {
            console.error(ex);
        }
    }
    if (editVideo && (url.startsWith(SPACE_SERIES_API_PREFIX) || url.startsWith(SPACE_SEASONS_API_PREFIX))) {
        const body = response instanceof Response ? await response.clone().text() : response.toString();
        try {
            const json = JSON.parse(body);
            if (json.code === 0) {
                setTimeout(() => {
                    handleVideos(Array.isArray(json.data.archives) ? json.data.archives : []);
                }, 50);
            }
        } catch (ex) {
            console.error(ex);
        }
    }
    if (editVideo && url.startsWith(SPACE_HOME_COLLECTIONS_API_PREFIX)) {
        const body = response instanceof Response ? await response.clone().text() : response.toString();
        try {
            const json = JSON.parse(body);
            if (json.code === 0) {
                setTimeout(() => {
                    if (Array.isArray(json.data.items_lists?.season_list)) {
                        json.data.items_lists.season_list.forEach((collection) => {
                            handleVideos(Array.isArray(collection.archives) ? collection.archives : []);
                        });
                    }
                    if (Array.isArray(json.data.items_lists?.series_list)) {
                        json.data.items_lists.series_list.forEach((collection) => {
                            handleVideos(Array.isArray(collection.archives) ? collection.archives : []);
                        });
                    }
                }, 50);
            }
        } catch (ex) {
            console.error(ex);
        }
    }
};


const $fetch = window.fetch;

window.fetch = async function fetchHacker() {
    const response = await $fetch(...arguments);
    if (response.status === 200 && response.headers.get('content-type')?.includes('application/json')) {
        await handleResponse(response.url, response);
    }
    return response;
};

/**
 * @this XMLHttpRequest
 */
const onReadyStateChange = function onReadyStateChange() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200 && this.getAllResponseHeaders().split("\n").find((v) => v.toLowerCase().includes('content-type: application/json'))) {
        handleResponse(this.responseURL, this.response);
    }
};

const jsonpHacker = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeName.toLowerCase() !== 'script' || node.src.trim() === '') {
                return;
            }
            const u = new URL(node.src);
            if (u.searchParams.has('callback')) {
                const callbackName = u.searchParams.get('callback');
                const callback = window[callbackName];
                window[callbackName] = function (data) {
                    handleResponse(u.href, JSON.stringify(data));
                    callback(data);
                };
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    jsonpHacker.observe(document.head, {
        childList: true,
    });
});

window.XMLHttpRequest = class XMLHttpRequestHacker extends window.XMLHttpRequest {
    constructor() {
        super();
        this.addEventListener('readystatechange', onReadyStateChange.bind(this));
    }
};
