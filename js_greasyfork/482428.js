// ==UserScript==
// @name         BOSS - bookmark.os saver script
// @namespace    <https://github.com/lundeen-bryan>
// @version      1.1.1
// @description  Adds a shortcut to bookmark the current page with bookmark.os <https://bookmarkos.com/help/basics>. CTRL + ALT + ']' opens a pop-up to bookmark the current page, CTRL + ALT + '[' shows all bookmarks in a new tab.
// @author       lundeen-bryan
// @match        *://*/*
// @icon         https://bookmarkos.com//favicon-32x32.png
// @license      GPL
// @run-at       'document-end'
// @noframes     true
// @downloadURL https://update.greasyfork.org/scripts/482428/BOSS%20-%20bookmarkos%20saver%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/482428/BOSS%20-%20bookmarkos%20saver%20script.meta.js
// ==/UserScript==

/**
 * This function extracts meta information from the current webpage and opens a new window
 * with a URL that includes this meta information as parameters for bookmarking purposes.
 */
function bookmarkPage() {
  // Get all meta elements on the current page
  var metas = document.getElementsByTagName("meta");
  var metaInfo = {};
  var metaDescription = null;
  var ogDescription = null;
  var twitterDescription = null;
  var ogType = null;
  var metaKeywords = null;

  // Loop through the meta elements to find specific meta information
  for (var i = 0; i < metas.length; i++) {
    // Get the current meta element in the loop
    var meta = metas[i];

    // Check if the 'name' attribute of the meta element is 'description'
    if (meta.getAttribute("name") == "description") {
      // If it is, assign the value of the 'content' attribute to 'metaDescription'
      metaDescription = metas[i].getAttribute("content");
    }
    // Check if the 'property' attribute of the meta element is 'og:description'
    else if (meta.getAttribute("property") == "og:description") {
      // If it is, assign the value of the 'content' attribute to 'ogDescription'
      ogDescription = metas[i].getAttribute("content");
    }
    // Check if the 'name' attribute of the meta element is 'twitter:description'
    else if (meta.getAttribute("name") == "twitter:description") {
      // If it is, assign the value of the 'content' attribute to 'twitterDescription'
      twitterDescription = metas[i].getAttribute("content");
    }
    // Check if the 'property' attribute of the meta element is 'og:type'
    else if (meta.getAttribute("property") == "og:type") {
      // If it is, assign the value of the 'content' attribute to 'ogType'
      ogType = metas[i].getAttribute("content");
    }
    // Check if the 'name' attribute of the meta element is 'keywords'
    else if (meta.getAttribute("name") == "keywords") {
      // If it is, assign the value of the 'content' attribute to 'metaKeywords'
      metaKeywords = metas[i].getAttribute("content");
    }
  }

  // Store the extracted meta information in an object
  metaInfo["meta_description"] =
    metaDescription || ogDescription || twitterDescription;
  metaInfo["meta_keywords"] = metaKeywords;
  metaInfo["og_type"] = ogType;

  // Calculate the window position for the new window, center the modal window on active screen
  var dualScreenLeft =
    window.screenLeft != undefined ? window.screenLeft : screen.left;
  var dualScreenTop =
    window.screenTop != undefined ? window.screenTop : screen.top;
  width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width;
  height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height;

  var left = width / 2 - 750 / 2 + dualScreenLeft;
  var top = height / 2 - 450 / 2 + dualScreenTop;

  // Open a new window with the bookmarking URL and meta information as parameters
  window.open(
    "https://bookmarkos.com/save?url=" +
      encodeURIComponent(location.href) +
      "&title=" +
      encodeURIComponent(document.title) +
      "&meta_description=" +
      encodeURIComponent(metaInfo["meta_description"]) +
      "&meta_keywords=" +
      encodeURIComponent(metaInfo["meta_keywords"]) +
      "&og_type=" +
      encodeURIComponent(metaInfo["og_type"]),
    "bookmark",
    "left=" +
      left +
      ",top=100,width=750,height=450,toolbar=0,location=0,resizable=0"
  );
}

function gotoBm() {
  // Shows bookmarks sorted by time, insted of the senseless sort by title default
  window.open("https://bookmarkos.com/access_extension");
}

function keyPressEvent(event) {
  var kcode = event.keyCode ? event.keyCode : event.which;
  if (event.ctrlKey && event.altKey) {
    if (kcode == 221) bookmarkPage(); // ']'
    if (kcode == 219) gotoBm(); // '['
  }
}

document.addEventListener('keydown', keyPressEvent, true);

// Call the bookmarkPage function to initiate the bookmarking process
// bookmarkPage();
