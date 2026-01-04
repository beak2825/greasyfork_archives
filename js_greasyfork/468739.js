// ==UserScript==
// @name         WideScreen Chat
// @version      1.95
// @description  Full WideScreen Chat
// @author       Florentinity
// @match        https://character.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @namespace https://greasyfork.org/users/1100373
// @downloadURL https://update.greasyfork.org/scripts/468739/WideScreen%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/468739/WideScreen%20Chat.meta.js
// ==/UserScript==
(function() {
    function WideScreen()
    {
        var Chat

        if(document.getElementsByClassName("overflow-x-hidden overflow-y-scroll px-1 flex flex-col-reverse min-w-full z-0 hide-scrollbar").item(0) != null)
        {
            Chat = document.getElementsByClassName("overflow-x-hidden overflow-y-scroll px-1 flex flex-col-reverse min-w-full z-0 hide-scrollbar").item(0).children
        } else {
            Chat = document.getElementsByClassName("overflow-x-hidden overflow-y-scroll px-1 flex flex-col-reverse min-w-full z-0").item(0).children
        }

    for(var i = 0; i < Chat.length; i++)
    {
        Chat.item(i).style = "min-width:100%"
        if(Chat.item(i).children.item(0).children.item(1) != null){
        Chat.item(i).children.item(0).children.item(1).children.item(1).style = "min-width:85%"
        Chat.item(i).children.item(0).children.item(1).children.item(1).children.item(0).style = "min-width:100%"
        Chat.item(i).children.item(0).children.item(1).children.item(1).children.item(0).children.item(0).style = "min-width:100%"
        document.getElementsByClassName("flex flex-col max-w-2xl items-center w-full").item(0).style = "min-width:100%"
        document.getElementsByClassName("flex flex-col max-w-2xl items-center w-full").item(0).children.item(0).style = "min-width:100%"
            if(document.getElementsByClassName("mt-1 max-w-xl rounded-2xl px-3 min-h-12 flex justify-center py-3 bg-surface-elevation-2 opacity-85").item(0) != null)
            {
                document.getElementsByClassName("mt-1 max-w-xl rounded-2xl px-3 min-h-12 flex justify-center py-3 bg-surface-elevation-2 opacity-85").item(0).style = "min-width:100%"
                document.getElementsByClassName("mt-1 max-w-xl rounded-2xl px-3 min-h-12 flex justify-center py-3 bg-surface-elevation-2 opacity-85").item(0).children.item(0).style = "min-width:100%"
            }
        }
    }
    }
    setTimeout(() => { setInterval(WideScreen, 500) }, 1000);
})();