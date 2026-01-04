    // ==UserScript==
    // @name         XXZD-autoplayer
    // @namespace    https://github.com/YeJiangnan1029/
    // @version      2023-12-15
    // @description  Automatically playing videos in XZZD, speedup and silence
    // @author       ybqaq
    // @match        https://courses.zju.edu.cn/course/*
    // @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
    // @license      MIT
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482327/XXZD-autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/482327/XXZD-autoplayer.meta.js
    // ==/UserScript==



    (function() {
        'use strict';

        // parameters
        var SPEEDUP = 4;

        (async function() {
            // 搜集所有视频链接
            var url_list = new Array();
            var wrapper = await elmGetter.get("div.module.ng-scope ul");
            await elmGetter.each("li.ng-scope", wrapper, (chapter_module, isInserted) => {
                // console.log(chapter_module);
                var parent_node = chapter_module.querySelector("ul.activity-list.module-activity");
                elmGetter.each("a.activity-title", parent_node, (url, ii) => {
                    if (!url_list.includes(url)) {
                        url_list.push(url);
                    }
                });
            });
            // for (var i = 0, len = url_list.length; i < len; i++) {
            //     var url = url_list[i];
            //     console.log(url.innerText);
            // }
            var curUrl = await elmGetter.get("li.activity.ng-scope.active a.activity-title");
            // console.log(curUrl.innerText);
            let curIndex = url_list.indexOf(curUrl);
            if (curIndex !== -1) {
                url_list.splice(0, curIndex);
            }

            // 播放当前video
            var video = await elmGetter.get("video");
            url_list.shift();
            playVideo(video);

            // 播放下一个video的函数，绑定在video的ended事件
            async function playNextVideo() {
                console.log('ended play');
                // 点击下一个页面
                if (url_list.length > 0) {
                    var nexturl = url_list.shift();
                    nexturl.click();
                    console.log("next url clicked");
                }

                // 寻找当前页面视频
                var video = await elmGetter.get("video");
                playVideo(video);

            }

            async function playVideo(video) {
                console.log(video);
                video.muted = true;
                video.playbackRate = SPEEDUP;

                // 设置播放完毕的回调函数，自动播放下一个
                video.addEventListener('ended', playNextVideo);

                // 设置播放速率 使用闭包包装 meetCount 变量
                var meetCountModule = (function() {
                    var meetCount = 0;

                    function setVideoSpeed(ele_video, speed) {
                        if (ele_video.playbackRate === speed) {
                            meetCount += 1;
                        } else {
                            ele_video.playbackRate = speed;
                        }

                        if (meetCount >= 3) {
                            clearInterval(t1);
                        }
                    }
                    return {
                        setVideoSpeed: setVideoSpeed,
                        getMeetCount: function() {
                            return meetCount;
                        }
                    };
                })();
                let t1 = setInterval(() => meetCountModule.setVideoSpeed(video, SPEEDUP), 2000);

                // 模拟点击按钮，防止被判为拉动进度条
                var btn_play = await elmGetter.get(".mvp-toggle-play.mvp-first-btn-margin");

                console.log("检测到播放按钮");
                console.log(btn_play);

                // 暂停时自动点击播放
                function aotuResumeVideo(ele_video, ele_btn) {
                    // console.log(video.paused);
                    if (ele_video.ended) {
                        clearInterval(t2);
                    } else if (ele_video.paused) {
                        ele_btn.click();
                        console.log("clicked");
                    }

                }
                let t2 = setInterval(() => aotuResumeVideo(video, btn_play), 2000);
            }

        })();


        // cxxjackie大佬编写的异步获取元素的库，由于greasy fork不让直接引用，故贴在代码内
        // https://scriptcat.org/lib/513/2.0.0/ElementGetter.js
        var elmGetter = function() {
            const win = window.unsafeWindow || document.defaultView || window;
            const doc = win.document;
            const listeners = new WeakMap();
            let mode = 'css';
            let $;
            const elProto = win.Element.prototype;
            const matches = elProto.matches ||
                elProto.matchesSelector ||
                elProto.webkitMatchesSelector ||
                elProto.mozMatchesSelector ||
                elProto.oMatchesSelector;
            const MutationObs = win.MutationObserver ||
                win.WebkitMutationObserver ||
                win.MozMutationObserver;

            function addObserver(target, callback) {
                const observer = new MutationObs(mutations => {
                    for (const mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            callback(mutation.target);
                            if (observer.canceled) return;
                        }
                        for (const node of mutation.addedNodes) {
                            if (node instanceof Element) callback(node);
                            if (observer.canceled) return;
                        }
                    }
                });
                observer.canceled = false;
                observer.observe(target, { childList: true, subtree: true, attributes: true });
                return () => {
                    observer.canceled = true;
                    observer.disconnect();
                };
            }

            function addFilter(target, filter) {
                let listener = listeners.get(target);
                if (!listener) {
                    listener = {
                        filters: new Set(),
                        remove: addObserver(target, el => listener.filters.forEach(f => f(el)))
                    };
                    listeners.set(target, listener);
                }
                listener.filters.add(filter);
            }

            function removeFilter(target, filter) {
                const listener = listeners.get(target);
                if (!listener) return;
                listener.filters.delete(filter);
                if (!listener.filters.size) {
                    listener.remove();
                    listeners.delete(target);
                }
            }

            function query(all, selector, parent, includeParent, curMode) {
                switch (curMode) {
                    case 'css':
                        const checkParent = includeParent && matches.call(parent, selector);
                        if (all) {
                            const queryAll = parent.querySelectorAll(selector);
                            return checkParent ? [parent, ...queryAll] : [...queryAll];
                        }
                        return checkParent ? parent : parent.querySelector(selector);
                    case 'jquery':
                        let jNodes = $(includeParent ? parent : []);
                        jNodes = jNodes.add([...parent.querySelectorAll('*')]).filter(selector);
                        if (all) return $.map(jNodes, el => $(el));
                        return jNodes.length ? $(jNodes.get(0)) : null;
                    case 'xpath':
                        const ownerDoc = parent.ownerDocument || parent;
                        selector += '/self::*';
                        if (all) {
                            const xPathResult = ownerDoc.evaluate(selector, parent, null, 7, null);
                            const result = [];
                            for (let i = 0; i < xPathResult.snapshotLength; i++) {
                                result.push(xPathResult.snapshotItem(i));
                            }
                            return result;
                        }
                        return ownerDoc.evaluate(selector, parent, null, 9, null).singleNodeValue;
                }
            }

            function isJquery(jq) {
                return jq && jq.fn && typeof jq.fn.jquery === 'string';
            }

            function getOne(selector, parent, timeout) {
                const curMode = mode;
                return new Promise(resolve => {
                    const node = query(false, selector, parent, false, curMode);
                    if (node) return resolve(node);
                    let timer;
                    const filter = el => {
                        const node = query(false, selector, el, true, curMode);
                        if (node) {
                            removeFilter(parent, filter);
                            timer && clearTimeout(timer);
                            resolve(node);
                        }
                    };
                    addFilter(parent, filter);
                    if (timeout > 0) {
                        timer = setTimeout(() => {
                            removeFilter(parent, filter);
                            resolve(null);
                        }, timeout);
                    }
                });
            }
            return {
                get currentSelector() {
                    return mode;
                },
                get(selector, ...args) {
                    let parent = typeof args[0] !== 'number' && args.shift() || doc;
                    if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);
                    const timeout = args[0] || 0;
                    if (Array.isArray(selector)) {
                        return Promise.all(selector.map(s => getOne(s, parent, timeout)));
                    }
                    return getOne(selector, parent, timeout);
                },
                each(selector, ...args) {
                    let parent = typeof args[0] !== 'function' && args.shift() || doc;
                    if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);
                    const callback = args[0];
                    const curMode = mode;
                    const refs = new WeakSet();
                    for (const node of query(true, selector, parent, false, curMode)) {
                        refs.add(curMode === 'jquery' ? node.get(0) : node);
                        if (callback(node, false) === false) return;
                    }
                    const filter = el => {
                        for (const node of query(true, selector, el, true, curMode)) {
                            const _el = curMode === 'jquery' ? node.get(0) : node;
                            if (refs.has(_el)) break;
                            refs.add(_el);
                            if (callback(node, true) === false) {
                                return removeFilter(parent, filter);
                            }
                        }
                    };
                    addFilter(parent, filter);
                },
                create(domString, ...args) {
                    const returnList = typeof args[0] === 'boolean' && args.shift();
                    const parent = args[0];
                    const template = doc.createElement('template');
                    template.innerHTML = domString;
                    const node = template.content.firstElementChild;
                    if (!node) return null;
                    parent ? parent.appendChild(node) : node.remove();
                    if (returnList) {
                        const list = {};
                        node.querySelectorAll('[id]').forEach(el => list[el.id] = el);
                        list[0] = node;
                        return list;
                    }
                    return node;
                },
                selector(desc) {
                    switch (true) {
                        case isJquery(desc):
                            $ = desc;
                            return mode = 'jquery';
                        case !desc || typeof desc.toLowerCase !== 'function':
                            return mode = 'css';
                        case desc.toLowerCase() === 'jquery':
                            for (const jq of[window.jQuery, window.$, win.jQuery, win.$]) {
                                if (isJquery(jq)) {
                                    $ = jq;
                                    break;
                                };
                            }
                            return mode = $ ? 'jquery' : 'css';
                        case desc.toLowerCase() === 'xpath':
                            return mode = 'xpath';
                        default:
                            return mode = 'css';
                    }
                }
            };
        }();


    })();