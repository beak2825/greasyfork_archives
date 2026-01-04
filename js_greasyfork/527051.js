// ==UserScript==
// @name         Udemy Utility
// @namespace    https://leobi.blog
// @version      1.1
// @license      MIT
// @description  Udemy Utility - View Udemy.com Price
// @author       Leo Bi
// @match        https://*.udemy.cn/*
// @match        https://*.udemy.cn/organization/search/*
// @match        https://*.udemy.cn/organization/home/*
// @match        https://*.udemy.cn/courses/*
// @match        https://*.udemy.cn/course/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/527051/Udemy%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/527051/Udemy%20Utility.meta.js
// ==/UserScript==


(function($) {
    'use strict';

    const currentUrl = window.location.href;

    const UDEMY_COURSE_PRICE_KEY_PREFIX = "PRICE_";

    function attachPrice(linkElement, price) {

        var nodes = linkElement.contents();

        var nonDivText = '';

        nodes.each(function() {
            if (this.nodeType === Node.TEXT_NODE) {
                nonDivText += this.nodeValue;
            }
        });

        var resultText = nonDivText.trim() + ' - ' + price;

        linkElement.contents().filter(function() {
            return this.nodeType === Node.TEXT_NODE;
        }).remove();

        linkElement.prepend(resultText);
    }

    $(document).ready( function() {

        // adjust subtitle max width from 30em to 90em to adapt translation display
        if(currentUrl.includes("/course/")){
            GM_addStyle(`[class^="well--text--"] {max-width: 90em;}`);
        }

        if(currentUrl.includes("/courses/") || currentUrl.includes("/organization/search") || currentUrl.includes("/organization/home")) {
            console.log('wait 3 seconds here to allow web content to be fully loaded');
            setTimeout(function() {
                $('div[class^="course-card-module--main-content"]').each(function(index) {

                    if(index >= 30) {
                        return;
                    }

                    // console.log($(this).attr('class'));
                    let $linkElement = $(this).find('a');
                    let udemyCourseUrl = "https://www.udemy.com" + $linkElement.attr('href');

                    // check from cache first
                    let cachedPrice = GM_getValue(UDEMY_COURSE_PRICE_KEY_PREFIX + udemyCourseUrl, "DEFAULT_VALUE");
                    if(cachedPrice !== "DEFAULT_VALUE") {
                        console.log("read from cache successfully : " + cachedPrice);
                        attachPrice($linkElement, cachedPrice);
                    } else {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: udemyCourseUrl,
                            onload: function(response) {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(response.responseText, 'text/html');

                                const priceMeta = doc.querySelector('meta[property="udemy_com:price"]');
                                if (priceMeta) {
                                    const price = priceMeta.getAttribute('content');
                                    console.log(udemyCourseUrl + " - " + price);

                                    attachPrice($linkElement, price);

                                    GM_setValue(UDEMY_COURSE_PRICE_KEY_PREFIX + udemyCourseUrl, price);

                                } else {
                                    console.log('Price meta tag not found');
                                }
                            },
                            onerror: function(error) {
                                console.error('Error fetching Udemy course page:', error);
                                alert('Error fetching Udemy course page');
                            }
                        });
                    }
                });
            }, 3000);
        }


    });


})(jQuery);