// ==UserScript==
// @name         复制 HackerNews 评论(Copy HackerNews Comments As Markdown List)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Need to install https://chrome.google.com/webstore/detail/modern-for-hacker-news/dabkegjlekdcmefifaolmdhnhdcplklo first to use this script.
// @author       Boninall
// @match        *://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.3/dist/jquery.min.js
// @license      GPL v3

// @downloadURL https://update.greasyfork.org/scripts/459458/%E5%A4%8D%E5%88%B6%20HackerNews%20%E8%AF%84%E8%AE%BA%28Copy%20HackerNews%20Comments%20As%20Markdown%20List%29.user.js
// @updateURL https://update.greasyfork.org/scripts/459458/%E5%A4%8D%E5%88%B6%20HackerNews%20%E8%AF%84%E8%AE%BA%28Copy%20HackerNews%20Comments%20As%20Markdown%20List%29.meta.js
// ==/UserScript==
(function ($, undefined) {
    'use strict';
    $(function () {
      $(document).ready(function() {
          $('head').append('<style type="text/css">.copy-text {text-align: center; padding-left: 5px; padding-right: 5px;} .copy-icon {display:flex; align-items: center; margin-right: 1em; width: 50px; height: 16px; cursor: pointer;} .copy-icon:hover {background-color: rgb(243 243 243);} .hn-comment-icons {display: flex; align-items: center;}</style>');
          const el = document.createElement("div");
          const iconEl = document.createElement("div");
          el.innerText = "COPY";
          el.className = "copy-text";
          iconEl.appendChild(el);
          iconEl.className = "copy-icon";

          $( ".hn-comment-icons" ).prepend(iconEl);
          $( ".copy-icon" ).click(function() {
              const currentCommentEl = this.parentElement.parentElement.parentElement;
              const infoLinkEl = currentCommentEl.querySelector(".hn-story-info-age");
              const linkHref = infoLinkEl.href;
              let allCommentText = "";
              // Convert comment text into Markdown List based on indent
              const todayDate = new Date().toISOString().slice(0, 10);
              const parentCommentText =  todayDate + ` [link](${linkHref})` + currentCommentEl.querySelector(".hn-comment-text").innerText.trim().replace(/^\s*[\r\n]/gm, "").split("\n").map(line => line.trim()).join("\n").replace(/\n/g, "<br>");

              const currentIndent = currentCommentEl.className.split(" ")[1].split("-")[3];
              $(currentCommentEl).nextUntil(".hn-comment-indent-" + currentIndent).each(function()
              {
                    const currentCommentIndent = this.className.split(" ")[1].split("-")[3];
                    const indent = " ".repeat((currentCommentIndent - currentIndent) * 4);
                    const currentCommentText = this.querySelector(".hn-comment-text").innerText.replace(/^\s*[\r\n]/gm, "").split("\n").map(line => line.trim()).join("\n").replace(/\n/g, "<br>");

                    // Comment Text maybe multiline, so we need to add indent to each line except the first line
                    const commentText = currentCommentText;
                    allCommentText += indent + "- " + commentText + "\n";

              });
              allCommentText = "- " + parentCommentText + "\n" + allCommentText;
              // Copy to clipboard
              navigator.clipboard.writeText(allCommentText);
          });
      })
    });
  })(window.jQuery.noConflict(true));