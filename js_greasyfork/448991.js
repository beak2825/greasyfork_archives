// ==UserScript==
// @name         Custom Title
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  【使用前先看介绍/有问题可反馈】自定义标题 (Custom Title): 支持自定义标题
// @author       cc
// @include      *
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/448991/Custom%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/448991/Custom%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // storage
    let storage;
    const _VERSION_ = '1.0.0';
    const focusKey = 'KeyT';            // T
    const clearKey = 'Digit1';          // 1
    const expiredTime = 30 * 86400 * 1000;      // 30 day
    const interval = 86400 * 1000;      // 1 day

    function notify(msg) {
        console.log(`%c${msg}`, 'background-color: yellow; color: black;');
    }

    function getDefaultStorage() {
        return {
            lastUpdateTime: new Date().getTime(),
            titleInfoDict: {},
        }
    }

    function loadStorage() {
        storage = GM_getValue('storage');
        if (!storage) {
            storage = getDefaultStorage();
            GM_setValue('storage', storage);
            notify('[Custom Title]: storage initialized');
            console.log(storage);
        } else {
            notify('[Custom Title]: storage down here');
            console.log(storage);
            clearExpiredTitle();
        }
    }

    function applyTitle() {
        let titleInfo = storage.titleInfoDict[location.href];
        if (titleInfo && document.title !== titleInfo.newTitle) {
            document.title = titleInfo.newTitle;
            notify('[Custom Title]: applied title');
        } else if (titleInfo) {
            notify('[Custom Title]: no need to replace title');
        } else {
            notify('[Custom Title]: no title can be appied');
        }
    }

    // functions
    function updateTitle() {
        let titleInfo = storage.titleInfoDict[location.href];
        let newTitle = prompt('请输入需要为此网页自定义的标题，可通过 \'Ctrl+Shift+T\' 或直接输入空以取消：', titleInfo ? titleInfo.newTitle : document.title);
        if (newTitle) {
            storage.titleInfoDict[location.href] = {
                oldTitle: titleInfo ? titleInfo.oldTitle : document.title,
                newTitle: newTitle,
                lastUpdateTime: new Date().getTime(),
            };
            document.title = newTitle;
            GM_setValue('storage', storage);
            notify('[Custom Title]: updated title');
        } else if (newTitle !== null && newTitle.constructor === String) {
            removeTitle();
        }
    }

    function removeTitle() {
        let titleInfo = storage.titleInfoDict[location.href];
        if (titleInfo) {
            let res = confirm('是否为此网页移除自定义标题？');
            if (res) {
                document.title = titleInfo.oldTitle;
                delete storage.titleInfoDict[location.href];
                GM_setValue('storage', storage);
                notify('[Custom Title]: removed title');
            }
        } else {
            alert('你还未为此网页设置自定义标题');
        }
    }

    function removeAllTitles() {
        let res = confirm('是否清除所有自定义标题？');
        if (res) {
            let titleInfo = storage.titleInfoDict[location.href];
            if (titleInfo) {
                document.title = titleInfo.oldTitle;
            }
            storage = getDefaultStorage();
            GM_setValue('storage', storage);
            alert('已清除所有自定义标题');
            notify('[Custom Title]: removed all titles');
        }
    }

    function clearExpiredTitle() {
        let currentTime = new Date().getTime();
        if (storage.lastUpdateTime + interval < currentTime) {
            let titleInfoDict = storage.titleInfoDict;
            for (let key of Object.keys(titleInfoDict)) {
                if (titleInfoDict[key].lastUpdateTime + expiredTime < currentTime) {
                    delete titleInfoDict[key];
                }
            }
            storage.titleInfoDict = titleInfoDict;
            storage.lastUpdateTime = currentTime;
            GM_setValue('storage', storage);
            notify('[Custom Title]: cleared expired titles');
        }
    }

    function bindObserver() {
        // key observer
        document.onkeydown = function(e) {
            console.log(e);

            if (e.ctrlKey && e.shiftKey && e.code == focusKey) {
                e.preventDefault();
                removeTitle();
                notify('[Custom Title]: trigger remove title');
            } else if (e.ctrlKey && e.code == focusKey) {
                e.preventDefault();
                updateTitle();
                notify('[Custom Title]: trigger update title');
            } else if (e.ctrlKey && e.code == clearKey) {
                e.preventDefault();
                removeAllTitles();
                notify('[Custom Title]: trigger remove all titles');
            }
        }
        // title observer
        let title = document.querySelector('title');
        let observer = new MutationObserver(function(mutations) {
            console.log(mutations);
            applyTitle();
            notify('[Custom Title]: trigger title change event');
        });
        let config = { subtree: true, characterData: true, childList: true };
        observer.observe(title, config);

        // hash observer
        window.onhashchange = function() {
            applyTitle();
            notify('[Custom Title]: trigger hash change event');
        };

        // call apply again
        applyTitle();
    }

    // main function
    document.onreadystatechange = function() {
        if (document.readyState === 'complete') {
            notify(`[Custom Title]: version ${_VERSION_}`);
            loadStorage();
            applyTitle();
            bindObserver();
        }
    }
})();