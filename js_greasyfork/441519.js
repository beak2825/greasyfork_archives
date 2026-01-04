// ==UserScript==
// @name         My Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  My theme, made with EZTHEME
// @author       You
// @match        https://shellshock.io/
// @icon         https://cdn.discordapp.com/attachments/811268272418062359/901263906515857458/unknown.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441519/My%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/441519/My%20Theme.meta.js
// ==/UserScript==

let stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = 'https://shellthemes.jayvan229.repl.co/ezthemedefault.css';
document.head.appendChild(stylesheet);

let css = `#ss_background, #gameDescription, .load_screen, #progress-container { background: #000080 !important; position: absolute !important; background-size: cover !important; background-repeat: no-repeat !important; background-position: center !important; width: 100% !important; height: 100% !important; } div.media-tabs-content.front_panel.roundme_sm { background: #008080!important; background-size: cover !important;} #equip_sidebox { border: var(--ss-space-sm) solid #673147} .front_panel, #equip_sidebox { background: #008080; background-size: cover !important;} .front_panel { border: var(--ss-space-sm) solid #673147; } .ss_field, .ss_select { background: #008080; border: 1px solid #ff8080; color: #ff1dce;} .btn_blue, .btn_green, .ss_bigtab, .ss_bigtab.selected, .button_blue { background: #F4F6F7 !important; border: 0.2em solid #F39C12 !important; color: #A569BD !important; } .btn_yolk, .btn_red, .btn_blue1 { background: #E74C3C !important; border: 0.2em solid #8f1c82 !important; color: #ffffff !important; } .morestuff { background-color: #E74C3C !important; border: 0.2em solid #8f1c82 !important; } .ss_bigtab:hover { color: #A569BD !important; } #stat_item { background: #000000; } #stat_item h4, .stat_stat { color: #ef0bfb; } .news_item:nth-child(odd), .stream_item:nth-child(odd) { background: #80ff80 ; } .news_item:nth-child(even), .stream_item:nth-child(even) { background: #80ff80 ; } .stream_item:hover, .news_item.clickme:hover { background: #80ff80  !important; } #weapon_select:nth-child(1n+0) .weapon_img { background: #fb0b66!important; border: 3px solid #0b8bfb!important; } #popupTipDay #weapon_select:nth-child(1n+0) .weapon_img { background: #fb0b66!important; border: 3px solid #0b8bfb!important; } h3, h1, h2, h4, h5, h6, .front_panel h3, #equip.equipped_slots h3, #item_grid h3 { color: #800000 !important; } label, .label { color: #800000 !important; } .egg_count { color: #008681; } .account_eggs { background: #250086; } #equip_equippedslots .equip_item, #equip_itemtype .selected, #equip_equippedslots .equip_item:hover { background: #b9c201; background-color: #b9c201; border: 0.33em solid #129002; } #equip_grid .store_item, #equip_grid .highlight, #equip_grid .store_item:hover { background: #fe1d01; border: 0.33em solid #01c6fe; color: #01c6fe; } .popup_lg, .popup_sm { background: #FF0000; border: 0.33em solid #17202A; } .box_blue2 { background-color: #97E906; } .pause-bg { background: #11E28B !important; } #maskmiddle { background: url('https://lh3.googleusercontent.com/KcmUXDmyHyazg-jcmQKyMTn7zH_BNLTpQkFrAN2631UDpYF9WVytDcM2mdUdzG35XSlWnTITuM7j-5TRNEbgXdVg=w640-h400-e365-rj-sc0x00ffffff=') center center no-repeat !important; background-size: contain !important; width: 100vh !important; height: 100vh !important; } #createPrivateGame .roundme_sm, #settingsPopup .roundme_sm, #pickServerPopup .roundme_sm, #adBlockerVideo .roundme_sm { background: #97E906 !important }`
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`)
    let crosshaircss = `.crosshair.normal { background: #c101fe; } .crosshair { border: 0.05em solid #fe013f; } .crosshair.powerfull { background: #01d9fe; }`
    document.head.insertAdjacentHTML("beforeend", `<style>${crosshaircss}</style>`)