// ==UserScript==
// @name         [diep.io]diep.io automatic best features PowerBar.php
// @name:en      [diep.io]diep.io automatic best features PowerBar.php
// @author       MexHackClients
// @homepage     https://www.youtube.com/channel/UC_FjiI9elsM0SyBoDT0Fa_A?view_as=subscriber
// @namespace    https://www.youtube.com/channel/UC_FjiI9elsM0SyBoDT0Fa_A?view_as=subscriber
// @version      V0.1.0_Demo
// @description  My Youtube Videos https://www.youtube.com/watch?v=7hQPLWZYzSI
// @description:en  PowerBar.php
// @match        *://diep.io/
// @match        *iogames.space/*
// @match        *titotu.io/*
// @match        *io-games.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391003/%5Bdiepio%5Ddiepio%20automatic%20best%20features%20PowerBarphp.user.js
// @updateURL https://update.greasyfork.org/scripts/391003/%5Bdiepio%5Ddiepio%20automatic%20best%20features%20PowerBarphp.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var flag = 0;
    setInterval(function(){

        if(document.getElementById( "a" ).style.display == null || document.getElementById( "a" ).style.display !== "none" ){
        if(flag == 1)flag = 0;
        input.keyUp();//「」を解除
        input.keyUp();//「」を解除
        input.keyDown();//「」を押す
        setTimeout(function(){ input.keyUp(13);}, 300);
        }
        else{
    if(flag == 0){
    flag = 1;
    input.keyDown(75);//「K」を押す
    setTimeout(function(){ input.keyUp(75);}, 2000);
    input.set_convar('game_stats_build','848482567216753776225326756311313');//Power Random
    }
    setTimeout(function(){
    input.keyDown();//「」を押す
    input.keyDown();//「」を押す
    }, 2000);
        }

        }, 2000);
})();