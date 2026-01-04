// ==UserScript==
// @name         steam创意工坊id获取
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  steam创意工坊每个项目添加一个按钮，点击即获取项目id，并生成steamcmd可用的下载命令字符串复制到剪贴板内
// @author       You
// @match        https://steamcommunity.com/workshop/browse/?*
// @match        https://steamcommunity.com/sharedfiles/filedetails/?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486125/steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8Aid%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/486125/steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8Aid%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

//作用：生成toast，让其在toast_container中，显示在页面中上部，会永久性向页面添加一个id为ths_toast_container的div标签
function showStackToast(message, backcolor='rgb(76, 175, 80)', timeout=3000){
    //没有容器则生成容器
    let box=document.querySelector("body > div#ths_toast_container");
    if(!box){
        box=document.createElement('div');
        box.id="ths_toast_container";
        box.style.cssText = `
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    right: 10px;
    width: 300px;
    height: auto;
    display: flex;
    z-index: 9999;
    flex-direction: column-reverse;`;
        document.body.appendChild(box);
    }
    //创建toast
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.cssText = `
    padding: 10px;
    background-color: ${backcolor};
    color: rgb(255, 255, 255);
    border-radius: 10px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    box-shadow: rgb(0 0 0 / 30%) 0px 5px 10px;
    opacity: 1;
    transition: opacity 0.3s ease-in-out 0s;
    z-index: 9999;
    margin: 5px;
  `;
    box.appendChild(toast);
    toast.style.opacity = 1;
    if(timeout > 0){
        setTimeout(() => {
            toast.style.opacity = 0;
            setTimeout(() => {
                box.removeChild(toast);
            }, 300);
        }, timeout);
    }
    return toast;
}

//作用：提示
function showToast(){
    showStackToast("已将id复制到剪贴板");
}

//作用：生成想要获取的字符串，即steamcmd的下载指令
function getCmdString(appId, itemId){
    //最后生成steamcmd可用的下载命令字符串，如：workshop_download_item 431960 3078285611
    return `workshop_download_item ${appId} ${itemId}`;
}

//作用：列表页面的主函数
function browseMainFuntion(){
    const items=document.querySelectorAll("div.workshopItemAuthorName");
    items.forEach(item => {
        let button=document.createElement("button");
        button.innerText="GetID";
        button.style.cssText = `
            position: absolute;
            right: 3px;
            background-color: #333;
            color: #fff;`;
        button.addEventListener('click', async ()=>{
            //创意工坊项目的id
            let itemId=item.parentElement.firstElementChild.getAttribute("data-publishedfileid");
            console.log(itemId);
            //游戏id
            const params = new URLSearchParams(window.location.search);
            let appId=params.get('appid');
            await GM_setClipboard(getCmdString(appId, itemId), "text", showToast);
        });
        item.appendChild(button);
    });
}

//作用：详细界面主函数
function detailMainFuntion(){
    let box=document.querySelector("div.game_area_purchase_game");
    let button=document.createElement("button");
    button.innerText="GetID";
    button.style.cssText = `
            position: absolute;
            top: 20%;
            right: 3px;
            background-color: #333;
            color: #fff;`;
    button.addEventListener('click', async ()=>{
            //创意工坊项目的id
            const params = new URLSearchParams(window.location.search);
            let itemId=params.get('id');
            console.log(itemId);
            //游戏id
            let appId=document.querySelector("div.apphub_OtherSiteInfo > a")?.getAttribute("data-appid");
            await GM_setClipboard(getCmdString(appId, itemId), "text", showToast);
    });
    box.appendChild(button);
}

//作用：主函数
function mainFunction(){
    if('/workshop/browse/'===window.location.pathname){
        browseMainFuntion();
    }else if('/sharedfiles/filedetails/'===window.location.pathname){
        detailMainFuntion();
    }else{
        showStackToast(`未知的路径【${window.location.pathname}】`, "red");
    }
}

(function() {
    'use strict';

    mainFunction();
})();