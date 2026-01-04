// ==UserScript==
// @name         B 站大表情
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  放大 B 站表情，并在光标指向表情时显示其名称
// @author       5ec1cff
// @license      AGPL
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        unsafeWindow
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/449654/B%20%E7%AB%99%E5%A4%A7%E8%A1%A8%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/449654/B%20%E7%AB%99%E5%A4%A7%E8%A1%A8%E6%83%85.meta.js
// ==/UserScript==

(function(window) {
    'use strict';
    const DEBUG_LOGGING = false;

    const selector = 'p.text>img[alt],span.text-con>img[alt],img.bili-rich-text-emoji,img.emoji-large,img.opus-text-rich-emoji,p#contents>img[alt]';
    const console = unsafeWindow.console;

    function logd(...args) {
      if (DEBUG_LOGGING) console.log(...args)
    }

    function loge(...args) {
      console.error(...args)
    }

    GM_addStyle(`${selector} { width: 64px !important; height: 64px !important;  }`);
    GM_addStyle(`.bili-rich-text__content.folded { max-height: unset !important; }`)
    const emoMap = {};
    window.emoMap = emoMap
    let observer = new MutationObserver(function(mutations, observe) {
        let s = new Set(mutations.map(x=>x.target))
        for (let root of s) {
            root.querySelectorAll(selector).forEach(e => {
                e.src = e.src.replace(/@\d+w_\d+h/, '@200w_200h');//'@100w_100h.webp');
                let id = emoMap[e.alt];
                e.style="width:100px !important;height:100px !important";
                if (id)
                    e.title = e.alt + ' ' + id;
                else
                    e.title = e.alt;
            })
        }
    })

    let oldAttachShadow = Element.prototype.attachShadow;
    window.__bilibigemo_oldAttachShadow = oldAttachShadow;
    Element.prototype.attachShadow = function(...args) {
        let ret = oldAttachShadow.apply(this, args);
        try {
            if (this.tagName == 'BILI-RICH-TEXT')
                observer.observe(ret, { 'childList': true, 'subtree': true });
        } catch (e) {
            console.trace(e);
        }
        return ret;
    }


    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { 'childList': true, 'subtree': true });
    })

    function scanreplies(replies) {
      let i = 0
      for (let reply of replies) {
        let emote = reply?.content?.emote;
        if (emote) {
          for (let emo in emote) {
            if (!(emo in emoMap)) i++;
            emoMap[emo] = emote[emo].package_id
          }
        }
        if (reply.replies) i+=scanreplies(reply.replies)
      }
      return i
    }

    let xhrp = unsafeWindow.XMLHttpRequest.prototype;
    let oldopen = xhrp.open;
    xhrp.open = function(method, url, ...args) {
      oldopen.call(this, method, url, ...args);
      logd(url)
      if (!this.__mark && url.startsWith('https://api.bilibili.com/x/v2/reply/')) {
        logd(url, 'matched')
        this.__mark = true;
        const xhr = this;
        this.addEventListener('readystatechange', (e) => {
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {
            try {
              const r = JSON.parse(xhr.responseText);
              let replies = r?.data?.replies;
              if (replies) {
                let i = scanreplies(replies);
                logd(url, 'scan added', i);
              }
            } catch (e) {
              loge(e);
            }
          }
        });
      }
    }

    let headp = unsafeWindow.HTMLHeadElement.prototype;
    let oldappendc = headp.appendChild;
    headp.appendChild = function (x, ...args) {
      if (x instanceof HTMLScriptElement) {
        if (x.src?.startsWith?.('https://api.bilibili.com/x/v2/reply')) {
          logd('script', x.src)
          let u = new URL(x.src)
          let cb = u.searchParams.get('callback')
          logd(cb, window[cb])
          let ocb = window[cb]
          window[cb] = (r) => {
            try {
              let replies = r?.data?.replies;
              if (replies) scanreplies(replies)
            } catch (e) {
              loge(e);
            }
            ocb(r)
          }
        }
      }
      oldappendc.call(this, x, ...args)
    }

    let origfetch = window.fetch;
    window.fetch = async function(url, ...args) {
        let r = await origfetch.apply(this, [url, ...args]);
        try {
            if (url?.indexOf?.('//api.bilibili.com/x/v2/reply/wbi/main') === 0) {
                let r2 = r.clone()
                let data = await r2.json();
                let replies = data?.data?.replies;
                if (replies) scanreplies(replies)
            }
        } catch (e) {
            console.trace('parse fetch', url, e);
        }
        return r;
    }
})(unsafeWindow);