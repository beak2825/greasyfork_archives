// ==UserScript==
// @name         WME Open GMaps Editor
// @namespace    https://github.com/WazeDev/wme-open-gmaps-editor
// @version      0.0.6
// @description  Opens the Google Maps editor based on WME's map center.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @exclude      https://www.waze.com/discuss/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @license      MIT
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540549/WME%20Open%20GMaps%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/540549/WME%20Open%20GMaps%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let wmeSdk;
    const zoomLevels = {
        1: 52428800,
        2: 26214400,
        3: 13107200,
        4: 6553600,
        5: 3276800,
        6: 1638400,
        7: 819200,
        8: 409600,
        9: 204800,
        10: 102400,
        11: 51200,
        12: 25600,
        13: 12800,
        14: 6400,
        15: 3200,
        16: 1600,
        17: 800,
        18: 400,
        19: 200,
        20: 100,
        21: 50,
        22: 25
    }

    function encodeProtobufToBase64({
        latitude,
        longitude,
        zoomLevel,
        sequenceNumber,
        url
    } = {}) {

        // Helper function to encode varint - EXACT ORIGINAL
        function encodeVarint(value) {
            const bytes = [];
            while (value >= 0x80) {
                bytes.push((value & 0xFF) | 0x80);
                value >>>= 7;
            }
            bytes.push(value & 0xFF);
            return new Uint8Array(bytes);
        }

        // Helper function to encode 64-bit fixed (double)
        function encodeFixed64(value) {
            const buffer = new ArrayBuffer(8);
            const view = new DataView(buffer);
            view.setFloat64(0, value, true); // little endian
            return new Uint8Array(buffer);
        }

        // Helper function to encode 32-bit fixed (uint32)
        function encodeFixed32(value) {
            const buffer = new ArrayBuffer(4);
            const view = new DataView(buffer);
            view.setUint32(0, value, true); // little endian
            return new Uint8Array(buffer);
        }

        // Helper function to encode length-delimited data
        function encodeLengthDelimited(data) {
            const length = encodeVarint(data.length);
            const result = new Uint8Array(length.length + data.length);
            result.set(length, 0);
            result.set(data, length.length);
            return result;
        }

        // Helper function to encode string
        function encodeString(str) {
            const encoder = new TextEncoder();
            const data = encoder.encode(str);
            return encodeLengthDelimited(data);
        }

        // Helper function to encode field header (field number + wire type)
        function encodeFieldHeader(fieldNumber, wireType) {
            return encodeVarint((fieldNumber << 3) | wireType);
        }

        // Helper function to concatenate Uint8Arrays
        function concatUint8Arrays(...arrays) {
            const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
            const result = new Uint8Array(totalLength);
            let offset = 0;
            for (const arr of arrays) {
                result.set(arr, offset);
                offset += arr.length;
            }
            return result;
        }

        // Wire types
        const VARINT = 0;
        const FIXED64 = 1;
        const LENGTH_DELIMITED = 2;
        const FIXED32 = 5;

        try {
            // Encode the inner coordinate message (field 1.1)
            const coordMessage = concatUint8Arrays(
                encodeFieldHeader(2, FIXED64), encodeFixed64(longitude),
                encodeFieldHeader(3, FIXED64), encodeFixed64(latitude)
            );

            // Encode the dimensions message (field 1.3)
            const dimensionsMessage = concatUint8Arrays(
                encodeFieldHeader(1, VARINT), encodeVarint(1920),
                encodeFieldHeader(2, VARINT), encodeVarint(957)
            );

            // Encode the main nested message (field 1)
            const mainMessage = concatUint8Arrays(
                encodeFieldHeader(1, LENGTH_DELIMITED), encodeLengthDelimited(coordMessage),
                encodeFieldHeader(3, LENGTH_DELIMITED), encodeLengthDelimited(dimensionsMessage),
                encodeFieldHeader(4, FIXED32), encodeFixed32(zoomLevels[zoomLevel])
            );

            // Encode the complete protobuf message
            const completeMessage = concatUint8Arrays(
                encodeFieldHeader(1, LENGTH_DELIMITED), encodeLengthDelimited(mainMessage),
                encodeFieldHeader(2, VARINT), encodeVarint(sequenceNumber),
                encodeFieldHeader(4, LENGTH_DELIMITED), encodeString(url)
            );

            // Convert to URL-safe Base64
            const base64String = btoa(String.fromCharCode(...completeMessage))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');

            return base64String;
        } catch (error) {
            console.error('Error encoding protobuf:', error);
            return null;
        }
    }

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    window.SDK_INITIALIZED.then(initialize)

    async function initialize() {
        wmeSdk = await getWmeSdk({
            scriptId: 'wme-open-gmaps-editor',
            scriptName: 'WME Open GMaps Editor'
        })

        wmeSdk.Events.on({
            eventHandler: replaceGoogleLink,
            eventName: "wme-map-move-end"
        })

        wmeSdk.Events.on({
            eventHandler: replaceGoogleLink,
            eventName: "wme-map-zoom-changed"
        })

        let GMELink = document.createElement("a");
        GMELink.id = "wme-open-gmaps-editor-url";
        GMELink.target = "_blank";
        let img = document.createElement("img");
        img.src = "https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg";
        img.style = "margin-right: 12px;margin-left: 12px;width: 16px;";
        img.title = "Open in Google Maps Editor (GME)"
        GMELink.appendChild(img);

        waitForElm('.secondary-toolbar-actions').then((elm) => {
            let toolbar = document.getElementsByClassName("secondary-toolbar-actions")[0];
            toolbar.insertBefore(GMELink, toolbar.children[0]);
            replaceGoogleLink();
        });
    }

    function replaceGoogleLink() {
        const coords = wmeSdk.Map.getMapCenter();
        const mapZoom = wmeSdk.Map.getZoomLevel();

        const trafficMapLayer_DO = "!5m1!1e1"
        const mapFixDialog_DO = "!10m1!1e3"
        let mapUrl = `https://www.google.com/maps/place/@${coords.lat},${coords.lon},${zoomLevels[mapZoom]}m/data=${trafficMapLayer_DO}${mapFixDialog_DO}`

        const base64Data = encodeProtobufToBase64({
            latitude: coords.lat,
            longitude: coords.lon,
            zoomLevel: mapZoom,
            sequenceNumber: 10,
            url: mapUrl
        });

        if (base64Data) {
            let url = `https://maps.google.com/roadeditor/iframe?bpb=${base64Data}`
            document.getElementById("wme-open-gmaps-editor-url").href = url;
        } else {
            console.error('Failed to encode protobuf data');
        }
    }
})();
