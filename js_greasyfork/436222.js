// ==UserScript==
// @name         ニコニコ動画 スクリーンショット
// @namespace    https://midra.me
// @version      1.1.1
// @description  ニコニコ動画のスクリーンショットをコメント付きで撮れるスクリプト
// @author       Midra
// @license      MIT
// @match        https://www.nicovideo.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @run-at       document-start
// @noframes
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=156587
// @downloadURL https://update.greasyfork.org/scripts/436222/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/436222/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88.meta.js
// ==/UserScript==

(() => {
  'use strict'

  const isSafari = navigator.vendor === 'Apple Computer, Inc.'

  //----------------------------------------
  // 設定初期化
  //----------------------------------------
  const configInitData = {
    format: {
      label: '形式',
      type: 'select',
      default: 'png',
      options: {
        jpeg: 'JPEG (.jpg)',
        png: 'PNG (.png)',
      },
    },
    resolution: {
      label: '解像度',
      type: 'select',
      default: 'r_1080p',
      options: {
        r_1080p: '1080p',
        r_720p: '720p',
        r_480p: '480p',
        r_360p: '360p',
      },
    },
    target: {
      label: '対象',
      type: 'select',
      default: 'all',
      options: {
        all: '動画 + コメント',
        videoOnly: '動画のみ',
        commentOnly: 'コメントのみ',
      },
    },
  }
  if (!isSafari) {
    const CtrlCmdKey = /Mac OS X/.test(navigator.userAgent) ? '⌘' : 'Ctrl'
    configInitData.copyShortcuts = {
      label: `「${CtrlCmdKey} + C」でスクリーンショットをコピーする`,
      type: 'checkbox',
      default: false,
    }
  }
  GM_config.init('ニコニコ動画 スクリーンショット 設定', configInitData)

  GM_config.onload = () => {
    setTimeout(() => {
      alert('設定を反映させるにはページを再読み込みしてください。')
    }, 200)
  }

  GM_registerMenuCommand('設定', GM_config.open)

  // 設定取得
  const config = {}
  Object.keys(configInitData).forEach(v => { config[v] = GM_config.get(v) })
  console.log('[NS] config:', config)

  if (!location.pathname.startsWith('/watch/')) return

  //----------------------------------------
  // NSオブジェクト
  //----------------------------------------
  const NS = {
    get video() {
      const elem = document.body.querySelector('#MainVideoPlayer > video')
      return elem instanceof HTMLVideoElement ? elem : undefined
    },
    get commentCanvas() {
      const elem = document.body.querySelector('.CommentRenderer > canvas')
      return elem instanceof HTMLCanvasElement ? elem : undefined
    },
    get pauseButton() {
      const elem = document.body.querySelector('.PlayerPauseButton')
      return elem instanceof HTMLButtonElement ? elem : undefined
    },

    /** @type {string} */
    get format() {
      return ['png', 'jpeg', 'webp'].includes(config['format']) ? config['format'] : 'png'
    },
    /** @type {{ width: number; height: number; }} */
    get resolution() {
      return {
        'r_1080p': {
          width: 1920,
          height: 1080,
        },
        'r_720p': {
          width: 1280,
          height: 720,
        },
        'r_480p': {
          width: 854,
          height: 480,
        },
        'r_360p': {
          width: 640,
          height: 360,
        },
      }[config['resolution']]
    },

    /****************************************
     * スクリーンショットを取得
     * @returns {Promise<HTMLCanvasElement | undefined>} Canvs形式のスクリーンショット
     */
    async getScreenshot() {
      switch (config['target']) {
        case 'all': {
          return await this.renderScreenshot(this.video, this.commentCanvas)
        }
        case 'videoOnly': {
          return await this.renderScreenshot(this.video, null)
        }
        case 'commentOnly': {
          return await this.renderScreenshot(null, this.commentCanvas)
        }
      }
    },

    /****************************************
     * スクリーンショットをCanvasに描画
     * @param {HTMLVideoElement | null | undefined} video 動画
     * @param {HTMLCanvasElement | null | undefined} comment コメント
     * @returns {Promise<HTMLCanvasElement | undefined>} Canvs形式のスクリーンショット
     */
    async renderScreenshot(video, comment) {
      if (
        !(video instanceof HTMLVideoElement) &&
        !(comment instanceof HTMLCanvasElement)
      ) return

      // Canvas生成
      const canvas = document.createElement('canvas')
      canvas.width = NS.resolution.width
      canvas.height = NS.resolution.height

      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#0000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      try {
        // 動画をCanvasに描画
        if (video instanceof HTMLVideoElement) {
          ctx.fillStyle = '#000'
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          const videoImg = await this.util.generateImageElement(video)
          if (videoImg !== undefined) {
            const diffX = (canvas.width - videoImg.naturalWidth * (canvas.height / videoImg.naturalHeight)) / 2
            const video_dx = diffX > 0 ? diffX : 0
            const video_dw = diffX > 0 ? canvas.width - (diffX * 2) : canvas.width
            ctx.drawImage(videoImg, video_dx, 0, video_dw, canvas.height)
          }
        }
        // コメントをCanvasに描画
        if (comment instanceof HTMLCanvasElement) {
          const hRatio = canvas.width / comment.width
          const vRatio = canvas.height / comment.height
          const ratio = Math.min(hRatio, vRatio)
          ctx.drawImage(
            comment,
            0, 0,
            comment.width, comment.height,
            0, 0,
            comment.width * ratio, comment.height * ratio
          )
        }

        return canvas
      } catch (e) {
        console.error(e)
      }
    },

    util: {
      /****************************************
       * HTMLテキストから要素を生成
       * @param {string} html HTMLテキスト
       * @returns {HTMLElement} 生成した要素
       */
      generateElementByHTML(html) {
        const elem = document.createElement('div')
        elem.insertAdjacentHTML('beforeend', html)
        return elem.firstElementChild
      },

      /****************************************
       * 要素から画像要素を生成
       * @param {HTMLElement} elem 要素
       * @param {string | undefined} format 形式
       * @returns {Promise<HTMLImageElement | undefined>}
       */
      async generateImageElement(elem, format = 'png') {
        return new Promise((resolve, reject) => {
          /** @type {HTMLCanvasElement | undefined} */
          let canvas
          try {
            if (elem instanceof HTMLVideoElement) {
              canvas = document.createElement('canvas')
              canvas.width = elem.videoWidth
              canvas.height = elem.videoHeight
              canvas.getContext('2d').drawImage(elem, 0, 0, canvas.width, canvas.height)
            }
            else if (elem instanceof HTMLCanvasElement) {
              canvas = elem
            }
          } catch (e) {
            reject(e)
          }

          if (canvas !== undefined) {
            const img = document.createElement('img')
            img.onload = () => resolve(img)
            img.onerror = e => reject(e)
            img.src = canvas.toDataURL(`image/${format}`)
          }
          else {
            reject('[NS] ERROR: canvas is undefined')
          }
        })
      },
    },
  }

  unsafeWindow.NS = NS

  //----------------------------------------
  // ショートカットキー
  //----------------------------------------
  if (config['copyShortcuts']) {
    window.addEventListener('keydown', async e => {
      if (
        (e.ctrlKey && e.metaKey || e.metaKey && !e.ctrlKey) && e.key === 'c' &&
        !(document.activeElement instanceof HTMLInputElement) &&
        !(document.activeElement instanceof HTMLTextAreaElement) &&
        document.activeElement?.closest('.PlayerContainer') !== null
      ) {
        e.preventDefault()
        e.stopImmediatePropagation()

        const canvas = await NS.getScreenshot()
        canvas.toBlob(async blob => {
          const data = [new ClipboardItem({ ['image/png']: blob })]
          await navigator.clipboard.write(data)
        })
      }
    }, { passive: false })
  }

  //----------------------------------------
  // 監視
  //----------------------------------------
  const obs_opt = {
    childList: true,
    subtree: true,
  }
  const obs = new MutationObserver(mutationRecord => {
    for (const { addedNodes } of mutationRecord) {
      for (const added of addedNodes) {
        if (!(added instanceof HTMLElement)) continue
        if (added.classList.contains('ContextMenu-wrapper')) {
          obs.disconnect()

          // スクリーンショットボタンを右クリックメニューに追加
          const menuContainer = added.getElementsByClassName('VideoContextMenuContainer')[0]
          const screenShotMenu = NS.util.generateElementByHTML(
            `
            <div class="VideoContextMenu-group">
              <div class="ContextMenuItem" data-ns="ss-newtab">スクリーンショット (新しいタブ)</div>
              <div class="ContextMenuItem" data-ns="ss-clipboard">スクリーンショット (クリップボード)</div>
              <div class="ContextMenuItem" data-ns="settings">スクリーンショット 設定</div>
            </div>
            `
          )
          // Safariはクリップボードのコピーでエラー出るため
          if (isSafari) {
            screenShotMenu.querySelector('.ContextMenuItem[data-ns="ss-clipboard"]').remove()
          }
          screenShotMenu.addEventListener('click', async ({ target }) => {
            if (
              !(target instanceof HTMLElement) ||
              target.dataset.ns === undefined
            ) return

            const canvas = await NS.getScreenshot()

            switch (target.dataset.ns) {
              case 'ss-newtab': {
                NS.pauseButton?.click()

                const img = await NS.util.generateImageElement(canvas, NS.format)
                img.style.setProperty('max-width', '100%')
                img.style.setProperty('max-height', '100%')

                const newTab = window.open()
                newTab.document.body.appendChild(img)
                break
              }
              case 'ss-clipboard': {
                canvas.toBlob(async blob => {
                  const data = [new ClipboardItem({ ['image/png']: blob })]
                  await navigator.clipboard.write(data)
                })
                break
              }
              case 'settings': {
                GM_config.open()
                break
              }
            }
          })
          menuContainer?.appendChild(screenShotMenu)

          obs.observe(document.body, obs_opt)
        }
      }
    }
  })
  obs.observe(document.body, obs_opt)
})()