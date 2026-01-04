// ==UserScript==
// @name         GitHub Octotree single file view button
// @namespace    https://puac.de/
// @version      0.1.0
// @description  Adds a button to GitHub pull requests that activates a single file view for Octotree.
// @author       Hans Puac
// @match        https://github.com/*/pull/*/files
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/376633/GitHub%20Octotree%20single%20file%20view%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/376633/GitHub%20Octotree%20single%20file%20view%20button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var activateSingleFileView = function () {
        document.querySelector('.jstree-container-ul').addEventListener('click', function (e) {
            if (e.target.matches('.jstree-anchor')) {
                var id = e.target.href.split('#')[1];
                document.querySelectorAll('.js-file').forEach(function (item) {
                    if (item.id === id) {
                        item.classList.add('open', 'Details--on');
                    } else {
                        item.classList.remove('open', 'Details--on');
                    }
                });
            }
        });
    };

    var activateButton = document.createElement('button');
    activateButton.innerText = 'Octotree single file view';
    activateButton.classList.add('btn', 'btn-sm');
    activateButton.style.float = 'left';
    activateButton.style.marginRight = '20px';
    activateButton.addEventListener(
        'click',
        function () {
            activateButton.remove();
            activateSingleFileView();
        },
        false
    );

    var buttonWrapper = document.querySelector('.pr-review-tools');
    if (buttonWrapper === null) {
        buttonWrapper = document.querySelector('.js-details-container .BtnGroup');
    }
    buttonWrapper.prepend(activateButton);
})();
