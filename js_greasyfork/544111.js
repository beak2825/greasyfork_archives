// ==UserScript==
// @name         MidiShowDownload
// @namespace    https://lgc2333.top/
// @version      0.2.0
// @description  MidiShow免积分下载
// @author       LgCookie
// @homepage     https://github.com/lgc2333/GM/blob/main/packages/MidiShowDownload
// @match        https://www.midishow.com/midi/*
// @match        https://www.midishow.com/zh-tw/midi/*
// @match        https://www.midishow.com/en/midi/*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544111/MidiShowDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/544111/MidiShowDownload.meta.js
// ==/UserScript==

/* global $ JZZ PNotify */

;(function () {
  'use strict'

  const NAME = 'MidiShowDownload'

  /** @type {string | null} */
  let cachedDataURL = null

  /**
   * @param {string} str
   * @returns {Uint8Array}
   */
  function transformData(str) {
    const arr = new Uint8Array(str.length)
    for (let i = 0; i < str.length; i++) arr[i] = str.charCodeAt(i)
    return arr
  }

  const originalSMF = JZZ.MIDI.SMF
  const patchedSMF = /** @type {JZZ.MIDI.SMFConstructor} */ (
    /** @this {JZZ.MIDI.SMF} */
    function (data) {
      const blob = new Blob([transformData(data)], { type: 'audio/midi' })
      const url = URL.createObjectURL(blob)
      if (cachedDataURL) URL.revokeObjectURL(cachedDataURL)
      cachedDataURL = url
      PNotify.success(`[${NAME}] 成功截获文件`)
      return originalSMF.apply(this, [data])
    }
  )
  JZZ.MIDI.SMF = patchedSMF

  /**
   * @param {string} url
   * @param {string} filename
   */
  function openSaveDialog(url, filename) {
    const el = document.createElement('a')
    el.href = url
    el.download = filename
    el.target = '_blank'
    el.click()
  }

  async function download() {
    const e = $('.ms-player-container')
    const player = /** @type {JZZ.gui.Player | undefined} */ (
      e.JzzPlayer().data('plugin_JzzPlayer')
    )
    if (!player) {
      PNotify.error(`[${NAME}] 无法获取播放器实例`)
      return
    }

    if (!cachedDataURL) {
      await player.loadUrl()
    }
    if (!cachedDataURL) {
      PNotify.error(`[${NAME}] 截获文件失败`)
      return
    }

    const id = /** @type {string} */ (e.data('id'))
    const title = e.find('h1.pl-md-player').text().trim()
    openSaveDialog(cachedDataURL, `${id} - ${title}.mid`)
  }

  function setup() {
    const downloadArea = /** @type {HTMLDivElement | null} */ (
      document.getElementById('download')
    )
    const originalDownBtn = downloadArea?.firstElementChild
    if (!originalDownBtn) {
      PNotify.error(`[${NAME}] 添加下载按钮失败：定位不到目标元素`)
      return
    }

    GM_addStyle(`a.btn.btn-primary.disabled { filter: grayscale(1); }`)
    const btnHtml =
      `<a class="btn btn-primary btn-sm mb-3 mr-2" href="javascript:void">` +
      `<span class="fa fa-download"></span> ${NAME}` +
      `</a>`
    originalDownBtn.insertAdjacentHTML('afterend', btnHtml)

    const btn = /** @type {HTMLAnchorElement} */ (originalDownBtn.nextElementSibling)
    btn.addEventListener('click', async () => {
      if (btn.classList.contains('disabled')) return
      btn.classList.add('disabled')
      try {
        await download()
      } catch (e) {
        PNotify.error(`[${NAME}] 出现意外错误\n${/** @type {any} */ (e).toString()}`)
      }
      btn.classList.remove('disabled')
    })
  }

  window.addEventListener('load', setup)
})()
