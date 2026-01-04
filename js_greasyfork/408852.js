// ==UserScript==
// @name         My Anime List Open Every Anime in the search page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  <The button is located in the dropdown menu> This script opens all anime links from MyAnimeList's Search page. It doesn't give you sequels (if they have similar names AND are on the same page).
// @author       TheBerzzeker
// @match        *://myanimelist.net/anime.php*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/408852/My%20Anime%20List%20Open%20Every%20Anime%20in%20the%20search%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/408852/My%20Anime%20List%20Open%20Every%20Anime%20in%20the%20search%20page.meta.js
// ==/UserScript==


var animeNames = [];

var animeLinks = [];

function initialize(){

    createUI();
    getAnime();

}

function createUI(){

    var dropdown = document.getElementsByClassName("header-menu-dropdown header-profile-dropdown arrow_box")[0].childNodes[0];

    var button = dropdown.childNodes[0].cloneNode(true);

    console.log(button.innerHTML);

    button.innerHTML = "<a>Open All Anime Links</a>";
    button.addEventListener ("click", openAllLinks, false);

    dropdown.appendChild(button);



}

function getAnime(){

    var list = document.getElementsByClassName("js-categories-seasonal js-block-list list")[0].firstElementChild.firstElementChild.childNodes;

    for(var i =1;i<list.length;++i){
        var itemList = list[i].childNodes;

        if(itemList.length === 0) continue;

        var link = itemList[1].innerHTML;

        link = link.split('href="')[1];
        link = link.split('" id')[0];

        var splitLink = link.split("/");

        var name = splitLink[splitLink.length-1];

        if(check(name)){
            animeNames.push(name);
            animeLinks.push(link);
        }

    }

}



function check(name){

    if (animeNames === null || animeNames.length===0) return true;

    for(var i = 0; i< animeNames.length;++i){
        if(name.includes(animeNames[i])) return false;
    }

    return true;


}


function openAllLinks(){


    for(var i=0;i<animeLinks.length;++i){console.log(i); popUpCheck(window.open(animeLinks[i],'_blank'));}

}


function popUpCheck(window){

    if(!window || window.closed || typeof window.closed=='undefined') alert("Please ENABLE POP-UPS for this script to work");

}







initialize();