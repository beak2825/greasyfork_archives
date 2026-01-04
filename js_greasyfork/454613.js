// ==UserScript==
// @name               Hide Useless Elements in Figma
// @name:zh-CN         隐藏 Figma 中的无用元素
// @namespace          http://tampermonkey.net/
// @description        Hide useless elements in Figma, such as floating help button, upgrade section and free team badge
// @description:zh-CN  隐藏 Figma 中的无用元素, 如悬浮帮助按钮, 付费升级提示, 免费团队标识
// @version            0.1
// @author             ReekyStive
// @match              https://www.figma.com/*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=figma.com
// @license            MIT
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/454613/Hide%20Useless%20Elements%20in%20Figma.user.js
// @updateURL https://update.greasyfork.org/scripts/454613/Hide%20Useless%20Elements%20in%20Figma.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hideHomeUpgradeSection = true;
    let hideHomeFreeTeamBadget = true;
    let hideHelpFloatButton = true;

    const style = document.createElement('style');
    style.innerHTML = ''

    if (hideHomeUpgradeSection) {
        style.innerHTML += ' .upgrade_section--divider--2MVtg { display: none !important; } '
        style.innerHTML += ' .upgrade_section--redesignedUpgradeSection--1jT8s { display: none !important; } ';
    }
    if (hideHomeFreeTeamBadget) {
        style.innerHTML += ' .team_link--freeBadge--1RTa- { display: none !important; } '
    }
    if (hideHelpFloatButton) {
        style.innerHTML += ' .help_widget--helpWidgetContainer--2uGvh { display: none !important; } ';
    }

    document.body.appendChild(style);
})();
