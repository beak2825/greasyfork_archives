// ==UserScript==
// @name         YouTube Watch Tracker v2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Track YouTube watch time, videos, sessions, productivity stats; enhanced themes & monthly summaries
// @author       Void
// @match        *://*.youtube.com/*
// @grant        none
// @license      CC-BY-ND-4.0
// @downloadURL https://update.greasyfork.org/scripts/540914/YouTube%20Watch%20Tracker%20v20.user.js
// @updateURL https://update.greasyfork.org/scripts/540914/YouTube%20Watch%20Tracker%20v20.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.__YTWT_ACTIVE__) return;
    window.__YTWT_ACTIVE__ = true;

    const VERSION = '2.0';
    const STORAGE_KEY = 'yt_watch_tracker_data';
    const SETTINGS_KEY = 'yt_watch_tracker_settings_v2';

    // ───────── Themes ─────────
    const THEMES = [
    { name:'Neo', overlayBg:'rgba(20,10,30,0.9)', overlayBorder:'rgba(200,100,255,0.2)', overlayShadow:'0 0 20px rgba(200,100,255,0.3)', textColor:'#ffeaff', headerColor:'#dca0ff', headerBorder:'1px solid rgba(200,100,255,0.3)', versionColor:'#d0b0ff', toggleBg:'rgba(35,15,50,0.95)', toggleBgHover:'rgba(55,25,70,0.95)', buttonBg:'rgba(200,100,255,0.15)', buttonBgHover:'rgba(200,100,255,0.3)', buttonBorder:'rgba(255,200,255,0.3)' },
    { name:'Forest', overlayBg:'rgba(10,30,15,0.95)', overlayBorder:'rgba(100,255,100,0.2)', overlayShadow:'0 0 20px rgba(100,255,100,0.3)', textColor:'#e0ffe0', headerColor:'#80ff80', headerBorder:'1px solid rgba(100,255,100,0.3)', versionColor:'#b0ffb0', toggleBg:'rgba(15,40,20,0.95)', toggleBgHover:'rgba(35,60,40,0.95)', buttonBg:'rgba(100,255,100,0.15)', buttonBgHover:'rgba(100,255,100,0.3)', buttonBorder:'rgba(200,255,200,0.3)' },
    { name:'Sunset', overlayBg:'rgba(35,10,10,0.95)', overlayBorder:'rgba(255,120,80,0.25)', overlayShadow:'0 0 18px rgba(255,100,60,0.35)', textColor:'#fff0e0', headerColor:'#ff9a60', headerBorder:'1px solid rgba(255,120,80,0.35)', versionColor:'#ffc0a0', toggleBg:'rgba(50,15,10,0.95)', toggleBgHover:'rgba(70,25,15,0.95)', buttonBg:'rgba(255,120,80,0.2)', buttonBgHover:'rgba(255,120,80,0.35)', buttonBorder:'rgba(255,140,100,0.4)' },
    { name:'Ocean', overlayBg:'rgba(5,20,40,0.95)', overlayBorder:'rgba(0,180,255,0.2)', overlayShadow:'0 0 20px rgba(0,150,255,0.3)', textColor:'#d0f0ff', headerColor:'#40c0ff', headerBorder:'1px solid rgba(0,180,255,0.3)', versionColor:'#80e0ff', toggleBg:'rgba(10,30,60,0.95)', toggleBgHover:'rgba(30,50,80,0.95)', buttonBg:'rgba(0,180,255,0.2)', buttonBgHover:'rgba(0,180,255,0.35)', buttonBorder:'rgba(100,220,255,0.3)' },
    { name:'Sunflower', overlayBg:'rgba(45,40,5,0.95)', overlayBorder:'rgba(255,220,50,0.25)', overlayShadow:'0 0 18px rgba(255,200,0,0.35)', textColor:'#fffbe0', headerColor:'#ffe050', headerBorder:'1px solid rgba(255,220,50,0.35)', versionColor:'#fff090', toggleBg:'rgba(60,50,10,0.95)', toggleBgHover:'rgba(80,70,15,0.95)', buttonBg:'rgba(255,220,50,0.2)', buttonBgHover:'rgba(255,220,50,0.35)', buttonBorder:'rgba(255,230,100,0.4)' },
    { name:'Default', overlayBg:'rgba(15,15,25,0.9)', overlayBorder:'rgba(255,255,255,0.08)', overlayShadow:'0 0 15px rgba(0,0,0,0.6)', textColor:'#fff', headerColor:'#9dc0ff', headerBorder:'1px solid rgba(255,255,255,0.15)', versionColor:'#aabfff', toggleBg:'rgba(25,25,40,0.95)', toggleBgHover:'rgba(45,45,70,0.95)', buttonBg:'rgba(255,255,255,0.1)', buttonBgHover:'rgba(255,255,255,0.25)', buttonBorder:'rgba(255,255,255,0.2)' },
    { name:'Cyan Glow', overlayBg:'rgba(5,18,28,0.96)', overlayBorder:'rgba(0,200,255,0.35)', overlayShadow:'0 0 18px rgba(0,180,255,0.4)', textColor:'#e8f9ff', headerColor:'#5fd9ff', headerBorder:'1px solid rgba(0,200,255,0.45)', versionColor:'#9de7ff', toggleBg:'rgba(3,25,40,0.98)', toggleBgHover:'rgba(10,45,70,0.98)', buttonBg:'rgba(0,180,255,0.14)', buttonBgHover:'rgba(0,180,255,0.30)', buttonBorder:'rgba(0,200,255,0.55)' },
    { name:'Amber', overlayBg:'rgba(22,14,4,0.96)', overlayBorder:'rgba(255,180,80,0.35)', overlayShadow:'0 0 18px rgba(255,160,60,0.4)', textColor:'#fff6e6', headerColor:'#ffcf88', headerBorder:'1px solid rgba(255,200,120,0.5)', versionColor:'#ffe0a8', toggleBg:'rgba(40,24,8,0.98)', toggleBgHover:'rgba(60,32,10,0.98)', buttonBg:'rgba(255,190,100,0.16)', buttonBgHover:'rgba(255,190,100,0.32)', buttonBorder:'rgba(255,210,120,0.6)' },
    { name:'Mono', overlayBg:'rgba(8,8,8,0.96)', overlayBorder:'rgba(255,255,255,0.15)', overlayShadow:'0 0 18px rgba(0,0,0,0.8)', textColor:'#f4f4f4', headerColor:'#f0f0f0', headerBorder:'1px solid rgba(255,255,255,0.2)', versionColor:'#cccccc', toggleBg:'rgba(20,20,20,0.98)', toggleBgHover:'rgba(40,40,40,0.98)', buttonBg:'rgba(255,255,255,0.08)', buttonBgHover:'rgba(255,255,255,0.20)', buttonBorder:'rgba(255,255,255,0.30)' },
    { name:'Lavender', overlayBg:'rgba(60,40,90,0.95)', overlayBorder:'rgba(200,150,255,0.25)', overlayShadow:'0 0 22px rgba(180,130,255,0.35)', textColor:'#f0e0ff', headerColor:'#c090ff', headerBorder:'1px solid rgba(200,150,255,0.3)', versionColor:'#d0b0ff', toggleBg:'rgba(70,50,110,0.95)', toggleBgHover:'rgba(90,70,130,0.95)', buttonBg:'rgba(180,130,255,0.15)', buttonBgHover:'rgba(180,130,255,0.3)', buttonBorder:'rgba(220,180,255,0.35)' },
    { name:'Coral', overlayBg:'rgba(50,15,15,0.95)', overlayBorder:'rgba(255,100,80,0.25)', overlayShadow:'0 0 18px rgba(255,80,60,0.35)', textColor:'#fff0e0', headerColor:'#ff6f60', headerBorder:'1px solid rgba(255,100,80,0.3)', versionColor:'#ffb0a0', toggleBg:'rgba(65,20,20,0.95)', toggleBgHover:'rgba(85,30,30,0.95)', buttonBg:'rgba(255,100,80,0.2)', buttonBgHover:'rgba(255,100,80,0.35)', buttonBorder:'rgba(255,120,100,0.4)' },
    { name:'Mint', overlayBg:'rgba(10,40,30,0.95)', overlayBorder:'rgba(100,255,180,0.25)', overlayShadow:'0 0 20px rgba(100,255,180,0.35)', textColor:'#e0fff5', headerColor:'#60ffb0', headerBorder:'1px solid rgba(100,255,180,0.3)', versionColor:'#a0ffc0', toggleBg:'rgba(20,60,40,0.95)', toggleBgHover:'rgba(40,80,60,0.95)', buttonBg:'rgba(100,255,180,0.2)', buttonBgHover:'rgba(100,255,180,0.35)', buttonBorder:'rgba(150,255,200,0.4)' },
    { name:'Violet', overlayBg:'rgba(25,10,40,0.95)', overlayBorder:'rgba(180,100,255,0.25)', overlayShadow:'0 0 20px rgba(160,80,255,0.35)', textColor:'#f5e0ff', headerColor:'#b060ff', headerBorder:'1px solid rgba(180,100,255,0.3)', versionColor:'#d0a0ff', toggleBg:'rgba(40,15,60,0.95)', toggleBgHover:'rgba(60,35,80,0.95)', buttonBg:'rgba(180,100,255,0.2)', buttonBgHover:'rgba(180,100,255,0.35)', buttonBorder:'rgba(200,140,255,0.4)' },
    { name:'Crimson', overlayBg:'rgba(50,5,5,0.95)', overlayBorder:'rgba(255,50,50,0.25)', overlayShadow:'0 0 18px rgba(255,20,20,0.35)', textColor:'#ffe0e0', headerColor:'#ff5050', headerBorder:'1px solid rgba(255,50,50,0.3)', versionColor:'#ff9090', toggleBg:'rgba(70,15,15,0.95)', toggleBgHover:'rgba(90,25,25,0.95)', buttonBg:'rgba(255,50,50,0.2)', buttonBgHover:'rgba(255,50,50,0.35)', buttonBorder:'rgba(255,80,80,0.4)' },
    { name:'Teal', overlayBg:'rgba(5,35,35,0.95)', overlayBorder:'rgba(0,200,180,0.25)', overlayShadow:'0 0 20px rgba(0,180,160,0.35)', textColor:'#d0fff5', headerColor:'#40e0c0', headerBorder:'1px solid rgba(0,200,180,0.3)', versionColor:'#80ffe0', toggleBg:'rgba(10,50,50,0.95)', toggleBgHover:'rgba(30,70,70,0.95)', buttonBg:'rgba(0,200,180,0.2)', buttonBgHover:'rgba(0,200,180,0.35)', buttonBorder:'rgba(80,220,200,0.4)' },
    { name:'Steel', overlayBg:'rgba(30,30,35,0.95)', overlayBorder:'rgba(180,180,200,0.25)', overlayShadow:'0 0 20px rgba(150,150,180,0.35)', textColor:'#e0e0f0', headerColor:'#9090ff', headerBorder:'1px solid rgba(180,180,200,0.3)', versionColor:'#b0b0ff', toggleBg:'rgba(45,45,50,0.95)', toggleBgHover:'rgba(65,65,70,0.95)', buttonBg:'rgba(180,180,200,0.2)', buttonBgHover:'rgba(180,180,200,0.35)', buttonBorder:'rgba(200,200,220,0.4)' },
    { name:'Rose', overlayBg:'rgba(50,20,30,0.95)', overlayBorder:'rgba(255,120,150,0.25)', overlayShadow:'0 0 18px rgba(255,100,130,0.35)', textColor:'#ffe0f0', headerColor:'#ff80b0', headerBorder:'1px solid rgba(255,120,150,0.3)', versionColor:'#ffb0d0', toggleBg:'rgba(70,30,40,0.95)', toggleBgHover:'rgba(90,50,60,0.95)', buttonBg:'rgba(255,120,150,0.2)', buttonBgHover:'rgba(255,120,150,0.35)', buttonBorder:'rgba(255,140,160,0.4)' },
    { name:'Midnight', overlayBg:'rgba(10,10,25,0.95)', overlayBorder:'rgba(100,100,200,0.3)', overlayShadow:'0 0 20px rgba(50,50,150,0.4)', textColor:'#c0c0ff', headerColor:'#8080ff', headerBorder:'1px solid rgba(100,100,200,0.4)', versionColor:'#a0a0ff', toggleBg:'rgba(20,20,40,0.95)', toggleBgHover:'rgba(40,40,60,0.95)', buttonBg:'rgba(100,100,200,0.2)', buttonBgHover:'rgba(100,100,200,0.35)', buttonBorder:'rgba(150,150,250,0.4)' },
    { name:'Candy', overlayBg:'rgba(255,230,250,0.95)', overlayBorder:'rgba(255,180,220,0.25)', overlayShadow:'0 0 18px rgba(255,150,200,0.35)', textColor:'#550033', headerColor:'#ff66aa', headerBorder:'1px solid rgba(255,180,220,0.35)', versionColor:'#ff99cc', toggleBg:'rgba(255,200,230,0.95)', toggleBgHover:'rgba(255,180,220,0.95)', buttonBg:'rgba(255,180,220,0.2)', buttonBgHover:'rgba(255,180,220,0.35)', buttonBorder:'rgba(255,200,240,0.4)' },
    { name:'Slate', overlayBg:'rgba(30,35,40,0.95)', overlayBorder:'rgba(120,120,140,0.3)', overlayShadow:'0 0 18px rgba(100,100,120,0.35)', textColor:'#d0d0d0', headerColor:'#a0a0ff', headerBorder:'1px solid rgba(120,120,140,0.35)', versionColor:'#b0b0ff', toggleBg:'rgba(45,50,60,0.95)', toggleBgHover:'rgba(65,70,80,0.95)', buttonBg:'rgba(120,120,140,0.2)', buttonBgHover:'rgba(120,120,140,0.35)', buttonBorder:'rgba(160,160,180,0.4)' },
    { name:'Sunrise', overlayBg:'rgba(255,180,120,0.95)', overlayBorder:'rgba(255,140,80,0.25)', overlayShadow:'0 0 18px rgba(255,120,60,0.35)', textColor:'#fff0e0', headerColor:'#ff8040', headerBorder:'1px solid rgba(255,140,80,0.35)', versionColor:'#ffc080', toggleBg:'rgba(255,160,100,0.95)', toggleBgHover:'rgba(255,140,80,0.95)', buttonBg:'rgba(255,140,80,0.2)', buttonBgHover:'rgba(255,140,80,0.35)', buttonBorder:'rgba(255,180,100,0.4)' },
    { name:'Emerald', overlayBg:'rgba(5,40,20,0.95)', overlayBorder:'rgba(0,200,100,0.25)', overlayShadow:'0 0 20px rgba(0,180,80,0.35)', textColor:'#d0fff0', headerColor:'#40ff80', headerBorder:'1px solid rgba(0,200,100,0.3)', versionColor:'#80ffb0', toggleBg:'rgba(10,60,30,0.95)', toggleBgHover:'rgba(30,80,50,0.95)', buttonBg:'rgba(0,200,100,0.2)', buttonBgHover:'rgba(0,200,100,0.35)', buttonBorder:'rgba(0,255,140,0.4)' },
    { name:'Blush', overlayBg:'rgba(250,220,220,0.95)', overlayBorder:'rgba(255,180,180,0.25)', overlayShadow:'0 0 18px rgba(255,150,150,0.35)', textColor:'#440000', headerColor:'#ff8080', headerBorder:'1px solid rgba(255,180,180,0.35)', versionColor:'#ffb0b0', toggleBg:'rgba(255,200,200,0.95)', toggleBgHover:'rgba(255,180,180,0.95)', buttonBg:'rgba(255,180,180,0.2)', buttonBgHover:'rgba(255,180,180,0.35)', buttonBorder:'rgba(255,200,200,0.4)' },
    { name:'Aurora', overlayBg:'rgba(15,20,35,0.95)', overlayBorder:'rgba(120,255,220,0.25)', overlayShadow:'0 0 20px rgba(100,220,200,0.35)', textColor:'#c0fff5', headerColor:'#60ffd0', headerBorder:'1px solid rgba(120,255,220,0.3)', versionColor:'#90ffe0', toggleBg:'rgba(20,30,50,0.95)', toggleBgHover:'rgba(40,50,70,0.95)', buttonBg:'rgba(100,255,220,0.2)', buttonBgHover:'rgba(100,255,220,0.35)', buttonBorder:'rgba(140,255,240,0.4)' },
    { name:'Rust', overlayBg:'rgba(50,25,10,0.95)', overlayBorder:'rgba(200,120,60,0.25)', overlayShadow:'0 0 18px rgba(180,100,50,0.35)', textColor:'#fff0e0', headerColor:'#d46f30', headerBorder:'1px solid rgba(200,120,60,0.35)', versionColor:'#f0a060', toggleBg:'rgba(65,35,15,0.95)', toggleBgHover:'rgba(85,45,25,0.95)', buttonBg:'rgba(200,120,60,0.2)', buttonBgHover:'rgba(200,120,60,0.35)', buttonBorder:'rgba(220,140,80,0.4)' },
    { name:'Galaxy', overlayBg:'rgba(5,5,35,0.95)', overlayBorder:'rgba(120,100,255,0.25)', overlayShadow:'0 0 22px rgba(100,80,255,0.35)', textColor:'#d0d0ff', headerColor:'#8080ff', headerBorder:'1px solid rgba(120,100,255,0.35)', versionColor:'#a0a0ff', toggleBg:'rgba(10,10,60,0.95)', toggleBgHover:'rgba(30,30,80,0.95)', buttonBg:'rgba(100,80,255,0.2)', buttonBgHover:'rgba(100,80,255,0.35)', buttonBorder:'rgba(150,120,255,0.4)' },
    { name:'Peach', overlayBg:'rgba(255,230,200,0.95)', overlayBorder:'rgba(255,180,140,0.25)', overlayShadow:'0 0 18px rgba(255,160,100,0.35)', textColor:'#442200', headerColor:'#ffb080', headerBorder:'1px solid rgba(255,180,140,0.35)', versionColor:'#ffc0a0', toggleBg:'rgba(255,200,160,0.95)', toggleBgHover:'rgba(255,180,140,0.95)', buttonBg:'rgba(255,180,140,0.2)', buttonBgHover:'rgba(255,180,140,0.35)', buttonBorder:'rgba(255,200,160,0.4)' },
    {name:'Ruby', overlayBg:'rgba(50,0,0,0.95)', overlayBorder:'rgba(255,50,50,0.25)', overlayShadow:'0 0 18px rgba(200,0,0,0.35)', textColor:'#ffd0d0', headerColor:'#ff4040', headerBorder:'1px solid rgba(255,50,50,0.35)', versionColor:'#ff8080', toggleBg:'rgba(70,10,10,0.95)', toggleBgHover:'rgba(100,20,20,0.95)', buttonBg:'rgba(255,50,50,0.2)', buttonBgHover:'rgba(255,50,50,0.35)', buttonBorder:'rgba(255,100,100,0.4)'},
    {name:'Mint', overlayBg:'rgba(5,50,30,0.95)', overlayBorder:'rgba(0,255,180,0.25)', overlayShadow:'0 0 20px rgba(0,200,140,0.35)', textColor:'#c0fff0', headerColor:'#40ffb0', headerBorder:'1px solid rgba(0,255,180,0.35)', versionColor:'#80ffc0', toggleBg:'rgba(10,60,35,0.95)', toggleBgHover:'rgba(30,80,50,0.95)', buttonBg:'rgba(0,255,180,0.2)', buttonBgHover:'rgba(0,255,180,0.35)', buttonBorder:'rgba(0,220,160,0.4)'},
    {name:'Lavender', overlayBg:'rgba(35,10,40,0.95)', overlayBorder:'rgba(180,120,255,0.25)', overlayShadow:'0 0 20px rgba(160,80,255,0.35)', textColor:'#e0d0ff', headerColor:'#c080ff', headerBorder:'1px solid rgba(180,120,255,0.35)', versionColor:'#d0a0ff', toggleBg:'rgba(50,15,60,0.95)', toggleBgHover:'rgba(70,25,80,0.95)', buttonBg:'rgba(180,120,255,0.2)', buttonBgHover:'rgba(180,120,255,0.35)', buttonBorder:'rgba(200,150,255,0.4)'},
    {name:'Amber Glow', overlayBg:'rgba(50,35,5,0.95)', overlayBorder:'rgba(255,180,50,0.25)', overlayShadow:'0 0 18px rgba(255,150,50,0.35)', textColor:'#fff8d0', headerColor:'#ffb040', headerBorder:'1px solid rgba(255,180,50,0.35)', versionColor:'#ffd080', toggleBg:'rgba(60,45,10,0.95)', toggleBgHover:'rgba(80,60,15,0.95)', buttonBg:'rgba(255,180,50,0.2)', buttonBgHover:'rgba(255,180,50,0.35)', buttonBorder:'rgba(255,200,100,0.4)'},
    {name:'Steel', overlayBg:'rgba(20,25,30,0.95)', overlayBorder:'rgba(150,150,180,0.25)', overlayShadow:'0 0 18px rgba(120,120,150,0.35)', textColor:'#c0c0d0', headerColor:'#80a0ff', headerBorder:'1px solid rgba(150,150,180,0.35)', versionColor:'#a0b0ff', toggleBg:'rgba(35,40,50,0.95)', toggleBgHover:'rgba(55,60,70,0.95)', buttonBg:'rgba(150,150,180,0.2)', buttonBgHover:'rgba(150,150,180,0.35)', buttonBorder:'rgba(180,180,200,0.4)'},
    {name:'Coral', overlayBg:'rgba(255,180,160,0.95)', overlayBorder:'rgba(255,100,80,0.25)', overlayShadow:'0 0 18px rgba(255,120,100,0.35)', textColor:'#442222', headerColor:'#ff8060', headerBorder:'1px solid rgba(255,100,80,0.35)', versionColor:'#ffb0a0', toggleBg:'rgba(255,160,140,0.95)', toggleBgHover:'rgba(255,140,120,0.95)', buttonBg:'rgba(255,100,80,0.2)', buttonBgHover:'rgba(255,100,80,0.35)', buttonBorder:'rgba(255,140,120,0.4)'},
    {name:'Cobalt', overlayBg:'rgba(5,10,50,0.95)', overlayBorder:'rgba(100,100,255,0.25)', overlayShadow:'0 0 20px rgba(80,80,200,0.35)', textColor:'#d0d0ff', headerColor:'#6080ff', headerBorder:'1px solid rgba(100,100,255,0.35)', versionColor:'#90a0ff', toggleBg:'rgba(10,15,60,0.95)', toggleBgHover:'rgba(30,30,80,0.95)', buttonBg:'rgba(100,100,255,0.2)', buttonBgHover:'rgba(100,100,255,0.35)', buttonBorder:'rgba(140,140,255,0.4)'},
    {name:'Olive', overlayBg:'rgba(30,35,10,0.95)', overlayBorder:'rgba(180,200,100,0.25)', overlayShadow:'0 0 18px rgba(150,180,50,0.35)', textColor:'#f0ffd0', headerColor:'#b0ff60', headerBorder:'1px solid rgba(180,200,100,0.35)', versionColor:'#d0ff80', toggleBg:'rgba(40,45,15,0.95)', toggleBgHover:'rgba(60,70,20,0.95)', buttonBg:'rgba(180,200,100,0.2)', buttonBgHover:'rgba(180,200,100,0.35)', buttonBorder:'rgba(200,220,140,0.4)'},
    {name:'Twilight', overlayBg:'rgba(25,10,30,0.95)', overlayBorder:'rgba(150,100,200,0.25)', overlayShadow:'0 0 20px rgba(120,80,180,0.35)', textColor:'#e0d0ff', headerColor:'#c080ff', headerBorder:'1px solid rgba(150,100,200,0.35)', versionColor:'#d0a0ff', toggleBg:'rgba(35,15,50,0.95)', toggleBgHover:'rgba(55,25,70,0.95)', buttonBg:'rgba(150,100,200,0.2)', buttonBgHover:'rgba(150,100,200,0.35)', buttonBorder:'rgba(180,140,220,0.4)'},
    {name:'Peacock', overlayBg:'rgba(10,25,40,0.95)', overlayBorder:'rgba(0,180,220,0.25)', overlayShadow:'0 0 20px rgba(0,140,200,0.35)', textColor:'#c0f0ff', headerColor:'#40c0ff', headerBorder:'1px solid rgba(0,180,220,0.35)', versionColor:'#80e0ff', toggleBg:'rgba(15,35,60,0.95)', toggleBgHover:'rgba(35,55,80,0.95)', buttonBg:'rgba(0,180,220,0.2)', buttonBgHover:'rgba(0,180,220,0.35)', buttonBorder:'rgba(0,220,255,0.4)'},
    {name:'Mocha', overlayBg:'rgba(50,35,25,0.95)', overlayBorder:'rgba(180,120,100,0.25)', overlayShadow:'0 0 18px rgba(150,100,80,0.35)', textColor:'#fff0e0', headerColor:'#b07050', headerBorder:'1px solid rgba(180,120,100,0.35)', versionColor:'#d0a080', toggleBg:'rgba(60,45,30,0.95)', toggleBgHover:'rgba(80,60,40,0.95)', buttonBg:'rgba(180,120,100,0.2)', buttonBgHover:'rgba(180,120,100,0.35)', buttonBorder:'rgba(200,140,120,0.4)'},
    {name:'Sky', overlayBg:'rgba(100,150,255,0.95)', overlayBorder:'rgba(60,120,255,0.25)', overlayShadow:'0 0 18px rgba(50,100,255,0.35)', textColor:'#202040', headerColor:'#80b0ff', headerBorder:'1px solid rgba(60,120,255,0.35)', versionColor:'#a0c0ff', toggleBg:'rgba(120,180,255,0.95)', toggleBgHover:'rgba(80,140,255,0.95)', buttonBg:'rgba(60,120,255,0.2)', buttonBgHover:'rgba(60,120,255,0.35)', buttonBorder:'rgba(100,160,255,0.4)'},
    {name:'Amber Night', overlayBg:'rgba(45,35,10,0.95)', overlayBorder:'rgba(255,200,60,0.25)', overlayShadow:'0 0 18px rgba(255,180,50,0.35)', textColor:'#fffbe0', headerColor:'#ffc040', headerBorder:'1px solid rgba(255,200,60,0.35)', versionColor:'#ffe080', toggleBg:'rgba(60,45,15,0.95)', toggleBgHover:'rgba(80,60,20,0.95)', buttonBg:'rgba(255,200,60,0.2)', buttonBgHover:'rgba(255,200,60,0.35)', buttonBorder:'rgba(255,220,100,0.4)'},
    {name:'Obsidian', overlayBg:'rgba(5,5,5,0.95)', overlayBorder:'rgba(80,80,80,0.25)', overlayShadow:'0 0 20px rgba(50,50,50,0.35)', textColor:'#d0d0d0', headerColor:'#606060', headerBorder:'1px solid rgba(80,80,80,0.35)', versionColor:'#909090', toggleBg:'rgba(10,10,10,0.95)', toggleBgHover:'rgba(30,30,30,0.95)', buttonBg:'rgba(80,80,80,0.2)', buttonBgHover:'rgba(80,80,80,0.35)', buttonBorder:'rgba(120,120,120,0.4)'},
    {name:'Sunbeam', overlayBg:'rgba(255,240,180,0.95)', overlayBorder:'rgba(255,200,80,0.25)', overlayShadow:'0 0 18px rgba(255,220,100,0.35)', textColor:'#443300', headerColor:'#ffc040', headerBorder:'1px solid rgba(255,200,80,0.35)', versionColor:'#ffe080', toggleBg:'rgba(255,220,100,0.95)', toggleBgHover:'rgba(255,200,80,0.95)', buttonBg:'rgba(255,200,80,0.2)', buttonBgHover:'rgba(255,200,80,0.35)', buttonBorder:'rgba(255,220,120,0.4)'},
    {name:'Frost', overlayBg:'rgba(200,240,255,0.95)', overlayBorder:'rgba(150,220,255,0.25)', overlayShadow:'0 0 20px rgba(120,200,255,0.35)', textColor:'#102040', headerColor:'#60c0ff', headerBorder:'1px solid rgba(150,220,255,0.35)', versionColor:'#80e0ff', toggleBg:'rgba(180,220,255,0.95)', toggleBgHover:'rgba(150,200,255,0.95)', buttonBg:'rgba(150,220,255,0.2)', buttonBgHover:'rgba(150,220,255,0.35)', buttonBorder:'rgba(180,240,255,0.4)'},
    {name:'Cherry', overlayBg:'rgba(50,0,10,0.95)', overlayBorder:'rgba(255,50,100,0.25)', overlayShadow:'0 0 18px rgba(200,0,80,0.35)', textColor:'#ffd0e0', headerColor:'#ff4060', headerBorder:'1px solid rgba(255,50,100,0.35)', versionColor:'#ff80a0', toggleBg:'rgba(70,10,20,0.95)', toggleBgHover:'rgba(100,20,40,0.95)', buttonBg:'rgba(255,50,100,0.2)', buttonBgHover:'rgba(255,50,100,0.35)', buttonBorder:'rgba(255,100,140,0.4)'},
    {name:'Pine', overlayBg:'rgba(10,35,15,0.95)', overlayBorder:'rgba(0,180,80,0.25)', overlayShadow:'0 0 20px rgba(0,150,60,0.35)', textColor:'#d0ffd0', headerColor:'#40ff60', headerBorder:'1px solid rgba(0,180,80,0.35)', versionColor:'#80ff90', toggleBg:'rgba(15,50,20,0.95)', toggleBgHover:'rgba(35,70,40,0.95)', buttonBg:'rgba(0,180,80,0.2)', buttonBgHover:'rgba(0,180,80,0.35)', buttonBorder:'rgba(0,220,100,0.4)'},
    {name:'Brick', overlayBg:'rgba(100,30,20,0.95)', overlayBorder:'rgba(200,80,60,0.25)', overlayShadow:'0 0 18px rgba(180,60,40,0.35)', textColor:'#fff0e0', headerColor:'#c05040', headerBorder:'1px solid rgba(200,80,60,0.35)', versionColor:'#e08070', toggleBg:'rgba(120,40,25,0.95)', toggleBgHover:'rgba(150,60,35,0.95)', buttonBg:'rgba(200,80,60,0.2)', buttonBgHover:'rgba(200,80,60,0.35)', buttonBorder:'rgba(220,100,80,0.4)'}

];

    let settings={theme:0}, currentThemeIndex=0;
    const getTheme=()=>THEMES[currentThemeIndex]||THEMES[0];
    const getDate=()=>new Date().toISOString().slice(0,10);
    const getMonth=()=>new Date().toISOString().slice(0,7);
    const fmt=t=>`${Math.floor(t/3600)}h ${String(Math.floor((t%3600)/60)).padStart(2,'0')}m ${String(Math.floor(t%60)).padStart(2,'0')}s`;
    const loadSettings=()=>{try{const s=JSON.parse(localStorage.getItem(SETTINGS_KEY)); if(s) settings=Object.assign(settings,s);}catch{} currentThemeIndex=settings.theme>=0&&settings.theme<THEMES.length?settings.theme:0;};
    const saveSettings=()=>{try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings))}catch{}};

    let data={}, sessionTime=0, videoTime=0, perVideoData={}, hourBuckets=Array(24).fill(0);
    const loadData=()=>{try{data=JSON.parse(localStorage.getItem(STORAGE_KEY))||{}}catch{data={}}};
    const saveData=()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data))}catch{}};

    function ensureStats(date=getDate()){if(!data[date]) data[date]={watched:0,wasted:0,session:0,shortsTime:0,longformTime:0,foregroundTime:0,backgroundTime:0};}
    function ensureVideoEntry(id){if(!perVideoData[id]) perVideoData[id]={title:document.title.replace(' - YouTube',''),channel:document.querySelector('ytd-channel-name')?.innerText||'',time:0};}

    // ───────── UI ─────────
    let overlay, contentBox, toggleBtn, headerEl, headerVersionEl, themeIconEl, pauseBtn, copyBtn;
    let themedButtons=[], hidden=false, lastUiUpdate=0, trackingPaused=false;
    const mkBtn=(label,fn)=>{const b=document.createElement('button');b.textContent=label;b.style.cssText='flex:1;border-radius:6px;padding:4px 8px;font-size:12px;cursor:pointer;border-width:1px;border-style:solid;outline:none;';b.onmouseenter=()=>b.style.background=getTheme().buttonBgHover;b.onmouseleave=()=>b.style.background=getTheme().buttonBg;b.onclick=fn;themedButtons.push(b);return b;};

    function applyTheme(index){
        currentThemeIndex=index;
        const t=getTheme();
        if(overlay){overlay.style.background=t.overlayBg; overlay.style.border=`1px solid ${t.overlayBorder}`; overlay.style.boxShadow=t.overlayShadow; overlay.style.color=t.textColor;}
        if(headerEl){headerEl.style.color=t.headerColor; headerEl.style.borderBottom=t.headerBorder;}
        if(headerVersionEl) headerVersionEl.style.color=t.versionColor;
        if(themeIconEl) themeIconEl.style.color=t.versionColor;
        if(toggleBtn) toggleBtn.style.background=t.toggleBg;
        themedButtons.forEach(b=>{b.style.background=t.buttonBg; b.style.border=`1px solid ${t.buttonBorder}`; b.style.color=t.textColor;});
    }

    function createOverlay(){
        overlay=document.createElement('div');
        overlay.style.cssText='position:fixed;top:100px;right:0;width:280px;background:rgba(15,15,25,0.9);backdrop-filter:blur(10px);color:#fff;border-radius:10px 0 0 10px;border:1px solid rgba(255,255,255,0.08);box-shadow:0 0 15px rgba(0,0,0,0.6);font-family:Segoe UI,sans-serif;font-size:13px;z-index:999999999;padding:12px 14px;user-select:none;transition:right .35s ease;';
        headerEl=document.createElement('div'); headerEl.style.cssText='display:flex;align-items:center;justify-content:space-between;text-align:center;font-weight:600;color:#9dc0ff;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:4px;margin-bottom:6px;font-size:14px;';
        const hTitle=document.createElement('span'); hTitle.textContent='📊 YouTube Watch Tracker';
        const hRight=document.createElement('span'); hRight.style.cssText='display:flex;align-items:center;gap:6px;font-size:13px;';
        themeIconEl=document.createElement('span'); themeIconEl.textContent='🎨'; themeIconEl.title='Change theme'; themeIconEl.style.cssText='cursor:pointer;font-size:14px;user-select:none;'; themeIconEl.onclick=()=>{settings.theme=(settings.theme+1)%THEMES.length; applyTheme(settings.theme); saveSettings();};
        headerVersionEl=document.createElement('span'); headerVersionEl.textContent=`v${VERSION}`; headerVersionEl.style.cssText='font-size:11px;color:#aabfff;opacity:0.9;';
        hRight.append(themeIconEl, headerVersionEl); headerEl.append(hTitle,hRight); overlay.appendChild(headerEl);
        contentBox=document.createElement('div'); contentBox.style.cssText='line-height:1.6;margin-bottom:10px;white-space:pre;'; overlay.appendChild(contentBox);

        const row1=document.createElement('div'); row1.style.cssText='display:flex;justify-content:space-between;gap:6px;flex-wrap:wrap;';
        row1.append(
            mkBtn('Export',()=>{navigator.clipboard.writeText(JSON.stringify(data,null,2)); alert('Copied JSON.');}),
            mkBtn('Import',()=>{const j=prompt('Paste JSON:'); if(!j) return; try{const p=JSON.parse(j); if(typeof p!=='object') throw 0; data=p; saveData(); updateOverlay(true);}catch{alert('Invalid JSON');}}),
            mkBtn('Reset',()=>{if(confirm('Reset today only?')){data[getDate()]={watched:0,wasted:0,session:0,shortsTime:0,longformTime:0,foregroundTime:0,backgroundTime:0}; sessionTime=0; saveData(); updateOverlay(true);}})
        ); overlay.appendChild(row1);

        const row2=document.createElement('div'); row2.style.cssText='display:flex;justify-content:space-between;gap:6px;flex-wrap:wrap;margin-top:6px;';
        pauseBtn=mkBtn('Pause',()=>{trackingPaused=!trackingPaused; pauseBtn.textContent=trackingPaused?'Resume':'Pause';});
        copyBtn=mkBtn('Copy',()=>{navigator.clipboard.writeText(buildSummary()); alert('Summary copied.');});
        row2.append(pauseBtn,copyBtn); overlay.appendChild(row2);

        toggleBtn=document.createElement('div'); toggleBtn.textContent='←'; toggleBtn.style.cssText='position:fixed;top:120px;right:280px;width:26px;height:46px;background:rgba(25,25,40,0.95);color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;border-radius:6px 0 0 6px;cursor:pointer;box-shadow:0 0 10px rgba(0,0,0,0.5);z-index:999999999;transition:right .35s ease,background .2s ease,transform .2s ease;'; toggleBtn.onclick=()=>{hidden=!hidden; overlay.style.right=hidden?'-300px':'0'; toggleBtn.style.right=hidden?'0':'280px'; toggleBtn.textContent=hidden?'→':'←';};

        document.body.append(overlay); document.body.append(toggleBtn);
        applyTheme(currentThemeIndex);
    }

    // ───────── Video Tracking ─────────
    let videoEl=null, lastVideoId=null, lastInteraction=Date.now(), idleThreshold=60000;
    ['mousemove','mousedown','keydown','wheel'].forEach(e=>window.addEventListener(e,()=>lastInteraction=Date.now(),{passive:true}));
    const isIdle=()=>Date.now()-lastInteraction>idleThreshold;

    const getCurrentVideoId=()=>{
        const url=new URL(location.href);
        const v=url.searchParams.get('v'); if(v) return `watch:${v}`;
        const sh=url.pathname.match(/^\/shorts\/([^/?#]+)/); if(sh) return `shorts:${sh[1]}`;
        return `url:${url.pathname}${url.search}`;
    };

    function handleNewVideoId(){const id=getCurrentVideoId(); if(!id||id===lastVideoId)return; lastVideoId=id; ensureStats(); data[getDate()].watched++; ensureVideoEntry(id); saveData(); updateOverlay(true);}
    function attachVideo(){const v=document.querySelector('video'); if(v&&v!==videoEl){videoEl=v; videoTime=0; handleNewVideoId();}}

    function buildSummary(){
        ensureStats(); const d=getDate(); const m={watched:0,wasted:0,session:0};
        for(const [k,v] of Object.entries(data)) if(k.startsWith(getMonth())) { m.watched+=v.watched||0; m.wasted+=v.wasted||0; m.session+=v.session||0; }
        const daily=data[d]; const shortsPct=daily.wasted>0?((daily.shortsTime/daily.wasted)*100).toFixed(1):'0.0'; const prodScore=Math.max(0,100-shortsPct-(daily.watched>20?10:0));
        return `📅 Today: ${daily.watched} videos\n🕒 Watched: ${fmt(daily.wasted)}\n⌛ Session: ${fmt(sessionTime)}\n🎯 Productivity: ${prodScore}\n📆 Month: ${m.watched} videos\n🕒 Watched: ${fmt(m.wasted)}\n📱 Shorts: ${shortsPct}%`;
    }

    function updateOverlay(force=false){const now=Date.now(); if(!force && now-lastUiUpdate<2500) return; lastUiUpdate=now; if(contentBox) contentBox.innerText=buildSummary();}

    function startSessionLoop(){setInterval(()=>{if(trackingPaused||document.hidden) return; ensureStats(); sessionTime++; data[getDate()].session++; if(Date.now()%20000<1000) saveData(); updateOverlay();},1000);}
    function startWatchLoop(){setInterval(()=>{if(trackingPaused||document.hidden||!videoEl||videoEl.paused||videoEl.ended||isIdle()) return; ensureStats(); const rate=videoEl.playbackRate||1; const d=data[getDate()]; d.wasted+=rate; videoTime+=rate; hourBuckets[new Date().getHours()]+=rate; if(location.pathname.startsWith('/shorts/')) d.shortsTime+=rate; else d.longformTime+=rate; if(document.visibilityState==='visible') d.foregroundTime+=rate; else d.backgroundTime+=rate; if(lastVideoId&&perVideoData[lastVideoId]) perVideoData[lastVideoId].time+=rate; if(videoTime%30<1) saveData(); updateOverlay();},1000);}

    function setupObservers(){
        const videoObs=new MutationObserver(attachVideo); videoObs.observe(document.body,{childList:true,subtree:true});
        let lastHref=location.href;
        const urlObs=new MutationObserver(()=>{if(location.href!==lastHref){lastHref=location.href; attachVideo(); handleNewVideoId();}}); urlObs.observe(document.documentElement||document,{childList:true,subtree:true});
        window.addEventListener('yt-navigate-finish',()=>{attachVideo(); handleNewVideoId();});
        window.addEventListener('popstate',()=>{attachVideo(); handleNewVideoId();});
    }

    // ───────── Safe Init ─────────
    function waitForBody(fn){if(document.body) return fn(); const obs=new MutationObserver((m,o)=>{if(document.body){o.disconnect();fn();}}); obs.observe(document.documentElement,{childList:true,subtree:true});}
    function initSafe(){waitForBody(()=>{loadSettings(); loadData(); ensureStats(); createOverlay(); attachVideo(); handleNewVideoId(); startSessionLoop(); startWatchLoop(); setupObservers(); window.addEventListener('beforeunload',saveData);})}
    if(document.readyState==='complete') initSafe(); else window.addEventListener('load',initSafe);

})();
