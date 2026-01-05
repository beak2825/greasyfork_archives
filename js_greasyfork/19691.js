// ==UserScript==
// @name           Leprosorium WebM Link
// @description    Замена неработающего в Safari webm-плеера на ссылку
// @icon           https://s3.eu-central-1.amazonaws.com/mobody/img/webmlinklogo.png
// @include        *://*leprosorium.ru/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require        https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @grant          GM_addStyle
// @version        0.0.5.20160516
// @namespace      https://greasyfork.org/en/users/43667-mobody
// @downloadURL https://update.greasyfork.org/scripts/19691/Leprosorium%20WebM%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/19691/Leprosorium%20WebM%20Link.meta.js
// ==/UserScript==

waitForKeyElements (".post, .comment", actionFunction);
function actionFunction (jNode) {
    if (typeof this.lastNode == "undefined" || this.lastNode != jNode[0]) {
        $(".js-media_player").each(function() {
            var $this = $(this);
            var _href = $this.find("source").attr("src");
            if ($this.find("source").attr("type").indexOf("video/webm") >= 0 ) {
                $this.replaceWith("<a href='"+ _href +"' target='_blank'><img src='https://s3.eu-central-1.amazonaws.com/mobody/img/webmcover.png'></a>");
            }
        });
    }
    this.lastNode = jNode[0];
    return true;
}