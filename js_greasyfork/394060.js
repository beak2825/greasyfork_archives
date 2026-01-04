// ==UserScript==
// @name         Tumblr Max Resolution Image Grabber
// @description  Grabs the maximum resolution for the images in the set
// @author       Binarystar
// @match        *.tumblr.com/post/*
// @run-at	 document-end
// @grant        GM_addStyle
// @version 0.0.2
// @namespace https://greasyfork.org/users/427125
// @downloadURL https://update.greasyfork.org/scripts/394060/Tumblr%20Max%20Resolution%20Image%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/394060/Tumblr%20Max%20Resolution%20Image%20Grabber.meta.js
// ==/UserScript==

//script only works on the images in an actual post (ex:https://knaiifu.tumblr.com/post/189790583347/roses), a limitation of tumblr's recent backend changes, but in exchange we get upgraded from 1280 to 2048 resolution
//the image urls of new images uploaded now are stored html of the post at <meta property="og:image" content="(url to largest image size avaiable)">
//note: this script triggers pop-up blockers when opening multiple images at once so it works better if you allow tumblr to show pop-ups

function openTabs(urls) {
    for (let url of urls){
        window.open(url);
    }
}

GM_addStyle ( `
    #myContainer {
        position:   absolute;
        top:        65px;
        right:      0;
        font-size:  16px;
        background: #777
        border:     3px outset black;
        margin:     0;
        z-index:    1100;
        padding:    5px 20px;
    }
    #linkyOpener {
        cursor:     pointer;
    }
` );

let pic_urls = [];
let pic_elements = document.querySelectorAll('[property="og:image"]');
if (pic_elements.length > 0) {
    //button code from https://stackoverflow.com/questions/6480082/add-a-javascript-button-using-greasemonkey-or-tampermonkey
    var zNode       = document.createElement ('div');
    zNode.innerHTML = '<button id="linkyOpener" type="button">'
                + 'Grab Images</button>';
    zNode.setAttribute ('id', 'myContainer');
    document.body.appendChild (zNode);

	for (const e of pic_elements) {
        pic_urls.push(e.getAttribute('content'));
    }
}

document.getElementById('linkyOpener').onclick = function(){ openTabs(pic_urls); }