// ==UserScript==
// @name         真紅 SFW
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  屏蔽图片，公共场合也能上真紅，防止突出出现的色图导致社死！
// @author       biolxy
// @match        https://galgame.dev/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=galgame.dev
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521282/%E7%9C%9F%E7%B4%85%20SFW.user.js
// @updateURL https://update.greasyfork.org/scripts/521282/%E7%9C%9F%E7%B4%85%20SFW.meta.js
// ==/UserScript==
// @ref:         修改自 https://greasyfork.org/zh-CN/scripts/369659-north-plus-sfw

(function() {
    'use strict';

    const TIME_FADE_IN = 2;
    const TIME_FADE_OUT = 0.1;


    const CLS_IMG_LIST = ['img'];
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

    const DEFAULT_BLK_W = 1200; //495;
    const DEFAULT_BLW_H = 1000; //880;

    // 为每个图片添加遮挡层和事件监听
    // 2. CODE ENTRYPOINT.
    
    // 移除对头像类图片的处理
    let imgs = [];
    CLS_IMG_LIST.forEach(cls => {
        Array.from(document.body.querySelectorAll(cls)).filter(
            (im) => {
                if(!im.src.includes('component')){
                    removeLoadAttribute(im);
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
            setSize(blocker, h, w);
        });
    }

    function setSize(elem, h, w) {
        h += 20;
        w += 20;
        elem.style.height = `${h}px`;
        elem.style.width = `${w}px`;
    }

    // 移除 _load 属性
    function removeLoadAttribute(img) {
        const loadAttributes = ['_load', 'lazyloaded', 'lazyloadthumb'];
        loadAttributes.forEach(attr => {
            if (img.getAttribute(attr) !== null) {
                img.removeAttribute(attr);
            }
        });
    }

})();