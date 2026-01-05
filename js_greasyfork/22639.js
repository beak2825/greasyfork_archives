// ==UserScript==
// @name         Mahen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Useless
// @author       DonNadie
// @match        http://*.tviso.com/*
// @match        https://*.tviso.com/*
// @match        http://*.tviso.pre/*
// @grant        none
// @require 	 https://greasyfork.org/scripts/15246-micro-templating/code/Micro%20templating.js?version=95830
// @require 	 https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.1/awesomplete.js
// @downloadURL https://update.greasyfork.org/scripts/22639/Mahen.user.js
// @updateURL https://update.greasyfork.org/scripts/22639/Mahen.meta.js
// ==/UserScript==
/* jshint -W097 */
/* globals $, console, _tmpl, Awesomplete */
'use strict';

var Mahel = function ()
{
    var autocomplete, autocompleteIndex;

    var init = function () {
        $.getJSON("https://yelidmod.com/tviso/mahen.php", function(data)
                  {
            autocompleteIndex = data.map;

            $(window).bind('hashchange', function() {
                checkPage();
            });
            checkPage();
        });
    };
    var checkPage = function ()
    {
        if (document.location.href.indexOf("/media/") == -1) {
            return;
        }
        var query = ".availability h2";

        if ($('.availability h2').length > 1) {
            query += ':nth-of-type(2)';
        }

        $(query).after(parseTemplate(function() {
            /*
                  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.1/awesomplete.min.css">
                  <input id="mahen-search" value="<%= query%>">

            */}, {query: $('h1[itemprop="name"]').text()}));

        autocomplete = new Awesomplete($("#mahen-search")[0], {
            list: Object.keys(autocompleteIndex)
        });

        $('#mahen-search').on("awesomplete-selectcomplete", function () {
            var val = $(this).val(), id;

            if (typeof autocompleteIndex[val] === "object") {
                id = autocompleteIndex[val][0];
            } else {
                id = autocompleteIndex[val];
            }
            showLinks(id);
        });

        autocomplete.evaluate();
        // auto select the first result
        autocomplete.next();autocomplete.select();
    };

    var showLinks = function (id) {
        $.getJSON("https://yelidmod.com/mahel/media.php?id=" + id, function(media) {
            var $container = $(".awesomplete"), tmp;

            // place es links first
            media.links.sort(function (a, b) {
                /*if (a.audio == "es" && b.audio == "es") {
                    if (a.provider == "streamcloud") {
                        return 1;
                    } else if (b.provider == "streamcloud") {
                        return -1;
                    }
                    return 0;
                }*/

                if (a.audio == "es") {
                    return 1;
                } else if (a.audio == "es") {
                    return -1;
                }
                return 0;
            });

            for (var k in media.links)
            {
                media.links[k].flag = media.links[k].audio;
                switch (media.links[k].flag) {
                    case "en":
                        media.links[k].flag = "us";
                        break;
                    case "la": //latinoamerica
                        media.links[k].flag = "ar";
                        break;
                }

                if (typeof media.links[k].reports != "undefined") {
                    media.links[k].reports = '<i class="icontviso-spoiler"></i> ' + media.links[k].reports;
                } else {
                    media.links[k].reports = "";
                }

                // process provider url to get its name
                // from: https://youtube.com/watch?v=235435
                // to: Youtube
                tmp = new URL(media.links[k].url).host;
                tmp = tmp.split(".");

                if (tmp.length == 3) {
                    media.links[k].provider = tmp[1];
                } else {
                    media.links[k].provider = tmp[0];
                }
                media.links[k].provider = media.links[k].provider.toLowerCase();

                $container.after(parseTemplate(function() {
                    /*
                <div class="available-source vod-info-wuaki">
                   <a data-provider="wuaki" data-idm="488" data-media-type="2" target="_blank" href="<%= link.url%>">

                       <div class="source-logo ch vod-ES vod-wuaki-ES " title="Wuaki" data-info=""></div>

                       <div itemprop="target" class="button action video-link" target="_blank" href="<%= link.url%>">
                           Ver <i class="icontviso-play"></i>
                       </div>
                       <div class="source-info" itemprop="potentialAction" itemscope="" itemtype="http://schema.org/WatchAction">
                           <div class="source-name">
                               <%= link.provider%>
                           </div>
                           <div class="availability-indicator vod" itemprop="expectsAcceptanceOf" itemscope="" itemtype="http://schema.org/Offer">
                               <span class="price-text"><img title="<%= link.flag%>" src="http://flagpedia.net/data/flags/mini/<%= link.flag%>.png"></span>
                               <span class="quality-text"><%= link.quality.toUpperCase()%></span>
                               <span class="price-text" title="reportes"><%= link.reports%></span>
                               <span class="quality-text"></span>
                           </div>
                       </div>
                   </a>
               </div> */}, {link: media.links[k]}));

            }
        });
    };

    var parseTemplate = function(f, data)
    {
        var html = f.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '');

        if (typeof data != 'undefined') {
            return _tmpl(html, data);
        } else {
            return html;
        }
    };

    return {
        checkPage : checkPage,
        init: init
    };
}();

$(document).ready(function() {
    Mahel.init();
});