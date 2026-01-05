// ==UserScript==
// @name        GFY Photo Captions
// @namespace   murklins.talkoncorners.net
// @description On Go Fug Yourself slideshows, move the photo captions to the right sidebar.
// @include     http://www.gofugyourself.com/photos/*
// @version     2
// @grant       GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/25526/GFY%20Photo%20Captions.user.js
// @updateURL https://update.greasyfork.org/scripts/25526/GFY%20Photo%20Captions.meta.js
// ==/UserScript==

// get all the divs we care about
var rightColDiv    = document.querySelector ("div.gallery-holder > div.fullscreen-right-col");
var adDiv = document.querySelector ("div.gallery-holder > div.fullscreen-right-col > div.right-col-ad");
var infoTitleDiv  = document.querySelector ("div.gallery-info > div.info-col-holder > div.info-col > div.slide-info-holder > h2");
var infoContentsDiv  = document.querySelector ("div.gallery-info > div.info-col-holder > div.info-col > div.slide-info-holder > div.description");

infoTitleDiv.id = "GM_infoTitleDiv";
infoContentsDiv.id = "GM_infoContentsDiv";
infoTitleDiv.remove();
infoContentsDiv.remove();

rightColDiv.insertBefore(infoContentsDiv, adDiv);
rightColDiv.insertBefore(infoTitleDiv, infoContentsDiv);

GM_addStyle( "                                     \
    .gallery-holder .fullscreen-left-col {margin: 0 500px 0 0!important;} \
    .gallery-holder .fullscreen-right-col {width: 500px!important;} \
    .gallery-info {margin-right: 500px!important;} \
    .gallery-holder .fullscreen-right-col .fullscreen-arrow-holder .xofy {display: inline!important;} \
    .gallery-holder .arrows-buttons {display: inline!important; margin-left: 10px!important;} \
    .gallery-holder .full-story {padding: 10px 0 5px 0px!important;} \
    .gallery-holder .full-story .image-holder {display: none!important;} \
    .gallery-holder .full-story h5 {font-size: 15px!important;} \
    .gallery-holder .full-story h4 {display: none!important;} \
    .gallery-holder .fullscreen-right-col .fullscreen-arrow-holder .gallery-arrow {font-size: 15px!important; line-height: 25px!important;} \
    .gallery-holder .fullscreen-right-col .fullscreen-arrow-holder {padding: 6px 5px!important;} \
     h2#GM_infoTitleDiv {line-height: 20px!important; margin: 5px 10px 5px 10px!important; padding-top:0!important;} \
     h2#GM_infoTitleDiv span {font-size: 16px!important; line-height: auto!important;} \
     #GM_infoContentsDiv {margin: 5px 10px 20px 10px!important; overflow-y: scroll!important; min-height: 50px!important; max-height: 150px!important;} \
     #GM_infoContentsDiv p {font-size: 16px!important; line-height: 20px!important;} \
     "
     );



