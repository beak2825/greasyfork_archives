// ==UserScript==
// @name         直播界面精简
// @namespace    xiongqi
// @version      1.8
// @description  斗鱼，战旗，虎牙直播界面精简,持续更新中
// @author       XiongQi
// @match        https://www.douyu.com/*
// @match        https://www.zhanqi.tv/*
// @match        https://www.huya.com/*
// @exclude      https://www.douyu.com/
// @exclude      https://www.zhanqi.tv/
// @exclude      https://www.huya.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368212/%E7%9B%B4%E6%92%AD%E7%95%8C%E9%9D%A2%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/368212/%E7%9B%B4%E6%92%AD%E7%95%8C%E9%9D%A2%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function() {
  'use strict';
  /******************************/
  const liveConf = {
    douyu: 'www.douyu.com',
    zhanqi: 'www.zhanqi.tv',
    huya: 'www.huya.com',
  };
  const clearDOM = function(id) {
    const child = document.body.children;
    const leng = document.body.children.length;
    const body = document.body;
    const list = [];
    for (let i = 0; i < leng; i++)
      if (child.item(i).tagName === 'DIV' && !id.test(child.item(i).id)) list.push(child.item(i));
    list.forEach(x => body.removeChild(x));
  };
  const douyuFunc = {
    clearDOM() {
      clearDOM(/container/);
    },
    videoUI() {
      const container = document.getElementById('container');
      const header = document.getElementById('header');
      const video = document.getElementById('js-live-room-normal-left');
      const mainbody = document.getElementById('mainbody');
      container.removeChild(document.getElementById('left'));
      header.style.position = 'relative';
      video.style.margin = '0';
      mainbody.innerHTML = '';
      mainbody.style.margin = '0';
      mainbody.style.padding = '10px 150px';
      mainbody.appendChild(video);
      setTimeout(() => {
        const bottom = document.getElementById('js-stats-and-actions');
        bottom.removeChild(document.getElementsByClassName('task-Getyw')[0]);
      }, 10000);
    },
  };
  const zhanqiFunc = {
    clearDOM() {
      clearDOM(/js-room-super-panel/);
    },
    videoUI() {
      const panel = document.getElementById('js-room-super-panel');
      if (panel.classList.contains('live-star-page')) {
        // const room = document.getElementById('js-room-super-panel');
        const style = document.createElement('style');
        style.innerHTML =
          '.theatre .live-star-page .live-room-content .video-flash-cont{width: 100% !important;height:100% !important;} .liveMessage{z-index:unset !important}';
        document.body.appendChild(style);
        const bottom = document.getElementsByClassName('room-star-bottom-skin')[0];
        const bottom_ad = document.getElementsByClassName('live-stars-bottom')[0];
        const top = document.getElementsByClassName('live-stars-top-content')[0];
        bottom.removeChild(bottom_ad);
        top.removeChild(document.getElementById('js-room-desc-collapse-btn'));
        const content = document.getElementsByClassName('live-star-content')[0];
        const chat = document.getElementById('js-right-chat-panel');
        content.removeChild(chat);
        // const content_left_bottom = document.getElementsByClassName('left-area')[0];
        // const content_left_bottom_ad = document.getElementsByClassName('left-bottom-area')[0];
        // content_left_bottom.removeChild(content_left_bottom_ad);
        const video = document.getElementsByClassName('live-room-content')[0];
        video.style.width = '100%';
        // const gift = document.getElementsByClassName('liveMessage')[0];
        // gift.style.position = 'relative';
        // gift.style.zIndex = 'unset';}
      } else {
        const right = document.getElementById('js-right-chat-panel');
        const panel2 = right.parentNode;
        panel2.removeChild(right);
        panel2.removeChild(document.getElementById('js-right-chat-show-btn'));
        const content_bottom = document.getElementById('js-room-module-area');
        const content = content_bottom.parentNode;
        content.removeChild(content_bottom);
        // content.removeChild(document.getElementsByClassName('live-gg-area')[0]);
        const style = document.createElement('style');
        style.innerHTML =
          '.theatre .live-room-content .video-flash-cont{height:100% !important;} .video-flash-cont{width: 100% !important} .liveMessage{z-index:unset !important} .live-room-content{padding: 0;width: 100% !important}';
        document.body.appendChild(style);
      }
    },
  };
  const huyaFunc = {
    clearDOM() {
      clearDOM(/duya-header|J_mainWrap/);
    },
    videoUI() {
      document.body.removeChild(document.getElementsByClassName('mod-sidebar')[0]);
      const main = document.getElementById('J_mainRoom');
      const roomCore = document.getElementsByClassName('room-core')[0];
      main.innerHTML = '';
      main.appendChild(roomCore);
      document.getElementById('player-gift-wrap').removeChild(document.getElementsByClassName('player-gift-left')[0]);
      roomCore.removeChild(roomCore.getElementsByClassName('room-core-r')[0]);

      // style
      const mainWrap = document.getElementById('J_mainWrap');
      document.getElementById('J_roomBd').style.overflow = 'visible';

      document.body.style.overflow = 'auto';
      document.getElementById('duya-header').style.position = 'relative !important';

      document.getElementById('player-wrap').style.height = 'calc(100% - 20px)';
      const style = document.createElement('style');
      style.innerHTML = '#duya-header{position: relative !important} #J_mainWrap{padding:0 100px !important;overflow:visible;} .player-wrap{bottom: 0 !important}';
      document.body.appendChild(style);
      const roomL = roomCore.getElementsByClassName('room-core-l')[0];
      roomL.style.margin = '0';
      const mainCol = document.getElementById('main_col');
      mainCol.style.overflow = 'visible';
    },
  };
  window.onload = function() {
    switch (location.host) {
      case liveConf.douyu:
        if (/直播间/.test(document.title)) {
          douyuFunc.clearDOM();
          douyuFunc.videoUI();
          setTimeout(douyuFunc.clearDOM, 10000);
        }
        break;
      case liveConf.zhanqi:
        if (/直播间/.test(document.title)) {
          zhanqiFunc.clearDOM();
          zhanqiFunc.videoUI();
        }
        break;
      case liveConf.huya:
        if (document.getElementById('player-video')) {
          // huyaFunc.clearDOM();
          huyaFunc.videoUI();
        }
        break;
      default:
        break;
    }
  };

  /******************************/
})();
