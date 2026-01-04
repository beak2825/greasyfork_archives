// ==UserScript==
// @name GeoGuessr Daily Challenge Streak Next Steps
// @namespace   ggdsns
// @description Display the dates of the next Daily Challenge Streak Steps
// @version 0.1
// @author Nicolas
// @match https://www.geoguessr.com/*
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525531/GeoGuessr%20Daily%20Challenge%20Streak%20Next%20Steps.user.js
// @updateURL https://update.greasyfork.org/scripts/525531/GeoGuessr%20Daily%20Challenge%20Streak%20Next%20Steps.meta.js
// ==/UserScript==

window.addEventListener("load", (event) => {
    let bodyList = document.querySelector("body")

    let observer = new MutationObserver(function (mutations) {
      	if (location.pathname.includes("/me/profile") || location.pathname.includes("/user/")) {
            checkPage();
        }
    });

    let config = {
        childList: true,
        subtree: true
    };

    observer.observe(bodyList, config);
});

function checkPage() {
	let root = document.querySelector("a[href='/daily-challenges']")
  
  if (root && !root.title) {
    root.title = " "
    
    current = parseInt(/(\d+)/.exec(root.querySelectorAll(":scope > div[class*=currentStreak] label")[1].innerText)[0])
    
    max = parseInt(/(\d+)/.exec(root.querySelectorAll(":scope > div:not([class*=currentStreak]) label")[1].innerText)[0])
    
    next = []
    for (let n of [7, 30, 100, 365, 1000, 3650, 10000]) {
      if (n > max) {
        next.push(n)
      }
    }
    if (max > current && next[0] > max) {
      next.unshift(max)
    }
    
    message = ""
    for (let n of next) {
      message += new Date(Date.now() + (n - current) * 1000 * 86400).toISOString().substr(0, 10) + " " + n + "\n"
    }
    
    root.title = message
  }
}
