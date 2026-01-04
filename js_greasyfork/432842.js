// ==UserScript==
// @author            Hunlongyu
// @name              小窗口跳转
// @namespace         https://github.com/Hunlongyu
// @icon              https://i.loli.net/2019/04/22/5cbd720718fdb.png
// @description       匹配 m3u8 资源，点击播放，即跳转到播放器页面自动缓冲播放。
// @version           0.6.3
// @include           *
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_addStyle
// @run-at            document-end
// @supportURL        https://gist.github.com/Hunlongyu/31f7a08294efdacebcce9b527afb1c11
// note               2019/07/31 新增对 MP4 格式支持，更新了资源网站
// note               2019/08/05 视频名称获取更准确
// note               2019/08/09 适配更多资源网站
// note               2019/10/28 移除无效资源网站 播放页面支持一键生成标题和短网址
// note               2019/11/15 资源页面支持一键生成短网址, 并优化了页面
// note               2019/11/18 切换百度短网址为 suo短网址,次数没有限制
// note               2020/01/03 更新资源网站,修复集数显示错误问题
// note               2020/01/06 优化界面,移除广告推广
// note               2020/11/28 优化代码，适配更多资源网，更快的加载速度。
// @downloadURL https://update.greasyfork.org/scripts/432842/%E5%B0%8F%E7%AA%97%E5%8F%A3%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/432842/%E5%B0%8F%E7%AA%97%E5%8F%A3%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const css =
  `
  .zyplayer {
    position: fixed;
    bottom: 1px;
    right: 1px;
    width: 16px;
    height: auto;
    z-index: 999;
    max-height: 600px;
    overflow: auto;
    background-color: #ffffff;
    padding: 20px;
    border: 1px solid #acacac;
    font-size: 16px
  }
  .zyplayer .name{
    text-align: center;
    font-size: 5px;
    color: #ff6600;
  }
  .zyplayer li{
    margin: 6px 0;
    display: flex;
    justify-content: space-between;
  }
  `

  // code here
  const player = {
    name: '',
    li: [],
    m3u8: [],
    shortUrlArr: [],
    init () {
      console.clear()
      console.log('『小助手』 已启动！')
      this.getTitle()
    },
    getTitle () { // 判断是否是资源页面,并获取资源名称
      const h1 = document.querySelector('h1')
      const h2 = document.querySelector('h2')
      if (h1) {
        this.name = h1.innerText
      } else if (h2) {
        this.name = h2.innerText
      } else {
        this.name = document.title
      }
      this.getUrls()
    },
    getUrls () {
      const reg = /https?.*?\.m3u8/
      const list = document.querySelectorAll('li')
      if (list.length < 3) return false
      let num = 1
      for (let i = 0; i < list.length; i++) {
        const txt = list[i].outerHTML
        const flag = txt.match(reg)
        if (flag) {
          const d = {
            name: `第${num}集`,
            url: flag[0]
          }
          this.li.push(d)
          num++
        }
      }
      this.createDOM()
    },
    createDOM () {
      const dom = document.createElement('div')
      dom.setAttribute('class', 'zyplayer')
      const list = this.li
      const protocal = window.location.protocol
      const host = window.location.host
	  const url = window.location.href; /* 获取完整URL */
      if (list.length <= 1) {
        const a = `<div class="name">${this.name}</div>
        <li>
          <a href="https://api.08bk.com/vip/?url=${url}" target="_blank">播放</a>
        </li>`
        dom.innerHTML = a
      } else {
        const a = `<div class="name">${this.name}</div>
        <li>
          <a href="https://jx.m3u8.tv/jiexi/?url=${url}" target="_blank">播放</a>
        </li>`
        dom.innerHTML = a
      }
      document.body.appendChild(dom)
      GM_addStyle(css)
    }
  }
  player.init()
})()