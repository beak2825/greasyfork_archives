// ==UserScript==
// @name         YouTube Live In-page Fullscreen
// @version      0.2.1
// @description  Automatically puts the player full-screen on the page when you go to the live page.
// @author       dragonish
// @namespace    https://github.com/dragonish
// @license      GNU General Public License v3.0 or later
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @match        *://*.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/511180/YouTube%20Live%20In-page%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/511180/YouTube%20Live%20In-page%20Fullscreen.meta.js
// ==/UserScript==

(function () {
  const FULLSCREEN = `
    body {
      overflow: hidden !important;
    }
    #player #player-container-outer,
    #player #player-container-inner,
    #player #player-container,
    #player #ytd-player,
    #player #container,
    #player #movie_player,
    #player .html5-video-container,
    #player .html5-main-video,
    #ytd-player #player-container-outer,
    #ytd-player #player-container-inner,
    #ytd-player #player-container,
    #ytd-player #ytd-player,
    #ytd-player #container,
    #ytd-player #movie_player,
    #ytd-player .html5-video-container,
    #ytd-player .html5-main-video {
      position: fixed !important;
      margin: 0 !important;
      padding: 0 !important;
      top: 0 !important;
      left: 0 !important;
      border: none !important;
      width: 100% !important;
      height: 100% !important;
      contain: none !important;
      background-color: #000 !important;
      z-index: 10000;
    }
    #player .html5-main-video,
    #ytd-player .html5-main-video {
      object-fit: contain !important;
    }
    #player #container .html5-video-player > div,
    #ytd-player #container .html5-video-player > div {
      z-index: 10002 !important;
    }
    #player #container .html5-video-player > div.ytp-tooltip.ytp-bottom,
    #ytd-player #container .html5-video-player > div.ytp-tooltip.ytp-bottom {
      top: calc(100% - 90px) !important;
    }
    #player #container .ytp-chrome-bottom,
    #player .ytp-progress-bar .ytp-chapter-hover-container,
    #ytd-player #container .ytp-chrome-bottom,
    #ytd-player .ytp-progress-bar .ytp-chapter-hover-container {
      width: calc(100% - 12px) !important;
    }
    #player .ytp-progress-bar-container .ytp-scrubber-container,
    #ytd-player .ytp-progress-bar-container .ytp-scrubber-container {
      transform: translateX(calc(100vw - 24px)) !important;
    }
    #ylf-panel {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5);
      align-items: center;
      justify-content: center;
      z-index: 10099;
    }
    #ylf-panel-div {
      position: relative;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 1px 10px rgba(0, 0, 0, 0.8);
      background-color: rgb(21, 32, 43);
      border: 1px solid #000;
      color: #fff;
      width: 300px;
    }
    #ylf-settings-header {
      margin: 20px 15px;
      text-align: center;
      font-size: 1.2em;
      font-weight: bold;
    }
    #ylf-settings-content {
      margin: 0px 10px;
    }
    #ylf-custom-shortcuts-input {
      width: 150px
    }
    #ylf-settings-footer {
      display: inline-block;
      margin: 15px 15px;
      text-align: right;
    }
    #ylf-custom-cancel-btn,
    #ylf-custom-ok-btn {
      cursor: pointer;
    }
    #ylf-custom-ok-btn {
      margin-left: 10px;
    }
  `;
  class Shortcuts {
    constructor() {
      this.keyVal = GM_getValue('shortcuts', '');
    }
    showPanel() {
      if (!this.panel) {
        this.panelGenerator();
      }
      this.panel.style.display = 'flex';
      const input = document.querySelector('#ylf-custom-shortcuts-input');
      if (input) {
        input.disabled = true;
        input.value = this.keyVal;
      }
    }
    hidePanel() {
      if (this.panel) {
        this.panel.style.display = 'none';
      }
    }
    keyHandler(evt) {
      if (!['Control', 'Shift', 'Alt', 'Escape', 'Backspace'].includes(evt.key)) {
        let keyVal = '';
        if (evt.ctrlKey) {
          keyVal = 'Ctrl';
        }
        if (evt.altKey) {
          keyVal = keyVal ? `${keyVal}+Alt` : 'Alt';
        }
        if (evt.shiftKey) {
          keyVal = keyVal ? `${keyVal}+Shift` : 'Shift';
        }
        const u = evt.key.toUpperCase();
        keyVal = keyVal ? `${keyVal}+${u}` : u;
        return keyVal;
      }
      return '';
    }
    panelGenerator() {
      this.panel = document.createElement('div');
      this.panel.id = 'ylf-panel';
      const div = document.createElement('div');
      div.id = 'ylf-panel-div';
      this.panel.appendChild(div);
      const settingsHeader = document.createElement('div');
      settingsHeader.id = 'ylf-settings-header';
      settingsHeader.textContent = 'Settings';
      div.append(settingsHeader);
      const settingsContent = document.createElement('div');
      settingsContent.id = 'ylf-settings-content';
      div.append(settingsContent);
      const label = document.createElement('label');
      label.textContent = 'Shortcuts:';
      settingsContent.appendChild(label);
      const input = document.createElement('input');
      input.id = 'ylf-custom-shortcuts-input';
      input.value = this.keyVal;
      input.addEventListener('keydown', evt => {
        evt.preventDefault();
        evt.stopPropagation();
        input.value = this.keyHandler(evt);
        return false;
      });
      settingsContent.appendChild(input);
      const editBtn = document.createElement('button');
      editBtn.id = 'ylf-custom-edit-shortcuts-btn';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', evt => {
        evt.stopPropagation();
        if (input) {
          input.disabled = false;
          setTimeout(() => {
            input.focus();
          }, 0);
        }
      });
      settingsContent.appendChild(editBtn);
      const settingsFooter = document.createElement('div');
      settingsFooter.id = 'ylf-settings-footer';
      div.appendChild(settingsFooter);
      const cancelBtn = document.createElement('button');
      cancelBtn.id = 'ylf-custom-cancel-btn';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.addEventListener('click', evt => {
        evt.stopPropagation();
        this.hidePanel();
      });
      settingsFooter.appendChild(cancelBtn);
      const okBtn = document.createElement('button');
      okBtn.id = 'ylf-custom-ok-btn';
      okBtn.textContent = 'OK';
      okBtn.addEventListener('click', evt => {
        evt.stopPropagation();
        if (input) {
          const value = input.value;
          GM_setValue('shortcuts', value);
          this.keyVal = value;
        }
        this.hidePanel();
      });
      settingsFooter.appendChild(okBtn);
      this.panel.addEventListener('click', evt => {
        if (evt.target === this.panel) {
          this.hidePanel();
        }
      });
      document.body.appendChild(this.panel);
    }
    isInputElement(element) {
      try {
        return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT';
      } catch {
        return false;
      }
    }
    keyMatcher(evt) {
      if (this.keyVal && !this.isInputElement(evt.target)) {
        return this.keyVal === this.keyHandler(evt);
      }
      return false;
    }
  }
  class FullScreen {
    constructor() {
      this.shortcuts = new Shortcuts();
      GM_registerMenuCommand('Define shortcuts', () => {
        this.shortcuts.showPanel();
      });
      document.addEventListener('keydown', evt => {
        if (evt.key === 'Escape') {
          this.styleElement && this.exitFullscreen();
        } else if (this.shortcuts.keyMatcher(evt)) {
          if (this.styleElement) {
            this.exitFullscreen();
          } else {
            this.fullscreenHandler();
          }
        }
      });
    }
    fullscreenHandler() {
      if (!this.styleElement) {
        this.styleElement = GM_addStyle(FULLSCREEN);
      }
      console.info('enter fullscreen');
      this.menuHandler();
    }
    exitFullscreen() {
      if (this.styleElement) {
        this.styleElement.remove();
        this.styleElement = undefined;
        this.menuHandler();
        console.log('exit fullscreen');
      }
    }
    menuHandler() {
      this.menuKey = GM_registerMenuCommand(this.styleElement ? 'Exit fullscreen' : 'Enter fullscreen', () => {
        if (this.styleElement) {
          this.exitFullscreen();
        } else {
          this.fullscreenHandler();
        }
      }, {
        id: this.menuKey
      });
    }
  }
  function main() {
    const isVideoPage = location.href.includes('watch?v=');
    if (!isVideoPage) return;
    const isLivePage = document.querySelector('.ytp-live') != null;
    console.debug('isLivePage: ', isLivePage);
    if (!isLivePage) return;
    document.body.arrive('#player-container-outer', {
      onceOnly: true,
      existing: true
    }, () => {
      console.debug('found the player element');
      const fs = new FullScreen();
      fs.fullscreenHandler();
    });
  }
  main();
})();
