// ==UserScript==
// @name         ACS_Medi23_Extractor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extracts and Downloads the link of the video lectures and allows you to download lecture sheets from the webapp
// @author       he_who_rips
// @match        https://medi23.aparsclassroom.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medi23.aparsclassroom.com
// @license      MIT; https://opensource.org/license/mit/
// @copyright    2023, bigt (https://openuserjs.org/users/bigt)
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481591/ACS_Medi23_Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/481591/ACS_Medi23_Extractor.meta.js
// ==/UserScript==

setTimeout(() => {
    // Class Video Lecture Extraction
    // CDN Parser
    let result = [];
    let video_tags = document.getElementsByTagName("video");
    let i = 0;
    for (i = 0; i < video_tags.length; i++) {
        let video_tag = video_tags[i];
        let source_tags = video_tag.getElementsByTagName("source");
        let j = 0;
        for (j = 0; j < source_tags.length; j++) {
            let source_tag = source_tags[j];
            let quality = source_tag.attributes.size.value;
            let source = source_tag.attributes.src.value;
            result.push({
                quality, source,
                title: `${document.title.replace(/\|/g, "-")} - ${quality}p.${source.split('?')[0].split(".").pop()}`
            })
        }
    }
    if (result.length > 0) {
        let innerHTML = `<br>`
        for (i = 0; i < result.length; i++) {
            innerHTML += `
<button class="btn btn-md btn-block btn-outline-primary" onclick="window.open('${result[i].source}')"> Download ${result[i].quality}p</button>
<br>
`
        }
        document.getElementById("st-1").innerHTML += innerHTML;
    } else {
        // Youtube Parser
        // First getting the iframes!
        let iframes = document.getElementsByTagName("iframe");
        for (i = 0; i < iframes.length; i++) {
            let iframe = iframes[i];
            if (iframe.id.includes("youtube")) {
                let source = `https://youtube.com/watch?v=${iframe.src.split("?")[0].split("/").pop()}`
                result.push({
                    source
                })
                let dl_source = `https://ssyoutube.com/watch?v=${iframe.src.split("?")[0].split("/").pop()}`
                result.push({
                    source: dl_source
                })
            }
        }
        let innerHTML = `<br>`
        innerHTML += `
<button class="btn btn-md btn-block btn-outline-primary" onclick="window.open('${result[0].source}')"> Watch it on YT</button>
<br>
<button class="btn btn-md btn-block btn-outline-primary" onclick="window.open('${result[1].source}')"> Download it from YT</button>
<br>
`
        document.getElementById("st-1").innerHTML += innerHTML;
    }
    // Note Pdfs Extraction
    let pdfs={
        "lecturesheet":undefined,
        "practicesheet":undefined,
        "solutionsheet":undefined
    }
    //https://drive.google.com/u/0/uc?id=1C344rFloZgvujhD6EJGLQrMxB1Q_Oym5&export=download
    let iframes = document.getElementsByTagName("iframe");
    for (i = 0; i < iframes.length; i++) {
        let iframe = iframes[i];
        if (iframe.id === "previewL") {
            // Lecture Sheets
            let parts = iframe.src.split("/")
            let file_id = parts[parts.length - 2]
            pdfs["lecturesheet"] = `https://drive.google.com/u/0/uc?id=${file_id}&export=download`
        }
    }
    let iHTML = `
<br>
<button class="btn btn-md btn-block btn-outline-primary" style="margin-top: 8px;" onclick="window.open('${pdfs.lecturesheet}')">
    Download Lecture Sheet
</button>
    `
    document.getElementById("collapse0").outerHTML += iHTML;
}, 10000);