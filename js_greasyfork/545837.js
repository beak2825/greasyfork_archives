// ==UserScript==
// @name         Garmin Connect: Upload Audio Notes to Workout
// @namespace    http://tampermonkey.net/
// @description  Adds audio upload buttons to workout page in Garmin Connect
// @author       flowstate
// @match        https://connect.garmin.com/modern/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=garmin.com
// @grant        window.onurlchange
// @license      MIT
// @version      1.12.1
// @downloadURL https://update.greasyfork.org/scripts/545837/Garmin%20Connect%3A%20Upload%20Audio%20Notes%20to%20Workout.user.js
// @updateURL https://update.greasyfork.org/scripts/545837/Garmin%20Connect%3A%20Upload%20Audio%20Notes%20to%20Workout.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // https://connect.garmin.com/modern/workout/WORKOUTID

    // Garmin API:

    const workoutEndpoint = 'https://connect.garmin.com/workout-service/workout';
    const audioNoteUploadEndpoint = 'https://connect.garmin.com/workout-service/workout/audionote/upload';

    // get workout id as a string. it's actually an integer but that doesn't
    // matter since we're only using it in urls
    function getWorkoutId() {
        const id = location.pathname.split('/').pop() 
        if (/^\d+$/.test(id)) {
            return id;
        }
        throw new Error("could not determine workout ID");
    }

    async function apiGetCurrentWorkout() {
        const url = `${workoutEndpoint}/${getWorkoutId()}?includeAudioNotes=true&_=${Date.now()}`;
        return fetchRequest('fetch workout data', url);
    }

    function apiPutCurrentWorkout(workoutData) {
        const url = `${workoutEndpoint}/${getWorkoutId()}`;
        const payload = JSON.stringify(workoutData);
        return fetchRequest('update workout', url, 'PUT', payload, true);
    }

    async function apiPostAudioNote(formData) {
        return fetchRequest('upload audio note', audioNoteUploadEndpoint, 'POST', formData, false,
            (response, defaultMsg) => {
                let msg = defaultMsg;
                if (response.status === 500) {
                    msg += ".\n\nTry again with a valid audio file that's supported by Garmin (e.g. MP3)"
                }
                throw new Error(msg);
            }
        )
    }

    async function apiDeleteAudioNote(uuid) {
        const url = `https://connect.garmin.com/workout-service/workout/audionote?audiouuid=${uuid}`;
        return fetchRequest('delete audio note', url, 'DELETE');
    }

    // ====================================================

    const sendButtonSelector = 'span a.send-to-device';
    const sendButtonAlternativeSelector = '#headerBtnRightState-readonly button';
    const editButtonId = 'headerLeftBtn';

    let addButton;
    let oldAddButton;
    let alreadyHere = false

    let tasks = [];

    const workoutConfirmMsg = 'Workout audio note already exists. Do you want to replace it?';
    const stepConfirmMsg = 'Step audio note already exists. Do you want to replace it?'
    
    oneTimeInit();
    
    function oneTimeInit() {
        initStyles();
        waitForUrl();
    }

    function waitForUrl() {
        // if (window.onurlchange == null) {
            // feature is supported
            window.addEventListener('urlchange', onUrlChange);
        // }
        onUrlChange();
    }

    function onUrlChange() {
        const urlMatches = window.location.href.startsWith('https://connect.garmin.com/modern/workout/');
        if (!alreadyHere) {
            if (urlMatches) {
                alreadyHere = true;
                init();
            }
        } else {
            if (!urlMatches) {
                alreadyHere = false;
                deinit();
            }        
        }
    }

    function init() {
        tasks = [];
        tasks.push(waitForElement(`${sendButtonSelector}, ${sendButtonAlternativeSelector}`, addUploadButtons));
    }

    function deinit() {
        hideSpinner();
        tasks.forEach(task => task.stop());
        tasks = [];
    }

    function waitForElement(readySelector, callback) {
        let timer = undefined;

        const tryNow = function () {
            const elem = document.querySelector(readySelector);
            if (elem) {
                addButton = document.querySelectorAll(sendButtonSelector);
                oldAddButton = document.querySelectorAll(sendButtonAlternativeSelector);
                callback(elem);
            } else {
                timer = setTimeout(tryNow, 300);
            }
        };

        const stop = function () {
            clearTimeout(timer);
            timer = undefined;
        }

        tryNow();
        return {
            stop
        }
    }

    function addStyle(styleString) {
        const style = document.createElement('style');
        style.textContent = styleString;
        document.head.append(style);
    }

    function initStyles() {
        // spinner
        addStyle(`
            .audio-upload-spinner {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                background-color: black;
                opacity: 0.5;
                z-index: 9999998
            }

            .audio-upload-spinner-inner {
                position: absolute;
                left: 50%;
                top: 50%;
                height:60px;
                width:60px;
                margin:0px auto;
                -webkit-animation: rotation .6s infinite linear;
                -moz-animation: rotation .6s infinite linear;
                -o-animation: rotation .6s infinite linear;
                animation: rotation .6s infinite linear;
                border-left:6px solid rgba(0,174,239,.15);
                border-right:6px solid rgba(0,174,239,.15);
                border-bottom:6px solid rgba(0,174,239,.15);
                border-top:6px solid rgba(0,174,239,.8);
                border-radius:100%;
                z-index: 9999999
            }

            @-webkit-keyframes rotation {
                from {-webkit-transform: rotate(0deg);}
                to {-webkit-transform: rotate(359deg);}
            }
            @-moz-keyframes rotation {
                from {-moz-transform: rotate(0deg);}
                to {-moz-transform: rotate(359deg);}
            }
            @-o-keyframes rotation {
                from {-o-transform: rotate(0deg);}
                to {-o-transform: rotate(359deg);}
            }
            @keyframes rotation {
                from {transform: rotate(0deg);}
                to {transform: rotate(359deg);}
            }
        `);

        // tooltip
        addStyle(`
            [data-customTooltip]{
                cursor: pointer;
                position: relative;
            }

            [data-customTooltip]::after {
                // background-color: #fff;
                // color: #222;
                background-color: #222;
                color: #fff;
                font-size:14px;
                padding: 8px 12px;
                height: fit-content;
                width: fit-content;
                text-wrap: nowrap;
                border-radius: 6px;
                position: absolute;
                text-align: center;
                bottom: -5px;
                left: 50%;
                content: attr(data-customTooltip);
                transform: translate(-50%, 110%) scale(0);
                transform-origin: top;
                transition: 0.14s;
                box-shadow: 0 4px 14px 0 rgba(0,0,0,.2), 0 0 0 1px rgba(0,0,0,.05);
                z-index: 9999999
            }
            [data-customTooltip]:hover:after {
                display: block;
                transform: translate(-50%, 110%) scale(1);
            }
        `);
    }

    /** 
     * 
     * @param description {string}
     * @param url {string}
     * @param method {string}
     * @param requestIsJson {boolean|undefined}
     * 
     * **/

    async function fetchRequest(description, url, method, data, requestIsJson, customServerErrorHandler) {
        const localStoredToken = window.localStorage.getItem("token");
        const token = JSON.parse(localStoredToken).access_token;
    
        const headers = new Headers();
        if (requestIsJson) {
            headers.append("Content-Type", "application/json");
        }
        headers.append("NK", "NT");
        headers.append("Di-Backend", "connectapi.garmin.com");
        headers.append("Authorization", `Bearer ${token}`);

        let response;
        try {
            response = await fetch(url, {
                method: method || 'GET',
                headers: headers,
                body: data || null,
            })
        } catch (error) {
            throw new Error(`failed to ${description}. ${error}`);
        }
        if (!response.ok) {
            const defaultMsg = `failed to ${description}. Server returned ${formatResponseError(response)}`;
            if (customServerErrorHandler) {
                customServerErrorHandler(response, defaultMsg);
            } else {
                throw new Error(defaultMsg);
            }
        }
        return response;
    }

    function formatResponseError(response) {
        if (!response.statusText) {
            return `${response.status} error`;
        }
        return `${response.status} ${response.statusText}`;
    }

    let needReload = false;
    function success(msg, forceReload) {
        alert(msg);
        (forceReload || needReload) && window.location.reload();
    }

    function error(msg, forceReload) {
        alert(msg);
        (forceReload || needReload) && window.location.reload();
    }

    function showSpinner() {
        if (document.querySelector('.audio-upload-spinner')) {
            return;
        }

        const wrapper = createElement('div', 'audio-upload-spinner');
        const element = createElement('div', 'audio-upload-spinner-inner');
        wrapper.appendChild(element);
        document.body.appendChild(wrapper);
    }

    function hideSpinner() {
        const element = document.querySelector('.audio-upload-spinner');
        if (element) {
            element.remove();
        }
    }

    function deleteUploadButtons() {
        document.querySelectorAll('.garmin-upload-audio-button').forEach(e => e.remove());
    }

    function addUploadButtons() {
        deleteUploadButtons() 
        if (addButton.length == 0 && oldAddButton.length == 0) {
            error("Could not find Send to Device button");
            return;
        }

        // TODO fixme
        const _addButton = document.querySelector(sendButtonSelector);
        const _oldAddButton = document.querySelector(sendButtonAlternativeSelector);
        const buttonToUse = _addButton || _oldAddButton;
        if (buttonToUse) {
            createButton(buttonToUse.parentNode, null);
        }

        const steps = document.querySelectorAll("[data-step-id]");
        for (let i = 0; i < steps.length; i++) {
            const c = steps[i].getAttribute('class');
            // exclude "steps" which are actually repeat groups
            if (c.includes('WorkoutStep')) {
                createButton(steps[i], i);
            }
        }

        haveUploadButtons = true;

        const editButton = document.getElementById(editButtonId);
        const sendToDeviceButton = document.getElementById('headerBtnRightState-edit');
        const saveWorkoutButton = document.getElementById('headerBtnRightState-readonly');
        const doneButton = document.getElementById('headerBtnRightState-saved');
        const headerRightButtonToUse = sendToDeviceButton || saveWorkoutButton || doneButton;

        if (editButton && headerRightButtonToUse) {
            // responsive way which has a bunch of assumptions
            headerRightButtonToUse.addEventListener('click', doneButtonClickHandler);
            editButton.addEventListener('click', editButtonClickHandler);
        } else {
            // slow way
            if (!isWatchingAddButton) {
                tasks.push(watchAddButton());
            }
        }
    }

    function editButtonClickHandler() {
        setTimeout(() => {
            let _sendToDeviceButton = document.getElementById('headerBtnRightState-edit');
            if (_sendToDeviceButton) {
                haveUploadButtons && deleteUploadButtons();
                haveUploadButtons = false;
            } else {
                !haveUploadButtons && addUploadButtons();
                haveUploadButtons = true;
            }
        }, 0);
    }

    function doneButtonClickHandler() {
        // cheaderBtnRightState-readonly => Send To Device
        // cheaderBtnRightState-edit => Save Workout
        // cheaderBtnRightState-saved => Done
        if (this.id === 'headerBtnRightState-saved') {
            setTimeout(() => {
                !haveUploadButtons && addUploadButtons();
                haveUploadButtons = true;
            }, 0);
        }
    }

    let haveUploadButtons = false;
    let isWatchingAddButton = false;
    function watchAddButton() {
        if (isWatchingAddButton) {
            return;
        }
        isWatchingAddButton = true;
        let timer = undefined;
        const tryNow = function () {
            const addButton = document.querySelector(sendButtonSelector);
            const oldAddButton = document.querySelector(sendButtonAlternativeSelector);

            const buttonToUse = addButton || oldAddButton;
            if (haveUploadButtons && (!buttonToUse || (buttonToUse && isHidden(buttonToUse)))) {
                deleteUploadButtons();
                haveUploadButtons = false;
            } else if (!haveUploadButtons && buttonToUse && !isHidden(buttonToUse)) {
                addUploadButtons();
            }
            timer = setTimeout(tryNow, 300);
        };

        const stop = function () {
            isWatchingAddButton = false;
            clearTimeout(timer);
            timer = undefined;
        }

        tryNow();
        return {
            stop
        };
    }

    function isHidden(el) {
        return (el.offsetParent === null);
    }

    function isEditing() {
        // guess
        const addButton = document.querySelectorAll(sendButtonSelector);
        const oldAddButton = document.querySelectorAll(sendButtonAlternativeSelector);

        if (addButton.length == 0 && oldAddButton.length == 0) {
            return true;
        }

        if (addButton.length > 0) {
            return isHidden(addButton[0]);
        }

        if (oldAddButton.length > 0) {
            return isHidden(oldAddButton[0]);
        }

        return false;
    }

    function createElement(tagName, additionalClasses) {
        var el = document.createElement(tagName);
        el.setAttribute('class', `garmin-upload-audio-button ${additionalClasses || ''}`);
        return el;
    }

    function prepareButton(button, id, name) {
        if (name) button.text = name;
        button.removeAttribute('data-target');
        button.removeAttribute('data-toggle');
        button.style.marginLeft = '3px';
        button.setAttribute('class', 'btn btn-medium garmin-upload-audio-button');
        button.setAttribute('id', `garmin-upload-audio-button${id}`);
        return button;
    }

    // index: null for workout, 0...n-1 for steps
    function createButton(parentNode, index) {
        const stepOrder = index == null ? null : index + 1;
        const idSuffix = stepOrder ? `-step-order-${stepOrder}` : '-workout';

        const stepNode = index == null ? null : parentNode;
        let audioNoteExists = false;
        if (stepNode) {
            audioNoteExists = !!stepNode.querySelector('[class*="AudioRecorder"]');
        } else {
            audioNoteExists = !!document.querySelector('[class*="WorkoutPageRightNav"] [class*="AudioRecorder"]');
        }
        
        const shareButtonWrapper = createElement('div')
        if (stepOrder == null) {
            shareButtonWrapper.setAttribute('style', 'background-color: white');
        } else {
            shareButtonWrapper.setAttribute('style', 'background-color: white; margin-left: auto');
        }

        let shareButton;
        if (addButton.length > 0) {
            shareButton = addButton[0].cloneNode(true);
        } else if (oldAddButton.length > 0) {
            shareButton = document.createElement("a");
        }
        
        shareButton = prepareButton(shareButton, idSuffix);
        shareButton.setAttribute('data-customTooltip',
            stepOrder == null ? 'Upload workout audio note from MP3 file' : 'Upload step audio note from MP3 file'
        )
        // const margin = index == null ? '' : 'margin-left: 10px; margin-bottom: 10px; margin-right: 10px';
        const margin = '';
        shareButton.setAttribute('style', `background-color: transparent; color: var(--color-primary); padding: 8px 8px 8px 8px; ${margin}`);

        const shareIcon = createElement('i', 'icon-plus');
        shareIcon.setAttribute('style', 'padding-right: 4px');

        const shareText = createElement('span');
        shareText.innerHTML = 'Audio';

        shareButtonWrapper.appendChild(shareButton);
        shareButton.appendChild(shareIcon);
        shareButton.appendChild(shareText);

        const input = createElement("input");
        input.setAttribute('type', "file");
        input.setAttribute('name', "file");
        input.setAttribute('id', `garmin-upload-audio-input${idSuffix}`);
        input.setAttribute('style', "display:none");

        const form = createElement("form");
        form.setAttribute('style', 'display:none');
        form.appendChild(input);
        
        let confirmedOverwrite = false;

        shareButton.addEventListener('click', function () {
            if (isEditing()) {
                error("You appear to be editing this workout. Save or discard your changes before uploading audio notes.");
            } else {
                if (audioNoteExists) {
                    if (!confirm(stepOrder == null ? workoutConfirmMsg : stepConfirmMsg)) {
                        return;
                    }
                    confirmedOverwrite = true;
                }
                input.click();
            }
        })

        input.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                showSpinner();
                uploadAudioNote(form, stepOrder, confirmedOverwrite).then(
                    (result) => {
                        input.value = '';
                        hideSpinner();
                        if (result) {
                            setTimeout(
                                () => success('Audio note successfully added to workout!', true),
                                50
                            );
                        }
                    },
                    (e) => {
                        input.value = '';
                        hideSpinner();
                        setTimeout(() => error(e), 50);
                    }
                )
            } 
        })

        if (stepOrder == null) {
            // parentNode.parentNode.insertBefore(shareButtonWrapper, parentNode.nextSibling);

            // insert button to the left of main buttons (edit workout, send to device)
            parentNode.parentNode.insertBefore(shareButtonWrapper, parentNode.parentNode.firstChild);
            parentNode.parentNode.insertBefore(form, parentNode.nextSibling);
        } else {
            // parentNode.appendChild(shareButtonWrapper)

            // insert right-justified button next to step details (e.g. total distance, estimated timee)
            const lastChild = parentNode.childNodes[parentNode.childNodes.length-1];
            const lastChildLastChild = lastChild.childNodes[lastChild.childNodes.length-1];
            if (lastChildLastChild.getAttribute('class').includes('stepNote')) {
                lastChild.insertBefore(shareButtonWrapper, lastChildLastChild);
            } else {
                lastChild.appendChild(shareButtonWrapper);
            }

            // form/input field have to go outside of the step container, otherwise 
            // the input button won't work (clicks have no effect)
            parentNode.parentNode.insertBefore(form, parentNode.nextSibling);
        }
    }


    // returns true if upload succeeded, false if upload was cancelled (without fatal error)
    async function uploadAudioNote(form, stepOrder, confirmedOverwrite) {
        // get existing workout data
        const workoutData = await (await apiGetCurrentWorkout()).json();

        let step = null;
        if (stepOrder != null) {
            step = findStep(workoutData, stepOrder);
            if (step == null) {
                throw new Error("unable to find current step in workout data");
            }
        }

        // determine if audio note already exists; if so, it needs to be deleted before
        // we can upload a new one
        let audioNoteToDelete = undefined;
        if (step == null) {
            if (workoutData.workoutAudioNoteUuid) {
                if (confirmedOverwrite || confirm(workoutConfirmMsg)) {
                    audioNoteToDelete = workoutData.workoutAudioNoteUuid;
                } else {
                    return false;
                }
            }
        } else {
            if (step.stepAudioNoteUuid) {
                if (confirmedOverwrite || confirm(stepConfirmMsg)) {
                    audioNoteToDelete = step.stepAudioNoteUuid;
                } else {
                    return false;
                }
            }
        }

        // upload new audio note
        const formData = new FormData(form);
        const audioMetadata = await (await apiPostAudioNote(formData)).json();

        // delete existing audio note (order is important)
        if (audioNoteToDelete) {
            await apiDeleteAudioNote(audioNoteToDelete);
        }

        // update workout data
        if (step == null) {
            workoutData.workoutAudioNote = audioMetadata;
            workoutData.workoutAudioNoteUuid = audioMetadata.audioNoteUuid;
        } else {
            step.stepAudioNote = audioMetadata;
            step.stepAudioNoteUuid = audioMetadata.audioNoteUuid;
        }

        // save workout data

        // if saving the workout fails, then we might be in an undefined state
        // (especially if we deleted the existing note), so it's better if we
        // reload the page. But then again, reloading the page won't
        // fix anything...
        // e.g.
        // - the workout may still have a reference to a now-deleted audio note
        // - we may have created a new audio note which is not referenced anywhere

        // needReload = true;
        
        await apiPutCurrentWorkout(workoutData);
        return true;
    }

    // step containers in the dom have data-step-id values (and no other elements have this),
    // but unfortunately these values don't match what's in the workout JSON.
    // However, the 1-based stepOrder field in the JSON always matches the order in the
    // DOM. This is true even when the steps aren't a flat list,
    // which occurs when some of the step containers are actually repeat groups
    // (which means they have no data of their own except child steps)
    function findStep(workoutData, stepOrder) {
        for (let i = 0; i < workoutData.workoutSegments.length; i++) {
            const segment = workoutData.workoutSegments[i];
            const step = findStepInSegment(segment, stepOrder);
            if (step) return step;
        }
        return null;
    }

    function findStepInSegment(segmentOrStep, stepOrder) {
        for (let i = 0; i < segmentOrStep.workoutSteps.length; i++) {
            const step = segmentOrStep.workoutSteps[i]
            if (step.stepOrder === stepOrder) return step;
            if (step.workoutSteps) {
                const matchingStep = findStepInSegment(step, stepOrder);
                if (matchingStep) return matchingStep;
            }
        }
        return null;
    }
})();