// ==UserScript==
// @name         Bilibili Web Fullscreen Button HotKey
// @version      1.5
// @description  Add the ability to control the video in web fullscreen by pressing B key
// @author       SDSC0623
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @namespace    https://greasyfork.org/users/1496319
// @downloadURL https://update.greasyfork.org/scripts/543002/Bilibili%20Web%20Fullscreen%20Button%20HotKey.user.js
// @updateURL https://update.greasyfork.org/scripts/543002/Bilibili%20Web%20Fullscreen%20Button%20HotKey.meta.js
// ==/UserScript==
let webFullButton;
let menuList;
let time;
let buttonListener = function () {
    webFullButton = document.getElementsByClassName('bpx-player-ctrl-web')[0];
    menuList = document.getElementsByClassName('bpx-player-video-wrap')[0];
    if (webFullButton && menuList) {
        menuList.addEventListener('mouseup', menuListener);
        clearInterval(time);
        init();
    }
};

(function () {
    'use strict';
    time = setInterval(buttonListener, 100);
    document.addEventListener('keydown', keyboardPress, true);
})();

function menuListener(e) {
    if (e.button === 2) {
        setTimeout(() => {
            document.getElementsByClassName('bpx-player-contextmenu')[0].children[3].onclick = function () {
                let hotKeyList = document.getElementsByClassName('bpx-player-hotkey-panel-content')[0];
                let hotKeyItem = hotKeyList.children[0].cloneNode(true);
                hotKeyItem.children[0].innerHTML = 'B';
                hotKeyItem.children[1].innerHTML = '网页全屏/退出网页全屏';
                let index = 0;
                for (index = 0; index < hotKeyList.children.length; index++) {
                    let temp = hotKeyList.children[index];
                    if (temp.children[0].innerHTML === 'F' && temp.children[1].innerHTML === '全屏/退出全屏') {
                        break;
                    }
                }
                hotKeyList.insertBefore(hotKeyItem, hotKeyList.children[index]);
            }
        }, 50);
        menuList.removeEventListener('mouseup', menuListener);
    }
}

function init() {
    webFullButton.onclick = function () {
        addToolTip();
    }
    addToolTip();
    console.log('Bilibili Web Fullscreen Button HotKey 加载完成，绑定快捷键为 B 键')
}

async function keyboardPress(e) {
    const activeElement = document.activeElement;
    const isEditable = (
        activeElement.tagName != 'BODY'
    );

    if (e.code === 'KeyB' && !e.ctrlKey && !e.altKey && !e.metaKey && !isEditable) {
        await webFullButton.click();
        addToolTip();
    }
}

function addToolTip() {
    document.getElementsByClassName('bpx-player-tooltip-title').forEach(temp => {
        if (temp.innerHTML === '网页全屏' || temp.innerHTML === '退出网页全屏') {
            temp.innerHTML += ' (b)';
        }
    })
}
