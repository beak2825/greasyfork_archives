// ==UserScript==
// @name         Superior Economy 2023
// @name:tr      2023 Süper Ekonomi
// @namespace    https://google.com/
// @version      0.1
// @description  This will put a music visualizer whenever you search for a currency graph for turkish lira on Google.
// @description:tr Bu her türk lirasının değerini Google'de aradığında bir music visualizer koyar
// @author       oguz
// @match        https://www.google.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @license GPLV3
// @downloadURL https://update.greasyfork.org/scripts/468355/Superior%20Economy%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/468355/Superior%20Economy%202023.meta.js
// ==/UserScript==


function removeAllEventListeners(element) {
    // Clone the element
    const clonedElement = element.cloneNode(true);

    // Replace the element with the cloned element
    element.parentNode.replaceChild(clonedElement, element);
}

var began = false;
var audio = null;
var audioContext = null;
var audioSource = null;
var analyser = null;
function begin() {
    console.log("begin")
    if(began) return;
    began = true;
    removeAllEventListeners(document.getElementsByClassName("knowledge-finance-wholepage-chart__fw-uch")[0]); //Chart price dot info hover
    const rootElem = document.getElementById("knowledge-currency__updatable-data-column");
    const inputCurrency = rootElem.children[2].children[0].children[0].children[1].children[2].textContent.toLowerCase();
    const outputCurrency = rootElem.children[2].children[0].children[1].children[1].children[2].textContent.toLowerCase();
    //if(!((inputCurrency.includes("dolar") || inputCurrency.includes("dollar") || inputCurrency.includes("euro")) && outputCurrency.includes("lira"))) return;
    if(!(outputCurrency.includes("lira"))) return;
    document.getElementById("currency-v2-updatable_2").children[0].children[3].remove();
    document.getElementById("currency-v2-updatable_2").children[0].children[3].remove();
    var dimensW = document.getElementsByClassName("uch-svg")[0].offsetWidth;
    var dimensH = document.getElementsByClassName("uch-svg")[0].offsetheight;
    var graph = document.getElementsByClassName("uch-svg")[0];
    graph.children[1].remove() // line graph;

    // Create a new canvas element
    var canvas = document.createElement("canvas");

    // Set attributes for the canvas element
    canvas.id = "visCanvas";
    canvas.style.position = 'absolute';
    canvas.width = dimensW;
    canvas.height = dimensH;
    canvas.style.top = 0;
    canvas.style.left = 0;
    graph.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    //audio.src = 'https://filebin.net/e7uxwmcdboza1arn/audio.mp3'; // Replace with the path to your audio file
    //audio = document.getElementById('visualizeraudio')
    var soundLoadedPromise = new Promise(function(resolve, reject) {
    // This will get around the CORS issue
    //      http://wiki.greasespot.net/GM_xmlhttpRequest
    var req = GM_xmlhttpRequest({
        method: "GET",
        url: 'https://filebin.net/e7uxwmcdboza1arn/audio.mp3',
        responseType: 'blob',
        onload: function(response) {
            try {
             audio = new Audio(); // Create an audio element and set its source
            audio.src = window.URL.createObjectURL(response.response);
                 audio.controls = true;
    audio.autoplay = false;
    document.getElementsByClassName("uch-svg")[0].appendChild(audio);
                    audio.addEventListener('play', startVisualizer);
            }
            catch (e){
console.log(e);
            };
        }
    });
});
    //audio.crossOrigin="anonymous"

    // Update canvas dimensions based on window resize
    function resizeCanvas() {
        canvas.width = document.getElementsByClassName("uch-svg")[0].offsetWidth;
        canvas.height = document.getElementsByClassName("uch-svg")[0].offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Start the music visualizer
    function startVisualizer() {
        audioContext = new AudioContext();
        audioSource = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Draw the line spectrum and playback indicator on the canvas
        function getAverage(array) {
            const sum = array.reduce((acc, val) => acc + val, 0);
            return (sum / array.length) * 1;
        }
        let prevBassData = null;
        var points = [];
        const interpolationFactor = 0.5; // Adjust the interpolation factor as needed

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            analyser.getByteFrequencyData(dataArray);

            const bassStart = 0; // Start index of the bass frequencies
            const bassEnd = Math.floor(bufferLength * 0.04); // End index of the bass frequencies
            const bassData = dataArray.subarray(bassStart, bassEnd);

            const average = getAverage(bassData);
            //console.log(average)

            const curveTightness = 0.1; // Adjust the curve tightness as needed

            const barWidth = canvas.width / bassData.length + 2;
            let x = 0;

            points = [];

            // Interpolate values between frames
            if (prevBassData === null) {
                prevBassData = bassData.slice();
            } else {
                for (let i = 0; i < bassData.length; i++) {
                    bassData[i] = bassData[i] < average ? bassData[i] * 0.2 : bassData[i];
                    const value = bassData[i];

                    const prevValue = prevBassData[i];
                    //const interpolatedValue = (prevValue + (value - prevValue) * interpolationFactor) * (bassData[i] < average ? 0.4 : 1);
                    const interpolatedValue = (prevValue + (value - prevValue) * interpolationFactor);
                    const barHeight = canvas.height * (interpolatedValue / 255);
                    const y = canvas.height - barHeight;

                    const point = { x, y, value: interpolatedValue };
                    points.push(point);

                    x += barWidth;
                }
            }

            // Update the previous bass data for the next frame
            prevBassData = bassData.slice();
            if (points.length > 0) {

                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length - 2; i++) {
                    const xc = (points[i].x + points[i + 1].x) / 2;
                    const yc = (points[i].y + points[i + 1].y) / 2;
                    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
                }

                ctx.quadraticCurveTo(
                    points[points.length - 2].x,
                    points[points.length - 2].y,
                    points[points.length - 1].x,
                    points[points.length - 1].y
                );

                ctx.lineTo(points[points.length - 1].x, canvas.height);
                ctx.lineTo(0, canvas.height);
                ctx.closePath();
            }

            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.fill();


            // Draw the playback indicator
            const currentTime = audio.currentTime;
            const duration = audio.duration;
            const indicatorX = (currentTime / duration) * canvas.width;

            const dashWidth = 5;
            const dashSpacing = 3;

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.setLineDash([dashWidth, dashSpacing]);
            ctx.lineDashOffset = indicatorX % (dashWidth + dashSpacing);

            ctx.beginPath();
            ctx.moveTo(indicatorX, 0);
            ctx.lineTo(indicatorX, canvas.height);
            ctx.stroke();

            // Draw the timecode
            const timecode = formatTime(currentTime);
            const timecodeWidth = ctx.measureText(timecode).width;
            const timecodeX = indicatorX - timecodeWidth + 50;
            const timecodeY = 20;

            ctx.fillStyle = '#ffffff';
            ctx.font = '14px Arial';
            ctx.fillText(timecode, timecodeX, timecodeY);

            requestAnimationFrame(draw);
        }

        draw();
    }
    //startVisualizer();
};

// Format time in MM:SS format
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedTime = ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
    return formattedTime;
}

(function () {
    'use strict';
    console.log("waiting");
    waitForKeyElements(".knowledge-finance-wholepage-chart__fw-uch", begin);
    // Your code here...
})();