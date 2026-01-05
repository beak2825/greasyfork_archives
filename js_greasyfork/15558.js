// ==UserScript==
// @name         Youtube
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  private
// @author       You
// @include      https://www.youtube.com*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/15558/Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/15558/Youtube.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
(function(){  
    'use strict';    
    var stopTampering = 'STOPTAMPERMONKEY=true';
    var currentUrl = window.location.href;
    
    if(currentUrl.indexOf(stopTampering) > -1)
    {
        return;
    }
    
    if($('.yt-user-info a').text() === 'TheJapanChannelDcom')
    {        
        window.location.href = currentUrl + '&t=10&' + stopTampering;
    }
})();