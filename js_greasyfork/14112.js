// ==UserScript==
// @name         Deezer Analytics
// @namespace    com.deezer.analytics
// @version      1.19
// @description  Extended information for Deezer
// @author       panthera.p
// @match        http://www.deezer.com/*
// @match        https://www.deezer.com/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @resource     Chartist https://cdnjs.cloudflare.com/ajax/libs/chartist/0.9.7/chartist.min.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/chartist/0.9.7/chartist.min.js
// @downloadURL https://update.greasyfork.org/scripts/14112/Deezer%20Analytics.user.js
// @updateURL https://update.greasyfork.org/scripts/14112/Deezer%20Analytics.meta.js
// ==/UserScript==

(function(w, d, $, x)
 {
    var settings = {
        APP_ID: null,
        ACCESS_TOKEN: null,
        PROFILE_ID: null
    };

    var core = {
        variables: {
            ajaxQueue: [],
            ajaxIsRunning: false,
            infoBox: null,
            cache: {},
            callback: {
                change: [],
                timer: []
            },
            lastUrl: null,
            updateTokenInterval: null
        },
        init: function()
        {
            /*jshint multistr: true */
            GM_addStyle(" \
.deezer-icon-favorite { background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ5Mi43MTkgNDkyLjcxOSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDkyLjcxOSA0OTIuNzE5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij48Zz48ZyBpZD0iSWNvbnNfMThfIj48cGF0aCBkPSJNNDkyLjcxOSwxNjYuMDA4YzAtNzMuNDg2LTU5LjU3My0xMzMuMDU2LTEzMy4wNTktMTMzLjA1NmMtNDcuOTg1LDAtODkuODkxLDI1LjQ4NC0xMTMuMzAyLDYzLjU2OSAgICBjLTIzLjQwOC0zOC4wODUtNjUuMzMyLTYzLjU2OS0xMTMuMzE2LTYzLjU2OUM1OS41NTYsMzIuOTUyLDAsOTIuNTIyLDAsMTY2LjAwOGMwLDQwLjAwOSwxNy43MjksNzUuODAzLDQ1LjY3MSwxMDAuMTc4ICAgIGwxODguNTQ1LDE4OC41NTNjMy4yMiwzLjIyLDcuNTg3LDUuMDI5LDEyLjE0Miw1LjAyOWM0LjU1NSwwLDguOTIyLTEuODA5LDEyLjE0Mi01LjAyOWwxODguNTQ1LTE4OC41NTMgICAgQzQ3NC45ODgsMjQxLjgxMSw0OTIuNzE5LDIwNi4wMTcsNDkyLjcxOSwxNjYuMDA4eiIgZmlsbD0iI0ZGRkZGRiIvPjwvZz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+); background-repeat:no-repeat; background-size:10px 10px; background-position:5px center; } \
.deezer-icon-genre { background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+PHBhdGggZD0iTTQ3NS43NjMsNi45MjFjLTcuNjY4LTYuMDg2LTE3LjY0MS04LjMxMi0yNy4xNDktNi4wNjJMMTc3LjA0Niw2NC44NTdjLTE0LjQ1NywzLjM5OC0yNC4yNDIsMTYuMjk3LTI0LjI0MiwzMS4xNDh2MjI5LjU3NyAgYy0xMS0zLjU0OS0yMS4xNjgtNS41OC0zMi40MDYtNS41OGMtNTMuMDE5LDAtOTYuMjAyLDQyLjk4LTk2LjIwMiw5NS45OTlTNjYuOTgxLDUxMiwxMjAsNTEyczk1LjgwNC00Mi45OCw5NS44MDQtOTUuOTk5VjIzMy4zNDcgIGwyMDgtNDguOTQxdjEwOS4xNzZjLTEwLTMuNTQ5LTIwLjY2OS01LjU4LTMxLjkwOC01LjU4Yy01My4wMTksMC05NS45NTMsNDIuOTgtOTUuOTUzLDk1Ljk5OVMzMzguODU1LDQ4MCwzOTEuODc0LDQ4MCAgczk1LjkzLTQyLjk4LDk1LjkzLTk1Ljk5OVYzMi4wMDZDNDg3LjgwNCwyMi4yMzMsNDgzLjQyNywxMi45OTEsNDc1Ljc2Myw2LjkyMXogTTIxNS44MDQsMTY3LjYwMnYtNDYuMjUzbDIwOC00OC45Mzd2NDYuMjQ5ICBMMjE1LjgwNCwxNjcuNjAyeiIgZmlsbD0iI0ZGRkZGRiIvPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjwvc3ZnPg==); background-repeat:no-repeat; background-size:12px 12px; background-position:5px center; } \
.deezer-icon-global { background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiIHZpZXdCb3g9IjAgMCA5NDkuMyA5NDkuMyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgOTQ5LjMgOTQ5LjM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBkPSJNODk5LjMsMzM4LjFMNTQ0LDMzNy43YzAsMCwyMC42LTg0LjMsMjQuMy0xMjMuOGMyLjUtMjcsMy4xMDEtNTMuOS0zLjEtODAuNWMtOS4yLTQwLTE5LjUtNjUtMzUuOS05NiAgIEM1MjAuNSwyMSw1MDMuNSwxMC44LDQ4NSwxMC44aC02OC44Yy0yNy43LDAtNTAuMTAxLDIyLjUtNTAsNTAuMmMwLjIsNDYuMywwLjIsMTA4LjEtMC44LDExMC4yQzMzOC40LDIyOCwzMDcuMSwyODIuNSwyNzEuOCwzMzQuNSAgIGMtMTYuMSwyMy44LTMzLDQ2LjktNTIuNiw2OGMtOC42LDkuMi0xMy4zLDIxLjQtMTMuMywzMy45djQzNy4yMDFjMCwxMi44OTgsNSwyNS4zOTgsMTQsMzQuNjk5ICAgYzEzLjQsMTMuODAxLDM3LjQsMzAuMTk5LDc2LjgsMzAuMTk5YzEyNC4zLTAuNSwzMjUuNy0xLjYsNDY4Ljg5OS0wLjZjMTcuOSwwLjEsMzQuNS05LjI5OSw0My41LTI0Ljc5OUw5MzUuNCw2OTYuOSAgIGM4LjYtMTUsMTMuMS0zMiwxMy4xOTktNDkuMjk5bDAuNy0yNTkuMzAxQzk0OS4zLDM2MC42LDkyNi45LDMzOC4yLDg5OS4zLDMzOC4xeiIgZmlsbD0iI0ZGRkZGRiIvPjxwYXRoIGQ9Ik05NC44LDQwOS41SDUwYy0yNy42LDAtNTAsMjIuNC01MCw1MHY0MjljMCwyNy42MDIsMjIuNCw1MCw1MCw1MGg0NC43YzI3LjYsMCw1MC0yMi4zOTgsNTAtNTB2LTQyOSAgIEMxNDQuOCw0MzEuOSwxMjIuNCw0MDkuNSw5NC44LDQwOS41eiIgZmlsbD0iI0ZGRkZGRiIvPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48L3N2Zz4=); background-repeat:no-repeat; background-size:12px 12px; background-position:5px center; } \
.deezer-icon-social { background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI1Ljk2IDI1Ljk2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyNS45NiAyNS45NjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+PGc+PGc+PHBhdGggZD0iTTExLjg5NiwxNy4xNWMtMC4xMzEtMC4wNDMtMC45NTMtMC44ODctMC40MzktMi40NzRIMTEuNDVjMS4zNC0xLjQwMSwyLjQ4Ny0zLjY1NSwyLjQ4Ny01Ljg3NiAgICBjMC0zLjQxMi0yLjM1OS01LjIwMS00Ljk1Ny01LjIwMWMtMi42LDAtNC44NTUsMS43ODktNC44NTUsNS4yMDFjMCwyLjIyOSwxLjA1MSw0LjQ5MiwyLjM5OCw1Ljg5MiAgICBjMC41MjUsMS4zOTgtMC40MTQsMi4zODQtMC42MTEsMi40NThDMy4xOTIsMTguMTQ4LDAsMTkuOTcsMCwyMS43NjdjMCwwLjQ4NSwwLDAuMTkxLDAsMC42NzRjMCwyLjQ0OSw0LjY3NywzLjAwNiw5LjAwNiwzLjAwNiAgICBjNC4zMzQsMCw4Ljk1My0wLjU1Nyw4Ljk1My0zLjAwNmMwLTAuNDgyLDAtMC4xODgsMC0wLjY3NEMxNy45NTksMTkuOTE1LDE0Ljc1MSwxOC4xMDksMTEuODk2LDE3LjE1eiIgZmlsbD0iI0ZGRkZGRiIvPjwvZz48Zz48cGF0aCBkPSJNMjAuMjU5LDEyLjY1MWMtMC4xMjItMC4wNDEtMC44OTYtMC4yMy0wLjQxMy0xLjcyM0gxOS44NGMxLjI2LTEuMzE2LDIuMTI5LTMuNDM4LDIuMTI5LTUuNTIzICAgIGMwLTMuMjA5LTIuMDEtNC44OTEtNC40NTItNC44OTFjLTEuNzk4LDAtMy4zNDcsMC45MTgtNC4wNDIsMi42NzhjMS40NTksMS4yMDUsMi40NjMsMy4wODEsMi40NjMsNS42MDcgICAgYzAsMi42OTctMS4yNjQsNS4xNTgtMi41ODYsNi43NDZjMi4xMDYsMC43OTcsNS4zOTcsMi40LDYuMzM5LDQuODVjMy4zMTgtMC4xODQsNi4yNjktMC44NzMsNi4yNjktMi43NzFjMC0wLjQ1MywwLTAuMTc3LDAtMC42MzMgICAgQzI1Ljk1OSwxNS4yNTEsMjIuOTQzLDEzLjU1MiwyMC4yNTksMTIuNjUxeiIgZmlsbD0iI0ZGRkZGRiIvPjwvZz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+); background-repeat:no-repeat; background-size:10px 10px; background-position:5px center; } \
.deezer-icon-play { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABFElEQVRYheXXsStFYRgH4CtKopDJpIzKoMyKxV9gUkaTksmkjBaDUQZlNSgZ7JJBWRVlFYO6yYC6j+Hcb3LCPefc8w5+9c2/p773++ptNNrBCE7RxCcuMd+oK9jwPS0cYqwOwG4OIOUJy5GAlAtMRQLgAzvojwKk3GEhEkA2pEeqGNKCgJRHrEQCUs4wEQmAN2yiNwqQcoPZSADZl76HoShAygMWIwFkT/YAw1GAlHuMRwJg618Dwq4gdAivMRPxDF+xjr4fy7sEOMfkr8VdADxj6c/FFQJa2Mdox+UVAG4xV6i4JOAd2xgoVV4QcIXp0sUFAE2soqey8g4Ax/K+0RoAtaxmaznFtS6ngzjBS/vUsp5/AYRZv/U6zVdUAAAAAElFTkSuQmCC'); background-repeat:no-repeat; background-size:10px 10px; background-position:5px center; } \
.deezer-icon-album { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACfklEQVRYhb3XyW+NURgG8KtCDI1xQTWIKa0h8QdYGZZCbCxE/wJDSrGSWFjZmGKKGIqwNaRFkEYiIcVOwoKIYdNGDIlWlcrP4js3Pjffvd+5t+pNzuac932e537vcO4pFCINU9CCC3iMHnwKqwfdaMdmTI7FjSFeiosYEG8DQeji4RDX4yiGAugXnMQGzMDnCCE/cRjjqyVvwvMA8hlbMLHE530VX+QxGmLJl6M3BHZiVhm/F1UIgHdYlke+UFJQcAKjK/g+qVJAUcTMcoAT8Cw4/kBLBfJReFCDAHiEcVmgBzOcL0u1FObgOD7WSF60/aXkTZKKzbLXWIE9+IbvuIZWrA2rFdcxGCmgT7oocTYysAPzKqRmAW5FYp0oBk1Cf0TAIdSFmEbsxqWwdgndgjrJ/MizPtQXsCnC+UaKvFWSilLrx7aUiJsRuBsLOJPjNIj5KfI8K4pYJOmmSnaqgKc5TlcD4Gx///J2rArrQmq/H40h5kYOdncBH3Kctgaw3am9SxkFeCV13hb2tudg9xbkt866ANae2luZIWB16rw97K3Pwf5eq4DVGQLWpM7PVyMgLwVbAlhbai8vBTuqSUF3jlNHAGvw97woV4R9mBFi8obSw9g2XFRDGzaLbMOYQXRXuJrFDaLR6IrA3VjNKD4ifhQfi8BLRnEIir2MOtGccQ8VcZbgdiTW6XRgpeu41IYkKdnhz3W8E/fwKxJjEAtK1Wf9IRkpO5D1+cbi/n8g78KYcjmcjlcjSP4S08vVUFHEMrwdAfI3WFqRPCVimqTQ/pXdwdQo8pKa2IuvwyAewD7lch4ppEEyrqt9nJ7D3JqJM4RkPc+Hwqr5ef4bS36vBfCJzJ4AAAAASUVORK5CYII='); background-repeat:no-repeat; background-size:10px 10px; background-position:5px center; } \
.deezer-icon-track { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABoklEQVRYhe3Xv0sXcRzHcQvFzCESnKJsjpZ+iEPaEIJLbuKiRBC0BEVLRA45GJi4ONVqDUGNron+B64qWBSEUBYkQoXho+FCvx33/d7nc9+7Jl/z5/16Poe7z72vpaXioB1DeIb32MI8WquEnsQYXmNbdsbLhp7FXSxitw60NtPNAlsxiDlsBADTmSkKPoNZfCwAbU4Al/GtSXAxAbRhrSR4IYErJcILCYwXBP3GMu7jXjMCNyKgP7CAW+hO9XypSmBT8koO4liDns9lCqxjGv04GthTisAqroVCqxDojQWXLdCdP3EocCiw//3oldwNfej4LwI4h5fY8W++O1hWqhHATfySn/IFMIq9AHhjAckmex2Tkqv2EWYaCUhWtE+BcHiaBW7DAwcPSr1kCQxEwOFOuuA43gYOZwkMR8B/4lS64FVEQZbAacnyEZKJ9PDFCDicqPPsTOXM7f09cyQ9+DACvpkFr+m6jQ+pmV28wYV6Q48jBJ40Eqjp7MElnEd73uGrgfAVdIYIRAfPc+AL6KoEXiMxgiV8lfwBvcMLDFXF/AM5bxpiusPCUgAAAABJRU5ErkJggg=='); background-repeat:no-repeat; background-size:10px 10px; background-position:5px center; } \
.deezer-icon-artist { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxUlEQVQ4jaXSQUpCQRyA8dkmD1sLhnSAvIbQEQKjVe50lUcItFPUFYw6iCBtggzcCSLYtl+beSA2vMbXB//FDPN98IcJIQHO8YR5nEd0Um9TcoFPv/lAIyfQT8glVzmBSUXgPicwrQhMcgI3FYHrnECBVUJe4uTPQIxc4mtP3qGXK5/iAmcY4BZtdNGsEhsYY41vzOJ5jOd4t8adw/+AVtwxlyVa+4GHI+SSaSk3sa0R2KAIGNWQS4YBb/8ILAJe8V5zXn4A0H2MXcPWFCMAAAAASUVORK5CYII='); background-repeat:no-repeat; background-size:10px 10px; background-position:5px center; } \
.deezer-icon-social-big { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC0UlEQVRYhbWW34tNURTH14wG5bcXIw9+dEfpNnPPWZ+1zzXGw4S8kAdcvKAYL4R/gMmPB+VH8SZKSpI8CW+UKPIj8iJJKYQkUaKZMXM9zLl1XMe5Z5uZXevprLW+n7XX2mdvkVFchUJhgpl1mdl6M1sDTBvN/JnLzLYD74Fqwn4CJwqFwoQxFQd664Tr7bqINI+JeBRFC4H+BgBVM9vyXwKdnZ0zVXWjmR0ADgFbS6XSnNr3jo6OScCtRgDAfV/tJmAP8C0lWR9wvNbbIAimAx8aAPSJSFNu9bjizKpU9arEvTWzLTl2Id+pcM4FwGCOhFVV3SEiArQAnzN8+yXvIAKn8ojH9jSxaxcy/F7n3n5VfegBMFgsFifH4Psz/M7kBgDeeABUgyBoi+N6MvxW+QA89wEol8uz4ri9//B5kFtcRMTMbnoA/JT4eJnZ0bThc84t8QIA9nkA3EjEXUv5fsRLXETEOVf0ANgqItLV1TWF4cun/piu9QbIqKbeXgItIiJmtjnNR1Vvq+ri/wFQYCALQFU3iIhUKpVxOQb3GdBTqVTG+UDszEh4suZnZts8WvYUWOoDUf/IqAJDxP/1KIrmk35hZdkgcDgvwIuUBN8lPnpBELSZ2bm0AWxkqrorUzwMw1JcbVqCctLXOdeqqqcbzU2dvUsVLpVKc4CDwKeM4I9Ab/JxIiKiqos87pJffwg751qB855VDKjqJefcglqeYrE4HrjYKNbM7tVimoDdwFffPiasDzjW3d09Mc7ZDFzP8H8SRdHC2kPiygiE66t6VC6Xp8YDPBv4kWjZHeBwGIbLa0P8rwtkpHY52dbErvy9gC9jADDU3t4+I+uEJQF8Bi63hWE4Ny/A3TEAeCt5n+BBEMwDHo+i+CtVJZd4YjWr6mrgLMO3lk9bhhi+li+a2abMgcu7gJYgCNpUdZlzboWZrQMqCVvpnFsBtI9U8DfK9pKa719G+wAAAABJRU5ErkJggg=='); background-repeat:no-repeat; background-size:20px 20px; background-position:5px center; } \
.deezer-icon-favorite-big { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAByElEQVRYhc2XsWsUQRSHX3IQPIhWClqIf8CocO97wzGskCsUtEszYKuNIggKQv6FdNpolFS2J4IJIgS01160kWAV7UxULhARbW5lPe7W7OVuxx+88s33LQ/ezIr8jwFOANeBVaALPAaWvffnY4yNUX0xxoaZXQCW+z1dYNXMrnnvj/8T3Gq1jgErwB7wa0RtqeoVEZkptM6Y2VXgU0nfHnAfODoUrqpngY8lBwzWhnNuPsuyw2b2skLfppmdHvzyU8DnCofk9Rp4M0bflvf+ZHHmr8Y45KC1ISIi3vuFBPC8zomZPUoo8ECAdwkF3grwNaHAtgDfEwp8E+B90hGY2dOEAl0xs8sJBaK02+0jwHYC+Bfn3Hy+Ce/ULWBmt/+s4hBCE9isUeBDp9M5NOw27NUA7wFnRl3Jt2oQuFn6KAHuTXHud0vh/cxOaTc8EZHZ/QiIc27OzNYnBVfVNefc3L7gRQlVXZuAwLPK8DwhhKaqvjgA/HkIoTkWPE+MsaGqD8eAr5Q94SsHWKoAX5oYeEDiBvCzBPyj/88wvQCLwO4Q+C6wOFV4HjO7xN9ru6eqF2uBFyQyYAfYMbOsVnhBouO9X0gCn1R+A3ZlGm2HugmiAAAAAElFTkSuQmCC'); background-repeat:no-repeat; background-size:20px 20px; background-position:5px center; } \
\
");
            GM_addStyle(GM_getResourceText("Chartist"));

            $("html").addClass("deezer");
            settings.APP_ID = w.localStorage.getItem("deezer-appid") || w.prompt("Enter you \"Application ID\" from \"http://developers.deezer.com/myapps\". When creting an application, write \"www.deezer.com\" as \"Application domain\".");
            if (settings.APP_ID === null)
                return;
            else
                w.localStorage.setItem("deezer-appid", settings.APP_ID);

            settings.PROFILE_ID = x.USER.USER_ID;

            core.createToken();

            setTimeout(core.load, 2000);
        },
        load: function()
        {
            setInterval(core.updateToken, 3600000);
            setInterval(core.cache, 600000);
            setInterval(core.doAjax, 100);
            setInterval(core.changeEvent, 1000);
            setInterval(core.timerEvent, 5000);

            core.createInfo();
            core.cache();

            album.init();
            cover.init();
            hearthis.init();
            profile.init();
        },
        changeEvent: function()
        {
            if (core.variables.lastUrl != d.location.href)
            {
                setTimeout(function()
                           {
                    for (var i = 0; i < core.variables.callback.change.length; i++)
                        core.variables.callback.change[i].call(null);
                }, 2000);
            }
        },
        timerEvent: function()
        {
            for (var i = 0; i < core.variables.callback.timer.length; i++)
                core.variables.callback.timer[i].call(null);
        },
        createToken: function()
        {
            settings.ACCESS_TOKEN = w.localStorage.getItem("deezer-access-token") || null;

            if (d.location.hash && d.location.hash.indexOf("access_token") > -1)
            {
                var access_token = d.location.hash.match(/access_token=([^&]+)/i)[1];
                settings.ACCESS_TOKEN = access_token;
                w.localStorage.setItem("deezer-access-token", access_token);
                core.updateToken();
            }
            else if (settings.ACCESS_TOKEN === null)
            {
                d.location.href = w.location.protocol + "//connect.deezer.com/oauth/auth.php?app_id=" + settings.APP_ID + "&redirect_uri=" + (w.location.protocol == "http:" ? "http://goo.gl/dD16FJ" : "https://goo.gl/PL2AFN") + "&perms=basic_access,listening_history&response_type=token";
            }
            else
            {
                core.updateToken();
            }
        },
        updateToken: function(fnFinish)
        {
            $("#UpdateToken").remove();

            var iframe = $('<iframe/>')
            .attr("id", "UpdateToken")
            .css({
                top: -10000,
                left: -10000,
                position: "absolute",
            })
            .attr("src", w.location.protocol + "//connect.deezer.com/oauth/auth.php?app_id=" + settings.APP_ID + "&redirect_uri=" + (w.location.protocol == "http:" ? "http://goo.gl/dD16FJ" : "https://goo.gl/PL2AFN") + "&perms=basic_access,listening_history&response_type=token")
            .appendTo("body");

            clearInterval(core.variables.updateTokenInterval);
            var attempts = 0;
            core.variables.updateTokenInterval = setInterval(function()
                                                             {
                var updateTokenDocument = utils.document($("#UpdateToken"));

                if (updateTokenDocument != null)
                {
                    if (attempts > 10)
                    {
                        $("#UpdateToken").remove();
                        w.localStorage.removeItem("deezer-access-token");
                        core.createToken();
                        return;
                    }

                    if (updateTokenDocument !== null && updateTokenDocument.location && updateTokenDocument.location.hash && updateTokenDocument.location.hash.length > 0 && updateTokenDocument.location.hash.match(/access_token=([^&]+)/i) !== null)
                    {
                        clearInterval(core.variables.updateTokenInterval);

                        var access_token = updateTokenDocument.location.hash.match(/access_token=([^&]+)/i)[1];
                        settings.ACCESS_TOKEN = access_token;
                        w.localStorage.setItem("deezer-access-token", access_token);
                        $("#UpdateToken").remove();

                        if (fnFinish)
                            fnFinish();
                    }
                    else if (utils.document($("#UpdateToken")) !== null && utils.document($("#UpdateToken")).querySelector("body").innerHTML.indexOf("ERR_") > -1)
                    {
                        $("#UpdateToken").remove();
                    }
                }
                else
                    $("#UpdateToken").remove();

                attempts++;
            }, 1000);
        },
        createInfo: function()
        {
            core.variables.infoBox = $('<div/>')
                .addClass("nav-link")
                .attr("id", "DeezerInfo")
                .text("Loading...")
                .appendTo("#menu_navigation > div");
        },
        cache: function()
        {
            if (settings.PROFILE_ID !== null && settings.ACCESS_TOKEN !== null)
            {
                core.queueAjax("Albums...", w.location.protocol + "//api.deezer.com/user/" + settings.PROFILE_ID + "/albums", function(data) { core.variables.cache.albums = data; });
                core.queueAjax("Artists...", w.location.protocol + "//api.deezer.com/user/" + settings.PROFILE_ID + "/artists", function(data) { core.variables.cache.artists = data; });
                core.queueAjax("Followings...", w.location.protocol + "//api.deezer.com/user/" + settings.PROFILE_ID + "/followings", function(data) { core.variables.cache.followings = data; core.cacheFollowings(); });
                core.queueAjax("Favorites...", w.location.protocol + "//api.deezer.com/user/" + settings.PROFILE_ID + "/tracks", function(data) { core.variables.cache.favorites = data; });
                core.queueAjax("History...", w.location.protocol + "//api.deezer.com/user/" + settings.PROFILE_ID + "/history", function(data) { core.variables.cache.history = data; });
            }
        },
        cacheFollowings: function()
        {
            if (core.variables.cache.followings)
            {
                core.variables.cache.followingsDetail = {};

                var addToAjax = function(profileid, name)
                {
                    core.variables.cache.followingsDetail[profileid] = JSON.parse(w.localStorage.getItem("deezer-cache-followings-" + profileid)) || {};
                    if (!w.localStorage.getItem("deezer-cache-followings-" + profileid) || Math.round(new Date().getTime() / 1000) - (w.localStorage.getItem("deezer-cache-followings-" + profileid + "-timestamp") || Math.round(new Date(2000, 0, 1).getTime() / 1000)) > 86400)
                    {
                        core.queueAjax("Albums (" + name + ")...", w.location.protocol + "//api.deezer.com/user/" + profileid + "/albums", function(data) { core.variables.cache.followingsDetail[profileid].albums = data.map(function(a) { return a.id; }); });
                        core.queueAjax("Artists (" + name + ")...", w.location.protocol + "//api.deezer.com/user/" + profileid + "/artists", function(data) { core.variables.cache.followingsDetail[profileid].artists = data.map(function(a) { return a.id; }); });
                        core.queueAjax("Favorites (" + name + ")...", w.location.protocol + "//api.deezer.com/user/" + profileid + "/tracks", function(data)
                                       {
                            core.variables.cache.followingsDetail[profileid].favorites = data.map(function(a) { return { album: a.album.id, track: a.id }; });
                            w.localStorage.setItem("deezer-cache-followings-" + profileid, JSON.stringify(core.variables.cache.followingsDetail[profileid]));
                            w.localStorage.setItem("deezer-cache-followings-" + profileid + "-timestamp", Math.round(new Date().getTime() / 1000));
                        });
                    }
                };

                for (var i = 0; i < core.variables.cache.followings.length; i++)
                    addToAjax(core.variables.cache.followings[i].id, core.variables.cache.followings[i].name);
            }
        },
        queueAjax: function(info, url, fn, data)
        {
            core.variables.ajaxQueue.push({ info: info, url: url, fn: fn, data: data || [] });
        },
        doAjax: function()
        {
            if (core.variables.ajaxQueue.length > 0 && !core.variables.ajaxIsRunning)
            {
                core.variables.ajaxIsRunning = true;
                var ajaxItem = core.variables.ajaxQueue.splice(0, 1)[0];
                core.variables.infoBox.text(ajaxItem.info + " (+" + core.variables.ajaxQueue.length + ")");

                GM_xmlhttpRequest({
                    url: ajaxItem.url + "?limit=10000&access_token=" + settings.ACCESS_TOKEN,
                    onload: function(data)
                    {
                        if (data.responseText.indexOf("OAuthException") == -1)
                        {
                            var json = JSON.parse(data.responseText);
                            if (json.data)
                            {
                                ajaxItem.data = ajaxItem.data.concat(json.data);
                                if (json.next)
                                    core.variables.ajaxQueue.push({ info: ajaxItem.info, url: json.next, fn: ajaxItem.fn, data: ajaxItem.data });
                                else
                                    ajaxItem.fn.call(null, ajaxItem.data);
                            }
                            else
                                ajaxItem.fn.call(null, json);

                            if (core.variables.ajaxQueue.length === 0)
                                core.variables.infoBox.text("...");

                            core.variables.ajaxIsRunning = false;
                        }
                        else if (data.responseText.indexOf("OAuthException") > -1)
                        {
                            ajaxItem.fn.call(null, null);
                            if (data.responseText.indexOf("private") == -1)
                            {
                                setTimeout(function()
                                           {
                                    core.variables.ajaxQueue.push(ajaxItem);
                                    core.variables.ajaxIsRunning = false;
                                }, 10000);
                            }
                            else
                            {
                                core.variables.ajaxIsRunning = false;
                            }
                        }
                    },
                    onerror: function(error)
                    {
                        alert(error);
                    }
                });
            }
        }
    };

    var album = {
        variables: {
            albumScoreMyChart: null,
            albumScoreFriendsChart: null
        },
        init: function()
        {
            /*jshint multistr: true */
            GM_addStyle(" \
#AlbumRating { position:absolute; left:270px; top:120px; } \
#AlbumFriendsRating { position:absolute; left:530px; top:120px; } \
#AlbumFriendsCount { position:absolute; left:790px; top:120px; width:50px; height:40px; line-height:40px; text-align:center; padding-left:30px; font-weight:bold; color:#333333; font-size:16px; } \
div.deezer-albumrating { width:220px; height:40px; line-height:40px; text-align:center; padding-left:30px; } \
span.deezer-albumrating-counter { font-weight:bold; color:#333333; font-size:16px; } \
div.deezer-albumrating-meter { position:absolute; bottom:0; left:0; right:0; height:3px; background-color:#aaaaaa; } \
#AlbumRating div.deezer-albumrating-meter-fill { position:absolute; top:0; left:0; height:3px; background-color:#67a91f; } \
#AlbumFriendsRating div.deezer-albumrating-meter-fill { position:absolute; top:0; left:0; height:3px; background-color:#ede045; } \
span.deezer-album-track-rating { background-color:#67a91f; padding:2px 5px 2px 20px; color:#ffffff; margin-right:10px; border-radius:2px; font-weight:bold; } \
span.deezer-album-track-rating.deezer-album-track-inactive { background-color:#666666; } \
span.deezer-album-track-friendscount { background-color:#2e9ac2; padding:2px 5px 2px 20px; color:#ffffff; margin-right:10px; border-radius:2px; font-weight:bold; } \
span.deezer-album-track-friendscount.deezer-album-track-inactive { background-color:#666666; } \
div.album-headings { position:relative; } \
#DeezerAlbumScoreMyCanvas { position:absolute; top:70px; z-index:10; } \
#DeezerAlbumScoreMyCanvas .ct-series-a .ct-slice-pie { fill: #66bf31; } \
#DeezerAlbumScoreMyCanvas .ct-series-b .ct-slice-pie { fill: #eeeeee; } \
#DeezerAlbumScoreMyRating { position:absolute; top:125px; left:65px; font-weight:bold; z-index:11; } \
#DeezerAlbumScoreFriendsCanvas { position:absolute; top:70px; left:120px; z-index:10; } \
#DeezerAlbumScoreFriendsCanvas .ct-series-a .ct-slice-pie { fill: #2e9ac2; } \
#DeezerAlbumScoreFriendsCanvas .ct-series-b .ct-slice-pie { fill: #eeeeee; } \
#DeezerAlbumScoreFriendsRating { position:absolute; top:125px; left:185px; font-weight:bold; z-index:11; } \
");
            core.variables.callback.change.push(album.updateFriends);
            core.variables.callback.change.push(album.updateScore);
            core.variables.callback.change.push(album.updateTracks);
            core.variables.callback.timer.push(album.updateScore);
            core.variables.callback.timer.push(album.updateTracks);
        },
        calculateRating: function(tracksNumber, totalTracks)
        {
            var rating = Math.pow(tracksNumber, 1 + Math.pow(totalTracks, -0.7)) / totalTracks;
            return rating > 1.0 ? 1.0 : rating;
        },
        updateScore: function()
        {
            if ($("#page_naboo_album").length == 1)
            {
                var lovedTracks = $("#page_naboo_album span.icon-love.active").length;
                var allTracks = $("#page_naboo_album span.icon-love").length;

                var rating = album.calculateRating(lovedTracks, allTracks);

                var albumScoreCanvas = $("#DeezerAlbumScoreMyCanvas");
                if (albumScoreCanvas.length === 0)
                {
                    albumScoreCanvas = $('<div id="DeezerAlbumScoreMyCanvas"></div>').appendTo("div.album-headings");
                    albumScoreRating = $('<div id="DeezerAlbumScoreMyRating"></div>').text(Math.round(rating * 100) + '%').appendTo("div.album-headings");
                    album.variables.albumScoreMyChart = new Chartist.Pie("#DeezerAlbumScoreMyCanvas", {
                        labels: [' ', ' '],
                        series: [Math.round(rating * 100), Math.round((1 - rating) * 100)]
                    }, {
                        width: '75px',
                        height: '75px'
                    });
                }
                else
                {
                    $("#DeezerAlbumScoreMyRating").text(Math.round(rating * 100) + '%');
                    album.variables.albumScoreMyChart.update({
                        labels: [' ', ' '],
                        series: [Math.round(rating * 100), Math.round((1 - rating) * 100)]
                    });
                }
            }
        },
        updateFriends: function()
        {
            if ($("#page_naboo_album").length == 1 && core.variables.cache.albums && core.variables.cache.favorites && core.variables.cache.followings && core.variables.cache.followingsDetail)
            {
                var id = d.location.href.match(/^.+\/album\/([\d]+)(\/.*)?$/)[1];
                var allTracks = $("#page_naboo_album span.icon-love").length;
                var friendsTotal = 0;
                var friendsRating = 0.0;
                var friendsRatingCount = 0;

                for (var j = 0; j < core.variables.cache.followings.length; j++)
                {
                    if (core.variables.cache.followingsDetail[core.variables.cache.followings[j].id] && core.variables.cache.followingsDetail[core.variables.cache.followings[j].id].albums)
                    {
                        var friendsAlbum = core.variables.cache.followingsDetail[core.variables.cache.followings[j].id].albums.filter(function(a) { return a == id; });
                        friendsTotal += friendsAlbum.length;

                        if (core.variables.cache.followingsDetail[core.variables.cache.followings[j].id].favorites)
                        {
                            var friendsFavorites = core.variables.cache.followingsDetail[core.variables.cache.followings[j].id].favorites.filter(function(a) { return a.album == id; });
                            if (friendsFavorites.length > 0)
                            {
                                friendsRating += album.calculateRating(friendsFavorites.length, allTracks);
                                friendsRatingCount++;
                            }
                        }
                    }
                }

                var ratingFavorites = (friendsRatingCount > 0 ? friendsRating / friendsRatingCount : 0);
                var ratingAlbums = friendsTotal / core.variables.cache.followings.length;
                var rating = ratingFavorites + ratingAlbums > 1 ? 1 : ratingFavorites + ratingAlbums;

                var albumScoreCanvas = $("#DeezerAlbumScoreFriendsCanvas");
                if (albumScoreCanvas.length === 0)
                {
                    albumScoreCanvas = $('<div id="DeezerAlbumScoreFriendsCanvas"></div>').appendTo("div.album-headings");
                    albumScoreRating = $('<div id="DeezerAlbumScoreFriendsRating"></div>').text(Math.round(rating * 100) + '%').appendTo("div.album-headings");
                    album.variables.albumScoreFriendsChart = new Chartist.Pie("#DeezerAlbumScoreFriendsCanvas", {
                        labels: [' ', ' '],
                        series: [Math.round(rating * 100), Math.round((1 - rating) * 100)]
                    }, {
                        width: '75px',
                        height: '75px'
                    });
                }
                else
                {
                    $("#DeezerAlbumScoreFriendsRating").text(Math.round(rating * 100) + '%');
                    album.variables.albumScoreFriendsChart.update({
                        labels: [' ', ' '],
                        series: [Math.round(rating * 100), Math.round((1 - rating) * 100)]
                    });
                }
            }
        },
        updateTracks: function()
        {
            if ($("#page_naboo_album").length == 1 && core.variables.cache.history)
            {
                var tracks = $("table.datagrid-table tbody tr.song");
                for (var i = 0; i < tracks.length; i++)
                {
                    var track = tracks.eq(i);
                    var trackid = track.attr("data-key");

                    var ratingElement = track.find("span.deezer-album-track-rating");
                    var friendsCountElement = track.find("span.deezer-album-track-friendscount");
                    if (ratingElement.length === 0)
                    {
                        friendsCountElement = $('<span/>')
                            .addClass("deezer-album-track-friendscount deezer-icon-favorite")
                            .prependTo(track.find("td.track div.wrapper"));
                        ratingElement = $('<span/>')
                            .addClass("deezer-album-track-rating deezer-icon-play")
                            .prependTo(track.find("td.track div.wrapper"));
                    }

                    var friendsTotal = 0;
                    for (var j = 0; j < core.variables.cache.followings.length; j++)
                    {
                        if (core.variables.cache.followingsDetail[core.variables.cache.followings[j].id] && core.variables.cache.followingsDetail[core.variables.cache.followings[j].id].favorites)
                        {
                            var friendsTracks = core.variables.cache.followingsDetail[core.variables.cache.followings[j].id].favorites.filter(function(a) { return a.track == trackid; });
                            friendsTotal += friendsTracks.length;
                        }
                    }

                    var trackCount = core.variables.cache.history.filter(function(a) { return a.id == trackid; }).length;
                    ratingElement.text(trackCount);
                    if (trackCount === 0)
                        ratingElement.addClass("deezer-album-track-inactive");
                    else
                        ratingElement.removeClass("deezer-album-track-inactive");
                    friendsCountElement.text(friendsTotal);
                    if (friendsTotal === 0)
                        friendsCountElement.addClass("deezer-album-track-inactive");
                    else
                        friendsCountElement.removeClass("deezer-album-track-inactive");
                }
            }
        }
    };

    var hearthis = {
        init: function()
        {
            /*jshint multistr: true */
            GM_addStyle(" \
section.card-edito-track { display:none; } \
section.card-radio { display:none; } \
section.card-algo-playlist { display:none; } \
section.card-edito-playlist { display:none; } \
section.card-auto-promo { display:none; } \
section.card-sponsor { display:none; } \
section.card-trending { display:none; } \
");
        }
    };

    var profile = {
        init: function()
        {
            /*jshint multistr: true */
            GM_addStyle(" \
#page_profile div.user-section { display:none; } \
");
        }
    };

    var cover = {
        init: function()
        {
            /*jshint multistr: true */
            GM_addStyle(" \
span.sent-to-mobile { display:none; } \
div.deezer-profile-album-cover { position:absolute; z-index:11; top:0; left:0; right:0; padding-left:0px; padding-right:0px; background-color:rgba(100, 180, 41, 0.9); } \
div.deezer-profile-album-cover * { font-size:9px; color:#ffffff; font-family:'Open Sans',Arial,sans-serif; letter-spacing:1px; } \
div.deezer-profile-album-info { height:20px; position:relative; } \
span.deezer-profile-album-globalcount { position:absolute; display:inline-block; left:0; width:40%; top:0; bottom:0; line-height:20px; padding-left:23px; box-sizing:border-box; overflow:hidden; white-space:nowrap; } \
span.deezer-profile-album-friendscount { position:absolute; display:inline-block; left:40%; width:30%; top:0; bottom:0; line-height:20px; padding-left:23px; box-sizing:border-box; overflow:hidden; white-space:nowrap; } \
span.deezer-profile-album-rating { position:absolute; display:inline-block; left:70%; width:30%; top:0; bottom:0; line-height:20px; padding-left:23px; box-sizing:border-box; overflow:hidden; white-space:nowrap; } \
div.deezer-profile-album-genre { height:20px; position:relative; } \
span.deezer-profile-album-genre-item { opacity:0; position:absolute; display:inline-block; line-height:20px; left:23px; top:0; bottom:0; right:0; font-size:11px; transition:opacity linear 500ms; } \
span.deezer-profile-album-genre-item-visible { opacity:1; } \
\
div.thumbnail .sticker { bottom:60px; } \
\
div.deezer-profile-fan-cover { position:absolute; z-index:11; height:45px; bottom:0; left:0; right:0; padding-left:0px; padding-right:0px; background-color:rgba(52, 147, 192, 0.9); } \
div.deezer-profile-fan-cover * { font-size:9px; color:#ffffff; font-family:'Open Sans',Arial,sans-serif; letter-spacing:1px; } \
div.deezer-profile-fan-album { position:absolute; top:0; left:5px; right:10px; display:inline-block; line-height:15px; padding-left:23px; } \
div.deezer-profile-fan-artist { position:absolute; top:15px; left:5px; right:10px; display:inline-block; line-height:15px; padding-left:23px; } \
div.deezer-profile-fan-favorites { position:absolute; top:30px; left:5px; right:10px; display:inline-block; line-height:15px; padding-left:23px; } \
");

            if (!core.variables.cache.fans)
                core.variables.cache.fans = {};
            if (!core.variables.cache.albumsDetail)
                core.variables.cache.albumsDetail = {};

            core.variables.callback.change.push(cover.album);
            core.variables.callback.change.push(cover.fans);

            setInterval(cover.switchAlbumGenre, 2000);
        },
        album: function()
        {
            if (core.variables.cache.albums && core.variables.cache.favorites && core.variables.cache.followings && core.variables.cache.followingsDetail)
            {
                var albumElements = $(".thumbnail-grid a[href^='/album/']").not(".deezer-ignore");

                var loadAlbum = function(id, name)
                {
                    var createElement = function(id)
                    {
                        var figure = $(".thumbnail-grid a[href='/album/" + id + "']").closest(".thumbnail-col").find("figure");
                        var albumItem = core.variables.cache.albumsDetail[id];
                        if (!albumItem) return;
                        var favoriteItems = core.variables.cache.favorites.filter(function(a) { return a.album.id == id; });
                        var rating = album.calculateRating(favoriteItems.length, albumItem.nb_tracks);

                        var friendsTotal = 0;
                        var friendsRating = 0.0;
                        var friendsRatingCount = 0;
                        for (var j = 0; j < core.variables.cache.followings.length; j++)
                        {
                            if (core.variables.cache.followingsDetail[core.variables.cache.followings[j].id] && core.variables.cache.followingsDetail[core.variables.cache.followings[j].id].albums)
                            {
                                var friendsAlbum = core.variables.cache.followingsDetail[core.variables.cache.followings[j].id].albums.filter(function(a) { return a.id == id; });
                                friendsTotal += friendsAlbum.length;

                                if (core.variables.cache.followingsDetail[core.variables.cache.followings[j].id].favorites)
                                {
                                    var friendsFavorites = core.variables.cache.followingsDetail[core.variables.cache.followings[j].id].favorites.filter(function(a) { return a.album.id == id; });
                                    if (friendsFavorites.length > 0)
                                    {
                                        friendsRating += album.calculateRating(friendsFavorites.length, albumItem.nb_tracks);
                                        friendsRatingCount++;
                                    }
                                }
                            }
                        }

                        var cover = $('<div/>')
                        .addClass("deezer-profile-album-cover")
                        .appendTo(figure);

                        if (albumItem.genres.data.length > 0)
                        {
                            var genres = $('<div/>')
                            .addClass("deezer-profile-album-genre deezer-icon-genre")
                            .appendTo(cover);

                            for (var k = 0; k < albumItem.genres.data.length; k++)
                            {
                                $('<span/>')
                                    .addClass("deezer-profile-album-genre-item")
                                    .addClass(k === 0 ? "deezer-profile-album-genre-item-visible" : "")
                                    .text(albumItem.genres.data[k].name)
                                    .appendTo(genres);
                            }
                        }

                        var coverInfo = $('<div/>')
                        .addClass("deezer-profile-album-info")
                        .appendTo(cover);

                        $('<span/>')
                            .addClass("deezer-profile-album-globalcount deezer-icon-global")
                            .text(utils.numberWithCommas(albumItem.fans))
                            .appendTo(coverInfo);
                        $('<span/>')
                            .addClass("deezer-profile-album-friendscount deezer-icon-social")
                            .addClass(friendsTotal === 0 ? "deezer-profile-album-inactive" : "")
                            .text(friendsTotal)
                            .appendTo(coverInfo);
                        $('<span/>')
                            .addClass("deezer-profile-album-rating deezer-icon-favorite")
                            .addClass(rating === 0 ? "deezer-profile-album-inactive" : "")
                            .text(Math.round(rating * 100) + "%")
                            .appendTo(coverInfo);


                    };

                    if (!core.variables.cache.albumsDetail[id])
                    {
                        core.queueAjax("Album (" + name + ")...", w.location.protocol + "//api.deezer.com/album/" + id, function(data)
                                       {
                            core.variables.cache.albumsDetail[id] = data;
                            createElement(id);
                        });
                    }
                    else
                        createElement(id);
                };
                for (var i = 0; i < albumElements.length; i++)
                {
                    albumElements.eq(i).addClass("deezer-ignore");

                    if (albumElements.eq(i).attr("href").match(/\/album\/([\d]+)/) != null)
                        loadAlbum(albumElements.eq(i).attr("href").match(/\/album\/([\d]+)/)[1], albumElements.eq(i).text());
                }
            }
        },
        switchAlbumGenre: function()
        {
            var genres = $("span.deezer-profile-album-genre-item-visible");
            for (var i = 0; i < genres.length; i++)
            {
                var genre = genres.eq(i);
                genre.removeClass("deezer-profile-album-genre-item-visible");
                if (genre.next("span.deezer-profile-album-genre-item").length === 0)
                    genre.parent().children().eq(0).addClass("deezer-profile-album-genre-item-visible");
                else
                    genre.next("span.deezer-profile-album-genre-item").addClass("deezer-profile-album-genre-item-visible");
            }
        },
        fans: function()
        {
            if (core.variables.cache.albums && core.variables.cache.artists && core.variables.cache.fans)
            {
                var fans = $(".thumbnail-grid a[href^='/profile/']").not(".deezer-ignore");

                var loadFan = function(fanElement, id, name)
                {
                    var renderFan = function(id)
                    {
                        if (!core.variables.cache.fans[id].albums || !core.variables.cache.fans[id].artists || !core.variables.cache.fans[id].favorites)
                        {
                            fanElement.removeClass("deezer-ignore");
                            return;
                        }

                        var figure = fanElement.closest(".thumbnail-col").find("figure");
                        var mineAlbums = core.variables.cache.albums.map(function(a) { return a.id; });
                        var fanAlbums = core.variables.cache.fans[id].albums.map(function(a) { return a.id; });
                        var intersectAlbums = mineAlbums.filter(function(a) { return fanAlbums.indexOf(a) > -1; }).length;
                        var mineArtists = core.variables.cache.artists.map(function(a) { return a.id; });
                        var fanArtists = core.variables.cache.fans[id].artists.map(function(a) { return a.id; });
                        var intersectArtists = mineArtists.filter(function(a) { return fanArtists.indexOf(a) > -1; }).length;
                        var mineFavorites = core.variables.cache.favorites.map(function(a) { return a.id; });
                        var fanFavorites = core.variables.cache.fans[id].favorites.map(function(a) { return a.id; });
                        var intersectFavorites = mineFavorites.filter(function(a) { return fanFavorites.indexOf(a) > -1; }).length;

                        var cover = $('<div/>')
                        .addClass("deezer-profile-fan-cover")
                        .appendTo(figure);

                        $('<div/>')
                            .addClass("deezer-profile-fan-album deezer-icon-album")
                            .addClass(intersectAlbums === 0 ? "deezer-fan-inactive" : "")
                            .text((intersectAlbums > 0 ? Math.round(intersectAlbums / mineAlbums.length * 100) : 0) + "% (" + intersectAlbums + " of " + fanAlbums.length + ")")
                            .appendTo(cover);
                        $('<div/>')
                            .addClass("deezer-profile-fan-artist deezer-icon-artist")
                            .addClass(intersectArtists === 0 ? "deezer-fan-inactive" : "")
                            .text((intersectArtists > 0 ? Math.round(intersectArtists / mineArtists.length * 100) : 0) + "% (" + intersectArtists + " of " + fanArtists.length + ")")
                            .appendTo(cover);
                        $('<div/>')
                            .addClass("deezer-profile-fan-favorites deezer-icon-track")
                            .addClass(intersectFavorites === 0 ? "deezer-fan-inactive" : "")
                            .text((intersectFavorites > 0 ? Math.round(intersectFavorites / mineFavorites.length * 100) : 0) + "% (" + intersectFavorites + " of " + fanFavorites.length + ")")
                            .appendTo(cover);
                    };

                    if (!core.variables.cache.fans[id])
                    {
                        core.variables.cache.fans[id] = {
                            albums: [],
                            artists: []
                        };
                        core.queueAjax("Fan albums (" + name + ")...", w.location.protocol + "//api.deezer.com/user/" + id + "/albums", function(data)
                                       {
                            core.variables.cache.fans[id].albums = data || [];
                        });
                        core.queueAjax("Fan artists (" + name + ")...", w.location.protocol + "//api.deezer.com/user/" + id + "/artists", function(data)
                                       {
                            core.variables.cache.fans[id].artists = data || [];
                        });
                        core.queueAjax("Fan favorites (" + name + ")...", w.location.protocol + "//api.deezer.com/user/" + id + "/tracks", function(data)
                                       {
                            core.variables.cache.fans[id].favorites = data || [];
                            renderFan(id);
                        });
                    }
                    else
                        renderFan(id);
                };

                for (var i = 0; i < fans.length; i++)
                {
                    fans.eq(i).addClass("deezer-ignore");

                    if (fans.eq(i).attr("href").match(/\/profile\/([\d]+)/) != null)
                        loadFan(fans.eq(i), fans.eq(i).attr("href").match(/\/profile\/([\d]+)/)[1], fans.eq(i).text());
                }
            }
        }
    };

    var utils = {
        numberWithCommas: function (number)
        {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        isCrossDomain: function(iframeElement)
        {
            // check if passed argument is String or Iframe element
            iframeElement = typeof iframeElement === "string" ? form.find(id) : iframeElement;
            iframeElement = iframeElement instanceof $ ? iframeElement.get(0) : (iframeElement[0] || iframeElement);

            try
            {
                var x = iframeElement.contentWindow.document;
                return false;
            }
            catch (e)
            {
                return true;
            }
        },
        document: function (iframeElement)
        {
            if (iframeElement !== null)
            {
                try
                {
                    iframeElement = iframeElement instanceof $ ? iframeElement.get(0) : (iframeElement[0] || iframeElement);
                    return utils.isCrossDomain(iframeElement) ? null : (iframeElement.contentDocument || iframeElement.contentWindow.document);
                }
                catch (e)
                {
                    return null;
                }
            }
            else
                return null;
        },
        window: function (iframeElement)
        {
            if (iframeElement !== null)
            {
                try
                {
                    iframeElement = iframeElement instanceof $ ? iframeElement.get(0) : (iframeElement[0] || iframeElement);
                    return utils.isCrossDomain(iframeElement) ? null : iframeElement.contentWindow;
                }
                catch (e)
                {
                    return null;
                }
            }
            else
                return null;
        }
    };

    if (d.location.href.indexOf("appcache") == -1)
    {
        core.init();
    }
})(window, document, jQuery, unsafeWindow);
