// ==UserScript==
// @name        Darken Retweet
// @namespace   Violentmonkey Scripts
// @match       https://twitter.com/*
// @grant       none
// @version     0.1.1
// @author      CY Fung
// @description 8/15/2023, 10:04:26 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473089/Darken%20Retweet.user.js
// @updateURL https://update.greasyfork.org/scripts/473089/Darken%20Retweet.meta.js
// ==/UserScript==

(function () {



  function getBox(p, anchor) {

    let u = p.parentNode;
    let v = null;
    while (u instanceof HTMLElement) {
      if (u.querySelector('a[href]') === anchor) {
        v = u;
      } else {
        break;
      }
      u = u.parentNode;
    }

    v = v ? (v.closest('[data-testid]') || v) : null;
    return v;


  }

  let valid = false;

  function getHref(href) {
    let qhref = /https?\:\/\/[-_a-zA-Z0-9.]+\/[^\/]+/.exec(href)
    if (qhref) qhref = qhref[0] || '';
    return qhref || '';
  }


  function firstRun() {


    let authorPhotoAnchor = document.querySelector('main a[href*="/header_photo"]');

    if (!authorPhotoAnchor) return;
    let apHref = getHref(authorPhotoAnchor.href);


    if ((location.href + '/').includes(apHref + '/')) {
      valid = true;
    }



  }


  let frt = true;


  setInterval(() => {

    for (const p of document.querySelectorAll('[data-testid="User-Name"]:not([ds37])')) {
      p.setAttribute('ds37', '');

      if (frt) {
        frt = false;
        firstRun();
      }
      if (!valid) return;

      const anchor = p.querySelector('a[href]')
      if (!anchor) continue;
      let href = anchor.href
      let qhref = getHref(href);
      let box = getBox(p, anchor);
      if (box && qhref) {



        if ((location.href + '/').includes(qhref + '/')) {

          box.setAttribute('twitter-poster', 'current-account')
        } else {
          box.setAttribute('twitter-poster', 'others')

        }
      }
    }



  }, 1);

  document.head.appendChild(document.createElement('style')).textContent = `
  
  [twitter-poster="others"]:not(:hover){
  
      background-color: #232323;
      opacity: 0.5;
  
  }
  [twitter-poster="others"]:hover{
    transition: none !important;
  }
  
  `




})();