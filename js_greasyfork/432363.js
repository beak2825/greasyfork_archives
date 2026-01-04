// ==UserScript==
// @name        Youtube Bulk Favs Remover
// @namespace   https://greasyfork.org/en/users/815116-dag7
// @include     https://*.youtube.com/playlist?list=LL
// @grant       none
// @version     1.0
// @author      Dag7
// @description   Youtube Bulk Favs Remover - Have you ever wondered to remove all your favourite videos but you weren't able to find a solution? Yt-favs-remover is a script that helps to remove all your favourited videos from your favs playlist by simply clicking a button. Enjoy!
// @esversion   6
// @downloadURL https://update.greasyfork.org/scripts/432363/Youtube%20Bulk%20Favs%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/432363/Youtube%20Bulk%20Favs%20Remover.meta.js
// ==/UserScript==

/** 
 * Youtube Bulk Like Remover
 */

// creating button
var btn_delete_liked = document.createElement("BUTTON");
var txt_delete_liked = document.createTextNode("Unlike all videos");
btn_delete_liked.style.border="solid 1px gray";
btn_delete_liked.style.padding="5px";
btn_delete_liked.style.marginRight="5px";
btn_delete_liked.style.background="none";
btn_delete_liked.style.cursor="pointer";
btn_delete_liked.appendChild(txt_delete_liked);
document.querySelector("#end").prepend(btn_delete_liked)

btn_delete_liked.onclick = main;

async function main() {
    // delay after video gets deleted from like playlist
    var SCROLL_DELAY = 5000     // this value depends on connection speed, your machine, your browser: they could be really slow; high value -> high chances to run the script just once  
    var DELETION_DELAY = 500

    var runDelayed = (fn, delay) => new Promise((resolve, reject) => {
        setTimeout(() => {
            fn()
            resolve()
        }, delay)
    })

    var prev_val=0
    var videos=[]

    // show unavailable videos
    var unavailable=Array.from(document.getElementsByTagName("ytd-menu-renderer"))  // get three dots
    unavailable[0].children[1].click();      // click three dots
    await runDelayed(() => {
        // click "show unavailable videos"
        unavailable=document.querySelector("#items > ytd-menu-navigation-item-renderer > a > tp-yt-paper-item > yt-formatted-string")
        if(unavailable !== null) {
            unavailable.click()
        }
    }, DELETION_DELAY)


    // enum total videos number 
    do {
        prev_val=Array.from(document.getElementsByTagName("ytd-playlist-video-renderer")).length

        await runDelayed(() => {
            var scrollable = document.querySelector("body > ytd-app")
            scrollable.scrollIntoView(false);

            // Get the channel list; this can be considered a row in the page.
            videos = Array.from(document.getElementsByTagName("ytd-playlist-video-renderer"));
        }, SCROLL_DELAY);
        console.log(`Counting videos... ${videos.length}`);
    } while(prev_val !== videos.length);

    // Get the videos list
    console.log(`${videos.length} videos found.`)

    for (const video of videos) {
        // click the invisible three-dots button
        video.querySelector("#button > yt-icon").click()
        await runDelayed(() => {
        
            // click "remove from this playlist", effectively no longer liking the video
            var theorical=document.querySelector("#items > ytd-menu-service-item-renderer:nth-child(4) > tp-yt-paper-item")
            if(theorical !== null) {
                theorical.click();
            }
            else {
                theorical=document.querySelector("#items > ytd-menu-service-item-renderer > tp-yt-paper-item > yt-formatted-string")
                if(theorical !== null) {
                    theorical.click();
                }
                else {
                    console.log("Can't remove this video.");
                }
            }
        }, DELETION_DELAY);
    }
}
