// ==UserScript==
// @name         Hide Banners of manga sites
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  this script removes/hides the banners from some sites if any banner is missing then add comment of the selector value and name of website it will be added here
// @author       Root Android and Ethical Hacker
// @include      /https?:\/\/(www.)?isekaiscan.com/*
// @include      /https?:\/\/(www.)?manhuaus.com/*
// @include      /https?:\/\/(www.)?comickiba.com/*
// @include      /https?:\/\/(www.)?reaperscans.com/*
// @include      /https?:\/\/(www.)?asurascans.com/*
// @match        https://mangadex.org/
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/422816/Hide%20Banners%20of%20manga%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/422816/Hide%20Banners%20of%20manga%20sites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isekaiscan = {
    name: "isekaiscan",
    elements: [
         "body > div.wrap > div > div.c-sidebar.c-top-sidebar",
         "#main-sidebar > div:nth-child(2)",
         "#ads-before-content",
         ],
    }

    var manhuaus = {
        name: "manhuaus",
        elements: [
         "body > div.wrap > div > div.site-content > div > div > div > div > div.main-col.col-md-8.col-sm-8 > div.ad.c-ads.custom-code.body-top-ads",
         "#custom_html-13 > div > div",
         "#main-sidebar > div.google-auto-placed",
         "#IL_INSEARCH",
        ],
    }

    var comickiba = {

        name : "comickiba",
        elements : [
         "#media_image-4",
         "#custom_html-31",
         "body > div.wrap > div > div.c-sidebar.c-top-second-sidebar.wp-manga",
         "#main-sidebar > div:nth-child(1)",
        ],
    };
    var reaperscans = {
        name: "reaperscans",
        elements: [
         "#content > div > div:nth-child(1)",
         "#content > div > div.w-100.py-4",
        ],
    };

    var mangadex = {
        name: "mangadex",
        elements: [
         "#affiliate-banner",
        ]
    };
    
    var asurascans = {
        name: "asurascans",
        elements:[
            "#readerarea > div.code-block.code-block-10",
            "#readerarea > div.code-block.code-block-10 > a > img"
            ],
    };

    var website = (window.location.hostname)
    var data = [
        isekaiscan,manhuaus, comickiba, reaperscans, mangadex, asurascans
    ]

    web(website,data)

    function web(site,data){
        console.log("Starting Hide Banners script....")

        let website = site.split('.')[0];
        if(website == "www" ) website = site.split('.')[1];
        let elements = data.find(({ name }) => name === website)
        const style = 'color:red; font-size:30px; font-weight: bold; -webkit-text-stroke: 1px black;'
        if(elements != undefined && elements.name ){
            console.log("%cWebsite Found Hiding banners",style)
            $.each(elements.elements, function( index, value ) {
                 $(value).css("display","none");
            });
            if(elements.name == "asurascans" || elements.name == "reaperscans" || elements.name == "comickiba"){
                $("img[src$='.gif']").css("display","none");
            }
            console.log("%cBanners hidden successfully!",style)
        }else{
            console.error("%cThere was an ERROR while Removing the banners!",style);
        }
        console.warn("%cif any banners are missed plz comment it on https://greasyfork.org/en/scripts/422816-hide-banners-of-some-manga-sites",style)
    }
})();

