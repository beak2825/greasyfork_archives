// ==UserScript==
// @name         Scale Player Status Icons
// @namespace    https://github.com/sulsay/torn
// @version      1.0
// @description  Allows you the reduce the size of your player status icons
// @author       Sulsay [2173590]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/388717/Scale%20Player%20Status%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/388717/Scale%20Player%20Status%20Icons.meta.js
// ==/UserScript==

const settings = {
    iconScaleFactor: .8,
    spaceBetweenIconsFactor: .7,
};

const DEFAULT_ICON_OFFSET_PER_ICON = -18;
const DEFAULT_ICON_VIEWPORT_SIZE = 16;
const DEFAULT_ICON_MARGIN = 10;
const DEFAULT_SPRITESHEET_WIDTH = 1384;

const iconSize = DEFAULT_ICON_VIEWPORT_SIZE * settings.iconScaleFactor;
const iconMargin = DEFAULT_ICON_MARGIN * (settings.iconScaleFactor * settings.spaceBetweenIconsFactor);

const stylesForEveryIconListItem = [
    `width: ${iconSize}px !important`,
    `height: ${iconSize}px !important`,
    `margin-right: ${iconMargin}px !important`,
    `margin-bottom: ${iconMargin}px !important`,
    `background-size: ${DEFAULT_SPRITESHEET_WIDTH * settings.iconScaleFactor}px auto`,
];

const iconBackgroundPositions = [];
for (let i = 0; i < 77; i++) {
    iconBackgroundPositions.push(`ul[class*="status-icons_"] > li[class*="icon${i + 1}_"] {background-position: ${i * DEFAULT_ICON_OFFSET_PER_ICON * settings.iconScaleFactor}px 0 !important;}`);
}

GM_addStyle([
    `ul[class*="status-icons_"] > li {${stylesForEveryIconListItem.join(';')}}`,
    ...iconBackgroundPositions,
].join('\n'));