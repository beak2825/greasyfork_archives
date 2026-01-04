// ==UserScript==
// @name         Show lyrics LT
// @namespace    http://tampermonkey.net/
// @version      2025-01-04
// @description  Show lyrics on Lyricstraining
// @author       Valerio Valletta
// @match        https://lyricstraining.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lyricstraining.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522812/Show%20lyrics%20LT.user.js
// @updateURL https://update.greasyfork.org/scripts/522812/Show%20lyrics%20LT.meta.js
// ==/UserScript==

var autoScroll = true;

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  const oldBoxPos = getCookie("lyrics-box-pos");
  if (oldBoxPos) {
    const { top, left } = JSON.parse(oldBoxPos);

    elmnt.style.top = top;
    elmnt.style.left = left;
  }

  if (document.getElementById(elmnt.id + "-header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    const lyricsBox = document.querySelector("#lyrics-box");
    const lastBoxPos = {
      top: lyricsBox.style.top,
      left: lyricsBox.style.left,
    };

    setCookie("lyrics-box-pos", JSON.stringify(lastBoxPos));
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function scrollParentToChild(parent, child) {
  // Where is the parent on page
  var parentRect = parent.getBoundingClientRect();
  // What can you see?
  var parentViewableArea = {
    height: parent.clientHeight,
    width: parent.clientWidth,
  };

  // Where is the child
  var childRect = child.getBoundingClientRect();

  // Calculate the child's center relative to the parent's center
  var childCenterY = childRect.top + childRect.height / 2;
  var parentCenterY = parentRect.top + parentViewableArea.height / 2;

  // Calculate the distance to scroll
  var scrollY = childCenterY - parentCenterY;

  // Adjust the parent's scroll position
  parent.scrollTop += scrollY;
}

const createLyricsBox = () => {
  const lyricsBox = document.createElement("div");

  lyricsBox.id = "lyrics-box";
  lyricsBox.style.display = "none";
  lyricsBox.style.zIndex = 50;
  lyricsBox.style.position = "absolute";
  lyricsBox.style.right = 0;
  lyricsBox.style.bottom = 10;
  lyricsBox.style.width = "100%";
  lyricsBox.style.height = "100%";
  lyricsBox.style.maxHeight = "300px";
  lyricsBox.style.maxWidth = "700px";
  lyricsBox.style.overflowY = "scroll";
  lyricsBox.style.backgroundColor = "#FFF";
  lyricsBox.style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px";

  lyricsBox.appendChild(createLyricsBoxHeader());
  return lyricsBox;
};
function createCheckbox() {
  // Create the input element
  const input = document.createElement("input");

  // Set attributes
  input.type = "checkbox";
  input.id = "switch-autoscroll";
  input.style.transform = "scale(1.5)";
  input.checked = true;
  input.onclick = toggleAutoScroll;

  return input;
}

const toggleAutoScroll = () => {
  autoScroll = !autoScroll;
  document.querySelector("#switch-autoscroll").checked = autoScroll;
};

const createSwitchAutoScroll = () => {
  const div = document.createElement("div");
  div.style.display = "flex";
  div.style.justifyContent = "center";
  div.style.alignItems = "center";
  div.style.padding = "0.5em";

  const text = document.createElement("span");
  text.innerText = "autoscroll";
  text.style.fontSize = "1.3em";
  text.style.color = "white";
  text.style.paddingRight = "0.3em";

  const checkbox = createCheckbox();

  div.append(text);
  div.appendChild(checkbox);

  return div;
};

const createLyricsBoxHeader = () => {
  const header = document.createElement("div");

  header.id = "lyrics-box-header";
  header.style.top = 0;
  header.style.position = "sticky";
  header.style.width = "100%";
  header.style.height = "100%";
  header.style.maxHeight = "50px";
  header.style.backgroundColor = "royalblue";
  header.style.cursor = "move";
  header.style.display = "flex";
  header.style.alignItems = "center";
  header.style.justifyContent = "space-between";

  const title = document.createElement("span");
  title.innerText = "DRAG ME";
  title.style.fontSize = "1.6em";
  title.style.color = "white";

  title.style.fontWeight = "bold";
  title.style.letterSpacing = "0.3em";
  title.style.padding = "0.5em";

  const switchAutoScroll = createSwitchAutoScroll();
  header.appendChild(title);
  header.appendChild(switchAutoScroll);
  return header;
};

const createShowLyricsBtn = () => {
  const btn = document.createElement("button");
  btn.id = "show-lyrics-btn";
  btn.innerText = "SHOW LYRICS";
  btn.style.fontSize = "1.5em";
  btn.style.fontWeight = "bold";
  btn.style.zIndex = 100;
  btn.style.position = "fixed";
  btn.style.right = 0;
  btn.style.bottom = 10;
  btn.style.border = "2px solid royalblue";
  btn.style.borderRight = "0px";
  btn.style.color = "royalblue";
  btn.style.background = "white";
  btn.style.cursor = "pointer";
  btn.style.transition = "0.5s all";

  return btn;
};

(function () {
  "use strict";

  const addOptions = document.querySelector("#add-options");

  const lyricsBox = createLyricsBox();

  lt.game.page.lyrics.lines
    .map((el) => el.text)
    .forEach((el, i) => {
      const p = document.createElement("p");
      p.className = "lyric-line";
      p.id = `line-${i}`;
      p.style.fontSize = "1.5em";
      p.style.color = "white";
      p.style.paddingLeft = "1em";
      p.innerText = el;
      lyricsBox.appendChild(p);
    });

  const btn = createShowLyricsBtn();

  btn.addEventListener("mouseenter", () => {
    let btn = document.querySelector("#show-lyrics-btn");

    btn.style.fontSize = "1.6em";
  });

  btn.addEventListener("mouseleave", () => {
    let btn = document.querySelector("#show-lyrics-btn");

    btn.style.fontSize = "1.5em";
  });

  btn.addEventListener("click", () => {
    let currStatus = document.querySelector("#lyrics-box").style.display;
    if (currStatus === "none") {
      document.querySelector("#lyrics-box").style.display = "block";
      return;
    }
    document.querySelector("#lyrics-box").style.display = "none";
    return;
  });

  addOptions.appendChild(btn);
  addOptions.appendChild(lyricsBox);

  dragElement(lyricsBox);

  var trackLineVisible = new Set();
  setInterval(() => {
    if (trackLineVisible) [hideVisibleLines()];

    const lineEls = document.querySelectorAll(".lyric-line");
    const currEl = lineEls[lt.game.page.playView.playLine];

    if (!lineEls || !currEl) return;

    currEl.style.color = "green";
    currEl.style.display = "block";
    if (autoScroll) {
      scrollParentToChild(lyricsBox, currEl);
    }
    trackLineVisible.add(currEl);
  }, 500);

  const hideVisibleLines = () => {
    trackLineVisible.forEach((el) => {
      el.style.color = "black";
    });

    trackLineVisible.clear();
  };
})();
