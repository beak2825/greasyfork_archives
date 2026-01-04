// ==UserScript==
// @name         Mattermost Dark Theme for Discord
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Let's you have the Mattermost Dark Theme in Discord
// @author       DM
// @match        https://discordapp.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/397267/Mattermost%20Dark%20Theme%20for%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/397267/Mattermost%20Dark%20Theme%20for%20Discord.meta.js
// ==/UserScript==

GM_addStyle(`
    .theme-dark {
    	--background-primary: #2F3E4E;
    	--background-secondary: #1B2C3E;
        --background-tertiary: #162332;
    	--channeltextarea-background:#2F3E4E;
    	--deprecated-panel-background:#2F3E4E;
    }
    .theme-dark .scrollerThemed-2oenus.themedWithTrack-q8E3vB .scroller-2FKFPG::-webkit-scrollbar-track-piece {
        background-color: var(--background-secondary);
        border: 3px solid var(--background-primary);
        border-radius: 7px;
    }
    .theme-dark .scrollerThemed-2oenus.themedWithTrack-q8E3vB .scroller-2FKFPG::-webkit-scrollbar-thumb {
        background-color: var(--background-tertiary);
        border-color: var(--background-primary);
    }
    .inner-zqa7da {
        border: rgba(204, 204, 204, 0.27) solid 1px;
        border-radius: 0;
    }
`);