// ==UserScript==
// @name reddit-ios
// @namespace me
// @version 1.0.0
// @description A new userstyle
// @author Me
// @grant GM_addStyle
// @run-at document-start
// @match *://*.reddit.com/*
// @downloadURL https://update.greasyfork.org/scripts/478913/reddit-ios.user.js
// @updateURL https://update.greasyfork.org/scripts/478913/reddit-ios.meta.js
// ==/UserScript==

(function() {
let css = `
.nightMode .Post {
    background-color: #050c0e;
}
body.nightMode {
    background-color: #050c0e;
    font-weight: 600;
}
.nightMode .PostFooter.m-single.m-redesign {
    border-bottom: 10px solid black;
}
.nightMode .CommentTree__comment.m-toplevel:not(:first-child) {

    border-top: 5px solid black;
}
.nightMode .CommunityHeader {

    border-bottom: 1px solid black!important;
}
.Comment.in-comment-tree ,.nightMode .Comment.in-comment-tree{
    background-color: #050c0e!important;
}
.nightMode ._2zV67xrRnhXuht_rRqGE24{
    background-color: #050c0e;
}
.TopNav__left,
.TopNav__list {
    background-color: #10161a!important;
}
.Post__link {
    border-bottom: 4px solid black;
}
.nightMode .Subnav.m-redesign {
    border-bottom: 4px solid black!important;
    background-color: #050c0e;
}
.Post.m-redesign .Post__thumbnailAndTitle .PostContent {
    position: absolute;
    left: 0px;
    top: 5px;
    bottom: 150px!important;
}
div.CommentsPage .PostContent__img {
    
     border: #000 solid 0px;
    border-radius: 0%;
}

.nightMode .PostHeader__post-descriptor-line:after {
    background: #050c0e!important;
}


.PostContent.size-compact,
.PostContent.size-compact .PostContent__image-link,
.PostContent.size-compact .PostContent__image-wrapper,
.PostContent.size-compact .PostContent__text-wrapper {
    height: 90px!important;
    width: 100px;
}
.Post.m-redesign .PostContent .PostContent__media-wrapper-thumbnail.m-with-media .PostContent__link-bar.m-thumbnail-link {
    width: 50%
}
.PostContent__img {
    border: #000 solid 1px;
    border-radius: 10%;
}

.nightMode:has(.PostContent__image-link) .PostHeader__link-flair.m-pill{
     position: relative;
    left: 110px;
}

.Post.m-redesign:has(.PostContent__image-link) .PostHeader.m-redesign :not(.m-pds-header) .PostHeader__post-descriptor-line-overflow {
    position: relative;
    left: 110px;
}

div.CommentsPage .Post.m-redesign:has(.PostContent__image-link) .PostHeader.m-redesign :not(.m-pds-header) .PostHeader__post-descriptor-line-overflow{
      position: relative;
    left: 0px!important;
}

.Post.m-redesign:has(.PostContent__image-link) .PostHeader__post-title-line {
    position: relative;
    left: 110px;
    margin-right: 110px;
}
div.CommentsPage .Post.m-redesign:has(.PostContent__image-link) .PostHeader__post-title-line {
    position: relative;
    left: 0px;
    margin-right: 0px;
}

.PostFooter.m-redesign .PostFooter__vote-and-tools-wrapper {
    position: relative;
    left: 1%;
    float: right;
}

.nightMode .PostFooter.m-redesign .PostFooter__votingBox{
    border:#2b2e30 1px solid;
    box-shadow: #2b2e3094 0 0 5px 0px;
}
.nightMode .PostFooter.m-redesign .PostFooter__comments-link{
    border:#2b2e30 1px solid;
        box-shadow: #2b2e3094 0 0 5px 0px;

}
.nightMode .PostFooter.m-redesign .PostFooter__share{
        border:#2b2e30 1px solid;
        box-shadow: #2b2e3094 0 0 5px 0px;
}

._2mBXhMH6lYncPAGZPjzyfn > ul {

    background-color: #071114;
}
.aAprpkg6XvIsjmyc5LX8M{
       background-color: #10161a;
 
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
