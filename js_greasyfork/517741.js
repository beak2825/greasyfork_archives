// ==UserScript==
// @name         Pirater For Web
// @namespace    mailto:christopherbbody@gmail.com
// @version      1.1.0
// @description  Transforms all writing on your web browser to pirate speak, courtesy of https://github.com/sayhan1610/pirater api
// @author       Christopher Body
// @match        *://*/*
// @icon         https://uxwing.com/wp-content/themes/uxwing/download/resize.php?size=512x512&file=ship-wheel-icon.png&category_slug=transportation-automotive
// @grant        none
// @license      N/A
// @downloadURL https://update.greasyfork.org/scripts/517741/Pirater%20For%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/517741/Pirater%20For%20Web.meta.js
// ==/UserScript==

/*
    Author: Christopher Body
    Github: https://github.com/cookiemonsternz
    Discord: cookiemonsternz
    Greasyfork: https://greasyfork.org/en/users/1397890-cookiemonsternz
*/

var texts = Array.from(document.getElementsByTagName('p'));

async function translateText(text) {
    // use promise.all to do concurrently
    try {
        const translations = await Promise.all(texts.map(async (elt) => {
            // skip empty text
            if (!elt.innerText.trim()) {
                return null;
            }

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: elt.innerText
                })
            }

            try {
                const res = await fetch('https://pirater-api.onrender.com/translate/', options);
                if(!res.ok) {
                    throw new Error('HTTP error! status: ' + res.status);
                }
                const data = await res.json();
                return {element: elt, translation: data.pirate_translation};
            }
            catch (error) {
                console.error('Error:', error);
                return null;
            }
        }));

        translations.forEach(result => {
            if (result) {
                result.element.innerText = result.translation;
            }
        });
    }
    catch (error) {
        console.error('Error:', error);
    }
}

translateText(texts);