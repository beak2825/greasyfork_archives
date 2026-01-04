// ==UserScript==
// @name          Invidious Teleporter
// @namespace     lousando
// @match         https://*/*
// @match         http://*/*
// @exclude-match https://invidiou.site*
// @ezclude-match https://invidious.snopyta.org*
// @exclude-match https://yewtu.be*
// @exclude-match https://invidious.tube*
// @exclude-match https://invidious.xyz*
// @grant         GM_getValue
// @run-at        document-end
// @version       0.7
// @author        Louis Sandoval
// @description   Converts Youtube links to Invidious ones.
// @downloadURL https://update.greasyfork.org/scripts/406948/Invidious%20Teleporter.user.js
// @updateURL https://update.greasyfork.org/scripts/406948/Invidious%20Teleporter.meta.js
// ==/UserScript==

// allow for overriding of Invidious instance
const invidiousDomain = GM_getValue("invidious_domain", "invidiou.site");
const youtubeTextRegex = /youtu*.be(\.com)?/i;

const isYoutubeUrl = uri => {
  const parseURI = new URL(uri);
    
  return parseURI.hostname.includes("youtube.com") || parseURI.hostname.includes("youtu.be");
};

const convertYoutubeLinks = (youtubeElements) => {  
  // links
  youtubeElements.filter(e => e.tagName === "A").filter(link => {
    return isYoutubeUrl(link.href);
  }).forEach(link => {
    link.innerText = link.innerText.replace(youtubeTextRegex, invidiousDomain);
    
    const newUrl = new URL(link.href);
    newUrl.hostname = invidiousDomain;
        
    link.setAttribute("href", newUrl.href);
  });
  
  // iframes
  youtubeElements.filter(e => e.tagName === "IFRAME").filter(iframe => {
    return isYoutubeUrl(iframe.src);
  }).forEach(iframe => {
    const newUrl = new URL(iframe.src);    
    newUrl.hostname = invidiousDomain;
        
    iframe.setAttribute("src", newUrl.href);
  });
  
};

convertYoutubeLinks([
  ...Array.from(document.body.querySelectorAll("a[href],iframe[src]"))
]);

// Create an observer instance linked to the callback function
const observer = new MutationObserver(mutationList => {
  convertYoutubeLinks([
    ...Array.from(document.body.querySelectorAll("a[href],iframe[src]"))
  ]);
});

// Start observing the target node for configured mutations
observer.observe(document.body, {
  childList: true, 
  subtree: true,
  attributes: true
});