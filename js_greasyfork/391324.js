// ==UserScript==
// @name         Random Link Follower
// @description  This userscript follows random links after a specified delay (Variable delaySeconds). It is intended to be used in conjunction with my Internet Archive Saver script (But keep in mind: Internet Archive will maybe ban your IP if you save too much pages in little time). However, it can also be used for fun, to see where the links take you.
// @namespace    https://greasyfork.org/de/users/160920-flo-pinguin
// @author       FloPinguin
// @icon         https://i.ibb.co/gth30Hk/random-1294119.png
// @version      1.0
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/391324/Random%20Link%20Follower.user.js
// @updateURL https://update.greasyfork.org/scripts/391324/Random%20Link%20Follower.meta.js
// ==/UserScript==
 
var delaySeconds = 15;
 
setTimeout(function(){
    openLink(document.querySelectorAll("a[href]"));
}, delaySeconds * 1000);
 
setTimeout(function(){
    window.history.back();
}, delaySeconds * 3 * 1000);
 
function openLink(linkElements){
    if (linkElements.length) {
        var linkElement = linkElements[getRandomInt(0, linkElements.length - 1)];
        var link = linkElement.getAttribute('href');
 
        if (link != "" && !link.includes("#") && !link.includes(".xml")){
            GM_xmlhttpRequest({
                method: 'GET',
                url: link,
                onload: function(data){
                    if (data.status == 200 && data.responseText.includes('<a') && data.responseText.includes(' href')){
                        console.log("Suitable link found! Redirection to " + link);
                        location.href = link;
                    }else{
                        console.log(link + " doesn't fit the requirements. Looking for a better link...");
                        openLink(linkElements);
                    }
                },
                onerror: function(){
                    console.log("Failed to load " + link + ". Looking for another link...");
                    openLink(linkElements);
                }
            });
        }else{
            console.log("Link " + link + " is invalid. Looking for another one...");
            openLink(linkElements);
        }
    }else{
        console.error("Random Link Follower: No link found!");
        window.history.back();
    }
}
 
function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}