// ==UserScript==
// @name         Cartel Empire - Job & Expedition Progress Bars
// @namespace    http://tampermonkey.net/
// @version      1.8.8
// @description  Adds progress bars for jobs and expeditions
// @author       Baccy
// @match        https://cartelempire.online/*
// @icon         https://cartelempire.online/images/icon-white.png
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/516602/Cartel%20Empire%20-%20Job%20%20Expedition%20Progress%20Bars.user.js
// @updateURL https://update.greasyfork.org/scripts/516602/Cartel%20Empire%20-%20Job%20%20Expedition%20Progress%20Bars.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const settings = await GM.getValue('progress_bar_settings', {disableExpeditionProgressBar: false, disableJobProgressBar: false,
                                                                 earliestExpeditionOnly: false, lastExpeditionOnly: false,
                                                                 progressBarsFirst: false,
                                                                 flashColorOn100Percent: '', percentageDecimal: 0,
                                                                 expeditionBarFillColor: '', expeditionBarTextColor: '', expeditionBarBackgroundColor: '', expeditionTextShadowColor: '',
                                                                 jobBarFillColor: '', jobBarTextColor: '', jobBarBackgroundColor: '', jobTextShadowColor: ''});

    if (window.location.href.toLowerCase().includes('online/settings')) addSettingsTab('baccy-settings', 'Baccy\'s Userscripts', 'Baccy\'s Userscript Settings');

    let jobData = {};
    let expeditionData = {};

    let jobFlashing = false;
    let expeditionFlashing = {};

    init();

    async function init() {
        if (window.location.href.toLowerCase().includes('cartelempire.online/jobs')) {
            setInterval(processJobs, 1000);
        } else if (window.location.href.toLowerCase().includes('cartelempire.online/expedition')) {
            setInterval(processExpeditions, 1000);
        }

        let barElement;
        if (settings.progressBarsFirst) barElement = document.querySelector('.col-4.col-lg-2');
        else barElement = document.querySelector('.row.justify-content-center.mb-1.text-center.gy-2');
        if (barElement) {
            await loadData();

            if (!settings.disableJobProgressBar && Object.keys(jobData).length > 0) {
                const fillColor = settings.jobBarFillColor || '#7c4acf';
                const textColor = settings.jobBarTextColor || '#3a3a3a';
                const backgroundColor = settings.jobBarBackgroundColor || '#d7d7d7';
                const textShadow = settings.jobTextShadowColor || '#ffffff';

                const jobProgressBar = buildProgressBar(jobData, 'jobLabel', fillColor, textColor, backgroundColor, textShadow, settings.percentageDecimal, 'job-progress-bar', 'Your job will be ready at<br>', 'job-progress-bar-fill', 'job-progress-text', 'M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5z', 'M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85v5.65z');
                if (settings.progressBarsFirst) barElement.parentNode.insertBefore(jobProgressBar, barElement);
                else barElement.appendChild(jobProgressBar);
                setInterval(() => {
                    updateProgressBar('job-progress-bar', 'job-progress-text', jobData, settings.percentageDecimal, fillColor, '#7c4acf', 'job', settings.flashColorOn100Percent);
                }, 1000);
            }

            if (!settings.disableExpeditionProgressBar && Object.keys(expeditionData).length > 0) {
                const fillColor = settings.expeditionBarFillColor || '#5692e4';
                const textColor = settings.expeditionBarTextColor || '#3a3a3a';
                const backgroundColor = settings.expeditionBarBackgroundColor || '#d7d7d7';
                const textShadow = settings.expeditionTextShadowColor || '#ffffff';

                if (Boolean(settings.earliestExpeditionOnly) !== Boolean(settings.lastExpeditionOnly)) {
                    const completionTimes = [];
                    let earliestIndex = -1;
                    let latestIndex = -1;

                    let chosenIndex = -1;

                    for (let i = 0; i < 3; i++) {
                        if (expeditionData[i]) {
                            completionTimes.push(expeditionData[i].completion);
                        }
                    }

                    if (completionTimes.length > 0) {
                        const earliestCompletion = Math.min(...completionTimes);
                        const latestCompletion = Math.max(...completionTimes);

                        for (let i = 0; i < 3; i++) {
                            if (expeditionData[i]) {
                                if (expeditionData[i].completion === earliestCompletion) earliestIndex = i;
                                if (expeditionData[i].completion === latestCompletion) latestIndex = i;
                            }
                        }

                        chosenIndex = settings.earliestExpeditionOnly ? earliestIndex : latestIndex;
                    }

                    if (chosenIndex !== -1 && expeditionData[chosenIndex]) {
                        const expeditionProgressBar = buildProgressBar(expeditionData[chosenIndex], 'expeditionLabel', fillColor, textColor, backgroundColor, textShadow, settings.percentageDecimal, `expedition-progress-bar-${chosenIndex}`, 'Your sicarios will return at<br>', `expedition-progress-bar-${chosenIndex}-fill`, `expedition-progress-text-${chosenIndex}`, 'M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17 1.247 0 3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z');
                        if (settings.progressBarsFirst) barElement.parentNode.insertBefore(expeditionProgressBar, barElement);
                        else barElement.appendChild(expeditionProgressBar);
                        setInterval(() => {
                            for (let i = 0; i < 3; i++) {
                                if (expeditionData[i]) {
                                    completionTimes.push(expeditionData[i].completion);
                                }
                            }

                            if (completionTimes.length > 0) {
                                const earliestCompletion = Math.min(...completionTimes);
                                const latestCompletion = Math.max(...completionTimes);

                                for (let i = 0; i < 3; i++) {
                                    if (expeditionData[i]) {
                                        if (expeditionData[i].completion === earliestCompletion) earliestIndex = i;
                                        if (expeditionData[i].completion === latestCompletion) latestIndex = i;
                                    }
                                }

                                chosenIndex = settings.earliestExpeditionOnly ? earliestIndex : latestIndex;
                            }
                            updateProgressBar(`expedition-progress-bar-${chosenIndex}`, `expedition-progress-text-${chosenIndex}`, expeditionData[chosenIndex], settings.percentageDecimal, fillColor, '#5692e4', 'expedition', settings.flashColorOn100Percent, chosenIndex);
                        }, 1000);
                    }
                } else {
                    for (let i = 0; i < 3; i++) {
                        if (expeditionData[i]) {
                            const expeditionProgressBar = buildProgressBar(expeditionData[i], 'expeditionLabel', fillColor, textColor, backgroundColor, textShadow, settings.percentageDecimal, `expedition-progress-bar-${i}`, 'Your sicarios will return at<br>', `expedition-progress-bar-${i}-fill`, `expedition-progress-text-${i}`, 'M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17 1.247 0 3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z');
                            if (settings.progressBarsFirst) barElement.parentNode.insertBefore(expeditionProgressBar, barElement);
                            else barElement.appendChild(expeditionProgressBar);
                            setInterval(() => {
                                updateProgressBar(`expedition-progress-bar-${i}`, `expedition-progress-text-${i}`, expeditionData[i], settings.percentageDecimal, fillColor, '#5692e4', 'expedition', settings.flashColorOn100Percent, i);
                            }, 1000);
                        }
                    }
                }
            }

            setInterval(loadData, 5000);
        }
    }

    async function loadData() {
        jobData = await GM.getValue('jobData', {});
        expeditionData = await GM.getValue('expeditionData', {});
    }


    function processJobs() {
        const jobCompletionElement = document.getElementById('progressMessage');
        if (jobCompletionElement) {
            const currentTime = Date.now();
            let completionTime = parseInt(jobCompletionElement.getAttribute('data-bs-finishtime'), 10) * 1000;

            if (!jobData || !jobData.completion || jobData.completion < currentTime || jobData.completion !== completionTime) {
                const jobTypeElement = jobCompletionElement.closest('.row.g-0')?.querySelector('.card-title.text-center.mb-2');
                const jobType = jobTypeElement ? jobTypeElement.childNodes[0].nodeValue.trim() : '';
                const jobDuration = completionTime - currentTime;
                const newJobData = {
                    completion: completionTime,
                    duration: jobDuration,
                    location: jobType
                };

                if (newJobData.completion > currentTime) {
                    jobData = newJobData;
                    GM.setValue('jobData', jobData);
                }
            }
        }
    }

    function processExpeditions() {
        function convertDuration(timeString) {
            const timeParts = timeString.split(' ');
            let hours = 0, minutes = 0;

            timeParts.forEach(part => {
                if (part.includes('H')) {
                    hours = parseInt(part.replace('H', ''), 10);
                } else if (part.includes('m')) {
                    minutes = parseInt(part.replace('m', ''), 10);
                }
            });

            return (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
        }

        const completionElements = document.querySelectorAll('.remainingTime');
        const locationElements = document.querySelectorAll('.fs-6 > .fst-italic');
        const expeditionDurationElements = document.querySelectorAll('.card-text.estimatedTime');

        for (let i = 0; i < completionElements.length; i++) {
            const completionTime = parseInt(completionElements[i].getAttribute('completion'), 10) * 1000;
            const currentTime = Date.now();

            if (completionTime > currentTime) {
                const locationText = locationElements[i].innerText.trim();
                const expeditionDurationString = expeditionDurationElements[i].innerText.trim();
                const expeditionDuration = convertDuration(expeditionDurationString);
                const newExpeditionData = {
                    completion: completionTime,
                    duration: expeditionDuration,
                    location: locationText
                };

                if (expeditionData[i]?.completion === newExpeditionData.completion) continue;

                expeditionData[i] = newExpeditionData;
                GM.setValue('expeditionData', expeditionData);
            }
        }
    }

    function buildProgressBar(data, iconLabel, fillColor, textColor, backgroundColor, textShadow, decimalPlace, anchorID, anchorBody, fillId, textId, svgPath1, svgPath2) {
        function formatTimeToLPT(completionTimestamp) {
            if (completionTimestamp) {
                const completionDate = new Date(completionTimestamp);
                let utcTime = completionDate.toUTCString().replace('GMT', 'LPT');
                return utcTime;
            }
        }

        const currentTimestamp = Date.now();
        const remainingTime = data.completion - currentTimestamp;
        const utcTime = formatTimeToLPT(data.completion);
        const percentageRemaining = (remainingTime / data.duration) * 100;
        const progressWidth = Math.min(100 - percentageRemaining, 100);

        const progressBar = document.createElement('div');
        progressBar.classList.add('col-6', 'col-lg-3');

        const anchor = document.createElement('a');
        anchor.id = anchorID;
        if (svgPath1.includes('M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5')) anchor.href = 'https://cartelempire.online/jobs';
        else anchor.href = 'https://cartelempire.online/expedition';
        anchor.setAttribute('tabindex', '0');
        anchor.setAttribute('role', 'button');
        anchor.setAttribute('data-bs-toggle', 'popover');
        anchor.setAttribute('data-bs-html', 'true');
        anchor.setAttribute('data-bs-trigger', 'hover focus');
        anchor.setAttribute('data-bs-placement', 'bottom');
        anchor.setAttribute('data-bs-sanitize', 'false');
        anchor.setAttribute('data-bs-content', `${anchorBody}${utcTime}`);
        anchor.setAttribute('data-bs-original-title', data.location);

        const elementRow = document.createElement('div');
        elementRow.classList.add('row', 'align-items-center', 'g-2');

        const iconElement = document.createElement('div');
        iconElement.classList.add('col-auto');

        const svgLabel = document.createElement('span');
        svgLabel.classList.add(iconLabel, 'd-flex', 'align-items-center', 'mb-0');

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'bi bi-battery-full');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('fill', 'currentColor');
        svg.setAttribute('viewBox', '0 0 16 16');

        const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('d', svgPath1);
        svg.appendChild(path1);

        if (svgPath2) {
            const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path2.setAttribute('d', svgPath2);
            svg.appendChild(path2);
        }

        svgLabel.appendChild(svg);
        iconElement.appendChild(svgLabel);

        const barParentElement = document.createElement('div');
        barParentElement.classList.add('col');

        const barElement = document.createElement('div');
        barElement.classList.add('progress', 'progressBarStat');
        barElement.style.backgroundColor = backgroundColor;

        const barProgressElement = document.createElement('div');
        barProgressElement.classList.add('progress-bar', 'progress-bar-striped');
        barProgressElement.id = fillId;
        barProgressElement.setAttribute('role', 'progressbar');
        barProgressElement.style.width = `${progressWidth}%`;
        barProgressElement.style.backgroundColor = fillColor;

        const barTextParent = document.createElement('div');
        barTextParent.classList.add('progress-bar-title', 'fw-bold');

        const textLabel = document.createElement('span');
        textLabel.textContent = `${progressWidth.toFixed(decimalPlace)}%`;
        textLabel.id = textId;
        textLabel.style.textShadow = textShadow;
        textLabel.style.color = textColor;

        barTextParent.appendChild(textLabel);
        barElement.appendChild(barProgressElement);
        barElement.appendChild(barTextParent);
        barParentElement.appendChild(barElement);
        elementRow.appendChild(iconElement);
        elementRow.appendChild(barParentElement);
        anchor.appendChild(elementRow);
        progressBar.appendChild(anchor);

        return progressBar;
    }

    function updateProgressBar(progressBarID, textId, data, decimal, fillColor, defaultColor, type, flashingColor, i) {
        const progressBarElement = document.querySelector(`#${progressBarID}`);
        const progressBar = progressBarElement.querySelector(`#${progressBarID}-fill`);
        const progressText = progressBarElement.querySelector(`#${textId}`);

        if (!progressBar) return;

        const remainingTime = data.completion - Date.now();
        const percentageRemaining = (remainingTime / data.duration) * 100;
        const percentageComplete = Math.min(100 - percentageRemaining, 100);

        if (percentageComplete >= 100 && flashingColor) {
            if (type === 'job') {
                progressBar.style.setProperty('background-color', jobFlashing ? flashingColor : fillColor || defaultColor, 'important');
                jobFlashing = !jobFlashing;
            } else {
                progressBar.style.setProperty('background-color', expeditionFlashing[i] ? flashingColor : fillColor || defaultColor, 'important');
                expeditionFlashing[i] = !expeditionFlashing[i];
            }
        } else {
            progressBar.style.setProperty('background-color', fillColor || defaultColor, 'important');
        }

        progressBar.style.width = `${percentageComplete}%`;
        progressText.textContent = `${percentageComplete.toFixed(decimal)}%`;
    }

    function addSettingsTab(id, header, name) {
        let navTabs = document.querySelector('#settingsNav > .nav-tabs');
        let tabContent = document.querySelector('#settingsNav > .tab-content');

        if (!navTabs || !tabContent) return;

        let button = document.createElement('button');
        button.id = `v-tab-${id}`;
        button.classList.add('nav-link', 'settings-nav-link', 'baccy-button');
        button.innerText = header;
        button.type = 'button';
        button.role = 'tab';
        button.setAttribute('data-bs-toggle', 'tab');
        button.setAttribute('data-bs-target', `#v-content-${id}`);
        button.setAttribute('aria-controls', `v-content-${id}`);
        button.setAttribute('tab', id);

        let tab = document.createElement('div');
        tab.id = `v-content-${id}`;
        tab.classList.add('tab-pane', 'fade');
        tab.setAttribute('role', 'tabpanel');
        tab.setAttribute('aria-labelledby', `v-tab-${id}`);
        let card = document.createElement('div');
        card.classList.add('card');
        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'baccy-script-div');
        let heading = document.createElement('h5');
        heading.classList.add('h5');
        heading.innerText = name;

        let thisScript = document.createElement('div');
        thisScript.classList.add('card-text');
        thisScript.innerText = 'Progress Bar Settings';
        thisScript.style.cssText = "font-weight: bold; color: white;  padding: 10px 15px; margin: 10px 0; border: 2px solid #444; border-radius: 5px; background-color: #333; cursor: pointer; text-align: center; display: inline-block;";

        let scripts = document.createElement('div');
        scripts.classList.add('card-text');

        scripts.appendChild(thisScript);

        let scriptBody = document.createElement('div');
        scriptBody.style.display = 'none';

        function createSetting(name, type, label) {
            let wrapper = document.createElement("div");
            wrapper.style.cssText = "margin-bottom: 10px; display: flex; align-items: center;";

            let text = document.createElement("label");
            text.innerText = label;
            text.style.cssText = "font-weight: normal; margin-right: 10px;";

            let input = document.createElement("input");
            input.type = type;
            if (type === 'checkbox') input.checked = settings[name];
            else input.value = settings[name];
            input.style.cssText = "width: 80px;";

            input.dataset.setting = name;

            wrapper.appendChild(text);
            wrapper.appendChild(input);
            return wrapper;
        }

        let disableExpeditionProgressBar = createSetting("disableExpeditionProgressBar", "checkbox", "Disable Expedition Progress Bar");
        let disableJobProgressBar = createSetting("disableJobProgressBar", "checkbox", "Disable Job Progress Bar");
        let earliestExpeditionOnly = createSetting("earliestExpeditionOnly", "checkbox", "Earliest Expedition Only");
        let lastExpeditionOnly = createSetting("lastExpeditionOnly", "checkbox", "Last Expedition Only");
        let progressBarsFirst = createSetting("progressBarsFirst", "checkbox", "Progress Bars First");
        let flashColorOn100Percent = createSetting("flashColorOn100Percent", "text", "Flash Color on 100%");
        let percentageDecimal = createSetting("percentageDecimal", "number", "Percentage Decimal");
        let expeditionBarFillColor = createSetting("expeditionBarFillColor", "text", "Expedition Bar Fill Color");
        let expeditionBarTextColor = createSetting("expeditionBarTextColor", "text", "Expedition Bar Text Color");
        let expeditionBarBackgroundColor = createSetting("expeditionBarBackgroundColor", "text", "Expedition Bar Background Color");
        let expeditionTextShadowColor = createSetting("expeditionTextShadowColor", "text", "Expedition Text Shadow Color");
        let jobBarFillColor = createSetting("jobBarFillColor", "text", "Job Bar Fill Color");
        let jobBarTextColor = createSetting("jobBarTextColor", "text", "Job Bar Text Color");
        let jobBarBackgroundColor = createSetting("jobBarBackgroundColor", "text", "Job Bar Background Color");
        let jobTextShadowColor = createSetting("jobTextShadowColor", "text", "Job Text Shadow Color");

        let saveButton = document.createElement("button");
        saveButton.innerText = "Save Progress Bar Settings";
        saveButton.style.cssText = 'width: 200px; display: block; margin-top: 15px; padding: 10px; background-color: #444; color: #fff; border: none; cursor: pointer;';

        saveButton.addEventListener('click', async () => {
            let rawSettings = {
                disableExpeditionProgressBar: disableExpeditionProgressBar.querySelector('input').checked,
                disableJobProgressBar: disableJobProgressBar.querySelector('input').checked,
                earliestExpeditionOnly: earliestExpeditionOnly.querySelector('input').checked,
                lastExpeditionOnly: lastExpeditionOnly.querySelector('input').checked,
                progressBarsFirst: progressBarsFirst.querySelector('input').checked,
                flashColorOn100Percent: flashColorOn100Percent.querySelector('input').value,
                percentageDecimal: percentageDecimal.querySelector('input').value,
                expeditionBarFillColor: expeditionBarFillColor.querySelector('input').value,
                expeditionBarTextColor: expeditionBarTextColor.querySelector('input').value,
                expeditionBarBackgroundColor: expeditionBarBackgroundColor.querySelector('input').value,
                expeditionTextShadowColor: expeditionTextShadowColor.querySelector('input').value,
                jobBarFillColor: jobBarFillColor.querySelector('input').value,
                jobBarTextColor: jobBarTextColor.querySelector('input').value,
                jobBarBackgroundColor: jobBarBackgroundColor.querySelector('input').value,
                jobTextShadowColor: jobTextShadowColor.querySelector('input').value
            };

            let newSettings = {};
            for (let key in rawSettings) {
                if (rawSettings[key] !== undefined) {
                    newSettings[key] = rawSettings[key];
                }
            }

            await GM.setValue('progress_bar_settings', newSettings);
            saveButton.innerText = 'Saved';
            setTimeout(() => {
                saveButton.innerText = 'Save Progress Bar Settings';
            }, 1000);
        });

        scriptBody.appendChild(disableExpeditionProgressBar);
        scriptBody.appendChild(disableJobProgressBar);
        scriptBody.appendChild(earliestExpeditionOnly);
        scriptBody.appendChild(lastExpeditionOnly);
        scriptBody.appendChild(progressBarsFirst);
        scriptBody.appendChild(flashColorOn100Percent);
        scriptBody.appendChild(percentageDecimal);
        scriptBody.appendChild(expeditionBarFillColor);
        scriptBody.appendChild(expeditionBarTextColor);
        scriptBody.appendChild(expeditionBarBackgroundColor);
        scriptBody.appendChild(expeditionTextShadowColor);
        scriptBody.appendChild(jobBarFillColor);
        scriptBody.appendChild(jobBarTextColor);
        scriptBody.appendChild(jobBarBackgroundColor);
        scriptBody.appendChild(jobTextShadowColor);
        scriptBody.appendChild(saveButton);

        thisScript.addEventListener('click', () => {
            scriptBody.style.display = (scriptBody.style.display === 'none' || scriptBody.style.display === '') ? 'block' : 'none';
        });

        scripts.appendChild(scriptBody);

        if (!document.querySelector('.baccy-button')) navTabs.appendChild(button);

        if (!document.querySelector('.baccy-script-div')) {
            cardBody.appendChild(heading);
            cardBody.appendChild(scripts);
            card.appendChild(cardBody);
            tab.appendChild(card);
            tabContent.appendChild(tab);
        } else {
            const existingTab = document.querySelector('.baccy-script-div');
            if (existingTab) existingTab.appendChild(scripts);
        }

        function changeUrl() {
            let newUrl = window.location.href.split('?')[0] + `?t=${id}`;
            history.pushState(null, '', newUrl);
            updateTab();
        }

        button.addEventListener('click', changeUrl);

        function updateTab() {
            let match = window.location.href.match(/[?&]t=([^&]+)/);
            const tabSelected = match ? match[1] === id : false;

            button.classList.toggle('active', tabSelected);
            tab.classList.toggle('active', tabSelected);
            tab.classList.toggle('show', tabSelected);
            button.setAttribute('aria-selected', tabSelected.toString());
            button.setAttribute('tabindex', tabSelected ? '0' : '-1');
        }

        const observer = new MutationObserver(() => updateTab());
        observer.observe(document.body, { childList: true, subtree: true });

        updateTab();
    }
})();