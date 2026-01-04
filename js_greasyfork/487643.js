// ==UserScript==
// @name         Disable Job Perks
// @namespace    microbes.torn.jobdisabler
// @version      0.1
// @description  Disable job perks to not mindlessly waste job points
// @author       Microbes
// @match        https://www.torn.com/companies.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487643/Disable%20Job%20Perks.user.js
// @updateURL https://update.greasyfork.org/scripts/487643/Disable%20Job%20Perks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selector = 'form[action="companies.php?step=specialuse"] .minus-icon'
    let removed = Array.from({ length: 5 }, (_, index) => localStorage.getItem(`jobdisabled_${index}`) == 'true' || false);
    console.log(removed);

    waitForElementToExist(selector).then(() => {
        $(selector).each(function(index) {
            if (!removed[index])
                $(this).parent().append("<p class='remove-perks' data-rp-id='" + index + "'>[Remove Perks]</p>");
            else {
                $(this).parent().parent().parent().remove();
            }
        });

        $('.remove-perks').click(function() {
            localStorage.setItem(`jobdisabled_${$(this).data('rp-id')}`, true);
            $(this).parent().parent().parent().remove();
        });
    });

    waitForElementToExist(selector).then(() => {
        $('.specials-cont-wrap').prev().append("<span class='reset-perks'>[Reset Perks]</span>");

        $('.reset-perks').click(() => {
            localStorage.setItem("jobdisabled_0", false);
            localStorage.setItem("jobdisabled_1", false);
            localStorage.setItem("jobdisabled_2", false);
            localStorage.setItem("jobdisabled_3", false);
            localStorage.setItem("jobdisabled_4", false);
            location.reload();
        });
    })

    function GM_addStyle(css) {
		const style = document.getElementById("GM_addStyleBy8626") || (function() {
			const style = document.createElement('style');
			style.type = 'text/css';
			style.id = "GM_addStyleBy8626";
			document.head.appendChild(style);
			return style;
		})();
		const sheet = style.sheet;
		sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
	}

	GM_addStyle(".remove-perks, .reset-perks { color: var(--default-blue-color); }");
    GM_addStyle(".remove-perks:hover, .reset-perks:hover { color: red; cursor: pointer; }");
})();

function waitForElementToExist(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
        });
    });
}