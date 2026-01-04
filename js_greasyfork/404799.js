// ==UserScript==
// @name         [DEAD] Horriblesubs - Mass Downloader
// @version      1.0.0
// @description  Adds buttons to mass download through magnet links
// @author       Gondola
// @match        https://horriblesubs.info/shows/*
// @grant        GM_addStyle
// @run-at       document-end
// @incompatible chrome
// @compatible   firefox
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/404799/%5BDEAD%5D%20Horriblesubs%20-%20Mass%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/404799/%5BDEAD%5D%20Horriblesubs%20-%20Mass%20Downloader.meta.js
// ==/UserScript==

GM_addStyle("#L1080p {padding-left:7px;} #mass_dl {background-color: #363636;width: 100px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;user-select: none;display: grid;grid-template-columns: repeat(2, 1fr); } .navbar {box-shadow: none !important;}.main-content-area {margin-top: 12px !important;}.dl_link {cursor: pointer;color: #dadada;font-weight: bold;text-align: center;margin-top:-3px;margin-bottom:-1px;}.dl_link:hover {color: #888888;}#mass_dl_container {width: 1140px;margin-left: auto;margin-right: auto;}@media only screen and (min-width: 990px) {#mass_dl_container {width: 940px;}}@media only screen and (min-width: 1200px){#mass_dl_container {width: 1140px;}}@media only screen and (max-width: 990px){#mass_dl_container {width: 720px;}}");

(function()
{
    function download_1080p()
    {
        dl_link_list = document.getElementsByClassName("link-1080p");
        for(var i = 0; i < dl_link_list.length; i++)
        {
            console.log(i);
            dl_link_list[i].children[1].firstChild.click();
        }
    }

    function download_720p()
    {
        dl_link_list = document.getElementsByClassName("link-720p");
        for(var i = 0; i < dl_link_list.length; i++)
        {
            console.log(i);
            dl_link_list[i].children[1].firstChild.click();
        }
    }

    function sleep(time)
    {
        return new Promise(res => setTimeout(res, time));
    }

    async function load_all_eps() 
    {
        while(document.querySelector(".more-button"))
        {
            await sleep(800);
            document.querySelector(".more-button").click();
        }
    }

    document.getElementById("masthead").insertAdjacentHTML( 'afterend', '<div id="mass_dl_container"><div id="mass_dl"><span class="dl_link" id="L1080p">1080p</span><span class="dl_link" id="L720p">720p</span></div></div>' );
    document.getElementById("L1080p").addEventListener("click", download_1080p);
    document.getElementById("L720p").addEventListener("click", download_720p);
    load_all_eps();
    var dl_link_list;

})();

