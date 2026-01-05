// ==UserScript==
// @name         FA NoStreamMonitor
// @namespace    FurAffinity
// @version      0.1
// @description  Counts the number of streams hidden
// @author       JaysonHusky
// @match        https://www.furaffinity.net/msg/others/
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/24083/FA%20NoStreamMonitor.user.js
// @updateURL https://update.greasyfork.org/scripts/24083/FA%20NoStreamMonitor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var sc=0;
    sc = $("#messagecenter-other li :contains('stream')" ).length;
    var theStreamCount = '&nbsp;&nbsp;<i>(Streams Hidden: '+sc+')</i>';
    $("#messages-journals h2").append(theStreamCount);
})();