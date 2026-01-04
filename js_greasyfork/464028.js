// ==UserScript==
// @name         Ars Technica Latest Stories
// @namespace    https://arstechnica.com/civis/members/magus.53750/
// @version      1
// @description  Parse FP RSS to create Latest Stories widget
// @author       magus424
// @license      MIT
// @match        *://arstechnica.com/civis/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @connect      feeds.arstechnica.com
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/464028/Ars%20Technica%20Latest%20Stories.user.js
// @updateURL https://update.greasyfork.org/scripts/464028/Ars%20Technica%20Latest%20Stories.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    let latestRows = 2, // 1 or 2 rows of stories
        latestHeight = (latestRows * 250) + "px",
        $footer = $("footer#footer"),
        $latestStories = $(`<div id="latest-stories"><h2>Latest stories from Ars Technica</h2><ul></ul></div>`),
        $latestList = $latestStories.find("ul");

    GM.xmlHttpRequest({
        method: "GET",
        url: "https://feeds.arstechnica.com/arstechnica/index",
        onload: function (response) {
            let $feed = $(response.responseXML);

            $feed.find("channel > item").each(
                function (i, el)
                {
                    let $el = $(el),
                        title = $el.find("title").text(),
                        link = $el.find("link").text(),
                        $img = $($el.find("content\\:encoded").text()).find("figure.intro-image img"),
                        image = $img.attr("src") || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
                        altText = $img.attr("alt") || "No image.";

                    altText = $("<div>").html(altText).text();

                    $latestList.append(`
                        <li>
                          <a href="${link}">
                            <div class="image">
                              <img src="${image}" alt="${altText}" title="${altText}">
                            </div>
                            <div class="title">${title}</div>
                          </a>
                        </li>
                    `);
                }
            );

            if ($latestList.find("li").length > 0)
            {
                $footer.prepend($latestStories);
                $footer.prepend(`
                    <style type="text/css">
                        /* Latest Stories */

                        #latest-stories {
                          clear: both;
                          margin: 0 auto;
                          padding: 0 2.5%;
                          font-size: 12px;
                        }

                        #latest-stories a {
                          text-decoration: none;
                        }

                        #latest-stories ul {
                          height: ${latestHeight};
                          list-style-type: none;
                          margin: 0;
                          overflow: hidden;
                          padding: 0;
                        }

                        #latest-stories ul li {
                          float: left;
                          height: 250px;
                          margin: 0 20px 0 0;
                          padding: 0;
                          width: 140px;
                        }

                        #latest-stories ul li .image {
                          height: 140px;
                          margin: 0 auto 7px;
                          width: 140px;
                        }

                        #latest-stories ul li .image a {
                          display: block;
                        }

                        #latest-stories ul li .image img {
                          display: block;
                          height: 140px;
                          width: 140px;
                          object-fit: contain;
                        }

                        #latest-stories ul li .title {
                          font-weight: bold;
                          font-family: Arial, Helvetica, sans-serif;
                        }
                    </style>
                `);
            }
        }
    });
})(jQuery);
