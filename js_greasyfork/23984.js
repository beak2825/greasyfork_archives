// ==UserScript==
// @name         Link File to InteliJ IDE From Github
// @namespace    https://gist.github.com/raveren/c213f683abe9635a2cf2c4486856ab9e
// @version      0.4
// @description  Adds a monitor icon next to file name, click it to open your Intelij Ide (Remote Call plugin required)
// @author       raveren
// @match        https://github.com/*/files*
// @match        https://github.com/*/pull*
// @require      https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @require      https://code.jquery.com/jquery-3.1.0.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23984/Link%20File%20to%20InteliJ%20IDE%20From%20Github.user.js
// @updateURL https://update.greasyfork.org/scripts/23984/Link%20File%20to%20InteliJ%20IDE%20From%20Github.meta.js
// ==/UserScript==


(function () {
    waitForKeyElements('.file-info',
        function (el) {
            if (el.children('.user-select-contain').length > 0) {
                addLink(el.children('.user-select-contain'))
            } else {
                addLink(el)
            }
        });

    function addLink(el) {
        var a = document.createElement('span'),
            link = 'http://localhost:8091?message=' + el.html().trim();

        a.innerHTML = '<a class="btn-octicon" href="' + link + '"><svg class="octicon octicon-device-desktop" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M15 2H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h5.34c-.25.61-.86 1.39-2.34 2h8c-1.48-.61-2.09-1.39-2.34-2H15c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm0 9H1V3h14v8z"></path></svg></a>';

        el.before(a);
    }
})();