// ==UserScript==
// @name         Cartel Empire - Title Job Timer
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  Edits the site title to include a job timer from job page html data.
// @match        https://cartelempire.online/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530890/Cartel%20Empire%20-%20Title%20Job%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/530890/Cartel%20Empire%20-%20Title%20Job%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let originalTitle = document.title;
    let jobInterval = null;
    let timerInterval = null;
    let finishTime = parseInt(localStorage.getItem('CEJobFinishTime'), 10) || null;

    function getJobTime() {
        const jobCompletionElement = document.getElementById('progressMessage');
        if (!jobCompletionElement) return;

        const completionTime = parseInt(jobCompletionElement.getAttribute('data-bs-finishtime'), 10);
        if (!completionTime) return;

        clearInterval(jobInterval);

        if (completionTime !== finishTime) {
            finishTime = completionTime;
            localStorage.setItem('CEJobFinishTime', finishTime);
            startTimer();
        }
    }

    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            if (!finishTime) return;
            
            const remainingTime = Math.max(0, finishTime - Math.floor(Date.now() / 1000));
            const hours = Math.floor(remainingTime / 3600);
            const minutes = Math.floor((remainingTime % 3600) / 60);
            const seconds = remainingTime % 60;
            document.title = (hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}` 
                                        : minutes) 
                            + `:${seconds.toString().padStart(2, '0')} ${originalTitle}`;

            if (remainingTime <= 0) document.title = `00:00 ${originalTitle}`;
        }, 1000);
    }

    if (window.location.href.toLowerCase().includes('cartelempire.online/jobs')) {
        jobInterval = setInterval(getJobTime, 1000);
        getJobTime();
    }

    startTimer();

    setInterval(() => {
        const newFinishTime = parseInt(localStorage.getItem('CEJobFinishTime'), 10) || -1;
        if (newFinishTime !== -1 && newFinishTime !== finishTime) {
            finishTime = newFinishTime;
            startTimer();
        }
    }, 5000);
})();