// ==UserScript==
// @name         GBT face detection & age prediction (GBTFA)
// @namespace    _pc
// @version      0.9b
// @license      MIT
// @description  Detects faces and predicts ages
// @author       verydelight
// @match        *://*.gayboystube.com/galleries/*
// @connect      gayboystube.com
// @connect      localhost
// @icon         https://www.gayboystube.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_download
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/523705/GBT%20face%20detection%20%20age%20prediction%20%28GBTFA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523705/GBT%20face%20detection%20%20age%20prediction%20%28GBTFA%29.meta.js
// ==/UserScript==

const internalPrefix = "GBTFA";
const detectionThreshold = 0.6;
const ageThreshold = 18;
const pattern1 = /\/thumbs/;
const pattern2 = /\/main\/\d{1,4}x\d{1,4}/;
console.log(internalPrefix, `Initialising "${GM_info.script.name}" v${GM_info.script.version} by ${GM_info.script.author}.`);
console.log(internalPrefix, `Configuration: Under-age threshold ${ageThreshold} years, face detection confidence threshold ${detectionThreshold}.`);
(async function() {
	'use strict';
const modelPath = 'http://localhost:3000/node_modules/face-api.js/models';
const modelPromises = [
    faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath),
    faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
    faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
    faceapi.nets.ageGenderNet.loadFromUri(modelPath)
];
const imagesPromise = new Promise(resolve => {
    const onDOMContentLoaded = () => {
        const images = document.querySelectorAll('#album_view_album_view img');
        resolve(images);
        document.removeEventListener('DOMContentLoaded', onDOMContentLoaded); // Clean up
    };
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
});
const [images] = await Promise.all([imagesPromise, ...modelPromises]);
    async function detectFaces() {
		for (const img of images) {
			const dataSrc = img.getAttribute('data-src');
			if(dataSrc){
				try {
					const response = await GM.xmlHttpRequest({
						method: 'GET',
						responseType: 'blob',
						url: dataSrc,
						headers: {
							"Content-Type": "image/jpeg", "Accept": "image/jpeg"
						},
					});
					const blob = new Blob([response.response], { type: 'image/jpeg' });
					const blobUrl = URL.createObjectURL(blob);
					img.src = blobUrl;
					img.className = '';
					img.removeAttribute("class");
				} catch (error) {
					console.error(`Error fetching ${dataSrc}:`, error);
				}
			}
			const allDetections = await faceapi.detectAllFaces(img, new faceapi.SsdMobilenetv1Options())
			.withFaceLandmarks()
			.withFaceDescriptors()
			.withAgeAndGender();
			const detections = allDetections.filter(detection => detection.detection.score >= detectionThreshold);
			if (detections.length > 0) {
				const canvas = await faceapi.createCanvasFromMedia(img);
				img.parentNode.insertBefore(canvas, img.nextSibling);
				canvas.style.position = 'absolute';
				canvas.style.left = `${img.offsetLeft}px`;
				canvas.style.top = `${img.offsetTop}px`;
				canvas.width = img.width;
				canvas.height = img.height;
				const resizedDetections = faceapi.resizeResults(detections, { width: img.width, height: img.height });
				const drawOptions = new faceapi.draw.DrawBoxOptions({ label: '', withScore: false });
				const context = canvas.getContext('2d');
				resizedDetections.forEach(({ age, detection }) => {
					const ageCol = age < ageThreshold ? "red" : "blue";
					const ageText = age < ageThreshold ? " VALIDATE!" : '';
					const { box, score } = detection;
					const confidence = score.toFixed(2);
					const drawBox = new faceapi.draw.DrawBox(box, { boxColor: ageCol });
					drawBox.draw(canvas);
					const { x, y, width, height } = box;
					const text = `~${Math.floor(age)}y${ageText}`;
					context.fillStyle = ageCol;
					context.fillRect(x, y + height, context.measureText(text).width + 10, 20);
					context.fillStyle = '#FFFFFF';
					context.fillText(text, x + 5, y + height + 15);
				});
			}
		}
	}
	images.forEach(img => {
		img.parentNode.style.position = 'relative';
	});
    await detectFaces();
})();
