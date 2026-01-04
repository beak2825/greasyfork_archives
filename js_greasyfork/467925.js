//I
//V
//Y
//C
//O
//M
//B
//
//I
//S
//
//T
//R
//A
//N
//S
//
//L
//O
//L

//--------------------------------------------------------------

// ==UserScript==
// @name         2nd Phaserator | EZ Sound Extension
// @namespace    Ez Sound For Your Evil Kills
// @version      2.0
// @description  Some Easy and little Extension For EZ Sound when you kill a player (this is only the extension :v)
// @author       ErrorX002
// @license      ErrorNology
// @match        *://sandbox.moomoo.io/*
// @match        *://moomoo.io/*
// @grant        unsafeWindow
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @icon         https://www.speedrun.com/userasset/jmo37y48/image?v=5a60ca4
// @require      https://greasyfork.org/scripts/410512-sci-js-from-ksw2-center/code/scijs%20(from%20ksw2-center).js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/467925/2nd%20Phaserator%20%7C%20EZ%20Sound%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/467925/2nd%20Phaserator%20%7C%20EZ%20Sound%20Extension.meta.js
// ==/UserScript==

const windowloc = window.location.host;

if (windowloc.includes("bank") || windowloc.includes("school")) return; //I LOVE THIS LOL

(function() {
    'use strict';

    //ha haha kill YEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHH XDDDDDD!!!!

    var ezsound = new Audio("https://cdn.discordapp.com/attachments/1038613925241028770/1038616885375287316/Chupenmela_p3rr4s_XD.wav");

    var kills = 0;

    setInterval(getkills, 1);

    function getkills(){
        var count = parseInt(document.getElementById("killCounter").innerText);
        if(count > kills){
            ezsound.play();
        }
        kills = count;
    }
})();