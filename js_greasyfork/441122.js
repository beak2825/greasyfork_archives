// ==UserScript==
// @name Copy Simply Johnny's
// @namespace bambooom
// @version 0.3
// @description I just wanna copy something
// @author bambooom
// @homepageURL https://zhuzi.dev
// @supportURL https://zhuzi.dev
// @license MIT
// @match https://*.johnnys-net.jp/*
// @match https://*.johnnys-web.com/*
// @match https://*.johnny-associates.co.jp/*
// @match https://johnnys-shop.jp/*
// @match https://*.johnnys-shop.jp/*
// @match https://j-island.net/*
// @match https://*.j-island.net/*
// @run-at document-end
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/441122/Copy%20Simply%20Johnny%27s.user.js
// @updateURL https://update.greasyfork.org/scripts/441122/Copy%20Simply%20Johnny%27s.meta.js
// ==/UserScript==

(function() {
  let css = `
    body{
      user-select: auto!important;
    }
    h1, h2, h3, h4, h5, p, span, img {
      user-select: auto!important;
    }
    *:not(input) {
      user-select: auto!important;
    }

    .visually-hidden {
      border: 0;
      clip: rect(0,0,0,0);
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
     }
  `;
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);

  let donot = [...document.querySelectorAll('script')].filter(n => /donot\.js$/.test(n.src));
  if (donot.length) {
    donot[0].remove();
  }
  unsafeWindow.KEY_ENABLE = 1;
  unsafeWindow.________J && unsafeWindow.________J.doNot({
      selectContent: null,
      captureImages: null,
     useContextMenu: null,
            useKeys: null,
  });

  if (/johnnys-web\.com/.test(unsafeWindow.location.hostname)) {
    unsafeWindow.navigator.userAgent = 'Mozilla/5.0 (iPad; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
    unsafeWindow.navigator.appVersion = '5.0 (iPad; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
    //location.href = 'https://www.johnnys-web.com/s/jwb/?ima=4442';
    var post = document.querySelector('.entry__content .entry__body');
    if (post) {
      post = post.textContent.trim();
      var row = document.querySelector('.entry__posted_on');
      var color = getComputedStyle(document.querySelector('.blog .section-article .entry__date')).color;
      var btn = document.createElement('button');
      btn.style.color = color;
      btn.style.border = 'solid 2px ' + color;
      btn.style.borderRadius = '3px';
      btn.style.padding = '4px 6px';
      btn.textContent = 'Copy Full Text';
      row.appendChild(btn);
      var input = document.createElement('textarea');
      input.classList.add('visually-hidden');
      input.id = 'copy-full-text';
      document.body.appendChild(input);
      btn.onclick = function () {
        input.value = post;
        input.select();
        let success = document.execCommand('copy');
        window.getSelection().removeAllRanges();
        if (success) {
          console.log('copied');
        }
      };
    }
  }
})();
