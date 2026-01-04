// ==UserScript==
// @name        downloadBookFromIPFS
// @namespace    https://3lib.net/book*
// @version      1.04
// @description  add btn to download book from IPFS('http://library.lol/') on 3lib.net
// @license MIT
// @author       xiangzi fang
// @match        https://3lib.net/book*
// @match        https://*.3lib.net/book*
// @match        https://book4you.org/book*
// @match        https://hk1lib.org/book*
// @match        https://*.hk1lib.org/book*
// @match        https://*.z-lib.org/book*
// @match        https://*.booksc.org/book*
// @match        https://*.booksc.eu/book*
// @match        https://*.bookfi.net/book*
// @match        https://*.b-ok.asia/book*
// @match        https://*.1lib.pl/book*
// @match        https://*.b-ok.africa/book*
// @match        https://*.sg1lib.org/book*
// @match        https://*.2lib.org/book*
// @match        https://*.b-ok.cc/book*




// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428894/downloadBookFromIPFS.user.js
// @updateURL https://update.greasyfork.org/scripts/428894/downloadBookFromIPFS.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function findCoverImgUrl() {
    let coverImgUrl = null;
    let coverImg = document.querySelector(".details-book-cover-content .z-book-cover.covered>img");
    console.log(coverImg);

    if (coverImg) {
      coverImgUrl = coverImg.src;
    }

    console.log("CoverImgurl", coverImgUrl);
    return coverImgUrl;
  }

  function getBookMD5(coverImgUrl) {
    let bookMD5 = null;
    if (coverImgUrl) {
      bookMD5 = coverImgUrl.split("/").pop().split(".")[0];
    }
    console.log("bookMD5", bookMD5);
    return bookMD5;
  }

  function addbtn2librarydotlol(bookMD5) {
    let bookDeailsBtns = document.querySelectorAll(".book-details-button");
    let saveLaterbtn = bookDeailsBtns[bookDeailsBtns.length - 1];

    if (bookMD5) {
      let btnHTML2add = `<div class="book-details-button">
    <a class="btn btn-success" href="http://library.lol/main/${bookMD5}" target="_blank" > Download from IPFS </a>
  </div>`;
      saveLaterbtn.insertAdjacentHTML("afterend", btnHTML2add);
    }
  }

  function mainWork() {
    let _coverImgUrl = findCoverImgUrl();
    let _bookMD5 = getBookMD5(_coverImgUrl);
    addbtn2librarydotlol(_bookMD5);
  }

  setTimeout(mainWork, 2000);
})();
