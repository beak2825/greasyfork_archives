// ==UserScript==
// @name         Drag-Drop Image Uploader
// @namespace           http://tampermonkey.net/
// @version      0.2.1
// @description  Enables image uploading by simply dragging and dropping images onto a fixed div in the bottom right corner of the page. Easily upload and use images on any website with this convenient script.
// @match        https://*/*
// @grant        none
// @license             MIT License
// @author              CY Fung
// @icon                https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/drag-drop-image-uploader.svg
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/466762/Drag-Drop%20Image%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/466762/Drag-Drop%20Image%20Uploader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (location.hostname === 'lihkg.com') {

        if (location.pathname !== '/robots.txt') return;
        if (window.name !== 'pNwjxjQi') return;
        if (window === top) return;


        function T(e) {
            return new Promise(function (resolve, reject) {
                window.history.replaceState(null, '', 'https://lihkg.com');
                let formData = new FormData();
                formData.append('image', e);

                fetch('https://api.na.cx/upload', {
                    method: 'POST',
                    body: formData,

                    "mode": "cors",
                    "credentials": "omit",

                    referrerPolicy: "no-referrer",
                    cache: "default", // no effect on POST request
                    // cache: "force-cache",
                    redirect: "error", // there shall be no redirection in this API request
                    integrity: "",
                    keepalive: false,

                    "headers": {
                        "Accept-Encoding": "gzip, deflate, br",
                        "Accept": "application/json",
                    },

                })
                    .then(function (response) {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error('Status is not 200');
                        }
                    })
                    .then(function (response) {
                        let status = response.status;
                        let url = response.url;
                        let error = response.error;

                        if (status === 200) {
                            resolve(url);
                        } else {
                            reject(new Error(error));
                        }
                    })
                    .catch(function (error) {
                        reject(error);
                    });
            });
        }


        let iframe = document;

        // Function to handle the dragenter event
        function handleDragEnter(e) {
            top.postMessage('pNwjxjQi-top-dragenter', '*');
            // Add a class to visually indicate the drag over the iframe
            //iframe.classList.add("drag-over");
        }

        // Function to handle the dragover event
        function handleDragOver(e) {
            // top.postMessage('pNwjxjQi-top-dragover','*');
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        }

        // Function to handle the dragleave event
        function handleDragLeave(e) {
            top.postMessage('pNwjxjQi-top-dragleave', '*');
            // Remove the class when the drag leaves the iframe
            //iframe.classList.remove("drag-over");
        }

        async function goUpload(e) {

            let files = e.dataTransfer.files;
            let images = [...files].filter(file => file.type == "image/png" || file.type == "image/jpg" || file.type == "image/jpeg" || file.type == "image/gif")
            // console.log(images);

            for (const image of images) {
                await T(image)
                    .then(function (url) {
                        // focusElement.focus();
                        // document.execCommand("insertText", false, url)
                        top.postMessage({ p: 'pNwjxjQi-top-finish-upload', url: url }, '*')
                        console.log('Uploaded image URL:', url);
                    })
                    .catch(function (error) {
                        console.error('Upload failed:', error);
                    });
            }

        }

        // Function to handle the drop event
        function handleDrop(e) {
            e.preventDefault();
            top.postMessage('pNwjxjQi-top-drop', '*');

            // Remove the class when the drop occurs
            //iframe.classList.remove("drag-over");

            // Access the dropped files or data

            goUpload(e);

            // Process the dropped files or data as needed
            // ...
        }
        // Add event listeners for drag and drop events
        iframe.addEventListener("dragenter", handleDragEnter, false);
        iframe.addEventListener("dragover", handleDragOver, false);
        iframe.addEventListener("dragleave", handleDragLeave, false);
        iframe.addEventListener("drop", handleDrop, false);


        top.postMessage('pNwjxjQi-top-uploader-ready', '*');


    } else {

        function onReady() {

            let fixedDiv = null;

            let focusElement = null;

            let moused = false;

            let lastDragIn = 0;
            let cid = 0;


            function createFixedDiv() {


                // Create the fixed div element
                let fixedDiv = document.createElement('div');
                fixedDiv.style.position = 'fixed';
                fixedDiv.style.zIndex = '8888';
                fixedDiv.style.bottom = '10px';
                fixedDiv.style.right = '10px';
                fixedDiv.style.width = '200px';
                fixedDiv.style.height = '200px';
                // fixedDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                fixedDiv.style.border = '2px solid rgb(244, 244, 244)';
                fixedDiv.style.outline = '2px solid rgb(20, 20, 20)';
                fixedDiv.style.borderRadius = '5px';
                fixedDiv.style.padding = '0px';
                fixedDiv.style.color = 'white';
                fixedDiv.style.fontSize = '14px';
                fixedDiv.style.textAlign = 'center';
                //    fixedDiv.style.cursor = 'move';
                // fixedDiv.draggable = true;
                fixedDiv.style.opacity = '0'; // Set initial opacity to 0 (hidden)
                fixedDiv.style.display = 'none';
                fixedDiv.id = 'ewIMf5Dw';

                fixedDiv.style.background = 'url(https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/drag-drop-image-uploader.svg)';
                fixedDiv.style.background = 'url(https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/drag-drop-image-uploader.svg), rgba(135,206,250, 0.2)';

                fixedDiv.style.backgroundPosition = 'center';
                fixedDiv.style.backgroundSize = 'cover';
                fixedDiv.style.backgroundRepeat = 'no-repeat';

                fixedDiv.style.pointerEvents = 'none';

                // Append the div to the document body
                document.body.appendChild(fixedDiv);

                // Create the Intersection Observer
                let observer = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            // When fixedDiv appears, check if it has an iframe inside
                            let iframe = fixedDiv.querySelector('iframe');
                            if (!iframe) {
                                // If no iframe inside, create and append one
                                iframe = document.createElement('iframe');
                                setupIframe(iframe);
                                iframe.src = 'https://lihkg.com/robots.txt';
                                fixedDiv.appendChild(iframe);
                            }
                        }
                    });
                });

                // Observe the fixedDiv element
                observer.observe(fixedDiv);

                return fixedDiv;
            }
            function setupIframe(iframe) {
                if (!fixedDiv) return;
                iframe.name = 'pNwjxjQi';

                iframe.style.position = 'relative';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.opacity = '0';
                iframe.style.pointerEvents = 'all';
                iframe.style.transform = 'translateY(-300vh)';
                fixedDiv.style.transform = 'translateY(-300vh)';

            }




            document.addEventListener('dragleave', function (event) {
                if (!fixedDiv) return;
                if (moused) return;

                if (cid > 0) cid = clearTimeout(cid);
                if (event.relatedTarget) return;
                // console.log(221);

                let endTime = Date.now();
                cid = setTimeout(() => {
                    cid = 0;
                    requestAnimationFrame(() => {
                        if (lastDragIn > endTime) return;

                        if (fixedDiv.style.display !== 'none' && !moused) {

                            // focusElement = null;
                            fixedDiv.style.display = 'none';
                            fixedDiv.style.opacity = '0';
                        }
                    });
                }, 80)

                event.preventDefault();

            });

            document.addEventListener('dragenter', function (event) {
                if (!fixedDiv) fixedDiv = createFixedDiv();
                if (moused) return;
                if (cid > 0) cid = clearTimeout(cid);
                if (event.relatedTarget) return;
                // console.log(222);


                lastDragIn = Date.now();

                let activeNode = document.activeElement || 0;
                let activeNodeName = activeNode.nodeName;
                if (activeNodeName === 'TEXTAREA' || (activeNodeName === 'INPUT' && (!activeNode.type || activeNode.type == 'text'))) {
                    if (fixedDiv.style.display === 'none') {
                        fixedDiv.style.display = 'block';
                        fixedDiv.style.opacity = '0.4';
                        focusElement = activeNode;
                        // console.log(focusElement)
                    }
                }

                requestAnimationFrame(() => {

                    lastDragIn = Date.now();
                });
            }, true);

            document.addEventListener('drop', function (event) {
                if (!fixedDiv) return;
                moused = false;
                if (moused) return;
                if (cid > 0) cid = clearTimeout(cid);
                // console.log(223);

                let endTime = Date.now();
                cid = setTimeout(() => {
                    cid = 0;
                    if (lastDragIn > endTime) return;
                    if (fixedDiv.style.display !== 'none' && !moused) {
                        // focusElement = null;

                        fixedDiv.style.display = 'none';
                        fixedDiv.style.opacity = '0';
                    }
                }, 80)


            }, true);



            window.addEventListener('message', event => {
                if (!fixedDiv) return;

                let data = (((event || 0).data || 0));


                if (data === 'pNwjxjQi-top-uploader-ready') {

                    let fixedDiv = document.querySelector('#ewIMf5Dw');
                    let iframe = fixedDiv.querySelector('iframe');

                    iframe.style.transform = '';
                    fixedDiv.style.transform = '';

                }

                if (data === 'pNwjxjQi-top-dragenter') {
                    moused = true;
                    fixedDiv.style.opacity = '1';
                }
                if (data === 'pNwjxjQi-top-dragleave') {
                    moused = false;
                    fixedDiv.style.opacity = '0.4';
                }

                if (data === 'pNwjxjQi-top-dragenter') {

                    if (cid > 0) cid = clearTimeout(cid);
                }

                if (data === 'pNwjxjQi-top-dragleave') {

                    let endTime = Date.now();
                    if (cid > 0) cid = clearTimeout(cid);
                    cid = setTimeout(() => {
                        cid = 0;
                        requestAnimationFrame(() => {
                            if (lastDragIn > endTime) return;

                            if (fixedDiv.style.display !== 'none' && !moused) {

                                // focusElement = null;
                                fixedDiv.style.display = 'none';
                                fixedDiv.style.opacity = '0';
                            }
                        });
                    }, 80)

                }

                if (data.p === 'pNwjxjQi-top-finish-upload') {
                    let url = event.data.url;
                    focusElement.focus();
                    document.execCommand("insertText", false, url)
                }

                if (data === 'pNwjxjQi-top-drop') {
                    moused = false;

                    let endTime = Date.now();
                    cid = setTimeout(() => {
                        cid = 0;
                        if (lastDragIn > endTime) return;
                        if (fixedDiv.style.display !== 'none' && !moused) {
                            // focusElement = null;

                            fixedDiv.style.display = 'none';
                            fixedDiv.style.opacity = '0';
                        }
                    }, 80)
                }

            })

        }
        if (document.readyState !== 'loading') {
            onReady();
        } else {
            document.addEventListener('DOMContentLoaded', onReady, false);
        }



    }
})();