// ==UserScript==
// @name Scratch Forum Scrollbars
// @version 1.3
// @namespace iamunknown2
// @description Limits height of posts or signatures and imposes scrollbars on posts which break that limit
// @include https://scratch.mit.edu/discuss/topic/*
// @downloadURL https://update.greasyfork.org/scripts/21704/Scratch%20Forum%20Scrollbars.user.js
// @updateURL https://update.greasyfork.org/scripts/21704/Scratch%20Forum%20Scrollbars.meta.js
// ==/UserScript==
var posts = document.getElementsByClassName("post_body_html");
for (var i = 0; i < posts.length; i++)
{
    post = posts[i];
    post.style.maxHeight = "300px";
    post.style.overflowY = "auto";
    post.style.paddingRight = "10px";
    post.scrollTop = post.scrollHeight;
}
var signatures = document.getElementsByClassName("postsignature");
for (var i = 0; i < signatures.length; i++)
{
    signature = signatures[i];
    signature.style.overflowY = "auto";
    signature.style.paddingRight = "10px";
}