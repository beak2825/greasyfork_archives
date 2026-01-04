// ==UserScript==
// @name            B站点赞批量取消@Deprecated
// @version         1.2.12@Deprecated.20240826
// @namespace       laster2800
// @author          Laster2800
// @description     取消对于某个UP主的所有点赞
// @icon            https://www.bilibili.com/favicon.ico
// @homepageURL     https://greasyfork.org/zh-CN/scripts/445754
// @supportURL      https://greasyfork.org/zh-CN/scripts/445754/feedback
// @license         LGPL-3.0
// @noframes
// @include         *://space.bilibili.com/*
// @require         https://update.greasyfork.org/scripts/409641/1161014/UserscriptAPI.js
// @require         https://update.greasyfork.org/scripts/431998/1161016/UserscriptAPIDom.js
// @require         https://update.greasyfork.org/scripts/432000/1095149/UserscriptAPIMessage.js
// @require         https://update.greasyfork.org/scripts/432002/1161015/UserscriptAPIWait.js
// @require         https://update.greasyfork.org/scripts/432003/1381253/UserscriptAPIWeb.js
// @grant           GM_xmlhttpRequest
// @grant           GM_registerMenuCommand
// @connect         api.bilibili.com
// @compatible      edge 版本不小于 93
// @compatible      chrome 版本不小于 93
// @compatible      firefox 版本不小于 92
// @downloadURL https://update.greasyfork.org/scripts/445754/B%E7%AB%99%E7%82%B9%E8%B5%9E%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%40Deprecated.user.js
// @updateURL https://update.greasyfork.org/scripts/445754/B%E7%AB%99%E7%82%B9%E8%B5%9E%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%40Deprecated.meta.js
// ==/UserScript==

(function() {
  'use strict'

  const gm = {
    id: 'gm445754',
    busy: false,
    button: null,
    fn: {
      init() {
        api.base.addStyle('.gm445754-link { text-decoration: underline; }')
        this.addButton()
        this.addScriptMenu()
      },

      busy(state) {
        if (state !== undefined) {
          if (gm.button) {
            gm.button.style.pointerEvents = state ? 'none' : ''
            gm.button.textContent = state ? '处理中...' : '取消点赞'
          }
          gm.busy = state
        }
        return gm.busy
      },

      async addButton() {
        const container = await api.wait.$('.h .h-action')
        const button = document.createElement('div')
        button.textContent = '取消点赞'
        button.className = 'h-f-btn'
        button.addEventListener('click', () => this.start())
        container.lastElementChild.before(button)
        gm.button = button
      },

      addScriptMenu() {
        GM_registerMenuCommand('取消点赞', () => this.start())
      },

      async start() {
        if (this.busy()) return
        this.busy(true)
        const ps = 30
        const delay = 600 // 经实测这个延时不太容易触发后台拦截机制
        const dTotal = 2
        const uid = await api.message.prompt('请输入待取消点赞UP主的 UID：', /\/(\d+)([#/?]|$)/.exec(location.pathname)?.[1])
        if (/^\d+$/.test(uid)) {
          let start = await api.message.prompt(`从最新投稿的第几页开始执行？（每页 ${ps} 项）`, '1')
          start = !/^\d+$/.test(start) ? 1 : Number.parseInt(start)
          const total = await api.message.prompt(`
              <p>共执行多少页？（每页 ${ps} 项）</p>
              <p><b>警告：一次执行多页极有可能导致点赞接口失效！这不仅会使脚本无法正常工作，还会影响到账号的正常使用！</b>一次执行两页是B站后台能接受的（至少本人测试如此），想求稳的可以每次执行一页。</p>
              <p>对脚本使用有困惑请查看 <a href="https://gitee.com/liangjiancang/userscript/blob/master/script/BilibiliCancelLikes/README.md#faq" target="_blank" class="gm445754-link">README FAQ</a>。</p>
            `, dTotal, { html: true })
          const end = start + ((/^\d+$/.test(total) && Number.parseInt(total) > 0) ? Number.parseInt(total) : dTotal) - 1
          const result = await api.message.confirm(`是否要取消对UP主 UID ${uid} 第 ${start} ~ ${end} 页的所有点赞，该操作不可撤销！`)
          if (result) {
            const ret = {}
            api.message.alert(`正在取消对UP主 UID ${uid} 的点赞。执行过程详见控制台，执行完毕前请勿关闭当前页面或将当前页面置于后台！`, null, ret)
            const result = await gm.fn.cancelDislikes(uid, start, end, delay)
            if (ret.dialog.state < 3) {
              ret.dialog.close()
            }
            if (result.success) {
              await api.message.alert(`
                <p>取消点赞执行完毕，共取消点赞 ${result.cancelCnt} 次，详细信息请查看控制台。</p>
                <p><b>警告：接下来在短时间内请勿使用本脚本功能（建议至少在五分钟以上，时间再短一点似乎也是可以的，但有风险），否则有可能导致点赞接口失效！这不仅会使脚本无法正常工作，还会影响到账号的正常使用！</b></p>
                <p>对脚本使用有困惑请查看 <a href="https://gitee.com/liangjiancang/userscript/blob/master/script/BilibiliCancelLikes/README.md#faq" target="_blank" class="gm445754-link">README FAQ</a>。</p>
              `, { html: true })
            } else {
              await api.message.alert(`
                <p>取消点赞执行错误，发生错误前共取消点赞 ${result.cancelCnt} 次，详细信息请查看控制台。</p>
                <p><b>警告：点赞接口已失效，目前脚本已无法正常工作，账号的正常使用也受到影响！接下来一段时间内请勿使用本脚本功能（建议至少在一小时以上），同时尽可能避免给视频点赞！</b></p>
                <p>对脚本使用有困惑请查看 <a href="https://gitee.com/liangjiancang/userscript/blob/master/script/BilibiliCancelLikes/README.md#faq" target="_blank" class="gm445754-link">README FAQ</a>。</p>
              `, { html: true })
            }
          }
        } else if (uid !== null) {
          await api.message.alert('UID 格式错误。')
        }
        this.busy(false)
      },

      async cancelDislikes(uid, start, end, delay = 300) {
        const csrf = this.getCSRF()
        let cancelCnt = 0
        const ps = 30
        let pn = start
        let count = -1
        let maxPn = 1
        api.logger.info(`START: UID = ${uid}, START = ${start}, END = ${end}`)
        do {
          api.logger.info(`PAGE: ${pn} / ${end} / ${count < 0 ? '?' : maxPn}`)
          const resp = await api.web.request({
            method: 'GET',
            url: `https://api.bilibili.com/x/space/arc/search?mid=${uid}&pn=${pn}&ps=${ps}`,
          }, { check: r => r.code === 0 })
          if (count < 0) {
            count = resp.data.page.count
            maxPn = Math.ceil(count / ps)
            if (end > maxPn) {
              end = maxPn
            }
            if (pn > maxPn) {
              pn += 1
              break
            }
          }
          const { vlist } = resp.data.list
          for (const item of vlist) {
            // 无法判断用户是否给目标视频点过赞，只能判断用户是否在近期给目标视频点过赞，必须跳过检测直接操作
            const sp = new URLSearchParams()
            sp.append('bvid', item.bvid)
            sp.append('like', '2') // 取消点赞
            sp.append('csrf', csrf)
            const r = await api.web.request({
              method: 'POST',
              url: 'https://api.bilibili.com/x/web-interface/archive/like',
              data: sp,
            })
            // r.code:
            // -412   - 请求被拦截
            // 65004  - 取消赞失败 未点赞过
            if (r.code === 0) {
              api.logger.info(`CANCEL: ${item.title} (${item.bvid})`)
              cancelCnt += 1
            } else if (r.code < 0) {
              api.logger.error('ERROR: 请求被拦截，点赞接口已失效，接下来一段时间内请勿使用本脚本功能（建议至少在一小时以上），同时尽可能避免给视频点赞！', r)
              return { success: false, cancelCnt, error: r }
            }
            await this.randomDelay(delay)
          }
        } while (pn++ < end)
        api.logger.info(`COMPLETE: 共取消点赞 ${cancelCnt} 次，执行范围为第 ${start} ~ ${pn - 1} 页`)
        return { success: true, cancelCnt }
      },

      async randomDelay(exp) {
        await new Promise(resolve => setTimeout(resolve, exp * (Math.random() * 0.5 + 0.75)))
      },

      getCSRF() {
        return document.cookie.replace(/(?:(?:^|.*;\s*)bili_jct\s*=\s*([^;]*).*$)|^.*$/, '$1')
      },
    },
  }

  /* global UserscriptAPI */
  const api = new UserscriptAPI({
    id: gm.id,
    label: GM_info.script.name,
  })

  gm.fn.init()
})()
