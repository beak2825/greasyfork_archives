// ==UserScript==
// @name          Github See Your Closed PRs
// @namespace     happyviking
// @version       1.1.0
// @description   See PRs you created that are merged or closed
// @author        HappyViking
// @match         https://github.com/*
// @run-at        document-end
// @license       MIT
// @require      https://unpkg.com/bundled-github-url-detector@1.0.0/index.js
// @downloadURL https://update.greasyfork.org/scripts/474312/Github%20See%20Your%20Closed%20PRs.user.js
// @updateURL https://update.greasyfork.org/scripts/474312/Github%20See%20Your%20Closed%20PRs.meta.js
// ==/UserScript==

const gh = githubUrlDetection

const addClosedButton = () => {
    if (!gh.isPRList()) return
    const username = gh.utils.getUsername()
    if (!username) return
    const toolbar = document.getElementById("js-issues-toolbar")
    if (!toolbar) return
    const query = toolbar.getElementsByClassName("table-list-header-toggle");
    if (query.length == 0) return
    const buttonParent = query[0]

    const button = document.createElement("a")
    button.classList.add("btn-link")
    button.textContent = "Closed (yours)"
    button.href = encodeURI("https://"
        + window.location.hostname
        + window.location.pathname
        + `?q=is:pr+is:closed+author:${username}`)
    buttonParent.append(button)
}

addClosedButton()
document.addEventListener("soft-nav:end", addClosedButton); 
document.addEventListener("navigation:end", addClosedButton);
