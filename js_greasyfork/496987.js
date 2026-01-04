// ==UserScript==
// @name        Highlight stars by name
// @namespace   Violentmonkey Scripts
// @include     https://osrsportal.com/shooting-stars-tracker
// @grant       none
// @version     1.3
// @author      ur mom
// @description Adds an input field where you can write a star's name (or a regex pattern), it will then highlight every match and tell you how many matches there are. The script will also automatically sort, and keep sorted, the star list in descending size order.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496987/Highlight%20stars%20by%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/496987/Highlight%20stars%20by%20name.meta.js
// ==/UserScript==

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function highlight_stars(star_name_match) {
  let list_of_stars = document.querySelectorAll(".styleddtablebody > tr");
  let highlight_amount = 0;

  for (let star_row of list_of_stars) {
    let star_name = star_row.children[3].textContent.toLowerCase().trim();

    if (star_name.match(star_name_match)) {
      star_row.style = "background-color: #fd0";
      highlight_amount += 1;
    } else {
      star_row.style = "";
    }
  }

  highlight_counter.textContent = `Highlighted stars: ${highlight_amount}`;
}

function sort_and_search() {
  let size_column_header = document.querySelector("th.hoverable-headers:nth-child(3)");
  size_column_header.click();
  size_column_header.click();
  setTimeout(() => { highlight_stars(highlight_input.value); }, 500);
}

let highlight_input = document.createElement("input");
highlight_input.id = "highlight_input";
highlight_input.value = getCookie("highlighted_location") || "(varrock|champions)";
highlight_input.addEventListener("input", () => {
  let star_query = highlight_input.value;

  document.cookie = `highlighted_location=${star_query}`;
  if (star_query.trim() != "") {
    highlight_stars(star_query);
  }
});

let highlight_counter = document.createElement("p");
highlight_counter.id = "highlight_counter";
highlight_counter.style = "font-size: 14pt; font-weight: bold;";
highlight_counter.textContent = "Highlighted stars: 0";

let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
new MutationObserver((rec, obs) => {
  let star_table = document.querySelector(".styleddtablebody > tr");

  if (star_table) {
    let resort_cooldown_time = 5 * 1000;
    let refresh_cooldown_time = 10 * 60 * 1000;

    document.querySelector(".table-type").insertAdjacentElement("beforebegin", highlight_input);
    document.querySelector(".table-type").insertAdjacentElement("beforebegin", highlight_counter);

    sort_and_search();

    setInterval(() => { sort_and_search(); }, resort_cooldown_time);
    setInterval(() => { location.reload(); }, refresh_cooldown_time);

    obs.disconnect();
  }
}).observe(document.body, {childList: true, subtree: true});

