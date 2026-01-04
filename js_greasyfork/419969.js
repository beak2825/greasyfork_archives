// ==UserScript==
// @name         Trac评论框自动padding
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://15.210.144.243/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419969/Trac%E8%AF%84%E8%AE%BA%E6%A1%86%E8%87%AA%E5%8A%A8padding.user.js
// @updateURL https://update.greasyfork.org/scripts/419969/Trac%E8%AF%84%E8%AE%BA%E6%A1%86%E8%87%AA%E5%8A%A8padding.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let comment = document.getElementById('comment');
    comment.style.padding = "5px";
})();