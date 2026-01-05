// ==UserScript==
// @name         External Iframe
// @author       DCI
// @description  launches HIT in iframe at external site
// @namespace    www.redpandanetwork.org
// @version      1.0
// @include      *
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @testurl      https://dl.dropboxusercontent.com/u/353548/Test Pages/bllockathlete.html
// @downloadURL https://update.greasyfork.org/scripts/14628/External%20Iframe.user.js
// @updateURL https://update.greasyfork.org/scripts/14628/External%20Iframe.meta.js
// ==/UserScript==

var iframeHeight = "60%"
var iframeWidth = "50%"
var iframeLeft = "50%"
var iframeTop = "30%"

var loc = window.location.toString();

//HIT parent
if(document.body.innerHTML.match("Finished with this HIT?")){ 
    var frameUrl = document.getElementsByTagName('iframe')[0].src;
    GM_setValue("frameUrl", frameUrl);
    window.addEventListener("message", receiveMessage, false);
    function receiveMessage(event){
        var msg = event.data; 
        if (msg.toString().indexOf('ExternalUrl') !== -1){
            window.location.replace(msg.substring(11));
        }    
    }
}; 

//HIT frame
if (loc.indexOf("mturkcontent.com") !== -1 || loc.indexOf("s3.amazonaws.com") !== -1 ){
    var xlink = document.getElementsByTagName('a')[0].href;
    window.parent.postMessage("ExternalUrl" + xlink, '*');
};

//External window
if(GM_getValue("frameUrl")){
    if (loc.indexOf("mturkcontent.com") === -1 && loc.indexOf("s3.amazonaws.com") === -1 && loc.indexOf("mturk.com") === -1 && loc.indexOf("dropboxusercontent.com") === -1){
        var iframe = document.createElement('iframe');
        iframe.src = (GM_getValue("frameUrl"));
        GM_deleteValue("frameUrl");
        $(iframe).css('height', iframeHeight);
        $(iframe).css('width', iframeWidth);
        $(iframe).css('left', iframeLeft); 
        $(iframe).css('top', iframeTop); 
        $(iframe).css('position', 'fixed');
        $('html').eq(0).append(iframe); 
    }
};
