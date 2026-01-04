// ==UserScript==
// @name         No Japanese
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hide all japanese contents shown in youtube recommend videos
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/443044/No%20Japanese.user.js
// @updateURL https://update.greasyfork.org/scripts/443044/No%20Japanese.meta.js
// ==/UserScript==

(async function () {
    await deleteFunc();
})();
async function deleteFunc()
{
    for(var i = 0;;i++)
    {
        try
        {
            var videoRecommonded = $("ytd-compact-video-renderer");
            if(videoRecommonded.length > 2)
            {
                var lables = videoRecommonded.find("#video-title");
                lables.each((index,item)=>{
                    if(containsJapanese($(item).attr("title")))
                    {
                        $(videoRecommonded[index]).hide();
                    }
                });
                console.log("finished");
            }
            await sleep(1000);
        }
        catch
        {
        }
    }
}
async function sleep(sec)
{
    return new Promise((r,j)=>{
        setTimeout(()=>{
            r();
        },sec);
    });
}
function containsJapanese(input) {
    return some(input, isJap);
}
function isJap(ch) {
    return (ch >= "\u4e00" && ch <= "\u9faf") ||
        (ch >= "\u3400" && ch <= "\u4dbf") || (ch >= "\u3040" && ch <= "\u309f") || (ch >= "\u30a0" && ch <= "\u30ff");
}

function some(str, callback) {
    return Array.prototype.some.call(str, callback);
}