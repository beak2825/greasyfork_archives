// ==UserScript==
// @name         Zing MP3 Lyric KAS
// @namespace    https://t.me/adung98
// @version      2024-02-28
// @description  Export KAS lyric file when open lyric page in Zing MP3
// @author       azu
// @match        https://zingmp3.vn/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/488358/Zing%20MP3%20Lyric%20KAS.user.js
// @updateURL https://update.greasyfork.org/scripts/488358/Zing%20MP3%20Lyric%20KAS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractFileNameWithoutExtension(url) {
        const urlObject = new URL(url);
        const path = urlObject.pathname; // Get the path component of the URL
        const parts = path.split('/'); // Split the path by '/'
        const fileNameWithExtension = parts[parts.length - 1]; // Get the last part which contains the filename with extension

        // Remove the extension from the file name
        const fileNameWithoutExtension = fileNameWithExtension.split('.').slice(0, -1).join('.');

        return fileNameWithoutExtension;
    }

    // Function to run when a fetch request is made to the specific URL
    function handleFetch(request, response) {
        const urlObject = new URL(request.url);
        const id = urlObject.searchParams.get('id');
        response.text().then(body => {
            const responseData = JSON.parse(body);
            const sentences = responseData.data.sentences;
            const rows = sentences.map((row,index) => {
                const rowStartTime = row.words[0].startTime
                return {
                    lyric: {
                        element: row.words.map((word, index, array) => ({
                            duration: word.endTime - (index === 0 ? word.startTime : array[index-1].endTime),
                            offset_time: (index === 0 ? word.startTime : array[index-1].endTime) - rowStartTime,
                            words: word.data
                        })).flatMap(item => [item, {string: " "}])
                    },
                    start_time: rowStartTime,
                    ...(index === 0 && {use_signal_light: true})
                }
            });
            const exportedData = {"lyrics":{"modules":[{"guid":"{3FCC015B-EC59-43AB-AC58-227789FAB52D}","index":0,"style":{"pic.bmp_data":"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","pic.bmp_height":64,"pic.bmp_split":0,"pic.bmp_width":64,"pic.name":"Custom","pic.number":4,"pic.offset.x":0,"pic.offset.y":-40,"pic.size":110,"pic.tracking":0}},{"guid":"{4DF19916-12CA-4d76-869B-D623F2F47D28}","index":0,"style":{"font.fill":1,"font.fill.angle":0,"font.fill.color":[{"color":4294902784,"pos":0}],"font.fill.mode":0,"font.stroke":1,"font.stroke.angle":0,"font.stroke.color":[{"color":4294967295,"pos":0.2},{"color":4294967295,"pos":0.8}],"font.stroke.mode":0,"font.stroke.width":9}},{"guid":"{6229FD31-F144-4e70-A54D-1271E09609E9}","index":0,"style":{"volume.align":1,"volume.count":4,"volume.fill.color":[{"color":4294901760,"pos":0}],"volume.offset.x":0,"volume.offset.y":0,"volume.overlay.fill.color":[{"color":4294967295,"pos":0}],"volume.overlay.stroke.color":[{"color":4294901760,"pos":0}],"volume.ratio":3,"volume.size":48,"volume.stroke.color":[{"color":4294967295,"pos":0}],"volume.stroke.width":2,"volume.width":12}},{"guid":"{6B3FB3FE-0930-477d-9D69-97AA5F98258D}","index":0,"style":{"lit.edge_brightness":0.6,"lit.fill.color":[{"color":4294901760,"pos":0}],"lit.number":4,"lit.offset.x":0,"lit.offset.y":-24,"lit.size":67.640045,"lit.stroke.color":[{"color":4294967295,"pos":0}],"lit.stroke.width":2,"lit.style":0,"lit.tracking":0,"lit1.fill.color":[{"color":4278190335,"pos":0}],"lit2.fill.color":[{"color":4278255615,"pos":0}],"lit3.fill.color":[{"color":4278255360,"pos":0}]}},{"guid":"{DF05E056-A1FE-43a4-8C8A-5E6B5395DF0D}","index":0,"style":{"crossfade.blur.bluriness":0,"crossfade.blur.dimensions":0,"crossfade.tracking":0}}],"rows":rows,"style":{"background":1,"effects":1,"effects.instance":[{"enabled":1,"guid":"{4DF19916-12CA-4d76-869B-D623F2F47D28}","index":0}],"font.aspect":1,"font.fill":1,"font.fill.color":[{"color":4294967295,"pos":0.2},{"color":4294967295,"pos":0.8}],"font.name":"UVN MINHTAM MELI","font.scale":1,"font.shadow":1,"font.shadow.angle":60,"font.shadow.color":[{"color":4278190080,"pos":0}],"font.shadow.distance":10.399998,"font.size":127,"font.slant":0,"font.stroke":1,"font.stroke.color":[{"color":4278190080,"pos":0}],"font.stroke.width":9,"font.tracking":-2.5,"layout.mode":1,"layout.right_to_left":0,"layout.row.align":1,"layout.row.offset.y":924,"layout.row1.align":0,"layout.row1.offset.x":201,"layout.row1.offset.y":760,"layout.row2.align":2,"layout.row2.offset.x":-204,"layout.row2.offset.y":924,"screen.height":1080,"screen.par":"1:1","screen.preset":"","screen.width":1920,"signals":1,"signals.duration":4000,"signals.instance":[{"enabled":1,"guid":"{3FCC015B-EC59-43AB-AC58-227789FAB52D}","index":0}],"time.step_in":2000,"time.step_out":2000,"transition":1,"transition.duration":300,"transition.instance":[{"enabled":1,"guid":"{DF05E056-A1FE-43a4-8C8A-5E6B5395DF0D}","index":0}]}}};

            // Create a Blob containing the exported data
            const blob = new Blob([JSON.stringify(exportedData)], { type: 'text/plain' });

            // Create a download link
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = Math.floor(Date.now()/1000) + '-' + id;
            if (responseData.data.streamingUrl) {
                downloadLink.download += '-' + extractFileNameWithoutExtension(responseData.data.streamingUrl);
            }
            downloadLink.download += '.kas';
            downloadLink.click();

            // Cleanup
            URL.revokeObjectURL(downloadLink.href);
        });
    }

    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = (typeof input === 'string') ? input : input.url || '';
        if (url.includes('api/v2/lyric/get/lyric')) {
            // If the requested URL matches the specific URL you're interested in
            const request = {
                url: url,
                method: (init && init.method) || 'GET',
                headers: (init && init.headers) || {}
            };
            return originalFetch.apply(this, arguments)
                .then(response => {
                    handleFetch(request, response.clone());
                    return response; // Return the response to allow further chaining
                })
                .catch(error => {
                    console.error("Fetch Error:", error);
                    throw error; // Rethrow the error to propagate it further
                });
        }
        return originalFetch.apply(this, arguments);
    };
})();