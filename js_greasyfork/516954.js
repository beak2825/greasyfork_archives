// ==UserScript==
// @name         Fishtank GIF Clipper
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Records last 10 seconds of frames from fishtank.live video with a preview and editing options for exporting as GIF
// @license      GNU GPLv3
// @icon         https://raw.githubusercontent.com/luna-mae/ClippingTools/refs/heads/main/media/GIF.png
// @match        https://www.fishtank.live/
// @match        https://www.fishtank.live/clips
// @match        https://www.fishtank.live/clip/*
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/gifshot/0.3.2/gifshot.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.8.1/nouislider.min.js
// @downloadURL https://update.greasyfork.org/scripts/516954/Fishtank%20GIF%20Clipper.user.js
// @updateURL https://update.greasyfork.org/scripts/516954/Fishtank%20GIF%20Clipper.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const styleLinks = [
        'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.8.1/nouislider.min.css'
    ];
    
    styleLinks.forEach(link => {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = link;
        document.head.appendChild(linkElement);
    });
 
    const style = document.createElement('style');
    style.type = 'text/css';
 
    style.innerHTML = `
        .noUi-connect {
            background: #740700 !important;
        }
        .noUi-target {
            background: rgba(25, 29, 33, 1) !important;     
        }           
        .giffy {
            display: inline-block;
            width: 100px;
            font-size: 10px;
            padding: 5px 10px;
            background-color: rgba(25, 29, 33, 1);
            border: 1px solid #505050;
            border-radius: 0;
            cursor: pointer;
            transition: color 0.3s, outline 0.3s;
            box-sizing: border-box;
        }
 
        .giffy:hover {
            outline: 2px solid #f8ec94;
            color: #f8ec94;
        } 
        .cropper-view-box {
            outline: 1px solid #ff0000 !important;
            outline-color: rgb(255 0 0 / 75%) !important;
        }
        .cropper-face {
            background-color: rgb(255 118 118 / 60%) !important;
        }
        .cropper-line {
            background-color: #ff0000 !important;
        }            
        .cropper-point {
            background-color: rgb(255 0 0 / 50%) !important;
        }
        .centerx {
            display: flex;
            justify-content: center;
            align-items: center;  
        }       
        .noUi-handle {
            background: #505050 !important;
            box-shadow: inset 0 0 1px #FFF, inset 0 1px 7px #898989, 0 3px 6px -3px #BBB !important;
            border: 1px solid #505050 !important;
        }
    `;
 
    document.head.appendChild(style);    
 
    const FRAME_INTERVAL = 100;
    const MAX_DURATION = 10000; 
    const frames = [];
    let recording = true;
    let cropper;
 
    const gifButton = document.createElement('button');
    gifButton.innerHTML = '<img src="https://raw.githubusercontent.com/luna-mae/ClippingTools/refs/heads/main/media/GIF.png" alt="GIF" style="height: 26px; vertical-align: middle; margin-right:-5px;"> <span style="position: relative; top: 2px;">CLIPPER</span>';
    gifButton.style.backgroundColor = '#740700';
    gifButton.style.color = 'white';
    gifButton.style.padding = '2px';
    gifButton.style.border = '1px solid rgb(255 0 0 / 25%)';
    gifButton.style.borderRadius = '4px';
    gifButton.style.cursor = 'pointer';
    gifButton.style.marginBottom = '3px';
 
    gifButton.addEventListener('mouseover', () => {
        gifButton.style.backgroundColor = '#8c0b00';
        gifButton.style.border = '1px solid rgb(255 0 0)';        
    });
 
    gifButton.addEventListener('mouseout', () => {
        gifButton.style.backgroundColor = '#740700';
        gifButton.style.border = '1px solid rgb(255 0 0 / 25%)';    
    });
    
    const checkForMonitoringPoint = () => {
        const monitoringPointDiv = document.querySelector('.live-streams-monitoring-point_live-streams-monitoring-point__KOqPQ');
        if (monitoringPointDiv) {
            monitoringPointDiv.parentNode.insertBefore(gifButton, monitoringPointDiv);
            observer.disconnect();
        }
    };
 
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            checkForMonitoringPoint();
        });
    });
 
    observer.observe(document.body, { childList: true, subtree: true });
 
    checkForMonitoringPoint();
    
    gifButton.addEventListener('click', () => {
        recording = false;
        openEditor();
    });
    
 
    const captureFrames = () => {
        if (recording) {
            const video = document.querySelector('video');
            if (video && video.readyState >= 2) { 
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                frames.push(canvas.toDataURL('image/webp'));
    
                const maxFrames = MAX_DURATION / FRAME_INTERVAL;
                if (frames.length > maxFrames) frames.shift();
            }
        }
    };
 
    setInterval(captureFrames, FRAME_INTERVAL);
 
    function openEditor() {
        const editor = document.createElement('div');
        editor.style.position = 'fixed';
        editor.style.top = '50%';
        editor.style.left = '50%';
        editor.style.transform = 'translate(-50%, -50%)';
        editor.style.backgroundColor = ' rgba(25, 29, 33, 1)';
        editor.style.outline = '2px solid #505050';
        editor.style.paddingBottom = '10px';
        editor.style.zIndex = 1001;
        editor.style.borderRadius = '10px';
        editor.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        editor.innerHTML = `
            <div style="background-color: #740700; border-top-left-radius:5px; border-top-right-radius:5px; padding-top:10px; margin-bottom:10px;">
            <h2 style="padding-bottom:5px; color:#fff; margin-left:5px;border-bottom: 1px solid #505050;">Edit GIF</h2>
            </div>
            <div id="previewContainer" style="width: 100%; overflow: hidden; display: flex; flex-direction: column; align-items: center; padding-left:150px; padding-right: 150px;">
                <div class="centerx">
                    <h3 style="color:#fff; margin-bottom:10px;margin-top:10px;">Crop GIF:</h3>
                </div>
            <div style="position: relative;">
                <img id="staticFrameImage" style="max-width: 100%; max-height: 300px; border: 1px solid #ddd;">
                <p id="loadingMessage" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">Loading GIF...</p>
            </div>
            <div class="centerx">
                <h3 style="color:#fff; margin-bottom:10px;margin-top:10px;">Trim GIF:</h3>
            </div>            
            <img id="previewImage" style="max-width: 100%; max-height: 300px; border: 1px solid #ddd; margin-top: 10px; margin-bottom:15px; display: none;">
            </div>
            <label style="margin-left:25px;margin-bottom: 15px; padding-top:15px;">Trim GIF Length:</label>
            <div class="centerx">
            <div id="gifLengthSlider" style="width: 90%; margin-top: 10px;"></div>
            </div>
            <div style="padding-top:15px;">
            <span id="lengthDisplay" style="margin-top: 5px;margin-left:25px;"></span>
            <div class="centerx" style="margin-top:10px;">
                <label for="qualityDropdown" style="color:#fff; margin-right:10px;">Export Quality:</label>
                <select id="qualityDropdown" class="giffy">
                    <option value="10">10</option>
                    <option value="9">9</option>
                    <option value="8" selected>8</option>
                    <option value="7">7</option>
                    <option value="6">6</option>
                    <option value="5">5</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>                 
                </select>
                <label for="divisionDropdown" style="color:#fff; margin-right:10px; margin-left:10px;">Export Size:</label>
                <select id="divisionDropdown" class="giffy">
                    <option value="1">100%</option>
                    <option value="1.333">75%</option>
                    <option value="2" selected>50%</option>
                    <option value="4">25%</option>                    
                </select>
                       
            <button class="giffy" id="exportGif" style="margin-left:10px;">Export GIF</button>
            <button class="giffy" id="closeEditor" style="margin-left:10px;">Cancel</button>
            </div> 
            </div>
        `;
        
        
        document.body.appendChild(editor);
 
        const qualityDropdown = document.getElementById('qualityDropdown');
        const divisionDropdown = document.getElementById('divisionDropdown');
 
        const previewImage = document.getElementById('previewImage');
        const staticFrameImage = document.getElementById('staticFrameImage');
        const staticFrameCanvas = document.createElement('canvas');
        staticFrameCanvas.style.display = 'none';
        document.body.appendChild(staticFrameCanvas);
        
        const video = document.querySelector('video');
        staticFrameCanvas.width = video.videoWidth;
        staticFrameCanvas.height = video.videoHeight;
        const ctx = staticFrameCanvas.getContext('2d');
        ctx.drawImage(video, 0, 0, staticFrameCanvas.width, staticFrameCanvas.height);
        const staticFrameDataURL = staticFrameCanvas.toDataURL('image/webp');
        staticFrameImage.src = staticFrameDataURL;
        
        staticFrameImage.addEventListener('load', () => {
            cropper = new Cropper(staticFrameImage, {
                viewMode: 1,
                autoCropArea: 1,
                movable: true,
                zoomable: true,
                scalable: true,
                rotatable: false,
            });
        });
        
        const gifLengthSlider = document.getElementById('gifLengthSlider');
        noUiSlider.create(gifLengthSlider, {
            start: [0, frames.length * FRAME_INTERVAL / 1000],
            connect: true,
            range: {
                'min': 0,
                'max': frames.length * FRAME_INTERVAL / 1000
            }
        });
 
        gifLengthSlider.noUiSlider.on('update', (values) => {
            const startFrame = Math.floor(values[0] * 1000 / FRAME_INTERVAL);
            const endFrame = Math.floor(values[1] * 1000 / FRAME_INTERVAL);
            lengthDisplay.textContent = `Start: ${values[0]}s (Frame ${startFrame}), End: ${values[1]}s (Frame ${endFrame})`;
        });
 
        gifLengthSlider.noUiSlider.on('end', (values) => {
            updateGifPreview(Math.floor(values[0] * 10), Math.floor(values[1] * 10));
        });
        
        editor.querySelector('#exportGif').addEventListener('click', () => {
            const length = gifLengthSlider.noUiSlider.get();
            const quality = qualityDropdown.value;
            const division = divisionDropdown.value;            
            exportGif(length[0] * 10, length[1] * 10, cropper.getData(), quality, division);
            document.body.removeChild(editor);
            frames.length = 0;
            recording = true;
        });
 
        editor.querySelector('#closeEditor').addEventListener('click', () => {
            document.body.removeChild(editor);
            frames.length = 0;
            recording = true;
        });
        
        updateGifPreview(0, frames.length);
    }
 
    function updateGifPreview(start, end) {
        const loadingMessage = document.getElementById('loadingMessage');
        const previewImage = document.getElementById('previewImage');
        loadingMessage.style.display = 'block';
        previewImage.style.display = 'none';
    
        const framesToUse = frames.slice(start, end);
        if (framesToUse.length === 0) {
            console.error("Not enough frames to generate the GIF.");
            loadingMessage.textContent = "Error: Not enough frames.";
            return;
        }
 
        const numbWorkers = navigator.hardwareConcurrency ? Math.min(navigator.hardwareConcurrency, 8) : 6;
 
        gifshot.createGIF({
            images: framesToUse,
            interval: FRAME_INTERVAL / 1000,
            gifWidth: 530,
            gifHeight: 298,
            numWorkers: numbWorkers,
            quality: 1,
        }, function (obj) {
            if (!obj.error) {
                const image = obj.image;
                previewImage.src = image;
                previewImage.style.display = 'block';
                previewImage.style.bottom = '10px';
                loadingMessage.style.display = 'none';
            } else {
                console.error('GIF generation failed:', obj.error);
                loadingMessage.textContent = "Error generating GIF.";
            }
        });
    }
    
    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
    }
 
    function exportGif(start, end, cropData, quality, division) {
        console.log("Starting GIF export process with gifshot...");
    
        const framesToUse = frames.slice(start, end).map((frameSrc) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = frameSrc;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = cropData.width;
                    canvas.height = cropData.height;
                    ctx.drawImage(img, cropData.x, cropData.y, cropData.width, cropData.height, 0, 0, cropData.width, cropData.height);
                    resolve(canvas.toDataURL());
                };
                img.onerror = (error) => {
                    console.error(`Failed to load frame:`, error);
                    reject(error);
                };
            });
        });
 
        const numbbWorkers = navigator.hardwareConcurrency ? Math.min(navigator.hardwareConcurrency, 8) : 6;
 
        Promise.all(framesToUse).then((croppedFrameUrls) => {
            gifshot.createGIF({
                'images': croppedFrameUrls,
                'interval': FRAME_INTERVAL / 1000,
                'gifWidth': cropData.width / division,
                'gifHeight': cropData.height / division,
                'numWorkers': numbbWorkers,
                'quality': quality,
            }, function (obj) {
                if (!obj.error) {
                    const image = obj.image;
                    const downloadLink = document.createElement('a');
                    downloadLink.href = image;
                    downloadLink.download = 'exported.gif';
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    console.log("GIF successfully generated and downloaded.");
                } else {
                    console.error("GIF generation failed:", obj.error);
                }
            });
        }).catch((error) => {
            console.error('Error cropping frames:', error);
        });
    }
    
})();