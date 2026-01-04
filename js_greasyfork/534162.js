// ==UserScript==
// @name         DeepWiki
// @namespace    https://github.com/AmintaCCCP/
// @version      1.0
// @description  Add a button to open the corresponding wiki page on DeepWiki
// @author       tamina
// @match        https://github.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMzMuMzQiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjUgMjQiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTEyLjMwMSAwaC4wOTNjMi4yNDIgMCA0LjM0LjYxMyA2LjEzNyAxLjY4bC0uMDU1LS4wMzFhMTIuMzUgMTIuMzUgMCAwIDEgNC40NDkgNC40MjJsLjAzMS4wNThhMTIuMiAxMi4yIDAgMCAxIDEuNjU0IDYuMTY2YzAgNS40MDYtMy40ODMgMTAtOC4zMjcgMTEuNjU4bC0uMDg3LjAyNmEuNzIuNzIgMCAwIDEtLjY0Mi0uMTEzbC4wMDIuMDAxYS42Mi42MiAwIDAgMS0uMjA4LS40NjZ2LS4wMTR2LjAwMWwuMDA4LTEuMjI2cS4wMDgtMS4xNzguMDA4LTIuMTU0YTIuODQgMi44NCAwIDAgMC0uODMzLTIuMjc0YTExIDExIDAgMCAwIDEuNzE4LS4zMDVsLS4wNzYuMDE3YTYuNSA2LjUgMCAwIDAgMS41MzctLjY0MmwtLjAzMS4wMTdhNC41IDQuNSAwIDAgMCAxLjI5Mi0xLjA1OGwuMDA2LS4wMDdhNC45IDQuOSAwIDAgMCAuODQtMS42NDVsLjAwOS0uMDM1YTcuOSA3LjkgMCAwIDAgLjMyOS0yLjI4MWwtLjAwMS0uMTM2di4wMDdsLjAwMS0uMDcyYTQuNzMgNC43MyAwIDAgMC0xLjI2OS0zLjIzbC4wMDMuMDAzYy4xNjgtLjQ0LjI2NS0uOTQ4LjI2NS0xLjQ3OWE0LjI1IDQuMjUgMCAwIDAtLjQwNC0xLjgxNGwuMDExLjAyNmEyLjEgMi4xIDAgMCAwLTEuMzEuMTgxbC4wMTItLjAwNWE4LjYgOC42IDAgMCAwLTEuNTEyLjcyNmwuMDM4LS4wMjJsLS42MDkuMzg0Yy0uOTIyLS4yNjQtMS45ODEtLjQxNi0zLjA3NS0uNDE2cy0yLjE1My4xNTItMy4xNTcuNDM2bC4wODEtLjAycS0uMjU2LS4xNzYtLjY4MS0uNDMzYTkgOSAwIDAgMC0xLjI3Mi0uNTk1bC0uMDY2LS4wMjJBMi4xNyAyLjE3IDAgMCAwIDUuODM3IDUuMWwuMDEzLS4wMDJhNC4yIDQuMiAwIDAgMC0uMzkzIDEuNzg4YzAgLjUzMS4wOTcgMS4wNC4yNzUgMS41MDlsLS4wMS0uMDI5YTQuNzIgNC43MiAwIDAgMC0xLjI2NSAzLjMwM3YtLjAwNGwtLjAwMS4xM2MwIC44MDkuMTIgMS41OTEuMzQ0IDIuMzI3bC0uMDE1LS4wNTdjLjE4OS42NDMuNDc2IDEuMjAyLjg1IDEuNjkzbC0uMDA5LS4wMTNhNC40IDQuNCAwIDAgMCAxLjI2NyAxLjA2MmwuMDIyLjAxMWMuNDMyLjI1Mi45MzMuNDY1IDEuNDYuNjE0bC4wNDYuMDExYy40NjYuMTI1IDEuMDI0LjIyNyAxLjU5NS4yODRsLjA0Ni4wMDRjLS40MzEuNDI4LS43MTggMS0uNzg0IDEuNjM4bC0uMDAxLjAxMmEzIDMgMCAwIDEtLjY5OS4yMzZsLS4wMjEuMDA0Yy0uMjU2LjA1MS0uNTQ5LjA4LS44NS4wOGgtLjA2NmguMDAzYTEuOSAxLjkgMCAwIDEtMS4wNTUtLjM0OGwuMDA2LjAwNGEyLjg0IDIuODQgMCAwIDEtLjg4MS0uOTg2bC0uMDA3LS4wMTVhMi42IDIuNiAwIDAgMC0uNzY4LS44MjdsLS4wMDktLjAwNmEyLjMgMi4zIDAgMCAwLS43NzYtLjM4bC0uMDE2LS4wMDRsLS4zMi0uMDQ4YTEuMDUgMS4wNSAwIDAgMC0uNDcxLjA3NGwuMDA3LS4wMDNxLS4xMjguMDcyLS4wOC4xODRxLjA1OC4xMjguMTQ1LjIyNWwtLjAwMS0uMDAxcS4wOTIuMTA4LjIwNS4xOWwuMDAzLjAwMmwuMTEyLjA4Yy4yODMuMTQ4LjUxNi4zNTQuNjkzLjYwM2wuMDA0LjAwNmMuMTkxLjIzNy4zNTkuNTA1LjQ5NC43OTJsLjAxLjAyNGwuMTYuMzY4Yy4xMzUuNDAyLjM4LjczOC43Ljk4MWwuMDA1LjAwNGMuMy4yMzQuNjYyLjQwMiAxLjA1Ny40NzhsLjAxNi4wMDJjLjMzLjA2NC43MTQuMTA0IDEuMTA2LjExMmguMDA3cS4wNjkuMDAyLjE1LjAwMnEuMzkyIDAgLjc2Ny0uMDYybC0uMDI3LjAwNGwuMzY4LS4wNjRxMCAuNjA5LjAwOCAxLjQxOHQuMDA4Ljg3M3YuMDE0YzAgLjE4NS0uMDguMzUxLS4yMDguNDY2aC0uMDAxYS43Mi43MiAwIDAgMS0uNjQ1LjExMWwuMDA1LjAwMUMzLjQ4NiAyMi4yODYuMDA2IDE3LjY5Mi4wMDYgMTIuMjg1YzAtMi4yNjguNjEyLTQuMzkzIDEuNjgxLTYuMjE5bC0uMDMyLjA1OGExMi4zNSAxMi4zNSAwIDAgMSA0LjQyMi00LjQ0OWwuMDU4LS4wMzFhMTEuOSAxMS45IDAgMCAxIDYuMDczLTEuNjQ1aC4wOThoLS4wMDV6bS03LjY0IDE3LjY2NnEuMDQ4LS4xMTItLjExMi0uMTkycS0uMTYtLjA0OC0uMjA4LjAzMnEtLjA0OC4xMTIuMTEyLjE5MnEuMTQ0LjA5Ni4yMDgtLjAzMm0uNDk3LjU0NXEuMTEyLS4wOC0uMDMyLS4yNTZxLS4xNi0uMTQ0LS4yNTYtLjA0OHEtLjExMi4wOC4wMzIuMjU2cS4xNTkuMTU3LjI1Ni4wNDd6bS40OC43MnEuMTQ0LS4xMTIgMC0uMzA0cS0uMTI4LS4yMDgtLjI3Mi0uMDk2cS0uMTQ0LjA4IDAgLjI4OHQuMjcyLjExMm0uNjcyLjY3M3EuMTI4LS4xMjgtLjA2NC0uMzA0cS0uMTkyLS4xOTItLjMyLS4wNDhxLS4xNDQuMTI4LjA2NC4zMDRxLjE5Mi4xOTIuMzIuMDQ0em0uOTEzLjRxLjA0OC0uMTc2LS4yMDgtLjI1NnEtLjI0LS4wNjQtLjMwNC4xMTJ0LjIwOC4yNHEuMjQuMDk3LjMwNC0uMDk2bTEuMDA5LjA4cTAtLjIwOC0uMjcyLS4xNzZxLS4yNTYgMC0uMjU2LjE3NnEwIC4yMDguMjcyLjE3NnEuMjU2LjAwMS4yNTYtLjE3NXptLjkyOS0uMTZxLS4wMzItLjE3Ni0uMjg4LS4xNDRxLS4yNTYuMDQ4LS4yMjQuMjR0LjI4OC4xMjh0LjIyNS0uMjI0eiIvPjwvc3ZnPg==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534162/DeepWiki.user.js
// @updateURL https://update.greasyfork.org/scripts/534162/DeepWiki.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addWikiButton() {
        // Check if we're on a repository page
        const repoPath = window.location.pathname.match(/^\/([^/]+)\/([^/]+)(?:\/|$)/);
        if (repoPath) {
            // Get the username and repository name from the URL
            const username = repoPath[1];
            const repo = repoPath[2];

            // Create the wiki button
            const wikiButton = document.createElement('a');
            wikiButton.classList.add('btn', 'btn-sm', 'btn-outline', 'ml-2');
            wikiButton.style.position = 'fixed';
            wikiButton.style.bottom = '20px';
            wikiButton.style.right = '20px';
            wikiButton.style.zIndex = '9999';
            wikiButton.href = `https://deepwiki.com/${username}/${repo}`;
            wikiButton.target = '_blank';
            wikiButton.title = 'Open Wiki on DeepWiki';

            // Add the Emoji light bulb icon
            wikiButton.textContent = '💡';

            // Append the button to the page
            const repoHeader = document.querySelector('.BorderGrid-cell');
            if (repoHeader) {
                repoHeader.appendChild(wikiButton);
            } else {
                document.body.appendChild(wikiButton);
            }
        }
    }

    // Add the wiki button when the page loads
    window.addEventListener('load', addWikiButton);
})();