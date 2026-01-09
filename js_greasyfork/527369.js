// ==UserScript==
// @name         Telegram WebK Message Hider
// @namespace    https://github.com/sinancetinkaya/Telegram-WebK-Message-Hider
// @version      2026-01-09
// @license      MIT
// @description  Hides messages from unwanted users in Telegram groups
// @author       sinancetinkaya
// @match        https://web.telegram.org/k/*
// @icon         https://web.telegram.org/favicon.ico
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/527369/Telegram%20WebK%20Message%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/527369/Telegram%20WebK%20Message%20Hider.meta.js
// ==/UserScript==

(
  async () => {
    console.log("Telegram Message Hider has been started");

    async function handleMessageNode(node) {
			// console.log(node);
      let is_message = node.matches("div[class='bubbles-group'],[class^='bubbles-group bubbles-group-']");

      if (!is_message) { return; }

      let message = node.querySelector("*[class='peer-title'][data-peer-id][data-with-premium-icon]")

      if (!message) { return; }

      let user_id = message.getAttribute("data-peer-id");
      let user = await GM_getValue(user_id, false);
      // console.log(`${user_id}`);

      if (!user) { return; }

      console.log(`hiding the message from id='${user_id}' name='${user['name']}' reason='${user['reason']}'`);

      // let bubbles_group = message.closest("div[class='bubbles-group'],[class^='bubbles-group ']");

      // make color and background of the elements inside the message group
      var all = node.getElementsByTagName("*");

      // do not remove nodes because it messes with scrolling chat messages
      for (var i=0, max=all.length; i < max; i++) {
        all[i].style.opacity = 0;
        //all[i].style.backgroundColor = "black";
      }
    }


    async function walk(node)
    {
      if (!node.nodeType) { return; }

      let child = null;
      let next = null;

      //console.log(node.nodeType);

      switch (node.nodeType)
      {
        case 1: // Element
        case 9: // Document
        case 11: // Document fragment
          await handleMessageNode(node);

          child = node.firstChild;
          while (child)
          {
            next = child.nextSibling;
            walk(child);
            child = next;
          }
          break;
      }
    }


    async function mutationHandler(mutationRecords)
    {
      for (const {type, addedNodes} of mutationRecords)
      {
        if (type === "childList" && typeof addedNodes === "object" && addedNodes.length)
        {
          for (const node of addedNodes)
          {
            await walk(node);
          }
        }
      }
    }

    const observer = new MutationObserver(mutationHandler);
    observer.observe(
      document.querySelector("#column-center"),
      {childList: true, subtree: true, attributeFilter: ["class"]}
    );

  }

)();
