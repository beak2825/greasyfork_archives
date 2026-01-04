// ==UserScript==
// @name        See LinkedIn Profile Views
// @namespace   Violentmonkey Scripts
// @match       https://www.linkedin.com/analytics/profile-views/
// @grant       none
// @version     1.1
// @author      Atreides_
// @license     MIT
// @description 10/20/2023
// @downloadURL https://update.greasyfork.org/scripts/477906/See%20LinkedIn%20Profile%20Views.user.js
// @updateURL https://update.greasyfork.org/scripts/477906/See%20LinkedIn%20Profile%20Views.meta.js
// ==/UserScript==

// Ensure DOM is fully loaded before executing script
window.addEventListener('DOMContentLoaded', function () {

    // Function to serialize document to string
    function serializeDocument() {
        return new XMLSerializer().serializeToString(document);
    }

    // Function to extract profiles from a line of serialized document
    function extractProfiles(line) {
        let profiles = [];
        try {
            let res = JSON.parse(line)["included"] ?? null;
            if (res !== null) {
                for (let item of res) {
                    if (item["$type"] === "com.linkedin.voyager.identity.shared.MiniProfile") {
                        profiles.push(item);
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
        return profiles;
    }

    // Function to construct HTML for a profile
    function constructProfileHTML(profile) {
        let photoUrl = profile["picture"]["rootUrl"] +
            profile["picture"]["artifacts"].filter(a => a.width == 200)[0]["fileIdentifyingUrlPathSegment"];

        return `
            <div style="display:flex; flex-direction:row; margin-bottom: 10px;">
                <div style="display:flex;">
                    <img style="min-width: 52px; max-width: 52px" src="${photoUrl}">
                </div>
                <div style="display:flex flex-direction:column; margin-left: 12px;">
                    <strong><a href="https://linkedin.com/in/${profile.publicIdentifier}"><h4>${profile.firstName} ${profile.lastName}</h4></a></strong>
                    <i>${profile.occupation}</i>
                </div>
            </div>`;
    }

    // Main function to process document and display profiles
    function displayProfiles() {
        let docStr = serializeDocument();
        let stalkersHTML = "<u><h3>PROFILE VIEWERS</h3></u><br>";

        for (let line of docStr.split('\n')) {
            if (line.search("firstName") != 0 && line.search("lastName") != 0) {
                let profiles = extractProfiles(line);
                for (let profile of profiles) {
                    stalkersHTML += constructProfileHTML(profile);
                }
            }
        }

        let list = document.createElement("div");
        list.style.padding = "18px";
        list.style.backgroundColor = "lightgray";
        list.style.borderRadius = "5px";
        list.style.color = "black";
        list.style.fontFamily = ["Comic Sans", "Sans-Serif"];
        list.style.display = "flex";
        list.style.flexDirection = "column";
        list.innerHTML = stalkersHTML;

        console.log(list);

        let el = document.getElementById("ember37");
        if (el) {
            el.appendChild(list);
        } else {
            console.error('Element with id "ember37" not found.');
        }
    }

    // Execute main function
    displayProfiles();

});
