// ==UserScript==
// @name         Open Squarespace admin/edit page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  When you're viewing a site you own on squarepsace, click a button to go to the SS admin panel (not quite in edit mode for that page, but at least for its category, usually)
// @author       Darin Kelkhoff
// @match        https://www.yoursite-from-squarespace.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408963/Open%20Squarespace%20adminedit%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/408963/Open%20Squarespace%20adminedit%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function __openSSEditor()
    {
        try
        {
            var url = 'https://' + Static.SQUARESPACE_CONTEXT.website.identifier + '.squarespace.com/config/pages/' + Static.SQUARESPACE_CONTEXT.collection.id;
            // alert("Trying... " + url);
            window.open(url)
        }
        catch(e)
        {
            alert("Error opening squarespace edit page - are you sure this is a squarespace site?\n\n" + e);
        }
    }

    var editButton = document.createElement("button")
    editButton.onclick = __openSSEditor;
    editButton.innerHTML = "Edit";
    editButton.style.position = "fixed"
    editButton.style.bottom = "10px"
    editButton.style.right = "10px";
    editButton.style.zIndex = "999999";
    document.querySelector("body").appendChild(editButton);

})();