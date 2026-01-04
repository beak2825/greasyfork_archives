// ==UserScript==
// @name     VG.no rights management tutorial
// @description   Adds tutorial video for data rights management
// @include  http*://vg.no*
// @include http*://www.vg.no*
// @grant    GM_addStyle
// @run-at   document-end
// @version 0.0.1.20210806103335
// @namespace https://greasyfork.org/users/761474
// @downloadURL https://update.greasyfork.org/scripts/430420/VGno%20rights%20management%20tutorial.user.js
// @updateURL https://update.greasyfork.org/scripts/430420/VGno%20rights%20management%20tutorial.meta.js
// ==/UserScript==

const datarettighetertut=document.createElement("img")
datarettighetertut.id="svevende-video"
datarettighetertut.src="https://i.redd.it/vu2m9ialapf71.gif"
document.body.append(datarettighetertut)
datarettighetertut.addEventListener("click",()=>{datarettighetertut.classList.toggle("liten")})


GM_addStyle ( `
 #svevende-video {
   position:absolute;
   top: 5px;
   right: 5px;
   z-index:10001;
 }

 #svevende-video:hover{
   opacity:0.3;
   border:1px red solid;
 }
 .liten{
   width:20%;
 }
`);