// ==UserScript==
// @name         GitHub Tab Length
// @namespace    https://gist.github.com/onlined
// @version      1.2.1
// @description  Userscript setting GitHub tab length to 4
// @author       Ekin Dursun
// @match        https://*.github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35678/GitHub%20Tab%20Length.user.js
// @updateURL https://update.greasyfork.org/scripts/35678/GitHub%20Tab%20Length.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var menu = `<div class="select-menu branch-select-menu js-menu-container js-select-menu" style="display: inline-block;margin-right: 6px;">
    <button class="btn btn-sm select-menu-button js-menu-target css-truncate" data-hotkey="w" type="button" aria-label="Switch branches or tags" tabindex="0" aria-haspopup="true" aria-expanded="false">

        <span class="js-select-button css-truncate-target">Tab length</span>
    </button>

    <div class="select-menu-modal-holder js-menu-content js-navigation-container js-active-navigation-container" data-pjax="" aria-hidden="true" aria-expanded="false">

        <div class="select-menu-modal">

            <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket selected" role="menu">

                <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">

                    <a class="select-menu-item js-navigation-item js-navigation-open" data-length="2" data-skip-pjax="true" rel="nofollow">
                        <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12">
                            <path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path>
                        </svg>
                        <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">2</span>
                    </a>
                    <a class="select-menu-item js-navigation-item js-navigation-open selected" data-length="4" data-skip-pjax="true" rel="nofollow">
                        <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12">
                            <path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path>
                        </svg>
                        <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">4</span>
                    </a>
                    <a class="select-menu-item js-navigation-item js-navigation-open" data-length="8" data-skip-pjax="true" rel="nofollow">
                        <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12">
                            <path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path>
                        </svg>
                        <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">8</span>
                    </a>
                </div>

            </div>

        </div>
    </div>
</div>`;
    var setTabLength = function(length) {
        document.querySelectorAll('.tab-size[data-tab-size]').forEach(function(element) {
            element.setAttribute('data-tab-size', length);    
        });
    };
    setTabLength('4');
    document.querySelector('.file-actions').insertAdjacentHTML('afterbegin', menu);
    document.querySelectorAll('a.select-menu-item[data-length]').forEach(function(element) {
        element.addEventListener('click', function() {
            setTabLength(this.getAttribute('data-length'));
        });
    });
})();