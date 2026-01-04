// ==UserScript==
// @name         6v去广告
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  去除6v bt之家 阿里云盘广告
// @author       gepik
// @match        *://www.hao6v.cc/*
// @match        *://www.hao6v.tv/*
// @match        *://www.6v520.net/*
// @match        https://www.btbtt15.com/*
// @match        *://www.6v520.com/*
// @match        https://www.aliyundrive.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hao6v.cc
// @require http://code.jquery.com/jquery-2.1.1.min.js
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/450709/6v%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/450709/6v%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
  const $ = window.$;
  'use strict';
  let idList = ['HMcoupletDivleft','HMcoupletDivright','wrapper_left_bg llll','wrapper_right_bg','HMRichBox','ccc123','mhWyDDleft','mhWyDDright']
  let classList = ['width imgs_1','wrapper_bg_c','share-list-banner--1E8Jr'];
  let styleKeyAttr = [['position','fixed']]

  function findADDom(){
      let adDomList = idList.map(id=>$('#'+id)).concat(classList.map(classList=>$('.'+classList.split(' ').join('.'))))
      adDomList = adDomList.filter(it=>it.length);
      // 隐藏#footer后面的div元素
      let afterFooterElements =  [...document.querySelectorAll('body > #footer ~ div')].map(it=>$(it));
      return [...adDomList,...afterFooterElements];
  }
  function removeAd() {
      let adDomList = findADDom();
      adDomList.forEach(it=>it.hide());
  }
  $(document).ready(removeAd)

  // 通过className获取目标元素
  function filterTargetDomByClassName(dom) {
      const domClassName = Array.from(dom?.classList || []).join(' ');
      if(classList.includes(domClassName)) {
        return dom;
      }
      if(dom.children?.length) {
            for(let child of dom.children) {
                const hitDom = filterTargetDomByClassName(child);
                if(hitDom) return hitDom;
            }
      }
      return null;

  }
  // 对目标元素进行隐藏
  function hideTargetDom(dom) {
      let hitDom =filterTargetDomByClassName(dom);
      if(hitDom) {
        if(!hitDom.hide) {
            hitDom = $(hitDom);
        }
        hitDom.hide();
      }
      hideBodyChildrenAd(dom)
  }
    function hideBodyChildrenAd(dom){
        let bodyChildren = Array.from(document.body.childNodes);
       if(dom?.style?.position === 'fixed' && bodyChildren.includes(dom)) {

        $(dom).hide()
    } else {
        removeBodyLink(dom,bodyChildren)
    }

    }
    function removeBodyLink(dom,bodyChildren){
if(dom.tagName==='A' && bodyChildren.includes(dom)) {
    console.log('处理后',dom)
    $(dom).hide()
}
    }
  // 广告的观察器
  function getAdObserver() {
      if (!window._adObserver) {
          const observer = new MutationObserver(mutations => {
              const footer = document.querySelector('#footer');
              for (const mutation of mutations) {
                  if(mutation.addedNodes) {
                      for(let dom of mutation.addedNodes) {
                          if(idList.includes(dom.id)) {
                              $(dom).hide()
                          } else if (
            dom.nodeType === 1 && // ELEMENT_NODE
            dom.tagName.toLowerCase() === 'div' &&
            footer.compareDocumentPosition(dom) & Node.DOCUMENT_POSITION_FOLLOWING
          ) {
            $(dom).hide();
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

          window._adObserver = observer;
      }
      return window._adObserver
  }
  const observer = getAdObserver()
  observer.start()


  if(location.host.includes('6v')) {
      window.sessionStorage.setItem('fbox', '1')
  }
})();


