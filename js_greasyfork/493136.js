// ==UserScript==
// @name         【掘金】自动签到&自动抽奖
// @namespace    http://tampermonkey.net/
// @version      2.1.3
// @author       mgtx
// @description  基于iframe实现,不用担心接口被禁。
// @license      MIT
// @icon         https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png
// @match        https://juejin.cn/*
// @grant        none
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/493136/%E3%80%90%E6%8E%98%E9%87%91%E3%80%91%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/493136/%E3%80%90%E6%8E%98%E9%87%91%E3%80%91%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96.meta.js
// ==/UserScript==
(function () {
  "use strict";
  const NAMESPACE = "juejin-auto-check";
  const LOCAL_STORAGE_KEY = "tampermonkey-" + NAMESPACE;
  const LUCKY_PAGE_PATH = 'https://juejin.cn/user/center/lottery?from=lucky_lottery_menu_bar'
  const SIGN_PAGE_PATH = 'https://juejin.cn/user/center/signin'
  function getDate () {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function createIframe (id) {
    const iframe = document.createElement("iframe");
    iframe.id = id;
    iframe.style.position = "fixed";
    iframe.style.top = "120px";
    iframe.style.right = "24px";
    iframe.style.width = "375px";
    iframe.style.height = "850px";
    iframe.style.zIndex = "1000";
    iframe.src = SIGN_PAGE_PATH;
    return iframe;
  }
  function removeIframe (id) {
    const ele = document.getElementById(id);
    if (ele) {
      document.body.removeChild(ele);
    }
  }
  function signIn () {
    iframeFactory()
      .then((res) => {
        const { contentDocument, id } = res || {}
        const btn = contentDocument.querySelector(".signin.btn");
        let signFlag = false;
        if (btn) {
          btn.click();
          signFlag = true
          lucky(res)
        }
        const timer = setTimeout(() => {
          clear({ id, timer })
          if(signFlag){
            updateBtn()
            popup()
          }
        }, 4e3);
      })
  }
  function lucky (res) {
    const { contentDocument, id } = res
    contentDocument.location.href = LUCKY_PAGE_PATH
    res.onload = function () {
      const iframe = document.getElementById(id);
      const btn = iframe.contentDocument.getElementById("turntable-item-0");
      if (btn) {
        btn.click();
      }
    }
  }
  function updateBtn () {
    const btn = document.getElementById("turntable-item-0");
    if (btn) {
      btn.innerHTML = ''
      const btnDataVAttr = (getCustomDataAttributes(btn) || [])[0]

      const lotteryText = document.createElement('div')
      lotteryText.classList.add('lottery-text')
      lotteryText.textContent = '单抽'
      lotteryText.setAttribute(btnDataVAttr, '')
      btn.appendChild(lotteryText);

      const iconNumBox = document.createElement('div')
      iconNumBox.classList.add('icon-num-box')
      iconNumBox.setAttribute(btnDataVAttr, '')
      btn.appendChild(iconNumBox);

      const svg = createLotteryIconSvg()
      svg.setAttribute(btnDataVAttr, '')
      iconNumBox.appendChild(svg)

      const text = document.createElement('div')
      text.classList.add('text')
      text.setAttribute(btnDataVAttr, '')
      text.textContent = '200'
      iconNumBox.appendChild(text)
    }
  }
  function getCustomDataAttributes (element) {
    const prefix = 'data-v-';
    const attributes = element.attributes;
    const customAttributes = [];

    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      if (attr.name.startsWith(prefix)) {
        customAttributes.push(attr.name);
      }
    }

    return customAttributes;
  }
  function createLotteryIconSvg () {
    const svgNS = 'http://www.w3.org/2000/svg';

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '28');
    svg.setAttribute('height', '28');
    svg.setAttribute('viewBox', '0 0 28 28');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('class', 'lottery-icon');

    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('filter', 'url(#filter0_d_7401_115365)');

    const paths = [
      { d: 'M15.5001 7.63319L10.7001 8.30519L8.30008 13.3452L8.96008 15.0557L10.4001 16.3692L11.9001 17.0412L14.3001 18.7212L18.5001 20.4012L21.6878 17.7913C21.839 17.6676 21.9486 17.5004 22.0018 17.3124L23.4114 12.3317C23.5333 11.9011 23.5001 11.4413 23.3177 11.0327L20.9001 5.61719L15.5001 7.63319Z', fill: '#FFCF8B' },
      { d: 'M15.5001 7.63356L11.1201 8.69247L9.50009 6.96156L10.1001 3.60156L19.7001 3.93756L20.9001 5.61756L19.5201 6.65611L15.5001 7.63356Z', fill: '#FFE3C5' },
      { d: 'M6.20007 8.30556L10.1001 3.60156L9.50007 6.96156L11.1201 8.69247L9.44007 12.5107L6.20007 8.30556Z', fill: '#FF9A2E' },
      { d: 'M9.44009 12.5098L6.20009 8.30469L4.40009 15.3607L7.04009 16.328L9.44009 14.8007V12.5098Z', fill: '#FF9A2E' },
      { d: 'M7.04009 16.3281L4.40009 15.3608L6.32009 18.1099L8.00009 19.6371L18.5001 20.4008L9.44009 14.8008L7.04009 16.3281Z', fill: '#ED842C' }
    ];

    paths.forEach(pathData => {
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', pathData.d);
      path.setAttribute('fill', pathData.fill);
      g.appendChild(path);
    });

    svg.appendChild(g);

    return svg
  }
  function clear ({ id, timer } = {}) {
    clearTimeout(timer);
    removeIframe(id);
  }
  function createPopup () {
    const popupBox = document.createElement('div');

    popupBox.id = 'popupBox';
    popupBox.style.position = 'absolute';
    popupBox.style.top = '20px';
    popupBox.style.left = '50%';
    popupBox.style.transformX = 'translateX(-50%)';
    popupBox.style.padding = '20px';
    popupBox.style.backgroundColor = '#FF7294FA';
    popupBox.style.borderRadius = '5px';
    popupBox.style.width = '200px';
    popupBox.style.zIndex = '1001';
    popupBox.textContent = '已成功签到并抽奖'
    popupBox.style.textAlign = 'center'
    popupBox.style.color = '#fff'
    popupBox.style.fontSize = '24px'

    return popupBox
  }
  function popup() {
    const pop = createPopup()
    document.body.appendChild(pop)
    const timer = setTimeout(()=>{
      clearTimeout(timer);
      document.body.removeChild(pop)
    }, 3e3)
  }
  function iframeFactory () {
    const id = `iframe-${Math.ceil(Math.random() * 100)}`;
    const iframe = createIframe(id);
    document.body.prepend(iframe);
    return new Promise((resolve) => {
      iframe.onload = () => {
        const dialog = document.getElementById(id);
        if (dialog) {
          resolve(dialog)
        }
      }
    })
  }
  function main () {
    const latestDay = localStorage.getItem(LOCAL_STORAGE_KEY);
    const today = getDate();
    if (!latestDay || latestDay !== today) {
      try {
        signIn();
        localStorage.setItem(LOCAL_STORAGE_KEY, today);
      } catch (error) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }
  main();
})();