// ==UserScript==
// @name         BooruBear
// @namespace    https://greasyfork.org/scripts/456125-boorubear/code/BooruBear.user.js
// @version      0.6
// @description  Gathers tags from a few boorus
// @author       @Archgoddess_gd
// @match        https://danbooru.donmai.us/*
// @match        https://gelbooru.com/*
// @match        https://rule34.xxx/*
// @match        https://censored.booru.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456125/BooruBear.user.js
// @updateURL https://update.greasyfork.org/scripts/456125/BooruBear.meta.js
// ==/UserScript==

// Create the button and textarea elements
var button = document.createElement("button");
var textarea = document.createElement("textarea");
var closeButton = document.createElement("button");

button.innerHTML = "Extract Tags";
button.style.position = "fixed";
button.style.bottom = "0";
button.style.right = "0";
button.style.backgroundColor = "black";
button.style.color = "white";

textarea.style.position = "fixed";
textarea.style.bottom = "0";
textarea.style.right = "0";
textarea.style.width = "400px";
textarea.style.height = "200px";
textarea.style.backgroundColor = "black";
textarea.style.color = "white";
textarea.style.display = "none";

closeButton.innerHTML = "Close";
closeButton.style.position = "fixed";
closeButton.style.bottom = "210px";
closeButton.style.right = "0";
closeButton.style.backgroundColor = "black";
closeButton.style.color = "white";
closeButton.style.display = "none";

// Add the button and textarea to the page
document.body.appendChild(button);
document.body.appendChild(textarea);
document.body.appendChild(closeButton);

// Add a click event listener to the button
button.addEventListener("click", function() {
  // Find all instances of "tags=" in the page
  var matches = document.body.innerHTML.match(/tags=([^&"]+)/g);

  if (matches) {
    // For each match, extract the text after the "=" and before the next " or &
    for (var i = 0; i < matches.length; i++) {
      var tag = matches[i].split("=")[1];

      // Replace "%3A" with ":", "%28" with "(", and "%29" with ")"
      tag = tag.replace(/%3A/g, ":").replace(/%28/g, "(").replace(/%29/g, ")").replace(/%27/g, "'").replace(/%21/g, "!").replace(/%3F/g, "?").replace(/%2B/g, "+");

      // Exclude instances of "all" and tags that include "user:", "date:", or "status:"
      if (tag.toLowerCase() !== "all" && !tag.toLowerCase().includes("user:") && !tag.toLowerCase().includes("date:") && !tag.toLowerCase().includes("status:") && !tag.toLowerCase().includes("order:") && !tag.toLowerCase().includes("my_tags") && !tag.toLowerCase().includes("parent:") && !tag.toLowerCase().includes("+")) {
        // Append the tag to the textarea
        textarea.value += tag + " ";
      }
    }
  }

  // Show the textarea and close button
  textarea.style.display = "block";
  closeButton.style.display = "block";
});

// Add a click event listener to the close button
closeButton.addEventListener("click", function() {
  // Hide the textarea and close button
  textarea.style.display = "none";
  closeButton.style.display = "none";
});