// ==UserScript==
// @name         NpmPackageRepo
// @namespace    mailto:fish404hsif@gmail.com
// @version      0.1.0
// @description  See if npm package repo is forked from others
// @author       fish-404
// @match        https://www.npmjs.com/package/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=npmjs.com
// @homepage     https://github.com/fish-404/UserScriptsStyles/tree/main/npm/Scripts
// @license      MIT
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/452083/NpmPackageRepo.user.js
// @updateURL https://update.greasyfork.org/scripts/452083/NpmPackageRepo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let link = document.querySelector('#repository-link').innerText.substring(11);
    let repo = document.querySelector('#repository');

    const notFoundHtml = '<img src="https://badgen.net/badge/status/404/red" alt="Repository Not Found Badge"/>'

    if (link) {
        GM.xmlHttpRequest( {
            method: "GET",
            url: `https://api.github.com/repos/${link}`,
            headers: {
                "accept": "application/vnd.github+json"
            },
            onload: function(response) {
                if (response.status = '200') {
                    if (response.statusText === "Not Found") {
                        insertBadge(repo, notFoundHtml);
                    }
                    else {
                        let cur = JSON.parse(response.response);
                        let curForkHtml = `<img src="https://badgen.net/badge/Forks/${cur.forks}/blue" alt="Repository Total Fork Badge"/>`;
                        if (cur.fork === true) {
                            insertBadge(repo, curForkHtml);
                            insertBadge(repo,
                                `<a href="${cur.parent.html_url}">
                                    <img src="https://badgen.net/badge/Parent Forks/${cur.parent.forks}/orange" alt="Respository Parent Fork Badge" />
                                </a>`);
                        }
                        else {
                            insertBadge(repo, curForkHtml);
                        }
                    }
                }
            }
        });
    }
    else {
        console.info("Repository link not found");
    }
})();

function insertBadge(element, htmlText) {
   element.insertAdjacentHTML('afterend', htmlText);
}
