// ==UserScript==
// @name        CloudBuild syntax highlighter
// @namespace   https://greasyfork.org/users/121965
// @author      RPing (Stephen Chen)
// @version     1.0.0
// @include     https://console.cloud.google.com/cloud-build/builds/*
// @description syntax highlight for CloudBuild logs
// @name:en         CloudBuild syntax highlighter
// @description:en  CloudBuild syntax highlighter
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/387926/CloudBuild%20syntax%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/387926/CloudBuild%20syntax%20highlighter.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
if (!window.hljs) {
  var script = document.createElement('script');
  script.onload = () => window.hljs.initHighlighting();
  script.src = '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.7.0/highlight.min.js';
  document.body.appendChild(script);
}