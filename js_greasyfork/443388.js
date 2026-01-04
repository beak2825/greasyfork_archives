// ==UserScript==
// @name          Magnet Kinozal.tv
// @version       0.2002
// @description   Magnet maker for kinozal.tv
// @match         https://kinozal.tv/details.php* 
// @match         https://kinozal.tv/comment.php*
// @run-at        document-end
// @grant         none
// @copyright     2022, 4ipon4ik
// @license       MIT
// @namespace https://greasyfork.org/users/752356
// @downloadURL https://update.greasyfork.org/scripts/443388/Magnet%20Kinozaltv.user.js
// @updateURL https://update.greasyfork.org/scripts/443388/Magnet%20Kinozaltv.meta.js
// ==/UserScript==

const parser = new DOMParser();

// Storing download button reference.
const downButt = document.querySelector(".mn1_content > table > tBody > tr > td");

// Creating little magnet svg icon from fontawesome website. Only added 25px sized dimentions, whitch corresponds to download button height.
const magnetIcon = '<svg width="25" height="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M128 160V256C128 309 170.1 352 224 352C277 352 320 309 320 256V160H448V256C448 379.7 347.7 480 224 480C100.3 480 0 379.7 0 256V160H128zM0 64C0 46.33 14.33 32 32 32H96C113.7 32 128 46.33 128 64V128H0V64zM320 64C320 46.33 334.3 32 352 32H416C433.7 32 448 46.33 448 64V128H320V64z"/></svg>';

// Main function -> async so we can use await syntax with fetch. 
(async () => {
  // Fetching torrent hash string.
  const response = await (await fetch(`/get_srv_details.php?id=${(new URL(location.href)).searchParams.get("id")}&action=2`)).text();
  
  // Converting response text to dom element, so we can easily traverse and extract torrent hash with querySelector.
  const dom = parser.parseFromString(response, "text/html");
  const torrentHash = dom.documentElement.querySelector("ul > li:first-child").innerText.substr(10);
  
  // And finally adding magnet link to the page. 🙂
  downButt.insertAdjacentHTML("afterend", `<td style = "padding-right: 10px;"><a title="Magnet-ссылка" href="magnet:?xt=urn:btih:${torrentHash}">${magnetIcon}</a></td>`);
})(); // Self invoking function.