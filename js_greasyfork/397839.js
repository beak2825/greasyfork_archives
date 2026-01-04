// ==UserScript==
// @name         Nicotest
// @namespace    http://aoytsk.blog.jp/
// @version      1.0.0
// @description  ローカルファイルをニコニコ動画でテスト再生
// @author       aoy
// @match        https://www.nicovideo.jp/watch/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/397839/Nicotest.user.js
// @updateURL https://update.greasyfork.org/scripts/397839/Nicotest.meta.js
// ==/UserScript==

(function () {
  'use strict';
  function main() {
    let style = {
      overlay: `
      display:none; position:fixed; z-index: 99;
      top: 0; left: 0; width:100%; height:100%;
      align-items: center; justify-content: center;
      background-color:rgba(0,0,0,0.7);
      `,
      text: `
      pointer-events: none; color: white; font-size:250%; font-weight: 900;
      `,
    }
    let text = {
      drop:     'ここに動画をドロップすると動画を置き換えます',
      noplayer: 'プレイヤーが取得できませんでした',
      novideo:  '動画を指定してください',
    }
    document.body.insertAdjacentHTML('beforeend', `
      <div id="nicotest-overlay" style="${style.overlay}">
      <div id="nicotest-message" style="${style.text}">
      ${text.drop}</div></div>
      `)
    let overlay = document.getElementById('nicotest-overlay')
    let message = document.getElementById('nicotest-message')

    function prevent(event) {
      event.preventDefault()
      event.stopPropagation()
    }
    document.addEventListener('dragenter', function (event) {
      prevent(event)
      overlay.style.display = 'flex'
    })
    overlay.addEventListener('dragleave', function (event) {
      prevent(event)
      overlay.style.display = 'none'
    })
    overlay.addEventListener('dragover', function (event) {
      prevent(event)
    })
    overlay.addEventListener('drop', function (event) {
      prevent(event)
      let file = event.dataTransfer.files[0]
      if(/video/.test(file.type)) {
        let url = window.URL.createObjectURL(file)
        try{
          document.querySelector('button.PlayerPauseButton').click()
          __videoplayer.src(url)
          document.querySelector('button.PlayerPlayButton').click()
        } catch(e) {
        }
      } else {
      }
      overlay.style.display = 'none'
    })
  }

  let script = document.createElement("script");
  script.textContent = "(" + main.toString() + ")();";
  document.body.appendChild(script);
})();
