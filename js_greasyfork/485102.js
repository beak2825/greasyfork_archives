// ==UserScript==
// @name         Mazen's theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  My theme, made with EZTHEME
// @author       You
// @match        https://shellshock.io/
// @icon         https://img.freepik.com/free-photo/pink-sky-background-with-crescent-moon_53876-129048.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485102/Mazen%27s%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/485102/Mazen%27s%20theme.meta.js
// ==/UserScript==

let stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = 'https://shellthemes.jayvan229.repl.co/ezthemedefault.css';
document.head.appendChild(stylesheet);

let css = `#ss_background, #gameDescription, .load_screen, #progress-container { background: url('https://img.freepik.com/free-photo/pink-sky-background-with-crescent-moon_53876-129048.jpg') !important; position: absolute !important; background-size: cover !important; background-repeat: no-repeat !important; background-position: center !important; width: 100% !important; height: 100% !important; } div.media-tabs-content.front_panel.roundme_sm { background: url('https://img.freepik.com/free-photo/pink-sky-background-with-crescent-moon_53876-129048.jpg')!important; background-size: cover !important;} #equip_sidebox { border: var(--ss-space-sm) solid #f2d5e8} .front_panel, #equip_sidebox { background: url('https://img.freepik.com/free-photo/pink-sky-background-with-crescent-moon_53876-129048.jpg?size=626&ext=jpg&ga=GA1.1.1880011253.1700006400&semt=ais'); background-size: cover !important;} .front_panel { border: var(--ss-space-sm) solid
#f2d5e8
; } .ss_field, .ss_select { background: #0000; border: 1px solid #f0d5ea; color: #faa5f0;} .btn_pink, .btn_pink, .ss_bigtab, .ss_bigtab.selected, .Soft_pink { background: #0000 !important; border: 0.2em solid  !important; color:  !important; } .btn_yolk, .btn_pink, .btn_pink1 { background: #0000 !important; border: 0.2em solid #faa5f0 !important; color:  !important; } .morestuff { background-color: #0000 !important; border: 0.2em solid #f0d5ea !important; } .ss_bigtab:hover { color:  !important; } #stat_item { background: #0000; } #stat_item h4, .stat_stat { color: #faa5f0; } .news_item:nth-child(odd), .stream_item:nth-child(odd) { background: #f0d5ea; } .news_item:nth-child(even), .stream_item:nth-child(even) { background: #f0d5ea; } .stream_item:hover, .news_item.clickme:hover { background: #f0d5ea !important; } #weapon_select:nth-child(1n+0) .weapon_img { background: #0000!important; border: 3px solid #faa5f0!important; } #popupTipDay #weapon_select:nth-child(1n+0) .weapon_img { background: #0000!important; border: 3px solid #faa5f0!important; } h3, h1, h2, h4, h5, h6, .front_panel h3, #equip.equipped_slots h3, #item_grid h3 { color: #faa5f0 !important; } label, .label { color: #faa5f0 !important; } .egg_count { color: #f0d5ea; } .account_eggs { background: ; } #equip_equippedslots .equip_item, #equip_itemtype .selected, #equip_equippedslots .equip_item:hover { background: #f0d5ea; background-color: #f0d5ea; border: 0.33em solid #faa5f0; } #equip_grid .store_item, #equip_grid .highlight, #equip_grid .store_item:hover { background: #f0d5ea; border: 0.33em solid #faa5f0; color: #faa5f0; } .popup_lg, .popup_sm { background: url('https://img.freepik.com/free-photo/pink-sky-background-with-crescent-moon_53876-129048.jpg?size=626&ext=jpg&ga=GA1.1.1880011253.1700006400&semt=ais'); border: 0.33em solid ; } .box_pink { background-color: #f2d5e8; } .pause-bg { background: #f2d5e8 !important; } #maskmiddle { background: url('https://media.discordapp.net/attachments/1100362706923569172/1104982091948621916/Untitled-removebg-preview.png?width=404&height=404') center center no-repeat !important; background-size: contain !important; width: 100vh !important; height: 100vh !important; } #createPrivateGame .roundme_sm, #settingsPopup .roundme_sm, #pickServerPopup .roundme_sm, #adBlockerVideo .roundme_sm { background: #f2d5e8 !important }`
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`)
    let crosshaircss = `.crosshair.normal { background: #f0cce4; } .crosshair { border: 0.05em solid  #f5dced; } .crosshair.powerfull { background: #faedf6; }`
    document.head.insertAdjacentHTML("beforeend", `<style>${crosshaircss}</style>`)