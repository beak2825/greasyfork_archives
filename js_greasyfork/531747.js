// ==UserScript==
// @name     Bluesky F2F Ratio
// @version  1.1
// @match https://bsky.app/profile/*
// @grant    none
// @license MIT
// @description Simple userscript to replace "followers and follows" with an f2f ratio on bluesky 
// @namespace https://greasyfork.org/users/1453680
// @downloadURL https://update.greasyfork.org/scripts/531747/Bluesky%20F2F%20Ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/531747/Bluesky%20F2F%20Ratio.meta.js
// ==/UserScript==

// INSPIRED BY https://bsky.app/profile/jcsalterego.bsky.social/post/3llw7lwcios2q

let textMult = function(s) {
  return(s.endsWith("M") ? 1.0e6 :
         s.endsWith("K") ? 1.0e3 :
         1)
}

let abbrBigNumber = function(x) {
	if (x > 1e6) {
  	return( (x / 1.0e6).toFixed(2) + "M")
  } else if (x > 1e3) {
  	return( (x / 1.0e3).toFixed(2) + "K")
  } else {
		return "" + x;
	}
}

/**
 * Wait for an element before resolving a promise
 * @param {String} querySelector - Selector of element to wait for
 * @param {Integer} timeout - Milliseconds to wait before timing out, or 0 for no timeout
 */
function waitForElement(querySelector, timeout){
  return new Promise((resolve, reject)=>{
    var timer = false;
    if(document.querySelector(querySelector)) return resolve();
    const observer = new MutationObserver(()=>{
      if(document.querySelector(querySelector)){
        observer.disconnect();
        if(timer !== false) clearTimeout(timer);
        return resolve();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    if(timeout) timer = setTimeout(()=>{
      observer.disconnect();
      reject();
    }, timeout);
  });
}

let followBarSelector = '.r-2llsf > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1)';
waitForElement(followBarSelector, 3000).then(function(){
var followerEl = document.querySelector('a.css-146c3p1:nth-child(1) > span:nth-child(1)');
	let followingEl = document.querySelector('a.css-146c3p1:nth-child(2) > span:nth-child(1)');
  let followerText = followerEl.innerText.trim();
  let followingText = followingEl.innerText.trim();
	let followRatio = (
    (parseFloat(followerText) * textMult(followerText)) /
    (parseFloat(followingText) * textMult(followingText))
  ).toFixed(2);
  let followBar = document.querySelector(followBarSelector);
  followBar.firstChild.remove();
  followBar.firstChild.firstChild.innerText = "" + abbrBigNumber(followRatio) + ":1 ";
  followBar.firstChild.lastChild.innerText = "f2f ratio"
  console.log(followRatio);
}).catch(()=>{
    alert("element did not load in 3 seconds");
});