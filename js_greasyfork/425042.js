// ==UserScript==
// @name            HWM_auction_new_lot
// @author          Мифист
// @namespace       Мифист
// @version         2.1.2
// @description     Удобное создание лота на рынке
// @match           https://www.heroeswm.ru/auction_new_lot.php*
// @match           https://*.lordswm.com/auction_new_lot.php*
// @run-at          document-end
// @grant           none
// @license         MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/425042/HWM_auction_new_lot.user.js
// @updateURL https://update.greasyfork.org/scripts/425042/HWM_auction_new_lot.meta.js
// ==/UserScript==

(async function initModule(view) {
  'use strict';

  if (document.visibilityState === 'hidden') {
    const handler = () => initModule(view);
    document.addEventListener('visibilitychange', handler, { once: true });
    return;
  }

  // ====================

  const PATH = location.pathname;

  const allArtsData = {
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

  // ==================== [[ UTILS ]]

  const $ = (selector, ctx = document) => ctx.querySelector(selector);
  const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];
  const formatNum = (num) => num.toLocaleString('en');

  function parseNode(html, callback) {
    let elem = document.createElement('div');
    elem.innerHTML = html;
    elem = elem.firstElementChild.cloneNode(true);
    callback && callback.call(elem, elem);
    return elem;
  }

  function fetch({ url, method = 'GET', type = 'document', body = null }) {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.responseType = type;
      xhr.onload = () => resolve(xhr.response);
      xhr.send(body);
    });
  }

  fetch.get = (url) => fetch({ url });
  fetch.post = (url, data) => fetch({ url, method: 'POST', body: data });

  // ==================== [[ CSS ]]

  parseNode('<style></style>', function() {
    this.append(/*css*/`
      @charset "utf-8";

      #hwm_no_zoom {
        display: none !important;
      }
      .container {
        font-family: Verdana, Arial, sans-serif;
        font-size: 14px;
        min-width: 420px;
        max-width: 1200px;
        position: relative;
        margin: 1em auto;
        padding: 1em;
        text-align: left;
        color: #592c08;
        overflow: hidden;
        user-select: none;
        box-sizing: border-box;
      }
      main *,
      main *::before,
      main *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      main input,
      main button {
        font: inherit;
        color: inherit;
        outline: none;
      }

      /* section */

      .section {
        width: 49%;
        max-width: 38em;
        position: relative;
        float: right;
        background-color: #e4e4e4;
        outline: 2px solid #aaa;
        outline-offset: 1px;
      }
      .section:first-child {
        float: left;
        z-index: 2;
      }
      .section[disabled],
      [data-state~="locked"] .section {
        filter: grayscale(.8);
        pointer-events: none;
      }
      .section__heading {
        font-size: 1.2em;
        font-weight: bold;
        line-height: 3.5;
        position: relative;
        margin-bottom: 1px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 1px;
        background-color: white;
        border: 1px solid #ccc;
        overflow: hidden;
      }
      .section__heading::before,
      .section__heading::after {
        content: "—";
        font-weight: normal;
        padding: 0 .6em;
        opacity: .6;
      }

      /* block */

      .block {
        counter-reset: options;
        max-height: 3em;
        position: relative;
        margin-bottom: 1px;
        border: 1px solid #ccc;
        overflow: hidden;
        transition: max-height .4s;
      }
      .block:last-child {
        margin-bottom: 0;
      }
      .block[data-shown="1"] {
        max-height: 25em;
      }
      .block-res[data-shown="1"] {
        max-height: 10em;
      }
      .block-elements[data-shown="1"] {
        max-height: 17em;
      }
      .block::after {
        content: "[" counter(options) "]";
        min-width: 4em;
        line-height: 3em;
        position: absolute;
        left: 0;
        top: 0;
        text-align: center;
        color: brown;
        border-right: 1px solid #bbb;
        pointer-events: none;
      }
      .block__title {
        height: 3em;
        line-height: 3em;
        padding: 0 .6em 0 4.5em;
        color: #2c5061;
        background-color: #e8e8e8;
        text-transform: uppercase;
        overflow: hidden;
        cursor: pointer;
      }
      .block__title:hover,
      [data-shown="1"] > .block__title {
        background-color: #ddd;
      }
      .block__title::after {
        content: "+";
        float: right;
      }
      [data-shown="1"] > .block__title::after {
        content: "-";
      }

      /* select */

      .select {
        display: flex;
        flex-wrap: wrap;
        max-height: 22em;
        background-color: #f6f6f6;
        outline: 1px solid #ccc;
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: thin;
      }
      .select:empty {
        display: none;
      }
      .select::-webkit-scrollbar {
        width: 6px;
        background-color: #eee;
      }
      .select::-webkit-scrollbar-thumb {
        background-color: #ccc;
      }
      .select::-webkit-scrollbar-thumb:hover {
        background-color: #aaa;
      }
      .select::-webkit-scrollbar-thumb:active {
        background-color: gray;
      }

      /* options */

      .option {
        counter-increment: options;
        flex: 1 1 50%;
        line-height: 2.2em;
        padding: 0 .4em;
        background-color: inherit;
        box-shadow: 0 0 0 1px #ccc;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .option[style] {
        text-indent: 2.5em;
        background-repeat: no-repeat;
        background-position: .4em 50%;
        background-size: 25px;
      }
      .select-res .option {
        background-size: 24px;
      }
      .select-arts .option {
        flex: 1 1 100%;
      }
      .option:hover {
        background-color: #f6efda;
      }
      .option.__selected {
        background-color: #f8e9bb;
        pointer-events: none;
      }
      .option[data-amount="0"] {
        color: gray;
        background-color: #e8e8e8;
        filter: grayscale(1);
        pointer-events: none;
      }
      .option::before {
        content: "(" attr(data-amount) ")";
        font-size: .9em;
        float: right;
        margin-left: .5em;
        color: #900;
      }

      /* form */

      .form {
        background-color: #f6f6f6;
        border: 1px solid #ccc;
      }
      .form-lot {
        width: 50px;
        height: 50px;
        position: absolute;
        left: .2em;
        top: 0;
        bottom: 0;
        margin: auto;
        background: no-repeat center / contain;
        outline: none;
      }
      .form__row {
        display: flex;
        position: relative;
        background-color: inherit;
        border-top: 1px solid #ddd;
      }
      .form__row:first-child {
        border-top: none;
      }
      .form__row:last-child {
        justify-content: flex-end;
      }
      .form__cell {
        width: 50%;
        min-height: 2.5em;
        line-height: normal;
        display: flex;
        align-items: center;
        position: relative;
        padding: 0 .5em;
        background-color: inherit;
        outline: 1px solid #ddd;
        white-space: nowrap;
      }
      .form__name {
        color: #c9870e;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .form__btn {
        position: relative;
        text-align: center;
        color: #555;
        background-color: #f3e9d1;
        border: 2px solid #999;
        border-color: #999 #666 #777 #999;
        cursor: pointer;
      }
      .form__btn:hover,
      .form__btn:focus {
        color: #753e3e;
        background-color: #eadec0;
      }
      .form__btn:active {
        left: 1px;
        top: 1px;
      }
      .form__type {
        min-width: 5em;
        padding: .2em;
        margin-left: .5em;
      }
      [data-form*="type=1"] .form__type:first-child,
      [data-form*="type=2"] .form__type:last-child {
        background-color: white;
        border-color: #2aa4d6;
        pointer-events: none;
      }
      .form__input {
        user-select: auto;
      }
      .form__input[type="range"] {
        cursor: pointer;
      }
      .form__count[max="0"],
      [data-form*="cat=parts"] .form__count {
        opacity: .7;
        filter: grayscale(.7);
        pointer-events: none;
      }
      .form__input[type="number"] {
        font-size: .9em;
        padding: 2px;
        background-color: white;
        border: 1px solid #999;
      }
      .form__input[type="number"]:hover,
      .form__input[type="number"]:focus {
        background-color: #fff9f1;
        border-color: #69a0d1;
        outline: 1px solid skyblue;
      }
      .form__input[type="number"]:invalid {
        outline: 1px solid #d54e4e;
        box-shadow: 0 0 4px #e7a4b0;
      }
      .form[data-form*="type=1"] .form__blizprice {
        color: gray;
        background-color: #ddd;
        border-color: #999;
        outline: none;
        pointer-events: none;
      }
      .form__output {
        line-height: normal;
        position: absolute;
        left: 100%;
        top: .3em;
        margin-left: 1em;
        padding: .3em;
        color: #666;
        background-color: #eee;
        outline: 2px solid #aaa;
        white-space: nowrap;
        opacity: 0;
        transition: opacity .2s;
        pointer-events: none;
        z-index: 2;
      }
      .form__output:empty,
      [data-state~="locked"] .form__output {
        visibility: hidden;
      }
      .form__input:hover + span,
      .form__input:focus + span {
        opacity: 1;
        transition-delay: .15s;
      }
      .form__input[type="number"] + span::after {
        content: "";
        width: 22px;
        height: 22px;
        margin-left: 3px;
        display: inline-block;
        vertical-align: middle;
        background: url("https://dcdn.heroeswm.ru/i/r/48/gold.png") center / cover;
      }
      .form__send {
        margin: .5em;
        padding: .5em 1em;
      }
      .container[data-state~="locked"] .form__btn {
        color: gray;
        background-color: #ddd;
        border-color: #aaa #bbb #bbb #aaa;
        pointer-events: none;
      }
      .container:not([data-state~="locked"]) .form__btn::after {
        content: "";
        position: absolute;
        top: 2px;
        right: 2px;
        bottom: 2px;
        left: 2px;
        border: 1px dashed #999;
      }

      @keyframes aucPriceLoading {
        to { background-position: -150% 0; }
      }
      .form__send.__loading::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: linear-gradient(120deg, transparent 20%, white 50%, transparent 80%);
        background-size: 150% 100%;
        background-position: 150% 0;
        animation: aucPriceLoading .7s linear infinite;
      }
      [data-form*="cat=stuff"] #auc-price-btn {
        display: none;
      }

      .parts-alert {
        display: none;
        position: absolute;
        left: 0;
        top: 1em;
        padding: 0 .5em;
        cursor: help;
        z-index: 2;
      }
      [data-form*="cat=parts"] .parts-alert {
        display: block;
      }
      .parts-alert:hover::after {
        content: "Вы продаете 20 частей, но покупатель получит только одну; 19 частей списывается как комиссия.";
        font-size: .9em;
        width: 18em;
        position: absolute;
        left: 100%;
        bottom: -.8em;
        padding: .2em .4em;
        margin-left: 1em;
        color: gray;
        background-color: white;
        outline: 2px solid #aaa;
        box-shadow: 0 0 4px;
        pointer-events: none;
      }

      /* status */

      @keyframes aucStatusSpin {
        to { transform: rotate(1turn); }
      }
      .form-status {
        font-size: 1.4em;
        font-weight: bold;
        line-height: 2.5;
        position: absolute;
        top: 0;
        bottom: 0;
        right: .4em;
        margin: auto;
        color: #519551;
        opacity: 0;
        transition: opacity 1s 1s;
      }
      [data-state~="process"] .form-status {
        width: .8em;
        height: .8em;
        border: 3px solid gray;
        border-top-color: transparent;
        border-radius: 50%;
        opacity: 1;
        transition: none;
        animation: aucStatusSpin .8s linear infinite;
      }
      [data-state="success"] .form-status::before {
        content: "✓";
      }

      /* alert */

      .alert {
        font-size: 1.1em;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(127, 127, 127, .7);
        opacity: 0;
        visibility: hidden;
        transition: opacity .4s, visibility .4s;
        z-index: 999;
      }
      .alert.__shown {
        opacity: 1;
        visibility: visible;
      }
      .alert__inner {
        max-width: 40em;
        margin: auto;
        padding: 1em;
        color: #eee;
        background-color: #444;
        border: 1px solid gray;
        border-top: none;
        box-shadow: 0 0 6px #666;
        overflow: hidden;
        transform: perspective(50em) rotateX(-40deg);
        transform-origin: 50% 0;
        transition: transform .3s ease-out;
      }
      .alert.__shown .alert__inner {
        transform: perspective(50em) rotateX(0);
      }
      .alert__content {
        line-height: 1.5;
        padding: 1em;
        margin-bottom: 1em;
        text-align: center;
        background-color: #555;
        border: 1px dashed gray;
      }
      .alert__content a {
        font: inherit;
        color: tan;
        text-decoration: underline;
      }
      .alert__content a:hover,
      .alert__content a:focus {
        color: #a4d4e7;
      }
      .alert__btn {
        float: right;
        padding: .4em 2em;
        text-align: center;
        color: #eee;
        background-color: #8a766f;
        border: 1px solid #bbb;
        outline: 1px solid #444;
        outline-offset: -3px;
        cursor: pointer;
      }
      .alert__btn:hover {
        background-color: #9e8c86;
      }
      .alert__btn:focus {
        border-color: #dabe99;
      }

      @media screen and (max-width: 1100px) {
        .section {
          width: 100%;
          max-width: none;
          float: none;
        }
        .section:first-child {
          float: none;
          margin-bottom: 1em;
        }
        .form__cell {
          width: auto;
          outline: none;
        }
      }
    `.replaceAll(' '.repeat(6), ''));
    document.head.append(this);
  });

  // =========================

  if (document.readyState === 'loading') {
    await new Promise(resolve => {
      view.addEventListener('load', resolve, { once: true });
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    });
  }

  // =========================

  let locked = 0;

  const hwmSelect = $('#sel');

  const sections = [...hwmSelect.options].reduce((that, option) => {
    const key = option.value;

    if (!key) return that;

    const value = option.textContent;
    const cat = key.startsWith('EL_')
      ? 'elements'
      : key.startsWith('ART')
      ? 'parts'
      : /^(share|cert|dom)/i.test(key)
      ? 'stuff'
      : key.includes('@')
      ? 'arts'
      : 'res';

    that[cat] = [...(that[cat] || []), [key, value]];
    return that;
  }, {});

  const sectionsRus = {
    res: 'ресурсы',
    elements: 'элементы гн',
    arts: 'артефакты',
    parts: 'части артефактов',
    stuff: 'дома, акции, сертификаты'
  };

  const resKeys = 'wood ore mercury sulphur crystal gem'.split(' ');
  const elementsData = {
    EL_37: 'meteorit',
    EL_38: 'badgrib',
    EL_39: 'wind_flower',
    EL_40: 'fire_crystal',
    EL_41: 'witch_flower',
    EL_42: 'abrasive',
    EL_43: 'snake_poison',
    EL_44: 'ice_crystal',
    EL_45: 'moon_stone',
    EL_46: 'tiger_tusk',
    EL_78: 'fern_flower'
  };

  const container = parseNode(/*html*/`
    <main class="container">
      <section class="section" disabled>
        <div class="section__heading">
          <a class="form-lot" href="#"></a>
          Форма продажи
          <span class="form-status"></span>
        </div>
        <div class="form" data-form="type=1"></div>
      </section>
      <section class="section">
        <div class="section__heading">Выбор товара</div>
      </section>
      <section class="alert">
        <div class="alert__inner">
          <div class="alert__content"></div>
          <button class="alert__btn">OK</button>
        </div>
      </section>
    </main>
  `);

  const formSection = container.firstElementChild;

  const lotData = ((prev) => ({
    target: prev,
    category: '',
    href: '#',
    get amount() {
      return ~~this.target.dataset.amount;
    },
    get max() {
      return { res: 50, elements: 10, arts: 3, parts: 20 }[this.category] || 1;
    },
    get id() {
      return this.target.dataset.id;
    },
    get name() {
      return this.target.textContent.trim();
    },
    get imgSrc() {
      return this.target.style.backgroundImage;
    },
    select() {
      prev.classList.remove('__selected');
      this.target.classList.add('__selected');
      prev = this.target;
      return this;
    },
    fill(data) {
      return Object.assign(this, data);
    },
    decrease() {
      const amount = Math.max(0, this.amount - formData.elements.count.value);
      return this.target.dataset.amount = amount;
    }
  }))(document.createElement('div'));

  const setInputHandlers = ((cache, timeString) => {
    const time = timeString.split('|');

    return function(input, index) {
      cache.set(input, {
        index,
        isRange: input.type === 'range',
        output: input.nextElementSibling
      });

      input.addEventListener('input', onChange);
      input.addEventListener('wheel', onWheel);
    };

    function onChange() {
      if (locked) return;

      const {value} = this;
      const {isRange, index, output} = cache.get(this);

      output.textContent = isRange
        ? (!index ? value : time[value - 1])
        : (value < 1e3 ? +value : formatNum(~~value));

      if (index === 1) {
        const bliz = formData.elements.blizprice;
        const min = bliz.min = ~~value || 1;

        if (+bliz.value && bliz.value < min) {
          bliz.value = min;
          bliz.nextElementSibling.textContent = formatNum(min);
        }
      }

      if (!this.checkValidity()) this.reportValidity();
    }

    function onWheel(e) {
      e.preventDefault();

      if (locked) return;

      const factor = e.altKey ? 1e3 : e.ctrlKey ? 100 : e.shiftKey ? 10 : 1;
      const step = e.deltaY > 0 ? -factor : factor;
      const min = ~~this.min;
      const max = ~~this.max || Infinity;
      const value = Math.max(min, Math.min(step + ~~this.value, max));

      this.value = value;
      onChange.call(this);
    }
  })(new Map, '30 мин.|1 час|3 часа|6 часов|12 часов|1 день|2 дня|3 дня');

  const formData = ((data) => {
    const linkElem = $('a', formSection);
    const formElem = $('.form', formSection);
    const elems = createFormElems(formElem);
    const inputs = Object.values(elems).filter(el => el.tagName === 'INPUT');
    const priceElems = [
      elems.price.parentNode.previousElementSibling,
      elems.price
    ];

    function setPriceText(value) {
      priceElems[0].textContent = `${value}:`;
      priceElems[1].placeholder = `${value}...`;
    }

    function updateFormDataset() {
      const val = Object.entries(data).map(entry => entry.join('=')).join('&');
      formElem.dataset.form = val;
    }

    inputs.forEach(setInputHandlers);

    return {
      get type() {
        return data.type;
      },
      get isValid() {
        return inputs.every((el, i) => el.value > 0 || i === 2);
      },
      elements: elems,
      overflow(test) {
        if (!test) return;

        locked = 1;
        this.setState('locked');
        elems.submit.classList.remove('__loading');

        userAlert.show(
          'Достигнут максимум лотов на <a href="/auction.php">рынке</a>.'
        );

        userAlert.bind(() => {
          locked = 0;
          this.setState('');
        });

        return true;
      },
      setType(type) {
        data.type = type;
        updateFormDataset();
        return this;
      },
      setCat(cat) {
        data.cat = cat;
        updateFormDataset();
        return this;
      },
      setName() {
        elems.name.textContent = lotData.name;
        return this;
      },
      setImg() {
        linkElem.setAttribute('href', lotData.href);
        linkElem.style.backgroundImage = lotData.imgSrc;
        return this;
      },
      setState(value) {
        container.dataset.state = value;
        return this;
      },
      process() {
        locked = 1;
        this.setState('locked process');
        xForm.submit();
        return this;
      },
      refresh() {
        const countEl = elems.count;
        const output = countEl.nextElementSibling;
        let value = countEl.value >> 0;
        let {amount, max} = lotData;

        if (max === 20) {
          countEl.max = max;
          output.textContent = countEl.value = (amount < max ? 0 : max);
          setPriceText('Цена за все части');
          return this;
        }

        if (this.type === 2) {
          max = 1;
          setPriceText('Начальная цена');
        } else {
          setPriceText('Цена за единицу');
        }

        if (!amount) value = max = 0;
        else if (max > amount) max = amount;

        if (value) value = max === 1 ? 1 : Math.min(value, amount);

        countEl.max = max;
        output.textContent = countEl.value = value;
        return this;
      }
    };
  })({ type: 1 });

  function createFormElems(form) {
    const entries = [
      [
        'name',
        'Наименование',
        `<div class="@">Выберите товар</div>`
      ],
      [
        'type',
        'Тип продажи',
        `&nbsp;<button class="form__btn @">Сразу</button><button class="form__btn @">Торги</button>`
      ],
      [
        'count',
        'Кол-во',
        `&nbsp;<input class="form__input @" type="range" min="0" max="1" value="0"><span class="form__output"></span>`
      ],
      [
        'price',
        'Цена за единицу',
        `&nbsp;<input class="form__input @" type="number" min="1" placeholder="Цена за единицу..."><span class="form__output"></span>`
      ],
      [
        'blizprice',
        'Блиц-цена',
        `&nbsp;<input class="form__input @" type="number" min="1" placeholder="Блиц-цена..."><span class="form__output"></span>`
      ],
      [
        'duration',
        'Продолжительность торгов',
        `&nbsp;<input class="form__input @" type="range" min="1" max="8" value="1"><span class="form__output"></span>`
      ]
    ];

    const elements = entries.reduce((that, entry) => {
      that[entry[0]] = createFormRow.call(form, ...entry);
      return that;
    }, {});

    elements.submit = form.appendChild(parseNode(/*html*/`
      <div class="form__row">
        <span class="parts-alert">❗</span>
        <button class="form__btn form__send" id="auc-price-btn">
          <span style="position: relative;">Узнать цену</span>
        </button>
        <button class="form__btn form__send form__submit">
          <span style="position: relative;">Выставить на рынок</span>
        </button>
      </div>
    `)).lastElementChild;

    return elements;
  }

  function createFormRow(key, name, html) {
    html = html.replaceAll('@', `form__${key}`);

    const createCell = (val) => `<div class="form__cell">${val}</div>`;
    const rowHTML = [`${name}:`, html].map(createCell).join('');
    const row = parseNode(`<div class="form__row">${rowHTML}</div>`);

    this.appendChild(row);
    return row.lastChild.firstElementChild;
  }

  const xForm = {
    submit() {
      const elems = formData.elements;

      const data = new FormData();
      data.append('item', lotData.id);
      data.append('count', elems.count.value);
      data.append('atype', formData.type);
      data.append('price', ~~elems.price.value);

      if (formData.type === 2) {
        data.append('bliz_price', ~~elems.blizprice.value);
      }

      data.append('duration', elems.duration.value);

      fetch.post(PATH, data).then(this.send.bind(this));
    },
    async send(doc) {
      const check = (cb = Function.prototype) => {
        const text = $('#hwm_no_zoom', doc).textContent;

        if (formData.overflow(text.includes('максимальное'))) return cb();
        if (text.includes('Неверные данные')) return this.wrong();

        return true;
      };

      if (!check()) return;

      const form = doc.forms.anl_form_ok || doc.forms[0];
      if (!(form && $('[type="submit"][onclick]', form))) return this.error();

      doc = await fetch.post(form.action, new FormData(form));

      if (!check(this.error)) return;

      locked = 0;
      const amount = lotData.decrease();

      if (amount && lotData.category === 'arts') {
        fetch.get(PATH).then(this.resetId);
      }

      formData.elements.submit.classList.remove('__loading');
      formData.setState('success').refresh();
    },
    resetId(doc) {
      const {id, name} = lotData;
      const amountReg = /\s\((\d+).+$/;
      const oldOption = $(`.option[data-id="${id}"]`, container);
      const newOption = $$('#sel > option', doc).find(el => {
        return el.value.includes('@')
          && name === el.textContent.replace(amountReg, '');
      });

      if (newOption) lotData.target.dataset.id = newOption.value;
    },
    error() {
      locked = 0;
      formData.setState('');
      userAlert.show('Что-то пошло не так.');
      formData.elements.submit.classList.remove('__loading');
    },
    wrong() {
      this.error();
      userAlert.show('Неверные данные.');
    }
  };

  const setImage = ((path) => {
    const fixedRes = {
      sulphur: 'sulfur',
      crystal: 'crystals',
      gem: 'gems'
    };
    const stuff = {
      share: `${path}obj_share_pic.png`,
      cert: `${path}house_cert.jpg`,
      dom: `${path}auc_dom.gif`
    };
    const srcData = {
      res: id => `${path}r/48/${fixedRes[id] || id}.png`,
      elements: id => `${path}gn_res/${elementsData[id]}.png`,
      parts: id => `${path}artifacts/parts/part_${id.replace(/^artpart_/i, '')}.png`,
      stuff: id => stuff[id.toLowerCase().match(/[^_]+/)[0]]
    };

    function setArtImg(style, id) {
      const name = (allArtsData[id] || '').replace('&', id);
      if (name) style.backgroundImage = `url("${path}artifacts/${name}.png")`;
    }

    return function(elem, key, id) {
      if (key === 'arts') return setArtImg(elem.style, id.split('@')[0]);
      elem.style.backgroundImage = `url("${srcData[key](id)}")`;
    };
  })('https://dcdn.heroeswm.ru/i/');

  // =========================

  container.addEventListener('click', (e) => {
    if (locked) return;

    const trg = e.target;

    if (trg === formData.elements.submit) {
      if (!lotData.amount) {
        return userAlert.show('Данный лот помножен на ноль.');
      }

      if (!formData.isValid) {
        return userAlert.show('Проверьте форму на корректность.');
      }

      trg.classList.add('__loading');
      return formData.process();
    }

    if (trg.matches('.block__title')) return toggleBlock.call(trg.parentNode);

    if (trg.matches('.option')) return selectOption.call(trg);

    if (trg.matches('.form__type')) {
      const ind = [...trg.parentNode.children].indexOf(trg);
      return formData.setType(ind + 1).refresh();
    }
  });

  container.children[1].innerHTML += Object.keys(sections).map(key => {
    return /*html*/`
      <div class="block block-${key}">
        <div class="block__title">${sectionsRus[key]}</div>
        ${createSelectHTML(key)}
      </div>`;
  }).join('');

  function createSelectHTML(key) {
    const amountReg = /\s\((\d+).+$/;

    const innerHTML = sections[key].map(([id, value]) => {
      const amount = (value.match(amountReg) || '')[1];
      const datasetRaw = `data-id="${id}" data-amount="${amount || 1}"`;
      let html = !amount ? value : value.replace(amountReg, '');

      if (key === 'arts') html = html.replace(' [i]', '');
      else if (key === 'parts') html = html.slice(7, -1);

      return `<div class="option" ${datasetRaw}>${html}</div>`;
    }).join('');

    return `<div class="select select-${key}">${innerHTML}</div>`;
  }

  function toggleBlock() {
    this.dataset.shown ^= 1;

    if (this.__loaded) return;

    this.__loaded = true;

    const cat = this.className.match(/\w+$/)[0];
    const options = [...this.lastElementChild.children];
    options.forEach(opt => setImage(opt, cat, opt.dataset.id));
  }

  function selectOption() {
    const {id} = this.dataset;
    const category = this.parentNode.className.match(/\w+$/)[0];
    const href = {
      res: `/auction.php?cat=res&type=${resKeys.indexOf(id) + 1}`,
      elements: `/auction.php?cat=elements&art_type=${elementsData[id]}`,
      arts: `/art_info.php?id=${id.slice(0, id.indexOf('@'))}`,
      parts: `/auction.php?cat=part&art_type=part_${id.slice(8)}`,
    }[category] || '#';

    formSection.removeAttribute('disabled');
    lotData.fill({ target: this, href, category }).select();
    formData.setImg().setName().setCat(category);

    if (id.startsWith('SHARE_')) formData.setType(2);

    formData.refresh();
  }

  // ==================== [[ ALERT ]]

  const userAlert = ((target) => {
    const body = $('.alert__content', target);
    const btn = body.nextElementSibling;
    let lastActiveElem = null;
    let onCloseAction = Function.prototype;

    return {
      __init__() {
        document.addEventListener('keydown', ({code}) => {
          if (code === 'Escape') this.hide();
        });

        target.addEventListener('click', (e) => {
          if ([target, btn].includes(e.target)) this.hide();
        });
      },
      show(html = '') {
        if (!lastActiveElem) lastActiveElem = document.activeElement;

        body.innerHTML = html;
        target.classList.add('__shown');
        setTimeout(btn.focus.bind(btn), 50);
        return this;
      },
      hide() {
        if (lastActiveElem) {
          lastActiveElem.focus();
          lastActiveElem = null;
        }

        target.classList.remove('__shown');
        onCloseAction();
        onCloseAction = Function.prototype;

        return this;
      },
      bind(action) {
        onCloseAction = action;
      }
    };
  })(container.lastElementChild);

  userAlert.__init__();

  // =========================

  $('#hwm_no_zoom').closest('table').replaceWith(container);
  setTimeout(() => formData.overflow(hwmSelect.disabled), 50);

  // ==================== [[ SHOW PRICE ]]

  const aucPriceBtn = formData.elements.submit.previousElementSibling;

  aucPriceBtn.addEventListener('click', async function(e) {
    e.stopPropagation();

    if (locked) return;

    const {target, category, href} = lotData;

    if (category === 'stuff') return;

    this.classList.add('__loading');

    let doc = null;
    let data = null;

    if (['res', 'elements', 'parts'].includes(category)) {
      doc = await fetch.get(`${href}&sbn=1&sau=0`);
      data = findResOnAuc(doc);
    }
    else if (category === 'arts') {
      doc = await fetch.get(href);
      const art = $('.art_info_left_block a[href*="auction"]', doc);
      doc = await fetch.get(`${art.href}&sbn=1&sau=0&snew=1`);
      const dur = target.textContent.match(/\d\/(\d+)/)[1];
      data = findArtOnAuc(doc, +dur);
    }

    this.classList.remove('__loading');
    showLotAlert(data);
  });

  function findResOnAuc(doc) {
    const elem = $('td.wbwhite tr.wb', doc);

    if (!elem) return null;

    const price = $('div[id^="au"]', elem).textContent;
    return { name: lotData.name, price };
  }

  function findArtOnAuc(doc, artDur) {
    const cont = $('td.wbwhite', doc);
    const rows = $$('tr.wb', cont);

    if (!rows.length) return null;

    const durReg = /Прочность: (\d+)/;

    let elem = rows.find(el => {
      const dur = +el.textContent.match(durReg)[1];
      return dur >= artDur;
    });

    if (!elem) elem = rows.pop();
    else if (elem !== rows[0]) elem = elem.previousElementSibling;

    const name = lotData.name.replace(/ \d+\/\d+$/, '');
    const price = $('div[id^="au"]', elem).textContent;
    const dur = elem.textContent.match(durReg)[1];

    return { name, price, dur: [dur, dur].join('/') };
  }

  function showLotAlert(data) {
    if (!data) return userAlert.show('Лоты такого вида отсутствуют на рынке!');

    if (data.hasOwnProperty('dur')) data.name += ` [ ${data.dur} ]`;

    return userAlert.show(/*html*/`
      <div style="text-align: left;">
        <p><b style="color: #e8ddca;">Лот</b>: ${data.name}</p>
        <p><b style="color: #e8ddca;">Цена</b>: ${data.price}</p>
      </div>
    `);
  }
})(document.defaultView);