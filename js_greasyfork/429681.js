// ==UserScript==
// @name         包图网音频下载试听
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  包图网音频、配音、音效快速下载和在线试听
// @author       glk
// @include      https://ibaotu.com/sucai/*
// @include      https://ibaotu.com/yinxiao/*
// @match        https://codepen.io/colinhorn/details/KvgbRO
// @icon         https://www.google.com/s2/favicons?domain=codepen.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429681/%E5%8C%85%E5%9B%BE%E7%BD%91%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%E8%AF%95%E5%90%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/429681/%E5%8C%85%E5%9B%BE%E7%BD%91%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%E8%AF%95%E5%90%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STYLE = `
    #niuniu {
      position: fixed;
      top: 20%;
      left: 0px;
      z-index: 99999;
    }
    
    #niuniu i {
      display: block;
      width: 40px;
      height: 40px;
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: -6px 0px;
      cursor: pointer;
      background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M514.048 163.84c-75.776 0-151.552 4.096-227.328 10.24-61.44 4.096-108.544 51.2-112.64 110.592-6.144 77.824-10.24 155.648-10.24 229.376 0 73.728 4.096 149.504 10.24 223.232 6.144 59.392 53.248 106.496 112.64 112.64 73.728 6.144 149.504 10.24 225.28 10.24l2.048-696.32z' fill='%23464B61'/%3E%3Cpath d='M512 860.16c75.776 0 151.552-4.096 227.328-10.24 59.392-6.144 106.496-53.248 112.64-112.64 6.144-73.728 10.24-149.504 10.24-223.232 0-75.776-4.096-153.6-10.24-229.376-6.144-59.392-53.248-106.496-112.64-110.592-75.776-6.144-151.552-10.24-225.28-10.24L512 860.16z' fill='%23D8D8D8'/%3E%3Cpath d='M512 163.84l75.776-36.864c30.72-14.336 67.584-2.048 81.92 26.624 4.096 8.192 6.144 18.432 6.144 28.672v661.504c0 34.816-26.624 61.44-61.44 61.44-10.24 0-18.432-2.048-26.624-6.144L512 860.16V163.84z' fill='%235A617F'/%3E%3Cpath d='M636.928 495.616l-69.632-59.392c-10.24-6.144-22.528-4.096-30.72 4.096-2.048 4.096-4.096 8.192-4.096 12.288v116.736c0 12.288 8.192 20.48 20.48 20.48 4.096 0 10.24-2.048 12.288-4.096l69.632-59.392c8.192-8.192 10.24-20.48 2.048-28.672 2.048 0 0 0 0-2.048z' fill='%2343AECD'/%3E%3Cpath d='M552.96 512c0-12.288-8.192-20.48-20.48-20.48H389.12c-12.288 0-20.48 8.192-20.48 20.48s8.192 20.48 20.48 20.48h143.36c12.288 0 20.48-8.192 20.48-20.48z' fill='%2343AECD'/%3E%3C/svg%3E");
    }

    #niuniu:hover .audio_resource {
      transform: translate3d(0, 0, 0);
    }

    .audio_resource {
      position: absolute;
      height: 500px;
      width: 450px;
      overflow: auto;
      left: 30px;
      padding: 10px 0;
      top: 0px;
      z-index: 99999;
      background: #282828;
      color: #fff;
      border-radius: 15px;
      transform: translate3d(-120%, 0, 0);
      transition: 0.3s ease-out;
      background: #d27494;  /* fallback for old browsers */
      background: -webkit-linear-gradient(to top,  #5f9ba4, #8787a5, #d27494);  /* Chrome 10-25, Safari 5.1-6 */
      background: linear-gradient(to top,  #5f9ba4, #8787a5, #d27494); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

    }

    /*滚动条样式*/
    .audio_resource::-webkit-scrollbar{
        width: 5px;
        height: 14px;
        background-color: #f5f5f5;
    }

    /*定义滚动条的轨道，内阴影及圆角*/
    .audio_resource::-webkit-scrollbar-track{
        // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        // border-radius: 20px;
        // background-color: #8188ab;
    }

    /*定义滑块，内阴影及圆角*/
    .audio_resource::-webkit-scrollbar-thumb{
        height: 20px;
        border-radius: 20px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background: #bdc3c7;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to top, #7198c0, #bdc3c7);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to top, #7198c0, #bdc3c7); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }

    /*
    .audio_resource li {
      display: flex;
      justify-content: space-between;
      padding: 5px 10px;
    }
    */

    .audio_resource li {
      display: flex;
      justify-content: space-between;
      padding: 5px 10px;
      align-items: center;
      grid-template-columns: auto 40px 35px;
    }

    .audio_resource li:hover {
      background: #817d9f;
    }

   .audio_resource li span:nth-of-type(1) {
      width: 60%;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      padding-right: 10px;
    }

    .audio_resource li span:nth-of-type(2).playing {
      background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M425.1 648.5c-11.6 0-21-9.5-21-21v-231c0-11.6 9.4-21 21-21 11.5 0 21 9.4 21 21v231c0 11.5-9.4 21-21 21zm168 0c-11.6 0-21-9.5-21-21v-231c0-11.6 9.4-21 21-21 11.5 0 21 9.4 21 21v231c0 11.5-9.4 21-21 21z' fill='%23ffffff'/%3E%3Cpath d='M512 113c220 0 399 179 399 399S732 911 512 911 113 732 113 512s179-399 399-399m0-42C268.4 71 71 268.4 71 512s197.4 441 441 441 441-197.4 441-441S755.6 71 512 71z' fill='%23ffffff'/%3E%3C/svg%3E");
    }

    .audio_resource li span:nth-of-type(2) {
      background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M512 113c220 0 399 179 399 399S732 911 512 911 113 732 113 512s179-399 399-399m0-42C268.4 71 71 268.4 71 512s197.4 441 441 441 441-197.4 441-441S755.6 71 512 71z' fill='%23ffffff'/%3E%3Cpath d='M440.3 697.6c-29.9 0-54.3-24.3-54.3-54.3V380.6c0-29.9 24.4-54.3 54.3-54.3 9.4 0 18.7 2.5 27 7.3L694.9 465c17 9.8 27.1 27.4 27.1 47s-10.1 37.2-27.1 47L467.4 690.3c-8.4 4.8-17.7 7.3-27.1 7.3zm0-329.2c-5.9 0-12.3 4.7-12.3 12.3v262.7c0 10.3 10.9 14.9 18.4 10.6l227.5-131.4c5.5-3.2 6.1-8.4 6.1-10.6s-.6-7.4-6.1-10.6L446.4 370c-2-1.1-4-1.6-6.1-1.6z' fill='%23ffffff'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-size: 30px 30px;
      width: 30px;
      height: 30px;
      padding-right: 10px;
      cursor: pointer;
    }

    .audio_resource li span:nth-of-type(3) {
      cursor: pointer;
      color: #fff;
      background: #c08a8a;
      border-radius: 3px;
      font-size: 13px;
      padding: 4px 18px;
  }
    }

    .audio_resource li span:nth-of-type(2):hover {
      color: deeppink;
    }
  `

  window.downloadFile = (src = "") => {
    let link = document.createElement('a');
    link.style.display = 'none'
    link.href = src
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link);
  }

  window.playAudio = (idx) => {
    let curAudio = null
    if (window.audioArr) {
      curAudio = window.audioArr[idx]
      let isPaused = curAudio.paused
      if (isPaused) curAudio.play()
      else curAudio.pause()
    }
  }

  window.createDomByMap = (map = []) => {
    let audio_resource_ul = document.createElement('ul')
    let niuniu = document.createElement('div')
    niuniu.innerHTML = `
      <i></i>
    `
    niuniu.id = 'niuniu'
    audio_resource_ul.classList.add('audio_resource')
    map.forEach((i, idx) => {
      audio_resource_ul.innerHTML += `<li>
            <span title="${i.des}">${i.des}</span>
            <span onclick="playAudio('${idx}');"></span>
            <span onclick="downloadFile('${i.src}');">下载</span>
          </li>`
    })
    window.audio_resource_ul = audio_resource_ul
    niuniu.append(audio_resource_ul)
    document.body.append(niuniu)
  }

  window.addStyle = (styStr = "") => {
    let _style = document.createElement('style')
    _style.innerHTML = styStr
    document.getElementsByTagName('head')[0].appendChild(_style)
  }

  window.bindEvent = (arr) => {
    let niuniu = document.getElementById('niuniu')
    let audio_resource_ul = document.getElementsByClassName('audio_resource')[0]
    arr.forEach((i, idx) => {
      let cur_li = window.audio_resource_ul.getElementsByTagName('li')[idx]
      i.addEventListener('play', () => {
        console.log('播放')
        cur_li.children[1].classList.add('playing')
      }, false)
      i.addEventListener('pause', () => {
        console.log('暂停')
        cur_li.children[1].classList.remove('playing')
      }, false)
      i.addEventListener('ended', () => {
        console.log('播放结束')
        cur_li.children[1].classList.remove('playing')
      }, false)
    })

    // niuniu.addEventListener('click', () => {
    //   if (window.audio_resource_ul.style.display !== 'none') {
    //     window.audio_resource_ul.style.display = 'none'
    //   } else window.audio_resource_ul.style.display = 'blcok'
    // })

    // niuniu.addEventListener('mouseleave', () => {
    // 	console.log('离开 Niuniu')
    // })
  }

  window.addEventListener("load", function () {
    window.audioArr = Array.from(document.getElementsByTagName('audio'))
    let RESOURCE = audioArr.map(i => {
      let firstA = null
      let grandfa = i.parentNode.parentNode
      if (grandfa) {
        firstA = grandfa.getElementsByTagName('a')[0] || {}
      }
      return {
        src: i.src || null,
        des: firstA.textContent
      }
    })
    addStyle(STYLE)
    createDomByMap(RESOURCE)
    bindEvent(window.audioArr)
  })

})();