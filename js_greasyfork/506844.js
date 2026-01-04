// ==UserScript==
// @name         Enhanced Virtual Camera Hook
// @namespace    updownup
// @version      1.0
// @description  Hook various camera APIs
// @match        *://education.github.com/*
// @match        *://webcamtests.com/*
// @match        *://www.veed.io/*
// @match        *://webcammictest.com/*
// @match        *://www.onlinemictest.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/506844/Enhanced%20Virtual%20Camera%20Hook.user.js
// @updateURL https://update.greasyfork.org/scripts/506844/Enhanced%20Virtual%20Camera%20Hook.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let base64Image;

    // -------- Utility Class --------
    class Utils {
        static generateRandomBase64(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            let result = '';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        static async getBase64Image(defaultBase64Image) {
            return base64Image || defaultBase64Image;
        }
    }

    // -------- Stealth UI Class --------
    class StealthUI {
        constructor() {
            this.defaultBase64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
            this.createUI();
        }

        createUI() {
            const container = document.createElement('div');
            container.style.all = 'initial';
            document.documentElement.appendChild(container);

            const shadow = container.attachShadow({ mode: 'closed' });

            const styles = `
            :host { all: initial; }
            #stealth-container { position: fixed; top: 0; right: 0; z-index: 2147483647; background-color: rgba(0, 0, 0, 0); padding: 0; border-radius: 7px; transition: opacity 0.3s ease-in-out, background-color 0.3s ease-in-out; font-family: Arial, sans-serif; font-size: 12px; box-sizing: border-box; width: auto; max-width: 200px; opacity: 0.1; }
            #stealth-container:hover { background-color: rgba(0, 220, 0, 0.25); opacity: 1; }
            #stealth-container.hidden { opacity: 0; pointer-events: none; }
            #stealth-fileInput { display: none; }
            #stealth-loadButton { background-color: rgba(0, 0, 0, 0); border: none; padding: 5px; border-radius: 8px; cursor: pointer; font-size: inherit; width: 100%; text-align: center; color: black; transition: background-color 0.25s ease-in-out; }
            #stealth-loadButton:hover { border-radius: 3px; cursor: pointer; background-color: rgba(25, 25, 25, 0.25); }
            #stealth-loadButton.done { animation: spin 2s linear infinite; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `;

            const template = document.createElement('template');
            template.innerHTML = `
            <style>${styles}</style>
            <div id="stealth-container">
                <input type="file" id="stealth-fileInput" accept="image/*">
                <button id="stealth-loadButton">Load</button>
            </div>
        `;

            shadow.appendChild(template.content.cloneNode(true));

            const stealthContainer = shadow.getElementById('stealth-container');
            const fileInput = shadow.getElementById('stealth-fileInput');
            const loadButton = shadow.getElementById('stealth-loadButton');

            loadButton.onclick = function (e) {
                e.stopPropagation();
                fileInput.click();
            };

            fileInput.onchange = function (e) {
                e.stopPropagation();
                if (fileInput.files && fileInput.files[0]) {
                    loadButton.classList.add('done');
                    loadButton.textContent = '...';
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        base64Image = e.target.result;
                        loadButton.textContent = '√';
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                }
            };
        }
    }

    // -------- Virtual Stream Class --------
    class VirtualStream {
        constructor(width = 1280, height = 720, fps = 30) {
            this.width = width;
            this.height = height;
            this.fps = fps;
        }

        async createNoiseLayer(opacity = 0.26149721) {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d');
            const imageData = ctx.createImageData(this.width, this.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const noise = Math.random() * 255;
                data[i] = data[i + 1] = data[i + 2] = noise;
                data[i + 3] = opacity * 255;
            }

            ctx.putImageData(imageData, 0, 0);
            return canvas;
        }

        drawImageCovered(ctx, img, x, y, w, h) {
            const imgRatio = img.width / img.height;
            const canvasRatio = w / h;
            let sx, sy, sWidth, sHeight;

            if (imgRatio > canvasRatio) {
                sHeight = img.height;
                sWidth = sHeight * canvasRatio;
                sx = (img.width - sWidth) / 2;
                sy = 0;
            } else {
                sWidth = img.width;
                sHeight = sWidth / canvasRatio;
                sx = 0;
                sy = (img.height - sHeight) / 2;
            }

            ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
        }

        async createDynamicFilteredStream() {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d');

            const img = new Image();
            img.src = await Utils.getBase64Image(new StealthUI().defaultBase64Image);

            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = this.width;
            offscreenCanvas.height = this.height;
            const offscreenCtx = offscreenCanvas.getContext('2d');

            img.onload = () => {
                this.drawImageCovered(offscreenCtx, img, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
            };

            let noiseLayer = await this.createNoiseLayer();

            let hue = 0;
            let saturate = 100;
            let brightness = 100;

            function generateFrame() {
                hue = (hue + 0.1) % 2;
                saturate = 99 + Math.sin(Date.now() / 1000) * Math.random();
                brightness = 98 + Math.random() * 2;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(offscreenCanvas, 0, 0);
                ctx.filter = `hue-rotate(${hue}deg) saturate(${saturate}%) brightness(${brightness}%)`;
                ctx.drawImage(canvas, 0, 0);
                ctx.filter = 'none';
                ctx.globalCompositeOperation = 'overlay';
                ctx.drawImage(noiseLayer, 0, 0);
                ctx.globalCompositeOperation = 'source-over';
            }

            const stream = canvas.captureStream(this.fps);

            setInterval(generateFrame, 1000 / this.fps);

            setInterval(() => {
                noiseLayer = this.createNoiseLayer();
            }, 100 + Math.sin(Date.now() / 1000) * 150);

            return stream;
        }

        async createWebGLFilteredStream() {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

            if (!gl) {
                console.error('WebGL not supported, falling back to 2D canvas');
                return this.createDynamicFilteredStream();
            }

            const vertexShaderSource = `
                attribute vec2 a_position;
                attribute vec2 a_texCoord;
                varying vec2 v_texCoord;
                void main() {
                    gl_Position = vec4(a_position, 0, 1);
                    v_texCoord = a_texCoord;
                }
            `;

            const fragmentShaderSource = `
                precision mediump float;
                uniform sampler2D u_image;
                uniform sampler2D u_noise;
                uniform float u_time;
                uniform vec2 u_noiseOffset;
                varying vec2 v_texCoord;

                vec3 rgb2hsv(vec3 c) {
                    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
                    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
                    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
                    float d = q.x - min(q.w, q.y);
                    float e = 1.0e-10;
                    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
                }

                vec3 hsv2rgb(vec3 c) {
                    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                }

                void main() {
                    vec4 color = texture2D(u_image, vec2(v_texCoord.x, 1.0 - v_texCoord.y));
                    vec4 noise = texture2D(u_noise, v_texCoord * 4.0 + u_noiseOffset);

                    vec3 hsv = rgb2hsv(color.rgb);

                    float saturationAdjust = 0.99 + sin(u_time * 0.002) * 0.01;
                    hsv.y *= saturationAdjust;

                    float brightnessAdjust = 0.98 + 0.02 * fract(sin(dot(v_texCoord, vec2(12.9898, 78.233))) * 43758.5453);
                    hsv.z *= brightnessAdjust;

                    vec3 rgb = hsv2rgb(hsv);

                    gl_FragColor = vec4(rgb, color.a) + noise * 0.1;
                }
            `;

            function createShader(gl, type, source) {
                const shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
                    gl.deleteShader(shader);
                    return null;
                }
                return shader;
            }

            const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
            const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
                return null;
            }

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1, -1,
                1, -1,
                -1, 1,
                1, 1,
            ]), gl.STATIC_DRAW);

            const texCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                0, 0,
                1, 0,
                0, 1,
                1, 1,
            ]), gl.STATIC_DRAW);

            const positionLocation = gl.getAttribLocation(program, 'a_position');
            const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');

            gl.useProgram(program);
            gl.enableVertexAttribArray(positionLocation);
            gl.enableVertexAttribArray(texCoordLocation);

            const imageTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, imageTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            const img = new Image();
            img.src = await Utils.getBase64Image(new StealthUI().defaultBase64Image);
            await new Promise(resolve => img.onload = resolve);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

            function createNoiseTexture(gl, size) {
                const pixels = new Uint8Array(size * size * 4);
                for (let i = 0; i < pixels.length; i += 4) {
                    const noise = Math.random() * 255;
                    pixels[i] = pixels[i + 1] = pixels[i + 2] = noise;
                    pixels[i + 3] = 255;
                }

                const texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                return texture;
            }

            const noiseTexture = createNoiseTexture(gl, 1024);

            const u_image = gl.getUniformLocation(program, 'u_image');
            const u_noise = gl.getUniformLocation(program, 'u_noise');
            const u_time = gl.getUniformLocation(program, 'u_time');
            const u_noiseOffset = gl.getUniformLocation(program, 'u_noiseOffset');

            gl.uniform1i(u_image, 0);
            gl.uniform1i(u_noise, 1);

            let noiseOffsetX = 0;
            let noiseOffsetY = 0;

            function render(time) {
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
                gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, imageTexture);

                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, noiseTexture);

                // Update noise offset
                noiseOffsetX = (noiseOffsetX + 0.001) % 1;
                noiseOffsetY = (noiseOffsetY + 0.001) % 1;

                gl.uniform1f(u_time, time);
                gl.uniform2f(u_noiseOffset, noiseOffsetX, noiseOffsetY);

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }


            const fps = this.fps;
            const stream = canvas.captureStream(fps);

            let lastTime = 0;
            function update(currentTime) {
                if (currentTime - lastTime >= 1000 / fps) {
                    render(currentTime);
                    lastTime = currentTime;
                }
                requestAnimationFrame(update);
            }

            update(0);

            return stream;
        }

        async createVirtualStream() {
            return await this.createWebGLFilteredStream();
        }
    }

    // -------- API Hook Class --------
    class APIHook {
        constructor() {
            this.methodsLookupTable = new WeakMap();
            this.virtualDeviceId = Utils.generateRandomBase64(43) + '=';
            this.virtualGroupId = Utils.generateRandomBase64(43) + '=';
            this.hookMediaDevices();
            this.hookRTCPeerConnection();
            this.hookMediaStreamTrack();
            this.hookImageCapture();
            this.hookGeolocation();
            this.Quenching();
        }

        Quenching() {
            const originalToString = Function.prototype.toString;
            const map = this.methodsLookupTable;

            Function.prototype.toString = new Proxy(originalToString, {
                apply(target, thisArg, argumentsList) {
                    if (typeof thisArg?.call !== 'function') {
                        return Reflect.apply(target, thisArg, argumentsList);
                    }

                    if (map.has(thisArg)) {
                        return Reflect.apply(target, map.get(thisArg), argumentsList);
                    }

                    return Reflect.apply(target, thisArg, argumentsList);
                }
            });
        }


        // Helper function to replace a method with a hook
        replaceMethod(obj, methodName, newMethod) {
            const oldMethod = obj[methodName]
            obj[methodName] = newMethod;
            this.methodsLookupTable.set(newMethod, oldMethod);
        }

        // Hook navigator.mediaDevices methods
        hookMediaDevices() {
            this.replaceMethod(navigator.mediaDevices, 'enumerateDevices', async () => {
                const devices = await this.methodsLookupTable.get(navigator.mediaDevices.enumerateDevices).call(navigator.mediaDevices);
                const virtualDevice = new MediaDeviceInfo({
                    deviceId: this.virtualDeviceId,
                    groupId: this.virtualGroupId,
                    kind: 'videoinput',
                    label: 'Integrated Webcam'
                });
                return [virtualDevice, ...devices];
            });

            this.replaceMethod(navigator.mediaDevices, 'getUserMedia', async (constraints) => {
                if (constraints && constraints.video) {
                    return await new VirtualStream().createVirtualStream();
                }
                return this.methodsLookupTable.get(navigator.mediaDevices.getUserMedia).call(navigator.mediaDevices, constraints);
            });

            this.replaceMethod(navigator.mediaDevices, 'getDisplayMedia', async (constraints) => {
                return await new VirtualStream().createVirtualStream();
            });
        }

        // Hook RTCPeerConnection
        hookRTCPeerConnection() {
            this.replaceMethod(window, 'RTCPeerConnection', (originalRTCPeerConnection => {
                return function (...args) {
                    const pc = new originalRTCPeerConnection(...args);

                    this.replaceMethod(pc, 'addTrack', (originalAddTrack => {
                        return async function (...args) {
                            if (args[0] && args[0].kind === 'video' && args[0].getSettings().deviceId === this.virtualDeviceId) {
                                const stream = await new VirtualStream().createVirtualStream();
                                const [videoTrack] = stream.getVideoTracks();
                                return originalAddTrack.call(this, new VirtualTrack(videoTrack), ...args.slice(1));
                            }
                            return originalAddTrack.apply(this, args);
                        };
                    }).bind(this));

                    return pc;
                };
            }).bind(this)(window.RTCPeerConnection));
        }

        // Hook MediaStreamTrack
        hookMediaStreamTrack() {
            this.replaceMethod(window, 'MediaStreamTrack', (originalMediaStreamTrack => {
                return function (...args) {
                    const track = new originalMediaStreamTrack(...args);
                    this.replaceMethod(track, 'getSettings', (originalGetSettings => {
                        return function () {
                            const settings = originalGetSettings.call(this);
                            if (settings.deviceId === this.virtualDeviceId) {
                                return {
                                    ...settings,
                                    deviceId: this.virtualDeviceId,
                                    groupId: this.virtualGroupId,
                                    width: 1280,
                                    height: 720,
                                    aspectRatio: 16 / 9,
                                    frameRate: 30,
                                    facingMode: 'user',
                                    resizeMode: 'none'
                                };
                            }
                            return settings;
                        };
                    }).bind(this));

                    return track;
                };
            }).bind(this)(window.MediaStreamTrack));
        }

        // Hook ImageCapture
        hookImageCapture() {
            this.replaceMethod(window, 'ImageCapture', (originalImageCapture => {
                return function (track) {
                    if (track.kind === 'video' && track.getSettings().deviceId === this.virtualDeviceId) {
                        const virtualTrack = new VirtualTrack(track);
                        return new originalImageCapture(virtualTrack);
                    }
                    return new originalImageCapture(track);
                };
            }).bind(this)(window.ImageCapture));
        }

        // Geolocation Spoofing
        async getCoordinatesFromAddress(address) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`,
                    onload: function(response) {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            if (data.length > 0) {
                                resolve({
                                    latitude: parseFloat(data[0].lat),
                                    longitude: parseFloat(data[0].lon)
                                });
                            } else {
                                reject(new Error("No results found"));
                            }
                        } else {
                            reject(new Error(`Request failed with status ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            });
        }

        getRandomOffset(maxOffset = 0.00005) {
            return (Math.random() - 0.5) * 2 * maxOffset;
        }

        async updateMockedGeolocation() {
            const schoolInput = document.evaluate('//*[@id="school-input"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (schoolInput && schoolInput.value) {
                try {
                    const coordinates = await this.getCoordinatesFromAddress(schoolInput.value);
                    if (coordinates) {
                        this.mockedGeolocation = {
                            latitude: coordinates.latitude + this.getRandomOffset(),
                            longitude: coordinates.longitude + this.getRandomOffset(),
                            accuracy: 30 + Math.random() * 20
                        };
                    }
                } catch (error) {
                    console.error("Error updating mocked geolocation:", error);
                }
            }
        }

        // Hook Geolocation
        hookGeolocation() {
            this.replaceMethod(navigator.geolocation, 'getCurrentPosition', async (successCallback, errorCallback, options) => {
                await this.updateMockedGeolocation();
                if (this.mockedGeolocation) {
                    setTimeout(() => {
                        successCallback({
                            coords: {
                                latitude: this.mockedGeolocation.latitude,
                                longitude: this.mockedGeolocation.longitude,
                                accuracy: this.mockedGeolocation.accuracy
                            },
                            timestamp: Date.now()
                        });
                    }, 2500 + Math.random() * 500);
                } else {
                    this.methodsLookupTable.get(navigator.geolocation.getCurrentPosition).call(navigator.geolocation, successCallback, errorCallback, options);
                }
            });

            this.replaceMethod(navigator.geolocation, 'watchPosition', async (successCallback, errorCallback, options) => {
                if (this.mockedGeolocation) {
                    const watchId = setInterval(() => {
                        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
                    }, 5000);
                    return watchId;
                } else {
                    return this.methodsLookupTable.get(navigator.geolocation.watchPosition).call(navigator.geolocation, successCallback, errorCallback, options);
                }
            });

            this.replaceMethod(navigator.geolocation, 'clearWatch', (watchId) => {
                clearInterval(watchId);
            });
        }
    }

    // -------- Virtual Track Class --------
    class VirtualTrack {
        constructor(originalTrack) {
            this.originalTrack = originalTrack;
            this.enabled = true;
            this.muted = false;
            this.constraints = {};
            this.settings = {
                deviceId: this.virtualDeviceId,
                groupId: this.virtualGroupId,
                width: 1280,
                height: 720,
                aspectRatio: 16 / 9,
                frameRate: 30,
                facingMode: 'user'
            };
        }

        get id() { return this.virtualDeviceId; }
        get kind() { return 'video'; }
        get label() { return ''; }
        get enabled() { return this.enabled; }
        get muted() { return this.muted; }
        get readyState() { return 'live'; }

        getConstraints() { return { ...this.constraints }; }
        getSettings() { return { ...this.settings }; }

        getCapabilities() {
            return {
                width: { min: 640, max: 1920 },
                height: { min: 480, max: 1080 },
                aspectRatio: { min: 1.33, max: 1.78 },
                frameRate: { min: 15, max: 60 },
                facingMode: ['user', 'environment'],
                resizeMode: ['none', 'crop-and-scale']
            };
        }

        async applyConstraints(newConstraints) {
            Object.assign(this.constraints, newConstraints);
            return Promise.resolve();
        }

        stop() {
            this.enabled = false;
            this.originalTrack.stop();
        }
    }

    // --------  Modify MediaDeviceInfo --------
    const OriginalMediaDeviceInfo = unsafeWindow.MediaDeviceInfo;

    function MediaDeviceInfo({ deviceId, groupId, kind, label }) {
        if (!(this instanceof MediaDeviceInfo)) {
            return new MediaDeviceInfo({ deviceId, groupId, kind, label });
        }

        Object.defineProperties(this, {
            deviceId: {
                get: function() { return deviceId; },
                enumerable: true
            },
            groupId: {
                get: function() { return groupId; },
                enumerable: true
            },
            kind: {
                get: function() { return kind; },
                enumerable: true
            },
            label: {
                get: function() { return label; },
                enumerable: true
            }
        });
    }

    Object.defineProperty(MediaDeviceInfo, 'length', { value: 0, writable: false });
    MediaDeviceInfo.prototype = Object.create(OriginalMediaDeviceInfo.prototype);
    MediaDeviceInfo.prototype.constructor = MediaDeviceInfo;

    unsafeWindow.MediaDeviceInfo = MediaDeviceInfo;

    // -------- Initialize --------
    new StealthUI();
    new APIHook();

    console.log('Enhanced Virtual Camera Hook injected');
})();