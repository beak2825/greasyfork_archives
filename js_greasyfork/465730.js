// ==UserScript==
// @name         The Cracked Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  The Cracked Theme 0.1
// @author       Cracked#7709
// @match        https://shellshock.io
// @icon         https://t4.ftcdn.net/jpg/01/59/66/69/360_F_159666978_Ngi3jTZ0GmEDZqWcMR957ASGzj8kSPog.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465730/The%20Cracked%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/465730/The%20Cracked%20Theme.meta.js
// ==/UserScript==

let stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = 'https://shellthemes.jayvan229.repl.co/ezthemedefault.css';
document.head.appendChild(stylesheet);

let css = `#ss_background, #gameDescription, .load_screen, #progress-container { background: url('https://wallpaperaccess.com/full/2607546.jpg') !important; position: absolute !important; background-size: cover !important; background-repeat: no-repeat !important; background-position: center !important; width: 100% !important; height: 100% !important; } div.media-tabs-content.front_panel.roundme_sm { background: url('https://wallpaperaccess.com/full/1542409.jpg')!important; background-size: cover !important;} #equip_sidebox { border: var(--ss-space-sm) solid black} .front_panel, #equip_sidebox { background: url('https://wallpaperaccess.com/full/1542409.jpg'); background-size: cover !important;} .front_panel { border: var(--ss-space-sm) solid black; } .ss_field, .ss_select { background: ; border: 1px solid ; color: black;} .btn_blue, .btn_green, .ss_bigtab, .ss_bigtab.selected, .button_blue { background:  !important; border: 0.2em solid  !important; color: white !important; } .btn_yolk, .btn_red, .btn_blue1 { background: #4bb8e3 !important; border: 0.2em solid #4bb8e3 !important; color: white !important; } .morestuff { background-color: #4bb8e3 !important; border: 0.2em solid #4bb8e3 !important; } .ss_bigtab:hover { color: white !important; } #stat_item { background: ; } #stat_item h4, .stat_stat { color: black; } .news_item:nth-child(odd), .stream_item:nth-child(odd) { background: #4bb8e3; } .news_item:nth-child(even), .stream_item:nth-child(even) { background: ; } .stream_item:hover, .news_item.clickme:hover { background: #00b7ff !important; } #weapon_select:nth-child(1n+0) .weapon_img { background: !important; border: 3px solid #33adde!important; } #popupTipDay #weapon_select:nth-child(1n+0) .weapon_img { background: !important; border: 3px solid #33adde!important; } h3, h1, h2, h4, h5, h6, .front_panel h3, #equip.equipped_slots h3, #item_grid h3 { color: White !important; } label, .label { color: White !important; } .egg_count { color: ; } .account_eggs { background: ; } #equip_equippedslots .equip_item, #equip_itemtype .selected, #equip_equippedslots .equip_item:hover { background: ; background-color: ; border: 0.33em solid black; } #equip_grid .store_item, #equip_grid .highlight, #equip_grid .store_item:hover { background: ; border: 0.33em solid black; color: black; } .popup_lg, .popup_sm { background: url('https://wallpaperaccess.com/full/1542409.jpg'); border: 0.33em solid black; } .box_blue2 { background-color: ; } .pause-bg { background:  !important; } #maskmiddle { background: url('') center center no-repeat !important; background-size: contain !important; width: 100vh !important; height: 100vh !important; } #createPrivateGame .roundme_sm, #settingsPopup .roundme_sm, #pickServerPopup .roundme_sm, #adBlockerVideo .roundme_sm { background:  !important }`
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`)
    let crosshaircss = `.crosshair.normal { background: #33adde; } .crosshair { border: 0.05em solid #33adde; } .crosshair.powerfull { background: #00b7ff; }`
    document.head.insertAdjacentHTML("beforeend", `<style>${crosshaircss}</style>`)

document.title = 'The Cracked Theme';

let style = document.createElement('link');
style.rel = 'stylesheet';
style.href = 'https://my-new-theme-for-yt-10.unknown161.repl.co/style.css';
document.head.appendChild(style);



