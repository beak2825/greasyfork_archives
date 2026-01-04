// ==UserScript==
// @name         Github Show PR Details in PR window
// @namespace    https://github.com/
// @version      0.1.2
// @description  try to take over the world!
// @author       You
// @match        https://github.com/mantidproject/mantid/pulls*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410039/Github%20Show%20PR%20Details%20in%20PR%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/410039/Github%20Show%20PR%20Details%20in%20PR%20window.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // get a token from https://github.com/settings/tokens/new with
    // public_repo permissions. Then add in format
    // your_username:YOUR_API_KEY
    const GITHUB_API_KEY = "username:API_TOKEN";

    const PULL_URL = "https://api.github.com/repos/mantidproject/mantid/pulls/"
    const REVIEW_URL_SUFFIX = "/reviews"

    function handleResponse(response, expected_code, callback) {
        // if the request isn't finished yet, don't do anything
        // it is possible the callback will trigger, before the request is fully finished
        if (response.readyState === XMLHttpRequest.DONE) {
            if (response.status === expected_code) {
                callback(JSON.parse(response.responseText));
            } else {
                console.log("Something done messed up");
            }
        }
    }

    function GET(url, callback) {
        let request = new XMLHttpRequest();
        const auth_basic = window.btoa(GITHUB_API_KEY);
        request.open("GET", url, true);
        request.setRequestHeader("Authorization", "Basic " + auth_basic);
        request.onreadystatechange = function () {
            // expecting 200 OK
            handleResponse(request, 200, callback);
        };
        request.send(null);
    }

    function updateBox(box, pr_data, review_data) {
        const link = document.getElementById("issue_" + pr_data["number"] + "_link");
        const betterElementToPoke = link.parentElement.parentElement;
        let plus_color = "green";
        let minus_color = "red";
        const is_draft = box.innerHTML.includes("Draft");
        if (is_draft) {
            box.style.backgroundColor = "lightgray";
            plus_color = "gray";
            minus_color = "gray";
        }
        console.log(box);

        const changes = document.createElement("div");
        changes.classList.add("col-3");
        changes.style.textAlign = "right";
        changes.style.marginRight = "10px";
        changes.style.marginTop = "10px";

        const internaldiv = document.createElement("div");

        let last_review_time = "";
        if (review_data.length > 0 && !is_draft) {
            const last_review = review_data[review_data.length - 1];
            if (last_review.state === "APPROVED") {
                let date = review_data[review_data.length - 1].submitted_at.replace(/-/g, '/');
                date = date.replace('T', ' ');
                date = date.replace('Z', '');
                last_review_time = Math.abs(new Date() - new Date(date));

                const one_day = 86400000;
                const days = Math.floor(last_review_time / one_day);
                const leftover = last_review_time - (days * one_day);
                let d = new Date(leftover);
                last_review_time = days > 0 ? days + "d " : "" + d.getUTCHours() + "h ";
            }
        }

        internaldiv.innerHTML += '<svg class="octicon octicon-git-commit" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10.86 7c-.45-1.72-2-3-3.86-3-1.86 0-3.41 1.28-3.86 3H0v2h3.14c.45 1.72 2 3 3.86 3 1.86 0 3.41-1.28 3.86-3H14V7h-3.14zM7 10.2c-1.22 0-2.2-.98-2.2-2.2 0-1.22.98-2.2 2.2-2.2 1.22 0 2.2.98 2.2 2.2 0 1.22-.98 2.2-2.2 2.2z"></path></svg>'
            + " " + pr_data["commits"]
            + ' <svg class="octicon octicon-diff" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6 7h2v1H6v2H5V8H3V7h2V5h1v2zm-3 6h5v-1H3v1zM7.5 2L11 5.5V15c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h6.5zM10 6L7 3H1v12h9V6zM8.5 0H3v1h5l4 4v8h1V4.5L8.5 0z"></path></svg> '
            + pr_data["changed_files"]
            + '<div><div style="color:' + plus_color + ';display:inline-block;">+' + pr_data["additions"] + '</div>'
            + ' <div style="color:' + minus_color + ';display:inline-block;"> -' + pr_data["deletions"] + '</div></div>';

        changes.appendChild(internaldiv);
        if (last_review_time !== "") {
            const time_since = document.createElement("div");
            time_since.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M12.5 7.25a.75.75 0 0 0-1.5 0v5.5c0 .27.144.518.378.651l3.5 2a.75.75 0 0 0 .744-1.302L12.5 12.315V7.25z" fill="#626262"/><path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1 1 19 0a9.5 9.5 0 0 1-19 0z" fill="#626262"/></svg> ' + last_review_time;
            changes.appendChild(time_since);
        }
        betterElementToPoke.appendChild(changes);

    }


    let pr_divs = [];
    for (let box of document.getElementsByTagName("div")) {
        if (box.id.includes("issue_")) {
            pr_divs.push(box);
        }
    }

    for (let box of pr_divs) {
        const id = box.id.substr(6);
        console.log("Querying box", id);
        GET(PULL_URL + id, (pr_data) => {
            GET(PULL_URL + id + REVIEW_URL_SUFFIX, (review_data) => {
                updateBox(box, pr_data, review_data);
            });

        })
    }
})();