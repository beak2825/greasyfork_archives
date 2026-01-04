// ==UserScript==
// @name         5ch-open2ch-URL-改変スクリプト
// @namespace    idk
// @version      2.0.0
// @description  5ch, open2chで簡単なurlの改変を行うスクリプト. (全表示強制）built with help of ChatGPT.
// @author       Chibiaoiro
// @match        https://*.open2ch.net/*
// @match        https://*.5ch.net/*
// @grant        none
// @license      MIT
// @supportURL   https://github.com/Chibiaoiro/5ch-scripts/
// @downloadURL https://update.greasyfork.org/scripts/470038/5ch-open2ch-URL-%E6%94%B9%E5%A4%89%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/470038/5ch-open2ch-URL-%E6%94%B9%E5%A4%89%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current page's URL
    var currentUrl = window.location.href;

    console.log("current url is " + currentUrl + " (by URL mod Script)")

    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                var links = document.querySelectorAll('a[href]');

                links.forEach(function(link) {
                    var href = link.getAttribute('href');

                    //5ch.net
                    if (currentUrl.includes("5ch.net")){
                         //5ch.home.page
                     /* if (currentUrl == 'https://5ch.net/' && !href.includes("/read.cgi/c/")){
                          var modifiedUrl = href.replace("/read.cgi/", "/read.cgi/c/");
                          link.setAttribute('href', modifiedUrl);
                          console.log("The [5ch.home.page] worked on this site");
                        }*/
                        //5ch.primary(この行削除で5chでの強制全表示の機能無効化)
                        if ((href.includes("/l50")) && !currentUrl.includes("/test/read.cgi/")){
                          //var modifiedUrl = href.replace("/read.cgi/", "/read.cgi/c/");
                          var modifiedUrl = href.replace("/l50", "");
                          link.setAttribute('href', modifiedUrl);
                          console.log("The [5ch.primary] worked on this site");
                        }//5ch.find.page
                     /* if (currentUrl.includes('find.5ch.net/') && !href.includes("/read.cgi/c/")){
                          var modifiedUrl = href.replace("/read.cgi/", "/read.cgi/c/");
                          link.setAttribute('href', modifiedUrl);
                          console.log("The [5ch.find.page] worked on this site");
                        }//5ch.read.cgi
                        if (currentUrl.includes("test/read.cgi/") && !href.includes("/c/")){ 
                          var modifiedUrl = href.replace("/read.cgi/", "/read.cgi/c/");
                          link.setAttribute('href', modifiedUrl);
                          console.log("The [5ch.read.cgi] worked on this site");
                        }*/
                    }

                    //open2ch(この行削除でopen2chでの強制全表示の機能無効化)
                    if ((window.location.hostname.includes("open2ch.net")) && !currentUrl.includes("/read.cgi")){
                        if (href.includes("/l30")){
                            var modifiedUrl = href.replace("/l30", "/")
                            link.setAttribute('href', modifiedUrl);
                            console.log("The [open2ch.l30] worked on this site");
                        }
                        if (href.includes("/l10")){
                            var modifiedUrl = href.replace("/l10", "/")
                            link.setAttribute('href', modifiedUrl);
                            console.log("The [open2ch.l10] worked on this site");
                        }
                        if (href.includes("/l50")){
                            var modifiedUrl = href.replace("/l50", "/")
                            link.setAttribute('href', modifiedUrl);
                            console.log("The [open2ch.l50] worked on this site");
                        }
                    }

               });
            }
        }
    });

    var targetNode = document.body;

    observer.observe(targetNode, { childList: true, subtree: true });
})();
