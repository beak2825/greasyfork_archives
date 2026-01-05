// ==UserScript==
// @name		 GGn New Uploady
// @namespace	 https://gazellegames.net/
// @version		 0.1222
// @description	 Steam Uploady for GGn
// @author		 NeutronNoir
// @match		 https://gazellegames.net/upload.php*
// @match		 https://gazellegames.net/torrents.php?action=editgroup*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://greasyfork.org/scripts/23948-html2bbcode/code/HTML2BBCode.js
// @grant		 GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/21493/GGn%20New%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/21493/GGn%20New%20Uploady.meta.js
// ==/UserScript==

var askScreens = false;

(function() {
    'use strict';
    if (window.location.href.search("action=editgroup") != -1) {
        $("td.center").parent().after("<tr><td class='label'>Steam ID</td><td><input id='steamid' /></td></tr>");
        document.getElementById("steamid").addEventListener("blur", function() {			//After the "appid" input loses focus
            var request = new GM_xmlhttpRequest({method: "GET",								//We call the Steam API to get info on the game
                                                 url: "http://store.steampowered.com/api/appdetails?l=en&appids=" + document.getElementById("steamid").value,
                                                 responseType: "json",
                                                 onload: function(response) {

                                                     var gameInfo = response.response[document.getElementById("steamid").value].data;		//We store the data in gameInfo, since it's much easier to access this way
                                                     
                                                     var addScreens = true;
                                                     if (askScreens === true) addScreens = confirm("Fill the screenshot boxes ?");

                                                     if (addScreens === true) {
                                                         $("input[name='image']").val(gameInfo.header_image.split("?")[0]);						//Get the image URL
                                                         var screens = document.getElementsByName("screens[]");								//Get each element corresponding to a screenshot
                                                         var add_screen = $("#image_block a[href='#']").first(); //This is a shortcut to add a screenshot field.
                                                         //If I didn't do this, people with access to "whatimg it" wouldn't have it, or inversely people without access would have it (which causes some bugs)
                                                         gameInfo.screenshots.forEach( function(screen, index) {	//We iterate on Steam screenshots from the API
                                                             if (index >= 20) return;															//The site doesn't accept more than 16 screenshots
                                                             if (index >= 3) add_screen.click();												//There's 3 screenshot boxes by default. If we need to add more, we do as if the user clicked on the "[+]" (for reasons mentioned above)
                                                             screens[index].value = screen.path_full.split("?")[0];											//Finally store the screenshot link in the right screen field.
                                                         });
                                                     }
                                                 }
                                                });
        });
    }
    else {
        document.getElementById("steamid").addEventListener("blur", function() {			//After the "appid" input loses focus
            var request = new GM_xmlhttpRequest({method: "GET",								//We call the Steam API to get info on the game
                                                 url: "http://store.steampowered.com/api/appdetails?l=en&appids=" + document.getElementById("steamid").value,
                                                 responseType: "json",
                                                 onload: function(response) {

                                                     var gameInfo = response.response[document.getElementById("steamid").value].data;		//We store the data in gameInfo, since it's much easier to access this way
                                                     document.getElementById("title").value = gameInfo.name;								//Get the name of the game
                                                     document.getElementById("album_desc").value = "[align=center][b][u]About the game[/u][/b][/align]\n" + html2bb(gameInfo.detailed_description); //Get the description, formatted appropriately
                                                     document.getElementById("year").value = gameInfo.release_date.date.split(", ").pop(); //Get the year, which is actually the last number of "release_date.date"

                                                     //Genres are in an object array. Need to make them lowercase, replace spaces with dots and separate them with ", "
                                                     var genres = [];
                                                     gameInfo.genres.forEach(function (genre) {
                                                         var tag = genre.description.toLowerCase().replace(/ /g, "."); //Each genre is formatted as mentioned above and added to the "genres" array
                                                         switch (tag) {
                                                             case "rpg":
                                                                 tag = "role.playing.game";
                                                                 genres.push(tag);
                                                                 break;
                                                             case "scifi":
                                                                 tag = "science.fiction";
                                                                 genres.push(tag);
                                                                 break;
                                                             case "early.access":
                                                                 break;
                                                         }

                                                     });
                                                     document.getElementById("tags").value = genres.join(", ");							//Every string in the "genres" array is then concatenated with ", " between them

                                                     var addScreens = true;
                                                     if (askScreens === true) addScreens = confirm("Fill the screenshot boxes ?");

                                                     if (addScreens === true) {
                                                         document.getElementById("image").value = gameInfo.header_image.split("?")[0];						//Get the image URL
                                                         var screens = document.getElementsByName("screens[]");								//Get each element corresponding to a screenshot
                                                         var add_screen = $("#image_block a[href='#']").first(); //This is a shortcut to add a screenshot field.
                                                         //If I didn't do this, people with access to "whatimg it" wouldn't have it, or inversely people without access would have it (which causes some bugs)
                                                         gameInfo.screenshots.forEach( function(screen, index) {	//We iterate on Steam screenshots from the API
                                                             if (index >= 20) return;															//The site doesn't accept more than 16 screenshots
                                                             if (index >= 3) add_screen.click();												//There's 3 screenshot boxes by default. If we need to add more, we do as if the user clicked on the "[+]" (for reasons mentioned above)
                                                             screens[index].value = screen.path_full.split("?")[0];											//Finally store the screenshot link in the right screen field.
                                                         });
                                                     }


                                                     //Now let's get the requirements
                                                     document.getElementById("album_desc").value += "\n\n[quote][align=center][b][u]System Requirements[/u][/b][/align]";	//The requirements need to be in the description of the torrent.
                                                     switch (document.getElementById("platform").value) {
                                                         case "Windows":
                                                             document.getElementById("album_desc").value += html2bb(gameInfo.pc_requirements.minimum) + "\n\n" + html2bb(gameInfo.pc_requirements.recommended);	//We add the requirements, both minimal and recommended, formatted appropriately.
                                                             break;
                                                         case "Linux":
                                                             document.getElementById("album_desc").value += html2bb(gameInfo.linux_requirements.minimum) + "\n\n" + html2bb(gameInfo.linux_requirements.recommended);
                                                             break;
                                                         case "Mac":
                                                             document.getElementById("album_desc").value += html2bb(gameInfo.mac_requirements.minimum) + "\n\n" + html2bb(gameInfo.mac_requirements.recommended);
                                                             break;
                                                     }
                                                     document.getElementById("album_desc").value = document.getElementById("album_desc").value.slice(0, -1);
                                                     document.getElementById("album_desc").value += "[/quote]";
                                                 }
                                                });
        });
    }
})();