// ==UserScript==
// @name         AC Super Ultra Many Very Happy Notification
// @namespace    http://tampermonkey.net/
// @version      2025-06-19
// @description  AtCoderのACを超派手に演出する
// @author       Kicky1618
// @match        https://atcoder.jp/contests/**/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540026/AC%20Super%20Ultra%20Many%20Very%20Happy%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/540026/AC%20Super%20Ultra%20Many%20Very%20Happy%20Notification.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/audio.ts":
/*!**********************!*\
  !*** ./src/audio.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.audioText = void 0;
exports.audioText = "https://kangping-git.github.io/boxes/keiosei.mp3";


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const audio_1 = __webpack_require__(/*! ./audio */ "./src/audio.ts");
function getNewSubmission(contestId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://atcoder.jp/contests/${contestId}/submissions/me`);
        if (!response.ok) {
            throw new Error("Failed to fetch submissions");
        }
        const data = yield response.text();
        const $ = new DOMParser().parseFromString(data, "text/html");
        const submissions = $.querySelectorAll(".table-responsive tbody tr");
        const submissionList = [];
        submissions.forEach((submission) => {
            var _a;
            const cols = submission.querySelectorAll("td");
            if (cols.length < 7)
                return;
            const submissionData = {
                id: cols[0].innerText.trim(),
                problem: ((_a = cols[1].querySelector("a")) === null || _a === void 0 ? void 0 : _a.href.split("/")[6].trim()) || "",
                result: cols[6].innerText.trim(),
            };
            submissionList.push(submissionData);
        });
        return submissionList;
    });
}
function ACEffect(task) {
    const audio = new Audio(audio_1.audioText);
    audio.loop = true;
    audio.play();
    h1.innerText = `Problem ${task.toUpperCase()} AC!`;
    h1.style.transition = "top 0.5s ease-in-out";
    h1.style.top = "100px";
    h1.style.color = "red";
    h1.style.fontSize = "5vw";
    setTimeout(() => {
        h1.style.top = "-100px";
        h1.innerText = "";
        mainContainer.style.background = "";
        mainDiv.style.background = "";
        chokudaiImage1.style.display = "none";
        chokudaiImage2.style.display = "none";
        audio.pause();
        elements = [];
    }, 10000);
    const mainDiv = document.querySelector("#main-div");
    const mainContainer = document.querySelector("#main-container");
    setGradientStyleDom(mainDiv);
    setGradientStyleDom(mainContainer);
    chokudaiImage1.style.display = "block";
    chokudaiImage2.style.display = "block";
}
function setGradientStyleDom(element) {
    element.style.background = "linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)";
    element.style.backgroundSize = "400% 400%";
    elements.push(element);
}
let elements = [];
function tick() {
    requestAnimationFrame(tick);
    elements.forEach((element) => {
        const now = Date.now() / 500;
        const offset = now % 5;
        element.style.backgroundPosition = `${offset * 100}% 50%`;
    });
    chokudaiImage1.style.transform = `rotateZ(30deg) translateX(${Math.sin(Date.now() / 1000) * 10}px)`;
    chokudaiImage2.style.transform = `scaleX(-1) rotateZ(30deg) translateX(${Math.sin(Date.now() / 1000) * 10}px)`;
    chokudaiImage1.style.bottom = `${-200 + Math.sin(Date.now() / 300) * 300}px`;
    chokudaiImage2.style.bottom = `${-200 + Math.sin(Date.now() / 300 - Math.PI) * 300}px`;
    chokudaiImage1.style.left = `${-100 + Math.sin(Date.now() / 300) * 150}px`;
    chokudaiImage2.style.right = `${-100 + Math.sin(Date.now() / 300 - Math.PI) * 150}px`;
}
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    if (!contestId)
        return;
    const lastUpdate = localStorage.getItem("atcoder_hightension_lastupdate_" + contestId);
    if (!lastUpdate || new Date(lastUpdate).getTime() < Date.now() - 1000 * 3) {
        const submissions = yield getNewSubmission(contestId);
        const lastSubmissionNow = submissions[0].id || "0";
        if (submissions[0].result === "AC") {
            localStorage.setItem("atcoder_hightension_lastsubmission_" + contestId, lastSubmissionNow + "_" + submissions[0].problem);
        }
    }
    localStorage.setItem("atcoder_hightension_lastupdate_" + contestId, new Date().toISOString());
    const lastSubmissionNow = localStorage.getItem("atcoder_hightension_lastsubmission_" + contestId);
    if (lastSubmissionNow && lastSubmissionNow !== lastSubmission && lastSubmissionNow !== "0") {
        const [submissionId, problemId] = lastSubmissionNow.split("_");
        if (submissionId && problemId) {
            ACEffect(problemId);
        }
    }
    lastSubmission = lastSubmissionNow || "0";
}), 1000 * 5);
const contestId = location.pathname.split("/")[2];
let lastSubmission = localStorage.getItem("atcoder_hightension_lastsubmission_" + contestId);
if (!lastSubmission) {
    lastSubmission = "0";
}
const h1 = document.createElement("h1");
h1.innerText = "";
h1.style.position = "fixed";
h1.style.top = "-100px";
h1.style.left = "50vw";
h1.style.transform = "translateX(-50%)";
h1.style.zIndex = "1000";
document.body.appendChild(h1);
const chokudaiImage1 = document.createElement("img");
chokudaiImage1.src = "https://kangping-git.github.io/boxes/sfc.png";
chokudaiImage1.style.position = "fixed";
chokudaiImage1.style.bottom = "-200px";
chokudaiImage1.style.left = "-100px";
chokudaiImage1.style.zIndex = "1000";
chokudaiImage1.style.width = "400px";
chokudaiImage1.style.transform = "rotateX(-45deg)";
chokudaiImage1.style.display = "none";
document.body.appendChild(chokudaiImage1);
const chokudaiImage2 = document.createElement("img");
chokudaiImage2.src = "https://kangping-git.github.io/boxes/sfc.png";
chokudaiImage2.style.position = "fixed";
chokudaiImage2.style.bottom = "-200px";
chokudaiImage2.style.right = "-100px";
chokudaiImage2.style.zIndex = "1000";
chokudaiImage2.style.width = "400px";
chokudaiImage2.style.transform = "scaleX(-1) rotateX(45deg)";
chokudaiImage2.style.display = "none";
document.body.appendChild(chokudaiImage2);
tick();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/************************************************************************/
/******/
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/
/******/ })()
;