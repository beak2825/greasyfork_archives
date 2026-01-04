// ==UserScript==
// @name         Reddit - Inline post insight
// @namespace    https://github.com/Procyon-b
// @version      0.5.8
// @description  Display post "Insight" inline instead of in another page
// @author       Achernar
// @match        https://www.reddit.com/*
// @match        https://sh.reddit.com/*
// @grant        none
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/525102/Reddit%20-%20Inline%20post%20insight.user.js
// @updateURL https://update.greasyfork.org/scripts/525102/Reddit%20-%20Inline%20post%20insight.meta.js
// ==/UserScript==

(function() {
"use strict";

var started=0;
function start() {
  if (started) return;
  document.body.addEventListener('click', function(ev){
    //console.info({ev});
    var t=ev.target, r, f;
    if (t.href && (location.hostname == t.hostname) && t.pathname.startsWith('/poststats/') ) {
      ev.stopPropagation();
      ev.preventDefault();
      r=t.closest('div');
      if (r.nextElementSibling && r.nextElementSibling.id.startsWith('/poststats/')) {
        r.nextElementSibling.remove();
        return;
        }
      let f=document.createElement('iframe');
      f.src=t.pathname;
      f.id=t.pathname;
      f.style='flex-basis: 100%; border: none; height: 0;';
      r.parentNode.style['flex-wrap']='wrap';
      r.parentNode.appendChild(f);
      }
    }, true);
  addStyle(2);
  started++;
  }

function addStyle(v=1) {
  let st=document.createElement("style");
  document.documentElement.appendChild(st);
  if (v==2) st.textContent=
`div:has(+ iframe):not(:has( div a[href^="/poststats/"] )) a[href^="/poststats/"] {
  font-size: 0;
}
div:has(+ iframe):not(:has( div a[href^="/poststats/"] )) a[href^="/poststats/"]::before {
  content: "[-]";
  font-size: 1rem !important;
}`;
  else if (v==1) st.textContent=
`html, :not(:is(pre,code)) {
  background: transparent !important;
  background-color: transparent !important;
}

html body > :not(shreddit-app),
html body shreddit-app > :not([rpl]),
html body shreddit-app > [rpl]::before,
html body shreddit-app > [rpl][rpl][rpl] > :not(#subgrid-container),
html body .main-container > :not(main),
html body main > div > div,
html body main > div > div + section
{
  display: none !important;
}

shreddit-app > [rpl] {
  display: block !important;
}
obody,
shreddit-app,
shreddit-app > [rpl],
#subgrid-container,
#subgrid-container > .main-container,
#subgrid-container > .main-container > main {
  display: contents !important;
}

main > div {
  margin: 0 !important;
  padding: 0 !important;
}

a {
  pointer-events: none;
}

body {
  overflow: auto;
}`;
  }

function resize() {
  var TO=0, iframe;

  if (!(iframe=parent.document.querySelector('iframe[id="'+location.pathname+'"]'))) return;

  function resizeIframe() {
    if (TO) {clearTimeout(TO); TO=0;}
    iframe.style.height=document.body.scrollHeight + 20 + 'px';
    }

  const obs = new ResizeObserver(function(e){
    if (TO) {clearTimeout(TO);}
    TO=setTimeout(resizeIframe,200);
    });

  obs.observe(document.body);
  }


function tryUntil(F, TO=150, c=-1, fail) {
  if (!c--) {
    fail && fail();
    return;
    }
  try{F();}catch(e){setTimeout(function(){tryUntil(F,TO,c,fail);}, TO)}
  }

if (window === window.top) {
  tryUntil(start, 0);
  if (document.readyState != 'loading') start();
  else {
    document.addEventListener('DOMContentLoaded', start);
    window.addEventListener('load', start);
    }
  }
else if (location.pathname.startsWith('/poststats/')) {
  tryUntil(addStyle ,0);
  tryUntil(resize, 0);
  }

})();