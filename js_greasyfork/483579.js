// ==UserScript==
// @name  MyMHUI
// @namespace  https://greasyfork.org/en/users/39779
// @version  2.1.27.13.12
// @description  my mh ui modify
// @author  Elie
// @match  http://mousehuntgame.com/*
// @match  https://mousehuntgame.com/*
// @match  http://www.mousehuntgame.com/*
// @match  https://www.mousehuntgame.com/*
// @match  http://www.mousehuntgame.com/camp.php*
// @match  https://www.mousehuntgame.com/camp.php*
// @match  http://apps.facebook.com/mousehunt/*
// @match  https://apps.facebook.com/mousehunt/*
// @icon  https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/mice.png
// @require  https://code.jquery.com/jquery-2.2.2.min.js
// @license  GPL-3.0+; http://www.gnu.org/copyleft/gpl.html
// @grant  unsafeWindow
// @grant  GM_info
// @run-at  document-end
// @downloadURL https://update.greasyfork.org/scripts/483579/MyMHUI.user.js
// @updateURL https://update.greasyfork.org/scripts/483579/MyMHUI.meta.js
// ==/UserScript==

/**
 * Indicate if show debug log or not
 */
const debug = true;
/**
 * delay onmouseover execution for how many milliseconds.
 */
const hoverDelayMilliseconds = 500;
// eslint-disable-next-line no-undef
const usr = user;
const questLny = usr.quests.QuestLunarNewYearLantern;
const isLny = questLny && !questLny.is_shutdown;
const isBirthday = usr.quests.QuestSuperBrieFactory;
const isRonza = usr.quests.QuestRonza ? true : false;
const isHalloween = usr.quests.MiniEventSpookyShuffle; // QuestHalloweenBoilingCauldron;
const isGwhGo = usr.quests.MiniEventSnowballShowdown;
const isGwh =
  usr.quests.QuestIceFortress ||
  usr.quests.QuestGolemWorkshop ||
  usr.quests.QuestCinnamonTreeGrove;
/* const questBirthday = usr.quests.QuestSuperBrieFactory;
const isBirthday = questBirthday && !questBirthday.is_shutdown_enabled; // shutdown_state */
const Ranks = [
  'Novice',
  'Recruit',
  'Apprentice',
  'Initiate',
  'Journeyman/Journeywoman',
  'Master',
  'Grandmaster',
  'Legendary',
  'Hero',
  'Knight',
  'Lord',
  'Lady',
  'Baron',
  'Baroness',
  'Count',
  'Countess',
  'Duke',
  'Duchess',
  'Grand Duke',
  'Grand Duchess',
  'Archduke',
  'Archduchess',
  'Viceroy',
  'Elder',
  'Sage',
  'Fabled'
];
const Rank = trimToEmpty(usr.title_name);
const RankLevel = Ranks.indexOf(Rank);
/**
 * Location type,name,isEnabled.
 * 沒設定 isEnabled,會自動 push true.
 * 有設定的就不動.
 * 活動地點關閉後要加上 false避免誤選.
 */
const locations = [
  ['meadow', 'Meadow', true, 'Novice'],
  ['town_of_gnawnia', 'Town of Gnawnia', true, 'Recruit'],
  ['ronzas_traveling_shoppe', "Ronza's Traveling Shoppe", isRonza],
  ['windmill', 'Windmill', true, 'Apprentice'],
  ['harbour', 'Harbour', true, 'Initiate'],
  ['mountain', 'Mountain', true, 'Journeyman'],
  ['winter_hunt_fortress', 'Ice Fortress', isGwhGo],
  ['winter_hunt_workshop', 'Golem Workshop', isGwhGo],
  ['winter_hunt_grove', 'Cinnamon Hill', isGwhGo],
  ['kings_arms', "King's Arms", true, 'Apprentice'],
  ['tournament_hall', 'Tournament Hall', true, 'Apprentice'],
  ['kings_gauntlet', "King's Gauntlet", true, 'Hero'],
  ['calm_clearing', 'Calm Clearing', true, 'Journeyman'],
  ['great_gnarled_tree', 'Great Gnarled Tree', true, 'Master'],
  ['lagoon', 'Lagoon', true, 'Grandmaster'],
  ['halloween_event_location', 'Gloomy Greenwood', isHalloween],
  ['laboratory', 'Laboratory', true, 'Master'],
  ['mousoleum', 'Mousoleum', true, 'Master'],
  ['town_of_digby', 'Town of Digby', true, 'Master'],
  ['bazaar', 'Bazaar', true, 'Grandmaster'],
  ['pollution_outbreak', 'Toxic Spill', true, 'Hero'],
  ['training_grounds', 'Training Grounds', true, 'Grandmaster'],
  ['dojo', 'Dojo', true, 'Grandmaster'],
  ['meditation_room', 'Meditation Room', true, 'Grandmaster'],
  ['pinnacle_chamber', 'Pinnacle Chamber', true, 'Grandmaster'],
  ['catacombs', 'Catacombs', true, 'Legendary'],
  ['forbidden_grove', 'Forbidden Grove', true, 'Legendary'],
  ['acolyte_realm', 'Acolyte Realm', false, 'Legendary'],
  ['cape_clawed', 'Cape Clawed', true, 'Legendary'],
  ['elub_shore', 'Elub Shore', true, 'Legendary'],
  ['nerg_plains', 'Nerg Plains', true, 'Legendary'],
  ['derr_dunes', 'Derr Dunes', true, 'Legendary'],
  ['jungle_of_dread', 'Jungle of Dread', true, 'Hero'],
  ['dracano', 'Dracano', true, 'Knight'],
  ['balacks_cove', "Balack's Cove", true, 'Knight'],
  ['claw_shot_city', 'Claw Shot City', true, 'Lord'],
  ['train_station', 'Gnawnian Express Station', true, 'Lord'],
  ['fort_rox', 'Fort Rox', true, 'Baron'],
  ['queso_river', 'Queso River', true, 'Count'],
  ['queso_plains', 'Prickly Plains', true, 'Count'],
  ['queso_quarry', 'Cantera Quarry', true, 'Count'],
  ['queso_geyser', 'Queso Geyser', true, 'Count'],
  ['super_brie_factory', 'SUPER|brie+ Factory', isBirthday, 'Novice'],
  ['ss_huntington_ii', 'S.S. Huntington IV', true, 'Legendary'],
  ['seasonal_garden', 'Seasonal Garden', true, 'Lord'],
  ['zugzwang_tower', "Zugzwang's Tower", true, 'Lord'],
  ['zugzwang_library', 'Crystal Library', true, 'Lord'],
  ['slushy_shoreline', 'Slushy Shoreline', true, 'Lord'],
  ['iceberg', 'Iceberg', true, 'Lord'],
  ['sunken_city', 'Sunken City', true, 'Count'],
  ['desert_warpath', 'Fiery Warpath', true, 'Baron'],
  ['desert_city', 'Muridae Market', true, 'Baron'],
  ['desert_oasis', 'Living/Twisted Garden', true, 'Baron'],
  ['lost_city', 'Lost/Cursed City', true, 'Baron'],
  ['sand_dunes', 'Sand Dunes/Crypts', true, 'Baron'],
  ['fungal_cavern', 'Fungal Cavern', true, 'Duke'],
  ['labyrinth', 'Labyrinth', true, 'Duke'],
  ['ancient_city', 'Zokor', true, 'Duke'],
  ['moussu_picchu', 'Moussu Picchu', true, 'Grand Duke'],
  ['floating_islands', 'Floating Islands', true, 'Archduke'],
  ['foreword_farm', 'Foreword Farm', true, 'Archduke'],
  ['prologue_pond', 'Prologue Pond', true, 'Archduke'],
  ['table_of_contents', 'Table of Contents', true, 'Archduke'],
  ['bountiful_beanstalk', 'Bountiful Beanstalk', false, 'Viceroy'],
  ['school_of_sorcery', 'School of Sorcery', false, 'Viceroy'],
  ['draconic_depths', 'Draconic Depths', true, 'Viceroy'],
  ['rift_gnawnia', 'Gnawnia Rift', true, 'Count'],
  ['rift_burroughs', 'Burroughs Rift', true, 'Duke'],
  ['rift_whisker_woods', 'Whisker Woods Rift', true, 'Duke'],
  ['rift_furoma', 'Furoma Rift', true, 'Grand Duke'],
  ['rift_bristle_woods', 'Bristle Woods Rift', true, 'Grand Duke'],
  ['rift_valour', 'Valour Rift', true, 'Archduke']
];
/**
 * Environment type:id dictionary.
 */
const environmentTypeIdDictionary = {
  acolyte_realm: 1,
  meadow: 18,
  town_of_gnawnia: 28,
  ronzas_traveling_shoppe: 24,
  windmill: 30,
  harbour: 13,
  mountain: 20,
  winter_hunt_fortress: 68,
  winter_hunt_workshop: 70,
  winter_hunt_grove: 69,
  kings_arms: 38,
  tournament_hall: 37,
  kings_gauntlet: 15,
  calm_clearing: 4,
  great_gnarled_tree: 12,
  halloween_event_location: 64,
  lagoon: 17,
  laboratory: 16,
  mousoleum: 21,
  town_of_digby: 27,
  bazaar: 3,
  pollution_outbreak: 45,
  training_grounds: 29,
  dojo: 8,
  meditation_room: 19,
  pinnacle_chamber: 23,
  catacombs: 6,
  forbidden_grove: 11,
  cape_clawed: 5,
  elub_shore: 10,
  nerg_plains: 22,
  derr_dunes: 7,
  jungle_of_dread: 14,
  dracano: 9,
  balacks_cove: 2,
  claw_shot_city: 43,
  train_station: 44,
  fort_rox: 54,
  queso_river: 59,
  queso_plains: 57,
  queso_quarry: 58,
  queso_geyser: 61,
  super_brie_factory: 60,
  ss_huntington_ii: 26,
  seasonal_garden: 31,
  zugzwang_tower: 32,
  zugzwang_library: 36,
  slushy_shoreline: 39,
  iceberg: 40,
  sunken_city: 47,
  desert_warpath: 33,
  desert_city: 34,
  desert_oasis: 35,
  lost_city: 41,
  sand_dunes: 42,
  fungal_cavern: 50,
  labyrinth: 52,
  ancient_city: 51,
  moussu_picchu: 56,
  floating_islands: 63,
  foreword_farm: 65,
  prologue_pond: 66,
  table_of_contents: 67,
  bountiful_beanstalk: 71,
  school_of_sorcery: 72,
  draconic_depths: 73,
  rift_gnawnia: 46,
  rift_burroughs: 48,
  rift_whisker_woods: 49,
  rift_furoma: 53,
  rift_bristle_woods: 55,
  rift_valour: 62
};
// prettier-ignore
/**
 * Location-specific anchor points.
 */
const locationAnchor = {
  acolyte_realm: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  meadow: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  town_of_gnawnia: isLny ? null : ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  ronzas_traveling_shoppe: null,
  windmill: ['ByClassName', 'huntersHornView__timerState--type-countdown', 'huntersHornView__timerState--type-ready'],
  harbour: null,
  mountain: null,
  kings_arms: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  tournament_hall: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  kings_gauntlet: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  calm_clearing: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  great_gnarled_tree: isLny ? null : ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  lagoon: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  halloween_event_location: null,
  laboratory: isLny ? null : ['ByClassName', 'huntersHornView__timerState--type-countdown', 'huntersHornView__timerState--type-ready'],
  mousoleum: ['ByClassName', 'huntersHornView__timerState--type-countdown', 'huntersHornView__timerState--type-ready'],
  town_of_digby: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  bazaar: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  pollution_outbreak: ['ByClassName', 'camp', ''],
  training_grounds: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  dojo: isLny ? null : ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  meditation_room: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  pinnacle_chamber: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  catacombs: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  forbidden_grove: ['ByClassName', 'mousehuntHud-gameInfo', ''],
  cape_clawed: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  elub_shore: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  nerg_plains: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  derr_dunes: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  jungle_of_dread: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  dracano: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  balacks_cove: ['ByClassName', 'mousehuntHud-gameInfo', ''],
  claw_shot_city: isLny ? null : ['ByClassName', 'mousehuntHud-gameInfo', ''],
  train_station: ['ByClassName', 'camp', ''],
  fort_rox: null,
  queso_river: isLny ? null : ['ByClassName', 'huntersHornView__timerState--type-countdown', 'huntersHornView__timerState--type-ready'],
  queso_plains: ['ByClassName', 'huntersHornView__timerState--type-countdown', 'huntersHornView__timerState--type-ready'],
  queso_quarry: ['ByClassName', 'huntersHornView__timerState--type-countdown', 'huntersHornView__timerState--type-ready'],
  queso_geyser: null,
  super_brie_factory: null,
  ss_huntington_ii: isLny ? null : ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  seasonal_garden: ['ByClassName', 'mousehuntHud-gameInfo', ''],
  zugzwang_tower: ['ByClassName', 'mousehuntHud-gameInfo', ''],
  zugzwang_library: ['ByClassName', 'mousehuntHud-gameInfo', ''],
  slushy_shoreline: ['ByClassName', 'mousehuntHeaderView-gameTabs', ''],
  iceberg: ['ByClassName', 'huntersHornView__timerState--type-countdown', 'huntersHornView__timerState--type-ready'],
  sunken_city: null,
  desert_warpath: ['ByClassName', 'mousehuntHud-gameInfo', ''],
  desert_city: isLny ? null : ['ByClassName', 'mousehuntHud-gameInfo', ''],
  desert_oasis: null,
  lost_city: null,
  sand_dunes: null,
  fungal_cavern: null,
  labyrinth: null,
  ancient_city: null,
  moussu_picchu: isLny ? null : ['ByClassName', 'camp', ''],
  floating_islands: isLny ? null : null,
  foreword_farm: null,
  prologue_pond: isLny ? null : null,
  table_of_contents: null,
  rift_gnawnia: isLny ? null : ['ByClassName', 'mousehuntHud-gameInfo', ''],
  rift_burroughs: ['ByClassName', 'huntersHornView__timerState--type-countdown', 'huntersHornView__timerState--type-ready'],
  rift_whisker_woods: ['ByClassName', 'camp', ''],
  rift_furoma: ['ByClassName', 'camp', ''],
  rift_bristle_woods: ['ByClassName', 'camp', ''],
  rift_valour: null
};

(function () {
  'use strict';

  // Your code here...
  setTimeout(function () {
    // resize and move windows 10這邊的視窗(windows 10的視窗會緩慢地亂跑)
    const snuid = usr.sn_user_id;
    logging(snuid);
    /* switch (snuid) {
      case '1842354617':
        // elie
        window.resizeTo(605, 245);
        window.moveTo(0, 4);
        break;

      case '100000096968840':
        // van
        window.resizeTo(605, 245);
        window.moveTo(0, 245);
        break;

      case '100000122134338':
        // hsilung
        window.resizeTo(605, 245);
        window.moveTo(0, 486);
        break;

      case 'hg_7b359afdc278e154c3c6f5c6a2f1ba31':
        // vera
        window.resizeTo(605, 245);
        window.moveTo(0, 730);
        break;

      case '468834843316798':
        // raphael
        window.resizeTo(605, 245);
        window.moveTo(595, 4);
        break;

      case '1142000722517150':
        // levi
        window.resizeTo(605, 245);
        window.moveTo(595, 245);
        break;

      case '100000636731698':
        // kevin
        window.resizeTo(605, 245);
        window.moveTo(595, 486);
        break;

      case '100000473806593':
        // Nina Cheng
        window.resizeTo(605, 245);
        window.moveTo(595, 730);
        break;

      case '100000556925297':
        // Angel Nina
        window.resizeTo(605, 245);
        window.moveTo(1225, 4);
        break;

      case '100000541126764':
        // Kitty Angel
        window.resizeTo(605, 245);
        window.moveTo(1225, 245);
        break;

      case '100000520204559':
        // Marry Angel
        window.resizeTo(605, 245);
        window.moveTo(1225, 486);
        break;

      case '100000533948473':
        // Rose Angel
        window.resizeTo(605, 245);
        window.moveTo(1225, 730);
        break;

      case '1794714531':
        // Weyl
        window.resizeTo(645, 262);
        window.moveTo(0, 0);
        break;

      case '100000062975901':
        // Pola
        window.resizeTo(645, 262);
        window.moveTo(0, 257);
        break;

      case '100000438303274':
        // Vanne
        window.resizeTo(645, 262);
        window.moveTo(0, 514);
        break;

      case 'hg_8222e273c0d07aa036e56ed17a8f7884':
        // Lydia
        window.resizeTo(645, 262);
        window.moveTo(0, 771);
        break;

      case '100000578963305':
        // Levine
        window.resizeTo(645, 262);
        window.moveTo(637, 0);
        break;

      case '100000656351135':
        // Angel
        window.resizeTo(645, 262);
        window.moveTo(637, 257);
        break;

      case '100000724831315':
        // Angelie
        window.resizeTo(645, 262);
        window.moveTo(637, 514);
        break;

      case '100000612521913':
        // Anthony
        window.resizeTo(645, 262);
        window.moveTo(637, 771);
        break;

      case '100001064572224':
        // Kelly
        window.resizeTo(645, 262);
        window.moveTo(1275, 0);
        break;

      case '100000669404954':
        // Mina
        window.resizeTo(645, 262);
        window.moveTo(1275, 257);
        break;

      case '100000633987931':
        // Monica
        window.resizeTo(645, 262);
        window.moveTo(1275, 514);
        break;

      case '100000638927202':
        // Vivienne
        window.resizeTo(645, 262);
        window.moveTo(1275, 771);
        break;

      default:
        break;
    } */

    let environmentType = trimToEmpty(usr.environment_type);
    logging(`location: ${environmentType}`);
    // 隱藏側邊欄
    document.getElementsByClassName('pageSidebarView')[0].style.display =
      'none';

    // onload scroll to
    let onloadAnchor = locationAnchor[environmentType];
    if (!onloadAnchor)
      onloadAnchor = JSON.parse(localStorage.getItem('onloadAnchor'));
    logging(
      'localStorage onload anchor: ',
      onloadAnchor[0],
      onloadAnchor[1],
      onloadAnchor[2]
    );
    if (!onloadAnchor)
      onloadAnchor = ['ByClassName', 'mousehuntHeaderView-gameTabs', ''];
    const elem = getPageElement(
      onloadAnchor[0],
      onloadAnchor[1],
      onloadAnchor[2]
    );
    if (elem && elem.length > 0) elem[0].scrollIntoView();
    // quick toggle
    let storageKey = null;
    // quick navigation buttons
    let mypanel = `<div id='mypanel' draggble='true' style='z-index: 1000; position: fixed; top: 2px; left: 10px;'>
      <details name="mypaneldetails"${localStorage.isLocalPanel ? '' : ' open'}>
        <summary style="width: 6em;height: 1.5em;background-color: #22ff22cc;cursor: pointer;place-content: center;font-size: 16px;">General</summary>`;
    const anchorPoints = JSON.parse(localStorage.getItem('anchorPoints'));
    // Use status button as onloadAnchor
    anchorPoints[1][1] = onloadAnchor[0];
    anchorPoints[1][2] = onloadAnchor[1];
    anchorPoints[1][3] = onloadAnchor[2];
    logging('localStorage anchor points', anchorPoints);
    for (let index = 0; index < anchorPoints.length; index++) {
      mypanel +=
        "<button type='button' name='my_mh_btn' style='background-color: " +
        (index % 3 == 1 ? '#FF4F58' : index % 3 == 2 ? '#9BF80C' : '#EDFA00') +
        ";'>" +
        anchorPoints[index][0] +
        '</button>';
    }
    mypanel += '<br/>';

    // quick travel buttons
    mypanel += '<input type="hidden" id="reloadAfterTravel" value="true">';
    mypanel +=
      '<button type="button" id="changeReloadAfterTravel" style="background-color: #BEEDC7;">Reload</button>';
    mypanel +=
      '<select id="travelToLocation" style="background-color: #BEEDC7; width: 70px;">';
    locations.sort((a, b) => {
      return a[1].localeCompare(b[1]);
    });
    for (let i = 0; i < locations.length; i++) {
      const location = locations[i];
      const locationMinRank = location[3];
      const locationMinRankLevel = Ranks.indexOf(locationMinRank);
      // prettier-ignore
      mypanel +=
        '<option value="' + location[0] + '"' +
        (environmentType == location[0] ? ' selected' : '') +
        (!location[2] ? ' disabled' : RankLevel < locationMinRankLevel ? ' disabled' : '') +
        '>' +
        location[1] +
        '</option>';
    }
    mypanel += '</select>';
    mypanel += `
      <input type="text" id="quickSleepHoursInput" style="width: 40px;">
      <button type="button" title="toggle maptainType" id="maptainTypeButton" style="background-color: #DEA32C;">??</button>
      <button type="button" title="toggle dusterCycle" id="dusterCycleButton" style="background-color: #8e6effff;">??</button>
      <br/>`;

    // function buttons
    mypanel += `<button type="button" style="background-color: #BEEDC7;" onclick="$(this).next('.mydropdownmenu').slideToggle();">Menu</button>`;
    const close =
      "$('input.jsDialogClose,a.jsDialogClose,a#jsDialogClose,a.closeButton,a.messengerUINotificationClose,a.giftSelectorView-inboxHeader-closeButton').click();";
    const slide = "$('.mydropdownmenu').slideToggle();";
    const rtnF = 'return false;';
    mypanel += `
    <ul class="mydropdownmenu" style="display: none; position: absolute; top: 100%; margin-top: 5px; padding: 5px 5px 0 0; background: #BEEDC7;">
      <li style="line-height: 2em;"><a href="#" onclick="${slide}${close}${rtnF}"><h1>Close Dialog</h1></a></li>
      <li style="line-height: 2em;"><a href="#" onclick="if (localStorage['displayedMessage']!=='') {localStorage['displayedMessage']=''};${slide}${rtnF}"><h1>Clear</h1></a></li>
      <li style="line-height: 2em;"><a href="#" onclick="${close}$('.menuItem.first.inbox').click();${rtnF}"><h1>Inbox</h1></a></li>
      <li style="line-height: 2em;"><a href="#" onclick="${slide}$('.baskets > a').click();${rtnF}"><h1>Basket</h1></a></li>
      <li style="line-height: 2em;"><a href="#" onclick="${slide}$('.crafting > a').click();${rtnF}"><h1>Crafting</h1></a></li>
      <li style="line-height: 2em;"><a href="#" onclick="${close}${slide}$('.marketplace > a').click();${rtnF}"><h1>Marketplace</h1></a></li>
      <li style="line-height: 2em;"><a href="#" id="myClaimRewardsLi"><h1>Claim Rewards</h1></a></li>
      <li style="line-height: 2em;"><a href="#" onclick="${slide}$('.special > a').click();${rtnF}"><h1>Special</h1></a></li>
      <li style="line-height: 2em;"><a href="#" onclick="${slide}$('.cheese > a').click();${rtnF}"><h1>Cheese</h1></a></li>
      <li style="line-height: 2em;"><a href="#" onclick="${close}$('.menuItem.freeGifts').click();${rtnF}"><h1>Gifts</h1></a></li>
      <li style="line-height: 2em;"><a href="#" onclick="${close}$('.free_gifts > a').click();${rtnF}"><h1>Send Gift</h1></a></li>
    </ul>
    <button type="button" style="background-color: #DEA32C;" onclick="soundedHorn();">Horn</button>
    <button type="button" id="homeButton" style="background-color: #BEEDC7;" onclick='window.location.href="https://www.mousehuntgame.com/";'>Home</button>
    `;
    // mypanel += `<button type="button" id="campButton" style="background-color: #BEEDC7;" onclick='document.getElementsByClassName("mousehuntHud-menu-item root")[0].click();'>Camp</button>`;

    // hide HUD or not
    const isHideHUD = localStorage.getItem('isHideHUD') === 'true';
    mypanel += '<select id="isHideHUD" style="background-color: #DEA32C;">';
    mypanel +=
      '<option value="true"' +
      (isHideHUD ? ' selected' : '') +
      '>Hide</option>';
    mypanel +=
      '<option value="false"' +
      (isHideHUD ? '' : ' selected') +
      '>Disp.</option>';
    mypanel += '</select>';
    mypanel +=
      '<button type="button" style="background-color: #DEA32C;" id="changeHudDisplayButton">HUD</button>';
    // <a class="loot" title="" href="https://www.mousehuntgame.com/item.php?item_type=rune_craft_item" onclick="hg.views.ItemView.show('rune_craft_item'); return false;">Rune</a>
    // Fort Rox
    const isFrox = environmentType == 'fort_rox';
    // prettier-ignore
    if (isFrox) {
      storageKey = 'fort_rox';
      const a = JSON.parse(localStorage[storageKey]);
      mypanel += `
        <input title="Must be after this time to auto enter night" type="text" id="enterAfterTimeInput" value="${a.enterAfterTime}" style="width: 10em;">
        <input title="Must have effective meteorite(meteorite+3*Crescent, 0 if use Moon) more than this number to auto enter night" type="number" id="meteoriteMoreThanInput" value="${a.meteoriteMoreThan}" style="width: 4em;">
        <input title="Must have howlite less than this number to auto enter night" type="number" id="howliteLessThanInput" value="${a.howliteLessThan}" style="width: 3em;">
        <input title="Must have bloodstone less than this number to auto enter night" type="number" id="bloodStoneLessThanInput" value="${a.bloodStoneLessThan}" style="width: 3em;">
      `;
    }
    mypanel += `</details>
    <details name="mypaneldetails"${localStorage.isLocalPanel ? ' open' : ''}>
      <summary style="width: 6em;height: 1.5em;background-color: #22ff22cc;cursor: pointer;place-content: center;font-size: 16px;">Local</summary>`;
    // GWH quick setup buttons
    if (isGwh) {
      storageKey = 'greatWinterHunt';
      const a = JSON.parse(localStorage[storageKey]);
      // prettier-ignore
      let isPp = a.winter_hunt_grove.ppTrap.normal[0].indexOf('Pecan Pecorino') == 0;
      // prettier-ignore
      let isSb = a.winter_hunt_grove.ppTrap.normal[0].indexOf('SUPER') == 0;
      // prettier-ignore
      let isGouda = a.winter_hunt_grove.ppTrap.normal[0].indexOf('Gouda') == 0;
      mypanel +=
        '<button title="toggle Cinnamon Hill PP/GPP." type="button" id="chGppButton" style="background-color:rgb(255, 140, 140);">' +
        (isPp ? 'PP' : isSb ? 'SB' : isGouda ? 'GOU' : 'GPP') +
        '</button>';
      // prettier-ignore
      isPp = a.winter_hunt_workshop.ppTrap.normal[0].indexOf('Pecan Pecorino') == 0;
      // prettier-ignore
      isSb = a.winter_hunt_workshop.ppTrap.normal[0].indexOf('SUPER') == 0;
      // prettier-ignore
      isGouda = a.winter_hunt_workshop.ppTrap.normal[0].indexOf('Gouda') == 0;
      mypanel +=
        '<button title="toggle Golem Workshop PP/GPP." type="button" id="gwGppButton" style="background-color:rgb(150, 115, 230);">' +
        (isPp ? 'PP' : isSb ? 'SB' : isGouda ? 'GOU' : 'GPP') +
        '</button>';
      // prettier-ignore
      isPp = a.winter_hunt_fortress.fsTrap.normal[0].indexOf('Pecan Pecorino') == 0;
      // prettier-ignore
      isSb = a.winter_hunt_fortress.fsTrap.normal[0].indexOf('SUPER') == 0;
      // prettier-ignore
      isGouda = a.winter_hunt_fortress.fsTrap.normal[0].indexOf('Gouda') == 0;
      mypanel +=
        '<button title="toggle Ice Fortress PP/GPP." type="button" id="ifGppButton" style="background-color:rgb(255, 140, 140);">' +
        (isPp ? 'PP' : isSb ? 'SB' : isGouda ? 'GOU' : 'GPP') +
        '</button>';
      mypanel +=
        '<button title="toggle isAutoMapping" type="button" id="gwhAutoMappingButton" style="background-color:rgb(150, 115, 230);">' +
        (a.isAutoMapping ? 'Ya' : 'No') +
        '</button>';
      mypanel +=
        '<button title="toggle isMapping." type="button" id="gwhMappingButton" style="background-color:rgb(255, 140, 140);">' +
        (a.isMapping ? 'map' : 'brk') +
        '</button>';
      mypanel +=
        '<button title="toggle isGoodGoTd" type="button" id="gwhGoTdButton" style="background-color:rgb(150, 115, 230);">' +
        (a.isGoodGoTd ? 'Ya' : 'No') +
        '</button>';
      mypanel +=
        '<button title="toggle autoGolems" type="button" id="gwhAutoGolemsButton" style="background-color:rgb(255, 140, 140);">' +
        (a.autoGolems === 1 ? 'one' : a.autoGolems === 2 ? 'two' : 'all') +
        '</button>';
      mypanel +=
        '<button title="toggle isAutoGolem" type="button" id="gwhAutoGolemButton" style="background-color:rgb(150, 115, 230);">' +
        (a.isAutoGolem ? 'Ya' : 'No') +
        '</button>';
      mypanel +=
        '<button title="toggle isAutoUpgrade" type="button" id="gwhAutoUpgradeButton" style="background-color:rgb(255, 140, 140);">' +
        (a.isAutoUpgrade ? 'Ya' : 'No') +
        '</button>';
      mypanel += '<br/>';
    }
    // LNY
    if (isLny) {
      storageKey = 'lunarNewYear';
      const setupLny = JSON.parse(localStorage[storageKey]);
      const farming = setupLny.farming;
      mypanel +=
        '<button title="toggle farming status." type="button" id="lnyFarmingButton" style="background-color:rgb(255, 140, 140);">' +
        (farming == 0
          ? 'None'
          : farming == 1
          ? 'Cheese'
          : farming == 2
          ? 'Candle'
          : 'Error') +
        '</button>';
      const candling = setupLny.candling;
      mypanel +=
        '<button title="toggle candling status." type="button" id="lnyCandlingButton" style="background-color:rgb(150, 115, 230);">' +
        (!candling
          ? 'Null'
          : candling == 'none'
          ? 'None'
          : candling == 'white'
          ? 'White'
          : candling == 'red'
          ? 'Red'
          : 'Error') +
        '</button>';
      const isNianGao = setupLny.isNianGao;
      mypanel +=
        '<button title="toggle event cheese type." type="button" id="isNianGaoButton" style="background-color:rgb(255, 140, 140);">' +
        (isNianGao ? 'NianGao' : 'Dumpling') +
        '</button>';
      mypanel += '<br/>';
    }
    // Halloween
    const isGloomyGreenwood = environmentType == 'halloween_event_location';
    if (isHalloween && isGloomyGreenwood) {
      storageKey = 'halloween_event_location';
      const settings = JSON.parse(localStorage[storageKey]);
      // prettier-ignore
      mypanel += `<input title="Reserved Cheese Quantity" type="text" id="minBaitQuantity" value="${JSON.stringify(settings.minBaitQuantity)}" style="width: 8em;">`
      mypanel += `<input title="map剩餘 goal高於此,不使用 index低於 mapEndingPriorityBegin的 bait.因為 map一定是 3-6-6組合" type="number" id="mapEndingQuantity" value="${settings.mapEndingQuantity}" style="width: 2em;">`;
      mypanel += `<input title="map剩餘 goal高於 mapEndingQuantity,不使用 index低於此的 bait.因為 map一定是 3-6-6組合" type="number" id="mapEndingPriorityBegin" value="${settings.mapEndingPriorityBegin}" style="width: 2em;">`;
    }
    // FRift
    const isFRift = environmentType == 'rift_furoma';
    if (isFRift) {
      mypanel +=
        '<button title="Redo cyclingMaster" type="button" id="redoCyclingMaster" style="background-color:rgb(150, 115, 230);">Redo</button>';
      mypanel +=
        '<button title="Undo cyclingMaster" type="button" id="undoCyclingMaster" style="background-color:rgb(255, 140, 140);">Undo</button>';
      mypanel += '<br/>';
    }
    // Cantera Quarry
    const isCanteraQuarry = environmentType == 'queso_quarry';
    // prettier-ignore
    if (isCanteraQuarry) {
      const a = localStorage.getItem('currentTrapKey');
      mypanel += '<select id="canteraQuarryTraps">';
      mypanel += `<option value disabled>Unknown</option>`;
      mypanel += `<option value="bland_queso_cheese"${ a == 'bland_queso_cheese' ? ' selected' : '' }>Bland</option>`;
      mypanel += `<option value="mild_queso_cheese"${ a == 'mild_queso_cheese' ? ' selected' : '' }>Mild</option>`;
      mypanel += `<option value="medium_queso_cheese"${ a == 'medium_queso_cheese' ? ' selected' : '' }>Medium</option>`;
      mypanel += `<option value="hot_queso_cheese"${ a == 'hot_queso_cheese' ? ' selected' : '' }>Hot</option>`;
      mypanel += `<option value="flaming_queso_cheese"${ a == 'flaming_queso_cheese' ? ' selected' : '' }>Flamin'</option>`;
      mypanel += '</select>';
    }
    // Prickly Plains
    const isPricklyPlains = environmentType == 'queso_plains';
    // prettier-ignore
    if (isPricklyPlains) {
      const a = localStorage.getItem('currentTrapKey');
      mypanel += '<select id="pricklyPlainsTraps">';
      mypanel += `<option value disabled>Unknown</option>`;
      mypanel += `<option value="bland_queso_cheese"${ a == 'bland_queso_cheese' ? ' selected' : '' }>Bland</option>`;
      mypanel += `<option value="mild_queso_cheese"${ a == 'mild_queso_cheese' ? ' selected' : '' }>Mild</option>`;
      mypanel += `<option value="medium_queso_cheese"${ a == 'medium_queso_cheese' ? ' selected' : '' }>Medium</option>`;
      mypanel += `<option value="hot_queso_cheese"${ a == 'hot_queso_cheese' ? ' selected' : '' }>Hot</option>`;
      mypanel += `<option value="flaming_queso_cheese"${ a == 'flaming_queso_cheese' ? ' selected' : '' }>Flamin'</option>`;
      mypanel += '</select>';
    }
    // Superbrie Factory
    const isFactory = environmentType == 'super_brie_factory';
    // prettier-ignore
    if (isFactory) {
      const a = localStorage.getItem('currentTrapKey');
      storageKey = 'superbrieFactory';
      const setupSbFactory = JSON.parse(localStorage[storageKey]);
      const isAutoFrc = setupSbFactory.isAutoFrc;
      mypanel += `
        <select id="superbrieFactoryTraps">
          <option value disabled>Unknown</option>
          <option value="gouda_cheese"${ a == 'gouda_cheese' ? ' selected' : '' }>Gouda</option>
          <option value="super_brie_cheese"${ a == 'super_brie_cheese' ? ' selected' : '' }>SB</option>
          <option value="coggy_colby_cheese"${ a == 'coggy_colby_cheese' ? ' selected' : '' }>CC</option>
          <option value="speed_coggy_colby_cheese"${ a == 'speed_coggy_colby_cheese' ? ' selected' : '' }>SCC</option>
          <option value="boss"${ a == 'boss' ? ' selected' : '' }>Boss</option>
        </select>
        <button title="toggle isAutoFrc" type="button" id="isAutoFrc">${isAutoFrc ? 'FRC' : 'No'}</button>
      `;
    }
    // Floating Islands
    const isFi = environmentType == 'floating_islands';
    // prettier-ignore
    if (isFi) {
      storageKey = 'floating_islands';
      const a = JSON.parse(localStorage[storageKey]);
      mypanel += `
        <button title="toggle isAutoLai." type="button" id="isAutoLaiButton" style="background-color:rgb(255, 140, 140);">
        ${a.isAutoLai ? 'autoL' : 'No'}
        </button>
        <button title="toggle isAutoHai." type="button" id="isAutoHaiButton" style="background-color:rgb(150, 115, 230);">
        ${a.isAutoHai ? 'autoH' : 'No'}
        </button>
        <button title="toggle isAutoSp." type="button" id="isAutoSpButton" style="background-color:rgb(255, 205, 115);">
        ${a.isAutoSp ? 'autoS' : 'No'}
        </button>
        <br/>
        <button title="toggle isBottledWind" type="button" id="isBottledWindButton" style="background-color:rgb(140, 238, 255);">
        ${a.isBottledWind ? 'BW' : 'No'}
        </button>
        <button title="toggle isBwLastBlockLai" type="button" id="isBwLastBlockLaiButton" style="background-color:rgb(255, 140, 140);">
        ${a.isBwLaiLastBlock ? 'bwLstL' : 'No'}
        </button>
        <button title="toggle isBwLastBlockHai" type="button" id="isBwLastBlockHaiButton" style="background-color:rgb(150, 115, 230);">
        ${a.isBwHaiLastBlock ? 'bwLstH' : 'No'}
        </button>
        <button title="toggle isBwLastBlockSp" type="button" id="isBwLastBlockSpButton" style="background-color:rgb(255, 205, 115);">
        ${a.isBwSpLastBlock ? 'bwLstS' : 'No'}
        </button>
        <button title="toggle isHuntAfterLaiTrove" type="button" id="isHuntAfterLaiTroveButton" style="background-color:rgb(255, 140, 140);">
        ${a.isHuntAfterLaiTrove ? 'endL' : 'No'}
        </button>
        <button title="toggle isHuntAfterHaiTrove" type="button" id="isHuntAfterHaiTroveButton" style="background-color:rgb(150, 115, 230);">
        ${a.isHuntAfterHaiTrove ? 'endH' : 'No'}
        </button>
        <button title="toggle isAutoHuntAfterTrove" type="button" id="isAutoHuntAfterTroveButton" style="background-color:rgb(140, 238, 255);">
        ${a.isAutoHuntAfterTrove ? 'autoEnd' : 'No'}
        </button>
        <br/>
        <select class="includedHaiShrineDDL" style="background-color:rgb(190, 237, 199);">
          <option value=""></option>
          <option value="paragon_cache_a"${a.includedHaiShrine.indexOf('paragon_cache_a') > -1 ? ' selected' : ''}>Sproc</option>
        </select>
        <select class="includedHaiShrineDDL" style="background-color:rgb(190, 237, 199);">
          <option value=""></option>
          <option value="paragon_cache_b"${a.includedHaiShrine.indexOf('paragon_cache_b') > -1 ? ' selected' : ''}>Silk</option>
        </select>
        <select class="includedHaiShrineDDL" style="background-color:rgb(190, 237, 199);">
          <option value=""></option>
          <option value="paragon_cache_c"${a.includedHaiShrine.indexOf('paragon_cache_c') > -1 ? ' selected' : ''}>Wing</option>
        </select>
        <select class="includedHaiShrineDDL" style="background-color:rgb(190, 237, 199);">
          <option value=""></option>
          <option value="paragon_cache_d"${a.includedHaiShrine.indexOf('paragon_cache_d') > -1 ? ' selected' : ''}>Bangle</option>
        </select>
        <br/>
        <b><font color="yellow">HAI</font></b>
        <select class="myHaiPowerTypesDDL" style="background-color:rgb(190, 237, 199);width: 5em;">
          <option value=""></option>
          <option value="arcn"${a.myHaiPowerTypes[0] && a.myHaiPowerTypes[0] === 'arcn' ? ' selected' : ''}>Arcane</option>
          <option value="drcnc"${a.myHaiPowerTypes[0] && a.myHaiPowerTypes[0] === 'drcnc' ? ' selected' : ''}>Draconic</option>
          <option value="frgttn"${a.myHaiPowerTypes[0] && a.myHaiPowerTypes[0] === 'frgttn' ? ' selected' : ''}>Forgotten</option>
          <option value="hdr"${a.myHaiPowerTypes[0] && a.myHaiPowerTypes[0] === 'hdr' ? ' selected' : ''}>Hydro</option>
          <option value="law"${a.myHaiPowerTypes[0] && a.myHaiPowerTypes[0] === 'law' ? ' selected' : ''}>Law</option>
          <option value="phscl"${a.myHaiPowerTypes[0] && a.myHaiPowerTypes[0] === 'phscl' ? ' selected' : ''}>Physical</option>
          <option value="shdw"${a.myHaiPowerTypes[0] && a.myHaiPowerTypes[0] === 'shdw' ? ' selected' : ''}>Shadow</option>
          <option value="tctcl"${a.myHaiPowerTypes[0] && a.myHaiPowerTypes[0] === 'tctcl' ? ' selected' : ''}>Tactical</option>
        </select>
        <select class="myHaiPowerTypesDDL" style="background-color:rgb(190, 237, 199);width: 5em;">
          <option value=""></option>
          <option value="arcn"${a.myHaiPowerTypes[1] && a.myHaiPowerTypes[1] === 'arcn' ? ' selected' : ''}>Arcane</option>
          <option value="drcnc"${a.myHaiPowerTypes[1] && a.myHaiPowerTypes[1] === 'drcnc' ? ' selected' : ''}>Draconic</option>
          <option value="frgttn"${a.myHaiPowerTypes[1] && a.myHaiPowerTypes[1] === 'frgttn' ? ' selected' : ''}>Forgotten</option>
          <option value="hdr"${a.myHaiPowerTypes[1] && a.myHaiPowerTypes[1] === 'hdr' ? ' selected' : ''}>Hydro</option>
          <option value="law"${a.myHaiPowerTypes[1] && a.myHaiPowerTypes[1] === 'law' ? ' selected' : ''}>Law</option>
          <option value="phscl"${a.myHaiPowerTypes[1] && a.myHaiPowerTypes[1] === 'phscl' ? ' selected' : ''}>Physical</option>
          <option value="shdw"${a.myHaiPowerTypes[1] && a.myHaiPowerTypes[1] === 'shdw' ? ' selected' : ''}>Shadow</option>
          <option value="tctcl"${a.myHaiPowerTypes[1] && a.myHaiPowerTypes[1] === 'tctcl' ? ' selected' : ''}>Tactical</option>
        </select>
        <select class="myHaiPowerTypesDDL" style="background-color:rgb(190, 237, 199);width: 5em;">
          <option value=""></option>
          <option value="arcn"${a.myHaiPowerTypes[2] && a.myHaiPowerTypes[2] === 'arcn' ? ' selected' : ''}>Arcane</option>
          <option value="drcnc"${a.myHaiPowerTypes[2] && a.myHaiPowerTypes[2] === 'drcnc' ? ' selected' : ''}>Draconic</option>
          <option value="frgttn"${a.myHaiPowerTypes[2] && a.myHaiPowerTypes[2] === 'frgttn' ? ' selected' : ''}>Forgotten</option>
          <option value="hdr"${a.myHaiPowerTypes[2] && a.myHaiPowerTypes[2] === 'hdr' ? ' selected' : ''}>Hydro</option>
          <option value="law"${a.myHaiPowerTypes[2] && a.myHaiPowerTypes[2] === 'law' ? ' selected' : ''}>Law</option>
          <option value="phscl"${a.myHaiPowerTypes[2] && a.myHaiPowerTypes[2] === 'phscl' ? ' selected' : ''}>Physical</option>
          <option value="shdw"${a.myHaiPowerTypes[2] && a.myHaiPowerTypes[2] === 'shdw' ? ' selected' : ''}>Shadow</option>
          <option value="tctcl"${a.myHaiPowerTypes[2] && a.myHaiPowerTypes[2] === 'tctcl' ? ' selected' : ''}>Tactical</option>
        </select>
        <select class="myHaiPowerTypesDDL" style="background-color:rgb(190, 237, 199);width: 5em;">
          <option value=""></option>
          <option value="arcn"${a.myHaiPowerTypes[3] && a.myHaiPowerTypes[3] === 'arcn' ? ' selected' : ''}>Arcane</option>
          <option value="drcnc"${a.myHaiPowerTypes[3] && a.myHaiPowerTypes[3] === 'drcnc' ? ' selected' : ''}>Draconic</option>
          <option value="frgttn"${a.myHaiPowerTypes[3] && a.myHaiPowerTypes[3] === 'frgttn' ? ' selected' : ''}>Forgotten</option>
          <option value="hdr"${a.myHaiPowerTypes[3] && a.myHaiPowerTypes[3] === 'hdr' ? ' selected' : ''}>Hydro</option>
          <option value="law"${a.myHaiPowerTypes[3] && a.myHaiPowerTypes[3] === 'law' ? ' selected' : ''}>Law</option>
          <option value="phscl"${a.myHaiPowerTypes[3] && a.myHaiPowerTypes[3] === 'phscl' ? ' selected' : ''}>Physical</option>
          <option value="shdw"${a.myHaiPowerTypes[3] && a.myHaiPowerTypes[3] === 'shdw' ? ' selected' : ''}>Shadow</option>
          <option value="tctcl"${a.myHaiPowerTypes[3] && a.myHaiPowerTypes[3] === 'tctcl' ? ' selected' : ''}>Tactical</option>
        </select>
        <br/>
      `;
    }
    // Valour Rift
    const isVrift = environmentType == 'rift_valour';
    // prettier-ignore
    if (isVrift) {
      storageKey = 'rift_valour';
      const a = JSON.parse(localStorage[storageKey]);
      mypanel += `
        <button title="toggle isAutoRetreat." type="button" id="isAutoRetreatButton" style="background-color:rgb(255, 140, 140);">
        ${a.isAutoRetreat ? 'aRetrt' : 'No'}
        </button>
        <button title="toggle isAutoEnter." type="button" id="isAutoEnterButton" style="background-color:rgb(150, 115, 230);">
        ${a.isAutoEnter ? 'aEnter' : 'No'}
        </button>
        <br/>
        <input title="uuRunExtraSecret" type="number" id="uuRunExtraSecretInput" value="${a.uuRunExtraSecret}" style="width: 3.5em;">
        <br/>
        <input title="uuRunExtraFrags" type="number" id="uuRunExtraFragsInput" value="${a.uuRunExtraFrags}" style="width: 2.5em;">
        <br/>
        <input title="enterAfterTime" type="text" id="enterAfterTimeInput" value="${a.enterAfterTime}" style="width: 10em;">
        <br/>
        <input title="enterBeforeTime" type="text" id="enterBeforeTimeInput" value="${a.enterBeforeTime}" style="width: 10em;">
      `;
    }
    mypanel += `</details></div>`;
    // eslint-disable-next-line no-undef
    $(mypanel).appendTo('body');
    const setValuesGeneralDetails = () => {
      const mypanel = document.querySelector('#mypanel');
      let tmp = localStorage.maptainType;
      let txt =
        tmp === 'always'
          ? 'Mptn'
          : tmp === 'once'
          ? 'Once'
          : tmp === 'never'
          ? 'Never'
          : 'No';
      mypanel.querySelector('#maptainTypeButton').textContent = txt;
      tmp = localStorage.dusterCycle;
      txt =
        tmp === 'always'
          ? 'Dstr'
          : tmp === 'once'
          ? 'Once'
          : tmp === 'never'
          ? 'Never'
          : 'No';
      mypanel.querySelector('#dusterCycleButton').textContent = txt;
      mypanel.querySelector('#travelToLocation').value =
        // eslint-disable-next-line no-undef
        user.environment_type.trim();
    };
    setValuesGeneralDetails();
    document
      .querySelector('#mypanel')
      .querySelectorAll('summary')[0]
      .addEventListener('contextmenu', function (e) {
        setValuesGeneralDetails();
        e.preventDefault();
      });
    // prettier-ignore
    // toggle maptainType
    document
      .getElementById('maptainTypeButton')
      .addEventListener('click', function (e) {
        storageKey = 'maptainType';
        let a = localStorage[storageKey];
        localStorage[storageKey] =
          a === 'once' ? 'always' : a === 'always' ? 'never' : a === 'never' ? '' : 'once';
        a = localStorage[storageKey];
        e.target.innerHTML =
          a === 'once' ? 'Once' : a === 'always' ? 'Mptn' : a === 'never' ? 'Never' : 'No';
        console.log(localStorage[storageKey]);
      });
    // prettier-ignore
    // toggle dusterCycle
    document
      .getElementById('dusterCycleButton')
      .addEventListener('click', function (e) {
        storageKey = 'dusterCycle';
        let a = localStorage[storageKey];
        localStorage[storageKey] =
          a === 'once' ? 'always' : a === 'always' ? 'never' : a === 'never' ? '' : 'once';
        a = localStorage[storageKey];
        e.target.innerHTML =
          a === 'once' ? 'Once' : a === 'always' ? 'Dstr' : a === 'never' ? 'Never' : 'No';
        console.log(localStorage[storageKey]);
      });
    /* document
      .getElementById('myHornButton')
      .addEventListener('click', function () {

        // 這個 class只有 horn可以點的時候才會出現,無需判斷
        document
        .getElementsByClassName(
          'huntersHornView__horn huntersHornView__horn--ready'
        )[0]
        .click();
        try {
          const horn = document.getElementsByClassName(
            'huntersHornView__horn huntersHornView__horn--ready'
          )[0];
          const clickEvent = new MouseEvent('mousedown', {
            bubbles: true, // Bubble up the dom.
            cancelable: true
          });

          horn.dispatchEvent(clickEvent);

          // Wait for the animation to finish.
          setTimeout(() => {
            const clickEvent = new MouseEvent('mouseup', {
              bubbles: true, // Bubble up the dom.
              cancelable: true
            });
            horn.dispatchEvent(clickEvent);
          }, 250);
        } catch (error) {
          console.plog(error);
          throw error;
        }
        // TODO huntersHornView__horn huntersHornView__horn--default huntersHornView__horn--ready
      }); */
    /* const hornStatus = document
      .querySelector('.huntersHornView')
      .querySelector(
        '.huntersHornView__timerState.huntersHornView__timerState--type-ready'
      );
    hornButton.addEventListener('click', function () {
      if (isVisible(hornStatus)) {
        document.querySelector('.huntersHornView__horn').click();
      }
    }); */

    const changeReloadButton = document.getElementById(
      'changeReloadAfterTravel'
    );
    changeReloadButton.addEventListener('click', () => {
      const reloadAfterTravel = document.getElementById('reloadAfterTravel');
      reloadAfterTravel.value =
        reloadAfterTravel.value == 'true' ? 'false' : 'true';
      changeReloadButton.innerText =
        reloadAfterTravel.value == 'true' ? 'Reload' : 'Sneak';
    });
    // 變更 locations下拉選單時 quick travel
    const travelToLocation = document.getElementById('travelToLocation');
    travelToLocation.addEventListener('change', function () {
      // 下拉選單變更時每次都要重讀 current location.
      // 因為會連續不 refresh地變換多個位置
      environmentType = (usr.environment_type || '').trim();
      const travelToLocationValue = travelToLocation.value;
      logging('travel from ', environmentType, ' to ', travelToLocationValue);
      if (environmentType != travelToLocationValue) {
        usr.environment_type = travelToLocationValue;
        usr.environment_id = environmentTypeIdDictionary[travelToLocationValue];
        // eslint-disable-next-line no-undef
        app.pages.TravelPage.travel(travelToLocationValue);
        if (document.getElementById('reloadAfterTravel').value == 'true') {
          window.setTimeout(function () {
            // window.location.reload('true');
            window.location.href = 'https://www.mousehuntgame.com/';
          }, 2000);
        }
      }
    });
    // 快速 sleep
    document
      .getElementById('quickSleepHoursInput')
      .addEventListener('change', (e) => {
        const setting = e.target.value.split('+-');
        const baseHm = parseFloat(setting[0]);
        if (Number.isNaN(baseHm)) return;
        const shift = parseFloat(setting[1]) * 60000;
        const isNaNShift = Number.isNaN(shift);
        console.log(`baseHours: ${baseHm}, shiftMinutes: ${shift}`);
        const duration = Math.floor(
          Math.floor(baseHm) * 3600000 +
            (baseHm % 1) * 6000000 +
            (isNaNShift ? 0 : getRandomInteger(-shift, shift))
        );
        // if (Number.isNaN(duration)) return;
        /* const storedRoutine = localStorage.currentRoutine;
        let currentRoutine = 'toRest';
        let sleepHref =
          'https://elie2201.github.io/mh/mhReloader.html?until=0&duration=' +
          getRandomInteger(480000, 720000) +
          '&fixed=true'; // pre-sleep url
        switch (storedRoutine) {
          case 'toRest':
            // to Resting
            currentRoutine = 'Resting';
            sleepHref =
              'https://elie2201.github.io/mh/mhReloader.html?until=0&duration=' +
              duration +
              (isNaNShift ? '' : '&fixed=true'); // sleep url
            break;
        }
        const currentRoutineKey = 'currentRoutine';
        window.localStorage.setItem(currentRoutineKey, currentRoutine); */
        localStorage.currentRoutine = 'Resting';
        const sleepHref =
          'https://elie2201.github.io/mh/mhReloader.html?until=0&duration=' +
          duration +
          (isNaNShift ? '' : '&fixed=true'); // sleep url
        window.location.href = sleepHref;
      });
    // 是否隱藏 HUD
    const selectHideHUD = document.getElementById('isHideHUD');
    const hudLocationContent = document.getElementById('hudLocationContent');
    selectHideHUD.addEventListener('change', function () {
      localStorage.setItem('isHideHUD', selectHideHUD.value);
      if (hudLocationContent) {
        if (selectHideHUD.value === 'true') {
          hudLocationContent.style.display = 'none';
        } else {
          hudLocationContent.style.display = '';
        }
      }
    });
    if (hudLocationContent && isHideHUD) {
      hudLocationContent.style.display = 'none';
    }
    // Toggle HUD hide/display event listener
    document
      .getElementById('changeHudDisplayButton')
      .addEventListener('click', function () {
        if (hudLocationContent) {
          hudLocationContent.style.display == 'none'
            ? (hudLocationContent.style.display = '')
            : (hudLocationContent.style.display = 'none');
        }
      });
    // GWH quick toggle
    if (isGwh) {
      storageKey = 'greatWinterHunt';
      // toggle PP/GPP
      document
        .getElementById('chGppButton')
        .addEventListener('click', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          // prettier-ignore
          const isPp = a.winter_hunt_grove.ppTrap.normal[0].indexOf('Pecan Pecorino') == 0;
          // prettier-ignore
          const isSb = a.winter_hunt_grove.ppTrap.normal[0].indexOf('SUPER') == 0;
          // prettier-ignore
          const isGouda = a.winter_hunt_grove.ppTrap.normal[0].indexOf('Gouda') == 0;
          // prettier-ignore
          a.winter_hunt_grove.ppTrap.normal[0] =
            isPp ? 'Glazed Pecan,Pecan Pecorino' : isSb ? 'Gouda' : isGouda ? 'Pecan Pecorino' : 'SUPER';
          // prettier-ignore
          a.winter_hunt_grove.ppTrap.gotd[0] =
            isPp ? 'Glazed Pecan,Pecan Pecorino' : isSb ? 'Gouda' : isGouda ? 'Pecan Pecorino' : 'SUPER';
          localStorage[storageKey] = JSON.stringify(a);
          // prettier-ignore
          e.target.innerHTML = isPp ? 'GPP' : isSb ? 'GOU' : isGouda ? 'PP' : 'SB';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      document
        .getElementById('gwGppButton')
        .addEventListener('click', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          // prettier-ignore
          const isPp = a.winter_hunt_workshop.ppTrap.normal[0].indexOf('Pecan Pecorino') == 0;
          // prettier-ignore
          const isSb = a.winter_hunt_workshop.ppTrap.normal[0].indexOf('SUPER') == 0;
          // prettier-ignore
          const isGouda = a.winter_hunt_workshop.ppTrap.normal[0].indexOf('Gouda') == 0;
          // prettier-ignore
          a.winter_hunt_workshop.ppTrap.normal[0] =
            isPp ? 'Glazed Pecan,Pecan Pecorino' : isSb ? 'Gouda' : isGouda ? 'Pecan Pecorino' : 'SUPER';
          // prettier-ignore
          a.winter_hunt_workshop.ppTrap.gotd[0] =
            isPp ? 'Glazed Pecan,Pecan Pecorino' : isSb ? 'Gouda' : isGouda ? 'Pecan Pecorino' : 'SUPER';
          localStorage[storageKey] = JSON.stringify(a);
          // prettier-ignore
          e.target.innerHTML = isPp ? 'GPP' : isSb ? 'GOU' : isGouda ? 'PP' : 'SB';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      document
        .getElementById('ifGppButton')
        .addEventListener('click', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          // prettier-ignore
          const isPp = a.winter_hunt_fortress.fsTrap.normal[0].indexOf('Pecan Pecorino') == 0;
          // prettier-ignore
          const isSb = a.winter_hunt_fortress.fsTrap.normal[0].indexOf('SUPER') == 0;
          // prettier-ignore
          const isGouda = a.winter_hunt_fortress.fsTrap.normal[0].indexOf('Gouda') == 0;
          // prettier-ignore
          a.winter_hunt_fortress.fsTrap.normal[0] =
            isPp ? 'Glazed Pecan,Pecan Pecorino' : isSb ? 'Gouda' : isGouda ? 'Pecan Pecorino' : 'SUPER';
          // prettier-ignore
          a.winter_hunt_fortress.fsTrap.gotd[0] =
            isPp ? 'Glazed Pecan,Pecan Pecorino' : isSb ? 'Gouda' : isGouda ? 'Pecan Pecorino' : 'SUPER';
          // prettier-ignore
          a.winter_hunt_fortress.ppTrap.normal[0] =
            isPp ? 'Glazed Pecan,Pecan Pecorino' : isSb ? 'Gouda' : isGouda ? 'Pecan Pecorino' : 'SUPER';
          // prettier-ignore
          a.winter_hunt_fortress.ppTrap.gotd[0] =
            isPp ? 'Glazed Pecan,Pecan Pecorino' : isSb ? 'Gouda' : isGouda ? 'Pecan Pecorino' : 'SUPER';
          localStorage[storageKey] = JSON.stringify(a);
          // prettier-ignore
          e.target.innerHTML = isPp ? 'GPP' : isSb ? 'GOU' : isGouda ? 'PP' : 'SB';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle mapping
      document
        .getElementById('gwhMappingButton')
        .addEventListener('click', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          const prop = 'isMapping';
          a[prop] = a[prop] ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a[prop] ? 'map' : 'brk';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle isGoodGoTd
      document
        .getElementById('gwhGoTdButton')
        .addEventListener('click', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          const prop = 'isGoodGoTd';
          a[prop] = a[prop] ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a[prop] ? 'Ya' : 'No';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle autoGolems
      document
        .getElementById('gwhAutoGolemsButton')
        .addEventListener('click', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          const prop = 'autoGolems';
          a[prop] = a[prop] === 3 ? 2 : a[prop] === 2 ? 1 : 3;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML =
            a[prop] === 1 ? 'one' : a[prop] === 2 ? 'two' : 'all';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle isAutoGolem
      document
        .getElementById('gwhAutoGolemButton')
        .addEventListener('click', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          const prop = 'isAutoGolem';
          a[prop] = a[prop] ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a[prop] ? 'Ya' : 'No';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle isAutoUpgrade
      document
        .getElementById('gwhAutoUpgradeButton')
        .addEventListener('click', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          const prop = 'isAutoUpgrade';
          a[prop] = a[prop] ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a[prop] ? 'Ya' : 'No';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle isAutoMapping
      document
        .getElementById('gwhAutoMappingButton')
        .addEventListener('click', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          const prop = 'isAutoMapping';
          a[prop] = a[prop] ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a[prop] ? 'Ya' : 'No';
          console.log(JSON.parse(localStorage[storageKey]));
        });
    }
    // LNY quick toggle
    if (isLny) {
      storageKey = 'lunarNewYear';
      // toggle farming status
      document
        .getElementById('lnyFarmingButton')
        .addEventListener('click', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          const farming = a.farming;
          a.farming = farming == 0 ? 1 : farming == 1 ? 2 : 0;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML =
            a.farming == 0
              ? 'None'
              : a.farming == 1
              ? 'Cheese'
              : a.farming == 2
              ? 'Candle'
              : 'Error';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle candling status
      document
        .getElementById('lnyCandlingButton')
        .addEventListener('click', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          const candling = a.candling;
          a.candling = !candling
            ? 'none'
            : candling == 'none'
            ? 'white'
            : candling == 'white'
            ? 'red'
            : null;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = !a.candling
            ? 'Null'
            : a.candling == 'none'
            ? 'None'
            : a.candling == 'white'
            ? 'White'
            : a.candling == 'red'
            ? 'Red'
            : 'Error';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle isNianGao
      document
        .getElementById('isNianGaoButton')
        .addEventListener('click', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          const isNianGao = a.isNianGao;
          a.isNianGao = isNianGao ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a.isNianGao ? 'NianGao' : 'Dumpling';
          console.log(JSON.parse(localStorage[storageKey]));
        });
    }
    if (isFrox) {
      storageKey = 'fort_rox';
      // enterAfterTime
      document
        .getElementById('enterAfterTimeInput')
        .addEventListener('change', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          const v = e.target.value.trim();
          a.enterAfterTime = v;
          localStorage[storageKey] = JSON.stringify(a);
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // meteoriteMoreThan
      document
        .getElementById('meteoriteMoreThanInput')
        .addEventListener('change', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          const v = e.target.value.trim();
          a.meteoriteMoreThan = parseInt(v);
          localStorage[storageKey] = JSON.stringify(a);
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // howliteLessThan
      document
        .getElementById('howliteLessThanInput')
        .addEventListener('change', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          const v = e.target.value.trim();
          a.howliteLessThan = parseInt(v);
          localStorage[storageKey] = JSON.stringify(a);
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // bloodStoneLessThan
      document
        .getElementById('bloodStoneLessThanInput')
        .addEventListener('change', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          const v = e.target.value.trim();
          a.bloodStoneLessThan = parseInt(v);
          localStorage[storageKey] = JSON.stringify(a);
          console.log(JSON.parse(localStorage[storageKey]));
        });
    }
    if (isHalloween && isGloomyGreenwood) {
      storageKey = 'halloween_event_location';
      // Reserved bait quantity
      document
        .getElementById('minBaitQuantity')
        .addEventListener('change', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          const v = e.target.value.trim();
          a.minBaitQuantity = parseInt(v);
          localStorage[storageKey] = JSON.stringify(a);
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // map剩餘 goal高於此,不使用 index低於 mapEndingPriorityBegin的 bait
      document
        .getElementById('mapEndingQuantity')
        .addEventListener('change', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          const v = e.target.value.trim();
          a.mapEndingQuantity = parseInt(v);
          localStorage[storageKey] = JSON.stringify(a);
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // map剩餘 goal高於 mapEndingQuantity,不使用 index低於此的 bait
      document
        .getElementById('mapEndingPriorityBegin')
        .addEventListener('change', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          const v = e.target.value.trim();
          a.mapEndingPriorityBegin = parseInt(v);
          localStorage[storageKey] = JSON.stringify(a);
          console.log(JSON.parse(localStorage[storageKey]));
        });
    }
    if (isFRift) {
      storageKey = 'cyclingMaster';
      // Redo cyclingMaster
      document
        .getElementById('redoCyclingMaster')
        .addEventListener('click', function () {
          const a = JSON.parse(localStorage[storageKey]);
          a.push(a.shift());
          localStorage[storageKey] = JSON.stringify(a);
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // Undo cyclingMaster
      document
        .getElementById('undoCyclingMaster')
        .addEventListener('click', function () {
          const a = JSON.parse(localStorage[storageKey]);
          a.unshift(a.pop());
          localStorage[storageKey] = JSON.stringify(a);
          console.log(JSON.parse(localStorage[storageKey]));
        });
    }
    // Cantera Quarry quick trap
    if (isCanteraQuarry) {
      storageKey = 'currentTrapKey';
      // trap
      document
        .getElementById('canteraQuarryTraps')
        .addEventListener('change', function (e) {
          localStorage[storageKey] = e.target.value;
          console.log(`currentTrapKey: ${localStorage[storageKey]}`);
        });
    }
    // Prickly Plains quick trap
    if (isPricklyPlains) {
      storageKey = 'currentTrapKey';
      // trap
      document
        .getElementById('pricklyPlainsTraps')
        .addEventListener('change', function (e) {
          localStorage[storageKey] = e.target.value;
          console.log(`currentTrapKey: ${localStorage[storageKey]}`);
        });
    }
    // Superbrie Factory quick trap
    if (isFactory) {
      storageKey = 'superbrieFactory';
      // trap
      document
        .getElementById('superbrieFactoryTraps')
        .addEventListener('change', function (e) {
          localStorage.setItem('currentTrapKey', e.target.value);
          console.log(localStorage.getItem('currentTrapKey'));
        });
      // isAutoFrc
      document
        .getElementById('isAutoFrc')
        .addEventListener('click', function (e) {
          const a = JSON.parse(localStorage[storageKey]);
          const isAutoFrc = a.isAutoFrc;
          a.isAutoFrc = isAutoFrc ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a.isAutoFrc ? 'FRC' : 'No';
          console.log(JSON.parse(localStorage[storageKey]));
        });
    }
    // Floating Islands quick toggle
    if (isFi) {
      storageKey = 'floating_islands';
      // toggle auto lai sky map
      document
        .getElementById('isAutoLaiButton')
        .addEventListener('click', function (e) {
          const prop = 'isAutoLai';
          const a = JSON.parse(localStorage[storageKey]);
          a[prop] = a[prop] ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a[prop] ? 'autoL' : 'No';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle auto hai sky map
      document
        .getElementById('isAutoHaiButton')
        .addEventListener('click', function (e) {
          const prop = 'isAutoHai';
          const a = JSON.parse(localStorage[storageKey]);
          a[prop] = a[prop] ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a[prop] ? 'autoH' : 'No';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle auto sky palace
      document
        .getElementById('isAutoSpButton')
        .addEventListener('click', function (e) {
          const prop = 'isAutoSp';
          const a = JSON.parse(localStorage[storageKey]);
          a[prop] = a[prop] ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a[prop] ? 'autoS' : 'No';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle isBottledWind
      document
        .getElementById('isBottledWindButton')
        .addEventListener('click', function (e) {
          const prop = 'isBottledWind';
          const a = JSON.parse(localStorage[storageKey]);
          a[prop] = a[prop] ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a[prop] ? 'BW' : 'No';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle isBwLastBlockLai
      document
        .getElementById('isBwLastBlockLaiButton')
        .addEventListener('click', function (e) {
          const prop = 'isBwLaiLastBlock';
          const a = JSON.parse(localStorage[storageKey]);
          a[prop] = a[prop] ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a[prop] ? 'bwLstL' : 'No';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle isBwLastBlockHai
      document
        .getElementById('isBwLastBlockHaiButton')
        .addEventListener('click', function (e) {
          const prop = 'isBwHaiLastBlock';
          const a = JSON.parse(localStorage[storageKey]);
          a[prop] = a[prop] ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a[prop] ? 'bwLstH' : 'No';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle isBwLastBlockSp
      document
        .getElementById('isBwLastBlockSpButton')
        .addEventListener('click', function (e) {
          const prop = 'isBwSpLastBlock';
          const a = JSON.parse(localStorage[storageKey]);
          a[prop] = a[prop] ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a[prop] ? 'bwLstS' : 'No';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle isHuntAfterHaiTrove
      document
        .getElementById('isHuntAfterHaiTroveButton')
        .addEventListener('click', function (e) {
          const prop = 'isHuntAfterHaiTrove';
          const a = JSON.parse(localStorage[storageKey]);
          a[prop] = a[prop] ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a[prop] ? 'endH' : 'No';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle isHuntAfterLaiTrove
      document
        .getElementById('isHuntAfterLaiTroveButton')
        .addEventListener('click', function (e) {
          const prop = 'isHuntAfterLaiTrove';
          const a = JSON.parse(localStorage[storageKey]);
          a[prop] = a[prop] ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a[prop] ? 'endL' : 'No';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle isAutoHuntAfterTrove
      document
        .getElementById('isAutoHuntAfterTroveButton')
        .addEventListener('click', function (e) {
          const prop = 'isAutoHuntAfterTrove';
          const a = JSON.parse(localStorage[storageKey]);
          a[prop] = a[prop] ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a[prop] ? 'autoEnd' : 'No';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      let elements = document.getElementsByClassName('includedHaiShrineDDL');
      for (let i = 0; i < elements.length; i++) {
        const prop = 'includedHaiShrine';
        const element = elements[i];
        element.addEventListener('change', function (e) {
          const elements = document.getElementsByClassName(
            'includedHaiShrineDDL'
          );
          const values = [];
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.value !== '') values.push(element.value);
          }
          const a = JSON.parse(localStorage[storageKey]);
          a[prop] = values;
          localStorage[storageKey] = JSON.stringify(a);
          console.log(JSON.parse(localStorage[storageKey]));
        });
      }
      elements = document.getElementsByClassName('myHaiPowerTypesDDL');
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        element.addEventListener('change', function (e) {
          const prop = 'myHaiPowerTypes';
          const elements =
            document.getElementsByClassName('myHaiPowerTypesDDL');
          const values = [];
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.value !== '') values.push(element.value);
          }
          const a = JSON.parse(localStorage[storageKey]);
          a[prop] = values;
          localStorage[storageKey] = JSON.stringify(a);
          console.log(JSON.parse(localStorage[storageKey]));
        });
      }
    }
    // Valour Rift quick toggle
    if (isVrift) {
      storageKey = 'rift_valour';
      // toggle auto retreat
      document
        .getElementById('isAutoRetreatButton')
        .addEventListener('click', function (e) {
          const prop = 'isAutoRetreat';
          const a = JSON.parse(localStorage[storageKey]);
          a[prop] = a[prop] ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a[prop] ? 'aRetrt' : 'No';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle auto enter
      document
        .getElementById('isAutoEnterButton')
        .addEventListener('click', function (e) {
          const prop = 'isAutoEnter';
          const a = JSON.parse(localStorage[storageKey]);
          a[prop] = a[prop] ? false : true;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.innerHTML = a[prop] ? 'aEnter' : 'No';
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle uuRunExtraSecret
      document
        .getElementById('uuRunExtraSecretInput')
        .addEventListener('change', function (e) {
          const prop = 'uuRunExtraSecret';
          const a = JSON.parse(localStorage[storageKey]);
          const v = e.target.value.trim();
          a[prop] = parseInt(v);
          localStorage[storageKey] = JSON.stringify(a);
          e.target.value = a[prop];
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle uuRunExtraFrags
      document
        .getElementById('uuRunExtraFragsInput')
        .addEventListener('change', function (e) {
          const prop = 'uuRunExtraFrags';
          const a = JSON.parse(localStorage[storageKey]);
          const v = e.target.value.trim();
          a[prop] = parseInt(v);
          localStorage[storageKey] = JSON.stringify(a);
          e.target.value = a[prop];
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle enterAfterTime
      document
        .getElementById('enterAfterTimeInput')
        .addEventListener('change', function (e) {
          const prop = 'enterAfterTime';
          const a = JSON.parse(localStorage[storageKey]);
          const v = e.target.value.trim();
          a[prop] = v;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.value = a[prop];
          console.log(JSON.parse(localStorage[storageKey]));
        });
      // toggle enterBeforeTime
      document
        .getElementById('enterBeforeTimeInput')
        .addEventListener('change', function (e) {
          const prop = 'enterBeforeTime';
          const a = JSON.parse(localStorage[storageKey]);
          const v = e.target.value.trim();
          a[prop] = v;
          localStorage[storageKey] = JSON.stringify(a);
          e.target.value = a[prop];
          console.log(JSON.parse(localStorage[storageKey]));
        });
    }
    // delayed onmouseover event
    const delay = function (elem, callback, seconds) {
      let timeout = null;
      elem.onmouseover = function () {
        // Set timeout to be a timer which will invoke callback after 1s
        timeout = setTimeout(callback, seconds);
      };

      elem.onmouseout = function () {
        // Clear any timers set to timeout
        clearTimeout(timeout);
      };
    };
    // bind delayed onmouseover event
    const buttons = document.getElementsByName('my_mh_btn');
    for (let index = 0; index < anchorPoints.length; index++) {
      delay(
        buttons[index],
        function () {
          const element = getPageElement(
            anchorPoints[index][1],
            anchorPoints[index][2],
            anchorPoints[index][3]
          );
          element[0].scrollIntoView();
        },
        hoverDelayMilliseconds
      );
    }
    // claimRewards
    const claimRewards = (elem) => {
      elem.onclick = () => {
        // eslint-disable-next-line no-undef
        $('.mydropdownmenu').slideToggle();
        const maps = usr.quests.QuestRelicHunter.maps;
        if (!maps || maps.length == 0) return;
        for (let i = 0; i < maps.length; i++) {
          const map = maps[i];
          console.log(
            'Check auto claim map reward!!',
            map.map_id,
            map.is_complete
          );
          if (map.is_complete) {
            console.log('Claim reward:', map.map_id);
            setTimeout(() => {
              // eslint-disable-next-line no-undef
              hg.utils.TreasureMapUtil.claim(map.map_id);
            }, i * 1000);
          }
        }
        return false;
      };
    };
    claimRewards(document.getElementById('myClaimRewardsLi'));
  }, 3000);
})();

// Utilities
/**
 * logging function.
 * Invoke console.log with customization.
 * @param  {...any} logs
 */
function logging(...any) {
  if (debug) {
    console.groupCollapsed(new Date(), ...any);
    console.log(Error().stack);
    // console.trace();
    console.groupEnd();
    /* console.groupCollapsed(...arguments);
      // console.trace.apply(console, arguments);
      console.trace();
      console.groupEnd(); */
  }
}
/**
 * By whichAttribute, call javascript getElement series function,
 * use those two value to get element
 * @param {string} whichAttribute
 * @param {string} attributeValue
 * @param {string} orAttributeValue
 * @return {HTMLCollection} found elements(0 length if not found)
 */
function getPageElement(whichAttribute, attributeValue, orAttributeValue) {
  logging('getPageElement', whichAttribute, attributeValue, orAttributeValue);
  let elem;
  switch (whichAttribute) {
    case 'ById':
      elem = document.getElementById(attributeValue);
      if (!elem || elem.offsetParent == null)
        elem = document.getElementById(orAttributeValue);
      if (!elem || elem.offsetParent == null) {
        elem = [];
      } else {
        // 跟另外兩種取元素方法(得到 HTMLCollection)一致,包裝成 Array
        elem = [elem];
      }
      break;

    case 'ByName':
      elem = document.getElementsByName(attributeValue);
      if (!elem || elem.length == 0 || elem[0].offsetParent == null)
        elem = document.getElementsByName(orAttributeValue);
      break;

    case 'ByClassName':
      elem = document.getElementsByClassName(attributeValue);
      if (!elem || elem.length == 0 || elem[0].offsetParent == null)
        elem = document.getElementsByClassName(orAttributeValue);
      break;

    default:
      break;
  }
  logging(elem);
  return elem;
}
/*
 * Check if HTMLElement visible.
 * @param {HTMLElement} obj
 * @return {Boolean} true if visible.
function isVisible(obj) {
  return obj.offsetWidth > 0 && obj.offsetHeight > 0;
}
function parseQuantity(qty) {
  const strQty = (qty || 0) + '';
  const rtn = parseInt(strQty.replaceAll(',', ''));
  return Number.isNaN(rtn) ? 0 : rtn;
}
function popupMessage(message) {
  const popup = new jsDialog();
  popup.setTemplate('error');
  popup.addToken('{*title*}', 'An error has occurred.');
  popup.addToken('{*content*}', message);
  popup.show();
  // target.removeClass('busy');
}
 */
function trimToEmpty(str) {
  return trimToDefault(str);
}
function trimToDefault(str, deflt) {
  return (str || (deflt ? deflt : '')).trim();
}
function getRandomInteger(min, max) {
  return parseInt(min + Math.random() * (max - min));
}
// End Utilities
