// ==UserScript==
// @name        Cloudbot Fixes - Mapper walk waypoint
// @namespace   cloudbot_fixes.mapper_walk_waypoint
// @description Cloudbot Fixes
// @version     1.0.0
// @include     https://cloudbot.site/mapper*
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/405753/Cloudbot%20Fixes%20-%20Mapper%20walk%20waypoint.user.js
// @updateURL https://update.greasyfork.org/scripts/405753/Cloudbot%20Fixes%20-%20Mapper%20walk%20waypoint.meta.js
// ==/UserScript==

$(document).ready(() => {
    const $btnsContainer = $(".btnCoord").parent();

    const $walkBtn = $("<button/>");
    $walkBtn.attr("id", "door");
    $walkBtn.attr("class", "btn btn-secondary btnCoord");
    $walkBtn.text('walk');

    $btnsContainer.append($walkBtn);

    $walkBtn.on("click", () => {
        unsafeWindow.appendWaypoint("walk");
    });
});
