// ==UserScript==
// @name        Youtube(モバイル)ツールパネルキーボードショートカット
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Execute UserScript
// @author       Your Name
// @grant        none
// @match        https://m.youtube.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531655/Youtube%28%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%29%E3%83%84%E3%83%BC%E3%83%AB%E3%83%91%E3%83%8D%E3%83%AB%E3%82%AD%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%89%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/531655/Youtube%28%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%29%E3%83%84%E3%83%BC%E3%83%AB%E3%83%91%E3%83%8D%E3%83%AB%E3%82%AD%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%89%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    document.addEventListener('keydown', (e) => {
        
                if (e.key === 'a') {
                    javascript:(function() {
          const panel = document.createElement('div');
          panel.style = 'position:fixed;top:300px;left:10px;background:white;border:1px solid black;padding:10px;z-index:9999;';
          document.body.appendChild(panel);
          const closeButton = document.createElement('button');
          closeButton.textContent = '☒';
          closeButton.onclick = () => document.body.removeChild(panel);
          closeButton.style = 'float:right;';
          panel.appendChild(closeButton);
          
            (function() {
              const btn0 = document.createElement('button');
              btn0.textContent = "RVXに切り替え";
              btn0.style = 'display:block;margin:5px 0;';
              btn0.onclick = function() {
                javascript:(function(){
    var videoId = window.location.search.match(/[?&]v=([^&]+)/);
    if (videoId) {
        var video = document.querySelector('video');
        var speed = video ? video.playbackRate : 1;  // 現在の再生速度を取得（デフォルトは1）
        var url = "https://youtu.be/" + videoId[1];
        window.location.href = "intent://www.youtube.com/watch?v=" + videoId[1] + "&speed=" + speed + "#Intent;package=app.rvx.android.youtube;scheme=https;S.browser_fallback_url=" + encodeURIComponent(url) + ";end";
    } else {
        alert('動画IDが取得できませんでした。');
    }
})();
                panel.style.display = 'none';
              };
              panel.appendChild(btn0);
            })();
          
            (function() {
              const btn1 = document.createElement('button');
              btn1.textContent = "動画ダウンロード";
              btn1.style = 'display:block;margin:5px 0;';
              btn1.onclick = function() {
                javascript:(function(){window.location.href='intent://youtube.com/watch?v='+location.href.match(/v=([^&]+)/)[1]+'#Intent;package=org.schabi.newpipe;scheme=http;launchFlags=0x10000000;end;'})(); 
                panel.style.display = 'none';
              };
              panel.appendChild(btn1);
            })();
          
            (function() {
              const btn2 = document.createElement('button');
              btn2.textContent = "3倍速";
              btn2.style = 'display:block;margin:5px 0;';
              btn2.onclick = function() {
                javascript:(function(){
  var videos = document.getElementsByTagName('video');
  for(var i=0; i<videos.length; i++){
    videos[i].playbackRate = 3.0;
  }
})();
                panel.style.display = 'none';
              };
              panel.appendChild(btn2);
            })();
          
            (function() {
              const btn3 = document.createElement('button');
              btn3.textContent = "スピードコントローラー";
              btn3.style = 'display:block;margin:5px 0;';
              btn3.onclick = function() {
                javascript:(function() {    if (document.getElementById('videoControlPopup')) {        document.getElementById('videoControlPopup').remove();        return;    }    const popup = document.createElement('div');    popup.id = 'videoControlPopup';    popup.style.position = 'fixed';    popup.style.bottom = '0';    popup.style.width = '100%';    popup.style.backgroundColor = '#fff';    popup.style.borderTop = '2px solid #000';    popup.style.padding = '10px';    popup.style.zIndex = '9999';    popup.style.display = 'flex';    popup.style.flexDirection = 'column';    popup.style.alignItems = 'center';    const header = document.createElement('div');    header.style.display = 'flex';    header.style.justifyContent = 'center';    header.style.alignItems = 'center';    header.style.width = '100%';    header.style.marginBottom = '10px';    const maximizeButton = document.createElement('button');    maximizeButton.textContent = '最大化';    maximizeButton.style.marginRight = '10px';    maximizeButton.onclick = function() {        const video = document.querySelector('video');        if (video) {            video.requestFullscreen().catch(console.error);        }    };    const playButton = document.createElement('button');    playButton.textContent = '再生';    playButton.style.marginRight = '10px';    playButton.onclick = function() {        const video = document.querySelector('video');        if (video) video.play();    };    const stopButton = document.createElement('button');    stopButton.textContent = '停止';    stopButton.style.marginLeft = '10px';    stopButton.onclick = function() {        const video = document.querySelector('video');        if (video) video.pause();    };    const closeButton = document.createElement('button');    closeButton.textContent = 'x';    closeButton.style.marginLeft = '5px';    closeButton.onclick = function() {        popup.remove();    };    header.appendChild(maximizeButton);    header.appendChild(playButton);    header.appendChild(stopButton);    header.appendChild(closeButton);    popup.appendChild(header);    const speedControls = [0.25, 0.5, 1, 2, 3];    const speedContainer = document.createElement('div');    speedContainer.style.display = 'flex';    speedContainer.style.justifyContent = 'center';    speedControls.forEach(speed => {        const button = document.createElement('button');        button.textContent = `x${speed}`;        button.style.margin = '5px';        button.onclick = function() {            const video = document.querySelector('video');            if (video) video.playbackRate = speed;        };        speedContainer.appendChild(button);    });    popup.appendChild(speedContainer);    const skipTimes = [-30, -10, -5, 5, 10, 30];    const skipContainer = document.createElement('div');    skipContainer.style.display = 'flex';    skipContainer.style.justifyContent = 'center';    skipTimes.forEach(time => {        const button = document.createElement('button');        button.textContent = `${time > 0 ? '+' : ''}${time}`;        button.style.margin = '5px';        button.onclick = function() {            const video = document.querySelector('video');            if (video) video.currentTime += time;        };        skipContainer.appendChild(button);    });    popup.appendChild(skipContainer);    document.body.appendChild(popup);})();
                panel.style.display = 'none';
              };
              panel.appendChild(btn3);
            })();
          
            (function() {
              const btn4 = document.createElement('button');
              btn4.textContent = "字幕";
              btn4.style = 'display:block;margin:5px 0;';
              btn4.onclick = function() {
                javascript:(function(){window.location.href='https://subtitle.to/' + window.location.href;})();
                panel.style.display = 'none';
              };
              panel.appendChild(btn4);
            })();
          
            (function() {
              const btn5 = document.createElement('button');
              btn5.textContent = "コメントフィルター";
              btn5.style = 'display:block;margin:5px 0;';
              btn5.onclick = function() {
                javascript:(function(){
 
  var commentBtn = Array.from(document.querySelectorAll('button')).find(e => e.innerText.includes('コメント'));
  if(commentBtn){
    commentBtn.click();
  } else {
    alert('コメントボタンが見つかりませんでした');
  }
 
  var existingBox = document.getElementById('yt-comment-filter-box');
  if(existingBox) existingBox.remove();
 
  var box = document.createElement('div');
  box.id = 'yt-comment-filter-box';
  box.style.position = 'fixed';
  box.style.top = '270px';
  box.style.left = '100px';
  box.style.background = 'rgba(255,255,255,0.9)';
  box.style.border = '1px solid #ccc';
  box.style.padding = '7px';
  box.style.zIndex = 9999;
  box.style.borderRadius = '7px';
 
  var input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'キーワード';
  input.style.marginRight = '7px';
  box.appendChild(input);
 
  var btnSearch = document.createElement('button');
  btnSearch.innerText = '検索';
  btnSearch.style.marginRight = '7px';
  box.appendChild(btnSearch);
 
  var btnClose = document.createElement('button');
  btnClose.innerText = '☒';
 
  btnClose.style.fontSize = '24px';
  btnClose.style.padding = '10px 15px';
  box.appendChild(btnClose);
 
  document.body.appendChild(box);
 
  btnClose.addEventListener('click', function(){
    box.remove();
  });
 
  btnSearch.addEventListener('click', function(){
    var keyword = input.value.trim();
    if(!keyword){
      alert('キーワードを入力してください');
      return;
    }
    var comments = document.querySelectorAll('ytd-comment-thread-renderer, ytm-comment-thread-renderer');
    if(comments.length === 0){
      alert('コメントが見つかりません');
      return;
    }
    var found = false;
    comments.forEach(function(comment){
      if(comment.innerText.toLowerCase().indexOf(keyword.toLowerCase()) !== -1){
        comment.style.display = '';
        if(!found){
          comment.scrollIntoView({behavior:'smooth', block:'start'});
          found = true;
        }
      } else {
        comment.style.display = 'none';
      }
    });
    if(!found){
      alert('キーワードに一致するコメントは見つかりませんでした');
    }
  });
})();
                panel.style.display = 'none';
              };
              panel.appendChild(btn5);
            })();
          
            (function() {
              const btn6 = document.createElement('button');
              btn6.textContent = "Geminiに要約";
              btn6.style = 'display:block;margin:5px 0;';
              btn6.onclick = function() {
                javascript:(function(){ 
    var currentUrl = window.location.href.replace(/^https:\/\/m\.youtube/, 'https://www.youtube'); 
    var summaryText = '以下の動画を要約して\n ' + currentUrl; 
    var textArea = document.createElement('textarea'); 
    textArea.value = summaryText; 
    document.body.appendChild(textArea); 
    textArea.select(); 
    document.execCommand('copy'); 
    document.body.removeChild(textArea); 
    window.location.href = 'https://gemini.google.com/app'; 
})();
                panel.style.display = 'none';
              };
              panel.appendChild(btn6);
            })();
          
          document.addEventListener('click', function(e) {
            if (!panel.contains(e.target)) {
              panel.style.display = 'none';
            }
          }, { capture: true });
        })();
                }            
    });
})();