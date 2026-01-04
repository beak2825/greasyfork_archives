// ==UserScript==
// @name         AtCoder Bookmarks
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  try to take over the world!
// @author       You
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://atcoder-bookmarks.oxyshower.xyz
// @match        http://localhost:3000/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant GM.setValue
// @grant GM.getValue
// @grant GM_listValues
// @grant GM.deleteValue
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/421119/AtCoder%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/421119/AtCoder%20Bookmarks.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const URL = location.href;
  if (URL.match("https://atcoder-bookmarks.oxyshower.xyz")) {
    let id = 0;
    let datalist = [];
    for (const key of GM_listValues()) {
      let username = "",
        problemname = "",
        problemurl,
        idx = 8;
      while (key[idx] != "$") username += key[idx++];
      idx++;
      while (key[idx] != "$") problemname += key[idx++];
      idx++;
      problemurl = key.substr(idx);
      datalist[id++] = {
        userName: username,
        problemName: problemname,
        problemUrl: problemurl,
      };
    }
    localStorage.removeItem("atcoder");
    // objectは保存できない -> 文字列で保存
    localStorage.setItem("atcoder", JSON.stringify(datalist));
    // console.log(JSON.stringify(datalist));
  } else {
    const userName = document
      .getElementsByClassName("dropdown-toggle")[1]
      .textContent.slice(10, -17);
    const problemUrl = location.href;
    const problemName = document
      .getElementsByClassName("h2")[0]
      .textContent.slice(4, -9);
    const value =
      "atcoder" + "$" + userName + "$" + problemName + "$" + problemUrl;

    let html =
      '<button type="button" style="border: none; outline: none; color: rgb(218, 200, 42); background-color: white;" class="Bookmark">☆</button>';
    $(".h2").append(html);

    let onoff = "off";
    for (const key of GM_listValues()) {
      if (key == value) {
        onoff = "on";
        $(".Bookmark").text("★");
      }
    }
    $(".Bookmark").click(function () {
      switch (onoff) {
        case "off":
          onoff = "on";
          $(".Bookmark").text("★");
          GM.setValue(value);
          break;
        case "on":
          onoff = "off";
          $(".Bookmark").text("☆");
          GM.deleteValue(value);
          break;
      }
    });
  }
})();
