// ==UserScript==
// @name         vanyaha-bot
// @description  抓取详情
// @match        https://www.douban.com/*
// @match        https://36kr.com/*
// @match        https://www.skateboardchina.com/*
// @require      http://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @connect      https://meirixinxue.com
// @connect      https://xinxue.meirixinxue.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @version      1.3
// @namespace    vanyah
// @downloadURL https://update.greasyfork.org/scripts/430103/vanyaha-bot.user.js
// @updateURL https://update.greasyfork.org/scripts/430103/vanyaha-bot.meta.js
// ==/UserScript==

//  https://xinxue.meirixinxue.com/api/traces?api_auth_token=3d8435df-c912-4fee-a9fb-151300b9e13d
//  https://meirixinxue.com/api/traces?api_auth_token=3d8435df-c912-4fee-a9fb-151300b9e13d

;(function () {
  'use strict'
  unsafeWindow.GM_notification = GM_notification
  unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest

  const href = window.location.href
  const apiUrl = GM_getValue('apiUrl')

  const website = {
    douban: 'https://www.douban.com/',
    kr: 'https://36kr.com/',
    skateboardchina: 'https://www.skateboardchina.com/',
  }

  const filterParams = () => {
    const api_auth_token = apiUrl.split('?api_auth_token=')[1]
    let params = { raw_url: href, api_auth_token }
    if (href.includes(website.skateboardchina)) {
      const title = $('.cms_title h2').text()
      const body = $('.detail_content').html()
      params = Object.assign(params, { category: 'article', title, body })
    }
    return params
  }

  const saveData = (params) => {
    const api = apiUrl.split('?')[0]
    const data = { ...params }
    fetch(api, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then((res) => res.json())
      .then((res) => {
        unsafeWindow.GM_notification(
          res.error
            ? { title: '抓取失败', text: res.error, timeout: 30000 }
            : { title: '抓取成功', text: '已保存', timeout: 30000 }
        )
      })
  }

  const addSaveBtn = () => {
    const body = $('body')
    const style =
      'width:100px;height:50px;background:#f00;color:#fff;border:none;display:block;margin-left:auto'
    const text = `<button type="button" style=${style} id="save_data">保存</button>`
    body.prepend(text)
    $('#save_data').click(function () {
      const params = filterParams()
      saveData(params)
    })
  }

  const setting = () => {
    GM_registerMenuCommand(`设置地址 ${apiUrl}`, () => {
      setTimeout(() => {
        const apiUrl = prompt('链接地址', 'https://xxxxx.com?api_auth_token=yyy')
        if (apiUrl !== null) {
          GM_setValue('apiUrl', apiUrl)
          unsafeWindow.GM_notification('设置完成', '重新刷新网页')
        }
      }, 1000)
    })
  }

  setting()
  addSaveBtn()
})()
