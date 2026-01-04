'use scrict';

// ==UserScript==
// @name         下载 B 站弹幕 CSV
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  下载 B 站弹幕为 CSV 方便分析查找
// @author       malei0311
// @match        https://www.bilibili.com/bangumi/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385744/%E4%B8%8B%E8%BD%BD%20B%20%E7%AB%99%E5%BC%B9%E5%B9%95%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/385744/%E4%B8%8B%E8%BD%BD%20B%20%E7%AB%99%E5%BC%B9%E5%B9%95%20CSV.meta.js
// ==/UserScript==

/**
 * 在支持 es6 的浏览器中使用
 */

(function () {
  function formatDate (date, format) {
    const o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'H+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    }
    let fmt = format || 'yyyy-MM-dd HH:mm:ss'
    if (/(y+)/.test(fmt)) { 
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }

  function parseXML (response = '') {
    try {
      response = response.replace(/[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]/g, '')
    } catch (e) {
      console.error('parse xml replace error', e)
      return
    }
    const xmlDoc = new window.DOMParser().parseFromString(response, 'text/xml')
    const danmuList = []
    const $d = xmlDoc.getElementsByTagName('d')
    for (let i = 0; i < $d.length; i++) {
      const $item = $d[i]
      const [stime, mode, size, color, date, sc, uid, dmid] = $item.getAttribute('p').split(',')
      const text = $item.textContent || $item.text || ''
      danmuList.push({
        stime, // 弹幕播放时间
        mode, // 弹幕模式 1..3 滚动弹幕 4底端弹幕 5顶端弹幕 6逆向弹幕 7精准定位 8高级弹幕 
        size, // 字号 12非常小,16特小,18小,25中,36大,45很大,64特别大
        color, // 弹幕颜色 10 进制
        date, // unix 时间戳
        sc, // 弹幕池 0普通池 1字幕池 2特殊池【目前特殊池为高级弹幕专用】
        uid, // 发送者 id，加密算法 hash crc32b
        dmid, // 弹幕在弹幕数据库中 row id
        text // 弹幕内容
      })
    }
    return danmuList
  }

  function loadXML (url, cb) {
    const xhr = new XMLHttpRequest()
    xhr.timeout = 10000
    xhr.addEventListener('load', () => {
      const ret = parseXML(xhr.response)
      if (ret) {
        cb (ret)
      }
    })
    xhr.addEventListener('error', () => {
      console.error('load xml error', xhr.status, xhr.statusText)
    })
    xhr.addEventListener('abort', () => {
      console.error('load xml abort', xhr.status, xhr.statusText)
    })
    xhr.addEventListener('timeout', () => {
      console.error('load xml timeout', xhr.status, xhr.statusText)
    })
    xhr.open('GET', url)
    xhr.withCredentials = true
    xhr.send()
  }

  function download (content, fileName, mimeType = 'text/csv;encoding:utf-8') {
    const a = document.createElement('a')
    content = `\uFEFF${content}`

    if (navigator.msSaveBlob) { // IE10
      navigator.msSaveBlob(new Blob([content], {
        type: mimeType
      }), fileName)
    } else if (URL && 'download' in a) {
      a.href = URL.createObjectURL(new Blob([content], {
        type: mimeType
      }))
      a.setAttribute('download', fileName)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      location.href = 'data:application/octet-stream,' + encodeURIComponent(content)
    }
  }

  function load (url, fileName) {
    loadXML(url, (danmuList) => {
      let writeHead = false
      let content = ''
      danmuList.forEach((item) => {
        if (!writeHead) {
          writeHead = true
          content += Object.keys(item).join(',') + '\n'
        }
        const str = Object.keys(item).reduce((ret, key) => {
          if (key === 'date') {
            ret.push(`"${formatDate(new Date(item[key] * 1000))}"`)
          } else if (key === 'text') {
            ret.push(`"${item[key].replace(/"/g, '""')}"`)
          } else {
            ret.push(`"${item[key]}"`)
          }
          return ret
        }, []).join(',')
        content += str + '\n'
      })
      download(content, fileName)
    })
  }

  function inject () {
    const {
      h1Title = window.$('h1[title]').text() || document.title,
      epInfo = {}
    } = window.__INITIAL_STATE__

    const oid = epInfo.cid
    if (!oid) {
      return
    }

    let injected = false
    let timer
    (function tryInject () {
      const $btn = window.$('.up-load')
      if (!injected && $btn.length) {
        injected = true
        clearTimeout(timer)
        const $clone = $btn.clone()
        $clone.html('<a class="u-link" style="cursor: pointer;">下载弹幕</a>').on('click', () => {
          load(`https://api.bilibili.com/x/v1/dm/list.so?oid=${oid}`, `弹幕----${h1Title}.csv`)
        })
        $btn.before($clone)
      }

      timer = setTimeout(tryInject, 3000)
    })()
  }

  inject()
})()
