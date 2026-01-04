// ==UserScript==
// @name         Remove download delay on APKLeecher
// @namespace    StephenP
// @version      1.0.0
// @description  Removes download delay on APKLeecher
// @author       StephenP
// @match        https://apkleecher.com/download/dl.php?*
// @match        http://apkleecher.com/download/dl.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370542/Remove%20download%20delay%20on%20APKLeecher.user.js
// @updateURL https://update.greasyfork.org/scripts/370542/Remove%20download%20delay%20on%20APKLeecher.meta.js
// ==/UserScript==
(function() {
    'use strict';
    try{        
        var timeoutDownloader=document.getElementsByClassName("form-group")[0].getElementsByTagName("script");        
        timeoutDownloader=timeoutDownloader[timeoutDownloader.length-1];
        var apklink = "https://apkleecher.com"+timeoutDownloader.innerHTML.substring(timeoutDownloader.innerHTML.lastIndexOf("..") + 2,timeoutDownloader.innerHTML.lastIndexOf('.apk')+4);
        //tries to remove the download timeout with many values because the timeout script doesn't save its id.
        for(var i=0;i<20;i++){
            clearTimeout(i);};
        location.href=apklink;
      }
      catch(err){
        console.log("Something in ApkLeecher page has changed since this script was last edited. To prevent errors, the page has not benn touched. The download will start with the usual delay");
      }
 })();