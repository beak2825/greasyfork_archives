// ==UserScript==
// @name Outlook Hotmail cleanup
// @version 1.5.0
// @grant none
// @include https://outlook.live.com/mail/*
// @license MIT
// @namespace https://greasyfork.org/en/users/759669-sly-north
// @description Remove ads on Outlook Hotmail
// @downloadURL https://update.greasyfork.org/scripts/473436/Outlook%20Hotmail%20cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/473436/Outlook%20Hotmail%20cleanup.meta.js
// ==/UserScript==

function unscale(p) {
  if (p && p.style.transform) {
    p.style.transform = 'scale(1)';
    p.style.width = "100%";
    p.style.height = "100%";
  }
}

let smallAdsDiv = null;

function RemoveAds() {
  // Small ads above list of messages
  if (!smallAdsDiv) {
    var smallDivs = Array.from(document.getElementsByTagName('div')).filter(e => e.clientWidth > 340 && e.clientWidth < 370 && e.clientHeight > 70 && e.clientHeight < 85);
    if (smallDivs.length > 0) {
      const e = smallDivs[0];
      // Check it's not a valid email.
      const text = e.innerText;
      if (text.search('@') < 0 && !text.search(/\/202/) && !text.match(/\d\/\d/) && text.search(' AM') < 0 && text.search(' PM') < 0) {
        smallAdsDiv = e;
        console.log('- OutlookCleanup: found small ads div: ', e.innerText);
      }
    }
  }
  if (smallAdsDiv && smallAdsDiv.style.zIndex >= 0) {
    console.log('- OutlookCleanup: remove small div: ', smallAdsDiv.innerText);
    smallAdsDiv.style.maxHeight = '0px';
    smallAdsDiv.style.zIndex = -100;
  }

  // Right most vertical ads.
  let main = document.getElementById('MainModule');
  if (main) {
    while (main.childElementCount == 1) main = main.firstChild;
    if (main.childElementCount > 3) {
      let e = main.children[main.childElementCount - 1];
      if (e.getBoundingClientRect().width < 200) {
        // console.log('OutlookCleanup: remove right vertical ad space');
        e.style.zIndex = -100;
        e.style.position = 'fixed';
      }
    }
  }
  for (let e of Array.from(document.getElementsByTagName('button')).filter(e => e.innerText.search('Microsoft 365') > 0)) {
    if (e.done) continue;
    e.done = true;
    e.style.zIndex = -100;
    e.style.position = 'fixed';
    console.log('- OutlookCleanup: remove 365 ads: ', e.innerText);
  }
}

function doAll() {
  RemoveAds();

  // Left icons
  const leftBar = document.getElementById('LeftRail');
  if(leftBar) leftBar.style.zoom = 0.5;
 
  // Less large folder area
  const folderPane = document.querySelector('[aria-label="Navigation pane"]');
  if (folderPane) folderPane.style.width = "12vw";
  const folderContainer = document.getElementById('folderPaneDroppableContainer');
  if (folderContainer) folderContainer.style.padding

  // Make messages not so small
  for (let e of document.getElementsByClassName('wide-content-host')) {
    unscale(e.parentElement);
  }
  unscale(document.getElementById('docking_InitVisiblePart_0'));
  unscale(document.getElementById('docking_InitVisiblePart_1'));

  setTimeout(doAll, 1000);
}

setTimeout(doAll, 3000);