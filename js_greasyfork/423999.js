// ==UserScript==
// @name         直播商品监控脚本
// @namespace    zboard
// @version      0.2.8
// @description  直播商品监控脚本，需配合快鸟后台使用
// @author       Vizards Swift
// @match        https://*/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/423999/%E7%9B%B4%E6%92%AD%E5%95%86%E5%93%81%E7%9B%91%E6%8E%A7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/423999/%E7%9B%B4%E6%92%AD%E5%95%86%E5%93%81%E7%9B%91%E6%8E%A7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

const refreshInterval = 1000 * 60 * 10
const openTabInterval = 1000 * 7
const waitingPageLoadTime = 1000 * 20

function replaceFavIcon () {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://ipic.vizards.cc/c7rp3.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
}

// 解析 URL 商品 ID
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

// 跨 Tab 通信模块
function GM_onMessage(label, callback) {
  GM_addValueChangeListener(label, function() {
    callback.apply(undefined, arguments[2]);
  });
}
function GM_sendMessage(label) {
  GM_setValue(label, Array.from(arguments).slice(1));
}

// 页面顶部展示状态
const setStatus = (status) => {
    let insertElement = document.createElement("div")
    if (!document.getElementById('buttonStatus')) {
      insertElement.id = 'buttonStatus'
    } else {
      insertElement = document.getElementById('buttonStatus')
    }
    insertElement.style.height = '50px'
    insertElement.style.textAlign = 'center'
    insertElement.style.fontSize = '26px'
    insertElement.style.backgroundColor = 'yellow'
    insertElement.innerText = status
    const body = document.querySelector('body')
    body.parentNode.insertBefore(insertElement, body)
}

const addLog = (newLine) => {
    let insertElement = document.createElement("pre")
    let clearButton = document.createElement('div')
    if (!document.getElementById('logContainer')) {
      insertElement.id = 'logContainer'
      insertElement.style.height = '500px'
      insertElement.style.width = '100%'
      insertElement.style.position = 'absolute'
      insertElement.style.zIndex = 1000
      insertElement.style.right = '0px'
      insertElement.style.bottom = '0px'
      insertElement.style.color = 'white'
      insertElement.style.fontSize = '12px'
      insertElement.style.backgroundColor = 'black'
      insertElement.style.padding = '20px'
    } else {
      insertElement = document.getElementById('logContainer')
    }
    if (!document.getElementById('clearLogButton')) {
        clearButton.id = 'clearLogButton'
        clearButton.innerText = '清空日志'
        clearButton.onclick = () => { document.querySelector('#logContainer').innerText = '正在等待其他 Tab 页回传的内容, 所有 Tab 每分钟自动更新并回传状态' }
        clearButton.style.position = 'absolute'
        clearButton.style.backgroundColor = 'blue'
        clearButton.style.padding = '5px 20px'
        clearButton.style.fontSize = '12px'
        clearButton.style.zIndex = 1000
        clearButton.style.right = '20px'
        clearButton.style.bottom = '20px'
        clearButton.style.color = 'white'
        clearButton.style.cursor = 'pointer'
    } else {
      clearButton = document.getElementById('clearLogButton')
    }
    insertElement.innerText = insertElement.innerText + `\n${newLine}`
    const body = document.querySelector('body')
    body.parentNode.insertBefore(insertElement, body)
    body.parentNode.insertBefore(clearButton, body)
    document.getElementById('logContainer').scrollTo(0, 9999999999999999999999)
}


(function() {
    'use strict';
    if (window.location.hostname.includes('kuainiao')) {
      const isBeta = window.location.hostname.includes('-beta')
      unsafeWindow.update_live_status = async (end) => {
        const res = await fetch(`https://commerce${isBeta ? '-beta' : ''}.codefuture.top/1.0/public/liveNews/getAll`)
        const goodsNewsList = (await res.json()).data.slice(0, end)
        const goodsUrls = goodsNewsList.map(goodsNews => goodsNews.goodsUrl)
        for (let i = 0; i < goodsUrls.length; i++) {
          setTimeout(() => GM_openInTab(goodsUrls[i]), i * openTabInterval)
        }
        addLog('正在等待其他 Tab 页回传的内容, 所有 Tab 每分钟自动更新并回传状态')
        GM_onMessage('_.unique.name.greetings', function(src, message) {
            goodsNewsList.map(goodsNews => {
              if (goodsNews.goodsUrl.includes(message)) {
                  fetch(`https://commerce${isBeta ? '-beta' : ''}.codefuture.top/management/v2/liveNews/update`, {
                    method: 'POST',
                    body: JSON.stringify({
                        id: goodsNews.id,
                        liveStatus: src,
                    }),
                    headers: {
                      'content-type': 'application/json',
                    },
                    credentials: "include"
                })
                  .then(res => res.json())
                  .catch(error => addLog(`${goodsNews.content.split('\n')[0]} 更新状态出错：${error}`))
                  .then(response => addLog(`
状态已更新并上传到服务器：
商品标题：${goodsNews.content.split('\n')[0]}
商品淘口令：${goodsNews.content.split('\n')[1]}
商品链接：${goodsNews.goodsUrl}
对应线报id：${goodsNews.id}
时间：${new Date()}
状态：${src}
`));
              }
            })
         });
      }
    } else {
      if (window.location.href.includes('tmall') || window.location.href.includes('taobao') || window.location.href.includes('tb')) {
          const timeout = setTimeout(() => {
              const countdown = document.querySelector('.tm-countdown')
              const tbAction = document.querySelector('.tb-action')
              const soldOut = document.querySelector('.sold-out') || document.querySelector('.sold-out-info') || document.querySelector('.tm-change-left')
              const canBuy = tbAction && tbAction.style.display !== 'none'

              if ((unsafeWindow.sufei && unsafeWindow.sufei.queue && unsafeWindow.sufei.queue.length > 0) || document.querySelector('.sufei-dialog') || document.querySelector('.sufei-tb-dialog') || document.querySelector('.baxia-dialog') || document.querySelector('.baxia-tb-dialog')) {
                  clearTimeout(timeout)
                  setStatus('检测到验证码，不会更新服务端状态')
                  replaceFavIcon()
                  document.title = '🚨🚨🚨🚨🚨出现了验证码，请手动刷新页面'
                  setInterval(() => window.location.reload(), refreshInterval)
              } else if (countdown && !canBuy) {
                  setStatus('未开售')
                  GM_sendMessage('_.unique.name.greetings', 'PREVIEW', getQueryVariable('id'));
                  setInterval(() => window.location.reload(), refreshInterval)
              } else if (soldOut) {
                  setStatus('已售空')
                  GM_sendMessage('_.unique.name.greetings', 'SOLD_OUT', getQueryVariable('id'));
                  setInterval(() => window.location.reload(), refreshInterval)
              } else if (canBuy) {
                  setStatus('已开售')
                  GM_sendMessage('_.unique.name.greetings', 'ON_SALE', getQueryVariable('id'));
                  setInterval(() => window.location.reload(), refreshInterval)
              }
              clearTimeout(timeout)
          }, waitingPageLoadTime)
       }
    }
})();