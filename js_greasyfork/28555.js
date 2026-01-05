// ==UserScript==
// @name         Commits2PR
// @namespace    https://git.oschina.net/
// @version      1.0
// @description  Add the commits to PR textarea.
// @author       Ruter
// @match        http://git.oschina.net/*
// @match        http://gitee.com/*
// @match        https://git.oschina.net/*
// @match        https://gitee.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28555/Commits2PR.user.js
// @updateURL https://update.greasyfork.org/scripts/28555/Commits2PR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var btn2Pr = '<div class="btn-group"><button type="button" title="Add commits to PR textarea" tabindex="-1" data-hotkey="Ctrl+Alt+P" data-toggle="button" class="add2pr"><span class="fa fa-arrow-down"></span></button></div>';
    $(".md-editor > .md-header.btn-toolbar").append(btn2Pr);
    
    function add2Pr () {
        var commits = [];
        $(".row_title").each(function(){
            commits.push($(this).text());
        });
        $("textarea.md-input").first().val(commits.join('\n\n'));
    }
    
    $(".add2pr").click(add2Pr);
})();