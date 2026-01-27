// ==UserScript==
// @name         Coursera Right-Side Transcript
// @namespace    elddc
// @version      1.2
// @description  Place the transcript on the right side of the screen and auto-scroll to active section.
// @author       Elddc
// @match        https://www.coursera.org/learn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coursera.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506351/Coursera%20Right-Side%20Transcript.user.js
// @updateURL https://update.greasyfork.org/scripts/506351/Coursera%20Right-Side%20Transcript.meta.js
// ==/UserScript==

/* add auto-scroll; can remove if desired without changing transcript positioning */
const autoScroll = () => {
    console.log("scrolling");
    document.querySelector(".active").scrollIntoView({behavior: "smooth"});
}
setInterval(autoScroll, 15000);
setTimeout(() => document.addEventListener("click", autoScroll), 2000);
setTimeout(autoScroll, 2000);

/* reposition transcript */
const styles = document.createElement('style');
styles.innerHTML = `
/* put video container on the left */
div[data-testid="outer-container"] {
  position: fixed;
  left: 5vw;
  width: 55vw;
  top: 20vh;
}
/* keep video from shrinking when scrolling */
[data-testid="inner-container"] {
  height: 100% !important;
}
/* move title, transcript, etc to the left */
div:has(>[data-testid="outer-container"]) {
  position: relative;
  left: 56vw;
  width: 36vw;
}
/* move non-transcript elements up */
div[data-testid="tabs-root"] {
  position: relative;
  top: 0;
  z-index: 1;
}
div[data-testid="silent-select-field"] {
  position: fixed;
  bottom: 5vh;
  left: 5vw;
}

/* only needed for auto-scrolling */
.active {
  scroll-margin-top: 200px;
}
`;
document.head.appendChild(styles);