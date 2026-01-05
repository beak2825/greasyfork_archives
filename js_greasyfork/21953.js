// ==UserScript==
// @name	    	The ULTIMATE Agario Script NEXT GENERATION DEMO
// @name:en	    	The ULTIMATE Agario Script NEXT GENERATION DEMO
// @name:de	    	The ULTIMATE Agario Script NEXT GENERATION DEMO
// @namespace		http://tampermonkey.net/
// @version		    3.2
// @description		Easily configurable keys in code. Credits to Jack Burch, Tom Burris AND Ali Ahfad Mehdi
// @description:de	Easily configurable keys in code. Credits to Jack Burch, Tom Burris AND Ali Ahfad Mehdi
// @author	    	Arnie
// @match	    	http://agar.io/*
// @match	    	https://agar.io/*
// @grant	    	none
// @run-at		    document-end
// @require	    	https://greasyfork.org/scripts/21918-color-changer/code/color%20changer.js?version=139529
// @downloadURL https://update.greasyfork.org/scripts/21953/The%20ULTIMATE%20Agario%20Script%20NEXT%20GENERATION%20DEMO.user.js
// @updateURL https://update.greasyfork.org/scripts/21953/The%20ULTIMATE%20Agario%20Script%20NEXT%20GENERATION%20DEMO.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Speed = 10;
var splits = 1;

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
    // Feed Macro
    if (event.keyCode == 81 )                                        // Q
    {
        Feed = true;
        setTimeout(mass, Speed);
    }// Center
    if (event.keyCode == 83) {                                       // S
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }
    // Tricksplit
    if (event.keyCode == 16 || event.keyCode == 52) {                // Shift and 4
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*2);
        setTimeout(split, Speed*3);
    } // Triplesplit
    if (event.keyCode == 65 || event.keyCode == 'yourkey') {         // A and Put in Your Key
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*2);
    } // Doublesplit
    if (event.keyCode == 68 || event.keyCode == 'yourkey') {         // D and Put in Your Key
        split();
        setTimeout(split, Speed);
    }// Split
    if (event.keyCode == 'yourkey' || event.keyCode == 'yourkey2') { // Put in Your Key
        split();
    }
        

} // When Player Lets Go Of Q, It Stops Feeding
function keyup(event) {
    if (event.keyCode == 81) {
        Feed = false;
    }
}

//Mouse Clicks
(function() {
    document.getElementById("canvas").addEventListener("mousedown", function(event) {
        if (event.which == 1) {
            split();
        }
        else if (event.which == 2) {
            split();
            setTimeout(split, Speed);
            setTimeout(split, Speed*2);
            setTimeout(split, Speed*3);
        }
        else if (event.which == 3) {
            Feed = true;
            setTimeout(mass, Speed);
        }
    });

    document.getElementById("canvas").addEventListener("mouseup", function(event) {
        if (event.which == 3) {
            Feed = false;
        }
    });
    $('#canvas').bind('contextmenu', function(e) {
        e.preventDefault();
    });
}());


//create and add new instructions about the Script to Agar.io
var exInstructions = document.createElement('span');
var exInstructionsAlign = document.createElement('center');
exInstructions.innerHTML = '<br><u><b>Ultimate Agar.io Script controlls:</b></u><br>Press <b>Q</b> to feed macro<br>Press <b>A</b> to triplesplit<br>Press <b>D</b> to doublesplit<br>Press <b>S</b> to center your cell(s)<br><b>left click</b> to split<br><b>mouse click</b> to tricksplit<br><b>right click</b> to macro feed';
exInstructions.id = 'exInstructions';
exInstructionsAlign.appendChild(exInstructions);
instructions.appendChild(exInstructionsAlign);

$('#exInstructions').css({'color':'#777','cursor':'default'});
$('#exInstructionsAlign').css({'color':'#777','cursor':'default'});
$('#statsContinue').css({'width':'146px'});
$('#canvas').css({'cursor':'crosshair'})

//create a respawn button
var respawn = document.createElement('button');
respawn.type = 'submit';
respawn.innerHTML = 'Respawn';
respawn.addEventListener('click', function(){MC.setNick(document.getElementById('nick').value); return false;});
respawn.id = 'respawnButton';
$(document).ready(function(){
	$('#respawnButton').css({'display':'inline-block','padding':'6px 12px','marginBottom':'0','fontSize':'14px','fontWeight':'400','lineHeight':'1.42857143','textAlign':'center','whiteSpace':'mowrap','verticalAlign':'middle','cursor':'pointer','border':'1px solid transparent','borderRadius':'4px','color':'#fff','backgroundColor':'#428bca','borderColor':'#357ebd','position':'absolute','right':'25px','width':'150px','bottom':'15px'});
});

//add the respawn button to Agar.io
stats.appendChild(respawn);


//create a reload button
var reloadButton = document.createElement("button");
var nbstyle = reloadButton.style;
reloadButton.innerHTML = 'Reload';
reloadButton.id = 'reloadButton'
reloadButton.class = 'btn'
reloadButton.addEventListener('click', function(){
	location.reload()
});

$(document).ready(function(){
	$('#reloadButton').css({'display':'block','float':'right','height':'37px','width':'110px','fontWeight':'700','color':'#fff','backgroundColor':'#428bca','borderColor':'#357ebd','borderRadius':'5px'});
});

//add the reload button to Agario start page
document.getElementsByClassName("row")[0].appendChild(reloadButton);

//makes the continue button smaller
document.getElementsByTagName("button")[6].style.width = '160px';

//create and add a Reload button to the Agario Match Results (MR) page
var MRreloadButton = document.createElement('button');
MRreloadButton.id = 'MRreloadButton';
MRreloadButton.innerHTML = 'Reload';
stats.appendChild(MRreloadButton);
$('#MRreloadButton').css({'position':'absolute','left':'25px','right':'25px','bottom':'95px','width':'300px','color':'#fff','backgroundColor':'#428bca','borderColor':'#357ebd','display':'inline-block','padding':'6px 12px','marginBottom':'0','fontSize':'14px','fontWeight':'400','lineHeight':'1.42857143','textAlign':'center','whiteSpace':'nowrap','varticalAlign':'middle','cursor':'pointer','border':'1px solid transparent','borderRadius':'4px','overflow':'visible','boxSizing':'borderBox'})
$('#stats canvas').css({'bottom':'140px'});
$('#stats').css({'height':'310px'});
MRreloadButton.addEventListener('click', function(){
  location.reload()
})

/*
new agar.io style
syntax:
changeColor("font", "bgColor", "id", "class")
*/

$('hr').css({'width':'0px','height':'0px'});
changeColor("white", "rgba(0, 0, 0, 0.5)", "", "agario-panel");
changeColor("rgba(0, 0, 0, 1)", "white", "", "agario-wallet-container");
$('.text-muted')[1].style.color = 'white';
$('span').css({'color':'white'});

//'hide' advertisement
$('#advertisement').css({'position':'absolute','left':'-100%'})

// ==UserScript==
// @name        The ULTIMATE Agario Script options
// @namespace   http://greasespot.net
// @version     1.0
// @description options for Agar.io Players which use the Script 'The ULTIMATE Agario Script'
// @author      Arnie
// @reqire      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @run-at      document
// ==/UserScript==
var UASoptions = document.createElement('left');
UASoptions.name = 'UASoptions';
UASoptions.id = 'UASoptions';
var UASform = document.createElement('form');
UASform.name = 'selectTheme';
var darkLabel = document.createElement('label');
var extremeDarkLabel = document.createElement('label');
var defaultLabel = document.createElement('label');
var darkRadio = document.createElement('input');
var extremeDarkRadio = document.createElement('input');
var defaultRadio = document.createElement('input');
var darkSpan = document.createElement('span');
var extremeDarkSpan = document.createElement('span');
var defaultSpan = document.createElement('span');

darkLabel.name = 'darkLabel';
darkLabel.id = 'darkLabel';
extremeDarkLabel.name = 'extremeDarkLabel';
extremeDarkLabel.id = 'extremeDatkLabel';
defaultLabel.name = 'defaultLabel';
defaultLabel.id = 'defaultLabel';
darkRadio.type = 'radio';
darkRadio.setAttribute('name','theme');
darkRadio.setAttribute('onclick','handleTheme(this)')
darkRadio.setAttribute('checked', true)
darkRadio.value = 'dark';
extremeDarkRadio.type = 'radio';
extremeDarkRadio.setAttribute('name','theme');
extremeDarkRadio.setAttribute('onclick','handleTheme(this)')
extremeDarkRadio.value = 'extremeDark';
defaultRadio.type = 'radio';
defaultRadio.setAttribute('name','theme');
defaultRadio.setAttribute('onclick','handleTheme(this)')
defaultRadio.value = 'default';
darkSpan.innerHTML = 'dark theme';
extremeDarkSpan.innerHTML = 'extreme Dark theme';
defaultSpan.innerHTML = 'default theme';



//darkLabel.appendChild(darkRadio);
//darkLabel.appendChild(darkSpan);
//extremeDarkLabel.appendChild(extremeDarkRadio);
//extremeDarkLabel.appendChild(extremeDarkSpan);
//defaultLabel.appendChild(defaultRadio);
//defaultLabel.appendChild(defaultSpan);

UASform.appendChild(/*darkLabel*/darkRadio);
UASform.appendChild(darkSpan)
UASform.appendChild(document.createElement('br'));
UASform.appendChild(/*extremeDarkLabel*/extremeDarkRadio);
UASform.appendChild(extremeDarkSpan)
UASform.appendChild(document.createElement('br'));
UASform.appendChild(/*defaultLabel*/defaultRadio);
UASform.appendChild(defaultSpan)
UASform.appendChild(document.createElement('br'));
UASoptions.appendChild(UASform);
$('#options').append(UASoptions);
$('#UASoptions').css({'position':'relative','left':'-25%','top':'10px'});

var script = document.createElement('script');
script.innerHTML = 'function handleTheme(){\
    for (var i = 0; i < document.selectTheme.theme.length; i++) {\
        if(document.selectTheme.theme[i].checked==true){\
            switch(i){\
                case 0:\
                    theme(\'extremeDarkTheme\');\
                    break;\
                case 1:\
                    theme(\'darkTheme\');\
                    break;\
                case 2:\
                    theme(\'defaultTheme\');\
                    break;\
                default:\
                    console.error(Theme not switched)\
            }\
        }\
    }\
    //access with:\
//      eval(themes.extremeDarkTheme[index])\
//      eval(themes.darkTheme[index])\
//      eval(themes.defaultTheme[index])\
//  OR use this function:\
function theme(name) {\
    switch(name){\
        case "extremeDarkTheme":\
            for (var i = 0; i < themes.extremeDarkTheme.length; i++) {\
                eval(themes.extremeDarkTheme[i])\
            };\
            console.log(\'extremeDarkTheme succesfull activated!\');\
            break;\
        case "darkTheme":\
            for (var i = 0; i < themes.darkTheme.length; i++) {\
                eval(themes.darkTheme[i])\
            };\
            console.log(\'darkTheme succesfull activated!\');\
            break;\
        case "defaultTheme":\
            for (var i = 0; i < themes.defaultTheme.length; i++) {\
                eval(themes.defaultTheme[i])\
            };\
            console.log(\'defaultTheme succesfull activated!\');\
            break;\
        default:\
            console.error("invalid theme name");\
            return "theme "+ name + " does not exist"\
    }\
}\
/*\
If you wanted to add custom themes please use the same syntax as me to make sure that the function can read it.\
*/\
var themes = {\
\'extremeDarkTheme\':[\
    "$(\'.agario-panel\').css({\'backgroundColor\':\'black\',\'color\':\'white\'});",\
    "$(\'span\').css({\'color\':\'white\'});",\
    "$(\'.agario-wallet-label\').css({\'color\':\'white\'});",\
    "$(\'.agario-wallet-container\').css({\'backgroundColor\':\'black\'});",\
    "$(\'input\').css({\'color\':\'white\',\'backgroundColor\':\'black\'});",\
    "$(\'select\').css({\'backgroundColor\':\'black\',\'color\':\'white\'});",\
    "$(\'div\').css({\'borderRadius\':\'2px\'});",\
    "$(\'button\').css({\'color\':\'white\',\'backgroundColor\':\'black\',\'borderColor\':\'white\'});",\
    "$(\'#rightPanel\').css({\'position\':\'absolute\',\'left\':\'-100%\'});",\
    "document.getElementById(\'darkTheme\').checked = true;",\
    "document.getElementById(\'noColors\').checked = true;",\
    "document.getElementById(\'noSkins\').checked = true;"\
],\
\'darkTheme\':[\
    "$(\'.agario-panel\').css({\'backgroundColor\':\'rgba(0, 0, 0, 0.5)\',\'color\':\'white\'});",\
    "$(\'span\').css({\'color\':\'white\'});",\
    "$(\'.agario-wallet-container\').css({\'color\':\'black\',\'backgroundColor\':\'white\'});",\
    "$(\'.agario-wallet-label\').css({\'color\':\'black\'});",\
    "$(\'input\').css({\'backgroundColor\':\'white\',\'color\':\'black\'});",\
    "$(\'select\').css({\'color\':\'black\',\'backgroundColor\':\'white\'});",\
    "$(\'div\').css({\'borderRadius\':\'10px\'});",\
    "$(\'button\').css({\'color\':\'\',\'backgroundColor\':\'\',\'borderColor\':\'transparent\'});",\
    "$(\'#rightPanel\').css({\'position\':\'absolute\',\'left\':\'-100%\'});",\
    "document.getElementById(\'darkTheme\').checked = false;",\
    "document.getElementById(\'noColors\').checked = false;",\
    "document.getElementById(\'noSkins\').checked = false;",\
],\
\'defaultTheme\':[\
    "$(\'.agario-panel\').css({\'backgroundColor\':\'white\',\'color\':\'black\'});",\
    "$(\'span\').css({\'color\':\'#777\'});",\
    "$(\'.agario-wallet-container\').css({\'color\':\'black\',\'backgroundColor\':\'white\'});",\
    "$(\'input\').css({\'color\':\'black\',\'backgroundColor\':\'white\'});",\
    "$(\'div\').css({\'borderRadius\':\'10px\'});",\
    "$(\'select\').css({\'backgroundColor\':\'white\',\'color\':\'black\'});",\
    "$(\'button\').css({\'color\':\'\',\'backgroundColor\':\'\',\'borderColor\':\'\'});",\
    "document.getElementById(\'darkTheme\').checked = false;",\
    "document.getElementById(\'noColors\').checked = false;",\
    "document.getElementById(\'noSkins\').checked = false;"\
]\
}\
}'
$('#options').append(script)
/*
Script by Ali Ahfad Mehdi and Arnie

CREDITS TO: JACK BURCH, TOM BURRIS
*/
