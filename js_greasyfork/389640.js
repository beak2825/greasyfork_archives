// ==UserScript==
// @name Download multiple purchased ManyVids videos at once
// @description Adds a download all vids button on your Purchase History page
// @icon https://www.manyvids.com/favicon.png
// @match https://www.manyvids.com/View-my-history/*
// @grant none
// @version 0.0.1.20190901150022
// @namespace https://greasyfork.org/users/357953
// @downloadURL https://update.greasyfork.org/scripts/389640/Download%20multiple%20purchased%20ManyVids%20videos%20at%20once.user.js
// @updateURL https://update.greasyfork.org/scripts/389640/Download%20multiple%20purchased%20ManyVids%20videos%20at%20once.meta.js
// ==/UserScript==
var wait_time_in_ms = 100
var all_download_buttons = document.querySelectorAll('[class="js-download-btn"]')
var number_of_videos = all_download_buttons.length
var information =
    `Please read, it contains only useful info.
This won't work on Firefox because of this https://bugzilla.mozilla.org/show_bug.cgi?id=874009
Reminder, only the ${number_of_videos} videos on this page will be downloaded!
Navigate to the next page to download the rest.
This is an experimental script, verify that ${number_of_videos} unique videos are downloaded in the end.
Be patient, it may take several seconds for a video to start downloading.
For best experience, in your browser settings:
Choose a download folder.
Disable "Ask where to save each file before downloading".
Don't forget to restore those settings when you are done.
When downloading your browser may ask you to allow multiple downloads.`
var html_button_download_all_videos =
    `<a id="btn_download_all_vids"
class="btn btn-primary btn-sm"
style="position: fixed; top: 20%; color: white">
Download the ${number_of_videos} videos on this page</a>`

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function is_element_visible(elem) {
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
}

async function download_all_videos_on_the_page() {
    button_download_all_videos.removeEventListener('click', download_all_videos_on_the_page)
    if (confirm(information)) {
        for (var download_button of all_download_buttons) {
            download_button.click()
            var download_now_button = document.getElementById('downloadVid')
            while (!is_element_visible(download_now_button)) {
                await sleep(wait_time_in_ms)
            }
            download_now_button.click()
            while (is_element_visible(download_now_button)) {
                await sleep(wait_time_in_ms)
                document.querySelector('#downloadVidModal > div > div > a > i').click()
            }
        }
        alert(`Started downloading ${number_of_videos} videos...`)
    }
    button_download_all_videos.addEventListener('click', download_all_videos_on_the_page)
}

document.body.insertAdjacentHTML('afterbegin', html_button_download_all_videos)
var button_download_all_videos = document.getElementById('btn_download_all_vids')
button_download_all_videos.addEventListener('click', download_all_videos_on_the_page)