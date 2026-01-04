// ==UserScript==
// @name         Download Spotify Playlist art downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Downloads Spotify images on album pages.
// @author       crdhs 
// @match        https://open.spotify.com/playlist/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492669/Download%20Spotify%20Playlist%20art%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/492669/Download%20Spotify%20Playlist%20art%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function downloadImage(imageSrc)
    {
        const image = await fetch(imageSrc)
        const imageBlog = await image.blob()
        const imageURL = URL.createObjectURL(imageBlog)

        const link = document.createElement('a')
        link.href = imageURL
        link.download = 'image file name here'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    function downScript()
    {
        var metas = document.getElementsByTagName('meta');
        for(var i=0;i<metas.length;i++)
        {
            if(metas[i].hasAttribute('property') && metas[i].getAttribute('property') == "og:image")
            {
                downloadImage(metas[i].content);
                break;
            }
        }
    }

    setTimeout(downScript, 2000);
})();