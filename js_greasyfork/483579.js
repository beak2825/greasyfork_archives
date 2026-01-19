// ==UserScript==
// @name  MyMHUI
// @namespace  https://greasyfork.org/en/users/39779
// @version  2.2.34.15.14
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
  queso_river: isLny ? null : ['ByClassName', 'camp', ''],
  queso_plains: ['ByClassName', 'camp', ''],
  queso_quarry: ['ByClassName', 'camp', ''],
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
const functions = {
  empty() {
    // eslint-disable-next-line no-undef
    $('#eventLocationsSettingsDiv').html('');
  },
  emptyLoad() {},
  emptySave() {},
  greatWinterHunt() {
    const html = `
  <table>
    <tr>
      <td>&nbsp;</td>
      <td>Hill</td>
      <td>Workshop</td>
      <td>Fortress</td>
    </tr>
    <tr>
      <td>Bait</td>
      <td>
        <button title="toggle Cinnamon Hill Bait." type="button" id="hillBaitButton" style="background-color:rgb(255, 140, 140);"></button>
      </td>
      <td>
        <button title="toggle Golem Workshop Bait." type="button" id="workshopBaitButton" style="background-color:rgb(150, 115, 230);"></button>
      </td>
      <td>
        <button title="toggle Ice Fortress Bait." type="button" id="fortressBaitButton" style="background-color:rgb(255, 140, 140);"></button>
      </td>
    </tr>
    <tr>
      <td>FS</td>
      <td>
        <button title="toggle Cinnamon Hill Festive Spirit." type="button" id="hillFSButton" style="background-color:rgb(255, 140, 140);"></button>
      </td>
      <td>
        <button title="toggle Golem Workshop Festive Spirit." type="button" id="workshopFSButton" style="background-color:rgb(150, 115, 230);"></button>
      </td>
      <td>
        <button title="toggle Ice Fortress Festive Spirit." type="button" id="fortressFSButton" style="background-color:rgb(255, 140, 140);"></button>
      </td>
    </tr>
    <tr>
      <td colspan="4">Quantity Setup</td>
    </tr>
    <tr>
      <td>
        <input title="Start using PP quantity." type="number" id="startPpQtyInput" value="25">
      </td>
      <td>
        <input title="Stop using PP quantity." type="number" id="ppKeptQtyInput" value="2">
      </td>
      <td>
        <input title="Stop using GPP quantity." type="number" id="gppEndQtyInput" value="2">
      </td>
      <td>
        <select title="Area to hunt with GPP." id="gppAreaSelect">
          <option value="winter_hunt_grove">Hill</option>
          <option value="winter_hunt_workshop">Workshop</option>
          <option value="winter_hunt_fortress">Fortress</option>
        </select>
      </td>
    </tr>
    <tr>
      <td colspan="4">Workshop Setup</td>
    </tr>
    <tr>
      <td>
        <input title="Start using cinnamon quantity." type="number" id="startCinnamonQtyInput" value="37">
      </td>
      <td>
        <input title="Stop using cinnamon quantity." type="number" id="cinnamonKeptQtyInput" value="3">
      </td>
      <td>
        <input title="Too many cinnamon quantity." type="number" id="tooManyCinnamonInput" value="73">
      </td>
      <td>
      </td>
    </tr>
    <tr>
      <td>停用 forge</td>
      <td>
        <select title="第 1個 forge" class="stopForgeAt">
          <option value="0">Keep forging</option>
          <option value="12">stop as finished</option>
        </select>
      </td>
      <td>
        <select title="第 2個 forge" class="stopForgeAt">
          <option value="0">Keep forging</option>
          <option value="12">stop as finished</option>
        </select>
      </td>
      <td>
        <select title="第 3個 forge" class="stopForgeAt">
          <option value="0">Keep forging</option>
          <option value="6">stop as finished</option>
        </select>
      </td>
    </tr>
    <tr>
      <td colspan="4">Fortress Setup</td>
    </tr>
    <tr>
      <td>
        <input title="Start using hailstone quantity." type="number" id="goHailstoneQtyInput" value="35">
      </td>
      <td>
        <input title="Stop using hailstone quantity." type="number" id="hailstoneKeptQtyInput" value="2">
      </td>
      <td>
        <input title="Too many hailstone quantity." type="number" id="tooManyHailstoneInput" value="35">
      </td>
      <td>
        <input title="Festive Spirit數量少於此離開 Fortress." type="number" id="fsKeptQtyInput" value="3">
      </td>
    </tr>
    <tr>
      <td colspan="4">Golem Setup</td>
    </tr>
    <tr>
      <td>
        <select title="是否自動處理 golem" id="isAutoGolemSelect">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
        <select title="是否自動升級 golem?" id="isAutoUpgradeSelect">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
        <select title="有 scarf時,是否用閒置的 golem送掉" id="isScarfUnusedGolemSelect">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
      </td>
    </tr>
    <tr>
      <td>
        <input title="自動 build幾個 golem(等級高到低)." type="number" id="golemsAutoBuildInput" value="2">
      </td>
      <td>
        <input title="自動 upgrade幾個 golem(由左至右)." type="number" id="golemsAutoUpgradeInput" value="2">
      </td>
      <td>
        <input title="自動 claim幾個 golem(由左至右)." type="number" id="golemsAutoClaimInput" value="3">
      </td>
      <td>
      </td>
    </tr>
    <tr>
      <td>預設目標</td>
      <td>
        <select title="第 1個 golem的預設目的地" class="defaultGolemTarget">
          <option value="floating_islands">Floating Islands</option>
          <option value="kings_arms">King's Arm</option>
          <option value="queso_river">Queso River</option>
          <option value="queso_plains">Prickly Plains</option>
          <option value="queso_quarry">Cantera Quarry</option>
          <option value="queso_geyser">Queso Geyser</option>
        </select>
      </td>
      <td>
        <select title="第 2個 golem的預設目的地" class="defaultGolemTarget">
          <option value="floating_islands">Floating Islands</option>
          <option value="kings_arms">King's Arm</option>
          <option value="queso_river">Queso River</option>
          <option value="queso_plains">Prickly Plains</option>
          <option value="queso_quarry">Cantera Quarry</option>
          <option value="queso_geyser">Queso Geyser</option>
        </select>
      </td>
      <td>
        <select title="第 3個 golem的預設目的地" class="defaultGolemTarget">
          <option value="floating_islands">Floating Islands</option>
          <option value="kings_arms">King's Arm</option>
          <option value="queso_river">Queso River</option>
          <option value="queso_plains">Prickly Plains</option>
          <option value="queso_quarry">Cantera Quarry</option>
          <option value="queso_geyser">Queso Geyser</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>GoTd</td>
      <td>
        <select title="是否使用 GoTd設定?" id="isGoodGoTdSelect">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
        <input title="不使用 GoTd設定的 UTC日期,逗點分隔." type="text" id="badGotdDatesInput">
      </td>
      <td>
      </td>
    </tr>
    <tr>
      <td colspan="4">Mapping Setup</td>
    </tr>
    <tr>
      <td>
        <select title="是否自動 mapping?" id="isAutoMappingSelect">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
        <select title="是否優先 mapping?" id="isMappingSelect">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
        <select title="只剩 PP mice時是否強制使用 PP?" id="isCheckPpMiceBaitSelect">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
        <select title="是否強制 map area的清除順序?" id="isForcedMapClearOrderSelect">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>map area的清除順序</td>
      <td>
        <select title="第 1個清除的 map area" class="mapAreaClearOrder">
          <option value="winter_hunt_grove" selected>Hill</option>
          <option value="winter_hunt_workshop">Workshop</option>
          <option value="winter_hunt_fortress">Fortress</option>
        </select>
      </td>
      <td>
        <select title="第 2個清除的 map area" class="mapAreaClearOrder">
          <option value="winter_hunt_grove">Hill</option>
          <option value="winter_hunt_workshop" selected>Workshop</option>
          <option value="winter_hunt_fortress">Fortress</option>
        </select>
      </td>
      <td>
        <select title="第 3個清除的 map area" class="mapAreaClearOrder">
          <option value="winter_hunt_grove">Hill</option>
          <option value="winter_hunt_workshop">Workshop</option>
          <option value="winter_hunt_fortress" selected>Fortress</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>
        <input title="GPP數量少於此, drop需要 GPP的 map." type="number" id="dropMapGppAsGppLessThanInput" value="40">
      </td>
      <td>
        <input title="GPP數量少於此, drop有 Glazy的 map(做 Joy的 map有機會多抓 Glazy)." type="number" id="dropMapGlazyAsGppLessThanInput" value="100">
      </td>
      <td>
      </td>
      <td>
      </td>
    </tr>
    <tr>
      <td colspan="4">Shutdown Setup</td>
    </tr>
    <tr>
      <td>
        <input title="Animated Snow數量大於等於此,停用 Animated Snow Cannon." type="number" id="stopAnimatedSnowCannonAtInput" value="-1">
      </td>
      <td>
        <input title="Cinnamon數量大於等於此,停用 Cinnamon Cannon." type="number" id="stopCinnamonCannonAtInput" value="-1">
      </td>
      <td>
        <select title="Shutdown時,用完 cinnamon後是否自動前往 Fortress" id="isAutoFortressSelect">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
      </td>
    </tr>
    <tr>
      <td colspan="4">Trap Setup</td>
    </tr>
    <tr>
      <td>
        <select title="Trap area" id="trapAreaSelect">
          <option value="winter_hunt_grove">Hill</option>
          <option value="winter_hunt_workshop">Workshop</option>
          <option value="winter_hunt_fortress">Fortress</option>
        </select>
      </td>
      <td>
        <select title="Trap type" id="trapTypeSelect">
          <option value="normalTrap">Normal</option>
          <option value="ppTrap">Mapping</option>
          <option value="fsTrap">Breaking Shield</option>
          <option value="shutdown">Shutdown</option>
        </select>
      </td>
      <td>
        <select title="Is trap GoTd" id="trapGoTdSelect">
          <option value="gotd">GoTd</option>
          <option value="normal">not</option>
        </select>
      </td>
      <td>
      </td>
    </tr>
    <tr>
      <td>Bait</td>
      <td colspan="3">
        <input title="逗點分隔 Bait name." type="text" id="gwhBaitInput" style="width: 95%;">
      </td>
    </tr>
    <tr>
      <td>Weapon</td>
      <td colspan="3">
        <input title="逗點分隔 Weapon name." type="text" id="gwhWeaponInput" style="width: 95%;">
      </td>
    </tr>
    <tr>
      <td>Base</td>
      <td colspan="3">
        <input title="逗點分隔 Base name." type="text" id="gwhBaseInput" style="width: 95%;">
      </td>
    </tr>
    <tr>
      <td>Charm</td>
      <td colspan="3">
        <input title="逗點分隔 Charm name." type="text" id="gwhCharmInput" style="width: 95%;">
      </td>
    </tr>
    <tr>
      <td>Festive Spirit</td>
      <td colspan="3">
        <select title="是否使用 Festive Spirit." type="text" id="gwhFestiveSpiritSelect">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>Cannons</td>
      <td>
        <select title="Enable first cannon" class="toggleCannons">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
        <select title="Enable second cannon" class="toggleCannons">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
        <select title="Enable third cannon" class="toggleCannons">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>
      </td>
      <td>
      </td>
      <td>
      </td>
      <td>
      </td>
    </tr>
  </table>
  `;
    console.log(html);
    // eslint-disable-next-line no-undef
    $('#eventLocationsSettingsDiv').html(html);
  },
  greatWinterHuntLoad() {
    const storageKey = 'greatWinterHunt';
    if (!localStorage[storageKey]) return;
    const a = JSON.parse(localStorage[storageKey]);
    const p = document.querySelector('#mypanel');
    let isPp =
      a.winter_hunt_grove.ppTrap.normal[0].indexOf('Pecan Pecorino') == 0;
    let isSb = a.winter_hunt_grove.ppTrap.normal[0].indexOf('SUPER') == 0;
    let isGouda = a.winter_hunt_grove.ppTrap.normal[0].indexOf('Gouda') == 0;
    p.querySelector('#hillBaitButton').textContent = isPp
      ? 'PP'
      : isSb
        ? 'SB'
        : isGouda
          ? 'GOU'
          : 'GPP';
    isPp =
      a.winter_hunt_workshop.ppTrap.normal[0].indexOf('Pecan Pecorino') == 0;
    isSb = a.winter_hunt_workshop.ppTrap.normal[0].indexOf('SUPER') == 0;
    isGouda = a.winter_hunt_workshop.ppTrap.normal[0].indexOf('Gouda') == 0;
    p.querySelector('#workshopBaitButton').textContent = isPp
      ? 'PP'
      : isSb
        ? 'SB'
        : isGouda
          ? 'GOU'
          : 'GPP';
    isPp =
      a.winter_hunt_fortress.fsTrap.normal[0].indexOf('Pecan Pecorino') == 0;
    isSb = a.winter_hunt_fortress.fsTrap.normal[0].indexOf('SUPER') == 0;
    isGouda = a.winter_hunt_fortress.fsTrap.normal[0].indexOf('Gouda') == 0;
    p.querySelector('#fortressBaitButton').textContent = isPp
      ? 'PP'
      : isSb
        ? 'SB'
        : isGouda
          ? 'GOU'
          : 'GPP';
    p.querySelector('#startPpQtyInput').value = a.startPpQty;
    p.querySelector('#ppKeptQtyInput').value = a.ppKeptQty;
    p.querySelector('#gppEndQtyInput').value = a.gppEndQty;
    p.querySelector('#gppAreaSelect').value = a.gppArea;
    p.querySelector('#startCinnamonQtyInput').value = a.startCinnamonQty;
    p.querySelector('#cinnamonKeptQtyInput').value = a.cinnamonKeptQty;
    p.querySelector('#tooManyCinnamonInput').value = a.tooManyCinnamon;
    p.querySelectorAll('.stopForgeAt')[0].value = a.stopForgeAt[0];
    p.querySelectorAll('.stopForgeAt')[1].value = a.stopForgeAt[1];
    p.querySelectorAll('.stopForgeAt')[2].value = a.stopForgeAt[2];
    p.querySelector('#goHailstoneQtyInput').value = a.goHailstoneQty;
    p.querySelector('#hailstoneKeptQtyInput').value = a.hailstoneKeptQty;
    p.querySelector('#tooManyHailstoneInput').value = a.tooManyHailstone;
    p.querySelector('#fsKeptQtyInput').value = a.fsKeptQty;
    p.querySelector('#isAutoGolemSelect').value = a.isAutoGolem;
    p.querySelector('#isAutoUpgradeSelect').value = a.isAutoUpgrade;
    p.querySelector('#isScarfUnusedGolemSelect').value = a.isScarfUnusedGolem;
    p.querySelector('#golemsAutoBuildInput').value = a.golemsAutoBuild;
    p.querySelector('#golemsAutoUpgradeInput').value = a.golemsAutoUpgrade;
    p.querySelector('#golemsAutoClaimInput').value = a.golemsAutoClaim;
    [...p.querySelectorAll('.defaultGolemTarget')].forEach(
      (v, i) => (v.value = a.golemSetup.defaultTarget[i])
    );
    p.querySelector('#isGoodGoTdSelect').value = a.isGoodGoTd;
    p.querySelector('#badGotdDatesInput').value = a.badGotdDates.join(',');
    p.querySelector('#isAutoMappingSelect').value = a.isAutoMapping;
    p.querySelector('#isMappingSelect').value = a.isMapping;
    p.querySelector('#isCheckPpMiceBaitSelect').value = a.isCheckPpMiceBait;
    p.querySelector('#isForcedMapClearOrderSelect').value =
      a.isForcedMapClearOrder;
    [...p.querySelectorAll('.mapAreaClearOrder')].forEach(
      (v, i) => (v.value = a.mapAreaClearOrder[i])
    );
    p.querySelector('#dropMapGppAsGppLessThanInput').value =
      a.dropMapGppAsGppLessThan;
    p.querySelector('#dropMapGlazyAsGppLessThanInput').value =
      a.dropMapGlazyAsGppLessThan;
    p.querySelector('#stopAnimatedSnowCannonAtInput').value =
      a.shutdown.stopAnimatedSnowCannonAt;
    p.querySelector('#stopCinnamonCannonAtInput').value =
      a.shutdown.stopCinnamonCannonAt;
    p.querySelector('#isAutoFortressSelect').value = a.shutdown.isAutoFortress;
    const trapArea = p.querySelector('#trapAreaSelect').value;
    const trapType = p.querySelector('#trapTypeSelect').value;
    const trapGoTd = p.querySelector('#trapGoTdSelect').value;
    p.querySelector('#gwhBaitInput').value = a[trapArea][trapType][trapGoTd][0];
    p.querySelector('#gwhWeaponInput').value =
      a[trapArea][trapType][trapGoTd][1];
    p.querySelector('#gwhBaseInput').value = a[trapArea][trapType][trapGoTd][2];
    p.querySelector('#gwhCharmInput').value =
      a[trapArea][trapType][trapGoTd][3];
    p.querySelector('#gwhFestiveSpiritSelect').value =
      a[trapArea][trapType][trapGoTd][4];
    [...p.querySelectorAll('.toggleCannons')].forEach(
      (v, i) => (v.value = a[trapArea][trapType][trapGoTd][5][i])
    );
    // p.querySelector('#').value = a.;
    // toggle Hill Bait
    p.querySelector('#hillBaitButton').addEventListener('click', function (e) {
      const a = JSON.parse(localStorage[storageKey]);
      const isPp =
        a.winter_hunt_grove.ppTrap.normal[0].indexOf('Pecan Pecorino') == 0;
      const isSb = a.winter_hunt_grove.ppTrap.normal[0].indexOf('SUPER') == 0;
      const isGouda =
        a.winter_hunt_grove.ppTrap.normal[0].indexOf('Gouda') == 0;
      a.winter_hunt_grove.ppTrap.normal[0] = isPp
        ? 'Glazed Pecan,Pecan Pecorino'
        : isSb
          ? 'Gouda'
          : isGouda
            ? 'Pecan Pecorino'
            : 'SUPER';
      a.winter_hunt_grove.ppTrap.gotd[0] = isPp
        ? 'Glazed Pecan,Pecan Pecorino'
        : isSb
          ? 'Gouda'
          : isGouda
            ? 'Pecan Pecorino'
            : 'SUPER';
      localStorage[storageKey] = JSON.stringify(a);
      e.target.innerHTML = isPp ? 'GPP' : isSb ? 'GOU' : isGouda ? 'PP' : 'SB';
      console.log(JSON.parse(localStorage[storageKey]));
    });
    // toggle Workshop Bait
    p.querySelector('#workshopBaitButton').addEventListener(
      'click',
      function (e) {
        const a = JSON.parse(localStorage[storageKey]);
        const isPp =
          a.winter_hunt_workshop.ppTrap.normal[0].indexOf('Pecan Pecorino') ==
          0;
        const isSb =
          a.winter_hunt_workshop.ppTrap.normal[0].indexOf('SUPER') == 0;
        const isGouda =
          a.winter_hunt_workshop.ppTrap.normal[0].indexOf('Gouda') == 0;
        a.winter_hunt_workshop.ppTrap.normal[0] = isPp
          ? 'Glazed Pecan,Pecan Pecorino'
          : isSb
            ? 'Gouda'
            : isGouda
              ? 'Pecan Pecorino'
              : 'SUPER';
        a.winter_hunt_workshop.ppTrap.gotd[0] = isPp
          ? 'Glazed Pecan,Pecan Pecorino'
          : isSb
            ? 'Gouda'
            : isGouda
              ? 'Pecan Pecorino'
              : 'SUPER';
        localStorage[storageKey] = JSON.stringify(a);
        e.target.innerHTML = isPp
          ? 'GPP'
          : isSb
            ? 'GOU'
            : isGouda
              ? 'PP'
              : 'SB';
        console.log(JSON.parse(localStorage[storageKey]));
      }
    );
    // toggle Fortress Bait
    p.querySelector('#fortressBaitButton').addEventListener(
      'click',
      function (e) {
        const a = JSON.parse(localStorage[storageKey]);
        const isPp =
          a.winter_hunt_fortress.fsTrap.normal[0].indexOf('Pecan Pecorino') ==
          0;
        const isSb =
          a.winter_hunt_fortress.fsTrap.normal[0].indexOf('SUPER') == 0;
        const isGouda =
          a.winter_hunt_fortress.fsTrap.normal[0].indexOf('Gouda') == 0;
        a.winter_hunt_fortress.fsTrap.normal[0] = isPp
          ? 'Glazed Pecan,Pecan Pecorino'
          : isSb
            ? 'Gouda'
            : isGouda
              ? 'Pecan Pecorino'
              : 'SUPER';
        a.winter_hunt_fortress.fsTrap.gotd[0] = isPp
          ? 'Glazed Pecan,Pecan Pecorino'
          : isSb
            ? 'Gouda'
            : isGouda
              ? 'Pecan Pecorino'
              : 'SUPER';
        a.winter_hunt_fortress.ppTrap.normal[0] = isPp
          ? 'Glazed Pecan,Pecan Pecorino'
          : isSb
            ? 'Gouda'
            : isGouda
              ? 'Pecan Pecorino'
              : 'SUPER';
        a.winter_hunt_fortress.ppTrap.gotd[0] = isPp
          ? 'Glazed Pecan,Pecan Pecorino'
          : isSb
            ? 'Gouda'
            : isGouda
              ? 'Pecan Pecorino'
              : 'SUPER';
        localStorage[storageKey] = JSON.stringify(a);
        e.target.innerHTML = isPp
          ? 'GPP'
          : isSb
            ? 'GOU'
            : isGouda
              ? 'PP'
              : 'SB';
        console.log(JSON.parse(localStorage[storageKey]));
      }
    );
    // Change trap
    p.getElementById('trapAreaSelect').addEventListener('change', function (e) {
      const a = JSON.parse(localStorage[storageKey]);
      const trapArea = p.querySelector('#trapAreaSelect').value;
      const trapType = p.querySelector('#trapTypeSelect').value;
      const trapGoTd = p.querySelector('#trapGoTdSelect').value;
      loadTrap(a, trapArea, trapType, trapGoTd);
      console.log(a);
    });
    p.getElementById('trapTypeSelect').addEventListener('change', function (e) {
      const a = JSON.parse(localStorage[storageKey]);
      const trapArea = p.querySelector('#trapAreaSelect').value;
      const trapType = p.querySelector('#trapTypeSelect').value;
      const trapGoTd = p.querySelector('#trapGoTdSelect').value;
      loadTrap(a, trapArea, trapType, trapGoTd);
      console.log(a);
    });
    p.getElementById('trapGoTdSelect').addEventListener('change', function (e) {
      const a = JSON.parse(localStorage[storageKey]);
      const trapArea = p.querySelector('#trapAreaSelect').value;
      const trapType = p.querySelector('#trapTypeSelect').value;
      const trapGoTd = p.querySelector('#trapGoTdSelect').value;
      loadTrap(a, trapArea, trapType, trapGoTd);
      console.log(a);
    });
    function loadTrap(a, trapArea, trapType, trapGoTd) {
      const p = document.querySelector('#mypanel');
      p.querySelector('#gwhBaitInput').value =
        a[trapArea][trapType][trapGoTd][0];
      p.querySelector('#gwhWeaponInput').value =
        a[trapArea][trapType][trapGoTd][1];
      p.querySelector('#gwhBaseInput').value =
        a[trapArea][trapType][trapGoTd][2];
      p.querySelector('#gwhCharmInput').value =
        a[trapArea][trapType][trapGoTd][3];
      p.querySelector('#gwhFestiveSpiritSelect').value =
        a[trapArea][trapType][trapGoTd][4];
      p.querySelectorAll('.toggleCannons')[0].value =
        a[trapArea][trapType][trapGoTd][5][0];
      p.querySelectorAll('.toggleCannons')[1].value =
        a[trapArea][trapType][trapGoTd][5][1];
      p.querySelectorAll('.toggleCannons')[2].value =
        a[trapArea][trapType][trapGoTd][5][2];
    }
  },
  greatWinterHuntSave() {
    const storageKey = 'greatWinterHunt';
    const a = localStorage[storageKey]
      ? JSON.parse(localStorage[storageKey])
      : {};
    const p = document.querySelector('#mypanel');
    a.startPpQty = parseInt(p.querySelector('#startPpQtyInput').value);
    a.ppKeptQty = parseInt(p.querySelector('#ppKeptQtyInput').value);
    a.gppEndQty = parseInt(p.querySelector('#gppEndQtyInput').value);
    a.gppArea = p.querySelector('#gppAreaSelect').value;
    a.startCinnamonQty = parseInt(
      p.querySelector('#startCinnamonQtyInput').value
    );
    a.cinnamonKeptQty = parseInt(
      p.querySelector('#cinnamonKeptQtyInput').value
    );
    a.tooManyCinnamon = parseInt(
      p.querySelector('#tooManyCinnamonInput').value
    );
    a.stopForgeAt[0] = parseInt(p.querySelectorAll('.stopForgeAt')[0].value);
    a.stopForgeAt[1] = parseInt(p.querySelectorAll('.stopForgeAt')[1].value);
    a.stopForgeAt[2] = parseInt(p.querySelectorAll('.stopForgeAt')[2].value);
    a.goHailstoneQty = parseInt(p.querySelector('#goHailstoneQtyInput').value);
    a.hailstoneKeptQty = parseInt(
      p.querySelector('#hailstoneKeptQtyInput').value
    );
    a.tooManyHailstone = parseInt(
      p.querySelector('#tooManyHailstoneInput').value
    );
    a.fsKeptQty = parseInt(p.querySelector('#fsKeptQtyInput').value);
    a.isAutoGolem = p.querySelector('#isAutoGolemSelect').value === 'true';
    a.isAutoUpgrade = p.querySelector('#isAutoUpgradeSelect').value === 'true';
    a.isScarfUnusedGolem =
      p.querySelector('#isScarfUnusedGolemSelect').value === 'true';
    a.golemsAutoBuild = parseInt(
      p.querySelector('#golemsAutoBuildInput').value
    );
    a.golemsAutoUpgrade = parseInt(
      p.querySelector('#golemsAutoUpgradeInput').value
    );
    a.golemsAutoClaim = parseInt(
      p.querySelector('#golemsAutoClaimInput').value
    );
    [...p.querySelectorAll('.defaultGolemTarget')].forEach(
      (v, i) => (a.golemSetup.defaultTarget[i] = v.value)
    );
    a.isGoodGoTd = p.querySelector('#isGoodGoTdSelect').value === 'true';
    a.badGotdDates = p.querySelector('#badGotdDatesInput').value.split(',');
    a.isAutoMapping = p.querySelector('#isAutoMappingSelect').value === 'true';
    a.isMapping = p.querySelector('#isMappingSelect').value === 'true';
    a.isCheckPpMiceBait =
      p.querySelector('#isCheckPpMiceBaitSelect').value === 'true';
    a.isForcedMapClearOrder =
      p.querySelector('#isForcedMapClearOrderSelect').value === 'true';
    [...p.querySelectorAll('.mapAreaClearOrder')].forEach(
      (v, i) => (a.mapAreaClearOrder[i] = v.value)
    );
    a.dropMapGppAsGppLessThan = parseInt(
      p.querySelector('#dropMapGppAsGppLessThanInput').value
    );
    a.dropMapGlazyAsGppLessThan = parseInt(
      p.querySelector('#dropMapGlazyAsGppLessThanInput').value
    );
    a.shutdown.stopAnimatedSnowCannonAt = parseInt(
      p.querySelector('#stopAnimatedSnowCannonAtInput').value
    );
    a.shutdown.stopCinnamonCannonAt = parseInt(
      p.querySelector('#stopCinnamonCannonAtInput').value
    );
    a.shutdown.isAutoFortress =
      p.querySelector('#isAutoFortressSelect').value === 'true';
    const trapArea = p.querySelector('#trapAreaSelect').value;
    const trapType = p.querySelector('#trapTypeSelect').value;
    const trapGoTd = p.querySelector('#trapGoTdSelect').value;
    a[trapArea][trapType][trapGoTd][0] = p.querySelector('#gwhBaitInput').value;
    a[trapArea][trapType][trapGoTd][1] =
      p.querySelector('#gwhWeaponInput').value;
    a[trapArea][trapType][trapGoTd][2] = p.querySelector('#gwhBaseInput').value;
    a[trapArea][trapType][trapGoTd][3] =
      p.querySelector('#gwhCharmInput').value;
    a[trapArea][trapType][trapGoTd][4] =
      p.querySelector('#gwhFestiveSpiritSelect').value === 'true';
    a[trapArea][trapType][trapGoTd][5][0] =
      p.querySelectorAll('.toggleCannons')[0].value === 'true';
    a[trapArea][trapType][trapGoTd][5][1] =
      p.querySelectorAll('.toggleCannons')[1].value === 'true';
    a[trapArea][trapType][trapGoTd][5][2] =
      p.querySelectorAll('.toggleCannons')[2].value === 'true';
    localStorage[storageKey] = JSON.stringify(a);
    console.log(JSON.parse(localStorage[storageKey]));
  },
  floating_islands() {
    const powerCodeOptions = `
      <option value=""></option>
      <option value="arcn">Arcane</option>
      <option value="drcnc">Draconic</option>
      <option value="frgttn">Forgotten</option>
      <option value="hdr">Hydro</option>
      <option value="law">Law</option>
      <option value="phscl">Physical</option>
      <option value="shdw">Shadow</option>
      <option value="tctcl">Tactical</option>
    `;
    const laiPowerTypesDdl = `
      <select
        class="myLaiPowerTypes"
        style="background-color:rgb(250, 80, 130);">
        ${powerCodeOptions}
      </select>
    `;
    const haiPowerTypesDdl = `
      <select
        class="myHaiPowerTypes"
        style="background-color:rgb(240, 235, 190);">
        ${powerCodeOptions}
      </select>
    `;
    const modOptions = `
      <option value="loot_cache">Loot Cache</option>
      <option value="sky_pirates">Sky Pirate Den</option>
      <option value="cloudstone_bonus">Empyrean Seal Stowage</option>
      <option value="charm_bonus">Ancient Jade Stockpile</option>
      <option value="ore_gem_bonus">Ore and Glass Deposit</option>
    `;
    const spModDdl = `
      <select title="SP Wheel mod" class="spWheelPattern">
        ${modOptions}
      </select>
    `;
    const html = `
  <table>
    <tr>
      <td>
        <b>Travel to</b>
        <select title="在 Launch Pad且不自動 Sky Map時前往此處" id="travelToInput">
        </select>
      </td>
      <td>
        <b>Low CC</b>
        <select title="Cloud Curd是否不足" id="isLowCCDdl">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
        <b>auto CJS</b>
        <select title="是否自動使用 CJS" id="isAutoCjsDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>
        <b>Sleep In CJS</b>
        <select title="CJS中是否睡覺" id="isSleepInCJSDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>
        <b>Use Bottled Wind</b>
        <select title="是否使用 Bottled Wind"
          style="background-color:rgb(140, 238, 255);"
          id="isBottledWindDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>
        <b>Auto Hunt after Trove</b>
        <select title="是否自動判斷 Trove後繼續 hunt"
          style="background-color:rgb(140, 238, 255);"
          id="isAutoHuntAfterTroveDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>
        <b>start Pirate Hunting Progress in SP</b>
        <input
          title="SP從多少 progress開始 Pirate hunting"
          type="number"
          id="startPirateProgressSpInput"
          value="30">
      </td>
      <td>
        <b>Auto Buy</b>
        <select title="是否自動買 cheese" id="isAutoBuyDdl">
          <option value="true" selected>Yes</option>
          <option value="false">No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>
        <b>Shrine Max Index</b>
        <input title="Shrine index必須小於(不含)此值, LAI/HAI通用"
          type="number" id="shrineMaxIndexInput" value="4">
      </td>
      <td>
      </td>
      <td>
      </td>
      <td>
      </td>
    </tr>
    <tr>
      <td>&nbsp;</td>
      <td><strong style="font-weight: bold;">LAI</strong></td>
      <td><strong style="font-weight: bold;">HAI</strong></td>
      <td><strong style="font-weight: bold;">SP</strong></td>
    </tr>
    <tr>
      <td>Auto Sky Map</td>
      <td>
        <select title="是否自動 LAI Sky Map" id="isAutoLaiDdl">
          <option value="true" selected>Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
        <select title="是否自動 HAI Sky Map" id="isAutoHaiDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>
        <select title="是否自動 Sky Palace" id="isAutoSpDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>
        Included HAI Shrine
      </td>
      <td colspan="3">
        <select
          class="includedHaiShrine"
          style="background-color:rgb(250, 80, 130);">
          <option value=""></option>
          <option value="paragon_cache_a">Sproc</option>
        </select>
        <select
          class="includedHaiShrine"
          style="background-color:rgb(250, 80, 130);">
          <option value=""></option>
          <option value="paragon_cache_b">Silk</option>
        </select>
        <select
          class="includedHaiShrine"
          style="background-color:rgb(250, 80, 130);">
          <option value=""></option>
          <option value="paragon_cache_c">Wing</option>
        </select>
        <select
          class="includedHaiShrine"
          style="background-color:rgb(250, 80, 130);">
          <option value=""></option>
          <option value="paragon_cache_d">Bangle</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>
        My HAI Powers
      </td>
      <td colspan="3">
        ${haiPowerTypesDdl}
        ${haiPowerTypesDdl}
        ${haiPowerTypesDdl}
        ${haiPowerTypesDdl}
        ${haiPowerTypesDdl}
        ${haiPowerTypesDdl}
        ${haiPowerTypesDdl}
        ${haiPowerTypesDdl}
      </td>
    </tr>
    <tr>
      <td>
        My LAI Powers
      </td>
      <td colspan="3">
        ${laiPowerTypesDdl}
        ${laiPowerTypesDdl}
        ${laiPowerTypesDdl}
        ${laiPowerTypesDdl}
        ${laiPowerTypesDdl}
        ${laiPowerTypesDdl}
        ${laiPowerTypesDdl}
        ${laiPowerTypesDdl}
      </td>
    </tr>
    <tr>
      <td>
        SP Wheel Pattern
      </td>
      <td colspan="3">
        <select title="SP Wheel power type" class="spWheelPattern">
          ${powerCodeOptions}
        </select>
        ${spModDdl}
        ${spModDdl}
        ${spModDdl}
        ${spModDdl}
      </td>
    </tr>
    <tr>
      <td>Use Cyclone</td>
      <td>
        <select title="是否 cyclone LAI" id="isCycleLaiDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>
        <select title="是否 cyclone HAI" id="isCycleHaiDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>
        <select title="是否 cyclone SP" id="isCycleSpDdl">
          <option value="true" selected>Yes</option>
          <option value="false">No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>Bottled Wind Last Block</td>
      <td>
        <select title="是否 BW LAI last block" id="isBwLaiLastBlockDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>
        <select title="是否 BW HAI last block" id="isBwHaiLastBlockDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>
        <select title="是否 BW SP last block" id="isBwSpLastBlockDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>Bottled Wind Boss</td>
      <td>
        <select title="Warden是否 Bottled Wind" id="isBottledWindWardenDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>
        <select title="Paragon是否 Bottled Wind" id="isBottledWindParagonDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>
        <select title="Empress是否 Bottled Wind" id="isBottledWindEmpressDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>Bottled Wind after Trove</td>
      <td>
        <select title="LAI Trove後是否繼續 Bottled Wind"
          id="isBwAfterLaiTroveDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>
        <select title="HAI Trove後是否繼續 Bottled Wind"
          id="isBwAfterHaiTroveDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>
        <select title="SP Trove後是否繼續 Bottled Wind"
          id="isBwAfterSpTroveDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>Auto Bottled Wind Off</td>
      <td>
        <select title="是否自動關閉 LAI Bottled Wind" id="isBwAutoOffLaiDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>
        <select title="是否自動關閉 HAI Bottled Wind" id="isBwAutoOffHaiDdl">
          <option value="true" selected>Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
        <select title="是否自動關閉 SP Bottled Wind" id="isBwAutoOffSPDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>Hunt after Boss</td>
      <td>
        <select title="LAI Boss後是否繼續 hunt" id="isHuntAfterBossLaiDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>
        <select title="HAI Boss後是否繼續 hunt" id="isHuntAfterBossHaiDdl">
          <option value="true" selected>Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
        <select title="SP Boss後是否繼續 hunt" id="isHuntAfterBossSpDdl">
          <option value="true" selected>Yes</option>
          <option value="false">No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>Hunt after Trove</td>
      <td>
        <select title="LAI Trove後是否繼續 hunt" id="isHuntAfterLaiTroveDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>
        <select title="HAI Trove後是否繼續 hunt" id="isHuntAfterHaiTroveDdl">
          <option value="true" selected>Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
        <select title="SP Trove後是否繼續 hunt" id="isHuntAfterSpTroveDdl">
          <option value="true" selected>Yes</option>
          <option value="false">No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>Is Hunting Pirate</td>
      <td>
        <select title="是否 LAI Pirate hunting" id="isPirateHuntingLaiDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>
        <select title="是否 HAI Pirate hunting" id="isPirateHuntingHaiDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>
        <select title="是否 SP Pirate hunting" id="isPirateHuntingSpDdl">
          <option value="true" selected>Yes</option>
          <option value="false">No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>
      </td>
      <td>
      </td>
      <td>
      </td>
      <td>
      </td>
    </tr>
  </table>
  `;
    console.log(html);
    // eslint-disable-next-line no-undef
    $('#eventLocationsSettingsDiv').html(html);
  },
  floating_islandsLoad() {
    const storageKey = 'floating_islands';
    if (!localStorage[storageKey]) return;
    const a = JSON.parse(localStorage[storageKey]);
    const p = document.querySelector('#mypanel');
    p.querySelector('#travelToInput').value = a.travelTo; // not empty if never hunt in launch
    p.querySelector('#isLowCCDdl').value = a.isLowCC;
    p.querySelector('#isAutoCjsDdl').value = a.isAutoCjs;
    p.querySelector('#isSleepInCJSDdl').value = a.isSleepInCJS;
    p.querySelector('#isAutoLaiDdl').value = a.isAutoLai;
    p.querySelector('#isAutoHaiDdl').value = a.isAutoHai;
    p.querySelector('#isAutoSpDdl').value = a.isAutoSp;
    const includedHaiShrineDdls = p.querySelectorAll('.includedHaiShrine');
    includedHaiShrineDdls[0].value =
      a.includedHaiShrine.indexOf('paragon_cache_a') < 0
        ? ''
        : 'paragon_cache_a'; // null or empty if not filter
    includedHaiShrineDdls[1].value =
      a.includedHaiShrine.indexOf('paragon_cache_b') < 0
        ? ''
        : 'paragon_cache_b'; // null or empty if not filter
    includedHaiShrineDdls[2].value =
      a.includedHaiShrine.indexOf('paragon_cache_c') < 0
        ? ''
        : 'paragon_cache_c'; // null or empty if not filter
    includedHaiShrineDdls[3].value =
      a.includedHaiShrine.indexOf('paragon_cache_d') < 0
        ? ''
        : 'paragon_cache_d'; // null or empty if not filter
    p.querySelector('#isCycleLaiDdl').value = a.isCycleLai;
    p.querySelector('#isCycleHaiDdl').value = a.isCycleHai;
    p.querySelector('#isCycleSpDdl').value = a.isCycleSp;
    p.querySelector('#isBottledWindDdl').value = a.isBottledWind;
    p.querySelector('#isBwLaiLastBlockDdl').value = a.isBwLaiLastBlock;
    p.querySelector('#isBwHaiLastBlockDdl').value = a.isBwHaiLastBlock;
    p.querySelector('#isBwSpLastBlockDdl').value = a.isBwSpLastBlock;
    p.querySelector('#isBottledWindWardenDdl').value = a.isBottledWindWarden;
    p.querySelector('#isBottledWindParagonDdl').value = a.isBottledWindParagon;
    p.querySelector('#isBottledWindEmpressDdl').value = a.isBottledWindEmpress;
    p.querySelector('#isBwAfterLaiTroveDdl').value = a.isBwAfterLaiTrove;
    p.querySelector('#isBwAfterHaiTroveDdl').value = a.isBwAfterHaiTrove;
    p.querySelector('#isBwAfterSpTroveDdl').value = a.isBwAfterSpTrove;
    p.querySelector('#isBwAutoOffLaiDdl').value = a.isBwAutoOffLai;
    p.querySelector('#isBwAutoOffHaiDdl').value = a.isBwAutoOffHai;
    p.querySelector('#isBwAutoOffSPDdl').value = a.isBwAutoOffSP;
    p.querySelector('#isHuntAfterBossLaiDdl').value = a.isHuntAfterBossLai;
    p.querySelector('#isHuntAfterBossHaiDdl').value = a.isHuntAfterBossHai;
    p.querySelector('#isHuntAfterBossSpDdl').value = a.isHuntAfterBossSp;
    p.querySelector('#isHuntAfterLaiTroveDdl').value = a.isHuntAfterLaiTrove;
    p.querySelector('#isHuntAfterHaiTroveDdl').value = a.isHuntAfterHaiTrove;
    p.querySelector('#isHuntAfterSpTroveDdl').value = a.isHuntAfterSpTrove;
    p.querySelector('#isAutoHuntAfterTroveDdl').value = a.isAutoHuntAfterTrove;
    p.querySelector('#isPirateHuntingLaiDdl').value = a.isPirateHuntingLai;
    p.querySelector('#isPirateHuntingHaiDdl').value = a.isPirateHuntingHai;
    p.querySelector('#isPirateHuntingSpDdl').value = a.isPirateHuntingSp;
    p.querySelector('#startPirateProgressSpInput').value =
      a.startPirateProgressSp;
    p.querySelector('#isAutoBuyDdl').value = a.isAutoBuy;
    let classKey = 'myLaiPowerTypes';
    p.querySelectorAll(`.${classKey}`).forEach(
      (v, i) => (v.value = a[classKey][i] ? a[classKey][i] : '')
    );
    classKey = 'myHaiPowerTypes';
    p.querySelectorAll(`.${classKey}`).forEach(
      (v, i) => (v.value = a[classKey][i] ? a[classKey][i] : '')
    );
    p.querySelector('#shrineMaxIndexInput').value = a.shrineMaxIndex;
    classKey = 'spWheelPattern';
    p.querySelectorAll(`.${classKey}`).forEach(
      (v, i) => (v.value = a[classKey][i] ? a[classKey][i] : '')
    );
    // document.querySelector('#').value = a.;
    // document.querySelector('#').value = a.;
    // document.querySelector('#').value = a.;
    // document.querySelector('#').value = a.;
    // Change trap
    // document
    //   .getElementById('trapAreaSelect')
    //   .addEventListener('change', function (e) {
    //     const a = JSON.parse(localStorage[storageKey]);
    //     const trapArea = document.querySelector('#trapAreaSelect').value;
    //     const trapType = document.querySelector('#trapTypeSelect').value;
    //     const trapGoTd = document.querySelector('#trapGoTdSelect').value;
    //     functions.loadGwhTrap(a, trapArea, trapType, trapGoTd);
    //     console.log(a);
    //   });
    // document
    //   .getElementById('trapTypeSelect')
    //   .addEventListener('change', function (e) {
    //     const a = JSON.parse(localStorage[storageKey]);
    //     const trapArea = document.querySelector('#trapAreaSelect').value;
    //     const trapType = document.querySelector('#trapTypeSelect').value;
    //     const trapGoTd = document.querySelector('#trapGoTdSelect').value;
    //     functions.loadGwhTrap(a, trapArea, trapType, trapGoTd);
    //     console.log(a);
    //   });
    // document
    //   .getElementById('trapGoTdSelect')
    //   .addEventListener('change', function (e) {
    //     const a = JSON.parse(localStorage[storageKey]);
    //     const trapArea = document.querySelector('#trapAreaSelect').value;
    //     const trapType = document.querySelector('#trapTypeSelect').value;
    //     const trapGoTd = document.querySelector('#trapGoTdSelect').value;
    //     functions.loadGwhTrap(a, trapArea, trapType, trapGoTd);
    //     console.log(a);
    //   });
    function loadTrap(a, trapArea, trapType, trapGoTd) {
      document.querySelector('#gwhBaitInput').value =
        a[trapArea][trapType][trapGoTd][0];
      document.querySelector('#gwhWeaponInput').value =
        a[trapArea][trapType][trapGoTd][1];
      document.querySelector('#gwhBaseInput').value =
        a[trapArea][trapType][trapGoTd][2];
      document.querySelector('#gwhCharmInput').value =
        a[trapArea][trapType][trapGoTd][3];
      document.querySelector('#gwhFestiveSpiritSelect').value =
        a[trapArea][trapType][trapGoTd][4];
      document.querySelectorAll('.toggleCannons')[0].value =
        a[trapArea][trapType][trapGoTd][5][0];
      document.querySelectorAll('.toggleCannons')[1].value =
        a[trapArea][trapType][trapGoTd][5][1];
      document.querySelectorAll('.toggleCannons')[2].value =
        a[trapArea][trapType][trapGoTd][5][2];
    }
  },
  floating_islandsSave() {
    const storageKey = 'floating_islands';
    const a = localStorage[storageKey]
      ? JSON.parse(localStorage[storageKey])
      : {};
    const p = document.querySelector('#mypanel');
    a.travelTo = p.querySelector('#travelToInput').value; // not empty if never hunt in launch
    a.isLowCC = p.querySelector('#isLowCCDdl').value === 'true';
    a.isAutoCjs = p.querySelector('#isAutoCjsDdl').value === 'true';
    a.isSleepInCJS = p.querySelector('#isSleepInCJSDdl').value === 'true';
    a.isAutoLai = p.querySelector('#isAutoLaiDdl').value === 'true';
    a.isAutoHai = p.querySelector('#isAutoHaiDdl').value === 'true';
    a.isAutoSp = p.querySelector('#isAutoSpDdl').value === 'true';
    a.includedHaiShrine = []; // null or empty if not filter
    [...p.querySelectorAll('.includedHaiShrine')].forEach((v) => {
      if (v.value.trim() !== '') a.includedHaiShrine.push(v.value.trim());
    });
    a.isCycleLai = p.querySelector('#isCycleLaiDdl').value === 'true';
    a.isCycleHai = p.querySelector('#isCycleHaiDdl').value === 'true';
    a.isCycleSp = p.querySelector('#isCycleSpDdl').value === 'true';
    a.isBottledWind = p.querySelector('#isBottledWindDdl').value === 'true';
    a.isBwLaiLastBlock =
      p.querySelector('#isBwLaiLastBlockDdl').value === 'true';
    a.isBwHaiLastBlock =
      p.querySelector('#isBwHaiLastBlockDdl').value === 'true';
    a.isBwSpLastBlock = p.querySelector('#isBwSpLastBlockDdl').value === 'true';
    a.isBottledWindWarden =
      p.querySelector('#isBottledWindWardenDdl').value === 'true';
    a.isBottledWindParagon =
      p.querySelector('#isBottledWindParagonDdl').value === 'true';
    a.isBottledWindEmpress =
      p.querySelector('#isBottledWindEmpressDdl').value === 'true';
    a.isBwAfterLaiTrove =
      p.querySelector('#isBwAfterLaiTroveDdl').value === 'true';
    a.isBwAfterHaiTrove =
      p.querySelector('#isBwAfterHaiTroveDdl').value === 'true';
    a.isBwAfterSpTrove =
      p.querySelector('#isBwAfterSpTroveDdl').value === 'true';
    a.isBwAutoOffLai = p.querySelector('#isBwAutoOffLaiDdl').value === 'true';
    a.isBwAutoOffHai = p.querySelector('#isBwAutoOffHaiDdl').value === 'true';
    a.isBwAutoOffSP = p.querySelector('#isBwAutoOffSPDdl').value === 'true';
    a.isHuntAfterBossLai =
      p.querySelector('#isHuntAfterBossLaiDdl').value === 'true';
    a.isHuntAfterBossHai =
      p.querySelector('#isHuntAfterBossHaiDdl').value === 'true';
    a.isHuntAfterBossSp =
      p.querySelector('#isHuntAfterBossSpDdl').value === 'true';
    a.isHuntAfterLaiTrove =
      p.querySelector('#isHuntAfterLaiTroveDdl').value === 'true';
    a.isHuntAfterHaiTrove =
      p.querySelector('#isHuntAfterHaiTroveDdl').value === 'true';
    a.isHuntAfterSpTrove =
      p.querySelector('#isHuntAfterSpTroveDdl').value === 'true';
    a.isAutoHuntAfterTrove =
      p.querySelector('#isAutoHuntAfterTroveDdl').value === 'true';
    a.isPirateHuntingLai =
      p.querySelector('#isPirateHuntingLaiDdl').value === 'true';
    a.isPirateHuntingHai =
      p.querySelector('#isPirateHuntingHaiDdl').value === 'true';
    a.isPirateHuntingSp =
      p.querySelector('#isPirateHuntingSpDdl').value === 'true';
    a.startPirateProgressSp = parseInt(
      p.querySelector('#startPirateProgressSpInput').value
    );
    a.isAutoBuy = p.querySelector('#isAutoBuyDdl').value === 'true';
    a.myLaiPowerTypes = [];
    [...p.querySelectorAll('.myLaiPowerTypes')].forEach((v) => {
      if (v.value.trim() !== '') a.myLaiPowerTypes.push(v.value.trim());
    });
    a.myHaiPowerTypes = [];
    [...p.querySelectorAll('.myHaiPowerTypes')].forEach((v) => {
      if (v.value.trim() !== '') a.myHaiPowerTypes.push(v.value.trim());
    });
    a.shrineMaxIndex = parseInt(p.querySelector('#shrineMaxIndexInput').value);
    a.spWheelPattern = [];
    [...p.querySelectorAll('.spWheelPattern')].forEach((v) => {
      if (v.value.trim() !== '') a.spWheelPattern.push(v.value.trim());
    });
    localStorage[storageKey] = JSON.stringify(a);
    console.log(JSON.parse(localStorage[storageKey]));
  },
  rift_valour() {
    const html = `
  <table>
    <tr>
      <td><b>Auto Enter</b></td>
      <td>
        <select
          style="background-color:rgb(140, 238, 255);"
          title="Auto enter tower"
          id="isAutoEnterDdl">
          <option value="true" selected>Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>GSC Quantity to enter</td>
      <td>
        <input
          title="GSC Quantity to enter tower, set to 0 if auto"
          type="number"
          id="minGscToEnterInput"
          value="0">
      </td>
    </tr>
    <tr>
      <td><b>Enter after time</b></td>
      <td>
        <input
          style="background-color:rgb(140, 238, 255);"
          title="Enter tower after this time"
          type="text"
          id="enterAfterTimeInput"
          value="">
      </td>
      <td><b>Enter before time</b></td>
      <td>
        <input
          style="background-color:rgb(140, 238, 255);"
          title="Enter tower before this time"
          type="text"
          id="enterBeforeTimeInput"
          value="">
      </td>
    </tr>
    <tr>
      <td><b>UU run extra Fragment</b></td>
      <td>
        <input
          title="Extra fragments required for UU run"
          type="number"
          id="uuRunExtraFragsInput"
          value="0">
      </td>
      <td><b>UU run extra Secret</b></td>
      <td>
        <input
          title="Extra secrets required for UU run"
          type="number"
          id="uuRunExtraSecretInput"
          value="1000">
      </td>
    </tr>
    <tr>
      <td>Auto Augmentation</td>
      <td>
        <select title="是否自動 Augmentation" id="isAutoAugmentDdl">
          <option value="true" selected>Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>Is Prestige Push</td>
      <td>
        <select title="是否 Prestige Push"
          id="isPrestigePushDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>PP required CF Quantity</td>
      <td>
        <input
          title="Champion's fire required for Prestige Push"
          type="text"
          id="ppRunNeedCfInput"
          value="800">
      </td>
      <td>PP required Bait Quantity</td>
      <td>
        <input
          title="GSC + Elixir required for Prestige Push"
          type="text"
          id="ppRunNeedBaitInput"
          value="900">
      </td>
    </tr>
    <tr>
      <td>Use Sigil Hunter</td>
      <td>
        <select title="是否啟用 Sigil Hunter" id="isSigilHunterDdl">
          <option value="null" selected>Auto</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>Use Secret Research</td>
      <td>
        <select title="是否啟用 Secret Research" id="isSecretResearchDdl">
          <option value="null" selected>Auto</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>Use Super Siphon</td>
      <td>
        <select title="是否啟用 Sigil Hunter" id="isSuperSiphonDdl">
          <option value="null" selected>Auto</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>Use Ultimate Umbra</td>
      <td>
        <select title="是否啟用 Secret Research" id="isUltimateUmbraDdl">
          <option value="null" selected>Auto</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>Use String Stepping</td>
      <td>
        <select title="是否啟用 Sigil Hunter" id="isStringSteppingDdl">
          <option value="null" selected>Auto</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Auto Retreat</td>
      <td>
        <select title="Auto retreat or not" id="isAutoRetreatDdl">
          <option value="true">Yes</option>
          <option value="false" selected>No</option>
        </select>
      </td>
      <td>Minimum Retreat Floor</td>
      <td>
        <input
          title="Can auto retreat after this floor only"
          type="number"
          id="minRetreatFloorInput"
          value="3">
      </td>
    </tr>
    <tr>
      <td>Forced Retreat Floor</td>
      <td>
        <input
          title="Forced retreat after this floor. 0 if not auto retreat"
          type="number"
          id="forceRetreatFloorInput"
          value="0">
      </td>
      <td>Dangerous Hunts</td>
      <td>
        <input
          title="Safe hunts remaining to catch Eclipse"
          type="number"
          id="dangerousHuntsInput"
          value="11">
      </td>
    </tr>
    <tr>
      <td>Safe Hunts Shade</td>
      <td>
        <input
          title="Safe Hunts for Shade of Eclipse"
          type="number"
          id="eclipseNeedHuntsInput"
          value="8">
      </td>
      <td>Safe Hunts Eclipse</td>
      <td>
        <input
          title="Safe Hunts for Total Eclipse"
          type="number"
          id="eclipseUUNeedHuntsInput"
          value="10">
      </td>
    </tr>
    <tr>
      <td>Auto Upgrade</td>
      <td>
        <select
          title="Auto upgrade augmentation or not"
          id="isAutoUpgradeDdl">
          <option value="true" selected>Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>Auto Buy Item</td>
      <td>
        <select
          title="Auto buy items or not"
          id="isAutoBuyItemDdl">
          <option value="true" selected>Yes</option>
          <option value="false">No</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>Minimum GSC quantity</td>
      <td>
        <input
          title="Auto buy GSC as quantity less than this"
          type="number"
          id="minCheeseQtyInput"
          value="20">
      </td>
      <td>Buy GSC quantity</td>
      <td>
        <input
          title="Auto buy this quantity of GSC"
          type="number"
          id="buyCheeseQtyInput"
          value="55">
      </td>
    </tr>
    <tr>
      <td>
      </td>
      <td>
      </td>
      <td>
      </td>
      <td>
      </td>
    </tr>
  </table>
  `;
    console.log(html);
    // eslint-disable-next-line no-undef
    $('#eventLocationsSettingsDiv').html(html);
  },
  rift_valourLoad() {
    const storageKey = 'rift_valour';
    if (!localStorage[storageKey]) return;
    const a = JSON.parse(localStorage[storageKey]);
    const p = document.querySelector('#mypanel');
    p.querySelector('#isAutoEnterDdl').value = a.isAutoEnter;
    p.querySelector('#minGscToEnterInput').value = a.minGscToEnter;
    p.querySelector('#enterAfterTimeInput').value = a.enterAfterTime;
    p.querySelector('#enterBeforeTimeInput').value = a.enterBeforeTime;
    p.querySelector('#isAutoAugmentDdl').value = a.isAutoAugment;
    p.querySelector('#isPrestigePushDdl').value = a.isPrestigePush;
    p.querySelector('#ppRunNeedCfInput').value = a.ppRunNeedCf;
    p.querySelector('#ppRunNeedBaitInput').value = a.ppRunNeedBait;
    p.querySelector('#uuRunExtraFragsInput').value = a.uuRunExtraFrags;
    p.querySelector('#uuRunExtraSecretInput').value = a.uuRunExtraSecret;
    p.querySelector('#isSigilHunterDdl').value = a.isSigilHunter;
    p.querySelector('#isSecretResearchDdl').value = a.isSecretResearch;
    p.querySelector('#isSuperSiphonDdl').value = a.isSuperSiphon;
    p.querySelector('#isUltimateUmbraDdl').value = a.isUltimateUmbra;
    p.querySelector('#isStringSteppingDdl').value = a.isStringStepping;
    p.querySelector('#isAutoRetreatDdl').value = a.isAutoRetreat;
    p.querySelector('#minRetreatFloorInput').value = a.minRetreatFloor;
    p.querySelector('#forceRetreatFloorInput').value = a.forceRetreatFloor;
    p.querySelector('#eclipseNeedHuntsInput').value = a.eclipseNeedHunts;
    p.querySelector('#eclipseUUNeedHuntsInput').value = a.eclipseUUNeedHunts;
    p.querySelector('#isAutoUpgradeDdl').value = a.isAutoUpgrade;
    p.querySelector('#isAutoBuyItemDdl').value = a.isAutoBuyItem;
    p.querySelector('#minCheeseQtyInput').value = a.minCheeseQty;
    p.querySelector('#buyCheeseQtyInput').value = a.buyCheeseQty;
    p.querySelector('#dangerousHuntsInput').value = a.dangerousHunts;
    // document.querySelector('#').value = a.;
    // Change trap
    // document
    //   .getElementById('trapAreaSelect')
    //   .addEventListener('change', function (e) {
    //     const a = JSON.parse(localStorage[storageKey]);
    //     const trapArea = document.querySelector('#trapAreaSelect').value;
    //     const trapType = document.querySelector('#trapTypeSelect').value;
    //     const trapGoTd = document.querySelector('#trapGoTdSelect').value;
    //     functions.loadGwhTrap(a, trapArea, trapType, trapGoTd);
    //     console.log(a);
    //   });
    // document
    //   .getElementById('trapTypeSelect')
    //   .addEventListener('change', function (e) {
    //     const a = JSON.parse(localStorage[storageKey]);
    //     const trapArea = document.querySelector('#trapAreaSelect').value;
    //     const trapType = document.querySelector('#trapTypeSelect').value;
    //     const trapGoTd = document.querySelector('#trapGoTdSelect').value;
    //     functions.loadGwhTrap(a, trapArea, trapType, trapGoTd);
    //     console.log(a);
    //   });
    // document
    //   .getElementById('trapGoTdSelect')
    //   .addEventListener('change', function (e) {
    //     const a = JSON.parse(localStorage[storageKey]);
    //     const trapArea = document.querySelector('#trapAreaSelect').value;
    //     const trapType = document.querySelector('#trapTypeSelect').value;
    //     const trapGoTd = document.querySelector('#trapGoTdSelect').value;
    //     functions.loadGwhTrap(a, trapArea, trapType, trapGoTd);
    //     console.log(a);
    //   });
    function loadTrap(a, trapArea, trapType, trapGoTd) {
      document.querySelector('#gwhBaitInput').value =
        a[trapArea][trapType][trapGoTd][0];
      document.querySelector('#gwhWeaponInput').value =
        a[trapArea][trapType][trapGoTd][1];
      document.querySelector('#gwhBaseInput').value =
        a[trapArea][trapType][trapGoTd][2];
      document.querySelector('#gwhCharmInput').value =
        a[trapArea][trapType][trapGoTd][3];
      document.querySelector('#gwhFestiveSpiritSelect').value =
        a[trapArea][trapType][trapGoTd][4];
      document.querySelectorAll('.toggleCannons')[0].value =
        a[trapArea][trapType][trapGoTd][5][0];
      document.querySelectorAll('.toggleCannons')[1].value =
        a[trapArea][trapType][trapGoTd][5][1];
      document.querySelectorAll('.toggleCannons')[2].value =
        a[trapArea][trapType][trapGoTd][5][2];
    }
  },
  rift_valourSave() {
    const storageKey = 'rift_valour';
    const a = localStorage[storageKey]
      ? JSON.parse(localStorage[storageKey])
      : {};
    const p = document.querySelector('#mypanel');
    a.isAutoEnter = p.querySelector('#isAutoEnterDdl').value === 'true';
    a.minGscToEnter = parseInt(p.querySelector('#minGscToEnterInput').value);
    a.enterAfterTime = p.querySelector('#enterAfterTimeInput').value.trim();
    a.enterBeforeTime = p.querySelector('#enterBeforeTimeInput').value.trim();
    a.isAutoAugment = p.querySelector('#isAutoAugmentDdl').value === 'true';
    a.isPrestigePush = p.querySelector('#isPrestigePushDdl').value === 'true';
    a.ppRunNeedCf = parseInt(p.querySelector('#ppRunNeedCfInput').value);
    a.ppRunNeedBait = parseInt(p.querySelector('#ppRunNeedBaitInput').value);
    a.uuRunExtraFrags = parseInt(
      p.querySelector('#uuRunExtraFragsInput').value
    );
    a.uuRunExtraSecret = parseInt(
      p.querySelector('#uuRunExtraSecretInput').value
    );
    a.isSigilHunter =
      p.querySelector('#isSigilHunterDdl').value === 'null'
        ? null
        : p.querySelector('#isSigilHunterDdl').value === 'true';
    a.isSecretResearch =
      p.querySelector('#isSecretResearchDdl').value === 'null'
        ? null
        : p.querySelector('#isSecretResearchDdl').value === 'true';
    a.isSuperSiphon =
      p.querySelector('#isSuperSiphonDdl').value === 'null'
        ? null
        : p.querySelector('#isSuperSiphonDdl').value === 'true';
    a.isUltimateUmbra =
      p.querySelector('#isUltimateUmbraDdl').value === 'null'
        ? null
        : p.querySelector('#isUltimateUmbraDdl').value === 'true';
    a.isStringStepping =
      p.querySelector('#isStringSteppingDdl').value === 'null'
        ? null
        : p.querySelector('#isStringSteppingDdl').value === 'true';
    a.isAutoRetreat = p.querySelector('#isAutoRetreatDdl').value === 'true';
    a.minRetreatFloor = parseInt(
      p.querySelector('#minRetreatFloorInput').value
    );
    a.forceRetreatFloor = parseInt(
      p.querySelector('#forceRetreatFloorInput').value
    );
    a.eclipseNeedHunts = parseInt(
      p.querySelector('#eclipseNeedHuntsInput').value
    );
    a.eclipseUUNeedHunts = parseInt(
      p.querySelector('#eclipseUUNeedHuntsInput').value
    );
    a.isAutoUpgrade = p.querySelector('#isAutoUpgradeDdl').value === 'true';
    a.isAutoBuyItem = p.querySelector('#isAutoBuyItemDdl').value === 'true';
    a.minCheeseQty = parseInt(p.querySelector('#minCheeseQtyInput').value);
    a.buyCheeseQty = parseInt(p.querySelector('#buyCheeseQtyInput').value);
    a.dangerousHunts = parseInt(p.querySelector('#dangerousHuntsInput').value);
    localStorage[storageKey] = JSON.stringify(a);
    console.log(JSON.parse(localStorage[storageKey]));
  }
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
    // prettier-ignore
    // quick navigation buttons
    let mypanel = `<div id='mypanel' draggble='true' style='z-index: 1000; position: fixed; top: 2px; left: 10px;'>
    <details class="generalDetails" name="mypaneldetails"${localStorage.isLocalPanel ? '' : ' open'}>
      <summary class="generalSummary" style="width: 6em;height: 1.4em;background-color: #22ff22cc;cursor: pointer;place-content: center;font-size: 16px;">General</summary>`;
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
    mypanel += `
    </details>
    <details class="eventLocationDetails" name="mypaneldetails"${localStorage.isLocalPanel ? ' open' : ''}>
      <summary class="eventLocationSummary" style="width: 6em;height: 1.4em;background-color: #22ff22cc;cursor: pointer;place-content: center;font-size: 16px;">Local</summary>
        <select id="eventLocationsSelect">
          <option value="empty">Clear</option>
          <option value="greatWinterHunt">GWH</option>
          <option value="floating_islands">Floating Islands</option>
          <option value="rift_valour">Valour Rift</option>
        </select>
        <button type="button" style="background-color: #fc0000ff;" id="saveReloadEventLocationButton">Save(Left Click)/Reload(Right Click) settings</button>
        <button type="button" style="background-color: #00fc00ff;" id="reRunEventLocationButton">re-run eventLocation</button>
        <div id="eventLocationsSettingsDiv" style="background-color: #beedc7ff;"></div>
    `;
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
      mypanel += `<input title="Reserved Cheese Quantity" type="text" id="minBaitQuantity" value="${JSON.stringify(settings.minBaitQuantity)}" style="width: 8em;">`;
      mypanel += `<input title="map剩餘 goal高於此,不使用 index低於 mapEndingPriorityBegin的 bait.因為 map一定是 3-6-6組合" type="number" id="mapEndingQuantity" value="${settings.mapEndingQuantity}" style="width: 2em;">`;
      mypanel += `<input title="map剩餘 goal高於 mapEndingQuantity,不使用 index低於此的 bait.因為 map一定是 3-6-6組合" type="number" id="mapEndingPriorityBegin" value="${settings.mapEndingPriorityBegin}" style="width: 2em;">`;
    }
    // Fort Rox
    const isFrox = environmentType == 'fort_rox';
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
    if (isFactory) {
      const a = localStorage.getItem('currentTrapKey');
      storageKey = 'superbrieFactory';
      const setupSbFactory = JSON.parse(localStorage[storageKey]);
      const isAutoFrc = setupSbFactory.isAutoFrc;
      mypanel += `
        <select id="superbrieFactoryTraps">
          <option value disabled>Unknown</option>
          <option value="gouda_cheese"${a == 'gouda_cheese' ? ' selected' : ''}>Gouda</option>
          <option value="super_brie_cheese"${a == 'super_brie_cheese' ? ' selected' : ''}>SB</option>
          <option value="coggy_colby_cheese"${a == 'coggy_colby_cheese' ? ' selected' : ''}>CC</option>
          <option value="speed_coggy_colby_cheese"${a == 'speed_coggy_colby_cheese' ? ' selected' : ''}>SCC</option>
          <option value="boss"${a == 'boss' ? ' selected' : ''}>Boss</option>
        </select>
        <button title="toggle isAutoFrc" type="button" id="isAutoFrc">${isAutoFrc ? 'FRC' : 'No'}</button>
      `;
    }
    mypanel += `</details></div>`;
    // eslint-disable-next-line no-undef
    $(mypanel).appendTo('body');
    // prettier-ignore
    const setValuesGeneralDetails = () => {
      const mypanel = document.querySelector('#mypanel');
      let tmp = localStorage.maptainType;
      let txt = tmp === 'always' ? 'Mptn' : tmp === 'once' ? 'Once' : tmp === 'never' ? 'Never' : 'No';
      mypanel.querySelector('#maptainTypeButton').textContent = txt;
      tmp = localStorage.dusterCycle;
      txt = tmp === 'always' ? 'Dstr' : tmp === 'once' ? 'Once' : tmp === 'never' ? 'Never' : 'No';
      mypanel.querySelector('#dusterCycleButton').textContent = txt;
      // eslint-disable-next-line no-undef
      mypanel.querySelector('#travelToLocation').value = user.environment_type.trim();
    };
    setValuesGeneralDetails();
    document
      .querySelector('#mypanel')
      .querySelector('.generalSummary')
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
        reloadAfterTravel.value === 'true' ? 'false' : 'true';
      changeReloadButton.textContent =
        reloadAfterTravel.value === 'true' ? 'Reload' : 'Sneak';
    });
    // 變更 locations下拉選單時 quick travel
    const travelToLocation = document.getElementById('travelToLocation');
    travelToLocation.addEventListener('change', function () {
      // 下拉選單變更時每次都要重讀 current location.
      // 因為會連續不 refresh地變換多個位置
      // eslint-disable-next-line no-undef
      environmentType = (user.environment_type || '').trim();
      const travelToLocationValue = travelToLocation.value;
      logging('travel from ', environmentType, ' to ', travelToLocationValue);
      if (environmentType !== travelToLocationValue) {
        // eslint-disable-next-line no-undef
        hg.utils.User.travel(travelToLocationValue, () => {
          if (document.querySelector('#reloadAfterTravel').value === 'true') {
            window.setTimeout(function () {
              window.location.href = 'https://www.mousehuntgame.com/';
            }, 2000);
          }
        });
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
    // eslint-disable-next-line no-undef
    $('#saveReloadEventLocationButton').off('click');
    // eslint-disable-next-line no-undef
    $('#saveReloadEventLocationButton').on('click', function (e) {
      const eventLocation = document.querySelector(
        '#eventLocationsSelect'
      ).value;
      const functionName = eventLocation + 'Save';
      functions[functionName]();
      e.preventDefault();
    });
    // eslint-disable-next-line no-undef
    $('#saveReloadEventLocationButton').off('contextmenu');
    // eslint-disable-next-line no-undef
    $('#saveReloadEventLocationButton').on('contextmenu', function (e) {
      const eventLocation = document.querySelector(
        '#eventLocationsSelect'
      ).value;
      let functionName = eventLocation;
      functions[functionName]();
      functionName = eventLocation + 'Load';
      functions[functionName]();
      e.preventDefault();
    });
    // GWH settings
    if (isGwh) {
      const functionName = 'greatWinterHunt';
      document.querySelector('#eventLocationsSelect').value = functionName;
      functions[functionName]();
      functions[functionName + 'Load']();
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
    switch (environmentType) {
      case 'floating_islands':
        document.querySelector('#eventLocationsSelect').value = environmentType;
        functions[environmentType]();
        functions[environmentType + 'Load']();
        break;
      case 'rift_valour':
        document.querySelector('#eventLocationsSelect').value = environmentType;
        functions[environmentType]();
        functions[environmentType + 'Load']();
        break;
      default:
        document.querySelector('#eventLocationsSelect').value = 'empty';
        functions['empty']();
        functions['emptyLoad']();
        break;
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
