// ==UserScript==
// @name         Internet Roadtrip - Vote Failed Notification
// @namespace    me.netux.site/user-scripts/neal-internet-roadtrip/vote-failed-notification
// @match        https://neal.fun/*
// @icon         https://cloudy.netux.site/neal_internet_roadtrip/vote-failed%20logo.png
// @version      1.2.0
// @author       netux
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @description Replace the "Voted" with a "Vote Failed" image when the vote endpoint returns a non-success result on neal.fun/internet-roadtrip
// @downloadURL https://update.greasyfork.org/scripts/537361/Internet%20Roadtrip%20-%20Vote%20Failed%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/537361/Internet%20Roadtrip%20-%20Vote%20Failed%20Notification.meta.js
// ==/UserScript==

/* globals IRF, VM */

(async () => {
  const containerVDOM = await IRF.vdom.container;

  GM_addStyle(`
  body.last-vote-failed .voted .voted-icon {
    content: url("https://cloudy.netux.site/neal_internet_roadtrip/vote-failed.png");
  }
  `);

  const debugSettings = GM_getValue("DEBUG", {});

  containerVDOM.state.vote = new Proxy(containerVDOM.methods.vote, {
    apply(ogVote, thisArg, args) {
      document.body.classList.toggle('last-vote-failed', false);

      const ogFetch = unsafeWindow.fetch;
      unsafeWindow.fetch = new Proxy(ogFetch, {
        apply(ogFetch, thisArg, args) {
          if (!(args[0]?.includes?.('/vote') ?? true)) {
            return ogFetch.apply(thisArg, args);
          }

          if (debugSettings.forceFail) {
            const body = JSON.parse(args[1].body);
            delete body.token;
            args[1].body = JSON.stringify(body);
          }

          const result = ogFetch.apply(thisArg, args);

          result.then((res) => {
            const isError = Math.floor(res.status / 100) !== 2;
            document.body.classList.toggle('last-vote-failed', isError);

            if (isError) {
              setTimeout(() => {
                containerVDOM.state.showVotedAnim = false;
                containerVDOM.state.voted = false;
                //containerVDOM.state.$forceUpdate();
              }, 500);
            }
          });

          return result;
        }
      });

      const result = ogVote.apply(thisArg, args);

      unsafeWindow.fetch = ogFetch;

      return result;
    }
  })
})();
