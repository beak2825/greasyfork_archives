// ==UserScript==
// @name        Perplexity helper
// @namespace   Tiartyos
// @match       https://www.perplexity.ai/*
// @grant       none
// @version     7.11
// @author      Tiartyos, monnef
// @description Simple script that adds buttons to Perplexity website for repeating request using Copilot.
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/lodash-fp/0.10.4/lodash-fp.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js
// @require     https://cdn.jsdelivr.net/npm/color2k@2.0.2/dist/index.unpkg.umd.js
// @require     https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jsondiffpatch/0.4.1/jsondiffpatch.umd.min.js
// @require     https://cdn.jsdelivr.net/npm/hex-to-css-filter@6.0.0/dist/umd/hex-to-css-filter.min.js
// @require     https://cdn.jsdelivr.net/npm/perplex-plus@0.0.72/dist/lib/perplex-plus.js
// @homepageURL https://www.perplexity.ai/
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/469985/Perplexity%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/469985/Perplexity%20helper.meta.js
// ==/UserScript==

const PP = window.PP.noConflict();
const jq = PP.jq;
const hexToCssFilter = window.HexToCSSFilter.hexToCSSFilter;

const $c = (cls, parent) => jq(`.${cls}`, parent);
const $i = (id, parent) => jq(`#${id}`, parent);
const classNames = (...args) => args.filter(Boolean).join(' ');

const takeStr = n => str => str.slice(0, n);
const dropStr = n => str => str.slice(n);
const dropRightStr = n => str => str.slice(0, -n);
const filter = pred => xs => xs.filter(pred);
const pipe = x => (...fns) => fns.reduce((acc, fn) => fn(acc), x);

const nl = '\n';
const markdownConverter = new showdown.Converter({ tables: true });

let debugMode = false;
const enableDebugMode = () => {
  debugMode = true;
};

const userscriptName = 'Perplexity helper';
const logPrefix = `[${userscriptName}]`;

const debugLog = (...args) => {
  if (debugMode) {
    console.debug(logPrefix, ...args);
  }
};

let debugTags = false;
const debugLogTags = (...args) => {
  if (debugTags) {
    console.debug(logPrefix, '[tags]', ...args);
  }
};

let debugModalCreation = false;
const logModalCreation = (...args) => {
  if (debugModalCreation) {
    console.debug(logPrefix, '[modalCreation]', ...args);
  }
}

let debugReplaceIconsInMenu = false;
const logReplaceIconsInMenu = (...args) => {
  if (debugReplaceIconsInMenu) {
    console.debug(logPrefix, '[replaceIconsInMenu]', ...args);
  }
}

const log = (...args) => {
  console.log(logPrefix, ...args);
};

const logError = (...args) => {
  console.error(logPrefix, ...args);
};

const enableTagsDebugging = () => {
  debugTags = true;
};

// Throttled debug logging to prevent spam
// Stores unique message-parameter combinations for 60 seconds
const debugLogThrottleCache = new Map();
const THROTTLE_WINDOW_MS = 60000; // 60 seconds

const debugLogThrottled = (message, params = {}) => {
  if (!debugMode) return;

  const now = Date.now();
  const messageKey = message;

  // Get or create message cache
  if (!debugLogThrottleCache.has(messageKey)) {
    debugLogThrottleCache.set(messageKey, new Map());
  }

  const messageCache = debugLogThrottleCache.get(messageKey);

  // Create a key for the parameters using deep comparison
  const paramsKey = JSON.stringify(params, Object.keys(params).sort());

  // Check if we've seen this exact combination recently
  if (messageCache.has(paramsKey)) {
    const lastLogged = messageCache.get(paramsKey);
    if (now - lastLogged < THROTTLE_WINDOW_MS) {
      return; // Skip logging, too recent
    }
  }

  // Log the message and update cache
  console.debug(logPrefix, '[throttled]', message, params);
  messageCache.set(paramsKey, now);

  // Clean up old entries (optional optimization)
  if (messageCache.size > 100) { // Prevent memory bloat
    const cutoff = now - THROTTLE_WINDOW_MS;
    for (const [key, timestamp] of messageCache.entries()) {
      if (timestamp < cutoff) {
        messageCache.delete(key);
      }
    }
  }
};

($ => {
  $.fn.nthParent = function (n) {
    let $p = $(this);
    if (!(n > -0)) { return $(); }
    let p = 1 + n;
    while (p--) { $p = $p.parent(); }
    return $p;
  };
})(jq);


const initializePerplexityHelperHandlers = () => {
  const config = loadConfigOrDefault();
  if (!config.toggleModeHooks) {
    log('toggleModeHooks is disabled, skipping initialization and uninstalling global hook');
    PP.uninstallGlobalHook();
    return;
  }

  // Register the condition checker
  PP.registerShouldBlockEnterHandler($wrapper => hasActiveToggledTagsForCurrentContext($wrapper));

  // Register the handler for blocked enter key
  PP.registerBlockedEnterHandler(async ($textarea, $wrapper) => {
    // Flash the textarea indicator
    $textarea.removeClass(pulseFocusCls);
    $textarea.get(0).offsetHeight; // Force reflow
    $textarea.addClass(pulseFocusCls);
    setTimeout(() => $textarea.removeClass(pulseFocusCls), 400);

    // Apply toggled tags
    await applyToggledTagsOnSubmit($wrapper);
    await PP.sleep(500);

    // Find and click submit button
    const $submitBtn = PP.getSubmitButtonAnyExceptMic($wrapper);
    if ($submitBtn.length) {
      debugLog('blockedEnterInPromptAreaHandler: Clicking submit button after toggle tags', { $submitBtn, ariaLabel: $submitBtn.attr('aria-label'), dataTestId: $submitBtn.attr('data-testid') });
      $submitBtn.click();
    } else {
      debugLog('blockedEnterInPromptAreaHandler: No submit button found');
    }
  });
};



// unpkg had quite often problems, tens of seconds to load, sometime 503 fails
// const getLucideIconUrl = iconName => `https://unpkg.com/lucide-static@latest/icons/${iconName}.svg`;
const getLucideIconUrl = (iconName) => `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/${iconName}.svg`;

const getBrandIconInfo = (modelName = '', { preferBaseModelCompany = false } = {}) => {
  const normalizedModelName = modelName.toLowerCase();

  // Try to get data from perplex-plus ModelDescriptor first
  try {
    const modelDescriptor = PP?.findModelDescriptorByName?.(modelName);
    if (modelDescriptor) {
      // Determine which company and color to use based on preferBaseModelCompany setting
      const useBaseModel = preferBaseModelCompany && modelDescriptor.baseModelCompany;
      const company = useBaseModel ? modelDescriptor.baseModelCompany : modelDescriptor.company;
      const companyColor = useBaseModel ? modelDescriptor.baseModelCompanyColor : modelDescriptor.companyColor;

      // Map company names to icon names
      const companyToIcon = {
        'perplexity': 'perplexity',
        'openai': 'openai',
        'anthropic': 'claude',
        'google': 'gemini',
        'xai': 'xai',
        'deepseek': 'deepseek',
        'meta': 'meta'
      };

      const iconName = companyToIcon[company];
      // debugLog('getBrandIconInfo: Found icon for model', { modelName, preferBaseModelCompany, iconName, companyColor, modelDescriptor });
      if (iconName && companyColor) {
        return { iconName, brandColor: companyColor };
      }
    }
  } catch (error) {
    // Fallback to original logic if perplex-plus data is not available
  }

  debugLogThrottled(`getBrandIconInfo: No icon found for model. modelName = ${modelName}, preferBaseModelCompany = ${preferBaseModelCompany}`);

  // Original fallback logic
  if (normalizedModelName.includes('claude')) {
    return { iconName: 'claude', brandColor: '#D97757' };
  } else if (normalizedModelName.includes('gpt') || normalizedModelName.startsWith('o')) {
    return { iconName: 'openai', brandColor: '#FFFFFF' };
  } else if (normalizedModelName.includes('gemini')) {
    return { iconName: 'gemini', brandColor: '#1C69FF' };
  } else if (normalizedModelName.includes('sonar') || normalizedModelName.includes('best') || normalizedModelName.includes('auto')) {
    return preferBaseModelCompany ? { iconName: 'meta', brandColor: '#1D65C1' } : { iconName: 'perplexity', brandColor: '#22B8CD' };
  } else if (normalizedModelName.includes('r1')) {
    return preferBaseModelCompany ? { iconName: 'deepseek', brandColor: '#4D6BFE' } : { iconName: 'perplexity', brandColor: '#22B8CD' };
  } else if (normalizedModelName.includes('grok')) {
    return { iconName: 'xai', brandColor: '#FFFFFF' };
  } else if (normalizedModelName.includes('llama') || normalizedModelName.includes('meta')) {
    return { iconName: 'meta', brandColor: '#1D65C1' };
  } else if (normalizedModelName.includes('anthropic')) {
    return { iconName: 'anthropic', brandColor: '#F1F0E8' };
  }

  return null;
};

const getTDesignIconUrl = iconName => `https://api.iconify.design/tdesign:${iconName}.svg`;

const getLobeIconsUrl = iconName => `https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons/${iconName}.svg`;

const parseIconName = iconName => {
  if (!iconName.includes(':')) return { typePrefix: 'l', processedIconName: iconName };
  const [typePrefix, processedIconName] = iconName.split(':');
  return { typePrefix, processedIconName };
};

const getIconUrl = iconName => {
  const { typePrefix, processedIconName } = parseIconName(iconName);
  if (typePrefix === 'td') {
    return getTDesignIconUrl(processedIconName);
  }
  if (typePrefix === 'l') {
    return getLucideIconUrl(processedIconName);
  }
  throw new Error(`Unknown icon type: ${typePrefix}`);
};

const pplxHelperTag = 'pplx-helper';
const genCssName = x => `${pplxHelperTag}--${x}`;

const button = (id, icoName, title, extraClass) => `<button title="${title}" type="button" id="${id}" class="btn-helper bg-super dark:bg-superDark dark:text-backgroundDark text-white hover:opacity-80 font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-in-out font-sans  select-none items-center relative group  justify-center text-center items-center rounded-full cursor-point active:scale-95 origin-center whitespace-nowrap inline-flex text-base aspect-square h-10 ${extraClass}"  >
<div class="flex items-center leading-none justify-center gap-xs">
    ${icoName}
</div></button>`;

const upperButton = (id, icoName, title) => `
<div title="${title}" id="${id}" class="border rounded-full px-sm py-xs flex items-center gap-x-sm  border-borderMain/60 dark:border-borderMainDark/60 divide-borderMain dark:divide-borderMainDark ring-borderMain dark:ring-borderMainDark  bg-transparent cursor-pointer"><div class="border-borderMain/60 dark:border-borderMainDark/60 divide-borderMain dark:divide-borderMainDark ring-borderMain dark:ring-borderMainDark  bg-transparent"><div class="flex items-center gap-x-xs transition duration-300 select-none hover:text-superAlt light font-sans text-sm font-medium text-textOff dark:text-textOffDark selection:bg-super selection:text-white dark:selection:bg-opacity-50 selection:bg-opacity-70"><div class="">${icoName}<path fill="currentColor" d="M64 288L39.8 263.8C14.3 238.3 0 203.8 0 167.8C0 92.8 60.8 32 135.8 32c36 0 70.5 14.3 96 39.8L256 96l24.2-24.2c25.5-25.5 60-39.8 96-39.8C451.2 32 512 92.8 512 167.8c0 36-14.3 70.5-39.8 96L448 288 256 480 64 288z"></path></svg></div><div></div></div></div></div>
`;

const textButton = (id, text, title) => `
<button title="${title}" id="${id}" type="button" class="bg-super text-white hover:opacity-80 font-sans focus:outline-none outline-none transition duration-300 ease-in-out font-sans  select-none items-center relative group justify-center rounded-md cursor-point active:scale-95 origin-center whitespace-nowrap inline-flex text-sm px-sm font-medium h-8">
<div class="flex items-center leading-none justify-center gap-xs"><span class="flex items-center relative ">${text}</span></div></button>
`;
const icoColor = '#1F1F1F';
const robotIco = `<svg style="width: 23px; fill: ${icoColor};" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="m32 224h32v192h-32a31.96166 31.96166 0 0 1 -32-32v-128a31.96166 31.96166 0 0 1 32-32zm512-48v272a64.06328 64.06328 0 0 1 -64 64h-320a64.06328 64.06328 0 0 1 -64-64v-272a79.974 79.974 0 0 1 80-80h112v-64a32 32 0 0 1 64 0v64h112a79.974 79.974 0 0 1 80 80zm-280 80a40 40 0 1 0 -40 40 39.997 39.997 0 0 0 40-40zm-8 128h-64v32h64zm96 0h-64v32h64zm104-128a40 40 0 1 0 -40 40 39.997 39.997 0 0 0 40-40zm-8 128h-64v32h64zm192-128v128a31.96166 31.96166 0 0 1 -32 32h-32v-192h32a31.96166 31.96166 0 0 1 32 32z"/></svg>`;
const robotRepeatIco = `<svg style="width: 23px; fill: ${icoColor};"  viewBox="0 0 640 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/">    <path d="M442.179,325.051L442.179,459.979C442.151,488.506 418.685,511.972 390.158,512L130.053,512C101.525,511.972 78.06,488.506 78.032,459.979L78.032,238.868C78.032,203.208 107.376,173.863 143.037,173.863L234.095,173.863L234.095,121.842C234.095,107.573 245.836,95.832 260.105,95.832C274.374,95.832 286.116,107.573 286.116,121.842L286.116,173.863L309.247,173.863C321.515,245.71 373.724,304.005 442.179,325.051ZM26.011,277.905L52.021,277.905L52.021,433.968L25.979,433.968C11.727,433.968 -0,422.241 -0,407.989L-0,303.885C-0,289.633 11.727,277.905 25.979,277.905L26.011,277.905ZM468.19,331.092C478.118,332.676 488.289,333.497 498.65,333.497C505.935,333.497 513.126,333.091 520.211,332.299L520.211,407.989C520.211,422.241 508.483,433.968 494.231,433.968L468.19,433.968L468.19,331.092ZM208.084,407.958L156.063,407.958L156.063,433.968L208.084,433.968L208.084,407.958ZM286.116,407.958L234.095,407.958L234.095,433.968L286.116,433.968L286.116,407.958ZM364.147,407.958L312.126,407.958L312.126,433.968L364.147,433.968L364.147,407.958ZM214.587,303.916C214.587,286.08 199.91,271.403 182.074,271.403C164.238,271.403 149.561,286.08 149.561,303.916C149.561,321.752 164.238,336.429 182.074,336.429C182.075,336.429 182.075,336.429 182.076,336.429C199.911,336.429 214.587,321.753 214.587,303.918C214.587,303.917 214.587,303.917 214.587,303.916ZM370.65,303.916C370.65,286.08 355.973,271.403 338.137,271.403C320.301,271.403 305.624,286.08 305.624,303.916C305.624,321.752 320.301,336.429 338.137,336.429C338.138,336.429 338.139,336.429 338.139,336.429C355.974,336.429 370.65,321.753 370.65,303.918C370.65,303.917 370.65,303.917 370.65,303.916Z" style="fill-rule:nonzero;"/>
    <g transform="matrix(14.135,0,0,14.135,329.029,-28.2701)">
        <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2ZM17.19,15.94C17.15,16.03 17.1,16.11 17.03,16.18L15.34,17.87C15.19,18.02 15,18.09 14.81,18.09C14.62,18.09 14.43,18.02 14.28,17.87C13.99,17.58 13.99,17.1 14.28,16.81L14.69,16.4L9.1,16.4C7.8,16.4 6.75,15.34 6.75,14.05L6.75,12.28C6.75,11.87 7.09,11.53 7.5,11.53C7.91,11.53 8.25,11.87 8.25,12.28L8.25,14.05C8.25,14.52 8.63,14.9 9.1,14.9L14.69,14.9L14.28,14.49C13.99,14.2 13.99,13.72 14.28,13.43C14.57,13.14 15.05,13.14 15.34,13.43L17.03,15.12C17.1,15.19 17.15,15.27 17.19,15.36C17.27,15.55 17.27,15.76 17.19,15.94ZM17.25,11.72C17.25,12.13 16.91,12.47 16.5,12.47C16.09,12.47 15.75,12.13 15.75,11.72L15.75,9.95C15.75,9.48 15.37,9.1 14.9,9.1L9.31,9.1L9.72,9.5C10.01,9.79 10.01,10.27 9.72,10.56C9.57,10.71 9.38,10.78 9.19,10.78C9,10.78 8.81,10.71 8.66,10.56L6.97,8.87C6.9,8.8 6.85,8.72 6.81,8.63C6.73,8.45 6.73,8.24 6.81,8.06C6.85,7.97 6.9,7.88 6.97,7.81L8.66,6.12C8.95,5.83 9.43,5.83 9.72,6.12C10.01,6.41 10.01,6.89 9.72,7.18L9.31,7.59L14.9,7.59C16.2,7.59 17.25,8.65 17.25,9.94L17.25,11.72Z" style="fill-rule:nonzero;"/>
    </g></svg>`;

const cogIco = `<svg style="width: 23px; fill: rgb(141, 145, 145);" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"viewBox="0 0 38.297 38.297"
\t xml:space="preserve">
<g>
\t<path d="M25.311,18.136l2.039-2.041l-2.492-2.492l-2.039,2.041c-1.355-0.98-2.941-1.654-4.664-1.934v-2.882H14.63v2.883
\t\tc-1.722,0.278-3.308,0.953-4.662,1.934l-2.041-2.041l-2.492,2.492l2.041,2.041c-0.98,1.354-1.656,2.941-1.937,4.662H2.658v3.523
\t\tH5.54c0.279,1.723,0.955,3.309,1.937,4.664l-2.041,2.039l2.492,2.492l2.041-2.039c1.354,0.979,2.94,1.653,4.662,1.936v2.883h3.524
\t\tv-2.883c1.723-0.279,3.309-0.955,4.664-1.936l2.039,2.039l2.492-2.492l-2.039-2.039c0.98-1.355,1.654-2.941,1.934-4.664h2.885
\t\tv-3.524h-2.885C26.967,21.078,26.293,19.492,25.311,18.136z M16.393,30.869c-3.479,0-6.309-2.83-6.309-6.307
\t\tc0-3.479,2.83-6.308,6.309-6.308c3.479,0,6.307,2.828,6.307,6.308C22.699,28.039,19.871,30.869,16.393,30.869z M35.639,8.113v-2.35
\t\th-0.965c-0.16-0.809-0.474-1.561-0.918-2.221l0.682-0.683l-1.664-1.66l-0.68,0.683c-0.658-0.445-1.41-0.76-2.217-0.918V0h-2.351
\t\tv0.965c-0.81,0.158-1.562,0.473-2.219,0.918L24.625,1.2l-1.662,1.66l0.683,0.683c-0.445,0.66-0.761,1.412-0.918,2.221h-0.966v2.35
\t\th0.966c0.157,0.807,0.473,1.559,0.918,2.217l-0.681,0.68l1.658,1.664l0.685-0.682c0.657,0.443,1.409,0.758,2.219,0.916v0.967h2.351
\t\tv-0.968c0.807-0.158,1.559-0.473,2.217-0.916l0.682,0.68l1.662-1.66l-0.682-0.682c0.444-0.658,0.758-1.41,0.918-2.217H35.639
\t\tL35.639,8.113z M28.701,10.677c-2.062,0-3.74-1.678-3.74-3.74c0-2.064,1.679-3.742,3.74-3.742c2.064,0,3.742,1.678,3.742,3.742
\t\tC32.443,9,30.766,10.677,28.701,10.677z"/>
</g>
</svg>`;


const perplexityHelperModalId = 'perplexityHelperModal';
const getPerplexityHelperModal = () => $i(perplexityHelperModalId);

const modalSettingsTitleCls = genCssName('modal-settings-title');

const gitlabLogo = classes => `
<svg class="${classes}" fill="#000000" width="800px" height="800px" viewBox="0 0 512 512" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"><path d="M494.07,281.6l-25.18-78.08a11,11,0,0,0-.61-2.1L417.78,44.48a20.08,20.08,0,0,0-19.17-13.82A19.77,19.77,0,0,0,379.66,44.6L331.52,194.15h-152L131.34,44.59a19.76,19.76,0,0,0-18.86-13.94h-.11a20.15,20.15,0,0,0-19.12,14L42.7,201.73c0,.14-.11.26-.16.4L16.91,281.61a29.15,29.15,0,0,0,10.44,32.46L248.79,476.48a11.25,11.25,0,0,0,13.38-.07L483.65,314.07a29.13,29.13,0,0,0,10.42-32.47m-331-64.51L224.8,408.85,76.63,217.09m209.64,191.8,59.19-183.84,2.55-8h86.52L300.47,390.44M398.8,59.31l43.37,134.83H355.35M324.16,217l-43,133.58L255.5,430.14,186.94,217M112.27,59.31l43.46,134.83H69M40.68,295.58a6.19,6.19,0,0,1-2.21-6.9l19-59L197.08,410.27M470.34,295.58,313.92,410.22l.52-.69L453.5,229.64l19,59a6.2,6.2,0,0,1-2.19,6.92"/></svg>
`;

const modalLargeIconAnchorClasses = 'hover:scale-110 opacity-50 hover:opacity-100 transition-all duration-300';

const modalTabGroupTabsCls = genCssName('modal-tab-group-tabs');
const modalTabGroupActiveCls = genCssName('modal-tab-group-active');
const modalTabGroupContentCls = genCssName('modal-tab-group-content');
const modalTabGroupSeparatorCls = genCssName('modal-tab-group-separator');

const modalHTML = `
<div id="${perplexityHelperModalId}" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <h1 class="flex items-center gap-4">
      <span class="mr-4 ${modalSettingsTitleCls}">Perplexity Helper</span>
      <a href="https://gitlab.com/Tiartyos/perplexity-helper"
        target="_blank" title="GitLab Repository"
        class="${modalLargeIconAnchorClasses}"
      >
        ${gitlabLogo('w-8 h-8 invert')}
      </a>
      <a href="https://tiartyos.gitlab.io/perplexity-helper/"
        target="_blank" title="Web Page"
        class="${modalLargeIconAnchorClasses}"
      >
        <img src="${getLucideIconUrl('globe')}" class="w-8 h-8 invert">
      </a>
    </h1>
    <p class="text-xs opacity-30 mt-1 mb-3">Changes may require page refresh.</p>
    <div class="${modalTabGroupTabsCls}">
    </div>
    <hr class="!mt-0 !mb-0 ${modalTabGroupSeparatorCls}">
  </div>
</div>
`;

const tagsContainerCls = genCssName('tags-container');
const tagContainerCompactCls = genCssName('tag-container-compact');
const tagContainerWiderCls = genCssName('tag-container-wider');
const tagContainerWideCls = genCssName('tag-container-wide');
const tagContainerExtraWideCls = genCssName('tag-container-extra-wide');
const threadTagContainerCls = genCssName('thread-tag-container');
const newTagContainerCls = genCssName('new-tag-container');
const newTagContainerInCollectionCls = genCssName('new-tag-container-in-collection');
const tagCls = genCssName('tag');
const tagDarkTextCls = genCssName('tag-dark-text');
const tagIconCls = genCssName('tag-icon');
const tagPaletteCls = genCssName('tag-palette');
const tagPaletteItemCls = genCssName('tag-palette-item');
const tagTweakNoBorderCls = genCssName('tag-tweak-no-border');
const tagTweakSlimPaddingCls = genCssName('tag-tweak-slim-padding');
const tagsPreviewCls = genCssName('tags-preview');
const tagsPreviewNewCls = genCssName('tags-preview-new');
const tagsPreviewThreadCls = genCssName('tags-preview-thread');
const tagsPreviewNewInCollectionCls = genCssName('tags-preview-new-in-collection');
const tagTweakTextShadowCls = genCssName('tag-tweak-text-shadow');
const tagFenceCls = genCssName('tag-fence');
const tagAllFencesWrapperCls = genCssName('tag-all-fences-wrapper');
const tagRestOfTagsWrapperCls = genCssName('tag-rest-of-tags-wrapper');
const tagFenceContentCls = genCssName('tag-fence-content');
const tagDirectoryCls = genCssName('tag-directory');
const tagDirectoryContentCls = genCssName('tag-directory-content');
const helpTextCls = genCssName('help-text');
const queryBoxCls = genCssName('query-box');
const controlsAreaCls = genCssName('controls-area');
const textAreaCls = genCssName('text-area');
const standardButtonCls = genCssName('standard-button');
const lucideIconParentCls = genCssName('lucide-icon-parent');
const roundedMD = genCssName('rounded-md');
const leftPanelSlimCls = genCssName('left-panel-slim');
const modelIconButtonCls = genCssName('model-icon-button');
const modelLabelCls = genCssName('model-label');
const modelLabelStyleJustTextCls = genCssName('model-label-style-just-text');
const modelLabelStyleButtonSubtleCls = genCssName('model-label-style-button-subtle');
const modelLabelStyleButtonWhiteCls = genCssName('model-label-style-button-white');
const modelLabelStyleButtonCyanCls = genCssName('model-label-style-button-cyan');
const modelLabelOverwriteCyanIconToGrayCls = genCssName('model-label-overwrite-cyan-icon-to-gray');
const modelLabelRemoveCpuIconCls = genCssName('model-label-remove-cpu-icon');
const reasoningModelCls = genCssName('reasoning-model');
const modelLabelLargerIconsCls = genCssName('model-label-larger-icons');
const notReasoningModelCls = genCssName('not-reasoning-model');
const modelIconCls = genCssName('model-icon');
const iconColorCyanCls = genCssName('icon-color-cyan');
const iconColorGrayCls = genCssName('icon-color-gray');
const iconColorWhiteCls = genCssName('icon-color-white');
const iconColorPureWhiteCls = genCssName('icon-color-pure-white');
const errorIconCls = genCssName('error-icon');
const customJsAppliedCls = genCssName('customJsApplied');
const customCssAppliedCls = genCssName('customCssApplied');
const customWidgetsHtmlAppliedCls = genCssName('customWidgetsHtmlApplied');
const sideMenuHiddenCls = genCssName('side-menu-hidden');
const sideMenuLabelsHiddenCls = genCssName('side-menu-labels-hidden');
const topSettingsButtonId = genCssName('settings-button-top');
const leftSettingsButtonId = genCssName('settings-button-left');
const leftSettingsButtonWrapperId = genCssName('settings-button-left-wrapper');
const leftMarginOfThreadContentStylesId = genCssName('left-margin-of-thread-content-styles');
const enhancedSubmitButtonCls = genCssName('enhanced-submit-button');
const enhancedSubmitButtonPhTextCls = genCssName('enhanced-submit-button-ph-text');
const enhancedSubmitButtonActiveCls = genCssName('enhanced-submit-button-active');
const promptAreaKeyListenerCls = genCssName('prompt-area-key-listener');
const promptAreaKeyListenerIndicatorCls = genCssName('prompt-area-key-listener-indicator');
const pulseFocusCls = genCssName('pulse-focus');
const modelSelectionListItemsSemiHideCls = genCssName('model-selection-list-items-semi-hide');
const hideUpgradeToMaxAdsCls = genCssName('hide-upgrade-to-max-ads');
const hideUpgradeToMaxAdsSemiHideCls = genCssName('hide-upgrade-to-max-ads-semi-hide');
const extraSpaceBellowLastAnswerCls = genCssName('extra-space-bellow-last-answer');
const quickProfileButtonCls = genCssName('quick-profile-button');
const quickProfileButtonActiveCls = genCssName('quick-profile-button-active');
const quickProfileButtonDisabledCls = genCssName('quick-profile-button-disabled');
const removeUploadedFilesAllButtonCls = genCssName('remove-uploaded-files-all-button');
const removeUploadedFilesAllButtonWrapperCls = genCssName('remove-uploaded-files-all-button-wrapper');

// Tag editor (experimental)
const tagEditorWrapperId = genCssName('tag-editor-wrapper');
const tagEditorOpenButtonId = genCssName('tag-editor-open');
const tagEditorTableCls = genCssName('tag-editor-table');
const tagEditorRowCls = genCssName('tag-editor-row');

const cyanPerplexityColor = '#1fb8cd';
const cyanMediumPerplexityColor = '#204b51';
const cyanDarkPerplexityColor = '#203133';
const cyanVeryDarkPerplexityColor = '#0a2527';

const grayPerplexityColor = '#1f2121';
const grayLightPerplexityColor = '#90908f';
const grayDarkPerplexityColor = '#191a1a';


const extraSpaceBellowLastAnswerContent = ('⸬  '.repeat(6) + '\\A').repeat(2);

const styles = `
.textarea_wrapper {
  display: flex;
  flex-direction: column;
}

@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600&display=swap');

.textarea_wrapper > textarea {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 0.4em 0.6em;
  border-radius: 0.5em;
}

.textarea_label {
}

.${helpTextCls} {
  background-color: #225;
  padding: 0.3em 0.7em;
  border-radius: 0.5em;
  margin: 1em 0;
}
.${helpTextCls} {
  cursor: text;
}

.${helpTextCls} a {
  text-decoration: underline;
}
.${helpTextCls} a:hover {
  color: white;
}

.${helpTextCls} code {
  font-size: 80%;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.3em;
  padding: 0.1em;
}
.${helpTextCls} pre > code {
  background: none;
}
.${helpTextCls} pre {
  font-size: 80%;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.3em;
  padding: 0.1em 1em;
}
.${helpTextCls} li {
  list-style: circle;
  margin-left: 1em;
}
.${helpTextCls} hr {
  margin: 1em 0 0.5em 0;
  border-color: rgba(255, 255, 255, 0.1);
}

.${helpTextCls} table {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5em;
  display: inline-block;
}
.${helpTextCls} table td, .${helpTextCls} table th {
  padding: 0.1em 0.5em;
}

.btn-helper {
margin-left: 20px
}

.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.8)
}

.modal-content {
  display: flex;
  margin: 1em auto;
  width: calc(100vw - 2em);
  padding: 20px;
  border: 1px solid #333;
  background: linear-gradient(135deg, #151517, #202025);
  border-radius: 6px;
  color: rgb(206, 206, 210);
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  cursor: default;
  font-family: 'Fira Sans', sans-serif;
}

.${modalTabGroupTabsCls} {
  display: flex;
  flex-direction: row;
}

.modal-content .${modalTabGroupTabsCls} > button {
  border-radius: 0.5em 0.5em 0 0;
  border-bottom: 0;
  padding: 0.2em 0.5em 0 0.5em;
  background-color: #1e293b;
  color: rgba(255, 255, 255, 0.5);
  outline-bottom: none;
  white-space: nowrap;
}

.modal-content .${modalTabGroupTabsCls} > button.${modalTabGroupActiveCls} {
  /* background-color: #3b82f6; */
  color: white;
  text-shadow: 0 0 1px currentColor;
  padding: 0.3em 0.5em 0.2em 0.5em;
}

.modal-content .${modalTabGroupContentCls} {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding-top: 1em;
}

.${modalSettingsTitleCls} {
  background: linear-gradient(to bottom, white, gray);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  font-size: 3em;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  user-select: none;
  margin-top: -0.33em;
  margin-bottom: -0.33em;
}

.${modalSettingsTitleCls} .animate-letter {
  display: inline-block;
  background: inherit;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: transform 0.3s ease-out;
}

.${modalSettingsTitleCls} .animate-letter.active {
  /* Move and highlight on active */
  transform: translateY(-10px) rotate(5deg);
  -webkit-text-fill-color: #4dabff;
  text-shadow: 0 0 5px #4dabff, 0 0 10px #4dabff;
}

.modal-content .hover\\:scale-110:hover {
  transform: scale(1.1);
}

.modal-content label {
  padding-right: 10px;
}

.modal-content hr {
  height: 1px;
  margin: 1em 0;
  border-color: rgba(255, 255, 255, 0.1);
}

.modal-content hr.${modalTabGroupSeparatorCls} {
  margin: 0 -1em 0 -1em;
}

.modal-content input[type="checkbox"] {
  appearance: none;
  width: 1.2em;
  height: 1.2em;
  border: 2px solid #ffffff80;
  border-radius: 0.25em;
  background-color: transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.modal-content input[type="checkbox"]:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.modal-content input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0.4em;
  height: 0.7em;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: translate(-50%, -60%) rotate(45deg);
}

.modal-content input[type="checkbox"]:hover {
  border-color: #ffffff;
}

.modal-content input[type="checkbox"]:focus {
  outline: 2px solid #3b82f680;
  outline-offset: 2px;
}

.modal-content .checkbox_label {
  color: white;
  line-height: 1.5;
}

.modal-content .checkbox_wrapper {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.modal-content .number_label {
  margin-left: 0.5em;
}

.modal-content .color_wrapper {
  display: flex;
  align-items: center;
}

.modal-content .color_label {
  margin-left: 0.5em;
}

.modal-content input, .modal-content button {
  background-color: #1e293b;
  border: 2px solid #ffffff80;
  border-radius: 0.5em;
  color: white;
  padding: 0.5em;
  transition: border-color 0.3s ease, outline 0.3s ease;
}

.modal-content input:hover, .modal-content button:hover {
  border-color: #ffffff;
}

.modal-content input:focus, .modal-content button:focus {
  outline: 2px solid #3b82f680;
  outline-offset: 2px;
}

.modal-content input[type="number"] {
  padding: 0.5em;
  transition: border-color 0.3s ease, outline 0.3s ease;
}

.modal-content input[type="color"] {
  padding: 0;
  height: 2em;
}

.modal-content input[type="color"]:hover {
  border-color: #ffffff;
}

.modal-content input[type="color"]:focus {
  outline: 2px solid #3b82f680;
  outline-offset: 2px;
}

.modal-content h1 + hr {
  margin-top: 0.5em;
}


.modal-content select {
  appearance: none;
  background-color: #1e293b; /* Dark blue background */
  border: 2px solid #ffffff80;
  border-radius: 0.5em;
  padding: 0.3em 2em 0.3em 0.5em;
  color: white;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.2s ease;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5em center;
  background-size: 1.2em;
}

.modal-content select option {
  background-color: #1e293b; /* Match select background */
  color: white;
  padding: 0.5em;
}

.modal-content select:hover {
  border-color: #ffffff;
}

.modal-content select:focus {
  outline: 2px solid #3b82f680;
  outline-offset: 2px;
}

.modal-content .select_label {
  color: white;
  margin-left: 0.5em;
}

.modal-content .select_wrapper {
  display: flex;
  align-items: center;
}

.close {
  color: rgb(206, 206, 210);
  float: right;
  font-size: 28px;
  font-weight: bold;
  position: absolute;
  right: 20px;
  top: 5px;
}

.close:hover,
.close:focus {
  color: white;
  text-decoration: none;
  cursor: pointer;
}

#copied-modal,#copied-modal-2 {
  padding: 5px 5px;
  background:gray;
  position:absolute;
  display: none;
  color: white;
  font-size: 15px;
}

label > div.select-none {
  user-select: text;
  cursor: initial;
}

.${tagsContainerCls} {
  display: flex;
  flex-direction: row;
  margin: 5px 0;
}
.${tagsContainerCls}.${threadTagContainerCls} {
  margin-left: 0.5em;
  margin-right: 0.5em;
  margin-bottom: 2px;
}

.${tagContainerCompactCls} {
  margin-top: -2em;
  margin-bottom: 1px;
}
.${tagContainerCompactCls} .${tagFenceCls} {
  margin: 0;
  padding: 1px;
}
.${tagContainerCompactCls} .${tagCls} {
}
.${tagContainerCompactCls} .${tagAllFencesWrapperCls} {
  gap: 1px;
}
.${tagContainerCompactCls} .${tagRestOfTagsWrapperCls} {
  margin: 1px;
}
.${tagContainerCompactCls} .${tagRestOfTagsWrapperCls},
.${tagContainerCompactCls} .${tagFenceContentCls},
.${tagContainerCompactCls} .${tagDirectoryContentCls} {
  gap: 1px;
}

.${removeUploadedFilesAllButtonWrapperCls} {
  position: relative;
}
.${removeUploadedFilesAllButtonCls} {
  position: absolute;
  left: 0;
  top: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 24px;
  aspect-ratio: 1 / 1;
  border-radius: 9999px;
  background: ${grayPerplexityColor};
  opacity: 0.5;
  color: #9ca3af;
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, transform 150ms ease, opacity 150ms ease;
}
.${removeUploadedFilesAllButtonCls}:hover {
  color: #e5e7eb;
  background: rgba(255,255,255,0.2);
  opacity: 1;
}
.${removeUploadedFilesAllButtonCls}:active {
  transform: scale(0.97);
}

.${tagContainerWiderCls} {
  margin-left: -6em;
  margin-right: -6em;
}
.${tagContainerWiderCls} .${tagCls} {
}

.${tagContainerWideCls} {
  margin-left: -12em;
  margin-right: -12em;
}

.${tagContainerExtraWideCls} {
  margin-left: -16em;
  margin-right: -16em;
  max-width: 100vw;
}

.${tagsContainerCls} {
  @media (max-width: 768px) {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}


.${tagCls} {
  border: 1px solid #3b3b3b;
  background-color: #282828;
  /*color: rgba(255, 255, 255, 0.482);*/ /* equivalent of #909090; when on #282828 background */
  padding: 0px 8px 0 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  display: inline-block;
  color: #E8E8E6;
  user-select: none;
}
.${tagCls}.${tagDarkTextCls} {
  color: #171719;
}
.${tagCls} span {
  display: inline-block;
}

.${tagCls}.${tagTweakNoBorderCls} {
  border: none;
}

.${tagCls}.${tagTweakSlimPaddingCls} {
  padding: 0px 4px 0 4px;
}

.${tagCls} .${tagIconCls} {
  width: 16px;
  height: 16px;
  margin-right: 2px;
  margin-left: -4px;
  margin-top: -4px;
  vertical-align: middle;
  display: inline-block;
  filter: invert(1);
}
.${tagCls}.${tagDarkTextCls} .${tagIconCls} {
  filter: none;
}
.${tagCls}.${tagTweakSlimPaddingCls} .${tagIconCls} {
  margin-left: -2px;
}
.${tagCls} span {
  position: relative;
  top: 1.5px;
}
.${tagCls}.${tagTweakTextShadowCls} span {
  text-shadow: 1px 0 0.5px black, -1px 0 0.5px black, 0 1px 0.5px black, 0 -1px 0.5px black;
}
.${tagCls}.${tagTweakTextShadowCls}.${tagDarkTextCls} span {
  text-shadow: 1px 0 0.5px white, -1px 0 0.5px white, 0 1px 0.5px white, 0 -1px 0.5px white;
}
.${tagCls}:hover {
  background-color: #333;
  color: #fff;
  transform: scale(1.02);
}
.${tagCls}.${tagDarkTextCls}:hover {
  /* color: #171717; */
  color: #2f2f2f;
}
.${tagCls}:active {
  transform: scale(0.98);
}

.${tagPaletteCls} {
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
}
.${tagPaletteCls} .${tagPaletteItemCls} {
  text-shadow: 1px 0 1px black, -1px 0 1px black, 0 1px 1px black, 0 -1px 1px black;
  width: 40px;
  height: 25px;
  display: inline-block;
  text-align: center;
  padding: 0 2px;
  transition: color 0.2s, border 0.1s;
  border: 2px solid transparent;
}

.${tagPaletteItemCls}:hover {
  cursor: pointer;
  color: white;
  border: 2px solid white;
}

.${tagsPreviewCls} {
  background-color: #191a1a;
  padding: 0.5em 1em;
  border-radius: 1em;
}

/* Tag editor styles */
.${tagEditorTableCls} th, .${tagEditorTableCls} td { border-bottom: 1px solid rgba(255,255,255,0.08); padding: 4px; }
#${tagEditorWrapperId} { background: rgba(255,255,255,0.02); padding: 8px; border-radius: 8px; }

.${tagAllFencesWrapperCls} {
  display: flex;
  flex-direction: row;
  gap: 5px;
}

.${tagRestOfTagsWrapperCls} {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 5px;
  margin: 8px;
}

.${tagFenceCls} {
  display: flex;
  margin: 5px 0;
  padding: 5px;
  border-radius: 4px;
}

.${tagFenceContentCls} {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 5px;
}

.${tagDirectoryCls} {
  position: relative;
  display: flex;
  z-index: 100;
}
.${tagDirectoryCls}:hover .${tagDirectoryContentCls} {
  display: flex;
}
.${tagDirectoryContentCls} {
  position: absolute;
  display: none;
  flex-direction: column;
  gap: 5px;
  top: 0px;
  padding-bottom: 1px;
  left: -5px;
  transform: translateY(-100%);
  background: rgba(0, 0, 0, 0.5);
  padding: 5px;
  border-radius: 4px;
  flex-wrap: nowrap;
  width: max-content;
}
.${tagDirectoryContentCls} .${tagCls} {
  white-space: nowrap;
  width: fit-content;
}

.${queryBoxCls} {
  flex-wrap: wrap;
}

.${controlsAreaCls} {
  grid-template-columns: repeat(4,minmax(0,1fr))
}

.${textAreaCls} {
  grid-column-end: 5;
}

.${standardButtonCls} {
  grid-column-start: 4;
}

.${roundedMD} {
  border-radius: 0.375rem!important;
}

#${leftSettingsButtonId} svg {
  transition: fill 0.2s;
}
#${leftSettingsButtonId}:hover svg {
  fill: #fff !important;
}

.w-collapsedSideBarWidth #${leftSettingsButtonId} span {
  display: none;
}

.w-collapsedSideBarWidth #${leftSettingsButtonId} {
  width: 100%;
  border-radius: 0.25rem;
  height: 40px;
}

#${leftSettingsButtonWrapperId} {
  display: flex;
  padding: 0.1em 0.2em;
  justify-content: flex-start;
}

.w-collapsedSideBarWidth #${leftSettingsButtonWrapperId} {
  justify-content: center;
}

.${lucideIconParentCls} > img {
  transition: opacity 0.2s ease;
}

.${lucideIconParentCls}:hover > img, a.dark\\:text-textMainDark .${lucideIconParentCls} > img {
  opacity: 1;
}

.${leftPanelSlimCls} .pt-sm > * {
  padding: 0.2rem 0 !important;
}

.${leftPanelSlimCls} {
  max-width: 45px !important;
}

.${leftPanelSlimCls} > .py-md {
  margin-left: -0.1em;
}

.${leftPanelSlimCls} > .py-md > div.flex-col > * {
/*   background: red; */
  margin-right: 0;
  max-width: 40px;
}

.${modelLabelCls} {
  color: #888;
  /* padding is from style attr */
  transition: color 0.2s, background-color 0.2s, border 0.2s;
/*
  margin-right: 0.5em;
  margin-left: 0.5em;
*/
  padding-top: 3px;
  /*margin-right: 0.5em;*/
}
button.${modelIconButtonCls} {
  padding-right: 1.0em;
  padding-left: 1.0em;
  gap: 5px;
}
button:hover > .${modelLabelCls} {
  color: #fff;
}
button.${modelIconButtonCls} > .min-w-0 {
  min-width: 16px;
  margin-right: 0.0em;
}
button.${modelLabelRemoveCpuIconCls} {
/*  margin-left: 0.5em; */
/*  padding-left: 0.5em; */
  padding-right: 1.25em;
}
.${modelIconCls} {
  width: 16px;
  min-width: 16px;
  height: 16px;
  margin-right: 2px;
  margin-left: 0;
  margin-top: -0px;
  opacity: 0.5;
  transition: opacity 0.2s;
}
button.${modelLabelLargerIconsCls} .${modelIconCls} {
  transform: scale(1.2);
}
button:hover .${modelIconCls} {
  opacity: 1;
}
button.${modelLabelRemoveCpuIconCls} .${modelLabelCls} {
  /*margin-right: 0.5em; */
}
button.${modelLabelRemoveCpuIconCls}:has(.${reasoningModelCls}) .${modelLabelCls} {
  /*margin-right: 0.5em; */
}
button.${modelLabelRemoveCpuIconCls}.${notReasoningModelCls} .${modelLabelCls} {
  /* margin-right: 0.0em; */
}
.${modelLabelRemoveCpuIconCls} div:has(div > svg.tabler-icon-cpu) {
  display: none;
}

button:has(> .${modelLabelCls}.${modelLabelStyleButtonSubtleCls}) {
  border: 1px solid #333;
}
button:hover:has(> .${modelLabelCls}.${modelLabelStyleButtonSubtleCls}) {
  background: #333 !important;
}
/* Apply style even if the span is empty */
button.${modelIconButtonCls}:has(> .${modelLabelCls}.${modelLabelStyleButtonSubtleCls}:empty) {
  border: 1px solid #333;
}
button.${modelIconButtonCls}:has(> .${modelLabelCls}.${modelLabelStyleButtonSubtleCls}:empty):hover {
  background: #333 !important;
}

.${modelLabelCls}.${modelLabelStyleButtonWhiteCls} {
  color: #8D9191 !important;
}
button:hover > .${modelLabelCls}.${modelLabelStyleButtonWhiteCls} {
  color: #fff !important;
}
.${modelIconButtonCls} svg[stroke] {
  stroke: #8D9191 !important;
}
.${modelIconButtonCls}:hover svg[stroke] {
  stroke: #fff !important;
}
button:has(> .${modelLabelCls}.${modelLabelStyleButtonWhiteCls}) {
  background: #191A1A !important;
  color: #2D2F2F !important;
}
button:has(> .${modelLabelCls}.${modelLabelStyleButtonWhiteCls}):hover {
  color: #8D9191 !important;
}
/* Apply style even if the span is empty */
button.${modelIconButtonCls}:has(> .${modelLabelCls}.${modelLabelStyleButtonWhiteCls}:empty) {
  background: #191A1A !important;
  color: #2D2F2F !important;
}
button.${modelIconButtonCls}:has(> .${modelLabelCls}.${modelLabelStyleButtonWhiteCls}:empty):hover {
  color: #8D9191 !important;
}

.${modelLabelCls}.${modelLabelStyleButtonCyanCls} {
  color: ${cyanPerplexityColor};
}
button:has(> .${modelLabelCls}.${modelLabelStyleButtonCyanCls}) {
  border: 1px solid ${cyanMediumPerplexityColor};
  background: ${cyanDarkPerplexityColor} !important;
}
button:hover:has(> .${modelLabelCls}.${modelLabelStyleButtonCyanCls}) {
  border: 1px solid ${cyanPerplexityColor};
}
/* Apply style even if the span is empty */
button.${modelIconButtonCls}:has(> .${modelLabelCls}.${modelLabelStyleButtonCyanCls}:empty) {
  border: 1px solid ${cyanMediumPerplexityColor};
  background: ${cyanDarkPerplexityColor} !important;
}
button.${modelIconButtonCls}:has(> .${modelLabelCls}.${modelLabelStyleButtonCyanCls}:empty):hover {
  border: 1px solid ${cyanPerplexityColor};
}
.${modelIconButtonCls}:has(> .${modelLabelCls}.${modelLabelStyleButtonCyanCls}) svg[stroke] {
  stroke: ${cyanPerplexityColor} !important;
}
.${modelIconButtonCls}:has(> .${modelLabelCls}.${modelLabelStyleButtonCyanCls}):hover svg[stroke] {
  stroke: #fff !important;
}

button:has(> .${modelLabelCls}.${modelLabelOverwriteCyanIconToGrayCls}) {
  color: #888 !important;
}
button:has(> .${modelLabelCls}.${modelLabelOverwriteCyanIconToGrayCls}):hover {
  color: #fff !important;
}

.${reasoningModelCls} {
  width: 16px;
  height: 16px;
/*
  margin-right: 2px;
  margin-left: 2px;
  margin-top: -2px;
 */
  filter: invert();
  opacity: 0.5;
  transition: opacity 0.2s;
}
button.${modelLabelLargerIconsCls} .${reasoningModelCls} {
  transform: scale(1.2);
}
button:hover .${reasoningModelCls} {
  opacity: 1;
}

div[ph-processed-custom-model-popover] :is(.${modelIconCls}, .${reasoningModelCls}) {
  opacity: 1;
}

.${errorIconCls} {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  margin-left: 4px;
  margin-top: -0px;
  opacity: 0.75;
  transition: opacity 0.2s;
}
button.${modelLabelLargerIconsCls} .${errorIconCls} {
  transform: scale(1.2);
}
button:hover .${errorIconCls} {
  opacity: 1;
}
/* button:has(.${reasoningModelCls}) > div > div > svg {
  width: 32px;
  height: 16px;
  margin-left: 8px;
  margin-right: 12px;
  margin-top: 0px;
  min-width: 16px;
  background-color: cyan;
}
button:has(.${reasoningModelCls}) > div > div:has(svg) {
  width: 16px;
  height: 16px;
  min-width: 30px;
  background-color: purple;
} */


.${iconColorCyanCls} {
  filter: invert(54%) sepia(84%) saturate(431%) hue-rotate(139deg) brightness(97%) contrast(90%);
  transition: filter 0.2s;
}

button:hover:has(> .${modelLabelCls}.${modelLabelStyleButtonCyanCls}) .${iconColorCyanCls} {
  filter: invert(100%);
}

.${iconColorGrayCls} {
  filter: invert(100%);
  opacity: 0.5;
  transition: filter 0.2s;
}
button:has(.${reasoningModelCls}):hover .${iconColorGrayCls} {
  filter: invert(100%);
}

.${iconColorPureWhiteCls} {
  filter: invert(100%);
}

.${iconColorWhiteCls} {
  filter: invert(50%);
  transition: filter 0.2s;
}
button:has(.${reasoningModelCls}):hover .${iconColorWhiteCls} {
  filter: invert(100%);
}


.${sideMenuHiddenCls} {
  display: none;
}

.${sideMenuLabelsHiddenCls} .p-sm > .font-sans.text-2xs,
.${sideMenuLabelsHiddenCls} .min-w-0.pb-sm .font-sans.text-2xs {
  display: none;
}


.${enhancedSubmitButtonCls} {
  position: absolute;
  top: 0;
  left: 0;
  width: 101%;
  height: 101%;
  border-radius: inherit;
  cursor: pointer;
  background: transparent;
  box-shadow: 0 0 0 1px transparent;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(1.1);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: visible;
  pointer-events: none;
}

/* ISSUE: Using hard-coded 'active' class here instead of enhancedSubmitButtonActiveCls */
.${enhancedSubmitButtonCls}.active {
  opacity: 0.5;
  transform: scale(1);
  pointer-events: auto;
  box-shadow: 0 0 0 1px cyan inset;
}

.${enhancedSubmitButtonCls}:hover {
  opacity: 1;
  background: radial-gradient(circle at right top, rgb(23, 8, 56), rgb(4, 2, 12));
}

.${enhancedSubmitButtonCls}::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: transparent;
  z-index: -1;
  box-shadow: 0 0 0 1.2px transparent;
  border-radius: inherit;
  transition: opacity 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
  opacity: 0;
}

/* ISSUE: Using hard-coded 'active' class here instead of enhancedSubmitButtonActiveCls */
.${enhancedSubmitButtonCls}.active::before {
  opacity: 0.9;
  box-shadow: 0 0 0 1.2px #00ffff;
  animation: gradientBorder 3s ease infinite;
}

.${enhancedSubmitButtonCls}:hover::before {
  opacity: 1;
}

@keyframes gradientBorder {
  0% { box-shadow: 0 0 0 1.2px rgba(0, 255, 255, 0.6); }
  50% { box-shadow: 0 0 0 1.2px rgba(0, 255, 255, 1), 0 0 8px rgba(0, 255, 255, 0.6); }
  100% { box-shadow: 0 0 0 1.2px rgba(0, 255, 255, 0.6); }
}

@keyframes pulseIndicator {
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.5); opacity: 1; }
  100% { transform: scale(1); opacity: 0.6; }
}

.${enhancedSubmitButtonPhTextCls} {
  font-family: 'JetBrains Mono', monospace;
  color: #00c1ff;
  display: none;
  position: absolute;
  font-size: 20px;
  user-select: none;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.${enhancedSubmitButtonCls}:hover .${enhancedSubmitButtonPhTextCls} {
  display: flex;
}

/* Prompt area with active toggle tags */
textarea.${promptAreaKeyListenerCls},
div[contenteditable].${promptAreaKeyListenerCls} { // @stupid cursor apply model. ${promptAreaKeyListenerCls} <- correct. no bracket!
  box-shadow: 0 0 0 1px rgba(31, 184, 205, 0.2), 0 0px 0px rgba(31, 184, 205, 0);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-color: rgba(31, 184, 205, 0.2);
  position: relative;
  background-image: linear-gradient(to bottom, rgba(31, 184, 205, 0.03), transparent);
}

/* Nice glow effect when focused */
textarea.${promptAreaKeyListenerCls}:focus,
div[contenteditable].${promptAreaKeyListenerCls}:focus {
  box-shadow: 0 0 0 1px rgba(31, 184, 205, 0.5), 0 0 8px 1px rgba(31, 184, 205, 0.3);
  border-color: rgba(31, 184, 205, 0.5);
  background-image: linear-gradient(to bottom, rgba(31, 184, 205, 0.05), transparent);
}

/* Active indicator for textarea */
.${promptAreaKeyListenerIndicatorCls} {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: rgba(31, 184, 205, 0.6);
  z-index: 5;
  pointer-events: none;
  box-shadow: 0 0 4px 1px rgba(31, 184, 205, 0.4);
  animation: pulseIndicator 2s ease-in-out infinite;
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* When actually visible, override initial zero values */
.${promptAreaKeyListenerIndicatorCls}.visible {
  opacity: 1;
  transform: scale(1);
}

/* Pulse focus effect when Enter is pressed */
textarea.${pulseFocusCls},
div[contenteditable].${pulseFocusCls} {  // @ stupid cursor apply model. ${pulseFocusCls} <- correct. no bracket!
  box-shadow: 0 0 0 2px rgba(31, 184, 205, 0.8), 0 0 12px 4px rgba(31, 184, 205, 0.6) !important;
  border-color: rgba(31, 184, 205, 0.8) !important;
  transition: none !important;
}

/* Semi-hide model selection list items with hover effect */
.${modelSelectionListItemsSemiHideCls} {
  opacity: 0.3;
  transition: opacity 0.2s ease-in-out;
}

.${modelSelectionListItemsSemiHideCls}:hover {
  opacity: 1;
}

/* Hide upgrade to max ads */
.${hideUpgradeToMaxAdsCls} {
  display: none !important;
}

.${hideUpgradeToMaxAdsSemiHideCls} {
  opacity: 0.3;
  transition: opacity 0.2s ease-in-out;
}

.${hideUpgradeToMaxAdsSemiHideCls}:hover {
  opacity: 1;
}

.${extraSpaceBellowLastAnswerCls} {
  padding-bottom: 7.5em;
}
.${extraSpaceBellowLastAnswerCls}::after {
  content: '${extraSpaceBellowLastAnswerContent}';
  white-space: pre;
  opacity: 0.02;
  font-size: 5em;
  justify-content: center;
  align-items: top;
  display: flex;
  min-height: 1em;
  margin-bottom: -1em;
  transition: opacity 5.0s ease-in-out;
  pointer-events: none;
  overflow: hidden;
}

.${extraSpaceBellowLastAnswerCls}:hover::after {
  opacity: 0.1;
}

/* Using class, because perplexity historically had multiple prompt areas */
.${quickProfileButtonCls} {
  box-sizing: border-box;
  border: 1px solid transparent;
  background-color: ${grayDarkPerplexityColor};
  border-radius: 25%;
  width: 2.25em;
  height: 2.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transform: scale(1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
  margin: 0;
  padding: 0;
}

.${quickProfileButtonCls}.${quickProfileButtonDisabledCls} {
  opacity: 0.25;
  cursor: not-allowed;
  border-color: ${grayDarkPerplexityColor};
  background-color: ${grayDarkPerplexityColor};
}

.${quickProfileButtonCls}.${quickProfileButtonActiveCls} {
  background-color: ${cyanVeryDarkPerplexityColor};
  border-color: ${cyanMediumPerplexityColor};
}

.${quickProfileButtonCls}.${quickProfileButtonActiveCls} > img {
  opacity: 0.9;
  filter: brightness(0) saturate(100%) invert(58%) sepia(59%) saturate(480%) hue-rotate(137deg) brightness(95%) contrast(94%);
}

.${quickProfileButtonCls}:hover:not(.${quickProfileButtonDisabledCls}) {
  border-color: ${cyanPerplexityColor};
}

.${quickProfileButtonCls}:active:not(.${quickProfileButtonDisabledCls}) {
  transform: scale(0.97) translateY(1px);
  box-shadow: 0 0 0 0.5px ${cyanPerplexityColor};
}

.${quickProfileButtonCls} > img {
  width: 1.0em;
  height: 1.0em;
  filter: invert(1);
  opacity: 0.5;
  transition: opacity 0.2s ease-in-out, filter 0.2s ease-in-out;
}

.${quickProfileButtonCls}:hover > img {
  opacity: 1;
}
`;

const TAG_POSITION = {
  BEFORE: 'before',
  AFTER: 'after',
  CARET: 'caret',
  WRAP: 'wrap',
};

const TAG_CONTAINER_TYPE = {
  NEW: 'new',
  NEW_IN_COLLECTION: 'new-in-collection',
  THREAD: 'thread',
  ALL: 'all',
};

const tagsHelpText = `
Each line is one tag.
Non-field text is what will be inserted into prompt.
Field is denoted by \`<\` and \`>\`, field name is before \`:\`, field value after \`:\`.

Supported fields:
- \`label\`: tag label shown on tag "box" (new items around prompt input area)
- \`position\`: where the tag text will be inserted, default is \`before\`; valid values are \`before\`/\`after\` (existing text) or \`caret\` (at cursor position) or \`wrap\` (wrap text around \`$$wrap$$\` marker)
- \`color\`: tag color; CSS colors supported, you can use colors from a pre-generated palette via \`%\` syntax, e.g. \`<color:%5>\`. See palette bellow.
- \`tooltip\`: shown on hover (aka title); (default) tooltip can be disabled when this field is set to empty string - \`<tooltip:>\`
- \`target\`: where the tag will be inserted, default is \`new\`; valid values are \`new\` (on home page or when clicking on "New Thread" button) / \`thread\` (on thread page) / \`all\` (everywhere)
- \`hide\`: hide the tag from the tag list
- \`link\`: link to a URL, e.g. \`<link:https://example.com>\`, can be used for collections. only one link per tag is supported.
- \`link-target\`: target of the link, e.g. \`<link-target:_blank>\` (opens in new tab), default is \`_self\` (same tab).
- \`icon\`: Lucide icon name, e.g. \`<icon:arrow-right>\`. see [lucide icons](https://lucide.dev/icons). prefix \`td:\` is used for [TDesign icons](https://tdesign.tencent.com/design/icon-en#header-69). prefix \`l:\` for Lucide icons is implicit and can be omitted.
- \`toggle-mode\`: makes the tag work as a toggle button. When toggled on (highlighted), a special cyan/green outline appears around the submit button. Click this enhanced submit button to apply all toggled tag actions before submitting. Toggle status is saved between sessions. No parameters needed - just use \`<toggle-mode>\`.
- \`set-mode\`: set the query mode: \`pro\` or \`research\`, e.g. \`<set-mode:pro>\`
- \`set-model\`: set the model, e.g. \`<set-model:claude-3-7-sonnet-thinking>\`
- \`set-sources\`: set the sources, e.g. \`<set-sources:001>\` for disabled first source (web), disabled second source (academic), enabled third source (social)
- \`auto-submit\`: automatically submit the query after the tag is clicked (applies after other tag actions like \`set-mode\` or \`set-model\`), e.g. \`<auto-submit>\`
- \`dir\`: unique identifier for a directory tag (it will not insert text into prompt)
- \`in-dir\`: identifier of the parent directory this tag belongs to
- \`fence\`: unique identifier for a fence definition (hidden by default)
- \`in-fence\`: identifier of the fence this tag belongs to
- \`fence-width\`: CSS width for a fence, e.g. \`<fence-width:10em>\`
- \`fence-border-style\`: CSS border style for a fence (e.g., solid, dashed, dotted)
- \`fence-border-color\`: CSS color or a palette \`%\` syntax for a fence border
- \`fence-border-width\`: CSS width for a fence border

---

| String | Replacement | Example |
|---|---|---|
| \`\\n\` | newline | |
| \`$$time$$\` | current time | \`23:05\` |
| \`$$wrap$$\` | sets position where existing text will be inserted | |

---

Examples:
\`\`\`
stable diffusion web ui - <label:SDWU>
, prefer concise modern syntax and style, <position:caret><label:concise modern>
tell me a joke<label:Joke><tooltip:>
tell me a joke<label:Joke & Submit><auto-submit>
<label:Sonnet><toggle-mode><set-model:claude-3-7-sonnet-thinking><icon:brain>
<toggle-mode><label:Add Note><position:after><color:%2>\n\nNOTE: This is a toggle-mode note appended to the end of prompt
\`\`\`

Directory example:
\`\`\`
<dir:games>Games<icon:gamepad-2>
<in-dir:games>FFXIV: <color:%15><label:FFXIV>
<in-dir:games>Vintage Story - <label:VS>
\`\`\`

Fence example:
\`\`\`
<fence:anime><fence-border-style:dashed><fence-border-color:%10>
<in-fence:anime>Shounen
<in-fence:anime>Seinen
<in-fence:anime>Shoujo
\`\`\`

Another fence example:
\`\`\`
<fence:programming><fence-border-style:solid><fence-border-color:%20>
<in-fence:programming>Haskell
<in-fence:programming>Raku<label:🦋>
\`\`\`
`.trim();

const defaultTagColor = '#282828';

const TAGS_PALETTE_COLORS_NUM = 16;
const TAGS_PALETTE_CLASSIC = Object.freeze((() => {
  const step = 360 / TAGS_PALETTE_COLORS_NUM;
  const [startH, startS, startL, startA] = color2k.parseToHsla(cyanPerplexityColor);
  return _.flow(
    _.map(x => startH + x * step, _),
    _.map(h => color2k.hsla(h, startS, startL, startA), _),
    _.sortBy(x => color2k.parseToHsla(x)[0], _)
  )(_.range(0, TAGS_PALETTE_COLORS_NUM));
})());

const TAGS_PALETTE_PASTEL = Object.freeze((() => {
  const step = 360 / TAGS_PALETTE_COLORS_NUM;
  const [startH, startS, startL, startA] = color2k.parseToHsla(cyanPerplexityColor);
  return _.flow(
    _.map(x => startH + x * step, _),
    _.map(h => color2k.hsla(h, startS - 0.2, startL + 0.2, startA), _),
    _.sortBy(x => color2k.parseToHsla(x)[0], _)
  )(_.range(0, TAGS_PALETTE_COLORS_NUM));
})());

const TAGS_PALETTE_GRIM = Object.freeze((() => {
  const step = 360 / TAGS_PALETTE_COLORS_NUM;
  const [startH, startS, startL, startA] = color2k.parseToHsla(cyanPerplexityColor);
  return _.flow(
    _.map(x => startH + x * step, _),
    _.map(h => color2k.hsla(h, startS - 0.6, startL - 0.3, startA), _),
    _.sortBy(x => color2k.parseToHsla(x)[0], _)
  )(_.range(0, TAGS_PALETTE_COLORS_NUM));
})());

const TAGS_PALETTE_DARK = Object.freeze((() => {
  const step = 360 / TAGS_PALETTE_COLORS_NUM;
  const [startH, startS, startL, startA] = color2k.parseToHsla(cyanPerplexityColor);
  return _.flow(
    _.map(x => startH + x * step, _),
    _.map(h => color2k.hsla(h, startS, startL - 0.4, startA), _),
    _.sortBy(x => color2k.parseToHsla(x)[0], _)
  )(_.range(0, TAGS_PALETTE_COLORS_NUM));
})());

const TAGS_PALETTE_GRAY = Object.freeze((() => {
  const step = 1 / TAGS_PALETTE_COLORS_NUM;
  return _.range(0, TAGS_PALETTE_COLORS_NUM).map(x => color2k.hsla(0, 0, step * x, 1));
})());

const TAGS_PALETTE_CYAN = Object.freeze((() => {
  const step = 1 / TAGS_PALETTE_COLORS_NUM;
  const [startH, startS, startL, startA] = color2k.parseToHsla(cyanPerplexityColor);
  return _.range(0, TAGS_PALETTE_COLORS_NUM).map(x => color2k.hsla(startH, startS, step * x, 1));
})());

const TAGS_PALETTE_TRANSPARENT = Object.freeze((() => {
  const step = 1 / TAGS_PALETTE_COLORS_NUM;
  return _.range(0, TAGS_PALETTE_COLORS_NUM).map(x => color2k.hsla(0, 0, 0, step * x));
})());

const TAGS_PALETTE_HACKER = Object.freeze((() => {
  const step = 1 / TAGS_PALETTE_COLORS_NUM;
  return _.range(0, TAGS_PALETTE_COLORS_NUM).map(x => color2k.hsla(120, step * x, step * x * 0.5, 1));
})());

const TAGS_PALETTES = Object.freeze({
  CLASSIC: TAGS_PALETTE_CLASSIC,
  PASTEL: TAGS_PALETTE_PASTEL,
  GRIM: TAGS_PALETTE_GRIM,
  DARK: TAGS_PALETTE_DARK,
  GRAY: TAGS_PALETTE_GRAY,
  CYAN: TAGS_PALETTE_CYAN,
  TRANSPARENT: TAGS_PALETTE_TRANSPARENT,
  HACKER: TAGS_PALETTE_HACKER,
  CUSTOM: 'CUSTOM',
});

const convertColorInPaletteFormat = currentPalette => value => currentPalette[parseInt(dropStr(1)(value), 10)] ?? defaultTagColor;

const TAG_HOME_PAGE_LAYOUT = {
  DEFAULT: 'default',
  COMPACT: 'compact',
  WIDER: 'wider',
  WIDE: 'wide',
  EXTRA_WIDE: 'extra-wide',
};

const parseBinaryState = binaryStr => {
  if (!/^[01-]+$/.test(binaryStr)) {
    throw new Error('Invalid binary state: ' + binaryStr);
  }
  return binaryStr.split('').map(bit => bit === '1' ? true : bit === '0' ? false : null);
};

const processTagField = currentPalette => name => value => {
  if (name === 'color' && value.startsWith('%')) return convertColorInPaletteFormat(currentPalette)(value);
  if (name === 'hide') return true;
  if (name === 'auto-submit') return true;
  if (name === 'toggle-mode') return true;
  if (name === 'set-sources') return parseBinaryState(value);
  return value;
};

const tagLineRegex = /<(label|position|color|tooltip|target|hide|link|link-target|icon|dir|in-dir|fence|in-fence|fence-border-style|fence-border-color|fence-border-width|fence-width|set-mode|set-model|auto-submit|set-sources|toggle-mode)(?::([^<>]*))?>/g;
const parseOneTagLine = currentPalette => line =>
  Array.from(line.matchAll(tagLineRegex)).reduce(
    (acc, match) => {
      const [fullMatch, field, value] = match;
      const processedValue = processTagField(currentPalette)(field)(value);
      return {
        ...acc,
        [_.camelCase(field)]: processedValue,
        text: acc.text.replace(fullMatch, '').replace(/\\n/g, '\n'),
      };
    },
    {
      text: line,
      color: defaultTagColor,
      target: TAG_CONTAINER_TYPE.NEW,
      hide: false,
      'link-target': '_self',
    }
  );

const parseTagsText = text => {
  const lines = text.split('\n').filter(tag => tag.trim().length > 0);
  const palette = getPalette(loadConfig()?.tagPalette);
  return lines.map(parseOneTagLine(palette)).map((x, i) => ({ ...x, originalIndex: i }));
};

const getTagsContainer = () => $c(tagsContainerCls);

const posFromTag = tag => Object.values(TAG_POSITION).includes(tag.position) ? tag.position : TAG_POSITION.BEFORE;

const splitTextAroundWrap = (text) => {
  const parts = text.split('$$wrap$$');
  return {
    before: parts[0] || '',
    after: parts[1] || '',
  };
};

const applyTagToString = (tag, val, caretPos) => {
  const { text } = tag;
  const timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const textAfterTime = text.replace(/\$\$time\$\$/g, timeString);
  const { before: processedTextBefore, after: processedTextAfter } = splitTextAroundWrap(textAfterTime);
  const processedText = processedTextBefore;

  switch (posFromTag(tag)) {
    case TAG_POSITION.BEFORE:
      return `${processedText}${val}`;
    case TAG_POSITION.AFTER:
      return `${val}${processedText}`;
    case TAG_POSITION.CARET:
      return `${takeStr(caretPos)(val)}${processedText}${dropStr(caretPos)(val)}`;
    case TAG_POSITION.WRAP:
      return `${processedTextBefore}${val}${processedTextAfter}`;
    default:
      throw new Error(`Invalid position: ${tag.position}`);
  }
};

const getPromptAreaFromTagsContainer = tagsContainerEl => PP.getAnyPromptArea(tagsContainerEl.parent());

const getPromptAreaWrapperFromTagsContainer = tagsContainerEl => PP.getAnyPromptAreaWrapper(tagsContainerEl.parent());

const getPalette = paletteName => {
  // Add this check for 'CUSTOM'
  if (paletteName === TAGS_PALETTES.CUSTOM) {
    // Use tagPaletteCustom from config or default if not found
    return loadConfigOrDefault()?.tagPaletteCustom ?? defaultConfig.tagPaletteCustom;
  }
  // Fallback to predefined palettes or CLASSIC as default
  const palette = TAGS_PALETTES[paletteName];
  // Check if palette is an array before returning, otherwise return default
  return Array.isArray(palette) ? palette : TAGS_PALETTES.CLASSIC;
};

// Function to update a toggle tag's visual state
const updateToggleTagState = (tagEl, tag, newToggleState) => {
  if (!tagEl || !tag) return;

  const isTagLight = color2k.getLuminance(tag.color) > loadConfigOrDefault().tagLuminanceThreshold;
  const colorMod = isTagLight ? color2k.darken : color2k.lighten;
  const hoverBgColor = color2k.toRgba(colorMod(tag.color, 0.1));

  // For toggle tags, adjust the color based on toggle state
  const toggledColor = newToggleState ? color2k.lighten(tag.color, 0.3) : tag.color;

  // Update the tag element
  tagEl.attr('data-toggled', newToggleState);
  tagEl.css('background-color', toggledColor);
  tagEl.attr('data-hoverBgColor', color2k.toHex(hoverBgColor));

  // Update tooltip if using default
  if (!tag.tooltip) {
    const newTooltip = `${logPrefix} Toggle ${newToggleState ? 'off' : 'on'} - ${tag.label || 'tag'}`;
    tagEl.prop('title', newTooltip);
  }
};

const createTag = containerEl => isPreview => tag => {
  if (tag.hide) return null;

  // Generate a unique identifier for this toggle tag
  const tagId = generateToggleTagId(tag);

  // Get saved toggle state if this is a toggle-mode tag and tagToggleSave is enabled
  const config = loadConfigOrDefault();
  // Make sure tagToggledStates exists to prevent errors
  if (!config.tagToggledStates) {
    config.tagToggledStates = {};
    saveConfig(config);
  }
  // TODO: rewrite most of code with _phTagToggleState - new util functions/classes for working with it
  // Check both the in-memory toggle state and the saved toggle state (if tagToggleSave is enabled)
  // In-memory toggle state takes precedence during the current session
  const inMemoryToggleState = window._phTagToggleState && tagId ? window._phTagToggleState[tagId] : undefined;
  const savedToggleState = (tagId && config.tagToggleSave) ? config.tagToggledStates[tagId] || false : false;
  const isToggled = inMemoryToggleState !== undefined ? inMemoryToggleState : savedToggleState;

  const labelString = tag.label ?? tag.text;
  const isTagLight = color2k.getLuminance(tag.color) > loadConfig().tagLuminanceThreshold;
  const colorMod = isTagLight ? color2k.darken : color2k.lighten;
  const hoverBgColor = color2k.toRgba(colorMod(tag.color, 0.1));
  const borderColor = color2k.toRgba(colorMod(tag.color, loadConfig().tagTweakRichBorderColor ? 0.2 : 0.1));

  const clickHandler = async (evt) => {
    debugLog('TAG clicked', tag, evt);
    if (tag.link) return;

    // Handle toggle mode
    if (tag.toggleMode) {
      const el = jq(evt.currentTarget);

      // Get the current toggle state directly from the element
      // This is critical for handling multiple clicks correctly
      const currentToggleState = el.attr('data-toggled') === 'true';
      const newToggleState = !currentToggleState;

      // Update the toggle state in config only if tagToggleSave is enabled
      // Make sure tagId is valid before using it
      if (tagId) {
        const config = loadConfigOrDefault();

        // Create a temporary in-memory toggle state for visual indication
        // We'll track this regardless of tagToggleSave setting
        window._phTagToggleState = window._phTagToggleState || {};
        window._phTagToggleState[tagId] = newToggleState;

        // Only save the toggle state permanently if the tagToggleSave setting is enabled
        if (config.tagToggleSave) {
          const updatedConfig = {
            ...config,
            tagToggledStates: {
              ...config.tagToggledStates,
              [tagId]: newToggleState
            }
          };
          saveConfig(updatedConfig);
        }

        // Update visual indicators for submit buttons
        updateToggleIndicators();

        // Update the tag's visual state
        updateToggleTagState(el, tag, newToggleState);
      } else {
        debugLog('Error: Invalid toggle tag ID', tag);
      }

      return;
    }

    // Regular tag handling for non-toggle tags
    try {
      // Apply all tag's actions and wait for them to complete
      await applyTagActions(tag);
      const $el = jq(evt.currentTarget);

      // Handle auto submit for this tag after all actions are applied
      if (tag.autoSubmit) {
        const $tagsContainer = $el.closest(`.${tagsContainerCls}`);
        const $promptAreaWrapper = getPromptAreaWrapperFromTagsContainer($tagsContainer);
        await applyToggledTagsOnSubmit($promptAreaWrapper);

        const submitButton = PP.getSubmitButtonAnyExceptMic();
        debugLog('[createTag] clickHandler: submitButton=', submitButton);
        if (submitButton.length) {
          if (submitButton.length > 1) {
            debugLog('[createTag] clickHandler: multiple submit buttons found, using first one');
          }
          submitButton.first().click();
        } else {
          debugLog('[createTag] clickHandler: no submit button found');
        }
      } else {
        // Focus the prompt area if we're not auto-submitting
        const tagsContainer = $el.closest(`.${tagsContainerCls}`);
        if (tagsContainer.length) {
          const promptArea = getPromptAreaFromTagsContainer(tagsContainer);
          if (promptArea.length) {
            promptArea[0].focus();
          }
        }
      }
    } catch (error) {
      logError('Error applying tag actions:', error);
    }
  };

  const tagFont = loadConfig().tagFont;

  // Create tooltip message based on tag type - without using let
  const tooltipMsg = tag.link
    ? `${logPrefix} Open link: ${tag.link}`
    : tag.toggleMode
      ? `${logPrefix} Toggle ${isToggled ? 'off' : 'on'} - ${tag.label || 'tag'}`
      : `${logPrefix} Insert \`${tag.text}\` at position \`${posFromTag(tag)}\``;

  const defaultTooltip = tooltipMsg;

  // For toggle tags, adjust the color based on toggle state
  const toggledColor = isToggled ? color2k.lighten(tag.color, 0.3) : tag.color;
  const backgroundColor = tag.toggleMode ? toggledColor : tag.color;

  const tagEl = jq(`<div/>`)
    .addClass(tagCls)
    .prop('title', tag.tooltip ?? defaultTooltip)
    .attr('data-tag', JSON.stringify(tag))
    .css({
      backgroundColor,
      borderColor,
      fontFamily: tagFont,
      borderRadius: `${loadConfig().tagRoundness}px`,
    })
    .attr('data-color', color2k.toHex(tag.color))
    .attr('data-hoverBgColor', color2k.toHex(hoverBgColor))
    .attr('data-font', tagFont)
    .attr('data-toggled', isToggled.toString())
    .on('mouseenter', event => {
      jq(event.currentTarget).css('background-color', hoverBgColor);
    })
    .on('mouseleave', event => {
      const el = jq(event.currentTarget);
      const isCurrentToggled = el.attr('data-toggled') === 'true';
      const currentColor = tag.toggleMode && isCurrentToggled ?
        color2k.lighten(tag.color, 0.3) : tag.color;
      el.css('background-color', currentColor);
    });

  if (isTagLight) {
    tagEl.addClass(tagDarkTextCls);
  }

  if (loadConfig()?.tagTweakNoBorder) {
    tagEl.addClass(tagTweakNoBorderCls);
  }
  if (loadConfig()?.tagTweakSlimPadding) {
    tagEl.addClass(tagTweakSlimPaddingCls);
  }
  if (loadConfig()?.tagTweakTextShadow) {
    tagEl.addClass(tagTweakTextShadowCls);
  }

  const textEl = jq('<span/>')
    .text(labelString)
    .css({
      'font-weight': loadConfig().tagBold ? 'bold' : 'normal',
      'font-style': loadConfig().tagItalic ? 'italic' : 'normal',
      'font-size': `${loadConfig().tagFontSize}px`,
      'transform': `translateY(${loadConfig().tagTextYOffset}px)`,
    });

  if (tag.icon) {
    const iconEl = jq('<img/>')
      .attr('src', getIconUrl(tag.icon))
      .addClass(tagIconCls)
      .css({
        'width': `${loadConfig().tagIconSize}px`,
        'height': `${loadConfig().tagIconSize}px`,
        'transform': `translateY(${loadConfig().tagIconYOffset}px)`,
      });
    if (!labelString) {
      iconEl.css({
        marginLeft: '0',
        marginRight: '0',
      });
    }
    textEl.prepend(iconEl);
  }

  tagEl.append(textEl);

  if (tag.link) {
    const linkEl = jq('<a/>')
      .attr('href', tag.link)
      .attr('target', tag.linkTarget)
      .css({
        textDecoration: 'none',
        color: 'inherit'
      });
    textEl.wrap(linkEl);
  }

  if (!isPreview && !tag.link && !tag.dir) {
    tagEl.click(clickHandler);
  }
  containerEl.append(tagEl);

  return tagEl;
};

const genDebugFakeTags = () =>
  _.times(TAGS_PALETTE_COLORS_NUM, x => `Fake ${x} ${_.times(x / 3).map(() => 'x').join('')}<color:%${x % TAGS_PALETTE_COLORS_NUM}>`)
    .join('\n');

const getTagContainerType = containerEl => {
  if (containerEl.hasClass(threadTagContainerCls) || containerEl.hasClass(tagsPreviewThreadCls)) return TAG_CONTAINER_TYPE.THREAD;
  if (containerEl.hasClass(newTagContainerCls) || containerEl.hasClass(tagsPreviewNewCls)) return TAG_CONTAINER_TYPE.NEW;
  if (containerEl.hasClass(newTagContainerInCollectionCls) || containerEl.hasClass(tagsPreviewNewInCollectionCls)) return TAG_CONTAINER_TYPE.NEW_IN_COLLECTION;
  return null;
};

const getPromptWrapperTagContainerType = promptWrapper => {
  if (PP.getPromptAreaOfNewThread(promptWrapper).length) return TAG_CONTAINER_TYPE.NEW;
  if (PP.getPromptAreaOnThread(promptWrapper).length) return TAG_CONTAINER_TYPE.THREAD;
  if (PP.getPromptAreaOnCollection(promptWrapper).length) return TAG_CONTAINER_TYPE.NEW_IN_COLLECTION;
  return null;
};

const isTagRelevantForContainer = containerType => tag =>
  containerType === tag.target
  || (containerType === TAG_CONTAINER_TYPE.NEW_IN_COLLECTION && tag.target === TAG_CONTAINER_TYPE.NEW)
  || tag.target === TAG_CONTAINER_TYPE.ALL;

const tagContainerTypeToTagContainerClass = {
  [TAG_CONTAINER_TYPE.THREAD]: threadTagContainerCls,
  [TAG_CONTAINER_TYPE.NEW]: newTagContainerCls,
  [TAG_CONTAINER_TYPE.NEW_IN_COLLECTION]: newTagContainerInCollectionCls,
};

const currentUrlIsSettingsPage = () => window.location.pathname.includes('/settings/');

const refreshTags = ({ force = false } = {}) => {
  if (!loadConfigOrDefault()?.tagsEnabled) return;
  const promptWrapper = PP.getPromptAreaWrapperOfNewThread()
    .add(PP.getPromptAreaWrapperOnThread())
    .add(PP.getPromptAreaWrapperOnCollection())
    .filter((_, rEl) => {
      const isPreview = Boolean(jq(rEl).attr('data-preview'));
      return isPreview || !currentUrlIsSettingsPage();
    });
  if (!promptWrapper.length) {
    debugLogTags('no prompt area found');
  }
  // debugLogTags('promptWrappers', promptWrapper);
  const allTags = _.flow(
    x => x + (unsafeWindow.phFakeTags ? `${nl}${genDebugFakeTags()}${nl}` : ''),
    parseTagsText,
  )(loadConfig()?.tagsText ?? defaultConfig.tagsText);
  debugLogTags('refreshing allTags', allTags);

  const createContainer = (promptWrapper) => {
    const el = jq(`<div/>`).addClass(tagsContainerCls);
    const tagContainerType = getPromptWrapperTagContainerType(promptWrapper);
    if (tagContainerType) {
      const clsToAdd = tagContainerTypeToTagContainerClass[tagContainerType];
      if (!clsToAdd) {
        console.error('Unexpected tagContainerType:', tagContainerType, { promptWrapper });
      }
      el.addClass(clsToAdd);
    }
    return el;
  };
  promptWrapper.each((_, rEl) => {
    const el = jq(rEl);
    if (el.parent().find(`.${tagsContainerCls}`).length) {
      el.parent().addClass(queryBoxCls);
      return;
    }
    el.before(createContainer(el));
  });

  const currentPalette = getPalette(loadConfig().tagPalette);

  const createFence = (fence) => {
    const fenceEl = jq('<div/>')
      .addClass(tagFenceCls)
      .css({
        'border-style': fence.fenceBorderStyle ?? 'solid',
        'border-color': fence.fenceBorderColor?.startsWith('%')
          ? convertColorInPaletteFormat(currentPalette)(fence.fenceBorderColor)
          : fence.fenceBorderColor ?? defaultTagColor,
        'border-width': fence.fenceBorderWidth ?? '1px',
      })
      .attr('data-tag', JSON.stringify(fence))
      ;
    const fenceContentEl = jq('<div/>')
      .addClass(tagFenceContentCls)
      .css({
        'width': fence.fenceWidth ?? '',
      })
      ;
    fenceEl.append(fenceContentEl);
    return { fenceEl, fenceContentEl };
  };

  const createDirectory = () => {
    const directoryEl = jq('<div/>').addClass(tagDirectoryCls);
    const directoryContentEl = jq('<div/>').addClass(tagDirectoryContentCls);
    directoryEl.append(directoryContentEl);
    return { directoryEl, directoryContentEl };
  };

  const containerEls = getTagsContainer();
  containerEls.each((_i, rEl) => {
    const containerEl = jq(rEl);
    const isPreview = Boolean(containerEl.attr('data-preview'));

    const tagContainerTypeFromPromptWrapper = getPromptWrapperTagContainerType(containerEl.nthParent(2));
    const prelimTagContainerType = getTagContainerType(containerEl);
    if (tagContainerTypeFromPromptWrapper !== prelimTagContainerType && !isPreview) {
      debugLog('tagContainerTypeFromPromptWrapper !== prelimTagContainerType', { tagContainerTypeFromPromptWrapper, prelimTagContainerType, containerEl, isPreview });
      containerEl
        .empty()
        .removeClass(threadTagContainerCls, newTagContainerCls, newTagContainerInCollectionCls)
        .addClass(tagContainerTypeToTagContainerClass[tagContainerTypeFromPromptWrapper])
        ;
    } else {
      if (!isPreview) {
        debugLogTags('tagContainerTypeFromPromptWrapper === prelimTagContainerType', { tagContainerTypeFromPromptWrapper, prelimTagContainerType, containerEl, isPreview });
      }
    }

    // TODO: use something else than lodash/fp. in following functions it behaved randomly very weirdly
    // e.g. partial application of map resulting in an empty array or sortBy sorting field name instead
    // of input array. possibly inconsistent normal FP order of arguments
    const mapParseAttrTag = xs => xs.map(el => JSON.parse(el.dataset.tag));
    const sortByOriginalIndex = xs => [...xs].sort((a, b) => a.originalIndex - b.originalIndex);
    const tagElsInCurrentContainer = containerEl.find(`.${tagCls}, .${tagFenceCls}`).toArray();
    const filterOutHidden = filter(x => !x.hide);
    const currentTags = _.flow(
      mapParseAttrTag,
      sortByOriginalIndex,
      filterOutHidden,
      _.uniq,
    )(tagElsInCurrentContainer);
    const tagContainerType = getTagContainerType(containerEl);
    const tagsForThisContainer = _.flow(
      filter(isTagRelevantForContainer(tagContainerType)),
      filterOutHidden,
      sortByOriginalIndex,
    )(allTags);
    debugLogTags('tagContainerType =', tagContainerType, ', current tags =', currentTags, ', tagsForThisContainer =', tagsForThisContainer, ', tagElsInCurrentContainer =', tagElsInCurrentContainer);
    if (_.isEqual(currentTags, tagsForThisContainer) && !force) {
      debugLogTags('no tags changed');
      return;
    }
    const diff = jsondiffpatch.diff(currentTags, tagsForThisContainer);
    const changedTags = jsondiffpatch.formatters.console.format(diff);
    debugLogTags('changedTags', changedTags);
    containerEl.empty();
    const tagHomePageLayout = loadConfig()?.tagHomePageLayout;
    if (!isPreview) {
      if ((tagContainerType === TAG_CONTAINER_TYPE.NEW || tagContainerType === TAG_CONTAINER_TYPE.NEW_IN_COLLECTION)) {
        if (tagContainerType === TAG_CONTAINER_TYPE.NEW_IN_COLLECTION) {
          // only compact layout is supported for new in collection
          if (tagHomePageLayout === TAG_HOME_PAGE_LAYOUT.COMPACT) {
            containerEl.addClass(tagContainerCompactCls);
          }
        } else if (tagHomePageLayout === TAG_HOME_PAGE_LAYOUT.COMPACT) {
          containerEl.addClass(tagContainerCompactCls);
        } else if (tagHomePageLayout === TAG_HOME_PAGE_LAYOUT.WIDER) {
          containerEl.addClass(tagContainerWiderCls);
        } else if (tagHomePageLayout === TAG_HOME_PAGE_LAYOUT.WIDE) {
          containerEl.addClass(tagContainerWideCls);
        } else if (tagHomePageLayout === TAG_HOME_PAGE_LAYOUT.EXTRA_WIDE) {
          containerEl.addClass(tagContainerExtraWideCls);
        } else {
          containerEl.removeClass(`${tagContainerCompactCls} ${tagContainerWiderCls} ${tagContainerWideCls} ${tagContainerExtraWideCls}`);
        }
        const extraMargin = loadConfig()?.tagContainerExtraBottomMargin || 0;
        containerEl.css('margin-bottom', `${extraMargin}em`);
      }
    }

    const fences = {};
    const directories = {};

    const fencesWrapperEl = jq('<div/>').addClass(tagAllFencesWrapperCls);
    const restWrapperEl = jq('<div/>').addClass(tagRestOfTagsWrapperCls);

    tagsForThisContainer.forEach(tag => {
      const { fence, dir, inFence, inDir } = tag;

      const getOrCreateDirectory = dirName => {
        if (!directories[dirName]) directories[dirName] = createDirectory();
        return directories[dirName];
      };

      const getTagContainer = () => {
        if (fence) {
          if (!fences[fence]) fences[fence] = createFence(tag);
          return fences[fence].fenceContentEl;
        } else if (dir && inFence) {
          if (!fences[inFence]) {
            console.error(`fence ${inFence} for tag not found`, tag);
            return null;
          }
          const { directoryEl } = getOrCreateDirectory(dir);
          fences[inFence].fenceContentEl.append(directoryEl);
          return directoryEl;
        } else if (dir) {
          const { directoryEl } = getOrCreateDirectory(dir);
          restWrapperEl.append(directoryEl);
          return directoryEl;
        } else if (inFence) {
          if (!fences[inFence]) {
            console.error(`fence ${inFence} for tag not found`, tag);
            return null;
          }
          return fences[inFence].fenceContentEl;
        } else if (inDir) {
          if (!directories[inDir]) {
            console.error(`directory ${inDir} for tag not found`, tag);
            return null;
          }
          return directories[inDir].directoryContentEl;
        } else {
          return restWrapperEl;
        }
      };

      const tagContainer = getTagContainer();
      if (tagContainer && !fence) {
        createTag(tagContainer)(isPreview)(tag);
      }
    });

    Object.values(fences).forEach(({ fenceEl }) => fencesWrapperEl.append(fenceEl));
    containerEl.append(fencesWrapperEl).append(restWrapperEl);
  });
};

const setupTags = () => {
  debugLog('setting up tags');
  setInterval(refreshTags, 500);
};

const ICON_REPLACEMENT_MODE = Object.freeze({
  OFF: 'Off',
  LUCIDE1: 'Lucide 1',
  LUCIDE2: 'Lucide 2',
  LUCIDE3: 'Lucide 3',
  TDESIGN1: 'TDesign 1',
  TDESIGN2: 'TDesign 2',
  TDESIGN3: 'TDesign 3',
});

const leftPanelIconMappingsToLucide1 = Object.freeze({
  'search': 'search',
  'discover': 'telescope',
  'spaces': 'shapes',
});

const leftPanelIconMappingsToLucide2 = Object.freeze({
  'search': 'house',
  'discover': 'compass',
  'spaces': 'square-stack',
  'library': 'archive',
});

const leftPanelIconMappingsToLucide3 = Object.freeze({
  'search': 'search',
  'discover': 'telescope',
  'spaces': 'bot',
  'library': 'folder-open',
});

const leftPanelIconMappingsToTDesign1 = Object.freeze({
  'search': 'search',
  'discover': 'compass-filled',
  'spaces': 'grid-view',
  'library': 'book',
});

const leftPanelIconMappingsToTDesign2 = Object.freeze({
  'search': 'search',
  'discover': 'shutter-filled',
  'spaces': 'palette-1',
  'library': 'folder-open-1-filled',
});

const leftPanelIconMappingsToTDesign3 = Object.freeze({
  'search': 'search',
  'discover': 'banana-filled',
  'spaces': 'chili-filled',
  'library': 'barbecue-filled',
});

const iconMappings = {
  LUCIDE1: leftPanelIconMappingsToLucide1,
  LUCIDE2: leftPanelIconMappingsToLucide2,
  LUCIDE3: leftPanelIconMappingsToLucide3,
  TDESIGN1: leftPanelIconMappingsToTDesign1,
  TDESIGN2: leftPanelIconMappingsToTDesign2,
  TDESIGN3: leftPanelIconMappingsToTDesign3,
};

const MODEL_LABEL_TEXT_MODE = Object.freeze({
  OFF: 'Off',
  FULL_NAME: 'Full Name',
  SHORT_NAME: 'Short Name',
  PP_MODEL_ID: 'PP Model ID',
  OWN_NAME_VERSION_SHORT: 'Own Name + Version Short',
  VERY_SHORT: 'Very Short',
  FAMILIAR_NAME: 'Familiar Name',
});

const MODEL_LABEL_STYLE = Object.freeze({
  OFF: 'Off',
  NO_TEXT: 'No text',
  JUST_TEXT: 'Just Text',
  BUTTON_SUBTLE: 'Button Subtle',
  BUTTON_WHITE: 'Button White',
  BUTTON_CYAN: 'Button Cyan',
});

const CUSTOM_MODEL_POPOVER_MODE = Object.freeze({
  OFF: 'Off',
  SIMPLE_LIST: 'Simple List',
  COMPACT_LIST: 'Compact List',
  SIMPLE_GRID: 'Simple 2x Grid',
  COMPACT_GRID: 'Compact 2x Grid',
});

const MODEL_LABEL_ICON_REASONING_MODEL = Object.freeze({
  OFF: 'Off',
  LIGHTBULB: 'Lightbulb',
  BRAIN: 'Brain',
  MICROCHIP: 'Microchip',
  COG: 'Cog',
  BRAIN_COG: 'Brain Cog',
  CALCULATOR: 'Calculator',
  BOT: 'Bot',
});

const MODEL_LABEL_ICONS = Object.freeze({
  OFF: 'Off',
  MONOCHROME: 'Monochrome',
  COLOR: 'Color',
});

const MODEL_SELECTION_LIST_ITEMS_MAX_OPTIONS = Object.freeze({
  OFF: 'Off',
  SEMI_HIDE: 'Semi hide',
  HIDE: 'Hide',
});

const HIDE_UPGRADE_TO_MAX_ADS_OPTIONS = Object.freeze({
  OFF: 'Off',
  SEMI_HIDE: 'Semi-Hide',
  HIDE: 'Hide',
});

const defaultConfig = Object.freeze({
  // General
  hideSideMenu: false,
  slimLeftMenu: false,
  hideSideMenuLabels: false,
  hideHomeWidgets: false,
  hideDiscoverButton: false,
  hideRelated: false,
  hideUpgradeToMaxAds: HIDE_UPGRADE_TO_MAX_ADS_OPTIONS.OFF,
  fixImageGenerationOverlay: false,
  extraSpaceBellowLastAnswer: false,
  quickProfileButtonEnabled: false,
  quickProfiles: [],
  replaceIconsInMenu: ICON_REPLACEMENT_MODE.OFF,
  leftMarginOfThreadContent: null,
  showRemoveAllUploadedFilesButton: true,

  // Model
  modelLabelTextMode: MODEL_LABEL_TEXT_MODE.OFF,
  modelLabelStyle: MODEL_LABEL_STYLE.OFF,
  modelLabelOverwriteCyanIconToGray: false,
  modelLabelUseIconForReasoningModels: MODEL_LABEL_ICON_REASONING_MODEL.OFF,
  modelLabelReasoningModelIconColor: '#ffffff',
  modelLabelRemoveCpuIcon: false,
  modelLabelLargerIcons: false,
  modelLabelIcons: MODEL_LABEL_ICONS.OFF,
  modelPreferBaseModelIcon: false,
  customModelPopover: CUSTOM_MODEL_POPOVER_MODE.SIMPLE_GRID,
  modelIconsInPopover: false,
  modelSelectionListItemsMax: MODEL_SELECTION_LIST_ITEMS_MAX_OPTIONS.OFF,

  // Legacy
  showCopilot: true,
  showCopilotNewThread: true,
  showCopilotRepeatLast: true,
  showCopilotCopyPlaceholder: true,

  // Tags
  tagsEnabled: true,
  tagsText: '',
  tagPalette: 'CLASSIC',
  tagPaletteCustom: ['#000', '#fff', '#ff0', '#f00', '#0f0', '#00f', '#0ff', '#f0f'],
  tagFont: 'Roboto',
  tagHomePageLayout: TAG_HOME_PAGE_LAYOUT.DEFAULT,
  tagContainerExtraBottomMargin: 0,
  tagLuminanceThreshold: 0.35,
  tagBold: false,
  tagItalic: false,
  tagFontSize: 16,
  tagIconSize: 16,
  tagRoundness: 4,
  tagTextYOffset: 0,
  tagIconYOffset: 0,
  tagToggleSave: false,
  toggleModeHooks: true,
  tagToggleModeIndicators: true,
  tagToggledStates: {}, // Store toggle states by tag identifier

  // Raw
  mainCaptionHtml: '',
  mainCaptionHtmlEnabled: false,
  customJs: '',
  customJsEnabled: false,
  customCss: '',
  customCssEnabled: false,
  customWidgetsHtml: '',
  customWidgetsHtmlEnabled: false,

  // Settings
  activeSettingsTab: 'general',

  // Debug
  debugMode: false,
  debugTagsMode: false,
  debugTagsSuppressSubmit: false,
  autoOpenSettings: false,
  debugModalCreation: false,
  debugEventHooks: false,
  debugReplaceIconsInMenu: false,
  leftMarginOfThreadContentEnabled: false,
  leftMarginOfThreadContent: 0,
});

// TODO: if still using local storage, at least it should be prefixed with user script name
const storageKey = 'checkBoxStates';

const loadConfig = () => {
  try {
    // TODO: use storage from GM API
    const val = JSON.parse(localStorage.getItem(storageKey));
    // debugLog('loaded config', val);
    return val;
  } catch (e) {
    console.error('Failed to load config, using default', e);
    return defaultConfig;
  }
};

const loadConfigOrDefault = () => loadConfig() ?? defaultConfig;

const saveConfig = cfg => {
  debugLog('saving config', cfg);
  localStorage.setItem(storageKey, JSON.stringify(cfg));
};

const createCheckbox = (id, labelText, onChange) => {
  logModalCreation('Creating checkbox', { id, labelText });
  const checkbox = jq(`<input type="checkbox" id=${id}>`);
  const label = jq(`<label class="checkbox_label" for="${id}">${labelText}</label>`);
  const checkboxWithLabel = jq('<div class="checkbox_wrapper"></div>').append(checkbox).append(' ').append(label);
  logModalCreation('checkboxwithlabel', checkboxWithLabel);

  getSettingsLastTabGroupContent().append(checkboxWithLabel);
  checkbox.on('change', onChange);
  return checkbox;
};

const createTextArea = (id, labelText, onChange, helpText, links) => {
  logModalCreation('Creating text area', { id, labelText });
  const textarea = jq(`<textarea id=${id}></textarea>`);
  const bookIconHtml = `<img src="${getLucideIconUrl('book-text')}" class="w-4 h-4 invert inline-block"/>`;
  const labelTextHtml = `<span class="opacity-100">${labelText}</span>`;
  const label = jq(`<label class="textarea_label">${labelTextHtml}${helpText ? ' ' + bookIconHtml : ''}</label>`);
  const labelWithLinks = jq('<div/>').addClass('flex flex-row gap-2 mb-2').append(label);
  const textareaWrapper = jq('<div class="textarea_wrapper"></div>').append(labelWithLinks);
  if (links) {
    links.forEach(({ icon, label, url, tooltip }) => {
      const iconHtml = `<img src="${getIconUrl(icon)}" class="w-4 h-4 invert opacity-50 hover:opacity-100 transition-opacity duration-300 ease-in-out"/>`;
      const link = jq(`<a href="${url}" target="_blank" class="flex flex-row gap-2 items-center">${icon ? iconHtml : ''}${label ? ' ' + label : ''}</a>`);
      link.attr('title', tooltip);
      labelWithLinks.append(link);
    });
  }
  if (helpText) {
    const help = jq(`<div/>`).addClass(helpTextCls).html(markdownConverter.makeHtml(helpText)).append(jq('<br/>'));
    help.find('a').each((_, a) => jq(a).attr('target', '_blank'));
    help.append(jq('<button/>').text('[Close help]').on('click', () => help.hide()));
    textareaWrapper.append(help);
    label
      .css({ cursor: 'pointer' })
      .on('click', () => help.toggle())
      .prop('title', 'Click to toggle help')
      ;
    help.hide();
  }
  textareaWrapper.append(textarea);
  logModalCreation('textareaWithLabel', textareaWrapper);

  getSettingsLastTabGroupContent().append(textareaWrapper);
  textarea.on('change', onChange);
  return textarea;
};

const createSelect = (id, labelText, options, onChange) => {
  const select = jq(`<select id=${id}>`);
  options.forEach(({ value, label }) => {
    jq('<option>').val(value).text(label).appendTo(select);
  });
  const label = jq(`<label class="select_label">${labelText}</label>`);
  const selectWithLabel = jq('<div class="select_wrapper"></div>').append(select).append(label);
  logModalCreation('Creating select', { id, labelText, options, selectWithLabel });

  getSettingsLastTabGroupContent().append(selectWithLabel);
  select.on('change', onChange);
  return select;
};

const createPaletteLegend = paletteName => {
  const wrapper = jq('<div/>')
    .addClass(tagPaletteCls)
    .append(jq('<span>').html('Palette of color codes:&nbsp;'))
    ;
  const palette = getPalette(paletteName);
  palette.forEach((color, i) => {
    const colorCode = `%${i}`;
    const colorPart = genColorPart(colorCode);
    // console.log('createPaletteLegend', {i, colorCode, colorPart, color});
    jq('<span/>')
      .text(colorCode)
      .addClass(tagPaletteItemCls)
      .css({
        'background-color': color,
      })
      .prop('title', `Copy ${colorPart} to clipboard`)
      .click(() => {
        copyTextToClipboard(colorPart);
      })
      .appendTo(wrapper);
  });
  return wrapper;
};

const createColorInput = (id, labelText, onChange) => {
  logModalCreation('Creating color input', { id, labelText });
  const input = jq(`<input type="color" id=${id}>`);
  const label = jq(`<label class="color_label">${labelText}</label>`);
  const inputWithLabel = jq('<div class="color_wrapper"></div>').append(input).append(label);
  logModalCreation('inputWithLabel', inputWithLabel);

  getSettingsLastTabGroupContent().append(inputWithLabel);
  input.on('change', onChange);
  return input;
};

const createNumberInput = (id, labelText, onChange, { step = 1, min = 0, max = 100 } = {}) => {
  logModalCreation('Creating number input', { id, labelText, step, min, max });
  const input = jq(`<input type="number" id=${id}>`)
    .prop('step', step)
    .prop('min', min)
    .prop('max', max)
    ;
  const label = jq(`<label class="number_label">${labelText}</label>`);
  const inputWithLabel = jq('<div class="number_wrapper"></div>').append(input).append(label);
  logModalCreation('inputWithLabel', inputWithLabel);

  getSettingsLastTabGroupContent().append(inputWithLabel);
  input.on('change', onChange);
  return input;
};

const createTagsPreview = () => {
  const wrapper = jq('<div/>')
    .addClass(tagsPreviewCls)
    .append(jq('<div>').text('Preview').addClass('text-lg font-bold'))
    .append(jq('<div>').text('Target New:'))
    .append(jq('<div>').addClass(tagsPreviewNewCls).addClass(tagsContainerCls).attr('data-preview', 'true'))
    .append(jq('<div>').text('Target Thread:'))
    .append(jq('<div>').addClass(tagsPreviewThreadCls).addClass(tagsContainerCls).attr('data-preview', 'true'))
    ;
  getSettingsLastTabGroupContent().append(wrapper);
};

const coPilotNewThreadAutoSubmitCheckboxId = 'coPilotNewThreadAutoSubmit';
const getCoPilotNewThreadAutoSubmitCheckbox = () => $i(coPilotNewThreadAutoSubmitCheckboxId);

const coPilotRepeatLastAutoSubmitCheckboxId = 'coPilotRepeatLastAutoSubmit';
const getCoPilotRepeatLastAutoSubmitCheckbox = () => $i(coPilotRepeatLastAutoSubmitCheckboxId);

const hideSideMenuCheckboxId = 'hideSideMenu';
const getHideSideMenuCheckbox = () => $i(hideSideMenuCheckboxId);

const tagsEnabledId = genCssName('tagsEnabled');
const getTagsEnabledCheckbox = () => $i(tagsEnabledId);

const tagsTextAreaId = 'tagsText';
const getTagsTextArea = () => $i(tagsTextAreaId);

const tagColorPickerId = genCssName('tagColorPicker');
const getTagColorPicker = () => $i(tagColorPickerId);

const enableDebugCheckboxId = genCssName('enableDebug');
const getEnableDebugCheckbox = () => $i(enableDebugCheckboxId);

const enableTagsDebugCheckboxId = genCssName('enableTagsDebug');
const getEnableTagsDebugCheckbox = () => $i(enableTagsDebugCheckboxId);

const debugTagsSuppressSubmitCheckboxId = genCssName('debugTagsSuppressSubmit');
const getDebugTagsSuppressSubmitCheckbox = () => $i(debugTagsSuppressSubmitCheckboxId);

const tagPaletteSelectId = genCssName('tagPaletteSelect');
const getTagPaletteSelect = () => $i(tagPaletteSelectId);

const tagFontSelectId = genCssName('tagFontSelect');
const getTagFontSelect = () => $i(tagFontSelectId);

const tagTweakNoBorderCheckboxId = genCssName('tagTweakNoBorder');
const getTagTweakNoBorderCheckbox = () => $i(tagTweakNoBorderCheckboxId);

const tagTweakSlimPaddingCheckboxId = genCssName('tagTweakSlimPadding');
const getTagTweakSlimPaddingCheckbox = () => $i(tagTweakSlimPaddingCheckboxId);

const tagTweakRichBorderColorCheckboxId = genCssName('tagTweakRichBorderColor');
const getTagTweakRichBorderColorCheckbox = () => $i(tagTweakRichBorderColorCheckboxId);

const tagTweakTextShadowCheckboxId = genCssName('tagTweakTextShadow');
const getTagTweakTextShadowCheckbox = () => $i(tagTweakTextShadowCheckboxId);

const tagHomePageLayoutSelectId = genCssName('tagHomePageLayout');
const getTagHomePageLayoutSelect = () => $i(tagHomePageLayoutSelectId);

const tagContainerExtraBottomMarginInputId = genCssName('tagContainerExtraBottomMargin');
const getTagContainerExtraBottomMarginInput = () => $i(tagContainerExtraBottomMarginInputId);

const tagLuminanceThresholdInputId = genCssName('tagLuminanceThreshold');
const getTagLuminanceThresholdInput = () => $i(tagLuminanceThresholdInputId);

const tagBoldCheckboxId = genCssName('tagBold');
const getTagBoldCheckbox = () => $i(tagBoldCheckboxId);

const tagItalicCheckboxId = genCssName('tagItalic');
const getTagItalicCheckbox = () => $i(tagItalicCheckboxId);

const tagFontSizeInputId = genCssName('tagFontSize');
const getTagFontSizeInput = () => $i(tagFontSizeInputId);

const tagIconSizeInputId = genCssName('tagIconSize');
const getTagIconSizeInput = () => $i(tagIconSizeInputId);

const tagRoundnessInputId = genCssName('tagRoundness');
const getTagRoundnessInput = () => $i(tagRoundnessInputId);

const tagTextYOffsetInputId = genCssName('tagTextYOffset');
const getTagTextYOffsetInput = () => $i(tagTextYOffsetInputId);

const tagIconYOffsetInputId = genCssName('tagIconYOffset');
const getTagIconYOffsetInput = () => $i(tagIconYOffsetInputId);

const tagToggleSaveCheckboxId = genCssName('tagToggleSave');
const getTagToggleSaveCheckbox = () => $i(tagToggleSaveCheckboxId);

const toggleModeHooksCheckboxId = genCssName('toggleModeHooks');
const getToggleModeHooksCheckbox = () => $i(toggleModeHooksCheckboxId);

const tagToggleModeIndicatorsCheckboxId = genCssName('tagToggleModeIndicators');
const getTagToggleModeIndicatorsCheckbox = () => $i(tagToggleModeIndicatorsCheckboxId);

const tagPaletteCustomTextAreaId = genCssName('tagPaletteCustomTextArea');
const getTagPaletteCustomTextArea = () => $i(tagPaletteCustomTextAreaId);

const replaceIconsInMenuId = genCssName('replaceIconsInMenu');
const getReplaceIconsInMenu = () => $i(replaceIconsInMenuId);

const slimLeftMenuCheckboxId = genCssName('slimLeftMenu');
const getSlimLeftMenuCheckbox = () => $i(slimLeftMenuCheckboxId);

const leftMarginOfThreadContentInputId = genCssName('leftMarginOfThreadContent');
const getLeftMarginOfThreadContentInput = () => $i(leftMarginOfThreadContentInputId);

const leftMarginOfThreadContentEnabledId = genCssName('leftMarginOfThreadContentEnabled');
const getLeftMarginOfThreadContentEnabled = () => $i(leftMarginOfThreadContentEnabledId);

const hideHomeWidgetsCheckboxId = genCssName('hideHomeWidgets');
const getHideHomeWidgetsCheckbox = () => $i(hideHomeWidgetsCheckboxId);

const hideDiscoverButtonCheckboxId = genCssName('hideDiscoverButton');
const getHideDiscoverButtonCheckbox = () => $i(hideDiscoverButtonCheckboxId);

const hideRelatedCheckboxId = genCssName('hideRelated');
const getHideRelatedCheckbox = () => $i(hideRelatedCheckboxId);

const hideUpgradeToMaxAdsSelectId = genCssName('hideUpgradeToMaxAds');
const getHideUpgradeToMaxAdsSelect = () => $i(hideUpgradeToMaxAdsSelectId);

const fixImageGenerationOverlayCheckboxId = genCssName('fixImageGenerationOverlay');
const getFixImageGenerationOverlayCheckbox = () => $i(fixImageGenerationOverlayCheckboxId);

const extraSpaceBellowLastAnswerCheckboxId = genCssName('extraSpaceBellowLastAnswer');
const getExtraSpaceBellowLastAnswerCheckbox = () => $i(extraSpaceBellowLastAnswerCheckboxId);

const modelLabelTextModeSelectId = genCssName('modelLabelTextModeSelect');
const getModelLabelTextModeSelect = () => $i(modelLabelTextModeSelectId);

const modelLabelTextPreviewId = genCssName('modelLabelTextPreview');
const getModelLabelTextPreview = () => $i(modelLabelTextPreviewId);

const modelLabelStyleSelectId = genCssName('modelLabelStyleSelect');
const getModelLabelStyleSelect = () => $i(modelLabelStyleSelectId);

const modelLabelOverwriteCyanIconToGrayCheckboxId = genCssName('modelLabelOverwriteCyanIconToGray');
const getModelLabelOverwriteCyanIconToGrayCheckbox = () => $i(modelLabelOverwriteCyanIconToGrayCheckboxId);

const modelLabelUseIconForReasoningModelsSelectId = genCssName('modelLabelUseIconForReasoningModelsSelect');
const getModelLabelUseIconForReasoningModelsSelect = () => $i(modelLabelUseIconForReasoningModelsSelectId);

const modelLabelReasoningModelIconColorId = genCssName('modelLabelReasoningModelIconColor');
const getModelLabelReasoningModelIconColor = () => $i(modelLabelReasoningModelIconColorId);

const modelLabelRemoveCpuIconCheckboxId = genCssName('modelLabelRemoveCpuIconCheckbox');
const getModelLabelRemoveCpuIconCheckbox = () => $i(modelLabelRemoveCpuIconCheckboxId);

const modelLabelLargerIconsCheckboxId = genCssName('modelLabelLargerIconsCheckbox');
const getModelLabelLargerIconsCheckbox = () => $i(modelLabelLargerIconsCheckboxId);

const modelLabelIconsSelectId = genCssName('modelLabelIconsSelect');
const getModelLabelIconsSelect = () => $i(modelLabelIconsSelectId);

const modelPreferBaseModelIconCheckboxId = genCssName('modelPreferBaseModelIcon');
const getModelPreferBaseModelIconCheckbox = () => $i(modelPreferBaseModelIconCheckboxId);

const customModelPopoverSelectId = genCssName('customModelPopoverSelect');
const getCustomModelPopoverSelect = () => $i(customModelPopoverSelectId);

const modelIconsInPopoverCheckboxId = genCssName('modelIconsInPopoverCheckbox');
const modelSelectionListItemsMaxSelectId = genCssName('modelSelectionListItemsMaxSelect');
const getModelIconsInPopoverCheckbox = () => $i(modelIconsInPopoverCheckboxId);
const getModelSelectionListItemsMaxSelect = () => $i(modelSelectionListItemsMaxSelectId);

const mainCaptionHtmlTextAreaId = genCssName('mainCaptionHtmlTextArea');
const getMainCaptionHtmlTextArea = () => $i(mainCaptionHtmlTextAreaId);

const customJsTextAreaId = genCssName('customJsTextArea');
const getCustomJsTextArea = () => $i(customJsTextAreaId);

const customCssTextAreaId = genCssName('customCssTextArea');
const getCustomCssTextArea = () => $i(customCssTextAreaId);

const customWidgetsHtmlTextAreaId = genCssName('customWidgetsHtmlTextArea');
const getCustomWidgetsHtmlTextArea = () => $i(customWidgetsHtmlTextAreaId);

const mainCaptionHtmlEnabledId = genCssName('mainCaptionHtmlEnabled');
const customJsEnabledId = genCssName('customJsEnabled');
const customCssEnabledId = genCssName('customCssEnabled');
const customWidgetsHtmlEnabledId = genCssName('customWidgetsHtmlEnabled');

const getMainCaptionHtmlEnabledCheckbox = () => $i(mainCaptionHtmlEnabledId);
const getCustomJsEnabledCheckbox = () => $i(customJsEnabledId);
const getCustomCssEnabledCheckbox = () => $i(customCssEnabledId);
const getCustomWidgetsHtmlEnabledCheckbox = () => $i(customWidgetsHtmlEnabledId);

const hideSideMenuLabelsId = genCssName('hideSideMenuLabels');
const getHideSideMenuLabels = () => $i(hideSideMenuLabelsId);

const autoOpenSettingsCheckboxId = genCssName('autoOpenSettings');
const getAutoOpenSettingsCheckbox = () => $i(autoOpenSettingsCheckboxId);

const debugModalCreationCheckboxId = genCssName('debugModalCreation');
const getDebugModalCreationCheckbox = () => $i(debugModalCreationCheckboxId);

const debugEventHooksCheckboxId = genCssName('debugEventHooks');
const getDebugEventHooksCheckbox = () => $i(debugEventHooksCheckboxId);

const debugReplaceIconsInMenuCheckboxId = genCssName('debugReplaceIconsInMenu');
const getDebugReplaceIconsInMenuCheckbox = () => $i(debugReplaceIconsInMenuCheckboxId);

const quickProfileButtonEnabledCheckboxId = genCssName('quickProfileButtonEnabled');
const getQuickProfileButtonEnabledCheckbox = () => $i(quickProfileButtonEnabledCheckboxId);
const quickProfileAddButtonId = genCssName('quickProfileAddButton');
const getQuickProfileAddButton = () => $i(quickProfileAddButtonId);
const quickProfileModelSelectId = genCssName('quickProfileModelSelect');
const getQuickProfileModelSelect = () => $i(quickProfileModelSelectId);
const quickProfileListId = genCssName('quickProfileList');
const getQuickProfileList = () => $i(quickProfileListId);
const quickProfileAddNonExistingModelButtonId = genCssName('quickProfileAddNonExistingModelButton');
const getQuickProfileAddNonExistingModelButton = () => $i(quickProfileAddNonExistingModelButtonId);
const showRemoveAllUploadedFilesButtonId = genCssName('showRemoveAllUploadedFilesButton');
const getShowRemoveAllUploadedFilesButton = () => $i(showRemoveAllUploadedFilesButtonId);

const copyTextToClipboard = async text => {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard', { text });
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};

const genColorPart = color => `<color:${color}>`;

const loadCurrentConfigToSettingsForm = () => {
  // Go away stupid AI!
  const savedStatesRaw = JSON.parse(localStorage.getItem(storageKey));
  if (savedStatesRaw === null) { return; }
  const savedStates = { ...defaultConfig, ...savedStatesRaw };
  // Do **NOT** replace with `loadConfigOrDefault()` or you will burn in hell for all eternity!

  getCoPilotNewThreadAutoSubmitCheckbox().prop('checked', savedStates.coPilotNewThreadAutoSubmit);
  getCoPilotRepeatLastAutoSubmitCheckbox().prop('checked', savedStates.coPilotRepeatLastAutoSubmit);
  getHideSideMenuCheckbox().prop('checked', savedStates.hideSideMenu);
  getTagsEnabledCheckbox().prop('checked', savedStates.tagsEnabled);
  getTagsTextArea().val(savedStates.tagsText);
  getTagColorPicker().val(savedStates.tagColor);
  getEnableDebugCheckbox().prop('checked', savedStates.debugMode);
  getEnableTagsDebugCheckbox().prop('checked', savedStates.debugTagsMode);
  getDebugTagsSuppressSubmitCheckbox().prop('checked', savedStates.debugTagsSuppressSubmit);
  getTagPaletteSelect().val(savedStates.tagPalette);
  getTagFontSelect().val(savedStates.tagFont);
  getTagTweakNoBorderCheckbox().prop('checked', savedStates.tagTweakNoBorder);
  getTagTweakSlimPaddingCheckbox().prop('checked', savedStates.tagTweakSlimPadding);
  getTagTweakRichBorderColorCheckbox().prop('checked', savedStates.tagTweakRichBorderColor);
  getTagTweakTextShadowCheckbox().prop('checked', savedStates.tagTweakTextShadow);
  getTagHomePageLayoutSelect().val(savedStates.tagHomePageLayout);
  getTagContainerExtraBottomMarginInput().val(savedStates.tagContainerExtraBottomMargin);
  getTagLuminanceThresholdInput().val(savedStates.tagLuminanceThreshold);
  getTagBoldCheckbox().prop('checked', savedStates.tagBold);
  getTagItalicCheckbox().prop('checked', savedStates.tagItalic);
  getTagFontSizeInput().val(savedStates.tagFontSize);
  getTagIconSizeInput().val(savedStates.tagIconSize);
  getTagRoundnessInput().val(savedStates.tagRoundness);
  getTagTextYOffsetInput().val(savedStates.tagTextYOffset);
  getTagIconYOffsetInput().val(savedStates.tagIconYOffset);
  getTagTweakNoBorderCheckbox().prop('checked', savedStates?.tagTweakNoBorder);
  getTagTweakSlimPaddingCheckbox().prop('checked', savedStates?.tagTweakSlimPadding);
  getTagTweakRichBorderColorCheckbox().prop('checked', savedStates?.tagTweakRichBorderColor);
  getTagTweakTextShadowCheckbox().prop('checked', savedStates?.tagTweakTextShadow);
  getTagToggleSaveCheckbox().prop('checked', savedStates.tagToggleSave);
  getToggleModeHooksCheckbox().prop('checked', savedStates.toggleModeHooks);
  getTagToggleModeIndicatorsCheckbox().prop('checked', savedStates.tagToggleModeIndicators);
  getReplaceIconsInMenu().val(savedStates.replaceIconsInMenu);
  getSlimLeftMenuCheckbox().prop('checked', savedStates.slimLeftMenu);
  getHideHomeWidgetsCheckbox().prop('checked', savedStates.hideHomeWidgets);
  getHideDiscoverButtonCheckbox().prop('checked', savedStates.hideDiscoverButton);
  getHideRelatedCheckbox().prop('checked', savedStates.hideRelated);
  getHideUpgradeToMaxAdsSelect().val(savedStates.hideUpgradeToMaxAds);
  getFixImageGenerationOverlayCheckbox().prop('checked', savedStates.fixImageGenerationOverlay);
  getExtraSpaceBellowLastAnswerCheckbox().prop('checked', savedStates.extraSpaceBellowLastAnswer);
  getModelLabelTextModeSelect().val(savedStates.modelLabelTextMode);
  getModelLabelStyleSelect().val(savedStates.modelLabelStyle);
  getModelLabelRemoveCpuIconCheckbox().prop('checked', savedStates.modelLabelRemoveCpuIcon);
  getModelLabelLargerIconsCheckbox().prop('checked', savedStates.modelLabelLargerIcons);
  getModelLabelOverwriteCyanIconToGrayCheckbox().prop('checked', savedStates.modelLabelOverwriteCyanIconToGray);
  getModelLabelUseIconForReasoningModelsSelect().val(savedStates.modelLabelUseIconForReasoningModels ?? MODEL_LABEL_ICON_REASONING_MODEL.OFF);
  getModelLabelReasoningModelIconColor().val(savedStates.modelLabelReasoningModelIconColor || '#ffffff');
  getModelLabelIconsSelect().val(savedStates.modelLabelIcons ?? MODEL_LABEL_ICONS.OFF);
  getCustomModelPopoverSelect().val(savedStates.customModelPopover ?? CUSTOM_MODEL_POPOVER_MODE.SIMPLE_GRID);
  getModelIconsInPopoverCheckbox().prop('checked', savedStates.modelIconsInPopover);
  getModelSelectionListItemsMaxSelect().val(savedStates.modelSelectionListItemsMax ?? MODEL_SELECTION_LIST_ITEMS_MAX_OPTIONS.OFF);
  getTagPaletteCustomTextArea().val((savedStates.tagPaletteCustom || []).join(', '));
  getMainCaptionHtmlTextArea().val(savedStates.mainCaptionHtml);
  getCustomJsTextArea().val(savedStates.customJs);
  getCustomCssTextArea().val(savedStates.customCss);
  getCustomWidgetsHtmlTextArea().val(savedStates.customWidgetsHtml);
  getMainCaptionHtmlEnabledCheckbox().prop('checked', savedStates.mainCaptionHtmlEnabled);
  getCustomJsEnabledCheckbox().prop('checked', savedStates.customJsEnabled);
  getCustomCssEnabledCheckbox().prop('checked', savedStates.customCssEnabled);
  getCustomWidgetsHtmlEnabledCheckbox().prop('checked', savedStates.customWidgetsHtmlEnabled);
  getHideSideMenuLabels().prop('checked', savedStates.hideSideMenuLabels);
  getLeftMarginOfThreadContentInput().val(savedStates.leftMarginOfThreadContent);
  getAutoOpenSettingsCheckbox().prop('checked', savedStates.autoOpenSettings);
  getDebugModalCreationCheckbox().prop('checked', savedStates.debugModalCreation);
  getDebugEventHooksCheckbox().prop('checked', savedStates.debugEventHooks);
  getModelPreferBaseModelIconCheckbox().prop('checked', savedStates.modelPreferBaseModelIcon);
  getDebugReplaceIconsInMenuCheckbox().prop('checked', savedStates.debugReplaceIconsInMenu);
  getLeftMarginOfThreadContentEnabled().prop('checked', savedStates.leftMarginOfThreadContentEnabled);
  getLeftMarginOfThreadContentInput().val(savedStates.leftMarginOfThreadContent);
  getShowRemoveAllUploadedFilesButton().prop('checked', savedStates.showRemoveAllUploadedFilesButton);
  getQuickProfileButtonEnabledCheckbox().prop('checked', savedStates.quickProfileButtonEnabled);
};

function handleSettingsInit() {
  const modalExists = getPerplexityHelperModal().length > 0;
  const firstCheckboxExists = getCoPilotNewThreadAutoSubmitCheckbox().length > 0;

  if (!modalExists || firstCheckboxExists) { return; }

  const $tabButtons = $c(modalTabGroupTabsCls).addClass('flex gap-2 items-end');

  const setActiveTab = (tabName) => {
    $c(modalTabGroupTabsCls).find('> button').each((_, tab) => {
      const $tab = jq(tab);
      if ($tab.attr('data-tab') === tabName) {
        $tab.addClass(modalTabGroupActiveCls);
      } else {
        $tab.removeClass(modalTabGroupActiveCls);
      }
    });
    $c(modalTabGroupContentCls).each((_, tab) => {
      const $tab = jq(tab);
      if ($tab.attr('data-tab') === tabName) {
        $tab.show();
      } else {
        $tab.hide();
      }
    });

    // Save the active tab to config
    const config = loadConfigOrDefault();
    saveConfig({
      ...config,
      activeSettingsTab: tabName
    });
  };

  const createTabContent = (tabName, tabLabel) => {
    const $tabButton = jq('<button/>').text(tabLabel).attr('data-tab', tabName).on('click', () => setActiveTab(tabName));
    $tabButtons.append($tabButton);
    const $tabContent = jq('<div/>')
      .addClass(modalTabGroupContentCls)
      .attr('data-tab', tabName);
    getSettingsModalContent().append($tabContent);
    return $tabContent;
  };

  const insertSeparator = () => getSettingsLastTabGroupContent().append('<hr/>');

  // -------------------------------------------------------------------------------------------------------------------
  createTabContent('general', 'General');

  createCheckbox(hideSideMenuCheckboxId, 'Hide Side Menu ⚠️', saveConfigFromForm);
  createCheckbox(slimLeftMenuCheckboxId, 'Slim Left Menu', saveConfigFromForm);
  createCheckbox(hideHomeWidgetsCheckboxId, 'Hide Home Page Widgets', saveConfigFromForm);
  createCheckbox(hideSideMenuLabelsId, 'Hide Side Menu Labels', saveConfigFromForm);
  createCheckbox(showRemoveAllUploadedFilesButtonId, 'Show "Remove all uploaded files" button', () => {
    saveConfigFromForm();
  });
  createCheckbox(hideDiscoverButtonCheckboxId, 'Hide Discover Button', saveConfigFromForm);
  createCheckbox(hideRelatedCheckboxId, 'Hide Related', saveConfigFromForm);
  createSelect(
    hideUpgradeToMaxAdsSelectId,
    'Hide Upgrade to Max Ads ⚠️ Experimental',
    Object.values(HIDE_UPGRADE_TO_MAX_ADS_OPTIONS).map(value => ({ value, label: value })),
    saveConfigFromForm
  );
  createCheckbox(fixImageGenerationOverlayCheckboxId, 'Fix Image Generation Overlay Position (Experimental; only use if you encounter the submit button in a custom image prompt outside of the viewport)', saveConfigFromForm);
  createCheckbox(extraSpaceBellowLastAnswerCheckboxId, 'Add extra space bellow last answer', saveConfigFromForm);
  createSelect(
    replaceIconsInMenuId,
    'Replace menu icons',
    Object.values(ICON_REPLACEMENT_MODE).map(value => ({ value, label: value })),
    () => {
      saveConfigFromForm();
      handleReplaceIconsInMenu();
    }
  );
  createCheckbox(leftMarginOfThreadContentEnabledId, 'Left margin of thread content', saveConfigFromForm);
  createNumberInput(
    leftMarginOfThreadContentInputId,
    'Left margin of thread content (in em; empty for disabled; 0 for removing left whitespace in thread with normal sidebar width; -1 for slim sidebar)',
    saveConfigFromForm,
    { min: -10, max: 10, step: 0.5 }
  );


  // -------------------------------------------------------------------------------------------------------------------
  createTabContent('model', 'Model');

  createSelect(
    modelLabelStyleSelectId,
    'Model Label Style',
    Object.values(MODEL_LABEL_STYLE).map(value => ({ value, label: value })),
    () => {
      saveConfigFromForm();
      // Update preview when style changes too (NO_TEXT turns preview text empty)
      const config = loadConfigOrDefault();
      const sample = PP?.getAnyModelButton ? PP.getAnyModelButton().first() : null;
      if (getModelLabelTextPreview().length && sample?.length) {
        const modelDescription = PP.getModelDescriptionFromModelButton(sample);
        const aria = sample.attr('aria-label');
        const label = config.modelLabelStyle === MODEL_LABEL_STYLE.NO_TEXT ? '' : getLabelFromModelDescription(config.modelLabelTextMode)(aria)(modelDescription);
        getModelLabelTextPreview().text(`Preview: ${label || '(empty)'}`);
      }
    }
  );
  createSelect(
    modelLabelTextModeSelectId,
    'Model Label Text',
    Object.values(MODEL_LABEL_TEXT_MODE).map(value => ({ value, label: value })),
    () => {
      saveConfigFromForm();
      // Live preview of selected text mode
      const config = loadConfigOrDefault();
      const sample = PP?.getAnyModelButton ? PP.getAnyModelButton().first() : null;
      if (getModelLabelTextPreview().length === 0) {
        const preview = jq('<div/>').attr('id', modelLabelTextPreviewId).css({ marginTop: '4px', opacity: 0.8 });
        getSettingsLastTabGroupContent().append(preview);
      }
      if (sample?.length) {
        const modelDescription = PP.getModelDescriptionFromModelButton(sample);
        const aria = sample.attr('aria-label');
        const label = config.modelLabelStyle === MODEL_LABEL_STYLE.NO_TEXT ? '' : getLabelFromModelDescription(config.modelLabelTextMode)(aria)(modelDescription);
        getModelLabelTextPreview().text(`Preview: ${label || '(empty)'}`);
      } else {
        getModelLabelTextPreview().text('Preview: (no model button found)');
      }
    }
  );
  // Initial preview render
  if (getModelLabelTextPreview().length === 0) {
    const preview = jq('<div/>').attr('id', modelLabelTextPreviewId).css({ marginTop: '4px', opacity: 0.8 });
    const cfg = loadConfigOrDefault();
    const sample = PP?.getAnyModelButton ? PP.getAnyModelButton().first() : null;
    if (sample?.length) {
      const modelDescription = PP.getModelDescriptionFromModelButton(sample);
      const aria = sample.attr('aria-label');
      const label = cfg.modelLabelStyle === MODEL_LABEL_STYLE.NO_TEXT ? '' : getLabelFromModelDescription(cfg.modelLabelTextMode)(aria)(modelDescription);
      preview.text(`Preview: ${label || '(empty)'}`);
    } else {
      preview.text('Preview: (no model button found)');
    }
    getSettingsLastTabGroupContent().append(preview);
  }
  createCheckbox(modelLabelOverwriteCyanIconToGrayCheckboxId, 'Overwrite Model Icon: Cyan -> Gray', saveConfigFromForm);
  createSelect(
    modelLabelUseIconForReasoningModelsSelectId,
    'Use icon for reasoning models',
    Object.values(MODEL_LABEL_ICON_REASONING_MODEL).map(value => ({ value, label: value })),
    saveConfigFromForm
  );
  createColorInput(modelLabelReasoningModelIconColorId, 'Color for reasoning model icon', saveConfigFromForm);
  createSelect(
    modelLabelIconsSelectId,
    'Model Label Icons',
    Object.values(MODEL_LABEL_ICONS).map(value => ({ value, label: value })),
    saveConfigFromForm
  );
  createSelect(
    customModelPopoverSelectId,
    'Custom Model Popover (Experimental)',
    Object.values(CUSTOM_MODEL_POPOVER_MODE).map(value => ({ value, label: value })),
    saveConfigFromForm
  );
  createCheckbox(modelIconsInPopoverCheckboxId, 'Model Icons In Popover', saveConfigFromForm);
  createSelect(
    modelSelectionListItemsMaxSelectId,
    'Model Selection List Items "Max"',
    Object.values(MODEL_SELECTION_LIST_ITEMS_MAX_OPTIONS).map(value => ({ value, label: value })),
    saveConfigFromForm
  );
  createCheckbox(modelLabelRemoveCpuIconCheckboxId, 'Remove CPU icon', saveConfigFromForm);
  createCheckbox(modelLabelLargerIconsCheckboxId, 'Use larger model icons', saveConfigFromForm);
  createCheckbox(modelPreferBaseModelIconCheckboxId, 'Prefer Base Model Company Icon', saveConfigFromForm);

  // -------------------------------------------------------------------------------------------------------------------
  createTabContent('tags', 'Tags');

  createCheckbox(tagsEnabledId, 'Enable Tags', saveConfigFromForm);

  createTextArea(tagsTextAreaId, 'Tags', saveConfigFromForm, tagsHelpText, [
    { icon: 'l:images', tooltip: 'Lucide Icons', url: 'https://lucide.dev/icons' },
    { icon: 'td:image', tooltip: 'TDesign Icons', url: 'https://tdesign.tencent.com/design/icon-en#header-69' }
  ])
    .prop('rows', 12).css('min-width', '700px').prop('wrap', 'off');

  // Minimal inline tag editor (experimental)
  // TODO: should keep at least blank lines, ideally only change the line of a tag which user changed
  // TODO: doesn't support and most likely DELETES fields: hide, link, link-target, toggle-mode, set-mode, set-model, set-sources, auto-submit, dir, in-dir, fence, in-fence, fence-width, fence-border-style, fence-border-color, fence-border-width
  const createTagEditor = () => {
    const wrapper = jq('<div/>').attr('id', tagEditorWrapperId);
    const header = jq('<div/>').addClass('flex items-center gap-2');
    const title = jq('<div/>').html('Tag editor (experimental❗ It may break your tags, certainly removes whitespace, most likely all advanced fields from ALL tags. So <b>backup up</b> before clicking: Settings -> Export Settings): ').css({ borderLeft: '5px solid #f00', paddingLeft: '10px' });
    const openBtn = jq('<button/>').attr('id', tagEditorOpenButtonId).text('⚠️ Editor');
    header.append(title).append(openBtn);
    const table = jq('<table/>').addClass(tagEditorTableCls).css({ width: '100%', borderSpacing: '6px', borderCollapse: 'separate' });
    const thead = jq('<thead/>').append('<tr><th>Label</th><th>Text</th><th>Color</th><th>Target</th><th>Icon</th><th>Actions</th></tr>');
    const tbody = jq('<tbody/>');
    table.append(thead).append(tbody);
    wrapper.append(header).append(table);

    const targets = [TAG_CONTAINER_TYPE.NEW, TAG_CONTAINER_TYPE.THREAD, TAG_CONTAINER_TYPE.ALL, TAG_CONTAINER_TYPE.NEW_IN_COLLECTION];

    const readTags = () => parseTagsText(getTagsTextArea().val() ?? '');
    const serializeTag = (t) => {
      const parts = [];
      if (t.label) parts.push(`<label:${t.label}>`);
      if (t.color) parts.push(`<color:${t.color}>`);
      if (t.target) parts.push(`<target:${t.target}>`);
      if (t.icon) parts.push(`<icon:${t.icon}>`);
      return `${t.text || ''}${parts.join('')}`;
    };
    const saveTags = (tags) => {
      const text = tags.map(serializeTag).join('\n');
      getTagsTextArea().val(text);
      saveConfigFromForm();
      refreshTags({ force: true });
    };

    const render = () => {
      tbody.empty();
      const tags = readTags();
      tags.forEach((t, idx) => {
        const tr = jq('<tr/>').addClass(tagEditorRowCls);
        const tdLabel = jq('<td/>');
        const tdText = jq('<td/>');
        const tdColor = jq('<td/>');
        const tdTarget = jq('<td/>');
        const tdIcon = jq('<td/>');
        const tdActions = jq('<td/>');

        const inLabel = jq('<input type="text"/>').val(t.label ?? '').css('width', '10em');
        const inText = jq('<input type="text"/>').val(t.text ?? '').css('width', '24em');
        const inColor = jq('<input type="text" placeholder="%0 or #rrggbb"/>').val(t.color ?? '').css('width', '10em');
        const inTarget = jq('<select/>').css('width', '10em');
        targets.forEach(v => jq('<option/>').val(v).text(v).appendTo(inTarget));
        inTarget.val(targets.includes(t.target) ? t.target : targets[0]);
        const inIcon = jq('<input type="text" placeholder="lucide name"/>').val(t.icon ?? '').css('width', '10em');
        const btnDel = jq('<button/>').text('Delete');

        tdLabel.append(inLabel);
        tdText.append(inText);
        tdColor.append(inColor);
        tdTarget.append(inTarget);
        tdIcon.append(inIcon);
        tdActions.append(btnDel);
        tr.append(tdLabel, tdText, tdColor, tdTarget, tdIcon, tdActions);
        tbody.append(tr);

        const sync = () => {
          const tagsNow = readTags();
          tagsNow[idx] = {
            ...tagsNow[idx],
            label: inLabel.val(),
            text: inText.val(),
            color: inColor.val(),
            target: inTarget.val(),
            icon: inIcon.val(),
          };
          saveTags(tagsNow);
        };
        inLabel.on('change', sync);
        inText.on('change', sync);
        inColor.on('change', sync);
        inTarget.on('change', sync);
        inIcon.on('change', sync);
        btnDel.on('click', () => {
          const tagsNow = readTags();
          tagsNow.splice(idx, 1);
          saveTags(tagsNow);
          render();
        });
      });

      // Add row
      const trAdd = jq('<tr/>');
      const tdAdd = jq('<td colspan="6"/>');
      const btnAdd = jq('<button/>').text('Add tag');
      btnAdd.on('click', () => {
        const tagsNow = readTags();
        tagsNow.push({ text: '', color: defaultTagColor, target: TAG_CONTAINER_TYPE.NEW });
        saveTags(tagsNow);
        render();
      });
      tdAdd.append(btnAdd);
      trAdd.append(tdAdd);
      tbody.append(trAdd);
    };

    openBtn.on('click', () => {
      wrapper.toggleClass('open');
      render();
    });

    // initial state collapsed
    table.hide();
    wrapper.on('click', (e) => {
      if (jq(e.target).attr('id') === tagEditorOpenButtonId) {
        table.toggle();
      }
    });

    return wrapper;
  };

  if (loadConfigOrDefault().debugMode) {
    getSettingsLastTabGroupContent().append(createTagEditor());
  }

  const paletteLegendContainer = jq('<div/>').attr('id', 'palette-legend-container');
  getSettingsLastTabGroupContent().append(paletteLegendContainer);

  const updatePaletteLegend = () => {
    paletteLegendContainer.empty().append(createPaletteLegend(loadConfig()?.tagPalette));
  };

  updatePaletteLegend();

  createSelect(
    tagPaletteSelectId,
    'Tag color palette',
    Object.keys(TAGS_PALETTES).map(key => ({ value: key, label: key })),
    () => {
      saveConfigFromForm();
      updatePaletteLegend();
      refreshTags();
    }
  );

  createTextArea(
    tagPaletteCustomTextAreaId,
    'Custom Palette Colors (comma-separated):',
    () => {
      saveConfigFromForm();
      // Update legend and tags only if CUSTOM is the selected palette
      if (getTagPaletteSelect().val() === TAGS_PALETTES.CUSTOM) {
        updatePaletteLegend();
        refreshTags();
      }
    }
  ).prop('rows', 2); // Make it a bit smaller than the main tags text area

  createTagsPreview();

  const FONTS = Object.keys(fontUrls);

  createCheckbox(tagToggleSaveCheckboxId, 'Save toggle-mode tag states', () => {
    const isEnabled = getTagToggleSaveCheckbox().prop('checked');
    // If we're turning off the setting, reset saved toggle states
    if (!isEnabled) {
      const config = loadConfigOrDefault();
      if (config.tagToggledStates && Object.keys(config.tagToggledStates).length > 0) {
        if (confirm('Do you want to clear all saved toggle states?')) {
          const updatedConfig = {
            ...config,
            tagToggledStates: {}
          };
          saveConfig(updatedConfig);
        }
      }
    }
    saveConfigFromForm();
  });

  createCheckbox(toggleModeHooksCheckboxId, 'Toggle mode hooks (experimental)', saveConfigFromForm);
  createCheckbox(tagToggleModeIndicatorsCheckboxId, 'Toggle mode indicators', saveConfigFromForm);

  // Add a reset button for toggle states
  const resetToggleStatesButton = jq('<button>')
    .text('Reset All Toggle States')
    .on('click', () => {
      resetAllToggleStates();
    })
    .css({
      marginLeft: '10px',
      marginBottom: '10px',
      padding: '3px 8px',
      fontSize: '0.9em'
    });
  getSettingsLastTabGroupContent().append(resetToggleStatesButton);

  createSelect(
    tagFontSelectId,
    'Tag font',
    FONTS.map(font => ({ value: font, label: font })),
    () => {
      saveConfigFromForm();
      loadFont(loadConfigOrDefault().tagFont);
      refreshTags({ force: true });
    }
  );
  createColorInput(tagColorPickerId, 'Custom color - copy field for tag to clipboard', () => {
    const color = getTagColorPicker().val();
    debugLog('color', color);
    copyTextToClipboard(genColorPart(color));
  });
  const saveConfigFromFormAndForceRefreshTags = () => {
    saveConfigFromForm();
    refreshTags({ force: true });
  };

  createCheckbox(tagBoldCheckboxId, 'Bold text', saveConfigFromFormAndForceRefreshTags);
  createCheckbox(tagItalicCheckboxId, 'Italic text', saveConfigFromFormAndForceRefreshTags);

  createNumberInput(
    tagFontSizeInputId,
    'Font size',
    saveConfigFromFormAndForceRefreshTags,
    { min: 4, max: 64 }
  );

  createNumberInput(
    tagIconSizeInputId,
    'Icon size',
    saveConfigFromFormAndForceRefreshTags,
    { min: 4, max: 64 }
  );

  createNumberInput(
    tagRoundnessInputId,
    'Tag Roundness (px)',
    saveConfigFromFormAndForceRefreshTags,
    { min: 0, max: 32 }
  );

  createNumberInput(
    tagTextYOffsetInputId,
    'Text Y offset',
    saveConfigFromFormAndForceRefreshTags,
    { step: 1, min: -50, max: 50 }
  );

  createNumberInput(
    tagIconYOffsetInputId,
    'Icon Y offset',
    saveConfigFromFormAndForceRefreshTags,
    { step: 1, min: -50, max: 50 }
  );

  createCheckbox(tagTweakNoBorderCheckboxId, 'No border', saveConfigFromFormAndForceRefreshTags);
  createCheckbox(tagTweakSlimPaddingCheckboxId, 'Slim padding', saveConfigFromFormAndForceRefreshTags);
  createCheckbox(tagTweakRichBorderColorCheckboxId, 'Rich Border Color', saveConfigFromFormAndForceRefreshTags);
  createCheckbox(tagTweakTextShadowCheckboxId, 'Text shadow', saveConfigFromFormAndForceRefreshTags);
  createNumberInput(
    tagLuminanceThresholdInputId,
    'Tag Luminance Threshold (determines if tag is light or dark)',
    saveConfigFromFormAndForceRefreshTags,
    { step: 0.01, min: 0, max: 1 }
  );
  createSelect(
    tagHomePageLayoutSelectId,
    'Tag container layout on home page (requires page refresh)',
    Object.values(TAG_HOME_PAGE_LAYOUT).map(value => ({ value, label: value })),
    saveConfigFromForm
  );
  createNumberInput(
    tagContainerExtraBottomMarginInputId,
    'Extra bottom margin on home page (em)',
    saveConfigFromFormAndForceRefreshTags,
    { min: 0, max: 10, step: 0.5 }
  );

  const $modelsList = jq('<div/>').text('Model IDs: ');
  const modelIds = PP.modelDescriptors.map(md => md.ppModelId).join(', ');
  $modelsList.append(modelIds);
  getSettingsLastTabGroupContent().append($modelsList);

  // -------------------------------------------------------------------------------------------------------------------
  createTabContent('quick-profile', 'Quick Profile');
  createCheckbox(quickProfileButtonEnabledCheckboxId, 'Enable Quick Profile Button', saveConfigFromForm);
  const quickProfileList = jq('<div/>').attr('id', quickProfileListId);
  getSettingsLastTabGroupContent().append(quickProfileList);
  const quickProfileAddButton = jq('<button/>').attr('id', quickProfileAddButtonId).text('Add');
  const quickProfileModelSelect = jq('<select/>').attr('id', quickProfileModelSelectId);
  const bugIcon = jq('<img/>').attr('src', getLucideIconUrl('bug')).addClass('invert w-4 opacity-75');
  const quickProfileAddNonExistingModelButton = jq('<button/>').attr('id', quickProfileAddNonExistingModelButtonId).text('Add Non-Existing Model').prepend(bugIcon).addClass('flex gap-1');
  // Fill select excluding legacy models
  const isLegacyModel = md => Boolean(md?.legacy);
  PP.modelDescriptors
    .filter(md => !isLegacyModel(md))
    .forEach(model => {
      quickProfileModelSelect.append(jq(`<option value="${model.ppModelId}">${model.nameEn}</option>`));
    });
  const quickProfileControls = jq('<div/>').addClass('flex gap-2').append(quickProfileModelSelect).append(quickProfileAddButton);
  if (loadConfigOrDefault().debugMode) quickProfileControls.append(quickProfileAddNonExistingModelButton);
  getSettingsLastTabGroupContent().append(quickProfileControls);

  // -------------------------------------------------------------------------------------------------------------------
  createTabContent('raw', 'Raw (HTML, CSS, JS)');

  createCheckbox(mainCaptionHtmlEnabledId, 'Enable Main Caption HTML', saveConfigFromForm);
  createTextArea(mainCaptionHtmlTextAreaId, 'Main Caption HTML', saveConfigFromForm)
    .prop('rows', 8).css('min-width', '700px');

  insertSeparator();

  createCheckbox(customWidgetsHtmlEnabledId, 'Enable Custom Widgets HTML', saveConfigFromForm);
  createTextArea(customWidgetsHtmlTextAreaId, 'Custom Widgets HTML', saveConfigFromForm)
    .prop('rows', 8).css('min-width', '700px');

  insertSeparator();

  createCheckbox(customCssEnabledId, 'Enable Custom CSS', saveConfigFromForm);
  createTextArea(customCssTextAreaId, 'Custom CSS', saveConfigFromForm)
    .prop('rows', 8).css('min-width', '700px');

  insertSeparator();

  createCheckbox(customJsEnabledId, 'Enable Custom JavaScript', saveConfigFromForm);
  createTextArea(customJsTextAreaId, 'Custom JS', saveConfigFromForm)
    .prop('rows', 8).css('min-width', '700px');

  // -------------------------------------------------------------------------------------------------------------------
  createTabContent('settings', 'Settings');

  getSettingsLastTabGroupContent().append(jq('<div/>').text('Settings are stored in your browser\'s local storage. It is recommended to backup your settings via the export button below after every change.'));

  const buttonsContainer = jq('<div/>').addClass('flex gap-2');
  getSettingsLastTabGroupContent().append(buttonsContainer);

  const createExportButton = () => {
    const exportButton = jq('<button>')
      .text('Export Settings')
      .on('click', () => {
        const settings = JSON.stringify(getSavedStates(), null, 2);
        const blob = new Blob([settings], { type: 'application/json' });
        const date = new Date().toISOString().replace(/[:]/g, '-').replace(/T/g, '--').split('.')[0]; // Format: YYYY-MM-DD--HH-MM-SS
        const filename = `perplexity-helper-settings_${date}.json`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    buttonsContainer.append(exportButton);
  };
  createExportButton();

  const createImportButton = () => {
    const importButton = jq('<button>')
      .text('Import Settings')
      .on('click', () => {
        const input = jq('<input type="file" accept=".json">');
        input.on('change', async (event) => {
          const file = event.target.files[0];
          if (file) {
            // this is a dangerous operation, so we need to confirm it
            const confirmOverwrite = confirm('This will overwrite your current settings. Do you want to continue?');
            if (confirmOverwrite) {
              const reader = new FileReader();
              reader.onload = (e) => {
                try {
                  const settings = JSON.parse(e.target.result);
                  saveConfig(settings);
                  loadCurrentConfigToSettingsForm();
                  refreshTags();
                  alert('Settings imported successfully!');
                } catch (error) {
                  console.error('Error importing settings:', error);
                  alert('Error importing settings. Please check the file format.');
                }
              };
              reader.readAsText(file);
            }
          }
        });
        input.trigger('click');
      });
    buttonsContainer.append(importButton);
  };
  createImportButton();

  // -------------------------------------------------------------------------------------------------------------------
  createTabContent('legacy', 'Legacy');

  createCheckbox(coPilotNewThreadAutoSubmitCheckboxId, 'Auto Submit New Thread With CoPilot', saveConfigFromForm);
  createCheckbox(coPilotRepeatLastAutoSubmitCheckboxId, 'Auto Submit Repeat With CoPilot', saveConfigFromForm);

  // -------------------------------------------------------------------------------------------------------------------
  createTabContent('about', 'About');
  // TODO: probably rewrite as cards (top to bottom: avatar, name, gitlab/X/links, donate?)
  getSettingsLastTabGroupContent().append(jq('<div/>').html(`
    Perplexity Helper is a userscript that adds many quality of life features to Perplexity.<br>
    <br>
    Maintainer: <a href="https://gitlab.com/monnef" target="_blank">monnef</a> <span class="opacity-50">(tags, model picker and labels, rewrite of settings)</span><br>
    Original author: <a href="https://gitlab.com/tiartyos" target="_blank">Tiartyos</a> <span class="opacity-50">(copilot buttons, basic settings)</span>
    `));

  // -------------------------------------------------------------------------------------------------------------------
  createTabContent('debug', 'Debug'); // debug options at the bottom (do NOT add more normal options bellow this!)

  createCheckbox(enableDebugCheckboxId, 'Debug Mode', () => {
    saveConfigFromForm();
    const checked = getEnableDebugCheckbox().prop('checked');
    if (checked) {
      enableDebugMode();
    }
  });

  createCheckbox(enableTagsDebugCheckboxId, 'Debug Tags Mode', () => {
    saveConfigFromForm();
    const checked = getEnableTagsDebugCheckbox().prop('checked');
    if (checked) {
      enableTagsDebugging();
      refreshTags();
    }
  });

  createCheckbox(debugModalCreationCheckboxId, 'Debug: Log Modal Creation', saveConfigFromForm);
  createCheckbox(debugEventHooksCheckboxId, 'Debug: Log Event Hooks', saveConfigFromForm);
  createCheckbox(debugReplaceIconsInMenuCheckboxId, 'Debug: Log Replace Icons In Menu', saveConfigFromForm);

  createCheckbox(debugTagsSuppressSubmitCheckboxId, 'Debug: Suppress Submit After Applying Tags', saveConfigFromForm);

  createCheckbox(autoOpenSettingsCheckboxId, 'Automatically open settings after page load', saveConfigFromForm);

  getSettingsLastTabGroupContent().append(`
    <h2>Lobe Icons test</h2>
    <table style="border-collapse: separate; border-spacing: 20px; width: fit-content;">
      <tr>
        <td>Default</td>
        <td><img src="${getLobeIconsUrl('anthropic')}"></td>
      </tr>
      <tr>
        <td>Default (inverted)</td>
        <td><img class="invert" src="${getLobeIconsUrl('anthropic')}"></td>
      </tr>
    </table>
    `);

  // -------------------------------------------------------------------------------------------------------------------
  // Use the saved active tab if available, otherwise default to 'general'
  const config = loadConfigOrDefault();
  setActiveTab(config.activeSettingsTab || defaultConfig.activeSettingsTab);
  loadCurrentConfigToSettingsForm();

  const renderQuickProfiles = () => {
    const config = loadConfigOrDefault();
    const quickProfiles = config.quickProfiles ?? [];
    const quickProfilesList = getQuickProfileList();
    quickProfilesList.empty();
    quickProfileList.css({
      'margin-bottom': '0.5em',
      'margin-top': '0.5em',
    })
    quickProfiles.forEach((profile, index) => {
      const modelDescriptor = PP.getModelDescriptorFromId(profile.ppModelId);
      const modelName = modelDescriptor?.nameEn ?? '<Unknown>';
      const missing = !modelDescriptor;
      const profileEl = jq('<div>')
        .append(
          jq('<button>')
            .attr('data-index', index)
            .html('✕')
            .css({
              'margin-left': '0.25em',
              'margin-right': '1em',
            })
        )
        .append(`${modelName} (${profile.ppModelId})`)
        .css({
          'padding': '0.5em 0.75em',
          'border-left': `2px solid ${grayPerplexityColor}`,
        })
        ;
      // Reorder buttons
      const btnUp = jq('<button/>').html('&uarr;').css({ marginRight: '0.5em' }).on('click', () => {
        const cfg = loadConfigOrDefault();
        const arr = cfg.quickProfiles ?? [];
        if (index > 0) {
          const newArr = arr.slice();
          const tmp = newArr[index - 1];
          newArr[index - 1] = newArr[index];
          newArr[index] = tmp;
          saveConfig({ ...cfg, quickProfiles: newArr });
          renderQuickProfiles();
        }
      });
      const btnDown = jq('<button/>').html('&darr;').css({ marginRight: '0.25em' }).on('click', () => {
        const cfg = loadConfigOrDefault();
        const arr = cfg.quickProfiles ?? [];
        if (index < arr.length - 1) {
          const newArr = arr.slice();
          const tmp = newArr[index + 1];
          newArr[index + 1] = newArr[index];
          newArr[index] = tmp;
          saveConfig({ ...cfg, quickProfiles: newArr });
          renderQuickProfiles();
        }
      });
      profileEl.prepend(btnDown).prepend(btnUp);
      if (missing) {
        const missingModelLabel = jq('<span/>')
            .text(' Missing model!')
            .css({ color: '#f55', marginLeft: '0.5em', fontWeight: '600' });
        profileEl.append(missingModelLabel);
      }
      quickProfilesList.append(profileEl);
    });
  };

  const modelSelect = getQuickProfileModelSelect();

  getQuickProfileAddButton().click(() => {
    const config = loadConfigOrDefault();
    const selectedModel = modelSelect.val();
    if (!config.quickProfiles) {
      config.quickProfiles = [];
    }
    if (selectedModel && !config.quickProfiles.some(p => p.ppModelId === selectedModel)) {
      config.quickProfiles.push({ ppModelId: selectedModel });
      saveConfig(config);
      renderQuickProfiles();
    }
  });
  getQuickProfileAddNonExistingModelButton().click(() => {
    const config = loadConfigOrDefault();
    if (!config.quickProfiles) {
      config.quickProfiles = [];
    }
    config.quickProfiles.push({ ppModelId: 'non-existing-' + Math.floor(Math.random() * 1000) });
    saveConfig(config);
    renderQuickProfiles();
  });

  getQuickProfileList().on('click', 'button[data-index]', function() {
    const config = loadConfigOrDefault();
    const index = jq(this).data('index');
    config.quickProfiles.splice(index, 1);
    saveConfig(config);
    renderQuickProfiles();
  });

  renderQuickProfiles();
}

debugLog(jq.fn.jquery);
const getSavedStates = () => JSON.parse(localStorage.getItem(storageKey));

const getModal = () => jq("[data-testid='quick-search-modal'] > div");
const getCopilotToggleButton = textarea => textarea.parent().parent().find('[data-testid="copilot-toggle"]');
const upperControls = () => jq('svg[data-icon="lock"] ~ div:contains("Share")').nthParent(5).closest('.flex.justify-between:not(.grid-cols-3)');

const getControlsArea = () => jq('textarea[placeholder="Ask follow-up"]').parent().parent().children().last();

const getCopilotNewThreadButton = () => jq('#copilot_new_thread');
const getCopilotRepeatLastButton = () => jq('#copilot_repeat_last');
const getSelectAllButton = () => jq('#perplexity_helper_select_all');
const getSelectAllAndSubmitButton = () => jq('#perplexity_helper_select_all_and_submit');
const getCopyPlaceholder = () => jq('#perplexity_helper_copy_placeholder');
const getCopyAndFillInPlaceholder = () => jq('#perplexity_helper_copy_placeholder_and_fill_in');
const getTopSettingsButtonEl = () => $i(topSettingsButtonId);
const getLeftSettingsButtonEl = () => $i(leftSettingsButtonId);
const getSettingsModalContent = () => getPerplexityHelperModal().find(`.modal-content`);
const getSettingsLastTabGroupContent = () => getSettingsModalContent().find(`.${modalTabGroupContentCls}`).last();

const getSubmitBtn0 = () => jq('svg[data-icon="arrow-up"]').last().parent().parent();
const getSubmitBtn1 = () => jq('svg[data-icon="arrow-right"]').last().parent().parent();
const getSubmitBtn2 = () => jq('svg[data-icon="code-fork"]').last().parent().parent();

const isStandardControlsAreaFc = () => !getControlsArea().hasClass('bottom-0');
const getCurrentControlsArea = () => isStandardControlsAreaFc() ? getControlsArea() : getControlsArea().find('.bottom-0');

const getDashedCheckboxButton = () => jq('svg[data-icon="square-dashed"]').parent().parent();
const getStarSVG = () => jq('svg[data-icon="star-christmas"]');
const getSpecifyQuestionBox = () => jq('svg[data-icon="star-christmas"]').parent().parent().parent().last();

const getNumberOfDashedSVGs = () => getSpecifyQuestionBox().find('svg[data-icon="square-dashed"]').length;
const getSpecifyQuestionControlsWrapper = () => getSpecifyQuestionBox().find('button:contains("Continue")').parent();
const getCopiedModal = () => jq('#copied-modal');
const getCopiedModal2 = () => jq('#copied-modal-2');
const getCopyPlaceholderInput = () => getSpecifyQuestionBox().find('textarea');

const getSubmitButton0or2 = () => getSubmitBtn0().length < 1 ? getSubmitBtn2() : getSubmitBtn0();

const questionBoxWithPlaceholderExists = () => getSpecifyQuestionBox().find('textarea')?.attr('placeholder')?.length > 0 ?? false;

// TODO: no longer used? was this for agentic questions?
const selectAllCheckboxes = () => {
  const currentCheckboxes = getDashedCheckboxButton();
  debugLog('checkboxes', currentCheckboxes);

  const removeLastObject = (arr) => {
    if (!_.isEmpty(arr)) {
      debugLog('arr', arr);
      const newArr = _.dropRight(arr, 1);
      debugLog("newArr", newArr);
      getDashedCheckboxButton().last().click();

      return setTimeout(() => {
        removeLastObject(newArr);
      }, 1);

    }
  };

  removeLastObject(currentCheckboxes);
};

const isCopilotOn = (el) => el.hasClass('text-super');

const toggleBtnDot = (btnDot, value) => {
  debugLog(' toggleBtnDot btnDot', btnDot);

  const btnDotInner = btnDot.find('.rounded-full');

  debugLog('btnDotInner', btnDotInner);

  if (!btnDotInner.hasClass('bg-super') && value === true) {
    btnDot.click();
  }
};

const checkForCopilotToggleState = (timer, checkCondition, submitWhenTrue, submitButtonVersion) => {
  debugLog("checkForCopilotToggleState run", timer, checkCondition(), submitWhenTrue, submitButtonVersion);
  if (checkCondition()) {
    clearInterval(timer);
    debugLog("checkForCopilotToggleState condition met, interval cleared");
    const submitBtn = submitButtonVersion === 0 ? getSubmitButton0or2() : getSubmitBtn1();
    debugLog('submitBtn', submitBtn);
    if (submitWhenTrue) {
      submitBtn.click();
    }
  }
};

const openNewThreadModal = (lastQuery) => {
  debugLog('openNewThreadModal', lastQuery);
  const newThreadText = jq(".sticky div").filter(function () {
    return /^New Thread$/i.test(jq(this).text());
  });
  if (!newThreadText.length) {
    debugLog('newThreadText.length should be 1', newThreadText.length);
    return;
  }
  debugLog('newThreadText', newThreadText);

  newThreadText.click();
  setTimeout(() => {
    debugLog('newThreadText.click()');
    const modal = getModal();

    if (modal.length > 0) {
      const textArea = modal.find('textarea');
      if (textArea.length !== 1) debugLog('textArea.length should be 1', textArea.length);

      const newTextArea = textArea.last();
      const textareaElement = newTextArea[0];
      debugLog('textareaElement', textareaElement);
      PP.setPromptAreaValue(newTextArea, lastQuery);

      const copilotButton = getCopilotToggleButton(newTextArea);

      toggleBtnDot(copilotButton, true);
      const isCopilotOnBtn = () => isCopilotOn(copilotButton);

      const coPilotNewThreadAutoSubmit =
        getSavedStates()
          ? getSavedStates().coPilotNewThreadAutoSubmit
          : getCoPilotNewThreadAutoSubmitCheckbox().prop('checked');

      const copilotCheck = () => {
        const ctx = { timer: null };
        ctx.timer = setInterval(() => checkForCopilotToggleState(ctx.timer, isCopilotOnBtn, coPilotNewThreadAutoSubmit, 1), 500);
      };

      copilotCheck();
    } else {
      debugLog('else of modal.length > 0');
    }
  },
    2000);
};

const getLastQuery = () => {
  // wrapper around prompt + response
  const lastQueryBox = jq('svg[data-icon="repeat"]').last().nthParent(7);
  if (lastQueryBox.length === 0) {
    debugLog('lastQueryBox not found');
  }

  const wasCopilotUsed = lastQueryBox.find('svg[data-icon="star-christmas"]').length > 0;
  const lastQueryBoxText = lastQueryBox.find('.whitespace-pre-line').text();

  debugLog('[getLastQuery]', { lastQueryBox, wasCopilotUsed, lastQueryBoxText });
  return lastQueryBoxText ?? null;
};

const saveConfigFromForm = () => {
  const newConfig = {
    ...loadConfigOrDefault(),
    coPilotNewThreadAutoSubmit: getCoPilotNewThreadAutoSubmitCheckbox().prop('checked'),
    coPilotRepeatLastAutoSubmit: getCoPilotRepeatLastAutoSubmitCheckbox().prop('checked'),
    hideSideMenu: getHideSideMenuCheckbox().prop('checked'),
    slimLeftMenu: getSlimLeftMenuCheckbox().prop('checked'),
    hideSideMenuLabels: getHideSideMenuLabels().prop('checked'),
    tagsEnabled: getTagsEnabledCheckbox().prop('checked'),
    tagsText: getTagsTextArea().val(),
    tagPalette: getTagPaletteSelect().val(),
    tagPaletteCustom: getTagPaletteCustomTextArea().val().split(',').map(s => s.trim()),
    tagFont: getTagFontSelect().val(),
    tagHomePageLayout: getTagHomePageLayoutSelect().val(),
    tagContainerExtraBottomMargin: parseFloat(getTagContainerExtraBottomMarginInput().val()),
    tagLuminanceThreshold: parseFloat(getTagLuminanceThresholdInput().val()),
    tagBold: getTagBoldCheckbox().prop('checked'),
    tagItalic: getTagItalicCheckbox().prop('checked'),
    tagFontSize: parseFloat(getTagFontSizeInput().val()),
    tagIconSize: parseFloat(getTagIconSizeInput().val()),
    tagRoundness: parseFloat(getTagRoundnessInput().val()),
    tagTextYOffset: parseFloat(getTagTextYOffsetInput().val()),
    tagIconYOffset: parseFloat(getTagIconYOffsetInput().val()),
    tagToggleSave: getTagToggleSaveCheckbox().prop('checked'),
    toggleModeHooks: getToggleModeHooksCheckbox().prop('checked'),
    tagToggleModeIndicators: getTagToggleModeIndicatorsCheckbox().prop('checked'),
    debugMode: getEnableDebugCheckbox().prop('checked'),
    debugTagsMode: getEnableTagsDebugCheckbox().prop('checked'),
    debugTagsSuppressSubmit: getDebugTagsSuppressSubmitCheckbox().prop('checked'),
    autoOpenSettings: getAutoOpenSettingsCheckbox().prop('checked'),
    replaceIconsInMenu: getReplaceIconsInMenu().val(),
    hideHomeWidgets: getHideHomeWidgetsCheckbox().prop('checked'),
    hideDiscoverButton: getHideDiscoverButtonCheckbox().prop('checked'),
    hideRelated: getHideRelatedCheckbox().prop('checked'),
    hideUpgradeToMaxAds: getHideUpgradeToMaxAdsSelect().val(),
    fixImageGenerationOverlay: getFixImageGenerationOverlayCheckbox().prop('checked'),
    extraSpaceBellowLastAnswer: getExtraSpaceBellowLastAnswerCheckbox().prop('checked'),
    modelLabelTextMode: getModelLabelTextModeSelect().val(),
    modelLabelStyle: getModelLabelStyleSelect().val(),
    modelLabelOverwriteCyanIconToGray: getModelLabelOverwriteCyanIconToGrayCheckbox().prop('checked'),
    modelLabelUseIconForReasoningModels: getModelLabelUseIconForReasoningModelsSelect().val(),
    modelLabelReasoningModelIconColor: getModelLabelReasoningModelIconColor().val(),
    modelLabelRemoveCpuIcon: getModelLabelRemoveCpuIconCheckbox().prop('checked'),
    modelLabelLargerIcons: getModelLabelLargerIconsCheckbox().prop('checked'),
    modelLabelIcons: getModelLabelIconsSelect().val(),
    customModelPopover: getCustomModelPopoverSelect().val(),
    modelIconsInPopover: getModelIconsInPopoverCheckbox().prop('checked'),
    modelSelectionListItemsMax: getModelSelectionListItemsMaxSelect().val(),
    mainCaptionHtml: getMainCaptionHtmlTextArea().val(),
    mainCaptionHtmlEnabled: getMainCaptionHtmlEnabledCheckbox().prop('checked'),
    customJs: getCustomJsTextArea().val(),
    customJsEnabled: getCustomJsEnabledCheckbox().prop('checked'),
    customCss: getCustomCssTextArea().val(),
    customCssEnabled: getCustomCssEnabledCheckbox().prop('checked'),
    customWidgetsHtml: getCustomWidgetsHtmlTextArea().val(),
    customWidgetsHtmlEnabled: getCustomWidgetsHtmlEnabledCheckbox().prop('checked'),
    leftMarginOfThreadContent: getLeftMarginOfThreadContentInput().val() === "" ? null : parseFloat(getLeftMarginOfThreadContentInput().val()),
    debugModalCreation: getDebugModalCreationCheckbox().prop('checked'),
    debugEventHooks: getDebugEventHooksCheckbox().prop('checked'),
    modelPreferBaseModelIcon: getModelPreferBaseModelIconCheckbox().prop('checked'),
    debugReplaceIconsInMenu: getDebugReplaceIconsInMenuCheckbox().prop('checked'),
    leftMarginOfThreadContentEnabled: getLeftMarginOfThreadContentEnabled().prop('checked'),
    leftMarginOfThreadContent: getLeftMarginOfThreadContentInput().val() === "" ? null : parseFloat(getLeftMarginOfThreadContentInput().val()),
    tagTweakNoBorder: getTagTweakNoBorderCheckbox().prop('checked'),
    tagTweakSlimPadding: getTagTweakSlimPaddingCheckbox().prop('checked'),
    tagTweakRichBorderColor: getTagTweakRichBorderColorCheckbox().prop('checked'),
    tagTweakTextShadow: getTagTweakTextShadowCheckbox().prop('checked'),
    quickProfileButtonEnabled: getQuickProfileButtonEnabledCheckbox().prop('checked'),
    showRemoveAllUploadedFilesButton: getShowRemoveAllUploadedFilesButton().prop('checked'),
  };
  saveConfig(newConfig);
};

const showPerplexityHelperSettingsModal = () => {
  loadCurrentConfigToSettingsForm();
  getPerplexityHelperModal().show().css('display', 'flex');
};

const hidePerplexityHelperSettingsModal = () => {
  getPerplexityHelperModal().hide();
};

const handleTopSettingsButtonInsertion = () => {
  const copilotHelperSettings = getTopSettingsButtonEl();
  // TODO: no longer works
  // debugLog('upperControls().length > 0', upperControls().length, 'copilotHelperSettings.length', copilotHelperSettings.length, 'upperControls().children().length', upperControls().children().length);
  if (upperControls().length > 0 && copilotHelperSettings.length < 1 && upperControls().children().length >= 1) {
    debugLog('inserting settings button');
    upperControls().children().eq(0).children().eq(0).append(upperButton(topSettingsButtonId, cogIco, 'Perplexity Helper Settings'));
  }
};

const handleTopSettingsButtonSetup = () => {
  const settingsButtonEl = getTopSettingsButtonEl();

  if (settingsButtonEl.length === 1 && !settingsButtonEl.attr('data-has-custom-click-event')) {
    debugLog('handleTopSettingsButtonSetup: setting up the button');
    if (settingsButtonEl.length === 0) {
      debugLog('handleTopSettingsButtonSetup: settingsButtonEl.length === 0');
    }

    settingsButtonEl.on("click", () => {
      debugLog('perplexity_helper_settings open click');
      showPerplexityHelperSettingsModal();
    });

    settingsButtonEl.attr('data-has-custom-click-event', true);
  }
};

const applySideMenuHiding = () => {
  const config = loadConfigOrDefault();
  if (!config.hideSideMenu) return;
  const $sideMenu = PP.getLeftPanel();
  if ($sideMenu.hasClass(sideMenuHiddenCls)) return;
  $sideMenu.addClass(sideMenuHiddenCls);
  console.log(logPrefix, '[applySideMenuHiding] User requested hiding of side menu (left panel). You can open Perplexity Helper settings modal via typing (copy&paste):\n\nph.showPerplexityHelperSettingsModal()\n\nin Console in DevTools and executing via enter key.', { $sideMenu });
};

const handleModalCreation = () => {
  if (getPerplexityHelperModal().length > 0) return;
  logModalCreation('Starting modal creation');
  jq("body").append(modalHTML);

  getPerplexityHelperModal().find('.close').on('click', () => {
    debugLog('perplexity_helper_settings close  click');
    hidePerplexityHelperSettingsModal();
  });

  // Setup title animation
  setTimeout(() => {
    const $titleEl = getPerplexityHelperModal().find(`.${modalSettingsTitleCls}`);
    if ($titleEl.length) {
      const text = $titleEl.text();
      const wrappedText = text
        .split('')
        .map((char, i) => {
          if (i === 0 || i === 11) { // P and H positions
            return `<span class="animate-letter" data-letter="${char}">${char}</span>`;
          }
          return char;
        })
        .join('');

      $titleEl.html(wrappedText);

      $titleEl.on('click', () => {
        const $firstLetter = $titleEl.find('.animate-letter').eq(0);
        const $secondLetter = $titleEl.find('.animate-letter').eq(1);

        // Staggered animation
        $firstLetter.addClass('active');
        setTimeout(() => {
          $firstLetter.removeClass('active');
          $secondLetter.addClass('active');
          setTimeout(() => {
            $secondLetter.removeClass('active');
          }, 500);
        }, 250);
      });
    }
  }, 500);
};

const lucideIconMappings = {
  LUCIDE1: leftPanelIconMappingsToLucide1,
  LUCIDE2: leftPanelIconMappingsToLucide2,
};

const findKeyByValue = (obj, value) =>
  Object.keys(obj).find(key => obj[key] === value);

const SUPPORTED_ICON_REPLACEMENT_MODES = [
  ICON_REPLACEMENT_MODE.LUCIDE1,
  ICON_REPLACEMENT_MODE.LUCIDE2,
  ICON_REPLACEMENT_MODE.LUCIDE3,
  ICON_REPLACEMENT_MODE.TDESIGN1,
  ICON_REPLACEMENT_MODE.TDESIGN2,
  ICON_REPLACEMENT_MODE.TDESIGN3,
];

const replaceStr = (str, replacement) => (s) => s.replace(str, replacement);

const normalizeCollectionsSpaces = (str) => str.startsWith('collections/') ? 'spaces' : str;

const attrNamePhReplacementIcon = 'data-pplx-helper-replacement-icon';

let lastIconButtons = null;

const handleReplaceIconsInMenu = () => {
  const config = loadConfigOrDefault();
  debugReplaceIconsInMenu = config.debugReplaceIconsInMenu;
  const replacementMode = findKeyByValue(ICON_REPLACEMENT_MODE, config.replaceIconsInMenu);

  if (SUPPORTED_ICON_REPLACEMENT_MODES.includes(config.replaceIconsInMenu)) {
    const processedAttr = `data-${pplxHelperTag}-processed`;
    const iconMapping = iconMappings[replacementMode];
    if (!iconMapping) {
      console.error(logPrefix, '[replaceIconsInMenu] iconMapping not found', { config, iconMappings });
      return;
    }

    const getIconButtons = () => {
      const $sideBar = PP.getSidebar();
      const primary = $sideBar.find('a[data-testid^="sidebar-"]');
      const fallback = PP.getIconsInLeftPanel().parent().find('> a:has(> div.grid svg), > a:has(svg)');
      const chosen = primary.length ? primary : fallback;
      return chosen.filter((_, el) => jq(el).attr('id') !== leftSettingsButtonId);
    };

    const getIconNameFromButton = ($iconButton) => {
      const dataTestId = $iconButton.attr('data-testid');
      const fromTestId = () => {
        const base = dataTestId.replace(/^sidebar-/, '');
        return base === 'home' ? 'search' : base;
      };
      const fromHref = () => (
        pipe($iconButton.attr('href'))(
          dropStr(1),
          dropRightStr(1),
          replaceStr('spaces/templates', 'spaces'),
          normalizeCollectionsSpaces,
        ) || 'search'
      );
      return dataTestId && dataTestId.startsWith('sidebar-') ? fromTestId() : fromHref();
    };

    const $iconButtons = getIconButtons();

    // console.log('replaceIconsInMenu', { $iconButtons, $iconButtonsLength: $iconButtons.length });
    if (lastIconButtons && lastIconButtons.length !== $iconButtons.length) {
      logReplaceIconsInMenu('$iconButtons', $iconButtons);
    }
    lastIconButtons = $iconButtons;
    $iconButtons.each((idx, rawIconButton) => {
      const $iconButton = jq(rawIconButton);
      const $svg = $iconButton.find('svg');
      const processed = $iconButton.attr(processedAttr);
      // some icon buttons (eg. spaces), can redraw after navigation, so we must check for our replacement icon
      const buttonHasReplacementIcon = $iconButton.find(`[${attrNamePhReplacementIcon}]`).length > 0;
      if (processed && buttonHasReplacementIcon) return;
      if ($iconButton.attr('id') === leftSettingsButtonId) return;

      // Derive iconName functionally (prefers data-testid, falls back to href)
      const iconName = getIconNameFromButton($iconButton);
      const replacementIconName = iconMapping[iconName];
      logReplaceIconsInMenu('(iconName)', iconName, ' -> (replacementIconName)', replacementIconName);

      $iconButton.attr(processedAttr, true);

      if (replacementIconName) {
        const isTDesign = config.replaceIconsInMenu.startsWith('TDesign');
        const newIconUrl = (isTDesign ? getTDesignIconUrl : getLucideIconUrl)(replacementIconName);

        logReplaceIconsInMenu('replacing icon', { iconName, replacementIconName, $svg, newIconUrl });
        $svg.hide();
        const newIconEl = jq('<img>')
          .attr('src', newIconUrl)
          .addClass('invert opacity-50')
          .addClass('relative duration-150 [grid-area:1/-1] group-hover:scale-110 text-text-200')
          .attr(attrNamePhReplacementIcon, true)
          .attr('data-original-icon-name', iconName)
          .attr('data-replacement-icon-name', replacementIconName)
          ;
        if (isTDesign) newIconEl.addClass('h-6');
        $svg.parent().addClass(lucideIconParentCls);
        $svg.after(newIconEl);
      } else {
        // $iconButton.css({backgroundColor: 'magenta'});
        if (!['plus', 'thread', 'finance'].includes(iconName)) {
          console.error('[replaceIconsInMenu] no replacement icon found', { iconName, replacementIconName });
        }
      }
    });
  }
};

const createSidebarButton = (options) => {
  const { svgHtml, label, testId, href } = options;
  return jq('<a>', {
    'data-testid': testId,
    'class': 'p-sm group flex w-full flex-col items-center justify-center gap-0.5',
    'href': href ?? '#',
  }).append(
    jq('<div>', {
      'class': 'grid size-[40px] place-items-center border-borderMain/50 ring-borderMain/50 divide-borderMain/50 dark:divide-borderMainDark/50 dark:ring-borderMainDark/50 dark:border-borderMainDark/50 bg-transparent'
    }).append(
      jq('<div>', {
        'class': 'size-[90%] rounded-md duration-150 [grid-area:1/-1] group-hover:opacity-100 opacity-0 border-borderMain/50 ring-borderMain/50 divide-borderMain/50 dark:divide-borderMainDark/50 dark:ring-borderMainDark/50 dark:border-borderMainDark/50 bg-offsetPlus dark:bg-offsetPlusDark'
      }),
      jq(svgHtml).addClass('relative duration-150 [grid-area:1/-1] group-hover:scale-110 text-text-200'),
    ),
    jq('<div>', {
      'class': 'font-sans text-2xs md:text-xs text-textOff dark:text-textOffDark selection:bg-super/50 selection:text-textMain dark:selection:bg-superDuper/10 dark:selection:text-superDark',
      'text': label ?? 'MISSING LABEL'
    })
  );
};

const handleLeftSettingsButtonSetup = () => {
  const existingLeftSettingsButton = getLeftSettingsButtonEl();
  if (existingLeftSettingsButton.length === 1) {
    // const wrapper = existingLeftSettingsButton.parent();
    // if (!wrapper.is(':last-child')) {
    //   wrapper.appendTo(wrapper.parent());
    // }
    return;
  }

  const $iconContainerInSidebar = PP.getIconButtonContainersInSidebar().last();

  if ($iconContainerInSidebar.length === 0) {
    debugLog('handleLeftSettingsButtonSetup: leftPanel not found');
  }

  const $sidebarButton = createSidebarButton({
    svgHtml: cogIco,
    label: 'Perplexity Helper',
    testId: 'perplexity-helper-settings',
    href: '#',
  })
    .attr('id', leftSettingsButtonId)
    .on('click', () => {
      debugLog('left settings button clicked');
      if (!PP.isBreakpoint('md')) {
        PP.getLeftPanel().hide();
      }
      showPerplexityHelperSettingsModal();
    });

  $iconContainerInSidebar.append($sidebarButton);
};

const handleSlimLeftMenu = () => {
  const config = loadConfigOrDefault();
  if (!config.slimLeftMenu) return;

  const $sideBar = PP.getSidebar();
  if ($sideBar.length === 0) {
    // debugLog('handleSlimLeftMenu: leftPanel not found');
  }

  $sideBar.addClass(leftPanelSlimCls);
  $sideBar.find('.py-md').css('width', '45px');
};

const handleHideHomeWidgets = () => {
  const config = loadConfigOrDefault();
  if (!config.hideHomeWidgets) return;

  const homeWidgets = PP.getHomeWidgets();
  if (homeWidgets.length === 0) {
    debugLogThrottled('handleHideHomeWidgets: homeWidgets not found');
    return;
  }
  if (homeWidgets.length > 1) {
    console.warn(logPrefix, '[handleHideHomeWidgets] too many homeWidgets found', homeWidgets);
  }

  homeWidgets.hide();
};

const handleFixImageGenerationOverlay = () => {
  const config = loadConfigOrDefault();
  if (!config.fixImageGenerationOverlay) return;

  const imageGenerationOverlay = PP.getImageGenerationOverlay();
  if (imageGenerationOverlay.length === 0) {
    // debugLog('handleFixImageGenerationOverlay: imageGenerationOverlay not found');
    return;
  }

  // only if wrench button is cyan (we are in custom prompt)
  if (!imageGenerationOverlay.find('button').hasClass('bg-super')) return;

  const transform = imageGenerationOverlay.css('transform');
  if (!transform) return;

  // Handle both matrix and translate formats
  const matrixMatch = transform.match(/matrix\(.*,\s*([\d.]+),\s*([\d.]+)\)/);
  const translateMatch = transform.match(/translate\(([\d.]+)px(?:,\s*([\d.]+)px)?\)/);

  const currentX = matrixMatch
    ? matrixMatch[1]  // Matrix format: 5th value is X translation
    : translateMatch?.[1] || 0;  // Translate format: first value

  debugLog('[handleFixImageGenerationOverlay] currentX', currentX, 'transform', transform);
  imageGenerationOverlay.css({
    transform: `translate(${currentX}px, 0px)`
  });
};

const handleExtraSpaceBellowLastAnswer = () => {
  const config = loadConfigOrDefault();
  if (!config.extraSpaceBellowLastAnswer) return;
  const $oldWithClassEls = jq(`.${extraSpaceBellowLastAnswerCls}`);
  const $newCandidates = jq(`.erp-tab\\:min-h-screen .md\\:pt-6.isolate > .max-w-threadContentWidth:not(.z-20)`);
  const $newCandidate = $newCandidates.last();

  if ($newCandidate.length > 0) {
    $newCandidate.addClass(extraSpaceBellowLastAnswerCls);
    const $oldElsWithoutCurrent = $oldWithClassEls.not($newCandidate);
    if ($oldElsWithoutCurrent.length > 0) {
      $oldElsWithoutCurrent.removeClass(extraSpaceBellowLastAnswerCls);
    }
  }
};

let quickProfileButton;
let currentProfileIndex = -1;

const handleQuickProfileButton = () => {
  const config = loadConfigOrDefault();
  if (!config.quickProfileButtonEnabled) {
    if (quickProfileButton) {
      quickProfileButton.remove();
      quickProfileButton = null;
    }
    return;
  }

  if (!quickProfileButton) {
    const $image = jq(`<img src="${getLucideIconUrl('award')}" />`);
    quickProfileButton = jq(`<div class="${quickProfileButtonCls}"></div>`).append($image);
    quickProfileButton.click(() => {
      if (quickProfileButton.hasClass(quickProfileButtonDisabledCls)) return;
      const config = loadConfigOrDefault();
      if (!config.quickProfiles || config.quickProfiles.length === 0) return;

      const promptAreaWrapper = PP.getAnyPromptAreaWrapper();
      const currentSelectedModel = PP.getModelDescriptionFromModelButton(PP.getAnyModelButton(promptAreaWrapper));
      const currentModelId = currentSelectedModel?.ppModelId;

      const len = config.quickProfiles.length;
      const startIndex = (currentProfileIndex + 1) % len;
      const indices = [
        ..._.range(startIndex, len),
        ..._.range(0, startIndex),
      ];
      const nextIndex = len > 1
        ? (indices.find(i => config.quickProfiles[i]?.ppModelId !== currentModelId) ?? startIndex)
        : startIndex;

      currentProfileIndex = nextIndex;
      const profile = config.quickProfiles[currentProfileIndex];
      debugLog('quickProfileButton: profile', profile);
      PP.doSelectModel(profile.ppModelId);
    });
  }

  const promptAreaWrapper = PP.getAnyPromptAreaWrapper();
  if (promptAreaWrapper.length) {
    if (promptAreaWrapper.find(`.${quickProfileButtonCls}`).length === 0) {
      // const $spanWrapper = jq('<span>').append(quickProfileButton);
      PP.getModeLabButton(promptAreaWrapper).nthParent(3).append(quickProfileButton);
      // promptAreaWrapper.prepend(quickProfileButton);
    }

    const currentSelectedModel = PP.getModelDescriptionFromModelButton(PP.getAnyModelButton(promptAreaWrapper));
    if (currentSelectedModel) {
      quickProfileButton.removeClass(quickProfileButtonDisabledCls);
      const modelId = currentSelectedModel.ppModelId;
      const profile = config.quickProfiles.find(p => p.ppModelId === modelId);
      if (profile) {
        quickProfileButton.addClass(quickProfileButtonActiveCls);
      } else {
        quickProfileButton.removeClass(quickProfileButtonActiveCls);
      }
    } else {
      quickProfileButton.addClass(quickProfileButtonDisabledCls);
      quickProfileButton.removeClass(quickProfileButtonActiveCls);
    }
  }
};


const handleSearchPage = () => {
  // is this even used currently?
  // TODO: update this, button to start new thread with same text as original/last query might be useful
  return;
  const controlsArea = getCurrentControlsArea();
  controlsArea.addClass(controlsAreaCls);
  controlsArea.parent().find('textarea').first().addClass(textAreaCls);
  controlsArea.addClass(roundedMD);
  controlsArea.parent().addClass(roundedMD);


  if (controlsArea.length === 0) {
    debugLog('controlsArea not found', {
      controlsArea,
      currentControlsArea: getCurrentControlsArea(),
      isStandardControlsAreaFc: isStandardControlsAreaFc()
    });
  }

  const lastQueryBoxText = getLastQuery();

  const mainTextArea = isStandardControlsAreaFc() ? controlsArea.prev().prev() : controlsArea.parent().prev();

  if (mainTextArea.length === 0) {
    debugLog('mainTextArea not found', mainTextArea);
  }


  debugLog('lastQueryBoxText', { lastQueryBoxText });
  if (lastQueryBoxText) {
    const copilotNewThread = getCopilotNewThreadButton();
    const copilotRepeatLast = getCopilotRepeatLastButton();

    if (controlsArea.length > 0 && copilotNewThread.length < 1) {
      controlsArea.append(button('copilot_new_thread', robotIco, "Starts new thread for with last query text and Copilot ON", standardButtonCls));
    }

    // Due to updates in Perplexity, this is unnecessary for now
    // if (controlsArea.length > 0 && copilotRepeatLast.length < 1) {
    //   controlsArea.append(button('copilot_repeat_last', robotRepeatIco, "Repeats last query with Copilot ON"));
    // }

    if (!copilotNewThread.attr('data-has-custom-click-event')) {
      copilotNewThread.on("click", function () {
        debugLog('copilotNewThread Button clicked!');
        openNewThreadModal(getLastQuery());
      });
      copilotNewThread.attr('data-has-custom-click-event', true);
    }

    if (!copilotRepeatLast.attr('data-has-custom-click-event')) {
      copilotRepeatLast.on("click", function () {
        const controlsArea = getCurrentControlsArea();
        const textAreaElement = controlsArea.parent().find('textarea')[0];

        const coPilotRepeatLastAutoSubmit =
          getSavedStates()
            ? getSavedStates().coPilotRepeatLastAutoSubmit
            : getCoPilotRepeatLastAutoSubmitCheckbox().prop('checked');

        debugLog('coPilotRepeatLastAutoSubmit', coPilotRepeatLastAutoSubmit);
        PP.setPromptAreaValue(mainTextArea, getLastQuery());
        const copilotToggleButton = getCopilotToggleButton(mainTextArea);
        debugLog('mainTextArea', mainTextArea);
        debugLog('copilotToggleButton', copilotToggleButton);

        toggleBtnDot(copilotToggleButton, true);
        const isCopilotOnBtn = () => isCopilotOn(copilotToggleButton);

        const copilotCheck = () => {
          const ctx = { timer: null };
          ctx.timer = setInterval(() => checkForCopilotToggleState(ctx.timer, isCopilotOnBtn, coPilotRepeatLastAutoSubmit, 0), 500);
        };

        copilotCheck();
        debugLog('copilot_repeat_last Button clicked!');
      });
      copilotRepeatLast.attr('data-has-custom-click-event', true);
    }
  }

  if (getNumberOfDashedSVGs() > 0 && getNumberOfDashedSVGs() === getDashedCheckboxButton().length
    && getSelectAllButton().length < 1 && getSelectAllAndSubmitButton().length < 1) {
    debugLog('getNumberOfDashedSVGs() === getNumberOfDashedSVGs()', getNumberOfDashedSVGs());
    debugLog('getSpecifyQuestionBox', getSpecifyQuestionBox());

    const specifyQuestionControlsWrapper = getSpecifyQuestionControlsWrapper();
    debugLog('specifyQuestionControlsWrapper', specifyQuestionControlsWrapper);
    const selectAllButton = textButton('perplexity_helper_select_all', 'Select all', 'Selects all options');
    const selectAllAndSubmitButton = textButton('perplexity_helper_select_all_and_submit', 'Select all & submit', 'Selects all options and submits');

    specifyQuestionControlsWrapper.append(selectAllButton);
    specifyQuestionControlsWrapper.append(selectAllAndSubmitButton);

    getSelectAllButton().on("click", function () {
      selectAllCheckboxes();
    });

    getSelectAllAndSubmitButton().on("click", function () {
      selectAllCheckboxes();
      setTimeout(() => {
        getSpecifyQuestionControlsWrapper().find('button:contains("Continue")').click();
      }, 200);
    });
  }

  const constructClipBoard = (buttonId, buttonGetter, modalGetter, copiedModalId, elementGetter) => {
    const placeholderValue = getSpecifyQuestionBox().find('textarea').attr('placeholder');

    const clipboardInstance = new ClipboardJS(`#${buttonId}`, {
      text: () => placeholderValue
    });

    const copiedModal = `<span id="${copiedModalId}">Copied!</span>`;
    debugLog('copiedModalId', copiedModalId);
    debugLog('copiedModal', copiedModal);

    jq('main').append(copiedModal);

    clipboardInstance.on('success', _ => {
      var buttonPosition = buttonGetter().position();
      jq(`#${copiedModalId}`).css({
        top: buttonPosition.top - 30,
        left: buttonPosition.left + 50
      }).show();

      if (elementGetter !== undefined) {
        PP.setPromptAreaValue(elementGetter(), placeholderValue);
      }

      setTimeout(() => {
        modalGetter().hide();
      }, 5000);
    });
  };

  if (questionBoxWithPlaceholderExists() && getCopyPlaceholder().length < 1) {
    const copyPlaceholder = textButton('perplexity_helper_copy_placeholder', 'Copy placeholder', 'Copies placeholder value');
    const copyPlaceholderAndFillIn = textButton('perplexity_helper_copy_placeholder_and_fill_in', 'Copy placeholder and fill in',
      'Copies placeholder value and fills in input');

    const specifyQuestionControlsWrapper = getSpecifyQuestionControlsWrapper();

    specifyQuestionControlsWrapper.append(copyPlaceholder);
    specifyQuestionControlsWrapper.append(copyPlaceholderAndFillIn);

    constructClipBoard('perplexity_helper_copy_placeholder', getCopyPlaceholder, getCopiedModal, 'copied-modal');
    constructClipBoard('perplexity_helper_copy_placeholder_and_fill_in', getCopyAndFillInPlaceholder, getCopiedModal2, 'copied-modal-2', getCopyPlaceholderInput);
  }
};

const getLabelFromModelDescription = modelLabelStyle => modelLabelFromAriaLabel => modelDescription => {
  if (!modelDescription) return modelLabelFromAriaLabel;
  switch (modelLabelStyle) {
    case MODEL_LABEL_TEXT_MODE.OFF:
      return '';
    case MODEL_LABEL_TEXT_MODE.FULL_NAME:
      return modelDescription.nameEn;
    case MODEL_LABEL_TEXT_MODE.SHORT_NAME:
      return modelDescription.nameEnShort ?? modelDescription.nameEn;
    case MODEL_LABEL_TEXT_MODE.PP_MODEL_ID:
      return modelDescription.ppModelId;
    case MODEL_LABEL_TEXT_MODE.OWN_NAME_VERSION_SHORT:
      const nameText = modelDescription.ownNameEn ?? modelDescription.nameEn;
      const versionTextRaw = modelDescription.ownVersionEnShort ?? modelDescription.ownVersionEn;
      const versionText = versionTextRaw?.replace(/ P$/, ' Pro'); // HACK: Gemini 2.5 Pro
      return [nameText, versionText].filter(Boolean).join(modelDescription.ownNameVersionSeparator ?? ' ');
    case MODEL_LABEL_TEXT_MODE.VERY_SHORT:
      const abbr = modelDescription.abbrEn;
      if (!abbr) {
        console.warn('[getLabelFromModelDescription] modelDescription.abbrEn is empty', modelDescription);
      } else {
        return abbr;
      }
      const shortName = modelDescription.nameEnShort ?? modelDescription.nameEn;
      return shortName.split(/\s+/).map(word => word.charAt(0)).join('');
    case MODEL_LABEL_TEXT_MODE.FAMILIAR_NAME:
      return modelDescription.familiarNameEn ?? modelDescription.nameEn;
    default:
      throw new Error(`Unknown model label style: ${modelLabelStyle}`);
  }
};

const getExtraClassesFromModelLabelStyle = modelLabelStyle => {
  switch (modelLabelStyle) {
    case MODEL_LABEL_STYLE.BUTTON_SUBTLE:
      return modelLabelStyleButtonSubtleCls;
    case MODEL_LABEL_STYLE.BUTTON_WHITE:
      return modelLabelStyleButtonWhiteCls;
    case MODEL_LABEL_STYLE.BUTTON_CYAN:
      return modelLabelStyleButtonCyanCls;
    case MODEL_LABEL_STYLE.NO_TEXT:
      return '';
    default:
      return '';
  }
};

const handleModelLabel = () => {
  const config = loadConfigOrDefault();
  if (!config.modelLabelStyle || config.modelLabelStyle === MODEL_LABEL_STYLE.OFF) return;

  const $modelIcons = PP.getAnyModelButton();
  $modelIcons.each((_, el) => {
    const $el = jq(el);

    // Initial setup if elements don't exist yet
    if (!$el.find(`.${modelLabelCls}`).length) {
      $el.prepend(jq(`<span class="${modelLabelCls}"></span>`));
      $el.closest('.col-start-3').removeClass('col-start-3').addClass('col-start-2 col-end-4');
    }
    if (!$el.hasClass(modelIconButtonCls)) {
      $el.addClass(modelIconButtonCls);
    }

    // Get current config state and model information
    const modelDescription = PP.getModelDescriptionFromModelButton($el);
    const modelLabelFromAriaLabel = $el.attr('aria-label');
    const modelLabel = config.modelLabelStyle === MODEL_LABEL_STYLE.NO_TEXT ? '' :
      getLabelFromModelDescription(config.modelLabelTextMode)(modelLabelFromAriaLabel)(modelDescription);

    if (modelLabel === undefined || modelLabel === null) {
      console.error('[handleModelLabel] modelLabel is empty', { modelDescription, modelLabelFromAriaLabel, $el });
      return;
    }

    // Calculate the style classes
    const extraClasses = [
      getExtraClassesFromModelLabelStyle(config.modelLabelStyle),
      config.modelLabelOverwriteCyanIconToGray ? modelLabelOverwriteCyanIconToGrayCls : '',
    ].filter(Boolean).join(' ');

    // Check the current "CPU icon removal" configuration state
    const shouldRemoveCpuIcon = config.modelLabelRemoveCpuIcon;
    const hasCpuIconRemoval = $el.hasClass(modelLabelRemoveCpuIconCls);

    // Only update CPU icon removal class if needed
    if (shouldRemoveCpuIcon !== hasCpuIconRemoval) {
      if (shouldRemoveCpuIcon) {
        $el.addClass(modelLabelRemoveCpuIconCls);
      } else {
        $el.removeClass(modelLabelRemoveCpuIconCls);
      }
    }

    // Handle larger icons setting
    const shouldUseLargerIcons = config.modelLabelLargerIcons;
    const hasLargerIconsClass = $el.hasClass(modelLabelLargerIconsCls);

    // Only update larger icons class if needed
    if (shouldUseLargerIcons !== hasLargerIconsClass) {
      if (shouldUseLargerIcons) {
        $el.addClass(modelLabelLargerIconsCls);
      } else {
        $el.removeClass(modelLabelLargerIconsCls);
      }
    }

    // Work with the label element
    const $label = $el.find(`.${modelLabelCls}`);

    // Use data attributes to track current state
    const storedModelDescriptionStr = $label.attr('data-model-description');
    const storedExtraClasses = $label.attr('data-extra-classes');
    const storedLabel = $label.attr('data-label-text');

    // Only update if something has changed
    const modelDescriptionStr = JSON.stringify(modelDescription);
    const needsUpdate =
      storedModelDescriptionStr !== modelDescriptionStr ||
      storedExtraClasses !== extraClasses ||
      storedLabel !== modelLabel;

    if (needsUpdate) {
      // Store the current state in data attributes
      $label.attr('data-model-description', modelDescriptionStr);
      $label.attr('data-extra-classes', extraClasses);
      $label.attr('data-label-text', modelLabel);

      // Apply the text content
      $label.text(modelLabel);

      // Apply classes only if they've changed
      if (storedExtraClasses !== extraClasses) {
        $label.removeClass(modelLabelStyleButtonSubtleCls)
          .removeClass(modelLabelStyleButtonWhiteCls)
          .removeClass(modelLabelStyleButtonCyanCls)
          .removeClass(modelLabelOverwriteCyanIconToGrayCls)
          .addClass(extraClasses);
      }
    }

    // Handle error icon if errorType exists
    const hasErrorType = modelDescription?.errorType !== undefined;
    const existingErrorIcon = $el.find(`.${errorIconCls}`);

    // Check if we need to add or remove the error icon
    if (hasErrorType && existingErrorIcon.length === 0) {
      // Add the error icon
      const errorIconUrl = getLucideIconUrl('alert-triangle');
      const $errorIcon = jq(`<img src="${errorIconUrl}" alt="Error" class="${errorIconCls}" />`)
        .attr('data-error-type', modelDescription.errorType)
        .css('filter', hexToCssFilter('#FFA500').filter)
        .attr('title', modelDescription.errorString || 'Error: Used fallback model');

      // Insert the error icon at the correct position
      const $reasoningModelIcon = $el.find(`.${reasoningModelCls}`);
      if ($reasoningModelIcon.length > 0) {
        $reasoningModelIcon.after($errorIcon);
      } else {
        $el.prepend($errorIcon);
      }
    } else if (!hasErrorType && existingErrorIcon.length > 0) {
      // Remove the error icon if no longer needed
      existingErrorIcon.remove();
    } else if (hasErrorType && existingErrorIcon.length > 0) {
      // Update the error icon title if it changed
      if (existingErrorIcon.attr('data-error-type') !== modelDescription.errorType) {
        existingErrorIcon
          .attr('data-error-type', modelDescription.errorType)
          .attr('title', modelDescription.errorString || 'Error: Used fallback model');
      }
    }

    // Handle model icon
    if (config.modelLabelIcons && config.modelLabelIcons !== MODEL_LABEL_ICONS.OFF) {
      const existingIcon = $el.find(`.${modelIconCls}`);

      // Get model-specific icon based on model name
      const modelName = modelDescription?.nameEn ?? '';
      const brandIconInfo = getBrandIconInfo(modelName, { preferBaseModelCompany: config.modelPreferBaseModelIcon });
      if (!brandIconInfo) {
        // TODO: issues with "models" like "Pro Search", "Deep Research" and "Labs"
        debugLogThrottled('brandIconInfo is null', { modelLabelFromAriaLabel, modelName, modelDescription });
        return;
      }

      const { iconName, brandColor } = brandIconInfo;
      const existingIconData = existingIcon.attr('data-model-icon');
      const existingIconMode = existingIcon.attr('data-icon-mode');

      // Check if we need to update the icon
      const shouldUpdateIcon =
        existingIconData !== iconName ||
        existingIcon.length === 0 ||
        existingIconMode !== config.modelLabelIcons;

      if (shouldUpdateIcon) {
        existingIcon.remove();

        if (iconName) {
          const iconUrl = getLobeIconsUrl(iconName);
          const $icon = jq(`<img src="${iconUrl}" alt="Model icon" class="${modelIconCls}" />`)
            .attr('data-model-icon', iconName)
            .attr('data-icon-mode', config.modelLabelIcons);

          // Apply styling based on monochrome/color mode
          if (config.modelLabelIcons === MODEL_LABEL_ICONS.MONOCHROME) {
            // Apply monochrome filter
            $icon.css('filter', 'invert(1)');

            // Apply color classes for monochrome icons based on button style
            if (config.modelLabelStyle === MODEL_LABEL_STYLE.JUST_TEXT) {
              $icon.addClass(iconColorGrayCls);
            } else if (config.modelLabelStyle === MODEL_LABEL_STYLE.BUTTON_CYAN) {
              $icon.addClass(iconColorCyanCls);
            } else if (config.modelLabelStyle === MODEL_LABEL_STYLE.BUTTON_SUBTLE) {
              $icon.addClass(iconColorGrayCls);
            } else if (config.modelLabelStyle === MODEL_LABEL_STYLE.BUTTON_WHITE) {
              $icon.addClass(iconColorWhiteCls);
            }
          } else if (config.modelLabelIcons === MODEL_LABEL_ICONS.COLOR) {
            // Ensure the icon displays in color
            $icon.attr('data-brand-color', brandColor);
            $icon.css('filter', hexToCssFilter(brandColor).filter);
            $icon.attr('data-brand-color-filter', hexToCssFilter(brandColor).filter);
          }

          const $reasoningModelIcon = $el.find(`.${reasoningModelCls}`);
          const $errorIcon = $el.find(`.${errorIconCls}`);
          const hasReasoningModelIcon = $reasoningModelIcon.length !== 0;
          const hasErrorIcon = $errorIcon.length !== 0;

          if (hasReasoningModelIcon) {
            // $icon.css({ marginLeft: '0px' });
            // $el.css({ paddingRight: hasReasoningModelIcon ? '8px' : '2px' });
            $reasoningModelIcon.after($icon);
          } else if (hasErrorIcon) {
            $errorIcon.after($icon);
          } else {
            // $icon.css({ marginLeft: '-2px' });
            $el.prepend($icon);
          }

          // if (!modelLabel) {
          //   $icon.css({ marginRight: '-6px', marginLeft: '-2px' });
          //   $el.css({ paddingRight: '8px', paddingLeft: '10px' });
          // }
        }
      }
    } else {
      // Remove model icon if setting is off
      $el.find(`.${modelIconCls}`).remove();
    }

    // Handle reasoning model icon
    const isReasoningModel = modelDescription?.modelType === 'reasoning';
    if (config.modelLabelUseIconForReasoningModels !== MODEL_LABEL_ICON_REASONING_MODEL.OFF) {
      const prevReasoningModelIcon = $el.find(`.${reasoningModelCls}`);
      const hasIconSetting = $el.attr('data-reasoning-icon-setting');
      const currentSetting = config.modelLabelUseIconForReasoningModels;
      const currentIconColor = config.modelLabelReasoningModelIconColor || '#ffffff';
      const storedIconColor = $el.attr('data-reasoning-icon-color');

      // Only make changes if the reasoning status, icon setting, or color has changed
      if (hasIconSetting !== currentSetting ||
        (isReasoningModel && prevReasoningModelIcon.length === 0) ||
        (!isReasoningModel && prevReasoningModelIcon.length > 0) ||
        storedIconColor !== currentIconColor) {

        // Update tracking attributes
        $el.attr('data-reasoning-icon-setting', currentSetting);
        $el.attr('data-reasoning-icon-color', currentIconColor);
        $el.attr('data-is-reasoning-model', isReasoningModel);

        // Update reasoning model class as needed
        if (!isReasoningModel) {
          $el.addClass(notReasoningModelCls);
          prevReasoningModelIcon.remove();
        } else {
          $el.removeClass(notReasoningModelCls);

          if (prevReasoningModelIcon.length === 0) {
            const iconUrl = getLucideIconUrl(config.modelLabelUseIconForReasoningModels.toLowerCase().replace(' ', '-'));
            const $icon = jq(`<img src="${iconUrl}" alt="Reasoning model" class="${reasoningModelCls}" />`);

            $icon.css('filter', hexToCssFilter(config.modelLabelReasoningModelIconColor || '#ffffff').filter);

            $el.prepend($icon);

            const $reasoningModelIcon = $el.find(`.${reasoningModelCls}`);
            $reasoningModelIcon.css({ display: 'inline-block' });

            if (config.modelLabelStyle === MODEL_LABEL_STYLE.JUST_TEXT) {
              $reasoningModelIcon.addClass(iconColorGrayCls);
            } else if (config.modelLabelStyle === MODEL_LABEL_STYLE.BUTTON_CYAN) {
              $reasoningModelIcon.addClass(iconColorCyanCls);
            } else if (config.modelLabelStyle === MODEL_LABEL_STYLE.BUTTON_SUBTLE) {
              $reasoningModelIcon.addClass(iconColorGrayCls);
            } else if (config.modelLabelStyle === MODEL_LABEL_STYLE.BUTTON_WHITE) {
              $reasoningModelIcon.addClass(iconColorWhiteCls);
            }

            const $modelLabelIcon = $el.find(`.${modelIconCls}`);
            const $errorIcon = $el.find(`.${errorIconCls}`);
            if ($modelLabelIcon.length !== 0 || $errorIcon.length !== 0) {
              $reasoningModelIcon.css({ marginLeft: '4px' });
            } else {
              $reasoningModelIcon.css({ marginLeft: '0px' });
            }
          } else {
            prevReasoningModelIcon.css('filter', hexToCssFilter(config.modelLabelReasoningModelIconColor || '#ffffff').filter);
          }
        }
      }
    }
  });
};

const handleHideDiscoverButton = () => {
  const config = loadConfigOrDefault();
  if (!config.hideDiscoverButton) return;
  const $discoverIcon = PP.getIconsInLeftPanel().parent().find('a[href*="discover"]');
  $discoverIcon.hide();
};

const handleHideRelated = () => {
  const config = loadConfigOrDefault();
  if (!config.hideRelated) return;

  const $relSection = PP.getRelatedSection();
  if ($relSection.is(':visible')) {
    debugLog('handleHideRelated: hiding related section', { $relSection });
    $relSection.hide();
  }
};

const handleHideUpgradeToMaxAds = () => {
  const config = loadConfigOrDefault();
  if (config.hideUpgradeToMaxAds === HIDE_UPGRADE_TO_MAX_ADS_OPTIONS.OFF) return;

  const $upgradeAds = PP.getUpgradeToMaxAds();

  if ($upgradeAds.length === 0) {
    // debugLog('handleHideUpgradeToMaxAds: no upgrade ads found');
    return;
  }

  // Remove existing classes first
  $upgradeAds.removeClass(`${hideUpgradeToMaxAdsCls} ${hideUpgradeToMaxAdsSemiHideCls}`);

  if (config.hideUpgradeToMaxAds === HIDE_UPGRADE_TO_MAX_ADS_OPTIONS.HIDE) {
    $upgradeAds.addClass(hideUpgradeToMaxAdsCls);
    debugLog('handleHideUpgradeToMaxAds: hiding upgrade ads completely', { $upgradeAds });
  } else if (config.hideUpgradeToMaxAds === HIDE_UPGRADE_TO_MAX_ADS_OPTIONS.SEMI_HIDE) {
    $upgradeAds.addClass(hideUpgradeToMaxAdsSemiHideCls);
    debugLog('handleHideUpgradeToMaxAds: semi-hiding upgrade ads', { $upgradeAds });
  }
};

const handleModelSelectionListItemsMax = () => {
  const config = loadConfigOrDefault();
  if (config.modelSelectionListItemsMax === MODEL_SELECTION_LIST_ITEMS_MAX_OPTIONS.OFF) return;

  const maxItems = jq(PP.getModelSelectionListItems().toArray().filter(el => PP.isModelSelectionListItemMax(jq(el))));

  if (config.modelSelectionListItemsMax === MODEL_SELECTION_LIST_ITEMS_MAX_OPTIONS.HIDE) {
    maxItems.hide();
  } else if (config.modelSelectionListItemsMax === MODEL_SELECTION_LIST_ITEMS_MAX_OPTIONS.SEMI_HIDE) {
    maxItems.addClass(modelSelectionListItemsSemiHideCls);
  }
};

const handleCustomModelPopover = () => {
  const config = loadConfigOrDefault();
  const mode = config.customModelPopover;
  if (mode === CUSTOM_MODEL_POPOVER_MODE.OFF) return;

  const $modelSelectionList = PP.getModelSelectionList();
  if ($modelSelectionList.length === 0) return;
  const processedAttr = 'ph-processed-custom-model-popover';
  if ($modelSelectionList.attr(processedAttr)) return;
  $modelSelectionList.attr(processedAttr, true);

  $modelSelectionList.nthParent(2).css({ maxHeight: 'initial' });

  const getModelInfoFromListItemElement = (el) => {
    const $el = jq(el);
    const $modelName = $el.find('.flex-col > :is(.text-\\[13px\\], .text-super) > span');
    const modelName = $modelName.text().trim();
    const modelIsSelected = $modelName.parent().hasClass('text-super');
    return { $el, $modelName, modelName, modelIsSelected };
  };

  const markListItemAsReasoningModel = (el) => {
    const { $el, modelIsSelected } = getModelInfoFromListItemElement(el);
    const $icon = jq('<img>', {
      src: getLucideIconUrl(config.modelLabelUseIconForReasoningModels.toLowerCase()),
      alt: 'Reasoning model',
      class: classNames(reasoningModelCls, modelIsSelected ? iconColorCyanCls : iconColorPureWhiteCls),
    }).css({ marginLeft: '0px' });
    $el.find('.cursor-pointer > .flex').first().prepend($icon);
  };

  const $delims = $modelSelectionList.children(".sm\\:mx-sm");

  const removeAllDelims = () => {
    $delims.hide();
  };

  const removeAllModelDescriptions = () => {
    const $gapSm = $modelSelectionList.find('.group\\/item > .relative > .gap-sm');
    if ($gapSm.length === 0) {
      logError('handleCustomModelPopover: $gapSm not found', { $modelSelectionList, $gapSm });
    }
    $gapSm.css({ alignItems: 'center' });
  };

  const addModelIcons = () => {
    const $items = PP.getModelSelectionListItems();
    $items.each((_idx, el) => {
      const { $el, modelName, modelIsSelected } = getModelInfoFromListItemElement(el);
      // debugLog('addModelIcons: modelName=', modelName, ', $el=', $el);
      const modelDescriptor = PP.findModelDescriptorByName(modelName);
      if (!modelDescriptor) {
        logError('addModelIcons: modelDescriptor not found', { modelName, $el });
        return;
      }
      const iconUrl = getLobeIconsUrl(modelDescriptor.company);
      const $icon = jq('<img>', {
        src: iconUrl,
        alt: 'Model Icon',
        class: classNames(modelIconCls, modelIsSelected ? iconColorCyanCls : iconColorPureWhiteCls),
      }).css({ marginRight: '0' });
      $el.find('.cursor-pointer > .flex').first().prepend($icon);
    });
  };
  if (config.modelIconsInPopover) {
    addModelIcons();
  }

  const modelSelectionListType = PP.getModelSelectionListType($modelSelectionList);
  if (config.modelLabelUseIconForReasoningModels !== MODEL_LABEL_ICON_REASONING_MODEL.OFF) {
    $modelSelectionList.children()
      .filter((_idx, rEl) => {
        const $el = jq(rEl);
        const text = $el.find('span').text();
        // TODO: use model db
        return ['Thinking', 'Grok 4'].some(str => text.includes(str));
      })
      .each((_idx, el) => markListItemAsReasoningModel(el));
  }

  if (mode === CUSTOM_MODEL_POPOVER_MODE.COMPACT_LIST) {
    removeAllDelims();
    removeAllModelDescriptions();
    return;
  }
  if (mode === CUSTOM_MODEL_POPOVER_MODE.SIMPLE_LIST) {
    // it is already a list, we forced the height to grow
    return;
  }

  $modelSelectionList.css({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: mode === CUSTOM_MODEL_POPOVER_MODE.COMPACT_GRID ? '0px' : '10px',
    'grid-auto-rows': 'min-content',
  });

  if (mode === CUSTOM_MODEL_POPOVER_MODE.COMPACT_GRID) {
    removeAllDelims();
    removeAllModelDescriptions();
  }

  $delims.hide();
  $reasoningDelim.css({ gridColumn: 'span 2', });
};

const mainCaptionAppliedCls = genCssName('mainCaptionApplied');
const handleMainCaptionHtml = () => {
  const config = loadConfigOrDefault();
  if (!config.mainCaptionHtmlEnabled) return;
  if (PP.getMainCaption().hasClass(mainCaptionAppliedCls)) return;
  PP.setMainCaptionHtml(config.mainCaptionHtml);
  PP.getMainCaption().addClass(mainCaptionAppliedCls);
};

const handleCustomJs = () => {
  const config = loadConfigOrDefault();
  if (!config.customJsEnabled) return;

  try {
    // Use a static key to ensure we only run once per page load
    const dataKey = 'data-' + genCssName('custom-js-applied');
    if (!jq('body').attr(dataKey)) {
      jq('body').attr(dataKey, true);
      // Use Function constructor to evaluate the JS code
      const customJsFn = new Function(config.customJs);
      customJsFn();
    }
  } catch (error) {
    console.error('Error executing custom JS:', error);
  }
};

const handleCustomCss = () => {
  const config = loadConfigOrDefault();
  if (!config.customCssEnabled) return;

  try {
    // Check if custom CSS has already been applied
    const dataKey = 'data-' + genCssName('custom-css-applied');
    if (!jq('head').attr(dataKey)) {
      jq('head').attr(dataKey, true);
      const styleElement = jq('<style></style>')
        .addClass(customCssAppliedCls)
        .text(config.customCss);
      jq('head').append(styleElement);
    }
  } catch (error) {
    console.error('Error applying custom CSS:', error);
  }
};

const handleCustomWidgetsHtml = () => {
  const config = loadConfigOrDefault();
  if (!config.customWidgetsHtmlEnabled) return;

  try {
    // Check if custom widgets have already been applied
    const dataKey = 'data-' + genCssName('custom-widgets-html-applied');
    if (!jq('body').attr(dataKey)) {
      jq('body').attr(dataKey, true);
      const widgetContainer = jq('<div></div>')
        .addClass(customWidgetsHtmlAppliedCls)
        .html(config.customWidgetsHtml);
      PP.getPromptAreaWrapperOfNewThread().append(widgetContainer);
    }
  } catch (error) {
    console.error('Error applying custom widgets HTML:', error);
  }
};

const handleHideSideMenuLabels = () => {
  const config = loadConfigOrDefault();
  if (!config.hideSideMenuLabels) return;
  const $sideMenu = PP.getSidebar();
  if ($sideMenu.hasClass(sideMenuLabelsHiddenCls)) return;
  $sideMenu.addClass(sideMenuLabelsHiddenCls);
};

let leftMarginOfThreadContentOverride = null; // from API

const getStyleTagOfLeftMarginOfThreadContent = () => {
  return jq('head').find(`#${leftMarginOfThreadContentStylesId}`);
};

const removeStyleTagOfLeftMarginOfThreadContent = () => {
  const $style = getStyleTagOfLeftMarginOfThreadContent();
  if ($style.length > 0) { $style.remove(); }
};

const addStyleTagOfLeftMarginOfThreadContent = () => {
  const config = loadConfigOrDefault();
  if (getStyleTagOfLeftMarginOfThreadContent().length > 0) return;
  const val = parseFloat(config.leftMarginOfThreadContent);
  if (isNaN(val)) return;
  jq(`<style id="${leftMarginOfThreadContentStylesId}">.max-w-threadContentWidth { margin-left: ${val}em !important; }</style>`).appendTo("head");
};

const handleRemoveWhiteSpaceOnLeftOfThreadContent = () => {
  const config = loadConfigOrDefault();
  const val = parseFloat(config.leftMarginOfThreadContent);
  if (isNaN(val)) return;
  const shouldBeHidden = leftMarginOfThreadContentOverride ?? config.leftMarginOfThreadContentEnabled;
  const styleIsPresent = getStyleTagOfLeftMarginOfThreadContent().length > 0;
  if (shouldBeHidden) {
    if (styleIsPresent) return;
    addStyleTagOfLeftMarginOfThreadContent();
  } else {
    if (!styleIsPresent) return;
    removeStyleTagOfLeftMarginOfThreadContent();
  }
};

// Function to apply a tag's actions (works for both regular and toggle tags)
const applyTagActions = async (tag, options = {}) => {
  const { skipText = false, callbacks = {} } = options;

  debugLog('Applying tag actions for tag:', tag);

  // Apply mode setting
  if (tag.setMode) {
    const mode = tag.setMode.toLowerCase();
    if (mode === 'pro' || mode === 'research' || mode === 'deep-research' || mode === 'dr' || mode === 'lab') {
      // Convert aliases to the actual mode name that PP understands
      const normalizedMode = mode === 'dr' || mode === 'deep-research' ? 'research' : mode;

      try {
        await PP.doSelectQueryMode(normalizedMode);
        debugLog(`[applyTagActions]: Set mode to ${normalizedMode}`);
        wait(50);
      } catch (error) {
        debugLog(`[applyTagActions]: Error setting mode to ${normalizedMode}`, error);
      }
    } else {
      debugLog(`[applyTagActions]: Invalid mode: ${tag.setMode}`);
    }
  }

  // Apply model setting
  if (tag.setModel) {
    try {
      const modelDescriptor = PP.getModelDescriptorFromId(tag.setModel);
      debugLog('[applyTagActions]: set model=', tag.setModel, ' modelDescriptor=', modelDescriptor);

      if (modelDescriptor) {
        await PP.doSelectModel(modelDescriptor.index);
        debugLog(`[applyTagActions]: Selected model ${modelDescriptor.nameEn}`);
        if (callbacks.modelSet) callbacks.modelSet(modelDescriptor);
      } else {
        debugLog(`[applyTagActions]: Model descriptor not found for ${tag.setModel}`);
      }
    } catch (error) {
      debugLog(`[applyTagActions]: Error setting model to ${tag.setModel}`, error);
    }
  }

  // Apply sources setting
  if (tag.setSources) {
    try {
      // Use PP's high-level function that handles the whole process
      await PP.doSetSourcesSelectionListValues()(tag.setSources);
      debugLog(`[applyTagActions]: Sources set to ${tag.setSources}`);
      await PP.sleep(50);
      if (callbacks.sourcesSet) callbacks.sourcesSet();
    } catch (error) {
      logError(`[applyTagActions]: Error setting sources`, error);
    }
  }

  // Add text to prompt if it's not empty and we're not skipping text
  if (!skipText && tag.text && tag.text.trim().length > 0) {
    try {
      const $promptArea = PP.getAnyPromptArea();
      if ($promptArea.length) {
        const promptAreaRaw = $promptArea[0];

        debugLog(`[applyTagActions]: Element info - tagName: ${promptAreaRaw.tagName}, contentEditable: ${promptAreaRaw.contentEditable}, hasContentEditableAttr: ${promptAreaRaw.hasAttribute('contenteditable')}`);

        // Get current text content properly for both textarea and contenteditable
        const { currentText, caretPos } = PP.getPromptAreaData($promptArea);

        debugLog(`[applyTagActions]: Current text: "${currentText.substring(0, 50)}${currentText.length > 50 ? '...' : ''}", length: ${currentText.length}, caret: ${caretPos}`);
        debugLog(`[applyTagActions]: Tag text: "${tag.text}", position: ${tag.position || 'default'}`);

        const newText = applyTagToString(tag, currentText, caretPos);
        debugLog(`[applyTagActions]: New text: "${newText.substring(0, 50)}${newText.length > 50 ? '...' : ''}", length: ${newText.length}`);

        PP.setPromptAreaValue($promptArea, newText);
        debugLog(`[applyTagActions]: Applied text: "${tag.text.substring(0, 20)}${tag.text.length > 20 ? '...' : ''}"`);

        // Check if the text is applied with retries, log error if all attempts fail
        const maxAttempts = 5;
        const delayMs = 50;
        const checkTextApplied = async (attempt = 0) => {
          if (promptAreaRaw.textContent === newText) return true;
          if (attempt >= maxAttempts) {
            logError(`[applyTagActions]: Failed to apply text after ${maxAttempts} attempts`);
            return false;
          }
          await PP.sleep(delayMs);
          return checkTextApplied(attempt + 1);
        };
        await checkTextApplied();

        if (callbacks.textApplied) {
          debugLog(`[applyTagActions]: Calling textApplied callback`);
          callbacks.textApplied(newText);
        }
      } else {
        debugLog(`[applyTagActions]: No prompt area found for text insertion`);
      }
    } catch (error) {
      debugLog(`[applyTagActions]: Error applying text`, error);
    }
  }
};

// Function to apply toggled tags' actions when submit is clicked
const applyToggledTagsOnSubmit = async ($wrapper) => {
  debugLog('Applying toggled tags on submit', { $wrapper });
  const config = loadConfigOrDefault();

  const allTags = parseTagsText(config.tagsText ?? defaultConfig.tagsText);
  const currentContainerType = getPromptWrapperTagContainerType($wrapper);

  if (!currentContainerType) {
    logError('Could not determine current container type, skipping toggled tags application', {
      $wrapper,
      currentContainerType,
      allTags,
    });
    return false;
  }

  // Find all toggled tags that are relevant for the current container type
  const toggledTags = allTags.filter(tag => {
    // First check if it's a toggle tag
    if (!tag.toggleMode) return false;
    const tagId = generateToggleTagId(tag);
    if (!tagId) return false;

    // Check in-memory toggle state first
    const inMemoryToggled = window._phTagToggleState && window._phTagToggleState[tagId] === true;

    // Then fall back to saved state if tagToggleSave is enabled
    const savedToggled = config.tagToggleSave && config.tagToggledStates && config.tagToggledStates[tagId] === true;

    // If neither is toggled, return false
    if (!inMemoryToggled && !savedToggled) return false;

    // Then check if this tag is relevant for the current container
    return isTagRelevantForContainer(currentContainerType)(tag);
  });

  debugLog(`Toggled tags for ${currentContainerType} context:`, toggledTags.length);

  // Apply each toggled tag's actions sequentially, waiting for each to complete
  for (const tag of toggledTags) {
    debugLog(`Applying toggled tag: ${tag.label || 'Unnamed tag'}`);
    try {
      await applyTagActions(tag);
      await PP.sleep(10);
      debugLog(`Successfully applied toggled tag: ${tag.label || 'Unnamed tag'}`);
    } catch (error) {
      logError(`Error applying toggled tag: ${tag.label || 'Unnamed tag'}`, error);
    }
  }

  return toggledTags.length > 0;
};

// Function to check if there are active toggled tags
const hasActiveToggledTags = () => {
  const config = loadConfigOrDefault();

  // Check in-memory toggle states first
  if (window._phTagToggleState && Object.values(window._phTagToggleState).some(state => state === true)) {
    return true;
  }

  // Then check saved toggle states if enabled
  if (!config.tagToggleSave || !config.tagToggledStates) return false;

  // Check if any tags are toggled on in saved state
  return Object.values(config.tagToggledStates).some(state => state === true);
};

// Function to check if there are active toggled tags for the current context
const hasActiveToggledTagsForCurrentContext = ($wrapper) => {
  const config = loadConfigOrDefault();
  const currentContainerType = getPromptWrapperTagContainerType($wrapper);

  // START DEBUG LOGGING
  const wrapperId = $wrapper && $wrapper.length ? ($wrapper.attr('id') || 'wrapper-' + Math.random().toString(36).substring(2, 9)) : 'no-wrapper';
  if (!$wrapper || !$wrapper.length) {
    debugLogTags(`hasActiveToggledTagsForCurrentContext - No valid wrapper provided for ${wrapperId}`);
    return false;
  }

  if (!currentContainerType) {
    debugLogTags(`hasActiveToggledTagsForCurrentContext - No container type for wrapper ${wrapperId}`);
    return false;
  }
  debugLogTags(`hasActiveToggledTagsForCurrentContext - Container type ${currentContainerType} for wrapper ${wrapperId}`);
  // END DEBUG LOGGING

  // Get all tags
  const allTags = parseTagsText(config.tagsText ?? defaultConfig.tagsText);

  // Filter for toggled-on tags relevant to the current context
  const hasActiveTags = allTags.some(tag => {
    if (!tag.toggleMode) return false;
    const tagId = generateToggleTagId(tag);
    if (!tagId) return false;

    // Check in-memory toggle state first
    const inMemoryToggled = window._phTagToggleState && window._phTagToggleState[tagId] === true;

    // Then fall back to saved state if tagToggleSave is enabled
    const savedToggled = config.tagToggleSave && config.tagToggledStates && config.tagToggledStates[tagId] === true;

    // If neither is toggled, return false
    if (!inMemoryToggled && !savedToggled) return false;

    // Check if this tag is relevant for the current container
    const isRelevant = isTagRelevantForContainer(currentContainerType)(tag);

    // DEBUG LOG
    if (inMemoryToggled || savedToggled) {
      debugLogTags(`hasActiveToggledTagsForCurrentContext - Tag ${tag.label || 'unnamed'}: inMemory=${inMemoryToggled}, saved=${savedToggled}, relevant=${isRelevant}`);
    }

    return isRelevant;
  });

  // DEBUG LOG
  debugLogTags(`hasActiveToggledTagsForCurrentContext - Final result for ${wrapperId}: ${hasActiveTags}`);

  return hasActiveTags;
};

// Function to get a comma-separated list of active toggled tag labels
const getActiveToggledTagLabels = ($wrapper) => {
  const config = loadConfigOrDefault();

  // Get all tags
  const allTags = parseTagsText(config.tagsText ?? defaultConfig.tagsText);
  // Filter for toggled-on tags
  const activeTags = allTags.filter(tag => {
    if (!tag.toggleMode) return false;
    const tagId = generateToggleTagId(tag);
    if (!tagId) return false;

    // Check in-memory toggle state first
    const inMemoryToggled = window._phTagToggleState && window._phTagToggleState[tagId] === true;

    // Then fall back to saved state if tagToggleSave is enabled
    const savedToggled = config.tagToggleSave && config.tagToggledStates && config.tagToggledStates[tagId] === true;

    // If neither is toggled, return false
    if (!inMemoryToggled && !savedToggled) return false;

    // If wrapper is provided, check if this tag is relevant for the current container type
    if ($wrapper) {
      const currentContainerType = getPromptWrapperTagContainerType($wrapper);
      if (currentContainerType && !isTagRelevantForContainer(currentContainerType)(tag)) {
        return false;
      }
    }

    return true;
  });

  // Return labels joined by commas
  return activeTags.map(tag => tag.label || 'Unnamed tag').join(', ');
};

const mockChromeRuntime = () => {
  if (!window.chrome) {
    window.chrome = {};
  }
  if (!window.chrome.runtime) {
    window.chrome.runtime = {
      _about: 'mock by Perplexity Helper; otherwise clicking on the submit button programmatically crashes in promise',
      sendMessage: function () {
        log('mockChromeRuntime: sendMessage', arguments);
        return Promise.resolve({ success: true });
      }
    };
  }
};

// Enhanced submit button for toggled tags
const createEnhancedSubmitButton = (originalButton) => {
  const $originalBtn = jq(originalButton);
  const config = loadConfigOrDefault();

  // Find the proper prompt area wrapper, going up to queryBox class first
  const $queryBox = $originalBtn.closest(`.${queryBoxCls}`);
  const $wrapper = $queryBox.length
    ? $queryBox.parent()
    : $originalBtn.closest('.flex').parent().parent().parent();

  const hasActiveInContext = hasActiveToggledTagsForCurrentContext($wrapper);
  const activeTagLabels = getActiveToggledTagLabels($wrapper);
  const title = activeTagLabels
    ? `Submit with toggled tags applied (${activeTagLabels})`
    : 'Submit with toggled tags applied';

  const $enhancedBtn = jq('<div/>')
    .addClass(enhancedSubmitButtonCls)
    .attr('title', title)
    // ISSUE: Using hard-coded 'active' class instead of enhancedSubmitButtonActiveCls
    .toggleClass('active', hasActiveInContext && config.tagToggleModeIndicators)
    .html(`<span class="${enhancedSubmitButtonPhTextCls}">PH</span>`);

  // Add the enhanced button as an overlay on the original
  $originalBtn.css('position', 'relative');
  $originalBtn.append($enhancedBtn);

  // Handle click on enhanced button
  $enhancedBtn.on('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Show temporary processing indicator
    // ISSUE: Using hard-coded 'active' class instead of enhancedSubmitButtonActiveCls
    $enhancedBtn.addClass('active').css('opacity', '1').find(`.${enhancedSubmitButtonPhTextCls}`).text('...');

    // DEBUG
    if (loadConfigOrDefault().debugTagsMode) {
      debugLogTags(`Enhanced button click - adding 'active' class (should be ${enhancedSubmitButtonActiveCls})`);
    }

    const finishProcessing = () => {
      if (loadConfigOrDefault().debugTagsSuppressSubmit) {
        log('Suppressing submit after applying tags');
        return;
      }
      try {
        // $originalBtn[0].click();
        // const event = new MouseEvent('click', {
        //   bubbles: true,
        //   cancelable: true,
        // });
        // $originalBtn[0].dispatchEvent(event);
        // $originalBtn.trigger('click');

        // Try to make a more authentic-looking click event
        // const clickEvent = new MouseEvent('click', {
        //   bubbles: true,
        //   cancelable: true,
        //   view: window,
        //   detail: 1, // number of clicks
        //   isTrusted: true // attempt to make it look trusted (though this is readonly)
        // });
        // $originalBtn[0].dispatchEvent(clickEvent);

        // Find the React component's props
        // const reactInstance = Object.keys($originalBtn[0]).find(key => key.startsWith('__reactFiber$'));
        // if (reactInstance) {
        //   const props = $originalBtn[0][reactInstance].memoizedProps;
        //   if (props && props.onClick) {
        //     // Call the handler directly, bypassing the event system
        //     props.onClick();
        //   } else {
        //     logError('[createEnhancedSubmitButton]: No onClick handler found', {
        //       $originalBtn,
        //       reactInstance,
        //       props,
        //     });
        //   }
        // } else {
        //   logError('[createEnhancedSubmitButton]: No React instance found', {
        //     $originalBtn,
        //   });
        // }

        // mockChromeRuntime(); // maybe no longer needed?
        const $freshButton = PP.getSubmitButtonAnyExceptMic($wrapper);
        if ($freshButton.length) {
          debugLog('[createEnhancedSubmitButton.finishProcessing]: triggering fresh button click', { $freshButton, ariaLabel: $freshButton.attr('aria-label'), dataTestId: $freshButton.attr('data-testid') });
          $freshButton.click();
        } else {
          logError('[createEnhancedSubmitButton]: No fresh button found', { $wrapper });
        }
      } catch (error) {
        logError('[createEnhancedSubmitButton]: Error in finishProcessing:', error);
      }
    };

    try {
      // Apply all toggled tags sequentially, waiting for each to complete
      const tagsApplied = await applyToggledTagsOnSubmit($wrapper);

      // Add a small delay after applying all tags to ensure UI updates are complete
      if (tagsApplied) { await PP.sleep(50); }

      // Reset the button appearance
      $enhancedBtn.css('opacity', '').find(`.${enhancedSubmitButtonPhTextCls}`).text('');
      if (!hasActiveInContext) {
        // ISSUE: Using hard-coded 'active' class instead of enhancedSubmitButtonActiveCls
        $enhancedBtn.removeClass('active');

        // DEBUG
        if (loadConfigOrDefault().debugTagsMode) {
          debugLogTags(`Enhanced button - removing 'active' class because !hasActiveInContext (should be ${enhancedSubmitButtonActiveCls})`);
        }
      }

      // Trigger the original button click
      finishProcessing();
    } catch (error) {
      console.error('Error in enhanced submit button:', error);
      $enhancedBtn.css('opacity', '').find(`.${enhancedSubmitButtonPhTextCls}`).text('');
      if (!hasActiveInContext) {
        // ISSUE: Using hard-coded 'active' class instead of enhancedSubmitButtonActiveCls
        $enhancedBtn.removeClass('active');

        // DEBUG
        if (loadConfigOrDefault().debugTagsMode) {
          debugLogTags(`Enhanced button error handler - removing 'active' class (should be ${enhancedSubmitButtonActiveCls})`);
        }
      }
      // Still attempt to submit even if there was an error
      finishProcessing();
    }
  });

  return $enhancedBtn;
};

// Add enhanced submit buttons to handle toggled tags
const patchSubmitButtonsForToggledTags = () => {
  const config = loadConfigOrDefault();

  // Skip if toggle mode hooks are disabled
  if (!config.toggleModeHooks) return;

  const submitButtons = PP.getSubmitButtonAnyExceptMic();
  if (!submitButtons.length) return;

  submitButtons.each((_, btn) => {
    const $btn = jq(btn);
    if ($btn.attr('data-patched-for-toggled-tags')) return;

    // Create our enhanced button overlay
    createEnhancedSubmitButton(btn);

    // Mark as patched
    $btn.attr('data-patched-for-toggled-tags', 'true');
  });
};

// Function to add keypress listeners to prompt areas
const updateTextareaIndicator = ($textarea) => {
  if (!$textarea || !$textarea.length) return;

  // Get the current config
  const config = loadConfigOrDefault();

  // Get the wrapper
  const $wrapper = PP.getAnyPromptAreaWrapper($textarea.nthParent(4));
  if (!$wrapper || !$wrapper.length) return;

  // Check for active toggled tags in this context
  const hasActiveInContext = hasActiveToggledTagsForCurrentContext($wrapper);

  // Should we show the indicator?
  const shouldShowIndicator = hasActiveInContext && config.tagToggleModeIndicators;

  // Get current state to avoid unnecessary DOM updates
  const currentlyHasClass = $textarea.hasClass(promptAreaKeyListenerCls);
  const currentlyHasIndicator = $textarea.siblings(`.${promptAreaKeyListenerIndicatorCls}`).length > 0;

  // Only update DOM if state has changed
  if (currentlyHasClass !== shouldShowIndicator || currentlyHasIndicator !== shouldShowIndicator) {
    if (shouldShowIndicator) {
      // Apply the class for the glow effect with transition if not already applied
      if (!currentlyHasClass) {
        $textarea.addClass(promptAreaKeyListenerCls);
      }

      // Add the pulse dot indicator if not already present
      if (!currentlyHasIndicator) {
        // Make sure parent has relative positioning for proper indicator positioning
        const $parent = $textarea.parent();
        if ($parent.css('position') !== 'relative') {
          $parent.css('position', 'relative');
        }

        const $indicator = jq('<div>')
          .addClass(promptAreaKeyListenerIndicatorCls)
          .attr('title', 'Toggle tags active - Press Enter to submit');

        $textarea.after($indicator);

        // Force a reflow then add visible class for animation
        $indicator[0].offsetHeight; // Force reflow
        $indicator.addClass('visible');
      }
    } else {
      // Remove the class with transition for fade out
      if (currentlyHasClass) {
        $textarea.removeClass(promptAreaKeyListenerCls);
      }

      // For indicator, first make it invisible with transition, then remove from DOM
      if (currentlyHasIndicator) {
        const $indicator = $textarea.siblings(`.${promptAreaKeyListenerIndicatorCls}`);
        $indicator.removeClass('visible');

        // Remove from DOM after transition completes
        setTimeout(() => {
          if ($indicator.length) $indicator.remove();
        }, 500); // Match the transition duration in CSS
      }
    }
  }
};



const updateToggleIndicators = () => {
  const config = loadConfigOrDefault();

  // Track state changes with this object for debugging
  const debugStateChanges = {
    totalButtons: 0,
    unchanged: 0,
    titleChanged: 0,
    activeStateChanged: 0,
    stateChanges: []
  };

  // Update all enhanced submit buttons individually
  jq(`.${enhancedSubmitButtonCls}`).each((idx, btn) => {
    const $btn = jq(btn);
    const $originalBtn = $btn.parent();
    const btnId = $btn.attr('id') || `btn-${idx}`;

    debugStateChanges.totalButtons++;

    // Find the proper prompt area wrapper, going up to queryBox class first
    const $queryBox = $originalBtn.closest(`.${queryBoxCls}`);
    const $wrapper = $queryBox.length
      ? $queryBox.parent()
      : $originalBtn.closest('.flex').parent().parent().parent();

    // DEBUGGING - Track button's wrapper
    const wrapperId = $wrapper && $wrapper.length ? ($wrapper.attr('id') || 'wrapper-' + Math.random().toString(36).substring(2, 9)) : 'no-wrapper';
    if (loadConfigOrDefault().debugTagsMode) {
      debugLogTags(`updateToggleIndicators - Button ${btnId} in wrapper ${wrapperId}`);
    }

    const hasActiveInContext = hasActiveToggledTagsForCurrentContext($wrapper);
    const activeTagLabels = getActiveToggledTagLabels($wrapper);
    const title = activeTagLabels
      ? `Submit with toggled tags applied (${activeTagLabels})`
      : 'Submit with toggled tags applied';

    // Get current state to avoid unnecessary DOM updates
    // ISSUE: using hard-coded 'active' class instead of generated enhancedSubmitButtonActiveCls
    const isCurrentlyActive = $btn.hasClass('active');
    const shouldBeActive = hasActiveInContext && config.tagToggleModeIndicators;

    // DEBUG - Log the class mismatch
    if (loadConfigOrDefault().debugTagsMode) {
      const hasGeneratedClass = $btn.hasClass(enhancedSubmitButtonActiveCls);
      if (isCurrentlyActive !== hasGeneratedClass) {
        debugLogTags(`Class mismatch detected for ${btnId}: 'active'=${isCurrentlyActive}, '${enhancedSubmitButtonActiveCls}'=${hasGeneratedClass}`);
      }
    }
    const currentTitle = $btn.attr('title');

    // DEBUGGING - Track state for this button
    const stateChange = {
      btnId,
      wrapperId,
      isCurrentlyActive,
      shouldBeActive,
      stateChanged: isCurrentlyActive !== shouldBeActive,
      titleChanged: currentTitle !== title
    };
    debugStateChanges.stateChanges.push(stateChange);

    // Only update DOM elements if state has actually changed
    if (isCurrentlyActive !== shouldBeActive || currentTitle !== title) {
      // Update title if changed
      if (currentTitle !== title) {
        debugStateChanges.titleChanged++;
        $btn.attr('title', title);
      }

      // Toggle active class with transition effect if state has changed
      if (isCurrentlyActive !== shouldBeActive) {
        debugStateChanges.activeStateChanged++;
        // ISSUE: We're using literal 'active' here instead of enhancedSubmitButtonActiveCls
        // This should be fixed to use the generated class, but we're just logging for now
        // No additional class manipulation needed - CSS transitions handle the animation
        $btn.toggleClass('active', shouldBeActive);

        if (loadConfigOrDefault().debugTagsMode) {
          debugLogTags(`Class toggle for ${btnId}: 'active' changed to ${shouldBeActive}, from ${isCurrentlyActive}`);
        }

        // If transitioning to active, ensure we have proper z-index to show over other elements
        if (shouldBeActive) {
          $originalBtn.css('z-index', '5');
        } else {
          // Reset z-index after transition
          setTimeout(() => $originalBtn.css('z-index', ''), 500);
        }
      }

      // Update outline only if debugging state requires it
      $btn.css({ outline: config.debugTagsSuppressSubmit ? '5px solid red' : 'none' });
    } else {
      debugStateChanges.unchanged++;
    }
  });

  // Log state change stats
  if (loadConfigOrDefault().debugTagsMode) {
    if (debugStateChanges.activeStateChanged > 0) {
      debugLogTags(`updateToggleIndicators - SUMMARY: total=${debugStateChanges.totalButtons}, unchanged=${debugStateChanges.unchanged}, titleChanged=${debugStateChanges.titleChanged}, activeStateChanged=${debugStateChanges.activeStateChanged}`);
      debugLogTags('updateToggleIndicators - State changes:', debugStateChanges.stateChanges.filter(sc => sc.stateChanged));
    }
  }

  // Also update all textarea indicators when toggle mode hooks are enabled
  if (config.toggleModeHooks) {
    // Get all prompt areas with keypress listeners (both textarea and contenteditable divs)
    const promptAreas = jq('textarea[data-toggle-keypress-listener="true"], div[contenteditable][data-toggle-keypress-listener="true"]');
    if (promptAreas.length) {
      promptAreas.each((_, promptArea) => {
        updateTextareaIndicator(jq(promptArea));
      });
    }
  }
};

// Function to reset all toggle states (both in-memory and saved if tagToggleSave is enabled)
const resetAllToggleStates = () => {
  // Reset in-memory state
  window._phTagToggleState = {};

  // Reset saved state if tagToggleSave is enabled
  const config = loadConfigOrDefault();
  if (config.tagToggleSave && config.tagToggledStates) {
    const updatedConfig = {
      ...config,
      tagToggledStates: {}
    };
    saveConfig(updatedConfig);
  }

  // Update existing toggle tags directly in the DOM if possible
  const existingToggledTags = jq(`.${tagCls}[data-toggled="true"]`);
  if (existingToggledTags.length > 0) {
    existingToggledTags.each((_, el) => {
      const $el = jq(el);
      const tagData = JSON.parse($el.attr('data-tag') || '{}');

      if (tagData) {
        // Reset visual state back to untoggled
        updateToggleTagState($el, tagData, false);
      }
    });
  } else {
    // If we couldn't find any toggled tags in the DOM (perhaps they were added after),
    // fall back to a full refresh
    refreshTags({ force: true });
  }

  // Update indicators
  updateToggleIndicators();
};

// Function to generate a consistent ID for toggle tags
const generateToggleTagId = tag => {
  if (!tag.toggleMode) return null;
  return `toggle:${(tag.label || '') + ':' + (tag.position || '') + ':' + (tag.color || '')}:${tag.originalIndex || 0}`;
};

const work = () => {
  handleModalCreation();
  handleTopSettingsButtonInsertion();
  handleTopSettingsButtonSetup();
  handleSettingsInit();
  handleLeftSettingsButtonSetup();
  handleExtraSpaceBellowLastAnswer();
  handleHideDiscoverButton();
  handleHideSideMenuLabels();
  handleRemoveWhiteSpaceOnLeftOfThreadContent();
  updateToggleIndicators();
  patchSubmitButtonsForToggledTags();
  handleQuickProfileButton();
  handleRemoveAllUploadedFilesButton();

  const regex = /^https:\/\/www\.perplexity\.ai\/search\/?.*/;
  const currentUrl = jq(location).attr('href');
  const matchedCurrentUrlAsSearchPage = regex.test(currentUrl);

  // debugLog("currentUrl", currentUrl);
  // debugLog("matchedCurrentUrlAsSearchPage", matchedCurrentUrlAsSearchPage);

  if (matchedCurrentUrlAsSearchPage) {
    handleSearchPage();
  }
};

const fastWork = () => {
  handleCustomModelPopover();
  handleModelSelectionListItemsMax();
  handleSlimLeftMenu();
  handleHideHomeWidgets();
  handleHideRelated();
  handleHideUpgradeToMaxAds();
  applySideMenuHiding();
  handleReplaceIconsInMenu();
  handleModelLabel();
  handleMainCaptionHtml();
  handleCustomJs();
  handleCustomCss();
  handleCustomWidgetsHtml();
};

// TODO: clean up, feels overly complex
const getFileBarScroller = ($context) => {
  const hasClassToken = ($el, token) => {
    const cls = ($el.attr('class') || '').toString();
    // strict token check first
    if (cls.split(/\s+/).includes(token)) return true;
    // fallback contains check for utility classes like overflow-x-auto
    return cls.includes(token);
  };

  const looksLikeScroller = ($el) => (
    hasClassToken($el, 'flex') &&
    (hasClassToken($el, 'overflow-x-auto') || hasClassToken($el, 'scroll-mx-md')) &&
    (hasClassToken($el, 'snap-x') || $el.find('> div.snap-start').length > 0)
  );

  // Strategy A: derive from a known remove button
  const $removeBtn = $context.find('button[data-testid="remove-uploaded-file"]').first();
  if ($removeBtn.length) {
    let $p = $removeBtn.parent();
    for (let i = 0; i < 8 && $p && $p.length; i += 1) {
      if (looksLikeScroller($p)) return $p;
      $p = $p.parent();
    }
  }

  // Strategy B: derive from a known file icon
  const $icon = $context.find('[data-testid="file-type-icon"]').first();
  if ($icon.length) {
    let $p = $icon.parent();
    for (let i = 0; i < 8 && $p && $p.length; i += 1) {
      if (looksLikeScroller($p)) return $p;
      $p = $p.parent();
    }
  }

  // Strategy C: search ancestors
  const $scope = $context.add($context.parents());
  const $removeBtn2 = $scope.find('button[data-testid="remove-uploaded-file"]').first();
  if ($removeBtn2.length) {
    const $chip = $removeBtn2.closest('div.snap-start');
    if ($chip.length) {
      const $scroller = $chip.parent();
      if ($scroller.length) return $scroller;
    }
  }
  const $icon2 = $scope.find('[data-testid="file-type-icon"]').first();
  if ($icon2.length) {
    const $chip = $icon2.closest('div.snap-start');
    if ($chip.length) {
      const $scroller = $chip.parent();
      if ($scroller.length) return $scroller;
    }
  }

  // Strategy D: global fallback with class heuristics
  const candidates = jq('div.flex, div.grid');
  const filtered = candidates.filter((_, el) => {
    const $el = jq(el);
    if (!looksLikeScroller($el)) return false;
    const hasChips = $el.find('div.snap-start [data-testid="file-type-icon"]').length > 0;
    return hasChips;
  });
  if (filtered.length) return jq(filtered.get(0));

  // Strategy E: global remove button/icon derivation
  const $globalRemove = jq('button[data-testid="remove-uploaded-file"]').first();
  if ($globalRemove.length) {
    let $p = $globalRemove.parent();
    for (let i = 0; i < 10 && $p && $p.length; i += 1) {
      if (looksLikeScroller($p)) return $p;
      $p = $p.parent();
    }
  }
  const $globalIcon = jq('[data-testid="file-type-icon"]').first();
  if ($globalIcon.length) {
    let $p = $globalIcon.parent();
    for (let i = 0; i < 10 && $p && $p.length; i += 1) {
      if (looksLikeScroller($p)) return $p;
      $p = $p.parent();
    }
  }

  return jq();
};

const removeAllUploadedFilesInCurrentPromptArea = () => {
  const $wrapper = PP.getAnyPromptAreaWrapper();
  if (!$wrapper.length) return;
  const $allRemoveButtons = $wrapper.find('button[data-testid="remove-uploaded-file"]');
  // Click each existing remove button
  $allRemoveButtons.each((_, el) => {
    const $btn = jq(el);
    // Attempt to click via DOM API to avoid jQuery preventing default
    const dom = $btn.get(0);
    if (dom) dom.click();
  });
};

const ensureRemoveAllButtonIn = ($scroller) => {
  console.log('ensureRemoveAllButtonIn', $scroller);
  // If already wrapped and button exists, do nothing
  if ($scroller.parent().find(`.${removeUploadedFilesAllButtonCls}`).length > 0) return;

  const iconUrl = getLucideIconUrl('trash-2');
  const $btn = jq('<button/>')
    .addClass(removeUploadedFilesAllButtonCls)
    .attr('type', 'button')
    .attr('title', 'Remove all uploaded files')
    .append(jq('<img/>').attr('src', iconUrl).css({ width: '14px', height: '14px', filter: 'invert(70%)' }));

  $btn.on('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeAllUploadedFilesInCurrentPromptArea();
  });

  const $wrapper = jq('<div/>').addClass(removeUploadedFilesAllButtonWrapperCls);
  $wrapper.append($btn);
  $scroller.before($wrapper);
};

const DEBUG_REMOVE_ALL_UPLOADED_FILES_BUTTON = false;

const handleRemoveAllUploadedFilesButton = () => {
  const logT = DEBUG_REMOVE_ALL_UPLOADED_FILES_BUTTON ? debugLogThrottled : () => {};

  const config = loadConfigOrDefault();
  logT('config', { showRemoveAllUploadedFilesButton: config.showRemoveAllUploadedFilesButton });
  if (!config.showRemoveAllUploadedFilesButton) return;

  const $area = PP.getAnyPromptArea();
  logT('handleRemoveAllUploadedFilesButton', { $area });
  if (!$area.length) return;

  const $wrapper = PP.getAnyPromptAreaWrapper($area);
  let $scroller = getFileBarScroller($wrapper);
  if (!$scroller.length) {
    $scroller = getFileBarScroller(jq('body'));
  }
  logT('handleRemoveAllUploadedFilesButton', { $scroller });
  if (!$scroller || !$scroller.length) return;
  ensureRemoveAllButtonIn($scroller);
};

const fontUrls = {
  Roboto: 'https://fonts.cdnfonts.com/css/roboto',
  Montserrat: 'https://fonts.cdnfonts.com/css/montserrat',
  Lato: 'https://fonts.cdnfonts.com/css/lato',
  Oswald: 'https://fonts.cdnfonts.com/css/oswald-4',
  Raleway: 'https://fonts.cdnfonts.com/css/raleway-5',
  'Ubuntu Mono': 'https://fonts.cdnfonts.com/css/ubuntu-mono',
  Nunito: 'https://fonts.cdnfonts.com/css/nunito',
  Poppins: 'https://fonts.cdnfonts.com/css/poppins',
  'Playfair Display': 'https://fonts.cdnfonts.com/css/playfair-display',
  Merriweather: 'https://fonts.cdnfonts.com/css/merriweather',
  'Fira Sans': 'https://fonts.cdnfonts.com/css/fira-sans',
  Quicksand: 'https://fonts.cdnfonts.com/css/quicksand',
  Comfortaa: 'https://fonts.cdnfonts.com/css/comfortaa-3',
  'Almendra': 'https://fonts.cdnfonts.com/css/almendra',
  'Enchanted Land': 'https://fonts.cdnfonts.com/css/enchanted-land',
  'Cinzel Decorative': 'https://fonts.cdnfonts.com/css/cinzel-decorative',
  'Orbitron': 'https://fonts.cdnfonts.com/css/orbitron',
  'Exo 2': 'https://fonts.cdnfonts.com/css/exo-2',
  'Chakra Petch': 'https://fonts.cdnfonts.com/css/chakra-petch',
  'Open Sans Condensed': 'https://fonts.cdnfonts.com/css/open-sans-condensed',
  'Saira Condensed': 'https://fonts.cdnfonts.com/css/saira-condensed',
  Inter: 'https://cdn.jsdelivr.net/npm/@fontsource/inter@4.5.0/index.min.css',
  'JetBrains Mono': 'https://fonts.cdnfonts.com/css/jetbrains-mono',
};

const loadFont = (fontName) => {
  const fontUrl = fontUrls[fontName];
  debugLog('loadFont', { fontName, fontUrl });
  if (fontUrl) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;
    document.head.appendChild(link);
  }
};

const setupFixImageGenerationOverlay = () => {
  const config = loadConfigOrDefault();
  if (config.fixImageGenerationOverlay) {
    setInterval(handleFixImageGenerationOverlay, 250);
  }
};

(function () {
  if (loadConfigOrDefault()?.debugMode) {
    enableDebugMode();
  }

  debugLog('TAGS_PALETTES', TAGS_PALETTES);
  if (loadConfigOrDefault()?.debugTagsMode) {
    enableTagsDebugging();
  }

  // Initialize in-memory toggle state from saved state if tagToggleSave is enabled
  const config = loadConfigOrDefault();
  if (config.tagToggleSave && config.tagToggledStates) {
    window._phTagToggleState = { ...config.tagToggledStates };
    debugLog('Initialized in-memory toggle state from saved state', window._phTagToggleState);
  } else {
    window._phTagToggleState = {};
  }

  'use strict';
  jq("head").append(`<style>${styles}</style>`);

  setupTags();
  setupFixImageGenerationOverlay();
  initializePerplexityHelperHandlers();

  const mainInterval = setInterval(work, 1000);
  // This interval is too fast (100ms) which causes frequent DOM updates
  // and leads to the class toggling issue with 'active' vs enhancedSubmitButtonActiveCls
  const fastInterval = setInterval(fastWork, 100);
  window.ph = {
    stopWork: () => { clearInterval(mainInterval); clearInterval(fastInterval); },
    work,
    fastWork,
    jq,
    showPerplexityHelperSettingsModal,
    removeAllUploadedFiles: () => removeAllUploadedFilesInCurrentPromptArea(),
    enableTagsDebugging: () => { debugTags = true; },
    disableTagsDebugging: () => { debugTags = false; },
    leftMarginOfThreadContent: {
      enable: () => {
        leftMarginOfThreadContentOverride = true;
        handleRemoveWhiteSpaceOnLeftOfThreadContent();
      },
      disable: () => {
        leftMarginOfThreadContentOverride = false;
        handleRemoveWhiteSpaceOnLeftOfThreadContent();
      },
      toggle: () => {
        leftMarginOfThreadContentOverride = !leftMarginOfThreadContentOverride;
        handleRemoveWhiteSpaceOnLeftOfThreadContent();
      },
    },
  };

  loadFont(loadConfigOrDefault().tagFont);
  loadFont('JetBrains Mono');

  // Auto open settings if enabled
  if (loadConfigOrDefault()?.autoOpenSettings) {
    // Use setTimeout to ensure the DOM is ready
    setTimeout(() => {
      showPerplexityHelperSettingsModal();
    }, 1000);
  }

  console.log(`%c${userscriptName}%c\n  %cTiartyos%c & %cmonnef%c\n ... loaded`,
    'color: #aaffaa; font-size: 1.5rem; background-color: rgba(0, 0, 0, 0.5); padding: 2px;',
    '',
    'color: #6b02ff; font-weight: bold; background-color: rgba(0, 0, 0, 0.5); padding: 2px;',
    '',
    'color: #aa2cc3; font-weight: bold; background-color: rgba(0, 0, 0, 0.5); padding: 2px;',
    '',
    '');
  console.log('to show settings use:\nph.showPerplexityHelperSettingsModal()');
}());
