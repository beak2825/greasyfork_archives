// ==UserScript==
// @name         My Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  My theme, made with EZTHEME
// @author       You
// @match        https://shellshock.io/
// @icon         https://cdn.discordapp.com/attachments/811268272418062359/901263906515857458/unknown.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452584/My%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/452584/My%20Theme.meta.js
// ==/UserScript==

let stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = 'https://shellthemes.jayvan229.repl.co/ezthemedefault.css';
document.head.appendChild(stylesheet);

let css = `#ss_background, #gameDescription, .load_screen, #progress-container { background: url('https://wallpapercave.com/wp/RqGZMGY.jpg') !important; position: absolute !important; background-size: cover !important; background-repeat: no-repeat !important; background-position: center !important; width: 100% !important; height: 100% !important; } div.media-tabs-content.front_panel.roundme_sm { background: url('https://wallpapercave.com/wp/RqGZMGY.jpg')!important; background-size: cover !important;} #equip_sidebox { border: var(--ss-space-sm) solid white} .front_panel, #equip_sidebox { background: url('https://wallpapercave.com/wp/RqGZMGY.jpg'); background-size: cover !important;} .front_panel { border: var(--ss-space-sm) solid white; } .ss_field, .ss_select { background: black; border: 1px solid white; color: ;} .btn_blue, .btn_green, .ss_bigtab, .ss_bigtab.selected, .button_blue { background: black !important; border: 0.2em solid white !important; color: white !important; } .btn_yolk, .btn_red, .btn_blue1 { background: black !important; border: 0.2em solid  !important; color:  !important; } .morestuff { background-color: black !important; border: 0.2em solid  !important; } .ss_bigtab:hover { color: white !important; } #stat_item { background: white; } #stat_item h4, .stat_stat { color: black; } .news_item:nth-child(odd), .stream_item:nth-child(odd) { background: black; } .news_item:nth-child(even), .stream_item:nth-child(even) { background: black; } .stream_item:hover, .news_item.clickme:hover { background: grey !important; } #weapon_select:nth-child(1n+0) .weapon_img { background: black!important; border: 3px solid white!important; } #popupTipDay #weapon_select:nth-child(1n+0) .weapon_img { background: black!important; border: 3px solid white!important; } h3, h1, h2, h4, h5, h6, .front_panel h3, #equip.equipped_slots h3, #item_grid h3 { color: black !important; } label, .label { color: black !important; } .egg_count { color: black; } .account_eggs { background: white; } #equip_equippedslots .equip_item, #equip_itemtype .selected, #equip_equippedslots .equip_item:hover { background: black; background-color: black; border: 0.33em solid white; } #equip_grid .store_item, #equip_grid .highlight, #equip_grid .store_item:hover { background: black; border: 0.33em solid white; color: white; } .popup_lg, .popup_sm { background: black; border: 0.33em solid white; } .box_blue2 { background-color: black; } .pause-bg { background: black !important; } #maskmiddle { background: url('../img/scope.png') center center no-repeat !important; background-size: contain !important; width: 100vh !important; height: 100vh !important; } #createPrivateGame .roundme_sm, #settingsPopup .roundme_sm, #pickServerPopup .roundme_sm, #adBlockerVideo .roundme_sm { background: black !important }`
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`)
    let crosshaircss = `.crosshair { opacity: Thick; border: solid 0.05em white; } .crosshair.normal:nth-child(even) { left: calc(50% - 0em); width: em; } .crosshair.normal:nth-child(odd) { left: calc(50% - 0em); width: em; } .crosshair:nth-child(odd) { height: em !important; } .crosshair:nth-child(even) { height: em !important; } #crosshair0 { background: black; } #crosshair1 { background: black; } #crosshair2 { background: black; } #crosshair3 { background: black; }`
    document.head.insertAdjacentHTML("beforeend", `<style>${crosshaircss}</style>`)