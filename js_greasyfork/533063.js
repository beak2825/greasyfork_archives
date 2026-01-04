// ==UserScript==
// @name         Cartel Empire - Easy Job Restarts
// @namespace    baccy.ce
// @version      0.1.3
// @description  Adds a button to start your preferred job without needing to refresh the page
// @author       Baccy
// @match        https://cartelempire.online/jobs
// @match        https://cartelempire.online/Jobs
// @icon         https://cartelempire.online/images/icon-white.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533063/Cartel%20Empire%20-%20Easy%20Job%20Restarts.user.js
// @updateURL https://update.greasyfork.org/scripts/533063/Cartel%20Empire%20-%20Easy%20Job%20Restarts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const header = document.querySelector('.header-section');
    if (!header) return;
    header.style.display = 'flex';

    const jobs = {
        Intimidation: 'https://cartelempire.online/jobs/intimidation',
        Arson: 'https://cartelempire.online/jobs/arson',
        'GTA': 'https://cartelempire.online/jobs/gta',
        'Transport': 'https://cartelempire.online/jobs/transportdrugs',
        'Farm': 'https://cartelempire.online/jobs/farmrobbery',
        'Agave': 'https://cartelempire.online/jobs/agavestorage',
        'Paste': 'https://cartelempire.online/jobs/cocapaste',
        'Construction': 'https://cartelempire.online/jobs/constructionrobbery',
        Blackmail: 'https://cartelempire.online/jobs/blackmail',
        Hacking: 'https://cartelempire.online/jobs/hacking'
    };

    let currentJob = localStorage.getItem('CE_current_quick_job') || 'Intimidation';

    const responseElement = document.createElement('p');
    responseElement.className = 'card-text fw-bold text-white';
    responseElement.style.cssText = 'transition: opacity 1s ease; opacity: 1;';
    const previousSuccess = localStorage.getItem('CE_job_success_msg');
    if (previousSuccess) {
        responseElement.textContent = previousSuccess;
        localStorage.removeItem('CE_job_success_msg');
        setTimeout(() => {
            responseElement.style.opacity = '0';

            setTimeout(() => {
                responseElement.textContent = '';
                responseElement.style.opacity = '1';
            }, 1000);
        }, 2000);
    }

    const jobBtn = document.createElement('span');
    jobBtn.innerText = 'Start Job';
    jobBtn.style.cssText = 'color: #fff; margin-left: 15px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; padding: 0px 5px;';
    jobBtn.addEventListener('click', async () => {
        const response = await fetch(jobs[currentJob], { method: 'POST' });
        const html = await response.text();

        const temp = document.createElement('div');
        temp.innerHTML = html;
        const jobMessage = temp.querySelector('p.card-text.fw-bold.text-white');
        if (jobMessage.parentElement.classList.contains('bg-success')) {
            localStorage.setItem('CE_job_success_msg', jobMessage.textContent);
            window.location.reload();
        }

        responseElement.textContent = jobMessage.textContent;
        setTimeout(() => {
            responseElement.style.opacity = '0';

            setTimeout(() => {
                responseElement.textContent = '';
                responseElement.style.opacity = '1';
            }, 1000);
        }, 2000);
    });

    const jobSelect = document.createElement('select');
    jobSelect.style.cssText = 'margin-left: 15px; color: #fff; background: #444; border: 1px solid #ccc; border-radius: 4px; width: auto; cursor: pointer; margin-right: 15px;';

    Object.keys(jobs).forEach(job => {
        const option = document.createElement('option');
        option.value = job;
        option.textContent = job;
        if (job === currentJob) option.selected = true;
        jobSelect.appendChild(option);
    });

    jobSelect.addEventListener('change', () => {
        currentJob = jobSelect.value;
        localStorage.setItem('CE_current_quick_job', currentJob);
    });

    header.appendChild(jobBtn);
    header.appendChild(jobSelect);
    header.appendChild(responseElement);
})();
