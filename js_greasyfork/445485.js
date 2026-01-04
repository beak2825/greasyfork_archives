// ==UserScript==
// @name         Bilibili 多选功能增强
// @namespace    myitian.bili.multiSelectionExtend
// @description  在管理关注、收藏时，可以进行当前页面的全选/全不选/反选，不影响其他内容的选择状态。
// @version      2.0
// @author       Myitian
// @license      MIT
// @match        https://space.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445485/Bilibili%20%E5%A4%9A%E9%80%89%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/445485/Bilibili%20%E5%A4%9A%E9%80%89%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

if (/https:\/\/space\.bilibili\.com\/\d+\/fans/.test(window.location)) {
    window.addEventListener('click', fans_AddBtnFunc, true);
    fans_InitStyle();
} else if (/https:\/\/space\.bilibili\.com\/\d+\/favlist/.test(window.location)) {
    window.addEventListener('click', favlist_AddBtnFunc, true);
    favlist_InitStyle();
}

//---===关注页===---
//添加样式
function fans_InitStyle() {
    var style = document.createElement('style');
    var textNode = document.createTextNode('.my-mse--btn{color:#00a1d6;vertical-align:middle;cursor:pointer;margin-right:15px;}.my-mse--btn:hover{color: #00b5e5;}');
    style.appendChild(textNode);
    document.body.appendChild(style);
}
//添加按钮功能
function fans_AddBtnFunc() {
    var btnEle = document.getElementsByClassName('icon-multiple')[0];
    if (btnEle && event.target == btnEle && btnEle.getAttribute('my-mse--func-already-added') != 'true') {
        btnEle.setAttribute('my-mse--func-already-added', 'true');
        btnEle.addEventListener('click', fans_MultiselectBtnFunc);
    }
}
//添加多选按钮
function fans_MultiselectBtnFunc() {
    var root = document.getElementsByClassName('edit-detail')[0];

    var eSelectAll = document.createElement('span');
    eSelectAll.innerText = '全选';
    eSelectAll.className = 'my-mse--btn';
    eSelectAll.addEventListener('click', fans_SelectAll);

    var eUnselectAll = document.createElement('span');
    eUnselectAll.innerText = '全不选';
    eUnselectAll.className = 'my-mse--btn';
    eUnselectAll.addEventListener('click', fans_UnselectAll);

    var eReverseSelection = document.createElement('span');
    eReverseSelection.innerText = '反选';
    eReverseSelection.className = 'my-mse--btn';
    eReverseSelection.addEventListener('click', fans_ReverseSelection);

    root.prepend(eReverseSelection);
    root.prepend(eUnselectAll);
    root.prepend(eSelectAll);
}
//全选
function fans_SelectAll() {
    var checkBoxes = document.querySelectorAll('.list-item-select .follow-select');
    for (var i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].querySelector('.icon-follow-selected') == null) {
            checkBoxes[i].click();
        }
    }
}
//全不选
function fans_UnselectAll() {
    var checkBoxes = document.querySelectorAll('.list-item-select .follow-select');
    for (var i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].querySelector('.icon-follow-selected') != null) {
            checkBoxes[i].click();
        }
    }
}
//反选
function fans_ReverseSelection() {
    var checkBoxes = document.querySelectorAll('.list-item-select .follow-select');
    for (var i = 0; i < checkBoxes.length; i++) {
        checkBoxes[i].click();
    }
}

//---===收藏页===---
//添加样式
function favlist_InitStyle() {
    var style = document.createElement('style');
    var textNode = document.createTextNode('.my-mse--btn{color:#00a1d6!important;}.my-mse--btn:hover{color:#00b5e5!important;}');
    style.appendChild(textNode);
    document.body.appendChild(style);
}
//添加按钮功能
function favlist_AddBtnFunc() {
    var btnEle = document.getElementsByClassName('filter-item do-batch')[0];
    if (btnEle && (event.target == btnEle || event.target.parentElement == btnEle) && btnEle.getAttribute('my-mse--func-already-added') != 'true') {
        btnEle.setAttribute('my-mse--func-already-added', 'true');
        btnEle.addEventListener('click', favlist_MultiselectBtnFunc);
    }
}
//添加多选按钮
function favlist_MultiselectBtnFunc() {
    var root = document.querySelector('.fav-action-fixtop').firstChild;
    root.removeChild(root.firstChild);

    var eSelectAll = document.createElement('li');
    eSelectAll.innerText = '全选';
    eSelectAll.className = 'my-mse--btn';
    eSelectAll.addEventListener('click', favlist_SelectAll);

    var eUnselectAll = document.createElement('li');
    eUnselectAll.innerText = '全不选';
    eUnselectAll.className = 'my-mse--btn';
    eUnselectAll.addEventListener('click', favlist_UnselectAll);

    var eReverseSelection = document.createElement('li');
    eReverseSelection.innerText = '反选';
    eReverseSelection.className = 'my-mse--btn';
    eReverseSelection.addEventListener('click', favlist_ReverseSelection);

    root.prepend(eReverseSelection);
    root.prepend(eUnselectAll);
    root.prepend(eSelectAll);
}
//全选
function favlist_SelectAll() {
    console.log('hi');
    var checkBoxes = document.querySelectorAll('.small-item');
    for (var i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].className.search('selected') == -1) {
            checkBoxes[i].querySelector('.video-check-container').click();
        }
    }
}
//全不选
function favlist_UnselectAll() {
    var checkBoxes = document.querySelectorAll('.small-item');
    for (var i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].className.search('selected') != -1) {
            checkBoxes[i].querySelector('.video-check-container').click();
        }
    }
}
//反选
function favlist_ReverseSelection() {
    var checkBoxes = document.querySelectorAll('.small-item');
    for (var i = 0; i < checkBoxes.length; i++) {
        checkBoxes[i].querySelector('.video-check-container').click();
    }
}