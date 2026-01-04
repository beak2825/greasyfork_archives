// ==UserScript==
// @name         Neopets: Food Club Auto Better
// @version      0.1
// @description  Automatically adds Garet's bets with a click of a button!
// @author       AyBeCee (clraik)
// @match        http://www.neopets.com/pirates/foodclub.phtml?type=bet
// @match        http://www.neopets.com/~boochi_target
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @namespace https://greasyfork.org/users/145271
// @downloadURL https://update.greasyfork.org/scripts/31909/Neopets%3A%20Food%20Club%20Auto%20Better.user.js
// @updateURL https://update.greasyfork.org/scripts/31909/Neopets%3A%20Food%20Club%20Auto%20Better.meta.js
// ==/UserScript==

if(document.URL.indexOf("~boochi_target") != -1) {
	var bets1=document.getElementsByTagName("center")[2].getElementsByTagName("center")[0].getElementsByTagName("center")[0].getElementsByTagName("tr")[2].getElementsByTagName("td")[1].innerHTML;
	GM_setValue('garetsBets1',bets1);
	var bets2=document.getElementsByTagName("center")[2].getElementsByTagName("center")[0].getElementsByTagName("center")[0].getElementsByTagName("tr")[3].getElementsByTagName("td")[1].innerHTML;
	GM_setValue('garetsBets2',bets2);
	var bets3=document.getElementsByTagName("center")[2].getElementsByTagName("center")[0].getElementsByTagName("center")[0].getElementsByTagName("tr")[4].getElementsByTagName("td")[1].innerHTML;
	GM_setValue('garetsBets3',bets3);
	var bets4=document.getElementsByTagName("center")[2].getElementsByTagName("center")[0].getElementsByTagName("center")[0].getElementsByTagName("tr")[5].getElementsByTagName("td")[1].innerHTML;
	GM_setValue('garetsBets4',bets4);
	var bets5=document.getElementsByTagName("center")[2].getElementsByTagName("center")[0].getElementsByTagName("center")[0].getElementsByTagName("tr")[6].getElementsByTagName("td")[1].innerHTML;
	GM_setValue('garetsBets5',bets5);
	var bets6=document.getElementsByTagName("center")[2].getElementsByTagName("center")[0].getElementsByTagName("center")[0].getElementsByTagName("tr")[7].getElementsByTagName("td")[1].innerHTML;
	GM_setValue('garetsBets6',bets6);
	var bets7=document.getElementsByTagName("center")[2].getElementsByTagName("center")[0].getElementsByTagName("center")[0].getElementsByTagName("tr")[8].getElementsByTagName("td")[1].innerHTML;
	GM_setValue('garetsBets7',bets7);
	var bets8=document.getElementsByTagName("center")[2].getElementsByTagName("center")[0].getElementsByTagName("center")[0].getElementsByTagName("tr")[9].getElementsByTagName("td")[1].innerHTML;
	GM_setValue('garetsBets8',bets8);
	var bets9=document.getElementsByTagName("center")[2].getElementsByTagName("center")[0].getElementsByTagName("center")[0].getElementsByTagName("tr")[10].getElementsByTagName("td")[1].innerHTML;
	GM_setValue('garetsBets9',bets9);
	var bets10=document.getElementsByTagName("center")[2].getElementsByTagName("center")[0].getElementsByTagName("center")[0].getElementsByTagName("tr")[11].getElementsByTagName("td")[1].innerHTML;
	GM_setValue('garetsBets10',bets10);
}

if(document.URL.indexOf("pirates/foodclub.phtml?type=bet") != -1) {
	var qu=document.getElementsByClassName("content")[0].getElementsByTagName("p")[3].getElementsByTagName("b")[0].innerHTML;
	var max=document.getElementsByClassName("content")[0].getElementsByTagName("center")[3].getElementsByTagName("form")[0].getElementsByTagName("table")[1].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[2].getElementsByTagName("td")[0].getElementsByTagName("input")[0];
	max.value = qu;

    var string1 = GM_getValue('garetsBets1',0);
    var string2 = GM_getValue('garetsBets2',0);
    var string3 = GM_getValue('garetsBets3',0);
    var string4 = GM_getValue('garetsBets4',0);
    var string5 = GM_getValue('garetsBets5',0);
    var string6 = GM_getValue('garetsBets6',0);
    var string7 = GM_getValue('garetsBets7',0);
    var string8 = GM_getValue('garetsBets8',0);
    var string9 = GM_getValue('garetsBets9',0);
    var string10 = GM_getValue('garetsBets10',0);

    document.getElementsByClassName("content")[0].getElementsByTagName("p")[4].innerHTML = "<div id='betbuttons'><font color='red'>Please visit <a href='http://www.neopets.com/~boochi_target'>/~boochi_target</a> then refresh this page (in that order) to update the data before inputting your bets. If you don't do this, you would be entering outdated bets!</font><br><br><button id='addbets1'>Add 1st bets</button><button id='addbets2'>Add 2nd bets</button><button id='addbets3'>Add 3rd bets</button><button id='addbets4'>Add 4th bets</button><button id='addbets5'>Add 5th bets</button><br><button id='addbets6'>Add 6th bets</button><button id='addbets7'>Add 7th bets</button><button id='addbets8'>Add 8th bets</button><button id='addbets9'>Add 9th bets</button><button id='addbets10'>Add 10th bets</button></div>";
    $("#betbuttons").css({"margin":"auto","text-align":"center"});
    $("#betbuttons button").css({"margin-bottom":"5px","margin-left":"5px","width":"105px"});

    var checkShipwreck = document.getElementsByClassName("content")[0].getElementsByTagName("center")[3].getElementsByTagName("form")[0].getElementsByTagName("table")[0].getElementsByTagName("tr")[2].getElementsByTagName("td")[0].getElementsByTagName("input")[0];
    var checkLagoon = document.getElementsByClassName("content")[0].getElementsByTagName("center")[3].getElementsByTagName("form")[0].getElementsByTagName("table")[0].getElementsByTagName("tr")[3].getElementsByTagName("td")[0].getElementsByTagName("input")[0];
    var checkTreasureIsland = document.getElementsByClassName("content")[0].getElementsByTagName("center")[3].getElementsByTagName("form")[0].getElementsByTagName("table")[0].getElementsByTagName("tr")[4].getElementsByTagName("td")[0].getElementsByTagName("input")[0];
    var checkHiddenCove = document.getElementsByClassName("content")[0].getElementsByTagName("center")[3].getElementsByTagName("form")[0].getElementsByTagName("table")[0].getElementsByTagName("tr")[5].getElementsByTagName("td")[0].getElementsByTagName("input")[0];
    var checkHarpoonHarrys = document.getElementsByClassName("content")[0].getElementsByTagName("center")[3].getElementsByTagName("form")[0].getElementsByTagName("table")[0].getElementsByTagName("tr")[6].getElementsByTagName("td")[0].getElementsByTagName("input")[0];

    document.getElementById('addbets1').onclick = function() {
        checkShipwreck.checked = false;
        checkLagoon.checked = false;
        checkTreasureIsland.checked = false;
        checkHiddenCove.checked = false;
        checkHarpoonHarrys.checked = false;
        $("select option:contains(Who would you)").prop("selected","selected");

        if (string1.indexOf("Scurvy Dan the Blade") != -1){$("select option:contains(Scurvy Dan the Blade)").prop("selected","selected");}
        if (string1.indexOf("Young Sproggie") != -1){$("select option:contains(Young Sproggie)").prop("selected","selected");}
        if (string1.indexOf("Orvinn the First Mate") != -1){$("select option:contains(Orvinn the First Mate)").prop("selected","selected");}
        if (string1.indexOf("Lucky McKyriggan") != -1){$("select option:contains(Lucky McKyriggan)").prop("selected","selected");}
        if (string1.indexOf("Sir Edmund Ogletree") != -1){$("select option:contains(Sir Edmund Ogletree)").prop("selected","selected");}
        if (string1.indexOf("Peg Leg Percival") != -1){$("select option:contains(Peg Leg Percival)").prop("selected","selected");}
        if (string1.indexOf("Bonnie Pip Culliford") != -1){$("select option:contains(Bonnie Pip Culliford)").prop("selected","selected");}
        if (string1.indexOf("Puffo the Waister") != -1){$("select option:contains(Puffo the Waister)").prop("selected","selected");}
        if (string1.indexOf("Stuff-A-Roo") != -1){$("select option:contains(Stuff-A-Roo)").prop("selected","selected");}
        if (string1.indexOf("Squire Venable") != -1){$("select option:contains(Squire Venable)").prop("selected","selected");}
        if (string1.indexOf("Captain Crossblades") != -1){$("select option:contains(Captain Crossblades)").prop("selected","selected");}
        if (string1.indexOf("Ol' Stripey") != -1){$("select option:contains(Ol' Stripey)").prop("selected","selected");}
        if (string1.indexOf("Ned the Skipper") != -1){$("select option:contains(Ned the Skipper)").prop("selected","selected");}
        if (string1.indexOf("Fairfax the Deckhand") != -1){$("select option:contains(Fairfax the Deckhand)").prop("selected","selected");}
        if (string1.indexOf("Gooblah the Grarrl") != -1){$("select option:contains(Gooblah the Grarrl)").prop("selected","selected");}
        if (string1.indexOf("Franchisco Corvallio") != -1){$("select option:contains(Franchisco Corvallio)").prop("selected","selected");}
        if (string1.indexOf("Federismo Corvallio") != -1){$("select option:contains(Federismo Corvallio)").prop("selected","selected");}
        if (string1.indexOf("Admiral Blackbeard") != -1){$("select option:contains(Admiral Blackbeard)").prop("selected","selected");}
        if (string1.indexOf("Buck Cutlass") != -1){$("select option:contains(Buck Cutlass)").prop("selected","selected");}
        if (string1.indexOf("The Tailhook Kid") != -1){ $("select option:contains(The Tailhook Kid)").prop("selected","selected");}

        if (string1.indexOf("Shipwreck") != -1){
            checkShipwreck.checked = true;
        } else {
            $("select[name=winner1] option:contains(Who would you)").prop("selected","selected");
        }
        if (string1.indexOf("Lagoon") != -1){
            checkLagoon.checked = true;
        } else {
            $("select[name=winner2] option:contains(Who would you)").prop("selected","selected");
        }
        if (string1.indexOf("Treasure Island") != -1){
            checkTreasureIsland.checked = true;
        } else {
            $("select[name=winner3] option:contains(Who would you)").prop("selected","selected");
        }
        if (string1.indexOf("Hidden Cove") != -1){
            checkHiddenCove.checked = true;
        } else {
            $("select[name=winner4] option:contains(Who would you)").prop("selected","selected");
        }
        if (string1.indexOf("Harpoon Harry's") != -1){
            checkHarpoonHarrys.checked = true;
        } else {
            $("select[name=winner5] option:contains(Who would you)").prop("selected","selected");
        }
    };

    document.getElementById('addbets2').onclick = function() {
        checkShipwreck.checked = false;
        checkLagoon.checked = false;
        checkTreasureIsland.checked = false;
        checkHiddenCove.checked = false;
        checkHarpoonHarrys.checked = false;
        $("select option:contains(Who would you)").prop("selected","selected");

        if (string2.indexOf("Scurvy Dan the Blade") != -1){$("select option:contains(Scurvy Dan the Blade)").prop("selected","selected");}
        if (string2.indexOf("Young Sproggie") != -1){$("select option:contains(Young Sproggie)").prop("selected","selected");}
        if (string2.indexOf("Orvinn the First Mate") != -1){$("select option:contains(Orvinn the First Mate)").prop("selected","selected");}
        if (string2.indexOf("Lucky McKyriggan") != -1){$("select option:contains(Lucky McKyriggan)").prop("selected","selected");}
        if (string2.indexOf("Sir Edmund Ogletree") != -1){$("select option:contains(Sir Edmund Ogletree)").prop("selected","selected");}
        if (string2.indexOf("Peg Leg Percival") != -1){$("select option:contains(Peg Leg Percival)").prop("selected","selected");}
        if (string2.indexOf("Bonnie Pip Culliford") != -1){$("select option:contains(Bonnie Pip Culliford)").prop("selected","selected");}
        if (string2.indexOf("Puffo the Waister") != -1){$("select option:contains(Puffo the Waister)").prop("selected","selected");}
        if (string2.indexOf("Stuff-A-Roo") != -1){$("select option:contains(Stuff-A-Roo)").prop("selected","selected");}
        if (string2.indexOf("Squire Venable") != -1){$("select option:contains(Squire Venable)").prop("selected","selected");}
        if (string2.indexOf("Captain Crossblades") != -1){$("select option:contains(Captain Crossblades)").prop("selected","selected");}
        if (string2.indexOf("Ol' Stripey") != -1){$("select option:contains(Ol' Stripey)").prop("selected","selected");}
        if (string2.indexOf("Ned the Skipper") != -1){$("select option:contains(Ned the Skipper)").prop("selected","selected");}
        if (string2.indexOf("Fairfax the Deckhand") != -1){$("select option:contains(Fairfax the Deckhand)").prop("selected","selected");}
        if (string2.indexOf("Gooblah the Grarrl") != -1){$("select option:contains(Gooblah the Grarrl)").prop("selected","selected");}
        if (string2.indexOf("Franchisco Corvallio") != -1){$("select option:contains(Franchisco Corvallio)").prop("selected","selected");}
        if (string2.indexOf("Federismo Corvallio") != -1){$("select option:contains(Federismo Corvallio)").prop("selected","selected");}
        if (string2.indexOf("Admiral Blackbeard") != -1){$("select option:contains(Admiral Blackbeard)").prop("selected","selected");}
        if (string2.indexOf("Buck Cutlass") != -1){$("select option:contains(Buck Cutlass)").prop("selected","selected");}
        if (string2.indexOf("The Tailhook Kid") != -1){ $("select option:contains(The Tailhook Kid)").prop("selected","selected");}

        if (string2.indexOf("Shipwreck") != -1){
            checkShipwreck.checked = true;
        } else {
            $("select[name=winner1] option:contains(Who would you)").prop("selected","selected");
        }
        if (string2.indexOf("Lagoon") != -1){
            checkLagoon.checked = true;
        } else {
            $("select[name=winner2] option:contains(Who would you)").prop("selected","selected");
        }
        if (string2.indexOf("Treasure Island") != -1){
            checkTreasureIsland.checked = true;
        } else {
            $("select[name=winner3] option:contains(Who would you)").prop("selected","selected");
        }
        if (string2.indexOf("Hidden Cove") != -1){
            checkHiddenCove.checked = true;
        } else {
            $("select[name=winner4] option:contains(Who would you)").prop("selected","selected");
        }
        if (string2.indexOf("Harpoon Harry's") != -1){
            checkHarpoonHarrys.checked = true;
        } else {
            $("select[name=winner5] option:contains(Who would you)").prop("selected","selected");
        }
    };

    document.getElementById('addbets3').onclick = function() {
        checkShipwreck.checked = false;
        checkLagoon.checked = false;
        checkTreasureIsland.checked = false;
        checkHiddenCove.checked = false;
        checkHarpoonHarrys.checked = false;
        $("select option:contains(Who would you)").prop("selected","selected");

        if (string3.indexOf("Scurvy Dan the Blade") != -1){$("select option:contains(Scurvy Dan the Blade)").prop("selected","selected");}
        if (string3.indexOf("Young Sproggie") != -1){$("select option:contains(Young Sproggie)").prop("selected","selected");}
        if (string3.indexOf("Orvinn the First Mate") != -1){$("select option:contains(Orvinn the First Mate)").prop("selected","selected");}
        if (string3.indexOf("Lucky McKyriggan") != -1){$("select option:contains(Lucky McKyriggan)").prop("selected","selected");}
        if (string3.indexOf("Sir Edmund Ogletree") != -1){$("select option:contains(Sir Edmund Ogletree)").prop("selected","selected");}
        if (string3.indexOf("Peg Leg Percival") != -1){$("select option:contains(Peg Leg Percival)").prop("selected","selected");}
        if (string3.indexOf("Bonnie Pip Culliford") != -1){$("select option:contains(Bonnie Pip Culliford)").prop("selected","selected");}
        if (string3.indexOf("Puffo the Waister") != -1){$("select option:contains(Puffo the Waister)").prop("selected","selected");}
        if (string3.indexOf("Stuff-A-Roo") != -1){$("select option:contains(Stuff-A-Roo)").prop("selected","selected");}
        if (string3.indexOf("Squire Venable") != -1){$("select option:contains(Squire Venable)").prop("selected","selected");}
        if (string3.indexOf("Captain Crossblades") != -1){$("select option:contains(Captain Crossblades)").prop("selected","selected");}
        if (string3.indexOf("Ol' Stripey") != -1){$("select option:contains(Ol' Stripey)").prop("selected","selected");}
        if (string3.indexOf("Ned the Skipper") != -1){$("select option:contains(Ned the Skipper)").prop("selected","selected");}
        if (string3.indexOf("Fairfax the Deckhand") != -1){$("select option:contains(Fairfax the Deckhand)").prop("selected","selected");}
        if (string3.indexOf("Gooblah the Grarrl") != -1){$("select option:contains(Gooblah the Grarrl)").prop("selected","selected");}
        if (string3.indexOf("Franchisco Corvallio") != -1){$("select option:contains(Franchisco Corvallio)").prop("selected","selected");}
        if (string3.indexOf("Federismo Corvallio") != -1){$("select option:contains(Federismo Corvallio)").prop("selected","selected");}
        if (string3.indexOf("Admiral Blackbeard") != -1){$("select option:contains(Admiral Blackbeard)").prop("selected","selected");}
        if (string3.indexOf("Buck Cutlass") != -1){$("select option:contains(Buck Cutlass)").prop("selected","selected");}
        if (string3.indexOf("The Tailhook Kid") != -1){ $("select option:contains(The Tailhook Kid)").prop("selected","selected");}

        if (string3.indexOf("Shipwreck") != -1){
            checkShipwreck.checked = true;
        } else {
            $("select[name=winner1] option:contains(Who would you)").prop("selected","selected");
        }
        if (string3.indexOf("Lagoon") != -1){
            checkLagoon.checked = true;
        } else {
            $("select[name=winner2] option:contains(Who would you)").prop("selected","selected");
        }
        if (string3.indexOf("Treasure Island") != -1){
            checkTreasureIsland.checked = true;
        } else {
            $("select[name=winner3] option:contains(Who would you)").prop("selected","selected");
        }
        if (string3.indexOf("Hidden Cove") != -1){
            checkHiddenCove.checked = true;
        } else {
            $("select[name=winner4] option:contains(Who would you)").prop("selected","selected");
        }
        if (string3.indexOf("Harpoon Harry's") != -1){
            checkHarpoonHarrys.checked = true;
        } else {
            $("select[name=winner5] option:contains(Who would you)").prop("selected","selected");
        }
    };

    document.getElementById('addbets4').onclick = function() {
        checkShipwreck.checked = false;
        checkLagoon.checked = false;
        checkTreasureIsland.checked = false;
        checkHiddenCove.checked = false;
        checkHarpoonHarrys.checked = false;
        $("select option:contains(Who would you)").prop("selected","selected");

        if (string4.indexOf("Scurvy Dan the Blade") != -1){$("select option:contains(Scurvy Dan the Blade)").prop("selected","selected");}
        if (string4.indexOf("Young Sproggie") != -1){$("select option:contains(Young Sproggie)").prop("selected","selected");}
        if (string4.indexOf("Orvinn the First Mate") != -1){$("select option:contains(Orvinn the First Mate)").prop("selected","selected");}
        if (string4.indexOf("Lucky McKyriggan") != -1){$("select option:contains(Lucky McKyriggan)").prop("selected","selected");}
        if (string4.indexOf("Sir Edmund Ogletree") != -1){$("select option:contains(Sir Edmund Ogletree)").prop("selected","selected");}
        if (string4.indexOf("Peg Leg Percival") != -1){$("select option:contains(Peg Leg Percival)").prop("selected","selected");}
        if (string4.indexOf("Bonnie Pip Culliford") != -1){$("select option:contains(Bonnie Pip Culliford)").prop("selected","selected");}
        if (string4.indexOf("Puffo the Waister") != -1){$("select option:contains(Puffo the Waister)").prop("selected","selected");}
        if (string4.indexOf("Stuff-A-Roo") != -1){$("select option:contains(Stuff-A-Roo)").prop("selected","selected");}
        if (string4.indexOf("Squire Venable") != -1){$("select option:contains(Squire Venable)").prop("selected","selected");}
        if (string4.indexOf("Captain Crossblades") != -1){$("select option:contains(Captain Crossblades)").prop("selected","selected");}
        if (string4.indexOf("Ol' Stripey") != -1){$("select option:contains(Ol' Stripey)").prop("selected","selected");}
        if (string4.indexOf("Ned the Skipper") != -1){$("select option:contains(Ned the Skipper)").prop("selected","selected");}
        if (string4.indexOf("Fairfax the Deckhand") != -1){$("select option:contains(Fairfax the Deckhand)").prop("selected","selected");}
        if (string4.indexOf("Gooblah the Grarrl") != -1){$("select option:contains(Gooblah the Grarrl)").prop("selected","selected");}
        if (string4.indexOf("Franchisco Corvallio") != -1){$("select option:contains(Franchisco Corvallio)").prop("selected","selected");}
        if (string4.indexOf("Federismo Corvallio") != -1){$("select option:contains(Federismo Corvallio)").prop("selected","selected");}
        if (string4.indexOf("Admiral Blackbeard") != -1){$("select option:contains(Admiral Blackbeard)").prop("selected","selected");}
        if (string4.indexOf("Buck Cutlass") != -1){$("select option:contains(Buck Cutlass)").prop("selected","selected");}
        if (string4.indexOf("The Tailhook Kid") != -1){ $("select option:contains(The Tailhook Kid)").prop("selected","selected");}

        if (string4.indexOf("Shipwreck") != -1){
            checkShipwreck.checked = true;
        } else {
            $("select[name=winner1] option:contains(Who would you)").prop("selected","selected");
        }
        if (string4.indexOf("Lagoon") != -1){
            checkLagoon.checked = true;
        } else {
            $("select[name=winner2] option:contains(Who would you)").prop("selected","selected");
        }
        if (string4.indexOf("Treasure Island") != -1){
            checkTreasureIsland.checked = true;
        } else {
            $("select[name=winner3] option:contains(Who would you)").prop("selected","selected");
        }
        if (string4.indexOf("Hidden Cove") != -1){
            checkHiddenCove.checked = true;
        } else {
            $("select[name=winner4] option:contains(Who would you)").prop("selected","selected");
        }
        if (string4.indexOf("Harpoon Harry's") != -1){
            checkHarpoonHarrys.checked = true;
        } else {
            $("select[name=winner5] option:contains(Who would you)").prop("selected","selected");
        }
    };

    document.getElementById('addbets5').onclick = function() {
        checkShipwreck.checked = false;
        checkLagoon.checked = false;
        checkTreasureIsland.checked = false;
        checkHiddenCove.checked = false;
        checkHarpoonHarrys.checked = false;
        $("select option:contains(Who would you)").prop("selected","selected");

        if (string5.indexOf("Scurvy Dan the Blade") != -1){$("select option:contains(Scurvy Dan the Blade)").prop("selected","selected");}
        if (string5.indexOf("Young Sproggie") != -1){$("select option:contains(Young Sproggie)").prop("selected","selected");}
        if (string5.indexOf("Orvinn the First Mate") != -1){$("select option:contains(Orvinn the First Mate)").prop("selected","selected");}
        if (string5.indexOf("Lucky McKyriggan") != -1){$("select option:contains(Lucky McKyriggan)").prop("selected","selected");}
        if (string5.indexOf("Sir Edmund Ogletree") != -1){$("select option:contains(Sir Edmund Ogletree)").prop("selected","selected");}
        if (string5.indexOf("Peg Leg Percival") != -1){$("select option:contains(Peg Leg Percival)").prop("selected","selected");}
        if (string5.indexOf("Bonnie Pip Culliford") != -1){$("select option:contains(Bonnie Pip Culliford)").prop("selected","selected");}
        if (string5.indexOf("Puffo the Waister") != -1){$("select option:contains(Puffo the Waister)").prop("selected","selected");}
        if (string5.indexOf("Stuff-A-Roo") != -1){$("select option:contains(Stuff-A-Roo)").prop("selected","selected");}
        if (string5.indexOf("Squire Venable") != -1){$("select option:contains(Squire Venable)").prop("selected","selected");}
        if (string5.indexOf("Captain Crossblades") != -1){$("select option:contains(Captain Crossblades)").prop("selected","selected");}
        if (string5.indexOf("Ol' Stripey") != -1){$("select option:contains(Ol' Stripey)").prop("selected","selected");}
        if (string5.indexOf("Ned the Skipper") != -1){$("select option:contains(Ned the Skipper)").prop("selected","selected");}
        if (string5.indexOf("Fairfax the Deckhand") != -1){$("select option:contains(Fairfax the Deckhand)").prop("selected","selected");}
        if (string5.indexOf("Gooblah the Grarrl") != -1){$("select option:contains(Gooblah the Grarrl)").prop("selected","selected");}
        if (string5.indexOf("Franchisco Corvallio") != -1){$("select option:contains(Franchisco Corvallio)").prop("selected","selected");}
        if (string5.indexOf("Federismo Corvallio") != -1){$("select option:contains(Federismo Corvallio)").prop("selected","selected");}
        if (string5.indexOf("Admiral Blackbeard") != -1){$("select option:contains(Admiral Blackbeard)").prop("selected","selected");}
        if (string5.indexOf("Buck Cutlass") != -1){$("select option:contains(Buck Cutlass)").prop("selected","selected");}
        if (string5.indexOf("The Tailhook Kid") != -1){ $("select option:contains(The Tailhook Kid)").prop("selected","selected");}

        if (string5.indexOf("Shipwreck") != -1){
            checkShipwreck.checked = true;
        } else {
            $("select[name=winner1] option:contains(Who would you)").prop("selected","selected");
        }
        if (string5.indexOf("Lagoon") != -1){
            checkLagoon.checked = true;
        } else {
            $("select[name=winner2] option:contains(Who would you)").prop("selected","selected");
        }
        if (string5.indexOf("Treasure Island") != -1){
            checkTreasureIsland.checked = true;
        } else {
            $("select[name=winner3] option:contains(Who would you)").prop("selected","selected");
        }
        if (string5.indexOf("Hidden Cove") != -1){
            checkHiddenCove.checked = true;
        } else {
            $("select[name=winner4] option:contains(Who would you)").prop("selected","selected");
        }
        if (string5.indexOf("Harpoon Harry's") != -1){
            checkHarpoonHarrys.checked = true;
        } else {
            $("select[name=winner5] option:contains(Who would you)").prop("selected","selected");
        }
    };

    document.getElementById('addbets6').onclick = function() {
        checkShipwreck.checked = false;
        checkLagoon.checked = false;
        checkTreasureIsland.checked = false;
        checkHiddenCove.checked = false;
        checkHarpoonHarrys.checked = false;
        $("select option:contains(Who would you)").prop("selected","selected");

        if (string6.indexOf("Scurvy Dan the Blade") != -1){$("select option:contains(Scurvy Dan the Blade)").prop("selected","selected");}
        if (string6.indexOf("Young Sproggie") != -1){$("select option:contains(Young Sproggie)").prop("selected","selected");}
        if (string6.indexOf("Orvinn the First Mate") != -1){$("select option:contains(Orvinn the First Mate)").prop("selected","selected");}
        if (string6.indexOf("Lucky McKyriggan") != -1){$("select option:contains(Lucky McKyriggan)").prop("selected","selected");}
        if (string6.indexOf("Sir Edmund Ogletree") != -1){$("select option:contains(Sir Edmund Ogletree)").prop("selected","selected");}
        if (string6.indexOf("Peg Leg Percival") != -1){$("select option:contains(Peg Leg Percival)").prop("selected","selected");}
        if (string6.indexOf("Bonnie Pip Culliford") != -1){$("select option:contains(Bonnie Pip Culliford)").prop("selected","selected");}
        if (string6.indexOf("Puffo the Waister") != -1){$("select option:contains(Puffo the Waister)").prop("selected","selected");}
        if (string6.indexOf("Stuff-A-Roo") != -1){$("select option:contains(Stuff-A-Roo)").prop("selected","selected");}
        if (string6.indexOf("Squire Venable") != -1){$("select option:contains(Squire Venable)").prop("selected","selected");}
        if (string6.indexOf("Captain Crossblades") != -1){$("select option:contains(Captain Crossblades)").prop("selected","selected");}
        if (string6.indexOf("Ol' Stripey") != -1){$("select option:contains(Ol' Stripey)").prop("selected","selected");}
        if (string6.indexOf("Ned the Skipper") != -1){$("select option:contains(Ned the Skipper)").prop("selected","selected");}
        if (string6.indexOf("Fairfax the Deckhand") != -1){$("select option:contains(Fairfax the Deckhand)").prop("selected","selected");}
        if (string6.indexOf("Gooblah the Grarrl") != -1){$("select option:contains(Gooblah the Grarrl)").prop("selected","selected");}
        if (string6.indexOf("Franchisco Corvallio") != -1){$("select option:contains(Franchisco Corvallio)").prop("selected","selected");}
        if (string6.indexOf("Federismo Corvallio") != -1){$("select option:contains(Federismo Corvallio)").prop("selected","selected");}
        if (string6.indexOf("Admiral Blackbeard") != -1){$("select option:contains(Admiral Blackbeard)").prop("selected","selected");}
        if (string6.indexOf("Buck Cutlass") != -1){$("select option:contains(Buck Cutlass)").prop("selected","selected");}
        if (string6.indexOf("The Tailhook Kid") != -1){ $("select option:contains(The Tailhook Kid)").prop("selected","selected");}

        if (string6.indexOf("Shipwreck") != -1){
            checkShipwreck.checked = true;
        } else {
            $("select[name=winner1] option:contains(Who would you)").prop("selected","selected");
        }
        if (string6.indexOf("Lagoon") != -1){
            checkLagoon.checked = true;
        } else {
            $("select[name=winner2] option:contains(Who would you)").prop("selected","selected");
        }
        if (string6.indexOf("Treasure Island") != -1){
            checkTreasureIsland.checked = true;
        } else {
            $("select[name=winner3] option:contains(Who would you)").prop("selected","selected");
        }
        if (string6.indexOf("Hidden Cove") != -1){
            checkHiddenCove.checked = true;
        } else {
            $("select[name=winner4] option:contains(Who would you)").prop("selected","selected");
        }
        if (string6.indexOf("Harpoon Harry's") != -1){
            checkHarpoonHarrys.checked = true;
        } else {
            $("select[name=winner5] option:contains(Who would you)").prop("selected","selected");
        }
    };

    document.getElementById('addbets7').onclick = function() {
        checkShipwreck.checked = false;
        checkLagoon.checked = false;
        checkTreasureIsland.checked = false;
        checkHiddenCove.checked = false;
        checkHarpoonHarrys.checked = false;
        $("select option:contains(Who would you)").prop("selected","selected");

        if (string7.indexOf("Scurvy Dan the Blade") != -1){$("select option:contains(Scurvy Dan the Blade)").prop("selected","selected");}
        if (string7.indexOf("Young Sproggie") != -1){$("select option:contains(Young Sproggie)").prop("selected","selected");}
        if (string7.indexOf("Orvinn the First Mate") != -1){$("select option:contains(Orvinn the First Mate)").prop("selected","selected");}
        if (string7.indexOf("Lucky McKyriggan") != -1){$("select option:contains(Lucky McKyriggan)").prop("selected","selected");}
        if (string7.indexOf("Sir Edmund Ogletree") != -1){$("select option:contains(Sir Edmund Ogletree)").prop("selected","selected");}
        if (string7.indexOf("Peg Leg Percival") != -1){$("select option:contains(Peg Leg Percival)").prop("selected","selected");}
        if (string7.indexOf("Bonnie Pip Culliford") != -1){$("select option:contains(Bonnie Pip Culliford)").prop("selected","selected");}
        if (string7.indexOf("Puffo the Waister") != -1){$("select option:contains(Puffo the Waister)").prop("selected","selected");}
        if (string7.indexOf("Stuff-A-Roo") != -1){$("select option:contains(Stuff-A-Roo)").prop("selected","selected");}
        if (string7.indexOf("Squire Venable") != -1){$("select option:contains(Squire Venable)").prop("selected","selected");}
        if (string7.indexOf("Captain Crossblades") != -1){$("select option:contains(Captain Crossblades)").prop("selected","selected");}
        if (string7.indexOf("Ol' Stripey") != -1){$("select option:contains(Ol' Stripey)").prop("selected","selected");}
        if (string7.indexOf("Ned the Skipper") != -1){$("select option:contains(Ned the Skipper)").prop("selected","selected");}
        if (string7.indexOf("Fairfax the Deckhand") != -1){$("select option:contains(Fairfax the Deckhand)").prop("selected","selected");}
        if (string7.indexOf("Gooblah the Grarrl") != -1){$("select option:contains(Gooblah the Grarrl)").prop("selected","selected");}
        if (string7.indexOf("Franchisco Corvallio") != -1){$("select option:contains(Franchisco Corvallio)").prop("selected","selected");}
        if (string7.indexOf("Federismo Corvallio") != -1){$("select option:contains(Federismo Corvallio)").prop("selected","selected");}
        if (string7.indexOf("Admiral Blackbeard") != -1){$("select option:contains(Admiral Blackbeard)").prop("selected","selected");}
        if (string7.indexOf("Buck Cutlass") != -1){$("select option:contains(Buck Cutlass)").prop("selected","selected");}
        if (string7.indexOf("The Tailhook Kid") != -1){ $("select option:contains(The Tailhook Kid)").prop("selected","selected");}

        if (string7.indexOf("Shipwreck") != -1){
            checkShipwreck.checked = true;
        } else {
            $("select[name=winner1] option:contains(Who would you)").prop("selected","selected");
        }
        if (string7.indexOf("Lagoon") != -1){
            checkLagoon.checked = true;
        } else {
            $("select[name=winner2] option:contains(Who would you)").prop("selected","selected");
        }
        if (string7.indexOf("Treasure Island") != -1){
            checkTreasureIsland.checked = true;
        } else {
            $("select[name=winner3] option:contains(Who would you)").prop("selected","selected");
        }
        if (string7.indexOf("Hidden Cove") != -1){
            checkHiddenCove.checked = true;
        } else {
            $("select[name=winner4] option:contains(Who would you)").prop("selected","selected");
        }
        if (string7.indexOf("Harpoon Harry's") != -1){
            checkHarpoonHarrys.checked = true;
        } else {
            $("select[name=winner5] option:contains(Who would you)").prop("selected","selected");
        }
    };

    document.getElementById('addbets8').onclick = function() {
        checkShipwreck.checked = false;
        checkLagoon.checked = false;
        checkTreasureIsland.checked = false;
        checkHiddenCove.checked = false;
        checkHarpoonHarrys.checked = false;
        $("select option:contains(Who would you)").prop("selected","selected");

        if (string8.indexOf("Scurvy Dan the Blade") != -1){$("select option:contains(Scurvy Dan the Blade)").prop("selected","selected");}
        if (string8.indexOf("Young Sproggie") != -1){$("select option:contains(Young Sproggie)").prop("selected","selected");}
        if (string8.indexOf("Orvinn the First Mate") != -1){$("select option:contains(Orvinn the First Mate)").prop("selected","selected");}
        if (string8.indexOf("Lucky McKyriggan") != -1){$("select option:contains(Lucky McKyriggan)").prop("selected","selected");}
        if (string8.indexOf("Sir Edmund Ogletree") != -1){$("select option:contains(Sir Edmund Ogletree)").prop("selected","selected");}
        if (string8.indexOf("Peg Leg Percival") != -1){$("select option:contains(Peg Leg Percival)").prop("selected","selected");}
        if (string8.indexOf("Bonnie Pip Culliford") != -1){$("select option:contains(Bonnie Pip Culliford)").prop("selected","selected");}
        if (string8.indexOf("Puffo the Waister") != -1){$("select option:contains(Puffo the Waister)").prop("selected","selected");}
        if (string8.indexOf("Stuff-A-Roo") != -1){$("select option:contains(Stuff-A-Roo)").prop("selected","selected");}
        if (string8.indexOf("Squire Venable") != -1){$("select option:contains(Squire Venable)").prop("selected","selected");}
        if (string8.indexOf("Captain Crossblades") != -1){$("select option:contains(Captain Crossblades)").prop("selected","selected");}
        if (string8.indexOf("Ol' Stripey") != -1){$("select option:contains(Ol' Stripey)").prop("selected","selected");}
        if (string8.indexOf("Ned the Skipper") != -1){$("select option:contains(Ned the Skipper)").prop("selected","selected");}
        if (string8.indexOf("Fairfax the Deckhand") != -1){$("select option:contains(Fairfax the Deckhand)").prop("selected","selected");}
        if (string8.indexOf("Gooblah the Grarrl") != -1){$("select option:contains(Gooblah the Grarrl)").prop("selected","selected");}
        if (string8.indexOf("Franchisco Corvallio") != -1){$("select option:contains(Franchisco Corvallio)").prop("selected","selected");}
        if (string8.indexOf("Federismo Corvallio") != -1){$("select option:contains(Federismo Corvallio)").prop("selected","selected");}
        if (string8.indexOf("Admiral Blackbeard") != -1){$("select option:contains(Admiral Blackbeard)").prop("selected","selected");}
        if (string8.indexOf("Buck Cutlass") != -1){$("select option:contains(Buck Cutlass)").prop("selected","selected");}
        if (string8.indexOf("The Tailhook Kid") != -1){ $("select option:contains(The Tailhook Kid)").prop("selected","selected");}

        if (string8.indexOf("Shipwreck") != -1){
            checkShipwreck.checked = true;
        } else {
            $("select[name=winner1] option:contains(Who would you)").prop("selected","selected");
        }
        if (string8.indexOf("Lagoon") != -1){
            checkLagoon.checked = true;
        } else {
            $("select[name=winner2] option:contains(Who would you)").prop("selected","selected");
        }
        if (string8.indexOf("Treasure Island") != -1){
            checkTreasureIsland.checked = true;
        } else {
            $("select[name=winner3] option:contains(Who would you)").prop("selected","selected");
        }
        if (string8.indexOf("Hidden Cove") != -1){
            checkHiddenCove.checked = true;
        } else {
            $("select[name=winner4] option:contains(Who would you)").prop("selected","selected");
        }
        if (string8.indexOf("Harpoon Harry's") != -1){
            checkHarpoonHarrys.checked = true;
        } else {
            $("select[name=winner5] option:contains(Who would you)").prop("selected","selected");
        }
    };

    document.getElementById('addbets9').onclick = function() {
        checkShipwreck.checked = false;
        checkLagoon.checked = false;
        checkTreasureIsland.checked = false;
        checkHiddenCove.checked = false;
        checkHarpoonHarrys.checked = false;
        $("select option:contains(Who would you)").prop("selected","selected");

        if (string9.indexOf("Scurvy Dan the Blade") != -1){$("select option:contains(Scurvy Dan the Blade)").prop("selected","selected");}
        if (string9.indexOf("Young Sproggie") != -1){$("select option:contains(Young Sproggie)").prop("selected","selected");}
        if (string9.indexOf("Orvinn the First Mate") != -1){$("select option:contains(Orvinn the First Mate)").prop("selected","selected");}
        if (string9.indexOf("Lucky McKyriggan") != -1){$("select option:contains(Lucky McKyriggan)").prop("selected","selected");}
        if (string9.indexOf("Sir Edmund Ogletree") != -1){$("select option:contains(Sir Edmund Ogletree)").prop("selected","selected");}
        if (string9.indexOf("Peg Leg Percival") != -1){$("select option:contains(Peg Leg Percival)").prop("selected","selected");}
        if (string9.indexOf("Bonnie Pip Culliford") != -1){$("select option:contains(Bonnie Pip Culliford)").prop("selected","selected");}
        if (string9.indexOf("Puffo the Waister") != -1){$("select option:contains(Puffo the Waister)").prop("selected","selected");}
        if (string9.indexOf("Stuff-A-Roo") != -1){$("select option:contains(Stuff-A-Roo)").prop("selected","selected");}
        if (string9.indexOf("Squire Venable") != -1){$("select option:contains(Squire Venable)").prop("selected","selected");}
        if (string9.indexOf("Captain Crossblades") != -1){$("select option:contains(Captain Crossblades)").prop("selected","selected");}
        if (string9.indexOf("Ol' Stripey") != -1){$("select option:contains(Ol' Stripey)").prop("selected","selected");}
        if (string9.indexOf("Ned the Skipper") != -1){$("select option:contains(Ned the Skipper)").prop("selected","selected");}
        if (string9.indexOf("Fairfax the Deckhand") != -1){$("select option:contains(Fairfax the Deckhand)").prop("selected","selected");}
        if (string9.indexOf("Gooblah the Grarrl") != -1){$("select option:contains(Gooblah the Grarrl)").prop("selected","selected");}
        if (string9.indexOf("Franchisco Corvallio") != -1){$("select option:contains(Franchisco Corvallio)").prop("selected","selected");}
        if (string9.indexOf("Federismo Corvallio") != -1){$("select option:contains(Federismo Corvallio)").prop("selected","selected");}
        if (string9.indexOf("Admiral Blackbeard") != -1){$("select option:contains(Admiral Blackbeard)").prop("selected","selected");}
        if (string9.indexOf("Buck Cutlass") != -1){$("select option:contains(Buck Cutlass)").prop("selected","selected");}
        if (string9.indexOf("The Tailhook Kid") != -1){ $("select option:contains(The Tailhook Kid)").prop("selected","selected");}

        if (string9.indexOf("Shipwreck") != -1){
            checkShipwreck.checked = true;
        } else {
            $("select[name=winner1] option:contains(Who would you)").prop("selected","selected");
        }
        if (string9.indexOf("Lagoon") != -1){
            checkLagoon.checked = true;
        } else {
            $("select[name=winner2] option:contains(Who would you)").prop("selected","selected");
        }
        if (string9.indexOf("Treasure Island") != -1){
            checkTreasureIsland.checked = true;
        } else {
            $("select[name=winner3] option:contains(Who would you)").prop("selected","selected");
        }
        if (string9.indexOf("Hidden Cove") != -1){
            checkHiddenCove.checked = true;
        } else {
            $("select[name=winner4] option:contains(Who would you)").prop("selected","selected");
        }
        if (string9.indexOf("Harpoon Harry's") != -1){
            checkHarpoonHarrys.checked = true;
        } else {
            $("select[name=winner5] option:contains(Who would you)").prop("selected","selected");
        }
    };

    document.getElementById('addbets10').onclick = function() {
        checkShipwreck.checked = false;
        checkLagoon.checked = false;
        checkTreasureIsland.checked = false;
        checkHiddenCove.checked = false;
        checkHarpoonHarrys.checked = false;
        $("select option:contains(Who would you)").prop("selected","selected");

        if (string10.indexOf("Scurvy Dan the Blade") != -1){$("select option:contains(Scurvy Dan the Blade)").prop("selected","selected");}
        if (string10.indexOf("Young Sproggie") != -1){$("select option:contains(Young Sproggie)").prop("selected","selected");}
        if (string10.indexOf("Orvinn the First Mate") != -1){$("select option:contains(Orvinn the First Mate)").prop("selected","selected");}
        if (string10.indexOf("Lucky McKyriggan") != -1){$("select option:contains(Lucky McKyriggan)").prop("selected","selected");}
        if (string10.indexOf("Sir Edmund Ogletree") != -1){$("select option:contains(Sir Edmund Ogletree)").prop("selected","selected");}
        if (string10.indexOf("Peg Leg Percival") != -1){$("select option:contains(Peg Leg Percival)").prop("selected","selected");}
        if (string10.indexOf("Bonnie Pip Culliford") != -1){$("select option:contains(Bonnie Pip Culliford)").prop("selected","selected");}
        if (string10.indexOf("Puffo the Waister") != -1){$("select option:contains(Puffo the Waister)").prop("selected","selected");}
        if (string10.indexOf("Stuff-A-Roo") != -1){$("select option:contains(Stuff-A-Roo)").prop("selected","selected");}
        if (string10.indexOf("Squire Venable") != -1){$("select option:contains(Squire Venable)").prop("selected","selected");}
        if (string10.indexOf("Captain Crossblades") != -1){$("select option:contains(Captain Crossblades)").prop("selected","selected");}
        if (string10.indexOf("Ol' Stripey") != -1){$("select option:contains(Ol' Stripey)").prop("selected","selected");}
        if (string10.indexOf("Ned the Skipper") != -1){$("select option:contains(Ned the Skipper)").prop("selected","selected");}
        if (string10.indexOf("Fairfax the Deckhand") != -1){$("select option:contains(Fairfax the Deckhand)").prop("selected","selected");}
        if (string10.indexOf("Gooblah the Grarrl") != -1){$("select option:contains(Gooblah the Grarrl)").prop("selected","selected");}
        if (string10.indexOf("Franchisco Corvallio") != -1){$("select option:contains(Franchisco Corvallio)").prop("selected","selected");}
        if (string10.indexOf("Federismo Corvallio") != -1){$("select option:contains(Federismo Corvallio)").prop("selected","selected");}
        if (string10.indexOf("Admiral Blackbeard") != -1){$("select option:contains(Admiral Blackbeard)").prop("selected","selected");}
        if (string10.indexOf("Buck Cutlass") != -1){$("select option:contains(Buck Cutlass)").prop("selected","selected");}
        if (string10.indexOf("The Tailhook Kid") != -1){ $("select option:contains(The Tailhook Kid)").prop("selected","selected");}

        if (string10.indexOf("Shipwreck") != -1){
            checkShipwreck.checked = true;
        } else {
            $("select[name=winner1] option:contains(Who would you)").prop("selected","selected");
        }
        if (string10.indexOf("Lagoon") != -1){
            checkLagoon.checked = true;
        } else {
            $("select[name=winner2] option:contains(Who would you)").prop("selected","selected");
        }
        if (string10.indexOf("Treasure Island") != -1){
            checkTreasureIsland.checked = true;
        } else {
            $("select[name=winner3] option:contains(Who would you)").prop("selected","selected");
        }
        if (string10.indexOf("Hidden Cove") != -1){
            checkHiddenCove.checked = true;
        } else {
            $("select[name=winner4] option:contains(Who would you)").prop("selected","selected");
        }
        if (string10.indexOf("Harpoon Harry's") != -1){
            checkHarpoonHarrys.checked = true;
        } else {
            $("select[name=winner5] option:contains(Who would you)").prop("selected","selected");
        }
    };
}