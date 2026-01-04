// ==UserScript==
// @name        Clean WeTransfer/Smash With Bing Background
// @namespace   WT
// @description Get the Bing Background image on WeTransfer
// @match       *://wetransfer.com/*
// @match       *://we.tl/*
// @match       *://*.fromsmash.com/*
//
// @version     2.0.0
// @author      SioGabx / PXL Carpets
// @grant       GM_xmlhttpRequest
// @icon        https://i.ibb.co/pntBGWq/we.png
// @connect     bing.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481935/Clean%20WeTransferSmash%20With%20Bing%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/481935/Clean%20WeTransferSmash%20With%20Bing%20Background.meta.js
// ==/UserScript==

// project url : https://greasyfork.org/en/scripts/481935/
//PXL Carpets original code : https://greasyfork.org/fr/scripts/30158-wetransfer
function WeTransfer(css) {
    let head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
var r = document.querySelector(':root');

function GetImageURL(ans) {
    var suffix = ans.images[0].url
    r.style.setProperty('--background-sio-fix', 'url("http://bing.com/' + suffix + '"');
}
function getImage(){
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1",
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            var ans = JSON.parse(response.responseText);
            GetImageURL(ans);
        }
    });
}

getImage();
WeTransfer(
    `
    body,.container-background-image,.content-image-background {
    background-color: #000 !important;
    background-image:var(--background-sio-fix)!important;
    background-size: cover!important;
    }
    
    .wallpaper, .nav__label {
    pointer-events: none !important;
    opacity: .8 !important;
    }
    
    #wallpaper-container * {
    display: none;
    }
    
    iframe {
    display: none;
    }
    
    .wp-wrapper,.app,.application,div[data-testid=wallpaper-container]  {
    background-color: transparent !important;
    }

    video{
    visibility:hidden
    }
    `
);