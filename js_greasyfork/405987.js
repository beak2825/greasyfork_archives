// ==UserScript==
// @name         Google Docs redirection to Microsoft Office
// @namespace    https://docs.google.com/
// @version      1.00
// @description  A JS file for Tampermonkey that redirects from Google Document to Microsoft Office when you browse files from external websites.
// @author       Kenya-West
// @match        https://docs.google.com/viewerng/viewer*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/405987/Google%20Docs%20redirection%20to%20Microsoft%20Office.user.js
// @updateURL https://update.greasyfork.org/scripts/405987/Google%20Docs%20redirection%20to%20Microsoft%20Office.meta.js
// ==/UserScript==

class GoogleDocsRedirection {

    constructor(url) {
        this.start(url);
    }

    start(htmlClass) {
        const destination = "https://view.officeapps.live.com/op/view.aspx?src=";
        const url = this.getURL();
        if (url) {
            window.location = `${destination}${url.searchParams.get("url")}`;
        }
        
    }

    getURL() {
        const host = "docs.google.com"
        const path = "/viewerng/viewer"
        const url = new URL(location.href);
        if (url.hostname === host &&
            url.pathname === path &&
            url.searchParams.get("url")) {
            return url;
        }
        return null;
    }

}

setTimeout(() => new GoogleDocsRedirection("body"), 0);