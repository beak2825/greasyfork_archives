// ==UserScript==
// @name        Add Raw link To GitHub Files
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*
// @version     0.0.2
// @description 12/13/2023, 1:18:04 AM
// @grant       GM_addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/521463/Add%20Raw%20link%20To%20GitHub%20Files.user.js
// @updateURL https://update.greasyfork.org/scripts/521463/Add%20Raw%20link%20To%20GitHub%20Files.meta.js
// ==/UserScript==

const cssText = `

    @keyframes button384 {
        from{
            background-position-x: 1px;
        }
        to{
            background-position-x: 2px;
        }
    }
    [aria-label="Copy file name to clipboard"]:not([ls4yu]) {
        animation: button384 1ms linear 0s 1 normal forwards;
    }

    .button385 {
      margin: 4px 2px;
    }

`;
function f101(btn) {
  btn.setAttribute('ls4yu', '');
  let p = btn;
  let link;
  while ((p = p.parentNode) instanceof HTMLElement) {
    link = p.querySelector('a[href*="#diff-"]');
    if (link) {
      break;
    }
  }
  if (!link) return;
  p = link.parentElement;
  if (!p) return;


  if (p.querySelector('.button385')) return;

  const code = link.querySelector('code');
  if (!code) return;
  const text = code.textContent.trim().replace(decodeURIComponent('%E2%80%8E'), '').trim();


  let commitId = '';

  const m = /\/([\w\-]+)\/([\w\-]+)\/commit\/([0-9a-f]{40})(#|$)/.exec(location.pathname);

  if (m && m[3]) {
    commitId = m[3];
  }

  if (commitId) {

    const a = document.createElement('a');
    a.classList.add('button385');
    p.insertBefore(a, link);

    a.textContent = 'RAW';
    a.style.cursor = 'pointer';




    a.setAttribute('href', `https://github.com/${m[1]}/${m[2]}/raw/${commitId}/${text}`)

  }

}


document.addEventListener('animationstart', (evt) => {
  const animationName = evt.animationName;
  if (!animationName) return;
  if (animationName === 'button384') {
    f101(evt.target);
  }
}, { passive: true, capture: true });

GM_addStyle(cssText);
