// ==UserScript==
// @name         AnimeStars Clan Styler
// @namespace    animestars
// @author       LedFox
// @version      6
// @description  just comfortable style
// @match        https://astars.club/clubs/boost/*
// @match        https://asstars1.astars.club/clubs/boost/*
// @match        https://animestars.org/clubs/boost/*
// @match        https://as1.astars.club/clubs/boost/*
// @match        https://asstars.tv/clubs/boost/*
// @grant        none
// @license      LedFox
// @downloadURL https://update.greasyfork.org/scripts/540879/AnimeStars%20Clan%20Styler.user.js
// @updateURL https://update.greasyfork.org/scripts/540879/AnimeStars%20Clan%20Styler.meta.js
// ==/UserScript==

(function() {

    var image = document.getElementsByClassName("club-boost__image")[0];
    var inners = document.getElementsByClassName("club-boost__inner");
    var userList = document.getElementsByClassName("tabs")[0];
    var club = document.getElementsByClassName("club-boost")[0];


    club.prepend(image);
    inners[0].style.display = "grid";
    inners[0].style.gridTemplateRows = "100px 300px";
    inners[0].parentElement.style.marginTop = "55px";
    image.style.marginTop = "55px";
    inners[0].parentElement.after(userList);

    club.style.display = "grid";
    club.parentElement.style.width = "100%"
    club.style.gridTemplateColumns = "150px 550px 400px";
    club.style.gap = "10px"
    document.getElementsByClassName("secondary-title")[0].style.display = "none";

    if(inners.length === 4){

        document.getElementsByClassName("button button--block")[0].style.display = "none";

        inners[1].append(document.getElementsByClassName("boost-limit")[0].parentElement);

        var cardChange = document.getElementsByClassName("club-boost__change")[0];
        document.getElementsByClassName("button button--primary club__boost-btn")[0].parentElement.parentElement.append(cardChange);
        cardChange.style.display = "grid";
        cardChange.style.gridTemplateColumns = "50px 40px";

        var ownersList = document.getElementsByClassName("club-boost__owners-list")[0];
        ownersList.style.display = "grid";
        ownersList.style.gridTemplateColumns = "30px 30px 30px 30px 30px 30px 30px 30px 30px 30px 30px 30px 30px";
        ownersList.style.gap = "3px";

        inners[0].parentElement.parentElement.append(inners[0]);

        inners[0].parentElement.append(inners[3]);
        inners[0].parentElement.append(inners[2]);
    }else{
        inners[0].parentElement.append(inners[1]);
        inners[0].parentElement.append(inners[2]);
    }




})();