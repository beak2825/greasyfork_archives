// ==UserScript==
// @name         Polarity Script W/Auto
// @version      1.0
// @description  Raining Pennies
// @author       ZileWrath + Lefty
// @icon         https://i.imgur.com/C72wVr7.jpg
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @namespace https://greasyfork.org/users/175033
// @downloadURL https://update.greasyfork.org/scripts/39553/Polarity%20Script%20WAuto.user.js
// @updateURL https://update.greasyfork.org/scripts/39553/Polarity%20Script%20WAuto.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('input[name=sentiment]').eq(1).click();
    $('input[name=sentiment]').eq(5).click();
    $('input[name=sentiment]').eq(9).click();
    $('input[name=sentiment]').eq(13).click();
    $('input[name=sentiment]').eq(17).click();
    $('input[name=sentiment]').eq(21).click();
    $('input[name=sentiment]').eq(25).click();
    $('input[name=sentiment]').eq(29).click();
    $('input[name=sentiment]').eq(33).click();
    $('input[name=sentiment]').eq(37).click();
    $('input[name=sentiment]').eq(41).click();
    $('input[name=sentiment]').eq(45).click();
    $('input[name=sentiment]').eq(49).click();
    $('input[name=sentiment]').eq(53).click();
    $('input[name=sentiment]').eq(57).click();
    $('input[name=sentiment]').eq(61).click();
    $('input[name=sentiment]').eq(65).click();
    $('input[name=sentiment]').eq(69).click();
    $('input[name=sentiment]').eq(73).click();
    $('input[name=sentiment]').eq(77).click();
        $('input[name=sentiment]').eq(81).click();
        $('input[name=sentiment]').eq(85).click();
        $('input[name=sentiment]').eq(89).click();
        $('input[name=sentiment]').eq(93).click();
        $('input[name=sentiment]').eq(97).click();
        $('input[name=sentiment]').eq(101).click();
        $('input[name=sentiment]').eq(105).click();
        $('input[name=sentiment]').eq(109).click();
        $('input[name=sentiment]').eq(113).click();
        $('input[name=sentiment]').eq(117).click();
        $('input[name=sentiment]').eq(121).click();
        $('input[name=sentiment]').eq(125).click();
        $('input[name=sentiment]').eq(129).click();
        $('input[name=sentiment]').eq(133).click();
        $('input[name=sentiment]').eq(137).click();
        $('input[name=sentiment]').eq(141).click();
        $('input[name=sentiment]').eq(145).click();
        $('input[name=sentiment]').eq(149).click();

    setTimeout(function(){
        $('input[type=submit]').click();
    },10000);
});