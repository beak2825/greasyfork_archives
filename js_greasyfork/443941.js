// ==UserScript==
// @name         Copy Link to Current Time for YouTube
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  -
// @author       Theta
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443941/Copy%20Link%20to%20Current%20Time%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/443941/Copy%20Link%20to%20Current%20Time%20for%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const copyToClipboard = (text)=>{
      // テキストコピー用の一時要素を作成
      const pre = document.createElement('pre');
      // テキストを選択可能にしてテキストセット
      pre.style.webkitUserSelect = 'auto';
      pre.style.userSelect = 'auto';
      pre.textContent = text;
      // 要素を追加、選択してクリップボードにコピー
      document.body.appendChild(pre);
      document.getSelection().selectAllChildren(pre);
      const result = document.execCommand('copy');
      // 要素を削除
      document.body.removeChild(pre);
      return result;
    }

    const copyLinkToCurrentTime = ()=>{
      const videoElem = document.getElementById("movie_player");
      const currentTime = parseInt(videoElem.getCurrentTime());

      let urlString = location.href;
      urlString = urlString.replace(/&t=\d+s/,"");
      urlString += "&t=" + String(currentTime) + "s";
      copyToClipboard(urlString);
    }


    let intervalId = setInterval(()=>{
        if(location.pathname!=='/watch'){
            return;
        }

        const btn = document.createElement('button');
        btn.prepend("⏱");
        btn.className = "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading ";
        btn.id = "currentTimeButton";
        btn.style.fontSize = "20px";
        btn.style.margin = "0 0 0 10px";

        btn.onclick= () => {
          copyLinkToCurrentTime();
        }

        const par = document.getElementById("owner");

        if(document.getElementById("currentTimeButton")){
            console.log(1);
        }else{
            par.append(btn);
            console.log(2);
        }
    }, 3000);
})();