// ==UserScript==
// @name         1-Click Download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  On click download user's post link
// @author       TheJunk
// @match        https://coomer.su/*/user/*/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coomer.su
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490893/1-Click%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/490893/1-Click%20Download.meta.js
// ==/UserScript==


try {
  const links = [...document.querySelectorAll(".post__attachment-link")];
    console.log(document.querySelector(".post__published"));
  const date = document.querySelector(".post__published").innerText.split(' ')[1];
  const title = document.querySelector(
    ".post__title > span:first-of-type"
  ).innerText;


  links.forEach((link, i) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const url = link.getAttribute("href");
        const suffix = i !== 0 ? ` - ${i+1}` :"";

      const name = `${date + " - " + title + suffix}`.replace(/[^a-zA-Z0-9 -]/g, '').replace(/\s+$/, '') + ".mp4";
      GM_download({
        url,
        name,
        saveAs: true,
        onerror: (e) => console.error(e),
      });
    });
  });
} catch (e) {
  console.error(e);
}
