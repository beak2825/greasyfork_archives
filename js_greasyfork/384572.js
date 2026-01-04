// ==UserScript==
// @name         Trade Facilitator
// @namespace    LordBusiness.TF
// @version      0.8
// @description  Adds a trade icon to the People chat
// @author       LordBusiness [2052465]
// @match        https://www.torn.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/384572/Trade%20Facilitator.user.js
// @updateURL https://update.greasyfork.org/scripts/384572/Trade%20Facilitator.meta.js
// ==/UserScript==

GM_addStyle(`
    .lbs-trade-icon {
        display: inline-block;
        height: 30px;
        width: 30px;
        background: url(/images/v2/chat/recently_met_players.png) left -90px no-repeat;
    }
    .lbs-trade-icon:hover {
        filter: brightness(50%);
    }
`);

(async function() {
    'use strict';

    // Class Prefix Selector Generator
    const cp = (strings, selector) => `${strings[0]}[class^="${selector}"]${strings[1]}, ${strings[0]}[class*=" ${selector}"]${strings[1]}`,

          chatBoxWrap = await (() => {
              return new Promise(resolve => {
                  const chatWrap = document.querySelector(cp`#chatRoot ${'chat-box-wrap'}`);
                  if(chatWrap) resolve(chatWrap);
                  new MutationObserver(mutationList => {
                      for(const mutationRecord of mutationList) {
                          for(const addedNode of mutationRecord.addedNodes) {
                              if(addedNode.matches(cp`${'chat-box-wrap'}`)) resolve(addedNode);
                          }
                      }
                  }).observe(document.getElementById('chatRoot'), { childList: true });
              });
          })(),

          chatBoxPeople = document.querySelector(cp`#chatRoot ${'chat-box-people'}`),

          populateTradeButton = e => {
              // console.log(e);
              const personLI = e.target,
                    personID = personLI.querySelector(':scope > a').href.replace(/[^0-9]/g, ''),
                    chatButtonSpan = personLI.querySelector(cp`a${'chat'}`).parentNode,
                    closeButton = personLI.querySelector(cp`a${'close'}`),
                    tradeButtonSpan = chatButtonSpan.cloneNode(true),
                    tradeButton = tradeButtonSpan.querySelector(':scope > a');
              tradeButton.className = 'lbs-trade-icon';
              tradeButton.href = `https://www.torn.com/trade.php#step=start&userID=${personID}`
              if(closeButton) closeButton.parentNode.replaceWith(tradeButtonSpan);
              else chatButtonSpan.after(tradeButtonSpan);
          },

          chatBoxPeopleObserver = new MutationObserver(mutationList => {
              //console.log(mutationList)
              for(const mutationRecord of mutationList) {
                  for(const removedNode of mutationRecord.removedNodes) {
                      if(typeof removedNode.matches === 'function' && removedNode.matches(cp`div${'loader'}`)) {
                          const people = chatBoxPeople.querySelectorAll(cp`ul${'people-list'} li`);
                          for(const personLI of people) {
                              personLI.addEventListener('mouseenter', populateTradeButton, { once: true });
                          }
                          return;
                      }
                  }
              }
          });

    chatBoxPeopleObserver.observe(chatBoxPeople, { childList: true, subtree: true });
})();