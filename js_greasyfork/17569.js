// ==UserScript==
// @name         Chrome Webstore: Download Extension .crx
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       Zren
// @match        https://chrome.google.com/webstore/detail/*
// @match        http://bato.to
// @downloadURL https://update.greasyfork.org/scripts/17569/Chrome%20Webstore%3A%20Download%20Extension%20crx.user.js
// @updateURL https://update.greasyfork.org/scripts/17569/Chrome%20Webstore%3A%20Download%20Extension%20crx.meta.js
// ==/UserScript==

var main = function() {
    //var crxButton = document.querySelector('.crx-download-button');
    //if (!crxButton) {
        var installButton = document.querySelector('div[role="button"]');
        var crxButton = document.createElement('a');
        var m = /^https:\/\/chrome\.google\.com\/webstore\/detail\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/?/.exec(document.location.href);
        var id = m[2];
        crxButton.setAttribute('href', 'https://clients2.google.com/service/update2/crx?response=redirect&x=id%3D' + id + '%26uc&prodversion=32');
        var name = document.querySelector('meta[property="og:title"]').content;
        crxButton.setAttribute('download', name + '.crx');
        crxButton.setAttribute('target', '_blank');
        crxButton.innerText = '.crx';
    
        crxButton.className = installButton.className;
        crxButton.classList.add('crx-download-button');
        installButton.parentNode.insertBefore(crxButton, installButton.parentNode.firstChild);
        
        crxButton.click();
    //}
};

//setInterval(main, 1000);
main();
