// ==UserScript==
// @name         B站动态操作栏跟随
// @namespace    http://tampermonkey.net/
// @version      2024-07-03-1
// @description  B站浏览动态优化
// @author       Liuhl1mx
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/v/topic/detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498006/B%E7%AB%99%E5%8A%A8%E6%80%81%E6%93%8D%E4%BD%9C%E6%A0%8F%E8%B7%9F%E9%9A%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/498006/B%E7%AB%99%E5%8A%A8%E6%80%81%E6%93%8D%E4%BD%9C%E6%A0%8F%E8%B7%9F%E9%9A%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class DynamicLoad {
        dynamicLoaderObserver;

        constructor(node, deep=false) {
            this.#updataObserver(node, deep);
        }

        get items() {
            return null;
        }

        close() {
            this.dynamicLoaderObserver.disconnect();
        }

        #updataObserver(node, deep) {
            this.dynamicLoaderObserver = new MutationObserver((mutation_records) => {
                const append_dynamic_list = mutation_records.reduce((acc, curr) => {
                    acc.push(...Array.from(curr.addedNodes));
                    return acc;
                }, []);
                window.dispatchEvent(new CustomEvent('dynamicUpdate', {
                    detail: append_dynamic_list
                }))
            });
            this.dynamicLoaderObserver.observe(node, { childList: true, subtree: deep });
        }
    }

    function waitForElement(selector, callback) {
        const interval = setInterval(()=>{
            const element = document.querySelector(selector);
            if (element instanceof Node) {
                clearInterval(interval);
                callback(element)
            }
        }, 100)
        }

    // B站个人动态
    function main1() {
        waitForElement('.bili-dyn-list__items', (element) => {
            const section_load = new DynamicLoad(element.parentNode.parentNode);
            let dyn_load = new DynamicLoad(element);
            if (element) {
                GM_addStyle(`
    .bili-dyn-item__footer {
    padding: 0 40px 0 88px;
    position: sticky;
    top: 64px;
    z-index: 5;
    background-color: white;
    }`)
            }
            window.addEventListener('dynamicUpdate', (e) => {
                const append_list = e.detail;
                // console.log('append_list: ', append_list);
                append_list.forEach((item) => {
                    // 动态切换时,切换监听当前动态列
                    if(item instanceof Element && item.classList.contains('bili-dyn-list')) {
                        //console.log('切换动态: ', item);
                        if (dyn_load) dyn_load.close();
                        dyn_load = new DynamicLoad(item.querySelector('.bili-dyn-list__items'));
                    }
                    // 动态内容更新时，修改动态
                    if(item instanceof Element && item.classList.contains('bili-dyn-list__item')) {
                        //console.log('修改动态: ', item);
                        const footer = item.querySelector('.bili-dyn-item__footer');
                        const mm = item.querySelector('.bili-dyn-item__main')
                        const dyn = item.querySelector('.bili-dyn-item');
                        if (footer && mm && dyn) {
                            dyn.insertBefore(footer, mm);
                            dyn.insertBefore(mm, footer);
                            // 左键和右键自动滚动到对应动态主体
                            const comment_btn = footer.querySelector('.bili-dyn-action.comment');
                            if (comment_btn) {
                                footer.querySelector('.bili-dyn-action.comment').addEventListener('contextmenu', function(event) {
                                    event.preventDefault();
                                    if (dyn.querySelector('.bili-dyn-item__panel')) {
                                        mm.scrollIntoView({ behavior: 'smooth', block: 'start'});
                                    }
                                });
                                footer.querySelector('.bili-dyn-action.comment').addEventListener('click', function(event) {
                                    if (dyn.querySelector('.bili-dyn-item__panel')) {
                                        mm.scrollIntoView({ behavior: 'instant', block: 'start'});
                                    }
                                });
                            }
                        }
                    }
                })
            })
            //console.log('动态已修改');
        })
    }

    //console.log('用户动态界面');
    function main2() {
        let dyn_load;
        // 动态界面直接出现
        if (window.location.href.indexOf('dynamic') !== -1) {
            waitForElement('.bili-dyn-list__items', (element) => {
                dyn_load = new DynamicLoad(element);
                if (element) {
                    GM_addStyle(`
    .bili-dyn-item__footer {
    padding: 0 40px 0 88px;
    position: sticky;
    top: 64px;
    z-index: 5;
    background-color: white;
    }`)
                }
                window.addEventListener('dynamicUpdate', (e) => {
                    const append_list = e.detail;
                    // console.log('append_list: ', append_list);
                    append_list.forEach((item) => {
                        // 动态内容更新时，修改动态
                        const footer = item.querySelector('.bili-dyn-item__footer');
                        const mm = item.querySelector('.bili-dyn-item__main')
                        const dyn = item.querySelector('.bili-dyn-item');
                        if (footer && mm && dyn) {
                            dyn.insertBefore(footer, mm);
                            dyn.insertBefore(mm, footer);
                            // 左键和右键自动滚动到对应动态主体
                            const comment_btn = footer.querySelector('.bili-dyn-action.comment');
                            if (comment_btn) {
                                footer.querySelector('.bili-dyn-action.comment').addEventListener('contextmenu', function(event) {
                                    event.preventDefault();
                                    if (dyn.querySelector('.bili-dyn-item__panel')) {
                                        mm.scrollIntoView({ behavior: 'smooth', block: 'start'});
                                    }
                                });
                                footer.querySelector('.bili-dyn-action.comment').addEventListener('click', function(event) {
                                    if (dyn.querySelector('.bili-dyn-item__panel')) {
                                        mm.scrollIntoView({ behavior: 'instant', block: 'start'});
                                    }
                                });
                            }
                        }

                    })
                })
                //console.log('动态已修改');
            })
        }
        // 点击切换动态界面
        let originPush = history.pushState;
        history.pushState = function (...arg) {
            //console.log("改变了路由", arg[2]);
            if (arg[2].indexOf('dynamic') !== -1) {
                waitForElement('.bili-dyn-list__items', (element) => {
                    dyn_load = new DynamicLoad(element);
                    if (element) {
                        GM_addStyle(`
    .bili-dyn-item__footer {
    padding: 0 40px 0 88px;
    position: sticky;
    top: 64px;
    z-index: 5;
    background-color: white;
    }`)
                    }
                    window.addEventListener('dynamicUpdate', (e) => {
                        const append_list = e.detail;
                        // console.log('append_list: ', append_list);
                        append_list.forEach((item) => {
                            // 动态内容更新时，修改动态
                            const footer = item.querySelector('.bili-dyn-item__footer');
                            const mm = item.querySelector('.bili-dyn-item__main')
                            const dyn = item.querySelector('.bili-dyn-item');
                            if (footer && mm && dyn) {
                                dyn.insertBefore(footer, mm);
                                dyn.insertBefore(mm, footer);
                                // 左键和右键自动滚动到对应动态主体
                                const comment_btn = footer.querySelector('.bili-dyn-action.comment');
                                if (comment_btn) {
                                    footer.querySelector('.bili-dyn-action.comment').addEventListener('contextmenu', function(event) {
                                        event.preventDefault();
                                        if (dyn.querySelector('.bili-dyn-item__panel')) {
                                            mm.scrollIntoView({ behavior: 'smooth', block: 'start'});
                                        }
                                    });
                                    footer.querySelector('.bili-dyn-action.comment').addEventListener('click', function(event) {
                                        if (dyn.querySelector('.bili-dyn-item__panel')) {
                                            mm.scrollIntoView({ behavior: 'instant', block: 'start'});
                                        }
                                    });
                                }
                            }

                        })
                    })
                    //console.log('动态已修改');
                })
            } else if (dyn_load){
                dyn_load.close();
                //console.log('监听器释放');
            }
            return originPush.call(this, ...arg);
        };
    }

    // 话题界面
    function main3() {
        waitForElement('div.topic-list__flow-list > div', (element) => {
            const processItem = (item) => {
                    // 动态内容更新时，修改动态
                    if(item instanceof Element && item.classList.contains('list__topic-card')) {
                        // console.log('修改动态: ', item);
                        const footer = item.querySelector('.bili-dyn-item__footer');
                        const mm = item.querySelector('.bili-dyn-item__main')
                        const dyn = item.querySelector('.bili-dyn-item');
                        if (footer && mm && dyn) {
                            dyn.insertBefore(footer, mm);
                            dyn.insertBefore(mm, footer);
                            // 左键和右键自动滚动到对应动态主体
                            const comment_btn = footer.querySelector('.bili-dyn-action.comment');
                            if (comment_btn) {
                                footer.querySelector('.bili-dyn-action.comment').addEventListener('contextmenu', function(event) {
                                    event.preventDefault();
                                    if (dyn.querySelector('.bili-dyn-item__panel')) {
                                        mm.scrollIntoView({ behavior: 'smooth', block: 'start'});
                                    }
                                });
                                footer.querySelector('.bili-dyn-action.comment').addEventListener('click', function(event) {
                                    if (dyn.querySelector('.bili-dyn-item__panel')) {
                                        mm.scrollIntoView({ behavior: 'instant', block: 'start'});
                                    }
                                });
                            }
                        }
                    }
                }
            element.querySelectorAll('.list__topic-card').forEach(item => processItem(item));
            // console.log('element load: ', element.parentNode.parentNode);
            let dyn_load = new DynamicLoad(element.parentNode.parentNode, true);
            if (element) {
                GM_addStyle(`
    .bili-dyn-item__footer {
    padding: 0 40px 0 88px;
    position: sticky;
    top: 64px;
    z-index: 5;
    background-color: white;
    }`)
            }
            window.addEventListener('dynamicUpdate', (e) => {
                const append_list = e.detail;
                append_list.forEach(item => processItem(item))
            })
            //console.log('动态已修改');
        })
    }
    if (window.location.href.indexOf('t.bilibili.com') !== -1) {
        //console.log('个人动态界面');
        main1();
    }else if (window.location.href.indexOf('space.bilibili.com') !== -1) {
        //console.log('用户动态界面');
        main2();
    }else if (window.location.href.indexOf('www.bilibili.com/v/topic/detail') !== -1) {
        //console.log('话题界面');
        main3();
    }
})();
