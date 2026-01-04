// ==UserScript==
// @name         Kong No Badges
// @namespace    https://github.com/svogal
// @version      1.0
// @description  Hides badges on Kongregate
// @author       svogal
// @match        https://www.kongregate.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407116/Kong%20No%20Badges.user.js
// @updateURL https://update.greasyfork.org/scripts/407116/Kong%20No%20Badges.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const display_none = `

#main_nav_achievements
#achievements
.achievement
.game_badges
.game_stat_badges
.badge-cont

#accomplishments_pane_title
.accomplishment_vtabs
.accomplishment_vtabpane_inner

.points

#blocks
.blocks_sec

#user_progress_bar_container

`;
    const visibility_hidden = `

.badge_count
.feature_roll_badge_of_the_day .copy *
#home .home_feat_roll .featured_game .tagline

`;
    const fmt = t => t.split('\n').map(s => s.split('/')[0].trim()).filter(s => s).join();
    const style = document.createElement('style');
    style.textContent = fmt(display_none) + '{ display: none; }' +
        fmt(visibility_hidden) + '{ visibility: hidden; }';
    document.head.appendChild(style);
})();
