// ==UserScript==
// @name         Auto downloader for lanzoux
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description auto download in lanzoux website
// @author       You
// @match        https://www.lanzoux.com/*
// @match        https://*.lanzous.com/*
// @match        https://*.baidupan.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410391/Auto%20downloader%20for%20lanzoux.user.js
// @updateURL https://update.greasyfork.org/scripts/410391/Auto%20downloader%20for%20lanzoux.meta.js
// ==/UserScript==

function pollingQuery(selector, interval, timeout) {
  const deadline = +new Date() + timeout;
  let timer = null;

  return new Promise((resolve, reject) => {
    function query() {
      const result = document.querySelector(selector);
      if (result) {
        resolve(result);
        if (timer) {
          window.clearTimeout(timer);
          timer = null;
        }
      } else if (+new Date() > deadline) {
        // timeout
        reject();
      } else {
        timer = setTimeout(query, interval);
      }
    }
    query();
  });
}

(function () {
  'use strict';
  console.log('script started');

  switch (true) {
    case /.*\.lanzou[x|s].com\/[^\/]+/.test(location.href):
      // base
      pollingQuery('#go>a', 200, 3 * 1000)
        .then((el) => {
          console.log(el.href);
          location.href = el.href;
        })
        .catch(() => {
          console.log('failed');
        });
      break;
    case /baidupan.com/.test(location.href):
      // download
      pollingQuery('#sub>div', 200, 3 * 1000)
        .then((el) => {
          console.log(el.text);
          setTimeout(() => {
            el.click();
            pollingQuery('#go>a', 200, 3 * 1000)
              .then((el) => {
                console.log(el.href);
                el.click();
              })
              .catch(() => {
                console.log('failed');
              });
          }, 3e3);
        })
        .catch(() => {
          console.log('failed');
        });

      break;
  }
})();