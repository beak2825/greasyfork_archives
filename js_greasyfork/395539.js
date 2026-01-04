// ==UserScript==
// @name         Osu beatmap search
// @namespace    Osu
// @version      0.2
// @description  Osu beatmap search by specific date
// @author       Monorail
// @match        https://osu.ppy.sh/beatmapsets*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395539/Osu%20beatmap%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/395539/Osu%20beatmap%20search.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let parser = new DOMParser();
  function componentInitialize(){
    let a = new Date();
    let TimeNow = {
      year: a.getFullYear(),
      month: a.getMonth(),
      day: a.getDate(),
      hour: a.getHours()
    };
    // 設置開啟按鍵(左下方)、搜尋頁面、輸入框樣式，以及外層DOM結構
    let ty = `
    <style type="text/css">
      .search-button {
        position: fixed;
        left: 150px;
        bottom: 20px;
        width: 75px;
        height: 75px;
        background: hsl(324, 68%, 45%);
        color: #fff;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        z-index: 506;
      }
      .search-button-a {
        user-select: none;
        margin: 10px 10px;
        font-size: 2em;
      }
      .hidden {
        display: none;
      }
      .search-container {
        width: 100%;
        height: 75vh;
        position: fixed;
        top: 18vh;
        z-index: 505;
        color: #000;
      }
      .search-main {
        margin: auto;
        width: 70%;
        height: 100%;
        background: hsl(0, 0%, 87%);
        box-shadow: 0px 0px 2px 1px #112233;
      }

      .inputArea {
        display: flex;
        align-items: center;
      }
      .inputArea input {
        max-width: 4em;
      }
      .goFind {
        background: hsl(210, 65%, 48%);
        color: #fff;
        border: none;
        border-radius: 1em;
        cursor: pointer;
        padding: 0.4em 0.8em;
        margin: 0.2em 0.2em;
      }

      .result-area {
        width: 96%;
        margin: auto;
        max-height: 67vh;
        overflow: auto;
      }
    </style>
    <div class="search-container hidden">
      <div class="search-main">
        <div class="inputArea">
          <div class="input-start">
            <input type="text" value=${TimeNow.year} class="input-start-year">
            <input type="text" value=${TimeNow.month + 1} class="input-start-month">
            <input type="text" value=${TimeNow.day} class="input-start-day">
          </div>
          <button class="goFind">gogogogogo</button>
        </div>
        <div class="result-area">
        </div>
      </div>
    </div>
    <div class="search-button">
      <div class="search-button-a">S</div>
    </div>
    `;
    // insert DOM
    let DOM = parser.parseFromString(ty, "text/html");
    let origBody = document.querySelectorAll("body")[0];
    origBody.appendChild(DOM.querySelectorAll("style")[0]);
    DOM.querySelectorAll("body > div").forEach((divPart) => {
      origBody.appendChild(divPart);
    });
    // set eventListenser of inserted button
    let btn = document.querySelectorAll(".search-button")[0];
    let searchBox = document.querySelectorAll(".search-container")[0];
    btn.addEventListener("click", (e) => {
      searchBox.classList.toggle("hidden");
    });
    return searchBox;
  }
  let searchBox = componentInitialize();

  // search action & results layout
  let goFind = document.querySelectorAll(".goFind")[0];
  function getUnixTime(date){
    return new Date(date.year, date.month, date.day, 23).getTime();
  }
  function fetchBeatmapData(unixTime){
    return fetch(`https://osu.ppy.sh/beatmapsets/search?cursor%5Bapproved_date%5D=${unixTime}&cursor%5B_id%5D=`)
    .then(res => res.json());
  }

  let resultArea = searchBox.querySelectorAll(".result-area")[0];
  let cursor;
  function resultInitialize(){
    resultArea.innerHTML = `
    <style type="text/css">
      .bm {
        display: flex;
        margin-bottom: 5px;
      }
      .bm-img > img:hover {
        box-shadow: 0 0 3px 1px #112233;
        cursor: pointer;
      }
      .bm-img-playing {
        box-shadow: 0 0 3px 2px #112233;
      }
      .bm-info {
        margin: 0 0 0.5em 1em;
        flex-grow: 1;
      }
      .bm a {
        text-decoration: none;
      }
      .bm-info-1, .bm-info-2 {
        margin-bottom: 0.5em;
      }
      a.bm-title {
        color: #3489d1;
      }
      .bm-info-2, .bm-info-3, .bm-info-4 {
        font-size: 0.8em;
      }
      .bm-info-float-right {
        float: right;
      }

      .bm-diff {
        margin-right: 4px;
        color: #fff;
        padding: 0 2px;
        border-radius: 4px;
      }
      .bm-mode-osu::before {
        content: "●";
      }
      .bm-mode-taiko::before {
        content: "◎";
      }
      .bm-mode-mania::before {
        content: "M";
      }
      .bm-mode-fruits::before {
        content: "F";
      }
      .bm-diff-easy {
        background: #8dad2c;
      }
      .bm-diff-normal {
        background: #43a0cf;
      }
      .bm-diff-hard {
        background: #d8af22;
      }
      .bm-diff-insane {
        background: #d52f6c;
      }
      .bm-diff-extra {
        background: #7e61d4;
      }
      .bm-diff-black {
        background: #2e2e2f;
      }
    </style>`;
    let inputTime = {
      year: searchBox.querySelectorAll(".input-start-year")[0].value,
      month: searchBox.querySelectorAll(".input-start-month")[0].value - 1,
      day: searchBox.querySelectorAll(".input-start-day")[0].value
    };
    cursor = getUnixTime(inputTime);
    console.log(inputTime, cursor);
  }

  function arrange(bms){
    let bmResult = [];

    bms.forEach((bm) => {
      let rankedDate = "";
      if(bm.ranked_date != undefined){
        let d = new Date(bm.ranked_date);
        rankedDate = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}_${d.getHours()}時`;
      }

      function withVideo(){
        if(bm.video === true) return "video included ";
        return "";
      }
      function withSB(){
        if(bm.storyboard === true) return "SB included";
        return "";
      }
      function generateDifficulty(diffs){
        function inRange(a, b, c){
          return a >= b && a <= c;
        }
        function diffColor(rate){
          if(inRange(rate, -Infinity, 1.5)){ return "easy"; }
          // actually 2.25 by some observation
          else if(inRange(rate, 1.5, 2.4)){ return "normal"; }
          else if(inRange(rate, 2.4, 3.75)){ return "hard"; }
          // 6.7 ~ 6.85
          else if(inRange(rate, 3.75, 5.25)){ return "insane"; }
          else if(inRange(rate, 5.25, 6.75)){ return "extra"; }
          else { return "black"; }
        }
        let str = "";

        // 1. sort by difficulty rating
        diffs.sort((diff1, diff2) => {
          return diff1.difficulty_rating - diff2.difficulty_rating;
        });
        // 2. sort by mode(osu, taiko, mania, fruits)
        let diffs_class = [[], [], [], []];
        diffs.forEach((diff) => {
          diffs_class[diff.mode_int].push(diff);
        })
        // 3. build string
        diffs_class.forEach((diff_class) => {
          diff_class.forEach((diff) => {
            str = str + `<span class="bm-mode-${diff.mode} bm-diff bm-diff-${diffColor(diff.difficulty_rating)}">${Math.round(diff.difficulty_rating * 10) / 10}</span>`;
          });
        });
        return str;
      }

      let bmt_v2 = `
        <div class="bm">
          <div class="bm-img" data-audio-url=${bm.preview_url} onclick="preview(event)">
            <img src=${bm.covers.card}>
          </div>
          <div class="bm-info">
            <div class="bm-info-3">
              ${bm.source}
            </div>
            <div class="bm-info-1">
              <a class="bm-title" href="/beatmapsets/${bm.id}" target="_blank">${bm.title}</a>
              <span class="bm-artist"> <- ${bm.artist}</span>
            </div>
            <div class="bm-info-2">
              ${generateDifficulty(bm.beatmaps)}
            </div>
            <div class="bm-info-4">
              <span class="bm-status">${bm.status}</span>
              <span class="bm-status">${rankedDate}　　</span>
              mapped by <a class="bm-creator" href="/users/${bm.user_id}" target="_blank">${bm.creator}　　</a>
              <a class="bm-download" data-turbolinks="false" href="/beatmapsets/${bm.id}/download">[dl]</a>
              <span>${withVideo()}${withSB()}</span><span class="bm-info-float-right">▶ ${bm.play_count}</span>
            </div>
          </div>
        </div>
      `;
      resultArea.appendChild( parser.parseFromString(bmt_v2, "text/html").querySelector(".bm") );
//       let audio = document.querySelector("audio");
//       audio.addEventListener("play", (e) => {
//         console.log(e.target.src);
//       });
//       audio.addEventListener("pause", (e) => {
//         console.log(e.target.src);
//       });
    });
  }

  let customScript = `
  let audio = new Audio();
  let preview = function (e){
    // console.log(e.target.parentNode.dataset["audioUrl"]);

    // fetch() cannot be applied to this
    // https://blog.fullstacktraining.com/what-is-an-opaque-response/
    // https://whatwebcando.today/articles/opaque-responses-service-worker/

    // console.dir(audio);

    if(audio.currentSrc.indexOf(e.target.parentNode.dataset["audioUrl"]) !== -1){
      if(audio.paused){
        audio.play();
      } else {
        audio.pause();
      }
      return;
    }

    audio.src = e.target.parentNode.dataset["audioUrl"];
    audio.play();
  }`;
  let s = document.createElement("script");
  s.innerHTML = customScript;
  document.body.append(s);


  let limit = 300;
  let bmLoaded = 0;
  function appendLoadMoreButton(){
    let loadSection = `
    <div class="load-section">
      <style>
        .load-section {
          display: flex;
        }
        .load-btn {
          background: hsl(210, 65%, 48%);
          color: #fff;
          border-radius: 1em;
          cursor: pointer;
          padding: 0.4em 0.8em;
          margin: 0.2em 0.2em;
        }
      </style>
      <div class="load-btn">load</div>
    </div>
    `;
    let loadSectionDOM = parser.parseFromString(loadSection, "text/html").querySelector(".load-section");
    let loadBtnDOM = loadSectionDOM.querySelector(".load-btn");
    loadBtnDOM.addEventListener("click", SLBM);
    resultArea.appendChild(loadSectionDOM);
  }

  function SLBM(e){
    if(e.target.classList.contains("goFind")){
      resultInitialize();
    }
    if(e.target.classList.contains("load-btn")){
      resultArea.querySelector(".load-section").remove();
    }
    fetchBeatmapData(cursor)
    .then(data => {
      console.log(data.beatmapsets);
      console.log(data.cursor);
      arrange(data.beatmapsets);
      appendLoadMoreButton();
      cursor = data.cursor.approved_date;
    });
  }

  goFind.addEventListener("click", SLBM);



})();