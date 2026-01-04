// ==UserScript==
// @name         OpenAI GPTs Redirect for Aizex
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirect OpenAI Chat to Ruler AI Chat
// @author       DTEmiemie
// @match        https://chat.openai.com/g/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491975/OpenAI%20GPTs%20Redirect%20for%20Aizex.user.js
// @updateURL https://update.greasyfork.org/scripts/491975/OpenAI%20GPTs%20Redirect%20for%20Aizex.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var newPath = window.location.href.replace("https://chat.openai.com/g/", "https://ruler.aizex.net/g/");
    window.location.replace(newPath);
})();
