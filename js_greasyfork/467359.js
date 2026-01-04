// ==UserScript==
// @name         Youtube volume fix
// @namespace    https://github.com/notoiro
// @version      1.2
// @description  スクロールでの音量調整値を1にする、ついでに音量バーを常時表示する。
// @author       notoiro
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require      https://update.greasyfork.org/scripts/446257/1059316/waitForKeyElements%20utility%20function.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-idle
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/467359/Youtube%20volume%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/467359/Youtube%20volume%20fix.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // css
  const custom_style = `
    .ytp-volume-area{
      position: relative;
    }
    .ytp-volume-panel{
      width: 52px;
      margin-right: 3px;
    }
    .ytp-big-mode .ytp-volume-panel{
      width: 78px;
      margin-right: 5px;
    }

    #volume-overlay{
      width: 54px;
      position: absolute;
      height: 100%;
      z-index: 10000;
      left: 47px;
      margin-right: 3px;
    }
    #volume-slider{
      background: transparent;
      -webkit-appearance: none;
      appearance: none;
      cursor: pointer;
      width: 100%;
      height: 100%;
      border: 0;
      margin: 0;
      padding: 0;
      outline: 0;
    }
    input[type="range" i]#volume-slider::-webkit-slider-thumb{
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: 0;
      width: 3px;
      height: 3px;
    }
    .ytp-big-mode #volume-overlay{
      width: 80px;
      left: 54px;
    }
  `;

  const area_selector = ".ytp-volume-area";

  const add_step = 1;

  let player = null;

  function main(){
    console.log("[Youtube volume fix] Started");

    player = document.querySelector("#movie_player");

    GM_addStyle(custom_style);

    const area = document.querySelector(area_selector);

    // オーバーレイを用意する。
    // 見た目と動きを公式プレイヤーにやらせて、その上に透明の要素を用意してそっちで入力のハンドリングをする。
    // クリックはinput(range)、スクロールはdivでハンドリングしている。キーボード入力は公式のハンドリングに任せる。
    // スライダーが実数値と合ってなくてもフォーカス不可能にしておけばクリックされた位置=実数値でユーザーに違和感ないので問題なし。
    const volume_overlay = document.createElement("div");
    area.append(volume_overlay);
    volume_overlay.id = "volume-overlay";

    const volume_slider = document.createElement("input");
    volume_overlay.append(volume_slider);

    volume_slider.id = "volume-slider";
    volume_slider.type = "range";
    volume_slider.min = 0;
    volume_slider.max = 100;
    volume_slider.tabIndex = -1;

    const volume_ctrl_event = (ev) => {
      if(ev.buttons || ev.shiftKey) return;

      const delta = -parseInt(ev.deltaY, 10);

      if(delta !== 0){
        let current_vol = player.getVolume();
        if(player.isMuted()) current_vol = 0;
        if(delta > 0){
          // up
          override_volume(current_vol + add_step);
        }else{
          // down
          override_volume(current_vol - add_step);
        }
        if(player.isMuted()) player.unMute();
      }
    }

    volume_overlay.addEventListener("wheel", (ev) => {
      ev.preventDefault();
      // Zenza Watchの実装を見た感じthrottleかけるとトラックパッドでもマウスでもちょうどいい感じになるらしい
      _.throttle(volume_ctrl_event.bind(this, ev), 50)();
    });

    volume_slider.addEventListener("input", (ev) => {
      override_volume(volume_slider.value);
      if(player.isMuted()) player.unMute();
    });
  }

  function override_volume(raw_vol){
    let vol = raw_vol;

    if(vol > 100) vol = 100;
    if(vol < 0) vol = 0;

    player.setVolume(vol);
    const cre = Date.now();
    const exp = cre + 2592E6;

    // 保存してないとリロードするたび飛ぶので保存する。
    unsafeWindow.localStorage["yt-player-volume"] = unsafeWindow.sessionStorage["yt-player-volume"] = JSON.stringify({
      data: JSON.stringify({
        volume: vol,
        muted: false
      }),
      creation: cre,
      expiration: exp
    });
  }

  // プレイヤーが読み込まれるまで待機。
  waitForKeyElements(area_selector, main);
})();
