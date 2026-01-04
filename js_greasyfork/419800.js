// ==UserScript==
// @name         DL search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add DLsite Shotcut direct search in "useful" website, USE [[LIST MODE]] ON SEARCH, do not use grid mode
// @author       Royal
// @match        https://www.dlsite.com/*
// @grant        unsafeWindow
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/419800/DL%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/419800/DL%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // this add shotcut to search result
    $("#search_result_list").find("tr").each(function( index ) {
        console.log( index + ": " + $(this).find(".work_name").find("[title]").text() );
        var name = $(this).find(".work_name").find("a").text();

        var Tweb1 = "https://sukebei.nyaa.si/?f=0&c=0_0&q=";
        var appthis1 = '<a style="font-size:20px;" href="'+Tweb1+name+ '" target="_blank">[Nyaa]</a>';
        $(this).find("td:nth-child(2)").append(appthis1);

        var Tweb2 = "https://nhentai.net/search/?q=";
        var appthis2 = '<a style="font-size:20px;" href="'+Tweb2+name+ '" target="_blank"> [nhentai]</a>';
        $(this).find("td:nth-child(2)").append(appthis2);

        var Tweb3 = "https://hitomi.la/search.html?";
        var appthis3 = '<a style="font-size:20px;" href="'+Tweb3+name+ '" target="_blank"> [hitomi.la]</a>';
        $(this).find("td:nth-child(2)").append(appthis3);

        var Tweb4 = "https://e-hentai.org/?f_search=";
        var appthis4 = '<a style="font-size:20px;" href="'+Tweb4+name+ '" target="_blank"> [e-hentai]</a>';
        $(this).find("td:nth-child(2)").append(appthis4);

        var Tweb5 = "https://exhentai.org/?f_search=";
        var appthis5 = '<a style="font-size:20px;" href="'+Tweb5+name+ '" target="_blank"> [eX-hentai]</a>';
        $(this).find("td:nth-child(2)").append(appthis5);

        var Tweb6 = "https://www.google.com/search?q=";
        var appthis6 = '<a style="font-size:20px;" href="'+Tweb6+name+ '" target="_blank"> [Google]</a>';
        $(this).find("td:nth-child(2)").append(appthis6);

        var Tweb7 = "https://www.google.com/search?q=";
        var appthis7 = '<a style="font-size:20px;" href="'+Tweb7+name+ " 漢化" + '" target="_blank"> [G漢化]</a>';
        $(this).find("td:nth-child(3)").append(appthis7);

        //alert(name);
    });

        // this add shotcut to ranking page
    $("#ranking_table").find("tr").each(function( index ) {
        console.log( index + ": " + $(this).find(".work_name").find("a").text() );
        var name = $(this).find(".work_name").find("a").text();

        var Tweb1 = "https://sukebei.nyaa.si/?f=0&c=0_0&q=";
        var appthis1 = '<a style="font-size:20px;" href="'+Tweb1+name+ '" target="_blank">[Nyaa]</a>';
        $(this).find("td:nth-child(3)").append(appthis1);

        var Tweb2 = "https://nhentai.net/search/?q=";
        var appthis2 = '<a style="font-size:20px;" href="'+Tweb2+name+ '" target="_blank"> [nhentai]</a>';
        $(this).find("td:nth-child(3)").append(appthis2);

        var Tweb3 = "https://hitomi.la/search.html?";
        var appthis3 = '<a style="font-size:20px;" href="'+Tweb3+name+ '" target="_blank"> [hitomi.la]</a>';
        $(this).find("td:nth-child(3)").append(appthis3);

        var Tweb4 = "https://e-hentai.org/?f_search=";
        var appthis4 = '<a style="font-size:20px;" href="'+Tweb4+name+ '" target="_blank"> [e-hentai]</a>';
        $(this).find("td:nth-child(3)").append(appthis4);

        var Tweb5 = "https://exhentai.org/?f_search=";
        var appthis5 = '<a style="font-size:20px;" href="'+Tweb5+name+ '" target="_blank"> [eX-hentai]</a>';
        $(this).find("td:nth-child(3)").append(appthis5);

        var Tweb6 = "https://www.google.com/search?q=";
        var appthis6 = '<a style="font-size:20px;" href="'+Tweb6+name+ '" target="_blank"> [Google]</a>';
        $(this).find("td:nth-child(3)").append(appthis6);

        var Tweb7 = "https://www.google.com/search?q=";
        var appthis7 = '<a style="font-size:20px;" href="'+Tweb7+name+ " 漢化" + '" target="_blank"> [G漢化]</a>';
        $(this).find("td:nth-child(3)").append(appthis7);




        //alert(name);
    });

    //    this make shotcut in product page

    if (window.location.href.indexOf("https://www.dlsite.com/maniax/work/=/product_id") > -1) {
            $(document).ready(function()
        {
        //alert("test2");
        var name = $("#work_name").find("a").text();
        console.log(name)

        var Tweb1 = "https://sukebei.nyaa.si/?f=0&c=0_0&q=";
        var appthis1 = '<a style="font-size:20px;" href="'+Tweb1+name+ '" target="_blank">[Nyaa]</a>';
        $("#work_left").append(appthis1);

        var Tweb2 = "https://nhentai.net/search/?q=";
        var appthis2 = '<a style="font-size:20px;" href="'+Tweb2+name+ '" target="_blank"> [nhentai]</a>';
        $("#work_left").append(appthis2);

        var Tweb3 = "https://hitomi.la/search.html?";
        var appthis3 = '<a style="font-size:20px;" href="'+Tweb3+name+ '" target="_blank"> [hitomi.la]</a>';
        $("#work_left").append(appthis3);

        var Tweb4 = "https://e-hentai.org/?f_search=";
        var appthis4 = '<a style="font-size:20px;" href="'+Tweb4+name+ '" target="_blank"> [e-hentai]</a>';
        $("#work_left").append(appthis4);

        var Tweb5 = "https://exhentai.org/?f_search=";
        var appthis5 = '<a style="font-size:20px;" href="'+Tweb5+name+ '" target="_blank"> [eX-hentai]</a>';
        $("#work_left").append(appthis5);

        var Tweb6 = "https://www.google.com/search?q=";
        var appthis6 = '<a style="font-size:20px;" href="'+Tweb6+name+ '" target="_blank"> [Google]</a>';
        $("#work_left").append(appthis6);

        var Tweb7 = "https://www.google.com/search?q=";
        var appthis7 = '<a style="font-size:20px;" href="'+Tweb7+name+ " 漢化" + '" target="_blank"> [G漢化]</a>';
        $("#work_left").append(appthis7);


        });
    }









})();