// ==UserScript==
// @name         Skip Delete Repo Verification
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  for github
// @author       You
// @match        https://github.com/*/settings
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411790/Skip%20Delete%20Repo%20Verification.user.js
// @updateURL https://update.greasyfork.org/scripts/411790/Skip%20Delete%20Repo%20Verification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByClassName("btn btn-danger boxed-action")[3].addEventListener("click", function() {
        var repoName = document.querySelector('[aria-label="Delete repository"]').childNodes[5].childNodes[5].childNodes[1].innerText;
        document.querySelector('[aria-label="Type in the name of the repository to confirm that you want to delete this repository."]').value = repoName;
        document.getElementsByClassName("btn btn-block btn-danger")[3].disabled = false;
        document.getElementsByClassName("btn btn-block btn-danger")[3].click();
    });
})();