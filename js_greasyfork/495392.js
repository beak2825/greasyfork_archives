// ==UserScript==
// @name         替換 marumaru 影片與歌詞延遲
// @name:en      substitute marumaru video, and offsets for lyrics
// @name:zh-TW   替換 marumaru 影片與歌詞延遲

// @description          替換 marumaru 播放的影片成你指定的 youtube 影片，方便用純音樂版練歌，也可以調整歌詞延遲
// @description:en       substitute marumaru video to your desire youtube video, also adjust offset for lyrics
// @description:zh-TW    替換 marumaru 播放的影片成你指定的 youtube 影片，方便用純音樂版練歌，也可以調整歌詞延遲

// @license MIT
// @namespace    https://greasyfork.org/users/1303696
// @version      1.1
// @author       xswzaq44321
// @match        https://www.jpmarumaru.com/tw/JPSongPlay*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpmarumaru.com
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/495392/%E6%9B%BF%E6%8F%9B%20marumaru%20%E5%BD%B1%E7%89%87%E8%88%87%E6%AD%8C%E8%A9%9E%E5%BB%B6%E9%81%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/495392/%E6%9B%BF%E6%8F%9B%20marumaru%20%E5%BD%B1%E7%89%87%E8%88%87%E6%AD%8C%E8%A9%9E%E5%BB%B6%E9%81%B2.meta.js
// ==/UserScript==

function fromHTML(html, trim = true) {
    // Process the HTML string.
    html = trim ? html.trim() : html;
    if (!html) return null;

    // Then set up a new template element.
    const template = document.createElement('template');
    template.innerHTML = html;
    const result = template.content.children;

    // Then return either an HTMLElement or HTMLCollection,
    // based on whether the input HTML had one or more roots.
    if (result.length === 1) return result[0];
    return result;
  }

  (async function() {
      'use strict';
      if(!document.querySelector("#VideoID").textContent){ // probabliy no youtube player available, abort execution
          return;
      }
      const songPK = document.querySelector("#SongPK").textContent
      let state = await GM.getValue(songPK, {"instrumental": false, "VideoID": "", "offset": 0});
      let messages = {
          "btn": Intl.DateTimeFormat().resolvedOptions().locale == 'zh-TW' ? "切換影片" : "switch video",
          "regFail": Intl.DateTimeFormat().resolvedOptions().locale == 'zh-TW' ? "無法解析替代影片 ID" : "cannot resole video ID",
          "vidIDEmpty": Intl.DateTimeFormat().resolvedOptions().locale == 'zh-TW' ? "沒有可替換的影片 ID" : "no available video ID to substitute",
          "resetOffset": Intl.DateTimeFormat().resolvedOptions().locale == 'zh-TW' ? "重設歌詞延遲 (sec)" : "reset offset for lyrics (sec)",
      }
      var switchBtn = fromHTML(`<a href="javascript:;" class="easyui-linkbutton l-btn l-btn-small" style="margin-bottom:4px;" group="" id=""><span class="l-btn-left"><span class="l-btn-text">${state.instrumental ? "🎼" : "🎤"}${messages.btn}</span></span></a>`);
      var VideoIDInput = fromHTML(`<input style="margin:0 3px 0 3px; width: 10em" type="text" placeholder="${state.VideoID}">`);
      var resetOffsetBtn = fromHTML(`<a href="javascript:;" class="easyui-linkbutton l-btn l-btn-small" style="margin-bottom:4px;" group="" id=""><span class="l-btn-left"><span class="l-btn-text">${messages.resetOffset}</span></span></a>`);
      var offsetInput = fromHTML(`<input type="number" id="LSToffset" name="LSToffset" value="0" step="0.1" style="width: 5em; margin-left:3px">`);
      var elementWrapper = fromHTML(`<div style="padding:0 0 5px 5px"></div>`);
      elementWrapper.appendChild(switchBtn);
      elementWrapper.appendChild(VideoIDInput);
      if(state.instrumental){
          elementWrapper.appendChild(resetOffsetBtn);
          elementWrapper.appendChild(offsetInput);
      }
      const reg = new RegExp(/(?:https?:\/\/(?:www\.)?youtube\.com\/watch\?v=|https?:\/\/youtu\.be\/|^)([A-Za-z0-9_-]{11})(?:&.*)?$/)
      switchBtn.onclick = function(){
          let VideoID = state.VideoID;
          if(VideoIDInput.value){
              let regRes = reg.exec(VideoIDInput.value);
              if(!regRes){
                  alert(`${messages.regFail}`);
                  return;
              }
              VideoID = regRes[1];
          }
          if(!VideoID){
              alert(`${messages.vidIDEmpty}`);
              return;
          }
          state.instrumental = !state.instrumental;
          state.VideoID = VideoID;
          GM.setValue(songPK, state);
          location.reload();
      };
      resetOffsetBtn.onclick = function(){
          unsafeWindow.LST = offsetInput.value = 0;
          unsafeWindow.currentLyries = -1;
          if(state.instrumental){
              state.offset = 0;
              GM.setValue(songPK, state);
          }
      }
      offsetInput.oninput = function(){
          unsafeWindow.LST = parseFloat(this.value);
          unsafeWindow.currentLyries = -1;
      }
      offsetInput.onchange = function(){
          if(state.instrumental){
              state.offset = parseFloat(this.value);
              GM.setValue(songPK, state);
          }
      }
      document.querySelector("#left_col > div:nth-child(2) > div.main > div.main-content.cf > div.clear").nextElementSibling.after(elementWrapper);
      if(state.instrumental && state.VideoID){
          document.querySelector("#VideoID").textContent = state.VideoID
          offsetInput.value = state.offset;
          offsetInput.oninput();
      }
  })();