// ==UserScript==
// @name         B 站复读机
// @namespace    bilibili-replayer
// @version      0.3
// @description  马冬什么？什么冬梅？马什么梅？
// @author       dms
// @match        https://www.bilibili.com/video/BV*
// @match        https://www.bilibili.com/bangumi/play/ep*
// @match        https://www.bilibili.com/medialist/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445107/B%20%E7%AB%99%E5%A4%8D%E8%AF%BB%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/445107/B%20%E7%AB%99%E5%A4%8D%E8%AF%BB%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const isNormalVide = /^(https?:\/\/(www\.)bilibili\.com\/video\/(?:BV|AV)\w+).*/i.test(window.location.href)
  const copyText = text => {
    const textArea = document.createElement('textarea')
    textArea.setAttribute('readonly', 'readonly')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
  const createButton = (text, className, parent)=>{
    const button = document.createElement('div')
    className.split(' ').forEach(c => button.classList.add(c) )
    button.innerText = text
    parent.appendChild(button)
    return button
  }
  const createToolbar = ()=>{
    const toolbarbox = document.createElement('div')
    toolbarbox.style = 'width: 100%; height: 2rem;'
    const container = document.body.querySelector('#playerWrap') || document.body.querySelector('#player_module')
    container.appendChild(toolbarbox)
    if(document.body.querySelector('#player_module')){ document.body.querySelector('#player_module').style.marginBottom = '2rem' }
    const toolbarShadow = toolbarbox.attachShadow({mode: 'closed'})
    const toolbarStyle = document.createElement('style')
    toolbarStyle.innerHTML = `
      #replayer-toolbar {
        width: 100%
        height: 2rem
        font-size: 1.2rem;
        line-height: 1.6rem;
        margin: .2rem 0;
      }
      #replayer-toolbar::after {
        content: " ";
        display: block;
        clear: both;
      }
      .tool-item {
        float: left;
        padding: 0 .5rem;
        border-radius: .2rem;
      }
      .tool-button {
        border: 1px solid rgba(0, 0, 0, .1);
        cursor: pointer;
      }
      .active-button {
        background-color: #00aeec;
        color: white;
      }
      .tool-right {
        float: right;
      }
      .tool-coffee {
        cursor: pointer;
      }
      .hide {
        display: none;
      }
    `
    const getLinkClass = isNormalVide ? '' : ' hide'
    toolbarShadow.appendChild(toolbarStyle)
    const toolbar = document.createElement('div')
    toolbar.id = 'replayer-toolbar'
    toolbarShadow.appendChild(toolbar)
    createButton('Start:', 'tool-item tool-text', toolbar)
    const pointA = createButton('Point A', 'tool-item tool-button', toolbar)
    const toA = createButton('To here', 'tool-item tool-button', toolbar)
    const linkA = createButton('Link', 'tool-item tool-button'+getLinkClass, toolbar)
    createButton('|', 'tool-item tool-text', toolbar)
    createButton('End:', 'tool-item tool-text', toolbar)
    const pointB = createButton('Point B', 'tool-item tool-button', toolbar)
    const toB = createButton('To here', 'tool-item tool-button', toolbar)
    const linkB = createButton('Link', 'tool-item tool-button'+getLinkClass, toolbar)
    createButton('|', 'tool-item tool-text', toolbar)
    const Start = createButton('Replay it', 'tool-item tool-button', toolbar)
    createButton('|', 'tool-item tool-text'+getLinkClass, toolbar)
    createButton('Now:', 'tool-item tool-text'+getLinkClass, toolbar)
    const linkNow = createButton('Link', 'tool-item tool-button'+getLinkClass, toolbar)
    const coffee = createButton('Coffee!', 'tool-item tool-text tool-right tool-coffee', toolbar)

    const video = document.body.querySelector('#bilibili-player video')
    const points = [0, video.duration-1]
    const pointButtons = [pointA, pointB]
    const setPoint = (i, val)=>{
      if(val && val.trim()){
        if(!/^(\d+h)?(\d+m)?\d+(\.\d+)?$/i.test(val)){
          alert('格式有误，请注意查看示例格式')
          return
        }
        if(typeof(val)==='string'){
          const hms = val.split(/h|m/g)
          const h = /\d+h/.test(val) ? +hms[0] : 0
          const m = /\d+m/.test(val) ? +hms[hms.length-2] : 0
          const s = +hms[hms.length-1]

          points[i] = h*3600+m*60+s
        }else{
          points[i] = val
        }
        pointButtons[i].classList.add('active-button')
        window.localStorage.setItem('Point_'+i, points[i])
        return
      }
      points[i] = i ? video.duration-1 : 0
      pointButtons[i].classList.remove('active-button')
      window.localStorage.removeItem('Point_'+i)
    }
    if(window.localStorage.getItem('Point_0')){
      pointA.classList.add('active-button')
      points[0] = window.localStorage.getItem('Point_0')
    }
    if(window.localStorage.getItem('Point_1')){
      pointB.classList.add('active-button')
      points[0] = window.localStorage.getItem('Point_1')
    }
    pointA.addEventListener('click', ()=>{
      const pointAInput = prompt('请输入一个时间（单位：秒），默认值是当前时间点。取消则清除此时间点，恢复为默认值：视频开头。\n输入值可以包含分钟，例如：三分十二秒写作 3m12\n输入值可以包含小时，例如：一小时三分十二秒写作 1h3m12', video.currentTime)
      setPoint(0, pointAInput)
    })
    pointB.addEventListener('click', ()=>{
      const pointBInput = prompt('请输入一个时间（单位：秒），默认值是当前时间点。取消则清除此时间点，恢复为默认值：视频结尾（前一秒）。\n输入值可以包含分钟，例如：三分十二秒写作 3m12\n输入值可以包含小时，例如：一小时三分十二秒写作 1h3m12', video.currentTime)
      setPoint(1, pointBInput)
    })
    let mainTimer = 0
    Start.addEventListener('click', ()=>{
      if(mainTimer){
        clearInterval(mainTimer)
        mainTimer = 0
        Start.classList.remove('active-button')
        return
      }
      Start.classList.add('active-button')
      mainTimer = setInterval(()=>{
        const A = points[0] <= points[1] ? points[0] : points[1] 
        const B = points[0] > points[1] ? points[0] : points[1] 
        if(video.currentTime>=B){
          video.currentTime = A
        }
      },200);
    })
    toA.addEventListener('click', ()=>{ video.currentTime = points[0] })
    toB.addEventListener('click', ()=>{ video.currentTime = points[1] })
    const getLink = t=>{
      const link = window.location.href.replace(/^(https?:\/\/(www\.)bilibili\.com\/video\/(?:BV|AV)\w+).*/i, '$1')+'?t='+t
      copyText(link)
      alert('带时间标记的链接已复制到剪切板。')
    }
    linkA.addEventListener('click', ()=>{ getLink(points[0]) })
    linkB.addEventListener('click', ()=>{ getLink(points[1]) })
    linkNow.addEventListener('click', ()=>{ getLink(video.currentTime) })
    coffee.addEventListener('click', ()=>{
      window.open('https://afdian.net/@daomishu', '_blank')
    })
  }
  window.addEventListener('load',()=>{
    const waitTimer = setInterval(()=>{
      if(document.body.querySelector('#bilibili-player video')){
        clearInterval(waitTimer)
        createToolbar()
      }
    }, 1000)
  })
})();