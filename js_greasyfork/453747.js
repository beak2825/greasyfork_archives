// ==UserScript==
// @name            Discord Classic Style
// @name:es         Estilo Clásico para Discord
// @namespace       ds.js.discord
// @author          DragShot
// @oujs:author     TheDragShot
// @icon            https://favicone.com/discordapp.com?s=32
// @description     A twist on Discord's Visual Refresh layout, in order to make it look more classic.
// @description:es  Un giro en la interfaz Visual Refresh de Discord, para hacerla verse más clásica.
// @released        2021-06-26
// @updated         2025-04-18
// @lastchanges     Increased the size of the server icons back to 48 pixels
// @copyright       2025, DragShot Software
// @homepageURL     https://dragshot.webcindario.com/software/discordcs.php
// @license         GPL-3.0-only
// @include         *discord.com/*
// @version         2.2.0
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/453747/Discord%20Classic%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/453747/Discord%20Classic%20Style.meta.js
// ==/UserScript==

// Discord Classic Style
// Copyright (C) 2025 DragShot Software
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 3, as
// published by the Free Software Foundation.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

//Helper functions
function addCSS(css) {
  var head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
}
//Styles
addCSS(`
/* Hide title bar, push notifications down */

* {
  --custom-app-top-bar-height: 0px !important;
}

/*@supports (grid-template-columns:subgrid) and (white-space-collapse:collapse) {
  [class^='container'] > [class^='base']:has(> [class^='bar']) {
    grid-template-rows: [top] 0px [titleBarEnd] min-content [noticeEnd] 1fr [end];
  }
}*/

[class^='base'] > [class^='bar'] {
  overflow: visible;
  min-height: 0px;
  height: var(--custom-app-top-bar-height);
  justify-content: end;
}

[class^='base'] > [class^='bar'] > :not([class^='trailing']) {
  display: none;
}

[class^='base'] > [class^='bar'] > [class^='trailing'] {
  margin-top: 48px;
  margin-right: -4px;
  z-index: 500;
}

/* Server/Channel list color and offsets */

[class^='base']:has(> [class^='notice']) > [class^='bar'] > [class^='trailing'] {
  margin-top: calc(48px + (37px * 2));
}

[class^='upperContainer'] > [class^='toolbar'],
[class^='container'] [class^='headerBar'] > [class^='searchBar'] {
  margin-right: calc(76px + 8px);
}

[class^='base'] [class^='sidebar'] [class^='itemsContainer'] > [class^='stack'] {
  padding-top: 12px;
  padding-bottom: 12px;
}

[class^='base'] [class^='sidebar']:has([class^='tree'] > [class^='itemsContainer'])::after {
  left: var(--custom-guild-list-width);
}

.theme-dark [class^='base'] [class^='sidebar'] [class^='tree']:has(> [class^='itemsContainer'] > [class^='stack']) {
  background: rgba(0, 0, 0, 0.45);
}

.theme-dark [class^='base'] [class^='sidebar'] [class^='sidebarList'] {
  border-color: transparent;
}

/* Round server icons */

[class^='base'] [class^='sidebar'] [role='tree'] [class^='stack'] > [class^='listItem'] > div > [class^='blobContainer']:not(:hover):not([class*='selected']) svg > foreignObject [class^='wrapper'] :is([class^='childWrapper'], img) {
  border-radius: 100%;
  overflow: hidden;
}

/* Server icon size */

[doesnt-work] {
  --guildbar-avatar-size: 48px;
}

[class^='base'] [class^='itemsContainer'] > [class^='stack'] > [class^='stack'] > [class^='listItem'] > div > div > [class^='wrapper'],
[class^='base'] [class^='itemsContainer'] > [class^='stack'] > [class^='stack'] > [class^='wrapper'] > [class^='listItem'] > [class^='folderIcon'] > [class^='wrapper'],
[class^='base'] [class^='itemsContainer'] > [class^='stack'] > div > [class^='listItem'] > div > [class^='wrapper'],
[class^='base'] [class^='itemsContainer'] > [class^='stack'] > [class^='listItem'] > div > [class^='wrapper'] {
  transform: scale(1.2) !important;
}

[class^='base'] [class^='itemsContainer'] > [class^='stack'],
[class^='base'] [class^='itemsContainer'] > [class^='stack'] > [class^='stack'] {
  gap: var(--space-md) !important;
}

[class^='base'] [class^='sidebar'] [class^='itemsContainer'] > [class^='stack'] {
  padding-top: 16px;
  padding-bottom: 16px;
}

/* Docked user panel */

[class^='base'] [class^='sidebar'] > [class^='wrapper']:has([role='tree']) {
  margin-bottom: 0px;
}

[class^='base'] [class^='sidebar'] > [class^='sidebarList'] [class^='scroller'] {
  margin-bottom: var(--custom-app-panels-height, 0);
}

[class^='base'] [class^='sidebar'] > [class^='sidebarList'] #channels {
  margin-bottom: 0px;
}

[class^='base'] [class^='sidebar'] [class^='panels']:has([class^='avatarWrapper']) {
  bottom: 0px;
  left: var(--custom-guild-list-width);
  right: 0px;
  width: calc(100% - var(--custom-guild-list-width));
  border-radius: 0px;
}

.theme-dark [class^='base'] [class^='sidebar'] [class^='panels']:has([class^='avatarWrapper']) {
  border-color: rgba(0,0,0,0.35);
  border-left-color: transparent;
}

.theme-dark [class^='base'] [class^='sidebar'] [class^='panels']:has([class^='avatarWrapper']) > div {
  background: rgba(0,0,0,0.35);
}

/* Categories in all-caps */

[class^='sidebarList'] #channels [class^='mainContent'][aria-expanded] [class*='name'],
[class^='sidebarList'] [class^='privateChannels'] [class*='HeaderContainer'] > [class^='headerText'] {
  text-transform: uppercase;
  font-size: 0.75rem;
  line-height: 0.75rem;
  font-weight: 600;
}

/* Chat text area offset */

[class^='chat'] [class^='chatContent'] [class^='channelTextArea'] {
  margin-bottom: calc(var(--custom-chat-input-margin-bottom) / 2);
}

[class^='chat'] [class^='chatContent'] [class^='typingDots'],
[class^='chat'] [class^='chatContent'] [class^='cooldownWrapper'] {
  background: var(--bg-overlay-floating,var(--chat-background-default));
  border: 1px solid transparent;
  border-bottom-color: var(--border-faint);
  border-radius: var(--radius-sm);
  padding: 0px 6px;
}

/* Darker member list */

.theme-dark [class^='chat'] [class^='membersWrap'] > [class^='members'] {
  --custom-channel-members-bg: var(--bg-base-tertiary);
}

.theme-dark [class^='container'] [class^='nowPlayingColumn'] > [class^='container'] {
  background: var(--bg-base-tertiary);
}

/* DMs call UI Fix */

[class^='callContainer'] > [class^='root'] > div > [class^='root'] {
  margin-left: auto;
  margin-right: auto;
}

[class^='callContainer'] > [class^='root'] > div > [class^='root'] > [class^='transition'] {
  margin-top: auto;
  margin-bottom: auto;
}

/* Hide full view image link */

[class^='carouselModal'] [class^='mediaArea'] [class^='originalLink'] {
  display: none;
}
`);