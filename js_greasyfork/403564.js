// ==UserScript==
// @name         cs.rin.ru VR only filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filter out non vr forums when "V" key is pressed.
// @author       You
// @include      https://cs.rin.ru/forum/viewforum.php*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/403564/csrinru%20VR%20only%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/403564/csrinru%20VR%20only%20filter.meta.js
// ==/UserScript==


GM_xmlhttpRequest({
    method : "GET",
    url : "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.slim.min.js",
    onload : (ev) =>
    {
        let e = document.createElement('script');
        e.innerText = ev.responseText;
        document.head.appendChild(e);
    }
});

(function() {
    'use strict';
    let alreadyRan = false;

    document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === 86) {
            if(!alreadyRan) {
                alreadyRan=true;
                $('#pagecontent table tr').each(function() {
                    if($(this).find('td').length == 6 && !$(this).find('.topictitle').text().includes('VR ')) this.remove();
                });
            }
        }
    });
})();