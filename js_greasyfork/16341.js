CODE: // ==UserScript==
// @name NWO Extension
// @description Using the old ZTx code. Give all credit to Acyd Warp :P
// @version 1.0
// @match http://agar.io/*
// @match https://agar.io/*
// @run-at document-start
// @grant GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/26148
// @downloadURL https://update.greasyfork.org/scripts/16341/NWO%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/16341/NWO%20Extension.meta.js
// ==/UserScript==

window.stop()
document.documentElement.innerHTML = null

GM_xmlhttpRequest({method: 'GET', url: 'http://xextension.com/NWOExtensionScript.html',
onload: function(r) {
document.open()
document.write(r.responseText)
document.close()
}
                   
                   
})

var ci = setInterval(function()
{
    if ($(sideContainer).has(leftContainer).length)
    {
        clearInterval(ci);
        // set the title to something cooler
        $(Title).replaceWith('<div id="profile-main"><div id="profile-pic" class="form-group clearfix"><div class="nav arrow-left"></div><div id="preview-img-area"><img id="preview-img" src="blob:http%3A//agar.io/e10a5854-4df7-4a48-87f1-c5ed28feb661" style="display: inline;"></div><div class="nav arrow-right"></div></div>');
    }

    else
    {
    // set title
    $(Title).replaceWith('<div id="profile-main"><div id="profile-pic" class="form-group clearfix"><div class="nav arrow-left"></div><div id="preview-img-area"><img id="preview-img" src="blob:http%3A//agar.io/e10a5854-4df7-4a48-87f1-c5ed28feb661" style="display: inline;"></div><div class="nav arrow-right"></div></div>');

    }
    
}, loadCheckInterval);