// ==UserScript==
// @name Dominus TP
// @license MIT
// @match        https://www.geoguessr.com/*
// @namespace    http://tampermonkey.net/
// @require    http://code.jquery.com/jquery-1.11.3.min.js
// @version      0.1
// @description  Texture pack for GeoGuessr!
// @author       You
// @match        https://www.geoguessr.com/team-duels/db4a5f7c-dd1b-4c45-a45d-54d1baaba3d5
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460201/Dominus%20TP.user.js
// @updateURL https://update.greasyfork.org/scripts/460201/Dominus%20TP.meta.js
// ==/UserScript==

function refreshData()
{
    x = 1;  // 5 Seconds


    var elements = document.getElementsByClassName('button_link__xHa3x button_variantPrimary__xc8Hp');
    for(var i=0; i<elements.length; i++) {
        elements[i].style.backgroundColor='#0080ff';
    }
    var elements = document.getElementsByClassName('button_button__CnARx button_variantPrimary__xc8Hp');
    for(var i=0; i<elements.length; i++) {
        elements[i].style.backgroundColor='#0080ff';
    }

    var SB = document.getElementsByClassName('game-layout__status');
    for(var i=0; i<SB.length; i++) {
        SB[i].id = "SB";
    }



    setTimeout(refreshData, x*100);
}


refreshData(); // execute function
function refreshData()
{
    x = 1;  // 5 Seconds

        var sb = localStorage.getItem("sb");
            if (sb == 1) {
                $("#SSB").prop("checked", true);
        }

        if (sb == 0) {
            $("#SSB").prop("checked", false);


        }

    setTimeout(refreshData, x*100);
}


refreshData(); // execute function

window.addEventListener("keydown", checkKeyPress, false); function checkKeyPress(key) { if (key.keyCode == "27")
var SB = document.getElementsByClassName('game-layout__status');

    for(var i=0; i<SB.length; i++) {
        SB[i].id = "SB";
    }





    var elements = document.getElementsByClassName('game-menu_optionsContainer__gLhxR');
    for(var i=0; i<elements.length; i++) {





        const SSB = document.createElement("label");
        SSB.classList.add("game-options_option__eCz9o");

        const SSB1 = document.createElement("div");
        SSB1.classList.add("game-menu_muteIconWrapper__Larjv");

        const SSB2 = document.createElement("div");
        SSB2.innerHTML = "Hide Status Bar";
        SSB2.classList.add("game-options_optionLabel__dJ_Cy");

        const SSB3 = document.createElement("div");
        SSB3.classList.add("game-options_optionInput__TAqdI");

        const SSB4 = document.createElement("input");
        SSB4.type = "checkbox";
        SSB4.id = "SSB";
        SSB4.classList.add("toggle_toggle__hwnyw");
        SSB4.addEventListener("click", () => {
    	   var x=$("#SSB").is(":checked");
           if (x == true) {
                document.getElementById("SB").style.display = "none";
                localStorage.setItem("sb",1);
           }
           if (x == false) {
                document.getElementById("SB").style.display = "block";
                localStorage.setItem("sb",0);
           }
    	});




        const SSB5 = document.createElement("img");
        SSB5.style.transform = "rotate(180deg);";
        SSB5.src = "https://i.ibb.co/pdRGJJD/HideSB.png";
        SSB5.style.width = "45px";
        SSB5.style.position = "absolute";
        SSB5.style.height = "45px";



        elements[i].appendChild(SSB);
        SSB.appendChild(SSB1)
        SSB.appendChild(SSB5)
        SSB.appendChild(SSB2)
        SSB.appendChild(SSB3)
        SSB3.appendChild(SSB4)
    }
}
window.addEventListener("load", function() {

    const start = `<div class="slanted-wrapper_root__2eaEs slanted-wrapper_variantGrayTransparent__aufaF">
    <div class="slanted-wrapper_start__Kl7rv slanted-wrapper_right__G0JWR"></div>
    <div class="page-label_labelWrapper__o1vpe">
    <div class="label_sizeXSmall__mFnrR">`

    const end = `</div></div><div class="slanted-wrapper_end__cD1Qu slanted-wrapper_right__G0JWR"></div></div>`

    const singleplayer = start + `<a href="/singleplayer" style="color:white">Singleplayer</a>` + end
    const competitive = start + `<a href="/competitive" style="color:white">Competitive</a>` + end
    const party = start + `<a href="/play-with-friends" style="color:white">Party</a>` + end
    const quiz = start + `<a href="/quiz" style="color:white">Quiz</a>` + end
    const ongoingGames = start + `<a href="/me/current" style="color:white">Ongoing Games</a>` + end
    const activities = start + `<a href="/me/activities" style="color:white">Activities</a>` + end
    const myMaps = start + `<a href="/me/maps" style="color:white">My Maps</a>` + end
    const likedMaps = start + `<a href="/me/likes" style="color:white">Liked Maps</a>` + end

    // const html = singleplayer + competitive + party + quiz + ongoingGames + activities + myMaps + likedMaps
    const html = singleplayer + competitive + party + quiz + ongoingGames + activities + myMaps + likedMaps

    const headers = document.getElementsByTagName("header")
    const header = headers[0]
    const menu = header.childNodes[1]

    menu.style.display = "flex"

    const newItems = document.createElement("div")
    newItems.innerHTML = html
    newItems.style.display = "flex"
    menu.prepend(newItems) // keeping the original labels fixes issues with "crashes" links on pages are clicked

    const newDivs = newItems.getElementsByClassName("slanted-wrapper_root__2eaEs")
    const menuItems = menu.getElementsByClassName("slanted-wrapper_root__2eaEs")
    const menuLinks = menu.getElementsByClassName("label_sizeXSmall__mFnrR")

    // hides original label
    if (menuItems.length > newDivs.length) {
        menuItems[menuItems.length-1].style.display = "none"
    }

    // shows active page
    const url = window.location.href
    for (let i=0; i<menuItems.length; i++) {
        let links = menuLinks[i].getElementsByTagName("a")
        if (links == null) continue
        let link = links[0]
        if (link == null) continue

        if (link.href == url) {
            link.style.color = ""
            menuItems[i].className = "slanted-wrapper_root__2eaEs slanted-wrapper_variantWhite__VKHvw"
            break
        } else {
            link.style.color = "white"
            menuItems[i].className = "slanted-wrapper_root__2eaEs slanted-wrapper_variantGrayTransparent__aufaF"
        }
    }

}, false)



