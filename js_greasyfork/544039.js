// ==UserScript==
// @name         Redirect Graphite.dev to Github
// @namespace    https://app.graphite.dev/
// @version      2025-11-07
// @description  Redirects all Graphite.com PR links to Github
// @author       Jared Allard <jared@rgst.io>
// @license      GPL-3.0
// @match        http*://app.graphite.com/github/pr/*
// @match        http*://app.graphite.dev/github/pr/*
// @run-at       document-start
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544039/Redirect%20Graphitedev%20to%20Github.user.js
// @updateURL https://update.greasyfork.org/scripts/544039/Redirect%20Graphitedev%20to%20Github.meta.js
// ==/UserScript==

// Example URL: https://app.graphite.dev/github/pr/org/repo/number

(function() {
    'use strict';

    const u = new URL(window.location.href)
    if(!u) {
        console.error(`failed to parse current location as a URL: ${window.location.href}`)
        return
    }

    // github/pr/gathertown/gather-town-v2/13844
    const values = u.pathname.split("/")
    if (values.length < 6) {
        console.error("split path was unexpected value", u)
        return
    }

    const vcs_provider = values[1]
    const link_type    = values[2]
    const org          = values[3]
    const repo         = values[4]
    const id           = values[5]

    let new_url = '';
    if (vcs_provider !== "github") {
        console.error(`unexpected VCS provider: ${vcs_provider}`)
        return
    }
    if(link_type !== "pr") {
        console.error(`unexpected type: ${link_type}`)
        return
    }

    new_url += `https://github.com/${org}/${repo}/pull/${id}`

    console.log("Redirecting Graphite -> Github", new_url)
    window.location.replace(new_url)
})();