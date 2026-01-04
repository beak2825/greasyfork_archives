// ==UserScript==
// @name         remove alert from saraba1st
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://bbs.saraba1st.com/2b/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/378269/remove%20alert%20from%20saraba1st.user.js
// @updateURL https://update.greasyfork.org/scripts/378269/remove%20alert%20from%20saraba1st.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.alert = function(str){
      return ;
    }
})();