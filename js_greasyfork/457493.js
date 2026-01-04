// ==UserScript==//
// @name           Replace image
// @match          https://catwar.su/cw3/
// @run-at         document-start
// @description   SOLVE YOUR SECRETS ALREADY.
// @require        https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @license        MIT; https://opensource.org/licenses/MIT
// @ author        1386915
// @version 0.0.1.20220602052347
// @namespace https://greasyfork.org/users/921127
// @downloadURL https://update.greasyfork.org/scripts/457493/Replace%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/457493/Replace%20image.meta.js
// ==/UserScript==
 
setMutationHandler({
    processExisting: true,
    selector: 'img[src*="odoroj/150.png"]',
    handler: images => images.forEach(img => {
        img.src = 'http://d.zaix.ru/x8ic.png';
    })
});