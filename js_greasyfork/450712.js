// ==UserScript==
// @name         去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除6v bt之家广告
// @author       gepik
// @match        https://www.hao6v.cc/*
// @match        https://www.btbtt15.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hao6v.cc
// @require http://code.jquery.com/jquery-2.1.1.min.js
// @grant        none
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/450712/%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/450712/%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
  const $ = window.$;
  'use strict';
  let idList = ['HMcoupletDivleft','HMcoupletDivright','wrapper_left_bg llll','wrapper_right_bg']
  let classList = ['width imgs_1','wrapper_bg_c']

  function findADDom(){
      let adDomList = idList.map(id=>$('#'+id)).concat(classList.map(classList=>$('.'+classList.split(' ').join('.'))))
      adDomList = adDomList.filter(it=>it.length);
      return adDomList;
  }
  function removeAd() {
      let adDomList = findADDom();
      adDomList.forEach(it=>it.hide());
  }
  $(document).ready(removeAd)

  // 通过className获取目标元素
  function filterTargetDomByClassName(dom) {
      const domClassName = Array.from(dom.classList).join(' ');
      if(classList.includes(domClassName)) return dom;
      return null;

  }
  // 对目标元素进行隐藏
  function hideTargetDom(dom) {
      const hitDom =filterTargetDomByClassName(dom);
      if(hitDom) hitDom.hide();
  }
  // 广告的观察器
  function getAdObserver() {
      if (!window._adObserver) {
          const observer = new MutationObserver(mutations => {
              for (const mutation of mutations) {
                  if(mutation.addedNodes) {
                      for(let dom of mutation.addedNodes) {
                          if(idList.includes(dom.id)) {
                              $(dom).hide()
                          }
                          hideTargetDom(dom);
                      }
                  }
                  hideTargetDom(mutation.target);
              }
          })

          observer.start = function() {
              if (!this._active) {
                  this.observe(document.body, { childList: true,subtree:true });
                  this._active = true;
              }
          }
          observer.end = function() {
              if (this._active) {
                  this.disconnect();
              }
          }

          // window.addEventListener('urlchange', function() {
          //     observer[location.href.indexOf('/answer/') === -1 ? 'start' : 'end']();
          // })
          window._adObserver = observer;
      }
      return window._adObserver
  }
  const observer = getAdObserver()
  observer.start()
  // 去除6v点击广告
  if(location.host.includes('6v')) {
      window.sessionStorage.setItem('fbox', '1')
  }
  // bt宽屏显示-start
   // 宽屏
   GM_addStyle(".width {max-width:90% !important; width:90% !important;}");

   // 删除左右两侧无法点击的遮罩
   document.onreadystatechange = function () {
       if (document.readyState === "interactive") {
           document.querySelectorAll(".wrapper_bg_c.hidden-xs").forEach(el => el.remove());
       }
   }
     // bt宽屏显示-end
})();


