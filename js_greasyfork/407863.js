// ==UserScript==
// @name        Reddit Up/Down Votes
// @namespace   https://www.reddit.com/user/XxBobTheZealotxX
// @version     1.11
// @description Displays the number of up/down votes on Reddit
// @author      XxBobTheZealotxX
// @match       https://www.reddit.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/407863/Reddit%20UpDown%20Votes.user.js
// @updateURL https://update.greasyfork.org/scripts/407863/Reddit%20UpDown%20Votes.meta.js
// ==/UserScript==

$(document).ready(function() {
    var interval = window.setInterval(intervalFunction, 2000);
    function intervalFunction() {
        if ($("[data-test-id='post-content']").length == 0) {
            return;
        }
        var root = $("[data-test-id='post-content']").first();
        var tryChildren = [3, 5, 6];
        var tryChildrenI = 1;
        var percUpvotedElement = root.children().eq(tryChildren[0]).children().eq(1);
        while (!percUpvotedElement.text().includes("%")) {
            if (tryChildrenI >= tryChildren.length) {
                return;
            }
            percUpvotedElement = root.children().eq(tryChildren[tryChildrenI]).children().eq(1);
            tryChildrenI++;
        }
        var scoreElement = root.children().first().children().first().children().eq(1);
        if (scoreElement.text() == "•") {
            return;
        }
        if (scoreElement.text().includes("k")) {
            var splitScore = scoreElement.text().substr(0, scoreElement.text().length).split(".");
            var score = parseInt(splitScore[0]) * 1000 + parseInt(splitScore[1]) * 100;
        }
        else {
            score = parseInt(scoreElement.text());
        }
        var percUpvoted = parseFloat(percUpvotedElement.text().split("%")[0]) * 0.01;
        var up = Math.round((percUpvoted * score) / (percUpvoted * 2 - 1));
        var down = up - score;
        percUpvotedElement.text(up + " Up / " + down + " Down");
    }
});