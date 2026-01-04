// ==UserScript==
// @name        downloadBookFromIPFS_zlib 无限下载脚本-skycloud修改优化
// @version      1.4
// @description  add btn to download book from IPFS('http://library.lol/') on 3lib.net zlib 无限下载脚本 downloadBookFromIPFS,可以从zlib跳到libgen的ipfs下载页 不用买zlib会员 为Z-Library 添加从IPFS(http://library.lol/)下载的跳转按钮
// @author       xiangzi fang skycloud修改
// @match        http*://z-lib.org*
// @match        http*://b-ok.*
// @match        http*://4lib.*
// @match        http*://3lib.*
// @match        http*://2lib.*
// @match        http*://1lib.*
// @match        http*://book4you.org/book*
// @match        http*://1lib.us/*
// @include        http*://z-lib.org*
// @include        http*://b-ok.*
// @include        http*://4lib.*
// @include        http*://3lib.*
// @include        http*://2lib.*
// @include        http*://1lib.*
// @include        http*://book4you.org/book*
// @include        http*://1lib.us/*
// @grant        none
// @namespace https://3lib.net/book*
// @downloadURL https://update.greasyfork.org/scripts/429506/downloadBookFromIPFS_zlib%20%E6%97%A0%E9%99%90%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC-skycloud%E4%BF%AE%E6%94%B9%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/429506/downloadBookFromIPFS_zlib%20%E6%97%A0%E9%99%90%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC-skycloud%E4%BF%AE%E6%94%B9%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function findCoverImgUrl() {
    let coverImgUrl = null;
    let coverImg = document.querySelector(".z-book-cover.covered>img");
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
