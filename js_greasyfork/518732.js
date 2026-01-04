// ==UserScript==
// @name        FAB Free Asset Getter
// @namespace   Violentmonkey Scripts
// @copyright 2024, subtixx (https://openuserjs.org/users/subtixx)
// @match       https://www.fab.com/channels/*
// @grant       none
// @license     AGPL-3.0-or-later
// @version     1.0
// @author      Dominic Hock <d.hock@it-hock.de>
// @description A script to get all free assets from the FAB marketplace
// @downloadURL https://update.greasyfork.org/scripts/518732/FAB%20Free%20Asset%20Getter.user.js
// @updateURL https://update.greasyfork.org/scripts/518732/FAB%20Free%20Asset%20Getter.meta.js
// ==/UserScript==

(function () {
  `use strict`;

  function getCSRFToken() {
    // Get from fab_csrftoken cookie
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith("fab_csrftoken=")) {
        return cookie.split("=")[1];
      }
    }
    return "";
  }

  async function getAcquiredIds(listings) {
    console.log("Getting acquired ids");
    // max listings is 24 so just cut
    if (listings.length > 24) {
      console.error("Too many listings");
      return [];
    }
    // Convert uid array to listing_ids=X&listing_ids=Y&listing_ids=Z
    let ids = listings
      .filter(listing => !listing.isOwned)
      .map(listing => listing.id)
      .join("&listing_ids=");
    //[{"uid":"5059af80-527f-4dda-8e75-7dde4dfcdf81","acquired":true,"rating":null}]
    let result = await fetch("https://www.fab.com/i/users/me/acquired-content?listing_ids=" + ids, {
      "credentials": "include",
      "headers": {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en",
        "X-Requested-With": "XMLHttpRequest",
        "X-CsrfToken": getCSRFToken(),
        "Sec-GPC": "1",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
      },
      "referrer": "https://www.fab.com/channels/unreal-engine?is_free=1&sort_by=-createdAt&is_ai_generated=0",
      "method": "GET",
      "mode": "cors"
    });

    let json = await result.json();
    let acquired = [];
    for (let i = 0; i < json.length; i++) {
      if (json[i].acquired) {
        acquired.push(json[i].uid);
      }
    }

    let alreadyAcquired = listings.filter(listing => listing.isOwned).length;

    console.log("Acquired " + acquired.length + " of " + listings.length + " listings (" + alreadyAcquired + " already acquired were skipped)");
    return acquired;
  }

  async function getIds() {
    let results = document.getElementsByClassName("fabkit-ResultGrid-root")[0];
    let foundItems = results.childNodes;

    let currentListings = [];
    for (let i = 0; i < foundItems.length; i++) {
      let element = foundItems[i];
      // Check if we have a listing
      if (foundItems[i].getElementsByClassName("fabkit-Stack-root").length <= 0) {
        console.error("No listing found?? " + element);
        continue;
      }
      let root = foundItems[i].getElementsByClassName("fabkit-Stack-root")[0];
      if (root.getElementsByClassName("fabkit-Stack-root").length <= 0) {
        console.error("No listing found?? " + element);
        continue;
      }
      let root2 = root.getElementsByClassName("fabkit-Stack-root")[1];
      let thumbOverlay = root.getElementsByClassName("fabkit-Thumbnail-overlay")[0];
      let name = root2.getElementsByClassName("fabkit-Typography-root")[0].innerText;
      let url = thumbOverlay.href;
      let isOwned = root2.getElementsByClassName("fabkit-Typography-root")[2].innerText === "Owned";
      console.debug(name + " - " + url + ": " + isOwned);

      if (url === undefined) {
        console.log("Not loaded???? ", url, element)
        return;
      }
      // Extract id
      let id = url.split("/").pop();

      currentListings.push({
        isOwned: isOwned,
        name: name,
        id: id
      });
    }

    let acquired = [];
    console.log("Need to check " + currentListings.length + " listings");
    if (currentListings.length > 24) {
      console.log("Too many listings, splitting into 24 chunks");
      // Slice, request, join, until we are finished
      for (let i = 0; i < currentListings.length; i += 24) {
        let partial = await getAcquiredIds(currentListings.slice(i, i + 24));
        acquired = acquired.concat(partial);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    else {
      acquired = await getAcquiredIds(currentListings);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    // [{id:"",offerId:""}]
    let offers = [];
    for (let i = 0; i < currentListings.length; i++) {
      console.log("Checking " + currentListings[i].name + " (" + currentListings[i].id + ")");
      let currentListing = currentListings[i];
      if (acquired.includes(currentListing.id)) {
        console.log(currentListing.name + " (" + currentListing.id + ") already acquired");
        continue;
      }

      let result = await fetch("https://www.fab.com/i/listings/" + currentListing.id, {
        "credentials": "include",
        "headers": {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "en",
          "X-Requested-With": "XMLHttpRequest",
          "X-CsrfToken": getCSRFToken(),
          "Sec-GPC": "1",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "Priority": "u=0"
        },
        "referrer": "https://www.fab.com/listings/" + currentListing.id,
        "method": "GET",
        "mode": "cors"
      });

      // licenses -> foreach -> get where price 0 -> buy
      let json = await result.json();
      let listingOffers = [];
      for (let j = 0; j < json.licenses.length; j++) {
        let license = json.licenses[j];
        if (license.priceTier.price != 0) {
          continue;
        }

        offers.push({
          name: currentListing.name,
          id: currentListing.id,
          offerId: license.offerId
        });
        listingOffers.push(license.offerId);
        console.log("Found free offer for " + currentListing.name + " (" + currentListing.id + ")");
      }
      if (listingOffers.length == 0) {
        console.log("No free offers found for " + currentListing.name + " (" + currentListing.id + ")");
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    for (let i = 0; i < offers.length; i++) {
      console.log("Trying to add " + offers[i].name + " (" + offers[i].id + ")");
      let result = await fetch("https://www.fab.com/i/listings/" + offers[i].id + "/add-to-library", {
        "credentials": "include",
        "headers": {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "en",
          "X-Requested-With": "XMLHttpRequest",
          "X-CsrfToken": getCSRFToken(),
          "Content-Type": "multipart/form-data; boundary=---------------------------4056384097365570293376228769",
          "Sec-GPC": "1",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "Priority": "u=0"
        },
        "referrer": "https://www.fab.com/listings/" + offers[i].id,
        "body": "-----------------------------4056384097365570293376228769\r\nContent-Disposition: form-data; name=\"offer_id\"\r\n\r\n" + offers[i].offerId + "\r\n-----------------------------4056384097365570293376228769\r\n-----------------------------4056384097365570293376228769--\r\n",
        "method": "POST",
        "mode": "cors"
      });
      // check for 200
      if (result.status == 200 || result.status == 201 || result.status == 202 || result.status == 204) {
        console.log("Added " + offers[i].name + " (" + offers[i].id + ")");
      }
      else {
        console.log("Failed to add " + offers[i].name + " (" + offers[i].id + ")");
      }
      console.log("Progress: " + (i + 1) + "/" + offers.length + " (" + ((i + 1) / offers.length * 100).toFixed(2) + "%)");
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return foundItems[foundItems.length - 1];
  }

  async function getAll() {
    let last;
    last = await getIds();

    for (let i = 0; i < 64; i++) {
      // Scroll to last item and wait for 5 seconds
      last.scrollIntoView();

      console.log("Scrolling...");
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log("Refreshing...");
      last = await getIds();
      console.log("Done");
    }
  }

  function doControlsExist() {
    var sortContainer = getSortContainer();
    return sortContainer.querySelector(`.tmnky-custom-controld`);
  }

  function getSortContainer() {
    return document.getElementsByClassName(`fabkit-Surface-root`)[0].childNodes[0];
  }

  function addControls() {
    var hideOwnedCheckbox = createCheckbox(`Get Free Assets`);

    var sortContainer = getSortContainer();
    var onSaleCheckbox = sortContainer.querySelector(`:nth-child(4)`)

    if (onSaleCheckbox && onSaleCheckbox.parentElement === sortContainer) {
      sortContainer.insertBefore(hideOwnedCheckbox, onSaleCheckbox);
    }
  }

  function createCheckbox(text) {
    var checkboxAccordionHeaderContainer = document.createElement(`h2`);
    checkboxAccordionHeaderContainer.className = `fabkit-Accordion-headerContainer tmnky-custom-controld`;

    var checkboxAccordionHeader = document.createElement(`label`);
    checkboxAccordionHeader.className = `fabkit-Accordion-header`;
    var textElement = document.createTextNode(text);
    checkboxAccordionHeader.appendChild(textElement);
    checkboxAccordionHeaderContainer.appendChild(checkboxAccordionHeader);

    var checkboxAccordionHeaderRight = document.createElement(`div`);
    checkboxAccordionHeaderRight.className = `fabkit-Accordion-headerRight`;
    checkboxAccordionHeader.appendChild(checkboxAccordionHeaderRight);

    var checkboxElement = document.createElement(`button`);
    checkboxElement.addEventListener(`click`, function () {
      getAll();
    });
    checkboxElement.innerText = "Get";
    checkboxAccordionHeaderRight.appendChild(checkboxElement);

    return checkboxAccordionHeaderContainer;
  }

  function onBodyChange(mut) {

    if (!doControlsExist()) {
      addControls();
    }
  }

  var mo = new MutationObserver(onBodyChange);
  mo.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
