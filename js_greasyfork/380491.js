// ==UserScript==
// @name         G.t.H.I.
// @namespace    https://greasyfork.org/zh-CN/users/269998-hu71e
// @version      0.3.1
// @description  Get the Hidden Images
// @author       You
// @match        http*://*.xxkuku.biz/*
// @match        http*://*.qinqiuqiu.org/*
// @match        http*://*.qin13.xyz/*
// @require
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380491/GtHI.user.js
// @updateURL https://update.greasyfork.org/scripts/380491/GtHI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var page_url = window.location.href;
    if (page_url.includes("qin13")) {
        var t = document.getElementsByClassName('total');
        var tv = t[0].innerHTML;
        total = Number(tv);
        console.log("total.values: " + total);

    } else {
        var mutationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    if (page_url.includes("xxkuku") || page_url.includes("qinqiuqiu.org/images/show")) {

                        var n_list = document.getElementsByClassName('content');
                        console.log(n_list.length);

                        for (var i = 0; i < n_list.length; i++) {
                            var n_list_c = n_list[i].children;
                            var n_list_cc = n_list_c[0].children;
                            if (page_url.includes("xxkuku")) {
                                //xxkuku.biz
                                console.log(page_url);
                                n_list_cc[4].style.display = "block";
                            } else if (page_url.includes("qinqiuqiu.org/images/show")) {
                                //qinqiuqiu.org
                                console.log(page_url);
                                if (typeof(n_list_c[2].style) == 'object') {
                                    console.log(valueOf(n_list_c[2].style.display));
                                    n_list_c[2].style.display = "block";
                                }
                            } else {
                            console.log("other urls");
                            }
                        }
                    } else if (page_url.includes("qinqiuqiu.org/video/play")) {
                        console.log(page_url);
                        console.log(trySeeTime);
                        if (trySeeTime <= 10) {
                            trySeeTime=999999999;
                        }
                    }
                    //console.log("child list:");
                    //console.log(mutation);
                }
            });
        });
        mutationObserver.observe(document.documentElement, {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true
       });
    }
})();