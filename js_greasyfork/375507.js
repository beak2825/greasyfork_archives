// ==UserScript==
// @name         移除csdn
// @version      0.9
// @description  自动从搜索结果中移除csdn, 目前支持 google, bing, baidu(回车或点击按钮触发). 有任何问题请提交反馈
// @author       zhylmzr
// @grant        none
// @run-at       document-start

// @include https://www.google.*/*
// @include https://*.bing.com/*
// @include https://www.baidu.com/*
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/375507/%E7%A7%BB%E9%99%A4csdn.user.js
// @updateURL https://update.greasyfork.org/scripts/375507/%E7%A7%BB%E9%99%A4csdn.meta.js
// ==/UserScript==

(function () {
  const host = location.host
  const params = parseUrlParams()

  if (~host.indexOf('google')) {
    removeFromGoogle()
  } else if (~host.indexOf('bing')) {
    removeFromBing()
  } else if (~host.indexOf('baidu')) {
    removeFromBaidu()
  }

  function removeFromBaidu() {
    let res = generateSearch('wd')
    if (res.redirect) {
      location.search = res.search
      return
    }

    window.onload = () => {
      let searchInput = document.getElementById('kw')
      let searchSubmit = document.getElementById('su')
      const extraKeyword = '-csdn'

      searchInput.value = searchInput.value.replace(extraKeyword, '').trim()
      searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          _modifyQuery()
        }
      }, true)
      searchSubmit.addEventListener('click', () => {
        _modifyQuery()
      }, true)

      function _modifyQuery() {
        searchInput.value += ` ${extraKeyword}`
        setTimeout(() => {
          searchInput.value = searchInput.value.replace(extraKeyword, '').trim()
        })
      }
    }
  }

  function removeFromBing() {
    // 判断是否使用国际版
    const cookies = parseCookies()
    const isInternaltional = 'ensearch' in params || cookies.ENSEARCH.includes('BENVER=1')

    // 国际版 "NOT csdn" 排除不了
    const extraKeyword = isInternaltional ? 'NOT blog.csdn.net' : 'NOT csdn'
    let res = generateSearch('q', extraKeyword)
    console.log(isInternaltional, extraKeyword, res, params)
    if (res.redirect) {
      location.search = res.search
      return
    }

    window.onload = () => {
      let searchInput = document.getElementById('sb_form_q')
      let searchForm = document.getElementById('sb_form')

      let originFunc = Element.prototype.appendChild
      Element.prototype.appendChild = function (n) {
        originFunc.apply(this, arguments)
        if (n.name === 'pq') {
          n.value += ` ${extraKeyword}`
        }
      }

      try {
        searchInput.value = searchInput.value.replace(extraKeyword, '').trim()
        searchForm.addEventListener('submit', () => {
          searchInput.value += ` ${extraKeyword}`
        }, true)
      } catch (e) {
        // DON'T HANDLER
      }
    }
  }

  function removeFromGoogle() {
    let res = generateSearch(['q', 'oq'])

    if (res.redirect) {
      location.search = res.search
      return
    }
    window.onload = () => {
      let searchInput = document.getElementsByClassName('gLFyf')[0]
      let searchForm = document.getElementsByClassName('tsf')[0]
      let searchBtn = document.getElementsByClassName('Tg7LZd')[0]

      const extraKeyword = '-csdn'
      searchInput.value = searchInput.value.replace(extraKeyword, '').trim()

      searchForm.addEventListener('submit', (e) => {
        e.stopPropagation
        _restore()
      }, true)
      searchBtn.addEventListener('click', () => {
        _restore()
      }, true)

      function _restore() {
        searchInput.value += ` ${extraKeyword}`
        let hiddenInput = document.querySelector('[name=oq]')
        if (hiddenInput && !~hiddenInput.value.indexOf(extraKeyword)) {
          hiddenInput.value += ` ${extraKeyword}`
        }
        let originFunc = window.s__we
        window.s__we = (a, b) => {
          originFunc(a, b)
          hiddenInput = document.querySelector('[name=oq]')
          if (!~hiddenInput.value.indexOf(extraKeyword)) {
            hiddenInput.value += ` ${extraKeyword}`
          }
        }
      }
    }
  }

  // 生成重定向url参数
  function generateSearch(keyNameArray = [''], extraParam = '-csdn') {
    if (!(keyNameArray instanceof Array)) {
      keyNameArray = [keyNameArray]
    }

    let flag = false
    for (const k of keyNameArray) {
      // 如果关键字存在 并且 关键值中不包含有额外参数值
      if (k in params && !params[k].includes(extraParam)) {
        params[k] += ` ${extraParam}`
        flag = true
      }
    }

    return {
      redirect: flag,
      search: Object.keys(params)
        .map(k => [k, encodeURIComponent(params[k])]) // 生成[k, encode(v)]式参数数组
        .map(e => e.join('=')) // 生成k=encode(v)式参数数组
        .join('&')
    }
  }

  // 解析url的参数
  function parseUrlParams() {
    const url = new URL(location.href)
    const params = url.searchParams
    const it = params.keys()

    let obj = {}
    let result = it.next()
    while (!result.done) {
      obj[result.value] = params.get(result.value)
      result = it.next()
    }
    return obj
  }

  // 解析cookies
  function parseCookies() {
    let obj = {}
    document.cookie.split(";").forEach(e => {
      let v = e.trim()
      let i = v.indexOf("=")
      let pair = [v.substring(0, i), v.substring(i + 1, v.length)]
      obj[pair[0]] = pair[1]
    })
    return obj
  }
})()