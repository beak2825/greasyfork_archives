// ==UserScript==
// @name         VectorLMS
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Vector LMS Auto Task Completion Script. Sequentially runs tracking_start and tracking_finish for each course_item (i.e. video) on the page.used for  vectorlmsedu.com
// @author       savetheplanet07, wu5bocheng
// @match        https://*.vectorlmsedu.com/training/launch/course_work/*
// @icon         https://cmu-pa.vectorlmsedu.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472460/VectorLMS.user.js
// @updateURL https://update.greasyfork.org/scripts/472460/VectorLMS.meta.js
// ==/UserScript==

function asyncWaitSeconds(seconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, seconds * 1000);
    });
}

async function main() {
    let TOC_items = document.getElementsByClassName("TOC_item");
    let TOC_unwatched_videos = [];

    //scrape the /training/launch/course_work/COURSEID page for video data
    for (let i = 0; i < TOC_items.length; i++) {
        try {
            let data_entry = {}
            data_entry.element = TOC_items[i];
            data_entry.isVideo = TOC_items[i].querySelector(".fa-play") != null;
            data_entry.href = TOC_items[i].getAttribute("href");
            data_entry.title = TOC_items[i].querySelector(".lead").innerText;
            let len = TOC_items[i].getAttribute("href").split("?")[0].split("/").length;
            data_entry.work_id = TOC_items[i].getAttribute("href").split("?")[0].split("/")[len - 1];
            data_entry.item_id = TOC_items[i].getAttribute("href").split("?")[0].split("/")[len - 2];
            if (!data_entry.isVideo) {
                continue;
            }
            data_entry.time_min = parseInt(TOC_items[i].querySelector(".span_link").innerText.split(" ")[1]) + .5;
            data_entry.completed = false;
            TOC_unwatched_videos.push(data_entry);
        } catch (err) {
            console.log("Error scraping TOC item: " + TOC_items[i].innerText);
            console.log(err);
        }
    }
    for (let i = 0; i < TOC_unwatched_videos.length; i++) {
        let school_host = window.location.host;
        let unwatched_video = TOC_unwatched_videos[i];
        //request the tracking start
        let tracking_start_url = "https://" + school_host + "/rpc/v2/json/training/tracking_start?course_item_id=" + unwatched_video.item_id + "&course_work_id=" + unwatched_video.work_id;
        const tracking_start_response = await fetch(tracking_start_url);
        let tracking_start_data = await tracking_start_response.json();
        unwatched_video.work_hist_id = tracking_start_data.course_work_hist_id;
        console.log("Video time tracking started for video: " + unwatched_video.title);
        //delay for video length
        console.log("Waiting for the length of the video, " + unwatched_video.time_min * 60 + " seconds...");
        await asyncWaitSeconds(unwatched_video.time_min * 60);
        //request the tracking finish
        let tracking_finish_url = "https://" + school_host + "/rpc/v2/json/training/tracking_finish?course_work_hist_id=" + unwatched_video.work_hist_id + "&_=" + (Date.now() + unwatched_video.time_min * 60 * 1000).toString();
        const tracking_finish_response = await fetch(tracking_finish_url);
        let tracking_finish_data = await tracking_finish_response.json()
        unwatched_video.completed = !(tracking_finish_data.tracking_status); //0 is completed, 1 is not completed, 2 is previously completed (but we filtered those)

        if (unwatched_video.completed) {
            console.log("Completed Video: " + unwatched_video.title);
            unwatched_video.element.querySelector(".IconSquare").innerHTML = '<div style="height: 33px; width: 33px" class="IconSquare u-border-radius-4 u-overflow-hidden u-pos-relative" aria-hidden="true"><span><div class="color-overlay u-bg-tertiary-light"></div></span><div class="u-absolute-center u-text-center "><span class="fa fa-check fa-fw u-color-tertiary"></span></div></div>'; //Set Completed Checkbox
            unwatched_video.element.querySelector(".hidden-xs").innerHTML = '<div class="badge u-text-capitalize u-border-radius-10 u-m-0 u-bg-tertiary-light u-color-tertiary-darker">Completed</div>'; //Set Completed Badge
            location.reload();//Reload the page to update the TOC
        }
        else {
            console.log("Failed to Complete Video: " + unwatched_video.title);
        }
    }
}
main().then();