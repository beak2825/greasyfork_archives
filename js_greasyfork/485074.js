// ==UserScript==
// @name        百度网盘浏览记录
// @namespace   https://greasyfork.org
// @match       https://pan.baidu.com/*
// @exclude     https://pan.baidu.com/aipan/search
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_openInTab
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @run-at      document-body
// @homepageURL https://greasyfork.org/zh-CN/scripts/485074-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%B5%8F%E8%A7%88%E8%AE%B0%E5%BD%95
// @version     1.0.1
// @author      Gwen
// @license     MIT
// @description 2024/1/17 20:01:55
// @downloadURL https://update.greasyfork.org/scripts/485074/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%B5%8F%E8%A7%88%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/485074/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%B5%8F%E8%A7%88%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==
!(function() {
  'use strict';
  
  GM_addStyle('.bdh-button{z-index:10000;width:30px;height:30px;line-height:30px;text-align:center;color:#f5f5f5;border-radius:50%;position:absolute;left:calc(50vw - 15px);top:0;animation:colorChange 4s infinite linear;cursor:pointer}@keyframes colorChange{0%{background-color:red}25%{background-color:#00f}50%{background-color:green}75%{background-color:brown}to{background-color:red}}.bdh-panel{z-index:10000;background:white;position:fixed;left:20px;top:20px;width:390px;border:1px solid #000}.bdh-header{position:relative;height:30px;background:rgb(250, 250, 250);cursor:move}.bdh-close{position:absolute;right:10px;top:0;font-size:19px;cursor:pointer}.bdh-body{min-height:200px;max-height:500px;overflow-y:auto;overflow-x:hidden}.bdh-group{padding:10px;border-bottom:1px solid #d3d3d3}.bdh-group-header{color:gray;font-size:14px;margin-bottom:5px}.bdh-group-item{position:relative;width:100%;height:80px;padding:5px;box-sizing:border-box;border-bottom:1px solid #d3d3d3;cursor:pointer;display:flex}.bdh-group-item.picture{display:inline-block;border-bottom:none;width:80px}.bdh-group-item:nth-last-child(1){border-bottom:none}.bdh-group-item-image{width:70px;height:70px;object-fit:cover;display:inline-block;margin-right:5px}.bdh-group-item-image.video{width:90px}.bdh-group-item-video{position:absolute;left:5px;top:5px;width:90px;height:70px;background-color:rgba(0,0,0,.4)}.bdh-group-item-video-play{position:absolute;top:18px;left:35px;border-width:17px;border-style:solid;border-color:transparent transparent transparent #fff}.bdh-group-item-info{display:inline-block;max-width:280px;min-width:280px;height:70px;position:relative}.bdh-group-item-info.video{display:inline-block;max-width:260px;height:70px;position:relative}.bdh-group-item-info.picture{display:none}.bdh-group-item-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-break:break-all}.bdh-group-item-record{position:absolute;left:0;bottom:0;font-size:14px;color:gray}')
  
  const bd_history_store = {}
  
  function createElement(type, className) {
    let d = document.createElement(type)
    d.className = className
    return d;
  }
  
  function initPanel() {
    let panel = createElement('div', 'bdh-panel')
    let header = createElement('div', 'bdh-header')
    let close = createElement('div', 'bdh-close')
    close.innerText = '×'
    let body = createElement('div', 'bdh-body')
    header.appendChild(close)
    panel.appendChild(header)
    panel.appendChild(body)
    document.body.appendChild(panel)
    let lastX = GM_getValue('box_last_x', 100)
    let lastY = GM_getValue('box_last_y', 100)
    panel.style.left = lastX + 'px'
    panel.style.top = lastY + 'px'
    panel.style.display = 'none'
    header.addEventListener('mousedown', makeDraggableFunction(panel, false, null, () => { 
        GM_setValue('box_last_x', parseInt(panel.style.left))
        GM_setValue('box_last_y', parseInt(panel.style.top))
    }), false)
    
    let showButton = createElement('span', 'bdh-button')
    showButton.innerText = '史'
    document.body.appendChild(showButton)
    showButton.addEventListener('click', e => {
      showButton.style.display = 'none'
      panel.style.display = 'block'
      body.innerHTML = ''
      getHistory()
    })
    close.addEventListener('click', e => {
      panel.style.display = 'none'
      showButton.style.display = 'block'
    })
  }
  
   function makeDraggableFunction(elem, allowMoveOut, exec, callback) {
    let handleMouseDown = function (event) {
      let offsetX = parseInt(elem.style.left)
      let offsetY = parseInt(elem.style.top)
      let innerX  = event.clientX - offsetX
      let innerY  = event.clientY - offsetY
      if (!!exec) {
        exec()
      }
      document.onmousemove = function (event) {
        elem.style.left = event.clientX - innerX + 'px'
        elem.style.top = event.clientY - innerY + 'px'
        if (!allowMoveOut) {
          if (parseInt(elem.style.left) <= 0) {
            elem.style.left = '0px'
          }
          if (parseInt(elem.style.top) <= 0) {
            elem.style.top = '0px'
          }
          if (
            parseInt(elem.style.left) >=
            window.innerWidth - parseInt(elem.style.width)
          ) {
            elem.style.left =
              window.innerWidth - parseInt(elem.style.width) + 'px'
          }
          if (
            parseInt(elem.style.top) >=
            window.innerHeight - parseInt(elem.style.height)
          ) {
            elem.style.top = window.innerHeight - parseInt(elem.style.height) + 'px'
          }
        }
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
        if (!!callback) {
          callback()
        }
      }
    }
    return handleMouseDown
  }

  
  function getHistory() {
    let url = "https://pan.baidu.com/recent/list?"
    let params = {
        "app_id": "250528",
        "vip": "2",
        "version": "11.14.0",
        "queryfree": "0",
        "channel": "iPhone_14.4.2_iPhone11ProMax_chunlei_1099a_wifi",
        "apn_id": "1_0",
        "network_type": "wifi",
        "freeisp": "0",
        "activestatus": "0",
        "time": new Date().getTime(),
        "clienttype": "1",
        "bgstatus": "1",
        "need_detail": "1"
    }
    Object.keys(params).forEach(k => {
      console.log(k)
      url += k + '=' + params[k] + '&'
    })
    fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    }).then(res => {
      return res.json()
    }).then(res => {
      console.log('res: ', res)
      resolveHistory(res.list)
    })
  }
  
  async function download(fsid) {
    //get template variales
    let url = await fetch('https://pan.baidu.com/api/gettemplatevariable?clienttype=0&app_id=250528&web=1&fields=[%22sign1%22,%22sign2%22,%22sign3%22,%22timestamp%22]').then(res => {
      return res.json()
    }).then(a => {
      console.log(a)
      a = a.result
      let s = a.sign1, r = a.sign2 , c = a.sign3 , l = a.timestamp
      let u = new Function("return " + a.sign2)()
      let sign = btoa(u(c, s))
      let url = `https://pan.baidu.com/api/download?clienttype=0&app_id=250528&web=1
      &fidlist=[${fsid}]&type=dlink&vip=2&sign=${encodeURIComponent(sign)}&timestamp=${l}`
      return fetch(url).then(res => res.json()).then(res => {
        console.log('下载链接：' + res.dlink[0].dlink)
        GM_openInTab(res.dlink[0].dlink)
      })
    })
  }
  
  function resolveHistory(list) {
    let bdhBody = $('.bdh-body')
    for (let group of list) {
        console.log(group)
        let groupElem = $('<div class="bdh-group"></div>')
        groupElem.append(`<div class="bdh-group-header">
                ${formatTime(group.smtime)}&nbsp;&nbsp;${group.clienttype}查看
            </div>`)
        let count = 0
        for (let item of group.detail) {
            let tag = item.category==1 ? ' video' : item.category==3 ? ' picture' : ''
            let itemElem = $(`<div class="bdh-group-item${tag}">
                <img class="bdh-group-item-image${tag}" src="${item.thumbs?item.thumbs.url3:''}" alt="无图片">
                ${item.category==1?'<div class="bdh-group-item-video"><div class="bdh-group-item-video-play"></div></div>':''}
                <div class="bdh-group-item-info${tag}">
                    <div class="bdh-group-item-title" title="${item.server_filename}">${item.server_filename}</div>
                    ${(item.category==1&&group.view_time)?('<div class="bdh-group-item-record">播放至 '+formatViewTime(group.view_time[count])+'/'+formatViewTime(item.duration)+'</div>'):''}
                </div>
            </div>`)
            itemElem.attr('count', count)
            groupElem.append(itemElem)
            itemElem.click(function(e) {
              let url = ''
              let category = item.category
              if (category == 1) { //视频
                url = 'https://pan.baidu.com/pfile/video?path=' + encodeURIComponent(item.path)
                GM_openInTab(url)
              } else if (category == 2) { //音频
                console.log(this.getAttribute('count'))
                download(group.fsids[this.getAttribute('count')])
              } else if (category == 3) { //图片
                //url = item.thumbs.url3
                //GM_openInTab(url)
                download(group.fsids[this.getAttribute('count')])
              } else if (category == 4) { //文档
                url = 'https://pan.baidu.com/pfile/docview?path=' + encodeURIComponent(item.path)
                GM_openInTab(url)
              } else if (category == 5) { //转存
                
              }
              //GM_openInTab(url)
            })
            count++
        }
        bdhBody.append(groupElem)
    }
  }
  
  function formatTime(timestamp) {
    let now = new Date()
    let nowTime = now.getTime()
    nowTime /= 1000
    if (nowTime - timestamp < 60) {
      return '刚刚'
    } else if (nowTime - timestamp < 60 * 60) {
      return Math.floor((nowTime - timestamp) / 60) + '分钟前'
    } else if (nowTime - timestamp < 24 * 60 * 60) {
      return Math.floor((nowTime - timestamp) / 60 / 24) + '小时前'
    } else {
      let result = ''
      let date = new Date(timestamp * 1000)
      if (date.getFullYear() != now.getFullYear()) {
        result += date.getFullYear() + '-'
      }
      let M = date.getMonth() + 1
      let d = date.getDate()
      let h = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()
      let m = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
      let s = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
      result += M + '-' + d + ' ' + h + ':' + m + ':' + s
      return result
    }
  }
  
  function formatViewTime(time) {
    let h = Math.floor(time / 60 / 24)
    h = h < 10 ? '0' + h : h
    let m = Math.floor(time / 60 % 24)
    m = m < 10 ? '0' + m : m
    let s = Math.floor(time % 60)
    s = s < 10 ? '0' + s : s
    return h + ':' + m + ':' + s
  }

  initPanel()
  //getHistory()
})()