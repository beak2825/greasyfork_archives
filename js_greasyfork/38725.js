// ==UserScript==
// @name         e621 Page Arrows
// @namespace    NA
// @version      0.2
// @description  Change page on e621 using arrow keys
// @author       kittywithclaws
// @include      https://e621.net/post/show/*
// @include      https://e621.net/post/index/*
// @downloadURL https://update.greasyfork.org/scripts/38725/e621%20Page%20Arrows.user.js
// @updateURL https://update.greasyfork.org/scripts/38725/e621%20Page%20Arrows.meta.js
// ==/UserScript==

//If it detects a Next or Previous button, add a keydown check.
//[Next >>] is used by Pool buttons, and [Next »] is used by the index. Mildly annoying inconsistent design.
var pool = false;
if(getElementsByText('Next >>').length!==0 || getElementsByText('<< Previous').length!==0){
    pool = true;
    document.body.onkeydown = function() {checkKeycode();};
}else if(getElementsByText('Next »').length!==0 || getElementsByText('« Previous').length!==0){
    document.body.onkeydown = function() {checkKeycode();};
}

//This skims the page for elements by text. Used to find Next/Prev buttons.
function getElementsByText(str, tag = 'a') {
  return Array.prototype.slice.call(document.getElementsByTagName(tag)).filter(el => el.textContent.trim() === str.trim());
}

function checkKeycode(event) {
    // handling Internet Explorer stupidity with window.event
    // @see http://stackoverflow.com/a/3985882/517705
    var keyDownEvent = event || window.event,
        keycode = (keyDownEvent.which) ? keyDownEvent.which : keyDownEvent.keyCode;

    //console.log(keycode);
    if(keycode==39 || keycode==37){
        changePage(keycode);
    }
    return false;
}
//Check if Left or Right arrow are pressed, and change page accordingly.
function changePage(keycode){
    if(keycode==39){
        //Right
        /*console.log(
            getElementsByText('Next >>')[0].href
        );*/
        if(pool){
            window.location.assign(getElementsByText('Next >>')[0].href);
        }else{
            window.location.assign(getElementsByText('Next »')[0].href);}
    }else if(keycode==37){
        //left
        /*console.log(
            getElementsByText('<< Previous')[0].href
        );*/
        if(pool){
            window.location.assign(getElementsByText('<< Previous')[0].href);
        }else{
            window.location.assign(getElementsByText('« Previous')[0].href);
        }
    }
}