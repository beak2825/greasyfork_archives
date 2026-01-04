// ==UserScript==
// @name         random.org_v2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to takВла есом вщять всe over the world!
// @author       You
// @match        https://www.random.org/widgets/integers/iframe*
// @icon         https://www.google.com/s2/favicons?domain=random.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458373/randomorg_v2.user.js
// @updateURL https://update.greasyfork.org/scripts/458373/randomorg_v2.meta.js
// ==/UserScript==

const winNums = [13];

(function() {
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4) {
                var num = winNums.shift();
                if (num) {
                    var responseText = this.responseText;
                    var e = document.createElement('div');
                    e.innerHTML = responseText;
                    e.getElementsByTagName('span')[0].innerText = num + '\n';
                    Object.defineProperty(this, 'responseText', {writable: true});
                    this.responseText = e.innerHTML;
                }
            }
        });
        return open.apply(this, arguments);
    };
})();