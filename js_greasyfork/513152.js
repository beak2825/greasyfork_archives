    // ==UserScript==
    // @name         ROBLOX 2018 FAVICON
    // @namespace    https://discord.com/
    // @version      1.0
    // @description  Script to change ROBLOX favicon to the 2018 icon what I base this off of https://greasyfork.org/en/scripts/460852-discord-remove-favicon-red-dot
    // @match        https://*.ROBLOX.com/*
    // @icon         https://upload.wikimedia.org/wikipedia/commons/8/80/Roblox_Logo_Black.svg
    // @grant        none
    // @noframes
// @downloadURL https://update.greasyfork.org/scripts/513152/ROBLOX%202018%20FAVICON.user.js
// @updateURL https://update.greasyfork.org/scripts/513152/ROBLOX%202018%20FAVICON.meta.js
    // ==/UserScript==
     
    (function () {
        'use strict';
        const favicon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIg0KCSBpZD0ic3ZnMTAiIGlua3NjYXBlOnZlcnNpb249IjAuOTIuMyAoMjQwNTU0NiwgMjAxOC0wMy0xMSkiIHNvZGlwb2RpOmRvY25hbWU9IlJvYmxveF8yMDE3X09fSWNvbl9maW5hbF8tX1JlZC5zdmciIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KCSB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDMwMi43IDMwMi43Ig0KCSBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMDIuNyAzMDIuNzsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6IzY0NjU2Nzt9DQo8L3N0eWxlPg0KPHNvZGlwb2RpOm5hbWVkdmlldyAgYm9yZGVyY29sb3I9IiM2NjY2NjYiIGJvcmRlcm9wYWNpdHk9IjEiIGdyaWR0b2xlcmFuY2U9IjEwIiBndWlkZXRvbGVyYW5jZT0iMTAiIGlkPSJuYW1lZHZpZXcxMiIgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnMTAiIGlua3NjYXBlOmN4PSIxNTEuMzYiIGlua3NjYXBlOmN5PSIxNTEuMzYiIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIiBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIiBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDE3IiBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIiBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiIGlua3NjYXBlOndpbmRvdy14PSItOCIgaW5rc2NhcGU6d2luZG93LXk9Ii04IiBpbmtzY2FwZTp6b29tPSIyLjYwMzA2NTUiIG9iamVjdHRvbGVyYW5jZT0iMTAiIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIgc2hvd2dyaWQ9ImZhbHNlIj4NCgk8L3NvZGlwb2RpOm5hbWVkdmlldz4NCjxwYXRoIGlkPSJwYXRoMjAiIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIGNsYXNzPSJzdDAiIGQ9Ik0xMjAuNSwyNzEuN2MtMTEwLjktMjguNi0xMjAtMzEtMTE5LjktMzEuNQ0KCUMwLjcsMjM5LjYsNjIuMSwwLjUsNjIuMiwwLjRjMCwwLDU0LDEzLjgsMTE5LjksMzAuOHMxMjAsMzAuOCwxMjAuMSwzMC44YzAuMiwwLDAuMiwwLjQsMC4xLDAuOWMtMC4yLDEuNS02MS41LDIzOS4zLTYxLjcsMjM5LjUNCglDMjQwLjYsMzAyLjUsMTg2LjUsMjg4LjcsMTIwLjUsMjcxLjd6IE0xNzQuOSwxNThjMy4yLTEyLjYsNS45LTIzLjEsNi0yMy40YzAuMS0wLjUtMi4zLTEuMi0yMy4yLTYuNmMtMTIuOC0zLjMtMjMuNS01LjktMjMuNi01LjgNCgljLTAuMywwLjMtMTIuMSw0Ni42LTEyLDQ2LjdjMC4yLDAuMiw0Ni43LDEyLjIsNDYuOCwxMi4xQzE2OC45LDE4MC45LDE3MS42LDE3MC42LDE3NC45LDE1OEwxNzQuOSwxNTh6Ii8+DQo8L3N2Zz4NCg==';
        function createIconLink() {
            const link = document.createElement('link');
            link.type = 'image/png';
            link.rel = 'icon';
            link.href = favicon;
            return link;
        }
        function consoleInfo(content) {
            console.info(`[Remove-dot]: ${content}`);
        }
        window.onload = () => {
            consoleInfo('window onload.');
            let notificationNotice = document.querySelector('link[rel="icon"]');
            if (notificationNotice) {
                consoleInfo('reset favicon.');
                notificationNotice.href = favicon;
            }
            else {
                consoleInfo('Cannot find notificationNotice.');
                notificationNotice = createIconLink();
                document.head.appendChild(notificationNotice);
            }
            const observer = new MutationObserver(() => {
                consoleInfo('notificationNotice observer.');
                observer.disconnect();
                consoleInfo('reset favicon.');
                if (notificationNotice) {
                    notificationNotice.href = favicon;
                    observer.observe(notificationNotice, {
                        attributes: true,
                        attributeFilter: ['href'],
                    });
                }
            });
            observer.observe(notificationNotice, {
                attributes: true,
                attributeFilter: ['href'],
            });
        };
    })();
