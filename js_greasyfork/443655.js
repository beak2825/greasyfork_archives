// ==UserScript==
// @name         4ca4jd2
// @namespace    https://sleazyfork.org/en/scripts/443655-4ca4jd2
// @version      0.31
// @description  Generate a list of links of images/gifs/webms/etc for JD2 from foolfuuka-based 4chan archivers (JD2 handles live threads perfectly fine).
// @author       You
// @match        https://archive.wakarimasen.moe/*/thread/*
// @match        https://archive.4plebs.org/*/thread/*
// @match        https://desuarchive.org/*/thread/*
// @match        https://boards.fireden.org/*/thread/*
// @match        https://arch.b4k.co/*/thread/*
// @match        https://archived.moe/*/thread/*
// @match        https://thebarchive.com/*/thread/*
// @match        https://archiveofsins.com/*/thread/*
// @match        https://www.tokyochronos.net/*/thread/*
// @match        https://archive.alice.al/thread/*
// @icon         none
// @grant        none
// @require      http://code.jquery.com/jquery-latest.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443655/4ca4jd2.user.js
// @updateURL https://update.greasyfork.org/scripts/443655/4ca4jd2.meta.js
// ==/UserScript==
var $ = window.jQuery;

(function() {
    'use strict';

    $(document).ready(function () {
        $(".post_data .post_controls:first").append(`<a href="#" class="jd2cn btnr parent">Generate List for JD2</a>`).css("padding","0.5rem");
        $(".jd2cn").click(function() {genList();});

        function genList() {
            let srcList = "";
            let idx = 0;

            $(".post_file_controls a[download]").each(function() {
                srcList += this.href + "\n";
            });

            let pkn = $(document).attr("title");
            let bnm = pkn.slice(pkn.indexOf(" - ")+1, pkn.indexOf(" » "));
            let tnm = pkn.slice(pkn.indexOf("#")+1);
            console.log(pkn, bnm, tnm);

            srcList += `4chan org ${bnm} - ${tnm}`;
            navigator.clipboard.writeText(srcList);

            $(".jd2cn").after(`<span class="4cadlfb">List copied to Clipboard.</span>`);
            $(".4cadlfb").css("margin-left","0.5rem");
            setTimeout(function() {
                $(".4cadlfb").fadeOut(500, function() {
                    $(".4cadlfb").remove()});
            }, 2000);
        }
    });
})();