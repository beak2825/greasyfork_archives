// ==UserScript==
// @name         LeetCode Focus Mode
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  just focus!
// @author       litt1e-p
// @homepage     https://github.com/litt1e-p/TampermonkeyScripts/tree/master/leetcode-focus-mode
// @match        https://leetcode-cn.com/problemset/*
// @match        https://leetcode-cn.com/problems/*
// @match        https://leetcode-cn.com/contest/*/problems/*
// @match        https://leetcode.com/problemset/*
// @match        https://leetcode.com/problems/*
// @match        https://leetcode.com/contest/*/problems/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/415163/LeetCode%20Focus%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/415163/LeetCode%20Focus%20Mode.meta.js
// ==/UserScript==
(function(){
    function insertStyle() {
        const style = document.createElement('style');
        style.innerHTML = `
        .lc-nav-func-btn {
            width: 54px;
            height: 32px;
            line-height: 20px;
            background: #fff;
            border: 1px solid #ddd;
            color: #666;
            font-size: 16px;
            z-index: 999999;
            position: absolute;
            right: 132px;
            top: 5px;
            user-select: none;
            border-radius: 4px;
            padding: 0;
        }
        .lc-focus-full {
            width: 96% !important;
        }
        `
        document.body.appendChild(style);
    }
    function insertBtn() {
      var el = document.createElement('button');
      el.setAttribute('class', 'lc-nav-func-btn');
      el.addEventListener('click', btnEvent)
      document.body.appendChild(el);
    }
    function toggleBtn(active = true) {
      var el = document.querySelector('.lc-nav-func-btn');
      if (!el) return;
      el.innerText = active ? 'hide' : 'show';
    }
    function findNav() {
        let rs;
        const divs = [...document.querySelectorAll('div')];
        for(let i = 0, l = divs.length; i < l; i++) {
            const e = divs[i];
            const m = Object.assign({}, e.dataset);         
            if (m.hasOwnProperty('isLoading') && m.hasOwnProperty('status')) {
                rs = e;
                break;
            }
        }
        return rs;
    }
    function els () {
      var usNav = '#navbar-root';
      var cat = '.category-group-base';
      var sid = '.blog-sidebar';
      var cnNav = '#noj-navbar';
      var flo = '.floating-layer-container';
      var els = [usNav, cnNav, cat, sid, flo];
      var rs = [];
      for (var i = 0, l = els.length; i < l; i++) {
        const el = document.querySelector(els[i]);
        if (el) rs.push(el);
      }
      const nav2 = findNav();
      return nav2 ? rs.concat([nav2]) : rs;
    }
    function toggleEls(show = true) {
      var ls = els();
      for (let i = 0, l = ls.length; i < l; i++) {
        ls[i].style.display = (show ? 'block' : 'none');
      }
    }
    function toggleFullPage(show = true) {
        const el = document.querySelector('.blog-main');
        if (!el) return;
        if (show) {
            el.classList.remove('lc-focus-full')
        } else {
            el.classList.add('lc-focus-full')
        }
    }
    function btnEvent(e) {
      var el = e.target;
      var s = el.innerText === 'show';
      toggleState(s);
      syncState(s);
    }
    function toggleState(s) {
      setTimeout(() => {
        toggleBtn(s);
        toggleEls(s);
        toggleFullPage(s);
      }, 20);
    }
    function syncState(show = false) {
      window.localStorage.setItem('lc-focus-show#', show ? 1 : 0)
    }
    function savedState() {
      return window.localStorage.getItem('lc-focus-show#')
    }
    function initState() {
      let s = savedState();
      if (s === null) return;
      window.onload = function(){
          toggleState(+s)
      };
    }
    function main() {
      insertStyle();
      insertBtn();
      toggleBtn();
      initState();
    }
    main();
})();