// ==UserScript==
// @name        HWM_Repair_Pay
// @namespace   Legnus
// @description Расчет стоимости ремонта кузнеца и передача золота за ремонт
// @icon        http://dcdn.heroeswm.ru/i/repair_common.gif
// @grant       GM_getValue
// @grant       GM_setValue
// @include     http://*swm.*/inventory.php*
// @include     http://*swm.*/transfer.php
// @version 0.0.1.20150929020524
// @downloadURL https://update.greasyfork.org/scripts/12737/HWM_Repair_Pay.user.js
// @updateURL https://update.greasyfork.org/scripts/12737/HWM_Repair_Pay.meta.js
// ==/UserScript==

// Кузнецы
// 'Ник в игре':[% стоимости ремонта]
var smith = { 'Фартовая':[100], 'Чарси': [80], 'slaon':[101], 'Вещий_Олег':[103], 'LITWIN':[105], 'CHISIVAN':[101], 'Noldor':[101],'Pyramid Head':[102],'Killtown':[100], '__BloodRayne__': [78] }


if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1))
{
  this.GM_getValue=function (key,def)
  {
      return localStorage[key] || def;
  };
  this.GM_setValue=function (key,value)
  {
      return localStorage[key]=value;
  };
  this.GM_deleteValue=function (key)
  {
      return delete localStorage[key];
  };
}

if (!('contains' in String.prototype))
{
  String.prototype.contains = function(str, startIndex)
  {
    return -1 !== String.prototype.indexOf.call(this, str, startIndex);
  };
}

var com = location.href.contains('lordswm.com');

if (location.href.contains("inventory.php"))
{
  GM_setValue('nick', '');
  GM_setValue('artid', '');
  GM_setValue('artname', '');

  var as = document.getElementsByTagName('a');
  for (var i = as.length - 1; i > -1; i--)
  {
    var a = as[i];
    if (a.getAttribute('href').contains('trade_cancel.php'))
    {
      var td = a.parentNode;
      var tr = td.parentNode;
      var hdtd = tr.previousSibling.previousSibling.firstChild;
      var nick = hdtd.lastChild.firstChild.innerHTML;
      if (!smith[nick]) continue;

      var aimg = tr.previousSibling.firstChild.lastChild;
      if (aimg.nodeName == 'TABLE') aimg = aimg.firstChild.firstChild.firstChild.firstChild;
      var href = aimg.getAttribute('href');
      var artid = (href.contains('&') ? /=(.+)&/ : /=(.+)/).exec(href)[1];

      var artname = hdtd.firstChild.innerHTML;
      artname = artname.substring(1, artname.length - 1);

      td.setAttribute('colspan', '1');
      var mytdt = document.createElement('td');
        mytdt.setAttribute('colspan', '2');
        tr.appendChild(mytdt);
      var mytbl = document.createElement('table');
        mytbl.setAttribute('width', '100%');
        mytbl.setAttribute('style', 'border-collapse: collapse');
        mytdt.appendChild(mytbl);
      var mytr = document.createElement('tr'); mytbl.appendChild(mytr);
      var mytd = document.createElement('td'); mytr.appendChild(mytd);
      var mya = document.createElement('a');
        mya.setAttribute('href', '/transfer.php');
        mya.innerHTML = com ? 'Pay for repair' : 'Оплатить ремонт';
        mya.addEventListener("click", set, true);
        mytd.appendChild(mya);
      mytd.appendChild(document.createTextNode(' (' + smith[nick] + '%)'));
      mytr.appendChild(td);
    }
  }
  
  var trans_nick = document.getElementsByName('trans_nick')[0];
    trans_nick.setAttribute('list', 'smith')
  var mydl = document.createElement('datalist');
    mydl.setAttribute('id', 'smith');
    trans_nick.parentNode.appendChild(mydl);
    for (var nick in smith)
    {
      var myopt = document.createElement('option');
        myopt.value = nick;
        myopt.innerHTML = nick + ' (' + smith[nick] + '%)';
        mydl.appendChild(myopt);
    }
}

function set()
{
  var tr = this.parentNode.parentNode.parentNode.parentNode.parentNode;
  var hdtd = tr.previousSibling.previousSibling.firstChild;
  var nick = hdtd.lastChild.firstChild.innerHTML;
  var aimg = tr.previousSibling.firstChild.lastChild;
  if (aimg.nodeName == 'TABLE') aimg = aimg.firstChild.firstChild.firstChild.firstChild;
  var href = aimg.getAttribute('href');
  var artid = (href.contains('&') ? /=(.+)&/ : /=(.+)/).exec(href)[1];
  var artname = hdtd.firstChild.innerHTML;
  artname = artname.substring(1, artname.length - 1);
  GM_setValue('nick', nick);
  GM_setValue('artid', artid);
  GM_setValue('artname', artname);
}


if (location.href.contains('transfer.php'))
{
  var repair;
  init_repair();
  var nick = GM_getValue('nick');
  if (!nick || nick == '') return;
  var rate = smith[nick];
  document.getElementsByName('nick')[0].value = nick;
  var desc = document.getElementsByName('desc')[0];
    desc.value = (com ? 'repair' : 'ремонт') + ' ' + GM_getValue('artname');

  document.getElementsByName('gold')[0].value = Math.ceil(repair[GM_getValue('artid')] * (rate / 100) + 1);

  GM_setValue('nick', '');
  GM_setValue('artid', '');
  GM_setValue('artname', '');
}

function init_repair()
{
  repair = { 'wzzamulet16':[10972], 'gm_amul':[1200], 'thief_neckl':[8000], 'dem_amulet':[50000], 'druid_amulet':[64000], 'mmzamulet16':[10972], 'smamul17':[4389], 'sh_amulet2':[2400], 'hunter_amulet1':[800], 'tm_amulet':[24000], 'necr_amulet':[40000], 'bafamulet15':[10811], 'amulet_of_luck':[959], 'r_warriorsamulet':[36000], 'samul14':[4370], 'elfamulet':[50000], 'r_m_amulet':[36000], 'wzzamulet13':[9975], 'thief_arb':[8000], 'tm_arb':[24000], 'paladin_bow':[64000], 'sunart2':[28000], 'large_shield':[9576], 'hauberk':[2289], 'tact1w1_wamulet':[40000], 'staff':[2527], 'boots2':[1026], 'gm_arm':[1200], 'dem_armor':[50000], 'sh_armor':[2400], 'hunter_armor1':[800], 'merc_armor':[40000], 'darkelfkaska':[50000], 'sword18':[17755], 'warring13':[10279], 'wood_sword':[133], 'long_bow':[6317], 'v_1armor':[48000], 'tjarmor2':[20000], 'inq_body':[64000], 'nv_body':[56000], 'paladin_armor':[64000], 'armor15':[9310], 'tactcv1_armor':[40000], 'welfarmor':[44000], 'thief_goodarmor':[8000], 'tm_armor':[24000], 'marmor17':[9310], 'dubina':[40000], 'sv_weap':[64000], 'gdubina':[14000], 'r_zarmor':[36000], 'gm_rring':[1200], '5years_star':[5000], 'zub':[40000], 'bwar1':[60000], 'bwar2':[48000], 'gnomewar2':[48000], 'bwar3':[36000], 'kwar3':[36000], 'bwar4':[28000], 'kwar4':[28000], 'bwar5':[20000], 'kwar5':[20000], 'bwar6':[16000], 'kwar6':[16000], 'bwar7':[12000], 'kwar7':[12000], 'gm_kastet':[1200], 'thief_ml_dagger':[8000], 'hunterdagger':[800], 'dagger':[912], 'merc_dagger':[40000], 'tm_knife':[24000], 'r_dagger':[36000], 'tactsm0_dagger':[40000], 'sarmor16':[4351], 'armor17':[9490], 'tunnel_kirka':[4000], 'bludgeon':[28000], 'leather_shiled':[266], 'leatherhat':[171], 'leatherboots':[199], 'leatherplate':[1358], 'hunter_boots':[912], 'leather_helm':[627], 'tm_mring':[24000], 'wizard_cap':[1596], 'ring19':[11305], 'wwwring16':[11238], 'warriorring':[6697], 'ring_of_thief':[8000], 'mmmring16':[11238], 'i_ring':[171], 'gm_sring':[1200], 'sh_ring1':[2400], 'hunter_ring2':[800], 'smring10':[2859], 'tactspw_mring':[40000], 'tm_wring':[24000], 'mring19':[11390], 'circ_ring':[6507], 'testring':[40000], 'hunter_ring1':[800], 'thief_premiumring3':[12000], 'powerring':[5187], 'bring14':[10374], 'sring4':[579], 'sh_ring2':[2400], 'tactwww_wring':[40000], 'doubt_ring':[1064], 'rashness_ring':[1928], 'darkring':[8379], 'sring17':[2907], 'chain_coif':[1539], 'sunart1':[14000], 'kopie':[28000], 'sh_spear':[2400], 'pika':[28000], 'necrohelm2':[16000], 'xymhelmet15':[6612], 'mhelmetzh13':[6384], 'shortbow':[342], 'dem_kosa':[40000], 'hunter_roga1':[800], 'round_shiled':[104], 'warrior_pendant':[8046], 'mamulet19':[11039], 'power_pendant':[7381], 'hunter_pendant1':[400], 'amulet19':[11039], 'mif_light':[6251], 'huntersword2':[800], 'mif_lboots':[7153], 'tj_vboots3':[16000], 'hunter_boots3':[800], 'tjarmor3':[16000], 'mif_lhelmet':[5244], 'tj_helmet3':[16000], 'gnome_hammer':[294], 'gm_abow':[1200], 'sh_bow':[2400], 'centaurbow':[16000], 'hunter_bow2':[800], 'hunter_bow1':[400], 'bow14':[9946], 'bow17':[10108], 'r_bow':[36000], 'tact765_bow':[40000], 'magic_amulet':[8379], 'tactms1_mamulet':[40000], 'cloack17':[9975], 'cloackwz15':[9614], 'scroll18':[10307], 'thief_msk':[8000], 'tm_msk':[24000], 'scloack8':[2052], 'gm_protect':[1200], 'sh_cloak':[2400], 'hunter_mask1':[800], 'bwar_splo':[28000], 'gnomewar_stoj':[28000], 'bwar_takt':[28000], 'bravery_medal':[560], 'warthief_medal3':[10000], 'gm_sword':[1200], 'verb11_sword':[48000], 'power_sword':[9775], 'sunart3':[32000], 'requital_sword':[2527], 'firsword15':[17670], 'ssword16':[6051], 'ssword8':[3838], 'sh_sword':[2400], 'ssword10':[4854], 'sunart4':[36000], 'paladin_sword':[64000], 'dem_dmech':[14000], 'broad_sword':[4721], 'def_sword':[1292], 'r_bigsword':[36000], 'kn_weap':[44000], 'blacksword':[20000], 'blacksword1':[10000], 'slayersword':[40000], 'welfsword':[44000], 'mmzamulet13':[9975], 'sarmor9':[2479], 'miff_plate':[9842], 'mif_sword':[16957], 'mif_staff':[16387], 'gnomehammer':[44000], 'molot_tan':[40000], 'soul_cape':[1197], 'wiz_cape':[8711], 'sarmor13':[4322], 'boots13':[8502], 'ssword13':[5985], 'mstaff13':[4797], 'zxhelmet13':[6384], 'shield13':[10174], 'mage_armor':[4465], 'elfwar3':[32000], 'magewar2':[40000], 'demwar4':[24000], 'smamul14':[4370], 'verve_ring':[1577], 'hunter_gloves1':[400], 'magring13':[10279], 'thief_cape':[8000], 'scloack16':[3192], 'druid_cloack':[64000], 'mage_cape':[60000], 'powercape':[5339], 'tm_cape':[24000], 'scoutcloack':[304], 'r_clck':[36000], 'tactpow_cloack':[40000], '3year_amul':[4000], 'welfboots':[44000], 'amf_weap':[64000], 'mstaff8':[2888], 'druid_staff':[64000], 'smstaff16':[4883], 'staff18':[17746], 'sor_staff':[6118], 'necr_staff':[40000], 'ffstaff15':[17679], 'darkelfstaff':[50000], 'tactmag_staff':[40000], 'mstaff10':[3781], 'druid_armor':[64000], 'mage_robe':[60000], 'robewz15':[9310], 'wiz_robe':[9376], 'rog_demon':[40000], 'hunter_jacket1':[400], 'sboots12':[2992], 'mm_sword':[17195], 'mm_staff':[16986], 'shelm12':[2660], 'hunterdsword':[800], 'gm_spdb':[1200], 'verbboots':[48000], 'thief_fastboots':[8000], 'tj_vboots2':[20000], 'gnomeboots':[44000], 'sh_boots':[2400], 'mage_boots':[60000], 'hunter_boots2':[800], 'tm_boots':[24000], 'hunter_boots1':[400], 'paladin_boots':[64000], 'boots15':[8559], 'boots17':[8683], 'r_bootsmb':[36000], 'mboots17':[8683], 'tactzl4_boots':[40000], 'mboots14':[8825], 'mage_scroll':[60000], 'energy_scroll':[9044], 'sboots9':[2137], 'composite_bow':[8246], 'ciras':[4455], 'steel_blade':[465], 'steel_helmet':[3676], 's_shield':[266], 'full_plate':[9243], 'steel_boots':[5785], 'dem_bootshields':[50000], 'ru_statue':[2009], 'gm_3arrows':[1200], 'sh_4arrows':[2400], 'hunter_arrows1':[800], 'samul8':[3391], '3year_art':[4000], 'sring10':[2859], 'hunter_sword1':[400], 'dem_axe':[50000], 'dem_dtopor':[48000], 'tactaz_axe':[40000], 'topor_skelet':[14000], 'sea_trident':[4000], 'shoe_of_initiative':[2384], 'wiz_boots':[8008], 'mif_hboots':[7752], 'tj_vboots1':[24000], 'tjarmor1':[24000], 'mif_hhelmet':[6298], 'tj_helmet1':[24000], 'antiair_cape':[2926], 'antimagic_cape':[4949], 'necr_robe':[40000], 'antifire_cape':[16000], '4year_klever':[4000], '6ring':[15000], 'amf_helm':[64000], 'shelm16':[2774], 'gm_hat':[1200], 've_helm':[48000], 'tj_helmet2':[20000], 'gnomehelmet':[44000], 'sh_helmet':[2400], 'mage_helm':[3277], 'hunter_helm':[800], 'nv_helm':[56000], 'shelm8':[1197], 'paladin_helmet':[64000], 'myhelmet15':[6583], 'helmet17':[7239], 'r_helmb':[36000], 'necrohelm3':[24000], 'knighthelmet':[44000], 'necrohelm1':[10000], 'mhelmet17':[7239], 'tacthapp_helmet':[40000], 'welfhelmet':[44000], 'knowledge_hat':[978], 'mage_hat':[60000], 'hunter_hat1':[400], 'barb_shield':[40000], 'gm_defence':[1200], 'vrb_shild':[48000], 'gnomem_shield':[64000], 'dragon_shield':[8778], 'sh_shield':[2400], 'huntershield2':[800], 'hunter_shield1':[400], 'paladin_shield':[64000], 'shield16':[10298], 'shield19':[10469], 'kn_shield':[44000], 'knightshield':[44000], 'sshield5':[2888], 'sshield11':[3876], 'tactdff_shield':[40000], 'defender_shield':[1130], 'sshield14':[3923] }
}
