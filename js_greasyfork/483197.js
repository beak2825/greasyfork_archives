// ==UserScript==
// @name         Quipqiup Show Key
// @namespace    http://tampermonkey.net/
// @version      2023-12-27
// @description  Show the substitution alphabet used for a specific solution in Quipqiup
// @author       Corgo
// @match        https://quipqiup.com/
// @grant        none
// @license      @MIT
// @downloadURL https://update.greasyfork.org/scripts/483197/Quipqiup%20Show%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/483197/Quipqiup%20Show%20Key.meta.js
// ==/UserScript==


(function() {
    'use strict';

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('soltable_plaintext')) {
            const blah = showKey(event.target.innerText);

            const key = document.createElement('div');
            key.innerHTML = blah+'    '; // random unicode space or else it gets stripped by HTML :^)

            key.style.position = 'fixed'; // change div attributes to look nicer
            key.style.top = (event.clientY + 5) + 'px';
            key.style.left = (event.clientX + 5) + 'px';
            key.style.backgroundColor = '#ffffff';
            key.style.padding = '5px';

            key.style.border = 'solid 2px #666666'; // thanks @codewarrior0
            key.style['font-family'] = 'monospace';

            const closeButton = document.createElement('span'); // add button to close key
            closeButton.textContent = '[x]';
            closeButton.style.cursor = 'pointer';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '5px';
            closeButton.style.right = '5px';

            closeButton.addEventListener('click', function() { // add functionality to close button
                key.remove();
            });

            key.appendChild(closeButton);
            document.body.appendChild(key);
        }
    });

    const og_on_solve = on_solve_button; // saving original quipqiup on_solve_button function

    on_solve_button = function(args) { // hooking into quipqiup's on_solve_button
        const ciphertext = document.getElementById("ciphertext").value.trim(); // grab ciphertext from text box
        localStorage.setItem('ciphertext', ciphertext); // saving ciphertext (as we can't trust the textbox to not change)
        og_on_solve(args); // calling original on_solve_button
    };

    function showKey(plaintext) {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const ciphertext = localStorage.getItem('ciphertext');
        const uniqct = String.prototype.concat.call(...new Set(ciphertext.toUpperCase().replace(/[^A-Z]/g, ''))); // get all unique characters in ciphertext
        const uniqpt = String.prototype.concat.call(...new Set(plaintext.toUpperCase().replace(/[^A-Z]/g, ''))); // get all unique characters in plaintext
        let key1 = Array(26).fill("_")
        let key2 = Array(26).fill("_")

        for (var i = 0; i < uniqpt.length; i++) { // create substitution key 1 ([substitutionkey] -> ABCD...)
            key1[alphabet.indexOf(uniqpt[i])] = uniqct[i];
        }
        for (var j = 0; j < uniqct.length; j++) { // create substitution key 2 (ABCD... -> [substitutionkey])
            key2[alphabet.indexOf(uniqct[j])] = uniqpt[j];
        }

        key1 = key1.join('');
        key2 = key2.join('');

        return alphabet + "   |   " + key2 + "<br>" + key1 + "   |   " + alphabet // return alphabet and key to compare (again thanks @codewarrior0)
    }
})();