// ==UserScript==
// @name           Feedly Star Opener Custom
// @namespace      
// @description    Starred item open in a lump for Feedly for Firefox
// @grant          GM_openInTab
// @include        http://feedly.com/*
// @include        https://feedly.com/*
// @include        http://www.feedly.com/*
// @include        https://www.feedly.com/*
// @include        http://cloud.feedly.com/*
// @include        https://cloud.feedly.com/*
// @include        http://www.cloud.feedly.com/*
// @include        https://www.cloud.feedly.com/*
// @match          http://feedly.com/*
// @match          https://feedly.com/*
// @match          http://www.feedly.com/*
// @match          https://www.feedly.com/*
// @match          http://cloud.feedly.com/*
// @match          https://cloud.feedly.com/*
// @match          http://www.cloud.feedly.com/*
// @match          https://www.cloud.feedly.com/*
// @version        1.0.4
// @downloadURL https://update.greasyfork.org/scripts/13988/Feedly%20Star%20Opener%20Custom.user.js
// @updateURL https://update.greasyfork.org/scripts/13988/Feedly%20Star%20Opener%20Custom.meta.js
// ==/UserScript==

(function() 
{
    var MAX_WINDOW_OPEN = 128;
    var onKeyDown = function(event)
    {
        // push "w" key
        if(event.keyCode == 87 && !event.shiftKey) 
        {
            var entries = document.evaluate('//div[@id="section0_column0"]//div[@class="u0Entry quicklisted "]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            for (var i = entries.snapshotLength - 1, m = MAX_WINDOW_OPEN; i >= 0 && m > 0; i--) 
            {
                var entry = entries.snapshotItem(i);
                m--;

                var stars = document.evaluate('.//div[@class="quicklistHandle"]', entry, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                if (stars.snapshotLength == 0) 
                {
                    continue;
                }
                
                var news = document.getElementsByClassName("condensedTools");
                //var links = document.evaluate('.//a[@class="title read"]', entry, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                var links = news[i].getElementsByTagName('a');
                var linkURL = String(links[0]);
                if(links[0] == "about:blank")
                {
                    continue;
                }
                               
                //window.open(links[0]);
                GM_openInTab(links[0]);
                
                var star = stars.snapshotItem(0);
                var event = document.createEvent('MouseEvents');
                event.initEvent('click', true, true);
                star.dispatchEvent(event);
            }
        }
    }
    document.addEventListener('keydown', onKeyDown, false);
})();

