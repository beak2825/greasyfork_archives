// ==UserScript==
// @name        autopager
// @match       http://*/*
// @match       https://*/*
// @version     1.1
// @author      -
// @namespace https://greasyfork.org/users/1259735
// @description 2024/11/13 00:33:38
// @downloadURL https://update.greasyfork.org/scripts/517041/autopager.user.js
// @updateURL https://update.greasyfork.org/scripts/517041/autopager.meta.js
// ==/UserScript==

(function () {
    function universal() {
    const hostname = window.location.hostname
    if (hostname == "d15.876515.xyz") {
        var updateAreaContentElement = document.querySelector('.update_area_content');
        var xpath = "(//div[@class='page'])[2]/a";
        var result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        var thisNode = result.iterateNext();
        while (thisNode) {
            var href = thisNode.href;
            if (href) {
                getPageE(href)
            }
            thisNode = result.iterateNext();
        }

        function getPageE(url) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.timeout = 5000;
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var parser = new DOMParser();
                    var container = parser.parseFromString(xhr.responseText, 'text/html');
                    var content = container.querySelectorAll('.content')[1];
                    updateAreaContentElement.parentNode.insertBefore(content, updateAreaContentElement);
                }
            };
            xhr.send();
        }
    }
    if (hostname == "www.ku138.cc") {
        console.log("starting update:", hostname)
        var updateAreaContentElement = document.querySelector('.page');
        var xpath = "(//div[@class='page'])/a";
        var result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        var thisNode = result.iterateNext();
        while (thisNode) {
            var href = thisNode.href;
            if (href) {
                console.log("get conetent from: ", href)
                getPageE(href)
            }
            thisNode = result.iterateNext();
        }
        function getPageE(url) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.timeout = 5000;
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var parser = new DOMParser();
                    var container = parser.parseFromString(xhr.responseText, 'text/html');
                    var content = container.querySelectorAll('.content')[0];
                    updateAreaContentElement.parentNode.insertBefore(content, updateAreaContentElement);
                }
            };
            xhr.send();
        }
    }
}
    setTimeout(() => {
        universal()
    }, 3000)
})();