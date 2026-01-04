// ==UserScript==
// @name         AB - Screenshot Scroller
// @namespace    regis@animebytes.tv
// @version      0.1
// @description  Adds scrolling buttons and keyboard controls when opening screenshots on torrent pages
// @author       regis
// @match        https://animebytes.tv/torrents.php?id=*
// @icon         https://animebytes.tv/favicon.ico
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473964/AB%20-%20Screenshot%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/473964/AB%20-%20Screenshot%20Scroller.meta.js
// ==/UserScript==

GM_addStyle(`
.ssArrow {
  position: fixed;
  background: rgba(255,255,255,0.0);
  bottom: 50%;
  transform: translateY(+50%);
  width: 50px;
  height: 50px;
  margin: 25px;
  padding: 10px;
  border-radius: 5px;
  z-index: 2147483647;
  user-select: none;
  cursor: pointer;
  fill: transparent;
  stroke: white;
}
.ssArrow:hover {
  background: rgba(255,255,255,0.2);
}
#rArrow {
  right: 0;
}
#lArrow {
  left: 0;
}
#ssLoad {
  background: inherit;
  color: inherit;
  border: 1px solid black;
  border-radius: 4px;
  font-weight: bold;
  padding: 15px;
  position: fixed;
  bottom: 50%;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  z-index: 2147483647;
}
`);

var imgURLs = [];
var currIdx;
var initImg;
var currCollage;
var screenshot;
var loadOv;
var isKeyInit;

function scrollImage(step) {
    if (!screenshot) {
        var images = document.getElementsByClassName('featherlight-image');
        if (images.length == 1) {
            screenshot = images[0];
            screenshot.addEventListener("load", () => {loadOv.style.display = "none";})
            currIdx = imgURLs.indexOf(initImg);
        }
    }
    if (screenshot && currIdx + step >= 0 && currIdx + step < imgURLs.length) {
        loadOv.style.display = "block";
        currIdx += step;
        screenshot.src = imgURLs[currIdx]
    }
}

function scrollImageKeys(e) {
    if (e.code === "ArrowRight") {
        scrollImage(1);
    } else if (e.code === "ArrowLeft") {
        scrollImage(-1);
    } else if (e.code === "Escape" && document.getElementById("rArrow")) {
        removeButtons();
    }
}

function createArrow(points, type, step) {
    var arr = document.createElement("span");
    arr.id = type;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute("viewBox", "0 0 40 40");
    svg.setAttribute("stroke-width", "4");
    arr.setAttribute("class", "ssArrow");
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute("d", points);
    svg.appendChild(path);
    arr.appendChild(svg);
    arr.addEventListener("click", function(){scrollImage(step)});
    return arr;
}

function createLoadOverlay() {
    var loadOverlay = document.createElement("span");
    loadOverlay.innerHTML = "Loading...";
    loadOverlay.id = "ssLoad";
    loadOv = loadOverlay;
    return loadOverlay;
}

function removeButtons() {
    screenshot = null;
    loadOv = null;
    currIdx = null;
    initImg = null;
    document.getElementById("rArrow").remove();
    document.getElementById("lArrow").remove();
    document.getElementById("ssLoad").remove();
}

function addButtons(e) {
    var elem = e.target;
    if (elem.nodeName == "A") {
        elem = elem.children[0];
    }
    if (elem && elem.nodeName == "IMG") {
        if (!isKeyInit) {
            isKeyInit = true;
            document.addEventListener('keydown', scrollImageKeys);
        }
        initImg = elem.parentElement.getAttribute("data-image");
        var collage = elem.closest("table");
        if (collage.id != currCollage) {
            currCollage = collage.id;
            var thumbs = collage.querySelectorAll("a");
            imgURLs = [];
            for (let i = 0; i < thumbs.length; i++) {
                imgURLs.push(thumbs[i].getAttribute("data-image"));
            }
        }
        var container = document.getElementById("torrents");
        container.appendChild(createArrow("M10,20 L30,20 M22,12 L30,20 L22,28", "rArrow", 1));
        container.appendChild(createArrow("M18,12 L10,20 L18,28 M10,20 L30,20", "lArrow", -1));
        container.appendChild(createLoadOverlay());
    }
}

function main() {
    Array.from(document.getElementsByClassName('tabs')).forEach((tab) => {
        for (const stab of tab.children) {
            if (stab.id.match(".*screenshots")) {
                stab.addEventListener("click", addButtons);
                break;
            }
        }
    })
    document.addEventListener("click", (e) => {
        if (e.target.tagName == 'DIV' && e.target.classList.contains("screenshot")){
            removeButtons();
        }
    });
}

main();