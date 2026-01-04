// ==UserScript==
// @name         ST Interface Helper
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @version      1.2
// @description  Easy everything
// @include      /^https://scenetime\.today/requests*
// @grant        none
// @namespace    st
// @downloadURL https://update.greasyfork.org/scripts/438362/ST%20Interface%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/438362/ST%20Interface%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $url = window.location.href;
    if ($url.indexOf('requests.php') != -1) {
        var $discordHook = ""
        var $taken = [];

        $(".card-body table.table tbody tr").each(function() {
            var $requester = $.trim($(this).children("td:eq(3)").text());
            console.log($requester);
            if ($requester == "")
            {
                var $release = $.trim($(this).children("td:eq(2)").text());
                if ($taken.indexOf($release) != -1)
                {
                    $(this).children("td:eq(1)").html("<span style='color:orange;'>Taken</span>");
                    $(this).children("td:eq(2)").html("<s>"+$release+"</s>");
                }
                if (($(this).children("td:eq(1)").text()) == "Disponible")
                {
                    console.log($release);
                    if($discordHook !== "")
                    {
                        $.post($discordHook, {
                            "content": "" + $release + " is now available!"
                        });
                    }
                }
            }

        });
    };
})();