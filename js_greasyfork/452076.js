// ==UserScript==
// @name         blossom v2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  valiez theme 
// @author       yaz
// @match        *://shellshock.io/*
// @match        *://algebra.best/*
// @match        *://algebra.vip/*
// @match        *://biologyclass.club/*
// @match        *://deadlyegg.com/*
// @match        *://deathegg.world/*
// @match        *://eggcombat.com/*
// @match        *://egg.dance/*
// @match        *://eggfacts.fun/*
// @match        *://egghead.institute/*
// @match        *://eggisthenewblack.com/*
// @match        *://eggsarecool.com/*
// @match        *://geometry.best/*
// @match        *://geometry.monster/*
// @match        *://geometry.pw/*
// @match        *://geometry.report/*
// @match        *://hardboiled.life/*
// @match        *://hardshell.life/*
// @match        *://humanorganising.org/*
// @match        *://mathdrills.info/*
// @match        *://mathfun.rocks/*
// @match        *://mathgames.world/*
// @match        *://math.international/*
// @match        *://mathlete.fun/*
// @match        *://mathlete.pro/*
// @match        *://overeasy.club/*
// @match        *://scrambled.best/*
// @match        *://scrambled.tech/*
// @match        *://scrambled.today/*
// @match        *://scrambled.us/*
// @match        *://scrambled.world/*
// @match        *://shellshockers.club/*
// @match        *://shellshockers.site/*
// @match        *://shellshockers.us/*
// @match        *://shellshockers.world/*
// @match        *://softboiled.club/*
// @match        *://violentegg.club/*
// @match        *://violentegg.fun/*
// @match        *://yolk.best/*
// @match        *://yolk.life/*
// @match        *://yolk.rocks/*
// @match        *://yolk.tech/*
// @match        *://zygote.cafe/*
// @icon         https://a.pinatafarm.com/454x567/660eb9bb49/homer-simpson-drooling.jpg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452076/blossom%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/452076/blossom%20v2.meta.js
// ==/UserScript==

let stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = 'https://shellthemes.jayvan229.repl.co/ezthemedefault.css';
document.head.appendChild(stylesheet);

let css = `#ss_background, #gameDescription, .load_screen, #progress-container { background: url('https://static.vecteezy.com/system/resources/previews/005/421/775/original/beautifull-cherry-blossom-background-free-vector.jpg') !important; position: absolute !important; background-size: cover !important; background-repeat: no-repeat !important; background-position: center !important; width: 100% !important; height: 100% !important; } div.media-tabs-content.front_panel.roundme_sm { background: #FFA0EB!important; background-size: cover !important;} #equip_sidebox { border: var(--ss-space-sm) solid white} .front_panel, #equip_sidebox { background: #FFA0EB; background-size: cover !important;} .front_panel { border: var(--ss-space-sm) solid white; } .ss_field, .ss_select { background: pink; border: 1px solid ; color: #FF75F3;} .btn_blue, .btn_green, .ss_bigtab, .ss_bigtab.selected, .button_blue { background: pink !important; border: 0.2em solid  !important; color: white  !important; } .btn_yolk, .btn_red, .btn_blue1 { background: pink !important; border: 0.2em solid  !important; color: white !important; } .morestuff { background-color: pink !important; border: 0.2em solid  !important; } .ss_bigtab:hover { color: white  !important; } #stat_item { background: pink; } #stat_item h4, .stat_stat { color: grey; } .news_item:nth-child(odd), .stream_item:nth-child(odd) { background: pink; } .news_item:nth-child(even), .stream_item:nth-child(even) { background: pink; } .stream_item:hover, .news_item.clickme:hover { background: pink !important; } #weapon_select:nth-child(1n+0) .weapon_img { background: pink!important; border: 3px solid grey!important; } #popupTipDay #weapon_select:nth-child(1n+0) .weapon_img { background: pink!important; border: 3px solid grey!important; } h3, h1, h2, h4, h5, h6, .front_panel h3, #equip.equipped_slots h3, #item_grid h3 { color: #ffb7c5 !important; } label, .label { color: #ffb7c5 !important; } .egg_count { color: white; } .account_eggs { background: pink; } #equip_equippedslots .equip_item, #equip_itemtype .selected, #equip_equippedslots .equip_item:hover { background: pink; background-color: pink; border: 0.33em solid white; } #equip_grid .store_item, #equip_grid .highlight, #equip_grid .store_item:hover { background: pink ; border: 0.33em solid white; color: white; } .popup_lg, .popup_sm { background: pink ; border: 0.33em solid white; } .box_blue2 { background-color: pink; } .pause-bg { background: #B8466A; } .pause-bg { background: https://static.vecteezy.com/system/resources/previews/005/421/775/original/beautifull-cherry-blossom-background-free-vector.jpg !important; } #maskmiddle { background: url('https://cdn.discordapp.com/attachments/1000151470634700900/1024118677106348042/dookiescope.png') center center no-repeat !important; background-size: contain !important; width: 100vh !important; height: 100vh !important; } #createPrivateGame .roundme_sm, #settingsPopup .roundme_sm, #pickServerPopup .roundme_sm, #adBlockerVideo .roundme_sm { background: pink !important } #killBox h3{ display:none; } #killBox::before{ font-size: 1em; font-weight: 900; content: "YOU BLOSSOMED"!important; color: #f6a6a4; } #KILL_STREAK::before{ display: normal !important; } #deathBox h3{ display:none; } #deathBox::before{ font-size: 1em; font-weight: 900; content: "BLOSSOMED BY"!important; color: #f6a6a4; }`
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`)
    let crosshaircss = `.crosshair.normal { background: pink; } .crosshair { border: 0.05em solid white; } .crosshair.powerfull { background: #FF75F3; }`
    document.head.insertAdjacentHTML("beforeend", `<style>${crosshaircss}</style>`)