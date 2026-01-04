// ==UserScript==
// @name        Add Download Link on zhelper v4 search page
// @description		在zhelper v4的搜索页面添加 download 点击就下载 这又又是chatgpt写的  哈哈哈
// @namespace   https://download.v4.zhelper.net/download/
// @include     https://download.v4.zhelper.net/download/*
// @match  *.zhelper.net/search/*
// @version     1
// @grant       none 
// @author			chatgpt
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456260/Add%20Download%20Link%20on%20zhelper%20v4%20search%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/456260/Add%20Download%20Link%20on%20zhelper%20v4%20search%20page.meta.js
// ==/UserScript==

// Find all elements with the "list-group-item" class
var items = document.getElementsByClassName("list-group-item");

// Loop through each item
for (var i = 0; i < items.length; i++) {
  var item = items[i];

  // Use a regular expression to capture the part of the URL that follows "/download/"
  var match = item.href.match(/\/download\/(.*)/);

  // Check if the regular expression matched the URL
  if (match && match.length > 1) {
    // The part of the URL that follows "/download/" is the first capture group (index 1)
    var downloadUrl = match[1];

    // Create a new link element
    var link = document.createElement("a");
    link.innerText = "download";
    link.href = "https://test2.zlib.download/download/" + downloadUrl;
    link.className = "download-link";

    // Add the link to the page
    item.appendChild(link);
  }
}
