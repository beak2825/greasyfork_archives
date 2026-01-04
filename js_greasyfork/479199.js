// ==UserScript==
// @name         UoM Blackboard: Add course images
// @namespace    http://tampermonkey.net/
// @version      20240128.00.00
// @description  An optional accompanying script for https://github.com/adil192/BlackboardTheme, which adds better course images to the Blackboard homepage.
// @author       adil192
// @match        https://online.manchester.ac.uk/ultra/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manchester.ac.uk
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/479199/UoM%20Blackboard%3A%20Add%20course%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/479199/UoM%20Blackboard%3A%20Add%20course%20images.meta.js
// ==/UserScript==

// @ts-check

/**
 * A string that is used as a placeholder in the module images database
 * when no Pixabay images are found for a module.
 * 
 * This is used to prevent the script from trying to find images for the
 * same module again and again, using up the Pixabay API quota.
 */
const NORESULTS = "NORESULTS";

/**
 * Known modules whose images aren't from Pixabay.
 * @type {Record<string, string>}
 */
const knownModuleImages = {
    "ARDSE001" : "https://raw.githubusercontent.com/adil192/BlackboardTheme/main/assets/subjects/ARDSE001/ARDSE001.jpg",

    "COMP16321": "https://raw.githubusercontent.com/adil192/BlackboardTheme/main/assets/subjects/COMP16321/COMP16321.jpg",
    "COMP28112": "https://raw.githubusercontent.com/adil192/BlackboardTheme/main/assets/subjects/COMP38311/COMP28112.jpg",
    "COMP30040": "https://raw.githubusercontent.com/adil192/BlackboardTheme/main/assets/subjects/COMP30040/COMP30040.jpg",
    "COMP33312": "https://raw.githubusercontent.com/adil192/BlackboardTheme/main/assets/subjects/COMP33312/COMP33312.jpg",
    "COMP33511": "https://raw.githubusercontent.com/adil192/BlackboardTheme/main/assets/subjects/COMP33511/COMP33511.jpg",
    "COMP36212": "https://raw.githubusercontent.com/adil192/BlackboardTheme/main/assets/subjects/COMP36212/COMP36212.jpg",
    "COMP38311": "https://raw.githubusercontent.com/adil192/BlackboardTheme/main/assets/subjects/COMP38311/COMP38311.jpg",

    "MATH11711": "https://raw.githubusercontent.com/adil192/BlackboardTheme/main/assets/subjects/MATH11711/MATH11711.jpg",
    "MATH31051": "https://raw.githubusercontent.com/adil192/BlackboardTheme/main/assets/subjects/MATH31051/MATH31051.png",
    "MATH32031": "https://raw.githubusercontent.com/adil192/BlackboardTheme/main/assets/subjects/MATH32031/MATH32031.jpg",
    "MATH32052": "https://raw.githubusercontent.com/adil192/BlackboardTheme/main/assets/subjects/MATH32052/MATH32052.jpg",
    "MATH32091": "https://raw.githubusercontent.com/adil192/BlackboardTheme/main/assets/subjects/MATH32091/MATH32091.png",
};

/**
 * A module whose name matches one of the regular expressions in this map
 * will use the corresponding image.
 * 
 * Modules defined in `knownModuleImages` will take priority.
 * 
 * @type {Map<RegExp, string>}
 */
const specialModuleImages = new Map([
    [/team project/i, "https://raw.githubusercontent.com/adil192/BlackboardTheme/main/assets/subjects/team/team.jpg"],
]);


/**
 * The IndexDB database with the cached module images.
 * @type {IDBDatabase | null}
 */
let moduleImagesDB = null;

/**
 * Opens the IndexDB database with the cached module images.
 * @returns {Promise<void>}
 */
function openDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("moduleImages", 1);
        request.onerror = reject;
        request.onsuccess = () => {
            moduleImagesDB = request.result;
            resolve();
        };
        request.onupgradeneeded = () => {
            const db = request.result;
            db.createObjectStore("moduleImages");
        };
    });
}

/** @type {HTMLDivElement | null} */
let coursesDiv = null;

/**
 * Returns a promise that resolves after `ms` milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function timeoutPromise(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

/**
 * Returns a promise that resolves when `coursesDivs` are found.
 * @returns {Promise<void>}
 */
async function findCoursesDivs() {
    while (!coursesDiv) {
        coursesDiv = document.querySelector('.course-org-list');
        if (!coursesDiv) await timeoutPromise(50);
    }
    console.log('found courses div:', {coursesDiv});
}

/**
 * Returns the module image for the given module name, or null if it doesn't exist.
 * @param {string} moduleName
 * @returns {Promise<string | null>}
 */
async function findModuleImage(moduleName) {
    if (!moduleImagesDB) {
        console.error('moduleImagesDB not open');
        return null;
    }

    for (const moduleCode in knownModuleImages) {
        if (!moduleName.startsWith(moduleCode)) continue;
        return knownModuleImages[moduleCode];
    }

    for (const [regex, image] of specialModuleImages) {
        if (!regex.test(moduleName)) continue;
        return image;
    }

    const transaction = moduleImagesDB.transaction("moduleImages", "readonly");
    const objectStore = transaction.objectStore("moduleImages");
    const cachedImage = await new Promise((resolve) => {
        const request = objectStore.get(moduleName);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
    });

    if (cachedImage) {
        if (cachedImage === NORESULTS) return null;
        else return cachedImage;
    } else {
        return await findAndCacheModuleImage(moduleName);
    }
}

/**
 * Finds a module image from Pixabay for the given module name,
 * and caches it in the module images database.
 * 
 * 
 * @param {string} moduleName
 * @returns {Promise<string | null>}
 */
async function findAndCacheModuleImage(moduleName) {
    const apiKey = "25286000-bf7eb8ff8e6d2d1630cf59fae";
    const keywords = extractKeywords(moduleName);
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(keywords)}&image_type=photo&safesearch=true&orientation=horizontal&per_page=3`;
    console.log(`Searching Pixabay for ${moduleName}: ${url}`);
    const response = await fetch(url);
    const json = await response.json();
    const hits = json.hits;
    if (hits.length === 0) {
        console.error(`No Pixabay images found for ${moduleName}`);

        // Don't try again for this module.
        if (moduleImagesDB) {
            const transaction = moduleImagesDB.transaction("moduleImages", "readwrite");
            const objectStore = transaction.objectStore("moduleImages");
            objectStore.put(NORESULTS, moduleName);
        }
        return null;
    }
    const moduleImage = hits[0].webformatURL;
    const dataUrl = await urlToDataUrl(moduleImage);

    if (moduleImagesDB) {
        const transaction = moduleImagesDB.transaction("moduleImages", "readwrite");
        const objectStore = transaction.objectStore("moduleImages");
        objectStore.put(dataUrl, moduleName);
    }
    return dataUrl;
}

/**
 * Converts an image URL to a data URL.
 * @param {string} url
 * @returns {Promise<string>}
 */
function urlToDataUrl(url) {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Failed to get canvas context");
        const image = new Image();
        image.addEventListener("load", () => {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            const dataUrl = canvas.toDataURL("image/webp");
            resolve(dataUrl);
        });
        image.setAttribute("crossorigin", "anonymous");
        image.src = url;
    });
}

/**
 * Extracts the keywords from a module name.
 *
 * E.g. "COMP30040&30030 Third Year Project Laboratory 2023-24 Full Year"
 * becomes "Project Laboratory".
 * 
 * E.g. "COMP33511 User Experience 2023-24 1st Semester"
 * becomes "User Experience".
 *
 * @param {string} moduleName
 * @returns {string}
 */
function extractKeywords(moduleName) {
    let words = moduleName.split(" ");
    
    // remove any words that contain a number
    words = words.filter((word) => !/\d/.test(word));

    // remove banned words
    const bannedWords = [
        "semester", "full", "year",
        "and", "or", "the", "of", "in", "to", "for", "with", "on", "at", "from",
        "first", "second", "third", "fourth", "fifth",
        "i", "ii", "iii", "iv", "v",
        "-", "‐", "‒", "–", "—", "―", "−",
    ];
    words = words.filter((word) => !bannedWords.includes(word));

    if (words.length > 2) {
        const bannedWords = [
            "introduction", "foundations", "principles", "understanding",
        ];
        words = words.filter((word) => !bannedWords.includes(word));
    }

    // limit to the first 4 words
    words = words.slice(0, 2);

    return words.join(" ");
}

/**
 * Sets the `data-module-code` attribute of each course to the course code.
 */
function labelCourses() {
    if (!coursesDiv) return;
    /** @type {NodeListOf<HTMLLIElement>} */
    const courses = coursesDiv.querySelectorAll(".course-element-card");
    courses.forEach((course) => {
        // don't set the module image if it already exists,
        // stored in `var(--module-image)`
        if (course.style.getPropertyValue("--module-image")) return;

        /** @type {HTMLElement | null} */
        const courseTitleA = course.querySelector(".course-title");
        /** @type {HTMLElement | null} */
        const courseTitleDiv = course.querySelector(".course-banner");

        if (!courseTitleA || !courseTitleDiv) return;

        const moduleName = courseTitleA.textContent?.trim();
        if (!moduleName) return;

        // set to "none" so we don't run findModuleImage() again
        course.style.setProperty("--module-image", "none");
        // set the module code
        findModuleImage(moduleName).then((moduleImage) => {
            if (!moduleImage) return;
            course.style.setProperty("--module-image", `url(${moduleImage})`);
        });
    });
}

(function () {
    'use strict';

    console.log("UoM Blackboard: Add course images");

    Promise.all([
        findCoursesDivs(),
        openDb(),
    ]).then(() => {
        labelCourses();

        coursesDiv?.addEventListener("DOMSubtreeModified", () => {
            labelCourses();
        }, { passive: true });
    });
})();
