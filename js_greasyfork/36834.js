// ==UserScript==
// @name         OnePeloton.com Peloton Cycle Infinite Scroll
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically loads all workouts for any One Peloton / Peloton Cycle profile. Infinite scrolling, no need to click "more workouts". Come join the largest Peloton community in the world (and member-run) at www.reddit.com/r/pelotoncycle, where we compare workout stats, join large group rides and trade tips with 86,000+ members worldwide!
// @author       Matt Taylor
// @match        https://members.onepeloton.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/36834/OnePelotoncom%20Peloton%20Cycle%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/36834/OnePelotoncom%20Peloton%20Cycle%20Infinite%20Scroll.meta.js
// ==/UserScript==

$("document").ready(function() {
    setInterval(function() {
        $('[data-test-id="moreWorkoutsButton"]').trigger('click');},1000);
});