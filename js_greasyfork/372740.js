// ==UserScript==
// @name         HaremHeroes Hide Beaten league players
// @version      1.01
// @description  Hide the players that you can't fight anymore in your league, so it's easier to navigate
// @author       Spychopat
// @match        http*://nutaku.haremheroes.com/*
// @match        http*://*.hentaiheroes.com/*
// @namespace JDscripts
// @downloadURL https://update.greasyfork.org/scripts/372740/HaremHeroes%20Hide%20Beaten%20league%20players.user.js
// @updateURL https://update.greasyfork.org/scripts/372740/HaremHeroes%20Hide%20Beaten%20league%20players.meta.js
// ==/UserScript==


$("span[sort_by]").on("click", function(event) {
    removeBeatenHeroes();
})

function removeBeatenHeroes()
{
    var board = document.getElementsByClassName("leadTable")[2];
    if(!board)
        return;
    var heroes = board.getElementsByTagName("tr");
    var i;
    for (i in heroes) {
        try {
            if(heroes[i].getElementsByTagName("td")[3].innerHTML === "3/3"){
                heroes[i].style.display="none"
            }
        } catch(e) {}
    }
    //heroes[0].click();
    document.getElementsByClassName("lead_table_view")[2].scrollTo(0,0)
}


(function() {
    'use strict';
    removeBeatenHeroes();
})();