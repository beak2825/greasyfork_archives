// ==UserScript==
// @name     soundcloud repost hide
// @namespace soundcloudreposthide
// @description makes reposts on feed smaller and with less opacity, so you can highlight the new songs
// @version  1
// @grant    none
// @match https://soundcloud.com/*
// @license MIT
// @icon https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico
// @downloadURL https://update.greasyfork.org/scripts/486703/soundcloud%20repost%20hide.user.js
// @updateURL https://update.greasyfork.org/scripts/486703/soundcloud%20repost%20hide.meta.js
// ==/UserScript==



const targetNode = document.querySelector("body");

targetNode.insertAdjacentHTML("beforeend",`

<style>

.hasrepost {
opacity: 0.4;
max-height: 100px;
overflow: hidden;
transition:all .3s;
/*display:none*/
}

.hasrepost:hover {
max-height:400px
}


</style>

`)

const config = { attributes: false, childList: true, subtree: true };

const callback = (mutationList, observer) => {
	document.querySelectorAll(".activity").forEach(e => {
    if(e.querySelector(".soundContext__repost")){
      e.classList.add("hasrepost")
    }
  })
};

const observer = new MutationObserver(callback);

observer.observe(targetNode, config);