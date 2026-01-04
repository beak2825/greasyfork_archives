// ==UserScript==
// @name     geoguessr MAGGA script
// @description custom geoguessr menus and background + removal of avatar in the main page.
// @version  1.0.2
// @author  .flamby.
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @include        /^(https?)?(\:)?(\/\/)?([^\/]*\.)?geoguessr\.com($|\/.*)/
// @grant GM.getResourceUrl
// @resource bg_image https://super-duper.fr/img/magga/bg001.jpg
// @resource multi_country https://super-duper.fr/img/magga/flag.png
// @resource multi_duel https://super-duper.fr/img/magga/duel.png
// @resource multi_distance https://super-duper.fr/img/magga/distance.png
// @resource single_quickplay https://super-duper.fr/img/magga/earth5.png
// @resource single_maprunner https://super-duper.fr/img/magga/runner.png
// @resource single_classic https://super-duper.fr/img/magga/map_icon2.png
// @resource single_explorer https://super-duper.fr/img/magga/explorer.png
// @resource single_streak https://super-duper.fr/img/magga/streak.png
// @resource single_daily https://super-duper.fr/img/magga/calendar.png
// @resource multi_season_icon https://super-duper.fr/img/magga/beach.png
// @resource live_icon https://super-duper.fr/img/magga/live2.png
// @run-at document-start
// @license MIT
// @namespace MAGGAscript
// @downloadURL https://update.greasyfork.org/scripts/469170/geoguessr%20MAGGA%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/469170/geoguessr%20MAGGA%20script.meta.js
// ==/UserScript==
// MAke Geoguessr Great Again
// background images come from Pexel free library.


(async () => {
//------------------------------------------------------------------------------------------------------------OPTIONS ----------------------------------------------------------------------------------\\
var imageBackground = "bg_image"; // your background, you can customize it by changing the URL at line 9. https://super-duper.fr/img/magga/bg001.jpg to bg022.jpg are some i selected but any link will work, just keep in mind image size affects loading time of the page.

var menusBackground = true; // true = replace background in main page, single player menu and multiplayer menu
var lobbyBackground = true; //true = replace background in the multiplayer lobbys (like team duels)
var profileBackground = true; //true = replace background in profile pages

var removeMissions = false; // true = hide the yellow flag button with daily missions.

var singlePlayerIcons = true; // true = replace avatars with nice icons in single player menu.
var multiplayerIcons = true; // true = replace avatars with nice icons in multiplayer menu.

var bg_color = "rgba(14,31,40,0.7)"; // background color for the blocks in single player and multiplayer menus.
var bg_color_darker = "hsla(0,0%,100%,.1)"; // background color for multiplayer ranked blocks.

//------------------------------------------------------------------------------------------------------CODE---------------------------------------------------------------------------------------------\\

//list of elements to remove from all pages
var elementList = [ "deal-promo-button_root__nUfyK", //avatars ads
                   "maprunner-signed-in-start-page_backgroundWrapper__LOeXW", //main page maprunner background
                   "maprunner-signed-in-start-page_avatar__gAHLT", //main page giant avatar
                   "primary-menu-button_flair__DERJi", //yellow new season button
                   "footer_footer__tc8Gv", //social medias links
                   "promo-card_card__nNmEk" //avatar ads
                  ];
if (removeMissions) {elementList.push("slanted-button_container__6JmyZ");}


//init background
var background_URL = await GM.getResourceUrl(imageBackground);
var mainBackgroundElement;
removeBackgroundFirstPass();



//init single player and multiplayer icons
var multi_country_URL = await GM.getResourceUrl("multi_country");
var multi_duel_URL = await GM.getResourceUrl("multi_duel");
var multi_distance_URL = await GM.getResourceUrl("multi_distance");
var multi_season_icon_URL = await GM.getResourceUrl("multi_season_icon");
var single_quickplay_URL = await GM.getResourceUrl("single_quickplay");
var single_maprunner_URL = await GM.getResourceUrl("single_maprunner");
var single_classic_URL = await GM.getResourceUrl("single_classic");
var single_explorer_URL = await GM.getResourceUrl("single_explorer");
var single_streak_URL = await GM.getResourceUrl("single_streak");
var single_daily_URL = await GM.getResourceUrl("single_daily");
var live_icon_URL = await GM.getResourceUrl("live_icon");

//call the main function at regular intervals
var nIntervId = setInterval(removeReturningNodes, 250);


//------------------------------------------------------------------------------------------------------REMOVE RETURNING ELEMENTS---------------------------------------------------------------------------------------------\\
function removeReturningNodes() {

    //remove unwanted elements
    for (var i=0;i<elementList.length;i++) {
        var el = document.getElementsByClassName(elementList[i]);
        if (el != undefined) {
            if (el.length>0) { el[0].style.display = "none";}
        }
    }

        //apply icons in single player menu
    if (singlePlayerIcons) {changeSinglePlayerImages();}
    //apply icons in multiplyer menu
    if (multiplayerIcons) {changeMultiplayerImages();}

    removeBackground();
}


//------------------------------------------------------------------------------------------------------BACKGROUNDS---------------------------------------------------------------------------------------------\\
function removeBackground() {

    var body = document.getElementsByTagName('body')[0];
    body.style.background = 'black';
    body.style.backgroundImage = "url("+ background_URL +")";
    body.style.backgroundRepeat = "no-repeat";
    body.style.backgroundSize = "100% 100%";
  

  if (menusBackground) {
    var backgroundMainPage = document.getElementsByClassName("background_wrapper__OlrxG");
    if (backgroundMainPage != undefined) {
        if (backgroundMainPage.length > 0 ) {
            let backgroundElement = backgroundMainPage[0];
            if (menusBackground) {
                $(backgroundElement).removeClass ("background_wrapper__OlrxG");
                $(backgroundElement).removeClass ("background_backgroundHome__lurxW");
                $(backgroundElement).removeClass("background_backgroundMultiplayer__TLhIS");
                $(backgroundElement).removeClass("background_backgroundClassic__ySr_Z");}
            if (profileBackground) {$(backgroundElement).removeClass("background_backgroundProfile__EY4oP");}
        }
    }
    


      var backgroundMultiplayerMenu = document.getElementsByClassName("background_background__8Zm0Y");
        if (backgroundMultiplayerMenu != undefined) {
            if (backgroundMultiplayerMenu.length >0) {
                let backgroundElement =backgroundMultiplayerMenu[0];

            if (menusBackground) {
                $(backgroundElement).removeClass("background_wrapper__OlrxG");
                $(backgroundElement).removeClass("background_backgroundHome__lurxW");
                $(backgroundElement).removeClass("background_backgroundMultiplayer__TLhIS");
                $(backgroundElement).removeClass("background_backgroundClassic__ySr_Z");}
            if (profileBackground) {$(backgroundElement).removeClass("background_backgroundProfile__EY4oP");}
            }
        }

        var explorerMap =document.getElementsByClassName("world-map_worldMap__ZAPD7");
         if (explorerMap != undefined) {
             if (explorerMap.length >0) {
                 let Element =explorerMap[0];
                 Element.style.backgroundColor = "rgba(0,0,0,0.7)";
             }
         }

  }

    if (lobbyBackground) {
    var backgroundMultiplayerLobby = document.getElementsByClassName("in-game_root__3hGRu in-game_backgroundDefault__UDbvo"); // "party_root__EQz_N party_withSideTray__Ffx0K"
        if (backgroundMultiplayerLobby != undefined) {
            if (backgroundMultiplayerLobby.length >0) {
                let backgroundElement = backgroundMultiplayerLobby[0];
                $(backgroundElement).removeClass ("in-game_backgroundDefault__UDbvo");
        }
        }

        var backgroundMultiplayerLobby2 = document.getElementsByClassName("party_root__EQz_N party_withSideTray__Ffx0K"); //
        if (backgroundMultiplayerLobby2 != undefined) {
            if (backgroundMultiplayerLobby2.length >0) {
                let backgroundElement = backgroundMultiplayerLobby2[0];
                $(backgroundElement).removeClass ("party_root__EQz_N");
                backgroundElement.style.display = "grid";
                backgroundElement.style.flexGrow = "1";
                backgroundElement.style.gridTemplateRows = "5rem 1fr auto";
        }
        }

        var backgroundMultiplayerLobbyBottom = document.getElementsByClassName("party-footer_root__Rz_io");
        if (backgroundMultiplayerLobbyBottom != undefined) {
            if (backgroundMultiplayerLobbyBottom.length >0) {
                let backgroundElement = backgroundMultiplayerLobbyBottom[0];
               $(backgroundElement).removeClass ("party-footer_root__Rz_io");
                backgroundElement.style.alignItems = "center";
                backgroundElement.style.boxSizing = "border-box";
                backgroundElement.style.display = "flex";
                backgroundElement.style.flexDirection = "column";
                backgroundElement.style.maxWidth = "100vw";
        }
        }
    }


}

//------------------------------------------------------------------------------------------------------BACKGROUNDS---------------------------------------------------------------------------------------------\\
function removeBackgroundFirstPass() {

    var blocked1 = false;
    var blocked2 = false;
    var bg1;
    var bg2;

    var body = document.getElementsByTagName('body')[0];
    body.style.background = 'black';
    body.style.backgroundImage = "url("+ background_URL +")";
    body.style.backgroundSize = "100% 100%";


    if (menusBackground) {
    var backgroundMainPage = document.getElementsByClassName("background_wrapper__OlrxG");
    if (backgroundMainPage != undefined) {
        if (backgroundMainPage.length > 0 ) {
            let backgroundElement = backgroundMainPage[0];
            bg1 = backgroundElement;
            //bg1.id = "bg1";
            if (menusBackground) {
            $(backgroundElement).removeClass("background_wrapper__OlrxG");
            $(backgroundElement).removeClass("background_backgroundHome__lurxW");
            $(backgroundElement).removeClass("background_backgroundMultiplayer__TLhIS");
            $(backgroundElement).removeClass("background_backgroundClassic__ySr_Z");}
            if (profileBackground) {$(backgroundElement).removeClass("background_backgroundProfile__EY4oP");}

            const observerMainPage1 = new MutationObserver((mutations) => {
               if (blocked1) {blocked1 = false; return;}
          mutations.forEach( function (mutation) {
              if (mutation.type === "attributes" && mutation.attributeName == "class" && mutation.target.classList != undefined && mutation.target.classList[0] == "background_wrapper__OlrxG") {
                  blocked1 = true;
                  if (menusBackground) {
                  $(mutation.target).removeClass("background_wrapper__OlrxG");
                  $(mutation.target).removeClass("background_backgroundHome__lurxW");
                  $(mutation.target).removeClass("background_backgroundMultiplayer__TLhIS");
                  $(mutation.target).removeClass("background_backgroundClassic__ySr_Z");
                  }
                  if (profileBackground) {$(mutation.target).removeClass("background_backgroundProfile__EY4oP");}
                  console.log("removed1");
              }

              if (mutation.type === "attributes" && mutation.attributeName == "class" && mutation.target.classList != undefined && mutation.target.classList[0] == "in-game_root__3hGRu") {
                  blocked1 = true;
              $(mutation.target).removeClass("in-game_backgroundDefault__UDbvo");
                  console.log("removed1");
              }

            if (mutation.type === "childList") {
            [mutation.addedNodes].forEach((addedNode) => {
                //console.log(addedNode);
                if (addedNode != undefined && addedNode.length >0) {
                /*console.log("addedNode0 :");
                console.log(addedNode[0].classList);
                    console.log(addedNode[0].classList[0]);
                    console.log(addedNode[0].classList != undefined);*/

            if (addedNode[0].classList != undefined && addedNode[0].classList[0] != undefined && addedNode[0].classList[0] == "background_background__8Zm0Y") {
                console.log("removed3");
                if (menusBackground) {
                    $(addedNode[0]).removeClass("background_backgroundMultiplayer__TLhIS");
                    $(addedNode[0]).removeClass("background_backgroundHome__lurxW");
                $(addedNode[0]).removeClass ("in-game_backgroundDefault__UDbvo");
                $(addedNode[0]).removeClass ("background_backgroundClassic__ySr_Z");}
                if (profileBackground) {$(addedNode[0]).removeClass("background_backgroundProfile__EY4oP");}

            }
            }
            })
            }

          }
          )
          });
          observerMainPage1.observe(bg1, { attributes : true, childList : true, subtree : true});

        }
    }

    backgroundMainPage = document.getElementsByClassName("background_background__8Zm0Y");
    if (backgroundMainPage != undefined) {
        if (backgroundMainPage.length > 0 ) {
            let backgroundElement = backgroundMainPage[0];
            bg2 = backgroundElement;
            if (menusBackground) {
            $(backgroundElement).removeClass("background_backgroundMultiplayer__TLhIS");
            $(backgroundElement).removeClass("background_backgroundHome__lurxW");}
            if (profileBackground) {$(backgroundElement).removeClass("background_backgroundProfile__EY4oP");}
        }
    }
    }



    if (lobbyBackground) {
    var backgroundMultiplayerLobby = document.getElementsByClassName("in-game_root__3hGRu in-game_backgroundDefault__UDbvo"); // "party_root__EQz_N party_withSideTray__Ffx0K"
        if (backgroundMultiplayerLobby != undefined) {
            if (backgroundMultiplayerLobby.length >0) {
                let backgroundElement = backgroundMultiplayerLobby[0];
                $(backgroundElement).removeClass ("in-game_backgroundDefault__UDbvo");
        }
        }

        var backgroundMultiplayerLobby2 = document.getElementsByClassName("party_root__EQz_N party_withSideTray__Ffx0K"); //
        if (backgroundMultiplayerLobby2 != undefined) {
            if (backgroundMultiplayerLobby2.length >0) {
                let backgroundElement = backgroundMultiplayerLobby2[0];
                $(backgroundElement).removeClass ("party_root__EQz_N");
                backgroundElement.style.display = "grid";
                backgroundElement.style.flexGrow = "1";
                backgroundElement.style.gridTemplateRows = "5rem 1fr auto";
        }
        }

        var backgroundMultiplayerLobbyBottom = document.getElementsByClassName("party-footer_root__Rz_io");
        if (backgroundMultiplayerLobbyBottom != undefined) {
            if (backgroundMultiplayerLobbyBottom.length >0) {
                let backgroundElement = backgroundMultiplayerLobbyBottom[0];
               $(backgroundElement).removeClass ("party-footer_root__Rz_io");
                backgroundElement.style.alignItems = "center";
                backgroundElement.style.boxSizing = "border-box";
                backgroundElement.style.display = "flex";
                backgroundElement.style.flexDirection = "column";
                backgroundElement.style.maxWidth = "100vw";
        }
        }
    }


}




//------------------------------------------------------------------------------------------------------SINGLE PLAYER MENU---------------------------------------------------------------------------------------------\\
function changeSinglePlayerImages() {

    var layoutList = document.getElementsByClassName("screens_root__S_Vos screens_focusCardWrapper__8iorp");
        if (layoutList != undefined) {
            if (layoutList .length >0) {
                let Element = layoutList[0];
                Element.style.minWidth = "var(--containerWidth)";
                Element.style.display = "grid";
                Element.style.gap = "2vw";
                Element.style.gridTemplateArea = "main secondary tertiary";
                Element.style.gridTemplateColumns = "repeat(3,minmax(0,1fr))";
                Element.style.transition = "filter .6s ease";
                $(Element).removeClass("screens_root__S_Vos");
                $(Element).removeClass("screens_focusCardWrapper__8iorp");
            }
        }


    var singlePlayerQuickplayList = document.getElementsByClassName("screens_card__WP0M0 screens_card__WP0M0 screens_quickplayCard__gIeOx");
    if (singlePlayerQuickplayList != undefined) {
        if (singlePlayerQuickplayList.length >0) {
            let Element = singlePlayerQuickplayList[0];
            $(Element).removeClass("screens_quickplayCard__gIeOx");
            Element.style.backgroundColor = bg_color;
            Element.firstChild.style.flex = "1";
            Element.style.justifyContent = "center";
            let newImg = document.createElement('img');
            newImg.style.maxHeight = "40%";
            newImg.style.objectFit = "contain";
            newImg.src = single_quickplay_URL;
            Element.insertBefore(newImg, Element.firstChild);
        }
    }

    var singlePlayerMaprunnerList = document.getElementsByClassName("screens_card__WP0M0 screens_card__WP0M0 screens_maprunnerCard__o_Ulp");
    if (singlePlayerMaprunnerList != undefined) {
        if (singlePlayerMaprunnerList.length >0) {
            let Element = singlePlayerMaprunnerList[0];
            $(Element).removeClass("screens_maprunnerCard__o_Ulp");
            Element.style.backgroundColor = bg_color;
            Element.style.justifyContent = "center";
            let newImg = document.createElement('img');
            newImg.style.maxHeight = "40%";
            newImg.style.objectFit = "contain";
            newImg.src = single_maprunner_URL;
            Element.insertBefore(newImg, Element.firstChild);
        }
    }
    var singlePlayerClassicList = document.getElementsByClassName("screens_card__WP0M0 screens_card__WP0M0 screens_mapsCard__oXg2H");
        if (singlePlayerClassicList != undefined) {
        if (singlePlayerClassicList.length >0) {
            let Element = singlePlayerClassicList[0];
            $(Element).removeClass("screens_mapsCard__oXg2H");
            Element.style.backgroundColor = bg_color;
            Element.style.justifyContent = "center";
            Element.firstChild.firstChild.style.display = "none";
            Element.firstChild.children[1].innerHTML = "CLASSIC MAPS";
            let newImg = document.createElement('img');
            newImg.style.maxHeight = "40%";
            newImg.style.objectFit = "contain";
            newImg.src = single_classic_URL;
            Element.insertBefore(newImg, Element.firstChild);
        }
    }

    var singlePlayerStreakList = document.getElementsByClassName("screens_card__WP0M0 screens_card__WP0M0 screens_streaksCard__cvcTt");
            if (singlePlayerStreakList != undefined) {
        if (singlePlayerStreakList.length >0) {
            let Element = singlePlayerStreakList[0];
            $(Element).removeClass("screens_streaksCard__cvcTt");
            Element.style.backgroundColor = bg_color;
            Element.style.justifyContent = "center";
            let newImg = document.createElement('img');
            newImg.style.maxHeight = "40%";
            newImg.style.objectFit = "contain";
            newImg.src = single_streak_URL;
            Element.insertBefore(newImg, Element.firstChild);
        }
    }

        var singlePlayerExplorerList = document.getElementsByClassName("screens_card__WP0M0 screens_card__WP0M0 screens_explorerCard__BAf3R");
            if (singlePlayerExplorerList != undefined) {
        if (singlePlayerExplorerList.length >0) {
            let Element = singlePlayerExplorerList[0];
            $(Element).removeClass("screens_explorerCard__BAf3R");
            Element.style.backgroundColor = bg_color;
            Element.style.justifyContent = "center";
            let newImg = document.createElement('img');
            newImg.style.maxHeight = "40%";
            newImg.style.objectFit = "contain";
            newImg.src = single_explorer_URL;
            Element.insertBefore(newImg, Element.firstChild);
        }
    }

            var singlePlayerDailyList = document.getElementsByClassName("screens_card__WP0M0 screens_card__WP0M0 screens_dailyCard___jMGE");
            if (singlePlayerDailyList != undefined) {
        if (singlePlayerDailyList.length >0) {
            let Element = singlePlayerDailyList[0];
            $(Element).removeClass("screens_dailyCard___jMGE");
            Element.style.backgroundColor = bg_color;
            Element.style.justifyContent = "center";
            let newImg = document.createElement('img');
            newImg.style.maxHeight = "40%";
            newImg.style.objectFit = "contain";
            newImg.src = single_daily_URL;
            Element.insertBefore(newImg, Element.firstChild);
        }
    }

}

//------------------------------------------------------------------------------------------------------MULTIPLAYER MENU---------------------------------------------------------------------------------------------\\

function changeMultiplayerImages() {

 var multiplayerBackgroundList = document.getElementsByClassName("ranked_root__h__6e");
     if (multiplayerBackgroundList != undefined) {
        if (multiplayerBackgroundList.length >0) {
            multiplayerBackgroundList[0].style.backgroundColor = bg_color;
        }
     }

  multiplayerBackgroundList = document.getElementsByClassName("tournament-card_card__fkNsg");
     if (multiplayerBackgroundList != undefined) {
        if (multiplayerBackgroundList.length >0) {
            multiplayerBackgroundList[0].style.backgroundColor = bg_color;
        }
     }

    var unrankedCountryList = document.getElementsByClassName("unranked_card__6DqeB unranked_brc__xHUjF");
         if (unrankedCountryList != undefined) {
        if (unrankedCountryList.length >0) {
            let Element = unrankedCountryList[0];
            $(Element).removeClass("unranked_brc__xHUjF");
            Element.style.backgroundPosition = "50%";
            Element.style.backgroundRepeat = "no-repeat";
            Element.style.borderRadius = "0.5rem";
            Element.style.boxSizing = "border-box";
            Element.style.color = "white";
            Element.style.cursor = "pointer";
            Element.style.height = "100%";
            Element.style.padding = "2rem";
            Element.style.backgroundColor = bg_color;
            Element.style.backgroundImage = "url("+ multi_country_URL +")";
        }
     }

        var rankedCountryList = document.getElementsByClassName("play_gameModeCard__zSeBo play_active__t661_");
         if (rankedCountryList != undefined) {
        if (rankedCountryList.length >0) {
            rankedCountryList[0].style.backgroundImage = "";
            rankedCountryList[0].style.backgroundColor = bg_color_darker;
        }
     }

        var rankedDistanceList = document.getElementsByClassName("play_gameModeCard__zSeBo play_active__t661_");
         if (rankedDistanceList != undefined) {
        if (rankedDistanceList.length >1) {
            rankedDistanceList[1].style.backgroundImage = "";
            rankedDistanceList[1].style.backgroundColor = bg_color_darker;
        }
     }

        var rankedDuelList = document.getElementsByClassName("play_gameModeCard__zSeBo play_active__t661_");
         if (rankedDuelList != undefined) {
        if (rankedDuelList.length >2) {
            rankedDuelList[2].style.backgroundImage = "";
            rankedDuelList[2].style.backgroundColor = bg_color_darker;
        }
     }

        var unrankedDistanceList = document.getElementsByClassName("unranked_brd__avH20");
         if (unrankedDistanceList != undefined) {
        if (unrankedDistanceList.length >0) {
            let Element = unrankedDistanceList[0];
            $(Element).removeClass("unranked_brd__avH20");
            Element.style.backgroundPosition = "50%";
            Element.style.backgroundRepeat = "no-repeat";
            Element.style.borderRadius = "0.5rem";
            Element.style.boxSizing = "border-box";
            Element.style.color = "white";
            Element.style.cursor = "pointer";
            Element.style.height = "100%";
            Element.style.padding = "2rem";
            Element.style.backgroundColor = bg_color;
            Element.style.backgroundImage = "url("+ multi_distance_URL +")";
        }
     }




        var unrankedDuelList = document.getElementsByClassName("unranked_card__6DqeB unranked_td__EL4y2");
         if (unrankedDuelList != undefined) {
        if (unrankedDuelList.length >0) {
            let Element = unrankedDuelList[0];
            $(Element).removeClass("unranked_td__EL4y2");
            Element.style.backgroundPosition = "50%";
            Element.style.backgroundRepeat = "no-repeat";
            Element.style.borderRadius = "0.5rem";
            Element.style.boxSizing = "border-box";
            Element.style.color = "white";
            Element.style.cursor = "pointer";
            Element.style.height = "100%";
            Element.style.padding = "2rem";
            Element.style.backgroundColor = bg_color;
            Element.style.backgroundImage = "url("+ multi_duel_URL +")";
        }
     }
    var seasonIconList = document.getElementsByClassName("season-icon_icon__bBPys");
     if (seasonIconList != undefined) {
        if (seasonIconList.length >0) {
            seasonIconList[0].firstChild.src = multi_season_icon_URL;
            seasonIconList[0].firstChild.style.borderRadius = "7px";
            seasonIconList[0].firstChild.width = "100%";
            seasonIconList[0].firstChild.height = "50%";
        }
     }

    var liveChallengeList = document.getElementsByClassName("footer-controls_gameModeIcon__0eE5e footer-controls_liveChallengeCorrection__nuutg");
    if (liveChallengeList != undefined) {
        if (liveChallengeList.length >0) {
            liveChallengeList[0].src = live_icon_URL;
        }
     }
}

    })();
