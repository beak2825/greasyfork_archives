// ==UserScript==
// @name         Pizza Theme
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  F I R E
// @author       You
// @match        https://shellshock.io/
// @icon         https://cdn.discordapp.com/attachments/811268272418062359/901263906515857458/unknown.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448078/Pizza%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/448078/Pizza%20Theme.meta.js
// ==/UserScript==

let stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = 'https://shellthemes.jayvan229.repl.co/ezthemedefault.css';
document.head.appendChild(stylesheet);

let css =
    `#killBox h3{
  display:none;
}
#killBox::before{
  content: "You Sauced" !important;
}#ss_background, #gameDescription, .load_screen, #progress-container { background: url('https://wallpaperaccess.com/full/4847337.jpg') !important; position: absolute !important; background-size: cover !important; background-repeat: no-repeat !important; background-position: center !important; width: 100% !important; height: 100% !important; } div.media-tabs-content.front_panel.roundme_sm { background: linear-gradient(#fc4503,#fc6203,#fc9403,#fc9403)!important; background-size: cover !important;} #equip_sidebox { border: var(--ss-space-sm) solid #ffffff} .front_panel, #equip_sidebox { background: linear-gradient(#fc4503,#fc6203,#fc9403,#fc9403); background-size: cover !important;} .front_panel { border: var(--ss-space-sm) solid #ffffff; } .ss_field, .ss_select { background: #E9C08C; border: 1px solid #ffffff; color: #ffffff;} .btn_blue, .btn_green, .ss_bigtab, .ss_bigtab.selected, .button_blue { background: radial-gradient(#fc4503,#fc6203,#fc9403,#fc9403) !important; border: 0.2em solid #ffffff !important; color: #ffffff !important; } .btn_yolk, .btn_red, .btn_blue1 { background: linear-gradient(#fc4503,#fc6203,#fc9403,#fc9403) !important; border: 0.2em solid #ffffff !important; color: #ffffff !important; } .morestuff { background-color: linear-gradient(#fc4503,#fc6203,#fc9403,#fc9403) !important; border: 0.2em solid #ffffff !important; } .ss_bigtab:hover { color: #ffffff !important; } #stat_item { background: #E69E38; } #stat_item h4, .stat_stat { color: #ffffff; } .news_item:nth-child(odd), .stream_item:nth-child(odd) { background: #fc4503; } .news_item:nth-child(even), .stream_item:nth-child(even) { background: #fc9403; } .stream_item:hover, .news_item.clickme:hover { background: #fc6203 !important; } #weapon_select:nth-child(1n+0) .weapon_img { background: radial-gradient(#fc4503,#fc6203,#fc9403,#fc9403)!important; border: 3px solid #ffffff!important; } #popupTipDay #weapon_select:nth-child(1n+0) .weapon_img { background: radial-gradient(#fc4503,#fc6203,#fc9403,#fc9403)!important; border: 3px solid #ffffff!important; } h3, h1, h2, h4, h5, h6, .front_panel h3, #equip.equipped_slots h3, #item_grid h3 { color: #ffffff !important; } label, .label { color: #ffffff !important; } .egg_count { color: #ffffff; } .account_eggs { background: linear-gradient(#fc4503,#fc6203,#fc9403,#fc9403); } #equip_equippedslots .equip_item, #equip_itemtype .selected, #equip_equippedslots .equip_item:hover { background: radial-gradient(#fc4503,#fc6203,#fc9403,#fc9403); background-color: radial-gradient(#fc4503,#fc6203,#fc9403,#fc9403); border: 0.33em solid #ffffff; } #equip_grid .store_item, #equip_grid .highlight, #equip_grid .store_item:hover { background: linear-gradient(#fc4503,#fc6203,#fc9403,#fc9403); border: 0.33em solid #ffffff; color: #ffffff; } .popup_lg, .popup_sm { background: url('https://wallpaperaccess.com/full/4847337.jpg'); border: 0.33em solid #ffffff; } .box_blue2 { background-color: #ff8400; } .pause-bg { background: #fc4503 !important; } #maskmiddle { background: url('https://cdn.discordapp.com/attachments/986629345957281792/998678016303575071/scope_2.png') center center no-repeat !important; background-size: contain !important; width: 100vh !important; height: 100vh !important; } .crosshair.normal { background: linear-gradient(#fc4503,#fc6203,#fc9403,#fc9403); } .crosshair { border: 0.05em solid #ffffff; } .crosshair.powerfull { background: #a032a8; } #createPrivateGame .roundme_sm, #settingsPopup .roundme_sm, #pickServerPopup .roundme_sm, #adBlockerVideo .roundme_sm { background: #ff8400 !important }`
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`)