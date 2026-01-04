// ==UserScript==
// @name         文心一言去码工具
// @namespace    http://tampermonkey.net/
// @version      0.3.19
// @description  文心一言去除页面水印工具。后续将不再更新。
// @author       kj
// @match        https://yiyan.baidu.com/**
// @match        https://chat.openai.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yiyan.baidu.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462166/%E6%96%87%E5%BF%83%E4%B8%80%E8%A8%80%E5%8E%BB%E7%A0%81%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/462166/%E6%96%87%E5%BF%83%E4%B8%80%E8%A8%80%E5%8E%BB%E7%A0%81%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const isChatGPT = !!/.*?\.openai\.com.*/gi.exec(location.hostname);
  const checkImage = (url, minWidth, minHeight) => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.onload = function () {
        if (this.width >= minWidth && this.height >= minHeight) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
      img.onerror = function () {
        reject(false);
      }
      img.src = url;
    });
  }
  if (!isChatGPT) {
    const generateUUID = () => {
      let d = new Date().getTime();
      if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); // use high-precision timer if available
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    }
    const checkHit = dom => {
      // return Array.from(dom.shadowRoot?.children || []).filter(e => /\w{5,16}/gi.exec(e.innerText)).filter(e => !!e.style.transform && !!e.style.zIndex).length > 10;
      return /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/gi.exec(dom.id) && /pointer-events:\s*none\s*!important;\s*display:\s*block\s*!important/gi.exec(dom.getAttribute('style'));
    }
    let uuid = generateUUID();
    const hideIt = dom => {
      if (checkHit(dom)) {
        if (dom.id) {
          const styleId = `hide-${uuid}`;
          let styleEl = document.getElementById(styleId);
          if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.setAttribute('id', styleId);
            const escapedId = dom.id.replace(/^\d/, char => `\\${char.charCodeAt(0).toString(16)} `);
            styleEl.innerHTML = `${dom.tagName.toLowerCase()}#${escapedId}{transform: translateX(100000000px);overflow: hidden;}`;
            document.body.appendChild(styleEl);
          }
        } else {
          const styleId = `hide-${uuid}`;
          let styleEl = document.getElementById(styleId);
          if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.setAttribute('id', styleId);
            const style = dom.getAttribute('style');
            styleEl.innerHTML = `${dom.tagName.toLowerCase()}[style="${style}"]{transform: translateX(100000000px);overflow: hidden;}`;
            document.body.appendChild(styleEl);
          }
        }
      } else {
        dom.style.visibility = 'hidden';
        dom.style.opacity = '0';
      }
    }
    const observer = new MutationObserver((mutationsList, observer) => {
      mutationsList.forEach((mutation) => {
        if (mutation.addedNodes && mutation.addedNodes[0]) {
          if (checkHit(mutation.addedNodes[0])) {
            hideIt(mutation.addedNodes[0]);
          } else if (!!mutation.addedNodes[0].querySelector('.ant-modal-mask')) {
            hideIt(mutation.addedNodes[0]);
          }
        }
      });
    });
    observer.observe(document.body, {
      childList: true,
      attributes: true,
    });
    const doms = Array.from(document.querySelectorAll('div')).filter(e => checkHit(e));
    if (doms.length > 0) {
      doms[0].style.visibility = 'hidden';
      doms[0].style.opacity = '0';
    }
  }
  setInterval(() => {
    if (isChatGPT) {
      window.localStorage.removeItem(Object.keys(window.localStorage).find(i => i.startsWith('@@auth')))
    } else {
      document.body.parentElement.scrollTo(0,0)
      Array.from(document.querySelectorAll('.custom-html img:not(.dnh)')).filter(e => /x-bce-process=style\/wm_ai/gi.exec(e.src)).forEach(e => {
        let url = e.src.replace(/x-bce-process=style\/wm_ai/gi, '');
        checkImage(url, 250, 250)
          .then(result => {
            if (result) {
              e.src = e.src.replace(/x-bce-process=style\/wm_ai/gi, '');
            }
          })
          .catch(error => {
            e.classList.add('dnh')
          });
      });
    }
  }, 40);
})();
