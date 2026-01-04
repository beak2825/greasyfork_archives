// ==UserScript==
// @name         Tinder AutoLiker // 80% yes / 20% no (customizable)
// @namespace    http://tampermonkey.net/
// @grant        none
// @version      0.3
// @description  Auto liker for Tinder - 80% likes 20% dislikes in random interval between 1 and 4 seconds
// @author       Codestormer
// @match        https://tinder.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466282/Tinder%20AutoLiker%20%2080%25%20yes%20%2020%25%20no%20%28customizable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466282/Tinder%20AutoLiker%20%2080%25%20yes%20%2020%25%20no%20%28customizable%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var liking = false;
  var likingInterval;

  // Function to generate a random delay (1-4 seconds)
  function getRandomDelay() {
    return Math.floor(Math.random() * 4000) + 1000; // 1-4 seconds in milliseconds
  }

  // Function to randomly decide to like or dislike (80% chance to like, 20% to dislike)
  function likeOrDislike() {
    var buttons = document.querySelectorAll("button");
    var likeButton, dislikeButton;

    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      if (button.type === "button") {
        if (button.className.includes("Bgi($g-ds-background-like):a")) {
          likeButton = button;
        } else if (button.className.includes("Bgi($g-ds-background-nope):a")) {
          dislikeButton = button;
        }
      }
    }

    if (Math.random() < 0.8) {
      // 80% chance to like
      likeButton.click();
      console.log("like " + getRandomDelay() + "ms");
    } else {
      // 20% chance to dislike
      dislikeButton.click();
      console.log("dislike " + getRandomDelay() + "ms");
    }
  }

  // Function to control the auto liking process
  function controlLiking() {
    if (liking) {
      // If already liking, stop
      clearInterval(likingInterval);
      liking = false;
      this.textContent = "♥ START";
    } else {
      // Start the process
      likingInterval = setInterval(likeOrDislike, getRandomDelay());
      liking = true;
      this.textContent = "♥ STOP";
    }
  }

  var controlButton = document.createElement("button");
  controlButton.textContent = "♥ START";
  controlButton.style.position = "fixed";
  controlButton.style.top = "15px";
  controlButton.style.right = "15px";
  controlButton.style.zIndex = "9999";
  controlButton.style.background = "#FD3A73";
  controlButton.style.borderRadius = "5px";
  controlButton.style.fontWeight = "700";
  controlButton.style.color = "white";
  controlButton.style.padding = "15px 46px";
  controlButton.style.cursor = "pointer";

  // Add hover state
  controlButton.style.transition = "background-color 0.3s";
  controlButton.addEventListener("mouseover", function () {
    controlButton.style.backgroundColor = darkenColor("#FD3A73", 0.1); // Adjust the darkness level here
  });
  controlButton.addEventListener("mouseout", function () {
    controlButton.style.backgroundColor = "#FD3A73";
  });

  controlButton.addEventListener("click", controlLiking);

  // Helper function to darken the color
  function darkenColor(color, amount) {
    // Convert the color to RGB
    var rgb = parseInt(color.slice(1), 16);
    var r = (rgb >> 16) & 0xff;
    var g = (rgb >> 8) & 0xff;
    var b = rgb & 0xff;

    // Darken the color by the specified amount
    r = Math.round(r * (1 - amount));
    g = Math.round(g * (1 - amount));
    b = Math.round(b * (1 - amount));

    // Convert the RGB values back to hexadecimal
    var darkenedColor =
      "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
    return darkenedColor;
  }

  // Append the button to the document or a container element
  document.body.appendChild(controlButton);
})();