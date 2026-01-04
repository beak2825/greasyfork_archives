// ==UserScript==
// @name         Roblox Game Blacklist
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Lets you blacklist certain games based on their names
// @author       crapbass
// @match        https://www.roblox.com/discover*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474836/Roblox%20Game%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/474836/Roblox%20Game%20Blacklist.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function remGames(){
        setTimeout(remGames, 500);
        Array.from(thing).forEach(function (element) {
            var title = element.getAttribute("title")
            if (title != null) {
                for (var i = 0; i < blacklistfilter.length; i++) {
                    var find = blacklistfilter[i]
                    if (find.startsWith("regex:")) {
                        let regex = new RegExp(find.replace("regex:",""))
                        if (regex.test(title)) {
                            element.style.display = 'none'
                        }
                    } else if (find == "*emoji") {
                        const EmojiRegexExp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
                        let regex = new RegExp(EmojiRegexExp)
                        if (regex.test(title)) {
                            element.style.display = 'none'
                        }
                    } else if (find.startsWith("insensitive:")) {
                        if (title.toLowercase().includes(find.toLowercase().replace("insensitive:",""))) {
                            element.style.display = 'none'
                        }
                    } else if (title.includes(find)) {
                        element.style.display = 'none'
                    }
                }
            }
        });
    }
    window.editBlacklist = function() {
        try {
            var value = JSON.parse(localStorage["BlacklistStrings"]);
        } catch {
            console.log("oopsies!!! no blacklist strings saved yet")
        }
        var input = prompt("Text seperated with commas (example: simulator,OHIO)",value)
        if (input == null) {
            return;
        }
        localStorage["BlacklistStrings"]=JSON.stringify(input);
    }
    function doThing() {
        try {
            var blacklistfilterstring = JSON.parse(localStorage["BlacklistStrings"]);
        } catch {
            console.log("oopsies!!! no blacklist strings saved yet")
            blacklistfilterstring = ""
        }
        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
        window.blacklistfilter = blacklistfilterstring.split(",");
        console.log(blacklistfilter)
        window.thing = document.getElementsByClassName("list-item game-card game-tile")
        var navbar = document.querySelector("#navigation > div > div.simplebar-wrapper > div.simplebar-mask > div > div > div > ul")
        var blacklisteditor = document.createElement("li")
        blacklisteditor.setAttribute("class", "rbx-upgrade-now")
        blacklisteditor.innerHTML = "<a onclick='window.editBlacklist()' href='javascript:void(0);' class='btn-growth-md btn-secondary-md' id='blacklist-button'>Blacklist Editor</a>"
        navbar.appendChild(blacklisteditor);
        remGames();
    }
    setTimeout(doThing, 2000)
})();