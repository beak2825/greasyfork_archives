// ==UserScript==
// @name         legacy_workdiary
// @namespace    https://gist.github.com/santaklouse/b29acab90b87140a0de7b6fd90af38a9
// @version      0.3.1
// @description  TamperMonkey Script that enables legacy Upwork workdiary page
// @author       Alex N (santaklouse)
// @license      0BSD
// @copyright    2022, santaklouse (https://openuserjs.org/users/santaklouse) (https://gist.github.com/santaklouse/)
// @homepage     https://gist.github.com/santaklouse/b29acab90b87140a0de7b6fd90af38a9
// @source       https://gist.github.com/santaklouse/b29acab90b87140a0de7b6fd90af38a9
// @match        *workdiary*
// @include      /^https?://www\.upwork\.com/.*$/
// @run-at       document-start
// @icon         data:image/png;base64,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
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/439333/legacy_workdiary.user.js
// @updateURL https://update.greasyfork.org/scripts/439333/legacy_workdiary.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author santaklouse
// ==/OpenUserJS==

window.setTimeout(() => {
    'use strict';

    if (!window.location.toString().includes('workdiary')) {
        return;
    }

    let d0ne = false;

    let i = 0;
    const doIt = () => {
        if (d0ne || ++i > 5000) {
            return;
        }

        if (!window.Applet) {
            return setTimeout(doIt, 50);
        }

        let AppletFunctionBody = String(window.Applet.constructor.toString());

        if (AppletFunctionBody.includes('"RF7434WorkdiaryNuxtFreelancer":true')) {
            console.info('legacy_workdiary: try to inject ff');
            const theInstructions = 'new ' + AppletFunctionBody.replace('"RF7434WorkdiaryNuxtFreelancer":true', '"RF7434WorkdiaryNuxtFreelancer":false');

            // eslint-disable-next-line no-use-before-define
            window.Applet = eval(theInstructions);
            window.Applet = (new Function (`return ${theInstructions}`))();
        }

        d0ne = true;
    }
    doIt();
})();
