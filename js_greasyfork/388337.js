// ==UserScript==
// @name            eBay Extras
// @version         1.4
// @description     Replaces default navigation buttons, adds a notification bar when searching for 'US only' or when searching for 'Sold items', removes certain ads
// @author          asheroto
// @license         MIT
// @icon            https://www.ebay.com/favicon.ico
// @match           https://*.ebay.com/*
// @namespace       https://greasyfork.org/en/scripts/388337-ebay-extras
// @grant           GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/388337/eBay%20Extras.user.js
// @updateURL https://update.greasyfork.org/scripts/388337/eBay%20Extras.meta.js
// ==/UserScript==

// ==OpenUserScript==
// @author          asheroto
// ==/OpenUserScript==

/* jshint esversion: 6 */

(function () {
  // Function: insert nav buttons
  function addLink(text, url) {
    let bodChild = document.createElement("li");
    bodChild.classList.add("gh-t");
    bodChild.classList.add("gh-divider-l");
    bodChild.id = "gh-p-3";
    bodChild.innerHTML = '<a href="' + url + '" class="gh-p"> ' + text + "</a>";
    document.getElementById("gh-p-3").parentNode.insertBefore(bodChild, document.getElementById("gh-p-3").nextSibling);
  }
  // Function: for top bar
  function addTopBar(atext) {
    let elChild = document.createElement("div");
    elChild.style.background = "black";
    elChild.style.color = "white";
    elChild.innerHTML = "<center><font size=4>" + atext + "</font></center>";
    document.body.insertBefore(elChild, document.body.firstChild);
  }
  // Function: try to remove item
  function tryRemove(itm) {
    if (itm) {
      try {
        itm.remove();
      }
      catch (err) {}
    }
  }

  // Insert nav buttons
  addLink("Orders", "https://www.ebay.com/sh/ord/?filter=status:ALL_ORDERS");
  addLink("Active Listings", "https://www.ebay.com/sh/lst/active");
  addLink("Purchases", "https://www.ebay.com/myb/PurchaseHistory");
  addLink("Watch List", "https://www.ebay.com/myb/WatchList");
  addLink("Messages", "https://mesg.ebay.com/mesgweb/ViewMessages/0");

  // If on a category or search, and on a sold/unsold page, then show unsold link / show sold link
  if (document.location.pathname.startsWith("/e/") || document.location.pathname.startsWith("/sch/")) {
    if (document.location.href.includes("&LH_Sold=1")) {
      addLink("This page > unsold items", document.location.href.replace("&LH_Sold=1", "").replace("&LH_Complete=1", ""));
    }
    else {
      addLink("This page > sold items", document.location + "&LH_Sold=1&LH_Complete=1");
    }
  }

  // If username is detected, show feedback link
  let userId = document.body.innerHTML.match(/id:"(.*?)"}/);
  if (userId) {
    let userFeedbackId = userId[1];
    addLink("My Feedback", "https://feedback.ebay.com/ws/eBayISAPI.dll?ViewFeedback2&ftab=AllFeedback&userid=" + userFeedbackId);
  }

  // Additional nav buttons
  addLink("Leave Feedback", "https://www.ebay.com/fdbk/leave_feedback");
  addLink("Account Settings", "https://my.ebay.com/ws/eBayISAPI.dll?MyEbay&CurrentPage=MyeBayMyAccounts&ssPageName=STRK:ME:MAX");

  // Hide ads
  document.getElementById("gh-p-4").style.display = "none";
  document.getElementById("gh-p-1").style.display = "none";
  document.getElementById("gh-p-3").style.display = "none";

  window.onload = function () {
    // Remove ads
    tryRemove(document.getElementById("gh-ti"));
    tryRemove(document.getElementsByClassName("topRtm")[0]);
    tryRemove(document.getElementsByClassName("hl-leaderboard-ad")[0]);
    tryRemove(document.getElementsByClassName("leaderboard_ad"));
    tryRemove(document.getElementById("myEbayBody"));
    tryRemove(document.getElementsByClassName("vi-lb-placeholder"));
    tryRemove(document.querySelector(".srp-1p__link"));
  };

  // Notify if searching US only
  if (window.location.toString().includes("LH_PrefLoc=1")) {
    addTopBar("Showing items from USA");
  }

  // Notify if searching sold items
  if (window.location.toString().includes("LH_Sold=1")) {
    addTopBar("Showing Sold + Completed Items");
  }
})();
