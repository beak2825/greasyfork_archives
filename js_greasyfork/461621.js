// ==UserScript==
// @name         52HB自动评分
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  不是土豪只能攒HB，呜呜呜！
// @author       Jawon
// @match        https://www.52hb.com/*
// @icon         https://www.52hb.com/favicon.ico
// @license      MIT
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/461621/52HB%E8%87%AA%E5%8A%A8%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/461621/52HB%E8%87%AA%E5%8A%A8%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

/*
使用方法：
打开52HB论坛的某个区，例如【逆向图文】https://www.52hb.com/forum-37-1.html直接点击开始评分即可自动按帖子顺序评分，如果想从某个贴子开始评分，要先填入该帖子链接再点开始。
这个脚本只是自动点击评分，无其他有害于网站的功能。
(qq2870881842，求逆向大佬带带我！！！)
*/
'use strict';

//获取当前评分链接
let currentLinkIndex = GM_getValue('currentLinkIndex');
let currentLink = GM_getValue(currentLinkIndex);

//转到下一个链接
function GoToNextLink() {
    if (!GM_getValue("IsWorking")) return;
    //获取当前评分链接
    let currentLinkIndex = GM_getValue('currentLinkIndex');
    // 当前评分链接索引加一
    currentLinkIndex = 'link' + (parseInt(currentLinkIndex.match(/\d+/)[0]) + 1);
    if (GM_getValue(currentLinkIndex) == undefined) {
        //清空油猴储存的所有键值
        clearValues();
        //停止评分标志
        GM_setValue("IsWorking", false);
        let button = document.getElementById("Jawon-button");
        button.innerHTML = "已停止评分";
        let p3 = document.getElementById("Jawon-p3");
        p3.innerText = "所有链接已评完，请获取新链接。";
        p3.style.cssText = "display: inline; font-size: 20px; color: yellow; background: red;";
        return;
    }
    GM_setValue("currentLinkIndex", currentLinkIndex);
    location.href = GM_getValue(currentLinkIndex);
}

//清除所有setvalue设置的键值
function clearValues() {
    // 获取所有存储的键名
    const keys = GM_listValues();
    // 遍历所有键名，并使用 GM_deleteValue 方法删除对应的键值
    for (let key of keys) {
        GM_deleteValue(key);
    }
}

//开始评分
function startToWork() {
    //清空油猴储存的所有键值
    clearValues();

    //获取第一个评分链接
    let startLink = document.getElementById("input-text").value;
    document.getElementById("input-text").value = '';
    //获取所有链接
    let links = document.querySelectorAll("a.s.xst");
    //储存指定链接以后的链接
    let i = 0;
    for (; i < links.length; i++) {
        if (startLink === links[i].href) break;
    }
    if (i < links.length) {
        GM_setValue('currentLinkIndex', 'link' + i);
        currentLink = links[i].href;
        for (; i < links.length; i++) {
            GM_setValue('link' + i, links[i].href);
        }
    }
    else {//如果没匹配到指定链接就添加所有链接
        i = 0;
        GM_setValue('currentLinkIndex', 'link' + i);
        currentLink = links[i].href;
        for (; i < links.length; i++) {
            GM_setValue('link' + i, links[i].href);
        }
    }
    //正在评分标志
    GM_setValue("IsWorking", true);
    //主页面不评分
    GM_setValue('mainPage', location.href);
    //在新页面评分
    window.open(currentLink, "_blank");
}

window.onload = function () {

    // 创建包含输入框和按钮的容器
    let container = document.createElement("div");
    container.style.cssText = "position: fixed; top: 20px; right: 20px; display: flex; flex-direction: column; align-items: center; background: #bfa; padding: 10px; z-index: 999999;";
    // 将容器插入到页面中
    document.getElementsByTagName("body")[0].appendChild(container);

    let p3 = document.createElement("p3");
    p3.setAttribute("id", "Jawon-p3");
    p3.innerText = "当前评分链接:";
    p3.style.cssText = "display: inline;";
    container.appendChild(p3);
    // 创建输入框
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "input-text");
    if (currentLink) input.value = currentLink;
    // 将输入框插入到容器中
    container.appendChild(input);

    // 创建按钮
    let button = document.createElement("button");
    button.setAttribute("id", "Jawon-button");
    // 将按钮插入到容器中
    container.appendChild(button);

    //如果已开始评分，并且不是主页，就继续评分
    if (GM_getValue('IsWorking') && (GM_getValue('mainPage') != location.href)) {
        button.innerHTML = "停止评分";
        //点击按钮停止评分
        button.onclick = function () {
            //清空油猴储存的所有键值
            clearValues();
            //停止评分标志
            GM_setValue("IsWorking", false);
            button.innerHTML = "已停止评分";
        };

        //点击评分按钮
        setTimeout(function () {
            if (!GM_getValue("IsWorking")) return;
            //如果未找到评分按钮
            if (document.querySelector("#ak_rate") == undefined) {
                let p3 = document.getElementById("Jawon-p3");
                p3.innerText = "此页面不能评分，即将跳转下一页";
                p3.style.cssText = "display: inline; font-size: 20px; color: yellow; background: red;";
                setTimeout(() => {
                    GoToNextLink();
                }, 3000);
            }
            document.querySelector("#ak_rate").click();
            setTimeout(function () {
                if (!GM_getValue("IsWorking")) return;
                //如果弹出评分框
                if (document.querySelector("#return_rate") != undefined && document.querySelector("#return_rate").innerText === "评分") {
                    //判断剩余次数，如果够就评分
                    if (document.querySelector('#rateform > div > table > tbody > tr:nth-child(2) > td:nth-child(4)').innerText >= 2) {
                        document.querySelector('#score2').value = 2;
                    }
                    else if (document.querySelector('#rateform > div > table > tbody > tr:nth-child(3) > td:nth-child(4)').innerText >= 1) {
                        document.querySelector('#score3').value = 1;
                    }
                    else {
                        //清空油猴储存的所有键值
                        clearValues();
                        //停止评分标志
                        GM_setValue("IsWorking", false);
                        button.innerHTML = "已停止评分";
                        alert("评分次数已用完！");
                        return;
                    }
                    document.querySelector('#rateform > p > button').click();
                    //跳向下一个评分链接
                    setTimeout(GoToNextLink, 3000);
                }
                //如果已评分
                else if (document.querySelector(".alert_error") != undefined) {
                    //跳向下一个评分链接
                    GoToNextLink();
                }
            }, 3000);
        }, 1000);
    }
    //如果没开始评分
    else {
        button.innerHTML = "开始评分";
        //点击按钮开始评分
        button.onclick = startToWork;
    }

};
