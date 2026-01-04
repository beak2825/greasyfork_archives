// ==UserScript==
// @name        IB Optimizations
// @namespace   r_m3.scripts.ib_optimizations
// @match       https://inkbunny.net/*
// @grant       none
// @version     1.0
// @author      r_m3
// @description 9/24/2024, 6:23:47 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510048/IB%20Optimizations.user.js
// @updateURL https://update.greasyfork.org/scripts/510048/IB%20Optimizations.meta.js
// ==/UserScript==
var locationPath = window.location.pathname;

// Commission ID if we're on /s/ (submission page)
var commissionId = locationPath.slice(3);

var onSubmissionPage = locationPath.startsWith("/s/");
var endsWithPhp = locationPath.endsWith(".php");
var onGalleryPage = locationPath.startsWith("/gallery/");

/**
 * Intercept XML requests
 */

if (!XMLHttpRequest.nativeOpen) {
  XMLHttpRequest.prototype.nativeOpen = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.customOpen = function (
    method,
    url,
    async,
    user,
    password
  ) {
    console.info(method, url, async);

    // Ignore subsequent background.php requests.
    // This sends your resolution if you change your window.
    // Useless and might contribute to rate limiting.
    if (url.startsWith("/background.php")) {
      return;
    }

    //call original
    return this.nativeOpen(method, url, async, user, password);
  };

  //ensure all XMLHttpRequests use our custom open method
  XMLHttpRequest.prototype.open = XMLHttpRequest.prototype.customOpen;
}

/**
 * Fav + Recommendations
 */
if (onSubmissionPage) {
  // Recommendation box (hidden by default)
  var recommendationsBox = document.getElementById("recommendationsbox");

  // Elephant elements are sections on IB. `elephant_555753` means a dark gray bg section
  var favElephantElements = document.getElementsByClassName("elephant_555753");
  // Finds all <div class="content" /> elements inside all elephant_555753 elements
  // Returns the first content class div
  var favContentElements = Array.from(favElephantElements).flatMap(
    (element) => {
      return element.getElementsByClassName("content")[0];
    }
  );
  // Find the one that we need (the fav bar) by inline style matching
  var favContentElement = favContentElements.find((element) => {
    return (
      element &&
      element.style &&
      element.style.paddingTop === "10px" &&
      element.style.paddingBottom === "10px" &&
      element.style.fontSize === "9pt"
    );
  });
  // Remove padding right of content to make the new button fit
  // favContentElement?.style.setProperty("padding-right", "0px");
  // Inside the fav bar is a table. Get the 5th td (which houses the group "Gallery" and "Private Message" buttons)
  var favTdElement = favContentElement?.getElementsByTagName("td")[4];
  // Adjust width of the td element to span more of the content banner
  favTdElement?.style.setProperty("width", "318px");
  // Inside that is a div to group those buttons, this is FINALLY the element we need
  var favDivElement = favTdElement?.getElementsByTagName("div")[0];
  // Align the fav bar to the right instead of weirdly centered
  favDivElement?.style.setProperty("text-align", "end");

  // Make padding consistent between spans
  Array.from(favDivElement?.getElementsByTagName("span") || []).map((span) => {
    span.style.paddingLeft = "15px";
  });

  // Save the original favProcess function (fav.rev01.js)
  favProcessNative = favProcess;

  function favProcessNew(mode, submission_id, show_recommendations) {
    // Call the original favProcess function, show_recommendations is always 0 (don't show recommendations)
    favProcessNative(mode, submission_id, 0);
  }
  // Overrides IB's favProcess function so IB will call our new function instead
  favProcess = favProcessNew;

  // Code copied from IB's fav.rev01.js (favProcess function)
  function openRecommend(submission_id) {
    Effect.BlindDown("recommendationsbox");
    Effect.Pulsate("loadingrecommendations", { pulses: 10, duration: 10 });
    // Calls IB's recommendations loader (recommendations.js)
    recommendationsProcess(submission_id);
  }

  // Add a "Recommendations" button to the fav bar
  const fragment = document.createDocumentFragment();
  // Create a span to add padding to the left of the button
  const span = fragment.appendChild(document.createElement("span"));
  span.style.paddingLeft = "15px";
  // The actual button
  const a = span.appendChild(document.createElement("a"));
  a.textContent = "More like this";
  a.style.borderColor = "#999999";
  a.style.color = "#ffffff";
  a.style.cursor = "pointer";
  a.onclick = function () {
    // If the recommendations box is already open, don't open it again
    if (recommendationsBox?.style.display !== "none") {
      return;
    }
    // call autosuggest button function
    openRecommend(commissionId);
  };
  favDivElement?.appendChild(fragment);
}

/**
 * Watch + Suggested Members
 */
if (!onSubmissionPage && !endsWithPhp) {
  // Suggested members box (hidden by default)
  var suggestedmembersbox = document.getElementById("suggestedmembersbox");

  // Get the user id
  var iBScriptUserId = document
    .querySelector("[user_id]")
    .getAttribute("user_id");

  // Save the original watchProcess function (widgets/watch.js)
  watchProcessNative = watchProcess;

  function watchProcessNew(
    watched_user_id,
    IBmode,
    IBtoken,
    showrecommendations
  ) {
    console.log("userId", watched_user_id);
    // Call the original watchProcess function, show_recommendations is always 0 (don't show recommendations)
    watchProcessNative(watched_user_id, IBmode, IBtoken, 0);
  }
  // Overrides IB's watchProcess function so IB will call our new function instead
  watchProcess = watchProcessNew;

  // Code copied from IB's widgets/watch.js (watchProcess function)
  function openSuggestedMembers(watched_user_id) {
    Effect.BlindDown("suggestedmembersbox");
    Effect.Pulsate("loadingsuggestedmembers", { pulses: 10, duration: 10 });
    // Calls IB's suggested members loader (suggestedmembers.js)
    suggestedmembersProcess(watched_user_id);
  }

  function onSuggestedClick() {
    // If the recommendations box is already open, don't open it again
    if (suggestedmembersbox?.style.display !== "none") {
      return;
    }
    // call autosuggest button function
    openSuggestedMembers(iBScriptUserId);
  }

  if (onGalleryPage) {
    var watchGeneralBlockElement = document.getElementById(
      "watch_general_block"
    );
    var watchGroupElement = watchGeneralBlockElement?.parentElement;
    watchGroupElement?.style.setProperty("margin-right", "40px");

    // Get the User box wrapper element
    var userBoxElements = document.getElementsByTagName("td");
    // Find the one that we need by inline style matching
    var userBoxElement = Array.from(userBoxElements).find((element) => {
      return element && element.style && element.style.width === "453px";
    });
    userBoxElement?.style.setProperty("width", "500px");

    // And shrink the pagination box next to the User box
    var paginationBoxElements = document.getElementsByTagName("td");
    // Find the one that we need by inline style matching
    var paginationBoxElement = Array.from(paginationBoxElements).find(
      (element) => {
        return element && element.style && element.style.width === "295px";
      }
    );
    paginationBoxElement?.style.setProperty("width", "270px");
    paginationBoxElement?.style.setProperty("padding-left", "0px");

    // Add a "Suggested Members" button to the header
    const fragment = document.createDocumentFragment();
    // Create a span to add padding to the left of the button
    const span = fragment.appendChild(document.createElement("span"));
    span.style.paddingLeft = "10px";
    // The actual button
    const a = span.appendChild(document.createElement("a"));
    a.textContent = "More like this";
    a.style.borderColor = "#999999";
    a.style.color = "#ffffff";
    a.style.cursor = "pointer";
    a.onclick = onSuggestedClick;
    watchGroupElement?.appendChild(fragment);
  } else {
    var banAddFormElement = document.getElementById("ban_add_form");
    var banBlockGroupElement = banAddFormElement?.parentElement?.parentElement;

    // Add a "Suggested Members" button to the header
    const fragment = document.createDocumentFragment();
    // Create a div
    const div = fragment.appendChild(document.createElement("div"));
    div.style.marginTop = "10px";
    // The actual button
    const btnDiv = div.appendChild(document.createElement("div"));
    const a = btnDiv.appendChild(document.createElement("a"));
    a.textContent = "More like this";
    a.style.borderColor = "#999999";
    a.style.color = "#ffffff";
    a.style.cursor = "pointer";
    a.onclick = onSuggestedClick;
    const descDiv = div.appendChild(document.createElement("div"));
    descDiv.style.margin = "2px 0px";
    descDiv.style.fontSize = "8pt";
    descDiv.style.color = "#babdb6";
    descDiv.textContent = "Show related profiles";
    banBlockGroupElement?.appendChild(fragment);
  }
}
