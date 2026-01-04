// ==UserScript==
// @name        Disposal J.A.R.V.I.S. Updated
// @namespace   http://tampermonkey.net/
// @version     1.1
// @description color disposal options based on safety
// @author      azraelkun
// @match       https://www.torn.com/page.php?sid=crimes*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/516155/Disposal%20JARVIS%20Updated.user.js
// @updateURL https://update.greasyfork.org/scripts/516155/Disposal%20JARVIS%20Updated.meta.js
// ==/UserScript==

// Based on Disposal J.A.R.V.I.S. by Terekhov
// https://update.greasyfork.org/scripts/480866/Disposal%20JARVIS.user.js

(function () {
  'use strict';

const colors = {
    safe: '#40Ab24',
    moderatelySafe: '#82d66b',
    unsafe: '#FFC300',
    risky: '#FF5733',
    dangerous: '#B51B1B',
};
const JOB_METHOD_DIFFICULTIES_MAP = {
    'Biological Waste': {
      safe: ['Sink'],
      moderatelySafe: [],
      unsafe: ['Bury'],
      risky: ['Burn'],
      dangerous: ['Abandon']
  },
  'Body Part': {
      safe: ['Dissolve'],
      moderatelySafe: ['Sink'],
      unsafe: [],
      risky: [],
      dangerous: []
  },
  'Broken Appliance': {
      safe: ['Sink'],
      moderatelySafe: [],
      unsafe: ['Abandon'],
      risky: ['Bury'],
      dangerous: ['Dissolve']
  },
  'Building Debris': {
      safe: ['Sink'],
      moderatelySafe: [],
      unsafe: ['Abandon'],
      risky: ['Bury'],
      dangerous: []
  },
  'Dead Body': {
      safe: ['Dissolve'],
      moderatelySafe: [],
      unsafe: [],
      risky: [],
      dangerous: []
  },
  Documents: {
      safe: ['Burn'],
      moderatelySafe: [],
      unsafe: ['Bury'],
      risky: ['Abandon'],
      dangerous: ['Dissolve', 'Sink']
  },
  Firearm: {
      safe: [],
      moderatelySafe: ['Sink'],
      unsafe: ['Bury'],
      risky: [],
      dangerous: ['Dissolve']
  },
  'General Waste': {
      safe: ['Bury'],
      moderatelySafe: ['Burn'],
      unsafe: ['Abandon'],
      risky: ['Sink'],
      dangerous: ['Dissolve']
  },
  'Industrial Waste': {
      safe: ['Sink'],
      moderatelySafe: [],
      unsafe: ['Bury'],
      risky: [],
      dangerous: ['Abandon']
  },
  'Murder Weapon': {
      safe: ['Sink'],
      moderatelySafe: [],
      risky: [],
      unsafe: [],
      dangerous: ['Dissolve']
  },
  'Old Furniture': {
      safe: ['Burn'],
      moderatelySafe: [],
      risky: ['Bury'],
      unsafe: ['Abandon', 'Sink'],
      dangerous: ['Dissolve'],
  },
  Vehicle: {
      safe: ['Sink'],
      moderatelySafe: ['Burn'],
      unsafe: ['Abandon'],
      risky: [],
      dangerous: []
  }
};

/*
const NERVE_COST_BY_METHOD = {
    Abandon: 6,
    Bury: 8,
    Burn: 10,
    Sink: 12,
    Dissolve: 14
};
*/

//
// Based on guide here https://www.torn.com/forums.php#/p=threads&f=61&t=16367936&b=0&a=0
// Thanks Emforus [2535044]!
//

function debug(msg) {
    //console.debug(msg);
}

const PAGE_LOAD_DELAY = 1500;

if (window.location.href.includes('#/disposal')) {
    debug("Disposal - Direct");
    setTimeout(formatPageOnce, PAGE_LOAD_DELAY);
}

function handleCrimesHeaderMutation(mutations) {
    const headerText = mutations[0].target.textContent;
    if (headerText === "Disposal") {
        debug("Disposal - Mutation");
        setTimeout(formatPageOnce, PAGE_LOAD_DELAY);
    }
}

let crimesHeaderTarget = document.querySelector('.crimes-app h4[class^="heading"');
let crimesHeaderObserver = new MutationObserver(handleCrimesHeaderMutation);
crimesHeaderObserver.observe(crimesHeaderTarget, {
    characterData: true,
    attributes: false,
    childList: false,
    subtree: true,
})

function formatPageOnce() {
    console.log("Disposal -- Formatting Jobs");

    var crimeSections = document.querySelectorAll('[class^="sections"]');
    for (const jobRow of crimeSections) {
        var jobName = jobRow.children[1].textContent;

        debug(`Disposal - Formatting ${jobName} job`);

        var disposalMethodsContainer = jobRow.querySelector('[class*="desktopMethodsSection"]');
        if (!disposalMethodsContainer) {
            disposalMethodsContainer = jobRow.querySelector('[class*="methodPicker"]');
            debug("Disposal - Found tablet methods section");
        } else {
            debug("Disposal - Found desktop methods section");
        }

        const methodDifficulties = JOB_METHOD_DIFFICULTIES_MAP[jobName];
        if (methodDifficulties) {
            debug("Disposal - Found job in difficulty map");
            for (const method of methodDifficulties.safe) {
                const node = disposalMethodsContainer.querySelector(`[class*=${method.toLowerCase()}]`);
                if (node) {
                    node.style.border = '2px solid ' + colors.safe;
                }
            }
            for (const method of methodDifficulties.moderatelySafe) {
                const node = disposalMethodsContainer.querySelector(`[class*=${method.toLowerCase()}]`);
                if (node) {
                node.style.border = '2px solid ' + colors.moderatelySafe;
                }
            }
            for (const method of methodDifficulties.unsafe) {
                const node = disposalMethodsContainer.querySelector(`[class*=${method.toLowerCase()}]`);
                if (node) {
                    node.style.border = '2px solid ' + colors.unsafe;
                }
            }
            for (const method of methodDifficulties.risky) {
                const node = disposalMethodsContainer.querySelector(`[class*=${method.toLowerCase()}]`);
                if (node) {
                  node.style.border = '2px solid ' + colors.risky;
                }
            }
            for (const method of methodDifficulties.dangerous) {
                const node = disposalMethodsContainer.querySelector(`[class*=${method.toLowerCase()}]`);
                if (node) {
                  node.style.border = '2px solid ' + colors.dangerous;
                }
            }
        } else {
            console.error(`Disposal - Could not find ${jobName} job in map`);
        }
    }
}
})();