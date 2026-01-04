// ==UserScript==
// @name         XXL-Job enhancer
// @namespace    http://tampermonkey.net/
// @version      2024-11-19
// @description  xxl-job enhancer
// @author       You
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none

// @match        *://**/*xxljob*/jobinfo*
// @match        *://**/*xxl-job*/jobinfo*

// @match        *://**/*xxljob*/joblog*
// @match        *://**/*xxl-job*/joblog*

// @downloadURL https://update.greasyfork.org/scripts/517966/XXL-Job%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/517966/XXL-Job%20enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const JOB_GROUP = 'jobGroup'

    const pathname =window.location.pathname.split('/').pop()
    const queries = new URLSearchParams(window.location.search);
    const gid = queries.get(JOB_GROUP)
    if (gid) {
        window.localStorage.setItem(JOB_GROUP, gid)

        document.querySelectorAll('aside > section > ul > li.nav-click > a').forEach(e => {
            const href = e.getAttribute('href')
            if (href && (href.endsWith('jobinfo') || href.endsWith('joblog'))) {
                e.setAttribute('href', href + '?' + queries.toString())
            }
        })
    } else {
        const g = window.localStorage.getItem(JOB_GROUP)
        if (g) {
            queries.set(JOB_GROUP, g)
            window.location.search = '?' + queries.toString()
        }
    }

    // replace operation button
    if ($) {
        $(document).on('ajaxSuccess', function() {
            document.querySelectorAll('table.table > tbody > tr > td:last-child > div').forEach((e) => {
                const b1 = e.querySelector(':first-child');
                if (b1) { b1.remove() }

                const b2 = e.querySelector(':first-child');
                if (b2) { b2.prepend(document.createTextNode('操作')) }
            })
        })
    }

    if (pathname === 'joblog') {
        const select = document.querySelector('#jobGroup')
        if (gid) {
            const g = select.querySelector('option[value="' + gid + '"]')
            if (g) { g.selected = 'selected' }

            document.querySelector('#searchBtn').click()
        }

        if (select) {
            select.addEventListener('change', () => {
                if (select.value) {
                    queries.set(JOB_GROUP, select.value)
                    window.location.search = '?' + queries.toString()
                }
            })
        }
    }

})();
