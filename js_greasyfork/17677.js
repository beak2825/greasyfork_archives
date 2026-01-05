// ==UserScript==
// @name         Twitch theatre mode
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Enter theatre mode automaticaly on stream and video pages on twitch
// @author       NewDivide
// @grant        none
// @include      http://www.twitch.tv/*
// @downloadURL https://update.greasyfork.org/scripts/17677/Twitch%20theatre%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/17677/Twitch%20theatre%20mode.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var actualPath = "";
var firstRun = true;
var time = 1000;

function validPath(newPath){
    var ret = false;
    newPath = newPath.split("/");
    
    if(newPath.length == 2){
        if(newPath[0] == "" && newPath[1] != "directory" && newPath[1] != ""){
            ret = true;
        }
    }
    
    if(newPath.length == 4){
        if(newPath[0] == "" && newPath[2] == "v"){
            ret = true;
        }
    }
    
    return ret;
}
    
function btnList(){
   return document.getElementsByClassName("player-button player-button--theatre js-control-theatre");
}

function click(i){
    //log(i);
    var btn = btnList();
    if(btn.length == 0){
        if(i < 20){            
            setTimeout(function(){click(i + 1);}, 500);
        }
    } else {
        if(btn[0] == undefined){
            if(i < 20){            
                setTimeout(function(){click(i + 1);}, 500);
            }
        } else {
            btn[0].addEventListener("unload", function(){time = 5000;timeOut();});
            btn[0].click();
        }
    }
}

function doClick(){
    if(btnList().length == 0){
        window.addEventListener("load",function() {click(0);}, false);
    } else {
        click(0);
    }
}

function log(str){
    console.log("---------------")
    console.log(str);
    console.log("---------------")
}

//-----------------------LOOP-------------------------//

function checkIfPathChanged(){
    var pathToCheck = window.location.pathname;
    if(actualPath != pathToCheck){
        actualPath = pathToCheck;
        firstRun = true;
        if(validPath(pathToCheck)){
            doClick();
        } else {
            time = 1000;
            timeOut();
        }        
    } else {
        timeOut();
    }
}

function timeOut(){
    setTimeout(function(){checkIfPathChanged();}, time);
}

checkIfPathChanged();
//-----------------------LOOP-------------------------//