// ==UserScript==
// @name		 gazellegames GGn New Uploady
// @namespace	 https://gazellegames.net/
// @version		 6.4
// @description	 Steam Uploady Fork for GGn | Greasemonkey 4.1: ✕ Tampermonkey 4.4: ✔
// @author		 NeutronNoir
// @match		 https://gazellegames.net/upload.php*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant		 GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/25135/gazellegames%20GGn%20New%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/25135/gazellegames%20GGn%20New%20Uploady.meta.js
// ==/UserScript==


var askScreens = false;

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
    str = str.replace(/< *\/ *h2 *>/g, "[/u]\n\n");
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
    str = str.replace(/\n\n\n/g, "\n\n");
    //Yeah, all these damn stars. Because people put spaces where they shouldn't.
    return str;
}

function clickAllPtp(){
    var list = document.querySelectorAll("input");
    for (var i = 0; i < list.length; i++) { if(list[i].value=='PTPImg It'){list[i].click()}}
}

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
                                                             if (index >= 16) return;															//The site doesn't accept more than 16 screenshots
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
                                                     document.getElementById("album_desc").value = "[align=center][b][u]About the game[/u][/b][/align]\n" + html2bb(gameInfo.about_the_game); //Get the description, formatted appropriately
                                                     document.getElementById("year").value = gameInfo.release_date.date.split(", ").pop(); //Get the year, which is actually the last number of "release_date.date"

                                                     //Genres are in an object array. Need to make them lowercase, replace spaces with dots and separate them with ", "
                                                     var genres = [];
                                                     gameInfo.genres.forEach(function (genre) {
                                                         var tag = genre.description.toLowerCase().replace(/ /g, "."); //Each genre is formatted as mentioned above and added to the "genres" array
                                                         switch (tag) {
                                                             case "rpg":
                                                                 genres.push("role.playing.game");
                                                                 break;
                                                             case "early.access":
                                                                 break;
                                                             case "sexual.content":
                                                                 genres.push("adult");
                                                                 break;
                                                             case "scifi":
                                                                 genres.push("science.fiction");
                                                                 break;
                                                             default:
                                                                 genres.push(tag);
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
                                                             if (index >= 16) return;															//The site doesn't accept more than 16 screenshots
                                                             if (index >= 3) add_screen.click();												//There's 3 screenshot boxes by default. If we need to add more, we do as if the user clicked on the "[+]" (for reasons mentioned above)
                                                             screens[index].value = screen.path_full.split("?")[0];											//Finally store the screenshot link in the right screen field.
                                                         });
                                                     }


                                                     //Now let's get the requirements
                                                     document.getElementById("album_desc").value += "\n\n[quote][align=center][b][u]System Requirements[/u][/b][/align]\n";	//The requirements need to be in the description of the torrent.
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

                                                     document.getElementById("album_desc").value += "[/quote]";
                                                 }
                                                });
        });
    }
})();
