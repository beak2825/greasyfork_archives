// ==UserScript==
// @name         TBD Auto Complete Stickers And Shout Usernames
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2025-08-05
// @description  Will auto fill the shout username and some emojies
// @author       DarkerKnight
// @match        https://*.torrentbd.com/*
// @match        https://*.torrentbd.net/*
// @match        https://*.torrentbd.org/*
// @match        https://*.torrentbd.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torrentbd.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544803/TBD%20Auto%20Complete%20Stickers%20And%20Shout%20Usernames.user.js
// @updateURL https://update.greasyfork.org/scripts/544803/TBD%20Auto%20Complete%20Stickers%20And%20Shout%20Usernames.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("keydown", function(event){
        if(event.key === "Tab"){
            event.preventDefault();
            let shoutInputBox = document.activeElement;
            if (
                shoutInputBox.tagName == 'TEXTAREA' ||
                (shoutInputBox.tagName == 'INPUT' && shoutInputBox.type === 'text')
            ) {
                let typedText = shoutInputBox.value;
                let words = typedText.split(" ")
                let lastWord = words[words.length - 1].toLowerCase()

                // username auto complete
                if(shoutInputBox.id === "shout_text"){

                    let myShoutContainer = document.querySelector("#shouts-container")
                    let shoutUsers = myShoutContainer.querySelectorAll("div.shout-item span.shout-user span.tbdrank")


                    shoutUsers.forEach(user=>{
                        if(user.innerText.toLowerCase().startsWith(lastWord) && typedText !==""){
                            words[words.length - 1] = "@" + user.innerText
                            shoutInputBox.value = words.join(" ")
                        }
                    })
                }




                // sticker and emoji auto complete
                // they should maintain order!
                const typedWord = ["hi",
                                   "hello",
                                   "no",
                                   "nahi",
                                   "sad",
                                   "lmao",
                                   "justsaid",
                                   "wow",
                                   "lol",
                                   "why",
                                   "ty",
                                   "slap",
                                   "wont",
                                   "bruh",
                                   "yay",
                                   "aww",
                                  ];
                const fullText = [":hello",
                                  ":hello",
                                  ":negative",
                                  ":sticker-mb-no",
                                  ":sticker-pepe-face",
                                  ":lmao",
                                  ":justsaid",
                                  ":sticker-omg-wow",
                                  ":sticker-jjj-laugh",
                                  ":sticker-cat-why",
                                  ":thankyou",
                                  ":slap",
                                  ":sticker-sr-no",
                                  ":sticker-facepalm",
                                  ":yepdance",
                                  ":sticker-pepe-aw",
                                 ];
                let mapping = Object.fromEntries(typedWord.map((word, index) => [word, fullText[index]]));
                if(mapping.hasOwnProperty(lastWord)){
                    words[words.length - 1] = mapping[lastWord]
                    shoutInputBox.value = words.join(" ")
                }

            }

        }
    })


})();
