// ==UserScript==
// @name         Stamp album helper
// @namespace    neopets
// @version      2022.07.16
// @description  Adds an info menu about your missing stamps
// @author       EatWooloos
// @match        *://www.neopets.com/stamps.phtml?type=album&page_id=*
// @downloadURL https://update.greasyfork.org/scripts/421034/Stamp%20album%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/421034/Stamp%20album%20helper.meta.js
// ==/UserScript==

const hasPremium = !!$("#sswmenu .imgmenu").length;
const owner = location.search.match(/owner=(.+)&*/)?.[1] || appInsightsUserName;

/****************************************************************************************
 *
 *  < Stamp Album Helper by u/Eat_Wooloo_As_Mutton >
 *
 *  This script helps you find and fill up your missing stamps much quicker and easier
 *  without having to open up an external database like Jellyneo in another tab.
 *
 *  This script uses some functionality from diceroll's Search Helper script
 *  (https://github.com/diceroll123/NeoSearchHelper)
 *
 *  Stamp list shamelessly scraped from Jellyneo item database
 *  (https://items.jellyneo.net/)
 *
 *  Stamp album data last updated 19 June 2022
 *
 ****************************************************************************************/

const STAMP_LIST = {
    "1": {
        "album": "Mystery Island",
        "list": [
            { position: 1, name: "Mystery Island Kougra Stamp", img: "stamp_mys_kou.gif", rarity: "r20" },
            { position: 2, name: "Mystery Island Aishas Stamp", img: "stamp_mys_ais.gif", rarity: "r180" },
            { position: 3, name: "Coco Stamp", img: "stamp_mys_coc.gif", rarity: "r80" },
            { position: 4, name: "Jhuidah Stamp", img: "stamp_jhuidah1.gif", rarity: "r76" },
            { position: 5, name: "Island Native Stamp", img: "stamp_mys_nat.gif", rarity: "r74" },
            { position: 6, name: "Mystery Island Hut Stamp", img: "stamp_mys_mys.gif", rarity: "r64" },
            { position: 7, name: "Assorted Fruits Stamp", img: "stamp_mys_fru.gif", rarity: "r62" },
            { position: 8, name: "Triangular Flotsam Stamp", img: "stamp_island_flotsam.gif", rarity: "r60" },
            { position: 9, name: "Zeenana Stamp", img: "stamp_island_fruit.gif", rarity: "r61" },
            { position: 10, name: "Mystery Island Grarrl Stamp", img: "stamp_island_grarrl.gif", rarity: "r101" },
            { position: 11, name: "Island Acara Stamp", img: "stamp_island_acara.gif", rarity: "r180" },
            { position: 12, name: "Haiku Stamp", img: "stamp_island_haiku.gif", rarity: "r75" },
            { position: 13, name: "Mystery Island Heads Stamp", img: "stamp_island_heads.gif", rarity: "r71" },
            { position: 14, name: "Bottle of Sand Stamp", img: "stamp_island_sand.gif", rarity: "r101" },
            { position: 15, name: "Island Uni Stamp", img: "stamp_island_uni.gif", rarity: "r101" },
            { position: 16, name: "Mystery Island Chef Stamp", img: "stamp_island_chef.gif", rarity: "r101" },
            { position: 17, name: "Tombola Stamp", img: "stamp_island_tombola.gif", rarity: "r101" },
            { position: 18, name: "Mystery Island Kiko Stamp", img: "stamp_island_kiko.gif", rarity: "r101" },
            { position: 19, name: "Island Mystic Stamp", img: "stamp_mys_mystic.gif", rarity: "r70" },
            { position: 20, name: "Ryshu Stamp", img: "stamp_mys_ryshu.gif", rarity: "r70" },
            { position: 21, name: "Need a Better Printer Stamp", img: "stamp_misprint1.gif", rarity: "r99" },
            { position: 22, name: "Upside Down Island Acara Stamp", img: "stamp_misprint2.gif", rarity: "r99" },
            { position: 23, name: "One Hundred Million Neopoint Stamp", img: "stamp_misprint3.gif", rarity: "r99" },
            { position: 24, name: "Misaligned Printer Stamp", img: "stamp_misprint4.gif", rarity: "r99" },
            { position: 25, name: "Nibbled Cooking Pot Stamp", img: "stamp_mys_pongo.gif", rarity: "r99" }
        ]
    },
    "2": {
        "album": "Virtupets",
        "list": [
            { position: 1, name: "Grimilix Stamp", img: "stamp_spa_better.gif", rarity: "r40" },
            { position: 2, name: "Neopet Version 2 Stamp", img: "stamp_spa_npv2.gif", rarity: "r82" },
            { position: 3, name: "Gormball Stamp", img: "stamp_spa_gorm.gif", rarity: "r30" },
            { position: 4, name: "Splat-A-Sloth Stamp", img: "stamp_spa_splat.gif", rarity: "r84" },
            { position: 5, name: "Dr. Sloth Stamp", img: "stamp_spa_sloth.gif", rarity: "r90" },
            { position: 6, name: "Space Faerie Stamp", img: "stamp_spa_faerie2.gif", rarity: "r93" },
            { position: 7, name: "Grinning Sloth Stamp", img: "stamp_space_sloth2.gif", rarity: "r85" },
            { position: 8, name: "Zygorax Stamp", img: "stamp_space_zygorax.gif", rarity: "r80" },
            { position: 9, name: "Purple Grundo Stamp", img: "stamp_space_grundo.gif", rarity: "r75" },
            { position: 10, name: "Commander Garoo Stamp", img: "stamp_space_garoo.gif", rarity: "r101" },
            { position: 11, name: "Roast Gargapple Stamp", img: "stamp_space_food.gif", rarity: "r85" },
            { position: 12, name: "N4 Bot Stamp", img: "stamp_space_n4bot.gif", rarity: "r80" },
            { position: 13, name: "Blarthrox Stamp", img: "stamp_blarthrox.gif", rarity: "r80" },
            { position: 14, name: "Tazzalor Stamp", img: "stamp_zyrolon.gif", rarity: "r86" },
            { position: 15, name: "Zyrolon Stamp", img: "stamp_tazzalor.gif", rarity: "r90" },
            { position: 16, name: "Advert Attack Stamp", img: "stamp_advert_attack.gif", rarity: "r70" },
            { position: 17, name: "Evil Fuzzles Stamp", img: "sta_space_evilfuzzles.gif", rarity: "r89" },
            { position: 18, name: "Gargarox Isafuhlarg Stamp", img: "sta_space_grundochef.gif", rarity: "r92" },
            { position: 19, name: "Mutant Grundo Stamp", img: "sta_space_mutantgrundo.gif", rarity: "r86" },
            { position: 20, name: "Zurroball Stamp", img: "sta_space_zurroball.gif", rarity: "r90" },
            { position: 21, name: "Double Printed Evil Fuzzle Stamp", img: "stamp_spa_evil.gif", rarity: "r99" },
            { position: 22, name: "Inverted Space Faerie Stamp", img: "stamp_spa_faerie.gif", rarity: "r99" },
            { position: 23, name: "Grundo Warehouse Stamp", img: "sta_grundo.gif", rarity: "r97" },
            { position: 24, name: "Virtupets Space Station Stamp", img: "sta_space.gif", rarity: "r98" },
            { position: 25, name: "Holographic Virtupets Stamp", img: "sta_logo.gif", rarity: "r99" }
        ]
    },
    "3": {
        "album": "Tyrannia",
        "list": [
            { position: 1, name: "Chomby Stamp", img: "stamp_tyrannia_chomby.gif", rarity: "r101" },
            { position: 2, name: "Tyrannian Elephante Stamp", img: "stamp_tyrannia_elephante.gif", rarity: "r101" },
            { position: 3, name: "Grarrg Stamp", img: "stamp_tyrannia_grarrl.gif", rarity: "r101" },
            { position: 4, name: "Tyrannian Kougra Stamp", img: "stamp_tyrannia_kougra.gif", rarity: "r101" },
            { position: 5, name: "Tyrannia Stamp", img: "stamp_tyrannia_landscape.gif", rarity: "r101" },
            { position: 6, name: "Omelette Stamp", img: "stamp_tyrannia_omelette.gif", rarity: "r101" },
            { position: 7, name: "Tar Pit Stamp", img: "stamp_tyrannia_tarpit.gif", rarity: "r101" },
            { position: 8, name: "Wock Til You Drop Stamp", img: "stamp_tyrannia_wock.gif", rarity: "r101" },
            { position: 9, name: "Tyrannian Grarrl Stamp", img: "stamp_tyrannia_night.gif", rarity: "r80" },
            { position: 10, name: "Chunk of Meat Stamp", img: "stamp_tyrannia_meat.gif", rarity: "r50" },
            { position: 11, name: "Tyrannian Kyrii Stamp", img: "stamp_tyrannia_kyrii.gif", rarity: "r55" },
            { position: 12, name: "Tyrannian JubJub Stamp", img: "stamp_tyrannia_jubjub.gif", rarity: "r58" },
            { position: 13, name: "Tyrannian Korbat Stamp", img: "stamp_tyrannia_korbat.gif", rarity: "r60" },
            { position: 14, name: "Tyrannian Blumaroo Stamp", img: "stamp_tyrannia_blum.gif", rarity: "r80" },
            { position: 15, name: "Tyrannian Plateau Stamp", img: "stamp_tyr_plateau.gif", rarity: "r86" },
            { position: 16, name: "Flying Korbats Stamp", img: "stamp_tyr_korbat.gif", rarity: "r88" },
            { position: 17, name: "Stone Armchair Stamp", img: "stamp_tyrannia_furn1.gif", rarity: "r70" },
            { position: 18, name: "Giant Leaf Curtains Stamp", img: "stamp_tyrannia_furn2.gif", rarity: "r80" },
            { position: 19, name: "Bone Chair Stamp", img: "stamp_tyrannia_furn3.gif", rarity: "r79" },
            { position: 20, name: "Tyrannian Usul Stamp", img: "stamp_tyrannia_usul.gif", rarity: "r85" },
            { position: 21, name: "Monocerous Stamp", img: "stamp_tyrannia_monocerous.gif", rarity: "r110" },
            { position: 22, name: "Kyruggi Stamp", img: "stamp_tyrannia_kyruggi.gif", rarity: "r101" },
            { position: 23, name: "Discovery of Fire Stamp", img: "stamp_tyrannia_fire.gif", rarity: "r110" },
            { position: 24, name: "Shiny Monoceraptor Stamp", img: "stamp_tyrannia_mono.gif", rarity: "r97" },
            { position: 25, name: "Stone Stamp", img: "stamp_tyr_stone.gif", rarity: "r98" }
        ]
    },
    "4": {
        "album": "Haunted Woods",
        "list": [
            { position: 1, name: "Brain Tree Stamp", img: "stamp_hal_brain.gif", rarity: "r80" },
            { position: 2, name: "Esophagor Stamp", img: "stamp_hal_esoph.gif", rarity: "r70" },
            { position: 3, name: "Fetch! Stamp", img: "stamp_hal_fetch.gif", rarity: "r60" },
            { position: 4, name: "Haunted Mansion Stamp", img: "stamp_hal_house.gif", rarity: "r92" },
            { position: 5, name: "Spyder Stamp", img: "stamp_hal_spyder.gif", rarity: "r90" },
            { position: 6, name: "Scary Tree Stamp", img: "stamp_hal_trees.gif", rarity: "r101" },
            { position: 7, name: "Hubrid Nox Stamp", img: "stamp_haunted_hubrid.gif", rarity: "r85" },
            { position: 8, name: "Mutant Usul Stamp", img: "stamp_haunted_mutantusul.gif", rarity: "r76" },
            { position: 9, name: "Rock Stamp", img: "stamp_haunted_petrock.gif", rarity: "r70" },
            { position: 10, name: "Carnival of Terror Stamp", img: "stamp_haunted_carnival.gif", rarity: "r80" },
            { position: 11, name: "Korbats Lab Stamp", img: "stamp_hal_korbatslab.gif", rarity: "r70" },
            { position: 12, name: "Luperus Left Head Stamp", img: "stamp_haunted_cerbekusleft.gif", rarity: "r92" },
            { position: 13, name: "Luperus Centre Head Stamp", img: "stamp_haunted_cerbekuscenter.gif", rarity: "r93" },
            { position: 14, name: "Luperus Right Head Stamp", img: "stamp_haunted_cerbekusright.gif", rarity: "r94" },
            { position: 15, name: "Halloween Aisha Stamp", img: "stamp_hal_aishahal.gif", rarity: "r70" },
            { position: 16, name: "Spooky Gravestone Stamp", img: "stamp_hal_rip.gif", rarity: "r78" },
            { position: 17, name: "Moonlit Werelupe Stamp", img: "stamp_hal_were.gif", rarity: "r80" },
            { position: 18, name: "Moonlit Esophagor Stamp", img: "stamp_hal_eso.gif", rarity: "r82" },
            { position: 19, name: "Edna the Zafara Stamp", img: "stamp_edna.gif", rarity: "r90" },
            { position: 20, name: "Glowing Brain Tree Stamp", img: "stamp_hal_tree.gif", rarity: "r88" },
            { position: 21, name: "ARGH!!!! DONNA STAMP", img: "stamp_hal_scary.gif", rarity: "r99" },
            { position: 22, name: "Count Von Roo Stamp", img: "stamp_haunted_vonroo.gif", rarity: "r98" },
            { position: 23, name: "Misprint Meuka Stamp", img: "stamp_hal_meucapound.gif", rarity: "r99" },
            { position: 24, name: "Holographic Magax Stamp", img: "stamp_hal_magax.gif", rarity: "r99" },
            { position: 25, name: "Foil Slorg Stamp", img: "stamp_hal_slorg.gif", rarity: "r99" }
        ]
    },
    "5": {
        "album": "Neopia Central",
        "list": [
            { position: 1, name: "Alien Aisha Vending Stamp", img: "stamp_neo_alienvend.gif", rarity: "r80" },
            { position: 2, name: "Orange Skeith Stamp", img: "stamp_skeith_orange.gif", rarity: "r50" },
            { position: 3, name: "Skeith Bank Manager Stamp", img: "stamp_skeith_bank.gif", rarity: "r70" },
            { position: 4, name: "Robot Skeith Stamp", img: "stamp_skeith_robot.gif", rarity: "r50" },
            { position: 5, name: "Huberts Hot Dogs Stamp", img: "stamp_neo_hotdog.gif", rarity: "r70" },
            { position: 6, name: "Wishing Well Stamp", img: "stamp_neo_well.gif", rarity: "r65" },
            { position: 7, name: "Money Tree Stamp", img: "stamp_neo_money.gif", rarity: "r60" },
            { position: 8, name: "Rainbow Pool Stamp", img: "stamp_neo_rainbow.gif", rarity: "r90" },
            { position: 9, name: "Kauvara Stamp", img: "stamp_neo_kauvara.gif", rarity: "r80" },
            { position: 10, name: "Shop Wizard Stamp", img: "stamp_neo_shopwiz.gif", rarity: "r85" },
            { position: 11, name: "Book Shop Nimmo Stamp", img: "stamp_neo_book.gif", rarity: "r70" },
            { position: 12, name: "Petpets Stamp", img: "stamp_neo_petpets.gif", rarity: "r101" },
            { position: 13, name: "Seasonal Stamp", img: "ad_seasonalstamp.gif", rarity: "r180" },
            { position: 14, name: "Neolodge Stamp", img: "stamp_nc_lodge.gif", rarity: "r73" },
            { position: 15, name: "Year 5 Stamp", img: "ad_year5stamp.gif", rarity: "r180" },
            { position: 16, name: "Deluxe Money Tree Stamp", img: "stamp_nc_tree.gif", rarity: "r85" },
            { position: 17, name: "Neopian Hospital Stamp", img: "sta_gelert_doctor.gif", rarity: "r87" },
            { position: 18, name: "Jelly Pop Stamp", img: "stamp_jelly_pop.gif", rarity: "r86" },
            { position: 19, name: "Jelly World Stamp", img: "stamp_jelly_world.gif", rarity: "r90" },
            { position: 20, name: "Usukiland Stamp", img: "sta_usukiland.gif", rarity: "r88" },
            { position: 21, name: "Super Bright Rainbow Pool Stamp", img: "stamp_nc_rain.gif", rarity: "r89" },
            { position: 22, name: "Foil Food Shop Stamp", img: "stamp_neo_food_foil.gif", rarity: "r99" },
            { position: 23, name: "Chocolate Factory Stamp", img: "sta_chocfactory.gif", rarity: "r89" },
            { position: 24, name: "Midnight Jelly World Stamp", img: "stamp_jelly_night.gif", rarity: "r101" },
            { position: 25, name: "Neopia Central Scene Stamp", img: "sta_aerial.gif", rarity: "r89" }
        ]
    },
    "6": {
        "album": "NeoQuest",
        "list": [
            { position: 1, name: "NeoQuest Logo Stamp", img: "stamp_nq_logo.gif", rarity: "r98" },
            { position: 2, name: "NeoQuest Hero Stamp", img: "stamp_nq_hero.gif", rarity: "r98" },
            { position: 3, name: "Jahbal Stamp", img: "stamp_nq_jahbal.gif", rarity: "r98" },
            { position: 4, name: "Rotting Skeleton Stamp", img: "stamp_neoquest_skeleton.gif", rarity: "r50" },
            { position: 5, name: "Mist Kougra Stamp", img: "stamp_neoquest_mistkougra.gif", rarity: "r60" },
            { position: 6, name: "Plains Aisha Stamp", img: "stamp_neoquest_aisha.gif", rarity: "r70" },
            { position: 7, name: "Two Rings Archmagus Stamp", img: "stamp_neoquest_archmagus.gif", rarity: "r70" },
            { position: 8, name: "Boraxis the Healer Stamp", img: "stamp_neoquest_boraxis.gif", rarity: "r74" },
            { position: 9, name: "Two Rings Crusader Stamp", img: "stamp_neoquest_crusader.gif", rarity: "r78" },
            { position: 10, name: "Pomanna Stamp", img: "stamp_neoquest_pomanna.gif", rarity: "r80" },
            { position: 11, name: "Mokti and Rikti Stamp", img: "stamp_mokti_rikti.gif", rarity: "r88" },
            { position: 12, name: "Mr Irgo Stamp", img: "stamp_neoquest_irgo.gif", rarity: "r60" },
            { position: 13, name: "Black Bearog Stamp", img: "stamp_neoquest_bearog.gif", rarity: "r50" },
            { position: 14, name: "Gatekeeper Stamp", img: "stamp_gatekeeper.gif", rarity: "r89" },
            { position: 15, name: "Leirobas Stamp", img: "stamp_leirobas.gif", rarity: "r70" },
            { position: 16, name: "Archmagus of Roo Stamp", img: "stamp_neoquest_archmagusroo.gif", rarity: "r70" },
            { position: 17, name: "Golden Mr Irgo Stamp", img: "stamp_mr_irgo.gif", rarity: "r180" },
            { position: 18, name: "Zombie Faleinn Stamp", img: "sta_faleinn.gif", rarity: "r87" },
            { position: 19, name: "Kreai Stamp", img: "sta_kreai.gif", rarity: "r90" },
            { position: 20, name: "Morax Dorangis Stamp", img: "sta_morgaxdorangis.gif", rarity: "r80" },
            { position: 21, name: "Guardian Of Spectral Magic Stamp", img: "sta_spectralmagic.gif", rarity: "r96" },
            { position: 22, name: "Tylix Stamp", img: "sta_tylix.gif", rarity: "r89" },
            { position: 23, name: "Eleus Stamp", img: "sta_eleus.gif", rarity: "r90" },
            { position: 24, name: "Gors The Mighty Stamp", img: "sta_gors.gif", rarity: "r97" },
            { position: 25, name: "Xantan Stamp", img: "sta_xantan.gif", rarity: "r99" }
        ]
    },
    "7": {
        "album": "Snowy Valley",
        "list": [
            { position: 1, name: "Snow Wars Catapult Stamp", img: "stamp_snowy_snowwars.gif", rarity: "r58" },
            { position: 2, name: "Rainbow Slushie Stamp", img: "stamp_snowy_slushie.gif", rarity: "r60" },
            { position: 3, name: "Frosty Snowman Stamp", img: "stamp_snowy_man.gif", rarity: "r75" },
            { position: 4, name: "Wintery Petpet Shop Stamp", img: "stamp_snowy_ginger.gif", rarity: "r79" },
            { position: 5, name: "Wintery Bruce Stamp", img: "stamp_snowy_bruce.gif", rarity: "r78" },
            { position: 6, name: "Christmas Meerca Stamp", img: "stamp_snowy_meerca.gif", rarity: "r83" },
            { position: 7, name: "Terror Mountain Scene Stamp", img: "stamp_snowy_valley.gif", rarity: "r80" },
            { position: 8, name: "Igloo Garage Sale Stamp", img: "stamp_snowy_igloo.gif", rarity: "r80" },
            { position: 9, name: "Rink Runner Stamp", img: "stamp_snowy_rink.gif", rarity: "r85" },
            { position: 10, name: "Christmas Kougra Stamp", img: "stamp_snowy_kougra.gif", rarity: "r75" },
            { position: 11, name: "Christmas Uni Stamp", img: "sta_christmasuni.gif", rarity: "r70" },
            { position: 12, name: "Christmas Zafara Stamp", img: "stamp_snowy_zafara.gif", rarity: "r80" },
            { position: 13, name: "Scratchcard Kiosk Stamp", img: "stamp_snowy_wocky.gif", rarity: "r84" },
            { position: 14, name: "Candychan Stamp", img: "stamp_snowy_candychan.gif", rarity: "r180" },
            { position: 15, name: "Grundo Snow Throw Stamp", img: "sta_grundothrow.gif", rarity: "r82" },
            { position: 16, name: "Stocking Stamp", img: "sta_stocking.gif", rarity: "r80" },
            { position: 17, name: "Cliffhanger Stamp", img: "sta_cliffhanger.gif", rarity: "r88" },
            { position: 18, name: "Christmas Scene Stamp", img: "sta_winter_christmas_kougra.gif", rarity: "r89" },
            { position: 19, name: "SHFISS Stamp", img: "sta_winter_snow_shop.gif", rarity: "r80" },
            { position: 20, name: "Negg Faerie Stamp", img: "stamp_snowy_neggfaerie.gif", rarity: "r90" },
            { position: 21, name: "Snow Faerie Stamp", img: "stamp_snowy_faerie.gif", rarity: "r80" },
            { position: 22, name: "Ski Lodge Stamp", img: "sta_winter_ski_lodge.gif", rarity: "r86" },
            { position: 23, name: "Snowager Stamp", img: "stamp_snowy_snowager.gif", rarity: "r89" },
            { position: 24, name: "Snowbunny Stamp", img: "sta_winter_snowbunny.gif", rarity: "r99" },
            { position: 25, name: "Sticky Snowflake Stamp", img: "sta_winter_sticky_snowflake.gif", rarity: "r99" }
        ]
    },
    "8": {
        "album": "Meridell vs. Darigan",
        "list": [
            { position: 1, name: "Meridell Heroes Stamp", img: "stamp_destruct_fight.gif", rarity: "r94" },
            { position: 2, name: "Darigan Citadel Stamp", img: "stamp_destruct_castle3.gif", rarity: "r93" },
            { position: 3, name: "Meridell Castle Stamp", img: "stamp_destruct_castle2.gif", rarity: "r92" },
            { position: 4, name: "Green Knight Stamp", img: "stamp_destruct_greenknight.gif", rarity: "r91" },
            { position: 5, name: "Lisha vs Zombie Lisha Stamp", img: "stamp_destruct_aisha.gif", rarity: "r90" },
            { position: 6, name: "Morris Stamp", img: "stamp_meridell_morris.gif", rarity: "r96" },
            { position: 7, name: "Skeith Defender Stamp", img: "stamp_meridell_skeithdefender.gif", rarity: "r98" },
            { position: 8, name: "Darigan Moehog Stamp", img: "stamp_meridell_darmoehog.gif", rarity: "r97" },
            { position: 9, name: "Boris Stamp", img: "sta_bfm_lastone.gif", rarity: "r90" },
            { position: 10, name: "Draik Guard Stamp", img: "sta_meridell_draikguard.gif", rarity: "r84" },
            { position: 11, name: "Yellow Knight Stamp", img: "sta_meridell_yellowknight.gif", rarity: "r95" },
            { position: 12, name: "Meridell Shield Stamp", img: "sta_meridell_shield.gif", rarity: "r89" },
            { position: 13, name: "Drackonack Stamp", img: "sta_meridell_drackonack.gif", rarity: "r97" },
            { position: 14, name: "Darigan Shield Stamp", img: "stamp_darigan_shield.gif", rarity: "r86" },
            { position: 15, name: "Darigan Eyrie Stamp", img: "stamp_meridell_dareyrie.gif", rarity: "r79" },
            { position: 16, name: "Turmaculus Stamp", img: "stamp_meridell_turmaculus.gif", rarity: "r89" },
            { position: 17, name: "Darigan Elemental Stamp", img: "stamp_darigan_elemental.gif", rarity: "r80" },
            { position: 18, name: "Illusen Stamp", img: "stamp_meridell_illusen.gif", rarity: "r90" },
            { position: 19, name: "Jeran Stamp", img: "stamp_darigan_jeran.gif", rarity: "r90" },
            { position: 20, name: "Golden Orb Stamp", img: "stamp_orb.gif", rarity: "r80" },
            { position: 21, name: "Zombified Heroes Stamp", img: "stamp_darigan_zombies.gif", rarity: "r93" },
            { position: 22, name: "Lord Darigan Stamp", img: "stamp_darigan.gif", rarity: "r82" },
            { position: 23, name: "King Skarl Stamp", img: "stamp_meridell_skarl.gif", rarity: "r90" },
            { position: 24, name: "Master Vex Stamp", img: "stamp_vex.gif", rarity: "r85" },
            { position: 25, name: "Darigan Spectre Stamp", img: "sta_meridell_dariganspect.gif", rarity: "r99" }
        ]
    },
    "9": {
        "album": "Lost Desert",
        "list": [
            { position: 1, name: "Golden Khamette Stamp", img: "stamp_desert6.gif", rarity: "r62" },
            { position: 2, name: "Desert Petpet Stamp", img: "stamp_desert5.gif", rarity: "r60" },
            { position: 3, name: "Pyramid Sun Rise Stamp", img: "stamp_desert4.gif", rarity: "r58" },
            { position: 4, name: "Lost Desert Grarrl Stamp", img: "stamp_desert3.gif", rarity: "r70" },
            { position: 5, name: "Advisor Wessle Stamp", img: "stamp_desert_wessle.gif", rarity: "r60" },
            { position: 6, name: "Senator Palpus Stamp", img: "stamp_desert_palpus.gif", rarity: "r60" },
            { position: 7, name: "Midnight Desert Lupe Stamp", img: "stamp_desert2.gif", rarity: "r80" },
            { position: 8, name: "Ummagine Stamp", img: "stamp_desert_ummagine.gif", rarity: "r180" },
            { position: 9, name: "Osiris Pottery Stamp", img: "stamp_desert_pottery.gif", rarity: "r76" },
            { position: 10, name: "Senator Barca Stamp", img: "stamp_desert_barca.gif", rarity: "r80" },
            { position: 11, name: "Desert Paintbrush Stamp", img: "stamp_desert_pb.gif", rarity: "r89" },
            { position: 12, name: "Peopatra Stamp", img: "stamp_desert_peopatra.gif", rarity: "r78" },
            { position: 13, name: "Grackle Bug Stamp", img: "sta_gracklebug.gif", rarity: "r60" },
            { position: 14, name: "Princess Sankara Stamp", img: "stamp_desert_sankara.gif", rarity: "r80" },
            { position: 15, name: "Lost Desert Scroll Stamp", img: "stamp_desert1.gif", rarity: "r90" },
            { position: 16, name: "Lost Desert Sphinx Stamp", img: "sta_kacheeksphinx.gif", rarity: "r76" },
            { position: 17, name: "Tug Of War Stamp", img: "sta_tugowar.gif", rarity: "r79" },
            { position: 18, name: "Fruit Machine Stamp", img: "sta_fruitmachine.gif", rarity: "r80" },
            { position: 19, name: "Sakhmet Palace Stamp", img: "stamp_desert_sakhmet.gif", rarity: "r80" },
            { position: 20, name: "Holographic Sakhmet City Stamp", img: "sta_sakhmet.gif", rarity: "r89" },
            { position: 21, name: "Geb Stamp", img: "stamp_desert_geb.gif", rarity: "r84" },
            { position: 22, name: "Coltzan Stamp", img: "stamp_desert_coltzan.gif", rarity: "r101" },
            { position: 23, name: "Scarab Stamp", img: "stamp_desert_scarab.gif", rarity: "r93" },
            { position: 24, name: "Lucky Coin Stamp", img: "stamp_desert_coin.gif", rarity: "r92" },
            { position: 25, name: "Holographic Coltzans Shrine Stamp", img: "stamp_desert_shrine.gif", rarity: "r99" }
        ]
    },
    "10": {
        "album": "The Battledome",
        "list": [
            { position: 1, name: "Sword of Skardsen Stamp", img: "sta_bd_swordofscardsen.gif", rarity: "r88" },
            { position: 2, name: "Attack Pea Stamp", img: "sta_bd_attackpea.gif", rarity: "r76" },
            { position: 3, name: "Slorg Flakes Stamp", img: "sta_bd_slorgflakes.gif", rarity: "r68" },
            { position: 4, name: "Faerie Slingshot Stamp", img: "sta_bd_slingshot.gif", rarity: "r70" },
            { position: 5, name: "Hubrids Puzzle Box Stamp", img: "sta_bd_puzzlebox.gif", rarity: "r72" },
            { position: 6, name: "Eraser of the Dark Faerie Stamp", img: "sta_bd_darkfaerieeraser.gif", rarity: "r87" },
            { position: 7, name: "Jhudoras Bewitched Ring Stamp", img: "sta_jhudoraring.gif", rarity: "r86" },
            { position: 8, name: "Everlasting Crystal Apple Stamp", img: "sta_crystalapple.gif", rarity: "r84" },
            { position: 9, name: "Sword of the Air Faerie Stamp", img: "sta_airsword.gif", rarity: "r85" },
            { position: 10, name: "Jewelled Scarab Stamp", img: "stamp_jeweledscarab.gif", rarity: "r88" },
            { position: 11, name: "Rod Of Dark Nova Stamp", img: "stamp_rodofdarknova.gif", rarity: "r89" },
            { position: 12, name: "Jade Scorchstone Stamp", img: "stamp_jadescorchstone.gif", rarity: "r90" },
            { position: 13, name: "Thyoras Tear Stamp", img: "sta_thyoras_tear.gif", rarity: "r80" },
            { position: 14, name: "Exploding Space Bugs Stamp", img: "sta_exploding_space_bugs.gif", rarity: "r85" },
            { position: 15, name: "Monoceraptor Claw Stamp", img: "sta_monoceraptor_claw.gif", rarity: "r83" },
            { position: 16, name: "Wand Of The Dark Faerie Stamp", img: "sta_bd_darkwand.gif", rarity: "r87" },
            { position: 17, name: "Alien Aisha Myriad Stamp", img: "sta_myriad.gif", rarity: "r88" },
            { position: 18, name: "Alien Aisha Ray Gun Stamp", img: "sta_bd_alienaishagun.gif", rarity: "r86" },
            { position: 19, name: "Kings Lens Stamp", img: "sta_bd_kings_lens.gif", rarity: "r87" },
            { position: 20, name: "Ring of Sloth Stamp", img: "sta_bd_sloth_ring.gif", rarity: "r180" },
            { position: 21, name: "Illusens Staff Stamp", img: "sta_bd_staff_illusen.gif", rarity: "r85" },
            { position: 22, name: "Shield Of Pion Troect Stamp", img: "sta_bd_pion_shield.gif", rarity: "r80" },
            { position: 23, name: "Rainbow Sticky Hand Stamp", img: "sta_rainbowhand.gif", rarity: "r96" },
            { position: 24, name: "Dark Battle Duck Stamp", img: "sta_darkduck.gif", rarity: "r98" },
            { position: 25, name: "Battle Slices Stamp", img: "sta_bd_slices.gif", rarity: "r99" }
        ],
    },
    "11": {
        "album": "Coins",
        "list": [
            { position: 1, name: "Silver Babaa Coin", img: "coin_babaa.gif", rarity: "r95" },
            { position: 2, name: "Book Coin", img: "coin_book.gif", rarity: "r96" },
            { position: 3, name: "Brass Usuki Coin", img: "coin_usuki.gif", rarity: "r97" },
            { position: 4, name: "Money Tree Coin", img: "coin_tree.gif", rarity: "r99" },
            { position: 5, name: "Rainbow Pool Coin", img: "coin_pool.gif", rarity: "r98" },
            { position: 6, name: "Eliv Thade Coin", img: "coin_elivthade.gif", rarity: "r96" },
            { position: 7, name: "Turtum Coin", img: "coin_turtum.gif", rarity: "r97" },
            { position: 8, name: "Silver Buzzer Coin", img: "coin_buzzer.gif", rarity: "r96" },
            { position: 9, name: "Snow PaintBrush Coin", img: "coin_snow_petpet_pb.gif", rarity: "r96" },
            { position: 10, name: "Frozen Snowflake Coin", img: "coi_icy.gif", rarity: "r88" },
            { position: 11, name: "Silver Concert Hall Coin", img: "coi_tyrannian.gif", rarity: "r92" },
            { position: 12, name: "Hasee Coin", img: "coin_hasee.gif", rarity: "r98" },
            { position: 13, name: "Bronze Mystery Island Coin", img: "coi_mystery.gif", rarity: "r90" },
            { position: 14, name: "Golden Scarab Coin", img: "coi_desert.gif", rarity: "r95" },
            { position: 15, name: "Giant Ghostkerchief Coin", img: "coin_gaintghostkerchief.gif", rarity: "r98" },
            { position: 16, name: "Defenders Of Neopia Coin", img: "coin_defenders.gif", rarity: "r98" },
            { position: 17, name: "Goo Blaster Coin", img: "coin_gooblaster.gif", rarity: "r95" },
            { position: 18, name: "Larnikin Coin", img: "coin_larnikin.gif", rarity: "r98" },
            { position: 19, name: "PaintBrush Coin", img: "coin_paintbrush.gif", rarity: "r99" },
            { position: 20, name: "Chocolate Factory Coin", img: "coi_chocfactory.gif", rarity: "r95" },
            { position: 21, name: "Battledome Coin", img: "coi_battledome.gif", rarity: "r93" },
            { position: 22, name: "Dr Sloth Coin", img: "coi_sloth.gif", rarity: "r98" },
            { position: 23, name: "Crystal Kauvara Coin", img: "coin_kauvara.gif", rarity: "r98" },
            { position: 24, name: "Neopian Times Coin", img: "coi_quill.gif", rarity: "r100" },
            { position: 25, name: "Emerald Eyrie Coin", img: "coin_emerald_eyrie.gif", rarity: "r100" }
        ]
    },
    "12": {
        "album": "Battle For Meridell",
        "list": [
            { position: 1, name: "Dark Graspberry Stamp", img: "sta_darkgraspberry.gif", rarity: "r86" },
            { position: 2, name: "Gelert Prince Stamp", img: "sta_gelertprince.gif", rarity: "r84" },
            { position: 3, name: "Sunblade Stamp", img: "sta_sunblade.gif", rarity: "r90" },
            { position: 4, name: "Meridell Gardens Stamp", img: "sta_meridellgardens.gif", rarity: "r87" },
            { position: 5, name: "Petpet Growth Syrup Stamp", img: "sta_growth_syrup.gif", rarity: "r83" },
            { position: 6, name: "Zafara Princess Stamp", img: "sta_zafara_princess.gif", rarity: "r85" },
            { position: 7, name: "Gallion Stamp", img: "sta_gallion.gif", rarity: "r80" },
            { position: 8, name: "Quiggle Scout Stamp", img: "sta_quiggle_scout.gif", rarity: "r85" },
            { position: 9, name: "Blugthak Stamp", img: "sta_bfm_blugthak.gif", rarity: "r96" },
            { position: 10, name: "Castle Defender Stamp", img: "sta_bfm_defender.gif", rarity: "r90" },
            { position: 11, name: "Usul-in-waiting Stamp", img: "sta_bfm_usul.gif", rarity: "r89" },
            { position: 12, name: "Blumaroo Court Jester Stamp", img: "sta_bfm_jester.gif", rarity: "r92" },
            { position: 13, name: "King Skarl Plushie Stamp", img: "sta_bfm_skarlplush.gif", rarity: "r89" },
            { position: 14, name: "Nova Storm Stamp", img: "sta_bfm_nova.gif", rarity: "r88" },
            { position: 15, name: "105 Castle Secrets Stamp", img: "sta_bfm_secrets.gif", rarity: "r87" },
            { position: 16, name: "Exploding Acorns Stamp", img: "sta_bfm_acorns.gif", rarity: "r86" },
            { position: 17, name: "Zafara Double Agent Stamp", img: "sta_bfm_zafara_agent.gif", rarity: "r96" },
            { position: 18, name: "Battle Uni Stamp", img: "sta_bfm_battle_uni.gif", rarity: "r97" },
            { position: 19, name: "Court Dancer Stamp", img: "sta_bfm_court_dancer.gif", rarity: "r98" },
            { position: 20, name: "Hadrak Stamp", img: "sta_bfm_hadrak.gif", rarity: "r98" },
            { position: 21, name: "Morguss Stamp", img: "sta_morguss.gif", rarity: "r98" },
            { position: 22, name: "Meerca Spy Stamp", img: "sta_meerca_spy.gif", rarity: "r98" },
            { position: 23, name: "The Great Battle Stamp", img: "sta_great_battle.gif", rarity: "r99" },
            { position: 24, name: "Lord Kass Stamp", img: "sta_kass.gif", rarity: "r99" },
            { position: 25, name: "The Three Stamp", img: "sta_three.gif", rarity: "r99" }
        ]
    },
    "13": {
        "album": "NeoQuest II",
        "list": [
            { position: 1, name: "Trestin Stamp", img: "sta_nq2_trestin.gif", rarity: "r87" },
            { position: 2, name: "Librarian Stamp", img: "sta_nq2_librarian.gif", rarity: "r86" },
            { position: 3, name: "Rohanes Mother Stamp", img: "sta_nq2_rohanes_mother.gif", rarity: "r87" },
            { position: 4, name: "Temple Of The Sky Stamp", img: "sta_nq2_temple.gif", rarity: "r89" },
            { position: 5, name: "Hubrid Noxs Mountain Fortress Stamp", img: "sta_nq2_hubrid_fortress.gif", rarity: "r88" },
            { position: 6, name: "NeoQuest II Logo Stamp", img: "sta_nq2_logo.gif", rarity: "r87" },
            { position: 7, name: "Devilpuss Stamp", img: "sta_nq2_devilpuss.gif", rarity: "r89" },
            { position: 8, name: "Celestial Talisman Stamp", img: "sta_nq2_talisman.gif", rarity: "r88" },
            { position: 9, name: "Slime Titan Stamp", img: "sta_nq2slimemonster.gif", rarity: "r89" },
            { position: 10, name: "Kolvars Stamp", img: "sta_nq2spyder.gif", rarity: "r89" },
            { position: 11, name: "Rampaging Grundonoil Stamp", img: "sta_nq2grundonoil.gif", rarity: "r89" },
            { position: 12, name: "Northern Watch Tower Stamp", img: "sta_neoquest2_ntower.gif", rarity: "r96" },
            { position: 13, name: "Lost City of Phorofor Stamp", img: "sta_neoquest2_phorofor.gif", rarity: "r95" },
            { position: 14, name: "Shadow Gulch Stamp", img: "sta_neoquest2_gultch.gif", rarity: "r95" },
            { position: 15, name: "Von Roos Castle Stamp", img: "sta_neoquest2_vonroo.gif", rarity: "r97" },
            { position: 16, name: "Velm Stamp", img: "sta_nq_velm.gif", rarity: "r93" },
            { position: 17, name: "Talinia Stamp", img: "sta_nq_talinia.gif", rarity: "r94" },
            { position: 18, name: "Rohane Stamp", img: "sta_nq_rohane.gif", rarity: "r80" },
            { position: 19, name: "Mipsy Stamp", img: "sta_nq_mipsy.gif", rarity: "r92" },
            { position: 20, name: "Sword Of Apocalypse Stamp", img: "sta_sword_of_apocalypse.gif", rarity: "r98" },
            { position: 21, name: "NeoQuest II Esophagor Stamp", img: "sta_nq2_esophagor.gif", rarity: "r98" },
            { position: 22, name: "Scuzzy Stamp", img: "sta_nq2_scuzzy.gif", rarity: "r99" },
            { position: 23, name: "Anubits Stamp", img: "sta_nq2_anubits.gif", rarity: "r97" },
            { position: 24, name: "Ramtor Stamp", img: "sta_nq2_ramtor.gif", rarity: "r98" },
            { position: 25, name: "Terask Stamp", img: "sta_nq2_terask.gif", rarity: "r99" }
        ]
    },
    "14": {
        "album": "Other",
        "list": [
            { position: 1, name: "Golden Coco Stamp", img: "sta_coconut_golden.gif", rarity: "r101" },
            { position: 2, name: "Dice-A-Roo Stamp", img: "sta_dicearoo.gif", rarity: "r65" },
            { position: 3, name: "Lutari Uni Stamp", img: "sta_lut_uni.gif", rarity: "r101" },
            { position: 4, name: "Commemorative Defenders Stamp #1", img: "sta_defenders_kacheek.gif", rarity: "r69" },
            { position: 5, name: "Destruct-O-Match Stamp", img: "sta_destructo.gif", rarity: "r71" },
            { position: 6, name: "Commemorative Defenders Stamp #2", img: "sta_defenders_wocky.gif", rarity: "r74" },
            { position: 7, name: "Grand Theft Ummagine Stamp", img: "sta_grandtheft.gif", rarity: "r78" },
            { position: 8, name: "Shenkuu Bridge Stamp", img: "sta_shenkuubridge.gif", rarity: "r80" },
            { position: 9, name: "Suteks Tomb Stamp", img: "sta_sutekstomb.gif", rarity: "r81" },
            { position: 10, name: "Attack of the Slorgs Stamp", img: "sta_attack_slorgs.gif", rarity: "r82" },
            { position: 11, name: "Pile of Dung Stamp", img: "sta_pile_of_dung.gif", rarity: "r84" },
            { position: 12, name: "Faerie Bubbles Stamp", img: "sta_faerie_bubbles.gif", rarity: "r86" },
            { position: 13, name: "Commemorative Defenders Stamp #3", img: "sta_defenders_korbat.gif", rarity: "r87" },
            { position: 14, name: "Happy Lutari Stamp", img: "sta_lut_lutari.gif", rarity: "r101" },
            { position: 15, name: "Bottled Faerie Stamp", img: "sta_other_bottledfaerie.gif", rarity: "r89" },
            { position: 16, name: "Mystery Island Travel Stamp", img: "stamp_travel_jubjub.gif", rarity: "r90" },
            { position: 17, name: "Shenkuu Mask Stamp", img: "sta_shenkuumask.gif", rarity: "r91" },
            { position: 18, name: "Hot Dog Hero Stamp", img: "sta_hotdoghero.gif", rarity: "r92" },
            { position: 19, name: "Rainbow Pteri Feather Stamp", img: "sta_holo_rainbowpterifeather.gif", rarity: "r93" },
            { position: 20, name: "Commemorative Defenders Stamp #4", img: "sta_defenders_scorchio.gif", rarity: "r94" },
            { position: 21, name: "Altador Travel Stamp", img: "stamp_travel_altador.gif", rarity: "r95" },
            { position: 22, name: "Gold Mote Stamp", img: "sta_other_goldmote.gif", rarity: "r96" },
            { position: 23, name: "Count Von Roo Plushie Stamp", img: "sta_other_vonrooplush.gif", rarity: "r97" },
            { position: 24, name: "Ready to Roll Stamp", img: "sta_readytoroll.gif", rarity: "r98" },
            { position: 25, name: "Lab Ray Stamp", img: "sta_other_labray.gif", rarity: "r99" }
        ]
    },
    "15": {
        "album": "Space Station Coins",
        "list": [
            { position: 1, name: "Grundo Veggieballs Coin", img: "coi_spa_veggieballs.gif", rarity: "r89" },
            { position: 2, name: "Grobleen Salad Coin", img: "coi_spa_grobleen.gif", rarity: "r90" },
            { position: 3, name: "Cosmic Cheese Stars Coin", img: "coi_spa_cosmic.gif", rarity: "r90" },
            { position: 4, name: "Roast Gargapple Coin", img: "coi_spa_gargapple.gif", rarity: "r92" },
            { position: 5, name: "Zoomik Coin", img: "coi_spa_zoomik.gif", rarity: "r94" },
            { position: 6, name: "Vacumatic 9000 Coin", img: "coi_spa_vacumatic.gif", rarity: "r94" },
            { position: 7, name: "N-4 Information Retrieval Bot Coin", img: "coi_spa_n4info.gif", rarity: "r93" },
            { position: 8, name: "GX-4 Oscillabot Coin", img: "coi_spa_oscillabot.gif", rarity: "r93" },
            { position: 9, name: "Gargaroxs Recipe Book Coin", img: "coi_space_recipes.gif", rarity: "r91" },
            { position: 10, name: "Gormball Coin", img: "coi_space_gormball.gif", rarity: "r90" },
            { position: 11, name: "Electro Shield Coin", img: "coi_space_electroshield.gif", rarity: "r91" },
            { position: 12, name: "H4000 Helmet Coin", img: "coi_space_helmet.gif", rarity: "r90" },
            { position: 13, name: "Grundo Warehouse Coin", img: "coi_spa_warehouse.gif", rarity: "r90" },
            { position: 14, name: "Adopt A Grundo Coin", img: "coi_spa_adoptgrundo.gif", rarity: "r90" },
            { position: 15, name: "Evil Fuzzle Coin", img: "coi_spa_evilfuzzle.gif", rarity: "r92" },
            { position: 16, name: "Splat A Sloth Coin", img: "coi_spa_splatsloth.gif", rarity: "r91" },
            { position: 17, name: "Astral Blade Coin", img: "coi_astral_blade.gif", rarity: "r93" },
            { position: 18, name: "Lever of Doom Coin", img: "coi_leverofdoom.gif", rarity: "r94" },
            { position: 19, name: "Super Nova Coin", img: "coi_super_nova.gif", rarity: "r95" },
            { position: 20, name: "Mallow Coin", img: "coi_mallow_grundo.gif", rarity: "r96" },
            { position: 21, name: "Bzzt Blaster Coin", img: "coi_space_bzztblaster.gif", rarity: "r97" },
            { position: 22, name: "Gorix and Cylara Coin", img: "coi_space_gorixcylara.gif", rarity: "r97" },
            { position: 23, name: "Neopet V2 Coin", img: "coi_space_npv2.gif", rarity: "r97" },
            { position: 24, name: "Smiling Space Faerie Coin", img: "coi_spacefaerie_smile.gif", rarity: "r99" },
            { position: 25, name: "Scowling Sloth Coin", img: "coi_sloth_scowl.gif", rarity: "r99" }
        ]
    },
    "16": {
        "album": "Evil Coconuts",
        "list": [
            { position: 1, name: "Angry Evil Coconut", img: "spo_coconut_1.gif", rarity: "r101" },
            { position: 2, name: "Sinister Evil Coconut", img: "spo_coconut_2.gif", rarity: "r101" },
            { position: 3, name: "Ugly Evil Coconut", img: "spo_coconut_3.gif", rarity: "r101" },
            { position: 4, name: "Screaming Evil Coconut", img: "spo_coconut_4.gif", rarity: "r101" },
            { position: 5, name: "Horned Evil Coconut", img: "spo_coconut_5.gif", rarity: "r101" },
            { position: 6, name: "Infernal Evil Coconut", img: "spo_coconut_6.gif", rarity: "r101" },
            { position: 7, name: "Burning Evil Coconut", img: "spo_coconut_7.gif", rarity: "r101" },
            { position: 8, name: "Mini Evil Coconut", img: "spo_coconut_8.gif", rarity: "r101" },
            { position: 9, name: "Silent Evil Coconut", img: "spo_coconut_9.gif", rarity: "r101" },
            { position: 10, name: "Monstrous Evil Coconut", img: "spo_coconut_10.gif", rarity: "r101" },
            { position: 11, name: "Tusked Evil Coconut", img: "spo_coconut_11.gif", rarity: "r101" },
            { position: 12, name: "Hairy Evil Coconut", img: "spo_coconut_12.gif", rarity: "r101" },
            { position: 13, name: "Painted Evil Coconut", img: "spo_coconut_13.gif", rarity: "r101" },
            { position: 14, name: "Stitched Evil Coconut", img: "spo_coconut_14.gif", rarity: "r101" },
            { position: 15, name: "Wailing Evil Coconut", img: "spo_coconut_18.gif", rarity: "r101" },
            { position: 16, name: "Light Brown Evil Coconut", img: "spo_coconut_17.gif", rarity: "r101" },
            { position: 17, name: "Damaged Evil Coconut", img: "spo_coconut_23.gif", rarity: "r101" },
            { position: 18, name: "Flaming Evil Coconut", img: "spo_coconut_16.gif", rarity: "r101" },
            { position: 19, name: "Seasonal Evil Coconut", img: "spo_coconut_xmas.gif", rarity: "r180" },
            { position: 20, name: "One Eyed Evil Coconut", img: "spo_coconut_19.gif", rarity: "r101" },
            { position: 21, name: "Vicious Evil Coconut", img: "spo_coconut_20.gif", rarity: "r101" },
            { position: 22, name: "Moaning Evil Coconut", img: "spo_coconut_21.gif", rarity: "r101" },
            { position: 23, name: "Sliced Evil Coconut", img: "spo_coconut_24.gif", rarity: "r101" },
            { position: 24, name: "Scorched Evil Coconut", img: "spo_coconut_15.gif", rarity: "r101" },
            { position: 25, name: "Golden Evil Coconut", img: "spo_coconut_25.gif", rarity: "r101" }
        ]
    },
    "17": {
        "album": "Sea Shells",
        "list": [
            { position: 1, name: "Green Clam Shell", img: "she_giantclam.gif", rarity: "r80" },
            { position: 2, name: "Purple Scallop Shell", img: "she_scallop2.gif", rarity: "r81" },
            { position: 3, name: "Glossy Blue Shell", img: "she_scallop1.gif", rarity: "r82" },
            { position: 4, name: "Green Smooth Shell", img: "she_snail.gif", rarity: "r84" },
            { position: 5, name: "Tangerine Trumpet Shell", img: "she_trumpet.gif", rarity: "r85" },
            { position: 6, name: "Brown Spotted Shell", img: "she_dwivitt.gif", rarity: "r84" },
            { position: 7, name: "Rainbow Coloured Shell", img: "she_candycane.gif", rarity: "r88" },
            { position: 8, name: "Spiky Shell", img: "she_shell_spiky.gif", rarity: "r85" },
            { position: 9, name: "Crimson Spotted Shell", img: "she_conch1.gif", rarity: "r86" },
            { position: 10, name: "Camouflage Scallop Shell", img: "she_shell_camo.gif", rarity: "r87" },
            { position: 11, name: "Pink Curly Shell", img: "she_chamber.gif", rarity: "r89" },
            { position: 12, name: "Shiny Purple Cowry Shell", img: "she_purple_tortoisecowry.gif", rarity: "r87" },
            { position: 13, name: "Blue Spiral Seashell", img: "she_spiral1.gif", rarity: "r90" },
            { position: 14, name: "Faerie Wings Shell", img: "she_faeriewings.gif", rarity: "r88" },
            { position: 15, name: "Spiky Orange Murex Shell", img: "she_orange_murex.gif", rarity: "r88" },
            { position: 16, name: "Sparkly Green Scallop Shell", img: "she_green_lionspaw.gif", rarity: "r90" },
            { position: 17, name: "Dazzling Blue Mussel Shell", img: "she_blue_mussel.gif", rarity: "r91" },
            { position: 18, name: "Deep Seashell", img: "she_glow_bright.gif", rarity: "r88" },
            { position: 19, name: "Purple Spiral Shell", img: "she_pinkrope.gif", rarity: "r92" },
            { position: 20, name: "Blue and Gold Tube Shell", img: "she_shell_bluetube.gif", rarity: "r93" },
            { position: 21, name: "Tiny Golden Shell", img: "she_shell_tiny.gif", rarity: "r94" },
            { position: 22, name: "Matching Pastel Shells", img: "she_clams.gif", rarity: "r93" },
            { position: 23, name: "Royal Orange Cowry Shell", img: "she_orangulous.gif", rarity: "r95" },
            { position: 24, name: "Purple Twirly Shell", img: "she_purple_twirl.gif", rarity: "r95" },
            { position: 25, name: "Golden Shell", img: "she_goldback.gif", rarity: "r98" }
        ]
    },
    "18": {
        "album": "Maraquan",
        "list": [
            { position: 1, name: "Maractite Dagger Stamp", img: "sta_maracititedagger.gif", rarity: "r80" },
            { position: 2, name: "Piraket Stamp", img: "sta_piraket.gif", rarity: "r82" },
            { position: 3, name: "Seaweed Necklace Stamp", img: "sta_seaweednecklace.gif", rarity: "r83" },
            { position: 4, name: "Petty Crewmate Stamp", img: "sta_wave1pirate.gif", rarity: "r84" },
            { position: 5, name: "Maraquan Defenders Stamp", img: "sta_mar_3maraquan.gif", rarity: "r85" },
            { position: 6, name: "Pirate Attack Stamp", img: "sta_mar_4pirate.gif", rarity: "r85" },
            { position: 7, name: "Goregas Stamp", img: "sta_mar_goregas.gif", rarity: "r87" },
            { position: 8, name: "The Black Pawkeet Stamp", img: "sta_mar_pawkeet.gif", rarity: "r87" },
            { position: 9, name: "Scurvy Island Stamp", img: "sta_mar_scurvyisland.gif", rarity: "r88" },
            { position: 10, name: "New Maraqua Stamp", img: "sta_mar_newmaraqua.gif", rarity: "r88" },
            { position: 11, name: "Pirate Troops Stamp", img: "sta_mar_pirates2.gif", rarity: "r89" },
            { position: 12, name: "Maraquan Troops Stamp", img: "sta_mar_maraquans2.gif", rarity: "r89" },
            { position: 13, name: "Chasm Beast Stamp", img: "stamp_chasmbeast.gif", rarity: "r88" },
            { position: 14, name: "The Drenched Stamp", img: "stamp_drenched.gif", rarity: "r89" },
            { position: 15, name: "Maraquan Charger Stamp", img: "stamp_maraquawave_3.gif", rarity: "r87" },
            { position: 16, name: "Maraquan Blade Specialist Stamp", img: "stamp_maraquawave_2.gif", rarity: "r86" },
            { position: 17, name: "Garin To The Rescue Stamp", img: "sta_mar_wave4.gif", rarity: "r90" },
            { position: 18, name: "Caylis Stamp", img: "sta_mar_caylis.gif", rarity: "r90" },
            { position: 19, name: "Swordsmaster Talek Stamp", img: "sta_mar_talek.gif", rarity: "r91" },
            { position: 20, name: "The Revenge Stamp", img: "sta_mar_revenge.gif", rarity: "r91" },
            { position: 21, name: "Jacques Stamp", img: "sta_mar_jacques.gif", rarity: "r97" },
            { position: 22, name: "Garin Stamp", img: "sta_mar_garin.gif", rarity: "r98" },
            { position: 23, name: "Isca Stamp", img: "sta_mar_isca.gif", rarity: "r98" },
            { position: 24, name: "Captain Scarblade Stamp", img: "sta_mar_scarblade.gif", rarity: "r99" },
            { position: 25, name: "King Kelpbeard Stamp", img: "sta_mar_kelpbeard.gif", rarity: "r99" }
        ]
    },
    "19": {
        "album": "Altador",
        "list": [
            { position: 1, name: "Siyana Stamp", img: "sta_altador_siyana.gif", rarity: "r77" },
            { position: 2, name: "First Edition Altador Petpet Stamp", img: "sta_altador_petpet1.gif", rarity: "r76" },
            { position: 3, name: "Fauna Stamp", img: "sta_altador_fauna.gif", rarity: "r77" },
            { position: 4, name: "Jerdana Stamp", img: "sta_altador_jerdana.gif", rarity: "r78" },
            { position: 5, name: "The Wave Stamp", img: "sta_alt_constellation.gif", rarity: "r72" },
            { position: 6, name: "Marak Stamp", img: "sta_altador_marak.gif", rarity: "r80" },
            { position: 7, name: "Altadorian Farmer Stamp", img: "sta_alt_moehogfarmer.gif", rarity: "r81" },
            { position: 8, name: "Gordos Stamp", img: "sta_altador_gordos.gif", rarity: "r82" },
            { position: 9, name: "Psellia Stamp", img: "sta_altador_psellia.gif", rarity: "r83" },
            { position: 10, name: "Second Edition Altador Petpet Stamp", img: "sta_altador_petpet2.gif", rarity: "r83" },
            { position: 11, name: "Perfectly Flat Rock Stamp", img: "sta_alt_perfectlyflatrock.gif", rarity: "r78" },
            { position: 12, name: "Kelland Stamp", img: "sta_altador_kelland.gif", rarity: "r85" },
            { position: 13, name: "Altador Food Stamp", img: "sta_altador_food.gif", rarity: "r89" },
            { position: 14, name: "Florin Stamp", img: "sta_altador_florin.gif", rarity: "r90" },
            { position: 15, name: "Astronomy Club Stamp", img: "sta_alt_astroclub.gif", rarity: "r91" },
            { position: 16, name: "Finneus Stamp", img: "sta_alt_finneus.gif", rarity: "r92" },
            { position: 17, name: "Altador Magic Stamp", img: "sta_altador_magic.gif", rarity: "r94" },
            { position: 18, name: "The Sleeper Constellation Stamp", img: "sta_alt_sleeper.gif", rarity: "r95" },
            { position: 19, name: "Torakor Stamp", img: "sta_altador_torakor.gif", rarity: "r96" },
            { position: 20, name: "Angry Janitor Stamp", img: "sta_alt_janitor.gif", rarity: "r85" },
            { position: 21, name: "Darkest Faerie Stamp", img: "sta_altador_darkfaerie.gif", rarity: "r98" },
            { position: 22, name: "Sasha Stamp", img: "sta_altador_sasha.gif", rarity: "r99" },
            { position: 23, name: "Yooyu Celebration Stamp", img: "altcp2_sta_yooyuball.gif", rarity: "r180" },
            { position: 24, name: "King Altador Stamp", img: "sta_altador_kingaltador.gif", rarity: "r99" },
            { position: 25, name: "Altador Colosseum Stamp", img: "altcp_colusseum_stamp.gif", rarity: "r101" }
        ]
    },
    "20": {
        "album": "Shenkuu",
        "list": [
            { position: 1, name: "Shenkuu City Stamp", img: "sta_shenku.gif", rarity: "r75" },
            { position: 2, name: "Kentari Stamp", img: "sta_kentarifly.gif", rarity: "r76" },
            { position: 3, name: "Negg Noodles Stamp", img: "sta_neggnoodles.gif", rarity: "r77" },
            { position: 4, name: "Linae Stamp", img: "sta_linae.gif", rarity: "r78" },
            { position: 5, name: "Shenkuu Lunar Temple Stamp", img: "sta_shenkuu.gif", rarity: "r79" },
            { position: 6, name: "Orange Draik Stamp", img: "sta_orange_draik.gif", rarity: "r80" },
            { position: 7, name: "Captain Tuan Stamp", img: "sta_captain.gif", rarity: "r81" },
            { position: 8, name: "Anshu Stamp", img: "sta_ancient_ruki.gif", rarity: "r82" },
            { position: 9, name: "Enchanted Pudao Stamp", img: "sta_shen_pudao.gif", rarity: "r83" },
            { position: 10, name: "Kazeriu Stamp", img: "sta_kazeriu.gif", rarity: "r84" },
            { position: 11, name: "Bonju Stamp", img: "sta_bonju.gif", rarity: "r85" },
            { position: 12, name: "Pineapple Dessert Stamp", img: "sta_pinapple_dessert.gif", rarity: "r86" },
            { position: 13, name: "Cyodrakes Gaze Logo Stamp", img: "sta_cyodrake.gif", rarity: "r87" },
            { position: 14, name: "Kou-Jong Tile Stamp", img: "sta_shen_koujong.gif", rarity: "r88" },
            { position: 15, name: "Kentari Spyglass Stamp", img: "sta_kentari.gif", rarity: "r89" },
            { position: 16, name: "Hoban Stamp", img: "sta_hoban.gif", rarity: "r90" },
            { position: 17, name: "Thoughtful Linae Stamp", img: "sta_linaedoubt.gif", rarity: "r91" },
            { position: 18, name: "Orrin Stamp", img: "sta_shen_exoticfoods.gif", rarity: "r92" },
            { position: 19, name: "Shumi Telescope Stamp", img: "sta_shumitelescope.gif", rarity: "r93" },
            { position: 20, name: "Biyako Stamp", img: "sta_white_kougra.gif", rarity: "r94" },
            { position: 21, name: "The Cyodrakes Gaze Stamp", img: "sta_ship.gif", rarity: "r95" },
            { position: 22, name: "Anshu Fishing Stamp", img: "sta_anshu.gif", rarity: "r96" },
            { position: 23, name: "Wise Gnorbu Stamp", img: "sta_shen_wisegnorbu.gif", rarity: "r97" },
            { position: 24, name: "Quilin Stamp", img: "sta_quilin.gif", rarity: "r98" },
            { position: 25, name: "Shenkuu Stamp", img: "sta_shenkustamp.gif", rarity: "r99" }
        ]
    },
    "21": {
        "album": "Charms",
        "list": [
            { position: 1, name: "Nimmo Gnome Collectable Charm", img: "zip_gnome_nimmodreaming.gif", rarity: "r65" },
            { position: 2, name: "Chia Gnome Collectable Charm", img: "zip_gnome_redchia.gif", rarity: "r62" },
            { position: 3, name: "Yellow PaintBrush Collectable Charm", img: "zip_pb_yellow.gif", rarity: "r65" },
            { position: 4, name: "Bika Collectable Charm", img: "toy_bika_charm.gif", rarity: "r78" },
            { position: 5, name: "Chomby Gnome Collectable Charm", img: "zip_gnome_yellowchomby.gif", rarity: "r68" },
            { position: 6, name: "Snowager Collectable Charm", img: "toy_snowager_charm.gif", rarity: "r101" },
            { position: 7, name: "Green PaintBrush Collectable Charm", img: "zip_pb_green.gif", rarity: "r70" },
            { position: 8, name: "Flower Trumpet Collectable Charm", img: "toy_flowertrumpet_charm.gif", rarity: "r71" },
            { position: 9, name: "Tagobo Potion Collectable Charm", img: "toy_tagobo_potion_charm.gif", rarity: "r71" },
            { position: 10, name: "Bori Gnome Collectable Charm", img: "zip_gnome_borileaf.gif", rarity: "r72" },
            { position: 11, name: "Glyme Collectable Charm", img: "toy_glyme_charm.gif", rarity: "r85" },
            { position: 12, name: "Faerie Techo Plushie Collectable Charm", img: "toy_techo_faerieplu_charm.gif", rarity: "r86" },
            { position: 13, name: "Schnelly Collectable Charm", img: "toy_schnelly_charm.gif", rarity: "r87" },
            { position: 14, name: "Red PaintBrush Collectable Charm", img: "zip_pb_red.gif", rarity: "r88" },
            { position: 15, name: "Pinchit Collectable Charm", img: "toy_pinchit_charm.gif", rarity: "r89" },
            { position: 16, name: "Faerie Buzz Plushie Collectable Charm", img: "toy_buzz_faerieplu_charm.gif", rarity: "r90" },
            { position: 17, name: "Tigerfruit Collectable Charm", img: "toy_tigerfruit_charm.gif", rarity: "r91" },
            { position: 18, name: "Skarl Collectable Charm", img: "toy_skarl_charm.gif", rarity: "r101" },
            { position: 19, name: "Blue PaintBrush Collectable Charm", img: "zip_pb_blue.gif", rarity: "r93" },
            { position: 20, name: "Festival Negg Collectable Charm", img: "toy_fony14_festival_negg_cc.gif", rarity: "r101" },
            { position: 21, name: "Cyodrake Collectable Charm", img: "toy_cyodrake_collect_charm.gif", rarity: "r95" },
            { position: 22, name: "Gallion Collectable Charm", img: "toy_gallion_collect_charm.gif", rarity: "r96" },
            { position: 23, name: "Techo Statue Collectable Charm", img: "toy_techo_statue_charm.gif", rarity: "r97" },
            { position: 24, name: "Taiko Standing Drum Collectable Charm", img: "toy_taikostandingdrum_charm.gif", rarity: "r98" },
            { position: 25, name: "Elephante Lamp Collectable Charm", img: "toy_elephante_lamp_charm.gif", rarity: "r99" }
        ]
    },
    "22": {
        "album": "Other II",
        "list": [
            { position: 1, name: "Veggie Pizza Stamp", img: "sta_other_veggiepizza.gif", rarity: "r74" },
            { position: 2, name: "Plesio Stamp", img: "sta_plesio_stamp.gif", rarity: "r76" },
            { position: 3, name: "Hannah Stamp", img: "sta_hannah.gif", rarity: "r85" },
            { position: 4, name: "Shenkuu Draik Stamp", img: "sta_shenkuudraik.gif", rarity: "r77" },
            { position: 5, name: "Altador Cup IX Commemorative Stamp", img: "sta_ac2014_alupeime.gif", rarity: "r101" },
            { position: 6, name: "3D Camp AAA Stamp", img: "sta_ddy15_3dcampaaasta.gif", rarity: "r101" },
            { position: 7, name: "Mutant Techo Plushie Stamp", img: "sta_techo_mutantplushie.gif", rarity: "r80" },
            { position: 8, name: "Fruit Bomb Stamp", img: "sta_other_fruitbomb.gif", rarity: "r81" },
            { position: 9, name: "Altador Cup VIII Commemorative Stamp", img: "sta_acy15vii_acviiicomstamp.gif", rarity: "r101" },
            { position: 10, name: "Underwater Chef Stamp", img: "sta_underwater_chef.gif", rarity: "r84" },
            { position: 11, name: "Mysterious Obelisk Stamp", img: "sta_tyweof2013_myobalstmp.gif", rarity: "r101" },
            { position: 12, name: "Halloween Ona Stamp", img: "sta_halloween_ona.gif", rarity: "r85" },
            { position: 13, name: "Threelegs vs. Techo Master Stamp", img: "sta_gmc_threevstechm.gif", rarity: "r101" },
            { position: 14, name: "Games Master Challenge Stamp", img: "sta_gmc_challenge.gif", rarity: "r101" },
            { position: 15, name: "Tasu Stamp", img: "sta_other_tasu.gif", rarity: "r88" },
            { position: 16, name: "Plushie Slorg Stamp", img: "sta_plushie_slorg.gif", rarity: "r89" },
            { position: 17, name: "Charms Stamp", img: "sta_other_charms.gif", rarity: "r90" },
            { position: 18, name: "Altador Cup VII Commemorative Stamp", img: "sta_acy14vii_comm_acvii.gif", rarity: "r101" },
            { position: 19, name: "AAA vs. Abigail Stamp", img: "sta_ddy14_aaavsabistamp.gif", rarity: "r101" },
            { position: 20, name: "Shenkuu Helmet Stamp", img: "sta_shenkuuhelmet.gif", rarity: "r94" },
            { position: 21, name: "Altador Cup V Commemorative Stamp", img: "sta_altcp_comm_acv.gif", rarity: "r101" },
            { position: 22, name: "Captain of the Guard Stamp", img: "sta_captainguardbrynn.gif", rarity: "r101" },
            { position: 23, name: "Geraptiku Stamp", img: "sta_geraptiku.gif", rarity: "r97" },
            { position: 24, name: "Altador Cup VI Commemorative Stamp", img: "sta_altcp_comm_acvi.gif", rarity: "r101" },
            { position: 25, name: "Brains vs. Brawn Stamp", img: "sta_gmc_grainvbrawn.gif", rarity: "r101" }
        ]
    },
    "23": {
        "album": "Faerieland",
        "list": [
            { position: 1, name: "Library Faerie Stamp", img: "sta_library_faerie.gif", rarity: "r75" },
            { position: 2, name: "Captain of Fyoras Guards Stamp", img: "sta_fyoras_guards.gif", rarity: "r76" },
            { position: 3, name: "Healing Springs Stamp", img: "sta_faerie_statue.gif", rarity: "r63" },
            { position: 4, name: "Faerie Techo Plushie Stamp", img: "sta_techo_faerieplushie.gif", rarity: "r64" },
            { position: 5, name: "The Discarded Magical Blue Grundo Plushie of Prosperity Stamp", img: "sta_tdmbgpop.gif", rarity: "r101" },
            { position: 6, name: "Delina Stamp", img: "sta_faerie_delina.gif", rarity: "r80" },
            { position: 7, name: "Ruins of Faerieland Stamp", img: "sta_faerieland_ruins.gif", rarity: "r81" },
            { position: 8, name: "Faerieland Petpet Shopkeeper Stamp", img: "sta_faerie_petpetshop.gif", rarity: "r82" },
            { position: 9, name: "Faerie City Stamp", img: "sta_faerie_castle.gif", rarity: "r82" },
            { position: 10, name: "Faerieland Justice Stamp", img: "sta_faerieland_justice.gif", rarity: "r84" },
            { position: 11, name: "Snowglobe Faerie Stamp", img: "sta_faerie_snow.gif", rarity: "r84" },
            { position: 12, name: "Faerie Foods Stamp", img: "sta_faerie_foods.gif", rarity: "r81" },
            { position: 13, name: "Faerie Furniture Shopkeeper Stamp", img: "sta_faerie_furniture.gif", rarity: "r86" },
            { position: 14, name: "Hubrid Nox Commemorative Stamp", img: "sta_commem_hubrid_nox.gif", rarity: "r88" },
            { position: 15, name: "Fountain Faerie Stamp", img: "sta_rainbow_faerie.gif", rarity: "r89" },
            { position: 16, name: "Fyora Faerie Doll Stamp", img: "sta_fyora_faerie_doll.gif", rarity: "r90" },
            { position: 17, name: "Destruction of Faerieland Stamp", img: "sta_faerieland_destruct.gif", rarity: "r91" },
            { position: 18, name: "Dark Faerie Stamp", img: "sta_faerie_dark.gif", rarity: "r92" },
            { position: 19, name: "Faerie Slorg Stamp", img: "sta_faerie_slorg.gif", rarity: "r93" },
            { position: 20, name: "Fyoras Castle Stamp", img: "sta_faerieland_castle.gif", rarity: "r94" },
            { position: 21, name: "Aethia Stamp", img: "sta_faerie_aethia.gif", rarity: "r95" },
            { position: 22, name: "Wheel of Excitement Stamp", img: "sta_stw_wheelofexcitement.gif", rarity: "r101" },
            { position: 23, name: "Faerie Caverns Stamp", img: "sta_faerie_caverns.gif", rarity: "r101" },
            { position: 24, name: "Jhudoras Cloud Stamp", img: "sta_jhudora_castle.gif", rarity: "r98" },
            { position: 25, name: "Queen Fyora Stamp", img: "sta_queen_fyora.gif", rarity: "r99" }
        ]
    },
    "24": {
        "album": "Scarabs",
        "list": [
            { position: 1, name: "Basic Yellow Collectable Scarab", img: "coi_scarab_yellowbas.gif", rarity: "r75" },
            { position: 2, name: "Polkadot Collectable Scarab", img: "coi_scarab_polkadot.gif", rarity: "r76" },
            { position: 3, name: "Orange Spotted Collectable Scarab", img: "coi_scarab_orangespotted.gif", rarity: "r77" },
            { position: 4, name: "Common Desert Collectable Scarab", img: "coi_desertscarab_slim.gif", rarity: "r68" },
            { position: 5, name: "Bushy Antennae Collectable Scarab", img: "coi_scarab_fancyant.gif", rarity: "r81" },
            { position: 6, name: "Striped Blue Collectable Scarab", img: "coi_striblu_scarabs.gif", rarity: "r80" },
            { position: 7, name: "Basic Fringed Collectable Scarab", img: "coi_scarab_4.gif", rarity: "r81" },
            { position: 8, name: "Flashy Winged Collectable Scarab", img: "coi_scarab_flashywinged.gif", rarity: "r83" },
            { position: 9, name: "Large Black and White Collectable Scarab", img: "coi_scarab_blacknwhite.gif", rarity: "r83" },
            { position: 10, name: "Simple Red Collectable Scarab", img: "coi_red_scarabs.gif", rarity: "r84" },
            { position: 11, name: "Long Headed Collectable Scarab", img: "coi_scarab_longhead.gif", rarity: "r85" },
            { position: 12, name: "Day and Night Collectable Scarab", img: "coi_gmc2013_daynightscar.gif", rarity: "r101" },
            { position: 13, name: "Purple Collectable Scarab", img: "coi_scarab_purple.gif", rarity: "r89" },
            { position: 14, name: "Speckled Collectable Scarab", img: "coi_scarab_speckled.gif", rarity: "r88" },
            { position: 15, name: "Uncommon Blue Collectable Scarab", img: "coi_scarab_3.gif", rarity: "r89" },
            { position: 16, name: "Horned Collectable Scarab", img: "coi_scarab_horned.gif", rarity: "r90" },
            { position: 17, name: "Greater Green Collectable Scarab", img: "coi_desertscarab_green.gif", rarity: "r89" },
            { position: 18, name: "Rainbow Collectable Scarab", img: "coi_scarab_rainbow.gif", rarity: "r92" },
            { position: 19, name: "Dazzling Verdant Collectable Scarab", img: "coi_verdant_scarab.gif", rarity: "r93" },
            { position: 20, name: "Black and Yellow Collectable Scarab", img: "coi_scarab_blackandyellow.gif", rarity: "r94" },
            { position: 21, name: "Spotted Red Collectable Scarab", img: "coi_dotted_scarabs.gif", rarity: "r95" },
            { position: 22, name: "Greater Yellow Collectable Scarab", img: "coi_scarab_yellowgre.gif", rarity: "r96" },
            { position: 23, name: "Sparkleback Collectable Scarab", img: "coi_scarab_sparkleb.gif", rarity: "r97" },
            { position: 24, name: "Spotted Blue Collectable Scarab", img: "coi_spotblu_scarabs.gif", rarity: "r98" },
            { position: 25, name: "Large Black Collectable Scarab", img: "coi_large_black_scarab.gif", rarity: "r99" }
        ]
    },
    "25": {
        "album": "Moltara",
        "list": [
            { position: 1, name: "Entrance to Moltara Stamp", img: "sta_moltaraentrance.gif", rarity: "r75" },
            { position: 2, name: "No Stamp", img: "", rarity: "" },
            { position: 3, name: "No Stamp", img: "", rarity: "" },
            { position: 4, name: "No Stamp", img: "", rarity: "" },
            { position: 5, name: "The Arcanium Stamp", img: "sta_thearcanium.gif", rarity: "r79" },
            { position: 6, name: "Magma Pool Stamp", img: "sta_moltara_magmapool.gif", rarity: "r80" },
            { position: 7, name: "Magma Pool Guard Stamp", img: "sta_magpool_guard.gif", rarity: "r81" },
            { position: 8, name: "No Stamp", img: "", rarity: "" },
            { position: 9, name: "Molten Morsels Stamp", img: "sta_molten_morsels.gif", rarity: "r83" },
            { position: 10, name: "No Stamp", img: "", rarity: "" },
            { position: 11, name: "No Stamp", img: "", rarity: "" },
            { position: 12, name: "Mayor of Moltara Stamp", img: "sta_moltara_mayor.gif", rarity: "r86" },
            { position: 13, name: "No Stamp", img: "", rarity: "" },
            { position: 14, name: "No Stamp", img: "", rarity: "" },
            { position: 15, name: "No Stamp", img: "", rarity: "" },
            { position: 16, name: "Cogs Togs Stamp", img: "sta_cogs_togs.gif", rarity: "r90" },
            { position: 17, name: "No Stamp", img: "", rarity: "" },
            { position: 18, name: "Tangor Stamp", img: "sta_tangor.gif", rarity: "r92" },
            { position: 19, name: "Moltara Town Hall Stamp", img: "sta_moltara_townhall.gif", rarity: "r93" },
            { position: 20, name: "Abandoned Water Tower Stamp", img: "sta_reu2014_abanwattowstaalb.gif", rarity: "r101" },
            { position: 21, name: "Lampwyck Stamp", img: "sta_lampwyck.gif", rarity: "r95" },
            { position: 22, name: "No Stamp", img: "", rarity: "" },
            { position: 23, name: "Igneots Cavern Stamp", img: "sta_moltara_igneot.gif", rarity: "r97" },
            { position: 24, name: "Lava Monster Stamp", img: "sta_lava_monster.gif", rarity: "r98" },
            { position: 25, name: "Igneot Stamp", img: "sta_igneot.gif", rarity: "r99" }
        ]
    },
    "26": {
        "album": "Maractite Coins",
        "list": [
            { position: 1, name: "Squared Maractite Coin", img: "coi_maractite_squared.gif", rarity: "r75" },
            { position: 2, name: "Half Maractite Coin", img: "coi_maractite_half.gif", rarity: "r76" },
            { position: 3, name: "Triangular Maractite Coin", img: "coi_maractite_triangular.gif", rarity: "r82" },
            { position: 4, name: "Maractite Koi Maractite Coin", img: "coi_maraquan_koi.gif", rarity: "r82" },
            { position: 5, name: "Seaweed Design Maractite Coin", img: "coi_maractite_seaweed.gif", rarity: "r79" },
            { position: 6, name: "Deformed Maractite Coin", img: "coi_dot_maractite.gif", rarity: "r101" },
            { position: 7, name: "Dual Tone Maractite Coin", img: "coi_maractite_dual_tone.gif", rarity: "r81" },
            { position: 8, name: "Maractite Waves Coin", img: "coi_maractite_waves.gif", rarity: "r101" },
            { position: 9, name: "Worn Maractite Coin", img: "coi_maractite_worn.gif", rarity: "r83" },
            { position: 10, name: "Simple Maractite Coin", img: "coin_koi_maractite.gif", rarity: "r101" },
            { position: 11, name: "Maraquan Kau Maractite Coin", img: "coi_maraquan_kau.gif", rarity: "r85" },
            { position: 12, name: "Runed Maractite Coin", img: "coi_maractite_runed.gif", rarity: "r86" },
            { position: 13, name: "No Stamp", img: "", rarity: "" },
            { position: 14, name: "No Stamp", img: "", rarity: "" },
            { position: 15, name: "No Stamp", img: "", rarity: "" },
            { position: 16, name: "No Stamp", img: "", rarity: "" },
            { position: 17, name: "No Stamp", img: "", rarity: "" },
            { position: 18, name: "Maraquan Skeith Maractite Coin", img: "coi_maraquan_skeith.gif", rarity: "r92" },
            { position: 19, name: "Maraquan Draik Maractite Coin", img: "coi_maractite_draik_mara.gif", rarity: "r93" },
            { position: 20, name: "Large Maractite Coin", img: "coi_maractite_large.gif", rarity: "r95" },
            { position: 21, name: "No Stamp", img: "", rarity: "" },
            { position: 22, name: "Streaked Maractite Coin", img: "coi_maractite_streaked.gif", rarity: "r96" },
            { position: 23, name: "Round Maractite Coin", img: "coi_maractite_round.gif", rarity: "r101" },
            { position: 24, name: "Ancient Peophin Maractite Coin", img: "coi_maractite_ancient_peo.gif", rarity: "r101" },
            { position: 25, name: "Floral Maractite Coin", img: "coi_maractite_floral.gif", rarity: "r99" }
        ]
    },
    "27": {
        "album": "Qasala",
        "list": [
            { position: 1, name: "Words of Antiquity Stamp", img: "sta_antiquity_words.gif", rarity: "r75" },
            { position: 2, name: "Qasalan Delights Stamp", img: "sta_delight_qasalan.gif", rarity: "r76" },
            { position: 3, name: "Ancient Contract Stamp", img: "sta_ancient_contract.gif", rarity: "r77" },
            { position: 4, name: "Mystical Surroundings Stamp", img: "wea_y18gmc_sta_qasala_mystical.gif", rarity: "r101" },
            { position: 5, name: "No Stamp", img: "", rarity: "" },
            { position: 6, name: "Qasalan Coffee Set Stamp", img: "sta_qasalan_coffeeset.gif", rarity: "r81" },
            { position: 7, name: "No Stamp", img: "", rarity: "" },
            { position: 8, name: "No Stamp", img: "", rarity: "" },
            { position: 9, name: "Qasalan Tablet Stamp", img: "sta_qasalan_tablet.gif", rarity: "r84" },
            { position: 10, name: "Trapped Tomos Stamp", img: "sta_trapped_tomos.gif", rarity: "r84" },
            { position: 11, name: "Ruins of Qasala Stamp", img: "sta_desert_qasalaruin.gif", rarity: "r85" },
            { position: 12, name: "Qasalan Mummy Stamp", img: "sta_mummy_qasalan.gif", rarity: "r86" },
            { position: 13, name: "The Ruins of Thanyros Stamp", img: "stamp_tge_ruinsthan.gif", rarity: "r101" },
            { position: 14, name: "Scorchio Mummy Stamp", img: "sta_ld_scorch_mummy.gif", rarity: "r88" },
            { position: 15, name: "Desert Arms Stamp", img: "sta_desert_armsshop.gif", rarity: "r89" },
            { position: 16, name: "No Stamp", img: "", rarity: "" },
            { position: 17, name: "Lupe Shopkeeper Stamp", img: "sta_qasala_lupe_shop.gif", rarity: "r91" },
            { position: 18, name: "Razul Stamp", img: "sta_ld_razul.gif", rarity: "r92" },
            { position: 19, name: "Dark Qasala Stamp", img: "sta_dark_qasala.gif", rarity: "r93" },
            { position: 20, name: "Scordrax Stamp", img: "sta_scordrax.gif", rarity: "r94" },
            { position: 21, name: "Tomos Stamp", img: "sta_tomos.gif", rarity: "r95" },
            { position: 22, name: "Nabile Stamp", img: "sta_nabile.gif", rarity: "r96" },
            { position: 23, name: "Nightsteed Stamp", img: "sta_nightsteed.gif", rarity: "r98" },
            { position: 24, name: "King Jazan Stamp", img: "sta_king_jazan.gif", rarity: "r99" },
            { position: 25, name: "Wheel of Extravagance Stamp", img: "sta_wheel_of_extravagance.gif", rarity: "r101" }
        ]
    },
    "28": {
        "album": "Treasures of the Deep",
        "list": [
            { position: 1, name: "Circlet of the Deep", img: "she_circlet_thedeep.gif", rarity: "r75" },
            { position: 2, name: "Shell Comb", img: "gif_shell_groom.gif", rarity: "r86" },
            { position: 3, name: "No Stamp", img: "", rarity: "" },
            { position: 4, name: "Tiara of the Deep", img: "she_tiara_thedeep.gif", rarity: "r78" },
            { position: 5, name: "Shell Clutch", img: "gif_shell_clasp.gif", rarity: "r86" },
            { position: 6, name: "No Stamp", img: "", rarity: "" },
            { position: 7, name: "Hair Clip of the Deep", img: "she_hairclip_thedeep.gif", rarity: "r81" },
            { position: 8, name: "No Stamp", img: "", rarity: "" },
            { position: 9, name: "Hairpin of the Deep", img: "she_thedeep_hairpin.gif", rarity: "r83" },
            { position: 10, name: "Bangles of the Deep", img: "she_bangles_thedeep.gif", rarity: "r84" },
            { position: 11, name: "No Stamp", img: "", rarity: "" },
            { position: 12, name: "Brilliant Negg Crown", img: "she_fony15_brilliantcrown.gif", rarity: "r101" },
            { position: 13, name: "Armlet of the Deep", img: "she_armlet_thedeep.gif", rarity: "r87" },
            { position: 14, name: "Diadem of the Deep", img: "she_diadem_thedeep.gif", rarity: "r88" },
            { position: 15, name: "No Stamp", img: "", rarity: "" },
            { position: 16, name: "Enameled Peophin Brooch of the Deep", img: "she_peobrooch_thedeep.gif", rarity: "r90" },
            { position: 17, name: "Coronet of the Deep", img: "she_coronet_thedeep.gif", rarity: "r91" },
            { position: 18, name: "No Stamp", img: "", rarity: "" },
            { position: 19, name: "No Stamp", img: "", rarity: "" },
            { position: 20, name: "Earrings of the Deep", img: "she_earrings_thedeep.gif", rarity: "r101" },
            { position: 21, name: "Exquisite Peophin Ring of the Deep", img: "she_peoring_thedeep.gif", rarity: "r95" },
            { position: 22, name: "Necklace of the Deep", img: "she_necklace_thedeep.gif", rarity: "r101" },
            { position: 23, name: "No Stamp", img: "", rarity: "" },
            { position: 24, name: "Anklet of the Deep", img: "she_anklet_thedeep.gif", rarity: "r98" },
            { position: 25, name: "Choker of the Deep", img: "she_thedeep_choker.gif", rarity: "r99" }
        ]
    },
    "29": {
        "album": "Krawk Island",
        "list": [
            { position: 1, name: "Krawk Island Governor Stamp", img: "sta_kwark_island.gif", rarity: "r78" },
            { position: 2, name: "Riches of Krawk Island Stamp", img: "sta_krawkisle_riches.gif", rarity: "r77" },
            { position: 3, name: "Mellow Marauders Plushie Stamp", img: "mellow-marauders-plushie.gif", rarity: "r83" },
            { position: 4, name: "Drooling Quadrapus Stamp", img: "sta_quadrapus_drool.gif", rarity: "r78" },
            { position: 5, name: "Petpet Cannonball Stamp", img: "sta_petpet_cannonball.gif", rarity: "r84" },
            { position: 6, name: "No Stamp", img: "", rarity: "" },
            { position: 7, name: "The Lighthouse Stamp", img: "sta_lighthouse.gif", rarity: "r81" },
            { position: 8, name: "Buried Treasure Stamp", img: "sta_krawk_island.gif", rarity: "r87" },
            { position: 9, name: "Bug Eye McGee Stamp", img: "sta_mcgee_bugeye.gif", rarity: "r83" },
            { position: 10, name: "Docked Ship Stamp", img: "sta_docked_ship.gif", rarity: "r85" },
            { position: 11, name: "Smugglers Cove Stamp", img: "sta_smugglers_cove.gif", rarity: "r86" },
            { position: 12, name: "No Stamp", img: "", rarity: "" },
            { position: 13, name: "No Stamp", img: "", rarity: "" },
            { position: 14, name: "No Stamp", img: "", rarity: "" },
            { position: 15, name: "Dubloon-O-Matic Stamp", img: "stamp_dubloon_o_matic.gif", rarity: "r89" },
            { position: 16, name: "Barf Boat Stamp", img: "sta_ddy21_barf_boat_stamp.gif", rarity: "r101" },
            { position: 17, name: "Dorak Stamp", img: "sta_dorak.gif", rarity: "r91" },
            { position: 18, name: "The Krawken Stamp", img: "sta_krawken.gif", rarity: "r92" },
            { position: 19, name: "The Academy Stamp", img: "sta_academy.gif", rarity: "r93" },
            { position: 20, name: "Forgotten Shore Stamp", img: "sta_forgotten_shore.gif", rarity: "r94" },
            { position: 21, name: "Capn Threelegs Stamp", img: "sta_capn_threelegs.gif", rarity: "r95" },
            { position: 22, name: "Golden Dubloon Stamp", img: "sta_dubloon_golden.gif", rarity: "r96" },
            { position: 23, name: "Limited Edition Scurvy Island Stamp", img: "sta_y16haltot_scurvisle.gif", rarity: "r101" },
            { position: 24, name: "Grimtooth Stamp", img: "sta_grimtooth.gif", rarity: "r98" },
            { position: 25, name: "Governor Mansion Stamp", img: "sta_governormansion.gif", rarity: "r101" }
        ]
    },
    "30": {
        "album": "Neovia",
        "list": [
            { position: 1, name: "Young Sophie Stamp", img: "sta_young_sophie.gif", rarity: "r75" },
            { position: 2, name: "Rusty Door Stamp", img: "sta_rustydoor.gif", rarity: "r76" },
            { position: 3, name: "Crumpetmonger Stamp", img: "sta_crumpetmonger.gif", rarity: "r83" },
            { position: 4, name: "No Stamp", img: "", rarity: "" },
            { position: 5, name: "Neovia Stamp", img: "sta_land_neovia.gif", rarity: "r78" },
            { position: 6, name: "Guard Zomutt Stamp", img: "sta_guardzomutt.gif", rarity: "r80" },
            { position: 7, name: "Bruno Stamp", img: "sta_bruno_stamp.gif", rarity: "r82" },
            { position: 8, name: "No Stamp", img: "", rarity: "" },
            { position: 9, name: "Family Portrait Stamp", img: "sta_family_portrait.gif", rarity: "r83" },
            { position: 10, name: "No Stamp", img: "", rarity: "" },
            { position: 11, name: "No Stamp", img: "", rarity: "" },
            { position: 12, name: "The Crumpetmonger Shop Stamp", img: "sta_y20haltot_neovianshop.gif", rarity: "r101" },
            { position: 13, name: "Spirit of Slumber Stamp", img: "sta_spirit_slumber.gif", rarity: "r87" },
            { position: 14, name: "No Stamp", img: "", rarity: "" },
            { position: 15, name: "No Stamp", img: "", rarity: "" },
            { position: 16, name: "Sentient Headstones Stamp", img: "sta_headstone_sentient.gif", rarity: "r90" },
            { position: 17, name: "RIP Lucy Stamp", img: "sta_rip_lucy.gif", rarity: "r91" },
            { position: 18, name: "No Stamp", img: "", rarity: "" },
            { position: 19, name: "Mr. Krawley Stamp", img: "sta_krawley_stamp.gif", rarity: "r93" },
            { position: 20, name: "Dark Ilere Stamp", img: "sta_dark_illere.gif", rarity: "r94" },
            { position: 21, name: "No Stamp", img: "", rarity: "" },
            { position: 22, name: "No Stamp", img: "", rarity: "" },
            { position: 23, name: "No Stamp", img: "", rarity: "" },
            { position: 24, name: "No Stamp", img: "", rarity: "" },
            { position: 25, name: "Grave Danger Stamp", img: "sta_gd_grave_danger.gif", rarity: "r101" }
        ]
    },
    "31": {
        "album": "Charms II",
        "list": [
            { position: 1, name: "No Stamp", img: "", rarity: "" },
            { position: 2, name: "Imposter Apple Collectable Charm", img: "toy_imp_apple_charm.gif", rarity: "r76" },
            { position: 3, name: "No Stamp", img: "", rarity: "" },
            { position: 4, name: "No Stamp", img: "", rarity: "" },
            { position: 5, name: "No Stamp", img: "", rarity: "" },
            { position: 6, name: "No Stamp", img: "", rarity: "" },
            { position: 7, name: "Princess Terrana Collectable Charm", img: "sta_gnorbu_charm.gif", rarity: "r93" },
            { position: 8, name: "Moon Rock Albert Collectable Charm", img: "sta_albert_moonrock.gif", rarity: "r101" },
            { position: 9, name: "AAA Collectable Charm", img: "sta_aaa_collectable.gif", rarity: "r101" },
            { position: 10, name: "Chia Clown Collectible Charm", img: "sta_ddy21_chiaclown_charm.gif", rarity: "r101" },
            { position: 11, name: "No Stamp", img: "", rarity: "" },
            { position: 12, name: "Hagan Collectable Charm", img: "toy_hagan_charm.gif", rarity: "r82" },
            { position: 13, name: "Recovered Shoyru Collectable Charm", img: "sta_twr_shoyrucollcharm.gif", rarity: "r101" },
            { position: 14, name: "Negg-Gazer Charm", img: "charm_negggazer.gif", rarity: "r101" },
            { position: 15, name: "Malum Collectable Charm", img: "twr_sta_malum_collcharm.gif", rarity: "r101" },
            { position: 16, name: "Recovered Jetsam Collectable Charm", img: "sta_twr_recoveredjetsam.gif", rarity: "r101" },
            { position: 17, name: "Recovered Meerca Collectable Charm", img: "sta_twr_recoveredmeerca.gif", rarity: "r101" },
            { position: 18, name: "Fyora Collectable Charm", img: "twr_sta_fyora_charm.gif", rarity: "r101" },
            { position: 19, name: "Wherfy Collectable Charm", img: "toy_wherfy_charm.gif", rarity: "r93" },
            { position: 20, name: "Recovered Skeith Collectable Charm", img: "twr_sta_skeith_collcharm.gif", rarity: "r101" },
            { position: 21, name: "Sloth Collectable Charm", img: "sta_sloth_charm.gif", rarity: "r96" },
            { position: 22, name: "Governor McGill Collectable Charm", img: "toy_y19haltot_mcgill_charm.gif", rarity: "r101" },
            { position: 23, name: "The Darkest Faerie Collectable Charm", img: "twr_sta_tdf_collcharm.gif", rarity: "r101" },
            { position: 24, name: "No Stamp", img: "", rarity: "" },
            { position: 25, name: "Game Controller Collectable Charm", img: "toy_ddy18_gamecontr_charm.gif", rarity: "r101" }
        ]
    },
    "32": {
        "album": "Mobile Apps",
        "list": [
            { position: 1, name: "Official Ghoul Catchers Stamp", img: "sta_gcm_gctriostamp.gif", rarity: "r101" },
            { position: 2, name: "Haunted Brightvale Amulet", img: "coi_gc_amuletobright.gif", rarity: "r101" },
            { position: 3, name: "Haunted Terror Mountain Amulet", img: "coi_gc_amuletotm.gif", rarity: "r101" },
            { position: 4, name: "Haunted Lost Desert Amulet", img: "coi_gc_amuletold.gif", rarity: "r101" },
            { position: 5, name: "Haunted Shenkuu Amulet", img: "coi_gc_amuletsh.gif", rarity: "r101" },
            { position: 6, name: "Haunted Altador Amulet", img: "coi_gc_amuletalt.gif", rarity: "r101" },
            { position: 7, name: "No Stamp", img: "", rarity: "" },
            { position: 8, name: "Haunted Faerieland Amulet", img: "coi_gc_amuletofaerie.gif", rarity: "r101" },
            { position: 9, name: "No Stamp", img: "", rarity: "" },
            { position: 10, name: "No Stamp", img: "", rarity: "" },
            { position: 11, name: "No Stamp", img: "", rarity: "" },
            { position: 12, name: "No Stamp", img: "", rarity: "" },
            { position: 13, name: "Aurrick vs Claymaker Stamp", img: "sta_aurrick_claymaker.gif", rarity: "r101" },
            { position: 14, name: "No Stamp", img: "", rarity: "" },
            { position: 15, name: "No Stamp", img: "", rarity: "" },
            { position: 16, name: "No Stamp", img: "", rarity: "" },
            { position: 17, name: "No Stamp", img: "", rarity: "" },
            { position: 18, name: "No Stamp", img: "", rarity: "" },
            { position: 19, name: "No Stamp", img: "", rarity: "" },
            { position: 20, name: "No Stamp", img: "", rarity: "" },
            { position: 21, name: "No Stamp", img: "", rarity: "" },
            { position: 22, name: "No Stamp", img: "", rarity: "" },
            { position: 23, name: "No Stamp", img: "", rarity: "" },
            { position: 24, name: "No Stamp", img: "", rarity: "" },
            { position: 25, name: "No Stamp", img: "", rarity: "" }
        ]
    },
    "33": {
        "album": "Other III",
        "list": [
            { position: 1, name: "Battle Eyrie Stamp", img: "sta_battle_eyrie.gif", rarity: "r80" },
            { position: 2, name: "Mumbo Pango Stamp", img: "sta_mumbo_pango.gif", rarity: "r101" },
            { position: 3, name: "Hanso Stamp", img: "sta_hanso.gif", rarity: "r83" },
            { position: 4, name: "Usuki Doll Stamp", img: "sta_usuki_doll.gif", rarity: "r96" },
            { position: 5, name: "Ruler of the Five Seas Stamp", img: "captain-scarblade.gif", rarity: "r86" },
            { position: 6, name: "Bringer of Night Stamp", img: "sta_night_bringer.gif", rarity: "r83" },
            { position: 7, name: "Easter Treats Stamp", img: "sta_fony18_eastertreats.gif", rarity: "r101" },
            { position: 8, name: "Lady Frostbite Stamp", img: "sta_lady_frostbite.gif", rarity: "r85" },
            { position: 9, name: "AC XIV Commemorative Stamp", img: "sta_acy21_commemorative_stamp.gif", rarity: "r101" },
            { position: 10, name: "Altador Cup XI Commemorative Stamp", img: "sta_acy18_acxicomstamp.gif", rarity: "r101" },
            { position: 11, name: "Hanso and Brynn Stamp", img: "sta_knights_raiders.gif", rarity: "r101" },
            { position: 12, name: "Yiko Stamp", img: "sta_yiko_stamp.gif", rarity: "r77" },
            { position: 13, name: "Lost City Lanes Stamp", img: "sta_lostcity_lanes.gif", rarity: "r101" },
            { position: 14, name: "AC XIII Commemorative Stamp", img: "sta_acy20_acxiiicomstamp.gif", rarity: "r101" },
            { position: 15, name: "Hulking Wraith Stamp", img: "sta_twr_hulkingwraith.gif", rarity: "r101" },
            { position: 16, name: "Altador Cup XII Commemorative Stamp", img: "sta_acy19_acxiicomstamp.gif", rarity: "r101" },
            { position: 17, name: "The Wraith Resurgence Stamp", img: "sta_twrstamp.gif", rarity: "r101" },
            { position: 18, name: "Decorative Negg Stamp", img: "coi_decorative_negg.gif", rarity: "r101" },
            { position: 19, name: "Magax Vs. Nox Stamp", img: "sta_y19gmc_noxvsmagax.gif", rarity: "r101" },
            { position: 20, name: "Spyders Stamp", img: "sta_spyder_stamp.gif", rarity: "r101" },
            { position: 21, name: "Altador Cup X Commemorative Stamp", img: "sta_altador_cup_collectible.gif", rarity: "r101" },
            { position: 22, name: "Taelia Vs. Ember Stamp", img: "sta_y17gmc_taeliavember.gif", rarity: "r101" },
            { position: 23, name: "Fire Breathing Scorchio Stamp", img: "sta_fire_scorchio.gif", rarity: "r101" },
            { position: 24, name: "Preoccupied AAA Stamp", img: "sta_ddy18_preoccupiedaaa.gif", rarity: "r101" },
            { position: 25, name: "Chadley Stamp", img: "sta_ddy19_chadley.gif", rarity: "r101" }
        ]
    },
    "34": {
        "album": "Sea Shells II",
        "list": [
            { position: 1, name: "Star Fish Shell", img: "she_star_fish.gif", rarity: "r84" },
            { position: 2, name: "No Stamp", img: "", rarity: "" },
            { position: 3, name: "Red Lined Shell", img: "she_redlined_shell.gif", rarity: "r88" },
            { position: 4, name: "No Stamp", img: "", rarity: "" },
            { position: 5, name: "Squiggles Shell", img: "she_squiggles.gif", rarity: "r89" },
            { position: 6, name: "Cream Heart Sea Shell", img: "she_shell_heart.gif", rarity: "r85" },
            { position: 7, name: "No Stamp", img: "", rarity: "" },
            { position: 8, name: "Lavender Cowry Shell", img: "she_cauree_shell.gif", rarity: "r90" },
            { position: 9, name: "Brown Striped Murex Shell", img: "she_brown_murex_shell.gif", rarity: "r89" },
            { position: 10, name: "No Stamp", img: "", rarity: "" },
            { position: 11, name: "No Stamp", img: "", rarity: "" },
            { position: 12, name: "No Stamp", img: "", rarity: "" },
            { position: 13, name: "No Stamp", img: "", rarity: "" },
            { position: 14, name: "So Blue Shell", img: "she_so_blue.gif", rarity: "r85" },
            { position: 15, name: "No Stamp", img: "", rarity: "" },
            { position: 16, name: "No Stamp", img: "", rarity: "" },
            { position: 17, name: "No Stamp", img: "", rarity: "" },
            { position: 18, name: "No Stamp", img: "", rarity: "" },
            { position: 19, name: "No Stamp", img: "", rarity: "" },
            { position: 20, name: "No Stamp", img: "", rarity: "" },
            { position: 21, name: "No Stamp", img: "", rarity: "" },
            { position: 22, name: "No Stamp", img: "", rarity: "" },
            { position: 23, name: "No Stamp", img: "", rarity: "" },
            { position: 24, name: "No Stamp", img: "", rarity: "" },
            { position: 25, name: "No Stamp", img: "", rarity: "" }
        ]
    },
    "35": {
        "album": "Neopia Central II",
        "list": [
            { position: 1, name: "Soup Faerie Stamp", img: "sta_advc2019_soupfaerie.gif", rarity: "r101" },
            { position: 2, name: "No Stamp", img: "", rarity: "" },
            { position: 3, name: "No Stamp", img: "", rarity: "" },
            { position: 4, name: "No Stamp", img: "", rarity: "" },
            { position: 5, name: "No Stamp", img: "", rarity: "" },
            { position: 6, name: "No Stamp", img: "", rarity: "" },
            { position: 7, name: "No Stamp", img: "", rarity: "" },
            { position: 8, name: "No Stamp", img: "", rarity: "" },
            { position: 9, name: "No Stamp", img: "", rarity: "" },
            { position: 10, name: "No Stamp", img: "", rarity: "" },
            { position: 11, name: "No Stamp", img: "", rarity: "" },
            { position: 12, name: "No Stamp", img: "", rarity: "" },
            { position: 13, name: "Neggnapper Stamp", img: "stamp_neggnapper.gif", rarity: "r101" },
            { position: 14, name: "No Stamp", img: "", rarity: "" },
            { position: 15, name: "No Stamp", img: "", rarity: "" },
            { position: 16, name: "No Stamp", img: "", rarity: "" },
            { position: 17, name: "No Stamp", img: "", rarity: "" },
            { position: 18, name: "No Stamp", img: "", rarity: "" },
            { position: 19, name: "No Stamp", img: "", rarity: "" },
            { position: 20, name: "No Stamp", img: "", rarity: "" },
            { position: 21, name: "No Stamp", img: "", rarity: "" },
            { position: 22, name: "No Stamp", img: "", rarity: "" },
            { position: 23, name: "No Stamp", img: "", rarity: "" },
            { position: 24, name: "No Stamp", img: "", rarity: "" },
            { position: 25, name: "No Stamp", img: "", rarity: "" }
        ]
    },
    "36": {
        "album": "Tyrannia II",
        "list": [
            { position: 1, name: "Yes-Boy Ice Cream Stamp", img: "sta_tyrannia2_yesboy.gif", rarity: "r84" },
            { position: 2, name: "No Stamp", img: "", rarity: "" },
            { position: 3, name: "Singed Tyrannian Volcano Stamp", img: "sta_sing_tyr_vol.gif", rarity: "r93" },
            { position: 4, name: "No Stamp", img: "", rarity: "" },
            { position: 5, name: "No Stamp", img: "", rarity: "" },
            { position: 6, name: "No Stamp", img: "", rarity: "" },
            { position: 7, name: "No Stamp", img: "", rarity: "" },
            { position: 8, name: "No Stamp", img: "", rarity: "" },
            { position: 9, name: "No Stamp", img: "", rarity: "" },
            { position: 10, name: "No Stamp", img: "", rarity: "" },
            { position: 11, name: "No Stamp", img: "", rarity: "" },
            { position: 12, name: "No Stamp", img: "", rarity: "" },
            { position: 13, name: "No Stamp", img: "", rarity: "" },
            { position: 14, name: "No Stamp", img: "", rarity: "" },
            { position: 15, name: "No Stamp", img: "", rarity: "" },
            { position: 16, name: "No Stamp", img: "", rarity: "" },
            { position: 17, name: "Tyrannian Victory Day Stamp", img: "sta_tyrannian_victory_day.gif", rarity: "r94" },
            { position: 18, name: "No Stamp", img: "", rarity: "" },
            { position: 19, name: "Wheel of Monotony Stamp", img: "sta_wheel_monotony.gif", rarity: "r92" },
            { position: 20, name: "No Stamp", img: "", rarity: "" },
            { position: 21, name: "No Stamp", img: "", rarity: "" },
            { position: 22, name: "No Stamp", img: "", rarity: "" },
            { position: 23, name: "No Stamp", img: "", rarity: "" },
            { position: 24, name: "No Stamp", img: "", rarity: "" },
            { position: 25, name: "No Stamp", img: "", rarity: "" }
        ]
    },
    "37": {
        "album": "Snowy Valley II",
        "list": [
            { position: 1, name: "Mika Stamp", img: "sta_mika_stamp.gif", rarity: "r101" },
            { position: 2, name: "No Stamp", img: "", rarity: "" },
            { position: 3, name: "Snowball Fight Stamp", img: "sta_snowball_fight.gif", rarity: "r86" },
            { position: 4, name: "Sliding Darblat Stamp", img: "sta_sliding_darblat.gif", rarity: "r83" },
            { position: 5, name: "No Stamp", img: "", rarity: "" },
            { position: 6, name: "No Stamp", img: "", rarity: "" },
            { position: 7, name: "No Stamp", img: "", rarity: "" },
            { position: 8, name: "No Stamp", img: "", rarity: "" },
            { position: 9, name: "No Stamp", img: "", rarity: "" },
            { position: 10, name: "Cybunny on a Cycle Stamp", img: "sta_cybunny_cycle.gif", rarity: "r94" },
            { position: 11, name: "No Stamp", img: "", rarity: "" },
            { position: 12, name: "No Stamp", img: "", rarity: "" },
            { position: 13, name: "Baby Aisha Stamp", img: "sta_baby_aisha.gif", rarity: "r101" },
            { position: 14, name: "No Stamp", img: "", rarity: "" },
            { position: 15, name: "No Stamp", img: "", rarity: "" },
            { position: 16, name: "No Stamp", img: "", rarity: "" },
            { position: 17, name: "No Stamp", img: "", rarity: "" },
            { position: 18, name: "No Stamp", img: "", rarity: "" },
            { position: 19, name: "No Stamp", img: "", rarity: "" },
            { position: 20, name: "No Stamp", img: "", rarity: "" },
            { position: 21, name: "Kari and Topsi Stamp", img: "sta_kari_topsi.gif", rarity: "r101" },
            { position: 22, name: "No Stamp", img: "", rarity: "" },
            { position: 23, name: "No Stamp", img: "", rarity: "" },
            { position: 24, name: "No Stamp", img: "", rarity: "" },
            { position: 25, name: "No Stamp", img: "", rarity: "" }
        ]
    },
    "38": {
        "album": "Evil Coconuts II",
        "list": [
            { position: 1, name: "No Stamp", img: "", rarity: "" },
            { position: 2, name: "No Stamp", img: "", rarity: "" },
            { position: 3, name: "No Stamp", img: "", rarity: "" },
            { position: 4, name: "No Stamp", img: "", rarity: "" },
            { position: 5, name: "No Stamp", img: "", rarity: "" },
            { position: 6, name: "No Stamp", img: "", rarity: "" },
            { position: 7, name: "No Stamp", img: "", rarity: "" },
            { position: 8, name: "No Stamp", img: "", rarity: "" },
            { position: 9, name: "No Stamp", img: "", rarity: "" },
            { position: 10, name: "No Stamp", img: "", rarity: "" },
            { position: 11, name: "No Stamp", img: "", rarity: "" },
            { position: 12, name: "No Stamp", img: "", rarity: "" },
            { position: 13, name: "No Stamp", img: "", rarity: "" },
            { position: 14, name: "No Stamp", img: "", rarity: "" },
            { position: 15, name: "No Stamp", img: "", rarity: "" },
            { position: 16, name: "Evil Evil Coconut", img: "spo_coconut_evilevil.gif", rarity: "r101" },
            { position: 17, name: "No Stamp", img: "", rarity: "" },
            { position: 18, name: "No Stamp", img: "", rarity: "" },
            { position: 19, name: "No Stamp", img: "", rarity: "" },
            { position: 20, name: "No Stamp", img: "", rarity: "" },
            { position: 21, name: "Ghostly Evil Coconut", img: "spo_y17haltot_coconutghostly.gif", rarity: "r101" },
            { position: 22, name: "No Stamp", img: "", rarity: "" },
            { position: 23, name: "No Stamp", img: "", rarity: "" },
            { position: 24, name: "No Stamp", img: "", rarity: "" },
            { position: 25, name: "No Stamp", img: "", rarity: "" }
        ]
    },
    "39": {
        "album": "Scarabs II",
        "list": [
            { position: 1, name: "Green Patterned Collectable Scarab", img: "coi_scarab_green.gif", rarity: "r91" },
            { position: 2, name: "Yellow and Black Collectable Scarab", img: "coi_scarab_yellowblack.gif", rarity: "r81" },
            { position: 3, name: "Shiny Cocoa Collectable Scarab", img: "coi_scarab_shinycocoa.gif", rarity: "r84" },
            { position: 4, name: "No Stamp", img: "", rarity: "" },
            { position: 5, name: "No Stamp", img: "", rarity: "" },
            { position: 6, name: "Red Striped Collectable Scarab", img: "coi_scarab_redstripe.gif", rarity: "r98" },
            { position: 7, name: "No Stamp", img: "", rarity: "" },
            { position: 8, name: "No Stamp", img: "", rarity: "" },
            { position: 9, name: "No Stamp", img: "", rarity: "" },
            { position: 10, name: "No Stamp", img: "", rarity: "" },
            { position: 11, name: "Orange Patterned Collectable Scarab", img: "coi_scarab_orangepattern.gif", rarity: "r79" },
            { position: 12, name: "No Stamp", img: "", rarity: "" },
            { position: 13, name: "No Stamp", img: "", rarity: "" },
            { position: 14, name: "No Stamp", img: "", rarity: "" },
            { position: 15, name: "No Stamp", img: "", rarity: "" },
            { position: 16, name: "No Stamp", img: "", rarity: "" },
            { position: 17, name: "No Stamp", img: "", rarity: "" },
            { position: 18, name: "No Stamp", img: "", rarity: "" },
            { position: 19, name: "No Stamp", img: "", rarity: "" },
            { position: 20, name: "No Stamp", img: "", rarity: "" },
            { position: 21, name: "No Stamp", img: "", rarity: "" },
            { position: 22, name: "Fiery Golden Collectable Scarab", img: "coi_y18gmc_scarab_fierygold.gif", rarity: "r101" },
            { position: 23, name: "No Stamp", img: "", rarity: "" },
            { position: 24, name: "Mysterious Vibrant Collectable Scarab", img: "coi_acxii_scarab_colspot.gif", rarity: "r101" },
            { position: 25, name: "No Stamp", img: "", rarity: "" }
        ]
    },
    "40": {
        "album": "Coins Part Deux Revenge of Coin",
        "list": [
            { position: 1, name: "Altador Cup X Collectible Gold Coin", img: "gif_altador_cup_gold_coin.gif", rarity: "r101" },
            { position: 2, name: "King Coltzan Coin", img: "coi_king_coltzan.gif", rarity: "r101" },
            { position: 3, name: "No Stamp", img: "", rarity: "" },
            { position: 4, name: "Coltzans Shrine Coin", img: "coi_coltzans_shrine.gif", rarity: "r101" },
            { position: 5, name: "No Stamp", img: "", rarity: "" },
            { position: 6, name: "No Stamp", img: "", rarity: "" },
            { position: 7, name: "No Stamp", img: "", rarity: "" },
            { position: 8, name: "AAA Coin", img: "spe_ddy21_aaa_coin.gif", rarity: "r101" },
            { position: 9, name: "No Stamp", img: "", rarity: "" },
            { position: 10, name: "No Stamp", img: "", rarity: "" },
            { position: 11, name: "No Stamp", img: "", rarity: "" },
            { position: 12, name: "No Stamp", img: "", rarity: "" },
            { position: 13, name: "No Stamp", img: "", rarity: "" },
            { position: 14, name: "No Stamp", img: "", rarity: "" },
            { position: 15, name: "No Stamp", img: "", rarity: "" },
            { position: 16, name: "Fiendish Formations Coin", img: "coin_twr_fiendish_formations.gif", rarity: "r101" },
            { position: 17, name: "No Stamp", img: "", rarity: "" },
            { position: 18, name: "No Stamp", img: "", rarity: "" },
            { position: 19, name: "No Stamp", img: "", rarity: "" },
            { position: 20, name: "No Stamp", img: "", rarity: "" },
            { position: 21, name: "No Stamp", img: "", rarity: "" },
            { position: 22, name: "No Stamp", img: "", rarity: "" },
            { position: 23, name: "No Stamp", img: "", rarity: "" },
            { position: 24, name: "No Stamp", img: "", rarity: "" },
            { position: 25, name: "No Stamp", img: "", rarity: "" }
        ]
    },
    "41": {
        "album": "Other IV",
        "list": [
            { position: 1, name: "Champions of Meridell Stamp", img: "sta_champ_ofmeridell.gif", rarity: "r101" },
            { position: 2, name: "Stamp of Spring Charm", img: "stamp_charm.gif", rarity: "r101" },
            { position: 3, name: "Tuskaninny Day Stamp", img: "sta_tuskanniny_day.gif", rarity: "r86" },
            { position: 4, name: "No Stamp", img: "", rarity: "" },
            { position: 5, name: "Cancelled Stamp", img: "sta_lack_of_interest_day.gif", rarity: "r88" },
            { position: 6, name: "No Stamp", img: "", rarity: "" },
            { position: 7, name: "Lady Blurg Stamp", img: "fon_stamp_ladyblurg.gif", rarity: "r101" },
            { position: 8, name: "No Stamp", img: "", rarity: "" },
            { position: 9, name: "Altador Cup XV Commemorative Stamp", img: "xv_stamp_commemorativeac.gif", rarity: "r101" },
            { position: 10, name: "Rebuilding Dacardia Stamp", img: "cc_rebuilddacar_stamp.gif", rarity: "r101" },
            { position: 11, name: "AC XVI Commemorative Stamp", img: "stamp_commemorat_acxvi.gif", rarity: "r101" },
            { position: 12, name: "No Stamp", img: "", rarity: "" },
            { position: 13, name: "Kiko Carpenter Stamp", img: "sta_y20haltot_kikocarpenter.gif", rarity: "r101" },
            { position: 14, name: "Altador Cup XVII Stamp", img: "stamp_ac_xvii.gif", rarity: "r101" },
            { position: 15, name: "Chairman with Way Too Long a Title Stamp", img: "ac_stamp_chairman.gif", rarity: "r101" },
            { position: 16, name: "Mirsha Grelinek Stamp", img: "ac_stamp_mirsha.gif", rarity: "r101" },
            { position: 17, name: "No Stamp", img: "", rarity: "" },
            { position: 18, name: "Baelia Stamp", img: "sta_baelia.gif", rarity: "r101" },
            { position: 19, name: "Neopets 22nd Birthday Stamp", img: "sta_22_bday.gif", rarity: "r101" },
            { position: 20, name: "No Stamp", img: "", rarity: "" },
            { position: 21, name: "No Stamp", img: "", rarity: "" },
            { position: 22, name: "No Stamp", img: "", rarity: "" },
            { position: 23, name: "No Stamp", img: "", rarity: "" },
            { position: 24, name: "No Stamp", img: "", rarity: "" },
            { position: 25, name: "No Stamp", img: "", rarity: "" }
        ]
    },
    "42": {
        "album": "Card Collector",
        "list": [
            { position: 1, name: "Yooyu Trading Card", img: "yooyu_tradiingcard.gif", rarity: "r101" },
            { position: 2, name: "Altador Cup Collectable Card", img: "ac_collectible_card.gif", rarity: "r101" },
            { position: 3, name: "No Stamp", img: "", rarity: "" },
            { position: 4, name: "No Stamp", img: "", rarity: "" },
            { position: 5, name: "No Stamp", img: "", rarity: "" },
            { position: 6, name: "No Stamp", img: "", rarity: "" },
            { position: 7, name: "No Stamp", img: "", rarity: "" },
            { position: 8, name: "No Stamp", img: "", rarity: "" },
            { position: 9, name: "No Stamp", img: "", rarity: "" },
            { position: 10, name: "No Stamp", img: "", rarity: "" },
            { position: 11, name: "No Stamp", img: "", rarity: "" },
            { position: 12, name: "No Stamp", img: "", rarity: "" },
            { position: 13, name: "No Stamp", img: "", rarity: "" },
            { position: 14, name: "No Stamp", img: "", rarity: "" },
            { position: 15, name: "No Stamp", img: "", rarity: "" },
            { position: 16, name: "No Stamp", img: "", rarity: "" },
            { position: 17, name: "No Stamp", img: "", rarity: "" },
            { position: 18, name: "No Stamp", img: "", rarity: "" },
            { position: 19, name: "No Stamp", img: "", rarity: "" },
            { position: 20, name: "No Stamp", img: "", rarity: "" },
            { position: 21, name: "No Stamp", img: "", rarity: "" },
            { position: 22, name: "No Stamp", img: "", rarity: "" },
            { position: 23, name: "No Stamp", img: "", rarity: "" },
            { position: 24, name: "No Stamp", img: "", rarity: "" },
            { position: 25, name: "No Stamp", img: "", rarity: "" }
        ]
    }
};

// Get the data for this album page
const albumID = location.search.match(/page_id=(\d+)&*/)[1];
const thisPage = STAMP_LIST[albumID];

$("body").append(`
    <style>
        .fake-stamp {
            opacity: 25% !important;
        }
        .stamp-info {
            display: none;
        }
        .stamp-info.visible {
            display: block;
            text-align: center;
        }
        .stamp-info-table {
            width: 450px;
            margin: auto;
            border: 1px solid #b1b1b1;
            border-collapse: collapse;
        }
        .stamp-info-table td {
            padding: 6px;
        }
        .searchimg {
            width: 35px !important;
            height: 35px !important;
        }
        .content table img {
            cursor: pointer;
        }
        .stamp-selected {
            /* Green border box */
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAIAAAC3ytZVAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAECSURBVHhe7dBBEYAwEARBtKAnZqMQfhRzFtJba2D6uvfy7zhyHDmOHEc+OZ7DNvJxJB9H8nEkH0fycSQfR/JxJB9H8nEkH0fycSQfR/JxJB9H8nEkH0fycSQfR/JxJB9H8nEkH0fycSQfR/JxJB9H8nEkH0fycSQfR/JxJB9H8nEkH0fycSQfR/JxJB9H8nEkH0fycSQfR/JxJB9H8nEkH0fycSQfR/JxJB9H8nEkH0fycSQfR/JxJB9H8nEkH0fycSQfR/JxJB9H8nEkH0fycSQfR/JxJB9H8nEkH0fycSQfR/JxJB9H8nEkH0fycSQfR/JxJH9yHH4cOY4cR47j971exW0rqwgJ0K4AAAAASUVORK5CYII=) no-repeat;
        }
        .stamp-info-arrow:hover {
            background: #dfdfdf;
        }
    </style>
`);

// Replace the images
let infoContent = {};
$(".content table img").each(function (index, element) {

    const { position, name, img, rarity } = thisPage["list"][index];

    $(element).attr("position", position).attr("rarity", rarity);

    if ($(element).attr("alt") === "No Stamp" && name !== "No Stamp") {
        $(element)
            .addClass("fake-stamp")
            .attr("title", name)
            .attr("src", `http://images.neopets.com/items/${img}`)
            .attr("alt", name)
            .attr("rarity", rarity);
    }

    infoContent[position] = createInfoContent(element);

    $(element).on("click", function () {
        $(".stamp-info").html(infoContent[position]).show();
        $(".content table td").removeClass("stamp-selected");
        $(element).parent().addClass("stamp-selected");
    });

    if (hasPremium && name !== "No Stamp") {
        $(element).on("dblclick", function () {
            sswopen(name);
        });
    }

});

function createInfoContent(imgElement) {

    const $img = $(imgElement),
        src = $img.attr("src"),
        stampName = $img.attr("alt"),
        position = $img.attr("position"),
        rarity = $img.attr("rarity");

    if (stampName === "No Stamp") {
        return `
<br>
<table class="stamp-info-table">
    <tr>
        <td class="stamp-info-arrow prev-arrow" rowspan="5"><img alt="Previous" src="http://images.neopets.com/themes/h5/premium/images/arrow-left.svg" style="width: 20px"></td>
        <td rowspan="5" style="width: 30%; text-align: center;"><img src="${src}"></td>
        <td style="text-align: center; font-weight: bold; padding: 12px;">${stampName}</td>
        <td class="stamp-info-arrow next-arrow" rowspan="5"><img alt="Next" src="http://images.neopets.com/themes/h5/premium/images/arrow-right.svg" style="width: 20px"></td>
    </tr>
    <tr>
        <td>Position: <b id="current-stamp-pos">${position}</b></td>
    </tr>
    <tr>
        <td>This stamp hasn't been released yet.</td>
    </tr>
    <tr>
        <td></td>
    </tr>
    <tr>
        <td style="text-align: center;"></td>
    </tr>
</table>
        `;
    }

    const hasStamp = $img.hasClass("fake-stamp") === false;

    // const hasStampText = `<b>${owner}</b> ${hasStamp ? '<b style="color: green">has</b>' : '<b style="color: red">doesn\'t have</b>'} this stamp.`;
    const hasStampText = `Status: ${hasStamp ? '<b style="color: green">Collected!</b>' : '<b style="color: red">Not collected</b>'}`;

    const rarityText = r => {
        const rNum = parseInt(r.replace(/r/, ``));
        if (rNum <= 74) return r;
        else if (rNum >= 75 && rNum <= 84) return `<strong style="color:green">${r} (uncommon)</strong>`;
        else if (rNum >= 85 && rNum <= 89) return `<strong style="color:green">${r} (rare)</strong>`;
        else if (rNum >= 90 && rNum <= 94) return `<strong style="color:green">${r} (very rare)</strong>`;
        else if (rNum >= 95 && rNum <= 98 || rNum === 100) return `<strong style="color:green">${r} (ultra rare)</strong>`;
        else if (rNum === 99) return `<strong style="color:green">${r} (super rare)</strong>`;
        else if (rNum >= 101 && rNum <= 104) return `<strong style="color:#aa4455">${r} (special)</strong>`;
        else if (rNum >= 105 && rNum <= 110) return `<strong style="color:red">${r} (MEGA RARE)</strong>`;
        else if (rNum >= 111 && rNum <= 179) return `<strong style="color:red">${r} (RARITY ${rNum})</strong>`;
        else if (rNum === 180) return `<strong style="color:#666666">${r} (retired)</strong>`;
    };

    const createHelper = itemName => {
        // From diceroll's Search Helper script - https://github.com/diceroll123/NeoSearchHelper
        const linkmap = { // for urls and images for each search type
            ssw: {
                img: "http://images.neopets.com/premium/shopwizard/ssw-icon.svg"
            },
            sw: {
                url: "http://www.neopets.com/shops/wizard.phtml?string=%s",
                img: "http://images.neopets.com/themes/h5/basic/images/shopwizard-icon.png"
            },
            tp: {
                url: "http://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=item_exact&search_string=%s",
                img: "http://images.neopets.com/themes/h5/basic/images/tradingpost-icon.png"
            },
            au: {
                url: "http://www.neopets.com/genie.phtml?type=process_genie&criteria=exact&auctiongenie=%s",
                img: "http://images.neopets.com/themes/h5/basic/images/auction-icon.png"
            },
            sdb: {
                url: "http://www.neopets.com/safetydeposit.phtml?obj_name=%s&category=0",
                img: "http://images.neopets.com/images/emptydepositbox.gif"
            },
            jni: {
                url: "https://items.jellyneo.net/search/?name=%s&name_type=3",
                img: "http://images.neopets.com/items/toy_plushie_negg_fish.gif"
            }
        };

        const combiner = (item, url, image) => {
            url = url.replace("%s", item);
            return `<a tabindex='-1' target='_blank' href='${url}'><img src='${image}' class='searchimg'></a>`;
        };

        const sswhelper = item => {
            let ssw = ``;
            if (hasPremium) {
                ssw = `<img item="${item}" class="stamp-ssw-helper searchimg" src="${linkmap.ssw.img}">`;
            }
            return ssw;
        };

        return `<span class="search-helper">${sswhelper(itemName)}${combiner(itemName, linkmap.sw.url, linkmap.sw.img)}${combiner(itemName, linkmap.tp.url, linkmap.tp.img)}${combiner(itemName, linkmap.au.url, linkmap.au.img)}${combiner(itemName, linkmap.sdb.url, linkmap.sdb.img)}${combiner(itemName, linkmap.jni.url, linkmap.jni.img)}</span>`;
    };

    return `<br>
<table class="stamp-info-table" item="${stampName}">
    <tr>
        <td class="stamp-info-arrow prev-arrow" rowspan="4"><img alt="Previous" src="http://images.neopets.com/themes/h5/premium/images/arrow-left.svg" style="width: 20px"></td>
        <td rowspan="4" style="width: 30%; text-align: center;"><img src="${src}"></td>
        <td style="text-align: center; font-weight: bold; padding: 12px;">${stampName}<br>${rarityText(rarity)}</td>
        <td class="stamp-info-arrow next-arrow" rowspan="4"><img alt="Next" src="http://images.neopets.com/themes/h5/premium/images/arrow-right.svg" style="width: 20px"></td>
    </tr>
    <tr>
        <td>Position: <b id="current-stamp-pos">${position}</b></td>
    </tr>
    <tr>
        <td>${hasStampText}</td>
    </tr>
    <tr>
        <td style="text-align: center; padding: 16px 6px;">${createHelper(stampName)}</td>
    </tr>
</table>
    `;
}

// Add stamp info menu
$(".content table").after(`<p class="stamp-info"></p>`);

// Add right-click tip
if (hasPremium) {
    $(".content table").before(`<p style="text-align: center; font-style: italic; color: green; font-weight: bold">Double-click the stamp to search it<br>on the Super Shop Wizard!</p>`)
}

const jnfish = `<img src="http://images.neopets.com/items/toy_plushie_negg_fish.gif" style="width: 30px; height: 30px; vertical-align: middle;">`;
$(".content").append(`<p style="text-align: center;"><a href="https://items.jellyneo.net/search/?sort=6&album=${albumID}" target="_blank">${jnfish}&nbsp;Album info&nbsp;${jnfish}</a></p>`);

// SSW icon
$("body").on("click", ".stamp-ssw-helper", function () {
    const item = $(this).attr("item");
    sswopen(item);
});

function sswopen(item) {
    if ($(".sswdrop").hasClass("panel_hidden")) {
        $("#sswmenu .imgmenu").click();
    }
    if ($("#ssw-tabs-1").hasClass("ui-tabs-hide")) {
        $("#button-new-search").click();
    }

    $("#ssw-criteria").val("exact");
    $("#searchstr").val(item);
}

// Stamp prev/next arrow
$("body").on("click", ".stamp-info-arrow", function () {
    const isNext = $(this).hasClass("next-arrow");
    const isPrev = $(this).hasClass("prev-arrow");

    const position = parseInt($("#current-stamp-pos").html());
    console.log(position);

    const newPosition = (function () {
        if (position === 25 && isNext) {
            return 1;
        }
        else if (position === 1 && isPrev) {
            return 25;
        }
        else if (isNext) {
            return position + 1;
        }
        else if (isPrev) {
            return position - 1;
        }
    })();

    $(`img[position='${newPosition}']`).click();
});