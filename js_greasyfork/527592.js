// ==UserScript==
// @name        Discord: Compact layout
// @description  compact layout for discord channels, servers left pane
// @author      ivan, ffact
// @namespace   discord_styles
// @include     *://discord.com/*
// @version     1.9
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527592/Discord%3A%20Compact%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/527592/Discord%3A%20Compact%20layout.meta.js
// ==/UserScript==

GM_addStyle(`

/* Make text darker on light Discord */
.theme-light {
  --text-normal: #000;
}
/* Make background darker on dark Discord, make text darker */
.theme-dark {
  --background-primary:         #111111;
  --background-secondary:       #1a1b1f;
  --channeltextarea-background: #242527;
  --text-normal:                #adadad; /* messages */
  --interactive-active:         #d5d5d5; /* channel names */
  --header-primary:             #d5d5d5; /* usernames */
}
/* Fix font-family */
:root {
  --font-primary: sans-serif !important;
  --font-display: sans-serif !important;;
  --font-headline: sans-serif !important;;
  --font-code: monospace !important;;
}
/* Reduce the font sizes slightly */
div[id^="message-content-"],
div[class^="channelName-"],
span[class^="username-"] {
  font-size: 11pt;
}
div[id^="message-content-"] code,
div[id^="message-content-"] code.inline {
  font-size: 12px;
}
/* Remove bold font-weight on 1.0 pixel scaling */
@media (-webkit-max-device-pixel-ratio: 1) {
  .theme-light {
    font-weight: inherit;
  }
}

/**
 * Replace server icons in sidebar with text labels
 */
:root {
  --custom-guild-list-width: 240px;
}

div[aria-label="Servers"] > div[class^="listItem__"] > div[class^="pill_"],
div[aria-label="Servers"] > div > ul > div > div[class^="pill_"] {
  /**
   * Fix the height of the indicator pills on the left edge.
   * We cannot display: none them because
   * 1) we have no other way of indicating the active server. CSS4 :has is not yet implemented.
   * 2) Discord relies on the pills for the drag-to-arrange to work.
   */
  height: 26px;

  /* Make the pills less bright */
  opacity: 0.55;
}
/* i'm probably tripping but pills for folders have different align */
div[aria-label="Servers"] > div[class^="wrapper__"] > div > div[class^="pill_"] {

  height: 24px;

  /* Make the pills less bright */
  opacity: 0.55;
}

/* The pilled (selected) server will have "40px" in the style when selected.
 * Use this information to set a background color for the selected server.
 *
 * :has isn't supported in any browser yet :(
 */
/*div[aria-label="Servers"] > div:has(> div[aria-hidden="true"] > span[style*="40px"]) {
  background-color: #ffffff22;
}*/

.folderHeader__48112 {
  width: unset !important;
  height: unset !important;
}



div[aria-label="Servers"] > div > div > div[data-dnd-name][draggable="true"] > div,
div[aria-label="Servers"] > div > ul > div > div > div[data-dnd-name][draggable="true"] > div,
div[aria-label=Servers] > div > div > div[data-dnd-name][draggable=true] .folderButton__48112 > div {
  /* Constrain width so that the badges don't run into the very right edge of the servers sidebar */
  width: calc(var(--custom-guild-list-width) - 20px) !important;
  height: 20px !important;
  overflow: hidden !important;
}


div[aria-label="Servers"] > div > div > div[data-dnd-name][draggable="true"] > div > svg,
div[aria-label="Servers"] > div > div > div[data-dnd-name][draggable="true"] > div > div > svg,
div[aria-label="Servers"] > div > ul > div > div > div[data-dnd-name][draggable="true"] > div > svg {
  /* Discord is insane and has the click handler inside the animated SVG icon for the server.
   * We need to make the SVG big so that clicking anywhere in the apparent rectangle lands your click inside the SVG. */
  width: var(--custom-guild-list-width);
  height: var(--custom-guild-list-width);
  /* Center it so that clicks are not impeded by its circular nature */
  margin-top: calc(-0.5 * var(--custom-guild-list-width));
  /* We can't even set visibility: hidden, that breaks the click handler.
   * If you need to debug, set opacity above 0. */
  opacity: 0.0;
}

/* Add the text labels. */
div[aria-label="Servers"] > div > div > div[data-dnd-name][draggable="true"]::before ,
div[aria-label="Servers"] > div > ul > div > div > div[data-dnd-name][draggable="true"]::before {
  color: var(--text-normal);
  content: attr(data-dnd-name); /* Combine image and text */
  white-space: nowrap;
  position: absolute;
  left: 16px;
  top: 5px;
  font-size: 11pt;
  /* Constrain the width to avoid running into the new message count badge */
  width: calc(var(--custom-guild-list-width) - 57px);
  overflow-x: hidden;
  /* Need to set a height to avoid a scrollbar after using overflow-x
   * Use a height large enough to not cut off glyph shapes below the baseline
   * (update) adjusted cuz added the folder image*/
  height: 15pt;
  /* Don't handle click events; pass clicks through to the svg below. */
  pointer-events: none;
}

/* add folder icon */
div[aria-label="Servers"] > div[class^="folderGroup__"] > div > div[data-dnd-name][draggable="true"]::before {
  content: "📂" " " attr(data-dnd-name); /* Combine image and text */
}



/* fix expanded folder background and set rounded corners */
div[aria-label="Servers"] > div > span {
  width: calc(var(--custom-guild-list-width) - 20px);
  border-radius: 6px;
}

/* set expanded folder bottom padding */
div[aria-label="Servers"] > div [class^="wrapper__"] > div[class^="folderEndWrapper_"] {
  height: 7px;
}

/* expanded folder background fix */
ul[id^="folder-items"] {
  height: unset !important;
}

div[class^="folderEndWrapper_"] {
  height: 7px !important;
}

/* fixes for the new sidebar and new centering of icons */

div[class^="listItem"] {
  justify-content: left;
}
body {
--custom-guild-sidebar-width: 500px !important;
}

/* expand separator*/
.guildSeparator__252b6{
  width: calc(var(--custom-guild-list-width) - 12px) !important;
}

/* perfect for gordeous looks */
/* changes the direct messages button and aligning everything*/
div[class^="wrapper_cc5dd2"] {
  height: 31px !important;
}

/* also paddings for DM add server etc */
div[class^="tutorialContainer__"] > div > div > div > svg {
  top:-4px;
  left:4px;
  height: 40px !important;
  width: 40px !important;
}

.childWrapper__6e9f8, .wrapper__6e9f8 {
  height: 40px;
}


`);