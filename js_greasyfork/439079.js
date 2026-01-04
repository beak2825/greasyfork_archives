// ==UserScript==
// @name         Burrito theme shell shockers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  burrito theme sub to luv-burrito
// @author       You
// @match        https://shellshock.io/
// @icon         https://cdn.discordapp.com/attachments/811268272418062359/901263906515857458/unknown.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439079/Burrito%20theme%20shell%20shockers.user.js
// @updateURL https://update.greasyfork.org/scripts/439079/Burrito%20theme%20shell%20shockers.meta.js
// ==/UserScript==

let stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = 'https://shellthemes.jayvan229.repl.co/ezthemedefault.css';
document.head.appendChild(stylesheet);

let css = `#ss_background, #gameDescription, .load_screen, #progress-container { background: purple !important; position: absolute !important; background-size: cover !important; background-repeat: no-repeat !important; background-position: center !important; width: 100% !important; height: 100% !important; } div.media-tabs-content.front_panel.roundme_sm { background: blue!important; background-size: cover !important;} #equip_sidebox { border: var(--ss-space-sm) solid pink} .front_panel, #equip_sidebox { background: blue; background-size: cover !important;} .front_panel { border: var(--ss-space-sm) solid pink; } .ss_field, .ss_select { background: #8A2BE2; border: 1px solid Black; color: pink;} .btn_blue, .btn_green, .ss_bigtab, .ss_bigtab.selected, .button_blue { background: #8A2BE2 !important; border: 0.2em solid  !important; color: black !important; } .btn_yolk, .btn_red, .btn_blue1 { background: #8A2BE2 !important; border: 0.2em solid black !important; color: black !important; } .morestuff { background-color: #8A2BE2 !important; border: 0.2em solid black !important; } .ss_bigtab:hover { color: black !important; } #stat_item { background: red; } #stat_item h4, .stat_stat { color: black; } .news_item:nth-child(odd), .stream_item:nth-child(odd) { background: brown; } .news_item:nth-child(even), .stream_item:nth-child(even) { background: black; } .stream_item:hover, .news_item.clickme:hover { background: orange !important; } #weapon_select:nth-child(1n+0) .weapon_img { background: #8A2BE2!important; border: 3px solid pink!important; } #popupTipDay #weapon_select:nth-child(1n+0) .weapon_img { background: #8A2BE2!important; border: 3px solid pink!important; } h3, h1, h2, h4, h5, h6, .front_panel h3, #equip.equipped_slots h3, #item_grid h3 { color: pink !important; } label, .label { color: pink !important; } .egg_count { color: #8A2BE2; } .account_eggs { background: black; } #equip_equippedslots .equip_item, #equip_itemtype .selected, #equip_equippedslots .equip_item:hover { background: #8A2BE2; background-color: #8A2BE2; border: 0.33em solid black; } #equip_grid .store_item, #equip_grid .highlight, #equip_grid .store_item:hover { background: #8A2BE2; border: 0.33em solid black; color: black; } .popup_lg, .popup_sm { background: #8A2BE2; border: 0.33em solid black; } .box_blue2 { background-color: #8A2BE2; } .pause-bg { background: orange !important; } #maskmiddle { background: url('Screenshot 2022-01-25 2.00.21 PM') center center no-repeat !important; background-size: contain !important; width: 100vh !important; height: 100vh !important; } #createPrivateGame .roundme_sm, #settingsPopup .roundme_sm, #pickServerPopup .roundme_sm, #adBlockerVideo .roundme_sm { background: #8A2BE2 !important }`
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`)
    let crosshaircss = `.crosshair { opacity: purple; border: solid 0.05em brown; } .crosshair.normal:nth-child(even) { left: calc(50% - 0.3em); width: 0.6em; } .crosshair.normal:nth-child(odd) { left: calc(50% - 0.3em); width: 0.6em; } .crosshair:nth-child(odd) { height: 0.6em !important; } .crosshair:nth-child(even) { height: 0.6em !important; } #crosshair0 { background: Purple; } #crosshair1 { background: Pink; } #crosshair2 { background: Green; } #crosshair3 { background: Blue; }`
    document.head.insertAdjacentHTML("beforeend", `<style>${crosshaircss}</style>`)