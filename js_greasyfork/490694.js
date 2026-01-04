// ==UserScript==
// @name        De-bloat Twitch
// @description Fixes Twitch -isms and hides parts of the UI that I find annoying
// @namespace   https://faulty.equipment/
// @match       https://www.twitch.tv/*
// @version     1.1
// @grant       GM_addStyle
// @license     GNU AGPLv3
// @icon        https://www.google.com/s2/favicons?domain=twitch.tv
// @downloadURL https://update.greasyfork.org/scripts/490694/De-bloat%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/490694/De-bloat%20Twitch.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
/* Hide front page carousel */
.front-page-carousel { display: none; }

/* Hide "watch streak" part of the points menu */
div[aria-describedby=channel-points-reward-center-body] .scrollable-area.scrollable-area--suppress-scroll-x + div { display: none; }

/* Hide top gifters/etc */
.chat-room__content > div:has(.bits-leaderboard-expanded-top-three-entry),
.chat-room__content > div:has(.channel-leaderboard-header-rotating__users) { display: none; }

/* Hide follower/sub goals */
.about-section__actions--wide:has(div[role=progressbar]) { display:none; }

/* List-style rewards */
.rewards-list {
  flex-wrap: nowrap !important;
  flex-direction: column;
}
.reward-list-item {
  width: initial !important;
  position: relative;
  margin-bottom: 0.5rem !important;
}
div.reward-icon--large {
  height: 2.5rem;
  width: 9rem;
}
.reward-icon__image { display: none !important; }
.reward-list-item button + div {
  position: absolute;
  top: 0;
  left: 10rem;
  pointer-events: none;
  padding-top: 0 !important;
  display: flex;
  align-items: center;
  height: 100%;
}
div.reward-icon__cost {
  height: initial;
  position: relative !important;
}
#channel-points-reward-center-body  { margin-top: 5rem; }
#channel-points-reward-center-body:has(.rewards-list) {
  margin-top: 0;
}

/* Taller points menu */
div[aria-describedby=channel-points-reward-center-body] > div {
  --menu-height: 40rem;
  max-height: var(--menu-height) !important;
}
div.reward-center__content { height: var(--menu-height); }

/* Compact points menu header */
#channel-points-reward-center-header { display: none !important; }
.rewards-list .esGgHZ { padding-top: 0 !important; }
div.reward-center__content .tw-popover-header {
  position: absolute;
  right: 0;
  width: 130px;
  border: 0 !important;
  box-shadow: none !important;
  z-index: 10;
}
.rewards-popover-header {
    flex-direction: row-reverse !important;
    align-items: center;
    justify-content: space-between;
}

/* Hide bit count in rewards button */
button[aria-label='Bits and Points Balances'] div.chMBew > div.kKpGeT:has(svg) + div,
button[aria-label='Bits and Points Balances'] div.chMBew > div.kKpGeT:has(svg) {
    display: none !important;
}
`);

  // Util hack for rendering shenanigans (ie. Twitch is a slow mess)
  const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

  async function run() {
    // Wait a bit (Twitch page is sloooow)
    await wait(7000);
    // Auto-click dismiss monthly recap
    document.querySelector(".tw-callout__close button")?.click();

    // More powerup removal that needs logic because CSS isnt the best touring machine
    document.querySelector("button[aria-label='Bits and Points Balances']")?.addEventListener("click", async () => {
      await wait(200);
      // Remove powerups
      const powerup = document.querySelector(".rewards-list > div:has(>p)");
      while (powerup.nextElementSibling.firstElementChild.tagName != 'P') powerup.nextElementSibling.remove();
      powerup.remove();
    });
  }
  run();

})();