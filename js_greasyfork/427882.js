// ==UserScript==
// @name        Click on video thumbnail to play in MPV
// @name:ru     Нажми на митиатюру для проигрывания в MPV
// @namespace   nsinister.scripts.videothumb2mpv
// @match       https://*.youtube.com/*
// @match       https://vimeo.com/*
// @grant       none
// @version     0.1
// @author      nSinister
// @license     MIT
// @description Opens videos in external player (mpv) by simply clicking on a thumbnail.
// @description:ru Проигрывает ролики во внешнем плеере (mpv) по нажатию на миниатюру
// 
// @downloadURL https://update.greasyfork.org/scripts/427882/Click%20on%20video%20thumbnail%20to%20play%20in%20MPV.user.js
// @updateURL https://update.greasyfork.org/scripts/427882/Click%20on%20video%20thumbnail%20to%20play%20in%20MPV.meta.js
// ==/UserScript==

"use strict";


let observer;
let listeners = [];

let sites = {
  "youtube.com": { sel: "a.ytd-thumbnail", url: "https://www.youtube.com", needsFullUrl: true },
  "vimeo.com": { sel: "a.iris_video-vital__overlay", url: "https://vimeo.com", needsFullUrl: false },
};

// Watches for new elements based on selector to appear on page and assigns a function to them
function ready(selector, func) {
    listeners.push({ selector: selector, func: func });  
    if (!observer) {
        observer = new MutationObserver(checkDOM);
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }  
    checkDOM();
}

function checkDOM() {
    for (let i = 0, len = listeners.length, listener, elements; i < len; i++) {
        listener = listeners[i];
        elements = document.querySelectorAll(listener.selector);
        for (let j = 0, jlen = elements.length, element; j < jlen; j++) {
            element = elements[j];
            if (!element.ready) {
                element.ready = true;
                listener.func.call(element, element);
            }
        }
    }
}

// Replaces https:// hyperlinks with mpv:// and overrides click event
function replaceLink(node, site) {
  if(node) {
    let hrefval = node.getAttribute('href');
    if (hrefval == null || hrefval.startsWith("mpv"))
      return;
    let newval = "mpv://" + btoa( (site.needsFullUrl ? site.url : "") + hrefval);
    node.setAttribute('href', newval);
    node.addEventListener('click', function(event){
      event.preventDefault();
      event.stopPropagation();
      location.href = newval;
    });
  }
}

// Detects and returns current site from the list of known websites
function detectSite(sites) {
  let site;
  for (let s in sites) {
    site = sites[s];
    if (location.href.includes(s)) {
      return site;
    }
  }
  return null;
}

let site = detectSite(sites)
if (site) {
  ready(site.sel, function(element) {
      replaceLink(element, site);
  });
}