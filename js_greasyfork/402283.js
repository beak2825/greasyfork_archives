// ==UserScript==
// @name         Add magnet to 115
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Jin Liu
// @match        http*://*/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/402283/Add%20magnet%20to%20115.user.js
// @updateURL https://update.greasyfork.org/scripts/402283/Add%20magnet%20to%20115.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function add_magnet_to_115(magnet) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://localhost:3333/add-magnet-to-115",
            data: "param1=" + magnet,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function (response) {
                if(response.status == 200) {
                    alert("Added magnet to 115 successfully.");
                } else {
                     alert(response.responseText);
                }
            },
            onerror: function (response) {
                alert(response.responseText);
            }
        });
    }

    // 有些链接是动态加载的，所以设定了一个延时
    setTimeout(function() {
        inject();
    }, 2000);

    function inject() {
        var links = document.querySelectorAll('a');
        Array.prototype.forEach.call(links, function(link) {
            var href;
            if (link.hasAttribute('href')) {
                href = link.getAttribute('href');
                if (href.startsWith("magnet:?") || href.startsWith("thunder://") || href.startsWith("ed2k://")) {
                    var ele = document.createElement('a');
                    ele.style.cssText = 'background: #2777F8 !important; border-radius: 3px !important; color: white !important; padding: 3px !important; margin: 2px !important; cursor: pointer !important';
                    ele.innerHTML = '115';
                    ele.addEventListener('click', function (e) {
                        add_magnet_to_115(href);
                        e.stopPropagation();
                    }, false);
                    link.parentNode.insertBefore(ele, link);
                }
            }
        });

    }

})();

