// ==UserScript==
// @name        Melvor Idle - Mastery Enhancements
// @description Adds mastery pool progress bars to skills in the menu
// @version     1.5
// @namespace   Visua
// @match       https://*.melvoridle.com/*
// @exclude     https://wiki.melvoridle.com*
// @noframes
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/414199/Melvor%20Idle%20-%20Mastery%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/414199/Melvor%20Idle%20-%20Mastery%20Enhancements.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

// Code by Acrone#1563, Aurora Aquir#4272, Breindahl#2660, NotCorgan#1234 and Visua#9999

((main) => {
    var script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    'use strict';

    function addProgressBars() {
        const MAX_XP = 13034432;
        const maxedSkills = [];
        setInterval(() => {
            for (const [skillId, mastery] of Object.entries(MASTERY)) {
                const poolPercentage = (mastery.pool / getMasteryPoolTotalXP(skillId)) * 100;
                if ($(`#skill-nav-mastery-${skillId} .progress-bar`)[0]) {
                    $(`#skill-nav-mastery-${skillId} .progress-bar`)[0].style.width = (poolPercentage) + '%';
                    const tip = $(`#skill-nav-mastery-${skillId}`)[0]._tippy;
                    tip.setContent(poolPercentage.toFixed(2) + '%');
                } else {
                    const skillItem = $(`#skill-nav-name-${skillId}`)[0].parentNode;
                    skillItem.style.flexWrap = 'wrap';
                    skillItem.style.setProperty('padding-top', '.25rem', 'important');
                    const progress = document.createElement('div');
                    const progressBar = document.createElement('div');
                    progress.id = `skill-nav-mastery-${skillId}`;
                    progress.className = 'progress active pointer-enabled';
                    progress.style.height = '2px';
                    progress.style.width = '100%';
                    progress.style.margin = '.25rem 0rem';
                    progress.style.setProperty('background', 'rgb(76,80,84)', 'important');
                    progressBar.className = 'progress-bar bg-warning';
                    progressBar.style.width = poolPercentage + '%';
                    progress.appendChild(progressBar);
                    skillItem.appendChild(progress);
                    tippy($(`#skill-nav-mastery-${skillId}`)[0], {
                        placement: 'right',
                        content: poolPercentage.toFixed(2) + '%'
                    });
                }
                if (!maxedSkills[skillId] && !mastery.xp.some(xp => xp < MAX_XP)) {
                    maxedSkills[skillId] = true;
                    $(`#skill-nav-mastery-${skillId} .progress-bar`)[0].classList.replace('bg-warning', 'bg-success');
                }
            }
        }, 5000);
    }

    function loadScript() {
        if (typeof confirmedLoaded !== 'undefined' && confirmedLoaded) {
            clearInterval(interval);
            console.log('Loading Mastery Enhancements');
            addProgressBars();
        }
    }

    const interval = setInterval(loadScript, 500);
});
