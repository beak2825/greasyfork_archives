// ==UserScript==
// @name         电信网上大学自由学
// @namespace    http://kc.zhixueyun.com/
// @version      0.1
// @description  去除单标签页播放限制、顺序观看限制、考试页面复制粘贴限制
// @author       als
// @match        https://kc.zhixueyun.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhixueyun.com
// @grant        none
// @run-at       document-end
// @license      GPL v3
// @downloadURL https://update.greasyfork.org/scripts/473635/%E7%94%B5%E4%BF%A1%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E8%87%AA%E7%94%B1%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/473635/%E7%94%B5%E4%BF%A1%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E8%87%AA%E7%94%B1%E5%AD%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeCourseLock() {
        if (!window.app || !window.app._modules) return false;
        for (let k in window.app._modules) {
            if (k.startsWith('train-new/class-detail--')) {
                let m = window.app._modules[k];
                let old_changed = m.store.models.chapterList.changed;
                m.store.models.chapterList.changed = () => {
                    for (let d of m.store.models.chapterList.data) {
                        console.log(d);
                        d.isLock = false;
                    }
                    old_changed.call(m.store.models.chapterList);
                }
                m.store.models.chapterList.changed();
                return true;
            }
        }
        return false;
    }

    function removeVideoLock() {
        if (!window.app || !window.app._modules) return false;
        for (let k in window.app._modules) {
            if (k.startsWith('study/course/detail--')) {
                let m = window.app._modules[k];
                let old_changed = m.store.models.course.changed;
                m.store.models.course.changed = () => {
                    for (let chapter of m.store.models.course.data.courseChapters) {
                        for (let section of chapter.courseChapterSections) {
                            console.log(section);
                            section.locked = false;
                        }
                    }
                    old_changed.call(m.store.models.course);
                }
                m.store.models.course.changed();
                return true;
            }
        }
        return false;
    }

    function removeOneTabRestriction() {
        if (!require) return false;
        try {
            require('./app/study/course/detail/player-helper').WS.multipleClientStudy = (e) => {};
        } catch {
            return false;
        }
        return true;
    }

    function enableCopy() {
        document.querySelectorAll('div.preview-content').forEach(elem => {
            elem.oncontextmenu = () => {};
            elem.oncopy = () => {};
            elem.oncut = () => {};
            elem.onpaste = () => {};
        });
    }

    function waitForTrue(fn) {
        if (!fn()) {
            setTimeout(waitForTrue, 500, fn);
        }
    }


    if (window.location.hash.startsWith('#/train-new/class-detail/')) {
        waitForTrue(removeCourseLock);
    } else if (window.location.hash.startsWith('#/study/course/detail/')) {
        waitForTrue(removeVideoLock);
        waitForTrue(removeOneTabRestriction);
    } else if (window.location.hash.startsWith('#/exam/exam/')) {
        document.body.addEventListener('contextmenu', (e) => {
            enableCopy();
        }, true);
        document.body.addEventListener('copy', (e) => {
            enableCopy();
        }, true);
        document.body.addEventListener('cut', (e) => {
            enableCopy();
        }, true);
        document.body.addEventListener('paste', (e) => {
            enableCopy();
        }, true);
    }
})();