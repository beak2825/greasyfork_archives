// ==UserScript==
// @name         Get Comments from Facebook Post
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      MIT
// @run-at       context-menu
// @description  Read all comments from Facebook post replys
// @author       Or Cohen
// @match        https://www.facebook.com/groups/*/posts/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490785/Get%20Comments%20from%20Facebook%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/490785/Get%20Comments%20from%20Facebook%20Post.meta.js
// ==/UserScript==

// sheet id = 19migScXP4xDj049pHzD39ZxrD4UFLKTDUfz_W9b2KfM


(function() {
    'use strict';

    const PREVIOUS_COMMENTS = " previous comments";
    const MORE_COMMENTS = " more comments";
    const COMMENT_BY = "Comment by ";
    const USER_LINK1 = "www.facebook.com/groups/";
    const USER_LINK2 = "/user/";
    
    var log = true;

    function downloadBlob(content, filename, contentType) {
        // Create a blob
        var blob = new Blob([content], { type: contentType });
        var url = URL.createObjectURL(blob);

        // Create a link to download it
        var pom = document.createElement('a');
        pom.href = url;
        pom.setAttribute('download', filename);
        pom.click();
    }

    function readComments(){
        var height = document.body.scrollHeight;
        var moreComments = [...document.querySelectorAll("span")]
          .filter(span => span.textContent.contains(MORE_COMMENTS))[0]
        var prevComments = [...document.querySelectorAll("span")]
          .filter(span => span.textContent.contains(PREVIOUS_COMMENTS))[0]

        if(moreComments || prevComments)
        {
            console.log("Opening comments...");

            moreComments?.click();
            prevComments?.click();

            setTimeout(readComments, 2000);
        }
        else
        {
            console.log("------Get Comments from Facebook Post-----");

            // TODO: Handle sub-comments
            var comments = [...document.querySelectorAll('div[aria-label^="' + COMMENT_BY + '"]')]
                 .map(comment =>
             {
                     var linkAnchors = [...comment.querySelectorAll("a")].filter(a => a.href.contains(USER_LINK1) && a.href.contains(USER_LINK2));
                     var linkAnchor;

                     if(linkAnchors && linkAnchors.length >= 2)
                     {
                         linkAnchor = linkAnchors[1];
                     }

                     if(linkAnchor)
                     {
                         var textParts = [...linkAnchor.closest("div").querySelectorAll("span")].map(commentSpanPart => commentSpanPart.textContent).filter(textPart => textPart);

                         var userName = textParts[0];

                         // TODO: Format link
                         var link = linkAnchor.href;

                         var commentText = textParts[textParts.length - 1];

                         var commentLog = "Name: " + userName + ", Comment: " + commentText + ", Link: " + link ;
                         var commentOut = '"' + userName + '","' + commentText + '","' + link + '"';

                         if (log) console.log(commentLog);

                         console.log("-----------------------------------------");

                         return commentOut
                     }

                     return null;
             }
             ).filter(n => n);

             var csv = '"name","comment","link"\n' + comments.join('\n');

             downloadBlob(csv, "comments.csv", "text/csv;charset=utf-8;")
        }
    }

    setTimeout(readComments, 1000);
})();