// ==UserScript==
// @name        Keyboard Navigation - strangereons.com
// @namespace   Violentmonkey Scripts
// @match       https://strangereons.com/*
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM_setValue
// @version     1.2.3
// @author      -
// @description 9/17/2022, 11:43:10 AM
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @require https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/451516/Keyboard%20Navigation%20-%20strangereonscom.user.js
// @updateURL https://update.greasyfork.org/scripts/451516/Keyboard%20Navigation%20-%20strangereonscom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var item = -1;
    var highlightColor = "#ff00cc";
    function highlight() {
      $('a[rel="prev"]').last().css("color", highlightColor);
      $('a[rel="next"]').css("color", "");
      $('a[rel="next"]').eq(item).css("color", highlightColor);
    }
    function onUar() {
        if(item > -$('a[rel="next"]').length) item--;
        highlight();
    }
    function openDialog() {
        $('.dialog_btn')[0].click();
        console.log("Opening Dialog");
    }
    function autoDialog(){
       highlight();
      if(GM_getValue("AutoDialog", false)){
      console.log("Autodialog Enabled");
      if($(".dialog").css("height")!="auto"){
        console.log($(".dialog").css("height"));
       openDialog();
      }
      $('.dialog_btn').text("AUTO OPENED");
     }

    }
    function onDar() {
        if(item < -1) item++;
        highlight();
    }
    function onRar() {
        $('a[rel="next"]').eq(item)[0].click();
    }
    function onLar() {

       $('a[rel="prev"]').eq(-1)[0].click();
    }
    function toggleHidden(){
      console.log("test:");
      console.log(!$(".hidden").attr("style"));
      if(!$(".hidden").attr("style")){
        $(".hidden").css("color","#00ff00");
      }else{
        $(".hidden").css("color","");
      }
    }
    function onKeydown(evt) {
        if (evt.keyCode == 39) { //right arrow
            onRar();
        }else if (evt.keyCode == 37){ //left arrow
            onLar();
        }else if (evt.keyCode == 38){ //up arrow
            onUar();
        }else if (evt.keyCode == 40){ //down arrow
            onDar();
        }else if (evt.keyCode == 32){ //space bar
            openDialog();
        }else if (evt.keyCode == 86){ //v (toggle hidden text)
            toggleHidden();
        }else if (evt.keyCode == 65){ //a (toggle auto dialog)
            GM_setValue("AutoDialog", !GM_getValue("AutoDialog", false));
            openDialog();
            if(!GM_getValue("AutoDialog")){
              $('.dialog_btn').text("Open Dialog");
            }else{
              $('.dialog_btn').text("AUTO OPENED");
            }
        }


    }
    document.addEventListener('keydown', onKeydown, true);
    $(".dialog").ready(autoDialog());


    console.log("Arrow Navigation Enabled!");
})();