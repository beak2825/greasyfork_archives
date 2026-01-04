// ==UserScript==
// @name         ChillX Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Chillax :D
// @author       You
// @match        https://shellshock.io/
// @icon         https://cdn.discordapp.com/attachments/811268272418062359/901263906515857458/unknown.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448129/ChillX%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/448129/ChillX%20Theme.meta.js
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
  content: "You Chilled" !important;
}#ss_background, #gameDescription, .load_screen, #progress-container { background: url('https://cdn.discordapp.com/attachments/998567987219013733/998960176600203314/Minty_Playz..._1.gif') !important; position: absolute !important; background-size: cover !important; background-repeat: no-repeat !important; background-position: center !important; width: 100% !important; height: 100% !important; } div.media-tabs-content.front_panel.roundme_sm { background: linear-gradient(#FF49C1,#000000)!important; background-size: cover !important;} #equip_sidebox { border: var(--ss-space-sm) solid #ffffff} .front_panel, #equip_sidebox { background: linear-gradient(#FF49C1,#000000); background-size: cover !important;} .front_panel { border: var(--ss-space-sm) solid #ffffff; } .ss_field, .ss_select { background: #ffd9f2; border: 1px solid #ffffff; color: #802b63;} .btn_blue, .btn_green, .ss_bigtab, .ss_bigtab.selected, .button_blue { background: linear-gradient(#802b63,#000000) !important; border: 0.2em solid #ffffff !important; color: #ffffff !important; } .btn_yolk, .btn_red, .btn_blue1 { background: linear-gradient(#FF49C1,#000000) !important; border: 0.2em solid #ffffff !important; color: #ffffff !important; } .morestuff { background-color: linear-gradient(#FF49C1,#000000) !important; border: 0.2em solid #ffffff !important; } .ss_bigtab:hover { color: #ffffff !important; } #stat_item { background: linear-gradient(#ffd9f2,#FF49C1); } #stat_item h4, .stat_stat { color: #802b63; } .news_item:nth-child(odd), .stream_item:nth-child(odd) { background: #ff00aa; } .news_item:nth-child(even), .stream_item:nth-child(even) { background: #ff6ecf; } .stream_item:hover, .news_item.clickme:hover { background: #ad3485 !important; } #weapon_select:nth-child(1n+0) .weapon_img { background: radial-gradient(#FF49C1,#000000)!important; border: 3px solid #ffffff!important; } #popupTipDay #weapon_select:nth-child(1n+0) .weapon_img { background: radial-gradient(#FF49C1,#000000)!important; border: 3px solid #ffffff!important; } h3, h1, h2, h4, h5, h6, .front_panel h3, #equip.equipped_slots h3, #item_grid h3 { color: #ffffff !important; } label, .label { color: #ffffff !important; } .egg_count { color: #802b63; } .account_eggs { background: linear-gradient(#ffd9f2,#FF49C1); } #equip_equippedslots .equip_item, #equip_itemtype .selected, #equip_equippedslots .equip_item:hover { background: radial-gradient(#FF49C1,#000000); background-color: radial-gradient(#FF49C1,#000000); border: 0.33em solid #ffffff; } #equip_grid .store_item, #equip_grid .highlight, #equip_grid .store_item:hover { background: radial-gradient(#FF49C1,#000000); border: 0.33em solid #ffffff; color: #ffffff; } .popup_lg, .popup_sm { background: url('https://cdn.discordapp.com/attachments/998567987219013733/998960176600203314/Minty_Playz..._1.gif'); border: 0.33em solid #ffffff; } .box_blue2 { background-color: #FF49C1; } .pause-bg { background: #802b63 !important; } #maskmiddle { background: url('https://cdn.discordapp.com/attachments/996410750035824700/998952034189447208/imageedit_5_6189691531.png') center center no-repeat !important; background-size: contain !important; width: 100vh !important; height: 100vh !important; } .crosshair.normal { background: linear-gradient(#ffd9f2,#FF49C1); } .crosshair { border: 0.05em solid #ffffff; } .crosshair.powerfull { background: linear-gradient(red, orange, yellow, green, blue, indigo, violet, red); } #createPrivateGame .roundme_sm, #settingsPopup .roundme_sm, #pickServerPopup .roundme_sm, #adBlockerVideo .roundme_sm { background: #FF49C1 !important }`
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`)