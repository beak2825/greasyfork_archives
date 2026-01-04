// ==UserScript==
//

// @name         Better XDA
// @version      1.0
// @run-at       document-end
// @license      LGPLv3
// @homepage localhost
// @description  Hide bullshit articles on xda-dev home page.
// @match       https://www.xda-developers.com/*
// @icon https://www.xda-developers.com/public/build/images/favicon-48x48.8f822f21.png
// @author       Bahha
// @namespace https://greasyfork.org/users/186498
// @downloadURL https://update.greasyfork.org/scripts/457527/Better%20XDA.user.js
// @updateURL https://update.greasyfork.org/scripts/457527/Better%20XDA.meta.js
// ==/UserScript==

//wait for page to load
const delay = ms => new Promise(res => setTimeout(res, ms));

// specify authors to remove
var removedAuthors = ["Mahmoud Itani", "Adam Conway", "Timi Cantisano", "Rich Woods","João Carrasqueira"]; //add your authors here

// get list of authors.
const waitAndGetData = async () => {

  //trigger infinitescroll, because it doesn't work when aritcles are removed the first time. taken from xda js file.
  (r = document.getElementById("home-waypoint")) &&
          null != window.infiniteScrollUrl &&
          null != window.infiniteScrollMax &&
          null != window.infiniteScrollArticlesRequested &&
          (console.log("home infinite scroll"),
          new LatestBrowseClip({
            ajaxUrl: window.infiniteScrollUrl,
            waypointElement: r,
            divSection: document.getElementsByClassName(
              window.infiniteScrollDivSectionClass
            )[0],
            totalNumClips: window.infiniteScrollMax,
            numClipsRequested: window.infiniteScrollArticlesRequested,
            animLoadinId: "infinite-loader",
            archivePath: window.infiniteScrollArchivePathUrl,
            excludedIds: window.infiniteScrollExcludedIds,
            divClassName: window.infiniteScrollListingClass,
            showMoreButton: !0,
          }).wayPointTrigger());

  //wait 2 sec for page to load
  await delay(2000);
  // get athors
  var authors = document.getElementsByClassName("bc-author");
  // counter for removed articles
  var removed = 0 ;
  // cycle through authors and remove matched ones or rather hide them, you can use remove() instead of display:none
  for(var i = 0 ; i < authors.length ; i++){

    // check for an author match
    if(removedAuthors.includes(authors[i].text)){
        //console.log(authors[i].text);
        // hide articles
        authors[i].closest("article").style.display = "none";
        console.log(authors[i].text + " " +i + " removed");
        removed++;
    }
  }

  console.log("removed " + removed);
};


// throtlle sroll event for performance
var throttleTimer;

const throttle = (callback, time) => {

  if (throttleTimer) return;

  throttleTimer = true;

  setTimeout(() => {

    callback();

    throttleTimer = false;

  }, time);

};

// re-run code on scroll
const handleInfiniteScroll = () => {

  throttle(() => {

      console.log("you scrolled")
      waitAndGetData();

    // wait for 6 seconds. change it to your preference.
  },6000);

};
//call function when page loads the first time
waitAndGetData();
// call function on scroll event detection.
window.addEventListener("scroll", handleInfiniteScroll);