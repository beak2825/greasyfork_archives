// ==UserScript==
// @name		gazellegames ggn: create request with steamid
// @namespace	 https://gazellegames.net/
// @version		 1.4
// @description	  create request with steamid | Greasemonkey 4.1: ✕  Tampermonkey 4.4: ✔ 
// @author		 hoannsi
// @match		 https://gazellegames.net/requests.php?action=new*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant		 GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/27786/gazellegames%20ggn%3A%20create%20request%20with%20steamid.user.js
// @updateURL https://update.greasyfork.org/scripts/27786/gazellegames%20ggn%3A%20create%20request%20with%20steamid.meta.js
// ==/UserScript==

var steamBox = document.getElementById('artist_tr');
steamBox.innerHTML = steamBox.innerHTML + '<br> Steamid: <input id="steamId" size="45" value="" type="text">'

var platformm = document.getElementById('platform')
platformm.selectedIndex = 6;

function html2bb(str) {
    if(typeof str === "undefined") return "";

    str = str.replace(/\r/g, "");    
    str = str.replace(/\n/g, "");    
    str = str.replace(/< *br *\/*>/g, "\n");
    str = str.replace(/< *u *>/g, "[u]");
    str = str.replace(/< *h1*>/g, "[align=center][u]");
    str = str.replace(/< *\/h1*>/g, "[/u]\n\n[/align]");
    str = str.replace(/< *\/p*>/g, "");
    str = str.replace(/< *p*>/g, "");
    str = str.replace(/< *\/ *u *>/g, "[/u]");
    str = str.replace(/< *\/ *li *>/g, "");
    str = str.replace(/< *li *>/g, "[*]");
    str = str.replace(/< *\/ *ul *>/g, "");
    str = str.replace(/< *ul *class=\\*\"bb_ul\\*\" *>/g, "");
    str = str.replace(/< *h2 *class=\"bb_tag\" *>/g, "\n\n[u]");
    str = str.replace(/< *\/ *h2 *>/g, "[/u]");
    str = str.replace(/< *strong *>/g, "[b]");
    str = str.replace(/< *\/ *strong *>/g, "[/b]");
    str = str.replace(/< *i *>/g, "[i]");
    str = str.replace(/< *\/ *i *>/g, "[/i]");
    str = str.replace(/\&quot;/g, "\"");
    str = str.replace(/< *img *src="([^"]*)" *>/g, "");
    str = str.replace(/< *b *>/g, "[b]");
    str = str.replace(/< *\/ *b *>/g, "[/b]");
    str = str.replace(/< *a [^>]*>/g, "");
    str = str.replace(/< *\/ *a *>/g, "");
    //Yeah, all these damn stars. Because people put spaces where they shouldn't.
    return str;
}



(function() {
    'use strict';

    document.getElementById("steamId").addEventListener("blur", function() {			//After the "appid" input loses focus
        GM_xmlhttpRequest({method: "GET",								//We call the Steam API to get info on the game
                           url: "http://store.steampowered.com/api/appdetails?l=en&appids=" + document.getElementById("steamId").value,
                           responseType: "json",
                           onload: function(response) {

                               var gameInfo = response.response[document.getElementById("steamId").value].data;		//We store the data in gameInfo, since it's much easier to access this way
                               document.getElementsByName("title")[0].value = gameInfo.name;								//Get the name of the game

                               document.getElementsByName("description")[0].value = "http://store.steampowered.com/app/"+document.getElementById("steamId").value+"/\n\n[align=center][b][u]About the game[/u][/b][/align]\n" + html2bb(gameInfo.about_the_game); //Get the description, formatted appropriately
                               document.getElementsByName("year")[0].value = gameInfo.release_date.date.split(", ").pop(); //Get the year, which is actually the last number of "release_date.date"

                               //Genres are in an object array. Need to make them lowercase, replace spaces with dots and separate them with ", "
                               var genres = [];
                               gameInfo.genres.forEach(function (genre) {
                                   var tag = genre.description.toLowerCase().replace(/ /g, "."); //Each genre is formatted as mentioned above and added to the "genres" array
                                   switch (tag) {
                                       case "rpg":
                                           tag = "role.playing.game";
                                       default:
                                           genres.push(tag);
                                       case "early.access":
                                           break;
                                   }

                               });
                               document.getElementById("tags").value = genres.join(", ");							//Every string in the "genres" array is then concatenated with ", " between them

                               var request2 = new XMLHttpRequest();
                               request2.open( "GET", "https://gazellegames.net/imgup.php?img=" + gameInfo.header_image.split("?")[0], false ); // false for synchronous request
                               request2.send( null );
                               document.getElementsByName("image")[0].value = request2.responseText;
                           }
                          });
    });

})();

