// ==UserScript==
// @name         TV live stream Ad Remover
// @namespace    undefined
// @version      0.2
// @description  Remove the Ad and start to play with 4 seconds delay.
// @author       Gluke
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @match        http://chaochaolive.icntv.xyz/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31073/TV%20live%20stream%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/31073/TV%20live%20stream%20Ad%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#playerframe').load(function() {
        setTimeout(function() {hidead2();}, 4000);
        //Will be called after #player2 is loaded.
        //Delay can be adjusted to fit your situation.
    });

    checkElement();

    function checkElement() {
        if (document.getElementById('channel_list')) {
            setTimeout(addRemoveFunc, 2000);
            setTimeout(checkElement, 5000);
        } else {
            setTimeout(checkElement, 15);
        }
    }

    function addRemoveFunc() {
        var first = document.getElementById("channel_list");
        var second = first.getElementsByTagName("div");
        var inputList = Array.prototype.slice.call(second);
        for(i = 0;i < inputList.length; i++)
        {
            if(inputList[i].getAttribute("class")=="iconbox chvip0"){
                if(!inputList[i].getAttribute("onclick").includes("hidead2")){
                    inputList[i].setAttribute("onclick",
                                inputList[i].getAttribute('onclick')+
                                "; setTimeout(function() {hidead2();}, 4000);");
                }
            }
        }
    }
})();