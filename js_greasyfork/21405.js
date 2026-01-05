// ==UserScript==
// @name         Pitchfork Get Review Score On Scroll & Add Apple Music Link
// @namespace    https://drbn.fr
// @version      0.5
// @description  Directly show review score on global reviews page
// @author       You
// @match        *://pitchfork.com/reviews/albums/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @connect apple.com
// @downloadURL https://update.greasyfork.org/scripts/21405/Pitchfork%20Get%20Review%20Score%20On%20Scroll%20%20Add%20Apple%20Music%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/21405/Pitchfork%20Get%20Review%20Score%20On%20Scroll%20%20Add%20Apple%20Music%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var cssBlock = document.createElement('style');

    var cssContent = '' +
        '#radio-banner, .cns-ads-stage { display: none !important; }' +
        '@keyframes loading { from {opacity: 1;} to {opacity: 0;} }' +
        '.grease-loading { animation: loading 1s infinite alternate ease; }' +
        '.grease-score { display: inline-block; position: absolute; left: 20px; top: 0; z-index: 10; color: #2B2B2B; background: rgba(255, 255, 255, 0.9); min-width: 42px; text-align: center; padding: 5px; border: 2px solid #2B2B2B; border-radius: 5px; font-size: 20px; font-weight: bold; opacity: 0; transition: 500ms ease; }' +
        '.grease-bnm .grease-score { border-color: #FF3530; color: #FF3530; }' +
        '.grease-itunes-link { position: absolute; top: 137px; right: 20px; z-index: 44; width: 80px; opacity: 0; transition: 500ms ease; cursor: pointer }' +
        '.grease-itunes-link.show { opacity: 0.8; }' +
        '.grease-itunes-link.show:hover { opacity: 1; }' +
        '';

    var listenAppleMusicLogo = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iRlIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMTA5LjI1cHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDEwOS4yNSA0MCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTA5LjI1IDQwIiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48Zz48Zz48cGF0aCBmaWxsPSIjQTZBNkE2IiBkPSJNOTkuNzIxLDBIOS41MzVDOS4xNjgsMCw4LjgwNiwwLDguNDM5LDAuMDAyQzguMTM0LDAuMDA0LDcuODMsMC4wMSw3LjUyMSwwLjAxNWMtMC42NjYsMC4wMTctMS4zNCwwLjA1OC0yLjAwNCwwLjE3N2MtMC42NywwLjExNy0xLjI5MiwwLjMxNy0xLjkwMSwwLjYyN0MzLjAxOCwxLjEyNSwyLjQ3MSwxLjUyMywxLjk5OCwxLjk5N0MxLjUyLDIuNDcxLDEuMTIzLDMuMDIsMC44MTksMy42MThDMC41MDgsNC4yMjcsMC4zMTEsNC44NTIsMC4xOTQsNS41MjFjLTAuMTIsMC42NjItMC4xNjIsMS4zMzItMC4xNzksMi4wMDJDMC4wMDYsNy44MywwLjAwNSw4LjEzOCwwLDguNDQ0QzAsOC44MDcsMCw5LjE3LDAsOS41MzZ2MjAuOTI5YzAsMC4zNjksMCwwLjczLDAsMS4wOTRjMC4wMDUsMC4zMTEsMC4wMDYsMC42MTEsMC4wMTYsMC45MjJjMC4wMTcsMC42NywwLjA1OSwxLjM0LDAuMTc5LDIuMDAyYzAuMTE2LDAuNjcsMC4zMTMsMS4yOTcsMC42MjUsMS45MDRjMC4zMDQsMC41OTYsMC43LDEuMTQ1LDEuMTc5LDEuNjEzYzAuNDczLDAuNDc5LDEuMDIsMC44NzUsMS42MTgsMS4xOGMwLjYwOSwwLjMxMiwxLjIzMSwwLjUxLDEuOTAxLDAuNjMxYzAuNjY0LDAuMTE5LDEuMzM4LDAuMTU4LDIuMDA0LDAuMTc2YzAuMzA5LDAuMDA4LDAuNjEyLDAuMDEyLDAuOTE4LDAuMDEyQzguODA2LDQwLDkuMTY4LDQwLDkuNTM1LDQwaDkwLjE4NmMwLjM1OSwwLDAuNzI1LDAsMS4wODQtMC4wMDJjMC4zMDUsMCwwLjYxNy0wLjAwNCwwLjkyMi0wLjAxMmMwLjY3LTAuMDE4LDEuMzQyLTAuMDU3LDItMC4xNzZjMC42Ny0wLjEyMSwxLjI5My0wLjMxOCwxLjkwOC0wLjYzMWMwLjU5OC0wLjMwNSwxLjE0NS0wLjcwMSwxLjYxNy0xLjE4YzAuNDc3LTAuNDY5LDAuODczLTEuMDE4LDEuMTgyLTEuNjEzYzAuMzA3LTAuNjA3LDAuNTA2LTEuMjM0LDAuNjE5LTEuOTA0YzAuMTIzLTAuNjYyLDAuMTYyLTEuMzMyLDAuMTg2LTIuMDAyYzAuMDA0LTAuMzExLDAuMDA0LTAuNjExLDAuMDA0LTAuOTIyYzAuMDA4LTAuMzYzLDAuMDA4LTAuNzI1LDAuMDA4LTEuMDk0VjkuNTM2YzAtMC4zNjYsMC0wLjcyOS0wLjAwOC0xLjA5MmMwLTAuMzA3LDAtMC42MTQtMC4wMDQtMC45MjFjLTAuMDIzLTAuNjctMC4wNjItMS4zNC0wLjE4Ni0yLjAwMmMtMC4xMTMtMC42Ny0wLjMxMi0xLjI5NS0wLjYxOS0xLjkwM2MtMC4zMDktMC41OTktMC43MDUtMS4xNDctMS4xODItMS42MjFjLTAuNDczLTAuNDc0LTEuMDItMC44NzItMS42MTctMS4xNzljLTAuNjE1LTAuMzEtMS4yMzgtMC41MS0xLjkwOC0wLjYyN2MtMC42NTgtMC4xMTktMS4zMy0wLjE2LTItMC4xNzdjLTAuMzA1LTAuMDA1LTAuNjE3LTAuMDExLTAuOTIyLTAuMDEzQzEwMC40NDUsMCwxMDAuMDgsMCw5OS43MjEsMEw5OS43MjEsMHoiLz48cGF0aCBkPSJNOC40NDUsMzkuMTI1Yy0wLjMwNSwwLTAuNjAzLTAuMDA0LTAuOTA0LTAuMDEyYy0wLjU2LTAuMDE2LTEuMjIzLTAuMDQ3LTEuODY5LTAuMTYyYy0wLjYxMS0wLjExMS0xLjE1My0wLjI5MS0xLjY1Ny0wLjU0OWMtMC41MjEtMC4yNjQtMC45OS0wLjYwNS0xLjM5Ny0xLjAxNmMtMC40MTQtMC40MDYtMC43NTQtMC44NzMtMS4wMi0xLjM5NmMtMC4yNi0wLjUwNi0wLjQzOC0xLjA0Ny0wLjU0My0xLjY1OEMwLjkzMiwzMy42NiwwLjksMzIuOTc3LDAuODg4LDMyLjQ1N2MtMC4wMDctMC4yMTEtMC4wMTUtMC45MTItMC4wMTUtMC45MTJWOC40NDRjMCwwLDAuMDA5LTAuNjkxLDAuMDE1LTAuODk1QzAuOSw3LjAyNSwwLjkzMiw2LjM0NCwxLjA1Myw1LjY3OEMxLjE2LDUuMDY0LDEuMzM4LDQuNTIyLDEuNTk3LDQuMDE2YzAuMjY2LTAuNTI0LDAuNjA2LTAuOTk0LDEuMDE1LTEuMzk4YzAuNDE0LTAuNDE0LDAuODg1LTAuNzU3LDEuNDAyLTEuMDIyYzAuNTE0LTAuMjYxLDEuMDU2LTAuNDM5LDEuNjU0LTAuNTQ0QzYuMzQxLDAuOTMxLDcuMDIzLDAuOSw3LjU0MywwLjg4N2wwLjkwMi0wLjAxMkgxMDAuOGwwLjkxMywwLjAxM2MwLjUxMywwLjAxMywxLjE5NSwwLjA0MywxLjg1OCwwLjE2M2MwLjYwMywwLjEwNSwxLjE0NywwLjI4NSwxLjY3MSwwLjU0OGMwLjUxMywwLjI2MywwLjk4MiwwLjYwNSwxLjM5MiwxLjAxNmMwLjQwOSwwLjQwNiwwLjc1MiwwLjg3OCwxLjAyMywxLjQwNGMwLjI1OCwwLjUxMiwwLjQzNCwxLjA1MywwLjUzNSwxLjY0OWMwLjExNiwwLjYzMSwwLjE1MiwxLjI3OCwwLjE3NCwxLjg4OGMwLjAwMywwLjI4MywwLjAwMywwLjU4NywwLjAwMywwLjg5YzAuMDA4LDAuMzc1LDAuMDA4LDAuNzMxLDAuMDA4LDEuMDkydjIwLjkyOWMwLDAuMzYzLDAsMC43MTctMC4wMDgsMS4wNzRjMCwwLjMyNiwwLDAuNjIzLTAuMDA0LDAuOTNjLTAuMDIxLDAuNTktMC4wNTcsMS4yMzYtMC4xNzEsMS44NTRjLTAuMTA0LDAuNjEzLTAuMjc5LDEuMTU2LTAuNTQsMS42N2MtMC4yNywwLjUyLTAuNjEyLDAuOTktMS4wMTYsMS4zODdjLTAuNDEzLDAuNDE4LTAuODgyLDAuNzU4LTEuMzk5LDEuMDIxYy0wLjUxOSwwLjI2NC0xLjA0OCwwLjQzOS0xLjY2OCwwLjU1MWMtMC42NDEsMC4xMTUtMS4zMDQsMC4xNDYtMS44NjksMC4xNjJjLTAuMjkzLDAuMDA4LTAuNiwwLjAxMi0wLjg5NywwLjAxMmwtMS4wODQsMC4wMDJMOC40NDUsMzkuMTI1eiIvPjwvZz48L2c+PGc+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTM2LjE5Nyw5Ljk5N2gtMy41MzRWMy41OTRoMy4zOTJ2MC42ODRoLTIuNTc1djIuMDMzaDIuNDMydjAuNjg0aC0yLjQzMnYyLjMxOGgyLjcxN1Y5Ljk5N3ogTTM1Ljc3OSwyLjE0MWwtMS4yMjYsMS4xMTFoLTAuNjU2bDAuODkzLTEuMTExSDM1Ljc3OXoiLz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNNDAuOTA5LDUuNTQybC0wLjE4LDAuNjM3Yy0wLjI2Ni0wLjE0Ni0wLjU4LTAuMjE5LTAuOTQtMC4yMTljLTAuNSwwLTAuODkzLDAuMTc0LTEuMTc4LDAuNTIyYy0wLjI3MiwwLjMxNy0wLjQwOSwwLjcyNi0wLjQwOSwxLjIyNmMwLDAuNTIsMC4xNDYsMC45MzYsMC40MzcsMS4yNWMwLjI5MiwwLjMxMywwLjY2OCwwLjQ3LDEuMTMxLDAuNDdjMC4zMjksMCwwLjY1OS0wLjA3MywwLjk4OC0wLjIxOWwwLjEzMywwLjYyN2MtMC4zNDksMC4xNjUtMC43NzMsMC4yNDctMS4yNzMsMC4yNDdjLTAuNjg0LDAtMS4yMy0wLjIxMi0xLjYzOS0wLjYzNmMtMC40MDgtMC40MjQtMC42MTMtMC45OTEtMC42MTMtMS43MDFjMC0wLjcxNiwwLjIyMi0xLjMwMiwwLjY2NS0xLjc1N2MwLjQ0My0wLjQ1NiwxLjAyOS0wLjY4NCwxLjc1OC0wLjY4NEM0MC4yNDQsNS4zMDQsNDAuNjE4LDUuMzgzLDQwLjkwOSw1LjU0MnoiLz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNNDYuMzksNy42NmMwLDAuNzAzLTAuMTkzLDEuMjc5LTAuNTgsMS43MjljLTAuNDEyLDAuNDY5LTAuOTYzLDAuNzAzLTEuNjUzLDAuNzAzYy0wLjY2NSwwLTEuMTk3LTAuMjI4LTEuNTk2LTAuNjg0Yy0wLjM3NC0wLjQ0My0wLjU2MS0xLjAwMS0wLjU2MS0xLjY3MmMwLTAuNzAzLDAuMTkzLTEuMjc5LDAuNTgtMS43MjljMC40MTItMC40NjgsMC45NjMtMC43MDMsMS42NTMtMC43MDNjMC42NjUsMCwxLjE5NywwLjIyOCwxLjU5NiwwLjY4NEM0Ni4yMDMsNi40MjUsNDYuMzksNi45ODIsNDYuMzksNy42NnogTTQ1LjU0NCw3LjY4OGMwLTAuNDYyLTAuMTA3LTAuODU4LTAuMzIzLTEuMTg4Yy0wLjI0Ny0wLjM4Ni0wLjU4OS0wLjU4LTEuMDI2LTAuNThjLTAuNDUsMC0wLjc5OCwwLjE5My0xLjA0NSwwLjU4Yy0wLjIxNiwwLjMzLTAuMzIzLDAuNzMxLTAuMzIzLDEuMjA3YzAsMC40NTYsMC4xMTEsMC44NTIsMC4zMzMsMS4xODhjMC4yNDcsMC4zODYsMC41ODksMC41OCwxLjAyNiwwLjU4YzAuNDMxLDAsMC43NzMtMC4xOTYsMS4wMjYtMC41ODlDNDUuNDM0LDguNTQzLDQ1LjU0NCw4LjE0NSw0NS41NDQsNy42ODh6Ii8+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTUxLjcxOSw5Ljk5N2gtMC43MzFMNTAuOTQsOS4yNjZoLTAuMDI4Yy0wLjMxNywwLjU1MS0wLjgxMSwwLjgyNy0xLjQ4MiwwLjgyN2MtMC40MzEsMC0wLjc3OS0wLjEzMy0xLjA0NS0wLjM5OWMtMC4zMzYtMC4zNDItMC41MDQtMC44NzEtMC41MDQtMS41ODZWNS4zOTloMC44Mjd2Mi41NTZjMCwwLjk3NiwwLjMzMywxLjQ2MywwLjk5OCwxLjQ2M2MwLjI1MywwLDAuNDg0LTAuMDgyLDAuNjkzLTAuMjQ3YzAuMTc3LTAuMTM5LDAuMzA0LTAuMzEsMC4zOC0wLjUxM2MwLjA1LTAuMTI3LDAuMDc2LTAuMjY5LDAuMDc2LTAuNDI4VjUuMzk5aDAuODI3djMuMzQ0QzUxLjY4MSw5LjE1NSw1MS42OTQsOS41NzMsNTEuNzE5LDkuOTk3eiIvPjxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik01NS42ODksNi4wMjZoLTEuMTc3djIuNDk5YzAsMC41ODksMC4yMDYsMC44ODQsMC42MTcsMC44ODRjMC4xODQsMCwwLjM0Mi0wLjAxOSwwLjQ3NS0wLjA1N2wwLjAzOCwwLjYyN2MtMC4xOSwwLjA3LTAuNDM0LDAuMTA0LTAuNzMxLDAuMTA0Yy0wLjM4NiwwLTAuNjg2LTAuMTE1LTAuODk4LTAuMzQ3Yy0wLjIxMi0wLjIzMS0wLjMxOC0wLjYyNS0wLjMxOC0xLjE4M1Y2LjAyNmgtMC43MDNWNS4zOTloMC43MDNWNC41NTRsMC44MTctMC4yNDd2MS4wOTJoMS4xNzdWNi4wMjZ6Ii8+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTYwLjczNCw3LjQzMmMwLDAuMTY1LTAuMDEsMC4zMDEtMC4wMjgsMC40MDhoLTMuMTU0YzAuMDEzLDAuNTM5LDAuMTcxLDAuOTQ3LDAuNDc2LDEuMjI2YzAuMjY2LDAuMjQ3LDAuNjIzLDAuMzcxLDEuMDczLDAuMzcxYzAuNDU2LDAsMC44NjctMC4wNzYsMS4yMzUtMC4yMjhsMC4xNDMsMC41ODljLTAuNDEyLDAuMTg0LTAuOTEyLDAuMjc2LTEuNTAyLDAuMjc2Yy0wLjY4NCwwLTEuMjI0LTAuMjA5LTEuNjE5LTAuNjI3Yy0wLjM5Ni0wLjQxOC0wLjU5NC0wLjk3OS0wLjU5NC0xLjY4MmMwLTAuNzE2LDAuMTkxLTEuMzA2LDAuNTc0LTEuNzcyYzAuMzgzLTAuNDY1LDAuODk4LTAuNjk4LDEuNTQ0LTAuNjk4YzAuNjUyLDAsMS4xNDQsMC4yNSwxLjQ3MywwLjc1QzYwLjYwNyw2LjQzMiw2MC43MzQsNi44OTQsNjAuNzM0LDcuNDMyeiBNNTkuOTM3LDcuMjQyYzAuMDA2LTAuMzQ4LTAuMDY3LTAuNjQzLTAuMjE5LTAuODg0Yy0wLjE5Ni0wLjMxLTAuNDk3LTAuNDY1LTAuOTAyLTAuNDY1Yy0wLjM4LDAtMC42ODUsMC4xNTItMC45MTIsMC40NTZjLTAuMTg0LDAuMjQ3LTAuMjk4LDAuNTQ1LTAuMzQyLDAuODkzSDU5LjkzN3oiLz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNNjQuNDc3LDYuMTAyYy0wLjA4Mi0wLjAxMy0wLjE3Ny0wLjAxOS0wLjI4NC0wLjAxOWMtMC4zNzQsMC0wLjY2MiwwLjE1NS0wLjg2NCwwLjQ2NWMtMC4xODQsMC4yNzItMC4yNzUsMC42MDItMC4yNzUsMC45ODh2Mi40NmgtMC44MTdWNi44MTRjMC0wLjQ5NC0wLjAxMy0wLjk2Ni0wLjAzOC0xLjQxNmgwLjczMWwwLjAzOCwwLjg5M2gwLjAyOGMwLjEwMi0wLjMwNCwwLjI2OC0wLjU0NCwwLjQ5OS0wLjcyMmMwLjIzLTAuMTc3LDAuNDgyLTAuMjY2LDAuNzU2LTAuMjY2YzAuMDg4LDAsMC4xNjQsMC4wMDYsMC4yMjcsMC4wMTlWNi4xMDJ6Ii8+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTcxLjE1Niw4LjcxNGMwLDAuNDEyLTAuMTUyLDAuNzQzLTAuNDU3LDAuOTkzYy0wLjMwNCwwLjI1LTAuNzE5LDAuMzc1LTEuMjQ0LDAuMzc1Yy0wLjQ4OCwwLTAuOTA4LTAuMTAxLTEuMjY0LTAuMzA0bDAuMTk5LTAuNjI3YzAuMzQyLDAuMjE2LDAuNzAzLDAuMzIzLDEuMDg0LDAuMzIzYzAuNTg4LDAsMC44ODMtMC4yMjgsMC44ODMtMC42ODRjMC0wLjE5Ni0wLjA2My0wLjM1OC0wLjE4OS0wLjQ4NGMtMC4xMjctMC4xMjYtMC4zNDItMC4yNDctMC42NDYtMC4zNjFjLTAuODA1LTAuMzA0LTEuMjA3LTAuNzM4LTEuMjA3LTEuMzAyYzAtMC4zOCwwLjE0NS0wLjY5OCwwLjQzNC0wLjk1NWMwLjI4Ny0wLjI1NywwLjY2Ni0wLjM4NSwxLjEzNS0wLjM4NWMwLjQzNywwLDAuODA3LDAuMDkyLDEuMTExLDAuMjc1bC0wLjIwOSwwLjYwOGMtMC4yNzktMC4xNzctMC41ODYtMC4yNjYtMC45MjItMC4yNjZjLTAuMjM0LDAtMC40MTgsMC4wNTktMC41NTEsMC4xNzZzLTAuMTk5LDAuMjY4LTAuMTk5LDAuNDUxYzAsMC4xNzgsMC4wNjksMC4zMjMsMC4yMDksMC40MzdjMC4xMTMsMC4xMDgsMC4zMjksMC4yMjIsMC42NDYsMC4zNDJDNzAuNzYsNy42MzgsNzEuMTU2LDguMSw3MS4xNTYsOC43MTR6Ii8+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTc2LjQ5NCw5Ljk5N2gtMC43M2wtMC4wNDktMC43MzFoLTAuMDI3Yy0wLjMxNywwLjU1MS0wLjgxMiwwLjgyNy0xLjQ4MiwwLjgyN2MtMC40MzEsMC0wLjc3OS0wLjEzMy0xLjA0NS0wLjM5OWMtMC4zMzYtMC4zNDItMC41MDQtMC44NzEtMC41MDQtMS41ODZWNS4zOTloMC44MjZ2Mi41NTZjMCwwLjk3NiwwLjMzMywxLjQ2MywwLjk5OCwxLjQ2M2MwLjI1NCwwLDAuNDg0LTAuMDgyLDAuNjkzLTAuMjQ3YzAuMTc4LTAuMTM5LDAuMzA1LTAuMzEsMC4zODEtMC41MTNjMC4wNS0wLjEyNywwLjA3NS0wLjI2OSwwLjA3NS0wLjQyOFY1LjM5OWgwLjgyN3YzLjM0NEM3Ni40NTcsOS4xNTUsNzYuNDY5LDkuNTczLDc2LjQ5NCw5Ljk5N3oiLz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNODAuNTMxLDYuMTAyYy0wLjA4Mi0wLjAxMy0wLjE3Ny0wLjAxOS0wLjI4NC0wLjAxOWMtMC4zNzQsMC0wLjY2MiwwLjE1NS0wLjg2NCwwLjQ2NWMtMC4xODQsMC4yNzItMC4yNzUsMC42MDItMC4yNzUsMC45ODh2Mi40Nkg3OC4yOVY2LjgxNGMwLTAuNDk0LTAuMDEzLTAuOTY2LTAuMDM4LTEuNDE2aDAuNzMxbDAuMDM4LDAuODkzaDAuMDI4YzAuMTAyLTAuMzA0LDAuMjY4LTAuNTQ0LDAuNDk5LTAuNzIyYzAuMjMtMC4xNzcsMC40ODItMC4yNjYsMC43NTYtMC4yNjZjMC4wODgsMCwwLjE2NCwwLjAwNiwwLjIyNywwLjAxOVY2LjEwMnoiLz48L2c+PGc+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTg4LjMwNCwyMi40OTF2LTEuNjM1YzAtMi43NzksMS4xOTgtNC4xNDgsMy4wMzMtNC4xNDhjMS44MjYsMCwyLjc5MSwxLjM3OSwyLjc5MSwyLjg2NWgyLjk0OXYtMC4zMDdjMC0yLjgwMy0yLjE3NC01LjEzNy01Ljc1OS01LjEzN2MtMy44NDQsMC02LjEzNSwyLjQ4Mi02LjEzNSw2LjcxN3YxLjYzNWMwLDQuMjMyLDIuMjcxLDYuNjgzLDYuMTIxLDYuNjgzYzMuNjgzLDAsNS43NzItMi4zNjYsNS43NzItNC45OTd2LTAuMzE2aC0yLjk0OWMwLDEuNDk0LTAuOTQ1LDIuNzM0LTIuNzcsMi43MzRDODkuNDkyLDI2LjU4NSw4OC4zMDQsMjUuMjgsODguMzA0LDIyLjQ5MUw4OC4zMDQsMjIuNDkxeiBNNzguOTY5LDI4Ljg4N2gzLjA3NlYxNC40MDVoLTMuMDc2VjI4Ljg4N0w3OC45NjksMjguODg3eiBNNjcuODE3LDE4LjNjMC0xLjExMywwLjkyMy0xLjgxNCwyLjQwOC0xLjgxNGMxLjY3NywwLDIuNTE1LDAuOTQzLDIuNTg5LDEuOTYzaDIuODY0Yy0wLjAzMS0yLjU1Ny0yLjIwNS00LjM0LTUuNDQ0LTQuMzRjLTMuMDY0LDAtNS40ODMsMS41OC01LjQ4Myw0LjQyNmMwLDIuNDYxLDEuNjk2LDMuNjA1LDMuNzM0LDQuMDQxbDIuMTc0LDAuNWMxLjQ2NywwLjMyOCwyLjIwOSwwLjgwNywyLjIwOSwxLjc5MWMwLDEuMTI3LTAuOTEzLDEuODkzLTIuNjIyLDEuODkzYy0xLjgzNCwwLTIuOC0wLjk1Ny0yLjg4NS0yLjAyOUg2NC40MWMwLjA0NCwyLjA0NywxLjQyMiw0LjQzNSw1LjY4OCw0LjQzNWMzLjU4NywwLDUuODA0LTEuNzQ5LDUuODA0LTQuNTk1YzAtMi42MzEtMS43OTQtMy42NTgtMy45MTYtNC4xMTdsLTIuMTk1LTAuNDg2QzY4LjQ5NSwxOS43LDY3LjgxNywxOS4xMzgsNjcuODE3LDE4LjNMNjcuODE3LDE4LjN6IE02MS44MDcsMjMuOTc4di05LjU3MmgtMy4wNjV2OS4xNDZjMCwxLjk0MS0xLjE1NiwzLjAxNi0yLjg1NCwzLjAxNmMtMS43MDksMC0yLjg2NS0xLjA2Mi0yLjg2NS0zLjAxNnYtOS4xNDZoLTMuMDU1djkuNTcyYzAsMy4wODYsMi4yMjgsNS4xODcsNS45Miw1LjE4N0M1OS41NjksMjkuMTY0LDYxLjgwNywyNy4wNjMsNjEuODA3LDIzLjk3OEw2MS44MDcsMjMuOTc4eiBNNDQuMjAzLDI4Ljg4N2gyLjc3VjE0LjQwNWgtMy4xMTlsLTQuMDAxLDguOTc3aC0wLjA5NmwtNC04Ljk3N2gtMy4xNDF2MTQuNDgxaDIuNzM2di05LjM3OGgwLjEyOWwzLjM0Miw3LjQ0OWgxLjkyMmwzLjMzLTcuNDQ5aDAuMTI4VjI4Ljg4N0w0NC4yMDMsMjguODg3eiBNMjYuODksMjIuOTc5Yy0wLjg2Ni0wLjg0Ni0xLjMwNy0xLjg4OS0xLjMxOS0zLjEzM2MtMC4wMjctMS42MTEsMC42ODMtMi44NjcsMi4xMjctMy43NjhjLTAuODE0LTEuMTY0LTIuMDE3LTEuODE2LTMuNjA0LTEuOTYzYy0wLjU2NS0wLjA1My0xLjI4NywwLjA4LTIuMTY1LDAuMzk4Yy0wLjk0NiwwLjM0Mi0xLjQ3OSwwLjUxNC0xLjU5OCwwLjUxNGMtMC4yNDksMC0wLjcyOS0wLjE0NS0xLjQzOC0wLjQzNmMtMC43MDgtMC4yOTEtMS4zMTItMC40MzgtMS44MTEtMC40MzhjLTAuODQxLDAuMDE0LTEuNjIzLDAuMjQyLTIuMzQ1LDAuNjg2Yy0wLjcyMywwLjQ0MS0xLjMsMS4wNDctMS43MzMsMS44MTRjLTAuNTUyLDAuOTUxLTAuODI3LDIuMDg4LTAuODI3LDMuNDEyYzAsMS4xODgsMC4yMDMsMi4zNzcsMC42MTEsMy41NjZjMC4zOCwxLjEzNywwLjg2NywyLjEzNywxLjQ1NywyLjk5NmMwLjUyNCwwLjc3OSwwLjk4NiwxLjM0NywxLjM3OSwxLjcwMmMwLjU2NSwwLjU1NSwxLjE0MywwLjgyMiwxLjczMywwLjc5M2MwLjM4MS0wLjAxMiwwLjg3OS0wLjE1MiwxLjQ5OC0wLjQxNmMwLjU3Ny0wLjI1LDEuMTU1LTAuMzc3LDEuNzMyLTAuMzc3YzAuNTM5LDAsMS4wOTgsMC4xMjcsMS42NzQsMC4zNzdjMC42NDMsMC4yNjQsMS4xNjksMC4zOTYsMS41NzUsMC4zOTZjMC42MDQtMC4wMjUsMS4xNy0wLjI4MywxLjY5NS0wLjc3M2MwLjE4NC0wLjE1OCwwLjM4NC0wLjM3NywwLjYtMC42NTRjMC4yMTctMC4yNzYsMC40NTctMC42MDYsMC43Mi0wLjk4OWMwLjE4NC0wLjI3OSwwLjM2My0wLjU3NiwwLjU0Mi0wLjg5M2MwLjE3Ny0wLjMxOCwwLjMzOS0wLjY1NCwwLjQ4Mi0xLjAxNGMwLjA2NS0wLjE0MywwLjEyNS0wLjI5MywwLjE3OC0wLjQ0M2MwLjA1Mi0wLjE1MiwwLjEwNC0wLjMwNywwLjE1Ny0wLjQ2NUMyNy43MjQsMjMuNjYxLDI3LjI4MywyMy4zNjIsMjYuODksMjIuOTc5TDI2Ljg5LDIyLjk3OXogTTIzLjA4OCwxMi41MTFjMC42OTYtMC44NTksMS4wNDUtMS43ODUsMS4wNDUtMi43NzdjMC0wLjA2NCwwLTAuMTMxLDAtMC4xOTVjMC0wLjA2OC0wLjAwOC0wLjEzNS0wLjAyMS0wLjE5OWMtMC40ODUsMC4wMjUtMS4wMDEsMC4xNzgtMS41NDYsMC40NTVzLTAuOTk0LDAuNjI5LTEuMzQ5LDEuMDUxYy0wLjcwOCwwLjgzNC0xLjA2NCwxLjcyNS0xLjA2NCwyLjY3NmMwLDAuMDY4LDAsMC4xMzEsMCwwLjE4OWMwLDAuMDYxLDAuMDA2LDAuMTIzLDAuMDIxLDAuMTg5QzIxLjI2MywxNC4wMDUsMjIuMjM1LDEzLjU0MiwyMy4wODgsMTIuNTExTDIzLjA4OCwxMi41MTF6Ii8+PC9nPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48L3N2Zz4=';

    cssBlock.innerText = cssContent;

    document.head.appendChild(cssBlock); // Add CSS to Head

    function getScore(element, url) {

        var xhr = new XMLHttpRequest();

        xhr.addEventListener('readystatechange', function() {

            if (xhr.readyState == 4 && xhr.status == 200) {

                var rating = xhr.responseText.match(/\"display\_rating\"\:\"(\d{1,2}\.\d)\"/)[1];

                if (rating.match(/\.0$/)) {

                    rating = rating.replace(/\.0$/, '');
                }

                var score = document.createElement('span');

                score.classList.add('grease-score');

                score.innerText = rating;

                element.classList.remove('grease-loading');

                element.classList.add('grease-scored');

                if (element.querySelector('.review__meta-bnm') && element.querySelector('.review .review__meta-bnm').innerText.match(/best\snew\salbum/i)) {

                    element.classList.add('grease-bnm');

                }

                element.querySelector('a').appendChild(score);

                setTimeout(function() { score.style.opacity = '1'; }, 100);

            } // End of IF XHR State 4 responds 200

        }); // End of Event Listener ReadyStateChange

        xhr.open('GET', url, true);

        xhr.send();

    } // End of Function getScore

    function getItunesAlbumLink(artist, album, element) {

        var url = 'https://itunes.apple.com/search?term=' + artist + '+' + album + '&country=FR&media=music&entity=album';

        GM_xmlhttpRequest({

            method: 'GET',

            url: url,

            onload: function(response) {

                var data = JSON.parse(response.responseText);

                if (data.resultCount > 0) {

                    var artistURL = data.results[0].artistViewUrl;

                    var albumURL = data.results[0].collectionViewUrl;

                    albumURL = albumURL.replace(/^https/, 'itms');

                    var itunesLink = document.createElement('a');

                    itunesLink.setAttribute('onclick', 'return window.open(\'' + albumURL + '\', \'_parent\');');

                    itunesLink.classList.add('grease-itunes-link');

                    itunesLink.innerHTML = '<img src="'  + listenAppleMusicLogo + '" alt="Écouter sur Apple Music"/>';

                    element.appendChild(itunesLink);

                    setTimeout(function() { itunesLink.classList.add('show'); }, 100);

                }

                else {

                    element.setAttribute('data-search-url-failed', url);

                }

            }

        });

    } // End of Function getItunesAlbumLink

    function getReviewScoreAndItunesLink() {

        var reviews = document.querySelectorAll('.review');

        var windowHeight = window.innerHeight;

        var offset = 100;

        for (var i = 0; i < reviews.length; i++) {

            if (!reviews[i].classList.contains('grease-added') && reviews[i].getBoundingClientRect().top <= (windowHeight - offset)) {

                reviews[i].classList.add('grease-added');

                var artist = reviews[i].querySelector('.review__title-artist > li').innerText.trim();

                artist = artist.replace(/\s/, '+');

                var album = reviews[i].querySelector('h2.review__title-album').innerText.trim();

                album = album.replace(/LP|EP$/i, '');

                album = album.replace(/\s/, '+');

                if (!reviews[i].classList.contains('grease-loading') && !reviews[i].classList.contains('grease-scored')) {

                    reviews[i].classList.add('grease-loading');

                    var url = reviews[i].querySelector('a').href;

                    getScore(reviews[i], url);

                    getItunesAlbumLink(artist, album, reviews[i]);

                } // End of If This Contains Class "grease-loading" && "grease-scored"

            } // End of If This Contains Class "grease-added" && Review in viewport

        } // End of Loop For Reviews

    } // End of Function getReviewScoreAndItunesLink

    setInterval(getReviewScoreAndItunesLink, 500);

})();