// ==UserScript==
// @name         R1控制器
// @namespace    http://tampermonkey.net/
// @version      2021-08-09
// @description  点歌兼容小飞的控制页面，歌曲信息解析优化。
// @author       You
// @include      /https?:\/\/192\.168\.31\.76:8080\//
// @grant        none
/* globals     jsonp,Vue    waitForKeyElements */
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/431797/R1%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/431797/R1%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // 打开的网页ip
  let hostname = '192.168.31.76';
  // 打开的webSocket通讯端口
  let port = 8080
  // 默认标题
  let defaultTitle = 'R1音箱控制'
  // axios请求的baseurl
  let baseURL = 'https://r1-server.tengpang.com/'

  function apis (a, b, c, d) {
    return {
      //获取音箱状态
      info: { type: 'get_info' },
      //打开响度开关
      loudnessEnable: { type: 'set_loudness_enable', enable: a },
      //打开低音开关
      bassEnable: { type: 'set_bass_enable', enable: a },
      //打开EQ开关
      eqEnable: { type: 'set_eq_enable', enable: a },
      //获取音效数据
      eqConfig: { type: 'get_eq_config' },
      //设置音量
      vol: { type: 'set_vol', vol: a },
      //设置响度
      loudnessGain: { type: 'set_loudness_gain', gain: a },
      //设置低音
      bassStrength: { type: 'set_bass_strength', strength: a },
      //设置音效
      eqBandlevel: { type: 'set_eq_bandlevel', band: a, level: b },
      //选择音效模式
      eqPreset: { type: 'set_eq_preset', preset: a },
      //蓝牙控制; 打开： ('打开蓝牙', 1) ; 关闭：('关闭蓝牙', 2)
      bluetooth: { type: 'send_message', type_id: a, what: 64, arg1: b, arg2: -1 },
      //氛围灯; 打开：('打开氛围灯', 1);关闭：('关闭氛围灯', 0);
      musicLight: { type: 'send_message', type_id: a, what: 4, arg1: 64, arg2: b },
      //设置氛围灯亮度
      musciLightLuma: { type: 'send_message', type_id: '设置氛围灯亮度', what: 4, arg1: 65, arg2: a },
      //设置颜色渐变速度
      musicLightChroma: { type: 'send_message', type_id: '设置颜色渐变速度', what: 4, arg1: 66, arg2: a },
      //氛围效果
      musicLightMode: { type: 'send_message', type_id: a, what: 4, arg1: 68, arg2: b },
      //截图 开始： 'start_screencap' ；停止: 'stop_screencap'
      screen: { type: a },
      //发送按键事件/屏幕滑动/屏幕点击
      keyEvent: { type: 'input', input: a },
      //执行shell命令
      shell: { type_id: a, type: 'shell', shell: b },
      //打开网络连接
      netConfig: { type: 'send_message', what: 262144, arg1: 1 },
      //播放
      play: { type: 'send_message', what: 4, arg1: 3, arg2: -1, obj: true },
      //暂停
      pause: { type: 'send_message', what: 4, arg1: 2, arg2: -1, obj: true },
      //上一首
      prev: { type: 'prev' },
      //下一首
      next: { type: 'next' },
      //设置播放模式
      setPlayMode: { type: 'set_play_mode', mode: a },
      //获取播放列表
      list: { type: 'list' },
      //播放指定歌曲
      playMusic: { type: 'play', type_id: '播放指定歌曲', index: a },
      //从某个时间节点开始播放
      setPosition: { type: 'set_position', position: a },
      // 播放
      playMenu: { type: 'send_message', what: 4, arg1: 1, arg2: -1, obj:a },
    }
  }

  function bandaoApis (a, b, c, d) {
    return {
      //收藏
      collect: { type: 'send_message', what: 65536, arg1: 0, arg2: 6 },
      //取消收藏
      cancelCollect: { type: 'send_message', what: 65536, arg1: 0, arg2: 7 },
      // 播放
      playMenu: { type: 'sendMsg', what: 4, arg1: 1, arg2: -1, dataType: 'String', data: a },
    }
  }



  // css
  function myStyle () {
    return `
    :root {
      --color-body-bg: #fff;
      --color-text: #000;
      --color-title: #ff9347;
      --color-primary: #335eea;
      --color-primary-bg: #eaeffd;
      --color-secondary: #7a7a7b;
      --color-secondary-bg: #f5f5f7;
      --color-navbar-bg: hsla(0, 0%, 100%, 0.86);
      --color-primary-bg-for-transparent: rgba(189, 207, 255, 0.28);
      --color-secondary-bg-for-transparent: rgba(209, 209, 214, 0.28);
      --html-overflow-y: overlay;

    }

    [data-theme=dark] {
      --color-body-bg: #222;
      --color-text: #fff;
      --color-primary-bg: #bbcdff;
      --color-secondary: #7a7a7b;
      --color-secondary-bg: #323232;
      --color-navbar-bg: rgba(34, 34, 34, 0.86);
      --color-primary-bg-for-transparent: hsla(0, 0%, 100%, 0.12);
      --color-secondary-bg-for-transparent: hsla(0, 0%, 100%, 0.08);
    }

    body {
      margin: 0;
      padding: 0;
      outline: none;
    }

    .el-slider__button-wrapper {
      z-index: 90 !important;
    }

    #app {
      position: relative;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      background-color: var(--color-body-bg);
    }

    #app .menu {
      position: fixed;
      right: 0;
      top: 0;
      z-index: 2001;
    }

    #app .menu .icon {
      position: absolute;
      right: -20px;
      font-size: 40px;
      color: var(--color-text);
      cursor: pointer;
      transition: 0.5s;
    }

    #app .menu .icon:hover {
      right: 0;
    }

    #app .drawer-mark {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0.5;
      display: none;
      background: #000;
      z-index: 2000;
    }

    #app .drawer-ltr {
      position: absolute;
      top: 0;
      right: -64px;
      width: 64px;
      transition: 0.5s;
    }

    #app .drawer-ltr.active {
      right: -5px;
    }

    #app .drawer-ltr .el-menu-item i {
      line-height: 56px !important;
    }

    #app .main {
      position: fixed;
      top: 0px;
      left: 0px;
      right: 0px;
      overflow-x: hidden;
      overflow-y: auto;
      padding-top: 40px;
      height: calc(100vh - 40px);
      color: var(--color-text);
      background-color: var(--color-body-bg);
    }

    #app .main::-webkit-scrollbar {
      display: none;
    }

    #app .main.hasfooter {
      height: calc(100vh - 104px);
    }

    #app .main::-webkit-scrollbar {
      display: none;
    }

    #app .main .title {
      font-size: 20px;
      margin-left: 10px;
      color: var(--color-title);
    }

    #app .main .item-title {
      margin: 5px 10px 5px 15px;
      font-size: 20px;
    }

    #app .button-icon.disabled {
      cursor: default;
      opacity: 0.38;
    }

    #app .button-icon.disabled:hover {
      background: none;
    }

    #app .button-icon.disabled:active {
      transform: unset;
    }

    #app .button-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 8px;
      background: transparent;
      margin: 4px;
      border-radius: 25%;
      transition: 0.2s;
      background: none;
      border: none;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      font-family: inherit;
    }

    #app .button-icon:hover {
      background: rgba(209, 209, 214, 0.5);
    }

    #app .button-icon .svg-icon {
      color: var(--color-text);
      height: 16px;
      width: 16px;
    }

    #app .player {
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 64px;
      backdrop-filter: saturate(180%) blur(30px);
      background-color: var(--color-navbar-bg);
      z-index: 100;
    }

    #app .progress-bar {
      margin-top: -6px;
      margin-bottom: -6px;
      width: 100%;
    }

    #app .player>.controls {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      height: 100%;
      padding-left: 10vw;
      padding-right: 10vw;
    }

    #app .blank {
      flex-grow: 1;
    }

    #app .controls .playing {
      display: flex;
    }

    #app .controls .playing .container {
      display: flex;
      align-items: center;
    }

    #app .controls .playing .container img {
      height: 46px;
      border-radius: 5px;
      box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.16);
      cursor: pointer;
      user-select: none;
    }

    #app .controls .playing .container .track-info {
      height: 46px;
      margin-left: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    #app .controls .playing .container .track-info .name {
      font-weight: 600;
      font-size: 16px;
      opacity: 0.88;
      color: var(--color-text);
      margin-bottom: 4px;
      cursor: pointer;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }

    #app .controls .playing .container .track-info .name:hover {
      text-decoration: underline;
    }

    #app .controls .playing .container .track-info .artist {
      font-size: 12px;
      opacity: 0.58;
      color: var(--color-text);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }

    #app .controls .playing .container .track-info .artist span.ar {
      cursor: pointer;
    }

    #app .controls .playing .container .track-info .artist span.ar:hover {
      text-decoration: underline;
    }

    #app .middle-control-buttons {
      display: flex;
    }

    #app .middle-control-buttons .container {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 8px;
    }

    #app .middle-control-buttons .container .button-icon {
      margin: 0 8px;
    }

    #app .middle-control-buttons .container .play {
      height: 42px;
      width: 42px;
    }

    #app .middle-control-buttons .container .play .svg-icon {
      width: 24px;
      height: 24px;
    }

    #app .right-control-buttons {
      display: flex;
    }

    #app .right-control-buttons .container {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    #app .right-control-buttons .container .volume-control {
      margin-left: 4px;
      display: flex;
      align-items: center;
    }

    #app .right-control-buttons .container .volume-control .volume-bar {
      width: 84px;
    }

    #app .right-control-buttons .container .active .svg-icon {
      color: var(--color-primary);
    }


    #app .like-button {
      margin-left: 16px;
    }

    #app .next-tracks {
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      overflow: auto;
      padding: 10px 10vw 70px 10vw;
      box-sizing: border-box;
      z-index: 99;
      background-color: var(--color-navbar-bg);
    }

    #app .track-list::-webkit-scrollbar {
      display: none;
    }

    #app .next-tracks h1 {
      margin-top: 10px;
      margin-bottom: 18px;
      cursor: default;
      color: var(--color-text);
      display: flex;
      justify-content: space-between;
    }

    #app .track .button-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 8px;
      background: transparent;
      border-radius: 25%;
      transition: transform 0.2s;
    }

    #app .track .button-icon .svg-icon {
      height: 16px;
      width: 16px;
      color: #335eea;
    }

    #app .track .button-icon:hover {
      transform: scale(1.12);
    }

    #app .track .button-icon:active {
      transform: scale(0.96);
    }

    #app .track {
      display: flex;
      align-items: center;
      padding: 8px;
      border-radius: 12px;
      user-select: none;
    }

    #app .track .explicit-symbol {
      opacity: 0.28;
      color: #335eea;
    }

    #app .track .explicit-symbol .svg-icon {
      margin-bottom: -3px;
    }

    #app .track .explicit-symbol.before-artist {
      margin-right: 2px;
    }

    #app .track .explicit-symbol.before-artist .svg-icon {
      margin-bottom: -3px;
    }

    #app .track img {
      border-radius: 8px;
      height: 46px;
      width: 46px;
      margin-right: 20px;
      border: 1px solid rgba(0, 0, 0, 0.04);
      cursor: pointer;
    }

    #app .track img.hover {
      filter: drop-shadow(100 200 0 black);
    }

    #app .track .title-and-artist {
      flex: 1;
      display: flex;
    }

    #app .track .title-and-artist .container {
      display: flex;
      flex-direction: column;
    }

    #app .track .title-and-artist .title {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-text);
      cursor: default;
      padding-right: 16px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }

    #app .track .title-and-artist .title .featured {
      margin-right: 2px;
      font-weight: 500;
      font-size: 14px;
      opacity: 0.72;
    }

    #app .track .title-and-artist .artist {
      margin-top: 2px;
      font-size: 13px;
      opacity: 0.68;
      color: var(--color-text);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    #app .track .album {
      flex: 1;
      display: flex;
      font-size: 16px;
      opacity: 0.88;
      color: var(--color-text);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    #app .track .time {
      font-size: 16px;
      width: 50px;
      cursor: default;
      display: flex;
      justify-content: flex-end;
      margin-right: 10px;
      font-variant-numeric: tabular-nums;
      opacity: 0.88;
      color: var(--color-text);
    }

    #app .track:hover {
      transition: all 0.3s;
      background: var(--color-secondary-bg);
    }

    #app .track.disable img {
      filter: grayscale(1) opacity(0.6);
    }

    #app .track.disable .title,
    #app .track.disable .artist,
    #app .track.disable .album,
    #app .track.disable .time,
    #app .track.disable .no,
    #app .track.disable .featured {
      opacity: 0.28 !important;
    }

    #app .track.disable:hover {
      background: none;
    }

    #app .track.tracklist img {
      height: 36px;
      width: 36px;
      border-radius: 6px;
      margin-right: 14px;
      cursor: pointer;
    }

    #app .track.tracklist .title {
      font-size: 16px;
    }

    #app .track.tracklist .artist {
      font-size: 12px;
    }

    #app .track.album {
      height: 32px;
    }

    #app .actions {
      width: 80px;
      display: flex;
      justify-content: flex-end;
      visibility: hidden;
    }

    #app .track:hover .actions {
      visibility: visible;
    }

    #app .track.playing {
      background: var(--color-primary-bg);
      color: var(--color-primary);
    }

    #app .track.playing .title,
    #app .track.playing .album,
    #app .track.playing .time {
      color: var(--color-primary);
    }

    #app .track.playing .title .featured,
    #app .track.playing .artist,
    #app .track.playing .explicit-symbol {
      color: var(--color-primary);
      opacity: 0.88;
    }

    #app .lyrics-page {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      z-index: 200;
      background: var(--color-body-bg);
      display: flex;
      clip: rect(auto, auto, auto, auto);
    }

    #app .lyrics-background {
      --contrast-lyrics-background: 75%;
      --brightness-lyrics-background: 150%;
    }

    #app [data-theme='dark'] .lyrics-background {
      --contrast-lyrics-background: 125%;
      --brightness-lyrics-background: 50%;
    }

    #app .lyrics-background {
      filter: blur(50px) contrast(var(--contrast-lyrics-background)) brightness(var(--brightness-lyrics-background));
      position: absolute;
      height: 100vh;
      width: 100vw;
    }

    #app .lyrics-background .top-right,
    #app .lyrics-background .bottom-left {
      z-index: 0;
      width: 140vw;
      height: 140vw;
      opacity: 0.6;
      position: absolute;
      background-size: cover;
    }

    #app .lyrics-background .top-right {
      right: 0;
      top: 0;
      mix-blend-mode: luminosity;
    }

    #app .lyrics-background .bottom-left {
      left: 0;
      bottom: 0;
      animation-direction: reverse;
      animation-delay: 10s;
    }

    #app .dynamic-background>div {
      animation: rotate 150s linear infinite;
    }

    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
    }

    #app .left-side {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      margin-right: 32px;
      margin-top: 24px;
      align-items: center;
      transition: all 0.5s;
      z-index: 1;
    }

    #app .left-side .controls {
      max-width: 54vh;
      margin-top: 24px;
      color: var(--color-text);
    }

    #app .left-side .controls .title {
      margin-top: 8px;
      font-size: 1.4rem;
      font-weight: 600;
      opacity: 0.88;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    #app .left-side .controls .subtitle {
      margin-top: 4px;
      font-size: 1rem;
      opacity: 0.58;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    #app .left-side .controls .top-part {
      display: flex;
      justify-content: space-between;
    }

    #app .left-side .controls .top-part .buttons {
      display: flex;
      align-items: center;
    }

    #app .left-side .controls .top-part .buttons button {
      margin: 0 0 0 4px;
    }

    #app .left-side .controls .top-part .buttons .svg-icon {
      height: 18px;
      width: 18px;
    }

    #app .left-side .controls .progress-bar {
      margin-top: 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    #app .left-side .controls .progress-bar .slider {
      width: 100%;
      flex-grow: grow;
      padding: 0 10px;
    }

    #app .left-side .controls .progress-bar span {
      font-size: 15px;
      opacity: 0.58;
      min-width: 28px;
    }

    #app .left-side .controls .media-controls {
      display: flex;
      justify-content: center;
      margin-top: 18px;
      align-items: center;
    }

    #app .left-side .controls .media-controls button {
      margin: 0;
    }

    #app .left-side .controls .media-controls .svg-icon {
      opacity: 0.38;
      height: 14px;
      width: 14px;
    }

    #app .left-side .controls .media-controls .active .svg-icon {
      opacity: 0.88;
    }

    #app .left-side .controls .media-controls .middle {
      padding: 0 16px;
      display: flex;
      align-items: center;
    }

    #app .left-side .controls .media-controls .middle button {
      margin: 0 8px;
    }

    #app .left-side .controls .media-controls .middle button#play .svg-icon {
      height: 28px;
      width: 28px;
      padding: 2px;
    }

    #app .left-side .controls .media-controls .middle .svg-icon {
      opacity: 0.88;
      height: 22px;
      width: 22px;
    }

    #app .cover {
      position: relative;
    }

    #app .cover .cover-container {
      position: relative;
    }

    #app .cover img {
      border-radius: 0.75em;
      width: 54vh;
      height: 54vh;
      user-select: none;
      object-fit: cover;
    }

    #app .cover .shadow {
      position: absolute;
      top: 12px;
      left: 12px;
      height: 54vh;
      width: 54vh;
      filter: blur(16px) opacity(0.6);
      transform: scale(1.1, 1.1);
      z-index: -1;
      background-size: cover;
      border-radius: 0.75em;
    }

    #app .right-side {
      flex: 1;
      font-weight: 600;
      color: var(--color-text);
      margin-right: 24px;
      z-index: 0;
    }

    #app .right-side .lyrics-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding-left: 78px;
      max-width: 460px;
      overflow-y: auto;
      transition: 0.5s;
    }

    #app .right-side .lyrics-container .line {
      padding: 18px 5px;
      transition: 0.2s;
      border-radius: 12px;
      text-align: center;
    }

    #app .right-side .lyrics-container .line:hover {
      background: #7a7a7b;
    }

    #app .right-side .lyrics-container .line span {
      opacity: 0.6;
      cursor: default;
    }

    #app .right-side .lyrics-container .line#line-1:hover {
      background: unset;
    }

    #app .right-side .lyrics-container .highlight span {
      opacity: 0.98;
      transition: 0.5s;
    }

    #app .right-side ::-webkit-scrollbar {
      display: none;
    }

    #app .right-side .lyrics-container .line:first-child {
      margin-top: 50vh;
    }

    #app .right-side .lyrics-container .line:last-child {
      margin-bottom: calc(50vh - 128px);
    }

    #app .close-button {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 300;
      border-radius: 0.75rem;
      height: 44px;
      width: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0.48;
      transition: 0.2s;
      -webkit-app-region: no-drag;
      cursor: pointer;
    }

    #app .close-button .svg-icon {
      color: var(--color-text);
      padding-top: 5px;
      height: 22px;
      width: 22px;
    }

    #app .close-button:hover {
      background: rgba(209, 209, 214, 0.28);
      opacity: 0.9;
    }

    #app .lyrics-page.no-lyric .left-side {
      transition: all 0.5s;
      transform: translateX(27vh);
      margin-right: 0;
    }

    #app .slide-up-enter-active,
    #app .slide-up-leave-active {
      transition: all 0.4s;
    }

    #app .slide-up-enter,
    #app .slide-up-leave-to {
      transform: translateY(100%);
    }

    #app .slide-fade-enter-active {
      transition: all 0.5s ease;
    }

    #app .slide-fade-leave-active {
      transition: all 0.5s cubic-bezier(0.2, 0.2, 0, 1);
    }

    #app .slide-fade-enter,
    #app .slide-fade-leave-to {
      transform: translateX(27vh);
      opacity: 0;
    }

    #app .lyric-font-size {
      font-size: 28px;
    }


    #app .box-menu {
      padding-left: 10vw;
      padding-right: 10vw;
    }

    #app .box-menu+.box-menu {
      margin-top: 44px;
    }

    #app .box-menu>.title {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 20px;
      font-size: 28px;
      font-weight: 700;
      color: var(--color-text);
    }

    #app .box-menu .cover-row {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 44px 24px;
    }

    #app .box-menu .item {
      color: var(--color-text);
    }

    #app .box-menu .item .cover {
      position: relative;
      transition: transform .3s;
    }

    #app .box-menu .item .cover:hover .play-button {
      display: flex;
    }

    #app .box-menu .item .cover-hover:hover {
      cursor: pointer;
    }

    #app .box-menu .item .play-button,
    #app .box-menu .item .shade {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #app .box-menu .item .shade {
      position: absolute;
      top: 0;
      height: calc(100% - 3px);
      width: 100%;
      background: transparent;
    }

    #app .box-menu .item .play-button {
      color: #fff;
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
      background: hsla(0, 0%, 100%, .14);
      border: 1px solid hsla(0, 0%, 100%, .08);
      height: 22%;
      width: 22%;
      border-radius: 50%;
      cursor: default;
      transition: .2s;
      width: 22%;
      height: 22%;
      display: none;
      cursor: pointer;
    }

    #app .box-menu .item .play-button:hover {
      background: hsla(0, 0%, 100%, .28);
    }

    #app .box-menu .item .play-button .svg-icon {
      height: 44%;
      margin-left: 4px;
    }

    #app .box-menu .item .cover-container img {
      border-radius: .75em;
      width: 100%;
      height: auto;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      aspect-ratio: 1/1;
    }

    #app .box-menu .item .text {
      margin-top: 8px;
    }

    #app .box-menu .item .text .title {
      font-size: 18px;
      font-weight: 600;
      line-height: 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-all;
      color: var(--color-text);
      margin-left: 0;
    }

    #app .box-menu .item .text .info {
      font-size: 14px;
      opacity: 0.68;
      line-height: 18px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-word;
      color: var(--color-text);
    }

    #app .box-menu .svg-icon {
      height: 12px;
      width: 12px;
    }

    #app .main .uid {
      position: absolute;
      left: 10px;
      top: 10px;
      cursor: pointer;
    }



    @media (max-aspect-ratio: 1.1111111111) {
      #app .left-side {
        display: none;
      }

      #app .right-side {
        margin-right: 0;
      }

      #app .right-side .lyrics-container {
        max-width: 100%;
        padding-left: 0;
      }
    }

    @media (max-width: 1336px) {
      #app .player>.controls {
        padding: 0 5vw;
      }

      #app .next-tracks {
        padding: 10px 5vw 70px 5vw;
      }

      #app .box-menu {
        padding-left: 5vw !important;
        padding-right: 5vw !important;
      }
    }

    @media (max-width: 834px) {
      #app .box-menu .item .text .title {
        font-size: 14px;
      }
    }

    @media (max-width: 768px) {
      #app .next-tracks h1 {
        font-size: 30px;
      }

      #app .track-list .track .album {
        flex: 0;
      }

      #app .player>.controls {
        padding: 0;
        grid-template-columns: repeat(2, 1fr);
      }

      #app .player>.controls .playing {
        display: none;
      }

      #app .container>span[title="歌词"] {
        margin-left: 4px !important;
      }

      #app .lyric-font-size {
        font-size: 24px;
      }
    }

    @media (max-width: 500px) {
      #app .next-tracks h1 {
        font-size: 24px;
      }

      #app .track-list .track .time,
      #app .track-list .track .actions {
        display: none;
      }

      #app .lyric-font-size {
        font-size: 20px;
      }

      #app .volume-bar {
        display: none;
      }

      #app .middle-control-buttons .container .button-icon {
        margin: 0;
      }
    }

    #app .progress-bar .el-slider__button-wrapper.hover,
    #app .progress-bar .el-slider__button-wrapper:hover,
    #app .progress-bar .el-slider__button.hover,
    #app .progress-bar .el-slider__button:hover {
      cursor: pointer;
    }

    #app .progress-bar .el-slider__button.dragging,
    #app .progress-bar .el-slider__button.hover,
    #app .progress-bar .el-slider__button:hover {
      transform: scale(1);
    }

    #app .progress-bar .el-slider {
      height: 2px;
      padding: 6px 0px;
      width: auto;
    }

    #app .progress-bar .el-slider__runway {
      height: 100%;
      margin: 0;
      background-color: hsla(0, 0%, 50.2%, .18);
    }

    #app .progress-bar .el-slider__bar {
      height: 2px;
    }

    #app .progress-bar .el-slider__button-wrapper {
      height: 12px;
      width: 12px;
    }

    #app .progress-bar .el-slider__button {
      height: 12px;
      width: 12px;
      border: none;
      background-color: var(--color-text);
      visibility: hidden;
    }

    #app .progress-bar .el-slider:hover .el-slider__button {
      visibility: visible;
    }


    #app .left-side .progress-bar .el-slider {
      width: 100%;
      padding: 0 10px;
    }

    #app .left-side .progress-bar .el-slider {
      height: 4px;
    }

    #app .left-side .progress-bar .el-slider__bar {
      height: 4px;
      background-color: #fff;
    }

    #app .volume-control .progress-bar {
      width: 84px;
    }

    #app .volume-control .el-slider {
      height: 4px;
    }

    #app .volume-control .el-slider__runway {
      border-radius: 15px;
    }

    #app .volume-control .el-slider__bar {
      height: 4px;
      background-color: var(--color-text);
    }

    #app .volume-control .el-slider:hover .el-slider__bar {
      background-color: var(--color-primary);
    }

`
  }


  function getEl (str) {
    return document.querySelectorAll(str);
  }

  function DelEl (el) {
    el.parentNode.removeChild(el);
  }
  // 加载ui文件
  function loadCss (url) {
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  function addCss (style) {
    let styleNode = document.createElement('style');
    styleNode.type = "text/css";
    styleNode.innerHTML = style;
    document.getElementsByTagName('head')[0].appendChild(styleNode);
  }

  function addMeta () {
    let M = document.createElement('meta');
    M.content = 'width=device-width,initial-scale=1,user-scalable=0,maximum-scale=1,viewport-fit=cover';
    M.name = 'viewport';
    document.getElementsByTagName('head')[0].appendChild(M);
  }

  function addJs (src) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    document.body.appendChild(script);
  }

  // 拓展date
  Date.prototype.Format = function (fmt) {
    let o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
      }
    }

    return fmt
  }
  Date.prototype.totalDay = function (fmt) { //把时间戳转为距离今天的时间
    let d = 24 * 60 * 60 * 1000; // 一天毫秒数 24 * 60 * 60 * 1000
    let h = 60 * 60 * 1000; // 一小时毫秒数 60 * 60 * 1000
    let m = 60 * 1000; // 一分钟毫秒数 60 * 1000
    let t = this.getTime()
    let o = {
      "d+": parseInt(t / d), //日
      "h+": parseInt(t % d / h), //小时
      "m+": parseInt(t % h / m), //分
      "s+": parseInt(t % m / 1000), //秒
    }
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length <= 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
      }
    }

    return fmt
  }

  function parseLyric (lrc) {
    const lyrics = lrc.split('\n');
    const lrcObj = [];
    for (let i = 0; i < lyrics.length; i++) {
      const lyric = decodeURIComponent(lyrics[i]);
      const timeReg = /\[\d*:\d*((\.|:)\d*)*\]/g;
      const timeRegExpArr = lyric.match(timeReg);
      if (!timeRegExpArr) continue;
      const content = lyric.replace(timeReg, '');
      for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
        const t = timeRegExpArr[k];
        const min = Number(String(t.match(/\[\d*/i)).slice(1));
        const sec = Number(String(t.match(/:\d*/i)).slice(1));
        const ms = Number(t.match(/\d*\]/i)[0].split(']')[0]) / 100;
        const time = min * 60 + sec + ms;
        if (content !== '') {
          lrcObj.push({ time: time, rawTime: timeRegExpArr[0], content });
        }
      }
    }
    return lrcObj;
  }

  function disableScrolling () {
    document.documentElement.style.setProperty('--html-overflow-y', 'hidden');
  }

  function enableScrolling () {
    document.documentElement.style.setProperty('--html-overflow-y', 'overlay');
  }

  function checkPort () {
    let port = location.port
    if (port == 8080 && typeof start_updateinfo == 'function') {
      start_updateinfo(3000)
    }
  }


  //`````````````````jsonp`````````````````````````````
  //Callback index.
  var count = 0;

  //Noop function.
  function noop () {}

  function jsonp (url, opts, fn) {
    if ('function' == typeof opts) {
      fn = opts;
      opts = {};
    }
    if (!opts) opts = {};

    var prefix = opts.prefix || '__jp';

    // use the callback name that was passed if one was provided.
    // otherwise generate a unique name by incrementing our counter.
    var id = opts.name || (prefix + (count++));

    var param = opts.param || 'callback';
    var timeout = null != opts.timeout ? opts.timeout : 60000;
    var enc = encodeURIComponent;
    var target = document.getElementsByTagName('script')[0] || document.head;
    var script;
    var timer;


    if (timeout) {
      timer = setTimeout(function () {
        cleanup();
        if (fn) fn(new Error('Timeout'));
      }, timeout);
    }

    function cleanup () {
      if (script.parentNode) script.parentNode.removeChild(script);
      window[id] = noop;
      if (timer) clearTimeout(timer);
    }

    function cancel () {
      if (window[id]) {
        cleanup();
      }
    }

    window[id] = function (data) {
      cleanup();
      if (fn) fn(null, data);
    };
    // add qs component
    url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc(id);
    url = url.replace('?&', '?');
    // create script
    script = document.createElement('script');
    script.src = url;
    target.parentNode.insertBefore(script, target);

    return cancel;
  }

  //``````````````````````````````````````````````










  function vueBox () {
    let string = `
  <div id="app" :data-theme="theme">
    <div class="menu" @click="drawer = true">
      <i class="el-icon-s-fold icon"></i>
      <div class="drawer-ltr" :class="{active: drawer}" @click.stop>
        <el-menu :collapse="true" @select="handleChangeMenu">
          <el-menu-item index="0">
            <i class="el-icon-s-home"></i>
            <span slot="title">隐藏页面</span>
          </el-menu-item>
          <el-menu-item index="1">
            <i class="el-icon-monitor"></i>
            <span slot="title">屏幕控制</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-s-operation"></i>
            <span slot="title">音效控制</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-s-tools"></i>
            <span slot="title">音箱控制</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">系统信息</span>
          </el-menu-item>
          <el-menu-item index="5">
            <i class="el-icon-service"></i>
            <span slot="title">点歌列表</span>
          </el-menu-item>
          <el-menu-item index="100">
            <i class="el-icon-moon-night"></i>
            <span slot="title">切换主题</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="drawer-mark" @click="drawer = false" :style="{display: drawer ? 'block' : 'none'}"></div>
    <div class="main" :class="{hasfooter: deviceInfo.music_info}" v-show="!nextTracksPage && showMain">
      <!-- 屏幕控制 -->
      <template>
        <div v-show="activeMenu == 1">
          <div v-show="screencap.length > 1" style="margin:5px 15px;display: flex;justify-content: center;align-items: center;">
            <img id="screen" :src="screencap" width="100%" alt="屏幕" style="max-width: 1024px;user-select: none;-webkit-user-drag: none;" />
          </div>
          <div style="height: 110px;width: 100%;position: relative;">
            <span id="arrow_keys" style="width: 120px;height: 100%;display: inline-block;position: absolute;left: calc(50% - 130px);">
              <el-button type="info" icon="el-icon-caret-top" style="position: absolute;top: 0;left: calc(50% - 20px);margin: 0;" circle @click="sendKeyevent(19)"></el-button>
              <el-button type="info" icon="el-icon-caret-right" style="position: absolute;top: calc(50% - 20px);right: 0;margin: 0;" circle @click="sendKeyevent(22)"></el-button>
              <el-button type="info" icon="el-icon-caret-bottom" style="position: absolute;bottom: 0;left: calc(50% - 20px);margin: 0;" circle @click="sendKeyevent(20)"></el-button>
              <el-button type="info" icon="el-icon-caret-left" style="position: absolute;top: calc(50% - 20px);left: 0;margin: 0;" circle @click="sendKeyevent(21)"></el-button>
            </span>
            <span id="function_keys" style="width: 150px;height: 100%;display: inline-block;position: absolute;right: calc(50% - 160px);">
              <el-button icon="el-icon-back" round style="position: absolute;top: calc(50% - 20px);left: 0;margin: 0;" @click="sendKeyevent(4)" title="返回"></el-button>
              <el-button type="primary" icon="el-icon-thumb" round style="position: absolute;top: calc(50% - 20px);right: 0;margin: 0;" @click="sendKeyevent(23)" title="确认"></el-button>
            </span>
          </div>
        </div>
      </template>
      <!-- 音效控制 -->
      <template>
        <div v-show="activeMenu == 2">
          <div id="volume" class="item-title">
            <span>
              音量 : <span>{{deviceInfo.vol}}</span> / 15
            </span>
            <el-slider v-model="deviceInfo.vol" :max="15" :show-tooltip="false" @change="setVolume"></el-slider>
          </div>
          <div id="loudness" class="item-title">
            <span>
              响度 : <span>{{soundEffect.loudness.Current_Gain / 100}}</span> dB
            </span>
            <span style="float: right;">
              <el-switch :value="soundEffect.loudness.sound_effects_loudness_enable" active-color="#13ce66" inactive-color="#ff4949" active-text="开" inactive-text="关" @change="btnLoudness">
              </el-switch>
            </span>
            <el-slider v-model="soundEffect.loudness.Current_Gain" :step="100" :min="-3000" :max="3000" :show-tooltip="false" :disabled="!soundEffect.loudness.Loudness_Enable" @change="setLoudness"></el-slider>
          </div>
          <div id="bass" class="item-title">
            <span>
              低音增强 : <span>{{soundEffect.bass.Current_Strength / 10}}</span> %
            </span>
            <span style="float: right;">
              <el-switch :value="soundEffect.bass.sound_effects_bass_enable" active-color="#13ce66" inactive-color="#ff4949" active-text="开" inactive-text="关" @change="btnBass">
              </el-switch>
            </span>
            <el-slider v-model="soundEffect.bass.Current_Strength" :step="100" :max="1000" :show-tooltip="false" :disabled="!soundEffect.bass.Bass_Enable" @change="setBass"></el-slider>
          </div>
          <div v-for="(item, index) in soundEffect.eq.Bands.list" :key="'eq' + index" :id="'eq' + index" class="item-title">
            <span>
              <el-tooltip placement="top-start">
                <div slot="content">频率 : {{item.Frequency}}</div>
                <span>

                  {{ eqBandListName[index] }} : </span>
              </el-tooltip>
              <span>{{item.BandLevel / 100}}</span> dB
            </span>
            <span style="float: right;" v-if="index == 0">
              <el-switch :value="soundEffect.eq.sound_effects_eq_enable" active-color="#13ce66" inactive-color="#ff4949" active-text="开" inactive-text="关" @change="btnEq">
              </el-switch>
            </span>
            <el-slider v-model="item.BandLevel" :step="100" :min="-1500" :max="1500" :show-tooltip="false" :disabled="!soundEffect.eq.Eq_Enable" @change="setEq(index)"></el-slider>
          </div>
          <el-row class="item-title">
            <el-button type="danger" style="margin:5px;" v-for="(item, index) in soundEffect.eq.Preset_list" :key="'Preset_list' + index " @click="setEqMode(index)">
              {{eqPresetListName[item.Name]}}
            </el-button>
            <el-button v-for="(item, index) in myEqMode" :key="'myEqMode' + index" type="danger" style="margin:5px;" @click="setMyEqMode(index)">
              {{item.Name}}
            </el-button>
            <el-button v-for="(item, index) in myEqMode2" v-show="!isDelEqMode" :key="'myEqMode2' + index" type="danger" style="margin:5px;" @click="setMyEqMode2(index)">
              {{item.Name}}
            </el-button>
            <el-popconfirm v-for="(item, index) in myEqMode2" v-show="isDelEqMode" :key="'myEqMode2b' + index" :title="'确定删除 : '+ item.Name + ' ?'" :hide-icon="true" @confirm="delEqMode(item)">
              <el-button slot="reference" type="warning" style="margin:5px;">
                {{item.Name}}
              </el-button>
            </el-popconfirm>
          </el-row>
          <el-row class="item-title">
            <el-button type="primary" style="margin:5px;" @click="dialogVisible = true">
              保存设置
            </el-button>
            <el-switch :value="!isDelEqMode" v-show="myEqMode2.length > 0" active-color="#13ce66" inactive-color="#ff4949" active-text="默认模式" inactive-text="删除模式" @change="isDelEqMode = !isDelEqMode">
            </el-switch>
            <el-dialog :visible.sync="dialogVisible" width="250px" center :modal="false">
              <el-input v-model="eqModeName" placeholder="给当前设置的音频一个名字"></el-input>
              <span slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addEqMode">确 定</el-button>
              </span>
            </el-dialog>
          </el-row>
        </div>
      </template>
      <!-- 音箱控制 -->
      <template>
        <div v-show="activeMenu == 3">
          <div class="item-title">
            <span>
              蓝牙 :
            </span>
            <el-switch v-loading="loading" :value="Bluetooth" active-color="#13ce66" inactive-color="#ff4949" active-text="开" inactive-text="关" @change="BluetoothControl">
            </el-switch>
          </div>
          <div class="item-title">
            <span>
              氛围灯 :
            </span>
            <el-switch v-loading="loading" :value="deviceInfo.music_light_enable" active-color="#13ce66" inactive-color="#ff4949" active-text="开" inactive-text="关" @change="musicLightControl">
            </el-switch>
          </div>
          <div class="item-title">
            <span>
              氛围灯亮度 : <span>{{deviceInfo.music_light_luma}}</span>
            </span>
            <el-slider v-model="deviceInfo.music_light_luma" :min="1" :max="200" :show-tooltip="false" @change="musciLightLuma"></el-slider>
          </div>
          <div class="item-title">
            <span>
              氛围灯颜色渐变速度 : <span>{{deviceInfo.music_light_chroma}}</span>
            </span>
            <el-slider v-model="deviceInfo.music_light_chroma" :min="1" :max="100" :show-tooltip="false" @change="musicLightChroma"></el-slider>
          </div>
          <div class="item-title">
            <span>
              氛围效果 :
            </span>
            <el-radio-group v-model="deviceInfo.music_light_mode" @change="musicLightMode" style="display: block;margin:5px;">
              <el-radio-button :label="0">官方氛围</el-radio-button>
              <el-radio-button :label="2">七彩氛围</el-radio-button>
            </el-radio-group>
          </div>
          <div class="item-title" v-if="false">
            <span>
              网络配置 :
            </span>
            <div>
              <el-popconfirm title="确定要打开配网模式吗？打开后网页控制将断开！" :hide-icon="true" @confirm="netConfig()">
                <el-button slot="reference" type="primary" style="margin:5px;">
                  打开网络配置
                </el-button>
              </el-popconfirm>
            </div>
          </div>
          <div class="item-title">
            <span>
              shell命令 :
            </span>
            <div>
              <el-popconfirm title="是否确认重启app" :hide-icon="true" @confirm="restartApp('com.phicomm.speaker.device')">
                <el-button slot="reference" type="danger" style="margin:5px;">
                  重启小讯
                </el-button>
              </el-popconfirm>
              <el-popconfirm title="是否确认重启音箱" :hide-icon="true" @confirm="reboot">
                <el-button slot="reference" type="danger" style="margin:5px;">
                  重启音箱
                </el-button>
              </el-popconfirm>
              <el-button type="danger" style="margin:5px;" @click="restartdialogVisible = true, getListPackages()">
                开关软件
              </el-button>
              <el-dialog :title="listPackagesIndex == null ? '重启软件' : listPackagesIndex" :visible.sync="restartdialogVisible" width="375px" center :modal="false">
                <el-radio-group v-model="listPackagesIndex" style="height: 400px;width: 100%;overflow-y: scroll;overflow-x: hidden;">
                  <el-radio v-for="(item ,index) of listPackages" :key="'listPackages-' + index" :label="item">
                    {{item}}
                  </el-radio>
                </el-radio-group>
                <span slot="footer" class="dialog-footer">
                  <el-button type="info" @click="restartdialogVisible = false, stopApp()">关</el-button>
                  <el-button type="success" @click="restartdialogVisible = false, startApp()">开</el-button>
                  <el-button @click="restartdialogVisible = false">取 消</el-button>
                </span>
              </el-dialog>
              <br>
              <el-button type="primary" @click="light(true)" style="margin:5px 0 5px 5px;">
                开灯
              </el-button>
              <el-button type="primary" @click="light()" style="margin:5px 5px 5px 0;">
                关灯
              </el-button>
              <el-popconfirm title="清除所有闹钟，同时重启半岛app" :hide-icon="true" @confirm="clear()">
                <el-button slot="reference" type="danger" style="margin:5px;">
                  清除闹钟
                </el-button>
              </el-popconfirm>
              <el-popover placement="top" width="160" v-model="shellVisible">
                <textarea v-model="shellStr" cols="30" rows="3" style="width: 100%;"></textarea>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="shellVisible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="shellVisible = false, executeShell()">执行</el-button>
                </div>
                <el-button slot="reference" title="F12 console 有输出结果">输入shell</el-button>
              </el-popover>
            </div>
          </div>
        </div>
      </template>
      <!-- 系统信息 -->
      <template>
        <div v-show="activeMenu == 4">
          <div class="item-title">
            <span>
              固件版本 : {{systemInfo.incremental}}
            </span>
          </div>
          <div class="item-title">
            <span>
              可用运存 : {{parseInt((systemInfo.MemFree + systemInfo.Cached) / 1024)}} Mb/ {{parseInt(systemInfo.MemTotal / 1024)}} Mb
            </span>
          </div>
          <div class="item-title">
            <span>
              系统启动时间 : {{new Date(systemInfo.btime).Format('yyyy-MM-dd hh:mm:ss')}}
            </span>
          </div>
          <div class="item-title">
            <span>
              系统已运行 : {{new Date(new Date().getTime() - systemInfo.btime).totalDay('dd天hh:mm:ss')}}
            </span>
          </div>
          <div class="item-title">
            <span>
              信息更新时间 : {{new Date().Format('yyyy-MM-dd hh:mm:ss')}}
            </span>
          </div>
          <div class="item-title" v-for="(item , index) of cpuStatus" :key="index">
            <span>
              CPU{{index == 0 ? ' ' : index -1}}使用率 : {{item}}%
            </span>
          </div>
        </div>
      </template>
      <!-- 点歌列表 -->
      <template>
        <div v-show="activeMenu == 5">
          <div style="position: absolute;left: 50%;top: 0;transform: translateX(-50%);border-radius: 0 0 10px 10px;overflow: hidden;">
            <el-menu default-active="1000" @select="handleChangeList" mode="horizontal" background-color="var(--color-text)" text-color="var(--color-body-bg)" active-text-color="#ffd04b">
              <el-menu-item index="1000">
                <span slot="title">酷我</span>
              </el-menu-item>
              <el-menu-item index="1001">
                <span slot="title">网易</span>
              </el-menu-item>
              <el-menu-item index="1002">
                <span slot="title">My</span>
              </el-menu-item>
              <el-menu-item index="1003">
                <span slot="title">点播</span>
              </el-menu-item>
            </el-menu>
          </div>
          <div v-show="activeList == 1000">
            <div class="box-menu" v-for="(item, index) of kuwoBangMenu" :key="'kuwobang-' + index">
              <div class="title">{{item.name}}</div>
              <div class="cover-row">
                <div class="item" v-for="(ite, ind) of item.list" :key="'kuwolist-' + ind">
                  <div class="cover cover-hover">
                    <div class="cover-container">
                      <div class="shade">
                        <span class="play-button" @click="getMenuMusicList(ite.sourceid)">
                          <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" class="svg-icon">
                            <path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
                          </svg>
                        </span>
                      </div>
                      <img :src="ite.pic" alt="">
                    </div>
                  </div>
                  <div class="text">
                    <div class="title">{{ite.name}}-{{ite.pub}}</div>
                    <div class="info" :title="ite.intro">
                      <span>{{ite.intro}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="activeList == 1001">
            <div class="box-menu" v-for="(item, index) of netEaseBangMenu" :key="'netEasebang-' + index">
              <div class="title">{{item.name}}</div>
              <div class="cover-row">
                <div class="item" v-for="(ite, ind) of item.list" :key="'netEaselist-' + ind">
                  <div class="cover cover-hover">
                    <div class="cover-container">
                      <div class="shade">
                        <span class="play-button" @click="getListDetail(ite.id)">
                          <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" class="svg-icon">
                            <path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
                          </svg>
                        </span>
                      </div>
                      <img :src="ite.pic" alt="">
                    </div>
                  </div>
                  <div class="text">
                    <div class="title">{{ite.name}}-{{ite.pub}}</div>
                    <div class="info" :title="ite.intro">
                      <span>{{ite.intro}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="activeList == 1002">
            <span @click="changeUid" class="uid">
              <span v-if="netEaseUid == -1">点击这里输入Uid</span>
              <span v-else>Uid: {{netEaseUid}}</span>
            </span>
            <div class="box-menu" v-for="(item, index) of myMusicMenu" :key="'myMusic-' + index">
              <div class="title">{{item.name}}</div>
              <div class="cover-row">
                <div class="item" v-for="(ite, ind) of item.list" :key="'myMusiclist-' + ind">
                  <div class="cover cover-hover">
                    <div class="cover-container">
                      <div class="shade">
                        <span class="play-button" @click="getListDetail(ite.id)">
                          <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" class="svg-icon">
                            <path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
                          </svg>
                        </span>
                      </div>
                      <img :src="ite.pic" alt="">
                    </div>
                  </div>
                  <div class="text">
                    <div class="title">{{ite.name}}-{{ite.pub}}</div>
                    <div class="info" :title="ite.intro">
                      <span>{{ite.intro}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="activeList == 1003">
            <div class="box-menu">
              <el-input placeholder="请输入网易云歌单ID" style="width: 200px;margin-bottom: 20px;" v-model="netEaseLId" clearable>
              </el-input>
              <br>
              <el-button type="primary" @click="getListDetail(netEaseLId)">播放</el-button>
              <el-button type="warning" @click="collectMusicList" title="仅记录在这个浏览器上">收藏</el-button>
              <el-switch v-model="delCollectListMode" v-show="collectList[0].list && collectList[0].list.length > 0" active-text="删除" inactive-text="默认" active-color="#ffeb3b" inactive-color="#cccccc">
              </el-switch>
            </div>
            <div class="box-menu" v-for="(item, index) of collectList" :key="'collect-' + index">
              <div class="title" v-if="item.list.length > 0">{{item.name}}</div>
              <div class="cover-row">
                <div class="item" v-for="(ite, ind) of item.list" :key="'collectList-' + ind">
                  <div class="cover cover-hover">
                    <div class="cover-container">
                      <div class="shade">
                        <span class="play-button" @click="getListDetail(ite.id)" v-if="!delCollectListMode">
                          <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" class="svg-icon">
                            <path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
                          </svg>
                        </span>
                        <span class="play-button" @click="delCollectMusicList(ite.id)" v-if="delCollectListMode">
                          <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 352 512" class="svg-icon" style="color: red;">
                            <path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
                          </svg>
                        </span>
                      </div>
                      <img :src="ite.pic" alt="">
                    </div>
                  </div>
                  <div class="text">
                    <div class="title">{{ite.name}}-{{ite.pub}}</div>
                    <div class="info" :title="ite.intro">
                      <span>{{ite.intro}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <template v-if="deviceInfo.music_info">
      <div class="player">
        <div class="progress-bar">
          <el-slider :value="Math.round(deviceInfo.music_info.position / 1000)" :min="0" :max="Math.round(deviceInfo.music_info.duration / 1000)" :format-tooltip="typeMmss" @change="setPosition" @input="valueNow"></el-slider>
        </div>
        <div class="controls">
          <div class="playing">
            <div class="container" @click.stop>
              <img width="46" height="46" :src="songInfo.pic" />
              <div class="track-info">
                <div class="name" :title="songInfo.name">
                  {{songInfo.name}}
                </div>
                <div class="artist">
                  <span>{{songInfo.artist}}</span>
                </div>
              </div>
              <div class="like-button button-icon" v-show="showLike">
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 30 30" class="svg-icon" style="display:none;">
                  <path d="M15,26c-0.21,0-0.42-0.066-0.597-0.198C13.938,25.456,3,17.243,3,11c0-3.859,3.141-7,7-7c2.358,0,4.062,1.272,5,2.212 C15.938,5.272,17.642,4,20,4c3.859,0,7,3.14,7,7c0,6.243-10.938,14.456-11.403,14.803C15.42,25.934,15.21,26,15,26z" fill="currentColor" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 30 30" class="svg-icon">
                  <path d="M 9.5449219 3 C 5.3895807 3 2 6.3895806 2 10.544922 C 2 14.283156 4.9005496 18.084723 7.6601562 21.119141 C 10.419763 24.153558 13.171875 26.369141 13.171875 26.369141 A 1.0001 1.0001 0 0 0 13.197266 26.388672 C 13.517448 26.630481 13.956962 26.684854 14.369141 26.785156 A 1.0001 1.0001 0 0 0 15 27 A 1.0001 1.0001 0 0 0 15.630859 26.785156 C 16.043038 26.684854 16.482552 26.630481 16.802734 26.388672 A 1.0001 1.0001 0 0 0 16.828125 26.369141 C 16.828125 26.369141 19.580237 24.153558 22.339844 21.119141 C 25.099451 18.084722 28 14.283156 28 10.544922 C 28 6.3895806 24.610419 3 20.455078 3 C 17.450232 3 15.833405 4.5910542 15 5.5664062 C 14.166595 4.5910543 12.549768 3 9.5449219 3 z M 9.5449219 5 C 12.372924 5 14.069642 7.4290597 14.126953 7.5117188 A 1.0001 1.0001 0 0 0 14.910156 8.0078125 A 1.0001 1.0001 0 0 0 15.003906 8.0117188 A 1.0001 1.0001 0 0 0 15.019531 8.0117188 A 1.0001 1.0001 0 0 0 15.042969 8.0097656 A 1.0001 1.0001 0 0 0 15.119141 8.0039062 A 1.0001 1.0001 0 0 0 15.871094 7.5136719 C 15.925786 7.4347249 17.624838 5 20.455078 5 C 23.529737 5 26 7.4702629 26 10.544922 C 26 13.147688 23.499768 16.870104 20.859375 19.773438 C 18.227966 22.666891 15.607768 24.780451 15.589844 24.794922 C 15.414236 24.925626 15.219097 25 15 25 C 14.780903 25 14.585764 24.925626 14.410156 24.794922 C 14.392232 24.780451 11.772034 22.66689 9.140625 19.773438 C 6.5002316 16.870105 4 13.147688 4 10.544922 C 4 7.4702629 6.470263 5 9.5449219 5 z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div class="blank"></div>
          </div>
          <div class="middle-control-buttons">
            <div class="blank"></div>
            <div class="container" @click.stop>
              <span class="button-icon" title="上一首" @click="prev()">
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" class="svg-icon">
                  <path fill="currentColor" d="M64 468V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v176.4l195.5-181C352.1 22.3 384 36.6 384 64v384c0 27.4-31.9 41.7-52.5 24.6L136 292.7V468c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12z" />
                </svg>
              </span>
              <span class="button-icon play" :title="isPlay ? '暂停' : '播放'" @click="isPlay ? pause() : play()">
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" class="svg-icon" v-if="!isPlay">
                  <path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" class="svg-icon" v-else>
                  <path fill="currentColor" d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z" />
                </svg>
              </span>
              <span class="button-icon" title="下一首" @click="next()">
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" class="svg-icon">
                  <path fill="currentColor" d="M384 44v424c0 6.6-5.4 12-12 12h-48c-6.6 0-12-5.4-12-12V291.6l-195.5 181C95.9 489.7 64 475.4 64 448V64c0-27.4 31.9-41.7 52.5-24.6L312 219.3V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12z" />
                </svg>
              </span>
            </div>
            <div class="blank"></div>
          </div>
          <div class="right-control-buttons">
            <div class="blank"></div>
            <div class="container" @click.stop>
              <span class="button-icon" title="播放列表" @click="nextTracksPage = !nextTracksPage" :class="{'active': nextTracksPage}">
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512" class="svg-icon">
                  <path fill="currentColor" d="M16 256h256a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm0-128h256a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16H16A16 16 0 0 0 0 80v32a16 16 0 0 0 16 16zm128 192H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM470.94 1.33l-96.53 28.51A32 32 0 0 0 352 60.34V360a148.76 148.76 0 0 0-48-8c-61.86 0-112 35.82-112 80s50.14 80 112 80 112-35.82 112-80V148.15l73-21.39a32 32 0 0 0 23-30.71V32a32 32 0 0 0-41.06-30.67z" />
                </svg>
              </span>
              <!-- 1: 随机;2: 顺序;3: 单曲 -->
              <span class="button-icon active" @click="setPlayMode()" :title="playModes[deviceInfo.play_mode - 1]">
                <!-- 随机播放 -->
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512" class="svg-icon" v-show="deviceInfo.play_mode == 1">
                  <path fill="currentColor" d="M504.971 359.029c9.373 9.373 9.373 24.569 0 33.941l-80 79.984c-15.01 15.01-40.971 4.49-40.971-16.971V416h-58.785a12.004 12.004 0 0 1-8.773-3.812l-70.556-75.596 53.333-57.143L352 336h32v-39.981c0-21.438 25.943-31.998 40.971-16.971l80 79.981zM12 176h84l52.781 56.551 53.333-57.143-70.556-75.596A11.999 11.999 0 0 0 122.785 96H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12zm372 0v39.984c0 21.46 25.961 31.98 40.971 16.971l80-79.984c9.373-9.373 9.373-24.569 0-33.941l-80-79.981C409.943 24.021 384 34.582 384 56.019V96h-58.785a12.004 12.004 0 0 0-8.773 3.812L96 336H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h110.785c3.326 0 6.503-1.381 8.773-3.812L352 176h32z" />
                </svg>
                <!-- repeat  顺序播放-->
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512" class="svg-icon" v-show="deviceInfo.play_mode == 2">
                  <path fill="currentColor" d="M512 256c0 88.224-71.775 160-160 160H170.067l34.512 32.419c9.875 9.276 10.119 24.883.539 34.464l-10.775 10.775c-9.373 9.372-24.568 9.372-33.941 0l-92.686-92.686c-9.373-9.373-9.373-24.568 0-33.941l92.686-92.686c9.373-9.373 24.568-9.373 33.941 0l10.775 10.775c9.581 9.581 9.337 25.187-.539 34.464L170.067 352H352c52.935 0 96-43.065 96-96 0-13.958-2.996-27.228-8.376-39.204-4.061-9.039-2.284-19.626 4.723-26.633l12.183-12.183c11.499-11.499 30.965-8.526 38.312 5.982C505.814 205.624 512 230.103 512 256zM72.376 295.204C66.996 283.228 64 269.958 64 256c0-52.935 43.065-96 96-96h181.933l-34.512 32.419c-9.875 9.276-10.119 24.883-.539 34.464l10.775 10.775c9.373 9.372 24.568 9.372 33.941 0l92.686-92.686c9.373-9.373 9.373-24.568 0-33.941l-92.686-92.686c-9.373-9.373-24.568-9.373-33.941 0L306.882 29.12c-9.581 9.581-9.337 25.187.539 34.464L341.933 96H160C71.775 96 0 167.776 0 256c0 25.897 6.186 50.376 17.157 72.039 7.347 14.508 26.813 17.481 38.312 5.982l12.183-12.183c7.008-7.008 8.786-17.595 4.724-26.634z" />
                </svg>
                <!-- repeat1 单曲循环-->
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512" class="svg-icon" v-show="deviceInfo.play_mode == 3">
                  <path fill="currentColor" d="M512 256c0 88.224-71.775 160-160 160H170.067l34.512 32.419c9.875 9.276 10.119 24.883.539 34.464l-10.775 10.775c-9.373 9.372-24.568 9.372-33.941 0l-92.686-92.686c-9.373-9.373-9.373-24.568 0-33.941l80.269-80.27c9.373-9.373 24.568-9.373 33.941 0l10.775 10.775c9.581 9.581 9.337 25.187-.539 34.464l-22.095 20H352c52.935 0 96-43.065 96-96 0-13.958-2.996-27.228-8.376-39.204-4.061-9.039-2.284-19.626 4.723-26.633l12.183-12.183c11.499-11.499 30.965-8.526 38.312 5.982C505.814 205.624 512 230.103 512 256zM72.376 295.204C66.996 283.228 64 269.958 64 256c0-52.935 43.065-96 96-96h181.933l-22.095 20.002c-9.875 9.276-10.119 24.883-.539 34.464l10.775 10.775c9.373 9.372 24.568 9.372 33.941 0l80.269-80.27c9.373-9.373 9.373-24.568 0-33.941l-92.686-92.686c-9.373-9.373-24.568-9.373-33.941 0l-10.775 10.775c-9.581 9.581-9.337 25.187.539 34.464L341.933 96H160C71.775 96 0 167.776 0 256c0 25.897 6.186 50.376 17.157 72.039 7.347 14.508 26.813 17.481 38.312 5.982l12.183-12.183c7.008-7.008 8.786-17.595 4.724-26.634zm154.887 4.323c0-7.477 3.917-11.572 11.573-11.572h15.131v-39.878c0-5.163.534-10.503.534-10.503h-.356s-1.779 2.67-2.848 3.738c-4.451 4.273-10.504 4.451-15.666-1.068l-5.518-6.231c-5.342-5.341-4.984-11.216.534-16.379l21.72-19.939c4.449-4.095 8.366-5.697 14.42-5.697h12.105c7.656 0 11.749 3.916 11.749 11.572v84.384h15.488c7.655 0 11.572 4.094 11.572 11.572v8.901c0 7.477-3.917 11.572-11.572 11.572h-67.293c-7.656 0-11.573-4.095-11.573-11.572v-8.9z" />
                </svg>
              </span>
              <div class="volume-control">
                <span class="button-icon" title="静音" @click="mute">
                  <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 480 512" class="svg-icon" v-if="volume >= 8">
                    <path fill="currentColor" d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.53 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512" class="svg-icon" v-else-if="volume == 0">
                    <path fill="currentColor" d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM461.64 256l45.64-45.64c6.3-6.3 6.3-16.52 0-22.82l-22.82-22.82c-6.3-6.3-16.52-6.3-22.82 0L416 210.36l-45.64-45.64c-6.3-6.3-16.52-6.3-22.82 0l-22.82 22.82c-6.3 6.3-6.3 16.52 0 22.82L370.36 256l-45.63 45.63c-6.3 6.3-6.3 16.52 0 22.82l22.82 22.82c6.3 6.3 16.52 6.3 22.82 0L416 301.64l45.64 45.64c6.3 6.3 16.52 6.3 22.82 0l22.82-22.82c6.3-6.3 6.3-16.52 0-22.82L461.64 256z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 384 512" class="svg-icon" v-else>
                    <path fill="currentColor" d="M215.03 72.04L126.06 161H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V89.02c0-21.47-25.96-31.98-40.97-16.98zm123.2 108.08c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 229.28 336 242.62 336 257c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.87z" />
                  </svg>
                </span>
                <div class="progress-bar">
                  <el-slider v-model="deviceInfo.vol" :min="0" :max="15" @change="setVolume"></el-slider>
                </div>
              </div>
              <span class="button-icon" style="margin-left: 12px;" title="歌词" @click="lyricsPage = true">
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 32 32" class="svg-icon">
                  <path fill="currentColor" d="M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0  l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="next-tracks" v-if="nextTracksPage">
        <h1>播放列表</h1>
        <div class="track-list" style="overflow-y: scroll; height: calc(100vh - 160px);" @dblclick="playMusic($event)">
          <div class="track playlist" :class="{'playing': list.playIndex == index}" v-for="(item, index) of list.playList" :key="index" :data-index="index" :ref="'playList' + index">
            <img src="https://p1.music.126.net/wbzKSBWVKin9aKRNMdAhdw==/109951166049251837.jpg?param=224y224" />
            <div class="title-and-artist">
              <div class="container">
                <div class="title">{{index + 1}} : {{item.title}} </div>
                <div class="artist">
                  <span class="artist-in-line">
                    {{item.artist}}
                  </span>
                </div>
              </div>
            </div>
            <div class="album">
              专辑 - {{item.album}}
            </div>
            <div class="actions" v-show="showLike">
              <span class="button-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 30 30" class="svg-icon" style="display:none;">
                  <path d="M15,26c-0.21,0-0.42-0.066-0.597-0.198C13.938,25.456,3,17.243,3,11c0-3.859,3.141-7,7-7c2.358,0,4.062,1.272,5,2.212 C15.938,5.272,17.642,4,20,4c3.859,0,7,3.14,7,7c0,6.243-10.938,14.456-11.403,14.803C15.42,25.934,15.21,26,15,26z" fill="currentColor" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 30 30" class="svg-icon">
                  <path d="M 9.5449219 3 C 5.3895807 3 2 6.3895806 2 10.544922 C 2 14.283156 4.9005496 18.084723 7.6601562 21.119141 C 10.419763 24.153558 13.171875 26.369141 13.171875 26.369141 A 1.0001 1.0001 0 0 0 13.197266 26.388672 C 13.517448 26.630481 13.956962 26.684854 14.369141 26.785156 A 1.0001 1.0001 0 0 0 15 27 A 1.0001 1.0001 0 0 0 15.630859 26.785156 C 16.043038 26.684854 16.482552 26.630481 16.802734 26.388672 A 1.0001 1.0001 0 0 0 16.828125 26.369141 C 16.828125 26.369141 19.580237 24.153558 22.339844 21.119141 C 25.099451 18.084722 28 14.283156 28 10.544922 C 28 6.3895806 24.610419 3 20.455078 3 C 17.450232 3 15.833405 4.5910542 15 5.5664062 C 14.166595 4.5910543 12.549768 3 9.5449219 3 z M 9.5449219 5 C 12.372924 5 14.069642 7.4290597 14.126953 7.5117188 A 1.0001 1.0001 0 0 0 14.910156 8.0078125 A 1.0001 1.0001 0 0 0 15.003906 8.0117188 A 1.0001 1.0001 0 0 0 15.019531 8.0117188 A 1.0001 1.0001 0 0 0 15.042969 8.0097656 A 1.0001 1.0001 0 0 0 15.119141 8.0039062 A 1.0001 1.0001 0 0 0 15.871094 7.5136719 C 15.925786 7.4347249 17.624838 5 20.455078 5 C 23.529737 5 26 7.4702629 26 10.544922 C 26 13.147688 23.499768 16.870104 20.859375 19.773438 C 18.227966 22.666891 15.607768 24.780451 15.589844 24.794922 C 15.414236 24.925626 15.219097 25 15 25 C 14.780903 25 14.585764 24.925626 14.410156 24.794922 C 14.392232 24.780451 11.772034 22.66689 9.140625 19.773438 C 6.5002316 16.870105 4 13.147688 4 10.544922 C 4 7.4702629 6.470263 5 9.5449219 5 z" fill="currentColor" />
                </svg>
              </span>
            </div>
            <div class="time" title="都没有数据怎么弄？">未知</div>
          </div>
        </div>
      </div>
      <transition name="slide-up">
        <div class="lyrics-page" data-theme="dark" :class="{ 'no-lyric': noLyric }" v-if="lyricsPage">
          <div class="lyrics-background dynamic-background">
            <div class="top-right" v-show="showLyrics" :style="{ backgroundImage: 'url(' + songInfo.pic + ')' }"></div>
            <div class="bottom-left" v-show="showLyrics" :style="{ backgroundImage: 'url(' + songInfo.pic + ')' }"></div>
          </div>
          <div class="left-side">
            <div>
              <div class="cover">
                <div class="cover-container">
                  <img :src="songInfo.pic" />
                  <div class="shadow" :style="{ backgroundImage: 'url(' + songInfo.pic + ')' }"></div>
                </div>
              </div>
              <div class="controls">
                <div class="top-part">
                  <div class="track-info">
                    <div class="title" :title="songInfo.name">
                      <span>{{songInfo.name}}</span>
                    </div>
                    <div class="subtitle">
                      <span>{{songInfo.artist}} {{songInfo.album ? '-' : ''}} {{songInfo.album}}</span>
                    </div>
                  </div>
                  <div class="buttons">
                    <div class="like-button button-icon" v-show="showLike">
                      <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 30 30" class="svg-icon" style="display:none;">
                        <path d="M15,26c-0.21,0-0.42-0.066-0.597-0.198C13.938,25.456,3,17.243,3,11c0-3.859,3.141-7,7-7c2.358,0,4.062,1.272,5,2.212 C15.938,5.272,17.642,4,20,4c3.859,0,7,3.14,7,7c0,6.243-10.938,14.456-11.403,14.803C15.42,25.934,15.21,26,15,26z" fill="currentColor" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 30 30" class="svg-icon">
                        <path d="M 9.5449219 3 C 5.3895807 3 2 6.3895806 2 10.544922 C 2 14.283156 4.9005496 18.084723 7.6601562 21.119141 C 10.419763 24.153558 13.171875 26.369141 13.171875 26.369141 A 1.0001 1.0001 0 0 0 13.197266 26.388672 C 13.517448 26.630481 13.956962 26.684854 14.369141 26.785156 A 1.0001 1.0001 0 0 0 15 27 A 1.0001 1.0001 0 0 0 15.630859 26.785156 C 16.043038 26.684854 16.482552 26.630481 16.802734 26.388672 A 1.0001 1.0001 0 0 0 16.828125 26.369141 C 16.828125 26.369141 19.580237 24.153558 22.339844 21.119141 C 25.099451 18.084722 28 14.283156 28 10.544922 C 28 6.3895806 24.610419 3 20.455078 3 C 17.450232 3 15.833405 4.5910542 15 5.5664062 C 14.166595 4.5910543 12.549768 3 9.5449219 3 z M 9.5449219 5 C 12.372924 5 14.069642 7.4290597 14.126953 7.5117188 A 1.0001 1.0001 0 0 0 14.910156 8.0078125 A 1.0001 1.0001 0 0 0 15.003906 8.0117188 A 1.0001 1.0001 0 0 0 15.019531 8.0117188 A 1.0001 1.0001 0 0 0 15.042969 8.0097656 A 1.0001 1.0001 0 0 0 15.119141 8.0039062 A 1.0001 1.0001 0 0 0 15.871094 7.5136719 C 15.925786 7.4347249 17.624838 5 20.455078 5 C 23.529737 5 26 7.4702629 26 10.544922 C 26 13.147688 23.499768 16.870104 20.859375 19.773438 C 18.227966 22.666891 15.607768 24.780451 15.589844 24.794922 C 15.414236 24.925626 15.219097 25 15 25 C 14.780903 25 14.585764 24.925626 14.410156 24.794922 C 14.392232 24.780451 11.772034 22.66689 9.140625 19.773438 C 6.5002316 16.870105 4 13.147688 4 10.544922 C 4 7.4702629 6.470263 5 9.5449219 5 z" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="progress-bar">
                  <span>{{typeMmss(Math.round(deviceInfo.music_info.position / 1000))}}</span>
                  <el-slider :value="Math.round(deviceInfo.music_info.position / 1000)" :min="0" :max="Math.round(deviceInfo.music_info.duration / 1000)" :show-tooltip="false" @change="setPosition"></el-slider>
                  <span>{{typeMmss(Math.round(deviceInfo.music_info.duration / 1000))}}</span>
                </div>
                <div class="media-controls">
                  <div class="middle">
                    <span class="button-icon" title="上一首" @click="prev()">
                      <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" class="svg-icon">
                        <path fill="currentColor" d="M64 468V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v176.4l195.5-181C352.1 22.3 384 36.6 384 64v384c0 27.4-31.9 41.7-52.5 24.6L136 292.7V468c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12z" />
                      </svg>
                    </span>
                    <span class="button-icon play" :title="isPlay ? '暂停' : '播放'" @click="isPlay ? pause() : play()">
                      <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" class="svg-icon" v-if="!isPlay">
                        <path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" class="svg-icon" v-else>
                        <path fill="currentColor" d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z" />
                      </svg>
                    </span>
                    <span class="button-icon" title="下一首" @click="next()">
                      <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" class="svg-icon">
                        <path fill="currentColor" d="M384 44v424c0 6.6-5.4 12-12 12h-48c-6.6 0-12-5.4-12-12V291.6l-195.5 181C95.9 489.7 64 475.4 64 448V64c0-27.4 31.9-41.7 52.5-24.6L312 219.3V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12z" />
                      </svg>
                    </span>
                  </div>
                  <span class="button-icon active" @click="setPlayMode()" :title="playModes[deviceInfo.play_mode - 1]">
                    <!-- 随机播放 -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512" class="svg-icon" v-show="deviceInfo.play_mode == 1">
                      <path fill="currentColor" d="M504.971 359.029c9.373 9.373 9.373 24.569 0 33.941l-80 79.984c-15.01 15.01-40.971 4.49-40.971-16.971V416h-58.785a12.004 12.004 0 0 1-8.773-3.812l-70.556-75.596 53.333-57.143L352 336h32v-39.981c0-21.438 25.943-31.998 40.971-16.971l80 79.981zM12 176h84l52.781 56.551 53.333-57.143-70.556-75.596A11.999 11.999 0 0 0 122.785 96H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12zm372 0v39.984c0 21.46 25.961 31.98 40.971 16.971l80-79.984c9.373-9.373 9.373-24.569 0-33.941l-80-79.981C409.943 24.021 384 34.582 384 56.019V96h-58.785a12.004 12.004 0 0 0-8.773 3.812L96 336H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h110.785c3.326 0 6.503-1.381 8.773-3.812L352 176h32z" />
                    </svg>
                    <!-- repeat 顺序播放 -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512" class="svg-icon" v-show="deviceInfo.play_mode == 2">
                      <path fill="currentColor" d="M512 256c0 88.224-71.775 160-160 160H170.067l34.512 32.419c9.875 9.276 10.119 24.883.539 34.464l-10.775 10.775c-9.373 9.372-24.568 9.372-33.941 0l-92.686-92.686c-9.373-9.373-9.373-24.568 0-33.941l92.686-92.686c9.373-9.373 24.568-9.373 33.941 0l10.775 10.775c9.581 9.581 9.337 25.187-.539 34.464L170.067 352H352c52.935 0 96-43.065 96-96 0-13.958-2.996-27.228-8.376-39.204-4.061-9.039-2.284-19.626 4.723-26.633l12.183-12.183c11.499-11.499 30.965-8.526 38.312 5.982C505.814 205.624 512 230.103 512 256zM72.376 295.204C66.996 283.228 64 269.958 64 256c0-52.935 43.065-96 96-96h181.933l-34.512 32.419c-9.875 9.276-10.119 24.883-.539 34.464l10.775 10.775c9.373 9.372 24.568 9.372 33.941 0l92.686-92.686c9.373-9.373 9.373-24.568 0-33.941l-92.686-92.686c-9.373-9.373-24.568-9.373-33.941 0L306.882 29.12c-9.581 9.581-9.337 25.187.539 34.464L341.933 96H160C71.775 96 0 167.776 0 256c0 25.897 6.186 50.376 17.157 72.039 7.347 14.508 26.813 17.481 38.312 5.982l12.183-12.183c7.008-7.008 8.786-17.595 4.724-26.634z" />
                    </svg>
                    <!-- repeat1 单曲循环-->
                    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512" class="svg-icon" v-show="deviceInfo.play_mode == 3">
                      <path fill="currentColor" d="M512 256c0 88.224-71.775 160-160 160H170.067l34.512 32.419c9.875 9.276 10.119 24.883.539 34.464l-10.775 10.775c-9.373 9.372-24.568 9.372-33.941 0l-92.686-92.686c-9.373-9.373-9.373-24.568 0-33.941l80.269-80.27c9.373-9.373 24.568-9.373 33.941 0l10.775 10.775c9.581 9.581 9.337 25.187-.539 34.464l-22.095 20H352c52.935 0 96-43.065 96-96 0-13.958-2.996-27.228-8.376-39.204-4.061-9.039-2.284-19.626 4.723-26.633l12.183-12.183c11.499-11.499 30.965-8.526 38.312 5.982C505.814 205.624 512 230.103 512 256zM72.376 295.204C66.996 283.228 64 269.958 64 256c0-52.935 43.065-96 96-96h181.933l-22.095 20.002c-9.875 9.276-10.119 24.883-.539 34.464l10.775 10.775c9.373 9.372 24.568 9.372 33.941 0l80.269-80.27c9.373-9.373 9.373-24.568 0-33.941l-92.686-92.686c-9.373-9.373-24.568-9.373-33.941 0l-10.775 10.775c-9.581 9.581-9.337 25.187.539 34.464L341.933 96H160C71.775 96 0 167.776 0 256c0 25.897 6.186 50.376 17.157 72.039 7.347 14.508 26.813 17.481 38.312 5.982l12.183-12.183c7.008-7.008 8.786-17.595 4.724-26.634zm154.887 4.323c0-7.477 3.917-11.572 11.573-11.572h15.131v-39.878c0-5.163.534-10.503.534-10.503h-.356s-1.779 2.67-2.848 3.738c-4.451 4.273-10.504 4.451-15.666-1.068l-5.518-6.231c-5.342-5.341-4.984-11.216.534-16.379l21.72-19.939c4.449-4.095 8.366-5.697 14.42-5.697h12.105c7.656 0 11.749 3.916 11.749 11.572v84.384h15.488c7.655 0 11.572 4.094 11.572 11.572v8.901c0 7.477-3.917 11.572-11.572 11.572h-67.293c-7.656 0-11.573-4.095-11.573-11.572v-8.9z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="right-side">
            <div class="lyrics-container lyric-font-size" v-show="!noLyric">
              <div id="line-1" class="line"></div>
              <div v-for="(line, index) in lyricWithTranslation" :id="'line'+ index" :key="index" class="line" :class="{highlight: highlightLyricIndex === index}">
                <span v-html="formatLine(line)"></span>
              </div>
            </div>
          </div>
          <div class="close-button" @click="lyricsPage = false">
            <span class="button-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 32 32" class="svg-icon w">
                <path fill="currentColor" d="M14.77,23.795L5.185,14.21c-0.879-0.879-0.879-2.317,0-3.195l0.8-0.801c0.877-0.878,2.316-0.878,3.194,0  l7.315,7.315l7.316-7.315c0.878-0.878,2.317-0.878,3.194,0l0.8,0.801c0.879,0.878,0.879,2.316,0,3.195l-9.587,9.585  c-0.471,0.472-1.104,0.682-1.723,0.647C15.875,24.477,15.243,24.267,14.77,23.795z" />
              </svg>
            </span>
          </div>
        </div>
      </transition>
    </template>
  </div>


      `
    let vueBox = document.createElement('div');
    vueBox.innerHTML = string
    getEl('body')[0].appendChild(vueBox);
    newVue()
  }

  function newVue () {
    new Vue({
      el: '#app',
      data: function () {
        return {
          Socket: null,
          drawer: false,
          activeMenu: -1,
          activeList: 1000,
          showMain: false,
          setIntervalWesocketPush: null,
          getSocketData: null,
          deviceInfo: { //设置信息
            device_state: 0, // 蓝牙打开：3，
            device_udid: "",
            music_light_chroma: 0,
            music_light_enable: false,
            music_light_luma: 0,
            music_light_mode: 0,
            music_source: "kuwo",
            music_info: null
              /* {
              artist: "",
              duration: 0,
              id: "",
              itemtype: 0,
              position: 0,
              state: 0,
              timestamp: "",
              title: "",
              }
              */
              ,
            play_mode: 1,
            play_state: false,
            play_type: 0,
            ttsModelType: "SWEET",
            u_ver: 1000,
            ver: 1822,
            vol: 2,
          },
          soundEffect: { // 音效
            loudness: { //响度
              Current_Gain: 0,
              Loudness_Enable: false,
              sound_effects_loudness_enable: false
            },
            bass: { //低音增强
              Current_Strength: 0,
              Bass_Enable: false,
              sound_effects_bass_enable: false
            },
            eq: { //音效调节
              Current_Preset: 0,
              Eq_Enable: false,
              sound_effects_eq_enable: false,
              Bands: {
                list: [
                  { Band: 0, BandLevel: 300, Frequency: 60000 },
                  { Band: 1, BandLevel: 0, Frequency: 230000 },
                  { Band: 2, BandLevel: 0, Frequency: 910000 },
                  { Band: 3, BandLevel: 0, Frequency: 3600000 },
                  { Band: 4, BandLevel: 300, Frequency: 14000000 }
                ],
                maxBandLevel: 1500,
                minBandLevel: -1500
              },
              Preset_list: [
                { Preset: 0, Name: "Normal" },
                { Preset: 1, Name: "Classical" },
                { Preset: 2, Name: "Dance" },
                { Preset: 3, Name: "Flat" },
                { Preset: 4, Name: "Folk" },
                { Preset: 5, Name: "Heavy Metal" },
                { Preset: 6, Name: "Hip Hop" },
                { Preset: 7, Name: "Jazz" },
                { Preset: 8, Name: "Pop" },
                { Preset: 9, Name: "Rock" }
              ]
            }
          },
          eqBandListName: ["低频", "中低", "中频", "中高", "高频"],
          eqPresetListName: {
            "Normal": "普通",
            "Classical": "古典",
            "Dance": "舞曲",
            "Flat": "原声",
            "Folk": "民谣",
            "Heavy Metal": "重金属",
            "Hip Hop": "嘻哈",
            "Jazz": "爵士",
            "Pop": "流行",
            "Rock": "摇滚"
          },
          myEqMode: [{
            Name: '电音',
            BandList: [
              { Band: 0, BandLevel: 900 },
              { Band: 1, BandLevel: 1300 },
              { Band: 2, BandLevel: 1100 },
              { Band: 3, BandLevel: 900 },
              { Band: 4, BandLevel: 1400 }
            ]
          }],
          myEqMode2: [],
          eqModeName: '',
          loading: false,
          //氛围效果
          musicLightModes: ['切换官方氛围效果', '切换七彩旋转效果', '切换七彩氛围效果', '切换七彩旋转效果1'],
          screen: null,
          screencap: '',
          reader: null,
          img: null,
          startx: -1,
          starty: -1,
          dialogVisible: false,
          restartdialogVisible: false, //重启软件界面是否显示
          listPackages: [],
          listPackagesIndex: 'com.phicomm.speaker.device',
          shellVisible: false,
          shellStr: '',
          isDelEqMode: false, //是否为删除音效模式状态
          systemInfo: {
            MemTotal: 0,
            MemFree: 0,
            Buffers: 0,
            Cached: 0,
            SwapCached: 0,
            Active: 0,
            Inactive: 0,
            "Active(anon)": 0,
            "Inactive(anon)": 0,
            "Active(file)": 0,
            "Inactive(file)": 0,
            Unevictable: 0,
            Mlocked: 0,
            HighTotal: 0,
            HighFree: 0,
            LowTotal: 0,
            LowFree: 0,
            SwapTotal: 0,
            SwapFree: 0,
            Dirty: 0,
            Writeback: 0,
            AnonPages: 0,
            Mapped: 0,
            Shmem: 0,
            Slab: 0,
            SReclaimable: 0,
            SUnreclaim: 0,
            KernelStack: 0,
            PageTables: 0,
            NFS_Unstable: 0,
            Bounce: 0,
            WritebackTmp: 0,
            CommitLimit: 0,
            Committed_AS: 0,
            VmallocTotal: 0,
            VmallocUsed: 0,
            VmallocChunk: 0,
            cpu: '',
            cpu0: '',
            cpu1: '',
            cpu2: '',
            cpu3: '',
            intr: '',
            ctxt: '',
            btime: '',
            processes: '',
            procs_running: '',
            procs_blocked: '',
            softirq: '',
            incremental: 0,
          },
          cpuInfo: { //记录上一次获取的的cpu信息
            cpu: '',
            cpu0: '',
            cpu1: '',
            cpu2: '',
            cpu3: '',
          },
          timerCpu: null,
          playModes: ['随机播放', '顺序播放', '单曲循环'],
          list: {
            playIndex: 0,
            playMode: 0,
            playState: 0,
            playList: [
              /*
              {
                album: "", 专辑
                artist: "", 歌手
                itemId: "",
                itemType: 0,
                title: "", 歌名
                url: "" 歌曲mp3地址
              }
              */
            ]
          },
          songInfo: {
            /*
            artist: "郑鱼"
            id: "MUSIC_180216407"
            link: "http://www.kuwo.cn/yinyue/180216407"
            lrc: "[00:02.29]怎叹 - 郑鱼\r\n[00:04.58]词：Listen Dream\r\n[00:06.87]"
            name: "怎叹"
            pic: "http://img2.kuwo.cn/star/albumcover/500/16/9/3784544836.jpg"
            */
          },
          showLyrics: true,
          nextTracksPage: false,
          lyricsPage: false,
          noLyric: false,
          lyricsInterval: null,
          tlyric: [],
          highlightLyricIndex: -1,
          showLike: false,
          theme: 'light',
          kuwoBangMenu: [
            /*
          {
            name: '官方榜',
            list: [
            {
              id: 489929,
              intro: '酷我用户每天播放线上歌曲的飙升指数TOP排行榜，为你展示流行趋势、蹿红歌曲，每天更新',
              name: '酷我飙升榜',
              pic: 'https://img3.kuwo.cn/star/upload/2/0/1625697693.png',
              pub: '今日更新',
              source: 2,
              sourceid: 93,
            }
            */
          ],
          netEaseBangMenu: [],
          myMusicMenu: [],
          netEaseUid: -1, // 网易云 home id
          netEaseLId: null, // 网易云点播的歌单id
          currentMusicProgress: 0, //进度条变化记录
          cmp: 0, // 音乐进度条拖动/点击到的进度位置
          collectList: [{ // 收藏的网易云歌单
            name: '本地收藏歌单',
            list: []
          }],
          delCollectListMode: false, //删除收藏模式
        }
      },
      mounted () {
        this.initSocket();
        this.screenInit()
        this.updateEqMode()
        this.setPageTitle(defaultTitle)
        this.theme = localStorage.getItem('theme') || 'light'
        this.netEaseUid = localStorage.getItem('netEaseUid') || -1
        this.collectList = JSON.parse(localStorage.getItem('collectList')) || this.collectList
      },
      destroyed () {
        //移除监听器
        window.removeEventListener('onmessageWS', this.getSocketData);
      },
      methods: {
        handleChangeMenu (index) {
          this.drawer = false
          if (index == 100) {
            this.toggleTheme()
            return
          }

          this.nextTracksPage = false
          this.lyricsPage = false
          if (index == 0) {
            this.showMain = false
            return
          }
          this.showMain = true
          this.activeMenu = index
          this.stopScreen()
          clearInterval(this.timerCpu)
          if (index == 1) { // 1为屏幕控制
            this.startScreen()
          } else if (index == 2) { //2为音效控制
            this.soundEffectInit()
          } else if (index == 4) { //4系统信息
            this.getSystemInfo()
            this.timerCpu = setInterval(e => {
              this.getSystemInfo()
            }, 3000)
          } else if (index == 5) {
            this.getKuwoBangMenu()
          }
        },
        handleChangeList (index) {
          this.activeList = index
          if (index == 1001) {
            this.getNetEaseBangMenu()
          } else if (index == 1002) {
            this.getMyMusicMenu()
          }
        },
        setPageTitle (str) {
          document.title = str
        },
        initSocket () {
          this.createSocket()
          // 创建接收消息函数
          this.getSocketData = e => {
            const data = e && e.detail.data
            if ((typeof data) == 'string') {
              let jData = JSON.parse(data)
              if (jData.code != 200) {
                // console.log('code : ' + jData.code)
                console.log(jData)
                return;
              } else if (jData.type == 'get_info') {
                //更新设备信息
                this.deviceInfo = JSON.parse(jData.data)
              } else if (jData.type == 'get_eq_config') {
                this.soundEffect = JSON.parse(jData.data)
              } else if (jData.type == 'send_message') {

              } else if (jData.type == 'stop_screencap' || jData.type == 'start_screencap') {

              } else if (jData.type == 'input') {

              } else if (jData.type == 'shell' && jData.type_id == 'query') {
                this.setSystemInfo(jData.data)
              } else if (jData.type == 'shell' && jData.type_id == 'packages') {
                this.setListPackages(jData.data)
              } else if (jData.type == 'shell' && jData.type_id == 'myshell') {
                let time = new Date().Format('hh:mm:ss')
                console.group('shell执行结果' + time)
                console.dir(jData)
                console.log('%c data : \n ' + jData.data + ' ', 'background:#000;color:#fff')
                console.groupEnd('shell执行结果' + time)

              } else if (jData.type == 'list') {
                this.list = JSON.parse(jData.data)
              }
              else {
                // console.log(jData)
                // console.log(JSON.parse(jData.data))
              }
            } else if ((typeof data) == 'object') {
              this.updateScreencap(data)
            } else {
              // console.log(data)
            }
          }
          //注册监听事件
          window.addEventListener('onmessageWS', this.getSocketData)
        },
        createSocket () {
          this.Socket && this.Socket.close()
          if (!this.Socket) {
            console.log('建立websocket连接')
            this.Socket = new WebSocket('ws://' + hostname + ':' + port);
            //发送心跳
            this.Socket.onopen = this.onopenWS
            //接收消息
            this.Socket.onmessage = this.onmessageWS
            //连接失败重连
            this.Socket.onerror = this.onerrorWS
            //断开重连
            this.Socket.onclose = this.oncloseWS
          } else {
            console.log('websocket已连接')
          }
        },
        onopenWS (e) {
          // 发送心跳
          clearInterval(this.setIntervalWesocketPush)
          let data = null
          data = JSON.stringify(apis()['info'])
          this.Socket.send(data);
          this.setIntervalWesocketPush = setInterval(() => {
            this.Socket.send(data);
          }, 950)
        },
        onmessageWS (e) {
          window.dispatchEvent(new CustomEvent('onmessageWS', {
            detail: {
              data: e.data
            }
          }))
        },
        // 断开重连
        onerrorWS (e) {
          this.Socket.close()
          clearInterval(this.setIntervalWesocketPush)
          console.log(' ,连接失败重连中')
          if (this.Socket.readyState !== 3) {
            this.Socket = null
            this.createSocket()
          }
        },
        oncloseWS (e) {
          console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
          clearInterval(this.setIntervalWesocketPush)
          console.log('websocket已断开....正在尝试重连')
          if (this.Socket.readyState !== 2) {
            this.Socket = null
            this.createSocket()
          }
        },
        //发送数据但连接未建立时进行处理等待重发
        //message 需要发送的数据
        connecting (message) {
          let timeout = setTimeout(() => {
            if (this.Socket.readyState === 0) {
              this.connecting(message)
            } else {
              this.Socket.send(JSON.stringify(message))
            }
            clearTimeout(timeout)
          }, 1000)
        },
        sendWSPush (message) {
          if (this.Socket !== null && this.Socket.readyState === 3) {
            this.Socket.close()
            this.createSocket()
          } else if (this.Socket.readyState === 1) {
            this.Socket.send(JSON.stringify(message))
          } else if (this.Socket.readyState === 0) {
            this.connecting(message)
          }
        },
        //打开音效开关，获取音效数据
        soundEffectInit () {
          //获取音效数据
          this.sendWSPush(apis()['eqConfig']);
        },
        //响度开关
        btnLoudness (val) {
          this.sendWSPush(apis(val)['loudnessEnable'])
          this.soundEffectInit()
        },
        btnBass (val) {
          this.sendWSPush(apis(val)['bassEnable'])
          this.soundEffectInit()
        },
        btnEq (val) {
          this.sendWSPush(apis(val)['eqEnable'])
          this.soundEffectInit()
        },
        //设置音量
        setVolume (vol) {
          if (vol != 0) {
            vol = vol || this.deviceInfo.vol
          }
          this.sendWSPush(apis(vol)['vol']);
          this.deviceInfo.vol = vol
        },
        //设置响度
        setLoudness () {
          this.sendWSPush(apis(this.soundEffect.loudness.Current_Gain)['loudnessGain'])
        },
        //设置低音
        setBass () {
          this.sendWSPush(apis(this.soundEffect.bass.Current_Strength)['bassStrength'])
        },
        //设置音效
        setEq (index, level = null) {
          this.sendWSPush(apis(index, level || this.soundEffect.eq.Bands.list[index].BandLevel)['eqBandlevel'])
        },
        //选择音效模式
        setEqMode (index) {
          // console.log(index)
          this.sendWSPush(apis(this.soundEffect.eq.Preset_list[index].Preset)['eqPreset'])
          this.soundEffectInit()
        },
        // 设置自定义音效模式
        async setMyEqMode (index) {
          for (let item of this.myEqMode[index].BandList) {
            await this.setEq(item.Band, item.BandLevel)
          }
          await this.soundEffectInit()
        },
        //用户定义的模式
        async setMyEqMode2 (index) {
          for (let item of this.myEqMode2[index].BandList) {
            await this.setEq(item.Band, item.BandLevel)
          }
          await this.soundEffectInit()
        },
        BluetoothControl (val) {
          if (val) {
            this.BluetoothOpen()
          } else {
            this.BluetoothClose()
          }
        },
        BluetoothOpen () {
          this.sendWSPush(apis('打开蓝牙', 1)['bluetooth'])
        },
        BluetoothClose () {
          this.sendWSPush(apis('关闭蓝牙', 2)['bluetooth'])
        },
        musicLightControl (val) {
          if (val) {
            this.musicLightOpen()
          } else {
            this.musicLightClose()
          }
        },
        musicLightOpen () {
          this.sendWSPush(apis('打开氛围灯', 1)['musicLight'])
        },
        musicLightClose () {
          this.sendWSPush(apis('打开氛围灯', 0)['musicLight']);
        },
        musciLightLuma (val) {
          this.sendWSPush(apis(val)['musciLightLuma']);
        },
        musicLightChroma (val) {
          this.sendWSPush(apis(val)['musicLightChroma']);
        },
        //氛围效果
        musicLightMode (val) {
          this.sendWSPush(apis(this.musicLightModes[val], val)['musicLightMode'])
        },
        screenInit () {
          if (this.screen == null) {
            this.screen = document.getElementById('screen');
          }

          this.screen.addEventListener('click', this.screenOnclick)
          this.screen.addEventListener("touchstart", this.handleTouchEvent, false);
          this.screen.addEventListener("touchend", this.handleTouchEvent, false);
          this.screen.addEventListener("touchmove", this.handleTouchEvent, false);
          this.screen.addEventListener("mousewheel", this.screenOnmousewheel, false);
          this.screen.addEventListener("contextmenu", this.screenOncontextmenu, false);
        },
        // 开始截图
        startScreen () {
          this.sendWSPush(apis('start_screencap')['screen']);
          document.onkeydown = function (data) {
            if (data.keyCode == 13) {
              this.sendKeyevent(23);
              return false;
            } else if (data.keyCode == 37) {
              this.sendKeyevent(21);
              return false;
            } else if (data.keyCode == 38) {
              this.sendKeyevent(19);
              return false;
            } else if (data.keyCode == 39) {
              this.sendKeyevent(22);
              return false;
            } else if (data.keyCode == 40) {
              this.sendKeyevent(20);
              return false;
            }
          };
        },
        //停止截图
        stopScreen () {
          this.sendWSPush(apis('stop_screencap')['screen']);
          document.onkeydown = function () {};
          document.onkeyup = function () {};
        },
        //更新截图
        updateScreencap (blob) {
          //this.screencap = host + '/screencap?t=' + new Date().getTime();
          if (this.reader == null) {
            this.reader = new FileReader();
            this.reader.onload = (e) => {
              this.screencap = e.target.result
              // console.log(e.target.result)
            }
          }
          this.reader.readAsDataURL(blob)
        },
        //发送按键事件
        sendKeyevent (key) {
          this.sendWSPush(apis('keyevent ' + key)['keyEvent'])
        },
        handleTouchEvent (e) {
          let that = this.screen
          let cw = that.clientWidth
          let ch = that.clientHeight
          let nw = that.naturalWidth
          let nh = that.naturalHeight
          let x = e.changedTouches[0].clientX;
          let y = e.changedTouches[0].clientY;
          x = parseInt((x / cw) * nw);
          y = parseInt((y / ch) * nh);
          if (e.type == 'touchstart') {
            this.startx = x;
            this.starty = y;
          } else if (e.type == 'touchend') {
            if (this.startx == -1 || this.starty == -1) {
              return
            }
            if (y - this.starty < 50 && x - this.startx < 50) {
              if (this.starty - y < 50 && this.startx - x < 50) {
                this.startx = -1;
                this.starty = -1;
                return;
              }
            }
            this.sendWSPush(apis('swipe ' + this.startx + ' ' + this.starty + ' ' + x + ' ' + y)['keyEvent'])
            this.startx = -1;
            this.starty = -1;
          } else if (e.type == 'touchmove') {
            e.preventDefault(); //阻止滚动
          }
        },
        screenOnclick (e) {
          let that = this.screen
          let cw = that.clientWidth
          let ch = that.clientHeight
          let nw = that.naturalWidth
          let nh = that.naturalHeight
          this.sendWSPush(apis('tap ' + parseInt((e.offsetX / cw) * nw) + ' ' + parseInt((e.offsetY / ch) * nh))['keyEvent'])
        },
        screenOnmousewheel (e) {
          e.preventDefault();
          let that = this.screen
          let cw = that.clientWidth
          let ch = that.clientHeight
          let nw = that.naturalWidth
          let nh = that.naturalHeight
          let x = e.offsetX;
          let y = e.offsetY;
          let new_y = 0
          let mousewheel_interval = -1

          x = (x / cw) * nw;
          y = (y / ch) * nh;
          if (e.deltaY > -1) {
            new_y = y - 100;
          } else {
            new_y = y + 100;
          }

          if (new Date().valueOf() - mousewheel_interval > 0) {
            mousewheel_interval = new Date().valueOf() + 100;
            this.sendWSPush(apis('swipe ' + x + ' ' + y + ' ' + x + ' ' + new_y)['keyEvent'])
          }
        },
        screenOncontextmenu (e) {
          e.preventDefault();
          this.sendKeyevent(4)
        },
        addEqMode () {
          if (this.eqModeName.length < 1) {
            this.notification('', '没有输入名字', 'error')
            return
          } else {
            this.dialogVisible = false;
            let band = this.soundEffect.eq.Bands.list
            let obj = {
              Name: this.eqModeName,
              BandList: [
                { Band: 0, BandLevel: band[0].BandLevel },
                { Band: 1, BandLevel: band[1].BandLevel },
                { Band: 2, BandLevel: band[2].BandLevel },
                { Band: 3, BandLevel: band[3].BandLevel },
                { Band: 4, BandLevel: band[4].BandLevel }
              ]
            }
            this.eqlsControl('set', [obj])
            this.eqModeName = ''
          }
        },
        updateEqMode () {
          let modes = this.eqlsControl('get') || []
          this.myEqMode2 = modes
        },
        delEqMode (item) {
          console.log(item)
          if (item.Name == '电音') {
            return
          }
          let old = this.eqlsControl('get')
          let delIndex = old.findIndex(i => i.Name == item.Name)
          if (delIndex > -1) {
            old.splice(delIndex, 1)
          }
          this.eqlsControl('del')
          this.eqlsControl('set', old)
        },
        eqlsControl (type = 'set', val) {
          let key = 'myEqMode'
          if (type == 'set') {
            let old = JSON.parse(window.localStorage.getItem(key)) || []
            let delIndex = old.findIndex(i => i.Name == val[0].Name)
            if (delIndex > -1) {
              old.splice(delIndex, 1)
            }

            window.localStorage.setItem(key, JSON.stringify([...old, ...val]))
            this.myEqMode2 = [...old, ...val]
          } else if (type == 'get') {
            return JSON.parse(window.localStorage.getItem(key)) || ''
          } else if (type == 'del') {
            window.localStorage.removeItem(key)
            this.myEqMode2 = []
          } else {
            this.notification('错误', 'type 设置错误', 'error')
          }
        },
        //通知
        notification (title = '测试', msg = '没有内容', type = 'error') {
          this.$notify({
            title: title,
            message: msg,
            type: type,
            duration: 2000
          });
        },
        //灯开关
        light (val = false) {
          let shell = val ? 'lights_test set 7fffff8000 ffffff' : 'lights_test set 7fffff8000 0'
          this.sendWSPush(apis('开灯', shell)['shell'])
        },
        //打开网络连接
        netConfig () {
          this.sendWSPush(apis()['netConfig'])
        },
        //执行自定义shell命令
        executeShell () {
          if (this.shellStr) {
            this.sendWSPush(apis('myshell', this.shellStr)['shell'])
          } else {
            console.log('输入信息为空')
          }
        },
        //重启app
        restartApp (app, type) {
          app = app || this.listPackagesIndex
          this.stopApp(app)
          setTimeout(() => {
            this.startApp(app)
          }, 3000)
        },
        stopApp (app) {
          app = app || this.listPackagesIndex
          let shell = '/system/bin/am force-stop ' + app
          this.sendWSPush(apis('停止', shell)['shell'])
          this.notification('正在停止app', app, 'success')
        },
        startApp (app) {
          app = app || this.listPackagesIndex
          let shell = '/system/bin/am start ' + app + '/.ui.MainActivity'
          this.sendWSPush(apis('启动', shell)['shell'])
          this.notification('正在启动app', app, 'success')
        },
        //重启音箱
        reboot () {
          let shell = 'stop adbd&&start adbd&&adb reboot'
          this.sendWSPush(apis('重启音箱', shell)['shell'])
        },
        getListPackages () {
          let shell = '/system/bin/pm list packages'
          this.sendWSPush(apis('packages', shell)['shell'])
        },
        setListPackages (data) {
          this.listPackages = []
          for (let item of data.split("\r\n")) {
            let i = item.split(':')
            if (i[1] && i[1] != 'android') {
              this.listPackages.push(i[1])
            }
          }
        },
        //清除闹钟
        clear () {
          let shell = '/system/bin/pm clear com.phicomm.speaker.device'
          this.sendWSPush(apis('清除', shell)['shell'])
          this.restartApp('com.phicomm.speaker.device')
        },
        // 获取系统信息
        getSystemInfo () {
          let shell = 'cat /proc/meminfo&&cat /proc/stat&&echo incremental:$(getprop ro.build.version.incremental)'
          this.sendWSPush(apis('query', shell)['shell'])
        },
        setSystemInfo (data) {
          //把旧的cpu信息保存下来
          this.setCpuInfo()

          for (let item of data.split("\r\n")) {
            let i = item.split(':')
            // console.log(i[0], this.systemInfo.hasOwnProperty(i[0]))
            if (this.systemInfo.hasOwnProperty(i[0])) {
              this.systemInfo[i[0]] = parseInt(i[1])
            } else {
              let index = item.indexOf(' ')
              let key = item.substring(index, 0)
              if (this.systemInfo.hasOwnProperty(key)) {
                if (key == 'btime') {
                  this.systemInfo[key] = item.substring(index) * 1000
                } else {
                  this.systemInfo[key] = item.substring(index)
                }
              }
            }
          }
        },
        //计算cpu使用情况
        cpuUsage (pre, now) { //pre 上一次cpu数据，now 现在的cpu数据
          // pre = 110763706 123421 34337928 180707317 144304 7680 2172444 0 0 0
          if (pre != null && now != null) {
            pre = pre.split(' ').splice(0, 6)
            now = now.split(' ').splice(0, 6)
            let s1 = 0
            let s2 = 0
            for (let i of pre) {
              s1 += (i - 0)
            }
            for (let j of now) {
              s2 += (j - 0)
            }
            let totalCpuTime = s2 - s1
            let idle = now[3] - pre[3]
            return Math.round(1000 * (idle / totalCpuTime)) / 10
          }
        },
        //备份旧的cpu数据
        setCpuInfo () {
          this.cpuInfo.cpu = this.systemInfo.cpu
          this.cpuInfo.cpu0 = this.systemInfo.cpu0
          this.cpuInfo.cpu1 = this.systemInfo.cpu1
          this.cpuInfo.cpu2 = this.systemInfo.cpu2
          this.cpuInfo.cpu3 = this.systemInfo.cpu3
        },
        //切换主题色
        toggleTheme () {
          if (this.theme == 'light') {
            this.theme = 'dark'
          } else {
            this.theme = 'light'
          }
          localStorage.setItem('theme', this.theme)
        },
        // 歌词滚动
        setLyricsInterval () {
          if (!this.songInfo.lrc) {
            return
          }
          this.lyricsInterval = setInterval(() => {
            // console.log(this.deviceInfo.music_info.position / 1000)
            const progress = this.deviceInfo.music_info.position / 1000 || 0;
            let oldHighlightLyricIndex = this.highlightLyricIndex;
            this.highlightLyricIndex = this.songInfo.lrc.findIndex((l, index) => {
              const nextLyric = this.songInfo.lrc[index + 1];
              return (
                progress >= l.time && (nextLyric ? progress < nextLyric.time : true)
              );
            });
            if (oldHighlightLyricIndex !== this.highlightLyricIndex) {
              const el = document.getElementById(`line${this.highlightLyricIndex}`);
              if (el)
                el.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                  inline: 'center'
                });
            }
          }, 100);
        },
        formatLine (line) {
          if (line.contents[1]) {
            return `<span>${line.contents[0]}<br/>${line.contents[1]}</span>`;
          } else if (line.contents[0] !== undefined) {
            return `<span>${line.contents[0]}</span>`;
          }
          return 'unknown';
        },
        play () {
          this.deviceInfo.play_state = true
          this.sendWSPush(apis()['play'])
        },
        pause () {
          this.deviceInfo.play_state = false
          this.deviceInfo.music_info.state = 2
          this.sendWSPush(apis()['pause'])
        },
        prev () {
          this.deviceInfo.play_state = true
          this.sendWSPush(apis()['prev'])
          this.getSongInfo()
        },
        next () {
          this.deviceInfo.play_state = true
          this.sendWSPush(apis()['next'])
        },
        //把歌曲添加到喜欢
        collect () {
          this.sendWSPush(bandaoapis()['collect'])
        },
        //把歌曲从喜欢中移除
        cancelCollect () {
          this.sendWSPush(bandaoapis()['cancelCollect'])
        },
        playMusic (e) {
          let index = null
          for (let item of e.path) {
            if (item.className && item.className.indexOf('track playlist') != -1) {
              index = item.dataset.index
              this.sendWSPush(apis(index)['playMusic'])

              this.list.playIndex = index
              item.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            }
          }

        },
        //静音
        mute () {
          let volume = this.deviceInfo.vol
          if (volume == 0) {
            volume = this.getVolume || 2
          } else {
            localStorage.setItem('volume', volume)
            volume = 0
          }

          this.setVolume(volume)
          this.deviceInfo.vol = volume
        },
        //设置播放模式
        setPlayMode (mode) {
          // 1: 随机;2: 顺序;3: 单曲
          mode = mode || this.deviceInfo.play_mode == 3 ? 1 : this.deviceInfo.play_mode + 1
          // console.log(mode, this.deviceInfo.play_mode)
          this.deviceInfo.play_mode = mode
          // console.log(this.deviceInfo.play_mode)
          this.sendWSPush(apis(mode)['setPlayMode'])
        },
        getList () {
          this.sendWSPush(apis()['list'])
        },
        getSongInfo () {
          let id = this.deviceInfo.music_info.id
          jsonp(
            `http://wxfsq.com:86/music/?info=${id}`,
            (resp, data) => {
              if (data.data == null) {
                this.songInfo = {}
                this.noLyric = true
                // this.notification('错误', '找不到歌曲信息', 'error')
              } else {
                data.data.lrc = parseLyric(data.data.lrc || '')
                this.songInfo = data.data
                // console.log(this.songInfo.lrc)
                if (this.songInfo.lrc.length > 10) {
                  this.noLyric = false
                } else {
                  this.noLyric = true
                }
              }
            })
        },
        //设置播放时间节点
        setPosition (t) {
          let time = 0
          let curr = this.currentMusicProgress
          if (curr != t) {
            time = curr*1000
          } else {
            time = this.cmp*1000
          }
          this.sendWSPush(apis(time)['setPosition'])
          this.play()
          setTimeout(() => {
            this.play()
          }, 200)
        },
        valueNow (now) {
          this.currentMusicProgress = now
        },
        //获取kuwo全部榜单
        getKuwoBangMenu () {
          if (this.kuwoBangMenu.length > 0) {
            return
          }
          axios({
            method: 'get',
            baseURL,
            url: 'api/music/bang/bang/bangMenu',
          }).then(resp => {
            if (resp.status == 200 && resp.data.code == 200) {
              if (resp.data.data.length) {
                this.kuwoBangMenu = resp.data.data
              }
            }
          })
        },
        //获取某个列表的歌曲
        getMenuMusicList (id) {
          axios({
            method: 'get',
            baseURL,
            url: 'api/music/bang/bang/musicList',
            params: {
              bangId: id, //sourceid
              pn: 1,
              rn: 100,
            }
          }).then(resp => {
            if (resp.status == 200) {
              this.hendleMenu(resp.data.data.musicList)
            }
          })
        },
        //格式化列表歌曲
        hendleMenu (musicList) {
          let list = {
            index: 0,
            asrResult: null,
            pageIndex: 1,
            totalPage: 1,
            itemList: []
          }
          for (let i of musicList) {
            let item = {
              itemType: 0,
              title: i.name,
              url: `http://antiserver.kuwo.cn/anti.s?useless=&format=mp3&rid=${i.musicrid}&response=res&type=convert_url&br=320kmp3&`,
              itemId: i.musicrid,
              album: i.album,
              artist: i.artist,
              duration: i.duration
            }
            list.itemList.push(item)
          }
            if(typeof xiaofei != 'undefined'){
                this.xiaofeiWsPlayMenu(list)
            }else{
                this.bandaoWsPlayMenu(list)
            }
        },
        // 通过小飞ws去点播列表歌曲
        xiaofeiWsPlayMenu (list) {
          this.sendWSPush(apis(list)['playMenu'])
          this.sendWSPush(apis()['play'])
           this.sendWSPush({ type: 'send_message', what: 4, arg1: 16, arg2: -1, obj:null })
        },
        // 通过半岛ws去点播列表歌曲
        bandaoWsPlayMenu (list) {
          let Socket = new WebSocket('ws://' + hostname + ':' + 9998);
          Socket.onopen = () => {}
          //接收消息
          Socket.onmessage = () => {}
          //连接失败重连
          Socket.onerror = () => {}
          //断开重连
          Socket.onclose = () => {}
          let t = setInterval(() => {
            if (Socket.readyState === 1) {
              clearInterval(t)
              console.log(bandaoApis(list)['playMenu'])
              Socket.send(JSON.stringify(bandaoApis(list)['playMenu']))
              //不传下面这两个就不播放
              Socket.send(JSON.stringify({ type: 'sendMsg', what: 4, arg1: 11, arg2: -1, dataType: 'int', data: 0 }))
              Socket.send(JSON.stringify({ type: 'sendMsg', what: 4, arg1: 2, arg2: -1, dataType: null, data: null }))
              Socket.send(JSON.stringify({ type: 'sendMsg', what: 4, arg1: 3, arg2: -1, dataType: null, data: null }))
              Socket.close()
            }
          }, 500)
        },
        //把毫秒转为秒（可大于60）
        typeMmss (ss) {
          if (ss) {
            return new Date(ss * 1000).totalDay('mm:ss')
          }
          return ss
        },
        //获取网易云榜单
        getNetEaseBangMenu () {
          if (this.netEaseBangMenu.length > 0) {
            return
          }
          axios({
            method: 'get',
            baseURL: 'https://music-api.heheda.top',
            url: '/toplist',
          }).then(resp => {
            if (resp.status == 200 && resp.data.code == 200) {
              let d = resp.data
              if (d.list.length) {
                let item = {
                  name: '网易云音乐榜',
                  list: []
                }
                for (let i of d.list) {
                  let _list = {
                    id: i.id,
                    intro: i.description,
                    name: i.name,
                    pic: i.coverImgUrl,
                    pub: i.updateFrequency,
                  }
                  item.list.push(_list)
                }
                this.netEaseBangMenu.push(item)
                console.log(this.netEaseBangMenu)
              }
            }
          })
        },
        getListDetail (id, noPlay) { //获取歌单详细信息，并播放
          axios({
            method: 'get',
            baseURL: 'https://music-api.heheda.top',
            url: '/playlist/detail',
            params: {
              id: id,
            }
          }).then(res => {
            // console.log(res)
            let trackIds = res.data.playlist.trackIds
            let ids = ''
            for (let i of trackIds) {
              ids += (',' + i.id)
            }
            // console.log(ids.slice(1))
            if (!noPlay) {
              this.getMusicDetail(ids.slice(1))
            } else {
              this.setCollectMusicList(res.data.playlist)
            }
          })
        },
        getMusicDetail (ids) { // 获取歌曲详情,调用此接口 , 传入音乐 id(支持多个 id, 用 , 隔开), 可获得歌曲详情(ids=347230,347231)
          axios({
            method: 'get',
            baseURL: 'https://music-api.heheda.top',
            url: '/song/detail',
            params: {
              ids: ids,
            }
          }).then(res => {
            // console.log(res)
            let songs = res.data.songs
            let list = {
              index: 0,
              asrResult: null,
              pageIndex: 1,
              totalPage: 1,
              itemList: [],
            }
            for (let i of songs) {
              let item = {
                itemType: 0,
                title: i.name,
                url: `http://music.163.com/song/media/outer/url?id=${i.id}.mp3`,
                itemId: `${i.id},netease`,
                album: i.al.name,
                artist: i.ar[0].name,
                duration: i.dt
              }
              list.itemList.push(item)
            }
            // console.log(list)
            return list
          }).then(res => {
              if(typeof xiaofei != 'undefined'){
                this.xiaofeiWsPlayMenu(res)
            }else{
                this.bandaoWsPlayMenu(res)
            }
          })
        },
        changeUid () {
          let Uid = prompt('请输入网易云用户ID', '')
          if (Uid && -Uid && Uid > 0) {
            this.notification('成功', '设置用户ID成功，请等待刷新', 'success')
            localStorage.setItem('netEaseUid', Uid)
            this.netEaseUid = Uid
            this.getMyMusicMenu()
          }
        },
        getMyMusicMenu (uid) {
          uid = uid || this.netEaseUid
          if (!uid) {
            return
          }
          axios({
            method: 'get',
            baseURL: 'https://music-api.heheda.top',
            url: '/user/playlist',
            params: {
              uid: uid,
            }
          }).then(res => {
            if (res.status == 200 && res.data.code == 200) {
              let playlist = res.data.playlist
              if (playlist.length > 0) {
                let item = {
                  name: '我的歌单',
                  list: []
                }
                for (let i of playlist) {
                  if (i.trackCount > 0) {
                    let _list = {
                      id: i.id,
                      intro: i.description,
                      name: i.name,
                      pic: i.coverImgUrl,
                      pub: i.updateFrequency,
                    }
                    item.list.push(_list)
                  }
                }
                this.myMusicMenu.push(item)
              }
            }
          })
        },
        // 收藏网易云歌单
        collectMusicList () {
          this.getListDetail(this.netEaseLId, true)
        },
        setCollectMusicList (list) {
          let _list = {
            id: list.id,
            intro: list.description,
            name: list.name,
            pic: list.coverImgUrl,
            pub: list.updateFrequency,
          }
          this.collectList[0].list.push(_list)
        },
        delCollectMusicList (id) {
          let l = this.collectList[0].list
          let n = []
          for (let i of l) {
            if (i.id != id) {
              n.push(i)
            }
          }
          this.collectList[0].list = n
        },
      },
      computed: {
        Bluetooth () {
          if (this.deviceInfo.device_state == 3) {
            return true
          } else {
            return false
          }
        },
        cpuStatus () {
          let cpuStatus = [0, 0, 0, 0, 0]
          let c1 = this.systemInfo
          let c2 = this.cpuInfo
          if (c2.cpu == '') {
            this.setCpuInfo()
          } else {
            cpuStatus[0] = this.cpuUsage(c2.cpu, c1.cpu)
            cpuStatus[1] = this.cpuUsage(c2.cpu0, c1.cpu0)
            cpuStatus[2] = this.cpuUsage(c2.cpu1, c1.cpu1)
            cpuStatus[3] = this.cpuUsage(c2.cpu2, c1.cpu2)
            cpuStatus[4] = this.cpuUsage(c2.cpu3, c1.cpu3)
          }

          return cpuStatus
        },
        lyricWithTranslation () {
          let type = Object.prototype.toString.call(this.songInfo.lrc)
          let reg = new RegExp(/(Array|String)/, 'gi')
          if (!type.match(reg)) {
            return ''
          }
          let ret = [];
          // 空内容的去除
          const lyricFiltered = this.songInfo.lrc.filter(({ content }) =>
            Boolean(content)
          );
          // content统一转换数组形式
          ret = lyricFiltered.map(({ time, content }) => ({
            time,
            content,
            contents: [content],
          }));
          // console.log(ret)
          return ret;
        },
        isPlay () {
          let di = this.deviceInfo
          let result = di.play_state || (di.music_info && di.music_info.state != 2)
          return result
        },
        getVolume () {
          return localStorage.getItem('volume')
        },
      },
      watch: {
        'deviceInfo.music_info.id': {
          handler (val, old) {
            if (val) {
              this.getList()
              this.getSongInfo()
              let info = this.deviceInfo.music_info
              this.setPageTitle('▶  ' + info.title + '_' + info.artist)
            } else {
              this.setPageTitle(defaultTitle)
            }
          },
          immediate: true
        },
        nextTracksPage (val, old) {
          if (val) {
            this.$nextTick(e => {
              this.$refs['playList' + this.list.playIndex][0].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });
            })
          }
        },
        lyricsPage (show) {
          if (show) {
            this.setLyricsInterval()
            disableScrolling()
          } else {
            clearInterval(this.lyricsInterval)
            enableScrolling()
          }
        },
        'list.playIndex': {
          handler (val, old) {
            if (this.nextTracksPage) {
              this.$refs['playList' + this.list.playIndex][0].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });
            }
          },
        },
        currentMusicProgress (val, old) {
          this.cmp = old
        },
        'collectList': {
          handler (val, old) {
            localStorage.setItem('collectList', JSON.stringify(this.collectList))
          },
          deep: true,
        },
      }
    })

  }



new Promise(function(resolve, reject) {
  addJs('https://unpkg.com/vue/dist/vue.min.js')
  addJs('https://unpkg.com/element-ui/lib/index.js')
  addJs('https://unpkg.com/axios/dist/axios.min.js')
  let t = setInterval(function() {
    if (typeof Vue != 'undefined') {
        clearInterval(t)
        resolve();
    }
  }, 100)
}).then(()=> {
  let timer = setInterval(function () {

    if (getEl('body')[0] != undefined) {
      clearInterval(timer);
      getEl('body pre')[0] && DelEl(getEl('body pre')[0])
      checkPort()


      addMeta()
      loadCss('https://unpkg.com/element-ui/lib/theme-chalk/index.css');
      addCss(myStyle())

      vueBox()
    }
  }, 500);
}, (e) => { alert('文件加载错误') })


})();