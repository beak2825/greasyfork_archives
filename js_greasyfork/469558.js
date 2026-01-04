// ==UserScript==
// @name         天猫淘宝视频或直播地址信息获取
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  获取https://detail.tmall.com/|https://item.taobao.com/上的视频地址或https://huodong.m.taobao.com/|https://taolive.taobao.com/上的直播播放地址
// @author       xTianMaoTaoBao
// @match        https://detail.tmall.com/*
// @match        https://detail.m.tmall.com/*
// @match        https://item.taobao.com/*
// @match        https://main.m.taobao.com/*
// @match        https://h5.m.taobao.com/*
// @match        https://huodong.m.taobao.com/*
// @match        https://taolive.taobao.com/*
// @match        https://m.tb.cn/*
// @icon         https://www.taobao.com/favicon.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469558/%E5%A4%A9%E7%8C%AB%E6%B7%98%E5%AE%9D%E8%A7%86%E9%A2%91%E6%88%96%E7%9B%B4%E6%92%AD%E5%9C%B0%E5%9D%80%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/469558/%E5%A4%A9%E7%8C%AB%E6%B7%98%E5%AE%9D%E8%A7%86%E9%A2%91%E6%88%96%E7%9B%B4%E6%92%AD%E5%9C%B0%E5%9D%80%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function copyData(str) {
        const input = document.createElement('input');
        input.value = str;
        document.body.appendChild(input);
        input.select();
        const ret = document.execCommand('Copy');
        input.remove();

        const el = document.querySelector('#copy-video-info');
        el.innerHTML = '已复制';
        setTimeout(function() {
            el.innerHTML = '';
        }, 5000);
    }

    function showLayer(videoUrl, title, result) {
        const el = document.querySelector('#capture-video-info');
        const dom = el || document.createElement('div');
        dom.setAttribute('id', 'capture-video-info');
        dom.setAttribute('style', 'position:fixed;top:0;right:0;z-index:900000001;background:white');
        if (videoUrl) {
            dom.innerHTML = '<button onclick="__copyVideoInfo__()">复制视频信息</button>' +
                '<div id="copy-video-info" style="color:greenyellow"></div>';
        } else if (title) {
            dom.innerHTML = '<div style="color:blue">没有视频</div>';
        } else if (result.ret && result.ret[0] === 'FAIL_SYS_USER_VALIDATE') {
            dom.innerHTML = '<div style="color:red">需要先登录淘宝</div>';
        } else {
            dom.innerHTML = '<div style="color:red">刷新页面试试吧</div>';
        }
        if (!el) {
            document.body.appendChild(dom);
        }
    }

    function getUrl(result, originalResult) {
        const title = result.data.item.title;
        const videoUrls = [];
        (result.data.item.videos || []).forEach(function(video) {
            videoUrls.push(video.url || video.video_url);
        });
        const videoUrl = videoUrls[0];
        window.__copyVideoInfo__ = function() {
            const refererUrl = location.href;
            copyData(JSON.stringify({
                from: document.domain.indexOf('.tmall.com') > -1 ? 'tmall' : 'taobao',
                title: result.data.item.title,
                url: videoUrl,
                refererUrl,
            }));
        }
        console.log(`视频数据。标题：${title}；地址：${videoUrl}；全部地址：`, videoUrls,
            `；全部数据：`, originalResult || result);
        return [videoUrl, title];
    }

    setTimeout(function() {
        if (window._DATA_Mdskip) {
            const result = {
                data: window._DATA_Mdskip
            };
            const ret = getUrl(result);
            const videoUrl = ret[0];
            const title = ret[1];

            showLayer(videoUrl, title, result);
        }
    }, 3000);

    function changeReqLink(script) {
        let src;
        Object.defineProperty(script, 'src', {
            get: function() {
                return src;
            },
            set: function(newVal) {
                src = newVal;
                script.setAttribute('src', newVal);
            },
        });
        const originalSetAttribute = script.setAttribute;
        script.setAttribute = function() {
            const args = Array.prototype.slice.call(arguments);
            if (args[0] === 'src' && (
                    args[1].includes('mtop.taobao.pcdetail.data.get') ||
                    args[1].includes('mtop.taobao.detail.getdetail') ||
                    args[1].includes('mtop.taobao.cloudvideo.video.queryforh5') ||
                    args[1].includes('mtop.tblive.live.detail.query') ||
                    args[1].includes('mtop.mediaplatform.live.livedetail')
                ) && args[1].includes('&callback=')) {
                const regex = /&callback=(.*)&/;
                const match = args[1].match(regex);
                if (match) {
                    const originalFuncName = match[1];
                    const newFuncName = originalFuncName + '_' + Date.now();
                    window[newFuncName] = function() {
                        const callbackArgs = Array.prototype.slice.call(arguments);
                        window[originalFuncName].apply(window, callbackArgs);
                        delete window[newFuncName];
                        const result = callbackArgs[0];
                        let title = result.data.title;
                        let videoUrl = result.data.liveUrl;
                        if (videoUrl) { // live
                            (result.data.liveUrlList || []).some(function(obj) {
                                if (obj.definition == 'hd') {
                                    videoUrl = obj.flvUrl;
                                    return true;
                                }
                                if (obj.definition == 'ud') {
                                    videoUrl = obj.flvUrl;
                                    return true;
                                }
                                if (obj.definition == 'md') {
                                    videoUrl = obj.flvUrl;
                                    return true;
                                }
                                if (obj.definition == 'ld') {
                                    videoUrl = obj.flvUrl;
                                    return true;
                                }
                                if (obj.definition == 'lld') {
                                    videoUrl = obj.flvUrl;
                                    return true;
                                }
                            });
                            window.__copyVideoInfo__ = function() {
                                let refererUrl = location.href;
                                const match = location.search.match(/&short_name=(.*)&bxsign=/);
                                if (match) {
                                    refererUrl = `https://m.tb.cn/${match[1]}`;
                                }
                                copyData(JSON.stringify({
                                    from: 'taobao',
                                    live_status: result.data.status,
                                    title: `${result.data.broadCaster.accountName} - ${title}`,
                                    url: videoUrl,
                                    replayUrl: result.data.replayUrl,
                                    refererUrl
                                }));
                            };
                            console.log(`直播数据。标题：${result.data.title}；状态：${result.data.status}；地址：${videoUrl}；`,
                                `视频流状态：${result.data.streamStatus}；回看地址：${result.data.replayUrl}；`,
                                `全部数据：`, result);
                        } else if (result.data.mp4Resources) {
                            const ret = getUrl({
                                data: {
                                    item: {
                                        title: document.title.replace('-淘宝网', ''),
                                        videos: result.data.mp4Resources
                                    }
                                }
                            }, result);
                            videoUrl = ret[0];
                            title = ret[1];
                        } else if ((result.data.apiStack && result.data.apiStack[0]) || result.data.item) { // Mobile/PC goods item detail
                            let ret;
                            if (result.data.apiStack && (!result.data.item || !result.data.item.videos)) {
                                const json = JSON.parse(result.data.apiStack[0].value);
                                if (json.global && json.global.data) {
                                    if (json.global.data.item && !json.global.data.item.title && result.data.item && result.data.item.title) {
                                        json.global.data.item.title = result.data.item.title;
                                    }
                                    ret = getUrl(json.global, result);
                                } else if (!result.data.item.videos) {
                                    ret = getUrl({
                                        data: {
                                            item: {
                                                title: result.data.item.title,
                                                videos: json.item.videos
                                            }
                                        }
                                    }, result);
                                }
                            } else {
                                ret = getUrl(result);
                            }
                            videoUrl = ret[0];
                            title = ret[1];
                        }
                        showLayer(videoUrl, title, result);
                    };
                    args[1] = args[1].replace(regex, '&callback=' + newFuncName + '&');
                }
            }
            originalSetAttribute.call(script, ...args);
        }
    }
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const dom = originalCreateElement.call(document, tagName);
        if (tagName.toLowerCase() === 'script') {
            changeReqLink(dom);
        }
        return dom;
    };
})();