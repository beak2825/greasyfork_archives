// ==UserScript==
// @name         恢复求生之路2创意工坊订阅
// @namespace    http://tampermonkey.net/
// @version      2024-01-11
// @description  通过本地workshop文件夹恢复求生之路2创意工坊订阅
// @author       blade_
// @match        https://steamcommunity.com/app/550/workshop/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484477/%E6%81%A2%E5%A4%8D%E6%B1%82%E7%94%9F%E4%B9%8B%E8%B7%AF2%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E8%AE%A2%E9%98%85.user.js
// @updateURL https://update.greasyfork.org/scripts/484477/%E6%81%A2%E5%A4%8D%E6%B1%82%E7%94%9F%E4%B9%8B%E8%B7%AF2%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E8%AE%A2%E9%98%85.meta.js
// ==/UserScript==

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function getSessionValue(sessionName) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(sessionName + '=') === 0) {
            return cookie.substring(sessionName.length + 1);
        }
    }
    return null;
}

async function getWoekshop() {
    // open directory picker
    const dirHandle = await window.showDirectoryPicker({mode:"readwrite"});
    return dirHandle;
}

async function getModList(dirHandle){
    //console.log(dirHandle)
    for await (const item of dirHandle.values()) {
        if (item.kind == 'file') {
            item.getFile().then(recovery)
            sleep(20)
        }
    }
}

async function recovery(fileHanlde){
    //console.log(fileHanlde)
    if(fileHanlde.type == 'image/jpeg') {
        let idx = fileHanlde.name.indexOf('.jpg')
        let modid = fileHanlde.name.substr(0, idx)
        subscribe(modid)
    }
}

function subscribe(modid){
    let sessionId = getSessionValue('sessionid')
    if(!sessionId) {
        console.log("sessionid not fond, key: sessionid")
    }
    // 创建请求数据
    const data = {
        id: modid,
        sessionid: sessionId,
        appid: 550,
        include_dependencies: false
    };
    // 发送添加到集合的请求
    jQuery.ajax({
        type: "POST",
        url: 'https://steamcommunity.com/sharedfiles/subscribe',
        data: data,
        success: function(response){
            if(response.success === 1){
                console.log('subscribe successfly, id:', modid)
            }else {
                console.log('subscribe failedid:', modid)
            }
        }
    });
}

function unsubscribe(modid){
    let sessionId = getSessionValue('sessionid')
    if(!sessionId) {
        console.log("sessionid not fond, key: sessionid")
    }
    // 创建请求数据
    const data = {
        id: modid,
        sessionid: sessionId,
        appid: 550,
    };
    // 发送添加到集合的请求
    jQuery.ajax({
        type: "POST",
        url: 'https://steamcommunity.com/sharedfiles/unsubscribe',
        data: data,
        success: function(response){
            if(response.success === 1){
                console.log('unsubscribe successfly, id:', modid)
            }else {
                console.log('unsubscribe failedid:', modid)
            }
        }
    });
}

(function() {
    'use strict';
    // Your code here...
    const button = document.createElement('button');
    button.innerText = "恢复求生之路创意工坊订阅";
    document.body.firstChild.after(button);
    button.addEventListener('click', async function () {
        getWoekshop().then(getModList)
    });
    // GM_registerMenuCommand('测试订阅功能(modid:3131682175)',()=>{
    //     subscribe(3131682175)
    // })
    // GM_registerMenuCommand('测试取消订阅(modid:3131682175)',()=>{
    //     unsubscribe(3131682175)
    // })
    // GM_registerMenuCommand('测试延时功能(倒数10s)',async()=>{
    //     for(let i = 10; i >= 0; i--) {
    //         console.log("countdown:",i)
    //         await sleep(1000)
    //     }
    // })
})();