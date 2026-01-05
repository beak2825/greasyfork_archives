// ==UserScript==
// @name         Hide ill posts
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Let sunshine take over Huasing!
// @author       Nevermoi
// @match        http://bbs.huasing.*/sForum/*.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28382/Hide%20ill%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/28382/Hide%20ill%20posts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var banList = ['HitmanYK'];

    for(var i = 0; i < banList.length; i++) {
        killThemAll(banList[i]);
        killThemAllInPost(banList[i]);
    }

    function killThemAll(name) {
        var them = $("div.ccol6 a[title="+ name +"]");
        var targets = [];
        for(var i = 0; i < them.length; i++) {
            var parents = $(them[i]).parents();
            //by inspecting dom, the 3rd element is div.brow2
            targets.push(parents[2]);
        }

        for(var j = 0; j < targets.length; j++) {
            $(targets[j]).hide();
        }
    }
    
    function killThemAllInPost(name) {
        var themTitles = $("div.authordiv:contains('" + name + "')");

        for (var i = 0; i < themTitles.length; i++) {
            // hide title by name
            $(themTitles[i]).hide();

            // get content id
            var contentId = "#" + themTitles[i].id.replace('auth', 'content');

            // hide content by id
            $(contentId).hide();
        }
    }
})();