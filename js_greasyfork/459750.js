// ==UserScript==
// @name         BingCollector
// @version      1.2.7
// @namespace    optionsx
// @description  get bingchat faster, earn points everyday
// @author       github.com/optionsx
// @match        https://www.bing.com/
// @match        https://www.bing.com/?FORM=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459750/BingCollector.user.js
// @updateURL https://update.greasyfork.org/scripts/459750/BingCollector.meta.js
// ==/UserScript==

(async () => {
  try {
    const source = await fetch(
      "https://www.bing.com/rewardsapp/flyoutdata?channel=BingFlyout"
    ).then((res) => res?.json());

    if (
      // not logged in or unsupported country
      source.IsAuthenticated !== true
    )
      return;

    // regex to get max search count && current search count in the source :)
    const maxSearch =
      source.FlyoutResult.UserStatus.Counters.PCSearch[0].PointProgressMax;
    let searchCount =
      source.FlyoutResult.UserStatus.Counters.PCSearch[0].PointProgress;

    // fetch random questions
    while (++searchCount < maxSearch) {
      const question = await fetch("https://www.boredapi.com/api/activity")
        .then((res) => res.json())
        .then((res) => res.activity);
      let url = `https://www.bing.com/search?q=${question}`;
      let newTab = GM_openInTab(url, { active: false, setParent: true });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      newTab.close();
    }
  } catch (err) {
    console.error(err);
  }
})();

// if (await GM.getValue("count") === 0 && await GM.getValue("day") !== day) {
//     const source = await fetch(
//         "https://www.bing.com/rewardsapp/flyoutdata?channel=BingFlyout&partnerId=BingRewards",
//     ).then(res => res?.json())
//     if (source.IsAuthenticated !== true && source.IsRewardsUser !== true && source.IsUnsupportedCountry === false) return; // not logged in or unsupported country
//     // itterate through urlReward bonuses
//     for (let i = 0; i < source.FlyoutResult.MorePromotions.length; i++) {
//         const el = source.FlyoutResult.MorePromotions[i];
//         if (el.Complete !== true && el.IsRewardable === true) {
//             const newTab = GM_openInTab(el.DestinationUrl, { active: false, setParent: true })
//             await new Promise((resolve) => setTimeout(resolve, 1500));
//             newTab.close();
//         }
//     }

// itterate through search bonuses
// for (let i = 0; i < source.FlyoutResult.UserStatus.Counters['PCSearch'].length; i++) {
//     const el = source.FlyoutResult.UserStatus.Counters['PCSearch'][i];
//     if (el.Complete !== true && el.IsRewardable === true && el.PromotionType === "Search") {
//         const newTab = GM_openInTab(el.DestinationUrl, { active: false, setParent: true })
//         await new Promise((resolve) => setTimeout(resolve, 1500));
//         newTab.close();
//     }
// }
