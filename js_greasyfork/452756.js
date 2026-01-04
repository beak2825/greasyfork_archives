// ==UserScript==
// @name         Better Geoguessr home page
// @version      0.7.1
// @description  Rearrange or add some sections in Geoguessr's pages to improve navigation
// @author       victheturtle#5159
// @license      MIT
// @match        https://www.geoguessr.com/*
// @icon         https://www.svgrepo.com/show/14443/home.svg
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @downloadURL https://update.greasyfork.org/scripts/452756/Better%20Geoguessr%20home%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/452756/Better%20Geoguessr%20home%20page.meta.js
// ==/UserScript==

const activitiesURI = "data:image/png;base64,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"


function remove(elt) {
    if (elt) {
        elt.style.display = "none";
    };
}

function quickLinkHTML(redir, imgSrc, txt, hue) {
    return `
    <div>
    <a class="quick-links_linkCard__jYQFV" href="${redir}">
      <div class="card_card__kHF2y card_popOnHover__R6GKv">
        <div class="card_content__VLeBq">
          <div class="quick-links_linkCardContent__nr3gK">
            <img class="quick-links_icon__sBoko" src="/_next/static/images/${imgSrc}" style="filter: invert(0.5) sepia(1) saturate(2) hue-rotate(${hue}deg)">
            <div class="label_sizeXSmall__mFnrR label_italic__CuofN" style="filter: invert(0.5) sepia(1) saturate(2) hue-rotate(${hue}deg)">${txt}</div>
          </div>
        </div>
      </div>
    </a>
    </div>`;
}

function menuItemTertiary(redir, imgSrc) {
    return `
    <div class="menu-item-animator_container__yUWp7 menu-item-animator_moveInScale__VPaFf" data-qa="menu-item-animator-Tertiary-0" style="animation-duration: 250ms;">
      <a class="game-menu-button_link__08qnf" href="${redir}">
        <div class="game-mode-card_container__bsswf game-mode-card_shadow__c4_kI" data-rank="Tertiary">
          <div class="game-mode-card_logoWrapper__8CTWh" data-rank="Tertiary">
            <img width="480" height="320" src="${imgSrc}" class="logo_root__8odM2 logo_sizeMedium___Wdg2">
          </div>
          <div class="singleplayer_cardBackground__ne75Z singleplayer_placeholderCardBackground__hvzvF"></div>
        </div>
      </a>
    </div>`
}


function onMutation(mutation) {
    let signOutButton =
        `<div class="buttons_buttons__0B3SB" id="headerLogOutButton">
          <a class="button_link__xHa3x button_variantSecondary__lSxsR" href="/signout?target=%2Fsignin">
           <div class="button_wrapper__NkcHZ">
            <span class="button_label__kpJrA">Sign out</span>
           </div>
          </a>
         </div>`;
    let query = 'div[data-qa="header-current-user-pin"] div[class*="profile_dropdown__"]';
    if (document.querySelector(query) && document.querySelector('#headerLogOutButton') === null) {
        document.querySelector(query).innerHTML = `<div class="profile_badgesSection__9s4c2">${signOutButton}</div>`;
    }

    let twitchCard = document.querySelector('[class*=banners_twitchCard__EDWEA]');
    if (twitchCard) {
        let twitchCardRoot = twitchCard.parentElement.parentElement.parentElement;
        twitchCardRoot.innerHTML =
            `<div class="styles_rectangle___6gqv" style="padding-top: 50%">
              <a class="classic_card__8ln8N classic_explorerCard__Lahkb" href="/explorer">
               <div style="text-align: center">
                <img style="padding-top: 10%; width: 60%;" src="/_next/static/images/explorer@2x-5a0df0ffe3bdf0a5cdc87effaaf50319.png">
               </div>
              </a>
             </div>`;
        let cardLine = twitchCardRoot.parentElement.parentElement;
        let card1 = cardLine.children[0].outerHTML;
        let card2 = cardLine.children[1].outerHTML;
        let card3 = cardLine.children[2].outerHTML;
        cardLine.innerHTML = card3+card1+card2;
    }

    let tertiaryLine = document.querySelector('[class*=dynamic-layout_slotGroup__8GHwO][data-rank="Tertiary"]');
    if (tertiaryLine && tertiaryLine.children.length == 2) {
        tertiaryLine.children[1].remove();
        tertiaryLine.innerHTML = tertiaryLine.innerHTML + menuItemTertiary("/me/current", "_next/static/images/ongoing-games-17d5d709e8816159e2e85f533e9089cd.svg") + menuItemTertiary("/me/activities", activitiesURI);
    }

    let secMaps = document.querySelector(".suggested-maps_secondaryMaps__7sGKb");
    if (secMaps) {
        remove(secMaps.parentElement);
    }
    let rules = [
        ".quiz-intro_newFeatureTeaserContainer__enkwh",
        ".free-banner_banner___wg_X",
        ".trips-hero_root__zM1uN",
    ];
    for (let rule of [".quiz-intro_newFeatureTeaserContainer__enkwh", ".free-banner_banner___wg_X"]) {
        remove(document.querySelector(rule));
    }

    let quickLinks = document.querySelector(".quick-links_linkCards__cSXYQ");
    if (quickLinks && quickLinks.children.length <= 5) {
        let qlProLeagues = quickLinkHTML("/leagues", "pro-leagues-4c8490192ea73342a630fed54de61729.svg", "Pro Leagues", "20");
        let qlFriends = quickLinkHTML("/me/friends", "friends-45c0ac9e9888f817e9a5a2c8e40801aa.svg", "Friends", "310");
        let qlOngoingGames = quickLinkHTML("/me/current", "ongoing-games-c466ff6f4cbf325ddc734dbe5f88be44.svg", "Ongoing Games", "180");
        let qlActivities = quickLinkHTML("/me/activities", "activities-672774c74f9da55871296fb5ec473b59.svg", "Activities", "180");
        let qlMapMaker = quickLinkHTML("/map-maker", "map-maker-96f6a88b545e43d309bf42bd2daf03ca.svg", "Map Maker", "90");
        let qlMyMaps = quickLinkHTML("/me/maps", "my-maps-245849050abe94decea43e194b4115f2.svg", "My maps", "90");
        let qlLikedMaps = quickLinkHTML("/me/likes", "liked-maps-8b9bcb2d6db71bfe09af868dbd635cc1.svg", "Liked Maps", "90");
        quickLinks.innerHTML = qlProLeagues+qlFriends+qlOngoingGames+qlActivities+qlMapMaker+qlMyMaps+qlLikedMaps;
        remove(quickLinks.parentElement.nextSibling);
    }
}

let observer = new MutationObserver(onMutation);

observer.observe(document.body, {
  characterDataOldValue: false,
  subtree: true,
  childList: true,
  characterData: false
});
