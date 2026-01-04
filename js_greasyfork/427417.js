// ==UserScript==
// @name         Always show big map on vdip
// @namespace    https://dankhammer.com/
// @version      0.1
// @description  Make vDip show big map by default on game board screen
// @author       tickl
// @match        https://www.vdiplomacy.com/board.php*
// @match        https://vdiplomacy.com/board.php*
// @icon         https://www.google.com/s2/favicons?domain=vdiplomacy.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/427417/Always%20show%20big%20map%20on%20vdip.user.js
// @updateURL https://update.greasyfork.org/scripts/427417/Always%20show%20big%20map%20on%20vdip.meta.js
// ==/UserScript==


let imgHref = window.location.href;

if (imgHref.includes('vdiplomacy.com')) {
    if (window.localStorage.getItem("alwayslargemap") == null) {
        window.localStorage.setItem("alwayslargemap", true)
    }
    var useLargeMap = window.localStorage.getItem("alwayslargemap")
    if (useLargeMap == "true") {
        document.getElementById("mapImage").src = document.getElementById("LargeMapLink").href
        document.getElementById("LargeMapLink").children[0].textContent = "Swap to Small Map"
    }else{
        document.getElementById("LargeMapLink").children[0].textContent = "Swap to Big Map"
    }
    document.getElementById("LargeMapLink").removeAttribute("href")
    document.getElementById("LargeMapLink").onclick = function(){
        useLargeMap = window.localStorage.getItem("alwayslargemap")
        if (useLargeMap == "false") {
        window.localStorage.setItem("alwayslargemap", true)
        }else{
        window.localStorage.setItem("alwayslargemap", false)
        }
        //refresh the map using swapping
        document.getElementsByClassName("maptools")[0].children[1].onclick()
        document.getElementsByClassName("maptools")[0].children[1].onclick()

    }


    var contents = document.getElementsByClassName("content")
    Array.from(contents).forEach(
        function(frame){
            frame.style="max-width: 100%"
        }
    )

    console.log('View vDip Large Image start up.');
    var callback = function (mutationsList, observer) {
        var useLargeMap = window.localStorage.getItem("alwayslargemap")
        if (useLargeMap == "true") {
            document.getElementById("LargeMapLink").children[0].children[0].textContent = "Swap to Small Map"
            document.getElementById("mapImage").src = document.getElementById("LargeMapLink").childElements("LargeMapLink")[0].href
        }else{
            document.getElementById("LargeMapLink").children[0].children[0].textContent = "Swap to Big Map"
        }
        document.getElementById("LargeMapLink").removeAttribute("href")
        document.getElementById("LargeMapLink").children[0].removeAttribute("href")
    };
    const observeConfig = {
        attributes: false,
        childList: true
    };
    const observer = new MutationObserver(callback);
    observer.observe(document.getElementById("LargeMapLink"), observeConfig);
}