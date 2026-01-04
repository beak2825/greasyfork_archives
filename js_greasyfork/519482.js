// ==UserScript==
// @name         Safari Fingerprint blocker
// @version      1.0
// @description  Hide browser fingerprint. Derived from "No Fingerprint"
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @noframes     false
// @license      The Unlicense
// @namespace https://greasyfork.org/users/1405117
// @downloadURL https://update.greasyfork.org/scripts/519482/Safari%20Fingerprint%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/519482/Safari%20Fingerprint%20blocker.meta.js
// ==/UserScript==
 
let script = document.createElement("script");
script.textContent = "(" + (function() {
    "use strict";
 
    let debug = function(topOnly) {
        if (!topOnly || window === window.top) {
            // debugger;
        }
    };
 
    (function() {
        document.documentElement.dataset.fbscriptallow = true;
    })();
 
    let randomChange = function(n, m) {
        if (!m) {
            m = 0.1;
        }
        return Math.round(n + ((Math.random() - 0.5) * 2 * n * 0.3));
    };
 
    let setValue = function(object, propertyName, value, writable) {
        if (!writable) {
            writable = false;
        }
        Object.defineProperty(object, propertyName, {
            value: value,
            writable: writable,
            enumerable: true
        });
    };
 
    (function() { // Date
        window.Date.prototype.getDate = window.Date.prototype.getUTCDate;
        window.Date.prototype.getDay = window.Date.prototype.getUTCDay;
        window.Date.prototype.getFullYear = window.Date.prototype.getUTCFullYear;
        window.Date.prototype.getHours = window.Date.prototype.getUTCHours;
        window.Date.prototype.getMilliseconds = window.Date.prototype.getUTCMilliseconds;
        window.Date.prototype.getMinutes = window.Date.prototype.getUTCMinutes;
        window.Date.prototype.getMonth = window.Date.prototype.getUTCMonth;
        window.Date.prototype.getSeconds = window.Date.prototype.getUTCSeconds;
        window.Date.prototype.getTimezoneOffset = function() { return 0; }; // -480
        window.Date.prototype.getYear = function() { return this.getFullYear() - 1900; };
        window.Date.prototype.setDate = window.Date.prototype.setUTCDate;
        window.Date.prototype.setFullYear = window.Date.prototype.setUTCFullYear;
        window.Date.prototype.setHours = window.Date.prototype.setUTCHours;
        window.Date.prototype.setMilliseconds = window.Date.prototype.setUTCMilliseconds;
        window.Date.prototype.setMinutes = window.Date.prototype.setUTCMinutes;
        window.Date.prototype.setMonth = window.Date.prototype.setUTCMonth;
        window.Date.prototype.setSeconds = window.Date.prototype.setUTCSeconds;
        window.Date.prototype.setYear = function(n) { return this.setFullYear(n + 1900); };
        window.Date.prototype.toLocaleDateString = function() { return ""; };
        window.Date.prototype.toLocaleString = function() { return ""; }; //America/Los_Angeles
        window.Date.prototype.toLocaleTimeString = function() { return ""; };
        window.Date.prototype.toString = function() { return ""; };
        window.Date.prototype.toTimeString = function() { return ""; };
    })();
 
    (function() {
        let fakeNavigator = {
            appCodeName: "",
            appName: "",
            appVersion: "",
            product: "",
            productSub: "",
            vendor: "",
            vendorSub: "",
            deviceMemory: Math.floor((Math.random() * 8) + 1),
            hardwareConcurrency: Math.floor((Math.random() * 8) + 1),
            maxTouchPoints: Math.floor((Math.random() * 8) + 1),
            bluetooth: undefined,
            clipboard: undefined,
            connection: undefined,
            credentials: undefined,
            doNotTrack: "false",
            geolocation: undefined,
            //globalPrivacyControl: 1,
            keyboard: undefined,
            language: "en-US",
            languages: "en-US",
            locks: undefined,
            mediaCapabilities: undefined,
            mediaDevices: undefined,
            mediaSession: undefined,
            onLine: undefined,
            permissions: undefined,
            presentation: undefined,
            scheduling: undefined,
            serviceWorker: undefined,
            usb: undefined,
            userActivation: undefined,
            userAgentData: "",
            wakeLock: undefined,
            webkitPersistentStorage: undefined,
            webkitTemporaryStorage: undefined,
            xr: undefined,
            getBattery: "",
            platform: "",
        };
 
        // Define getters for the properties in window.navigator
        for (let prop in window.navigator) {
            if (fakeNavigator[prop] !== undefined) {
                try {
                    Object.defineProperty(window.navigator, prop, {
                        get: function() {
                            if (fakeNavigator[prop] === "undefined") {
                                return undefined;
                            }
                            return fakeNavigator[prop];
                        },
                    });
                } catch (e) {}
            }
        }
    })();
 
    // Randomized Plugins
    (function() {
        function generateRandomString(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                result += characters.charAt(randomIndex);
            }
            return result;
        }
 
        const numPlugins = Math.floor(Math.random() * 5) + 1;
        const customPlugins = [];
 
        // Generate random plugins
        for (let i = 0; i < numPlugins; i++) {
            const pluginName = generateRandomString(10);
            const pluginDescription = generateRandomString(20);
            customPlugins.push({
                name: pluginName,
                description: pluginDescription,
            });
        }
 
        // Override navigator.plugins with the custom plugins
        Object.defineProperty(navigator, 'plugins', {
            get: function() {
                return customPlugins;
            },
        });
    })();
 
    (function() { // Screen size

        var choice2 = Math.floor(Math.random() * 4);

            switch(choice2){
    
    case 0:
            var screenSize = [360,800];   
             break;

    case 1:
            var screenSize = [1920,1080];
            break;

    case 2:
            var screenSize = [1366,768];
            break;
   
    
    case 3:
            var screenSize = [1536,864];
            
 };
        //let screenSize = [1920, 1080];
        screen.availWidth && setValue(screen, "availWidth", screenSize[0]);
        screen.availHeight && setValue(screen, "availHeight", screenSize[1] - 40);
        screen.availLeft && setValue(screen, "availLeft", undefined, true);
        screen.availTop && setValue(screen, "availTop", undefined, true);
        screen.width && setValue(screen, "width", screenSize[0]);
        screen.height && setValue(screen, "height", screenSize[1]);
        screen.Brightness && setValue(screen, "Brightness", randomChange(screen.Brightness));
        screen.mozBrightness && setValue(screen, "mozBrightness", randomChange(screen.mozBrightness));
        screen.left && setValue(screen, "left", undefined, true);
        screen.top && setValue(screen, "top", undefined, true);
        screen.enabled && setValue(screen, "enabled", undefined);
        screen.mozEnabled && setValue(screen, "mozEnabled", undefined);
        screen.pixelDepth && setValue(screen, "pixelDepth", 32);
        screen.colorDepth && setValue(screen, "colorDepth", 32);
    })();
 
    (function() { // Debugger panel size
        let n = Math.round(71.5 + (Math.random() * 15)), wChanged = false, wValue, hChanged = false, hValue;
        Object.defineProperty(window, "outerWidth", {
            get: function() {
                if (!wChanged) {
                    return window.innerWidth;
                }
                return wValue;
            },
            set: function(value) {
                wChanged = true;
                wValue = value;
            }
        });
        Object.defineProperty(window, "outerHeight", {
            get: function() {
                if (!hChanged) {
                    return window.innerHeight + n;
                }
                return hValue;
            },
            set: function(value) {
                hChanged = true;
                hValue = value;
            }
        });
    })();
 
    (function() { // AudioContext
        let origGetFloatFrequencyData = window.AnalyserNode.prototype.getFloatFrequencyData;
        window.AnalyserNode.prototype.getFloatFrequencyData = function getFloatFrequencyData(array) {
            let ret = origGetFloatFrequencyData.apply(this, arguments);
            for (let i = 0; i < array.length; i++) {
                array[i] = array[i] + Math.random() * 0.2;
            }
            return ret;
        };
        window.AnalyserNode.prototype.getFloatFrequencyData.toString = origGetFloatFrequencyData.toString.bind(origGetFloatFrequencyData);
 
        let origGetChannelData = window.AudioBuffer.prototype.getChannelData;
        window.AudioBuffer.prototype.getChannelData = function getChannelData() {
            let ret = origGetChannelData.apply(this, arguments);
            for (let i = 0; i < ret.length; i++) {
                ret[i] = ret[i] + Math.random() * 0.0001;
            }
            return ret;
        };
        window.AudioBuffer.prototype.getChannelData.toString = origGetChannelData.toString.bind(origGetChannelData);
    })();
 
   (function() { // Canvas
    // Save original methods
    let origGetContext = HTMLCanvasElement.prototype.getContext;
    let origGetImageData = CanvasRenderingContext2D.prototype.getImageData;
    let origToDataURL = HTMLCanvasElement.prototype.toDataURL;
 
    // Function to randomize image data
    let randomizeImageData = function(imageData) {
        let data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            // Modify pixel data to include random variations
            data[i] = (data[i] + Math.random() * 10) % 256;       // Red
            data[i + 1] = (data[i + 1] + Math.random() * 10) % 256; // Green
            data[i + 2] = (data[i + 2] + Math.random() * 10) % 256; // Blue
            // Alpha remains the same
        }
    };
 
    // Override the getImageData method to randomize image data
    CanvasRenderingContext2D.prototype.getImageData = function() {
        let imageData = origGetImageData.apply(this, arguments);
        randomizeImageData(imageData);
        return imageData;
    };
 
    // Function to randomize canvas data URL
    let randomizeDataURL = function(dataURL) {
        // Append random query string to data URL to prevent caching
        return dataURL + '?random=' + Math.random();
    };
 
    // Override the toDataURL method to randomize data URL
    HTMLCanvasElement.prototype.toDataURL = function() {
        let dataURL = origToDataURL.apply(this, arguments);
        return randomizeDataURL(dataURL);
    };
 
    // Override getContext to ensure modifications are applied
    HTMLCanvasElement.prototype.getContext = function() {
        let context = origGetContext.apply(this, arguments);
        if (arguments[0] === '2d' && typeof context.getImageData === 'function') {
            context.getImageData = CanvasRenderingContext2D.prototype.getImageData;
        }
        return context;
    };
})();
 
   // Randomize WebGL Rendering Context attributes
    const originalGetExtension = WebGLRenderingContext.prototype.getExtension;
    WebGLRenderingContext.prototype.getExtension = function(name) {
        if (name === 'WEBGL_debug_renderer_info') {
            return null;
        }
        return originalGetExtension.call(this, name);
    };
 
    const originalGetSupportedExtensions = WebGLRenderingContext.prototype.getSupportedExtensions;
    WebGLRenderingContext.prototype.getSupportedExtensions = function() {
        return (originalGetSupportedExtensions.call(this) || []).filter(ext => ext !== 'WEBGL_debug_renderer_info');
    };
 
    // Local storage noise
    (function() {
        let originalSetItem = localStorage.setItem;
        let originalGetItem = localStorage.getItem;
 
        localStorage.setItem = function(key, value) {
            let noise = (Math.random() * 0.0001).toString();
            originalSetItem.call(this, key, value + noise);
        };
 
        localStorage.getItem = function(key) {
            let value = originalGetItem.call(this, key);
            if (value) {
                return value.replace(/0\.\d+$/, "");
            }
            return value;
        };
    })();
 
    // WebGL noise
    (function() {
        let originalGetParameter = WebGLRenderingContext.prototype.getParameter;
 
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
            let value = originalGetParameter.call(this, parameter);
            if (typeof value === "number") {
                return value + Math.random() * 0.01;
            }
            return value;
        };
    })();
}).toString() + ")();";




Object.defineProperty(navigator, 'userAgent', {
           get: function () { return ''; }
        });







(function () { // Intl
		window.Intl = undefined;
	})();


function hideRefer(c){var b=c.target;if(b&&b.tagName!=="A"){b=b.parentNode}if(b&&b.tagName==="A"){b.rel="noreferrer"}}window.addEventListener("click",hideRefer,true);window.addEventListener("contextmenu",hideRefer,true);



(function() {
    

    // Override the getVoices method
    const originalGetVoices = window.speechSynthesis.getVoices;

    window.speechSynthesis.getVoices = function() {
        return []; // Return an empty array
    };

    // Optionally, you can also override the voices property
    Object.defineProperty(window.speechSynthesis, 'voices', {
        get: function() {
            return []; // Return an empty array
        }
    });

})();





(function() {
    

    // Override the getBoundingClientRect method for spans
    const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function() {
        // Check if the element is a span
        if (this.tagName.toLowerCase() === 'span') {
            // Return a fixed rectangle to prevent accurate width measurement
            return {
                width: 100, // Fixed width
                height: 20, // Fixed height
                top: 0,
                right: 100,
                bottom: 20,
                left: 0,
                // Include other properties as needed
            };
        }
        // Call the original method for other elements
        return originalGetBoundingClientRect.call(this);
    };

    // Optionally, override the offsetWidth property for spans
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        get: function() {
            if (this.tagName.toLowerCase() === 'span') {
                return 100; // Fixed width
            }
            return originalGetBoundingClientRect.call(this).width;
        }
    });

    // Optionally, override the offsetHeight property for spans
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        get: function() {
            if (this.tagName.toLowerCase() === 'span') {
                return 20; // Fixed height
            }
            return originalGetBoundingClientRect.call(this).height;
        }
    });
})();

 
document.documentElement.appendChild(script);