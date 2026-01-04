// ==UserScript==
// @name         咪咕视频增强
// @namespace    https://github.com/hzmming/miguvideo-enhance
// @version      1.0
// @description  支持弹幕等其它功能
// @author       LoryHuang <844155285hzm@gmail.com>
// @match        https://www.miguvideo.com/p/live/*
// @match        https://www.miguvideo.com/p/pugcLive/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=miguvideo.com
// @require      https://cdn.jsdelivr.net/npm/danmu.js@1.1.13
// @license      WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481311/%E5%92%AA%E5%92%95%E8%A7%86%E9%A2%91%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/481311/%E5%92%AA%E5%92%95%E8%A7%86%E9%A2%91%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function $(selector) {
    return document.querySelector(selector);
  }

  function createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
  }

  function createStyle(cssString) {
    const style = document.createElement('style');
    style.innerHTML = cssString;
    return style;
  }

  setTimeout(() => {
    main();
  }, 5000);

  const enhanceCssString = `
    .enable-danmu .episode {
      display: none !important;
    }
    .episode {
      position: absolute;
      right: 0;
      height: auto !important;
      z-index: 1;
    }
    .right-box,
    .right-box .noYellowLineTab{
      height: auto !important;
      width: auto !important;
    }
    .right-box {
      background: rgba(26, 28,44, 0.5)
    }
    .right-box .yellow-line-box {
      display: none !important;
    }
    .right-box .tabColumn {
      display: none !important;
    }
    .right-box .chatroom-wrapper {
      height: 400px !important;
      padding-top: 14px;
    }
    .webPlay {
      height: 100vh !important;
      margin-right: 0 !important;
    }
    .webPlay .title {
      display: none !important;
    }
  `;

  const danmuCssString = `
    .webPlay .danmu-entrance {
      float: right;
      background: url(/mgs/player/prd/v_20231120142225_8ea37cca/dist/assets/p_sprites.png) -84px -208px no-repeat;
      width: 48px;
      height: 40px;
      cursor: pointer;
    }
    .webPlay .danmu-entrance.danmu-entrance-off {
      background-position: -40px -160px;
    }
  `;

  function main() {
    const controlBox = $('.right-control');
    const playcont = $('.playcont');
    const playerWrapper = $('.webPlay .play');

    // 添加增强全屏入口
    const myFullscreen = createElementFromHTML(
      '<div class="zoom-btn"><i class="btn-bg zoom-out" title="全屏"></i></div>'
    );
    myFullscreen.style.rotate = '45deg';
    controlBox.prepend(myFullscreen);

    let flag = false;

    document.addEventListener('fullscreenchange', () => {
      const element = document.fullscreenElement;

      if (flag) {
        if (element) {
          setStyle();
        } else {
          recoverStyle();
          flag = false;
        }
      }
    });

    const enhanceStyle = createStyle(enhanceCssString);
    function setStyle() {
      document.head.appendChild(enhanceStyle);
    }
    function recoverStyle() {
      document.head.removeChild(enhanceStyle);
    }

    myFullscreen.addEventListener('click', () => {
      if (flag) {
        document.exitFullscreen();
        return;
      }

      flag = true;

      playcont.requestFullscreen();
    });

    // 添加弹幕入口
    const danmuStyle = createStyle(danmuCssString);
    document.head.appendChild(danmuStyle);
    const danmuIcon = createElementFromHTML(
      '<div class="danmu-entrance"></div>'
    );
    controlBox.append(danmuIcon);
    let danmuOn = false;
    danmuIcon.addEventListener('click', () => {
      if (!danmuOn) turnOnDanmu();
      else turnOffDanmu();
    });

    const danmuWrapper = createElementFromHTML(
      '<div style="position: absolute; left: 0; top: 0; bottom: 0; right: 0; pointer-events: none;"></div>'
    );
    danmuWrapper.className = '.danmu-wrapper';

    const msgSdk = $('.mg-chat-room').__vue__.msgsdk;

    function listenMsg(cb) {
      msgSdk.getMsg(cb);
    }

    let danmuInstance = null;
    function turnOnDanmu() {
      if (!danmuInstance) {
        const comments = msgSdk.chatRoomDataList.map((i) => ({
          duration: 10000,
          id: i.id,
          txt: i.content,
          style: {
            color: '#fff',
            fontSize: '20px'
          }
        }));
        danmuInstance = initDanmu(comments);
        danmuInstance.start();

        listenMsg((e) => {
          if (!danmuOn) return;
          danmuInstance.sendComment({
            id: e.id,
            txt: e.msg || e.content,
            style: {
              color: '#fff',
              fontSize: '20px'
            }
          });
        });
      }

      danmuOn = true;
      danmuWrapper.style.display = 'block';

      danmuIcon.classList.remove('danmu-entrance-off');
      playcont.classList.add('enable-danmu');
    }
    function turnOffDanmu() {
      danmuOn = false;
      danmuWrapper.style.display = 'none';

      danmuIcon.classList.add('danmu-entrance-off');
      playcont.classList.remove('enable-danmu');
    }

    function initDanmu(comments) {
      playerWrapper.append(danmuWrapper);

      return new window['danmu.js']({
        comments,
        needResizeObserver: true,
        channelSize: 24,
        container: danmuWrapper,
        containerStyle: {
          zIndex: 100
        },
        area: {
          start: 0,
          end: 1
        },
        disableCopyDOM: true,
        dropStaleComments: true
      });
    }

    // 默认开启
    turnOnDanmu();
  }
})();
