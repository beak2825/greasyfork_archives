// ==UserScript==
// @name         Paid4Link
// @namespace    http://Yu.net/
// @version      1.2
// @description  I don't know
// @author       Yu
// @match        https://link.paid4link.com/*
// @match        *://*.recaptcha.net/*
// @match        *://go.paid4link.com/*
// @match        *://indirasari.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=paid4link.com
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480107/Paid4Link.user.js
// @updateURL https://update.greasyfork.org/scripts/480107/Paid4Link.meta.js
// ==/UserScript==

const skipTiming = () => {
  const formGo = document.querySelector('form#go-link');
  if (formGo) {
    const data = new FormData(formGo);
    const encodeData = new URLSearchParams(data).toString();

    setTimeout(() => {
      fetch('/links/go', {
        method: 'Post',
        headers: {
          'x-requested-with': 'XMLHttpRequest',
        },
        body: data,
      })
        .then(resp => {
          return resp.json();
        })
        .then(data => {
          if (data.status === 'success') {
            document.location.href = data.url;
          } else {
            alert(data.message);
          }
        })
        .catch(err => alert(err.message));
    }, 6000);
  } else {
    alert('Form tidak ada');
  }
};

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    if (document.location.href.match(/\.recaptcha.net\//)) {
      let id = null;
      id = setInterval(() => {
        const checkbox = document.querySelector('.recaptcha-checkbox-border');
        if (checkbox) {
          console.log('Recaptcha Clicked');
          checkbox.click();
          clearInterval(id);
        }
      }, 1000);
    }

    if (document.location.href.match(/link.paid4link.com\//)) {
      if (document.getElementById('invisibleCaptchaShortlink')) {
        document.querySelector('#captchaShortlink').scrollIntoView();
        let id = null;
        id = setInterval(() => {
          if (
            unsafeWindow.grecaptcha &&
            unsafeWindow.grecaptcha.getResponse().length > 0
          ) {
            document.getElementById('invisibleCaptchaShortlink').click();
            clearInterval(id);
          }
        }, 500);
      }

      if (document.querySelector('a.get-link')) {
        skipTiming();
      }
    }
  });

  if (document.location.href.match(/go.paid4link.com\//)) {
    window.location.href = `https://link.paid4link.com/${window.location.pathname}`;
  }
  if (document.location.href.match(/indirasari.com\//)) {
    const search = new URLSearchParams(document.location.search);
    window.location.href = `https://link.paid4link.com/${search.get('link')}`;
  }
})();
