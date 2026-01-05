// ==UserScript==
// @name            InterfaceLIFT | Download Largest Wallpaper Variant
// @namespace       de.sidneys.userscripts
// @homepage        https://gist.githubusercontent.com/sidneys/32af71f8a3260cee2baef026837151a5/raw/
// @version         11.11.11
// @description     Adds a button to instantly download the optimum (largest) wallpaper image variant base on its total megapixels
// @author          sidneys
// @icon            https://interfacelift.com/favicon.ico
// @include         http*://interfacelift.com/wallpaper/*
// @require         https://greasyfork.org/scripts/38888-greasemonkey-color-log/code/Greasemonkey%20%7C%20Color%20Log.js
// @require         https://greasyfork.org/scripts/38889-greasemonkey-waitforkeyelements-2018/code/Greasemonkey%20%7C%20waitForKeyElements%202018.js
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/29529/InterfaceLIFT%20%7C%20Download%20Largest%20Wallpaper%20Variant.user.js
// @updateURL https://update.greasyfork.org/scripts/29529/InterfaceLIFT%20%7C%20Download%20Largest%20Wallpaper%20Variant.meta.js
// ==/UserScript==

/**
 * @default
 * @constant
 */
const DEBUG = false;


/**
 * @default
 * @constant
 */
const defaultBaseUrl = 'https://InterfaceLIFT.com/wallpaper/7yz4ma1/';

/**
 * Convert image dimensions to megapixels
 * @param {String} dimensions - Image dimensions (e.g. '1920x1080')
 * @returns {Number} Image megapixels (e.g. 2.07)
 */
let convertDimensionsToMegapixels = (dimensions) => {
    console.debug('convertDimensionsToMegapixels');

    let width = dimensions.match(/\d+/g)[0];
    let height = dimensions.match(/\d+/g)[1];

    return parseFloat(((width * height) / 1048576).toFixed(2));
};

/**
 * Get wallpaper id
 * @param {String} url - InterfaceLIFT wallpaper url
 * @returns {String} InterfaceLIFT wallpaper id
 */
let getWallpaperId = (url) => {
    console.debug('getWallpaperId');

    const wallpaperId = url.match(/\d+/)[0];

    return wallpaperId.length < 5 ? `0${wallpaperId}` : `${wallpaperId}`;
};

/**
 * Get wallpaper name
 * @param {String} url - InterfaceLIFT wallpaper url
 * @returns {String} InterfaceLIFT wallpaper name
 */
let getWallpaperName = (url) => {
    console.debug('getWallpaperName');

    return url.replace(/.*\/|\.[^.]*$/g, '');
};

/**
 * Get wallpaper url
 * @param {String} id - InterfaceLIFT wallpaper id
 * @param {String} name - InterfaceLIFT wallpaper name
 * @param {String} dimensions - Image dimensions (e.g. '1920x1080')
 * @returns {String} InterfaceLIFT wallpaper name
 */
let getWallpaperUrl = (id, name, dimensions) => {
    console.debug('getWallpaperName');

    const wallpaperNameClean = name.replace(/_/g, '');

    return `${defaultBaseUrl}${id}_${wallpaperNameClean}_${dimensions}.jpg`;
};

/**
 * Parse optimum image dimensions from InterfaceLIFT selector
 * @param {HTMLElement} selectElement - InterfaceLIFT resolution selector dropdown
 * @returns {String} Image dimensions (e.g. '1920x1080')
 */
let parseOptimumDimensions = (selectElement) => {
    console.debug('parseOptimumDimensions');

    const dimensionsList = [];

    const elementOptionList = selectElement.querySelectorAll('optgroup');

    elementOptionList.forEach((elem) => {
        dimensionsList.push(elem.querySelector('option').value);
        dimensionsList.sort((a, b) => {
            const megapixelsA = convertDimensionsToMegapixels(a);
            const megapixelsB = convertDimensionsToMegapixels(b);
            if (megapixelsA > megapixelsB) { return -1; }
            if (megapixelsA < megapixelsB) { return 1; }
            return 0;
        });
    });

    return dimensionsList[0];
};

/**
 * Adds largest resolution download controls
 * @param {Element} containerElement - Wallpaper container element
 */
let addDownloadControls = (containerElement) => {
    console.debug('addDownloadControls');

    // Get wallpaper previews
    let itemList = containerElement.querySelectorAll('.item .preview');

    // Extend wallpaper previews
    itemList.forEach((element) => {
        // Get id, name
        const defaultWallpaperUrl = element.querySelector('a').getAttribute('href');
        const wallpaperId = getWallpaperId(defaultWallpaperUrl);
        const wallpaperName = getWallpaperName(defaultWallpaperUrl);

        // Get url
        const selectElement = element.querySelector('select');

        // Get optimal wallpaper data
        const optimumDimensions = parseOptimumDimensions(selectElement);
        const optimumMegapixels = convertDimensionsToMegapixels(optimumDimensions);
        const optimumUrl = getWallpaperUrl(wallpaperId, wallpaperName, optimumDimensions);

        // Form: Select optimal image
        selectElement.value = optimumDimensions;

        // Button: Add url to optimal image
        const buttonElement = document.createElement('div');
        element.appendChild(buttonElement);
        buttonElement.style.height = '28px';
        buttonElement.style.marginLeft = '44px';
        buttonElement.style.backgroundColor = 'rgba(150, 50, 50, 0.05)';
        buttonElement.classList.add('download');
        buttonElement.innerHTML = `
            <span style="display: inline-block; margin: 4px 8px; width: 145px; max-width: 145px; text-align: left; font-family: Arial, sans-serif; font-size: 11px; white-space: nowrap;">
                <b>${optimumDimensions}</b> (${optimumMegapixels} MP)
            </span>
            <div id="download_4113" style="display: inline-block; float: right;">
                <a download href="${optimumUrl}">
                    <img src="/img_NEW/button_download.png" style="filter: hue-rotate(169deg) saturate(400%);">
                </a>
            </div>
        `;

        // Status
        console.info(wallpaperName, optimumUrl, optimumDimensions);
    });
};


/**
 * Init
 */
let init = () => {
    console.info('init');

    waitForKeyElements('#page > div:nth-child(5)', (containerElement) => {
        addDownloadControls(containerElement);
    });
};


/**
 * @listens window:Event#load
 */
window.addEventListener('load', () => {
    console.debug('window#load');

    init();
});
