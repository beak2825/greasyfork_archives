// ==UserScript==
// @name        HWM_Attach_Martket_Links_to_Arts_in_Inventory
// @namespace   Рианти
// @description Переход на рынок при нажатии на название артефакта в инвентаре с зажатой клавишей Ctrl
// @version     1.3
// @@homepage   https://greasyfork.org/en/scripts/374895-hwm-attach-martket-links-to-arts-in-inventory
// @include     https://www.heroeswm.ru/inventory.php*
// @include     https://www.lordswm.com/inventory.php*
// @include     http://178.248.235.15/inventory.php*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/374895/HWM_Attach_Martket_Links_to_Arts_in_Inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/374895/HWM_Attach_Martket_Links_to_Arts_in_Inventory.meta.js
// ==/UserScript==

// old https://greasyfork.org/ru/scripts/12717-hwm-attach-martket-links-to-arts-in-inventory

(function(){
  var url = location.protocol+'//'+location.hostname+'/';
  var sort='&sort=204';

  var categoryByArt = loadArts();
  var knownArts = Object.keys(categoryByArt);

  replaceLinks();

  addEvent(getClickDiv(), "click", setTimer_replaceLinks);
  installClickDivHook();

  return; //only functions below

  function replaceLinks(){
    var links = document.querySelectorAll('a[href*="art_info.php?id="]');
    for (var i = 0; i < links.length; i++){
      var link = links[i];
      var art = link.href.match(/id=([^&]+)/)[1];
      if(knownArts.indexOf(art) > -1){
        removeEvent(link, 'click', handle_click);
        addEvent(link, 'click', handle_click);
      }
    }
  }

  function handle_click(e){
    if (e.ctrlKey){
      e.preventDefault();
      var currLink = e.target.parentElement.href; //<a href="art_info.php?id=steel_helmet"><b>Стальной шлем</b></a>
      var art = currLink.match(/id=([^&]+)/)[1];
      var cat = categoryByArt[art];
      if(cat)
        window.open(url + 'auction.php?cat=' + cat + '&art_type='+art + sort, '_blank');
    }
  }

  function loadArts(){
    return {
'10scroll' : 'backpack', '2year_amul_lords' : 'necklace', '3year_amul' : 'necklace', '4year_klever' : 'necklace', '5years_star' : 'necklace', '6ring' : 'ring', '7ka' : 'necklace', '8amul_inf' : 'necklace', '9amu_let' : 'necklace', 'amf_body' : 'relict', 'amf_boot' : 'relict', 'amf_cl' : 'relict', 'amf_helm' : 'relict', 'amf_scroll' : 'relict', 'amf_weap' : 'relict', 'amulet19' : 'necklace', 'amulet_of_luck' : 'necklace', 'ankh1' : 'backpack', 'ankh2' : 'backpack', 'antiair_cape' : 'cloack', 'antifire_cape' : 'cloack', 'antimagic_cape' : 'cloack', 'armor15' : 'cuirass', 'armor17' : 'cuirass', 'bafamulet15' : 'necklace', 'bal_cube' : 'backpack', 'barb_boots' : 'relict', 'barb_shield' : 'relict', 'battlem_cape' : 'cloack', 'blackring' : 'ring', 'blacksword' : 'weapon', 'blacksword1' : 'weapon', 'bludgeon' : 'weapon', 'boots13' : 'boots', 'boots15' : 'boots', 'boots17' : 'boots', 'boots2' : 'boots', 'bow14' : 'weapon', 'bow17' : 'weapon', 'bravery_medal' : 'necklace', 'bring14' : 'ring', 'broad_sword' : 'weapon', 'bshield1' : 'shield', 'bshield2' : 'shield', 'bwar1' : 'medals', 'bwar2' : 'medals', 'bwar3' : 'medals', 'bwar4' : 'medals', 'bwar5' : 'medals', 'bwar6' : 'medals', 'bwar7' : 'medals', 'bwar_takt' : 'medals', 'castle_orden' : 'necklace', 'centaurbow' : 'weapon', 'chain_coif' : 'helm', 'ciras' : 'cuirass', 'circ_ring' : 'ring', 'cloack17' : 'cloack', 'cloackwz15' : 'cloack', 'clover_amul' : 'necklace', 'coldring_n' : 'ring', 'cold_sword2014' : 'weapon', 'compass' : 'other', 'composite_bow' : 'weapon', 'crystal' : 'backpack', 'cubed' : 'backpack', 'cubeg' : 'backpack', 'cubes' : 'backpack', 'dagger' : 'weapon', 'dagger16' : 'weapon', 'dagger20' : 'weapon', 'dagger_dex' : 'weapon', 'dagger_myf' : 'weapon', 'darkelfcloack' : 'relict', 'darkelfkaska' : 'relict', 'darkelfpendant' : 'relict', 'darkelfstaff' : 'relict', 'darkring' : 'ring', 'defender_shield' : 'shield', 'def_sword' : 'weapon', 'demwar1' : 'medals', 'demwar5' : 'medals', 'dem_amulet' : 'relict', 'dem_axe' : 'relict', 'dem_bootshields' : 'relict', 'dem_dmech' : 'weapon', 'dem_dtopor' : 'weapon', 'dem_kosa' : 'weapon', 'dering' : 'relict', 'doubt_ring' : 'ring', 'dragonstone' : 'backpack', 'dragon_crown' : 'helm', 'dragon_shield' : 'shield', 'dring12' : 'ring', 'dring15' : 'ring', 'dring18' : 'ring', 'dring21' : 'ring', 'dring5' : 'ring', 'dring9' : 'ring', 'druid_amulet' : 'relict', 'druid_armor' : 'relict', 'druid_cloack' : 'relict', 'druid_staff' : 'relict', 'dubina' : 'weapon', 'dudka' : 'necklace', 'dun_amul1' : 'necklace', 'dun_amul2' : 'necklace', 'dun_amul3' : 'necklace', 'dun_armor1' : 'cuirass', 'dun_armor2' : 'cuirass', 'dun_armor3' : 'cuirass', 'dun_shield1' : 'shield', 'dun_shield2' : 'shield', 'dun_shield3' : 'shield', 'elfboots' : 'relict', 'elfdagger' : 'relict', 'elfshirt' : 'relict', 'energy_scroll' : 'weapon', 'ffstaff15' : 'weapon', 'finecl' : 'cloack', 'firsword15' : 'weapon', 'flyaga' : 'backpack', 'forest_bow' : 'weapon', 'forest_dagger' : 'weapon', 'full_plate' : 'cuirass', 'gargoshield' : 'shield', 'gdubina' : 'weapon', 'gmage_armor' : 'relict', 'gmage_boots' : 'relict', 'gmage_cloack' : 'relict', 'gmage_crown' : 'relict', 'gmage_scroll' : 'relict', 'gmage_staff' : 'relict', 'gm_3arrows' : 'other', 'gm_abow' : 'weapon', 'gm_amul' : 'necklace', 'gm_arm' : 'cuirass', 'gm_defence' : 'shield', 'gm_hat' : 'helm', 'gm_kastet' : 'weapon', 'gm_protect' : 'cloack', 'gm_rring' : 'ring', 'gm_spdb' : 'boots', 'gm_sring' : 'ring', 'gm_sword' : 'weapon', 'gnomearmor' : 'relict', 'gnomehammer' : 'relict', 'gnomehelmet' : 'relict', 'gnomem_armor' : 'relict', 'gnomem_hammer' : 'relict', 'gnomem_helmet' : 'relict', 'gnomewar3' : 'medals', 'gnomewar6' : 'medals', 'gnomewar7' : 'medals', 'gnomewar_stoj' : 'medals', 'gnome_hammer' : 'weapon', 'goblin_bow' : 'weapon', 'gring' : 'ring', 'gringd' : 'ring', 'hauberk' : 'cuirass', 'helmet17' : 'helm', 'hm1' : 'helm', 'hm2' : 'helm', 'hunterdagger' : 'weapon', 'hunterdsword' : 'weapon', 'huntershield2' : 'shield', 'huntersword2' : 'weapon', 'hunter_amulet1' : 'necklace', 'hunter_armor1' : 'cuirass', 'hunter_arrows1' : 'other', 'hunter_boots' : 'boots', 'hunter_boots1' : 'boots', 'hunter_boots2' : 'boots', 'hunter_boots3' : 'boots', 'hunter_bow1' : 'weapon', 'hunter_bow2' : 'weapon', 'hunter_gloves1' : 'other', 'hunter_hat1' : 'helm', 'hunter_helm' : 'helm', 'hunter_jacket1' : 'cuirass', 'hunter_mask1' : 'cloack', 'hunter_pendant1' : 'necklace', 'hunter_ring1' : 'ring', 'hunter_ring2' : 'ring', 'hunter_roga1' : 'helm', 'hunter_shield1' : 'shield', 'hunter_sword1' : 'weapon', 'inq_body' : 'relict', 'inq_boot' : 'relict', 'inq_cl' : 'relict', 'inq_weap' : 'relict', 'i_ring' : 'ring', 'kniga' : 'backpack', 'knightarmor' : 'relict', 'knightboots' : 'relict', 'knightsword' : 'relict', 'knowledge_hat' : 'helm', 'kn_body' : 'relict', 'kn_shield' : 'relict', 'kopie' : 'weapon', 'kwar1' : 'medals', 'kwar2' : 'medals', 'kwar3' : 'medals', 'kwar4' : 'medals', 'kwar5' : 'medals', 'kwar_stoj' : 'medals', 'large_shield' : 'shield', 'lbow' : 'weapon', 'leatherboots' : 'boots', 'leatherhat' : 'helm', 'leatherplate' : 'cuirass', 'leather_helm' : 'helm', 'leather_shiled' : 'cuirass', 'les_cl' : 'cloack', 'lizard_armor' : 'cuirass', 'lizard_boots' : 'boots', 'lizard_helm' : 'helm', 'long_bow' : 'weapon', 'mage_armor' : 'cuirass', 'mage_boots' : 'relict', 'mage_cape' : 'relict', 'mage_helm' : 'helm', 'mage_robe' : 'relict', 'mage_scroll' : 'relict', 'mage_staff' : 'relict', 'magic_amulet' : 'necklace', 'magneticarmor' : 'cuirass', 'magring13' : 'ring', 'mamulet19' : 'necklace', 'marmor17' : 'cuirass', 'mart8_ring1' : 'relict', 'mboots14' : 'boots', 'mboots17' : 'boots', 'merc_dagger' : 'relict', 'mhelmet17' : 'helm', 'mhelmetzh13' : 'helm', 'mhelmv1' : 'helm', 'mhelmv2' : 'helm', 'mhelmv3' : 'helm', 'miff_plate' : 'cuirass', 'mif_hboots' : 'boots', 'mif_hhelmet' : 'helm', 'mif_lboots' : 'boots', 'mif_lhelmet' : 'helm', 'mif_light' : 'cuirass', 'mif_staff' : 'weapon', 'mif_sword' : 'weapon', 'mirror' : 'backpack', 'mmmring16' : 'ring', 'mmzamulet13' : 'necklace', 'mmzamulet16' : 'necklace', 'mm_staff' : 'weapon', 'mm_sword' : 'weapon', 'molot_tan' : 'weapon', 'mring19' : 'ring', 'msphere' : 'backpack', 'mstaff10' : 'weapon', 'mstaff13' : 'weapon', 'mstaff8' : 'weapon', 'myhelmet15' : 'helm', 'necrohelm1' : 'helm', 'necrohelm2' : 'helm', 'necrohelm3' : 'helm', 'necr_amulet' : 'relict', 'necr_robe' : 'relict', 'necr_staff' : 'relict', 'neut_amulet' : 'necklace', 'nv_body' : 'relict', 'nv_helm' : 'relict', 'nv_shield' : 'relict', 'nv_weap' : 'relict', 'obereg' : 'backpack', 'ogre_bum' : 'weapon', 'ogre_helm' : 'helm', 'orc_axe' : 'weapon', 'orc_hat' : 'helm', 'order_griffin' : 'necklace', 'order_manticore' : 'necklace', 'ord_dark' : 'necklace', 'ord_light' : 'necklace', 'paladin_boots' : 'relict', 'paladin_bow' : 'relict', 'paladin_helmet' : 'relict', 'paladin_shield' : 'relict', 'paladin_sword' : 'relict', 'pegaskop' : 'weapon', 'pika' : 'weapon', 'piratehat1' : 'helm', 'piratehat2' : 'helm', 'piratehat3' : 'helm', 'piring1' : 'ring', 'piring2' : 'ring', 'piring3' : 'ring', 'pir_armor1' : 'cuirass', 'pir_armor2' : 'cuirass', 'pir_armor3' : 'cuirass', 'pn_ring1' : 'ring', 'pn_ring2' : 'ring', 'pn_ring3' : 'ring', 'polkboots1' : 'boots', 'polkboots2' : 'boots', 'polkboots3' : 'boots', 'polk_armor1' : 'cuirass', 'polk_armor2' : 'cuirass', 'polk_armor3' : 'cuirass', 'polk__helm1' : 'helm', 'polk__helm2' : 'helm', 'polk__helm3' : 'helm', 'potion01' : 'other', 'potion02' : 'other', 'potion03' : 'other', 'potion04' : 'other', 'potion05' : 'other', 'potion06' : 'other', 'potion07' : 'other', 'potion08' : 'other', 'pouch' : 'backpack', 'powercape' : 'cloack', 'powerring' : 'ring', 'power_pendant' : 'necklace', 'power_sword' : 'weapon', 'p_amulet1' : 'necklace', 'p_amulet2' : 'necklace', 'p_amulet3' : 'necklace', 'p_boots1' : 'boots', 'p_boots2' : 'boots', 'p_boots3' : 'boots', 'p_cloak1' : 'cloack', 'p_cloak2' : 'cloack', 'p_cloak3' : 'cloack', 'p_compas1' : 'backpack', 'p_compas2' : 'backpack', 'p_compas3' : 'backpack', 'p_dag1' : 'weapon', 'p_dag2' : 'weapon', 'p_dag3' : 'weapon', 'p_pistol1' : 'weapon', 'p_pistol2' : 'weapon', 'p_pistol3' : 'weapon', 'p_sword1' : 'weapon', 'p_sword2' : 'weapon', 'p_sword3' : 'weapon', 'quest_pendant1' : 'necklace', 'rarmor1' : 'cuirass', 'rarmor2' : 'cuirass', 'rashness_ring' : 'ring', 'rboots1' : 'boots', 'rboots2' : 'boots', 'rbow1' : 'weapon', 'rbow2' : 'weapon', 'requital_sword' : 'weapon', 'rhelm1' : 'helm', 'rhelm2' : 'helm', 'ring19' : 'ring', 'ring2013' : 'ring', 'ring_of_thief' : 'thief', 'robewz15' : 'cuirass', 'rog_demon' : 'necklace', 'round_shiled' : 'shield', 'runkam' : 'backpack', 'ru_statue' : 'shield', 'r_bigsword' : 'relict', 'r_bootsmb' : 'relict', 'r_clck' : 'relict', 'r_dagger' : 'relict', 'r_goodscroll' : 'relict', 'r_helmb' : 'relict', 'r_magy_staff' : 'relict', 'r_warring' : 'relict', 'r_zarmor' : 'relict', 'samul14' : 'necklace', 'samul17' : 'necklace', 'samul8' : 'necklace', 'sandglass' : 'backpack', 'sarmor13' : 'cuirass', 'sarmor16' : 'cuirass', 'sarmor9' : 'cuirass', 'sboots12' : 'boots', 'sboots16' : 'boots', 'sboots9' : 'boots', 'scloack16' : 'cloack', 'scloack8' : 'cloack', 'scoutcloack' : 'cloack', 'scroll18' : 'weapon', 'sea_trident' : 'weapon', 'sharik' : 'necklace', 'shelm12' : 'helm', 'shelm16' : 'helm', 'shelm8' : 'helm', 'shield13' : 'shield', 'shield16' : 'shield', 'shield19' : 'shield', 'shoe_of_initiative' : 'boots', 'shortbow' : 'weapon', 'sh_4arrows' : 'other', 'sh_amulet2' : 'necklace', 'sh_armor' : 'cuirass', 'sh_boots' : 'boots', 'sh_bow' : 'weapon', 'sh_cloak' : 'cloack', 'sh_helmet' : 'helm', 'sh_ring1' : 'ring', 'sh_ring2' : 'ring', 'sh_shield' : 'shield', 'sh_spear' : 'weapon', 'sh_sword' : 'weapon', 'skill_book11' : 'backpack', 'slayersword' : 'weapon', 'smamul14' : 'necklace', 'smamul17' : 'necklace', 'smring10' : 'ring', 'smring17' : 'ring', 'smstaff16' : 'weapon', 'sniperbow' : 'relict', 'snowjinka' : 'necklace', 'sor_staff' : 'weapon', 'sosulka' : 'necklace', 'soul_cape' : 'cloack', 'sring10' : 'ring', 'sring17' : 'ring', 'sring4' : 'ring', 'sshield11' : 'shield', 'sshield14' : 'shield', 'sshield17' : 'shield', 'sshield5' : 'shield', 'ssword10' : 'weapon', 'ssword13' : 'weapon', 'ssword16' : 'weapon', 'ssword8' : 'weapon', 'staff' : 'weapon', 'staff18' : 'weapon', 'staff_v1' : 'weapon', 'staff_v2' : 'weapon', 'staff_v3' : 'weapon', 'stalkercl' : 'cloack', 'steel_blade' : 'weapon', 'steel_boots' : 'boots', 'steel_helmet' : 'helm', 'student_armor' : 'cuirass', 'sumka' : 'backpack', 'sunart1' : 'weapon', 'sunart2' : 'weapon', 'sunart3' : 'weapon', 'sunart4' : 'weapon', 'sun_ring' : 'ring', 'super_dagger' : 'weapon', 'surv_armorsu' : 'cuirass', 'surv_bootsurv' : 'boots', 'surv_cloacksrv' : 'cloack', 'surv_crossbowsurv' : 'weapon', 'surv_daggermd' : 'weapon', 'surv_halberdzg' : 'weapon', 'surv_helmetpi' : 'helm', 'surv_mamulka' : 'necklace', 'surv_marmoroz' : 'cuirass', 'surv_mbootsbb' : 'boots', 'surv_mcloacksv' : 'cloack', 'surv_mhelmetcv' : 'helm', 'surv_mring1fd' : 'ring', 'surv_mring2fpg' : 'ring', 'surv_scrollcd' : 'weapon', 'surv_shieldvv' : 'shield', 'surv_staffik' : 'weapon', 'surv_sword2sd' : 'weapon', 'surv_sword_surv' : 'weapon', 'surv_wamuletik' : 'necklace', 'surv_wring1my' : 'ring', 'surv_wring2o' : 'ring', 'sv_arb' : 'relict', 'sv_body' : 'relict', 'sv_boot' : 'relict', 'sv_shield' : 'relict', 'sv_weap' : 'relict', 'sword18' : 'weapon', 's_shield' : 'shield', 'tact1w1_wamulet' : 'tactic', 'tact765_bow' : 'tactic', 'tactaz_axe' : 'tactic', 'tactcv1_armor' : 'tactic', 'tactdff_shield' : 'tactic', 'tacthapp_helmet' : 'tactic', 'tactmag_staff' : 'tactic', 'tactms1_mamulet' : 'tactic', 'tactpow_cloack' : 'tactic', 'tactsm0_dagger' : 'tactic', 'tactspw_mring' : 'tactic', 'tactwww_wring' : 'tactic', 'tactzl4_boots' : 'tactic', 'taskaxe' : 'weapon', 'thief_arb' : 'thief', 'thief_cape' : 'thief', 'thief_fastboots' : 'thief', 'thief_goodarmor' : 'thief', 'thief_ml_dagger' : 'thief', 'thief_msk' : 'thief', 'thief_neckl' : 'thief', 'thief_paper' : 'other', 'thief_premiumring3' : 'thief', 'tj-shield1' : 'shield', 'tj-shield2' : 'shield', 'tj-shield3' : 'shield', 'tjam1' : 'necklace', 'tjam2' : 'necklace', 'tjam3' : 'necklace', 'tjarmor1' : 'cuirass', 'tjarmor2' : 'cuirass', 'tjarmor3' : 'cuirass', 'tj_helmet1' : 'helm', 'tj_helmet2' : 'helm', 'tj_helmet3' : 'helm', 'tj_magam1' : 'necklace', 'tj_magam2' : 'necklace', 'tj_magam3' : 'necklace', 'tj_mtuf1' : 'boots', 'tj_mtuf2' : 'boots', 'tj_mtuf3' : 'boots', 'tj_vboots1' : 'boots', 'tj_vboots2' : 'boots', 'tj_vboots3' : 'boots', 'tmarmor1' : 'cuirass', 'tmarmor2' : 'cuirass', 'tmarmor3' : 'cuirass', 'tm_amulet' : 'thief', 'tm_arb' : 'thief', 'tm_armor' : 'thief', 'tm_boots' : 'thief', 'tm_cape' : 'thief', 'tm_knife' : 'thief', 'tm_mring' : 'thief', 'tm_msk' : 'thief', 'tm_wring' : 'thief', 'topor_drov' : 'weapon', 'topor_skelet' : 'weapon', 'torg_boots' : 'boots', 'trinitypendant' : 'necklace', 'trogloditkop' : 'weapon', 'ttring' : 'ring', 'tunnel_kirka' : 'weapon', 'v-ring1' : 'ring', 'v-ring2' : 'ring', 'v-ring3' : 'ring', 'vbolt1' : 'ring', 'vbolt2' : 'ring', 'vbolt3' : 'ring', 'vbow1' : 'weapon', 'vbow2' : 'weapon', 'vbow3' : 'weapon', 'verb11_sword' : 'verb', 'verbboots' : 'verb', 'verve_ring' : 'ring', 've_helm' : 'verb', 'vmring1' : 'ring', 'vmring2' : 'ring', 'vmring3' : 'ring', 'vrb_shild' : 'verb', 'vrdagger1' : 'weapon', 'vrdagger2' : 'weapon', 'vrdagger3' : 'weapon', 'vscroll-1' : 'weapon', 'vscroll-2' : 'weapon', 'vtjcloak1' : 'cloack', 'vtjcloak2' : 'cloack', 'vtjcloak3' : 'cloack', 'vtmaxe1' : 'weapon', 'vtmaxe2' : 'weapon', 'vtmaxe3' : 'weapon', 'vtmsword1' : 'weapon', 'vtmsword2' : 'weapon', 'vtmsword3' : 'weapon', 'v_1armor' : 'verb', 'warring13' : 'ring', 'warriorring' : 'ring', 'warrior_pendant' : 'necklace', 'warthief_medal3' : 'medals', 'welfarmor' : 'relict', 'welfboots' : 'relict', 'welfbow' : 'relict', 'welfhelmet' : 'relict', 'welfshield' : 'relict', 'welfsword' : 'relict', 'windsword' : 'weapon', 'wizard_cap' : 'helm', 'wiz_boots' : 'boots', 'wiz_cape' : 'cloack', 'wiz_robe' : 'cuirass', 'wood_sword' : 'weapon', 'wshield' : 'shield', 'wwwring16' : 'ring', 'wzzamulet13' : 'necklace', 'wzzamulet16' : 'necklace', 'xymhelmet15' : 'helm', 'znak1' : 'backpack', 'znak2' : 'backpack', 'znak3' : 'backpack', 'znak4' : 'backpack', 'znak5' : 'backpack', 'znak6' : 'backpack', 'znak7' : 'backpack', 'znak8' : 'backpack', 'znak9' : 'backpack', 'zub' : 'necklace', 'zxhelmet13' : 'helm'
    };
  }

  function installClickDivHook(){
    if(!window.ct_clickdiv_hooked && !window.inject_ClickDivHook){
      var elem = document.createElement('script');
      elem.type = "text/javascript";
      elem.innerHTML = inject_ClickDivHook.toString() + "\n inject_ClickDivHook()";
      document.querySelector("head").appendChild(elem);
    }
  }

  function inject_ClickDivHook(){
    if(!window.ct_clickdiv_hooked){
      window.ct_clickdiv_hooked = true;
      window.saved_show_arts_by_cat = window.show_arts_by_cat;  //сохраняем текущий show_arts_by_cat
      window.show_arts_by_cat = function(cat,r){
        window.saved_show_arts_by_cat(cat,r);         //вызываем сохранённую версию
        document.getElementById('click_div').click(); //кликаем
      }
    }
  }

  function getClickDiv(){
    var click_div = document.querySelector("#click_div");
    if(!click_div) {
      click_div = document.createElement('div');
      click_div.id = "click_div";
      click_div.style.display = "none";
      document.querySelector("body").appendChild(click_div);
    }
    return click_div;
  }

  function setTimer_replaceLinks() {
    setTimeout(replaceLinks, 30);
  }

  function addEvent(elem, evType, fn) {
    if(elem){
      if (elem.addEventListener)
        elem.addEventListener(evType, fn, false);
      else if (elem.attachEvent)
        elem.attachEvent("on" + evType, fn);
      else
        elem["on" + evType] = fn;
    }
  }

  function removeEvent(elem, evType, fn) {
    if(elem){
      if (elem.removeEventListener)
        elem.removeEventListener(evType, fn, false);
      if (elem.detachEvent)
        elem.detachEvent("on" + evType, fn);
      if(elem.removeEvent)
        elem.removeEvent("on" + event, fn);
      if(elem["on" + evType] == fn)
        elem["on" + evType] = null;
    }
  }
})();
