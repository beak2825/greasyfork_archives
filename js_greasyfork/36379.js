// ==UserScript==
// @name         Faucethunt Auto
// @namespace    http://www.cryptonews.fun
// @version      1.1
// @description  Go to: https://www.faucethunt.win/?ref=4352
// @author       Gastino
// @match        https://www.faucethunt.win/*
// @match        https://www.faucethunt.com/*
// @match        https://faucethunt.win/*
// @match        https://faucethunt.com/*
// @downloadURL https://update.greasyfork.org/scripts/36379/Faucethunt%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/36379/Faucethunt%20Auto.meta.js
// ==/UserScript==

(function() {
    setInterval( function(){
        if($('#timer').text() === "")
        {
            $.ajax({
                type: 'POST',
                url: 'claim.php',
                dataType: "json",
                data:({"type":'claim'}),
                async: true,
                success: function (data) {
                    claimed = data.claimed;
                    $("#number-claimed").html(claimed);
                    window.setTimeout(function(){
                        location.reload();
                    }, 2000);
                }
            });
            return false;
        }
    },1000);
})();