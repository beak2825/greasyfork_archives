// ==UserScript==
// @name           Reddit-ios-style 
// @namespace      www.me.com
// @version        1.0.0
// @description    A dark mode for the  Reddit
// @author         Me
// @run-at         document-start
// @match          https://reddit.com/
// @downloadURL https://update.greasyfork.org/scripts/478911/Reddit-ios-style.user.js
// @updateURL https://update.greasyfork.org/scripts/478911/Reddit-ios-style.meta.js
// ==/UserScript==
(function() {
    var css = "";
    
    if (false || (document.domain == "reddit.com" || document.domain.substring(document.domain.indexOf(".reddit.com") + 1) == "reddit.com")) {
        css += [
            ".nightMode .Post {",
            "    background-color: #050c0e;",
            "}",
            ".TopNav__left, .TopNav__list {",
            "    background-color: #10161a !important;",
            "}",
            ".Post__link {",
            "    border-bottom: 4px solid black;",
            "}",
            ".nightMode .Subnav.m-redesign {",
            "    border-bottom: 4px solid black !important;",
            "    background-color: #050c0e;",
            "}",
            ".Post.m-redesign .Post__thumbnailAndTitle .PostContent {",
            "    position: absolute;",
            "    left: 0px;",
            "    top: 15px;",
            "}",
            ".nightMode .PostHeader__post-descriptor-line:after {",
            "    background: #050c0e !important;",
            "}",
            ".PostContent.size-compact, .PostContent.size-compact .PostContent__image-link, .PostContent.size-compact .PostContent__image-wrapper, .PostContent.size-compact .PostContent__text-wrapper {",
            "    height: 80% !important;",
            "    width: 50%;",
            "}",
            ".PostContent__img {",
            "    border: #000 solid 1px;",
            "    border-radius: 10%;",
            "}",
            ".PostHeader.m-redesign :not(.m-pds-header) .PostHeader__post-descriptor-line-overflow {",
            "    position: relative;",
            "    left: 110px;",
            "}",
            ".Post.m-redesign .Post__thumbnailAndTitle .PostHeader__post-title-line {",
            "    position: relative;",
            "    left: 110px;",
            "    margin-right: 110px;",
            "}",
            ".nightMode .PostFooter.m-redesign .PostFooter__votingBox {",
            "    position: relative;",
            "    left: 110px;",
            "}",
            ".nightMode .PostFooter.m-redesign .PostFooter__comments-link {",
            "    position: relative;",
            "    left: 110px;",
            "}",
        ].join("\n");
    }

    // Append the generated CSS to the head of the document
    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
})();
