// ==UserScript==
// @name         Magnet Transfer To Local  QbitTorrent
// @namespace    mscststs
// @version      0.2
// @description  将 magnet 链接发送到本地 qbitTorrent
// @author       mscststs
// @match        https://rarbgprx.org/*
// @icon         https://www.google.com/s2/favicons?domain=rarbgprx.org
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/436153/Magnet%20Transfer%20To%20Local%20%20QbitTorrent.user.js
// @updateURL https://update.greasyfork.org/scripts/436153/Magnet%20Transfer%20To%20Local%20%20QbitTorrent.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const LocalConsoleHost = 'http://192.168.3.169:6363';
    const AddHref = LocalConsoleHost + '/api/v2/torrents/add';

    GM_addStyle(`
    .qbit-transfer{
        margin:0 5px;
        background-style:none;
        border:none;
        background-color:#3860bb;
        color:white;
        display:inline-block;
        cursor:pointer;
    }
    `)

    function CallAdd(url){
        const Form = new FormData();
        const params = {
            urls: url,
            autoTMM: true,
            cookie: "",
            rename: "",
            category: "",
            paused: false,
            contentLayout: "Original",
            dlLimit: "NaN",
            upLimit: "NaN",
        }
        Object.entries(params).map(([key,val])=>{
            Form.set(key,val)
        })
        console.log(url,Form)


        GM_xmlhttpRequest({
            url :AddHref,
            data: Form,
            method:"POST",
            onload: function(response){
                alert(response.responseText)
            }
        })
    }
    function createTransferBtn(linkNode){
        const btn = document.createElement("button");
        btn.className = 'qbit-transfer'
        btn.innerText = '使用 NAS 下载';

        linkNode.appendChild(btn);
        return btn

    }
    /* 添加事件 */
    function createMagnetLinkEvent(linkNode){
        const btn = createTransferBtn(linkNode);
        btn.addEventListener('click', (e)=>{
            e.preventDefault();
            CallAdd(linkNode.href);
        })
    }
    const magnetLinks = [...document.querySelectorAll("a[href^='magnet:?xt']")];

    magnetLinks.forEach(createMagnetLinkEvent);


})();