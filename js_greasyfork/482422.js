// ==UserScript==
// @name        forvo.com - Make download button actually download audios
// @namespace   secretx_scripts
// @match       *://forvo.com/word/*
// @match       *://*.forvo.com/word/*
// @version     2023.12.16
// @author      SecretX
// @description Fix the download button to actually download the audio instead of opening the login screen
// @grant       GM.xmlHttpRequest
// @run-at      document-start
// @icon        https://i.imgur.com/3hA6TF1.png
// @license     GNU LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/482422/forvocom%20-%20Make%20download%20button%20actually%20download%20audios.user.js
// @updateURL https://update.greasyfork.org/scripts/482422/forvocom%20-%20Make%20download%20button%20actually%20download%20audios.meta.js
// ==/UserScript==

const forvoServerUrl = "https://audio12.forvo.com";

function doRequest(httpMethod, url) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: httpMethod.toUpperCase(),
            url: url,
            onload: resolve,
            onerror: reject,
            responseType: "blob",
            timeout: 6000,
        });
    });
}

function extractUrl(element) {
    const play = element.getAttribute("onclick");
    // We are interested in Forvo's javascript Play function which takes in some parameters to play the audio
    // Example: Play(3060224,'OTQyN...','OTQyN..',false,'Yy9wL2NwXzk0MjYzOTZfNzZfMzM1NDkxNS5tcDM=','Yy9wL...','h')
    // Match anything that isn't commas, parentheses or quotes to capture the function arguments
    // Regex will match something like ["Play", "3060224", ...]
    const playArgs = play.match(/([^',\(\)]+)/g);

    // Forvo has two locations for mp3, /audios/mp3 and just /mp3
    // /audios/mp3 is normalized and has the filename in the 5th argument of Play base64 encoded
    // /mp3 is raw and has the filename in the 2nd argument of Play encoded
    try {
        const file = atob(playArgs[5]);  // Something like this: v/p/vp_9478059_76_3731369.mp3
        return `${forvoServerUrl}/audios/mp3/${file}`;
    } catch (e) {
        // Some pronunciations don't have a normalized version so fallback to raw
        const file = atob(playArgs[2]);  // Something like this: 9478059/76/9478059_76_3731369.mp3
        return `${forvoServerUrl}/mp3/${file}`;
    }
}

function getPlayButtonFromDownloadButton(downloadButton) {
    let currentElement = downloadButton;
    for (let i = 0; i < 5; i++) {
        currentElement = currentElement.parentElement;
    }
    console.info("Current element", currentElement);
    return currentElement.querySelector(".play");
}

function makeCopyOfDownloadButton(downloadButton) {
    const innerSpan = downloadButton.querySelector("* > span");
    const text = innerSpan.innerText;

    // Create the new download button, following the structure of the old one
    const newDownloadButton = document.createElement(downloadButton.tagName.toLowerCase());
    newDownloadButton.className = downloadButton.className;
    const newInnerSpan = document.createElement(innerSpan.tagName.toLowerCase());
    newInnerSpan.className = innerSpan.className;
    newInnerSpan.innerText = text;
    newDownloadButton.appendChild(newInnerSpan);

    return newDownloadButton;
}

window.addEventListener("DOMContentLoaded", function () {
    const downloadButtons = Array.from(document.querySelectorAll(".download") ?? []);
    if (downloadButtons.length === 0) {
        console.debug("No download buttons found on this page, so not fixing anything...");
        return;
    }

    for (const downloadButton of downloadButtons) {
        const newDownloadButton = makeCopyOfDownloadButton(downloadButton);

        const playButton = getPlayButtonFromDownloadButton(downloadButton);
        console.info("Play button", playButton);
        const url = extractUrl(playButton);
        const fileName = url.substring(url.lastIndexOf("/") + 1);

        // Add the download functionality to the new download button
        newDownloadButton.addEventListener("click", () => {
            console.info(`Downloading mp3 from: ${url}`);

            doRequest("GET", url).then((response) => {
                if (response.status !== 200) {
                    console.error("Error on downloading mp3", response);
                    return
                }
                const blob = response.response;
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.style.display = "none";
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);

                console.info(`Downloaded '${fileName}'!`);
            }).catch((e) => {
                console.error("Error while downloading mp3!", e);
            });
        });

        // Replace the old download button with the new one
        downloadButton.replaceWith(newDownloadButton);
    }

    console.info(`Fixed ${downloadButtons.length} download buttons!`);
}, false);