// ==UserScript==
// @name         The Sims Resource - Easy Download Button
// @namespace    http://thesimsresource.com/
// @version      2.3
// @description  Open download in new window, auto-start download when ready.
// @author       Me
// @license      MIT
// @match        https://www.thesimsresource.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thesimsresource.com
// @downloadURL https://update.greasyfork.org/scripts/452099/The%20Sims%20Resource%20-%20Easy%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/452099/The%20Sims%20Resource%20-%20Easy%20Download%20Button.meta.js
// ==/UserScript==

(function(window) {
  'use strict';
  
  
  let noBlocks = () => {
    window.vis = undefined;
    window.isAdBlocked = false;
  	window.adsDisplayed = false;
    window.iHaveLoadedAds = false;
		document.body.classList.remove('has-adblock');
    document.querySelectorAll('#anon').forEach(e=>e.remove());
    document.querySelectorAll('.info-description-callout').forEach(e=>e.remove());
  };
  
  noBlocks();
  
  let download_button = document.querySelector('.details-big-info:not(.details-big-info-head) .download-button');

  if (download_button !== undefined && download_button !== null) {
    let item_id = download_button.getAttribute('itemid');
    let download_button_2 = document.createElement('button');
    download_button_2.textContent = 'Download';
    download_button_2.style = `
width: 125px;
height: 32px;
`;
    download_button.parentNode.insertBefore(download_button_2, download_button);
    download_button.remove();

    download_button_2.addEventListener('pointerup', async () => {

      let url = (await fetch(`https://www.thesimsresource.com/ajax.php?c=downloads&a=initDownload&itemid=${item_id}&format=zip`, {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.6",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          "x-requested-with": "XMLHttpRequest"
        },
        "referrer": `https://www.thesimsresource.com/downloads/details/id/${item_id}`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      }).then(r=>r.json())).url;
      window.open(url, '_blank');
    });

  }

  let counter = document.querySelector('.time-remaining .countdown');

  if (counter !== undefined && counter !== null) {
    let tries = 20;
    let loop = setInterval(async ()=>{
			noBlocks();
      if (parseInt(counter.textContent) < 5) {
        try {
          tries -= 1;
          if (tries < 1) {
            clearInterval(loop);
          }
          let download_url = (await fetch(`https://www.thesimsresource.com/ajax.php?c=downloads&a=getdownloadurl&ajax=1&itemid=${window.itemId}&mid=0&lk=0`, {
            "headers": {
              "accept": "*/*",
              "accept-language": "en-US,en;q=0.6",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "sec-gpc": "1",
              "x-requested-with": "XMLHttpRequest"
            },
            "referrer": `https://www.thesimsresource.com/downloads/thankyou/id/${window.itemId}`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
          }).then(r => r.json())).url;
          if (typeof download_url == 'string') {
            let link = document.createElement("a");
            link.href = download_url;
            link.click();
            clearInterval(loop);
          }

        } catch (err) {
          console.log(err);
        }
      }
    }, 1000);

  }

})(unsafeWindow);

