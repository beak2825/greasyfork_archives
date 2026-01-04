// ==UserScript==
// @name         NopeCHA - Automated reCAPTCHA Solver
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  AI for Automatic reCAPTCHA Recognition
// @author       You
// @require      https://update.greasyfork.org/scripts/534380/1580503/UserscriptSettings.js
// @match        https://www.google.com/recaptcha/api2/bframe*
// @match        https://www.google.com/recaptcha/api2/anchor*
// @icon         https://nopecha.com/apple-icon-72x72.png
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.nopecha.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534381/NopeCHA%20-%20Automated%20reCAPTCHA%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/534381/NopeCHA%20-%20Automated%20reCAPTCHA%20Solver.meta.js
// ==/UserScript==
const HOST = document.referrer ? document.referrer.split("/")[2] : location.origin;
const API_ENDPOINT = "https://api.nopecha.com";
const GRID_SIZES = { 1: 1, 0: 3, 2: 4 };
const POLL_TIMEOUT = 60000;
const MAX_ATTEMPTS = 30;
 
const settings = UserscriptSettings;
settings.define({
    key: {
        name: "Enter your key",
        default: "",
        title: "",
    },
    show_data: {
        name: "Check API Quota",
        default: "",
        title: "Click to view your current API usage and reset time",
        onclick: () => {
            apiRequest(`${API_ENDPOINT}/status`).then(data => {
                const time = `${Math.floor(data.ttl/3600)}h ${Math.floor((data.ttl%3600)/60)}m`;
                console.log(`Your free quota will reset in ${time}.`);
                alert(JSON.stringify(data, null, 2));
            });
        }
    },
    disabled_hosts: {
        name: (current) => `${current.includes(HOST) ? 'Enable' : 'Disable'} this site`,
        default: [],
        title: "Add this site to the list of disabled hosts.",
        onclick: (current, update) => {
            if (current.includes(HOST)) {
                current = current.filter(item => item !== HOST);
            } else {
                current.push(HOST);
            }
 
            update(current);
            console.log(current);
        },
    },
    solve_delay_time: {
        name: "Delay Solving",
        default: 2000,
        title: "Milliseconds to delay solving.",
    },
    auto_open: {
        name: "Auto-Open",
        default: true,
        title: "Automatically opens CAPTCHA challenges.",
    },
    auto_solve: {
        name: "Auto-Solve",
        default: true,
        title: "Automatically solves CAPTCHA challenges.",
    },
    solve_delay: {
        name: "Delay Solving",
        default: true,
        title: "Adds a delay to avoid detection.",
    },
});
const eventQueue = [], eventHandlers = [];
 
let checkboxObserver, intersectionObserver, captchaObserver,
    isRecaptchaActive = false, isCaptchaActive = false;
 
async function solveCaptcha(params) {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        try {
            const response = await apiRequest(API_ENDPOINT, {
                method: 'POST',
                data: { ...params, type: 'recaptcha' }
            });
            if (!response.error) return pollCaptchaResult(response.data);
            if ([10, 11, 12, 15, 16, 17].includes(response.error)) {
                await delay(1000);
                continue;
            }
            throw new Error(response.message || `Error ${response.error}`);
        } catch (error) {
            if (attempt === MAX_ATTEMPTS-1) throw error;
            await delay(1000);
        }
    }
}
 
async function pollCaptchaResult(recognitionId) {
    const startTime = Date.now();
    while (Date.now() - startTime < POLL_TIMEOUT) {
        const response = await apiRequest(`${API_ENDPOINT}/?id=${recognitionId}`);
        if (!response.error) return response;
        await delay(1000);
    }
    throw new Error('Polling timeout');
}
 
async function apiRequest(url, options = {}) {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };
    if (settings.get("key")) {
        headers.Authorization = `Bearer ${settings.get("key")}`;
    }
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url,
            method: options.method || 'GET',
            headers,
            data: options.data ? JSON.stringify(options.data) : null,
            responseType: 'json',
            onload: response => resolve(response.response),
            onerror: reject,
            ontimeout: reject,
            onabort: reject
        });
    });
}
 
async function loadImage(image, target, timeout = 10000) {
    if (!target && !image.complete && !await new Promise(resolve => {
        const timer = setTimeout(() => resolve(false), timeout);
        image.addEventListener("load", () => {
            clearTimeout(timer);
            resolve(true);
        });
    })) return;
 
    const canvas = createCanvas(
        image.naturalWidth || target?.clientWidth,
        image.naturalHeight || target?.clientHeight
    );
    canvas.getContext("2d", { willReadFrequently: true }).drawImage(image, 0, 0);
    return !isCanvasEmpty(canvas) && canvas;
}
 
function getPixelColor(imageData, t, n, o) {
    let index = (o * t + n) * 4;
    return [imageData[index], imageData[index + 1], imageData[index + 2]]
}
 
function isImageEmpty(canvas, minThreshold = 0, maxThreshold = 230, emptyRatio = 0.99) {
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const width = context.canvas.width;
    const height = context.canvas.height;
    if (width === 0 || height === 0) return true;
 
    const imageData = context.getImageData(0, 0, width, height).data;
    let emptyPixels = 0;
 
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const color = getPixelColor(imageData, width, x, y, 1);
            const isColorBelowThreshold = color.every(value => value <= minThreshold);
            const isColorAboveThreshold = color.every(value => value >= maxThreshold);
            if (isColorBelowThreshold || isColorAboveThreshold) emptyPixels++;
        }
    }
 
    return emptyPixels / (width * height) > emptyRatio;
}
 
let isSolving = false;
 
async function startCaptchaSolving() {
    if(isSolving) return;
 
    isSolving = true;
    while (isCaptchaActive && (getCaptchaHeader() || isVerifyButtonDisabled())) {
        await delay(1000);
    }
 
    while(isCaptchaActive) {
        let { task, type, cells, images, waitAfterSolve } = await getCaptchaInfo();
        let startTime = new Date().valueOf(), processedCells = [...cells];
        type !== 1 && (images = [images[0]]);
        let processedImages = await Promise.all(images.map(s => loadImage(s)));
        if(type === 1) {
            const validCells = [], validImages = [];
            for(const [index, img] of processedImages.entries()) {
                img.width !== 100 || img.height !== 100 || (validCells.push(processedCells[index]), validImages.push(img));
            }
            processedCells = validCells;
			processedImages = validImages;
        }

        if(processedImages.length === 0) {
            clickElement("#recaptcha-verify-button");
            await delay(3000);
            continue;
        }
 
        if(processedImages.some(isImageEmpty)) {
            await delay(3000);
            continue;
        }
 
        const gridSize = GRID_SIZES[type];
        const response = await solveCaptcha({
            task,
            grid: `${gridSize}x${gridSize}`,
            image_data: processedImages.map(canvasToBase64),
        })
        if(!response || "error" in response) {
            console.warn("api error", response), await delay(2e3);
            continue
        }
        const endTime = new Date().valueOf();
        if(settings.get("solve_delay")) {
            const delayTime = settings.get("solve_delay_time") - endTime + startTime;
            delayTime > 0 && await delay(delayTime)
        }
        const gridWidth = type === 2 ? 4 : 3;
 
        for(processedCells.forEach((s, x) => {
            let B = s.classList.contains("rc-imageselect-tileselected"),
                h = cells.indexOf(s);
            response.data[x] !== B && clickElement(`tr:nth-child(${Math.floor(h/gridWidth)+1}) td:nth-child(${h%gridWidth+1})`)
        }), 
		(!waitAfterSolve || !response.data.some(s => s)) && (await delay(200), clickElement("#recaptcha-verify-button")), await waitForEvent(eventQueue); document.querySelectorAll(".rc-imageselect-dynamic-selected").length > 0;) await delay(1e3)
    }
}
 
if (location.pathname.endsWith("/anchor")) {
    settings.createMenu();
    registerEventHandler({
        name: "auto-open",
        condition: () => settings.get("auto_open") && !settings.get("disabled_hosts").includes(HOST),
        ready: () => document.contains(document.querySelector(".recaptcha-checkbox")),
        start: initializeRecaptcha,
        quit: () => {
            checkboxObserver.disconnect();
            intersectionObserver.disconnect();
            isRecaptchaActive = false;
        },
        running: () => isRecaptchaActive
    })
} else {
    registerEventHandler({
        name: "auto-solve",
        condition: () => settings.get("auto_solve") && !settings.get("disabled_hosts").includes(HOST),
        ready: () => document.contains(document.querySelector(".rc-imageselect, .rc-imageselect-target")),
        start: initializeCaptcha,
        quit: () => {
            captchaObserver.disconnect();
            isCaptchaActive = false;
            processEvents(eventQueue)
        },
        running: () => isCaptchaActive
    })
}
 
async function checkEventHandler(handler) {
    if (handler.timedout) return false;
    const condition = handler.condition();
    if (condition === handler.running()) return false;
    if (!condition && handler.running()) {
        handler.quit();
        return false;
    }
    if (condition && !handler.running()) {
        while (!handler.ready()) await delay(200);
        handler.start();
        return false;
    }
}
 
function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
}
 
function canvasToBase64(canvas) {
    return canvas.toDataURL("image/jpeg").replace(/data:image\/[a-z]+;base64,/g, "");
}
 
function isCanvasEmpty(canvas) {
    try {
        canvas.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, 1, 1);
    } catch {
        return true;
    }
    return false;
}
 
 
function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
 
function initializeCaptcha() {
    isCaptchaActive = true;
    processEvents(eventQueue);
    let captchaTimeout;
    captchaObserver = new MutationObserver(() => {
        clearTimeout(captchaTimeout);
        captchaTimeout = setTimeout(() => processEvents(eventQueue), 200);
    });
    captchaObserver.observe(document.body, { childList: true, subtree: true });
    startCaptchaSolving();
}
 
function processEvents(queue) {
    console.log(queue);
    queue.forEach(callback => callback());
    queue.splice(0);
}
 
function registerEventHandler(handler, timeoutDuration) {
    handler.timedout = false;
    eventHandlers.push(handler);
    let timeout;
	let interval = setInterval(async () => {
        await checkEventHandler(handler) || (clearTimeout(timeout), clearInterval(interval));
    }, 400);
    timeoutDuration && (timeout = setTimeout(() => clearInterval(interval), timeoutDuration), handler.timedout = true);
}
 
function waitForEvent(queue) {
    return new Promise(resolve => queue.push(resolve));
}
 
function initializeRecaptcha() {
    isRecaptchaActive = true;
    checkboxObserver = new MutationObserver(changes => {
        if (changes.length === 2) {
            handleCheckboxChange();
        }
        if (changes.length && changes[0].target.classList.contains("recaptcha-checkbox-expired")) {
            location.reload();
        }
    });
    checkboxObserver.observe(document.querySelector(".recaptcha-checkbox"), {
        attributes: true
    });
    let isIntersected = false;
    intersectionObserver = new IntersectionObserver(() => {
        if (!isIntersected) {
            isIntersected = true;
            handleCheckboxChange();
        }
    }, {
        threshold: 0
    });
    intersectionObserver.observe(document.body);
}
 
function isVerifyButtonDisabled() {
    return document.querySelector("#recaptcha-verify-button")?.getAttribute("disabled");
}
 
async function handleCheckboxChange() {
    await delay(400);
    clickElement(".recaptcha-checkbox");
}
 
function clickElement(selector) {
    document.querySelector(selector)?.click();
}
 
function getCaptchaHeader() {
    return document.querySelector(".rc-doscaptcha-header");
}
 
function getCaptchaInfo() {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            const instructions = document.querySelector(".rc-imageselect-instructions");
            const cells = [...document.querySelectorAll("table tr td")];
            const images = cells.map(cell => cell.querySelector("img")); //.filter(c => c).filter(c => c.src.trim());
            if (!instructions || cells.concat(images).length < 18) return;
            clearInterval(interval);
            const lines = instructions.innerText.split("\n");
            const task = lines.slice(0, 2).join(" ").replace(/\s+/g, " ").trim();
            const type = cells.length === 16 ? 2 : images.some(img => img.classList.contains("rc-image-tile-11")) ? 1 : 0;
            const waitAfterSolve = lines.length === 3 && type !== 2;
            resolve({ task, type, cells, images, waitAfterSolve });
        }, 1000);
    });
}