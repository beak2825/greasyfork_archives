// ==UserScript==
// @name         AM_hwm_buy_art
// @namespace    AlaMote
// @author       AlaMote
// @description  Покупка артов
// @include      *.heroeswm.ru/inventory.php*
// @include      *178.248.235.15/inventory.php*
// @include      http://*lordswm.com/inventory.php*
// @version      0.1
// @icon         http://www.hwm-img.totalh.net/favicon.png
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/29078/AM_hwm_buy_art.user.js
// @updateURL https://update.greasyfork.org/scripts/29078/AM_hwm_buy_art.meta.js
// ==/UserScript==

var _categoryByArt = { 'leatherhat' : 'helm', 'leather_helm' : 'helm', 'wizard_cap' : 'helm', 'chain_coif' : 'helm', 'necrohelm2' : 'helm', 'xymhelmet15' : 'helm', 'mhelmetzh13' : 'helm', 'hunter_roga1' : 'helm', 'mif_lhelmet' : 'helm', 'tj_helmet3' : 'helm', 'zxhelmet13' : 'helm', 'shelm12' : 'helm', 'steel_helmet' : 'helm', 'mif_hhelmet' : 'helm', 'tj_helmet1' : 'helm', 'shelm16' : 'helm', 'gm_hat' : 'helm', 'tj_helmet2' : 'helm', 'sh_helmet' : 'helm', 'lizard_helm' : 'helm', 'mage_helm' : 'helm', 'hunter_helm' : 'helm', 'ogre_helm' : 'helm', 'orc_hat' : 'helm', 'shelm8' : 'helm', 'myhelmet15' : 'helm', 'helmet17' : 'helm', 'necrohelm3' : 'helm', 'necrohelm1' : 'helm', 'mhelmet17' : 'helm', 'knowledge_hat' : 'helm', 'hunter_hat1' : 'helm', 'wzzamulet16' : 'necklace', 'gm_amul' : 'necklace', 'mmzamulet16' : 'necklace', 'smamul17' : 'necklace', 'sh_amulet2' : 'necklace', 'hunter_amulet1' : 'necklace', 'bafamulet15' : 'necklace', 'amulet_of_luck' : 'necklace', 'samul14' : 'necklace', 'wzzamulet13' : 'necklace', 'sharik' : 'necklace', '5years_star' : 'necklace', 'zub' : 'necklace', 'warrior_pendant' : 'necklace', 'mamulet19' : 'necklace', 'power_pendant' : 'necklace', 'hunter_pendant1' : 'necklace', 'amulet19' : 'necklace', 'magic_amulet' : 'necklace', 'bravery_medal' : 'necklace', 'mmzamulet13' : 'necklace', 'snowjinka' : 'necklace', 'sosulka' : 'necklace', 'samul17' : 'necklace', 'smamul14' : 'necklace', '2year_amul_lords' : 'necklace', '7ka' : 'necklace', '3year_amul' : 'necklace', 'rog_demon' : 'necklace', 'samul8' : 'necklace', '4year_klever' : 'necklace', 'tjam1' : 'necklace', 'hauberk' : 'cuirass', 'gm_arm' : 'cuirass', 'sh_armor' : 'cuirass', 'hunter_armor1' : 'cuirass', 'tjarmor2' : 'cuirass', 'armor15' : 'cuirass', 'marmor17' : 'cuirass', 'lizard_armor' : 'cuirass', 'sarmor16' : 'cuirass', 'armor17' : 'cuirass', 'leather_shiled' : 'cuirass', 'leatherplate' : 'cuirass', 'mif_light' : 'cuirass', 'tjarmor3' : 'cuirass', 'sarmor9' : 'cuirass', 'miff_plate' : 'cuirass', 'sarmor13' : 'cuirass', 'mage_armor' : 'cuirass', 'robewz15' : 'cuirass', 'wiz_robe' : 'cuirass', 'hunter_jacket1' : 'cuirass', 'ciras' : 'cuirass', 'full_plate' : 'cuirass', 'tjarmor1' : 'cuirass', 'cloack17' : 'cloack', 'cloackwz15' : 'cloack', 'scloack8' : 'cloack', 'gm_protect' : 'cloack', 'sh_cloak' : 'cloack', 'hunter_mask1' : 'cloack', 'soul_cape' : 'cloack', 'wiz_cape' : 'cloack', 'scloack16' : 'cloack', 'powercape' : 'cloack', 'scoutcloack' : 'cloack', 'antiair_cape' : 'cloack', 'antimagic_cape' : 'cloack', 'antifire_cape' : 'cloack', 'battlem_cape' : 'cloack', 'sunart2' : 'weapon', 'staff' : 'weapon', 'sword18' : 'weapon', 'wood_sword' : 'weapon', 'long_bow' : 'weapon', 'dubina' : 'weapon', 'ogre_bum' : 'weapon', 'gdubina' : 'weapon', 'gm_kastet' : 'weapon', 'hunterdagger' : 'weapon', 'tunnel_kirka' : 'weapon', 'bludgeon' : 'weapon', 'sunart1' : 'weapon', 'kopie' : 'weapon', 'sh_spear' : 'weapon', 'pika' : 'weapon', 'shortbow' : 'weapon', 'dem_kosa' : 'weapon', 'huntersword2' : 'weapon', 'gnome_hammer' : 'weapon', 'gm_abow' : 'weapon', 'goblin_bow' : 'weapon', 'sh_bow' : 'weapon', 'centaurbow' : 'weapon', 'hunter_bow2' : 'weapon', 'hunter_bow1' : 'weapon', 'bow14' : 'weapon', 'bow17' : 'weapon', 'scroll18' : 'weapon', 'gm_sword' : 'weapon', 'power_sword' : 'weapon', 'sunart3' : 'weapon', 'requital_sword' : 'weapon', 'firsword15' : 'weapon', 'ssword16' : 'weapon', 'ssword8' : 'weapon', 'sh_sword' : 'weapon', 'ssword10' : 'weapon', 'sunart4' : 'weapon', 'dem_dmech' : 'weapon', 'broad_sword' : 'weapon', 'def_sword' : 'weapon', 'blacksword' : 'weapon', 'blacksword1' : 'weapon', 'slayersword' : 'weapon', 'mif_sword' : 'weapon', 'mif_staff' : 'weapon', 'molot_tan' : 'weapon', 'ssword13' : 'weapon', 'mstaff13' : 'weapon', 'mstaff8' : 'weapon', 'smstaff16' : 'weapon', 'staff18' : 'weapon', 'sor_staff' : 'weapon', 'ffstaff15' : 'weapon', 'mstaff10' : 'weapon', 'mm_sword' : 'weapon', 'mm_staff' : 'weapon', 'hunterdsword' : 'weapon', 'energy_scroll' : 'weapon', 'composite_bow' : 'weapon', 'steel_blade' : 'weapon', 'hunter_sword1' : 'weapon', 'dem_dtopor' : 'weapon', 'orc_axe' : 'weapon', 'topor_skelet' : 'weapon', 'sea_trident' : 'weapon', 'cold_sword2014' : 'weapon', 'large_shield' : 'shield', 'round_shiled' : 'shield', 'tj-shield3' : 'shield', 'shield13' : 'shield', 's_shield' : 'shield', 'ru_statue' : 'shield', 'tj-shield1' : 'shield', 'gm_defence' : 'shield', 'tj-shield2' : 'shield', 'dragon_shield' : 'shield', 'sh_shield' : 'shield', 'huntershield2' : 'shield', 'hunter_shield1' : 'shield', 'shield16' : 'shield', 'shield19' : 'shield', 'sshield5' : 'shield', 'sshield11' : 'shield', 'defender_shield' : 'shield', 'sshield14' : 'shield', 'boots2' : 'boots', 'leatherboots' : 'boots', 'hunter_boots' : 'boots', 'mif_lboots' : 'boots', 'tj_vboots3' : 'boots', 'hunter_boots3' : 'boots', 'boots13' : 'boots', 'sboots12' : 'boots', 'sboots16' : 'boots', 'gm_spdb' : 'boots', 'tj_vboots2' : 'boots', 'sh_boots' : 'boots', 'lizard_boots' : 'boots', 'hunter_boots2' : 'boots', 'hunter_boots1' : 'boots', 'boots15' : 'boots', 'boots17' : 'boots', 'mboots17' : 'boots', 'mboots14' : 'boots', 'sboots9' : 'boots', 'steel_boots' : 'boots', 'shoe_of_initiative' : 'boots', 'wiz_boots' : 'boots', 'mif_hboots' : 'boots', 'tj_vboots1' : 'boots', 'warring13' : 'ring', 'gm_rring' : 'ring', 'ring19' : 'ring', 'wwwring16' : 'ring', 'warriorring' : 'ring', 'ring2013' : 'ring', 'mmmring16' : 'ring', 'i_ring' : 'ring', 'gm_sring' : 'ring', 'sh_ring1' : 'ring', 'hunter_ring2' : 'ring', 'smring10' : 'ring', 'mring19' : 'ring', 'circ_ring' : 'ring', 'hunter_ring1' : 'ring', 'powerring' : 'ring', 'bring14' : 'ring', 'sring4' : 'ring', 'sh_ring2' : 'ring', 'doubt_ring' : 'ring', 'rashness_ring' : 'ring', 'darkring' : 'ring', 'sring17' : 'ring', 'verve_ring' : 'ring', 'smring17' : 'ring', 'magring13' : 'ring', 'sring10' : 'ring', '6ring' : 'ring', 'thief_paper' : 'other', 'hunter_gloves1' : 'other', 'gm_3arrows' : 'other', 'sh_4arrows' : 'other', 'hunter_arrows1' : 'other', 'thief_neckl' : 'thief', 'tm_amulet' : 'thief', 'thief_arb' : 'thief', 'tm_arb' : 'thief', 'thief_goodarmor' : 'thief', 'tm_armor' : 'thief', 'thief_ml_dagger' : 'thief', 'tm_knife' : 'thief', 'tm_mring' : 'thief', 'ring_of_thief' : 'thief', 'tm_wring' : 'thief', 'thief_msk' : 'thief', 'tm_msk' : 'thief', 'thief_cape' : 'thief', 'tm_cape' : 'thief', 'thief_fastboots' : 'thief', 'tm_boots' : 'thief', 'tact1w1_wamulet' : 'tactic', 'tactcv1_armor' : 'tactic', 'tactsm0_dagger' : 'tactic', 'tactspw_mring' : 'tactic', 'tactwww_wring' : 'tactic', 'tact765_bow' : 'tactic', 'tactms1_mamulet' : 'tactic', 'tactpow_cloack' : 'tactic', 'tactmag_staff' : 'tactic', 'tactzl4_boots' : 'tactic', 'tactaz_axe' : 'tactic', 'tacthapp_helmet' : 'tactic', 'tactdff_shield' : 'tactic', 'v_1armor' : 'verb', 'verb11_sword' : 'verb', 'verbboots' : 'verb', 've_helm' : 'verb', 'vrb_shild' : 'verb' };

function add_update_labels() {
    /*var arts = $("#test table tr td");
    for (var i = 0; i < arts.length; i += 8) {
        var art = $("#test table tr td:eq("+i+")");*/

    var arts = $("a:contains('Передать')");
    var art_id;
    var tmp = "";
    for (var i = 0; i < arts.length; i++) {
        art_id = arts[i].outerHTML.split("=")[2].split("\"")[0];

        var label = "<li class='update_art' id='"+get_art_info(art_id).art_title+"_"+art_id+"'><a href='javascript: void(0)'>Обновить</a></li>";
        arts[i].append(label);
    }

    //}
}

function get_art_info(id) {
    var art_title = $("a[href*='"+id+"']").parent().parent()[0].outerHTML.match(/qsell\[(d+)\]/);

    alert($("a[href*='"+id+"']").parent().parent()[0].outerHTML.match(/qsell\[(d+)\]/));
}

add_update_labels();
