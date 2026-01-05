// ==UserScript==
// @name         Bitsoup Stop Whining
// @namespace    http://takebackbitsoup.com
// @version      1.05
// @description    Removes begspam from Bitsoup
// @include        http://*.bitsoup.me/*
// @include        https://*.bitsoup.me/*
// @include        http://*.soupbit.me/*
// @include        https://*.soupbit.me/*
// @include        http://*.bitsoup.org/*
// @include        https://*.bitsoup.org/*
// @run-at         document-end
// @author       bitskewer
// @match        http://*.bitsoup.me/*
// @match        https://*.bitsoup.me/*
// @match        http://*.soupbit.me/*
// @match        https://*.soupbit.me/*
// @match        http://*.bitsoup.org/*
// @match        https://*.bitsoup.org/*
// @locale         en
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/12119/Bitsoup%20Stop%20Whining.user.js
// @updateURL https://update.greasyfork.org/scripts/12119/Bitsoup%20Stop%20Whining.meta.js
// ==/UserScript==


var link = $('a:contains("Here")');
var spam;
if (link && link.length == 1 && link.attr("href")) {
    if (link.html().length == 20) 
        spam = $("table[width=600]");
    else
        link = null;
}

window.addEventListener("load", function(e) {
  addButton();
}, false);
 
function addButton(){
    $("#restoreButton").html('<input id="restoreButton" type="button" value="Begging message removed - Click here to view it" />');
    $("#restoreButton").bind('click', doRestore);
}
 
function doRestore() {
    if (spam) {
        spam.show();
        $("#restoreButton").hide();
    }
}


var dismiss = function() {
    // jquery doesn't seem to do position absolute so use DOM directly
    var iframe = document.createElement('iframe');
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.position = 'absolute';
    iframe.style.top = '10px';
    iframe.style.left = '10px';
    iframe.src = link.attr("href");
    document.body.appendChild(iframe);    
};

if (spam) {
    spam.hide(1000);
    setTimeout(dismiss, 3000 + (Math.random() * 7000));

    $( "<button id='restoreButton'></button>" ).insertAfter(spam);
}

