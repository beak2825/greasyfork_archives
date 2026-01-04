// ==UserScript==
// @name         快速取关B站2022年百大UP主
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  快速取关B站2022年百大UP主，作用页面：https://www.bilibili.com/blackboard/BPU2022-poweruplist.html
// @author       EvolvedGhost
// @match        https://www.bilibili.com/blackboard/BPU2022-poweruplist.html
// @icon         https://www.bilibili.com/favicon.ico
// @homepageURL  https://greasyfork.org/zh-CN/scripts/458300
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/458300/%E5%BF%AB%E9%80%9F%E5%8F%96%E5%85%B3B%E7%AB%992022%E5%B9%B4%E7%99%BE%E5%A4%A7UP%E4%B8%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/458300/%E5%BF%AB%E9%80%9F%E5%8F%96%E5%85%B3B%E7%AB%992022%E5%B9%B4%E7%99%BE%E5%A4%A7UP%E4%B8%BB.meta.js
// ==/UserScript==

var defaultList = [];
var currentList = [];
var initDefault = false;

function initList() {
    if (!initDefault) {
        defaultList = [...document.getElementsByClassName('f-wrap')[0].childNodes];
        initDefault = true;
    }
}

function reloadList() {
    while (document.getElementsByClassName('f-wrap')[0].firstChild) {
        document.getElementsByClassName('f-wrap')[0].removeChild(document.getElementsByClassName('f-wrap')[0].firstChild);
    }
    currentList.forEach((val) => {
        document.getElementsByClassName('f-wrap')[0].appendChild(val)
    });
}

function showSubscribedList() {
    initList();
    currentList.length = 0;
    defaultList.forEach((val) => {
        if (val.lastChild.classList.contains('followed')) {
            currentList.push(val);
        }
    });
    reloadList();
}

function showUnsubscribedList() {
    initList();
    currentList.length = 0;
    defaultList.forEach((val) => {
        if (!val.lastChild.classList.contains('followed')) {
            currentList.push(val);
        }
    });
    reloadList();
}

function showDefaultList() {
    initList();
    currentList = [...defaultList];
    reloadList();
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function subscribeAll() {
    showUnsubscribedList();
    document.getElementById('pluginOperation').innerText = '正在进行批量关注操作';
    let length = document.getElementsByClassName('f-wrap')[0].childNodes.length;
    for (let i = 0; i < length; i++) {
        document.getElementsByClassName('f-wrap')[0].childNodes[i].lastChild.click();
        document.getElementById('pluginProcess').innerText = `${i + 1}/${length}`;
        await sleep(500);
    }
    document.getElementById('pluginOperation').innerText = '批量关注操作完成';
}

async function unSubscribeAll() {
    showSubscribedList();
    document.getElementById('pluginOperation').innerText = '正在进行批量取关操作';
    let length = document.getElementsByClassName('f-wrap')[0].childNodes.length;
    for (let i = 0; i < length; i++) {
        document.getElementsByClassName('f-wrap')[0].childNodes[i].lastChild.click();
        document.getElementById('pluginProcess').innerText = `${i + 1}/${length}`;
        await sleep(500);
    }
    document.getElementById('pluginOperation').innerText = '批量取关操作完成';
}

(function () {
    'use strict';
    document.getElementsByTagName('p')[1].innerHTML += `
<div class="power-up-total-list">
  <div class="main-content" style="height:100%">
    <div class="list">
      <ul>
        <li style="height:100%;padding-bottom:40px;">
          <h1>操作你的百大列表</h1>
          <div id="pluginOperation"></div>
          <div id="pluginProcess"></div>
          <div class="follow-button" id="btnShowSubscribedList">只显示已关注</div>
          <div class="follow-button" id="btnShowUnubscribedList">只显示未关注</div>
          <div class="follow-button" id="btnShowDefaultList">恢复默认显示</div>
          <div class="follow-button" id="btnSubscribeAll">全部添加关注</div>
          <div class="follow-button" id="btnUnsubscribeAll">全部取消关注</div></li>
      </ul>
    </div>
  </div>
</div>
    `

    document.getElementById('btnShowSubscribedList').addEventListener("click", showSubscribedList, false);
    document.getElementById('btnShowUnubscribedList').addEventListener("click", showUnsubscribedList, false);
    document.getElementById('btnShowDefaultList').addEventListener("click", showDefaultList, false);
    document.getElementById('btnSubscribeAll').addEventListener("click", subscribeAll, false);
    document.getElementById('btnUnsubscribeAll').addEventListener("click", unSubscribeAll, false);
})();
