// ==UserScript==
// @name        Fix PleaseFixThisSite.com
// @namespace   pleasefixthissite.com.danq.me
// @match       https://pleasefixthissite.com/*
// @grant       none
// @version     1.0
// @author      Dan Q <https://danq.me/>
// @license     MIT
// @description PleaseFixThisSite.com is a deliberately-ugly website that solicits payments in exchange for fixing its many flaws. But a website's design isn't entiely under the control of its developer: by the time content is on your computer, you're in control! So let's fix it for free...
// @downloadURL https://update.greasyfork.org/scripts/542903/Fix%20PleaseFixThisSitecom.user.js
// @updateURL https://update.greasyfork.org/scripts/542903/Fix%20PleaseFixThisSitecom.meta.js
// ==/UserScript==

/* Some fixes only need a class name added: */
document.body.classList.add(
  'fixed-font-size',
  'fixed-kerning',
  'fixed-marquee',
  'fixed-rotation',
  'fixed-rounded-corners',
  'fixed-typography'
);

/* Fix Alignment: */
(()=>{
  const a = document.getElementById('fixes-list');
  a &&
  (
    a.style.display = 'flex',
    a.style.flexDirection = 'column',
    a.style.alignItems = 'stretch'
  ),
  document.querySelectorAll('.fix-item').forEach(
    e => {
      e.style.display = 'flex',
      e.style.justifyContent = 'space-between',
      e.style.alignItems = 'center'
    }
  )
})();

/* Fix Font Heirarchy: */
(()=>{
  document.querySelectorAll('h1, .site-header-title').forEach(s => {
    s.style.fontWeight = 'bold',
    s.style.fontSize = '2.5rem'
  }),
  document.querySelectorAll('h2, .todo-header-title').forEach(s => {
    s.style.fontWeight = '600',
    s.style.fontSize = '1.8rem'
  }),
  document.querySelectorAll('p, .site-body-text, .broken-element-text').forEach(s => {
    s.style.fontWeight = 'normal',
    s.style.fontSize = '1rem'
  })
})();

/* Fix Spacing: */
(()=>{
  document.querySelectorAll('.fix-item, .placeholder-content').forEach(e => {
    e.style.padding = '15px',
    e.style.marginBottom = '10px'
  }),
  document.querySelectorAll('.site-body-text, .broken-element-text').forEach(e => {
    e.style.lineHeight = '1.6'
  })
})();

/* Fix Layout */
(()=>{
  const a = document.querySelector('.main-container');
  a &&
  (
    a.style.maxWidth = '800px',
    a.style.margin = '0 auto',
    a.style.padding = '20px'
  )
})();

/* Fix Color Palette: */
(()=>{
  const a = document.querySelector('.main-container');
  a &&
  (a.style.backgroundColor = '#ffffff', a.style.color = '#333333'),
  document.querySelectorAll('.fix-button, .broken-button').forEach(
    e => {
      e.disabled ||
      (e.style.backgroundColor = '#007bff', e.style.color = 'white')
    }
  );
})();
