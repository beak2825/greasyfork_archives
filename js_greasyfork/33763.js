// ==UserScript==
// @name         NyQuery
// @namespace    https://greasyfork.org/users/144229
// @version      1.1.5
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @require      http://code.jquery.com/jquery-latest.min.js
// ==/UserScript==

function hotKey(element, input){ //Adds click hotkey for given element(s) based on direct keyboard input (not event codes)
    $(document).keypress(function(event){
        if (String.fromCharCode(event.which) == input){
            $(element).click();
        }
    });
}

function clickText(text, input){ //Adds click hotkey for any element containing given text (case sensitive) based on direct keyboard input
    $(document).keypress(function(event){
        if (String.fromCharCode(event.which) == input){
            $(':contains('+text+')').click();
        }
    });
}

function randNum(min, max) { //returns a random integer between min and max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function newPic(href, w = "auto", h = "auto"){ //returns and img html object
    return `<img src=${href} style="width:${w}px;height:${h}px;"></img>`;
}

function afterPic(obj, href, w = "auto", h = "auto"){ // adds an image after object. Object, url
    $(obj).after(newPic(href, w, h));
}

function beforePic(obj, href, w = "auto", h = "auto"){ // adds an image before object. Object, url
    $(obj).before(newPic(href, w, h));
}

function noRules(){ //replaces instructions with a hide/show button
    if($('.panel.panel-primary').length){ $('.panel.panel-primary').hide().before('<div><button id="toggle" style="background-color:#008CBA; border: none; color: white;" type="button">Show Instructions</button></div>');}
    $('#toggle').click(function () {
        $(this).text($(this).text() === 'Show Instructions' ? 'Hide Instructions' : 'Show Instructions');
        $('.panel-heading').toggle();
        $('.panel.panel-primary').toggle();
    });
}

function newButt(id, text=id, cl="nybutt", bg="green"){ //returns an html button
    return `<button id=${id} class=${cl} style="background:${bg}; border: none; color: white; vertical-align:middle;" type="button">${text}</button>`;
}

function clickButt(obj, func=$()){ //creates a click function for button (or anything really) functions purpose is for readability.
    $(obj).click(func);
}

function gmGet(name) { //get local variable
    var theValue = GM_getValue(name);
    return theValue;
}

function gmSet(name, valuee) { //set local variable
    GM_setValue(name, valuee);
}

function newStyle(pop) { //changes style of html element
    var div = $('<div />', {
        html: '&shy;<style>' + pop + '</style>'
    } ).appendTo('body');
}