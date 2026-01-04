// ==UserScript==
// @name         UnfriendMultiple for FB
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Save your energy/time, unfriend friends using checkboxes.
// @author       Aymane Hrouch
// @include      /^https:\/\/m(obile)?.facebook.com\/.*friends.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419464/UnfriendMultiple%20for%20FB.user.js
// @updateURL https://update.greasyfork.org/scripts/419464/UnfriendMultiple%20for%20FB.meta.js
// ==/UserScript==

(function() {
"use strict";

const getFriends = () =>
  document.querySelectorAll(
    '._55wp._7om2._5pxa._8yo0[data-sigil="undoable-action"]'
  );

let checkboxId = 0;
const createCB = () => {
  const friends = getFriends();
  for (let i = checkboxId; i < friends.length; i++) {
    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.style.height = "30px";
    checkBox.style.width = "30px";
    checkBox.style.margin = "auto";
    checkBox.classList.add("mycheckbox");
    checkBox.id = checkboxId++;
    friends[i].appendChild(checkBox);
  }
};

/// Load Friends
const loadFriends = (scrolling = false) => {
  const callback = (mutationList, observer) => {
    const moreFriends = document.querySelector(".seeMoreFriends");
    if (moreFriends) {
      createCB();
      if (scrolling) {moreFriends.scrollIntoView()};
    } else {
      observer.disconnect();
      console.log("no more friends");
      createCB();
    }
  };

  const loader = document.querySelector(".seeMoreFriends");
  if (loader) {
    const obs = new MutationObserver(callback);
    const options = { childList: true };
    obs.observe(document.querySelector("._2pit"), options);
    createCB();
    if (scrolling) {loader.scrollIntoView()};
  }
  else createCB()
};

// Insert Buttons
const insertBtns = (...btns) => {
  const div = document.createElement("div");
  div.style.position = "fixed";
  const list = document.querySelector("._55wo._55x2");
  const buttons = [...btns];
  buttons.map(btn => {
    btn.style.display = "inline-block";
    btn.style.fontSize = "2rem";
    btn.style.color = "#4267b2";
    btn.style.padding = "1rem 0.5rem";
    btn.style.border = "solid";
    btn.style.backgroundColor = "#fff";
    btn.style.opacity = "0.8";
    btn.style.marginLeft = "10px";
    btn.style.cursor = "pointer"
    div.appendChild(btn);
  });
  list.insertBefore(div, list.childNodes[0]);
};

// CREATING THE BUTTONS //
const createBtns = () => {
  const unfriendBtn = document.createElement("button");
  unfriendBtn.innerText = "Unfriend";
  unfriendBtn.addEventListener("click", () => {
    unfriend(0, toUnfriend());
  });

  const selectAllBtn = document.createElement("button");
  selectAllBtn.innerText = "Select All";
  selectAllBtn.addEventListener("click", () => selectAll(true));

  const unselectAllBtn = document.createElement("button");
  unselectAllBtn.innerText = "Unselect All";
  unselectAllBtn.addEventListener("click", () => selectAll(false));

  const LoadAllBtn = document.createElement("button");
  LoadAllBtn.innerText = "Load All Friends";
  LoadAllBtn.addEventListener("click", () => loadFriends(true));

  insertBtns(unfriendBtn, selectAllBtn, unselectAllBtn, LoadAllBtn);
  unfriendBtn.style.backgroundColor = "red";
};
createBtns();

// main function to unfriend // new version using setTimeout
const toUnfriend = () => {
  return Array.prototype.slice
    .call(document.getElementsByClassName("mycheckbox"))
    .filter(f => f.checked);
};

const unfriend = (id, arr) => {
  if (id >= arr.length) return;
  const friendIndex = arr[id].id;
  const friends = getFriends();
  if (id < arr.length) {
    setTimeout(function () {
      friends[
        friendIndex
      ].children[2].children[0].children[0].children[3].children[0].click();

      document
        .querySelectorAll(
          '[data-sigil="touchable touchable mflyout-remove-on-click m-unfriend-request"]'
        )[0]
        .click();

      console.log(
        friends[friendIndex].children[1].children[0].children[0].children[0]
          .children[0].innerText + " has been unfriended"
      );

      friends[friendIndex].children[3].checked = false;
      id++;
      unfriend(id, arr);
    }, 100);
  } else console.log("DONE!");
};


// Select all/unselect all

const selectAll = bool => {
  const friends = getFriends();
  for (let i = 0; i < friends.length; i++)
  { friends[i].children[3].checked = bool; }
};

window.addEventListener("load", () => loadFriends(false));
})();