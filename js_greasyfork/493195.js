// ==UserScript==
// @name        CopyID stashdb.org
// @namespace   Violentmonkey Scripts
// @match       https://stashdb.org/scenes/*
// @grant       none
// @version     1.0
// @author      nimmadev
// @license MIT
// @description 22/4/2024, 10:48:29 pm
// @downloadURL https://update.greasyfork.org/scripts/493195/CopyID%20stashdborg.user.js
// @updateURL https://update.greasyfork.org/scripts/493195/CopyID%20stashdborg.meta.js
// ==/UserScript==

window.addEventListener('load', () => {
  setTimeout(() => {
    const script = document.createElement('script');
    script.text = `function copyPageUrl() {
      const pageUrl = window.location.href;
      const parts = pageUrl.split('/');
      const lastPart = parts[parts.length - 1];
      navigator.clipboard.writeText(lastPart)
        .then(() => {
          console.log('Page URL copied:', pageUrl);
          alert('ID Copied')
        })
        .catch(err => {
          console.error('Failed to copy URL:', err);
        });
    }`
    document.body.appendChild(script);
    const titleName = document.querySelector('.scene-info > div:first-child > h3:nth-child(2)');
    titleName.style.display = 'flex'
    titleName.style.alignItems = 'center'
    titleName.innerHTML += `
      <span style="margin-left:auto; display:flex; align-items:center; color:#3498db; cursor:pointer;" onclick="copyPageUrl()">
        Copy Id
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:5px;">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15h8"></path>
        </svg>
      </span>`;
  }, 1000);
});