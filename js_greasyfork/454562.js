// ==UserScript==
// @name         Bing Redirection Remove
// @namespace    https://github.com/huangzhan/gm-scripts
// @version      0.4
// @description  Just remove redirection from Bing search results
// @author       Huang Zhan
// @match        https://*.bing.com/*
// @icon         data:image/gif;base64,R0lGODlhIQAhAHAAACH5BAEAAPwALAAAAAAhACEAhwAAAAAAMwAAZgAAmQAAzAAA/wArAAArMwArZgArmQArzAAr/wBVAABVMwBVZgBVmQBVzABV/wCAAACAMwCAZgCAmQCAzACA/wCqAACqMwCqZgCqmQCqzACq/wDVAADVMwDVZgDVmQDVzADV/wD/AAD/MwD/ZgD/mQD/zAD//zMAADMAMzMAZjMAmTMAzDMA/zMrADMrMzMrZjMrmTMrzDMr/zNVADNVMzNVZjNVmTNVzDNV/zOAADOAMzOAZjOAmTOAzDOA/zOqADOqMzOqZjOqmTOqzDOq/zPVADPVMzPVZjPVmTPVzDPV/zP/ADP/MzP/ZjP/mTP/zDP//2YAAGYAM2YAZmYAmWYAzGYA/2YrAGYrM2YrZmYrmWYrzGYr/2ZVAGZVM2ZVZmZVmWZVzGZV/2aAAGaAM2aAZmaAmWaAzGaA/2aqAGaqM2aqZmaqmWaqzGaq/2bVAGbVM2bVZmbVmWbVzGbV/2b/AGb/M2b/Zmb/mWb/zGb//5kAAJkAM5kAZpkAmZkAzJkA/5krAJkrM5krZpkrmZkrzJkr/5lVAJlVM5lVZplVmZlVzJlV/5mAAJmAM5mAZpmAmZmAzJmA/5mqAJmqM5mqZpmqmZmqzJmq/5nVAJnVM5nVZpnVmZnVzJnV/5n/AJn/M5n/Zpn/mZn/zJn//8wAAMwAM8wAZswAmcwAzMwA/8wrAMwrM8wrZswrmcwrzMwr/8xVAMxVM8xVZsxVmcxVzMxV/8yAAMyAM8yAZsyAmcyAzMyA/8yqAMyqM8yqZsyqmcyqzMyq/8zVAMzVM8zVZszVmczVzMzV/8z/AMz/M8z/Zsz/mcz/zMz///8AAP8AM/8AZv8Amf8AzP8A//8rAP8rM/8rZv8rmf8rzP8r//9VAP9VM/9VZv9Vmf9VzP9V//+AAP+AM/+AZv+Amf+AzP+A//+qAP+qM/+qZv+qmf+qzP+q///VAP/VM//VZv/Vmf/VzP/V////AP//M///Zv//mf//zP///wAAAAAAAAAAAAAAAAj/APfVy4RGTMGDBhPu26csBoCHECNCVLZPosWHmRY6vHhRzEMxCREWFLNwn0eOHNGUXMmyJMiXINFstDippc2bDFGqxMlzXyaUADLarEcRJ7GIMW5I3MnyJ4CaNp1CNCkRKsuZUSOugEY1ItOVWJtKdFnVptKHYiHGWHkS4teSYRdKRcu2bMuzAErOXcuy7cO3Gqf61GrW7tWpcw3cRPNwI+B9M5Uh5SnmhuSnhQGsmNxz4UOrYC3y7VwRwGO8D2+QXnj28UygputCBA0XdsSVjGfb9At0hey/NyeFjEncYNGFkyLSXn3T72PmLJPrhs6T8ebY1HHm/pwdp0cDwLvbKpTOXXzL3EpjoFnPnv2k9e/RvI9PX75MAGIu294fkauyk5tdx59F+e0TEAA7
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/454562/Bing%20Redirection%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/454562/Bing%20Redirection%20Remove.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fixURL(elements) {
        const res = document.querySelector(elements);
        if (!res) {
            return;
        }
        for (var i = 0; i < res.childElementCount; i++) {
            const curNode = res.childNodes[i];
            var anodes = curNode.querySelectorAll("a");
            var j;
            for (j = 0; j < anodes.length; j++) {
                var anode = anodes[j];
                if (anode.href) {
                    var url = new URL(anode.href);
                    if (url.pathname == "/ck/a") {
                        var u = url.searchParams.get("u").slice(2).replace(/-/g, '+').replace(/_/g, '/');
                        var nurl = atob(u);
                        if (nurl) {
                            anode.href = nurl;
                        }
                    }
                }
            }
        }
    }

    fixURL("ol#b_results");
    fixURL("ol#b_context");

    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            for (let node of mutation.addedNodes) {
                if (node.id === "b_content") {
                    fixURL("ol#b_results");
                    fixURL("ol#b_context");
                }
            }
        }
    };

    const observer = new MutationObserver(callback);

    observer.observe(document.body, { childList: true});
})();