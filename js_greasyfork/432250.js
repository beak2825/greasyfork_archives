// ==UserScript==
// @name         Elimination DarkMode Fix
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Anti epileptic script
// @author       Jox [1714547]
// @match        https://www.torn.com/competition.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/432250/Elimination%20DarkMode%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/432250/Elimination%20DarkMode%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

GM_addStyle ( `

/*https://www.torn.com/css/style/competition/elimination/elimination.css?v=e4d9d7242*/

.d .competition-list>li.current {
    background-color: #3a5c3d;
}

.d .top-teams-wrap .competition-list>li.eliminated {
    background-color: var(--elimination-team-list-background-color);
}

.d .top-teams-wrap .competition-list>li.before-eliminated .list-cols>li.members .qty {
    border-right: 1px solid var(--default-panel-divider-outer-side-color);
    transition: 200ms;
    animation: none;
}
.d .top-teams-wrap .competition-list>li.eliminated .list-cols {
    background-color: var(--elimination-team-list-background-color);;
}

.d .recent-attacks-wrap .competition-list .list-cols>li.team.lost:last-of-type:after {
    background-color: var(--elimination-attacks-team-lost-background-color)
}

@keyframes defaultBeforeEliminatedPulsing {
    0% {
        background-color: #5e2f2f;
        background-color: var(--default-bg-panel-color)
    }

    45% {
        background-color: #553434
    }

    55% {
        background-color: #553434
    }

    100% {
        background-color: #5e2f2f;
        background-color: var(--default-bg-panel-color)
    }
}

@keyframes newRecentAttackLost {
    0% {
            background-color: #5a453d
        }

        33% {
            background-color: #3b2d28
        }

        100% {
            background-color: #3f3735
        }
}

@keyframes newRecentAttackWon {
     0% {
            background-color: #505d44
        }

        33% {
            background-color: #32382b
        }

        100% {
            background-color: #373b35
        }
}

    @keyframes newRecentAttackLostMobile {
        0% {
            background-color: #5a453d
        }

        33% {
            background-color: #3b2d28
        }

        100% {
            background-color: #3f3735
        }
    }

    @keyframes newRecentAttackWonMobile {
        0% {
            background-color: #505d44
        }

        33% {
            background-color: #32382b
        }

        100% {
            background-color: #373b35
        }
    }

 `);
})();