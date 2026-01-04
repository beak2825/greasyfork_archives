// ==UserScript==
// @name         明日方舟官网优化
// @namespace    http://tampermonkey.net/
// @version      1.3.9
// @description  新闻页/动态时装页优化、生息演算蓝图气泡不遮挡点击、网站BGM默认关闭
// @author       Y_jun
// @match        https://ak.hypergryph.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hypergryph.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486918/%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E5%AE%98%E7%BD%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/486918/%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E5%AE%98%E7%BD%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


'use strict';

// function addClassStyle() {
//     let style = document.createElement('style');
//     style.innerHTML = `.ak-anno-sticky {
//     font-size: 90%;
//     color: #18d1ff;
//     margin-left: 15px;
//     padding: 0 2px;
//     border: thin solid #18d1ff;
// }`;
//     document.head.appendChild(style);
// }

// 新闻列表页优化
function editNewsList() {
    if (document.querySelector('._272521bc') === null) {
        return;
    }
    let box = document.querySelector('._272521bc');
    box.style.marginRight = '0';

    let box2 = box.querySelector('._507ac726');
    box2.style.marginRight = '-18px';
}

// 新闻详情页优化
function editNews() {
    if (document.querySelector('._86aa9ca1') === null) {
        return;
    }
    let box = document.querySelector('._58fe4125');
    box.style.padding = '0';

    let box2 = box.querySelector('._d6be3557');
    box2.style.marginRight = '5%';

    let title = box2.querySelector('._22cbc199');
    title.style.marginTop = '0.5rem';

    let date = box2.querySelector('._8f259902');
    date.style.marginTop = '0.5rem';

    let segment = box2.querySelector('._5a657cba');
    segment.style.margin = '1rem 0';

    let container = box2.querySelector('._d53f48fa');
    container.style.width = '75rem';
    container.style.height = '50rem';

    let content = box.querySelector('._ca9cde55');
    content.style.marginRight = '0';

    let article = content.querySelector('._0868052a');
    article.style.paddingRight = '0.5rem';

    let imgList = article.querySelectorAll('img');
    imgList.forEach(img => {
        img.style.width = '75%';
        img.style.margin = '0 auto';
    });
}

// 动态时装页优化
function editDynamicCompile() {
    if (document.querySelector('._be5ae4d8') === null) {
        return;
    }

    let box = document.querySelector('._be5ae4d8');
    box.style.paddingTop = '0';

    let box2 = box.querySelector('._b3f1e1b1');
    box2.style.justifyContent = 'flex-end';
    box2.style.paddingBottom = '0.2rem';

    let date = box2.querySelector('._8e9faf36');
    date.style.marginTop = '0';

    let container = box2.querySelector('._049f8368');
    container.style.width = '101.25rem';
    container.style.height = '57rem';
    container.style.marginTop = '0';
    container.style.marginLeft = '0';

    let backBox = document.querySelector('._da8175cb');
    backBox.style.flexDirection = 'column';
    backBox.style.alignItems = 'flex-end';

    let back = backBox.querySelector('._8ceb926c');
    back.style.width = '12.125rem';
    back.style.padding = '0 2rem';

    let backHome = backBox.querySelector('._2e5fec5d');
    backHome.style.width = '12.125rem';
    backHome.style.padding = '0 2rem';
    if (!backHome.querySelector('._facaf9f5')) {
        let backIcon = backBox.querySelector('._facaf9f5').cloneNode(true);
        backIcon.style.width = '0.5rem';
        backHome.insertBefore(backIcon, backHome.firstChild);
    }

    let buttons = document.querySelectorAll('._2b903487');
    buttons.forEach(button => {
        button.style.width = '9.5rem';
    });
}

// 生息演算蓝图气泡不遮挡点击
function editBubble() {
    let bubble = document.querySelector('.hF6vnb.BRxXLP');
    if (bubble && bubble.style.pointerEvents !== 'none') {
        bubble.style.pointerEvents = 'none';
    }
}

// 添加置顶文本
// function addSticky(stickyId, boxClass, dateClass) {
//     let anno = document.querySelector(`.${boxClass}[href="/news/${stickyId}"]`);
//     if (anno && !anno.querySelector('.ak-anno-sticky')) {
//         let span = document.createElement("span");
//         span.className = 'ak-anno-sticky';
//         span.innerHTML = 'TOP';
//         const date = anno.querySelector(`.${dateClass}`);
//         date.appendChild(span);
//     }
// }

// async function editSticky() {
//     await fetch('https://ak.hypergryph.com/api/news?category=LATEST&page=1')
//         .then(response => response.json())
//         .then(json => {
//             const infoList = json?.data?.list;
//             if (!infoList || infoList.length < 1) return;
//             const stickyList = [];
//             infoList.forEach(info => {
//                 if (info.sticky) stickyList.push(info.cid);
//             });
//             setInterval(() => {
//                 stickyList.forEach(stickyId => {
//                     addSticky(stickyId, '_b6f1b9e5', '_78dcf6c5');
//                     addSticky(stickyId, '_aa8c4091', '_59a08c8a');
//                 });
//             }, 10);
//         })
//         .catch(err => console.log('Request Failed', err));
// }

// 修改按钮样式
function editButton() {
    let listButton = document.querySelector('._b9c239f0');
    if (listButton && listButton.innerText !== '查看公告列表') {
        listButton.style.width = '12.5rem';
        listButton.style.height = '2.5rem';
        listButton.style.backgroundColor = '#18d1ff';
        listButton.style.color = '#000';
        listButton.style.fontFamily = 'SourceHanSansSC-Bold';
        listButton.style.fontSize = '1.2rem';
        let listButtonTextElem = listButton.querySelector('span');
        listButtonTextElem.innerText = '查看公告列表';
    }

    let infoDiv = document.querySelector('._e2f809d4');
    if (infoDiv) {
        infoDiv.style.bottom = '1rem';
    }

    let infoButton = document.querySelector('._6b41422f');
    if (infoButton) {
        infoButton.remove();
        // infoButton.style.backgroundColor = '#585858';
        // infoButton.style.color = '#d2d2d2';
    }
}

// 修改按钮样式
function muteBGM(count = 1) {
    let bgmButton = document.querySelector("._e6c9defd");
    // 如果元素未找到，则在一定时间内重复尝试数次。
    if (!bgmButton || bgmButton.className.indexOf('_5d27adee') === -1) {
        if (count <= 10) {
            const args = Array.from(arguments).slice(0, arguments.length);
            args.push(count + 1);
            setTimeout(muteBGM, 50, ...args);
        }
        return;
    }
    bgmButton.click();
}

window.onload = () => {
    // addClassStyle();
    muteBGM();
    const pathArr = window.location.pathname.split('/');
    if (pathArr.length > 1 && pathArr[1] === 'news') {
        setInterval(() => {
            editNews();
        }, 10);
    }
    if (pathArr.length > 2 && pathArr[2] === 'dynamicCompile') {
        setInterval(() => {
            editDynamicCompile();
        }, 10);
    }
    if (pathArr.length > 1 && pathArr[1] === 'ra') {
        setInterval(() => {
            editBubble();
        }, 10);
    }
    // editSticky();
    setInterval(() => {
        editNewsList();
        editButton();
    }, 10);
}
