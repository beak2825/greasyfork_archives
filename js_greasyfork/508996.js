// ==UserScript==
// @name        Idle Pixel Breeding Sort
// @namespace   finally.idle-pixel.breedingsort
// @match       https://idle-pixel.com/login/play/*
// @grant       none
// @version     1.0
// @author      finally
// @description Sorts animals by species and time alive
// @downloadURL https://update.greasyfork.org/scripts/508996/Idle%20Pixel%20Breeding%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/508996/Idle%20Pixel%20Breeding%20Sort.meta.js
// ==/UserScript==

let old = Breeding.refresh_animals_data;

Breeding.refresh_animals_data = (raw) => {
  let array = raw.split("=").map(v => v.split(","));
  array.sort((a, b) => {
    return Breeding.get_token_per_animal(a[1]) - Breeding.get_token_per_animal(b[1]) || a[4] - b[4];
  });

  return old(array.join("="));
};