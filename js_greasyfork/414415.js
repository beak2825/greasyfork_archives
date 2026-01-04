// ==UserScript==
// @name         profile urls
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.okcupid.com/doubletake
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414415/profile%20urls.user.js
// @updateURL https://update.greasyfork.org/scripts/414415/profile%20urls.meta.js
// ==/UserScript==
let scraped = 0;
let lasturl;
// window.addEventListener("load", () => {
//   scrape();
// });

console.log('scraping.', window.location.href);
scrape();
setTimeout(() => {
  window.location.reload();
}, 120000);
async function scrape(iTry) {
  if (!iTry) iTry = 0;
  iTry += 1;
  if (iTry > 100) {
    location.reload();
    return;
  }
  //   const isPrivate = document.querySelector('.blank-state-title');
  const eProfileLink = document.querySelector("span.cardsummary-item.cardsummary-profile-link > a");
  if (!eProfileLink || eProfileLink == null) {
    // if (isPrivate) {
    //   console.log('Skip private.');
    //   goToNext();
    //   return;
    // }
    console.log('waiting for profilelink');
    setTimeout(() => {
      scrape(iTry);
    }, 1000);
    return;
  }
  const url = eProfileLink.href;
  window.scrapedUrl = url;
  // console.log(url);

  if (lasturl === url) { // try again
    // console.log('skip', url);
    document.querySelector('.doubletake-pass-button').click();
  } else {
    lasturl = url;
    document.querySelector('.doubletake-pass-button').click();
    await saveInfo(url);
    scraped += 1;
    iTry += 1;
    window.scraped = scraped;
    // console.log("Scraped: ", scraped);
  }
  scrape(0);
  return;
}


async function saveInfo(url) {
  try {
    await fetch(`https://srv.silvergps.com/profileurl`, {
      method: 'POST',
      body: url
    }).then(x => x.text());
    // .then(x => console.log(x));
  } catch (e) {
    console.log("Failed to save profileurl. will try again", e);
    return saveInfo(url);
  }
}
// })();