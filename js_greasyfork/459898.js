// ==UserScript==
// @name          Anti Youtube Shorts in inoreader
// @namespace     Anong0u0
// @version       0.1
// @description   try to hide YT Shorts in inoreader
// @author        Anong0u0
// @match         https://www.inoreader.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=inoreader.com
// @require       https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @grant         GM_xmlhttpRequest
// @connect       youtube.com
// @license       Beerware
// @downloadURL https://update.greasyfork.org/scripts/459898/Anti%20Youtube%20Shorts%20in%20inoreader.user.js
// @updateURL https://update.greasyfork.org/scripts/459898/Anti%20Youtube%20Shorts%20in%20inoreader.meta.js
// ==/UserScript==

Node.prototype.getParentElement = function(times = 0){let e=this;for(let i=0;i<times;i++)e=e.parentElement;return e;}

const isShorts = (vid) =>
{
    return new Promise((reslove) =>
    {
        const url = `https://www.youtube.com/shorts/${vid}`;
        GM_xmlhttpRequest(
        {
            method: "head",
            url: url,
            onload: (e) => reslove(e.finalUrl == url)
        });
    })
}

document.arrive("a.article_title_link[href^='https://www.youtube.com']", async (e) =>
{
    const vid = e.href.split("v=")[1].split("&")[0],
          iss = await isShorts(vid);
    //console.log(vid, iss)
    if (iss)
    {
        e.getParentElement(3).remove();
    }
})
//console.log(isShorts("zXmfvYeFViY"))