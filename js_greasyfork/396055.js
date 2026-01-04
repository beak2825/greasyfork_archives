// ==UserScript==
// @name         auto update iconfont
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  自动更新iconfont
// @author       rrf
// @match        *://www.iconfont.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396055/auto%20update%20iconfont.user.js
// @updateURL https://update.greasyfork.org/scripts/396055/auto%20update%20iconfont.meta.js
// ==/UserScript==
function parseData(url) {
    console.log('parseData')
    let fileType = '.css'
    if (document.querySelector('.type-select .current').innerText === 'Symbol') {
        fileType = '.js'
    }
    if(!url.match(/^http(s)?/)) url = 'http:' + url
    const projectId = window.location.search.split('&').filter(item=>item.includes('projectId'))[0].split('=')[1]
    fetch('https://cloudapi.bytedance.net/faas/services/ttb4qu/invoke/hello', {
        method: 'POST',
        body: JSON.stringify({
            projectId,
            url,
            fileType
        })
    })
    .then(r=>r.json())
    .then(r=>{
        if(r.code == -1) {
            notify(r.message + '\n点击弹窗强制更新', 'warn', 0, ()=>{
                let token = window.prompt('请输入密码')
                if (token) {
                    uploadDir(url, projectId, token)
                }
            })
        } else {
            notify(r.message, 'success', 3000)
            copyIntoClipboard(r.data)
        }
    })
}

function uploadDir(url, projectId, token) {
    fetch('https://cloudapi.bytedance.net/faas/services/ttb4qu/invoke/update', {
        method: 'POST',
        body: JSON.stringify({
            projectId,
            url,
            token
        })
    })
    .then(r=>r.json())
    .then(r=>{
        if(r.code == -1) {
            notify(r.message, 'error')
        } else {
            notify('更新成功！', 'success', 3000)
            copyIntoClipboard(r.data)
        }
    })
}

function checkHistory(url) {
    url = 'http:' + url
    const projectId = window.location.search.split('&').filter(item=>item.includes('projectId'))[0].split('=')[1]
    fetch('https://cloudapi.bytedance.net/faas/services/ttb4qu/invoke/checkHistory', {
        method: 'POST',
        body: JSON.stringify({
            projectId
        })
    })
    .then(r=>r.json())
    .then(r=>{
        createHistoryPanel()
        createHistoryItem(['地址', '创建日期', '更新日期', '操作'], true)
        r.forEach(item => createHistoryItem(Object.values(item).concat([`<span class='action-btn' onclick='parseData("${item.url}")'>切换到此版本</span>`])))
    })
}

function copyIntoClipboard(text) {
    if (window.navigator.clipboard) {
        navigator.clipboard.writeText(text)
    } else {
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.setAttribute('value', text);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    }
}

function hijackOpen(callback) {
    if (XMLHttpRequest.prototype.ea_realOpen) return
    let xhr
    XMLHttpRequest.prototype.ea_realOpen = XMLHttpRequest.prototype.open;
    var newOpen = function(method, url) {
        if (/\/api\/project\/detail\.json/.test(url)) {
            xhr = this
            xhr.addEventListener('load', (e)=>{
                const response = JSON.parse(e.target.response)
                callback(response.data.font.css_file)
                // 还原
                XMLHttpRequest.prototype.open = XMLHttpRequest.prototype.ea_realOpen
                XMLHttpRequest.prototype.ea_realOpen = null
            });
        }
        this.ea_realOpen(...arguments);
    };
    XMLHttpRequest.prototype.open = newOpen;
}

function createBtn() {
    let wrap = document.createElement('div')
    let style = document.createElement('style')
    wrap.innerHTML = `
    <div>icon2cdn</div>
    <div>更新CDN</div>
    <div>查看历史版本</div>
    `
    wrap.className = 'ea-iconfont-update-wrap'
    style.innerText = `
    .ea-iconfont-update-wrap{
        width: 80px;
        height: 30px;
        border-radius: 4px;
        background: #3ff1cf;
        border: none;
        opacity: 0.5;
        position: fixed;
        right: 10px;
        top: 10px;
        overflow: hidden;
        transition: height 0.5s;
        z-index: 12482355;
    }
    .ea-iconfont-update-wrap:hover {
        opacity: 1;
        height: 92px;
    }
    .ea-iconfont-update-wrap>div {
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .ea-iconfont-update-wrap>div:not(:first-child) {
        border-top: 1px solid #ccc;
        cursor: pointer;
    }`
    wrap.children[1].addEventListener('click', ()=>handleClick(parseData))
    wrap.children[2].addEventListener('click', ()=>handleClick(checkHistory))
    document.body.append(wrap)
    document.body.append(style)
}

function handleClick(callback) {
    const btnList = document.getElementsByClassName('cover-btn');
    const url = document.getElementById('J_cdn_type_fontclass').innerText;
    if (btnList[0].innerText.match(/暂无代码/)) {
        hijackOpen(callback)
        btnList[0].click()
    } else if (btnList[1]) {
        hijackOpen(callback)
        btnList[1].click()
    } else {
        callback(url)
    }
}

function createHistoryPanel() {
    let wrap = document.createElement('div')
    let style = document.createElement('style')
    wrap.className = 'ea-iconfont-history-wrap'
    wrap.innerHTML = '<table></table>'
    style.innerText = `
    .ea-iconfont-history-wrap {
        padding: 12px;
        width: 600px;
        height: 80%;
        border-radius: 4px;
        background: #eee;
        border: none;
        position: fixed;
        right: calc(50% - 300px);
        top: 10%;
        overflow: auto;
        z-index: 12482350;
    }
    .ea-iconfont-history-wrap table {
        width: 100%;
        table-layout: fixed;
        word-break: break-all;
    }
    .ea-iconfont-history-wrap table th:last-child{
        width: 40px;
    }
    .ea-iconfont-history-wrap .action-btn{
        cursor: pointer;
        color: #3c8cff;
    }`
    let close = document.createElement('div')
    close.className = 'ea-iconfont ea-iconclosed'
    close.style = 'float: right'
    close.addEventListener('click', wrap.remove.bind(wrap))
    wrap.prepend(close)
    document.body.append(wrap)
    document.body.append(style)
}

function createHistoryItem(arr, isTitle) {
    let item = document.createElement('tr')
    //document.head.innerHTML += '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">'
    isTitle ?
    item.innerHTML = `
      <th>${arr[0]}</th>
      <th>${arr[1]}</th>
      <th>${arr[2]}</th>
      <th>${arr[3]}</th>` :
    item.innerHTML = `
      <td>${arr[0]}</td>
      <td>${validDate(arr[1])}</td>
      <td>${validDate(arr[2])}</td>
      <td>${arr[3]}</td>`
    item.className = 'ea-iconfont-history-item'
    document.querySelector('.ea-iconfont-history-wrap table').append(item)
}

function validDate(date) {
    date = new Date(date)
return date.getFullYear() + '-' +
    (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-' +
    date.getDate() + ' ' +
    date.getHours() + ':' +
    date.getMinutes() + ':' +
    date.getSeconds();
}

class Notify {
  constructor({ message, type, duration, onClick }) {
    const notify = document.createElement('div')
    this.notify = notify
    const txt = document.createTextNode(message)
    const iconWrap = document.createElement('div')
    const backgroundMap = {
        'warn': '#fcf6ed',
        'success': '#f2f9ec',
        'error': '#fcf0f0'
    }
    const colorMap = {
        'warn': '#dda450',
        'success': '#7ebf50',
        'error': '#e57470'
    }
    notify.style.cssText = `position: fixed;
    top: -30px;
    width: 300px;
    left: calc(50% - 150px);
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    transition:top 0.2s;
    z-index: 12482357;
    max-height: 100px;
    overflow-y: auto;
    white-space: pre-wrap;`
    notify.style.background = backgroundMap[type]
    notify.style.color = colorMap[type]
    notify.addEventListener('click', onClick)
    iconWrap.style.cssText = 'position: absolute; height: 30px; width: 30px; right: 0; top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center;'
    iconWrap.innerHTML = `<svg t="1574859050699" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6542" width="16" height="16" class="icon"><path d="M512 451.669333L813.696 149.952l60.352 60.352L572.330667 512l301.717333 301.696-60.352 60.352L512 572.330667 210.304 874.048l-60.352-60.352L451.669333 512 149.952 210.304l60.352-60.352L512 451.669333z" p-id="6543" fill="${colorMap[type]}"></path></svg>`
    iconWrap.addEventListener('click', e=>{e.stopPropagation();this.clear()})
    notify.appendChild(txt)
    notify.appendChild(iconWrap)
    document.body.appendChild(notify)
    setTimeout(()=>{
      notify.style.top = '30px'
    }, 0)
      if(duration) {
        setTimeout(()=>{
          this.clear()
        }, duration)
      }
  }

  clear() {
    if(!this.notify) return
    this.notify.style.top = '-30px'
    setTimeout(()=>{
      document.body.removeChild(this.notify)
      this.notify = null
    }, 200)
  }
}

function notify(message, type, duration = 0, onClick = ()=>{}) {
    return new Notify({
        message,
        type,
        duration,
        onClick
    })
}

function importFonts() {
    let link = document.createElement('link')
    link.href = '//sf16-eacdn-tos.pstatp.com/obj/eaoffice/iconfonts/1604313/font_1604313_0j4yev3ju1se.css'
    link.rel = "stylesheet"
    link.type = "text/css"
    setTimeout(()=>{document.head.append(link)}, 3000)
}

(function() {
    'use strict';
    importFonts()
    createBtn()
    window.parseData = parseData
})();