// ==UserScript==
// @name         "Create New Topic" button on mobile version for MAL
// @namespace    https://myanimelist.net/profile/kyoyatempest
// @version      1.0
// @description  Since MAL doesn't have one, i added one.
// @author       kyoyacchi
// @match        https://myanimelist.net/forum/*
// @grant        none
// @run-at      document-end
// @icon        https://www.google.com/s2/favicons?domain=myanimelist.net&sz=64
// @license     none
// @downloadURL https://update.greasyfork.org/scripts/466278/%22Create%20New%20Topic%22%20button%20on%20mobile%20version%20for%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/466278/%22Create%20New%20Topic%22%20button%20on%20mobile%20version%20for%20MAL.meta.js
// ==/UserScript==

(function() {
    'use strict';
try {
  let url = window.location.href;
  if (!url.includes("?board=")) {
    return//to prevent button appearing on some other forum posts.
  }
  let board_id = url.split("?board=")[1]

    let buton = document.createElement("a");
buton.id = "create-post";
buton.href = `https://myanimelist.net/forum/?action=post&boardid=${board_id}`
buton.style.color = "#FFFFFF";
buton.style.backgroundColor = "#0000CC";
buton.textContent = "Create New Topic";
buton.style.position = "absolute";
buton.style.left = "12px";
buton.style.border = "1px white";
buton.style.bottom = `${board_id == 4 ? "3293px" : "3330px"}`;//＼⁠(⁠°⁠o⁠°⁠)⁠／
buton.style.fontSize = "12px";
buton.style.fontWeight = "bold";
let mb12 = document.querySelectorAll(".mb12");
if (!mb12 || !mb12.length) return;
mb12[2].appendChild(buton)

} catch(er) {

}
})();