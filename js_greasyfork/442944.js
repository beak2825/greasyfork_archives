// ==UserScript==
// @name         Idle Breakout
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Hacks
// @author       JUJUJUJ
// @match        https://kodiqi.itch.io/idle-breakout*
// @grant        none
// @icon         https://image.flaticon.com/icons/svg/99/99188.svg
// @license                  MIT
// @compatible               chrome
// @compatible               opera
// @compatible               safari
// @downloadURL https://update.greasyfork.org/scripts/442944/Idle%20Breakout.user.js
// @updateURL https://update.greasyfork.org/scripts/442944/Idle%20Breakout.meta.js
// ==/UserScript==

let level = prompt("What Level?")
let money = prompt("How much money do you want")
let gold = prompt("How much gold do you want")
let points = prompt("How many skill points do you want")
let b1 = prompt("How many basic balls do you want")
let b2 = prompt("How many plasma balls do you want")
let b3 = prompt("How many sniper balls do you want")
let b4 = prompt("How many scatter balls do you want")
let b5 = prompt("How many cannon balls do you want")
let b6 = prompt("How many poison balls do you want")
let bs = prompt("basic balls speed")
let bp = prompt("basic balls power")
let pr = prompt("plasma balls range")
let pp = prompt("plasma balls power")
let ss = prompt("sniper balls speed")
let sp = prompt("sniper balls power")
let se = prompt("scatter balls extra balls")
let sbp = prompt("scatter balls power")
let cs = prompt("cannon balls speed")
let cp = prompt("cannon balls power")
let pd = prompt("poison balls speed")
let pbp = prompt("poison balls power")
let lzrp = prompt("lazer power")
let lzramt = prompt("lazer amount")
let nob = prompt("number of balls")
let cashcomplete = prompt("cash on complete")
let sk = prompt("All Skill Upgrades? 1 for yes 0 for no")

level,money,gold,2,0,289,289,0,0,1,0,1,1,0,43595.78,999999,8,8,45,45,80,80,192,192,115,115,127,127,b1,b2,b3,b4,b5,b6,0,0,0,bs,bp,pr,pp,ss,sp,se,sbp,cs,cp,ps,pbp,0,lzrp,click,cashcomplete,10,click,lzramt,nob,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,sk,sk,sk,sk,0,sk,sk,sk,sk,0,sk,sk,sk,sk,0,sk,sk,sk,sk,0,sk,sk,sk,sk,0,sk,sk,sk,sk,0,0,0,0,0,0,points,1,0,0