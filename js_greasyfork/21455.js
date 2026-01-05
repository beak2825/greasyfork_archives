// ==UserScript==
// @name             The best Agario Script
// @name:en          The best Agario Script
// @name:de          Das beste Agario Skript
// @namespace        http://tampermonkey.net/
// @version          1.15
// @description      Easily configurable keys in code. Credits to Jack Burch, Tom Burris AND Ali Ahfad Mehdi
// @description:de   Einfache Tastenkonfiguration im Quelltext.
// @description:en   Easily configurable keys in the code.
// @author           Arnie
// @match            http://agar.io/*
// @match            https://agar.io/*
// @grant            none
// @run-at           document-end
// @downloadURL https://update.greasyfork.org/scripts/21455/The%20best%20Agario%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/21455/The%20best%20Agario%20Script.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Speed = 10; //default = 25
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


//add new instructions about the Script to Agar.io
var exInstructions = document.createElement('span');
var exInstructionsAlign = document.createElement('center');
exInstructions.innerHTML = '<br><u><b>Ultimate Agar.io Script controlls:</b></u><br>Press <b>Q</b> to feed macro<br>Press <b>A</b> to triplesplit<br>Press <b>D</b> to doublesplit<br>Press <b>S</b> to center your cell(s)<br><b>left click</b> to split<br><b>mouse click</b> to tricksplit<br><b>right click</b> to macro feed';
exInstructions.id = 'exInstructions';
exInstructionsAlign.appendChild(exInstructions);
instructions.appendChild(exInstructionsAlign);

$('#exInstructions').css({'color':'#777'});
$('#statsContinue').css({'width':'146px'});


//create a respawn button
var respawn = document.createElement('button');
respawn.type = 'submit';
respawn.innerHTML = 'Respawn';
respawn.addEventListener('click', function(){MC.setNick(document.getElementById('nick').value); return false;});
respawn.id = 'respawnButton';
$(document).ready(function(){
	$('#respawnButton').css({'display':'inline-block','padding':'6px 12px','marginBottom':'0','fontSize':'14px','fontWeight':'400','lineHeight':'1.42857143','textAlign':'center','whiteSpace':'mowrap','verticalAlign':'middle','cusor':'pointer','border':'1px solid transparent','borderRadius':'4px','color':'#fff','backgroundColor':'#428bca','borderColor':'#357ebd','position':'absolute','right':'25px','width':'150px','bottom':'15px'});
});

//add the respawn button to Agar.io
stats.appendChild(respawn);


//create a reload button
var reloadButton = document.createElement("button");
var nbstyle = reloadButton.style;
reloadButton.innerHTML = 'Reload';
reloadButton.id = 'reloadButton'
reloadButton.addEventListener('click', function(){
	location.reload()
});

$(document).ready(function(){
	$('#reloadButton').css({'display':'block','float':'right','height':'37px','width':'110px','fontWeight':'700','color':'#fff','backgroundColor':'#354c8c','borderColor':'#354c8c','borderRadius':'5px'});
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
$('#MRreloadButton').css({'position':'absolute','left':'25px','right':'25px','bottom':'95px','width':'300px','color':'#fff','backgroundColor':'#428bca','borderColor':'#357ebd','display':'inline-block','padding':'6px 12px','marginBottom':'0','fontSize':'14px','fontWeight':'400','lineHeight':'1.42857143','textAlign':'center','whiteSpace':'nowrap','varticalAlign':'middle','cusor':'pointer','border':'1px solid transparent','borderRadius':'4px','overflow':'visible','boxSizing':'borderBox'})
$('#stats canvas').css({'bottom':'140px'});
$('#stats').css({'height':'310px'});
MRreloadButton.addEventListener('click', function(){
  location.reload()
})

/*
Script by Ali Ahfad Mehdi and Arnie

CREDITS TO: JACK BURCH, TOM BURRIS
*/
