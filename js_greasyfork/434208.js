// ==UserScript==
// @name         Hide distracting information on Bunpro
// @namespace    http://bunpro.jp/
// @version      0.1
// @description  No distractions!
// @author       Megumin
// @match        https://bunpro.jp/study
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434208/Hide%20distracting%20information%20on%20Bunpro.user.js
// @updateURL https://update.greasyfork.org/scripts/434208/Hide%20distracting%20information%20on%20Bunpro.meta.js
// ==/UserScript==


document.getElementsByClassName('srs-tracker--hanko')[0].remove()
document.getElementsByClassName('srs-tracker')[0].remove()
document.getElementsByClassName('review-percent')[0].remove()
document.getElementsByClassName('review-percent--checkmark')[0].remove()
document.getElementsByClassName('ghost-reviews')[0].remove()
document.getElementsByClassName('review-count-tracking')[0].remove()


;