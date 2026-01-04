// ==UserScript==
// @name         AnimeUnity fillers highlighter
// @namespace    http://tampermonkey.net/
// @version      2025-01-04
// @description  highlight filler episodes
// @author       bvuno
// @match        https://www.animeunity.so/anime/743-detective-conan*
// @icon         https://x-bv.uno/public/icon.svg
// @run-at       document-end
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @license      https://creativecommons.org/licenses/by-nc/4.0/
// @downloadURL https://update.greasyfork.org/scripts/522744/AnimeUnity%20fillers%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/522744/AnimeUnity%20fillers%20highlighter.meta.js
// ==/UserScript==

/*
  Copyright (c) 2025 Bruno Cerra (https://x-bv.uno)
  This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
  You may not use this work for commercial purposes.
  https://creativecommons.org/licenses/by-nc/4.0/
*/

(function() {
    'use strict';

    GM_addStyle(`
        .episode.episode-item:has(.filler) {
            background-color: #8D2831;
        }

        .episode.episode-item.seen:has(.filler) {
            background-color: #FF057D;
        }


        .episode.episode-item.active:has(.filler) {
            background-color: #FF0000 !important;
        }

        .episode.episode-item:has(.mixed) {
            background-color: #65410B;
        }

        .episode.episode-item.seen:has(.mixed) {
            background-color: #FFD21E;
        }


        .episode.episode-item.active:has(.mixed) {
            background-color: #FF9C00 !important;
        }

    `);


     const FILLER_LIST_URL = "https://www.animefillerlist.com/shows/detective-conan"

     function from_div_to_list(elem) {
         let result = []
         for (const a of elem.querySelectorAll("a")) {
             const text = a.innerText
             if (text.includes("-")) {
                  const [start, end] = text.split("-").map(Number);
                  for (let i = start; i <= end; i++) {
                      result.push(i);
                  }
              } else {
                  result.push(Number(text));
              }
         }
         return result
     }

    const filler_list = []
    const mixed_list = []

    function highlight_eps(){
        const ep_elems = document.querySelectorAll("#anime > div.content.container > div.overview > div:nth-child(2) > div > div > div.mt-4.mb-4.episode-wrapper.text-center > div")
        for (const ep_elem of ep_elems) {
            const ep_elem_a = ep_elem.querySelector("a")

            for (const css_class of ['filler', 'mixed']) {
                if (ep_elem_a.classList.contains(css_class)) {
                    ep_elem_a.classList.remove(css_class);
                }
            }

            const text = ep_elem_a.innerText
            if (text.includes('-')) {
                const eps = text.split("-").map(Number);
                if (eps.every(x => filler_list.includes(x))) {
                    ep_elem_a.classList.add("filler");
                }
                else if (eps.some(x => filler_list.includes(x))) {
                    ep_elem_a.classList.add("mixed");
                }
            } else {
                const ep = Number(text)
                if (filler_list.includes(ep)) {
                    ep_elem_a.classList.add("filler");
                }
                if (mixed_list.includes(ep)) {
                    ep_elem_a.classList.add("mixed");
                }
            }
        }
    }

    function handleChange() {
        const first_ep = document.querySelector("#anime > div.content.container > div.overview > div:nth-child(2) > div > div > div.mt-4.mb-4.episode-wrapper.text-center > div")
        const text = first_ep.querySelector("a").innerText
        function waitChange() {
            if (text == first_ep.querySelector("a").innerText) {
                setTimeout(waitChange, 100)
            }
            else {
                highlight_eps()
            }
        }
        waitChange()
    }

     GM.xmlHttpRequest({
        method: "GET",
        url: FILLER_LIST_URL,
        onload: function(response) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            mixed_list.push(... from_div_to_list(doc.querySelector("#Condensed .mixed_canon\\/filler .Episodes")))
            filler_list.push(... from_div_to_list(doc.querySelector("#Condensed .filler .Episodes")))

            document.querySelector("#episode-nav").addEventListener('click', handleChange)
            setTimeout(highlight_eps, 100)
        }
    });
})();