// ==UserScript==
// @name         Trolls be gone.
// @namespace    https://www.warlight.net/
// @version      0.2
// @description  Hide forum posts from blacklisted users
// @author       Master of the Dead
// @match        https://www.warlight.net/Forum/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21017/Trolls%20be%20gone.user.js
// @updateURL https://update.greasyfork.org/scripts/21017/Trolls%20be%20gone.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $.get("/ManageBlackList",function(data){
        // Fetch blacklisted players.
        var blacklist = [];
        var players = $('#MainSiteContent', data).find("li");
        players.each(function(i, player){
            var name = $(player).find("a:eq(1)")[0].innerHTML; // find the second link in the list element
            blacklist.push(name);
        });

        // Hide every post whose author is blacklisted.
        var forumPosts = $("#MainSiteContent").find("table:first").find("table");
        forumPosts.find("tr").each(function(i, post){
            var authorCell = $(post).find("td:first")[0];
            if(authorCell !== undefined && authorCell.innerText !== undefined){
                var postAuthor = authorCell.innerText;
                if(IsPostAuthorBlacklisted(postAuthor)){
                    var postContent = $(post).find("td:eq(1)")[0];
                    if(postContent !== undefined && postContent.innerText !== undefined){
                        postContent.innerText = "[Hidden as player was blacklisted]";
                        $(postContent).css("color", "#808080");
                    }
                }
            }
        });

        /* Check if author of the forum post is present in user's blacklist */
        function IsPostAuthorBlacklisted(postAuthor){
            var i = blacklist.length;
            while(i--) {
                if (postAuthor.indexOf(blacklist[i])!=-1) {
                    return true;
                }
            }
            return false;
        }
    });

})();