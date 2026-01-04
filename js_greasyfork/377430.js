// ==UserScript==
// @name Github raw.githack.com Button
// @version 0.2.1
// @description A userscript to add raw.githack.com button on Github.
// @homepageURL https://github.com/eight04/raw-githack-button#readme
// @supportURL https://github.com/eight04/raw-githack-button/issues
// @license MIT
// @author eight <eight04@gmail.com> (https://github.com/eight04)
// @namespace https://github.com/eight04
// @include https://github.com/*
// @include https://gist.github.com/*
// @require https://cdnjs.cloudflare.com/ajax/libs/sentinel-js/0.0.7/sentinel.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/377430/Github%20rawgithackcom%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/377430/Github%20rawgithackcom%20Button.meta.js
// ==/UserScript==

(() => {
  /* global sentinel */
  const SELCTOR = [
    ".file-actions a.Button[href*='/raw/']:not(.raw-githack-detected)", // gist
    "a[data-testid='raw-button']:not(.raw-githack-detected)", // github
  ].join(",")

  sentinel.on(SELCTOR, el => createButton(el));

  // replace();
  
  // function replace(btn){
  //   var btns, i;
  //   btns = document.querySelectorAll();
  //   for (i = 0; i < btns.length; i++) {
  //     if (btns[i].textContent == "Raw") {
  //       createButton(btns[i]);
  //     }
  //   }
  // }

  function createButton(btn) {
    btn.classList.add("raw-githack-detected");
    if (btn.textContent.trim() !== "Raw") {
      return;
    }

    var url = btn.href;
    if (url.indexOf("gist.github.com") >= 0) {
      url = url.replace("gist.github.com", "gist.githack.com");
    } else {
      url = url.replace(/github\.com\/([^/]+\/[^/]+)\/raw/, "raw.githack.com/$1");
    }

    var newBtn = btn.cloneNode(false);
    newBtn.href = url;
    newBtn.textContent = "Raw Githack";
    newBtn.removeAttribute("id");

    btn.parentNode.insertBefore(newBtn, btn.nextSibling);
    
    if (!/btn-group|ButtonGroup/.test(btn.parentNode.className)) {
      const parent = btn.parentNode;
      const group = document.createElement("div");
      group.className = "btn-group";
      while (parent.childNodes.length) {
        group.appendChild(parent.childNodes[0]);
      }
      parent.appendChild(group);
    }

    const group = btn.parentNode;
    for (let i = 0; i < group.children.length; i++) {
      if (i < group.children.length - 1) {
        group.children[i].classList.add("rounded-right-0", "border-right-0");
      }
      if (i >= 1) {
        group.children[i].classList.add("rounded-left-0");
      }
    }
  }
})();
