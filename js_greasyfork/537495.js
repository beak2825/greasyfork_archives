// ==UserScript==
// @name         YT Delister
// @version      1.0.0
// @description  Play video from playlist as a single video
// @author       Bartek
// @match        https://www.youtube.com/playlist?list=*
// @namespace    https://greasyfork.org/users/30602
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/537495/YT%20Delister.user.js
// @updateURL https://update.greasyfork.org/scripts/537495/YT%20Delister.meta.js
// ==/UserScript==

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
    if(document.querySelector('#video-title')) {
        observer.disconnect();
        run();
    }
}

function getElementsById(elementID)
{
    var elementCollection = new Array();
    var allElements = document.getElementsByTagName("*");
    for(var i = 0; i < allElements.length; i++)
    {
        if(allElements[i].id == elementID)// || allElements[i].id == "thumbnail")
        {
            elementCollection.push(allElements[i]);
        }
    }
    return elementCollection;
}

function run()
{
    var entries = getElementsById("video-title");
    console.log(entries.length);
    console.log(document.getElementById("video-title"));

    for(var i = 0; i < entries.length; i++)
    {
        var link = entries[i].href;
        if(link !== null)
        {
            var position = link.search("list=");
            if(position != -1)
            {
                link = link.substring(0, position - 1);
                entries[i].setAttribute('href', link);
                entries[i].setAttribute('baseURI', link);
                //entries[i].innerHTML=link;
                console.log(entries[i])
            }
        }
    }
}
