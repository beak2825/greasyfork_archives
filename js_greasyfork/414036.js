// ==UserScript==
// @name         George Asshat
// @namespace    https://greasyfork.org/en/users/434272-realalexz
// @version      0.1
// @description  Equips George with a stylish ass hat.
// @author       RealAlexZ
// @icon         https://i.imgur.com/NouzJ6b.jpg
// @include      https://forum.turkerview.com/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414036/George%20Asshat.user.js
// @updateURL https://update.greasyfork.org/scripts/414036/George%20Asshat.meta.js
// ==/UserScript==

const georgeBody = document.querySelector(".spider");

if (georgeBody) {
  const asshatImg = document.createElement("img");
  asshatImg.style.height = "30px";
  asshatImg.src = "https://i.imgur.com/HUDIb6h.png";
  asshatImg.alt = "Stylish Ass Hat";
  asshatImg.style.zIndex = "999";
  asshatImg.style.position = "relative";
  asshatImg.style.bottom = "16px";
  asshatImg.style.right = "1px";
  georgeBody.appendChild(asshatImg);
}
