// ==UserScript==
// @name         Flash sigs to HTML
// @version      0.2
// @description  Changes the avatar sigs of the forum to use dfprofiler's
// @author       A Meaty Alt
// @include      /fairview\.deadfrontier\.com\/onlinezombiemmo\/index\.php\?topic=/
// @grant        none
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/34592/Flash%20sigs%20to%20HTML.user.js
// @updateURL https://update.greasyfork.org/scripts/34592/Flash%20sigs%20to%20HTML.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var commentsAmount = $("#quickModForm")[0].children[0].children[0].children.length - 1;
    for(var i=1; i<=commentsAmount; i++){
        var flashSig = $("#flashForum" + i);
        if(!flashSig[0]) continue;
        var params = flashSig.find("param[name=flashvars]").val();
        var userId = params.match(/userID=(.*?)&/)[1];
        var username = params.match(/df_name=(.*?)&/)[1];
        var sigHolder = document.createElement("a");
        sigHolder.href = "http://www.dfprofiler.com/profile/view/"+userId;
        sigHolder.id = "flashHolder"+i;
        sigHolder.style.visibility = "visible";
        sigHolder.innerHTML = "<img src='http://www.dfprofiler.com/signaturereplicate.php?profile="+userId+"' alt='"+username+"\'s profile bar' />";
        $("#flashForum" + i)[0].outerHTML = sigHolder.outerHTML;
    }
})();