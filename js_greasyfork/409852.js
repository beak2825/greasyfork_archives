// ==UserScript==
// @author       nht.ctn
// @name         AnimeTosho Eng Subtitle Downloader
// @namespace    https://github.com/nhtctn
// @version      1.0
// @description  Automatically downloads English subtitles on AnimeTosho
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAADrSURBVDhPtVKxDcJADLSERMEqIEU0tEyARGo6qOjCGlRhEhIxACOgtIxARUVDccTmnbw/nyJCnPRS4rfPd/bT34B7hYRmoFHSnnGG0wNwKXHgXSGjJWhSoHza5IZ0c4uTaMLh3N9FG5icCi/4F4o8JWvBqcK1BK0KcJ0QSPYlFWkCRzY/tl3k3hWx0inlrcVvwV4GxCh2defAJ8eUkPO3hsCTFPPIpGxHY10FTr58M1mwLi5Y0LqJdWcQEgQrDGO+HYEhCFap//6AjX9G6EkIdXW11HCd5g0oYpMfBJ1+7AkPgpGv51fSfhB9ADUGVK7f/SFaAAAAAElFTkSuQmCC

// @match        *://animetosho.org/search?q=*
// @match        *://animetosho.org/view/*
// @match        *://animetosho.org/series/*

// @grant        GM_getValue
// @grant        GM_setValue

// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/409852/AnimeTosho%20Eng%20Subtitle%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/409852/AnimeTosho%20Eng%20Subtitle%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

	const tabCloseTime = 6000; // 6 seconds

    var pageUrl = window.location.href;
    var a;

    if (GM_getValue("autoDown") == null) {
        GM_setValue("autoDown", true);
    }

    var autoCheckButton = '<div id="autoSubDownload_container" style="font-size: smaller; margin-top: 1em; text-align: center;"><input id="autoSubDownload" type="checkbox" style="margin: 0; vertical-align: bottom;"> Auto Subtitle Download</div>';
    var checkArea = document.getElementById("topbar_time");
    if (checkArea != null) {
        checkArea.insertAdjacentHTML( "afterend", autoCheckButton );
        var checkBox = document.getElementById("autoSubDownload");
        checkBox.onclick = function() {autoDownloadCheck();};
        GM_getValue("autoDown") == true ? checkBox.checked = true : '';
    }

    function autoDownloadCheck() {
      if (checkBox.checked == true){
          GM_setValue("autoDown", true);
      } else {
          GM_setValue("autoDown", false);
      }
    }

    // OPEN TORRENT PAGES
    if (pageUrl.search( /animetosho\.org\/search\?q=/ ) >= 0 && GM_getValue("autoDown") == true)
    {
        var torrentLinks = [];
        var torrents = document.querySelectorAll( 'div[class="link"] > a' );
        for ( a = 0; a < torrents.length; a++ ) {torrentLinks[a] = torrents[a].href;}

        var button = '<button id="engSubDown" class="feeddd" style="margin-right: 10px;">Download All Eng Subtitles</button>';
        var butonArea = document.querySelector( '.feeddd' );
        butonArea.insertAdjacentHTML( "afterend", button );
        var myButton = document.getElementById("engSubDown");
        myButton.onclick = function() {openAll();};
    }

    function openAll( )
    {
        if(GM_getValue("autoDown") == true) {
            for ( var a = 0; a < torrentLinks.length; a++ ) {window.open(torrentLinks[a]);}
        }
    }

    // DOWNLOAD ENG SUBS
    if (pageUrl.search( /animetosho\.org\/view\// ) >= 0 ) {
        var errorCheck = document.querySelector('body > center > h1') != null;
        if (errorCheck) {
            setTimeout(function() {location.reload();}, 5000);
        }
        else {
            if(GM_getValue("autoDown") == true) {

            var subButtons = document.querySelectorAll( '[href*="animetosho.org/storage/attach/"]' );
            var engSubLinks = [];
            for ( a = 0; a < subButtons.length; a++ )
            {
                var subsLangs = subButtons[a].textContent;
                if (subsLangs.search(/eng/i) >= 0)
                {
                    engSubLinks[a] = subButtons[a].href;
                }
            }
            // If there is one eng sub, download. Else wait.
            if (engSubLinks.length == 1)
            {
                document.location = engSubLinks[0];
                setTimeout(function() {
                    if (GM_getValue("autoDown") == true) {
                        window.close();
                    }
                }, tabCloseTime);
            }
            // If there is no eng sub but one undefined sub, download.
            else if (subButtons.length == 1)
            {
                if (subButtons[0].textContent.search(/und/i) >= 0)
                {
                    var engSubLink = subButtons[0].href;
                }
                document.location = engSubLink;
                setTimeout(function() {
                    if (GM_getValue("autoDown") == true) {
                        window.close();
                    }
                }, tabCloseTime);
            }
            console.log(subButtons);
            }
        }
    }

})();