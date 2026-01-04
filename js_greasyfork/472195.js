// ==UserScript==
// @name         OldGoogleIsBetter
// @namespace    google
// @version      0.1
// @description  Old google results is better
// @author       PINHOf
// @license      MIT
// @supportURL   https://github.com/PINHOf/OldGoogleIsBetter
// @match        https://*.google.com/search?*
// @include      /^https?://(?:www|encrypted|ipv[46])\.google\.[^/]+/(?:$|[#?]|search|webhp)/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/472195/OldGoogleIsBetter.user.js
// @updateURL https://update.greasyfork.org/scripts/472195/OldGoogleIsBetter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var prevResultCount = 0;
    var bettered = false;

    checkElementThenRun('#rcnt', run);

    // Loops through all the results rows & watches for changes in the main div
    // Function extracted from https://github.com/aligo/better-google
    function run()
    {
        if (prevResultCount != document.querySelectorAll('.MjjYud').length)
        {
            document.querySelectorAll('.MjjYud').forEach(row);
            prevResultCount = document.querySelectorAll('.MjjYud').length;
        }

        if (!bettered)
        {
            if (MutationObserver != undefined)
            {
                var searchEl = document.getElementById('rcnt');
                var observer = new MutationObserver(run);
                observer.observe(searchEl, {childList: true, subtree: true});
            }

            bettered = true;
        }
    }

    // Checks if certain element exists and runs the function associated
    // Function extracted from https://github.com/aligo/better-google
    function checkElementThenRun(selector, func)
    {
        var el = document.querySelector(selector);

        if (el != null)
        {
            func();
            return;
        }

        if (window.requestAnimationFrame != undefined)
            window.requestAnimationFrame(function(){ checkElementThenRun(selector, func)});
        else
        {
            document.addEventListener('readystatechange', function(e)
            {
                if (document.readyState == 'complete')
                    func();
            });
        }
    }

    // Formats the row / result to the old style
    function row(el)
    {
        const url = getUrl(el);

        removeHeaderInformation(el);
        removeUnnecessaryLineBreak(el);
        adjustTitleMargin(el);
        appendUrlAfterTitle(el, url);
    }

    // Extracts the URL from the <a href> result
    function getUrl(el)
    {
        const linkEl = el.querySelector('a');
        const url = linkEl ? linkEl.getAttribute('href') : '';

        return url;
    }

    // Removes the header information (icon; url; three dots; etc)
    function removeHeaderInformation(el)
    {
        el.querySelectorAll('.TbwUpd').forEach((elem) => elem.remove());
        el.querySelectorAll('.B6fmyf').forEach((elem) => elem.remove());
    }

    // Removes extra <br> tags
    function removeUnnecessaryLineBreak(el)
    {
        const link = el.querySelector('a');

        if (link)
            link.querySelectorAll('br').forEach((elem) => elem.remove());
    }

    // Adjusts the title margin top (after the header information has been removed from DOM)
    function adjustTitleMargin(el)
    {
        const titleEl = el.querySelector('.LC20lb');

        if (titleEl)
            titleEl.style.marginTop = '0px';
    }

    // Appends the URL after the title in a green color
    function appendUrlAfterTitle(el, url)
    {
        const titleParentEl = el.querySelector('.yuRUbf');
        const newEl = document.createElement('a');
        newEl.setAttribute('href', url);
        newEl.innerHTML = url;
        newEl.style.color = '#006621';
        newEl.style.fontSize = '15px';
        newEl.style.display = 'block';

        if (titleParentEl)
        {
            const parent = titleParentEl.parentElement;
            const totalLinks = parent.querySelectorAll('a').length;

           if (totalLinks == 1)
               titleParentEl.after(newEl);
        }
    }
})();