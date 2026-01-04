// ==UserScript==
// @name        YTMusic Audio Device Selector
// @namespace   Violentmonkey Scripts
// @match       https://music.youtube.com/*
// @match       https://www.youtube.com/*
// @match       https://m.youtube.com/*
// @grant       none
// @version     1.4
// @author      DoKM (https://github.com/DoKM)
// @description 10/17/2025, 10:56:22 AM
// @run-at document-start
// @homepageURL https://github.com/DoKM/Youtube-Music-Audio-Device-Selector
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527938/YTMusic%20Audio%20Device%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/527938/YTMusic%20Audio%20Device%20Selector.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Save native functions immediately when script loads
    const nativeGetUserMedia = MediaDevices.prototype.getUserMedia;
    const nativeEnumerateDevices = MediaDevices.prototype.enumerateDevices;

    // Protect mediaDevices methods from being overwritten
    function protectMediaDevices() {
        if (navigator.mediaDevices) {
            try {
                const descGet = Object.getOwnPropertyDescriptor(navigator.mediaDevices, 'getUserMedia');
                if (!descGet || descGet.configurable) {
                    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
                        value: nativeGetUserMedia.bind(navigator.mediaDevices),
                        writable: false,
                        configurable: false
                    });
                }
            } catch (e) {
                // ignore if property cannot be redefined
            }

            try {
                const descEnum = Object.getOwnPropertyDescriptor(navigator.mediaDevices, 'enumerateDevices');
                if (!descEnum || descEnum.configurable) {
                    Object.defineProperty(navigator.mediaDevices, 'enumerateDevices', {
                        value: nativeEnumerateDevices.bind(navigator.mediaDevices),
                        writable: false,
                        configurable: false
                    });
                }
            } catch (e) {
                // ignore if property cannot be redefined
            }
        }
    }

    // Run protection immediately and periodically
    protectMediaDevices();
    setTimeout(protectMediaDevices, 100);
    setTimeout(protectMediaDevices, 500);

    // Re-apply protection when mediaDevices becomes available if not already
    if (!navigator.mediaDevices) {
        const mediaDevicesObserver = new MutationObserver(() => {
            if (navigator.mediaDevices) {
                protectMediaDevices();
                mediaDevicesObserver.disconnect();
            }
        });
        mediaDevicesObserver.observe(document, { childList: false, subtree: false, attributes: false });
    }


    // Your main code - wrapped in DOMContentLoaded to ensure proper timing
    window.addEventListener('DOMContentLoaded', async function () {
        let audioDevices = [];
        let defaultAudioDevice;
        let defaultSpeaker;
        let currentDevice;
        let dropdown;
        let musicPlayer;

        // Use the protected native function
        async function getAudioStream(constraints) {
            return navigator.mediaDevices.getUserMedia(constraints);
        }

        const menuID = window.location.hostname === "music.youtube.com" ? "right-content" : "end";

        const starFilled = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`;
        const speakerFilled = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>`;

        async function init() {
            return new Promise(async (resolve, reject) => {
                if (window.trustedTypes && window.trustedTypes.createPolicy) {
                    window.trustedTypes.createPolicy('default', {
                        createHTML: string => string
                    });
                }

                const constraints = { audio: true, video: false }; // Removed video if not needed

                try {
                    // Get permission and stream
                    const stream = await getAudioStream(constraints);
                    // Important: stop the stream immediately to avoid microphone indicator
                    stream.getTracks().forEach(track => track.stop());

                    await updateDevices();

                    navigator.mediaDevices.addEventListener("devicechange", async () => {
                        await updateDevices();
                    });

                    console.log("finished init");
                    resolve();
                } catch (error) {
                    console.error("Error during init:", error);
                    reject(error);
                }
            });
        }

        async function updateDevices() {
            return new Promise(async (resolve, reject) => {
                try {
                    let tempDevices = await navigator.mediaDevices.enumerateDevices();

                    let getDevices = function (deviceList) {
                        let outputDevices = [];
                        let defaultDevice = undefined;

                        for (let device of deviceList) {
                            if (device.kind === "audiooutput") {
                                if (device.deviceId === "default") {
                                    defaultDevice = device;
                                } else if (device.deviceId !== "communications" && device.deviceId != undefined) {
                                    outputDevices.push(device);
                                }
                            }
                        }

                        return {
                            defaultDevice: defaultDevice,
                            outputDevices: outputDevices
                        };
                    };

                    let { defaultDevice, outputDevices } = getDevices(tempDevices);
                    audioDevices = outputDevices;
                    defaultAudioDevice = defaultDevice;
                    console.log("Audio output devices:", outputDevices);
                    resolve();
                } catch (error) {
                    console.error("Error updating devices:", error);
                    reject(error);
                }
            });
        }

        // Initialize when DOM is ready
        try {
            await init();
            // Add your existing UI creation code here
        } catch (error) {
            console.error("Failed to initialize audio device selector:", error);
        }


        async function findMusicPlayer() {

            musicPlayer = document.getElementsByTagName("video")[0];
            if (musicPlayer) {

                onFoundMusicPlayer();
                createMenu();
                return;
            }
            setTimeout(3000, () => { findMusicPlayer() })
        }
        document.addEventListener("yt-navigate-finish", findMusicPlayer);
        findMusicPlayer()
        setInterval(() => {
            if (musicPlayer != null && currentDevice != null) {
                musicPlayer.setSinkId(currentDevice.deviceId);
            }
        }, 1000)


        function onFoundMusicPlayer() {
            const audioDeviceID = localStorage.getItem("dokm-audio-device-favoriteDevice");
            const speakerDeviceID = localStorage.getItem("dokm-audio-device-favoriteSpeaker");
            if (audioDeviceID || speakerDeviceID) {
                for (let device of audioDevices) {
                    if (device.deviceId === audioDeviceID) {
                        defaultAudioDevice = device;
                        musicPlayer.setSinkId(device.deviceId);
                    }
                    if (device.deviceId === speakerDeviceID) {
                        defaultSpeaker = device;
                        if (!audioDeviceID) {
                            musicPlayer.setSinkId(device.deviceId);
                        }
                    }
                }
            }
            if (!currentDevice) {
                currentDevice = defaultAudioDevice;
            }

        }

        function setCurrentDevice(device) {
            if (!device) {
                return;
            }
            currentDevice = device;
            musicPlayer.setSinkId(device.deviceId);
        }
        function setFavorite(device) {
            // save the device ID to local storage
            localStorage.setItem("dokm-audio-device-favoriteDevice", device.deviceId);
            defaultAudioDevice = device;
        }
        function setFavoriteSpeaker(device) {
            // save the device ID to local storage
            localStorage.setItem("dokm-audio-device-favoriteSpeaker", device.deviceId);
            defaultSpeaker = device;
        }

        function createButton(elementName, innerHTML, colour = "#fff") {
            // Create the button element
            const button = document.createElement("button");
            button.classList.add(elementName);
            button.innerHTML = innerHTML;
            // Style the button for dark mode
            Object.assign(button.style, {
                background: "#222",
                color: "#fff",
                border: "none",
                padding: "8px",
                cursor: "pointer",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.3s",
                position: "relative",
                width: "40px", // Default width
                height: "40px", // Default height
                marginRight: "5px",
            });

            if (innerHTML.includes("svg")) {
                button.style.fill = colour;
            }

            button.addEventListener("mouseenter", () => (button.style.background = "#333"));
            button.addEventListener("mouseleave", () => (button.style.background = "#222"));

            return button;
        }

        function createDropdown(audioDevices) {
            const dropdown = document.createElement("div");
            dropdown.classList.add("dropdown-menu");

            // sort the devices, default device first, default speaker second and the rest in alphabetical order
            let sorted = audioDevices.sort((a, b) => {
                if (a.deviceId === defaultAudioDevice?.deviceId) {
                    return -1;
                } else if (b.deviceId === defaultAudioDevice?.deviceId) {
                    return 1;
                } else if (a.deviceId === defaultSpeaker?.deviceId) {
                    return -1;
                } else if (b.deviceId === defaultSpeaker?.deviceId) {
                    return 1;
                } else if (a.label < b.label) {
                    return -1;
                } else if (a.label > b.label) {
                    return 1;
                } else {
                    return 0;
                }
            });

            // Style the dropdown menu
            Object.assign(dropdown.style, {
                position: "absolute",
                top: "0",
                right: "110%", // Move to the left of the button
                background: "#333",
                color: "#fff",
                padding: "10px",
                borderRadius: "5px",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
                display: "none",
                minWidth: "220px",
            });

            // Create list container
            const table = document.createElement("table");
            table.style.width = "100%";
            table.style.borderCollapse = "collapse";
            table.style.marginTop = "10px";
            table.style.color = "#fff";
            table.style.backgroundColor = "#333";
            table.style.border = "0px solid #444";

            sorted.forEach((device, index) => {
                const tr = document.createElement("tr");
                tr.setAttribute("data-device-id", device.deviceId);
                tr.style.cursor = "pointer";
                tr.style.borderBottom = "1px solid #444";

                // Highlight on hover
                tr.addEventListener("mouseenter", () => (tr.style.background = "#444"));
                tr.addEventListener("mouseleave", () => (tr.style.background = "transparent"));





                // Device label cell
                const labelCell = document.createElement("td");
                const labelContainer = document.createElement("span");
                labelContainer.style.display = "flex";
                labelContainer.style.alignItems = "center";

                const label = document.createElement("span");
                label.textContent = device.label;
                label.style.padding = "8px";
                label.style.display = "block";

                labelContainer.appendChild(label);

                if (device.deviceId === currentDevice.deviceId) {
                    const currentDeviceIcon = document.createElement("span");
                    currentDeviceIcon.innerHTML = speakerFilled;
                    currentDeviceIcon.style.width = "40px";
                    currentDeviceIcon.style.fill = "#DAA520";
                    currentDeviceIcon.style.display = "inline-block";
                    currentDeviceIcon.style.verticalAlign = "middle"; // Center vertically
                    labelContainer.style.display = "flex"; // Ensure flex container
                    labelContainer.style.alignItems = "center"; // Center vertically
                    labelContainer.prepend(currentDeviceIcon);
                }

                labelCell.appendChild(labelContainer);

                labelCell.addEventListener("click", () => {
                    setCurrentDevice(device);
                });

                // Star button cell
                const starCell = document.createElement("td");
                const starButton = createButton("button", starFilled, (device === defaultAudioDevice) ? "#DAA520" : "#fff");
                starButton.addEventListener("click", (e) => {
                    //e.stopPropagation();
                    setFavorite(device);
                });
                starCell.appendChild(starButton);

                // Speaker button cell
                const speakerCell = document.createElement("td");
                const speakerButton = createButton("button", speakerFilled, (device === defaultSpeaker) ? "#DAA520" : "#fff");
                speakerButton.addEventListener("click", (e) => {
                    //e.stopPropagation();
                    setFavoriteSpeaker(device);
                });
                speakerCell.appendChild(speakerButton);

                // Assemble table row
                tr.appendChild(labelCell);
                tr.appendChild(starCell);
                tr.appendChild(speakerCell);
                table.appendChild(tr);
            });

            dropdown.appendChild(table);

            return dropdown;
        }

        function createMenu() {
            const menuLocation = document.getElementById(menuID);

            if (!menuLocation) {
                console.error(`Element with ID '${menuID}' not found.`);
                return;
            }
            {
                let menuSpan = document.getElementById("DoKMMenu");
                if (menuSpan) {
                    menuSpan.remove();
                }
            }
            const menuSpan = document.createElement("div")
            menuSpan.setAttribute("id", "DoKMMenu");
            menuSpan.style.display = "flex"

            // Example array of audio devices


            const outputSelectorButton = createButton("output-selector-button", `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      </svg>`);


            // Toggle dropdown visibility on button click
            outputSelectorButton.addEventListener("click", (event) => {
                event.stopPropagation();
                if (dropdown) {
                    dropdown.remove();
                    dropdown = null;
                } else {
                    dropdown = createDropdown(audioDevices);
                    outputSelectorButton.appendChild(dropdown);
                    dropdown.style.display = "block";
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener("click", (event) => {
                if (dropdown && !outputSelectorButton.contains(event.target) && !dropdown.contains(event.target)) {
                    dropdown.remove();
                    dropdown = null;
                }
            });

            const selectDefaultButton = createButton("select-default-button", starFilled);
            const selectSpeakerButton = createButton("select-speaker-button", speakerFilled);

            selectDefaultButton.addEventListener("click", () => {
                setCurrentDevice(defaultAudioDevice);
            });
            selectSpeakerButton.addEventListener("click", () => {
                setCurrentDevice(defaultSpeaker);
            });

            // Append dropdown to button and insert into menu
            menuLocation.prepend(menuSpan)
            menuSpan.prepend(selectDefaultButton, selectSpeakerButton, outputSelectorButton);
        }

    }
    )
})();
