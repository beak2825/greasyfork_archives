// ==UserScript==
// @name         查找内容挑选
// @namespace    https://github.com/wang1212/user-script/blob/main/nodejs-docs-navigation
// @version      0.1.1
// @description  测试功能阶段，待完善
// @author       wang1212
// @match        http*://nodejs.org/*/*/docs/api/*
// @match        http*://nodejs.org/*/*/docs/api/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443242/%E6%9F%A5%E6%89%BE%E5%86%85%E5%AE%B9%E6%8C%91%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/443242/%E6%9F%A5%E6%89%BE%E5%86%85%E5%AE%B9%E6%8C%91%E9%80%89.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
 
  const log = console.log;
 
  /* ------------------------------- Init ----------------------------- */
 
  /* ---------------------- Parser Content Navigation ----------------------------- */
 
  function updateContentNavigation() {
    let navBarElem = document.querySelector('.wang1212_md-content-nav');
 
    // Remove existing
    navBarElem && navBarElem.remove();
 
    // navBar button
    navBarElem = document.createElement('div');
    navBarElem.classList.add('wang1212_md-content-nav');
    navBarElem.title = '文档内容导航';
 
    navBarElem.innerText = 'N';
 
    // Panel
    const navBarPanelElem = document.createElement('div');
    navBarPanelElem.classList.add('wang1212_md-content-nav_panel');
 
    navBarPanelElem.appendChild(document.querySelector('#toc').cloneNode(true));
 
    // --- CSS Style ---
    const styleElem = document.createElement('style');
    styleElem.type = 'text/css';
    styleElem.innerHTML = `
.wang1212_md-content-nav {
position: fixed;
right: 1rem;
bottom: 3.5rem;
z-index: 1999;
width: 2rem;
height: 2rem;
color: white;
font-size: 1.5rem;
line-height: 2rem;
text-align: center;
background-color: rgb(36, 41, 46);
cursor: pointer;
}
.wang1212_md-content-nav_panel {
position: absolute;
right: 0;
bottom: 2rem;
display: block;
width: 30rem;
height: 75vh;
padding: 0.5rem;
overflow: auto;
color: #ddd;
font-size: 1rem;
line-height: 1rem;
text-align: left;
background: white;
box-shadow: rgba(0, 0, 0, 0.25) 0 0 0.5rem 0;
}
.wang1212_md-content-nav_to-anchor {
line-height: 1.6 !important;
}
.wang1212_md-content-nav_to-anchor:hover {
color: rgb(0, 0, 0);
}
`;
 
    navBarElem.appendChild(navBarPanelElem);
    document.body.appendChild(navBarElem);
    document.head.appendChild(styleElem);
 
    // --- Event ---
    // Show/Hide
    navBarElem.addEventListener(
      'click',
      (e) => {
        if (e.target !== navBarElem) return;
 
        if (navBarPanelElem.style.display === 'none') {
          navBarPanelElem.style.display = 'block';
        } else {
          navBarPanelElem.style.display = 'none';
        }
      },
      false
    );
  }
 
  /* ------------------------------- To Top ----------------------------- */
 
  // to top button
  function updateGoToTopButton() {
    let toTopElem = document.querySelector('.wang1212_to-top');
 
    // Remove existing
    toTopElem && toTopElem.remove();
 
    // toTop button
    toTopElem = document.createElement('div');
    toTopElem.classList.add('wang1212_to-top');
    toTopElem.title = '回到顶部';
 
    toTopElem.innerText = '↑';
 
    // --- CSS Style ---
    const styleElem = document.createElement('style');
    styleElem.type = 'text/css';
    styleElem.innerHTML = `
.wang1212_to-top {
position: fixed;
right: 1rem;
bottom: 1rem;
z-index: 1999;
width: 2rem;
height: 2rem;
color: white;
font-size: 1.5rem;
line-height: 2rem;
text-align: center;
background-color: rgb(36, 41, 46);
cursor: pointer;
}
`;
 
    document.body.appendChild(toTopElem);
    document.head.appendChild(styleElem);
 
    // --- Event ---
    // fly to view
    toTopElem.addEventListener(
      'click',
      () => {
        document.body.scrollIntoView({ behavior: 'smooth' });
      },
      false
    );
  }
 
  /* ------------------------------- Load ----------------------------- */
 
  function load() {
    updateContentNavigation();
    updateGoToTopButton();
  }
 
  // Monitor page reload
  // document.addEventListener('pjax:end', load, false);
 
  //
  load();
})();
 
 