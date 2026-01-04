/*
 * Wikidot PM Shortcut
 * Modified from https://scp-wiki.wdfiles.com/local--files/usertools/scpwiki-pm-shortcut.user.js
*/

// ==UserScript==
// @name          Wikidot PM shortcut
// @namespace     https://xtexx.eu.org/
// @version       1.0.0
// @description   Script that adds a small envelope icon next to usernames for a Wikidot PM shortcut
// @author        xtex
// @match         *://www.scp-wiki.net/*
// @match         *://*.wikidot.com/*
// @license       MIT
// @grant		  none
// @downloadURL https://update.greasyfork.org/scripts/497279/Wikidot%20PM%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/497279/Wikidot%20PM%20shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var loginStatus = document.getElementById('login-status');
    var myAccount = document.getElementById('my-account');

    function addCheckSpan()
    {
        var span = document.createElement('span');
        span.id = "checkEnvelope";
        span.style.display = "none";
        // document.getElementById('recent-posts-container').appendChild(span);
        document.body.appendChild(span);
    }

    function addEnvelopes()
    {
        // console.log('Doing addEnvelopes');
        if (!document.getElementById('checkEnvelope'))
        {
            // console.log('Checkspan not found.');
            var container = document.getElementById('content-wrap');
            var spans = container.getElementsByTagName('span');
            var userNumber;

            for (let x in spans)
            {
                const span = spans[x];
                if (span.innerHTML && span.innerHTML.indexOf("user:info") != -1 && span.innerHTML.indexOf("messages#/new/") == -1)
                {
                    // console.log("Found a user");
                    userNumber = span.innerHTML.substring(span.innerHTML.indexOf('userInfo(') + 9, span.innerHTML.indexOf(');'));
                    span.innerHTML += "<a href=\"http://www.wikidot.com/account/messages#/new/" + userNumber + "\" target=\"_blank\"><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAICAIAAABChommAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAEVSURBVHjaVJDNSsNAFIVnkslkTH8oUjSk0GQRYuLKQKXPoD6BG0HBJ3PlqroQulLjRrtRuxJ8AqEGIvlrMpMZJyKIl7O697v3HC6c7gfnp0eqhgRlAIK/EkDB2jpfX1zO0dnJwa5vh6FHCBaMgV9QQE3L83K5fD9mh0qv37EdazaL4lWSpmWSpFJZVq4+4uurB9cdGx1VoVVtjYbhnnt7/yyEMAzd2CCMNnfRy3Tib20PaM2QvM6r2hmbvOE380WvS6RZmpeTcGdkDXlFIQRItqAQRVE5tokQ+oy/ZKrAdyxzsyhrHbcAwroO+91BywIvsD1VaXMzziklRI4MTDCKHl+TjDVVJv49APxsAZXgp8XbtwADAHq0bNwCmPgUAAAAAElFTkSuQmCC\" style=\"margin-left: 5px; margin-right: 5px;\"></a>";

                    if (!document.getElementById('checkEnvelope'))
                    {
                        // console.log('Adding checkspan at ' + x);
                        addCheckSpan();
                    }
                }
            }
        }
    }

    if (myAccount)
    {
        setTimeout(addEnvelopes, 500);
        setInterval(addEnvelopes, 5000);
    }
})();