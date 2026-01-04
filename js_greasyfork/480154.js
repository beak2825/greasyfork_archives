// ==UserScript==
// @name        Scryfall: yawgatog.com links
// @namespace   Violentmonkey Scripts
// @description This is a userscript.
// @match       https://scryfall.com/card/*
// @version     1.2.4
// @author      Bastian Hentschel
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/480154/Scryfall%3A%20yawgatogcom%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/480154/Scryfall%3A%20yawgatogcom%20links.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (document.body.querySelector("[class~='card-text-title']").lang === "en") {
    const id = document.head.querySelector("[name~='scryfall:card:id'][content]").content;
    fetch("https://mtg.bytecafe.de:10443/card/" + id).then(function (response) {
      return response.json();
    }).then(function (content) {
      replace_oracle(content.html.Valid);
    });
  }
  async function replace_oracle(content) {
    if (content !== undefined) {
      const fields = document.body.querySelectorAll("[class~='card-text-oracle']");
      for (let i = 0; i < fields.length; i += 1) {
        fields[i].innerHTML = content[i];
      }

      const spans = document.body.querySelectorAll("[class~='token-span']")
      for (let i = 0; i< spans.length; i += 1) {
        const span = spans[i]
        const text_span = span.querySelector("[class ~='hover-text']")
        span.onmouseenter = function () {
          text_span.style.display = "unset"
        }
        span.onmouseleave = function () {
          text_span.style.display = "none"
        }
        
        span.ontouchstart = function () {
          text_span.style.display = "unset"
        }
        span.ontouchend = function () {
          text_span.style.display = "none"
        }

      }
    }
  }
  let elem = document.createElement("link")
  elem.setAttribute("rel", "stylesheet")
  elem.setAttribute("href", "https://mtg.bytecafe.de:443/card_style.css")
  elem.setAttribute("type", "text/css")
  document.head.appendChild(elem)

})();
