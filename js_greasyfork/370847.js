// ==UserScript==
// @name         Coding.NET Activities Grabber
// @namespace    Zcc911
// @version      0.2
// @description  Grab Coding.NET develope activities
// @author       Zcc911
// @match        *://coding.net/user
// @grant        none
// @copyright    Zcc911
// @downloadURL https://update.greasyfork.org/scripts/370847/CodingNET%20Activities%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/370847/CodingNET%20Activities%20Grabber.meta.js
// ==/UserScript==

'use strict';
// https://coding.net/api/activities/joined_watched_projects_last?type=joined_watched_projects_last&last_id=999999999
// https://wangdoc.com/javascript/dom/mutationobserver.html

// 通过 document.querySelector('#id||.class||tagname') 获取DOM元素
let container = document.querySelector('div#container');

// 所要观察的变动类型（子节点变动、属性变动、节点内容/节点文本变动）
let options = {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true,
    attributeOldValue: false,
    characterDataOldValue: false
};

let watchedActivities;
let watchedArr;
let listEleShow = true;

// 使用MutationObserver构造函数，新建一个观察器实例，Mutation Observer API用来监视DOM变动
let DOMObserver = new MutationObserver(function (mutations, DOMObserver) {
    // 创建代码推送记录文本框展示节点
    let listDiv = document.createElement('div');
    let listEle = document.createElement('textarea');
    let toggleBtn = document.createElement('button');

    // 配置代码推送记录展示节点样式
    listDiv.style = 'margin: 66px 0 0 10px; position: fixed;'
    listEle.rows = 15;
    listEle.cols = 140;
    toggleBtn.innerText = '隐藏代码推送记录文本框';
    toggleBtn.style = 'display: block;';
    toggleBtn.addEventListener("click", () => {
        listEle.style = listEleShow ? "display: none" : "display: inline-block";
        toggleBtn.innerText = listEleShow ? '显示代码推送记录文本框' : '隐藏代码推送记录文本框';
        listEleShow = !listEleShow;
    });

    // 插入代码推送记录文本框展示节点
    listDiv.appendChild(listEle);
    listDiv.appendChild(toggleBtn);

    mutations.forEach(function(mutation) {
        if(mutation.target.id == 'joined_watched_projects_last' && !listEle.value) {
            watchedActivities = mutation.target;
            watchedArr = watchedActivities.querySelectorAll('.cuk-list-type-blocked>div');
            // console.log(watchedActivities);
            // console.dir(watchedArr);

            // 提取推送动态数据
            watchedArr.forEach((listBlock) => {
                let listDate = listBlock.querySelector('.activity-title-3M6 .title-label-2Mr').innerHTML;
                let listArr  = listBlock.querySelectorAll('.activity-3yv');
                // console.log(listDate);
                // console.log(listArr);
                let inputText = '' + listDate + '\n';
                for(let listIndex = 0; listIndex < listArr.length; listIndex++) {
                    // console.log(listArr[listIndex].innerText);
                    inputText += listArr[listIndex].innerText + '\n';
                }
                listEle.value += inputText + '\n';
            })

            let reactRoot = container.childNodes[0];
            reactRoot.insertBefore(listDiv, reactRoot.childNodes[0]);
        }
    });
});

// 观察指定DOM节点
DOMObserver.observe(container, options);
// DOMObserver.disconnect();
