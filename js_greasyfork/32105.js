// ==UserScript==
// @name         hnlBot channel switcher
// @namespace    https://g4v.me
// @version      0.0.4
// @description  hnlBot faster channel switcher
// @author       Gav
// @match        https://beta.hnlbot.com/*
// @match        http://beta.hnlbot.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32105/hnlBot%20channel%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/32105/hnlBot%20channel%20switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {

        function changeChannel(){
            var channelName = prompt("Please provide a name");
            $.get('https://beta.hnlbot.com/api/switchUser/?user=' + channelName, function(response){
                if (response) {
                    location.reload();
                }
            });
        }

        var r= $('<button id="bgnBtn" class="btn btn-xs btn-hnl">Change User</button>');
        $(".managingFor").append(r);
        $("#bgnBtn").on("click", changeChannel);

    });
})();