// ==UserScript==
// @name         Web+Panda Results in Google
// @namespace    salembeats
// @version      1.2
// @description  .
// @author       Cuyler Stuwe (salembeats)
// @include      /https:\/\/www.google.com\/search(?:.*?)[?&]q=3[A-Za-z0-9]{29}(?:[/?&]|\b)/
// @include      /https:\/\/www.google.com\/search(?:.*?)[?&]q=A(?:[A-Za-z0-9]{11,13}|[A-Za-z0-9]{20})(?:[/?&]|\b)/
// @require      https://greasyfork.org/scripts/36173-panda-crazy-helper-emulation/code/Panda%20Crazy%20Helper%20Emulation.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38062/Web%2BPanda%20Results%20in%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/38062/Web%2BPanda%20Results%20in%20Google.meta.js
// ==/UserScript==

// https://turkopticon.info/requesters/A25EIGL5N7278I


function insertNewContent(gid, rid) {

	var gidHTML = `
        <div>
            <div>
                <span class="results-title">Results for mTurk HIT Set ID ("Group ID / GID")</span> <span class="gid-rid">${gid}</span>
            </div>
            <div>
                <span><a target="_new" href="web+panda://${gid}">web+panda:// (without metadata)</a> </span>
                <span><a target="_new" href="https://worker.mturk.com/projects/${gid}/tasks/accept_random">Standard "Accept" Link</a> </span>
                <span><a target="_new" href="javascript:void(0)" id="add-to-pc">Add to PC</a> </span>
                <span><a target="_new" href="javascript:void(0)" id="add-to-pc-once">Add to PC (ONCE)</a> </span>
            </div>
        </div>`;

	var ridHTML = `
        <div>
            <div>
                <span class="results-title">Results for mTurk Requester ID ("RID")</span> <span class="gid-rid">${rid}</span>
            </div>
            <div>
                <span><a target="_new" href="https://turkopticon.ucsd.edu/reports?id=${rid}">Find on TO</a> </span>
                <span><a target="_new" href="https://turkopticon.info/requesters/${rid}">Find on TO2</a> </span>
                <span><a target="_new" href="https://turkerview.com/requesters/${rid}">Find on TurkerView</a></span>
            </div>
        </div>`;

	(document.querySelector("div.g") || document.querySelector("#topstuff")).insertAdjacentHTML("beforebegin", `
        <style>
            #resultsChanger {

            }

            #resultsChanger a::after {
                content: " ?";
            }

            #resultsChanger>div>div {
                margin: 10px !important;
            }

            .results-title {
                font-size: 1.3em;
            }

            .results-title::before {
                content: "⭐ ";
            }

            .gid-rid {
                font-size: 1.3em;
                color: green;
                background: white;
            }
        </style>

        <div id="resultsChanger" class="g">
            ${ gid ? gidHTML : ""}
            ${ rid ? ridHTML : ""}
        </div>
    `);

}


function main() {

	var parsedURL = new URL(window.location.href);
	var searchQuery = parsedURL.searchParams.get("q");

	let gid = (searchQuery.match(/\b3[A-Za-z0-9]{29}\b/) || [null])[0];
	let rid = (searchQuery.match(/\bA(?:[A-Za-z0-9]{11,13}|[A-Za-z0-9]{20})\b/) || [null])[0];

	insertNewContent(gid, rid);

	document.body.addEventListener("click", e => {
		if(e.target.id === "add-to-pc") {
			PandaCrazy.addJob(gid);
			document.getElementById("add-to-pc").innerText = "Added to PC (if running)!";
		}
		else if(e.target.id === "add-to-pc-once") {
			const PC_ADD_ONCE = true;
			document.getElementById("add-to-pc").innerText = "Added to PC (ONCE) (if running)!";
			PandaCrazy.addJob(gid, PC_ADD_ONCE);
		}
	});
}


main();