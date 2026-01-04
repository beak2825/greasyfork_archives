// ==UserScript==
// @name        Internet Roadtrip Pathfinder
// @namespace   internet-roadtrip-pathfinder
// @match       https://neal.fun/*
// @version     1.9.0
// @author      mat
// @description A somewhat reliable pathfinder for neal.fun's Internet Roadtrip.
// @license     0BSD
// @run-at      document-start
// @resource    flagCheckerboardPng data:image/png;base64,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
// @resource    flagSvg data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIEdlbmVyYXRvcjogU1ZHIFJlcG8gTWl4ZXIgVG9vbHMgLS0+Cgo8c3ZnCiAgIHdpZHRoPSI4MDBweCIKICAgaGVpZ2h0PSI4MDBweCIKICAgdmlld0JveD0iMCAwIDI0IDI0IgogICBmaWxsPSJub25lIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICBzb2RpcG9kaTpkb2NuYW1lPSJmbGFnLnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS40ICg4NmE4YWQ3LCAyMDI0LTEwLTExKSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMSIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9Im5hbWVkdmlldzEiCiAgICAgcGFnZWNvbG9yPSIjNTA1MDUwIgogICAgIGJvcmRlcmNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgaW5rc2NhcGU6c2hvd3BhZ2VzaGFkb3c9IjAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMSIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiCiAgICAgaW5rc2NhcGU6em9vbT0iMSIKICAgICBpbmtzY2FwZTpjeD0iMzYyIgogICAgIGlua3NjYXBlOmN5PSI0NjAuNSIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjI1NjAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTM2OSIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iLTgiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ii04IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnMSIgLz4KICA8cGF0aAogICAgIGQ9Im0gNC43LDQuMzA5OTM5MSBjIC0wLjE1MjYyMTYsMC4wNTI0MzMgLTAuMjc3NjYsMC4xNDU2NiAtMC4zNjkxNCwwLjI3MzAxIC0wLjA5MTQ4LDAuMTI3MzYgLTAuMTQwNzQsMC4yODAxOSAtMC4xNDA4NiwwLjQzNjk5IFYgMTkuOTk5ODk5IGMgMCwwLjE5OSAwLjA3OTAyLDAuMzg5NzAxIDAuMjE5NjcsMC41MzA0MDEgMC4xNDA2NSwwLjE0MDYgMC4zMzE0MiwwLjIxOTU5OSAwLjUzMDMzLDAuMjE5NTk5IDAuMTk4OTEsMCAwLjM4OTY4LC0wLjA3OSAwLjUzMDMzLC0wLjIxOTYgMC4xNDA2NSwtMC4xNDA3IDAuMjE5NjcwMiwtMC4zMzE0IDAuMjE5NjcsLTAuNTMwNCBsIC01LjNlLTYsLTUuODYwMDE3IFYgMy45OTU5OTg1IGMgMCwwIC0wLjgzNzM3MzEsMC4yNjE1MDggLTAuOTg5OTk0NywwLjMxMzk0MDYgeiIKICAgICBmaWxsPSIjMDAwMDAwIgogICAgIGlkPSJwYXRoMS0yIgogICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuODU2ODc0MTIsMCwwLDAuODU2ODc0MTIsMS43MDkwMzA4LDEuNzEzOTMwNCkiCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6MS4xNjcwMztzdHJva2U6bm9uZSIKICAgICBzb2RpcG9kaTpub2RldHlwZXM9InpjY3Njc2NzY2N6IgogICAgIGlua3NjYXBlOmxhYmVsPSJtYXN0IgogICAgIGlua3NjYXBlOmV4cG9ydC1maWxlbmFtZT0iZmxhZy1jaGVja2VyYm9hcmQucG5nIgogICAgIGlua3NjYXBlOmV4cG9ydC14ZHBpPSI0OS4yMjAwMDEiCiAgICAgaW5rc2NhcGU6ZXhwb3J0LXlkcGk9IjQ5LjIyMDAwMSIgLz4KICA8ZwogICAgIGlkPSJnMTAiCiAgICAgaW5rc2NhcGU6bGFiZWw9ImZsYWciPgogICAgPHBhdGgKICAgICAgIGQ9Ik0gMTkuNDIsNC40NDk5NCBDIDE5LjMyMDMsNC4zODExNiAxOS4yMDUzLDQuMzM3OSAxOS4wODUsNC4zMjM5NSAxOC45NjQ3LDQuMzEgMTguODQyOCw0LjMyNTc5IDE4LjczLDQuMzY5OTQgMTcuNTkyNTcsNC44NjI4OTk4IDE1Ljg0ODI1Myw1LjMwOTExNjEgMTUuMTQ3MTIxLDUuMzY1NTU4MyBMIDE1LDUuMzY5OTQgYyAtMC44NzUxMzYsLTAuMTEyODg0NCAtMS41ODczLC0wLjU1NDI1IC0yLjMsLTEgLTAuOTE5OCwtMC41Njg1MSAtMi4yMjM5NDksLTEuMDk4OTI5MSAtMywtMS4xNiAtMC43NzYwNTEyLC0wLjA2MTA3MSAtNS4zOTc4ODUzLDAuOTgxNzE4NyAtNS42MzEzODAyLDEuMTUxOTM0NyAtMC4yMzM0OTQ4LDAuMTcwMjE2IDAuMDQ5ODc3LDkuOTYyMzkyMyAwLjA0OTg3Nyw5Ljk2MjM5MjMgMCwwIDQuMTE0NjUzNSwtMC45MTE1NjcgNS40MzE1MDM1LC0xLjAzNDM2NyAwLjg0NjcwMDcsMC4yMDc5IDEuNjU2MjAwNywwLjU0NTIgMi40MDAwMDA3LDEgMC44NzAxLDAuNTMxOSAxLjgyMzQsMC45MTM5IDMuMTYwNCwwLjkyODMgMS4zMzY5OTksMC4wMTQ0IDIuNzUyODk5LC0wLjM2NTYgNC4wOTk1OTksLTAuOTI4MyAwLjE0MDYsLTAuMDU1NyAwLjI2MTMsLTAuMTUyIDAuMzQ2OCwtMC4yNzY3IDAuMDg1NSwtMC4xMjQ3IDAuMTMxOSwtMC4yNzIxIDAuMTMzMiwtMC40MjMzIFYgNS4wNjk5NCBDIDE5LjY5NzUsNC45NTI1OCAxOS42NzY5LDQuODM1MTIgMTkuNjMsNC43MjczIDE5LjU4Myw0LjYxOTQ3IDE5LjUxMSw0LjUyNDQgMTkuNDIsNC40NDk5NCBaIgogICAgICAgZmlsbD0iIzAwMDAwMCIKICAgICAgIGlkPSJwYXRoNCIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuNzMyNzQzMDUsMCwwLDAuNzMwODM2MzUsMi45NTI0NjUzLDIuNzcwNzA2OCkiCiAgICAgICBzdHlsZT0iZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjYzOTgyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjc2NjY2N6Y2NjY2Njc2NjY2MiIC8+CiAgPC9nPgo8L3N2Zz4K
// @resource    flagWithCrossSvg data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIEdlbmVyYXRvcjogU1ZHIFJlcG8gTWl4ZXIgVG9vbHMgLS0+Cgo8c3ZnCiAgIHdpZHRoPSI4MDBweCIKICAgaGVpZ2h0PSI4MDBweCIKICAgdmlld0JveD0iMCAwIDI0IDI0IgogICBmaWxsPSJub25lIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICBzb2RpcG9kaTpkb2NuYW1lPSJmbGFnLXdpdGgtY3Jvc3Muc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjQgKDg2YThhZDcsIDIwMjQtMTAtMTEpIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxIiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3MSIKICAgICBwYWdlY29sb3I9IiM1MDUwNTAiCiAgICAgYm9yZGVyY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIxIgogICAgIGlua3NjYXBlOmRlc2tjb2xvcj0iI2QxZDFkMSIKICAgICBpbmtzY2FwZTp6b29tPSIxLjQxNDIxMzYiCiAgICAgaW5rc2NhcGU6Y3g9IjM2Mi4wMzg2NiIKICAgICBpbmtzY2FwZTpjeT0iNDY5Ljg3MjQ0IgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMjU2MCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMzY5IgogICAgIGlua3NjYXBlOndpbmRvdy14PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmcxIiAvPgogIDxwYXRoCiAgICAgZD0ibSA0LjcsNC4zMDk5MzkxIGMgLTAuMTUyNjIxNiwwLjA1MjQzMyAtMC4yNzc2NiwwLjE0NTY2IC0wLjM2OTE0LDAuMjczMDEgLTAuMDkxNDgsMC4xMjczNiAtMC4xNDA3NCwwLjI4MDE5IC0wLjE0MDg2LDAuNDM2OTkgViAxOS45OTk4OTkgYyAwLDAuMTk5IDAuMDc5MDIsMC4zODk3MDEgMC4yMTk2NywwLjUzMDQwMSAwLjE0MDY1LDAuMTQwNiAwLjMzMTQyLDAuMjE5NTk5IDAuNTMwMzMsMC4yMTk1OTkgMC4xOTg5MSwwIDAuMzg5NjgsLTAuMDc5IDAuNTMwMzMsLTAuMjE5NiAwLjE0MDY1LC0wLjE0MDcgMC4yMTk2NzAyLC0wLjMzMTQgMC4yMTk2NywtMC41MzA0IGwgLTUuM2UtNiwtNS44NjAwMTcgViAzLjk5NTk5ODUgYyAwLDAgLTAuODM3MzczMSwwLjI2MTUwOCAtMC45ODk5OTQ3LDAuMzEzOTQwNiB6IgogICAgIGZpbGw9IiMwMDAwMDAiCiAgICAgaWQ9InBhdGgxLTIiCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC44NTY4NzQxMiwwLDAsMC44NTY4NzQxMiwxLjcwOTAzMDgsMS43MTM5MzA0KSIKICAgICBzdHlsZT0iZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZS13aWR0aDoxLjE2NzAzO3N0cm9rZTpub25lIgogICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iemNjc2NzY3NjY3oiCiAgICAgaW5rc2NhcGU6bGFiZWw9Im1hc3QiIC8+CiAgPGcKICAgICBpZD0iZzEwIgogICAgIGlua3NjYXBlOmxhYmVsPSJmbGFnIj4KICAgIDxwYXRoCiAgICAgICBkPSJNIDE5LjQyLDQuNDQ5OTQgQyAxOS4zMjAzLDQuMzgxMTYgMTkuMjA1Myw0LjMzNzkgMTkuMDg1LDQuMzIzOTUgMTguOTY0Nyw0LjMxIDE4Ljg0MjgsNC4zMjU3OSAxOC43Myw0LjM2OTk0IDE3LjU5MjU3LDQuODYyODk5OCAxNS44NDgyNTMsNS4zMDkxMTYxIDE1LjE0NzEyMSw1LjM2NTU1ODMgTCAxNSw1LjM2OTk0IGMgLTAuODc1MTM2LC0wLjExMjg4NDQgLTEuNTg3MywtMC41NTQyNSAtMi4zLC0xIC0wLjkxOTgsLTAuNTY4NTEgLTIuMjIzOTQ5LC0xLjA5ODkyOTEgLTMsLTEuMTYgLTAuNzc2MDUxMiwtMC4wNjEwNzEgLTUuMzk3ODg1MywwLjk4MTcxODcgLTUuNjMxMzgwMiwxLjE1MTkzNDcgLTAuMjMzNDk0OCwwLjE3MDIxNiAwLjA0OTg3Nyw5Ljk2MjM5MjMgMC4wNDk4NzcsOS45NjIzOTIzIDAsMCA0LjExNDY1MzUsLTAuOTExNTY3IDUuNDMxNTAzNSwtMS4wMzQzNjcgMC44NDY3MDA3LDAuMjA3OSAxLjY1NjIwMDcsMC41NDUyIDIuNDAwMDAwNywxIDAuODcwMSwwLjUzMTkgMS44MjM0LDAuOTEzOSAzLjE2MDQsMC45MjgzIDEuMzM2OTk5LDAuMDE0NCAyLjc1Mjg5OSwtMC4zNjU2IDQuMDk5NTk5LC0wLjkyODMgMC4xNDA2LC0wLjA1NTcgMC4yNjEzLC0wLjE1MiAwLjM0NjgsLTAuMjc2NyAwLjA4NTUsLTAuMTI0NyAwLjEzMTksLTAuMjcyMSAwLjEzMzIsLTAuNDIzMyBWIDUuMDY5OTQgQyAxOS42OTc1LDQuOTUyNTggMTkuNjc2OSw0LjgzNTEyIDE5LjYzLDQuNzI3MyAxOS41ODMsNC42MTk0NyAxOS41MTEsNC41MjQ0IDE5LjQyLDQuNDQ5OTQgWiIKICAgICAgIGZpbGw9IiMwMDAwMDAiCiAgICAgICBpZD0icGF0aDQiCiAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjczMjc0MzA1LDAsMCwwLjczMDgzNjM1LDIuOTUyNDY1MywyLjc3MDcwNjgpIgogICAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS42Mzk4MjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY3NjY2NjemNjY2NjY3NjY2NjIiAvPgogIDwvZz4KICA8ZwogICAgIGlkPSJnOSIKICAgICBpbmtzY2FwZTpsYWJlbD0iY3Jvc3MiCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC43NjAwMDAwMSwwLDAsMC43NjAwMDAwMSwzLjA4Mjc4NTQsMTIuMjM1NTMyKSIKICAgICBzdHlsZT0ic3Ryb2tlLXdpZHRoOjEuMzE1NzkiPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjUyLjYzMTY7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgICAgZD0ibSA0OTguNTEwMTEsMTE5LjUwMTI2IDE1MCwxNTAiCiAgICAgICBpZD0icGF0aDgiCiAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjAzLDAsMCwwLjAzLC0wLjAyMTIxMzIsMC43NDI0NjIxMikiCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjIiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjUyLjYzMTY7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgICAgZD0ibSA0OTguNTEwMTEsMTE5LjUwMTI2IDE1MCwxNTAiCiAgICAgICBpZD0icGF0aDkiCiAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLDAuMDMsLTAuMDMsMCwyMy4wMTkxMjgsLTEwLjYyNzgwMykiCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjIiAvPgogIDwvZz4KPC9zdmc+Cg==
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @grant       GM_addStyle
// @grant       GM_getResourceURL
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/543062/Internet%20Roadtrip%20Pathfinder.user.js
// @updateURL https://update.greasyfork.org/scripts/543062/Internet%20Roadtrip%20Pathfinder.meta.js
// ==/UserScript==

var Pathfinder = (function (exports) {
    'use strict';

    // geojson uses [lng,lat] and we mostly do the same, so we handle all of that here to avoid mistakes
    function getLat(pos) {
        return pos[1];
    }
    function getLng(pos) {
        return pos[0];
    }
    function newPosition(lat, lng) {
        return [lng, lat];
    }
    /**
     * @param coords formatted like "lat,lng"
     * @returns [lng, lat]
     */
    function parseCoordinatesString(coords) {
        if (!coords.includes(","))
            return null;
        const [lat, lng] = coords.split(",").map(Number);
        if (lat === undefined || lng === undefined)
            return null;
        return newPosition(lat, lng);
    }

    const LOG_PREFIX = "[Pathfinder]";

    let map;
    async function initMap() {
        map = await IRF.vdom.map.then((mapVDOM) => mapVDOM.state.map);
    }

    /**
     * in meters, from Google Maps
     */
    const EARTH_RADIUS = 6_378_137;
    /**
     * @param origin lat, lng
     * @param dest lat, lng
     * @returns in meters
     */
    function calculateDistance(origin, dest) {
        const aLat = getLat(origin);
        const bLat = getLat(dest);
        const aLng = getLng(origin);
        const bLng = getLng(dest);
        const theta1 = toRadians(aLat);
        const theta2 = toRadians(bLat);
        const deltaTheta = toRadians(bLat - aLat);
        const deltaLambda = toRadians(bLng - aLng);
        const a = Math.pow(Math.sin(deltaTheta / 2), 2) +
            Math.cos(theta1) *
                Math.cos(theta2) *
                Math.pow(Math.sin(deltaLambda / 2), 2);
        const c = 2 * Math.asin(Math.sqrt(a));
        return EARTH_RADIUS * c;
    }
    /**
     * @param origin lat, lng
     * @param dest lat, lng
     * @returns in degrees
     */
    function calculateHeading(origin, dest) {
        const [aLng, aLat] = [toRadians(getLng(origin)), toRadians(getLat(origin))];
        const [bLng, bLat] = [toRadians(getLng(dest)), toRadians(getLat(dest))];
        const deltaLng = bLng - aLng;
        const [aLatSin, aLatCos] = [Math.sin(aLat), Math.cos(aLat)];
        const [bLatSin, bLatCos] = [Math.sin(bLat), Math.cos(bLat)];
        const [deltaLngSin, deltaLngCos] = [Math.sin(deltaLng), Math.cos(deltaLng)];
        const s = deltaLngSin * bLatCos;
        const c = aLatCos * bLatSin - aLatSin * bLatCos * deltaLngCos;
        return (toDegrees(Math.atan2(s, c)) + 360) % 360;
    }
    /**
     *
     * @param a in degrees
     * @param in degrees
     * @returns in degrees, between 0 and 360
     */
    function calculateHeadingDiff(a, b) {
        a = (a + 360) % 360;
        b = (b + 360) % 360;
        let diff = Math.abs(a - b);
        if (diff > 180) {
            diff = 360 - diff;
        }
        return diff;
    }
    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    function toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    /**
     * Code related to picking the best option and finding panoramas in the pathfinder's path.
     */
    function showBestOption() {
        if (!exports.currentData) {
            throw Error("called showBestOption when currentData was still null");
        }
        const currentPos = newPosition(exports.currentData.lat, exports.currentData.lng);
        const firstPath = getFirstPath();
        if (firstPath.length < panosAdvancedInFirstPath + 2)
            return;
        const bestNextPos = firstPath[panosAdvancedInFirstPath + 1];
        const bestHeading = calculateHeading(currentPos, bestNextPos);
        console.debug(LOG_PREFIX, "option bestHeading", bestHeading);
        let bestOptionIndex = -1;
        let bestOptionHeadingDiff = Infinity;
        const options = exports.currentData.options;
        // first, check only the option that have lat+lng present (since those are more reliable)
        for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
            const option = options[optionIndex];
            if (!option.lat || !option.lng)
                continue;
            const optionPos = newPosition(option.lat, option.lng);
            const firstPathSliced = firstPath.slice(panosAdvancedInFirstPath, panosAdvancedInFirstPath + 2);
            const [matchingPanoInPathIndex, matchingPanoInPathDistance] = findClosestPanoInPath(optionPos, firstPathSliced);
            console.debug(LOG_PREFIX, "option with lat+lng", firstPathSliced[matchingPanoInPathIndex], matchingPanoInPathDistance);
            // heading diff and distance in meters aren't really comparable, but if a pano had a distance
            // of less than 1m then it's almost guaranteed to be the one we want anyways.
            if (matchingPanoInPathDistance < 1 &&
                matchingPanoInPathDistance < bestOptionHeadingDiff) {
                bestOptionIndex = optionIndex;
                bestOptionHeadingDiff = matchingPanoInPathDistance;
            }
        }
        // if nothing was found from the lat+lng check, do the less reliable heading check instead
        if (bestOptionIndex < 0) {
            for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
                const option = options[optionIndex];
                const optionHeading = option.heading;
                const optionHeadingDiff = calculateHeadingDiff(optionHeading, bestHeading);
                if (optionHeadingDiff < bestOptionHeadingDiff) {
                    bestOptionIndex = optionIndex;
                    bestOptionHeadingDiff = optionHeadingDiff;
                }
            }
        }
        if (bestOptionHeadingDiff > 100) {
            console.warn(LOG_PREFIX, "all of the options are bad!");
        }
        else {
            console.debug(LOG_PREFIX, "best option is", options[bestOptionIndex], `(diff: ${bestOptionHeadingDiff})`);
            highlightOptionIndex(bestOptionIndex);
        }
    }
    function highlightOptionIndex(optionIndex) {
        const optionArrowEls = Array.from(document.querySelectorAll(".option"));
        for (let i = 0; i < optionArrowEls.length; i++) {
            const optionArrowEl = optionArrowEls[i];
            if (i === optionIndex)
                optionArrowEl.classList.add("pathfinder-chosen-option");
            else
                optionArrowEl.classList.remove("pathfinder-chosen-option");
        }
    }
    function clearOptionHighlights() {
        for (const optionArrowEl of document.querySelectorAll(".option")) {
            optionArrowEl.classList.remove("pathfinder-chosen-option");
        }
    }
    /**
     * @returns The index of the closest pano in the path, and its distance.
     * Also, panos after the first one with a heading difference greater than 100 degrees are ignored.
     */
    function findClosestPanoInPath(targetPos, path) {
        let closestPanoInFirstPathIndex = -1;
        let closestPanoInFirstPathDistance = Infinity;
        for (let i = 0; i < path.length; i++) {
            const candidatePos = path[i];
            const distanceToCur = calculateDistance(candidatePos, targetPos);
            if (i > 0 && exports.currentData !== null) {
                // heading check
                const prevPos = path[i - 1];
                const candidateHeading = calculateHeading(prevPos, candidatePos);
                const headingDiff = calculateHeadingDiff(exports.currentData.heading, candidateHeading);
                if (headingDiff > 100) {
                    console.debug(LOG_PREFIX, "skipping due to heading diff:", headingDiff);
                    continue;
                }
            }
            if (distanceToCur < closestPanoInFirstPathDistance) {
                closestPanoInFirstPathIndex = i;
                closestPanoInFirstPathDistance = distanceToCur;
            }
        }
        return [closestPanoInFirstPathIndex, closestPanoInFirstPathDistance];
    }

    let stopsMenuEl = null;
    let draggedStopIndex = null;
    function initStopsMenu(containerEl) {
        stopsMenuEl = document.createElement("div");
        stopsMenuEl.className = "pathfinder-stops-menu";
        containerEl.appendChild(stopsMenuEl);
        rerenderStopsMenu();
    }
    function rerenderStopsMenu() {
        if (!stopsMenuEl)
            return;
        const stops = getOrderedStops();
        stopsMenuEl.innerHTML = "";
        if (stops.length === 0 || !SETTINGS.show_stops_menu) {
            stopsMenuEl.style.display = "none";
            return;
        }
        stopsMenuEl.style.display = "block";
        const headerEl = document.createElement("div");
        headerEl.className = "pathfinder-stops-menu-header";
        headerEl.textContent = "Stops";
        stopsMenuEl.appendChild(headerEl);
        const listEl = document.createElement("div");
        listEl.className = "pathfinder-stops-list";
        stopsMenuEl.appendChild(listEl);
        stops.forEach((stop, index) => {
            const itemEl = document.createElement("div");
            itemEl.className = "pathfinder-stop-item";
            itemEl.draggable = true;
            itemEl.dataset.index = String(index);
            const numberEl = document.createElement("span");
            numberEl.className = "pathfinder-stop-item-number";
            numberEl.textContent = String(index + 1);
            itemEl.appendChild(numberEl);
            const controlsEl = document.createElement("div");
            controlsEl.className = "pathfinder-stop-item-controls";
            if (index > 0) {
                const upBtn = document.createElement("button");
                upBtn.className = "pathfinder-stop-btn pathfinder-stop-btn-up";
                upBtn.style.gridColumn = "1";
                upBtn.textContent = "↑";
                upBtn.title = "Move up";
                upBtn.onclick = (e) => {
                    e.stopPropagation();
                    reorderStop(index, index - 1);
                };
                controlsEl.appendChild(upBtn);
            }
            if (index < stops.length - 1) {
                const downBtn = document.createElement("button");
                downBtn.className = "pathfinder-stop-btn pathfinder-stop-btn-down";
                downBtn.style.gridColumn = "2";
                downBtn.textContent = "↓";
                downBtn.title = "Move down";
                downBtn.onclick = (e) => {
                    e.stopPropagation();
                    reorderStop(index, index + 1);
                };
                controlsEl.appendChild(downBtn);
            }
            const removeBtn = document.createElement("button");
            removeBtn.className = "pathfinder-stop-btn pathfinder-stop-btn-remove";
            removeBtn.style.gridColumn = "3";
            removeBtn.textContent = "×";
            removeBtn.title = "Remove stop";
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                removeStop(stop);
            };
            controlsEl.appendChild(removeBtn);
            itemEl.appendChild(controlsEl);
            itemEl.addEventListener("dragstart", (e) => {
                draggedStopIndex = index;
                itemEl.classList.add("dragging");
                e.dataTransfer.effectAllowed = "move";
            });
            itemEl.addEventListener("dragend", () => {
                itemEl.classList.remove("dragging");
                draggedStopIndex = null;
            });
            itemEl.addEventListener("dragover", (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                itemEl.classList.add("drag-over");
            });
            itemEl.addEventListener("dragleave", () => {
                itemEl.classList.remove("drag-over");
            });
            itemEl.addEventListener("drop", (e) => {
                e.preventDefault();
                itemEl.classList.remove("drag-over");
                if (draggedStopIndex !== null && draggedStopIndex !== index) {
                    reorderStop(draggedStopIndex, index);
                }
            });
            listEl.appendChild(itemEl);
        });
    }

    /**
     * Returns the list of destinations for the path we're following. Usually this will just be the one
     * destination, but can include more if the path has stops in it.
     */
    function getPathDestinations() {
        const orderedStops = getOrderedStops();
        const lastDestination = parseCoordinatesString(getDestinationString());
        if (!lastDestination)
            return [];
        return [...orderedStops, lastDestination];
    }
    function addStopToPath(pos) {
        const currentStops = getOrderedStops();
        if (currentStops.find((s) => s[0] === pos[0] && s[1] === pos[1])) {
            // stop is already present
            return;
        }
        if (!exports.currentData) {
            currentStops.push(pos);
        }
        else {
            const currentPosition = newPosition(exports.currentData.lat, exports.currentData.lng);
            const finalDestination = parseCoordinatesString(getDestinationString());
            const pathPositions = [currentPosition, ...currentStops];
            if (finalDestination) {
                pathPositions.push(finalDestination);
            }
            let bestInsertIndex = currentStops.length;
            let bestDetour = Infinity;
            for (let i = 0; i < pathPositions.length - 1; i++) {
                const from = pathPositions[i];
                const to = pathPositions[i + 1];
                const originalDist = calculateDistance(from, to);
                const detourDist = calculateDistance(from, pos) + calculateDistance(pos, to) - originalDist;
                if (detourDist < bestDetour) {
                    bestDetour = detourDist;
                    bestInsertIndex = i;
                }
            }
            currentStops.splice(bestInsertIndex, 0, pos);
        }
        setStops(currentStops);
        rerenderCompletePathSegments();
        rerenderStopMarkers();
        rerenderStopsMenu();
        refreshPath();
    }
    function removeStop(pos) {
        const oldStops = getOrderedStops();
        const newStops = oldStops.filter((s) => s[0] !== pos[0] || s[1] !== pos[1]);
        if (newStops.length === oldStops.length) {
            console.warn(LOG_PREFIX, "failed to remove stop at", pos, "currentStops:", oldStops);
            return false;
        }
        setStops(newStops);
        rerenderCompletePathSegments();
        rerenderStopMarkers();
        rerenderStopsMenu();
        refreshPath();
        return true;
    }
    /**
     * @returns {GeoJSON.Position[]} array of [lng, lat] in order
     */
    function getOrderedStops() {
        return JSON.parse(GM_getValue("stops") || "[]");
    }
    function setStops(stops) {
        GM_setValue("stops", JSON.stringify(stops));
    }
    /**
     * Move a stop from one index to another
     */
    function reorderStop(fromIndex, toIndex) {
        const stops = getOrderedStops();
        if (fromIndex < 0 || fromIndex >= stops.length || toIndex < 0 || toIndex >= stops.length) {
            return;
        }
        const [movedStop] = stops.splice(fromIndex, 1);
        if (!movedStop)
            return;
        stops.splice(toIndex, 0, movedStop);
        setStops(stops);
        rerenderCompletePathSegments();
        rerenderStopMarkers();
        rerenderStopsMenu();
        refreshPath();
    }

    let tricksControl = undefined;
    /**
     * Tries to initialize the Minimap Tricks integration, if possible.
     */
    function tryInitMmt() {
        Promise.all([waitForMmtControl, waitForMmtAddContextFn]).then(([newTricksControl, addContext]) => {
            tricksControl = newTricksControl;
            onMmtFound(addContext);
        });
    }
    /**
     * Called when the Minimap Tricks userscript is found.
     */
    async function onMmtFound(addContext) {
        if (!tricksControl) {
            throw Error("tricksControl must be set");
        }
        document.body.classList.add("pathfinder-found-minimap-tricks");
        function setAndSaveDestination(pos) {
            updateDestinationFromString(`${getLat(pos)},${getLng(pos)}`);
        }
        function clearAndSaveDestination() {
            updateDestinationFromString("");
        }
        // Map button
        tricksControl.addButton(GM_getResourceURL("flagSvg"), "Find path to location", (control) => setAndSaveDestination(newPosition(control.lat, control.lng)), 
        // contexts
        ["Map"]);
        // Add stop button
        const addStopBtn = tricksControl.addButton(GM_getResourceURL("flagSvg"), "Add stop to path", (control) => {
            addStopToPath(newPosition(control.lat, control.lng));
        }, 
        // contexts
        ["Map", "Marker", "Pathfinder"]);
        addStopBtn.context_button.classList.add("pathfinder-add-stop-mmt-context-menu-button");
        // Marker button
        tricksControl.addButton(GM_getResourceURL("flagSvg"), "Set as pathfinder destination", (control) => setAndSaveDestination(newPosition(control.lat, control.lng)), 
        // contexts
        ["Marker"]);
        // Remove buttons
        const removePathBtn = tricksControl.addButton(GM_getResourceURL("flagWithCrossSvg"), "Clear found path", () => clearAndSaveDestination(), 
        // contexts
        ["Side", "Map", "Car", "Pathfinder", "Pathfinder destination"]);
        removePathBtn.side_button.classList.add("pathfinder-clear-path-mmt-side-button");
        removePathBtn.context_button.classList.add("pathfinder-clear-path-mmt-context-menu-button");
        tricksControl.addButton(GM_getResourceURL("flagWithCrossSvg"), "Remove stop", (control) => {
            removeStop(newPosition(control.lat, control.lng));
        }, 
        // contexts
        ["Pathfinder stop"]);
        addContext("Pathfinder", [
            // New buttons
            "Find path to location",
            "Add stop to path",
            "Clear found path",
            // Grandfathered buttons from Minimap Tricks
            "Copy coordinates",
            "Add marker",
        ]);
        addContext("Pathfinder destination", [
            "Clear found path",
            "Copy coordinates",
            "Add marker",
        ]);
        addContext("Pathfinder stop", [
            "Remove stop",
            "Copy coordinates",
            "Add marker",
        ]);
        map.on("contextmenu", "best_path", (event) => {
            event.preventDefault();
            openContextMenu(event.originalEvent, event.lngLat, "Pathfinder");
        });
        map.on("contextmenu", "best_path_segments", (event) => {
            event.preventDefault();
            openContextMenu(event.originalEvent, event.lngLat, "Pathfinder");
        });
        setNewInfoDisplay();
    }
    function setNewInfoDisplay() {
        const pathfinderInfoControl = new (class {
            _map;
            _container;
            onAdd(map) {
                this._map = map;
                this._container = this.insertDom();
                return this._container;
            }
            insertDom() {
                const containerEl = document.createElement("div");
                containerEl.id = "minimap-controls";
                containerEl.className =
                    "maplibregl-ctrl maplibregl-ctrl-scale";
                containerEl.style.marginRight = "36px";
                return containerEl;
            }
            onRemove() {
                if (this._container) {
                    this._container.parentNode?.removeChild(this._container);
                }
                this._map = undefined;
            }
        })();
        map.addControl(pathfinderInfoControl, "bottom-right");
        // Move both info elements to the new container
        const nextStopInfoEl = exports.pathfinderInfoEl.previousElementSibling;
        if (nextStopInfoEl && nextStopInfoEl.classList.contains('pathfinder-next-stop-info')) {
            nextStopInfoEl.style.display = 'block';
            pathfinderInfoControl._container.appendChild(nextStopInfoEl);
        }
        exports.pathfinderInfoEl.style.display = 'block';
        pathfinderInfoControl._container.appendChild(exports.pathfinderInfoEl);
    }
    const waitForMmtControl = new Promise((resolve) => {
        if (unsafeWindow._MMT_control) {
            resolve(unsafeWindow._MMT_control);
            return;
        }
        let _tricksControl;
        Object.defineProperty(unsafeWindow, "_MMT_control", {
            get() {
                return _tricksControl;
            },
            set(tricksControl) {
                _tricksControl = tricksControl;
                resolve(tricksControl);
            },
            configurable: true,
            enumerable: true,
        });
    });
    const waitForMmtAddContextFn = new Promise((resolve) => {
        if (unsafeWindow._MMT_addContext) {
            resolve(unsafeWindow._MMT_addContext);
            return;
        }
        let _contexts;
        Object.defineProperty(unsafeWindow, "_MMT_addContext", {
            get() {
                return _contexts;
            },
            set(contexts) {
                _contexts = contexts;
                resolve(contexts);
            },
            configurable: true,
            enumerable: true,
        });
    });
    function addMarkerContextMenuListener(marker, contextName) {
        marker.getElement().addEventListener("contextmenu", (event) => {
            openContextMenu(event, marker.getLngLat(), contextName);
        });
    }
    function openContextMenu(event, pos, contextName) {
        if (!tricksControl)
            return;
        event.stopPropagation();
        event.preventDefault();
        const data = {};
        tricksControl.openMenu(contextName, pos.lat, pos.lng, event.clientX, event.clientY, data);
    }

    let destinationMarker;
    /**
     * should be the same length as the number of stops
     */
    let stopMarkers = [];
    async function initMarkers() {
        const maplibre = await IRF.modules.maplibre;
        destinationMarker = new maplibre.Marker({
            element: (() => {
                const imgEl = document.createElement("img");
                imgEl.className = "pathfinder-destination-marker";
                imgEl.src = GM_getResourceURL("flagCheckerboardPng");
                return imgEl;
            })(),
            anchor: "bottom-left",
        });
        addMarkerContextMenuListener(destinationMarker, "Pathfinder destination");
        rerenderStopMarkers();
    }
    function updateDestinationMarker(position) {
        if (!position) {
            // if no coords are passed then the point is removed
            destinationMarker.remove();
            return;
        }
        destinationMarker
            .setLngLat([getLng(position), getLat(position)])
            .addTo(map);
    }
    async function newStopMarker(index) {
        const maplibre = await IRF.modules.maplibre;
        const markerEl = document.createElement("div");
        markerEl.className = "pathfinder-stop-marker";
        const imgEl = document.createElement("img");
        imgEl.src = GM_getResourceURL("flagCheckerboardPng");
        markerEl.appendChild(imgEl);
        if (SETTINGS.show_stops_menu) {
            const numberEl = document.createElement("span");
            numberEl.className = "pathfinder-stop-number";
            numberEl.textContent = String(index + 1);
            markerEl.appendChild(numberEl);
        }
        const marker = new maplibre.Marker({
            element: markerEl,
            anchor: "bottom-left",
        });
        addMarkerContextMenuListener(marker, "Pathfinder stop");
        return marker;
    }
    async function rerenderStopMarkers() {
        const orderedStops = getOrderedStops();
        for (const marker of stopMarkers) {
            marker.remove();
        }
        stopMarkers = [];
        for (let i = 0; i < orderedStops.length; i++) {
            const stopMarker = await newStopMarker(i);
            const stopPos = orderedStops[i];
            stopMarker.setLngLat(stopPos).addTo(map);
            stopMarkers.push(stopMarker);
        }
    }

    const DEFAULT_SETTINGS = {
        current_searching_path: true,
        allow_long_jumps: true,
        remove_reached_stops: false,
        show_stops_menu: false,
        // advanced settings
        use_option_cache: true,
        backend_url: "https://ir.matdoes.dev",
        heuristic_factor: 3.3,
        forward_penalty_on_intersections: 0,
        non_sharp_turn_penalty: 0,
    };
    const SETTINGS = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    function loadSettingsFromSave() {
        const savedSettings = GM_getValue("settings") ?? "{}";
        for (const [k, v] of Object.entries(JSON.parse(savedSettings))) {
            // @ts-ignore assume that settings has the correct types
            SETTINGS[k] = v;
        }
    }
    function saveSettings() {
        GM_setValue("settings", JSON.stringify(SETTINGS));
    }
    // Load settings immediately on module initialization
    loadSettingsFromSave();
    function initSettingsTab() {
        console.log(LOG_PREFIX, "loaded settings:", SETTINGS);
        const settingsTab = IRF.ui.panel.createTabFor(GM.info, {
            tabName: "Pathfinder",
            style: `
        .pathfinder-settings-tab-content {
            *, *::before, *::after {
                box-sizing: border-box;
            }

            .field-group {
                margin-block: 1rem;
            }
            .field-group-right-aligned {
                float: right;
                display: flex;
            }
            button {
                margin-left: 0.5rem;
            }
            i {
                margin-top: 0;
            }
            h2 {
                margin-bottom: 0;
            }
        }
        `,
            className: "pathfinder-settings-tab-content",
        });
        function addSetting(opts) {
            const id = `pathfinder-${opts.key}`;
            opts.inputEl.id = id;
            function setDisplayedValue(v) {
                if (typeof v === "boolean")
                    opts.inputEl.checked = v;
                else
                    opts.inputEl.value = v.toString();
            }
            setDisplayedValue(SETTINGS[opts.key]);
            opts.inputEl.addEventListener("change", (e) => {
                let newValue;
                const settingType = typeof DEFAULT_SETTINGS[opts.key];
                if (settingType === "boolean")
                    newValue = opts.inputEl.checked;
                else if (settingType === "number")
                    newValue = Number(opts.inputEl.value);
                else
                    newValue = opts.inputEl.value;
                SETTINGS[opts.key] = newValue;
                updateLabel();
                saveSettings();
                opts.cb?.(newValue);
            });
            opts.inputEl.addEventListener("input", (e) => {
                updateLabel(opts.inputEl.value);
            });
            const labelEl = document.createElement("label");
            labelEl.htmlFor = id;
            function updateLabel(shownValue) {
                const newLabelText = typeof opts.label === "string"
                    ? opts.label
                    : opts.label(shownValue ?? SETTINGS[opts.key]);
                labelEl.textContent = newLabelText;
            }
            updateLabel();
            const fieldGroupEl = document.createElement("div");
            fieldGroupEl.classList.add("field-group");
            fieldGroupEl.append(labelEl);
            const rightAlignedContentEl = document.createElement("div");
            rightAlignedContentEl.classList.add("field-group-right-aligned");
            if (!opts.isInputSeparate)
                rightAlignedContentEl.append(opts.inputEl);
            if (opts.hasResetBtn) {
                const resetBtnEl = document.createElement("button");
                resetBtnEl.textContent = "Reset";
                rightAlignedContentEl.append(resetBtnEl);
                resetBtnEl.addEventListener("click", () => {
                    const newValue = DEFAULT_SETTINGS[opts.key];
                    SETTINGS[opts.key] = newValue;
                    setDisplayedValue(newValue);
                    updateLabel();
                    saveSettings();
                    opts.cb?.(newValue);
                });
            }
            fieldGroupEl.append(rightAlignedContentEl);
            if (opts.isInputSeparate)
                fieldGroupEl.append(opts.inputEl);
            settingsTab.container.appendChild(fieldGroupEl);
        }
        function addToggle(label, key, cb) {
            const inputEl = document.createElement("input");
            inputEl.type = "checkbox";
            inputEl.classList.add(IRF.ui.panel.styles.toggle);
            addSetting({ inputEl, label, key, hasResetBtn: true, cb });
        }
        function addTextInput(label, key, cb) {
            const inputEl = document.createElement("input");
            addSetting({ inputEl, label, key, hasResetBtn: true, cb });
        }
        function addSlider(label, key, min, max, cb) {
            const inputEl = document.createElement("input");
            inputEl.type = "range";
            inputEl.classList.add(IRF.ui.panel.styles.slider);
            inputEl.min = min.toString();
            inputEl.max = max.toString();
            if (max - min < 10)
                inputEl.step = "0.01";
            function getLabel(label, value) {
                return `${label}: ${value}`;
            }
            addSetting({
                inputEl,
                label: (value) => getLabel(label, value),
                key,
                hasResetBtn: true,
                isInputSeparate: true,
                cb: (value) => {
                    cb?.(value);
                },
            });
        }
        addToggle("Show currently searching path", "current_searching_path", () => {
            rerenderPath("current_searching_path");
        });
        addToggle("Allow long jumps", "allow_long_jumps", () => {
            clearCachedPaths();
            refreshPath();
        });
        addToggle("Remove stops as they are reached", "remove_reached_stops");
        addToggle("Show stops menu", "show_stops_menu", () => {
            rerenderStopsMenu();
            rerenderStopMarkers();
        });
        const advancedSettingsHeaderEl = document.createElement("h2");
        advancedSettingsHeaderEl.textContent = "Advanced settings";
        const advancedSettingsDescEl = document.createElement("i");
        advancedSettingsDescEl.textContent =
            "NOTE: These settings can make the pathfinder stop working, mess up your ETAs, and significantly hurt performance. You should reset them if something breaks.";
        settingsTab.container.append(advancedSettingsHeaderEl, advancedSettingsDescEl);
        addTextInput("Custom backend URL", "backend_url", () => {
            pfWs.close();
            clearCachedPaths();
            refreshPath();
        });
        addToggle("Use option cache", "use_option_cache", () => {
            clearCachedPaths();
            refreshPath();
        });
        addSlider("Heuristic factor", "heuristic_factor", 1, 4, () => {
            clearCachedPaths();
            refreshPath();
        });
        addSlider("Forward penalty on intersections (in seconds)", "forward_penalty_on_intersections", 0, 600, () => {
            clearCachedPaths();
            refreshPath();
        });
        addSlider("Non-sharp turn penalty (in seconds)", "non_sharp_turn_penalty", 0, 600, () => {
            clearCachedPaths();
            refreshPath();
        });
    }

    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
    function prettyTime(seconds) {
        if (seconds < 0)
            return "now";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secondsLeft = Math.floor(seconds % 60);
        const msLeft = Math.floor((seconds * 1000) % 1000);
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secondsLeft}s`;
        }
        else if (minutes > 0) {
            return `${minutes}m ${secondsLeft}s`;
        }
        else if (secondsLeft > 0) {
            return `${secondsLeft}s`;
        }
        else {
            return `${msLeft}ms`;
        }
    }

    /**
     * A map of path IDs to the best_paths that we calculated to completion.
     */
    const completePathSegments = new Map();
    /**
     * Path ID to its cost (which is the duration in seconds).
     */
    const pathSegmentCosts = new Map();
    const pathIdsToPathSegmentMetadata = new Map();
    /**
     * `lat,lng` to the path id, this includes destinations that aren't currently being used
     */
    const destinationToPathIdMap = new Map();
    /**
     * A map of path IDs to their expected destinations. It'll likely be a few meters from the actual destination.
     */
    const pathIdToDestination = new Map();
    const calculatingPaths = new Map();
    async function setupPathSources() {
        console.debug(LOG_PREFIX, "waiting for old-route to render");
        let waitedCount = 0;
        // alternatively just wait 2 seconds, in case internet-roadtrip.neal.fun/route is broken
        while (map.getSource("old-route") === undefined && waitedCount < 20) {
            await sleep(100);
            waitedCount += 1;
        }
        console.debug(LOG_PREFIX, "setting up path sources");
        setupPathSource("current_searching_path", "#00f");
        setupPathSource("best_path", "#f0f");
        setupPathSource("best_path_segments", "#f0f");
    }
    function setupPathSource(pathSourceId, color) {
        map.addSource(pathSourceId, {
            type: "geojson",
            data: {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: [],
                },
            },
        });
        map.addLayer({
            id: pathSourceId,
            type: "line",
            source: pathSourceId,
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-color": color,
                "line-width": 4,
            },
        });
    }
    async function updatePathSource(pathSourceId, keepPrefixLength, append) {
        let curPath = calculatingPaths.get(pathSourceId) ?? [];
        curPath = curPath.slice(0, keepPrefixLength);
        curPath.push(...append);
        calculatingPaths.set(pathSourceId, curPath);
        rerenderPath(pathSourceId);
    }
    function updateCurrentLocation(curPos) {
        // check if the new location is near the front of our pathfinder's best path
        const firstPath = getFirstPath().slice(0, 10);
        const [closestPanoInBestPathIndex, closestPanoInBestPathDistance] = findClosestPanoInPath(curPos, firstPath);
        if (closestPanoInBestPathIndex === -1) {
            // this is usually fine, but can sometimes happen if we were stuck and got teleported out
            return false;
        }
        if (closestPanoInBestPathDistance > 20) {
            return false;
        }
        const i = closestPanoInBestPathIndex;
        panosAdvancedInFirstPath += i;
        updateLastCostRecalculationTimestamp();
        console.debug(LOG_PREFIX, "close enough, updating panosAdvancedInBestPath to", panosAdvancedInFirstPath);
        rerenderPath("best_path");
        rerenderPath("current_searching_path");
        rerenderCompletePathSegments();
        return true;
    }
    function getFirstPath() {
        const firstPathDest = getPathDestinations()[0];
        const firstPathId = convertDestinationToPathId(firstPathDest);
        if (firstPathId === undefined) {
            console.debug(LOG_PREFIX, "called updateCurrentLocation before the current path was requested");
            return [];
        }
        const unskipped = calculatingPathId === firstPathId
            ? calculatingPaths.get("best_path")
            : completePathSegments.get(firstPathId);
        return unskipped?.slice(panosAdvancedInFirstPath) ?? [];
    }
    let panosAdvancedInFirstPath = 0;
    function rerenderPath(pathSourceId) {
        const pathSource = map.getSource(pathSourceId);
        if (!pathSource) {
            // Path sources haven't been set up yet
            return;
        }
        let skip = 0;
        if (calculatingPathId !== undefined) {
            const pathDestination = pathIdsToPathSegmentMetadata.get(calculatingPathId).destination;
            const paths = getPathDestinations();
            const firstDestInPath = paths[0];
            if (firstDestInPath[0] === pathDestination[0] &&
                firstDestInPath[1] === pathDestination[1]) {
                // we've confirmed that this is the first path, so skip some panos
                skip = panosAdvancedInFirstPath;
            }
        }
        console.debug(LOG_PREFIX, "rendering", pathSourceId, "and skipping", skip);
        let path = calculatingPaths.get(pathSourceId)?.slice(skip) ?? [];
        // hide the current_path if the setting is checked
        // hide the current_searching_path if the setting is checked
        if (pathSourceId === "current_searching_path" &&
            !SETTINGS.current_searching_path) {
            path = [];
        }
        pathSource.setData({
            type: "Feature",
            properties: {},
            geometry: {
                type: "LineString",
                coordinates: path,
            },
        });
    }
    function rerenderCompletePathSegments() {
        const pathSource = map.getSource("best_path_segments");
        if (!pathSource) {
            // Path sources haven't been set up yet
            return;
        }
        const multiLines = [];
        for (const [index, stopDest] of getPathDestinations().entries()) {
            const pathId = convertDestinationToPathId(stopDest);
            if (pathId === undefined) {
                console.debug(LOG_PREFIX, "failed rendering path segment because it hasn't been requested yet:", destinationToPathIdMap, stopDest);
                continue;
            }
            let skip = 0;
            if (index === 0) {
                skip = panosAdvancedInFirstPath;
            }
            console.debug(LOG_PREFIX, "rendering best_path_segments and skipping", skip);
            const lines = completePathSegments.get(pathId)?.slice(skip);
            if (lines) {
                multiLines.push(lines);
            }
            else {
                console.warn(LOG_PREFIX, "stop destination", stopDest, "not present in completePathSegments. this probably just means that we haven't finished calculating it");
                break;
            }
        }
        pathSource.setData({
            type: "Feature",
            properties: {},
            geometry: {
                type: "MultiLineString",
                coordinates: multiLines,
            },
        });
    }
    /**
     * Remove the pathfinder's lines from the map and forget their current state. You should probably
     * use `clearAllPaths` instead.
     */
    function resetRenderedPath() {
        panosAdvancedInFirstPath = 0;
        clearCalculatingPaths();
        rerenderCompletePathSegments();
        rerenderPath("best_path");
        rerenderPath("current_searching_path");
    }
    function updateCompletePathSegment(pathId, path, cost) {
        completePathSegments.set(pathId, path);
        pathSegmentCosts.set(pathId, cost);
        // no path is being calculated at this point anymore
        clearCalculatingPathId();
        // the path is already in completePathSegments, so remove it from
        // calculatingPaths to make it so we don't render the same path twice
        calculatingPaths.clear();
    }
    function convertDestinationToPathId(pos) {
        return destinationToPathIdMap.get(`${getLat(pos)},${getLng(pos)}`);
    }
    function clearCalculatingPaths() {
        if (getOrderedStops().length === 0) {
            // persist these so we can avoid recalculating paths with many stops
            completePathSegments.clear();
            pathSegmentCosts.clear();
            pathIdsToPathSegmentMetadata.clear();
            destinationToPathIdMap.clear();
            pathIdToDestination.clear();
        }
        calculatingPaths.clear();
        clearCalculatingPathId();
    }
    function clearCachedPaths() {
        completePathSegments.clear();
        pathSegmentCosts.clear();
        pathIdsToPathSegmentMetadata.clear();
        destinationToPathIdMap.clear();
        pathIdToDestination.clear();
        calculatingPaths.clear();
        clearCalculatingPathId();
    }

    let pfWs;
    let queuedWebSocketMessages = [];
    let calculatingPathId = undefined;
    let nextPathId = 0;
    /**
     *
     * @param heading in degrees
     * @param start lng, lat
     * @param end lng, lat
     * @param startPano The ID of the current pano. If not passed, the start coords will get
     * snapped to the nearest pano instead.
     */
    function requestNewPath(heading, start, end, startPano) {
        const pathMetadata = {
            source: {
                pos: start,
                heading,
            },
            destination: end,
        };
        let alreadyKnownPathNodes = undefined;
        let alreadyKnownPathCost = undefined;
        const previousPathIdToSameDest = convertDestinationToPathId(end);
        if (previousPathIdToSameDest !== undefined) {
            console.debug(LOG_PREFIX, "we previously calculated a path to", end, "that we might be able to reuse");
            // save the data in a variable for a bit just in case
            const oldPathMetadata = pathIdsToPathSegmentMetadata.get(previousPathIdToSameDest);
            const oldPathCost = pathSegmentCosts.get(previousPathIdToSameDest);
            const oldPathNodes = completePathSegments.get(previousPathIdToSameDest);
            // we're calculating a new path to the same destination, so forget everything we have
            // stored about the old path to avoid a memory leak
            pathIdsToPathSegmentMetadata.delete(previousPathIdToSameDest);
            pathSegmentCosts.delete(previousPathIdToSameDest);
            completePathSegments.delete(previousPathIdToSameDest);
            pathIdToDestination.delete(previousPathIdToSameDest);
            // we might be able to copy that old path (to avoid recalculating) if it had the same source too
            if (oldPathNodes !== undefined &&
                JSON.stringify(oldPathMetadata) === JSON.stringify(pathMetadata)) {
                alreadyKnownPathNodes = oldPathNodes;
                alreadyKnownPathCost = oldPathCost;
                console.debug(LOG_PREFIX, "reusing old path", previousPathIdToSameDest, "to", end);
            }
        }
        console.debug(LOG_PREFIX, "destinationToPathIdMap", destinationToPathIdMap, end);
        // request a new path
        const pathId = nextPathId;
        calculatingPathId = pathId;
        nextPathId++;
        pathIdsToPathSegmentMetadata.set(pathId, pathMetadata);
        destinationToPathIdMap.set(`${getLat(end)},${getLng(end)}`, pathId);
        pathIdToDestination.set(pathId, end);
        if (alreadyKnownPathNodes !== undefined) {
            onProgress({
                id: calculatingPathId,
                percent_done: 1,
                best_path_cost: alreadyKnownPathCost,
                best_path_keep_prefix_length: 0,
                best_path_append: alreadyKnownPathNodes,
                current_path_keep_prefix_length: 0,
                current_path_append: [],
            });
            return;
        }
        sendWebSocketMessage({
            kind: "path",
            start: [getLat(start), getLng(start)],
            end: [getLat(end), getLng(end)],
            heading,
            start_pano: startPano,
            id: pathId,
            no_long_jumps: !SETTINGS.allow_long_jumps,
            heuristic_factor: SETTINGS.heuristic_factor,
            use_option_cache: SETTINGS.use_option_cache,
            forward_penalty_on_intersections: SETTINGS.forward_penalty_on_intersections,
            non_sharp_turn_penalty: SETTINGS.non_sharp_turn_penalty,
        });
    }
    /**
     * Send a message to the pathfinder's WebSocket, queuing it for later if the WebSocket is currently
     * closed.
     *
     * @param msg The object that will get converted into JSON and sent to
     * the server.
     */
    function sendWebSocketMessage(msg) {
        console.debug(LOG_PREFIX, "sending", msg, "to pathfinder websocket");
        if (pfWs.readyState !== 1) {
            console.debug(LOG_PREFIX, "websocket is closed, adding message to queue");
            queuedWebSocketMessages.push(JSON.stringify(msg));
        }
        else {
            pfWs.send(JSON.stringify(msg));
        }
    }
    async function waitAndReconnect() {
        console.debug(LOG_PREFIX, "reconnecting to WebSocket");
        // this timeout is 10 seconds because of a firefox quirk that makes it delay creating websockets if you do it too fast
        await new Promise((r) => setTimeout(r, 10000));
        console.debug(LOG_PREFIX, "reconnecting...");
        connect();
    }
    function connect() {
        console.debug(LOG_PREFIX, "connecting to websocket");
        pfWs = new WebSocket(SETTINGS.backend_url.replace("http", "ws").replace(/\/$/, "") + "/path");
        console.debug(LOG_PREFIX, "websocket created:", pfWs);
        pfWs.addEventListener("close", async () => {
            console.debug(LOG_PREFIX, "Pathfinder WebSocket closed.");
            waitAndReconnect();
        });
        pfWs.addEventListener("error", (e) => {
            console.error(LOG_PREFIX, "Pathfinder WebSocket error:", e);
            pfWs.close();
        });
        pfWs.addEventListener("open", () => {
            console.debug(LOG_PREFIX, "Pathfinder WebSocket connected.");
            for (const msg of queuedWebSocketMessages) {
                pfWs.send(msg);
            }
            queuedWebSocketMessages = [];
        });
        pfWs.addEventListener("message", (e) => {
            const data = JSON.parse(e.data);
            if (data.type === "progress") {
                onProgress(data);
            }
            else if (data.type === "error") {
                alert(data.message);
            }
        });
    }
    async function waitUntilConnected() {
        if (pfWs.readyState !== 1) {
            await new Promise((res) => pfWs.addEventListener("open", res));
        }
    }
    async function clearCalculatingPathId() {
        calculatingPathId = undefined;
    }

    exports.pathfinderInfoEl = void 0;
    let pathfinderNextStopInfoEl;
    let pathfinderRefreshBtnEl;
    let destinationInputEl;
    exports.lastCostRecalculationTimestamp = Date.now();
    async function init() {
        const vdomContainer = await IRF.vdom.container;
        await initMap();
        injectStylesheet();
        const pathfinderContainerEl = document.createElement("div");
        pathfinderContainerEl.id = "pathfinder-container";
        destinationInputEl = document.createElement("input");
        destinationInputEl.classList.add("pathfinder-destination-input");
        destinationInputEl.placeholder = "lat, lng";
        destinationInputEl.value = getDestinationString();
        pathfinderRefreshBtnEl = document.createElement("button");
        pathfinderRefreshBtnEl.textContent = "🗘";
        pathfinderRefreshBtnEl.classList.add("pathfinder-refresh-btn");
        pathfinderRefreshBtnEl.disabled = true;
        pathfinderNextStopInfoEl = document.createElement("span");
        pathfinderNextStopInfoEl.classList.add("pathfinder-next-stop-info");
        exports.pathfinderInfoEl = document.createElement("span");
        exports.pathfinderInfoEl.classList.add("pathfinder-info");
        setInterval(() => {
            let totalCost = 0;
            let totalPanos = 0;
            for (const dest of getPathDestinations()) {
                const pathSegmentId = convertDestinationToPathId(dest);
                if (pathSegmentId === undefined) {
                    // means we haven't calculated this path yet, so we can't set an eta!
                    return;
                }
                const pathSegmentCost = pathSegmentCosts.get(pathSegmentId);
                if (pathSegmentCost === undefined) {
                    // means the path hasn't finished being calculated
                    return;
                }
                totalCost += pathSegmentCost;
                const actualPath = completePathSegments.get(pathSegmentId);
                totalPanos += actualPath.length;
            }
            if (totalCost) {
                const secondsSinceLastCostRecalculation = (Date.now() - exports.lastCostRecalculationTimestamp) / 1000;
                totalCost -= secondsSinceLastCostRecalculation;
                const advancedPercentage = panosAdvancedInFirstPath / totalPanos;
                const adjustedCost = totalCost * (1 - advancedPercentage);
                const prettyEta = prettyTime(adjustedCost);
                exports.pathfinderInfoEl.textContent = `ETA: ${prettyEta}`;
                // Calculate next stop ETA
                const destinations = getPathDestinations();
                if (destinations.length > 0) {
                    const firstDest = destinations[0];
                    const firstPathId = convertDestinationToPathId(firstDest);
                    if (firstPathId !== undefined) {
                        const firstSegmentCost = pathSegmentCosts.get(firstPathId);
                        const firstSegmentPath = completePathSegments.get(firstPathId);
                        if (firstSegmentCost !== undefined && firstSegmentPath !== undefined) {
                            let nextStopCost = firstSegmentCost - secondsSinceLastCostRecalculation;
                            const nextStopPanos = firstSegmentPath.length;
                            const nextStopAdvancedPercentage = panosAdvancedInFirstPath / nextStopPanos;
                            const adjustedNextStopCost = nextStopCost * (1 - nextStopAdvancedPercentage);
                            const prettyNextStopEta = prettyTime(adjustedNextStopCost);
                            pathfinderNextStopInfoEl.textContent = `Next: ${prettyNextStopEta}`;
                        }
                    }
                }
                else {
                    pathfinderNextStopInfoEl.textContent = "";
                }
            }
        }, 1000);
        pathfinderContainerEl.appendChild(destinationInputEl);
        pathfinderContainerEl.appendChild(pathfinderRefreshBtnEl);
        pathfinderContainerEl.appendChild(pathfinderNextStopInfoEl);
        pathfinderContainerEl.appendChild(exports.pathfinderInfoEl);
        vdomContainer.state.updateData = new Proxy(vdomContainer.state.updateData, {
            apply(oldUpdateData, thisArg, args) {
                // onUpdateData is a promise so errors won't propagate to here
                onUpdateData(args[0]);
                return oldUpdateData.apply(thisArg, args);
            },
        });
        const mapContainerEl = map.getContainer().parentElement;
        mapContainerEl.appendChild(pathfinderContainerEl);
        await initMarkers();
        initStopsMenu(mapContainerEl);
        destinationInputEl.addEventListener("change", () => {
            console.debug(LOG_PREFIX, "destination input changed");
            refreshPath();
        });
        pathfinderRefreshBtnEl.addEventListener("click", () => {
            console.debug(LOG_PREFIX, "refresh button clicked");
            refreshPath();
        });
        tryInitMmt();
        initSettingsTab();
        // this has to be done after settings are loaded so the backend url is correct
        connect();
        await setupPathSources();
        // wait until the websocket is open
        await waitUntilConnected();
        // now wait until we've received data from the internet roadtrip ws
        while (!exports.currentData) {
            await sleep(100);
        }
        console.debug(LOG_PREFIX, "start called");
        refreshPath();
    }
    function updateLastCostRecalculationTimestamp() {
        exports.lastCostRecalculationTimestamp = Date.now();
    }
    /** called when we receive a progress update from the pathfinder server */
    function onProgress(data) {
        pathfinderRefreshBtnEl.disabled = false;
        if (data.percent_done < 0) {
            // means the path was cleared
            clearAllPaths();
            rerenderCompletePathSegments();
            return;
        }
        updatePathSource("best_path", data.best_path_keep_prefix_length, data.best_path_append);
        updatePathSource("current_searching_path", data.current_path_keep_prefix_length, data.current_path_append);
        if (data.percent_done < 1) {
            // round to 5 decimal places but truncate to 1
            const percentDoneString = (data.percent_done * 100)
                .toFixed(5)
                .match(/^-?\d+(?:\.\d{0,1})?/)[0];
            exports.pathfinderInfoEl.textContent = `${percentDoneString}%`;
            return;
        }
        // path is done
        const pathId = data.id;
        updateCompletePathSegment(pathId, calculatingPaths.get("best_path"), data.best_path_cost);
        console.debug(LOG_PREFIX, `finished path ${pathId}, updated in completePathSegments`);
        rerenderCompletePathSegments();
        updateLastCostRecalculationTimestamp();
        // find the next segment if possible!
        const lastPosition = completePathSegments.get(pathId).at(-1);
        const secondLastPosition = completePathSegments.get(pathId).at(-2);
        const lastHeading = calculateHeading(secondLastPosition, lastPosition);
        const expectedDestination = pathIdToDestination.get(pathId);
        const allDestinations = getPathDestinations();
        const destinationIndex = allDestinations.findIndex((d) => d[0] === expectedDestination[0] && d[1] === expectedDestination[1]);
        console.debug(LOG_PREFIX, "allDestinations:", allDestinations, "expectedDestination:", expectedDestination, "destinationIndex", destinationIndex);
        if (destinationIndex === -1) {
            console.warn(LOG_PREFIX, "the path we just found wasn't in getPathDestinations():", allDestinations, "expectedDestination:", expectedDestination);
            return;
        }
        if (destinationIndex === allDestinations.length - 1) {
            console.debug(LOG_PREFIX, "found last segment in path");
            return;
        }
        const nextDestination = allDestinations[destinationIndex + 1];
        requestNewPath(lastHeading, lastPosition, nextDestination, 
        // pathfinder server doesn't send us pano ids
        undefined);
        rerenderCompletePathSegments();
    }
    /**
     * Send a message to stop calculating a path, and remove the lines from the map.
     */
    function abortPathfinding() {
        // note that this will get set again when the server sends us a progress update with percent_done being -1
        if (exports.pathfinderInfoEl)
            exports.pathfinderInfoEl.textContent = "";
        if (pathfinderNextStopInfoEl)
            pathfinderNextStopInfoEl.textContent = "";
        if (calculatingPathId !== undefined) {
            sendWebSocketMessage({
                kind: "abort",
                id: calculatingPathId,
            });
        }
        clearAllPaths();
    }
    /**
     * Remove the pathfinder's lines from the map, without aborting the current path.
     */
    function clearAllPaths() {
        exports.pathfinderInfoEl.textContent = "";
        pathfinderNextStopInfoEl.textContent = "";
        resetRenderedPath();
    }
    function updateDestinationFromString(destString) {
        setDestinationString(destString);
        const dest = parseCoordinatesString(destString);
        updateDestinationMarker(dest);
        if (!dest) {
            document.body.classList.remove("pathfinder-has-destination");
            setStops([]);
            // abortPathfinding has to happen before clearAllPaths so the calculatingPathId is still set
            abortPathfinding();
            clearCalculatingPaths();
            rerenderCompletePathSegments();
            rerenderStopMarkers();
            rerenderStopsMenu();
            clearAllPaths();
            return;
        }
        clearAllPaths();
        document.body.classList.add("pathfinder-has-destination");
        if (!exports.currentData) {
            // if we haven't received any data from the game yet then we can't know our current location
            return;
        }
        const curPos = newPosition(exports.currentData.lat, exports.currentData.lng);
        // at least one destination must be present because we just set the destination string and
        // checked that it was valid
        const firstDestination = getPathDestinations()[0];
        requestNewPath(exports.currentData.heading, curPos, firstDestination, exports.currentData.pano);
    }
    exports.previousData = null;
    exports.currentData = null;
    /**
     * The number of times in a row that the current position wasn't found in the best path.
     * This exists so we can recalculate the path if this value gets too high.
     */
    let lostPathCount = 0;
    /**
     * Called whenever we receive a message from the game WebSocket.
     */
    async function onUpdateData(msg) {
        [exports.previousData, exports.currentData] = [exports.currentData, msg];
        const curPos = newPosition(exports.currentData.lat, exports.currentData.lng);
        const locationChanged = exports.previousData?.lat !== getLat(curPos) ||
            exports.previousData?.lng !== getLng(curPos) ||
            exports.previousData?.heading !== exports.currentData.heading;
        if (locationChanged)
            clearOptionHighlights();
        if (SETTINGS.remove_reached_stops) {
            const remainingStops = getOrderedStops();
            for (const stop of [...remainingStops]) {
                if (calculateDistance(stop, curPos) < 15 /* meters */) {
                    removeStop(stop);
                    break;
                }
            }
        }
        if (locationChanged && getPathDestinations().length > 0) {
            const isPathFound = updateCurrentLocation(curPos);
            if (isPathFound) {
                lostPathCount = 0;
                // wait a bit to make sure that any new elements are created
                await sleep(1100);
                showBestOption();
            }
            else {
                console.warn(LOG_PREFIX, `lost path? (#${lostPathCount})`);
                lostPathCount += 1;
                if (lostPathCount >= 3) {
                    lostPathCount = 0;
                    refreshPath();
                }
            }
        }
    }
    async function refreshPath() {
        pathfinderRefreshBtnEl.disabled = true;
        const destinationValue = getDestinationString();
        const hasDestination = destinationValue.trim() !== "";
        document.body.classList.toggle("pathfinder-has-destination", hasDestination);
        if (!hasDestination) {
            updateDestinationMarker(null);
            abortPathfinding();
            return;
        }
        updateDestinationFromString(destinationValue);
        // makes it so we don't wait until the next location change to highlight the new best option
        await sleep(2000);
        showBestOption();
    }
    /**
     * @returns A string that should be formatted as `lat,lng`, but might not be.
     */
    function getDestinationString() {
        return GM_getValue("destination") ?? "";
    }
    /**
     * @param value A string that should be formatted as `lat,lng`, but might not be.
     */
    function setDestinationString(value) {
        GM_setValue("destination", value.trim());
    }
    function injectStylesheet() {
        GM_addStyle(`
    body:not(.pathfinder-found-minimap-tricks) {
      & .map-container .info-button {
        /* overlaps with our ui */
        display: none;
      }
      & .pathfinder-refresh-btn {
        line-height: 1;
        padding: 0.2em;
      }
      & .pathfinder-info,
      & .pathfinder-next-stop-info {
        background-color: #fff;
        padding: 0.1em 0.3em;
        display: block;
      }
    }

    body.pathfinder-found-minimap-tricks {
      & #pathfinder-container {
        display: none;
      }

      & .pathfinder-info,
      & .pathfinder-next-stop-info {
        margin-right: 36px;

        &:empty {
          display: none;
        }
      }
    }

    .pathfinder-destination-marker {
      width: 25px;
      cursor: default;
    }
    .pathfinder-stop-marker {
      cursor: default;
    }
    .pathfinder-stop-marker img {
      width: 20px;
      display: block;
    }
    .pathfinder-stop-number {
      position: absolute;
      bottom: 0px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      border: 1px solid #333;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
      color: #333;
      pointer-events: none;
    }
    
    .pathfinder-stops-menu {
      position: absolute;
      top: 50px;
      left: 10px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      z-index: 1000;
      max-width: 400px;
      max-height: 400px;
      display: flex;
      flex-direction: column;
    }
    
    .pathfinder-stops-menu-header {
      padding: 8px 12px;
      background: #f5f5f5;
      border-bottom: 1px solid #ccc;
      font-weight: bold;
      font-size: 14px;
    }
    
    .pathfinder-stops-list {
      overflow-y: auto;
      max-height: 350px;
    }
    
    .pathfinder-stop-item {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      border-bottom: 1px solid #eee;
      cursor: grab;
      gap: 8px;
      transition: background-color 0.2s;
    }
    .pathfinder-stop-item:hover {
      background: #f9f9f9;
    }
    .pathfinder-stop-item.dragging {
      opacity: 0.5;
      cursor: grabbing;
    }
    .pathfinder-stop-item.drag-over {
      background: #e3f2fd;
      border-color: #2196f3;
    }
    .pathfinder-stop-item:last-child {
      border-bottom: none;
    }
    
    .pathfinder-stop-item-number {
      flex-shrink: 0;
      background: #2196f3;
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }
    
    .pathfinder-stop-item-coords {
      flex-grow: 1;
      font-size: 12px;
      font-family: monospace;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .pathfinder-stop-item-controls {
      display: grid;
      grid-template-columns: 24px 24px 24px;
      gap: 4px;
      flex-shrink: 0;
    }
    
    .pathfinder-stop-btn {
      background: white;
      border: 1px solid #ccc;
      border-radius: 3px;
      width: 24px;
      height: 24px;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: all 0.2s;
    }
    .pathfinder-stop-btn:hover {
      background: #f5f5f5;
      border-color: #999;
    }
    .pathfinder-stop-btn:active {
      background: #e0e0e0;
    }
    
    .pathfinder-stop-btn-remove {
      color: #d32f2f;
      font-size: 18px;
      font-weight: bold;
    }
    .pathfinder-stop-btn-remove:hover {
      background: #ffebee;
      border-color: #d32f2f;
    }
    .pathfinder-chosen-option path {
      fill: #f0f !important;
    }

    body:not(.pathfinder-has-destination) {
      & .pathfinder-clear-path-mmt-side-button,
      .pathfinder-clear-path-mmt-context-menu-button,
      .pathfinder-add-stop-mmt-context-menu-button {
        display: none !important;
      }
    }
  `);
    }
    function replacePathfinderInfoEl(newEl) {
        exports.pathfinderInfoEl.remove();
        exports.pathfinderInfoEl = newEl;
    }
    init();

    exports.clearAllPaths = clearAllPaths;
    exports.getDestinationString = getDestinationString;
    exports.onProgress = onProgress;
    exports.refreshPath = refreshPath;
    exports.replacePathfinderInfoEl = replacePathfinderInfoEl;
    exports.updateDestinationFromString = updateDestinationFromString;
    exports.updateLastCostRecalculationTimestamp = updateLastCostRecalculationTimestamp;

    return exports;

})({});
