// ==UserScript==
// @name         自動更新實況跑馬燈_Spotify
// @namespace    自動更新實況跑馬燈_Spotify
// @author       johnny860726
// @match        *open.spotify.com/*
// @run-at       document-end
// @description  傳送 request 至本地伺服器以更新跑馬燈歌名
// @version      20200722
// @downloadURL https://update.greasyfork.org/scripts/407531/%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E5%AF%A6%E6%B3%81%E8%B7%91%E9%A6%AC%E7%87%88_Spotify.user.js
// @updateURL https://update.greasyfork.org/scripts/407531/%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E5%AF%A6%E6%B3%81%E8%B7%91%E9%A6%AC%E7%87%88_Spotify.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var nowTitle = "";
    const port = 8763;
    const tick = 500;

    var elem = document.querySelector(".now-playing");
    var sendReq = document.createElement('iframe');
    sendReq.style = 'height: 50px; width: 100%; border: 0px;';
    sendReq.id = 'sendReq';
    sendReq.src = '';
    document.documentElement.appendChild(sendReq);

    setInterval(function() {
        try {
            let titleElem = document.querySelector(".now-playing");
            if (titleElem !== null) {
                let titleElems = titleElem.innerText.split("\n");
                if (titleElems.length === 2) {
                    let newTitle = titleElems[1] + " - " + titleElems[0];
                    if(newTitle !== "" && newTitle !== nowTitle && newTitle !== undefined) {
                        nowTitle = newTitle;
                        sendReq.src = 'http://127.0.0.1:' + port + '/listen?title=' + encodeURIComponent(nowTitle);
                        console.log(encodeURIComponent(nowTitle));
                    }
                }
            }
        }catch(e){
        }
    }, tick);
})();