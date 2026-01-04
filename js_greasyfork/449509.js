// ==UserScript==
// @name         Auto learning
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Auto passing H3C online learning
// @author       Particle_G
// @match        http://lmsn.h3c.com/els/html/courseStudyItem/courseStudyItem.learn.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=h3c.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449509/Auto%20learning.user.js
// @updateURL https://update.greasyfork.org/scripts/449509/Auto%20learning.meta.js
// ==/UserScript==


const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
};

const optionConfig = {
    x: 140,
    y: 160,
    step: 60
}

const performClick = (canvas, x, y) => {
    canvas.dispatchEvent(new MouseEvent("mousedown", {
        clientX: x,
        clientY: y,
        bubbles: true
    }));

    canvas.dispatchEvent(new MouseEvent("mouseup", {
        clientX: x,
        clientY: y,
        bubbles: true
    }));
};

const selectOptions = (canvas, options) => {
    options.forEach(option => {
        performClick(
            canvas,
            optionConfig.x,
            optionConfig.y + optionConfig.step * option
        );
    });
    performClick(canvas, 740, 410);
};

async function autoLearning(remainTime = 0) {
    console.info('Checking iframe...');
    let iframe = document.querySelector("iframe");
    while (!iframe) {
        console.info('Waiting for iframe to be available...');
        await sleep(250);
        iframe = document.querySelector("iframe");
    }

    console.info('Skipping video...');
    let video = iframe.contentWindow.document.querySelector('#myvideo');
    while (!video) {
        console.info('Waiting for video to be available...');
        await sleep(1000);
        video = iframe.contentWindow.document.querySelector('#myvideo');
    }

    let canvas = iframe.contentWindow.document.querySelector('#layaCanvas');
    if (!canvas) {
        canvas = document.querySelector("iframe").contentWindow.document.querySelector('#layaCanvas');
        console.log(canvas);
    }

    await sleep(250);

    if (video.paused) {
        performClick(canvas, 380, 310);
        await sleep(250);
    }

    video.currentTime = Math.floor(video.duration) - remainTime;
    video.play();

    while (!video.ended) {
        console.info('Waiting for video to be ended...');
        await sleep(250);
    }

    performClick(canvas, 750, 480);
    await sleep(250);
    if (!video.paused) {
        console.info('Go to new video...');
        return;
    }

    let questionNumber = 1;
    while (iframe.contentWindow[`T${questionNumber}`]) {
        let answers = (new iframe.contentWindow[`T${questionNumber}`]).t_ans.split("").map(item => item.charCodeAt() - 65);
        selectOptions(canvas, answers);
        await sleep(100);
        performClick(canvas, 400, 380);
        questionNumber++;
        await sleep(100);
        if (!video.paused) {
            break;
        }
    }
    while (video.paused) {
        console.info('Waiting for new video to be started...');
        await sleep(250);
    }
}

(async () => {
    'use strict';
    try {
        while (true) {
            await autoLearning();
            await sleep(500);
        }
    } catch (error) {
        console.log(error);
    }
})();