// ==UserScript==
// @name         2345广告清理
// @namespace    https://github.com/lbbgit
// @version      0.2
// @description  try to take over the world!
// @author       lbbgit
// @match        https://www.2345.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374146/2345%E5%B9%BF%E5%91%8A%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/374146/2345%E5%B9%BF%E5%91%8A%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function did(a){
        var te=document.getElementById(a);
        te&&te.remove();
    }
    did("mod_hotNews");
    did("map_game");
    did("map_video");
    did("map_these");
    did("map_life");
    did("map_topNews");
    document.getElementById("mod_hotNews").remove();
    document.getElementById("map_game").remove();
    // Your code here...
})();