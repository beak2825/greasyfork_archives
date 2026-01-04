// ==UserScript==
// @name           DCF 抖音创意导入助手
// @description    方便在刷抖音的同时，将质量好的视频导入到创意库
// @author         BikeKoala
// @contributor    BikeKoala
// @connect        *
// @grant          GM_xmlhttpRequest
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @match          https://www.douyin.com/*
// @version        1.0.2
// @icon           https://sf1-scmcdn-tos.pstatp.com/goofy/ies/douyin_web/public/favicon.ico
// @run-at         document-end
// @namespace      bikekoala_js
// @downloadURL https://update.greasyfork.org/scripts/430042/DCF%20%E6%8A%96%E9%9F%B3%E5%88%9B%E6%84%8F%E5%AF%BC%E5%85%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/430042/DCF%20%E6%8A%96%E9%9F%B3%E5%88%9B%E6%84%8F%E5%AF%BC%E5%85%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 定义基础变量
const mApiBase = 'http://giraffe.ueelink.cn:3003/monkey/videocase/douyin'
//const mApiBase = 'http://10.10.0.11:3003/monkey/videocase/douyin'
const mBtnId = '_dcf_giraffe_task_btn'

// 定义基础方法
function parseLink() {
  const matched = location.href.match(/https\:\/\/www\.douyin\.com\/video\/(\d{19,20})/)
  return matched[0]
}

function getWebdata() {
  const data = JSON.parse(decodeURIComponent(document.getElementById('RENDER_DATA').innerHTML))
  const id = Object.keys(data).filter(v => {
    const id = parseInt(v)
    if (!isNaN(id)) return id > 1
  })[0]
  return data[id]
}

function showToast(msg, duration = 3000) {
  const m = document.createElement('div')
  m.innerHTML = msg
  m.style.cssText = 'font-family:siyuan;max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;'
  document.body.appendChild(m)
  setTimeout(function () {
    const d = 0.5
    m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in'
    m.style.opacity = '0'
    setTimeout(function() {
      document.body.removeChild(m)
    }, d * 1000);
  }, duration)
}

function request(method, path, params = null, data = null) {
  const url = mApiBase + path + (params ? '?' + $.param(params) : '')
  data = data ? JSON.stringify(data): ''
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method,
      url,
      data,
      headers: {
        'Content-Type': 'application/json'
      },
      onload: (response) => {
        if (response.status >= 200 && response.status < 400) {
          const ret = JSON.parse(response.responseText)
          if (ret.code === 200) {
            resolve(ret.data)
          } else {
            showToast('接口失败：' + ret.message)
            reject(ret.message)
          }
        } else {
          showToast('接口失败：' + response.responseText)
          reject()
        }
      },
      onabort: () => {
        showToast('接口失败')
        reject()
      },
      onerror: () => {
        showToast('接口失败')
        reject('接口请求失败')
      },
      ontimeout: () => {
        showToast('接口超时')
        reject()
      }
    })
  })
}

function getVideoTaskStatus() {
  const link = parseLink()
  return new Promise((resolve, reject) => {
    request('GET', '', { link })
      .then(v => resolve(v.status))
      .catch(e => reject(e))
  })
}

function createVideoTask() {
  const link = parseLink()
  const webdata = getWebdata()
  if (!link.endsWith(webdata.awemeId)) {
    location.reload()
    return new Promise(() => {})
  }
  const html = JSON.stringify(webdata)

  return new Promise((resolve, reject) => {
    request('POST', '', null, { link, html })
      .then(v => resolve(v))
      .catch(e => reject(e))
  })
}

function cancelVideoTask() {
  const link = parseLink()
  return new Promise((resolve, reject) => {
    request('DELETE', '', { link })
      .then(v => resolve(v))
      .catch(e => reject(e))
  })
}

function showButton() {
  const $container = $('.xg-video-container')
  $container.parent().css('overflow', 'visible')
  $container.parent().parent().css('overflow', 'visible')
  $container.before(`
      <div id="${mBtnId}" style="display: hidden; position: relative; left: -30px; width: 25px; height: 25px; cursor: pointer; color: white; font-weight: bold; text-align: center; line-height: 25px;"></div>
    `);
}

function modifyButton(action) {
  const colours = { create: 'gray', cancel: 'orange' }
  const signs = { create: '+', cancel: '-' }
  $('#' + mBtnId)
    .css('display', 'block')
    .css('background', colours[action])
    .data('action', action)
    .html(signs[action])
}

function initButton() {
  const _checkAndModifyButton = () => {
    getVideoTaskStatus()
      .then(v => modifyButton(['stopped', 'canceled'].includes(v) ? 'create' : 'cancel'))
      .catch(() => modifyButton('create'))
  }

  // 初始化按钮状态
  showButton()
  $(window).on('popstate', _checkAndModifyButton) // 浏览器后退/前进
  $(window).on('click', _checkAndModifyButton)    // 点击事件（切换视频）
  _checkAndModifyButton()

  // 监听按钮点击事件
  $('#' + mBtnId).click(function () {
    const action = $(this).data('action')
    if (action === 'create') {
      createVideoTask().then(v => {
        if (v) {
          setTimeout(modifyButton('cancel'), 1000)
          showToast('提交成功，任务稍后开始')
        } else {
          showToast('提交失败，任务已经创建')
        }
      })
    }
    if (action === 'cancel') {
      cancelVideoTask().then(v => {
        if (v) {
          setTimeout(modifyButton('create'), 1000)
          showToast('取消成功，好险！')
        } else {
          showToast('取消失败，任务已经完成或正在执行中')
        }
      })
    }
  })
}

// 正式开始
$(document).ready(function () {
  initButton() // 触发任务
})
