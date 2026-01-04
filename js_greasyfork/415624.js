// ==UserScript==
// @name         YouTube to mp3 Downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/415624/YouTube%20to%20mp3%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/415624/YouTube%20to%20mp3%20Downloader.meta.js
// ==/UserScript==
(()=>{
    'use strict';
    const download = (url, file_name) => {
        GM_download({
            url: url,
            name: file_name,
            saveAs: false,
        });
    };
    const addBtn = (alies, func) => {
        var btn = document.createElement("button");
        btn.innerText = alies;
        btn.addEventListener("click",func);
        document.body.append(btn);
        return btn;
    };
    function setCSS(elm,parm){
        for(let k in parm) elm.style[k] = parm[k];
        return elm;
    }
    const elm = setCSS(addBtn("download as mp3",main),{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 999999,
    });
    function post(url,payload,onload){
        function shapeParam(json){
            return Object.keys(json).map(v=>v+'='+json[v]).join('&');
        }
        GM.xmlHttpRequest({
            method: "POST",
            url: url,
            data: shapeParam(payload),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            onload: function(response) {
                onload(response.responseText);
            }
        });
    };
    function main(){
        const id = location.href.match(/[\?&]v=([^&]+)/)[1];
        const title = document.getElementsByTagName("title")[0].innerText.replace(/ - YouTube$/,'');
        unsafeWindow.id = id;
        setCSS(elm,{
            display: "none"
        });
        post("https://www.y2mate.com/mates/mp3/ajax",{
            url: location.href,
            q_auto: 1,
            ajax: 1,
        },function(){
            main2(id, title);
        });
    };
    function main2(id, title){
        post("https://www.y2mate.com/mates/mp3Convert",{
            type: "youtube",
            _id: "5f40aa59d684eb68478b4571",
            v_id: id,
            mp3_type: "320", // kbps
            token: '',
        },function(res) {
            unsafeWindow.s = res;
            setCSS(elm,{
                display: "block"
            });
            const url = res.match(/<a href=\\"[^"]+/)[0].match(/".+$/)[0].slice(1,-1);
            download(url, title);
        });
    }
})();