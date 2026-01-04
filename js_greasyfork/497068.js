// ==UserScript==
// @name        Copy SSH URL Button for github.com
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*/*
// @grant       none
// @version     1.1
// @author      Matthew Hugley
// @description Adds a button to copy SSH clone URL on GitHub repositories when logged out.
// @license     BSD 3-Clause
// @downloadURL https://update.greasyfork.org/scripts/497068/Copy%20SSH%20URL%20Button%20for%20githubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/497068/Copy%20SSH%20URL%20Button%20for%20githubcom.meta.js
// ==/UserScript==

function addCopySSHButton() {
    const button = document.createElement("button");
    button.textContent = "Copy SSH URL";
    button.style.cssText = `
        position: absolute;
        left: 50%;
        top: 2%;
        transform: translateX(-50%);
        z-index: 1000;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: filter 0.15s;
    `;

    button.onmouseover = function () {
        button.style.transform = "translateX(-50%) scale(0.97)";
    };

    button.onmouseout = function () {
        button.style.transform = "translateX(-50%)";
    };

    button.onclick = function () {
        const repoUrl = window.location.href;
        const sshUrl = repoUrl.replace("https://github.com/", "git@github.com:").replace(/\/$/, "") + ".git";
        navigator.clipboard.writeText(sshUrl).then(
            function () {
                alert("SSH URL copied to clipboard:\n" + sshUrl);
            },
            function (err) {
                console.error("Could not copy SSH URL:", err);
            }
        );
    };

    document.body.appendChild(button);
}

addCopySSHButton();
