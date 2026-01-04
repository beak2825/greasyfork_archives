// ==UserScript==
// @name         Miniflux add direct Twitter links for Nitter links
// @namespace    https://reader.miniflux.app/
// @version      8
// @description  Adds direct links to Twitter when a Nitter link is detected
// @author       Tehhund
// @match        *://*.miniflux.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=miniflux.app
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502366/Miniflux%20add%20direct%20Twitter%20links%20for%20Nitter%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/502366/Miniflux%20add%20direct%20Twitter%20links%20for%20Nitter%20links.meta.js
// ==/UserScript==

const addLinks = () => {
  if (!document.getElementsByClassName(`addDirectTwitterLink`)[0]) { // If there's already a direct Twitter link on the page, assume the script already ran and do nothing.
    let allHrefs = [...document.getElementsByTagName('a')];
    allHrefs = allHrefs.filter((href) => {
      return (href.href.includes("privacydev.net") || href.href.includes("poast.org") || href.href.includes("xcancel.com"));
    });
    for (const href of allHrefs) {
      const directLink = href.cloneNode(true);
      const newUrl = new URL(href.href);
      newUrl.host = "x.com";
      newUrl.href = newUrl.href.replace("#m", ""); // remove annoying #m that Nitter adds.
      directLink.href = newUrl;
      directLink.textContent = ``;
      newSpan = document.createElement('span');
      newSpan.classList.add('icon-label');
      newSpan.style.textDecoration = "underline";
      newSpan.textContent = `Direct Twiter Link`;
      newSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height=".8rem" viewBox="0 -960 960 960" width="20px" fill="#777777"><path d="M216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h264v72H216v528h528v-264h72v264q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm171-192-51-51 357-357H576v-72h240v240h-72v-117L387-336Z"/></svg>' + newSpan.innerHTML;
      directLink.appendChild(newSpan);
      href.after(directLink);
    }
  }
};

try { addLinks(); } catch (e) { }// If the script runs after DOMContentLoaded this will add the links. If it runs before DOMContentLoaded, this will error and the listener below will run it instead.
window.addEventListener('DOMContentLoaded', addLinks);