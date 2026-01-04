// ==UserScript==
// @name         IdlePixel Lucky
// @namespace    com.missnobody.idlepixel.lucky
// @version      1.3.12
// @description  Calculates how lucky you are with your drops.
// @author       MissNobody
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @downloadURL https://update.greasyfork.org/scripts/471508/IdlePixel%20Lucky.user.js
// @updateURL https://update.greasyfork.org/scripts/471508/IdlePixel%20Lucky.meta.js
// ==/UserScript==

(function()
{
    'use strict';

    let loaded = false;
    let hooked = false;
    
    const LOOT = 
    {
        "Chicken": [ "var_chicken_kills", 
            [ "Bones", "var_chicken_bones", 1, 1, 1 ],
            [ "Raw chicken", "var_chicken_raw_chicken", 1, 1, 1 ],
            [ "Feathers", "var_chicken_feathers", 5, 15, 1 ],
            [ "Dotted green leaf", "var_chicken_dotted_green_leaf", 1, 1, 3 ],
            [ "Green leaf", "var_chicken_green_leaf", 1, 1, 10 ],
            [ "Lime leaf", "var_chicken_lime_leaf", 1, 1, 25 ],
            [ "Gold leaf", "var_chicken_gold_leaf", 1, 1, 96 ],
            [ "Chicken sigil", "var_chicken_sigil", 1, 1, 1000 ],
        ],
        
        "Rat": [ "var_rat_kills",
            [ "Bones", "var_rat_bones", 1, 1, 1 ],
            [ "Cheese", "var_rat_cheese", 1, 1, 2 ],
            [ "Dotted green leaf", "var_rat_dotted_green_leaf", 1, 1, 3 ],
            [ "Green leaf", "var_rat_green_leaf", 1, 1, 10 ],
            [ "Lime leaf", "var_rat_lime_leaf", 1, 1, 25 ],
            [ "Gold leaf", "var_rat_gold_leaf", 1, 1, 96 ],
            [ "Rat sigil", "var_rat_sigil", 1, 1, 1000 ]
        ],
        
        "Spider": [ "var_spider_kills",
            [ "String", "var_spider_string", 1, 4, 1 ],
            [ "Dotted green leaf", "var_spider_dotted_green_leaf", 1, 1, 3 ],
            [ "Green leaf", "var_spider_green_leaf", 1, 1, 10 ],
            [ "Lime leaf", "var_spider_lime_leaf", 1, 1, 25 ],
            [ "Gold leaf", "var_spider_gold_leaf", 1, 1, 96 ],
            [ "Spider fields sigil", "var_spider_sigil", 1, 1, 1000 ]
        ],
        
        "Bee": [ "var_bee_kills",
            [ "Honey", "var_bee_honey", 1, 2, 1 ],
            [ "Stinger", "var_bee_stinger", 1, 1, 1 ],
            [ "Bee sigil", "var_bee_sigil", 1, 1, 1000 ]
        ],

        "Lizard": [ "var_lizard_kills",
            [ "Bones", "var_lizard_bones", 1, 1, 1 ],
            [ "Lizard skin", "var_lizard_lizard_skin", 3, 10, 1 ],
            [ "Lizard mask", "var_lizard_lizard_mask", 1, 1, 7 ],
            [ "Lizard body", "var_lizard_lizard_body", 1, 1, 7 ],
            [ "Lizard legs", "var_lizard_lizard_legs", 1, 1, 7 ],
            [ "Lizard gloves", "var_lizard_lizard_gloves", 1, 1, 7 ],
            [ "Lizard boots", "var_lizard_lizard_boots", 1, 1, 7 ],
            [ "Lizard sigil", "var_lizard_sigil", 1, 1, 1000 ],
        ],

        "Snake": [ "var_snake_kills",
            [ "Bones", "var_snake_bones", 1, 1, 1 ],
            [ "Dotted green leaf seeds", "var_snake_dotted_green_leaf_seeds", 1, 1, 6 ],
            [ "Poison", "var_snake_poison", 1, 1, 5 ],
            [ "Green leaf seeds", "var_snake_green_leaf_seeds", 1, 1, 31 ],
            [ "Lime leaf seeds", "var_snake_lime_leaf_seeds", 1, 1, 71 ],
            [ "Gold leaf seeds", "var_snake_gold_leaf_seeds", 1, 1, 181 ],
            [ "Snake sigil", "var_snake_sigil", 1, 1, 1000 ]
        ],

        "Ants": [ "var_ants_kills",
            [ "Ant needles", "var_ants_ant_needles", 3, 8, 1 ],
            [ "Dotted green leaf seeds", "var_ants_dotted_green_leaf_seeds", 1, 1, 6 ],
            [ "Green leaf seeds", "var_ants_green_leaf_seeds", 1, 1, 31 ],
            [ "Lime leaf seeds", "var_ants_lime_leaf_seeds", 1, 1, 71 ],
            [ "Gold leaf seeds", "var_ants_gold_leaf_seeds", 1, 1, 181 ],
            [ "Ants sigil", "var_ants_sigil", 1, 1, 1000 ]
        ],

        "Wolf": [ "var_wolf_kills",
            [ "Bones", "var_wolf_bones", 1, 1, 1 ],
            [ "Raw meat", "var_wolf_raw_meat", 1, 1, 1 ],
            [ "Heart Crystal*", "var_wolf_max_heart_1", 1, 1, 1 ],
            [ "Dotted green leaf seeds", "var_wolf_dotted_green_leaf_seeds", 1, 1, 6 ],
            [ "Green leaf seeds", "var_wolf_green_leaf_seeds", 1, 1, 31 ],
            [ "Lime leaf seeds", "var_wolf_lime_leaf_seeds", 1, 1, 71 ],
            [ "Gold leaf seeds", "var_wolf_gold_leaf_seeds", 1, 1, 181 ],
            [ "Wolf sigil", "var_wolf_sigil", 1, 1, 1000 ]
        ],

        "Thief": [ "var_thief_kills",
            [ "Bones", "var_thief_bones", 1, 1, 1 ],
            [ "Coins", "var_thief_coins", 1, 100, 2 ],
            [ "Iron dagger", "var_thief_iron_dagger", 1, 1, 5 ],
            [ "Dotted green leaf seeds", "var_thief_dotted_green_leaf_seeds", 1, 1, 6 ],
            [ "Green leaf seeds", "var_thief_green_leaf_seeds", 1, 1, 31 ],
            [ "Lime leaf seeds", "var_thief_lime_leaf_seeds", 1, 1, 71 ],
            [ "Gold leaf seeds", "var_thief_gold_leaf_seeds", 1, 1, 181 ],
            [ "Coins", "var_thief_coins", 100000, 200000, 251 ],
            [ "Thief sigil", "var_thief_sigil", 1, 1, 1000 ]
        ],

        "Forest ent": [ "var_forest_ent_kills",
            [ "Strange leaf", "var_forest_ent_strange_leaf", 1, 1, 1 ],
            [ "Logs", "var_forest_ent_logs", 20, 60, 1 ],
            [ "Strange leaf fertilizer*", "var_forest_ent_strange_leaf_fertilizer", 1, 1, 4 ],
            [ "Oak logs", "var_forest_ent_oak_logs", 10, 50, 2 ],
            [ "Willow logs", "var_forest_ent_willow_logs", 5, 25, 5 ],
            [ "Maple logs", "var_forest_ent_maple_logs", 3, 15, 10 ],
            [ "Tree seeds", "var_forest_ent_tree_seeds", 1, 1, 11 ],
            [ "Oak tree seeds", "var_forest_ent_oak_tree_seeds", 1, 1, 26 ],
            [ "Willow tree seeds", "var_forest_ent_willow_tree_seeds", 1, 1, 51 ],
            [ "Maple tree seeds", "var_forest_ent_maple_tree_seeds", 1, 1, 171 ],
            [ "Forest ent sigil", "var_forest_ent_sigil", 1, 1, 1000 ]
        ],

        "Bear": [ "var_bear_kills",
            [ "Bones", "var_bear_bones", 1, 1, 1 ],
            [ "Bear fur", "var_bear_bear_fur", 1, 3, 1 ],
            [ "Train cart piece 1*", "var_bear_train_cart_piece", 1, 1, 2 ],
            [ "Bear mask", "var_bear_bear_mask", 1, 1, 11 ],
            [ "Bear body", "var_bear_bear_body", 1, 1, 11 ],
            [ "Bear legs", "var_bear_bear_legs", 1, 1, 11 ],
            [ "Bear gloves", "var_bear_bear_gloves", 1, 1, 11 ],
            [ "Bear boots", "var_bear_bear_boots", 1, 1, 11 ],
            [ "Bear sigil", "var_bear_sigil", 1, 1, 1000 ]
        ],

        "Goblin": [ "var_goblin_kills",
            [ "Bones", "var_goblin_bones", 1, 1, 1 ],
            [ "Lantern", "var_goblin_lantern", 1, 1, 2 ],
            [ "Train cart piece 2*", "var_goblin_train_cart_piece", 1, 1, 2 ],
            [ "Goblin mask", "var_goblin_goblin_mask", 1, 1, 3 ],
            [ "Stone", "var_goblin_stone", 1000, 5000, 8 ],
            [ "Copper", "var_goblin_copper", 800, 2000, 12 ],
            [ "Iron", "var_goblin_iron", 500, 1000, 14 ],
            [ "Silver", "var_goblin_silver", 250, 350, 16 ],
            [ "Gold", "var_goblin_gold", 25, 60, 41 ],
            [ "Goblin sigil", "var_goblin_sigil", 1, 1, 1000 ]
        ],

        "Bat": [ "var_bat_kills",
            [ "Bones", "var_bat_bones", 1, 1, 1 ],
            [ "Bat skin", "var_bat_bat_skin", 1, 3, 1 ],
            [ "Train cart piece 3*", "var_bat_train_cart_piece", 1, 1, 2 ],
            [ "Bat mask", "var_bat_bat_mask", 1, 1, 11 ],
            [ "Bat body", "var_bat_bat_body", 1, 1, 11 ],
            [ "Bat legs", "var_bat_bat_legs", 1, 1, 11 ],
            [ "Bat gloves", "var_bat_bat_gloves", 1, 1, 11 ],
            [ "Bat boots", "var_bat_bat_boots", 1, 1, 11 ],
            [ "Bat caves sigil", "var_bat_caves_sigil", 1, 1, 1000 ]
        ],

        "Skeleton": [ "var_skeleton_kills",
            [ "Bones", "var_skeleton_bones", 5, 10, 1 ],
            [ "Skeleton sword", "var_skeleton_skeleton_sword", 1, 1, 3 ],
            [ "Skeleton shield", "var_skeleton_skeleton_shield", 1, 1, 3 ],
            [ "Train cart piece 4*", "var_skeleton_train_cart_piece", 1, 1, 2 ],
            [ "Skull*", "var_skeleton_skull", 1, 1, 10 ],
            [ "Bone amulet", "var_skeleton_bone_amulet", 1, 1, 20 ],
            [ "Promethium", "var_skeleton_promethium", 1, 1, 51 ],
            [ "Skeleton sigil", "var_skeleton_sigil", 1, 1, 1000 ]
        ],

        "Fire hawk": [ "var_fire_hawk_kills",
            [ "Ashes", "var_fire_hawk_ashes", 1, 1, 1 ],
            [ "Fire feathers", "var_fire_hawk_fire_feathers", 5, 15, 1 ],
            [ "Raw bird meat", "var_fire_hawk_raw_bird_meat", 1, 1, 1 ],
            [ "Fire hawk sigil", "var_fire_hawk_sigil", 1, 1, 1000 ]
        ],

        "Fire snake": [ "var_fire_snake_kills",
            [ "Ashes", "var_fire_snake_ashes", 1, 1, 1 ],
            [ "Fire spellscroll*", "var_fire_snake_fire_spellscroll", 1, 1, 1 ],
            [ "Fire snake sigil", "var_fire_snake_sigil", 1, 1, 1000 ]
        ],

        "Fire golem": [ "var_fire_golem_kills",
            [ "Ashes", "var_fire_golem_ashes", 1, 1, 1 ],
            [ "Bomb", "var_fire_golem_bomb", 1, 1, 4 ],
            [ "Fire golem sigil", "var_fire_golem_sigil", 1, 1, 1000 ]
        ],

        "Fire witch": [ "var_fire_witch_kills",
            [ "Ashes", "var_fire_witch_ashes", 1, 1, 1 ],
            [ "String", "var_fire_witch_string", 3, 8, 1 ],
            [ "Fire crystal*", "var_fire_witch_fire_crystal", 1, 1, 1 ],
            [ "Heart Crystal*", "var_fire_witch_max_heart_2", 1, 1, 5 ],
            [ "Fire witch sigil", "var_fire_witch_sigil", 1, 1, 1000 ]
        ],

        "Ice hawk": [ "var_ice_hawk_kills",
            [ "Ice bones", "var_ice_hawk_ice_bones", 1, 1, 1 ],
            [ "Ice feathers", "var_ice_hawk_ice_feathers", 5, 15, 1 ],
            [ "Raw bird meat", "var_ice_hawk_raw_bird_meat", 1, 1, 1 ],
            [ "Pine logs", "var_ice_hawk_pine_logs", 5, 25, 2 ],
            [ "Pine tree seeds", "var_ice_hawk_pine_tree_seeds", 1, 1, 14 ],
            [ "Ice hawk sigil", "var_ice_hawk_sigil", 1, 1, 1000 ]
        ],

        "Ice golem": [ "var_ice_golem_kills",
            [ "Ice bones", "var_ice_golem_ice_bones", 1, 1, 1 ],
            [ "Wooden arrows", "var_ice_golem_wooden_arrows", 5, 15, 1 ],
            [ "Fire arrows", "var_ice_golem_fire_arrows", 5, 15, 2 ],
            [ "Ice arrows", "var_ice_golem_ice_arrows", 5, 15, 3 ],
            [ "Pine logs", "var_ice_golem_pine_logs", 5, 25, 2 ],
            [ "Long bow frame", "var_ice_golem_long_bow_frame", 1, 1, 10 ],
            [ "Pine tree seeds", "var_ice_golem_pine_tree_seeds", 1, 1, 14 ],
            [ "Ice golem sigil", "var_ice_golem_sigil", 1, 1, 1000 ]
        ],

        "Ice witch": [ "var_ice_witch_kills",
            [ "Ice bones", "var_ice_witch_ice_bones", 1, 1, 1 ],
            [ "String", "var_ice_witch_string", 3, 8, 1 ],
            [ "Pine logs", "var_ice_witch_pine_logs", 5, 25, 2 ],
            [ "Heart Crystal*", "var_ice_witch_max_heart_3", 1, 1, 7 ],
            [ "Mana Crystal*", "var_ice_witch_max_mana_2", 1, 1, 7 ],
            [ "Pine tree seeds", "var_ice_witch_pine_tree_seeds", 1, 1, 14 ],
            [ "Ice witch sigil", "var_ice_witch_sigil", 1, 1, 1000 ]
        ],

        "Yeti": [ "var_yeti_kills",
            [ "Ice bones", "var_yeti_ice_bones", 1, 1, 1 ],
            [ "Pine logs", "var_yeti_pine_logs", 20, 100, 4 ],
            [ "Ice crystal*", "var_yeti_ice_crystal", 1, 1, 8 ],
            [ "Pine tree seeds", "var_yeti_pine_tree_seeds", 2, 3, 14 ],
            [ "Club", "var_yeti_club", 1, 1, 15 ],
            [ "Yeti sigil", "var_yeti_sigil", 1, 1, 1000 ]
        ],

        "Ghost": [ "var_ghost_kills",
            [ "Ghost essence", "var_ghost_ghost_essence", 100, 300, 1 ],
            [ "Green gaurdian key", "var_ghost_green_gaurdian_key", 1, 1, 20 ],
            [ "Ghost hm sigil", "var_ghost_hm_sigil", 1, 1, 1000 ]
        ],

        "Grandma": [ "var_grandma_kills",
            [ "Ghost essence", "var_grandma_ghost_essence", 100, 300, 1 ],
            [ "Heal upgrade spellscroll*", "var_grandma_heal_upgrade_spellscroll", 1, 1, 5 ],
            [ "Green gaurdian key", "var_grandma_green_gaurdian_key", 1, 1, 20 ],
            [ "Grandma sigil", "var_grandma_sigil", 1, 1, 1000 ]
        ],

        "Exorcist": [ "var_exorcist_kills",
            [ "Ghost essence", "var_exorcist_ghost_essence", 100, 300, 1 ],
            [ "Oxygen mask*", "var_exorcist_oxygen_mask", 1, 1, 4 ],
            [ "Oxygen tank*", "var_exorcist_oxygen_tank", 1, 1, 4 ],
            [ "Green gaurdian key", "var_exorcist_green_gaurdian_key", 1, 1, 20 ],
            [ "Exorcist sigil", "var_exorcist_sigil", 1, 1, 1000 ]
        ],

        "Reaper": [ "var_reaper_kills",
            [ "Ghost essence", "var_reaper_ghost_essence", 500, 1000, 1 ],
            [ "Green gaurdian key", "var_reaper_green_gaurdian_key", 1, 1, 10 ],
            [ "Scythe", "var_reaper_scythe", 1, 1, 100 ],
            [ "Reaper hood", "var_reaper_reaper_hood", 1, 1, 100 ],
            [ "Reaper body", "var_reaper_reaper_body", 1, 1, 100 ],
            [ "Reaper skirt", "var_reaper_reaper_skirt", 1, 1, 100 ],
            [ "Reaper boots", "var_reaper_reaper_boots", 1, 1, 100 ],
            [ "Reaper gloves", "var_reaper_reaper_gloves", 1, 1, 100 ],
            [ "Reaper sigil", "var_reaper_sigil", 1, 1, 1000 ]
        ],

        "Shark": [ "var_shark_kills",
            [ "Bones", "var_shark_bones", 1, 1, 1 ],
            [ "Seaweed", "var_shark_seaweed", 1, 6, 1 ],
            [ "Super bait", "var_shark_super_bait", 1, 1, 3 ],
            [ "Raw bloated shark", "var_shark_raw_bloated_shark", 1, 1, 6 ],
            [ "Flippers", "var_shark_flippers", 1, 1, 10 ],
            [ "Shark tooth", "var_shark_shark_tooth", 1, 1, 10 ],
            [ "Bait", "var_shark_bait", 2, 5, 20 ],
            [ "Mega bait", "var_shark_mega_bait", 1, 1, 60 ],
            [ "Crystal leaf", "var_shark_crystal_leaf", 1, 10, 60 ],
            [ "Shark sigil", "var_shark_sigil", 1, 1, 1000 ]
        ],

        "Sea soldier": [ "var_sea_soldier_kills",
            [ "Bones", "var_sea_soldier_bones", 1, 1, 1 ],
            [ "Seaweed", "var_sea_soldier_seaweed", 1, 6, 1 ],
            [ "Super bait", "var_sea_soldier_super_bait", 1, 1, 3 ],
            [ "Flippers", "var_sea_soldier_flippers", 1, 1, 10 ],
            [ "Trident", "var_sea_soldier_trident", 1, 1, 10 ],
            [ "Sea helmet", "var_sea_soldier_sea_helmet", 1, 1, 40 ],
            [ "Mega bait", "var_sea_soldier_mega_bait", 1, 1, 60 ],
            [ "Crystal leaf", "var_sea_soldier_crystal_leaf", 1, 10, 60 ],
            [ "Sea soldier sigil", "var_sea_soldier_sigil", 1, 1, 1000 ]
        ],

        "Puffer fish": [ "var_puffer_fish_kills",
            [ "Bones", "var_puffer_fish_bones", 1, 1, 1 ],
            [ "Puffer needles", "var_puffer_fish_puffer_needles", 3, 8, 1 ],
            [ "Seaweed", "var_puffer_fish_seaweed", 1, 6, 1 ],
            [ "Super bait", "var_puffer_fish_super_bait", 1, 1, 3 ],
            [ "Flippers", "var_puffer_fish_flippers", 1, 1, 10 ],
            [ "Mega bait", "var_puffer_fish_mega_bait", 1, 1, 60 ],
            [ "Crystal leaf", "var_puffer_fish_crystal_leaf", 1, 10, 60 ],
            [ "Puffer fish sigil", "var_puffer_fish_sigil", 1, 1, 1000 ]
        ],

        "Saltwater crocodile": [ "var_saltwater_crocodile_kills",
            [ "Big bones", "var_saltwater_crocodile_big_bones", 1, 1, 1 ],
            [ "Seaweed", "var_saltwater_crocodile_seaweed", 1, 6, 1 ],
            [ "Crocodile hide", "var_saltwater_crocodile_crocodile_hide", 1, 3, 1 ],
            [ "Super bait", "var_saltwater_crocodile_super_bait", 1, 1, 3 ],
            [ "Flippers", "var_saltwater_crocodile_flippers", 1, 1, 10 ],
            [ "Crocodile mask", "var_saltwater_crocodile_crocodile_mask", 1, 1, 30 ],
            [ "Crocodile body", "var_saltwater_crocodile_crocodile_body", 1, 1, 30 ],
            [ "Crocodile legs", "var_saltwater_crocodile_crocodile_legs", 1, 1, 30 ],
            [ "Crocodile gloves", "var_saltwater_crocodile_crocodile_gloves", 1, 1, 30 ],
            [ "Crocodile boots", "var_saltwater_crocodile_crocodile_boots", 1, 1, 30 ],
            [ "Mega bait", "var_saltwater_crocodile_mega_bait", 1, 1, 60 ],
            [ "Crystal leaf", "var_saltwater_crocodile_crystal_leaf", 1, 10, 60 ],
            [ "Saltwater crocodile sigil", "var_saltwater_crocodile_sigil", 1, 1, 1000 ]
        ],

        "Blood chicken": [ "var_blood_chicken_kills",
            [ "Blood chicken foot", "var_blood_chicken_blood_chicken_foot", 1, 1, 1 ],
            [ "Blood bones", "var_blood_chicken_blood_bones", 1, 1, 1 ],
            [ "Raw chicken", "var_blood_chicken_raw_chicken", 2, 4, 1 ],
            [ "Feathers", "var_blood_chicken_feathers", 15, 30, 1 ],
            [ "Field tablette 1", "var_blood_chicken_field_tablette_1", 1, 1, 4 ],
            [ "Dotted green leaf", "var_blood_chicken_dotted_green_leaf", 1, 4, 3 ],
            [ "Egg", "var_blood_chicken_egg", 1, 1, 6 ],
            [ "Green leaf", "var_blood_chicken_green_leaf", 1, 4, 10 ],
            [ "Lime leaf", "var_blood_chicken_lime_leaf", 1, 4, 25 ],
            [ "Gold leaf", "var_blood_chicken_gold_leaf", 1, 4, 96 ],
            [ "Chicken sigil", "var_blood_chicken_sigil", 1, 1, 1000 ],
            [ "Dragon shield left half", "var_blood_chicken_dragon_shield_left_half", 1, 1, 2000 ],
            [ "Dragon shield right half", "var_blood_chicken_dragon_shield_right_half", 1, 1, 2000 ],
            [ "Blood moon sigil", "var_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Blood rat": [ "var_blood_rat_kills",
            [ "Blood rat tail", "var_blood_rat_blood_rat_tail", 1, 1, 1 ],
            [ "Blood bones", "var_blood_rat_blood_bones", 1, 1, 1 ],
            [ "Cheese", "var_blood_rat_cheese", 3, 3, 2 ],
            [ "Field tablette 2", "var_blood_rat_field_tablette_2", 1, 1, 4 ],
            [ "Dotted green leaf", "var_blood_rat_dotted_green_leaf", 3, 6, 3 ],
            [ "Green leaf", "var_blood_rat_green_leaf", 3, 6, 10 ],
            [ "Lime leaf", "var_blood_rat_lime_leaf", 3, 6, 25 ],
            [ "Gold leaf", "var_blood_rat_gold_leaf", 3, 6, 96 ],
            [ "Rat sigil", "var_blood_rat_sigil", 1, 1, 1000 ],
            [ "Dragon shield left half", "var_blood_rat_dragon_shield_left_half", 1, 1, 2000 ],
            [ "Dragon shield right half", "var_blood_rat_dragon_shield_right_half", 1, 1, 2000 ],
            [ "Blood moon sigil", "var_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Blood spider": [ "var_blood_spider_kills",
            [ "Blood spider legs", "var_blood_spider_blood_spider_legs", 1, 1, 1 ],
            [ "String", "var_blood_spider_string", 1, 4, 1 ],
            [ "Dotted green leaf", "var_blood_spider_dotted_green_leaf", 3, 6, 3 ],
            [ "Field tablette 3", "var_blood_spider_field_tablette_3", 1, 1, 4 ],
            [ "Green leaf", "var_blood_spider_green_leaf", 3, 6, 10 ],
            [ "Lime leaf", "var_blood_spider_lime_leaf", 3, 6, 25 ],
            [ "Gold leaf", "var_blood_spider_gold_leaf", 3, 6, 96 ],
            [ "Spider fields sigil", "var_blood_spider_sigil", 1, 1, 1000 ],
            [ "Dragon shield left half", "var_blood_spider_dragon_shield_left_half", 1, 1, 2000 ],
            [ "Dragon shield right half", "var_blood_spider_dragon_shield_right_half", 1, 1, 2000 ],
            [ "Blood moon sigil", "var_blood_spider_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Blood bee": [ "var_blood_bee_kills",
            [ "Blood bee wings", "var_blood_bee_blood_bee_wings", 1, 1, 1 ],
            [ "Honey", "var_blood_bee_honey", 4, 8, 1 ],
            [ "Stinger", "var_blood_bee_stinger", 1, 2, 1 ],
            [ "Field tablette 4", "var_blood_bee_field_tablette_4", 1, 1, 4 ],
            [ "Bee sigil", "var_blood_bee_sigil", 1, 1, 1000 ],
            [ "Dragon shield left half", "var_blood_bee_dragon_shield_left_half", 1, 1, 2000 ],
            [ "Dragon shield right half", "var_blood_bee_dragon_shield_right_half", 1, 1, 2000 ],
            [ "Blood moon sigil", "var_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Blood lizard": [ "var_blood_lizard_kills",
            [ "Blood lizard head", "var_blood_lizard_blood_lizard_head", 1, 1, 1 ],
            [ "Blood bones", "var_blood_lizard_blood_bones", 1, 1, 1 ],
            [ "Lizard skin", "var_blood_lizard_lizard_skin", 3, 10, 1 ],
            [ "Field tablette 5", "var_blood_lizard_field_tablette_5", 1, 1, 4 ],
            [ "Lizard mask", "var_blood_lizard_lizard_mask", 1, 1, 6 ],
            [ "Lizard body", "var_blood_lizard_lizard_body", 1, 1, 6 ],
            [ "Lizard legs", "var_blood_lizard_lizard_legs", 1, 1, 6 ],
            [ "Lizard gloves", "var_blood_lizard_lizard_gloves", 1, 1, 6 ],
            [ "Lizard boots", "var_blood_lizard_lizard_boots", 1, 1, 6 ],
            [ "Lizard sigil", "var_blood_lizard_sigil", 1, 1, 1000 ],
            [ "Dragon shield left half", "var_blood_lizard_dragon_shield_left_half", 1, 1, 2000 ],
            [ "Dragon shield right half", "var_blood_lizard_dragon_shield_right_half", 1, 1, 2000 ],
            [ "Blood moon sigil", "var_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Blood snake": [ "var_blood_snake_kills",
            [ "Blood bones", "var_blood_snake_blood_bones", 1, 1, 1 ],
            [ "Blood snake head", "var_blood_snake_blood_snake_head", 1, 1, 1 ],
            [ "Forest tablette 1", "var_blood_snake_forest_tablette_1", 1, 1, 4 ],
            [ "Dotted green leaf seeds", "var_blood_snake_dotted_green_leaf_seeds", 1, 5, 6 ],
            [ "Poison", "var_blood_snake_poison", 1, 3, 5 ],
            [ "Green leaf seeds", "var_blood_snake_green_leaf_seeds", 1, 5, 31 ],
            [ "Lime leaf seeds", "var_blood_snake_lime_leaf_seeds", 1, 5, 71 ],
            [ "Gold leaf seeds", "var_blood_snake_gold_leaf_seeds", 1, 5, 181 ],
            [ "Snake sigil", "var_blood_snake_sigil", 1, 1, 1000 ],
            [ "Dragon shield left half", "var_blood_snake_dragon_shield_left_half", 1, 1, 2000 ],
            [ "Dragon shield right half", "var_blood_snake_dragon_shield_right_half", 1, 1, 2000 ],
            [ "Blood moon sigil", "var_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Blood ants": [ "var_blood_ants_kills",
            [ "Ant needles", "var_blood_ants_ant_needles", 6, 20, 1 ],
            [ "Blood ant remains", "var_blood_ants_blood_ant_remains", 1, 1, 1 ],
            [ "Forest tablette 2", "var_blood_ants_forest_tablette_2", 1, 1, 4 ],
            [ "Dotted green leaf seeds", "var_blood_ants_dotted_green_leaf_seeds", 1, 5, 6 ],
            [ "Green leaf seeds", "var_blood_ants_green_leaf_seeds", 1, 5, 31 ],
            [ "Lime leaf seeds", "var_blood_ants_lime_leaf_seeds", 1, 5, 71 ],
            [ "Gold leaf seeds", "var_blood_ants_gold_leaf_seeds", 1, 5, 181 ],
            [ "Ants sigil", "var_blood_ants_sigil", 1, 1, 1000 ],
            [ "Dragon shield left half", "var_blood_ants_dragon_shield_left_half", 1, 1, 1000 ],
            [ "Dragon shield right half", "var_blood_ants_dragon_shield_right_half", 1, 1, 1000 ],
            [ "Blood moon sigil", "var_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Blood wolf": [ "var_blood_wolf_kills",
            [ "Blood bones", "var_blood_wolf_blood_bones", 1, 1, 1 ],
            [ "Blood wolf paw", "var_blood_wolf_blood_wolf_paw", 1, 1, 1 ],
            [ "Raw meat", "var_blood_wolf_raw_meat", 1, 5, 1 ],
            [ "Heart Crystal*", "var_blood_wolf_max_heart_5", 1, 1, 1 ],
            [ "Forest tablette 3", "var_blood_wolf_forest_tablette_3", 1, 1, 4 ],
            [ "Dotted green leaf seeds", "var_blood_wolf_dotted_green_leaf_seeds", 1, 5, 6 ],
            [ "Green leaf seeds", "var_blood_wolf_green_leaf_seeds", 1, 5, 31 ],
            [ "Lime leaf seeds", "var_blood_wolf_lime_leaf_seeds", 1, 5, 71 ],
            [ "Gold leaf seeds", "var_blood_wolf_gold_leaf_seeds", 1, 5, 181 ],
            [ "Wolf sigil", "var_blood_wolf_sigil", 1, 1, 1000 ],
            [ "Dragon shield left half", "var_blood_wolf_dragon_shield_left_half", 1, 1, 1000 ],
            [ "Dragon shield right half", "var_blood_wolf_dragon_shield_right_half", 1, 1, 1000 ],
            [ "Blood moon sigil", "var_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Blood forest ent": [ "var_blood_forest_ent_kills",
            [ "Blood logs", "var_blood_forest_ent_blood_logs", 1, 1, 1 ],
            [ "Strange leaf", "var_blood_forest_ent_strange_leaf", 1, 5, 1 ],
            [ "Stranger leaf", "var_blood_forest_ent_stranger_leaf", 1, 1, 1 ],
            [ "Logs", "var_blood_forest_ent_logs", 100, 300, 1 ],
            [ "Oak logs", "var_blood_forest_ent_oak_logs", 50, 200, 2 ],
            [ "Forest tablette 4", "var_blood_forest_ent_forest_tablette_4", 1, 1, 4 ],
            [ "Willow logs", "var_blood_forest_ent_willow_logs", 25, 100, 5 ],
            [ "Maple logs", "var_blood_forest_ent_maple_logs", 15, 80, 10 ],
            [ "Tree seeds", "var_blood_forest_ent_tree_seeds", 3, 3, 11 ],
            [ "Oak tree seeds", "var_blood_forest_ent_oak_tree_seeds", 3, 3, 26 ],
            [ "Willow tree seeds", "var_blood_forest_ent_willow_tree_seeds", 3, 3, 51 ],
            [ "Maple tree seeds", "var_blood_forest_ent_maple_tree_seeds", 3, 3, 71 ],
            [ "Stardust tree seeds", "var_blood_forest_ent_stardust_tree_seeds", 3, 3, 100 ],
            [ "Forest ent sigil", "var_blood_forest_ent_sigil", 1, 1, 1000 ],
            [ "Dragon shield left half", "var_blood_forest_ent_dragon_shield_left_half", 1, 1, 1000 ],
            [ "Dragon shield right half", "var_blood_forest_ent_dragon_shield_right_half", 1, 1, 1000 ],
            [ "Blood moon sigil", "var_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Blood thief": [ "var_blood_thief_kills",
            [ "Blood bones", "var_blood_thief_blood_bones", 1, 1, 1 ],
            [ "Blood thief skull", "var_blood_thief_blood_thief_skull", 1, 1, 1 ],
            [ "Coins", "var_blood_thief_coins", 100, 1000, 2 ],
            [ "Forest tablette 5", "var_blood_thief_forest_tablette_5", 1, 1, 4 ],
            [ "Iron dagger", "var_blood_thief_iron_dagger", 1, 3, 5 ],
            [ "Dotted green leaf seeds", "var_blood_thief_dotted_green_leaf_seeds", 1, 5, 6 ],
            [ "Green leaf seeds", "var_blood_thief_green_leaf_seeds", 1, 5, 31 ],
            [ "Thiefs mask", "var_thief_mask", 1, 1, 51],
            [ "Lime leaf seeds", "var_blood_thief_lime_leaf_seeds", 1, 5, 71 ],
            [ "Gold leaf seeds", "var_blood_thief_gold_leaf_seeds", 1, 5, 181 ],
            [ "Coins", "var_blood_thief_coins", 100000, 2000000, 251 ],
            [ "Thief sigil", "var_blood_thief_sigil", 1, 1, 1000 ],
            [ "Dragon shield left half", "var_blood_thief_dragon_shield_left_half", 1, 1, 1000 ],
            [ "Dragon shield right half", "var_blood_thief_dragon_shield_right_half", 1, 1, 1000 ],
            [ "Blood moon sigil", "var_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Blood bear": [ "var_blood_bear_kills",
            [ "Blood bones", "var_blood_bear_blood_bones", 1, 1, 1 ],
            [ "Blood bear paw", "var_blood_bear_blood_bear_paw", 1, 1, 1 ],
            [ "Bear fur", "var_blood_bear_bear_fur", 1, 6, 1 ],
            [ "Cave tablette 1", "var_blood_bear_cave_tablette_1", 1, 1, 4 ],
            [ "Bear mask", "var_blood_bear_bear_mask", 1, 2, 7 ],
            [ "Bear body", "var_blood_bear_bear_body", 1, 2, 7 ],
            [ "Bear legs", "var_blood_bear_bear_legs", 1, 2, 7 ],
            [ "Bear gloves", "var_blood_bear_bear_gloves", 1, 2, 7 ],
            [ "Bear boots", "var_blood_bear_bear_boots", 1, 2, 7 ],
            [ "Bear sigil", "var_blood_bear_sigil", 1, 1, 1000 ],
            [ "Dragon shield left half", "var_blood_bear_dragon_shield_left_half", 1, 1, 700 ],
            [ "Dragon shield right half", "var_blood_bear_dragon_shield_right_half", 1, 1, 700 ],
            [ "Blood moon sigil", "var_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Blood goblin": [ "var_blood_goblin_kills",
            [ "Blood bones", "var_blood_goblin_blood_bones", 1, 1, 1 ],
            [ "Blood goblin fingers", "var_blood_goblin_blood_goblin_fingers", 1, 1, 1 ],
            [ "Lantern", "var_blood_goblin_lantern", 1, 1, 2 ],
            [ "Ring of light", "var_blood_goblin_ring_of_light", 1, 1, 3 ],
            [ "Blood goblin mask", "var_blood_goblin_blood_goblin_mask", 1, 1, 3 ],
            [ "Cave tablette 2", "var_blood_goblin_cave_tablette_2", 1, 1, 4 ],
            [ "Stone", "var_blood_goblin_stone", 1000, 10000, 6 ],
            [ "Copper", "var_blood_goblin_copper", 800, 5000, 9 ],
            [ "Iron", "var_blood_goblin_iron", 500, 2000, 10 ],
            [ "Silver", "var_blood_goblin_silver", 250, 700, 14 ],
            [ "Gold", "var_blood_goblin_gold", 25, 100, 18 ],
            [ "Goblin sigil", "var_blood_goblin_sigil", 1, 1, 1000 ],
            [ "Dragon shield left half", "var_blood_goblin_dragon_shield_left_half", 1, 1, 700 ],
            [ "Dragon shield right half", "var_blood_goblin_dragon_shield_right_half", 1, 1, 700 ],
            [ "Blood moon sigil", "var_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Blood bat": [ "var_blood_bat_kills",
            [ "Blood bones", "var_blood_bat_blood_bones", 1, 1, 1 ],
            [ "Blood bat wing", "var_blood_bat_blood_bat_wing", 1, 1, 1 ],
            [ "Bat skin", "var_blood_bat_bat_skin", 1, 6, 1 ],
            [ "Cave tablette 3", "var_blood_bat_cave_tablette_3", 1, 1, 4 ],
            [ "Bat mask", "var_blood_bat_bat_mask", 1, 2, 7 ],
            [ "Bat body", "var_blood_bat_bat_body", 1, 2, 7 ],
            [ "Bat legs", "var_blood_bat_bat_legs", 1, 2, 7 ],
            [ "Bat gloves", "var_blood_bat_bat_gloves", 1, 2, 7 ],
            [ "Bat boots", "var_blood_bat_bat_boots", 1, 2, 7 ],
            [ "Bat caves sigil", "var_blood_bat_sigil", 1, 1, 1000 ],
            [ "Dragon shield left half", "var_blood_bat_dragon_shield_left_half", 1, 1, 700 ],
            [ "Dragon shield right half", "var_blood_bat_dragon_shield_right_half", 1, 1, 700 ],
            [ "Blood moon sigil", "var_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Blood skeleton": [ "var_blood_skeleton_kills",
            [ "Blood bones", "var_blood_skeleton_blood_bones", 3, 6, 1 ],
            [ "Blood skeleton ribcage", "var_blood_skeleton_blood_skeleton_ribcage", 1, 1, 1 ],
            [ "Skeleton sword", "var_blood_skeleton_skeleton_sword", 1, 2, 2 ],
            [ "Skeleton shield", "var_blood_skeleton_skeleton_shield", 1, 2, 2 ],
            [ "Cave tablette 4", "var_blood_skeleton_cave_tablette_4", 1, 1, 4 ],
            [ "Bone amulet", "var_blood_skeleton_bone_amulet", 1, 2, 10 ],
            [ "Promethium", "var_blood_skeleton_promethium", 1, 10, 31 ],
            [ "Dragon shield left half", "var_blood_skeleton_dragon_shield_left_half", 1, 1, 700 ],
            [ "Dragon shield right half", "var_blood_skeleton_dragon_shield_right_half", 1, 1, 700 ],
            [ "Skeleton sigil", "var_blood_skeleton_sigil", 1, 1, 1000 ],
            [ "Blood moon sigil", "var_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Blood fire snake": [ "var_blood_fire_snake_kills",
            [ "Ashes", "var_blood_fire_snake_ashes", 2, 2, 1 ],
            [ "Blood fire snake tongue", "var_blood_fire_snake_blood_fire_snake_tongue", 1, 1, 1 ],
            [ "Fire upgrade spellscroll*", "var_blood_fire_snake_fire_upgrade_spellscroll", 1, 1, 4 ],
            [ "Volcano tablette 1", "var_blood_fire_snake_volcano_tablette_1", 1, 1, 4 ],
            [ "Dragon shield left half", "var_blood_fire_snake_dragon_shield_left_half", 1, 1, 500 ],
            [ "Dragon shield right half", "var_blood_fire_snake_dragon_shield_right_half", 1, 1, 500 ],
            [ "Fire snake sigil", "var_blood_fire_snake_sigil", 1, 1, 1000 ],
            [ "Blood moon sigil", "var_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Blood fire hawk": [ "var_blood_fire_hawk_kills",
            [ "Ashes", "var_blood_fire_hawk_ashes", 2, 2, 1 ],
            [ "Blood fire hawk wing", "var_blood_fire_hawk_blood_fire_hawk_wing", 1, 1, 1 ],
            [ "Fire feathers", "var_blood_fire_hawk_fire_feathers", 15, 30, 1 ],
            [ "Raw bird meat", "var_blood_fire_hawk_raw_bird_meat", 2, 4, 1 ],
            [ "Volcano tablette 2", "var_blood_fire_hawk_volcano_tablette_2", 1, 1, 4 ],
            [ "Dragon shield left half", "var_blood_fire_hawk_dragon_shield_left_half", 1, 1, 500 ],
            [ "Dragon shield right half", "var_blood_fire_hawk_dragon_shield_right_half", 1, 1, 500 ],
            [ "Fire hawk sigil", "var_blood_fire_hawk_sigil", 1, 1, 1000 ],
            [ "Blood moon sigil", "var_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Blood fire golem": [ "var_blood_fire_golem_kills",
            [ "Ashes", "var_blood_fire_golem_ashes", 2, 2, 1 ],
            [ "Blood fire golem head", "var_blood_fire_golem_blood_fire_golem_head", 1, 1, 1 ],
            [ "Volcano tablette 3", "var_blood_fire_golem_volcano_tablette_3", 1, 1, 4 ],
            [ "Bomb", "var_blood_fire_golem_bomb", 1, 1, 4 ],
            [ "Tnt", "var_blood_fire_golem_tnt", 1, 1, 10 ],
            [ "Dragon shield left half", "var_blood_fire_golem_dragon_shield_left_half", 1, 1, 500 ],
            [ "Dragon shield right half", "var_blood_fire_golem_dragon_shield_right_half", 1, 1, 500 ],
            [ "Fire golem sigil", "var_blood_fire_golem_sigil", 1, 1, 1000 ],
            [ "Blood moon sigil", "var_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Blood fire witch": [ "var_blood_fire_witch_kills",
            [ "Ashes", "var_blood_fire_witch_ashes", 2, 2, 1 ],
            [ "String", "var_blood_fire_witch_string", 15, 30, 1 ],
            [ "Blood fire witch web", "var_blood_fire_witch_blood_fire_witch_web", 1, 1, 1 ],
            [ "Volcano tablette 4", "var_blood_fire_witch_volcano_tablette_4", 1, 1, 4 ],
            [ "Reflect upgrade spellscroll*", "var_blood_fire_witch_reflect_upgrade_spellscroll", 1, 1, 6 ],
            [ "Dragon shield left half", "var_blood_fire_witch_dragon_shield_left_half", 1, 1, 500 ],
            [ "Dragon shield right half", "var_blood_fire_witch_dragon_shield_right_half", 1, 1, 500 ],
            [ "Fire witch sigil", "var_blood_fire_witch_sigil", 1, 1, 1000 ],
            [ "Blood moon sigil", "var_blood_moon_sigil", 1, 1, 10000 ]
        ],

        "Gem goblin": [ "var_gem_goblin_kills",
            [ "Bones", "var_gem_goblin_bones", 1, 1, 1 ],
            [ "Gem bag", "var_gem_goblin_gem_bag", 1, 3, 1 ],
            [ "Gem goblin sigil", "var_gem_goblin_sigil", 1, 1, 1000 ]
        ],

        "Blood gem goblin": [ "var_blood_gem_goblin_kills",
            [ "Blood bones", "var_blood_gem_goblin_blood_bones", 1, 1, 1 ],
            [ "Gem bag", "var_blood_gem_goblin_gem_bag", 3, 7, 1 ],
            [ "Dragon shield left half", "var_blood_gem_goblin_dragon_shield_left_half", 1, 1, 700 ],
            [ "Dragon shield right half", "var_blood_gem_goblin_dragon_shield_right_half", 1, 1, 700 ],
            [ "Gem goblin sigil", "var_blood_gem_goblin_sigil", 1, 1, 1000 ]
        ],

        "Zombie purple": [ "var_zombie_purple_kills",
            [ "Bones", "var_zombie_purple_bones", 1, 1, 1 ],
            [ "Maggots", "var_zombie_purple_maggots", 1, 10, 1 ],
            [ "Zombie left foot purple", "var_zombie_left_foot_purple", 1, 1, 5 ],
            [ "Zombie right foot purple", "var_zombie_right_foot_purple", 1, 1, 5 ],
            [ "Zombie right arm purple", "var_zombie_right_arm_purple", 1, 1, 5 ],
            [ "Zombie left arm purple", "var_zombie_left_arm_purple", 1, 1, 5 ]
        ],

        "Zombie green": [ "var_zombie_green_kills",
            [ "Bones", "var_zombie_green_bones", 1, 1, 1 ],
            [ "Maggots", "var_zombie_green_maggots", 1, 10, 1 ],
            [ "Zombie left foot green", "var_zombie_left_foot_green", 1, 1, 5 ],
            [ "Zombie right foot green", "var_zombie_right_foot_green", 1, 1, 5 ],
            [ "Zombie right arm green", "var_zombie_right_arm_green", 1, 1, 5 ],
            [ "Zombie left arm green", "var_zombie_left_arm_green", 1, 1, 5 ]
        ],

        "Zombie red": [ "var_zombie_red_kills",
            [ "Bones", "var_zombie_red_bones", 1, 1, 1 ],
            [ "Maggots", "var_zombie_red_maggots", 1, 10, 1 ],
            [ "Zombie left foot red", "var_zombie_left_foot_red", 1, 1, 5 ],
            [ "Zombie right foot red", "var_zombie_right_foot_red", 1, 1, 5 ],
            [ "Zombie right arm red", "var_zombie_right_arm_red", 1, 1, 5 ],
            [ "Zombie left arm red", "var_zombie_left_arm_red", 1, 1, 5 ]
        ],

        "Zombie blue": [ "var_zombie_blue_kills",
            [ "Bones", "var_zombie_blue_bones", 1, 1, 1 ],
            [ "Maggots", "var_zombie_blue_maggots", 1, 10, 1 ],
            [ "Zombie left foot blue", "var_zombie_left_foot_blue", 1, 1, 5 ],
            [ "Zombie right foot blue", "var_zombie_right_foot_blue", 1, 1, 5 ],
            [ "Zombie right arm blue", "var_zombie_right_arm_blue", 1, 1, 5 ],
            [ "Zombie left arm blue", "var_zombie_left_arm_blue", 1, 1, 5 ]
        ],

        "Evil pirate": [ "var_evil_pirate_kills",
            [ "Bones", "var_evil_pirate_bones", 1, 1, 1 ],
            [ "Iron cannonball", "var_evil_pirate_iron_cannonball", 1, 2, 1 ],
            [ "Sextant*", "var_evil_pirate_sextant", 1, 1, 4 ],
            [ "Cannon wheels", "var_evil_pirate_cannon_wheels", 1, 1, 10 ],
            [ "Cannon barrel", "var_evil_pirate_cannon_barrel", 1, 1, 10 ],
            [ "Cannon base", "var_evil_pirate_cannon_base", 1, 1, 10 ],
            [ "Cannonball mould", "var_evil_pirate_cannonball_mould", 1, 1, 10 ],
            [ "Random treasure chest", "var_evil_pirate_random_treasure_chest", 1, 1, 20 ],
            [ "Cannon", "var_evil_pirate_cannon", 1, 1, 500 ]
        ],

        "Castle ants": [ "var_castle_ants_kills",
            [ "Castle key 3", "var_castle_ants_castle_key_3", 1, 1, 1 ],
            [ "Ant needles", "var_castle_ants_ant_needles", 6, 20, 1 ],
            [ "Dotted green leaf seeds", "var_castle_ants_dotted_green_leaf_seeds", 1, 5, 1 ],
            [ "Green leaf seeds", "var_castle_ants_green_leaf_seeds", 1, 5, 1 ],
            [ "Lime leaf seeds", "var_castle_ants_lime_leaf_seeds", 1, 5, 1 ],
            [ "Gold leaf seeds", "var_castle_ants_gold_leaf_seeds", 1, 5, 1 ],
            [ "Ants sigil", "var_castle_ants_sigil", 1, 1, 1000 ]
        ],

        "Castle golem": [ "var_castle_golem_kills",
            [ "Stone", "var_castle_golem_stone", 100000, 300000, 1 ],
            [ "Red mushroom", "var_castle_golem_red_mushroom", 1, 1, 1 ],
            [ "Mega bomb", "var_castle_golem_mega_bomb", 1, 1, 1 ],
            [ "Heavy rock", "var_castle_golem_heavy_rock", 1, 1, 1 ]
        ],

        "Castle saltwater crocodile": [ "var_castle_saltwater_crocodile_kills",
            [ "Big bones", "var_castle_saltwater_crocodile_big_bones", 1, 1, 1 ],
            [ "Castle key 5", "var_castle_saltwater_crocodile_castle_key_5", 1, 1, 1 ],
            [ "Frozen crocodile hide", "var_castle_saltwater_crocodile_frozen_crocodile_hide", 1, 3, 1 ],
            [ "Frozen crocodile mask", "var_castle_saltwater_crocodile_frozen_crocodile_mask", 1, 1, 7 ],
            [ "Frozen crocodile body", "var_castle_saltwater_crocodile_frozen_crocodile_body", 1, 1, 7 ],
            [ "Frozen crocodile legs", "var_castle_saltwater_crocodile_frozen_crocodile_legs", 1, 1, 7 ],
            [ "Frozen crocodile gloves", "var_castle_saltwater_crocodile_frozen_crocodile_gloves", 1, 1, 7 ],
            [ "Frozen crocodile boots", "var_castle_saltwater_crocodile_frozen_crocodile_boots", 1, 1, 7 ],
            [ "Saltwater crocodile sigil", "var_castle_saltwater_crocodile_sigil", 1, 1, 1000 ]
        ],

        "Castle yeti": [ "var_castle_yeti_kills",
            [ "Ice bones", "var_castle_yeti_ice_bones", 10, 10, 1 ],
            [ "Pine logs", "var_castle_yeti_pine_logs", 200, 400, 1 ],
            [ "Castle key 6", "var_castle_yeti_castle_key_6", 1, 1, 1 ],
            [ "Yeti sigil", "var_castle_yeti_sigil", 1, 1, 1000 ]
        ]
    };

    class LuckyPlugin extends IdlePixelPlusPlugin
    {
        constructor()
        {
            super("Lucky",
            {
                about:
                {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }

        getLuckFactor(minA, maxA, N, K, L)
        {
            minA = parseFloat(minA);
            maxA = parseFloat(maxA);

            N = parseFloat(N);
            K = parseFloat(K);
            L = parseFloat(L);
            
            if (K === 0) return 0.5;

            let minL = N === 1 ? K*minA : 0;
            let avgL = K/N*(minA + (maxA - minA)/2.0);
            let maxL = K*maxA;

            let result;

            if (L > maxL) // shiny luck
            {
                result = 1.01;
            }
            else if (L === 0) // not looted yet
            {
                let a = 0.5;
                let b = Math.log(2)/N;
                result = a*Math.exp(-b*K);
            }
            else
            {
                if (N === 1 && L <= minL) // special case
                {
                    result = 0.5;
                }
                else if (N === 1 && K === 1 && L === minA && L === maxA) // special case
                {
                    result = 0.5;
                }
                else if (L <= minL) // underflow
                {
                    result = 0.0;
                }
                else if (minL < L && L <= avgL)
                {
                    result = 0.5*(L-minL)/(avgL - minL);
                }
                else if (avgL < L && L < maxL)
                {
                    let a = Math.log(2)/(maxL - avgL)*N;
                    result = 0.5 + 0.5*(1 - Math.exp(-a*(L - avgL)));
                }
                else // overflow
                {
                    result = 1.0;
                }
            }            

            return result;
        }

        getLuckRank(factor)
        {
            let rank;

            if (factor > 1.0) rank = "Shiny luck"; else
            if (factor < 0.01) rank = "Insanely unlucky"; else
            if (factor < 0.05) rank = "Extremely unlucky"; else
            if (factor < 0.15) rank = "Very unlucky"; else
            if (factor < 0.25) rank = "Unlucky"; else
            if (factor < 0.35) rank = "Somewhat unlucky"; else
            if (factor < 0.45) rank = "Slightly unlucky"; else
            if (factor < 0.55) rank = "Average luck"; else
            if (factor < 0.65) rank = "Slightly lucky"; else
            if (factor < 0.75) rank = "Somewhat lucky"; else
            if (factor < 0.85) rank = "Lucky"; else
            if (factor < 0.95) rank = "Very lucky"; else
            if (factor < 0.99) rank = "Extremely lucky"; else
                rank = "Insanely lucky";            
                
            return rank;
        }
        
        getFormattedLuckFactor(self, factor, count, nl)
        {
            let rank = self.getLuckRank(factor/count);

            factor = (factor*2.0)/count;
            factor = Math.round(factor*100.0)/100.0;
            factor = Math.min(factor - 1.0, 1.0).toFixed(2);

            return rank + (nl ? '<br/>(' : ' (') + factor + ')';
        }

        updateCombatLuck(self)
        {
            let root = $('#panel-combat-log');
            let title = root.find('h1');
            let check = root.find('h5');
            let factor = 0.0;
            let count = 0;
            
            $.each(LOOT, function(index, drops)
            {
                let kills = IdlePixelPlus.getVarOrDefault(drops[0].slice(4), 0, "int");
                
                $.each(drops, function(index, drop)
                {
                    if (index <= 0) return;

                    let looted = IdlePixelPlus.getVarOrDefault(drop[1].slice(4), 0, "int");
                    let special = looted === 1 && drop[2] === 1 && drop[3] === 1 && drop[0].includes('*');

                    if (!special && drop[0] != "Coins")
                    {
                        factor += self.getLuckFactor(drop[2], drop[3], drop[4], kills, looted);
                        count++;
                    }
                });
            });

            let final = self.getFormattedLuckFactor(self, factor, count, false);
            
            if (check.length <= 0)
            {
                $('<h5>Overall combat luck: ' + final + '</h5>').insertAfter(title);
            }
            else
            {
                check.html('Overall combat luck: ' + final);
            }
        }

        updateEnemyLuck(self)
        {
            let table  = $('.combat-log-table-new');
            let rows = table.find("tr");
            let header = rows.first();
            let headers = header.children();
            let kills = headers.slice(3, 4);
            let final;

            $('<th style="border-bottom:1px solid black;padding:10px 5px;text-align:center;font-size:20pt;">Luck</th>').insertAfter(kills);
            
            $.each(rows, function(index, row)
            {
                if (index <= 0) return;

                let columns = $(row).find('td');
                let enemy = $(columns[1]).text().trim();
                let drops = LOOT[enemy];

                if (drops === undefined)
                {
                   final = 'N/A';
                }
                else
                {
                    let kills = IdlePixelPlus.getVarOrDefault(drops[0].slice(4), 0, "int");
                    let factor = 0.0;
                    let count = 0;

                    $.each(drops, function(index, drop)
                    {
                        if (index <= 0) return;

                        let looted = IdlePixelPlus.getVarOrDefault(drop[1].slice(4), 0, "int");
                        let special = looted === 1 && drop[2] === 1 && drop[3] === 1 && drop[0].includes('*');

                        if (!special && drop[0] !== "Coins")
                        {
                            factor += self.getLuckFactor(drop[2], drop[3], drop[4], kills, looted);
                            count++;
                        }
                    });
                
                    final = self.getFormattedLuckFactor(self, factor, count, true);
                }
                
                $('<td>' + final + '</td>').insertAfter($(columns[3]));
            });
        }

        updateEnemyLootLuck(self)
        {
            let table = $('.combat-log-table');
            let check = table.find('th:contains("Luck")');
            let rows = table.find("tr");
            let header = rows.first();
            let headers = header.children();
            let column  = headers.length;
            
            let enemy = $('#modal-monster-lookup-content').find('center').first().text();
            let drops = LOOT[enemy];

            if (drops !== undefined)
            {
                let kills = IdlePixelPlus.getVarOrDefault(drops[0].slice(4), 0, "int");

                header.append('<th style="background-color:#DEDEED;padding:10px;text-align:center;">Luck</th>');

                $.each(rows, function(index, row)
                {
                    if (index <= 0) return;

                    let columns = $(row).find('td');
                    let name = $(columns[1]).text().trim();
                    let drop = drops.slice(1).filter(item => item[0] === name)[0];
                    let final;

                    if (drop === undefined)
                    {
                        final = 'N/A';
                    }
                    else
                    {
                        let looted = IdlePixelPlus.getVarOrDefault(drop[1].slice(4), 0, "int");
                        let looted_real  = parseInt($(columns[4]).text().trim());
                        if (looted_real != looted) looted = looted_real;
                        let special = looted === 1 && drop[2] === 1 && drop[3] === 1 && name.includes('*');
                      
                        if (special || name === "Coins" || name === "Diamond")
                        {
                            final = "N/A";
                        }
                        else
                        {
                            let factor = self.getLuckFactor(drop[2], drop[3], drop[4], kills, looted);
                            final = self.getFormattedLuckFactor(self, factor, 1, true);
                        }
                    }
                
                    $(row).append('<td>' + final + '</td>');
                });
            }
        }

        onLogin()
        {
            loaded = true;
        }

        onPanelChanged(before, after)
        {
            if (!hooked && before != after && after === 'combat-log')
            {
                hooked = true;

                let self = this;
                let body = $('#combat-log-body');
                let lookup = $('#modal-monster-lookup');
                        
                if (body.length > 0)
                {
                    new MutationObserver(function(changesBody)
                    {
                        if (changesBody.length === 1)
                        {
                            self.updateEnemyLuck(self);
                            self.updateCombatLuck(self);
                        }
                                
                    }).observe(body[0], { childList: true, subtree: true });
                }

                if (lookup.length > 0)
                {
                    new MutationObserver(function(changesLookup)
                    { 
                        if (changesLookup[0].target.style.display === "block")
                        {
                            self.updateEnemyLootLuck(self);
                        }

                    }).observe(lookup[0], { attributes: true });
                }
            }
        }
    }

    const plugin = new LuckyPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();