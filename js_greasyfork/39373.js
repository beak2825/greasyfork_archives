// ==UserScript==
// @name                Reddit Video Downloader
// @author              Berk "SAS41" Alyamach
// @homepage            https://github.com/sas41/
// @homepageURL         https://github.com/sas41/
// @description         A script to that allows you to download videos hosted on Reddit by pressing Ctrl+S or Meta+S on the comments section.

// @icon                https://github.com/sas41/RedditVideoDownloader/blob/master/icons/RVD_icon_32.png?raw=true
// @iconURL             https://github.com/sas41/RedditVideoDownloader/blob/master/icons/RVD_icon_32.png?raw=true
// @icon64URL           https://github.com/sas41/RedditVideoDownloader/blob/master/icons/RVD_icon_64.png?raw=true

// @copyright           2018, Berk (sas41) Alyamach - https://github.com/sas41/
// @license             MIT
// @grant               none

// @contributionAmount  €1.00
// @contributionURL     https://www.paypal.me/sas41/1

// @namespace           reddit
// @include             *://*reddit.com/r/*/*/*/*

// @supportURL          https://github.com/sas41/RedditVideoDownloader/issues
// @version             1.0.5
// @downloadURL https://update.greasyfork.org/scripts/39373/Reddit%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/39373/Reddit%20Video%20Downloader.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author              sas41
// @contributionAmount  €1.00
// @contributionURL     https://www.paypal.me/sas41/1
// ==/OpenUserJS==

var jsonLink = document.location.href.split('?')[0] + '.json';
var downloadLink = '';

function getJSON(url)
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function()
    {
        var status = xhr.status;
        if (status === 200)
        {
            var response = xhr.response;
            if (!response[0].data.children[0].data.secure_media.reddit_video.is_gif)
            {
                if(confirm('Unfortunately, Reddit doesn\'t support saving of audio along with the video, Download without audio?'))
                {
                    downloadLink = response[0].data.children[0].data.secure_media.reddit_video.fallback_url;
                    downloadURI(downloadLink,'');
                }
            }
            else
            {
                downloadLink = response[0].data.children[0].data.secure_media.reddit_video.fallback_url;
                    downloadURI(downloadLink,'');
            }
        }
        else
        {
            alert('Sorry, Download Failed');
        }
    };
    xhr.send();
}

function downloadURI(url, n)
{
    var save = document.createElement('a');
    save.href = url;
    save.download = n || url;
    
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save.dispatchEvent(event);

    try
    {
        document.body.removeChild(save);
    }
    catch(err){}
}

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey)
    {
        if (event.key === 's' || event.key === 'S' )
        {
            event.preventDefault();
            getJSON(jsonLink);
        }
    }
});