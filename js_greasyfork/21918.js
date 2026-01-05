// ==UserScript==
// @name         color changer
// @namespace    http://www.greasespot.net/
// @version      0.2
// @author       Arnie
// ==/UserScript==

function changeColor(font, bg, objId, objClass){
    if(objClass == undefined){
        $('#' + objId).css({'color':font, 'backgroundColor':bg})
    }else if(objId == "" || objId == ''){
        $('.' + objClass).css({'color':font, 'backgroundColor':bg})
    }
}