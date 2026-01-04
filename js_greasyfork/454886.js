// ==UserScript==
// @name         芯位教育全自动刷网课-后台静音播放
// @namespace    https://github.com/lingPoint/51xinwei
// @version      2.1.1
// @description  适配后台播放和默认静音;适配新版UI；主要功能：芯位教育自动播放下一课，跳过作业、文档、问卷；专注于帮助大学生从网课中释放出来 让自己的时间把握在自己的手中。
// @author       Zerox
// @match        *://*.51xinwei.com/*
// @icon         *://*.51xinwei.com/*
// @grant        none
// @run-at document-end
// @license GPL-3.0 license
// @downloadURL https://update.greasyfork.org/scripts/454886/%E8%8A%AF%E4%BD%8D%E6%95%99%E8%82%B2%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E7%BD%91%E8%AF%BE-%E5%90%8E%E5%8F%B0%E9%9D%99%E9%9F%B3%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/454886/%E8%8A%AF%E4%BD%8D%E6%95%99%E8%82%B2%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E7%BD%91%E8%AF%BE-%E5%90%8E%E5%8F%B0%E9%9D%99%E9%9F%B3%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

const createControlPanel = () => {
    const controlPanel = document.createElement('div');
    controlPanel.id = 'controlPanel';
    controlPanel.style.position = 'fixed';
    controlPanel.style.zIndex = '1000';
    controlPanel.style.padding = '10px';
    const label = document.createElement('label');
    label.textContent = '吉利校招内推码：NTAYzwl';
    controlPanel.appendChild(label);
    return controlPanel;
};

const placeControlPanel = (panel) => {
    const windowHeight = window.innerHeight;
    panel.style.top = `${windowHeight - panel.offsetHeight - 20}px`;
};

const controlPanel = createControlPanel();
document.body.appendChild(controlPanel);
placeControlPanel(controlPanel);

(function () {
    'use strict';
    //window.alert("加载成功！");
    const doc2 = document;
    const cscs = doc2.querySelector('body');
    let observer = new MutationObserver(handler);
    const options = { childList: true }
    observer.observe(cscs, options)
})();

function handler(mutationRecordList) {
    main()
    mute()
}

setInterval(function () {
    main()
    mute()
}, 1000);

function main() {
    var activeMenutrim = document.querySelector('#menu_tarr_content .courseware_menu_item.pull-left.ng-scope.active');

    if (activeMenutrim && activeMenutrim.innerText.trim() !== "") {

        console.log("老版界面");
        const activeMenu = document.querySelector('#menu_tarr_content .courseware_menu_item.pull-left.ng-scope.active').innerText;
        if (activeMenu === ' 文档' || activeMenu === ' 作业' || activeMenu === ' 问卷') {
            jumpToNext();
        } else if (document.querySelector('.layui-layer-title') !== null) {
            document.querySelectorAll('.layui-layer-btn0')[0].click();
        }
    } else {
        if (document.querySelector('.left') !== null) {
            var leftElements = document.querySelectorAll('.left');
            leftElements.forEach(function (element) {
                element.click();
            });

            console.log("新版界面");
        }

    }
}

function jumpToNext() {
    const courseChapterItems = document.querySelectorAll('.course_chapter_item.user-no-select.ng-scope');
    const activeItemText = document.querySelector('.course_chapter_item.user-no-select.ng-scope.active').innerText;
    for (let i = 0; i < courseChapterItems.length; i++) {
        if (activeItemText === courseChapterItems[i].innerText) {
            courseChapterItems[i + 1].children[1].click();
            break;
        }
    }
}

function mute() {
    const mButt = document.querySelector('.vjs-mute-control');
    if (mButt.getAttribute('title') === '静音') {
        mButt.click();
    }
}