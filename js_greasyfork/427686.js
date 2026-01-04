// ==UserScript==
// @name        itch.io Bundle to Library
// @description This adds a handy button to a bundle to add all them gamez
// @namespace   ceremony.itchio.bundlelibrary
// @match       https://itch.io/bundle/download/*
// @grant       none
// @version     1.1
// @author      Ceremony
// @downloadURL https://update.greasyfork.org/scripts/427686/itchio%20Bundle%20to%20Library.user.js
// @updateURL https://update.greasyfork.org/scripts/427686/itchio%20Bundle%20to%20Library.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
let games = [];
document.querySelectorAll(".game_row form.form").forEach((form) => {
  let data = [];
  form.querySelectorAll("*[name]").forEach((el) => {
    data.push(encodeURIComponent(el.name) + "=" + encodeURIComponent(el.value));
  })
  games.push(data.join("&"));
});


async function postData(game) {
  const response = await fetch(window.location.href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'manual',
    body: game
  });

  next();
}

function next() {
  if (game = games.pop()) {
    button.textContent = "Adding " + (games.length + 1) + " game(s) to your library! Please wait!";
    postData(game);
  } else {
    button.textContent = "Added all games on this page!"
  }
}

var button = document.createElement("p");
button.style.fontWeight = "bold";

if (games.length) {
  button.addEventListener("click", () => {
    button.style.cursor = "";
    next();
  }, { once: true });
  button.textContent = "Found " + games.length + " game(s) not yet added to your library. Click here to add them!";
  button.style.cursor = "pointer";
} else {
  button.textContent = "No unclaimed games found! Try another page!"
}

document.querySelector(".game_outer").insertBefore(button, document.querySelector(".game_outer p:not([class])"))