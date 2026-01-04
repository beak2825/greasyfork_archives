// ==UserScript==
// @name         North-Plus SFW
// @namespace    https://github.com/sssssssl/NP-scripts
// @version      0.3.1
// @description  替换丧尸头像，屏蔽图片，公共场合也能上北+
// @author       sl
// @match        https://*.summer-plus.net
// @match        https://*.summer-plus.net/index.php
// @match        https://*.level-plus.net/read.php?tid*
// @match        https://*.white-plus.net/read.php?tid*
// @match        https://*.south-plus.net/read.php?tid*
// @match        https://*.imoutolove.me/read.php?tid*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369659/North-Plus%20SFW.user.js
// @updateURL https://update.greasyfork.org/scripts/369659/North-Plus%20SFW.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. CONSTANTS.

    const TIME_FADE_IN = 2;
    const TIME_FADE_OUT = 0.5;

    const CLS_AVATAR = '.user-pic img';
    const BASE_URL = 'images/face';
    const SAFE_AVATARS = [
        'a3.gif', '7.gif', 'a10.gif', 'a14.gif', 'a8.gif',
        '4.gif', '0.gif', '3.gif', 'a12.gif', 'none.gif',
        'a4.gif', '5.gif', 'a11.gif', '8.gif', 'a6.gif',
        '2.gif', 'a15.gif', '9.png', 'a7.gif', 'a9.gif',
        'a16.gif', '6.gif', 'a5.gif', 'a13.gif', 'a2.gif',
    ];
    const N = SAFE_AVATARS.length;

    const CLS_IMG_LIST = ['.tpc_content img'];
    const CLS_IMG_BLOCKER = 'img-blocker';
    const CLS_BLOCKER_ENABLED = 'blocker-enabled';
    const BLOCKER_STYLE = `
    div.${CLS_BLOCKER_ENABLED} {
        position:absolute;
        background-color:#F2F3F4;
        opacity: 1;
        transition: opacity ${TIME_FADE_OUT}s;
    }
    div.${CLS_BLOCKER_ENABLED}:hover {
        opacity: 0;
        transition: opacity ${TIME_FADE_IN}s;
    }`;

    const DEFAULT_BLK_W = 625;
    const DEFAULT_BLW_H = 500;

    // 2. CODE ENTRYPOINT.

    let imgs = [];
    CLS_IMG_LIST.forEach(cls => {
        Array.from(document.querySelectorAll(cls)).filter(
            (im) => {
                if(!im.src.includes('images/post')){
                    imgs.push(im);
                };
            });
    });

    if (imgs) {
        let blockerStyleTag = document.createElement('style');
        blockerStyleTag.textContent = BLOCKER_STYLE;
        document.head.append(blockerStyleTag);

        imgs.forEach((im) => {
            imgBlockerCb(im);
        });
    }

    // 设置头像
    let avatars = Array.from(document.querySelectorAll(CLS_AVATAR));
    avatars.forEach((im) => {
        im.src = getRandomAvatar();
        im.style.width = `150px`;
        im.style.height = `150px`;
    });

    function imgBlockerCb(im) {
        let blocker = document.createElement('div');
        blocker.classList.add(CLS_IMG_BLOCKER);
        blocker.classList.add(CLS_BLOCKER_ENABLED);
        let h = im.height ? im.height : DEFAULT_BLW_H;
        let w = im.width ? im.width : DEFAULT_BLK_W;
        setSize(blocker, h, w);
        let wrapper = document.createElement('div');
        im.parentElement.insertBefore(wrapper, im);
        wrapper.append(blocker, im);
        im.addEventListener('load', () => {
            setSize(blocker, im.height, im.width);
        });
        im.addEventListener('error', () =>{
            setSize(blocker, 0, 0);
        });
    }

    function setSize(elem, h, w) {
        elem.style.height = `${h}px`;
        elem.style.width = `${w}px`;
    }

    function getRandomAvatar() {
        let index = Math.floor(Math.random() * N);
        return `${BASE_URL}/${SAFE_AVATARS[index]}`;
    }

})();