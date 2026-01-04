// ==UserScript==
// @name         Name Flicker
// @namespace    nameflicker
// @version      1.3
// @description  change from gold to white name automatically
// @author       HutDude
// @match        https://agma.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415826/Name%20Flicker.user.js
// @updateURL https://update.greasyfork.org/scripts/415826/Name%20Flicker.meta.js
// ==/UserScript==
var usernameparts = {

    part1: "xRE",
    part2: "NDE",
    part3: "x",
}

var username = usernameparts.part1 + usernameparts.part2 + usernameparts.part3;

if (username === localStorage.username){
    var $onButton = $('<br><label id="on" style="color: white;  background-color: black; margin: 5px; margin-top: 15px; padding: 5px;"><span>Name Flicker on</span></label>');
    var $offButton = $('<label id="off" style="color: white; background-color: black; margin: 5px; padding: 5px; margin-top: 15px; "><span>Name Flicker off</span></label>');
    var $ms = $('<br><input id="ms" type="number" min="1"; style="margin: 5px; outline: none; color: white; background: black; border: none; " placeholder="ms">');

    var isOn = false;

    $ms.insertAfter("#spectateBtn");
    $offButton.insertAfter("#spectateBtn");
    $onButton.insertAfter("#spectateBtn");

    function getms(){
        if(document.getElementById("ms").value != 0){
            return(document.getElementById("ms").value);
        }else{
            return(500);
        }
    }

    function loop(){
        setTimeout(
            function(){
                if(isOn){
                    $("span:contains(Gold Nickname)").click();
                }
                loop();
                getms();
            }
            , getms());
    }

    $("#on").click(function(){
        isOn = true;
    });

    $("#off").click(function(){
        isOn = false;
    });
//press n to turn the flicker on/off
//set the overlayClosed to false if esc is clicked
    window.addEventListener("keydown", function(event){

        // Do nothing if a menu is open
        if (document.getElementById('overlays').style.display != 'none' || document.getElementById('advert').style.display != 'none') {
            return;
        }
        // Ignore text input field so typing in them is possible
        if (document.activeElement.type == 'text' || document.activeElement.type == 'password') {
            return;
        }

        if (event.keyCode == 78){
            if (isOn){
                isOn = false;
            }else{
                isOn = true;}
        }

    });

    loop();


    console.log("name flicker by hutdude loaded");
}