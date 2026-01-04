// ==UserScript==
// @name		        The ULTIMATE Agario Script
// @name:en		        The ULTIMATE Agario Script
// @name:de		        The ULTIMATE Agario Script
// @namespace	        http://tampermonkey.net/
// @version		        2.4.1
// @description		    Easily configurable keys in code. Credits to Jack Burch, Tom Burris AND Ali Ahfad Mehdi
// @description:de	    Easily configurable keys in code. Credits to Jack Burch, Tom Burris AND Ali Ahfad Mehdi
// @author		        Frosty
// @match		        http://agar.io/*
// @match		        https://agar.io/*
// @match        *://agariohub.net/*
// @match               http://cellcraft.io/*
// @match               https://cellcraft.io/*
// @match               https://agariohub.net/*
// @match               http://agariohub.net/*
// @grant		        none
// @run-at		        document-end
// @require		        https://greasyfork.org/scripts/21918-color-changer/code/color%20changer.js?version=139529
// @require             https://greasyfork.org/scripts/28186-element-constructor/code/Element%20constructor.js?version=181746
// @downloadURL https://update.greasyfork.org/scripts/32175/The%20ULTIMATE%20Agario%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/32175/The%20ULTIMATE%20Agario%20Script.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Speed = 50;

//Funtions
function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}
function mass() {
    if (Feed) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(mass, Speed);
    }
}

function keydown(event) {
    switch(event.keyCode){
    // Feed Macro
    case 81:                                        // Q
    {
        Feed = true;
        setTimeout(mass,Speed);
    }// Center
    case 83:                                       // S
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X,clientY: Y}));
    break;
    // Tricksplit
    case 16:                // Shift and 4
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*2);
        setTimeout(split, Speed*3);
    break; // Triplesplit
    case 65:         // A and 3
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*2);
    break; // Doublesplit
    case 68:         // D and 2
        split();
        setTimeout(split, Speed);
    break;
    }
} // When Player Lets Go Of Q,It Stops Feeding
function keyup(event) {
    if (event.keyCode == 81) {
        Feed = false;
    }
}

//Mouse Clicks
(function() {
    $("#canvas").bind("mousedown",function(event) {
        switch(event.which){
        case 1:
            split();
        break;
        case 2:
            split();
            setTimeout(split, Speed);
            setTimeout(split, Speed*2);
            setTimeout(split, Speed*3);
        break;
        case 3:
            Feed = true;
            setTimeout(mass, Speed);
        break;
        }
    });

    $("#canvas").bind("mouseup",function(event) {
        if (event.which == 3) {
            Feed = false;
        }
    });
    $('#canvas').bind('contextmenu',function(e) {
        e.preventDefault();
    });
}());


//all name-skins
var skin = {
        people: [
            'tsipras',
            'trump','queen',
            'obama',
            'palin',
            'putin',
            'dilma',
            'fidel',
            'hillary',
            'hollande',
            'kim jong-un',
            'merkel',
            'berlusconi',
            'blatter',
            'boris',
            'bush',
            'cameron',
            'chavez',
            'clinton',
            'chaplin',
            'stalin'
        ],
        brands: [
            'cia',
            'reddit',
            '9gag','2ch.hk',
            '4chan',
            '8ch',
            'tumblr',
            'facebook',
            'facepunch',
            'prodota',
            'steam',
            'stussy',
            'ea',
            'origin',
            'vinesauce',
            'nasa',
            'irs',
            'receita federal'
        ],
        countries: [
            'argentina',
            'australia',
            'austria',
            'bangladesh',
            'belgium',
            'bosnia',
            'botswana',
            'brazil',
            'bulgaria',
            'cambodia',
            'canada',
            'chile',
            'china',
            'croatia',
            'denmark',
            'estonia',
            'finland',
            'france',
            'germany',
            'greece',
            'hong kong',
            'hungary',
            'india',
            'indiana',
            'indonesia',
            'iran',
            'iraq',
            'ireland',
            'isis',
            'italy',
            'jamaica',
            'japan',
            'kc',
            'latvia',
            'lithuania',
            'luxembourg',
            'maldivas',
            'mexico',
            'netherlands',
            'nigeria',
            'north korea',
            'norway',
            'pakistan',
            'peru',
            'poland',
            'portugal',
            'quebec',
            'romania',
            'russia',
            'scotland',
            'somalia',
            'south korea',
            'spain',
            'sweden',
            'switzerland',
            'taiwan',
            'texas',
            'thailand',
            'turkey',
            'ukraine',
            'united kingdom',
            'usa',
            'cuba',
            'venezuela'
        ],
        signs: [
            'confederate',
            'ussr',
            'german empire',
            'european union',
            'qing dynasty',
            'kc',
            'quebec',
            'sealand',
            'tsarist russia',
            'prussia',
            'byzantium',
            'imperial japan',
            'french kingdom',
            'satanist',
            'nazi',
            'matriarchy',
            'patriarchy',
            'feminism',
            'bait','8'
        ],
        memes: [
            'wojak',
            'yaranaika',
            'piccolo',
            'sanik',
            'ayy lmao',
            'sir',
            'doge',
            'pokerface'
        ],
        other: [
            'earth',
            'moon',
            'mars'
        ]
    }

//create all new DOM elements
var element = Element([
        'center',
        'button',
        'button',
        'select'
    ],
    [
        {
            style: 'margin: 0 0 20px 0; cursor: default',
            innerHTML: '<br><u><b>Ultimate Agar.io Script controlls:</b></u><br>Press <b>Q</b> to feed macro<br>Press <b>A</b> to triplesplit<br>Press <b>D</b> to doublesplit<br>Press <b>S</b> to center your cell(s)<br><b>left click</b> to split<br><b>mouse click</b> to tricksplit<br><b>right click</b> to macro feed'},
        {
            style: 'margin: 5px 0; position: absolute; left: 25px; bottom: 90px; width: 300px',
            class: 'btn btn-primary',
            innerHTML: 'Reload',
            onclick: 'location.reload()'},
        {
            style: 'margin: 5px 0; position: absolute; right: 25px; bottom: 10px; width: 147px',
            class: 'btn btn-primary',
            innerHTML: 'Respawn',
            onclick: 'MC.setNick(document.getElementById("nick").value); return false;'},
        {
            style: 'margin: 5px 0 0 5px; width: 135px',
            class: 'form-control',
            onclick: 'changeSkin(this.value)'
        }
    ])

$(document.querySelector('#instructions').querySelector('center')).after(element[0])
$('#socialStats').before(element[1])
$('#statsContinue').after(element[2])
$('#instructions').css({cursor: 'default'})
$('#stats').css({height: '368px'})
$('#statsGraph').css({bottom: '140px'})
$('#statsContinue').css({width: '147px'})
$('.agario-panel').css({color: 'rgba(255, 255, 255, 1)', 'background-color': 'rgba(0, 0, 0, 0.5)'})
$('.agario-wallet-container').css({'background-color': 'rgba(255, 255, 255, 1)'})
$('.agario-wallet-label')[0].css({color: 'black'})
$('hr').css({'width':'0px','height':'0px'});
$('span').css({'color':'white'});
$('.text-muted')[1].css({color: 'rgba(255, 255, 255, 1)'})
$('#advertisement').css({position:'absolute',left:'-1000%', visibility: 'hidden'})

/*
Script by Frosty 
CREDITS TO: Frosty
*/