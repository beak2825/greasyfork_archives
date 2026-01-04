// ==UserScript==
// @name         NexusClient
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Bloxd Client
// @author       Withersinger
// @match        https://bloxd.io
// @icon         https://bloxd.io/favicon-32x32.png?v=2
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470139/NexusClient.user.js
// @updateURL https://update.greasyfork.org/scripts/470139/NexusClient.meta.js
// ==/UserScript==

setInterval(function() {
    'use strict';
    document.title = "NexusClient [Bloxd Client]";
    document.querySelector('.Title.FullyFancyText').textContent = "NexusClient";
    let background = document.getElementsByClassName("Background");
    background[0].src = 'https://media.npr.org/assets/img/2016/05/16/istock_000068588675_full_wide-08f4003d4700b3f2d1a32e208cea0988459161a1-s1400-c100.jpg';
    let names = document.getElementsByClassName("AvailableGameText");
    let imgs = document.getElementsByClassName("AvailableGameImg");
    names[0].textContent = "Minecraft";
    imgs[0].src = "https://img.redbull.com/images/c_fill,w_1200,h_630,g_auto,f_auto,q_auto/redbullcom/2020/4/28/bjoyslzjb3uxqyg82uz2/minecraft";
    names[1].textContent = "Adventure";
    imgs[1].src = "https://warnercnr.colostate.edu/wp-content/uploads/sites/2/2017/04/shutterstock_428626417.jpg";
    names[2].textContent = "BuildWorld";
    imgs[2].src = "https://staticg.sportskeeda.com/editor/2022/03/4026b-16475417659331-1920.jpg";
    names[3].textContent = "ProtectBed!";
    imgs[3].src = "https://wallpapercave.com/wp/wp7136447.jpg";
    names[4].textContent = "OneBlock - Just Mine!";
    imgs[4].src = "https://staticg.sportskeeda.com/editor/2021/11/d812b-16370076427470-1920.jpg";
    names[5].textContent = "Roleplay";
    imgs[5].src = "https://xforgeassets002.xboxlive.com/pf-title-b63a0803d3653643-20ca2/fe849433-0f72-4768-b2e1-3026a74e274b/CityRoleplay_Thumbnail_0.jpg";
    names[6].textContent = "Fortnight Battle Pass";
    imgs[6].src = "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW10idH?ver=489b";
    names[7].textContent = "Climber";
    imgs[7].src = "https://i.stack.imgur.com/i4B0z.png";
    names[8].textContent = "BuildBattle! (Amoogoose)";
    imgs[8].src = "https://media.tenor.com/-BukUKu8JdEAAAAd/among-us-sus.gif";
    names[9].textContent = "Parkoor";
    imgs[9].src = "https://xforgeassets002.xboxlive.com/pf-title-b63a0803d3653643-20ca2/3c03f1ae-b4ab-4a62-b916-80e1ebe98c74/PS_Thumbnail_0.jpg";
    names[10].textContent = "Servers";
    imgs[10].src = "https://pm1.aminoapps.com/7075/a387fb11d47112ca866df24df4a41f37c8d8a44er1-767-431v2_uhq.jpg";
    names[12].textContent = "Battles";
    imgs[12].src = "https://laymansbible.files.wordpress.com/2014/01/two-swords-are-enough-two-swords.jpg";
    names[11].textContent = "Hide n' Seek";
    imgs[11].src = "https://fallinsports.com/wp-content/uploads/2021/07/hide-and-seek-game.jpg";
},100);