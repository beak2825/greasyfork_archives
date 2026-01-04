// ==UserScript==
// @name         Copy YouTube URL w/ Timestamp & Details
// @namespace    azb-copyurl
// @version      0.3.7
// @description  Adds two buttons to manage and copy current YouTube live or video URL with its timestamp and some other details to clipboard then turn into a shortened URL (youtu.be) style will auto switch color depending on your theme color, has a ~15 to 30 seconds delay for the time capture. (the Date and Time capture only works if this is an ongoing stream)
// @author       Azb
// @match        *://www.youtube.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477761/Copy%20YouTube%20URL%20w%20Timestamp%20%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/477761/Copy%20YouTube%20URL%20w%20Timestamp%20%20Details.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let initialDurationInSeconds = 0,
        selectedOptions = (localStorage.getItem("selectedOptions") || "1,2,3,4,5,6").split(","),
        startTime = new Date(),
        selectedTimezone = localStorage.getItem("selectedTimezone") || "UTC+0";
    let previousTitle = document.title;
    let maxChecks = 20;
    let titleChanged = false;
    let realReferenceTime = null;
    let videoReferenceTime = null;

    function getChannelName() {
        let channelNameElem = document.querySelector("#upload-info a.yt-simple-endpoint.style-scope.yt-formatted-string");
        return channelNameElem ? channelNameElem.textContent.trim() : "";
    }

    function detectVideoChange() {
        if (document.title !== previousTitle) {
            realReferenceTime = null;
            videoReferenceTime = null;
            initialDurationInSeconds = 0;
            startTime = new Date();
            previousTitle = document.title;
        }
    }

    function isStreamReady() {
        const videoElem = document.querySelector('video');
        return videoElem && videoElem.readyState > 3;
    }

    function isDarkMode() {
        return !['#fff', '#ffffff'].includes(getComputedStyle(document.documentElement).getPropertyValue('--yt-spec-general-background-a').trim());
    }

    function parseTime(time) {
        const timeParts = time.split(':').reverse();
        let seconds = 0;
        if (timeParts.length === 2) {
            seconds = (parseInt(timeParts[0]) || 0) + (parseInt(timeParts[1] || 0) * 60);
        } else if (timeParts.length === 3) {
            seconds = (parseInt(timeParts[0]) || 0) + (parseInt(timeParts[1] || 0) * 60) + (parseInt(timeParts[2] || 0) * 3600);
        } else if (timeParts.length === 4) {
            seconds = (parseInt(timeParts[0]) || 0) + (parseInt(timeParts[1] || 0) * 60) + (parseInt(timeParts[2] || 0) * 3600) + (parseInt(timeParts[3] || 0) * 86400);
        }
        return seconds;
    }

    function updateLiveStartTime() {
        const duration = document.querySelector('.ytp-time-duration');
        if (duration)
            initialDurationInSeconds = parseTime(duration.textContent);
    }

    function updateReferences() {
        const currentTimeElem = document.querySelector('.ytp-time-current');
        const timeParts = currentTimeElem.textContent.split(':').reverse();
        const videoCurrentTime = (parseInt(timeParts[0]) || 0) + (parseInt(timeParts[1] || 0) * 60) + (parseInt(timeParts[2] || 0) * 3600) + (parseInt(timeParts[3] || 0) * 86400);
        realReferenceTime = Date.now();
        videoReferenceTime = videoCurrentTime;
    }

    function convertToTimezone(date) {
        const timezoneOffset = parseInt(selectedTimezone.replace("UTC", "")) || 0;
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const day = date.getUTCDate();
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();
        const adjustedDate = new Date(Date.UTC(year, month, day, hours + timezoneOffset, minutes, seconds));
        return adjustedDate;
    }

    function handleMinutesCheckboxChange() {
        if (!minutesCheckbox.checked) {
            secondsCheckbox.checked = false;
            secondsCheckbox.disabled = true;
            selectedOptions = selectedOptions.filter(option => option !== "6");
        } else {
            secondsCheckbox.disabled = false;
        }
        saveCheckboxState();
    }

    function handleHoursCheckboxChange() {
        if (!hoursCheckbox.checked) {
            minutesCheckbox.checked = false;
            minutesCheckbox.disabled = true;
            secondsCheckbox.checked = false;
            secondsCheckbox.disabled = true;
            selectedOptions = selectedOptions.filter(option => option !== "5" && option !== "6");
        } else {
            minutesCheckbox.disabled = false;
        }
        saveCheckboxState();
    }

    function getSimpleTimeInSeconds() {
        const currentTimeElem = document.querySelector('.ytp-time-current');
        if (!currentTimeElem)
            return null;

        return parseTime(currentTimeElem.textContent);
    }

    function getURLTimestampInSeconds() {
        const videoElem = document.querySelector('video');
        if (!videoElem)
            return null;

        const currentTimeElem = document.querySelector('.ytp-time-current');
        if (!currentTimeElem)
            return null;

        const timeParts = currentTimeElem.textContent.split(':').reverse();
        const videoCurrentTime = (parseInt(timeParts[0]) || 0) + (parseInt(timeParts[1] || 0) * 60) + (parseInt(timeParts[2] || 0) * 3600) + (parseInt(timeParts[3] || 0) * 86400);
        if (!realReferenceTime) {
            realReferenceTime = Date.now();
            videoReferenceTime = videoCurrentTime;
        }
        const realElapsedTime = (Date.now() - realReferenceTime) / 1000;
        return videoReferenceTime + realElapsedTime;
    }

    function getCurrentTimestampInSeconds() {
        const currentTimeElem = document.querySelector('.ytp-time-current');
        if (!currentTimeElem)
            return null;

        const currentInSeconds = parseTime(currentTimeElem.textContent);
        const liveStartTimeInSeconds = (initialDurationInSeconds + (new Date() - startTime) / 1000) - currentInSeconds;
        const date = new Date();
        const daysPassed = Math.floor(liveStartTimeInSeconds / 86400);
        date.setUTCDate(date.getUTCDate() + daysPassed);
        date.setUTCSeconds(date.getUTCSeconds() + 3600 - (liveStartTimeInSeconds % 86400));
        const adjustedDate = convertToTimezone(date);
        let formattedTime = "";
        if (selectedOptions.includes("4")) {
            formattedTime += `${
                String(adjustedDate.getUTCHours()).padStart(2, '0')
            }`;
        }
        if (selectedOptions.includes("5")) {
            if (formattedTime) {
                formattedTime += `:${
                    String(adjustedDate.getUTCMinutes()).padStart(2, '0')
                }`;
            } else {
                formattedTime += `${
                    String(adjustedDate.getUTCMinutes()).padStart(2, '0')
                }`;
            }
        }
        if (selectedOptions.includes("6")) {
            if (formattedTime) {
                formattedTime += `:${
                    String(adjustedDate.getUTCSeconds()).padStart(2, '0')
                }`;
            } else {
                formattedTime += `00:${
                    String(adjustedDate.getUTCSeconds()).padStart(2, '0')
                }`;
            }
        }
        if (formattedTime && !formattedTime.includes(":")) {
            formattedTime += "h";
        }
        return {
            timestamp: liveStartTimeInSeconds + currentInSeconds,
            formattedDate: `${
                adjustedDate.getUTCFullYear()
            }-${
                String(adjustedDate.getUTCMonth() + 1).padStart(2, '0')
            }-${
                String(adjustedDate.getUTCDate()).padStart(2, '0')
            }`,
            formattedTime: `${formattedTime} ${selectedTimezone}`
        };
    }

    function showCopyAlert(btn, message) {
        const alertDiv = document.createElement("div");
        alertDiv.innerHTML = message;
        alertDiv.style.position = 'fixed';
        alertDiv.style.background = isDarkMode() ? '#212121' : '#f8f8f8';
        alertDiv.style.color = isDarkMode() ? '#fff' : '#000';
        alertDiv.style.padding = '6px 10px';
        alertDiv.style.borderRadius = '5px';
        alertDiv.style.top = (btn.getBoundingClientRect().top - 40) + 'px';
        alertDiv.style.left = (btn.getBoundingClientRect().left + btn.offsetWidth / 2) + 'px';
        alertDiv.style.transform = 'translateX(-50%)';
        alertDiv.style.fontSize = '0.9rem';
        alertDiv.style.fontFamily = 'Roboto, sans-serif';
        alertDiv.style.zIndex = '1000';
        alertDiv.style.transition = 'opacity 0.3s';
        document.body.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(alertDiv);
            }, 300);
        }, 2000);
    }

    function createStyledButton(text, handler) {
        const btn = document.createElement("a");
        btn.className = "yt-simple-endpoint style-scope ytd-toggle-button-renderer";
        btn.style.position = 'relative';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.padding = "0 16px";
        btn.style.height = "36px";
        btn.style.borderRadius = "18px";
        btn.style.fontSize = "14px";
        btn.style.lineHeight = "2rem";
        btn.style.fontWeight = "500";
        btn.style.marginRight = "8px";
        btn.style.whiteSpace = "nowrap";
        btn.style.transition = "background 0.2s";
        btn.style.fontFamily = "Roboto, sans-serif";
        btn.style.flex = 'none';
        if (isDarkMode()) {
            btn.style.background = "#212121";
            btn.style.color = "#fff";
            btn.addEventListener("mouseenter", function () {
                btn.style.background = "#3e3e3e";
            });
            btn.addEventListener("mouseleave", function () {
                btn.style.background = "#212121";
            });
        } else {
            btn.style.background = "#f8f8f8";
            btn.style.color = "#000";
            btn.addEventListener("mouseenter", function () {
                btn.style.background = "#e0e0e0";
            });
            btn.addEventListener("mouseleave", function () {
                btn.style.background = "#f8f8f8";
            });
        }
        btn.appendChild(document.createTextNode(text));
        btn.addEventListener('click', handler);
        return btn;
    }

    function handleCopyButton() {
        let cursorTimeResult = getCurrentTimestampInSeconds();
        let urlTimeInSeconds = getSimpleTimeInSeconds();
        let channelName = getChannelName();
        if (cursorTimeResult) {
            let details = "";
            if (selectedOptions.includes("1")) {
                details += ` | ${cursorTimeResult.formattedDate}`;
            }
            if ((selectedOptions.includes("4") || selectedOptions.includes("5") || selectedOptions.includes("6")) && selectedOptions.includes("2")) {
                let timeDetail = cursorTimeResult.formattedTime.split(" ")[0];
                if (!selectedOptions.includes("6") && timeDetail.endsWith(":00")) {
                    timeDetail = timeDetail.substring(0, timeDetail.length - 3);
                }
                details += ` | ~${timeDetail} ${selectedTimezone}`;
            }
            if (selectedOptions.includes("3")) {
                details += ` | ${channelName}`;
            }
            const videoID = new URL(window.location.href).searchParams.get("v");
            const fullURL = `https://youtu.be/${videoID}?t=${Math.round(urlTimeInSeconds)}s${details}`;
            navigator.clipboard.writeText(fullURL).then(() => {
                showCopyAlert(document.getElementById('copyTimestampBtn'), "URL Copied!");
            });
        }
        titleChanged = false;
    }


    function toggleOptionsMenu() {
        let menu = document.getElementById("optionsMenu");
        if (menu) {
            menu.parentNode.removeChild(menu);
        } else {
            createOptionsMenu();
        }
    }
    document.body.addEventListener('click', function (event) {
        const menu = document.getElementById('optionsMenu');
        const optionsBtn = document.getElementById('optionsBtn');
        if (menu && event.target !== menu && event.target !== optionsBtn && !menu.contains(event.target)) {
            menu.remove();
        }
    }, true);

    function handleTimeOptionChange(checked) {
        if (checked) {
            if (localStorage.getItem('hoursCheckbox') === 'true') {
                hoursCheckbox.checked = true;
            }
            if (localStorage.getItem('minutesCheckbox') === 'true') {
                minutesCheckbox.checked = true;
            }
            if (localStorage.getItem('secondsCheckbox') === 'true') {
                secondsCheckbox.checked = true;
            }
        } else {
            hoursCheckbox.checked = false;
            minutesCheckbox.checked = false;
            secondsCheckbox.checked = false;
        }
        updateCheckboxStates();
        if (hoursCheckbox.parentNode && minutesCheckbox.parentNode && secondsCheckbox.parentNode) {
            const displayStyle = checked ? "" : "none";
            hoursCheckbox.parentNode.style.display = displayStyle;
            minutesCheckbox.parentNode.style.display = displayStyle;
            secondsCheckbox.parentNode.style.display = displayStyle;
            timezoneDiv.style.display = checked ? "" : "none";
        }
    }

    function updateSecondsCheckboxState() {
        if (!minutesCheckbox || !secondsCheckbox)
            return;

        const minutesChecked = minutesCheckbox.checked;
        if (!minutesChecked) {
            secondsCheckbox.checked = false;
            secondsCheckbox.disabled = true;
        } else {
            secondsCheckbox.disabled = false;
        }
    }

    let timezoneDiv;
    let hoursCheckbox;
    let minutesCheckbox;
    let secondsCheckbox;

    function updateCheckboxStates() {
        if (!hoursCheckbox || !minutesCheckbox || !secondsCheckbox)
            return;

        minutesCheckbox.disabled = false;
        secondsCheckbox.disabled = false;
        if (!hoursCheckbox.checked) {
            minutesCheckbox.checked = false;
            minutesCheckbox.disabled = true;
            secondsCheckbox.checked = false;
            secondsCheckbox.disabled = true;
        } else {
            if (!minutesCheckbox.checked) {
                secondsCheckbox.checked = false;
                secondsCheckbox.disabled = true;
            }
        }
    }

    function saveCheckboxState() {
        localStorage.setItem('hoursCheckbox', hoursCheckbox.checked);
        localStorage.setItem('minutesCheckbox', minutesCheckbox.checked);
        localStorage.setItem('secondsCheckbox', secondsCheckbox.checked);
    }

    function restoreCheckboxState() {
        if (localStorage.getItem('hoursCheckbox') !== null) {
            hoursCheckbox.checked = (localStorage.getItem('hoursCheckbox') === 'true');
        }
        if (localStorage.getItem('minutesCheckbox') !== null) {
            minutesCheckbox.checked = (localStorage.getItem('minutesCheckbox') === 'true');
        }
        if (localStorage.getItem('secondsCheckbox') !== null) {
            secondsCheckbox.checked = (localStorage.getItem('secondsCheckbox') === 'true');
        }
        handleHoursCheckboxChange
        handleMinutesCheckboxChange();
    }

    function bindCheckboxEvents() {
        hoursCheckbox = document.getElementById("option-4");
        minutesCheckbox = document.getElementById("option-5");
        secondsCheckbox = document.getElementById("option-6");
        if (hoursCheckbox) {
            hoursCheckbox.addEventListener("change", function () {
                saveCheckboxState();
                handleHoursCheckboxChange();
                updateCheckboxStates();
            });
        }
        if (minutesCheckbox) {
            minutesCheckbox.addEventListener("change", function () {
                saveCheckboxState();
                handleMinutesCheckboxChange();
                updateCheckboxStates();
            });
        }
        if (secondsCheckbox) {
            secondsCheckbox.addEventListener("change", function () {
                saveCheckboxState();
                updateCheckboxStates();
            });
        }
        restoreCheckboxState();
        updateCheckboxStates();
    }

    function refreshMenuState() {
        [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6"
        ].forEach(id => {
            const elem = document.getElementById("option-" + id);
            elem.checked = selectedOptions.includes(id);
            if (selectedOptions.includes("2")) {
                timezoneDiv.style.display = "";
                if (["4", "5", "6"].includes(id)) {
                    elem.parentNode.style.display = "";
                }
            } else {
                timezoneDiv.style.display = "none";
                if (["4", "5", "6"].includes(id)) {
                    elem.parentNode.style.display = "none";
                }
            }
        });
        bindCheckboxEvents();
        updateCheckboxStates();
        updateSecondsCheckboxState();
    }

    function createOptionsMenu() {
        const optionsBtn = document.getElementById('optionsBtn');
        const rect = optionsBtn.getBoundingClientRect();
        const menu = document.createElement("div");
        menu.id = "optionsMenu";
        menu.style.position = "absolute";
        menu.style.top = rect.bottom + window.scrollY + "px";
        menu.style.left = rect.left + "px";
        menu.style.color = isDarkMode() ? '#fff' : '#000';
        menu.style.background = isDarkMode() ? "#212121" : "#f8f8f8";
        menu.style.border = "1px solid #ccc";
        menu.style.borderRadius = "5px";
        menu.style.zIndex = "1000";
        menu.style.padding = "5px";
        menu.style.marginTop = "10px";
        menu.style.fontFamily = "Roboto";
        menu.style.fontSize = "14px";
        menu.style.fontWeight = "500";

        const optionsData = [{
                id: "1",
                emoji: "📅",
                label: "Date"
            },
            {
                id: "2",
                emoji: "🕙",
                label: "Time",
                onChange: handleTimeOptionChange
            },
            {
                id: "3",
                emoji: "👤",
                label: "Channel"
            },
            {
                id: "4",
                emoji: "⏳",
                label: "Hours",
                requires: "2"
            }, {
                id: "5",
                emoji: "⌛",
                label: "Minutes",
                requires: "2"
            }, {
                id: "6",
                emoji: "⏲️",
                label: "Seconds",
                requires: "2"
            }
        ];
        optionsData.forEach(opt => {
            const optionElem = document.createElement("div");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = "option-" + opt.id;
            checkbox.checked = selectedOptions.includes(opt.id);
            checkbox.addEventListener("change", function () {
                if (this.checked) {
                    selectedOptions.push(opt.id);
                } else {
                    selectedOptions = selectedOptions.filter(option => option !== opt.id);
                }
                localStorage.setItem("selectedOptions", selectedOptions.join(","));
                if (opt.onChange) {
                    opt.onChange(this.checked);
                }
            });
            const label = document.createElement("label");
            label.htmlFor = "option-" + opt.id;
            label.innerHTML = `${
                opt.emoji
            } ${
                opt.label
            }`;
            optionElem.appendChild(checkbox);
            optionElem.appendChild(label);
            menu.appendChild(optionElem);
        });
        timezoneDiv = document.createElement("div");
        timezoneDiv.innerHTML = "🌍 Timezone: ";
        const timezoneSelect = document.createElement("select");
        if (isDarkMode()) {
            timezoneSelect.style.background = "#212121";
            timezoneSelect.style.color = "#fff";
            timezoneSelect.style.border = "1px solid #fff";
        } else {
            timezoneSelect.style.background = "#f8f8f8";
            timezoneSelect.style.color = "#000";
            timezoneSelect.style.border = "1px solid #000";
        }
        const timezones = [
            "UTC-11",
            "UTC-10",
            "UTC-9",
            "UTC-8",
            "UTC-7",
            "UTC-6",
            "UTC-5",
            "UTC-4",
            "UTC-3",
            "UTC-2",
            "UTC-1",
            "UTC+0",
            "UTC+1",
            "UTC+2",
            "UTC+3",
            "UTC+4",
            "UTC+5",
            "UTC+6",
            "UTC+7",
            "UTC+8",
            "UTC+9",
            "UTC+10",
            "UTC+11",
            "UTC+12",
            "UTC+13",
            "UTC+14"
        ];
        timezones.forEach(zone => {
            const option = document.createElement("option");
            option.value = zone;
            option.text = zone;
            if (zone === selectedTimezone) {
                option.selected = true;
            }
            timezoneSelect.appendChild(option);
        });
        timezoneSelect.onchange = function () {
            selectedTimezone = this.value;
            localStorage.setItem("selectedTimezone", selectedTimezone);
        };
        timezoneDiv.appendChild(timezoneSelect);
        menu.appendChild(timezoneDiv);
        document.body.appendChild(menu);
        bindCheckboxEvents();
        updateSecondsCheckboxState();
        refreshMenuState();
    }

    function handleOptionsButton() {
        toggleOptionsMenu();
        event.stopPropagation();
    }

    function addButton() {
        const actionsBar = document.querySelector('#actions');
        const innerActions = document.querySelector('ytd-watch-metadata[flex-menu-enabled] #actions.ytd-watch-metadata ytd-menu-renderer.ytd-watch-metadata');

        if (actionsBar && innerActions) {
            if (!document.getElementById('optionsBtn')) {
                const optionsBtn = createStyledButton("Settings", handleOptionsButton);
                optionsBtn.id = "optionsBtn";
                innerActions.insertBefore(optionsBtn, innerActions.firstChild);
            }
            if (isStreamReady() && !document.getElementById('copyTimestampBtn')) {
                const copyBtn = createStyledButton("Copy URL", handleCopyButton);
                copyBtn.id = "copyTimestampBtn";
                innerActions.insertBefore(copyBtn, innerActions.firstChild);
            }
            const videoElem = document.querySelector('video');
            videoElem.addEventListener('play', updateReferences);
            videoElem.addEventListener('pause', updateReferences);
            videoElem.addEventListener('seeked', updateReferences);
        }
    }
    const videoObserver = new MutationObserver(function () {
        if (isStreamReady() && !document.getElementById('copyTimestampBtn')) {
            addButton();
        }
    });

    const videoElem = document.querySelector('video');
    if (videoElem) {
        videoObserver.observe(videoElem, {
            attributes: true,
            attributeFilter: ['readyState']
        });
    }
    new MutationObserver(detectVideoChange).observe(document.querySelector('title'), {
        childList: true
    });
    const observer = new MutationObserver(addButton);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    setInterval(updateLiveStartTime, 1000);
})();