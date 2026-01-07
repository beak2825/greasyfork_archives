// ==UserScript==
// @name        Discord: Compact layout
// @description  compact layout for discord channels, servers left pane
// @author      ivan, ffact
// @namespace   discord_styles
// @include     *://discord.com/*
// @version     2.12
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527592/Discord%3A%20Compact%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/527592/Discord%3A%20Compact%20layout.meta.js
// ==/UserScript==
GM_addStyle(`

:root {
  --guildbar-avatar-size: 240px;
  --guildbar-folder-size: 244px;
  --custom-channel-header-height: 48px;
}
body {
    --custom-guild-sidebar-width: 550px !important;
}

div[aria-label^="Servers"] mask {
  display: none ;
}

.cc5dd25190031396-svg {
      contain: none;
}

._48112cbe77dc5022-folderButton span > div,
._650eb104245d257b-listItem span > div,
._650eb104245d257b-listItem foreignObject,
.cc5dd25190031396-wrapper {
    width: 240px !important;
    height: 24px !important;
}

.cc5dd25190031396-shiftSVG {
    top:-2px;
}

._650eb104245d257b-listItem {
    height: 24px;
}
div[aria-label^="Servers"] img,
div[aria-label^="Servers"] ._48112cbe77dc5022-folderButton svg,
._48112cbe77dc5022-folderPreview {
        opacity: 0.0;
}

div[class*='lowerBadge'] {
    top: 4px;
}

div[class*='upperBadge'] {
    top: 4px;
    right: 25px
}

._48112cbe77dc5022-folderGroup ul {
    height: unset !important; /* very important otherwise the expanded folder is miscalculated*/
    gap: 0px !important;
}

/**/
/* adding text labels */
/**/

div[aria-label^="Servers"] div[draggable="true"]::before {
  color: black;
  content: attr(data-dnd-name); /* Combine image and text */
  white-space: nowrap;
  position: absolute;
  font-size: 11pt;
  /* Constrain the width to avoid running into the new message count badge */
  width: calc(var(--custom-guild-list-width) - 57px);
  overflow-x: visible;
  /* Don't handle click events; pass clicks through to the svg below. */
  pointer-events: none;
  left:5px;
}



div[class$="folderGroup"] div[class$="folderHeader"][draggable="true"]::before {
  content: "📁" " " attr(data-dnd-name);
  left:17px;
}
/* :3 */
div[class$="isHovering"] div[class$="folderHeader"][draggable="true"]::before,
div[class$="isExpanded"] div[class$="folderHeader"][draggable="true"]::before {
  content: "📂" " " attr(data-dnd-name);
  left:17px;
}
[class*="isExpanded"] div[class*="folderHeader"][draggable="true"]::before {
  top: 8px;
  left:20px;
}

div[id^="«r"][role="tooltip"] { /* disable tooltips on hover, they are useless, also glitchy */
    opacity: 0;
}


div[class*="scroller"] div:nth-child(1) div[class*="-listItemWrapper"]::before,
div[class*="scroller"] div:nth-child(5) div[class*="-listItemWrapper"]::before,
div[class*="scroller"] div:nth-child(6) div[class*="-listItemWrapper"]::before,
div[class*="scroller"] div:nth-child(7) div[class*="-listItemWrapper"]::before
{
    color:black;
    white-space: nowrap;
    position: absolute;
    font-size: 11pt;
    overflow-x: hidden;
    /* Don't handle click events; pass clicks through to the svg below. */
    pointer-events: none;
}

div[class*="scroller"] div:nth-child(1) div[class*="-listItemWrapper"]::before {
    content: "🦜💬 Direct Messages";
}
div[class*="scroller"] div:nth-child(5) div[class*="-listItemWrapper"]::before {
    content: "➕ Create a server";
}
div[class*="scroller"] div:nth-child(6) div[class$="-listItemWrapper"]::before {
    content: "🌐 Discover"
}
div[class*="scroller"] div:nth-child(7) div[class$="-listItemWrapper"]::before {
    content: "⬇️ Download apps"
}

div[class*="scroller"] div:nth-child(1) div[class*="-listItemWrapper"] svg,
div[class*="scroller"] div:nth-child(5) div[class*="-listItemWrapper"] svg,
div[class*="scroller"] div:nth-child(6) div[class*="-listItemWrapper"] svg,
div[class*="scroller"] div:nth-child(7) div[class*="-listItemWrapper"] svg
{
    opacity: 0;
}
`)
