// ==UserScript==
// @name         Teamwork Fixes
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @description  Rationalize Teamwork by disabling nerve-breaking keyboard shortcuts
// @author       Bill Seremetis (https://www.drupal.org/u/bserem)
// @match        https://projects.__YOUR_TEAMWORK_DOMAIN_HERE__.com/*
// @license      MIT
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuNCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMTkuMSAxMTkuMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTE5LjEgMTE5LjE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO30KCS5zdDF7ZmlsbDojMUQxQzM5O30KCS5zdDJ7ZmlsbDojRkYyMkIxO30KPC9zdHlsZT4KPHRpdGxlPlRXX0JVVFRPTl9QT1M8L3RpdGxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNTkuNSwwTDU5LjUsMGMzMi45LDAsNTkuNSwyNi42LDU5LjUsNTkuNXYwYzAsMzIuOS0yNi42LDU5LjUtNTkuNSw1OS41aDBDMjYuNiwxMTkuMSwwLDkyLjQsMCw1OS41djAKCUMwLDI2LjYsMjYuNiwwLDU5LjUsMHoiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTU4LjcsNTIuMWMzLjMsMCw1LjItMS44LDUuMi00LjljMC4xLTIuNi0xLjktNC44LTQuNS00LjljLTAuMiwwLTAuNCwwLTAuNSwwaC03LjV2LTUuNWMwLjItMy4xLTIuMi01LjktNS40LTYKCWMtMy4xLTAuMi01LjksMi4yLTYsNS40YzAsMC4yLDAsMC41LDAsMC43djM4LjJjMCw5LjIsMy43LDEzLjMsMTEuOSwxMy4zYzMuMSwwLjEsNi4yLTAuNyw4LjktMi4yYzEuMy0wLjgsMi4xLTIuMywyLTMuOAoJYzAtMi41LTEuNy01LjItNC01LjJjLTAuMywwLTAuNywwLjEtMSwwLjJsLTAuNCwwLjJjLTAuOCwwLjQtMS44LDAuNy0yLjcsMC43Yy0xLjUsMC0zLjItMC41LTMuMi00LjZWNTIuMUg1OC43eiIvPgo8cGF0aCBjbGFzcz0ic3QyIiBkPSJNODMuMiw2OC4yYy01LjUsMC0xMCw0LjUtMTAsMTBzNC41LDEwLDEwLDEwczEwLTQuNSwxMC0xMFM4OC43LDY4LjIsODMuMiw2OC4yIi8+Cjwvc3ZnPgo=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513396/Teamwork%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/513396/Teamwork%20Fixes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ['keydown', 'keyup'].forEach((eventName) => {
        window.addEventListener(
            eventName,
            (e) => {
                // console.log(e);
                // Stop `d` letter: issue duplication!
                if (e.key == 'd') {
                    e.stopPropagation();
                }
            },
            true // capturing phase - very important
        );
    });
})();