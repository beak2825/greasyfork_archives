// ==UserScript==
// @name         扇贝辅助
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  不用贝壳即可查看听力提示, 修改导航栏，方便炼句
// @author       How
// @match        https://www.shanbay.com/*
// @match        https://web.shanbay.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395882/%E6%89%87%E8%B4%9D%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/395882/%E6%89%87%E8%B4%9D%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 一些变量
    window.shanbayLinks = {
        'sentence-review': 'https://www.shanbay.com/sentence/review/',
        'listen-link': 'https://www.shanbay.com/listen/',
        'listen-with-hint': [ 'https://www.shanbay.com/listen/sentence',
            'https://www.shanbay.com/listen/review'],
    };

    window.shanbayConfig = {
        /* 修改“听力”链接，使其指向“精听”页面，而不是让我下载手机app */
        'change-listen-nav': true,
        /* 在导航栏插入“炼句”的tab */
        'insert-sentence-review-nav': true,
        /* 听听力的时候，免费查看提示 */
        'free-listen-hint': true,
    }
    window.shanbayScript = {}
    window.shanbayScript.hint_input_dom = undefined;
    // Your code here...

    // 修改导航栏
    changeNavBar();

    // 修改听力页面，添加一个悬停在页面中的按钮
    let changedPage = false;
    if (window.shanbayConfig['free-listen-hint']) {
        for (let i = 0 ; i < window.shanbayLinks['listen-with-hint'].length ; i++) {
            console.log('trigger');
            if (!changedPage && window.location.href.startsWith(window.shanbayLinks['listen-with-hint'][i])) {
                changeListenPage();
                changedPage = true;
            }
        }
    }

    /*
    if (window.location.href.startsWith('https://www.shanbay.com/listen/sentence')) {
        changeListenPage();
    }
    */

})();

// 找到所有空里面获得焦点的空，如果没有，就找第一个不正确的，不正确包括空白，返回这个DOM
// 如果没找到，返回undefined
function findFirstIncorrectBlank() {
    let inputs = document.getElementsByClassName('sentence-word-input');
    let res = undefined;// 如果没有光标所指的input，返回第一个非正确的
    for (let i = 0 ; i < inputs.length ; i++) {
        if (res == undefined && (inputs[i].value == '' || !inputs[i].classList.contains('correct-answer'))) {
            res = inputs[i];
        }
        // 如果有获得焦点的空，返回这个空的dom
        if (res != undefined && inputs[i] === document.activeElement) {
            return inputs[i];
        }
    }

    return res;
}

function displayListenHint() {
    let dom = findFirstIncorrectBlank();
    if (dom == undefined) {
        document.getElementById('hint-button').value = 'Not here';
        return;
    }
    window.shanbayScript.hint_input_dom = dom;
    document.getElementById('hint-button').value = dom.getAttribute('data');
    dom.placeholder = dom.getAttribute('data');
}

function hideListenHint() {
    document.getElementById('hint-button').value = 'Hint';
    if (window.shanbayScript.hint_input_dom == undefined) {
        return;
    }
    window.shanbayScript.hint_input_dom.placeholder = '';
}

// 设置element为可拖拽
function dragElement(element) {
    var posX;// 原来鼠标的位置
    var posY;
    var posXX;// 拖拽之后鼠标的位置
    var posYY;
    function pressed(event) {
        event = event || window.event;
        event.preventDefault;

        posX = event.clientX;
        posY = event.clientY;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', released);

    }
    function released(event) {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', released);
    }
    function drag(event) {
        event = event || window.event;
        event.preventDefault;
        let deltaX = event.clientX - posX;
        let deltaY = event.clientY - posY;
        posX = event.clientX;
        posY = event.clientY; console.log(element.offsetTop);
        element.style.top = element.offsetTop + deltaY + 'px';
        element.style.left = element.offsetLeft + deltaX + 'px';
    }
    element.onmousedown = pressed;
}

function changeListenPage() {
    let button = document.createElement('input');
    button.type='button';
    button.style.position = 'fixed';
    button.style['z-index'] = '10';
    button.style.top = '50%';
    button.style.left = '15%';
    button.id = 'hint-button';
    button.value = 'Hint';
    button.draggable = false;
    // 设置拖拽
    dragElement(button);

    // 悬停事件
    button.addEventListener('mouseover', displayListenHint);
    button.addEventListener('mouseout', hideListenHint);

    // todo 懒得美化
    document.body.appendChild(button);
}

// 唉！扇贝的页面连导航栏的结构都不一样，要分页面来处理，真坑，[todo]
function changeNavBar() {
    let navHandlerOfPage = {
        'https://web.shanbay.com/wordsweb': changeNavBarOnWordPage,
        'https://www.shanbay.com/news': changeNavBarOnSpeakAndReadPage,
        'https://web.shanbay.com/reading': changeNavBarOnSpeakAndReadPage,
        'https://www.shanbay.com/speak': changeNavBarOnSpeakAndReadPage,
        'https://www.shanbay.com': changeNavBarOnNormalPage,
    };

    for (let url in navHandlerOfPage) {
        if (window.location.href.startsWith(url)) {
            navHandlerOfPage[url](); break;
        }
    }
}

// 一般性的页面，有统一的navbar结构
function changeNavBarOnNormalPage() {
    let nav = document.getElementsByClassName('nav')[0];
    let navlinks = nav.getElementsByClassName('main-menu');

    let tab = '<li class="dropdown main-nav  ">'+
                    '<a href="' + shanbayLinks['sentence-review'] + '" class="main-menu">' +
                        '炼句' +
                    '</a>'+
               ' </li>';

    for (let i = 0 ; i < navlinks.length ; i++) {
        // 修改听力链接
        if (navlinks[i].innerText.trim() == '听力' && window.shanbayConfig['change-listen-nav']) {
            navlinks[i].href = window.shanbayLinks['listen-link'];
        }
    }

    if (window.shanbayConfig['insert-sentence-review-nav']) {
        nav.innerHTML += tab;// 增加炼句导航
    }
}

// 修改记单词界面的navbar
function changeNavBarOnWordPage() {
    // todo: the class name might change
    let nav = document.getElementsByClassName('Nav_itemsWrapper__3FUxo')[0];
    if (nav === undefined)
        return;
    let navlinks = nav.getElementsByTagName('a');

    let tab = '<a class="Nav_item__TffFb" href="' + shanbayLinks['sentence-review'] + '">炼句</a>';

    for (let i = 0 ; i < navlinks.length ; i++) {
        // 修改听力链接
        if (navlinks[i].innerText.trim() == '听力' && window.shanbayConfig['change-listen-nav']) {
            navlinks[i].href = window.shanbayLinks['listen-link'];
        }
    }

    if (window.shanbayConfig['insert-sentence-review-nav']) {
        nav.innerHTML += tab;// 增加炼句导航
    }
}

// 口语和阅读的navbar结构一样
function changeNavBarOnSpeakAndReadPage() {
    let nav = document.getElementsByClassName('nav-top-left')[0];
    let navlinks = nav.getElementsByClassName('secondary');

    let tab = '<li>'+
                    '<a class="secondary" href="' + shanbayLinks['sentence-review'] + '" class="main-menu">' +
                        '炼句' +
                    '</a>'+
               ' </li>';

    for (let i = 0 ; i < navlinks.length ; i++) {
        // 修改听力链接
        if (navlinks[i].innerText.trim() == '听力' && window.shanbayConfig['change-listen-nav']) {
            navlinks[i].href = window.shanbayLinks['listen-link'];
        }
    }

    if (window.shanbayConfig['insert-sentence-review-nav']) {
        nav.getElementsByTagName('ul')[0].innerHTML += tab;// 增加炼句导航
    }
}
