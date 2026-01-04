// ==UserScript==
// @name         Dropbox Direct Downloader
// @namespace    https://github.com/tyhallcsu
// @version      1.0
// @description  Convert Dropbox file sharing links to direct download links.
// @author       sharmanhall
// @match        https://www.dropbox.com/s/*/*.*?dl=0
// @icon         https://api.iconify.design/mdi/dropbox.svg
// @homepageURL  https://github.com/tyhallcsu/
// @run-at       context-menu
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465166/Dropbox%20Direct%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/465166/Dropbox%20Direct%20Downloader.meta.js
// ==/UserScript==

(function() {
    // Get the current URL of the Dropbox file sharing page.
    let dburl = window.location.href;

    // Replace "www" with "dl" to change the subdomain.
    let web = dburl.replace('www', 'dl');

    // Replace "dropbox" with "dropboxusercontent" to change the domain.
    let end = web.replace('dropbox', 'dropboxusercontent');

    // Remove the "?dl=0" query parameter from the URL.
    let final = end.substring(0, end.length - 5);

    // Navigate to the modified URL to directly download the shared file.
    window.location.assign(final);
})();
