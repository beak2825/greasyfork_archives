// ==UserScript==
// @name         Gengar theme for hugo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  yeyeyeyeyeyeyeyeyeye
// @author       Yaz
// @match        https://shellshock.io/
// @icon         https://cdn.discordapp.com/attachments/811268272418062359/901263906515857458/unknown.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452132/Gengar%20theme%20for%20hugo.user.js
// @updateURL https://update.greasyfork.org/scripts/452132/Gengar%20theme%20for%20hugo.meta.js
// ==/UserScript==

let stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = 'https://shellthemes.jayvan229.repl.co/ezthemedefault.css';
document.head.appendChild(stylesheet);

let css = `#ss_background, #gameDescription, .load_screen, #progress-container { background: url('https://wallpaperaccess.com/full/1855459.jpg') !important; position: absolute !important; background-size: cover !important; background-repeat: no-repeat !important; background-position: center !important; width: 100% !important; height: 100% !important; } div.media-tabs-content.front_panel.roundme_sm { background: Black!important; background-size: cover !important;} #equip_sidebox { border: var(--ss-space-sm) solid Purple} .front_panel, #equip_sidebox { background: Black; background-size: cover !important;} .front_panel { border: var(--ss-space-sm) solid Purple; } .ss_field, .ss_select { background: purple; border: 1px solid black; color: black;} .btn_blue, .btn_green, .ss_bigtab, .ss_bigtab.selected, .button_blue { background: purple !important; border: 0.2em solid black !important; color: black !important; } .btn_yolk, .btn_red, .btn_blue1 { background: purple !important; border: 0.2em solid black !important; color: black !important; } .morestuff { background-color: purple !important; border: 0.2em solid black !important; } .ss_bigtab:hover { color: black !important; } #stat_item { background: Black; } #stat_item h4, .stat_stat { color: purple; } .news_item:nth-child(odd), .stream_item:nth-child(odd) { background: Purple; } .news_item:nth-child(even), .stream_item:nth-child(even) { background: Purple; } .stream_item:hover, .news_item.clickme:hover { background: Black !important; } #weapon_select:nth-child(1n+0) .weapon_img { background: Purple!important; border: 3px solid Black!important; } #popupTipDay #weapon_select:nth-child(1n+0) .weapon_img { background: Purple!important; border: 3px solid Black!important; } h3, h1, h2, h4, h5, h6, .front_panel h3, #equip.equipped_slots h3, #item_grid h3 { color: Purple !important; } label, .label { color: Purple !important; } .egg_count { color: Black; } .account_eggs { background: Purple; } #equip_equippedslots .equip_item, #equip_itemtype .selected, #equip_equippedslots .equip_item:hover { background: black; background-color: black; border: 0.33em solid purple; } #equip_grid .store_item, #equip_grid .highlight, #equip_grid .store_item:hover { background: black ; border: 0.33em solid purple; color: purple; } .popup_lg, .popup_sm { background: purple; border: 0.33em solid black; } .box_blue2 { background-color: black; } .pause-bg { background: purple  !important; } #maskmiddle { background: url('../img/scope.png') center center no-repeat !important; background-size: contain !important; width: 100vh !important; height: 100vh !important; } #createPrivateGame .roundme_sm, #settingsPopup .roundme_sm, #pickServerPopup .roundme_sm, #adBlockerVideo .roundme_sm { background: black !important }`
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`)
    let crosshaircss = `.crosshair.normal { background: purple; } .crosshair { border: 0.05em solid black; } .crosshair.powerfull { background: Violet; }`
    document.head.insertAdjacentHTML("beforeend", `<style>${crosshaircss}</style>`)