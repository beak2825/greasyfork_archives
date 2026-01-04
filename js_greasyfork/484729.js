// ==UserScript==
// @name        Command alias - go
// @namespace   https://shinyuu.net
// @match       https://wolfery.com/*
// @grant       none
// @version     1.0
// @author      Shinyuu Wolfy
// @description Allows to navigate between rooms using '.' as a shortcut
// @license     Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/484729/Command%20alias%20-%20go.user.js
// @updateURL https://update.greasyfork.org/scripts/484729/Command%20alias%20-%20go.meta.js
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

waitForElm('.console-editor').then(async () => {
  await app.loadBundle({
    tinygo: class {
      constructor(app) {
        this.app = app;

        this.app.require([ 'cmd', 'cmdLists', 'help' ], this._init.bind(this));
      }

      _init(module) {
        this.module = module;
        const ListStep = Object.getPrototypeOf(this.module.cmd.cmds._keys.go.next).constructor;
        this.module.cmd.addCmd({
          key: 'tinygo',
          next: new ListStep('exitId', this.module.cmdLists.getInRoomExits(), {
            name: "exit",
            textId: 'exitKey',
            errRequired: () => new Err('go.exitRequired', "Where do you want to go?"),
          }),
          value: this.go.bind(this),
          symbol: '.',
        });
      }

      go(ctx, p) {
        return ctx.char.call('useExit', p.exitId
          ? { exitId: p.exitId }
          : { exitKey: p.exitKey },
        );
      }
    }
  });
});