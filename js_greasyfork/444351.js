// ==UserScript==
// @name        Melvor Idle - Remove mastery pool cap
// @namespace   http://tampermonkey.net/
// @version     0.0.2
// @description Mastery pool no longer caps at 100%
// @author		Xander#8896
// @match		https://*.melvoridle.com/*
// @exclude		https://wiki.melvoridle.com/*
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/444351/Melvor%20Idle%20-%20Remove%20mastery%20pool%20cap.user.js
// @updateURL https://update.greasyfork.org/scripts/444351/Melvor%20Idle%20-%20Remove%20mastery%20pool%20cap.meta.js
// ==/UserScript==


((main) => {
    const script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    setTimeout(() => {
        function patchCode(code, match, replacement) {
            const codeString = code
            .toString()
            .replace(match, replacement)
            .replace(/^function (\w+)/, "window.$1 = function");
            eval(codeString);
        }

        patchCode(
            addMasteryXPToPool,
            'if(MASTERY[skill].pool>getMasteryPoolTotalXP(skill))',
            'if(false)'
        );

        patchCode(
            claimToken,
            'let xpRemaining=totalPoolXP-MASTERY[skill].pool;',
            'let xpRemaining=Infinity;'
        );
        
    }, 100);
});