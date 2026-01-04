// ==UserScript==
// @name        X (Twitter): Hide all ads
// @namespace   Violentmonkey Scripts
// @match       https://x.com/*
// @grant       none
// @version     1.0
// @author      @weijarz
// @description 7/5/2023, 9:31:41 PM
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/497012/X%20%28Twitter%29%3A%20Hide%20all%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/497012/X%20%28Twitter%29%3A%20Hide%20all%20ads.meta.js
// ==/UserScript==

function muteAd(el) {
  const article = el.closest('article');
  if (!article || article.dataset.unMuted) return;
  article.firstElementChild.style.opacity = 0;
  article.firstElementChild.style.pointerEvents = 'none';

  article.style.background = 'repeating-linear-gradient(45deg, rgba(100, 100, 100, 0.06), rgba(100, 100, 100, 0.06) 20px, transparent 20px, transparent 40px)';

  article.addEventListener('click', ev => {
    ev.preventDefault()
    article.dataset.unMuted = true
    article.firstElementChild.style.opacity = 1;
    article.firstElementChild.style.pointerEvents = 'auto';
    article.style.background = '';
  }, { once: true })
}

function muteAllAds() {
  const spans = document.querySelectorAll('div>span:first-child:last-child')
  for (const span of spans) {
    if (span.childElementCount === 0 && span.firstChild?.nodeType === 3 && /^(Ad|推荐)$/.test(span.firstChild.nodeValue)) {
      muteAd(span);
    }
  }
}

function muteAdMulti(times = [10, 50, 100, 300, 1000, 2000, 4000, 7000]) {
  for (const delay of times)
    setTimeout(muteAllAds, delay);
}

document.addEventListener('keyup', ev => {
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(ev.target.tagName)) return
  if (ev.key === 'PageDown' || ev.key === ' ') {
    lastScrollY = window.scrollY
    muteAdMulti();
  }
});

window.addEventListener("popstate", ev => {
  muteAdMulti();
});

window.navigation?.addEventListener("navigate", ev => {
  muteAdMulti();
});

window.addEventListener("click", ev => {
  muteAdMulti();
}, true);

let lastScrollY = 0
setInterval(() => {
  if (Math.abs(window.scrollY - lastScrollY) > 200) {
    lastScrollY = window.scrollY;
    muteAllAds();
  }
}, 1000);

muteAdMulti();
