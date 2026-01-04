// ==UserScript==
// @name         MangaDex Downloader - Gallery-dl
// @version      2.0.1
// @description  Batch download mangadex manga with Gallery-dl
// @author       Gondola#7671
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-idle
// @match        https://mangadex.org/*
// @compatible   firefox
// @compatible   chrome
// @namespace https://greasyfork.org/users/581457
// @downloadURL https://update.greasyfork.org/scripts/416674/MangaDex%20Downloader%20-%20Gallery-dl.user.js
// @updateURL https://update.greasyfork.org/scripts/416674/MangaDex%20Downloader%20-%20Gallery-dl.meta.js
// ==/UserScript==

//TODO: Fix input background when page resizes
(function() {



    // USER VARIABLES
    var language_filter = "en"


   GM_addStyle(" #gallery-dl { color: #fff; font-weight: 500; } #gallery-dl { background-color: #FF6740 !important; height: 40px; border-top-left-radius: 0.25rem; border-bottom-left-radius: 0.25rem; margin-right: 0px !important; transition: background-color .1s ease-out, color .1s ease-out; } #gallery-dl:hover { background-color: #cc5233 !important;; } #gallery-dl:active { background-color: #993e26 !important;; } .gallery-dl_input { background-color: #333333aa !important; width: 54px; height: 40px; text-align: center; border-radius: 0.25rem; } .gallery-dl_input:focus-visible { outline: none; } #gallery-dl_to_text { background-color: #333333aa !important; padding-left: 7px; padding-right: 7px; padding-top: 3px; padding-bottom: 3px; user-select: none; } #gallery_dl_from { border-top-left-radius: 0px; border-bottom-left-radius: 0px; } #icon_download { width: 24px; rotate: 180deg; float: left; margin-top: 2px; margin-left: 10px; margin-right: 10px } #gallery-dl-container{ display:flex; align-items:center; float:left; margin-left:15px; }")


    function gallery_all()
    {
        var gall_from = 0
        var gall_to = 99999

        if(document.getElementById("gallery_dl_from").value != "")
        {
            gall_from = document.getElementById("gallery_dl_from").value
        }

        if(document.getElementById("gallery_dl_to").value != "")
        {
            gall_to = document.getElementById("gallery_dl_to").value
        }

        if(document.getElementById("gallery_dl_from").value === "" && document.getElementById("gallery_dl_to").value === "")
        {
            GM_setClipboard("gallery-dl --chapter-filter \"lang == '" + language_filter + "'\" \"" + window.location.href + "\"")
        }
        else
        {
            GM_setClipboard("gallery-dl --chapter-filter \"lang == '" + language_filter + "' and " + gall_from + " <= chapter < " + gall_to + "\" \"" + window.location.href + "\"")
        }
    }


    var page_loaded = false

    setInterval(function()
    {
            while(!page_loaded){
        document.getElementsByClassName("nav-bar")[0].insertAdjacentHTML( 'afterbegin', '<div id="gallery-dl-container"><button style="margin-right:3px;" id="gallery-dl" title="Enter the starting and ending chapters to download with Gallery-dl\n(leave blank for all chapters)" class="btn btn-secondary"><span id="gallery-dl_text"><svg id="icon_download" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-upload text-currentColor icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg></span></button> <input id="gallery_dl_from" class="gallery-dl_input" type="text"></input><span id="gallery-dl_to_text">to</span><input id="gallery_dl_to" class="gallery-dl_input" type="text"></input><br></div>' );
        document.getElementById("gallery-dl").addEventListener("click", gallery_all)
        if(window.getComputedStyle(document.getElementsByClassName("bg-background")[0]).backgroundColor == "rgb(255, 255, 255)")
        {
        console.log("White");
             document.getElementById("gallery_dl_from").style.backgroundColor = "var(--md-accent)"
            document.getElementById("gallery_dl_to").style.backgroundColor = "var(--md-accent)"
            document.getElementById("gallery-dl_to_text").style.backgroundColor = "var(--md-accent)"
        }
        if(document.getElementsByClassName("nav-bar").length != 0)
        {
        page_loaded = true
        }
  }
    }, 500);




    window.onscroll = function() {scrollChangeStyle()};

    function scrollChangeStyle()
    {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100)
        {
            document.getElementById("gallery_dl_from").style.backgroundColor = "var(--md-accent)"
            document.getElementById("gallery_dl_to").style.backgroundColor = "var(--md-accent)"
            document.getElementById("gallery-dl_to_text").style.backgroundColor = "var(--md-accent)"
        }
        else
        {
            document.getElementById("gallery_dl_from").style.backgroundColor = "var(--md-background-translucent)"
            document.getElementById("gallery_dl_to").style.backgroundColor = "var(--md-background-translucent)"
            document.getElementById("gallery-dl_to_text").style.backgroundColor = "var(--md-background-translucent)"
        }
    }

    /*Hides script on non-"title" urls*/
    setInterval(function(){
        if(window.location.href.includes("title"))
        {
            document.getElementById("gallery-dl").style.display = ""
            document.getElementById("gallery_dl_from").style.display = ""
            document.getElementById("gallery_dl_to").style.display = ""
            document.getElementById("gallery-dl_to_text").style.display = ""
        }else{
            console.log("doesn't include title")
            document.getElementById("gallery-dl").style.display = "none"
            document.getElementById("gallery_dl_from").style.display = "none"
            document.getElementById("gallery_dl_to").style.display = "none"
            document.getElementById("gallery-dl_to_text").style.display = "none"
        }

    }, 1000)

})();