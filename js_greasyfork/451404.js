// ==UserScript==
// @name         steam alert online only games for SP player alpha
// @description  I don't want to be rubbed on the floor by other players in the game
// @namespace    steam_ol_alert
// @author       Covenant
// @version      1.0.1
// @license      MIT
// @homepage
// @match        https://store.steampowered.com/app/*
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAQAEAAAAAAAAAAAAAAAEAAAAAAAB1c3QAm6yhAFFWUwDA1cgAtra2ALm/vACPlpEAfHx8AGtvbQCMjIwAXltdAMXKxwANCQwAHBsbAP///wAJBgcA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHw8PDw8PDw8PDw8PDw8PHw8PDwcLCwANDw8PDw8PDw8PDwoODQ0DAA8PDw8PDw8PDwoDCgQEDQMPDw8PDw8PDwEODg4ODg0ODw8PDw8PDw8ODg4ODg4NDgsNDw8PDw8PDg4ODg4NBQ4ODgAPDw8PDw4OAAAFDg4ODg4ODgYNDw8CDw8PDw0ODg4ODg4ODgoPDw8PDw8PCQ4OBAwMDAgODw8PDw8PDw8DDgwBDgENDgoPDw8PDw8PAg4MDg4ODA4KDw8PDw8PDw0ODAEOAQ0ODw8PDw8PDw8NCw4MDAwOCw8PDw8PDw8PDwILDg4OCwwPHw8PDw8PDw8PDQ0CDQ8PH4ABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAAA=
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/451404/steam%20alert%20online%20only%20games%20for%20SP%20player%20alpha.user.js
// @updateURL https://update.greasyfork.org/scripts/451404/steam%20alert%20online%20only%20games%20for%20SP%20player%20alpha.meta.js
// ==/UserScript==
var flag_is_OL_game=false;
var flag_is_MMORPG=false;
var flag_is_free=false;
var flag_sp=false;
var flag_mp=false;
var flag_casino=false;//genshit
var ary_tag=[['Singleplayer','單人','シングルプレイヤー'],
             ['MMORPG','MMORPG','MMORPG'],
             ['Free to Play','免費遊玩','無料プレイ'],
             ['Multiplayer','多人','マルチプレイヤー'],
             ];
function main_01(){
    var label =document.querySelectorAll('a>div.label')
    var title=document.querySelectorAll('div.apphub_HeaderStandardTop')
    var div_print=document.createElement('div');
    title[0].appendChild(div_print);
    for(let i = 0; i < label.length; i++){
        if(label[i].textContent=="Single-player"||label[i].textContent=="單人"||label[i].textContent=="シングルプレイヤー"){
            flag_sp=true;
        }
        else if(label[i].textContent.search(/online/i)!=-1||label[i].textContent.search("線上")!=-1||label[i].textContent.search("オンライン")!=-1){
            flag_mp=true;
        }
        else if(label[i].textContent.search(/Purchases/i)!=-1||label[i].textContent.search("購買")!=-1||label[i].textContent.search("購入")!=-1){
            flag_casino=true;
        }
    }
    if(!flag_sp&&flag_mp){
        flag_is_OL_game=true;
        div_print.classList.add("no_sp");
    }
    else{
        flag_sp=false;
        flag_mp=false;
        var app_tag=document.querySelectorAll('div>a.app_tag')
        for(let n = 0; n < app_tag.length; n++){//check tag
            app_tag[n].style.setProperty("display", "");
            for(let i = 0; i < ary_tag.length; i++){
                for(let j = 0; j < ary_tag[i].length; j++){//lang
                    if(app_tag[n].innerText.replace(/(\r\n|\n|\r|\t)/gm,"")==ary_tag[i][j]){
                        if(i==0)flag_sp=true;
                        if(i==1)flag_is_MMORPG=true;
                        if(i==2)flag_is_free=true;
                        if(i>2)flag_mp=true;
                    }
                }
                if(flag_is_MMORPG)break;
            }
            if(flag_is_MMORPG)break;
        }
        if(flag_is_MMORPG){
            flag_is_OL_game=true;
            div_print.classList.add("tag_mmorpg");
        }
        else if(!flag_sp&&flag_mp){
            flag_is_OL_game=true;
            div_print.classList.add("tag_mp");
        }
        else if(flag_is_free&&flag_casino){
            flag_is_OL_game=true;
            div_print.classList.add("tag_mp_casino");
        }
    }
    var app_name=document.querySelector('#appHubAppName')
    if(flag_is_OL_game){
        //app_name.style.setProperty("text-decoration", "line-through");
        div_print.textContent="⚠online only👥"
        if(flag_casino)div_print.textContent+="🎰"
        div_print.style.fontSize = "25px";
    }
}
(function() {
    'use strict';
    main_01();
    // Your code here...
})();