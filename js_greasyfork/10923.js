// ==UserScript==
// @name          WaniKani script to disable timeout
// @namespace     https://www.wanikani.com
// @description   Automatically click the info button upon wrong review answer.
// @version       0.1
// @include       https://www.wanikani.com/review/session
// @include       http://www.wanikani.com/review/session
// @include       https://www.wanikani.com/lesson/session
// @include       http://www.wanikani.com/lesson/session
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/10923/WaniKani%20script%20to%20disable%20timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/10923/WaniKani%20script%20to%20disable%20timeout.meta.js
// ==/UserScript==

/*global $, console*/

/*
hook wrongCount jStorage
upon field update with increased value
automatically click the show info button
after a slight delay (to avoid a display glitch)
*/

(function () 
 {
    'use strict';

    var lastWrongCount = 0;
    $.jStorage.listenKeyChange('questionCount', function (key, action) {
        var wrongCount;
        if (action === 'updated') {
            wrongCount = $.jStorage.get('questionCount');
            if (wrongCount > lastWrongCount) {
                setTimeout(function () 
                {
                    if (!$("#item-info").is(":visible"))
                       $('#option-item-info').click();
                }, 100);
            }
            lastWrongCount = wrongCount;
        }
    });

    setTimeout(function () 
    {
        idleTime.increment = function() 
          {
            /*var $related;
            $related = $("#timeout");
            t = 1;
            if (t > 9 && $related.is(":hidden")) 
            {
              return idleTime.view();
            }*/
          };
        console.log('Loaded timeout disable.');
    }, 100);
     
    console.log('WaniKani Review Wrong Info Click: script load end');
}());
