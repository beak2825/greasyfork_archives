// ==UserScript==
// @name         Instagram - browse not logged
// @name:fr      Instagram - naviguer non-identifié
// @name:ru      Instagram - просмотр без авторизации
// @namespace    https://github.com/Procyon-b
// @version      0.4.3
// @description  Remove login message and popup. Remove cookies warning. Unlock links on the page.
// @description:fr  Enlève les message et dialogue d'inscription. Enlève la demande de cookies. Débloque les liens de la page.
// @description:ru  Удаляет некоторые напоминания о входе в аккаунт. Удаляет напоминание про куки. Разблокирует ссылки на странице
// @author       Achernar
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403031/Instagram%20-%20browse%20not%20logged.user.js
// @updateURL https://update.greasyfork.org/scripts/403031/Instagram%20-%20browse%20not%20logged.meta.js
// ==/UserScript==

(function() {
"use strict";

// find newly added links
var q, obs=new MutationObserver(function(muts){
  for (let mut of muts) {
    for (let n of mut.addedNodes) {
      if (n.classList.contains('Nnq7C')) fixLinks(n);
      else if (n.classList.contains('RnEpo') && n.classList.contains('Yx5HN')) {
        q=n.querySelector('.aOOlW.bIiDR');
        if (q) q.click();
        }
      }
    }
  });

obs.observe(document.body, {attributes: false, childList: true, subtree: true});
q=document.querySelector('.RnEpo.Yx5HN .aOOlW.bIiDR');
if (q) q.click();

function openLink(ev, force, t) {
  if (force) {
    if (!t || (t.href == location.href) ) return;
    }
  else if (document.documentElement.classList.contains('touch')) {
    let t=this;
    setTimeout(function(){openLink(ev, true, t);}, 200);
    return;
    }
  (this || t).cloneNode(false).dispatchEvent(new MouseEvent('click',ev));
  if (ev.ctrlKey) {
    ev.stopPropagation();
    ev.preventDefault();
    }
}

function fixLinks(r) {
  (r || document.body).querySelectorAll(':scope a[href^="/"]').forEach(function(e){
    if (!e.sclk) {
      e.sclk=true;
      if (!e.href.endsWith('/related_profiles/')) e.addEventListener('click',openLink, true);
      }
    });
  }

// fix links already on page
setTimeout(fixLinks,200);
setTimeout(fixLinks,2000);
// page lazy to load?
setTimeout(fixLinks,10000);
setTimeout(fixLinks,20000);

// hide message & popup
var st=document.createElement("style");
st.textContent=`._abab._abck[style="width: 100%;"], section.xZ2Xk.IXSPt, #scrollview + div:not([class]):not([style]) > div:not([class]):not([style]) > div.x1uhb9sk {display: none;} body[style*="overflow"] {overflow: initial !important;} #scrollview, .xixxii4 {position: unset !important;} body[style*="overflow"] > div._Yhr4[role="presentation"] {display: none;}@keyframes hidestart{from {width: 0;} to {width: ;} }body>div._Yhr4[role="presentation"] {animation-name: hidestart;animation-timing-function: step-end;animation-duration: 1s;}
body > [id^="mount_"] > div > div > span[id] + div {
  position: static !important;
}
body > [id^="mount_"] > div > div > span[id] + div + div:not([class]):not([style]) {
  display: none !important;
}`;
document.head.appendChild(st);

})();