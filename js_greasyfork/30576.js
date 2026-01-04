// ==UserScript==
// @name        brofist 2play
// @namespace   brofist 2play
// @include     http://brofist.io/modes/twoPlayer/c/index.html
// @version     1
// @description have fun
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30576/brofist%202play.user.js
// @updateURL https://update.greasyfork.org/scripts/30576/brofist%202play.meta.js
// ==/UserScript==

var isCheat = false;
document.getElementsByTagName('body')[0].onkeypress = function(e){
    var which = e.which;
    if(which == 51){
        isCheat = !isCheat;
        if (isCheat){
            console.log('cheat on');
        } else{
            console.log('cheat off');
        }
    }
};
document.getElementsByTagName('body')[0].onkeydown = function(e) {
    
    var keyCode = e.keyCode;
    if(!isCheat){
        return true;
    }
    if(keyCode == 81){
        plyer.shapes[0].body.position[0] -= 1;
        console.log('position horizontal: -1');
    }
    if(keyCode == 87){
        plyer.shapes[0].body.position[0] += 1;
        console.log('position horizontal: +1');
    }
    if(keyCode == 69){
        plyer.shapes[0].body.position[1] -= 1;
        console.log('position vertical: -1');
    }
    if(keyCode == 82){
        plyer.shapes[0].body.position[1] += 1;
        console.log('position vertical: +1');
    }
    if(keyCode == 65){
        plyer.velocityValue += 50;
        console.log('speed: +50');
    }
    if(keyCode == 83){
        plyer.velocityValue -= 50;
        console.log('speed: -50');
    }
    if(keyCode == 90){
        plyer.world.gravity[1] = 9.779999732971191;
        console.log('has up gravity');
    }
    if(keyCode == 67){
        plyer.world.gravity[1] = 0;
        console.log('has not gravity');
    }
    if(keyCode == 88){
        plyer.world.gravity[1] = -9.779999732971191;
        console.log('has down gravity');
    }
    if(keyCode == 49){
        plyer.jumpValue = 1600;
        console.log('high jump');
    }
    if(keyCode == 50){
        plyer.jumpValue =800;
        console.log('short jump');
    }
    if(keyCode == 68){
        plyer.shapes[0].collisionResponse = false;
        console.log('has not collision');
    }
    if(keyCode == 70){
        plyer.shapes[0].collisionResponse = true;
        console.log('has collision');
    }
    console.log(keyCode);
};﻿