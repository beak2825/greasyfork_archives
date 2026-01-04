// ==UserScript==
// @name         Blossom v2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  blossom theme for valiez
// @author       Yaz
// @match        https://shellshock.io/
// @icon         https://toppng.com/uploads/preview/cherry-blossom-clipart-transparent-cherry-blossom-flower-transparent-11562875954e8lgkhthze.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452072/Blossom%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/452072/Blossom%20v2.meta.js
// ==/UserScript==

let stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = 'https://shellthemes.jayvan229.repl.co/ezthemedefault.css';
document.head.appendChild(stylesheet);

let css = `#ss_background, #gameDescription, .load_screen, #progress-container { background: url('https://static.vecteezy.com/system/resources/previews/005/421/775/original/beautifull-cherry-blossom-background-free-vector.jpg') !important; position: absolute !important; background-size: cover !important; background-repeat: no-repeat !important; background-position: center !important; width: 100% !important; height: 100% !important; } div.media-tabs-content.front_panel.roundme_sm { background: #FFA0EB!important; background-size: cover !important;} #equip_sidebox { border: var(--ss-space-sm) solid white} .front_panel, #equip_sidebox { background: #FFA0EB; background-size: cover !important;} .front_panel { border: var(--ss-space-sm) solid white; } .ss_field, .ss_select { background: pink; border: 1px solid ; color: #FF75F3;} .btn_blue, .btn_green, .ss_bigtab, .ss_bigtab.selected, .button_blue { background: pink !important; border: 0.2em solid  !important; color: white  !important; } .btn_yolk, .btn_red, .btn_blue1 { background: pink !important; border: 0.2em solid  !important; color: white !important; } .morestuff { background-color: pink !important; border: 0.2em solid  !important; } .ss_bigtab:hover { color: white  !important; } #stat_item { background: pink; } #stat_item h4, .stat_stat { color: grey; } .news_item:nth-child(odd), .stream_item:nth-child(odd) { background: pink; } .news_item:nth-child(even), .stream_item:nth-child(even) { background: pink; } .stream_item:hover, .news_item.clickme:hover { background: pink !important; } #weapon_select:nth-child(1n+0) .weapon_img { background: pink!important; border: 3px solid grey!important; } #popupTipDay #weapon_select:nth-child(1n+0) .weapon_img { background: pink!important; border: 3px solid grey!important; } h3, h1, h2, h4, h5, h6, .front_panel h3, #equip.equipped_slots h3, #item_grid h3 { color: #ffb7c5 !important; } label, .label { color: #ffb7c5 !important; } .egg_count { color: white; } .account_eggs { background: pink; } #equip_equippedslots .equip_item, #equip_itemtype .selected, #equip_equippedslots .equip_item:hover { background: pink; background-color: pink; border: 0.33em solid white; } #equip_grid .store_item, #equip_grid .highlight, #equip_grid .store_item:hover { background: pink ; border: 0.33em solid white; color: white; } .popup_lg, .popup_sm { background: pink ; border: 0.33em solid white; } .box_blue2 { background-color: pink; } .pause-bg { background: https://static.vecteezy.com/system/resources/previews/005/421/775/original/beautifull-cherry-blossom-background-free-vector.jpg !important; } #maskmiddle { background: url('file:///home/chronos/u-aaa69ad3d1602d364f3ba987dd587233a3d997c8/MyFiles/Downloads/scope%20(1).png') center center no-repeat !important; background-size: contain !important; width: 100vh !important; height: 100vh !important; } #createPrivateGame .roundme_sm, #settingsPopup .roundme_sm, #pickServerPopup .roundme_sm, #adBlockerVideo .roundme_sm { background: pink !important }`
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`)
    let crosshaircss = `.crosshair.normal { background: pink; } .crosshair { border: 0.05em solid white; } .crosshair.powerfull { background: #FF75F3; }`
    document.head.insertAdjacentHTML("beforeend", `<style>${crosshaircss}</style>`)