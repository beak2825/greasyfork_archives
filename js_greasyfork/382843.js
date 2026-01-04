// ==UserScript==
// @name         仅允许打开智适应和魔方格
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You

// @include      *
// @exclude      *51yxedu.com/*
// @exclude      *classba.cn/*
// @exclude      *mofangge.com/*

// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/382843/%E4%BB%85%E5%85%81%E8%AE%B8%E6%89%93%E5%BC%80%E6%99%BA%E9%80%82%E5%BA%94%E5%92%8C%E9%AD%94%E6%96%B9%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/382843/%E4%BB%85%E5%85%81%E8%AE%B8%E6%89%93%E5%BC%80%E6%99%BA%E9%80%82%E5%BA%94%E5%92%8C%E9%AD%94%E6%96%B9%E6%A0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.open("about:blank","_self").close()
    // Your code here...
})();