// ==UserScript==
// @name         Music Player TikTok
// @namespace    github.com.music.player.tiktok
// @version      1.0.5
// @description  Get songs from account tiktok for MediaPlayer 
// @author       qthang
// @match        https://www.tiktok.com/*
// @grant        GM_xmlhttpRequest
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://unpkg.com/@popperjs/core@2/dist/umd/popper.min.js
// @require https://unpkg.com/tippy.js@6/dist/tippy-bundle.umd.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441652/Music%20Player%20TikTok.user.js
// @updateURL https://update.greasyfork.org/scripts/441652/Music%20Player%20TikTok.meta.js
// ==/UserScript==
/*<script src="https://unpkg.com/@popperjs/core@2/dist/umd/popper.min.js"></script>
<script src="https://unpkg.com/tippy.js@6/dist/tippy-bundle.umd.js"></script>*/
(function () {
  "use strict";
  const body = "body";
  importLink(
    "css",
    `https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css`,
    `sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T`
  );
  importLink(
    "css",
    `https://pro.fontawesome.com/releases/v5.10.0/css/all.css`,
    `sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p`
  );
  importStyleCss(
    `https://raw.githubusercontent.com/qthang-git/userscripts/main/musicplayer.tiktok.min.css`
  );
  initUI();
  importLink(
    "js",
    `https://code.jquery.com/jquery-3.3.1.min.js`,
    `sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=`
  );
  importLink(
    `js`,
    `https://unpkg.com/@popperjs/core@2.11.4/dist/umd/popper.min.js`,
    `sha384-IQsByMjnJ4oUdZoDmVz0Ux9lwH+pFRte3CHB6GO8oW5ZhyRK4wd8eBNa8F58bQh1`
  );
  importLink(
    `js`,
    `https://unpkg.com/tippy.js@6.3.7/dist/tippy-bundle.umd.min.js`,
    `sha384-AiTRpehQ7zqeua0Ypfa6Q4ki/ddhczZxrKtiQbTQUlJIhBkTeyoZP9/W/5ulFt29`
  );
  const apiConfig = {
    host: `tiktok-all-in-one.p.rapidapi.com`,
    key: `6150648b36msh4af9f79046a129ap1bed93jsn0973858a8196`
  }
  
  var listSong = [];
  var isPlay = false;
  var isRandom = false;
  var isRepeat1 = false;
  var isRepeatAll = false;
  var isFirst = true;
  var indexCurrent = 0;
  var audio = document.getElementById('audio');
  var durationTime = document.querySelector('.end-time');
  var remainingTime = document.querySelector('.start-time');
  
  
  function removeAnimation(){
    const el = document.querySelector('.music-item.playing');
    if(el != null){
      document.querySelector('.play-song .thumbnail').style.animationPlayState = 'paused';
      el.classList.remove('playing');
    }
  }
  
  function addAnimation(){
    removeAnimation();
    const li = document.querySelectorAll('.music-item');
    li[indexCurrent].classList.add('playing');
    document.querySelector('.play-song .thumbnail').style.animationPlayState = 'running';    
    const li_playing = isRepeatAll === false ? (document.querySelector('.music-item.playing')) : (document.querySelector('.music-item.playing') || document.querySelector('.music-item:first-child'));
    li_playing.scrollIntoView(true);
  }
  
  function getTitleSong(){
      document.querySelector('.title-song').innerHTML = `<span>Name: ${listSong[indexCurrent].music.title}</span>`;
  }
  
  function formatTime(time){
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time - (minutes * 60));
    if(minutes < 10) {minutes = '0'.concat(minutes.toString())};
    if(seconds < 10) {seconds = '0'.concat(seconds.toString())};
    return `${minutes}:${seconds}`;
  }
  const rangeBar = document.querySelector('.timeline-bar');
  function handleChange(){
     audio.currentTime = rangeBar.value;
  }
  rangeBar.addEventListener('change', handleChange);
  
  function displayTimer(){
    const {duration, currentTime} = audio;
    rangeBar.max = duration;
    rangeBar.value = currentTime;
    remainingTime.textContent = formatTime(currentTime);
    if(!duration){
      durationTime.textContent = '00:00';
    }else{
      durationTime.textContent = formatTime(duration);
    }
  }
  
  displayTimer();
  setInterval(displayTimer, 1000);
 
  
  const btnUI = document.getElementById('btn-open');
  btnUI.addEventListener('click', function () {
    const frame = document.getElementById('tiktok-music-wrapper');
    btnUI.classList.toggle('visibility');
    frame.classList.toggle('visibility');
  })
  
  const btnRandom = document.getElementById('random-song');
  btnRandom.addEventListener('click', function(){
    if(isRandom === false){
      isRandom = true 
      this.setAttribute('data-control-random','enable');
    }else{
      isRandom = false;
      this.setAttribute('data-control-random','disable');
    }
  });
  
  const btnRepeat = document.getElementById('repeat-song');
  btnRepeat.addEventListener('click', function(){
    if(isRepeatAll !== true && isRepeat1 !== true){
      isRepeatAll = true;
      this.setAttribute('data-control-repeat','all');
      tippy('#reapet-song',{content: 'Repeat All',});
    }else if(isRepeatAll === true && isRepeat1 === false){
      isRepeatAll = isRepeat1;
      isRepeat1 = true;
      this.setAttribute('data-control-repeat','again');
      this.innerHTML = '<span><i class="fas fa-repeat-1"></i></span>'
    }else{
      isRepeat1 = false;
      this.setAttribute('data-control-repeat','disable');
      this.innerHTML = '<span><i class="fas fa-repeat"></i></span>'
    }
  })
  
  const btnPlay = document.getElementById('play-song');
  function playPauseSong(){
    audio.src = listSong[indexCurrent].music.play_url.uri;
    if(isPlay === true){
      audio.play();
      btnPlay.innerHTML = `<span><i class='fas fa-pause'></i></span>`;
    }else{
      audio.pause();
      btnPlay.innerHTML = `<span><i class='fas fa-play'></i></span>`;
    }
    addAnimation();
  }
  btnPlay.onclick = function(){
    isPlay === true ? isPlay = false : isPlay = true;
    if(isFirst === true) {
      audio.src = listSong[indexCurrent].music.play_url.uri;
      isFirst = false;
    }
    if(isPlay === true){
      audio.play();
      btnPlay.innerHTML = `<span><i class='fas fa-pause'></i></span>`;
      addAnimation();      
    }else{
      audio.pause();
      btnPlay.innerHTML = `<span><i class='fas fa-play'></i></span>`;
      removeAnimation();
    }
  };
  
  function random(){
    return Math.floor(Math.random() * listSong.length);
  }
  
  function unique(arr) {
    return Array.from(new Set(arr))
  }
  
  const btnNext = document.getElementById('next-song');
  function nextSong(){
    if(isRepeat1 === false){
      if(indexCurrent < listSong.length - 1){
        indexCurrent++;
      }else{
        if(!isRepeatAll){
          alert(`Can't skip to the next track. This is the last song of the playlist`);
        }else{
          indexCurrent = 0;
        }
      }      
      if(isRandom){
        indexCurrent = random();
      }
    }
    isPlay = true;
    getTitleSong();
    playPauseSong();
  }
  btnNext.addEventListener('click', nextSong);
  audio.addEventListener('ended', function(){
    if(isRepeat1) indexCurrent = indexCurrent;
    if(isRandom) indexCurrent = random();
    if(indexCurrent === (listSong.length - 1) && isRepeatAll){
      indexCurrent = -1;
    }else{
      isPlay = false;
      playPauseSong();
      removeAnimation();
    }
    isPlay = true;
    indexCurrent++;
    getTitleSong();
    playPauseSong();
  }); 
  
  const btnPrev = document.getElementById('previous-song');
  function prevSong(){
    if(isRepeat1 === false){
      if(indexCurrent === 0 ){
        if(!isRepeatAll){
          alert(`Can't back to the previous track. This is the first song of the playlist`);
        }else{
          indexCurrent = listSong.length - 1;          
        }
      }else{
        indexCurrent--;              
      }
      if(isRandom){
        indexCurrent = random();
      }
    }
    isPlay = true;
    getTitleSong();
    playPauseSong();
  }
  btnPrev.addEventListener('click', prevSong);
  
  function playSongInPlaylist(){
    const li = document.querySelectorAll('.music-item');
    li.forEach(item => {
      item.addEventListener('click', function(){
        removeAnimation();
        item.classList.add('playing');
        const id_source = item.getAttribute('data-source').split('-');
        indexCurrent = parseInt(id_source[1]);
        isPlay = true;
        getTitleSong();
        playPauseSong();
      })
    })
  }
  
  function getUser() {
    const username = window.location.href.split("@");
    const url =
      "https://tiktok28.p.rapidapi.com/profile/@" +
      username[1] +
      "?schemaType=1";
    const data = null;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.onload = function(){
      const json_details = JSON.parse(this.responseText);
      getListSong(json_details.user);
    }
    xhr.open("GET", url);
    xhr.setRequestHeader("x-rapidapi-host", "tiktok28.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", apiConfig.key);
    xhr.send(data);
  }

  function getListSong(user) {
    const url = `https://tiktok-all-in-one.p.rapidapi.com/user/videos?id=${user.id}&max_cursor=1632138733000`;
    fetch(url,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": apiConfig.host,
          "x-rapidapi-key": apiConfig.key
        }
      }
    )
      .then((response) => { return response.json() })
      .then((data) => {
        if(data.aweme_list !== null){
          const listRemoveNull = data.aweme_list.filter(function(e) {
              return e.music.play_url.uri !== '';
          });
          listSong = [
            ...new Map(listRemoveNull.map((item) => [item.music.id, item])).values(),
          ];
          var musicItem = '';
          listSong.forEach((item, index) => {
            musicItem += `<li class="music-item song-${index}" data-source="source-${index}"><div class="music-item-wrapper"><div class="music-avt rounded-circle"><span class="avt-icon"><i class="fas fa-music"></i></span></div><div class="music-content"><div class="song-info"><span class="song-title">${item.music.title}</span><span class="song-artist">Artist: ${item.music.author !== '' ? item.music.author : 'empty' }</span><span class="song-album">Album: ${item.music.album !== '' ? item.music.album : 'empty' }</span></div></div><div class="action-play-gif"><i class="action-play-icon"></i></div></div></li>`;
          });
          document.querySelector('.music-list').innerHTML = musicItem;
          playSongInPlaylist();
        }else{
          alert(`A song is not currently available in user ${user.uniqueId}`);
        }
        getTitleSong();
        displayTimer();
      })
      .catch((err) => {
        console.error(err);
      });
  }
  
  $('#get-list-song').click(function () {
    getUser();
    document.querySelector('.play-song').classList.add("hidden-before");
  });
  
  function initUI() {
    const btnUI = `
    <div id="btn-open">
      <svg
        width="28"
        height="32"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:svg="http://www.w3.org/2000/svg"
      >
        <g
          class="layer"
          fill="white"
          data-darkreader-inline-fill=""
          style="--darkreader-inline-fill:#e8e6e3;"
        >
          <title>Layer 1</title>
          <path
            d="m28.062509,13.095139a13.1009,13.104497 0 0 1 -7.656848,-2.448593l0,11.149365a10.137824,10.140607 0 1 1 -8.745783,-10.048278l0,5.607747a4.653857,4.655135 0 1 0 3.25745,4.440532l0,-21.795911l5.488333,0a7.557684,7.559759 0 0 0 0.116003,1.383065l0,0a7.620051,7.622143 0 0 0 3.362228,5.004488a7.573276,7.575355 0 0 0 4.178617,1.256425l0,5.451161l0,-0.000001z"
            id="svg_1"
          ></path>
        </g>
      </svg>
    </div>;`;
    const root = `
    <div class="tiktok-music-overlay"></div>
    <div class="" id="div-config">
      <div>
        <button class="button" type="button" id="button-close">
          <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" data-svg="close-icon"><line fill="none" stroke="#fff" stroke-width="1.1" x1="1" y1="1" x2="13" y2="13"></line><line fill="none" stroke="#fff" stroke-width="1.1" x1="13" y1="1" x2="1" y2="13"></line></svg>
        </button>
        <div class="config-wrapper">
          <label class="text-white">X-RapidAPI-Host</label>
          <input type="text" id="api-host">
          <label class="text-white">X-RapidAPI-Key</label>
          <input type="text" id="api-key">
          <button type="button" class="button button-save-config" onclick="saveConfig()">SAVE</button>                      
        </div>
      </div>
    </div>
    <div id="tiktok-music-wrapper">
        <div id="btn-open"></div>
        <div class="wrapper-player">
        <div class="player-header justify-content-center">            
            <div class="thumbnail rounded-circle d-none">
                <svg width="28" height="32" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
                    <g class="layer" fill="white">
                        <title>Layer 1</title>
                        <path
                            d="m28.062509,13.095139a13.1009,13.104497 0 0 1 -7.656848,-2.448593l0,11.149365a10.137824,10.140607 0 1 1 -8.745783,-10.048278l0,5.607747a4.653857,4.655135 0 1 0 3.25745,4.440532l0,-21.795911l5.488333,0a7.557684,7.559759 0 0 0 0.116003,1.383065l0,0a7.620051,7.622143 0 0 0 3.362228,5.004488a7.573276,7.575355 0 0 0 4.178617,1.256425l0,5.451161l0,-0.000001z"
                            id="svg_1" />
                    </g>
                </svg>
            </div>
            <h4>Tiktok musicplayer</h4>

            <div class="nav-config d-none">
                <button id="button-config" class="navbar-toggler btn-header" type="button">
                    <span class="text-white">
                        <i class="fas fa-bars fa-1x"></i>
                    </span>
                </button>
            </div>
        </div>
        <div class="player-body pb-2">
            <div class="container">
                <div class="title-song text-capitalize" style="white-space:nowrap;text-overflow:ellipsis">
                  <span>Name: Empty</span>
                </div>
                <div class="play-song">
                    <div class="thumbnail rounded-circle">                    
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="32">
                            <style type="text/css">
                                g#g2 {
                                    fill: url(#grad2)
                                }
                            </style>
                            <defs>
                                <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="00%" style="stop-color:rgb(215, 42, 255);stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:rgb(0,242,255);stop-opacity:1" />
                                </linearGradient>
                            </defs>
                            <g id="g2">
                                <title>Layer 1</title>
                                <path
                            d="m28.062509,13.095139a13.1009,13.104497 0 0 1 -7.656848,-2.448593l0,11.149365a10.137824,10.140607 0 1 1 -8.745783,-10.048278l0,5.607747a4.653857,4.655135 0 1 0 3.25745,4.440532l0,-21.795911l5.488333,0a7.557684,7.559759 0 0 0 0.116003,1.383065l0,0a7.620051,7.622143 0 0 0 3.362228,5.004488a7.573276,7.575355 0 0 0 4.178617,1.256425l0,5.451161l0,-0.000001z"
                            id="svg_1" />
                            </g>
                        </svg>
                    </div>
                    <div class="controls-main">
                        <div class="player-controls">
                            <audio id="audio" preload="none"></audio>
                            <div class="controls-advenced" id="random-song" data-control-random="disable">
                                <span><i class="fas fa-random"></i></span>
                            </div>
                            <div class="controls-default" id="previous-song">
                                <span><i class="fas fa-backward"></i></span>
                            </div>
                            <div class="controls-default" id="fast-backward-song">
                                <span><i class="fas fa-fast-backward"></i></span>
                            </div>
                            <div class="controls-default" id="play-song">
                                <span><i class="fas fa-play"></i></span>
                            </div>
                            <div class="controls-default" id="fast-forward-song">
                                <span><i class="fas fa-fast-forward"></i></span>
                            </div>
                            <div class="controls-default" id="next-song">
                                <span><i class="fas fa-forward"></i></span>
                            </div>
                            <div class="controls-advenced" id="repeat-song" data-control-repeat="disable">
                                <span><i class="fas fa-repeat"></i></span>
                            </div>
                        </div>
                        
                    </div>
                  <div class="player-timeline">
                    <!--<div class="timeline-bar"></div> -->
                    <input class="timeline-bar" type="range"/>
                    <span class="start-time">00:00</span><span class="end-time">00:00</span>
                  </div>
                </div>
                <div class="playlist">
                    <a class="text-white cursor-pointer d-block border-top border-bottom border-white" id="get-list-song" href="#">Get List Song</a>
                    <ul class="music-list m-0 p-0">
                                           
                    </ul>
                </div>
            </div>
        </div>
        </div>
    </div>
    `;
    //$(btnUI).appendTo(body);
    $(root).appendTo(body);
    console.log("inject");
  } 
  
   /* ---  Function open/close menu config  --- */
  const btnOpenConfig = document.getElementById('button-config');
  const btnCloseConfig = document.getElementById('button-close');
  const overlay = document.querySelector('.tiktok-music-overlay');
  const divConfig = document.querySelector('#div-config')
  btnCloseConfig.addEventListener('click', toggleMenuConfig);
  btnOpenConfig.addEventListener('click', toggleMenuConfig);
  overlay.addEventListener('click', toggleMenuConfig);
  
  function toggleMenuConfig() {
    divConfig.classList.toggle('show');
    overlay.classList.toggle('visibility');
  };

  function loadConfig() {
      document.querySelector('#api-host').value = apiConfig.host;
      document.querySelector('#api-key').value = apiConfig.key;
  }
  
  function saveConfig() {
      const apiHost = document.getElementById('api-host');
      const apiKey = document.getElementById('api-key');
      if (apiHost.value === '' || apiKey.value === '') {
        alert('Value not empty');
        apiHost.value === '' ? apiHost.focus() : apiKey.focus();
      }
      const apiInfor = {
        host: apiHost.value,
        key: apiKey.value
      }
      localStorage.setItem('apiConfig', JSON.stringify(apiInfor));
      alert('Đã lưu! Nhấn OK để tải lại trang!');
      location.reload();
  }  
  /* ---  [END] Function open/close menu config  --- */
})();

function importScriptContents(inject) {
  var script = window.document.createElement("script");
  script.type = "text/javascript";
  script.innerHTML = inject;
  document.getElementsByTagName("HEAD")[0].appendChild(script);
}

function loadCSS(url) {
  var link = window.document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = url;
  document.getElementsByTagName("HEAD")[0].appendChild(link);
}

function importStyleCss(url) {
  var style = window.document.createElement("style");
  style.type = "text/css";
  $.get(
    url,
    function (data) {
      style.innerHTML = data;
    },
    "text"
  );
  document.getElementsByTagName("HEAD")[0].appendChild(style);
}

function importLink(type, url, integrity) {
  const link =
    type === "css"
      ? window.document.createElement("link")
      : window.document.createElement("script");
  link.integrity = integrity;
  link.crossOrigin = "anonymous";
  if (type === "css") {
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    document.getElementsByTagName("HEAD")[0].appendChild(link);
  } else if (type === "js") {
    link.type = "text/javascript";
    link.src = url;
    document.body.appendChild(link);
  }
}


