// ==UserScript==
// @name         links.snahp.it
// @namespace    https://links.snahp.it/
// @version      0.1
// @description  Create copy button
// @author       HEVC10bit
// @match        https://links.snahp.it/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/367958/linkssnahpit.user.js
// @updateURL https://update.greasyfork.org/scripts/367958/linkssnahpit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a_links = $("#content > center > p > a");
    var links = '';
    for(var i = 0;i < a_links.length; i++){
        if(a_links[i].host != 'links.snahp.it'){
            links += a_links[i].href + '\n';
        }
    }
    console.log(links);

    var copyFrom = $('<textarea/>');
    copyFrom.css({
        left: "0px",
        top: "0px",
        width: "0px",
        height: "0px",
        position: "absolute"
    });

    copyFrom.text(links);
    copyFrom.select();
    $('#content > center').prepend(copyFrom);
    var copyButton = $('<input type="button" id="copy" value="Copy!">');
    copyButton.css({
        width: "300px",
        height: "40px",
        margin: "30px",
        "font-size": "24px"
    });
    $('#content > center').prepend(copyButton);

    $('#copy').click(function(){
        copyFrom.text(links);
        copyFrom.select();
        document.execCommand('copy');
    });

})();