// ==UserScript==
// @name google fixer
// @description fix google annoying problems. currently it removes consent stuff from google and youtube, and you go directly to the web page instead of google feedback in google search.
// @namespace Violentmonkey Scripts
// @match https://www.youtube.com/*
// @match https://www.google.com/*
// @grant none
// @version 0.0.1.20190608185432
// @downloadURL https://update.greasyfork.org/scripts/385050/google%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/385050/google%20fixer.meta.js
// ==/UserScript==
function delete_cookie(name, domain) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=' + domain + ';';
}
const waitForIds = (...ids) => new Promise(resolve => {
  const delay = 500
  const f = () => {
    const elements = ids.map(id => document.getElementById(id))
    if (elements.every(element => element != null)) {
      resolve(elements)
    } else {
      setTimeout(f, delay)
    }
  }
  f()
})
const waitForTags = (...tags) => new Promise(resolve => {
  const delay = 500
  const f = () => {
    const elements = tags.flatMap(tag => document.getElementsByTagName(tag))
    if (elements.every(element => element != null)) {
      resolve(elements)
    } else {
      setTimeout(f, delay)
    }
  }
  f()
})
waitForIds('ticker').then(([ticker])=>{
  ticker.parentNode.removeChild(ticker);
})
waitForIds('consent-bump').then(([consentBump])=>{
  consentBump.parentNode.removeChild(consentBump);
})
waitForIds('lb').then(([lb])=>{
  lb.parentNode.removeChild(lb);
})
waitForIds('taw').then(([taw])=>{
  taw.parentNode.removeChild(taw);
})
waitForTags('ytd-popup-container').then(([ytd])=>{
  ytd.parentNode.removeChild(ytd);
})
waitForTags('a').then(([a])=>{
  console.log(a.length);
  for (var i = 0; i < a.length; i++) {
    console.log(a[i]);
    a[i].removeAttribute('onmousedown');
  }
})
delete_cookie('CONSENT', '.youtube.com');
delete_cookie('CONSENT', '.google.com');
