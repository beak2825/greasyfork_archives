// ==UserScript==
// @name         YTmusic playlist search
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  adds a search bar to your youtube music library
// @author       You
// @match        https://music.youtube.com/library/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445658/YTmusic%20playlist%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/445658/YTmusic%20playlist%20search.meta.js
// ==/UserScript==

jQuery.expr[':'].contains = function(a, i, m) {
  return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
};

(function() {
    'use strict';
    createSearchBox()
    let utilityFunc = ()=> {
        var run = (url)=> {
            $("#tabs ytmusic-item-section-tab-renderer").click(function() {
            (function() {
                'use strict';
                createSearchBox();
            })();
        });
        createSearchBox();
        };
        var pS = window.history.pushState;
        var rS = window.history.replaceState;

        window.history.pushState = function(a, b, url) {
            run(url);
            pS.apply(this, arguments);
        };

        window.history.replaceState = function(a, b, url) {
            run(url);
            rS.apply(this, arguments);
        };
    }
    utilityFunc();
    })();

    function createSearchBox() {
        let input = $("<input style='background-color: #232323; border: 1px solid rgba(255,255,255,0.1); color: white; padding: 8px 10px; border-radius: 100px; font-weight: bold;' type='text'>").on('input', function() {
            let text = $(this).val();
            let url = window.location.href.split("/");
            let pageName = url[url.length-1];
            switch (pageName) {
                case "playlists":
                case "albums":
                    if (text == "") {
                        $("ytmusic-grid-renderer ytmusic-two-row-item-renderer").show();
                    } else {
                        $(`ytmusic-grid-renderer ytmusic-two-row-item-renderer .title:not(:contains('${text}'))`).parents("ytmusic-two-row-item-renderer").hide();
                        $(`ytmusic-grid-renderer ytmusic-two-row-item-renderer .title:contains('${text}')`).parents("ytmusic-two-row-item-renderer").show();
                    }
                    break;
                case "songs":
                    if (text == "") {
                        $("ytmusic-shelf-renderer #contents ytmusic-responsive-list-item-renderer").show();
                    } else {
                        $(`ytmusic-shelf-renderer #contents ytmusic-responsive-list-item-renderer .title:not(:contains('${text}'))`).parents("ytmusic-responsive-list-item-renderer").hide();
                        $(`ytmusic-shelf-renderer #contents ytmusic-responsive-list-item-renderer .title:contains('${text}')`).parents("ytmusic-responsive-list-item-renderer").show();
                    }
                    break;
                case "artists":
                case "subscriptions":
                    console.log($(`ytmusic-shelf-renderer #contents ytmusic-responsive-list-item-renderer .title`));
                    if (text == "") {
                        $("ytmusic-shelf-renderer #contents ytmusic-responsive-list-item-renderer").show();
                    } else {
                        $(`ytmusic-shelf-renderer #contents ytmusic-responsive-list-item-renderer .title:not(:contains('${text}'))`).parents("ytmusic-responsive-list-item-renderer").hide();
                        $(`ytmusic-shelf-renderer #contents ytmusic-responsive-list-item-renderer .title:contains('${text}')`).parents("ytmusic-responsive-list-item-renderer").show();
                    }
                    break;
            }

        });
        $("#end-items").append(input);
    }