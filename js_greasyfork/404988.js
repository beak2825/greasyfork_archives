// ==UserScript==
// @name         [Depreciated] MangaDex - Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Batch download mangadex manga w Jdownloader2
// @author       Gondola
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end
// @match        https://mangadex.org/title/*
// @compatible   firefox
// @compatible   chrome
// @downloadURL https://update.greasyfork.org/scripts/404988/%5BDepreciated%5D%20MangaDex%20-%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/404988/%5BDepreciated%5D%20MangaDex%20-%20Downloader.meta.js
// ==/UserScript==


GM_addStyle("#jdownload_all_icon:before{content: '\\f019';} .jdl1:before{content: '\\f019'; cursor:pointer;} .jdl2:before{content: '\\f019';cursor:default !important;} .jdl2:hover{color:#999 !important;}");


(function()
 {

    function sleep(time)
    {
        return new Promise(res => setTimeout(res, time))
    }


    async function down_all()
    {
        for (var x = 0; x < document.getElementsByClassName("chapter-row").length; x++)
        {
            if(document.getElementsByClassName("chapter-row")[x].getAttribute('data-id') !== null)
            {
                GM_setClipboard("https://mangadex.org/chapter/" + document.getElementsByClassName("chapter-row")[x].getAttribute('data-id') + "\n");
                document.getElementById("jdl_text").innerHTML = "Download \[" + x + "/" + (document.getElementsByClassName("chapter-row").length-1) + "\]";
                await sleep(3000);
            }
        }

        GM_setClipboard("");
        document.getElementById("jdl_text").innerHTML = "Download done!";
        await sleep(4000);
        document.getElementById("jdl_text").innerHTML = "Download";
    }


    async function jdownload_single(chapter)
    {
        GM_setClipboard("https://mangadex.org/chapter/" + document.getElementsByClassName("chapter-row")[chapter].getAttribute('data-id') + "\n")
        await sleep(1000);
        GM_setClipboard("");
    }


    for(let n = 0; n < document.getElementsByClassName("chapter-row").length; n++)
    {
        if(n > 0)
        {
            document.getElementsByClassName("chapter-row")[n].insertAdjacentHTML('afterbegin', "<span class='jdl1 fas' ></span>")
            document.getElementsByClassName("jdl1")[n].addEventListener("click", function(){jdownload_single(n);});
        }
        else
        {
            document.getElementsByClassName("chapter-row")[n].insertAdjacentHTML('afterbegin', "<span class='jdl1 jdl2 fas' title='JDownload'></span>")
        }
    }


    document.getElementById("upload_button").insertAdjacentHTML( 'beforebegin', '<button style="margin-right:3px;" id="jdownload_all" class="btn btn-secondary"><span id="jdownload_all_icon" class="fa-fw fas"></span>&nbsp;<span id="jdl_text">Download</span></button>' );
    document.getElementById("jdownload_all").addEventListener("click", down_all)

})();