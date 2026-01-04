// ==UserScript==
// @name         Inca Digital Helper
// @version      0.1.2
// @description  corolho
// @author       lucassilvas1
// @match        http*://www.mturkcontent.com/dynamic/hit*
// @grant        GM_addStyle
// jshint        esversion: 8
// @namespace https://greasyfork.org/users/846945
// @downloadURL https://update.greasyfork.org/scripts/447503/Inca%20Digital%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/447503/Inca%20Digital%20Helper.meta.js
// ==/UserScript==

"use strict";

setTimeout(main, 5000);

function main() {
  const form = [...document.getElementsByTagName("form")][0];
  const paragraphs = [...form.querySelectorAll("p")];
  if (
    !paragraphs[0].innerText.startsWith(
      "1. You will see tweets mentioning an exchange"
    )
  )
    return;
  paragraphs.splice(0, 42);

  const goodHints = [
    "work",
    "can't",
    "not letting",
    "can't",
    "cant",
    "cannot",
    "traffic",
    "issue",
    "broken",
    "error",
    "load",
    "problem",
    "fix",
    "open",
    "fail",
    "hour",
    "unreliable",
    "congest",
    "broke ",
    "unavailable",
    "unusable",
    "glitch",
    "suck",
    "closed",
    "technical",
    "overwhelm",
    "platform",
    "service",
    "torodown",
    "halt",
    "took a crap",
    "connect",
    "collaps",
    "ddos",
    "access",
    "log in",
    "login",
    "capacity",
    "instability",
    "repair",
    "allow",
    "shuts",
    "suffer",
  ];
  const greatHints = [
    "crash",
    "down",
    "failed",
    "respond",
    "freez",
    "froze",
    "server",
    "overload",
    "locked",
    "offline",
    "dead",
    "disruption",
    "outage",
    "maintenance",
    "out of action",
  ];

  function addStyles() {
    GM_addStyle(
      ".great-hint{color:green;}.good-hint{color:yellow}.blue{color:#1d9bf0}"
    );
  }

  function highlight(paragraph) {
    let html = paragraph.textContent
    html = html.replace(/(?=(#|@)).+?(?=\ )/g, "<span class='blue'>$&</span>");
    goodHints.forEach((hint) => {
      html = html.replace(RegExp(hint, "gi"), "<b class='good-hint'>$&</b>");
    });
    greatHints.forEach((hint) => {
      html = html.replace(RegExp(hint, "gi"), "<b class='great-hint'>$&</b>");
    });
    paragraph.innerHTML = html;
  }

  function init() {
    addStyles();
    paragraphs.forEach((p) => highlight(p));
  }

  init();
}
