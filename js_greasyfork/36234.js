// ==UserScript==
// @name         NexusHD Helpful Plugins
// @description  Fetch easter eggs & refresh fatal errors
// @version      1.1
// @author       Secant(TYT@NexusHD)
// @include      http*://www.nexushd.org/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://code.jquery.com/jquery-migrate-1.0.0.js
// @grant        none
// @icon         http://www.nexushd.org/favicon.ico
// @namespace    https://greasyfork.org/users/152136
// @downloadURL https://update.greasyfork.org/scripts/36234/NexusHD%20Helpful%20Plugins.user.js
// @updateURL https://update.greasyfork.org/scripts/36234/NexusHD%20Helpful%20Plugins.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //============================================================
    var easter_egg_container=$("body>div[style^='position: absolute; bottom:']");
    if(easter_egg_container.length > 0){
        var target_url=easter_egg_container.find("a").attr("href");
        $.ajax({
            url: target_url,
            type: 'POST',
            success: function (data) {
                var parser = new DOMParser(), doc = parser.parseFromString(data, "text/html");
                var return_message = doc.querySelector('#outer td.text').innerText;
                if (return_message.match(/(获得|抢走)/)){
                	easter_egg_container.remove();
                }
            }
        });
    }
    if(window.location.href.match(/\/details\.php\?id=/)){
        if(!$('#compose')[0]){
            var t_id = window.location.href.match(/id=(\d+)/)[1];
            window.location.href = 'retriver.php?id='+t_id+'&type=2&siteid=1';
        }
    }
})();