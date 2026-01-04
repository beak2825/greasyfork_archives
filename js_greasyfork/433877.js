// ==UserScript==
// @name         个人常用的一些简单函数，勿安装
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.1
// @description  个人常用的一些简单函数，勿安装，详情查看代码中的函数说明
// @author       windeng
// @grant        none
// ==/UserScript==


// just sleep for some seconds
async function Sleep(sleepSecs) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, sleepSecs * 1000)
  })
}

// wait until something done
async function WaitUntil(conditionFunc, sleepSecs) {
  sleepSecs = sleepSecs || 1
  return new Promise((resolve, reject) => {
    if (conditionFunc()) resolve()
    let interval = setInterval(() => {
      if (conditionFunc()) {
        clearInterval(interval)
        resolve()
      }
    }, sleepSecs * 1000)
  })
}

// GM_xmlhttpRequest 简单封装
function Request(url, opt = {}) {
  Object.assign(opt, {
    url,
    timeout: 2000,
    responseType: 'json'
  })

  return new Promise((resolve, reject) => {
    /*
    for (let f of ['onerror', 'ontimeout'])
      opt[f] = reject
    */

    opt.onerror = opt.ontimeout = reject
    opt.onload = resolve

    // console.log('Request', opt)

    GM_xmlhttpRequest(opt)
  }).then(res => {
    if (res.status === 200) return Promise.resolve(res.response)
    else return Promise.reject(res)
  }, err => {
    return Promise.reject(err)
  })
}

// easy http(s) get
function Get(url, opt = {}) {
  Object.assign(opt, {
    method: 'GET'
  })
  return Request(url, opt)
}

// easy http(s) post
function Post(url, opt = {}) {
  Object.assign(opt, {
    method: 'POST'
  })
  return Request(url, opt)
}

// simple toast
function showToast(msg, doNotFade) {
  let style = `position: fixed; right: 10px; top: 80px; width: 300px; text-align: left; background-color: rgba(255, 255, 255, 0.9); z-index: 99; padding: 10px 20px; border-radius: 5px; color: #222; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2); font-weight: bold;`

  let span = document.createElement('span')
  span.setAttribute('style', style)
  span.innerText = msg
  document.body.appendChild(span)
  if (!doNotFade) {
    setTimeout(() => {
      document.body.removeChild(span)
    }, 5000)
  }
}

async function GetElementByText(startElem, selector, text, exist) {
  /*
  selector: 选择器
  text: 内容
  exist: 是否只要存在就ojbk
  */
  exist = exist || false
  let elemList = startElem.querySelectorAll(selector)
  for (let i = 0; i < elemList.length; ++i) {
    let elem = elemList[i]
    if (exist) {
      if (elem.innerText.search(text) !== -1) return elem
    } else {
      if (elem.innerText === text) return elem
    }
  }
}
