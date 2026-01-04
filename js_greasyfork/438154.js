// ==UserScript==
// @name         Steam redeem helper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Steam redeem check accept SSA and focus on product key input.
// @author       Santeri Hetekivi
// @match        https://store.steampowered.com/account/registerkey*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438154/Steam%20redeem%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/438154/Steam%20redeem%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to use for injecting accept_focus function call after DisplayPage call.
    function inject_accept_focus()
    {
        try
        {
            // Rename DisplayPage function.
            if(typeof window !== "object")
                throw "window was not object!";
            if(typeof window.DisplayPage !== "function")
                throw "Function window.DisplayPage not found!";
            window.oldDisplayPage = window.DisplayPage;

            // Define new DisplayPage function
            window.DisplayPage = function(_page)
            {
                var return_val = undefined;
                try
                {
                    console.debug("DisplayPage(", _page, ") called.");
                    return_val = window.oldDisplayPage(_page);
                    // If page is code
                    if(_page === "code")
                    {
                        // and accept focus function is defined
                        if(typeof accept_focus !== "function")
                            throw "Function accept_focus not found!";
                        // call accept_focus function.
                        accept_focus();
                    }
                    // If page is receipt
                    else if(_page === "receipt")
                    {
                        // return to code page
                        DisplayPage("code");
                        // and inform user that code was redeemed.
                        DisplayErrorMessage("SUCCESS!<br>Code redeemed!");
                    }
                }
                catch(_err)
                {
                    console.error("Function DisplayPage: ", _err);
                }
                return return_val;
            }
            console.debug("Function accept_focus injected to function DisplayPage.");
        }
        catch(_err)
        {
            console.error("Function inject_accept_focus: ", _err);
        }
    }

    // Function to accept ssa and focus to product key.
    function accept_focus()
    {
        console.debug("Function accept_focus called.");
        document.getElementById("accept_ssa").checked = true;
        document.getElementById("product_key").focus();
    }

    // Add function to page.
    var script = document.createElement('script');
    script.appendChild(document.createTextNode(accept_focus));
    script.appendChild(document.createTextNode('('+ inject_accept_focus +')();'));
    (document.body || document.head || document.documentElement).appendChild(script);

    // Call function.
    accept_focus();
})();