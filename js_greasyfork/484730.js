// ==UserScript==
// @name        Extra helpful commands
// @namespace   https://shinyuu.net
// @match       https://wolfery.com/*
// @grant       none
// @version     1.0
// @author      Shinyuu Wolfy
// @description Adds a few extra handy commands 
// @license     Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/484730/Extra%20helpful%20commands.user.js
// @updateURL https://update.greasyfork.org/scripts/484730/Extra%20helpful%20commands.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

waitForElm('.console-editor').then(() => {
  app.getModule('cmd').addCmd({
    key: 'ex',
    value: (ctx) => app.getModule('listExits').listExits(ctx.char),
  });

  app.getModule('cmd').addCmd({
    key: 'unlook',
    value: async (ctx) => {
      await ctx.char.call('look', { charId: ctx.char.id });
      app.getModule('charPanel').toggle();
    }
  });
});