// ==UserScript==
// @name               哔哩哔哩（bilibili.com）动态页优化
// @license            GPL-3.0 License
// @namespace          https://greasyfork.org/zh-CN/scripts/40295-%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9-bilibili-com-%E5%8A%A8%E6%80%81%E9%A1%B5%E4%BC%98%E5%8C%96
// @version            1.11
// @icon               https://www.bilibili.com/favicon.ico?v=1
// @description        1.哔哩哔哩动态页导航样式优化。2.默认显示"投稿视频"内容。
// @author             QIUZAIYOU
// @match              *://t.bilibili.com/*
// @require            https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require            https://cdn.jsdelivr.net/npm/sweetalert2@11.3.6/dist/sweetalert2.all.min.js
// @resource           swalStyle https://cdn.jsdelivr.net/npm/sweetalert2@11.3.6/dist/sweetalert2.min.css
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_registerMenuCommand
// @grant              GM_getResourceText
// @grant              GM.info
// @downloadURL https://update.greasyfork.org/scripts/40295/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibilicom%EF%BC%89%E5%8A%A8%E6%80%81%E9%A1%B5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/40295/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibilicom%EF%BC%89%E5%8A%A8%E6%80%81%E9%A1%B5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
/*——默认显示"投稿视频"内容开始——*/
$(function() {
  const utils = {
    getValue(name) {
      return GM_getValue(name)
    },
    setValue(name, value) {
      GM_setValue(name, value)
    }
  }
  const main = {
    initValue() {
      const value = [
      {
        name: 'web_video_link',
        value: 'https://t.bilibili.com/?tab=video'
      }]
      value.forEach((v) => {
        if (utils.getValue(v.name) === undefined) {
          utils.setValue(v.name, v.value)
        }
      })
    },
    registerMenuCommand() {
      GM_registerMenuCommand('设置', () => {
        const html = `
                  <div style="font-size: 1em;">
                      <label class="player-adjustment-setting-label" style="padding-top:0!important;display: grid;grid-gap: 10px">
                          「投稿视频」链接：
                          <input id="Web-Video-Link" value="${utils.getValue('web_video_link')}" style="padding:5px;text-align: center"  >
                      </label>
            </div>
                  `
        Swal.fire({
          title: '动态页调整设置',
          html,
          icon: 'info',
          showCloseButton: true,
          showDenyButton: true,
          confirmButtonText: '保存',
          denyButtonText: '重置'
        }).then((res) => {
          res.isConfirmed && location.reload(true)
          if (res.isConfirmed) {
            location.reload(true)
          } else if (res.isDenied) {
            utils.setValue('web_video_link', true)
            location.reload(true)
          }
        })
        $('#Web-Video-Link').change((e) => {
          utils.setValue('web_video_link', e.target.value)
        })
      })
    },
    consoleLogInformation() {
      console.log(' ' + GM.info.script.name, '\n', '脚本作者：' + GM.info.script.author, '\n', '-----------------', '\n', '「投稿视频」链接: ' + utils.getValue('web_video_link'))
    },
    OpenDongTai() {
      const web_video_link = utils.getValue('web_video_link')
      const url = $(location).attr('href')
      const indexHTML = 'https://t.bilibili.com/pages/nav/index'
      const indexHTMLNew = /(https:\/\/t.bilibili.com\/pages\/nav\/index_new).*/i
      const indexVoteHTML = /https:\/\/t.bilibili.com\/vote\/h5\/index\/#\/result\?vote_id=.*/i
      const webVoteHTML = /t.bilibili.com\/h5\/dynamic\/vote#\/result\?vote_id=.*/i
      const indexLotteryHTML = /https:\/\/t.bilibili.com\/lottery\/h5\/index\/.*/i
      const webLotteryHTML = /https:\/\/t.bilibili.com\/lottery\/.*/i
      const moreDongTai = /https:\/\/t.bilibili.com\/[0-9]+\?tab=[0-9]+/i
      const DongTaiDetail = /https:\/\/t.bilibili.com\/[0-9]+/i
      const DongTaiTopicDetail = /https:\/\/t.bilibili.com\/topic\/[0-9]+/i
      if (url == indexHTML || indexHTMLNew.test(url) || indexVoteHTML.test(url) || webVoteHTML.test(url) || indexLotteryHTML.test(url) || webLotteryHTML.test(url) || moreDongTai.test(url) || DongTaiDetail.test(url) || DongTaiTopicDetail.test(url)) {
        return false //不影响BiliBili首页导航栏动态悬浮窗、动态页里投票及互动抽奖页等内容显示
      }
      if (url !== web_video_link) {
        window.location.href = web_video_link
      } else {
        return false
      }
    },
    fixedStyle() {
      $('.tab-bar').css({
        'z-index': '4',
        position: 'sticky',
        top: '0'
      })
      $('.tab-bar .tab a').removeClass('selected')
      $('.tab-bar > div:nth-child(2) > a:nth-child(1)').addClass('selected')
      $('.tab-bar .line').css('transform', 'translateX(96px)')
    },
    isTopWindow() {
      return window.self === window.top
    },
    init() {
      this.initValue()
      this.fixedStyle()
      this.consoleLogInformation()
      this.OpenDongTai()
      this.isTopWindow() && this.registerMenuCommand()
    }
  }
  main.init()
})
