// ==UserScript==
// @name        Better GoComics.com
// @namespace   https://greasyfork.org/en/users/324881-tehhund
// @version     12
// @description Remove a bunch of cruft from GoComics.com, and add a link to the raw comic image
// @author      Tehhund
// @match       *://gocomics.com/*
// @match       *://*.gocomics.com/*
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/403998/Better%20GoComicscom.user.js
// @updateURL https://update.greasyfork.org/scripts/403998/Better%20GoComicscom.meta.js
// ==/UserScript==

const linkToRawComic = () => {
  let button = [...document.getElementsByTagName("a")].filter((tag) => {
    return (tag.innerText.includes("Random"));
  })[0].cloneNode(true);
  //button.href = images[0].src;
  button.innerText = "Direct link to comic";
  button.id = "linkToRawComic";
  button.onclick = getHref;
  button.style.marginBottom = "0.2rem";
  let wrapperDiv = document.createElement("div");
  wrapperDiv.appendChild(button);
  //document.getElementsByClassName("gc-calendar-nav__next")[0].appendChild(button);
  //document.getElementsByClassName("gc-calendar-nav__select")[0].appendChild(button);
  document.getElementsByClassName("gc-calendar-nav")[0].prepend(wrapperDiv);
};
document.addEventListener("load", linkToRawComic);

const getHref = () => {
  let images = [...document.getElementsByTagName("img")];
  images = images.filter((image) => {
    return (image.className.includes("img-fluid") && image.className.includes("lazyloaded")) && !image.className.includes("lazyautosizes");
  });
  let button = document.getElementById("linkToRawComic");
  button.href = images[0].src;
}

const removeElements = () => {
  try { document.getElementsByClassName('gc-site-header')[0].remove(); } catch (e) { }
  try { document.getElementById('leaderboard_feature_item').remove(); } catch (e) { }
  try { document.getElementsByClassName('gc-feature-header')[0].remove(); } catch (e) { }
  try { document.getElementsByClassName('gc-page-container')[0].style.marginTop = '0'; } catch (e) { }
  try { document.getElementsByClassName('mt-5')[0].remove(); } catch (e) { }
  try { document.getElementsByClassName('nav')[0].remove(); } catch (e) { }
  try { document.getElementsByClassName('col-12')[0].remove(); } catch (e) { }
  try { document.getElementsByClassName('comic__buy-button')[0].remove(); } catch (e) { }
  try { linkToRawComic(); } catch (e) { }
};
document.addEventListener("load", removeElements);

setTimeout(removeElements,0);