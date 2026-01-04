// ==UserScript==
// @name         My Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  My theme, made with EZTHEME
// @author       You
// @match        https://shellshock.io/
// @icon         https://cdn.discordapp.com/attachments/811268272418062359/901263906515857458/unknown.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450554/My%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/450554/My%20Theme.meta.js
// ==/UserScript==

let stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = 'https://shellthemes.jayvan229.repl.co/ezthemedefault.css';
document.head.appendChild(stylesheet);

let css = `#ss_background, #gameDescription, .load_screen, #progress-container { background: Black !important; position: absolute !important; background-size: cover !important; background-repeat: no-repeat !important; background-position: center !important; width: 100% !important; height: 100% !important; } div.media-tabs-content.front_panel.roundme_sm { background: Grey!important; background-size: cover !important;} #equip_sidebox { border: var(--ss-space-sm) solid Black} .front_panel, #equip_sidebox { background: Grey; background-size: cover !important;} .front_panel { border: var(--ss-space-sm) solid Black; } .ss_field, .ss_select { background: Grey; border: 1px solid Black; color: Black;} .btn_blue, .btn_green, .ss_bigtab, .ss_bigtab.selected, .button_blue { background: Grey !important; border: 0.2em solid Black !important; color: Black !important; } .btn_yolk, .btn_red, .btn_blue1 { background: Grey !important; border: 0.2em solid Black !important; color: Black !important; } .morestuff { background-color: Grey !important; border: 0.2em solid Black !important; } .ss_bigtab:hover { color: Black !important; } #stat_item { background: ; } #stat_item h4, .stat_stat { color: ; } .news_item:nth-child(odd), .stream_item:nth-child(odd) { background: Grey; } .news_item:nth-child(even), .stream_item:nth-child(even) { background: Grey; } .stream_item:hover, .news_item.clickme:hover { background: Black !important; } #weapon_select:nth-child(1n+0) .weapon_img { background: Grey!important; border: 3px solid Black!important; } #popupTipDay #weapon_select:nth-child(1n+0) .weapon_img { background: Grey!important; border: 3px solid Black!important; } h3, h1, h2, h4, h5, h6, .front_panel h3, #equip.equipped_slots h3, #item_grid h3 { color: Black !important; } label, .label { color: Black !important; } .egg_count { color: Black; } .account_eggs { background: Grey; } #equip_equippedslots .equip_item, #equip_itemtype .selected, #equip_equippedslots .equip_item:hover { background: Grey; background-color: Grey; border: 0.33em solid Black; } #equip_grid .store_item, #equip_grid .highlight, #equip_grid .store_item:hover { background: Grey; border: 0.33em solid Black; color: Black; } .popup_lg, .popup_sm { background: Grey; border: 0.33em solid Black; } .box_blue2 { background-color: Grey; } .pause-bg { background: Grey !important; } #maskmiddle { background: url('') center center no-repeat !important; background-size: contain !important; width: 100vh !important; height: 100vh !important; } #createPrivateGame .roundme_sm, #settingsPopup .roundme_sm, #pickServerPopup .roundme_sm, #adBlockerVideo .roundme_sm { background: Grey !important }`
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`)
    let crosshaircss = `.crosshair.normal { background: Blakc; } .crosshair { border: 0.05em solid Black; } .crosshair.powerfull { background: Grey; }`
    document.head.insertAdjacentHTML("beforeend", `<style>${crosshaircss}</style>`)