// ==UserScript==
// @name         articulate vod上传
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://rise.articulate.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418491/articulate%20vod%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/418491/articulate%20vod%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==


(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  console.log("Hello, Articulate upload...");
  (function () {
      var script = document.createElement('script');
      script.src = 'https://spacecycle-static-cdn.oss-cn-hangzhou.aliyuncs.com/resources/articulate-js/mock.js';
      document.body.appendChild(script);
      // Your code here...
  })();

})));