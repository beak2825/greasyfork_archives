// ==UserScript==
// @name         黑料
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  黑
// @author       You
// @match        https://zztt**.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zztt55.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463554/%E9%BB%91%E6%96%99.user.js
// @updateURL https://update.greasyfork.org/scripts/463554/%E9%BB%91%E6%96%99.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Your code here...





    var stylee = document.createElement("style");
    stylee.type = "text/css";
    var sHtml = `
.fill-img{
max-height:80vh
}

html body .layout-default{
max-width: 960px;
}

html body .video-list .video-item-img .title{
font-size:22px;
letter-spacing:2px;
font-weight:400;
}

* * * img {
    max-height: 80vh;

    object-fit: scale-down;
}



html body .layout-default .video-item-img {
display:flex;
align-items:center;
justify-content:center;

}

html body .layout-default .video-item-img .title{
border-radius:8px;
padding:8px;
background-color:black;
height:initial;
width:initial;
    font-size: 24px;
    transform: translateY(-140px);
}



html body .layout-default .video-item-img .placeholder-img   ,  html body .layout-default .video-item-img   ,    html body .layout-default .video-item-img         .fill-img{
max-height:40vh;
min-height:40vh;
object-fit:contain
}



html body .layout-default .video-item {
margin-top:20px;
}


.main.container  .dplayer{

height:80vh;
}

        `;
    stylee.innerHTML = sHtml;
    document.getElementsByTagName("head").item(0).appendChild(stylee);

})();