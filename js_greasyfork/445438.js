// ==UserScript==
// @name         Bilibili 批量删除关注
// @description  在“Bilibili-我的关注”页面中批量选择时，可以进行批量取消关注。
// @version      1.4
// @author       Myitian
// @license      MIT
// @namespace    myitian.bili.followUsers-batchDelete
// @match        https://space.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445438/Bilibili%20%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/445438/Bilibili%20%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==

if (/https:\/\/space\.bilibili\.com\/\d+\/fans/.test(window.location)) {
    window.addEventListener('click', addBtnFunc, true);
    window.addEventListener('click', checkboxFunc, true);
    initMessageBox();
}

var checkedList = [];
var grayIcon = 'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWAQMAAAD+ev54AAAABlBMVEUAAADL0NgxrV+XAAAAAXRSTlMAQObYZgAAACNJREFUCNdjAIMKBK7//wOMDaDQyJMwhkH7/x8Y5P8/AJkIAPm2EgQtoFFGAAAAAElFTkSuQmCC);';
var blueIcon = 'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWAQMAAAD+ev54AAAABlBMVEUAAAAAo9sxTF25AAAAAXRSTlMAQObYZgAAACNJREFUCNdjAIMKBK7//wOMDaDQyJMwhkH7/x8Y5P8/AJkIAPm2EgQtoFFGAAAAAElFTkSuQmCC);';
var digitRegex = /\d+/;

//更新图标
function updateIcon() {
    var i = document.getElementById('my-fubd--delbtn-icon');
    if (i) {
        if (checkedList.length == 0) {
            i.style = grayIcon;
        } else {
            i.style = blueIcon;
        }
    }
}
//获取Cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
//取消关注POST请求
function xhrPost(fid, csrf) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.bilibili.com/x/relation/modify');
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('fid=' + fid + '&act=2&csrf=' + csrf);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
        }
    };
}
//添加按钮功能
function addBtnFunc() {
    var btnEle = document.getElementsByClassName('icon-multiple')[0];
    if (btnEle && event.target == btnEle && btnEle.getAttribute('my-fubd--func-already-added') != 'true') {
        btnEle.setAttribute('my-fubd--func-already-added', 'true');
        btnEle.addEventListener('click', batchDeleteBtnFunc);
    }
}
//添加取消关注按钮
function batchDeleteBtnFunc() {
    var root = document.getElementsByClassName('follow-action-fixtop clearfix')[0];

    var back = document.getElementsByClassName('back-to-info icon')[0];
    back.addEventListener('click', cancelBtnFunc);

    var cancel = root.querySelector('.select-cancel');
    cancel.addEventListener('click', cancelBtnFunc);

    var btns = root.firstElementChild;

    var li = document.createElement('li');

    var i = document.createElement('i');
    i.className = 'icon';
    i.id = 'my-fubd--delbtn-icon';
    i.style = grayIcon;

    li.addEventListener('click', loadMessageBox);
    li.appendChild(i);
    li.innerHTML += '取消关注';

    btns.appendChild(li);
}
//复选框功能
function checkboxFunc() {
    var target = event.target;
    if (target.className == 'follow-select') {
        target = target.firstElementChild;
    }
    var link, index;
    if (target.className == 'icon icon-follow-watched icon-follow-selected') { //uncheck
        link = target.parentNode.parentNode.querySelector('.title');
        index = checkedList.indexOf(digitRegex.exec(link.href)[0]);
        if (index != -1) {
            checkedList.splice(index, 1);
            updateIcon();
        }
    } else if (target.className == 'icon icon-follow-watched') { //check
        link = target.parentNode.parentNode.querySelector('.title');
        var href = digitRegex.exec(link.href)[0];
        index = checkedList.indexOf(href);
        if (index == -1) {
            checkedList.push(href);
            updateIcon();
        }
    }
}
//取消选择按钮功能
function cancelBtnFunc() {
    checkedList = [];
    updateIcon();
}
//初始化消息框
function initMessageBox() {
    if (document.getElementById('my-fubd--container')) return;
    var base = document.createElement('div');
    base.className = 'modal-container edit-video-modal';
    base.id = 'my-fubd--container';
    base.style = 'display: none;';
    base.innerHTML = '<div class="modal-mask"></div><div class="modal-wrapper my-fubd--msgbox-wrapper"><div class="modal"><div class="modal-header"><i id="my-fubd--msgbox-close" class="modal-header-close iconfont icon-ic_close"></i><div class="modal-title"><p id="my-fubd--msgbox-title" class="edit-video-title">你正在删除0个up主</p></div></div><div class="modal-body my-fubd--msgbox-body"><div class="my-fubd--msgbox-followlist"><ul id="my-fubd--msgbox-targetcontainer"></ul></div></div><div class="btn-container modal-footer btn-center"><a id="my-fubd--msgbox-a" class="btn primary"><span class="btn-content my-fubd--msgbox-span">确定</span></a></div></div></div><style>.my-fubd--msgbox-wrapper{width:420px;}#my-fubd--msgbox-title{text-align:center;}.my-fubd--msgbox-body{position:relative;padding:14px 0 0 !important;margin-bottom:18px;border-bottom:1px solid #e5e9ef;}.my-fubd--msgbox-followlist{position:relative;height:300px;overflow:auto;}#my-fubd--msgbox-targetcontainer{margin:0 36px;}#my-fubd--msgbox-a{margin-right:0;color:#fff;background-color:#00a1d6;display:inline-block;-ms-touch-action:manipulation;touch-action:manipulation;padding:0 10px;line-height:30px;min-width:70px;transition:all .2s ease;font-size:0;text-align:center;vertical-align:middle;outline:none;border:1px solid #00a1d6;border-radius:4px;cursor:pointer;white-space:nowrap;box-sizing:border-box;}#my-fubd--msgbox-a:hover,#my-fubd--msgbox-a:focus{color:#fff;background-color:#00b5e5;border-color:#00b5e5;}.my-fubd--msgbox-span{margin:10px 66px;font-size:12px;vertical-align:top;}</style>';
    /* 未压缩内容如下：
    <div class="modal-mask"></div>
    <div class="modal-wrapper my-fubd--msgbox-wrapper">
        <div class="modal">
            <div class="modal-header"><i id="my-fubd--msgbox-close" class="modal-header-close iconfont icon-ic_close"></i>
                <div class="modal-title">
                    <p id="my-fubd--msgbox-title" class="edit-video-title">你正在删除0个up主</p>
                </div>
            </div>
            <div class="modal-body my-fubd--msgbox-body">
                <div class="my-fubd--msgbox-followlist">
                    <ul id="my-fubd--msgbox-targetcontainer">
                    </ul>
                </div>
            </div>
            <div class="btn-container modal-footer btn-center">
                <a id="my-fubd--msgbox-a" class="btn primary"><span class="btn-content my-fubd--msgbox-span">确定</span></a>
            </div>
        </div>
    </div>
    <style>
    .my-fubd--msgbox-wrapper {
        width: 420px;
    }
    #my-fubd--msgbox-title {
        text-align: center;
    }
    .my-fubd--msgbox-body {
        position: relative;
        padding: 14px 0 0 !important;
        margin-bottom: 18px;
        border-bottom: 1px solid #e5e9ef;
    }
    .my-fubd--msgbox-followlist {
        position: relative;
        height: 300px;
        overflow: auto;
    }
    #my-fubd--msgbox-targetcontainer {
        margin: 0 36px;
    }
    #my-fubd--msgbox-a {
        margin-right: 0;
        color: #fff;
        background-color: #00a1d6;
        display: inline-block;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        padding: 0 10px;
        line-height: 30px;
        min-width: 70px;
        transition: all .2s ease;
        font-size: 0;
        text-align: center;
        vertical-align: middle;
        outline: none;
        border: 1px solid #00a1d6;
        border-radius: 4px;
        cursor: pointer;
        white-space: nowrap;
        box-sizing: border-box;
    }
    #my-fubd--msgbox-a:hover,#my-fubd--msgbox-a:focus {
        color: #fff;
        background-color: #00b5e5;
        border-color: #00b5e5;
    }
    .my-fubd--msgbox-span {
        margin: 10px 66px;
        font-size: 12px;
        vertical-align: top;
    }
    </style>
    */
    document.body.appendChild(base);
    document.getElementById('my-fubd--msgbox-close').addEventListener('click', exitMessageBox);
    document.getElementById('my-fubd--msgbox-a').addEventListener('click', mainFunc);
}
//加载消息框
function loadMessageBox() {
    var len = checkedList.length;
    if (len == 0) return;
    document.getElementById('my-fubd--msgbox-title').innerText = '你正在删除' + checkedList.length + '个up主';
    var ul = document.getElementById('my-fubd--msgbox-targetcontainer');
    ul.innerHTML = '';
    for (var i = 0; i < len; i++) {
        ul.innerHTML += '<li>' + checkedList[i] + '</li>';
    }
    var base = document.getElementById('my-fubd--container');
    base.className = 'modal-container edit-video-modal fade-enter fade-enter-active';
    base.style = '';
    setTimeout(function() {
        base.className = 'modal-container edit-video-modal fade-enter-active';
    }, 10);
}
//退出消息框
function exitMessageBox() {
    var base = document.getElementById('my-fubd--container');
    base.className = 'modal-container edit-video-modal fade-leave-active';
    setTimeout(function() {
        base.className = 'modal-container edit-video-modal fade-leave fade-leave-active';
    }, 10);
    setTimeout(function() {
        document.getElementById('my-fubd--container').style = 'display: none;';
        base.className = 'modal-container edit-video-modal';
    }, 300);
}
//主函数
function mainFunc() {
    var csrf = getCookie('bili_jct');
    var upElementsOnCurrentPage = document.getElementsByClassName('list-item clearfix list-item-select'); ///////////////////////////////////////WIP
    var upsOnCurrentPage = [];
    var upUidsOnCurrentPage = [];
    var i, len;
    for (i = 0, len = upElementsOnCurrentPage.length; i < len; i++) {
        var tmp = upElementsOnCurrentPage[i];
        if (tmp.querySelector('.icon-follow-selected') != null) {
            upsOnCurrentPage.push(tmp);
            upUidsOnCurrentPage.push(digitRegex.exec(tmp.querySelector('.title').href)[0]);
        }
    }
    for (i = 0, len = checkedList.length; i < len; i++) {
        var uid = checkedList[i];
        var index = upUidsOnCurrentPage.indexOf(uid);
        if (index != -1) {
            var t = upsOnCurrentPage[index].querySelector('.fans-action-btn .be-dropdown-item:nth-child(2)');
            if (t) t.click();
        } else {
            xhrPost(uid, csrf);
        }
    }
    exitMessageBox();
    checkedList = [];
    updateIcon();
}