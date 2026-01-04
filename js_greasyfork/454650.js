// ==UserScript==
// @name         RPS Comment Orderer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fixes comment ordering on RPS articles
// @author       Bzly
// @match        https://www.rockpapershotgun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rockpapershotgun.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454650/RPS%20Comment%20Orderer.user.js
// @updateURL https://update.greasyfork.org/scripts/454650/RPS%20Comment%20Orderer.meta.js
// ==/UserScript==

/* jshint esversion:10 */

function mainSorter() {
  const order = document.querySelector('div#comments > div.container').getAttribute('data-order')
  let reverse
  if (order === 'desc') {reverse = true} else {reverse = false}
  document.querySelectorAll('ol.replies').forEach(e => {
    let copy_ol = e.cloneNode(false);
    let listItems = Array.prototype.slice.call(e.children, 0)
    sortLi(listItems, reverse).forEach(i => copy_ol.appendChild(i))
    e.parentNode.replaceChild(copy_ol, e)
  })
  console.log('Ordered comment replies')
}

function sortLi(list, reverse=false) {
  list.sort(function(a, b) {
    let aCat = Date.parse(a.querySelector('.when').getAttribute('data-date'))
    let bCat = Date.parse(b.querySelector('.when').getAttribute('data-date'))
    if (aCat > bCat) return 1
    if (bCat > aCat) return -1
    return 0
  })
  if (reverse) {return list.reverse()} else {return list}
}

const sleepUntil = async (f, timeoutMs) => {
  return new Promise((resolve, reject) => {
    const timeWas = new Date();
    const wait = setInterval(function() {
      if (f()) {
        console.log("resolved after", new Date() - timeWas, "ms");
        clearInterval(wait);
        resolve();
      } else if (new Date() - timeWas > timeoutMs) { // Timeout
        console.log("rejected after", new Date() - timeWas, "ms");
        clearInterval(wait);
        reject();
      }
    }, 20);
  });
}

function callback(mutList) {mutList.forEach((m) => {
  if (m.type==="attributes") {
    mainSorter()
  }
})}

async function main() {
  try {
    await sleepUntil(() => document.querySelector('ol.posts'), 5000)
    mainSorter()
    const observer = new MutationObserver(callback);
    observer.observe(document.querySelector('div#comments > div.container'), {attributes: true, subtree: false });
  } catch {
    console.log('Timeout :(')
  }
}

main()