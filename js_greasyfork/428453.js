// ==UserScript==
// @name            B站共同关注快速查看
// @version         1.14.0.20240827
// @namespace       laster2800
// @author          Laster2800
// @description     快速查看与特定用户的共同关注（视频播放页、动态页、用户空间、直播间）
// @icon            https://www.bilibili.com/favicon.ico
// @homepageURL     https://greasyfork.org/zh-CN/scripts/428453
// @supportURL      https://greasyfork.org/zh-CN/scripts/428453/feedback
// @license         LGPL-3.0
// @include         *://www.bilibili.com/*
// @include         *://t.bilibili.com/*
// @include         *://space.bilibili.com/*
// @include         /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+([/?]|$)/
// @exclude         *://www.bilibili.com/watchlater/
// @exclude         *://www.bilibili.com/correspond/*
// @exclude         *://www.bilibili.com/page-proxy/*
// @exclude         *://t.bilibili.com/*/*
// @require         https://update.greasyfork.org/scripts/409641/1435266/UserscriptAPI.js
// @require         https://update.greasyfork.org/scripts/432002/1161015/UserscriptAPIWait.js
// @require         https://update.greasyfork.org/scripts/432003/1381253/UserscriptAPIWeb.js
// @grant           GM_notification
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_listValues
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @connect         api.bilibili.com
// @compatible      edge 版本不小于 93
// @compatible      chrome 版本不小于 93
// @compatible      firefox 版本不小于 92
// @downloadURL https://update.greasyfork.org/scripts/428453/B%E7%AB%99%E5%85%B1%E5%90%8C%E5%85%B3%E6%B3%A8%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/428453/B%E7%AB%99%E5%85%B1%E5%90%8C%E5%85%B3%E6%B3%A8%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
  'use strict'

  const gm = {
    id: 'gm428453',
    configVersion: GM_getValue('configVersion'),
    configUpdate: 20210928,
    config: {
      dispMessage: true,
      dispInReverse: false,
      dispInText: false,
      dispRelation: true,
      userSpace: true,
      rareCard: false,
    },
    configMap: {
      dispMessage: { default: true, name: '无共同关注或查询失败时提示信息', needNotReload: true },
      dispInReverse: { default: false, name: '以目标 [最新关注 → 最早关注] 排序', needNotReload: true },
      dispInText: { default: false, name: '以纯文本形式显示', needNotReload: true },
      dispRelation: { default: true, name: '显示目标与本账号的关系', needNotReload: true },
      userSpace: { default: true, name: '在用户空间启用' },
      rareCard: { default: false, name: '在非常规用户卡片启用' },
    },
    url: {
      api_sameFollowings: uid => `https://api.bilibili.com/x/relation/same/followings?vmid=${uid}`,
      api_relation: uid => `https://api.bilibili.com/x/space/acc/relation?mid=${uid}`,
      page_space: uid => `https://space.bilibili.com/${uid}`,
      gm_changelog: 'https://gitee.com/liangjiancang/userscript/blob/master/script/BilibiliSameFollowing/changelog.md',
    },
    regex: {
      page_videoNormalMode: /\.com\/video([#/?]|$)/,
      page_videoWatchlaterMode: /\.com\/medialist\/play\/(watchlater|ml\d+)([#/?]|$)/,
      page_listMode: /\.com\/list\/.+/,
      page_dynamic: /\/t\.bilibili\.com(\/|$)/,
      page_dynamicDetail: /\/t\.bilibili\.com\/\d+([#/?]|$)/,
      page_article: /\.com\/read\/cv\d+([#/?]|$)/,
      page_space: /space\.bilibili\.com\/\d+([#/?]|$)/,
      page_live: /live\.bilibili\.com\/(blanc\/)?\d+([#/?]|$)/, // 只含具体的直播间页面
    },
    const: {
      noticeTimeout: 5600,
    },
  }

  /* global UserscriptAPI */
  const api = new UserscriptAPI({
    id: gm.id,
    label: GM_info.script.name,
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
     * 初始化脚本菜单
     */
    initScriptMenu() {
      const _self = this
      const cfgName = id => `[ ${config[id] ? '✓' : '✗'} ] ${configMap[id].name}`
      const { config, configMap } = gm
      const menuMap = {}
      for (const id of Object.keys(config)) {
        menuMap[id] = createMenuItem(id)
      }
      // 其他菜单
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
      if (gm.configVersion >= 20210829) { // 1.5.0.20210829
        if (gm.configVersion < gm.configUpdate) {
          // 必须按从旧到新的顺序写
          // 内部不能使用 gm.configUpdate，必须手写更新后的配置版本号！

          // 1.8.0.20210928
          if (gm.configVersion < 20210928) {
            GM_deleteValue('live')
            GM_deleteValue('commonCard')
          }

          // 功能性更新后更新此处配置版本
          if (gm.configVersion < 0) {
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
  }

  /**
   * 页面处理的抽象，脚本围绕网站的特化部分
   */
  class Webpage {
    /** 通用方法 */
    method = {
      /**
       * 从 URL 中获取 UID
       * @param {string} [url=location.href] URL
       * @returns {string} UID
       */
      getUid(url = location.href) {
        return /\/(\d+)([#/?]|$)/.exec(url)?.[1] ?? null
      },

      /**
       * 获取指定用户与你的关系
       * @param {string} uid UID
       * @returns {Promise<{code: number, special: boolean}>} `{code, special}`
       * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/user/relation.md#查询用户与自己关系_互相 查询用户与自己关系_互相}
       */
      async getRelation(uid) {
        const resp = await api.web.request({
          url: gm.url.api_relation(uid),
        }, { check: r => r.code === 0 })
        const relation = resp.data.be_relation
        return { code: relation.attribute, special: relation.special === 1 }
      },

      /**
       * 判断用户是否为自己
       * @param {string | number} uid UID
       * @returns {boolean} 用户是否为自己
       */
      isUserSelf(uid) {
        const selfUid = document.cookie.replace(/(?:(?:^|.*;\s*)DedeUserID\s*=\s*([^;]*).*$)|^.*$/, '$1')
        return selfUid ? String(uid) === selfUid : false
      },
    }

    /**
     * 卡片处理逻辑
     * @param {Object} options 选项
     * @param {string | { querySelector: Function }} [options.container] 卡片父元素（选择器），缺省时取 `document.body`
     * @param {string} options.card 卡片元素选择器
     * @param {string} options.user 用户元素选择器
     * @param {string} options.info 信息元素选择器
     * @param {boolean} [options.lazy=true] 卡片内容是否为懒加载
     * @param {boolean} [options.ancestor] 将 `container` 视为祖先元素而非父元素
     * @param {string} [options.before] 将信息显示元素插入到信息元素内部哪个元素之前，以 CSS 选择器定义，缺省时插入到信息元素最后
     */
    async cardLogic(options) {
      options = { lazy: true, ancestor: false, ...options }
      let container = null
      if (options?.container?.querySelector instanceof Function) {
        container = options.container
      } else {
        container = options.container ? await api.wait.$(options.container) : (document.body ?? await api.wait.$('body'))
      }
      api.wait.executeAfterElementLoaded({
        selector: options.card,
        base: container,
        subtree: options.ancestor,
        repeat: true,
        timeout: 0,
        callback: async card => {
          let userLink = null
          // 存在两种情况，不能简单套用一个 waitQuerySelector 来处理，否则可能会引入无效等待
          if (options.lazy) {
            // 情况 1：往「正在加载」状态的 card 中添加元素，使其转化为「已完成」状态
            userLink = await api.wait.$(options.user, card)
          } else {
            // 情况 2：将「正在加载」状态的 card 移除，然后将「已完成」状态的 card 添加到 DOM 中
            userLink = card.querySelector(options.user)
          }
          if (userLink) {
            const info = await api.wait.$(options.info, card)
            const before = options.before && await api.wait.$(options.before, info)
            await this.generalLogic({
              uid: this.method.getUid(userLink.href),
              target: info,
              className: `${gm.id} card-same-followings`,
              before,
            })
          }
        },
      })
    }

    /**
     * 通用处理逻辑
     * @param {Object} options 选项
     * @param {string | number} options.uid 用户 ID
     * @param {HTMLElement} options.target 指定目标元素
     * @param {string} [options.className=''] 显示元素的类名；若 `target` 的子孙元素中有对应元素则直接使用，否则创建之
     * @param {HTMLElement} [options.before] 将信息显示元素插入哪个元素之前，该元素须为目标元素的子元素；缺省时插入到目标元素最后
     */
    async generalLogic(options) {
      const { uid, target, before } = options
      if (webpage.method.isUserSelf(uid)) return
      let dispEl = target.sameFollowings ?? (options.className ? target.querySelector(options.className.replaceAll(/(^|\s+)(?=\w)/g, '.')) : null)
      if (dispEl) {
        dispEl.textContent = ''
      } else {
        dispEl = document.createElement('div')
        if (before && target.contains(before)) {
          before.before(dispEl)
        } else {
          target.append(dispEl)
        }
        dispEl.className = options.className || ''
        target.sameFollowings = dispEl
      }
      dispEl.style.display = 'none'

      try {
        let resp = await api.web.request({
          url: gm.url.api_sameFollowings(uid),
        })
        if (resp.code === 0) {
          const { data } = resp
          if (data.list) {
            const { total } = data
            const totalPages = Math.ceil(total / 50)
            for (let i = 2; i <= totalPages; i++) {
              resp = await api.web.request({
                url: `${gm.url.api_sameFollowings(uid)}&pn=${i}`,
              })
              if (resp.code !== 0 || !resp.data.list) break
              data.list.push(...resp.data.list)
            }
          }
          let sameFollowings = null
          sameFollowings = (gm.config.dispInText ? data.list?.map(item => item.uname) : data.list) ?? []
          if (sameFollowings.length > 0 || gm.config.dispMessage) {
            if (sameFollowings.length > 0) {
              if (!gm.config.dispInReverse) {
                sameFollowings.reverse()
              }
              if (gm.config.dispInText) {
                dispEl.innerHTML = `<div class="gm-pre">共同关注</div><div class="same-following">${sameFollowings.join('，&nbsp;')}</div>`
              } else {
                const highlights = this.getHighlightFollowings()
                let innerHTML = `<div class="gm-pre" title="加粗：本账号特别关注\n下划线：与本账号互粉\n目标的关注时间：${gm.config.dispInReverse ? '最新关注 → 最早关注' : '最早关注 → 最新关注'}">共同关注</div><div>`
                for (const item of sameFollowings) {
                  const { uname, sign } = item
                  const mid = String(item.mid)
                  let className = 'same-following'
                  if (item.special === 1) { // 特别关注
                    className += ' gm-special'
                  }
                  if (item.attribute === 6) { // 互粉
                    className += ' gm-mutual'
                  }
                  for (const highlight of highlights) { // 高亮显示
                    if (highlight === mid || highlight === uname) {
                      className += ' gm-highlight'
                    }
                  }
                  const mtime = new Date(item.mtime * 1000)
                  const myFollowingTime = `${mtime.toLocaleDateString()} ${mtime.toLocaleTimeString()}`
                  const verify = item.official_verify?.desc
                  let title = ''
                  if (verify) title += `认证：${verify}\n`
                  if (sign) title += `签名：${sign}\n`
                  title += `本账号关注时间：${myFollowingTime}`
                  innerHTML += `<a href="${gm.url.page_space(mid)}" target="_blank" class="${className}" title="${title}">${uname}</a><span>，&nbsp;</span>`
                }
                dispEl.innerHTML = innerHTML.slice(0, -'<span>，&nbsp;</span>'.length) + '</div>'
              }
            } else if (gm.config.dispMessage) {
              dispEl.innerHTML = '<div class="gm-pre">共同关注</div><div class="same-following">[ 无 ]</div>'
            }
          }
        } else {
          if (gm.config.dispMessage && resp.message) {
            const message = resp.code === 22115 ? '关注列表不可见' : resp.message
            dispEl.innerHTML = `<div class="gm-pre">共同关注</div><div title="查询失败 [ code: ${resp.code}, message: ${resp.message} ]" class="same-following">[ ${message} ]</div>`
          }
          const msg = [resp.code, resp.message]
          if (resp.code > 0) {
            api.logger.info(msg)
          } else {
            api.logger.error(msg)
          }
        }
      } catch (e) {
        if (gm.config.dispMessage) {
          dispEl.innerHTML = '<div class="gm-pre">共同关注</div><div class="same-following">[ 网络请求错误 ]</div>'
        }
        api.logger.error(e)
      }

      if (gm.config.dispRelation) {
        try {
          const relation = await this.method.getRelation(uid)
          const desc = (relation.special ? {
            1: '对方悄悄关注并特别关注了你', // impossible
            2: '对方特别关注了你',
            6: '对方与你互粉并特别关注了你',
            128: '对方已将你拉黑，但特别关注了你', // impossible
          } : {
            1: '对方悄悄关注了你',
            2: '对方关注了你',
            6: '对方与你互粉',
            128: '对方已将你拉黑',
          })[relation.code]
          if (desc) {
            dispEl.insertAdjacentHTML('afterbegin', `<div class="gm-relation">${desc}</div>`)
          }
        } catch (e) {
          api.logger.error(e)
        }
      }

      if (dispEl.textContent) {
        dispEl.style.display = ''
      }
    }

    /**
     * 获取当前页面高亮关注
     *
     * @returns {string[]} 高亮关注（数组元素为 uid 或用户名）
     */
    getHighlightFollowings() {
      const highlights = []
      if (api.base.urlMatch(gm.regex.page_videoNormalMode)) {
        const uploader = '#v_upinfo .u-face a.u-face__avatar' // 单独投稿（新旧版一致）
        const oldGroup = '.members-info .up-card a.avatar' // 旧版集体投稿
        const newGroup = '.members-info-v1 .up-card a.avatar' // 新版集体投稿
        const highlightEls = document.querySelectorAll(`${uploader},${oldGroup},${newGroup}`)
        for (const el of highlightEls) {
          const uid = this.method.getUid(el)
          uid && highlights.push(uid)
        }
      } else if (api.base.urlMatch(gm.regex.page_dynamicDetail)) {
        const author = '.card .bili-dyn-item .bili-dyn-title' // 动态所有者
        const origAuthor = '.card .bili-dyn-item .dyn-orig-author' // 原动态所有者（对于转发动态）
        const highlightEls = document.querySelectorAll(`${author},${origAuthor}`)
        for (const el of highlightEls) {
          const text = el.textContent.replace(/^\s*/, '').replace(/\s*$/, '')
          highlights.push(text)
        }
      } else if (api.base.urlMatch(gm.regex.page_article)) {
        const el = document.querySelector('.article-up-info .avatar-container a')
        const uid = this.method.getUid(el)
        uid && highlights.push(uid)
      }
      return highlights
    }

    /**
     * 初始化 <bili-user-profile> 处理
     */
    async initBiliUserProfile() {
      const bup = await api.wait.$('bili-user-profile')
      webpage.cardLogic({
        container: bup.shadowRoot,
        card: '#view',
        user: '#avatar',
        info: '#content',
      })
      webpage.addStyle(bup.shadowRoot)
    }

    /**
     * 初始化动态页
     *
     * 针对 (左方「正在直播」 + 动态所有者 + 被转发动态所有者) 的用户卡片。
     */
    async initDynamic() {
      const container = await api.wait.waitForElementLoaded({
        selector: '.bili-user-profile',
        base: document.body,
        subtree: false,
        timeout: 0,
      })

      // 此处B站的用户卡片更新方式比较奇葩
      // 查看未查看过的用户时：直接改部分元素的 textContent 来达成效果
      // 查看已查看过用户时：通过其他方式，如 setAttribute() 来达成效果
      let userLink = null
      // 处理查看未查看过的用户，用 wait API 中的黑科技解决
      api.wait.executeAfterElementLoaded({
        selector: '.bili-user-profile-view__avatar',
        base: container,
        repeat: true,
        timeout: 0,
        callback: el => {
          userLink = el
          update()

          // 处理查看已查看过用户
          const ob = new MutationObserver(update)
          ob.observe(userLink, { attributeFilter: ['href'] })
        },
      })

      async function update() {
        const uid = webpage.method.getUid(userLink.href)
        if (uid) {
          webpage.generalLogic({
            uid,
            target: await api.wait.$('.bili-user-profil1e__info__body', container),
            className: `${gm.id} card-same-followings`,
          })
        }
      }
    }

    /**
     * 初始化直播间
     *
     * 处理点击弹幕弹出的信息卡片。
     */
    async initLive() {
      const frame = self !== top
      const container = await api.wait.$('.danmaku-menu')
      const usernameEl = await api.wait.$('.username', container)
      container.style.width = 'auto'
      container.style.maxWidth = frame ? '264px' : '300px'
      api.base.addStyle(`
        .danmaku-menu .none-select > * {
          padding: 4px 10px !important;
        }
      `)

      const ob = new MutationObserver(() => {
        const uid = container.__vue__.info?.uid
        if (uid) {
          webpage.generalLogic({
            uid,
            target: container,
            className: `${gm.id} live-same-followings`,
          })

          // 若在 frame 中，container 右边会被 frame 边界挡住使得宽度受限，用 transform 左移也无法突破
          // 故不能直接用一个 transform 来解决，须动态计算
          // 说是动态计算，也不要根据宽度增量来算偏移了，一是官方自己的位置就不科学；二是想精确计算，必须得等到卡片
          // 注入文字之后，那么偏移的时间点就晚了，会造成视觉上非常强烈的不适感，综合显示效果还不如现在这样
          container.style.left = frame ? '76vw' : '72vw'
        }
      })
      ob.observe(usernameEl, { childList: true, subtree: true })
    }

    addStyle(doc = document) {
      api.base.addStyle(`
        .${gm.id} > * {
          display: inline-block;
        }
        .${gm.id} > *,
        .${gm.id} .same-following {
          color: inherit;
          text-decoration: none;
          outline: none;
          margin: 0;
          padding: 0;
          border: 0;
          vertical-align: baseline;
          white-space: pre-wrap;
          word-break: break-all;
        }
        .${gm.id} a.same-following:hover,
        .${gm.id} .gm-highlight {
          color: #00a1d6;
        }
        .${gm.id} .same-following.gm-highlight:hover {
          color: #3f51b5;
        }
        .${gm.id} .gm-relation {
          display: block;
          font-weight: bold;
        }
        .${gm.id} .gm-special {
          font-weight: bold;
        }
        .${gm.id} .gm-mutual {
          text-decoration: underline;
        }

        .${gm.id}.card-same-followings {
          color: #99a2aa;
          padding: 1em 0 0;
          font-size: 12px;
        }
        .${gm.id}.card-same-followings .gm-pre {
          position: absolute;
          margin-left: -5em;
          line-height: unset;
        }

        .${gm.id}.space-same-followings {
          margin-bottom: 0.5em;
          padding: 0.5em 1.6em;
          background: #fff;
          box-shadow: 0 0 0 1px #eee;
          border-radius: 0 0 4px 4px;
        }
        .${gm.id}.space-same-followings .gm-pre {
          font-weight: bold;
          padding-right: 1em;
        }

        .${gm.id}.live-same-followings {
          margin: 1em;
        }
        .${gm.id}.live-same-followings > * {
          display: block;
        }
        .${gm.id}.live-same-followings > :first-child {
          margin-bottom: 0.5em;
        }
        .${gm.id}.live-same-followings .gm-pre {
          font-weight: bold;
        }

        .z-aside-area {
          z-index: 11;
        }
      `, doc)
    }
  }

  document.readyState !== 'complete' ? window.addEventListener('load', main) : main()

  async function main() {
    script = new Script()
    webpage = new Webpage()

    script.init()
    script.initScriptMenu()
    webpage.addStyle()

    // 遍布全站的常规用户卡片，如视频评论区、动态评论区、用户空间评论区……
    // 旧版用户卡片
    webpage.cardLogic({
      card: '.user-card',
      user: '.face',
      info: '.info',
      lazy: false,
    })
    // 2022 版用户卡片
    webpage.cardLogic({
      card: '.user-card',
      user: '.card-user-name',
      info: '.card-content',
      before: '.card-btn-warp',
      lazy: false,
    })
    // 2024 下半年版用户卡片
    webpage.initBiliUserProfile()

    if (api.base.urlMatch([gm.regex.page_videoNormalMode, gm.regex.page_listMode])) {
      // 常规播放页中的UP主头像
      // 旧版播放页：     .user-card-m
      // 2022 版播放页：  .user-card-m-exp
      webpage.cardLogic({
        card: '.user-card-m, .user-card-m-exp',
        user: '.face',
        info: '.info',
        before: '.btn-box',
        ancestor: true,
      })
    } else if (api.base.urlMatch(gm.regex.page_videoWatchlaterMode)) {
      // 稍后再看播放页中的UP主头像
      webpage.cardLogic({
        container: '#app #app', // 这是什么阴间玩意？
        card: '.user-card-m',
        user: '.face',
        info: '.info',
        before: '.btn-box',
      })
    } else if (api.base.urlMatch(gm.regex.page_dynamic)) {
      // 动态页中，(左方「正在直播」 + 动态所有者 + 被转发动态所有者) 的用户卡片
      webpage.initDynamic()
    } else if (api.base.urlMatch(gm.regex.page_space)) {
      if (gm.config.userSpace) {
        // 用户空间顶部显示
        webpage.generalLogic({
          uid: webpage.method.getUid(),
          target: await api.wait.$('.h .wrapper'),
          className: `${gm.id} space-same-followings`,
        })
      }
      if (gm.config.rareCard) {
        // 用户空间的动态中，被转发动态的所有者的用户卡片
        webpage.cardLogic({
          card: '.userinfo-wrapper',
          user: '.face',
          info: '.info',
          ancestor: true,
        })
        // 用户空间右侧充电中的用户卡片
        webpage.cardLogic({
          card: '#id-card',
          user: '.idc-avatar-container',
          info: '.idc-info',
        })
      }
    } else if (api.base.urlMatch(gm.regex.page_live)) {
      // 直播间点击弹幕弹出的信息卡片
      webpage.initLive()
    }
  }
})()
