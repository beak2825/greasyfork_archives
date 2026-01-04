// ==UserScript==
// @name         键盘翻页
// @name:en      Keyboard Page Up/Down
// @name:en-US   Keyboard Page Up/Down
// @description          使用键盘按键快速点击页面上的上一页/下一页(上一页: PgUp ← D P Ctrl+Shift+Space; 下一页: PgDn → F N Ctrl+Space)。脚本也支持其他网站，但需要用户修改此脚本，将上下页按键的选择器添加到脚本指定位置。
// @description:en       Use keyboard key to quickly click the privious or next button on the page. (privious: PgUp ← D P Ctrl+Shift+Space; next: PgDn → F N Ctrl+Space). You can modify this script to support other pages.
// @description:en-US    Use keyboard key to quickly click the privious or next button on the page. (privious: PgUp ← D P Ctrl+Shift+Space; next: PgDn → F N Ctrl+Space). You can modify this script to support other pages.
// @namespace    https://greasyfork.org/zh-CN/scripts/419483
// @version      0.3.0
// @author       oajsdfk
// @match        https://adnmb3.com/*
// @match        https://yande.re/*
// @match        https://tieba.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419483/%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/419483/%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.addEventListener('keyup', function(e){
    let key;
    switch(e.keyCode){
      case 32: // Space
        if(e.ctrlKey && !e.metaKey && !e.altKey) key = e.shiftKey ? 'prev' : 'next';
        else return;
        break;
      case 37: // ←
      case 68: // D
      case 80: // P
      case 33: // PgUp
        key = 'prev';
        break;
      case 39: // →
      case 70: // F
      case 78: // N
      case 34: // PgDn
        key = 'next';
        break;
      default: return;
    }

    // ignore input
    let ae = document.activeElement;
    const it = ['input', 'select', 'button', 'textarea'];
    if (ae && it.indexOf(ae.tagName.toLowerCase()) !== -1) return;

    const selectors = {
       /// 'url regex': { prev: 'previous selector', next: 'next selector' } // directly
       /// 'url regex': { cur: 'current selector' } // by sibling
       /// 'url regex': { cur: 'current selector', prev: 'previous selector', next: 'next selector' } // by sibling's child

      'https://adnmb[0-9]?\.com/.*': {prev: '#h-content > div.uk-container > ul > li:nth-child(1) > a', next: '#h-content > div.uk-container > ul > li:nth-last-child(2) > a'},
      'https://yande\.re/post/popular.*': {prev: '#post-popular > h3 > a:nth-child(1)', next: '#post-popular > h3 > a:nth-child(2)'},
      'https://yande\.re/.*': {prev: 'a.previous_page', next: 'a.next_page'},
      'https://tieba\.baidu\.com/*': {cur: 'span.tP'},

      ///  可选项： 取消下面的注释，并把 match 行移动到顶部
      ///  Option: uncomment those lines and move the match lines to the top
      //
      // @match        https://*.google.com/*
      // @match        https://konachan.com/*
      // @match        https://*.iwara.tv/*
      // @match        https://*.javlibrary.com/*
      // @match        https://*.javbus.one/*
      // @match        https://*.javbus.com/*
      // @match        https://*.reimu.net/*
      //'https://.*.google\.com/.*': {prev: 'pnprev', next: 'pnnext'},
      //'https://konachan.com/.*': {prev: 'a.previous_page', next: 'a.next_page'},
      //'https://.*\.iwara\.tv/.*': {prev: '.pager-previous > a', next: '.pager-next > a'},
      //'https://(.*\.)?javlibrary\.com/.*': {prev: 'a.page.prev', next: 'a.page.next'},
      //'https://(.*\.)?javbus[0-9]*\.[^/]*/.*': {prev: '#pre', next: '#next'},
      //'https://(.*\.)?reimu\.net/.*': {cur: 'span.current'}
    };

    let u = window.location.href;
    let k = Object.keys(selectors).find(k => u.match(k));
    if (!k) return;
    let sel = selectors[k];

    //if (ae && sel.ignore_id && sel.ignore_id.find(i => ae === document.getElementById(i))) return;
    //if (ae && sel.ignore && [...document.querySelectorAll(sel.ignore)].find(i => i.contains(ae))) return;

    if (sel.cur) {
      let cur = document.querySelector(sel.cur);
      if (cur) {
        let a = (key==='prev') ? cur.previousElementSibling : cur.nextElementSibling;
        let s = sel[key];
        if (s) a = a.querySelector(s);
        if (a) a.click();
      }
      return;
    }

    let a = document.querySelector(sel[key]);
    if (a) a.click();
  });
})();