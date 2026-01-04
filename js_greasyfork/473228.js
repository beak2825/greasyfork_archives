// ==UserScript==
// @name         a theme bc
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  My theme, made with EZTHEME
// @author       You
// @match        https://shellshock.io/
// @icon         https://cdn.discordapp.com/attachments/811268272418062359/901263906515857458/unknown.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473228/a%20theme%20bc.user.js
// @updateURL https://update.greasyfork.org/scripts/473228/a%20theme%20bc.meta.js
// ==/UserScript==

let stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = 'https://shellthemes.jayvan229.repl.co/ezthemedefault.css';
document.head.appendChild(stylesheet);

let css = `#ss_background, #gameDescription, .load_screen, #progress-container { background: green !important; position: absolute !important; background-size: cover !important; background-repeat: no-repeat !important; background-position: center !important; width: 100% !important; height: 100% !important; } div.media-tabs-content.front_panel.roundme_sm { background: green!important; background-size: cover !important;} #equip_sidebox { border: var(--ss-space-sm) solid black } .front_panel, #equip_sidebox { background: green; background-size: cover !important;} .front_panel { border: var(--ss-space-sm) solid black ; } .ss_field, .ss_select { background: green; border: 1px solid black; color: black;} .btn_blue, .btn_green, .ss_bigtab, .ss_bigtab.selected, .button_blue { background: green !important; border: 0.2em solid black !important; color: black !important; } .btn_yolk, .btn_red, .btn_blue1 { background: green !important; border: 0.2em solid black !important; color: black !important; } .morestuff { background-color: green !important; border: 0.2em solid black !important; } .ss_bigtab:hover { color: black !important; } #stat_item { background: green; } #stat_item h4, .stat_stat { color: black; } .news_item:nth-child(odd), .stream_item:nth-child(odd) { background: green; } .news_item:nth-child(even), .stream_item:nth-child(even) { background: black; } .stream_item:hover, .news_item.clickme:hover { background: brown !important; } #weapon_select:nth-child(1n+0) .weapon_img { background: green!important; border: 3px solid black!important; } #popupTipDay #weapon_select:nth-child(1n+0) .weapon_img { background: green!important; border: 3px solid black!important; } h3, h1, h2, h4, h5, h6, .front_panel h3, #equip.equipped_slots h3, #item_grid h3 { color: black !important; } label, .label { color: black !important; } .egg_count { color: green; } .account_eggs { background: black; } #equip_equippedslots .equip_item, #equip_itemtype .selected, #equip_equippedslots .equip_item:hover { background: green; background-color: green; border: 0.33em solid black; } #equip_grid .store_item, #equip_grid .highlight, #equip_grid .store_item:hover { background: green; border: 0.33em solid black; color: black; } .popup_lg, .popup_sm { background: green; border: 0.33em solid black; } .box_blue2 { background-color: green; } .pause-bg { background: black !important; } #maskmiddle { background: url('https://i.ibb.co/B6R7gyM/Untitled-drawing.png') center center no-repeat !important; background-size: contain !important; width: 100vh !important; height: 100vh !important; } #createPrivateGame .roundme_sm, #settingsPopup .roundme_sm, #pickServerPopup .roundme_sm, #adBlockerVideo .roundme_sm { background: green !important }`
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`)
    let crosshaircss = `.crosshair { opacity: 1; border: solid 0.05em black; } .crosshair.normal:nth-child(even) { left: calc(50% - 0.2em); width: 0.4em; } .crosshair.normal:nth-child(odd) { left: calc(50% - 0.2em); width: 0.4em; } .crosshair:nth-child(odd) { height: 0.4em !important; } .crosshair:nth-child(even) { height: 0.4em !important; } #crosshair0 { background: green; } #crosshair1 { background: green; } #crosshair2 { background: green; } #crosshair3 { background: green; }`
    document.head.insertAdjacentHTML("beforeend", `<style>${crosshaircss}</style>`)