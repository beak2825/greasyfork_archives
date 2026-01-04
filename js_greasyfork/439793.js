// ==UserScript==
// @name        z0r.de flash downloader
// @namespace   Violentmonkey Scripts
// @match       https://z0r.de/*
// @grant       none
// @version     0.1
// @license     The Unlicense
// @author      ImpatientImport
// @description Download flash (SWF) files on z0r.de
// @downloadURL https://update.greasyfork.org/scripts/439793/z0rde%20flash%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/439793/z0rde%20flash%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
  window.addEventListener("load", function () {
    
    // gets the flash src, ex.: ../L/z0r-de_3045.swf
    var flashelem = document.querySelector("#player").src;
    
    var dlbutton_loc = document.querySelector("#flash");
        
    //downloads flash file
    var url = flashelem;
    var flash_dlbutton = document.createElement('a');
    flash_dlbutton.innerText = "Download SWF file";
    
    flash_dlbutton.href = url;
    flash_dlbutton.download = url;
    flash_dlbutton.id="downloadAnchor";
    document.body.appendChild(flash_dlbutton);
    $('#downloadAnchor').click();
    
    //button styles to add
    const dlbutton_styles = {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "5px",
        textAlign:"center",
        color:"white",
        fontWeight:"bolder",
        borderColor:"white",
        borderStyle:"solid",
        borderRadius:"5px",
        backgroundColor:"black",
      
    }
    
    Object.assign(flash_dlbutton.style, dlbutton_styles);
    
    //places download button before previous, random, and next links
    var dlbutton_padding = document.getElementById("unten");
    var brtag = document.createElement("br");
    dlbutton_padding.insertBefore(brtag, dlbutton_padding.childNodes[0])
    dlbutton_padding.insertBefore(flash_dlbutton, dlbutton_padding.childNodes[0])
                                       
    }, false)
  
})();

/* Reference(s):
 * https://stackoverflow.com/questions/3749231/download-file-using-javascript-jquery/68483491#68483491
 */