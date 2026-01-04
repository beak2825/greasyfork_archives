// ==UserScript==
// @name        GithubMultiView
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*
// @grant       none
// @version     5.0
// @author      maanimis
// @description Redirect GitHub repositories to Gitingest, GitDiagram, or DeepWiki with a single click.
// @grant        GM_registerMenuCommand
// @run-at      document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530563/GithubMultiView.user.js
// @updateURL https://update.greasyfork.org/scripts/530563/GithubMultiView.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_registerMenuCommand("Go to Gitingest", function () {
    const newUrl = window.location.href.replace("github.com", "gitingest.com");
    window.location.href = newUrl;
  });

  GM_registerMenuCommand("Go to Diagram", function () {
    const newUrl = window.location.href.replace("github.com", "gitdiagram.com");
    window.location.href = newUrl;
  });

  GM_registerMenuCommand("Go to DeepWiki", function () {
    const newUrl = window.location.href.replace("github.com", "DeepWiki.com");
    window.location.href = newUrl;
  });

  GM_registerMenuCommand("Go to talkto", function () {
    const newUrl = window.location.href.replace(
      "github.com",
      "talktogithub.com"
    );
    window.location.href = newUrl;
  });
})();
