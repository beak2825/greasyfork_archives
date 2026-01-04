// ==UserScript==
// @name            HWM_auction_upd
// @author          Мифист
// @namespace       Мифист
// @version         2.1.7
// @description     Обновленный рынок
// @match           https://www.heroeswm.ru/auction.php*
// @match           https://*.lordswm.com/auction.php*
// @run-at          document-end
// @grant           none
// @license         MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/434889/HWM_auction_upd.user.js
// @updateURL https://update.greasyfork.org/scripts/434889/HWM_auction_upd.meta.js
// ==/UserScript==

(async function initModule(view) {
  'use strict';

  [...Array(setTimeout(0))].forEach((x, i) => clearTimeout(i));

  if (document.visibilityState === 'hidden') {
    const callback = () => initModule(view);
    document.addEventListener('visibilitychange', callback, { once: true });
    return;
  }

  // ====================

  const allArtsData = {
    "icehammer1": "events/&",
    "icehammer2": "events/&",
    "icehammer3": "events/&",
    "mirh_ring3": "events/&",
    "mirh_ring1": "events/&",
    "mirh_ring2": "events/&",
    "arm_tesak2": "events/&",
    "arm_tesak1": "events/&",
    "arm_tesak3": "events/&",
    "18turban": "other/&",
    "neut_leaf": "events/&",
    "arm_handgun1": "events/&",
    "arm_handgun2": "events/&",
    "arm_handgun3": "events/&",
    "armad_aml1": "events/&",
    "armad_aml2": "events/&",
    "armad_aml3": "events/&",
    "dglef1": "events/&",
    "dglef2": "events/&",
    "dglef3": "events/&",
    "dun_pendant1": "events/&",
    "dun_pendant2": "events/&",
    "dun_pendant3": "events/&",
    "forest_edge": "events/&",
    "stalker_ark1": "events/&",
    "stalker_ark2": "events/&",
    "stalker_ark3": "events/&",
    "stalker_backsword1": "events/&",
    "stalker_backsword2": "events/&",
    "stalker_backsword3": "events/&",
    "stalker_sring1": "events/&",
    "stalker_sring2": "events/&",
    "stalker_sring3": "events/&",
    "steptopor1": "events/&",
    "steptopor2": "events/&",
    "steptopor3": "events/&",
    "sun_sword": "&",
    "sv_order1": "events/&",
    "sv_order2": "events/&",
    "sv_order3": "events/&",
    "wandr_cloack1": "events/&",
    "wandr_cloack2": "events/&",
    "wandr_cloack3": "events/&",
    "drak_greaves1": "events/drak_bgreaves1",
    "drak_greaves2": "events/drak_bgreaves2",
    "drak_greaves3": "events/drak_bgreaves3",
    "ed_barrel1": "events/&",
    "ed_barrel2": "events/&",
    "ed_barrel3": "events/&",
    "mir_bow1": "events/&",
    "mir_bow2": "events/&",
    "mir_bow3": "events/&",
    "smaska1": "events/&",
    "smaska2": "events/&",
    "smaska3": "events/&",
    "stalker_iring1": "events/&",
    "stalker_iring2": "events/&",
    "stalker_iring3": "events/&",
    "wanderer_boot1": "events/&",
    "wanderer_boot2": "events/&",
    "wanderer_boot3": "events/&",
    "10scroll": "&",
    "12hron": "other/&",
    "13coin": "&",
    "16amul": "other/&",
    "17bring": "other/&",
    "2year_amul_lords": "&",
    "3year_amul": "&",
    "3year_art": "3rd",
    "4year_klever": "&",
    "5years_star": "5year_star",
    "6ring": "&",
    "7ka": "&",
    "8amul_inf": "8amul",
    "9amu_let": "other/9amulet",
    "a_dagger1": "events/&",
    "a_dagger2": "events/&",
    "a_mallet": "auc_1lot",
    "adv_armor1": "events/&",
    "adv_armor2": "events/&",
    "adv_boot1": "events/&",
    "adv_boot2": "events/&",
    "adv_clk1": "events/&",
    "adv_clk2": "events/&",
    "adv_fring1": "events/&",
    "adv_fring2": "events/&",
    "adv_hm1": "events/&",
    "adv_hm2": "events/&",
    "adv_longbow1": "events/&",
    "adv_longbow2": "events/&",
    "adv_neck1": "events/&",
    "adv_neck2": "events/&",
    "adv_saber1": "events/&",
    "adv_saber2": "events/&",
    "adv_shild1": "events/&",
    "adv_shild2": "events/&",
    "adv_sumk1": "events/&",
    "adv_sumk2": "events/&",
    "amf_body": "bwar/&",
    "amf_boot": "bwar/&",
    "amf_cl": "bwar/&",
    "amf_helm": "bwar/&",
    "amf_scroll": "bwar/&",
    "amf_weap": "bwar/&",
    "amulet19": "nwamulet19",
    "amulet_of_luck": "lucknecklace",
    "ankh1": "events/&",
    "ankh2": "events/&",
    "anomal_ring1": "events/&",
    "anomal_ring2": "events/&",
    "anomal_ring3": "events/&",
    "antiair_cape": "&",
    "antifire_cape": "&",
    "antimagic_cape": "&",
    "arm_armor1": "events/&",
    "arm_armor2": "events/&",
    "arm_armor3": "events/&",
    "arm_bts1": "events/&",
    "arm_bts2": "events/&",
    "arm_bts3": "events/&",
    "arm_cap1": "events/&",
    "arm_cap2": "events/&",
    "arm_cap3": "events/&",
    "arm_clk1": "events/&",
    "arm_clk2": "events/&",
    "arm_clk3": "events/&",
    "arm_r1": "events/&",
    "arm_r2": "events/&",
    "arm_r3": "events/&",
    "arm_sekstant1": "events/&",
    "arm_sekstant2": "events/&",
    "arm_sekstant3": "events/&",
    "armor15": "&",
    "armor17": "anwarmor17",
    "bafamulet15": "&",
    "bal_cube": "events/&",
    "barb_armor": "&",
    "barb_boots": "&",
    "barb_club": "&",
    "barb_helm": "&",
    "barb_shield": "&",
    "battlem_cape": "events/&",
    "bear_statue": "events/medved",
    "bfly": "gifts/&",
    "blackring": "other/&",
    "blacksword": "&",
    "blacksword1": "blacksword",
    "bludgeon": "&",
    "boots13": "&",
    "boots15": "&",
    "boots17": "bzbboots17",
    "boots2": "&",
    "bow14": "&",
    "bow17": "bbobow17",
    "bravery_medal": "braverymedal",
    "bril_pendant": "gifts/&",
    "bril_ring": "gifts/&",
    "bring14": "&",
    "broad_sword": "broadsword",
    "brush": "&",
    "brush_2011y": "brush",
    "bshield1": "event/&",
    "bshield2": "event/&",
    "bshield3": "event/&",
    "buben1": "events/&",
    "buben2": "events/&",
    "buben3": "events/&",
    "bunt_medal1": "bunt_medal1f",
    "bunt_medal2": "&",
    "bunt_medal3": "bunt_medal3f",
    "bwar1": "bwar/bmedal1",
    "bwar2": "bwar/bmedal2",
    "bwar3": "bwar/bmedal3",
    "bwar4": "bwar/bmedal4",
    "bwar5": "bwar/bmedal5",
    "bwar6": "bwar/bmedal6",
    "bwar7": "bwar/bmedal7",
    "bwar_splo": "bwar/bmedala1",
    "bwar_stoj": "bwar/bmedalb1",
    "bwar_takt": "bwar/bmedalc1",
    "castle_orden": "events/&",
    "cat_statue": "events/e_cat",
    "centaurbow": "&",
    "chain_coif": "chaincoif",
    "chains1": "events/&",
    "chains2": "events/&",
    "chains3": "events/&",
    "ciras": "&",
    "circ_ring": "&",
    "cloack17": "clscloack17",
    "cloackwz15": "&",
    "clover_amul": "&",
    "cold_shieldn": "&",
    "cold_sword2014": "&",
    "coldamul": "&",
    "coldring_n": "coldring",
    "commander_ring": "events/&",
    "compass": "other/&",
    "composite_bow": "&",
    "crystal": "events/&",
    "cubed": "events/&",
    "cubeg": "events/&",
    "cubes": "events/&",
    "d_spray": "gifts/&",
    "dagger": "&",
    "dagger16": "&",
    "dagger20": "&",
    "dagger_dex": "&",
    "dagger_myf": "&",
    "dark_amul": "events/&",
    "dark_armor": "events/&",
    "dark_axe": "events/&",
    "dark_boots": "events/&",
    "dark_bow": "events/&",
    "dark_cloak": "events/&",
    "dark_dagger": "events/&",
    "dark_helmet": "events/&",
    "dark_ring": "events/&",
    "dark_shield": "events/&",
    "darkelfboots": "&",
    "darkelfciras": "&",
    "darkelfcloack": "&",
    "darkelfkaska": "&",
    "darkelfpendant": "&",
    "darkelfstaff": "&",
    "darkring": "&",
    "def_sword": "&",
    "defender_dagger": "gifts/&",
    "defender_shield": "protectshield",
    "dem_amulet": "&",
    "dem_armor": "&",
    "dem_axe": "&",
    "dem_bootshields": "&",
    "dem_dmech": "dmech",
    "dem_dtopor": "dtopor",
    "dem_helmet": "&",
    "dem_kosa": "kosa",
    "dem_shield": "&",
    "demwar1": "&",
    "demwar2": "&",
    "demwar3": "&",
    "demwar4": "&",
    "demwar5": "&",
    "demwar6": "&",
    "dering": "event/&",
    "dog_statue": "events/e_dog",
    "doubt_ring": "necroring",
    "dragon_crown": "other/&",
    "dragon_shield": "&",
    "dragonstone": "events/&",
    "drak_armor1": "events/&",
    "drak_armor2": "events/&",
    "drak_armor3": "events/&",
    "drak_crown1": "events/&",
    "drak_crown2": "events/&",
    "drak_crown3": "events/&",
    "dring12": "rings/&",
    "dring15": "rings/&",
    "dring18": "rings/&",
    "dring21": "rings/&",
    "dring5": "rings/&",
    "dring9": "rings/&",
    "druid_amulet": "kwar/dd_amulet",
    "druid_armor": "kwar/dd_robe",
    "druid_boots": "kwar/dd_boots",
    "druid_cloack": "kwar/dd_cloack",
    "druid_staff": "kwar/dd_staff",
    "dubina": "&",
    "dudka": "event/&",
    "dun_amul1": "events/&",
    "dun_amul2": "events/&",
    "dun_amul3": "events/&",
    "dun_armor1": "events/&",
    "dun_armor2": "events/&",
    "dun_armor3": "events/&",
    "dun_boots1": "events/&",
    "dun_boots2": "events/&",
    "dun_boots3": "events/&",
    "dun_bow1": "events/&",
    "dun_bow2": "events/&",
    "dun_bow3": "events/&",
    "dun_cloak1": "events/&",
    "dun_cloak2": "events/&",
    "dun_cloak3": "events/&",
    "dun_dagger1": "events/&",
    "dun_dagger2": "events/&",
    "dun_dagger3": "events/&",
    "dun_ring1": "events/&",
    "dun_ring2": "events/&",
    "dun_ring3": "events/&",
    "dun_shield1": "events/&",
    "dun_shield2": "events/&",
    "dun_shield3": "events/&",
    "dun_sword1": "events/&",
    "dun_sword2": "events/&",
    "dun_sword3": "events/&",
    "dung_axe1": "events/&",
    "dung_axe2": "events/&",
    "dung_axe3": "events/&",
    "dung_glefa1": "events/&",
    "dung_glefa2": "events/&",
    "dung_glefa3": "events/&",
    "e_shield1": "events/&",
    "e_shield2": "events/&",
    "ed_armr1": "events/&",
    "ed_armr2": "events/&",
    "ed_armr3": "events/&",
    "ed_bsword1": "events/&",
    "ed_bsword2": "events/&",
    "ed_bsword3": "events/&",
    "ed_elfbow1": "events/&",
    "ed_elfbow2": "events/&",
    "ed_elfbow3": "events/&",
    "ed_mbook1": "events/&",
    "ed_mbook2": "events/&",
    "ed_mbook3": "events/&",
    "ed_pendant1": "events/&",
    "ed_pendant2": "events/&",
    "ed_pendant3": "events/&",
    "ed_ring1": "events/&",
    "ed_ring2": "events/&",
    "ed_ring3": "events/&",
    "ed_svboots1": "events/&",
    "ed_svboots2": "events/&",
    "ed_svboots3": "events/&",
    "eddem_ring1": "events/&",
    "eddem_ring2": "events/&",
    "eddem_ring3": "events/&",
    "eg_order1": "events/&",
    "eg_order2": "events/&",
    "eg_order3": "events/&",
    "elfamulet": "&",
    "elfboots": "&",
    "elfbow": "&",
    "elfdagger": "event/&",
    "elfshirt": "&",
    "elfwar1": "&",
    "elfwar2": "&",
    "elfwar3": "&",
    "elfwar4": "&",
    "elfwar5": "&",
    "elfwar6": "&",
    "energy_scroll": "&",
    "eye1": "events/&",
    "eye2": "events/&",
    "eye3": "events/&",
    "fear_amulk": "events/&",
    "fear_bonearmour": "events/&",
    "fear_boots": "events/&",
    "fear_cloack": "events/&",
    "fear_scythe": "events/&",
    "ffstaff15": "&",
    "finecl": "&",
    "firehammer": "events/&",
    "firsword15": "&",
    "flower_heart": "gifts/&",
    "flowers1": "gifts/_&",
    "flowers2": "gifts/_&",
    "flowers3": "gifts/_&",
    "flowers4": "gifts/buk2",
    "flowers5": "gifts/buk1",
    "flyaga": "events/&",
    "forest_armor": "events/&",
    "forest_blade": "events/&",
    "forest_bolt": "events/&",
    "forest_boots": "events/&",
    "forest_bow": "events/&",
    "forest_crossbow": "events/&",
    "forest_dagger": "events/&",
    "forest_helm": "events/&",
    "forest_knives": "events/&",
    "full_plate": "&",
    "gargoshield": "events/&",
    "gdubina": "&",
    "gm_3arrows": "gm/&",
    "gm_abow": "gm/&",
    "gm_amul": "gm/&",
    "gm_arm": "gm/&",
    "gm_defence": "gm/&",
    "gm_hat": "gm/&",
    "gm_kastet": "gm/&",
    "gm_protect": "gm/&",
    "gm_rring": "gm/&",
    "gm_spdb": "gm/&",
    "gm_sring": "gm/&",
    "gm_sword": "gm/&",
    "gmage_armor": "kwar/bm_robe",
    "gmage_boots": "kwar/bm_boots",
    "gmage_cloack": "kwar/bm_cloack",
    "gmage_crown": "kwar/bm_crown",
    "gmage_scroll": "kwar/bm_scroll",
    "gmage_staff": "kwar/bm_staff",
    "gnome_hammer": "onehandaxe",
    "gnomearmor": "gnomewar/armor1",
    "gnomeboots": "gnomewar/boots1",
    "gnomehammer": "gnomewar/hammer1",
    "gnomehelmet": "gnomewar/helmet1",
    "gnomem_amulet": "gnomewar/amulet2",
    "gnomem_armor": "gnomewar/armor2",
    "gnomem_boots": "gnomewar/gw_boots2",
    "gnomem_hammer": "gnomewar/hammer2",
    "gnomem_helmet": "gnomewar/helmet2",
    "gnomem_shield": "gnomewar/shield2",
    "gnomeshield": "gnomewar/shield1",
    "gnomewar1": "gnomewar/medal1",
    "gnomewar2": "gnomewar/medal2",
    "gnomewar3": "gnomewar/medal3",
    "gnomewar4": "gnomewar/medal4",
    "gnomewar5": "gnomewar/medal5",
    "gnomewar6": "gnomewar/medal6",
    "gnomewar7": "gnomewar/medal7",
    "goblin_bow": "&",
    "goldciras": "gifts/&",
    "gring": "events/&",
    "gringd": "events/&",
    "half_heart_m": "gifts/&",
    "half_heart_w": "gifts/&",
    "hauberk": "chainarmor",
    "heaven_amlt": "events/&",
    "heaven_armr": "events/&",
    "heaven_bow": "events/&",
    "heaven_bts": "events/&",
    "heaven_clk": "events/&",
    "heaven_dagger": "events/&",
    "heaven_helm": "events/&",
    "heaven_rn": "events/&",
    "heaven_shield": "events/&",
    "heaven_staff": "events/&",
    "helmet17": "hwmhelmet17",
    "hm1": "events/&",
    "hm2": "events/&",
    "hopesh1": "events/&",
    "hopesh2": "events/&",
    "hunter_amulet1": "&",
    "hunter_armor1": "&",
    "hunter_arrows1": "&",
    "hunter_boots": "hunterboots",
    "hunter_boots1": "&",
    "hunter_boots2": "&",
    "hunter_boots3": "&",
    "hunter_bow1": "&",
    "hunter_bow2": "&",
    "hunter_gloves1": "&",
    "hunter_hat1": "&",
    "hunter_helm": "&",
    "hunter_jacket1": "&",
    "hunter_mask1": "&",
    "hunter_pendant1": "&",
    "hunter_ring1": "&",
    "hunter_ring2": "&",
    "hunter_roga1": "&",
    "hunter_shield1": "&",
    "hunter_sword1": "&",
    "hunterdagger": "&",
    "hunterdsword": "&",
    "huntershield2": "&",
    "huntersword2": "&",
    "i_ring": "&",
    "icebow1": "events/&",
    "icebow2": "events/&",
    "icebow3": "events/&",
    "icecr1": "events/&",
    "icecr2": "events/&",
    "icecr3": "events/&",
    "icesphere1": "events/&",
    "icesphere2": "events/&",
    "icesphere3": "events/&",
    "imp_amul": "events/&",
    "imp_armor": "events/&",
    "imp_boots": "events/&",
    "imp_cloak": "events/&",
    "imp_crossbow": "events/&",
    "imp_dagger": "events/&",
    "imp_helmet": "events/&",
    "imp_ring": "events/&",
    "imp_shield": "events/&",
    "imp_sword": "events/&",
    "inq_body": "bwar/&",
    "inq_boot": "bwar/&",
    "inq_cl": "bwar/&",
    "inq_helm": "bwar/&",
    "inq_ring1": "events/&",
    "inq_ring2": "events/&",
    "inq_weap": "bwar/&",
    "kn_body": "bwar/&",
    "kn_helm": "bwar/&",
    "kn_shield": "bwar/&",
    "kn_weap": "bwar/&",
    "kniga": "events/&",
    "knightarmor": "kwar/kk_armor",
    "knightboots": "kwar/kk_boots",
    "knighthelmet": "kwar/kk_helmet",
    "knightshield": "kwar/kk_shield",
    "knightsword": "kwar/kk_sword",
    "knowledge_hat": "knowlengehat",
    "koltsou": "&",
    "kopie": "&",
    "krest1": "events/&",
    "krest2": "events/&",
    "krest3": "events/&",
    "kwar1": "kwar/kmedal1",
    "kwar2": "kwar/kmedal2",
    "kwar3": "kwar/kmedal3",
    "kwar4": "kwar/kmedal4",
    "kwar5": "kwar/kmedal5",
    "kwar6": "kwar/kmedal6",
    "kwar7": "kwar/kmedal7",
    "kwar_splo": "kwar/medala",
    "kwar_stoj": "kwar/medalb",
    "kwar_takt": "kwar/medalc",
    "kznamya1": "events/&",
    "kznamya2": "events/&",
    "large_shield": "&",
    "lbow": "&",
    "leather_helm": "leatherhelmet",
    "leather_shiled": "leathershield",
    "leatherboots": "&",
    "leatherhat": "&",
    "leatherplate": "&",
    "les_cl": "events/&",
    "lizard_helm": "&",
    "long_bow": "&",
    "lotus1": "events/&",
    "lotus2": "events/&",
    "lotus3": "events/&",
    "m_amul1": "events/&",
    "m_amul2": "events/&",
    "m_amul3": "events/&",
    "m_armor1": "events/&",
    "m_armor2": "events/&",
    "m_armor3": "events/&",
    "mage_armor": "&",
    "mage_boots": "war/&",
    "mage_cape": "war/&",
    "mage_hat": "war/&",
    "mage_helm": "&",
    "mage_robe": "war/&",
    "mage_scroll": "war/&",
    "mage_staff": "war/&",
    "magewar1": "medals/&",
    "magewar2": "medals/&",
    "magewar3": "medals/&",
    "magewar4": "medals/&",
    "magewar5": "medals/&",
    "magic_amulet": "&",
    "magma_arb": "events/&",
    "magma_armor": "events/&",
    "magma_boots": "events/&",
    "magma_clc": "events/&",
    "magma_dagger": "events/&",
    "magma_helm": "events/&",
    "magma_lshield": "events/&",
    "magma_pend": "events/&",
    "magma_rd": "events/&",
    "magma_swrd": "events/&",
    "magneticarmor": "events/&",
    "magring13": "&",
    "mamulet19": "megmamulet19",
    "marmor17": "mammarmor17",
    "mart8_flowers1": "_flower1",
    "mart8_ring1": "_womenring1",
    "mboots14": "&",
    "mboots17": "macmboots17",
    "mechanic_glasses1": "events/mechanics_glasses1",
    "mechanic_glasses2": "events/mechanics_glasses2",
    "mechanic_glasses3": "events/mechanics_glasses3",
    "merc_armor": "&",
    "merc_boots": "&",
    "merc_dagger": "&",
    "merc_sword": "&",
    "mgear": "events/mgear1",
    "mh_sword1": "events/&",
    "mh_sword2": "events/&",
    "mh_sword3": "events/&",
    "mhelmet17": "miqmhelmet17",
    "mhelmetzh13": "&",
    "mhelmv1": "events/&",
    "mhelmv2": "events/&",
    "mhelmv3": "events/&",
    "mif_hboots": "&",
    "mif_hhelmet": "&",
    "mif_lboots": "&",
    "mif_lhelmet": "&",
    "mif_light": "&",
    "mif_staff": "&",
    "mif_sword": "&",
    "miff_plate": "&",
    "mir_am1": "events/&",
    "mir_am2": "events/&",
    "mir_am3": "events/&",
    "mir_armor1": "events/&",
    "mir_armor2": "events/&",
    "mir_armor3": "events/&",
    "mir_boots1": "events/&",
    "mir_boots2": "events/&",
    "mir_boots3": "events/&",
    "mir_cl1": "events/&",
    "mir_cl2": "events/&",
    "mir_cl3": "events/&",
    "mir_helmt1": "events/&",
    "mir_helmt2": "events/&",
    "mir_helmt3": "events/&",
    "mir_shld1": "events/&",
    "mir_shld2": "events/&",
    "mir_shld3": "events/&",
    "mirror": "events/&",
    "mm_staff": "&",
    "mm_sword": "&",
    "mmmring16": "&",
    "mmzamulet13": "&",
    "mmzamulet16": "&",
    "molot_tan": "&",
    "mring19": "meqmring19",
    "msphere": "events/&",
    "mstaff10": "&",
    "mstaff13": "&",
    "mstaff8": "&",
    "mtcloak1": "other/&",
    "mtcloak2": "other/&",
    "mtcloak3": "other/&",
    "myhelmet15": "&",
    "n_amul": "nset/&",
    "n_armor": "nset/&",
    "n_boots": "nset/&",
    "n_clk": "nset/&",
    "n_helmet": "nset/&",
    "n_ringa": "nset/&",
    "n_ringd": "nset/&",
    "n_shield": "nset/&",
    "n_sword": "nset/&",
    "necr_amulet": "&",
    "necr_helm": "&",
    "necr_robe": "necr_cloak",
    "necr_staff": "&",
    "necrohelm1": "&",
    "necrohelm2": "&",
    "necrohelm3": "&",
    "necrwar1st": "&",
    "necrwar2st": "&",
    "necrwar3st": "&",
    "necrwar4st": "&",
    "necrwar5st": "&",
    "nefrit1": "events/nefrit_1",
    "nefrit2": "events/nefrit_2",
    "nefrit3": "events/nefrit_3",
    "neut_amulet": "sh/sh_amulet",
    "neut_ring": "events/forest_ring",
    "nv_body": "bwar/&",
    "nv_boot": "bwar/&",
    "nv_helm": "bwar/&",
    "nv_shield": "bwar/&",
    "nv_weap": "bwar/&",
    "obereg": "events/&",
    "ocean_boots1": "events/&",
    "ocean_boots2": "events/&",
    "ocean_boots3": "events/&",
    "ocean_bw1": "events/&",
    "ocean_bw2": "events/&",
    "ocean_bw3": "events/&",
    "ocean_cl1": "events/&",
    "ocean_cl2": "events/&",
    "ocean_cl3": "events/&",
    "ocean_dgr1": "events/&",
    "ocean_dgr2": "events/&",
    "ocean_dgr3": "events/&",
    "ocean_eye1": "events/&",
    "ocean_eye2": "events/&",
    "ocean_eye3": "events/&",
    "ocean_hlm1": "events/&",
    "ocean_hlm2": "events/&",
    "ocean_hlm3": "events/&",
    "ocean_m_shield1": "events/m_shield1",
    "ocean_m_shield2": "events/m_shield2",
    "ocean_m_shield3": "events/m_shield3",
    "ocean_per1": "events/&",
    "ocean_per2": "events/&",
    "ocean_per3": "events/&",
    "ocean_ring1": "events/&",
    "ocean_ring2": "events/&",
    "ocean_ring3": "events/&",
    "ocean_sword1": "events/&",
    "ocean_sword2": "events/&",
    "ocean_sword3": "events/&",
    "ogre_bum": "&",
    "ogre_helm": "&",
    "orc_axe": "&",
    "orc_hat": "&",
    "ord_dark": "events/order_dark",
    "ord_light": "events/order_light",
    "order_griffin": "events/&",
    "order_manticore": "events/&",
    "p_amulet1": "pirate_event/&",
    "p_amulet2": "pirate_event/&",
    "p_amulet3": "pirate_event/&",
    "p_boots1": "pirate_event/&",
    "p_boots2": "pirate_event/&",
    "p_boots3": "pirate_event/&",
    "p_cloak1": "pirate_event/&",
    "p_cloak2": "pirate_event/&",
    "p_cloak3": "pirate_event/&",
    "p_compas1": "pirate_event/p_compass1",
    "p_compas2": "pirate_event/p_compass2",
    "p_compas3": "pirate_event/p_compass3",
    "p_dag1": "events/&",
    "p_dag2": "events/&",
    "p_dag3": "events/&",
    "p_pistol1": "pirate_event/&",
    "p_pistol2": "pirate_event/&",
    "p_pistol3": "pirate_event/&",
    "p_sword1": "pirate_event/&",
    "p_sword2": "pirate_event/&",
    "p_sword3": "pirate_event/&",
    "paladin_armor": "kwar/hc_armor",
    "paladin_boots": "kwar/hc_boots",
    "paladin_bow": "kwar/hc_crossbow",
    "paladin_helmet": "kwar/hc_helmet",
    "paladin_shield": "kwar/hc_shield",
    "paladin_sword": "kwar/hc_sword",
    "pegaskop": "event/&",
    "pen": "&",
    "pen_2011y_clan": "pen",
    "pend_a1": "events/&",
    "pend_a2": "events/&",
    "pend_a3": "events/&",
    "pika": "&",
    "pir_armor1": "pirate_event/&",
    "pir_armor2": "pirate_event/&",
    "pir_armor3": "pirate_event/&",
    "piratehat1": "pirate_event/&",
    "piratehat2": "pirate_event/&",
    "piratehat3": "pirate_event/&",
    "piring1": "pirate_event/&",
    "piring2": "pirate_event/&",
    "piring3": "pirate_event/&",
    "pit_sword1": "events/&",
    "pit_sword2": "events/&",
    "pn_ring1": "pirate_event/&",
    "pn_ring2": "pirate_event/&",
    "pn_ring3": "pirate_event/&",
    "polk__helm1": "&",
    "polk__helm2": "&",
    "polk__helm3": "&",
    "polk_armor1": "events/&",
    "polk_armor2": "events/&",
    "polk_armor3": "events/&",
    "polk_sword1": "events/&",
    "polk_sword2": "events/&",
    "polk_sword3": "events/&",
    "polkboots1": "events/&",
    "polkboots2": "events/&",
    "polkboots3": "events/&",
    "potion01": "potions/zel0001",
    "potion02": "potions/zel0002",
    "potion03": "potions/zel0003",
    "potion04": "potions/zel0004",
    "potion05": "potions/zel0005",
    "potion06": "potions/zel0006",
    "potion07": "potions/zel0007",
    "potion08": "potions/zel0008",
    "pouch": "events/&",
    "power_pendant": "&",
    "power_sword": "&",
    "powercape": "&",
    "powerring": "&",
    "protazan": "gifts/&",
    "quest_pendant1": "other/&",
    "r_bigsword": "ranger/&",
    "r_bootsmb": "ranger/&",
    "r_bow": "ranger/&",
    "r_clck": "ranger/&",
    "r_dagger": "ranger/&",
    "r_goodscroll": "ranger/&",
    "r_helmb": "ranger/&",
    "r_m_amulet": "ranger/&",
    "r_magicsring": "ranger/&",
    "r_magy_staff": "ranger/&",
    "r_warring": "ranger/&",
    "r_warriorsamulet": "ranger/&",
    "r_zarmor": "ranger/&",
    "ramul1": "events/&",
    "ramul2": "events/&",
    "rarmor1": "events/&",
    "rarmor2": "events/&",
    "rashness_ring": "hastering",
    "raxe1": "events/&",
    "raxe2": "events/&",
    "rboots1": "events/&",
    "rboots2": "events/&",
    "rbow1": "events/&",
    "rbow2": "events/&",
    "rcloak1": "events/&",
    "rcloak2": "events/&",
    "rdagger1": "events/&",
    "rdagger2": "events/&",
    "requital_sword": "requitalsword",
    "rhelm1": "events/&",
    "rhelm2": "events/&",
    "ring19": "rarring19",
    "ring2013": "snake_ring",
    "ring_of_thief": "thief_ring",
    "robewz15": "&",
    "rog_demon": "&",
    "rogring1": "events/&",
    "rogring2": "events/&",
    "roses": "gifts/&",
    "round_shiled": "roundshield",
    "rshield1": "events/&",
    "rshield2": "events/&",
    "rsword1": "events/&",
    "rsword2": "events/&",
    "ru_statue": "ruru9",
    "runkam": "events/&",
    "s_shield": "&",
    "samul14": "samul141",
    "samul17": "warsamul17",
    "samul8": "samul81",
    "sandglass": "events/&",
    "sarmor13": "&",
    "sarmor16": "brsarmor16",
    "sarmor9": "&",
    "sboots12": "&",
    "sboots16": "nmsboots16",
    "sboots9": "&",
    "scloack16": "mascloack16",
    "scloack8": "&",
    "scoutcloack": "cloack",
    "scroll18": "shhscroll18",
    "sea_trident": "trident",
    "sh_4arrows": "sh/&",
    "sh_amulet2": "sh/&",
    "sh_armor": "sh/&",
    "sh_boots": "sh/&",
    "sh_bow": "sh/&",
    "sh_cloak": "sh/&",
    "sh_helmet": "sh/&",
    "sh_ring1": "sh/&",
    "sh_ring2": "sh/&",
    "sh_shield": "sh/&",
    "sh_spear": "sh/&",
    "sh_sword": "sh/&",
    "sharik": "ny2014/&",
    "shelm12": "&",
    "shelm16": "umshelm16",
    "shelm8": "&",
    "shield13": "&",
    "shield16": "&",
    "shield19": "sioshield19",
    "shield_14y": "14shield",
    "shieldofforest": "events/&",
    "shoe_of_initiative": "initboots",
    "shortbow": "&",
    "shpaga": "&",
    "skill_book11": "other/skill_book",
    "slayersword": "&",
    "smamul14": "&",
    "smamul17": "sekmamul17",
    "smring10": "&",
    "smring17": "masmring17",
    "smstaff16": "ssmstaff16",
    "sniperbow": "event/&",
    "sor_staff": "&",
    "soul_cape": "soulcape",
    "sph1": "events/&",
    "sph2": "events/&",
    "sph3": "events/&",
    "sring10": "&",
    "sring17": "fgsring17",
    "sring4": "&",
    "sshield11": "&",
    "sshield14": "zpsshield14",
    "sshield17": "esshield17",
    "sshield5": "&",
    "ssword10": "&",
    "ssword13": "&",
    "ssword16": "szzsword16",
    "ssword8": "&",
    "staff": "&",
    "staff18": "smmstaff18",
    "staff_v1": "events/&",
    "staff_v2": "events/&",
    "staff_v3": "events/&",
    "stalker_aml1": "events/&",
    "stalker_aml2": "events/&",
    "stalker_aml3": "events/&",
    "stalker_armour1": "events/&",
    "stalker_armour2": "events/&",
    "stalker_armour3": "events/&",
    "stalker_boot1": "events/&",
    "stalker_boot2": "events/&",
    "stalker_boot3": "events/&",
    "stalker_cl1": "events/&",
    "stalker_cl2": "events/&",
    "stalker_cl3": "events/&",
    "stalker_crsb1": "events/&",
    "stalker_crsb2": "events/&",
    "stalker_crsb3": "events/&",
    "stalker_dagger1": "events/&",
    "stalker_dagger2": "events/&",
    "stalker_dagger3": "events/&",
    "stalker_hlm1": "events/&",
    "stalker_hlm2": "events/&",
    "stalker_hlm3": "events/&",
    "stalker_shid1": "events/&",
    "stalker_shid2": "events/&",
    "stalker_shid3": "events/&",
    "stalkercl": "event/&",
    "statue": "events/&",
    "steel_blade": "steelsword",
    "steel_boots": "&",
    "steel_helmet": "&",
    "student_armor": "quests/&",
    "sumka": "events/&",
    "sun_armor": "&",
    "sun_boots": "&",
    "sun_helm": "&",
    "sun_ring": "&",
    "sun_staff": "&",
    "sunart1": "&",
    "sunart2": "&",
    "sunart3": "&",
    "sunart4": "&",
    "super_dagger": "&",
    "surv_armorsu": "survarts/&",
    "surv_axes": "survarts/&",
    "surv_bootsurv": "survarts/&",
    "surv_cloacksrv": "survarts/&",
    "surv_crossbowsurv": "survarts/&",
    "surv_daggermd": "survarts/&",
    "surv_halberdzg": "survarts/&",
    "surv_helmetpi": "survarts/&",
    "surv_mamulka": "survarts/&",
    "surv_marmoroz": "survarts/&",
    "surv_mbootsbb": "survarts/&",
    "surv_mcloacksv": "survarts/&",
    "surv_mhelmetcv": "survarts/&",
    "surv_mring1fd": "survarts/&",
    "surv_mring2fpg": "survarts/&",
    "surv_scrollcd": "survarts/&",
    "surv_shieldvv": "survarts/&",
    "surv_staffik": "survarts/&",
    "surv_sword2sd": "survarts/&",
    "surv_sword_surv": "survarts/&",
    "surv_wamuletik": "survarts/&",
    "surv_wring1my": "survarts/&",
    "surv_wring2o": "survarts/&",
    "sv_arb": "bwar/&",
    "sv_body": "bwar/&",
    "sv_boot": "bwar/&",
    "sv_helm": "bwar/&",
    "sv_shield": "bwar/&",
    "sv_weap": "bwar/&",
    "sword18": "smasword18",
    "sword5": "&",
    "tact1w1_wamulet": "tact/&",
    "tact765_bow": "tact/&",
    "tactaz_axe": "tact/&",
    "tactcv1_armor": "tact/&",
    "tactdff_shield": "tact/&",
    "tacthapp_helmet": "tact/&",
    "tactmag_staff": "tact/&",
    "tactms1_mamulet": "tact/&",
    "tactpow_cloack": "tact/&",
    "tactsm0_dagger": "tact/&",
    "tactspw_mring": "tact/&",
    "tactwww_wring": "tact/&",
    "tactzl4_boots": "tact/&",
    "taskaxe": "event/&",
    "testring": "&",
    "thief_arb": "&",
    "thief_cape": "&",
    "thief_fastboots": "thief_boots",
    "thief_goodarmor": "thief_armor",
    "thief_ml_dagger": "thief_dagger",
    "thief_msk": "thief_mask",
    "thief_neckl": "thief_amulet",
    "thief_paper": "&",
    "thief_premiumring1": "medals/&",
    "thief_premiumring2": "medals/&",
    "thief_premiumring3": "medals/&",
    "tj-shield1": "&",
    "tj-shield2": "&",
    "tj-shield3": "&",
    "tj_helmet1": "&",
    "tj_helmet2": "&",
    "tj_helmet3": "&",
    "tj_magam1": "events/&",
    "tj_magam2": "events/&",
    "tj_magam3": "events/&",
    "tj_mtuf1": "events/&",
    "tj_mtuf2": "events/&",
    "tj_mtuf3": "events/&",
    "tj_vboots1": "&",
    "tj_vboots2": "&",
    "tj_vboots3": "&",
    "tjam1": "&",
    "tjam2": "&",
    "tjam3": "&",
    "tjarmor1": "&",
    "tjarmor2": "&",
    "tjarmor3": "&",
    "tl_medal1": "tiger_gold",
    "tl_medal2": "tiger_silver",
    "tl_medal3": "tiger_bronze",
    "tm_amulet": "&",
    "tm_arb": "&",
    "tm_armor": "&",
    "tm_boots": "&",
    "tm_cape": "&",
    "tm_knife": "&",
    "tm_mring": "&",
    "tm_msk": "tm_mask",
    "tm_wring": "&",
    "tmarmor1": "events/&",
    "tmarmor2": "events/&",
    "tmarmor3": "events/&",
    "topor_drov": "events/&",
    "topor_skelet": "&",
    "torg_boots": "events/&",
    "totem1": "events/&",
    "totem2": "events/&",
    "totem3": "events/&",
    "trinitypendant": "other/rogue_pendant",
    "trogloditkop": "event/&",
    "ttring": "other/&",
    "tunnel_kirka": "kirka",
    "v-ring1": "&",
    "v-ring2": "&",
    "v-ring3": "&",
    "v_1armor": "verb/&",
    "vbolt1": "event/&",
    "vbolt2": "event/&",
    "vbolt3": "event/&",
    "vbow1": "event/&",
    "vbow2": "event/&",
    "vbow3": "event/&",
    "ve_helm": "verb/&",
    "venok": "gifts/&",
    "verb11_sword": "verb/&",
    "verbboots": "verb/&",
    "verve_ring": "eaglering",
    "vmring1": "events/mring1",
    "vmring2": "events/mring2",
    "vmring3": "events/mring3",
    "vrb_shild": "verb/&",
    "vrdagger1": "events/&",
    "vrdagger2": "events/&",
    "vrdagger3": "events/&",
    "vscroll-1": "events/vscroll1",
    "vscroll-2": "events/vscroll2",
    "vscroll-3": "events/vscroll3",
    "vtjcloak1": "other/&",
    "vtjcloak2": "other/&",
    "vtjcloak3": "other/&",
    "vtmaxe1": "events/&",
    "vtmaxe2": "events/&",
    "vtmaxe3": "events/&",
    "vtmsword1": "events/&",
    "vtmsword2": "events/&",
    "vtmsword3": "events/&",
    "wanderer_armor1": "events/&",
    "wanderer_armor2": "events/&",
    "wanderer_armor3": "events/&",
    "wanderer_hat1": "events/&",
    "wanderer_hat2": "events/&",
    "wanderer_hat3": "events/&",
    "warmor": "gifts/&",
    "warring13": "&",
    "warrior_pendant": "&",
    "warriorring": "&",
    "warthief_medal1": "medals/&",
    "warthief_medal2": "medals/&",
    "warthief_medal3": "medals/&",
    "warthief_medal4": "medals/&",
    "warthief_medal5": "medals/&",
    "wboots": "gifts/&",
    "welfarmor": "kwar/ew_armor",
    "welfboots": "kwar/ew_bootshields",
    "welfbow": "kwar/ew_bow",
    "welfhelmet": "kwar/ew_helmet",
    "welfshield": "kwar/ew_shield",
    "welfsword": "kwar/ew_sword",
    "whelmet": "gifts/&",
    "wind_armor": "&",
    "wind_boots": "&",
    "wind_helm": "&",
    "windsword": "event/&",
    "wiz_boots": "&",
    "wiz_cape": "&",
    "wiz_robe": "mage_robes",
    "wizard_cap": "magehat",
    "wolfjacket": "&",
    "wood_sword": "woodensword",
    "wshield": "&",
    "wwwring16": "&",
    "wzzamulet13": "&",
    "wzzamulet16": "&",
    "xymhelmet15": "&",
    "znak1": "events/znak0001",
    "znak2": "events/znak0002",
    "znak3": "events/znak0003",
    "znak4": "events/znak0004",
    "znak5": "events/znak0005",
    "znak6": "events/znak0006",
    "znak7": "events/znak0007",
    "znak8": "events/znak0008",
    "znak9": "events/znak0009",
    "znamya1": "events/&",
    "znamya2": "events/&",
    "zub": "&",
    "zxhelmet13": "&",
  };

  const allSetData = {
    hunt_set: {
      rus: "Охотника",
      arts: [
        "hunter_sword1",
        "hunter_shield1",
        "hunter_bow1",
        "hunter_hat1",
        "hunter_jacket1",
        "hunter_boots1",
        "hunter_gloves1",
        "hunter_pendant1",
      ]
    },
    mhunt_set: {
      rus: "Мастера-охотника",
      arts: [
        "hunterdsword",
        "huntersword2",
        "hunterdagger",
        "huntershield2",
        "hunter_arrows1",
        "hunter_bow2",
        "hunter_mask1",
        "hunter_helm",
        "hunter_roga1",
        "hunter_armor1",
        "hunter_boots2",
        "hunter_boots3",
        "hunter_ring1",
        "hunter_ring2",
        "hunter_amulet1",
      ]
    },
    ghunt_set: {
      rus: "Великого охотника",
      arts: [
        "gm_sword",
        "gm_kastet",
        "gm_defence",
        "gm_3arrows",
        "gm_abow",
        "gm_protect",
        "gm_hat",
        "gm_arm",
        "gm_spdb",
        "gm_sring",
        "gm_rring",
        "gm_amul",
      ]
    },
    bst_set: {
      rus: "Зверобоя",
      arts: [
        "sh_sword",
        "sh_spear",
        "sh_shield",
        "sh_4arrows",
        "sh_bow",
        "sh_cloak",
        "sh_helmet",
        "sh_armor",
        "sh_boots",
        "sh_ring1",
        "sh_ring2",
        "sh_amulet2",
      ]
    },
    forest_set: {
      rus: "Леса",
      arts: [
        "forest_blade",
        "forest_dagger",
        "shieldofforest",
        "forest_knives",
        "forest_bow",
        "forest_crossbow",
        "les_cl",
        "forest_helm",
        "forest_armor",
        "forest_boots",
        "forest_bolt",
        "neut_ring",
        "neut_amulet",
        "neut_leaf",
        "forest_edge",
      ]
    },
    vor: {
      rus: "Вора",
      arts: [
        "thief_ml_dagger",
        "thief_arb",
        "thief_cape",
        "thief_msk",
        "thief_goodarmor",
        "thief_fastboots",
        "ring_of_thief",
        "thief_neckl",
      ]
    },
    nal: {
      rus: "Налётчика",
      arts: [
        "tm_knife",
        "tm_arb",
        "tm_cape",
        "tm_msk",
        "tm_armor",
        "tm_boots",
        "tm_mring",
        "tm_wring",
        "tm_amulet",
      ]
    },
    rang: {
      rus: "Рейнджера",
      arts: [
        "r_bigsword",
        "r_dagger",
        "r_magy_staff",
        "r_goodscroll",
        "r_bow",
        "r_clck",
        "r_helmb",
        "r_zarmor",
        "r_bootsmb",
        "r_magicsring",
        "r_warring",
        "r_warriorsamulet",
        "r_m_amulet",
      ]
    },
    comm: {
      rus: "Тактика",
      arts: [
        "tactmag_staff",
        "tactaz_axe",
        "tactsm0_dagger",
        "tactdff_shield",
        "tact765_bow",
        "tactpow_cloack",
        "tacthapp_helmet",
        "tactcv1_armor",
        "tactzl4_boots",
        "tactspw_mring",
        "tactwww_wring",
        "tact1w1_wamulet",
        "tactms1_mamulet",
      ]
    },
    rec: {
      rus: "Вербовщика",
      arts: [
        "verb11_sword",
        "vrb_shild",
        "ve_helm",
        "v_1armor",
        "verbboots",
      ]
    },
    naemv: {
      rus: "Наёмника-воина",
      arts: [
        "merc_sword",
        "merc_dagger",
        "merc_armor",
        "merc_boots",
      ]
    },
    mil: {
      rus: "Рыцаря-воина",
      arts: [
        "knightsword",
        "knightshield",
        "knighthelmet",
        "knightarmor",
        "knightboots",
      ]
    },
    pal: {
      rus: "Паладина",
      arts: [
        "paladin_sword",
        "paladin_shield",
        "paladin_bow",
        "paladin_helmet",
        "paladin_armor",
        "paladin_boots",
      ]
    },
    necrn: {
      rus: "Некроманта-ученика",
      arts: [
        "necr_staff",
        "necr_helm",
        "necr_robe",
        "necr_amulet",
      ]
    },
    mags: {
      rus: "Мага-ученика",
      arts: [
        "mage_staff",
        "mage_scroll",
        "mage_cape",
        "mage_hat",
        "mage_robe",
        "mage_boots",
      ]
    },
    velm: {
      rus: "Великого мага",
      arts: [
        "gmage_staff",
        "gmage_scroll",
        "gmage_cloack",
        "gmage_crown",
        "gmage_armor",
        "gmage_boots",
      ]
    },
    elfs: {
      rus: "Эльфа-скаута",
      arts: [
        "elfbow",
        "elfshirt",
        "elfboots",
        "elfamulet",
      ]
    },
    elfv: {
      rus: "Эльфа-воина",
      arts: [
        "welfsword",
        "welfshield",
        "welfbow",
        "welfhelmet",
        "welfarmor",
        "welfboots",
      ]
    },
    drd: {
      rus: "Друида",
      arts: [
        "druid_staff",
        "druid_cloack",
        "druid_armor",
        "druid_boots",
        "druid_amulet",
      ]
    },
    varv: {
      rus: "Варвара-воина",
      arts: [
        "barb_club",
        "barb_shield",
        "barb_helm",
        "barb_armor",
        "barb_boots",
      ]
    },
    slugt: {
      rus: "Слуги тьмы",
      arts: [
        "darkelfstaff",
        "darkelfcloack",
        "darkelfkaska",
        "darkelfciras",
        "darkelfboots",
        "darkelfpendant",
      ]
    },
    dems: {
      rus: "Демона-воина",
      arts: [
        "dem_axe",
        "dem_shield",
        "dem_helmet",
        "dem_armor",
        "dem_bootshields",
        "dem_amulet",
      ]
    },
    gnomv: {
      rus: "Гнома-воина",
      arts: [
        "gnomehammer",
        "gnomeshield",
        "gnomehelmet",
        "gnomearmor",
        "gnomeboots",
      ]
    },
    gnomm: {
      rus: "Гнома-мастера",
      arts: [
        "gnomem_hammer",
        "gnomem_shield",
        "gnomem_helmet",
        "gnomem_armor",
        "gnomem_boots",
        "gnomem_amulet",
      ]
    },
    trib: {
      rus: "Степного варвара",
      arts: [
        "sv_weap",
        "sv_shield",
        "sv_arb",
        "sv_helm",
        "sv_body",
        "sv_boot",
      ]
    },
    utrib: {
      rus: "Непокорного варвара",
      arts: [
        "nv_weap",
        "nv_shield",
        "nv_helm",
        "nv_body",
        "nv_boot",
      ]
    },
    templ: {
      rus: "Рыцаря солнца",
      arts: [
        "kn_weap",
        "kn_shield",
        "kn_helm",
        "kn_body",
      ]
    },
    inq: {
      rus: "Инквизитора",
      arts: [
        "inq_weap",
        "inq_cl",
        "inq_helm",
        "inq_body",
        "inq_boot",
      ]
    },
    amph: {
      rus: "Амфибии",
      arts: [
        "amf_weap",
        "amf_scroll",
        "amf_cl",
        "amf_helm",
        "amf_body",
        "amf_boot",
      ]
    },
    surv: {
      rus: "Сурвилурга",
      arts: [
        "surv_sword_surv",
        "surv_axes",
        "surv_halberdzg",
        "surv_staffik",
        "surv_scrollcd",
        "surv_shieldvv",
        "surv_sword2sd",
        "surv_daggermd",
        "surv_crossbowsurv",
        "surv_cloacksrv",
        "surv_mcloacksv",
        "surv_helmetpi",
        "surv_mhelmetcv",
        "surv_armorsu",
        "surv_marmoroz",
        "surv_bootsurv",
        "surv_mbootsbb",
        "surv_wring1my",
        "surv_wring2o",
        "surv_mring1fd",
        "surv_mring2fpg",
        "surv_wamuletik",
        "surv_mamulka",
      ]
    },
    tm_set: {
      rus: "Времён",
      arts: [
        "staff_v1",
        "staff_v2",
        "staff_v3",
        "vtmaxe1",
        "vtmaxe2",
        "vtmaxe3",
        "vtmsword1",
        "vtmsword2",
        "vtmsword3",
        "vrdagger1",
        "vrdagger2",
        "vrdagger3",
        "tj-shield1",
        "tj-shield2",
        "tj-shield3",
        "vscroll-1",
        "vscroll-2",
        "vscroll-3",
        "vbow1",
        "vbow2",
        "vbow3",
        "mtcloak1",
        "mtcloak2",
        "mtcloak3",
        "vtjcloak1",
        "vtjcloak2",
        "vtjcloak3",
        "tj_helmet1",
        "tj_helmet2",
        "tj_helmet3",
        "mhelmv1",
        "mhelmv2",
        "mhelmv3",
        "tjarmor1",
        "tjarmor2",
        "tjarmor3",
        "tmarmor1",
        "tmarmor2",
        "tmarmor3",
        "tj_vboots1",
        "tj_vboots2",
        "tj_vboots3",
        "tj_mtuf1",
        "tj_mtuf2",
        "tj_mtuf3",
        "v-ring1",
        "v-ring2",
        "v-ring3",
        "vbolt1",
        "vbolt2",
        "vbolt3",
        "vmring1",
        "vmring2",
        "vmring3",
        "tjam1",
        "tjam2",
        "tjam3",
        "tj_magam1",
        "tj_magam2",
        "tj_magam3",
        "sph1",
        "sph2",
        "sph3",
      ]
    },
    mir_set: {
      rus: "Мироходца",
      arts: [
        "mh_sword1",
        "mh_sword2",
        "mh_sword3",
        "mir_bow1",
        "mir_bow2",
        "mir_bow3",
        "mir_shld1",
        "mir_shld2",
        "mir_shld3",
        "mir_cl1",
        "mir_cl2",
        "mir_cl3",
        "mir_helmt1",
        "mir_helmt2",
        "mir_helmt3",
        "mir_armor1",
        "mir_armor2",
        "mir_armor3",
        "mir_boots1",
        "mir_boots2",
        "mir_boots3",
        "mirh_ring1",
        "mirh_ring2",
        "mirh_ring3",
        "mir_am1",
        "mir_am2",
        "mir_am3",
      ]
    },
    pir_set: {
      rus: "Пирата",
      arts: [
        "p_sword1",
        "p_sword2",
        "p_sword3",
        "p_dag1",
        "p_dag2",
        "p_dag3",
        "p_pistol1",
        "p_pistol2",
        "p_pistol3",
        "p_cloak1",
        "p_cloak2",
        "p_cloak3",
        "piratehat1",
        "piratehat2",
        "piratehat3",
        "pir_armor1",
        "pir_armor2",
        "pir_armor3",
        "p_boots1",
        "p_boots2",
        "p_boots3",
        "piring1",
        "piring2",
        "piring3",
        "pn_ring1",
        "pn_ring2",
        "pn_ring3",
        "p_amulet1",
        "p_amulet2",
        "p_amulet3",
        "p_compas1",
        "p_compas2",
        "p_compas3",
      ]
    },
    leader_set: {
      rus: "Полководца",
      arts: [
        "polk_sword1",
        "polk_sword2",
        "polk_sword3",
        "polk__helm1",
        "polk__helm2",
        "polk__helm3",
        "polk_armor1",
        "polk_armor2",
        "polk_armor3",
        "polkboots1",
        "polkboots2",
        "polkboots3",
        "gring",
        "gringd",
      ]
    },
    undgr_set: {
      rus: "Подземелий",
      arts: [
        "dung_axe1",
        "dung_axe2",
        "dung_axe3",
        "dung_glefa1",
        "dung_glefa2",
        "dung_glefa3",
        "dun_sword1",
        "dun_sword2",
        "dun_sword3",
        "dun_dagger1",
        "dun_dagger2",
        "dun_dagger3",
        "dun_shield1",
        "dun_shield2",
        "dun_shield3",
        "dun_bow1",
        "dun_bow2",
        "dun_bow3",
        "dun_cloak1",
        "dun_cloak2",
        "dun_cloak3",
        "hm1",
        "hm2",
        "drak_crown1",
        "drak_crown2",
        "drak_crown3",
        "drak_armor1",
        "drak_armor2",
        "drak_armor3",
        "dun_armor1",
        "dun_armor2",
        "dun_armor3",
        "dun_boots1",
        "dun_boots2",
        "dun_boots3",
        "drak_greaves1",
        "drak_greaves2",
        "drak_greaves3",
        "dun_ring1",
        "dun_ring2",
        "dun_ring3",
        "dering",
        "dun_amul1",
        "dun_amul2",
        "dun_amul3",
        "dun_pendant1",
        "dun_pendant2",
        "dun_pendant3",
        "crystal",
      ]
    },
    razb_set: {
      rus: "Разбойника",
      arts: [
        "raxe1",
        "raxe2",
        "rsword1",
        "rsword2",
        "rdagger1",
        "rdagger2",
        "rshield1",
        "rshield2",
        "rbow1",
        "rbow2",
        "rcloak1",
        "rcloak2",
        "rhelm1",
        "rhelm2",
        "rarmor1",
        "rarmor2",
        "rboots1",
        "rboots2",
        "rogring1",
        "rogring2",
        "ramul1",
        "ramul2",
        "sumka",
      ]
    },
    ocean_set: {
      rus: "Океана",
      arts: [
        "ocean_sword1",
        "ocean_sword2",
        "ocean_sword3",
        "ocean_dgr1",
        "ocean_dgr2",
        "ocean_dgr3",
        "ocean_m_shield1",
        "ocean_m_shield2",
        "ocean_m_shield3",
        "ocean_bw1",
        "ocean_bw2",
        "ocean_bw3",
        "ocean_cl1",
        "ocean_cl2",
        "ocean_cl3",
        "ocean_hlm1",
        "ocean_hlm2",
        "ocean_hlm3",
        "m_armor1",
        "m_armor2",
        "m_armor3",
        "ocean_boots1",
        "ocean_boots2",
        "ocean_boots3",
        "ocean_per1",
        "ocean_per2",
        "ocean_per3",
        "ocean_ring1",
        "ocean_ring2",
        "ocean_ring3",
        "m_amul1",
        "m_amul2",
        "m_amul3",
        "ocean_eye1",
        "ocean_eye2",
        "ocean_eye3",
      ]
    },
    avan_set: {
      rus: "Авантюриста",
      arts: [
        "adv_saber1",
        "adv_saber2",
        "a_dagger1",
        "a_dagger2",
        "adv_shild1",
        "adv_shild2",
        "adv_longbow1",
        "adv_longbow2",
        "adv_clk1",
        "adv_clk2",
        "adv_hm1",
        "adv_hm2",
        "adv_armor1",
        "adv_armor2",
        "adv_boot1",
        "adv_boot2",
        "adv_fring1",
        "adv_fring2",
        "adv_neck1",
        "adv_neck2",
        "adv_sumk1",
        "adv_sumk2",
      ]
    },
    ed_set: {
      rus: "Единства",
      arts: [
        "ed_bsword1",
        "ed_bsword2",
        "ed_bsword3",
        "ed_mbook1",
        "ed_mbook2",
        "ed_mbook3",
        "ed_elfbow1",
        "ed_elfbow2",
        "ed_elfbow3",
        "ed_armr1",
        "ed_armr2",
        "ed_armr3",
        "ed_svboots1",
        "ed_svboots2",
        "ed_svboots3",
        "ed_ring1",
        "ed_ring2",
        "ed_ring3",
        "eddem_ring1",
        "eddem_ring2",
        "eddem_ring3",
        "ed_pendant1",
        "ed_pendant2",
        "ed_pendant3",
        "ed_barrel1",
        "ed_barrel2",
        "ed_barrel3",
      ]
    },
    stalker_set: {
      rus: "Ловчего",
      arts: [
        "stalker_dagger1",
        "stalker_dagger2",
        "stalker_dagger3",
        "stalker_backsword1",
        "stalker_backsword2",
        "stalker_backsword3",
        "stalker_shid1",
        "stalker_shid2",
        "stalker_shid3",
        "stalker_crsb1",
        "stalker_crsb2",
        "stalker_crsb3",
        "stalker_ark1",
        "stalker_ark2",
        "stalker_ark3",
        "stalker_cl1",
        "stalker_cl2",
        "stalker_hlm1",
        "stalker_hlm2",
        "stalker_hlm3",
        "stalker_armour1",
        "stalker_armour2",
        "stalker_armour3",
        "stalker_boot1",
        "stalker_boot2",
        "stalker_boot3",
        "stalker_iring1",
        "stalker_iring2",
        "stalker_iring3",
        "stalker_sring1",
        "stalker_sring2",
        "stalker_sring3",
        "stalker_aml1",
        "stalker_aml2",
        "stalker_aml3",
      ]
    },
    armada_set: {
      rus: "Армады",
      arts: [
        "arm_tesak1",
        "arm_tesak2",
        "arm_tesak3",
        "arm_handgun1",
        "arm_handgun2",
        "arm_handgun3",
        "arm_clk1",
        "arm_clk2",
        "arm_clk3",
        "arm_cap1",
        "arm_cap2",
        "arm_cap3",
        "arm_armor1",
        "arm_armor2",
        "arm_armor3",
        "arm_bts1",
        "arm_bts3",
        "arm_bts2",
        "arm_r1",
        "arm_r2",
        "arm_r3",
        "armad_aml1",
        "armad_aml2",
        "armad_aml3",
        "arm_sekstant1",
        "arm_sekstant2",
        "arm_sekstant3",
      ]
    },
    wanderer_set: {
      rus: "Странника",
      arts: [
        "wanderer_hat1",
        "wanderer_hat2",
        "wanderer_hat3",
        "wandr_cloack1",
        "wandr_cloack2",
        "wandr_cloack3",
        "wanderer_armor1",
        "wanderer_armor2",
        "wanderer_armor3",
        "wanderer_boot1",
        "wanderer_boot2",
        "wanderer_boot3",
      ]
    },
  };

  // ====================

  const DEV_ID = '5781303';
  const MODULE_NAME = 'HWM_auction_upd';
  const MODULE_VERSION = '2.1.7';
  const MY_ID = document.cookie.match(/pl_id=(\d+)/)[1];
  const AUC_PATH = location.pathname;

  const modules = (function(symbol) {
    return view[symbol] || (view[symbol] = {
      stack: new Map,
      has(key) { return this.stack.has(key); },
      delete(key) { return this.stack.delete(key); },
      get(key) { return this.stack.get(key); },
      add(key, version, exports) {
        if (this.stack.has(key)) return;
        this.stack.set(key, { version, exports });
      }
    });
  })(Symbol.for('__' + DEV_ID + '__'));

  // ==================== [[ UTILS ]]

  const $ = (selector, ctx = document) => ctx.querySelector(selector);
  const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];
  const attempt = (that, callback) => that ? callback(that) : null;
  const parseNum = (num) => `${num}`.replaceAll(',', '') >> 0;
  const formatNum = (num) => num.toLocaleString('en');
  const importNode = (node) => document.importNode(node, true);

  function fetch({ url, method = 'GET', type = 'document', body = null }) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.responseType = type;

      xhr.onload = () => {
        if (xhr.status === 200) return resolve(xhr.response);
        throwError(`Error with status ${xhr.status}`);
      };

      xhr.onerror = () => throwError(`HTTP error with status ${xhr.status}`);

      xhr.send(body);

      function throwError(msg) {
        const err = new Error(msg);
        err.status = xhr.status;
        reject(err);
      }
    });
  }

  fetch.get = (url) => fetch({ url });
  fetch.post = (url, data) => fetch({ url, method: 'POST', body: data });

  function parseNode(html, callback) {
    let elem = document.createElement('div');
    elem.innerHTML = html;
    elem = elem.firstElementChild.cloneNode(true);
    callback && callback.call(elem, elem);
    return elem;
  }

  function getAucURL(search) {
    return AUC_PATH + (search || '?cat=my') + '&sbn=1&sau=1&snew=0';
  }

  function getSearchParams(search) {
    const entries = [...new URLSearchParams(search)];
    return entries.length ? Object.fromEntries(entries) : { cat: 'my' };
  }

  function debounce(callback, delay) {
    let timerId = 0;

    return function(e) {
      clearTimeout(timerId);
      timerId = setTimeout(callback, delay, e);
    };
  }

  function throttle(callback, delay) {
    let isPending = false;

    return function(e) {
      if (isPending) return;

      isPending = true;

      setTimeout(() => {
        callback(e);
        isPending = false;
      }, delay);
    };
  }

  function addImageToArt({search, style}) {
    const path = 'https://dcdn.heroeswm.ru/i/artifacts/';
    let key = search.split('=').pop();

    if (key.startsWith('part_')) key = key.slice(5);

    const src = allArtsData[key];
    const id = !src ? '' : src === '&' ? key : src.replace('&', key);

    if (src) style.backgroundImage = `url("${path + id}.png")`;
  }

  // ==================== [[ USER DATA ]]

  const userDataKey = `${MODULE_NAME}__${MY_ID}`;
  const userData = Object.assign({
    playerName: '',
    sort: 'byCost',
    order: '1',
    extSearch: false,
    filters: { full: 1 },
    bets: {},
    faves: {},
    newArts: {},
    newSetArts: {},
    pullPrevState(oldKey, key) {
      const val = localStorage[oldKey];
      if (!(val && val.startsWith('{') && val.endsWith('}'))) return;
      delete localStorage[oldKey];
      Object.assign(this[key], JSON.parse(val));
    },
    update(key, value) {
      if (key && value !== undefined) this[key] = value;
      localStorage[userDataKey] = this.toString();
    },
    toString() {
      return JSON.stringify(this);
    }
  }, JSON.parse(localStorage[userDataKey] || '{}'));

  if (!userData.hasOwnProperty('v')) {
    userData.pullPrevState(`newAucBets_${MY_ID}`, 'bets');
    userData.pullPrevState(`newAucChosen_${MY_ID}`, 'faves');
    userData.pullPrevState('newAucArts', 'newArts');
    userData.pullPrevState('newAucSetArts', 'newSetArts');
  }

  const isOldVersion = userData.v === MODULE_VERSION;

  if (!isOldVersion) {
    userData.newArts = {};
    userData.newSetArts = {};
    userData.update('v', MODULE_VERSION);
  }

  // ==================== [[ CSS ]]

  const mainStyle = parseNode('<style></style>', function() {
    this.append(/*css*/`
      @charset "utf-8";

      /* COMMON */

        :root {
          font-size: 10px;
          -webkit-tap-highlight-color: transparent;
        }
        ::before,
        ::after {
          box-sizing: border-box;
        }
        * {
          font-family: inherit;
          font-size: inherit;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          height: 100vh;
          display: none;
          position: relative;
          margin: 0;
          background-image: linear-gradient(45deg, black, #353741);
          overflow: hidden !important;
        }
        body.root {
          display: block;
        }
        button {
          cursor: pointer;
        }
        img {
          max-width: 100%;
          vertical-align: middle;
          pointer-events: none;
        }
        a,
        button,
        input {
          color: inherit;
          border: none;
          outline: none;
          text-decoration: none;
        }
        a span {
          pointer-events: none;
        }

        @keyframes spin {
          to {
            transform: rotate(1turn);
          }
        }
        .ui-scroll {
          overflow-x: hidden;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #ccc #52525d;
        }
        .ui-scroll::-webkit-scrollbar {
          width: .5rem;
          background-color: #696969;
        }
        .ui-scroll::-webkit-scrollbar-thumb {
          min-height: 4rem;
          background-color: #aaa;
        }
        [href*="auction.php"]:hover {
          color: #cfbba0;
        }

      /* TOP */

        #auction {
          --active-link-fg: #ffe762;
          --active-link-bg: #b2c5422e;
          --player-link-fg: #59d4b6;
          font-family: Arial, sans-serif;
          font-size: 1.6rem;
          width: 100%;
          min-width: 90rem;
          height: inherit;
          min-height: 60rem;
          position: absolute;
          left: 0;
          top: 0;
          color: #eee;
          background-color: #494751;
          user-select: none;
        }
        #auction.__loading::after,
        #auction.__disconnected::after {
          content: "";
          position: absolute;
          left: 5rem;
          right: 0;
          top: 0;
          bottom: 0;
          background-color: #3c4a57;
          opacity: .3;
          z-index: 1;
        }
        #auction.__disconnected::after {
          opacity: .1;
          z-index: 4;
        }
        #auction__header {
          height: 5rem;
          line-height: 5rem;
          display: flex;
          align-items: center;
          column-gap: 1rem;
          position: relative;
          padding: 0 1.2rem;
          border-bottom: 1px solid #1a1a1a;
          z-index: 1;
        }
        .__unallowed > #auction__header {
          background-image: linear-gradient(45deg, #5e2c2c, transparent);
        }
        #online {
          --size: 2.5rem;
          --hue: 157deg;
          --color1: hsl(var(--hue), 80%, 80%);
          --color2: hsl(var(--hue), 100%, 55%);
          --color3: hsl(var(--hue), 100%, 40%);
          width: var(--size);
          height: var(--size);
          display: inline-block;
          position: relative;
          border-radius: 50%;
        }
        @keyframes blinkOnLine1 {
          0%, 20%, 50%, 70%, 100% { opacity: 1; }
          40%, 60% { opacity: .5; }
        }
        @keyframes blinkOnLine2 {
          to { filter: drop-shadow(0 0 6px red); }
        }
        .__disconnected #online {
          --hue: 345deg;
          animation:
            blinkOnLine1 1s ease-in-out 2,
            blinkOnLine2 1s 2s ease-in-out infinite alternate;
        }
        #online::after {
          content: "";
          position: absolute;
          left: .7rem;
          right: .7rem;
          top: .7rem;
          bottom: .7rem;
          background: radial-gradient(var(--color1) 30%, var(--color2));
          border-radius: inherit;
          filter: drop-shadow(0 0 3px var(--color3));
        }
        #refresh {
          font-size: 1.3em;
          letter-spacing: .5rem;
          text-transform: uppercase;
          filter: drop-shadow(2px 2px 2px black);
        }
        #refresh:hover {
          filter: sepia(1) drop-shadow(2px 2px 2px black);
        }

        @supports ((background-clip: text) or (-webkit-background-clip: text)) {
          @keyframes aucBgMove {
            to { background-position-x: -150%; }
          }
          #refresh {
            color: transparent;
            background-image: linear-gradient(45deg, #00bfff, #64cccc, #8ed8ab, #f5e275, #8ed8ab, #64cccc, #00bfff);
            background-size: 300%;
            background-clip: text;
            -webkit-background-clip: text;
            animation: aucBgMove 4s ease-in-out infinite;
          }
        }

        #author {
          color: #aaa;
        }
        #author:hover {
          color: tan;
        }
        #author::before {
          content: "© ";
          color: #aaa;
        }

      /* RESOURCES */

        #resources {
          flex: 1;
          display: inline-flex;
          justify-content: flex-end;
          column-gap: 1.4rem;
        }
        .resources__item::after {
          content: attr(data-value);
        }
        .resources__item:first-child::after {
          color: gold;
        }
        .resources__item > a {
          color: inherit;
          background-color: transparent;
        }

      /* MENU */

        #auction__container {
          --container-height: calc(100% - 5rem);
          height: var(--container-height);
          display: flex;
        }
        #aside_1 {
          width: 5rem;
          min-width: 5rem;
          height: 100%;
          position: relative;
          color: #ddd;
        }
        .menu:hover {
          background-color: #2d2c33;
          outline: 1px solid #666;
        }
        .menu:focus-within {
          background-color: #2d2c33;
          outline: 1px solid #666;
        }
        .menu__link {
          display: block;
          padding: .5rem 0;
        }
        .menu__icon {
          filter: saturate(.5);
        }
        .menu:hover .menu__icon {
          filter: saturate(1);
        }
        .menu__list {
          width: 26.8rem;
          height: var(--container-height);
          display: none;
          position: absolute;
          left: 100%;
          top: 0;
          margin-left: 1px;
          background-color: inherit;
          z-index: 1;
        }
        .menu:hover .menu__list {
          display: block;
        }
        .__disconnected .menu__list {
          z-index: 5;
        }
        .menu__list::before {
          content: "# " attr(data-name);
          display: block;
          padding: 1rem;
          text-transform: uppercase;
          color: tan;
          border-bottom: 1px solid #444;
        }
        .menu__list::after {
          content: "";
          width: 2px;
          position: absolute;
          left: -1px;
          top: 0;
          bottom: 0;
        }
        a.menu__item {
          display: block;
          position: relative;
          padding: .8rem 1.2rem;
          color: inherit;
          background-color: inherit;
          border-bottom: 1px solid #444;
          overflow: hidden;
        }
        .menu__item:hover,
        .menu__item:focus {
          color: #cfbba0;
          background-color: #383740;
        }
        .menu__item::after {
          content: "";
          font-size: 2.5em;
          width: 4em;
          height: 4em;
          position: absolute;
          left: -2em;
          top: -2em;
          background-image: radial-gradient(50% 50%, white, transparent);
          opacity: 0;
          transform: translate(var(--x, 0), var(--y, 0));
          transition: opacity .2s;
          pointer-events: none;
        }
        .menu__item:hover::after {
          opacity: .15;
        }

      /* PLAYER */

        #aside_2 {
          width: 27rem;
          min-width: 27rem;
          height: 100%;
          position: relative;
          background-color: #2d2c33;
          border-left: 1px solid #555;
          border-right: 1px solid #444;
          overflow: hidden;
        }
        #player {
          height: 7rem;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          justify-content: space-evenly;
          padding-left: 1rem;
        }
        #player__name {
          color: tan;
        }
        #player__name:hover {
          filter: saturate(1.2) brightness(1.2);
        }
        .gold {
          vertical-align: middle;
        }
        #player__gold {
          font-size: 1.2em;
          color: gold;
        }
        .coin {
          font-size: 1.2rem;
          width: 1.5em;
          line-height: 1.5em;
          display: inline-block;
          vertical-align: middle;
          margin-left: .5em;
          text-align: center;
          color: #927008;
          background-color: #ffcc33;
          border-radius: 50%;
          box-shadow: inset 0 0 0 .2em #c79600;
        }
        #coin {
          font-size: 1.8rem;
          position: relative;
          margin-left: 0;
          margin-right: .25em;
          background-image: linear-gradient(145deg, #ffc001, #ffd900, #cc9900);
        }
        #coin::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: .1em;
          border: .1em solid #917317;
          border-radius: inherit;
        }

      /* CATEGORIES */

        #categories {
          height: calc(100% - 12rem);
          display: flex;
          flex-direction: column;
          color: #aaa;
          background-color: #313038;
          border-top: 1px solid #444;
        }
        .category.__active {
          color: #eee;
          background-color: #2b3a4c75;
        }
        .category.__active,
        .category__heading {
          border-bottom: 1px solid #444;
        }
        .category__heading {
          --selected-bg: #38424f;
          height: 3.4rem;
          line-height: 3.4rem;
          font-weight: normal;
          position: relative;
          top: 0;
          padding: 0 2.4rem 0 1rem;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .category__heading:hover {
          background-color: #33405175;
        }
        .category.__active .category__heading {
          position: sticky;
          background-color: #3c4754;
        }
        .category__heading::after {
          content: "▼";
          font-size: .6em;
          position: absolute;
          top: 0;
          right: 0.7rem;
          opacity: .7;
        }
        .category.__active .category__heading::after {
          content: "▲";
        }
        .category__items {
          --count: 0;
          font-size: .9em;
          height: calc(2.8rem * var(--count));
          transition: height .4s;
          transition-duration: max(.4s, var(--count) * .015s);
          overflow: hidden;
        }
        .category__item {
          height: 2.8rem;
          line-height: 2.7rem;
          display: block;
          padding: 0 1rem;
          color: #a0b1bb;
          border-top: 1px solid #495055;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .category__item[style] {
          text-indent: 2.5rem;
          background-repeat: no-repeat;
          background-position: 1rem 50%;
          background-size: 1.6rem;
        }
        .category__item:first-child {
          border-top: none;
        }
        .category__item:hover,
        .category__item:focus {
          background-color: #3f4b5a75;
        }
        .category__item:not([style])::before {
          content: "•";
          float: left;
          margin-right: .8rem;
          text-indent: 0;
          color: #aaa;
        }
        .category__all {
          font-size: .8em;
          min-width: 3.6rem;
          float: right;
          text-align: center;
          color: #d1bfa8;
          pointer-events: auto;
        }
        .category__all:hover,
        .category__all:focus {
          color: #94d4da;
        }
        #cat-my .category__heading {
          pointer-events: none;
        }
        #cat-my .category__heading::after {
          display: none;
        }
        #new-lot {
          height: 5rem;
          line-height: 5rem;
          text-align: center;
          color: #aaa;
          border-top: 1px solid #444;
        }
        #new-lot > a {
          color: #d1bfa8;
        }
        #new-lot > a:is(:hover, :focus) {
          text-decoration: underline;
        }

      /* TOP STUFF */

        #main {
          flex: 1;
          width: calc(100% - 32rem);
          min-width: 86rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          background-color: #201f24;
          counter-reset: lot;
        }
        .main__top {
          height: 5rem;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: .7rem;
        }
        .main__top:first-child {
          background-color: #2b2b33;
          border-bottom: 1px solid #444;
        }
        .a-box {
          width: 20rem;
          height: 100%;
          position: relative;
          margin-right: 1rem;
          background-color: #3a404e;
          box-shadow: 0 0 3px #000;
        }
        .a-box:last-child {
          margin-right: 0;
          margin-left: auto;
        }
        .__unallowed .a-box {
          color: gray;
          filter: grayscale(.7);
          pointer-events: none;
        }
        .a-box::after {
          content: "";
          height: 4px;
          position: absolute;
          left: 0;
          right: 0;
          top: 100%;
        }
        .a-btn {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          column-gap: .5em;
          background-color: transparent;
        }
        .a-btn:focus {
          outline: 2px solid #57d6cf5b;
          outline-offset: -3px;
        }
        .a-btn::before {
          width: 1.6rem;
          height: 1.6rem;
          background: center / contain;
          filter: sepia(1) brightness(2);
        }
        #artlist-btn::before {
          content: "";
          background-image: url("https://dcdn.heroeswm.ru/i/help/help_ico11.png");
        }
        #setlist-btn::before {
          content: "";
          background-image: url("https://dcdn.heroeswm.ru/i/help/help_ico40.png");
        }
        #faves-btn::before {
          content: "";
          background-image: url("https://dcdn.heroeswm.ru/i/pl_info/services/icon_Clans.png");
        }
        #artlist-eye {
          font-size: 1.4em;
          line-height: 1;
          color: gray;
        }
        #artlist-eye:hover {
          color: #b8b3ac;
        }
        #artlist-eye.__switched-on {
          color: #a2c5cd;
        }

      /* ART LIST */

        @keyframes listFadeIn {
          from { filter: opacity(0); transform: translateY(0); }
          to { filter: opacity(1); transform: translateY(4px); }
        }
        @keyframes listVisibility {
          from { visibility: hidden; }
          to { visibility: visible; }
        }
        .a-list {
          min-width: 100%;
          max-width: 28rem;
          max-height: 36rem;
          line-height: 2;
          display: none;
          position: absolute;
          left: 0;
          top: 100%;
          background-color: #41414b;
          border: 1px solid #555;
          box-shadow: 2px 2px 4px #161616;
          transform: translateY(4px);
          z-index: 3;
        }
        .a-box:hover .a-list,
        :focus + .a-list {
          display: block;
          animation: listVisibility .15s steps(1), listFadeIn .25s .15s backwards;
        }
        .a-list:focus-within {
          display: block;
          animation: listVisibility .15s steps(1), listFadeIn .25s .15s backwards;
        }
        .a-box:hover .a-list {
          z-index: 4;
        }
        .a-list:empty {
          display: none !important;
        }
        .a-list::before,
        .a-list::after {
          content: "";
          height: 1.4rem;
          display: block;
          position: sticky;
          top: -1px;
          background: linear-gradient(#41414b 30%, transparent);
          pointer-events: none;
          z-index: 1;
        }
        .a-list::after {
          top: auto;
          bottom: -1px;
          transform: scaleY(-1);
        }
        .a-list__item {
          display: block;
          padding: 0 1rem;
          color: #bbb;
          border-bottom: 1px solid #555;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .a-list__item:first-child {
          border-top: 1px solid #555;
        }
        .a-link[style] {
          text-indent: 3.4rem;
          background-repeat: no-repeat;
          background-position: 1rem 50%;
          background-size: 2.5rem;
        }
        .a-list__item:hover,
        .a-list__item:focus {
          background-color: #36363f;
        }
        .a-box .__left {
          width: calc(100% - 4rem);
          float: left;
        }

      /* SET LIST */

        .setlist__set {
          border-top: 1px solid #555;
        }
        .setlist__set:last-child {
          border-bottom: 1px solid #555;
        }
        .setlist__set-name {
          font-weight: inherit;
          padding: 0 3rem 0 1rem;
          background-color: #3c3c45;
          white-space: nowrap;
        }
        .setlist__set-name:hover {
          filter: saturate(1.2) brightness(1.2);
        }
        .setlist__set-name::before {
          content: "@ сет";
          margin-right: .5em;
          color: #c9bba8;
        }
        .setlist__set-name::after {
          content: "+";
          position: absolute;
          right: 1rem;
          color: #aaa;
        }
        .setlist__set.__active .setlist__set-name::after {
          content: "-";
        }
        .setlist__arts {
          display: none;
          text-indent: 1rem;
        }
        .setlist__set.__active .setlist__arts {
          display: block;
        }
        .setlist__arts:empty::before {
          content: "Нет на рынке";
          display: block;
          padding-left: 1rem;
          color: #f0b1b1;
          border-top: 1px solid #555;
        }
        .setlist__arts :last-child {
          border-bottom: none;
        }

      /* SEARCH */

        #search-box {
          width: 26rem;
          box-shadow: none;
        }
        .a-input {
          height: 100%;
          padding: 0 3rem 0 .6rem;
          color: lightblue;
          background-color: #1a1a1a;
          box-shadow: inset -1px -1px 1px #555;
          user-select: auto;
        }
        .a-input:focus {
          box-shadow: inset 0 0 2px #57d6cf;
        }
        .action {
          width: 4rem;
          height: 100%;
          float: right;
          color: #bbb;
          background-color: #344259;
          outline: 2px solid #646363;
          outline-offset: -3px;
        }
        .action:hover {
          background-color: #3f4e67;
        }
        .action:active {
          transform: scale(.9);
        }
        .action.__active {
          color: #83add4;
          outline-color: #57d6cf5b;
        }
        #ext-search {
          font-size: .8em;
        }
        #search-reset {
          font-size: 1.6em;
          width: 3rem;
          line-height: 3.4rem;
          position: absolute;
          right: 4rem; top: 0;
          color: #bbb;
          text-align: center;
          visibility: hidden;
          cursor: pointer;
        }
        #search-reset:hover {
          color: inherit;
        }
        #search-reset.__shown {
          visibility: visible;
        }
        #select-link {
          position: relative;
          color: #d3ad7b;
          background-color: #31313c;
          z-index: 2;
        }

      /* FAVES */

        #faves-btn.__none {
          background-color: #666;
          text-decoration: line-through;
          pointer-events: none;
          opacity: .5;
        }
        #faves {
          left: auto;
          right: 0;
        }
        .fave-item {
          position: relative;
          padding-right: calc(2rem + 1em);
        }
        [data-fave-action="remove"] {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          text-indent: 0;
          padding: 0 1rem;
          color: #eee;
          visibility: hidden;
          cursor: pointer;
          pointer-events: auto;
        }
        [data-fave-action="remove"]:hover {
          color: #fa9696;
        }
        .fave-item:hover > [data-fave-action="remove"] {
          visibility: visible;
        }
        #faves-input-box {
          width: 26rem;
          height: 100%;
          display: none;
          position: absolute;
          right: calc(100% + 1rem);
          top: 0;
        }
        .__active ~ #faves-input-box {
          display: block;
        }

      /* FILTERS */

        #filters-icon {
          fill: wheat;
        }
        #filters-box.__disabled,
        #filters-box.__disabled #filters-icon {
          color: gray;
          filter: grayscale(.7);
          pointer-events: none;
        }
        #filters-counter {
          position: absolute;
          left: calc(100% + 1rem); top: 1rem;
          color: #aaa;
          pointer-events: none;
        }
        #filters {
          min-width: 24rem;
          white-space: nowrap;
        }
        .filters__group {
          display: flex;
          border-bottom: 1px solid #5a5a5a;
        }
        .filters__group:first-child {
          border-top: 1px solid #5a5a5a;
        }
        .filters__item {
          width: 50%;
          padding: 0 1rem;
          color: #bbb;
        }
        .filters__item:hover {
          background-color: #36363f;
        }
        .filters__item:first-child {
          border-right: 1px solid #5a5a5a;
        }
        .filters__item.__active {
          color: #cfbba0;
          background-color: #424b5d;
        }
        .__partial .filters__group:nth-child(n+2) .filters__item {
          color: #6e6e6e;
          background-color: transparent;
          pointer-events: none;
        }

      /* SORTS */

        #sorts {
          height: 4rem;
          display: flex;
          padding-right: .5rem;
          color: #aaa;
          background-color: #2e2d36;
          border: 1px solid #41434a;
          border-width: 1px 0;
          overflow: hidden;
        }
        .a-td {
          width: calc(100% - 32rem);
          min-width: 10rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
          text-align: center;
          padding: 0 .5rem;
          border-right: 1px solid #41434a;
          overflow: hidden;
        }
        .a-td:last-child {
          border-right: none;
        }
        ._name {
          min-width: 32rem;
          padding-left: 0;
        }
        ._name,
        .sorts__item {
          flex-direction: row;
          justify-content: center;
        }
        .sorts__item:hover {
          color: #81b0d8;
          cursor: pointer;
        }
        .sorts__item[data-order]::after {
          content: "▲";
          font-size: .7em;
          width: 0;
          display: inline-block;
          position: relative;
          left: .8rem;
          color: #aaa;
        }
        .sorts__item[data-order="0"]::after {
          content: "▼";
        }

      /* LOT */

        @keyframes lotLoading {
          0% { content: ""; }
          25% { content: "."; }
          50% { content: ".."; }
          75% { content: "..."; }
        }
        .lot__processing {
          font-family: Consolas, monospace;
          font-size: 1.2em;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          color: #eee;
          background-color: #333a;
          z-index: 1;
        }
        .lot__loading::after {
          content: "";
          width: 0;
          display: inline-block;
          animation: lotLoading .5s steps(1) infinite;
        }
        #lots-container {
          flex: 1;
          position: relative;
        }
        #lots-container::before {
          content: "Лотов не найдено, мяу ^_^";
          line-height: 2;
          position: absolute;
          left: 0; right: 0;
          padding: 1em;
          text-align: center;
          color: #bbb;
          border-bottom: 1px solid #333;
        }
        .__unallowed #lots-container::before {
          content: "Рынок не доступен!";
          color: #d85c5c;
        }
        #lots {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          position: relative;
          background-color: #201f24;
          border-bottom: 1px solid #3c3e46;
          overflow: hidden;
        }
        #lots[data-order="0"] {
          flex-direction: column-reverse;
        }
        .lot {
          --lot-bg: inherit;
          --lot-2n-bg: #22242c;
          counter-increment: lot;
          font-size: .9em;
          height: 8.5rem;
          display: flex;
          justify-content: space-between;
          position: relative;
          color: #ddd;
          background-color: var(--lot-bg);
          border-top: 1px solid #3c3e46;
          overflow: hidden;
        }
        .lot[data-cat="obj_share"] {
          height: 11rem;
        }
        .lot:nth-child(even) {
          background-color: var(--lot-2n-bg);
        }
        .lot:hover,
        .lot.__hovered {
          background-image: linear-gradient(to right, #3a2727cc, transparent);
        }
        .lot[data-params*="mybet=1"] {
          --lot-bg: #34504d3d;
          --lot-2n-bg: #34504559;
        }
        .lot[data-params*="completed=1"] {
          color: #aaa;
          background-color: #3339;
          filter: grayscale(1) opacity(.8);
          pointer-events: none;
        }
        .lot[data-params*="mylot=1"] {
          --lot-bg: #2c3b5ab2;
          --lot-2n-bg: #28364eb2;
        }
        .lot[data-params*="mylot=1"][data-params*="once=0"] {
          filter: grayscale(.35);
        }
        .lot.__active {
          background-image: linear-gradient(to right, #33485fcc, transparent);
          outline: 1px solid #4e8fb8;
          z-index: 1;
        }
        .lot .a-td {
          pointer-events: none;
        }
        .lot a {
          pointer-events: auto;
        }
        .lot__box {
          min-width: 8.4rem;
          height: 100%;
          display: block;
          position: relative;
          color: inherit !important;
          background-color: transparent !important;
        }
        .lot__img {
          width: 5rem;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
        }
        .lot__amount {
          position: absolute;
          right: 2px;
          bottom: 2px;
        }
        .lot__info {
          width: calc(100% - 7rem);
          height: 100%;
          padding: 0 .8rem;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: flex-start;
          text-align: left;
          overflow: hidden;
        }
        .lot__id {
          color: #aaa;
        }
        .lot__id::before {
          content: "#";
          color: #c9bba8;
        }
        .lot__name {
          max-width: 100%;
          color: #dda94a;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .lot__durability {
          letter-spacing: 1px;
        }
        .lot__durability::before {
          content: "Прочность: ";
          letter-spacing: normal;
          color: #ccc;
        }
        [data-cat="part"] .lot__durability::before {
          content: "Частей: ";
        }
        .mods-scope {
          color: #ccc;
        }
        .mods-scope::before {
          content: "Крафт: [ ";
        }
        .mods-scope::after {
          content: " ]";
        }
        .art-mods {
          width: .6rem;
          display: flex;
          flex-direction: column;
          row-gap: .4rem;
          position: absolute;
          left: .5rem;
          top: 1rem;
        }
        .a-td._type {
          position: relative;
        }
        .lot__bet-type {
          color: tan;
        }
        .mybet::before {
          content: "Ваша ставка: ";
          color: tan;
        }
        .i-watch {
          font-size: 1.2em;
          line-height: 1;
          position: absolute;
          left: .5rem;
          top: .3rem;
          color: #a5a5a5;
          text-shadow: 0 0 2px black;
          cursor: help;
          pointer-events: auto;
        }

      /* LOT TIMERS */

        @keyframes timerTicking {
          to { opacity: .65; }
        }
        .lot[style*="--timer"] .lot__time {
          display: none;
        }
        .lot[style*="--timer"] > ._time::after {
          content: var(--timer);
          color: orange;
        }
        .lot[style*="00:"] > ._time::after {
          color: lightcoral;
          animation: timerTicking .5s ease-in-out infinite alternate;
        }
        .lot[style*="00:00"] > ._time::after {
          content: "00:00";
          animation: none;
        }

      /* FORM */

        @keyframes formSending {
          to { background-position-x: -150%; }
        }
        #form {
          background-color: #262b39;
        }
        #form > header {
          height: 5rem;
          line-height: 5rem;
          padding: 0 1em;
          border-top: 1px solid #545e73;
        }
        #form > header::after {
          content: counter(lot);
          margin-left: .4em;
          color: tan;
        }
        #form__lot {
          background: transparent;
          border: 0 solid #4f5058;
          border-width: 1px 0;
        }
        #form > footer {
          height: 5rem;
          padding-left: 1em;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        #form.__minimized > :not(header) {
          display: none;
        }
        #form__input {
          width: 6em;
          padding: 4px;
          margin-left: .5rem;
          color: #ccbeac;
          background-color: #222;
          border: 1px solid #545454;
          outline: 1px solid transparent;
        }
        #form__input:invalid {
          border-color: tomato;
        }
        #form__submit {
          --bg: #3b6369;
          min-width: 14rem;
          position: relative;
          padding: 4px;
          margin-left: 1rem;
          background-color: var(--bg);
          background-image: linear-gradient(var(--bg), #3a404e);
          border: 1px solid gray;
        }
        #form__submit:hover,
        #form__submit:focus {
          --bg: #5a768e;
        }
        #form__submit:active {
          transform: scale(.95);
        }
        #form__submit > span {
          position: relative;
          text-shadow: 0 0 2px black;
          z-index: 1;
        }
        #form__submit.__sending::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background-image: linear-gradient(120deg, transparent 20%, #fff 50%, transparent 80%);
          background-size: 150% 100%;
          background-position: 150% 0;
          opacity: .7;
          animation: formSending .7s linear infinite;
        }
        #form :disabled {
          color: #aaa;
          background: #666;
          pointer-events: none;
        }

      /* ALERT */

        @keyframes userAlertProcessing {
          to { width: 100%; }
        }
        @keyframes userAlertStart {
          from { filter: opacity(0); }
          to { filter: opacity(1); }
        }
        #notices {
          display: flex;
          flex-direction: column;
          row-gap: .5rem;
          position: absolute;
          left: 1rem;
          bottom: 6rem;
          z-index: 5;
        }
        .user-alert {
          --h: 200;
          --s: 64%;
          font-size: .875em;
          width: 26em;
          line-height: 1.3;
          position: relative;
          color: hsl(var(--h), var(--s), 42%);
          background: linear-gradient(45deg, #222, #444);
          border: 2px solid currentColor;
          outline: 1px solid black;
          animation: userAlertStart .35s;
        }
        .user-alert.__warn {
          --h: 45;
        }
        .user-alert.__error {
          --h: 0;
        }
        .user-alert.__success {
          --h: 150;
        }
        .user-alert::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background-color: currentColor;
          opacity: 0.125;
        }
        .user-alert:hover::before,
        .user-alert:focus::before {
          opacity: 0.25;
        }
        .user-alert:focus-within::before {
          opacity: 0.25;
        }
        .user-alert__body {
          position: relative;
          padding: 0.8em;
          padding-right: 1.8em;
          margin-bottom: 2px;
          color: hsl(var(--h), var(--s), 90%);
          text-shadow: 0 0 2px black;
          white-space: pre-line;
        }
        .user-alert__close {
          font-size: 1.5em;
          width: 1.2em;
          height: 1.2em;
          position: absolute;
          right: 1px;
          top: 1px;
          color: #bbb;
          background: transparent;
          border: none;
          outline: none;
          text-shadow: 0 0 2px black, 0 0 2px black;
          z-index: 2;
        }
        .user-alert__close:hover {
          color: white;
        }
        .user-alert__close:focus {
          color: #ff7474;
        }
        .user-alert.__finite::after {
          content: "";
          width: 0;
          height: 2px;
          position: absolute;
          left: 0;
          bottom: 0;
          background-color: darkseagreen;
          animation: userAlertProcessing 5s linear 1s;
        }
        .user-alert.__finite:hover::after,
        .user-alert.__finite:focus::after {
          animation-play-state: paused;
        }
        .user-alert.__finite:focus-within::after {
          animation-play-state: paused;
        }

      /* ART INFO */

        #art-info {
          font-size: 1.4rem;
          line-height: 1.3;
          min-width: 70rem;
          max-width: 82rem;
          display: flex;
          position: absolute;
          left: var(--x);
          top: var(--y);
          color: #ddd;
          background-color: #262a39;
          background-image: linear-gradient(45deg, #202140, #2d4956);
          border: 2px solid #325e7d;
          box-shadow: 0 0 4px 2px #111;
          opacity: 0;
          visibility: hidden;
          transition: opacity .1s, visibility .1s;
          z-index: 4;
        }
        #art-info:hover,
        #art-info.__shown {
          opacity: 1;
          visibility: visible;
        }
        #art-info:hover::before,
        #art-info.__shown::before {
          content: "";
          width: 11rem;
          position: absolute;
          left: -1.4rem;
          top: -5rem;
          bottom: -5rem;
          z-index: -1;
        }
        .global_container_block_header {
          position: absolute;
          right: 2rem;
          top: 2rem;
          text-transform: uppercase;
          filter: saturate(3);
        }
        .art_info_left_block {
          padding: 2rem 1rem 2rem 2rem;
        }
        .s_art_prop_amount_icon {
          min-height: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 2px;
          color: #eee;
          background-color: #3b4b69;
          background-image: linear-gradient(#5f8d84, #2c4168);
          border: 1px solid #78878d;
        }
        .s_art_prop_amount_icon:hover {
          filter: saturate(1.5);
        }
        .s_art_prop_amount_icon:active {
          transform: scale(.95);
        }
        .s_art_prop_amount_icon img {
          width: 2rem;
          margin-right: .5rem;
        }
        #art-info .cre_mon_image1 {
          display: none;
        }
        .art_info_desc {
          padding: 2rem;
          background: transparent !important;
        }
        #art-info .rs {
          margin: 0 2px;
        }
        #art-info font {
          color: inherit;
        }
        #art-info td {
          color: #ddd;
        }
        #art-info b {
          color: #bfb3a2;
        }
        #art-info i {
          color: #9fbec8;
        }
        #art-info [href*="section=40"] {
          color: #70b27d;
          text-decoration: underline;
        }
        .s_art_inside > br:last-child {
          display: none;
        }

      /* HOUSE STUFF */

        @font-face {
          font-family: "Material Icons";
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url("https://fonts.gstatic.com/s/materialicons/v98/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2") format("woff2");
        }
        .m-icon {
          font-family: "Material Icons", Arial, sans-serif;
          font-size: 2rem;
          line-height: 1;
          display: inline-block;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }
        [data-cat="dom"] .lot__info {
          position: relative;
        }
        .obj-id {
          filter: saturate(.5) brightness(1.1);
        }
        .place {
          color: #98bebb;
        }
        .house__stars {
          position: absolute;
          right: .5rem; top: 1rem;
        }
        .house__star {
          font-size: 1.4rem;
          color: #e6d78a;
        }

      /* LOADER */

        #loader {
          width: 5rem;
          height: 5rem;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          color: skyblue;
          border-radius: 50%;
          box-shadow: inset -2px -2px 2px;
          visibility: hidden;
          filter: opacity(0);
          transition: filter .3s .1s, visibility .3s .1s;
          animation: spin 1s linear infinite;
          z-index: 2;
        }
        .__loading > #loader {
          visibility: visible;
          filter: opacity(1);
          transition-delay: 0s;
          will-change: filter;
        }

      /* BETS */

        #mybets-btn.__active {
          background-color: #344342;
        }
        #mybets-btn[data-counter="0"]:not(.__active) {
          color: gray;
          background-color: #3e4044;
          pointer-events: none;
        }
        #mybets-btn[data-counter]::after {
          content: "( " attr(data-counter) " )";
          color: #aaa;
        }

      /* CONTEXTMENU */

        .contextmenu-is-shown::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          z-index: 1;
        }
        #contextmenu {
          font-size: .9em;
          width: 40rem;
          position: absolute;
          left: var(--x);
          top: var(--y);
          padding: .5rem 0;
          color: #ccc;
          background-color: #2f2f2f;
          border: 1px solid #555;
          outline: none;
          box-shadow: 2px 2px 2px rgba(0, 0, 0, .5);
          z-index: 2;
        }
        #contextmenu:empty {
          display: none;
        }
        .contextmenu__item {
          line-height: 2;
          padding: 0 1rem;
        }
        .contextmenu__item.__active {
          background-color: #444;
        }
        .contextmenu__item::before {
          content: attr(data-key);
          float: right;
          margin-left: 1rem;
          opacity: .7;
        }
        .contextmenu__item:last-child {
          margin-top: 1rem;
          position: relative;
        }
        .contextmenu__item:last-child::after {
          content: "";
          height: 1px;
          position: absolute;
          left: 0;
          right: 0;
          top: -.6rem;
          background-color: #444;
          pointer-events: none;
        }

      /* CHANGELOG */

        .user-alert.__changelog {
          width: 46em;
        }
        #changelog {
          max-height: 33em;
          padding-right: 1em;
          white-space: normal;
        }
        #changelog::before {
          content: "Changelog";
          font-size: 1.5em;
          font-weight: bold;
          display: block;
          color: #c3b39e;
        }
        .cl-build {
          font-size: 1.2em;
          font-weight: bold;
          margin: 0.5em 0;
          color: #ccc;
        }
        .changelog-item::before {
          content: "•";
          margin-right: 0.3em;
          color: #ccc;
        }
        kbd {
          font-family: Consolas, monospace;
          padding: 0 0.4em;
          color: #000;
          background-color: #909090;
          border: 1px solid;
          border-radius: 2px;
          text-shadow: none;
        }

      /* ============== */

        [href^="/pl_info"] {
          color: lightblue;
        }
        .c-set {
          color: #78ac78;
        }
        .lot a:hover,
        .lot a:focus {
          color: #db8779;
        }
        .__disconnected a[href^="/auction."] {
          color: gray;
          pointer-events: none;
        }

      @media screen and (max-width: 1320px) {
        #aside_2 {
          width: 0;
          min-width: auto;
        }
        #aside_2:hover,
        #aside_1:hover + #aside_2 {
          width: 27rem;
          min-width: 27rem;
        }
      }

      @media screen and (max-width: 960px), screen and (max-height: 600px) {
        :root {
          font-size: 9px;
        }
      }

      @media screen and (max-width: 820px), screen and (max-height: 540px) {
        :root {
          font-size: 8px;
        }
      }
    `);
  });

  const extraStyle = document.createElement('style');

  extraStyle.__replace = function(ind, search, replacement) {
    const node = this.childNodes[ind];
    node.data = node.data.replace(search, replacement);
  };

  extraStyle.append(/*css*/`
    #cat-CAT > h4 {
      background-color: var(--selected-bg);
    }
    [href$="type=TYPE"] {
      color: var(--active-link-fg);
      background-color: var(--active-link-bg);
    }
  `);

  extraStyle.append(/*css*/`
    [href="/pl_info.php?id=${MY_ID}"],
    [href="/pl_info.php?nick=${userData.playerName || 'NAME'}"] {
      color: var(--player-link-fg);
    }
  `);

  document.head.replaceChildren(
    parseNode('<title>Рынок</title>'),
    mainStyle,
    extraStyle,
  );

  // ==================== [[ RENDER ]]

  const aucElem = parseNode(/*html*/`
    <main id="auction">
      ${renderHeader()}

      <div id="auction__container">
        <aside id="aside_1">${renderNav()}</aside>

        <aside id="aside_2">
          ${renderPlayer(userData.playerName)}
          <nav id="categories" class="ui-scroll"></nav>
          <footer id="new-lot">
            <a href="/auction_new_lot.php">Выставить лот</a>
          </footer>
        </aside>

        <section id="main">
          <div class="main__top">
            <div class="a-box">
              <button id="artlist-btn" class="a-btn">
                Все артефакты
                <span id="artlist-eye">👁</span>
              </button>
              <div id="artlist" class="ui-scroll a-list"></div>
            </div>

            <div class="a-box">
              <button id="setlist-btn" class="a-btn">Комплекты</button>
              <div id="setlist" class="ui-scroll a-list"></div>
            </div>

            <div class="a-box" id="search-box">
              <input id="search" class="a-input __left" type="text" placeholder="Найти лот... (Ctrl + /)" spellcheck="false" autocomplete="off">
              <div id="search-list" class="ui-scroll a-list"></div>
              <button id="ext-search" class="action${userData.extSearch ? ' __active' : ''}" title="Поиск в подстроках (Alt+S)">*Aa*</button>
              <span id="search-reset" title="Reset (Esc)">&times;</span>
            </div>

            ${renderFaves(Object.keys(userData.faves).length)}
          </div>

          <div class="main__top">
            ${renderFilters(userData)}
            <div id="mybets-box" class="a-box">
              <button id="mybets-btn" class="a-btn" data-counter="0">Мои ставки</button>
            </div>
          </div>

          ${renderSorters(userData)}
          <div id="lots-container" class="ui-scroll">
            <section id="lots" data-order=${userData.order}></section>
          </div>

          ${renderForm()}
          <div id="notices"></div>
        </section>
      </div>

      <div id="contextmenu" tabindex="-1"></div>
      <div id="loader"></div>
      <div id="art-info"></div>
    </main>
  `);

  const aucClassList = aucElem.classList;

  if (document.body) insertContainer();

  function insertContainer() {
    if (!aucElem.parentNode) document.body.prepend(aucElem);
  }

  function renderHeader() {
    return /*html*/`
      <header id="auction__header">
        <span id="online" title="Статус интернет-соединения"></span>
        <a id="refresh" href="${AUC_PATH}">Auction</a>
        <span id="version">${MODULE_VERSION}</span>
        <a id="author" href="/pl_info.php?id=${DEV_ID}">Мифист</a>
        <div id="resources"></div>
      </header>
    `;
  }

  function renderNav() {
    const navData = {
      Character: [
        ['Персонаж', '/home.php'],
        ['Я', `/pl_info.php?id=${MY_ID}`],
        ['Протокол передач', `/pl_transfers.php?id=${MY_ID}`],
        ['Инвентарь', '/inventory.php'],
        ['Магазин артефактов', '/shop.php'],
        ['Рынок', AUC_PATH],
        ['Рынок: выставить лот', '/auction_new_lot.php'],
        ['Набор армии', '/army.php'],
        ['Замок', '/castle.php'],
        ['Навыки', '/skillwheel.php'],
        ['Личная почта', '/sms.php'],
        ['Передача ресурсов', '/transfer.php'],
        ['Передача элементов', '/el_transfer.php'],
      ],
      Map: [
        ['Карта', '/map.php'],
        ['Добыча', '/map.php?st=mn'],
        ['Обработка', '/map.php?st=fc'],
        ['Производство', '/map.php?st=sh'],
        ['Дома', '/map.php?st=hs'],
      ],
      Battles: [
        ['Битвы', '/bselect.php'],
        ['Протокол боев', `/pl_warlog.php?id=${MY_ID}`],
        ['Дуэли', '/one_to_one.php'],
        ['Групповые бои', '/group_wars.php'],
        ['Гильдия Тактиков', '/pvp_guild.php'],
        ['Гильдия Стражей', '/task_guild.php'],
        ['Гильдия Лидеров', '/leader_guild.php'],
        ['Гильдия Рейнджеров', '/ranger_list.php'],
        ['Бои за территории', '/mapwars.php'],
        ['Турниры', '/tournaments.php'],
      ],
      Tavern: [
        ['Таверна', '/tavern.php'],
        ['Протокол игр', `/pl_cardlog.php?id=${MY_ID}`],
        ['Создать заявку', '/tavern.php?form=1'],
      ],
      Roulette: [
        ['Рулетка', '/roulette.php'],
        ['Прошлая игра', '/inforoul.php'],
        ['История игр', '/allroul.php'],
        ['Редкие ларцы', '/gift_box_log.php'],
      ],
      Rate: [
        ['Рейтинги', '/plstats.php'],
        ['Личные достижения ГО', `/pl_hunter_stat.php?id=${MY_ID}`],
        ['Рейтинг боевых кланов', '/clanstat.php'],
        ['Рейтинг охотников', '/plstats_hunters.php'],
        ['Рейтинг наемников', '/plstats_merc.php'],
        ['Рейтинг акционеров', '/sholders_stat.php'],
      ],
      Forum: [
        ['Форум', '/forum.php'],
        ['Официальный', '/forum_thread.php?id=1'],
        ['Общий игровой', '/forum_thread.php?id=2'],
        ['Вопросы и помощь', '/forum_thread.php?id=10'],
        ['Идеи и предложения', '/forum_thread.php?id=3'],
        ['Об игре', '/ob-igre'],
      ]
    };

    function renderMenu([id, data]) {
      const [name, href] = data.shift();
      const image = `https://dcdn.heroeswm.ru/i/new_top/_panel${id}.png`;

      return /*html*/`
        <div class="menu" id="menu-${id}">
          <a class="menu__link" href="${href}">
            <img class="menu__icon" src="${image}">
          </a>
          <div class="menu__list" data-name="${name}">
            ${renderSubLinks(data)}
          </div>
        </div>
      `;
    }

    function renderSubLinks(data) {
      return data.map(([name, href]) => {
        return `<a class="menu__item" href="${href}">${name}</a>`;
      }).join('');
    }

    const html = Object.entries(navData).map(renderMenu).join('');
    return `<nav id="hwm-nav">${html}</nav>`;
  }

  function renderPlayer(name) {
    return /*html*/`
      <header id="player">
        <div>
          <a href="/pl_info.php?id=${MY_ID}" id="player__name">${name}</a>
        </div>
        <div>
          <span id="coin" class="coin">$</span>
          <span id="player__gold" class="gold"></span>
        </div>
      </header>
    `;
  }

  function renderForm() {
    const inputHint = 'Шаг с зажатой клавишей:\nShift: 10\nCtrl: 100\nAlt: 1000';

    return /*html*/`
      <section id="form" class="__minimized">
        <header>Лотов показано:</header>
        <div id="form__lot" class="lot"></div>
        <footer>
          <label>
            Кол-во
            <input id="form__input" type="number" autocomplete="off" title="${inputHint}">
          </label>
          <button id="form__submit"><span>Купить лот</span></button>
        </footer>
      </section>
    `;
  }

  function renderFilters({filters}) {
    const len = Object.keys(filters).filter((k) => filters[k] !== null).length;

    const data = {
      once: ['Продажа', 'Торги'],
      full: ['Целые', 'Слом'],
      type: ['Сетовые', 'Не сетовые'],
      craft: ['С крафтом', 'Без крафта'],
    };

    const icon = /*html*/`
      <svg id="filters-icon" viewBox="0 0 16.5 17" width="18" height="18">
        <path d="M175.051,8.283V.478a.478.478,0,1,0-.955,0v7.8a2.425,2.425,0,0,0,0,4.755v3.474a.478.478,0,1,0,.955,0V13.038a2.425,2.425,0,0,0,0-4.755Zm-.478,3.846a1.468,1.468,0,1,1,1.468-1.468A1.469,1.469,0,0,1,174.574,12.129Z" transform="translate(-166.302 0)"></path>
        <path d="M9.751,4.278V.478a.478.478,0,0,0-.955,0v3.8a2.425,2.425,0,0,0,0,4.755v7.479a.478.478,0,0,0,.955,0V9.029a2.423,2.423,0,0,0,0-4.752ZM9.274,8.123a1.468,1.468,0,1,1,1.468-1.468A1.469,1.469,0,0,1,9.274,8.123Z" transform="translate(-6.85 0)"></path>
        <path d="M339.351,4.278V.478a.478.478,0,0,0-.955,0v3.8a2.425,2.425,0,0,0,0,4.755v7.483a.478.478,0,0,0,.955,0V9.029a2.423,2.423,0,0,0,0-4.752Zm-.478,3.846a1.468,1.468,0,1,1,1.468-1.468A1.469,1.469,0,0,1,338.874,8.123Z" transform="translate(-324.789 0)"></path>
      </svg>
    `;

    const active = (key, val) => filters[key] === val ? ' __active' : '';

    const innerHTML = Object.keys(data).map((key) => {
      const [one, two] = data[key];
      return /*html*/`
        <div class="filters__group">
          <div class="filters__item${active(key, 1)}" data-filter="${key}=1">${one}</div>
          <div class="filters__item${active(key, 0)}" data-filter="${key}=0">${two}</div>
        </div>
      `;
    }).join('');

    return /*html*/`
      <div id="filters-box" class="a-box">
        <button id="filters-remove" class="action">&times;</button>
        <button id="filters-btn" class="a-btn __left">${icon}Фильтры</button>
        <div id="filters" class="ui-scroll a-list">${innerHTML}</div>
        <span id="filters-counter">${len}</span>
      </div>
    `;
  }

  function renderSorters({sort, order}) {
    const headers = {
      name: 'Товар',
      type: 'Ставка',
      cost: 'Цена/шт.',
      time: 'Время',
      owner: 'Владелец',
    };

    const innerHTML = Object.keys(headers).map((key) => {
      const type = `by${key[0].toUpperCase() + key.slice(1)}`;
      const attrs = [
        `class="a-td sorts__item _${key}"`,
        `data-sort="${type}"`,
      ];

      if (type === sort) attrs.push(`data-order="${order}"`);

      return `<span ${attrs.join(' ')}>${headers[key]}</span>`;
    }).join('');

    return `<div id="sorts">${innerHTML}</div>`;
  }

  function renderFaves(len) {
    const extraInputAttrs = [
      'type="text"',
      'placeholder="Название закладки"',
      'spellcheck="false"',
      'autocomplete="off"',
    ].join(' ');

    const btnClassName = `a-btn __left${len ? '' : ' __none'}`;

    return /*html*/`
      <div id="faves-box" class="a-box">
        <button id="faves-toggle" class="action">+</button>
        <button id="faves-btn" class="${btnClassName}">Избранное</button>
        <div id="faves" class="ui-scroll a-list"></div>
        <div id="faves-input-box">
          <input id="faves-input" class="a-input __left" ${extraInputAttrs}>
          <button id="faves-add" class="action">OK</button>
        </div>
      </div>
    `;
  }

  // ====================

  $('#hwm-nav', aucElem).addEventListener('mouseover', (e) => {
    const trg = e.target;

    if (!trg.matches('.menu__item')) return;

    trg.addEventListener('mousemove', move);

    trg.addEventListener('mouseleave', function leave(e) {
      this.removeEventListener('mousemove', move);
      this.removeEventListener(e.type, leave);
    });

    function move(e) {
      this.setAttribute('style', `--x: ${~~e.layerX}px; --y: ${~~e.layerY}px`);
    }
  });

  // ====================

  const newSetArtsData = userData.newSetArts;
  Object.entries(newSetArtsData).forEach(([name, data]) => {
    if (!allSetData[name]) return allSetData[name] = data;

    const arts = allSetData[name].arts;
    data.arts.forEach(art => arts.includes(art) || arts.push(art));
  });

  const allSetArts = Object.values(allSetData).map(that => that.arts).flat(1);
  const allSetArtsRus = {};

  // ====================

  const setLoadState = aucClassList.toggle.bind(aucClassList, '__loading');

  const setSortsPad = ((target, sortStyle) => {
    return () => {
      sortStyle.paddingRight = `${target.offsetWidth - target.clientWidth}px`;
    };
  })($('#lots-container', aucElem), $('#sorts', aucElem).style);

  const aucHwmForm = ((target) => {
    target.hidden = true;

    return {
      get target() {
        return target;
      },
      get name() {
        return target.name;
      },
      replace(form) {
        form.hidden = true;
        target.replaceWith(form);
        return (target = form);
      }
    };
  })(document.createElement('form'));

  // ====================

  if (document.readyState === 'loading') {
    await new Promise(resolve => {
      view.addEventListener('load', resolve, { once: true });
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    });
  }

  insertContainer();

  // ====================

  let isOnLine = true;
  let searchParams = getSearchParams(location.search);

  function goTo(search) {
    if (location.search !== search) {
      history.pushState(null, '', AUC_PATH + search);
    }

    return loadPage(search);
  }

  async function loadPage(search = location.search) {
    searchParams = getSearchParams(search);
    setLoadState(1);
    timers.clear();
    activeLot && form.minimize(true);

    const hwm_elem = await getHWMElem(getAucURL(search));
    if (!hwm_elem) return;

    const {cat} = searchParams;
    const key = searchParams[cat === 'res' ? 'type' : 'art_type'];

    aucClassList.remove('__unallowed', '__disconnected');
    bets.shown && bets.hide();

    const stuffCats = ['res', 'elements', 'part', 'dom', 'cert', 'obj_share'];
    filters.partial(stuffCats.includes(cat));
    filters.disable(['my', 'obj_share'].includes(cat));

    extraStyle.__replace(0, /cat-\S+/, `cat-${cat}`);
    extraStyle.__replace(0, /type=[^"]+/, `type=${key}`);

    lotsBox.load(hwm_elem);
    timers.switchTimers();
    setLoadState(0);

    if (cat === 'my') resources.updateFromServer();
  }

  async function getHWMElem(url) {
    const doc = await fetch.get(url).catch(() => ({ URL: '' }));
    if (!doc.URL.includes(AUC_PATH)) return setNoAccess();

    const selector = 'td.wbwhite tbody';
    const hwm_elem = attempt($(selector, doc), importNode);

    if (!hwm_elem) {
      const msg = [
        'Невозможно построить список лотов.',
        `Элемент с селектором "${selector}" отсутствует в оригинальном DOM.`,
      ].join('\n');

      return Alert.error(msg, { isFinite: false });
    }

    while (true) {
      const elem = hwm_elem.firstElementChild;
      if (!elem || elem.className) return hwm_elem;
      elem.remove();
    }
  }

  const setNoAccess = throttle(() => {
    setLoadState(0);
    form.disable(false);
    aucClassList.add('__unallowed');
    Alert.error('В данный момент рынок не доступен!', { isFinite: false });

    if (!isOnLine) return aucClassList.add('__disconnected');

    const isAuthorized = () => document.cookie.includes(`pl_id=${MY_ID}`);

    if (isAuthorized()) return;

    Alert.error('Вы деавторизованы!', {
      isFinite: false,
      onCreate(that) {
        this.timerId = setTimeout(() => {
          return isAuthorized() ? that.destroy() : this.onCreate(that);
        }, 2e3);
      },
      onDestroy() {
        clearTimeout(this.timerId);

        if (!isAuthorized()) return setTimeout(() => location.replace('/'));

        aucClassList.remove('__unallowed');
        Alert.ok('Вы снова авторизованы');
      }
    });
  }, 500);

  // ====================

  const allLots = [];

  function findLot(key, value, lots = allLots) {
    return lots.find(lot => lot[key] === value);
  }

  function filterLots(lots = allLots) {
    if (bets.shown || searchParams.cat === 'my') return lots;

    const {filters} = userData;
    const keys = Object.keys(filters);

    return lots.filter(lot => {
      if (lot.cat === 'obj_share') return true;

      if (lot.classType !== 'Art') {
        return [null, +lot.once].includes(filters.once);
      }

      return keys.every(key => {
        const val = filters[key];
        if (val === null) return true;

        switch (key) {
          case 'once': return +lot.once === val;
          case 'full': return +Object.is(...lot.durability) === val;
          case 'type': return +lot.fromSet === val;
          case 'craft': return !lot.mods === !val;
        }
      });
    });
  }

  // ==================== [[ LOT TYPES ]]

  let activeLot = null;

  class Lot {
    constructor() {
      Object.assign(this, createLotData(...arguments));
    }
    get classType() {
      return this.constructor.name;
    }
    get isActive() {
      return this === activeLot;
    }
    get search() {
      return `?cat=${this.cat}`;
    }
    select() {
      if (!this.once && this.owner[1] === MY_ID) return;
      if (this.isActive) return form.minimize(true);

      if (activeLot) {
        activeLot.target.classList.remove('__active');
      }

      this.target.classList.add('__active');
      form.refreshByLot(activeLot = this);
    }
    increaseBetAmount() {
      const elem = $('.lot__bet-amount', this.target);
      elem.textContent = ++this.betAmount;
    }
    refresh() {
      const {target} = this;
      const curFormVal = +form.inputValue;

      if (this.once) {
        this.amount -= curFormVal;
        this.amount <= 0 && this.complete();
        player.refreshGold(this.cost * curFormVal);
      } else {
        this.myBet = curFormVal;
        this.cost = form.getMinBet(this.cost);
        this.lastHero = [player.name, MY_ID];
        player.refreshGold(curFormVal);

        if (this.blitz && curFormVal >= this.blitz) this.complete();
        else target.dataset.params += '&mybet=1';
      }

      target.innerHTML = createLot(this).innerHTML;
    }
    expire() {
      this.complete(true);
    }
    complete(force) {
      const {target} = this;

      this.completed = true;
      target.dataset.params += '&completed=1';

      if (force) target.style.setProperty('--timer', '00:00');
      if (this.isActive) form.minimize(true);
    }
    async reload() {
      if (this.completed || !this.target.offsetWidth) return;

      const processingEl = parseNode(/*html*/`
        <div class="lot__processing">
          <span class="lot__loading">Загрузка</span>
        </div>
      `);
      this.target.prepend(processingEl);

      const hwm_form = await this.getRemoteHwmForm();

      if (hwm_form === 0) return;

      if (!hwm_form) {
        this.complete(Date.now() >= this.time[1]);
        processingEl.innerHTML = '<span>Торги закончены</span>';
        return setTimeout(() => processingEl.remove(), 2e3);
      }

      this.hardRefresh(hwm_form.closest('tr.wb'));

      if (this.isActive) form.refreshByLot(this, ~~form.inputValue);

      timers.switchTimers();
    }
    async getRemoteHwmForm() {
      const url = getAucURL(this.search);
      const doc = await fetch.get(url).catch(() => ({ URL: '' }));

      if (!doc.URL.includes(AUC_PATH)) {
        setNoAccess();
        return 0;
      }

      return $(`form[name$="${this.id}"]`, doc);
    }
    hardRefresh(hwm_elem) {
      const that = createNewLot(hwm_elem, this.cat, this.constructor);
      const keys = ['amount', 'betAmount', 'cost', 'time', 'lastHero'];

      keys.forEach(key => {
        if (that.hasOwnProperty(key)) this[key] = that[key];
      });

      this.target.innerHTML = that.target.innerHTML;
      this.target.dataset.params = that.target.dataset.params;
    }
  }

  class Res extends Lot {
    get search() {
      return `?cat=${this.cat}&type=${this.key}`;
    }
    get key() {
      return 1 + Res.TYPES.indexOf(this.resName);
    }
    get resName() {
      return this.image.match(/\w+(?=\.png)/)[0];
    }
  }

  Res.TYPES = ['wood', 'ore', 'mercury', 'sulfur', 'crystals', 'gems'];

  class GnElem extends Lot {
    get search() {
      return `?cat=${this.cat}&art_type=${this.key}`;
    }
    get key() {
      return this.image.match(/\w+(?=\.png)/)[0];
    }
  }

  class Art extends Lot {
    constructor(hwm_elem) {
      super(...arguments);

      const {firstElementChild: elem} = hwm_elem;
      const {search} = $('a[href^="art_info"]', elem);
      const key = search.match(/=([^&]+)/)[1];

      Object.assign(this, {
        key,
        mods: Art.getMods(elem),
        durability: Art.getDurability(elem),
        fromSet: allSetArts.includes(key),
      });
    }
    get search() {
      return `?cat=${this.cat}&art_type=${this.key}`;
    }
    static get modColors() {
      return {
        A: '#ab91c7',
        D: '#a09f9f',
        E: '#ac6262',
        F: '#ff8f1b',
        I: '#d2b48c',
        N: '#73ac6c',
        W: '#74b4f6'
      };
    }
    static getMods(elem) {
      const match = elem.textContent.match(/\[([IEAWFDN\d]{2,})\]/);
      return match && match[1].match(/[A-Z]\d+/g);
    }
    static createModsHTML(mods) {
      const colors = this.modColors;
      return mods.map((mod) => {
        return `<font color="${colors[mod[0]]}">${mod}</font>`;
      }).join(' ');
    }
    static createModImgsHTML(mods) {
      const path = 'https://dcdn3.heroeswm.ru/i/mods_png';
      return mods.map((mod) => `<img src="${path}/${mod}.png">`).join('');
    }
    static getDurability(elem) {
      const html = elem.innerHTML;
      const match = elem.textContent.match(/\d+\/\d+/)[0];
      const values = match.split('/').map(Number);
      const isMaxRed = html.includes('font>/<font');
      const type = isMaxRed ? 2 : +html.includes('Прочность: <font');
      return [...values, type];
    }
  }

  class ArtPart extends Lot {
    constructor(hwm_elem) {
      super(...arguments);

      const {search} = $('a[href^="art_info"]', hwm_elem.firstElementChild);
      this.key = search.match(/=(\w+)/)[1];
    }
    get search() {
      return `?cat=${this.cat}&art_type=part_${this.key}`;
    }
  }

  class Cert extends Lot {
    constructor(hwm_elem) {
      super(...arguments);

      const {data} = $('b', hwm_elem.firstElementChild).previousSibling;
      this[this.cat] = { html: `<p class="place">${data.trim()}</p>` };
    }
  }

  class Share extends Lot {
    constructor(hwm_elem) {
      super(...arguments);
      this[this.cat] = Share.getShare(hwm_elem.firstElementChild);
    }
    static getShare(elem) {
      const link = $('[href^="object-info"]', elem);
      const place = $('[href^="map.php"]', elem).outerHTML.replace('pi', 'place');
      const match = (elem.textContent.match(/,\s([^[]+)/) || '  ')[1].trim();
      const details = match.replace(/(\d+)/, '$1<br>');

      return {
        link: link.outerHTML.replace('<a', ' <a class="obj-id"'),
        html: `<p class="obj-details">${details}</p><p class="place">${place}</p>`
      };
    }
  }

  class House extends Lot {
    constructor(hwm_elem) {
      super(...arguments);
      this[this.cat] = House.getHouse(hwm_elem.firstElementChild);
    }
    static getHouse(elem) {
      const link = $('[href^="house_info"]', elem);
      const place = $('b', elem).previousSibling.data.trim();
      const points = ['star_outline', 'star', 'star_half'];
      const hwm_stars = elem.innerHTML.match(/\/star\d+/g).map(x => [...x].pop());
      const stars = hwm_stars.map(x => {
        return `<span class="house__star m-icon">${points[x]}</span>`;
      }).join('');

      return {
        link: link.outerHTML.replace('<a', ' <a class="obj-id"'),
        html: `<p class="place">${place}</p><p class="house__stars">${stars}</p>`
      };
    }
  }

  // ====================

  function createLotData(elem, cat) {
    const {common} = createLot;
    const {children} = elem;
    const {innerHTML} = children[0];
    const once = children[1].childElementCount === 1;
    const image = $('img:last-of-type', children[0]).src;
    const pi = $('a.pi', children[0]);
    const params = pi ? new URLSearchParams(pi.search) : new Map;
    const text = !pi ? '' : (pi.nextSibling || pi.parentNode.previousSibling);
    const name = text && text.data.trim().replace(/^- /, '');

    const that = {
      id: params.get('id'),
      crc: params.get('crc'),
      name,
      cat,
      image,
      once,
      amount: +!once || +innerHTML.match(/\d+(?= шт\.)/) || 1,
      cost: common.getCost(elem),
      time: common.getTime(children[3]),
      owner: common.getHero(children[4]),
    };

    return once ? that : Object.assign(that, common.getBet(children[1]));
  }

  function createNewLot(hwm_elem, category, constructor) {
    if (category === 'my') {
      const image = $('img:last-of-type', hwm_elem).src;
      category = getCatByImage(image) || category;
    }

    const Entity = constructor || getClassByCategory(category);
    const lot = new Entity(hwm_elem, category);
    lot.target = createLot(lot);
    return lot;
  }

  function getCatByImage(image) {
    if (image.includes('/r/48/')) return 'res';
    if (image.includes('/gn_res/')) return 'elements';
    if (image.includes('/auc_dom')) return 'dom';
    if (image.includes('/house_cert')) return 'cert';
    if (image.includes('/obj_share')) return 'obj_share';
    if (image.includes('/parts/')) return 'part';
  }

  function getClassByCategory(cat) {
    return {
      res: Res,
      elements: GnElem,
      dom: House,
      cert: Cert,
      obj_share: Share,
      part: ArtPart
    }[cat] || Art;
  }

  function createLot(lot) {
    const {common, layout} = createLot;
    const {id, crc, cat} = lot;
    const isArt = lot.classType === 'Art';
    const isArtPart = cat === 'part';
    const imgContTag = (isArt || isArtPart) ? 'a' : 'div';
    const linkAttr = imgContTag === 'a'
      ? ` href="/art_info.php?id=${lot.key}"`
      : '';
    const mods = isArt ? lot.mods : null;
    const dur = isArt
      ? layout.getDurability(lot.durability)
      : isArtPart
      ? '1/100'
      : '';

    const timeHTML = `<span class="lot__time">${lot.time[0]}</span>`;

    return parseNode(/*html*/`
      <div class="lot" ${layout.getDataAttrs(lot)}>
        <div class="a-td _name">
          <${imgContTag} class="lot__box"${linkAttr}>
            <img class="lot__img" src="${lot.image}">
            ${layout.getAmount(lot)}
            ${mods && `<span class="art-mods">${Art.createModImgsHTML(mods)}</span>` || ''}
          </${imgContTag}>
          <div class="lot__info">
            <a class="lot__id" href="/auction_lot_protocol.php?id=${id}&crc=${crc}">${id}</a>
            ${layout.getName(lot)}
            ${lot[cat] && lot[cat].html || ''}
            ${mods && `<p class="mods-scope">${Art.createModsHTML(mods)}</p>` || ''}
            ${dur && `<p class="lot__durability">${dur}</p>`}
          </div>
        </div>
        <div class="a-td _type">${layout.getBet(lot)}</div>
        ${renderLotCost(lot)}
        <div class="a-td _time">${timeHTML}</div>
        <div class="a-td _owner">${layout.getHero(lot.owner)}</div>
      </div>
    `);
  }

  function renderLotCost(lot) {
    return /*html*/`
      <div class="a-td _cost">
        <div>
          <span class="gold">${formatNum(lot.cost)}</span>
          <span class="coin">$</span>
        </div>
        ${lot.lastHero ? createLot.layout.getHero(lot.lastHero) : ''}
        ${lot.myBet ? `<p class="mybet">${formatNum(lot.myBet)}</p>` : ''}
      </div>
    `;
  }

  createLot.common = {
    timeData: {
      'д': v => v * 86400,
      'ч': v => v * 3600,
      'мин': v => v * 60,
      'с': v => ~~v
    },
    getTime(elem) {
      const value = elem.textContent;
      const parts = value.match(/\d+ (д|ч|мин|с)/g);
      const sec = !parts ? 0 : parts.reduce((a, b) => {
        const data = b.split(' ');
        return a + this.timeData[data[1]](data[0]);
      }, 0);

      return [value, Date.now() + sec * 1e3];
    },
    getBet(elem) {
      const that = {};
      const amount = that.betAmount = elem.firstChild.data >> 0;
      if (amount) that.lastHero = this.getHero(elem.nextElementSibling, that);

      const last = elem.lastElementChild;
      if (last) that.blitz = parseNum(last.textContent);

      return that;
    },
    getCost(elem) {
      const value = $('[id^=au] td:last-child', elem).textContent;
      return parseNum(value);
    },
    getHero(elem, that) {
      const link = $('[href^="pl_info"]', elem) || {};
      const name = link.textContent || '';
      const bet = that && ((link.nextSibling || {}).data || '').slice(2);

      if (bet) that.myBet = +bet;
      else if (that) delete that.myBet;

      return [name, link.search.slice(4)];
    },
  };

  createLot.layout = {
    getDataAttrs(data) {
      const {cat} = data;
      const isArt = data.hasOwnProperty('key');
      const keyStr = isArt ? ` data-key="${data.key}"` : '';
      const params = [`once=${+data.once}`];
      const hero = (data.lastHero || '')[0];

      if (data.owner[1] === MY_ID) params.push('mylot=1');
      if (hero === player.name) params.push('mybet=1');

      const paramsStr = cat === 'obj_share'
        ? ' data-params'
        : ` data-params="${params.join('&')}"`;

      return `data-id="${data.id}" data-cat="${cat}"` + keyStr + paramsStr;
    },
    getBet({id, once, blitz, betAmount}) {
      if (once) return '<span class="lot__bet-type">Купить сразу</span>';

      const html = `<span class="lot__bet-amount">${betAmount}</span>`;
      const watchHTML = bets.has(id) ? bets.createIconTpl() : '';

      const blitzHTML = !blitz ? '': /*html*/`
        <p class="lot__bet-type">Блиц цена:</p>
        <p class="lot__blitz">
          <span class="gold">${formatNum(blitz)}</span>
          <span class="coin">$</span>
        </p>
      `;

      return watchHTML + html + blitzHTML;
    },
    getAmount({amount, cat}) {
      return (amount > 1 || ['res', 'elements'].includes(cat))
        ? `<span class="lot__amount">${amount}</span>`
        : '';
    },
    getName(data) {
      const {name, cat, fromSet} = data;
      const html = `<p class="lot__name">${name}</p>`;

      if (fromSet) return html.replace('name', 'name c-set');

      const link = data[cat] ? data[cat].link : '';

      return link ? html.replace('</', ` ${link}</`) : html;
    },
    getHero([name, id]) {
      return `<a href="/pl_info.php?id=${id}">${name}</a>`;
    },
    getDurability(arr) {
      if (!arr[2]) return arr.slice(0, 2).join('/');

      const colorize = (n) => `<font color="lightcoral">${n}</font>`;

      return arr[2] === 1
        ? `${colorize(arr[0])}/${arr[1]}`
        : arr.slice(0, 2).map(colorize).join('/');
    }
  };

  // ====================

  const lotsBox = ((target) => {
    let hoveredElem = null;

    return {
      __init__() {
        target.addEventListener('click', ({target: trg}) => {
          const elem = trg.tagName === 'A' ? null : trg.closest('.lot');
          const lot = elem && findLot('target', elem);

          if (!lot) return;

          lot.select();
          setSortsPad();
        });

        target.addEventListener('mouseover', ({target: trg}) => {
          if (trg.hasAttribute('data-id')) hoveredElem = trg;
        });

        target.addEventListener('mouseleave', () => (hoveredElem = null));
      },
      target: target,
      load({children}) {
        const {cat} = searchParams;
        const lots = [...children].map(el => createNewLot(el, cat));
        allLots.splice(0, Infinity, ...lots);
        sort[userData.sort]();
        this.appendAll(filterLots());
      },
      appendAll(lots) {
        target.replaceChildren(...lots.map(lot => lot.target));
        setSortsPad();
      },
      get selectedLot() {
        return hoveredElem && findLot('target', hoveredElem);
      }
    };
  })($('#lots'));

  const timers = (() => {
    let timerId = 0;

    const format = (n) => n > 9 ? n : `0${n}`;
    const stringify = (t) => `'${format(t / 60 >> 0)}:${format(t % 60)}'`;

    function loop() {
      const now = Date.now();

      allLots.forEach(lot => {
        if (lot.completed) return;

        const endTime = lot.time[1];
        const sec = now >= endTime ? 0 : (endTime - now) / 1e3 >> 0;

        if (!sec) return lot.expire();
        if (sec > 180 || !lot.target.offsetWidth) return;

        const value = stringify(sec);
        lot.target.style.setProperty('--timer', value);
        lot.isActive && form.lotElem.style.setProperty('--timer', value);
      });

      timerId = setTimeout(loop, 1e3);
    }

    return {
      switchTimers() {
        this.clear();
        loop();
      },
      clear() {
        clearTimeout(timerId);
      }
    };
  })();

  const player = (() => {
    const goldEl = $('#player__gold');

    return {
      __init__() {
        if (this.name) return;

        fetch.get(`/pl_info.php?id=${MY_ID}`).then(({title}) => {
          const name = title.split('|')[0].trim();
          $('#player__name').textContent = name;
          userData.update('playerName', name);
          extraStyle.__replace(1, 'NAME', name);
        });
      },
      refreshGold(n) {
        goldEl.textContent = formatNum(resources.refresh('gold', -n));
      },
      get id() {
        return MY_ID;
      },
      get name() {
        return userData.playerName;
      },
      get gold() {
        return resources.gold;
      }
    };
  })();

  const resources = ((target) => {
    const elemsData = { gold: document.head };
    const hwmSelector = '#ResourcesPanel, #top_res_table, #panel_resourses';

    function getElems(context = document, selector = hwmSelector) {
      const container = $(selector, context);
      const imgs = container ? $$('img', container) : [];

      if (imgs.length && imgs[0].src.includes('/heart')) imgs.shift();
      return imgs.slice(0, 7).map(create);
    }

    function create(img, i) {
      const href = !i ? '#' : `${AUC_PATH}?cat=res&type=${i}`;
      return parseNode(/*html*/`
        <span class="resources__item" data-value="${getValue(img)}">
          <a href="${href}"><img src="${img.src}" width="24"></a>
        </span>
      `, el => (el.__key = img.src.match(/\w+(?=\.png)/)[0]));
    }

    function getValue(img) {
      const node = img.nextElementSibling || img.parentNode.nextSibling;
      return node.textContent.trim();
    }

    return {
      __init__() {
        const newHeader = (modules.get('HWM_new_header') || {}).exports;
        if (!newHeader) return this.update();
        this.update(newHeader, '.header-resources');
      },
      get gold() {
        return parseNum(elemsData.gold.dataset.value);
      },
      update() {
        const elems = getElems(...arguments);
        const data = Object.fromEntries(elems.map(el => [el.__key, el]));

        Object.assign(elemsData, data);
        target.replaceChildren(...elems);
        player.refreshGold(0);
      },
      async updateFromServer() {
        const url = '/transfer.php';
        const context = await fetch.get(url).catch(() => ({ URL: '' }));

        if (!context.URL.includes(url)) return setNoAccess();

        this.update(context);
      },
      refresh(key, n) {
        return ~~attempt(elemsData[key], ({dataset}) => {
          const value = n + parseNum(dataset.value);
          dataset.value = formatNum(value);
          return value;
        });
      }
    };
  })($('#resources'));

  const artsSelect = ((target) => {
    const newArts = [];
    const setArts = [];
    const newArtsData = userData.newArts;

    function initOptions(hwm_select) {
      const selectItem = parseNode('<a class="a-link a-list__item"></a>');
      const hwm_options = [...hwm_select.options].slice(1);

      hwm_options.forEach(({value, textContent}) => {
        const item = selectItem.cloneNode();
        const [cat, id] = value.split('#');

        item.textContent = textContent;
        item.setAttribute('href', `${AUC_PATH}?cat=${cat}&art_type=${id}`);

        if (allSetArts.includes(id)) {
          item.className += ' c-set';
          allSetArtsRus[id] = textContent;
        }

        if (!allArtsData[id]) newArts.push(id);

        target.appendChild(item);
      });
    }

    async function pullArtsFromServer() {
      const addArt = (id, value) => {
        allArtsData[id] = newArtsData[id] = value;
      };

      const addSetArt = (link, id) => {
        const name = link.hash.slice(1);

        if (!newSetArtsData[name]) {
          newSetArtsData[name] = {
            rus: link.textContent.replaceAll('"', ''),
            arts: [id]
          };
        } else if (!newSetArtsData[name].arts.includes(id)) {
          newSetArtsData[name].arts.push(id);
        }
      };

      const handleArt = async (id) => {
        const ctx = await fetch.get(`/art_info.php?id=${id}`);
        const img = $('.arts_info img[src*="/artifacts/"]', ctx);

        if (!img) return;

        const setLinks = $$('.s_art_inside a[href*="?section=40#"]', ctx);
        setLinks.forEach(link => addSetArt(link, id));

        let value = img.src.split('/artifacts/')[1].replace('_b.png', '');

        if (value === id) return addArt(id, '&');
        if (!value.includes('/')) return addArt(id, value);

        const parts = value.split('/');
        value = parts.pop();
        addArt(id, `${parts.join('/')}/${value === id ? '&' : value}`);
      };

      while (newArts.length) {
        let promises = newArts.splice(0, 5).map(handleArt);
        await Promise.all(promises);
      }
    }

    return {
      __init__() {
        Object.assign(allArtsData, newArtsData);

        const eye = $('#artlist-eye');

        eye.addEventListener('click', () => {
          if (eye.classList.toggle('__switched-on')) {
            this.arts.forEach(addImageToArt);
          } else {
            $$('.a-link[style]', target).forEach(el => {
              el.removeAttribute('style');
            });
          }
        });

        initOptions($('select[name="ss2"]'));

        if (!newArts.length) return;

        const msg = 'Список лотов обновлен. Добавлено: ' + newArts.length;
        Alert.addStartMessage(msg);
        pullArtsFromServer().then(() => userData.update()).catch(setNoAccess);
      },
      get arts() {
        return [...target.children];
      },
      get setArts() {
        if (setArts.length) return setArts;

        setArts.push(...this.arts.filter(el => el.matches('.c-set')));
        return setArts;
      },
      get hasImages() {
        return !!$('.a-link[style]', target);
      }
    };
  })($('#artlist'));

  const setArtsSelect = ((target) => {
    return {
      __init__() {
        Object.keys(allSetData).forEach(this.addContainer);

        target.addEventListener('click', ({target: trg}) => {
          if (!trg.matches('.setlist__set-name')) return;

          const parent = trg.parentNode;
          parent.classList.toggle('__active');

          if (parent.childElementCount === 1) {
            parent.appendChild(this.createList(parent.dataset.set));
          }
        });
      },
      addContainer(name) {
        return target.appendChild(parseNode(/*html*/`
          <div class="setlist__set" data-set="${name}">
            <h4 class="setlist__set-name c-set">${allSetData[name].rus}</h4>
          </div>
        `));
      },
      createList(name) {
        const container = parseNode('<div class="setlist__arts"></div>');
        container.append(...this.getArts(name));
        return container;
      },
      getArts(name) {
        const {setArts} = artsSelect;

        return allSetData[name].arts.map(key => {
          const rus = allSetArtsRus[key];
          const elem = rus && setArts.find(art => art.textContent === rus);

          if (!elem) return;

          const art = elem.cloneNode(true);
          art.classList.remove('c-set');

          if (!art.hasAttribute('style')) addImageToArt(art);

          return art;
        }).filter(Boolean);
      }
    };
  })($('#setlist'));

  const categories = ((target) => {
    const subLayouts = {};

    function onHandleClick({target: trg}) {
      if (!trg.matches('.category__heading')) return;

      const parent = trg.parentNode;
      const menu = trg.nextElementSibling;
      const test = !!menu.childElementCount;
      const id = parent.id.slice(4);

      if (!test) menu.innerHTML = createListHTML(id);

      if (!parent.classList.toggle('__active')) menu.removeAttribute('style');
      else menu.style.setProperty('--count', menu.childElementCount);

      if (test) return;

      if (this.isArtsCategory(id)) this.colorizeSetArts(menu);
      else if (id === 'elements') addImgToElements(menu);
    }

    function createListHTML(id) {
      const html = id === 'res'
        ? subLayouts[id]
        : extractSubLayout(subLayouts[id]);
      return html.replace(/&sort=\d/g, '');
    }

    function extractSubLayout(text) {
      return text
        .match(/<a[^']+/)[0]
        .replace(/&nbsp;|<\/?[b-z].*?>/gi, '')
        .replaceAll('href=', 'class="category__item" href=');
    }

    function addImgToElements(elem) {
      [...elem.children].forEach(el => {
        const id = el.search.split('=').pop();
        el.style.backgroundImage = `url(/i/gn_res/${id}.png)`;
      });
    }

    function getResourcesHTML(elem) {
      return [...elem.children]
        .filter(el => el.tagName === 'A' && el.search.includes('&type'))
        .map(link => {
          const {src, title} = link.firstElementChild;
          const attrs = [
            'class="category__item"',
            `href="${AUC_PATH + link.search}"`,
            `style="background-image: url(${src})"`,
          ];
          return `<a ${attrs.join(' ')}>${title}</a>`;
        }).join('');
    }

    return {
      __init__() {
        let layout = '';
        const hwmElem = $('td.wblight[valign]');
        const hwm_elems = $$('[id^="mark_"]:not([id*="_info_"])', hwmElem);
        subLayouts.res = getResourcesHTML(hwmElem);

        attempt($('a[href*="?cat=my&"]', hwmElem), el => {
          const len = (el.textContent.match(/\d/) || '')[0];

          if (!len) return;

          layout += this.createCategoryTemplate({
            id: 'my',
            name: 'Ваши товары',
            test: true,
            len
          });
        });

        layout += this.createCategoryTemplate({
          id: 'res',
          name: 'Ресурсы',
          len: hwmElem.firstElementChild.textContent.slice(9, -1)
        });

        hwm_elems.forEach(el => {
          const id = el.id.slice(5);
          const first = el.firstElementChild;
          const name = first.textContent;
          const len = (el.textContent.match(/\((\d+)/) || ['', ''])[1];
          const test = el.childElementCount === 2;
          const script = el.nextElementSibling.nextElementSibling;

          subLayouts[id] = script.textContent;
          layout += this.createCategoryTemplate({id, name, len, test});
        });

        if (!$('a[href="auction_new_lot.php"]', hwmElem)) {
          $('#new-lot').textContent = 'Рынок не построен';
        }

        target.addEventListener('click', onHandleClick.bind(this));

        hwmElem.remove();
        target.innerHTML = layout;

        attempt($('#cat-res', target), el1 => {
          attempt($('#cat-elements', target), el2 => el1.after(el2));
        });
      },
      isArtsCategory(id) {
        const reg = /(?:share|cert|dom|elements|res)$/;
        return !reg.test(id);
      },
      createCategoryTemplate({id, name, len, test}) {
        let attrsRaw = 'class="category__all"';
        if (test) attrsRaw += ` href="${AUC_PATH}?cat=${id}"`;

        const tag = test ? 'a' : 'span';
        const all = len && `<${tag} ${attrsRaw}>${len}</${tag}> `;

        return /*html*/`
          <div class="category" id="cat-${id}">
            <h4 class="category__heading">${all + name}</h4>
            <div class="category__items"></div>
          </div>
        `;
      },
      colorizeSetArts(elem) {
        [...elem.children].forEach(el => {
          const id = el.search.split('=').pop();
          allSetArts.includes(id) && el.classList.add('c-set');
          addImageToArt(el);
        });
      }
    };
  })($('#categories'));

  const search = ((target) => {
    let selectedElem = null;
    const listElem = target.nextElementSibling;
    const searchTypeBtn = listElem.nextElementSibling;
    const resetBtn = searchTypeBtn.nextElementSibling;

    const letters = {
      "`": "ё",
      "q": "й",
      "w": "ц",
      "e": "у",
      "r": "к",
      "t": "е",
      "y": "н",
      "u": "г",
      "i": "ш",
      "o": "щ",
      "p": "з",
      "[": "х",
      "]": "ъ",
      "a": "ф",
      "s": "ы",
      "d": "в",
      "f": "а",
      "g": "п",
      "h": "р",
      "j": "о",
      "k": "л",
      "l": "д",
      ";": "ж",
      "'": "э",
      "z": "я",
      "x": "ч",
      "c": "с",
      "v": "м",
      "b": "и",
      "n": "т",
      "m": "ь",
      ",": "б",
      ".": "ю",
    };

    if (!('scrollIntoViewIfNeeded' in Element.prototype)) {
      const proto = Element.prototype;
      proto.scrollIntoViewIfNeeded = proto.scrollIntoView;
    }

    function selectSibling(isDirNext) {
      if (!selectedElem) {
        const prop = isDirNext ? 'lastElementChild' : 'firstElementChild';
        selectedElem = listElem[prop];
      }

      const sibling = getSibling(isDirNext);
      selectedElem.removeAttribute('id');
      selectedElem = sibling;
      sibling.id = 'select-link';
      sibling.scrollIntoViewIfNeeded(false);
      target.value = sibling.textContent;
    }

    function getSibling(isDirNext) {
      return isDirNext
        ? selectedElem.nextElementSibling || listElem.firstElementChild
        : selectedElem.previousElementSibling || listElem.lastElementChild;
    }

    function getElemes(val) {
      val = [...val].map(x => letters[x] || x).join('');
      const method = ['startsWith', 'includes'][+userData.extSearch];
      const lower = str => str.toLowerCase();
      return artsSelect.arts.filter(el => lower(el.textContent)[method](val));
    }

    function render() {
      const val = target.value.trim();
      resetBtn.classList.toggle('__shown', !!val);
      listElem.innerHTML = '';
      selectedElem = null;
      val && this.fill(val.toLowerCase());
    }

    return {
      __init__() {
        render = render.bind(this);

        searchTypeBtn.addEventListener('click', () => {
          userData.update(
            'extSearch',
            searchTypeBtn.classList.toggle('__active')
          );

          if (target.value) render();
        });

        resetBtn.addEventListener('click', () => {
          this.clear();
          target.focus();
        });

        target.addEventListener('wheel', (e) => {
          if (!listElem.childElementCount) return;
          selectSibling(e.deltaY > 0);
        });

        target.addEventListener('keydown', (e) => {
          if (e.altKey && e.code === 'KeyS') {
            e.preventDefault();
            e.stopPropagation();
            searchTypeBtn.click();
            return target.focus();
          }

          const allowedKeys = ['ArrowDown', 'ArrowUp', 'Escape', 'Enter'];
          const index = allowedKeys.indexOf(e.key);

          if (!~index) return;
          if (index === 2) return resetBtn.click();

          e.stopPropagation();

          if (index < 2) {
            if (!listElem.childElementCount) return;
            e.preventDefault();
            selectSibling(!index);
            return;
          }

          if (selectedElem) {
            selectedElem.click();
            resetBtn.click();
          }
        });

        target.addEventListener('input', debounce(render, 400));
      },
      fill(val) {
        const elems = getElemes(val);
        const isImgNeeded = !(elems.length && artsSelect.hasImages);

        elems.forEach(el => {
          el = el.cloneNode(true);
          isImgNeeded && addImageToArt(el);
          listElem.appendChild(el);
        });
      },
      clear() {
        resetBtn.classList.remove('__shown');
        listElem.innerHTML = target.value = '';
        selectedElem = null;
      }
    };
  })($('#search'));

  const faves = ((target) => {
    const myFaves = userData.faves;
    const [switcher, button, listElem] = target.children;
    const inputElem = target.lastElementChild.firstElementChild;
    const getLength = () => Object.keys(myFaves).length;

    return {
      __init__() {
        target.addEventListener('click', (e) => {
          const trg = e.target;
          const action = trg.dataset.faveAction || trg.id.slice(6);
          return this[action] && this[action](e);
        });

        inputElem.addEventListener('keydown', ({key}) => {
          if (key === 'Enter') this.add();
          else if (key === 'Escape') this.toggle();
        });

        if (!getLength()) return;

        const entries = Object.entries(myFaves);
        const items = entries.map(entry => this.create(...entry));
        listElem.append(...items);
      },
      create(search, name) {
        const href = AUC_PATH + search;
        const item = parseNode(/*html*/`
          <a class="a-link a-list__item fave-item" href="${href}">
            ${name}
            <span data-fave-action="remove">&times;</span>
          </a>
        `);

        const id = search.split('=').pop();
        allSetArts.includes(id) && item.classList.add('c-set');
        addImageToArt(item);

        return item;
      },
      toggle() {
        if (!switcher.classList.toggle('__active')) return;

        attempt($(`a[href="${AUC_PATH + location.search}"]`), link => {
          const text = link.matches('.category__all')
            ? link.nextSibling.data
            : link.textContent.match(/[^(]+/)[0];

          inputElem.value = text.trim();
          inputElem.focus();
        });
      },
      add() {
        const {search} = location;
        const name = inputElem.value.trim() || `лот #${getLength() + 1}`;

        if (search in myFaves) {
          return Alert.warn('Такой лот уже есть в списке!');
        }

        myFaves[search] = name;
        userData.update();
        listElem.append(this.create(search, name));
        this.toggle();
        button.classList.remove('__none');
      },
      remove(e) {
        e.preventDefault();
        e.stopPropagation();

        const item = e.target.parentNode;

        delete myFaves[item.search];
        userData.update();
        item.remove();
        button.classList.toggle('__none', !getLength());
      }
    };
  })($('#faves-box'));

  const filters = ((target) => {
    const filtersData = userData.filters;
    const counterEl = $('#filters-counter');
    const actives = target.getElementsByClassName('__active');

    return {
      __init__() {
        target.addEventListener('click', ({target: trg}) => {
          if (trg.id === 'filters-remove') return this.clear();

          const params = trg.dataset.filter;

          if (!params) return;

          const [key, value] = params.split('=');
          const isActive = trg.classList.toggle('__active');
          filtersData[key] = isActive ? +value : null;

          const nodes = [...trg.parentNode.children];
          const sibling = nodes[nodes.indexOf(trg) ^ 1];
          sibling.classList.remove('__active');

          this.update();
        });
      },
      partial(test) {
        return target.classList.toggle('__partial', test);
      },
      disable(test) {
        return target.classList.toggle('__disabled', test);
      },
      clear() {
        [...actives].forEach(el => el.classList.remove('__active'));
        for (const key in filtersData) filtersData[key] = null;
        this.update();
      },
      update() {
        userData.update();
        form.minimize(true);
        lotsBox.appendAll(filterLots());
        counterEl.textContent = actives.length;
      }
    };
  })($('#filters-box'));

  const sort = ((target) => {
    const compare = {
      string: (a, b) => a < b ? -1 : +(a > b),
      number: (a, b) => a - b,
    };

    return {
      __init__() {
        target.addEventListener('click', ({target: trg}) => {
          const sortBy = trg.dataset.sort;
          if (!sortBy) return;

          [...target.children].forEach(el => {
            el !== trg && el.removeAttribute('data-order');
          });

          lotsBox.target.dataset.order = (trg.dataset.order ^= 1);
          userData.update('order', trg.dataset.order);

          if (userData.sort === sortBy) return;

          this[sortBy]();
          userData.update('sort', sortBy);
          lotsBox.appendAll(filterLots());
        });
      },
      byName() {
        allLots.sort((a, b) => compare.string(a.name, b.name));
      },
      byType() {
        const get = (that) => that.once ? 1e3 : ~~that.betAmount;
        allLots.sort((a, b) => compare.number(get(a), get(b)));
      },
      byCost() {
        allLots.sort((a, b) => compare.number(a.cost, b.cost));
      },
      byTime() {
        allLots.sort((a, b) => compare.number(a.time[1], b.time[1]));
      },
      byOwner() {
        const get = (that) => that.owner[0].toLowerCase();
        allLots.sort((a, b) => compare.string(get(a), get(b)));
      }
    };
  })($('#sorts'));

  const artInfo = ((target) => {
    let isVisible = false;

    const cache = {};
    const artKeyPropName = '__artKey';
    const setCSS = target.style.setProperty.bind(target.style);

    async function onMouseOver({target: trg}) {
      const key = trg.hasOwnProperty(artKeyPropName)
        ? trg[artKeyPropName]
        : getArtKey(trg);

      if (!key) return isVisible && this.toggle(false);

      const self = this;
      let isDisplayNeeded = true;

      trg.addEventListener('mouseleave', function leave(e) {
        this.removeEventListener(e.type, leave);
        isDisplayNeeded = false;
        isVisible && self.toggle(false);
      });

      const html = cache[key] || await setArtHTML(key).catch(setNoAccess);

      if (!(isDisplayNeeded && html)) return;

      target.innerHTML = html;
      this.setPos(...this.getPos(trg));
      this.toggle(true);
    }

    function getArtKey(el) {
      if (el.tagName !== 'A') return setArtKey(el);
      if (el.pathname !== '/art_info.php') return setArtKey(el);
      return setArtKey(el, el.search.match(/id=([^&]+)/)[1]);
    }

    function setArtKey(el, key = null) {
      return el[artKeyPropName] = key;
    }

    async function setArtHTML(id) {
      const doc = await fetch.get(`/art_info.php?id=${id}`);
      return (cache[id] = $('#set_mobile_max_width', doc).innerHTML);
    }

    function getArtPos(el) {
      const {top, bottom, right} = el.getBoundingClientRect();
      const h = target.offsetHeight;
      const y = bottom + h + 2 > view.innerHeight ? Math.abs(top - h) : bottom;
      return [~~right, ~~y];
    }

    return {
      __init__() {
        onMouseOver = onMouseOver.bind(this);
        aucElem.addEventListener('mouseover', debounce(onMouseOver, 350));
        target.addEventListener('mouseover', (e) => e.stopPropagation());
      },
      getPos(elem) {
        return getArtPos(elem);
      },
      setPos(x, y) {
        setCSS('--x', `${x}px`);
        setCSS('--y', `${y}px`);
      },
      toggle(force) {
        isVisible = force;
        target.classList.toggle('__shown', isVisible);
      }
    };
  })($('#art-info'));

  const form = ((target) => {
    const lotElem = $('#form__lot');
    const input = $('#form__input');
    const submitBtn = $('#form__submit');

    let lotSaleLabel = '';
    const calcSaleLabel = (id) => new Function('id', `return ${lotSaleLabel}`)(id);

    const keyframesData = {
      outlineColor: ['transparent', 'currentColor']
    };

    let inputAnimation = {
      play: Function.prototype,
      effect: { setKeyframes: Function.prototype }
    };

    if (view.Animation && view.KeyframeEffect) {
      inputAnimation = new Animation(new KeyframeEffect(
        input,
        keyframesData,
        { duration: 250, direction: 'alternate', easing: 'ease', iterations: 4 }
      ));
    }

    const getMin = (lot, calc) => {
      const val = !lot.betAmount ? lot.cost : calc(lot.myBet || lot.cost);
      return lot.cat === 'res' ? Math.min(val, getResMax(lot)) : val;
    };

    const getMax = (lot) => {
      const val = lot.cat === 'res' ? getResMax(lot) : lot.blitz || Infinity;
      return Math.min(val, player.gold);
    };

    const getResMax = (lot) => {
      const val = lot.key < 3 ? 180 : 360;
      return val + val * 0.20;
    };

    async function submitLot(lot) {
      const hwm_form = aucHwmForm.target;

      attempt($('a[onclick]', hwm_form), el => {
        lot.once ? el.click() : evalScript(el.nextElementSibling);
        el.remove();
      });

      const hwm_input = $('input[type="text"]', hwm_form);
      hwm_input.value = ~~input.value;

      if (lot.once) {
        const hwm_btn = $('input[type="submit"]', hwm_form);
        hwm_btn.dispatchEvent(new MouseEvent('mousedown'));

        const rnd = 54 + Math.random() * 54 >> 0;
        await new Promise(resolve => setTimeout(resolve, rnd));

        hwm_btn.dispatchEvent(new MouseEvent('mouseup'));
        $(`#buy_num${lot.id}`, hwm_form).value = calcSaleLabel(+lot.id);
      }

      const res = await send(hwm_form);
      return res && result.call(this, lot, res);
    }

    function evalScript({text}) {
      new Function(text.match(/\{([^}]+)/)[1])();
    }

    async function send(hwm_form) {
      const entry = [hwm_form.action, new FormData(hwm_form)];
      const doc = await fetch.post(...entry).catch(() => ({ URL: '' }));

      if (!doc.URL.includes('auction')) return setNoAccess();

      const elem = $('.wbwhite center', doc);
      const text = elem.textContent;

      const textParts = ['null', 'Куплен', 'Вы лидер', 'ные данные', 'слишком мала', 'Минимальная ставка', 'закончены', 'Вы не можете', ' не меньше!', 'Некорректн'];
      const textTypes = ['usual', 'success', 'success', 'error', 'error', 'error', 'error', 'error', 'error', 'error'];

      const ind = textParts.findIndex(part => text.includes(part));
      const type = textTypes[~ind && ind];

      return {type, text};
    }

    function result(lot, {type, text}) {
      const isWrongData = lot.once && text.includes('ные данные');

      if (isWrongData) {
        if (!wrongDataState) return repeatRequest.call(this, lot);

        return Alert.error(`${text}\nТребуется перезагрузка страницы!`, {
          isFinite: false,
          onDestroy: () => location.reload()
        });
      }

      Alert.print(type, text);

      wrongDataState = false;
      this.disable(false);
      aucClassList.remove('__unallowed');

      keyframesData.outlineColor[1] = type === 'error' ? '#f44336' : '#4caf50';
      inputAnimation.effect.setKeyframes(keyframesData);
      inputAnimation.play();

      if (!lot.once && !/Минимальная ставка|закончены/.test(text)) {
        lot.increaseBetAmount();
      }

      if (type === 'success') return ok.call(this, lot);

      const newCost = text.includes('Минимальная ставка')
        ? +text.match(/\d+$/)[0]
        : /слишком мала| не меньше!/.test(text)
        ? this.getMinBet(+input.value)
        : 0;

      if (newCost) return this.updateCost(lot, newCost);

      input.focus();
    }

    let wrongDataState = false;

    async function repeatRequest(lot) {
      wrongDataState = true;
      aucHwmForm.target.name = '@';
      Alert.warn('Trying second request...');
      this.submit(lot);
    }

    function ok(lot) {
      if (lot.cat === 'res') resources.refresh(lot.resName, +input.value);

      lot.refresh();
      this.refreshByLot(lot);

      if (lot.once) return;

      bets.add(lot);
      updateCostFromProtocol.call(this, lot);
    }

    async function updateCostFromProtocol(lot) {
      const url = `/auction_lot_protocol.php?id=${lot.id}&crc=${lot.crc}`;
      const doc = await fetch.get(url).catch(() => ({ URL: '' }));

      if (!doc.URL.includes('auction')) return setNoAccess();

      const elem = $('a.pi + b', doc);
      return elem && this.updateCost(lot, ~~elem.textContent);
    }

    return {
      __init__() {
        input.addEventListener('input', onInput);

        function onInput(e) {
          const {value, max} = input;
          const min = e.type === 'wheel' ? +input.min : 0;
          input.value = Math.max(min, Math.min(~~value, +max));
        }

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') return activeLot.target.click();
          if (e.key === 'Enter') {
            e.stopPropagation();
            return submitBtn.click();
          }
        });

        input.addEventListener('wheel', (e) => {
          const factor = e.shiftKey ? 10 : e.ctrlKey ? 100 : e.altKey ? 1e3 : 1;
          const step = (e.deltaY > 0 ? -1 : 1) * factor;

          e.preventDefault();
          input.value = step + ~~input.value;
          onInput(e);
        });

        submitBtn.addEventListener('click', (e) => {
          e.stopPropagation();

          if (!input.checkValidity()) {
            return Alert.error('Некорректное значение ввода!');
          }

          this.disable(true);
          this.submit(findLot('id', lotElem.dataset.id));
        });
      },
      lotElem,
      minimize(test) {
        if (test && activeLot) {
          activeLot.target.classList.remove('__active');
          activeLot = null;
        }

        return target.classList.toggle('__minimized', test);
      },
      disable(test) {
        submitBtn.disabled = test;
        submitBtn.classList.toggle('__sending', test);
      },
      refreshByLot(lot, value = 0) {
        if (this.minimize(!!lot.completed)) return;

        const {once, target} = lot;
        const label = input.previousSibling;
        const btnText = once ? 'Купить лот' : 'Сделать ставку';

        lotElem.style = target.style.cssText;
        lotElem.innerHTML = target.innerHTML;
        Object.assign(lotElem.dataset, target.dataset);

        submitBtn.disabled = input.disabled = player.gold < lot.cost;
        submitBtn.innerHTML = `<span>${btnText}</span>`;
        label.data = input.placeholder = once ? 'Кол-во' : 'Ставка';

        input.min = once ? 1 : getMin(lot, this.getMinBet);
        input.max = once ? lot.amount : getMax(lot);
        input.value = Math.min(input.max, Math.max(input.min, value));

        if (!input.disabled) input.focus();
      },
      async submit(lot) {
        if (aucHwmForm.name.endsWith(lot.id)) return submitLot.call(this, lot);

        const hwm_form = await lot.getRemoteHwmForm();

        if (hwm_form === 0) return;

        if (hwm_form) {
          if (lot.once) {
            const elem = hwm_form.closest('table.wb').parentNode;
            lotSaleLabel = elem.textContent.match(/\({4}[^;]+/)[0];
          }

          aucHwmForm.replace(importNode(hwm_form));
          return submitLot.call(this, lot);
        }

        Alert.error('Лот уже продан или завершен по тайм-ауту');
        this.disable(false);
        lot.complete();
      },
      updateCost(lot, bet) {
        lot.cost = bet;
        $('._cost .gold', lot.target).textContent = formatNum(bet);
        this.refreshByLot(lot);
      },
      getMinBet(bet) {
        const step = Math.round(bet * 0.01);
        return bet + Math.max(3, step);
      },
      get inputValue() {
        return input.value;
      }
    };
  })($('#form'));

  const bets = ((target) => {
    let visibilityState = 0;
    const tempStack = [];
    const stack = new Map;
    const myBets = userData.bets;

    async function init(keys) {
      keys = keys.filter(id => !stack.has(id));
      visibilityState = 1;
      step1();

      if (!keys.length) return stepIn();

      setLoadState(1);

      const expired = [];

      while (keys.length) {
        let promises = keys.splice(0, 5).map(pullBetsFromServer);

        await Promise.all(promises).catch(() => {
          keys.splice(0);
          setNoAccess();
        });
      }

      async function pullBetsFromServer(id) {
        const [search, isExpired] = getBetValues(id);

        if (isExpired) return expired.push(id);

        const doc = await fetch.get(getAucURL(search));

        if (!doc.URL.includes(AUC_PATH)) return setNoAccess();

        const form = $(`form[name$="${id}"]`, doc);

        if (!form) return expired.push(id);

        const cat = (doc.URL.match(/cat=(\w+)/) || [0, 'my'])[1];
        stack.set(id, createNewLot(form.closest('tr.wb'), cat));
      }

      expired.forEach(id => delete myBets[id]);
      target.dataset.counter = Object.keys(myBets).length;
      expired.length && userData.update();
      setLoadState(0);
      stepIn();
    }

    function getBetValues(id) {
      const data = myBets[id];
      const isArray = typeof data !== 'string';
      return isArray ? [data[0], Date.now() >= data[1]] : [data, false];
    }

    function step1() {
      timers.clear();
      target.classList.add('__active');
      filters.disable(true);
      form.minimize(true);
      tempStack.splice(0, Infinity, ...allLots.splice(0));
    }

    function step2(lots) {
      allLots.push(...lots);
      sort[userData.sort]();
      lotsBox.appendAll(filterLots());
      timers.switchTimers();
    }

    function stepIn() {
      const nowTime = Date.now();
      const lots = [];

      [...stack.values()].forEach(lot => {
        const i = tempStack.findIndex(({id}) => id === lot.id);

        if (~i) {
          lot = tempStack[i];
          stack.set(lot.id, lot);
        }

        if (lot.completed || nowTime >= lot.time[1]) {
          bets.remove(lot);
          return ~i && tempStack.splice(i, 1);
        }

        lots.push(lot);
      });

      step2(lots);
    }

    function stepOut() {
      const nowTime = Date.now();
      const lots = tempStack.splice(0).filter(lot => {
        return !(lot.completed || nowTime >= lot.time[1]);
      });

      step2(lots);
    }

    function close() {
      this.hide();
      activeLot && form.minimize(true);

      const {cat} = searchParams;
      const stuffCats = ['res', 'elements', 'part', 'dom', 'cert', 'obj_share'];
      filters.partial(stuffCats.includes(cat));
      filters.disable(['my', 'obj_share'].includes(cat));

      allLots.splice(0);
      stepOut();
    }

    return {
      __init__() {
        target.addEventListener('click', async function handler(e) {
          e.stopPropagation();

          const keys = Object.keys(myBets);

          if (!keys.length) {
            Alert.log('Зарегистрированных ставок не найдено');
            return;
          }

          this.removeEventListener(e.type, handler);

          await init(keys);

          this.addEventListener(e.type, onHandleClick);
        });

        const onHandleClick = (e) => {
          e.stopPropagation();

          if (!(visibilityState ^= 1)) return close.call(this);

          step1();
          stepIn();
        };

        const keys = Object.keys(myBets);

        const extracts = keys.filter(id => {
          if (!getBetValues(id)[1]) return true;
          delete myBets[id];
        });

        target.dataset.counter = extracts.length;

        if (keys.length !== extracts.length) userData.update();
      },
      createIconTpl() {
        const title = 'Отслеживается в ставках';
        return `<span class="i-watch" title="${title}">👁</span>`;
      },
      has(id) {
        return myBets.hasOwnProperty(id);
      },
      add(lot) {
        if (this.has(lot.id)) return;

        myBets[lot.id] = [lot.search, lot.time[1]];
        stack.set(lot.id, lot);
        userData.update();
        target.dataset.counter++;

        attempt($('.lot__bet-amount', lot.target), el => {
          el.before(parseNode(this.createIconTpl()));
        });
      },
      remove(lot) {
        if (!this.has(lot.id)) return;

        delete myBets[lot.id];
        stack.delete(lot.id);
        userData.update();
        target.dataset.counter--;

        const isConnected = !!lot.target.offsetWidth;
        isConnected && attempt($('.i-watch', lot.target), el => el.remove());

        if (!visibilityState) return;

        lot.isActive && form.minimize(true);
        isConnected && lot.target.remove();
      },
      hide() {
        visibilityState = 0;
        target.classList.remove('__active');
      },
      get shown() {
        return !!visibilityState;
      }
    };
  })($('#mybets-btn'));

  const contextmenu = ((target) => {
    let lotElem = null;
    let activeLine = null;

    const commands = [
      ['select', 'Купить лот', 'ЛКМ'],
      ['reload', 'Обновить лот', 'Shift + R'],
      ['reloadAll', 'Обновить все'],
      ['goto', 'Перейти на страницу лота'],
      ['addBet', '«Мои ставки»: добавить'],
      ['console', 'Показать в консоли'],
    ];

    function cmd(action, text, key = '') {
      if (!action) return '';

      const attrs = [
        'class="contextmenu__item"',
        `data-action="${action}"`,
        `data-key="${key}"`,
      ];

      return `<div ${attrs.join(' ')}>${text}</div>`;
    }

    function onKeyDown(e) {
      const {key} = e;

      e.preventDefault();
      e.stopPropagation();

      if (e.altKey || key === 'Escape') return close();
      if (key === 'Home') return setActiveLine(target.firstElementChild);
      if (key === 'End') return setActiveLine(target.lastElementChild);
      if (key === 'Enter' && activeLine) return activeLine.click();

      const match = /^(Arrow|Page)(Up|Down)$/.exec(key);
      if (match) return activeNextLine(match[2] === 'Down');
    }

    function onMouseMove(e) {
      const trg = e.target;

      if (trg === this) return;

      e.stopPropagation();

      if (trg !== activeLine) setActiveLine(trg);
    }

    function onMouseMove2(e) {
      if (!activeLine) return;

      activeLine.classList.remove('__active');
      activeLine = null;
    }

    function onWheel(e) {
      if (!e.target.closest(`#${target.id}`)) close();
    }

    function close() {
      this.hide();
    }

    function activeNextLine(isDirNext) {
      const props = isDirNext
        ? ['nextElementSibling', 'firstElementChild']
        : ['previousElementSibling', 'lastElementChild'];

      setActiveLine(activeLine && activeLine[props[0]] || target[props[1]]);
    }

    function setActiveLine(elem) {
      activeLine && activeLine.classList.remove('__active');
      elem.classList.add('__active');
      activeLine = elem;
    }

    function getContent({id, once, cat, search}) {
      const isBetExist = !once && bets.has(id);
      const isBetsOpen = bets.shown;

      commands[0][1] = once ? 'Купить лот' : 'Сделать ставку';
      commands[2][0] = isBetsOpen ? 'reloadAll' : '';
      commands[3][0] = (cat === 'my' || search === location.search) ? '' : 'goto';
      commands[4][0] = once ? '' : !isBetExist ? 'addBet' : 'removeBet';
      commands[4][1] = once ? '' : !isBetExist
        ? '«Мои ставки»: добавить'
        : ['Удалить', '«Мои ставки»: удалить'][isBetsOpen ^ 1];

      return commands.map(arr => cmd(...arr)).join('');
    }

    return {
      __init__() {
        close = close.bind(this);

        target.addEventListener('keydown', onKeyDown);
        target.addEventListener('mousemove', onMouseMove);
        target.addEventListener('contextmenu', (e) => e.preventDefault());

        lotsBox.target.addEventListener('contextmenu', (e) => {
          e.stopPropagation();

          if (e.target.tagName === 'A') return;

          e.preventDefault();

          lotElem = e.target.closest('.lot');
          if (lotElem) this.show(e, findLot('target', lotElem));
        });

        target.addEventListener('click', (e) => {
          e.stopPropagation();

          const {action} = e.target.dataset;
          if (!action) return;

          const lot = lotElem && findLot('id', lotElem.dataset.id);
          if (!lot) return;

          this.hide();

          switch (action) {
            case 'select':
              lot.select();
              setSortsPad();
              return;
            case 'reload': return lot.reload();
            case 'reloadAll': return allLots.forEach(lot => lot.reload());
            case 'goto': return goTo(lot.search);
            case 'console': return console.log(lot);
            case 'addBet': return bets.add(lot);
            case 'removeBet': return bets.remove(lot);
          }
        });
      },
      hide() {
        activeLine = null;
        target.innerHTML = '';

        if (lotElem) {
          lotElem.classList.remove('__hovered');
          lotElem = null;
        }

        aucClassList.remove('contextmenu-is-shown');
        target.removeEventListener('blur', close);
        document.removeEventListener('wheel', onWheel);
        document.removeEventListener('mousemove', onMouseMove2);
      },
      show({clientX: cx, clientY: cy}, lot) {
        target.innerHTML = getContent(lot);
        lotElem.classList.add('__hovered');
        aucClassList.add('contextmenu-is-shown');
        target.addEventListener('blur', close);
        document.addEventListener('wheel', onWheel);
        document.addEventListener('mousemove', onMouseMove2);

        const w = target.offsetWidth;
        const h = target.offsetHeight;
        const x = Math.min(cx, view.innerWidth - w - 2);
        const y = cy < view.innerHeight - h - 2 ? cy : cy - h;

        target.style.setProperty('--x', `${~~x}px`);
        target.style.setProperty('--y', `${~~y}px`);
        target.focus();
      },
      get shown() {
        return !!target.offsetWidth;
      }
    };
  })($('#contextmenu'));

  // ====================

  const changelog = (() => {
    const items = [
      'Зарегистрированы новые лоты',
      'Пофиксены ошибки мобильной версии',
    ];

    const create = (item) => `<p class="changelog-item">${item}</p>`;

    return {
      items,
      toString() {
        return /*html*/`
          <div id="changelog" class="ui-scroll">
            <div class="cl-build">Build ${MODULE_VERSION}</div>
            ${items.map(create).join('')}
          </div>
        `.trim();
      }
    };
  })();

  class Alert {
    constructor(data = {}) {
      const props = this.props = {...Alert.defaultProps, ...data};
      const target = this.target = Alert.create(props);

      this.destroy = this.destroy.bind(this);
      this.onKeyDown = this.onKeyDown.bind(this);

      target.addEventListener('keydown', this.onKeyDown);
      this.closeButton.addEventListener('click', this.destroy);

      if (props.isFinite) {
        this.onAnimationEnd = this.onAnimationEnd.bind(this);
        target.addEventListener('animationend', this.onAnimationEnd);
      }
    }

    static __init__() {
      this.stack = new Set;
      this.container = $('#notices', aucElem);
      this.startMessages = isOldVersion ? [] : [changelog];

      this.defaultProps = {
        type: 'usual',
        message: '...',
        isFinite: true,
        onCreate: Function.prototype,
        onDestroy: Function.prototype,
      };
    }

    static addStartMessage(msg) {
      this.startMessages.push(msg);
    }

    static showStartMessages() {
      this.startMessages.forEach(msg => this.log(msg));
    }

    static create({type, message, isFinite}) {
      const classes = ['user-alert', `__${type}`];
      isFinite && classes.push('__finite');

      return parseNode(/*html*/`
        <div class="${classes.join(' ')}" tabindex="-1">
          <button class="user-alert__close">&times;</button>
          <div class="user-alert__body">${message}</div>
        </div>
      `);
    }

    static print(type, message, data = {}) {
      console.log(message);

      if (message === changelog) {
        type = 'changelog';
        data.isFinite = false;
      }

      new this({...data, type, message}).show();
    }

    static log() {
      return this.print('usual', ...arguments);
    }

    static warn() {
      return this.print('warn', ...arguments);
    }

    static error() {
      return this.print('error', ...arguments);
    }

    static ok() {
      return this.print('success', ...arguments);
    }

    static get lastItem() {
      return [...this.stack].pop();
    }

    get closeButton() {
      return this.target.firstElementChild;
    }

    show() {
      if (!Alert.lastActiveElement) {
        Alert.lastActiveElement = document.activeElement || document.body;
      }

      Alert.stack.add(this);
      Alert.container.prepend(this.target);
      this.target.focus();
      this.props.onCreate(this);
    }

    destroy() {
      if (!Alert.stack.delete(this)) return;

      const {target} = this;

      this.closeButton.removeEventListener('click', this.destroy);
      target.removeEventListener('animationend', this.onAnimationEnd);
      target.removeEventListener('keydown', this.onKeyDown);
      target.remove();

      if (Alert.stack.size) Alert.lastItem.target.focus();
      else if (Alert.lastActiveElement) {
        Alert.lastActiveElement.focus();
        Alert.lastActiveElement = null;
      }

      this.props.onDestroy(this);
    }

    onKeyDown(e) {
      if (e.key !== 'Escape') return;
      this.destroy();
    }

    onAnimationEnd(e) {
      if (e.animationName !== 'userAlertProcessing') return;
      this.destroy();
    }

    toString() {
      return this.props.message;
    }
  }

  Alert.__init__();

  // ====================

  view.addEventListener('offline', function() {
    isOnLine = false;
    aucClassList.add('__unallowed', '__disconnected');

    Alert.error('Потеряно соединение с интернетом', {
      isFinite: false,
      onCreate: (that) => {
        this.addEventListener('online', onOnline.bind(that), { once: true });
      }
    });

    function onOnline() {
      isOnLine = true;
      this.destroy();
      setLoadState(0);
      form.disable(false);
      aucClassList.remove('__unallowed', '__disconnected');
      Alert.ok('Соединение восстановлено');
    }
  });

  document.addEventListener('keydown', (e) => {
    const {code, ctrlKey} = e;

    e.stopPropagation();

    if (!ctrlKey && code === 'F5') {
      e.preventDefault();
      loadPage();
      return;
    }

    if (code === 'Escape') return artInfo.toggle(false);

    if (ctrlKey && code === 'Slash') return $('#search').focus();

    if (e.shiftKey && code === 'KeyR') {
      const lot = lotsBox.selectedLot || findLot('isActive', true);
      if (lot) lot.reload();
    }
  });

  aucElem.addEventListener('click', (e) => {
    const link = e.ctrlKey ? null : e.target.closest('a');
    if (!(link && link.pathname === AUC_PATH)) return;

    e.preventDefault();
    e.stopPropagation();
    goTo(link.search);
  });

  // ====================

  resources.__init__();
  player.__init__();
  artsSelect.__init__();
  setArtsSelect.__init__();
  categories.__init__();
  search.__init__();
  faves.__init__();
  bets.__init__();
  filters.__init__();
  sort.__init__();
  artInfo.__init__();
  form.__init__();
  lotsBox.__init__();
  contextmenu.__init__();

  // ==================== [[ MOBILE ]]

  view.onscroll = null;
  view.onorientationchange = null;
  view.onresize = null;
  // document.body.removeEventListener('touchend', android_touch_end);
  // document.body.removeEventListener('touchmove', android_touch_move);

  // ====================

  let popStateTimerId = 0;

  view.onpopstate = (e) => {
    clearTimeout(popStateTimerId);
    if (location.pathname !== AUC_PATH) return;

    e.stopImmediatePropagation();
    popStateTimerId = setTimeout(loadPage, 350);
  };

  const newBody = document.createElement('body');
  newBody.className = 'root';
  newBody.append(aucHwmForm.target, aucElem);
  document.body.replaceWith(newBody);
  Alert.showStartMessages();
  loadPage();

  modules.add(MODULE_NAME, MODULE_VERSION);
})(document.defaultView);