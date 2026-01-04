// ==UserScript==
// @name         WebRTC Spoofer
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  WebRTC Spoofer (Logitech Brio 4K & Blue Yeti Mic as Virtual Matrix 4) with Video & Audio Requested Good For Ome.tv an Uhmegle
// @author       Cxsmo
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524799/WebRTC%20Spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/524799/WebRTC%20Spoofer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Forcefully overwrite original methods
    const originalEnumerateDevices = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

    // Webcam Emulation (Logitech Brio 4K)
    const brioProperties = {
        deviceId: "logitech-brio-4k-webcam-id", // Fake device ID
        groupId: "logitech-brio-group-id", // Fake group ID
        label: "Logitech BRIO 4K Stream Edition", // Fake webcam label
        kind: "videoinput",
        capabilities: {
            width: 3840, // 4K resolution
            height: 2160,
            frameRate: 60, // 60 FPS
            aspectRatio: 16 / 9,
            colorDepth: 10, // 10-bit color depth for higher-quality video
        },
    };

    // Microphone Emulation (Blue Yeti as Virtual Matrix 4)
    const blueYetiProperties = {
        deviceId: "blue-yeti-mic-id", // Fake device ID (for the Virtual Matrix 4 mic)
        groupId: "blue-yeti-group-id", // Fake group ID
        label: "Blue Yeti USB Microphone", // Fake mic label
        kind: "audioinput",
        capabilities: {
            sampleRate: 48000, // 48kHz sample rate
            channelCount: 2, // Stereo sound
            volume: 100, // Maximum volume
        },
    };

    // Override enumerateDevices to ensure fake device data
    navigator.mediaDevices.enumerateDevices = async function () {
        const devices = await originalEnumerateDevices();

        // Force overriding the device label and IDs for video and audio devices
        return devices.map((device) => {
            if (device.kind === "videoinput") {
                // Force webcam properties (Logitech Brio 4K)
                return {
                    ...device,
                    deviceId: brioProperties.deviceId,
                    groupId: brioProperties.groupId,
                    label: brioProperties.label,
                };
            } else if (device.kind === "audioinput") {
                // Force microphone properties to only show the Blue Yeti mic (Virtual Matrix 4)
                return {
                    ...device,
                    deviceId: blueYetiProperties.deviceId,
                    groupId: blueYetiProperties.groupId,
                    label: blueYetiProperties.label,
                };
            }
            return device;
        });
    };

    // Override getUserMedia to ensure requested constraints match fake properties
    navigator.mediaDevices.getUserMedia = function (constraints) {
        // Handle video constraints (Logitech Brio 4K)
        if (!constraints.video && !constraints.audio) {
            // If neither audio nor video is requested, default to requesting both
            constraints.video = {
                width: { ideal: brioProperties.capabilities.width },
                height: { ideal: brioProperties.capabilities.height },
                frameRate: { ideal: brioProperties.capabilities.frameRate },
                facingMode: "user", // Optional: set to front-facing camera
            };
        } else if (constraints.video) {
            // If video is requested, apply the Logitech Brio-like settings
            constraints.video = {
                width: { ideal: brioProperties.capabilities.width },
                height: { ideal: brioProperties.capabilities.height },
                frameRate: { ideal: brioProperties.capabilities.frameRate },
                facingMode: "user", // Optional: set to front-facing camera
                ...constraints.video,
            };
        }

        // Handle audio constraints (Blue Yeti Mic as Virtual Matrix 4)
        if (!constraints.audio) {
            // If audio is not requested, apply default Blue Yeti settings
            constraints.audio = {
                deviceId: { ideal: blueYetiProperties.deviceId },
                channelCount: { ideal: blueYetiProperties.capabilities.channelCount },
                sampleRate: { ideal: blueYetiProperties.capabilities.sampleRate },
                volume: blueYetiProperties.capabilities.volume,
            };
        } else if (constraints.audio) {
            // If audio is requested, apply Blue Yeti microphone settings
            constraints.audio = {
                deviceId: { ideal: blueYetiProperties.deviceId },
                channelCount: { ideal: blueYetiProperties.capabilities.channelCount },
                sampleRate: { ideal: blueYetiProperties.capabilities.sampleRate },
                volume: blueYetiProperties.capabilities.volume,
                ...constraints.audio,
            };
        }

        return originalGetUserMedia(constraints);
    };

    // Override getSettings for MediaStreamTrack to provide fake settings for streams
    const originalGetSettings = MediaStreamTrack.prototype.getSettings;
    MediaStreamTrack.prototype.getSettings = function () {
        const settings = originalGetSettings.call(this);
        return {
            ...settings,
            width: brioProperties.capabilities.width,
            height: brioProperties.capabilities.height,
            frameRate: brioProperties.capabilities.frameRate,
            aspectRatio: brioProperties.capabilities.aspectRatio,
            colorDepth: brioProperties.capabilities.colorDepth,
            sampleRate: blueYetiProperties.capabilities.sampleRate,
            channelCount: blueYetiProperties.capabilities.channelCount,
            volume: blueYetiProperties.capabilities.volume,
        };
    };

    // Add a check for the WebRTC environment and log the details
    function checkWebRTC() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log("WebRTC is supported on this page.");
        } else {
            console.warn("WebRTC is not supported. Some features may not work.");
        }
    }

    // Check WebRTC support on page load
    checkWebRTC();

    // Add validation to block resolution 640x360 and only allow 1080p (1920x1080) or 4K (3840x2160)
    const originalMediaTrackConstraints = MediaStreamTrack.prototype.getSettings;
    MediaStreamTrack.prototype.getSettings = function () {
        const settings = originalMediaTrackConstraints.call(this);
        // Block 640x360 resolution by not allowing it in constraints
        if (settings.width === 640 && settings.height === 360) {
            console.warn("Blocked 640x360 resolution.");
            return {
                ...settings,
                width: 1920, // Force to 1080p resolution
                height: 1080,
            };
        }
        // If the resolution is not 640x360, we allow 1080p (1920x1080) or 4K (3840x2160)
        if (settings.width <= 1920 && settings.height <= 1080) {
            console.log("Resolution allowed:", settings.width, settings.height);
            return settings;
        } else {
            // If the resolution is higher than 1080p, force to 4K resolution
            return {
                ...settings,
                width: 3840, // Force to Brio 4K resolution
                height: 2160,
            };
        }
    };

    // Log the result to make sure the spoofing works
    console.log("WebRTC Spoofer: Logitech Brio 4K webcam and Blue Yeti USB microphone (Virtual Matrix 4) emulation active.");
})();
