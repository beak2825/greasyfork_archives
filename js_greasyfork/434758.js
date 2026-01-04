// ==UserScript==
// @name         Aria2 Downloader from Seedbox
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Download from seedbox using aria2
// @author       Kevincj
// @match        *://*.feralhosting.com/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/434758/Aria2%20Downloader%20from%20Seedbox.user.js
// @updateURL https://update.greasyfork.org/scripts/434758/Aria2%20Downloader%20from%20Seedbox.meta.js
// ==/UserScript==


function download(e) {
    var prefix = window.location.href;
    var i;
    for (i = prefix.length - 1; i >= 0; i --){
        if (prefix[i] == '/'){
            prefix = prefix.substring(0, i+1);
            break;
        }
    }
    var link = prefix+this.getAttribute('href');
    let reqParams = {
                'jsonrpc': '2.0',
                'method' : 'aria2.addUri',
                'id'     : (+new Date()).toString(),
                'params' : []
            };
    reqParams.params.push([link]);

    // Fill in your usr-pwd here if password is enabled
    let options = {
        'http-user' : '',
        'http-passwd' : ''
    };
    reqParams.params.push(options);



    GM_xmlhttpRequest({
        method : 'POST',
        url    : 'http://localhost:6800/jsonrpc',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data   : JSON.stringify(reqParams)
    });
   e = e || window.event;
    e.preventDefault();

}


function bindDownload(ele){
    console.log('binding');
    ele.addEventListener("click", download, false);
}



let links = document.getElementsByTagName('a');
var i;
for (i = 5; i < links.length; i ++) {
    let link = links[i].getAttribute('href');
    if (link.charAt(link. length-1) != '/'){
         bindDownload(links[i]);
    }
}

