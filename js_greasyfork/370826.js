// ==UserScript==
// @name           Dragoyle Finder 2.0
// @author         RealisticError
// @namespace      https://greasyfork.org/en/users/200321-realisticerror
// @version        2.15
// @description    Finds those damn dragoyles for you.
// @grant          GM_getValue
// @grant          GM_setValue
// @include        http://www.neopets.com/medieval/turmaculus.phtml*
// @include        http://www.neopets.com/medieval/cheeseroller.phtml*
// @include        http://www.neopets.com/medieval/earthfaerie.phtml*
// @include        http://www.neopets.com/games/draw_poker/round_table_poker.phtml*
// @include        http://www.neopets.com/games/game.phtml?game_id=903*
// @include        http://www.neopets.com/objects.phtml?type=shop&obj_type=57*
// @include        http://www.neopets.com/objects.phtml?type=shop&obj_type=56*
// @include        http://www.neopets.com/medieval/shapeshifter_index.phtml*
// @include        http://www.neopets.com/medieval/kissthemortog.phtml*
// @include        http://www.neopets.com/medieval/turdleracing.phtml*
// @include        http://www.neopets.com/medieval/grumpyking.phtml*
// @include        http://www.neopets.com/medieval/doubleornothing.phtml*
// @include        http://www.neopets.com/objects.phtml?type=shop&obj_type=73*
// @include        http://www.neopets.com/games/game.phtml?game_id=197*
// @include        http://www.neopets.com/medieval/pickyourown_index.phtml*
// @include        http://www.neopets.com/games/game.phtml?game_id=386*
// @include        http://www.neopets.com/games/game.phtml?game_id=226*
// @include        http://www.neopets.com/medieval/potatocounter.phtml*
// @include        http://www.neopets.com/medieval/guessmarrow.phtml*
// @include        http://www.neopets.com/medieval/rubbishdump.phtml*
// @include        http://www.neopets.com/medieval/index.phtml*

// @downloadURL https://update.greasyfork.org/scripts/370826/Dragoyle%20Finder%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/370826/Dragoyle%20Finder%2020.meta.js
// ==/UserScript==

//To change your time values: Math.floor((Math.random() * ((MAXTime - MINTime) + 1)) + MINTime);
var x = Math.floor((Math.random() * (2500 - 1700) + 1) + 1700); //1000 = 1 second
function timeout() {	//timeout function

    var nextlocation = "";
    var str = "";
    //Gets the div around the dragoyle image.
   var dragoyle = document.getElementById("nchunt2014_postcard");
   var dragoyleFound = false;

    //Checks if the image is your dragoyle
    //*** Change the word plushie to the colour of your dragoyle to find the right one ***
   //dragoyle colours are: Eventide, Faerie, Fire, Ghost, Green, Mutant, Pink, Plushie, Purple, Rainbow, Yellow.
    var dragoyleColour = GM_getValue("Dragoyle");

    switch(window.location.href) {
        case "http://www.neopets.com/medieval/index.phtml":
            dragoyleFound = true;
            if(document.getElementsByClassName("release1").length !== 0) {
                $("#nh-masthead").children()[0].click()
            }
            if(document.getElementById("nh-mh-copy").length !== 0) {
                str = document.getElementById("nh-mh-copy").innerHTML;
                GM_setValue("Dragoyle", str.substring(
                str.lastIndexOf("<b>") + 3,
                str.lastIndexOf(" Dragoyle</b>")
                ));
                console.log(GM_getValue("Dragoyle"));

                if(document.getElementById("nh-mh-copy").innerHTML.indexOf("<b>") !== -1) {
               nextlocation = "http://www.neopets.com/medieval/turmaculus.phtml"
               dragoyleFound = false;
                }
            }
            break;
        case "http://www.neopets.com/medieval/turmaculus.phtml":
            nextlocation = "http://www.neopets.com/medieval/cheeseroller.phtml"
            break;
        case "http://www.neopets.com/medieval/cheeseroller.phtml":
            nextlocation = "http://www.neopets.com/medieval/earthfaerie.phtml"
            break;
        case "http://www.neopets.com/medieval/earthfaerie.phtml":
            nextlocation = "http://www.neopets.com/games/draw_poker/round_table_poker.phtml"
            break;
        case "http://www.neopets.com/games/draw_poker/round_table_poker.phtml":
            nextlocation = "http://www.neopets.com/games/game.phtml?game_id=903"
            break;
        case "http://www.neopets.com/games/game.phtml?game_id=903":
            nextlocation = "http://www.neopets.com/objects.phtml?type=shop&obj_type=57"
            break;
        case "http://www.neopets.com/objects.phtml?type=shop&obj_type=57":
            nextlocation = "http://www.neopets.com/objects.phtml?type=shop&obj_type=56"
            break;
        case "http://www.neopets.com/objects.phtml?type=shop&obj_type=56":
            nextlocation = "http://www.neopets.com/medieval/shapeshifter_index.phtml"
            break;
        case "http://www.neopets.com/medieval/shapeshifter_index.phtml":
            nextlocation = "http://www.neopets.com/medieval/kissthemortog.phtml"
            break;
        case "http://www.neopets.com/medieval/kissthemortog.phtml":
            nextlocation = "http://www.neopets.com/medieval/turdleracing.phtml"
            break;
        case "http://www.neopets.com/medieval/turdleracing.phtml":
            nextlocation = "http://www.neopets.com/medieval/grumpyking.phtml"
            break;
        case "http://www.neopets.com/medieval/grumpyking.phtml":
            nextlocation = "http://www.neopets.com/medieval/doubleornothing.phtml"
            break;
        case "http://www.neopets.com/medieval/doubleornothing.phtml":
            nextlocation = "http://www.neopets.com/objects.phtml?type=shop&obj_type=73"
            break;
        case "http://www.neopets.com/objects.phtml?type=shop&obj_type=73":
            nextlocation = "http://www.neopets.com/games/game.phtml?game_id=197"
            break;
        case "http://www.neopets.com/games/game.phtml?game_id=197":
            nextlocation = "http://www.neopets.com/medieval/pickyourown_index.phtml"
            break;
        case "http://www.neopets.com/medieval/pickyourown_index.phtml":
            nextlocation = "http://www.neopets.com/games/game.phtml?game_id=386"
            break;
        case "http://www.neopets.com/games/game.phtml?game_id=386":
            nextlocation = "http://www.neopets.com/games/game.phtml?game_id=226"
            break;
        case "http://www.neopets.com/games/game.phtml?game_id=226":
            nextlocation = "http://www.neopets.com/medieval/potatocounter.phtml"
            break;
        case "http://www.neopets.com/medieval/potatocounter.phtml":
            nextlocation = "http://www.neopets.com/medieval/guessmarrow.phtml"
            break;
        case "http://www.neopets.com/medieval/guessmarrow.phtml":
            nextlocation = "http://www.neopets.com/medieval/rubbishdump.phtml"
            break;
        case "http://www.neopets.com/medieval/rubbishdump.phtml":
            nextlocation = "http://www.neopets.com/medieval/turmaculus.phtml"
            break;
}


   
    //Checks if the dragoyle image exists on the page.
    if(dragoyle != null) {
        //Gets the image itself
       var dragoyleImage = dragoyle.children;

       if(dragoyleImage[0].innerHTML.indexOf(dragoyleColour) !== -1) {
           dragoyleFound = true;
           alert("You've found your dragoyle!");
       }
    }
    console.log(dragoyleFound);
    //Refresh if it can't be found
    if(!dragoyleFound) {

        window.location.href =nextlocation;

    }
}
window.setTimeout(timeout, x)