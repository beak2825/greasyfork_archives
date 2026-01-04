// ==UserScript==
// @name         Block Admin/Mod Posts
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Block Admin/Mod posts on resetera [default on, no exclusions]. Option to block quotes of the posts [default on], and option to remove posts that contains quotes of them entirely [default off]. All will respect exclude list defined.
// @author       You
// @match        https://www.resetera.com/threads/*
// @icon         https://www.google.com/s2/favicons?domain=resetera.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427873/Block%20AdminMod%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/427873/Block%20AdminMod%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var removeModPosts = true;
    var removeAdminPosts = true;

    var removeQuotesOfMods = true;
    var removeQuotesOfAdmins = true;

    var removePostsThatContainsModQuote = false;
    var removePostsThatContainsAdminQuote = false;

    //{"a", "b", "c", ...}, where they are username of mod to keep posts of, [] to remove all
    var modExcludeList = []
    var adminExcludeList = []

    var adminList = ["AliceAmber", "B-Dubs", "ColdSun", "Delphine", "Hecht", "JayC3", "Nepenthe", "Poodlestrike", "Redcrayon", "The Woods", "Transistor"]
    var moderatorList = ["bunkitz", "cvxfreak", "deimosmasque", "Fairy Godmother", "FelipeMGM", "FliXFantatier", "ghostcrew", "In Amber Clad", "Jawmuncher", "Judge", "K.Jack", "Kaitos", "Lonestar", "Minaret", "Morrigan", "NeonZ", "nihilence", "Pandora012", "Pau", "plagarize", "Queen Vulpix", "Quinton", "RatskyWatsky", "Sentry", "Serpens007", "Sheng Long", "shiba5", "ShyMel", "Slayven", "Snormy", "spider", "Syder", "Tavernade", "The Artisan", "The Bear", "wandering"]

    // Your code here...
    var elements = document.getElementsByClassName("message   message--post     js-post js-inlineModContainer   ")
    var removeList = [];
    for(var i = 0; i < elements.length; i++)
    {
        var currentElement = elements.item(i);
        if((removeQuotesOfMods || removeQuotesOfAdmins || removePostsThatContainsAdminQuote || removePostsThatContainsModQuote) && currentElement.getElementsByTagName("blockquote").length > 0)
        {
            var quotes = currentElement.getElementsByTagName("blockquote")
            var alreadyRemoved = false;
            for(var q = 0; q < quotes.length; q++)
            {
                if(quotes.item(q).getElementsByClassName("bbCodeBlock-title").length > 0)
                {
                    var username = quotes.item(q).getElementsByClassName("bbCodeBlock-title")[0].innerText.replace(" said:", "")
                    if((removeQuotesOfMods || removePostsThatContainsModQuote) && moderatorList.includes(username) && !modExcludeList.includes(username))
                    {
                        if(removeQuotesOfMods)
                        {
                            quotes.item(q).remove()
                        }
                        if(removePostsThatContainsModQuote)
                        {
                            alreadyRemoved = true;
                            removeList.push(i)
                        }
                    }
                    if((removeQuotesOfAdmins || removePostsThatContainsAdminQuote) && adminList.includes(username) && !adminExcludeList.includes(username))
                    {
                        if(removeQuotesOfAdmins)
                        {
                            quotes.item(q).remove()
                        }

                        if(removePostsThatContainsAdminQuote && !alreadyRemoved)
                        {
                            alreadyRemoved = true;
                            removeList.push(i)
                        }
                    }
                }
            }
        }
        if (removeModPosts && !alreadyRemoved && currentElement.getElementsByClassName("userBanner userBanner userBanner--silver message-userBanner").length == 1)
        {
            if(modExcludeList.length == 0)
            {
                removeList.push(i)
            }
            else if(!modExcludeList.includes(currentElement.getAttribute("data-author")))
            {
                removeList.push(i)
            }
        }
        else if (removeAdminPosts && !alreadyRemoved && currentElement.getElementsByClassName("userBanner userBanner userBanner--accent message-userBanner").length == 1)
        {
            var bannerText = currentElement.getElementsByClassName("userBanner userBanner userBanner--accent message-userBanner")[0].innerText
            if(bannerText.includes("Admin") || bannerText.includes("General Manager"))
             {
                 if(adminExcludeList.length == 0)
                 {
                     removeList.push(i)
                 }
                 else if (!adminExcludeList.includes(currentElement.getAttribute("data-author")))
                 {
                     removeList.push(i)
                 }
             }
        }
    }

    for(var j = removeList.length; j > 0; j--)
    {
        elements.item(removeList[j-1]).remove()
    }
})();