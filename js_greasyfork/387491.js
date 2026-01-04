// ==UserScript==
// @name         AniList MultiTitle Display
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds the non-primary titles to the title display.
// @author       Bane
// @match        https://anilist.co/anime/*
// @match        https://anilist.co/manga/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387491/AniList%20MultiTitle%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/387491/AniList%20MultiTitle%20Display.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

function GetTitles(jnode)
{
    console.log("Getting AniTitles!");

    //The already existing title
    var aniTitle = document.querySelector("#app > div.page-content > div > div.header-wrap > div.header > div.container > div.content > h1")
    aniTitle.innerHTML = aniTitle.innerText; //Replace the HTML with the innerText cuz it's neater

    var oldTitle = aniTitle.innerText; //Store the user preference
    var oldTitle2 = aniTitle.innerHTML; //Double store because weirdness in some titles, discovered thanks to https://anilist.co/anime/97634/
    aniTitle.innerHTML += "</br></br>" //Add line breaks to separate the preference from the others

    //var sets = jnode;
    var sets = document.getElementsByClassName("data-set"); //Searched all the data values on the sidebar

    var title = ""; //Creates empty title string for later

    //The types we are looking to add
    var types = ["Romaji", "English", "Native", "Synonyms"];

    SetTitles();

    function SetTitles()
    {
        for(var i = 0; i < sets.length; i++)
        {
            //Get the type we are looking at in the loop
            var typeCheck = sets[i].getElementsByClassName("type")[0].innerText;

            //If the type is in our wanted types...
            if(types.indexOf(typeCheck) > -1)
            {
                //...continue and add it to the title.
                console.log("Right Ani type found");
                AddTitle(i);
            }
        }
    }

    function AddTitle(i)
    {
        title = sets[i].getElementsByClassName("value")[0].innerHTML; //Get the text from the value.
        title = title.replace(/ +/g, " "); //Removes double spaces (for some reason there's a few, such as at https://anilist.co/anime/98448/)

        if(!(title == oldTitle || title == oldTitle2)) //If the title is NOT the same as the user preference one...
        {
            //...add it.
            aniTitle.innerHTML += title + "</br>";
        }
    }
}

waitForKeyElements("div.sidebar", GetTitles);