// ==UserScript==
// @name         油管合集列表播放时长统计
// @namespace    http://tampermonkey.net/
// @version      2024-01-20
// @description  油管playlist合集视频总时长统计
// @author       zchennnn@gmail.com
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485354/%E6%B2%B9%E7%AE%A1%E5%90%88%E9%9B%86%E5%88%97%E8%A1%A8%E6%92%AD%E6%94%BE%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/485354/%E6%B2%B9%E7%AE%A1%E5%90%88%E9%9B%86%E5%88%97%E8%A1%A8%E6%92%AD%E6%94%BE%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const continuationTag = 'continuationItemRenderer';
    const playListInfoElementName = 'ytd-playlist-byline-renderer';
    const appTagName = 'ytd-app';

    const checkPathname = () => {
        return location.pathname === '/playlist'
    }

    let youtubePlayList = [];
    let isLoadingAll = false;

    const continuationFilter = list => {
        if (list[list.length - 1][continuationTag]) {
            return list.slice(0, list.length - 1);
        }
        isLoadingAll = false;
        return list;
    }

    const getInitialList = (data) => {
        const list = data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents
            .map(item => item);
        return continuationFilter(list);
    }

    // 计算总时长
    const calcDurationByLoadedList = (list) => {
        return list.reduce((sum, item) => {
            const s = item.playlistVideoRenderer.lengthSeconds
            const duration = s ? parseInt(s) : 0;
            return sum + duration
        }, 0)
    }

    const toDouble = (num) => num > 9 ? String(num) : `0${num}`;

    const seconds2Time = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return seconds > 3600 ? `${h}:${toDouble(m)}:${toDouble(s)}` : `${m}:${toDouble(s)}`
    }

    const getVideoListInfo = () => {
        const videoList = youtubePlayList;
        const videoListInfo = {
            // 已加载视频个数
            loaded: 0,
            // 已加载视频总时长
            loadedDuration: 0
        }
        if (!videoList.length) {
            return videoListInfo;
        }
        videoListInfo.loaded = videoList.length;
        videoListInfo.loadedDuration = calcDurationByLoadedList(videoList);
        return videoListInfo;
    }

    const scrollToBottom = () => {
        const $app = document.getElementsByTagName(appTagName)[0];
        if (!$app) {
            return;
        }
        window.scrollTo(0, $app.offsetHeight);
    }

    let $oldInfo;

    const setVideoInfo = () => {
        const $youtubeInfo = document.getElementsByTagName(playListInfoElementName)[0];
        if ($youtubeInfo === undefined) {
            if (checkPathname()) {
                setTimeout(setVideoInfo, 500);
            }
            return;
        };
        const videoListInfo = getVideoListInfo();

        const $newInfo = document.createElement('p');
        $newInfo.innerHTML = `总时长: ${seconds2Time(videoListInfo.loadedDuration)} (${videoListInfo.loaded}个视频)`

        const $buttonAll = document.createElement('a');
        $buttonAll.innerHTML = '统计全部';
        $buttonAll.style.cursor = 'pointer';
        $buttonAll.style.marginLeft = '5px';
        $buttonAll.addEventListener('click', () => {
            console.log('startLoading...');
            isLoadingAll = true;
            scrollToBottom();
        })

        $newInfo.appendChild($buttonAll);
        if ($oldInfo !== undefined) {
            $youtubeInfo.parentNode.removeChild($oldInfo);
        }
        $youtubeInfo.parentNode.appendChild($newInfo);
        $oldInfo = $newInfo;
    }

    const doInit = (list) => {
        youtubePlayList = [];
        youtubePlayList = getInitialList(list);
        console.log('doInit', getVideoListInfo());
        setVideoInfo();
    }

    const doContinuation = (list) => {
        youtubePlayList = [].concat(youtubePlayList, continuationFilter(list));
        console.log('doContinuation', getVideoListInfo());
        setVideoInfo();
    }

    if (checkPathname()) {
        doInit(window.ytInitialData);
    }

    // 拦截接口请求
    const { fetch: originalFetch } = window;
    window.fetch = (...args) => {
        try {
            const [resource, config] = args;
            let interceptorRequest;

            if (checkPathname() && /browse/.test(resource.url)) {
                interceptorRequest = resource.clone();
            };


            const fetchPromise = originalFetch(resource, config);

            if (!interceptorRequest) {
                return fetchPromise;
            }
            return fetchPromise.then(response => {
                const interceptorResponse = response.clone();
                interceptorRequest.json().then(body => {
                    if (body.browseId) {
                        interceptorResponse.json().then(res => {
                            doInit(res);
                        })
                    } else if (body.continuation) {
                        interceptorResponse.json().then(res => {
                            if (res.onResponseReceivedActions) {
                                doContinuation(res.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems);
                                if (isLoadingAll) {
                                    setTimeout(scrollToBottom, 10)
                                }
                            };
                        })
                    }
                })
                return Promise.resolve(response);
            })
        } catch (e) {
            console.error(e)
        }
    };

})();