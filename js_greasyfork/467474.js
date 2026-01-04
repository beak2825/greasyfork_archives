// ==UserScript==
// @name         Bilibili - 防止视频被自动暂停及弹出登录窗口
// @namespace    https://bilibili.com/
// @version      1.3
// @description  让您在未登录的情况下看B站视频时不再被自动暂停视频及要求登录账号 | V1.3 针对Edge作兼容性调整
// @license      GPL-3.0
// @author       DD1969
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://space.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467474/Bilibili%20-%20%E9%98%B2%E6%AD%A2%E8%A7%86%E9%A2%91%E8%A2%AB%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E5%8F%8A%E5%BC%B9%E5%87%BA%E7%99%BB%E5%BD%95%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/467474/Bilibili%20-%20%E9%98%B2%E6%AD%A2%E8%A7%86%E9%A2%91%E8%A2%AB%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E5%8F%8A%E5%BC%B9%E5%87%BA%E7%99%BB%E5%BD%95%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  // no need to continue this script if user already logged in
  if (document.cookie.includes('DedeUserID')) return;

  // save origin fetch
  const originFetch = window.fetch;

  // in user space
  if (window.location.hostname === 'space.bilibili.com') {
    // add CSS to hide some elements
    const styleElement = document.createElement('style');
    styleElement.textContent = `.bili-mini-mask, .login-panel-popover, .login-tip { display: none !important; }`;
    document.head.appendChild(styleElement);

    // get fingerprint
    let fingerprint = window.__biliUserFp__.queryUserLog({});

    // modify requests heading to 'https://api.bilibili.com/x/space/wbi/arc/search'
    window.fetch = async function () {
      const requestURL = 'https:' + arguments[0];
      if (requestURL.includes('space/wbi/arc/search')) {
        if ((navigator.userAgent.includes('Firefox') || navigator.userAgent.includes('Edg')) && fingerprint[0] === '[]') fingerprint = await getValidFingerprint();
        const params = Object.fromEntries(new URL(requestURL).searchParams);
        const queryString = await getWbiQueryString(params, fingerprint);
        return originFetch(`https://api.bilibili.com/x/space/wbi/arc/search?${queryString}`);
      }

      return originFetch.apply(this, arguments);
    }
  }

  //  in home page or video page
  if (window.location.hostname === 'www.bilibili.com') {
    // prevent miniLogin.js from appending to document
    const originAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function (childElement) {
      return childElement.tagName === 'SCRIPT' && childElement.src.includes('miniLogin')
        ? null
        : originAppendChild.call(this, childElement);
    }

    // wait until the 'getMediaInfo' method appears
    await new Promise(resolve => {
      const timer = setInterval(() => {
        if (window.player && window.player.getMediaInfo) {
          clearInterval(timer);
          resolve();
        }
      }, 1000);
    });
  
    // modify the 'getMediaInfo' method
    const originGetMediaInfo = window.player.getMediaInfo;
    window.player.getMediaInfo = function () {
      const { absolutePlayTime, relativePlayTime, playUrl } = originGetMediaInfo();
      return { absolutePlayTime: 0, relativePlayTime, playUrl };
    }
  
    // 'isClickedRecently' will be 'true' shortly if user clicked somewhere on the page
    let isClickedRecently = false;
    document.body.addEventListener('click', () => {
      isClickedRecently = true;
      setTimeout(() => isClickedRecently = false, 500);
    });
  
    // prevent pausing video by scripts
    const originPause = window.player.pause;
    window.player.pause = function () {
      if (!isClickedRecently) return;
      return originPause.apply(this, arguments);
    }
  }

  // ref: https://socialsisteryi.github.io/bilibili-API-collect/docs/misc/sign/wbi.html
  async function getWbiQueryString(params, fingerprint) {
    // get origin key
    const { img_url, sub_url } = await originFetch('https://api.bilibili.com/x/web-interface/nav').then(res => res.json()).then(json => json.data.wbi_img);
    const imgKey = img_url.slice(img_url.lastIndexOf('/') + 1, img_url.lastIndexOf('.'));
    const subKey = sub_url.slice(sub_url.lastIndexOf('/') + 1, sub_url.lastIndexOf('.'));
    const originKey = imgKey + subKey;

    // get mixin key
    const mixinKeyEncryptTable = [
      46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
      33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
      61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
      36, 20, 34, 44, 52
    ];
    const mixinKey = mixinKeyEncryptTable.map(n => originKey[n]).join('').slice(0, 32);

    // modify params
    params.dm_img_list = fingerprint[0];
    params.dm_img_str = fingerprint[1];
    params.dm_cover_img_str = fingerprint[2];
    params.dm_img_inter = fingerprint[3];
    params.wts = Math.round(Date.now() / 1000);
    delete params.w_rid;
    
    // generate basic query string
    const query = Object
      .keys(params)
      .sort() // sort properties by key
      .map(key => {
        const value = params[key].toString().replace(/[!'()*]/g, ''); // remove characters !'()* in value
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      })
      .join('&');
    
    // calculate wbi sign
    const wbiSign = SparkMD5.hash(query + mixinKey);

    return query + '&w_rid=' + wbiSign;
  }

  // get valid fingerprint for Firefox
  async function getValidFingerprint() {
    const maskElement = document.createElement('div');
    maskElement.innerHTML = `
      <p style="font-size: 24px;">脚本提醒：请在画面中移动鼠标以通过校验，请勿点击鼠标左键</p>
      <p style="margin-top: 8px;">( From userscript: Please move the mouse in the screen to pass the verification, don't click the left mouse button )</p>
    `;
    maskElement.style = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999999;
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.8);
      color: #FFFFFF;
      cursor: pointer;
      transition: opacity 300ms;
    `;
    document.body.appendChild(maskElement);

    return await new Promise(resolve => {
      const timer = setInterval(() => {
        const fingerprint = window.__biliUserFp__.queryUserLog({});
        if (fingerprint[0] !== '[]') {
          maskElement.style.opacity = 0;
          setTimeout(() => maskElement.remove(), 300);
          clearInterval(timer);
          resolve(fingerprint);
        }
      }, 100);
    });
  }

})();