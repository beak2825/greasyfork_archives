// ==UserScript==
// @name     Click outside tweet to close it
// @description Adds a trigger to the outside of the tweet to be able to quickly close them. Allowing for a far more comfortable experience.
// @version  1.2
// @include  https://twitter.com/*
// @grant    none
// @namespace https://greasyfork.org/users/577280
// @downloadURL https://update.greasyfork.org/scripts/404532/Click%20outside%20tweet%20to%20close%20it.user.js
// @updateURL https://update.greasyfork.org/scripts/404532/Click%20outside%20tweet%20to%20close%20it.meta.js
// ==/UserScript==

function attemptBack(){
    const btn = document.querySelector('[aria-label="Back"]');
    const close = document.querySelector('[aria-label="Close"]');
  	//Don't close when in image view as it's already handled by Twitter.
  
   if(btn !== null && close === null && window.location.toString().includes('/status/'))
        btn.click()
}

let leftShit, rightShit;
document.querySelector("#react-root").addEventListener("click", e => {
    leftShit = leftShit || document.querySelector(".r-1rnoaur");
    rightShit = rightShit || document.querySelector(".r-2llsf");
    //Jeez I fucking despise these cryptic names. Thank god for aria lables.
    const role = e.target.getAttribute("role")
    if(role === "banner" || role === "main" || e.target == rightShit || e.target == leftShit)
        attemptBack();
});
