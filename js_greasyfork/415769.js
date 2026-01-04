// ==UserScript==
// @name        Derpibooru - Scroll-to
// @namespace   Selbi
// @include     http*://*derpibooru.org/images/*
// @version     2.1.2
// @description Immediately go to the part-scaled image, fill the screen as much as possible. Also adds more convenient next/prev navigation
// @downloadURL https://update.greasyfork.org/scripts/415769/Derpibooru%20-%20Scroll-to.user.js
// @updateURL https://update.greasyfork.org/scripts/415769/Derpibooru%20-%20Scroll-to.meta.js
// ==/UserScript==

let prev = document.querySelector(".js-prev").cloneNode(true);
let next = document.querySelector(".js-next").cloneNode(true);
prev.querySelector("i").classList = "fa fa-play fa-flip-horizontal";
next.querySelector("i").classList = "fa fa-play";

let jk = document.createElement("div");
jk.innerHTML = prev.outerHTML + " " + next.outerHTML;
jk.style.position = "fixed";
jk.style.right = "10px";
jk.style.bottom = "10px";
jk.style.opacity = "0.1";
jk.style.fontSize = "6em";

let body = document.querySelector("body");
body.appendChild(jk);

document.onkeyup = function(e) {
  if (document.activeElement.tagName.toLowerCase() == "body") {
    if (e.key == "ArrowLeft") {
      prev.click();
    } else if (e.key =="ArrowRight") {
      next.click();
    }
  }
};

///

document.querySelector("body").style.minHeight = "1600px";

window.addEventListener('load', function() {
  clickAndScroll();
}, true);

function clickAndScroll() {
  let img = document.querySelector(".image-show-container .image-target");
  img.click();
  let y = getTargetY(img)
  scrollToY(y);
}

function getTargetY(elem) {
  let y = Math.round(elem.getBoundingClientRect().top + window.scrollY - 3);
  return y;
}

function scrollToY(y) {
  window.scrollTo({top: y});
}
