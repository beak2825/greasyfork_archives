// ==UserScript==
// @name         cnbeta显示精简列表
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  cnbeta网站显示精简列表，去掉摘要
// @author       You
// @match        https://www.cnbeta.com/
// @grant        none
// @license      L.J.B
// @downloadURL https://update.greasyfork.org/scripts/445663/cnbeta%E6%98%BE%E7%A4%BA%E7%B2%BE%E7%AE%80%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/445663/cnbeta%E6%98%BE%E7%A4%BA%E7%B2%BE%E7%AE%80%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const targetNode = $('.items-area').get(0);

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                                $("dl >a").hide();
                $("div dl dd").remove();
                $("div .meta-data").remove();
                $("div dl").css('padding-left','50px');
                $("div dl").css('background','none');
                $(".cnbeta-update-list .item").css("padding-top","0px");
 $(".item").css("height","45px");
                $(".cnbeta-update-list-article").hide();
                $(".item.cooperation").hide();
                $(".baidu_dropdown_box").hide();

                $(".cnbeta-update-list .item").css("background","none");

            }
            else if (mutation.type === 'attributes') {
                $(".item").css("height","45px");
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    // Your code here...
})();
