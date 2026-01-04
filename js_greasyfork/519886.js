// ==UserScript==
// @name         DoctorEye's Perfect PornHub Downloader
// @namespace    DoctorEye
// @version      1.2
// @description  Improved downloader script using video title for saved file name
// @author       DoctorEye
// @license      UNLICENSED
// @match        https://www.pornhub.com/view_video.php?*
// @match        *://www.pornhub.com/view_video.php*
// @match        *://*.pornhub.com/view_video.php*
// @match        *://pornhub.com/view_video.php*
// @match        https://www.pornhubpremium.com/view_video.php
// @match        https://www.pornhubpremium.com/view_video.php*
// @match        *://www.pornhubpremium.com/view_video.php*
// @match        *://*.pornhubpremium.com/view_video.php*
// @match        *://pornhubpremium.com/view_video.php*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/519886/DoctorEye%27s%20Perfect%20PornHub%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/519886/DoctorEye%27s%20Perfect%20PornHub%20Downloader.meta.js
// ==/UserScript==

(function () {
    // Get video title from h1.title
    let titleElement = document.querySelector('h1.title span.inlineFree');
    let videoName = titleElement ? titleElement.textContent.trim() + '.mp4' : 'Default_Video_Title.mp4';
    
    // Sanitize filename
    videoName = videoName.replace(/[\/\\:*?"<>|]/g, '');

    // Locate video data
    let [id, flashvars] = Object.entries(unsafeWindow).find(([key, value]) => /^flashvars_\d+$/.test(key)) || [null, null];
    var medias = flashvars.mediaDefinitions;

    for (var key in medias) {
        var reg = new RegExp("https:\/\/([a-zA-Z0-9]+)\.pornhub(premium)?.com\/video\/get_media\?.+");
        if (reg.test(medias[key].videoUrl)) {
            GM.xmlHttpRequest({
                method: "GET",
                url: medias[key].videoUrl,
                responseType: "json",
                onload: function (xhr) {
                    var mp4files = JSON.parse(xhr.responseText);
                    var element = document.getElementsByClassName("ratingInfo")[0];

                    for (var key in mp4files) {
                        if (mp4files[key].format == "mp4") {
                            var link = document.createElement("a");
                            link.setAttribute('target', '_blank');
                            link.setAttribute('rel', 'noopener noreferrer');
                            link.setAttribute('href', mp4files[key].videoUrl);
                            link.setAttribute('style', 'padding-left:2px');
                            link.textContent = mp4files[key].quality; // Display only resolution

                            // Add download functionality
                            link.addEventListener('click', async (e) => {
                                e.preventDefault();
                                const fileURL = mp4files[key].videoUrl;
                                await downloadVideo(fileURL, videoName);
                            });

                            element.appendChild(link);
                            
                            var space = document.createElement("a");
                            space.textContent = " ";
                            element.appendChild(space);
                        }
                    }
                }
            });
        }
    }

    // Function to download video using fetch
    async function downloadVideo(fileURL, fileName) {
        const response = await fetch(fileURL);
        
        if (!response.ok) throw new Error('Network response was not ok');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;

        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
    }
})();
