// ==UserScript==
// @name         MWI Chat Translator C→E
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Stargazing
// @description  This userscript auto-translates Chinese chat messages to English in MilkyWay Idle.
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @license      MIT
// @grant        GM_registerMenuCommand
// @connect      translate.googleapis.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533994/MWI%20Chat%20Translator%20C%E2%86%92E.user.js
// @updateURL https://update.greasyfork.org/scripts/533994/MWI%20Chat%20Translator%20C%E2%86%92E.meta.js
// ==/UserScript==

/*
     This script supports both browser and Steam versions using Google Translate.
     Translations appear as inline messages or tooltips (toggle with F7).
     It detects and replaces some known in-game item names and caches translations for reuse.
*/

/*
    Steam users should also install this script:
    https://raw.githubusercontent.com/YangLeda/Userscripts-For-MilkyWayIdle/refs/heads/main/MWITools%20addon%20for%20Steam%20version.js

    Hotkeys:
      F6 : Clear cache
      F7 : Switch mode between "Inline" and "Tooltip"

    Modes:
      Inline:  Automatically scans chat messages and inserts translated messages.
      Tooltip: Hover over a message containing chinese characters to display the translated message.
*/

(function bootstrap() {
  if (typeof window.MWITools_marketAPI_json !== 'undefined') {
    (function waitForCompat() {
      if (typeof window.MWITools_marketAPI_json === 'undefined')
        return setTimeout(waitForCompat, 200);
      initTranslator();
    })();
  } else {
    initTranslator();
  }
})();

function initTranslator() {
  'use strict';

    const MSG_SEL = '[class^="ChatMessage_chatMessage"]';
    const CHINESE_RE = /[\u4E00-\u9FFF]/;
    const cache = new Map();
    let verboseLogging = false;
    let translationMode = 'inline'; // "inline" or "tooltip"

    // Known translations from: https://www.milkywayidle.com/static/js/main.df415310.chunk.js

    // Known skill names
    const skillNames = {
        "/skills/total_level": "\u603b\u7b49\u7ea7",
        "/skills/milking": "\u6324\u5976",
        "/skills/foraging": "\u91c7\u6458",
        "/skills/woodcutting": "\u4f10\u6728",
        "/skills/cheesesmithing": "\u5976\u916a\u953b\u9020",
        "/skills/crafting": "\u5236\u4f5c",
        "/skills/tailoring": "\u7f1d\u7eab",
        "/skills/cooking": "\u70f9\u996a",
        "/skills/brewing": "\u51b2\u6ce1",
        "/skills/alchemy": "\u70bc\u91d1",
        "/skills/enhancing": "\u5f3a\u5316",
        "/skills/stamina": "\u8010\u529b",
        "/skills/intelligence": "\u667a\u529b",
        "/skills/attack": "\u653b\u51fb",
        "/skills/power": "\u529b\u91cf",
        "/skills/defense": "\u9632\u5fa1",
        "/skills/ranged": "\u8fdc\u7a0b",
        "/skills/magic": "\u9b54\u6cd5"
    };

    // Known ability names
    const abilityNames = {
        "/abilities/poke": "\u7834\u80c6\u4e4b\u523a",
        "/abilities/impale": "\u900f\u9aa8\u4e4b\u523a",
        "/abilities/puncture": "\u7834\u7532\u4e4b\u523a",
        "/abilities/penetrating_strike": "\u8d2f\u5fc3\u4e4b\u523a",
        "/abilities/scratch": "\u722a\u5f71\u65a9",
        "/abilities/cleave": "\u5206\u88c2\u65a9",
        "/abilities/maim": "\u8840\u5203\u65a9",
        "/abilities/crippling_slash": "\u81f4\u6b8b\u65a9",
        "/abilities/smack": "\u91cd\u78be",
        "/abilities/sweep": "\u91cd\u626b",
        "/abilities/stunning_blow": "\u91cd\u9524",
        "/abilities/fracturing_impact": "\u788e\u88c2\u51b2\u51fb",
        "/abilities/shield_bash": "\u76fe\u51fb",
        "/abilities/quick_shot": "\u5feb\u901f\u5c04\u51fb",
        "/abilities/aqua_arrow": "\u6d41\u6c34\u7bad",
        "/abilities/flame_arrow": "\u70c8\u7130\u7bad",
        "/abilities/rain_of_arrows": "\u7bad\u96e8",
        "/abilities/silencing_shot": "\u6c89\u9ed8\u4e4b\u7bad",
        "/abilities/steady_shot": "\u7a33\u5b9a\u5c04\u51fb",
        "/abilities/pestilent_shot": "\u75ab\u75c5\u5c04\u51fb",
        "/abilities/penetrating_shot": "\u8d2f\u7a7f\u5c04\u51fb",
        "/abilities/water_strike": "\u6d41\u6c34\u51b2\u51fb",
        "/abilities/ice_spear": "\u51b0\u67aa\u672f",
        "/abilities/frost_surge": "\u51b0\u971c\u7206\u88c2",
        "/abilities/mana_spring": "\u6cd5\u529b\u55b7\u6cc9",
        "/abilities/entangle": "\u7f20\u7ed5",
        "/abilities/toxic_pollen": "\u5267\u6bd2\u7c89\u5c18",
        "/abilities/natures_veil": "\u81ea\u7136\u83cc\u5e55",
        "/abilities/life_drain": "\u751f\u547d\u5438\u53d6",
        "/abilities/fireball": "\u706b\u7403",
        "/abilities/flame_blast": "\u7194\u5ca9\u7206\u88c2",
        "/abilities/firestorm": "\u706b\u7130\u98ce\u66b4",
        "/abilities/smoke_burst": "\u70df\u7206\u706d\u5f71",
        "/abilities/minor_heal": "\u521d\u7ea7\u81ea\u6108\u672f",
        "/abilities/heal": "\u81ea\u6108\u672f",
        "/abilities/quick_aid": "\u5feb\u901f\u6cbb\u7597\u672f",
        "/abilities/rejuvenate": "\u7fa4\u4f53\u6cbb\u7597\u672f",
        "/abilities/taunt": "\u5632\u8bbd",
        "/abilities/provoke": "\u6311\u8845",
        "/abilities/toughness": "\u575a\u97e7",
        "/abilities/elusiveness": "\u95ea\u907f",
        "/abilities/precision": "\u7cbe\u786e",
        "/abilities/berserk": "\u72c2\u66b4",
        "/abilities/frenzy": "\u72c2\u901f",
        "/abilities/elemental_affinity": "\u5143\u7d20\u589e\u5e45",
        "/abilities/spike_shell": "\u5c16\u523a\u9632\u62a4",
        "/abilities/arcane_reflection": "\u5965\u672f\u53cd\u5c04",
        "/abilities/vampirism": "\u5438\u8840",
        "/abilities/revive": "\u590d\u6d3b",
        "/abilities/insanity": "\u75af\u72c2",
        "/abilities/invincible": "\u65e0\u654c",
        "/abilities/fierce_aura": "\u7269\u7406\u5149\u73af",
        "/abilities/aqua_aura": "\u6d41\u6c34\u5149\u73af",
        "/abilities/sylvan_aura": "\u81ea\u7136\u5149\u73af",
        "/abilities/flame_aura": "\u706b\u7130\u5149\u73af",
        "/abilities/speed_aura": "\u901f\u5ea6\u5149\u73af",
        "/abilities/critical_aura": "\u66b4\u51fb\u5149\u73af",
        "/abilities/promote": "\u664b\u5347"
    };

    // Known item translations
    const itemNames = {
        "/items/coin": "\u91d1\u5e01",
        "/items/task_token": "\u4efb\u52a1\u4ee3\u5e01",
        "/items/chimerical_token": "\u5947\u5e7b\u4ee3\u5e01",
        "/items/sinister_token": "\u9634\u68ee\u4ee3\u5e01",
        "/items/enchanted_token": "\u79d8\u6cd5\u4ee3\u5e01",
        "/items/pirate_token": "\u6d77\u76d7\u4ee3\u5e01",
        "/items/cowbell": "\u725b\u94c3",
        "/items/bag_of_10_cowbells": "\u725b\u94c3\u888b (10\u4e2a)",
        "/items/purples_gift": "\u5c0f\u7d2b\u725b\u7684\u793c\u7269",
        "/items/small_meteorite_cache": "\u5c0f\u9668\u77f3\u8231",
        "/items/medium_meteorite_cache": "\u4e2d\u9668\u77f3\u8231",
        "/items/large_meteorite_cache": "\u5927\u9668\u77f3\u8231",
        "/items/small_artisans_crate": "\u5c0f\u5de5\u5320\u5323",
        "/items/medium_artisans_crate": "\u4e2d\u5de5\u5320\u5323",
        "/items/large_artisans_crate": "\u5927\u5de5\u5320\u5323",
        "/items/small_treasure_chest": "\u5c0f\u5b9d\u7bb1",
        "/items/medium_treasure_chest": "\u4e2d\u5b9d\u7bb1",
        "/items/large_treasure_chest": "\u5927\u5b9d\u7bb1",
        "/items/chimerical_chest": "\u5947\u5e7b\u5b9d\u7bb1",
        "/items/sinister_chest": "\u9634\u68ee\u5b9d\u7bb1",
        "/items/enchanted_chest": "\u79d8\u6cd5\u5b9d\u7bb1",
        "/items/pirate_chest": "\u6d77\u76d7\u5b9d\u7bb1",
        "/items/blue_key_fragment": "\u84dd\u8272\u94a5\u5319\u788e\u7247",
        "/items/green_key_fragment": "\u7eff\u8272\u94a5\u5319\u788e\u7247",
        "/items/purple_key_fragment": "\u7d2b\u8272\u94a5\u5319\u788e\u7247",
        "/items/white_key_fragment": "\u767d\u8272\u94a5\u5319\u788e\u7247",
        "/items/orange_key_fragment": "\u6a59\u8272\u94a5\u5319\u788e\u7247",
        "/items/brown_key_fragment": "\u68d5\u8272\u94a5\u5319\u788e\u7247",
        "/items/stone_key_fragment": "\u77f3\u5934\u94a5\u5319\u788e\u7247",
        "/items/dark_key_fragment": "\u9ed1\u6697\u94a5\u5319\u788e\u7247",
        "/items/burning_key_fragment": "\u71c3\u70e7\u94a5\u5319\u788e\u7247",
        "/items/chimerical_entry_key": "\u5947\u5e7b\u94a5\u5319",
        "/items/chimerical_chest_key": "\u5947\u5e7b\u5b9d\u7bb1\u94a5\u5319",
        "/items/sinister_entry_key": "\u9634\u68ee\u94a5\u5319",
        "/items/sinister_chest_key": "\u9634\u68ee\u5b9d\u7bb1\u94a5\u5319",
        "/items/enchanted_entry_key": "\u79d8\u6cd5\u94a5\u5319",
        "/items/enchanted_chest_key": "\u79d8\u6cd5\u5b9d\u7bb1\u94a5\u5319",
        "/items/pirate_entry_key": "\u6d77\u76d7\u94a5\u5319",
        "/items/pirate_chest_key": "\u6d77\u76d7\u5b9d\u7bb1\u94a5\u5319",
        "/items/donut": "\u751c\u751c\u5708",
        "/items/blueberry_donut": "\u84dd\u8393\u751c\u751c\u5708",
        "/items/blackberry_donut": "\u9ed1\u8393\u751c\u751c\u5708",
        "/items/strawberry_donut": "\u8349\u8393\u751c\u751c\u5708",
        "/items/mooberry_donut": "\u54de\u8393\u751c\u751c\u5708",
        "/items/marsberry_donut": "\u706b\u661f\u8393\u751c\u751c\u5708",
        "/items/spaceberry_donut": "\u592a\u7a7a\u8393\u751c\u751c\u5708",
        "/items/cupcake": "\u7eb8\u676f\u86cb\u7cd5",
        "/items/blueberry_cake": "\u84dd\u8393\u86cb\u7cd5",
        "/items/blackberry_cake": "\u9ed1\u8393\u86cb\u7cd5",
        "/items/strawberry_cake": "\u8349\u8393\u86cb\u7cd5",
        "/items/mooberry_cake": "\u54de\u8393\u86cb\u7cd5",
        "/items/marsberry_cake": "\u706b\u661f\u8393\u86cb\u7cd5",
        "/items/spaceberry_cake": "\u592a\u7a7a\u8393\u86cb\u7cd5",
        "/items/gummy": "\u8f6f\u7cd6",
        "/items/apple_gummy": "\u82f9\u679c\u8f6f\u7cd6",
        "/items/orange_gummy": "\u6a59\u5b50\u8f6f\u7cd6",
        "/items/plum_gummy": "\u674e\u5b50\u8f6f\u7cd6",
        "/items/peach_gummy": "\u6843\u5b50\u8f6f\u7cd6",
        "/items/dragon_fruit_gummy": "\u706b\u9f99\u679c\u8f6f\u7cd6",
        "/items/star_fruit_gummy": "\u6768\u6843\u8f6f\u7cd6",
        "/items/yogurt": "\u9178\u5976",
        "/items/apple_yogurt": "\u82f9\u679c\u9178\u5976",
        "/items/orange_yogurt": "\u6a59\u5b50\u9178\u5976",
        "/items/plum_yogurt": "\u674e\u5b50\u9178\u5976",
        "/items/peach_yogurt": "\u6843\u5b50\u9178\u5976",
        "/items/dragon_fruit_yogurt": "\u706b\u9f99\u679c\u9178\u5976",
        "/items/star_fruit_yogurt": "\u6768\u6843\u9178\u5976",
        "/items/milking_tea": "\u6324\u5976\u8336",
        "/items/foraging_tea": "\u91c7\u6458\u8336",
        "/items/woodcutting_tea": "\u4f10\u6728\u8336",
        "/items/cooking_tea": "\u70f9\u996a\u8336",
        "/items/brewing_tea": "\u51b2\u6ce1\u8336",
        "/items/alchemy_tea": "\u70bc\u91d1\u8336",
        "/items/enhancing_tea": "\u5f3a\u5316\u8336",
        "/items/cheesesmithing_tea": "\u5976\u916a\u953b\u9020\u8336",
        "/items/crafting_tea": "\u5236\u4f5c\u8336",
        "/items/tailoring_tea": "\u7f1d\u7eab\u8336",
        "/items/super_milking_tea": "\u8d85\u7ea7\u6324\u5976\u8336",
        "/items/super_foraging_tea": "\u8d85\u7ea7\u91c7\u6458\u8336",
        "/items/super_woodcutting_tea": "\u8d85\u7ea7\u4f10\u6728\u8336",
        "/items/super_cooking_tea": "\u8d85\u7ea7\u70f9\u996a\u8336",
        "/items/super_brewing_tea": "\u8d85\u7ea7\u51b2\u6ce1\u8336",
        "/items/super_alchemy_tea": "\u8d85\u7ea7\u70bc\u91d1\u8336",
        "/items/super_enhancing_tea": "\u8d85\u7ea7\u5f3a\u5316\u8336",
        "/items/super_cheesesmithing_tea": "\u8d85\u7ea7\u5976\u916a\u953b\u9020\u8336",
        "/items/super_crafting_tea": "\u8d85\u7ea7\u5236\u4f5c\u8336",
        "/items/super_tailoring_tea": "\u8d85\u7ea7\u7f1d\u7eab\u8336",
        "/items/ultra_milking_tea": "\u7a76\u6781\u6324\u5976\u8336",
        "/items/ultra_foraging_tea": "\u7a76\u6781\u91c7\u6458\u8336",
        "/items/ultra_woodcutting_tea": "\u7a76\u6781\u4f10\u6728\u8336",
        "/items/ultra_cooking_tea": "\u7a76\u6781\u70f9\u996a\u8336",
        "/items/ultra_brewing_tea": "\u7a76\u6781\u51b2\u6ce1\u8336",
        "/items/ultra_alchemy_tea": "\u7a76\u6781\u70bc\u91d1\u8336",
        "/items/ultra_enhancing_tea": "\u7a76\u6781\u5f3a\u5316\u8336",
        "/items/ultra_cheesesmithing_tea": "\u7a76\u6781\u5976\u916a\u953b\u9020\u8336",
        "/items/ultra_crafting_tea": "\u7a76\u6781\u5236\u4f5c\u8336",
        "/items/ultra_tailoring_tea": "\u7a76\u6781\u7f1d\u7eab\u8336",
        "/items/gathering_tea": "\u91c7\u96c6\u8336",
        "/items/gourmet_tea": "\u7f8e\u98df\u8336",
        "/items/wisdom_tea": "\u7ecf\u9a8c\u8336",
        "/items/processing_tea": "\u52a0\u5de5\u8336",
        "/items/efficiency_tea": "\u6548\u7387\u8336",
        "/items/artisan_tea": "\u5de5\u5320\u8336",
        "/items/catalytic_tea": "\u50ac\u5316\u8336",
        "/items/blessed_tea": "\u798f\u6c14\u8336",
        "/items/stamina_coffee": "\u8010\u529b\u5496\u5561",
        "/items/intelligence_coffee": "\u667a\u529b\u5496\u5561",
        "/items/defense_coffee": "\u9632\u5fa1\u5496\u5561",
        "/items/attack_coffee": "\u653b\u51fb\u5496\u5561",
        "/items/power_coffee": "\u529b\u91cf\u5496\u5561",
        "/items/ranged_coffee": "\u8fdc\u7a0b\u5496\u5561",
        "/items/magic_coffee": "\u9b54\u6cd5\u5496\u5561",
        "/items/super_stamina_coffee": "\u8d85\u7ea7\u8010\u529b\u5496\u5561",
        "/items/super_intelligence_coffee": "\u8d85\u7ea7\u667a\u529b\u5496\u5561",
        "/items/super_defense_coffee": "\u8d85\u7ea7\u9632\u5fa1\u5496\u5561",
        "/items/super_attack_coffee": "\u8d85\u7ea7\u653b\u51fb\u5496\u5561",
        "/items/super_power_coffee": "\u8d85\u7ea7\u529b\u91cf\u5496\u5561",
        "/items/super_ranged_coffee": "\u8d85\u7ea7\u8fdc\u7a0b\u5496\u5561",
        "/items/super_magic_coffee": "\u8d85\u7ea7\u9b54\u6cd5\u5496\u5561",
        "/items/ultra_stamina_coffee": "\u7a76\u6781\u8010\u529b\u5496\u5561",
        "/items/ultra_intelligence_coffee": "\u7a76\u6781\u667a\u529b\u5496\u5561",
        "/items/ultra_defense_coffee": "\u7a76\u6781\u9632\u5fa1\u5496\u5561",
        "/items/ultra_attack_coffee": "\u7a76\u6781\u653b\u51fb\u5496\u5561",
        "/items/ultra_power_coffee": "\u7a76\u6781\u529b\u91cf\u5496\u5561",
        "/items/ultra_ranged_coffee": "\u7a76\u6781\u8fdc\u7a0b\u5496\u5561",
        "/items/ultra_magic_coffee": "\u7a76\u6781\u9b54\u6cd5\u5496\u5561",
        "/items/wisdom_coffee": "\u7ecf\u9a8c\u5496\u5561",
        "/items/lucky_coffee": "\u5e78\u8fd0\u5496\u5561",
        "/items/swiftness_coffee": "\u8fc5\u6377\u5496\u5561",
        "/items/channeling_coffee": "\u541f\u5531\u5496\u5561",
        "/items/critical_coffee": "\u66b4\u51fb\u5496\u5561",
        "/items/poke": "\u7834\u80c6\u4e4b\u523a",
        "/items/impale": "\u900f\u9aa8\u4e4b\u523a",
        "/items/puncture": "\u7834\u7532\u4e4b\u523a",
        "/items/penetrating_strike": "\u8d2f\u5fc3\u4e4b\u523a",
        "/items/scratch": "\u722a\u5f71\u65a9",
        "/items/cleave": "\u5206\u88c2\u65a9",
        "/items/maim": "\u8840\u5203\u65a9",
        "/items/crippling_slash": "\u81f4\u6b8b\u65a9",
        "/items/smack": "\u91cd\u78be",
        "/items/sweep": "\u91cd\u626b",
        "/items/stunning_blow": "\u91cd\u9524",
        "/items/fracturing_impact": "\u788e\u88c2\u51b2\u51fb",
        "/items/shield_bash": "\u76fe\u51fb",
        "/items/quick_shot": "\u5feb\u901f\u5c04\u51fb",
        "/items/aqua_arrow": "\u6d41\u6c34\u7bad",
        "/items/flame_arrow": "\u70c8\u7130\u7bad",
        "/items/rain_of_arrows": "\u7bad\u96e8",
        "/items/silencing_shot": "\u6c89\u9ed8\u4e4b\u7bad",
        "/items/steady_shot": "\u7a33\u5b9a\u5c04\u51fb",
        "/items/pestilent_shot": "\u75ab\u75c5\u5c04\u51fb",
        "/items/penetrating_shot": "\u8d2f\u7a7f\u5c04\u51fb",
        "/items/water_strike": "\u6d41\u6c34\u51b2\u51fb",
        "/items/ice_spear": "\u51b0\u67aa\u672f",
        "/items/frost_surge": "\u51b0\u971c\u7206\u88c2",
        "/items/mana_spring": "\u6cd5\u529b\u55b7\u6cc9",
        "/items/entangle": "\u7f20\u7ed5",
        "/items/toxic_pollen": "\u5267\u6bd2\u7c89\u5c18",
        "/items/natures_veil": "\u81ea\u7136\u83cc\u5e55",
        "/items/life_drain": "\u751f\u547d\u5438\u53d6",
        "/items/fireball": "\u706b\u7403",
        "/items/flame_blast": "\u7194\u5ca9\u7206\u88c2",
        "/items/firestorm": "\u706b\u7130\u98ce\u66b4",
        "/items/smoke_burst": "\u70df\u7206\u706d\u5f71",
        "/items/minor_heal": "\u521d\u7ea7\u81ea\u6108\u672f",
        "/items/heal": "\u81ea\u6108\u672f",
        "/items/quick_aid": "\u5feb\u901f\u6cbb\u7597\u672f",
        "/items/rejuvenate": "\u7fa4\u4f53\u6cbb\u7597\u672f",
        "/items/taunt": "\u5632\u8bbd",
        "/items/provoke": "\u6311\u8845",
        "/items/toughness": "\u575a\u97e7",
        "/items/elusiveness": "\u95ea\u907f",
        "/items/precision": "\u7cbe\u786e",
        "/items/berserk": "\u72c2\u66b4",
        "/items/elemental_affinity": "\u5143\u7d20\u589e\u5e45",
        "/items/frenzy": "\u72c2\u901f",
        "/items/spike_shell": "\u5c16\u523a\u9632\u62a4",
        "/items/arcane_reflection": "\u5965\u672f\u53cd\u5c04",
        "/items/vampirism": "\u5438\u8840",
        "/items/revive": "\u590d\u6d3b",
        "/items/insanity": "\u75af\u72c2",
        "/items/invincible": "\u65e0\u654c",
        "/items/fierce_aura": "\u7269\u7406\u5149\u73af",
        "/items/aqua_aura": "\u6d41\u6c34\u5149\u73af",
        "/items/sylvan_aura": "\u81ea\u7136\u5149\u73af",
        "/items/flame_aura": "\u706b\u7130\u5149\u73af",
        "/items/speed_aura": "\u901f\u5ea6\u5149\u73af",
        "/items/critical_aura": "\u66b4\u51fb\u5149\u73af",
        "/items/gobo_stabber": "\u54e5\u5e03\u6797\u957f\u5251",
        "/items/gobo_slasher": "\u54e5\u5e03\u6797\u5173\u5200",
        "/items/gobo_smasher": "\u54e5\u5e03\u6797\u72fc\u7259\u68d2",
        "/items/spiked_bulwark": "\u5c16\u523a\u91cd\u76fe",
        "/items/werewolf_slasher": "\u72fc\u4eba\u5173\u5200",
        "/items/griffin_bulwark": "\u72ee\u9e6b\u91cd\u76fe",
        "/items/gobo_shooter": "\u54e5\u5e03\u6797\u5f39\u5f13",
        "/items/vampiric_bow": "\u5438\u8840\u5f13",
        "/items/cursed_bow": "\u5492\u6028\u4e4b\u5f13",
        "/items/gobo_boomstick": "\u54e5\u5e03\u6797\u706b\u68cd",
        "/items/cheese_bulwark": "\u5976\u916a\u91cd\u76fe",
        "/items/verdant_bulwark": "\u7fe0\u7eff\u91cd\u76fe",
        "/items/azure_bulwark": "\u851a\u84dd\u91cd\u76fe",
        "/items/burble_bulwark": "\u6df1\u7d2b\u91cd\u76fe",
        "/items/crimson_bulwark": "\u7edb\u7ea2\u91cd\u76fe",
        "/items/rainbow_bulwark": "\u5f69\u8679\u91cd\u76fe",
        "/items/holy_bulwark": "\u795e\u5723\u91cd\u76fe",
        "/items/wooden_bow": "\u6728\u5f13",
        "/items/birch_bow": "\u6866\u6728\u5f13",
        "/items/cedar_bow": "\u96ea\u677e\u5f13",
        "/items/purpleheart_bow": "\u7d2b\u5fc3\u5f13",
        "/items/ginkgo_bow": "\u94f6\u674f\u5f13",
        "/items/redwood_bow": "\u7ea2\u6749\u5f13",
        "/items/arcane_bow": "\u795e\u79d8\u5f13",
        "/items/stalactite_spear": "\u77f3\u949f\u957f\u67aa",
        "/items/granite_bludgeon": "\u82b1\u5c97\u5ca9\u5927\u68d2",
        "/items/furious_spear": "\u72c2\u6012\u957f\u67aa",
        "/items/regal_sword": "\u541b\u738b\u4e4b\u5251",
        "/items/chaotic_flail": "\u6df7\u6c8c\u8fde\u67b7",
        "/items/soul_hunter_crossbow": "\u7075\u9b42\u730e\u624b\u5f29",
        "/items/sundering_crossbow": "\u88c2\u7a7a\u4e4b\u5f29",
        "/items/frost_staff": "\u51b0\u971c\u6cd5\u6756",
        "/items/infernal_battlestaff": "\u70bc\u72f1\u6cd5\u6756",
        "/items/jackalope_staff": "\u9e7f\u89d2\u5154\u4e4b\u6756",
        "/items/rippling_trident": "\u6d9f\u6f2a\u4e09\u53c9\u621f",
        "/items/blooming_trident": "\u7efd\u653e\u4e09\u53c9\u621f",
        "/items/blazing_trident": "\u70bd\u7130\u4e09\u53c9\u621f",
        "/items/cheese_sword": "\u5976\u916a\u5251",
        "/items/verdant_sword": "\u7fe0\u7eff\u5251",
        "/items/azure_sword": "\u851a\u84dd\u5251",
        "/items/burble_sword": "\u6df1\u7d2b\u5251",
        "/items/crimson_sword": "\u7edb\u7ea2\u5251",
        "/items/rainbow_sword": "\u5f69\u8679\u5251",
        "/items/holy_sword": "\u795e\u5723\u5251",
        "/items/cheese_spear": "\u5976\u916a\u957f\u67aa",
        "/items/verdant_spear": "\u7fe0\u7eff\u957f\u67aa",
        "/items/azure_spear": "\u851a\u84dd\u957f\u67aa",
        "/items/burble_spear": "\u6df1\u7d2b\u957f\u67aa",
        "/items/crimson_spear": "\u7edb\u7ea2\u957f\u67aa",
        "/items/rainbow_spear": "\u5f69\u8679\u957f\u67aa",
        "/items/holy_spear": "\u795e\u5723\u957f\u67aa",
        "/items/cheese_mace": "\u5976\u916a\u9489\u5934\u9524",
        "/items/verdant_mace": "\u7fe0\u7eff\u9489\u5934\u9524",
        "/items/azure_mace": "\u851a\u84dd\u9489\u5934\u9524",
        "/items/burble_mace": "\u6df1\u7d2b\u9489\u5934\u9524",
        "/items/crimson_mace": "\u7edb\u7ea2\u9489\u5934\u9524",
        "/items/rainbow_mace": "\u5f69\u8679\u9489\u5934\u9524",
        "/items/holy_mace": "\u795e\u5723\u9489\u5934\u9524",
        "/items/wooden_crossbow": "\u6728\u5f29",
        "/items/birch_crossbow": "\u6866\u6728\u5f29",
        "/items/cedar_crossbow": "\u96ea\u677e\u5f29",
        "/items/purpleheart_crossbow": "\u7d2b\u5fc3\u5f29",
        "/items/ginkgo_crossbow": "\u94f6\u674f\u5f29",
        "/items/redwood_crossbow": "\u7ea2\u6749\u5f29",
        "/items/arcane_crossbow": "\u795e\u79d8\u5f29",
        "/items/wooden_water_staff": "\u6728\u5236\u6c34\u6cd5\u6756",
        "/items/birch_water_staff": "\u6866\u6728\u6c34\u6cd5\u6756",
        "/items/cedar_water_staff": "\u96ea\u677e\u6c34\u6cd5\u6756",
        "/items/purpleheart_water_staff": "\u7d2b\u5fc3\u6c34\u6cd5\u6756",
        "/items/ginkgo_water_staff": "\u94f6\u674f\u6c34\u6cd5\u6756",
        "/items/redwood_water_staff": "\u7ea2\u6749\u6c34\u6cd5\u6756",
        "/items/arcane_water_staff": "\u795e\u79d8\u6c34\u6cd5\u6756",
        "/items/wooden_nature_staff": "\u6728\u5236\u81ea\u7136\u6cd5\u6756",
        "/items/birch_nature_staff": "\u6866\u6728\u81ea\u7136\u6cd5\u6756",
        "/items/cedar_nature_staff": "\u96ea\u677e\u81ea\u7136\u6cd5\u6756",
        "/items/purpleheart_nature_staff": "\u7d2b\u5fc3\u81ea\u7136\u6cd5\u6756",
        "/items/ginkgo_nature_staff": "\u94f6\u674f\u81ea\u7136\u6cd5\u6756",
        "/items/redwood_nature_staff": "\u7ea2\u6749\u81ea\u7136\u6cd5\u6756",
        "/items/arcane_nature_staff": "\u795e\u79d8\u81ea\u7136\u6cd5\u6756",
        "/items/wooden_fire_staff": "\u6728\u5236\u706b\u6cd5\u6756",
        "/items/birch_fire_staff": "\u6866\u6728\u706b\u6cd5\u6756",
        "/items/cedar_fire_staff": "\u96ea\u677e\u706b\u6cd5\u6756",
        "/items/purpleheart_fire_staff": "\u7d2b\u5fc3\u706b\u6cd5\u6756",
        "/items/ginkgo_fire_staff": "\u94f6\u674f\u706b\u6cd5\u6756",
        "/items/redwood_fire_staff": "\u7ea2\u6749\u706b\u6cd5\u6756",
        "/items/arcane_fire_staff": "\u795e\u79d8\u706b\u6cd5\u6756",
        "/items/eye_watch": "\u638c\u4e0a\u76d1\u5de5",
        "/items/snake_fang_dirk": "\u86c7\u7259\u77ed\u5251",
        "/items/vision_shield": "\u89c6\u89c9\u76fe",
        "/items/gobo_defender": "\u54e5\u5e03\u6797\u9632\u5fa1\u8005",
        "/items/vampire_fang_dirk": "\u5438\u8840\u9b3c\u77ed\u5251",
        "/items/knights_aegis": "\u9a91\u58eb\u76fe",
        "/items/treant_shield": "\u6811\u4eba\u76fe",
        "/items/manticore_shield": "\u874e\u72ee\u76fe",
        "/items/tome_of_healing": "\u6cbb\u7597\u4e4b\u4e66",
        "/items/tome_of_the_elements": "\u5143\u7d20\u4e4b\u4e66",
        "/items/watchful_relic": "\u8b66\u6212\u9057\u7269",
        "/items/bishops_codex": "\u4e3b\u6559\u6cd5\u5178",
        "/items/cheese_buckler": "\u5976\u916a\u5706\u76fe",
        "/items/verdant_buckler": "\u7fe0\u7eff\u5706\u76fe",
        "/items/azure_buckler": "\u851a\u84dd\u5706\u76fe",
        "/items/burble_buckler": "\u6df1\u7d2b\u5706\u76fe",
        "/items/crimson_buckler": "\u7edb\u7ea2\u5706\u76fe",
        "/items/rainbow_buckler": "\u5f69\u8679\u5706\u76fe",
        "/items/holy_buckler": "\u795e\u5723\u5706\u76fe",
        "/items/wooden_shield": "\u6728\u76fe",
        "/items/birch_shield": "\u6866\u6728\u76fe",
        "/items/cedar_shield": "\u96ea\u677e\u76fe",
        "/items/purpleheart_shield": "\u7d2b\u5fc3\u76fe",
        "/items/ginkgo_shield": "\u94f6\u674f\u76fe",
        "/items/redwood_shield": "\u7ea2\u6749\u76fe",
        "/items/arcane_shield": "\u795e\u79d8\u76fe",
        "/items/sinister_cape": "\u9634\u68ee\u6597\u7bf7",
        "/items/chimerical_quiver": "\u5947\u5e7b\u7bad\u888b",
        "/items/enchanted_cloak": "\u79d8\u6cd5\u62ab\u98ce",
        "/items/red_culinary_hat": "\u7ea2\u8272\u53a8\u5e08\u5e3d",
        "/items/snail_shell_helmet": "\u8717\u725b\u58f3\u5934\u76d4",
        "/items/vision_helmet": "\u89c6\u89c9\u5934\u76d4",
        "/items/fluffy_red_hat": "\u84ec\u677e\u7ea2\u5e3d\u5b50",
        "/items/corsair_helmet": "\u63a0\u593a\u8005\u5934\u76d4",
        "/items/acrobatic_hood": "\u6742\u6280\u5e08\u515c\u5e3d",
        "/items/magicians_hat": "\u9b54\u672f\u5e08\u5e3d",
        "/items/cheese_helmet": "\u5976\u916a\u5934\u76d4",
        "/items/verdant_helmet": "\u7fe0\u7eff\u5934\u76d4",
        "/items/azure_helmet": "\u851a\u84dd\u5934\u76d4",
        "/items/burble_helmet": "\u6df1\u7d2b\u5934\u76d4",
        "/items/crimson_helmet": "\u7edb\u7ea2\u5934\u76d4",
        "/items/rainbow_helmet": "\u5f69\u8679\u5934\u76d4",
        "/items/holy_helmet": "\u795e\u5723\u5934\u76d4",
        "/items/rough_hood": "\u7c97\u7cd9\u515c\u5e3d",
        "/items/reptile_hood": "\u722c\u884c\u52a8\u7269\u515c\u5e3d",
        "/items/gobo_hood": "\u54e5\u5e03\u6797\u515c\u5e3d",
        "/items/beast_hood": "\u91ce\u517d\u515c\u5e3d",
        "/items/umbral_hood": "\u6697\u5f71\u515c\u5e3d",
        "/items/cotton_hat": "\u68c9\u5e3d",
        "/items/linen_hat": "\u4e9a\u9ebb\u5e3d",
        "/items/bamboo_hat": "\u7af9\u5e3d",
        "/items/silk_hat": "\u4e1d\u5e3d",
        "/items/radiant_hat": "\u5149\u8f89\u5e3d",
        "/items/dairyhands_top": "\u6324\u5976\u5de5\u4e0a\u8863",
        "/items/foragers_top": "\u91c7\u6458\u8005\u4e0a\u8863",
        "/items/lumberjacks_top": "\u4f10\u6728\u5de5\u4e0a\u8863",
        "/items/cheesemakers_top": "\u5976\u916a\u5e08\u4e0a\u8863",
        "/items/crafters_top": "\u5de5\u5320\u4e0a\u8863",
        "/items/tailors_top": "\u88c1\u7f1d\u4e0a\u8863",
        "/items/chefs_top": "\u53a8\u5e08\u4e0a\u8863",
        "/items/brewers_top": "\u996e\u54c1\u5e08\u4e0a\u8863",
        "/items/alchemists_top": "\u70bc\u91d1\u5e08\u4e0a\u8863",
        "/items/enhancers_top": "\u5f3a\u5316\u5e08\u4e0a\u8863",
        "/items/gator_vest": "\u9cc4\u9c7c\u9a6c\u7532",
        "/items/turtle_shell_body": "\u9f9f\u58f3\u80f8\u7532",
        "/items/colossus_plate_body": "\u5de8\u50cf\u80f8\u7532",
        "/items/demonic_plate_body": "\u6076\u9b54\u80f8\u7532",
        "/items/anchorbound_plate_body": "\u951a\u5b9a\u80f8\u7532",
        "/items/maelstrom_plate_body": "\u6012\u6d9b\u80f8\u7532",
        "/items/marine_tunic": "\u6d77\u6d0b\u76ae\u8863",
        "/items/revenant_tunic": "\u4ea1\u7075\u76ae\u8863",
        "/items/griffin_tunic": "\u72ee\u9e6b\u76ae\u8863",
        "/items/kraken_tunic": "\u514b\u62c9\u80af\u76ae\u8863",
        "/items/icy_robe_top": "\u51b0\u971c\u888d\u670d",
        "/items/flaming_robe_top": "\u70c8\u7130\u888d\u670d",
        "/items/luna_robe_top": "\u6708\u795e\u888d\u670d",
        "/items/royal_water_robe_top": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d",
        "/items/royal_nature_robe_top": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d",
        "/items/royal_fire_robe_top": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d",
        "/items/cheese_plate_body": "\u5976\u916a\u80f8\u7532",
        "/items/verdant_plate_body": "\u7fe0\u7eff\u80f8\u7532",
        "/items/azure_plate_body": "\u851a\u84dd\u80f8\u7532",
        "/items/burble_plate_body": "\u6df1\u7d2b\u80f8\u7532",
        "/items/crimson_plate_body": "\u7edb\u7ea2\u80f8\u7532",
        "/items/rainbow_plate_body": "\u5f69\u8679\u80f8\u7532",
        "/items/holy_plate_body": "\u795e\u5723\u80f8\u7532",
        "/items/rough_tunic": "\u7c97\u7cd9\u76ae\u8863",
        "/items/reptile_tunic": "\u722c\u884c\u52a8\u7269\u76ae\u8863",
        "/items/gobo_tunic": "\u54e5\u5e03\u6797\u76ae\u8863",
        "/items/beast_tunic": "\u91ce\u517d\u76ae\u8863",
        "/items/umbral_tunic": "\u6697\u5f71\u76ae\u8863",
        "/items/cotton_robe_top": "\u68c9\u5e03\u888d\u670d",
        "/items/linen_robe_top": "\u4e9a\u9ebb\u888d\u670d",
        "/items/bamboo_robe_top": "\u7af9\u888d\u670d",
        "/items/silk_robe_top": "\u4e1d\u7ef8\u888d\u670d",
        "/items/radiant_robe_top": "\u5149\u8f89\u888d\u670d",
        "/items/dairyhands_bottoms": "\u6324\u5976\u5de5\u4e0b\u88c5",
        "/items/foragers_bottoms": "\u91c7\u6458\u8005\u4e0b\u88c5",
        "/items/lumberjacks_bottoms": "\u4f10\u6728\u5de5\u4e0b\u88c5",
        "/items/cheesemakers_bottoms": "\u5976\u916a\u5e08\u4e0b\u88c5",
        "/items/crafters_bottoms": "\u5de5\u5320\u4e0b\u88c5",
        "/items/tailors_bottoms": "\u88c1\u7f1d\u4e0b\u88c5",
        "/items/chefs_bottoms": "\u53a8\u5e08\u4e0b\u88c5",
        "/items/brewers_bottoms": "\u996e\u54c1\u5e08\u4e0b\u88c5",
        "/items/alchemists_bottoms": "\u70bc\u91d1\u5e08\u4e0b\u88c5",
        "/items/enhancers_bottoms": "\u5f3a\u5316\u5e08\u4e0b\u88c5",
        "/items/turtle_shell_legs": "\u9f9f\u58f3\u817f\u7532",
        "/items/colossus_plate_legs": "\u5de8\u50cf\u817f\u7532",
        "/items/demonic_plate_legs": "\u6076\u9b54\u817f\u7532",
        "/items/anchorbound_plate_legs": "\u951a\u5b9a\u817f\u7532",
        "/items/maelstrom_plate_legs": "\u6012\u6d9b\u817f\u7532",
        "/items/marine_chaps": "\u822a\u6d77\u76ae\u88e4",
        "/items/revenant_chaps": "\u4ea1\u7075\u76ae\u88e4",
        "/items/griffin_chaps": "\u72ee\u9e6b\u76ae\u88e4",
        "/items/kraken_chaps": "\u514b\u62c9\u80af\u76ae\u88e4",
        "/items/icy_robe_bottoms": "\u51b0\u971c\u888d\u88d9",
        "/items/flaming_robe_bottoms": "\u70c8\u7130\u888d\u88d9",
        "/items/luna_robe_bottoms": "\u6708\u795e\u888d\u88d9",
        "/items/royal_water_robe_bottoms": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9",
        "/items/royal_nature_robe_bottoms": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9",
        "/items/royal_fire_robe_bottoms": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9",
        "/items/cheese_plate_legs": "\u5976\u916a\u817f\u7532",
        "/items/verdant_plate_legs": "\u7fe0\u7eff\u817f\u7532",
        "/items/azure_plate_legs": "\u851a\u84dd\u817f\u7532",
        "/items/burble_plate_legs": "\u6df1\u7d2b\u817f\u7532",
        "/items/crimson_plate_legs": "\u7edb\u7ea2\u817f\u7532",
        "/items/rainbow_plate_legs": "\u5f69\u8679\u817f\u7532",
        "/items/holy_plate_legs": "\u795e\u5723\u817f\u7532",
        "/items/rough_chaps": "\u7c97\u7cd9\u76ae\u88e4",
        "/items/reptile_chaps": "\u722c\u884c\u52a8\u7269\u76ae\u88e4",
        "/items/gobo_chaps": "\u54e5\u5e03\u6797\u76ae\u88e4",
        "/items/beast_chaps": "\u91ce\u517d\u76ae\u88e4",
        "/items/umbral_chaps": "\u6697\u5f71\u76ae\u88e4",
        "/items/cotton_robe_bottoms": "\u68c9\u888d\u88d9",
        "/items/linen_robe_bottoms": "\u4e9a\u9ebb\u888d\u88d9",
        "/items/bamboo_robe_bottoms": "\u7af9\u888d\u88d9",
        "/items/silk_robe_bottoms": "\u4e1d\u7ef8\u888d\u88d9",
        "/items/radiant_robe_bottoms": "\u5149\u8f89\u888d\u88d9",
        "/items/enchanted_gloves": "\u9644\u9b54\u624b\u5957",
        "/items/pincer_gloves": "\u87f9\u94b3\u624b\u5957",
        "/items/panda_gloves": "\u718a\u732b\u624b\u5957",
        "/items/magnetic_gloves": "\u78c1\u529b\u624b\u5957",
        "/items/dodocamel_gauntlets": "\u6e21\u6e21\u9a7c\u62a4\u624b",
        "/items/sighted_bracers": "\u7784\u51c6\u62a4\u8155",
        "/items/marksman_bracers": "\u795e\u5c04\u62a4\u8155",
        "/items/chrono_gloves": "\u65f6\u7a7a\u624b\u5957",
        "/items/cheese_gauntlets": "\u5976\u916a\u62a4\u624b",
        "/items/verdant_gauntlets": "\u7fe0\u7eff\u62a4\u624b",
        "/items/azure_gauntlets": "\u851a\u84dd\u62a4\u624b",
        "/items/burble_gauntlets": "\u6df1\u7d2b\u62a4\u624b",
        "/items/crimson_gauntlets": "\u7edb\u7ea2\u62a4\u624b",
        "/items/rainbow_gauntlets": "\u5f69\u8679\u62a4\u624b",
        "/items/holy_gauntlets": "\u795e\u5723\u62a4\u624b",
        "/items/rough_bracers": "\u7c97\u7cd9\u62a4\u8155",
        "/items/reptile_bracers": "\u722c\u884c\u52a8\u7269\u62a4\u8155",
        "/items/gobo_bracers": "\u54e5\u5e03\u6797\u62a4\u8155",
        "/items/beast_bracers": "\u91ce\u517d\u62a4\u8155",
        "/items/umbral_bracers": "\u6697\u5f71\u62a4\u8155",
        "/items/cotton_gloves": "\u68c9\u624b\u5957",
        "/items/linen_gloves": "\u4e9a\u9ebb\u624b\u5957",
        "/items/bamboo_gloves": "\u7af9\u624b\u5957",
        "/items/silk_gloves": "\u4e1d\u624b\u5957",
        "/items/radiant_gloves": "\u5149\u8f89\u624b\u5957",
        "/items/collectors_boots": "\u6536\u85cf\u5bb6\u9774",
        "/items/shoebill_shoes": "\u9cb8\u5934\u9e73\u978b",
        "/items/black_bear_shoes": "\u9ed1\u718a\u978b",
        "/items/grizzly_bear_shoes": "\u68d5\u718a\u978b",
        "/items/polar_bear_shoes": "\u5317\u6781\u718a\u978b",
        "/items/centaur_boots": "\u534a\u4eba\u9a6c\u9774",
        "/items/sorcerer_boots": "\u5deb\u5e08\u9774",
        "/items/cheese_boots": "\u5976\u916a\u9774",
        "/items/verdant_boots": "\u7fe0\u7eff\u9774",
        "/items/azure_boots": "\u851a\u84dd\u9774",
        "/items/burble_boots": "\u6df1\u7d2b\u9774",
        "/items/crimson_boots": "\u7edb\u7ea2\u9774",
        "/items/rainbow_boots": "\u5f69\u8679\u9774",
        "/items/holy_boots": "\u795e\u5723\u9774",
        "/items/rough_boots": "\u7c97\u7cd9\u9774",
        "/items/reptile_boots": "\u722c\u884c\u52a8\u7269\u9774",
        "/items/gobo_boots": "\u54e5\u5e03\u6797\u9774",
        "/items/beast_boots": "\u91ce\u517d\u9774",
        "/items/umbral_boots": "\u6697\u5f71\u9774",
        "/items/cotton_boots": "\u68c9\u9774",
        "/items/linen_boots": "\u4e9a\u9ebb\u9774",
        "/items/bamboo_boots": "\u7af9\u9774",
        "/items/silk_boots": "\u4e1d\u9774",
        "/items/radiant_boots": "\u5149\u8f89\u9774",
        "/items/small_pouch": "\u5c0f\u888b\u5b50",
        "/items/medium_pouch": "\u4e2d\u888b\u5b50",
        "/items/large_pouch": "\u5927\u888b\u5b50",
        "/items/giant_pouch": "\u5de8\u5927\u888b\u5b50",
        "/items/gluttonous_pouch": "\u8d2a\u98df\u4e4b\u888b",
        "/items/guzzling_pouch": "\u66b4\u996e\u4e4b\u56ca",
        "/items/necklace_of_efficiency": "\u6548\u7387\u9879\u94fe",
        "/items/fighter_necklace": "\u6218\u58eb\u9879\u94fe",
        "/items/ranger_necklace": "\u5c04\u624b\u9879\u94fe",
        "/items/wizard_necklace": "\u5deb\u5e08\u9879\u94fe",
        "/items/necklace_of_wisdom": "\u7ecf\u9a8c\u9879\u94fe",
        "/items/necklace_of_speed": "\u901f\u5ea6\u9879\u94fe",
        "/items/philosophers_necklace": "\u8d24\u8005\u9879\u94fe",
        "/items/earrings_of_gathering": "\u91c7\u96c6\u8033\u73af",
        "/items/earrings_of_essence_find": "\u7cbe\u534e\u53d1\u73b0\u8033\u73af",
        "/items/earrings_of_armor": "\u62a4\u7532\u8033\u73af",
        "/items/earrings_of_regeneration": "\u6062\u590d\u8033\u73af",
        "/items/earrings_of_resistance": "\u6297\u6027\u8033\u73af",
        "/items/earrings_of_rare_find": "\u7a00\u6709\u53d1\u73b0\u8033\u73af",
        "/items/earrings_of_critical_strike": "\u66b4\u51fb\u8033\u73af",
        "/items/philosophers_earrings": "\u8d24\u8005\u8033\u73af",
        "/items/ring_of_gathering": "\u91c7\u96c6\u6212\u6307",
        "/items/ring_of_essence_find": "\u7cbe\u534e\u53d1\u73b0\u6212\u6307",
        "/items/ring_of_armor": "\u62a4\u7532\u6212\u6307",
        "/items/ring_of_regeneration": "\u6062\u590d\u6212\u6307",
        "/items/ring_of_resistance": "\u6297\u6027\u6212\u6307",
        "/items/ring_of_rare_find": "\u7a00\u6709\u53d1\u73b0\u6212\u6307",
        "/items/ring_of_critical_strike": "\u66b4\u51fb\u6212\u6307",
        "/items/philosophers_ring": "\u8d24\u8005\u6212\u6307",
        "/items/basic_task_badge": "\u57fa\u7840\u4efb\u52a1\u5fbd\u7ae0",
        "/items/advanced_task_badge": "\u9ad8\u7ea7\u4efb\u52a1\u5fbd\u7ae0",
        "/items/expert_task_badge": "\u4e13\u5bb6\u4efb\u52a1\u5fbd\u7ae0",
        "/items/celestial_brush": "\u661f\u7a7a\u5237\u5b50",
        "/items/cheese_brush": "\u5976\u916a\u5237\u5b50",
        "/items/verdant_brush": "\u7fe0\u7eff\u5237\u5b50",
        "/items/azure_brush": "\u851a\u84dd\u5237\u5b50",
        "/items/burble_brush": "\u6df1\u7d2b\u5237\u5b50",
        "/items/crimson_brush": "\u7edb\u7ea2\u5237\u5b50",
        "/items/rainbow_brush": "\u5f69\u8679\u5237\u5b50",
        "/items/holy_brush": "\u795e\u5723\u5237\u5b50",
        "/items/celestial_shears": "\u661f\u7a7a\u526a\u5200",
        "/items/cheese_shears": "\u5976\u916a\u526a\u5200",
        "/items/verdant_shears": "\u7fe0\u7eff\u526a\u5200",
        "/items/azure_shears": "\u851a\u84dd\u526a\u5200",
        "/items/burble_shears": "\u6df1\u7d2b\u526a\u5200",
        "/items/crimson_shears": "\u7edb\u7ea2\u526a\u5200",
        "/items/rainbow_shears": "\u5f69\u8679\u526a\u5200",
        "/items/holy_shears": "\u795e\u5723\u526a\u5200",
        "/items/celestial_hatchet": "\u661f\u7a7a\u65a7\u5934",
        "/items/cheese_hatchet": "\u5976\u916a\u65a7\u5934",
        "/items/verdant_hatchet": "\u7fe0\u7eff\u65a7\u5934",
        "/items/azure_hatchet": "\u851a\u84dd\u65a7\u5934",
        "/items/burble_hatchet": "\u6df1\u7d2b\u65a7\u5934",
        "/items/crimson_hatchet": "\u7edb\u7ea2\u65a7\u5934",
        "/items/rainbow_hatchet": "\u5f69\u8679\u65a7\u5934",
        "/items/holy_hatchet": "\u795e\u5723\u65a7\u5934",
        "/items/celestial_hammer": "\u661f\u7a7a\u9524\u5b50",
        "/items/cheese_hammer": "\u5976\u916a\u9524\u5b50",
        "/items/verdant_hammer": "\u7fe0\u7eff\u9524\u5b50",
        "/items/azure_hammer": "\u851a\u84dd\u9524\u5b50",
        "/items/burble_hammer": "\u6df1\u7d2b\u9524\u5b50",
        "/items/crimson_hammer": "\u7edb\u7ea2\u9524\u5b50",
        "/items/rainbow_hammer": "\u5f69\u8679\u9524\u5b50",
        "/items/holy_hammer": "\u795e\u5723\u9524\u5b50",
        "/items/celestial_chisel": "\u661f\u7a7a\u51ff\u5b50",
        "/items/cheese_chisel": "\u5976\u916a\u51ff\u5b50",
        "/items/verdant_chisel": "\u7fe0\u7eff\u51ff\u5b50",
        "/items/azure_chisel": "\u851a\u84dd\u51ff\u5b50",
        "/items/burble_chisel": "\u6df1\u7d2b\u51ff\u5b50",
        "/items/crimson_chisel": "\u7edb\u7ea2\u51ff\u5b50",
        "/items/rainbow_chisel": "\u5f69\u8679\u51ff\u5b50",
        "/items/holy_chisel": "\u795e\u5723\u51ff\u5b50",
        "/items/celestial_needle": "\u661f\u7a7a\u9488",
        "/items/cheese_needle": "\u5976\u916a\u9488",
        "/items/verdant_needle": "\u7fe0\u7eff\u9488",
        "/items/azure_needle": "\u851a\u84dd\u9488",
        "/items/burble_needle": "\u6df1\u7d2b\u9488",
        "/items/crimson_needle": "\u7edb\u7ea2\u9488",
        "/items/rainbow_needle": "\u5f69\u8679\u9488",
        "/items/holy_needle": "\u795e\u5723\u9488",
        "/items/celestial_spatula": "\u661f\u7a7a\u9505\u94f2",
        "/items/cheese_spatula": "\u5976\u916a\u9505\u94f2",
        "/items/verdant_spatula": "\u7fe0\u7eff\u9505\u94f2",
        "/items/azure_spatula": "\u851a\u84dd\u9505\u94f2",
        "/items/burble_spatula": "\u6df1\u7d2b\u9505\u94f2",
        "/items/crimson_spatula": "\u7edb\u7ea2\u9505\u94f2",
        "/items/rainbow_spatula": "\u5f69\u8679\u9505\u94f2",
        "/items/holy_spatula": "\u795e\u5723\u9505\u94f2",
        "/items/celestial_pot": "\u661f\u7a7a\u58f6",
        "/items/cheese_pot": "\u5976\u916a\u58f6",
        "/items/verdant_pot": "\u7fe0\u7eff\u58f6",
        "/items/azure_pot": "\u851a\u84dd\u58f6",
        "/items/burble_pot": "\u6df1\u7d2b\u58f6",
        "/items/crimson_pot": "\u7edb\u7ea2\u58f6",
        "/items/rainbow_pot": "\u5f69\u8679\u58f6",
        "/items/holy_pot": "\u795e\u5723\u58f6",
        "/items/celestial_alembic": "\u661f\u7a7a\u84b8\u998f\u5668",
        "/items/cheese_alembic": "\u5976\u916a\u84b8\u998f\u5668",
        "/items/verdant_alembic": "\u7fe0\u7eff\u84b8\u998f\u5668",
        "/items/azure_alembic": "\u851a\u84dd\u84b8\u998f\u5668",
        "/items/burble_alembic": "\u6df1\u7d2b\u84b8\u998f\u5668",
        "/items/crimson_alembic": "\u7edb\u7ea2\u84b8\u998f\u5668",
        "/items/rainbow_alembic": "\u5f69\u8679\u84b8\u998f\u5668",
        "/items/holy_alembic": "\u795e\u5723\u84b8\u998f\u5668",
        "/items/celestial_enhancer": "\u661f\u7a7a\u5f3a\u5316\u5668",
        "/items/cheese_enhancer": "\u5976\u916a\u5f3a\u5316\u5668",
        "/items/verdant_enhancer": "\u7fe0\u7eff\u5f3a\u5316\u5668",
        "/items/azure_enhancer": "\u851a\u84dd\u5f3a\u5316\u5668",
        "/items/burble_enhancer": "\u6df1\u7d2b\u5f3a\u5316\u5668",
        "/items/crimson_enhancer": "\u7edb\u7ea2\u5f3a\u5316\u5668",
        "/items/rainbow_enhancer": "\u5f69\u8679\u5f3a\u5316\u5668",
        "/items/holy_enhancer": "\u795e\u5723\u5f3a\u5316\u5668",
        "/items/milk": "\u725b\u5976",
        "/items/verdant_milk": "\u7fe0\u7eff\u725b\u5976",
        "/items/azure_milk": "\u851a\u84dd\u725b\u5976",
        "/items/burble_milk": "\u6df1\u7d2b\u725b\u5976",
        "/items/crimson_milk": "\u7edb\u7ea2\u725b\u5976",
        "/items/rainbow_milk": "\u5f69\u8679\u725b\u5976",
        "/items/holy_milk": "\u795e\u5723\u725b\u5976",
        "/items/cheese": "\u5976\u916a",
        "/items/verdant_cheese": "\u7fe0\u7eff\u5976\u916a",
        "/items/azure_cheese": "\u851a\u84dd\u5976\u916a",
        "/items/burble_cheese": "\u6df1\u7d2b\u5976\u916a",
        "/items/crimson_cheese": "\u7edb\u7ea2\u5976\u916a",
        "/items/rainbow_cheese": "\u5f69\u8679\u5976\u916a",
        "/items/holy_cheese": "\u795e\u5723\u5976\u916a",
        "/items/log": "\u539f\u6728",
        "/items/birch_log": "\u767d\u6866\u539f\u6728",
        "/items/cedar_log": "\u96ea\u677e\u539f\u6728",
        "/items/purpleheart_log": "\u7d2b\u5fc3\u539f\u6728",
        "/items/ginkgo_log": "\u94f6\u674f\u539f\u6728",
        "/items/redwood_log": "\u7ea2\u6749\u539f\u6728",
        "/items/arcane_log": "\u795e\u79d8\u539f\u6728",
        "/items/lumber": "\u6728\u677f",
        "/items/birch_lumber": "\u767d\u6866\u6728\u677f",
        "/items/cedar_lumber": "\u96ea\u677e\u6728\u677f",
        "/items/purpleheart_lumber": "\u7d2b\u5fc3\u6728\u677f",
        "/items/ginkgo_lumber": "\u94f6\u674f\u6728\u677f",
        "/items/redwood_lumber": "\u7ea2\u6749\u6728\u677f",
        "/items/arcane_lumber": "\u795e\u79d8\u6728\u677f",
        "/items/rough_hide": "\u7c97\u7cd9\u517d\u76ae",
        "/items/reptile_hide": "\u722c\u884c\u52a8\u7269\u76ae",
        "/items/gobo_hide": "\u54e5\u5e03\u6797\u76ae",
        "/items/beast_hide": "\u91ce\u517d\u76ae",
        "/items/umbral_hide": "\u6697\u5f71\u76ae",
        "/items/rough_leather": "\u7c97\u7cd9\u76ae\u9769",
        "/items/reptile_leather": "\u722c\u884c\u52a8\u7269\u76ae\u9769",
        "/items/gobo_leather": "\u54e5\u5e03\u6797\u76ae\u9769",
        "/items/beast_leather": "\u91ce\u517d\u76ae\u9769",
        "/items/umbral_leather": "\u6697\u5f71\u76ae\u9769",
        "/items/cotton": "\u68c9\u82b1",
        "/items/flax": "\u4e9a\u9ebb",
        "/items/bamboo_branch": "\u7af9\u5b50",
        "/items/cocoon": "\u8695\u8327",
        "/items/radiant_fiber": "\u5149\u8f89\u7ea4\u7ef4",
        "/items/cotton_fabric": "\u68c9\u82b1\u5e03\u6599",
        "/items/linen_fabric": "\u4e9a\u9ebb\u5e03\u6599",
        "/items/bamboo_fabric": "\u7af9\u5b50\u5e03\u6599",
        "/items/silk_fabric": "\u4e1d\u7ef8",
        "/items/radiant_fabric": "\u5149\u8f89\u5e03\u6599",
        "/items/egg": "\u9e21\u86cb",
        "/items/wheat": "\u5c0f\u9ea6",
        "/items/sugar": "\u7cd6",
        "/items/blueberry": "\u84dd\u8393",
        "/items/blackberry": "\u9ed1\u8393",
        "/items/strawberry": "\u8349\u8393",
        "/items/mooberry": "\u54de\u8393",
        "/items/marsberry": "\u706b\u661f\u8393",
        "/items/spaceberry": "\u592a\u7a7a\u8393",
        "/items/apple": "\u82f9\u679c",
        "/items/orange": "\u6a59\u5b50",
        "/items/plum": "\u674e\u5b50",
        "/items/peach": "\u6843\u5b50",
        "/items/dragon_fruit": "\u706b\u9f99\u679c",
        "/items/star_fruit": "\u6768\u6843",
        "/items/arabica_coffee_bean": "\u4f4e\u7ea7\u5496\u5561\u8c46",
        "/items/robusta_coffee_bean": "\u4e2d\u7ea7\u5496\u5561\u8c46",
        "/items/liberica_coffee_bean": "\u9ad8\u7ea7\u5496\u5561\u8c46",
        "/items/excelsa_coffee_bean": "\u7279\u7ea7\u5496\u5561\u8c46",
        "/items/fieriosa_coffee_bean": "\u706b\u5c71\u5496\u5561\u8c46",
        "/items/spacia_coffee_bean": "\u592a\u7a7a\u5496\u5561\u8c46",
        "/items/green_tea_leaf": "\u7eff\u8336\u53f6",
        "/items/black_tea_leaf": "\u9ed1\u8336\u53f6",
        "/items/burble_tea_leaf": "\u7d2b\u8336\u53f6",
        "/items/moolong_tea_leaf": "\u54de\u9f99\u8336\u53f6",
        "/items/red_tea_leaf": "\u7ea2\u8336\u53f6",
        "/items/emp_tea_leaf": "\u865a\u7a7a\u8336\u53f6",
        "/items/catalyst_of_coinification": "\u70b9\u91d1\u50ac\u5316\u5242",
        "/items/catalyst_of_decomposition": "\u5206\u89e3\u50ac\u5316\u5242",
        "/items/catalyst_of_transmutation": "\u8f6c\u5316\u50ac\u5316\u5242",
        "/items/prime_catalyst": "\u81f3\u9ad8\u50ac\u5316\u5242",
        "/items/snake_fang": "\u86c7\u7259",
        "/items/shoebill_feather": "\u9cb8\u5934\u9e73\u7fbd\u6bdb",
        "/items/snail_shell": "\u8717\u725b\u58f3",
        "/items/crab_pincer": "\u87f9\u94b3",
        "/items/turtle_shell": "\u4e4c\u9f9f\u58f3",
        "/items/marine_scale": "\u6d77\u6d0b\u9cde\u7247",
        "/items/treant_bark": "\u6811\u76ae",
        "/items/centaur_hoof": "\u534a\u4eba\u9a6c\u8e44",
        "/items/luna_wing": "\u6708\u795e\u7ffc",
        "/items/gobo_rag": "\u54e5\u5e03\u6797\u62b9\u5e03",
        "/items/goggles": "\u62a4\u76ee\u955c",
        "/items/magnifying_glass": "\u653e\u5927\u955c",
        "/items/eye_of_the_watcher": "\u89c2\u5bdf\u8005\u4e4b\u773c",
        "/items/icy_cloth": "\u51b0\u971c\u7ec7\u7269",
        "/items/flaming_cloth": "\u70c8\u7130\u7ec7\u7269",
        "/items/sorcerers_sole": "\u9b54\u6cd5\u5e08\u978b\u5e95",
        "/items/chrono_sphere": "\u65f6\u7a7a\u7403",
        "/items/frost_sphere": "\u51b0\u971c\u7403",
        "/items/panda_fluff": "\u718a\u732b\u7ed2",
        "/items/black_bear_fluff": "\u9ed1\u718a\u7ed2",
        "/items/grizzly_bear_fluff": "\u68d5\u718a\u7ed2",
        "/items/polar_bear_fluff": "\u5317\u6781\u718a\u7ed2",
        "/items/red_panda_fluff": "\u5c0f\u718a\u732b\u7ed2",
        "/items/magnet": "\u78c1\u94c1",
        "/items/stalactite_shard": "\u949f\u4e73\u77f3\u788e\u7247",
        "/items/living_granite": "\u82b1\u5c97\u5ca9",
        "/items/colossus_core": "\u5de8\u50cf\u6838\u5fc3",
        "/items/vampire_fang": "\u5438\u8840\u9b3c\u4e4b\u7259",
        "/items/werewolf_claw": "\u72fc\u4eba\u4e4b\u722a",
        "/items/revenant_anima": "\u4ea1\u8005\u4e4b\u9b42",
        "/items/soul_fragment": "\u7075\u9b42\u788e\u7247",
        "/items/infernal_ember": "\u5730\u72f1\u4f59\u70ec",
        "/items/demonic_core": "\u6076\u9b54\u6838\u5fc3",
        "/items/griffin_leather": "\u72ee\u9e6b\u4e4b\u76ae",
        "/items/manticore_sting": "\u874e\u72ee\u4e4b\u523a",
        "/items/jackalope_antler": "\u9e7f\u89d2\u5154\u4e4b\u89d2",
        "/items/dodocamel_plume": "\u6e21\u6e21\u9a7c\u4e4b\u7fce",
        "/items/griffin_talon": "\u72ee\u9e6b\u4e4b\u722a",
        "/items/acrobats_ribbon": "\u6742\u6280\u5e08\u5f69\u5e26",
        "/items/magicians_cloth": "\u9b54\u672f\u5e08\u7ec7\u7269",
        "/items/chaotic_chain": "\u6df7\u6c8c\u9501\u94fe",
        "/items/cursed_ball": "\u8bc5\u5492\u4e4b\u7403",
        "/items/royal_cloth": "\u7687\u5bb6\u7ec7\u7269",
        "/items/knights_ingot": "\u9a91\u58eb\u4e4b\u952d",
        "/items/bishops_scroll": "\u4e3b\u6559\u5377\u8f74",
        "/items/regal_jewel": "\u541b\u738b\u5b9d\u77f3",
        "/items/sundering_jewel": "\u88c2\u7a7a\u5b9d\u77f3",
        "/items/marksman_brooch": "\u795e\u5c04\u80f8\u9488",
        "/items/corsair_crest": "\u63a0\u593a\u8005\u5fbd\u7ae0",
        "/items/damaged_anchor": "\u7834\u635f\u8239\u951a",
        "/items/maelstrom_plating": "\u6012\u6d9b\u7532\u7247",
        "/items/kraken_leather": "\u514b\u62c9\u80af\u76ae\u9769",
        "/items/kraken_fang": "\u514b\u62c9\u80af\u4e4b\u7259",
        "/items/butter_of_proficiency": "\u7cbe\u901a\u4e4b\u6cb9",
        "/items/thread_of_expertise": "\u4e13\u7cbe\u4e4b\u7ebf",
        "/items/branch_of_insight": "\u6d1e\u5bdf\u4e4b\u679d",
        "/items/gluttonous_energy": "\u8d2a\u98df\u80fd\u91cf",
        "/items/guzzling_energy": "\u66b4\u996e\u80fd\u91cf",
        "/items/milking_essence": "\u6324\u5976\u7cbe\u534e",
        "/items/foraging_essence": "\u91c7\u6458\u7cbe\u534e",
        "/items/woodcutting_essence": "\u4f10\u6728\u7cbe\u534e",
        "/items/cheesesmithing_essence": "\u5976\u916a\u953b\u9020\u7cbe\u534e",
        "/items/crafting_essence": "\u5236\u4f5c\u7cbe\u534e",
        "/items/tailoring_essence": "\u7f1d\u7eab\u7cbe\u534e",
        "/items/cooking_essence": "\u70f9\u996a\u7cbe\u534e",
        "/items/brewing_essence": "\u51b2\u6ce1\u7cbe\u534e",
        "/items/alchemy_essence": "\u70bc\u91d1\u7cbe\u534e",
        "/items/enhancing_essence": "\u5f3a\u5316\u7cbe\u534e",
        "/items/swamp_essence": "\u6cbc\u6cfd\u7cbe\u534e",
        "/items/aqua_essence": "\u6d77\u6d0b\u7cbe\u534e",
        "/items/jungle_essence": "\u4e1b\u6797\u7cbe\u534e",
        "/items/gobo_essence": "\u54e5\u5e03\u6797\u7cbe\u534e",
        "/items/eyessence": "\u773c\u7cbe\u534e",
        "/items/sorcerer_essence": "\u6cd5\u5e08\u7cbe\u534e",
        "/items/bear_essence": "\u718a\u718a\u7cbe\u534e",
        "/items/golem_essence": "\u9b54\u50cf\u7cbe\u534e",
        "/items/twilight_essence": "\u66ae\u5149\u7cbe\u534e",
        "/items/abyssal_essence": "\u5730\u72f1\u7cbe\u534e",
        "/items/chimerical_essence": "\u5947\u5e7b\u7cbe\u534e",
        "/items/sinister_essence": "\u9634\u68ee\u7cbe\u534e",
        "/items/enchanted_essence": "\u79d8\u6cd5\u7cbe\u534e",
        "/items/pirate_essence": "\u6d77\u76d7\u7cbe\u534e",
        "/items/task_crystal": "\u4efb\u52a1\u6c34\u6676",
        "/items/star_fragment": "\u661f\u5149\u788e\u7247",
        "/items/pearl": "\u73cd\u73e0",
        "/items/amber": "\u7425\u73c0",
        "/items/garnet": "\u77f3\u69b4\u77f3",
        "/items/jade": "\u7fe1\u7fe0",
        "/items/amethyst": "\u7d2b\u6c34\u6676",
        "/items/moonstone": "\u6708\u4eae\u77f3",
        "/items/sunstone": "\u592a\u9633\u77f3",
        "/items/philosophers_stone": "\u8d24\u8005\u4e4b\u77f3",
        "/items/crushed_pearl": "\u73cd\u73e0\u788e\u7247",
        "/items/crushed_amber": "\u7425\u73c0\u788e\u7247",
        "/items/crushed_garnet": "\u77f3\u69b4\u77f3\u788e\u7247",
        "/items/crushed_jade": "\u7fe1\u7fe0\u788e\u7247",
        "/items/crushed_amethyst": "\u7d2b\u6c34\u6676\u788e\u7247",
        "/items/crushed_moonstone": "\u6708\u4eae\u77f3\u788e\u7247",
        "/items/crushed_sunstone": "\u592a\u9633\u77f3\u788e\u7247",
        "/items/crushed_philosophers_stone": "\u8d24\u8005\u4e4b\u77f3\u788e\u7247",
        "/items/shard_of_protection": "\u4fdd\u62a4\u788e\u7247",
        "/items/mirror_of_protection": "\u4fdd\u62a4\u4e4b\u955c"
    };

    const itemCategoryNames = {
        "/item_categories/currency": "\u8d27\u5e01",
        "/item_categories/loot": "\u6218\u5229\u54c1",
        "/item_categories/key": "\u94a5\u5319",
        "/item_categories/food": "\u98df\u7269",
        "/item_categories/drink": "\u996e\u6599",
        "/item_categories/ability_book": "\u6280\u80fd\u4e66",
        "/item_categories/equipment": "\u88c5\u5907",
        "/item_categories/resource": "\u8d44\u6e90"
    };

    const equipmentTypeNames = {
        "/equipment_types/two_hand": "\u53cc\u624b",
        "/equipment_types/main_hand": "\u4e3b\u624b",
        "/equipment_types/off_hand": "\u526f\u624b",
        "/equipment_types/back": "\u80cc\u90e8",
        "/equipment_types/head": "\u5934\u90e8",
        "/equipment_types/body": "\u8eab\u4f53",
        "/equipment_types/legs": "\u817f\u90e8",
        "/equipment_types/hands": "\u624b\u90e8",
        "/equipment_types/feet": "\u811a\u90e8",
        "/equipment_types/pouch": "\u888b\u5b50",
        "/equipment_types/neck": "\u9879\u94fe",
        "/equipment_types/earrings": "\u8033\u73af",
        "/equipment_types/ring": "\u6212\u6307",
        "/equipment_types/trinket": "\u9970\u54c1",
        "/equipment_types/milking_tool": "\u6324\u5976\u5de5\u5177",
        "/equipment_types/foraging_tool": "\u91c7\u6458\u5de5\u5177",
        "/equipment_types/woodcutting_tool": "\u4f10\u6728\u5de5\u5177",
        "/equipment_types/cheesesmithing_tool": "\u5976\u916a\u953b\u9020\u5de5\u5177",
        "/equipment_types/crafting_tool": "\u5236\u4f5c\u5de5\u5177",
        "/equipment_types/tailoring_tool": "\u7f1d\u7eab\u5de5\u5177",
        "/equipment_types/cooking_tool": "\u70f9\u996a\u5de5\u5177",
        "/equipment_types/brewing_tool": "\u51b2\u6ce1\u5de5\u5177",
        "/equipment_types/alchemy_tool": "\u70bc\u91d1\u5de5\u5177",
        "/equipment_types/enhancing_tool": "\u5f3a\u5316\u5de5\u5177"
    };

    const monsterNames = {
        "/monsters/abyssal_imp": "\u6df1\u6e0a\u5c0f\u9b3c",
        "/monsters/acrobat": "\u6742\u6280\u5e08",
        "/monsters/anchor_shark": "\u6301\u951a\u9ca8",
        "/monsters/aquahorse": "\u6c34\u9a6c",
        "/monsters/black_bear": "\u9ed1\u718a",
        "/monsters/gobo_boomy": "\u8f70\u8f70",
        "/monsters/brine_marksman": "\u6d77\u76d0\u5c04\u624b",
        "/monsters/captain_fishhook": "\u9c7c\u94a9\u8239\u957f",
        "/monsters/butterjerry": "\u8776\u9f20",
        "/monsters/centaur_archer": "\u534a\u4eba\u9a6c\u5f13\u7bad\u624b",
        "/monsters/chronofrost_sorcerer": "\u971c\u65f6\u5deb\u5e08",
        "/monsters/crystal_colossus": "\u6c34\u6676\u5de8\u50cf",
        "/monsters/demonic_overlord": "\u6076\u9b54\u9738\u4e3b",
        "/monsters/deranged_jester": "\u5c0f\u4e11\u7687",
        "/monsters/dodocamel": "\u6e21\u6e21\u9a7c",
        "/monsters/dusk_revenant": "\u9ec4\u660f\u4ea1\u7075",
        "/monsters/elementalist": "\u5143\u7d20\u6cd5\u5e08",
        "/monsters/enchanted_bishop": "\u79d8\u6cd5\u4e3b\u6559",
        "/monsters/enchanted_king": "\u79d8\u6cd5\u56fd\u738b",
        "/monsters/enchanted_knight": "\u79d8\u6cd5\u9a91\u58eb",
        "/monsters/enchanted_pawn": "\u79d8\u6cd5\u58eb\u5175",
        "/monsters/enchanted_queen": "\u79d8\u6cd5\u738b\u540e",
        "/monsters/enchanted_rook": "\u79d8\u6cd5\u5821\u5792",
        "/monsters/eye": "\u72ec\u773c",
        "/monsters/eyes": "\u53e0\u773c",
        "/monsters/flame_sorcerer": "\u706b\u7130\u5deb\u5e08",
        "/monsters/fly": "\u82cd\u8747",
        "/monsters/frog": "\u9752\u86d9",
        "/monsters/sea_snail": "\u8717\u725b",
        "/monsters/giant_shoebill": "\u9cb8\u5934\u9e73",
        "/monsters/gobo_chieftain": "\u54e5\u5e03\u6797\u914b\u957f",
        "/monsters/granite_golem": "\u82b1\u5c97\u9b54\u50cf",
        "/monsters/griffin": "\u72ee\u9e6b",
        "/monsters/grizzly_bear": "\u68d5\u718a",
        "/monsters/gummy_bear": "\u8f6f\u7cd6\u718a",
        "/monsters/crab": "\u8783\u87f9",
        "/monsters/ice_sorcerer": "\u51b0\u971c\u5deb\u5e08",
        "/monsters/infernal_warlock": "\u5730\u72f1\u672f\u58eb",
        "/monsters/jackalope": "\u9e7f\u89d2\u5154",
        "/monsters/rat": "\u6770\u745e",
        "/monsters/juggler": "\u6742\u800d\u8005",
        "/monsters/jungle_sprite": "\u4e1b\u6797\u7cbe\u7075",
        "/monsters/luna_empress": "\u6708\u795e\u4e4b\u8776",
        "/monsters/magician": "\u9b54\u672f\u5e08",
        "/monsters/magnetic_golem": "\u78c1\u529b\u9b54\u50cf",
        "/monsters/manticore": "\u72ee\u874e\u517d",
        "/monsters/marine_huntress": "\u6d77\u6d0b\u730e\u624b",
        "/monsters/myconid": "\u8611\u83c7\u4eba",
        "/monsters/nom_nom": "\u54ac\u54ac\u9c7c",
        "/monsters/novice_sorcerer": "\u65b0\u624b\u5deb\u5e08",
        "/monsters/panda": "\u718a\u732b",
        "/monsters/polar_bear": "\u5317\u6781\u718a",
        "/monsters/porcupine": "\u8c6a\u732a",
        "/monsters/rabid_rabbit": "\u75af\u9b54\u5154",
        "/monsters/red_panda": "\u5c0f\u718a\u732b",
        "/monsters/alligator": "\u590f\u6d1b\u514b",
        "/monsters/gobo_shooty": "\u54bb\u54bb",
        "/monsters/skunk": "\u81ed\u9f2c",
        "/monsters/gobo_slashy": "\u780d\u780d",
        "/monsters/slimy": "\u53f2\u83b1\u59c6",
        "/monsters/gobo_smashy": "\u9524\u9524",
        "/monsters/soul_hunter": "\u7075\u9b42\u730e\u624b",
        "/monsters/squawker": "\u9e66\u9e49",
        "/monsters/gobo_stabby": "\u523a\u523a",
        "/monsters/stalactite_golem": "\u949f\u4e73\u77f3\u9b54\u50cf",
        "/monsters/swampy": "\u6cbc\u6cfd\u866b",
        "/monsters/the_kraken": "\u514b\u62c9\u80af",
        "/monsters/the_watcher": "\u89c2\u5bdf\u8005",
        "/monsters/snake": "\u86c7",
        "/monsters/tidal_conjuror": "\u6f6e\u6c50\u53ec\u5524\u5e08",
        "/monsters/treant": "\u6811\u4eba",
        "/monsters/turtle": "\u5fcd\u8005\u9f9f",
        "/monsters/vampire": "\u5438\u8840\u9b3c",
        "/monsters/veyes": "\u590d\u773c",
        "/monsters/werewolf": "\u72fc\u4eba",
        "/monsters/zombie": "\u50f5\u5c38",
        "/monsters/zombie_bear": "\u50f5\u5c38\u718a"
    };

    function buildC2EMap(dict, prefixToRemove = "") {
        const map = {};
        for (const [path, zh] of Object.entries(dict)) {
            const en = path.replace(prefixToRemove, "").replace(/_/g, " ");
            map[zh] = en;
        }
        return map;
    }

    // All Mappings
    const skillC2E = buildC2EMap(skillNames, "/skills/");
    const abilityC2E = buildC2EMap(abilityNames, "/abilities/");
    const itemC2E = buildC2EMap(itemNames, "/items/");
    const categoryC2E = buildC2EMap(itemCategoryNames, "/item_categories/");
    const monsterC2E = buildC2EMap(monsterNames, "/monsters/");
    const equipTypeC2E = buildC2EMap(equipmentTypeNames, "/equipment_types/");

    const zhToEnMap = {
        ...itemC2E,
        ...monsterC2E,
        ...equipTypeC2E,
        ...categoryC2E,
        ...abilityC2E,
        ...skillC2E
    };

    console.log('[Translator] loaded known translations:', zhToEnMap);

    function replaceItems(txt) {
        for (let [zh, en] of Object.entries(zhToEnMap))
            if (txt.includes(zh)) txt = txt.split(zh).join(en);
        return txt;
    }

    function getChatText(msg) {
        const full = msg.textContent.trim();
        return full.replace(/^\[\d{1,2}:\d{2}:\d{2} [AP]M\]\s+\S+:\s*/, '');
    }

    // Tooltip element
    const tip = document.createElement('div');
    Object.assign(tip.style, {
        position: 'fixed', padding: '4px 8px', background: 'rgba(0,0,0,0.8)',
        color: '#fff', borderRadius: '4px', pointerEvents: 'none', zIndex: 9999,
        display: 'none', fontSize: '12px', whiteSpace: 'pre'
    });
    document.body.appendChild(tip);
    function showTip(txt, x, y) {
        tip.textContent = txt;
        tip.style.left = x + 12 + 'px';
        tip.style.top = y + 12 + 'px';
        tip.style.display = 'block';
    }
    function hideTip() { tip.style.display = 'none'; }

    function translateText(text, cb) {
        const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=' + encodeURIComponent(text);
        fetch(url)
            .then(res => {
            // console.log('[Translator] Fetch response status:', res.status);
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
            .then(arr => {
            // console.log('[Translator] Response:', arr);  // Debug print the response
            cb(arr[0].map(s => s[0]).join(''));
        })
            .catch(err => {
            // console.error('[Translator] Fetch error:', err);
            cb(null);
        });
    }

    function handleDisplay(text, msg, x, y) {
        if (translationMode === 'tooltip') {
            removeInlineTranslations();
            showTip(text, x, y);
        } else {
            insertInlineTranslation(text, msg);
        }
    }

    function insertInlineTranslation(text, orig) {
        // Prevent double-inserting
        if (orig.querySelector('.translated-message')) return;

        const d = document.createElement('div');
        d.textContent = `(Translated) ${text}`;
        d.className = 'translated-message';
        Object.assign(d.style, {
            marginTop: '4px',
            color: '#90ee90',
            fontSize: '12px',
            fontStyle: 'italic'
        });

        orig.appendChild(d); // <-- insert inside the message div
    }

    function removeInlineTranslations() {
        document.querySelectorAll(`${MSG_SEL} .translated-message`).forEach(e => e.remove());
    }

    // Hover mode
    document.body.addEventListener('mouseover', e => {
        const msg = e.target.closest(MSG_SEL);
        if (!msg || translationMode !== 'tooltip') return;
        const raw = getChatText(msg);
        if (!CHINESE_RE.test(raw)) return;
        if (cache.has(raw)) { handleDisplay(cache.get(raw), msg, e.pageX, e.pageY); return; }
        const pre = replaceItems(raw);
        if (!CHINESE_RE.test(pre)) { cache.set(raw, pre); handleDisplay(pre, msg, e.pageX, e.pageY); return; }
        translateText(pre, tr => {
            if (tr) {
                cache.set(raw, tr);
                handleDisplay(tr, msg, e.pageX, e.pageY);
            }
        });
    });
    document.body.addEventListener('mouseout', e => {
        if (e.target.closest(MSG_SEL)) hideTip();
    });

    // Inline: Initial scan
    function scanExistingMessages() {
        if (translationMode !== 'inline') return;
        Array.from(document.querySelectorAll(MSG_SEL)).reverse().forEach(msg => { // Analyse Backwards
            if (msg.dataset.translated === '1') return;
            const raw = getChatText(msg);
            if (!CHINESE_RE.test(raw)) return;
            msg.dataset.translated = '1';
            if (cache.has(raw)) {
                insertInlineTranslation(cache.get(raw), msg);
            } else {
                const pre = replaceItems(raw);
                translateText(pre, tr => {
                    const out = tr || pre;
                    cache.set(raw, out);
                    insertInlineTranslation(out, msg);
                });
            }
        });
        console.log("[Translator] Scanned existing messages");
    }

    // Inline: MutationObserver for new messages
    const observer = new MutationObserver(mutations => {
        if (translationMode !== 'inline') return;
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;
                const msg = node.matches?.(MSG_SEL) ? node : node.querySelector?.(MSG_SEL);
                // Skip messages with tag transalted
                if (!msg || msg.dataset.translated === '1') continue;
                const raw = getChatText(msg);
                // Skip messages without chinese characters
                if (!CHINESE_RE.test(raw)) continue;
                msg.dataset.translated = '1';
                // Check if message is already in cache
                if (cache.has(raw)) {
                    insertInlineTranslation(cache.get(raw), msg);
                } else {
                    // Translate
                    const pre = replaceItems(raw);
                    translateText(pre, tr => {
                        const out = tr || pre;
                        cache.set(raw, out);
                        insertInlineTranslation(out, msg);
                    });
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Menu & hotkeys
    function initializeTampermonkeyMenu() {
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('🧹 Clear Translation Cache', () => {
                cache.clear(); hideTip(); console.log('[Translator] cache cleared');
            });
            GM_registerMenuCommand('🎛 Toggle Verbose Logging', () => {
                verboseLogging = !verboseLogging;
                console.log(`[Translator] verbose=${verboseLogging}`);
            });
            GM_registerMenuCommand('🖥 Toggle Mode', () => {
                changeMode();
            });
        }
    }

    function changeMode() {
        const was = translationMode;
        translationMode = was === 'inline' ? 'tooltip' : 'inline';
        removeInlineTranslations();
        hideTip();
        console.log(`[Translator] mode → ${translationMode} via F7`);
        document.querySelectorAll(MSG_SEL).forEach(m => m.removeAttribute('data-translated'));
        scanExistingMessages(); // run again when switching to inline
    }

    function setupKeyboardShortcut() {
        document.addEventListener('keydown', e => {
            if (e.key === 'F6') {
                e.preventDefault(); cache.clear(); hideTip();
                console.log('[Translator] cache cleared via F6');
            }
            if (e.key === 'F7') {
                e.preventDefault(); changeMode();
            }
        });
    }

    initializeTampermonkeyMenu();
    setupKeyboardShortcut();
    setTimeout(scanExistingMessages, 1500); // ← delay to catch all visible messages
    console.log('[Translator] ready (universal)');
}
