// ==UserScript==
// @name         IdlePixel+ Teams QoL
// @namespace    com.zlef.idlepixel
// @version      2.1.1
// @description  Various teams quality of life additions, quick deposit/withdraw fight points, better interface when clicking on stored items, storage organisation
// @author       Zlef
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @icon         https://cdn.idle-pixel.com/images/teams_sigil.png
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require      https://update.greasyfork.org/scripts/484046/1307183/IdlePixel%2B%20Custom%20Handling.js
// @downloadURL https://update.greasyfork.org/scripts/498552/IdlePixel%2B%20Teams%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/498552/IdlePixel%2B%20Teams%20QoL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class TeamsQoL extends IdlePixelPlusPlugin {
        constructor() {
            super("teamsqol", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
            });
            this.queue = [];
            this.processingQueue = false;

            this.settings = {
                fight_points_buffer: -10,
                show_fight_points_buttons: true,
                show_energy_buttons: false,
                show_quick_deposit_all_button: false,
                include_equipped_gear_in_quick_deposit: false,
                quick_deposit_visibility: {
                    'quick_deposit_ores': true,
                    'quick_deposit_bars': true,
                    'quick_deposit_seeds': true,
                    'quick_deposit_brewing_ingredients': true,
                    'quick_deposit_logs': true,
                    'quick_deposit_raw': true,
                    'quick_deposit_cooked': true,
                    'quick_deposit_cooking': true,
                    'quick_deposit_combat': true
                },
                quick_deposit_ores: {
                    'stone': true, 'copper': true, 'iron': true, 'silver': true, 'gold': true,
                    'promethium': true, 'titanium': true, 'ancient_ore': true, 'dragon_ore': true,
                    'sapphire': false, 'emerald': false, 'ruby': false, 'diamond': false,
                    'blue_marble_mineral': true, 'amethyst_mineral': true, 'sea_crystal_mineral': true,
                    'dense_marble_mineral': true, 'fluorite_mineral': true, 'clear_marble_mineral': true,
                    'jade_mineral': true, 'lime_quartz_mineral': true, 'opal_mineral': true,
                    'purple_quartz_mineral': true, 'amber_mineral': true, 'smooth_pearl_mineral': true,
                    'sulfer_mineral': true, 'topaz_mineral': true, 'tanzanite_mineral': true,
                    'magnesium_mineral': true, 'frozen_mineral': true, 'blood_crystal_mineral': true
                },
                quick_deposit_bars: {
                    'bronze_bar': true, 'iron_bar': true, 'silver_bar': true, 'gold_bar': true,
                    'promethium_bar': true, 'titanium_bar': true, 'ancient_bar': true, 'dragon_bar': true,
                    'charcoal': false, 'lava': false, 'plasma': false,
                },
                quick_deposit_seeds: {
                    'dotted_green_leaf_seeds': true, 'green_leaf_seeds': true, 'lime_leaf_seeds': true,
                    'gold_leaf_seeds': true, 'crystal_leaf_seeds': true, 'red_mushroom_seeds': true,
                    'stardust_seeds': true, 'tree_seeds': true, 'oak_tree_seeds': true, 'willow_tree_seeds': true,
                    'maple_tree_seeds': true, 'stardust_tree_seeds': true, 'pine_tree_seeds': true,
                    'redwood_tree_seeds': true, 'apple_tree_seeds': true, 'banana_tree_seeds': true,
                    'orange_tree_seeds': true, 'palm_tree_seeds': true, 'dragon_fruit_tree_seeds': true,
                    'lava_tree_seeds': true, 'bone_tree_seeds': true, 'strange_tree_seeds': true,
                    'bones': false, 'big_bones': false, 'ashes': false, 'ice_bones': false, 'blood_bones': false
                },
                quick_deposit_brewing_ingredients: {
                    'dotted_green_leaf': true, 'green_leaf': true, 'lime_leaf': true,
                    'gold_leaf': true, 'crystal_leaf': true, 'red_mushroom': true,
                    'strange_leaf': true, 'stranger_leaf': true, 'strangest_leaf': true
                },
                quick_deposit_logs: {
                    'logs': true, 'oak_logs': true, 'willow_logs': true, 'maple_logs': true,
                    'stardust_logs': true, 'pine_logs': true, 'redwood_logs': true, 'dense_logs': true
                },
                quick_deposit_raw: {
                    'raw_chicken': true, 'raw_bird_meat': true, 'raw_meat': true,
                    'raw_shrimp': true, 'raw_anchovy': true, 'raw_sardine': true, 'raw_crab': true,
                    'raw_piranha': true, 'raw_salmon': true, 'raw_trout': true, 'raw_pike': true,
                    'raw_eel': true, 'raw_rainbow_fish': true, 'raw_tuna': true, 'raw_swordfish': true,
                    'raw_manta_raw': true, 'raw_shark': true, 'raw_whale': true,
                    'raw_small_stardust_fish': true, 'raw_medium_stardust_fish': true, 'raw_large_stardust_fish': true,
                    'raw_angler_fish': true, 'bait': false, 'super_bait': false, 'mega_bait': false, 'seaweed': false
                },
                quick_deposit_cooked: {
                    'cooked_chicken': true, 'cooked_bird_meat': true, 'cooked_meat': true, 'honey': true, 'cheese': true,
                    'cooked_shrimp': true, 'cooked_anchovy': true, 'cooked_sardine': true, 'cooked_crab': true, 'cooked_piranha': true,
                    'cooked_salmon': true, 'cooked_trout': true, 'cooked_pike': true, 'cooked_cooked_eel': true, 'cooked_rainbow_fish': true,
                    'cooked_tuna': true, 'cooked_swordfish': true, 'cooked_manta_raw': true, 'cooked_shark': true, 'cooked_whale': true,
                    'cooked_small_stardust_fish': true, 'cooked_medium_stardust_fish': true, 'cooked_large_stardust_fish': true,
                    'cooked_angler_fish': true
                },
                quick_deposit_cooking: {
                    'egg': true, 'flour': true, 'chocolate': true, 'maggots': true, 'apple': true, 'banana': true,
                    'orange': true, 'maple_syrup': true, 'coconut': true, 'dragon_fruit': true, 'potato': true,
                    'carrot': true, 'beet': true, 'broccoli': true,
                    'dotted_salad': false, 'chocolate_cake': false, 'lime_leaf_salad': false, 'golden_apple': false,
                    'banana_jello': false, 'orange_pie': false, 'pancakes': false, 'coconut_stew': false, 'dragon_fruit_salad': false,
                    'potato_shake': false, 'carrot_shake': false, 'beet_shake': false, 'broccoli_shake': false
                },
                quick_deposit_combat: {
                    "fighting_dust_potion": false, "feathers": true, "fire_feathers": true, "ice_feathers": true, "ancient_feathers": true,
                    "string": true, "poison": true, "ant_needles": true, "molten_glass": true, "lantern": true,
                    "flippers": true,"bone_amulet": true,"ashes_amulet": true,"ice_amulet": true,"blood_amulet": false,"amulet_of_healing_rain": true,
                    "lizard_skin": true, "bat_skin": true, "bear_fur": true, "reaper_silk": true, "crocodile_hide": true, "frozen_crocodile_hide": false,
                    "stinger": true, "iron_dagger": true, "skeleton_sword": true, "club": true, "spiked_club": true, "dense_club": false,
                    "spiked_dense_club": false, "scythe": true, "double_scythe": false, "trident": true, "long_trident": false, "rapier": true,
                    "gold_rapier": false, "skeleton_shield": true, "stinger_dagger": true, "long_spear": true,
                    "long_bow": true, "haunted_bow": true, "balista": false, "toy_slingshot": true,
                    "wooden_arrows": true, "fire_arrows": true, "ice_arrows": true, "ancient_arrows": false,
                    "lizard_mask": true, "lizard_body": true, "lizard_legs": true, "lizard_gloves": true,"lizard_boots": true,
                    "bat_mask": true,"bat_body": true,"bat_legs": true,"bat_gloves": true,"bat_boots": true,
                    "bear_mask": true,"bear_body": true,"bear_legs": true,"bear_gloves": true,"bear_boots": true,
                    "moonstone_mask": true,"moonstone_body": true,"moonstone_legs": true,"moonstone_gloves": true,"moonstone_boots": true,
                    "crocodile_mask": true,"crocodile_body": true,"crocodile_legs": true,"crocodile_gloves": true,"crocodile_boots": true,
                    "frozen_crocodile_mask": true,"frozen_crocodile_body": true,"frozen_crocodile_legs": true,"frozen_crocodile_gloves": true,"frozen_crocodile_boots": true,
                    "dragon_helmet": false,"dragon_body": false,"dragon_legs": false,"dragon_gloves": false,"dragon_boots": false,
                    "undead_staff": false,"undead_hp_staff": false,"undead_mana_staff": false,"undead_defence_staff": false,"undead_full_staff": false
                }
            }
            this.defaultSettings = this.settings

            this.quickDepositIcons = {
                quick_deposit_ores: "https://cdn.idle-pixel.com/images/stone.png",
                quick_deposit_bars: "https://cdn.idle-pixel.com/images/bronze_bar.png",
                quick_deposit_seeds: "https://cdn.idle-pixel.com/images/dotted_green_leaf_seeds.png",
                quick_deposit_brewing_ingredients: "https://cdn.idle-pixel.com/images/dotted_green_leaf.png",
                quick_deposit_logs: "https://cdn.idle-pixel.com/images/logs.png",
                quick_deposit_raw: "https://cdn.idle-pixel.com/images/raw_chicken.png",
                quick_deposit_cooked: "https://cdn.idle-pixel.com/images/cooked_chicken.png",
                quick_deposit_cooking: "https://cdn.idle-pixel.com/images/chefs_hat.png",
                quick_deposit_combat: "https://cdn.idle-pixel.com/images/skeleton_sword.png",
            }

            this.currentPopup = null;

            this.overlay = document.createElement('div');
            this.overlay.id = 'newCardOverlayTeams';
            this.overlay.style.position = 'fixed';
            this.overlay.style.top = '0';
            this.overlay.style.left = '0';
            this.overlay.style.width = '100%';
            this.overlay.style.height = '100%';
            this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            this.overlay.style.zIndex = '1000';
            this.overlay.style.display = 'flex';
            this.overlay.style.justifyContent = 'center';
            this.overlay.style.alignItems = 'center';
            this.overlay.addEventListener('click', (event) => {
                if (event.target === this.overlay) {
                    this.closePopup();
                }
            });

            window.addEventListener('resize', this.adjustPopupPosition.bind(this));

            this.storable_items = {'coins': 'Special', 'stardust': 'Special', 'fight_points': 'Special', 'energy': 'Special', 'criptoe': 'Special', 'donor_coins': 'Special', 'treasure_chest': 'Special', 'green_treasure_chest': 'Special', 'red_treasure_chest': 'Special', 'blue_pickaxe_orb': 'Special', 'blue_hammer_orb': 'Special', 'blue_woodcutting_orb': 'Special', 'blue_oil_storage_orb': 'Special', 'blue_oil_well_orb': 'Special', 'blue_farming_orb': 'Special', 'green_arrow_orb': 'Special', 'green_boat_orb': 'Special', 'green_bone_orb': 'Special', 'green_charcoal_orb': 'Special', 'green_log_orb': 'Special', 'red_farming_orb': 'Special', 'red_woodcutting_orb': 'Special', 'red_combat_orb': 'Special', 'red_oil_factory_orb': 'Special', 'red_stardust_watch_orb': 'Special', 'stone': 'Mining', 'copper': 'Mining', 'iron': 'Mining', 'silver': 'Mining', 'gold': 'Mining', 'promethium': 'Mining', 'titanium': 'Mining', 'ancient_ore': 'Mining', 'dragon_ore': 'Mining', 'moonstone': 'Mining', 'grey_geode': 'Mining', 'blue_geode': 'Mining', 'green_geode': 'Mining', 'red_geode': 'Mining', 'cyan_geode': 'Mining', 'ancient_geode': 'Mining', 'blue_marble_mineral': 'Mining', 'amethyst_mineral': 'Mining', 'sea_crystal_mineral': 'Mining', 'dense_marble_mineral': 'Mining', 'fluorite_mineral': 'Mining', 'clear_marble_mineral': 'Mining', 'jade_mineral': 'Mining', 'lime_quartz_mineral': 'Mining', 'opal_mineral': 'Mining', 'purple_quartz_mineral': 'Mining', 'amber_mineral': 'Mining', 'smooth_pearl_mineral': 'Mining', 'sulfer_mineral': 'Mining', 'topaz_mineral': 'Mining', 'tanzanite_mineral': 'Mining', 'magnesium_mineral': 'Mining', 'frozen_mineral': 'Mining', 'blood_crystal_mineral': 'Mining', 'sapphire': 'Mining', 'emerald': 'Mining', 'ruby': 'Mining', 'diamond': 'Mining', 'gathering_sapphire_fragments': 'Mining', 'gathering_emerald_fragments': 'Mining', 'gathering_ruby_fragments': 'Mining', 'gathering_diamond_fragments': 'Mining', 'bronze_bar': 'Crafting', 'iron_bar': 'Crafting', 'silver_bar': 'Crafting', 'gold_bar': 'Crafting', 'promethium_bar': 'Crafting', 'titanium_bar': 'Crafting', 'ancient_bar': 'Crafting', 'dragon_bar': 'Crafting', 'charcoal': 'Crafting', 'lava': 'Crafting', 'plasma': 'Crafting', 'junk': 'Gathering', 'gathering_loot_bag_mines': 'Gathering', 'gathering_loot_bag_fields': 'Gathering', 'gathering_loot_bag_forest': 'Gathering', 'gathering_loot_bag_fishing_pond': 'Gathering', 'gathering_loot_bag_gem_mine': 'Gathering', 'gathering_loot_bag_kitchen': 'Gathering', 'gathering_loot_bag_castle': 'Gathering', 'bones': 'Farming', 'big_bones': 'Farming', 'ashes': 'Farming', 'ice_bones': 'Farming', 'blood_bones': 'Farming', 'dotted_green_leaf_seeds': 'Farming', 'green_leaf_seeds': 'Farming', 'lime_leaf_seeds': 'Farming', 'gold_leaf_seeds': 'Farming', 'crystal_leaf_seeds': 'Farming', 'red_mushroom_seeds': 'Farming', 'stardust_seeds': 'Farming', 'mega_dotted_green_leaf_seeds': 'Farming', 'mega_green_leaf_seeds': 'Farming', 'mega_lime_leaf_seeds': 'Farming', 'mega_gold_leaf_seeds': 'Farming', 'mega_crystal_leaf_seeds': 'Farming', 'mega_red_mushroom_seeds': 'Farming', 'tree_seeds': 'Farming', 'oak_tree_seeds': 'Farming', 'willow_tree_seeds': 'Farming', 'apple_tree_seeds': 'Farming', 'maple_tree_seeds': 'Farming', 'banana_tree_seeds': 'Farming', 'stardust_tree_seeds': 'Farming', 'orange_tree_seeds': 'Farming', 'pine_tree_seeds': 'Farming', 'redwood_tree_seeds': 'Farming', 'palm_tree_seeds': 'Farming', 'dragon_fruit_tree_seeds': 'Farming', 'bone_tree_seeds': 'Farming', 'lava_tree_seeds': 'Farming', 'strange_tree_seeds': 'Farming', 'potato_seeds': 'Farming', 'carrot_seeds': 'Farming', 'beet_seeds': 'Farming', 'broccoli_seeds': 'Farming', 'dotted_green_leaf': 'Brewing', 'green_leaf': 'Brewing', 'lime_leaf': 'Brewing', 'gold_leaf': 'Brewing', 'crystal_leaf': 'Brewing', 'red_mushroom': 'Brewing', 'strange_leaf': 'Brewing', 'stranger_leaf': 'Brewing', 'strangest_leaf': 'Brewing', 'shooting_star': 'Brewing', 'blue_shooting_star': 'Brewing', 'green_shooting_star': 'Brewing', 'red_shooting_star': 'Brewing', 'seaweed': 'Brewing', 'logs': 'Woodcutting', 'oak_logs': 'Woodcutting', 'willow_logs': 'Woodcutting', 'maple_logs': 'Woodcutting', 'stardust_logs': 'Woodcutting', 'pine_logs': 'Woodcutting', 'redwood_logs': 'Woodcutting', 'dense_logs': 'Woodcutting', 'raw_chicken': 'Raw', 'raw_bird_meat': 'Raw', 'raw_meat': 'Raw', 'raw_shrimp': 'Raw', 'raw_anchovy': 'Raw', 'raw_sardine': 'Raw', 'raw_crab': 'Raw', 'raw_piranha': 'Raw', 'raw_salmon': 'Raw', 'raw_trout': 'Raw', 'raw_pike': 'Raw', 'raw_eel': 'Raw', 'raw_rainbow_fish': 'Raw', 'raw_tuna': 'Raw', 'raw_swordfish': 'Raw', 'raw_manta_ray': 'Raw', 'raw_shark': 'Raw', 'raw_whale': 'Raw', 'raw_small_stardust_fish': 'Raw', 'raw_medium_stardust_fish': 'Raw', 'raw_large_stardust_fish': 'Raw', 'raw_angler_fish': 'Raw', 'cooked_shrimp': 'Food', 'cooked_anchovy': 'Food', 'cooked_sardine': 'Food', 'cooked_crab': 'Food', 'cooked_piranha': 'Food', 'cooked_salmon': 'Food', 'cooked_trout': 'Food', 'cooked_pike': 'Food', 'cooked_eel': 'Food', 'cooked_rainbow_fish': 'Food', 'cooked_tuna': 'Food', 'cooked_swordfish': 'Food', 'cooked_manta_ray': 'Food', 'cooked_shark': 'Food', 'cooked_whale': 'Food', 'cooked_small_stardust_fish': 'Food', 'cooked_medium_stardust_fish': 'Food', 'cooked_large_stardust_fish': 'Food', 'cooked_angler_fish': 'Food', 'cooked_chicken': 'Food', 'cooked_bird_meat': 'Food', 'cooked_meat': 'Food', 'honey': 'Food', 'cheese': 'Food', 'apple': 'Food', 'maple_syrup': 'Food', 'banana': 'Food', 'orange': 'Food', 'maggots': 'Food', 'potato': 'Food', 'carrot': 'Food', 'beet': 'Food', 'broccoli': 'Food', 'coconut': 'Food', 'dragon_fruit': 'Food', 'egg': 'Food', 'chocolate': 'Food', 'dotted_salad': 'Food', 'chocolate_cake': 'Food', 'lime_leaf_salad': 'Food', 'golden_apple': 'Food', 'banana_jello': 'Food', 'orange_pie': 'Food', 'pancakes': 'Food', 'bait': 'Bait', 'super_bait': 'Bait', 'mega_bait': 'Bait', 'string': 'Drops', 'poison': 'Drops', 'ant_needles': 'Drops', 'molten_glass': 'Drops', 'lizard_skin': 'Drops', 'bat_skin': 'Drops', 'bear_fur': 'Drops', 'reaper_silk': 'Drops', 'crocodile_hide': 'Drops', 'frozen_crocodile_hide': 'Drops', 'green_gaurdian_key': 'Drops', 'blue_gaurdian_key': 'Drops', 'purple_gaurdian_key': 'Drops', 'mixed_gaurdian_key': 'Drops', 'feathers': 'Combat', 'fire_feathers': 'Combat', 'ice_feathers': 'Combat', 'ancient_feathers': 'Combat', 'wooden_arrows': 'Combat', 'fire_arrows': 'Combat', 'ice_arrows': 'Combat', 'ancient_arrows': 'Combat', 'stinger': 'Combat', 'iron_dagger': 'Combat', 'skeleton_sword': 'Combat', 'club': 'Combat', 'spiked_club': 'Combat', 'dense_club': 'Combat', 'spiked_dense_club': 'Combat', 'scythe': 'Combat', 'double_scythe': 'Combat', 'rapier': 'Combat', 'gold_rapier': 'Combat', 'stinger_dagger': 'Combat', 'long_spear': 'Combat', 'trident': 'Combat', 'long_trident': 'Combat', 'long_bow': 'Combat', 'toy_slingshot': 'Combat', 'haunted_bow': 'Combat', 'balista': 'Combat', 'skeleton_shield': 'Combat', 'lantern': 'Combat', 'undead_staff': 'Combat', 'undead_hp_staff': 'Combat', 'undead_mana_staff': 'Combat', 'undead_defence_staff': 'Combat', 'undead_full_staff': 'Combat', 'lizard_mask': 'Armour', 'lizard_body': 'Armour', 'lizard_legs': 'Armour', 'lizard_gloves': 'Armour', 'lizard_boots': 'Armour', 'bat_mask': 'Armour', 'bat_body': 'Armour', 'bat_legs': 'Armour', 'bat_gloves': 'Armour', 'bat_boots': 'Armour', 'bear_mask': 'Armour', 'bear_body': 'Armour', 'bear_legs': 'Armour', 'bear_gloves': 'Armour', 'bear_boots': 'Armour', 'moonstone_mask': 'Armour', 'moonstone_body': 'Armour', 'moonstone_legs': 'Armour', 'moonstone_gloves': 'Armour', 'moonstone_boots': 'Armour', 'crocodile_mask': 'Armour', 'crocodile_body': 'Armour', 'crocodile_legs': 'Armour', 'crocodile_gloves': 'Armour', 'crocodile_boots': 'Armour', 'frozen_crocodile_mask': 'Armour', 'frozen_crocodile_body': 'Armour', 'frozen_crocodile_legs': 'Armour', 'frozen_crocodile_gloves': 'Armour', 'frozen_crocodile_boots': 'Armour', 'dragon_helmet': 'Armour', 'dragon_body': 'Armour', 'dragon_legs': 'Armour', 'dragon_gloves': 'Armour', 'dragon_boots': 'Armour', 'flippers': 'Armour', 'bone_amulet': 'Armour', 'ashes_amulet': 'Armour', 'ice_amulet': 'Armour', 'blood_amulet': 'Armour', 'amulet_of_healing_rain': 'Armour', 'stardust_potion': 'Potions', 'energy_potion': 'Potions', 'anti_disease_potion': 'Potions', 'tree_speed_potion': 'Potions', 'smelting_upgrade_potion': 'Potions', 'great_stardust_potion': 'Potions', 'farming_speed_potion': 'Potions', 'rare_monster_potion': 'Potions', 'super_stardust_potion': 'Potions', 'gathering_unique_potion': 'Potions', 'heat_potion': 'Potions', 'bait_potion': 'Potions', 'bone_potion': 'Potions', 'furnace_speed_potion': 'Potions', 'promethium_potion': 'Potions', 'super_rare_monster_potion': 'Potions', 'ultra_stardust_potion': 'Potions', 'cooks_dust_potion': 'Potions', 'fighting_dust_potion': 'Potions', 'tree_dust_potion': 'Potions', 'farm_dust_potion': 'Potions', 'magic_shiny_crystal_ball_potion': 'Potions', 'birdhouse_potion': 'Potions', 'rocket_potion': 'Potions', 'titanium_potion': 'Potions', 'raids_hp_potion': 'Potions', 'blue_orb_potion': 'Potions', 'geode_potion': 'Potions', 'magic_crystal_ball_potion': 'Potions', 'stone_converter_potion': 'Potions', 'rain_potion': 'Potions', 'combat_loot_potion': 'Potions', 'raids_mana_potion': 'Potions', 'gathering_worker_potion': 'Potions', 'rotten_potion': 'Potions', 'merchant_speed_potion': 'Potions', 'ancient_potion': 'Potions', 'green_orb_potion': 'Potions', 'raids_crits_potion': 'Potions', 'guardian_key_potion': 'Potions', 'red_orb_potion': 'Potions'};
            this.storage_sections = ['Special', 'Mining', 'Crafting', 'Gathering', 'Farming', 'Brewing', 'Woodcutting', 'Raw', 'Food', 'Bait', 'Drops', 'Combat', 'Armour', 'Potions', 'Uncategorized'];
            this.initCustomCSS();
        }

        initCustomCSS() {
            const css = `
                .teamsqol-storage-section {
                    border: 1px solid black;
                    background-color: white;
                    padding: 10px 10px 0px 10px;
                    margin-bottom: 10px;
                }
                .teamsqol-storage-section-title {
                    margin-bottom: 10px;
                    margin-left: 2px;
                    font-weight: bold;
                    cursor: pointer;
                }
                .teamsqol-storage-section-content {
                    display: block;
                }
                .teamsqol-storage-section-content.zlefs-hidden {
                    display: none;
                }
            `;
            const style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
        }

        storableAsSections(items) {
            const organized = {};

            for (const [item, type] of Object.entries(items)) {
                if (!organized[type]) {
                    organized[type] = [];
                }
                organized[type].push(item);
            }

            return organized;
        }

        toggleSectionContent(event) {
            const sectionTitle = event.target;
            const sectionContent = sectionTitle.nextElementSibling;
            sectionContent.classList.toggle('zlefs-hidden');
        }

        replaceRefreshTeamStorageData(){
            const self = this;
            Modals.refreshTeamStorageData = function(raw) {
                var dataArray = raw.split("~");
                var itemData = {};
                for (var i = 0; i < dataArray.length; i += 2) {
                    var itemName = dataArray[i];
                    var itemAmount = parseInt(dataArray[i + 1]);
                    if (itemAmount > 0) {
                        itemData[itemName] = itemAmount;
                    }
                }

                var sectionsHtml = {};
                self.storage_sections.forEach(section => {
                    sectionsHtml[section] = `<div class='teamsqol-storage-section' id='section-${section}'><div class='teamsqol-storage-section-title'>${section}</div><div class='teamsqol-storage-section-content'>`;
                });

                const organizedItems = self.storableAsSections(self.storable_items);

                for (const [category, items] of Object.entries(organizedItems)) {
                    items.forEach(itemName => {
                        if (itemData[itemName]) {
                            sectionsHtml[category] += `
                                <div data-item-team-storage='${itemName}' onclick='Modals.clicksTeamStorageItem("${itemName}", ${itemData[itemName]})' class='team-trading-box-entry hover'>
                                    <img src='https://cdn.idle-pixel.com/images/${itemName}.png' />
                                    <span>${format_number(itemData[itemName])}</span>
                                </div>`;
                        }
                    });
                }

                // Handle uncategorized items
                Object.keys(itemData).forEach(itemName => {
                    if (!self.storable_items[itemName]) {
                        sectionsHtml['Uncategorized'] += `
                            <div data-item-team-storage='${itemName}' onclick='Modals.clicksTeamStorageItem("${itemName}", ${itemData[itemName]})' class='team-trading-box-entry hover'>
                                <img src='https://cdn.idle-pixel.com/images/${itemName}.png' />
                                <span>${format_number(itemData[itemName])}</span>
                            </div>`;
                    }
                });

                // Close all section divs and filter out empty sections
                var html = '';
                self.storage_sections.forEach(section => {
                    sectionsHtml[section] += '</div></div>';
                    if (sectionsHtml[section].includes('data-item-team-storage')) {
                        html += sectionsHtml[section];
                    }
                });

                document.getElementById("team-storage-box-content").innerHTML = html;

                // Add event listeners for toggling visibility
                const sectionTitles = document.querySelectorAll('.teamsqol-storage-section-title');
                sectionTitles.forEach(title => {
                    title.addEventListener('click', self.toggleSectionContent);
                });
            };
        }


        onMessageReceived(message) {
            if(message.startsWith("TEAMS_STORAGE_DATA")){
                this.parseStorage(message.split("=")[1])
            }
        }

        parseStorage(storage_string){
            this.team_storage = {}
            const data_array = storage_string.split("~")
            for (let i = 0; i<data_array.length - 1; i+=2) {
                this.team_storage[data_array[i]] = data_array[i+1]
            }
        }

        onLogin() {
            this.teamStorageTopBar();
            this.replaceItemClickModal();
            this.loadSettings();
            this.applySettings();
            this.replaceRefreshTeamStorageData();

            // Add scrollbar to storage log until Smitty fixes
            const storeLog = document.getElementById("team-stoage-logger-context");
            storeLog.style.maxHeight = "150px";
            storeLog.style.overflowY = "auto";

            let autoScroll = true;
            let userScrolled = false;
            let reenableAutoScrollTimeout = null;

            function teamLogScroll() {
                if (autoScroll && !userScrolled) {
                    storeLog.scrollTop = storeLog.scrollHeight;
                }
            }

            storeLog.addEventListener('scroll', () => {
                if (storeLog.scrollTop + storeLog.clientHeight >= storeLog.scrollHeight) {
                    userScrolled = false;
                    autoScroll = true;
                    clearTimeout(reenableAutoScrollTimeout);
                } else {
                    userScrolled = true;
                    autoScroll = false;
                    clearTimeout(reenableAutoScrollTimeout);
                    reenableAutoScrollTimeout = setTimeout(() => {
                        userScrolled = false;
                        autoScroll = true;
                    }, 5000);
                }
            });

            const observer = new MutationObserver(() => {
                if (autoScroll && !userScrolled) {
                    teamLogScroll();
                } else if (!userScrolled) {
                    // When user scrolls manually, autoscroll will be disabled for the next 5 seconds
                    setTimeout(teamLogScroll, 5000);
                }
            });
            observer.observe(storeLog, { childList: true });
        }


        replaceItemClickModal(){
            const self = this;
            Modals.clicksTeamStorageItem = function(item_var, amount) {
                const player_amount = window[`var_${item_var}`] || 0;
                self.newWithdrawPopup(item_var, amount, player_amount);

            };
        }

        loadSettings() {
            const user = window.var_username;
            const savedSettings = localStorage.getItem(`${user}_teamsqol_settings`);
            let needsSave = false;

            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);

                needsSave = this.updateQuickDepositSettings(parsedSettings) || needsSave;

                const updateSettings = (defaultSettings, userSettings) => {
                    const mergedSettings = {};
                    for (const key in defaultSettings) {
                        if (typeof defaultSettings[key] === 'object' && defaultSettings[key] !== null) {
                            if (!userSettings[key] || typeof userSettings[key] !== 'object') {
                                userSettings[key] = {};
                                needsSave = true;
                            }
                            mergedSettings[key] = updateSettings(defaultSettings[key], userSettings[key]);
                        } else {
                            if (userSettings[key] === undefined) {
                                userSettings[key] = defaultSettings[key];
                                needsSave = true;
                            }
                            mergedSettings[key] = userSettings[key];
                        }
                    }

                    for (const key in userSettings) {
                        if (!defaultSettings.hasOwnProperty(key)) {
                            delete userSettings[key];
                            needsSave = true;
                            console.log(`Removing obsolete setting: ${key}`);
                        }
                    }
                    return mergedSettings;
                };

                this.settings = updateSettings(this.settings, parsedSettings);

                if (needsSave) {
                    this.saveSettings();
                }
            }
        }

        updateQuickDepositSettings(parsedSettings) {
            const quickDepositKeys = Object.keys(this.settings).filter(key => key.startsWith('quick_deposit'));
            let needsSave = false;

            quickDepositKeys.forEach(key => {
                const defaultQuickDepositSettings = this.settings[key];
                const userQuickDepositSettings = parsedSettings[key] || {};

                for (const item in defaultQuickDepositSettings) {
                    if (userQuickDepositSettings[item] === undefined) {
                        userQuickDepositSettings[item] = defaultQuickDepositSettings[item];
                        needsSave = true;
                    }
                }

                for (const item in userQuickDepositSettings) {
                    if (!defaultQuickDepositSettings.hasOwnProperty(item)) {
                        delete userQuickDepositSettings[item];
                        needsSave = true;
                    }
                }

                parsedSettings[key] = userQuickDepositSettings;
            });

            return needsSave;
        }

        saveSettings() {
            const user = window.var_username;
            const saveSettingsOrdered = (defaultSettings, userSettings) => {
                const orderedSettings = {};
                for (const key in defaultSettings) {
                    if (typeof defaultSettings[key] === 'object' && defaultSettings[key] !== null) {
                        orderedSettings[key] = saveSettingsOrdered(defaultSettings[key], userSettings[key]);
                    } else {
                        orderedSettings[key] = userSettings[key];
                    }
                }
                return orderedSettings;
            };

            const orderedSettings = saveSettingsOrdered(this.settings, this.settings);
            localStorage.setItem(`${user}_teamsqol_settings`, JSON.stringify(orderedSettings));
            this.applySettings();
        }

        resetSettings() {
            const user = window.var_username;
            localStorage.setItem(`${user}_teamsqol_settings`, JSON.stringify(this.defaultSettings));
            this.loadSettings();
            this.applySettings();
        }

        applySettings() {
            const buttonMapping = {
                show_fight_points_buttons: 'fpQuickButtons',
                show_energy_buttons: 'energyQuickButtons',
                show_quick_deposit_all_button: 'quickDepositAllButton',
            };

            for (const [setting, buttonId] of Object.entries(buttonMapping)) {
                const buttonElement = document.getElementById(buttonId);
                if (buttonElement) {
                    buttonElement.style.display = this.settings[setting] ? 'flex' : 'none';
                }
            }

            let anyTrue = false;

            for (const category in this.settings.quick_deposit_visibility) {
                const button = document.getElementById(category);
                if (button) {
                    button.style.display = this.settings.quick_deposit_visibility[category] ? 'block' : 'none';
                }

                if (this.settings.quick_deposit_visibility[category]) {
                    anyTrue = true;
                }
            }

            const quickDepositButtons = document.getElementById('quickDepositButtons');
            if (quickDepositButtons) {
                quickDepositButtons.style.display = anyTrue ? 'flex' : 'none';
            }
        }

        teamsSettingPopup() {
            const settingsPopupStyles = `
            <style>
                #teamqol-settingsPopup {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                    max-width: 440px;
                    margin: 0 auto;
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                    padding: 20px;
                    box-sizing: border-box;
                    position: relative;
                    overflow-y: auto;
                    max-height: 75vh;
                }
                #teamqol-settingsPopup .teamqol-settings-row {
                    display: flex;
                    width: 100%;
                    margin-bottom: 10px;
                    flex-wrap: wrap;
                }
                #teamqol-settingsPopup .teamqol-settings-col {
                    flex: 1;
                    box-sizing: border-box;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                #teamqol-settingsPopup .teamqol-settings-button-container {
                    display: flex;
                    justify-content: center;
                    width: 100%;
                }
                #teamqol-settingsPopup button {
                    padding: 10px 20px;
                    cursor: pointer;
                    margin-top: 10px;
                }
                #teamqol-settingsPopup .teamqol-close-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    font-size: 10px;
                    cursor: pointer;
                    padding: 5px;
                }
                #teamqol-settingsPopup .teamqol-section-title {
                    width: 100%;
                    text-align: left;
                    font-weight: bold;
                    cursor: pointer;
                }
                #teamqol-settingsPopup .teamqol-setting-item {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 5px;
                }
                .teamqol-settings-section {
                    border:1px solid black;
                    background-color: white;
                    padding: 10px 10px;
                    width:400px;
                    margin-top: 10px;
                }
                .teamqol-hidden {
                    display: none;
                }
            </style>
        `;

            document.head.insertAdjacentHTML('beforeend', settingsPopupStyles);

            const popupBox = document.createElement('div');
            popupBox.id = 'teamqol-settingsPopup';

            const titleDiv = document.createElement('div');
            titleDiv.className = "teamqol-settings-row";
            popupBox.appendChild(titleDiv);

            const title = document.createElement('h5');
            title.textContent = 'Settings';
            title.className = "modal-title";
            title.style.textAlign = 'center';
            titleDiv.appendChild(title);

            const closeButton = document.createElement('button');
            closeButton.textContent = '✖';
            closeButton.className = 'teamqol-close-button';
            closeButton.type = 'button';
            popupBox.appendChild(closeButton);

            const settingsContent = document.createElement('div');
            settingsContent.className = 'teamqol-settings-row';
            popupBox.appendChild(settingsContent);

            // Generate settings inputs
            for (const setting in this.settings) {
                if (typeof this.settings[setting] === 'object' && this.settings[setting] !== null) {
                    const sectionDiv = document.createElement('div');
                    sectionDiv.className = 'teamqol-settings-section';

                    const sectionTitle = document.createElement('div');
                    sectionTitle.textContent = setting.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
                    sectionTitle.className = 'teamqol-section-title';
                    sectionDiv.appendChild(sectionTitle);

                    const sectionContent = document.createElement('div');
                    sectionContent.className = 'teamqol-section-content teamqol-hidden';

                    for (const item in this.settings[setting]) {
                        const settingItemDiv = document.createElement('div');
                        settingItemDiv.className = 'teamqol-setting-item';

                        const settingLabel = document.createElement('label');
                        settingLabel.textContent = item.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
                        settingLabel.style.cursor = 'pointer'; // Add this line
                        settingItemDiv.appendChild(settingLabel);

                        const settingInput = document.createElement('input');
                        settingInput.type = 'checkbox';
                        settingInput.checked = this.settings[setting][item];
                        settingItemDiv.appendChild(settingInput);

                        settingLabel.addEventListener('click', () => {
                            settingInput.checked = !settingInput.checked;
                            this.settings[setting][item] = settingInput.checked;
                            this.saveSettings();
                            this.applySettings();
                        });

                        settingInput.addEventListener('change', () => {
                            this.settings[setting][item] = settingInput.checked;
                            this.saveSettings();
                            this.applySettings();
                        });

                        sectionContent.appendChild(settingItemDiv);
                    }

                    sectionDiv.appendChild(sectionContent);

                    sectionTitle.addEventListener('click', () => {
                        sectionContent.classList.toggle('teamqol-hidden');
                    });

                    settingsContent.appendChild(sectionDiv);
                } else {
                    const settingItemDiv = document.createElement('div');
                    settingItemDiv.className = 'teamqol-setting-item';

                    const settingLabel = document.createElement('label');
                    settingLabel.textContent = setting.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
                    settingLabel.style.cursor = 'pointer'; // Add this line
                    settingItemDiv.appendChild(settingLabel);

                    const settingInput = document.createElement('input');
                    settingInput.type = typeof this.settings[setting] === 'boolean' ? 'checkbox' : 'number';
                    if (typeof this.settings[setting] === 'boolean') {
                        settingInput.checked = this.settings[setting];
                    } else {
                        settingInput.value = this.settings[setting];
                    }
                    if (typeof this.settings[setting] === 'number'){
                        settingInput.max = 0;
                    }
                    settingItemDiv.appendChild(settingInput);

                    settingLabel.addEventListener('click', () => {
                        if (settingInput.type === 'checkbox') {
                            settingInput.checked = !settingInput.checked;
                            this.settings[setting] = settingInput.checked;
                        } else {
                            settingInput.focus();
                        }
                        this.saveSettings();
                    });

                    settingInput.addEventListener('change', () => {
                        if (settingInput.type === 'checkbox') {
                            this.settings[setting] = settingInput.checked;
                        } else {
                            this.settings[setting] = settingInput.value;
                        }
                        this.saveSettings();
                    });

                    settingsContent.appendChild(settingItemDiv);
                }
            }

            const actions = [
                {
                    button: closeButton,
                    handler: () => {
                        this.closePopup();
                    },
                    closeOnAction: true
                }
            ];

            this.launchPopup(popupBox, actions);
        }

        newWithdrawPopup(item_var, amount, player_amount) {
            const teamsPopupStyles = `
				<style>
					#teamsPopup {
						display: flex;
						flex-direction: column;
						align-items: center;
						width: 100%;
						max-width: 500px;
						margin: 0 auto;
						background-color: #fff;
						border-radius: 8px;
						box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
						padding: 20px;
						box-sizing: border-box;
						position: relative;
					}
					#teamsPopup .teamsPopup-row {
						display: flex;
						width: 100%;
						margin-bottom: 10px;
					}
					#teamsPopup .teamsPopup-col {
						flex: 1;
						box-sizing: border-box;
						padding: 10px;
						display: flex;
						flex-direction: column;
						align-items: center;
					}
					#teamsPopup .teamsPopup-deposit-container,
					#teamsPopup .teamsPopup-withdraw-container {
						display: flex;
						flex-direction: column;
						align-items: center;
					}
					#teamsPopup .teamsPopup-button-container {
						display: flex;
						justify-content: center;
						width: 100%;
					}
					#teamsPopup button {
						padding: 10px 20px;
						cursor: pointer;
						margin-top: 10px;
					}
					#teamsPopup .deposit-button {
						background-color: red;
						color: white;
					}
					#teamsPopup .withdraw-button {
						background-color: green;
						color: white;
					}
					#teamsPopup input {
						margin: 10px 0;
					}
					#teamsPopup .vertical-divider {
						width: 1px;
						background-color: #ccc;
						margin: 0 20px;
					}
					#teamsPopup .close-button {
						position: absolute;
						top: 10px;
						right: 10px;
						background: none;
						border: none;
						font-size: 10x;
						cursor: pointer;
						padding: 5px;
					}
				</style>
			`;

            document.head.insertAdjacentHTML('beforeend', teamsPopupStyles);

            const popupBox = document.createElement('div');
            popupBox.id = 'teamsPopup';

            const titleDiv = document.createElement('div');
            titleDiv.className = "teamsPopup-row";
            popupBox.appendChild(titleDiv);

            const title = document.createElement('h5');
            title.textContent = item_var.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
            title.className = "modal-title";
            title.style.textAlign = 'center';
            titleDiv.appendChild(title);

            const closeButton = document.createElement('button');
            closeButton.textContent = '✖';
            closeButton.className = 'close-button';
            closeButton.type = 'button';
            popupBox.appendChild(closeButton);

            const rowDiv = document.createElement('div');
            rowDiv.className = 'teamsPopup-row';
            popupBox.appendChild(rowDiv);

            const depositColDiv = document.createElement('div');
            depositColDiv.className = 'teamsPopup-col teamsPopup-deposit-container';
            rowDiv.appendChild(depositColDiv);

            const divider = document.createElement('div');
            divider.className = 'vertical-divider';
            rowDiv.appendChild(divider);

            const withdrawColDiv = document.createElement('div');
            withdrawColDiv.className = 'teamsPopup-col teamsPopup-withdraw-container';
            rowDiv.appendChild(withdrawColDiv);

            const depositLabel = document.createElement('label');
            depositLabel.textContent = 'Deposit Amount';
            depositColDiv.appendChild(depositLabel);

            const depositInput = document.createElement('input');
            depositInput.type = 'number';
            depositInput.max = player_amount;
            depositInput.min = 0;
            depositInput.className = 'storage-control';
            depositInput.id = 'depositAmount';
            depositInput.value = player_amount;
            depositColDiv.appendChild(depositInput);

            const depositButton = document.createElement('button');
            depositButton.textContent = 'DEPOSIT';
            depositButton.className = 'btn btn-secondary deposit-button';
            depositColDiv.appendChild(depositButton);

            const withdrawLabel = document.createElement('label');
            withdrawLabel.textContent = 'Withdraw Amount';
            withdrawColDiv.appendChild(withdrawLabel);

            let withdraw_amount = amount;
            if (item_var == "fight_points"){
                const fight_points = window.var_fight_points || 0;
                const max_fight_points = window.var_max_fight_points || 0;
                withdraw_amount = Math.max(0, (max_fight_points - fight_points) - 10);

            }

            const withdrawInput = document.createElement('input');
            withdrawInput.type = 'number';
            withdrawInput.max = amount;
            withdrawInput.min = 0;
            withdrawInput.className = 'storage-control';
            withdrawInput.id = 'withdrawAmount';
            withdrawInput.value = withdraw_amount;
            withdrawColDiv.appendChild(withdrawInput);

            const withdrawButton = document.createElement('button');
            withdrawButton.textContent = 'WITHDRAW';
            withdrawButton.className = 'btn btn-secondary withdraw-button';
            withdrawColDiv.appendChild(withdrawButton);

            const actions = [
                {
                    button: depositButton,
                    handler: () => {
                        // console.log("Pressed deposit button");
                        const store_amount = depositInput.value;
                        websocket.send(`TEAM_STORE_ITEM=${item_var}~${store_amount}`);
                    }
                },
                {
                    button: withdrawButton,
                    handler: () => {
                        // console.log("Pressed withdraw button");
                        let take_amount = withdrawInput.value;
                        websocket.send(`TEAM_TAKE_ITEM=${item_var}~${take_amount}`);
                    }
                },
                {
                    button: closeButton,
                    handler: () => {
                        this.closePopup();
                    },
                    closeOnAction: true
                }
            ];

            this.launchPopup(popupBox, actions);
        }

        launchPopup(popup, actions) {
            if (this.currentPopup) {
                if (this.overlay.contains(this.currentPopup)) {
                    this.overlay.removeChild(this.currentPopup);
                }
                this.currentPopup = null;
            }

            this.currentPopup = popup;

            this.overlay.appendChild(popup);
            document.body.appendChild(this.overlay);

            this.adjustPopupPosition();

            actions.forEach(action => {
                const button = action.button;
                button.addEventListener('click', () => {
                    action.handler();
                    if (action.closeOnAction !== false) {
                        this.closePopup();
                    }
                });
            });
        }

        adjustPopupPosition() {
            if (!this.currentPopup) return;

            const viewportHeight = window.innerHeight;
            const popupHeight = this.currentPopup.offsetHeight;
            const scrollOffset = window.pageYOffset || document.documentElement.scrollTop;
            const topPosition = (viewportHeight - popupHeight) / 2 + scrollOffset;
            this.currentPopup.style.position = 'absolute';
            this.currentPopup.style.top = `${topPosition > 0 ? topPosition : 0}px`;
        }

        closePopup() {
            if (this.currentPopup && this.overlay.contains(this.currentPopup)) {
                this.overlay.removeChild(this.currentPopup);
                this.currentPopup = null;
            }
            if (document.body.contains(this.overlay)) {
                document.body.removeChild(this.overlay);
            }
        }

        teamStorageTopBar(){
            const teamTradingBox = document.querySelector('.team-trading-box');

            const container = document.createElement('div');
            container.className = 'container';

            const row1 = document.createElement('div');
            row1.className = 'row';
            row1.style.marginBottom = '5px';

            // Column 1 - "Team Storage" & "Add items"
            const col1 = document.createElement('div');
            col1.className = 'col';
            col1.style.flex = "0 0 auto";
            col1.style.width = "auto";
            col1.innerHTML = `
                <div class="font-large" style="color: rgb(175, 131, 14);">Team Storage</div>
                <div><u id="add-item-teams-label" onclick="Modals.clicksAddItemTeamStorage()" class="color-grey hover" style="color: rgb(56, 41, 241);">Add Item</u></div>
                <div id="remember-storage-take-div" class="color-grey hover" style="float: right; color: rgb(56, 41, 241);" onclick="Modals.clicksRememberTakeFromStore()"></div>
            `;

            // Column 2 - Everything plugin related
            const col2 = document.createElement('div');
            col2.className = 'col';
            col2.style.display = "flex";
            col2.style.alignItems = "center";
            col2.style.marginLeft = "10px";

            this.quickButtons(col2);

            // Column 3 - Search bar and settings button
            const col3 = document.createElement('div');
            col3.className = 'col';
            col3.style.maxWidth = "150px";
            col3.style.minWidth = "150px";
            col3.style.display = "flex";
            col3.style.flexDirection = "column";
            col3.style.alignItems = "flex-end";

            // Settings button
            const settingsButton = document.createElement('button');
            settingsButton.textContent = 'Teams QoL Settings';
            settingsButton.style.border = 'none';
            settingsButton.style.background = 'none';
            settingsButton.style.cursor = 'pointer';
            settingsButton.style.padding = '0';
            settingsButton.style.width = '150px';
            settingsButton.style.height = '30px';
            settingsButton.style.alignSelf = 'flex-end';

            settingsButton.addEventListener('click', () => this.teamsSettingPopup());
            col3.appendChild(settingsButton);

            // Search bar
            const searchBar = document.createElement('input');
            searchBar.type = "text";
            searchBar.onkeyup = function() { Modals.searchTeamStorageKeyPress(this) };
            searchBar.style.maxWidth = "150px";
            searchBar.style.maxHeight = "28px";
            searchBar.style.marginTop = '10px'; // Adds some space between the button and search bar
            searchBar.placeholder = "Search Storage";

            col3.appendChild(searchBar);


            row1.appendChild(col1);
            row1.appendChild(col2);
            row1.appendChild(col3);

            container.appendChild(row1);

            const row2 = document.createElement('div');
            row2.className = 'row';

            const teamStorageBoxContent = document.getElementById('team-storage-box-content');
            if (teamStorageBoxContent) {
                row2.appendChild(teamStorageBoxContent);
            }

            container.appendChild(row2);

            teamTradingBox.innerHTML = '';
            teamTradingBox.appendChild(container);
        }

        quickButtons(col2) {
            // FP Buttons
            const fpButtonContainer = document.createElement('div');
            fpButtonContainer.style.display = 'flex';
            fpButtonContainer.style.alignItems = 'center';
            fpButtonContainer.id = 'fpQuickButtons'

            const fpUrl = "https://cdn.idle-pixel.com/images/fight_points.png";
            const withdrawFPButton = this.createLargeButton('Withdraw fight points', fpUrl, 'green', () => this.withdrawFightPoints());
            const depositFPButton = this.createLargeButton('Deposit fight points', fpUrl, 'red', () => this.depositFightPoints(), true);

            fpButtonContainer.appendChild(depositFPButton);
            fpButtonContainer.appendChild(withdrawFPButton);
            col2.appendChild(fpButtonContainer);

            // Energy Buttons
            const energyButtonContainer = document.createElement('div');
            energyButtonContainer.style.display = 'flex';
            energyButtonContainer.style.alignItems = 'center';
            energyButtonContainer.id = 'energyQuickButtons'

            const energyUrl = "https://cdn.idle-pixel.com/images/energy.png";
            const withdrawEnergyButton = this.createLargeButton('Withdraw energy points', energyUrl, 'green', () => this.withdrawEnergy());
            const depositEnergyButton = this.createLargeButton('Deposit energy points', energyUrl, 'red', () => this.depositEnergy(), true);

            energyButtonContainer.appendChild(depositEnergyButton);
            energyButtonContainer.appendChild(withdrawEnergyButton);
            col2.appendChild(energyButtonContainer);

            // Quick Deposit All Button
            const quickDepositButtonContainer = document.createElement('div');
            quickDepositButtonContainer.style.display = 'flex';
            quickDepositButtonContainer.style.alignItems = 'center';
            quickDepositButtonContainer.id = 'quickDepositAllButtonContainer';

            const quickDepositUrl = "https://cdn.idle-pixel.com/images/treasure_chest.png";
            const quickDepositAllButton = this.createLargeButton('Quick Deposit All', quickDepositUrl, 'red', () => this.quickDepositAll(), true);
            quickDepositAllButton.id = 'quickDepositAllButton';

            quickDepositButtonContainer.appendChild(quickDepositAllButton);
            col2.appendChild(quickDepositButtonContainer);

            // Quick Deposit Buttons
            const quickDepositContainer = document.createElement('div');
            quickDepositContainer.style.display = 'flex';
            quickDepositContainer.style.flexDirection = 'column';
            quickDepositContainer.style.alignItems = 'center';
            quickDepositContainer.style.marginLeft = '10px';
            quickDepositContainer.style.paddingBottom = '10px';
            quickDepositContainer.style.alignItems = 'flex-start';
            quickDepositContainer.id = "quickDepositButtons";

            const quickDepositTitle = document.createElement('div');
            quickDepositTitle.textContent = 'Quick Deposit';
            quickDepositTitle.style.marginBottom = '5px';
            quickDepositTitle.style.textAlign = 'left';
            quickDepositContainer.appendChild(quickDepositTitle);

            const quickDepositIconsContainer = document.createElement('div');
            quickDepositIconsContainer.style.display = 'flex';
            quickDepositIconsContainer.style.flexWrap = 'wrap';
            quickDepositIconsContainer.style.gap = '5px';

            for (const [category, iconUrl] of Object.entries(this.quickDepositIcons)) {
                const iconButton = this.createQuickDepositButton(category, iconUrl);
                quickDepositIconsContainer.appendChild(iconButton);
            }

            quickDepositContainer.appendChild(quickDepositIconsContainer);
            col2.appendChild(quickDepositContainer);
        }


        createLargeButton(altText, image_url, arrowColor, clickHandler, isDeposit = false) {
            const button = document.createElement("button");
            button.alt = altText;
            button.style.border = "none";
            button.style.background = "none";
            button.style.cursor = "pointer";
            button.style.position = "relative";
            button.style.marginRight = isDeposit ? '5px' : '0';
            button.title = altText;
            // Giving up on trying to display alt text on buttons, image takes over like a prick
            const img = document.createElement("img");
            img.src = image_url;
            img.style.width = "50px";
            img.style.height = "50px";

            const arrow = document.createElement("div");
            arrow.innerHTML = this.svgArrow(arrowColor, 30, isDeposit ? "down" : "up");
            arrow.style.position = "absolute";
            arrow.style.bottom = "0";
            arrow.style.right = "0";
            arrow.title = altText;

            button.appendChild(img);
            button.appendChild(arrow);
            button.addEventListener("click", clickHandler);

            return button;
        }

        createQuickDepositButton(category, iconUrl) {
            const button = document.createElement("button");
            button.alt = `Quick deposit ${category}`;
            button.style.border = "none";
            button.style.background = "none";
            button.style.cursor = "pointer";
            button.style.position = "relative";
            button.id = category;

            if (!this.settings.quick_deposit_visibility[category]) {
                button.style.display = 'none';
            }

            let imgWidth = "30px";
            let imgHeight = "30px";

            if (category == "quick_deposit_cooking"){
                imgWidth = "22px";
                imgHeight = "22px";
            }

            const img = document.createElement("img");
            img.src = iconUrl;
            img.style.width = imgWidth;
            img.style.height = imgHeight;

            const arrow = document.createElement("div");
            arrow.innerHTML = this.svgArrow("red", 20, "down");
            arrow.style.position = "absolute";
            arrow.style.bottom = "0";
            arrow.style.right = "0";

            button.appendChild(img);
            button.appendChild(arrow);
            button.addEventListener("click", () => this.quickDeposit(category));

            return button;
        }

        quickDeposit(category) {
            const items = this.settings[category];
            let bulkStoreString = '';
            if (category == "quick_deposit_combat" && this.settings.include_equipped_gear_in_quick_deposit){
                websocket.send("UNEQUIP_ALL");
            }

            for (const item in items) {
                if (items[item]) {
                    const amount = window[`var_${item}`] || 0;
                    if (amount > 0) {
                        bulkStoreString += `${item}~${amount}~`;
                    }
                }
            }

            if (bulkStoreString) {
                this.queue.push(bulkStoreString.slice(0, -1)); // Remove trailing '~' and add to queue
                this.processQueue();
            }
        }

        processQueue() {
            if (this.processingQueue) return;

            const processNext = () => {
                if (this.queue.length === 0) {
                    this.processingQueue = false;
                    return;
                }

                this.processingQueue = true;
                const bulkStoreString = this.queue.shift();
                websocket.send(`TEAM_BULK_STORE_ITEMS=${bulkStoreString}`);
                // console.log(`TEAM_BULK_STORE_ITEMS=${bulkStoreString}`);

                // Minimum delay of 200ms
                setTimeout(() => {
                    processNext();
                }, 200);
            };

            processNext();
        }

        quickDepositAll() {
            const button = document.getElementById('quickDepositAllButton');
            button.disabled = true;
            setTimeout(() => {
                button.disabled = false;
            }, 2000);

            let bulkStoreString = '';
            const categories = Object.keys(this.settings.quick_deposit_visibility);
            for (const category of categories) {
                const items = this.settings[category];
                for (const item in items) {
                    if (items[item]) {
                        const amount = window[`var_${item}`] || 0;
                        if (amount > 0) {
                            bulkStoreString += `${item}~${amount}~`;
                        }
                    }
                }
            }

            if (bulkStoreString) {
                websocket.send(`TEAM_BULK_STORE_ITEMS=${bulkStoreString.slice(0, -1)}`);
                // console.log(`TEAM_BULK_STORE_ITEMS=${bulkStoreString.slice(0, -1)}`);
            }
        }


        withdrawFightPoints() {
            const fight_points = window.var_fight_points || 0;
            const max_fight_points = window.var_max_fight_points || 0;
            const fight_points_needed = Math.max(0, (max_fight_points - fight_points) - Math.abs(this.settings.fight_points_buffer));
            if (this.team_storage.fight_points >= fight_points_needed){
                // console.log(`TEAM_TAKE_ITEM=fight_points~${fight_points_needed}`)
                websocket.send(`TEAM_TAKE_ITEM=fight_points~${fight_points_needed}`);
            } else if (this.team_storage.fight_points > 0){
                // console.log(`TEAM_TAKE_ITEM=fight_points~${this.team_storage.fight_points}`)
                websocket.send(`TEAM_TAKE_ITEM=fight_points~${this.team_storage.fight_points}`);
            }
        }

        depositFightPoints() {
            const fight_points = window.var_fight_points || 0;
            websocket.send(`TEAM_STORE_ITEM=fight_points~${fight_points}`);
        }

        withdrawEnergy() {
            websocket.send(`TEAM_TAKE_ITEM=energy~${this.team_storage.energy}`);
        }

        depositEnergy() {
            const energy = window.var_energy || 0;
            websocket.send(`TEAM_STORE_ITEM=energy~${energy}`);
        }

        svgArrow(color, size, direction = "up") {
            let rotation;
            switch (direction) {
                case "up":
                case 0:
                    rotation = 0;
                    break;
                case "down":
                case 180:
                    rotation = 180;
                    break;
                case "left":
                case 270:
                    rotation = 270;
                    break;
                case "right":
                case 90:
                    rotation = 90;
                    break;
                default:
                    rotation = parseInt(direction) || 0;
            }

            return `
            <svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="${color}" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${rotation}deg);">
                <path d="M14.13 9.11h-12l6-7 6 7z"/>
                <path d="M6.12 8h4v6h-4z" fill="${color}"/>
            </svg>`;
        }

    }

    const plugin = new TeamsQoL();
    IdlePixelPlus.registerPlugin(plugin);

})();
