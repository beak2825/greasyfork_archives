// ==UserScript==
// @name         Twitter Helper 推特助手
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  添加回到顶/底部按钮，去除私信抽屉，换成彩虹鸟。。。
// @author       乃木流架
// @match        *.twitter.com/*
// @match        *.x.com/*
// @match        *.pornhub.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEm0lEQVR4nO2YfUwbdRjHD2aAMbZsbkKgmwUixi0GMCSGYdtrC2V9oQUG1TnRohmMMGigBXmZcGzIKGN1DDak0gHOBHlbFUGMQTcW/9WpmW/olo1odBm9uxYFSin3GIga0QF3tLSa9JN8kqbpPc/3m/vl0hyCePHixYuX/xsEmpZFChU3SIHCZhEqKItQAaRQYSeEiltWgbwGEMR3pWutSfJ4Wkt+5YijAUW3uzI4yZVHkHz5HZIvh9W08OVThDBVviy4QPESyZf/TKCKT2kts/Dln5N8+S+AogGuCD8pkMXhPJmd4MmAjjhPRpGorJdAZV8TXNn8n98RHHH0mssgLiVw6cdLF6XcAqXSz5nwgCqDcI5khuBIwCl5knpaCy08iQh/Sgx/yZXcM8fLWOstMMmRfIgnHABnJDnSJny/6HGCI+3BOZKrqxfIiK8kn4+FZWbHWEjNo4lMw4M2eguhip371zwmqmKmSFXMzOJnIuPJWTNHvG/1AmXsSutFBP6pxbAJLNWhY4DtC6JbgCxhF91v1nq0XPBbsBZFytZciqsjpZY2BFa0IWiGLI0oplWggjW46qw2epKNW2ykOpLeCQAM8SVPBzjIFh9YTaJu6zRexG4BFXvFJxVZHvbJWnPItdQF2u/lPhaKMAHXho0Reh+g5Sn/Bbws+CauZjdb1Xuj/j6HKN59mfYc/f3Fa7ZOMwq/tDh/L3uyZrPDrPMBRtb7ghkLtJvLd+BmbfD45Mu7fmI8Q7dcvHKblXGBpbtQEnl0tv9Bh820AzzptCH0DqPgNuPuVvvQzh9nDexae8fDBsd1vwXqewQ8pa0/5AtmBdrCy6hxBP4rznWyTIwKTOujWNQ3Ph4PTv2h7XU2rUf2MuyDOyc8HZwaR2DhxiYgz7KZ/yuebYoQLXzlC9R3iEe1j2zHkfVytOJgV4jxGfCkORXp3Ygz5FSkmVjtT0OI0f2GtynhuCZ1D+IspUWpR9CGg9bgdiW40/QT6T84Hb4yXxqr1qRhWm1aXnZF+ugjLZlU8BtK2GjDDEooVadKnS6weAvDz2dSDxkywZ1mVKV9i7iK3KKsQUGJFtxlYqna8Uqe+AmXFcAQzFfwQsdEwLGPwB2+eKipDXE1mhRsl0DVORFQ8DFspCLVxZvIRpJ9+JwhKsc0519wBVxtVI5pTn2oLgTZaBaPVMGzjfnPHW7pizky8Jt/4Rg46568YYcmQ5eAuItipZ6VktV+fXPBYoBrThmeOzSvzmhg/MZjXQxLa9k9IsPwOWn33JmUHnDWxhSjuTztTNyGhn5HoEvoTWpqNiRfmjgpHaWqpNfAWaulY9AhMn45Isa2ufRs9whPY81Jl+7qk9626pIHZquTR6gy8RVwpfWiAVtvYqMa2SgGeCejWhNbPytPfp/SHBgFV1kjGrB3Cs529Skxp9610ubyfizYyD/dXpfYRRaKRqBA9AFjtUnvUnqh4fZb6Kmqqyj2AOIp+ri1EZ3cV6uaea+N1aKGu8fRN2e0gu75YwITlSt8DwoF/ZSG3+Oo4ndM6bgXbp/nNQ51ck/k9aEY7deQXrx48eIFcTe/Az8ZztnGloMvAAAAAElFTkSuQmCC
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/471345/Twitter%20Helper%20%E6%8E%A8%E7%89%B9%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/471345/Twitter%20Helper%20%E6%8E%A8%E7%89%B9%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

;(function () {
  ;('use strict')

  const top =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABIklEQVR4nO2W207DMAxAXb4k/jYekPYT3ARsIO44HfCX9jMYbaVoQilytyWkko/kt6g9p02jAjiO4ziO4zhZQJITjDKHCcvr90wrAqOcbsj3s4ApgCRnCfluSK6hZpDkfFD+Z/gGpisvdUZglPnAllmuJx1Sx4cdSC5SgoHkHY71AFSbQPySXBP5tm75nhojQpRLk7wt4q6sPMnVKHlDBBLf1y1vjVBt8pirNhj5YSd5U4Qs9x+xkid+3It88QjNIG+JiPK6e0S3bZ6yyNsi3raP6C78nFXeGjH6XiXlc0RglLbcCfH7exv8d2rBChIfYuSPIk/e8iaIP5F4BmPYjCgmn4rYRr4ntHy0fnU5t82fJ6C0K4fBNY7jOI7jOI4D/8kXHULAQQ3MPf4AAAAASUVORK5CYII='

  const bottom =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABNUlEQVR4nO2WWU4DMQxAU04S340/DkFZW/bVnoI4pf0NRgOa0kpTl8w0USr5Sfls8l6WUUNwHMdxHMdxnCoB4kMgeQ/HelB8cdVJRH4FkqMR8vwJJBpJPopGqE4iCbZrA/JXcsSqfDeKReiKfDdSI4CkWZtgOZEs2gVyygPKondtkiZpooj80jdRtpPQnp3/GwPeYbsbxM9FInSL/OBTLxGhpvzb+Cv7cy/5KUuEGvI7fW+/J/G404hi8jki7GvTZP3SRZTZqAhz5/khq/wyguRyUIQhH4nvs4uvRaBcJEXY8ndF5ZMjapTviCTnZoQlj3wbagBI5ps+h8Z/m3moCUA52yDaM/gm1AignG6VR7kONQMkJ0bAVdgHoD9iP+Q7AGVa7YNNikCZ/vsHjuM4juM4TkjhG1BTwHjA3CU3AAAAAElFTkSuQmCC'

  const pride = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36" viewBox="0 0 48 48"><linearGradient id="nEMlugcHH7Jiqpgfnu_pwa_FMISDkG9HnGX_gr1" x1="24.945" x2="24.945" y1="-32.787" y2="100.319" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f44f5a"></stop><stop offset=".443" stop-color="#ee3d4a"></stop><stop offset="1" stop-color="#e52030"></stop></linearGradient><path fill="url(#nEMlugcHH7Jiqpgfnu_pwa_FMISDkG9HnGX_gr1)" d="M46,11.06v0.1c-0.35,0.53-0.74,1.03-1.15,1.51c-0.9,1.06-1.94,2-3.07,2.8 c0.02,0.36,0.03,0.73,0.03,1.1c0,0.58-0.02,1.17-0.08,1.76c-0.14,1.89-0.51,3.8-1.13,5.67c-0.62,1.96-1.5,3.87-2.63,5.67 c-1.29,2.09-2.91,4.01-4.84,5.66C29.12,38.76,23.77,41,17.17,41c-4.89,0-9.44-1.42-13.28-3.85c0.68,0.08,1.37,0.12,2.07,0.12 c2.89,0,5.62-0.7,8.02-1.94c0.97-0.49,1.88-1.07,2.73-1.73c-2.97-0.06-5.58-1.61-7.09-3.93c-0.42-0.63-0.75-1.31-0.99-2.04 c0.53,0.1,1.07,0.16,1.63,0.16c0.79,0,1.55-0.11,2.28-0.31c-2.21-0.44-4.12-1.71-5.37-3.48c-0.99-1.4-1.58-3.1-1.58-4.94v-0.1 c1.17,0.64,2.51,1.03,3.93,1.07c-0.71-0.47-1.35-1.04-1.89-1.7c-1.23-1.48-1.96-3.37-1.96-5.44c0-0.07,0-0.15,0.01-0.22 c0.03-1.49,0.45-2.9,1.16-4.1c1.27,1.53,2.71,2.91,4.31,4.1c3.8,2.84,8.47,4.62,13.54,4.87c-0.15-0.63-0.23-1.29-0.23-1.96 c0-1.02,0.18-2,0.52-2.91C26.18,9.36,29.37,7,33.12,7c2.49,0,4.74,1.04,6.32,2.71c1.97-0.38,3.82-1.1,5.5-2.09 c-0.65,2.01-2.02,3.7-3.81,4.76C42.85,12.17,44.48,11.73,46,11.06z"></path><linearGradient id="nEMlugcHH7Jiqpgfnu_pwb_FMISDkG9HnGX_gr2" x1="8.415" x2="8.415" y1="3.772" y2="19.823" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f44f5a"></stop><stop offset=".443" stop-color="#ee3d4a"></stop><stop offset="1" stop-color="#e52030"></stop></linearGradient><path fill="url(#nEMlugcHH7Jiqpgfnu_pwb_FMISDkG9HnGX_gr2)" d="M11.15,12.67H5.68 c0.03-1.49,0.45-2.9,1.16-4.1C8.11,10.1,9.55,11.48,11.15,12.67z"></path><linearGradient id="nEMlugcHH7Jiqpgfnu_pwc_FMISDkG9HnGX_gr3" x1="35.49" x2="35.49" y1=".365" y2="22.562" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f44f5a"></stop><stop offset=".443" stop-color="#ee3d4a"></stop><stop offset="1" stop-color="#e52030"></stop></linearGradient><path fill="url(#nEMlugcHH7Jiqpgfnu_pwc_FMISDkG9HnGX_gr3)" d="M46,11.06v0.1 c-0.35,0.53-0.74,1.03-1.15,1.51H24.98C26.18,9.36,29.37,7,33.12,7c2.49,0,4.74,1.04,6.32,2.71c1.97-0.38,3.82-1.1,5.5-2.09 c-0.65,2.01-2.02,3.7-3.81,4.76C42.85,12.17,44.48,11.73,46,11.06z"></path><linearGradient id="nEMlugcHH7Jiqpgfnu_pwd_FMISDkG9HnGX_gr4" x1="25.26" x2="25.26" y1="5.589" y2="35.647" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fed100"></stop><stop offset=".033" stop-color="#fcca00"></stop><stop offset=".221" stop-color="#f3a400"></stop><stop offset=".408" stop-color="#ec8601"></stop><stop offset=".592" stop-color="#e77101"></stop><stop offset=".771" stop-color="#e46401"></stop><stop offset=".941" stop-color="#e36001"></stop></linearGradient><path fill="url(#nEMlugcHH7Jiqpgfnu_pwd_FMISDkG9HnGX_gr4)" d="M41.78,15.47 c0.02,0.36,0.03,0.73,0.03,1.1c0,0.58-0.02,1.17-0.08,1.76H7.63c-1.23-1.48-1.96-3.37-1.96-5.44c0-0.07,0-0.15,0.01-0.22h5.47 c3.8,2.84,8.47,4.62,13.54,4.87c-0.15-0.63-0.23-1.29-0.23-1.96c0-1.02,0.18-2,0.52-2.91h19.87 C43.95,13.73,42.91,14.67,41.78,15.47z"></path><linearGradient id="nEMlugcHH7Jiqpgfnu_pwe_FMISDkG9HnGX_gr5" x1="23.66" x2="23.66" y1="9.234" y2="43.015" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fede00"></stop><stop offset="1" stop-color="#ffd000"></stop></linearGradient><path fill="url(#nEMlugcHH7Jiqpgfnu_pwe_FMISDkG9HnGX_gr5)" d="M41.73,18.33 c-0.14,1.89-0.51,3.8-1.13,5.67H7.17c-0.99-1.4-1.58-3.1-1.58-4.94v-0.1c1.17,0.64,2.51,1.03,3.93,1.07 c-0.71-0.47-1.35-1.04-1.89-1.7H41.73z"></path><linearGradient id="nEMlugcHH7Jiqpgfnu_pwf_FMISDkG9HnGX_gr6" x1="23.885" x2="23.885" y1="6.725" y2="53.018" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#21ad64"></stop><stop offset="1" stop-color="#088242"></stop></linearGradient><path fill="url(#nEMlugcHH7Jiqpgfnu_pwf_FMISDkG9HnGX_gr6)" d="M40.6,24c-0.62,1.96-1.5,3.87-2.63,5.67 H9.62c-0.42-0.63-0.75-1.31-0.99-2.04c0.53,0.1,1.07,0.16,1.63,0.16c0.79,0,1.55-0.11,2.28-0.31c-2.21-0.44-4.12-1.71-5.37-3.48 H40.6z"></path><linearGradient id="nEMlugcHH7Jiqpgfnu_pwg_FMISDkG9HnGX_gr7" x1="23.795" x2="23.795" y1="12.16" y2="53.662" gradientUnits="userSpaceOnUse"><stop offset=".115" stop-color="#0d62ab"></stop><stop offset="1" stop-color="#007ad9"></stop></linearGradient><path fill="url(#nEMlugcHH7Jiqpgfnu_pwg_FMISDkG9HnGX_gr7)" d="M37.97,29.67 c-1.29,2.09-2.91,4.01-4.84,5.66H13.98c0.97-0.49,1.88-1.07,2.73-1.73c-2.97-0.06-5.58-1.61-7.09-3.93H37.97z"></path><linearGradient id="nEMlugcHH7Jiqpgfnu_pwh_FMISDkG9HnGX_gr8" x1="18.51" x2="18.51" y1="26.596" y2="58.652" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#9c55d4"></stop><stop offset=".002" stop-color="#9c55d4"></stop><stop offset=".003" stop-color="#9c55d4"></stop><stop offset=".111" stop-color="#9753d1"></stop><stop offset=".242" stop-color="#884ec8"></stop><stop offset=".383" stop-color="#7046ba"></stop><stop offset=".521" stop-color="#513ca7"></stop><stop offset=".672" stop-color="#3c359a"></stop><stop offset=".756" stop-color="#2e3192"></stop><stop offset="1" stop-color="#2e3192"></stop></linearGradient><path fill="url(#nEMlugcHH7Jiqpgfnu_pwh_FMISDkG9HnGX_gr8)" d="M33.13,35.33 C29.12,38.76,23.77,41,17.17,41c-4.89,0-9.44-1.42-13.28-3.85c0.68,0.08,1.37,0.12,2.07,0.12c2.89,0,5.62-0.7,8.02-1.94H33.13z"></path><path fill="none" d="M17.17,41c6.6,0,11.95-2.24,15.96-5.67c1.93-1.65,3.55-3.57,4.84-5.66c1.13-1.8,2.01-3.71,2.63-5.67 c0.62-1.87,0.99-3.78,1.13-5.67c0.06-0.59,0.08-1.18,0.08-1.76c0-0.37-0.01-0.74-0.03-1.1c1.13-0.8,2.17-1.74,3.07-2.8 c0.41-0.48,0.8-0.98,1.15-1.51c0.04-0.05,0.07-0.09,0.1-0.14c-0.03,0.01-0.07,0.03-0.1,0.04c-1.52,0.67-3.15,1.11-4.87,1.32 c1.79-1.06,3.16-2.75,3.81-4.76c-1.68,0.99-3.53,1.71-5.5,2.09C37.86,8.04,35.61,7,33.12,7c-3.75,0-6.94,2.36-8.14,5.67 c-0.34,0.91-0.52,1.89-0.52,2.91c0,0.67,0.08,1.33,0.23,1.96c-5.07-0.25-9.74-2.03-13.54-4.87c-1.6-1.19-3.04-2.57-4.31-4.1 c-0.71,1.2-1.13,2.61-1.16,4.1c-0.01,0.07-0.01,0.15-0.01,0.22c0,2.07,0.73,3.96,1.96,5.44c0.54,0.66,1.18,1.23,1.89,1.7 c-1.42-0.04-2.76-0.43-3.93-1.07c0,0.03,0,0.07,0,0.1c0,1.84,0.59,3.54,1.58,4.94c1.25,1.77,3.16,3.04,5.37,3.48 c-0.73,0.2-1.49,0.31-2.28,0.31c-0.56,0-1.1-0.06-1.63-0.16c0.24,0.73,0.57,1.41,0.99,2.04c1.51,2.32,4.12,3.87,7.09,3.93 c-0.85,0.66-1.76,1.24-2.73,1.73c-2.4,1.24-5.13,1.94-8.02,1.94c-0.7,0-1.39-0.04-2.07-0.12C7.73,39.58,12.28,41,17.17,41"></path></svg>`

  const name = 'Twitter Helper'
  const logPrefix = ['%c' + name, `background:#1d9bf0;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 0.5em`]
  function log(...args) {
    console.log(...logPrefix, ...args)
  }

  function dmRemove(dm) {
    log('dmRemove...')

    dm.remove()

    log('🟩DMDrawer is removed.')
  }

  function addRainbow(Twitter) {
    // log("changing icon...")
    // document.head.querySelector("link[rel='mask-icon']").href = 'https://i.jpg.dog/d9de0a2fbb6c4d43abffebf83ae17edb.png'
    // document.head.querySelector("link[rel='mask-icon']").removeAttribute('color')

    log('addRainbow...')
    let svgDiv = document.createElement('div')
    svgDiv.innerHTML = pride
    svgDiv.id = 'nogi-rainbow'
    let parent = Twitter.firstChild
    // 删除所有子元素
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild)
    }
    parent.appendChild(svgDiv)

    log('🟩Rainbow bird is added.')
  }

  function addScrollButton() {
    log('addScrollButton...')

    let text = `<div id="nogi-scroll" style="position: fixed;bottom: 60px;right: 44px;z-index: 999;">
      <div class='nogi-line' id='top' >
        <img class='nogi-icon' src="${top}">
      </div>
      <div class='nogi-line' id='bottom' >
        <img class='nogi-icon' src="${bottom}">
      </div>
    </div>`

    let style = document.createElement('style')
    style.innerHTML = `
    #nogi-scroll {
        display: flex;
        background: transparent;
        border-radius: 26px;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    #top {
        display: none;
    }
    #bottom {
        display: block;
    }
    .nogi-line {
        border: 1px solid #1d9bf0;
        border-radius:50%;
        margin: 5px;
        background: white;
    }
    .nogi-line:hover {
        background: #d2ecfd;
    }
    .nogi-icon {
        position: relative;
        border-radius:50%;
        padding: 5px 5px 0px 5px;
        width: 30px;
        height: 30px;
        cursor: pointer;
    }
    `

    let el = document.createElement('div')
    el.innerHTML = text

    document.head.append(style)
    document.body.append(el)

    let topButton = document.getElementById('top')
    let bottomButton = document.getElementById('bottom')

    topButton.onclick = function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }

    bottomButton.onclick = function () {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      })
    }

    log('🟩Scroll button is added.')
  }

  function watchScroll() {
    log('watchScroll...')

    // 获取元素
    var topArrow = document.getElementById('top')
    // 页面滚动事件处理程序
    function handleScroll() {
      // log("handleScroll...");

      // 获取页面滚动的高度
      var currentHeight = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      // log(currentHeight);
      // log(topArrow);
      // 页面滚动超过666px就显示
      if (currentHeight > 666 && topArrow != null) {
        topArrow.style.display = 'block'
      } else if (topArrow != null) {
        topArrow.style.display = 'none'
      }
    }
    // 注册滚动事件处理程序
    window.addEventListener('scroll', handleScroll)
  }

  log('🔲Twitter Helper userscript is running...')

  // 每隔0.5秒执行一次
  let dd = setInterval(() => {
    log("🟦Rainbow bird & DMDrawer's Interval is running...")

    // 更换蓝鸟图标
    // let Twitter = document.querySelector("a[aria-label='Twitter']");
    // fuck Mask
    let Twitter = document.querySelector("a[aria-label='X']")
    let nogiRainbow = document.querySelector('#nogi-rainbow')
    if (Twitter && !nogiRainbow) {
      addRainbow(Twitter)
    }

    // 去除私信抽屉
    let dm = document.querySelector("div[data-testid='DMDrawer']")
    if (dm) {
      dmRemove(dm)
    }

    // 添加回到顶部和回到底部按钮
    let nogiScroll = document.querySelector('#nogi-scroll')
    if (nogiScroll == null) {
      addScrollButton()
      watchScroll()
    }
  }, 500)

  window.onload = () => {
    log('window.onload...')

    if (/pornhub/.test(window.location.href)) {
      clearInterval(dd)
      log("✅Rainbow bird & DMDrawer's Interval is cleared.")
      log("👅Pornhub detected.")
      let imgs = document.querySelectorAll('.phimage')
      let as = document.querySelectorAll('.phimage > a')
      let us = document.querySelectorAll('.usernameBadgesWrapper > a')
      let bar = document.querySelector('.networkBarWrapper')
      imgs.forEach((img) => {
        img.style.border = 'solid 1px white'
      })
      as.forEach((a) => {
        a.target = '_blank'
      })
      us.forEach((u) => {
        u.target = '_blank'
      })
      bar.style.display = 'none'
    } else {
      setTimeout(() => {
        clearInterval(dd)
        log("✅Rainbow bird & DMDrawer's Interval is cleared.")
      }, 10000)
    }
  }

  // Your code here...
})()
