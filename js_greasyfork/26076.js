// ==UserScript==
// @name        WordPress.com Stats Sparkline
// @namespace   tpenguinltg
// @description Adds a stats sparkline to the WordPress.com admin bar
// @include     https://*.wordpress.com/*
// @version     1.3.0
// @homepageURL https://greasyfork.org/en/scripts/26076-wordpress-com-stats-sparkline
// @homepageURL https://github.com/tpenguinltg/wpcom-stats-sparkline
// @grant       none
// @license     MPLv2.0; http://mozilla.org/MPL/2.0/
// @copyright   2016-2025, tPenguinLTG (http://tpenguinltg.wordpress.com/)
// @downloadURL https://update.greasyfork.org/scripts/26076/WordPresscom%20Stats%20Sparkline.user.js
// @updateURL https://update.greasyfork.org/scripts/26076/WordPresscom%20Stats%20Sparkline.meta.js
// ==/UserScript==

// Function by dystroy. From http://stackoverflow.com/a/14388512
function fetchJSONFile(path, callback, fallback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        if (callback) callback(JSON.parse(httpRequest.responseText));
      } else if (fallback) {
        fallback();
      }
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}

function addSparkline(src, statsUrl) {
  var sparklineImage = document.createElement("img");
  sparklineImage.src = src;
  sparklineImage.alt = "Stats";
  sparklineImage.title = "Showing site views per hour for the last 48 hours. Click for full Site Stats.";
  sparklineImage.style.paddingTop = "4px";
  sparklineImage.style.paddingBottom = "4px";

  var statsLink = document.createElement("a");
  statsLink.appendChild(sparklineImage);
  statsLink.href = statsUrl;
  statsLink.className = "ab-item";

  var menuItem = document.createElement("li");
  menuItem.appendChild(statsLink);

  document.getElementById("wp-admin-bar-root-default").appendChild(menuItem);
}

window.onload = function() {
  var siteNameAnchor = document.querySelector("#wp-admin-bar-site-name a.ab-item");
  if (!siteNameAnchor) {
    console.warn("wpcom-stats-sparkline: Could not get site name anchor. Aborting");
    return;
  }

  var statsMenuItem = document.querySelector("#toplevel_page_stats a");
  var statsUrl = statsMenuItem ? statsMenuItem.href : siteNameAnchor.href.replace("/home/", "/stats/");
  if (!statsUrl) {
    console.warn("wpcom-stats-sparkline: Could not get stats URL. Aborting");
    return;
  }

  var blogDomain = siteNameAnchor.href.replace(/\/+$/, "").split("/").pop();

  // target:  https://example.wordpress.com/wp-includes/charts/admin-bar-hours-scale.php
  var sparklineImageSrc = "//" + blogDomain + "/wp-includes/charts/admin-bar-hours-scale.php";
  addSparkline(sparklineImageSrc, statsUrl);
}
