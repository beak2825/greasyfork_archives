// ==UserScript==
// @name         Youtubeツールパネル(モバイル用)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Execute UserScript
// @author       Your Name
// @match        https://m.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526708/Youtube%E3%83%84%E3%83%BC%E3%83%AB%E3%83%91%E3%83%8D%E3%83%AB%28%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526708/Youtube%E3%83%84%E3%83%BC%E3%83%AB%E3%83%91%E3%83%8D%E3%83%AB%28%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement('div');
    button.style.position = 'fixed';
    button.style.top = '15px';
    button.style.left = '120px';
    button.style.width = '25px';
    button.style.height = '25px';
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '10000';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';

    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.style.width = '20px';
        line.style.height = '3px';
        line.style.backgroundColor = 'white';
        line.style.margin = '2px 0';
        button.appendChild(line);
    }

    button.addEventListener('click', () => {
javascript:(function() {
  const panel = document.createElement('div');
  panel.style = 'position:fixed;top:30px;left:10px;background:white;border:1px solid black;padding:10px;z-index:9999;';
  document.body.appendChild(panel);
 
  const closeButton = document.createElement('button');
  closeButton.textContent = '☒';
  closeButton.onclick = () => document.body.removeChild(panel);
  closeButton.style = 'float:right;';
  panel.appendChild(closeButton);
 
  
    const btn0 = document.createElement('button');
    btn0.textContent = "1倍速";
    btn0.style = 'display:block;margin:5px 0;';
    btn0.onclick = function() { javascript:(function(){
  var videos = document.getElementsByTagName('video');
  for(var i=0; i<videos.length; i++){
    videos[i].playbackRate = 1.0;
  }
})(); };
    panel.appendChild(btn0);
  
    const btn1 = document.createElement('button');
    btn1.textContent = "2倍速";
    btn1.style = 'display:block;margin:5px 0;';
    btn1.onclick = function() { javascript:(function(){
  var videos = document.getElementsByTagName('video');
  for(var i=0; i<videos.length; i++){
    videos[i].playbackRate = 2.0;
  }
})(); };
    panel.appendChild(btn1);

    const btn2 = document.createElement('button');
    btn2.textContent = "3倍速";
    btn2.style = 'display:block;margin:5px 0;';
    btn2.onclick = function() { javascript:(function(){
  var videos = document.getElementsByTagName('video');
  for(var i=0; i<videos.length; i++){
    videos[i].playbackRate = 3.0;
  }
})(); };
    panel.appendChild(btn2);
  
    const btn3 = document.createElement('button');
    btn3.textContent = "スピードコントローラー";
    btn3.style = 'display:block;margin:5px 0;';
    btn3.onclick = function() { javascript:(function() {    if (document.getElementById('videoControlPopup')) {        document.getElementById('videoControlPopup').remove();        return;    }    const popup = document.createElement('div');    popup.id = 'videoControlPopup';    popup.style.position = 'fixed';    popup.style.bottom = '0';    popup.style.width = '100%';    popup.style.backgroundColor = '#fff';    popup.style.borderTop = '2px solid #000';    popup.style.padding = '10px';    popup.style.zIndex = '9999';    popup.style.display = 'flex';    popup.style.flexDirection = 'column';    popup.style.alignItems = 'center';    const header = document.createElement('div');    header.style.display = 'flex';    header.style.justifyContent = 'center';    header.style.alignItems = 'center';    header.style.width = '100%';    header.style.marginBottom = '10px';    const maximizeButton = document.createElement('button');    maximizeButton.textContent = '最大化';    maximizeButton.style.marginRight = '10px';    maximizeButton.onclick = function() {        const video = document.querySelector('video');        if (video) {            video.requestFullscreen().catch(console.error);        }    };    const playButton = document.createElement('button');    playButton.textContent = '再生';    playButton.style.marginRight = '10px';    playButton.onclick = function() {        const video = document.querySelector('video');        if (video) video.play();    };    const stopButton = document.createElement('button');    stopButton.textContent = '停止';    stopButton.style.marginLeft = '10px';    stopButton.onclick = function() {        const video = document.querySelector('video');        if (video) video.pause();    };    const closeButton = document.createElement('button');    closeButton.textContent = 'x';    closeButton.style.marginLeft = '5px';    closeButton.onclick = function() {        popup.remove();    };    header.appendChild(maximizeButton);    header.appendChild(playButton);    header.appendChild(stopButton);    header.appendChild(closeButton);    popup.appendChild(header);    const speedControls = [0.25, 0.5, 1, 2, 3];    const speedContainer = document.createElement('div');    speedContainer.style.display = 'flex';    speedContainer.style.justifyContent = 'center';    speedControls.forEach(speed => {        const button = document.createElement('button');        button.textContent = `x${speed}`;        button.style.margin = '5px';        button.onclick = function() {            const video = document.querySelector('video');            if (video) video.playbackRate = speed;        };        speedContainer.appendChild(button);    });    popup.appendChild(speedContainer);    const skipTimes = [-30, -10, -5, 5, 10, 30];    const skipContainer = document.createElement('div');    skipContainer.style.display = 'flex';    skipContainer.style.justifyContent = 'center';    skipTimes.forEach(time => {        const button = document.createElement('button');        button.textContent = `${time > 0 ? '+' : ''}${time}`;        button.style.margin = '5px';        button.onclick = function() {            const video = document.querySelector('video');            if (video) video.currentTime += time;        };        skipContainer.appendChild(button);    });    popup.appendChild(skipContainer);    document.body.appendChild(popup);})(); };
    panel.appendChild(btn3);
  
    const btn4 = document.createElement('button');
    btn4.textContent = "動画ダウンロード";
    btn4.style = 'display:block;margin:5px 0;';
    btn4.onclick = function() { javascript:(function(){    var url = window.location.href;    var videoId = url.match(/v=([^&]+)/)[1];    window.location.href = 'https://www.y2mate.com/youtube/' + videoId;})(); };
    panel.appendChild(btn3);
  
    const btn5 = document.createElement('button');
    btn5.textContent = "字幕";
    btn5.style = 'display:block;margin:5px 0;';
    btn5.onclick = function() { javascript:(function(){window.location.href='https://subtitle.to/' + window.location.href;})(); };
    panel.appendChild(btn5);
  
    const btn6 = document.createElement('button');
    btn6.textContent = "コメントフィルター";
    btn6.style = 'display:block;margin:5px 0;';
    btn6.onclick = function() { javascript:(function() {  let searchBox = document.createElement('div');  searchBox.style.position = 'fixed';  searchBox.style.top = '10px';  searchBox.style.right = '10px';  searchBox.style.background = '#fff';  searchBox.style.padding = '10px';  searchBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';  searchBox.style.zIndex = '10000';    let input = document.createElement('input');  input.type = 'text';  input.placeholder = '検索するキーワード';    let closeButton = document.createElement('button');  closeButton.innerText = 'x';  closeButton.style.marginLeft = '10px';    closeButton.onclick = function() {    searchBox.remove();  };    searchBox.appendChild(input);  searchBox.appendChild(closeButton);  document.body.appendChild(searchBox);    input.oninput = function() {    let keyword = input.value.toLowerCase();    document.querySelectorAll('#comments #content-text').forEach(function(comment) {      if (comment.innerText.toLowerCase().includes(keyword)) {        comment.closest('ytd-comment-thread-renderer').style.display = '';      } else {        comment.closest('ytd-comment-thread-renderer').style.display = 'none';      }    });  };})(); };
    panel.appendChild(btn6);
    
    const btn7 = document.createElement('button');
    btn7.textContent = "Geminiに動画を要約";
    btn7.style = 'display:block;margin:5px 0;';
    btn7.onclick = function() { javascript:(function(){ var currentUrl = window.location.href; var summaryText = '以下の動画を要約して\n ' + currentUrl; var textArea = document.createElement('textarea'); textArea.value = summaryText; document.body.appendChild(textArea); textArea.select(); document.execCommand('copy'); document.body.removeChild(textArea); window.location.href = 'https://gemini.google.com/app'; })(); };
    panel.appendChild(btn7);
  
})();
    });

    document.body.appendChild(button);
})();