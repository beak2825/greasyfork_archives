// ==UserScript==
// @name         FL-IMDB2FL
// @namespace    fl.imdb
// @version      1.2.1
// @description  Link from IMDB to FL
// @author       CRK
// @match        https://www.imdb.com/title/*
// @grant        none
// @license      MIT
// @source <meta property="pageId" content="tt3882082" />
// @source <div class="add_to_checkins" data-const="tt3882082" data-lcn="title-maindetails">
// @source https://filelist.io/browse.php?search=tt3882082&cat=0&searchin=0&sort=2
// @source <span id="titleYear">(<a href="/year/2016/?ref_=tt_ov_inf">2016</a>)</span>
// @downloadURL https://update.greasyfork.org/scripts/487018/FL-IMDB2FL.user.js
// @updateURL https://update.greasyfork.org/scripts/487018/FL-IMDB2FL.meta.js
// ==/UserScript==

(function() {
    function hookTheMonkey() {
        var text = document.createElement('snap');
        text.setAttribute("align", "center");
        text.setAttribute("style", "cursor:pointer; display: inline-block; padding-left: 5px;");
        text.innerHTML = `
            <center>
                <input style='background-color:red; color:white; font-weight:bold; border: 0px; border-radius: 3px; padding-bottom: 2px;' type='button' name='FLDownload' id='FLDownload' onclick='window.open(getUrl(), "_blank");' value='FL download' title='!!! FL Download - click me Love Cristina !!!'>
            </center>
        `;

        var script = document.createElement('script');
        script.innerText = `
            function getUrl() {
                let imdbId = document.querySelector('meta[property="imdb:pageConst"]').content;
                let searchUrl = 'https://filelist.io/browse.php?search=' + imdbId + '&cat=0&searchin=0&sort=2';
                return searchUrl;
            }
        `;


         document.body.appendChild(script);
         document.querySelector('svg[class="ipc-icon ipc-icon--share"]').parentElement.parentElement.parentElement.appendChild(text);
    };
    hookTheMonkey();
})();