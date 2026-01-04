// ==UserScript==
// @name         Poe.com 美化
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  用来美化 poe.com
// @author       poeticalcode
// @match        https://poe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poe.com
// @grant        GM_addStyle
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/463519/Poecom%20%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/463519/Poecom%20%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict';
  GM_addStyle(`
        aside{
          min-width: unset !important;
        }
        section{
          max-width: unset !important;
          width: unset !important;
        }
        .Message_botMessageBubble__CPGMI{
          background-color: transparent;
        }
        .ChatPageMainFooter_footer__Hm4Rt{
          padding: 8px 18px;
        }
        .ChatMessageInputView_growWrap__mX_pX:after, .ChatMessageInputView_growWrap__mX_pX>.ChatMessageInputView_textInput__Aervw{
          border-radius:10px;
        }
    `);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.7.0/build/styles/default.min.css';
    document.head.appendChild(link);
    link.onload = () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.7.0/build/highlight.min.js';
      document.body.appendChild(script);
      script.onload = () => {
        const highlightCode = () => {
          document.querySelectorAll('pre code').forEach((el) => {
            !el.classList.contains('hljs') && hljs.highlightElement(el);
          });
        }
        highlightCode();
        let flag = false;
        let clearId = null;
        document.querySelector(".InfiniteScroll_scrollContainerReverse__3F2Dd").addEventListener('scroll', () => {
          clearTimeout(clearId)
          clearId = setTimeout(() => {
            highlightCode()
          }, 500);
        });

        let btn = document.createElement("button")
        btn.innerText = "折叠";
        btn.addEventListener("click", () => {
          flag = !flag
          let aside = document.querySelector(".PageWithSidebarLayout_leftSidebar__Y6XQo")
          aside.style.display = flag ? "none" : "unset"
        })
        let header = document.querySelector(".PageWithSidebarNavbar_navbar__LpjAK")
        header.firstChild.before(btn);
      }
    }
})();