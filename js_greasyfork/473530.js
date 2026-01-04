// ==UserScript==
// @name         Comment Section
// @namespace    magic
// @version      beta0.2
// @license MIT
// @description  <h1>PenguinMod comment section</h1><p>Its in beta so expect bugs.</p><p>Also you kinda need a penguinmod/scratch account if you want people to know who you are when commenting</p>
// @author       crafterboy27
// @match        https://studio.penguinmod.site/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=penguinmod.site
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473530/Comment%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/473530/Comment%20Section.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //author-info_username
     window.addEventListener('load', async function() {
         const urlParams = new URLSearchParams(window.location.search);
         for(var element of document.getElementsByTagName("div")){
             if(element.className.includes("interface_section") && element.innerHTML == "<p><span>PenguinMod is a mod of TurboWarp to add new blocks and features either in extensions or in PenguinMod's main toolbox. TurboWarp is a Scratch mod that compiles projects to JavaScript to make them run really fast. Try it out by choosing an uploaded project below or making your own in the editor.</span></p>"){
                 element.id = "commentSection"
                 // return element
             }
         }
         for(var eelement of document.getElementsByTagName("span")){
             if(eelement.className.includes("author-info_username")){
                 eelement.id = "username"
                 // return element
             }
         }
         setTimeout(()=>{
         document.getElementById("commentSection").innerHTML = `<div><p><b>Comment Section</b> for  <b>${document.title.replace(" - PenguinMod","")}</b> ( ${window.location.href.split("#")[1]} )</p></div><iframe src="https://penguinmod-comments.unluckycrafter.repl.co/?id=${window.location.href.replace("https://studio.penguinmod.site/#","")}&name=${localStorage.getItem("PM_PROJECTSTORAGE_EXT_pb+user")}" style="border:0px #ffffff none;" name="myiFrame" scrolling="no" frameborder="1" marginheight="0px" marginwidth="0px" height="400px" width="480px" allowfullscreen></iframe>`
         },100)

     }, false);
    

})();