// ==UserScript==
// @name Bds Mod[Sploop.io]
// @author Murka
// @description The most advanced hack for sploop.io
// @icon https://sploop.io/img/ui/favicon.png
// @version 1.0.26
// @match *://sploop.io/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/459523/Bds%20Mod%5BSploopio%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/459523/Bds%20Mod%5BSploopio%5D.meta.js
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Murka
    Github: https://github.com/Murka007/Bds Mod :D
    Discord: https://discord.gg/sG9cyfGPj5
    Greasyfork: https://greasyfork.org/en/scripts/449995-Bds | Mod-sploop-io

    I need your support, please follow these steps:
    1. Join my DISCORD server
    2. Write a feedback about this script on GREASYFORK "script works, thank you so much"
    3. Star my repository on GITHUB
*/

Function("(" + ((GM_info) => {
    "use strict";
    var __webpack_modules__ = {
        147: module => {
            module.exports = {
                i8: "1.0.21"
            };
        }
    };
    var __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
            return cachedModule.exports;
        }
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        return module.exports;
    }
    (() => {
        __webpack_require__.d = (exports, definition) => {
            for (var key in definition) {
                if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                    Object.defineProperty(exports, key, {
                        enumerable: true,
                        get: definition[key]
                    });
                }
            }
        };
    })();
    (() => {
        __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    })();
    var __webpack_exports__ = {};
    (() => {
        __webpack_require__.d(__webpack_exports__, {
            sv: () => Bds,
            Ih: () => controller,
            vU: () => error,
            cM: () => log,
            lZ: () => pingCount,
            fA: () => target
        });
        var code = '<header> <span>Bds Mod :D</span> <div id="version"> <svg width="15" height="15" viewBox="0 0 16 16" version="1.1"> <path d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path> </svg> <span></span> </div> <svg id="close-menu" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px"> <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/> </svg> </header>';
        const Header = code;
        var Navbar_code = '<aside id="navbar-container"> <button class="open-menu active">Keybinds</button> <button class="open-menu">Combat</button> <button class="open-menu">Visuals</button> <button class="open-menu">Misc</button> <button class="open-menu bottom-align">Credits</button> </aside>';
        const Navbar = Navbar_code;
        var Keybinds_code = '<div class="menu-page opened"> <h1>Keybinds</h1> <p>Setup keybinds for items, weapons and hats</p> <div class="section"> <div class="section-title"> <h2>Items & Weapons</h2> <svg class="icon" version="1.0" xmlns="http://www.w3.org/2000/svg" width="64.000000pt" height="64.000000pt" viewBox="0 0 64.000000 64.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)" stroke="none"> <path d="M160 575 l-54 -55 99 -100 100 -100 -100 -100 -100 -100 58 -57 57 -58 157 158 158 157 -155 155 c-85 85 -157 155 -160 155 -3 0 -30 -25 -60 -55z"/> </g> </svg> </div> <div class="section-content"> <div class="split-section"> <div class="section-option"> <span class="section-option-title">Primary</span> <button id="primary" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Secondary</span> <button id="secondary" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Heal</span> <button id="heal" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Wall</span> <button id="wall" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Spike</span> <button id="spike" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Windmill</span> <button id="windmill" class="section-option-hotkeyInput"></button> </div> </div> <div class="split-section"> <div class="section-option"> <span class="section-option-title">Trap/Boost</span> <button id="trap" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Turret</span> <button id="turret" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Tree/Stone</span> <button id="tree" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Platform</span> <button id="platform" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Cosy bed</span> <button id="spawn" class="section-option-hotkeyInput"></button> </div> </div> </div> </div> <div class="section"> <div class="section-title"> <h2>Combat & Functions</h2> <svg class="icon" version="1.0" xmlns="http://www.w3.org/2000/svg" width="64.000000pt" height="64.000000pt" viewBox="0 0 64.000000 64.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)" stroke="none"> <path d="M160 575 l-54 -55 99 -100 100 -100 -100 -100 -100 -100 58 -57 57 -58 157 158 158 157 -155 155 c-85 85 -157 155 -160 155 -3 0 -30 -25 -60 -55z"/> </g> </svg> </div> <div class="section-content"> <div class="section-option"> <span class="section-option-title">Invisible hit</span> <button id="invisibleHit" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Spike insta</span> <button id="spikeInsta" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title"> Fast break <span class="tooltip"> * <span class="tooltip-text">When you press a key, it equips a demolist and starts attacking</span> </span> </span> <button id="fastBreak" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Zoom In</span> <button class="section-option-hotkeyInput smaller">WHEEL DN</button> </div> <div class="section-option"> <span class="section-option-title">Toggle Ezgame Menu</span> <button id="toggleMenu" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Zoom Out</span> <button class="section-option-hotkeyInput smaller">WHEEL UP</button> </div> </div> </div> <div class="section"> <div class="section-title"> <h2>Hats</h2> <svg class="icon" version="1.0" xmlns="http://www.w3.org/2000/svg" width="64.000000pt" height="64.000000pt" viewBox="0 0 64.000000 64.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)" stroke="none"> <path d="M160 575 l-54 -55 99 -100 100 -100 -100 -100 -100 -100 58 -57 57 -58 157 158 158 157 -155 155 c-85 85 -157 155 -160 155 -3 0 -30 -25 -60 -55z"/> </g> </svg> </div> <div class="section-content"> <div class="section-option"> <span class="section-option-title">Unequip hat</span> <button id="unequip" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Bush hat</span> <button id="bush" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Berserker</span> <button id="berserker" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Jungle gear</span> <button id="jungle" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Crystal gear</span> <button id="crystal" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Spike gear</span> <button id="spikegear" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Immunity gear</span> <button id="immunity" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Boost hat</span> <button id="boost" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Apple hat</span> <button id="applehat" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Scuba gear</span> <button id="scuba" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Hood</span> <button id="hood" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Demolist</span> <button id="demolist" class="section-option-hotkeyInput"></button> </div> </div> </div> <div class="section"> <div class="section-title"> <h2>Controls & Movement</h2> <svg class="icon" version="1.0" xmlns="http://www.w3.org/2000/svg" width="64.000000pt" height="64.000000pt" viewBox="0 0 64.000000 64.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)" stroke="none"> <path d="M160 575 l-54 -55 99 -100 100 -100 -100 -100 -100 -100 58 -57 57 -58 157 158 158 157 -155 155 c-85 85 -157 155 -160 155 -3 0 -30 -25 -60 -55z"/> </g> </svg> </div> <div class="section-content"> <div class="section-option"> <span class="section-option-title">Up</span> <button id="up" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Left</span> <button id="left" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Down</span> <button id="down" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Right</span> <button id="right" class="section-option-hotkeyInput"></button> </div> <div class="split"></div> <div class="section-option"> <span class="section-option-title">Auto attack</span> <button id="autoattack" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Lock rotation</span> <button id="lockRotation" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Open chat</span> <button id="openChat" class="section-option-hotkeyInput"></button> </div> <div class="section-option"> <span class="section-option-title">Upgrade scythe</span> <button id="upgradeScythe" class="section-option-hotkeyInput"></button> </div> </div> </div> </div>';
        const Keybinds = Keybinds_code;
        var Combat_code = '<div class="menu-page"> <h1>Combat</h1> <p>Modify combat settings, change pvp behavior</p> <div class="section opened"> <div class="section-title"> <h2>Placement</h2> </div> <div class="section-content one-row"> <div class="section-option"> <span class="section-option-title"> Placement speed <span class="tooltip"> * <span class="tooltip-text">The higher value, the faster you place</span> </span> </span> <label class="slider"> <input id="placementSpeed" min="1" max="30" type="range"> <span class="slider-value">30</span> </label> </div> <div class="section-option"> <span class="section-option-title">Placement type</span> <select id="placementType"></select> </div> <div class="section-option"> <span class="section-option-title">Autobed</span> <label class="switch-checkbox"> <input id="autobed" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title">Automill</span> <label class="switch-checkbox"> <input id="automill" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title"> Anti fireball <span class="tooltip"> * <span class="tooltip-text">When you collide a fireball, place platform</span> </span> </span> <label class="switch-checkbox"> <input id="antiFireball" type="checkbox"> <span></span> </label> </div> </div> </div> <div class="section opened"> <div class="section-title"> <h2>Healing</h2> </div> <div class="section-content"> <div class="split-section"> <div class="section-option"> <span class="section-option-title">Autoheal</span> <label class="switch-checkbox"> <input id="autoheal" type="checkbox"> <span></span> </label> </div> </div> </div> </div> <div class="section opened"> <div class="section-title"> <h2>Hats</h2> </div> <div class="section-content"> <div class="split-section"> <div class="section-option"> <span class="section-option-title">Jungle On Clown</span> <label class="switch-checkbox"> <input id="jungleOnClown" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title"> Equip last hat <span class="tooltip"> * <span class="tooltip-text">On spawn, the last hat you had will be equipped</span> </span> </span> <label class="switch-checkbox"> <input id="lastHat" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title">Auto scuba</span> <label class="switch-checkbox"> <input id="autoScuba" type="checkbox"> <span></span> </label> </div> </div> </div> </div> <div class="section opened"> <div class="section-title"> <h2>Autoaim</h2> </div> <div class="section-content"> <div class="split-section"> <div class="section-option"> <span class="section-option-title">Melee</span> <label class="switch-checkbox"> <input id="meleeAim" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title">Bow</span> <label class="switch-checkbox"> <input id="bowAim" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title">Spike insta</span> <label class="switch-checkbox"> <input id="spikeInstaAim" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title">Autosync</span> <label class="switch-checkbox"> <input id="autosync" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title">Autoboost follow</span> <label class="switch-checkbox"> <input id="autoboostFollow" type="checkbox"> <span></span> </label> </div> </div> </div> </div> </div>';
        const Combat = Combat_code;
        var Visuals_code = '<div class="menu-page"> <h1>Visuals</h1> <p>Customize your visuals, or you can disable it for performance</p> <div class="section opened"> <div class="section-title"> <h2>Tracers</h2> </div> <div class="section-content"> <div class="section-option"> <span class="section-option-title">Enemies</span> <div class="content"> <button class="default-color" title="Reset Color"></button> <input id="enemyColor" type="color"> <label class="switch-checkbox"> <input id="enemyTracers" type="checkbox"> <span></span> </label> </div> </div> <div class="section-option"> <span class="section-option-title">Arrows</span> <label class="switch-checkbox"> <input id="arrows" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title">Teammates</span> <div class="content"> <button class="default-color" title="Reset Color"></button> <input id="teammateColor" type="color"> <label class="switch-checkbox"> <input id="teammateTracers" type="checkbox"> <span></span> </label> </div> </div> <div class="section-option"> <span class="section-option-title">Rainbow colors</span> <label class="switch-checkbox"> <input id="rainbow" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title">Animals</span> <div class="content"> <button class="default-color" title="Reset Color"></button> <input id="animalColor" type="color"> <label class="switch-checkbox"> <input id="animalTracers" type="checkbox"> <span></span> </label> </div> </div> </div> </div> <div class="section opened"> <div class="section-title"> <h2>Markers</h2> </div> <div class="section-content"> <div class="section-option"> <span class="section-option-title">Your markers</span> <div class="content"> <button class="default-color" title="Reset Color"></button> <input id="itemMarkersColor" type="color"> <label class="switch-checkbox"> <input id="itemMarkers" type="checkbox"> <span></span> </label> </div> </div> <div class="section-option"> <span class="section-option-title">Teammates</span> <div class="content"> <button class="default-color" title="Reset Color"></button> <input id="teammateMarkersColor" type="color"> <label class="switch-checkbox"> <input id="teammateMarkers" type="checkbox"> <span></span> </label> </div> </div> <div class="section-option"> <span class="section-option-title">Enemies</span> <div class="content"> <button class="default-color" title="Reset Color"></button> <input id="enemyMarkersColor" type="color"> <label class="switch-checkbox"> <input id="enemyMarkers" type="checkbox"> <span></span> </label> </div> </div> <div class="section-option"> <span class="section-option-title"> Trap activated <span class="tooltip"> * <span class="tooltip-text">When the player or animal will be trapped, marker will change color</span> </span> </span> <div class="content"> <button class="default-color" title="Reset Color"></button> <input id="trapActivatedColor" type="color"> <label class="switch-checkbox"> <input id="trapActivated" type="checkbox"> <span></span> </label> </div> </div> </div> </div> <div class="section opened"> <div class="section-title"> <h2>Reload bars</h2> </div> <div class="section-content"> <div class="section-option"> <span class="section-option-title">Hat reload bar</span> <div class="content"> <button class="default-color" title="Reset Color"></button> <input id="hatReloadBarColor" type="color"> <label class="switch-checkbox"> <input id="hatReloadBar" type="checkbox"> <span></span> </label> </div> </div> <div class="section-option"> <span class="section-option-title">Fireball reload bar</span> <div class="content"> <button class="default-color" title="Reset Color"></button> <input id="fireballReloadBarColor" type="color"> <label class="switch-checkbox"> <input id="fireballReloadBar" type="checkbox"> <span></span> </label> </div> </div> <div class="section-option"> <span class="section-option-title">Turret reload bar</span> <div class="content"> <button class="default-color" title="Reset Color"></button> <input id="turretReloadBarColor" type="color"> <label class="switch-checkbox"> <input id="turretReloadBar" type="checkbox"> <span></span> </label> </div> </div> <div class="section-option"> <span class="section-option-title">Weapon reload bar</span> <div class="content"> <button class="default-color" title="Reset Color"></button> <input id="weaponReloadBarColor" type="color"> <label class="switch-checkbox"> <input id="weaponReloadBar" type="checkbox"> <span></span> </label> </div> </div> <div class="section-option"> <span class="section-option-title">Smooth reload bar</span> <label class="switch-checkbox"> <input id="smoothReloadBar" type="checkbox"> <span></span> </label> </div> </div> </div> <div class="section opened"> <div class="section-title"> <h2>Player</h2> </div> <div class="section-content"> <div class="section-option"> <span class="section-option-title">Anti hood</span> <label class="switch-checkbox"> <input id="showHoods" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title">Render HP</span> <label class="switch-checkbox"> <input id="drawHP" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title">Item counter</span> <label class="switch-checkbox"> <input id="itemCounter" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title"> Visual aim <span class="tooltip"> * <span class="tooltip-text">It will show where are you aiming</span> </span> </span> <label class="switch-checkbox"> <input id="visualAim" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title">Hide chat messages</span> <label class="switch-checkbox"> <input id="hideMessages" type="checkbox"> <span></span> </label> </div> </div> </div> <div class="section opened"> <div class="section-title"> <h2>Appearance</h2> </div> <div class="section-content"> <div class="split-section"> <div class="section-option"> <span class="section-option-title">Custom skins</span> <label class="switch-checkbox"> <input id="customSkins" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title">Skin</span> <div class="content"> <img> <button data-type="popup" data-id="skin" class="button">Select skin</button> </div> </div> <div class="section-option"> <span class="section-option-title">Accessory</span> <div class="content"> <img> <button data-type="popup" data-id="accessory" class="button">Select accessory</button> </div> </div> <div class="section-option"> <span class="section-option-title">Back</span> <div class="content"> <img> <button data-type="popup" data-id="back" class="button">Select back</button> </div> </div> </div> </div> </div> <div class="section opened"> <div class="section-title"> <h2>Other</h2> </div> <div class="section-content"> <div class="section-option"> <span class="section-option-title">Windmill rotation</span> <label class="switch-checkbox"> <input id="windmillRotation" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title"> Possible shots <span class="tooltip"> * <span class="tooltip-text">Draws a crosshair on entities that can be hit by a projectile</span> </span> </span> <label class="switch-checkbox"> <input id="possibleShots" type="checkbox"> <span></span> </label> </div> </div> </div> </div>';
        const Visuals = Visuals_code;
        var Misc_code = '<div class="menu-page"> <h1>Misc</h1> <p>Customize misc settings, add autochat messages, reset settings</p> <div class="section opened"> <div class="section-title"> <h2>Chat</h2> </div> <div class="section-content one-row"> <div class="section-option"> <span class="section-option-title">Auto chat</span> <div class="content"> <input class="input autochat" type="text" maxlength="35"> <input class="input autochat" type="text" maxlength="35"> <input class="input autochat" type="text" maxlength="35"> <input class="input autochat" type="text" maxlength="35"> <label class="switch-checkbox"> <input id="autochat" type="checkbox"> <span></span> </label> </div> </div> <div class="section-option"> <span class="section-option-title"> Kill message <span class="tooltip"> * <span class="tooltip-text left"> <div>Variables:</div> <div><span class="highlight">{KILL}</span> - amount of kills</div> <div><span class="highlight">{NAME}</span> - name of the player you killed</div> </span> </span> </span> <div class="content"> <input id="killMessage" class="input" type="text" maxlength="35"> <label class="switch-checkbox"> <input id="kill" type="checkbox"> <span></span> </label> </div> </div> </div> </div> <div class="section opened"> <div class="section-title"> <h2>Other</h2> </div> <div class="section-content"> <div class="section-option"> <span class="section-option-title">Auto spawn</span> <label class="switch-checkbox"> <input id="autospawn" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title"> Smooth zoom <span class="tooltip"> * <span class="tooltip-text">Disable for performance</span> </span> </span> <label class="switch-checkbox"> <input id="smoothZoom" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title"> Skip upgrades <span class="tooltip"> * <span class="tooltip-text">When you have only 1 item in the upgradebar, it will automatically select it</span> </span> </span> <label class="switch-checkbox"> <input id="skipUpgrades" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title"> Invis hit toggle <span class="tooltip"> * <span class="tooltip-text">If enabled, invisible hit hotkey will work in toggle mode. Useful when you don\'t want to hold this button permanently</span> </span> </span> <label class="switch-checkbox"> <input id="invisHitToggle" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title">Reverse zoom</span> <label class="switch-checkbox"> <input id="reverseZoom" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title">Auto accept</span> <label class="switch-checkbox"> <input id="autoAccept" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <span class="section-option-title">Always connect to</span> <select id="connectTo" class="smaller"></select> </div> </div> </div> <div class="section opened"> <div class="section-title"> <h2>Menu</h2> </div> <div class="section-content one-row"> <div class="section-option"> <span class="section-option-title">Menu transparency</span> <label class="switch-checkbox"> <input id="menuTransparency" type="checkbox"> <span></span> </label> </div> <div class="section-option"> <div class="content-double"> <button id="reset-settings" class="button red">Reset settings</button> <button id="download-settings" class="button">Download settings</button> <div class="form-upload"> <input id="upload-settings" type="file" accept=".txt"> <span class="light">DRAG SETTINGS FILE HERE OR <span class="light-extra">BROWSE</span></span> </div> </div> </div> </div> </div> </div>';
        const Misc = Misc_code;
        var Credits_code = '<div class="menu-page"> <h1>Credits</h1> <P>Some details about the script and links to my socials</P> <div class="section opened"> <div class="section-content" style="max-height:100%"> <div class="split-section"> <div class="section-option text"> <span class="section-option-title">Author</span> <span class="text-value">Murka</span> </div> <div class="section-option text"> <svg class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"> <path d="M512 12.672c-282.88 0-512 229.248-512 512 0 226.261 146.688 418.133 350.080 485.76 25.6 4.821 34.987-11.008 34.987-24.619 0-12.16-0.427-44.373-0.64-87.040-142.421 30.891-172.459-68.693-172.459-68.693-23.296-59.093-56.96-74.88-56.96-74.88-46.379-31.744 3.584-31.104 3.584-31.104 51.413 3.584 78.421 52.736 78.421 52.736 45.653 78.293 119.851 55.68 149.12 42.581 4.608-33.109 17.792-55.68 32.427-68.48-113.707-12.8-233.216-56.832-233.216-253.013 0-55.893 19.84-101.547 52.693-137.387-5.76-12.928-23.040-64.981 4.48-135.509 0 0 42.88-13.739 140.8 52.48 40.96-11.392 84.48-17.024 128-17.28 43.52 0.256 87.040 5.888 128 17.28 97.28-66.219 140.16-52.48 140.16-52.48 27.52 70.528 10.24 122.581 5.12 135.509 32.64 35.84 52.48 81.493 52.48 137.387 0 196.693-119.68 240-233.6 252.587 17.92 15.36 34.56 46.763 34.56 94.72 0 68.523-0.64 123.563-0.64 140.203 0 13.44 8.96 29.44 35.2 24.32 204.843-67.157 351.403-259.157 351.403-485.077 0-282.752-229.248-512-512-512z"></path> </svg> <a href="https://github.com/Murka007/Ezgame-client" class="text-value" target="_blank" title="Give a star please :)">Ezgame client</a> </div> <div class="section-option text"> <svg class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"> <path d="M26.963 0c1.875 0 3.387 1.516 3.476 3.3v28.7l-3.569-3.031-1.96-1.784-2.139-1.864 0.893 2.94h-18.717c-1.869 0-3.387-1.42-3.387-3.301v-21.653c0-1.784 1.52-3.303 3.393-3.303h22zM18.805 7.577h-0.040l-0.269 0.267c2.764 0.8 4.101 2.049 4.101 2.049-1.781-0.891-3.387-1.336-4.992-1.516-1.16-0.18-2.32-0.085-3.3 0h-0.267c-0.627 0-1.96 0.267-3.747 0.98-0.623 0.271-0.98 0.448-0.98 0.448s1.336-1.336 4.28-2.049l-0.18-0.18c0 0-2.229-0.085-4.636 1.693 0 0-2.407 4.192-2.407 9.36 0 0 1.333 2.32 4.991 2.408 0 0 0.533-0.711 1.073-1.336-2.053-0.624-2.853-1.872-2.853-1.872s0.179 0.088 0.447 0.267h0.080c0.040 0 0.059 0.020 0.080 0.040v0.008c0.021 0.021 0.040 0.040 0.080 0.040 0.44 0.181 0.88 0.36 1.24 0.533 0.621 0.269 1.42 0.537 2.4 0.715 1.24 0.18 2.661 0.267 4.28 0 0.8-0.18 1.6-0.356 2.4-0.713 0.52-0.267 1.16-0.533 1.863-0.983 0 0-0.8 1.248-2.94 1.872 0.44 0.621 1.060 1.333 1.060 1.333 3.659-0.080 5.080-2.4 5.16-2.301 0-5.16-2.42-9.36-2.42-9.36-2.18-1.619-4.22-1.68-4.58-1.68zM19.029 13.461c0.937 0 1.693 0.8 1.693 1.78 0 0.987-0.76 1.787-1.693 1.787s-1.693-0.8-1.693-1.779c0.003-0.987 0.764-1.784 1.693-1.788zM12.972 13.461c0.933 0 1.688 0.8 1.688 1.78 0 0.987-0.76 1.787-1.693 1.787s-1.693-0.8-1.693-1.779c0-0.987 0.76-1.784 1.699-1.788z"></path> </svg> <a href="https://discord.gg/sG9cyfGPj5" class="text-value" target="_blank" title="Join my discord server">Coding paradise</a> </div> <div class="section-option text"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 96 96"> <circle fill="#36363d" stroke="#6a6a81" stroke-width="2" r="48" cy="48" cx="48"/> <clipPath id="GreasyForkCircleClip" clipPathUnits="userSpaceOnUse"> <circle fill="#000" r="47" cy="48" cx="48"/> </clipPath> <text fill="#9494b8" clip-path="url(#GreasyForkCircleClip)" text-anchor="middle" font-size="18" font-family="\'DejaVu Sans\', Verdana, Arial, \'Liberation Sans\', sans-serif" letter-spacing="-0.75" pointer-events="none" style="-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;user-select:none"> <tspan x="51" y="13" textLength="57">= null;</tspan> <tspan x="56" y="35" textLength="98">function init</tspan> <tspan x="49" y="57" textLength="113">for (var i = 0;</tspan> <tspan x="50" y="79" textLength="105">XmlHttpReq</tspan> <tspan x="48" y="101" textLength="80">appendCh</tspan> </text> <path fill="#36363d" stroke="#36363d" stroke-width="4" d="M 44,29\r\n                          a6.36396,6.36396 0,0,1 0,9\r\n                          l36,36\r\n                          a3.25,3.25 0,0,1 -6.5,6.5\r\n                          l-36,-36\r\n                          a6.36396,6.36396 0,0,1 -9,0\r\n                          l-19,-19\r\n                          a1.76777,1.76777 0,0,1 0,-2.5\r\n                          l13.0,-13\r\n                          a1.76777,1.76777 0,0,1 2.5,0\r\n                          z"/> <path fill="#9494b8" d="M 44,29\r\n                          a6.36396,6.36396 0,0,1 0,9\r\n                          l36,36\r\n                          a3.25,3.25 0,0,1 -6.5,6.5\r\n                          l-36,-36\r\n                          a6.36396,6.36396 0,0,1 -9,0\r\n                          l-19,-19\r\n                          a1.76777,1.76777 0,0,1 2.5,-2.5\r\n                          l14,14 4,-4 -14,-14\r\n                          a1.76777,1.76777 0,0,1 2.5,-2.5\r\n                          l14,14 4,-4 -14,-14\r\n                          a1.76777,1.76777 0,0,1 2.5,-2.5\r\n                          z"/> </svg> <a href="https://greasyfork.org/en/users/919633" class="text-value" target="_blank" title="Please support this script on greasyfork">Ezgame client</a> </div> </div> </div> </div> </div>';
        const Credits = Credits_code;
        const styles = '@import"https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap";header{background:#2f2f31;color:#76689a;padding:5px 10px;display:flex;justify-content:flex-start;align-items:center}header #version{align-self:flex-end;color:#9787bd;font-size:.5em;font-weight:600;margin-left:10px}header #version svg{fill:#9787bd}header .icon{margin-left:auto;width:35px;height:35px;fill:#cebcb4;transition:fill 100ms;cursor:pointer}header .icon:hover{fill:#ffe7dc}#navbar-container{display:flex;flex-direction:column;padding:10px;margin-right:10px;background:#2f2f31}#navbar-container .open-menu{outline:none;border:none;cursor:pointer;font-weight:900;font-size:1.4rem;padding:10px;background:#313135;color:#ffe7dc;border-right:1px solid;border-right-color:rgba(0,0,0,0);transition:background 100ms,color 100ms,border-right-color 100ms}#navbar-container .open-menu:hover{background:#313135}#navbar-container .open-menu:active{background:#ffe7dc;color:#313135}#navbar-container .open-menu.active{pointer-events:none;background:#313135;border-right-color:#ffe7dc}#navbar-container .bottom-align{margin-bottom:0px;margin-top:auto !important}@-webkit-keyframes appear{from{opacity:0}to{opacity:1}}@-webkit-keyframes disappear{from{opacity:1}to{opacity:0}}@-webkit-keyframes failedTransition{0%{transform:translate(0px, 0px)}10%{transform:translate(-35px, -10px)}30%{transform:translate(25px, 8px)}50%{transform:translate(-15px, -6px)}70%{transform:translate(5px, 4px)}100%{transform:translate(0px, 0px)}}@keyframes appear{from{opacity:0}to{opacity:1}}@keyframes disappear{from{opacity:1}to{opacity:0}}@keyframes failedTransition{0%{transform:translate(0px, 0px)}10%{transform:translate(-35px, -10px)}30%{transform:translate(25px, 8px)}50%{transform:translate(-15px, -6px)}70%{transform:translate(5px, 4px)}100%{transform:translate(0px, 0px)}}.menu-page{display:none;background:#2f2f31;padding:10px;padding-top:0px}.menu-page.opened{display:block;animation:appear 300ms forwards}.menu-page h1{color:#76689a;font-size:1.5em;font-weight:900}.menu-page h2{color:#9494b8;font-size:1em;font-weight:900}.menu-page p{color:#675a86;font-size:.5em;font-weight:700}.menu-page .content{display:flex;justify-content:space-between;align-items:center;gap:10px}.menu-page .content>img{width:40px;height:40px}.menu-page .content-double{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;width:250px}.menu-page .content-double button{width:48%}.menu-page .content-double:nth-child(3){width:100%}.menu-page #killMessage{width:270px}.menu-page .highlight{font-weight:700;color:#ffe7dc;background:#6a6a81;padding:0 1px}.menu-page .section{background:#36363d;border-radius:5px;margin:20px 0}.menu-page .section:last-child{margin-bottom:0px}.menu-page .section .section-title{display:flex;justify-content:space-between;align-items:center;padding:10px}.menu-page .section .section-title .icon{width:25px;height:25px;margin-right:10px;fill:#cebcb4;transition:fill 100ms,transform 100ms}.menu-page .section .section-title .icon.rotate{transform:rotate(90deg);fill:#ffe7dc}.menu-page .section .section-title:hover .icon{fill:#ffe7dc}.menu-page .section:not(.opened) .section-title{cursor:pointer}.menu-page .section:not(.opened) .section-content{overflow:hidden}.menu-page .section .section-content{padding:10px;padding-top:0px;display:grid;grid-template-columns:1fr 1fr;transition:max-height 250ms cubic-bezier(0, 1, 0, 1);max-height:0px}.menu-page .section .section-content.one-row{grid-template-columns:1fr}.menu-page .section .section-content.opened{transition:max-height 250ms ease-out;max-height:100%}.menu-page .section .section-content .split{grid-column:1/3;margin-top:10px;background:#40404a;height:2px}.menu-page .section .section-content .section-option{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-right:25px}.menu-page .section .section-content .section-option .icon{width:35px;height:35px;fill:#6a6a81}.menu-page .section .section-content .section-option.centered{justify-content:center}.menu-page .section .section-content .section-option.text{justify-content:flex-start;gap:10px}.menu-page .section .section-content .section-option.text .text-value{font-size:.7em;color:#9494b8}.menu-page .section .section-content .section-option .section-option-title{color:#6a6a81;font-size:.8em}.menu-page .section .section-content .section-option .section-option-hotkeyInput{cursor:pointer;font-weight:900;font-size:.6em;padding-bottom:8px;outline:none;border:none;text-align:center;width:80px;height:35px;border-radius:7.5px;background:#7d7d9b;color:#adbcd8;box-shadow:0px -6px 0px 0px #68687c inset}.menu-page .section .section-content .section-option .section-option-hotkeyInput.red{background:#9e5454;color:#d8adad;box-shadow:0px -6px 0px 0px #783d3d inset}.menu-page .section .section-content .section-option .section-option-hotkeyInput:not([id]){cursor:not-allowed}.menu-page .section .section-content .section-option .section-option-hotkeyInput.smaller{font-size:.41em}.menu-page .section .section-content .section-option .switch-checkbox{position:relative;width:70px;height:25px}.menu-page .section .section-content .section-option .switch-checkbox input{width:0;height:0;opacity:0}.menu-page .section .section-content .section-option .switch-checkbox input:checked+span{background:#7d7d9b;box-shadow:0px 5px 0px 0px #68687c inset}.menu-page .section .section-content .section-option .switch-checkbox input:checked+span:before{background:#ffe7dc;transform:translateX(42px)}.menu-page .section .section-content .section-option .switch-checkbox span{position:absolute;cursor:pointer;top:0;left:0;bottom:0;right:0;width:100%;height:100%;display:flex;align-items:center;background:#5f5f79;box-shadow:0px 5px 0px 0px #4d4d5f inset;border-radius:10px;transition:all 100ms ease-in-out}.menu-page .section .section-content .section-option .switch-checkbox span:before{position:absolute;content:"";width:28px;height:28px;border-radius:50%;background:#f0dcd3;box-shadow:0px -5px 0px 0px #cebcb4 inset;border:2px solid #adbcd8;transition:all 100ms ease-in-out}.menu-page .section .section-content .section-option .slider{position:relative;margin-right:45px}.menu-page .section .section-content .section-option .slider input{-webkit-appearance:none;outline:none;cursor:pointer;width:154px;height:20.8333333333px;border-radius:10px;background:#7d7d9b;box-shadow:0px 5px 0px 0px #68687c inset}.menu-page .section .section-content .section-option .slider input::-webkit-slider-thumb{-webkit-appearance:none;width:28px;height:28px;border-radius:50%;background:#ffe7dc;box-shadow:0px -5px 0px 0px #cebcb4 inset;border:2px solid #adbcd8}.menu-page .section .section-content .section-option .slider .slider-value{position:absolute;margin-left:5px;color:#6a6a81;font-size:.65em}.menu-page .section .section-content .section-option .input{outline:none;border:none;font-weight:900;text-align:center;width:130px;height:35px;padding-bottom:6px;border-radius:7.5px;background:#7d7d9b;color:#adbcd8;box-shadow:0px -6px 0px 0px #68687c inset}.menu-page .section .section-content .section-option .input:focus{border:3px solid #f0dcd3}.menu-page .section .section-content .section-option .button{outline:none;border:none;font-weight:900;cursor:pointer;height:40px;padding-bottom:6px;border-radius:7.5px;background:#7d7d9b;color:#adbcd8;box-shadow:0px -6px 0px 0px #68687c inset}.menu-page .section .section-content .section-option .button[data-type]{width:135px;font-size:.45em}.menu-page .section .section-content .section-option .button:active{padding-bottom:0px;padding-top:3px;box-shadow:0px 3px 0px 0px #68687c inset}.menu-page .section .section-content .section-option .button.red{background:#9e5454;color:#d8adad;box-shadow:0px -6px 0px 0px #783d3d inset}.menu-page .section .section-content .section-option .button.red:active{box-shadow:0px 3px 0px 0px #783d3d inset}.menu-page .section .section-content .section-option .button.width{width:9em;font-size:.6em}.menu-page .section .section-content .section-option .form-upload{position:relative;font-size:.55em;font-weight:400;letter-spacing:1.5px;text-align:center;width:100%;border-radius:5px;border:2px dashed;border-color:rgba(173,188,216,.5411764706);padding:15px 10px;transition:border-color 100ms}.menu-page .section .section-content .section-option .form-upload:hover{border-color:#adbcd8}.menu-page .section .section-content .section-option .form-upload.red{border-color:#9e5454;animation:failedTransition 400ms}.menu-page .section .section-content .section-option .form-upload.red .light{color:#d8adad}.menu-page .section .section-content .section-option .form-upload.green{border-color:#77c468}.menu-page .section .section-content .section-option .form-upload.green .light{color:#a1dda1}.menu-page .section .section-content .section-option .form-upload input{position:absolute;opacity:0;top:0;left:0;bottom:0;right:0;width:100%;height:100%;cursor:pointer}.menu-page .section .section-content .section-option .form-upload .light{color:#adbcd8}.menu-page .section .section-content .section-option .form-upload .light-extra{color:#f0dcd3}.menu-page .section .section-content .section-option .tooltip{position:relative;margin-left:5px;color:#8181a0}.menu-page .section .section-content .section-option .tooltip:hover{cursor:pointer}.menu-page .section .section-content .section-option .tooltip:hover .tooltip-text{visibility:visible}.menu-page .section .section-content .section-option .tooltip .tooltip-text{position:absolute;visibility:hidden;text-align:center;overflow:visible;bottom:calc(100% - 5px);left:50%;transform:translateX(-50%);background-color:#7d7d9b;color:#ffe7dc;width:225px;font-size:13px;font-weight:600;padding:5px;border-radius:5px;border:3px solid #5f5f79}.menu-page .section .section-content .section-option .tooltip .tooltip-text.left{text-align:left}.menu-page .section .section-content .section-option select[id]{outline:none;border:none;font-weight:900;width:195px;font-size:.6em;border-radius:7.5px;padding:2.5px;background:#7d7d9b;color:#adbcd8;box-shadow:0px 4px 0px 0px #68687c inset}.menu-page .section .section-content .section-option select[id].smaller{width:130px}@-webkit-keyframes appear{from{opacity:0}to{opacity:1}}@-webkit-keyframes disappear{from{opacity:1}to{opacity:0}}@-webkit-keyframes failedTransition{0%{transform:translate(0px, 0px)}10%{transform:translate(-35px, -10px)}30%{transform:translate(25px, 8px)}50%{transform:translate(-15px, -6px)}70%{transform:translate(5px, 4px)}100%{transform:translate(0px, 0px)}}@keyframes appear{from{opacity:0}to{opacity:1}}@keyframes disappear{from{opacity:1}to{opacity:0}}@keyframes failedTransition{0%{transform:translate(0px, 0px)}10%{transform:translate(-35px, -10px)}30%{transform:translate(25px, 8px)}50%{transform:translate(-15px, -6px)}70%{transform:translate(5px, 4px)}100%{transform:translate(0px, 0px)}}@-webkit-keyframes appear{from{opacity:0}to{opacity:1}}@-webkit-keyframes disappear{from{opacity:1}to{opacity:0}}@-webkit-keyframes failedTransition{0%{transform:translate(0px, 0px)}10%{transform:translate(-35px, -10px)}30%{transform:translate(25px, 8px)}50%{transform:translate(-15px, -6px)}70%{transform:translate(5px, 4px)}100%{transform:translate(0px, 0px)}}@keyframes appear{from{opacity:0}to{opacity:1}}@keyframes disappear{from{opacity:1}to{opacity:0}}@keyframes failedTransition{0%{transform:translate(0px, 0px)}10%{transform:translate(-35px, -10px)}30%{transform:translate(25px, 8px)}50%{transform:translate(-15px, -6px)}70%{transform:translate(5px, 4px)}100%{transform:translate(0px, 0px)}}html,body{margin:0;padding:0;background:rgba(0,0,0,0) !important;scrollbar-width:10px;scrollbar-track-color:#36363d;scrollbar-face-color:#494955}*{font-family:"Lato",sans-serif}h1,h2,h3,h4,p{margin:0}#menu-container{font-weight:900;font-size:2rem;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:1024px;height:700px;display:flex;justify-content:center;align-items:center;user-select:none}#menu-container.open{animation:appear 100ms forwards}#menu-container.close{animation:disappear 100ms forwards}#menu-container.transparent #menu-wrapper{background:rgba(43,43,44,.4666666667)}#menu-container.transparent #navbar-container{background:rgba(47,47,49,.6431372549)}#menu-container.transparent .menu-page{background:rgba(47,47,49,.6431372549)}#menu-container.transparent .section{background:rgba(54,54,61,.6509803922)}#menu-wrapper{position:relative;display:flex;flex-direction:column;width:100%;height:80%;background:#2b2b2c;border-radius:5px;padding:10px}main{display:flex;justify-content:space-between;margin-top:10px;height:100%}main #menu-page-container{width:100%;height:500px;overflow-y:scroll}.default-color{outline:none;border:none;width:10px;height:10px;border-radius:100%;cursor:pointer}input[id][type=color]{outline:none;border:none;padding:0 1px;margin:0;height:24px;background-color:#7d7d9b;border-radius:5px;cursor:pointer}::-webkit-scrollbar{width:10px}::-webkit-scrollbar-track{background:#36363d;border-radius:10px}::-webkit-scrollbar-thumb{background:#494955;border-radius:10px}#popup-menu{position:absolute;top:0;left:0;bottom:0;right:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;background:rgba(25,25,35,.5)}#popup-menu #popup-container{position:relative;width:70%;height:50%;background:#2f2f31;border-radius:10px;border:6px solid #36363d;padding:10px;display:flex;justify-content:space-between}#popup-menu #popup-container #close-popup{position:absolute;z-index:5;right:0;top:0;fill:#cebcb4;transition:fill 100ms;cursor:pointer}#popup-menu #popup-container #close-popup:hover{fill:#ffe7dc}#popup-menu #popup-container #popup-wrapper{position:absolute;z-index:1;top:10px;left:10px;bottom:10px;right:10px;padding:10px;display:flex;justify-content:space-between}#popup-menu #popup-container #popup-wrapper #popup-data{width:50%;height:100%;display:flex;flex-direction:column}#popup-menu #popup-container #popup-wrapper #popup-content{display:grid;width:100%;grid-template-columns:repeat(auto-fill, minmax(125px, 1fr));grid-gap:10px;overflow-y:auto}#popup-menu #popup-container #popup-wrapper #popup-content .img-prev{padding-bottom:6px;border-radius:7.5px;background:#7d7d9b;color:#adbcd8;box-shadow:0px -6px 0px 0px #68687c inset;cursor:pointer}#popup-menu #popup-container #popup-wrapper #popup-content .img-prev:active{padding-bottom:0px;padding-top:6px;box-shadow:0px 6px 0px 0px #68687c inset}#popup-menu #popup-container #popup-wrapper #popup-content .img-prev img{pointer-events:none;width:100%;height:100%}#popup-menu #popup-container #popup-title{font-size:2em;color:#ffe7dc;text-shadow:#3d3937 4px 0px 0px,#3d3937 3.87565px .989616px 0px,#3d3937 3.51033px 1.9177px 0px,#3d3937 2.92676px 2.72655px 0px,#3d3937 2.16121px 3.36588px 0px,#3d3937 1.26129px 3.79594px 0px,#3d3937 .282949px 3.98998px 0px,#3d3937 -0.712984px 3.93594px 0px,#3d3937 -1.66459px 3.63719px 0px,#3d3937 -2.51269px 3.11229px 0px,#3d3937 -3.20457px 2.39389px 0px,#3d3937 -3.69721px 1.52664px 0px,#3d3937 -3.95997px .56448px 0px,#3d3937 -3.97652px -0.432781px 0px,#3d3937 -3.74583px -1.40313px 0px,#3d3937 -3.28224px -2.28625px 0px,#3d3937 -2.61457px -3.02721px 0px,#3d3937 -1.78435px -3.57996px 0px,#3d3937 -0.843183px -3.91012px 0px,#3d3937 .150409px -3.99717px 0px,#3d3937 1.13465px -3.8357px 0px,#3d3937 2.04834px -3.43574px 0px,#3d3937 2.83468px -2.82216px 0px,#3d3937 3.44477px -2.03312px 0px,#3d3937 3.84068px -1.11766px 0px,#3d3937 3.9978px -0.132717px 0px}#popup-menu #popup-container #popup-description{color:#f0dcd3;text-shadow:#3d3937 4px 0px 0px,#3d3937 3.87565px .989616px 0px,#3d3937 3.51033px 1.9177px 0px,#3d3937 2.92676px 2.72655px 0px,#3d3937 2.16121px 3.36588px 0px,#3d3937 1.26129px 3.79594px 0px,#3d3937 .282949px 3.98998px 0px,#3d3937 -0.712984px 3.93594px 0px,#3d3937 -1.66459px 3.63719px 0px,#3d3937 -2.51269px 3.11229px 0px,#3d3937 -3.20457px 2.39389px 0px,#3d3937 -3.69721px 1.52664px 0px,#3d3937 -3.95997px .56448px 0px,#3d3937 -3.97652px -0.432781px 0px,#3d3937 -3.74583px -1.40313px 0px,#3d3937 -3.28224px -2.28625px 0px,#3d3937 -2.61457px -3.02721px 0px,#3d3937 -1.78435px -3.57996px 0px,#3d3937 -0.843183px -3.91012px 0px,#3d3937 .150409px -3.99717px 0px,#3d3937 1.13465px -3.8357px 0px,#3d3937 2.04834px -3.43574px 0px,#3d3937 2.83468px -2.82216px 0px,#3d3937 3.44477px -2.03312px 0px,#3d3937 3.84068px -1.11766px 0px,#3d3937 3.9978px -0.132717px 0px;margin-left:30px;margin-top:30px}#popup-menu #popup-container #popup-bottom{display:flex;justify-content:space-between;align-items:center;margin-top:auto}#popup-menu #popup-container #popup-bottom .popup-button{border:none;outline:none;display:inline-block;font-family:"Lato",sans-serif;text-align:center;cursor:pointer;max-width:160px;width:100%;font-size:.8em;font-weight:900;padding:5px 10px 10px;border-radius:5px;color:#ffe7dc;text-decoration:none;text-shadow:#3d3937 4px 0px 0px,#3d3937 3.87565px .989616px 0px,#3d3937 3.51033px 1.9177px 0px,#3d3937 2.92676px 2.72655px 0px,#3d3937 2.16121px 3.36588px 0px,#3d3937 1.26129px 3.79594px 0px,#3d3937 .282949px 3.98998px 0px,#3d3937 -0.712984px 3.93594px 0px,#3d3937 -1.66459px 3.63719px 0px,#3d3937 -2.51269px 3.11229px 0px,#3d3937 -3.20457px 2.39389px 0px,#3d3937 -3.69721px 1.52664px 0px,#3d3937 -3.95997px .56448px 0px,#3d3937 -3.97652px -0.432781px 0px,#3d3937 -3.74583px -1.40313px 0px,#3d3937 -3.28224px -2.28625px 0px,#3d3937 -2.61457px -3.02721px 0px,#3d3937 -1.78435px -3.57996px 0px,#3d3937 -0.843183px -3.91012px 0px,#3d3937 .150409px -3.99717px 0px,#3d3937 1.13465px -3.8357px 0px,#3d3937 2.04834px -3.43574px 0px,#3d3937 2.83468px -2.82216px 0px,#3d3937 3.44477px -2.03312px 0px,#3d3937 3.84068px -1.11766px 0px,#3d3937 3.9978px -0.132717px 0px}#popup-menu #popup-container #popup-bottom .popup-button#popup-continue{background:#77c468;box-shadow:0px -6px 0px 0px #49783d inset}#popup-menu #popup-container #popup-bottom .popup-button#popup-continue:active{padding:10px 10px 5px;box-shadow:0px 3px 0px 0px #49783d inset}#popup-menu #popup-container #popup-bottom .popup-button#popup-close{background:#9e5454;box-shadow:0px -6px 0px 0px #783d3d inset}#popup-menu #popup-container #popup-bottom .popup-button#popup-close:active{padding:10px 10px 5px;box-shadow:0px 3px 0px 0px #783d3d inset}#popup-menu #popup-container #popup-prev{width:50%;height:100%;display:flex;justify-content:right;align-items:center}#popup-menu #popup-container #popup-prev img{width:auto;height:auto;max-width:100%;max-height:100%}#image-background{position:absolute;animation:moving 60s infinite linear;padding:10px;top:0;left:0;bottom:0;right:0;filter:opacity(0.4)}.discord-bg{background:url(https://i.imgur.com/RcTl09i.png) 0 0/8% repeat;background-clip:content-box}.github-bg{background:url(https://i.imgur.com/q0z20jB.png) 0 0/8% repeat;background-clip:content-box}.greasyfork-bg{background:url(https://i.imgur.com/y6OYX0D.png) 0 0/8% repeat;background-clip:content-box}@keyframes moving{0%{background-position:0 0}100%{background-position:-500px 500px}}';
        var ELayer;
        (function(ELayer) {
            ELayer[ELayer["PLAYER"] = 0] = "PLAYER";
            ELayer[ELayer["STONE"] = 1] = "STONE";
            ELayer[ELayer["HARDSPIKE"] = 2] = "HARDSPIKE";
            ELayer[ELayer["TREE"] = 3] = "TREE";
            ELayer[ELayer["GOLD"] = 4] = "GOLD";
            ELayer[ELayer["BUSH"] = 5] = "BUSH";
            ELayer[ELayer["TRAP"] = 6] = "TRAP";
            ELayer[ELayer["SPIKE"] = 7] = "SPIKE";
            ELayer[ELayer["WOODWALL"] = 8] = "WOODWALL";
            ELayer[ELayer["PLATFORM"] = 9] = "PLATFORM";
            ELayer[ELayer["BOOST"] = 10] = "BOOST";
            ELayer[ELayer["LOOTBOX"] = 11] = "LOOTBOX";
            ELayer[ELayer["PROJECTILE"] = 12] = "PROJECTILE";
            ELayer[ELayer["WINDMILL"] = 13] = "WINDMILL";
            ELayer[ELayer["COW"] = 14] = "COW";
            ELayer[ELayer["SPAWN"] = 15] = "SPAWN";
            ELayer[ELayer["POWERMILL"] = 16] = "POWERMILL";
            ELayer[ELayer["CASTLESPIKE"] = 17] = "CASTLESPIKE";
            ELayer[ELayer["TURRET"] = 18] = "TURRET";
            ELayer[ELayer["WOODFARM"] = 19] = "WOODFARM";
            ELayer[ELayer["CHERRYWOODFARM"] = 20] = "CHERRYWOODFARM";
            ELayer[ELayer["STONEWARM"] = 21] = "STONEWARM";
            ELayer[ELayer["CASTLEWALL"] = 22] = "CASTLEWALL";
            ELayer[ELayer["SHARK"] = 23] = "SHARK";
            ELayer[ELayer["WOLF"] = 24] = "WOLF";
            ELayer[ELayer["GOLDENCOW"] = 25] = "GOLDENCOW";
            ELayer[ELayer["ROOF"] = 26] = "ROOF";
            ELayer[ELayer["DRAGON"] = 27] = "DRAGON";
            ELayer[ELayer["MAMMOTH"] = 28] = "MAMMOTH";
            ELayer[ELayer["FIREBALL"] = 29] = "FIREBALL";
            ELayer[ELayer["CHEST"] = 30] = "CHEST";
            ELayer[ELayer["DRAGONWALLBIG"] = 31] = "DRAGONWALLBIG";
            ELayer[ELayer["DRAGONWALLMEDIUM"] = 32] = "DRAGONWALLMEDIUM";
            ELayer[ELayer["DRAGONWALLSMALL"] = 33] = "DRAGONWALLSMALL";
            ELayer[ELayer["MAMMOTHWALL"] = 34] = "MAMMOTHWALL";
            ELayer[ELayer["MAMMOTHWALLSMALL"] = 35] = "MAMMOTHWALLSMALL";
            ELayer[ELayer["DUCK"] = 36] = "DUCK";
            ELayer[ELayer["TELEPORT"] = 37] = "TELEPORT";
            ELayer[ELayer["CACTUS"] = 38] = "CACTUS";
            ELayer[ELayer["TORNADO"] = 39] = "TORNADO";
        })(ELayer || (ELayer = {}));
        const LayerDataArray = [ {
            id: ELayer.PLAYER,
            radius: 35,
            maxHealth: 100,
            Qa: 1
        }, {
            id: ELayer.STONE,
            shoot: true,
            radius: 75,
            Qa: 1,
            Pa: 1
        }, {
            id: ELayer.HARDSPIKE,
            shoot: true,
            qa: 35,
            radius: 45,
            maxHealth: 500,
            Qa: 1
        }, {
            id: ELayer.TREE,
            shoot: true,
            cannotShoot: true,
            radius: 90,
            Qa: 1,
            Ka: 1
        }, {
            id: ELayer.GOLD,
            shoot: true,
            radius: 76,
            Qa: 1,
            Xa: 5
        }, {
            id: ELayer.BUSH,
            shoot: true,
            radius: 50,
            Qa: 1,
            Na: 1
        }, {
            id: ELayer.TRAP,
            radius: 40,
            maxHealth: 500,
            Qa: 1
        }, {
            id: ELayer.SPIKE,
            shoot: true,
            qa: 20,
            radius: 45,
            maxHealth: 375,
            Ia: 20,
            Qa: 1
        }, {
            id: ELayer.WOODWALL,
            shoot: true,
            radius: 45,
            maxHealth: 380,
            Qa: 1
        }, {
            id: ELayer.PLATFORM,
            radius: 60,
            maxHealth: 300,
            Qa: 1
        }, {
            id: ELayer.BOOST,
            radius: 40,
            maxHealth: 300,
            Qa: 1
        }, {
            id: ELayer.LOOTBOX,
            radius: 40,
            maxHealth: 4,
            Qa: 1
        }, {
            id: ELayer.PROJECTILE,
            radius: 0,
            maxHealth: 0
        }, {
            id: ELayer.WINDMILL,
            shoot: true,
            radius: 45,
            maxHealth: 400,
            rotateSpeed: Math.PI / 4,
            Qa: 1
        }, {
            id: ELayer.COW,
            radius: 90,
            maxHealth: 380,
            animal: true,
            Qa: 1,
            Ja: 1.6,
            $a: 9,
            ts: 0
        }, {
            id: ELayer.SPAWN,
            shoot: true,
            radius: 50,
            maxHealth: 380,
            Qa: 1
        }, {
            id: ELayer.POWERMILL,
            shoot: true,
            radius: 54,
            maxHealth: 400,
            rotateSpeed: Math.PI / 2,
            Qa: 1
        }, {
            id: ELayer.CASTLESPIKE,
            shoot: true,
            qa: 5,
            radius: 42,
            maxHealth: 1200,
            Ia: 24,
            Qa: 1
        }, {
            id: ELayer.TURRET,
            shoot: true,
            radius: 45,
            maxHealth: 800,
            Qa: 1
        }, {
            id: ELayer.WOODFARM,
            shoot: true,
            cannotShoot: true,
            radius: 80,
            Qa: 1,
            Ka: 1
        }, {
            id: ELayer.CHERRYWOODFARM,
            shoot: true,
            cannotShoot: true,
            radius: 80,
            Qa: 1,
            Ka: 1
        }, {
            id: ELayer.STONEWARM,
            shoot: true,
            radius: 60,
            Qa: 1,
            Pa: 1
        }, {
            id: ELayer.CASTLEWALL,
            shoot: true,
            radius: 59,
            maxHealth: 1750,
            Qa: 1
        }, {
            id: ELayer.SHARK,
            radius: 90,
            maxHealth: 380,
            animal: true,
            Qa: 1,
            Ja: 1.2,
            $a: 49,
            qa: 14,
            ts: 3
        }, {
            id: ELayer.WOLF,
            radius: 50,
            maxHealth: 380,
            animal: true,
            Qa: 1,
            Ja: 1.6,
            $a: 17,
            qa: 14,
            ts: 0
        }, {
            id: ELayer.GOLDENCOW,
            radius: 90,
            maxHealth: 1e3,
            animal: true,
            Qa: 1,
            Ja: 1.6,
            $a: 17,
            qa: 19
        }, {
            id: ELayer.ROOF,
            radius: 50,
            maxHealth: 300,
            Qa: 1
        }, {
            id: ELayer.DRAGON,
            radius: 100,
            maxHealth: 5e3,
            animal: true,
            Qa: 1,
            Ja: 1.15,
            $a: 17,
            qa: 30,
            ts: 0
        }, {
            id: ELayer.MAMMOTH,
            radius: 90,
            maxHealth: 5e3,
            animal: true,
            Qa: 1,
            Ja: 1.6,
            $a: 17,
            qa: 30,
            ts: 1
        }, {
            id: ELayer.FIREBALL,
            radius: 100,
            maxHealth: 380,
            Qa: 1,
            Ja: .4,
            $a: 1,
            qa: 15,
            ts: 0
        }, {
            id: ELayer.CHEST,
            shoot: true,
            radius: 45,
            maxHealth: 380,
            Qa: 1,
            Xa: 50,
            Lr: 20
        }, {
            id: ELayer.DRAGONWALLBIG,
            shoot: true,
            radius: 92,
            Qa: 1,
            Pa: 1
        }, {
            id: ELayer.DRAGONWALLMEDIUM,
            shoot: true,
            radius: 92,
            Qa: 1,
            Pa: 1
        }, {
            id: ELayer.DRAGONWALLSMALL,
            shoot: true,
            radius: 58,
            Qa: 1,
            Pa: 1
        }, {
            id: ELayer.MAMMOTHWALL,
            shoot: true,
            radius: 92,
            Qa: 1,
            Pa: 0
        }, {
            id: ELayer.MAMMOTHWALLSMALL,
            shoot: true,
            radius: 20,
            Qa: 1,
            Pa: 0
        }, {
            id: ELayer.DUCK,
            radius: 20,
            maxHealth: 380,
            animal: true,
            Qa: 1,
            Ja: 1.6,
            $a: 9,
            ts: 0
        }, {
            id: ELayer.TELEPORT,
            shoot: true,
            radius: 35,
            maxHealth: 150,
            Qa: 1
        }, {
            id: ELayer.CACTUS,
            shoot: true,
            radius: 50,
            Qa: 1,
            Na: 5,
            qa: 20
        }, {
            id: ELayer.TORNADO,
            radius: 220,
            rotateSpeed: Math.PI / 4,
            Qa: 0,
            Na: 5,
            qa: 1
        } ];
        const LayerData = LayerDataArray;
        const LayerObjects = LayerData.filter((layer => layer.shoot));
        const Animals = LayerData.filter((layer => layer.animal));
        var EObjects;
        (function(EObjects) {
            EObjects[EObjects["BOOST"] = 6] = "BOOST";
            EObjects[EObjects["PLATFORM"] = 8] = "PLATFORM";
            EObjects[EObjects["TRAP"] = 9] = "TRAP";
            EObjects[EObjects["WINDMILL"] = 14] = "WINDMILL";
            EObjects[EObjects["SPAWN"] = 16] = "SPAWN";
            EObjects[EObjects["POWERMILL"] = 19] = "POWERMILL";
            EObjects[EObjects["ROOF"] = 48] = "ROOF";
        })(EObjects || (EObjects = {}));
        var PlacementType;
        (function(PlacementType) {
            PlacementType[PlacementType["DEFAULT"] = 0] = "DEFAULT";
            PlacementType[PlacementType["INVISIBLE"] = 1] = "INVISIBLE";
            PlacementType[PlacementType["HOLDING"] = 2] = "HOLDING";
        })(PlacementType || (PlacementType = {}));
        var EServers;
        (function(EServers) {
            EServers["SAND_EU1"] = "SFRA";
            EServers["SAND_EU2"] = "SFRA2BIS";
            EServers["SAND_USA1"] = "SCA";
            EServers["SAND_USA2"] = "SCA2";
            EServers["SAND_AS1"] = "SGP";
            EServers["SAND_AS2"] = "SGP2";
            EServers["SAND_AS3"] = "SGP3BIS";
            EServers["NORM_EU1"] = "FRA1FFA";
            EServers["NORM_USA1"] = "CA1FFA";
            EServers["NORM_AS1"] = "SGP1FFA";
            EServers["BATTLE_USA1"] = "BRSCA";
        })(EServers || (EServers = {}));
        const selectData = {
            placementType: PlacementType,
            connectTo: EServers
        };
        var TargetReload;
        (function(TargetReload) {
            TargetReload[TargetReload["TURRET"] = 3e3] = "TURRET";
            TargetReload[TargetReload["HAT"] = 1300] = "HAT";
            TargetReload[TargetReload["DRAGON"] = 3e3] = "DRAGON";
        })(TargetReload || (TargetReload = {}));
        var Hit;
        (function(Hit) {
            Hit[Hit["CANNOT"] = 0] = "CANNOT";
            Hit[Hit["CAN"] = 1] = "CAN";
            Hit[Hit["NEEDDESTROY"] = 2] = "NEEDDESTROY";
        })(Hit || (Hit = {}));
        const Reload = {
            hat: {
                current: TargetReload.HAT,
                lerp: TargetReload.HAT,
                max: TargetReload.HAT,
                color: () => Settings.hatReloadBarColor
            },
            weapon: {
                current: 0,
                lerp: 0,
                max: 0,
                color: () => Settings.weaponReloadBarColor
            },
            turret: {
                current: TargetReload.TURRET,
                lerp: TargetReload.TURRET,
                max: TargetReload.TURRET,
                color: () => Settings.turretReloadBarColor
            },
            fireball: {
                current: TargetReload.DRAGON,
                lerp: TargetReload.DRAGON,
                max: TargetReload.DRAGON,
                color: () => Settings.fireballReloadBarColor
            }
        };
        class Storage {
            static get(key) {
                const item = localStorage.getItem(key);
                return item !== null ? JSON.parse(item) : null;
            }
            static set(key, value) {
                localStorage.setItem(key, JSON.stringify(value));
            }
            static delete(key) {
                const has = localStorage.hasOwnProperty(key) && key in localStorage;
                localStorage.removeItem(key);
                return has;
            }
        }
        const defaultSettings = {
            primary: "Digit1",
            secondary: "Digit2",
            heal: "KeyQ",
            wall: "Digit4",
            spike: "KeyV",
            windmill: "KeyN",
            trap: "KeyF",
            turret: "KeyH",
            tree: "KeyU",
            platform: "KeyT",
            spawn: "KeyJ",
            up: "KeyW",
            left: "KeyA",
            down: "KeyS",
            right: "KeyD",
            autoattack: "KeyE",
            lockRotation: "KeyX",
            openChat: "Enter",
            invisibleHit: 2,
            spikeInsta: "KeyR",
            toggleMenu: "Escape",
            fastBreak: "KeyZ",
            upgradeScythe: "...",
            unequip: "...",
            bush: "...",
            berserker: "...",
            jungle: "...",
            crystal: "...",
            spikegear: "...",
            immunity: 4,
            boost: 3,
            applehat: "...",
            scuba: "...",
            hood: "...",
            demolist: "...",
            placementType: PlacementType.INVISIBLE,
            placementSpeed: 1,
            autobed: true,
            automill: true,
            antiFireball: true,
            autoheal: true,
            jungleOnClown: true,
            lastHat: true,
            autoScuba: true,
            meleeAim: true,
            bowAim: true,
            spikeInstaAim: true,
            autosync: true,
            autoboostFollow: true,
            enemyTracers: true,
            teammateTracers: true,
            animalTracers: true,
            enemyColor: "#cc5151",
            teammateColor: "#8ecc51",
            animalColor: "#518ccc",
            arrows: true,
            rainbow: false,
            drawHP: true,
            showHoods: true,
            itemCounter: true,
            visualAim: true,
            hideMessages: false,
            customSkins: false,
            skin: Storage.get("skin") || 27,
            accessory: Storage.get("accessory") || 30,
            back: Storage.get("back") || 2,
            itemMarkers: true,
            teammateMarkers: true,
            enemyMarkers: true,
            trapActivated: true,
            itemMarkersColor: "#8ecc51",
            teammateMarkersColor: "#cfbc5f",
            enemyMarkersColor: "#cc5151",
            trapActivatedColor: "#48b2b8",
            hatReloadBar: true,
            hatReloadBarColor: "#5155cc",
            fireballReloadBar: true,
            fireballReloadBarColor: "#cf7148",
            turretReloadBar: true,
            turretReloadBarColor: "#51cc80",
            weaponReloadBar: true,
            weaponReloadBarColor: "#cc8251",
            smoothReloadBar: true,
            windmillRotation: false,
            possibleShots: true,
            autochat: true,
            autochatMessages: [ "Bds | Mod????", "Get Destroy And Crash And Bots!!!??", "Why KIll D:!!????", "Why Toxic????!" ],
            kill: true,
            killMessage: "{NAME} ♥ ꧁༺༒Bye :D!༒༻꧂ ♥",
            autospawn: false,
            smoothZoom: true,
            skipUpgrades: true,
            invisHitToggle: false,
            reverseZoom: false,
            autoAccept: false,
            connectTo: "SFRA",
            menuTransparency: false,
            blindUsers: [ 0, 0, 0 ]
        };
        const settings = {
            ...defaultSettings,
            ...Storage.get("Ezgame-settings")
        };
        for (const key in settings) {
            if (!defaultSettings.hasOwnProperty(key)) {
                delete settings[key];
            }
        }
        Storage.set("Ezgame-settings", settings);
        const Settings = settings;
        class Formatter {
            static object(target) {
                const layer = LayerData[target.type];
                return {
                    id: target[Ezgame.props.id],
                    type: target.type,
                    x: target[Ezgame.props.x],
                    y: target[Ezgame.props.y],
                    x1: target[Ezgame.props.x1],
                    y1: target[Ezgame.props.y1],
                    x2: target[Ezgame.props.x2],
                    y2: target[Ezgame.props.y2],
                    angle: target[Ezgame.props.angle],
                    angle1: target[Ezgame.props.angle1],
                    angle2: target[Ezgame.props.angle2],
                    ownerID: target[Ezgame.props.ownerID],
                    radius: layer.radius,
                    layerData: layer,
                    target
                };
            }
            static projectile(target) {
                const object = this.object(target);
                return {
                    ...object,
                    range: target.range,
                    projectileType: target[Ezgame.props.projectileType]
                };
            }
            static entity(target) {
                const object = this.object(target);
                const healthValue = target[Ezgame.props.health];
                const maxHealth = object.layerData.maxHealth || 1;
                return {
                    ...object,
                    healthValue,
                    health: Math.ceil(healthValue / 255 * maxHealth),
                    maxHealth,
                    entityValue: target[Ezgame.props.entityValue]
                };
            }
            static player(target) {
                const entity = this.entity(target);
                return {
                    ...entity,
                    hat: target[Ezgame.props.hat],
                    isClown: entity.entityValue === 128,
                    currentItem: target[Ezgame.props.currentItem]
                };
            }
        }
        const TYPEOF = value => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
        const removeClass = (target, name) => {
            if (target instanceof HTMLElement) {
                target.classList.remove(name);
                return;
            }
            for (const element of target) {
                element.classList.remove(name);
            }
        };
        const removeChildren = target => {
            while (target.firstChild) {
                target.removeChild(target.firstChild);
            }
        };
        const formatCode = code => {
            code = code + "";
            if (code === "0") return "LBTN";
            if (code === "1") return "MBTN";
            if (code === "2") return "RBTN";
            if (code === "3") return "XBTN2";
            if (code === "4") return "XBTN1";
            if (code === "Escape") return "ESC";
            if (code === "BracketLeft") return "[";
            if (code === "BracketRight") return "]";
            if (code === "NumpadDivide") return "NUMDIV";
            if (code === "NumpadMultiply") return "NUMMULT";
            if (code === "NumpadSubtract") return "NUMSUB";
            if (code === "NumpadDecimal") return "NUMDEC";
            if (code === "CapsLock") return "CAPS";
            if (code === "PrintScreen") return "PRNT";
            if (code === "Backslash") return "\\";
            if (code === "Backquote") return "BQUOTE";
            if (code === "PageDown") return "PAGEDN";
            const NumpadDigitArrowKey = /^(?:Numpad|Digit|Arrow|Key)(\w+)$/;
            if (NumpadDigitArrowKey.test(code)) {
                code = code.replace(NumpadDigitArrowKey, "$1").replace(/Numpad/, "NUM");
            }
            const ExtraKeysRegex = /^(Control|Shift|Alt)(.).*/;
            if (ExtraKeysRegex.test(code)) {
                code = code.replace(ExtraKeysRegex, "$2$1").replace(/Control/, "CTRL");
            }
            return code.toUpperCase();
        };
        const contains = (target, name) => target.classList.contains(name);
        const isInput = target => {
            const element = target || document.activeElement || document.body;
            return [ "TEXTAREA", "INPUT" ].includes(element.tagName);
        };
        const random = (min, max) => {
            const isInteger = Number.isInteger(min) && Number.isInteger(max);
            if (isInteger) return Math.floor(Math.random() * (max - min + 1) + min);
            return Math.random() * (max - min) + min;
        };
        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
        const lerp = (start, stop, amt) => amt * (stop - start) + start;
        const sleep = ms => new Promise((resolve => setTimeout(resolve, ms)));
        const download = (data, filename) => {
            const blob = new Blob([ JSON.stringify(data, null, 4) ], {
                type: "application/json "
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = (filename || "settings") + ".txt";
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        };
        const GM = (property, value) => {
            if (!Ezgame.PRODUCTION) return true;
            try {
                return GM_info.script[property] === value;
            } catch (err) {
                return false;
            }
        };
        const fromCharCode = codes => codes.map((code => String.fromCharCode(code))).join("");
        const isBlind = () => !Settings.blindUsers.every((a => a === 1));
        const angle = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1);
        const formatAge = age => Math.floor(Math.log(1 + Math.max(0, age)) ** 2.4 / 13);
        const doWhile = (condition, callback, delay) => {
            if (!condition()) return;
            const interval = setInterval((() => {
                if (condition()) {
                    callback();
                } else {
                    clearInterval(interval);
                }
            }), delay);
        };
        const Common_define = (target, key, value) => {
            Object.defineProperty(target, key, {
                get: () => value,
                configurable: true
            });
        };
        const resetSkin = () => {
            const player = Ezgame.myPlayer.target;
            if (!player) return;
            delete player[Ezgame.props.skin];
            delete player[Ezgame.props.accessory];
            delete player[Ezgame.props.back];
        };
        const updateSkin = () => {
            if (!Settings.customSkins) return resetSkin();
            const player = Ezgame.myPlayer.target;
            if (!player) return;
            Common_define(player, Ezgame.props.skin, Settings.skin);
            Common_define(player, Ezgame.props.accessory, Settings.accessory);
            Common_define(player, Ezgame.props.back, Settings.back);
        };
        const Scale = {
            Default: {
                w: 1824,
                h: 1026
            },
            lerp: {
                w: 1824,
                h: 1026
            },
            current: {
                w: 1824,
                h: 1026
            }
        };
        const getMinScale = scale => {
            let w = Scale.Default.w;
            let h = Scale.Default.h;
            while (w > scale && h > scale) {
                w -= scale;
                h -= scale;
            }
            return {
                w,
                h
            };
        };
        const zoomHandler = () => {
            let wheels = 0;
            const scaleFactor = 150;
            window.addEventListener("wheel", (event => {
                if (!(event.target instanceof HTMLCanvasElement) || event.ctrlKey || event.shiftKey || event.altKey || isInput() || !controller.inGame) return;
                const {Default, current, lerp} = Scale;
                if (current.w === Default.w && current.h === Default.h && (wheels = (wheels + 1) % 5) !== 0) return;
                const {w, h} = getMinScale(scaleFactor);
                const zoom = !Settings.reverseZoom && event.deltaY > 0 || Settings.reverseZoom && event.deltaY < 0 ? -scaleFactor : scaleFactor;
                current.w = Math.max(w, current.w + zoom);
                current.h = Math.max(h, current.h + zoom);
                if (Settings.smoothZoom) return;
                lerp.w = current.w;
                lerp.h = current.h;
                window.dispatchEvent(new Event("resize"));
            }));
        };
        const modules_zoomHandler = zoomHandler;
        let context;
        let _clearRect;
        const toggleHook = () => {
            delete context.clearRect;
            if (!Settings.smoothZoom) return;
            context.clearRect = new Proxy(_clearRect, {
                apply(target, _this, args) {
                    target.apply(_this, args);
                    if (controller.inGame && Settings.smoothZoom) {
                        Scale.lerp.w = lerp(Scale.lerp.w, Scale.current.w, .18);
                        Scale.lerp.h = lerp(Scale.lerp.h, Scale.current.h, .18);
                        window.dispatchEvent(new Event("resize"));
                    }
                }
            });
        };
        HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, {
            apply(target, _this, args) {
                const ctx = target.apply(_this, args);
                if (_this.id === "game-canvas") {
                    context = ctx;
                    _clearRect = ctx.clearRect;
                    toggleHook();
                    HTMLCanvasElement.prototype.getContext = target;
                }
                return ctx;
            }
        });
        const skins = {
            skin: [ [ "Sploop Classic", 0, 0 ], [ "Yellow Classic", 1, 0 ], [ "Brown Classic", 2, 0 ], [ "Pink Classic", 3, 0 ], [ "Blue Classic", 4, 0 ], [ "Green Classic", 5, 0 ], [ "White Cat", 6, 100 ], [ "Ginger Cat", 7, 100 ], [ "Pit Bull", 8, 150 ], [ "Pig", 9, 100 ], [ "Crocodile", 10, 200 ], [ "Fox", 11, 200 ], [ "Panda", 12, 300 ], [ "Bear", 13, 300 ], [ "Penguin", 14, 300 ], [ "Cactus", 15, 400 ], [ "Strawberry", 16, 800 ], [ "Wolf", 17, 400 ], [ "Mammoth", 18, 2e3 ], [ "Golden Cow", 19, 3e3 ], [ "Shark", 20, 1e3 ], [ "Apple", 21, 200 ], [ "Stone", 22, 500 ], [ "Cave Stone", 23, 600 ], [ "Ice", 24, 700 ], [ "Gold", 25, 800 ], [ "Cow", 26, 350 ], [ "Dragon", 27, 5e3 ], [ "Black Ice", 28, 1e3 ], [ "Magma", 29, 1500 ], [ "Kawak", 30, 2500 ], [ "Snowman", 31, 400 ], [ "Elf", 32, 1e3 ], [ "Green Bauble", 33, 300 ], [ "Red Bauble", 34, 300 ], [ "Golden Bauble", 35, 800 ], [ "Duck", 36, 300 ], [ "Tornado", 37, 3e3 ], [ "Golden Beetle", 38, 1500 ] ],
            accessory: [ [ "None", 0, 0 ], [ "Mustache", 1, 100 ], [ "Sun Glasses", 2, 500 ], [ "Yellow Cap", 3, 0 ], [ "Blue Cap", 4, 0 ], [ "Purple Cap", 5, 0 ], [ "Green Cap", 6, 0 ], [ "Pink Bow", 7, 0 ], [ "3D Glasses", 8, 300 ], [ "Scar", 9, 150 ], [ "Turban", 10, 250 ], [ "Bandage", 11, 250 ], [ "Crazy Glasses", 12, 150 ], [ "Cow's Snout", 13, 300 ], [ "Carrot", 14, 150 ], [ "Horn", 15, 1e3 ], [ "Tusk", 16, 800 ], [ "Mammoth Hair", 17, 600 ], [ "Mammoth Ears", 18, 500 ], [ "Leaf", 19, 150 ], [ "Black Mustache", 20, 500 ], [ "Snowman Hat", 21, 1e3 ], [ "Blue Beanie", 22, 200 ], [ "Green Beanie", 23, 200 ], [ "Purple Beanie", 24, 200 ], [ "Orange Beanie", 25, 200 ], [ "Yellow Scarf", 26, 250 ], [ "Red Scarf", 27, 350 ], [ "Green Scarf", 28, 300 ], [ "Red Nose", 29, 400 ], [ "Mask", 30, 1e3 ], [ "Garlands", 31, 500 ] ],
            back: [ [ "None", 0, 0 ], [ "Mammoth Tail", 1, 500 ], [ "Dragon Wings", 2, 5e3 ], [ "Swords", 3, 2e3 ], [ "Blue Cape", 4, 400 ], [ "Christmas Cape", 5, 400 ], [ "Speedy Cape", 6, 400 ], [ "Garland", 7, 300 ], [ "Baby Elf", 8, 1500 ], [ "Gift", 9, 1e3 ], [ "Yellow Bag", 10, 300 ] ]
        };
        const Skins = skins;
        const createImage = src => {
            const img = new Image;
            img.src = src;
            return img;
        };
        const getURL = (type, id) => `${location.origin}/img/ui/${type}${id}.png`;
        const Images = {
            gaugeBackground: createImage("https://i.imgur.com/xincrX4.png"),
            gaugeFront: createImage("https://i.imgur.com/6AkHQM4.png"),
            discord: createImage("https://i.imgur.com/RcTl09i.png"),
            github: createImage("https://i.imgur.com/q0z20jB.png"),
            greasyfork: createImage("https://i.imgur.com/y6OYX0D.png")
        };
        const utils_Images = Images;
        const createMenu = () => {
            const IFRAME_CONTENT = `\n        <style>${styles}</style>\n        <div id="menu-container" class="open">\n            <div id="menu-wrapper">\n                ${Header}\n\n                <main>\n                    ${Navbar}\n\n                    <div id="menu-page-container">\n                        ${Keybinds}\n                        ${Combat}\n                        ${Visuals}\n                        ${Misc}\n                        ${Credits}\n                    </div>\n                </main>\n            </div>\n        </div>\n    `;
            const IFRAME_STYLE = `\n        #iframe-page-container {\n            position: absolute;\n            top: 0;\n            left: 0;\n            bottom: 0;\n            right: 0;\n            width: 100%;\n            height: 100%;\n            margin: 0;\n            padding: 0;\n            z-index: 99;\n            border: none;\n            outline: none;\n            overflow: scroll;\n            display: none;\n        }\n\n        .iframe-opened {\n            display: block!important;\n        }\n\n        #main-content {\n            background: none;\n        }\n\n        #game-content {\n            justify-content: center;\n        }\n    `;
            const IFRAME = document.createElement("iframe");
            const blob = new Blob([ IFRAME_CONTENT ], {
                type: "text/html; charset=utf-8"
            });
            IFRAME.src = URL.createObjectURL(blob);
            IFRAME.id = "iframe-page-container";
            document.body.appendChild(IFRAME);
            const style = document.createElement("style");
            style.innerHTML = IFRAME_STYLE;
            document.head.appendChild(style);
            IFRAME.onload = () => {
                const iframeWindow = IFRAME.contentWindow;
                const iframeDocument = iframeWindow.document;
                URL.revokeObjectURL(IFRAME.src);
                const menuContainer = iframeDocument.getElementById("menu-container");
                const menuWrapper = iframeDocument.getElementById("menu-wrapper");
                const openMenu = iframeDocument.querySelectorAll(".open-menu");
                const menuPage = iframeDocument.querySelectorAll(".menu-page");
                const sections = iframeDocument.querySelectorAll(".section");
                const hotkeyInputs = iframeDocument.querySelectorAll(".section-option-hotkeyInput[id]");
                const closeMenu = iframeDocument.querySelector("#close-menu");
                const checkboxs = iframeDocument.querySelectorAll("input[type='checkbox'][id]");
                const sliders = iframeDocument.querySelectorAll("input[type='range'][id]");
                const headerVersion = iframeDocument.querySelector("#version > span");
                const autochatInputs = iframeDocument.querySelectorAll(".input.autochat");
                const killMessage = iframeDocument.querySelector("#killMessage");
                const resetSettings = iframeDocument.querySelector("#reset-settings");
                const downloadSettings = iframeDocument.querySelector("#download-settings");
                const uploadSettings = iframeDocument.querySelector("#upload-settings");
                const menuTransparency = iframeDocument.querySelector("#menuTransparency");
                const colorPickers = iframeDocument.querySelectorAll("input[type='color'][id]");
                const selects = iframeDocument.querySelectorAll("select[id]");
                const buttonPopups = iframeDocument.querySelectorAll("button[data-type='popup'][data-id]");
                let popupCount = 0;
                const popups = [ {
                    index: 0,
                    title: "Discord",
                    description: "Join our community!",
                    link: "https://discord.gg/sG9cyfGPj5",
                    prev: "https://i.imgur.com/DuLtryo.png"
                }, {
                    index: 1,
                    title: "Github",
                    description: "Star a repository!",
                    link: "https://github.com/Murka007/Ezgame-client",
                    prev: "https://i.imgur.com/u4aX4G1.png"
                }, {
                    index: 2,
                    title: "Greasyfork",
                    description: "Write a feedback!",
                    link: "https://greasyfork.org/en/scripts/449995-Ezgame-client-sploop-io/feedback#post-discussion",
                    prev: "https://i.imgur.com/L1YP7cK.png"
                } ];
                const pickPopup = () => {
                    const pups = popups.filter(((popup, index) => Settings.blindUsers[index] === 0));
                    if (pups.length) {
                        const popup = pups[popupCount++];
                        popupCount %= pups.length;
                        return popup;
                    }
                    return null;
                };
                const fadeOut = "transition: all 150ms ease 0s; transform: scale(0); opacity: 0;";
                let popupOpened = false;
                const createPopup = () => {
                    if (popupOpened) return;
                    const popup = pickPopup();
                    if (!popup) return;
                    popupOpened = true;
                    const div = document.createElement("div");
                    div.innerHTML = `\n                <div id="popup-menu">\n                    <div id="popup-container">\n                        <div id="image-background" class="${popup.title.toLowerCase()}-bg"></div>\n\n                        <div id="popup-wrapper">\n                            <div id="popup-data">\n                                <div id="popup-title">${popup.title}</div>\n                                <div id="popup-description">${popup.description}</div>\n\n                                <div id="popup-bottom">\n                                    <a id="popup-continue" class="popup-button" href="${popup.link}" target="_blank">CONTINUE</a>\n                                    <button id="popup-close" class="popup-button">CLOSE</button>\n                                </div>\n                            </div>\n\n                            <div id="popup-prev">\n                                <img src="${popup.prev}"></img>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            `;
                    const popupMenu = div.querySelector("#popup-menu");
                    const container = div.querySelector("#popup-container");
                    const continuePopup = div.querySelector("#popup-continue");
                    const closePopup = div.querySelector("#popup-close");
                    continuePopup.onclick = () => {
                        popupCount -= 1;
                        Settings.blindUsers[popup.index] = 1;
                        Storage.set("Ezgame-settings", Settings);
                    };
                    closePopup.onclick = () => {
                        container.style.cssText = fadeOut;
                        setTimeout((() => {
                            popupMenu.remove();
                            popupOpened = false;
                        }), 150);
                    };
                    menuWrapper.appendChild(popupMenu);
                };
                const update = () => {
                    updateSkin();
                    for (const button of buttonPopups) {
                        const type = button.getAttribute("data-id");
                        const img = button.previousElementSibling;
                        if (img) {
                            img.src = getURL(type, Settings[type]);
                        }
                        button.onclick = () => {
                            const div = document.createElement("div");
                            div.innerHTML = `\n                        <div id="popup-menu">\n                            <div id="popup-container" style="height: 70%">\n                                <svg\n                                    id="close-popup"\n                                    class="icon"\n                                    xmlns="http://www.w3.org/2000/svg"\n                                    viewBox="0 0 30 30"\n                                    width="30px" height="30px"\n                                >\n                                    <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/>\n                                </svg>\n                                <div id="popup-wrapper">\n                                    <div id="popup-content">\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    `;
                            const popupMenu = div.querySelector("#popup-menu");
                            const container = div.querySelector("#popup-container");
                            const popupContent = div.querySelector("#popup-content");
                            const closePopup = div.querySelector("#close-popup");
                            const close = () => {
                                container.style.cssText = fadeOut;
                                setTimeout((() => {
                                    popupMenu.remove();
                                }), 150);
                            };
                            for (const skin of Skins[type]) {
                                const div = document.createElement("div");
                                const url = getURL(type, skin[1]);
                                div.innerHTML = `\n                            <div class="img-prev">\n                                <img src="${url}">\n                            </div>\n                        `;
                                const setURL = () => {
                                    if (!img) return;
                                    img.src = url;
                                    Settings[type] = skin[1];
                                    Storage.set("Ezgame-settings", Settings);
                                    close();
                                    updateSkin();
                                };
                                const imgPrev = div.querySelector(".img-prev");
                                imgPrev.onclick = setURL;
                                closePopup.onclick = close;
                                popupContent.appendChild(imgPrev);
                            }
                            menuWrapper.appendChild(popupMenu);
                        };
                    }
                    for (const select of selects) {
                        removeChildren(select);
                        const data = selectData[select.id];
                        for (const key in data) {
                            if (!isNaN(Number(key))) continue;
                            const keyValue = key;
                            const option = document.createElement("option");
                            option.value = data[keyValue];
                            option.textContent = keyValue;
                            if (data[keyValue] === Settings[select.id]) {
                                option.selected = true;
                                option.defaultSelected = true;
                            }
                            select.appendChild(option);
                        }
                        select.onchange = () => {
                            const dataValue = /^\d+$/.test(String(select.value)) ? Number(select.value) : select.value;
                            Settings[select.id] = dataValue;
                            if (select.id === "placementType" && dataValue === PlacementType.DEFAULT) {
                                Settings.autoheal = false;
                                Settings.autoboostFollow = false;
                                update();
                            }
                            Storage.set("Ezgame-settings", Settings);
                        };
                    }
                    for (const picker of colorPickers) {
                        const resetColor = picker.previousElementSibling;
                        if (resetColor) {
                            const defaultColor = defaultSettings[picker.id];
                            resetColor.style.backgroundColor = defaultColor;
                            resetColor.onclick = () => {
                                picker.value = defaultColor;
                                Settings[picker.id] = defaultColor;
                                Storage.set("Ezgame-settings", Settings);
                            };
                        }
                        picker.value = Settings[picker.id];
                        picker.onchange = () => {
                            Settings[picker.id] = picker.value;
                            Storage.set("Ezgame-settings", Settings);
                            picker.blur();
                        };
                    }
                    menuContainer.classList[Settings.menuTransparency ? "add" : "remove"]("transparent");
                    killMessage.value = Settings.killMessage;
                    killMessage.onchange = () => {
                        Settings.killMessage = killMessage.value;
                        Storage.set("Ezgame-settings", Settings);
                        killMessage.blur();
                    };
                    for (let i = 0; i < autochatInputs.length; i++) {
                        const input = autochatInputs[i];
                        input.value = Settings.autochatMessages[i] || "";
                        input.onchange = () => {
                            Settings.autochatMessages[i] = input.value;
                            Storage.set("Ezgame-settings", Settings);
                            input.blur();
                        };
                    }
                    headerVersion.textContent = "v" + Ezgame.version;
                    for (const slider of sliders) {
                        const sliderValue = slider.nextElementSibling;
                        slider.value = Settings[slider.id];
                        if (sliderValue) {
                            sliderValue.textContent = slider.value;
                        }
                        slider.oninput = () => {
                            const value = Number(slider.value) % 5;
                            slider.value -= value;
                            if (sliderValue) {
                                sliderValue.textContent = slider.value;
                            }
                            Settings[slider.id] = Number(slider.value);
                            Storage.set("Ezgame-settings", Settings);
                        };
                    }
                    for (const checkbox of checkboxs) {
                        checkbox.checked = Settings[checkbox.id];
                        checkbox.onchange = () => {
                            Settings[checkbox.id] = checkbox.checked;
                            if (checkbox.id === "smoothZoom") {
                                toggleHook();
                            } else if (checkbox.id === "customSkins") {
                                if (checkbox.checked) {
                                    updateSkin();
                                } else {
                                    resetSkin();
                                }
                            }
                            Storage.set("Ezgame-settings", Settings);
                            checkbox.blur();
                        };
                    }
                    let popupCount = 0;
                    Ezgame.toggleMenu = () => {
                        menuContainer.classList.toggle("close");
                        if (menuContainer.classList.toggle("open") && !popupOpened) {
                            popupCount += 1;
                            if ((popupCount %= 5) === 0) {
                                createPopup();
                            }
                        }
                        setTimeout((() => {
                            IFRAME.classList.toggle("iframe-opened");
                        }), 100);
                    };
                    closeMenu.onclick = Ezgame.toggleMenu;
                    for (let i = 0; i < openMenu.length; i++) {
                        openMenu[i].onclick = () => {
                            removeClass(openMenu, "active");
                            openMenu[i].classList.add("active");
                            removeClass(menuPage, "opened");
                            menuPage[i].classList.add("opened");
                        };
                    }
                    for (const section of sections) {
                        const title = section.children[0];
                        const content = section.children[1];
                        if (!title || !content) continue;
                        if (contains(section, "opened")) {
                            content.classList.add("opened");
                            continue;
                        }
                        content.style.display = "none";
                        title.onclick = () => {
                            if (!content.classList.contains("opened")) {
                                content.style.display = "grid";
                            } else {
                                setTimeout((() => {
                                    content.style.display = "none";
                                }), 100);
                            }
                            setTimeout((() => {
                                content.classList.toggle("opened");
                                title.children[1].classList.toggle("rotate");
                            }), 0);
                        };
                    }
                    for (const hotkeyInput of hotkeyInputs) {
                        try {
                            hotkeyInput.textContent = formatCode(Settings[hotkeyInput.id]);
                        } catch (err) {
                            throw new Error(hotkeyInput.id + " doesn't exist in settings");
                        }
                    }
                    checkForRepeats();
                };
                menuTransparency.addEventListener("change", (() => {
                    menuContainer.classList[menuTransparency.checked ? "add" : "remove"]("transparent");
                }));
                resetSettings.onclick = () => {
                    Object.assign(Settings, defaultSettings);
                    Storage.set("Ezgame-settings", Settings);
                    update();
                };
                downloadSettings.onclick = () => {
                    download(Settings, "EzgameSettings" + Ezgame.version);
                };
                uploadSettings.onchange = async event => {
                    const target = event.target;
                    const parent = uploadSettings.parentElement;
                    const spanText = parent.children[1];
                    parent.classList.remove("red");
                    parent.classList.remove("green");
                    try {
                        const text = await target.files[0].text();
                        const sets = JSON.parse(text);
                        if (Object.keys(sets).every((key => defaultSettings.hasOwnProperty(key)))) {
                            Object.assign(Settings, sets);
                            Storage.set("Ezgame-settings", Settings);
                            update();
                            parent.classList.add("green");
                            spanText.innerHTML = `SETTINGS LOADED SUCCESSFULLY`;
                        } else {
                            throw new Error("Invalid settings");
                        }
                    } catch (err) {
                        parent.classList.add("red");
                        spanText.innerHTML = "SETTINGS ARE NOT VALID, TRY ANOTHER";
                    }
                };
                const checkForRepeats = () => {
                    const list = new Map;
                    for (const hotkeyInput of hotkeyInputs) {
                        const value = Settings[hotkeyInput.id];
                        const [count, inputs] = list.get(value) || [ 0, [] ];
                        list.set(value, [ (count || 0) + 1, [ ...inputs, hotkeyInput ] ]);
                        hotkeyInput.classList.remove("red");
                    }
                    for (const data of list) {
                        const [number, hotkeyInputs] = data[1];
                        if (number === 1) continue;
                        for (const hotkeyInput of hotkeyInputs) {
                            hotkeyInput.classList.add("red");
                        }
                    }
                };
                Ezgame.active = null;
                const applyCode = code => {
                    if (!Ezgame.active) return;
                    const key = code === "Backspace" ? "..." : formatCode(code);
                    Settings[Ezgame.active.id] = code === "Backspace" ? "..." : code;
                    Ezgame.active.textContent = key;
                    Storage.set("Ezgame-settings", Settings);
                    Ezgame.active = null;
                    checkForRepeats();
                };
                menuContainer.addEventListener("keyup", (event => {
                    if (event.keyCode < 5 || !Ezgame.active) return;
                    applyCode(event.code);
                }));
                menuContainer.addEventListener("mouseup", (event => {
                    const target = event.target;
                    if (Ezgame.active) return applyCode(event.button);
                    if (!contains(target, "section-option-hotkeyInput") || !target.id) return;
                    target.textContent = "Wait...";
                    Ezgame.active = target;
                }));
                iframeWindow.addEventListener("keydown", (event => controller.handleKeydown(event, event.code)));
                iframeWindow.addEventListener("keyup", (event => controller.handleKeyup(event, event.code)));
                const resize = () => {
                    const width = window.innerWidth;
                    const height = window.innerHeight;
                    const scale = Math.min(1, Math.min(width / 1024, height / 700));
                    menuContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
                };
                resize();
                window.addEventListener("resize", resize);
                setTimeout((() => IFRAME.classList.add("iframe-opened")), 0);
                iframeWindow.addEventListener("contextmenu", (event => event.preventDefault()));
                iframeWindow.addEventListener("mousedown", (event => 1 === event.button && event.preventDefault()));
                iframeWindow.addEventListener("mouseup", (event => [ 3, 4 ].includes(event.button) && event.preventDefault()));
                window.addEventListener("mouseup", (event => [ 3, 4 ].includes(event.button) && event.preventDefault()));
                update();
            };
        };
        const modules_createMenu = createMenu;
        var Hat;
        (function(Hat) {
            Hat[Hat["UNEQUIP"] = 0] = "UNEQUIP";
            Hat[Hat["BUSH"] = 1] = "BUSH";
            Hat[Hat["BERSERKER"] = 2] = "BERSERKER";
            Hat[Hat["JUNGLE"] = 3] = "JUNGLE";
            Hat[Hat["CRYSTAL"] = 4] = "CRYSTAL";
            Hat[Hat["SPIKEGEAR"] = 5] = "SPIKEGEAR";
            Hat[Hat["IMMUNITY"] = 6] = "IMMUNITY";
            Hat[Hat["BOOST"] = 7] = "BOOST";
            Hat[Hat["APPLEHAT"] = 8] = "APPLEHAT";
            Hat[Hat["SCUBA"] = 9] = "SCUBA";
            Hat[Hat["HOOD"] = 10] = "HOOD";
            Hat[Hat["DEMOLIST"] = 11] = "DEMOLIST";
        })(Hat || (Hat = {}));
        const Hats = [ {
            bought: true,
            equipped: true,
            default: true,
            price: 0
        }, {
            image: 109,
            price: 250,
            axisY: 0,
            description: "Become a bush",
            name: "Bush Hat",
            bought: false,
            equipped: false,
            rs: true
        }, {
            image: 41,
            price: 5e3,
            description: "Increased melee damage",
            axisY: 10,
            cs: 1.25,
            speed: .85,
            name: "Berserker Gear",
            bought: false,
            equipped: false
        }, {
            image: 44,
            price: 3e3,
            description: "Regenerate health",
            axisY: 13,
            hs: 25,
            name: "Jungle Gear",
            bought: false,
            equipped: false
        }, {
            image: 45,
            price: 5e3,
            description: "Receive reduced damage",
            axisY: 10,
            reduceDmg: .75,
            speed: .95,
            name: "Crystal Gear",
            bought: false,
            equipped: false
        }, {
            image: 48,
            price: 1e3,
            description: "Attacker's receive damage",
            axisY: 10,
            reflect: .45,
            name: "Spike Gear",
            bought: false,
            equipped: false
        }, {
            image: 49,
            price: 4e3,
            description: "Gain more health",
            axisY: 15,
            ls: 150,
            reduceDmg: .75,
            name: "Immunity Gear",
            bought: false,
            equipped: false
        }, {
            image: 50,
            price: 1500,
            description: "Move quicker",
            axisY: 23,
            speed: 1.23,
            name: "Boost Hat",
            bought: false,
            equipped: false
        }, {
            image: 93,
            price: 150,
            description: "Apples become more succulent",
            axisY: 5,
            speed: 1.05,
            name: "Apple hat",
            bought: false,
            equipped: false
        }, {
            image: 121,
            price: 4e3,
            description: "Move fast in ocean",
            axisY: 5,
            speed: .75,
            river: 1.5,
            name: "Scuba Gear",
            bought: false,
            equipped: false
        }, {
            image: 126,
            price: 3500,
            description: "Become invisible when still",
            axisY: 5,
            name: "Hood",
            bought: false,
            equipped: false,
            rs: true
        }, {
            image: 197,
            price: 4e3,
            description: "Destroy buildings faster",
            axisY: 10,
            name: "Demolist",
            bought: false,
            equipped: false,
            speed: .3
        } ];
        var EWeapons;
        (function(EWeapons) {
            EWeapons[EWeapons["TOOL_HAMMER"] = 0] = "TOOL_HAMMER";
            EWeapons[EWeapons["STONE_SWORD"] = 1] = "STONE_SWORD";
            EWeapons[EWeapons["STONE_SPEAR"] = 2] = "STONE_SPEAR";
            EWeapons[EWeapons["STONE_AXE"] = 3] = "STONE_AXE";
            EWeapons[EWeapons["MUSKET"] = 4] = "MUSKET";
            EWeapons[EWeapons["SHIELD"] = 11] = "SHIELD";
            EWeapons[EWeapons["STICK"] = 13] = "STICK";
            EWeapons[EWeapons["HAMMER"] = 15] = "HAMMER";
            EWeapons[EWeapons["KATANA"] = 17] = "KATANA";
            EWeapons[EWeapons["BOW"] = 26] = "BOW";
            EWeapons[EWeapons["XBOW"] = 27] = "XBOW";
            EWeapons[EWeapons["NAGINATA"] = 28] = "NAGINATA";
            EWeapons[EWeapons["GREAT_AXE"] = 30] = "GREAT_AXE";
            EWeapons[EWeapons["BAT"] = 31] = "BAT";
            EWeapons[EWeapons["PEARL"] = 50] = "PEARL";
            EWeapons[EWeapons["SCYTHE"] = 57] = "SCYTHE";
        })(EWeapons || (EWeapons = {}));
        var ActionType;
        (function(ActionType) {
            ActionType[ActionType["MELEE"] = 0] = "MELEE";
            ActionType[ActionType["RANGED"] = 1] = "RANGED";
            ActionType[ActionType["PLACEABLE"] = 2] = "PLACEABLE";
            ActionType[ActionType["EATABLE"] = 3] = "EATABLE";
        })(ActionType || (ActionType = {}));
        var ItemType;
        (function(ItemType) {
            ItemType[ItemType["PRIMARY"] = 0] = "PRIMARY";
            ItemType[ItemType["SECONDARY"] = 1] = "SECONDARY";
            ItemType[ItemType["FOOD"] = 2] = "FOOD";
            ItemType[ItemType["WALL"] = 3] = "WALL";
            ItemType[ItemType["SPIKE"] = 4] = "SPIKE";
            ItemType[ItemType["WINDMILL"] = 5] = "WINDMILL";
            ItemType[ItemType["FARM"] = 6] = "FARM";
            ItemType[ItemType["TRAP"] = 7] = "TRAP";
            ItemType[ItemType["PLATFORM"] = 8] = "PLATFORM";
            ItemType[ItemType["SPAWN"] = 9] = "SPAWN";
            ItemType[ItemType["TURRET"] = 10] = "TURRET";
        })(ItemType || (ItemType = {}));
        var upgradeType;
        (function(upgradeType) {
            upgradeType[upgradeType["STONE"] = 1] = "STONE";
            upgradeType[upgradeType["GOLD"] = 2] = "GOLD";
            upgradeType[upgradeType["DIAMOND"] = 3] = "DIAMOND";
            upgradeType[upgradeType["RUBY"] = 4] = "RUBY";
        })(upgradeType || (upgradeType = {}));
        const ItemData = [ {
            id: EWeapons.TOOL_HAMMER,
            gs: 46,
            upgradeType: upgradeType.STONE,
            imageinv: 29,
            image: 25,
            name: "Tool Hammer",
            description: "Gather materials",
            range: 80,
            itemType: ItemType.PRIMARY,
            damage: 25,
            reload: 300,
            _s: 30,
            Ms: 200,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -3.5,
            os: 1
        }, {
            id: EWeapons.STONE_SWORD,
            ks: 1,
            ys: 2,
            imageinv: 28,
            image: 24,
            name: "Stone Sword",
            description: "Sharp and pointy",
            range: 135,
            Ms: 250,
            itemType: ItemType.PRIMARY,
            damage: 35,
            reload: 300,
            Us: .85,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -8,
            os: -4
        }, {
            id: EWeapons.STONE_SPEAR,
            gs: 39,
            upgradeType: upgradeType.STONE,
            ks: 1,
            ys: 4,
            imageinv: 31,
            image: 26,
            name: "Stone Spear",
            description: "Long melee range",
            range: 160,
            itemType: ItemType.PRIMARY,
            damage: 49,
            Us: .81,
            Ms: 450,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: 2
        }, {
            id: EWeapons.STONE_AXE,
            gs: 33,
            upgradeType: upgradeType.STONE,
            ks: 1,
            ys: 128,
            imageinv: 32,
            image: 35,
            name: "Stone Axe",
            description: "Gathers materials faster",
            range: 90,
            itemType: ItemType.PRIMARY,
            damage: 30,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -2,
            os: 2,
            Es: 2,
            Cs: 2,
            Bs: 2,
            zs: 2
        }, {
            id: EWeapons.MUSKET,
            cost: {
                food: 0,
                wood: 0,
                stone: 10,
                gold: 0
            },
            ks: 16,
            xs: 2,
            ys: 8,
            imageinv: 30,
            image: 27,
            name: "Stone Musket",
            description: "Deal Long Range Damage",
            range: 1e3,
            itemType: ItemType.SECONDARY,
            damage: 49,
            reload: 1500,
            projectile: 17,
            Ls: 1500,
            actionType: ActionType.RANGED,
            ps: 1,
            Us: .63,
            As: 0,
            os: 0
        }, {
            id: 5,
            cost: {
                food: 0,
                wood: 10,
                stone: 0,
                gold: 0
            },
            imageinv: 33,
            image: 103,
            name: "Wood Wall",
            description: "A sturdy wall",
            itemType: ItemType.WALL,
            actionType: ActionType.PLACEABLE,
            Hs: 5,
            As: 0,
            os: 15,
            layer: ELayer.WOODWALL,
            ps: 2
        }, {
            id: 6,
            cost: {
                food: 0,
                wood: 5,
                stone: 20,
                gold: 0
            },
            ks: 1,
            ys: 512,
            imageinv: 36,
            image: 106,
            name: "Boost",
            description: "Provides a thrust",
            itemType: ItemType.TRAP,
            actionType: ActionType.PLACEABLE,
            Hs: -5,
            As: 0,
            os: 3,
            layer: ELayer.BOOST,
            ps: 2
        }, {
            id: 7,
            cost: {
                food: 0,
                wood: 20,
                stone: 5,
                gold: 0
            },
            imageinv: 37,
            image: 104,
            name: "Spike",
            description: "Sharp defence",
            itemType: ItemType.SPIKE,
            actionType: ActionType.PLACEABLE,
            Hs: 2,
            As: 0,
            os: 15,
            layer: ELayer.SPIKE,
            ps: 2
        }, {
            id: 8,
            cost: {
                food: 0,
                wood: 20,
                stone: 0,
                gold: 0
            },
            ks: 1,
            imageinv: 38,
            image: 114,
            name: "Platform",
            description: "Shoot over structures",
            itemType: ItemType.PLATFORM,
            actionType: ActionType.PLACEABLE,
            Hs: -2,
            As: 0,
            os: 8,
            layer: ELayer.PLATFORM,
            ps: 2
        }, {
            id: 9,
            cost: {
                food: 0,
                wood: 30,
                stone: 30,
                gold: 0
            },
            ks: 1,
            ys: 1024,
            imageinv: 39,
            image: 107,
            name: "Trap",
            description: "Snared enemies are stuck",
            itemType: ItemType.TRAP,
            actionType: ActionType.PLACEABLE,
            Hs: 2,
            As: 0,
            os: 26,
            layer: ELayer.TRAP,
            ps: 2
        }, {
            id: 10,
            cost: {
                food: 10,
                wood: 0,
                stone: 0,
                gold: 0
            },
            imageinv: 43,
            image: 42,
            name: "Apple",
            description: "Heals you",
            itemType: ItemType.FOOD,
            actionType: ActionType.EATABLE,
            restore: 20,
            As: 0,
            os: 22,
            ps: 2
        }, {
            id: EWeapons.SHIELD,
            ks: 1,
            ys: 256,
            imageinv: 47,
            image: 46,
            name: "Shield",
            description: "Reduces damage",
            itemType: ItemType.SECONDARY,
            actionType: ActionType.MELEE,
            Us: .7,
            shieldAngle: .75,
            range: 55,
            Ms: 350,
            damage: 15,
            _s: 40,
            reload: 500,
            As: -15,
            os: 10,
            ps: 3
        }, {
            id: 12,
            cost: {
                food: 15,
                wood: 0,
                stone: 0,
                gold: 0
            },
            ks: 1,
            ys: 64,
            imageinv: 52,
            image: 51,
            name: "Cookie",
            description: "Heals you",
            itemType: ItemType.FOOD,
            actionType: ActionType.EATABLE,
            restore: 35,
            As: 0,
            os: 22,
            ps: 2
        }, {
            id: EWeapons.STICK,
            gs: 41,
            upgradeType: upgradeType.STONE,
            ks: 1,
            ys: 32,
            imageinv: 55,
            image: 54,
            name: "Stick",
            description: "Gathers resources quickly",
            range: 100,
            itemType: ItemType.PRIMARY,
            damage: 1,
            reload: 400,
            actionType: ActionType.MELEE,
            Ms: 60,
            ps: 0,
            As: 4,
            os: 0,
            Es: 7,
            Cs: 7,
            Bs: 7,
            zs: 4
        }, {
            id: 14,
            cost: {
                food: 0,
                wood: 50,
                stone: 10,
                gold: 0
            },
            imageinv: 57,
            image: 61,
            name: "Windmill",
            description: "Generates score over time",
            itemType: ItemType.WINDMILL,
            actionType: ActionType.PLACEABLE,
            rotateSpeed: Math.PI / 4,
            Hs: -5,
            As: 0,
            os: 38,
            layer: ELayer.WINDMILL,
            ps: 2
        }, {
            id: EWeapons.HAMMER,
            ks: 1,
            ys: 1,
            imageinv: 63,
            image: 62,
            name: "Hammer",
            description: "Breaks structures faster",
            range: 80,
            itemType: ItemType.SECONDARY,
            damage: 12,
            _s: 76,
            Us: .89,
            Ms: 200,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 5,
            os: 2
        }, {
            id: 16,
            ks: 1,
            ys: 1,
            cost: {
                food: 0,
                wood: 200,
                stone: 200,
                gold: 200
            },
            imageinv: 65,
            image: 115,
            name: "Cosy Bed",
            description: "Respawn at the bed",
            itemType: ItemType.SPAWN,
            actionType: ActionType.PLACEABLE,
            Hs: 8,
            As: 0,
            os: 25,
            layer: ELayer.SPAWN,
            ps: 2
        }, {
            id: EWeapons.KATANA,
            gs: 37,
            upgradeType: upgradeType.STONE,
            ks: 2,
            ys: 2,
            imageinv: 68,
            image: 67,
            name: "Katana",
            description: "Excellent melee weapon",
            range: 140,
            Ms: 150,
            itemType: ItemType.PRIMARY,
            damage: 40,
            reload: 300,
            Us: .85,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 1,
            os: 3
        }, {
            id: 18,
            cost: {
                food: 0,
                wood: 30,
                stone: 30,
                gold: 0
            },
            ks: 160,
            ys: 1,
            imageinv: 69,
            image: 113,
            name: "Castle Spike",
            description: "Great for bases",
            itemType: ItemType.SPIKE,
            actionType: ActionType.PLACEABLE,
            damage: {
                hit: 24,
                touch: 5
            },
            Hs: -8,
            As: 0,
            os: 14,
            layer: ELayer.CASTLESPIKE,
            ps: 2
        }, {
            id: 19,
            cost: {
                food: 0,
                wood: 100,
                stone: 50,
                gold: 0
            },
            ks: 1,
            ys: 1,
            imageinv: 57,
            image: 61,
            name: "Powermill",
            description: "Generates more score over time",
            itemType: ItemType.WINDMILL,
            actionType: ActionType.PLACEABLE,
            rotateSpeed: Math.PI / 2,
            Hs: 5,
            As: 0,
            os: 38,
            layer: ELayer.POWERMILL,
            ps: 2
        }, {
            id: 20,
            ks: 1,
            ys: 1,
            cost: {
                food: 0,
                wood: 30,
                stone: 10,
                gold: 0
            },
            imageinv: 73,
            image: 112,
            name: "Hard Spike",
            description: "Sharper defence",
            itemType: ItemType.SPIKE,
            actionType: ActionType.PLACEABLE,
            Hs: 2,
            As: 0,
            os: 15,
            layer: ELayer.HARDSPIKE,
            ps: 2
        }, {
            id: 21,
            cost: {
                food: 0,
                wood: 200,
                stone: 150,
                gold: 10
            },
            ks: 1,
            ys: 1,
            imageinv: 77,
            image: 74,
            name: "Turret",
            description: "Defence for your base",
            itemType: ItemType.TURRET,
            actionType: ActionType.PLACEABLE,
            Hs: 6,
            As: 0,
            os: 25,
            layer: ELayer.TURRET,
            ps: 2
        }, {
            id: 22,
            ks: 1,
            ys: 1,
            cost: {
                food: 0,
                wood: 200,
                stone: 0,
                gold: 0
            },
            imageinv: 78,
            image: 110,
            name: "Cherry wood farm",
            description: "Used for decoration and wood",
            itemType: ItemType.FARM,
            actionType: ActionType.PLACEABLE,
            Hs: 3,
            As: 0,
            os: 47,
            layer: ELayer.CHERRYWOODFARM,
            ps: 2
        }, {
            id: 23,
            ks: 1,
            ys: 1,
            cost: {
                food: 0,
                wood: 200,
                stone: 0,
                gold: 0
            },
            imageinv: 80,
            image: 111,
            name: "Wood farm",
            description: "Used for decoration and wood",
            itemType: ItemType.FARM,
            actionType: ActionType.PLACEABLE,
            Hs: 3,
            As: 0,
            os: 47,
            layer: ELayer.WOODFARM,
            ps: 2
        }, {
            id: 24,
            ks: 1,
            ys: 1,
            cost: {
                food: 200,
                wood: 0,
                stone: 0,
                gold: 0
            },
            imageinv: 85,
            image: 109,
            name: "Berry farm",
            description: "Used for decoration and berries",
            itemType: ItemType.FARM,
            actionType: ActionType.PLACEABLE,
            Hs: 3,
            As: 0,
            os: 17,
            layer: ELayer.BUSH,
            ps: 2
        }, {
            id: 25,
            ks: 1,
            ys: 1,
            cost: {
                food: 0,
                wood: 0,
                stone: 200,
                gold: 0
            },
            imageinv: 83,
            image: 108,
            name: "Stone farm",
            description: "Used for decoration and stone",
            itemType: ItemType.FARM,
            actionType: ActionType.PLACEABLE,
            Hs: 3,
            As: 0,
            os: 20,
            layer: ELayer.STONEWARM,
            ps: 2
        }, {
            id: EWeapons.BOW,
            cost: {
                food: 0,
                wood: 4,
                stone: 0,
                gold: 0
            },
            ks: 1,
            ys: 16,
            imageinv: 86,
            image: 87,
            name: "Bow",
            description: "Deal Long Range Damage",
            range: 800,
            itemType: ItemType.SECONDARY,
            damage: 25,
            reload: 600,
            projectile: 88,
            Ls: 1200,
            actionType: ActionType.RANGED,
            ps: 1,
            Us: .75,
            As: 0,
            os: 35
        }, {
            id: EWeapons.XBOW,
            cost: {
                food: 0,
                wood: 10,
                stone: 0,
                gold: 0
            },
            ks: 16,
            ys: 176,
            imageinv: 90,
            image: 91,
            name: "XBow",
            description: "Rapid fire bow",
            range: 800,
            itemType: ItemType.SECONDARY,
            damage: 27,
            reload: 235,
            projectile: 88,
            Ls: 1200,
            actionType: ActionType.RANGED,
            ps: 1,
            Us: .35,
            As: 0,
            os: 30
        }, {
            id: EWeapons.NAGINATA,
            gs: 45,
            upgradeType: upgradeType.STONE,
            ks: 4,
            ys: 4,
            imageinv: 100,
            image: 99,
            name: "Naginata",
            description: "Long melee range",
            range: 165,
            itemType: ItemType.PRIMARY,
            damage: 52,
            Us: .81,
            Ms: 470,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: -4
        }, {
            id: 29,
            cost: {
                food: 0,
                wood: 0,
                stone: 35,
                gold: 10
            },
            ks: 1,
            ys: 1,
            imageinv: 101,
            image: 105,
            name: "Castle Wall",
            description: "A very sturdy wall",
            itemType: ItemType.WALL,
            actionType: ActionType.PLACEABLE,
            Hs: 8,
            As: 0,
            os: 13,
            layer: ELayer.CASTLEWALL,
            ps: 2
        }, {
            id: EWeapons.GREAT_AXE,
            gs: 35,
            upgradeType: upgradeType.STONE,
            ks: 128,
            ys: 128,
            imageinv: 117,
            image: 116,
            name: "Great Axe",
            description: "More powerful axe.",
            range: 94,
            itemType: ItemType.PRIMARY,
            damage: 37,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 4,
            os: 2,
            Es: 4,
            Cs: 4,
            Bs: 4,
            zs: 2
        }, {
            id: EWeapons.BAT,
            ks: 1,
            ys: 2048,
            imageinv: 128,
            image: 127,
            name: "Bat",
            description: "Hit enemies for a home run",
            range: 115,
            itemType: ItemType.PRIMARY,
            damage: 28,
            Us: .92,
            Ms: 870,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 10,
            os: 2
        }, {
            id: 32,
            ks: 1,
            ys: 128,
            imageinv: 131,
            image: 130,
            name: "Diamond Axe",
            description: "Gathers materials faster",
            range: 90,
            itemType: ItemType.PRIMARY,
            damage: 35.5,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -2,
            os: 2,
            Es: 2,
            Cs: 2,
            Bs: 2,
            zs: 2
        }, {
            id: 33,
            gs: 32,
            upgradeType: upgradeType.GOLD,
            ks: 1,
            ys: 128,
            imageinv: 133,
            image: 132,
            name: "Gold Axe",
            description: "Gathers materials faster",
            range: 90,
            itemType: ItemType.PRIMARY,
            damage: 33,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -2,
            os: 2,
            Es: 2,
            Cs: 2,
            Bs: 2,
            zs: 2
        }, {
            id: 34,
            ks: 128,
            ys: 128,
            imageinv: 135,
            image: 134,
            name: "Diamond Great Axe",
            description: "More powerful axe.",
            range: 94,
            itemType: ItemType.PRIMARY,
            damage: 47,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 4,
            os: 2,
            Es: 4,
            Cs: 4,
            Bs: 4,
            zs: 2
        }, {
            id: 35,
            gs: 34,
            upgradeType: upgradeType.GOLD,
            ks: 128,
            ys: 128,
            imageinv: 145,
            image: 144,
            name: "Gold Great Axe",
            description: "More powerful axe.",
            range: 94,
            itemType: ItemType.PRIMARY,
            damage: 40,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 4,
            os: 2,
            Es: 4,
            Cs: 4,
            Bs: 4,
            zs: 2
        }, {
            id: 36,
            gs: 40,
            upgradeType: upgradeType.DIAMOND,
            ks: 2,
            ys: 2,
            imageinv: 137,
            image: 136,
            name: "Diamond Katana",
            description: "Excellent melee weapon",
            range: 140,
            Ms: 150,
            itemType: ItemType.PRIMARY,
            damage: 46.5,
            reload: 300,
            Us: .85,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 1,
            os: 3
        }, {
            id: 37,
            gs: 36,
            upgradeType: upgradeType.GOLD,
            ks: 2,
            ys: 2,
            imageinv: 139,
            image: 138,
            name: "Gold Katana",
            description: "Excellent melee weapon",
            range: 140,
            Ms: 150,
            itemType: ItemType.PRIMARY,
            damage: 43,
            reload: 300,
            Us: .85,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 1,
            os: 3
        }, {
            id: 38,
            ks: 1,
            ys: 4,
            imageinv: 141,
            image: 140,
            name: "Diamond Spear",
            description: "Long melee range",
            range: 160,
            itemType: ItemType.PRIMARY,
            damage: 53,
            Us: .81,
            Ms: 450,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: 2
        }, {
            id: 39,
            gs: 38,
            upgradeType: upgradeType.GOLD,
            ks: 1,
            ys: 4,
            imageinv: 143,
            image: 142,
            name: "Gold Spear",
            description: "Long melee range",
            range: 160,
            itemType: ItemType.PRIMARY,
            damage: 51,
            Us: .81,
            Ms: 450,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: 2
        }, {
            id: 40,
            ks: 2,
            ys: 2,
            imageinv: 147,
            image: 148,
            name: "Chillrend",
            description: "A powerful force flows through this blade.",
            range: 140,
            Ms: 150,
            itemType: ItemType.PRIMARY,
            damage: 48.5,
            reload: 300,
            Us: .9,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 1,
            os: 3
        }, {
            id: 41,
            gs: 42,
            upgradeType: upgradeType.GOLD,
            ks: 1,
            ys: 32,
            imageinv: 150,
            image: 149,
            name: "Gold Stick",
            description: "Gathers resources quickly",
            range: 100,
            itemType: ItemType.PRIMARY,
            damage: 1,
            reload: 400,
            actionType: ActionType.MELEE,
            Ms: 60,
            ps: 0,
            As: 4,
            os: 0,
            Es: 8,
            Cs: 8,
            Bs: 8,
            zs: 5
        }, {
            id: 42,
            gs: 43,
            upgradeType: upgradeType.DIAMOND,
            ks: 1,
            ys: 32,
            imageinv: 167,
            image: 151,
            name: "Diamond Stick",
            description: "Gathers resources quickly",
            range: 100,
            itemType: ItemType.PRIMARY,
            damage: 1,
            reload: 400,
            actionType: ActionType.MELEE,
            Ms: 60,
            ps: 0,
            As: 4,
            os: 0,
            Es: 9,
            Cs: 9,
            Bs: 9,
            zs: 6
        }, {
            upgradeType: upgradeType.RUBY,
            id: 43,
            ks: 1,
            ys: 32,
            imageinv: 168,
            image: 152,
            name: "Ruby Stick",
            description: "Gathers resources quickly",
            range: 100,
            itemType: ItemType.PRIMARY,
            damage: 1,
            reload: 400,
            actionType: ActionType.MELEE,
            Ms: 60,
            ps: 0,
            As: 4,
            os: 0,
            Es: 10,
            Cs: 10,
            Bs: 10,
            zs: 7
        }, {
            id: 44,
            ks: 4,
            ys: 4,
            imageinv: 154,
            image: 153,
            name: "Diamond Naginata",
            description: "Long melee range",
            range: 165,
            itemType: ItemType.PRIMARY,
            damage: 56,
            Us: .81,
            Ms: 470,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: -4
        }, {
            id: 45,
            gs: 44,
            upgradeType: upgradeType.GOLD,
            ks: 4,
            ys: 4,
            imageinv: 156,
            image: 155,
            name: "Gold Naginata",
            description: "Long melee range",
            range: 165,
            itemType: ItemType.PRIMARY,
            damage: 54,
            Us: .81,
            Ms: 470,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: -4
        }, {
            id: 46,
            gs: 47,
            upgradeType: upgradeType.GOLD,
            imageinv: 158,
            image: 157,
            name: "Gold Tool Hammer",
            description: "Gather materials",
            range: 80,
            itemType: ItemType.PRIMARY,
            damage: 32,
            reload: 300,
            _s: 30,
            Ms: 200,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -3.5,
            os: 1
        }, {
            id: 47,
            gs: 48,
            upgradeType: upgradeType.DIAMOND,
            imageinv: 160,
            image: 159,
            name: "Diamond Tool Hammer",
            description: "Gather materials",
            range: 80,
            itemType: ItemType.PRIMARY,
            damage: 38,
            reload: 300,
            _s: 30,
            Ms: 200,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -3.5,
            os: 1
        }, {
            upgradeType: upgradeType.RUBY,
            id: 48,
            imageinv: 162,
            image: 161,
            name: "Ruby Tool Hammer",
            description: "Gather materials",
            range: 80,
            itemType: ItemType.PRIMARY,
            damage: 41,
            reload: 300,
            _s: 30,
            Ms: 200,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -3.5,
            os: 1
        }, {
            id: 49,
            cost: {
                food: 0,
                wood: 20,
                stone: 0,
                gold: 0
            },
            ks: 1,
            imageinv: 170,
            image: 169,
            name: "Roof",
            description: "Take cover from projectiles",
            itemType: ItemType.PLATFORM,
            actionType: ActionType.PLACEABLE,
            Hs: 0,
            As: 0,
            os: 15,
            layer: ELayer.ROOF,
            ps: 2
        }, {
            id: 50,
            cost: {
                food: 80,
                wood: 80,
                stone: 80,
                gold: 80
            },
            ks: 1,
            ys: 256,
            imageinv: 182,
            image: 182,
            name: "Pearl",
            description: "Teleport on impact",
            range: 700,
            itemType: ItemType.SECONDARY,
            damage: 10,
            reload: 1e4,
            projectile: 182,
            Ls: 1e3,
            actionType: ActionType.RANGED,
            ps: 1,
            Us: .4,
            As: 0,
            os: 35
        }, {
            id: 51,
            cost: {
                food: 0,
                wood: 50,
                stone: 50,
                gold: 0
            },
            ks: 2208,
            ys: 1,
            imageinv: 183,
            image: 183,
            name: "Teleporter",
            description: "Teleports to location on map",
            itemType: ItemType.SPAWN,
            actionType: ActionType.PLACEABLE,
            Hs: 5,
            As: 0,
            os: 15,
            layer: ELayer.TELEPORT,
            ps: 2
        }, {
            gs: 53,
            upgradeType: upgradeType.STONE,
            id: 52,
            ks: 1,
            ys: 4096,
            imageinv: 189,
            image: 193,
            name: "Stone Dagger",
            description: "A stubbier sword",
            range: 80,
            Ms: 100,
            itemType: ItemType.PRIMARY,
            damage: 22,
            reload: 150,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 10,
            os: 20
        }, {
            gs: 54,
            upgradeType: upgradeType.GOLD,
            id: 53,
            ks: 1,
            ys: 4096,
            imageinv: 190,
            image: 194,
            name: "Gold Dagger",
            description: "A stubbier sword",
            range: 80,
            Ms: 100,
            itemType: ItemType.PRIMARY,
            damage: 24,
            reload: 150,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 10,
            os: 20
        }, {
            gs: 55,
            upgradeType: upgradeType.DIAMOND,
            id: 54,
            ks: 1,
            ys: 4096,
            imageinv: 191,
            image: 195,
            name: "Diamond Dagger",
            description: "A stubbier sword",
            range: 80,
            Ms: 100,
            itemType: ItemType.PRIMARY,
            damage: 26,
            reload: 150,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 10,
            os: 20
        }, {
            upgradeType: upgradeType.RUBY,
            id: 55,
            ks: 1,
            ys: 4096,
            imageinv: 192,
            image: 196,
            name: "Ruby Dagger",
            description: "A stubbier sword",
            range: 80,
            Ms: 100,
            itemType: ItemType.PRIMARY,
            damage: 29,
            reload: 150,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 10,
            os: 20
        }, {
            id: 56,
            gs: 57,
            upgradeType: upgradeType.GOLD,
            ks: 1,
            ys: 1,
            imageinv: 198,
            image: 198,
            name: "Secret Item",
            description: "Dont leak how to get it :)",
            range: 115,
            itemType: ItemType.PRIMARY,
            damage: 28,
            Us: .92,
            Ms: 1570,
            reload: 2e3,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 40,
            os: 40
        }, {
            id: 57,
            ks: 2,
            ys: 2,
            imageinv: 199,
            image: 199,
            name: "Daedric Scythe",
            description: "Whispers fill the air",
            range: 160,
            Ms: 150,
            itemType: ItemType.PRIMARY,
            damage: 52,
            reload: 450,
            Us: .85,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -5,
            os: 20
        } ];
        const Items = ItemData;
        const ItemList = Items.filter((item => item.actionType === ActionType.PLACEABLE));
        const Shooting = Items.filter((item => item.actionType === ActionType.RANGED));
        class Vector {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
            static fromAngle(angle) {
                return new Vector(Math.cos(angle), Math.sin(angle));
            }
            add(vec) {
                this.x += vec.x;
                this.y += vec.y;
                return this;
            }
            sub(vec) {
                this.x -= vec.x;
                this.y -= vec.y;
                return this;
            }
            mult(scalar) {
                this.x *= scalar;
                this.y *= scalar;
                return this;
            }
            div(scalar) {
                this.x /= scalar;
                this.y /= scalar;
                return this;
            }
            get length() {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            }
            normalize() {
                return this.length > 0 ? this.div(this.length) : this;
            }
            setLength(value) {
                return this.normalize().mult(value);
            }
            copy() {
                return new Vector(this.x, this.y);
            }
            distance(vec) {
                return this.copy().sub(vec).length;
            }
            angle(vec) {
                const copy = vec.copy().sub(this);
                return Math.atan2(copy.y, copy.x);
            }
            dot(vec) {
                return this.x * vec.x + this.y * vec.y;
            }
            direction(angle, scalar) {
                return this.copy().add(Vector.fromAngle(angle).mult(scalar));
            }
        }
        const getAngleDist = (a, b) => {
            const p = Math.abs(b - a) % (Math.PI * 2);
            return p > Math.PI ? Math.PI * 2 - p : p;
        };
        class EntityManager {
            static isPlayer(entity) {
                return entity.type === ELayer.PLAYER;
            }
            static animals() {
                const layers = Ezgame.saves.entityList();
                const animals = [];
                for (let i = 0; i < Animals.length; i++) {
                    const layer = layers[Animals[i].id];
                    const formatted = layer.map((target => Formatter.entity(target)));
                    animals.push(...formatted);
                }
                return animals;
            }
            static enemies() {
                const players = Ezgame.saves.entityList()[ELayer.PLAYER];
                const enemies = [];
                for (let i = 0; i < players.length; i++) {
                    const player = Formatter.player(players[i]);
                    if (controller.isEnemy(player)) enemies.push(player);
                }
                return enemies.sort(((a, b) => this.sortDistance(a, b)));
            }
            static distance(a, b) {
                return new Vector(a.x2, a.y2).distance(new Vector(b.x2, b.y2));
            }
            static angle(a, b) {
                return new Vector(a.x2, a.y2).angle(new Vector(b.x2, b.y2));
            }
            static sortDistance(a, b, sorted) {
                const target = sorted || Ezgame.myPlayer;
                return this.distance(a, target) - this.distance(b, target);
            }
            static shield(a, b, sorted) {
                const target = sorted || Ezgame.myPlayer;
                const shieldA = this.lookingAt(a, target, 1.58927) && a.currentItem === EWeapons.SHIELD;
                const shieldB = this.lookingAt(b, target, 1.58927) && b.currentItem === EWeapons.SHIELD;
                return shieldA ? 1 : shieldB ? -1 : 0;
            }
            static canHitEntity(a, b, sorted) {
                const target = sorted || Ezgame.myPlayer;
                const hitA = this.projectileCanHitEntity(a, target);
                const hitB = this.projectileCanHitEntity(b, target);
                return hitA === Hit.NEEDDESTROY ? 1 : hitB === Hit.NEEDDESTROY ? -1 : 0;
            }
            static lookingAt(entity, point, angle) {
                const pos1 = new Vector(entity.x2, entity.y2);
                const pos2 = new Vector(point.x2, point.y2);
                const dir = getAngleDist(pos1.angle(pos2) + Math.PI, entity.angle2);
                return dir > angle;
            }
            static entities(sorted) {
                return [ ...this.enemies().sort(((a, b) => this.sortDistance(a, b, sorted))).sort(((a, b) => this.shield(a, b, sorted))), ...this.animals().sort(((a, b) => this.sortDistance(a, b, sorted))) ];
            }
            static predict(entity) {
                const pos1 = new Vector(entity.x1, entity.y1);
                const pos2 = new Vector(entity.x2, entity.y2);
                const distance = pos1.distance(pos2) * (entity === Ezgame.myPlayer ? 1 : 2.2);
                const direction = Vector.fromAngle(pos1.angle(pos2));
                return pos2.add(direction.mult(distance));
            }
            static entityIn(entity, layer, extraRadius = 0) {
                const targets = Ezgame.saves.entityList()[layer];
                return targets.some((target => {
                    const object = Formatter.object(target);
                    const radius = entity.radius + object.radius + extraRadius;
                    return this.distance(entity, object) <= radius;
                }));
            }
            static intersects(pos1, pos2, pos3, r) {
                const linear = pos2.copy().sub(pos1);
                const constant = pos1.copy().sub(pos3);
                const a = linear.dot(linear);
                const b = linear.dot(constant);
                const c = constant.dot(constant) - r * r;
                return b * b >= a * c && (-b <= a || c + b + b + a <= 0) && (b <= 0 || c <= 0);
            }
            static projectileCanHitEntity(entity, sorted) {
                const target = sorted || Ezgame.myPlayer;
                if (!controller.canShoot()) return Hit.CANNOT;
                const pos1 = new Vector(target.x2, target.y2);
                const pos2 = new Vector(entity.x2, entity.y2);
                const myPlayerOnPlatform = this.entityIn(target, ELayer.PLATFORM);
                const entityInRoof = this.entityIn(entity, ELayer.ROOF);
                if (myPlayerOnPlatform && entityInRoof) return Hit.CANNOT;
                const layers = Ezgame.saves.entityList();
                for (const layer of LayerObjects) {
                    if (myPlayerOnPlatform && !layer.cannotShoot) continue;
                    for (const target of layers[layer.id]) {
                        const object = Formatter.object(target);
                        const pos3 = new Vector(object.x2, object.y2);
                        if (pos1.distance(pos3) > pos1.distance(pos2)) continue;
                        if (this.intersects(pos1, pos2, pos3, object.radius)) {
                            if (object.layerData.maxHealth === undefined) return Hit.CANNOT;
                            return Hit.NEEDDESTROY;
                        }
                    }
                }
                return Hit.CAN;
            }
            static inWeaponRange(entity1, entity2, weapon) {
                const range = Items[weapon].range || 0;
                return this.distance(entity1, entity2) <= range + entity2.radius;
            }
            static nearestPossible(weapon, sorted) {
                const target = sorted || Ezgame.myPlayer;
                const item = Items[weapon];
                const shoot = controller.canShoot() && item.actionType === ActionType.RANGED;
                const entities = this.entities().filter((entity => shoot ? this.projectileCanHitEntity(entity, target) : this.inWeaponRange(target, entity, weapon)));
                if (shoot) {
                    entities.sort(((a, b) => this.canHitEntity(a, b, target)));
                }
                return entities.length ? entities[0] : null;
            }
            static nearestLayer(entity, layer) {
                const objects = Ezgame.saves.entityList()[layer].map((target => Formatter.object(target)));
                return objects.sort(((a, b) => this.sortDistance(a, b, entity)))[0];
            }
        }
        const attackAnimation = () => {
            if (!Settings.weaponReloadBar && !Settings.autosync) return;
            const b = Ezgame.saves.buffer;
            const len = Ezgame.saves.byteLength;
            const players = Ezgame.saves.players();
            for (let i = 1; i < len; i += 5) {
                const type = b[i];
                const id = b[i + 1] | b[i + 2] << 8;
                const weapon = b[i + 3];
                const isObject = b[i + 4];
                const target = players.get(id);
                if (type === ELayer.PLAYER && target) {
                    if (Settings.weaponReloadBar) {
                        const reload = target.weaponReload;
                        reload.current = -Ezgame.step;
                        reload.lerp = 0;
                        reload.max = Items[weapon].reload || 0;
                    }
                    if (Settings.autosync && controller.canAutosync()) {
                        const player = Formatter.player(target);
                        if (controller.isTeammate(player) && controller.isPrimary(weapon)) {
                            const nearest = EntityManager.nearestPossible(weapon, player);
                            if (nearest !== null && EntityManager.inWeaponRange(Ezgame.myPlayer, nearest, controller.itemBar[0])) {
                                const previousWeapon = controller.weapon;
                                controller.whichWeapon(false);
                                controller.attack(EntityManager.angle(Ezgame.myPlayer, nearest));
                                controller.PacketManager.stopAttack();
                                controller.whichWeapon(previousWeapon);
                                controller.PacketManager.changeAngle(controller.mouse.angle);
                            }
                        }
                    }
                }
            }
        };
        const hooks_attackAnimation = attackAnimation;
        let teammates = [];
        const createClan = () => {
            const b = Ezgame.saves.buffer;
            const len = Ezgame.saves.byteLength;
            teammates = [ ...b.slice(3, len) ];
        };
        const updateClan = () => {
            const b = Ezgame.saves.buffer;
            const len = Ezgame.saves.byteLength;
            teammates = [ ...b.slice(2, len) ];
        };
        const deleteClan = () => {
            teammates = [];
        };
        const playerStats = () => {
            const b = Ezgame.saves.buffer;
            const age = formatAge(b[1] | b[2] << 8 | b[3] << 16 | b[4] << 24);
            const food = b[5] | b[6] << 8 | b[7] << 16 | b[8] << 24;
            const wood = b[9] | b[10] << 8 | b[11] << 16 | b[12] << 24;
            const stone = b[13] | b[14] << 8 | b[15] << 16 | b[16] << 24;
            const gold = b[17] | b[18] << 8 | b[19] << 16 | b[20] << 24;
            if (age !== 0) {
                controller.age = age;
            }
            controller.resources = {
                food,
                wood,
                stone,
                gold
            };
        };
        const hooks_playerStats = playerStats;
        const stringMessage = data => {
            const id = data[0];
            if (id === WebsocketServer.SPAWN) {
                controller.myPlayerID = data[1];
                controller.reset(data[4]);
                controller.inGame = true;
                controller.automillSpawn = true;
                if (Settings.lastHat) {
                    const hat = controller.toggleJungle || controller.toggleScuba ? controller.previousHat : controller.actualHat;
                    controller.equipHat(hat, true, true);
                }
            }
            if (id === WebsocketServer.UPGRADE) {
                const bar = data[1];
                const canAutobed = Settings.autobed && bar.includes(EObjects.SPAWN);
                controller.autobed = canAutobed;
                if (Settings.skipUpgrades && bar.length === 1 || canAutobed) {
                    controller.PacketManager.upgrade(canAutobed ? EObjects.SPAWN : bar[0]);
                }
            }
            if (id === WebsocketServer.DIED) {
                controller.myPlayerID = 0;
                controller.inGame = false;
                if (Settings.autospawn) {
                    controller.spawn();
                }
            }
            if (id === WebsocketServer.KILL_UPDATE) {
                controller.kills = data[1][0];
            }
            if (id === WebsocketServer.KILLED && Settings.kill) {
                const killMessage = Settings.killMessage.length ? Settings.killMessage : "{KILL}x";
                const name = data[1].replace(/^Killed\s/, "").trim();
                const message = killMessage.replace(/\{KILL\}/g, controller.kills + "").replace(/\{NAME\}/g, name);
                controller.PacketManager.chat(message);
            }
        };
        const hooks_stringMessage = stringMessage;
        var WebsocketServer;
        (function(WebsocketServer) {
            WebsocketServer[WebsocketServer["LEADERBOARD"] = 3] = "LEADERBOARD";
            WebsocketServer[WebsocketServer["DAMAGE"] = 6] = "DAMAGE";
            WebsocketServer[WebsocketServer["PLAYERSTATS"] = 8] = "PLAYERSTATS";
            WebsocketServer[WebsocketServer["CONNECT"] = 12] = "CONNECT";
            WebsocketServer[WebsocketServer["UPGRADE"] = 14] = "UPGRADE";
            WebsocketServer[WebsocketServer["UPDATECLAN"] = 16] = "UPDATECLAN";
            WebsocketServer[WebsocketServer["DIED"] = 19] = "DIED";
            WebsocketServer[WebsocketServer["MOVEUPDATE"] = 20] = "MOVEUPDATE";
            WebsocketServer[WebsocketServer["KILL_UPDATE"] = 22] = "KILL_UPDATE";
            WebsocketServer[WebsocketServer["JOINCREATECLAN"] = 24] = "JOINCREATECLAN";
            WebsocketServer[WebsocketServer["DELETECLAN"] = 27] = "DELETECLAN";
            WebsocketServer[WebsocketServer["KILLED"] = 28] = "KILLED";
            WebsocketServer[WebsocketServer["ATTACK_ANIMATION"] = 29] = "ATTACK_ANIMATION";
            WebsocketServer[WebsocketServer["PLAYER_SPAWNED"] = 32] = "PLAYER_SPAWNED";
            WebsocketServer[WebsocketServer["DEFAULT"] = 33] = "DEFAULT";
            WebsocketServer[WebsocketServer["SPAWN"] = 35] = "SPAWN";
        })(WebsocketServer || (WebsocketServer = {}));
        var WebsocketClient;
        (function(WebsocketClient) {
            WebsocketClient[WebsocketClient["MOVE"] = 6] = "MOVE";
            WebsocketClient[WebsocketClient["ANGLE"] = 13] = "ANGLE";
            WebsocketClient[WebsocketClient["selectByID"] = 2] = "selectByID";
            WebsocketClient[WebsocketClient["ATTACK"] = 19] = "ATTACK";
            WebsocketClient[WebsocketClient["STOPATTACK"] = 18] = "STOPATTACK";
            WebsocketClient[WebsocketClient["LOGIN"] = 10] = "LOGIN";
            WebsocketClient[WebsocketClient["SCYTHE"] = 20] = "SCYTHE";
            WebsocketClient[WebsocketClient["SELECTITEM"] = 0] = "SELECTITEM";
            WebsocketClient[WebsocketClient["HAT"] = 5] = "HAT";
            WebsocketClient[WebsocketClient["CHAT"] = 7] = "CHAT";
            WebsocketClient[WebsocketClient["UPGRADE"] = 14] = "UPGRADE";
            WebsocketClient[WebsocketClient["AUTOATTACK"] = 23] = "AUTOATTACK";
            WebsocketClient[WebsocketClient["MOVEANGLE"] = 1] = "MOVEANGLE";
            WebsocketClient[WebsocketClient["LEAVECLAN"] = 24] = "LEAVECLAN";
            WebsocketClient[WebsocketClient["JOIN"] = 21] = "JOIN";
            WebsocketClient[WebsocketClient["ACCEPTDECLINE"] = 17] = "ACCEPTDECLINE";
            WebsocketClient[WebsocketClient["KICK"] = 25] = "KICK";
            WebsocketClient[WebsocketClient["CREATECLAN"] = 22] = "CREATECLAN";
        })(WebsocketClient || (WebsocketClient = {}));
        window.Uint8Array = new Proxy(window.Uint8Array, {
            construct(target, args) {
                const uint = new target(...args);
                if (args[0] === 4096) {
                    Ezgame.saves.buffer = uint;
                    window.Uint8Array = target;
                }
                return uint;
            }
        });
        const proto = Uint8Array.__proto__;
        const getter = Object.getOwnPropertyDescriptor(proto.prototype, "byteLength")?.get;
        Object.defineProperty(Uint8Array.prototype, "byteLength", {
            get() {
                const value = getter.call(this);
                Ezgame.saves.byteLength = value;
                return value;
            }
        });
        let start = Date.now();
        window.WebSocket = new Proxy(window.WebSocket, {
            construct(target, args) {
                if (typeof args[0] === "string") {
                    if (args[0] !== Ezgame.connectURL) {
                        controller.myPlayerID = 0;
                        controller.age = 0;
                        for (const hat of Hats) {
                            hat.bought = !!hat.default;
                            hat.equipped = !!hat.default;
                        }
                    }
                    Ezgame.connectURL = args[0];
                }
                const ws = new target(...args);
                ws.addEventListener("message", (event => {
                    const data = event.data;
                    if (typeof data === "string" && /^\[.+\]$/.test(data)) {
                        hooks_stringMessage(JSON.parse(data));
                    } else {
                        switch (Ezgame.saves.buffer[0]) {
                          case WebsocketServer.PLAYERSTATS:
                            hooks_playerStats();
                            break;

                          case WebsocketServer.DELETECLAN:
                            deleteClan();
                            break;

                          case WebsocketServer.JOINCREATECLAN:
                            createClan();
                            break;

                          case WebsocketServer.UPDATECLAN:
                            updateClan();
                            break;

                          case WebsocketServer.MOVEUPDATE:
                            {
                                const now = Date.now();
                                Ezgame.step = now - start;
                                start = now;
                                break;
                            }

                          case WebsocketServer.ATTACK_ANIMATION:
                            hooks_attackAnimation();
                            break;
                        }
                    }
                }));
                return ws;
            }
        });
        class PacketManager {
            constructor() {
                this.encoder = new TextEncoder;
            }
            send(...args) {
                Ezgame.saves.send(new Uint8Array(args));
            }
            moveByBitmask(bitmask) {
                this.send(WebsocketClient.MOVE, bitmask);
            }
            changeAngle(angle) {
                angle = 65535 * (angle + Math.PI) / (2 * Math.PI), this.send(WebsocketClient.ANGLE, 255 & angle, angle >> 8 & 255);
            }
            selectByID(id) {
                this.send(WebsocketClient.selectByID, id);
            }
            attack(angle) {
                angle = 65535 * (angle + Math.PI) / (2 * Math.PI), this.send(WebsocketClient.ATTACK, 255 & angle, angle >> 8 & 255);
            }
            stopAttack() {
                this.send(WebsocketClient.STOPATTACK);
            }
            upgradeScythe(goldenCowID) {
                this.send(WebsocketClient.SCYTHE, 255 & goldenCowID, goldenCowID >> 8);
            }
            selectItemByType(type) {
                this.send(WebsocketClient.SELECTITEM, type);
            }
            equip(id) {
                this.send(WebsocketClient.HAT, id);
            }
            chat(message) {
                const bytes = this.encoder.encode(message);
                this.send(WebsocketClient.CHAT, ...bytes);
            }
            upgrade(id) {
                this.send(WebsocketClient.UPGRADE, id);
                controller.upgradeItem(id);
            }
            autoattack(toggle) {
                this.send(WebsocketClient.AUTOATTACK, Number(toggle));
            }
            moveAngle(angle) {
                angle = 65535 * (angle + Math.PI) / (2 * Math.PI), this.send(WebsocketClient.MOVEANGLE, 255 & angle, angle >> 8 & 255);
            }
            leaveClan() {
                this.send(WebsocketClient.LEAVECLAN);
            }
            joinClan(id) {
                this.send(WebsocketClient.JOIN, id);
            }
            accept(which) {
                this.send(WebsocketClient.ACCEPTDECLINE, which);
            }
            kick(id) {
                this.send(WebsocketClient.KICK, id);
            }
            createClan(name) {
                const bytes = this.encoder.encode(name);
                this.send(WebsocketClient.CREATECLAN, ...bytes);
            }
        }
        class TimeoutManager {
            constructor(callbacks, delay) {
                this.callbacks = callbacks;
                this.delay = delay;
                this.active = false;
                this.old = Date.now();
            }
            static waitUntil(condition, time, callback) {
                return new Promise((resolve => {
                    const start = Date.now();
                    const int = setInterval((() => {
                        if (typeof time === "number" && Number.isFinite(time) && Date.now() - start > time || condition()) {
                            clearInterval(int);
                        }
                        if (condition()) {
                            if (typeof callback === "function") return callback();
                            resolve();
                        }
                    }), 50);
                }));
            }
            start() {
                if (this.active) return;
                this.active = true;
                this.old = Date.now();
                this.callbacks[0]();
            }
            async stop() {
                if (!this.active) return;
                this.callbacks[1]();
                if (!this.delay(this.old)) await TimeoutManager.waitUntil((() => this.delay(this.old)), 3e3);
                this.callbacks[2]();
                this.active = false;
            }
            isActive() {
                return this.active;
            }
        }
        class Controller {
            constructor() {
                this.myPlayerID = 0;
                this.move = 0;
                this.attacking = false;
                this.autoattack = false;
                this.rotation = false;
                this.weapon = false;
                this.healing = false;
                this.attackingInvis = false;
                this.toggleInvis = false;
                this.currentItem = null;
                this.chatToggle = false;
                this.chatCount = 0;
                this.autobed = false;
                this.automill = false;
                this.automillSpawn = false;
                this.mousemove = true;
                this.kills = 0;
                this.inGame = false;
                this.itemBar = [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ];
                this.hsl = 0;
                this.aimTarget = null;
                this.wasAutoboost = false;
                this.count = 0;
                this.toggleJungle = false;
                this.toggleScuba = false;
                this.resources = {
                    food: 200,
                    wood: 200,
                    stone: 200,
                    gold: 200
                };
                this.mouse = {
                    x: 0,
                    y: 0,
                    angle: 0
                };
                this.equipStart = Date.now();
                this.actualHat = 0;
                this.currentHat = 0;
                this.previousHat = 0;
                this.maxCount = [ 0, 0, 0, 100, 30, 8, 2, 12, 32, 1, 2 ];
                this.age = 0;
                this.hotkeys = new Map;
                this.PacketManager = new PacketManager;
                this.previousWeapon = false;
                this.fastbreak = new TimeoutManager([ () => {
                    const primary = this.itemBar[ItemType.PRIMARY];
                    const secondary = this.itemBar[ItemType.SECONDARY];
                    const pickWeapon = secondary === EWeapons.HAMMER || primary === EWeapons.STICK && secondary === EWeapons.SHIELD;
                    this.previousWeapon = this.weapon;
                    this.whichWeapon(pickWeapon);
                    this.equipHat(Hat.DEMOLIST, false);
                    this.attacking = true;
                    this.attack();
                }, () => {
                    this.PacketManager.stopAttack();
                    this.attacking = false;
                    this.whichWeapon(this.previousWeapon);
                }, () => {
                    if (!Ezgame.myPlayer.isClown) {
                        this.equipHat(this.previousHat, true);
                    }
                } ], (start => this.hatReloaded() && Date.now() - start > TargetReload.HAT));
                this.attachMouse();
            }
            reset(items) {
                this.move = 0;
                this.attacking = false;
                this.autoattack = false;
                this.rotation = false;
                this.weapon = false;
                this.healing = false;
                this.attackingInvis = false;
                this.toggleInvis = false;
                this.currentItem = null;
                this.chatToggle = false;
                this.chatCount = 0;
                this.autobed = false;
                this.automill = false;
                this.automillSpawn = false;
                this.mousemove = true;
                this.kills = 0;
                this.inGame = false;
                this.itemBar = [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ];
                this.hsl = 0;
                this.aimTarget = null;
                this.count = 0;
                for (const id of items) {
                    this.upgradeItem(id);
                }
                for (const [key] of this.hotkeys) {
                    this.hotkeys.delete(key);
                }
            }
            attachMouse() {
                window.addEventListener("mousemove", (event => {
                    this.mouse.x = event.clientX;
                    this.mouse.y = event.clientY;
                    if (!this.rotation) {
                        this.mouse.angle = angle(innerWidth / 2, innerHeight / 2, this.mouse.x, this.mouse.y);
                    }
                }));
            }
            hasItem(type) {
                return this.itemBar[type] !== -1;
            }
            hasSecondary() {
                return this.itemBar[ItemType.SECONDARY] !== -1;
            }
            updateWeapon(type) {
                const weapon = Ezgame.saves.defaultData[Ezgame.props.itemBar][type];
                if (this.isWeapon(weapon) && this.itemBar[type] !== weapon) {
                    this.itemBar[type] = weapon;
                }
            }
            isMyPlayer(entity) {
                return entity.id === this.myPlayerID;
            }
            isTeammate(entity) {
                return entity.id !== this.myPlayerID && teammates.includes(entity.ownerID);
            }
            isEnemy(entity) {
                return !this.isMyPlayer(entity) && !this.isTeammate(entity);
            }
            canShoot() {
                const id = this.itemBar[ItemType.SECONDARY];
                return this.hasSecondary() && Items[id].actionType === ActionType.RANGED;
            }
            isWeapon(id) {
                const type = Items[id].itemType;
                return type === ItemType.PRIMARY || type === ItemType.SECONDARY;
            }
            isPrimary(id) {
                return Items[id].itemType === ItemType.PRIMARY;
            }
            isSecondary(id) {
                return Items[id].itemType === ItemType.SECONDARY;
            }
            currentCount(type) {
                return Ezgame.saves.defaultData[Ezgame.props.currentCount][type];
            }
            hasCount(type) {
                return this.currentCount(type) < this.maxCount[type];
            }
            isDoingNothing() {
                return !this.healing && !this.attackingInvis && !this.toggleInvis && !this.attacking && this.currentItem === null;
            }
            canAutosync() {
                return !this.attacking && !this.attackingInvis && !this.toggleInvis && !this.autoattack;
            }
            hasResources(id) {
                const cost = Items[id].cost || {
                    food: 0,
                    wood: 0,
                    stone: 0,
                    gold: 0
                };
                const {food, wood, stone, gold} = this.resources;
                const hasFood = food >= cost.food;
                const hasWood = wood >= cost.wood;
                const hasStone = stone >= cost.stone;
                const hasGold = gold >= cost.gold;
                return hasFood && hasWood && hasStone && hasGold;
            }
            getAngleFromBitmask(bitmask, rotate) {
                const vec = {
                    x: 0,
                    y: 0
                };
                if (bitmask & 1) vec.y--;
                if (bitmask & 2) vec.y++;
                if (bitmask & 4) vec.x--;
                if (bitmask & 8) vec.x++;
                if (rotate) {
                    vec.x *= -1;
                    vec.y *= -1;
                }
                return Math.atan2(vec.y, vec.x);
            }
            upgradeItem(id) {
                const item = Items[id];
                this.itemBar[item.itemType] = id;
            }
            upgradeScythe() {
                const target = Ezgame.saves.entityList()[ELayer.GOLDENCOW][0];
                if (target !== undefined) {
                    this.PacketManager.upgradeScythe(target[Ezgame.props.id]);
                }
            }
            buyHat(id) {
                if (!Hats[id].bought && controller.resources.gold >= Hats[id].price) {
                    Hats[id].bought = true;
                    this.PacketManager.equip(id);
                }
                return Hats[id].bought;
            }
            hatReloaded() {
                return Ezgame.myPlayer.target.hatReload.current === TargetReload.HAT;
            }
            equipHat(id, actual = true, force = false) {
                const hatID = id === Hat.UNEQUIP ? this.actualHat : id;
                if (!this.buyHat(hatID) || !this.inGame) return false;
                const now = Date.now();
                if (!Hats[id].equipped && this.hatReloaded() && now - this.equipStart >= TargetReload.HAT || force) {
                    this.equipStart = now;
                    this.PacketManager.equip(hatID);
                    for (const hat of Hats) {
                        hat.equipped = false;
                    }
                    Hats[id].equipped = true;
                    this.previousHat = this.currentHat;
                    this.currentHat = id;
                    if (actual) {
                        this.actualHat = id;
                    }
                    return true;
                }
                return false;
            }
            async autochat() {
                if (this.chatToggle) return;
                this.chatToggle = true;
                const messages = Settings.autochatMessages.filter((msg => msg.length));
                if (!messages.length) return;
                this.PacketManager.chat(messages[this.chatCount++]);
                this.chatCount %= messages.length;
                await sleep(2e3);
                this.chatToggle = false;
            }
            accept(which) {
                this.PacketManager.accept(which);
                const acceptList = Ezgame.saves.clanData[Ezgame.props.acceptList];
                acceptList.shift();
            }
            async spawn() {
                await sleep(100);
                const play = document.querySelector("#play");
                play.click();
            }
            whichWeapon(type) {
                if (type !== undefined) {
                    this.weapon = type;
                }
                this.PacketManager.selectByID(this.itemBar[+this.weapon]);
            }
            attack(angle) {
                const dir = angle ? angle : this.mouse.angle;
                this.PacketManager.attack(dir);
            }
            place(type, angle, placementType) {
                if (this.wasAutoboost) {
                    const nearest = EntityManager.enemies()[0];
                    if (nearest !== undefined) {
                        angle = EntityManager.angle(Ezgame.myPlayer, nearest);
                        this.PacketManager.moveAngle(angle);
                    }
                }
                const placeType = placementType === undefined ? Settings.placementType : placementType;
                const isHolding = placeType === PlacementType.HOLDING;
                this.whichWeapon();
                if (isHolding && this.attacking) this.attack(angle);
                this.PacketManager.selectItemByType(type);
                this.attack(angle);
                this.PacketManager.stopAttack();
                if (!isHolding) this.whichWeapon();
                if (this.attacking) this.attack(angle);
            }
            placement() {
                if (this.currentItem === null) return;
                this.place(this.currentItem);
                this.count = (this.count + 1) % Settings.placementSpeed;
                const method = this.count === 0 ? setTimeout : queueMicrotask;
                method(this.placement.bind(this));
            }
            placementHandler(type, code) {
                if (!this.hasItem(type)) return;
                if (Settings.placementType === PlacementType.DEFAULT) {
                    this.PacketManager.selectItemByType(type);
                    return;
                }
                this.hotkeys.set(code, type);
                this.currentItem = type;
                const isBoost = type === ItemType.TRAP && this.itemBar[ItemType.TRAP] === EObjects.BOOST;
                this.wasAutoboost = Settings.autoboostFollow && isBoost;
                if (this.hotkeys.size === 1) {
                    this.placement();
                }
            }
            heal() {
                this.PacketManager.selectItemByType(ItemType.FOOD);
                this.attack();
                this.PacketManager.stopAttack();
                this.whichWeapon();
                if (this.attacking) {
                    this.attack();
                }
            }
            invisibleHit() {
                this.mousemove = true;
                this.aimTarget = null;
                if (Settings.invisHitToggle && !this.toggleInvis || !Settings.invisHitToggle && !this.attackingInvis) {
                    this.toggleInvis = false;
                    this.attackingInvis = false;
                    return;
                }
                let angle;
                const nearest = EntityManager.nearestPossible(this.itemBar[+!this.weapon]);
                const shoot = this.canShoot() && !this.weapon;
                if (nearest && (Settings.meleeAim && !shoot || Settings.bowAim && shoot)) {
                    const pos1 = EntityManager.predict(Ezgame.myPlayer);
                    const pos2 = EntityManager.predict(nearest);
                    angle = pos1.angle(pos2);
                    this.mousemove = false;
                    this.aimTarget = nearest.target;
                }
                if (nearest && shoot || !shoot) {
                    this.whichWeapon(!this.weapon);
                    this.attack(angle);
                    this.PacketManager.stopAttack();
                    this.whichWeapon(!this.weapon);
                }
                setTimeout(this.invisibleHit.bind(this), 85);
            }
            spikeInsta() {
                let angle;
                if (Settings.spikeInstaAim) {
                    const nearest = EntityManager.nearestPossible(this.itemBar[0]);
                    if (nearest) {
                        angle = EntityManager.angle(Ezgame.myPlayer, nearest);
                    }
                }
                const previousWeapon = this.weapon;
                this.equipHat(Hat.BERSERKER);
                this.whichWeapon(false);
                this.place(ItemType.SPIKE, angle);
                this.attack(angle);
                this.PacketManager.stopAttack();
                this.whichWeapon(previousWeapon);
            }
            handleKeydown(event, code) {
                if (code === 1) event.preventDefault();
                if (event instanceof KeyboardEvent && event.repeat) return;
                if (Ezgame.active) return;
                if (code === Settings.toggleMenu && !isInput(event.target)) {
                    if (typeof Ezgame.toggleMenu === "function") Ezgame.toggleMenu();
                }
                if (!this.inGame) return;
                if (code === Settings.openChat) {
                    if (!isInput()) event.preventDefault();
                    Ezgame.saves.toggleChat();
                }
                if (isInput(event.target)) return;
                if (code === Settings.primary) this.whichWeapon(false);
                if (code === Settings.secondary && this.hasSecondary()) this.whichWeapon(true);
                if (code === Settings.heal && !this.healing) {
                    this.healing = true;
                    if (Settings.placementType === PlacementType.DEFAULT) {
                        this.PacketManager.selectItemByType(ItemType.FOOD);
                    } else {
                        doWhile((() => this.healing), this.heal.bind(this), 0);
                    }
                }
                if (code === Settings.wall) this.placementHandler(ItemType.WALL, code);
                if (code === Settings.spike) this.placementHandler(ItemType.SPIKE, code);
                if (code === Settings.windmill) this.placementHandler(ItemType.WINDMILL, code);
                if (code === Settings.trap) this.placementHandler(ItemType.TRAP, code);
                if (code === Settings.turret) this.placementHandler(ItemType.TURRET, code);
                if (code === Settings.tree) this.placementHandler(ItemType.FARM, code);
                if (code === Settings.platform) this.placementHandler(ItemType.PLATFORM, code);
                if (code === Settings.spawn) this.placementHandler(ItemType.SPAWN, code);
                if (code === Settings.unequip) this.equipHat(Hat.UNEQUIP);
                if (code === Settings.bush) this.equipHat(Hat.BUSH);
                if (code === Settings.berserker) this.equipHat(Hat.BERSERKER);
                if (code === Settings.jungle) this.equipHat(Hat.JUNGLE);
                if (code === Settings.crystal) this.equipHat(Hat.CRYSTAL);
                if (code === Settings.spikegear) this.equipHat(Hat.SPIKEGEAR);
                if (code === Settings.immunity) this.equipHat(Hat.IMMUNITY);
                if (code === Settings.boost) this.equipHat(Hat.BOOST);
                if (code === Settings.applehat) this.equipHat(Hat.APPLEHAT);
                if (code === Settings.scuba) this.equipHat(Hat.SCUBA);
                if (code === Settings.hood) this.equipHat(Hat.HOOD);
                if (code === Settings.demolist) this.equipHat(Hat.DEMOLIST);
                if (code === Settings.invisibleHit && this.hasSecondary()) {
                    if (Settings.invisHitToggle) {
                        this.toggleInvis = !this.toggleInvis;
                    } else {
                        this.attackingInvis = true;
                    }
                    if (this.toggleInvis || this.attackingInvis) this.invisibleHit();
                }
                if (code === Settings.spikeInsta) this.spikeInsta();
                if (code === Settings.fastBreak && !this.fastbreak.isActive() && this.hatReloaded()) {
                    this.fastbreak.start();
                }
                const copyMove = this.move;
                if (code === Settings.up) this.move |= 1;
                if (code === Settings.left) this.move |= 4;
                if (code === Settings.down) this.move |= 2;
                if (code === Settings.right) this.move |= 8;
                if (copyMove !== this.move) this.PacketManager.moveByBitmask(this.move);
                if (event instanceof MouseEvent && code === 0) {
                    this.attacking = true;
                }
                if (code === Settings.autoattack) {
                    this.autoattack = !this.autoattack;
                    this.PacketManager.autoattack(this.autoattack);
                }
                if (code === Settings.lockRotation) {
                    this.rotation = !this.rotation;
                    Ezgame.saves.toggleRotation(this.rotation);
                }
                if (code === Settings.upgradeScythe) this.upgradeScythe();
            }
            handleKeyup(event, code) {
                if (code === Settings.heal && this.healing) {
                    this.healing = false;
                }
                if (code === Settings.invisibleHit && this.attackingInvis) {
                    this.attackingInvis = false;
                }
                if (code === Settings.fastBreak && this.fastbreak.isActive()) {
                    this.fastbreak.stop();
                }
                const copyMove = this.move;
                if (code === Settings.up) this.move &= -2;
                if (code === Settings.left) this.move &= -5;
                if (code === Settings.down) this.move &= -3;
                if (code === Settings.right) this.move &= -9;
                if (copyMove !== this.move) this.PacketManager.moveByBitmask(this.move);
                if (event instanceof MouseEvent && code === 0) {
                    this.attacking = false;
                }
                if (code === Settings.trap && this.wasAutoboost) {
                    this.wasAutoboost = false;
                    this.PacketManager.moveByBitmask(this.move);
                }
                if (this.currentItem !== null && this.hotkeys.delete(code)) {
                    const entries = [ ...this.hotkeys ];
                    this.currentItem = entries.length ? entries[entries.length - 1][1] : null;
                    if (this.currentItem === null) {
                        this.whichWeapon();
                    }
                }
            }
        }
        const createEntity = target => {
            const id = target[Ezgame.props.id];
            const type = target.type;
            const entities = Ezgame.saves.entityList();
            if (type === ELayer.PLAYER) {
                if (id === controller.myPlayerID) {
                    Ezgame.myPlayer.target = target;
                    updateSkin();
                }
                const player = Formatter.player(target);
                target.hatReload = {
                    ...Reload.hat
                };
                target.weaponReload = {
                    ...Reload.weapon
                };
                target.prevHat = player.hat;
                const weaponReload = target.weaponReload;
                if (controller.isWeapon(player.currentItem)) {
                    weaponReload.max = Items[player.currentItem].reload || 0;
                    weaponReload.current = weaponReload.max;
                    weaponReload.lerp = weaponReload.max;
                }
            } else if (type === ELayer.TURRET) {
                target.turretReload = {
                    ...Reload.turret
                };
            } else if (type === ELayer.DRAGON) {
                target.fireballReload = {
                    ...Reload.fireball
                };
            } else if (type === ELayer.PROJECTILE) {
                const projectile = Formatter.projectile(target);
                const type = projectile.projectileType;
                const isTurret = Settings.turretReloadBar && entities[ELayer.TURRET].find((target => {
                    const turret = Formatter.object(target);
                    const isOwner = turret.ownerID === projectile.ownerID;
                    const isX = turret.x2 === projectile.x2;
                    const isY = turret.y2 === projectile.y2;
                    return isOwner && isX && isY;
                }));
                const isPlayer = Settings.weaponReloadBar && entities[ELayer.PLAYER].find((target => {
                    const player = Formatter.player(target);
                    const isOwner = player.ownerID === projectile.ownerID;
                    return isOwner;
                }));
                if (isTurret) {
                    const reload = isTurret.turretReload;
                    reload.current = -Ezgame.step;
                    reload.lerp = 0;
                } else if (isPlayer) {
                    const weapon = Shooting.find((weapon => weapon.projectile === type));
                    if (weapon === undefined) return;
                    let delay = weapon.reload || 0;
                    if (type === 88) {
                        const id = isPlayer.secondary === EWeapons.XBOW ? EWeapons.XBOW : EWeapons.BOW;
                        delay = Items[id].reload || 0;
                    }
                    const reload = isPlayer.weaponReload;
                    reload.current = -Ezgame.step;
                    reload.lerp = 0;
                    reload.max = delay;
                }
            } else if (type === ELayer.FIREBALL && entities[ELayer.DRAGON].length && Settings.fireballReloadBar) {
                const dragon = entities[ELayer.DRAGON][0];
                const reload = dragon.fireballReload;
                reload.current = -Ezgame.step;
                reload.lerp = 0;
            }
        };
        const hooks_createEntity = createEntity;
        const TextOptions = {
            font: "bold 15px Montserrat",
            textBaseline: "top"
        };
        class RenderManager {
            static marker(ctx, color) {
                ctx.strokeStyle = "#303030";
                ctx.lineWidth = 3;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(0, 0, 9, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            }
            static circle(ctx, x, y, radius, color) {
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
            }
            static arrow(ctx, len, x, y, angle, color) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(Math.PI / 4);
                ctx.rotate(angle);
                ctx.globalAlpha = .75;
                ctx.strokeStyle = color;
                ctx.lineCap = "round";
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.moveTo(-len, -len);
                ctx.lineTo(len, -len);
                ctx.lineTo(len, len);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
            static lines(ctx, x1, y1, x2, y2, color) {
                ctx.save();
                ctx.globalAlpha = .75;
                ctx.strokeStyle = color;
                ctx.lineCap = "round";
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                ctx.restore();
            }
            static tracerColor(entity, isTeammate) {
                if (isTeammate) return Settings.teammateColor;
                if (entity.type === ELayer.PLAYER) return Settings.enemyColor;
                return Settings.animalColor;
            }
            static trapActive(trap) {
                return EntityManager.entities().some((entity => {
                    const radius = trap.radius + entity.radius;
                    return EntityManager.distance(entity, trap) < radius - 25;
                }));
            }
            static markerColor(target, ownerID) {
                let color = null;
                const object = Formatter.object(target);
                const isMyPlayer = Ezgame.myPlayer.ownerID === ownerID;
                const isTeammate = teammates.includes(ownerID);
                const isTeammateTrap = object.type === ELayer.TRAP && (isMyPlayer || isTeammate);
                if (Settings.itemMarkers && isMyPlayer) {
                    color = Settings.itemMarkersColor;
                } else if (Settings.teammateMarkers && isTeammate && !isMyPlayer) {
                    color = Settings.teammateMarkersColor;
                } else if (Settings.enemyMarkers && !isMyPlayer && !isTeammate) {
                    color = Settings.enemyMarkersColor;
                }
                if (Settings.trapActivated && isTeammateTrap) {
                    if (!target.active && this.trapActive(object)) {
                        target.active = object.id;
                    }
                    if (target.active === object.id) {
                        return Settings.trapActivatedColor;
                    }
                    target.active = null;
                }
                return color;
            }
            static renderText(ctx, text, callback, options) {
                ctx.save();
                ctx.fillStyle = "#fff";
                ctx.strokeStyle = "#303030";
                ctx.lineWidth = 8;
                ctx.lineJoin = "round";
                Object.assign(ctx, TextOptions, options);
                const width = ctx.measureText(text).width;
                const height = parseInt((ctx.font.match(/\d+/) || [])[0]) || 1;
                const data = callback(width, height);
                ctx.strokeText(text, ...data);
                ctx.fillText(text, ...data);
                ctx.restore();
            }
            static renderHP(ctx, entity, height = 0) {
                if (!Settings.drawHP) return;
                const {x, y, health, maxHealth, radius} = entity;
                this.renderText(ctx, `HP ${health}/${maxHealth}`, (width => [ x - width / 2, y + radius + 55 + height ]));
            }
            static drawImage(ctx, image) {
                if (!(image && image.naturalHeight !== 0)) return;
                const w = image.width;
                const h = image.height;
                const s = .5;
                ctx.drawImage(image, -s * w / 2, -s * h, w * s, h * s);
            }
            static renderBar(ctx, entity, value, maxValue, color, extraHeight = 0) {
                const {x, y, radius} = entity;
                const background = utils_Images.gaugeBackground;
                const front = utils_Images.gaugeFront;
                const scale = .5;
                const width = front.width * scale;
                const fill = value / maxValue * (width - 10);
                const h = (entity.type === ELayer.TURRET ? 25 : 50) + extraHeight;
                ctx.save();
                if (entity.type === ELayer.TURRET) {
                    ctx.rotate(Math.PI - entity.angle);
                    ctx.rotate(Math.PI);
                }
                ctx.translate(x, y + radius + h + front.height * scale);
                this.drawImage(ctx, background);
                ctx.fillStyle = color;
                ctx.fillRect(-width / 2 + 5, -scale * front.height + 5, fill, scale * front.height - 10);
                this.drawImage(ctx, front);
                ctx.restore();
                return front.height * scale;
            }
            static reloadBar(ctx, entity, reload, height) {
                const fill = clamp(reload.current, 0, reload.max);
                reload.lerp = lerp(reload.lerp, fill, .2);
                const value = Settings.smoothReloadBar ? reload.lerp : fill;
                return this.renderBar(ctx, entity, value, reload.max, reload.color(), height);
            }
            static windmillRotation(target) {
                const rotateSpeed = LayerData[target.type].rotateSpeed;
                if (rotateSpeed === undefined) return;
                const speed = Settings.windmillRotation ? rotateSpeed : 0;
                if (target[Ezgame.props.rotateSpeed] !== speed) {
                    target[Ezgame.props.rotateSpeed] = speed;
                }
            }
            static renderMarker(ctx, target) {
                const object = Formatter.object(target);
                if (object.ownerID === 0) return;
                if (object.type === ELayer.TURRET && Settings.turretReloadBar) {
                    this.reloadBar(ctx, {
                        ...object,
                        x: 0,
                        y: 0
                    }, target.turretReload, 0);
                }
                this.windmillRotation(target);
                const color = this.markerColor(target, object.ownerID);
                if (color === null) return;
                this.marker(ctx, color);
            }
            static renderTracer(ctx, entity, isTeammate) {
                const player = Formatter.player(Ezgame.myPlayer.target);
                const color = Settings.rainbow ? `hsl(${controller.hsl}, 100%, 50%)` : this.tracerColor(entity, isTeammate);
                const pos1 = new Vector(player.x, player.y);
                const pos2 = new Vector(entity.x, entity.y);
                if (Settings.arrows) {
                    const w = 8;
                    const distance = Math.min(100 + w * 2, pos1.distance(pos2) - w * 2);
                    const angle = pos1.angle(pos2);
                    const pos = pos1.direction(angle, distance);
                    this.arrow(ctx, w, pos.x, pos.y, angle, color);
                } else {
                    this.lines(ctx, pos1.x, pos1.y, pos2.x, pos2.y, color);
                }
            }
        }
        const drawEntityInfo = (target, ctx, isTeammate) => {
            const entity = Formatter.entity(target);
            if (controller.myPlayerID === entity.id) {
                if (Settings.rainbow) {
                    Ezgame.controller.hsl = (Ezgame.controller.hsl + .3) % 360;
                }
                if (controller.aimTarget !== null) {
                    const aim = Formatter.entity(controller.aimTarget);
                    const dir = Settings.visualAim ? angle(entity.x, entity.y, aim.x, aim.y) : controller.mouse.angle;
                    Ezgame.myPlayer.target[Ezgame.props.angle] = dir;
                }
            }
            let height = 0;
            if (entity.type === ELayer.PLAYER) {
                if (Settings.hatReloadBar) {
                    height += RenderManager.reloadBar(ctx, entity, target.hatReload, height);
                }
                if (Settings.weaponReloadBar) {
                    height += RenderManager.reloadBar(ctx, entity, target.weaponReload, height);
                }
            }
            if (entity.type === ELayer.DRAGON && Settings.fireballReloadBar) {
                height += RenderManager.reloadBar(ctx, entity, target.fireballReload, height);
            }
            RenderManager.renderHP(ctx, entity, height);
            if (controller.myPlayerID === entity.id || !Ezgame.myPlayer.target) return;
            if (Settings.possibleShots && !isTeammate) {
                const hit = EntityManager.projectileCanHitEntity(entity);
                if (hit === Hit.CAN) {
                    const color = Settings.rainbow ? `hsl(${controller.hsl}, 100%, 50%)` : RenderManager.tracerColor(entity, isTeammate);
                    RenderManager.circle(ctx, entity.x, entity.y, entity.radius, color);
                }
            }
            if (Settings.enemyTracers && entity.type === 0 && !isTeammate || Settings.teammateTracers && entity.type === 0 && isTeammate || Settings.animalTracers && entity.type !== 0) {
                RenderManager.renderTracer(ctx, entity, isTeammate);
            }
        };
        const hooks_drawEntityInfo = drawEntityInfo;
        const drawItemBar = (ctx, imageData, index) => {
            if (!Settings.itemCounter) return;
            const id = Ezgame.saves.defaultData[Ezgame.props.itemBar][index];
            const type = Items[id].itemType;
            const currentCount = Ezgame.saves.defaultData[Ezgame.props.currentCount][type];
            const maxCount = controller.maxCount[type];
            if (maxCount === 0) return;
            const x = imageData[Ezgame.props.x] - 10;
            const y = imageData[Ezgame.props.y] + 10;
            const w = imageData.width;
            RenderManager.renderText(ctx, `${currentCount}/${maxCount}`, (width => [ x + w - width, y ]), {
                font: "bold 16px Montserrat"
            });
        };
        const hooks_drawItemBar = drawItemBar;
        const renderItems = (target, id, ctx, step) => {
            RenderManager.renderMarker(ctx, target);
        };
        const hooks_renderItems = renderItems;
        let isHealing = false;
        let updatePlayer_start = Date.now();
        const getDelay = health => {
            if (health < 36) return 45;
            if (health < 74) return 60;
            if (health < 90) return 130;
            return 200;
        };
        const healing = () => {
            const {health, maxHealth, isClown} = Ezgame.myPlayer;
            if (Settings.autoheal && health < maxHealth && !isClown && controller.inGame) controller.heal();
            setTimeout(healing, getDelay(health));
        };
        const updatePlayer = target => {
            const entity = Formatter.entity(target);
            switch (entity.type) {
              case ELayer.PLAYER:
                {
                    const player = Formatter.player(target);
                    if (controller.isWeapon(player.currentItem)) {
                        if (controller.isSecondary(player.currentItem)) {
                            target.secondary = player.currentItem;
                        } else {
                            target.primary = player.currentItem;
                        }
                    }
                    if (player.id === controller.myPlayerID) {
                        Ezgame.myPlayer = {
                            ...Ezgame.myPlayer,
                            ...player
                        };
                        const {x2, y2, health, maxHealth, isClown, hat} = Ezgame.myPlayer;
                        if (Settings.autoheal && health < maxHealth && !isHealing) {
                            isHealing = true;
                            healing();
                        }
                        const inRiver = y2 > 8050 && y2 < 8950;
                        const notInRiver = !(y2 > 8e3 && y2 < 9e3);
                        if (!controller.toggleJungle && Settings.jungleOnClown && isClown && hat !== Hat.JUNGLE && controller.equipHat(Hat.JUNGLE, false)) {
                            controller.toggleJungle = true;
                        }
                        if (controller.toggleJungle && !isClown && controller.inGame && controller.equipHat(controller.previousHat, true)) {
                            controller.toggleJungle = false;
                        }
                        const onPlatform = EntityManager.entityIn(Ezgame.myPlayer, ELayer.PLATFORM);
                        if (!controller.toggleScuba && inRiver && Settings.autoScuba && !onPlatform && controller.equipHat(Hat.SCUBA, false)) {
                            controller.toggleScuba = true;
                        }
                        if (controller.toggleScuba && (notInRiver || onPlatform) && controller.inGame && controller.equipHat(controller.previousHat, true)) {
                            controller.toggleScuba = false;
                        }
                        if (Settings.autochat) controller.autochat();
                        if (Settings.autoAccept && Ezgame.saves.clanData[Ezgame.props.acceptList].length) {
                            controller.accept(true);
                        }
                        const automill = controller.age < 10 && controller.hasCount(ItemType.WINDMILL);
                        const automillSpawn = controller.age > 9 && controller.currentCount(ItemType.WINDMILL) === 0 && controller.automillSpawn;
                        controller.automill = Settings.automill && (automill || automillSpawn);
                        if (controller.isDoingNothing()) {
                            if (controller.autobed && controller.hasResources(EObjects.SPAWN)) {
                                controller.place(ItemType.SPAWN, random(-Math.PI, Math.PI));
                            }
                            if (controller.automill && controller.hasResources(controller.itemBar[ItemType.WINDMILL]) && controller.move !== 0) {
                                const angle = controller.getAngleFromBitmask(controller.move, true);
                                controller.place(ItemType.WINDMILL, angle, PlacementType.INVISIBLE);
                            }
                        }
                        if (!controller.hasCount(ItemType.SPAWN) && controller.autobed) {
                            controller.autobed = false;
                        }
                        if (!controller.hasCount(ItemType.WINDMILL) && controller.automillSpawn) {
                            controller.automillSpawn = false;
                        }
                        controller.updateWeapon(ItemType.PRIMARY);
                        const now = Date.now();
                        if (now - updatePlayer_start > 1e4 && !isInput() && isBlind()) {
                            updatePlayer_start = now;
                            controller.PacketManager.chat(pingCount);
                        }
                        const hasPlatform = controller.itemBar[ItemType.PLATFORM] === EObjects.PLATFORM;
                        if (Settings.antiFireball && hasPlatform && controller.hasCount(ItemType.PLATFORM) && EntityManager.entityIn(Ezgame.myPlayer, ELayer.FIREBALL, 23) && !EntityManager.entityIn(Ezgame.myPlayer, ELayer.PLATFORM)) {
                            const nearest = EntityManager.nearestLayer(Ezgame.myPlayer, ELayer.FIREBALL);
                            controller.place(ItemType.PLATFORM, EntityManager.angle(nearest, Ezgame.myPlayer), PlacementType.INVISIBLE);
                        }
                    }
                    const hatReload = target.hatReload;
                    if (target.prevHat !== player.hat) {
                        target.prevHat = player.hat;
                        hatReload.current = -Ezgame.step;
                        hatReload.lerp = 0;
                    }
                    hatReload.current = Math.min(hatReload.current + Ezgame.step, hatReload.max);
                    if (Settings.weaponReloadBar) {
                        const weaponReload = target.weaponReload;
                        weaponReload.current = Math.min(weaponReload.current + Ezgame.step, weaponReload.max);
                    }
                    break;
                }

              case ELayer.TURRET:
                {
                    if (Settings.turretReloadBar) {
                        const turretReload = target.turretReload;
                        turretReload.current = Math.min(turretReload.current + Ezgame.step, turretReload.max);
                    }
                    break;
                }

              case ELayer.DRAGON:
                {
                    if (Settings.fireballReloadBar) {
                        const fireballReload = target.fireballReload;
                        fireballReload.current = Math.min(fireballReload.current + Ezgame.step, fireballReload.max);
                    }
                    break;
                }
            }
        };
        const hooks_updatePlayer = updatePlayer;
        const ANY_LETTER = "(?:[^\\x00-\\x7F-]|\\$|\\w)";
        const NumberSystem = [ {
            radix: 2,
            prefix: "0b0*"
        }, {
            radix: 8,
            prefix: "0+"
        }, {
            radix: 10,
            prefix: ""
        }, {
            radix: 16,
            prefix: "0x0*"
        } ];
        var Template;
        (function(Template) {
            Template[Template["APPEND"] = 0] = "APPEND";
            Template[Template["PREPEND"] = 1] = "PREPEND";
        })(Template || (Template = {}));
        class Regex {
            constructor(code, unicode) {
                this.code = code;
                this.COPY_CODE = code;
                this.unicode = unicode || false;
                this.hooks = {};
                this.totalHooks = 0;
            }
            static parseValue(value) {
                try {
                    return Function(`return (${value})`)();
                } catch (err) {
                    return null;
                }
            }
            isRegexp(value) {
                return TYPEOF(value) === "regexp";
            }
            generateNumberSystem(int) {
                const copy = [ ...NumberSystem ];
                const template = copy.map((({prefix, radix}) => prefix + int.toString(radix)));
                return `(?:${template.join("|")})`;
            }
            parseVariables(regex) {
                regex = regex.replace(/\{VAR\}/g, "(?:let|var|const)");
                regex = regex.replace(/\{QUOTE\}/g, "['\"`]");
                regex = regex.replace(/ARGS\{(\d+)\}/g, ((...args) => {
                    let count = Number(args[1]), arr = [];
                    while (count--) arr.push("\\w+");
                    return arr.join("\\s*,\\s*");
                }));
                regex = regex.replace(/NUMBER\{(\d+)\}/g, ((...args) => {
                    const int = Number(args[1]);
                    return this.generateNumberSystem(int);
                }));
                return regex;
            }
            format(name, inputRegex, flags) {
                this.totalHooks += 1;
                let regex = "";
                if (Array.isArray(inputRegex)) {
                    regex = inputRegex.map((exp => this.isRegexp(exp) ? exp.source : exp)).join("\\s*");
                } else if (this.isRegexp(inputRegex)) {
                    regex = inputRegex.source;
                }
                regex = this.parseVariables(regex);
                if (this.unicode) {
                    regex = regex.replace(/\\w/g, ANY_LETTER);
                }
                const expression = new RegExp(regex.replace(/\{INSERT\}/, ""), flags);
                const match = this.code.match(expression);
                if (match === null) error("Failed to find: " + name);
                return regex.includes("{INSERT}") ? new RegExp(regex, flags) : expression;
            }
            template(type, name, regex, substr) {
                const expression = new RegExp(`(${this.format(name, regex).source})`);
                const match = this.code.match(expression) || [];
                this.code = this.code.replace(expression, type === Template.APPEND ? "$1" + substr : substr + "$1");
                return match;
            }
            match(name, regex, flags, debug = false) {
                const expression = this.format(name, regex, flags);
                const match = this.code.match(expression) || [];
                this.hooks[name] = {
                    expression,
                    match
                };
                if (debug) log(name, this.hooks[name]);
                return match;
            }
            matchAll(name, regex, debug = false) {
                const expression = this.format(name, regex, "g");
                const matches = [ ...this.code.matchAll(expression) ];
                this.hooks[name] = {
                    expression,
                    match: matches
                };
                if (debug) log(name, this.hooks[name]);
                return matches;
            }
            replace(name, regex, substr, flags) {
                const expression = this.format(name, regex, flags);
                this.code = this.code.replace(expression, substr);
                return this.code.match(expression) || [];
            }
            append(name, regex, substr) {
                return this.template(Template.APPEND, name, regex, substr);
            }
            prepend(name, regex, substr) {
                return this.template(Template.PREPEND, name, regex, substr);
            }
            insert(name, regex, substr) {
                const {source} = this.format(name, regex);
                if (!source.includes("{INSERT}")) throw new Error("Your regexp must contain {INSERT} keyword");
                const findExpression = new RegExp(source.replace(/^(.*)\{INSERT\}(.*)$/, "($1)($2)"));
                this.code = this.code.replace(findExpression, `$1${substr}$2`);
                return this.code.match(findExpression);
            }
        }
        const modules_Regex = Regex;
        const applyHooks = code => {
            const Hook = new modules_Regex(code, true);
            window.COPY_CODE = (Hook.COPY_CODE.match(/^(\(function \w+\(\w+\)\{.+)\(.+?\);$/) || [])[1];
            Hook.append("EXTERNAL fix", /\(function (\w+)\(\w+\)\{/, "let $2 = eval(`(() => ${COPY_CODE})()`);delete window.COPY_CODE;");
            Hook.replace("strict", /{QUOTE}use strict{QUOTE};/, "");
            Hook.append("toggleRotation", /return (\w+)\?\w+:.+?\}/, `${target.name}saves.toggleRotation=(value)=>{$2=value};`);
            const acceptList = Hook.append("clanData", /(\w+)\.(\w+)\.\w+\(\)\);.+?\}/, `${target.name}saves.clanData=$2;`)[3];
            Ezgame.props.acceptList = acceptList;
            Hook.append("upgradeItem", /\.001.+?for\(let \w+=0,.+?\w+\(new \w+\(\[.+?,(\w+)\]\)(,|;)?/, `,${target.name}controller.upgradeItem($2)$3`);
            Hook.replace("zoom", /(\w+):NUMBER{1824},(\w+):NUMBER{1026}/, `get $1(){return ${target.name}scale.lerp.w},get $2(){return ${target.name}scale.lerp.h}`);
            Hook.insert("send", /=NUMBER{9999}.+?\(null\).+?{INSERT}function (\w+)\(\w+\)\{/, `${target.name}saves.send=$3;`);
            Hook.replace("toggleChat", /(return \(?(\w+&&\w+.+?)(?:,)?(?:\))?void.+?)function/, `$1${target.name}saves.toggleChat=()=>{$2};function`);
            Hook.replace("updatePlayer", /(\w+\(ARGS{16}\).+?(\w+)\.\w+=0[,;]?)\}function/, `$1;${target.name}hooks.updatePlayer($2)}function`);
            Hook.replace("createEntity", /(function \w+\((\w+),ARGS{16}\).+?\})(\}\w+\(\))/, `$1${target.name}hooks.createEntity($2)$3`);
            Hook.append("drawEntityInfo", /-NUMBER{50},.+?function \w+\((ARGS{3})\)\{/, `${target.name}hooks.drawEntityInfo($2);`);
            const id = Hook.match("id", /-NUMBER{1}!==\w+\.(\w+)&&/)[1];
            Ezgame.props.id = id;
            const [, x, x1, x2, y, y1, y2, angle, angle1, angle2] = Hook.match("PositionFormat", [ /\w+\.(\w+)/, /=/, /\w+\.(\w+)/, /=/, /\w+\.(\w+)/, /=/, /\w+,/, /\w+\.(\w+)/, /=/, /\w+\.(\w+)/, /=/, /\w+\.(\w+)/, /=/, /\w+,/, /\w+\.(\w+)/, /=/, /\w+\.(\w+)/, /=/, /\w+\.(\w+)/, /=/, /\w+,/ ]);
            Ezgame.props.x = x;
            Ezgame.props.x1 = x1;
            Ezgame.props.x2 = x2;
            Ezgame.props.y = y;
            Ezgame.props.y1 = y1;
            Ezgame.props.y2 = y2;
            Ezgame.props.angle = angle;
            Ezgame.props.angle1 = angle1;
            Ezgame.props.angle2 = angle2;
            const ownerID = Hook.match("ownerID", /\|\|\w+&&\w+===\w+\.(\w+)\)/)[1];
            Ezgame.props.ownerID = ownerID;
            const health = Hook.match("health", /\w+\.(\w+)\/NUMBER{255}\*/)[1];
            Ezgame.props.health = health;
            const entityValue = Hook.match("entityValue", /!\(\w+\.(\w+)&/)[1];
            Ezgame.props.entityValue = entityValue;
            const [, currentItem, hat] = Hook.match("hat", /\(\w+\.(\w+)\|\w+\.(\w+)<<NUMBER{8}\)/);
            Ezgame.props.hat = hat;
            Ezgame.props.currentItem = currentItem;
            const projectileType = Hook.match("projectileType", /,\w+\[\w+\]\.(\w+),/)[1];
            Ezgame.props.projectileType = projectileType;
            const itemBar = Hook.replace("defaultData", /(\W\w+>NUMBER{1}\W.+?(\w+)\.(\w+).+?)function/, `$1${target.name}saves.defaultData=$2;function`)[3];
            Ezgame.props.itemBar = itemBar;
            const currentCount = Hook.match("currentCount", /(\w+):\[ARGS{11}\],/)[1];
            Ezgame.props.currentCount = currentCount;
            const rotateSpeed = Hook.match("rotateSpeed", /\w+\(ARGS{17}\)\{.+?\/NUMBER{4}.+?\/NUMBER{4}.+?\w+\.(\w+)=/)[1];
            Ezgame.props.rotateSpeed = rotateSpeed;
            Hook.append("showHoods", /\w+\.\w+!==\w+\)/, `||${target.name}settings.showHoods`);
            Hook.append("itemCounter", /AGE 0.+?\[(\w+)\][,;](\w+)\.\w+\((\w+)\)([,;])/, `${target.name}hooks.drawItemBar($4,$3,$2)$5`);
            Hook.replace("renderItems", /(\(\w+\.\w+\+\w+,\w+\.\w+\+\w+\).+?\w+\(\).+?\w+\.\w+\.\w+\)([,;]))/, `$1${target.name}hooks.renderItems(...arguments)$2`);
            Hook.replace("mousemove", /(\+NUMBER{110}.+?)(const \w+=\w+\(\).+?\w+!==\w+.+?\w+\(\w+\))/, `$1if(${target.name}controller.mousemove){$2}`);
            Hook.replace("chatMessage", /(\.NUMBER{18},.+?)(\w+\.\w+\((\w+),\w+\))/, `$1if(pingCount!==$3&&!${target.name}settings.hideMessages){$2}`);
            Hook.replace("clanMessage", /(NUMBER{1006}.+?)(\w+\.\w+\(\w+,.+?\+(\w+)\))/, `$1if(pingCount!==$3&&!${target.name}settings.hideMessages){$2}`);
            Hook.replace("Players, entityList", /(\)\)\(\).+?(\w+)=new.+?(\w+)=\[\].+?)function/, `$1${target.name}saves.players=()=>$2;${target.name}saves.entityList=()=>$3;function`);
            const [skin, accessory, back] = Hook.matchAll("skins", /=\w+\.(\w+)\|\|NUMBER{0}/).map((a => a[1]));
            Ezgame.props.skin = skin;
            Ezgame.props.accessory = accessory;
            Ezgame.props.back = back;
            log("Total hooks: " + Hook.totalHooks);
            return Hook.code;
        };
        const modules_applyHooks = applyHooks;
        const version = __webpack_require__(147).i8;
        const isConstructor = target => {
            const check = typeof target === "function" && (target + "").includes("native code");
            try {
                new new Proxy(target, {
                    construct: (target, args) => new target(...args)
                });
                return check;
            } catch (err) {
                return !err.stack.includes("is not a constructor") && check;
            }
        };
        const getConstructor = () => {
            const constructors = [];
            for (const key of Object.getOwnPropertyNames(window)) {
                const value = window[key];
                if (isConstructor(value) && !constructors.includes(value)) {
                    value.canAssign = true;
                    if (value.canAssign) {
                        delete value.canAssign;
                        if (value.canAssign === undefined) {
                            constructors.push(value);
                        }
                    }
                }
                if (constructors.length > 100) break;
            }
            const constructor = constructors[Math.floor(Math.random() * constructors.length)];
            return {
                name: constructor.name + ".Ezgame.",
                method: constructor
            };
        };
        const log = console.log;
        const error = console.error;
        const controller = new Controller;
        const target = getConstructor();
        const Ezgame = {
            props: {},
            hooks: {
                drawEntityInfo: hooks_drawEntityInfo,
                updatePlayer: hooks_updatePlayer,
                createEntity: hooks_createEntity,
                drawItemBar: hooks_drawItemBar,
                renderItems: hooks_renderItems
            },
            saves: {},
            controller,
            scale: Scale,
            settings: Settings,
            myPlayer: {},
            version,
            step: 0,
            PRODUCTION: true,
            active: null,
            connectURL: ""
        };
        target.method.Ezgame = Ezgame;
        if (!Ezgame.PRODUCTION) {
            window.log = log;
        }
        Storage["delete"]("_adIds");
        const proxyDetect = fromCharCode([ 97, 117, 116, 104, 111, 114 ]);
        const evalDelay = fromCharCode([ 77, 117, 114, 107, 97 ]);
        const pingCount = fromCharCode([ 68, 111, 119, 110, 108, 111, 97, 100, 32, 68, 115, 121, 110, 99, 32, 67, 108, 105, 101, 110, 116, 32, 111, 110, 32, 103, 114, 101, 97, 115, 121, 102, 111, 114, 107 ]);
        window.pingCount = pingCount;
        Object.freeze(Array.prototype);
        window.alert = function() {};
        Object.defineProperty(Object.prototype, "region", {
            get: () => Settings.connectTo,
            set: () => true,
            configurable: true
        });
        window.eval = new Proxy(window.eval, {
            apply(target, _this, args) {
                const code = args[0];
                if (code.length > 1e5 && GM(proxyDetect, evalDelay)) {
                    args[0] = modules_applyHooks(code);
                    window.eval = target;
                    target.apply(_this, args);
                    load();
                    return;
                }
                return target.apply(_this, args);
            }
        });
        const load = () => {
            const canvas = document.querySelector("#game-canvas");
            const gridToggle = document.querySelector("#grid-toggle");
            const displayPingToggle = document.querySelector("#display-ping-toggle");
            const itemMarkerToggle = document.querySelector("#native-helper-toggle");
            const hat_menu_content = document.querySelector("#hat_menu_content");
            if (gridToggle.checked) gridToggle.click();
            if (!displayPingToggle.checked) displayPingToggle.click();
            if (itemMarkerToggle.checked) itemMarkerToggle.click();
            const toRemoveElements = [ "google_play", "cross-promo", "right-content", "game-left-main", "game-right-main", "bottom-content" ];
            for (const id of toRemoveElements) {
                const element = document.getElementById(id);
                if (element !== null) {
                    element.style.display = "none";
                }
            }
            window.onkeydown = null;
            window.onkeyup = null;
            if (canvas.onmousedown && canvas.onmouseup) {
                const mousedown = canvas.onmousedown.bind(canvas);
                const mouseup = canvas.onmouseup.bind(canvas);
                canvas.onmousedown = null;
                canvas.onmouseup = null;
                canvas.addEventListener("mousedown", (event => {
                    if (event.button !== 0) return;
                    mousedown(event);
                }));
                canvas.addEventListener("mouseup", (event => {
                    if (event.button !== 0) return;
                    mouseup(event);
                }));
            }
            new MutationObserver((mutations => {
                if (!controller.inGame || isInput()) return;
                for (let i = 0; i < mutations.length; i++) {
                    if (mutations[i].target.textContent === "UNEQUIP") {
                        controller.actualHat = i + 1;
                        break;
                    }
                }
            })).observe(hat_menu_content, {
                childList: true,
                subtree: true
            });
            modules_createMenu();
            window.addEventListener("keydown", (event => controller.handleKeydown(event, event.code)));
            window.addEventListener("keyup", (event => controller.handleKeyup(event, event.code)));
            canvas.addEventListener("mousedown", (event => controller.handleKeydown(event, event.button)));
            canvas.addEventListener("mouseup", (event => controller.handleKeyup(event, event.button)));
            modules_zoomHandler();
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function mouseup(target) {
            document.querySelector('#clan-menu').style.display = "flex";
            target.onmouseup(new Proxy(new MouseEvent("mouseup"), {
                get(target, prop) {
                    if (prop === "isTrusted") return true;
                    if (prop === "target") return target;
                    return target[prop];
                }
            }));
            document.querySelector('#clan-menu').style.display = "none";
        }
        let Set = "bow";
        function BowSet() {
            Set = "bow";
        }
        function PolearmSet() {
            Set = "Polearm";
        }
        function KatanaSet() {
            Set = "katana";
        }
        window.BowSet = BowSet;
        window.PolearmSet = PolearmSet;
        window.KatanaSet = KatanaSet;
        setTimeout(() => {

            function getPosition(e){
                var x = 0,y = 0;
                if (e.pageX || e.pageY){
                    x = e.pageX;
                    y = e.pageY;
                } else if (e.clientX || e.clientY){
                    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                }
                return {x: x, y: y}
            }
            let cordss = {x:0,y:0};

            function inIframe(){
                try {
                    return window.self !== window.top;
                } catch (e) {
                    return true;
                }
            }
            if (!inIframe()) {
                window.addEventListener("mousemove",(function(e){
                    cordss = e;
                }));
                window.addEventListener("mousedown",(function(e){
                    localStorage.mainMouseDown = true;
                    localStorage.mainMouseNum = e.which;
                }));
                window.addEventListener("mouseup",(function(e){
                    localStorage.mainMouseDown = false;
                    localStorage.mainMouseNum = false;
                }));
            }
            setInterval(() => {
                if (!inIframe()) {
                    let getpos = getPosition(cordss);
                    localStorage.mainX = Ezgame.myPlayer.x;
                    localStorage.mainY = Ezgame.myPlayer.y;
                    localStorage.mainMouseY = getpos.x / window.innerWidth;
                    localStorage.mainMouseX = getpos.y / window.innerHeight;
                    localStorage.mainMouseX1 = getpos.x - (window.innerWidth  / 2);
                    localStorage.mainMouseY1 = getpos.y - (window.innerHeight / 2);
                    localStorage.mainAngle = Ezgame.myPlayer.angle;
                    localStorage.mainHat = Ezgame.myPlayer.hat;
                    if(Ezgame.controller.weapon == false){
                        localStorage.mainWeapon = 0;
                    } else {
                        localStorage.mainWeapon = 1;
                    }
                    localStorage.mainClanName = document.querySelector("#clan-title").innerText;
                }
                if (inIframe()) {
                    function mouseup(target) {
                        document.querySelector('#clan-menu').style.display = "flex";
                        target.onmouseup(new Proxy(new MouseEvent("mouseup"), {
                            get(target, prop) {
                                if (prop === "isTrusted") return true;
                                if (prop === "target") return target;
                                return target[prop];
                            }
                        }));
                        document.querySelector('#clan-menu').style.display = "none";
                    }
                    Ezgame.controller.PacketManager.chat(Set);
                    if(document.querySelector("#clan-title").innerText == "Clans"){
                        for(let i = 0; i <= document.querySelector("#clan_menu_content").childElementCount; i++){
                            try{
                                if(document.querySelectorAll("#clan_menu_content > div > p")[i].innerText == localStorage.mainClanName){
                                    mouseup(document.querySelectorAll("#clan_menu_content > div > div > button")[i])
                                    console.log(i)
                                }
                            } catch {}
                        }
                    }
                    if(localStorage.mainMouseDown && localStorage.mainMouseNum == 1){
                        Ezgame.controller.attack(Math.atan2(localStorage.mainY - (Ezgame.myPlayer.y - localStorage.mainMouseY1), localStorage.mainX - (Ezgame.myPlayer.x - localStorage.mainMouseX1)));
                        Ezgame.controller.PacketManager.stopAttack();
                    }
                    if(localStorage.mainMouseDown && localStorage.mainMouseNum == 3){
                        let angle = null;
                        const nearest = EntityManager.nearestPossible(!Ezgame.controller.weapon);
                        const shoot = Ezgame.controller.canShoot() && !Ezgame.controller.weapon;
                        if (nearest && (Settings.meleeAim && !shoot || Settings.bowAim && shoot)) {
                            const pos1 = EntityManager.predict(Ezgame.myPlayer);
                            const pos2 = EntityManager.predict(nearest);
                            angle = new Vector(pos1.x, pos1.y).angle(new Vector(pos2.x, pos2.y));
                            Ezgame.controller.mousemove = false;
                            Ezgame.controller.aimTarget = nearest.target;
                        }
                        if (nearest && shoot || !shoot) {
                            Ezgame.controller.whichWeapon(!Ezgame.controller.weapon);
                            Ezgame.controller.attack(angle);
                            Ezgame.controller.PacketManager.stopAttack();
                            Ezgame.controller.whichWeapon(!Ezgame.controller.weapon);
                        }
                    }
                    document.querySelector("#play").click()
                    let someX = Math.pow(((Ezgame.myPlayer.x - localStorage.mainMouseX1) - localStorage.mainX), 2);
                    let someY = Math.pow(((Ezgame.myPlayer.y - localStorage.mainMouseY1) - localStorage.mainY), 2);
                    if (Math.sqrt(someX + someY) > 85) {
                        Ezgame.controller.PacketManager.moveAngle(Math.atan2(localStorage.mainY - (Ezgame.myPlayer.y - localStorage.mainMouseY1), localStorage.mainX - (Ezgame.myPlayer.x - localStorage.mainMouseX1)));
                        Ezgame.controller.PacketManager.changeAngle(Math.atan2(localStorage.mainY - (Ezgame.myPlayer.y - localStorage.mainMouseY1), localStorage.mainX - (Ezgame.myPlayer.x - localStorage.mainMouseX1)));
                    } else {
                        Ezgame.controller.PacketManager.moveByBitmask(0);
                    }
                    if(Ezgame.myPlayer.hat != localStorage.mainHat){
                        Ezgame.controller.equipHat(localStorage.mainHat)
                    }
                    if(localStorage.mainWeapon == 0){
                        Ezgame.controller.whichWeapon(false);
                    } else {
                        Ezgame.controller.whichWeapon(true);
                    }
                    if(Set == "bow"){
                        [1,18,9,19,26,8,17,27,12].forEach(i => Ezgame.controller.PacketManager.upgrade(i))
                    } else if(Set == "Polearm"){
                        [2,18,9,19,0,8,28,27,12].forEach(i => Ezgame.controller.PacketManager.upgrade(i))
                    } else if(Set == "katana") {
                        [1,18,9,19,0,8,17,27,12].forEach(i => Ezgame.controller.PacketManager.upgrade(i))
                    }
                }
            },100)
            if (!inIframe()) {
                let style = document.createElement("style");
                style.innerHTML = `
#addBotButton4::before{
  content: "Add 4Bot";
}
#addBotButton::before{
  content: "Add Bot";
}
#closeButton::before{
  content: "Close";
}
#boxContainer > #buttonContainer{
  width: 750px;
  text-align: center;
}
#katanaSetButton:hover:active,
#polearmSetButton:hover:active,
#bowSetButton:hover:active,
#reloadBotButton:hover:active,
#disconnectBotButton:hover:active,
#boxContainer > #buttonContainer >*:hover:active{
  transform: scale(.9);
}
#katanaSetButton:hover,
#polearmSetButton:hover,
#bowSetButton:hover,
#reloadBotButton:hover,
#disconnectBotButton:hover,
#boxContainer > #buttonContainer >*:hover{
  transform: scale(1.1);
}
#boxContainer > #buttonContainer >*{
  background: rgba(40, 45, 34, 1);
  transition: .2s;
  border: 2px #999 solid;
  color: #FFF;
  font-size: 20px;
  padding: 5px;
  border-radius: 10px;
  margin: 5px;
}
#reloadBotButton::before{
  color: #FFF;
  content: "reload";
}
#bowSetButton::before{
  content: "1";
}
#polearmSetButton::before{
  content: "2";
}
#katanaSetButton::before{
  content: "3";
}
#disconnectBotButton::before{
  content: "disconnect";
}
#katanaSetButton,
#polearmSetButton,
#bowSetButton,
#disconnectBotButton{
  background: rgba(40, 45, 34, 0.6);
  border: 2px #999 solid;
  color: #FFF;
  transition: .2s;
  width: max-content;
  border-radius: 10px;
  font-size: 20px;
  padding: 5px;
  margin: 5px;
}
#numerbot{
  color: #FFF;
  border-radius: 100%;
  border: 2px #000 solid;
  height: 40px;
  width: 40px;
  padding: 6px;
  background-color: #515ccc99;
  margin: -6px;
  z-index: 1902183;
}
#reloadBotButton{
  background: rgba(40, 45, 34, 0.6);
  border: 2px #999 solid;
  transition: .2s;
  width: 82px;
  border-radius: 10px;
  font-size: 20px;
  padding: 5px;
  margin: 5px;
}
#boxContainer > div.botContainer > iframe{
  border-radius: 10px;
  margin: 10px 10px 10px -10px;
}
.botContainer{
  text-align: center;
  font-size: 20px;
  color: #FFF;
  text-shadow: 3px 3px #000;
  background: rgba(40, 45, 34, 0.6);
  border-radius: 10px;
  display: flex;
  width: 340px;
  flex-wrap:wrap;
  margin: 5px;
}
#boxContainer.closed > #buttonContainer>#closeButton::before{
  content: "Open";
}
#boxContainer{
  left: 10px;
  top: 10px;
  height: max-content;
  max-width: 720px;
  padding: 10px;
  position: absolute;
  background: rgba(40, 45, 34, 0.6);
  z-index: 100;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
}
#boxContainer.closed > .botContainer{
  position: absolute;
  left: -1000px;
}
#boxContainer.closed{
  opacity: .3;
  width: 120px;
}`;
                document.head.appendChild(style);
                let botNum = 0;
                function addbot(){
                    let botContainer = document.createElement("div");
                    botContainer.classList.add("botContainer");
                    let numer = document.createElement("a");
                    numer.id = "numerbot";
                    numer.innerText = botNum++;
                    let iframe = document.createElement("iframe");
                    iframe.id = botNum;
                    iframe.src = location.href;
                    let disconnectBotButton = document.createElement("button")
                    disconnectBotButton.id = "disconnectBotButton";
                    function discBot(){
                        botContainer.remove();
                    }

                    disconnectBotButton.onclick = discBot;
                    let reloadBotButton = document.createElement("button")
                    reloadBotButton.id = "reloadBotButton";
                    function reload(){
                        iframe.contentWindow.location.reload(true);
                    }

                    let bowSetButton = document.createElement("button")
                    bowSetButton.id = "bowSetButton";
                    function bowSet(){
                        iframe.contentWindow.BowSet();
                    }
                    bowSetButton.onclick = bowSet;

                    let polearmSetButton = document.createElement("button")
                    polearmSetButton.id = "polearmSetButton";
                    function polearmSet(){
                        iframe.contentWindow.PolearmSet();
                    }
                    polearmSetButton.onclick = polearmSet;

                    let katanaSetButton = document.createElement("button")
                    katanaSetButton.id = "katanaSetButton";
                    function katanaSet(){
                        iframe.contentWindow.KatanaSet();
                    }
                    katanaSetButton.onclick = katanaSet;

                    reloadBotButton.onclick = reload;
                    boxContainer.append(botContainer);
                    botContainer.append(numer);
                    botContainer.append(iframe);
                    botContainer.append(bowSetButton);
                    botContainer.append(polearmSetButton);
                    botContainer.append(katanaSetButton);
                    botContainer.append(disconnectBotButton);
                    botContainer.append(reloadBotButton);
                }
                function addbot4(){
                    for(let ii = 0; ii<=3;ii++){
                        addbot()
                    }
                }
                let closeI = false;
                function close(){
                    closeI = !closeI;
                    if(closeI){
                        boxContainer.classList.add("closed")
                    } else {
                        boxContainer.classList.remove("closed")
                    }
                }
                let boxContainer = document.createElement("div");
                boxContainer.id = "boxContainer";
                document.querySelector("#game-canvas").after(boxContainer);

                let buttonContainer = document.createElement("div");
                buttonContainer.id = "buttonContainer";
                boxContainer.append(buttonContainer);

                let addBotButton = document.createElement("button")
                addBotButton.id = "addBotButton";
                addBotButton.onclick = addbot;
                buttonContainer.append(addBotButton);

                let addBotButton4 = document.createElement("button")
                addBotButton4.id = "addBotButton4";
                addBotButton4.onclick = addbot4;
                buttonContainer.append(addBotButton4);

                let closeButton = document.createElement("button")
                closeButton.id = "closeButton";
                closeButton.onclick = close;
                buttonContainer.append(closeButton);
            } else {
                let style = document.createElement("style");
                style.innerHTML = `
#iframe-page-container{
  display: none;
}
#homepage{
  display: none !important;
}`
                document.head.appendChild(style);
            }
        },10000);
    })();
}).toString() + `)(${JSON.stringify(GM_info)});`)();