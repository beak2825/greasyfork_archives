// ==UserScript==
// @name         GC Double Or Nothing Keyboard Controls
// @namespace    https://greasyfork.org/en/users/1175371
// @version      0.3
// @description  Adds keyboard controls to GC's Double Or Nothing
// @author       sanjix
// @match        https://www.grundos.cafe/medieval/doubleornothing/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489923/GC%20Double%20Or%20Nothing%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/489923/GC%20Double%20Or%20Nothing%20Keyboard%20Controls.meta.js
// ==/UserScript==

var coin = document.querySelector('form#playagain, form.input[alt="Click to toss the coin"]');
var collect = document.querySelector('button.form-control[type="submit"]');

document.addEventListener('keydown', (event) => {
        if (event.keyCode == '13') {
            coin.submit();
        }
        if (event.keyCode == '87') {
            collect.click();
        }
});