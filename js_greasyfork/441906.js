// ==UserScript==
// @name         Mannenzaken no-filter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Skip de censuur
// @author       JesMas
// @match        https://forum.mannenzaken.nl/forum/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mannenzaken.nl
// @grant        GM_xmlhttpRequest
// @connect      imgbox.com
// @connect      ibb.co
// @connect      imagevenue.com
// @downloadURL https://update.greasyfork.org/scripts/441906/Mannenzaken%20no-filter.user.js
// @updateURL https://update.greasyfork.org/scripts/441906/Mannenzaken%20no-filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var nsfw_texts = document.getElementsByClassName('blixem-nsfw-text-container')

    for (var i = nsfw_texts.length -1; i >= 0; i--) {
        nsfw_texts[i] && nsfw_texts[i].remove();
    }

    var all_pics = document.getElementsByClassName("blixem-nsfw");

    for (let j = 0; j < all_pics.length; j++) {
        let old_pic = all_pics[j].getElementsByTagName("img")[0]
        console.log(old_pic);
        var new_pic = all_pics[j].getElementsByTagName("img")[0].getAttribute("data-thumb-url")
        if (old_pic.src == "https://forum.mannenzaken.nl/core/packages/blixemnsfw/resources/mzfilter.jpg" && new_pic !== null) {
            old_pic.src = new_pic
        }
        if (old_pic.src == "https://forum.mannenzaken.nl/core/packages/blixemnsfw/resources/mzfilter.jpg" && new_pic == null) {

            var parent_link = all_pics[j].parentElement.getAttribute("href")
            if (parent_link !== null) {
                if (parent_link.search("imgbox")) {

                    GM_xmlhttpRequest ( {
                        method:     'GET',
                        url:        parent_link,
                        onload: function(response) {

                            var text = response.responseText
                            const start = `<meta property="og:image" content="`;
                            const end = `"/>`;
                            const middleText = text.split(start)[1].split(end)[0]
                            old_pic.src = middleText

                        }
                    });
                }
                if (parent_link.search("ibb")) {

                    GM_xmlhttpRequest ( {
                        method:     'GET',
                        url:        parent_link,
                        onload: function(response) {

                            var text = response.responseText
                            const start = `<link rel="image_src" href="`;
                            const end = `">`;
                            const middleText = text.split(start)[1].split(end)[0]
                            old_pic.src = middleText

                        }
                    });
                }
                if (parent_link.search("imagevenue")) {

                    GM_xmlhttpRequest ( {
                        method:     'GET',
                        url:        parent_link,
                        onload: function(response) {

                            console.log(response.responseText);
                            var text = response.responseText
                            const start = `target="_blank" data-toggle="full">
                                        <img src="`;
                            const end = `" alt="`;
                            const middleText = text.split(start)[1].split(end)[0]
                            old_pic.src = middleText

                        }
                    });
                }
            }
        }
    }


})();