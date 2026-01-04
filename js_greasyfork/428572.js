// ==UserScript==
// @name     Jira
// @locale   IN
// @description   redirect
// @match    *://jira.corp.inmobi.com:8443/*
// @match    *://inmobi.atlassian.net/*
// @run-at   document-start
// @grant    none
// @version 0.0.1.20210628051909
// @namespace https://greasyfork.org/users/788174
// @downloadURL https://update.greasyfork.org/scripts/428572/Jira.user.js
// @updateURL https://update.greasyfork.org/scripts/428572/Jira.meta.js
// ==/UserScript==

//-- Only redirect if the *path* ends in .html...
if (/.*jira\.corp\.inmobi\.com:8443.*/.test (location.host) || /.*inmobi\.atlassian\.net.*/.test (location.host)) {
    var newHost     = location.host.replace (/inmobi\.atlassian\.net/, "glanceinmobi.atlassian.net");
    newHost     = newHost.replace (/.*jira\.corp\.inmobi\.com:8443.*/, "glanceinmobi.atlassian.net");
    console.log(newHost);
    var newURL      = location.protocol + "//" +
        newHost                  +
        location.pathname                +
        location.search          +
        location.hash
    ;
    location.replace (newURL);
}