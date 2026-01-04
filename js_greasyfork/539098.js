// ==UserScript==
// @name         PPSC Open Job in New Tab (With Toggle)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Open PPSC job listings in a new tab automatically, with a toggle to enable/disable the feature.
// @author       Hamza Haroon
// @match        https://www.ppsc.gop.pk/*/Jobs.aspx*
// @grant        none
// @run-at       window-load
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539098/PPSC%20Open%20Job%20in%20New%20Tab%20%28With%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539098/PPSC%20Open%20Job%20in%20New%20Tab%20%28With%20Toggle%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'ppscJobOpenerEnabled';

    function isEnabled() {
    if (localStorage.getItem(STORAGE_KEY) === null) {
        setEnabled(true); // First run: enable by default
        return true;
    }
    return localStorage.getItem(STORAGE_KEY) === 'true';
}

    function setEnabled(value) {
        localStorage.setItem(STORAGE_KEY, value.toString());
    }

    function createToggleButton() {
        const btn = document.createElement('button');
        btn.id = 'ppsc-job-toggle';
        btn.textContent = isEnabled() ? '🔓 Job Opener: ON' : '🔒 Job Opener: OFF';
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = '9999';
        btn.style.padding = '10px 15px';
        btn.style.backgroundColor = isEnabled() ? '#28a745' : '#dc3545';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        btn.style.fontSize = '14px';

        btn.addEventListener('click', () => {
            const newState = !isEnabled();
            setEnabled(newState);
            btn.textContent = newState ? '🔓 Job Opener: ON' : '🔒 Job Opener: OFF';
            btn.style.backgroundColor = newState ? '#28a745' : '#dc3545';
        });

        document.body.appendChild(btn);
    }

    window.addEventListener('load', function () {
        createToggleButton();

        const jobLinks = document.querySelectorAll("a[href^=\"javascript:__doPostBack\"]");

        jobLinks.forEach(link => {
            if (link.dataset.listenerAttached === "true") return;
            link.dataset.listenerAttached = "true";

            const onclickText = link.getAttribute("href");
            const matches = onclickText.match(/__doPostBack\('([^']*)','([^']*)'\)/);
            if (!matches) return;

            const eventTarget = matches[1];
            const eventArgument = matches[2];

            link.addEventListener("click", function (e) {
                if (!isEnabled()) {
                    return; // Do nothing, let default ASP.NET postback occur
                }

                e.preventDefault();

                const viewstate = document.querySelector('input[name="__VIEWSTATE"]');
                const viewstategenerator = document.querySelector('input[name="__VIEWSTATEGENERATOR"]');
                const eventvalidation = document.querySelector('input[name="__EVENTVALIDATION"]');

                if (!viewstate || !eventvalidation) {
                    console.warn("Required ASP.NET hidden fields are missing.");
                    return;
                }

                const form = document.createElement('form');
                form.method = 'POST';
                form.target = '_blank'; // Open in new tab
                form.action = window.location.href;

                const hiddenFields = [
                    { name: '__EVENTTARGET', value: eventTarget },
                    { name: '__EVENTARGUMENT', value: eventArgument },
                    { name: '__VIEWSTATE', value: viewstate.value },
                    { name: '__VIEWSTATEGENERATOR', value: viewstategenerator ? viewstategenerator.value : '' },
                    { name: '__EVENTVALIDATION', value: eventvalidation.value }
                ];

                hiddenFields.forEach(({ name, value }) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = name;
                    input.value = value;
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit();
                document.body.removeChild(form);
            });
        });
    });
})();
