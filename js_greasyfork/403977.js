// ==UserScript==
// @name         Coronabuddy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Best blocker.
// @author       adamstein
// @match        https://therightstuff.biz/bang/*
// @grant GM.setValue
// @grant GM.getValue
// @grant GM.registerMenuCommand
// @run-at document-start

// CSS injection library
// @require https://greasyfork.org/scripts/403974-css-for-coronabuddy/code/CSS%20for%20coronabuddy.js?version=808229
// Helpers library
// @require https://greasyfork.org/scripts/403975-helpers-for-coronabuddy/code/helpers%20for%20coronabuddy.js?version=808222
// Popup library
// @require https://greasyfork.org/scripts/403976-popup-for-coronabuddy/code/popup%20for%20coronabuddy.js?version=808255

// @downloadURL https://update.greasyfork.org/scripts/403977/Coronabuddy.user.js
// @updateURL https://update.greasyfork.org/scripts/403977/Coronabuddy.meta.js
// ==/UserScript==
console.log("Coronabuddy: script loaded.");
let gayNiggerList;
let gayNiggerRegex;

GM.getValue("gayNiggerList", "Gay Nigger 1, Gay Nigger 2").then(function (
  data
) {
  gayNiggerList = data;
  gayNiggerRegex = new RegExp(
    data
      .trim()
      .split(",")
      .map((name) => {
        return name.trim();
      })
      .join("|"),
    "gi"
  );
  document.addEventListener("DOMContentLoaded", function () {
    domLoaded(document.body);
  });
});

function redactPosts(poster, element) {
  if (poster.innerHTML.match(gayNiggerRegex)) {
    element.style.display = "none";
  }
}

function domLoaded(element) {
  const POSTS = element.getElementsByClassName("post-element"),
    TOPICS = element.getElementsByClassName("topic"),
    TOPICPOSTER = element.getElementsByClassName("topic-poster"),
    QUOTES = element.getElementsByClassName("content-element"),
    ACTIVITY = element.getElementsByTagName("blockquote"),
    REDACTIONS = [POSTS, TOPICS, TOPICPOSTER, QUOTES, ACTIVITY];

  REDACTIONS.forEach((redaction, index) => {
    Array.prototype.forEach.call(redaction, function (elm) {
      if (elm) {
        let anchorElement = elm;

        switch (index) {
          // posts
          case 0:
            anchorElement = anchorElement
              .getElementsByClassName("post-author")[0]
              .getElementsByClassName("profile-link")[0];

            break;
          // topics
          case 1:
            anchorElement = anchorElement.getElementsByClassName(
              "profile-link"
            )[0];
            break;
          // topic poster
          case 2:
            if (
              anchorElement
                .getElementsByClassName("profile-link")[0]
                .innerHTML.match(gayNiggerRegex)
            ) {
              anchorElement.getElementsByClassName(
                "profile-link"
              )[0].innerHTML = "Muted Poster";
              anchorElement.getElementsByClassName(
                "topic-poster-avatar"
              )[0].innerHTML = "❌";
            }
            anchorElement = null;
            break;
          // quotes
          case 3:
            anchorElement = anchorElement.getElementsByClassName(
              "profile-link"
            )[0];
            // prevents a category being redacted by having a blocked last poster
            // I could also get the page URL with a background script sending a message
            // this is sufficient and will work until I feel I need a background script
            // also, todo: reduce the repeated use of selectors by re-examining the DOM as it is built by German autistics
            if (
              anchorElement.parentElement.classList.contains(
                "forum-lastpost-small"
              )
            ) {
              anchorElement = anchorElement.parentElement.parentElement.parentElement.getElementsByClassName(
                "forum-poster"
              )[0];
              if (
                anchorElement
                  .getElementsByClassName("profile-link")[0]
                  .innerHTML.match(gayNiggerRegex)
              ) {
                anchorElement.getElementsByClassName(
                  "profile-link"
                )[0].innerHTML = "Muted Poster";
                anchorElement.getElementsByClassName(
                  "forum-poster-avatar"
                )[0].innerHTML = "❌";
              }
              anchorElement = null;
            }
            break;
          // activity
          case 4:
            anchorElement = anchorElement.getElementsByClassName(
              "profile-link"
            )[0];
            break;
          // error
          // this should never happen
          default:
            throw new Error(
              "Unknown redaction argument. Check REDACTIONS array."
            );
        }

        if (anchorElement) {
          redactPosts(anchorElement, elm);
        }
      }
    });
  });
}

