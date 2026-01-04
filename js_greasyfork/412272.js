// ==UserScript==
// @name         pornolab torrentPreview
// @version      1.0.0
// @author       ducklover
// @description  Allows to display torrent's poster image as preview on search page when hover over link
// @copyright    2020, ducklover (https://openuserjs.org/users/ducklover)
// @include      /^https?:\/\/pornolab\.net\/forum\/(tracker|viewforum).*/
// @license      MIT
// @run-at       document-end
// ==/UserScript==

function getPic(e) {
  if (
    (e.target.classList.contains("tLink") ||
      e.target.classList.contains("tt-text")) &&
    !e.target.querySelector(".customImg")
  ) {
    let url =
      "https://pornolab.net/forum" + e.target.getAttribute("href").slice(1);

    let r = new XMLHttpRequest();
    r.open("GET", url, false);
    r.send();

    let imgSrc = new DOMParser()
      .parseFromString(r.responseText, "text/html")
      .querySelector(".postImg").title;

    let div = document.createElement("div");
    div.style.cssText = `position: absolute; 
		                     width: 460px; 
							 height: 300px; 
							 left: 0; 
							 z-index: 10;`;

    e.clientY < 300 ? (div.style.bottom = "auto") : (div.style.bottom = "100%");
    div.className = "customImg";

    let img = document.createElement("img");
    img.setAttribute("src", imgSrc);
    img.style.cssText = `width: 100%;
		                     height: 100%;
							 object-fit: contain;`;

    div.appendChild(img);

    e.target.style.position = "relative";
    e.target.appendChild(div);
  } else if (
    (e.target.classList.contains("tLink") ||
      e.target.classList.contains("tt-text")) &&
    e.target.querySelector(".customImg")
  ) {
    e.target.querySelector(".customImg").style.display = "block";

    if (e.clientY < 300) {
      e.target.querySelector(".customImg").style.bottom = "auto";
    } else {
      e.target.querySelector(".customImg").style.bottom = "100%";
    }
  }
}

function hidePic(e) {
  if (
    (e.target.classList.contains("tLink") ||
      e.target.classList.contains("tt-text")) &&
    e.target.querySelector(".customImg")
  ) {
    e.target.querySelector(".customImg").style.display = "none";
  }
}

window.addEventListener("mouseover", getPic);
window.addEventListener("mouseout", hidePic);
