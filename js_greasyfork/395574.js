// ==UserScript==
// @name         Colorblind Mode | Surviv.io
// @version      v.1
// @icon         https://surviv.io/img/emotes/rainbow.svg
// @description  Surviv.io options for Colorblind Persons
// @author       Filip K Zhõng
// @namespace    SurvivColorBlind
// <========== MATCH ==========> \\
// @match        http://surviv.io/*
// @match        https://surviv.io/*
// @match        http://surviv.io/?region=na&zone=sfo
// @match        http://surviv.io/?region=na&zone=mia
// @match        http://surviv.io/?region=na&zone=nyc
// @match        http://surviv.io/?region=na&zone=chi
// @match        http://surviv.io/?region=sa&zone=sao
// @match        http://surviv.io/?region=eu&zone=fra
// @match        http://surviv.io/?region=eu&zone=waw
// @match        http://surviv.io/?region=as&zone=sgp
// @match        http://surviv.io/?region=as&zone=nrt
// @match        http://surviv.io/?region=as&zone=hkg
// @match        http://surviv.io/?region=kr&zone=sel
// @match        https://surviv.io/?region=na&zone=sfo
// @match        https://surviv.io/?region=na&zone=mia
// @match        https://surviv.io/?region=na&zone=nyc
// @match        https://surviv.io/?region=na&zone=chi
// @match        https://surviv.io/?region=sa&zone=sao
// @match        https://surviv.io/?region=eu&zone=fra
// @match        https://surviv.io/?region=eu&zone=waw
// @match        https://surviv.io/?region=as&zone=sgp
// @match        https://surviv.io/?region=as&zone=nrt
// @match        https://surviv.io/?region=as&zone=hkg
// @match        https://surviv.io/?region=kr&zone=sel
// @match        http://surviv2.io*
// @match        https://surviv2.io*
// @match        http://2dbattleroyale.com*
// @match        https://2dbattleroyale.com*
// @match        http://2dbattleroyale.org*
// @match        https://2dbattleroyale.org*
// @match        http://piearesquared.info*
// @match        https://piearesquared.info*
// @match        http://thecircleisclosing.com*
// @match        https://thecircleisclosing.com*
// @match        http://archimedesofsyracuse.info*
// @match        https://archimedesofsyracuse.info*
// @match        http://secantsecant.com*
// @match        https://secantsecant.com*
// @match        http://parmainitiative.com*
// @match        https://parmainitiative.com*
// @match        http://nevelskoygroup.com*
// @match        https://nevelskoygroup.com*
// @match        http://kugahi.com*
// @match        https://kugahi.com*
// @match        http://chandlertallowmd.com*
// @match        https://chandlertallowmd.com*
// @match        http://ot38.club*
// @match        https://ot38.club*
// @match        http://kugaheavyindustry.com*
// @match        https://kugaheavyindustry.com*
// @match        http://rarepotato.com*
// @match        https://rarepotato.com*
// @match        http://twitch.tv/popout/survivio/extensions/c79geyxwmp1zpas3qxbddzrtytffta/panel*
// @match        https://twitch.tv/popout/survivio/extensions/c79geyxwmp1zpas3qxbddzrtytffta/panel*
// @match        http://c79geyxwmp1zpas3qxbddzrtytffta.ext-twitch.tv/c79geyxwmp1zpas3qxbddzrtytffta/1.0.2/ce940530af57d2615ac39c266fe9679d/index_twitch.html?anchor=panel&language=en&mode=viewer&state=released&platform=web&popout=true*
// @match        https://c79geyxwmp1zpas3qxbddzrtytffta.ext-twitch.tv/c79geyxwmp1zpas3qxbddzrtytffta/1.0.2/ce940530af57d2615ac39c266fe9679d/index_twitch.html?anchor=panel&language=en&mode=viewer&state=released&platform=web&popout=true*

// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/395574/Colorblind%20Mode%20%7C%20Survivio.user.js
// @updateURL https://update.greasyfork.org/scripts/395574/Colorblind%20Mode%20%7C%20Survivio.meta.js
// ==/UserScript==
// ----------Menu---------- \\
(function() {
    var Default = 'background: #83AF50; border-bottom: #141414; box-shadow: 0 0;'
    var BlueTeams = 'background: #50AFAB; border-bottom: #141414; box-shadow: 0 0;'
    var BlueOptions = 'background: #1E90FF; border-bottom: #141414; box-shadow: 0 0;'
    var NewsYellow = 'background: #FFD700; border-bottom: #141414; box-shadow: 0 0;'
    var CarbonBlack = 'background: #272727; border-bottom: #141414; box-shadow: 0 0;'
    var ShuttleGrey = 'background: #696B6F; border-bottom: #141414; box-shadow: 0 0;'
    var WoodsMode = 'background: #9D9A20; border-bottom: #141414; box-shadow: 0 0;'
    var SnowMode = 'background: #8FACBB; border-bottom: #141414; box-shadow: 0 0;'
    var ModeStyle = ShuttleGrey
    document.querySelector('#btn-join-team').style.cssText = ModeStyle; //Join Team
    document.querySelector('#btn-create-team').style.cssText = ModeStyle; //Create Team
    document.querySelector('#btn-start-mode-0').style.cssText = ModeStyle; //Play Solo
    document.querySelector('#btn-team-leave').style.cssText = ModeStyle; //Leave Team
    document.querySelector('#btn-start-team').style.cssText = ModeStyle; //Start Lobby
    document.querySelector('#btn-customize').style.backgroundColor = ModeStyle; //Customize Icon [Next to Name]
    document.querySelector('#btn-customize').style.cssText = 'border-bottom: #696B6F; box-shadow: 0 0;'; //Customize Icon [Next to Name]
    document.querySelector('#background').style.cssText = 'background-image: url(https://raw.githubusercontent.com/FilipZhong/assets/master/assets-01/main_splash_grey.png)'
    let duo = document.getElementById('btn-start-mode-1'); //Play Duo
    duo.parentNode.removeChild(duo);
    let squad = document.getElementById('btn-start-mode-2'); //Play Squad
    squad.parentNode.removeChild(squad);
    let ad = document.getElementById('surviv-io_300x250'); //Ad
    ad.parentNode.removeChild(ad);
    let social = document.getElementById('social-share-block'); //Social Share
    social.parentNode.removeChild(social);
    let gameapp = document.getElementById('start-bottom-left'); //Download Game
    gameapp.parentNode.removeChild(gameapp);
    let streams = document.getElementById('start-top-left-desktop'); //Featured
    streams.parentNode.removeChild(streams);
    let help = document.getElementById('btn-help'); //How To Play
    help.parentNode.removeChild(help);
})();
// <==========Color==========>
(function () {
    'use strict';
    // <----------Container---------->
    //<---Notes--->
    // Map Thumbnails is 80×80
    // Skin Thumbnails is 80×80
    // Skin Patterns [In game] is 136×136
    // Tree [In game] is 310×310
    // <---Container--->
    var left = document.querySelector('#ad-block-left');
    left.innerHTML = `<div class="contents">
<div class="tabs">
<div class="tab" data-text="Tab 1">Select Skin</div>
<div class="tab" data-text="Tab 2">Select Map</div>
</div>
<div class="container content">
<div class="skins">
<div class="skin-item" id="outfitDefault">
<img src="https://raw.githubusercontent.com/FilipZhong/assets/master/outfit/Basicoutfit.png" class="skin-img" />
<h4 class="skin-name">Default Skin</h4>
</div>
<div class="skin-item" id="outfitBlind">
<img src="https://raw.githubusercontent.com/FilipZhong/assets/master/outfit/outfitNA.png" class="skin-img" />
<h4 class="skin-name">Colorblind Skin</h4>
</div>
<!---Test--->
<div class="skin-item" id="outfitCustom01">
<img src="https://i.imgur.com/oLQAsEv.png" class="skin-img" />
<h4 class="skin-name">The Script Test Skin</h4>
</div>
</div>
</div>
<!-- Maps -->
<div class="container content">
<div class="maps">
<div class="map-item normalMode">
<img src="https://i.imgur.com/xB2vbaR.png" alt="" class="map-img" />
<h4 class="map-name">Normal Map</h4>
</div>
<div class="map-item greyMode">
<img src="https://raw.githubusercontent.com/FilipZhong/assets/master/assets-01/mapNotAvailable.png" alt="" class="map-img" />
<h4 class="map-name">Grey Map</h4>
</div>
<div class="map-item redbMode">
<img src="https://raw.githubusercontent.com/FilipZhong/assets/master/assets-01/mapNotAvailable.png" alt="" class="map-img" />
<h4 class="map-name">Protanopia</h4>
</div>
<div class="map-item greenbMode">
<img src="https://raw.githubusercontent.com/FilipZhong/assets/master/assets-01/mapNotAvailable.png" alt="" class="map-img" />
<h4 class="map-name">Deuteranopia</h4>
</div>
<div class="map-item bluebMode">
<img src="https://raw.githubusercontent.com/FilipZhong/assets/master/assets-01/mapNotAvailable.png" alt="" class="map-img" />
<h4 class="map-name">Tritanopia</h4>
</div>
</div>
</div>
<div class="footer">
<p>MADE BY <a href="https://www.youtube.com/c/FilipKZ?sub_confirmation=1" target="_blank">FILIP K ZHÕNG</a>.</p>
</div>
`;
    // <----------Misc---------->
    var skinItem = document.querySelectorAll('.skin-item');
    var mapItem = document.querySelectorAll('.map-item');
    function addStyleString(str) {
        var node = document.createElement('style');
        node.innerHTML = str;
        document.body.appendChild(node);
    }
    addStyleString(`.active { color: green; border: 2px solid #668e38;} .content {display: none;}; .skin-name {margin: 10px;} .tab {display: flex !important;} .active-tab {display: block !important} .contents {display: flex; flex-direction: column; width: 100%; overflow-y: scroll; height: 100%;text-align: center; box-sizing: border-box;} .container {width: 100%; flex: 1 0 auto;} .skins {display: flex; box-sizing: border-box; flex-wrap: wrap} .maps {display: flex; box-sizing: border-box; flex-wrap: wrap} .skin-item, .map-item {flex-grow: 1; flex-basis: 33.3333%; cursor: pointer; box-sizing: border-box; padding: 10px 0;} .tabs {display: flex !important;} .tab {display: inline-block !important; flex-grow: 1; padding: 10px; background: rgba(0, 0, 0, 0.28); cursor: pointer; border-right: 1px solid #ddd; border-bottom: 1px solid #ddd;} #ad-block-left {height: 325px;} #social-share-block-wrapper {display: none;} .tab.active-tab {background: #000;} .footer {background-color: #000; padding: 10px; border-top: 1px solid #ddd; flex-shrink: 0;} .footer p {margin:0;} .tab.icon { padding: 0; display: flex !important; justify-content: center; align-items: center;}
.svg-icon { width: 1.5em; height: 1.5em; } .svg-icon path, .svg-icon polygon, .svg-icon rect { fill: #ffffff; } .svg-icon circle { stroke: #ffffff; stroke-width: 1;}`);

    let tabLinks = document.querySelectorAll(".tab");
    let tabContents = document.querySelectorAll(".content");
    tabLinks[0].classList.add("active-tab");
    tabContents[0].classList.add("active-tab");
    tabLinks.forEach((tabLink, i) => {
        tabLink.addEventListener("click", () => {
            tabLinks.forEach(tabLink => tabLink.classList.remove("active-tab"));
            tabContents.forEach(tabContent => tabContent.classList.remove("active-tab"));
            tabLink.classList.add("active-tab");
            tabContents[i].classList.add("active-tab");
        });
    });
    // <----------SkinRules---------->
    var SkinRules = {};
    var skinOutfit = webpackJsonp([], null, ["63d67e9d"]);
    var skinInfo = webpackJsonp([], null, ["63d67e9d"]);
    var skinLoot = webpackJsonp([], null, ["63d67e9d"]);

    SkinRules.outfitDefault=function (){
        skinInfo.outfitBase.name = "Basic Outfit";
        skinInfo.outfitBase.rarity = 0;
        skinInfo.outfitBase.lore = "Pure and simple.";
        // --------------------------------------------------
        skinOutfit.outfitBase.skinImg.baseTint = 16303476;
        skinOutfit.outfitBase.skinImg.baseSprite = "player-base-01.img";
        skinOutfit.outfitBase.skinImg.handTint = 16303476;
        skinOutfit.outfitBase.skinImg.handSprite = "player-hands-01.img";
        skinOutfit.outfitBase.skinImg.footTint = 16303476;
        skinOutfit.outfitBase.skinImg.footSprite = "player-feet-01.img";
        skinOutfit.outfitBase.skinImg.backpackTint = 8480055;
        skinOutfit.outfitBase.skinImg.backpackSprite = "player-circle-base-01.img";
        skinOutfit.outfitBase.ghillie = false;
        // --------------------------------------------------
        skinLoot.outfitBase.lootImg.sprite = "loot-shirt-01.img";
        skinLoot.outfitBase.lootImg.tint = 16777215;
        skinLoot.outfitBase.lootImg.border = "loot-circle-outer-01.img";
        skinLoot.outfitBase.lootImg.borderTint = 0;
        skinLoot.outfitBase.lootImg.scale = 0.2;
    };
    // --------------------------------------------------
    SkinRules.outfitBlind=function (){
        skinInfo.outfitBase.name = "Basic Outfit";
        skinInfo.outfitBase.rarity = 0;
        skinInfo.outfitBase.lore = "Pure and simple.";
        // --------------------------------------------------
        skinOutfit.outfitBase.skinImg.baseTint = 0xFFD7AE;
        skinOutfit.outfitBase.skinImg.baseSprite = "player-base-01.img";
        skinOutfit.outfitBase.skinImg.handTint = 0xffdbb6;
        skinOutfit.outfitBase.skinImg.handSprite = "player-hands-01.img";
        skinOutfit.outfitBase.skinImg.footTint = 0xffdbb6;
        skinOutfit.outfitBase.skinImg.footSprite = "player-feet-01.img";
        skinOutfit.outfitBase.skinImg.backpackTint = 0x665646;
        skinOutfit.outfitBase.skinImg.backpackSprite = "player-circle-base-01.img";
        skinOutfit.outfitBase.ghillie = false;
        // --------------------------------------------------
        skinLoot.outfitBase.lootImg.sprite = "loot-shirt-01.img";
        skinLoot.outfitBase.lootImg.tint = 16777215;
        skinLoot.outfitBase.lootImg.border = "loot-circle-outer-01.img";
        skinLoot.outfitBase.lootImg.borderTint = 0;
        skinLoot.outfitBase.lootImg.scale = 0.2;
    };
    // --------------------------------------------------
    SkinRules.outfitCustom01 = function () {
        skinInfo.outfitBase.name = "Custom01";
        skinInfo.outfitBase.rarity = 5;
        skinInfo.outfitBase.lore = "To the honor of the very first custom skin in this script.";
        // --------------------------------------------------
        skinOutfit.outfitBase.skinImg.baseSprite = "player-base-02.img";
        skinOutfit.outfitBase.skinImg.baseTint = 0x45364b;
        skinOutfit.outfitBase.skinImg.handSprite = "player-hands-02.img";
        skinOutfit.outfitBase.skinImg.handTint = 0x996888;
        skinOutfit.outfitBase.skinImg.backpackSprite = "player-circle-base-02.img";
        skinOutfit.outfitBase.skinImg.backpackTint = 0xb5c2b7;
        skinOutfit.outfitBase.skinImg.footSprite = "player-feet-02.img";
        skinOutfit.outfitBase.skinImg.footTint = 0x996888;
        skinOutfit.outfitBase.ghillie = false;
        // --------------------------------------------------
        skinLoot.outfitBase.lootImg.sprite = "loot-shirt-01.img";
        skinLoot.outfitBase.lootImg.tint = 16777215;
        skinLoot.outfitBase.lootImg.border = "loot-circle-outer-01.img";
        skinLoot.outfitBase.lootImg.borderTint = 0;
        skinLoot.outfitBase.lootImg.scale = 0.2;
    };
    // --------------------------------------------------
    // <----------SkinRemoveBorder---------->
    function skinRemoveBorder() {
        skinItem.forEach(item => { item.classList.remove('active') })
    }
    // <----------SkinForEach---------->
    skinItem.forEach(function (item) {
        item.addEventListener('click', function () {
            if(SkinRules.hasOwnProperty(item.id)) {
                SkinRules[item.id]();
                skinRemoveBorder();
                item.className += " active";
            } else {
                /*console.error(item.id);
          	  	console.trace();
          	    alert('oh shit, skinrule not defined');*/
            }
        });
    });
    // <----------MapRules---------->
    var MapRules = {};
    // --------------------------------------------------
    var normalEvent = webpackJsonp([], null, ["d5ec3c16"]);
//     var springEvent = webpackJsonp([], null, ["6afea591"]);
//     var summerEvent = webpackJsonp([], null, ["0444401b"]);
//     var desertEvent = webpackJsonp([], null, ["d5ec3c16"]);
//     var factionEvent = webpackJsonp([], null, ["903f46c9"]);
//     var halloweenEvent = webpackJsonp([], null, ["9d3c0d8b"]);
//     var potatoEvent = webpackJsonp([], null, ["fc096113"]);
//     var springPotatoEvent = webpackJsonp([], null, ["fea0a94e"]);
//     var iceEvent = webpackJsonp([], null, ["4e269062"]);
//     var snowEvent = webpackJsonp([], null, ["4e269062"]);
//     var woodEvent = webpackJsonp([], null, ["45f86a38"]);
//     var snowWoodEvent = webpackJsonp([], null, ["0354ead9"]);
//     var springWoodEvent = webpackJsonp([], null, ["b895abfa"]);
//     var summerWoodEvent = webpackJsonp([], null, ["d0dd0bd7"]);
//     var savannahEvent = webpackJsonp([], null, ["6a4e7802"]);
//     var cobaltEvent = webpackJsonp([], null, ["6df31f9c"]);
//     var turkeyEvent = webpackJsonp([], null, ["c1e88d07"]);
//     var Event = webpackJsonp([], null, ["d5ec3c16"]);
    // --------------------------------------------------
    var obstacles = webpackJsonp([],null, ["03f4982a"]);
    // --------------------------------------------------
    var allGreenBtns = document.querySelectorAll('.btn-green ');
    allGreenBtns.forEach(btn => {
        if (btn.classList.contains('btn-custom-mode-main') == false) {
            btn.dataset.mode = "normal";
        }
    })
    var normalBtns = document.querySelectorAll('[data-mode]');
    // --------------------------------------------------
    MapRules.normalMode = function() { //MapID: 0
        normalBtns.forEach(btn => {
            btn.className = "btn-green btn-darken menu-option";
            btn.setAttribute("style", '');
        })
        // --------------------------------------------------
        normalEvent.biome.particles.camera = ""
        normalEvent.biome.colors.background= 2118510 ;
        normalEvent.biome.colors.water= 3310251 ;
        normalEvent.biome.colors.waterRipple= 11792639 ;
        normalEvent.biome.colors.beach= 13480795 ;
        normalEvent.biome.colors.riverbank= 9461284 ;
        normalEvent.biome.colors.grass= 8433481 ;
        normalEvent.biome.colors.underground= 1772803 ;
        normalEvent.biome.colors.playerSubmerge= 2854052 ;
        normalEvent.biome.colors.playerGhillie= 8630096 ;
        // --------------------------------------------------
        obstacles.tree_03.img.sprite = "https://surviv.io/img/map/map-tree-03.svg"
        obstacles.stone_01.img.sprite = "https://surviv.io/img/map/map-stone-01.svg"
        obstacles.stone_03.img.sprite = "https://surviv.io/img/map/map-stone-03.svg"
        obstacles.stone_04.img.sprite = "https://surviv.io/img/map/map-stone-04.svg"
        obstacles.airdrop_crate_01.img.sprite = "https://surviv.io/img/map/map-airdrop-01.svg"
        obstacles.airdrop_crate_02.img.sprite = "https://surviv.io/img/map/map-airdrop-02.svg"
        obstacles.crate_01.img.sprite = "https://surviv.io/img/map/map-crate-01.svg"
        obstacles.crate_02.img.sprite = "https://surviv.io/img/map/map-crate-02.svg"
        obstacles.crate_03.img.sprite = "https://surviv.io/img/map/map-crate-03.svg"
        obstacles.chest_03.img.sprite = "https://surviv.io/img/map/map-chest-03.svg"
        obstacles.bush_01.img.sprite = "https://surviv.io/img/map/map-bush-01.svg"
        obstacles.bush_04.img.sprite = "https://surviv.io/img/map/map-bush-04.svg"
        obstacles.bush_07.img.sprite = "https://surviv.io/img/map/map-bush-07.svg"
        obstacles.potato_01.img.sprite = "https://surviv.io/img/map/map-potato-01.svg"
        obstacles.potato_02.img.sprite = "https://surviv.io/img/map/map-potato-02.svg"
        obstacles.potato_03.img.sprite = "https://surviv.io/img/map/map-potato-03.svg"
        // --------------------------------------------------
        background.style.backgroundImage = "url('https://raw.githubusercontent.com/FilipZhong/assets/master/outfit/main_splash.png')";
    }
    // --------------------------------------------------
    MapRules.greyMode = function() { //MapID: 0
        normalBtns.forEach(btn => {
            btn.className = "btn-darken menu-option btn-custom-mode-main";
            btn.setAttribute("style", 'background-image: url("https://surviv.io/img/emotes/surviv.svg")');
            btn.style.backgroundColor = "#7A7A7A";
        })
        normalEvent.biome.particles.camera = ""
        normalEvent.biome.colors.background= 4282861383 ;
        normalEvent.biome.colors.water= 4285493103 ;
        normalEvent.biome.colors.waterRipple= 4292861919 ;
        normalEvent.biome.colors.beach= 4289835441 ;
        normalEvent.biome.colors.riverbank= 4284966759 ;
        normalEvent.biome.colors.grass= 4288059030 ;
        normalEvent.biome.colors.underground= 4279242768 ;
        normalEvent.biome.colors.playerSubmerge= 4285690482 ;
        normalEvent.biome.colors.playerGhillie= 4288124823 ;
        // --------------------------------------------------
        obstacles.tree_01.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/tree-01g.png"
        obstacles.stone_01.img.sprite = "https://surviv.io/img/map/map-stone-01.svg"
        obstacles.stone_03.img.sprite = "https://surviv.io/img/map/map-stone-03.svg"
        obstacles.stone_04.img.sprite = "https://surviv.io/img/map/map-stone-04.svg"
        obstacles.airdrop_crate_01.img.sprite = "https://surviv.io/img/map/map-airdrop-01.svg"
        obstacles.airdrop_crate_02.img.sprite = "https://surviv.io/img/map/map-airdrop-02.svg"
        obstacles.crate_01.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/crate-01g.png"
        obstacles.crate_02.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/crate-02g.png"
        obstacles.crate_03.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/crate-03g.png"
        obstacles.chest_03.img.sprite = "https://surviv.io/img/map/map-chest-03.svg"
        obstacles.bush_01.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/bush-01g.png"
        obstacles.bush_04.img.sprite = "https://surviv.io/img/map/map-bush-04.svg"
        obstacles.bush_07.img.sprite = "https://surviv.io/img/map/map-bush-07.svg"
        obstacles.potato_01.img.sprite = "https://surviv.io/img/map/map-potato-01.svg"
        obstacles.potato_02.img.sprite = "https://surviv.io/img/map/map-potato-02.svg"
        obstacles.potato_03.img.sprite = "https://surviv.io/img/map/map-potato-03.svg"
        // --------------------------------------------------
        background.style.backgroundImage = "url('https://raw.githubusercontent.com/FilipZhong/assets/master/assets-01/main_splash_grey.png')";
    }
        // --------------------------------------------------
    MapRules.redbMode = function() { //MapID: 0
        normalBtns.forEach(btn => {
            btn.className = "btn-darken menu-option btn-custom-mode-main";
            btn.setAttribute("style", 'background-image: url("https://surviv.io/img/emotes/rainbow.svg")');
            btn.style.backgroundColor = "#7A7A7A";
        })
        normalEvent.biome.particles.camera = ""
        normalEvent.biome.colors.background= 4282861383 ; //#920000
        normalEvent.biome.colors.water= 0x0077b8 ;
        normalEvent.biome.colors.waterRipple= 5087437 ;
        normalEvent.biome.colors.beach= 0x828240 ;
        normalEvent.biome.colors.riverbank= 0x828240//0x48DA5B ;
        normalEvent.biome.colors.grass= 0x8E8E5A; //4288059030 ;
        normalEvent.biome.colors.underground= 0x355424 ;
        normalEvent.biome.colors.playerSubmerge= 5087437 ;
        normalEvent.biome.colors.playerGhillie= 0x8E8E5A ;
        // --------------------------------------------------
        obstacles.tree_01.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/tree-01g.png"
        obstacles.stone_01.img.sprite = "https://surviv.io/img/map/map-stone-01.svg"
        obstacles.stone_03.img.sprite = "https://surviv.io/img/map/map-stone-03.svg"
        obstacles.stone_04.img.sprite = "https://surviv.io/img/map/map-stone-04.svg"
        obstacles.airdrop_crate_01.img.sprite = "https://surviv.io/img/map/map-airdrop-01.svg"
        obstacles.airdrop_crate_02.img.sprite = "https://surviv.io/img/map/map-airdrop-02.svg"
        obstacles.crate_01.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/crate-01g.png"
        obstacles.crate_02.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/crate-02g.png"
        obstacles.crate_03.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/crate-03g.png"
        obstacles.chest_03.img.sprite = "https://surviv.io/img/map/map-chest-03.svg"
        obstacles.bush_01.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/bush-01g.png"
        obstacles.bush_04.img.sprite = "https://surviv.io/img/map/map-bush-04.svg"
        obstacles.bush_07.img.sprite = "https://surviv.io/img/map/map-bush-07.svg"
        obstacles.potato_01.img.sprite = "https://surviv.io/img/map/map-potato-01.svg"
        obstacles.potato_02.img.sprite = "https://surviv.io/img/map/map-potato-02.svg"
        obstacles.potato_03.img.sprite = "https://surviv.io/img/map/map-potato-03.svg"
        // --------------------------------------------------
        background.style.backgroundImage = "url('https://raw.githubusercontent.com/FilipZhong/assets/master/assets-01/main_splash_grey.png')";
    }
    // --------------------------------------------------
    MapRules.greenbMode = function() { //MapID: 0
        normalBtns.forEach(btn => {
            btn.className = "btn-darken menu-option btn-custom-mode-main";
            btn.setAttribute("style", 'background-image: url("https://surviv.io/img/emotes/rainbow.svg")');
            btn.style.backgroundColor = "#7A7A7A";
        })
        normalEvent.biome.particles.camera = ""
        normalEvent.biome.colors.background= 4282861383 ; //#920000
        normalEvent.biome.colors.water= 0x0077b8 ;
        normalEvent.biome.colors.waterRipple= 5087437 ;
        normalEvent.biome.colors.beach= 0x828240 ;
        normalEvent.biome.colors.riverbank= 0x828240 ;
        normalEvent.biome.colors.grass= 0x8E8E5A; //4288059030 ;
        normalEvent.biome.colors.underground= 0x355424 ;
        normalEvent.biome.colors.playerSubmerge= 5087437 ;
        normalEvent.biome.colors.playerGhillie= 0x8e7052 ;
        // --------------------------------------------------
        obstacles.tree_01.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/tree-01g.png"
        obstacles.stone_01.img.sprite = "https://surviv.io/img/map/map-stone-01.svg"
        obstacles.stone_03.img.sprite = "https://surviv.io/img/map/map-stone-03.svg"
        obstacles.stone_04.img.sprite = "https://surviv.io/img/map/map-stone-04.svg"
        obstacles.airdrop_crate_01.img.sprite = "https://surviv.io/img/map/map-airdrop-01.svg"
        obstacles.airdrop_crate_02.img.sprite = "https://surviv.io/img/map/map-airdrop-02.svg"
        obstacles.crate_01.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/crate-01g.png"
        obstacles.crate_02.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/crate-02g.png"
        obstacles.crate_03.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/crate-03g.png"
        obstacles.chest_03.img.sprite = "https://surviv.io/img/map/map-chest-03.svg"
        obstacles.bush_01.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/bush-01g.png"
        obstacles.bush_04.img.sprite = "https://surviv.io/img/map/map-bush-04.svg"
        obstacles.bush_07.img.sprite = "https://surviv.io/img/map/map-bush-07.svg"
        obstacles.potato_01.img.sprite = "https://surviv.io/img/map/map-potato-01.svg"
        obstacles.potato_02.img.sprite = "https://surviv.io/img/map/map-potato-02.svg"
        obstacles.potato_03.img.sprite = "https://surviv.io/img/map/map-potato-03.svg"
        // --------------------------------------------------
        background.style.backgroundImage = "url('https://raw.githubusercontent.com/FilipZhong/assets/master/assets-01/main_splash_grey.png')";
    }
    // --------------------------------------------------
    MapRules.bluebMode = function() { //MapID: 0
        normalBtns.forEach(btn => {
            btn.className = "btn-darken menu-option btn-custom-mode-main";
            btn.setAttribute("style", 'background-image: url("https://surviv.io/img/emotes/rainbow.svg")');
            btn.style.backgroundColor = "#7A7A7A";
        })
        normalEvent.biome.particles.camera = ""
        normalEvent.biome.colors.background= 4282861383 ;
        normalEvent.biome.colors.water= 0x32AFC5 ;
        normalEvent.biome.colors.waterRipple= 5087437 ;
        normalEvent.biome.colors.beach= 0x7B2C8E ;
        normalEvent.biome.colors.riverbank= 0x7B2C8E ;
        normalEvent.biome.colors.grass= 0x8E7272; //4288059030 ;
        normalEvent.biome.colors.underground= 4279242768 ;
        normalEvent.biome.colors.playerSubmerge= 5087437 ;
        normalEvent.biome.colors.playerGhillie= 0x8E7272 ;
        // --------------------------------------------------
        obstacles.tree_01.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/tree-01g.png"
        obstacles.stone_01.img.sprite = "https://surviv.io/img/map/map-stone-01.svg"
        obstacles.stone_03.img.sprite = "https://surviv.io/img/map/map-stone-03.svg"
        obstacles.stone_04.img.sprite = "https://surviv.io/img/map/map-stone-04.svg"
        obstacles.airdrop_crate_01.img.sprite = "https://surviv.io/img/map/map-airdrop-01.svg"
        obstacles.airdrop_crate_02.img.sprite = "https://surviv.io/img/map/map-airdrop-02.svg"
        obstacles.crate_01.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/crate-01g.png"
        obstacles.crate_02.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/crate-02g.png"
        obstacles.crate_03.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/crate-03g.png"
        obstacles.chest_03.img.sprite = "https://surviv.io/img/map/map-chest-03.svg"
        obstacles.bush_01.img.sprite = "https://raw.githubusercontent.com/FilipZhong/assets/master/obstacles/bush-01g.png"
        obstacles.bush_04.img.sprite = "https://surviv.io/img/map/map-bush-04.svg"
        obstacles.bush_07.img.sprite = "https://surviv.io/img/map/map-bush-07.svg"
        obstacles.potato_01.img.sprite = "https://surviv.io/img/map/map-potato-01.svg"
        obstacles.potato_02.img.sprite = "https://surviv.io/img/map/map-potato-02.svg"
        obstacles.potato_03.img.sprite = "https://surviv.io/img/map/map-potato-03.svg"
        // --------------------------------------------------
        background.style.backgroundImage = "url('https://raw.githubusercontent.com/FilipZhong/assets/master/assets-01/main_splash_grey.png')";
    }
    // --------------------------------------------------
    // <----------MapRemoveBorder---------->
    function mapRemoveBorder() {
        mapItem.forEach(item => { item.classList.remove('active') })
    }
    mapItem.forEach(function (item) {
        var background = document.querySelector('#background');
        var logo = document.querySelector('#background');
        item.addEventListener('click', function () {
            var temp1 = item.className;
            var temp2 = temp1.split(' ');
            temp1 = temp2[temp2.length-1];
            if(MapRules.hasOwnProperty(temp1)) {
                MapRules[temp1]();
                mapRemoveBorder();
                item.className += " active";
            }
        });
    });
})();
// --------------------------------------------------
// <==========End1==========> \\
// ----------HUD---------- \\
(function() {
    'use strict';
    var elems = document.getElementsByClassName('ui-weapon-name')
    console.log(elems);
    for (var ii = 0; ii < elems.length; ii++) {
        elems[ii].addEventListener('DOMSubtreeModified', function() {
            var weaponName = this.textContent;
            var border = 'solid';
            switch (weaponName) {
                    // <---------- Default ----------> \\
                default:
                    border = '#FFFFFF';
                    border = 'solid';
                    break;
                    // <===GUNS===>
                    // <---------- YELLOW: 9mm ----------> \\
                case 'CZ-3A1':
                case 'G18C':
                case 'M9':
                case 'M93R':
                case 'MAC-10':
                case 'MP5':
                case 'P30L':
                case 'Dual P30L':
                case 'UMP9':
                case 'Vector':
                case 'VSS':
                    border += '#FFAE00';
                    border += 'hidden';
                    break;
                    // <---------- RED: 12 Gauge ----------> \\
                case 'M1100':
                case 'M870':
                case 'MP220':
                case 'Saiga-12':
                case 'SPAS-12':
                case 'Super 90':
                case 'USAS-12':
                    border += '#FF0000';
                    border += 'solid';
                    break;
                    // <---------- BLUE: 7.62 mm ----------> \\
                case 'AK-47':
                case 'AN-94':
                case 'BAR M1918':
                case 'BLR 81':
                case 'DP-28':
                case 'Groza':
                case 'Groza-S':
                case 'M1 Garand':
                case 'M39 EMR':
                case 'Mosin-Nagant':
                case 'OT-38':
                case 'OTs-38':
                case 'PKP Pecheneg':
                case 'SCAR-H':
                case 'SV-98':
                case 'SVD-63':
                    border += '#0066FF';
                    border += 'dotted';
                    break;
                    // <---------- GREEN: 5.56mm ----------> \\
                case 'FAMAS':
                case 'L86A2':
                case 'M249':
                case 'M416':
                case 'M4A1-S':
                case 'Mk 12 SPR':
                case 'QBB-97':
                case 'Scout Elite':
                    border += '#039E00';
                    border += 'double';
                    break;
                    // <---------- Purple: .45 ACP ----------> \\
                case 'M1911':
                case 'M1A1':
                case 'Mk45G':
                case 'Model 94':
                case 'Peacemaker':
                case 'Vector 45':
                    border += '#7900FF';
                    border += 'ridge';
                    break;
                    // <---------- FLARE ----------> \\
                case 'Flare Gun':
                    border += '#D44600';
                    border += '';
                    break;
                    // <---------- .50 AE ----------> \\
                case 'DEagle 50':
                    border += '#292929';
                    border += '';
                    break;
                    // <---------- .308 Subsonic ----------> \\
                case 'AWM-S':
                case 'Mk 20 SSR':
                    border += '#465000';
                    border += '';
                    break;
                    // <---------- Potato ----------> \\
                case 'Potato Cannon':
                case 'Spud Gun':
                    border += '#935924';
                    border += '';
                    break;
                    // <---------- CURSED: 9 mm ----------> \\
                case 'M9 Cursed':
                    border += '#323232';
                    border += '';
                    break;
                    // <---------- Bugle ----------> \\
                case 'Bugle':
                    border += '#F2BC21';
                    border += '';
                    break;
                    // <---------- Trowables ----------> \\
            }
            // <---------- GUN END ----------> \\
            console.log(border);
            this.parentNode.style.border = border;
        }, false);
    }
})();
// <========== ARMOR HUD ==========> \\
(function() {
    'use strict';
    var elems = document.getElementsByClassName('ui-armor-level');
    console.log(elems);
    for (var ii = 0; ii < elems.length; ii++) {
        elems[ii].addEventListener('DOMSubtreeModified', function() {
            var armorlv = this.textContent;
            var border = 'solid';
            switch (armorlv) {
                default: border = '#000000';
                    border = 'solid';
                    break;
                case 'Lvl. 0':
                    border += '#FFFFFF';
                    break;
                case 'Lvl. 1':
                    border += '#FFFFFF';
                    break;
                case 'Lvl. 2':
                    border += '#808080';
                    break;
                case 'Lvl. 3':
                    border += '#0C0C0C';
                    break;
                case 'Lvl. 4':
                    border += '#FFF00F';
                    break;
            }
            console.log(border);
            this.parentNode.style.border = border;
        }, false);
    }
})();
// <==========HUD_END==========> \\