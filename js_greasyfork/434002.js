// ==UserScript==
// @name        Duellstat
// @author      xyzabcd
// @namespace   xyzabcd
// @description create a duell statistik
// @include https://*.the-west.*/game.php*
// @include https://*.tw.innogames.*/game.php*

// @version     v0.0.35-1-gc89f2da
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/434002/Duellstat.user.js
// @updateURL https://update.greasyfork.org/scripts/434002/Duellstat.meta.js
// ==/UserScript==

(function(fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
})(function() {
const TWDS = { }

TWDS.window = null
TWDS.settings = null
TWDS.lfd = 0
TWDS.baseURL = 'https://ohse.de/uwe/tw-duellstat/'

// a hash function. Source: https://stackoverflow.com/a/52171480
// doesn't work with IE11. Too bad.
TWDS.cyrb53 = function cyrb53 (str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed; let
    h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

TWDS.createTab = function (k) {
  const div = document.createElement('div')
  div.style = 'display:none; overflow: hidden'
  div.id = 'TWDS_tab_' + k
  div.className = 'TWDS_tabcontent'
  return div
}
TWDS.knownTabs = {}
TWDS.registerTab = function (key, title, contentFunc, actiFunc, isDefault = false) {
  const o = {
    key: key,
    title: title,
    contentFunc: contentFunc,
    activationFunc: actiFunc,
    isDefault: isDefault
  }
  TWDS.knownTabs[key] = o
}
TWDS.activateTab = function (k) {
  const tabData = TWDS.knownTabs[k]
  if (typeof tabData === 'undefined') return

  const id = 'TWDS_tab_' + k
  const div = document.getElementById(id)
  div.innerHTML = ''
  div.appendChild(tabData.contentFunc())

  $('.TWDS_tabcontent').hide()
  $('.tw2gui_window_tab_active', TWDS.window.getMainDiv())
    .removeClass('tw2gui_window_tab_active')
  $('.TWDS_tabcontent').closest('.tw2gui_scrollpane').hide()
  $('#TWDS_tab_' + k).show()
  $('#TWDS_tab_' + k).closest('.tw2gui_scrollpane').show()
  $('._tab_id_' + k, TWDS.window.getMainDiv())
    .addClass('tw2gui_window_tab_active')
}
TWDS.startFunctions = []
TWDS.registerStartFunc = function (x) {
  TWDS.startFunctions.push(x)
}
// vim: tabstop=2 shiftwidth=2 expandtab
TWDS.settingList = []
TWDS.registerSetting = function (mode, name, text, def) {
  TWDS.settingList.push(arguments)
  if (TWDS.settings === null) {
    try {
      const x = window.localStorage.getItem('TWDS_settings')
      if (x) {
        TWDS.settings = JSON.parse(x)
      }
    } catch (e) {
      console.log('failed to get settings', e)
    }
    if (TWDS.settings === null) {
      TWDS.settings = {}
    }
  }
  if (!(mode in TWDS.settings)) {
    TWDS.settings[name] = def
  }
}
TWDS.wearItemsHandler = function (ids) {
  if (!Bag.loaded) {
    EventHandler.listen('inventory_loaded', function () {
      TWDS.wearItemsHandler(ids)
      return EventHandler.ONE_TIME_EVENT
    })
    return
  }

  if (Premium.hasBonus('automation')) {
    // i want to open the worn items window, but not the inventory.
    let isMin = false
    let isCreated = false
    if (Inventory !== null) {
      isMin = wman.isMinimized(Inventory.uid) === true
      isCreated = wman.isWindowCreated(Inventory.uid) === true
    }
    if (!wman.isWindowCreated(Wear.uid)) {
      Wear.open()
    } else if (wman.isMinimized(Wear.uid)) {
      wman.reopen(Wear.uid)
    }
    if (!isCreated) {
      wman.close(Inventory.uid)
    } else if (isMin) {
      wman.minimize(Inventory.uid)
    }
    for (const ii of ids) {
      const b = Bag.getItemByItemId(Number(ii))
      if (b) {
        Wear.carry(b)
      }
    }
    return
  }

  if (!wman.getById(Inventory.uid)) { Inventory.open() }
  Wear.open()

  const invItems = Bag.getItemsByItemIds(ids)
  const result = []
  for (let i = 0; i < invItems.length; i++) {
    const invItem = invItems[i]
    const wearItem = Wear.get(invItem.getType())
    if (!wearItem || (wearItem && (wearItem.getItemBaseId() !== invItem.getItemBaseId() ||
        wearItem.getItemLevel() < invItem.getItemLevel()))) {
      result.push(invItem)
    }
  }
  Inventory.showCustomItems(result)
}

TWDS.createElement = function (kind, par = {}) {
  const thing = document.createElement(kind)
  for (const [k, v] of Object.entries(par)) {
    if (k === 'dataSet') {
      for (const [k2, v2] of Object.entries(v)) {
        thing.dataset[k2] = v2
      }
      continue
    }
    if (k === 'classList') {
      for (const add of v) {
        thing.classList.add(add)
      }
      continue
    }
    thing[k] = v
  }
  return thing
}
TWDS.createEle = TWDS.createElement
TWDS.createButton = function (text, par) {
  if (text !== null && text !== '') {
    par.textContent = text
  }
  if (!('classList' in par)) par.classList = []
  par.classList.push('TWDS_button')
  return TWDS.createEle('button', par)
}
TWDS.insertStyles = function () {
  const css = `
    .TWDS_VERSIONINFO {
      color: #333;
      text-align: right;
      padding: 0 2px 5px 0;
    }
    .TWDS .tw2gui_scrollpane {
      margin:1em 0;
    }
    .TWDS_tabcontent {
      padding-bottom:1em;
    }
    #TWDS_job .hasMousePopup,
    #TWDS_job [title],
    #TWDS_equipment .hasMousePopup,
    #TWDS_equipment [title],
    #TWDS_bonuslist .hasMousePopup,
    #TWDS_bonuslist [title],
    #TWDS_bonus .hasMousePopup,
    #TWDS_bonus [title] {
      text-decoration: dotted underline;
    }
    #TWDS_bonuslist td:first-child {
      text-align:right;
    }
    #TWDS_equipment { border-collapse: collapse;}
    #TWDS_equipment .headrow {
      font-weight:bold;
    }
    #TWDS_equipment .datarow {
      text-align:right;
    }
    #TWDS_equipment .hasMousePopup {
      text-decoration: dotted underline;
    }
    #TWDS_equipment .datarow th:nth-child(1) {
      text-align:left;
      font-weight:normal;
    }
    #TWDS_equipment .best { color: #0c0; font-weight:bold; }
    #TWDS_equipment .verygood { color: #0c0; }
    #TWDS_equipment .good { color: green;}
    #TWDS_equipment .ok { }
    #TWDS_equipment .other { color: #800;}
    #TWDS_equipment tr, #TWDS_equipment td, #TWDS_table th { border:1px solid #888;}
    #TWDS_equipment td, #TWDS_equipment th { padding:1px 2px;}
    .TWDS_button {
      min-width:4em;
      border-color:#2B1C19;
      background-color:#4F210D;
      color:white;
      border-width:4px;
      border-style:inset;
    }
    .TWDS_specialequipment_button {
      margin:0.2em 0.5em;
    }
    .TWDS_SPEC_spec {
      display:flex;
      justify-content:space-between;
    }
    .TWDS_SPEC_SKILLS {
      width:100%;
    }
    .TWDS_SPEC_SKILLS td {
      text-align:center;
    }
    .TWDS_SPEC_SKILLS button {
      min-width:100px;
    }
    .TWDS_spec_strength {
      background-color:#8003;
      border-color:red;
    }
    .TWDS_spec_flexibility {
      background-color:#0803;
      border-color:green;
    }
    .TWDS_spec_dexterity {
      background-color:#0083;
      border-color:blue;
    }
    .TWDS_spec_charisma {
      background-color:#8803;
      border-color:yellow;
    }

    #TWDS_people { border-collapse: collapse; width:100%;}
    #TWDS_people tr, #TWDS_people td, #TWDS_people th { border:1px solid #888;}
    #TWDS_people tbody td {
      padding:1px 2px;
      text-align:right;
    }
    #TWDS_people tbody th {
      padding:1px 2px;
      text-align:left;
      text-decoration:underline;
      cursor:pointer;
      font-weight:normal;
    }
    #TWDS_people_subtab table {
      border-collapse: collapse;
    }
    #TWDS_people_subtab .openreport {
      text-decoration:underline;
      cursor:pointer;
    }
    #TWDS_people_subtab .attacker,
    #TWDS_people_subtab .winner {
      text-align:right;
    }
    #TWDS_attr_skill {
      border-collapse: collapse;
    }

    #TWDS_attr_skill .bonus-strength1 {
      border-left:2px solid red;
      border-top:2px solid red;
      border-right:2px solid red;
      background-color:#8003;
    }
    #TWDS_attr_skill .bonus-strength2 {
      border-left:2px solid red;
      border-bottom:2px solid red;
      border-right:2px solid red;
      background-color:#8003;
    }
    #TWDS_attr_skill .bonus-flexibility1 {
      border-left:2px solid green;
      border-top:2px solid green;
      border-right:2px solid green;
      background-color:#0803;
    }
    #TWDS_attr_skill .bonus-flexibility2 {
      border-left:2px solid green;
      border-bottom:2px solid green;
      border-right:2px solid green;
      background-color:#0803;
    }
    #TWDS_attr_skill .bonus-dexterity1 {
      border-left:2px solid blue;
      border-top:2px solid blue;
      border-right:2px solid blue;
      background-color:#0083;
    }
    #TWDS_attr_skill .bonus-dexterity2 {
      border-left:2px solid blue;
      border-bottom:2px solid blue;
      border-right:2px solid blue;
      background-color:#0083;
    }
    #TWDS_attr_skill .bonus-charisma1 {
      border-left:2px solid yellow;
      border-top:2px solid yellow;
      border-right:2px solid yellow;
      background-color:#8802;
    }
    #TWDS_attr_skill .bonus-charisma2 {
      border-left:2px solid yellow;
      border-bottom:2px solid yellow;
      border-right:2px solid yellow;
      background-color:#8803;
    }
    #TWDS_attr_skill td {
      text-align:center;
    }
    #TWDB_job p {
       text-align:right;
    }
    #TWDS_jobs {
      margin-bottom:1em;
      border-collapse: collapse
    }
    #TWDS_jobs tr, #TWDS_jobs td, #TWDS_jobs th { border:1px solid #888;}
    #TWDS_jobs td { text-align:right;}
    #TWDS_jobs td[data-field=name] { text-align:left; padding:1px 2px; }
    #TWDS_jobs th[data-field=danger] { color: red}
    #TWDS_jobs th[data-field=luck] { color: green}

    div.item span.TWDS_itemusageinfo {
      top:0;
      right:0;
      display:block;
      background-color:#8888;
      color:white;
      box-shadow: 1px 1px 2px #000000;
    }
    .TWDS_joblist_stars {
      opacity:0.5;
      color:green;
      text-shadow: 0 0 0px black;
    }
    .TWDS_joblist_stars.TWDS_joblist_stage_gold {
      color:gold;
    }
    .TWDS_joblist_stars.TWDS_joblist_stage_silver {
      color:silver;
    }
    .TWDS_joblist_stars.TWDS_joblist_stage_bronze {
      color:#cd7f32;
    }
    .TWDS_job_negative {
      color:red;
    }
    .TWDS_job_less {
      color:orange;
    }
    #TWDS_job p {
      text-align:right
    }
    #TWDS_job tr.hidden {
      display:none
    }
    #TWDS_job_filtergroup {
      margin-right:2em;
      display:inline-block;
    }
    #TWDS_job_filterx {
      border-radius:5px;
    }

    .job_bestwearbutton {
      top:-10px !important;
    }
    .job_bestwearbutton .twdb_bestwear {
      position:absolute;
      top:0;
    }
    .job_bestwearbutton .TWDS_getbestwear {
      position:absolute;
      top:0;
      position: absolute;
      top: 40px;
      left: 48px;
    }
  `
  const sty = document.createElement('style')
  sty.textContent = css
  document.body.appendChild(sty)
}
TWDS.insertStyles() // no reason to wait with that.
TWDS.translation_de = {
  CONFIRM_REMOVE: 'Ausrüstungsset $name$ wirklich löschen?',
  SHORT_SHOTWEAPON: ' (Schuss)',
  SHORT_MELEEWEAPON: ' (Schlag)',
  BONUSNAME_dollar: 'Geld für Arbeiten und Duelle',
  BONUSNAME_regen: 'Regeneration im Hotel',
  BONUSNAME_drop: 'Fundchance bei Arbeiten',
  BONUSNAME_experience: 'Erfahrungspunkte für Arbeiten, Duelle und Fortkämpfe',
  BONUSNAME_speed: 'Geschwindigkeit',
  BONUSNAME_luck: 'Glück',
  BONUSNAME_sectordamage: 'Sektorschaden',

  MINDMG_HAND: '$dmg$ Minimalschaden bei Handtreffer und Widerstand >= $res$',
  MINDMG: '$dmg$ Minimalschaden bei Handtreffer und Widerstand um $res$',
  MAXDMG: '$dmg$ Maximalschaden bei Handtreffer und Widerstand um $res$',
  MAXDMG_HEAD: '$dmg$ Maximalschaden bei Kopftreffer und Widerstand <= $res$',

  DMG_HELP: 'Der Schaden hängt von der Waffe, Schadensmodifizierendem Skill, Trefferzone, dem Widerstand des Gegners gegen die Schadensart, und Buffs ab. Buffs sind in den obigen Kalkulationen nicht enthalten.',
  SHOT_RESISTANCE_DEF: 'Widerstand gegen Schußwaffen: Reflex + 25% der Zähigkeit',
  MELEE_RESISTANCE_DEF: 'Widerstand gegen Schlagwaffen: Zähigkeit + 25% des Reflexes',
  VALUE_SUM_TEXT: 'Summe von mittlerem Schaden, Zielen, Ausweichen, entweder Schlagkraft oder Schießen, dem maximalen Widerstand, und dem Maximum von Auftreten oder Taktik.',
  VALUE_SUM_TEXT_MIN: 'Wie oben, nur wurden die Minima statt der Maxima eingerechnet.',
  DODGE_CHANCE_INFO: 'Wenn der Gegner in der letzten Runde gezielt hat (stehen blieb, und sich weder duckte noch nach rechts oder links auswich), wird sein Zielen verdoppelt. Wenn Du in die richtige Richtung duckst/ausweichst, erhältst Du einen Bonus auf Ausweichen (die Höhe ist unbekannt). Nimm diese Werte als Anhaltspunkte, und vergiss nicht, dass der Zufall ein komisches Ding ist.',
  DODGE_CHANCE_AGAINST_AIMING: 'Gegen Zielen $aim$: $chance$%',
  HIT_CHANCE_AGAINST_DODGING: 'Gegen Ausweichen $dodge$: $chance$%',
  AIMING: 'Zielen',
  DODGING: 'Ausweichen',
  RESISTANCE: 'Widerstand',
  DAMAGE: 'Schaden',
  ATTACKING_SET: 'Angriff,',
  AGAINST_MELEE: ' gegen Schlagwaffen',
  AGAINST_SHOT: ' gegen Schußwaffen',
  LABOR_POINTS_FOR_ALL: 'Arbeitspunkte für alle Arbeiten',
  LABOR_POINTS_FOR: 'Arbeitspunkte für $name$',
  NAME: 'Name',
  MENU_LEVEL_SHORT: 'Lv',
  MENU_LEVEL_LONG: 'Dein Level als die Berechnungen gemacht wurden.',
  MENU_AIM_SHORT: 'Ziel',
  MENU_AIM_LONG: 'Zielen.',
  MENU_APPEARANCE_SHORT: 'Auft.',
  MENU_APPEARANCE_LONG: 'Auftreten. Wird mit Taktik verglichen, und gibt einen Bonus auf Zielen.',
  MENU_DMGBON_SHORT: 'SchBo',
  MENU_DMGBON_LONG: 'Schadensbonus-Skill: Entweder Schlagkraft oder Schießen',
  MENU_DODGING_SHORT: 'Ausw',
  MENU_DODGING_LONG: 'Ausweichen.',
  MENU_TACTICS_SHORT: 'Takt',
  MENU_TACTICS_LONG: 'Taktik. Wird mit Auftreten des Angreifers verglichen, und gibt, wenn höher, einen Bonus auf Zielen.',
  MENU_RES_MELEE_SHORT: 'WNah',
  MENU_RES_MELEE_LONG: 'Widerstand gegen Schlagwaffen: Zähigkeit plus 25% Reflex.',
  MENU_RES_SHOT_SHORT: 'WFern',
  MENU_RES_SHOT_LONG: 'Widerstand gegen Schußwaffen: Reflex plus 25% Zähigkeit.',
  MENU_DAMAGE_SHORT: 'Scha.',
  MENU_DAMAGE_LONG: 'Der durchschnittliche Schaden.',
  MENU_DELETE_SHORT: 'Löschen',
  BONUS_INTRO: 'Diese Seite zeigt die Boni der aktuell angelegten Ausrüstung, ohne Deine Attribute und Fähigkeiten.',
  TITLE_ATTR_SKILLS_BONUS: 'Attribute und Skills',
  TITLE_OTHER_BONUS: 'Andere Boni',
  TABNAME_BONUS: 'Aktuelle Boni',
  TABNAME_EQUIPMENT: 'Ausrüstungssets',
  TABNAME_PEOPLE: 'Leute',
  EQ_SET_REMOVE: 'Löschen',
  EQ_SET_REMOVE_MOUSEOVER: 'Entfernt diese Ausrüstungskombination von der Liste.',
  EQ_SET_WEAR: 'Tragen',
  EQ_SET_WEAR_MOUSEOVER: 'Diese Ausrüstungskombination anziehen.',
  REGEX_DUEL_WON: '>([^>]+) gewinnt',
  REGEX_DUEL_WAGES: 'Lohn" .><.th><td>([^<]+)',
  REGEX_DUEL_XP: 'Erfahrungspunkte" .><.th><td>([^<]+)',
  REGEX_DUEL_DAMAGE: 'Schaden" .><.th><td>([^<]+)',
  REGEX_DUEL_ME_HAS_ATTACKED: '^Duell: $me$ vs. (.+)',
  REGEX_DUEL_ME_WAS_ATTACKED: '^Duell: (.*) vs. $me$',
  PEOPLETAB_NUM_INFO: '$num$ Angriffe von mir',
  PEOPLETAB_NUM_ATTACKS_WON: '$num$ Angriffe gewonnen',
  PEOPLETAB_NUM_DEFENCES_WON: '$num$ Verteidigungen gewonnen',
  PEOPLETAB_DOLLARS_INFO: '$$dollars_me$ gewann ich<br>$$dollars_other$ gewann $opponent$',
  PEOPLETAB_DAMAGE_INFO: '$dmg_done_me$ Schaden durch mich<br>$dmg_done_other$ Schaden durch $opponent$',

  PEOPLETAB_MENU_OPPONENT: 'Gegner',
  PEOPLETAB_MENU_OPPONENT_MOUSEOVER: 'Der Name des Gegners',
  PEOPLETAB_MENU_DUELS: 'Duelle',
  PEOPLETAB_MENU_TOTAL: 'Insgesamt',
  PEOPLETAB_MENU_TOTAL_MOUSEOVER: 'Die Gesamtzahl der Duelle gegen diesen Gegner',
  PEOPLETAB_MENU_VICTORIES: 'Siege',
  PEOPLETAB_MENU_VICTORIES_MOUSEOVER: 'Anzahl der von Dir gewonnenen Duelle',
  PEOPLETAB_MENU_LOSSES: 'Nied.',
  PEOPLETAB_MENU_LOSSES_MOUSEOVER: 'Die Anzahl Deiner Niederlagen',
  PEOPLETAB_MENU_PLUSMINUS: '+-',
  PEOPLETAB_MENU_PLUSMINUS_MOUSEOVER: 'Siege abzüglich Niederlagen',
  PEOPLETAB_MENU_DOLLAR: 'Dollar',
  PEOPLETAB_MENU_DOLLARSUM: 'Summe',
  PEOPLETAB_MENU_DOLLARSUM_MOUSEOVER: 'Die Gesamtsumme der von Dir gewonnenen Dollars abzüglich der vom Gegner gewonnenen Dollars. Zusätzliche Verluste bei KOs werden nicht berücksichtigt.',
  PEOPLETAB_MENU_DMG_DONE: 'Gemachter Schaden',
  PEOPLETAB_MENU_DMG_BY_ME: 'Ich',
  PEOPLETAB_MENU_DMG_BY_ME_MOUSEOVER: 'Summe der durch Dich gemachten Schäden.',
  PEOPLETAB_MENU_DMG_BY_OTHER: 'Gegner',
  PEOPLETAB_MENU_DMG_BY_OTHER_MOUSEOVER: 'Summe der durch den Gegner gemachten Schäden.',
  PEOPLETAB_MENU_DMG_DIFF: '+-',
  PEOPLETAB_MENU_DMG_DIFF_MOUSEOVER: 'Schaden durch Dich, abzüglich Schaden an Dir',
  PEOPLETAB_MENU_XP: 'Erfahrung für',
  PEOPLETAB_MENU_XP_ME: 'mich',
  PEOPLETAB_MENU_XP_ME_MOUSEOVER: 'Erfahrungspunkte, die Du erhalten hast',
  PEOPLETAB_MENU_XP_OTHER: 'Gegner',
  PEOPLETAB_MENU_XP_OTHER_MOUSEOVER: 'Erfahrungspunkte, die Dein Gegner erhalten hat',
  PEOPLETAB_DELETE_DATA: 'Daten löschen',
  PEOPLETAB_IMPORT: 'Neue Duelle importieren',
  SPECIAL_EQUIPMENT_HELPER: 'Spezialausrüstungen',
  SPECIAL_EQUIPMENT_INFO: 'Bei einem Klick auf folgenden Buttons berechnet der Computer entsprechend optimierte Ausrüstungskombinationen. Das kann auf langsamen Computer einige Zeit dauern.',
  SPECIAL_BONUS: 'Bonus',
  SPECIAL_BUTTON_SPEED: 'Geschwindigkeit',
  SPECIAL_BUTTON_XP: 'Erfahrung',
  SPECIAL_BUTTON_REGEN: 'Regeneration',
  SPECIAL_BUTTON_LUCK: 'Glück',
  SPECIAL_BUTTON_PRAY: 'Beten',
  SPECIAL_BUTTON_DOLLAR: 'Verdienst',
  SPECIAL_BUTTON_DROP: 'Produktfundchance',
  SPECIAL_SKILLS: 'Fertigkeiten',
  SPECIAL_DUELS: 'Duelle',
  SPECIAL_DUELS_INFO: 'Diese Funktionen stellen halbwegs brauchbare Ausrüstung für Duelle zusammen. Sie ersetzen aber nicht das Denken, und sie können nicht die "beste" Ausrüstung finden, denn die gibt es nicht, und sie wissen auch nichts über Deinen Gegner',
  SPECIAL_DUELS_DMG: 'Schadensmacher',
  SPECIAL_DUELS_DMG_R_A: 'Schußwaffe, Angriff',
  SPECIAL_DUELS_DMG_R_D: 'Schußwaffe, Verteidigung',
  SPECIAL_DUELS_DMG_M_A: 'Schlagwaffe, Angreifer',
  SPECIAL_DUELS_DMG_M_D: 'Schlagwaffe, Verteidigung',
  SPECIAL_DUELS_DODGING: 'Zappler (Ausweicher)',
  SPECIAL_DUELS_DODGE_R_A: 'Schußwaffe, Angriff',
  SPECIAL_DUELS_DODGE_R_D: 'Schußwaffe, Verteidigung',
  SPECIAL_DUELS_DODGE_M_A: 'Schlagwaffe, Angriff',
  SPECIAL_DUELS_DODGE_M_D: 'Schlagwaffe, Verteidigung',
  SPECIAL_DUELS_RES: 'Widerständler',
  SPECIAL_DUELS_RES_AR_A: 'Angriff gegen Schußwaffe',
  SPECIAL_DUELS_RES_AR_D: 'Verteidigung gegen Schußwaffe',
  SPECIAL_DUELS_RES_AM_A: 'Angriff gegen Schlagwaffe',
  SPECIAL_DUELS_RES_AM_D: 'Verteidigung gegen Schlagwaffe',
  SPECIAL_DUELS_RES_D: 'Verteidigung gegen ???',

  SPECIAL_FB: 'Fortkämpfe',
  SPECIAL_FB_INFO: 'Auch diese Funktionen suchen akzeptablen Kompromissen. Erstaunlicherweise finden sie gelegentlich welche (ja, wirklich). Sie können aber nicht für jede Rolle und Situation die perfekte Ausrüstung finden, Denken ersetzen sie also nicht.',
  SPECIAL_FB_TANK_ATT: 'LP/Tank, Att.',
  SPECIAL_FB_TANK_DEF: 'LP/Tank, Def.',
  SPECIAL_FB_DMG_ATT: 'Schadensmacher, Att.',
  SPECIAL_FB_DMG_DEF: 'Schadensmacher, Def.',

  CLOTHCACHE_BUTTON: 'Gemerkt [$agestr$]',
  CLOTHCACHE_BUTTON_MOUSEOVER: 'Die zuletzt berechnete Ausrüstung anlegen',

  DUMMY: 'Dummy'
}
TWDS.translation = {}
TWDS.lang = null
// this once read the translation, now it just links.
TWDS.fixTranslation = function fixTranslation () {
  let l = Game.locale
  l = l.replace(/-.*/, '')
  l = l.replace(/_.*/, '')
  const s = 'translation_' + l
  if (s in TWDS) {
    TWDS.translation = TWDS[s]
    TWDS.lang = l
  }
}
TWDS._ = function _ (s, def, para) {
  let work
  if (TWDS.lang === null) {
    TWDS.fixTranslation()
  }
  if (s in TWDS.translation) {
    work = TWDS.translation[s]
  } else {
    work = def
    if (TWDS.lang !== 'en') {
      console.log('_', 'using default translation for ', s, '=', def)
    }
  }
  if (typeof para !== 'undefined') {
    for (const i of Object.keys(para)) {
      work = work.replace(`$${i}$`, para[i])
    }
  }
  return work
}
TWDS.getComboBonus = function (combo) {
  const usedSets = {}
  const allBonus = {}
  let needRound = {}

  const pimp = function (level, value) {
    let plus
    if (!level) return value
    if (value < 1) {
      plus = value * level / 10
      plus = Math.round(plus * 100) / 100
    } else {
      plus = Math.max(1, value / 10 * level)
      plus = Math.round(plus)
    }
    return value + plus
  }

  const handleOneGoldenBonusThing = function (name, value, source) {
    if (value) {
      if (!(name in allBonus)) {
        allBonus[name] = [0, []]
      }
      allBonus[name][0] += value
      allBonus[name][1].push([value, source])
      // console.log('updated', name, ' with +', value, 'to', allBonus[name], 'for', source)
    }
  }

  const handleRounding = function (value, method) {
    switch (method) {
      case 'ceil':
        return Math.ceil(value)
      case 'floatceil':
        return Math.ceil(100 * value) / 100
      case 'floor':
        return Math.floor(value)
      case 'round':
        return Math.round(value)
      default:
        return value
    }
  }

  const handleOneBonusThing = function (entry, doRound, wtype, source, ilv = 0) {
    let realtype
    let value
    if (entry.type === 'character') {
      realtype = entry.bonus.name
      if (typeof realtype === 'undefined') {
        realtype = entry.bonus.type
      }
      value = entry.bonus.value
      if (entry.bonus.isSector) {
        realtype = 'sector' + realtype
      }
    } else if (entry.type === 'job') {
      realtype = `job_${entry.job}`
      value = entry.value
    } else if (entry.type === 'fortbattle') {
      realtype = entry.name
      value = entry.value
      if (entry.isSector) {
        realtype += '/sector'
      }
    } else {
      realtype = entry.type
      value = entry.value
    }
    if (wtype && realtype === 'damage') {
      if (wtype === 1) realtype = 'dueldamage'
    }
    if (!(realtype in allBonus)) {
      allBonus[realtype] = [0, []]
    }
    if ('key' in entry) {
      if (entry.key === 'level') {
        value *= Character.level
      } else {
        console.log('unknown bonus key', entry.key, source)
        return false
      }
    }
    value = pimp(ilv, value)
    value = handleRounding(value, entry.roundingMethod)
    allBonus[realtype][0] += value
    allBonus[realtype][1].push([value, source])
    if (value) {
      // console.log('updated', realtype, ' with +', value, 'to', allBonus[realtype], source)
    }
    return true
  }

  const handleOneItem = function (item) {
    const bo = item.bonus
    let wtype = 0
    const ilv = item.item_level
    if (item.type === 'right_arm') wtype = 1
    if (item.type === 'left_arm') wtype = 2
    // console.log('ITEM', item, wtype)
    for (let j = 0; j < bo.item.length; j++) {
      handleOneBonusThing(bo.item[j], true, wtype, item.name, ilv)
    }
    // golden gun and such things.
    handleOneGoldenBonusThing('ataque', bo.fortbattle.offense, item.name)
    handleOneGoldenBonusThing('defensa', bo.fortbattle.defense, item.name)
    handleOneGoldenBonusThing('resistencia', bo.fortbattle.resistance, item.name)
    handleOneGoldenBonusThing('ataque/sector', bo.fortbattlesector.offense, item.name)
    handleOneGoldenBonusThing('defensa/sector', bo.fortbattlesector.defense, item.name)
    handleOneGoldenBonusThing('daño/sector', bo.fortbattlesector.damage, item.name)
  }

  for (const [k, v] of Object.entries(combo)) {
    if (typeof v === 'number') {
      combo[k] = ItemManager.get(v)
    }
  }

  const setlist = west.storage.ItemSetManager._setList
  for (const item of combo) { // this is item.obj!
    handleOneItem(item)
    const set = item.set
    if (!(set in setlist)) continue
    if (!(set in usedSets)) {
      usedSets[set] = []
    }
    usedSets[set].push(item.item_base_id)
  }

  // setbonus
  for (const setcode in usedSets) {
    const setHas = setlist[setcode].items.length
    const weHave = usedSets[setcode].length
    needRound = {}
    for (let numThings = 1; numThings <= Math.min(setHas, weHave); numThings++) {
      const bonuslist = setlist[setcode].bonus[numThings]
      if (typeof bonuslist === 'undefined') {
        continue
      }
      // console.log("setdata",set,setlist[set]);
      // console.log("bonusdata",weHave,setlist[set].bonus[weHave]);
      for (let i = 0; i < bonuslist.length; i++) {
        handleOneBonusThing(bonuslist[i], false, 0,
          `${setlist[setcode].name} (#${numThings})`)
      }
    }
    for (const field of Object.keys(needRound)) {
      allBonus[field][0] = Math.ceil(allBonus[field][0])
    }
  }
  console.log('total bonus', allBonus)
  return allBonus
}
TWDS.getWearBonus = function () {
  const list = []
  for (const item of Object.values(Wear.wear)) {
    list.push(item.obj)
  }
  return TWDS.getComboBonus(list)
}
TWDS.initBonusDisplay = function (container) {
  const ele = function (tr, what, t) {
    const td = document.createElement(what)
    td.textContent = t
    tr.appendChild(td)
  }
  const vele = function (tr, what, val) {
    const td = document.createElement(what)
    if (val !== 0) {
      td.textContent = val[0]
      let ti = ''
      for (const pair of Object.values(val[1])) {
        ti += `${pair[0]} ${pair[1]}<br>`
      }
      td.title = ti
    } else {
      td.innerHTML = '&nbsp;'
    }
    tr.appendChild(td)
  }
  const ab = TWDS.getWearBonus()

  const intro = document.createElement('p')
  intro.textContent = TWDS._('BONUS_INTRO',
    'Esta página muestra los valores de bonificación del equipo actual, con sus atributos y habilidades.')
  container.appendChild(intro)

  let h1 = document.createElement('h1')
  h1.textContent = TWDS._('TITLE_ATTR_SKILLS_BONUS',
    'Atributos y Habilidades')
  container.appendChild(h1)

  let tab = document.createElement('table')
  tab.id = 'TWDS_attr_skill'
  let tr
  tr = document.createElement('tr')
  tr.className = 'bonus-strength1'
  tab.appendChild(tr)
  ele(tr, 'th', CharacterSkills.attributes.strength.name)
  ele(tr, 'th', CharacterSkills.skills.build.name)
  ele(tr, 'th', CharacterSkills.skills.punch.name)
  ele(tr, 'th', CharacterSkills.skills.tough.name)
  ele(tr, 'th', CharacterSkills.skills.endurance.name)
  ele(tr, 'th', CharacterSkills.skills.health.name)
  tr = document.createElement('tr')
  tr.className = 'bonus-strength2'
  tab.appendChild(tr)
  vele(tr, 'td', ab.strength || 0)
  vele(tr, 'td', ab.build || 0)
  vele(tr, 'td', ab.punch || 0)
  vele(tr, 'td', ab.tough || 0)
  vele(tr, 'td', ab.endurance || 0)
  vele(tr, 'td', ab.health || 0)
  container.appendChild(tab)

  tr = document.createElement('tr')
  tr.className = 'bonus-flexibility1'
  tab.appendChild(tr)
  ele(tr, 'th', CharacterSkills.attributes.flexibility.name)
  ele(tr, 'th', CharacterSkills.skills.ride.name)
  ele(tr, 'th', CharacterSkills.skills.reflex.name)
  ele(tr, 'th', CharacterSkills.skills.dodge.name)
  ele(tr, 'th', CharacterSkills.skills.hide.name)
  ele(tr, 'th', CharacterSkills.skills.swim.name)
  tr = document.createElement('tr')
  tr.className = 'bonus-flexibility2'
  tab.appendChild(tr)
  vele(tr, 'td', ab.flexibility || 0)
  vele(tr, 'td', ab.ride || 0)
  vele(tr, 'td', ab.reflex || 0)
  vele(tr, 'td', ab.dodge || 0)
  vele(tr, 'td', ab.hide || 0)
  vele(tr, 'td', ab.swim || 0)

  tr = document.createElement('tr')
  tr.className = 'bonus-dexterity1'
  tab.appendChild(tr)
  ele(tr, 'th', CharacterSkills.attributes.dexterity.name)
  ele(tr, 'th', CharacterSkills.skills.aim.name)
  ele(tr, 'th', CharacterSkills.skills.shot.name)
  ele(tr, 'th', CharacterSkills.skills.pitfall.name)
  ele(tr, 'th', CharacterSkills.skills.finger_dexterity.name)
  ele(tr, 'th', CharacterSkills.skills.repair.name)
  tr = document.createElement('tr')
  tr.className = 'bonus-dexterity2'
  tab.appendChild(tr)
  vele(tr, 'td', ab.dexterity || 0)
  vele(tr, 'td', ab.aim || 0)
  vele(tr, 'td', ab.shot || 0)
  vele(tr, 'td', ab.pitfall || 0)
  vele(tr, 'td', ab.finger_dexterity || 0)
  vele(tr, 'td', ab.repair || 0)

  tr = document.createElement('tr')
  tr.className = 'bonus-charisma1'
  tab.appendChild(tr)
  ele(tr, 'th', CharacterSkills.attributes.charisma.name)
  ele(tr, 'th', CharacterSkills.skills.leadership.name)
  ele(tr, 'th', CharacterSkills.skills.tactic.name)
  ele(tr, 'th', CharacterSkills.skills.trade.name)
  ele(tr, 'th', CharacterSkills.skills.animal.name)
  ele(tr, 'th', CharacterSkills.skills.appearance.name)
  tr = document.createElement('tr')
  tr.className = 'bonus-charisma2'
  tab.appendChild(tr)
  vele(tr, 'td', ab.charisma || 0)
  vele(tr, 'td', ab.leadership || 0)
  vele(tr, 'td', ab.tactic || 0)
  vele(tr, 'td', ab.trade || 0)
  vele(tr, 'td', ab.animal || 0)
  vele(tr, 'td', ab.appearance || 0)

  container.appendChild(tab)

  h1 = document.createElement('h1')
  h1.textContent = TWDS._('TITLE_OTHER_BONUS',
    'Otras bonificaciones')
  container.appendChild(h1)

  tab = document.createElement('table')
  container.appendChild(tab)
  tab.id = 'TWDS_bonuslist'

  const names = []
  for (const k of Object.keys(ab)) {
    let name
    if (CharacterSkills.allAttrKeys.includes(k)) continue
    if (CharacterSkills.allSkillKeys.includes(k)) continue
    if (k === 'damage') continue
    if (k === 'dueldamage') continue
    const m = k.match(/^job_(.*)/, k)
    if (m && m[1] === 'all') {
      name = TWDS._('LABOR_POINTS_FOR_ALL',
        'puntos de trabajo para todos los trabajos')
    } else if (m) {
      const job = JobList.getJobById(m[1])
      name = TWDS._('LABOR_POINTS_FOR',
        'puntos de trabajo hacia $name$',
        { name: job.name })
    } else {
      name = TWDS._(`BONUSNAME_${k}`, k)
    }
    names.push([k, name])
  }
  names.sort((a, b) => a[1].localeCompare(b[1]))
  for (const entry of Object.values(names)) {
    const key = entry[0]
    const name = entry[1]
    tr = document.createElement('tr')
    tab.appendChild(tr)
    let v = ab[key][0]
    if (key === 'experience' || key === 'dollar' || key === 'drop' || key === 'luck' ||
      key === 'regen' || key === 'speed') {
      v = `+${Math.round(v * 1000) / 10}%`
    }
    ab[key][0] = v
    vele(tr, 'td', ab[key])

    const td = document.createElement('td')
    td.setAttribute('colspan', 5)
    td.textContent = name
    tr.appendChild(td)
  }
}
TWDS.getBonusContent = function () {
  const div = document.createElement('div')
  div.id = 'TWDS_bonus'
  TWDS.initBonusDisplay(div)
  return div
}
TWDS.activateBonusTab = function () {
  TWDS.activateTab('bonus')
}
TWDS.bonusStartFunction = function () {
  TWDS.registerTab('bonus',
    TWDS._('TABNAME_BONUS', 'Bonus'),
    TWDS.getBonusContent,
    TWDS.activateBonusTab,
    true)
}
TWDS.registerStartFunc(TWDS.bonusStartFunction)

// vim: tabstop=2 shiftwidth=2 expandtab
TWDS.describeItemCombo = function (singleItems) {
  const setsInUse = {}
  const setNames = []
  const names = []
  const setlist = west.storage.ItemSetManager._setList
  for (let i = 0; i < singleItems.length; i++) {
    if (typeof singleItems[i] === 'number') {
      const ii = singleItems[i]
      let obj = ItemManager.get(ii)
      if (typeof obj === 'undefined') {
        // work around clothcalc
        if (typeof ItemManager.__twdb__get === 'function') {
          obj = ItemManager.__twdb__get(ii)
        }
      }
      if (typeof obj === 'undefined') {
        continue
      }
      singleItems[i] = obj
    }
  }
  for (let i = 0; i < singleItems.length; i++) {
    const item = singleItems[i]
    const set = item.set
    if (!(set in setlist)) continue
    if (!(set in setsInUse)) {
      setsInUse[set] = []
    }
    setsInUse[set].push(item.item_base_id)
  }

  const numDuelWeaponsInSet = function (set) {
    const setItems = setlist[set].items
    let numDuelweaponsContained = 0
    for (let i = 0; i < setItems.length; i++) {
      const item = ItemManager.getByBaseId(setItems[i])
      if (item.type === 'right_arm' || item.type === 'left_arm') {
        numDuelweaponsContained++
      }
    }
    return numDuelweaponsContained
  }

  for (const i in setsInUse) {
    const setItemCount = setlist[i].items.length
    const setItemsWorn = setsInUse[i].length
    if (setItemsWorn === 1) {
      continue
    }
    const nd = numDuelWeaponsInSet(i)
    let name = ''
    if (setItemCount !== setItemsWorn) {
      if (nd > 1 && setItemsWorn === setItemCount - 1) {
        name = setlist[i].name
      } else {
        name = setlist[i].name + ' (' + setItemsWorn + '/' + setItemCount + ')'
      }
    } else {
      name = setlist[i].name
    }
    if (nd > 0) {
      if (Wear.wear.right_arm.obj.sub_type === 'shot') {
        name += TWDS._('SHORT_SHOTWEAPON', ' (shot)')
      } else if (Wear.wear.right_arm.obj.sub_type !== 'shot') {
        name += TWDS._('SHORT_MELEEWEAPON', ' (melee)')
      }
    }
    names.push(name)
  }
  setNames.sort()

  for (let i = 0; i < singleItems.length; i++) {
    const item = singleItems[i]
    const set = item.set
    if (!(set in setsInUse) || setsInUse[set].length < 2) {
      names.push(item.name)
    }
  }

  names.sort()
  let is = ''
  for (let i = 0; i < setNames.length; i++) {
    if (is > '') { is += ', ' }
    is += setNames[i]
  }
  for (let i = 0; i < names.length; i++) {
    if (is > '') { is += ', ' }
    is += names[i]
  }
  return is
}
// reading the current skill values, and the items
TWDS.getEquipmentData = function () {
  const getOne = function (s) {
    const x = CharacterSkills.getSkill(s)
    return x.bonus + x.points
  }
  const schlag = getOne('punch')
  const zaeh = getOne('tough')
  const hp = getOne('health')
  const refl = getOne('reflex')
  const ausw = getOne('dodge')
  const ziel = getOne('aim')
  const schuss = getOne('shot')
  const takt = getOne('tactic')
  const auft = getOne('appearance')
  const meleeRes = zaeh + refl / 4
  const shotRes = refl + zaeh / 4
  const setNames = []
  const names = []
  const ids = []

  const singleItems = []
  const setsInUse = {}
  for (const item of Object.keys(Wear.wear)) {
    ids.push(Wear.wear[item].obj.item_id)
    singleItems.push(Wear.wear[item].obj)
  }
  const setlist = west.storage.ItemSetManager._setList
  for (let i = 0; i < singleItems.length; i++) {
    const item = singleItems[i]
    const set = item.set
    if (!(set in setlist)) continue
    if (!(set in setsInUse)) {
      setsInUse[set] = []
    }
    setsInUse[set].push(item.item_base_id)
  }
  const numDuelWeaponsInSet = function (set) {
    const setItems = setlist[set].items
    let numDuelweaponsContained = 0
    for (let i = 0; i < setItems.length; i++) {
      const item = ItemManager.getByBaseId(setItems[i])
      if (item.type === 'right_arm' || item.type === 'left_arm') {
        numDuelweaponsContained++
      }
    }
    return numDuelweaponsContained
  }
  for (const i in setsInUse) {
    const setItemCount = setlist[i].items.length
    const setItemsWorn = setsInUse[i].length
    if (setItemsWorn === 1) {
      continue
    }
    const nd = numDuelWeaponsInSet(i)
    console.log('set', i, setlist[i], 'has dw', nd)
    let name = ''
    if (setItemCount !== setItemsWorn) {
      if (nd > 1 && setItemsWorn === setItemCount - 1) {
        name = setlist[i].name
      } else {
        name = setlist[i].name + ' (' + setItemsWorn + '/' + setItemCount + ')'
      }
    } else {
      name = setlist[i].name
    }
    if (nd > 0) {
      if (Wear.wear.right_arm.obj.sub_type === 'shot') {
        name += TWDS._('SHORT_SHOTWEAPON', ' (shot)')
      } else if (Wear.wear.right_arm.obj.sub_type !== 'shot') {
        name += TWDS._('SHORT_MELEEWEAPON', ' (melee)')
      }
    }
    names.push(name)
  }
  setNames.sort()

  for (let i = 0; i < singleItems.length; i++) {
    const item = singleItems[i]
    const set = item.set
    if (!(set in setsInUse) || setsInUse[set].length < 2) {
      names.push(item.name)
    }
  }

  names.sort()
  let is = ''
  for (let i = 0; i < setNames.length; i++) {
    if (is > '') { is += ', ' }
    is += setNames[i]
  }
  for (let i = 0; i < names.length; i++) {
    if (is > '') { is += ', ' }
    is += names[i]
  }

  ids.sort()
  let hashstr = ''
  for (let i = 0; i < ids.length; i++) {
    hashstr += ',' + ids[i]
  }

  const dmg = Wear.wear.right_arm.obj.getDamage(Character)
  const hash = TWDS.cyrb53(hashstr)
  const key = 'TWDS_h_' + hash
  const tmp = window.localStorage.getItem(key)
  let o = {}
  o.name = hash
  if (tmp) {
    o = JSON.parse(tmp)
  }
  o.level = Character.level
  o.item_ids = ids
  o.items = is
  o.schlag = schlag
  o.zaeh = zaeh
  o.hp = hp
  o.refl = refl
  o.ausw = ausw
  o.ziel = ziel
  o.schuss = schuss
  o.takt = takt
  o.auft = auft
  o.wid_schlag = meleeRes
  o.wid_schuss = shotRes
  o.dmg_abs_min = dmg.min * 0.25
  o.dmg_min = dmg.min
  o.dmg_max = dmg.max
  o.dmg_abs_max = dmg.max * 1.75 * 1.5
  o.shot = (Wear.wear.right_arm.obj.sub_type === 'shot')

  const s = JSON.stringify(o)
  return [key, s]
}

TWDS.fillEquipmentTab = function (tab) {
  const l = []
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i)
    if (!k.match(/^TWDS_h_/)) {
      continue
    }
    const s = window.localStorage.getItem(k)
    const t = {}
    const o = JSON.parse(s)
    t.name = o.name
    t.key = k
    l.push(t)
  }
  l.sort(function (a, b) {
    a = a.name
    b = b.name
    if (typeof a !== 'string') { a = a + '' }
    if (typeof b !== 'string') { b = b + '' }
    return a.localeCompare(b)
  })
  for (const i in l) {
    const k = l[i].key
    const s = window.localStorage.getItem(k)
    if (s > '') {
      const o = JSON.parse(s)
      TWDS.add1ToTab(tab, i, k, o)
    }
  }
  TWDS.highlightEquipmentTable(tab)
  return l.length
}
TWDS.highlightEquipmentTable = function (tab) {
  const rows = $('.datarow', tab)
  const merk = {}
  $(rows).each(function () {
    $('td[data-field]', this).each(function () {
      const f = this.dataset.field
      if (!(f in merk)) {
        merk[f] = []
      }
      merk[f].push(parseInt(this.textContent))
    })
  })
  for (const k in merk) {
    merk[k].sort(function (a, b) { return b - a })
  }
  $(rows).each(function () {
    $('td[data-field]', this).each(function () {
      const f = this.dataset.field
      const v = parseInt(this.textContent)
      if (v >= merk[f][0]) {
        this.classList.add('best')
      } else if (v >= 0.90 * merk[f][0]) {
        this.classList.add('verygood')
      } else if (v >= 0.75 * merk[f][0]) {
        this.classList.add('good')
      } else if (v >= 0.5 * merk[f][0]) {
        this.classList.add('ok')
      } else {
        this.classList.add('other')
      }
    })
  })
  console.log('HL', merk)
}
TWDS.classifyEquipment = function (o) {
  let schaden = o.schlag
  if (o.shot) schaden = o.schuss
  const widerstand = Math.max(o.wid_schuss, o.wid_schlag)

  let avg = o.ziel + o.ausw + schaden + widerstand
  avg /= 4

  const ca = [
    [o.ziel, TWDS._('AIMING', 'Aiming')],
    [o.ausw, TWDS._('DODGING', 'Dodging')],
    [widerstand, TWDS._('RESISTANCE', 'Resistance')],
    [schaden, TWDS._('DAMAGE', 'Damage')]
  ]
  ca.sort(function (a, b) {
    return b[0] - a[0]
  })

  let type = ''
  if (o.auft > o.takt + 100) { type = TWDS._('ATTACKING_SET', 'Attacking,') } else if (o.takt > o.auft + 100) { type = TWDS._('ATTACKING_SET', 'Defending,') }
  let sep = ' '
  for (let i = 0; i < ca.length; i++) {
    if (ca[i][0] > avg) {
      type += sep
      sep = '/'
      if (ca[i][0] > avg * 1.33) {
        type += '<b>'
        type += ca[i][1]
        type += '</b>'
      } else {
        type += ca[i][1]
      }
    }
  }
  for (let i = 0; i < ca.length; i++) {
    if (ca[i][0] < avg * 0.5) {
      type += sep
      sep = '/'
      type += '<strike>'
      type += ca[i][1]
      type += '</strike>'
    }
  }

  if (o.wid_schlag > o.wid_schuss + 100) { type += TWDS._('AGAINST_MELEE', ' against melee weapons') }
  if (o.wid_schuss > o.wid_schlag + 100) { type += TWDS._('AGAINST_SHOT', ' against shot weapons') }
  return type
}
/*
  name  - Name der Ausrüstung (oder hash)
  Fn    - Funktionen (löschen, anlegen)
  Lv    - Level bei Anlegen / Updaten
  Zielen - mit Mouseover für Chancen
  Auftreten
  Schuß/Schlag
  Ausweichen - mit Mouseover für Chancen
  Taktik
  Widerstand Nah - Widerstand gegen Schlag
  Widerstand Fern - Widerstand gegen Schuss
  Schaden - mit Mouseover
 */
TWDS.add1ToTab = function (tab, i, key, o) {
  const appOne = function (tr, v0, dn = null, ti = null) {
    const td = document.createElement('td')
    let v = Math.round(v0)
    if (isNaN(v)) { v = v0 }
    td.textContent = v
    if (dn != null) {
      td.dataset.field = dn
    }
    if (ti != null) {
      td.title = ti
    }
    tr.appendChild(td)
  }
  const calcChance = function (ziel, aw) {
    let t = 0
    let v = 0
    for (let i = 1; i < ziel + 5; i++) {
      for (let j = 1; j < aw + 5; j++) {
        v++
        if (i > j) {
          t++
        }
      }
    }
    return Math.round(t / v * 1000) / 10
  }
  const tr = document.createElement('tr')
  tr.classList.add('datarow')
  tr.dataset.key = key
  tab.appendChild(tr)

  let baseValues = ''
  baseValues += o.ziel + ' ' + CharacterSkills.keyNames.aim + '<br>'
  baseValues += o.schuss + ' ' + CharacterSkills.keyNames.shot + '<br>'
  baseValues += o.schlag + ' ' + CharacterSkills.keyNames.punch + '<br>'
  baseValues += o.ausw + ' ' + CharacterSkills.keyNames.dodge + '<br>'
  baseValues += o.refl + ' ' + CharacterSkills.keyNames.reflex + '<br>'
  baseValues += o.zaeh + ' ' + CharacterSkills.keyNames.tough + '<br>'
  baseValues += o.auft + ' ' + CharacterSkills.keyNames.appearance + '<br>'
  baseValues += o.takt + ' ' + CharacterSkills.keyNames.tactic + '<br>'
  baseValues += o.hp + ' ' + CharacterSkills.keyNames.health + '<br>'

  const classification = TWDS.classifyEquipment(o)

  // Spalte 1: Name der Ausrüstung, mit Items und Werten aus Mouseover.
  const th = document.createElement('th')
  th.textContent = o.name
  th.title = o.items + '<br>' + classification + '</br>' + baseValues
  th.onclick = 'TWDS.nameEdit()'
  th.classList.add('TWDS_nameeditTrigger')
  tr.appendChild(th)

  // Spalte 2: Anziehen
  let td = document.createElement('td')
  tr.appendChild(td)
  let but = TWDS.createButton(
    TWDS._('EQ_SET_WEAR', 'usar'), {
      title: TWDS._('EQ_SET_WEAR_MOUSEOVER', 'Cambiar a esta equipación'),
      classList: ['TWDS_wear']
    })
  td.appendChild(but)

  let aimChanceText = ''

  for (let aw = 100; aw <= 1500; aw += 100) {
    let c = calcChance(o.ziel, aw)
    c = Math.round(c * 100) / 100
    aimChanceText += TWDS._('HIT_CHANCE_AGAINST_DODGING',
      'Against dodging $dodge$: $chance$%', {
        dodge: aw,
        chance: c
      })
    aimChanceText += '<br>'
  }
  let dodgeChanceText = ''
  for (let ziel = 100; ziel <= 1500; ziel += 100) {
    let c = 100 - calcChance(ziel, o.ausw)
    c = Math.round(c * 100) / 100
    dodgeChanceText += TWDS._('DODGE_CHANCE_AGAINST_AIMING',
      'Against aiming $aim$: $chance$%', {
        aim: ziel,
        chance: c
      })
    dodgeChanceText += '<br>'
  }
  dodgeChanceText += TWDS._('DODGE_CHANCE_INFO',
  `
    If the opponent aimed and didn't dodge or duck in the last round, the aiming value is doubled. If you dodge/duck in the right direction, your chance to dodge is better (the amount is not known). So take these chances with a grain of salt.

  `)
  let sum = (o.dmg_min + o.dmg_max) / 2 + o.ziel + o.ausw
  if (o.shot) sum += o.schuss; else sum += o.schlag
  const sum1 = sum + Math.max(o.wid_schlag, o.wid_schuss) + Math.max(o.takt, o.auft)
  const sum2 = sum + Math.min(o.wid_schlag, o.wid_schuss) + Math.min(o.takt, o.auft)
  let sumText = sum1 + ' ' + TWDS._('VALUE_SUM_TEXT',
    `Sum of average damage, aiming, dodging, either vigor or shooting, 
    the maximum resistance value, and the maximum of appearance and tactics.`) + '<br>'
  sumText += sum2 + ' ' + TWDS._('VALUE_SUM_TEXT_MIN',
    'As above, with the two maximums replaced with the minimums')

  // Spalte 3: Level
  appOne(tr, o.level, null, sumText)
  // Spalte 4: Zielen
  appOne(tr, o.ziel, 'ziel', aimChanceText)
  // Spalte 5: Auftreten
  appOne(tr, o.auft, 'auft')
  // Spalte 6: Schuß oder Schlag
  if (o.shot) {
    appOne(tr, o.schuss, 'dmgmod')
  } else {
    appOne(tr, o.schlag, 'dmgmod')
  }
  // Spalte 7: Ausweichen
  appOne(tr, o.ausw, 'ausw', dodgeChanceText)
  // Spalte 8: Taktik
  appOne(tr, o.takt, 'takt')
  // Spalte 9: Widerstand Nah
  appOne(tr, o.wid_schlag, 'wid_schlag',
    TWDS._('MELEE_RESISTANCE_DEF',
      'Resistance against melee weapons: Tough + 25% of reflex'))
  // Spalte 10: Widerstand Fern
  appOne(tr, o.wid_schuss, 'wid_schuss',
    TWDS._('SHOT_RESISTANCE_DEF',
      'Resistance against shot weapons: Reflex + 25% of show'))

  // Spalte 11: Schaden
  const sch = Math.round((o.dmg_min + o.dmg_max) / 2)
  let dmgText = ''

  let rel = o.schlag
  if (o.shot) rel = o.schuss
  dmgText += TWDS._('MINDMG_HAND',
    '$dmg$ minimal damage with a hand hit and resistance &gt;= $res$',
    { dmg: o.dmg_abs_min, res: rel + 100 })
  dmgText += '<br>'
  dmgText += TWDS._('MINDMG',
    '$dmg$ minimal damage with a hand hit and resistance around $res$',
    { dmg: o.dmg_min, res: rel })
  dmgText += '<br>'
  dmgText += TWDS._('MAXDMG',
    '$dmg$ maximal damage with a hand hit and resistance around $res$',
    { dmg: o.dmg_max, res: rel })
  dmgText += '<br>'
  dmgText += TWDS._('MAXDMG_HEAD',
    '$dmg$ maximal damage with a head hit and resistance &lt;= $res$',
    { dmg: o.dmg_abs_max, res: rel - 100 })
  dmgText += '<br>'
  dmgText += TWDS._('DMG_HELP',
    'The damage done depends on the weapon, damage modifier (vigor or shooting), hit zone, the opponents resistance against the weapon type, and buffs. Buffs are not included into the calculations above.')
  appOne(tr, sch, 'dmg', dmgText)

  // Spalte 12: Löschen
  td = document.createElement('td')
  tr.appendChild(td)
  but = TWDS.createButton(
    TWDS._('EQ_SET_REMOVE', 'quitar'), {
      title: TWDS._('EQ_SET_REMOVE_MOUSEOVER', 'Quitar esta equipación de la lista'),
      classList: ['TWDS_delete']
    })
  td.appendChild(but)
}

TWDS.getEquipmentContent = function () {
  const addHeadRow = function (tab) {
    const appOne = function (tr, ti, mo = null) {
      const td = document.createElement('td')
      td.textContent = ti
      if (mo != null) td.title = mo
      tr.appendChild(td)
    }
    const tr = document.createElement('tr')
    tr.className = 'headrow'
    tab.appendChild(tr)
    appOne(tr, TWDS._('NAME', 'Nombre'))
    appOne(tr, TWDS._('WEAR', ''))
    appOne(tr, TWDS._('MENU_LEVEL_SHORT', 'Nivel'),
      TWDS._('MENU_LEVEL_LONG', 'El nivel del personaje en el momento en que se realizaron los cálculos. <br> Si abres el script nuevamente, con este equipo usado, los valores se actualizarán.'))
    appOne(tr, TWDS._('MENU_AIM_SHORT', 'Apuntar'),
      TWDS._('MENU_AIM_LONG', 'Apuntar'))
    appOne(tr, TWDS._('MENU_APPEARANCE_SHORT', 'Apar.'),
      TWDS._('MENU_APPEARANCE_LONG', "La habilidad de Apariencia. Si es más grande que la habilidad táctica de los defensores, el atacante obtendrá una bonificación de puntería (posiblemente la diferencia total.)"))
    appOne(tr, TWDS._('MENU_DMGBON_SHORT', 'TipoDaño'),
      TWDS._('MENU_DMGBON_LONG', 'La bonificación de daño: Vigor o Disparar.'))
    appOne(tr, TWDS._('MENU_DODGING_SHORT', 'Eludir'),
      TWDS._('MENU_DODGING_LONG', 'Eludir'))
    appOne(tr, TWDS._('MENU_TACTICS_SHORT', 'Defensa'),
      TWDS._('MENU_TACTICS_LONG', "La habilidad de Táctica. Si es más grande que la Apariencia del atacante, el defensor obtendrá una bonificación de puntería (posiblemente la diferencia total)."))
    appOne(tr, TWDS._('MENU_RES_MELEE_SHORT', 'Tenacidad'),
      TWDS._('MENU_RES_MELEE_LONG',
        'La resistencia contra el daño de arma contundente (Tenacidad más un 25% de Reflejo).'))
    appOne(tr, TWDS._('MENU_RES_SHOT_SHORT', 'Reflejo'),
      TWDS._('MENU_RES_MELEE_LONG',
        'La resistencia contra arma de fuego (Reflejo más un 25% de Tenacidad).'))
    appOne(tr, TWDS._('MENU_DAMAGE_SHORT', 'Daño'),
      TWDS._('MENU_DAMAGE_LONG',
        'La media de daño hecho.'))
    appOne(tr, TWDS._('MENU_DELETE_SHORT', ''))
  }
  const newstuff = TWDS.getEquipmentData()
  const key = newstuff[0]
  const data = newstuff[1]
  const div = document.createElement('div')

  if (window.localStorage.getItem(key) !== null) {
    window.localStorage.setItem(key, data) // update it.
  } else {
    const b = TWDS.createButton(
      TWDS._('EQUIPMENT_TAKEOVER_BUTTON', 'Agregar equipo actual'),
      {
        classList: ['TWDS_specialequipment_button'],
        id: 'TWDS_equipment_takeover',
        dataSet: {
          key: key,
          edata: data
        }
      })
    div.appendChild(b)
  }

  const tab = document.createElement('table')
  div.appendChild(tab)
  tab.id = 'TWDS_equipment'
  addHeadRow(tab)
  const n = TWDS.fillEquipmentTab(tab)
  if (n >= 12) { addHeadRow(tab) }

  TWDS.getEquipmentContent.specialButtons(div)
  return div
}
TWDS.getEquipmentContent.specialButtons = function (div) {
  const but = function (text, key1, key2) {
    return TWDS.createButton(text, {
      classList: ['TWDS_specialequipment_button'],
      dataSet: {
        key1: key1,
        key2: key2
      }
    })
  }
  const appendOneBlock = function (container, specials, classAdd = '', doTranslate = true, doSort = true) {
    if (doTranslate) {
      for (let i = 0; i < specials.length; i++) {
        specials[i][1] = TWDS._(specials[i][0], specials[i][1])
      }
    }
    if (doSort) {
      specials.sort(function (a, b) {
        return a[1].localeCompare(b[1])
      })
    }
    let p
    if (container.nodeName === 'TABLE') {
      p = TWDS.createEle('tr', { className: classAdd })
    } else {
      p = TWDS.createEle('p', { className: classAdd })
    }
    container.appendChild(p)
    for (let i = 0; i < specials.length; i++) {
      const b = but(specials[i][1], specials[i][2], specials[i][3])
      if (container.nodeName === 'TABLE') {
        const td = TWDS.createEle('td')
        p.appendChild(td)
        td.appendChild(b)
      } else {
        p.appendChild(b)
      }
    }
  }

  let h = document.createElement('h3')
  h.textContent = TWDS._('SPECIAL_EQUIPMENT_HELPER', 'Ayudante de equipo especial')
  div.appendChild(h)

  let p = document.createElement('p')
  p.textContent = TWDS._('SPECIAL_EQUIPMENT_INFO', 'Para calcular una combinación de equipo con buenos valores de bonificación, utilice los siguientes botones. En ordenadores lentos, ésto puede llevar mucho tiempo, especialmente si tiene muchos conjuntos.')
  div.appendChild(p)

  h = document.createElement('h4')
  h.textContent = TWDS._('SPECIAL_BONUS', 'Bonificaciones')
  div.appendChild(h)

  const specials = [
    ['SPECIAL_BUTTON_SPEED', 'Velocidad', 'special', 'Velocidad'],
    ['SPECIAL_BUTTON_XP', 'EXP.', 'special', 'Experiencia.'],
    ['SPECIAL_BUTTON_REGEN', 'Regeneración', 'special', 'Regeneración'],
    ['SPECIAL_BUTTON_LUCK', 'Suerte', 'special', 'Suerte'],
    ['SPECIAL_BUTTON_PRAY', 'Rezar', 'special', 'Rezar'],
    ['SPECIAL_BUTTON_DOLLAR', 'Dinero', 'special', 'Dinero'],
    ['SPECIAL_BUTTON_DROP', 'Tasa Salida', 'special', 'Tasa Salida']
  ]
  appendOneBlock(div, specials, 'TWDS_SPEC_spec')

  h = document.createElement('h4')
  h.textContent = TWDS._('SPECIAL_SKILLS', 'Habilidades')
  div.appendChild(h)

  const tab = TWDS.createEle('table', { className: 'TWDS_SPEC_SKILLS' })
  div.appendChild(tab)
  for (const a of CharacterSkills.allAttrKeys.values()) {
    const skills = []
    for (const b of CharacterSkills.getSkillKeys4Attribute(a).values()) {
      const c = CharacterSkills.getSkill(b)
      const d = {}
      d[b] = 1
      skills.push(['', c.name, 'skill', JSON.stringify(d)])
    }
    appendOneBlock(tab, skills, 'TWDS_spec_' + a, false, false)
  }

  h = document.createElement('h4')
  h.textContent = TWDS._('SPECIAL_DUELS', 'Duelos')
  div.appendChild(h)

  p = document.createElement('p')
  p.textContent = TWDS._('SPECIAL_DUELS_INFO', 'Estas funciones buscan una equipación más o menos aceptable, pero no reemplazan el conocimiento y no pueden encontrar la mejor equipación (no conocen a tus adversarios).')
  div.appendChild(p)

  h = document.createElement('h5')
  h.textContent = TWDS._('SPECIAL_DUELS_DMG', 'Dañar')
  div.appendChild(h)
  let skills = [
    ['SPECIAL_DUELS_DMG_R_A', 'Arma Fuego, Ataque', 'range',
      JSON.stringify({ aim: 3, appearance: 1, shot: 3, dodge: 2 })],
    ['SPECIAL_DUELS_DMG_R_D', 'Arma Fuego, Defensa', 'range',
      JSON.stringify({ aim: 3, tactic: 1, shot: 3, dodge: 2 })],
    ['SPECIAL_DUELS_DMG_M_A', 'Arma Contundente, Ataque', 'melee',
      JSON.stringify({ aim: 3, appearance: 1, tough: 3, dodge: 2 })],
    ['SPECIAL_DUELS_DMG_M_D', 'Arma Contundente, Defensa', 'melee',
      JSON.stringify({ aim: 3, tactic: 1, tough: 3, dodge: 2 })]
  ]
  appendOneBlock(div, skills, 'TWDS_SPEC_duel_dmg', true, false)

  h = document.createElement('h5')
  h.textContent = TWDS._('SPECIAL_DUELS_DODGING', 'Eludir')
  div.appendChild(h)
  skills = [
    ['SPECIAL_DUELS_DODGE_R_A', 'Arma Fuego, Ataque', 'range',
      JSON.stringify({ aim: 2, appearance: 1, shot: 1, dodge: 4 })],
    ['SPECIAL_DUELS_DODGE_R_D', 'Arma Fuego, Defensa', 'range',
      JSON.stringify({ aim: 2, tactic: 1, shot: 1, dodge: 4 })],
    ['SPECIAL_DUELS_DODGE_M_A', 'Arma Contundente, Ataque', 'melee',
      JSON.stringify({ aim: 2, appearance: 1, tough: 1, dodge: 4 })],
    ['SPECIAL_DUELS_DODGE_M_D', 'Arma Contundente, Defensa', 'melee',
      JSON.stringify({ aim: 2, tactic: 1, tough: 1, dodge: 4 })]
  ]
  appendOneBlock(div, skills, 'TWDS_SPEC_duel_dodge', true, false)

  h = document.createElement('h5')
  h.textContent = TWDS._('SPECIAL_DUELS_RES', 'Resistencia')
  div.appendChild(h)
  skills = [
    ['SPECIAL_DUELS_RES_AR_A', 'Ataque contra Duelista de fuego', 'skill',
      JSON.stringify({ aim: 1, appearance: 1, reflex: 4, tough: 1 })],
    ['SPECIAL_DUELS_RES_AR_D', 'Defensa contra Duelista de fuego', 'skill',
      JSON.stringify({ aim: 1, tactic: 1, reflex: 4, tough: 1 })],
    ['SPECIAL_DUELS_RES_AM_A', 'Ataque contra Duelista contundente', 'skill',
      JSON.stringify({ aim: 1, appearance: 1, reflex: 1, tough: 4 })],
    ['SPECIAL_DUELS_RES_AM_D', 'Defensa contra Duelista contundente', 'skill',
      JSON.stringify({ aim: 1, tactic: 1, reflex: 1, tough: 4 })],
    ['SPECIAL_DUELS_RES_D', 'Defensa contra cualquier duelista', 'skill',
      JSON.stringify({ aim: 1, tactic: 1, reflex: 4, tough: 4 })]
  ]
  appendOneBlock(div, skills, 'TWDS_SPEC_duel_res', true, false)

  h = document.createElement('h4')
  h.textContent = TWDS._('SPECIAL_FB', 'Batallas de Fuerte')
  div.appendChild(h)

  p = document.createElement('p')
  p.textContent = TWDS._('SPECIAL_FB_INFO',
    "Estas funciones buscan una equipación más o menos aceptable, pero no pueden tener en cuenta las bonificaciones de las batallas de fuertes. Por lo tanto, casi nunca encontrarán el equipo 'perfecto'.")
  div.appendChild(p)

  skills = [
    ['SPECIAL_FB_TANK_ATT', 'Tanque - Ataque', 'fbtank',
      JSON.stringify({ health: 0.4, dodge: 0.15, hide: 0.25, aim: 0.10, pitfall: 0.00, leadership: 0.1 })],
    ['SPECIAL_FB_TANK_DEF', 'Tanque - Defensa', 'fbtank',
      JSON.stringify({ health: 0.4, dodge: 0.15, hide: 0.00, aim: 0.10, pitfall: 0.25, leadership: 0.1 })],
    ['SPECIAL_FB_DMG_ATT', 'Anti - Ataque', 'fbdamager',
      JSON.stringify({ health: -0.1, dodge: 0.10, hide: 0.30, aim: 0.30, pitfall: 0.00, leadership: 0.4 })],
    ['SPECIAL_FB_DMG_DEF', 'Anti - Defensa', 'fbdamager',
      JSON.stringify({ health: -0.1, dodge: 0.10, hide: 0.00, aim: 0.30, pitfall: 0.30, leadership: 0.4 })]
  ]
  appendOneBlock(div, skills, 'TWDS_SPEC_duel_dmg', true, false)
}

TWDS.activateEquipmentTab = function () {
  TWDS.activateTab('equipment')
}

TWDS.registerStartFunc(function () {
  TWDS.registerTab('equipment',
    TWDS._('TABNAME_EQUIPMENT', 'Equipos'),
    TWDS.getEquipmentContent,
    TWDS.activateEquipmentTab,
    false)
  $(document).on('click', '#TWDS_equipment_takeover', function () {
    window.localStorage.setItem(this.dataset.key, this.dataset.edata)
    TWDS.activateEquipmentTab()
    this.parentNode.removeChild(this)
  })
  $(document).on('click', '.TWDS_specialequipment_button', function () {
    const key1 = this.dataset.key1
    const key2 = this.dataset.key2
    let items
    if (key1 === 'special') {
      if (key2 === 'speed') items = TWDS.speedCalc()
      else if (key2 === 'xp') items = TWDS.genCalc({ experience: 1 }, {})
      else if (key2 === 'regen') items = TWDS.genCalc({ regen: 1 }, { health: 0.01 })
      else if (key2 === 'luck') items = TWDS.genCalc({ luck: 1 }, {})
      else if (key2 === 'pray') items = TWDS.genCalc({ pray: 1 }, {})
      else if (key2 === 'dollar') items = TWDS.genCalc({ dollar: 1 }, {})
      else if (key2 === 'drop') items = TWDS.genCalc({ drop: 1 }, {})
    } else if (key1 === 'skill') {
      const p = JSON.parse(key2)
      items = TWDS.genCalc({}, p)
    } else if (key1 === 'fbtank') {
      const p = JSON.parse(key2)
      items = TWDS.genCalc({
        fboffense: 0.1,
        fbdefense: 2.0,
        fbdamage: 0.1,
        fbresistance: 0.3
      }, p)
    } else if (key1 === 'fbdamager') {
      const p = JSON.parse(key2)
      items = TWDS.genCalc({
        fboffense: 2.0,
        fbdefense: 0.1,
        fbdamage: 0.3,
        fbresistance: 0.1
      }, p)
    } else if (key1 === 'range') {
      const p = JSON.parse(key2)
      items = TWDS.genCalc({ range: 1 }, p)
    } else if (key1 === 'melee') {
      const p = JSON.parse(key2)
      items = TWDS.genCalc({ melee: 1 }, p)
    }

    TWDS.wearItemsHandler(items)
  })
  $(document).on('click', '.TWDS_wear', function () {
    const tr = this.closest('tr')
    const key = tr.dataset.key
    const tmp = window.localStorage.getItem(key)
    if (!tmp) return
    const o = JSON.parse(tmp)
    if (Premium.hasBonus('automation')) {
      Wear.open()
      for (const i in o.item_ids) {
        const ii = o.item_ids[i]
        const b = Bag.getItemByItemId(Number(ii))
        if (b) {
          Wear.carry(b)
        }
      }
    } else {
      if (!wman.getById(Inventory.uid)) { Inventory.open() }
      Wear.open()
      const items = Bag.getItemsByItemIds(o.item_ids)
      Inventory.showSearchResult(items)
    }
  })
})

// vim: tabstop=2 shiftwidth=2 expandtab
// um Doppelzählungen zu vermeiden
TWDS.getLastKnownDuel = function getLastKnownDuel () {
  const tmp = window.localStorage.getItem('TWDS_lastknown')
  if (tmp === null) return {}
  return JSON.parse(tmp)
}

TWDS.clearDuels = function () {
  const toDelete = []
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i)
    if (!k.match(/^TWDS_p_/)) {
      continue
    }
    toDelete.push(k)
  }
  for (let i = 0; i < toDelete.length; i++) {
    window.localStorage.removeItem(toDelete[i])
  }
  window.localStorage.removeItem('TWDS_lastknown')
}
// idea and algorithm takes from clothcalc. RIP.
TWDS.getServerPause = function () {
  if (!('last' in TWDS.getServerPause)) {
    TWDS.getServerPause.last = 0
    TWDS.getServerPause.shortCounter = 0
    TWDS.getServerPause.longCounter = 0
  }
  const now = new Date().getTime()
  if (now - TWDS.getServerPause.last < 2e3) {
    TWDS.getServerPause.shortCounter++
  } else {
    TWDS.getServerPause.shortCounter = 0
  }
  if (now - TWDS.getServerPause.last < 6e4) {
    TWDS.getServerPause.longCounter++
  } else {
    TWDS.getServerPause.longCounter = 0
  }
  TWDS.getServerPause.last = now
  let t = 0
  if (TWDS.getServerPause.longCounter > 50) {
    t = 6e4
  }
  if (TWDS.getServerPause.shortCounter < 20) {
    return t + 200
  }
  return t + 2e3
}
TWDS.readDuels = function () {
  const rxWinner = TWDS._('REGEX_DUEL_WON', '>([^>]+) won the duel')
  const rxWages = TWDS._('REGEX_DUEL_WAGES', 'Wages" .><.th><td>([^<]+)')
  const rxXP = TWDS._('REGEX_DUEL_XP', 'Experience points" .><.th><td>([^<]+)')
  const rxDamage = TWDS._('REGEX_DUEL_DAMAGE', 'Damage" .><.th><td>([^<]+)')
  const rxMeHasAttacked = TWDS._('REGEX_DUEL_ME_HAS_ATTACKED', '^Duel: $me$ vs. (.+)',
    { me: Character.name })
  const rxMeWasAttacked = TWDS._('REGEX_DUEL_ME_WAS_ATTACKED', '^Duel: (.*) vs. $me$',
    { me: Character.name })
  const lastKnown = TWDS.getLastKnownDuel()
  const firstReadDuel = {}
  const handleOneLoad = function (pageno) {
    console.log('H1L', pageno)
    const info = document.getElementById('TWDS_peoplelist_import_info')
    info.textContent = ' (#' + pageno + ')'
    Ajax.remoteCall('reports', 'get_reports', {
      page: pageno,
      folder: 'duel'
    }, function (json) {
      console.log('H1L got', json, json.page < json.count)
      const found = parseIt(json.reports)
      console.log('found?', found)
      if ('hash' in firstReadDuel) {
        const tmp = JSON.stringify(firstReadDuel)
        window.localStorage.setItem('TWDS_lastknown', tmp)
      }
      let doDeleteInfo = 1
      if (!found) {
        if (json.page < json.count) {
          const pause = TWDS.getServerPause()
          console.log('pausing', pause, 'ms')
          if (pause > 1000) {
            info.textContent = ' (#' + pageno + ', ' + Math.round(pause / 1000) + 's)'
          }
          setTimeout(function () {
            handleOneLoad(json.page + 1)
          }, pause)
          doDeleteInfo = 0
        }
      }
      if (doDeleteInfo) {
        info.textContent = ''
        TWDS.activatePeopleTab()
      }
    }, MessagesWindow)
  }
  // this is a really bad localization, but i hope it's enough. Otherwise we need another translation...
  const mangleDate = function (d) {
    const rxToday = TWDS._('REGEX_DUELREPORT_TODAY', ':')
    d = d.replace(/\./g, '')
    if (!(d.match(rxToday))) return d
    return new Date().toLocaleDateString('de', { year: '2-digit', month: 'short', day: 'numeric' })
  }
  const getCmpDate = function (d) {
    const pad = function (number) {
      if (number < 10) {
        return '0' + number
      }
      return number
    }
    const dt = new Date(d)

    return dt.getFullYear() +
    '-' + pad(dt.getMonth() + 1) +
    '-' + pad(dt.getDate())
  }
  const handleDuel = function (report, ti) {
    const p = report.popupData
    let win = p.match(rxWinner)
    win = win[1]
    let lohn = p.match(rxWages)
    lohn = lohn[1]
    let xp = p.match(rxXP)
    xp = xp[1]
    let schaden = p.match(rxDamage)
    schaden = schaden[1].match(/([0-9]+) -- ([0-9]+)/)
    let sch1 = schaden[1]
    let sch2 = schaden[2]

    const me = Character.name
    let other = ti.match(rxMeHasAttacked)
    let iAmAttacker = 1
    if (!other) {
      other = ti.match(rxMeWasAttacked)
      iAmAttacker = 0
    }
    if (!other) return
    other = other[1]

    lohn = lohn.replace(/\./g, '')
    lohn = parseInt(lohn)
    sch1 = sch1.replace(/\./g, '')
    sch1 = parseInt(sch1)
    sch2 = sch2.replace(/\./g, '')
    sch2 = parseInt(sch2)
    xp = xp.replace(/\./g, '')
    xp = parseInt(xp)

    const key = 'TWDS_p_' + other
    let s = window.localStorage.getItem(key)
    if (!s) {
      s = {
        win_me: 0,
        win_other: 0,
        dollars_won_me: 0,
        dollars_won_other: 0,
        dmg_done_me: 0,
        dmg_done_other: 0,
        xp_got_me: 0,
        xp_got_other: 0,
        me_has_attacked: 0,
        me_won_attacking: 0,
        me_won_defending: 0,
        list: []
      }
    } else {
      s = JSON.parse(s)
    }
    if (!('list' in s)) {
      s.list = []
    }
    // we have a sorted list after the first import:
    // push:     [12. Jan, 11. Jan, 10. Jan, 10. Jan]
    // unshift:  [10, 10, 11, 12]
    // because we appended older duels to the list during the import.
    // Now we read new ones: 15, 14, 13
    // push:     [12, 11, 10, 10, 15, 14, 13]
    // unshift:  [13, 14, 15, 12, 11, 10, 10]
    // clearly both simple solutions might be disputed.

    // we could read und store everything in memory, then process the entries in reverse order.
    // i just hate it. i want to get rid of the data ASAP, and not wait for 500 pages of duels.

    // so we "simply" store another date, in numerical representation, and sort the fucking duel
    // list during presentation.

    const dueldate = mangleDate(report.date_received)
    const cmpdate = getCmpDate(dueldate)
    const one = {
      date: dueldate,
      cmpdate: cmpdate,
      report_id: report.report_id,
      hash: report.hash,
      iAmAttacker: iAmAttacker,
      iAmWinner: me === win,
      DollarsIWon: (me === win ? lohn : 0),
      DollarsOpponentWon: (me === win ? 0 : lohn),
      iMadeDamage: (iAmAttacker ? sch2 : sch1),
      OppMadeDamage: (iAmAttacker ? sch1 : sch2),
      iGotXP: (me === win ? xp : 0),
      OppGotXP: (me === win ? 0 : xp)
    }
    s.list.push(one)

    if (win === me) {
      s.win_me++
      s.dollars_won_me += lohn
      s.xp_got_me += xp
    } else {
      s.win_other++
      s.dollars_won_other += lohn
      s.xp_got_other += xp
    }
    if (iAmAttacker) {
      s.dmg_done_me += sch2
      s.dmg_done_other += sch1
      s.me_has_attacked += 1
      if (win === me) {
        s.me_won_attacking += 1
      }
    } else {
      s.dmg_done_me += sch1
      s.dmg_done_other += sch2
      if (win === me) {
        s.me_won_defending += 1
      }
    }
    s = JSON.stringify(s)
    window.localStorage.setItem(key, s)
    console.log('Jout', key, s)
  }
  const parseIt = function (reps) {
    const rx = /^Duel/
    console.log('parseIt', reps)
    for (const r of Object.values(reps)) {
      const ti = r.title
      if (lastKnown.report_id === r.report_id || lastKnown.hash === r.hash) {
        console.log('id', r.report_id, 'or hash', r.hash, 'known')
        return true
      }
      console.log('parseIt1', ti, r)
      if (rx.exec(ti)) {
        console.log('may be duell', ti, r)
        handleDuel(r, ti)
        if (!('hash' in firstReadDuel)) {
          firstReadDuel.hash = r.hash
          firstReadDuel.report_id = r.report_id
        }
      }
    }
    return false
  }
  handleOneLoad(1)
}
window.dust = TWDS.readDuels
TWDS.peopleSort = function (tab, key) {
  if (tab == null) { // for ease of debugging
    tab = document.querySelector('#TWDS_people')
  }
  const tbody = tab.querySelector('tbody')
  const rowColl = tab.querySelectorAll('tbody .datarow')
  const rows = []
  for (let i = 0; i < rowColl.length; i++) {
    const row = rowColl[i]
    const td = row.querySelector('[data-field=' + key + ']')
    if (key === 'name') {
      row.sortval = td.textContent
    } else {
      row.sortval = parseFloat(td.textContent)
    }
    rows.push(row)
  }

  rows.sort(function (a, b) {
    if (key === 'name') {
      return a.sortval.localeCompare(b.sortval)
    } else {
      return b.sortval - a.sortval
    }
  })

  tbody.textContent = ''
  for (let i = 0; i < rows.length; i++) {
    tbody.appendChild(rows[i])
  }
}

TWDS.initPeopleList = function (tab) {
  const appOneHead = function (tr, ti, dn, cs = 0, mouseover = '') {
    const td = document.createElement('th')
    td.textContent = ti
    td.dataset.field = dn
    tr.appendChild(td)
    if (cs) {
      td.colspan = cs.toString()
      td.setAttribute('colspan', cs.toString())
    }
    if (mouseover > '') { td.title = mouseover }
  }
  const appOneBody = function (tr, ti, dn, mouseover = '') {
    const td = document.createElement('td')
    td.textContent = ti
    td.dataset.field = dn
    tr.appendChild(td)
    if (mouseover > '') { td.title = mouseover }
  }
  tab.innerHTML = ''
  const thead = document.createElement('thead')
  tab.appendChild(thead)

  const tr0 = document.createElement('tr')
  const tr1 = document.createElement('tr')
  tr1.className = 'sortTriggerRow'
  thead.appendChild(tr0)
  thead.appendChild(tr1)
  appOneHead(tr0, '', '')
  appOneHead(tr1, TWDS._('PEOPLETAB_MENU_OPPONENT', 'Adversario'), 'name', 0,
    TWDS._('PEOPLETAB_MENU_OPPONENT_MOUSEOVER', 'El nombre del adversario.'))
  appOneHead(tr0, TWDS._('PEOPLETAB_MENU_DUELS', 'Duelos'), '', 4)
  appOneHead(tr1, TWDS._('PEOPLETAB_MENU_TOTAL', 'Total'), 'num', 0,
    TWDS._('PEOPLETAB_MENU_TOTAL_MOUSEOVER', 'El número total de duelos.'))
  appOneHead(tr1, TWDS._('PEOPLETAB_MENU_VICTORIES', 'Gano'), 'won', 0,
    TWDS._('PEOPLETAB_MENU_VICTORIES_MOUSEOVER', 'El número de duelos ganados.'))
  appOneHead(tr1, TWDS._('PEOPLETAB_MENU_LOSSES', 'Pierdo'), 'lost', 0,
    TWDS._('PEOPLETAB_MENU_LOSSES_MOUSEOVER', 'El número de duelos perdidos.'))
  appOneHead(tr1, TWDS._('PEOPLETAB_MENU_PLUSMINUS', '+-'), 'plusminus', 0,
    TWDS._('PEOPLETAB_MENU_PLUSMINUS_MOUSEOVER', 'La diferencia entre ganados/perdidos.'))
  appOneHead(tr0, TWDS._('PEOPLETAB_MENU_DOLLAR', 'Dinero'), '')
  appOneHead(tr1, TWDS._('PEOPLETAB_MENU_DOLLARSUM', 'Sum'), 'dollar', 0,
    TWDS._('PEOPLETAB_MENU_DOLLARSUM_MOUSEOVER', 'La suma de los dólares ganados menos la suma de los dólares ganados por el adversario. Esto no tiene en cuenta la pérdida adicional obtenida con los desmayos.'))
  appOneHead(tr0, TWDS._('PEOPLETAB_MENU_DMG_DONE', 'Daño hecho'), '', 3)
  appOneHead(tr1, TWDS._('PEOPLETAB_MENU_DMG_BY_ME', 'Yo'), 'dmg_done_me', 0,
    TWDS._('PEOPLETAB_MENU_DMG_BY_ME_MOUSEOVER', 'El daño hecho por tí.'))
  appOneHead(tr1, TWDS._('PEOPLETAB_MENU_DMG_BY_OTHER', 'Adv.'), 'dmg_done_other', 0,
    TWDS._('PEOPLETAB_MENU_DMG_BY_OTHER_MOUSEOVER', 'El daño que te han hecho (por adversario).'))
  appOneHead(tr1, TWDS._('PEOPLETAB_MENU_DMG_DIFF', 'Dif.'), 'dmg_done_diff', 0,
    TWDS._('PEOPLETAB_MENU_DMG_DIFF_MOUSEOVER', 'La diferencia de daño hecho.'))
  appOneHead(tr0, TWDS._('PEOPLETAB_MENU_XP', 'EXP.'), '', 2)
  appOneHead(tr1, TWDS._('PEOPLETAB_MENU_XP_ME', 'Yo'), 'xp_got_me', 0,
    TWDS._('PEOPLETAB_MENU_XP_ME_MOUSEOVER', 'La experiencia que obtienes.'))
  appOneHead(tr1, TWDS._('PEOPLETAB_MENU_XP_OTHER', 'Adv.'), 'xp_got_other', 0,
    TWDS._('PEOPLETAB_MENU_XP_OTHER_MOUSEOVER', 'La experiencia obtenida por el adversario.'))
  const tbody = document.createElement('tbody')
  tab.appendChild(tbody)
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i)
    let other = k.match(/^TWDS_p_(.*)/)
    if (!other) {
      continue
    }
    other = other[1]
    let o = window.localStorage.getItem(k)
    o = JSON.parse(o)

    const tr = document.createElement('tr')
    tr.classList.add('datarow')
    const th = document.createElement('th')
    th.dataset.field = 'name'
    th.textContent = other
    tr.appendChild(th)

    appOneBody(tr, o.win_me + o.win_other, 'num',
      TWDS._('PEOPLETAB_NUM_INFO', '$num$ attacks by me', { num: o.me_has_attacked }))
    appOneBody(tr, o.win_me, 'won',
      TWDS._('PEOPLETAB_NUM_ATTACKS_WON', '$num$ attacks won', { num: o.me_won_attacking }))
    appOneBody(tr, o.win_other, 'lost',
      TWDS._('PEOPLETAB_NUM_DEFENCES_WON', '$num$ defences won', { num: o.me_won_defending }))
    appOneBody(tr, o.win_me - o.win_other, 'plusminus')

    appOneBody(tr, o.dollars_won_me - o.dollars_won_other, 'dollar',
      TWDS._('PEOPLETAB_DOLLARS_INFO', '$$dollars_me$ won by me<br>$$dollars_other$ won by $opponent$', {
        dollars_me: o.dollars_won_me,
        dollars_other: o.dollars_won_other,
        opponent: other
      }))

    appOneBody(tr, o.dmg_done_me, 'dmg_done_me')
    appOneBody(tr, o.dmg_done_other, 'dmg_done_other')
    appOneBody(tr, o.dmg_done_me - o.dmg_done_other, 'dmg_done_diff',
      TWDS._('PEOPLETAB_DAMAGE_INFO', '$dmg_done_me$ damage done by me<br>$dmg_done_other$ done by $opponent$', {
        dmg_done_me: o.dmg_done_me,
        dmg_done_other: o.dmg_done_other,
        opponent: other
      }))

    appOneBody(tr, o.xp_got_me, 'xp_got_me')
    appOneBody(tr, o.xp_got_other, 'xp_got_other')

    tbody.appendChild(tr)
  }
  TWDS.peopleSort(tab, 'num')
}

TWDS.getPeopleContent = function () {
  const tab = document.createElement('table')
  tab.id = 'TWDS_people'
  TWDS.initPeopleList(tab)

  const div = document.createElement('div')
  const p = document.createElement('p')
  p.id = 'TWDS_people_info'
  div.appendChild(p)
  const div2 = document.createElement('div')
  div.appendChild(div2)
  div2.id = 'TWDS_peoplelist_functions'

  let b = document.createElement('button')
  b.id = 'TWDS_peoplelist_delete'
  b.textContent = TWDS._('PEOPLETAB_DELETE_DATA', 'Borrar datos')
  div2.appendChild(b)

  b = document.createElement('button')
  b.id = 'TWDS_peoplelist_import'
  b.textContent = TWDS._('PEOPLETAB_IMPORT', 'Importar nuevos duelos')
  const sp = document.createElement('span')
  sp.id = 'TWDS_peoplelist_import_info'
  b.appendChild(sp)
  div2.appendChild(b)

  div.appendChild(tab)
  return div
}
TWDS.appendSubtable = function (container, dd, other) {
  const tab = document.createElement('table')
  container.appendChild(tab)

  const tr = document.createElement('tr')
  tab.appendChild(tr)

  let th = document.createElement('th')
  tr.appendChild(th)
  th.textContent = TWDS._('PEOPLE_SUB_DATE', 'Fecha')

  th = document.createElement('th')
  tr.appendChild(th)
  th.textContent = TWDS._('PEOPLE_SUB_ATTACKER', 'Atacante')

  th = document.createElement('th')
  tr.appendChild(th)
  th.textContent = TWDS._('PEOPLE_SUB_VICTOR', 'Ganador')

  th = document.createElement('th')
  tr.appendChild(th)
  th.textContent = TWDS._('PEOPLE_SUB_DOLLAR', '$ ganados')

  th = document.createElement('th')
  tr.appendChild(th)
  th.textContent = TWDS._('PEOPLE_SUB_DMG_ATTACKER_MADE', 'Daño atacante')
  th.title = TWDS._('PEOPLE_SUB_DMG_ATTACKER_MADE_MOUSEOVER', 'El daño hecho por el atacante')

  th = document.createElement('th')
  tr.appendChild(th)
  th.textContent = TWDS._('PEOPLE_SUB_DMG_DEFENDER_MADE', 'Daño defensor')
  th.title = TWDS._('PEOPLE_SUB_DMG_DEFENDER_MADE_MOUSEOVER', 'El daño hecho por el defensor')

  th = document.createElement('th')
  tr.appendChild(th)
  th.textContent = TWDS._('PEOPLE_SUB_XP', 'EXP ganada')

  dd.list.sort(function (a, b) {
    return b.cmpdate.localeCompare(a.cmpdate)
  })

  for (let i = 0; i < dd.list.length; i++) {
    const d = dd.list[i]

    const tr = document.createElement('tr')
    tab.appendChild(tr)

    let td = document.createElement('td')
    tr.appendChild(td)
    td.textContent = d.date
    td.dataset.cmpdate = d.cmpdate
    td.className = 'openreport'
    td.dataset.hash = d.hash
    td.dataset.report_id = d.report_id

    td = document.createElement('td')
    td.className = 'attacker'
    tr.appendChild(td)
    if (d.iAmAttacker) td.textContent = Character.name
    else td.textContent = other

    td = document.createElement('td')
    td.className = 'winner'
    tr.appendChild(td)
    if (d.iAmWinner) td.textContent = Character.name
    else td.textContent = other

    td = document.createElement('td')
    tr.appendChild(td)
    if (d.iAmWinner) td.textContent = d.DollarsIWon
    else td.textContent = d.DollarsOpponentWon

    td = document.createElement('td')
    tr.appendChild(td)
    td.textContent = d.iMadeDamage

    td = document.createElement('td')
    tr.appendChild(td)
    td.textContent = d.OppMadeDamage

    td = document.createElement('td')
    tr.appendChild(td)
    td.textContent = d.iGotXP ? d.iGotXP : d.OppGotXP
  }
}
TWDS.activatePeopleTab = function () {
  TWDS.activateTab('people')
}

TWDS.registerStartFunc(function () {
  TWDS.registerTab('people',
    TWDS._('TABNAME_PEOPLE', 'Personas'),
    TWDS.getPeopleContent,
    TWDS.activatePeopleTab,
    true)
  $(document).on('click', '#TWDS_peoplelist_delete', function () {
    if (window.confirm(TWDS._('PROMPT_DELETE_DUEL_DATA', '¿Desea borrar los datos de duelos?'))) {
      console.log('sí, borrar')
      TWDS.clearDuels()
      document.getElementById('TWDS_people').innerHTML = ''
    }
  })
  $(document).on('click', '#TWDS_peoplelist_import', function () {
    document.getElementById('TWDS_people_info')
      .textContent = TWDS._('PEOPLE_WAITINFO', 'Esto se ejecuta en segundo plano y lleva algo de tiempo. Espere por favor.')
    TWDS.readDuels()
    TWDS.activatePeopleTab()
  })
  $(document).on('click', '#TWDS_people thead tr.sortTriggerRow th', function () {
    const key = this.dataset.field
    if (typeof key !== 'undefined') {
      TWDS.peopleSort(null, key)
    }
  })
  $(document).on('click', '#TWDS_people_subtab .openreport', function () {
    const hash = this.dataset.hash
    const id = this.dataset.report_id
    ReportWindow.open(id, hash, 0)
  })
  $(document).on('click', '#TWDS_people .datarow [data-field="name"]', function () {
    // this is the th.name
    const key = 'TWDS_p_' + this.textContent
    let d = window.localStorage.getItem(key)
    if (!d) return
    d = JSON.parse(d)
    const dr = this.closest('.datarow')
    const id = 'TWDS_people_subtab'
    const ele = document.getElementById(id)
    if (ele) ele.parentNode.removeChild(ele)
    const tr = document.createElement('tr')
    tr.id = id
    const td = document.createElement('td')
    td.setAttribute('colspan', 11)
    tr.appendChild(td)
    dr.insertAdjacentElement('afterend', tr)
    TWDS.appendSubtable(td, d, this.textContent)
  })
})
// vim: tabstop=2 shiftwidth=2 expandtab

TWDS.debug = 0
TWDS.calcBruttoJobPoints = function (jobId, items) {
  const job = JobList.getJobById(jobId)
  const bo = TWDS.getComboBonus(items)
  let jp = 0
  for (const [skillName, mult] of Object.entries(job.skills)) {
    const sk = CharacterSkills.getSkill(skillName)
    let v = 0
    if (skillName in bo) {
      v += bo[skillName][0]
      if (TWDS.debug) console.log(skillName, 'wear bonus', bo[skillName][0], '=>', v)
    }
    v += sk.points
    if (TWDS.debug) console.log(skillName, 'char skill', sk.points, '=>', v)
    if (sk.attr_key in bo) {
      v += bo[sk.attr_key][0]
      if (TWDS.debug) console.log(skillName, 'char attr', bo[sk.attr_key][0], '=>', v)
    }
    v *= mult
    jp += v
    if (TWDS.debug) console.log('after', skillName, 'mult', mult, 'v', v, 'jp', jp)
  }
  if ('job_all' in bo) {
    jp += bo.job_all[0]
    if (TWDS.debug) console.log('after', 'job_all', '=', bo.job_all[0], 'jp', jp)
  }
  const t = 'job_' + jobId
  if (t in bo) {
    jp += bo[t][0]
    if (TWDS.debug) console.log('after', t, '=', bo[t][0], 'jp', jp)
  }
  return jp
}
TWDS.calcNettoJobPoints = function (jobId, items) {
  const job = JobList.getJobById(jobId)
  const jp = TWDS.calcBruttoJobPoints(jobId, items)
  return jp - job.malus - 1
}

// the functions with TWDB in their name have been taken from tw-db.info (web site, not cloth calc)
// RIP, tw-db. You are missed.
TWDS.TWDBcalcStepFormula = function (r1, r2, formula, points, malus, magic, mot, factor, freezeBronze) {
  /* by steps until silver, then formula
  *  r1, r2 - what type of rounding is used on the calculated value
  *  formula - function(lp, stars) for calcing silver and gold (5 <= stars <= 15)
  *  pts - skill points towards job
  *  malus - difficulty-1
  *  mot - motivation in [0 - 100], if NOT affected by motivation, put 100
  *  factor - other stuff to multiply by before rounding
  *  freezeBronze - if set, bronze is constant magic */
  const step = Math.ceil((malus + 1) / 5); const stars = Math.min(Math.floor(points / step), 15); const dmot = Math.ceil(mot / 25) * 0.25
  return points < 5 * step || points <= malus
    ? Math[r1](({ 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6.25 })[freezeBronze ? 0 : stars] * magic * dmot * factor)
    : Math[r2](formula(points - malus, stars) * magic * dmot * factor)
}
TWDS.TWDBcalcWage = function (pts, mal, magic, mot, fac) {
  return TWDS.TWDBcalcStepFormula('ceil', 'round', function (lp) { return 6.25 * Math.pow(lp, 0.05) }, pts, mal, magic, mot, fac)
}
TWDS.TWDBcalcExp = function (pts, mal, magic, mot, fac) {
  return TWDS.TWDBcalcStepFormula('ceil', 'ceil', function (lp) { return 6.25 }, pts, mal, magic, mot, fac)
}
TWDS.TWDBcalcLuck = function (pts, mal, magic, mot, fac) {
  return TWDS.TWDBcalcStepFormula('floor', 'floor',
    function (lp) { return 6.25 * Math.pow(lp, 0.2) },
    pts, mal, (0.9 * magic + 5) / 1.25, 100, fac)
}
TWDS.TWDBcalcExp = function (pts, mal, magic, mot, fac) {
  return TWDS.TWDBcalcStepFormula('ceil', 'ceil', function (lp) { return 6.25 }, pts, mal, magic, mot, fac)
}
TWDS.TWDBcalcDanger = function (pts, mal, magic, mot, fac) {
  return TWDS.TWDBcalcStepFormula('round', 'round', function (lp) { return Math.pow(lp, -0.2) }, pts, mal, magic, 100, fac, true)
}
TWDS.initJobDisplay = function (container, serverdata) {
  const charPremium = Number(Premium.hasBonus('character'))
  const duration = TWDS.curJobDuration
  let durationIdx = 0
  if (duration === 600) durationIdx = 1
  if (duration === 3600) durationIdx = 2

  const row = function (tab, jobId, best) {
    const jobdata = JobList.getJobById(jobId)

    const tr = document.createElement('tr')
    tab.appendChild(tr)
    tr.dataset.jobid = jobId
    let td
    let bestNetto
    let bestBrutto
    const difficulty = jobdata.malus
    const mot = serverdata.jobs[jobId].motivation * 100
    if (best !== null) {
      bestNetto = TWDS.calcNettoJobPoints(jobId, best.items)
      bestBrutto = bestNetto + jobdata.malus + 1
    }

    const curNetto = serverdata.jobs[jobId].workpoints - 1
    const curBrutto = serverdata.jobs[jobId].jobSkillPoints

    let jc = new JobCalculator(curBrutto, jobdata.malus + 1)
    jc.calcStars((curBrutto / (jobdata.malus + 1)))
    const curStars = jc.getJobstarsValue()

    jc = new JobCalculator(bestBrutto, jobdata.malus + 1)
    jc.calcStars((bestBrutto / (jobdata.malus + 1)))
    const bestStars = jc.getJobstarsValue()

    td = document.createElement('td')
    tr.appendChild(td)
    td.textContent = jobId
    td.dataset.field = 'no'

    td = document.createElement('td')
    td.dataset.field = 'date'
    tr.appendChild(td)
    if (best !== null) {
      const dt = new Date(best.timestamp)
      if (dt.toLocaleDateString() === new Date().toLocaleDateString()) {
        td.textContent = dt.toLocaleTimeString(Game.locale.replace('_', '-'))
      } else {
        td.textContent = dt.toLocaleDateString(Game.locale.replace('_', '-'))
      }
    }

    td = document.createElement('td')
    tr.appendChild(td)
    td.textContent = jobdata.name
    if (best !== null) { td.title = TWDS.describeItemCombo(best.items) }
    td.dataset.field = 'name'

    td = document.createElement('td')
    tr.appendChild(td)
    td.dataset.field = 'lp'
    td.textContent = curNetto
    if (best !== null && curNetto !== bestNetto) {
      td.title = bestNetto + ' in best clothes'
    }
    if (curNetto < 0) {
      td.classList.add('TWDS_job_negative')
    } else if (best !== null && curStars !== bestStars) {
      td.classList.add('TWDS_job_less')
    }

    td = document.createElement('td')
    tr.appendChild(td)
    td.textContent = curStars
    td.dataset.field = 'stars'
    td.dataset.sortval = curStars
    if (best !== null && bestStars !== curStars) {
      td.title = bestStars + ' stars in best clothes'
    }
    if (curStars < 6) {
      td.classList.add('TWDS_job_negative')
    } else if (best !== null && curStars !== bestStars) {
      td.classList.add('TWDS_job_less')
    }

    td = document.createElement('td')
    tr.appendChild(td)
    td.textContent = serverdata.jobs[jobId].durations[durationIdx].xp
    td.dataset.field = 'xp'
    td.title = serverdata.jobs[jobId].durations[0].xp + '/' +
      serverdata.jobs[jobId].durations[1].xp + '/' +
      serverdata.jobs[jobId].durations[2].xp +
      ' exp. en 15s/10m/1h'

    td = document.createElement('td')
    tr.appendChild(td)
    td.textContent = serverdata.jobs[jobId].durations[durationIdx].money
    td.dataset.field = 'money'
    td.title = '$' + serverdata.jobs[jobId].durations[0].money + '/' +
      serverdata.jobs[jobId].durations[1].money + '/' +
      serverdata.jobs[jobId].durations[2].money +
      ' en 15s/10m/1h'

    td = document.createElement('td')
    tr.appendChild(td)
    td.dataset.field = 'luck'
    let luck = TWDS.TWDBcalcLuck(curBrutto, difficulty, TWDS.jobData['job_' + jobId].job_luck, mot, 1)
    if (charPremium) luck *= 1.5
    td.textContent = Math.round(luck * 3)
    td.title = Math.round(luck) + ' - ' + Math.round(luck * 3)
    if (best !== null && curBrutto !== bestBrutto) {
      let luck2 = TWDS.TWDBcalcLuck(bestBrutto, difficulty, TWDS.jobData['job_' + jobId].job_luck, mot, 1)
      if (charPremium) luck2 *= 1.5
      td.title += '<br>' + Math.round(luck2) + ' -' + Math.round(luck2 * 3) + ' in best clothes'
    }
    td.title += '<br>' + serverdata.jobs[jobId].durations[0].luck + '/' +
      serverdata.jobs[jobId].durations[1].luck + '/' +
      serverdata.jobs[jobId].durations[2].luck +
      '  mod. suerte en 15s/10m/1h'

    td = document.createElement('td')
    tr.appendChild(td)
    td.textContent = Math.round(100 * serverdata.jobs[jobId].motivation)
    td.dataset.field = 'motivation'

    td = document.createElement('td')
    tr.appendChild(td)
    td.dataset.field = 'danger'
    let dang = TWDS.TWDBcalcDanger(curBrutto, difficulty, TWDS.jobData['job_' + jobId].job_danger, mot, 1)
    if (Character.charClass === 'adventurer') {
      if (charPremium) dang *= 0.8
      else dang *= 0.9
    }
    td.textContent = Math.round(dang * 10) / 10
    td.title = dang + '% probabilidad de lesión'
    if (best !== null) {
      let dang2 = TWDS.TWDBcalcDanger(bestBrutto, difficulty, TWDS.jobData['job_' + jobId].job_danger, mot, 1)
      if (Character.charClass === 'adventurer') {
        if (charPremium) dang2 *= 0.8
        else dang2 *= 0.9
      }
      dang2 = Math.round(dang2 * 10) / 10
      td.title += '<br>' + dang2 + '% probabilidad de lesión con las mejores ropas'
    }
    const mh = Character.getMaxHealth()
    const maxInj = Math.round((TWDS.jobData['job_' + jobId].job_maxdmg) / 100 * mh)
    const h = Character.health
    td.title += '<br>Una lesión cuesta hasta ' + maxInj + ' puntos de salud (' + TWDS.jobData['job_' + jobId].job_maxdmg + '% de máxima salud).'

    const worstJobs = parseInt((h + 1) / maxInj)
    td.title += '<br>You might lastPodrías durar ' + worstJobs + ' trabajos en el peor caso.'

    td = document.createElement('td')
    tr.appendChild(td)

    if (Premium.hasBonus('automation')) {
      let but
      but = document.createElement('button')
      but.textContent = 'abrir'
      but.classList.add('TWDS_joblist_openbutton')
      but.dataset.jobid = jobId
      but.title = 'Abra una ventana para comenzar el trabajo en la posición más cercana posible.'
      td.appendChild(but)

      but = document.createElement('button')
      but.textContent = 'iniciar'
      but.classList.add('TWDS_joblist_startbutton')
      but.dataset.jobid = jobId
      but.title = 'Comenzar el trabajo en la posición más cercana posible.'
      td.appendChild(but)
    }
  }
  const headrow = function (tab) {
    const thead = document.createElement('thead')
    tab.appendChild(thead)
    const tr = document.createElement('tr')
    thead.appendChild(tr)

    let th

    th = document.createElement('th')
    tr.appendChild(th)
    th.dataset.field = 'no'
    th.textContent = TWDS._('JOBLIST_NUMBER', 'Nº')

    th = document.createElement('th')
    tr.appendChild(th)
    th.dataset.field = 'date'
    th.textContent = TWDS._('JOBLIST_DATE', 'Fecha')
    th.title = "La fecha en la que las 'mejores' ropas se calcularon."

    th = document.createElement('th')
    tr.appendChild(th)
    th.dataset.field = 'name'
    th.textContent = TWDS._('JOBLIST_NAME', 'Nombre')

    th = document.createElement('th')
    tr.appendChild(th)
    th.dataset.field = 'lp'
    th.textContent = TWDS._('JOBLIST_LABORPOINTS', 'PT')

    th = document.createElement('th')
    tr.appendChild(th)
    th.dataset.field = 'stars'
    th.textContent = TWDS._('JOBLIST_STARS', 'Estrellas')

    th = document.createElement('th')
    tr.appendChild(th)
    th.dataset.field = 'xp'
    th.textContent = TWDS._('JOBLIST_XP', 'Exp.')

    th = document.createElement('th')
    tr.appendChild(th)
    th.dataset.field = 'money'
    th.textContent = TWDS._('JOBLIST_MONEY', 'Dinero')

    th = document.createElement('th')
    tr.appendChild(th)
    th.dataset.field = 'luck'
    // th.textContent = TWDS._('JOBLIST_LUCK', 'luck')
    th.innerHTML = '&#9752;'

    th = document.createElement('th')
    tr.appendChild(th)
    th.dataset.field = 'motivation'
    th.textContent = TWDS._('JOBLIST_MOTIVATION', 'Motiv.')

    th = document.createElement('th')
    tr.appendChild(th)
    th.dataset.field = 'danger'
    // th.textContent = TWDS._('JOBLIST_DANGER', 'Danger')
    th.innerHTML = '&#9829;'

    th = document.createElement('th')
    tr.appendChild(th)
  }

  const tab = document.createElement('table')
  container.appendChild(tab)
  tab.id = 'TWDS_jobs'
  headrow(tab)
  const jl = JobList.getSortedJobs()
  const tbody = document.createElement('tbody')
  tab.appendChild(tbody)
  for (const job of jl) {
    const best = TWDS.getJobBestFromCache(job.id)
    row(tbody, job.id, best)
  }
}

TWDS.jobSort = function (tab, key) {
  if (tab == null) { // for ease of debugging
    tab = document.querySelector('#TWDS_jobs')
  }
  let cursort
  if ('cursort' in tab.dataset) {
    cursort = tab.dataset.cursort
  }
  const tbody = tab.querySelector('tbody')
  const rowColl = tab.querySelectorAll('tbody tr')
  const rows = []
  for (let i = 0; i < rowColl.length; i++) {
    const row = rowColl[i]
    const td = row.querySelector('[data-field=' + key + ']')
    if (key === 'name') {
      row.sortval = td.textContent
    } else if ('sortval' in td.dataset) {
      row.sortval = parseFloat(td.dataset.sortval)
    } else {
      row.sortval = parseFloat(td.textContent)
    }
    if (key === 'luck') {
      const td2 = row.querySelector('[data-field=money')
      row.sortval2 = parseFloat(td2.textContent)
    } else {
      const td2 = row.querySelector('[data-field=luck')
      row.sortval2 = parseFloat(td2.textContent)
    }
    rows.push(row)
  }

  if (cursort === key) {
    rows.sort(function (a, b) {
      if (key === 'name') {
        return b.sortval.localeCompare(a.sortval)
      } else if (b.sortval === a.sortval) {
        return a.sortval2 - b.sortval2
      } else {
        return a.sortval - b.sortval
      }
    })
    tab.dataset.cursort = ''
  } else {
    rows.sort(function (a, b) {
      if (key === 'name') {
        return a.sortval.localeCompare(b.sortval)
      } else if (b.sortval === a.sortval) {
        return b.sortval2 - a.sortval2
      } else {
        return b.sortval - a.sortval
      }
    })
    tab.dataset.cursort = key
  }

  tbody.textContent = ''
  for (let i = 0; i < rows.length; i++) {
    tbody.appendChild(rows[i])
  }
}

TWDS.curJobDuration = 15
TWDS.getJobContent = function () {
  const x = window.localStorage.getItem('TWDS_job_duration')
  if (x !== null) { TWDS.curJobDuration = parseInt(x) }

  const div = document.createElement('div')
  div.id = 'TWDS_job'
  const p = document.createElement('p')
  div.appendChild(p)

  const fig = document.createElement('span')
  p.appendChild(fig)
  fig.id = 'TWDS_job_filtergroup'

  const input = document.createElement('input')
  fig.appendChild(input)
  input.id = 'TWDS_job_filter'
  input.placeholder = 'buscar'

  const button = document.createElement('button')
  fig.appendChild(button)
  button.id = 'TWDS_job_filterx'
  button.textContent = 'x'

  const sel = document.createElement('select')
  p.appendChild(sel)
  sel.id = 'TWDS_job_duration'

  let opt = document.createElement('option')
  sel.appendChild(opt)
  opt.setAttribute('value', 15)
  opt.textContent = '15s'
  if (TWDS.curJobDuration === 15) opt.setAttribute('selected', 'selected')

  opt = document.createElement('option')
  sel.appendChild(opt)
  opt.setAttribute('value', 600)
  opt.textContent = '10m'
  if (TWDS.curJobDuration === 600) opt.setAttribute('selected', 'selected')

  opt = document.createElement('option')
  sel.appendChild(opt)
  opt.setAttribute('value', 3600)
  opt.textContent = '1h'
  if (TWDS.curJobDuration === 3600) opt.setAttribute('selected', 'selected')

  Ajax.remoteCallMode('work', 'index', {}, function (x) {
    TWDS.jobCurrentList = x
    TWDS.initJobDisplay(div, x)
  })

  return div
}
TWDS.activateJobTab = function () {
  TWDS.activateTab('job')
}

TWDS.jobStartFunction = function () {
  TWDS.registerTab('job',
    TWDS._('TABNAME_JOB', 'Trabajos'),
    TWDS.getJobContent,
    TWDS.activateJobTab,
    true)
  $(document).on('click', '#TWDS_jobs thead th', function () {
    const key = this.dataset.field
    if (typeof key !== 'undefined') {
      TWDS.jobSort(null, key)
    }
  })
  $(document).on('click', '.TWDS_joblist_openbutton', function (ev) {
    const id = this.dataset.jobid
    if (!id || !Premium.hasBonus('automation')) { return false }
    Ajax.remoteCall('work', 'get_nearest_job', {
      job_id: id
    }, function (json) {
      if (json.error) { return new UserMessage(json.msg).show() }
      JobWindow.open(id, json.x, json.y)
    })
  })
  $(document).on('click', '.TWDS_joblist_startbutton', function (ev) {
    const id = this.dataset.jobid
    if (!id || !Premium.hasBonus('automation')) { return false }
    Ajax.remoteCall('work', 'get_nearest_job', {
      job_id: id
    }, function (json) {
      if (json.error) { return new UserMessage(json.msg).show() }
      const x = document.querySelector('#TWDS_job_duration')
      JobWindow.startJob(id, json.x, json.y, parseInt(x.value))
    })
  })
  $(document).on('change', '#TWDS_job_duration', function (ev) {
    if (typeof TWDS.jobCurrentList !== 'undefined') {
      const ele = document.querySelector('#TWDS_job_duration')
      TWDS.curJobDuration = parseInt(ele.value)
      window.localStorage.setItem('TWDS_job_duration', TWDS.curJobDuration)

      const t = document.querySelector('#TWDS_jobs')
      const pa = t.parentNode
      pa.removeChild(t)

      TWDS.initJobDisplay(pa, TWDS.jobCurrentList)
    }
  })
  $(document).on('click', '#TWDS_job_filterx', function (ev) {
    document.querySelector('#TWDS_job_filter').value = ''
    $('#TWDS_job_filter').trigger('change')
  })
  $(document).on('change', '#TWDS_job_filter', function (ev) {
    const fi = document.querySelector('#TWDS_job_filter')
    const rows = document.querySelectorAll('#TWDS_jobs tbody tr')
    if (!JobsModel.Jobs.length) { JobsModel.initJobs() }

    const search = fi.value.trim()
    if (search === '') {
      for (const row of Object.values(rows)) {
        row.classList.remove('hidden')
      }
    } else {
      const m = JobsModel.searchJobsByPattern(fi.value)
      for (const row of Object.values(rows)) {
        row.classList.add('hidden')
      }
      for (const found of Object.values(m)) {
        const id = found.id
        const ele = document.querySelector('#TWDS_jobs tbody tr[data-jobid="' + id + '"]')
        ele.classList.remove('hidden')
      }
    }
  })
}
TWDS.registerStartFunc(TWDS.jobStartFunction)

TWDS.getSettingsContent = function () {
  const createVersionThing = function () {
    const thing = document.createElement('p')
    thing.classList.add('TWDS_VERSIONINFO')
    thing.textContent = 'Version: v0.0.35-1-gc89f2da'
    return thing
  }
  const createCacheThing = function () {
    const thing = document.createElement('div')
    let button
    let p
    let h

    h = document.createElement('h2')
    thing.appendChild(h)
    h.textContent = 'Ropas en caché'

    p = document.createElement('p')
    thing.appendChild(p)
    p.textContent = 'Los resultados de los cálculos de las ropas de trabajo se almacenan en una caché y se pueden reutilizar en la ventana de trabajo. Aquí puede borrar, completar o actualizar muchos trabajos a la vez, aunque volver a calcular todos los trabajos llevará bastante tiempo en computadoras lentas.'

    p = document.createElement('p')
    const info = document.createElement('p')
    info.id = 'TWDS_job_reload_info'
    thing.appendChild(info)
    TWDS.clothcacheInfo(info)

    p = document.createElement('p')
    thing.appendChild(p)
    button = document.createElement('button')
    p.appendChild(button)
    button.textContent = 'Limpiar ropas en caché'
    button.onclick = TWDS.clothcacheClear

    p = document.createElement('p')
    thing.appendChild(p)
    p.textContent = '¿Recargar / llenar la caché?'

    button = document.createElement('button')
    thing.appendChild(button)
    button.textContent = TWDS._('JOB_RELOAD_ALL', 'todos')
    button.title = TWDS._('JOB_RELOAD_ALL_MOUSEOVER',  'Recargar la caché de ropas para todos los trabajos')
    button.classList.add('TWDS_job_reload')
    button.dataset.reloadmode = 'all'

    button = document.createElement('button')
    thing.appendChild(button)
    button.textContent = TWDS._('JOB_RELOAD_MISSING', 'perdidos')
    button.title = TWDS._('JOB_RELOAD_MISSING_MOUSEOVER', 'Llenar la caché de ropas para todos los trabajos que no tienen')
    button.classList.add('TWDS_job_reload')
    button.dataset.reloadmode = 'missing'

    button = document.createElement('button')
    thing.appendChild(button)
    button.textContent = TWDS._('JOB_RELOAD_1D', '1d')
    button.title = TWDS._('JOB_RELOAD_ALL_MOUSEOVER', 'Recargar la caché de ropas para todos los trabajos en los que tenga más de 1 día de antigüedad')
    button.classList.add('TWDS_job_reload')
    button.dataset.reloadmode = '1d'

    button = document.createElement('button')
    thing.appendChild(button)
    button.textContent = TWDS._('JOB_RELOAD_1D', '1s')
    button.title = TWDS._('JOB_RELOAD_ALL_MOUSEOVER', 'Recargar la caché de ropas para todos los trabajos en los que tenga más de 1 semana de antigüedad')
    button.classList.add('TWDS_job_reload')
    button.dataset.reloadmode = '1w'

    button = document.createElement('button')
    thing.appendChild(button)
    button.textContent = TWDS._('JOB_RELOAD_1D', '30d')
    button.title = TWDS._('JOB_RELOAD_ALL_MOUSEOVER', 'Recargar la caché de ropas para todos los trabajos en los que tenga más de 30 días de antigüedad')
    button.classList.add('TWDS_job_reload')
    button.dataset.reloadmode = '30d'

    h = document.createElement('h2')
    thing.appendChild(h)
    h.textContent = 'Misc. settings'
    for (const x of TWDS.settingList.values()) {
      const mode = x[0]
      const name = x[1]
      const text = x[2]
      const div = document.createElement('div')
      div.className = 'TWDS_settingline'
      thing.appendChild(div)
      if (mode === 'bool') {
        const c = document.createElement('input')
        c.setAttribute('type', 'checkbox')
        c.setAttribute('value', '1')
        c.classList.add('TWDS_setting_bool')
        c.classList.add('TWDS_setting')
        c.dataset.settingName = name
        if (TWDS.settings[name]) { c.setAttribute('checked', 'checked') }
        div.appendChild(c)
        const span = document.createElement('span')
        span.textContent = text
        div.appendChild(span)
      }
    }

    return thing
  }
  const div = document.createElement('div')
  div.id = 'TWDS_settings'
  div.appendChild(createVersionThing())
  div.appendChild(createCacheThing())
  return div
}
TWDS.activateSettingsTab = function () {
  TWDS.activateTab('settings')
}

TWDS.settingsStartFunction = function () {
  TWDS.registerTab('settings',
    TWDS._('TABNAME_SETTINGS', 'Ajustes'),
    TWDS.getSettingsContent,
    TWDS.activateSettingsTab,
    true)

  $(document).on('change', '.TWDS_setting', function () {
    const name = this.dataset.settingName
    let v = this.value
    if (this.type === 'checkbox') {
      if (!this.checked) { v = false } else { v = true }
    }
    TWDS.settings[name] = v
    console.log('changed setting', name, 'to', v)
    window.localStorage.setItem('TWDS_settings', JSON.stringify(TWDS.settings))
  })
  const t = window.localStorage.getItem('TWDS_setting_jobCacheSeconds')
  if (t !== null) { TWDS.jobCacheSecondsSetting = parseInt(t) }

  $(document).on('click', '.TWDS_job_reload', function () {
    let mode = this.dataset.reloadmode
    if (mode === 'all') {
      TWDS.clothcacheClear()
      mode = 'missing'
    }
    TWDS.clothcacheReload(mode)
  })
}
TWDS.registerStartFunc(TWDS.settingsStartFunction)
// vim: tabstop=2 shiftwidth=2 expandtab
// vim: tabstop=2 shiftwidth=2 expandtab

TWDS.getJobBestFromCache = function (id) {
  const k = 'TWDS_j_' + id
  let d = window.localStorage.getItem(k)
  if (d !== null) {
    d = JSON.parse(d)
    return d
  }
  return null
}
TWDS.jobCacheSecondsSetting = 3600 // 1h
TWDS.getBestSetWrapper = function (skills, id, returnFull = false) {
  const k = 'TWDS_j_' + id

  /*
  const old = window.localStorage.getItem(k)
  if (old !== null) {
    const d = JSON.parse(old)
    const cacheSeconds = TWDS.jobCacheSecondsSetting
    const stich = new Date().getTime() - cacheSeconds * 1000
    if (d.timestamp >= stich) {
      if (returnFull) { return d }
      const c = new west.item.ItemSetContainer()
      c.items = d.cache.items
      for (const v of Object.values(d.cache.sets)) {
        c.sets.push(new west.item.ItemSet(v))
        // c.sets.push(Object.assign(new west.item.ItemSet, v))
      }
      return c
    }
  }
*/

  const best = west.item.Calculator._TWDS_backup_getBestSet(skills, id)
  const one = {
    timestamp: new Date().getTime(),
    id: id,
    level: Character.level,
    cache: best
  }
  one.items = [...best.items] // clone that
  for (let i = 0; i < best.sets.length; i++) {
    for (let j = 0; j < best.sets[i].items.length; j++) {
      one.items.push(best.sets[i].items[j])
    }
  }
  window.localStorage.setItem(k, JSON.stringify(one))
  TWDS.clothcacheRecalcItemUsage()
  if (returnFull) { return one }
  return best
}

TWDS.clothcacheClear = function () {
  const jl = JobList.getSortedJobs()
  for (const job of jl) {
    const k = 'TWDS_j_' + job.id
    window.localStorage.removeItem(k)
  }
  TWDS.RecalcItemUsage()
}
TWDS.clothcacheInfo = function (ele) {
  const jl = JobList.getSortedJobs()
  let total = 0
  let found = 0
  let agesum = 0
  const now = new Date().getTime()
  for (const job of jl) {
    const old = TWDS.getJobBestFromCache(job.id)
    total++
    if (old === null) {
      continue
    }
    agesum += now - old.timestamp
    found++
  }
  let t = found + '/' + total + ' trabajos que tienen las mejores ropas almacenadas en la cache.'
  if (found) {
    const avg = (agesum / found) / 1000
    t += 'La antigüedadd media es '
    if (avg > 2 * 86400) {
      t += Math.round(avg / 8640) / 10 + ' días.'
    } else if (avg > 2 * 3600) {
      t += Math.round(avg / 360) / 10 + ' horas.'
    } else {
      t += Math.round(avg / 60) + ' minutos.'
    }
  }
  ele.textContent = t
}

TWDS.clothcacheReload = function (mode) {
  const jl = JobList.getSortedJobs()
  const info = document.querySelector('#TWDS_job_reload_info')
  for (const job of jl) {
    const old = TWDS.getJobBestFromCache(job.id)
    if (old !== null) {
      const ts = old.timestamp
      if (mode === '1d') {
        if (ts > new Date().getTime() - 1 * 86400 * 1000) { continue }
      }
      if (mode === '2d') {
        if (ts > new Date().getTime() - 2 * 86400 * 1000) { continue }
      }
      if (mode === '1w') {
        if (ts > new Date().getTime() - 7 * 86400 * 1000) { continue }
      }
      if (mode === '30d') {
        if (ts > new Date().getTime() - 30 * 86400 * 1000) { continue }
      }
      if (mode === 'missing') { continue }
    }
    console.log('calc', job.id, job.name, mode, old)
    const out = TWDS.getBestSetWrapper(job.skills, job.id, true)
    info.textContent = job.id + '/' + jl.length + ' ' +
    job.name + ' ' + TWDS.describeItemCombo(out.items)
    TWDS.clothcacheRecalcItemUsage()
    setTimeout(function () { TWDS.clothcacheReload(mode) }, 500)
    return
  }
  TWDS.clothcacheRecalcItemUsage()
  TWDS.activateSettingsTab() // layering violation
  info.textContent = ''
}

TWDS.clothcacheRecalcItemUsage = function () {
  const items = {}
  const add2item = function (item, key, num) {
    if (!(item in items)) {
      items[item] = {
        job: [],
        eq: [],
        ds: []
      }
    }
    items[item][key].push(num)
  }

  const jl = JobList.getSortedJobs()
  for (const job of jl) {
    const b = TWDS.getJobBestFromCache(job.id)
    if (b === null) continue // should not happen
    for (const item of b.items) {
      add2item(item, 'job', job.id)
    }
  }
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i)
    if (!k.match(/^TWDS_h_/)) {
      continue
    }
    const s = window.localStorage.getItem(k)
    const o = JSON.parse(s)
    for (const ii of o.item_ids) {
      add2item(ii, 'ds', o.name)
    }
  }

  window.localStorage.setItem('TWDS_itemusage', JSON.stringify(items))

  Ajax.remoteCallMode('inventory', 'show_equip', {}, function (data) {
    const eql = data.data
    for (const [idx, eq] of Object.entries(eql)) {
      for (const slot of Wear.slots) {
        const it = eq[slot]
        add2item(it, 'eq', idx)
      }
    }
    window.localStorage.setItem('TWDS_itemusage', JSON.stringify(items))
  })
}

TWDS.registerSetting('bool', 'saleProtection',
  TWDS._('CLOTHCACHE_PROTECT', 'Poner los mejores artículos para cualquier trabajo, y los elementos de los conjuntos administrados (juego, tw-calc, tw-duellstat) como no vendibles y no subastables.'),
  true)

TWDS.clothcacheStartFunction = function () {
  try {
    west.item.Calculator._TWDS_backup_getBestSet = west.item.Calculator.getBestSet
    west.item.Calculator.getBestSet = TWDS.getBestSetWrapper
  } catch (e) {
  }

  try {
    tw2widget.InventoryItem.prototype._TWDS_backup_initDisplay = tw2widget.InventoryItem.prototype.initDisplay
    tw2widget.InventoryItem.prototype.initDisplay = function () {
      tw2widget.InventoryItem.prototype._TWDS_backup_initDisplay.apply(this, arguments)

      let iu = window.localStorage.getItem('TWDS_itemusage')
      if (iu === null) return
      iu = JSON.parse(iu)

      const ii = this.obj.item_id
      let title = ''
      let count = 0
      if (ii in iu) {
        iu = iu[ii]
        if (iu.job.length) {
          title = title + iu.job.length + ' trabajos'
          count += iu.job.length
        }
        if (iu.eq.length) {
          if (title > '') title += ', '
          title = title + iu.eq.length + ' conjunto de equipos'
          count += iu.eq.length
        }
        if (iu.ds.length) {
          if (title > '') title += ', '
          title = title + iu.ds.length + '  conjunto de equipos de tw-duellstat'
          count += iu.ds.length
        }
      }
      let twcalc = window.localStorage.getItem('TWCalc_Wardrobe')
      if (twcalc !== null) {
        twcalc = JSON.parse(twcalc)
        let wcnt = 0
        for (let i = 0; i < twcalc.length; i++) {
          for (let j = 0; j < 10; j++) {
            if (twcalc[i][j] === ii) { wcnt++ }
          }
        }
        if (wcnt) {
          if (title > '') title += ', '
          title = title + wcnt + ' conjunto de equipos de TW-Calc'
          count += wcnt
        }
      }
      if (!count) {
        return
      }
      const span = document.createElement('span')
      span.classList.add('TWDS_itemusageinfo')
      this.divMain[0].appendChild(span)
      span.textContent = count
      span.title = title
      if (TWDS.settings.saleProtection) {
        this.divMain[0].classList.add('not_auctionable')
        this.divMain[0].classList.add('not_sellable')
      }
    }
  } catch (e) {
  }

  try {
    JobWindow.prototype._TWDS_getBestWearButton = JobWindow.prototype._TWDS_getBestWearButton ||
      JobWindow.prototype.getBestWearButton

    JobWindow.prototype.getBestWearButton = function () {
      const jw = JobWindow.prototype._TWDS_getBestWearButton.apply(this, arguments)
      // var n = this;
      const jobId = this.job.id
      const d = TWDS.getJobBestFromCache(jobId)
      if (d === null) return jw

      const now = new Date().getTime()
      const age = now - d.timestamp
      let agestr = ''
      if (age > 2 * 24 * 3600 * 1000) {
        agestr = Math.round(age / (24 * 3600 * 1000)) + 'd'
      } else if (age > 2 * 3600 * 1000) {
        agestr = Math.round(age / (3600 * 1000)) + 'h'
      } else {
        agestr = Math.round(age / (60 * 1000)) + 'm'
      }

      const but = TWDS.createButton(
        TWDS._('CLOTHCACHE_BUTTON', 'cached [$agestr$]', { agestr: agestr }), {
          classList: ['TWDS_getbestwear'],
          title: TWDS._('CLOTHCACHE_BUTTON_MOUSEOVER', 'Usar un conjunto de ropa calculado previamente')
        }
      )
      /*
      const but = document.createElement('button')
      but.className = 'TWDS_getbestwear'
      but.textContent = 'cached [' + agestr + ']'
      but.title = 'Use a previously calculated coth set'
      */

      jw[0].appendChild(but) // jw is a jQuery.
      but.onclick = function (e) {
        e.stopImmediatePropagation()

        const d = TWDS.getJobBestFromCache(jobId)
        TWDS.wearItemsHandler(d.items)
      }
      return jw
    }
  } catch (e) {
  }
}
TWDS.registerStartFunc(TWDS.clothcacheStartFunction)
// vim: tabstop=2 shiftwidth=2 expandtab

TWDS.speedCalc = function () {
  const skills = { ride: 1 }

  const availableSets = west.item.Calculator.filterUnavailableSets(west.storage.ItemSetManager.getAll())
  const bestItems = TWDS.speedCalc.getBestItems(skills)

  console.log('bi', bestItems)
  console.log('bestItems', TWDS.describeItemCombo(bestItems))

  const bestItemsContainer = new west.item.ItemSetContainer()
  for (let i = 0; i < bestItems.length; i++) { bestItemsContainer.addItem(bestItems[i].getId()) }

  console.log('availableSets', availableSets)
  let sets = TWDS.speedCalc.createSubsets(availableSets, bestItems)
  console.log('subsets', sets)
  if (sets.length > 500) { return }
  // klappt nichts, so kann man speed nicht optimieren
  // MUSS man aber vielleicht?
  sets = TWDS.speedCalc.filterUneffectiveSets(sets)
  console.log('subsets after filter', sets)

  // Was fehlt: FillEmpty(combinesets, BestItems,AllItemsWithSpeedBonus)

  sets = west.item.Calculator.fillEmptySlots(west.item.Calculator.combineSets(sets), bestItems)
  sets.push(bestItemsContainer)
  console.log('mergedsets', sets)

  let bestPoints = -1
  let best = null
  for (let i = 0; i < sets.length; i++) {
    const spd = TWDS.speedCalc.calcCombinedSet(sets[i])
    if (spd > bestPoints) {
      bestPoints = spd
      best = sets[i]
      console.log(TWDS.describeItemCombo(TWDS.speedCalc.getItems(sets[i])), sets[i],
        TWDS.speedCalc.getItems(sets[i]), spd)
    }
  }
  console.log('best', bestPoints, best)
  return TWDS.speedCalc.getItems(best)
}

TWDS.speedCalc.filterUneffectiveSets = function (sets) {
  const r = []
  const bestBySlots = {}
  for (let i = 0; i < sets.length; i++) {
    // setValue = sets[i].getSetValue(skills, jobId);
    const tmp = TWDS.speedCalc.getSetSpeedyValues(sets[i])
    const speed = TWDS.speedCalc.calc3(tmp.speed, tmp.ride, tmp.speedBonus)
    if (speed < 1) { continue }
    const slots = JSON.stringify(sets[i].getUsedSlots().sort())
    if (!bestBySlots[slots]) {
      bestBySlots[slots] = [speed, sets[i]]
    } else {
      if (bestBySlots[slots][0] < speed) { bestBySlots[slots] = [speed, sets[i]] }
    }
  }
  for (const i in bestBySlots) {
    r.push(bestBySlots[i][1])
  }
  return r
}

TWDS.speedCalc.getItems = function (set) {
  const it = []
  for (let i = 0; i < set.items.length; i++) { it.push(set.items[i]) }
  for (const oneset of Object.values(set.sets)) {
    for (let i = 0; i < oneset.items.length; i++) { it.push(oneset.items[i]) }
  }
  return it
}
TWDS.speedCalc.calcSet = function (set) {
  const tmp = TWDS.speedCalc.getSetSpeedyValues(set)
  return TWDS.speedCalc.calc3(tmp.speed, tmp.ride, tmp.speedBonus)
}
TWDS.speedCalc.calcCombinedSet = function (set) {
  const tmp = TWDS.speedCalc.getCombinedSetSpeedyValues(set)
  return TWDS.speedCalc.calc3(tmp.speed, tmp.ride, tmp.speedBonus)
}
/*
var bestItems, bestItemsContainer, sets, i, best, points = 0, tmp, availableSets;
// availableSets = this.filterUnavailableSets(west.storage.ItemSetManager.getAll());
// bestItems = this.getBestItems(skills, true);
//bestItemsContainer = new west.item.ItemSetContainer;
//for (i = 0; i < bestItems.length; i++)
//bestItemsContainer.addItem(bestItems[i].getId());
sets = this.createSubsets(availableSets, bestItems, skills, jobId);
if (window.__limitclothcalc && sets.length > 500) {
sets = this.createSubsets(availableSets, bestItems, skills, jobId, true);
console && console.log('using approximation...');
}
sets = this.filterUneffectiveSets(sets, skills, jobId);
sets = this.fillEmptySlots(this.combineSets(sets), bestItems);
sets.push(bestItemsContainer);
for (i = 0; i < sets.length; i++) {
tmp = sets[i].getValue(skills, jobId);
if (tmp > points) {
points = tmp;
best = sets[i];
}
}
return best;
*/
TWDS.speedCalc.createCombinations = function (items, k) {
  let i, j, combs, head, tailcombs
  if (k > items.length || k <= 0) {
    return []
  }
  if (k === items.length) {
    return [items]
  }
  if (k === 1) {
    combs = []
    for (i = 0; i < items.length; i++) {
      combs.push([items[i]])
    }
    return combs
  }
  combs = []
  for (i = 0; i < items.length - k + 1; i++) {
    head = items.slice(i, i + 1)
    tailcombs = TWDS.speedCalc.createCombinations(items.slice(i + 1), k - 1)
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]))
    }
  }
  return combs
}
TWDS.speedCalc.createSubsets = function (fullSets, bestItems) {
  let i; const sets = []; let set; let j; let permutations; let k; let l; let tmpSet
  for (i = 0; i < fullSets.length; i++) {
    set = fullSets[i]
    for (j = set.items.length; j > 0; j--) {
      if (!Object.prototype.hasOwnProperty.call(set.bonus, j)) { continue }
      // if (!set.bonus.hasOwnProperty(j)) { continue }
      permutations = TWDS.speedCalc.createCombinations(set.items, j)
      for (k = 0, l = permutations.length; k < l; k++) {
        if (!west.item.Calculator.itemsCombineable(permutations[k])) { continue }
        tmpSet = new west.item.ItemSet({
          key: set.key,
          items: permutations[k],
          bonus: set.bonus
        })
        if (!TWDS.speedCalc.beatsBestItems(tmpSet, bestItems)) { continue }
        sets.push(tmpSet)
      }
    }
  }
  return sets
}

TWDS.speedCalc.beatsBestItems = function (set, bestItems, skills, jobId) {
  // find out what the best items give us.
  let bestItemBase = 0
  let bestItemRide = 0
  let bestItemSpeedBonus = 0

  const setSlots = set.getUsedSlots()
  for (let i = 0; i < bestItems.length; i++) {
    if (setSlots.indexOf(bestItems[i].getType()) === -1) { continue }
    const v = TWDS.speedCalc.getSpeedyValues(bestItems[i])
    if (v.speed > bestItemBase) bestItemBase = v.speed
    bestItemRide += v.ride
    bestItemSpeedBonus += v.speedBonus
  }
  const biSpeed = TWDS.speedCalc.calc3(bestItemBase, bestItemRide, bestItemSpeedBonus)
  const setData = TWDS.speedCalc.getSetSpeedyValues(set)
  const setSpeed = TWDS.speedCalc.calc3(setData.speed, setData.ride, setData.speedBonus)
  // console.log("bi values",biSpeed,bestItemBase, bestItemRide, bestItemSpeedBonus)
  // console.log("set values",setSpeed,setData.speed, setData.ride, setData.speedBonus)
  return setSpeed > biSpeed // || setData.speedBonus > bestItemSpeedBonus
}

TWDS.speedCalc.getBestItems = function (skills) {
  const bestItems = {}
  const result = []
  const itemsByBase = Bag.getItemsIdsByBaseItemIds()
  west.common.forEach(itemsByBase, function (items, baseId) {
    const item = ItemManager.get(items[0])
    const type = item.getType()
    // const value = item.getValue(skills)
    bestItems[type] = bestItems[type] || []
    const value = TWDS.speedCalc.getSpeedyValues(item)
    if ((value.ride || value.speedBonus) && item.wearable()) {
      bestItems[type].push({
        item: item,
        id: item.getId(),
        base_id: baseId,
        value: value
      })
    }
  })
  west.common.forEach(bestItems, function (items, type) {
    let wearItem = Wear.get(type)
    if (wearItem) {
      wearItem = ItemManager.get(wearItem.getId())
      items.push({
        item: wearItem,
        id: wearItem.getId(),
        base_id: wearItem.getItemBaseId(),
        value: TWDS.speedCalc.getSpeedyValues(wearItem)
      })
    }
    // return (100 + 100 * tmp.speed + tmp.ride) * (1 + tmp.speedBonus)
    bestItems[type] = items.sort(function (a, b) {
      const aSpeed = TWDS.speedCalc.calc3(a.value.speed, a.value.ride, a.value.speedBonus)
      const bSpeed = TWDS.speedCalc.calc3(b.value.speed, b.value.ride, b.value.speedBonus)
      return (bSpeed - aSpeed)
    })
    if (bestItems[type].length) {
      console.log('type', type, bestItems[type][0])
      result.push(bestItems[type][0].item)
    }
  })
  return result
}
TWDS.speedCalc.calc3 = function (animalSpeed, ride, speedBonus) {
  let spd = Math.round(1 / (animalSpeed || 1) * 100 - 100)
  // Math.round(Character.defaultSpeed / (Character.defaultSpeed * 0.28) * 100 - 100)
  spd = (100 + spd + ride) * (1 + speedBonus)
  return spd
}

// a modified version of west.item.Item.getValue
// -jobPoints
// +speed bonus
TWDS.speedCalc.getSpeedyValues = function (item) {
  const skills = { ride: 1 }
  let value = 0
  let speedBonus = 0
  const attributes = {}
  let skill
  let attr
  const skillAddition = {}
  let skillArr
  let i
  const memo = 'TWDSspeedy'
  let bonusExtractor
  let affectedSkills

  if (item._memo[memo]) { return item._memo[memo] }

  for (skill in skills) {
    if (!skills[skill]) { continue }
    attr = CharacterSkills.getAttributeKey4Skill(skill)
    attributes[attr] = (attributes[attr] || 0) + 1
  }
  for (attr in item.bonus.attributes) {
    if (!attributes[attr]) { continue }
    skillArr = CharacterSkills.getSkillKeys4Attribute(attr)
    for (i = 0; i < skillArr.length; i++) {
      if (skills[skillArr[i]]) { skillAddition[skillArr[i]] = item.bonus.attributes[attr] }
    }
  }
  if (item.hasItemBonus()) {
    bonusExtractor = new west.item.BonusExtractor(Character, item.getItemLevel())
    for (i = 0; i < item.bonus.item.length; i++) {
      const b = bonusExtractor.getExportValue(item.bonus.item[i])
      if (b.key === 'speed') { speedBonus += b.value }
      affectedSkills = bonusExtractor.getAffectedSkills(item.bonus.item[i])
      for (skill in affectedSkills) {
        if (!(skill in skills)) { continue }
        value += skills[skill] * affectedSkills[skill]
      }
    }
  }
  for (skill in skills) {
    if (item.bonus.skills[skill] || skillAddition[skill]) {
      value += skills[skill] * ((item.bonus.skills[skill] || 0) + (skillAddition[skill] || 0))
    }
  }
  if (item.usebonus || item.action) { value = 0 }
  const out = {
    speed: item.speed !== null ? item.speed : 0,
    ride: value,
    speedBonus: speedBonus
  }
  item._memo[memo] = out
  return out
}

TWDS.speedCalc.getCombinedSetSpeedyValues = function (combo) {
  const boni = {
    speed: 0,
    ride: 0,
    speedBonus: 0
  }
  for (let i = 0; i < combo.sets.length; i++) {
    const v = TWDS.speedCalc.getSetSpeedyValues(combo.sets[i])
    if (v.speed) boni.speed = v.speed
    boni.ride += v.ride
    boni.speedBonus += v.speedBonus
  }
  for (let i = 0; i < combo.items.length; i++) {
    const item = ItemManager.get(combo.items[i])
    const v = TWDS.speedCalc.getSpeedyValues(item)
    if (v.speed) boni.speed = v.speed // this assumes we'll never see a set with two horses...
    boni.ride += v.ride
    boni.speedBonus += v.speedBonus
  }
  return boni
}

TWDS.speedCalc.getSetSpeedyValues = function (set) {
  const boni = {
    speed: 0,
    ride: 0,
    speedBonus: 0
  }
  const v = TWDS.speedCalc.getSetBonusSpeedyValues(set)
  boni.speed = v.speed
  boni.ride = v.ride
  boni.speedBonus = v.speedBonus
  let i
  for (i = 0; i < set.items.length; i++) {
    const item = ItemManager.get(set.items[i])
    const v = TWDS.speedCalc.getSpeedyValues(item)
    if (v.speed) boni.speed = v.speed // this assumes we'll never see a set with two horses...
    boni.ride += v.ride
    boni.speedBonus += v.speedBonus
  }
  return boni
}
TWDS.speedCalc.getSetBonusSpeedyValues = function (set) {
  const boni = {
    speed: 0, // stays that way
    ride: 0,
    speedBonus: 0
  }
  const bonus = set.getMergedBonus()
  const memo = 'speedy'
  // console.log("merge",set,bonus)

  if (!('_memo' in set)) set._memo = {} // this happens for merged sets.

  if (set._memo[memo]) { return set._memo[memo] }
  if (bonus.skill.ride) { boni.ride += bonus.skill.ride }
  const attr = CharacterSkills.getAttributeKey4Skill('ride')
  if (bonus.attribute[attr]) { boni.ride += bonus.attribute[attr] }
  boni.speedBonus = bonus.speed
  set._memo[memo] = boni
  return boni
}

/*
        getValue: function(skills, jobId) {
            var value = 0, attributes = {}, skill, attr, skillAddition = {}, skillArr, i, memo = JSON.stringify(skills), bonusExtractor, affectedSkills;
            if (this._memo[memo])
                return this._memo[memo];
            for (skill in skills) {
                if (!skills[skill])
                    continue;
                attr = CharacterSkills.getAttributeKey4Skill(skill);
                attributes[attr] = (attributes[attr] || 0) + 1;
            }
            for (attr in this.bonus.attributes) {
                if (!attributes[attr])
                    continue;
                skillArr = CharacterSkills.getSkillKeys4Attribute(attr);
                for (i = 0; i < skillArr.length; i++) {
                    if (skills[skillArr[i]])
                        skillAddition[skillArr[i]] = this.bonus.attributes[attr];
                }
            }
            if (this.hasItemBonus()) {
                bonusExtractor = new west.item.BonusExtractor(Character,this.getItemLevel());
                for (i = 0; i < this.bonus.item.length; i++) {
                    affectedSkills = bonusExtractor.getAffectedSkills(this.bonus.item[i]);
                    for (skill in affectedSkills) {
                        if (!(skill in skills))
                            continue;
                        value += skills[skill] * affectedSkills[skill];
                    }
                    value += bonusExtractor.getWorkPointAddition(this.bonus.item[i], jobId);
                }
            }
            for (skill in skills) {
                if (this.bonus.skills[skill] || skillAddition[skill])
                    value += skills[skill] * ((this.bonus.skills[skill] || 0) + (skillAddition[skill] || 0));
            }
            if (this.usebonus || this.action)
                value = 0;
            this._memo[memo] = value;
            return value;
        },
*/
// vim: tabstop=2 shiftwidth=2 expandtab

TWDS.genCalc = function (bonusNames, skills) {
  const availableSets = west.item.Calculator.filterUnavailableSets(west.storage.ItemSetManager.getAll())
  const bestItems = TWDS.genCalc.getBestItems(bonusNames, skills)

  console.log('bi', bestItems)
  console.log('bestItems', TWDS.describeItemCombo(bestItems))

  const bestItemsContainer = new west.item.ItemSetContainer()
  for (let i = 0; i < bestItems.length; i++) { bestItemsContainer.addItem(bestItems[i].getId()) }

  console.log('availableSets', availableSets)
  let sets = TWDS.genCalc.createSubsets(availableSets, bestItems, bonusNames, skills)
  console.log('subsets', sets)
  // klappt nichts, so kann man speed nicht optimieren
  // MUSS man aber vielleicht?
  sets = TWDS.genCalc.filterUneffectiveSets(sets, bonusNames, skills)
  console.log('subsets after filter', sets)
  if (sets.length > 750) { return }

  // Was fehlt: FillEmpty(combinesets, BestItems,AllItemsWithSpeedBonus)

  sets = west.item.Calculator.fillEmptySlots(west.item.Calculator.combineSets(sets), bestItems)
  sets.push(bestItemsContainer)
  console.log('mergedsets', sets)

  let bestPoints = -1
  let best = null
  for (let i = 0; i < sets.length; i++) {
    const spd = TWDS.genCalc.calcCombinedSet(sets[i], bonusNames, skills)
    if (spd > bestPoints) {
      bestPoints = spd
      best = sets[i]
      console.log(TWDS.describeItemCombo(TWDS.genCalc.getItems(sets[i])), sets[i],
        TWDS.genCalc.getItems(sets[i]), spd)
    }
  }
  console.log('best', bestPoints, best)
  return TWDS.genCalc.getItems(best)
}

TWDS.genCalc.filterUneffectiveSets = function (sets, bonusNames, skills) {
  const r = []
  const bestBySlots = {}
  for (let i = 0; i < sets.length; i++) {
    // setValue = sets[i].getSetValue(skills, jobId);
    const tmp = TWDS.genCalc.getSetGenValues(sets[i], bonusNames, skills)
    const speed = TWDS.genCalc.calc2(tmp.theBonus, tmp.theSecondary)
    if (speed < 0.001) { continue }
    const slots = JSON.stringify(sets[i].getUsedSlots().sort())
    if (!bestBySlots[slots]) {
      bestBySlots[slots] = [speed, sets[i]]
    } else {
      if (bestBySlots[slots][0] < speed) { bestBySlots[slots] = [speed, sets[i]] }
    }
  }
  for (const i in bestBySlots) {
    r.push(bestBySlots[i][1])
  }
  return r
}

TWDS.genCalc.getItems = function (set) {
  const it = []
  for (let i = 0; i < set.items.length; i++) { it.push(set.items[i]) }
  for (const oneset of Object.values(set.sets)) {
    for (let i = 0; i < oneset.items.length; i++) { it.push(oneset.items[i]) }
  }
  return it
}

TWDS.genCalc.calcCombinedSet = function (set, bonusNames, skills) {
  const tmp = TWDS.genCalc.getCombinedSetGenValues(set, bonusNames, skills)
  return TWDS.genCalc.calc2(tmp.theBonus, tmp.theSecondary)
}

TWDS.genCalc.createCombinations = function (items, k) {
  let i, j, combs, head, tailcombs
  if (k > items.length || k <= 0) {
    return []
  }
  if (k === items.length) {
    return [items]
  }
  if (k === 1) {
    combs = []
    for (i = 0; i < items.length; i++) {
      combs.push([items[i]])
    }
    return combs
  }
  combs = []
  for (i = 0; i < items.length - k + 1; i++) {
    head = items.slice(i, i + 1)
    tailcombs = TWDS.genCalc.createCombinations(items.slice(i + 1), k - 1)
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]))
    }
  }
  return combs
}
TWDS.genCalc.createSubsets = function (fullSets, bestItems, bonusNames, skills) {
  let i; const sets = []; let set; let j; let permutations; let k; let l; let tmpSet
  for (i = 0; i < fullSets.length; i++) {
    set = fullSets[i]
    let items
    if (('range' in bonusNames) || ('melee' in bonusNames)) {
      items = []
      for (j = 0; j < set.items.length; j++) {
        const it = ItemManager.get(set.items[j])
        if (it.type === 'right_arm') {
          if ('melee' in bonusNames && it.sub_type !== 'hand') continue
          if ('range' in bonusNames && it.sub_type !== 'shot') continue
        }
        items.push(set.items[j])
      }
    } else {
      items = set.items
    }
    for (j = items.length; j > 0; j--) {
      if (!Object.prototype.hasOwnProperty.call(set.bonus, j)) { continue }
      // if (!set.bonus.hasOwnProperty(j)) { continue }
      permutations = TWDS.genCalc.createCombinations(items, j)
      for (k = 0, l = permutations.length; k < l; k++) {
        if (!west.item.Calculator.itemsCombineable(permutations[k])) { continue }
        tmpSet = new west.item.ItemSet({
          key: set.key,
          items: permutations[k],
          bonus: set.bonus
        })
        if (!TWDS.genCalc.beatsBestItems(tmpSet, bestItems, bonusNames, skills)) { continue }
        sets.push(tmpSet)
      }
    }
  }
  return sets
}

TWDS.genCalc.beatsBestItems = function (set, bestItems, bonusNames, skills) {
  // find out what the best items give us.
  let bestItemBonus = 0
  let bestItemSecondary = 0

  const setSlots = set.getUsedSlots()
  for (let i = 0; i < bestItems.length; i++) {
    if (setSlots.indexOf(bestItems[i].getType()) === -1) { continue }
    const v = TWDS.genCalc.getGenValues(bestItems[i], bonusNames, skills)
    bestItemBonus += v.theBonus
    bestItemSecondary += v.theSecondary
  }
  const biSpeed = TWDS.genCalc.calc2(bestItemBonus, bestItemSecondary)
  const setData = TWDS.genCalc.getSetGenValues(set, bonusNames, skills)
  if (isNaN(setData.theBonus)) {
    console.log('isNaN trap', 'bBI', set, bonusNames, skills)
  }
  const setSpeed = TWDS.genCalc.calc2(setData.theBonus, setData.theSecondary, bestItems)
  return setSpeed > biSpeed // || setData.speedBonus > bestItemSpeedBonus
}

TWDS.genCalc.getBestItems = function (bonusNames, skills) {
  const bestItems = {}
  const result = []
  const itemsByBase = Bag.getItemsIdsByBaseItemIds()
  west.common.forEach(itemsByBase, function (items, baseId) {
    const item = ItemManager.get(items[0])
    const type = item.getType()
    if (type === 'right_arm') {
      if ('range' in bonusNames && item.sub_type !== 'shot') {
        return
      }
      if ('melee' in bonusNames && item.sub_type !== 'hand') {
        return
      }
    }
    bestItems[type] = bestItems[type] || []
    // const value = item.getValue(skills)
    const value = TWDS.genCalc.getGenValues(item, bonusNames, skills)
    if ((value.theBonus || value.theSecondary) && item.wearable()) {
      bestItems[type].push({
        item: item,
        id: item.getId(),
        base_id: baseId,
        value: value
      })
    }
  })
  west.common.forEach(bestItems, function (items, type) {
    let wearItem = Wear.get(type)
    if (wearItem) {
      wearItem = ItemManager.get(wearItem.getId())
      items.push({
        item: wearItem,
        id: wearItem.getId(),
        base_id: wearItem.getItemBaseId(),
        value: TWDS.genCalc.getGenValues(wearItem, bonusNames, skills)
      })
    }
    // return (100 + 100 * tmp.speed + tmp.ride) * (1 + tmp.speedBonus)
    bestItems[type] = items.sort(function (a, b) {
      const aSpeed = TWDS.genCalc.calc2(a.value.theBonus, a.value.theSecondary)
      const bSpeed = TWDS.genCalc.calc2(b.value.theBonus, b.value.theSecondary)
      return (bSpeed - aSpeed)
    })
    if (bestItems[type].length) {
      console.log('type', type, bestItems[type][0])
      result.push(bestItems[type][0].item)
    }
  })
  return result
}
TWDS.genCalc.calc2 = function (theBonus, theSecondary) {
  return theBonus + theSecondary
}

// a modified version of west.item.Item.getValue
// -jobPoints
// +speed bonus
TWDS.genCalc.getGenValues = function (item, bonusNames, skills) {
  let value = 0
  let theBonus = 0
  const attributes = {}
  let skill
  let attr
  const skillAddition = {}
  let skillArr
  let i
  const memo = 'TWDSgenCalc.' + JSON.stringify(bonusNames) + '.' + JSON.stringify(skills)

  let bonusExtractor
  let affectedSkills

  if (!('_memo' in item)) item._memo = {} // this happens.

  if (item._memo[memo]) { return item._memo[memo] }

  for (skill in skills) {
    if (!skills[skill]) { continue }
    attr = CharacterSkills.getAttributeKey4Skill(skill)
    attributes[attr] = (attributes[attr] || 0) + 1
  }
  for (attr in item.bonus.attributes) {
    if (!attributes[attr]) { continue }
    skillArr = CharacterSkills.getSkillKeys4Attribute(attr)
    for (i = 0; i < skillArr.length; i++) {
      if (skills[skillArr[i]]) { skillAddition[skillArr[i]] = item.bonus.attributes[attr] }
    }
  }
  if (item.hasItemBonus()) {
    bonusExtractor = new west.item.BonusExtractor(Character, item.getItemLevel())
    for (i = 0; i < item.bonus.item.length; i++) {
      const b = bonusExtractor.getExportValue(item.bonus.item[i])

      if (b.key in bonusNames) { theBonus += b.value * bonusNames[b.key] } else {
        const old = theBonus
        if (b.key === 'fort_defense' && 'fbdefense' in bonusNames) {
          theBonus += b.value * bonusNames.fbdefense
        }
        if (b.key === 'fort_defense_sector' && 'fbdefense' in bonusNames) {
          theBonus += b.value * bonusNames.fbdefense
        }
        if (b.key === 'fort_offense' && 'fboffense' in bonusNames) {
          theBonus += b.value * bonusNames.fboffense
        }
        if (b.key === 'fort_offense_sector' && 'fboffense' in bonusNames) {
          theBonus += b.value * bonusNames.fboffense
        }
        if (b.key === 'fort_resistance' && 'fbresistance' in bonusNames) {
          theBonus += b.value * bonusNames.fbresistance
        }
        if (b.key === 'fort_damage_sector' && 'fbdamage' in bonusNames) {
          theBonus += b.value * bonusNames.fbdamage
        }
        if (isNaN(theBonus)) {
          console.log('isNaN trap', b.key, b.value, old, item, bonusNames)
          break
        }
      }

      affectedSkills = bonusExtractor.getAffectedSkills(item.bonus.item[i])
      for (skill in affectedSkills) {
        if (!(skill in skills)) { continue }
        value += skills[skill] * affectedSkills[skill]
      }
    }
  }
  for (skill in skills) {
    if (item.bonus.skills[skill] || skillAddition[skill]) {
      value += skills[skill] * ((item.bonus.skills[skill] || 0) + (skillAddition[skill] || 0))
    }
  }
  if (item.usebonus || item.action) { value = 0 }
  const out = {
    theBonus: theBonus,
    theSecondary: value
  }
  item._memo[memo] = out
  return out
}

TWDS.genCalc.getCombinedSetGenValues = function (combo, bonusNames, skills) {
  const boni = {
    theBonus: 0,
    theSecondary: 0
  }
  for (let i = 0; i < combo.sets.length; i++) {
    const v = TWDS.genCalc.getSetGenValues(combo.sets[i], bonusNames, skills)
    boni.theBonus += v.theBonus
    boni.theSecondary += v.theSecondary
  }
  for (let i = 0; i < combo.items.length; i++) {
    const item = ItemManager.get(combo.items[i])
    const v = TWDS.genCalc.getGenValues(item, bonusNames, skills)
    boni.theBonus += v.theBonus
    boni.theSecondary += v.theSecondary
  }
  return boni
}

TWDS.genCalc.getSetGenValues = function (set, bonusNames, skills) {
  const boni = {
    theBonus: 0,
    theSecondary: 0
  }
  const v = TWDS.genCalc.getSetBonusGenValues(set, bonusNames, skills)
  boni.theBonus = v.theBonus
  boni.theSecondary = v.theSecondary
  let i
  for (i = 0; i < set.items.length; i++) {
    const item = ItemManager.get(set.items[i])
    const v = TWDS.genCalc.getGenValues(item, bonusNames, skills)
    boni.theBonus += v.theBonus
    boni.theSecondary += v.theSecondary
  }
  return boni
}
TWDS.genCalc.getSetBonusGenValues = function (set, bonusNames, skills) {
  const boni = {
    theBonus: 0,
    theSecondary: 0
  }
  const bonus = TWDS.genCalc.ItemSet.getMergedBonus(set)
  const memo = 'TWDS.gSBGV.' + JSON.stringify(bonusNames) + '.' + JSON.stringify(skills)

  if (!('_memo' in set)) set._memo = {} // this happens for merged sets.

  // if (!(memo in set._memo)) console.log("merge",set,bonus)

  if (set._memo[memo]) { return set._memo[memo] }

  if (skills) {
    for (const skill in skills) {
      if (bonus.skill[skill]) { boni.theSecondary += bonus.skill[skill] * skills[skill] }
      const attr = CharacterSkills.getAttributeKey4Skill(skill)
      if (bonus.attribute[attr]) { boni.theSecondary += bonus.attribute[attr] * skills[skill] }
    }
  }
  for (const [k, factor] of Object.entries(bonusNames)) {
    if (k === 'fbdefense') {
      if ('fortbattle' in bonus && 'defensa' in bonus.fortbattle) { boni.theBonus += bonus.fortbattle.defense * factor }
    } else if (k === 'fboffense') {
      if ('fortbattle' in bonus && 'ataque' in bonus.fortbattle) { boni.theBonus += bonus.fortbattle.offense * factor }
    } else if (k === 'fbdamage') {
      if ('fortbattle' in bonus && 'daño' in bonus.fortbattle) { boni.theBonus += bonus.fortbattle.damage * factor }
    } else if (k === 'fbresistance') {
      if ('fortbattle' in bonus && 'resistencia' in bonus.fortbattle) { boni.theBonus += bonus.fortbattle.resistance * factor }
    } else {
      boni.theBonus += bonus[k] * factor
    }
  }

  if (isNaN(boni.theBonus)) {
    console.log('isNaN trap', 'gSBGV', boni, set, bonusNames, skills)
  }
  set._memo[memo] = boni
  return boni
}

// copy of ItemSet.getMergedBonus, with dollar/damage init fixed, and this replaced by set para
TWDS.genCalc.ItemSet = {}

TWDS.genCalc.ItemSet.getMergedBonus = function (set) {
  if (set._mergedBonus) { return set._mergedBonus }
  const bonus = {
    damage: 0,
    dollar: 0,
    attribute: {},
    skill: {},
    job: {},
    speed: 0,
    regen: 0,
    luck: 0,
    pray: 0,
    drop: 0,
    fortbattle: {},
    experience: 0
  }; const bonusObjects = TWDS.genCalc.ItemSet.getMergedStages(set); let i; let b; const bonusExtractor = new west.item.BonusExtractor(Character)
  const merge = function (b, value) {
    switch (b.type) {
      case 'skill':
      case 'attribute':
      case 'fortbattle':
        bonus[b.type][b.name] = (bonus[b.type][b.name] || 0) + value
        break
      case 'job':
        bonus.job[b.job] = (bonus.job[b.job] || 0) + value
        break
      case 'speed':
      case 'regen':
      case 'luck':
      case 'pray':
      case 'drop':
      case 'experience':
      case 'damage':
      case 'dollar':
        bonus[b.type] += value
        break
      case 'character':
        merge(b.bonus, bonusExtractor.getCharacterItemValue(b))
        break
      default:
        if (window.DEBUG) { console.log('ItemSet: unknown bonus to merge: ', b.type) }
        break
    }
  }
  for (i = 0; i < bonusObjects.length; i++) {
    b = bonusObjects[i]
    merge(b, b.value)
  }
  return (set._mergedBonus = bonus)
}

TWDS.genCalc.ItemSet.getMergedStages = function (set, cntPar) {
  let stage
  const bonus = []
  let bb
  const cnt = cntPar !== undefined ? cntPar : set.items.length
  let i
  let b
  const merge = function (b, value) {
    let found = false
    let bLen = bonus.length
    while (bLen--) {
      bb = bonus[bLen]
      if (b.type !== bb.type) { continue }
      if (b.type === 'character' && b.roundingMethod === bb.roundingMethod && b.key === bb.key && b.bonus.type === bb.bonus.type && b.bonus.name === bb.bonus.name) {
        found = true
        bb.bonus.value += b.bonus.value
      } else if (b.type === 'job' && b.job === bb.job) {
        found = true
        bb.value += b.value
      } else if (['speed', 'regen', 'luck', 'pray', 'experience', 'dollar', 'damage', 'drop'].indexOf(b.type) !== -1) {
        found = true
        bb.value += b.value
      } else if (['skill', 'attribute', 'fortbattle'].indexOf(b.type) !== -1 && b.name === bb.name && bb.isSector === b.isSector) {
        found = true
        bb.value += b.value
      }
    }
    if (found) { return }
    bonus.push(window.clone(b))
  }
  for (stage in set.bonus) {
    if (parseInt(stage, 10) > cnt) { continue }
    for (i = 0; i < set.bonus[stage].length; i++) {
      b = set.bonus[stage][i]
      merge(b, b.value)
    }
  }
  return bonus
}
TWDS.jobData = {
  job_1: { job_wages: 13.17, job_exp: 7.25, job_luck: 0, job_danger: 1, job_maxdmg: 10 },
  job_2: { job_wages: 8.37, job_exp: 11.50, job_luck: 2, job_danger: 20, job_maxdmg: 40 },
  job_3: { job_wages: 11.17, job_exp: 11.49, job_luck: 0, job_danger: 10, job_maxdmg: 25 },
  job_4: { job_wages: 17.57, job_exp: 7.33, job_luck: 2, job_danger: 2, job_maxdmg: 40 },
  job_5: { job_wages: 8.46, job_exp: 12.93, job_luck: 0, job_danger: 3, job_maxdmg: 10 },
  job_6: { job_wages: 16.46, job_exp: 9.73, job_luck: 4, job_danger: 1, job_maxdmg: 25 },
  job_7: { job_wages: 8.32, job_exp: 7.25, job_luck: 6, job_danger: 2, job_maxdmg: 10 },
  job_8: { job_wages: 11.17, job_exp: 15.25, job_luck: 2, job_danger: 4, job_maxdmg: 10 },
  job_9: { job_wages: 11.17, job_exp: 15.25, job_luck: 5, job_danger: 6, job_maxdmg: 49 },
  job_10: { job_wages: 13.17, job_exp: 14.18, job_luck: 0, job_danger: 2, job_maxdmg: 15 },
  job_11: { job_wages: 17.59, job_exp: 7.25, job_luck: 2, job_danger: 1, job_maxdmg: 15 },
  job_12: { job_wages: 16.32, job_exp: 16.31, job_luck: 3, job_danger: 3, job_maxdmg: 15 },
  job_13: { job_wages: 22.74, job_exp: 16.31, job_luck: 0, job_danger: 5, job_maxdmg: 25 },
  job_14: { job_wages: 14.97, job_exp: 16.31, job_luck: 8, job_danger: 5, job_maxdmg: 10 },
  job_15: { job_wages: 20.97, job_exp: 16.31, job_luck: 4, job_danger: 5, job_maxdmg: 10 },
  job_16: { job_wages: 13.17, job_exp: 18.18, job_luck: 2, job_danger: 7, job_maxdmg: 50 },
  job_17: { job_wages: 23.59, job_exp: 22.49, job_luck: 5, job_danger: 18, job_maxdmg: 10 },
  job_18: { job_wages: 22.74, job_exp: 11.49, job_luck: 5, job_danger: 7, job_maxdmg: 20 },
  job_19: { job_wages: 26.59, job_exp: 20.47, job_luck: 22, job_danger: 9, job_maxdmg: 10 },
  job_20: { job_wages: 13.17, job_exp: 21.90, job_luck: 7, job_danger: 21, job_maxdmg: 7 },
  job_21: { job_wages: 21.97, job_exp: 24.31, job_luck: 5, job_danger: 10, job_maxdmg: 15 },
  job_22: { job_wages: 16.32, job_exp: 23.74, job_luck: 0, job_danger: 11, job_maxdmg: 25 },
  job_23: { job_wages: 18.80, job_exp: 19.74, job_luck: 5, job_danger: 6, job_maxdmg: 25 },
  job_24: { job_wages: 30.97, job_exp: 20.47, job_luck: 6, job_danger: 32, job_maxdmg: 10 },
  job_25: { job_wages: 27.25, job_exp: 17.28, job_luck: 9, job_danger: 33, job_maxdmg: 10 },
  job_26: { job_wages: 19.97, job_exp: 26.39, job_luck: 15, job_danger: 12, job_maxdmg: 5 },
  job_27: { job_wages: 27.97, job_exp: 14.18, job_luck: 2, job_danger: 21, job_maxdmg: 45 },
  job_28: { job_wages: 18.80, job_exp: 21.19, job_luck: 15, job_danger: 6, job_maxdmg: 10 },
  job_29: { job_wages: 19.97, job_exp: 27.97, job_luck: 0, job_danger: 35, job_maxdmg: 10 },
  job_30: { job_wages: 27.25, job_exp: 21.19, job_luck: 6, job_danger: 30, job_maxdmg: 25 },
  job_31: { job_wages: 14.97, job_exp: 24.31, job_luck: 9, job_danger: 41, job_maxdmg: 50 },
  job_32: { job_wages: 32.17, job_exp: 16.31, job_luck: 8, job_danger: 4, job_maxdmg: 6 },
  job_33: { job_wages: 35.17, job_exp: 12.93, job_luck: 4, job_danger: 29, job_maxdmg: 15 },
  job_34: { job_wages: 16.32, job_exp: 26.98, job_luck: 42, job_danger: 11, job_maxdmg: 25 },
  job_35: { job_wages: 24.39, job_exp: 30.98, job_luck: 10, job_danger: 52, job_maxdmg: 20 },
  job_36: { job_wages: 25.97, job_exp: 11.49, job_luck: 25, job_danger: 12, job_maxdmg: 20 },
  job_37: { job_wages: 29.80, job_exp: 27.97, job_luck: 3, job_danger: 14, job_maxdmg: 20 },
  job_38: { job_wages: 20.97, job_exp: 31.32, job_luck: 23, job_danger: 19, job_maxdmg: 15 },
  job_39: { job_wages: 35.59, job_exp: 23.74, job_luck: 6, job_danger: 21, job_maxdmg: 15 },
  job_40: { job_wages: 34.59, job_exp: 21.90, job_luck: 0, job_danger: 13, job_maxdmg: 15 },
  job_41: { job_wages: 34.59, job_exp: 25.39, job_luck: 5, job_danger: 7, job_maxdmg: 15 },
  job_42: { job_wages: 17.59, job_exp: 26.98, job_luck: 23, job_danger: 38, job_maxdmg: 10 },
  job_43: { job_wages: 23.59, job_exp: 36.31, job_luck: 7, job_danger: 15, job_maxdmg: 25 },
  job_44: { job_wages: 39.97, job_exp: 34.98, job_luck: 6, job_danger: 18, job_maxdmg: 15 },
  job_45: { job_wages: 8.32, job_exp: 35.65, job_luck: 22, job_danger: 37, job_maxdmg: 50 },
  job_46: { job_wages: 30.97, job_exp: 35.65, job_luck: 0, job_danger: 52, job_maxdmg: 25 },
  job_47: { job_wages: 27.25, job_exp: 31.32, job_luck: 18, job_danger: 53, job_maxdmg: 15 },
  job_48: { job_wages: 34.17, job_exp: 35.65, job_luck: 0, job_danger: 42, job_maxdmg: 15 },
  job_49: { job_wages: 39.97, job_exp: 17.28, job_luck: 15, job_danger: 20, job_maxdmg: 10 },
  job_50: { job_wages: 30.97, job_exp: 20.47, job_luck: 64, job_danger: 93, job_maxdmg: 66 },
  job_51: { job_wages: 25.97, job_exp: 34.98, job_luck: 26, job_danger: 45, job_maxdmg: 20 },
  job_52: { job_wages: 31.49, job_exp: 40.80, job_luck: 0, job_danger: 72, job_maxdmg: 33 },
  job_53: { job_wages: 35.97, job_exp: 43.17, job_luck: 17, job_danger: 35, job_maxdmg: 14 },
  job_54: { job_wages: 22.74, job_exp: 21.90, job_luck: 63, job_danger: 34, job_maxdmg: 20 },
  job_55: { job_wages: 46.97, job_exp: 17.28, job_luck: 9, job_danger: 16, job_maxdmg: 50 },
  job_56: { job_wages: 51.17, job_exp: 17.28, job_luck: 0, job_danger: 32, job_maxdmg: 25 },
  job_57: { job_wages: 36.49, job_exp: 44.74, job_luck: 45, job_danger: 43, job_maxdmg: 33 },
  job_58: { job_wages: 29.80, job_exp: 41.10, job_luck: 15, job_danger: 67, job_maxdmg: 25 },
  job_59: { job_wages: 21.97, job_exp: 40.25, job_luck: 30, job_danger: 33, job_maxdmg: 25 },
  job_60: { job_wages: 47.59, job_exp: 31.74, job_luck: 18, job_danger: 43, job_maxdmg: 20 },
  job_61: { job_wages: 32.17, job_exp: 32.13, job_luck: 38, job_danger: 4, job_maxdmg: 20 },
  job_62: { job_wages: 16.32, job_exp: 40.59, job_luck: 52, job_danger: 77, job_maxdmg: 50 },
  job_63: { job_wages: 25.97, job_exp: 36.64, job_luck: 51, job_danger: 44, job_maxdmg: 20 },
  job_64: { job_wages: 25.97, job_exp: 32.13, job_luck: 72, job_danger: 82, job_maxdmg: 25 },
  job_65: { job_wages: 25.17, job_exp: 21.90, job_luck: 90, job_danger: 34, job_maxdmg: 33 },
  job_66: { job_wages: 32.17, job_exp: 44.93, job_luck: 35, job_danger: 71, job_maxdmg: 40 },
  job_67: { job_wages: 53.17, job_exp: 27.97, job_luck: 20, job_danger: 7, job_maxdmg: 33 },
  job_68: { job_wages: 29.17, job_exp: 25.39, job_luck: 83, job_danger: 24, job_maxdmg: 24 },
  job_69: { job_wages: 44.65, job_exp: 44.47, job_luck: 17, job_danger: 35, job_maxdmg: 65 },
  job_70: { job_wages: 42.17, job_exp: 37.28, job_luck: 74, job_danger: 66, job_maxdmg: 15 },
  job_71: { job_wages: 55.39, job_exp: 37.90, job_luck: 23, job_danger: 65, job_maxdmg: 50 },
  job_72: { job_wages: 33.59, job_exp: 44.20, job_luck: 85, job_danger: 83, job_maxdmg: 90 },
  job_73: { job_wages: 51.65, job_exp: 28.80, job_luck: 78, job_danger: 86, job_maxdmg: 50 },
  job_74: { job_wages: 40.25, job_exp: 43.74, job_luck: 95, job_danger: 67, job_maxdmg: 40 },
  job_75: { job_wages: 55.39, job_exp: 30.98, job_luck: 79, job_danger: 72, job_maxdmg: 50 },
  job_76: { job_wages: 30.97, job_exp: 42.65, job_luck: 85, job_danger: 44, job_maxdmg: 33 },
  job_77: { job_wages: 48.49, job_exp: 47.04, job_luck: 92, job_danger: 96, job_maxdmg: 80 },
  job_78: { job_wages: 52.25, job_exp: 31.74, job_luck: 81, job_danger: 26, job_maxdmg: 25 },
  job_79: { job_wages: 47.97, job_exp: 37.28, job_luck: 52, job_danger: 67, job_maxdmg: 20 },
  job_80: { job_wages: 35.97, job_exp: 42.49, job_luck: 76, job_danger: 44, job_maxdmg: 13 },
  job_82: { job_wages: 52.80, job_exp: 32.13, job_luck: 15, job_danger: 14, job_maxdmg: 25 },
  job_83: { job_wages: 46.97, job_exp: 35.65, job_luck: 83, job_danger: 56, job_maxdmg: 30 },
  job_84: { job_wages: 33.59, job_exp: 40.59, job_luck: 17, job_danger: 24, job_maxdmg: 10 },
  job_85: { job_wages: 43.59, job_exp: 30.98, job_luck: 15, job_danger: 29, job_maxdmg: 40 },
  job_86: { job_wages: 32.17, job_exp: 34.65, job_luck: 12, job_danger: 27, job_maxdmg: 25 },
  job_87: { job_wages: 24.39, job_exp: 20.47, job_luck: 7, job_danger: 11, job_maxdmg: 10 },
  job_88: { job_wages: 25.17, job_exp: 29.25, job_luck: 9, job_danger: 23, job_maxdmg: 10 },
  job_90: { job_wages: 25.97, job_exp: 34.32, job_luck: 65, job_danger: 45, job_maxdmg: 45 },
  job_91: { job_wages: 25.17, job_exp: 27.97, job_luck: 10, job_danger: 21, job_maxdmg: 10 },
  job_92: { job_wages: 14.96, job_exp: 14.21, job_luck: 2, job_danger: 6, job_maxdmg: 14 },
  job_93: { job_wages: 13.17, job_exp: 9.65, job_luck: 3, job_danger: 2, job_maxdmg: 9 },
  job_94: { job_wages: 8.32, job_exp: 12.93, job_luck: 0, job_danger: 2, job_maxdmg: 9 },
  job_95: { job_wages: 19.97, job_exp: 38.18, job_luck: 5, job_danger: 5, job_maxdmg: 10 },
  job_96: { job_wages: 27.25, job_exp: 40.25, job_luck: 10, job_danger: 20, job_maxdmg: 15 },
  job_97: { job_wages: 41.17, job_exp: 35.65, job_luck: 10, job_danger: 10, job_maxdmg: 12 },
  job_98: { job_wages: 43.59, job_exp: 32.13, job_luck: 35, job_danger: 15, job_maxdmg: 10 },
  job_99: { job_wages: 36.49, job_exp: 27.97, job_luck: 54, job_danger: 25, job_maxdmg: 25 },
  job_100: { job_wages: 41.80, job_exp: 26.98, job_luck: 60, job_danger: 15, job_maxdmg: 9 },
  job_101: { job_wages: 44.32, job_exp: 35.65, job_luck: 35, job_danger: 20, job_maxdmg: 7 },
  job_102: { job_wages: 48.49, job_exp: 39.17, job_luck: 35, job_danger: 12, job_maxdmg: 3 },
  job_103: { job_wages: 44.32, job_exp: 45.19, job_luck: 5, job_danger: 23, job_maxdmg: 9 },
  job_104: { job_wages: 48.49, job_exp: 44.47, job_luck: 56, job_danger: 45, job_maxdmg: 20 },
  job_105: { job_wages: 51.17, job_exp: 31.74, job_luck: 78, job_danger: 32, job_maxdmg: 11 },
  job_106: { job_wages: 53.32, job_exp: 43.97, job_luck: 30, job_danger: 57, job_maxdmg: 7 },
  job_107: { job_wages: 48.49, job_exp: 39.40, job_luck: 69, job_danger: 63, job_maxdmg: 12 },
  job_108: { job_wages: 49.97, job_exp: 35.97, job_luck: 71, job_danger: 73, job_maxdmg: 43 },
  job_109: { job_wages: 46.97, job_exp: 38.18, job_luck: 58, job_danger: 27, job_maxdmg: 23 },
  job_110: { job_wages: 48.17, job_exp: 45.90, job_luck: 69, job_danger: 48, job_maxdmg: 10 },
  job_111: { job_wages: 51.17, job_exp: 39.17, job_luck: 69, job_danger: 78, job_maxdmg: 35 },
  job_112: { job_wages: 45.97, job_exp: 35.97, job_luck: 97, job_danger: 67, job_maxdmg: 15 },
  job_113: { job_wages: 51.65, job_exp: 47.49, job_luck: 35, job_danger: 83, job_maxdmg: 23 },
  job_114: { job_wages: 41.39, job_exp: 47.49, job_luck: 39, job_danger: 93, job_maxdmg: 34 },
  job_115: { job_wages: 54.17, job_exp: 43.74, job_luck: 29, job_danger: 69, job_maxdmg: 24 },
  job_116: { job_wages: 50.59, job_exp: 47.97, job_luck: 34, job_danger: 56, job_maxdmg: 65 },
  job_117: { job_wages: 54.65, job_exp: 43.49, job_luck: 22, job_danger: 72, job_maxdmg: 20 },
  job_118: { job_wages: 55.17, job_exp: 44.93, job_luck: 23, job_danger: 77, job_maxdmg: 34 },
  job_119: { job_wages: 55.39, job_exp: 45.90, job_luck: 54, job_danger: 38, job_maxdmg: 13 },
  job_120: { job_wages: 51.65, job_exp: 48.13, job_luck: 23, job_danger: 47, job_maxdmg: 24 },
  job_121: { job_wages: 54.17, job_exp: 47.74, job_luck: 60, job_danger: 94, job_maxdmg: 34 },
  job_122: { job_wages: 53.32, job_exp: 42.98, job_luck: 89, job_danger: 99, job_maxdmg: 67 },
  job_123: { job_wages: 55.65, job_exp: 46.39, job_luck: 30, job_danger: 89, job_maxdmg: 75 },
  job_124: { job_wages: 53.32, job_exp: 48.39, job_luck: 28, job_danger: 92, job_maxdmg: 75 },
  job_125: { job_wages: 55.39, job_exp: 48.59, job_luck: 65, job_danger: 70, job_maxdmg: 100 },
  job_126: { job_wages: 35.97, job_exp: 41.65, job_luck: 20, job_danger: 30, job_maxdmg: 15 },
  job_127: { job_wages: 11.17, job_exp: 7.25, job_luck: 2, job_danger: 20, job_maxdmg: 5 },
  job_128: { job_wages: 0.00, job_exp: 9.73, job_luck: 0, job_danger: 1, job_maxdmg: 10 },
  job_129: { job_wages: 11.17, job_exp: 9.73, job_luck: 2, job_danger: 20, job_maxdmg: 5 },
  job_130: { job_wages: 11.17, job_exp: 11.49, job_luck: 1, job_danger: 10, job_maxdmg: 5 },
  job_131: { job_wages: 53.32, job_exp: 45.65, job_luck: 23, job_danger: 40, job_maxdmg: 33 },
  job_132: { job_wages: 50.25, job_exp: 47.97, job_luck: 21, job_danger: 30, job_maxdmg: 25 },
  job_133: { job_wages: 51.39, job_exp: 48.80, job_luck: 33, job_danger: 50, job_maxdmg: 65 },
  job_134: { job_wages: 50.97, job_exp: 47.49, job_luck: 55, job_danger: 20, job_maxdmg: 10 },
  job_135: { job_wages: 56.97, job_exp: 48.80, job_luck: 34, job_danger: 43, job_maxdmg: 20 },
  job_136: { job_wages: 57.97, job_exp: 48.39, job_luck: 83, job_danger: 78, job_maxdmg: 35 },
  job_137: { job_wages: 55.39, job_exp: 47.04, job_luck: 56, job_danger: 48, job_maxdmg: 22 },
  job_138: { job_wages: 51.97, job_exp: 44.74, job_luck: 91, job_danger: 67, job_maxdmg: 100 },
  job_139: { job_wages: 59.49, job_exp: 50.07, job_luck: 87, job_danger: 96, job_maxdmg: 100 },
  job_140: { job_wages: 57.97, job_exp: 49.49, job_luck: 67, job_danger: 85, job_maxdmg: 60 },
  job_141: { job_wages: 54.65, job_exp: 54.80, job_luck: 74, job_danger: 94, job_maxdmg: 34 },
  job_142: { job_wages: 59.97, job_exp: 52.31, job_luck: 82, job_danger: 78, job_maxdmg: 40 },
  job_143: { job_wages: 58.17, job_exp: 52.50, job_luck: 81, job_danger: 81, job_maxdmg: 25 },
  job_144: { job_wages: 58.59, job_exp: 52.93, job_luck: 85, job_danger: 89, job_maxdmg: 25 },
  job_145: { job_wages: 57.59, job_exp: 55.49, job_luck: 82, job_danger: 96, job_maxdmg: 44 },
  job_146: { job_wages: 58.97, job_exp: 52.74, job_luck: 83, job_danger: 76, job_maxdmg: 38 },
  job_147: { job_wages: 55.17, job_exp: 55.17, job_luck: 67, job_danger: 56, job_maxdmg: 39 },
  job_148: { job_wages: 60.17, job_exp: 52.50, job_luck: 57, job_danger: 67, job_maxdmg: 35 },
  job_149: { job_wages: 45.32, job_exp: 54.60, job_luck: 78, job_danger: 56, job_maxdmg: 7 },
  job_150: { job_wages: 55.65, job_exp: 54.24, job_luck: 47, job_danger: 37, job_maxdmg: 60 },
  job_151: { job_wages: 58.17, job_exp: 56.13, job_luck: 57, job_danger: 49, job_maxdmg: 22 },
  job_152: { job_wages: 54.65, job_exp: 59.32, job_luck: 23, job_danger: 67, job_maxdmg: 25 },
  job_153: { job_wages: 55.17, job_exp: 61.59, job_luck: 12, job_danger: 87, job_maxdmg: 100 },
  job_154: { job_wages: 61.49, job_exp: 52.13, job_luck: 34, job_danger: 93, job_maxdmg: 70 },
  job_155: { job_wages: 57.59, job_exp: 47.04, job_luck: 121, job_danger: 63, job_maxdmg: 30 },
  job_156: { job_wages: 62.17, job_exp: 49.65, job_luck: 65, job_danger: 99, job_maxdmg: 99 },
  job_157: { job_wages: 59.25, job_exp: 54.80, job_luck: 87, job_danger: 87, job_maxdmg: 25 },
  job_158: { job_wages: 58.32, job_exp: 52.93, job_luck: 110, job_danger: 76, job_maxdmg: 30 },
  job_159: { job_wages: 60.59, job_exp: 56.93, job_luck: 56, job_danger: 94, job_maxdmg: 50 },
  job_160: { job_wages: 59.74, job_exp: 55.68, job_luck: 110, job_danger: 89, job_maxdmg: 70 }
}
TWDS.createSideButton = function () {
  const d = document.createElement('div')
  d.classList.add('menulink')
  d.onClick = 'TWDS.open();'
  d.title = 'Duellstat'
  d.style.backgroundImage = 'none !important'
  d.textContent = 'DS'
  d.id = 'TWDS_innerbutton'
  const mc = document.createElement('div')
  mc.classList.add('ui_menucontainer')
  mc.id = 'TWDS_button'
  mc.onClick = 'TWDS.open();'
  mc.appendChild(d)
  const mcb = document.createElement('div')
  mcb.classList.add('menucontainer_bottom')
  mc.appendChild(mcb)
  const mb = document.querySelector('#ui_menubar')
  mb.appendChild(mc)

  const ib = document.querySelector('#TWDS_innerbutton')
  ib.style.backgroundImage = 'none !important'
  ib.classList.add('test')
  ib.onclick = function () {
    console.log('click')
    if (typeof (wman.getById('TWDS')) === 'undefined') {
      TWDS.window = null
    }
    if (TWDS.window == null) {
      // TWDS.updateData()
      TWDS.window = wman.open('TWDS', 'Duellstat', 'noreload nocloseall').setMiniTitle('Duellstat')

      let defaultTab = ''
      for (const tabData of Object.values(TWDS.knownTabs)) {
        const t = TWDS.createTab(tabData.key)
        TWDS.window.addTab(tabData.title,
          tabData.key, tabData.activationFunc)
        const sp = new west.gui.Scrollpane()
        sp.appendContent(t)
        TWDS.window.appendToContentPane(sp.getMainDiv())
        if (tabData.isDefault && defaultTab === '') { defaultTab = tabData.key }
      }
      TWDS.activateTab(defaultTab)
    } else {
      wman.close('TWDS')
      TWDS.window = null
    }
  }
  console.log('ib', ib)
}

window.TWDS = TWDS

TWDS.main = function main () {
  console.log('duellstat main starts. $', window.jQuery, $)
  $(document).on('click', '.TWDS_nameeditTrigger', function () {
    const oldName = this.textContent
    const str = TWDS._('CONFIRM_REMOVE', 'Enter a new name for the equipment set', {})
    const newName = window.prompt(str)
    if (newName === false) return
    if (oldName === newName) {
      return
    }
    const tr = this.closest('tr')
    const key = tr.dataset.key
    let tmp = window.localStorage.getItem(key)
    const o = JSON.parse(tmp)
    o.name = newName
    tmp = JSON.stringify(o)
    window.localStorage.setItem(key, tmp)
    this.textContent = newName
  })
  $(document).on('click', '.TWDS_delete', function () {
    const tr = this.closest('tr')
    const n = $('.TWDS_nameeditTrigger', tr)[0].textContent
    const str = TWDS._('CONFIRM_REMOVE', 'Really remove equipment set $name$?', {
      name: n
    })
    if (!window.confirm(str)) {
      return
    }
    const key = tr.dataset.key
    window.localStorage.removeItem(key)
    tr.remove()
  })
  console.log('duellstat main before the sf loop')
  for (const fn of Object.values(TWDS.startFunctions)) {
    fn()
  }
  TWDS.createSideButton()
  console.log('duellstat active')
}

TWDS.preMain = function () {
  if (typeof $ === 'undefined') {
    window.setTimeout(TWDS.preMain, 100)
    return
  }
  if (typeof window.wman === 'undefined') {
    window.setTimeout(TWDS.preMain, 100)
    return
  }
  TWDS.main()
}

TWDS.waitready = function () {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    TWDS.preMain()
  } else {
    document.addEventListener('DOMContentLoaded', TWDS.preMain())
  }
}
TWDS.waitready()

console.log('duellstat loaded')
});
