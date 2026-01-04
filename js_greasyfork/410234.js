// ==UserScript==
// @name         Youtube Deleted/Private videos
// @version      0.4
// @description  Removes deleted or privated youtube videos from playlist.
// @author       ArrowVulcan
// @match        https://www.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/183198
// @downloadURL https://update.greasyfork.org/scripts/410234/Youtube%20DeletedPrivate%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/410234/Youtube%20DeletedPrivate%20videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let elem;
    let lastScrollHeight = 0;
    let videoList;
    let itemPosition;

    function scrollDown(){
        lastScrollHeight = document.body.firstElementChild.scrollHeight;
        scrollTo(0, document.body.firstElementChild.scrollHeight);
        setTimeout(function(){
            if( document.body.firstElementChild.scrollHeight > lastScrollHeight ){ scrollDown(); }else{
                videoList = document.querySelectorAll("ytd-playlist-video-renderer");
                itemPosition = videoList.length-1;
                looper();
            }
        }, 5000)
    }

    function looper(){

        if( itemPosition == -1 ){ elem.innerText = "Done"; elem.onclick = ""; return; }

        if( videoList[itemPosition].children[1].children[0].children[1].children[0].children[1].title == "[Deleted video]" || videoList[itemPosition].children[1].children[0].children[1].children[0].children[1].title == "[Private video]" ){

            window.scrollTo({top: videoList[itemPosition].getBoundingClientRect().top + window.pageYOffset - 70, behavior: 'smooth'});

            setTimeout(function(){
                videoList[itemPosition].children[1].children[2].children[0].children[1].children[0].click(); // Öppnar menyn

                setTimeout(function(){
                    document.getElementsByTagName("paper-listbox").items.children[0].click(); // Klickar att ta bort [3], lägg till [0]
                    itemPosition -= 1;
                    looper();
                }, 1000);

            }, 2000);

        }else{
            itemPosition -= 1;
            looper();
        }

    }

    function createButton(){

        elem = document.createElement('div');
        elem.style.position = "fixed";
        elem.style.top = "77px";
        elem.style.right = "20px";
        elem.style.width = "84px";
        elem.style.height = "44px";
        elem.style.zIndex = "2021";
        elem.style.backgroundColor = "#2196f352";
        elem.style.border = "1px solid #3ea6ff";
        elem.style.borderRadius = "4px";
        elem.style.display = "flex";
        elem.style.justifyContent = "center";
        elem.style.alignItems = "center";
        elem.style.color = "#FFF";
        elem.style.fontSize = "18px";
        elem.style.cursor = "pointer";
        elem.style.display = "none";

        document.body.appendChild(elem);

        elem.onclick = scrollDown;

        var p = document.createElement('p');
        p.innerText = "Remove";
        elem.appendChild(p);

    }

    createButton();

    setInterval(function(){

        let loc = window.location.href.includes("playlist?");

        if( loc ){
            elem.style.display = "flex";
        }else{
            elem.style.display = "none";
        }

    }, 2000);

})();