// ==UserScript==
// @id           RetractRedditSide
// @name         RetractRedditSide
// @namespace    jsn
// @version      0.2
// @description  Make Reddit's Sidebar Retractable (Vanilla JS)
// @match        https://*.reddit.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541161/RetractRedditSide.user.js
// @updateURL https://update.greasyfork.org/scripts/541161/RetractRedditSide.meta.js
// ==/UserScript==


//Use "q" to toggle, otherwise click.

(() => {
  'use strict';

  const leftIcon = '<i class="material-icons">chevron_left</i>';
  const rightIcon = '<i class="material-icons">chevron_right</i>';

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
  document.head.appendChild(link);

  const content = document.querySelector('div.content');
  const sidebar = document.querySelector('div.side');

  const toggle = document.createElement('div');
  toggle.innerHTML = rightIcon;
  Object.assign(toggle.style, {
    background: "#CEE3F8",
    color: "#212121",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "24px",
    width: "24px",
    fontSize: "16px",
    borderRadius: "100px",
    boxShadow: "0 3px 5px rgba(33,33,33,0.3)",
    position: "fixed",
    top: "50%",
    right: "12px",               // shifted away from scrollbar
    cursor: "pointer",
    zIndex: 9983,
    userSelect: 'none',
    transform: 'translateY(-50%)',
    opacity: '0.5',             // semi-transparent
    transition: 'opacity 0.3s ease',
    backdropFilter: 'blur(5px)'
  });

  toggle.addEventListener('mouseenter', () => toggle.style.opacity = '1');
  toggle.addEventListener('mouseleave', () => toggle.style.opacity = '0.5');

  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days*864e5);
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}; domain=.reddit.com; path=/`;
  }

  function getCookie(name) {
    return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1] || "";
  }

  function hideSidebar() {
    if (!sidebar || !content) return;
    sidebar.style.display = 'none';
    content.style.marginRight = '15px';
    toggle.innerHTML = leftIcon;
    setCookie('isRetracted', 'true', 30);
  }

  function showSidebar() {
    if (!sidebar || !content) return;
    sidebar.style.display = '';
    content.style.marginRight = '335px';
    toggle.innerHTML = rightIcon;
    setCookie('isRetracted', 'false', 30);
  }

  if (!location.href.includes('/submit') || location.href.includes('/submitted')) {
    getCookie('isRetracted') === 'true' ? hideSidebar() : showSidebar();
    document.body.appendChild(toggle);

    toggle.addEventListener('click', () => {
      toggle.innerHTML.trim() === rightIcon ? hideSidebar() : showSidebar();
    });

    document.body.addEventListener('keypress', e => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.key === 'q') toggle.click();   //toggle key here
    });
  }
})();