// ==UserScript==

// @name                Android Arsenal Feed Link to Github Redirection
// @description         Redirects the Android Arsenal library links to Github automatically if it is coming from the RSS Feed.
// @version             2.1

// @namespace           io.github.ni554n
// @match               https://android-arsenal.com/details/*/*?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed%3A+Android_Arsenal+%28The+Android+Arsenal%29

// @supportURL          https://github.com/ni554n/userscripts/issues
// @license             MIT

// @author              Nissan Ahmed
// @homepageURL         https://ni554n.github.io/
// @contributionURL     https://paypal.me/ni554n

// @downloadURL https://update.greasyfork.org/scripts/398914/Android%20Arsenal%20Feed%20Link%20to%20Github%20Redirection.user.js
// @updateURL https://update.greasyfork.org/scripts/398914/Android%20Arsenal%20Feed%20Link%20to%20Github%20Redirection.meta.js
// ==/UserScript==

const generalList = document.getElementsByClassName("row project-header")[0]?.firstElementChild

const labels = generalList.getElementsByTagName("dt")

// Grab the Github link and forward to it.
// "Link" label is faster to get to from the end.
for (let i = labels.length - 1; i >= 0; i--) {
  const label = labels.item(i);

  if (label.innerText === "Link") {
    const githubLink = label.nextElementSibling.innerText
    window.location.replace(githubLink);

    break;
  }
}
