// ==UserScript==
// @name               Save Amazon Music playlist as JSON file
// @name:fr            Save Amazon Music playlist as JSON file
// @name:de            Save Amazon Music playlist as JSON file
// @name:it            Save Amazon Music playlist as JSON file
// @name:es            Save Amazon Music playlist as JSON file
// @name:ja            Save Amazon Music playlist as JSON file
// @name:pt-BR         Save Amazon Music playlist as JSON file
// @namespace          https://github.com/projecteurlumiere/save-amazon-music-playlist
// @version            2024-05-15
// @description        This script adds an export button at Amazon Music playlist pages
// @description:fr     This script adds an export button at Amazon Music playlist pages
// @description:de     This script adds an export button at Amazon Music playlist pages
// @description:it     This script adds an export button at Amazon Music playlist pages
// @description:es     This script adds an export button at Amazon Music playlist pages
// @description:ja     This script adds an export button at Amazon Music playlist pages
// @description:pt-BR  This script adds an export button at Amazon Music playlist pages
// @author             projecteurlumiere
// @match              https://music.amazon.com/*
// @match              https://music.amazon.co.uk/*
// @match              https://music.amazon.fr/*
// @match              https://music.amazon.de/*
// @match              https://music.amazon.it/*
// @match              https://music.amazon.es/*
// @match              https://music.amazon.co.jp/*
// @match              https://music.amazon.ca/*
// @match              https://music.amazon.com.au/*
// @match              https://music.amazon.com.mx/*
// @match              https://music.amazon.com.br/*
// @match              https://music.amazon.in/*
// @grant              none
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/495047/Save%20Amazon%20Music%20playlist%20as%20JSON%20file.user.js
// @updateURL https://update.greasyfork.org/scripts/495047/Save%20Amazon%20Music%20playlist%20as%20JSON%20file.meta.js
// ==/UserScript==

(function() {
  'use strict';

  whenPlaylistAvailable("music-container music-image-row").then(() => { insertButtons(); })

  async function whenPlaylistAvailable(selector) {
    while (document.querySelectorAll(selector).length === 0) {
      console.log("waiting for playlist");
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  function insertButtons() {
    console.log("inserting buttons");

    document.querySelector("body").insertAdjacentHTML('beforeend', `
      <style>
        #download-playlist-via-script {
          position: fixed !important; 
          left: 45%; top: 75px;
        }

        #download-playlist-via-script button {
          padding: 15px 30px;
          background-color: rgb(168, 237, 240);
        }
      </style>
      <div id="download-playlist-via-script">
        <button>Download playlist</button>
        <button>Scroll ↓</button>
        <button>Scroll ↑</button>
      </div>
    `.trim()
    )

    const firstButton = "#download-playlist-via-script button:nth-child(1)"
    const secondButton = "#download-playlist-via-script button:nth-child(2)"
    const thirdButton = "#download-playlist-via-script button:nth-child(3)"

    document.querySelector(firstButton).addEventListener("click", () => {
      try {
        getPlaylist()
      }
      catch {
        if (window.location.href.includes("playlist")) {
          alert("Error! Perhaps, your viewport is not wide enough: " +
          "try to maximize your window and make sure album names are positioned next to song durations, and not below song titles")
        }
        else {
          alert("Error! Make sure you're on the playlist page you want to export (albums are not supported)");
        }
      }
    })

    document.querySelector(secondButton).addEventListener("click", () => {
      window.scrollTo(0, document.body.scrollHeight);
    })

   document.querySelector(thirdButton).addEventListener("click", () => {
      window.scrollTo(0, 0);
    })
  }

  function getPlaylist() {
    const entries =
      Array.from(document.querySelectorAll("music-container music-image-row"));

    let playlist = [];
    let n_total = 0;

    entries.forEach((e) => {
      playlist.push({
        index: parseInt(e.querySelector(".index").innerText),
        title: e.querySelector(".col1 > music-link").title,
        artist: e.querySelector(".col2 > music-link").title,
        album: e.querySelector(".col3 > music-link").title,
        duration: e.querySelector(".col4 > music-link").title
      })
      n_total += 1
    })

    const n_first = playlist[0].index
    const n_last = playlist[playlist.length - 1].index

    let pretty_json = JSON.stringify(playlist, null, 2);
    download(pretty_json, "application/json", composeName(n_first, n_last, n_total));
  }

  function download(content, mimeType, filename) {
    const a = document.createElement('a') // Create "a" element
    const blob = new Blob([content], {type: mimeType}) // Create a blob (file-like object)
    const url = URL.createObjectURL(blob) // Create an object URL from blob
    a.setAttribute('href', url) // Set "a" element link
    a.setAttribute('download', filename) // Set download filename
    a.click() // Start downloading
    a.remove()
  }

  function composeName(n_first, n_last, n_total) {
    const header = document.querySelector("music-detail-header[label]").shadowRoot;
    const playlistType =
          capitalize(header.querySelector(".label").innerText.toLowerCase());
    const playlistTitle =
          header.querySelector("[title]").innerText

    if (n_first != 1) { 
      alert("The first song(s) has/have not been exported. Try to scroll to the top of the page and retry exporting" +
        "(this way the song(s) on the top of the page should become visible for exporting)")
    }

    if (n_last % 500 === 0) {
      alert("Your playlist may be incomplete: scroll to the bottom of the page until you get the entire playlist")
    }

    return `${playlistType} - ${playlistTitle} - ${n_total} song(s) in total - from ${n_first} to ${n_last}`
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
})();