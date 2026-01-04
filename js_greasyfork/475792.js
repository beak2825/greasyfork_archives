// ==UserScript==
// @name        GreasyFork: Faster User Page
// @namespace   UserScripts
// @match       https://greasyfork.org/*
// @grant       none
// @version     0.1.3
// @author      CY Fung
// @license     MIT
// @description Reduce loading time of your user page
// @run-at      document-start
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/475792/GreasyFork%3A%20Faster%20User%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/475792/GreasyFork%3A%20Faster%20User%20Page.meta.js
// ==/UserScript==

(() => {

  function getWidthConstraint(root) {
    let p = root.querySelector('.width-constraint > .sidebarred')
    if (!p) return null;
    p = p.parentNode;
    return p;
  }

  function trimTo(str, p) {
    let q = str.indexOf(p);
    if (q >= 0) return str.substring(q);
    else return '';
  }

  function replacement(str, a, b) {
    let i = str.indexOf(a);
    if (i >= 0) return str.substring(0, i) + b + str.substring(i + a.length);
    return '';

  }

  function replaceQM(url) {
    let i = url.indexOf('?');
    if (i >= 0) return url.substring(0, i);
    return url;
  }

  function setup(_SETUP_) {

    const { wc, kUsername, kUrl, htmlCode } = _SETUP_;

    let pUsername = document.title;

    let pMS = trimTo(pUrl, '/users/');
    let kMS = trimTo(kUrl, '/users/');
    let pMD = '';
    let kMD = '';
    if (pMS && kMS) {
      pMD = replaceQM(pMS);
      kMD = replaceQM(kMS);
    }

    for (let node = document.head.firstElementChild; node; node = node.nextElementSibling) {

      switch (node.nodeName) {
        case 'META':
          if ((node.getAttribute('value') || '').includes(pUsername)) node.setAttribute('value', node.getAttribute('value').replace(pUsername, kUsername));
          break;
        case 'LINK':
          if (pMS && kMS) {
            let href = node.getAttribute('href')
            let nhref = replacement(href, pMS, kMS)
            if (nhref) node.setAttribute('href', nhref)
            else {
              nhref = replacement(href, pMD, kMD);
              if (nhref) node.setAttribute('href', nhref)


            }
          }
          break;
        default:
          if (node.textContent && node.textContent.includes(pUsername)) node.textContent = node.textContent.replace(pUsername, kUsername);
      }


    }

    if (pMS && kMS) {

      for (const elm of document.querySelectorAll('form#language-selector[action*="/users/"], option[data-language-url*="/users/"]')) {

        if (elm.nodeName === 'FORM') {

          let action = elm.getAttribute('action')
          let naction = replacement(action, pMS, kMS);

          if (naction) {
            elm.setAttribute('action', naction)
          }


        } else {


          let langurl = elm.getAttribute('data-language-url');
          let nlangurl = replacement(langurl, pMS, kMS);
          if (nlangurl) {
            elm.setAttribute('data-language-url', nlangurl)
          }


        }

      }

    }

    let q = wc.cloneNode(false);
    q.innerHTML = htmlCode;
    wc.replaceWith(q);



  }

  let pUrl = location.href;
  let pSearch = location.search;
  const bkIdx = pSearch.indexOf('custom_redirect=');
  if (bkIdx >= 0) {
    let usp = new URLSearchParams(pSearch.substring(bkIdx))
    let cr = usp.get('custom_redirect');
    if (typeof cr === 'string' && cr.length === 40) {
      const bCode = cr;
      const kUsername = sessionStorage.getItem(`gf_custom_redirect_username_${bCode}`);
      const kUrl = sessionStorage.getItem(`gf_custom_redirect_url_${bCode}`);
      const htmlCode = sessionStorage.getItem(`gf_custom_redirect_html_${bCode}`);
      if (typeof htmlCode === 'string' && htmlCode.length > 1 && typeof kUrl === 'string' && kUrl.length > 1 && typeof kUsername === 'string' && kUsername.length >= 1) {

        sessionStorage.removeItem(`gf_custom_redirect_username_${bCode}`);
        sessionStorage.removeItem(`gf_custom_redirect_url_${bCode}`);
        sessionStorage.removeItem(`gf_custom_redirect_html_${bCode}`);
        history.replaceState(history.state, '', kUrl);
        let mo = new MutationObserver(() => {
          const wc = getWidthConstraint(document);
          if (wc) {
            mo.disconnect();
            mo.takeRecords();
            mo = null;
            setup({ wc, kUsername, kUrl, htmlCode });
          }
        });
        mo.observe(document, { subtree: true, childList: true });
        // console.log(htmlCode);
      }
    }

  }


  function bufferToHex(buffer) {
    const byteArray = new Uint8Array(buffer);
    const len = byteArray.length;
    const hexCodes = new Array(len * 2);
    const chars = '0123456789abcdef';
    for (let i = 0, j = 0; i < len; i++) {
      const byte = byteArray[i];
      hexCodes[j++] = chars[byte >> 4];
      hexCodes[j++] = chars[byte & 0x0F];
    }
    return hexCodes.join('');
  }

  async function digestMessage(message) {
    const encoder = new TextEncoder("utf-8");
    const msgUint8 = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
    return bufferToHex(hashBuffer);
  }


  new Promise(r => {

    if (document.readyState !== 'loading') {
      r();
    } else {
      window.addEventListener("DOMContentLoaded", r, false);
    }
  }).then(() => {



    let plink = document.querySelector('.user-profile-link');
    if (plink) {

      document.head.appendChild(document.createElement('style')).textContent = `

        /* This will set the cursor for the entire body to "waiting" during loading */
        .body--loading {
          cursor: wait;
          --loading-overlay-display: block;
        }

        /* Optional: Simple overlay for the entire page with a loading spinner */
        .loading-overlay {
          display: var(--loading-overlay-display, none);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.8);
          background: transparent;
          z-index: 1000;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top: 5px solid black;
          animation: spin 1s linear infinite;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }


      `;

      let mp = document.createElement('template')
      mp.innerHTML = `
        <div class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>
      `
      document.body.appendChild(mp.content);
      mp = null;

      plink.addEventListener('click', (evt) => {
        let href = ((evt || 0).target || 0).href || '';
        let mi = href.indexOf('/users/');
        if (mi < 0) return;
        evt.preventDefault();
        document.body.classList.add('body--loading');
        let pf = href.substring(0, mi);
        fetch(href, {
          method: "GET",
          mode: "cors",
          cache: "default",
          credentials: "omit",
          redirect: "follow",
          referrerPolicy: "no-referrer",


        }).then(res => res.text()).then(async res => {
          let template = document.createElement('template');
          template.innerHTML = res;
          let w = template.content;
          let wc = getWidthConstraint(w);
          if (!wc || !wc.innerHTML.trim()) {

            document.body.classList.remove('body--loading');
            location.href = href;
            return;
          }
          let userName = w.querySelector('title');
          userName = userName ? userName.textContent : '';

          let htmlCode = wc.innerHTML.trim();
          console.log(w)
          console.log(htmlCode)
          let bCode = await digestMessage(htmlCode);

          sessionStorage.setItem(`gf_custom_redirect_username_${bCode}`, userName);

          sessionStorage.setItem(`gf_custom_redirect_url_${bCode}`, href);
          sessionStorage.setItem(`gf_custom_redirect_html_${bCode}`, htmlCode);

          document.body.classList.remove('body--loading');

          location.href = `${pf}/users/2-andrew-razzano?custom_redirect=${bCode}`;


        }).catch(error => {
          console.error('Error:', error);

          // Remove loading effect
          document.body.classList.remove('body--loading');

          location.href = href;

        });
      }, false);

    }


  });


})();

