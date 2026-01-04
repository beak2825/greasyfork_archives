// ==UserScript==
// @name         Watch Later Extractor
// @namespace    rbits.watch-later-extractor
// @version      0.0.5
// @description  Exports videos from your YouTube Watch Later page to a JSON file
// @author       rbits
// @match        https://www.youtube.com/playlist*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_registerMenuCommand
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/504389/Watch%20Later%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/504389/Watch%20Later%20Extractor.meta.js
// ==/UserScript==



function runScript() {
    console.log("Watch Later Extractor script running");
    
    let box = document.createElement("div");
    box.style = `
        color: white;
        background-color: #272727;
        border-radius: 1rem;
        width: 50rem;
        height: 20rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        padding: 2rem;
        box-shadow: 2px 2px 5px 0px #101010;
    `;
    
    let textElement = document.createElement("p");
    textElement.innerHTML = "Enter id/url of video to stop at<br>(leave blank to process all videos)"
    textElement.style = `
        font-size: 2rem;
        text-align: center;
    `
    box.appendChild(textElement);

    
    let videoIdInput = document.createElement("input");
    videoIdInput.style = `
        font-size: 2rem;
        width: 80%;
        border-radius: 0.5rem;
        border: none;
        box-shadow: 2px 2px 5px -1px #151515;
    `
    box.appendChild(videoIdInput);

    let fileType = document.createElement("select");
    fileType.innerHTML = `
        <option value="json">JSON</option>
        <option value="csv">CSV</option>
    `;
    fileType.style = `
        font-size: 2rem;
    `
    box.appendChild(fileType);
    
    let button = document.createElement("button");
    button.textContent = "Start";
    button.style = `
        font-size: 2rem;
        padding: 0.5rem 2rem;
        background-color: #424242;
        color: white;
        border: none;
        border-radius: 0.5rem;
        box-shadow: 2px 2px 5px -1px #151515;
    `
    box.appendChild(button);

    let flex = document.createElement("div");
    flex.style = `
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 1rem;
    `
    flex.appendChild(box);

    document.body.appendChild(flex);
    

    button.onclick = () => {
        startProcessing(videoIdInput.value, fileType.value);
        document.body.removeChild(flex);
    };
}

function startProcessing(stopVideoId, fileType) {
    // Convert url to id
    const videoIdMatch = stopVideoId.match(/\/watch\?v=([^&]*)/);
    if (videoIdMatch) {
        stopVideoId = videoIdMatch[1];
    }

    let videosElement = document.querySelector("ytd-playlist-video-renderer").parentElement;
    let signals = {
        allLoaded: false,
    }

    parseVideos(videosElement, stopVideoId, signals)
        .then((parsedVideos) => handleParsedVideos(parsedVideos, fileType));


    repeatScroll(videosElement, signals);
}


// Parses all videos as they appear in videos
// Once signals.allLoaded is set, it finishes parsing all remaining videos then
// returns list of parsed videos
async function parseVideos(videosElement, stopVideoId, signals) {
    console.log("Starting video parsing");
    if (stopVideoId !== "") {
        console.log("Stopping at %s", stopVideoId);
    }

    let videos = videosElement.children;
    let parsedVideos = [];
    let i = 0;
    let didFinishEarly = false;

    // videos can grow at any time
    while (true) {
        while (i < videos.length - 1) {
            const parsedVideo = parseVideo(videos.item(i));
            parsedVideos.push(parsedVideo);
            i++;
            
            if (parsedVideo.videoId === stopVideoId) {
                didFinishEarly = true;
                signals.allLoaded = true;
                break;
            }
        }
        
        if (signals.allLoaded) {
            break;
        }
        
        console.log("Parsed %d videos, waiting for more videos", i);
        while (i >= videos.length - 1 && !signals.allLoaded) {
            // Wait 0.1s between checks
            await new Promise(executor => setTimeout(executor, 100))
        }
    }
    
    // Usually last item is ytd-continuation-item-renderer so isn't parsed
    // It's probably a video now, so it should be parsed now
    if (isEnd(videos) && !didFinishEarly) {
        const lastItem = videos.item(videos.length - 1);
        parsedVideos.push(parseVideo(lastItem));
    } else {
        console.log("Exited early: parsing finished but continuation item still exists");
    }

    return parsedVideos;
}


function parseVideo(videoElement) {
    // const thumbnail = videoElement.getElementsByTagName("img")[0].src;

    const titleElement = videoElement.querySelector("#video-title");
    const videoUrl = titleElement.href;
    const videoId = videoUrl.match(/\/watch\?v=([^&]*)/)[1];
    const title = titleElement.title;
    
    const channelElement = videoElement.querySelector("#channel-name")
        .getElementsByTagName("a")[0];
    const channelUrl = channelElement.href;
    const channelName = channelElement.textContent;

    return {
        title,
        channelName,
        videoUrl,
        videoId,
        channelUrl,
        // thumbnail,
    };
}


async function repeatScroll(videosElement, signals) {
    let videos = videosElement.children;
    
    // No need to scroll, already loaded
    if (isEnd(videos)) {
        signals.allLoaded = true;
        return;
    }

    const mutationCallback = (_mutationList, observer) => {
        if (isEnd(videos) || signals.allLoaded) {
            signals.allLoaded = true;
            observer.disconnect();
        } else {
            scrollToBottom()
        }
    }

    const observer = new MutationObserver(mutationCallback);
    observer.observe(videosElement, { childList: true });

    scrollToBottom();
}


function scrollToBottom() {
    window.scroll(0, document.documentElement.scrollHeight);
    console.log("Scrolled to " + document.documentElement.scrollHeight);
}


function isEnd(videos) {
    const lastItem = videos.item(videos.length - 1);
    if (lastItem.tagName === "YTD-PLAYLIST-VIDEO-RENDERER") {
        return true;
    } else if (lastItem.tagName === "YTD-CONTINUATION-ITEM-RENDERER") {
        return false;
    } else {
        console.error(lastItem.tagName);
        throw new Error("Unknown item in video list");
    }
}


function handleParsedVideos(parsedVideos, fileType) {
    console.log("All videos parsed, creating file");
    
    let fileString = "";

    if (fileType === "json") {
        fileString = JSON.stringify(parsedVideos);
    } else if (fileType === "csv") {
        fileString = objListToCsv(parsedVideos);
    }

    const base64String = stringToBase64(fileString);

    var downloadLink = document.createElement("a");
    downloadLink.href = "data:text/plain;base64," + base64String;
    downloadLink.download = "playlist." + fileType;
    downloadLink.click();
    
    // console.dir(parsedVideos);
}


// From https://developer.mozilla.org/en-US/docs/Glossary/Base64
function stringToBase64(string) {
    const bytes = new TextEncoder().encode(string);
    const binString = Array.from(bytes, (byte) =>
        String.fromCodePoint(byte),
    ).join("");
    return btoa(binString);
}


function objListToCsv(objList) {
    const columns = Object.keys(objList[0]);
    let rows = [];

    for (const obj of objList) {
        let row = "";
        let first = true;

        for (const column of columns) {
            if (first) {
                first = false;
            } else {
                row += ",";
            }

            // Surround in quotes and escape quotes
            row += "\"" + obj[column].replaceAll("\"", "\"\"") + "\"";
        }
        
        rows.push(row);
    }

    let csv = columns.join(",") + "\n";
    csv += rows.join("\n");
    return csv;
}



(function() {
    'use strict';

    GM_registerMenuCommand(
        "Run script",
        runScript,
    );
})();