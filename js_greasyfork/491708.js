// ==UserScript==
// @name         自動更新實況跑馬燈（YouTube Music）
// @namespace    自動更新實況跑馬燈（YouTube Music）
// @author       johnny860726
// @match        *music.youtube.com/*
// @run-at       document-end
// @description  傳送 request 至本地伺服器以更新跑馬燈歌名
// @version      20240405
// @downloadURL https://update.greasyfork.org/scripts/491708/%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E5%AF%A6%E6%B3%81%E8%B7%91%E9%A6%AC%E7%87%88%EF%BC%88YouTube%20Music%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/491708/%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E5%AF%A6%E6%B3%81%E8%B7%91%E9%A6%AC%E7%87%88%EF%BC%88YouTube%20Music%EF%BC%89.meta.js
// ==/UserScript==

var nowTitle = "";
const port = 8763;
const tick = 500;
const accessKey = '952d9c435911b5131c49046161b486ba39c535dc09305afde80b00a70887f8c88f15ea3d6846eff2a9e5fd2b3c873c70098108026e869ac743986a3e3ad20b0e';

// var elemSongName = document.querySelector(".title.style-scope.ytmusic-player-bar");
// var elemArtist = document.querySelector("span.subtitle.style-scope.ytmusic-player-bar > yt-formatted-string > a");
var sendReq = document.createElement('iframe');
sendReq.style = 'height: 50px; width: 100%; border: 0px;';
sendReq.id = 'sendReq';
sendReq.src = 'http://127.0.0.1:8763';
document.documentElement.appendChild(sendReq);

setInterval(function(){
    try{
        var elemSongName = document.querySelector(".title.style-scope.ytmusic-player-bar");
        var elemArtist = document.querySelector("span.subtitle.style-scope.ytmusic-player-bar > yt-formatted-string > a");
        if(elemSongName !== null && elemArtist !== null) {
            let newTitle = elemArtist.innerText + " - " + elemSongName.innerText;
            if(newTitle !== "" && newTitle !== nowTitle && newTitle !== undefined) {
                nowTitle = newTitle;
                sendReq.src = 'http://127.0.0.1:' + port + '/listen?accessKey=' + accessKey + '&title=' + encodeURIComponent(nowTitle);
                console.log(encodeURIComponent(nowTitle));
                console.log(nowTitle);
            }
        }
    }catch(e){
    }
}, tick);