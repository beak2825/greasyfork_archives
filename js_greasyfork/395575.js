// ==UserScript==
// @name            B站封面获取
// @version         5.10.7.20240827
// @namespace       laster2800
// @author          Laster2800
// @description     获取B站各播放页及直播间封面，支持手动及实时预览等多种模式，支持点击下载、封面预览、快速复制，可高度自定义
// @icon            https://www.bilibili.com/favicon.ico
// @homepageURL     https://greasyfork.org/zh-CN/scripts/395575
// @supportURL      https://greasyfork.org/zh-CN/scripts/395575/feedback
// @license         LGPL-3.0
// @include         *://www.bilibili.com/video/*
// @include         *://www.bilibili.com/list/*
// @include         *://www.bilibili.com/bangumi/play/*
// @include         *://www.bilibili.com/medialist/play/watchlater
// @include         *://www.bilibili.com/medialist/play/watchlater/*
// @include         *://www.bilibili.com/medialist/play/ml*
// @include         /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+([/?]|$)/
// @require         https://update.greasyfork.org/scripts/409641/1435266/UserscriptAPI.js
// @require         https://update.greasyfork.org/scripts/431998/1161016/UserscriptAPIDom.js
// @require         https://update.greasyfork.org/scripts/432000/1095149/UserscriptAPIMessage.js
// @require         https://update.greasyfork.org/scripts/432002/1161015/UserscriptAPIWait.js
// @require         https://update.greasyfork.org/scripts/432003/1381253/UserscriptAPIWeb.js
// @grant           GM_download
// @grant           GM_notification
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_listValues
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @connect         api.bilibili.com
// @run-at          document-start
// @compatible      edge 版本不小于 93
// @compatible      chrome 版本不小于 93
// @compatible      firefox 版本不小于 92
// @downloadURL https://update.greasyfork.org/scripts/395575/B%E7%AB%99%E5%B0%81%E9%9D%A2%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/395575/B%E7%AB%99%E5%B0%81%E9%9D%A2%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
  'use strict'

  const gmId = 'gm395575'
  const defaultRealtimeStyle = `
    #${gmId}-realtime-cover {
      display: block;
      margin-bottom: 18px;
      border-radius: 6px;
      overflow: hidden;
    }
    #${gmId}-realtime-cover img {
      display: block;
      width: 100%;
    }
  `.trim().replaceAll(/\s+/g, ' ')

  const gm = {
    id: gmId,
    configVersion: GM_getValue('configVersion'),
    configUpdate: 20210815,
    config: {},
    configMap: {
      mode: { default: -1, name: '视频/番剧：工作模式' },
      customModeSelector: { default: '#danmukuBox' },
      customModePosition: { default: 'beforebegin' },
      customModeQuality: { default: '480w_90p' }, // 320w 会有肉眼可见的质量损失
      customModeStyle: { default: defaultRealtimeStyle },
      download: { default: true, name: '全局：点击下载', checkItem: true },
      preview: { default: true, name: '视频/番剧：封面预览', checkItem: true },
      previewLive: { default: true, name: '直播间：封面预览', checkItem: true },
      bangumiSeries: { default: false, name: '番剧：获取系列封面而非分集封面', checkItem: true },
      switchQuickCopy: { default: false, name: '全局：交换「右键」与「Ctrl+右键」功能', checkItem: true, needNotReload: true },
      disableContextMenu: { default: true, name: '全局：在预览图上禁用右键菜单', checkItem: true },
    },
    runtime: {
      /** @type {'legacy' | 'realtime'} */
      layer: null,
      modeName: null,
      preview: null,
      realtimeSelector: null,
      /** @type {'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'} */
      realtimePosition: null,
      realtimeQuality: null,
      realtimeStyle: null,
    },
    url: {
      api_videoInfo: (id, type) => `https://api.bilibili.com/x/web-interface/view?${type}=${id}`,
      gm_changelog: 'https://gitee.com/liangjiancang/userscript/blob/master/script/BilibiliCover/changelog.md',
    },
    regex: {
      page_videoNormalMode: /\.com\/video([#/?]|$)/,
      page_videoWatchlaterMode: /\.com\/medialist\/play\/(watchlater|ml\d+)([#/?]|$)/,
      page_listMode: /\.com\/list\/.+/,
      page_bangumi: /\/bangumi\/play([#/?]|$)/,
      page_live: /live\.bilibili\.com\/(blanc\/)?\d+([#/?]|$)/, // 只含具体的直播间页面
    },
    const: {
      hintText: `
        <div style="display:grid;grid-template-columns:auto auto;column-gap:1.5em;font-size:0.8em">
          <div>左键：下载 / 在新页面打开</div>
          <div>右键：复制链接 / 内容</div>
          <div>中键：在新页面打开</div>
          <div>Ctrl+右键：复制内容 / 链接</div>
        </div>
      `,
      errorMsg: '获取失败，请尝试在页面加载完成后获取',
      customMode: 32767,
      fadeTime: 200,
      noticeTimeout: 5600,
    },
  }

  /* global UserscriptAPI */
  const api = new UserscriptAPI({
    id: gm.id,
    label: GM_info.script.name,
    wait: {
      condition: {
        interval: 250,
        timeout: 15000,
        stopOnTimeout: false,
      },
    },
  })

  /** @type {Script} */
  let script = null
  /** @type {Webpage} */
  let webpage = null

  /**
   * 脚本运行的抽象，为脚本本身服务的核心功能
   */
  class Script {
    /** 通用方法 */
    method = {
      /**
       * 重置脚本
       */
      reset() {
        const gmKeys = GM_listValues()
        for (const gmKey of gmKeys) {
          GM_deleteValue(gmKey)
        }
      },
    }

    /**
     * 初始化脚本
     */
    init() {
      try {
        this.updateVersion()
        for (const [name, item] of Object.entries(gm.configMap)) {
          const v = GM_getValue(name)
          const dv = item.default
          gm.config[name] = typeof v === typeof dv ? v : dv
        }
        this.initRuntime()

        if (gm.config.mode === gm.configMap.mode.default) {
          this.configureMode(true)
        }
      } catch (e) {
        api.logger.error(e)
        api.message.confirm('初始化错误！是否彻底清空内部数据以重置脚本？').then(result => {
          if (result) {
            this.method.reset()
            location.reload()
          }
        })
      }
    }

    /**
     * 初始化运行时变量
     */
    initRuntime() {
      const rt = gm.runtime
      const { mode } = gm.config
      rt.layer = mode > 1 ? 'realtime' : 'legacy'
      rt.preview = api.base.urlMatch(gm.regex.page_live) ? gm.config.previewLive : gm.config.preview
      rt.modeName = { '-1': '初始化', '1': '传统', '2': '实时预览', [gm.const.customMode]: '自定义' }[mode] ?? '未知'
      if (rt.layer === 'realtime') {
        for (const s of ['Selector', 'Position', 'Style']) {
          rt['realtime' + s] = mode === 2 ? gm.configMap['customMode' + s].default : gm.config['customMode' + s]
        }
        rt.realtimeQuality = mode === 2 ? gm.configMap.customModeQuality.default : gm.config.customModeQuality
      }
    }

    /**
     * 初始化脚本菜单
     */
    initScriptMenu() {
      const _self = this
      const cfgName = id => `[ ${config[id] ? '✓' : '✗'} ] ${configMap[id].name}`
      const { config, configMap, runtime } = gm
      const menuMap = {}

      menuMap.mode = GM_registerMenuCommand(`${configMap.mode.name} [ ${runtime.modeName} ]`, () => this.configureMode())
      for (const [id, item] of Object.entries(configMap)) {
        if (item.checkItem) {
          menuMap[id] = createMenuItem(id)
        }
      }
      menuMap.reset = GM_registerMenuCommand('初始化脚本', () => this.resetScript())

      function createMenuItem(id) {
        return GM_registerMenuCommand(cfgName(id), () => {
          config[id] = !config[id]
          GM_setValue(id, config[id])
          GM_notification({
            text: `已${config[id] ? '开启' : '关闭'}「${configMap[id].name}」功能${configMap[id].needNotReload ? '' : '，刷新页面以生效（点击通知以刷新）'}。`,
            timeout: gm.const.noticeTimeout,
            onclick: configMap[id].needNotReload ? null : () => location.reload(),
          })
          clearMenu()
          _self.initScriptMenu()
        })
      }

      function clearMenu() {
        for (const menuId of Object.values(menuMap)) {
          GM_unregisterMenuCommand(menuId)
        }
      }
    }

    /**
     * 版本更新处理
     */
    updateVersion() {
      if (gm.configVersion >= 20210811) { // 5.0.0.20210811
        if (gm.configVersion < gm.configUpdate) {
          // 必须按从旧到新的顺序写
          // 内部不能使用 gm.configUpdate，必须手写更新后的配置版本号！

          // 5.0.5.20210812
          if (gm.configVersion < 20210812) {
            GM_deleteValue('mode')
            GM_deleteValue('customModeStyle')
          }

          // 5.2.0.20210813
          if (gm.configVersion < 20210813) {
            GM_deleteValue('preview')
          }

          // 功能性更新后更新此处配置版本
          if (gm.configVersion < 20210815) {
            GM_notification({
              text: '功能性更新完毕，你可能需要重新设置脚本。点击查看更新日志。',
              onclick: () => window.open(gm.url.gm_changelog),
            })
          }
        }
        if (gm.configVersion !== gm.configUpdate) {
          gm.configVersion = gm.configUpdate
          GM_setValue('configVersion', gm.configVersion)
        }
      } else {
        this.method.reset()
        gm.configVersion = gm.configUpdate
        GM_setValue('configVersion', gm.configVersion)
      }
    }

    /**
     * 初始化脚本
     */
    async resetScript() {
      const result = await api.message.confirm('是否要初始化脚本？')
      if (result) {
        const gmKeys = GM_listValues()
        for (const gmKey of gmKeys) {
          GM_deleteValue(gmKey)
        }
        gm.configVersion = gm.configUpdate
        GM_setValue('configVersion', gm.configVersion)
        location.reload()
      }
    }

    /**
     * 设置工作模式
     * @param {boolean} [reload] 强制刷新
     */
    async configureMode(reload) {
      let result = null
      let msg = null
      let val = null

      val = gm.config.mode
      val = val === -1 ? 1 : val
      msg = `
        <p style="margin-bottom:0.5em">输入对应序号选择脚本工作模式。输入值应该是一个数字。</p>
        <p>[ 1 ] - 传统模式。在视频播放器下方添加一个「获取封面」按钮，与该按钮交互以获得封面。</p>
        <p>[ 2 ] - 实时预览模式。直接在视频播放器右方显示封面，与其交互可进行更多操作。</p>
        <p>[ ${gm.const.customMode} ] - 自定义模式。底层机制与预览模式相同，但封面位置及显示效果由用户自定义，运行效果仅局限于想象力。</p>
      `
      result = await api.message.prompt(msg, val, { html: true })
      if (result == null) return
      result = Number.parseInt(result)
      if ([1, 2, gm.const.customMode].includes(result)) {
        gm.config.mode = result
        GM_setValue('mode', result)
      } else {
        gm.config.mode = -1
        await api.message.alert('设置失败，请填入正确的参数。')
        return this.configureMode()
      }

      if (gm.config.mode === gm.const.customMode) {
        val = gm.config.customModeSelector
        msg = `
          <p style="margin-bottom:0.5em">请认真阅读以下说明：</p>
          <p>1. 应填入 CSS 选择器，脚本会以此选择定位元素，将封面元素「<code>#${gm.id}-realtime-cover</code>」插入到其附近（相对位置稍后设置）。</p>
          <p>2. 确保该选择器在各种播放页面中均有对应元素，否则脚本在对应页面无法工作。PS：逗号「<code>,</code>」以 OR 规则拼接多个选择器。</p>
          <p>3. 不要选择广告为定位元素，否则封面元素可能会插入失败或被误杀。</p>
          <p>4. 不要选择时有时无的元素，或第三方插入的元素作为定位元素，否则封面元素可能会插入失败。</p>
          <p>5. 在 A 时间点插入的图片元素，有可能被 B 时间点插入的新元素 C 挤到目标以外的位置。只要将定位元素选择为 C 再更改相对位置即可解决问题。</p>
          <p>6. 置空时使用默认设置。</p>
        `
        result = await api.message.prompt(msg, val, { html: true })
        if (result != null) {
          result = result.trim()
          if (result === '') {
            result = gm.configMap.customModeSelector.default
          }
          gm.config.customModeSelector = result
          GM_setValue('customModeSelector', result)
        }

        val = gm.config.customModePosition
        msg = `
          <p style="margin-bottom:0.5em">设置封面元素相对于定位元素的位置。</p>
          <p>[ <code>beforebegin</code> ] - 作为兄弟元素插入到定位元素前方</p>
          <p>[ <code>afterbegin</code> ] - 作为第一个子元素插入到定位元素内</p>
          <p>[ <code>beforeend</code> ] - 作为最后一个子元素插入到定位元素内</p>
          <p>[ <code>afterend</code> ] - 作为兄弟元素插入到定位元素后方</p>
        `
        result = null
        const loop = () => !['beforebegin', 'afterbegin', 'beforeend', 'afterend'].includes(result)
        while (loop()) {
          result = await api.message.prompt(msg, val, { html: true })
          if (result == null) break
          result = result.trim()
          if (loop()) {
            await api.message.alert('设置失败，请填入正确的参数。')
          }
        }
        if (result != null) {
          gm.config.customModePosition = result
          GM_setValue('customModePosition', result)
        }

        val = gm.config.customModeQuality
        msg = `
          <p>设置实时预览图片的质量，该项会明显影响页面加载的视觉体验。</p>
          <p>设置为 [ <code>best</code> ] 加载原图（不推荐），置空时使用默认设置。</p>
          <p style="margin-bottom:0.5em">PS：B站推荐的视频封面长宽比为 16:10（非强制性标准）。</p>
          <p>格式：[ <code>${'${width}w_${height}h_${clip}c_${quality}q'}</code> ]</p>
          <p>可省略部分参数，如 [ <code>320w_1q</code> ] 表示「宽度 320 像素，高度自动，拉伸，压缩质量 1」</p>
          <div style="text-indent:3em">
            <p><code>width</code>：&emsp;图片宽度</p>
            <p><code>height</code>：&emsp;图片高度</p>
            <p><code>clip</code>：&emsp;1 裁剪，0 拉伸；默认 0</p>
            <p><code>quality</code>：&emsp;有损压缩参数，100 为无损；默认 100</p>
          </div>
        `
        result = await api.message.prompt(msg, val, { html: true })
        if (result != null) {
          result = result.trim()
          if (result === '') {
            result = gm.configMap.customModeQuality.default
          }
          gm.config.customModeQuality = result
          GM_setValue('customModeQuality', result)
        }

        val = gm.config.customModeStyle
        msg = `
          <p style="margin-bottom:0.5em">设置封面元素的样式。设置为 [<code>disable</code>] 禁用样式，置空时使用默认设置。</p>
          <p>这里提供几种目标效果以便拓宽思路：</p>
          <p>* 鼠标悬浮至封面元素上方时放大封面实现预览效果（图片质量应与放大后的尺寸匹配）。</p>
          <p>* 将内部 <code>&lt;img&gt;</code> 隐藏，使用 Base64 图片或 SVG 将封面元素改成任何样子。</p>
          <p>* 将封面元素做成透明层覆盖在视频投稿时间上，实现点击投稿时间下载封面的效果。</p>
          <p>* 将页面背景替换为视频封面，再加个滤镜也许还会有不错的设计感？</p>
          <p>* ......</p>
        `
        result = await api.message.prompt(msg, val, { html: true })
        if (result != null) {
          result = result.trim()
          result = (result === '') ? gm.configMap.customModeStyle.default : result.replaceAll(/\s+/g, ' ')
          gm.config.customModeStyle = result
          GM_setValue('customModeStyle', result)
        }
      }

      if (reload || await api.message.confirm('配置工作模式完成，需刷新页面方可生效。是否立即刷新页面？')) {
        location.reload()
      }
    }
  }

  /**
   * 页面处理的抽象，脚本围绕网站的特化部分
   */
  class Webpage {
    /** 通用方法 */
    method = {
      /**
       * 下载封面
       * @param {string} url 封面 URL
       * @param {string} [name='Cover'] 保存文件名
       */
      download(url, name) {
        name ||= 'Cover'
        async function onerror(error) {
          if (error?.error === 'not_whitelisted') {
            await api.message.alert('该封面的文件格式不在下载模式白名单中，从而触发安全限制导致无法直接下载。可修改脚本管理器的「下载模式」或「文件扩展名白名单」设置以放开限制。')
            window.open(url)
          } else {
            GM_notification({
              text: '下载错误',
              timeout: gm.const.noticeTimeout,
            })
          }
        }
        function ontimeout() {
          GM_notification({
            text: '下载超时',
            timeout: gm.const.noticeTimeout,
          })
          window.open(url)
        }
        api.web.download({ url, name, onerror, ontimeout })
      },

      /**
       * 从 URL 获取视频 ID
       * @param {string} [url=location.href] 提取视频 ID 的源字符串
       * @returns {{id: string, type: 'aid' | 'bvid'}} `{id, type}`
       */
      getVid(url = location.href) {
        let m = null
        if ((m = /(\/|bvid=)bv([\da-z]+)([#&/?]|$)/i.exec(url))) {
          return { id: 'BV' + m[2], type: 'bvid' }
        } else if ((m = /(\/(av)?|aid=)(\d+)([#&/?]|$)/i.exec(url))) { // 兼容 BV 号被第三方修改为 AV 号的情况
          return { id: m[3], type: 'aid' }
        }
        return null
      },

      /**
       * 从 URL 获取番剧 ID
       * @param {string} [url=location.href] 提取视频 ID 的源字符串
       * @returns {{id: string, type: 'ssid' | 'epid'}} `{id, type}`
       */
      getBgmid(url = location.href) {
        let m = null
        if ((m = /\/(ss\d+)([#/?]|$)/.exec(url))) {
          return { id: m[1], type: 'ssid' }
        } else if ((m = /\/(ep\d+)([#/?]|$)/.exec(url))) {
          return { id: m[1], type: 'epid' }
        }
        return null
      },

      /**
       * 添加下载图片事件
       * @param {HTMLElement} target 触发元素
       */
      addDownloadEvent(target) {
        if (!target._downloadEvent) {
          // 此处必须用 mousedown，否则无法与动态获取封面的代码达成正确的联动
          target.addEventListener('mousedown', e => {
            if (target.loaded && gm.config.download && e.button === 0) {
              this.download(target.href, document.title)
            }
          })
          // 开启下载时，若没有以下处理器，则鼠标左键长按图片按钮，过一段时间后再松开，松开时依然会触发默认点击事件（在新页面打开封面）
          target.addEventListener('click', e => {
            if (target.loaded && gm.config.download) {
              e.preventDefault()
              e.stopPropagation() // 兼容第三方的「链接转点击事件」处理
            }
          })
          target._downloadEvent = true
        }
      },

      /**
       * 添加复制事件
       * @param {HTMLElement} target 触发元素
       */
      addCopyEvent(target) {
        if (!target._copyLinkEvent) {
          target.addEventListener('mousedown', async e => {
            if (target.loaded && e.button === 2) {
              let ctrl = e.ctrlKey
              if (gm.config.switchQuickCopy) {
                ctrl = !ctrl
              }
              if (ctrl) {
                // 借助 image 中转避免跨域；网络请求其实更简单，但还是防一手某些封面图不在 i0.hdslb.com 的情况
                // 理论上来说这里可以复用 realtime-image 或者 preview，但是很麻烦，再考虑到图片缓存也没必要
                const image = new Image()
                image.crossOrigin = 'Anonymous'
                image.src = target.href
                image.addEventListener('load', () => {
                  const canvas = document.createElement('canvas')
                  const ctx = canvas.getContext('2d')
                  canvas.width = image.width
                  canvas.height = image.height
                  ctx.drawImage(image, 0, 0)
                  canvas.toBlob(async blob => {
                    try {
                      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
                      api.message.info('已复制封面内容')
                    } catch (e) {
                      api.logger.warn(e)
                      api.message.info('当前浏览器不支持复制图片')
                    }
                  })
                })
              } else {
                try {
                  await navigator.clipboard.writeText(target.href)
                  api.message.info('已复制封面链接')
                } catch (e) {
                  // 只要脚本管理器有向浏览器要剪贴板权限就没问题
                  api.logger.warn(e)
                  api.message.info('当前浏览器不支持剪贴板')
                }
              }
            }
          })
          target._copyLinkEvent = true
        }
      },

      /**
       * 设置提示信息
       * @param {HTMLElement} target 目标元素
       * @param {string} hintText 提示信息
       */
      setHintText(target, hintText) {
        if (target.hoverInfo) {
          target.hoverInfo.msg = hintText
        } else {
          api.message.hoverInfo(target, hintText, null, { position: { top: '94%' } })
        }
      },

      /**
       * 设置封面
       * @param {HTMLElement} target 封面元素
       * @param {HTMLElement} preview 预览元素，无预览元素时传空值即可
       * @param {string} url 封面 URL
       */
      setCover(target, preview, url) {
        if (url) {
          if (/@\d+\w[._]/.test(url)) { // 若 url 指向缩略图，替换为原图
            url = url.replace(/@\d+\w[._].*/, '')
          }
          target.href = url
          target.target = '_blank'
          target.loaded = true
          this.setHintText(target, gm.const.hintText)
          this.addDownloadEvent(target)
          this.addCopyEvent(target)
          if (target.img) {
            if (gm.runtime.realtimeQuality !== 'best') {
              target.img.src = `${url}@${gm.runtime.realtimeQuality}.webp`
              target.img.lossless = url
            } else {
              target.img.src = url
            }
          }
          if (preview) {
            preview._src = url
          }
        } else {
          target.removeAttribute('href')
          target.loaded = false
          this.setHintText(target, gm.const.errorMsg)
          if (target.img) {
            target.img.removeAttribute('src')
            target.img.lossless = null
            target.error.style.display = 'block'
          }
          if (preview) {
            preview.removeAttribute('src')
          }
        }
      },

      /**
       * 创建预览元素
       * @param {HTMLElement} target 触发元素
       * @returns {HTMLImageElement}
       */
      createPreview(target) {
        const preview = document.body.appendChild(document.createElement('img'))
        preview.className = `${gm.id}-preview`
        preview.fadeOutNoInteractive = true
        const fade = inOut => api.dom.fade(inOut, preview)

        const onMouseenter = api.base.debounce(async () => {
          if (gm.runtime.preview) {
            if (preview._src) {
              try {
                await new Promise((resolve, reject) => {
                  preview.addEventListener('load', resolve, { once: true })
                  preview.addEventListener('error', reject, { once: true })
                  preview.src = preview._src
                  preview._src = null
                })
              } catch (e) {
                this.setCover(target, preview, null)
                api.logger.error(e)
                return
              }
            }
            target._mouseOver && preview.src && fade(true)
          }
        }, 200)
        const onMouseleave = api.base.debounce(() => {
          if (gm.runtime.preview) {
            fade(false)
          }
        }, 200)
        target.addEventListener('mouseenter', () => {
          target._mouseOver = true
          onMouseenter()
        })
        target.addEventListener('mouseleave', () => {
          target._mouseOver = false
          onMouseleave()
        })

        // 当图像太小时，放大以避免预览效果不佳
        const enlarge = () => {
          const widthCap = window.innerWidth * 0.65
          const heightCap = window.innerHeight * 0.8
          if (preview.naturalWidth / preview.naturalHeight > widthCap / heightCap) {
            if (preview.naturalWidth < widthCap) {
              preview.style.width = `${preview.naturalWidth * 1.5}px` // 限制图像放大倍率为 150%
            }
            preview.style.height = ''
          } else {
            if (preview.naturalHeight < heightCap) {
              preview.style.height = `${preview.naturalHeight * 1.5}px`
            }
            preview.style.width = ''
          }
        }
        preview.addEventListener('load', enlarge)
        window.addEventListener('resize', api.base.throttle(enlarge))

        return preview
      },

      /**
       * 创建实时封面元素
       * @returns {Promise<HTMLElement>} 实时封面元素
       */
      async createRealtimeCover() {
        const ref = await api.wait.$(gm.runtime.realtimeSelector)
        const cover = ref.insertAdjacentElement(gm.runtime.realtimePosition, document.createElement('a'))
        cover.id = `${gm.id}-realtime-cover`
        // 实时封面元素生成会导致页面中某些元素发生位置变动，若用户在刚打开页面时便去点击这些元素，可能会
        // 误点到刚生成的实时封面元素上，产生预期外的影响。为了将这种影响降至最少，实时封面元素在刚生成时
        // 应该是不可交互的，待位置变动结束一段时间后再恢复可交互状态。
        cover.style.pointerEvents = 'none'
        // 2022 版将绝大多数常见元素默认设为 pointer-event: none，再通过样式将部分元素设置回可交互的
        // 这里假定实时预览元素被设为不可交互的（就 2022.07 而言确实如此），最后要设为 auto 而非单纯清掉
        // 不要写进样式表，避免被不清楚原理的用户用样式覆盖掉
        const peCover = () => {
          if (cover.style.pointerEvents === 'none') {
            setTimeout(() => {
              cover.style.pointerEvents = 'auto'
            }, 1357)
          }
        }
        cover.img = cover.appendChild(document.createElement('img'))
        // 首次加载待完成再显示，避免观察到加载过程；后续加载浏览器会做优化，无需再手动处理
        // 不要写进样式表，避免被不清楚原理的用户用样式覆盖掉
        cover.img.style.display = 'none'
        cover.error = cover.appendChild(document.createElement('div'))
        cover.error.textContent = '封面获取失败'
        cover.img.addEventListener('load', () => {
          cover.img.style.display = ''
          cover.error.style.display = ''
          peCover()
        })
        cover.img.addEventListener('error', /** @param {Event} e */ e => {
          const { img } = cover
          if (img.lossless && img.src !== img.lossless) {
            if (gm.config.mode === gm.const.customMode) {
              api.message.info(`缩略图获取失败，使用原图进行替换！请检查「${gm.runtime.realtimeQuality}」是否为有效的图片质量参数。可能是正常现象，因为年代久远的视频封面有可能不支持缩略图。`, 4000)
            } else {
              api.message.info('缩略图获取失败，使用原图进行替换！可能是正常现象，因为年代久远的视频封面有可能不支持缩略图。', 3000)
            }
            api.logger.warn('缩略图获取失败，使用原图进行替换！', img.src, img.lossless)
            img.src = img.lossless
            img.lossless = null
          } else {
            this.setCover(cover, null, null) // preview 会自动处理 error，不必理会
            cover.error.style.display = 'block'
            api.logger.error(e)
          }
          peCover()
        })
        if (gm.runtime.realtimeStyle !== 'disable') {
          api.base.addStyle(gm.runtime.realtimeStyle)
        }
        if (gm.config.disableContextMenu) {
          this.disableContextMenu(cover)
        } else if (gm.runtime.realtimeQuality !== 'best') {
          // 将缩略图替换为原图，以便右键菜单获取到正确的图像
          cover.img.addEventListener('mousedown', /** @param {MouseEvent} e */ e => {
            const { img } = cover
            if (e.button === 2 && img.lossless && img.src !== img.lossless) {
              img.src = img.lossless
              img.lossless = null
            }
          })
        }
        return cover
      },

      /**
       * 禁用右键菜单
       * @param {HTMLElement} target 目标元素
       */
      disableContextMenu(target) {
        target.addEventListener('contextmenu', e => e.preventDefault())
      },

      /**
       * 克隆事件
       *
       * 直接复用 event 在某些情况下会出问题，克隆可避免之。
       * @param {Event} event 原事件
       * @param {string[]} attrNames 需克隆的属性值
       * @returns {Event} 克隆事件
       */
      cloneEvent(event, attrNames = []) {
        const cloned = new Event(event.type)
        for (const name of attrNames) {
          cloned[name] = event[name]
        }
        return cloned
      },

      /**
       * @callback coverInteractionPre 封面交互前置处理
       * @param {Event} 事件
       * @returns {boolean | Promise<boolean>} 本次是否启用代理
       */
      /**
       * 代理封面交互
       *
       * 全面接管一切用户交互引起的行为，默认链接点击行为除外
       * @param {HTMLElement} target 目标元素
       * @param {coverInteractionPre} pre 封面交互前置处理
       */
      proxyCoverInteraction(target, pre) {
        const _self = this
        addEventListeners()

        async function main(event) {
          if (!await pre(event)) return
          removeEventListeners()
          if (event.type === 'mousedown') {
            // 鼠标左键点击链接可通过 click 拦截但没必要，中键点击链接无法通过 js 拦截不过也没必要拦
            // 同样地，无法通过 mousedown 事件中让浏览器模拟出链接被左键或中键点击的结果，需手动模拟
            let needDispatch = true
            if (event.button === 0) {
              if (!gm.config.download && target.loaded) {
                window.open(target.href)
                needDispatch = false
              }
            } else if (event.button === 1) {
              if (target.loaded) {
                window.open(target.href)
                needDispatch = false
              }
            }
            if (needDispatch) {
              target.dispatchEvent(_self.cloneEvent(event, ['button', 'ctrlKey']))
            }
          } else if (event.type === 'mouseenter') {
            target.dispatchEvent(_self.cloneEvent(event))
          }
          addEventListeners()
        }

        function addEventListeners() {
          target.addEventListener('mousedown', main, true)
          if (gm.runtime.preview) {
            target.addEventListener('mouseenter', main, true)
          }
        }

        function removeEventListeners() {
          target.removeEventListener('mousedown', main, true)
          if (gm.runtime.preview) {
            target.removeEventListener('mouseenter', main, true)
          }
        }
      },
    }

    async initVideo() {
      const app = await api.wait.$('#app')
      const atr = await api.wait.$('#arc_toolbar_report, #playlistToolbar') // 无论如何都卡一下时间
      await api.wait.waitForConditionPassed({
        condition: () => app.__vue__,
      })

      let cover = null
      if (gm.runtime.layer === 'legacy') {
        cover = document.createElement('a')
        cover.textContent = '获取封面'
        cover.className = `${gm.id}-video-cover-btn`
        if (gm.runtime.preview) {
          cover.style.cursor = 'none'
        }

        const gm395456 = atr.querySelector('[id|=gm395456]') // 确保与其他脚本配合时组件排列顺序不会乱
        const right = atr.querySelector('.toolbar-right, .video-toolbar-right')
        if (right) {
          cover.classList.add('video-toolbar-right-item')
          if (gm395456) {
            gm395456.after(cover)
          } else {
            right.prepend(cover)
          }
        } else { // 旧版
          cover.dataset.toolbarVersion = 'old'
          cover.classList.add('appeal-text')
          if (gm395456) {
            gm395456.before(cover)
          } else {
            atr.append(cover)
          }
        }
        this.method.disableContextMenu(cover)
      } else {
        cover = await this.method.createRealtimeCover()
      }
      const preview = gm.runtime.preview && this.method.createPreview(cover)
      this.method.setHintText(cover, gm.const.hintText)

      if (api.base.urlMatch(gm.regex.page_videoNormalMode)) {
        api.wait.executeAfterElementLoaded({
          selector: 'meta[itemprop=image]',
          base: document.head,
          subtree: false,
          repeat: true,
          timeout: 0,
          onError: e => {
            this.method.setCover(cover, preview, null)
            api.logger.error(e)
          },
          callback: meta => this.method.setCover(cover, preview, meta.content),
        })
      } else {
        if (gm.runtime.layer === 'legacy') {
          this.method.proxyCoverInteraction(cover, async event => {
            try {
              const vid = this.method.getVid()
              if (cover._coverId === vid.id) return false
              // 在异步等待前拦截，避免逻辑倒置
              event.stopPropagation()
              const url = await getCover(vid)
              this.method.setCover(cover, preview, url)
            } catch (e) {
              event.stopPropagation()
              this.method.setCover(cover, preview, null)
              api.logger.error(e)
            }
            return true
          })
        } else {
          const main = async () => {
            try {
              const vid = this.method.getVid()
              if (cover._coverId === vid.id) return
              const url = await getCover(vid)
              this.method.setCover(cover, preview, url)
            } catch (e) {
              this.method.setCover(cover, preview, null)
              api.logger.error(e)
            }
          }

          setTimeout(main)
          window.addEventListener('urlchange', main)
        }

        const getCover = async (vid = this.method.getVid()) => {
          if (cover._coverId !== vid.id) {
            const resp = await api.web.request({
              url: gm.url.api_videoInfo(vid.id, vid.type),
            }, { check: r => r.code === 0 })
            cover._coverUrl = resp.data.pic ?? ''
            cover._coverId = vid.id
          }
          return cover._coverUrl
        }
      }
    }

    async initBangumi() {
      const app = await api.wait.$('#app')
      const tm = await api.wait.$('#toolbar_module') // 无论如何都卡一下时间
      await api.wait.waitForConditionPassed({
        condition: () => app.__vue__,
      })

      let cover = null
      if (gm.runtime.layer === 'legacy') {
        cover = document.createElement('a')
        cover.textContent = '获取封面'
        cover.className = `${gm.id}-bangumi-cover-btn`
        if (gm.runtime.preview) {
          cover.style.cursor = 'none'
        }
        tm.append(cover)
        this.method.disableContextMenu(cover)
      } else {
        cover = await this.method.createRealtimeCover()
      }
      const preview = gm.runtime.preview && this.method.createPreview(cover)
      this.method.setHintText(cover, gm.const.hintText)

      if (gm.config.bangumiSeries) {
        const setCover = img => this.method.setCover(cover, preview, img.src.replace(/@[^@]*$/, ''))
        api.wait.$('.media-cover img').then(img => {
          setCover(img)
          const ob = new MutationObserver(() => setCover(img))
          ob.observe(img, { attributeFilter: ['src'] })
        }).catch(e => {
          this.method.setCover(cover, preview, null)
          api.logger.error(e)
        })
      } else {
        if (gm.runtime.layer === 'legacy') {
          this.method.proxyCoverInteraction(cover, event => {
            try {
              const bgmid = this.method.getBgmid()
              if (cover._coverId === bgmid.id) return false
              const url = getCover(bgmid)
              this.method.setCover(cover, preview, url)
            } catch (e) {
              this.method.setCover(cover, preview, null)
              api.logger.error(e)
            }
            event.stopPropagation()
            return true
          })
        } else {
          const main = () => {
            try {
              const bgmid = this.method.getBgmid()
              if (cover._coverId === bgmid.id) return
              const url = getCover(bgmid)
              this.method.setCover(cover, preview, url)
            } catch (e) {
              this.method.setCover(cover, preview, null)
              api.logger.error(e)
            }
          }

          setTimeout(main)
          window.addEventListener('urlchange', main)
        }

        const getParams = () => unsafeWindow.getPlayerExtraParams?.()
        const getCover = (bgmid = this.method.getBgmid()) => {
          if (cover._coverId !== bgmid.id) {
            const params = getParams()
            cover._coverUrl = params.epCover
            cover._coverId = bgmid.id
          }
          return cover._coverUrl
        }
      }
    }

    async initLive() {
      const container = await api.wait.$('#head-info-vm .right-ctnr, #head-info-vm .upper-right-ctnr')
      // 这里再获取 hiVm，提前获取到的 hiVm 有可能会被替换成新的
      const hiVm = container.closest('#head-info-vm')
      await api.wait.waitForConditionPassed({
        condition: () => hiVm.__vue__,
      })

      const templateEl = container.firstElementChild
      const cover = document.createElement('a')
      cover.textContent = '获取封面'
      cover.className = templateEl.className
      cover.classList.add(`${gm.id}-live-cover-btn`)
      cover.setAttribute('style', templateEl.getAttribute('style'))
      if (gm.runtime.preview) {
        cover.style.cursor = 'none'
      }
      container.prepend(cover)
      this.method.disableContextMenu(cover)
      const preview = gm.runtime.preview && this.method.createPreview(cover)
      this.method.setHintText(cover, gm.const.hintText)

      this.method.proxyCoverInteraction(cover, async event => {
        try {
          if (cover.loaded) return false
          // 在异步等待前拦截，避免逻辑倒置
          event.stopPropagation()
          const url = await getCover()
          this.method.setCover(cover, preview, url)
        } catch (e) {
          event.stopPropagation()
          this.method.setCover(cover, preview, null)
          api.logger.error(e)
        }
        return true
      })

      // 避免直播间名字过长时热门榜/热门排名显示错乱
      api.base.addStyle(`
        .left-ctnr {
          margin-right: 1em;
        }
        .hot-rank-wrap {
          word-break: keep-all;
        }
      `)

      async function getCover() {
        if (!cover.loaded) {
          cover._coverUrl = await api.wait.waitForConditionPassed({
            condition: () => unsafeWindow.__NEPTUNE_IS_MY_WAIFU__?.roomInfoRes?.data?.room_info?.cover ?? unsafeWindow.__STORE__?.baseInfoRoom?.coverUrl,
            interval: 100,
            timeout: 2000,
            stopOnTimeout: true,
          })
        }
        return cover._coverUrl
      }
    }

    addStyle() {
      api.base.addStyle(`
        .${gm.id}-video-cover-btn {
          margin-right: 24px;
        }
        .${gm.id}-video-cover-btn[data-toolbar-version=old] {
          user-select: none;
          margin-right: 20px;
        }

        .${gm.id}-bangumi-cover-btn {
          float: right;
          cursor: pointer;
          font-size: 12px;
          margin-right: 16px;
          line-height: 36px;
          color: #505050;
          user-select: none;
        }
        .${gm.id}-bangumi-cover-btn:hover {
          color: #00a1d6;
        }

        .${gm.id}-live-cover-btn {
          cursor: pointer;
          color: #999999;
          user-select: none;
        }
        .${gm.id}-live-cover-btn:hover {
          color: #23ADE5;
        }

        .${gm.id}-preview {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000000;
          max-width: 65vw; /* 自适应宽度和高度 */
          max-height: 80vh;
          border-radius: 8px;
          display: none;
          opacity: 0;
          transition: opacity ${gm.const.fadeTime}ms ease-in-out;
          box-shadow: #000000AA 0px 3px 6px;
          pointer-events: none;
        }

        #${gmId}-realtime-cover div {
          color: gray;
          padding: 5px;
          font-size: 18px;
          text-align: center;
          user-select: none;
          display: none;
        }
      `)
    }
  }

  // B站在 2022 年的一系列更新后，无论是新版还是旧版的播放页面中，load 时点的到来晚得不合常理，如果还等到 load 再执行
  // 后续逻辑会使得脚本功能切入过慢——本来打开页面就理应能获取到封面，却要等页面加载半天，这着实是一个非常糟糕的体验。
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', main) : main()

  function main() {
    script = new Script()
    webpage = new Webpage()

    script.init()
    script.initScriptMenu()
    webpage.addStyle()
    api.base.initUrlchangeEvent()

    if (api.base.urlMatch([gm.regex.page_videoNormalMode, gm.regex.page_videoWatchlaterMode, gm.regex.page_listMode])) {
      webpage.initVideo()
    } else if (api.base.urlMatch(gm.regex.page_bangumi)) {
      webpage.initBangumi()
    } else if (api.base.urlMatch(gm.regex.page_live)) {
      webpage.initLive()
    }
  }
})()
