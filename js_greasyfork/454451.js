// ==UserScript==
// @name         AtCoderCustomResultSheetShare
// @namespace    https://github.com/Ajinoko33
// @version      1.0
// @description  AtCoderの成績表をTwitterでシェアする際、ツイートに記載する項目をカスタマイズします。
// @match        https://atcoder.jp/users/*/history/share/*
// @author       Ajinoko33
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454451/AtCoderCustomResultSheetShare.user.js
// @updateURL https://update.greasyfork.org/scripts/454451/AtCoderCustomResultSheetShare.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // カスタマイズ
  // bool値を変更することによってあなた独自に有効化/無効化することができます。
  const writeRank = true;        // 順位を記載
  const shortenContest = true;   // コンテスト名を短縮
  const writePerf = true;        // パフォーマンスを記載
  const writeRating = true;      // レート変化を記載
  const writeFirstClass = true;  // 初参加時(Algorithm/Heuristic)に段級位を記載
  const writeHighest = true;     // Highest更新を記載
  const writeAtcoderTag = true;  // "#AtCoder"を記載
  const writeContestTag = true;  // コンテスト名のハッシュタグ("#ABC999"など)を記載



  // 処理
  function shorten(name) {
    if (name.includes("AtCoder Beginner Contest ")) return name.replace("AtCoder Beginner Contest ", "ABC");
    else if (name.includes("AtCoder Regular Contest ")) return name.replace("AtCoder Regular Contest ", "ARC");
    else if (name.includes("AtCoder Grand Contest ")) return name.replace("AtCoder Grand Contest ", "AGC");
    else if (name.includes("AtCoder Heuristic Contest ")) return name.replace("AtCoder Heuristic Contest ", "AHC");
    else return name;
  }

  let rows = document.getElementsByClassName("no-break");

  let username = "";
  let contest = "";
  let rank = "";
  let perf = "";
  let rating = "";
  let ratingClass = "";
  let firsttime = false;
  let highest = false;
  let classUp = false;
  for (let i = 0; i < rows.length; i++) {
    let element = rows[i];
    if (element.innerText == "ユーザ名") username = element.nextElementSibling.innerText.trim();
    else if (element.innerText == "コンテスト名") contest = element.nextElementSibling.innerText;
    else if (element.innerText == "順位") rank = element.nextElementSibling.childNodes[0].innerText.slice(0, -2);
    else if (element.innerText == "パフォーマンス") perf = element.nextElementSibling.innerText;
    else if (element.innerText == "レーティング") {
      let fulltext = element.nextElementSibling.innerText;
      if (fulltext.includes("初参加")) {
        firsttime = true;
        rating = element.nextElementSibling.childNodes[0].innerText;
      } else {
        if (fulltext.includes("Highest")) highest = true;
        rating = element.nextElementSibling.childNodes[1].innerText + "→" + element.nextElementSibling.childNodes[3].innerText + " " + element.nextElementSibling.childNodes[5].innerText;
        if (rating.includes("+")) rating += " :)";
        else if (rating.includes("-")) rating += " :(";
        else rating += " :|";
      }
    } else if (element.innerText == "段級位") {
      if (element.nextElementSibling.childNodes.length == 5) {
        classUp = true;
        ratingClass = element.nextElementSibling.childNodes[3].innerText;
      } else {
        ratingClass = element.nextElementSibling.innerText;
      }
    }
  }

  let atcoderTag = "#AtCoder";
  let contestTag = "#" + shorten(contest).replaceAll(/\s+/g, "");

  let text = "";
  if (writeRank) text += username + "さんの" + (shortenContest ? shorten(contest) : contest) + "での成績：" + rank + "位\n";
  if (writePerf && perf != "") text += "パフォーマンス：" + perf + "相当\n";
  if (writeRating && rating != "") text += "レーティング：" + rating + "\n";
  if (writeFirstClass && firsttime) text += "段級位：" + ratingClass + "\n";
  if (writeHighest && highest) {
    if (classUp) text += "Highestを更新し、" + ratingClass + "になりました！\n";
    else text += "Highestを更新しました！\n";
  }
  if (writeAtcoderTag) text += atcoderTag + (writeContestTag ? " " : "\n");
  if (writeContestTag) text += contestTag + "\n";

  let parNodeTweetButton = document.getElementsByClassName("a2a_button_twitter")[0].parentNode;
  parNodeTweetButton.setAttribute("data-a2a-title", text);

})();