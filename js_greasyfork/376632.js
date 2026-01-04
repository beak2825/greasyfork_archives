// ==UserScript==
// @name         GitHub expand files button
// @namespace    https://puac.de/
// @version      0.1.1
// @description  Adds a button to expand all files in a GitHub pull request or commit view.
// @author       Hans Puac
// @match        https://github.com/*/pull/*/files
// @match        https://github.com/*/commit/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/376632/GitHub%20expand%20files%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/376632/GitHub%20expand%20files%20button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var expanding = false;
    var expandButton = document.createElement('button');

    var btnClicked = function () {
        if (!expanding) {
            expanding = true;
            expandAllFiles();
        }
    };

    var expandAllFiles = function () {
        expandButton.innerText = 'Expanding files ...';
        expandButton.classList.add('btn-outline', 'bg-gray-light', 'text-gray-light');
        expandButton.setAttribute('disabled', true);

        var expand = function () {
            var anchors = document.querySelectorAll('.js-expand');
            var len = anchors.length;
            if (len < 1) {
                expandButton.innerText = 'All Files expanded';

                return;
            }

            anchors.forEach(function (item) {
                item.click();
            });

            setTimeout(function () {
                expand();
            }, 1000);
        };
        expand();
    };

    expandButton.innerText = 'Expand all files';
    expandButton.classList.add('btn', 'btn-sm');
    expandButton.style.float = 'left';
    expandButton.style.marginRight = '20px';
    expandButton.addEventListener('click', btnClicked, false);

    var btnWrapper = document.querySelector('.pr-review-tools');
    if (btnWrapper === null) {
        btnWrapper = document.querySelector('.js-details-container .BtnGroup');
    }
    btnWrapper.prepend(expandButton);
})();
