// ==UserScript==
// @name        Hide 0.10 Alex Thingys

// @author      Hunter
// @description Hides 0.06 Alex Instructions
// @include     *
// @version     3
// @namespace   Hunter
// @downloadURL https://update.greasyfork.org/scripts/396855/Hide%20010%20Alex%20Thingys.user.js
// @updateURL https://update.greasyfork.org/scripts/396855/Hide%20010%20Alex%20Thingys.meta.js
// ==/UserScript==


document.getElementsByClassName('accordion col-12')[0].style.display='none';
document.getElementsByName('c0')[0].click();
document.getElementsByName('c1')[0].click();
document.getElementsByName('c2')[0].click();
document.getElementsByName('c3')[0].click();
document.getElementsByName('c4')[0].click();

function togglep(){
    document.getElementsByName('c0')[1].click();
}

function toggleq(){
    document.getElementsByName('c1')[1].click();
}

function toggler(){
    document.getElementsByName('c2')[1].click();
}

function toggles(){
    document.getElementsByName('c3')[1].click();
}

function togglet(){
    document.getElementsByName('c4')[1].click();
}

document.body.onkeydown = function(event){
    event = event || window.event;
    var keycode = event.charCode || event.keyCode;
    if(keycode === 99){
        togglep();
    }
    if(keycode === 98){
        toggleq();
    }
    if(keycode === 97){
        toggler();
    }
    if(keycode === 100){
        toggles();
    }
    if(keycode === 101){
        togglet();
    }
}



//document.getElementsByClassName('card')[2].style.display='none';

//document.getElementById("Attenuator1_modifier").select();
