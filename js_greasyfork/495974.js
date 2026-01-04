// ==UserScript==
// @name:zh-tw   魔鏡字幕播放器
// @name         Mojim Lyrics Player
// @namespace    com.sherryyue.mojimlyrics
// @version      1.8
// @description:zh-tw 此腳本將魔鏡歌詞網的歌詞頁面轉變為歌詞播放器，當打開某首歌的歌詞頁面時，自動生成類似提詞機的介面，讓用戶能夠同步讀唱歌詞。
// @description  This script transforms Mojim lyrics pages into a lyrics player, automatically generating a teleprompter-like interface when a song's lyrics page is opened. This allows users to read and sing along with the lyrics in sync with the recorded timestamps.
// @author          SherryYue
// @copyright       SherryYue
// @match        *://mojim.com/*
// @license         MIT
// @supportURL   sherryyue.c@protonmail.com
// @icon         https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @require      https://code.jquery.com/jquery-3.6.0.js
// @require      https://code.jquery.com/ui/1.13.1/jquery-ui.js
// @supportURL   "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage     "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495974/Mojim%20Lyrics%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/495974/Mojim%20Lyrics%20Player.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const emptyLyricsStart = 20; // 起始歌詞索引
  var curLyricIndex = 21; // 記錄當前播放的歌詞索引

  // Helper function to parse time in format "mm:ss.SS" to milliseconds
  function parseTime(timeString) {
    const parts = timeString.split(':');
    const minutes = parseInt(parts[0], 10);
    const seconds = parseFloat(parts[1]);
    return (minutes * 60 + seconds) * 1000;
  }

  // 設定時間提前量
  const timeOffset = 1000; // 1秒

  // 創建懸浮窗口
  const lyricsPanel = document.createElement('div');
  lyricsPanel.style.position = 'fixed';
  lyricsPanel.style.left = '1rem';
  lyricsPanel.style.top = '1rem';
  lyricsPanel.style.width = 'calc(100% - 4rem)';
  lyricsPanel.style.height = 'calc(100% - 4rem)';
  lyricsPanel.style.overflow = 'auto';
  lyricsPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  lyricsPanel.style.color = 'white';
  lyricsPanel.style.padding = '10px';
  lyricsPanel.style.borderRadius = '10px';
  lyricsPanel.style.zIndex = '1000';
  document.body.appendChild(lyricsPanel);

  // 創建懸浮按鈕
  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'KTV';
  toggleButton.style.position = 'fixed';
  toggleButton.style.bottom = '5%';
  toggleButton.style.right = '5%';
  toggleButton.style.padding = '10px';
  toggleButton.style.borderRadius = '5px';
  toggleButton.style.backgroundColor = 'gray';
  toggleButton.style.color = 'white';
  toggleButton.style.display = 'none'; // 預設隱藏
  toggleButton.style.zIndex = '1000';
  document.body.appendChild(toggleButton);

  // 添加最小化按鈕
  const minimizeButton = document.createElement('button');
  minimizeButton.textContent = '_';
  minimizeButton.style.position = 'fixed';
  minimizeButton.style.top = '5%';
  minimizeButton.style.right = '5%';
  minimizeButton.style.color = '#fff';
  minimizeButton.style.zIndex = '1100';
  minimizeButton.style.backgroundColor = 'transparent';
  minimizeButton.style.borderRadius = '5px';
  minimizeButton.style.width = '2em';
  minimizeButton.style.height = '2em';
  minimizeButton.onclick = function () {
    lyricsPanel.style.display = 'none';
    toggleButton.style.display = 'block';
    minimizeButton.style.display = 'none';
  };
  document.body.appendChild(minimizeButton);

  // 顯示時間的浮動元素
  const timeDisplay = document.createElement('div');
  timeDisplay.style.position = 'fixed';
  timeDisplay.style.top = '5%';
  timeDisplay.style.left = '5%';
  timeDisplay.style.color = '#FFF';
  timeDisplay.style.zIndex = '1100';
  document.body.appendChild(timeDisplay);

  // 取得歌詞並初始化
  const lyrics = getLyrics(); // 假設此函數已定義
  let currentTime = 0; // 起始時間
  let intervalId = null; // 記錄interval的ID

  // 定時更新時間和歌詞
  intervalId = setInterval(() => {
    highlightLyrics(currentTime);
    timeDisplay.textContent = `${Math.floor(currentTime / 60000).toString().padStart(2, '0')}:${Math.floor((currentTime % 60000) / 1000).toString().padStart(2, '0')}`;
    currentTime += 100; // 每100毫秒更新一次時間
  }, 100);

  function initLyrics() {
    lyricsPanel.innerHTML = '';

    if (lyrics?.length >= 1) {
      lyricsPanel.style.display = 'none';
      toggleButton.style.display = 'block';
      minimizeButton.style.display = 'none';
      return;
    }

    lyrics.forEach((line) => {
      const lyricElement = document.createElement('div');
      lyricElement.textContent = line.lyric;
      lyricElement.style.textAlign = 'center';
      lyricElement.style.cursor = 'pointer';
      lyricElement.style.marginBottom = '20px'; // 增加間距
      lyricElement.style.fontSize = '1rem'; // 固定字體大小
      lyricElement.style.minHeight = '20px'; // 最小高度
      lyricElement.style.color = 'white'; // 字體顏色

      // 設置歌詞點擊事件
      lyricElement.onclick = () => {
        currentTime = parseTime(line.time); // 設定當前時間為點擊歌詞的時間
        timeDisplay.textContent = `${Math.floor(currentTime / 60000).toString().padStart(2, '0')}:${Math.floor((currentTime % 60000) / 1000).toString().padStart(2, '0')}`;
        highlightLyrics(lyricTime); // 重新顯示歌詞
        // 將點擊的歌詞滾動到正中央
        const offsetTop = lyricElement.offsetTop;
        const panelHeight = lyricsPanel.clientHeight;
        lyricsPanel.scrollTop = offsetTop - panelHeight / 2 + lyricElement.clientHeight / 2;
      };

      lyricsPanel.appendChild(lyricElement);
    });
  }

  // 顯示歌詞
  function highlightLyrics(selectTime) {
    curLyricIndex = lyrics.findLastIndex((line) => selectTime >= parseTime(line.time) - timeOffset);
    lyrics.forEach((line, index) => {
      // 設置當前播放歌詞放大顯示
      const lyricElement = lyricsPanel.children[index];
      if (curLyricIndex === index) {
        lyricElement.style.fontSize = '1.5rem';
        lyricElement.style.fontWeight = 'bold';
      } else {
        lyricElement.style.fontSize = '1rem';
        lyricElement.style.fontWeight = 'normal';
      }
    });

    // 自動滾動到當前播放的歌詞位置
    if (curLyricIndex !== -1) {
      const currentLyricElement = lyricsPanel.children[curLyricIndex];
      const offsetTop = currentLyricElement.offsetTop;
      const panelHeight = lyricsPanel.clientHeight;
      lyricsPanel.scrollTop = offsetTop - panelHeight / 2 + currentLyricElement.clientHeight / 2;
    }
  }

  // 監聽滾動事件
  // lyricsPanel.onscroll = () => {
  //   const centerElement = document.elementFromPoint(
  //     lyricsPanel.getBoundingClientRect().left + lyricsPanel.clientWidth / 2,
  //     lyricsPanel.getBoundingClientRect().top + lyricsPanel.clientHeight / 2
  //   );

  //   if (centerElement && centerElement.parentElement === lyricsPanel) {
  //     const centerLyric = lyrics.find(lyric => lyric.lyric === centerElement.textContent);
  //     if (centerLyric) {
  //       currentTime = parseTime(centerLyric.time);
  //       highlightLyrics(currentTime);
  //       timeDisplay.textContent = `Current Time: ${(currentTime / 1000).toFixed(2)} seconds`;
  //     }
  //   }
  // };

  // 恢復窗口的事件綁定
  toggleButton.onclick = () => {
    lyricsPanel.style.display = 'block';
    toggleButton.style.display = 'none';
    minimizeButton.style.display = 'block';
  };

  // 取得歌詞內容的函數
  function getLyrics() {
    const lyricsSrc = document.querySelectorAll('table tr')[1]
      .querySelector('td').innerText
      .split('\n').filter(_ => _.match(/\[[\d\:\.]+\]/));
    let lyrics = [];
    for (let sentences of lyricsSrc) {
      const times = [...sentences.matchAll(/\[(\d+\:\d+\.\d+)\]/g)].map(_ => _[1]);
      const lyric = sentences.replaceAll(/\[\d+\:\d+\.\d+\]/g, '').trim();
      for (let time of times) {
        lyrics.push({ time, lyric });
      }
    }
    lyrics.sort((a, b) => parseTime(a.time) - parseTime(b.time));
    console.warn(lyrics)
    return [...Array(emptyLyricsStart - 1).fill({ time: '0:0', lyric: '' }), ...lyrics];
  }

  // 初始顯示歌詞，從0秒開始
  initLyrics();
  highlightLyrics(0);
})();
