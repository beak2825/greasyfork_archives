// ==UserScript==
// @name         CollegeBoard AP Classroom Video Skipper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto watch AP Classroom videos
// @author       Anon
// @match        https://apclassroom.collegeboard.org/*/assignments*
// @match        https://apclassroom.collegeboard.org/*/home*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://apstudents.collegeboard.org/
// @grant unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462121/CollegeBoard%20AP%20Classroom%20Video%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/462121/CollegeBoard%20AP%20Classroom%20Video%20Skipper.meta.js
// ==/UserScript==

// Big credit to: https://gist.github.com/EastArctica/1e4cb97f8b5a4f4568a779f755c37618

/*
Steps:
0) Install userscript with Tampermonkey
1) Open AP Classroom, go to Assignments, and if the button doesn't appear, reload the page
2) Click "View" on a video and wait for the thumbnail to load
3) Click the "Watch Video" button
4) Profit
*/

(function() {
    'use strict';

    console.log("LOADING COLLEGEBOARD AP Classroom VIDEO SKIPPER SCRIPT");

    async function watchVideo() {
        const accessToken = window.localStorage.getItem("account_access_token")

        const url = new URL(unsafeWindow.location.href)
        const apd = (new URLSearchParams(url.search)).get("apd");
        const classId = url.pathname.split("/")[1];

        // Get user assignments
        const assigns = await fetch(`https://apc-api-production.collegeboard.org/fym/assessments/api/chameleon/student_assignments/${classId}/?status=assigned`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "authorization": `Bearer ${accessToken}`,
                "content-type": "application/json, application/json; charset=utf-8",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site"
            },
            "referrer": "https://apclassroom.collegeboard.org/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "method": "GET",
            "mode": "cors"
        });

        // Filter down to grab the video that is currently on the screen
        const videoData = (await assigns.json()).assignments.filter((assign) => assign.actions[0] == "view" && assign.url === apd)[0];

        let videoId = videoData["video_id"];

        if (!videoId) {
            videoId = Number(prompt("Please enter your videoId."));
        }

        console.log("AP Classroom VIDEO SKIPPER: ", videoId);

        const video = document.querySelectorAll('video')[0];
        const duration = video.duration;
        const progress = new Array(Math.ceil(duration)).fill(1);
        const data = {
            "query": "mutation StoreDailyVideoProgressMutation($userId: Int!, $cbPersonid: String!, $videoId: Int!, $status: String!, $progress: String!, $watchedPercentage: String!, $playTimePercentage: String) {\n  storeDailyVideoProgress(userId: $userId, videoId: $videoId, status: $status, cbPersonid: $cbPersonid, progress: $progress, watchedPercentage: $watchedPercentage, playTimePercentage: $playTimePercentage) {\n    ok\n    __typename\n  }\n}\n",
            "variables": {
                "userId": Number(unsafeWindow.current_user.initId),
                "videoId": videoId,
                "progress": progress,
                "status": "COMPLETE",
                "cbPersonid": Number(unsafeWindow.current_user.importId),
                "watchedPercentage": "1.00",
                "playTimePercentage": "1.0000"
            },
            "operationName": "StoreDailyVideoProgressMutation"
        }
        await fetch("https://apc-api-production.collegeboard.org/fym/graphql", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "authorization": `Bearer ${accessToken}`,
                "content-type": "application/json, application/json; charset=utf-8",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site"
            },
            "referrer": "https://apclassroom.collegeboard.org/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(data),
            "method": "POST",
            "mode": "cors"
        });
        const currentURL = new URL(unsafeWindow.location.href);
        const params = new URLSearchParams(currentURL.search);
        params.set("apd", undefined);
        currentURL.search = params;

        unsafeWindow.location = currentURL;
    }

    const button = document.createElement("button");
    button.setAttribute("style", "padding: 2rem; margin-left: 1rem; margin-bottom: 1rem; border-radius: 0.75rem; position: fixed; bottom: 0px; left: 0px; z-index: 99999999; background-color: black; color: white;")
    button.setAttribute("type", "button");
    button.innerText = "Watch a Video";
    button.onclick = watchVideo;

    document.body.appendChild(button);

    console.log("FINISHED LOADING COLLEGEBOARD AP Classroom VIDEO SKIPPER SCRIPT")
})();