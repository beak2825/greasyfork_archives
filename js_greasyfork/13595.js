// ==UserScript==
// @name       Vlamtweet
// @namespace  http://yal.cc/
// @version    1.00
// @description Replaces the Twitter "like" button with a tiny Vlambeer logo, effects included.
// @match      http://twitter.com/*
// @match      https://twitter.com/*
// @run-at     document-body
// @copyright  2015+, YellowAfterlife
// @downloadURL https://update.greasyfork.org/scripts/13595/Vlamtweet.user.js
// @updateURL https://update.greasyfork.org/scripts/13595/Vlamtweet.meta.js
// ==/UserScript==
if (document.getElementById("vlamtweet-css")) return;
var css = document.createElement("style");
css.innerHTML = [
".HeartAnimation {",
" background-image: url('data:image/png;base64,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');",
" background-size: 200%;",
"}",
".ProfileTweet-action--favorite.withHeartIcon .ProfileTweet-actionButton:hover, .ProfileTweet-action--favorite.withHeartIcon .ProfileTweet-actionButton:focus, .ProfileTweet-action--favorite.withHeartIcon .ProfileTweet-actionCount:hover, .ProfileTweet-action--favorite.withHeartIcon .ProfileTweet-actionCount:focus, .favorited .ProfileTweet-action--favorite .Icon--heart, .favorited .ProfileTweet-action--favorite.withHeartIcon .ProfileTweet-actionButtonUndo {",
" color: #FAB522;",
"}",
".ProfileTweet-action--favorite.withHeartIcon.is-animating .HeartAnimation {",
" -webkit-animation-timing-function: steps(1);",
" animation-timing-function: steps(1);",
" -webkit-animation-duration: 0.1s;",
" animation-duration: 0.1s;",
"}"
].join("\n");
css.id = "vlamtweet-css";
document.head.appendChild(css);
document.body.addEventListener("click", function(e) {
    if (!e.target.classList.contains("HeartAnimation")) return;
    var shake = 8;
    var shakeScale = 4;
    var shakeInterval = null;
    var shakeNode = document.getElementById("page-container");
    shakeInterval = setInterval(function() {
        shake -= 1;
        if (shake <= 0) {
            clearInterval(shakeInterval);
            shakeNode.style.transform = "";
        } else {
            shakeNode.style.transform = "translate("
                + Math.round(shakeScale * (Math.random() - 0.5) * shake) + "px, "
                + Math.round(shakeScale * (Math.random() - 0.5) * shake) + "px)";
        }
    }, 30);
});