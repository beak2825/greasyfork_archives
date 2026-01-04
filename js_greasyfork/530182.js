// ==UserScript==
// @name         (Firefox) Discord fix: devmode copy ID & copy message link
// @description  Fix broken Discord channel/thread/message devmode "Copy ID" and "Copy Message Link" buttons in Firefox.
// @author       You
// @version      0.6
// @namespace    https://greasyfork.org/users/1376767
// @match        https://discord.com/*
// @grant        GM_setClipboard
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/530182/%28Firefox%29%20Discord%20fix%3A%20devmode%20copy%20ID%20%20copy%20message%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/530182/%28Firefox%29%20Discord%20fix%3A%20devmode%20copy%20ID%20%20copy%20message%20link.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function addClickEventCopyId(node) {
    const match = node.id.match(/(\d+)$/); // id="channel-context-devmode-copy-id-123456" > extract end digits
    if (match) {
      const channelId = match[1];
      node.addEventListener(
        'click',
        function(event) { GM_setClipboard(channelId); },
        { once: true }
      );
    }
  }


  var selectedLink = null;
  function addClickEventCopyMessageLink(node) {
    if (selectedLink) {
      // Extract guild id from href
      const guildIdRegex = /^.*?discord\.com\/channels\/(\d+)\//;
      const guildIdMatch = window.location.href.match(guildIdRegex);
      let guildId = null;
      if (guildIdMatch) {
        guildId = guildIdMatch[1]

        // Extract channel+message id from selected__ div
        const listItemId = selectedLink.getAttribute('data-list-item-id');
        if (listItemId) {
          const listItemIdRegex = /-(\d+)-(\d+)$/; // data-list-item-id="messages___chat-messages-12345-135464"
          const listItemIdMatch = listItemId.match(listItemIdRegex);
          if (listItemIdMatch) {
            const channelId = listItemIdMatch[1];
            const messageId = listItemIdMatch[2];

            const fullDiscordURL = `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
            // console.log("==> discord url: ", fullDiscordURL)

            node.addEventListener(
              'click',
              function(event) { GM_setClipboard(fullDiscordURL); },
              { once: true }
            );
          }
        }
      }
    }
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      // Process added nodes
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // console.log("==> mutation: ", node)

          if (/clickTrapContainer_.*trapClicks_/.test(node.className)
            || (node.className.toString().startsWith("clickTrapContainer_") && node.firstChild?.id?.toString().startsWith("popout_")))
          {
            const menu = node;
            menu.querySelectorAll('[role="menuitem"][id*="-devmode-copy-id-"]').forEach(menuItem => {
              setTimeout(() => addClickEventCopyId(menuItem), 100);
            });
            menu.querySelectorAll('[role="menuitem"][id$="-copy-link"]').forEach(menuItem => {
              setTimeout(() => addClickEventCopyMessageLink(menuItem), 100);
            });
          }
        }
      });

      // Process attribute changes (specifically class changes)
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          if (target instanceof HTMLElement) {
            for (const className of target.classList) {
              if (className.startsWith('selected__')) {
                // console.log("'selected__' div:", target);
                selectedLink = target;
                break;
              }
            }
          }
        }

    });
  });

  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
})();