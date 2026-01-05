// ==UserScript==
// @name        CandyHaXs
// @description A Script allowing you to cheat in Candybox 2.
// @include     http://candybox2.net/*
// @version     1
// @grant       none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/users/2236
// @downloadURL https://update.greasyfork.org/scripts/1716/CandyHaXs.user.js
// @updateURL https://update.greasyfork.org/scripts/1716/CandyHaXs.meta.js
// ==/UserScript==

//Game Container
var gameHax = 0;

// Magic Injection :P
(function() {
    var candiesEaten = Game.prototype.getCandiesEaten;
    Object.defineProperty(Game.prototype, "getCandiesEaten", {
        get: function() {
            gameHax = this;
            return candiesEaten;
        }
    });
})();

// Append everything
$(function() {
    setupWindow();
    addNumber("addCandies", "Add Candies", addCandies);
    addNumber("addLollipops", "Add Lollipops", addLollipops);
    addNumber("addChocolate", "Add Chocolate Bars", addChocolate);
    addNumber("addPains", "Add Pains Au Chocolat", addPains);
    addButton("fullHealth", "Refill Health", fullHealth);
    addButton("showButtons", "Reveal hidden Areas", showASCIIButtons);
});

function setupWindow() {
    $('#aroundStatusBar').append('<div id="hackmenu"><div id="hackwindow"></div><div id="toggle">H4X0R</div></div>');
    $('head').append('<style>'+css+'</style>');
    
    $('#hackwindow').hide();
    $('#hackmenu #toggle').click(function() {
        if ($('#hackmenu #hackwindow').is(':hidden')) 
            $('#hackmenu #hackwindow').slideDown();
        else
            $('#hackmenu #hackwindow').slideUp();
    });
}

function addNumber(name, label, func) {
    $('#hackwindow').append('<div id="'+name+'" class="number"><label for="'+name+'">'+label+'</label><input id="num_'+name+'" name="num_'+name+'" type="text" /></div>');
    $('#num_'+name).pressEnter(func);
}

function addButton(name, label, func) {
    $('#hackwindow').append('<div id="'+name+'" class="button"><label for="'+name+'">'+label+'</label><div id="but_'+name+'" class="button_set">Click</button></div>');
    $('#but_'+name).click(func);
}

function addCheckbox(name, label, func) {
    $('#hackwindow').append('<div id="'+name+'" class="check"><label for="'+name+'">'+label+'</label><input id="chk_'+name+'" name="chk_'+name+'" type="checkbox" /></div>');
    $('#chk_'+name).click(func);
}

// --------------------------------------------- Real Cheats ----------------------------------------------------

function addCandies(e) {
    if (gameHax != 0) {
        var candies = parseInt($(this).val());
        if (!isNaN(candies))
           gameHax.getCandies().add(candies);
    }
}

function addLollipops(e) {
    if (gameHax != 0) {
        var lollipops = parseInt($(this).val());
        if (!isNaN(lollipops))
           gameHax.getLollipops().add(lollipops);
    }
}

function addChocolate(e) {
    if (gameHax != 0) {
        var chocolate = parseInt($(this).val());
        if (!isNaN(chocolate))
           gameHax.getChocolateBars().add(chocolate);
    }
}

function addPains(e) {
    if (gameHax != 0) {
        var pains = parseInt($(this).val());
        if (!isNaN(pains))
           gameHax.getPainsAuChocolat().add(pains);
    }
}

function fullHealth(e) {
    if (gameHax != 0) {
        gameHax.getPlayer().hp = gameHax.getPlayer().maxHp;
    }
}

function showASCIIButtons(e) {
    if (gameHax != 0) {
        $("<style>.asciiButton{background-color: rgba(0,0,255,0.2);} .aroundComment{background-color: rgba(0,255,0,0.2);} .asciiNinjaButton{background-color: rgba(255,0,0,0.2);}</style>").appendTo('head');
    }
}

// ------------------------------------------------ CSS ---------------------------------------------------------

var css = '\
#hackmenu {\
    position: absolute;\
    left: 0px;\
    top: 0px;\
    font-family: "Verdana", sans-serif;\
    font-size: 14px;\
}\
#hackmenu #toggle {\
    width: 50px;\
    height: 20px;\
    cursor: pointer;\
}\
#hackwindow {\
    background-color: #333333;\
    height: 500px;\
    width: 335px;\
    text-align: left; \
    padding: 1px 0px 0px;\
}\
.button {\
    height: 30px; \
    margin: 5px;\
}\
.button:after {\
    clear: both; \
    display: block;\
    content: "";\
}\
.button label {\
    padding: 5px;\
    height: 20px; \
    width: 150px;\
    color: #ffffff; \
    display: block;\
    float: left;\
}\
.button .button_set {\
    padding: 2px;\
    height: 20px; \
    width: 150px;\
    margin-left: 160px;\
    display: block;\
    background-color: #DDDDDD;\
    border: 1px solid #666666;\
    border-radius: 2px;\
    text-align: center;\
}\
.number {\
    height: 30px; \
    margin: 5px;\
}\
.number:after {\
    clear: both; \
    display: block;\
    content: "";\
}\
.number label {\
    padding: 5px;\
    height: 20px; \
    width: 150px;\
    color: #ffffff; \
    display: block;\
    float: left;\
}\
.number input {\
    padding: 2px;\
    height: 20px; \
    margin-left: 160px;\
    width: 150px;\
    display: block;\
}\
.check {\
    height: 30px; \
    margin: 5px;\
}\
.check:after {\
    clear: both; \
    display: block;\
    content: "";\
}\
.check label {\
    padding: 5px;\
    height: 20px; \
    width: 150px;\
    color: #ffffff; \
    display: block;\
    float: left;\
}\
.check input {\
    margin-left: 160px;\
    display: block;\
}\
\
';

$.fn.pressEnter = function(fn) {  

    return this.each(function() {  
        $(this).bind('enterPress', fn);
        $(this).keyup(function(e){
            if(e.keyCode == 13)
            {
              $(this).trigger("enterPress");
            }
        })
    });  
 };