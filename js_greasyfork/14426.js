// ==UserScript==
// @name        EXE Theme: EXE [Roji]
// @description An EXE Classic theme, restored for use on BN Nostalgia
// @namespace   EXE Nostalgia Skin - Roji
// @include     http://s15.zetaboards.com/EXE_Nostalgia/*
// @include     http://s7.zetaboards.com/MegaManExeRPG/*
// @version     1
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/14426/EXE%20Theme%3A%20EXE%20%5BRoji%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/14426/EXE%20Theme%3A%20EXE%20%5BRoji%5D.meta.js
// ==/UserScript==

function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}
 
loadjscssfile("http://z4.ifrm.com/30571/170/0/p1089157/exe_wired.css", "css")