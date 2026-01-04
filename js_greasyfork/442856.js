// ==UserScript==
// @name Linguist Expand
// @namespace https://davoleo.net
// @author Davoleo
// @homepage https://github.com/Davoleo/scripts/tree/master/linguist_expand
// @description Expands Github's Linguist language list on repositories to show every language instead of hiding the small percentage under "Other"
// @contributionURL https://davoleo.net/donate
// @match https://github.com/*
// @require https://unpkg.com/js-yaml@4.1.0/dist/js-yaml.min.js
// @resource languageColors https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml
// @grant GM_getResourceText
// @grant GM_log
// @grant GM_xmlhttpRequest
// @connect api.github.com
// @run-at document-idle
// @version 1.0.2
// @license MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/442856/Linguist%20Expand.user.js
// @updateURL https://update.greasyfork.org/scripts/442856/Linguist%20Expand.meta.js
// ==/UserScript==

//Loads languages.yml (from Github's linguist repo) the most updated, official and complete collection of github languages and their colors
//loaded into a JS object via jsyaml (a library to parse yaml inside of javascript)
const languages = jsyaml.load(GM_getResourceText('languageColors'));

//Contains information about languages and their percentages in the repository
let langPercentagesMap = {}
//Contains information about languages and their colors
let langColorsMap = {}

/**
 * Function to standardize and modernize GM_xmlhttpRequest to work with promises
 * @param {String} url of the endpoint
 * @param {Object} options Contains extra information about the request
 * @returns a promise with the requested content
 */
function request(url, options={}) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url,
      method: options.method || "GET",
      headers: options.headers || {Accept: "application/json",
                                   "Content-Type": "application/json"},
      responseType: options.responseType || "json",
      data: options.body || options.data,
      onload: res => resolve(res.response),
      onerror: reject
    })
  })
}

/**
 * Retrieve information about the languages of a repository via the Github API
 * @param {String} user owner of the repository
 * @param {String} repo name
 * @returns the languages of the repository as a JS Object | null if the promise is rejected for any reason.
 */
async function retrieveLanguages(user, repo) {
    try {
        return await request(`https://api.github.com/repos/${user}/${repo}/languages`, {
            headers: {
                Accept: "application/vnd.github.v3+json"
            }
        });
    }
    catch(e) {
        return null;
    }
}

/**
 * Builds language bar segments assigning the correct colors and width depending on the language and it's frequency in the repository
 * @param {string} name of the language
 * @param {string} color of the language
 * @param {number} percentage of the language in the repository code
 * @returns a segment span of the language bar with the correct width and color
 */
function buildBarSegmentSpan(name, color, percentage) {
    const segment = document.createElement('span');
    segment.style.setProperty('background-color', color, 'important');
    segment.style.width = percentage + '%';
    //Removes any margin which would make the language bar otherwise inaccurate
    segment.style.setProperty('margin', '0', 'important');
    //Make sure there's at least 1px of width in the bar segment (fixes width of 0.0% segments)
    //TODO: investigate a better way to do this
    segment.style.paddingLeft = '1px';
    segment.setAttribute("itemprop", "keywords");
    segment.setAttribute("aria-label", name + ' ' + percentage);
    segment.setAttribute("data-view-component", "true");
    segment.setAttribute("class", "Progress-item color-bg-success-inverse lingustexpand");
    return segment;
}

/**
 * Builds a chip for each language containing
 * - The Color of the language in the bar
 * - The Name of the language
 * - The Percentage of the language in repository files
 * @param {String} owner of the repository
 * @param {String} repo name
 * @param {String} name of the language
 * @param {String} color of the language
 * @param {number} percentage percentage of the language in the repository code
 * @returns A chip components featured as legend for the language bar
 */
function buildLanguageChip(owner, repo, name, color, percentage) {
    const chip = document.createElement('li');
    chip.classList.add('d-inline');

    const chipLink = document.createElement('a');
    chipLink.classList.add('d-inline-flex', 'flex-items-center', 'flex-nowrap', 'Link--secondary', 'no-underline', 'text-small', 'mr-3');
    chipLink.href = `/${owner}/${repo}/search?l=${name}` //Chip link should bring you to the search query with the correct language in place

    //Parse SVG BALL directly injecting the correct color as in-line style
    const svgText = `
    <svg style="color:${color};" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" 
            width="16" data-view-component="true" class="octicon octicon-dot-fill mr-2">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8z"></path>
    </svg>
    `;
    const svgTMP = document.createElement('template');
    svgTMP.innerHTML = svgText;
    chipLink.append(svgTMP.content);
    //^ uses a template HTMLElement to parse HTML into its respective DOM elements

    //Adds language name to the chip
    const chipName = document.createElement('span');
    chipName.classList.add('color-fg-default', 'text-bold', 'mr-1');
    chipName.textContent = name;
    chipLink.append(chipName);

    //Adds Language percentage to the chip
    const chipValue = document.createElement('span');
    chipValue.textContent = percentage + '%';
    chipLink.append(chipValue);

    chip.append(chipLink);
    return chip;
}

/**
 * Builds the custom language stats section and returns it
 * @returns The full section with complete repository language stats
 */
function buildLanguagesSection(owner, repo) {

    const languageSection = document.createElement("div");
    languageSection.classList.add("mb-3", "mt-1");

    const bar = document.createElement('span');
    bar.classList.add("Progress", 'mb-2');
    bar.setAttribute("data-view-component", "true");
    Object.keys(langColorsMap).forEach((lang, i) => {
        const segment = buildBarSegmentSpan(lang, langColorsMap[lang], langPercentagesMap[lang]);
        //if (i !== 0) {
        //    segment.style.setProperty('margin-left', '1px');
        //}
        bar.appendChild(segment);
    });
    languageSection.append(bar);

    const languageUL = document.createElement('ul');
    Object.keys(langColorsMap).forEach((lang) => {
        const languageChip = buildLanguageChip(owner, repo, lang, langColorsMap[lang], langPercentagesMap[lang]);
        languageUL.append(languageChip);
    });
    languageSection.append(languageUL);

    return languageSection;
}

//MAIN ENTRY POINT
(() => {
    'use strict';

    //Selects the box element that contains files and folders on the repo page
    const mainContent = document.querySelector(".Box-sc-g0xbh4-0.yfPnm");
    if (!mainContent)
        throw Error("mainContent Hook Selector is dead!")

    //The original language bar in the sidebar
    const originalLangBar = document.querySelector("div.Layout-sidebar span.Progress");

    //array that is generated from the tab URL, it's structured this way: ["", "<repo_owner>", "<repo_name>"]
    const ownerRepo = window.location.pathname.split('/');

    //only works against github.com/ABC/DEF links
    if (ownerRepo.length === 3) {
        //retrieves necessary information about the repository's languages
        retrieveLanguages(ownerRepo[1], ownerRepo[2]).then((lang_vals) => {
            //assume request is successful if object is not null and it doesn't contain 'message' in its keys
            if (lang_vals !== null && !lang_vals.message) {
                //Sum of all language values
                const total = Object.values(lang_vals).reduce((prev, curr) => prev + curr);
                //for each language in the object
                Object.keys(lang_vals).forEach((lang) => {
                    //
                    langColorsMap[lang] = languages[lang].color;
                    langPercentagesMap[lang] = ((lang_vals[lang] / total) * 100).toFixed(1);
                });
            }
            else return; //Short Circuit

            //Build the new custom lang stats
            const languageSection = buildLanguagesSection(ownerRepo[1], ownerRepo[2]);
            mainContent.insertAdjacentElement('beforebegin', languageSection);
            //^ inserts our custom language stats before the box containing directories and files

            //GM_log(langColorsMap);
            //GM_log(langPercentagesMap);

            //Remove original Language Section (sidebar)
            originalLangBar.parentElement.parentElement.remove();
        });
    }
})();