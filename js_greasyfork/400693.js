// ==UserScript==
// @name         AWS Cloudwatch Timeago
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Show timeago in AWS CloudWatch Last Event Time
// @author       himalay
// @match        https://*.console.aws.amazon.com/cloudwatch/home*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400693/AWS%20Cloudwatch%20Timeago.user.js
// @updateURL https://update.greasyfork.org/scripts/400693/AWS%20Cloudwatch%20Timeago.meta.js
// ==/UserScript==

(function () {
    var waitInterval = setInterval(function () {
        var tBody = document.querySelector("#gwt-debug-dataTable tbody");
        if (tBody) {
            clearInterval(waitInterval);
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (!mutation.addedNodes) return;

                    mutation.addedNodes.forEach(function (node) {
                        var el = node.querySelector(".GIYU-ANBMNB > div");
                        if (el) {
                            var dateText = el.textContent.trim();
                            if (dateText) {
                                var timeAgo = ago(new Date(dateText).getTime());
                                el.innerHTML += ` (${timeAgo})`;
                            }
                        }
                    });
                });
            });

            observer.observe(tBody, {
                childList: true,
                subtree: false,
                attributes: false,
                characterData: false,
            });
        }
    }, 100);

    function ago(v){v=0|(Date.now()-v)/1e3;var a,b={second:60,minute:60,hour:24,day:7,week:4.35,month:12,year:1e4},c;for(a in b){c=v%b[a];if(!(v=0|v/b[a]))return c+' '+(c-1?a+'s':a)}}
})();