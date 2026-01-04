// ==UserScript==
// @name              Booru-Selector-Downloader
// @namespace         http://tampermonkey.net/
// @icon              https://yande.re/favicon.ico
// @version           4.0.1
// @description       A selector and downloader for the various booru imageboards
// @description:en    A selector and downloader for the various booru imageboards
// @description:zh    图站选择下载工具
// @author            Beats0
// @license           GPL-3.0 License
// @match             *://yande.re/post*
// @match             *://konachan.net/*
// @match             *://konachan.com/*
// @match             *://gelbooru.com/*
// @match             *://danbooru.donmai.us/*
// @match             *://sonohara.donmai.us/*
// @include           *://yande.re/*
// @include           *://konachan.net/*
// @include           *://konachan.com/*
// @include           *://gelbooru.com/*
// @include           *://danbooru.donmai.us/*
// @include           *://sonohara.donmai.us/*
// @grant             GM_addStyle
// @grant             GM_download
// @grant             GM_openInTab
// @home-url          https://greasyfork.org/zh-CN/scripts/371605-booru-selector-downloader
// @home-url2         https://github.com/Beats0/scripter
// @downloadURL https://update.greasyfork.org/scripts/371605/Booru-Selector-Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/371605/Booru-Selector-Downloader.meta.js
// ==/UserScript==

/**
 * ### Hot keys
 *
 * `A`: Previous page
 * `D`: Next page
 * `Q`: Select/Deselect all image
 * `S`: Save sample image
 * `X`: Save original image(if no original image, the downloader will download the sample image)
 * `F`: Favorite image
 * `R`: Remove from favorites
 * `Ctrl + MouseClick`: Open in the new window
 * `Alt + MouseClick`: Open in the new window and auto focus the new tab
 * `Shift + MouseHover`: Show preview image when hover the image, default scale size is `scale(2.5, 2.5)`
 * */

(function () {
  'use strict';
  const originUrl = document.location.origin;
  const locationUrl = document.location.protocol + '//' + window.location.host;
  const REyande = /yande/,
    REkonachan = /konachan/,
    REgelbooru = /gelbooru/,
    REdanbooru = /danbooru/,
    REsonohara = /sonohara/;
  const re1 = /\d\w+/,
    re2 = /([a-fA-F0-9]{32})/,
    re3 =/\.[0-9a-z]+$/i;
  const REyandeResult = REyande.test(originUrl);
  const REkonachanResult = REkonachan.test(originUrl);
  const REdanbooruResult = REdanbooru.test(originUrl) || REsonohara.test(originUrl);
  const REgelbooruResult = REgelbooru.test(originUrl);
  let parse = null
  const reTrySvgIcon = `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11702" width="20" height="20"><path d="M512 214.016q141.994667 0 242.005333 100.010667t100.010667 240q0 141.994667-100.992 242.005333t-240.981333 100.010667-240.981333-100.010667-100.992-242.005333l86.016 0q0 105.984 75.008 180.992t180.992 75.008 180.992-75.008 75.008-180.992-75.008-180.992-180.992-75.008l0 171.989333-214.016-214.016 214.016-214.016 0 171.989333z" p-id="11703" fill="#ee8887"></path></svg>`

  function $(selector) {
    return document.querySelector(selector)
  }

  function $$(selector) {
    return document.querySelectorAll(selector)
  }

  function domParser(fragment) {
    if(!parse) {
      const range = document.createRange();
      parse = range.createContextualFragment.bind(range);
    }
    return parse(fragment)
  }

  function promiseFetch(url, data) {
    return new Promise((resolve, reject) => {
      fetch(url, data)
        .then(res => {
          if (res.ok) {
            resolve(res);
          } else {
            throw res;
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  class BooruDownloader {
    constructor() {
      this.batchCount = 0
      this.downloadLimit = 4
      this.hoverEl = null
      this.cacheImg = {} // {id: src}
      this.init()
    }

    init() {
      console.log('init BooruDownloader')
      if (REyandeResult || REkonachanResult) {
        let posts = $('#post-list-posts');
        if (!posts) return
        this.init_yande_konachan();
      }
      if (REdanbooruResult) {
        const posts = $('.posts-container')
        if(!posts) return
        this.init_danbooru();
      }
      if (REgelbooruResult) {
        const posts = $('.thumbnail-container')
        if(!posts) return
        this.init_gelbooru();
      }
      this.initStyle()
      this.initMenuPanel()
      this.initHotKey()
    }

    initStyle() {
      const styleCode = `
        :root {
                --primary-backgroundColor: #eee;
                --primary-lineBackgroundColor: #ccc;
                --primary-fontColor: #ee8887;
                --primary-fontColorHover: #ff4342;
                --primary-headerFontColor: #ffffff;
                --primary-border: 1px solid transparent;
            }
      
            [data-theme=light] .darkToggleIcon {
                display: none;
            }
            [data-theme=dark] .lightToggleIcon {
                display: none;
            }

            ul#post-list-posts {
               padding-bottom: 350px;
            }
        
            ul#post-list-posts li {
               float: none
            }
      
            div#posts {
               padding-bottom: 200px;
            }
            .imgItem {
                transition: .2s;
            }
            .imgItem:hover, .imgItem:focus {
                outline: 1px solid var(--primary-fontColor);
            }
            .imgItem img {
                transition: .2s;
             }
      
            .imgItemChecked {
                outline: 1px solid var(--primary-fontColor);
            }
      
            article.post-preview {
                float: none;
            }
      
            .helper-board {
                width: 450px;
                height: 320px;
                position: fixed;
                font-size: 12px;
                right: 10px;
                bottom: 4px;
                background: var(--primary-backgroundColor);
                color: var(--primary-fontColor);
                border: var(--primary-border);
                border-radius: 5px;
                overflow: hidden;
                transition: all cubic-bezier(.22,.58,.12,.98) .4s;
                box-shadow: 0 2px 12px 0 rgba(246, 150, 149, 0.6);
            }
      
            .helper-board.helper-board-small {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                bottom: 50vh;
                cursor: pointer;
                background: var(--primary-fontColor);
            }
      
            .helper-board.helper-board-small .board-header {
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }
            .helper-board.helper-board-small .board-header .board-close-button, .helper-board.helper-board-small .board-header .board-header-text, .helper-board.helper-board-small .theme-btn {
                display: none;
            }
            .helper-board.helper-board-small .board-header .board-header-small-tip {
                display: block;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                line-height: 50px;
                text-align: center;
                font-size: 26px;
            }
      
            .board-header {
                height: 30px;
                color: var(--primary-headerFontColor);
                background: var(--primary-fontColor);
                font-size: 16px;
            }
      
            .board-header-inner {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-right: 32px;
            }
      
             .board-content {
                overflow-y: auto;
                overflow-x: hidden;
                max-height: 340px;
                padding: 10px 12px 50px 12px;
                height: 100%;
                font-size: 14px;
            }
      
            .board-header-text {
                line-height: 30px;
                padding-left: 10px;
                font-size: 14px;
            }
      
            .board-close-button {
                position: absolute;
                top: 6px;
                right: 3px;
                width: 20px;
                height: 20px;
                margin: 0;
                padding: 0;
                cursor: pointer;
                transition: all .3s;
            }
      
            .board-close-button:hover {
                color: var(--primary-headerFontColor);
            }
            .board-header-small-tip {
                display: none;
            }
      
            .board-content-row {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                height: 20px;
            }
      
            .row-label {
                color: var(--primary-fontColor);
                margin-right: 8px;
            }
            .row-content {
                display: flex;
                align-items: center;
            }
            .hover-item-line {
                color: var(--primary-fontColor);
                text-decoration: underline!important;
                cursor: pointer;
            }
            .hover-item-line:hover {
                color: var(--primary-fontColorHover);
            }
            .hover-item {
                color: var(--primary-fontColor);
                cursor: pointer;
            }
            .hover-item:hover {
                color: var(--primary-fontColorHover);
            }
      
            .download-row-container {
                margin-top: 15px;
                padding-bottom: 15px;
            }
            .download-row {
                display: flex;
                align-items: center;
                margin-bottom: 5px;
            }
            .download-row-title {
                color: var(--primary-fontColor);
                margin-right: 10px;
            }
            .download-row-line {
                flex: 1;
                height: 4px;
                background: var(--primary-lineBackgroundColor);
                margin-right: 10px;
            }
            .download-row-line-active {
                height: 100%;
                background: var(--primary-fontColor);
                transition: width .4s ease;
            }
            .download-row-percent {
                color: var(--primary-fontColor);
                width: 50px;
            }
            .fav-state {
                margin-left: 7px;
                color: var(--primary-fontColor);
            }
            .re-try-icon svg {
                margin-left: 5px;
                cursor: pointer;
                transform: translateY(3px);
            }
      
            .theme-btn {
                background: none;
                border: none;
                color: var(--primary-headerFontColor);
                cursor: pointer;
                font-family: inherit;
                padding: 0;
                align-items: center;
                border-radius: 50%;
                display: flex;
                height: 100%;
                justify-content: center;
                transition: all 200ms;
            }
            .theme-btn:hover {
              background: #ebedf0;
              color: var(--primary-fontColor);
            }
            .imgTransform {
              opacity: 1!important;
              z-index: 999;
            }
            .imgTransform img {
              transform: scale(2.5, 2.5);
              transition: .2s;
            }
            .previewTip .imgItem {
               opacity: 0.5;
            }
            .imgTransform .thumb {
                position: absolute;
                z-index: 1;
            }
            .hide {
                width: 0;
                height: 0;
                display: none!important;
            }
      `
      GM_addStyle(styleCode)
    }

    init_yande_konachan() {
      let posts = $('#post-list-posts');
      let postsItems = posts.querySelectorAll('li');
      for (let i = 0; i < postsItems.length; i++) {
        postsItems[i].classList.add('imgItem');
        postsItems[i].firstElementChild.firstElementChild.setAttribute('onclick', 'return false');
        const template = `<div style="position: relative;text-align: center;"><input type="checkbox" class="checkbox"></div>`
        postsItems[i].insertAdjacentHTML('afterbegin', template);
        postsItems[i].addEventListener('mouseover', (e) => this.setTransition(e, 'mouseover', i))
        postsItems[i].addEventListener('mouseout', (e) => this.setTransition(e, 'mouseout', i))
      }
      posts.addEventListener('click', (e) => this.handleClickImg(e))
    }

    init_danbooru() {
      const posts = $('.posts-container')
      const postsItems = posts.querySelectorAll('article');
      for (let i = 0; i < postsItems.length; i++) {
        postsItems[i].classList.add('imgItem');
        postsItems[i].firstElementChild.setAttribute('onclick', 'return false');
        const template = `<div style="position: relative;text-align: center;"><input type="checkbox" class="checkbox"></div>`
        postsItems[i].insertAdjacentHTML('afterbegin', template);
        postsItems[i].addEventListener('mouseover', (e) => this.setTransition(e, 'mouseover', i))
        postsItems[i].addEventListener('mouseout', (e) => this.setTransition(e, 'mouseout', i))
      }
      posts.addEventListener('click', (e) => this.handleClickImg(e))
    }

    init_gelbooru() {
      const posts = $('.thumbnail-container')
      const postsItems = posts.querySelectorAll('article');
      for (let i = 0; i < postsItems.length; i++) {
        postsItems[i].classList.add('imgItem');
        postsItems[i].style.position = 'relative'
        postsItems[i].firstElementChild.setAttribute('onclick', 'return false');
        const template = `<div style="position: absolute; top: 0; text-align: center;"><input type="checkbox" class="checkbox"></div>`
        postsItems[i].insertAdjacentHTML('afterbegin', template);
        postsItems[i].addEventListener('mouseover', (e) => this.setTransition(e, 'mouseover', i))
        postsItems[i].addEventListener('mouseout', (e) => this.setTransition(e, 'mouseout', i))
      }
      posts.addEventListener('click', (e) => this.handleClickImg(e))
    }

    initMenuEvent() {
      const headerEl = $('.board-header')
      headerEl.onclick = function (e) {
        const boardEl = headerEl.parentNode
        if(boardEl.classList.contains('helper-board-small')) {
          boardEl.classList.remove('helper-board-small')
        } else {
          if(e.target.className === 'board-close-button') {
            boardEl.classList.add('helper-board-small')
          }
        }
      }
      const theme = localStorage.getItem('h-theme') || 'light'
      const showToolTip = localStorage.getItem('h-show-tooltip') || '1'
      this.setTheme(theme)
      this.handleToggleToolTip(showToolTip)

      $('.theme-btn').addEventListener('click', (e) => this.handleToggleTheme(e))
      $('#buttonSelectAll').addEventListener('click', (e) => this.handleClickMenuAllBtn())
      $('#downloadSample').addEventListener('click', (e) => this.handleDownLoadImg(e, 'sample'))
      $('#downloadOriginal').addEventListener('click', (e) => this.handleDownLoadImg(e, 'original'))
      $('#addFavorite').addEventListener('click', (e) => this.handleFavorite(true))
      $('#removeFavorite').addEventListener('click', (e) => this.handleFavorite(false))
      $('.fav-list-container').addEventListener('click', (e) => this.handleClickFavList(e, 'fav-list-container'))
      $('#showToolTipBtn').addEventListener('click', (e) => {
        const newShowToolTip = localStorage.getItem('h-show-tooltip') === '1' ? '0' : '1'
        this.handleToggleToolTip(newShowToolTip)
      })
    }

    initMenuPanel() {
      const template = `
        <div class="helper-board">
         <div class="board-header">
            <div class="board-header-inner">
              <div class="board-header-text">Booru-Selector-Downloader</div>
              <button class="theme-btn"
                      type="button"
                      title="Change Theme">
                <svg viewBox="0 0 24 24" width="20" height="20" class="lightToggleIcon">
                  <path fill="currentColor" d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"></path>
                </svg>
                <svg viewBox="0 0 24 24" width="20" height="20" class="darkToggleIcon">
                  <path fill="currentColor" d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"></path>
                </svg>
              </button>
            </div>
            <div class="board-close-button" title="Close">X</div>
            <div class="board-header-small-tip">H</div>
          </div>
          <div class="board-content">
            <div class="board-content-row">
              <div class="row-label hover-item" id="buttonSelectAll" title="Hotkey Q">Select All 0 Image</div>
            </div>
            <div class="board-content-row">
              <div class="row-label hover-item" id="downloadSample" title="Hotkey S">Download Sample</div>
            </div>
            <div class="board-content-row">
              <div class="row-label hover-item" id="downloadOriginal" title="Hotkey X">Download Original</div>
            </div>
            <div class="board-content-row">
              <div class="row-label hover-item" id="addFavorite" title="Hotkey F">Add To Favorite</div>
            </div>
            <div class="board-content-row">
              <div class="row-label hover-item" id="removeFavorite" title="Hotkey R">Remove From Favorite</div>
            </div>
            <div class="board-content-row">
              <div class="row-label hover-item" id="showToolTipBtn" title="Hotkey Shift + MouseHover On Image">Show Preview ToolTip: <span>[On]</span></div>
            </div>
            <div class="board-content-row">
              <div class="row-label">Release Note: </div>
              <a class="row-content hover-item-line" href="https://greasyfork.org/zh-CN/scripts/371605-booru-selector-downloader" target="_blank">v4.0.1</a>
            </div>
            <div class="fav-list-container"></div>
            <div class="download-row-container"></div>
          </div>
        </div>
      `
      document.body.insertAdjacentHTML('beforeend', template)
      this.initMenuEvent()
    }

    initHotKey() {
      window.addEventListener('keydown', (e) => this.hotKeyHandler(e), false)
      window.addEventListener('keyup', (e) => this.handleKeyUp(e), false)
    }

    /**
     * @param   {KeyboardEvent}   e
     * */
    async hotKeyHandler(e) {
      // ignore input event
      if(e.target && e.target.tagName === 'INPUT') return

      // press key `A` or `D` to paginate
      let pageRight = $('#paginator > div > a.next_page')
      let pageLeft = $('#paginator > div > a.previous_page')
      if (REgelbooruResult) {
        pageRight = $('#paginator b').previousElementSibling
        pageLeft = $('#paginator b').nextElementSibling
      }
      // `A`, `D`: paginate(only for yande.re and danbooru)
      if (e.key === 'd' && pageRight) {
        pageRight.click()
      }
      if (e.key === 'a' && pageLeft) {
        pageLeft.click()
      }

      // `Q`: Select all, Deselect all
      if (e.key === 'q') {
        this.handleClickMenuAllBtn()
      }

      // `F`: Favorite
      if (e.key === 'f') {
        this.handleFavorite(true)
      }
      // `R`: Remove from favorites
      if (e.key === 'r') {
        this.handleFavorite(false)
      }

      // `S`: Save sample image
      if (e.key === 's') {
        this.handleDownLoadImg(null, 'sample').then(res => {})
      }
      // `X`: Save original image
      if (e.key === 'x') {
        this.handleDownLoadImg(null, 'original').then(res => {})
      }
      // 'Shift': Show larger image tool tip
      if (e.key === 'Shift') {
        let posts = null
        let el = this.hoverEl
        if (el) {
          this.hoverEl.classList.add('imgTransform')
        }
        if (REyandeResult || REkonachanResult) {
          posts = $('#post-list-posts');
        }
        if (REdanbooruResult) {
          posts = $('.posts-container')
          if (el) {
            const id = Number(el.getAttribute('data-id'))
            if (!this.cacheImg.hasOwnProperty(id)) {
              this.cacheImg[id] = ''
              const imgInfo = await this.fetchDetailPage(id)
              const sample = imgInfo.sample
              this.cacheImg[id] = sample
              el.querySelector('source').srcset = sample
              el.querySelector('img').src = sample
            }
            el.classList.add('imgTransform')
          }
        }
        if (REgelbooruResult) {
          posts = $('.thumbnail-container')
          if (el) {
            const id = Number(el.querySelector('a').getAttribute('id').replace('p', ''))
            if (!this.cacheImg.hasOwnProperty(id)) {
              this.cacheImg[id] = ''
              const imgInfo = await this.fetchDetailPage(id)
              const sample = imgInfo.sample
              this.cacheImg[id] = sample
              el.querySelector('img').src = sample
            }
          }
        }
        posts.classList.add('previewTip')
      }
    }

    /**
     * @param   {KeyboardEvent}   e
     * */
    handleKeyUp(e) {
      // ignore input event
      if(e.target && e.target.tagName === 'INPUT') return

      // 'Shift': close larger image tool tip
      if (e.key === 'Shift') {
        if (this.hoverEl) {
          this.hoverEl.classList.remove('imgTransform')
        }
        let posts = null
        if (REyandeResult || REkonachanResult) {
          posts = $('#post-list-posts');
        }
        if (REdanbooruResult) {
          posts = $('.posts-container')
        }
        if (REgelbooruResult) {
          posts = $('.thumbnail-container')
        }
        posts.classList.remove('previewTip')
      }
    }

    handleToggleTheme(e) {
      const theme = document.body.getAttribute('data-theme')
      theme === 'light' ? this.setTheme('dark') : this.setTheme('light')
    }

    /**
     * @param   {string}    theme  light | dark
     * */
    setTheme(theme) {
      if(theme === 'light') {
        const lightTheme = [
          {key: 'backgroundColor', value: '#eee'},
          {key: 'lineBackgroundColor', value: '#ccc'},
          {key: 'fontColor', value: '#ee8887'},
          {key: 'fontColorHover', value: '#ff4342'},
          {key: 'headerFontColor', value: '#ffffff'},
          {key: 'border', value: '1px solid #fbe0df'},
        ]
        lightTheme.forEach(item => this.setCssVariable(item))
        document.body.setAttribute('data-theme', 'light')
        localStorage.setItem('h-theme', 'light')
      } else {
        const darkTheme = [
          {key: 'backgroundColor', value: '#222'},
          {key: 'lineBackgroundColor', value: '#ccc'},
          {key: 'fontColor', value: '#ee8887'},
          {key: 'fontColorHover', value: '#ffffff'},
          {key: 'headerFontColor', value: '#ffffff'},
          {key: 'border', value: '1px solid #ee8887'},
        ]
        darkTheme.forEach(item => this.setCssVariable(item))
        document.body.setAttribute('data-theme', 'dark')
        localStorage.setItem('h-theme', 'dark')
      }
    }

    setCssVariable({ key, value }) {
      const propertyName = `--primary-${key}`;
      document.documentElement.style.setProperty(propertyName, value);
    }

    handleClickMenuAllBtn() {
      const btn = $('#buttonSelectAll')
      if (this.batchCount >= 1) {
        btn.innerHTML = "DeselectAll  " + this.batchCount + " Image";
        this.deselectAll()
      } else {
        btn.innerHTML = "SelectAll  " + this.batchCount + " Image";
        this.selectAll()
      }
    }

    /**
     * @param   {Event}     e
     * @param   {string}   type   sample | original
     * */
    async handleDownLoadImg(e, type = 'sample') {
      const postsItems = $$('.imgItemChecked');
      let imgs = []
      if(postsItems.length) {
        this.updateFetchingProgress(0, postsItems.length)
      }
      for (let i = 0; i < postsItems.length; i++) {
        let id = 0
        if (REyandeResult || REkonachanResult) {
          id = Number(postsItems[i].getAttribute('id').replace('p', ''))
        }
        if (REdanbooruResult) {
          id = Number(postsItems[i].getAttribute('data-id'))
        }
        if (REgelbooruResult) {
          id = Number(postsItems[i].querySelector('a').getAttribute('id').replace('p', ''))
        }
        const imgInfo = await this.fetchDetailPage(id)
        imgs.push({
          id,
          url: imgInfo[type],
          fileName: `${id}${re3.exec(imgInfo[type])[0]}`
        })
        this.updateFetchingProgress(i + 1, postsItems.length)
      }
      this.createDownloadProgress(imgs)
      // downloadPool
      await this.downloadPool(imgs)
    }

    updateFetchingProgress(i, total) {
      const el = $('#fetching-download-row')
      if(!el) {
        const downloadElContainer = $('.download-row-container')
        const template = `
        <div id="fetching-download-row" class="download-row">
          <div class="download-row-title">Fetching</div>
          <div class="download-row-line">
            <div class="download-row-line-active" style="width: 0%;"></div>
          </div>
          <div class="download-row-percent">${i}/${total}</div>
        </div>
        `
        downloadElContainer.insertAdjacentHTML('afterbegin', template)
      } else {
        const width = (Math.round(i / total * 10000) / 100.00);
        el.querySelector('.download-row-line-active').style.width = `${width}%`
        el.querySelector('.download-row-percent').innerText = `${i}/${total}`
      }
    }

    async downloadPool(imgs = []) {
      for (let i = 0; i < imgs.length; i++) {
        this.updateDownloadProgress(imgs[i])
      }
      let pool = []
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i]
        const task = this.downloadHandler(img)
        pool.push(task)
        task
          .then((id) => {
            console.log(`${ id } ok`)
          })
          .catch((id) => {
            console.log(`${ id } error`)
          })
          .finally(() => {
            pool.splice(pool.indexOf(task), 1)
          })
        if (pool.length === this.downloadLimit) {
          await Promise.race(pool)
        }
      }
    }

    downloadHandler(img) {
      // see GM_download:  https://www.tampermonkey.net/documentation.php#GM_download
      return new Promise((resolve, reject) => {
        const arg = {
          url: img.url,
          name: img.fileName,
          onprogress: (xhr) => {
            this.downloadProgress(xhr, img.id, false)
            if(Math.floor(xhr.loaded / xhr.total * 100) >= 100) {
              resolve(img.id)
            }
          },
          onload: () => {
            resolve(img.id)
            this.downloadProgress(null, img.id, true)
          },
          onerror: () => {
            // still resolve
            resolve(img.id)
            this.onDownloadError(img)
          },
          ontimeout: () => {
            // still resolve
            resolve(img.id)
            this.onDownloadError(img)
          }
        }
        GM_download(arg)
      })
    }

    /**
     * @param   {Array}   imgs
     * */
    createDownloadProgress(imgs) {
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i]
        const pageUrl = this.getPageUrl(img.id)
        const downloadRowEl = $(`#download-row-${img.id}`)
        if(!downloadRowEl) {
          // create downloadRow
          const downloadList = $('.download-row-container')
          const template = `
            <div id="download-row-${img.id}" class="download-row">
               <a href="${pageUrl}" class="download-row-title hover-item-line" target="_blank">${img.id}</a>
               <div class="download-row-line">
                 <div class="download-row-line-active" style="width: 0%;"></div>
               </div>
               <div class="download-row-percent">0%</div>
            </div>
         `
          downloadList.insertAdjacentHTML('beforeend', template)
        }
      }
    }

    updateDownloadProgress({id, url, fileName}) {
      const downloadRowEl = $(`#download-row-${id}`)
      if(!downloadRowEl) {
        // create downloadRow
        const downloadList = $('.download-row-container')
        const pageUrl = this.getPageUrl(id)
        const template = `
            <div id="download-row-${id}" class="download-row">
               <a href="${pageUrl}" class="download-row-title hover-item-line" target="_blank">${id}</a>
               <div class="download-row-line">
                 <div class="download-row-line-active" style="width: 0%;"></div>
               </div>
               <div class="download-row-percent">0%</div>
            </div>
         `
        downloadList.insertAdjacentHTML('beforeend', template)
      }
    }

    onDownloadError(img) {
      const downloadRowEl = $(`#download-row-${img.id}`)
      const el = downloadRowEl.querySelector('.download-row-percent')
      if(!el.classList.contains('hover-item')) {
        el.classList.add('hover-item')
      }
      el.innerHTML = reTrySvgIcon
      el.onclick = this.downloadHandler(img)
    }

    /**
     * @param     {ProgressEventInit | null}   xhr
     * @param     {number}                      id
     * @param     {boolean}                     isFinished
     * */
    downloadProgress(xhr, id, isFinished = false) {
      let width = 0
      if (xhr === null && isFinished) {
        width = 100
      } else {
        width = xhr.lengthComputable ? Math.floor(xhr.loaded / xhr.total * 100) : 0;
      }

      const downloadRowEl = $(`#download-row-${ id }`)
      if (!downloadRowEl) {
        // create downloadRow
        const downloadList = $('.download-row-container')
        const pageUrl = this.getPageUrl(id)
        const template = `
            <div id="download-row-${ id }" class="download-row">
               <a href="${ pageUrl }" class="download-row-title hover-item-line" target="_blank">${ id }</a>
               <div class="download-row-line">
                 <div class="download-row-line-active" style="width: ${ width }%;"></div>
               </div>
               <div class="download-row-percent">${ width }%</div>
            </div>
         `
        downloadList.insertAdjacentHTML('beforeend', template)
      } else {
        // update downloadRow
        downloadRowEl.querySelector('.download-row-title').innerText = id
        downloadRowEl.querySelector('.download-row-line-active').style.width = `${ width }%`
        downloadRowEl.querySelector('.download-row-percent').innerText = `${ width }%`
      }
    }

    /**
     * @param   {number}    id
     * @return  {string}
     * */
    getPageUrl(id) {
      let pageUrl = ``
      if(REyandeResult || REkonachanResult) {
        pageUrl = `${locationUrl}/post/show/${id}`
      }
      if(REdanbooruResult) {
        pageUrl = `${locationUrl}/posts/${id}`
      }
      if(REgelbooruResult) {
        pageUrl = `${locationUrl}/index.php?page=post&s=view&id=${id}`
      }
      return pageUrl
    }

    /**
     * @param   {string}    showCode  '0' | '1'
     * */
    handleToggleToolTip(showCode) {
      let preViewEl = null, infoEl = null;
      if (REyandeResult || REkonachanResult) {
        preViewEl = $('#index-hover-overlay')
        infoEl = $('#index-hover-info')
      }
      if (REdanbooruResult) {
        preViewEl = $('#post-tooltips')
      }
      if (showCode === '0') {
        preViewEl && preViewEl.classList.remove('hide')
        infoEl && infoEl.classList.remove('hide')
      } else if (showCode === '1') {
        preViewEl && preViewEl.classList.add('hide')
        infoEl && infoEl.classList.add('hide')
      }
      $('#showToolTipBtn span').innerText = showCode === '0' ? '[OFF]' : '[ON]'
      localStorage.setItem('h-show-tooltip', showCode)
    }

    /**
     * @param   {boolean}   isLike
     * */
    handleFavorite(isLike) {
      const postsItems = $$('.imgItemChecked');
      for (let i = 0; i < postsItems.length; i++) {
        let id = 0
        if (REyandeResult || REkonachanResult) {
          id = Number(postsItems[i].getAttribute('id').replace('p', ''))
        }
        if (REdanbooruResult) {
          id = Number(postsItems[i].getAttribute('data-id'))
        }
        if (REgelbooruResult) {
          id = Number(postsItems[i].querySelector('a').getAttribute('id').replace('p', ''))
        }
        this.fetchFavorite(id, isLike)
      }
    }

    /**
     * @param   {number}      id
     * @param   {boolean}     isLike
     * */
    fetchFavorite(id, isLike) {
      let url = ``
      let data = {}

      if (REyandeResult || REkonachanResult) {
        url = `${ locationUrl }/post/vote.json`
        const csrfToken = $("meta[name=csrf-token]").content
        data = {
          "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-csrf-token": csrfToken,
          },
          "body": `id=${ id }&score=${ isLike ? 3 : 2 }`,
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        }
      }

      if (REdanbooruResult) {
        url = isLike ? `${ locationUrl }/favorites?post_id=${ id }` : `${ locationUrl }/favorites/${id}`
        const csrfToken = $("meta[name=csrf-token]").content
        data = {
          "headers": {
            "accept": "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
            "x-csrf-token": csrfToken,
            "x-requested-with": "XMLHttpRequest"
          },
          "body": null,
          "method": isLike ? "POST" : "DELETE",
          "mode": "cors",
          "credentials": "include"
        }
      }

      if (REgelbooruResult) {
        url = isLike ? `${ locationUrl }/public/addfav.php?id=${id}` : `${ locationUrl }/index.php?page=favorites&s=delete&id=${id}`
        data = {
          "headers": {
            "accept": "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
            "x-requested-with": "XMLHttpRequest"
          },
          "body": null,
          "method": "GET",
          "mode": "cors",
          "credentials": "include"
        }
      }

      promiseFetch(url, data)
        .then(res => {
          if (res.status === 200) {
            const log = {
              id,
              isLike,
              result: 'success',
            }
            this.addFavoriteLog(log)
          }
        })
        .catch(e => {
          const log = {
            id,
            isLike,
            result: 'error',
          }
          this.addFavoriteLog(log)
          console.error('add favorite error')
        })
    }

    handleClickFavList(e, parentClassName) {
      let el = e.target
      let hasEl = false
      while (el !== document && el.className !== parentClassName) {
        // click re-try-icon to re add favorite
        if (el.className === 're-try-icon') {
          hasEl = true
          break;
        }
        el = el.parentNode
      }
      if(!hasEl) return

      const id = Number(el.getAttribute('data-id'))
      const isLike = el.getAttribute('data-isLike') === 'true'
      this.fetchFavorite(id, isLike)
    }

    /**
     * @param   {number}      log.id
     * @param   {boolean}     log.isLike
     * @param   {string}      log.result    success | error
     * */
    addFavoriteLog(log) {
      const { id, isLike, result } = log
      const el = $('.fav-list-container')
      const logItemEl = $(`#favLog${id}`)
      if(!logItemEl) {
        const pageUrl = this.getPageUrl(id)
        const elItem = document.createElement('div')
        elItem.className = 'board-content-row'
        elItem.id = `favLog${id}`
        elItem.innerHTML = `
        <div class="row-label">${isLike ? 'Add' : 'Remove'} Favorites: </div>
        <div class="row-content">
          <a class="hover-item-line" href="${pageUrl}" target="_blank">${id}</a>
          <span class="fav-state">${result === 'success' ? 'Success' : 'Error'}</span>
          ${ result === 'error' ? `<span data-id="${id}" data-isLike="${String(isLike)}" class="re-try-icon">${reTrySvgIcon}</span>` : '' }
        </div>`
        el.appendChild(elItem)
      } else {
        logItemEl.querySelector('.row-label').innerText = isLike ? 'Add Favorites: ' : 'Remove Favorites: '
        logItemEl.querySelector('.fav-state').innerText = result === 'success' ? 'Success' : 'Error'
        let iconEl = logItemEl.querySelector('.re-try-icon')
        if(result === 'success') {
          // remove re-icon
          if(iconEl) iconEl.remove()
        } else if(result === 'error') {
          iconEl
            ? iconEl.setAttribute('data-isLike', String(isLike))
            : logItemEl.querySelector('.row-content').insertAdjacentHTML('beforeend', `<span data-id="${id}" data-isLike="${String(isLike)}" class="re-try-icon">${reTrySvgIcon}</span>`);
        }
      }
    }

    /**
     * @interface     imgInfo
     * @param         {number}      id
     * @return        {Promise<imgInfo | Error>}
     * */
    fetchDetailPage(id) {
      const link = this.getPageUrl(id)
      return new Promise((resolve, reject) => {
        let imgInfo = {
          sample: '',
          original: '',
        }
        if(REyandeResult || REkonachanResult) {
          promiseFetch(link)
            .then(res => res.text())
            .then(res => {
              const bodyText = res
              const dom = domParser(bodyText)
              const sampleSrc = dom.querySelector('#image').src
              const originalSrc = dom.querySelector('#highres').href
              imgInfo = {
                sample: sampleSrc,
                original: originalSrc,
              }
              resolve(imgInfo)
            }).catch(e => {
            console.log(e)
            reject(e)
          })
        }
        if(REdanbooruResult) {
          promiseFetch(link)
            .then(res => res.text())
            .then(res => {
              const bodyText = res
              const dom = domParser(bodyText)
              const sampleSrc = dom.querySelector('#image').src
              const originalEl = dom.querySelector('.image-view-original-link')
              const originalSrc = originalEl ? originalEl.href : sampleSrc
              imgInfo = {
                sample: sampleSrc,
                original: originalSrc,
              }
              resolve(imgInfo)
            }).catch(e => {
            console.log(e)
            reject(e)
          })
        }

        if(REgelbooruResult) {
          promiseFetch(link)
            .then(res => res.text())
            .then(res => {
              const bodyText = res
              const dom = domParser(bodyText)
              const sampleSrc = dom.querySelector('#image').src
              const originalEl = dom.querySelector("a[rel='noopener']")
              const originalSrc = originalEl ? originalEl.href : sampleSrc
              imgInfo = {
                sample: sampleSrc,
                original: originalSrc,
              }
              resolve(imgInfo)
            }).catch(e => {
            console.log(e)
            reject(e)
          })
        }
      })
    }

    handleClickImg(e) {
      let el = e.target
      let hasEl = false
      while (el !== document) {
        if ((REyandeResult || REkonachanResult) && el.tagName.toLowerCase() === 'li') {
          hasEl = true
          break;
        }
        if ((REdanbooruResult || REgelbooruResult) && el.tagName.toLowerCase() === 'article') {
          hasEl = true
          break;
        }
        el = el.parentNode
      }
      if(!hasEl) return;

      // press ctrlKey: open in new window, loadInBackground true, won't auto focus
      if(e.ctrlKey) {
        let link = ``
        if(REyandeResult || REkonachanResult) {
          link = el.querySelector('a.thumb').href
        }
        if(REdanbooruResult) {
          link = el.querySelector('a.post-preview-link').href
        }
        if(REgelbooruResult) {
          link = el.querySelector('a').href
        }
        GM_openInTab(link, true)
        return;
      }
      // press altKey: open in new window, loadInBackground false, will auto focus
      if(e.altKey) {
        let link = ``
        if(REyandeResult || REkonachanResult) {
          link = el.querySelector('a.thumb').href
        }
        if(REdanbooruResult) {
          link = el.querySelector('a.post-preview-link').href
        }
        if(REgelbooruResult) {
          link = el.querySelector('a').href
        }
        GM_openInTab(link, false)
        return;
      }

      const cbEl = el.getElementsByClassName('checkbox')[0]
      cbEl.checked = !cbEl.checked
      cbEl.checked ? el.classList.add('imgItemChecked') : el.classList.remove('imgItemChecked')
      this.updateBatchCount()
    }

    /**
     * @param   {MouseEvent}     e
     * @param   {string}         mouseEventName  mouseover | mouseout
     * **/
    async setTransition(e, mouseEventName) {
      let el = e.target
      let hasEl = false
      while (el !== document) {
        if ((REyandeResult || REkonachanResult) && el.tagName.toLowerCase() === 'li') {
          hasEl = true
          break;
        }
        if ((REdanbooruResult || REgelbooruResult) && el.tagName.toLowerCase() === 'article') {
          hasEl = true
          break;
        }
        el = el.parentNode
      }
      if(!hasEl) return;

      if(mouseEventName === 'mouseout') {
        el.classList.remove('imgTransform')
        this.hoverEl = null
      }
      if(mouseEventName === 'mouseover') {
        this.hoverEl = el
      }
    }

    updateBatchCount() {
      let checked = 0;
      $$('.checkbox').forEach(function (checkbox) {
        if (checkbox.checked) {
          ++checked;
        }
      });
      this.batchCount = checked;
      const btn = $('#buttonSelectAll')
      if (this.batchCount >= 1) {
        btn.innerHTML = "DeselectAll  " + this.batchCount + " Image";
      } else {
        btn.innerHTML = "SelectAll  " + this.batchCount + " Image";
      }
    }

    selectAll() {
      $$('.checkbox').forEach(function (checkbox) {
        checkbox.checked = true;
        checkbox.parentNode.parentNode.classList.add('imgItemChecked');
      });
      this.updateBatchCount();
    }

    deselectAll() {
      $$('.checkbox').forEach(function (checkbox) {
        checkbox.checked = false;
        checkbox.parentNode.parentNode.classList.remove('imgItemChecked');
      });
      this.updateBatchCount();
    }
  }

  const booruDownloader = new BooruDownloader()
  window.booruDownloader = booruDownloader
})();
