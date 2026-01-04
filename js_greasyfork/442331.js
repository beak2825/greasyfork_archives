// ==UserScript==
// @name         Clone site skin
// @namespace    https://github.com/windupbird144/
// @version      0.1
// @description  Create a site skin by cloning the skin you currently use. Lets you edit things because it's your own. You also won't get updates from the original skin.
// @author       windupbird144
// @match        https://pokefarm.com/skin/edit
// @grant        none
// @license      unlicense
// @downloadURL https://update.greasyfork.org/scripts/442331/Clone%20site%20skin.user.js
// @updateURL https://update.greasyfork.org/scripts/442331/Clone%20site%20skin.meta.js
// ==/UserScript==

(function () {
    'use strict';

    async function cloneCurrentSkin() {

        // Your code here...
        function getResourcePaths(pathToCss) {
            let base = pathToCss.match(/(\/skins\/user\/.+?)index\/sally.css/i);
            if (!base) {
                throw new Error('Invalid skin location ' + pathToCss)
            }
            base = base[1]
            let rv = {
                'colours': `${base}__colours.less`,
                'extra': `${base}__extra.less`
            }
            return rv
        }

        async function getText(location) {
            let res = await fetch(location)
            if (res.status >= 400) {
                throw new Error(`Could not fetch ${location}`)
            }
            return await res.text()
        }

        function processColorsFile(colorsLess) {
            const rv = {}
            const keyValueRegex = /^@(.+?):\s+(.+?);$/m
            colorsLess.split('\n')
                .map(line => line.match(keyValueRegex))
                .filter(id => id)
                .filter(groups => !groups[2].includes('@')) //drop if links set automatically with reference
                .map(matchrv => [matchrv[1], matchrv[2]]) //map to captures
                .map(function (group) {
                    let key = group[0].replace(/-/g, '_')
                    let value = group[1]
                    if (key === 'global_bg') {
                        value = value.replace(/^url\(['"]/,"").replace(/['"]\)/,"")
                    }
                    return {
                        [key]: value
                    }
                }).forEach(obj => Object.assign(rv, obj))
            return rv
        }

        let paths = getResourcePaths(document.styleSheets[0].href)
        let inputs = Array.from(document.querySelectorAll('#skineditorform input[name]'))
        //Write resource paths into names
        let declarations = processColorsFile(await getText(paths.colours))
        for (let key of Object.keys(declarations)) {
            //find proper input field
            let input = inputs.find(inp => inp.name === key)
            if (!input) {
                continue;
            }
            //write value
            input.value = declarations[key]
            //trigger preview update
            input.dispatchEvent(new Event('keyup', { bubbles: true }))
        }
        //Write extra css
        let extraCssInput = document.querySelector('textarea[name="extracss"]')
        extraCssInput.value = await getText(paths.extra)
    }

    const btn = document.createElement("button")
    btn.onclick = cloneCurrentSkin
    btn.textContent = "Clone current skin"
    btn.style = 'margin-right: 1em;'
    document.querySelector("#skineditorform").insertAdjacentElement('afterbegin', btn)
})();