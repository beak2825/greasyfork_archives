// ==UserScript==
// @name               SimDevices Osu Beatmap Downloader Plugin
// @name:zh-CN         SimDevices Osu 谱面下载器插件
// @include            http*://osu.ppy.sh/*
// @copyright          2020, Handle
// @version            0.5.2
// @description        Add extra download buttons on beatmap page for SimDevices Beatmap Downloader on osu.ppy.sh
// @description:zh-CN  在 osu! 谱面下载页面上添加额外的按钮，可以唤醒下载器自动下载并导入谱面。
// @author             Handle
// @namespace          https://github.com/SimDevices-Project
// @supportURL         https://github.com/SimDevices-Project/beatmap-downloader-user-script/issues
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/401946/SimDevices%20Osu%20Beatmap%20Downloader%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/401946/SimDevices%20Osu%20Beatmap%20Downloader%20Plugin.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const styleClassName = '_beatmap_downloader_style_'
  const beapmapPageDownloadBtnClassName = '_beatmap_downloader_btn_'

  const searchPageBtnClassName = `_beatmap_downloader_quick_btn_`
  const searchPageBtnText = 'Launch Downloader'

  const searchPageDownloadTipClassName = `_beatmap_downloader_qtip_`

  const insertStyle = () => {
    const styleDOM = document.createElement('style')
    styleDOM.classList.add(styleClassName)
    styleDOM.innerHTML = `
    .${searchPageBtnClassName}:hover {
      text-decoration: none!important;
    }

    .${searchPageDownloadTipClassName}:after{
      display:block;
      content:'';
      border-width:8px 5px 8px 5px;
      border-style:solid;
      border-color:hsl(var(--base-hue),10%,10%) transparent transparent transparent;

      position:absolute;
      left:calc(50% - 2px);
      top:100%;
    }
    `
    if (!document.querySelector(`.${styleClassName}`)) {
      document.head.append(styleDOM)
    }
  }

  const formatURL = () => {
    const URL = document.URL
    const [domain, argument] = URL.substr(URL.indexOf('//') + 2).split('#')
    const pathname = window.location.pathname.substr(1)
    const [type, sid] = pathname.split('/')
    switch (type) {
      case 'beatmapsets':
        if (sid && sid.length) {
          const [mode, bid] = argument || []
          return {
            id: sid,
            type: 'beatmapset',
          }
        } else {
          return {
            id: 0,
            type: 'beatmapsearch',
          }
        }
        break
      default:
        return { id: 0, type: type }
    }
  }

  const insertBeatmapPageDownloadBtn = (id = 1011011, type = 's') => {
    const htmlText = `
    <a href="beatmap-downloader://${type}/${id}" class="btn-osu-big btn-osu-big--beatmapset-header ${beapmapPageDownloadBtnClassName}">
      <span class="btn-osu-big__content">
        <span class="btn-osu-big__left">
          <span class="btn-osu-big__text-top">启动</span>
          <span class="btn-osu-hint btn-osu-big__text-bottom">Beatmap Downloader</span>
        </span>
        <span class="btn-osu-big__icon">
          <span class="fa-fw">
            <i class="fas fa-download"></i>
          </span>
        </span>
      </span>
    </a>`
    const htmlDOM = document.createRange().createContextualFragment(htmlText)
    const btnContainer = document.querySelector('.beatmapset-header__buttons')
    const downloaderBtnQueryWith = `.${beapmapPageDownloadBtnClassName}`
    const downloaderBtnDOM = document.querySelector(downloaderBtnQueryWith)
    if (!downloaderBtnDOM) {
      btnContainer.insertBefore(htmlDOM, btnContainer.lastElementChild)
    }
  }

  const getSearchPageDownloadBtn = (id = 1011011, type = 's') => {
    const htmlText = `
    <a href="beatmap-downloader://${type}/${id}" class="beatmapset-panel__icon ${searchPageBtnClassName}" data-orig-title="Launch Downloader" aria-describedby="qtip-downloader">
      <i class="fas fa-lg fa-gamepad"></i>
    </a>`
    /**
     * @type {HTMLAnchorElement}
     */
    const htmlDOM = document.createRange().createContextualFragment(htmlText)
    return htmlDOM
  }

  const insertSearchPageDownloadTip = () => {
    const insertHTML = `
    <div
      id="qtip-downloader"
      class="qtip qtip-default tooltip-default qtip-pos-bc ${searchPageDownloadTipClassName}"
      tracking="false"
      role="alert"
      aria-live="polite"
      aria-atomic="false"
      aria-describedby="qtip-downloader-content"
      aria-hidden="true"
      data-qtip-id="downloader"
      style="z-index: 15003;"
    >
      <div class="qtip-content" id="qtip-downloader-content" aria-atomic="true">
        <span style="display: block; visibility: visible;">${searchPageBtnText}</span>
      </div>
    </div>`
    /**
     * @type {HTMLDivElement}
     */
    const htmlDOM = document.createRange().createContextualFragment(insertHTML)
    const qTipQueryWith = `.${searchPageDownloadTipClassName}`
    const qTipDOM = document.querySelector(qTipQueryWith)
    if (!qTipDOM) {
      document.body.appendChild(htmlDOM)
    }
  }

  /**
   * 获取DOM元素绝对坐标
   * @param {HTMLElement} element 要获取坐标的元素
   */
  const getAbsolutePostion = (element) => {
    const rect = element.getBoundingClientRect()
    const X = rect.left + document.documentElement.scrollLeft
    const Y = rect.top + document.documentElement.scrollTop
    const width = rect.width
    const height = rect.height
    return {
      x: X,
      y: Y,
      width,
      height,
    }
  }

  const setSearchPageDownloadTipPosition = ({ x = 0, y = 0, show = true } = {}) => {
    const qTipQueryWith = `.${searchPageDownloadTipClassName}`
    /**
     * @type {HTMLDivElement}
     */
    const qTipDOM = document.querySelector(qTipQueryWith)
    if (!qTipDOM) {
      return
    }
    if (!show) {
      qTipDOM.style.display = 'none'
      qTipDOM.style.opacity = 0
    } else {
      if (qTipDOM.style.display === 'block') {
      } else {
        qTipDOM.style.display = 'block'
        let opacitySet = 0
        if (qTipDOM.dataset.timer) {
          clearInterval(qTipDOM.dataset.timer)
        }
        qTipDOM.style.opacity = opacitySet.toString(10)
        const easeIn = setInterval(() => {
          opacitySet += 0.2
          if (opacitySet >= 1) {
            opacitySet = 1
            clearInterval(easeIn)
          }
          qTipDOM.style.opacity = opacitySet.toString(10)
        }, 16.67)
        qTipDOM.dataset.timer = easeIn
      }
    }
    qTipDOM.style.left = `${x}px`
    qTipDOM.style.top = `${y}px`
  }

  const insertSearchPageDownloadBtns = (target = document) => {
    /**
     * @type {NodeListOf<HTMLDivElement>}
     */
    const beatmapsetPannels = target.querySelectorAll('.beatmapset-panel')
    const addDownloadBtnToPannel = (beatmapsetPannel) => {
      if (beatmapsetPannel.querySelector(`.${searchPageBtnClassName}`)) {
        return
      }
      const audioURL = beatmapsetPannel.dataset.audioUrl
      const anchorLinkDOM = beatmapsetPannel.querySelectorAll('a')[0]
      const [domain, type, sid] = anchorLinkDOM.href.substr(anchorLinkDOM.href.indexOf('//') + 2).split('/')
      if (type !== 'beatmapsets') {
        return
      }
      const downloadBtn = getSearchPageDownloadBtn(sid, 's')

      const iconBox = beatmapsetPannel.querySelector('.beatmapset-panel__icons-box')
      iconBox.insertBefore(downloadBtn, iconBox.lastElementChild)

      const downloadBtnToBind = iconBox.querySelector(`.${searchPageBtnClassName}`)

      let tipWidth = 0
      let tipHeight = 0
      const showTip = () => {
        const { x, y, width, height } = getAbsolutePostion(downloadBtnToBind)
        setSearchPageDownloadTipPosition({ x: x + width / 2 - tipWidth / 2, y: y - tipHeight - 8, show: true })
        if (!tipWidth || !tipHeight) {
          const qTipQueryWith = `.${searchPageDownloadTipClassName}`
          const qTipDOM = document.querySelector(qTipQueryWith)
          if (!qTipDOM) {
            return
          }
          const rect = getAbsolutePostion(qTipDOM)
          tipWidth = rect.width
          tipHeight = rect.height

          showTip()
        }
      }

      const hideTip = () => {
        setSearchPageDownloadTipPosition({ show: false })
      }

      downloadBtnToBind.addEventListener('mousemove', showTip)
      downloadBtnToBind.addEventListener('mouseover', showTip)
      downloadBtnToBind.addEventListener('mouseenter', showTip)

      downloadBtnToBind.addEventListener('mouseleave', hideTip)
      downloadBtnToBind.addEventListener('mouseout', hideTip)
    }
    beatmapsetPannels.forEach(addDownloadBtnToPannel)
  }

  let timer = 0
  const loader = () => {
    const listenElementBeapmapPageQueryWith = '.js-react--beatmapset-page'
    const listenElementBeatmapPageDOM = document.querySelector(listenElementBeapmapPageQueryWith)

    const listenElementBeapmapSearchQueryWith = '.js-react--beatmaps'
    const listenElementBeatmapSearchDOM = document.querySelector(listenElementBeapmapSearchQueryWith)

    insertStyle()

    if (listenElementBeatmapPageDOM && listenElementBeatmapPageDOM.dataset.reactTurbolinksLoaded === '1') {
      // 谱面详情
      const formated = formatURL()
      if (formated.type === 'beatmapset') {
        insertBeatmapPageDownloadBtn(formated.id, formated.type === 'beatmapset' ? 's' : 'b')
      }
    } else if (listenElementBeatmapSearchDOM && listenElementBeatmapSearchDOM.dataset.reactTurbolinksLoaded === '1') {
      // 搜索页面
      const formated = formatURL()
      if (formated.type === 'beatmapsearch') {
        insertSearchPageDownloadTip()
        const options = {
          childList: true,
        }
        const observer = new MutationObserver((mutationsList) => {
          mutationsList.forEach((mutation) => {
            switch (mutation.type) {
              case 'childList':
                if (mutation.addedNodes) {
                  mutation.addedNodes.forEach(insertSearchPageDownloadBtns)
                }
                break
            }
          })
        })
        observer.observe(document.querySelector('.beatmapsets__items'), options)
      }
    } else {
      timer = requestAnimationFrame(loader)
    }
  }
  timer = requestAnimationFrame(loader)
  // 监听 turbolinks 渲染事件
  // https://greasyfork.org/zh-CN/scripts/3916-osu-my-download
  document.addEventListener('turbolinks:load', loader)
})()
