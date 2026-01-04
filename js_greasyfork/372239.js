// ==UserScript==
// @name         F8 - Polarity Tweets
// @author       Eisenpower
// @namespace    Uchiha Clan
// @version      1.0
// @description  Unleashes Your Sharingan
// @icon         https://i.imgur.com/M0jWVYS.png
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/372239/F8%20-%20Polarity%20Tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/372239/F8%20-%20Polarity%20Tweets.meta.js
// ==/UserScript==

$(document).ready(function() {
    if (!document.querySelector('[class="panel-heading"]').textContent.includes('Tweet Reputation Polarity Instructions')) return;

    if (!document.querySelector('twitterwidget')) document.querySelector('[value="NoTweet"]').click();

    setTimeout(CHECK, 5000);
});

function CHECK () {
    var buttons = document.querySelectorAll('[name="sentiment"]');
    var checked = false;

    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].checked) {
            checked = true;
        }
    }

    if (checked) document.getElementById('submitButton').click();

    else setTimeout(CHECK, 500);
}