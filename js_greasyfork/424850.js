// ==UserScript==
// @name Resize
// @namespace Script Runner Pro
// @match https://yande.re/post/show/*
// @grant none
// @description resize
// @version 0.0.1.20210411100430
// @downloadURL https://update.greasyfork.org/scripts/424850/Resize.user.js
// @updateURL https://update.greasyfork.org/scripts/424850/Resize.meta.js
// ==/UserScript==

async function waitForSelector(selector, options) {
  const startTime = new Date().getTime();
  return new Promise((resolve, reject) => {
    const id = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(id);
        resolve(element);
      } else {
        if (options.timeout && options.timeout < new Date().getTime() - startTime) {
          clearInterval(id);
          reject(new Error('timed out'));
        }
      }
    }, 50);
  });
}

function main() {
  waitForSelector('#image')
    .then(img => {
      img.style.width = '100%';
      img.style.height = 'auto';
      const a = document.createElement('a');
      a.innerHTML = img.outerHTML;
      a.href = img.src;
      document.querySelector('#right-col > div:nth-child(5)')
        .removeChild(img);
      document.querySelector('#right-col > div:nth-child(5)')
        .appendChild(a);
    });
}

window.addEventListener('load', main);
