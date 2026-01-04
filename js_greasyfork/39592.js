// ==UserScript==
// @name         Adsforce all Script
// @version      1.1
// @description  Raining Pennies
// @author       ZileWrath
// @icon         https://i.imgur.com/C72wVr7.jpg
// @include      *facebook*
// @include      *adsforce*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @namespace https://greasyfork.org/users/175033
// @downloadURL https://update.greasyfork.org/scripts/39592/Adsforce%20all%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/39592/Adsforce%20all%20Script.meta.js
// ==/UserScript==

$(document).ready(function() {
    //$(document).css('background-color', 'green');
    var sanity = "[ With Sound OFF ]Overlaid text appears in the video.";
    var sanity2 = "[ With Sound OFF ]This ad makes you feel:";
    //var sanity3 = "[ With Sound ON ]Does the video include verbal communication?";
    //if($('._3swz').eq(0).text() === sanity) return;
   // else if($('._3swz').eq(0).text() === sanity2) return;
    //else if($('._3swz').eq(0).text() === sanity3) return;
    //SLIDER_CLICK();
    console.log("ALL on");
    setTimeout(function(){spam();},9000);
    


});

function spam(){
    var numba = randNum(1,4);
    if(numba === 1){
        $('button._1rsf._4jy0._4jy3').eq(0).click();//strong disagree
        $('button._1rsf._4jy0._4jy4._4jy2._51sy.selected._42ft').eq(0).click();//next
        $('button._4jy0._4jy4._4jy1._51sy.selected._42ft').eq(0).click();
    }else if(numba === 2){
        $('button._1rsf._4jy0._4jy3').eq(1).click();//somewhat disagree
        $('button._1rsf._4jy0._4jy4._4jy2._51sy.selected._42ft').eq(0).click();//next
        $('button._4jy0._4jy4._4jy1._51sy.selected._42ft').eq(0).click();
    }else if(numba === 3){
        $('button._1rsf._4jy0._4jy3').eq(3).click();//somewhat agree
        $('button._1rsf._4jy0._4jy4._4jy2._51sy.selected._42ft').eq(0).click();//next
        $('button._4jy0._4jy4._4jy1._51sy.selected._42ft').eq(0).click();
    }else if(numba === 4){
        $('button._1rsf._4jy0._4jy3').eq(4).click();//strongly agree
        $('button._1rsf._4jy0._4jy4._4jy2._51sy.selected._42ft').eq(0).click();//next
        $('button._4jy0._4jy4._4jy1._51sy.selected._42ft').eq(0).click();

    }
    numba = randNum(1,4);
    setTimeout(function(){spam();},9000);
}
function SLIDER_CLICK () {
        var slider = document.querySelector('._5r9r');
        function ageClick (el, value) {const event = new MouseEvent('mousedown', {bubbles: true, clientX : value}); el.dispatchEvent(event);}
        function ageClickRelease (el, value) {const event = new MouseEvent('mouseup', {bubbles: true, clientX : value}); el.dispatchEvent(event);}
        var slideLocation = Number(getComputedStyle(document.querySelector('._3gp5')).marginLeft.split('px')[0]);
        var offset = slideLocation + 60;
        ageClick(slider, offset);
        ageClickRelease(slider, offset);
        console.log('Margin-Left: ' + slideLocation + ' - Offset: ' + offset);
    }