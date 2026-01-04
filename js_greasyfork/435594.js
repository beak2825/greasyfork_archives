// ==UserScript==
// @name         DaaS in context-menu
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       eggplants
// @homepage     https://github.com/eggplants
// @description  選択した文のダジャレ判定を行い、ツイートを作る項目を右クリックメニューに追加する
// @include      *
// @grant        GM_openInTab
// @grant        GM.xmlHttpRequest
// @run-at       context-menu
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435594/DaaS%20in%20context-menu.user.js
// @updateURL https://update.greasyfork.org/scripts/435594/DaaS%20in%20context-menu.meta.js
// ==/UserScript==

/*jshint esversion: 8 */

// ref: command implemented in Python
// https://gist.github.com/eggplants/32a7c76957a88b579c9a7b76b69c3b68

var is_dajare = -1;
var score = -1;
var rule = -1;

const daas_site = "https%3A%2F%2Frits-dajare.github.io%2Fjudge";
const api_uri = "https://api.abelab.dev/daas";

const check_is_dajare = (res) => {
  let j = JSON.parse(res.responseText);
  if (j.is_dajare === true) {
    is_dajare = true;
    rule = "";
  } else {
    is_dajare = false;
    rule = j.applied_rule;
  }
};

const check_score = (res) => {
  let j = JSON.parse(res.responseText);
  if (typeof j.score === "number") {
    score = Math.round(j.score);
  } else {
    throw "Returned score is not number!";
  }
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const q = (text) => {
  const t = encodeURIComponent(text);
  GM.xmlHttpRequest({
    method: "GET",
    synchronous: true,
    url: api_uri + `/judge?dajare=${t}`,
    onload: check_is_dajare,
    timeout: 5000,
    ontimeout: () => {
      throw "Connection timeout!";
    },
  });
  GM.xmlHttpRequest({
    method: "GET",
    synchronous: true,
    url: api_uri + `/eval?dajare=${t}`,
    onload: check_score,
    timeout: 5000,
    ontimeout: () => {
      throw "Connection timeout!";
    },
  });
};

const star = (n) => {
  return "★".repeat(n) + "☆".repeat(5 - n);
};

const make_dialog = (is_d, t, s, r) => {
  if (is_d) {
    return `「${t}」はダジャレ！\nスコア: ${star(s)}\nツイートする？`;
  } else {
    return `「${t}」はダジャレじゃない...\n(理由：${r})\nツイートする？`;
  }
};

const make_tweet_url = (is_d, t, s) => {
  const et = encodeURIComponent(
    `ダジャレ：${t}\n${is_d ? "スコア：" + star(s) : "ダジャレではありません"}`
  );
  return `https://twitter.com/intent/tweet?url=%0A${daas_site}&text=${et}&via=rits_dajare&hashtags=%E3%83%80%E3%82%B8%E3%83%A3%E3%83%AC%E5%88%A4%E5%AE%9A`;
};

(async function () {
  "use strict";
  const t = window.getSelection().toString().trim();
  if (t.length === 0) {
    alert("「ダジャレなんかなあ」と思った文を選択してくれ");
  } else {
    q(t);
    var retry = 0;
    while (is_dajare === -1 || score === -1 || rule === -1) {
      await sleep(50);
      if (retry++ > 100) {
        throw "Request is failed";
      }
    }
    if (retry < 100 && confirm(make_dialog(is_dajare, t, score, rule))) {
      GM_openInTab(make_tweet_url(is_dajare, t, score), false);
    }
  }
})();
