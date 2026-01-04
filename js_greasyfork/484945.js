// ==UserScript==
// @name        Kanka - Single Column Quest Elements
// @namespace   Violentmonkey Scripts
// @match       https://app.kanka.io/w/*/quests/*/quest_elements
// @exclude     https://kanka.io/en-US/campaign/210801/quests/tree
// @grant       GM_addStyle
// @version     1.0
// @author      -
// @license MIT
// @description 10/8/2023, 10:48:31 PM
// @downloadURL https://update.greasyfork.org/scripts/484945/Kanka%20-%20Single%20Column%20Quest%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/484945/Kanka%20-%20Single%20Column%20Quest%20Elements.meta.js
// ==/UserScript==

GM_addStyle (`
  @media (min-width: 768px) {
      .grid-cols-1 {
          grid-template-columns: repeat(1,minmax(0,1fr)) !important;
      }
  }

`
);
