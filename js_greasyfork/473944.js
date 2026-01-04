// ==UserScript==
// @name         CSDN Copyman
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  Press ctrl and click to copy without login
// @author       blvlight
// @match        https://*.csdn.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473944/CSDN%20Copyman.user.js
// @updateURL https://update.greasyfork.org/scripts/473944/CSDN%20Copyman.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function useDomHighlight(root) {
    const highlightBlock = document.createElement('div')
    const s = highlightBlock.style;
    s.position = 'fixed';
    s.pointerEvents = 'none';
    s.background = 'rgba(0,0,200,.3)';
    document.body.appendChild(highlightBlock);
  
    function handleMouseOver(e) {
      e.stopPropagation();
      if (e.ctrlKey) {
        const cur = e.target;
        s.width = cur.offsetWidth + 'px';
        s.height = cur.offsetHeight + 'px';
        s.top = cur.offsetTop + 'px';
        s.left = cur.offsetLeft + 'px';
      } 
      else {
        s.width = 0;
        s.height = 0;
      }
    }
  
    function addEventListenerAll(root) {
      if (!root) return;
      root.addEventListener('mouseover', handleMouseOver);
      for (let el of [...root.querySelectorAll('*')]) {
        addEventListenerAll(el);
      }
    }
    addEventListenerAll(root);
    
    function removeEventListenerAll(root) {
      if (!root) return;
      root.removeEventListener('mouseover', handleMouseOver);
      for (let el of [...root.querySelectorAll('*')]) {
        removeEventListenerAll(el);
      }
    }
  
    return {
      handleMouseOver,
      addEventListenerAll,
      removeEventListenerAll
    }
  }
  
  function handleClick(e) {
    if (e.ctrlKey) {
      const text = e.target?.innerHTML
      .replace(/<.*?>/, '')
      .replace('&nbsp;', ' ')
      .replace('&lt;', '<')
      .replace('&rt;', '>');
      if (text) {
        console.log(`from CSDNcopyman - You can check your copy text in '[]':\n[\n${text}\n]\n----${new Date().toLocaleString()}`);
        navigator.clipboard.writeText(text).then(() => alert(`复制内容：\n${text}`));
      } else {
        console.log(`from CSDNcopyman - It seems like click on void.----${new Date().toLocaleString()}`)
      }
    }
  }

  window.addEventListener('mousemove', function () {
    const sb = document.querySelector('.imgViewDom');
    if (sb) {
      sb.innerHTML = '';
      sb.classList.remove('imgViewDom');
    }
  })


  useDomHighlight(document.querySelector('article'));
  window.addEventListener('click', handleClick);
})();
