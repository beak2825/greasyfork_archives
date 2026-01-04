// ==UserScript==
// @name        Melvor Completion Log Helper
// @namespace   http://tampermonkey.net/
// @version     0.7.1
// @description The completion logs now show images of undiscovered items/monsters/pets, including those entities that do not count towards completion.
// @author		GMiclotte
// @include		https://melvoridle.com/*
// @include		https://*.melvoridle.com/*
// @exclude		https://melvoridle.com/index.php
// @exclude		https://*.melvoridle.com/index.php
// @exclude		https://wiki.melvoridle.com/*
// @exclude		https://*.wiki.melvoridle.com/*
// @inject-into page
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/405082/Melvor%20Completion%20Log%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/405082/Melvor%20Completion%20Log%20Helper.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

// Thanks to Breindahl#2660 for the original implementation
// Big thanks to Visua#9999 for helping with parts of the code and troubleshooting

((main) => {
    const script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {

    function patchCode(code, additionalPatch) {
        code = code.toString();
        code = code.replace(/!items\[[a-zA-Z]*\].ignoreCompletion/g, 'true');
        code = code.replace(/!MONSTERS\[[a-zA-Z]*\].ignoreCompletion/g, 'true');
        code = code.replace(/!PETS\[[a-zA-Z]*\].ignoreCompletion/g, 'true');
        if (additionalPatch !== undefined) {
            code = additionalPatch(code);
        }
        return code.replace(/^function (\w+)/, 'window.$1 = function');
    }

    const toPatch = [
        filterItemLog,
        createItemLogTooltip,
        createMonsterLogTooltip,
        createPetLogTooltip,
    ];

    function additionalPatchApplyCompletionLogEntryElement(code) {
        code = code.split(/Element\(-8,/);
        for (let i = 1; i < code.length; i++) {
            code[i] = code[i].replace(';', `; const htmlIdx = html.lastIndexOf('<img ') + 5; html = html.substring(0, htmlIdx) + 'style="opacity: 25%"' + html.substring(htmlIdx); `);
        }
        return code.join('Element(id,');
    }

    function startCompletionLogHelper() {
        // patch functions
        toPatch.forEach(x => eval(patchCode(x)));
        eval(patchCode(applyCompletionLogEntryElement, additionalPatchApplyCompletionLogEntryElement));

        // reset loaded variables
        itemLogLoaded = false;
        monsterLogLoaded = false;
        petLogLoaded = false;

        // build Monster and pet logs
        buildMonsterLog();
        buildPetLog();

        // logging
        console.log('Melvor Completion Log Helper Loaded');
    }

    function loadScript() {
        if (typeof confirmedLoaded !== typeof undefined && confirmedLoaded) {
            clearInterval(scriptLoader);
            startCompletionLogHelper();
        }
    }

    const scriptLoader = setInterval(loadScript, 200);
});
