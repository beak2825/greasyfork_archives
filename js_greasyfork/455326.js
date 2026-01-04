// ==UserScript==
// @name         fsfb script
// @namespace    http://tampermonkey.net/
// @homepage     https://greasyfork.org/scripts/446564/
// @version      1.6.3
// @description  An agma.io script, which includes fastsplit, secret bot packs, linesplit lock, and many other amazing features!
// @author       fishy & firebone
// @match        *://agma.io/*
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJhIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNTE1IDUxNSI+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJiIiBjeD0iMjg2LjgiIGN5PSIxMDYiIGZ4PSIyODYuOCIgZnk9IjEwNiIgcj0iMTEzLjI4NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2VmNDYzMCIvPjxzdG9wIG9mZnNldD0iLjEyNSIgc3RvcC1jb2xvcj0iI2VjNGUzMSIvPjxzdG9wIG9mZnNldD0iLjI1IiBzdG9wLWNvbG9yPSIjZTk1ZDM1Ii8+PHN0b3Agb2Zmc2V0PSIuNTIxIiBzdG9wLWNvbG9yPSIjZTk4MjM2Ii8+PHN0b3Agb2Zmc2V0PSIuOSIgc3RvcC1jb2xvcj0iI2ZjYzczOSIvPjxzdG9wIG9mZnNldD0iLjk4MSIgc3RvcC1jb2xvcj0iI2YxZDIzNSIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJjIiBjeD0iMzIxLjIiIGN5PSIxMzMuMiIgZng9IjMyMS4yIiBmeT0iMTMzLjIiIHI9IjM5LjUyNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2U3NDQyZSIvPjxzdG9wIG9mZnNldD0iLjEyNSIgc3RvcC1jb2xvcj0iI2U1NGMyZiIvPjxzdG9wIG9mZnNldD0iLjI1IiBzdG9wLWNvbG9yPSIjZTM1YjMzIi8+PHN0b3Agb2Zmc2V0PSIuNTIxIiBzdG9wLWNvbG9yPSIjZTk4MjM2Ii8+PHN0b3Agb2Zmc2V0PSIuOSIgc3RvcC1jb2xvcj0iI2ZjYzczOSIvPjxzdG9wIG9mZnNldD0iLjk4MSIgc3RvcC1jb2xvcj0iI2ZjYzg0OSIvPjwvcmFkaWFsR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJkIiB4MT0iMTg4LjE0NiIgeTE9IjIzMi41NDYiIHgyPSIxNTMuNDc5IiB5Mj0iMjU3LjA3OSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UzNDIyZSIvPjxzdG9wIG9mZnNldD0iLjExNyIgc3RvcC1jb2xvcj0iI2UyNGEyZiIvPjxzdG9wIG9mZnNldD0iLjI1IiBzdG9wLWNvbG9yPSIjZTI1YjMzIi8+PHN0b3Agb2Zmc2V0PSIuNTIxIiBzdG9wLWNvbG9yPSIjZTk4MjM2Ii8+PHN0b3Agb2Zmc2V0PSIuOSIgc3RvcC1jb2xvcj0iI2ZjYzczOSIvPjxzdG9wIG9mZnNldD0iLjk4MSIgc3RvcC1jb2xvcj0iI2ZjYzg0OSIvPjwvbGluZWFyR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJlIiBjeD0iMTA1LjMzMyIgY3k9IjI2Ni42NjciIGZ4PSIxMDUuMzMzIiBmeT0iMjY2LjY2NyIgcj0iMjcwLjMwNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjExIiBzdG9wLWNvbG9yPSIjZmNjODQ5Ii8+PHN0b3Agb2Zmc2V0PSIuMTE0IiBzdG9wLWNvbG9yPSIjZmNjNzQ3Ii8+PHN0b3Agb2Zmc2V0PSIuMTczIiBzdG9wLWNvbG9yPSIjZmNjNzNjIi8+PHN0b3Agb2Zmc2V0PSIuMjM2IiBzdG9wLWNvbG9yPSIjZmNjNzM5Ii8+PHN0b3Agb2Zmc2V0PSIuNjEyIiBzdG9wLWNvbG9yPSIjZTk4MjM2Ii8+PHN0b3Agb2Zmc2V0PSIuNzgzIiBzdG9wLWNvbG9yPSIjZTk1ZDM1Ii8+PHN0b3Agb2Zmc2V0PSIuODgyIiBzdG9wLWNvbG9yPSIjZWU1NzM0Ii8+PHN0b3Agb2Zmc2V0PSIuODg2IiBzdG9wLWNvbG9yPSIjZWM1NjMzIi8+PHN0b3Agb2Zmc2V0PSIuOTE2IiBzdG9wLWNvbG9yPSIjZTU1MjJmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZTQ1MTJlIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImYiIGN4PSIzNzAiIGN5PSIzMTIuMTMzIiBmeD0iMzcwIiBmeT0iMzEyLjEzMyIgcj0iMzguOTQyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZDk0MDJiIi8+PHN0b3Agb2Zmc2V0PSIuMTE3IiBzdG9wLWNvbG9yPSIjZGE0ODJkIi8+PHN0b3Agb2Zmc2V0PSIuMjUiIHN0b3AtY29sb3I9IiNkZDU5MzIiLz48c3RvcCBvZmZzZXQ9Ii41MjEiIHN0b3AtY29sb3I9IiNlOTgyMzYiLz48c3RvcCBvZmZzZXQ9Ii45IiBzdG9wLWNvbG9yPSIjZmNjNzM5Ii8+PHN0b3Agb2Zmc2V0PSIuOTgxIiBzdG9wLWNvbG9yPSIjZmNjODQ5Ii8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImciIGN4PSIzODEuMiIgY3k9IjI1OCIgZng9IjM4MS4yIiBmeT0iMjU4IiByPSIxMTMuNjAzIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZWY0NjMwIi8+PHN0b3Agb2Zmc2V0PSIuMTI1IiBzdG9wLWNvbG9yPSIjZWM0ZTMxIi8+PHN0b3Agb2Zmc2V0PSIuMjUiIHN0b3AtY29sb3I9IiNlOTVkMzUiLz48c3RvcCBvZmZzZXQ9Ii40IiBzdG9wLWNvbG9yPSIjZTk4MjM2Ii8+PHN0b3Agb2Zmc2V0PSIuNDExIiBzdG9wLWNvbG9yPSIjZTk4NDM2Ii8+PHN0b3Agb2Zmc2V0PSIuNTM2IiBzdG9wLWNvbG9yPSIjZjFhMTM3Ii8+PHN0b3Agb2Zmc2V0PSIuNjYiIHN0b3AtY29sb3I9IiNmN2I2MzgiLz48c3RvcCBvZmZzZXQ9Ii43ODIiIHN0b3AtY29sb3I9IiNmYWMyMzgiLz48c3RvcCBvZmZzZXQ9Ii45IiBzdG9wLWNvbG9yPSIjZmNjNzM5Ii8+PHN0b3Agb2Zmc2V0PSIuOTgxIiBzdG9wLWNvbG9yPSIjZmNjODQ5Ii8+PC9yYWRpYWxHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImgiIHgxPSIyNjkuOTQ0IiB5MT0iMjg3LjM0NSIgeDI9IjI2MC41MzciIHkyPSIyODkuMTE1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjN2U0NzBjIi8+PHN0b3Agb2Zmc2V0PSIuOTk2IiBzdG9wLWNvbG9yPSIjNWYyZjAwIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImkiIHgxPSIzMzkuNTU2IiB5MT0iMjMzLjgwMSIgeDI9IjMyMi4yMjIiIHkyPSIxNzEuNDY4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZTlhZTM1Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmVkNTczIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImoiIHgxPSIyNTQuNDk3IiB5MT0iMTExLjkzNiIgeDI9IjIwMC4xNjQiIHkyPSIxODYuNjAzIiB4bGluazpocmVmPSIjaSIvPjwvZGVmcz48cmVjdCB3aWR0aD0iNTE1IiBoZWlnaHQ9IjUxNSIgcng9IjEwMCIgcnk9IjEwMCIgc3R5bGU9ImZpbGw6Izc1MmIxNjsiLz48cGF0aCBkPSJNMTUwLjYyMiw0NTkuOTU2YzAsOC41MzMsMjEyLjI2NywxMS4yLDIxMi4yNjcsMHMtMjEyLjI2Ny0xMi44LTIxMi4yNjcsMFoiIHN0eWxlPSJmaWxsOiM0ZTFmMTQ7IG9wYWNpdHk6Ljk7Ii8+PHBhdGggZD0iTTI2NS44NjcsNDYuOTMzczMzLjgwMSwxOS4zMzMsMzMuODAxLDQ1LjczM2MwLDMzLjYtMzIuMzM0LDQxLjQ2Ny01MC42MDEsNTYuNzM0LDAsMC00OS43MzMsMzkuNDY3LTM3LjczMyw5My42LDAsMC00MC4yNjctMzcuOTc5LTE1LjkxMS05MS40OSwxMi44LTM5LjY0NCw3Ni45NzgtNjMuNjQ0LDc2Ljk3OC04OC44ODksMCwwLDEuMTU2LTIuNC02LjUzMy0xNS42ODlaIiBzdHlsZT0iZmlsbDp1cmwoI2IpOyIvPjxwYXRoIGQ9Ik0zMjAuOCwxMjUuMmMxNS40LDE1LjQsMzAuMjY3LTEzLjMzMywyNy40NjctMTkuNDY3LTguNjY3LTMuMzMzLTI2LjgtNi4xMzMtMjcuNDY3LDE5LjQ2N1oiIHN0eWxlPSJmaWxsOnVybCgjYyk7Ii8+PHBhdGggZD0iTTE5Mi4zMzQsMjQ5LjczM2MtNy45MzQsMTEuODY3LTM4LjczNCwxOS4zMzMtNDYuNjAxLTguNTMzLDQuNDkxLTQuMzUsMTYuOTU3LTkuNjYxLDI3Ljg2OC05LjQxMiw5LjgyMywuMjI0LDE4LjM4NSwzLjk1MywxOC43MzMsMTcuOTQ1WiIgc3R5bGU9ImZpbGw6dXJsKCNkKTsiLz48cGF0aCBkPSJNMjI3LjcxNSwyNTMuNjhjLTEyLTczLjM3OCw1Ni4zODQtMTA2LjI1OCw5MC44MjgtMTEwLjQ4LDAsMC0zMy41MTEsMjYuNDg5LTMzLjUxMSw2My4wMjJzMzcuNiw2OC44LDM3LjYsNjguOGMwLDAsNDUuMzMzLDMzLjg2Nyw0NS4zMzMsODYuOTMzcy00Mi4zMTEsOTguMjIyLTExMS40MzMsOTguMjIyLTk2LjAzMy01MC44NDQtMTAwLjMtNjAuOTc4Yy00LjI2Ny0xMC4xMzMtMzguNzU2LTE2LTM4Ljc1Ni0xNiwwLDAsMy43MzMtMzQuMzExLDMzLjQyMi01Ni41MzMsMTcuNTExLTUwLjU1NSw1MS43MTgtNjcuOTg3LDc2LjgxNi03Mi45ODYsNi40OTktMS4yOTQsMTIuNDAyLTEuNjgsMTcuMjI4LTEuNjgsMTUuNjQ0LDMuOTExLDE4Ljg0NCw2NS44OSwxOC44NDQsNjUuODksMCwwLTMyLjcxMSwzLjc5OS00NS4zMzMtMi40MjMsOS43NzgsMTEuOTExLDQwLjg4OSwxNC43NTYsNDAuODg5LDE0Ljc1Ni0uNTMzLDIzLjExMS00MS42LDM5LjQ2Ny0zNS4yLDkzLjY4OSw2LjA0NCw5LjI0NCwzNS4wMjIsNy40NjcsMzUuMDIyLDcuNDY3LDQ0LjQ0OS03LjY1Myw0NS4zMzMtNjUuMTMzLDQuNjIyLTExMy40ODhtLTQwLjg4OS00NS4yNjdjLTUuNDQ5LDAtOS44NjcsNC40MTctOS44NjcsOS44NjdzNC40MTcsOS44NjcsOS44NjcsOS44NjcsOS44NjctNC40MTcsOS44NjctOS44NjctNC40MTctOS44NjctOS44NjctOS44NjdaIiBzdHlsZT0iZmlsbDp1cmwoI2UpOyIvPjxwYXRoIGQ9Ik0zNjUuMzMzLDMwNy4wNjdjLjEzMy0xOC44LDEzLjczMy0yNy4zMzMsMjcuNzMzLTE5LjQ2NywxLjMzMywxNi41MzMtMTguMjgxLDMyLjkzMy0yNy43MzMsMTkuNDY3WiIgc3R5bGU9ImZpbGw6dXJsKCNmKTsiLz48cGF0aCBkPSJNMzU2Ljg2NywyNzguNDY3czE2Ljk5OS04Ljg2NywxNi45OTktMjguMDY3LTE4LTM1LjItMTgtMzUuMmMwLDAtMTcuODY3LTE5LjYtMTcuODY3LTM4LjhzOC44LTMyLjgsOC44LTMyLjhjMCwwLTM5LjEyNCwxOC4wMDctMzkuODY3LDU2LjgsMCwwLTEuNiwyNS42LDE0LjUzMyw0NC4xMzMsMCwwLDI4LjEzNSwzMy45MzQsMzUuNDAxLDMzLjkzNFoiIHN0eWxlPSJmaWxsOnVybCgjZyk7Ii8+PHBhdGggZD0iTTI2My43ODgsMzE3Ljg5Yy0xLjQxNi0xNC40MDMtNC41MS01NS41NTYtMTYuNTUtNjUuMDc4LDMxLjkyOSwxMi4zNTUsMjMuMDAzLDczLjI4NCwyMy4wMDMsNzMuMjg0bC02LjQ1My04LjIwNloiIHN0eWxlPSJmaWxsOnVybCgjaCk7IG9wYWNpdHk6LjY7Ii8+PHBhdGggZD0iTTMyMi4xNjcsMzMxLjgzM2MxMi41LDI5LjgzMywxOC4zNTMsODMuODExLTM0LDEwNC44MzMsNDMuODMzLTI3Ljc3OCw0MC43NzgtODQuMjc4LDM0LTEwNC44MzNaIiBzdHlsZT0iZmlsbDojZjU4NjYzOyIvPjxwYXRoIGQ9Ik0yNzUuMjA4LDI2OS4zNjdjLTM1LjkzNC00MS4xNjYtMjQuMTExLTk1LjI3OCw0My4xNjctMTI2LjE2Ny01Ni4xNjcsMzUuNTU2LTcwLjE2Nyw2OC4zMzMtNDMuMTY3LDEyNi4xNjdaIiBzdHlsZT0iZmlsbDojZjlhMzVkOyIvPjxwYXRoIGQ9Ik0yMjQuMjA0LDQyMy44NjRsLS43MDItOC40MTlzLTM3LTE2LjY2Ny0zNy0zOGMwLDMyLjY2NywzNy43MDIsNDYuNDE5LDM3LjcwMiw0Ni40MTlaIiBzdHlsZT0iZmlsbDojZjhhYzVlOyIvPjxwYXRoIGQ9Ik0zNDMuMjIyLDIzMS42NjdjLTguNjA4LTEwLjI3Mi0zMS40NzItMzQuOTE3LTE1LjU1Ni02My40NDQtMy41ODMsMjQuOTQ0LDIuNjY3LDM5LjI3OCwxNS41NTYsNjMuNDQ0WiIgc3R5bGU9ImZpbGw6dXJsKCNpKTsiLz48cGF0aCBkPSJNMjA0LDE5MS44MzNjLTUuNS0xOC42NjcsMjYuMjUtNjIuNTgzLDQ5LjgzMy03Ny00NSw1NS41LTM5LjE2Nyw1MS4zMzMtNDkuODMzLDc3WiIgc3R5bGU9ImZpbGw6dXJsKCNqKTsiLz48L3N2Zz4=
// @run-at       document-start
// @require      https://greasyfork.org/scripts/459346-fsfb-facts/code/fsfb%20facts.js?version=1145073
// @license      GPL-3.0-or-later
// @connect      translate.google.com
// @connect      greasyfork.org
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/446564/fsfb%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/446564/fsfb%20script.meta.js
// ==/UserScript==


// ~~~~~~~~~ Don't change anything below this unless you know what you are doing ~~~~~~~~~
const version = typeof GM_info != 'undefined' && GM_info?.script?.version || '1.6.3';

let settings = {
    hotkeys: [
        {title: "Shoot 7 Ejected", id: "fsfb-key7Feed", key: 0, active: false}, // 0
        {title: "Linesplit Lock", id: "fsfb-linesplit", key: 0, active: false}, // 1
        {title: "Macro Split Bots", id: "fsfb-MacroSplitBots", key: 0, active: false}, // 2
        {title: "Hide UI", id: "fsfb-hideUI", key: 0, active: false}, // 3
        {title: "Toggle Cursor", id: "fsfb-togglecursor", key: 0, active: false}, // 4
        {title: "Check Profile", id: "fsfb-checkprofile", key: 0, active: false} // 5
    ],
    fastsplit_hotkeys: [
        {title: "Fast Onesplit", id: "fsfb-fsOne", keyName: "", keyCode: 0, active: false}, // 0
        {title: "1st Delay (ms)", id: "fsfb-firstdelay", val: 60, active: false}, // 1
        {title: "2nd Delay (ms)", id: "fsfb-secdelay", val: 60, active: false}, // 2
        {title: "Fast Doublesplit", id: "fsfb-fsTwo", keyName: "", keyCode: 0, active: false}, // 3
        {title: "1st Delay (ms)", id: "fsfb-dubfirstdelay", val: 60, active: false}, // 4
        {title: "2nd Delay (ms)", id: "fsfb-dubsecdelay", val: 60, active: false}, // 5
        {title: "Fast Triplesplit", id: "fsfb-fsThree", keyName: "", keyCode: 0, active: false}, // 6
        {title: "1st Delay (ms)", id: "fsfb-threefirstdelay", val: 120, active: false}, // 7
        {title: "2nd Delay (ms)", id: "fsfb-threesecdelay", val: 60, active: false} // 8
    ],
    frozenvirus: [
        {title: "Frozen Virus", id: "fsfb-frzvs", key: 0, active: false},
        {title: "Press Delay (ms)", id: "fsfb-fvsdelay", val: 100, active: false}
    ],
    checkboxes: [
        {title: "Chat Copy/Cut/Paste", id: "fsfb-copycutpaste", active: false}, // 0
        {title: "Anti-AFK", id: "fsfb-antiAFK", active: false}, // 1
        {title: "Anti-Invis", id: "fsfb-anticloak", active: false}, // 2
        {title: "Linesplit Toggle", id: "fsfb-linetoggle", active: false}, // 3
        {title: "Change Page Title", id: "fsfb-changetitle", active: false}, // 4
        {title: "Hide Shouts", id: "fsfb-hideshouts", active: false}, // 5
        {title: "Hold To Spam Rec/Spd", id: "fsfb-recospeed", active: false}, // 6
        {title: "Show Portal Mass", id: "fsfb-portalmass", active: false}, // 7
        {title: "Pow Spawns Overlay", id: "fsfb-powsoverlay", active: false}, // 8
        {title: "Mothercell Mass", id: "fsfb-mtchmass", active: false}, // 9
        {title: "Inventory One Row", id: "fsfb-pwsonerow", active: false}, // 10
        {title: "Quick Buy", id: "fsfb-qBuy", active: false} // 11-
    ],
    slowFeed: [
        {title: "Toggle Feed", id: "fsfb-slowFeed", key: 0, active: false},
        {title: "Feed Delay (ms)", id: "fsfb-slowfeedtime", val: 100, active: false}
    ],
    quickSettings: [
        {id: "fsfb-quick-hotkey1", id1: "fsfb-quick-select1", set: "cSkins", key: 0, active: false},
        {id: "fsfb-quick-hotkey2", id1: "fsfb-quick-select2", set: "cWearables", key: 0, active: false},
        {id: "fsfb-quick-hotkey3", id1: "fsfb-quick-select3", set: "cFood", key: 0, active: false},
        {id: "fsfb-quick-hotkey4", id1: "fsfb-quick-select4", set: "cBubbleCells", key: 0, active: false},
        {id: "fsfb-quick-hotkey5", id1: "fsfb-quick-select5", set: "cNames", key: 0, active: false},
        {id: "fsfb-quick-hotkey6", id1: "fsfb-quick-select6", set: "cNameOutlines", key: 0, active: false}
    ],
    uiScaling: [
        // {title: "Chat Size", id: "fsfb-chatSize", level: 5},
        {title: "Inventory Size", id: "fsfb-invSize", level: 5}, // 0
        {title: "Food Size", id: "fsfb-foodSize", level: 1}, // 1
        {title: "Statsbox Size", id: "fsfb-statsSize", level: 5} // 2
    ],
    theme: [
        {title: "Food Color", id: "fsfb-check-foodcolor", id1: "fsfb-color-foodcolor", color: "#FFFFFF", active: false}, // 0
        {title: "Virus Color", id: "fsfb-check-viruscolor", id1: "fsfb-color-viruscolor", color: "#00ff00", active: false}, // 1
        {title: "Virus Stroke", id: "fsfb-check-virusstroke", id1: "fsfb-color-virusstroke", color: "#00ff00", active: false}, // 2
        {title: "Mothercell Color", id: "fsfb-check-msColor", id1: "fsfb-color-msColor", color: "#cd5564", active: false}, // 3
        {title: "Mothercell Stroke", id: "fsfb-check-msStroke", id1: "fsfb-color-msStroke", color: "#cd5564", active: false}, // 4
        {title: "Border Color", id: "fsfb-check-border", id1: "fsfb-color-border", color: "#CC3030", active: false}, // 5
        {title: "BR Hazard Zone", id: "fsfb-check-Hazard", id1: "fsfb-color-hazard", color: "#cc3030", active: false} // 6
    ],
    theme_boxes: [
        {title: "Fancy Bubble Cells", id: "fsfb-bublecell", active: false}, // 0
        {title: "Show Player Mass", id: "fsfb-showmass", active: false}, // 1
        {title: "Only My Skin", id: "fsfb-myskins", active: false}, // 2
        {title: "Only Party Skins", id: "fsfb-partyskins", active: false}, // 3
        {title: "Only My Nick", id: "fsfb-mynick", active: false}, // 4
        {title: "Only Party Nicks", id: "fsfb-partynicks", active: false}, // 5
        {title: "Spiked Cells", id: "fsfb-spikedcells", active: false}, // 6
        {title: "Reverse Cell Order", id: "fsfb-revcell", active: false}, // 7
        {title: "Render Portals Top", id: "fsfb-portalstop", active: false}, // 8
    ],
    name_color: [
        {title: "Public Name Color", id: "fsfb-nc-public", active: true}, // 0
        // start with a (somewhat) random color so not everyone has the same color
        {title: "Name Color", id: "fsfb-box-nc", id1: "fsfb-nc-color", color: ["#22FF22", "#2299FF", "#FF9922", "#FF2222", "#000000", "#800080", "#0086b9"][~~(new Date().getHours() % 7)], active: false}, // 1
        {title: "Name Stroke", id: "fsfb-box-ncs", id1: "fsfb-nc-stroke", color: ["#000000", "#000000", "#000000", "#000000", "#777777", "#f5e666", "#06ffda"][~~(new Date().getHours() % 7)], active: false} // 2
    ],
    anti_lag: [
        {title: "Hide Small Minions", id: "fsfb-hideminions", active: false}, // 0
        {title: "No Minion Skins", id: "fsfb-nominionskins", active: false}, // 1
        {title: "Hide All Ejected", id: "fsfb-hideejected", active: false}, // 2
        {title: "Hide Static Ejected", id: "fsfb-hidestaticej", active: false}, // 3
        {title: "No Eat Anims", id: "fsfb-nodeathanims", active: false} // 4
    ],
    chat_translate: [
        {title: "Translate Chat", id: "fsfb-tranchat", active: false}, // 0
        {title: "Translate Server", id: "fsfb-tranplyr", active: false}, // 1
        {title: "Show Original", id: "fsfb-tranorig", active: false}, // 2
        {title: "Translate From:", id: "fsfb-tran1", set: "auto"}, // 3
        {title: "Translate To:", id: "fsfb-tran2", set: "auto"} // 4
    ],
    export_import: [
        {title: "Game Settings", id: "fsfb-game-settings", active: false},
        {title: "Game Controls", id: "fsfb-game-controls", active: false},
        {title: "Custom Background", id: "fsfb-custom-bg", active: false},
        {title: "Script Settings", id: "fsfb-script-settings", active: false},
        {title: "Script Theme", id: "fsfb-theme-settings", active: false}
    ]

}, misc_settings = {
    abil: {},
    bots: {},
    statsPos: null,
    statsSettings: {
        xp: {
            lvlcomp: true,
            rem: true,
            projhr: true,
            lasthr: true,
            lastmin: true,
            lastsec: true,
            mean: true,
            median: true,
            sd: true,
            sesh: true,
            seshlength: true,
            lifetime: true
        },
        coins: {
            rem: true,
            projhr: true,
            lasthr: true,
            lastmin: true,
            mean: true,
            median: true,
            sd: true,
            sesh: true,
            seshlength: true
        }
    }
}
// Don't edit these settings directly (changing code) unless you aren't using tampermonkey or can't access the settings via the menu commands
let userPreferences = {
    hideAds: true,
    improvedShop: true,
    extraBotPacks: true,
    rightClickCopyChat: true,
    rightClickCopyInfo: true,
    showRemainingAbilityTime: true,
    unlockFreeSkins: true,
    hoverShowSkinID: true,
    coinXPstats: true,
    saveStatsBoxPosition: true,
    showXPdecimals: true,
    whiteBorder4BlackCells: true,
    sortWearablesByOwned: true,
    linesplitClosestSide: false,
    // friendDeclineAll: true,
    rainbowMapBorder: false,
    rainbowBorderSpeed: 5,
    rainbowBrHazard: false,
    rainbowBrHazardSpeed: 5,
    extraChatCommands: true,
    chatPrefix: '/f ',
    bypassConfirmChatRules: true,
    publicSkinSearch: true,
    extraOneFastSplitDelay: false,
    notifyNewUpdates: true,
    preventAutoLowGraphics: true,
    stylizeActiveSettings: true,
    removeMultiFeedPopup: true,
    level1kFix: true,
    messageBanWarning: true,
    removeModMessages: false,
    removeColorTagsInChat: true,
    tripleFastSplitSetting: false,
    rainbowNameColor: false,
    rainbowNameSpeed: 3,
    clickToCursorLock: false,
    removeLvlRewardPopup: false,
    showFsfbBugTesterRole: true
}
const keyCodeMappings = { 0: "", 8: "BACKSPACE", 9: "TAB", 12: "CLEAR", 13: "ENTER", 16: "SHIFT", 17: "CTRL", 18: "ALT", 19: "PAUSE", 20: "CAPSLOCK", 27: "ESC", 32: "SPACE", 33: "PAGEUP", 34: "PAGEDOWN", 35: "END", 36: "HOME", 37: "LEFT", 38: "UP", 39: "RIGHT", 40: "DOWN", 44: "PRTSCN", 45: "INS", 46: "DEL", 91: "WIN", 92: "WIN", 93: "CONTEXTMENU", 96: "NUM 0", 97: "NUM 1", 98: "NUM 2", 99: "NUM 3", 100: "NUM 4", 101: "NUM 5", 102: "NUM 6", 103: "NUM 7", 104: "NUM 8", 105: "NUM 9", 106: "NUM *", 107: "NUM +", 109: "NUM -", 110: "NUM .", 111: "NUM /", 112: "F1", 113: "F2", 114: "F3", 115: "F4", 116: "F5", 117: "F6", 118: "F7", 119: "F8", 120: "F9", 121: "F10", 122: "F11", 123: "F12", 124: "F13", 125: "F14", 126: "F15", 127: "F16", 128: "F17", 129: "F18", 130: "F19", 131: "F20", 132: "F21", 133: "F22", 134: "F23", 135: "F24", 144: "NUMLOCK", 145: "SCROLLLOCK", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'"}, cmap = { a: "а", e: "е", i: "і", o: "ο", u: "υ", y: "у", A: "А", E: "Е", I: "Ӏ", O: "Ο", U: "𝗨", Y: "Υ"};
const invisUnicodeIds = [9, 32, 160, 847, 1564, 4448, 6068, 6069, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8232, 8239, 8287, 8289, 8290, 8291, 8292, 8298, 8299, 8300, 8301, 8302, 8303, 12288, 12644, 65440];

const setStorage = (name, obj) => typeof GM_setValue != "function" ? localStorage.setItem(name, JSON.stringify(obj)) : GM_setValue(name, obj),
      getStorage = (name, default_obj) => typeof GM_getValue != "function" ? localStorage.getItem(name) != null ? JSON.parse(localStorage.getItem(name)) : setStorage(name, default_obj) : GM_getValue(name, default_obj);

if(typeof unsafeWindow === 'undefined') unsafeWindow = window;

const saveSettings = () => setStorage("fsfb-scripts", settings);
const getSettings = () => {
    let settingsPrev = getStorage("fsfb-scripts", settings);
    for(let i in settingsPrev) {
        for(let j in settingsPrev[i]) {
            for(let x in settings){
                for(let y in settings[x]){
                    if(settingsPrev[i][j].id == settings[x][y].id) settings[x][y] = settingsPrev[i][j];
                }
            }
        }
    }
}

let prevPreferences = getStorage('fsfb-user-settings', userPreferences);

for(let prevSetting in prevPreferences) {
    for(let currSetting in userPreferences){
        if(prevSetting == currSetting) userPreferences[currSetting] = prevPreferences[prevSetting]; //settings[x][y] = settingsPrev[i][j];
    }
}

const getMiscSettings = () => {
    let prevSettings = getStorage("fsfb-misc", misc_settings);
    misc_settings = {...misc_settings, ... prevSettings};
}
getSettings();
getMiscSettings();

const getName = key => key ? keyCodeMappings[key] ?? String.fromCharCode(key) : '';

const levelSum = lvl => lvl * --lvl / 2,
      range = arr => Math.max(...arr) - Math.min(...arr),
      sigma = arr => arr.reduce((a, b) => a + b),
      mean = arr => sigma(arr) / arr.length,
      variance = arr => arr.reduce((a, b) => a + (b - mean(arr)) ** 2, 0) / arr.length,
      standardDeviation = arr => Math.sqrt(variance(arr)),
      ascending = arr => arr.sort((a, b) => a - b),
      getIQR = arr => quartile(arr, .75) - quartile(arr, .25),
      round = (num, places = 0) => Math.round(num * +("1e" + places)) / +("1e" + places);
const median = arr => {
    const mid = ~~(arr.length / 2),
          asc = ascending(arr);
    return arr.length % 2 !== 0 ? asc[mid] : (asc[mid - 1] + asc[mid]) / 2;
}
const getProperty = (arr, property) => {
    let newArr = [];
    for (let i of arr) newArr.push(i[property]);
    return newArr;
}
const quartile = (arr, q) => {
    const sorted = ascending(arr),
          pos = (sorted.length - 1) * q,
          base = ~~pos,
          rest = pos - base;
    return sorted[base + 1] !== null ? sorted[base] + rest * (sorted[base + 1] - sorted[base]) : sorted[base]
}
const checkOutliers = (arr, returnOutliers) => {
    let nonOutliers = [], outliers = [];
    const IQR = getIQR(arr),
          Q1 = quartile(arr, .25),
          Q3 = quartile(arr, .75);
    for (let i of arr) i < Q1 - 1.5 * IQR || i > Q3 + 1.5 * IQR ? outliers.push(i) : nonOutliers.push(i);
    return returnOutliers ? outliers : nonOutliers;
}
const msToTime = ms => {
    const pad = num => num < 10 ? '0' + ~~num : ~~num;
    return `${pad(ms / 36e5)}:${pad(ms / 6e4 % 60)}:${pad(ms / 1e3 % 60)}`; // hrs:mins:secs
}
const changeTitle = title => {
    if(document.title != title) document.title = title;
};

if(settings.checkboxes[4].active && document.title == 'Agma.io - A free multiplayer MMO game') changeTitle('Agma.io');

if(userPreferences.unlockFreeSkins){
    ["", 56, 1657, 2281, 2282, 2297, 2331, 2529, 2626, 2683, 2816, 2832].forEach(id => localStorage.setItem('ytSkin' + id, '1'));
    localStorage.setItem('fbSkin', '1');
}

const softSanitize = str => {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    return str.replace(/[&<>"'/]/ig, match => map[match]);
}

const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

['paste', 'copy', 'cut'].forEach(a => {
    unsafeWindow.addEventListener(a, e => {
        if(document.querySelector('#fsfb-copycutpaste')?.checked) e.stopImmediatePropagation();
    }, true)
});


let agmaHotkeys = JSON.parse(localStorage.getItem('hotkeys'));
let agmaSettings = JSON.parse(localStorage.getItem('settings'));

Object.defineProperty(unsafeWindow, 'localStorage', {
    value: new Proxy(localStorage, {
        set: function (ls, prop, val) {
            if(prop === 'hotkeys') agmaHotkeys = JSON.parse(val);
            else if(prop === 'settings'){
                let prevNick = agmaSettings?.nickName;
                agmaSettings = JSON.parse(val);
                if(settings.name_color[0].active && !!document.querySelector('#nick') && prevNick && prevNick != agmaSettings.nickName) val = JSON.stringify((agmaSettings.nickName = document.querySelector('#nick').value, agmaSettings));
            }
            return !void(ls[prop] = val);
        },
        get: function(ls, prop) {
            return prop === 'setItem' || typeof ls[prop] === 'function' ? ls[prop].bind(ls) : ls[prop];
        }
    }),
    configurable: true,
    enumerable: true
});

const hotkeysMap = {
    360: "W360",
    Split: "Space",
    DoubleSplit: "D",
    TripleSplit: "T",
    MacroSplit: "Z",
    MacroFeed: "W",
    FixedMouse: "C",
    Respawn: "M",
    MultiFeed: "V",
    Recombine: "E",
    Speed: "S",
    FreezeSelf: "F",
    Invisibility: "I",
    DropWall: "DW",
    ToggleCamera: "Q",
    FreezeCamera: "F",
    ToggleControlBots: "Q",
    SplitBots: "A",
    FeedBots: "X"
}
const getKey = id => agmaHotkeys && agmaHotkeys[hotkeysMap?.[id.replace(/^key/gm, '')]]?.c;
unsafeWindow.getKey = getKey;

if(userPreferences.bypassConfirmChatRules) localStorage.setItem('crc', 'true');


const insertCustomjQuery = $ => {
    // const { $ } = unsafeWindow;

    if(userPreferences.extraBotPacks){

        const newBots = [
            {title: "100 Bots", time: "24 HOURS", price: "700,000", id: 9},
            {title: "125 Bots", time: "48 HOURS", price: "900,000", id: 10},
            {title: "300 Bots", time: "24 HOURS", price: "900,000", id: 7},
            {title: "100 MASS Bots", time: "1 HOURS", price: "800,000", id: 8},
            {title: "300 Bots", time: "72 HOURS", price: "2,000,000", id: 11},
            {title: "100 MASS Bots", time: "24 HOURS", price: "2,600,000", id: 12},
            {title: "500 MASS Bots", time: "2 HOURS", price: "20,000,000", id: 17},
            {title: "500 MASS Bots", time: "12 HOURS", price: "30,000,000", id: 16}
        ]


        if(document.getElementsByClassName('tab-container-section minion scroll')?.[0]?.children?.[0].children.length){ // check if minions page has already been loaded
            $('.confirm-minion[item=7], .confirm-minion[item=8]').parent().hide();
            for(let i of newBots) createEl(i);
            document.getElementById('extraTab').childNodes[0].setAttribute('onclick', '');
            $('.confirm-minion.extra-min').click(function(e) {
                e.preventDefault(); // Prevent the href from redirecting directly
                const { setMinionUi, purchaseMinion } = unsafeWindow;
                let linkURL = $(this).attr("href"),
                    priceK = $(this).attr("price"),
                    itemId = $(this).attr("item");
                setMinionUi(true);
                unsafeWindow.swal({
                    title: "Confirm",
                    text: 'If you click "Buy", you will purchase these minions. They cost ' + priceK,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#4CAF50",
                    confirmButtonText: "Yes, confirm purchase",
                    cancelButtonText: "No, cancel purchase"
                }, function() {
                    purchaseMinion(itemId);
                });
            });
        } else {
            const _$click = $.prototype.click;

            $.prototype.click = function(){
                if(this.selector === ".confirm-minion" && typeof arguments[0] === 'function'){
                    $('.confirm-minion[item=7], .confirm-minion[item=8]').parent().hide();
                    for(let i of newBots) createEl(i);
                    document.getElementById('extraTab').childNodes[0].setAttribute('onclick', '');
                    return _$click.apply($('.confirm-minion'), arguments);
                }
                return _$click.apply(this, arguments);
            }
        }
        function createEl(i) {
            const botEl = document.createElement('li');
            botEl.setAttribute('class', 'masterTooltip extra-min');
            botEl.setAttribute('title', 'Spawns bots/minions which suicide into your playercell to make you big in no time! Minions follow your mouse and split upon your command! Minions start immediately after you buy them.');
            document.getElementsByClassName('tab-container-section minion scroll')[0].children[0].children[0].appendChild(botEl);
            botEl.innerHTML = `<div class="title_prch"><img src="img/store/minions/minions_tab.png" width="70px" height="60px"><div class="minionDescription"><h4 style="font-size: 18px;">${i.title}</h4><h3 style="margin-top:10px;color:white;"> ${i.time}</h3></div> <span class="win-price">${i.price}</span></div><a href="#" price="${i.price}" item="${i.id}" class="purchase-btn2 confirm-minion extra-min">Buy</a>`;
        }
    }
}


if(typeof unsafeWindow.$ === 'function'){
    insertCustomjQuery(unsafeWindow.$);
} else {
    let setjQueryVal;
    Object.defineProperty(unsafeWindow, '$', { // intercept immediately after jQuery is defined on window
        set: function(val) {
            setjQueryVal = val;
            insertCustomjQuery(val);
        },
        get: function() {
            return setjQueryVal;
        },
        configurable: true
    });
}



const agmaioPortals = new Set();
agmaioPortals.sort = function() {}; // prevents errors but causes (minor) bug where portals are not being sorted by mass, as js Sets are inherently unordered

const newSortFunc = function(oldFunc){
    if(settings.theme_boxes[8].active){
        return function(a, b){
            const oldFuncApplied = oldFunc.apply(this, arguments),
                  aVal = a.c$,
                  bVal = b.c$;
            return ((settings.theme_boxes[7].active ? -oldFuncApplied : oldFuncApplied) > 0 || aVal === 4) && bVal !== 4 ? 1 : aVal === 4 && bVal === 4 ? 0 : -1;
        }
    } else if(settings.theme_boxes[7].active){
        return function(a, b){
            return -oldFunc.apply(this, arguments);
        }
    } else {
        return oldFunc;
    }
}
const _Arrayfrom = Array.from;

Array.from = function(items, mapFunc) { // concept/logic credit to: bigmelon <3
    const result = _Arrayfrom.apply(this, arguments);
    // console.log('yay');
    if (items && items.length >= 3 && typeof mapFunc === 'function') {
        result.forEach(sizeArray => {
            const __push = sizeArray.push;

            sizeArray.push = function(...cells) {
                for (const cell of cells) {
                    cell.c$ === 4 && settings.theme_boxes[8].active ? agmaioPortals.add(cell) : __push.call(this, cell);
                }
                return this.length;
            };

            const __sort = Array.prototype.sort;
            sizeArray.sort = function(oldFunc) {
                return oldFunc == null || typeof this[0]?.color !== "string" ? __sort.apply(this, arguments) : __sort.call(this, newSortFunc(oldFunc));
            };

        });

        result.push(agmaioPortals);

        return new Proxy(result, {
            get(target, prop, receiver) { // mdn ml
                if (prop === Symbol.iterator && settings.theme_boxes[7].active) {
                    return function* () {

                        for (let i = target.length - 2; i >= 0; i--) {
                            yield target[i];
                        }
                        yield target[target.length - 1]; // portals array last (so they stay on top)
                    }
                }
                return Reflect.get(target, prop, receiver);
            }
        });
    }

    return result;
};


const afterLoaded = () => {

    unsafeWindow.fsfbStartedLoading = true;
    const { $, swal, purchaseItem, hotkeySetDefaults, setDefaults, uisdoa } = unsafeWindow;

    // attempt to prevent the script from being active on subpages of agma.io
    if($ == null || $('#friendResizer').length < 1 || $('#megaholder').length < 1 || $('#preroll').length < 1) return;

    if(!agmaHotkeys) hotkeySetDefaults();
    if(!agmaSettings) setDefaults();

    if(typeof GM_registerMenuCommand === 'function' && typeof GM_unregisterMenuCommand === 'function'){

        const addMenuCmd = (name, callback, accessKey) => GM_registerMenuCommand(name, callback, accessKey);
        const remMenuCmd = command_id => GM_unregisterMenuCommand(command_id);

        let expandedUserPref = {
            hideAds: { title: 'Hide Ads', type: 'bool' },
            improvedShop: { title: 'Improved Shop', type: 'bool' },
            extraBotPacks: { title: 'Better Shop', type: 'bool' },
            rightClickCopyChat: { title: 'Right-Click Copy Chat', type: 'bool' },
            rightClickCopyInfo: { title: 'Right-Click Copy Info', type: 'bool' },
            showRemainingAbilityTime: { title: 'Show Remaining Abilities', type: 'bool' },
            unlockFreeSkins: { title: 'Unlock Free Skins', type: 'bool' },
            hoverShowSkinID: { title: 'Hover Show Skin ID', type: 'bool' },
            coinXPstats: { title: 'Coin/XP Statistics', type: 'bool' },
            saveStatsBoxPosition: { title: 'Save Stats-Box Position', type: 'bool' },
            showXPdecimals: { title: 'Show Decimals in % XP', type: 'bool' },
            whiteBorder4BlackCells: { title: 'White Border For Black Cells', type: 'bool' },
            sortWearablesByOwned: { title: 'Sort Owned Wearables', type: 'bool' },
            linesplitClosestSide: { title: 'Linesplit Closest Side', type: 'bool' },
            // friendDeclineAll: { title: 'Friend Decline All', type: 'bool' },
            rainbowMapBorder: { title: 'Rainbow Map Border', type: 'bool' },
            rainbowBorderSpeed: { title: 'Rainbow Border Speed', type: 'num' },
            rainbowBrHazard: { title: 'Rainbow BR Hazard', type: 'bool' },
            rainbowBrHazardSpeed: { title: 'Rainbow Hazard Speed', type: 'num' },
            extraChatCommands: { title: 'FSFB Chat Commands', type: 'bool' },
            chatPrefix: { title: 'Chat Command Prefix', type: 'str' },
            bypassConfirmChatRules: { title: 'Bypass Chat Confirm', type: 'bool' },
            publicSkinSearch: { title: 'Public Skin Search', type: 'bool' },
            extraOneFastSplitDelay: { title: 'Extra Fastsplit Delay', type: 'bool' },
            notifyNewUpdates: { title: 'Notify New Updates', type: 'bool' },
            preventAutoLowGraphics: { title: 'Disable Auto-Low Graphics', type: 'bool' },
            stylizeActiveSettings: { title: 'Stylize Active Settings', type: 'bool' },
            removeMultiFeedPopup: { title: 'Remove MultiFeed Warning', type: 'bool' },
            level1kFix: { title: 'Fix Level 1000 Bug', type: 'bool'},
            messageBanWarning: { title: 'Censor Message To Mitigate Ban', type: 'bool' },
            removeModMessages: { title: 'Remove Server Mod Messages', type: 'bool' },
            removeColorTagsInChat: { title: 'Remove Custom Name Tags In Chat', type: 'bool' },
            tripleFastSplitSetting: { title: 'Triple Fastsplit Setting', type: 'bool'},
            rainbowNameColor: { title: 'Rainbow Name Color (Client Only)', type: 'bool'},
            rainbowNameSpeed: { title: 'Rainbow Name Speed (Client Only)', type: 'num'},
            clickToCursorLock: { title: 'Left Click To Cursor Lock', type: 'bool'},
            removeLvlRewardPopup: { title: 'Hide Level Reward Popup', type: 'bool'},
            showFsfbBugTesterRole: { title: 'Show FSFB Bug Tester Profile', type: 'bool'}
        }

        function updateShownSettings(){
            for(let keyName in expandedUserPref){
                const expObj = expandedUserPref[keyName];

                if('menu' in expObj){
                    remMenuCmd(expObj.menu);
                }

                let value = userPreferences[keyName],
                    typeIndicator = expObj.type == 'bool' ? `[ ${value ? '✅' : '❌'} ] ` : `[ "${value}" ] `;

                expObj.menu = addMenuCmd(typeIndicator + expObj.title, function(e){
                    let newVal;
                    if(expObj.type === 'bool'){
                        newVal = !value;
                        userPreferences[keyName] = newVal;
                    } else {
                        newVal = prompt('Please input the value you want to set:', value);

                        if(expObj.type === 'num' && !/^[0-9]+$/.test(newVal)){
                            updateShownSettings();
                            return alert('Please only enter numbers');
                        }
                        userPreferences[keyName] = expObj.type === 'num' ? Number(newVal) : newVal;
                    }
                    updateShownSettings();
                    setStorage('fsfb-user-settings', userPreferences);
                    alert(`Setting: "${expObj.title}" value changed to: ${expObj.type === 'bool' ? `[ ${newVal ? '✅' : '❌'} ] ` : `[ "${newVal}" ] `}.\nNote that some (not all) settings require a browser reload to take full effect.`);
                })
            }
            addHideAll();
        }

        function addHideAll(){
            let hideAllBtn = addMenuCmd('Hide all settings', function(){
                for(let keyName in expandedUserPref){
                    const expObj = expandedUserPref[keyName];
                    if('menu' in expObj){
                        remMenuCmd(expObj.menu);
                    }
                }
                remMenuCmd(hideAllBtn);
                addShowMore();
            });
        }
        function addShowMore(){
            let showMoreBtn = addMenuCmd('Show all settings', function(){
                remMenuCmd(showMoreBtn);
                updateShownSettings();
            })
            }
        addShowMore();
    }

    const _slideDown = $.prototype.slideDown;
    $.prototype.slideDown = function () {
        if(this.selector === '#curser'){
            let content = this[0].textContent;
            if(content?.includes("Your FPS seems to be low")) return;
            if(content?.includes("Connected to server")){
                playerAlive = false;
                svSwitch = true;
                agmaioPortals.clear();
                try{
                    currentServerId = 0;
                    for(let { isCurrent, id } of JSON.parse(localStorage.gameservers)){
                        if(isCurrent) currentServerId = id;
                    }
                } catch {
                    console.warn("FSFB: Failed to grab server id from localStorage")
                    currentServerId = parseInt($(".server-tabmenu").find(".active")[0]?.id.slice(9));
                }
            }
        }
        return _slideDown.apply(this, arguments);
    }

    const _$text = $.prototype.text;
    $.prototype.text = function(){
        if(this.selector === '.exp-bar' && userPreferences.showXPdecimals){
            arguments[0] = (~~(+this[0].parentElement.style.width.slice(0, -1) * 100) / 100) + '%';
        }
        if(this.selector === '#userCoins2' && typeof arguments[0] === 'string') currentUser = arguments[0];
        // if(this.selector === '#megaphone_text' && typeof arguments[0] === 'string' && addChatMsg !== null){
        //     let name = document.querySelector('#megaphone_name').textContent,
        //         [message] = arguments,
        //         id = unsafeWindow.md5(Math.round(Math.random()));
        //     addChatMsg({
        //         R: !1,
        //         v: 0,
        //         i: 0,
        //         P: id,
        //         z: id,
        //         name,
        //         G: "",
        //         color: "#FF0A0A",
        //         message,
        //         category: 0,
        //         goldMember: 0,
        //         L: 0,
        //         Y: 0,
        //         j: 0,
        //         q: 0,
        //         J: 1,
        //         time: Date.now(),
        //         cache: null
        //     });
        // }
        return _$text.apply(this, arguments);
    }

    // let swalUserColor = '#FF00D8',
    //     swalRoleTitle = 'Fsfb Developer',
    //     swalRoleColor = '#FF78EA';
    let swalFsfbDev = {userColor: '#FF00D8', title: 'Fsfb Developer', roleColor: '#FF78EA'},
        swalFsfbBugTester = {userColor: '#FF00D8', title: 'Fsfb Bug Tester', roleColor: '#FF9EEA'}

    unsafeWindow.swal = function() {
        // console.log(arguments);
        // console.log(arguments[0]);

        if(typeof arguments[0] === 'object' && 'title' in arguments[0] && userPreferences.removeLvlRewardPopup && arguments[0].type === "" && arguments[0].title === "Level Rewards" && arguments[0].html){
            return void(setTimeout(() => curserMsg(arguments[0].text.replace(/\n(?=G)/gm, '').replace(/\n\. /gm, '').replace(/<span>Wall disappears on logout!<\/span>/gm, ''), 'yellow', 0, true), 5e3));
        }
        if(typeof arguments[0] === 'object' && 'title' in arguments[0] && userPreferences.removeMultiFeedPopup && arguments[0].type === "error" && arguments[0].text === "Eject multiple cells (Multi Feed) is only available for users who purchased the Custom Skins Sale"){
            return void(curserMsg(arguments[0].text, 'red', 1e4));
        }
        if(typeof arguments[0] === 'object' && 'title' in arguments[0] && userPreferences.removeModMessages && arguments[0].title.includes("Mod Message") && arguments[0]?.customClass === "swal-title-green"){
            return void(curserMsg(`<b>${arguments[0].title}:</b>\n${arguments[0].text}`, 'purple', 0));
        }
        if (typeof arguments[0] === 'object' && 'title' in arguments[0] && /<img src="((skins\/\d+(_lo)?\.png\?(u=\d+)?)|img\/userprofile\.png)" width="\d+" height="\d+" style="border-radius:50%;"><br><br><span style=".*?">(Fishyyyy|firebonee|kidmaletteo)<\/span>/gm.test(arguments[0].title)) {
            arguments[0].title = arguments[0].title
                .replace(/(?<=<span style=").*(?=">(Fishyyyy|firebonee|kidmaletteo))/gm, 'color: ' + swalFsfbDev.userColor)
                .replace(/(?<=(?:<span style="display:block; margin:-10px 0px 15px; font-size:12px; line-height:normal;"><br>)|(?: style="padding:2px 5px; font-size:10px; background:#999; color:#000; border-radius:10px;">Hidden<\/span><br><br>))(?=<span(?!( style="padding:2px 5px; font-size:10px; background:#999; color:#000; border-radius:10px;">Hidden<\/span><br><br>)))/gm, `<span style="color: ${swalFsfbDev.roleColor};">&#9734;&#9734; ${swalFsfbDev.title} &#9734;&#9734;</span><br>`);
        }
        if (typeof arguments[0] === 'object' && 'title' in arguments[0] && userPreferences.showFsfbBugTesterRole && /<img src="((skins\/\d+(_lo)?\.png\?(u=\d+)?)|img\/userprofile\.png)" width="\d+" height="\d+" style="border-radius:50%;"><br><br><span style=".*?">day<\/span>/gm.test(arguments[0].title)) {
            arguments[0].title = arguments[0].title
                // .replace(/(?<=<span style=").*(?=">(Fishyyyy|firebonee|kidmaletteo))/gm, 'color: ' + swalFsfbDev.userColor)
                .replace(/(?<=(?:<span style="display:block; margin:-10px 0px 15px; font-size:12px; line-height:normal;"><br>)|(?: style="padding:2px 5px; font-size:10px; background:#999; color:#000; border-radius:10px;">Hidden<\/span><br><br>))(?=<span(?!( style="padding:2px 5px; font-size:10px; background:#999; color:#000; border-radius:10px;">Hidden<\/span><br><br>)))/gm, `<span style="color: ${swalFsfbBugTester.roleColor};">&#9734;&#9734; ${swalFsfbBugTester.title} &#9734;&#9734;</span><br>`);
        }
        return swal.apply(this, arguments);
    }

    $('.setting-tablink').css({'width' : '30%'});
    $('#settingTab2').after(`<button id="settingTab4" class="setting-tablink" onclick="openSettingPage(4);" style="width: 9%; font-size: calc(0.3vw + 7.5px);"><div class="fa fa-cogs fa-lg" style="font-size: 15px; color: lightgray;"></div></button>`);
    $('#settingPage3').after(`<div id="settingPage4" class="setting-tabcontent"><div class="row"><div class="col-md-10 col-md-offset-1 stng" id="fsfb-settings-main" style="padding:0"><div id="fsfb-settings-left"><section id="fsfb-sect-checkbox" class="padbot10 fsfb-sect-ch"></section><section id="fsfb-sect-theme" class="fsfb-sect-ch padbot10"></section><section id="fsfb-sect-namecolor" class="fsfb-sect-ch padbot10"></section><section id="fsfb-sect-antilag" class="fsfb-sect-ch padbot10"></section></div><div id="fsfb-settings-right"><section id="fsfb-sect-hotkeys" class="padbot10"></section><section id="fsfb-sect-slowfeed" class="padbot10"></section><section id="fsfb-sect-frzvrs" class="padbot10"></section><section id="fsfb-sect-fastsplit" class="padbot10"></section><section id="fsfb-sect-quickSettings" class="padbot10"></section><section id="fsfb-sect-uiScale" class="padbot10"></section><section id="fsfb-sect-imexport" class="fsfb-sect-ch padbot10"></section><section id="fsfb-sect-translate"></section></div></div></div></div>`);
    $('.container').eq(0).css("max-width", "1250px");
    $('#fsfb-sect-checkbox').append(`<p class="hotkey-paragraph">Script Features</p>`);

    // add checkbox HTML
    for(let i of settings.checkboxes){
        $('#fsfb-sect-checkbox').append(`<label><input id="${i.id}" type="checkbox"><p> ${i.title} </p></label>`);
        $( "#" + i.id).change(function(e) {
            changeSettings(this.id, $(this).is(':checked'), e);
        });
    }

    // add import/export HTML
    $('#fsfb-sect-imexport').append(`<p class="hotkey-paragraph">Import/Export</p>`);
    for(let i of settings.export_import){
        $('#fsfb-sect-imexport').append(`<label><input id="${i.id}" type="checkbox"><p> ${i.title} </p></label>`);
        $( "#" + i.id).change(function() {
            changeSettings(this.id, $(this).is(':checked'));
        });
    }
    $('#fsfb-sect-imexport').append(`<div id="fsfb-ximport-cont"><div id="fsfb-export-btn" class="fsfb-eximport">Export</div><div id="fsfb-import-btn" class="fsfb-eximport">Import</div></div>`);

    $('#fsfb-sect-theme').append(`<p class="hotkey-paragraph">Game Theme</p>`);
    for(let i of settings.theme){
        $('#fsfb-sect-theme').append(`<label class="fsfb-colors"><input id="${i.id}" type="checkbox"><p> ${i.title}</p><div style="background-color: black;"><input id="${i.id1}"type="color"></div></label>`);
        $( "#" + i.id).change(function() {
            changeSettings(this.id, $(this).is(':checked'));
        });
        $( "#" + i.id1).on('input', function() {
            changeSettings(this.id, this.value);
            $(this).parent().css('background-color', this.value); // bcs the regular [input="color"] looks rly shit, change color of overlayed div instead
        });
    }
    for(let i of settings.theme_boxes){
        $('#fsfb-sect-theme').append(`<label><input id="${i.id}" type="checkbox"><p> ${i.title} </p></label>`);
        $( "#" + i.id).change(function(e) {
            changeSettings(this.id, $(this).is(':checked'), e);
        });
    }
    // namecolor
    $('#fsfb-sect-namecolor').append(`<p class="hotkey-paragraph">Colored Name</p>`);
    for(let i of settings.name_color){
        if("color" in i){

            $('#fsfb-sect-namecolor').append(`<label class="fsfb-colors"><input id="${i.id}" class="fsfb-ncustom" type="checkbox"><p> ${i.title}</p><div style="background-color: black;"><input id="${i.id1}"type="color"></div></label>`);
            $( "#" + i.id).change(function() {
                changeSettings(this.id, $(this).is(':checked'));
            });
            $( "#" + i.id1).on('input', function() {
                changeSettings(this.id, this.value);
                $(this).parent().css('background-color', this.value); // bcs the regular [input="color"] looks rly shit, change color of overlayed div instead
            });
        } else {
            $('#fsfb-sect-namecolor').append(`<label><input id="${i.id}" class="fsfb-ncustom" type="checkbox"><p> ${i.title} </p></label>`);
            $( "#" + i.id).change(function(e) {
                changeSettings(this.id, $(this).is(':checked'), e);
            });
        }
    }



    // antilag
    $('#fsfb-sect-antilag').append(`<p class="hotkey-paragraph">Anti-Lag</p>`);
    for(let i of settings.anti_lag){
        $('#fsfb-sect-antilag').append(`<label><input id="${i.id}" type="checkbox"><p> ${i.title} </p></label>`);
        $( "#" + i.id).change(function(e) {
            changeSettings(this.id, $(this).is(':checked'), e);
        });
    }

    $('#fsfb-sect-translate').append(`<p class="hotkey-paragraph">Chat Translate</p>`);

    for(let i of settings.chat_translate){
        if(!('set' in i)){ //checkboxes
            $('#fsfb-sect-translate').append(`<label><input id="${i.id}" type="checkbox"><p> ${i.title} </p></label>`);
            $( "#" + i.id).change(function(e) {
                changeSettings(this.id, $(this).is(':checked'), e);
            });
        } else {
            $('#fsfb-sect-translate').append(`<p style="margin-top: 2px;">${i.title}</p><select id="${i.id}" class="fsfb-changelang"><option value="auto">Detect language</option><option value="af">Afrikaans</option><option value="sq">Albanian</option><option value="ar">Arabic</option><option value="hy">Armenian</option><option value="az">Aerbaijani</option><option value="eu">Basque</option><option value="be">Belarusian</option><option value="bn">Bengali</option><option value="bg">Bulgarian</option><option value="ca">Catalan</option><option value="zh-CN">Chinese (simpl)</option><option value="zh-TW">Chinese (trad)</option><option value="hr">Croatian</option><option value="cs">Czech</option><option value="da">Danish</option><option value="nl">Dutch</option><option value="en">English</option><option value="et">Estonian</option><option value="tl">Filipino</option><option value="fi">Finnish</option><option value="fr">French</option><option value="gl">Galician</option><option value="ka">Georgian</option><option value="de">German</option><option value="el">Greek</option><option value="ht">Haitian Creole</option><option value="iw">Hebrew</option><option value="hi">Hindi</option><option value="hu">Hungarian</option><option value="is">Icelandic</option><option value="id">Indonesian</option><option value="ga">Irish</option><option value="it">Italian</option><option value="ja">Japanese</option><option value="ko">Korean</option><option value="lv">Latvian</option><option value="lt">Lithuanian</option><option value="mk">Macedonian</option><option value="ms">Malay</option><option value="mt">Maltese</option><option value="no">Norwegian</option><option value="fa">Persian</option><option value="pl">Polish</option><option value="pt">Portuguese</option><option value="ro">Romanian</option><option value="ru">Russian</option><option value="sr">Serbian</option><option value="sk">Slovak</option><option value="sl">Slovenian</option><option value="es">Spanish</option><option value="sw">Swahili</option><option value="sv">Swedish</option><option value="th">Thai</option><option value="tr">Turkish</option><option value="uk">Ukrainian</option><option value="ur">Urdu</option><option value="vi">Vietnamese</option><option value="cy">Welsh</option><option value="yi">Yiddish</option></select>`);
        }
    };

    $('.fsfb-changelang').on("change", function(){
        for(let i = 0; i < settings.chat_translate.length; i++){
            if(settings.chat_translate[i].id == this.id) settings.chat_translate[i].set = this.value;
        }
        saveSettings();
    });

    $('#fsfb-sect-hotkeys').append(`<p class="hotkey-paragraph">Script Hotkeys</p>`);

    const checkHotkeyClicked = (e, thing) => {
        if (e.target.id == thing.id && !thing.active){
            $('#' + thing.id).addClass('selected');
            thing.active = true;
            keysChanging = true; // prevent features from triggering when setting hotkey
        } else {
            thing.active = false;
            $('#' + thing.id).removeClass('selected');
        }
    }
    const checkNewHotkey = (e, thing) => {
        if (!thing.active) return;
        thing.key = e.keyCode;
        $('#' + thing.id).text(getName(e.keyCode)).removeClass('selected');
        thing.active = false;
        saveSettings();
        styleActiveSettings();
        e.preventDefault();
    }
    const checkFsHotkey = (e, thing) => {
        if (!thing.active) return;
        thing.key = e.keyCode;
        thing.keyName = e.key;
        $('#' + thing.id).text(getName(e.keyCode)).removeClass('selected');
        thing.active = false;
        saveSettings();
        styleActiveSettings();
        e.preventDefault();
    }

    const checkPowerupClicked = e => {
        if(!quickBuying || !e?.originalEvent?.isTrusted || $(e.target).attr('class') == 'purchase-btn confirmation' || $(e.target).attr('class') == 'megaphone-btn') return;
        let id = e.target.id;
        if (id == 'fsfb-quickbuy-img' || id == 'fsfb-quickbuy') return void(quickBuying = true);
        const map = {
            Wall: 33,
            AntiFreeze: 35,
            AntiRecombine: 34,
            Shield: 38,
            FrozenVirus: 36,
            Recombine: 1,
            Speed: 2,
            Growth: 6,
            SpawnVirus: 7,
            SpawnMothercell: 8,
            SpawnPortal: 9,
            SpawnGoldOre: 10,
            Freeze: 5,
            '360Shot': 30,
            minion_nuker: 39,
            megaphone_shout: 14,
            freeze_yourself: 18,
            'ripple-virus': 42
        }
        let pwID = map[id.replace(/^(inv|fsfb-)/gm, '')] ?? (() => {
            quickBuying = false;
            $('.inventory-box').removeClass('fsfb-shown').find('p').show();
            $('#fsfb-quickbuy').removeClass('activatedInv')
            curserMsg('Quick buy deactivated.', 'red');
        })();
        if (!quickBuying || !pwID) return;
        $('.confirm').attr('disabled', 'true'); // disable so user doesn't buy early - swal is slow to load text
        const waitUntil1 = (condition) => new Promise(resolve => {
            let interval = setInterval(() => {

                if($('.sweet-alert h2').text() == ' Confirm ') return;

                $('.confirm')[0].click();
                condition() && (clearInterval(interval), resolve());
            }, 25);
            setTimeout(() => { (clearInterval(interval), resolve()) }, 1e4);
        });
        setTimeout(() => {
            if(pwID == 14) return;
            $('.confirm')[0].addEventListener('click', async e => {
                if(!e.isTrusted || $('.confirm').text() == 'OK') return;
                $('.sweet-alert, .sweet-overlay').addClass('fsfb-hidden');
                setTimeout(async() => {
                    await waitUntil1(() => !$('.sweet-alert').hasClass('visible'));
                    if($('.sweet-alert').hasClass('visible')) return;
                    await sleep(100);
                    $('.sweet-alert, .sweet-overlay').removeClass('fsfb-hidden');
                }, 1e3);
            })
        }, 500);
        setTimeout(() => $('.confirm').removeAttr('disabled'), 600);

        if(pwID == 14) $('.megaphone-btn')[0].click();
        else $(`.purchase-btn.confirmation[item="${pwID}"]`)[0].click();

        $('.inventory-box').removeClass('fsfb-shown').find('p').show();
        $('#fsfb-quickbuy').removeClass('activatedInv')
        quickBuying = false;
    }


    for(let i of settings.hotkeys){
        $('#fsfb-sect-hotkeys').append(`<br><p>${i.title}</p><div id="${i.id}" class="fsfb-hotkey"></div>`);
        $('#' + i.id).on('contextmenu', e => {
            $('#' + i.id).text('').removeClass('selected');
            i.active = false;
            i.key = 0;
            saveSettings();
            styleActiveSettings();
            e.preventDefault();
        });
    }

    // const typing = () => $('input, textarea').is(':focus');
    const typing = () => {
        const focused = document.querySelector(":focus");
        return focused === document.activeElement && ['TEXTAREA', 'INPUT'].includes(focused?.tagName) && (!document.hasFocus || document.hasFocus()) && !!(focused.type || focused.href || ~focused.tabIndex);
    };

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const press = key => ['down', 'up'].forEach(i => unsafeWindow[`onkey${i}`]({ keyCode: key }));

    let fsWaiting = false;
    const fastSplit = async(a) => { // a = true: was fast onesplit; a = false: was fast doublesplit
        if(fsWaiting) return;
        fsWaiting = true;
        setTimeout(() => void(fsWaiting = false), settings.fastsplit_hotkeys[a ? a === 1 ? 4 : 7 : 1].val + settings.fastsplit_hotkeys[a ? a === 1 ? 5 : 8 : 2].val);
        if([39, 37, 2, 4, 6].includes(currentServerId) || a || userPreferences.extraOneFastSplitDelay) await sleep(settings.fastsplit_hotkeys[a ? a === 1 ? 4 : 7 : 1].val);
        press(getKey("FreezeSelf"));
        await sleep(settings.fastsplit_hotkeys[a ? a === 1 ? 5 : 8 : 2].val);
        press(getKey("FreezeSelf"));
    }



    let cursorLockActivated = false, holdAutoFeed = false, _onblur;
    const waitForBlur = () => {
        if(unsafeWindow.onblur != null){
            const oldBlur = unsafeWindow.onblur;
            unsafeWindow.onblur = function(){
                spamRec = spamSpeed = splittingbots = false;
                keys = {};
                if(!settings.checkboxes[3].active){
                    $("#linesplit-markers div").hide();
                    linesplitting = false;
                }
                return oldBlur.apply(this, arguments);
            }
            _onblur = unsafeWindow.onblur;
        } else {
            setTimeout(waitForBlur, 400);
        }
    };
    waitForBlur();

    // hook for typing in chat w/ cursor lock
    const waitForKeyup = () => {
        if(unsafeWindow.onkeyup != null){
            const _keydown = unsafeWindow.onkeyup;
            unsafeWindow.onkeyup = function(){
                const keyCode = arguments[0]?.keyCode;
                if(arguments[0]?.target?.id === 'chtbox' && arguments[0]?.isTrusted && cursorLockActivated && keyCode === getKey('FixedMouse')) return;
                if(arguments[0]?.isTrusted && holdAutoFeed && [getKey('MacroFeed'), getKey('MultiFeed')].includes(keyCode)) return;
                return _keydown.apply(this, arguments);
            }
        } else {
            setTimeout(waitForKeyup, 400);
        }
    };
    waitForKeyup();

    const waitForSetGraphics = () => {
        if(unsafeWindow.onkeyup != null){
            const _setGraphics = unsafeWindow.setGraphics;
            unsafeWindow.setGraphics = (a, b) => userPreferences.preventAutoLowGraphics && b ? $("#curser").hide() : _setGraphics(a, b);
        } else {
            setTimeout(waitForSetGraphics, 400);
        }
    };
    waitForSetGraphics();

    const fsfbCustomBlur = function(){
        ['MacroSplit', ...(holdAutoFeed ? [] : ['MacroFeed', 'MultiFeed']), ...(cursorLockActivated ? [] : ['FixedMouse'])].forEach(id => unsafeWindow.onkeyup({keyCode: getKey(id)}));
        spamRec = spamSpeed = splittingbots = false;
        keys = {};
        if(!settings.checkboxes[3].active){
            $("#linesplit-markers div").hide();
            linesplitting = false;
        }
    }

    const toggleHoldFeed = active => {
        holdAutoFeed = active ?? !holdAutoFeed;
        unsafeWindow.onblur = holdAutoFeed || cursorLockActivated ? fsfbCustomBlur : _onblur;
        unsafeWindow[`onkey${holdAutoFeed ? 'down' : 'up'}`]({ keyCode: getKey('MacroFeed') });
    }

    const toggleCursorLock = active => {
        cursorLockActivated = active ?? !cursorLockActivated;
        unsafeWindow.onblur = holdAutoFeed || cursorLockActivated ? fsfbCustomBlur : _onblur;
        unsafeWindow[`onkey${cursorLockActivated ? 'down' : 'up'}`]({ keyCode: getKey('FixedMouse') });
    }
    unsafeWindow.fsfbCursorLock = toggleCursorLock;

    const toggleSetting = index => {
        let el = $('#' + settings.quickSettings[index].set);
        if($('#fsfb-settings-main')[0].contains(el[0])) el.prop('checked', !el.prop('checked')).trigger('change');
        else el.unbind().click();
    }

    Object.defineProperty(KeyboardEvent.prototype, 'keyCode', {
        get: function() {
            switch (this.key.toLowerCase()) {
                case settings.fastsplit_hotkeys[0]?.keyName.toLowerCase(): return getKey("Split");
                case settings.fastsplit_hotkeys[3]?.keyName.toLowerCase(): return getKey("DoubleSplit");
                case settings.fastsplit_hotkeys[6]?.keyName.toLowerCase(): return userPreferences.tripleFastSplitSetting ? getKey("TripleSplit") : this.which;
                default: return this.which;
            }
        }
    });

    let slowfeeding = !1, linesplitting = !1, hiddenUI = !1, splittingbots = !1, spamRec = !1, spamSpeed = !1;
    const pressed = e => {
        const key = e.which ? e.which : e.keyCode;
        if(document.activeElement.type === 'textarea') e.stopImmediatePropagation();
        if(typing() || keysChanging || e.key == undefined || e.keyCode == undefined) return;
        if(key === 27 && quickBuying){ // esc pressed
            quickBuying = false;
            $('#fsfb-quickbuy').removeClass('activatedInv');
            curserMsg('Quick buy deactivated.', 'red');
            $('.inventory-box').removeClass('fsfb-shown').find('p').show();
            e.preventDefault();
            e.stopImmediatePropagation();
        }
        if(key === settings.hotkeys[0].key){ // 7 feed
            let i = 1;
            let interval = setInterval(() => {
                press(getKey("MacroFeed"));
                if(++i > 7) clearInterval(interval);
            }, 85);
            e.preventDefault();
        }
        if(key === settings.hotkeys[1].key && !settings.checkboxes[3].active){ // linesplit lock
            linesplitting = true;
            linesplit();
            $("#linesplit-markers div").show();
            e.preventDefault();
        }
        if(key === settings.hotkeys[1].key && settings.checkboxes[3].active){ // linesplit lock
            linesplitting = !linesplitting;
            if(linesplitting){
                $("#linesplit-markers div").show();
                linesplit();
            } else {
                $("#linesplit-markers div").hide();
                $('#canvas').trigger($.Event('mousemove', {clientX: mosX, clientY: mosY})); // return mouse to where the cursor is
            }
            e.preventDefault();
        }
        if(key === settings.hotkeys[2].key){ // macro split bots
            splittingbots = true;
            const splittingBots = () => {
                if(!splittingbots) return;
                press(getKey("SplitBots"));
                setTimeout(splittingBots, 50);
            }
            splittingBots();
            e.preventDefault();
        }
        if(key === settings.hotkeys[3].key){ // hide ui
            _replaceCSS('hideUI-css', (hiddenUI = !hiddenUI) ? '.hideUI{ display: none !important; }' : '');
            e.preventDefault();
        }
        if(key === settings.hotkeys[4].key){ // toggle cursor lock
            toggleCursorLock();
            e.preventDefault();
        }
        if(key === settings.hotkeys[5].key){ // check profile
            const swal = $('.sweet-alert'),
                  swalText = swal.text();
            if((swalText.includes('Level: ') || swalText.includes('The selected player is not logged in or is playing in invisible mode.')) && swalText.includes('Not valid!')) $('button.confirm').click();
            if(mouseHoveringChat) $('#chtCanvas')[0].ondblclick({clientX: mosX, clientY: mosY, preventDefault: function(){}});
            else {
                let contextmenuShown = $('#contextMenu').css('display') == 'block';
                let evt = new MouseEvent("contextmenu", {
                    bubbles: true,
                    cancelable: true,
                    view: unsafeWindow,
                    clientX: mosX,
                    clientY: mosY
                });
                document.body.dispatchEvent(evt);
                if($('#contextPlayerSkin').css('background-color') == 'rgb(51, 51, 51)') curserMsg('Unable to show profile; no player was clicked on.', 'red');
                if(!contextmenuShown) $('#contextMenu').hide();
                $('#contextUserProfile').addClass('hover');
                $('#contextMenu')[0].onclick({stopPropagation: function(){}});
            }
            e.preventDefault();
        }
        if(key === getKey("FixedMouse")){ // real cursor lock key is pressed
            cursorLockActivated = false;
            unsafeWindow.onblur = _onblur;
        }
        if(e.keyCode != 0 && e.key.toLowerCase() === settings.fastsplit_hotkeys[0]?.keyName.toLowerCase()){ // fast onesplit
            fastSplit(0);
            e.preventDefault();
        }
        if(e.keyCode != 0 && e.key.toLowerCase() === settings.fastsplit_hotkeys[3]?.keyName.toLowerCase()){ // fast doublesplit
            fastSplit(1);
            e.preventDefault();
        }
        if(e.keyCode != 0 && e.key.toLowerCase() === settings.fastsplit_hotkeys[6]?.keyName.toLowerCase() && userPreferences.tripleFastSplitSetting){ // fast triplesplit
            fastSplit(2);
            e.preventDefault();
        }
        if(key === settings.slowFeed[0].key){ // toggle feed
            slowfeeding = !slowfeeding;
            const feeding = () => {
                if(!slowfeeding) return void(holdAutoFeed && toggleHoldFeed(false));
                unsafeWindow?.uisdoa?.foprw?.() || settings.slowFeed[1].val === 0 || press(getKey("MacroFeed"));

                settings.slowFeed[1].val === 0 ? toggleHoldFeed(slowfeeding) : setTimeout(feeding, settings.slowFeed[1].val);

            }
            feeding();
            e.preventDefault();
        }
        if(key === settings.frozenvirus[0].key){
            let fvEl = $('#invFrozenVirus'),
                wasActive = fvEl.hasClass('activatedInv');
            if(fvEl.css('display') === 'none') return void(curserMsg(`FSFB script can't click on the frozen virus powerup! Frozen viruses are needed before using this hotkey`, 'red'));
            curserMsg();

            wasActive || fvEl[0].onmousedown({ button: 0 });
            press(getKey("MacroFeed"));
            wasActive || setTimeout(() => fvEl[0].onmousedown({ button: 0 }), settings.frozenvirus[1].val);
        }
        if(key === settings.quickSettings[0].key){ // quick settings 1
            toggleSetting(0);
            e.preventDefault();
        }
        if(key === settings.quickSettings[1].key){ // quick settings 2
            toggleSetting(1);
            e.preventDefault();
        }
        if(key === settings.quickSettings[2].key){ //  quick settings 3
            toggleSetting(2);
            e.preventDefault();
        }
        if(key === settings.quickSettings[3].key){ // quick settings 4
            toggleSetting(3);
            e.preventDefault();
        }
        if(key === settings.quickSettings[4].key){ // quick settings 5
            toggleSetting(4);
            e.preventDefault();
        }
        if(key === settings.quickSettings[5].key){ // quick settings 6
            toggleSetting(5);
            e.preventDefault();
        }
        if(!spamRec && uisdoa && settings.checkboxes[6].active && key === getKey("Recombine")){
            spamRec = true;
            const spammingRec = () => {
                if(!spamRec) return;
                // press(getKey("keyRecombine"));
                if(unsafeWindow?.uisdoa?.foprc) uisdoa.foprc(1);
                setTimeout(spammingRec, 10);
            }
            spammingRec();
            e.preventDefault();
        }
        if(!spamSpeed && uisdoa && settings.checkboxes[6].active && key === getKey("Speed")){
            spamSpeed = true;
            const spammingSpeed = () => {
                if(!spamSpeed) return;
                // press(getKey("keySpeed"));
                if(unsafeWindow?.uisdoa?.foprc) uisdoa.foprc(0);
                setTimeout(spammingSpeed, 10);
            }
            spammingSpeed();
            e.preventDefault();
        }
    }

    const released = key => {
        if(typing() || keysChanging) return;
        if(key == settings.hotkeys[2].key) splittingbots = false; // macro split bots
        if(key == settings.hotkeys[1].key && !settings.checkboxes[3].active){ // linesplit lock
            linesplitting = false;
            $('#canvas').trigger($.Event('mousemove', {clientX: mosX, clientY: mosY})); // return mouse to where the cursor is
            $("#linesplit-markers div").hide();
        }
        if(spamRec && key === getKey("Recombine")) spamRec = false;
        if(spamSpeed && key === getKey("Speed")) spamSpeed = false;
    }


    const slowfeedhotkey = settings.slowFeed[0];
    // add slowfeed HTML
    $('#fsfb-sect-slowfeed').append(`<p class="hotkey-paragraph">Auto-Feed</p>`)
        .append(`<br><p>${slowfeedhotkey.title}</p><div id="${slowfeedhotkey.id}" class="fsfb-hotkey"></div>`)
        .append(`<br><p>${settings.slowFeed[1].title}</p><input id="${settings.slowFeed[1].id}" class="fsfb-hotkey" onkeypress="return onlyNumberKey(event)" maxlength="3"></input>`);

    $('#' + slowfeedhotkey.id).on('contextmenu', e => {
        $('#' + slowfeedhotkey.id).text('').removeClass('selected');
        slowfeedhotkey.active = false;
        slowfeedhotkey.key = 0;
        saveSettings();
        styleActiveSettings();
        e.preventDefault();
    });

    document.getElementById(settings.slowFeed[1].id).addEventListener("keypress", function(e){
        setTimeout(() => { // goes too fast or smth
            settings.slowFeed[1].val = +$('#' + settings.slowFeed[1].id).val();
            saveSettings();
        }, 5);
    });

    // add fastsplit HTML
    $('#fsfb-sect-fastsplit').append(`<p class="hotkey-paragraph">Fast-Split</p>`);
    // for(let i of settings.fastsplit_hotkeys){
    for(let j = 0; j < settings.fastsplit_hotkeys.length; j++){
        let i = settings.fastsplit_hotkeys[j];
        $('#fsfb-sect-fastsplit').append('val' in i ? `<br><p>${i.title}</p><input id="${i.id}" class="fsfb-hotkey" onkeypress="return onlyNumberKey(event)" maxlength="3"></input>` : `<br><p>${i.title}</p><div id="${i.id}" class="fsfb-hotkey"></div>`);
        if('val' in i){
            document.getElementById(i.id).addEventListener("keypress", function(e){
                setTimeout(() => { // goes too fast or smth
                    settings.fastsplit_hotkeys[j].val = +$('#' + i.id).val();
                    if($('#' + i.id).val() == "") settings.fastsplit_hotkeys[j].val = 0;
                    saveSettings();
                }, 5);
            });
        } else {
            $('#' + i.id).on('contextmenu', e => {
                $('#' + i.id).text('').removeClass('selected');
                i.active = false;
                i.key = 0;
                i.keyName = '';
                saveSettings();
                styleActiveSettings();
                e.preventDefault();
            });
        }
    }
    $('#fsfb-sect-frzvrs').append(`<p class="hotkey-paragraph">Frozen-Virus</p>`)
        .append(`<br><p>${settings.frozenvirus[0].title}</p><div id="${settings.frozenvirus[0].id}" class="fsfb-hotkey"></div>`)
        .append(`<br><p>${settings.frozenvirus[1].title}</p><input id="${settings.frozenvirus[1].id}" class="fsfb-hotkey" onkeypress="return onlyNumberKey(event)" maxlength="3"></input>`);

    $('#' + settings.frozenvirus[0].id).on('contextmenu', e => {
        $('#' + settings.frozenvirus[0].id).text('').removeClass('selected');
        settings.frozenvirus[0].active = false;
        settings.frozenvirus[0].key = 0;
        saveSettings();
        styleActiveSettings();
        e.preventDefault();
    });

    document.getElementById(settings.frozenvirus[1].id).addEventListener("keypress", function(e){
        setTimeout(() => { // goes too fast or smth
            settings.frozenvirus[1].val = +$('#' + settings.frozenvirus[1].id).val();
            saveSettings();
        }, 5);
    });


    // add quick settings HTML
    $('#fsfb-sect-quickSettings').append(`<p class="hotkey-paragraph">Quick Settings</p>`);

    for(let i of settings.quickSettings){
        $('#fsfb-sect-quickSettings').append(`<select id="${i.id1}" class="fsfb-quickchange"><option value="cDark">Dark Theme</option><option value="cFancyGrid">Fancy Grid</option><option value="cSectionGrid">Section Grid</option><option value="cGrid">Gridlines</option><option value="cSkins">Skins</option><option value="cWearables">Wearables</option><option value="cNames">Show Names</option><option value="cMinionNames">Minion Names</option><option value="cLargeNames">Large Names</option><option value="cNameOutlines">Name Outline</option><option value="cMass">Show Mass</option><option value="cFood">Show Food</option><option value="cFoodHalf">Half Food</option><option value="cCellAnimations">Cell Anim</option><option value="cSkinAnimations">Skin Anim</option><option value="cMapBorder">Map Border</option><option value="cCustomBack">Custom BG</option><option value="aCustomBack">Sounds</option><option value="cZoom">Infinite Zoom</option><option value="cFixedZoom">Fixed Zoom</option><option value="cSlowMotion">Slow-Motion</option><option value="cMinionUi">Minion Panel</option><option value="cLeaderboard">Leaderboard</option><option value="cChat">Chat</option><option value="cChatSize">Chat Large</option><option value="cMinimap">Minimap</option><option value="cFPS">FPS/Ping</option><option value="cColors">Cell Colors</option><option value="cCellBorders">Cell Borders</option><option value="cCellSpikes">Cell Spikes</option><option value="cClassicViruses">Classic Virus</option><option value="cPolygonShapes">Polygon Cells</option><option value="cLineShapes">Line Cells</option><option value="cBubbleCells">Bubble Cells</option><option value="cVisibilityStatus">Prof Visiblity</option><option value="cAllowPartyInvite">Party Inv</option><option value="cAllowPartyAnimations">Party Anim</option><option value="cIconDRank">Dono Icon</option><option value="cGoldCrownChat">Gold Icon</option><option value="fsfb-revcell">Rev Order</option><option value="fsfb-portalstop">Portals Top</option><option value="fsfb-hideminions">Hide Minions</option><option value="fsfb-nominionskins">No Bot Skins</option><option value="fsfb-hideejected">Hide All Ej.</option><option value="fsfb-hidestaticej">Hide Static Ej.</option><option value="fsfb-nodeathanim">No Death Anim</option><option value="fsfb-hideshouts">Hide Shouts</option><option value="fsfb-tranchat">Chat Trans</option><option value="fsfb-nc-public">PubNameCol</option></select><div id="${i.id}" class="fsfb-hotkey"></div>`);
        $('#' + i.id).on('contextmenu', e => {
            $('#' + i.id).text('').removeClass('selected');
            i.active = false;
            i.key = 0;
            saveSettings();
            styleActiveSettings();
            e.preventDefault();
        });
    };

    $('.fsfb-quickchange').on("change", function(){
        settings.quickSettings[+this.id.replace('fsfb-quick-select', '') - 1].set = this.value;
        saveSettings();
    });

    // add UI scaling
    $('#fsfb-sect-uiScale').append(`<p class="hotkey-paragraph">Game Scaling</p>`);
    for(let i of settings.uiScaling){
        $('#fsfb-sect-uiScale').append(`<div class="fsfb-slider"><p>${i.title}</p><input id="${i.id}" class="fsfb-slider" type="range" ${i.id == "fsfb-foodSize" ? `min="0.5" max="1.5" value="1" step="0.1"`: `min="1" max="9" value="5"`}></input></div>`);
        // $('#fsfb-sect-uiScale').append(`<div class="fsfb-slider"><p>${i.title}</p><input id="${i.id}" class="fsfb-slider" type="range" ${i.id == "fsfb-foodSize" ? `min="0.5" max="1.5" value="1" step="0.1"`: `min="1" max="9" value="5"`}></input></div>`);
        $( "#" + i.id).on('input', function() {
            changeSettings(this.id, $(this).val());
        });
    };


    let quickBuying = false;
    ['megaphone_shout', 'minion_nuker', 'freeze_yourself', 'ripple-virus'].forEach(elId => $('#invCloak').after(`<div class="inventory-box" id="fsfb-${elId}" style="display: none;"></div>`));
    $(settings.checkboxes[10] ? '#fsfb-megaphone_shout' : '#inv360Shot').after(`<div class="inventory-box" id="fsfb-quickbuy" style="display: none;"></div>`);
    $('#fsfb-quickbuy').on('click', function(){
        quickBuying = !quickBuying;
        if (quickBuying){
            $(this).addClass('activatedInv');
            curserMsg('Quick buy activated, click the powerup you would like to buy.', 'green');
            $('.inventory-box').addClass('fsfb-shown').find('p').hide();
            $('#invCloak').removeClass('fsfb-shown');
            $('#fsfb-quickbuy').removeClass('fsfb-shown');
        } else {
            $(this).removeClass('activatedInv');
            curserMsg('Quick buy deactivated.', 'red');
            $('.inventory-box').removeClass('fsfb-shown').find('p').show();
        }
    });



    const styleActiveSettings = () => {

        //  css selector :has() isn't fully supported at the moment, so gotta use jquery for the time being :(

        // #fsfb-settings-main p:has(+.fsfb-hotkey:not(:empty)) {
        //      color:#df901c;
        // }
        // #fsfb-settings-main .fsfb-hotkey:not(:empty) ~ p:has(+input.fsfb-hotkey):not(div.fsfb-hotkey:empty + * + p):not(div.fsfb-hotkey:empty + * + p + * + * + p) {
        //      color: #df901c;
        // }

        if(!userPreferences.stylizeActiveSettings) return;
        $('#fsfb-settings-main p:has(+div.fsfb-hotkey), #fsfb-settings-main select:has(+div.fsfb-hotkey)').each(function(){
            $(this)[$(this).is(':has(+.fsfb-hotkey:empty)') ? 'removeClass' : 'addClass']('fsfb-active-setting');
        })
        $('#fsfb-settings-main .fsfb-hotkey~ p:has(+input.fsfb-hotkey)').each(function(){
            $(this)[$(this).is('div.fsfb-hotkey:empty + * + p') || $(this).is('div.fsfb-hotkey:empty + * + p + * + * + p') ? 'removeClass' : 'addClass']('fsfb-active-setting');
        });
        $('input[type="range"].fsfb-slider').each(function(){
            $(this).prev()[this.value == this.getAttribute('value') ? 'removeClass': 'addClass']('fsfb-active-setting');
        })
    }

    // add lag detection settings to things
    let customCells = false;

    $("#fsfb-sect-theme>label>input").addClass('fsfb-ncustom');
    $('#fsfb-powsoverlay, #fsfb-mtchmass').addClass('fsfb-ncustom');
    $('#fsfb-check-Hazard, #fsfb-check-border').removeClass('fsfb-ncustom');
    $("#fsfb-revcell, #fsfb-portalstop, #fsfb-bublecell").removeClass('fsfb-ncustom');
    $('#fsfb-foodSize').prev().addClass('fsfb-lag');

    let antilagCells = false;

    let fillCells = false;
    $('#fsfb-bublecell, #fsfb-showmass, #fsfb-spikedcells, #fsfb-mtchmass, #fsfb-powsoverlay, #fsfb-anticloak, #fsfb-portalmass, #fsfb-nc-public, #fsfb-portalstop').addClass('fsfb-lag');

    $('#fsfb-powsoverlay, #fsfb-bublecell, #fsfb-anticloak').addClass('fsfb-nfill');

    let onlyCells = false;

    let strokeCells = false;
    $('#fsfb-bublecell, #fsfb-powsoverlay').addClass('fsfb-nstroke');

    let foodSizeOn = false;

    // let drawCells = false;
    // $('#fsfb-powsoverlay, #fsfb-portalmass').addClass('fsfb-ndraw');
    let customCellsChanged = false;

    let translateChanged = false, pwOverlayChanged = false;
    const changeSettings = (ID, active, e) => { // a = active, e = event (optional)
        for(let i of settings.uiScaling) if(i.id == ID) i.level = active;
        for(let i of settings.checkboxes) if(i.id == ID) i.active = active;
        for(let i of settings.export_import) if(i.id == ID) i.active = active;
        for(let i of settings.theme_boxes) if(i.id == ID) i.active = active;
        for(let i of settings.anti_lag) if(i.id == ID) i.active = active;
        for(let i of settings.chat_translate){
            if(i.id == ID){
                if(ID == "fsfb-tranchat" && (typeof GM_xmlhttpRequest != 'function') && e?.originalEvent?.isTrusted){
                    curserMsg('Fsfb script is unable to access the GM_xmlhttpRequest function. Chat translate won\'t work without this. This is often caused by not using the tampermonkey extension (or not the latest version).', 'red', 1e4);
                    $('#' + ID).prop('checked', false);
                    return;
                }
                translateChanged = true;
                i.active = active;
            }
        }
        for(let i of settings.theme){
            if(i.id == ID) i.active = active;
            if(i.id1 == ID) i.color = active;
        }
        for(let i of settings.name_color){
            if(i.id == ID) i.active = active;
            if(i.id1 == ID) i.color = active;
        }

        if(ID === "fsfb-portalstop" && !active) agmaioPortals.clear();

        if(ID == "fsfb-hideshouts") $('#megaholder')[`${active ? 'add' : 'remove'}Class`]('hideMegaphone');
        if(ID == "fsfb-qBuy") $('#fsfb-quickbuy')[active ? 'show' : 'hide'](); //.css('display', a ? 'flex' : 'hide');
        if(ID == "fsfb-pwsonerow"){
            $('#fsfb-quickbuy').detach().appendTo(`#inventory${active ? 2 : 1}`);
            [1, 2].forEach((i) => $("#inventory" + i).addClass("fsfb-inventories").css("order", active ? i : -i));
            _replaceCSS("css-invsingleline", active ? `#inventory{ display: flex; position: absolute; left: 50%; bottom: 8px; transform: translateX(-50%); } .fsfb-inventories { position: initial !important; transform: initial !important; }` : '');
        }


        let maxlen = $('#fsfb-nc-public').is(':checked') ? ($('#fsfb-box-ncs').is(':checked') ? 16 : 19) : 24;
        $('#nick').attr('maxlength', maxlen);
        if(ID == "fsfb-nc-public"){
            if(!active) pubNameSwitch = true;
            setTimeout(() => (pubNameSwitch = false), 25); // def nonoptimal, 2 lazy 2 fix
        }

        // client side colored name
        if(["fsfb-box-nc", "fsfb-box-ncs", "fsfb-nc-color", "fsfb-nc-stroke", "fsfb-nc-public"].includes(ID) && nameColors?.set){
            if(settings.name_color[0].active || ID === "fsfb-nc-public"){
                if(active && ID === "fsfb-nc-public" && !settings.name_color[1].active){

                    nameColors.set(defaultColorsAmnt, "#FFFFFF");
                    nameStrokes.set(defaultColorsAmnt, "#000000");
                } else {
                    nameColors.set(defaultColorsAmnt, settings.name_color[1].color);
                    nameStrokes.set(defaultColorsAmnt, settings.name_color[2].active ? settings.name_color[2].color : contrastColor(settings.name_color[1].color));
                }
                // warnings
                if(playerIsAlive()){
                    if(ID == "fsfb-nc-public" && !active){
                        curserMsg("Respawn to deactivate FSFB public custom name.", "red", 4e3, false);
                    } else {
                        curserMsg(`Respawn to update your name color!\nNote: FSFB Public Colored Name is <b>ONLY</b> visible to other FSFB script users!`, 'orange', 8e3, true);
                    }
                } else if(maxlen < 24 && ID == "fsfb-nc-public") {
                    curserMsg(`FSFB script's public custom name feature encodes the color in your clan tag; therefore, clan tags won't work with this feature enabled. The max nick length with the current settings is <b><u>${maxlen}</u></b>${settings.name_color[2].active ? `, deactivate Name Stroke to increase this to 19.` : '.'}\nPlease note: FSFB Public Colored Name is <b>ONLY</b> visible to other FSFB script users!`, "purple", 20e3, true);
                }
            } else {
                if((ID === "fsfb-nc-color" && !active) || !settings.name_color[1].active){
                    nameColors.set(defaultColorsAmnt, "#FFFFFF");
                    nameStrokes.set(defaultColorsAmnt, "#000000"); // again won't revert bc lazy
                } else {
                    nameColors.set(defaultColorsAmnt, settings.name_color[1].color);
                    nameStrokes.set(defaultColorsAmnt, settings.name_color[2].active ? settings.name_color[2].color : contrastColor(settings.name_color[1].color));
                }
            }
        }

        if(ID == "fsfb-bublecell" && $("#cBubbleCells").is(":checked") != active && e?.originalEvent?.isTrusted) $('#cBubbleCells').unbind().click();
        if(ID == "fsfb-showmass" && $("#cMass").is(":checked") != active && e?.originalEvent?.isTrusted) $('#cMass').unbind().click();

        if((ID == "fsfb-myskins" || ID == "fsfb-partyskins") && !$("#cSkins").is(":checked") && active) $('#cSkins').unbind().click();
        if((ID == "fsfb-mynick" || ID == "fsfb-partynicks") && !$("#cNames").is(":checked") && active) $('#cNames').unbind().click();

        if(ID == "fsfb-myskins" && active) $('#fsfb-partyskins').prop('checked', false).trigger('change');
        if(ID == "fsfb-partyskins" && active) $('#fsfb-myskins').prop('checked', false).trigger('change');

        if(ID == "fsfb-mynick" && active) $('#fsfb-partynicks').prop('checked', false).trigger('change');
        if(ID == "fsfb-partynicks" && active) $('#fsfb-mynick').prop('checked', false).trigger('change');

        if(ID == "fsfb-hideejected" && active) $('#fsfb-hidestaticej').prop('checked', false).trigger('change');
        if(ID == "fsfb-hidestaticej" && active) $('#fsfb-hideejected').prop('checked', false).trigger('change');

        if(ID == "fsfb-box-nc" && !active) $('#fsfb-box-ncs').prop('checked', false).trigger('change');


        if(ID == "fsfb-powsoverlay") svSwitch = true;

        let zoomLvl = "100%";
        let map = {
            1: 50,
            2: 70,
            3: 80,
            4: 90,
            5: 100,
            6: 110,
            7: 125,
            8: 150,
            9: 200
        }
        if(ID == "fsfb-invSize") $('#inventory').css('zoom', (map[+active] ?? 100)+ '%');
        if(ID == "fsfb-statsSize") $('#stats-container').css('zoom', (map[+active] ?? 100) + '%');


        let prevCustomCells = customCells;

        // lag settings
        customCells = $(".fsfb-ncustom, #fsfb-nc-public").is(":checked") || $('#fsfb-foodSize').val() != '1'; // || userPreferences.whiteBorder4BlackCells;
        fillCells = $('.fsfb-nfill').is(':checked');
        strokeCells = $('.fsfb-nstroke').is(':checked') || settings.checkboxes[2].active;;
        onlyCells = $('#fsfb-myskins, #fsfb-partyskins, #fsfb-mynick, #fsfb-partynicks').is(':checked') || ($('#fsfb-box-nc').is(':checked') && !$('#fsfb-nc-public').is(':checked')) || userPreferences.rainbowNameColor;
        antilagCells = $("#fsfb-sect-antilag>label>input").not('#fsfb-nodeathanim').is(':checked');
        foodSizeOn = $('#fsfb-foodSize').val() != '1';

        if(prevCustomCells != customCells && e?.originalEvent?.isTrusted) customCellsChanged = true;
        // if(customCellsChanged && e?.originalEvent?.isTrusted) setTimeout(() => (customCellsChanged = false), 25);
        if(customCellsChanged && e?.originalEvent?.isTrusted) setTimeout(() => (customCellsChanged = false), 25);

        styleActiveSettings();
        saveSettings();
    }

    // add event listeners
    let mosX, mosY,
        keys = {},
        keysChanging = false,
        mouseHoveringChat = false;


    $(document).on('click', e => {
        if(e.target.id.includes('fsfb')){
            for(let i = 0; i < settings.hotkeys.length; i++) checkHotkeyClicked(e, settings.hotkeys[i]);
            for(let i = 0; i < settings.fastsplit_hotkeys.length; i++) settings.fastsplit_hotkeys[i].val == null && checkHotkeyClicked(e, settings.fastsplit_hotkeys[i]);
            for(let i = 0; i < settings.quickSettings.length; i++) checkHotkeyClicked(e, settings.quickSettings[i]);
            checkHotkeyClicked(e, settings.slowFeed[0]); // slow feed
            checkHotkeyClicked(e, settings.frozenvirus[0]);
        }
        checkPowerupClicked(e);
    })
        .on('mousemove', e => {
        if(e.originalEvent == null || !e.originalEvent.isTrusted) return;
        mouseHoveringChat = e.target.id == 'chtCanvas';
        ({clientX: mosX, clientY: mosY} = e);
        if (linesplitting) linesplit();
    })
        .on("keydown", e => {
        // if(e.originalEvent == null || !e.originalEvent.isTrusted) return;
        if(keysChanging){
            for(let i = 0; i < settings.hotkeys.length; i++) checkNewHotkey(e, settings.hotkeys[i]);
            for(let i = 0; i < settings.fastsplit_hotkeys.length; i++) checkFsHotkey(e, settings.fastsplit_hotkeys[i]);
            for(let i = 0; i < settings.quickSettings.length; i++) checkNewHotkey(e, settings.quickSettings[i]);
            checkNewHotkey(e, settings.slowFeed[0]); // slow feed
            checkNewHotkey(e, settings.frozenvirus[0]);
        }
        if (!(e.keyCode in keys)){
            keys[e.keyCode] = !0;
            pressed(e);
        }
        keysChanging = false;
    })
        .on("keyup", e => {
        if(e.originalEvent == null || !e.originalEvent.isTrusted) return;
        delete keys[e.keyCode];
        released(e.keyCode);
        if(cursorLockActivated && e.keyCode == getKey("FixedMouse")){
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    })
        .on('mouseup', e => {
        if(e.which !== 1 || !e?.originalEvent?.isTrusted || !userPreferences.clickToCursorLock || cursorLockActivated) return;
        unsafeWindow.onkeyup({keyCode: getKey('FixedMouse')});
    });
    $('#canvas').on('mousedown', e => { // for mouse cursorlock
        if(e.which !== 1 || !e?.originalEvent?.isTrusted || !userPreferences.clickToCursorLock) return;
        if(cursorLockActivated){
            cursorLockActivated = false;
            unsafeWindow.onblur = _onblur;
        }
        unsafeWindow.onkeydown({keyCode: getKey('FixedMouse')})
    });

    let factsArr = typeof facts_list == 'undefined' ? null : facts_list.replace(/^\n|\n$/gm, '').split(/\n/gm);
    const randomFact = index => factsArr && (factsArr[index] ?? factsArr[~~(Math.random() * factsArr.length)]);


    const hashCode = (str, shift) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = (hash << shift) - hash + str.charCodeAt(i), hash |= 0;
        return str.length == 0 ? 0 : hash;
    };

    const RNG = (min, max) => Math.random() * (max - min) + min;

    // chat cmds
    if(userPreferences.extraChatCommands){
        const $chtbox = $('#chtbox');
        $chtbox.on('keydown', e => {
            if(e.keyCode != 13) return;

            if(userPreferences.messageBanWarning && /a\s*g\s*a\s*r\s*p\s*o\s*w\s*e\s*r/gmi.test($chtbox.val())){
                curserMsg("FSFB WARNING: FSFB script has censored your message as it has detected that your message may've contained a word/phrase that agma.io gives a 24 hour IP ban for. This FSFB feature can be disabled in the tampermonkey script settings.", 'red', 1e4);
                $chtbox.val($chtbox.val().replace(/a\s*g\s*a\s*r\s*p\s*o\s*w\s*e\s*r/gmi, match => '*'.repeat(match.length)));
            }

            let newMsg = '', cmdVerif, customCmd = false, firstMatch = $chtbox.val().match(new RegExp(`(?<=((^|(^\/party +)|(^\/pm +\\S+ ))${escapeRegExp(userPreferences.chatPrefix || "/f ")}))\\S+(\\s+\\S+)*(?=($|\\s+))`, 'gmi'));
            if(firstMatch == null) return;
            let[command, ...params] = firstMatch[0].split(/\s+/g);
            const originalMsg = $chtbox.val().replace(new RegExp(`(?<=((^|(^\/party +)|(^\/pm +\\S+ ))))${escapeRegExp(userPreferences.chatPrefix || "/f ")}${escapeRegExp(firstMatch[0])}(?=($|\\s+))`, 'gmi'), ''),
                  isolatedMsg = firstMatch[0].replace(new RegExp(command + '\\s', 'gi'), '');
            coinsInfo();
            xpInfo();

            /* ~~~ example of external chat cmds (can be used by other scripts) ~~~ */
            /*
            externalChatCmds = [
                {
                    commands: ['test1', 'test2', 'test3'],
                    callback: (command, isolatedMsg, params) => {
                        let newMsg = '';
                        return newMsg;
                    }
                },
                {
                    commands: ['eg1', 'eg2'],
                    callback: (cmd, isoMsg, params) => {
                        console.log(cmd, isoMsg, params);
                        alert('bru')
                        return '';
                    }
                }
            ]
            */

            let { externalChatCmds } = unsafeWindow;
            if(externalChatCmds?.length){
                for(let i of externalChatCmds){
                    if(i.commands.includes(command.toLowerCase())){
                        customCmd = true;
                        newMsg = i.callback(command.toLowerCase(), isolatedMsg, params);
                    }
                }
            }


            if(!customCmd && (cmdVerif ??= true)){
                switch(command.toLowerCase()){
                    case 'help':
                        $('#fsfb-extra-info')[0].click();
                        setTimeout(() => $('.fsfb-modal-body').scrollTop(1850), 200);
                        newMsg = '';
                        break;
                    case 'bots': case 'bot': case 'min': case 'mins': case 'minion': case 'minions': {
                        let minInfo = misc_settings.bots?.[currentUser], minsAmt, minsTimeRem;
                        $('#infoContent').children().each(function(){
                            if($(this).text().includes('Minion Time:')) minsTimeRem = $(this).find('span').text();
                            if($(this).text().includes('Minions:')) minsAmt = $(this).find('span').text();
                        });
                        if((minsChatAmt[currentUser] != null && minsChatAmt[currentUser]?.amt && !minsChatAmt[currentUser]?.started) && (minInfo == null || (minInfo && Date.now() > minInfo.currMs + minInfo.rem))){ /* || (minInfo && Date.now() > minInfo.currMs + minInfo.rem) */
                            newMsg = `Minion Pack Unstarted: ${minsChatAmt[currentUser].amt}`;
                        } else if(minsChatAmt[currentUser] != null && minsChatAmt[currentUser]?.started && minsChatAmt[currentUser]?.amt && minInfo == null ){
                            newMsg = `Minion Pack Activated: ${minsChatAmt[currentUser].amt}`;
                        } else if(!(minsAmt == '0' && minsTimeRem == '00:00:00') && minsChatAmt[currentUser] != null && minsChatAmt[currentUser].amt && minInfo != null && (minInfo.active || minsChatAmt[currentUser].started) && minInfo.rem - (Date.now() - minInfo.currMs) > 0){
                            newMsg = `Minion Pack Activated: ${minsChatAmt[currentUser].amt}, with ${msToTime(minInfo.rem - (Date.now() - minInfo.currMs))} remaining`;
                        } else if(!(minsAmt == '0' && minsTimeRem == '00:00:00') && minsAmt != null && minsTimeRem != null){
                            let timeArr = minsTimeRem.split(':'), msBotsTime = (3.6e6 * +timeArr[0]) + (6e4 * +timeArr[1]) + (1e3 * +timeArr[2]);
                            newMsg = `Minion Pack Activated: ${minsAmt}, with ${msToTime(msBotsTime)} remaining`;
                        } else {
                            newMsg = `Minion Pack Activated: none`;
                        }
                        break;
                    }
                    case 'pws': case 'pw': case 'powers': case 'power': case 'inv': case 'inventory': case 'pows': case 'powerups': {
                        curserMsg(`It's recommended to use ${userPreferences.chatPrefix + command}1, ${userPreferences.chatPrefix + command}2, and ${userPreferences.chatPrefix + command}3 instead, so your chat messages aren't cut-off by the chat maxlength`, 'red', 8e3);
                        updatePwCount();
                        newMsg = 'Inv: ';
                        for (let i = 0; i < 6; i++) {
                            newMsg = 'Inv: ';
                            for (let pw in pws) {
                                const check = index => i < index ? ' ' : '';
                                if (pws[pw] != '') newMsg += `${pws[pw]}${check(1)}${(i > 2 ? pw.slice(0, 6 - i) : pw)},${check(2)}`;
                            }
                            newMsg = newMsg.replace(/,[^,]*$/g, '');
                            if (newMsg.length <= 100) i = 6;
                        }
                        if (newMsg == 'Inv: ') newMsg = 'Inv: no powers';
                        break;
                    }
                    case 'totalpws': case 'totalpw': case 'totalpowers': case 'totalpower': case 'total': case 'totpw': case 'totalpows': case 'totalpowerups':
                        newMsg = `Total Powerups: ${$('.inventory-box>p').toArray().map(x => +x.innerText).reduce((a, b) => a + b).toLocaleString('en-US')}`
                        break;
                    case 'xplevel': case 'levelxp': case 'lvlxp': case 'xpcompleted': case 'xp':
                        newMsg = `XP Completed: ${currentPercent ? String(Math.round(currentPercent * currentLevel * 1e3, 1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "/" + (currentLevel * 1e3).toLocaleString('en-US') : "0/0"}`
                        break;
                    case 'level': case 'levels': case 'lvls': case 'lvl': case 'lvlcompleted': case 'lvlscompleted':
                        newMsg = `Level ${currentLevel}, with ${round(currentPercent * 100, 3)}% completed`
                        break;
                    case 'coin': case 'coins':
                        newMsg = `Coins: ${String(currentCoins).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                        break;
                    case 'hours': case 'hrs': case 'hour': case 'hr': case 'timeplayed':
                        newMsg = (isLogged() ? $('.timePlayed>span').text().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'Time Played: 0, not logged in');
                        break;
                    case 'rank': case 'lvlrank':
                        newMsg = `My Rank: ${isLogged() ? $('.ranking.text-left>span').text().match(/(?<=^Your rank: )\d+$/gm)?.[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '∞, not logged in'}`;
                        break;
                    case 'ping': case 'delay': case 'ms':
                        newMsg = `My Ping: ${$('#ping').text().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                        break;
                    case 'fps': case 'frames':
                        newMsg = `My FPS: ${$('#fps').text().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                        break;
                    case 'topmass': case 'highscore': case 'highmass': case 'highestmass':
                        newMsg = `My Top Mass: ${$('#topMass').text()}`
                        break;
                    case 'cells': case 'cellcount': case 'cell':
                        newMsg = `My Cell Count: ${$('#cellsAmount').text()}`
                        break;
                    case 'pw1': case 'pws1': case 'power1': case 'powers1': case 'inv1': case 'inventory1':
                        newMsg = getPowerMessage(1);
                        break;
                    case 'pw2': case 'pws2': case 'power2': case 'powers2': case 'inv2': case 'inventory2':
                        newMsg = getPowerMessage(2);
                        break;
                    case 'pw3': case 'pws3': case 'power3': case 'powers3': case 'inv3': case 'inventory3':
                        newMsg = getPowerMessage(3);
                        break;
                    case 'friends': case 'friend': case 'friendsonline': case 'friendonline':
                        newMsg = `Friends Online: ${$('#friendsLoggedInAmt').text() + $('#friendsTotalAmt').text()}`;
                        break;
                    case 'request': case 'requests': case 'friendrequest': case 'friendrequests': case 'friendreq': case 'req':
                        newMsg = `Friend Requests: ${$('#friendsRequestsAmt').text() === '' ? 'none' : $('#friendsRequestsAmt').text()}`;
                        break;
                    case 'gold': case 'goldmem': case 'goldmember': case 'golddays': case 'gm': {
                        const obj = accGoldMem[currentUser];
                        if(obj?.has == null){
                            newMsg = `Days of Goldmember Remaining: none`;
                            break;
                        }
                        newMsg = `Days Of Goldmember Remaining: ${obj.has || obj.days != null ? (obj.days + (obj.days == 1 ? ' Day' : ' Days')) : 'none'}`;
                        break;
                    }
                    case 'alive': case 'alivetime': case 'timealive':
                        newMsg = `Time Alive: ${playerIsAlive() ? msToTime(Date.now() - timeAlive) : 'not alive'}`;
                        break;
                    case 'mass': case 'currentmass':
                        newMsg = `Current Mass: ${playerIsAlive() ? currentMass.toLocaleString('en-US') : 'none, not alive'}`;
                        break;
                    case 'user': case 'username': case 'usr': case 'account': case 'acc':
                        newMsg = `My Username: ${currentUser == "Please Login First" ? "logged out" : currentUser}`
                        break;
                    case 'custom': case 'customs': case 'customskins': case 'totalcustoms':
                        if($('#publicSkinsPage').children().length == 0){
                            curserMsg(`Please load your custom skins before using this command`, 'red', 6e3);
                            newMsg = '';
                            break;
                        }
                        newMsg = `My Total Custom Skins: ${$('[id^="skinCustomImg"').length}, worth ${($('[id^="skinCustomImg"').length * 1e6).toLocaleString('en-US')}`
                        break;
                    case 'skins': case 'boughtskins': case 'ownedskins': case 'totalskins': {
                        if($('#skinsBuy [id^="skinContainer"]').length == 0){
                            curserMsg(`Please load your owned skins from the agma.io skin store`, 'red', 6e3);
                            newMsg = '';
                            break;
                        }
                        let ownedSkinsArr = [], edSkins = 0, totalValue = 0;
                        $('#skinsBuy [id^="skinUseBtn"]').each(function(){
                            ownedSkinsArr.push(+$(this)[0].id.match(/\d+$/gm)[0]);
                        })
                        for(let i of skinsArr){
                            if(ownedSkinsArr.includes(i.id)){
                                i.price > 2e6 ? ++edSkins : totalValue += i.price;
                            }
                        }
                        newMsg = `My Total Bought Skins: ${$('#skinsBuy [id^="skinUseBtn"').length}, worth ${totalValue.toLocaleString('en-US')} coins (${edSkins} lim. ed.)`;
                        break;
                    }
                    case 'ownedwearables': case 'wearables': case 'wears': case 'totalwearables': case 'totalwears': {
                        if(!$('#fsfb-wearsloaded').length){
                            curserMsg(`Please load your wearables before using this command`, 'red', 6e3);
                            newMsg = ''; // aft
                            break;
                        }
                        let wearsPrice = [0], edSkins = 0;
                        $('[id^="wearableUseBtn"]').each(function(){
                            if ($(this).parents().eq(0).siblings('p').text() == '(Limited Edition)') edSkins++;
                            wearsPrice.push(+$(this).parents().eq(0).siblings('span.win-price').text().replace(/,/g, ''));
                        });
                        newMsg = `My Total Wearables: ${$('[id^="wearableUseBtn"]').length}, worth ${sigma(wearsPrice).toLocaleString('en-US')} coins (${edSkins} lim. ed.)`;
                        break;
                    }
                    case 'cloak': case 'invis': case 'invisibility': {
                        let status, time;
                        $('#infoContent>p').each(function(){
                            if($(this).text().includes('Cloaked: ')) status = $(this).text().match(/(?<=Cloaked: ).+/gm);
                            if($(this).text().includes('Cloak Time: ')) time = $(this).text().match(/(?<=Cloak Time: ).+/gm);
                        })
                        newMsg = status == null || time == null ? `Cloak: inactive` : `Cloak ${status}, with ${time} remaining`;
                        break;
                    }
                    case 'addfriend': case 'add':
                        if(params?.length == 0){
                            curserMsg(`Please add a username after the command, such as: ${userPreferences.chatPrefix}${command} Fishyyy`, 'red', 6e3);
                            newMsg = '';
                            break;
                        }
                        unsafeWindow.friendAdd(params[0]);
                        break;
                    case 'partymembers': case 'partymember': case 'party':
                        newMsg = $('#partyContent').children().length - 1 > 0 ? `In a party, with ${$('#partyContent').children().length - 1} members` : `Party members: not in a party`;
                        break;
                    case 'players': case 'ply': case 'plyrs': case 'serverplayers': case 'totalplayers':{
                        let plyr_max = [0, 0]; // players[0] | maxplayers[1]
                        $('[id^="serverPlayers"]').each(function(){
                            plyr_max = plyr_max.map((n, i) => n + +this.innerText.split('/')[i]);
                        });
                        let serverBots = getServerValue('bots') ?? 0, totalbots = 0;
                        for(let server in svInfo){
                            totalbots += (svInfo[server].bots ?? 0);
                        }
                        newMsg = `Server Players: ${$('[id^="serverRow"].active>[id^="serverPlayers"]').text()}${serverBots ? ` (${serverBots} bots)` : ''}, Total Players: ${plyr_max[0].toLocaleString('en-US') + '/' + plyr_max[1].toLocaleString('en-US')} ${totalbots ? `(${totalbots} bots)` : ''}`;
                        break;
                    }
                    case 'server':
                        newMsg = `Currently playing in ${$('[id^="serverRow"].active>*').first().text()}`;
                        break;
                    case 'abil': case 'abils': case 'ability': case 'abilities': { // not finished
                        let arr = [], newStr = '';
                        $('.checkmark').each(function(){
                            if($(this).css('display') == 'block') arr.push($(this).siblings().eq(1).attr('item'));
                        })
                        if(misc_settings.abil?.[currentUser] != null || arr.length){
                            const abil = misc_settings.abil?.[currentUser],
                                  map = {
                                      18: 'Freeze',
                                      22: 'Invis Cloak',
                                      20: '2x Spawn',
                                      23: '2x Exp'
                                  }
                            if(currentUser == "Please Login First"){
                                newMsg = `Active Abilities: none`;
                                break;
                            }
                            for(let i of arr) newStr += map[i] + (abil?.[i] != null && 8.64e7 - (Date.now() - abil[i]) > 0 ? (' with ' + msToTime(8.64e7 - (Date.now() - abil[i])) + ' left, ') : ', ');
                            newMsg = `Active Abilities: ${newStr == '' ? 'none' : newStr}`;
                            newMsg = newMsg.replace(/,[^,]*$/g, '');
                        } else {
                            newMsg = `Active Abilities: none`;
                        }
                        break;
                    }
                    case 'xpproj': case 'xpprojected': case 'projectedxp': case 'projxp': case 'levelprojected': case 'lvlproj': case 'lvlprojected': {
                        const projectedHr = lastHrXP.length > 0 ? sigma(getProperty(lastHrXP.slice(-5), "gained")) * 12 : 0;
                        newMsg = `Next Hour Projected XP: ${xpStatsInPercentages ? round(convertToPerc(projectedHr, currentLevel) * 100, 2) + '%' : round(projectedHr).toLocaleString('en-US')}`;
                        break;
                    }
                    case 'projcoins': case 'projcoin': case 'projectedcoin': case 'projectedcoins': case 'coinsproj': case 'coinproj': case 'coinprojected': case 'coinsprojected': {
                        const projectedHr = lastHrCoins.length > 5 ? Math.round(sigma(getProperty(lastHrCoins.slice(-5), "gained")) * 12) : 0;
                        newMsg = `Next Hour Projected Coins: ${projectedHr.toLocaleString('en-US')}`;
                        break;
                    }
                    case 'xpremaining': case 'xprem': case 'remainingxp': case 'remxp': {
                        const xpRemaining = currentLevel ? currentLevel * 1e3 - currentPercent * currentLevel * 1e3 : 0;
                              newMsg = `XP Remanining: ${xpStatsInPercentages ? round(convertToPerc(xpRemaining, currentLevel) * 100, 2) + '%' : round(xpRemaining).toLocaleString('en-US')}`;
                        break;
                    }
                    case 'coinsremaining': case 'coinsrem': case 'remainingcoins': case 'remcoins': {
                        const coinsRemaining = currentCoins ? 25e4 - currentCoins % 25e4 : 0;
                        newMsg = `Coins Remanining: ${coinsRemaining.toLocaleString('en-US')}`;
                        break;
                    }
                    case 'xplasthour': case 'lasthourxp': case 'hrxp': case 'xphr': case 'hourxp': case 'xphour': {
                        const lastHr = lastHrXP.length > 0 ? sigma(getProperty(lastHrXP, "gained")) : 0;
                        newMsg = `XP Last Hour: ${xpStatsInPercentages ? round(convertToPerc(lastHr, currentLevel) * 100, 2) + '%' : round(lastHr).toLocaleString('en-US')}`;
                        break;
                    }
                    case 'coinslasthour': case 'lasthourcoins': case 'hrcoins': case 'coinshr': case 'hourcoins': case 'coinshour': {
                        const lastHr = lastHrCoins.length > 0 ? Math.round(sigma(getProperty(lastHrCoins, "gained"))) : 0
                        newMsg = `Coins Last Hour: ${lastHr.toLocaleString('en-US')}`;
                        break;
                    }
                    case 'xplastmin': case 'xplastminute': case 'lastminxp': case 'lastminutexp': case 'minxp': case 'minutexp': case 'xpmin': {
                        const lastMin = lastMinXP.length > 0 ? sigma(getProperty(lastMinXP, "gained")) : 0;
                        newMsg = `XP Last Minute: ${xpStatsInPercentages ? round(convertToPerc(lastMin, currentLevel) * 100, 2) + '%' : round(lastMin).toLocaleString('en-US')}`;
                        break;
                    }
                    case 'coinslastmin': case 'coinslastminute': case 'lastmincoins': case 'lastminutecoins': case 'coinsxp': case 'minutecoins': case 'coinsmin': {
                        const lastMin = lastMinCoins.length > 0 ? Math.round(sigma(getProperty(lastMinCoins, "gained"))) : 0;
                        newMsg = `Coins Last Minute: ${lastMin.toLocaleString('en-US')}`;
                        break;
                    }
                    case 'xplast12s': case 'xplast12sec': case 'xplast12seconds': case 'last12secondsxp': case 'lastminutexp': case 'xp12s': case '12sxp': case 'xp12sec': {
                        const last12sec = lastMinXP.length > 0 ? lastMinXP[lastMinXP.length - 1].gained : 0;
                        newMsg = `XP Last 12 Seconds: ${xpStatsInPercentages ? round(convertToPerc(last12sec, currentLevel) * 100, 2) + '%' : round(last12sec).toLocaleString('en-US')}`;
                        break;
                    }
                    case 'xpsession': case 'sessionxp': case 'xpsesh': case 'sesh': case 'seshxp': case 'online': {
                        const sessionXP = currentXP && accounts[currentUser] ? currentXP - accounts[currentUser].xp : 0;
                        newMsg = `Session XP: ${xpStatsInPercentages ? round(currentLevel && accounts[currentUser] ? ((round(currentPercent, 3) + currentLevel) - accounts[currentUser].lvl) * 100 : 0, 2) + '%' : round(sessionXP).toLocaleString('en-US')}, Session Length: ${msToTime(Date.now() - scriptStartXP)}`;
                        break;
                    }
                    case 'lifetimexp': case 'xplifetime':
                        newMsg = `Lifetime XP: ${round(currentXP ?? 0).toLocaleString('en-US')}`;
                        break;
                    case 'coinssession': case 'sessioncoins': case 'coinssesh': case 'seshcoins': {
                        const sessionCoins = currentCoins && accounts[currentUser] ? Math.round(currentCoins - accounts[currentUser].coins): 0;
                        newMsg = `Session Coins: ${sessionCoins.toLocaleString('en-US')}, Session Length: ${msToTime(Date.now() - scriptStartCoins)}`;
                        break;
                    }
                    case 'ratewaifu': case 'waifu': case 'waifurating': case 'waifurate': case 'howwaifu':
                        cmdVerif = false;
                        if(params?.length == 0){
                            if(currentUser == "Please Login First"){
                                newMsg = `My Waifu Rating: 0 / 10`;
                                break;
                            }
                            newMsg = `My Waifu Rating: ${Math.round(+String(Math.round(hashCode(currentUser, 5) * 102.2)).slice(-3, -1) / 10)} / 10`;
                            break;
                        }
                        newMsg = `${params[0]}'s Waifu Rating: ${Math.round(+String(Math.round(hashCode(params[0], 5) * 102.2)).slice(-3, -1) / 10)} / 10`;
                        break;
                    case 'ratepro': case 'pro': case 'prorating': case 'prorate': case 'howpro':
                        cmdVerif = false;
                        if(params?.length == 0){
                            if(currentUser == "Please Login First"){
                                newMsg = `I am 0% pro`;
                                break;
                            }
                            newMsg = `I am ${Math.round(+String(Math.round(hashCode(currentUser, 5) * 194.3)).slice(-4, -1) / 10)}% pro`;
                            break;
                        }
                        newMsg = `${params[0]} is ${Math.round(+String(Math.round(hashCode(params[0], 5) * 194.3)).slice(-4, -1) / 10)}% pro`;
                        break;
                    case 'ratedog': case 'dog': case 'dograting': case 'dograte': case 'howdog':
                        cmdVerif = false;
                        if(params?.length == 0){
                            if(currentUser == "Please Login First"){
                                newMsg = `I am 0% dog`;
                                break;
                            }
                            newMsg = `I am ${Math.round(+String(Math.round(hashCode(currentUser, 6) * 189.3)).slice(-4, -1) / 10)}% dog`;
                            break;
                        }
                        newMsg = `${params[0]} is ${Math.round(+String(Math.round(hashCode(params[0], 6) * 189.3)).slice(-4, -1) / 10)}% dog`;
                        break;
                    case 'rateking': case 'king': case 'kingrating': case 'kingrate': case 'howking':
                        cmdVerif = false;
                        if(params?.length == 0){
                            if(currentUser == "Please Login First"){
                                newMsg = `I am 0% king`;
                                break;
                            }
                            newMsg = `I am ${Math.round(+String(Math.round(hashCode(currentUser, 5) * 389.3)).slice(-4, -1) / 10)}% king`;
                            break;
                        }
                        newMsg = `${params[0]} is ${Math.round(+String(Math.round(hashCode(params[0], 5) * 389.3)).slice(-4, -1) / 10)}% king`;
                        break;
                    case 'dice': case 'die': case 'roll': case 'rolldice': {
                        const sides = params?.length == 0 || isNaN(+params[0]) ? 6 : +params[0];
                        newMsg = `Rolled a dice with ${sides.toLocaleString('en-US')} sides, landed on ${Math.round(RNG(1, sides)).toLocaleString('en-US')}`;
                        break;
                    }
                    case 'rng': case 'random': case 'randomnumber': case 'number': case 'num': {
                        const min = params?.length < 1 || isNaN(+params[0]) ? 0 : +params[0];
                        const max = params?.length < 2 || isNaN(+params[1]) ? min + 10 : +params[1];
                        if(min > max){
                            curserMsg(`Please make sure your minimum (${min}) is less than your maximum (${max})`, 'red', 5e3);
                            newMsg = '';
                            break;
                        }
                        newMsg = `Generated a random number between ${min.toLocaleString('en-US')} and ${max.toLocaleString('en-US')}, chose: ${Math.round(RNG(min, max)).toLocaleString('en-US')}`;
                        break;
                    }
                    case 'ratefriends': case 'friendsrating': case 'friendsrate': case 'howfriends':
                        cmdVerif = false;
                        if(params?.length == 0){
                            if(currentUser == "Please Login First"){
                                newMsg = `I am 0% friends with a frog`;
                                break;
                            }
                            newMsg = `I am ${Math.round(+String(Math.round(hashCode(currentUser, 4) * 283.7)).slice(-4, -1) / 10)}% friends with a frog`;
                            break;
                        }
                        if(params?.length == 1){
                            if(currentUser == "Please Login First"){
                                newMsg = `I am 0% friends with a ${params[0]}`;
                                break;
                            }
                            newMsg = `I am ${Math.round(+String(Math.round(hashCode(currentUser, 4) * 283.7) + Math.round((hashCode(params[0], 5) * 405.2))).slice(-4, -1) / 10)}% friends with a ${params[0]}`;
                            break;
                        } else {
                            newMsg = `${params[0]} is ${Math.round(+String(Math.round(hashCode(params[0], 4) * 283.7) + Math.round((hashCode(params[0], 5) * 405.2))).slice(-4, -1) / 10)}% friends with ${params[1]}`;
                            break;
                        }
                    case 'rateenemies': case 'enemiesrating': case 'enemiesrate': case 'howenemies': case 'enemies':
                        cmdVerif = false;
                        if(params?.length == 0){
                            if(currentUser == "Please Login First"){
                                newMsg = `I am 0% enemies with a frog`;
                                break;
                            }
                            newMsg = `I am ${Math.round(+String(Math.round(hashCode(currentUser, 4) * 164.45)).slice(-5, -2) / 10)}% enemies with a frog`;
                            break;
                        }
                        if(params?.length == 1){
                            if(currentUser == "Please Login First"){
                                newMsg = `I am 0% enemies with a ${params[0]}`;
                                break;
                            }
                            newMsg = `I am ${Math.round(+String(Math.round(hashCode(currentUser, 4) * 164.45) + Math.round((hashCode(params[0], 5) * 405.2))).slice(-5, -2) / 10)}% enemies with a ${params[0]}`;
                            break;
                        } else {
                            newMsg = `${params[0]} is ${Math.round(+String(Math.round(hashCode(params[0], 4) * 164.45) + Math.round((hashCode(params[0], 5) * 405.2))).slice(-5, -2) / 10)}% enemies with ${params[1]}`;
                            break;
                        }
                    case 'flip': case 'coinflip': case 'heads': case 'tails': case 'flipcoin': {
                        newMsg = `Coin flipped! Landed on ${Math.round(RNG(0, 1)) ? 'heads' : 'tails'}`;
                        break;
                    }
                    case 'script': case 'version': case 'fsfb': case 'v':
                        newMsg = `Using fsfb script! Version ${version}`
                        break;
                    case 'time': case 'localtime': case 'localetime': case 'date':
                        newMsg = `My Time: ${new Date().toLocaleString()}`
                        break;
                    case 'leaderboard': case 'leader': case 'lb':
                        newMsg = `My leaderboard position: ${!playerIsAlive() || leaderboardPos == null ? 'none, not alive' : leaderboardPos}`;
                        break;
                    case 'altcaps': case 'altcap': case 'altscaps': case 'altscap':
                        newMsg = isolatedMsg.toLowerCase().split('').map((v, i) => i % 2 == 0 ? v : v.toUpperCase()).join('');
                        cmdVerif = false;
                        break;
                    case 'sparkles': case 'sprk':
                        newMsg = '✨' + isolatedMsg + '✨';
                        cmdVerif = false;
                        break;
                    case 'cfix': case 'canvasfix': {
                        document.querySelectorAll('canvas').forEach(canvas => ({ innerWidth: canvas.width, innerHeight: canvas.height } = unsafeWindow));
                        // const canvas = document.querySelector('#canvas');
                        // ({ innerWidth: canvas.width, innerHeight: canvas.height } = unsafeWindow);
                        curserMsg('Canvas was reset.', 'green', 5e3);
                        newMsg = '';
                        break;
                    }
                    case 'solo': case 'soloserver': // message from Miracle Scripts (another great agma script) - https://greasyfork.org/scripts/391142
                        newMsg = ':warning: SOLO SERVER :warning: No teaming!! No hay equipo!! Pas d\'équipe!! Kein Teaming!! لا فريق';
                        cmdVerif = false;
                        break;
                    case 'facts': case 'fact': case 'funfact': {
                        const fact = randomFact();
                        newMsg = fact ? randomFact() : '';
                        fact ?? curserMsg(`Fsfb is unable to access the list of facts. Possible cause: not using tampermonkey or not using the latest version of tampermonkey.`, 'red', 6e3);
                        break;
                    }
                    case 'fastsplit': case 'fs': case 'fastsplits': case 'fastsplitdelay': case 'delay': {
                        const fs = settings.fastsplit_hotkeys;
                        newMsg = `My fast onesplit delays: ${fs[1].val}, ${fs[2].val}; fast double: ${fs[4].val}, ${fs[5].val}; fast triple: ${fs[7].val}, ${fs[8].val}`;
                        break;
                    }
                    case "dailyprogress": case "dailychallenge": case "progress": case "challengeprogress": case "challenge": case "challenges": {
                        let progress = +$("#challengeProgress").text();
                        let goal = +$("#challengeGoal").text();
                        let percent = ((progress / goal) * 100).toFixed(1);
                        newMsg = `Daily Challenge Progress: ${progress.toLocaleString('en-US')} / ${goal.toLocaleString('en-US')} (${percent}% completed)`;
                        break;
                    }
                    case "sp": case "sorapoint": case "sorapoints": case "sps": {
                        let soraPoints = +$('.sora-points-inv.chall-mythic').text();
                        newMsg = `Sora Points: ${soraPoints.toLocaleString('en-US')}`;
                        break;
                    }
                    case "keys": case "key": case "challengekeys": case "challengekey": {
                        let challengeKeys = +$('.mystery-keys.chall-mythic').text();
                        newMsg = `Challenge Keys: ${challengeKeys.toLocaleString('en-US')}`;
                        break;
                    }
                    case "stars": case "challengestars": case "challengestar": case "star": {
                        let challengeStars = +$('.challenge-stars.chall-mythic').text();
                        newMsg = `Challenge Stars: ${challengeStars.toLocaleString('en-US')}`;
                        break;
                    }
                    case "lastshout": case "lshout":
                        $chtbox.blur();
                        if(shouts.length == 0){
                            swal({
                                title: "No shouts detected.",
                                type: "error"
                            });
                        } else {
                            let shout = shouts[shouts.length-1];
                            let wasRemoved = false;
                            if(shout.isModerator == true && shouts.length >= 2){
                                shout = shout[shouts.length-2];
                                wasRemoved = true;
                            }

                            swal({
                                title: "Last shout info:",
                                text: `
Nickname: ${shout.name} \n
Message: ${shout.message} \n
Translated: ${shout.messageTranslated} \n
Time: ${(new Date(shout.time)).toString()} \n
Was Removed: ${wasRemoved ? "Yes" : "No"}
                                    `,
                                type: "info"
                            });
                            newMsg = "";

                        }
                        $chtbox.blur();
                        break;
                    case "allshouts": case "dumpshouts": {
                        $chtbox.blur();
                        console.log("Collected shouts:");
                        for(let shout of shouts){
                            console.log(`
Nickname: ${shout.name}
Message: ${shout.message}
Translated: ${shout.messageTranslated}
Time: ${(new Date(shout.time)).toString()}

                            `);
                            newMsg = "";
                        }
                        console.log("Total: ", shouts.length , "shouts");
                        swal({
                            title: "Dumped " + shouts.length + " shouts into console.",
                            type: "info"
                        });
                        break;
                    }
                    default:
                        newMsg = $chtbox.val();
                        return;
                }
            }
            // (unsafeWindow.kfjsdafl != null) ? $chtbox.val(newMsg) : $chtbox.val(''), console.log(newMsg);;
            $chtbox.val(newMsg == '' ? '' : originalMsg + (newMsg?.[cmdVerif ? 'replace' : '']?.(/[youaie](?!.: )/gmi, m => cmap[m]) || newMsg));
        })
    }

    // check if player is alive
    let playerAlive = false, timeAlive;
    const playerIsAlive = () => playerAlive && $('#advert').css('display') != 'none' ? false : playerAlive;
    unsafeWindow.playerIsAlive = playerIsAlive;


    const _setNick = unsafeWindow.setNick;
    unsafeWindow.setNick = function(){
        if(userPreferences.messageBanWarning && /a\s*g\s*a\s*r\s*p\s*o\s*w\s*e\s*r/gmi.test(arguments[0])){
            curserMsg("FSFB WARNING: FSFB script has censored your nickname as it has detected that your nickname may've contained a word/phrase that agma.io gives a 24 hour IP ban for. This FSFB feature can be disabled in the tampermonkey script settings.", 'red', 1e4);
            const newNick = (arguments[0].replace(/a\s*g\s*a\s*r\s*p\s*o\s*w\s*e\s*r/gmi, match => '*'.repeat(match.length)));
            arguments[0] = newNick;
            document.getElementById('nick').value = newNick;
        }
        if(settings.name_color[0].active && settings.name_color[1].active && arguments[0] != '' && (!/^\[(?:\W{3}|\W{6})\]/gmi.test(arguments[0]) || arguments[0] === document.querySelector('#nick')?.value)){ // check if name already has color tag
            const tag = `[${encodeCustomNameColor(settings.name_color[1].color)}${settings.name_color[2].active ? encodeCustomNameColor(settings.name_color[2].color) : ''}]`;
            arguments[0] = tag + arguments[0];
        }

        if(arguments[1] || !playerAlive) timeAlive = Date.now(); // respawned
        playerAlive = true;
        setTimeout(() => { svSwitch = true, agmaioPortals.clear(); }, 1000);
        return _setNick.apply(this, arguments);
    }

    const _closeAdvert = unsafeWindow.closeAdvert
    unsafeWindow.closeAdvert = function(){
        playerAlive = false;
        return _closeAdvert.apply(this, arguments);
    }

    const getPowerMessage = line => {
        let obj = {};
        [1, 2, 3].forEach(n => (obj[`string${n}`] = `Inv (${n}/?): `));
        updatePwCount();
        const newPws = {
            Recombine: pws.rec,
            Speed: pws.spd,
            Growth: pws.grw,
            Virus: pws.vrs,
            Mothercell: pws.mtcl,
            Portal: pws.prtl,
            'Gold Block': pws.gblk,
            Freeze: pws.fz,
            Push: pws.psh,
            Wall: pws.wall,
            'Anti-Freeze': pws.afz,
            'Anti-Recombine': pws.arc,
            Shield: pws.shld,
            'Frozen Virus': pws.fvs
        }
        for(let i in newPws){
            let add = newPws[i] == '' ? '' : `${newPws[i]} ${i}, `;
            if(obj.string1.length + add.length <= 100) obj.string1 += add;
            else if(obj.string2.length + add.length <= 100) obj.string2 += add;
            else obj.string3 += add;
        }
        if(obj.string1 == `Inv (1/?): ` && line == 1) return 'Inv (1/1): no powers';
        if(obj['string' + line] == `Inv (${line}/?): `){
            curserMsg(`This inventory line doesn't exist! Try a smaller number`, 'red', 6e3);
            return '';
        }
        let totalLines = 1;
        if(obj.string3 == 'Inv (3/?): ' && obj.string2 != 'Inv (2/?): ') totalLines = 2;
        else if(obj.string3 != 'Inv (3/?): ' && obj.string2 != 'Inv (2/?): ') totalLines = 3;
        return obj['string' + line].replace(/,[^,]*$/g, '').replace(/\?/g, totalLines);
    }

    let pws = {rec: '', spd: '', grw: '', vrs: '', mtcl: '', prtl: '', gblk: '', fz: '', psh: '', wall: '', afz: '', arc: '', shld: '', fvs: ''};
    const updatePwCount = () => {
        $('.inventory-box').each(function(){
            const map = {
                Wall : 'wall',
                AntiFreeze: 'afz',
                AntiRecombine: 'arc',
                Shield: 'shld',
                FrozenVirus: 'fvs',
                Recombine: 'rec',
                Speed: 'spd',
                Growth: 'grw',
                SpawnVirus: 'vrs',
                SpawnMothercell: 'mtcl',
                SpawnPortal: 'prtl',
                SpawnGoldOre: 'gblk',
                Freeze: 'fz',
                '360Shot': 'psh'
            }
            if(map[$(this)[0]?.id.slice(3)] != null) pws[map[$(this)[0].id.slice(3)]] = $(this).css('display') != 'none' ? $(this).children().eq(0).text() || '1' : '';
        })
    }

    $('#fsfb-export-btn').on('click', () => {
        if(!$('#fsfb-sect-imexport>label>input').is(':checked')) return void(curserMsg('You need to select at least one setting to export!', 'red'));
        if($('#fsfb-custom-bg').is(':checked')) curserMsg('Exporting settings with a custom background is likely to increase the file size', 'red', 8e3);
        let script_settings = {},
            script_themes = {};
        for (let i in settings) { // put the settings & themes into different objects
            if (i == "theme" || i == "theme_boxes" || i == "name_color") script_themes[i] = settings[i];
            else if (i != "export_import") script_settings[i] = settings[i];
        }
        let bgImg = null;
        const downloadFile = () => {
            let obj = {
                selected: {
                    game_settings: $('#fsfb-game-settings').is(':checked'),
                    game_controls: $('#fsfb-game-controls').is(':checked'),
                    game_background: $('#fsfb-custom-bg').is(':checked'),
                    script_settings: $('#fsfb-script-settings').is(':checked'),
                    script_theme: $('#fsfb-theme-settings').is(':checked')
                },
                game_settings: localStorage.settings,
                game_controls: localStorage.hotkeys,
                game_background: bgImg,
                script_settings: script_settings,
                script_theme: script_themes
            }
            // if the setting is turned off, then dont need to export it - set it to null
            for(let i in obj){
                if(i != 'selected' && !obj.selected[i]) obj[i] = null;
            }
            const a = document.createElement('a'),
                  file = new Blob([JSON.stringify(obj)], {type: "text/plain"});
            a.href = URL.createObjectURL(file);
            a.download = "fsfb script settings";
            a.click();
            URL.revokeObjectURL(a.href); // download a txt file of exported settings
        }
        if($('#fsfb-custom-bg').is(':checked')){
            let db, req = unsafeWindow.indexedDB.open("AgmaDB", 1);
            req.onsuccess = function (x) {
                db = req.result;
                db.onclose = (c) => { db = null; }
                db.onversionchange = (c) => { db.close(), db = null; }
                let _ = db.transaction("general", "readonly").objectStore("general").get("cbgDataURL");
                _.onsuccess = () => {
                    bgImg = _.result;
                    downloadFile();
                }
            }, req.onupgradeneeded = function (c) {
                let req = c.target.result;
                if (!req.objectStoreNames.contains("general")) {
                    req.createObjectStore("general");
                    downloadFile();
                } else downloadFile();
            };
        } else {
            downloadFile();
        }
    });

    $('#fsfb-import-btn').on('click', () => {
        if(!$('#fsfb-sect-imexport>label>input').is(':checked')) return void(curserMsg('You need to select at least one setting to import!', 'red'));
        if($('#fsfb-custom-bg').is(':checked')) curserMsg('Pasting in settings that include a background image is likely to cause initial lag', 'red', 0);
        swal({
            title: "Import Settings",
            text: "Add your exported settings below and press OK to continue.",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Paste exported settings here"
        },
             function(inputVal){
            if (inputVal == null) return false;
            if (inputVal == "") {
                swal.showInputError("Please don't leave the input empty!");
                return false
            }
            try {
                let val = JSON.parse(inputVal);
                if(val.selected.script_settings && $('#fsfb-script-settings').is(':checked')){
                    for (let i in val.script_settings) {
                        for (let j in val.script_settings[i]) {
                            for(let x in settings){
                                for(let y in settings[x]){
                                    if(val.script_settings[i][j].id == settings[x][y].id) settings[x][y] = val.script_settings[i][j];
                                }
                            }
                        }
                    }
                }
                if(val.selected.script_theme && $('#fsfb-theme-settings').is(':checked')){
                    for (let i in val.script_theme) {
                        for (let j in val.script_theme[i]) {
                            for(let x in settings){
                                for(let y in settings[x]){
                                    if(val.script_theme[i][j].id == settings[x][y].id) settings[x][y] = val.script_theme[i][j];
                                }
                            }
                        }
                    }
                }
                if(val.selected.game_settings && $('#fsfb-game-settings').is(':checked')) localStorage.setItem('settings', val.game_settings);
                if(val.selected.game_controls && $('#fsfb-game-controls').is(':checked')) localStorage.setItem('hotkeys', val.game_controls);
                if(val.selected.game_background && $('#fsfb-custom-bg').is(':checked')){
                    let db, req = unsafeWindow.indexedDB.open("AgmaDB", 1);
                    req.onsuccess = function (x) {
                        db = req.result;
                        db.onclose = (c) => { db = null; }
                        db.onversionchange = (c) => { db.close(), db = null; }
                        let _ = db.transaction("general", "readwrite").objectStore("general").put(val.game_background, "cbgDataURL");
                    }, req.onupgradeneeded = function (c) {
                        let req = c.target.result;
                        if (!req.objectStoreNames.contains("general")) {
                            req.createObjectStore("general");
                        }
                    };
                }
                // if any agma controls were imported, need to refresh bc it's set using localstorage
                if((val.selected.game_settings && $('#fsfb-game-settings').is(':checked')) || (val.selected.game_controls && $('#fsfb-game-controls').is(':checked')) || (val.selected.game_background && $('#fsfb-custom-bg').is(':checked'))){
                    swal({
                        title: "Please Refresh!",
                        text: "Refreshing the page is required for your imported agma settings to take effect",
                        type: "warning",
                    });
                } else swal({ title: "Settings Successfully Imported!", type: "success" });
                saveSettings();
                styleActiveSettings();
                updateScriptSettingsUI();
            } catch (error){
                swal({
                    title: "Something went wrong!",
                    text: "Please make sure you've entered in valid settings",
                    type: "error"
                });
            }
        });

    });

    $('#fsfb-settings-right').append(`<div class="fa fa-2x fa-info-circle" id="fsfb-extra-info" data-toggle="modal" data-target=".fsfb-bug-modal"></div>`)

    if(userPreferences.hideAds){
        localStorage.ad_l_time = "9e99"; // smth like time since last ad
        $('[id^="agma-io_"], [id^="adWrapper"], #preroll').addClass("fsfb-removeAds"); // move ads way off the screen
    } else if(localStorage.ad_l_time == "9e99")localStorage.ad_l_time = Date.now();

    let {innerWidth: width, innerHeight: height} = unsafeWindow;
    $(unsafeWindow).on('resize', () => ({innerWidth: width, innerHeight: height} = unsafeWindow));

    let pointMove;
    const linesplit = () => {
        if(!linesplitting) return;
        let closest, points = [{n: "top", x: width / 2, y: 0, nx: width / 2, ny: -10e6}, {n: "bottom", x: width / 2, y: height, nx: width / 2, ny: 10e6}, {n: "left", x: 0, y: height / 2, nx: -10e6, ny: height / 2}, {n: "right", x: width, y: height / 2, nx: 10e6, ny: height / 2}];
        if(userPreferences.linesplitClosestSide){
            let closestSide = [mosY / height, (height - mosY) / height, mosX / width, (width - mosX) / width]; // top, bottom, left, right
            closest = points[closestSide.indexOf(Math.min(...closestSide))];
        } else {
            let distance = p => Math.sqrt(Math.pow(mosX - p.x, 2) + Math.pow(mosY - p.y, 2)),
                closestPoint = points.reduce((a, b) => distance(a) < distance(b) ? a : b);
            for (let i = 0; i < points.length; i++) {
                if (closestPoint.x == points[i].x && closestPoint.y == points[i].y) closest = points[i]
            }
        }
        pointMove = {x: closest.nx, y: closest.ny};
        $('#canvas').trigger($.Event('mousemove', { clientX: closest.nx, clientY: closest.ny }));
        $("#linesplit-markers div").css('background-color', 'transparent');
        $('#linesplit-' + closest.n).css('background-color', '#e25615');
    }

    let confBtns = document.getElementsByClassName('purchase-btn confirmation');
    const btnsArr = Array.from(document.getElementsByClassName('purchase-btn confirmation'));

    const changeHTML = (index, price, id, name) => {
        setTimeout(() => {
            const amtDropdown = document.getElementById('shopAmountDropdown')
            document.getElementsByClassName('sweet-alert showSweetAlert')[0].childNodes[7].firstChild.textContent = 'If you click "Buy", you will purchase this item. It will cost ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' in total.';
            const dropdownChange = () => {
                if (amtDropdown.value == "custom") return buyCstmAmt(price, id, name);
                let priceSum = (amtDropdown.value * price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementsByClassName('sweet-alert showSweetAlert')[0].childNodes[7].firstChild.textContent = 'If you click "Buy", you will purchase this item. It will cost ' + priceSum + ' in total.';
            };
            amtDropdown.addEventListener('change', dropdownChange);
        }, 50);
    };
    const buyCstmAmt = (price, id, name) => {
        swal({
            title: "Enter Purchase Amount",
            text: "<span>How many <b>" + name + "</b> would you like to buy?</span>",
            html: true,
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            inputPlaceholder: "Input amount here"
        },
             function(input){
            let pwAmt = +input,
                priceTotal = pwAmt * price;
            if (input == null) return false;
            if (input == "") {
                swal.showInputError("Please don't leave the input empty!");
                return false
            }
            if(!/^[0-9]+$/.test(input) || !(+input >>> 0 === parseFloat(+input))){
                swal.showInputError("Please only enter positive integers!");
                return false
            }
            swal({
                title: ' Confirm ',
                text: '<p>If you click "Buy", you will purchase this item. It will cost ' + priceTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' in total.<br><small>You chose to purchase ' + pwAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' <b>' + name + '</b></small></p>',
                html: true,
                type: 'warning',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonColor: '#4caf51',
                confirmButtonText: 'Yes, confirm purchase',
                cancelButtonText: 'No, cancel purchase'
            }, function(confirmed){
                if(confirmed && $('.confirm').is(':visible')) buyPw(id, pwAmt);
            })

        });
    };
    // buy a certain amount of powers including > 255
    const buyPw = (shopID, pwAmt) => {
        if (pwAmt < 1) return;
        if (pwAmt > 255) {
            for (let i = 0; i < ~~(pwAmt / 255); i++) setTimeout(() => purchaseItem(shopID, 255), 500 * i + 250);
            purchaseItem(shopID, pwAmt % 255);
        } else purchaseItem(shopID, pwAmt);
    };


    if(userPreferences.improvedShop){
        // add event listeners to dropdown buttons
        for (let i = 0; i < confBtns.length; i++) {
            confBtns[i].onclick = function () {
                setTimeout(() => {
                    if (document.getElementById('shopAmountDropdown') != null) document.getElementById('shopAmountDropdown').innerHTML += '<option value="20">20</option> <option value="50">50</option> <option value="100">100</option> <option value="250">250</option> <option value="custom">Pick</option>';
                }, 5);
            }
        }
        // add event listeners to shop buttons
        for (let i = 0; i < 16; i++) {
            if (i != 10 && i != 11){
                btnsArr[i].addEventListener('click', function(e){
                    if(!e.isTrusted && !quickBuying) return;
                    let index = i;
                    changeHTML(index, btnsArr[index].getAttribute('price'), btnsArr[index].getAttribute('item'), $('.purchase-btn.confirmation[item="' + btnsArr[index].getAttribute('item') + '"]').prev().find('h3').eq(0).text());
                });
            }
        }
    }


    // listen for when a min pack is bought
    let minBoughtAmt = {};
    if(userPreferences.extraChatCommands){
        let lastClickedPrice, currentPrice, lastID;
        const confirmClicked = () => {
            setTimeout(() => {
                if($('.sweet-alert h2').text() != "Success!" || lastClickedPrice != currentPrice) return;
                const map = {
                    1: '10 Bots 1 Hour',
                    2: '40 Bots 1 Hour',
                    3: '50 Bots 2 Hours',
                    4: '80 Bots 1 Hour',
                    5: '100 Bots 4 Hours',
                    6: '125 Bots 8 Hours',
                    7: '300 Bots 24 Hours',
                    8: '100 MASS Bots 1 Hour',
                    9: '100 Bots 24 Hours',
                    10: '125 Bots 48 Hours',
                    11: '300 Bots 72 Hours',
                    12: '100 MASS Bots 24 Hours'
                }
                minBoughtAmt[currentUser] = {...minsChatAmt[currentUser], ... {chatAmt: map[lastID], started: false}};
            }, 900);
        };
        $('.purchase-btn2.confirm-minion[item]').on('click', function () {
            lastClickedPrice = this.getAttribute('price').replace(/,/g, '');
            lastID = this.getAttribute('item');
            $('.confirm').attr('disabled', 'true'); // disable so user doesn't buy early - swal is slow to load text
            setTimeout(() => {
                $('.confirm').removeAttr('disabled');
                currentPrice = $('.sweet-alert.showSweetAlert.visible p').eq(0).text().replace(/\D+/g, '');
            }, 750);
            setTimeout(() => $('.confirm')[0].addEventListener('click', confirmClicked), 500);
        })
    }

    // context menu: click on skin -> skin ID to clipboard, click on name -> name to clipboard
    $('#contextPlayer').on('click', e => {
        if(!userPreferences.rightClickCopyInfo) return;
        if($('#contextPlayerSkin').width() + $('#contextPlayerSkin').offset().left + 5 > e.pageX){ // bcs #contextMenu event :dog:
            // cell was clicked
            if($('#contextPlayerSkin').css('background-image') != "none"){
                let skinID = $('#contextPlayerSkin').css('background-image').match(/(?<=\/skins\/)[0-9]+/gm)[0]; // get the skin image, then match only the skin's ID
                navigator.clipboard.writeText(skinID).then(function() {
                    curserMsg('Skin ID of ' + skinID + ' was copied to your clipboard.', 'green');
                }, function() {
                    curserMsg('Something went wrong. Nothing was added to your clipboard.', 'red');
                });
            } else if($('#contextPlayerSkin').css('background-color') == 'rgb(51, 51, 51)') curserMsg('No player selected. Nothing was added to your clipboard.', 'red');
            else curserMsg('No skin equipped. Nothing was added to your clipboard.', 'red');
        } else { // name was clicked
            if($('#contextPlayerSkin').css('background-color') == 'rgb(51, 51, 51)') curserMsg('No player selected. Nothing was added to your clipboard.', 'red');
            else {
                navigator.clipboard.writeText($('#contextPlayerName').text()).then(function() {
                    curserMsg('Nickname: "' + $('#contextPlayerName').text() + '" was copied to your clipboard', 'green');
                }, function() {
                    curserMsg("Something went wrong. Nothing was added to your clipboard.", "red");
                });
            }
        }
    });


    // little bar at the top of the screen that tells u stuff
    let curserTimeout;
    function curserMsg(msg, color, time, html){
        let colorTable = {
            "green": "rgb(0, 192, 0)",
            "red": "rgb(255, 0, 0)",
            "gray": "rgb(153, 153, 153)",
            "yellow": "rgb(255, 170, 0)",
            "orange": "rgb(255, 149, 0)",
            "lightgray": "rgb(194, 194, 194)",
            "white": "rgb(255, 255, 255)",
            "purple": "rgb(190, 138, 255)"
        }
        color = colorTable[color];
        clearTimeout(curserTimeout);
        $('#curser')[(html ?? false) ? "html" : "text"](msg).show().css('color', color)
        if(time != 0) curserTimeout = setTimeout(() => $('#curser').fadeOut(400), time ?? 4e3);
    }
    unsafeWindow.curserMsg = curserMsg;

    let minTimeRemaining = 0;
    const startMin = unsafeWindow.strMin;
    unsafeWindow.strMin = function(){
        minsStart();
        return startMin.apply(this, arguments);
    }
    let minsChatAmt = {},
        accGoldMem = {};
    const minsStart = async() => {
        let minAmt, minsStarted = false;
        const waitUntil1 = (condition) => new Promise(resolve => {
            let interval = setInterval(() => {
                $('#infoContent').children().each(function(){
                    if($(this).text().includes('Minion Time:')) minsStarted = true;
                })
                condition() && (clearInterval(interval), resolve());
            }, 100);
            setTimeout(() => { (clearInterval(interval), resolve()); }, 1e4);
        });
        await waitUntil1(() => minsStarted == true);
        if(!minsStarted) return;
        $('#infoContent').children().each(function(){
            if($(this).text().includes('Minion Time:')) minTimeRemaining = $(this).find('span').text();
            if($(this).text().includes('Minions:')) minAmt = $(this).find('span').text();
        })
        let timeArr = minTimeRemaining.split(':'), msBotsTime = (3.6e6 * +timeArr[0]) + (6e4 * +timeArr[1]) + (1e3 * +timeArr[2]);
        misc_settings.bots[currentUser] = {...misc_settings.bots[currentUser], ...{active: true, amt: minAmt, chatAmt: null, rem: msBotsTime, currMs: Date.now()}};
        setStorage("fsfb-misc", misc_settings);
    }

    // ability time remaining
    if(userPreferences.showRemainingAbilityTime){
        let lastID;
        const abilityIds = [18, 20, 22, 23];
        abilityIds.forEach(id => {
            const h5 = $(`.purchase-btn.confirmation[item="${id}"]`).parents().eq(0).find('div h5');
            h5.clone().insertAfter(h5).addClass('fsfb-fake').hide();

            const checkmarkImg = $(`.purchase-btn.confirmation[item="${id}"]`).parent().find(".checkmark:first");

            $(`.purchase-btn[item="${id}"]`).on('click', function () {
                lastID = this.getAttribute('item');

                const hadAbilityBefore = checkmarkImg.is(":visible");

                setTimeout(() => {
                    const isVisibleNow = $(`.purchase-btn.confirmation[item="${id}"]`).parent().find(".checkmark:first").is(":visible");
                    if(!hadAbilityBefore && isVisibleNow){
                        // purchase successful, set timer
                        misc_settings.abil[currentUser] = {...misc_settings.abil[currentUser], ...{[lastID] : Date.now()}};
                        setStorage("fsfb-misc", misc_settings);
                    }
                }, 2500)
            });
        });
    }

    // sort wearables by owned
    const waitUntil = condition => new Promise(resolve => {
        let interval = setInterval(() => {
            condition() && (clearInterval(interval), resolve());
        }, 100);
        setTimeout(() => { (clearInterval(interval), resolve()) }, 15e3);
    });
    if(userPreferences.sortWearablesByOwned){
        $('#wearablesTab').on('click', async() => {
            await waitUntil(() => $('#phpWearables li').length > 55);
            if($('#phpWearables li').length <= 55) return;
            $($('[id^="wearableUseBtn"]').get().reverse()).each(function(){
                $($(this).parents().get(2)).insertBefore($("#phpWearables li:eq(0)"));
            })
            $('#phpWearables').append('<div id="fsfb-wearsloaded"></div>');
        });
    }
    // https://stackoverflow.com/questions/2424191/how-do-i-make-an-element-draggable-in-jquery
    $.fn.draggable = function(){
        var $this = this,
            ns = 'draggable_'+(Math.random()+'').replace('.',''),
            mm = 'mousemove.'+ns,
            mu = 'mouseup.'+ns,
            $w = $(unsafeWindow),
            isFixed = ($this.css('position') === 'fixed'),
            adjX = 0, adjY = 0;

        $this.mousedown(function(ev){
            let zoom = parseFloat($this.css('zoom')) || 1;
            var pos = $this.offset();
            if (isFixed) {
                adjX = $w.scrollLeft(); adjY = $w.scrollTop();
            }
            var ox = (ev.pageX - pos.left) / zoom, oy = (ev.pageY - pos.top) / zoom;
            $this.data(ns,{ x : ox, y: oy });
            $w.on(mm, function(ev){
                ev.preventDefault();
                ev.stopPropagation();
                if (isFixed) {
                    adjX = $w.scrollLeft(); adjY = $w.scrollTop();
                }
                var offset = $this.data(ns);
                $this.css({ left: Math.round((ev.pageX - adjX - offset.x * zoom) / zoom), top: Math.round((ev.pageY - adjY - offset.y * zoom) / zoom) });
            });
            $w.on(mu, function(){
                $w.off(mm + ' ' + mu).removeData(ns);
            });
        });
        return this;
    };


    /* xp/coins statistics */

    const updateTimeXP = 12e3; // xp bar updates every 12 seconds, don't change
    let lastMinXP = [];
    let lastHrXP = [];
    let currentPercent, currentLevel, currentXP, currentCoins;

    unsafeWindow.logStatsScriptXP = !1;
    unsafeWindow.logStatsScriptCoins = !1;
    let scriptStartCoins = Date.now();
    let scriptStartXP = Date.now();
    let accounts = {};
    const guiDisplay = "none";
    let coinsHTMLactive = false;

    const updateTimeCoins = 6e3;
    let lastMinCoins = [];
    let lastHrCoins = [];

    // add stats box html
    const statsBody = document.createElement('div');
    statsBody.setAttribute('id', 'stats-container');
    statsBody.style.display = guiDisplay;
    statsBody.innerHTML = `
	<div id="stats-main">
		<div id="stats-title">
			<title id="stats-extra-info">XP Stats - Updating Every 12s</title>
			<div>
				<div title="Toggle Percentages Shown" id="stats-perc-btn" class="fa fa-percent"></div>
				<div title="Toggle Stats Shown" id="stats-change-shown" class="fa fa-eye-slash"></div>
				<div title="Reset Stats" class="fa fa-refresh" id="stats-reset-btn"></div>
			</div>
		</div>
		<div>
			<table id="stats-table">
				<tbody>
					<tr>
						<td><label><input type="checkbox">Lvl Completed:</label></td>
						<td>0/0</td>
					</tr>
					<tr>
						<td><label><input type="checkbox">Remaining:</label></td>
						<td>100,000</td>
					</tr>
					<tr>
						<td><label><input type="checkbox">Projected (hr):</label></td>
						<td>0</td>
					</tr>
					<tr>
						<td><label><input type="checkbox">Last Hour:</label></td>
						<td>100,000</td>
					</tr>
					<tr>
						<td><label><input type="checkbox">Last Minute:</label></td>
						<td>100,000</td>
					</tr>
					<tr>
						<td><label><input type="checkbox">Last 12s:</label></td>
						<td>100,000</td>
					</tr>
					<tr>
						<td><label><input type="checkbox">Minute Mean:</label></td>
						<td>100,000</td>
					</tr>
					<tr>
						<td><label><input type="checkbox">Minute Median:</label></td>
						<td>100,000</td>
					</tr>
					<tr>
						<td><label><input type="checkbox">Minute Sd:</label></td>
						<td>100,000</td>
					</tr>
					<tr>
						<td><label><input type="checkbox">Latest Outliers:</label></td>
						<td>100,000</td>
					</tr>
					<tr>
						<td><label><input type="checkbox">Session XP:</label></td>
						<td>100,000</td>
					</tr>
					<tr>
						<td><label><input type="checkbox">Session Length:</label></td>
						<td>100,000</td>
					</tr>
					<tr>
						<td><label><input type="checkbox">Lifetime XP:</label></td>
						<td>100,000</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>`;
    document.querySelector('body').append(statsBody);

    $("#stats-container").draggable();
    let statsboxPos = misc_settings?.statsPos ?? {top: $("#stats-container")[0].style.top, left: $("#stats-container")[0].style.left};
    if(userPreferences.saveStatsBoxPosition && statsboxPos) $("#stats-container").css({'top' : statsboxPos.top, 'left' : statsboxPos.left});

    const convertToPerc = (xpAmt, lvl = 0) => isNaN(xpAmt / (lvl * 1000)) ? 0 : xpAmt / (lvl * 1000);

    $('#stats-reset-btn').on('click', () => {
        if(coinsHTMLactive){
            lastMinCoins = [];
            lastHrCoins = [];
            for(let i in accounts) accounts[i].coins = 0;
            if(accounts[currentUser] !== null && currentUser !== 'Please Login First') accounts[currentUser].coins = currentCoins;
            scriptStartCoins = Date.now();
        } else {
            lastMinXP = [];
            lastHrXP = [];
            for(let i in accounts){
                accounts[i].xp = 0;
                accounts[i].lvl = 0;
            }
            if(accounts[currentUser] !== null && currentUser !== 'Please Login First'){
                accounts[currentUser].xp = currentXP;
                accounts[currentUser].lvl = round(currentPercent, 3) + currentLevel;
            }
            scriptStartXP = Date.now();
        }
        updateUI();
    });
    let xpStatsInPercentages = false;
    $('#stats-perc-btn').on('click', () => {
        xpStatsInPercentages = !xpStatsInPercentages;
        updateUI();
    });

    let changingShownStats = false;
    $('#stats-change-shown').on('click', () => {
        changingShownStats = !changingShownStats;
        if(changingShownStats){
            $('#stats-table tr').show();
            _replaceCSS('stats-input-css', '#stats-table input{ display: unset; }');
        } else {
            for(let i in misc_settings.statsSettings[coinsHTMLactive ? 'coins' : 'xp']){
                misc_settings.statsSettings[coinsHTMLactive ? 'coins' : 'xp'][i] = $(`#stats-${i} input[type="checkbox"]`).is(':checked');
                $('#stats-' + i)[$(`#stats-${i} input[type="checkbox"]`).is(':checked') ? 'show' : 'hide']();
            }
            setStorage("fsfb-misc", misc_settings);
            _replaceCSS('stats-input-css', '#stats-table input{ display: none; }');
        }
    });

    class StatLog {
        constructor(val, lvl, user, arr) {
            this.type = this.findWhich(arr); // mostly for debugging
            this.id = this.getID(arr);
            this.user = user;
            this.amount = val;
            this.gained = this.calcGain(val, arr, this.id);
            this.lvl = lvl;
            // this.timestamp = Date.now(); // mostly for debugging
        }
        findWhich(arr) {
            return ((arr == lastMinXP || arr == lastHrXP ? "xp " : "coins " ) + (arr == lastHrXP || arr == lastHrCoins ? "hour" : "minute"));
        }
        calcGain(val, arr, id){
            const prevObj = arr[arr.length - 1];
            if(prevObj && arr == lastHrXP && id == 1) return round(sigma(getProperty(lastMinXP, "gained")), 3);
            if(prevObj && arr == lastHrCoins && id == 1) return round(sigma(getProperty(lastMinCoins, "gained")), 3);
            return prevObj && val - prevObj.amount >= 0 && prevObj.user == this.user && prevObj.amount != 0 ? round(val - prevObj.amount, 3) : 0;
        }
        getID(arr) {
            return arr[arr.length - 1] ? arr[arr.length - 1].id + 1 : 1;
        }

    }

    const xpInfo = () => {
        currentPercent = $('.progress-bar[role=progressbar]')[0].style.width.slice(0, -1) / 100;
        currentLevel = +$('#level.user-level')[0].textContent;
        currentXP = (levelSum(currentLevel) + currentLevel * currentPercent) * 1e3;
    }
    const coinsInfo = () => {
        currentCoins = +($('#coinsDash')[0].textContent.replace(/ /g, ''));
    }

    const updateUI = () => {
        if(changingShownStats) return;
        if(!coinsHTMLactive){
            const xpHr = lastHrXP.length,
                  xpMin = lastMinXP.length,
                  lvlCompleted = currentPercent ? String(Math.round(currentPercent * currentLevel * 1e3, 1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "/" + (currentLevel * 1e3).toLocaleString('en-US') : "0/0",
                  xpRemaining = currentLevel ? currentLevel * 1e3 - currentPercent * currentLevel * 1e3 : 0,
                  projectedHr = xpHr > 0 ? sigma(getProperty(lastHrXP.slice(-5), "gained")) * 12 : 0,
                  lastHr = xpHr > 0 ? sigma(getProperty(lastHrXP, "gained")) : 0,
                  lastHrCompleted = xpHr > 0 ? xpHr : 0,
                  lastMin = xpMin > 0 ? sigma(getProperty(lastMinXP, "gained")) : 0,
                  lastMinCompleted = xpMin > 0 ? xpMin : 0,
                  lastMinTotal = 6e4 / updateTimeXP,
                  last12sec = xpMin > 0 ? lastMinXP[lastMinXP.length - 1].gained : 0,
                  xBar = xpHr > 0 ? mean(getProperty(lastHrXP, "gained")) : 0,
                  xTilde = xpHr > 0 ? median(getProperty(lastHrXP, "gained")) : 0,
                  standardDev = xpHr > 0 ? standardDeviation(getProperty(lastHrXP, "gained")) : 0,
                  outliers = xpHr > 0 ? checkOutliers(getProperty(lastHrXP, "gained")) : 0,
                  sessionXP = currentXP && accounts[currentUser] ? currentXP - accounts[currentUser].xp : 0,
                  sessionLength = msToTime(Date.now() - scriptStartXP),
                  lifetimeXP = currentXP ? Math.round(currentXP) : 0,
                  updateTime = updateTimeXP;
            document.getElementById('stats-table').innerHTML = `
			<tbody>
				<tr id="stats-lvlcomp">
					<td><label><input type="checkbox">Lvl Completed:</label></td>
					<td>${lvlCompleted.toLocaleString('en-US')}</td>
				</tr>
				<tr id="stats-rem">
					<td><label><input type="checkbox">Remaining:</label></td>
					<td>${xpStatsInPercentages ? round(convertToPerc(xpRemaining, currentLevel) * 100, 2) + '%' : round(xpRemaining).toLocaleString('en-US')}</td>
				</tr>
				<tr id="stats-projhr">
					<td><label><input type="checkbox">Projected (hr):</label></td>
					<td>${xpStatsInPercentages ? round(convertToPerc(projectedHr, currentLevel) * 100, 2) + '%' : round(projectedHr).toLocaleString('en-US')}</td>
				</tr>
				<tr id="stats-lasthr">
					<td><label><input type="checkbox">Last Hour:</label></td>
					<td>${xpStatsInPercentages ? round(convertToPerc(lastHr, currentLevel) * 100, 2) + '%' : round(lastHr).toLocaleString('en-US')}<span class="stats-completed">(${lastHrCompleted}/60)</span></td>
				</tr>
				<tr id="stats-lastmin">
					<td><label><input type="checkbox">Last Minute:</label></td>
					<td>${xpStatsInPercentages ? round(convertToPerc(lastMin, currentLevel) * 100, 2) + '%' : round(lastMin).toLocaleString('en-US')}<span class="stats-completed">(${lastMinCompleted + "/" + lastMinTotal})</span></td>
				</tr>
				<tr id="stats-lastsec">
					<td><label><input type="checkbox">Last 12s:</label></td>
					<td>${xpStatsInPercentages ? round(convertToPerc(last12sec, currentLevel) * 100, 2) + '%' : round(last12sec).toLocaleString('en-US')}</td>
				</tr>
				<tr id="stats-mean">
					<td><label><input type="checkbox">Minute Mean:</label></td>
					<td>${xpStatsInPercentages ? round(convertToPerc(xBar, currentLevel) * 100, 2) + '%' : round(xBar).toLocaleString('en-US')}</td>
				</tr>
				<tr id="stats-median">
					<td><label><input type="checkbox">Minute Median:</label></td>
					<td>${xpStatsInPercentages ? round(convertToPerc(xTilde, currentLevel) * 100, 2) + '%' : round(xTilde).toLocaleString('en-US')}</td>
				</tr>
				<tr id="stats-sd">
					<td><label><input type="checkbox">Minute Sd:</label></td>
					<td>${xpStatsInPercentages ? round(convertToPerc(standardDev, currentLevel) * 100, 2) + '%' : round(standardDev).toLocaleString('en-US')}</td>
				</tr>
				<tr id="stats-sesh">
					<td><label><input type="checkbox">Session XP:</label></td>
					<td>${xpStatsInPercentages ? round(currentLevel && accounts[currentUser] ? ((round(currentPercent, 3) + currentLevel) - accounts[currentUser].lvl) * 100 : 0, 2) + '%' : round(sessionXP).toLocaleString('en-US')}</td>
				</tr>
				<tr id="stats-seshlength">
					<td><label><input type="checkbox">Session Length:</label></td>
					<td id="stats-sesh-length">${sessionLength}</td>
				</tr>
				<tr id="stats-lifetime">
					<td><label><input type="checkbox">Lifetime XP:</label></td>
					<td>${lifetimeXP.toLocaleString('en-US')}</td>
				</tr>
			</tbody>`;
            for(let i in misc_settings.statsSettings.xp){
                $('#stats-' + i)[misc_settings.statsSettings.xp[i] ? 'show' : 'hide']();
                $('#stats-' + i + ' input[type="checkbox"').prop("checked", misc_settings.statsSettings.xp[i]);
            }
            $('#stats-extra-info').text(`XP Stats - Updating Every ${updateTime / 1e3}s`).css('color', '#00bbff');
            $('#stats-sesh-length').text(msToTime(Date.now() - scriptStartXP));
            $('#stats-perc-btn').show();
        } else {
            const coinsHr = lastHrCoins.length,
                  coinsMin = lastMinCoins.length,
                  coinGoalCompleted = currentCoins ? currentCoins.toLocaleString('en-US') + "/" + Math.ceil(currentCoins / 25e4).toLocaleString('en-US') * 25e4 : 0,
                  coinsRemaining = currentCoins ? 25e4 - currentCoins % 25e4 : 0,
                  projectedHr = coinsHr > 5 ? Math.round(sigma(getProperty(lastHrCoins.slice(-5), "gained")) * 12) : 0,
                  lastHr = coinsHr > 0 ? Math.round(sigma(getProperty(lastHrCoins, "gained"))) : 0,
                  lastHrCompleted = coinsHr > 0 ? coinsHr : 0,
                  lastMin = coinsMin > 0 ? Math.round(sigma(getProperty(lastMinCoins, "gained"))) : 0,
                  lastMinCompleted = coinsMin > 0 ? coinsMin : 0,
                  lastMinTotal = 6e4 / updateTimeCoins,
                  last12sec = coinsMin > 0 ? getProperty(lastHrCoins.slice(-5), "amount")[0] : 0,
                  xBar = coinsHr > 0 ? Math.round(mean(getProperty(lastHrCoins, "gained"))) : 0,
                  xTilde = coinsHr > 0 ? Math.round(median(getProperty(lastHrCoins, "gained"))) : 0,
                  standardDev = coinsHr > 0 ? Math.round(standardDeviation(getProperty(lastHrCoins, "gained"))) : 0,
                  outliers = coinsHr > 0 ? checkOutliers(getProperty(lastHrCoins, "gained")) : 0,
                  sessionXP = currentCoins && accounts[currentUser] ? Math.round(currentCoins - accounts[currentUser].coins): 0,
                  sessionLength = msToTime(Date.now() - scriptStartCoins),
                  updateTime = updateTimeCoins;
            document.getElementById('stats-table').innerHTML = `
			<tbody>
				<tr id="stats-rem">
					<td><label><input type="checkbox">Remaining:</label></td>
					<td>${coinsRemaining.toLocaleString('en-US')}</td>
				</tr>
				<tr id="stats-projhr">
					<td><label><input type="checkbox">Projected (hr):</label></td>
					<td>${projectedHr.toLocaleString('en-US')}</td>
				</tr>
				<tr id="stats-lasthr">
					<td><label><input type="checkbox">Last Hour:</label></td>
					<td>${lastHr.toLocaleString('en-US')}<span class="stats-completed">(${lastHrCompleted}/60)</span></td>
				</tr>
				<tr id="stats-lastmin">
					<td><label><input type="checkbox">Last Minute:</label></td>
					<td>${lastMin.toLocaleString('en-US')}<span class="stats-completed">(${lastMinCompleted + "/" + lastMinTotal})</span></td>
				</tr>
				<tr id="stats-mean">
					<td><label><input type="checkbox">Minute Mean:</label></td>
					<td>${xBar.toLocaleString('en-US')}</td>
				</tr>
				<tr id="stats-median">
					<td><label><input type="checkbox">Minute Median:</label></td>
					<td>${xTilde.toLocaleString('en-US')}</td>
				</tr>
				<tr id="stats-sd">
					<td><label><input type="checkbox">Minute Sd:</label></td>
					<td>${standardDev.toLocaleString('en-US')}</td>
				</tr>
				<tr id="stats-sesh">
					<td><label><input type="checkbox">Session Coins:</label></td>
					<td>${sessionXP.toLocaleString('en-US')}</td>
				</tr>
				<tr id="stats-seshlength">
					<td><label><input type="checkbox">Session Length:</label></td>
					<td id="stats-sesh-length">${sessionLength}</td>
				</tr>
			</tbody>`;
            for(let i in misc_settings.statsSettings.coins){
                $('#stats-' + i)[misc_settings.statsSettings.coins[i] ? 'show' : 'hide']();
                $('#stats-' + i + ' input[type="checkbox"').prop("checked", misc_settings.statsSettings.coins[i]);
            }
            $('#stats-extra-info').text(`Coin Stats - Updating Every ${updateTime / 1e3}s`).css('color', '#ffc800');
            $('#stats-sesh-length').text(msToTime(Date.now() - scriptStartCoins));
            $('#stats-perc-btn').hide();
        }
    }

    $('.progress-bar').eq(1).parent()[0].style.cursor = "pointer";

    if(userPreferences.coinXPstats){
        $('.progress-bar').eq(1).parent().on("click", () => {
            const statsCont = $('#stats-container');
            if(statsCont[0].style.display == "none") statsCont.fadeIn(400);
            else if(!coinsHTMLactive) statsCont.fadeOut(400);
            coinsHTMLactive = false;
            updateUI();
        }), [$(".dash-coin.dcTopBar").eq(0), $("#coinsTopLeft"), $(".progress-bar-coins").eq(1)].forEach(el => {
            el.on('click', (e) => {
                const statsCont = $('#stats-container');
                if(statsCont[0].style.display == "none") statsCont.fadeIn(400);
                else if(coinsHTMLactive) statsCont.fadeOut(400);
                coinsHTMLactive = true;
                updateUI();
                e.stopImmediatePropagation();
            });
        });
    }

    // copy chat msgs
    if(userPreferences.rightClickCopyChat){
        $('#contextSpectate').after(`<li id="contextCopyChat" class="contextmenu-item enabled"><div class="fa fa-clipboard fa-2x context-icon"></div><p>Copy Chat Messages</p></li>`);
        $('#contextCopyChat').on('click', () => {
            let arr = chatmsgs, str = "";
            if(arr != null){
                for(let i of arr.reverse()) str += `${new Date(i.time).toLocaleTimeString()} ${i.name}: ${i.message}\n`;
                navigator.clipboard.writeText(str).then(function() {
                    curserMsg('Chat messages were successfully added to clipboard.', 'green');
                }, function() {
                    curserMsg('Something went wrong. Nothing was added to your clipboard.', 'red');
                });
            }
            $('#contextMenu').hide();
        });
    }



    // add linesplit bubbles
    $('body').append(`<div id="linesplit-markers"><div id="linesplit-top"></div><div id="linesplit-right"></div><div id="linesplit-bottom"></div><div id="linesplit-left"></div></div>`); // linesplit html
    // add class to all elements that need to be hidden
    setTimeout(() => $('#stats-container, #inventory, #chat, #minionUi, #infection_remain_zombie, #party, #challengeInfoBox, #gamemodeBox, #infoBox, #brGameContainer, #infGameContainer, #curser, #leaderboard, #minimap, #btnFriends, .innerBoxDashboard2, #fpsBox, #settingsBtn, #megaholder, #keyboard-layout, div[style^="position: fixed; right: 20px; bottom: 230px; z-index: 998;"], #linesplit_overlay, #fushykng, #art-panel').addClass("hideUI"), 4e3);

    // apparently sora added delay to declining requests for some reason (avoid powerup "dupe" bugs), so prob won't fix this feature
    //     const addFriendDecline = () => {
    //         if(!userPreferences.friendDeclineAll || currentUser == 'Please Login First') return;
    //         $('#friendAcceptAll').text('Reject All').addClass('fsfb-temp').clone().insertAfter($('#friendAcceptAll')).attr('style', 'right: 93px;').text('Accept All').removeClass('fsfb-temp');
    //         $('.fsfb-temp').attr('id', 'friendRejectAll').removeAttr('onclick').removeClass('fsfb-temp');
    //         $('#friendRejectAll').on('click', () => {
    //             $('#requestList>.friend>.btn-friends.remove').each(function(i){ $(this)[0].click() })
    //         });
    //     }

    //     if(userPreferences.friendDeclineAll){ // $('#friendAcceptAll').length
    //         $('#btnFriends').on('click', async() => {
    //             await waitUntil(() => $('#friendAcceptAll').length > 0);
    //             if($('#friendAcceptAll').length == 0) return;
    //             await sleep(50);
    //             addFriendDecline();
    //         })
    //     }

    let pushFn = Array.prototype.push,
        spliceFn = Array.prototype.splice,
        prop = null,
        specialCells = !0,
        customDc = false,
        cellProto,
        avgFps = 0,
        fpsArr = [],
        svSwitch = false,
        pubNameSwitch = false,
        entArr = null,
        chatmsgs,
        hideMinionMaxSize = 80;

    let r1Portal = {
        portal: null,
        lastMass: 0,
        lastMassChange: 0,
        lastValue: 0,
        room: 1
    }, r2Portal = {
        portal: null,
        lastMass: 0,
        lastMassChange: 0,
        lastValue: 0,
        room: 2
    };

    let svInfo = {
        "default": {
            ejPortalMass: 12,
            r1Id: 1,
            r2Id: 7,
            r3Id: null,
            r1StartMass: 500,
            r2StartMass: 500,
            entities: [],
            serverType: "normal"
        },
        1: { // POPSPLIT
            entities: [
                // A1
                {type: 1, x: 2500, y: 2500, size: 45},
                // r1
                {type: 0, x: 3400, y: 15300, size: 195},
                {type: 1, x: 2500, y: 15000, size: 45},
                {type: 2, x: 3000, y: 14500, size: 35},
                {type: 3, x: 2700, y: 14600, size: 29},
                // r2
                {type: 0, x: 12000, y: 15500, size: 195},
                {type: 1, x: 11000, y: 15000, size: 29},
                {type: 2, x: 12600, y: 14900, size: 35},
                {type: 2, x: 12000, y: 15200, size: 35},
                {type: 2, x: 11300, y: 14900, size: 35},
                {type: 3, x: 12800, y: 14500, size: 29}
            ],
            bots: 4
        },
        2: { // SLOWSPLIT
            ejPortalMass: 20,
            r1Id: 1,
            r2Id: 14, // rightmost portal
            r3Id: 6,
            r1StartMass: 500,
            r2StartMass: 500,
            entities: [
                // A1
                {type: 1, x: 2500, y: 2500, size: 45},
                // r1
                {type: 0, x: 7400, y: 21300, size: 195},
                {type: 1, x: 3500, y: 21000, size: 45},
                {type: 2, x: 5000, y: 20500, size: 35},
                {type: 3, x: 3700, y: 20600, size: 29},
                // r2
                {type: 0, x: 14000, y: 22000, size: 195},
                {type: 1, x: 11000, y: 21000, size: 29},
                {type: 2, x: 11300, y: 20900, size: 35},
                {type: 2, x: 12000, y: 21200, size: 35},
                {type: 2, x: 12600, y: 20900, size: 35},
                {type: 3, x: 12800, y: 20500, size: 29},
                // r2 (2nd?)
                {type: 0, x: 22000, y: 21500, size: 195},
                {type: 2, x: 21300, y: 21000, size: 45}
            ]
        },
        3: { // Dodgeball NA
            entities: [],
            bots: 7
        },
        4: { // FASTSPLIT
            ejPortalMass: 20,
            r1Id: 1,
            r2Id: 14, // rightmost portal
            r3Id: 6,
            r1StartMass: 500,
            r2StartMass: 500,
            entities: [
                // A1
                {type: 1, x: 2500, y: 2500, size: 45},
                // r1
                {type: 0, x: 7400, y: 21300, size: 195},
                {type: 1, x: 3500, y: 21000, size: 45},
                {type: 2, x: 5000, y: 20500, size: 35},
                {type: 3, x: 3700, y: 20600, size: 29},
                // r2
                {type: 0, x: 14000, y: 22000, size: 195},
                {type: 1, x: 11000, y: 21000, size: 29},
                {type: 2, x: 11300, y: 20900, size: 35},
                {type: 2, x: 12000, y: 21200, size: 35},
                {type: 2, x: 12600, y: 20900, size: 35},
                {type: 3, x: 12800, y: 20500, size: 29},
                // r2 (2nd?)
                {type: 0, x: 22000, y: 21500, size: 195},
                {type: 2, x: 21300, y: 21000, size: 35}
            ],
            bots: 1
        },
        5: { // SPLITRUN
            entities: [
                // A1
                {type: 1, x: 2500, y: 2500, size: 45},
                // r1
                {type: 0, x: 3400, y: 15300, size: 195},
                {type: 1, x: 2500, y: 15000, size: 45},
                {type: 2, x: 3000, y: 14500, size: 35},
                {type: 3, x: 2700, y: 14600, size: 29},
                // r2
                {type: 0, x: 12000, y: 15500, size: 195},
                {type: 1, x: 11000, y: 15000, size: 29},
                {type: 2, x: 12600, y: 14900, size: 35},
                {type: 2, x: 11300, y: 14900, size: 35},
                {type: 2, x: 12000, y: 15200, size: 35},
                {type: 3, x: 12800, y: 14500, size: 29}
            ]
        },
        6: { // XINSTA
            ejPortalMass: 12,
            r1Id: 1,
            r2Id: 6,
            r1StartMass: 500,
            r2StartMass: 500,
            entities: [
                // A1
                {type: 1, x: 2500, y: 2500, size: 45},
                // r1
                {type: 0, x: 3400, y: 26300, size: 195},
                {type: 1, x: 2500, y: 26000, size: 45},
                {type: 2, x: 3000, y: 25500, size: 45},
                {type: 3, x: 2700, y: 25600, size: 29},
                // r2
                {type: 0, x: 15000, y: 26500, size: 195},
                {type: 1, x: 14000, y: 26000, size: 29},
                {type: 2, x: 14300, y: 25900, size: 45},
                {type: 2, x: 15000, y: 26200, size: 45},
                {type: 2, x: 15600, y: 25900, size: 45},
                {type: 3, x: 15800, y: 25500, size: 29}
            ], bots: 6
        },
        7: { // XY
            entities: [
                // A1
                {type: 1, x: 2500, y: 2500, size: 45},
                // r1
                {type: 0, x: 3400, y: 15300, size: 195},
                {type: 1, x: 2500, y: 15000, size: 45},
                {type: 2, x: 3000, y: 14500, size: 35},
                {type: 3, x: 2700, y: 14600, size: 29},
                // r2
                {type: 0, x: 12000, y: 15500, size: 195},
                {type: 1, x: 11000, y: 15000, size: 29},
                {type: 2, x: 11300, y: 14900, size: 35},
                {type: 2, x: 12000, y: 15200, size: 35},
                {type: 2, x: 12600, y: 14900, size: 35},
                {type: 3, x: 12800, y: 14500, size: 29}
            ], bots: 5
        },
        8: { // INSTANT EU
            entities: [
                // A1
                {type: 1, x: 2500, y: 2500, size: 45},
                // r1
                {type: 0, x: 3400, y: 15300, size: 195},
                {type: 1, x: 2500, y: 15000, size: 45},
                {type: 2, x: 3000, y: 14500, size: 35},
                {type: 3, x: 2700, y: 14600, size: 29},
                // r2
                {type: 0, x: 12000, y: 15500, size: 195},
                {type: 1, x: 11000, y: 15000, size: 29},
                {type: 2, x: 11300, y: 14900, size: 35},
                {type: 2, x: 12000, y: 15200, size: 35},
                {type: 2, x: 12600, y: 14900, size: 35},
                {type: 3, x: 12800, y: 14500, size: 29}
            ]
        },
        9: { // CR EU
            entities: [
                // A1
                {type: 1, x: 2500, y: 2500, size: 45},
                // r1
                {type: 0, x: 3400, y: 27300, size: 195},
                {type: 1, x: 2500, y: 27000, size: 45},
                {type: 2, x: 3000, y: 26500, size: 35},
                {type: 3, x: 2700, y: 26600, size: 29},
                // r2
                {type: 0, x: 12000, y: 27500, size: 195},
                {type: 1, x: 11000, y: 27000, size: 29},
                {type: 2, x: 11300, y: 26900, size: 35},
                {type: 2, x: 12000, y: 27200, size: 35},
                {type: 2, x: 12600, y: 26900, size: 35},
                {type: 3, x: 12800, y: 26500, size: 29}
            ], bots: 8
        },
        11: { // GIGANTIC 1
            entities: [
                {type: 1, x: 2500, y: 2500, size: 45},
                {type: 3, x: 5000, y: 33000, size: 45},
                {type: 1, x: 18000, y: 18000, size: 45},
                {type: 3, x: 24000, y: 12000, size: 45}
            ],
            serverType: "gigantic"
        },
        12: { // GIANT NA
            entities: [
                {type: 1, x: 2500, y: 2500, size: 45},
                {type: 3, x: 5000, y: 33000, size: 45},
                {type: 1, x: 18000, y: 18000, size: 45},
                {type: 3, x: 24000, y: 12000, size: 45}
            ],
            serverType: "gigantic"
        },
        13: { // SS EU
            ejPortalMass: 13.5,
            r1Id: 12, //Lower room
            r2Id: 11,
            r1StartMass: 500,
            r2StartMass: 500,
            entities: [
                // r1
                {type: 0, x: 1500, y: 27500, size: 195},
                {type: 1, x: 14000, y: 32000, size: 45},
                {type: 3, x: 13200, y: 33500, size: 45},
                {type: 4, x: 12500, y: 32200, size: 142},
                {type: 4, x: 14500, y: 32200, size: 142},
                // r2
                {type: 0, x: 16000, y: 33500, size: 195},
                {type: 1, x: 500, y: 24000, size: 45},
                {type: 3, x: 2500, y: 24000, size: 45},
                {type: 4, x: 900, y: 22000, size: 142},
                {type: 4, x: 500, y: 15000, size: 224},
                // r3 (?)
                {type: 4, x: 1200, y: 5500, size: 224},
                {type: 4, x: 2000, y: 3000, size: 224},
                {type: 4, x: 4000, y: 6000, size: 224},
                {type: 4, x: 4500, y: 3000, size: 224},
                // on map
                {type: 4, x: 8000, y: 3500, size: 224},
                {type: 4, x: 10000, y: 4500, size: 224},
                {type: 4, x: 16000, y: 3000, size: 224},
                {type: 4, x: 15400, y: 2400, size: 224},
                {type: 4, x: 7500, y: 19000, size: 224},
                {type: 4, x: 19200, y: 14000, size: 224},
                {type: 4, x: 24400, y: 24000, size: 224},
                {type: 4, x: 17500, y: 14000, size: 142},
                {type: 4, x: 30000, y: 16000, size: 142}
            ],
            serverType: "supersonic"
        },
        14: { // SS NA
            ejPortalMass: 13.5,
            r1Id: 12, //Lower room
            r2Id: 11,
            r1StartMass: 500,
            r2StartMass: 500,
            entities: [
                // r1
                {type: 0, x: 1500, y: 27500, size: 195},
                {type: 1, x: 14000, y: 32000, size: 45},
                {type: 3, x: 13200, y: 33500, size: 45},
                {type: 4, x: 12500, y: 32200, size: 142},
                {type: 4, x: 14500, y: 32200, size: 142},
                // r2
                {type: 0, x: 16000, y: 33500, size: 195},
                {type: 1, x: 500, y: 24000, size: 45},
                {type: 3, x: 2500, y: 24000, size: 45},
                {type: 4, x: 900, y: 22000, size: 142},
                {type: 4, x: 500, y: 15000, size: 224},
                // r3 (?)
                {type: 4, x: 1200, y: 5500, size: 224},
                {type: 4, x: 2000, y: 3000, size: 224},
                {type: 4, x: 4000, y: 6000, size: 224},
                {type: 4, x: 4500, y: 3000, size: 224},
                // on map
                {type: 4, x: 8000, y: 3500, size: 224},
                {type: 4, x: 10000, y: 4500, size: 224},
                {type: 4, x: 16000, y: 3000, size: 224},
                {type: 4, x: 15400, y: 2400, size: 224},
                {type: 4, x: 7500, y: 19000, size: 224},
                {type: 4, x: 19200, y: 14000, size: 224},
                {type: 4, x: 24400, y: 24000, size: 224},
                {type: 4, x: 17500, y: 14000, size: 142},
                {type: 4, x: 30000, y: 16000, size: 142}
            ],
            serverType: "supersonic"
        },
        16: { // BR NA
            entities: [],
            bots: 7
        },
        17: { // CR AS
            entities: [
                // A1
                {type: 1, x: 2500, y: 2500, size: 45},
                // r1
                {type: 0, x: 3400, y: 27300, size: 195},
                {type: 1, x: 2500, y: 27000, size: 45},
                {type: 2, x: 3000, y: 26500, size: 35},
                {type: 3, x: 2700, y: 26600, size: 29},
                // r2
                {type: 0, x: 12000, y: 27500, size: 195},
                {type: 1, x: 11000, y: 27000, size: 29},
                {type: 2, x: 11300, y: 26900, size: 35},
                {type: 2, x: 12000, y: 27200, size: 35},
                {type: 2, x: 12600, y: 26900, size: 35},
                {type: 3, x: 12800, y: 26500, size: 29}
            ]
        },
        18: { // GIGA 1
            entities: [
                {type: 1, x: 2500, y: 2500, size: 45},
                {type: 3, x: 5000, y: 33000, size: 45},
                {type: 1, x: 18000, y: 18000, size: 45},
                {type: 3, x: 24000, y: 12000, size: 45}
            ],
            serverType: "gigantic"
        },
        19: { // GIGANTIC 2
            entities: [
                {type: 1, x: 2500, y: 2500, size: 45},
                {type: 3, x: 5000, y: 33000, size: 45},
                {type: 1, x: 18000, y: 18000, size: 45},
                {type: 3, x: 24000, y: 12000, size: 45}
            ],
            serverType: "gigantic"
        },
        20: { // CR NA
            entities: [
                // A1
                {type: 1, x: 2500, y: 2500, size: 45},
                // r1
                {type: 0, x: 3400, y: 27300, size: 195},
                {type: 1, x: 2500, y: 27000, size: 45},
                {type: 2, x: 3000, y: 26500, size: 35},
                {type: 3, x: 2700, y: 26600, size: 29},
                // r2
                {type: 0, x: 12000, y: 27500, size: 195},
                {type: 1, x: 11000, y: 27000, size: 29},
                {type: 2, x: 11300, y: 26900, size: 35},
                {type: 2, x: 12000, y: 27200, size: 35},
                {type: 2, x: 12600, y: 26900, size: 35},
                {type: 3, x: 12800, y: 26500, size: 29}
            ]
        },
        21: { // EU SF BR
            entities: [],
            bots: 7
        },
        23: { // GIGANTIC 3
            entities: [
                {type: 1, x: 2500, y: 2500, size: 45},
                {type: 3, x: 5000, y: 33000, size: 45},
                {type: 1, x: 18000, y: 18000, size: 45},
                {type: 3, x: 24000, y: 12000, size: 45}
            ],
            serverType: "gigantic"
        },
        24: { // GIGANTIC 4
            entities: [
                {type: 1, x: 2500, y: 2500, size: 45},
                {type: 3, x: 5000, y: 33000, size: 45},
                {type: 1, x: 18000, y: 18000, size: 45},
                {type: 3, x: 24000, y: 12000, size: 45}
            ],
            serverType: "gigantic"
        },
        25: { // GIANT 2 NA
            entities: [
                {type: 1, x: 2500, y: 2500, size: 45},
                {type: 3, x: 5000, y: 33000, size: 45},
                {type: 1, x: 18000, y: 18000, size: 45},
                {type: 3, x: 24000, y: 12000, size: 45}
            ],
            serverType: "gigantic"
        },
        26: { // GIGA 2
            entities: [
                {type: 1, x: 2500, y: 2500, size: 45},
                {type: 3, x: 5000, y: 33000, size: 45},
                {type: 1, x: 18000, y: 18000, size: 45},
                {type: 3, x: 24000, y: 12000, size: 45}
            ],
            serverType: "gigantic"
        },
        37: { // MEGASPLIT EU
            entities: [],
            bots: 25
        },
        38: { // Solo Agf
            ejPortalMass: 12,
            r1Id: 1,
            r2Id: 6,
            r1StartMass: 500,
            r2StartMass: 400,
            entities: [
                // A1
                {type: 1, x: 2500, y: 2500, size: 45},
                // room 1
                {type: 0, x: 3500, y: 11500, size: 195},
                {type: 1, x: 2500, y: 11500, size: 45},
                {type: 2, x: 3000, y: 11000, size: 35},
                {type: 3, x: 2700, y: 11100, size: 29},
                // room 2
                {type: 0, x: 9000, y: 11800, size: 180},
                {type: 1, x: 8200, y: 10500, size: 29},
                {type: 2, x: 8300, y: 10900, size: 35},
                {type: 2, x: 9000, y: 11200, size: 35},
                {type: 2, x: 9600, y: 10900, size: 35},
                {type: 3, x: 9800, y: 10500, size: 29}
            ], bots: 9
        },
        39: { // MEGASPLIT AS
            entities: [
            ],
            bots: 12
        },
        40: { // INFECTION EU
            entities: [],
            bots: 15
        },
        41: { // INFECTION NA
            entities: [],
            bots: 20
        },
        42: { // GIANT 3 NA
            entities: [
                {type: 1, x: 2500, y: 2500, size: 45},
                {type: 3, x: 5000, y: 33000, size: 45},
                {type: 1, x: 18000, y: 18000, size: 45},
                {type: 3, x: 24000, y: 12000, size: 45}
            ],
            serverType: "gigantic"
        },
        43: { // Instant AS
            entities: [
                // A1
                {type: 1, x: 2500, y: 2500, size: 45},
                // r1
                {type: 0, x: 3400, y: 15300, size: 195},
                {type: 1, x: 2500, y: 15000, size: 45},
                {type: 2, x: 3000, y: 14500, size: 35},
                {type: 3, x: 2700, y: 14600, size: 29},
                // r2
                {type: 0, x: 12000, y: 15500, size: 195},
                {type: 1, x: 11000, y: 15000, size: 29},
                {type: 2, x: 11300, y: 14900, size: 35},
                {type: 2, x: 12000, y: 15200, size: 35},
                {type: 2, x: 12600, y: 14900, size: 35},
                {type: 3, x: 12800, y: 14500, size: 29}
            ], bots: 3
        }
    };

    let noPortalSvIdList = [11, 19, 23, 24, 37, 36, 31, 29, 40, 41, 16, 15, 21, 35, 12, 25, 42, 28, 32, 22, 18, 26, 30, 39];
    let currentServerId = 0;

    function getServerValue(value) {
        return (svInfo[currentServerId] && svInfo[currentServerId][value]) ? svInfo[currentServerId][value] : svInfo.default[value]
    }

    try{
        for(let { isCurrent, id } of JSON.parse(localStorage.gameservers)){
            if(isCurrent) currentServerId = id;
        }
    } catch {console.warn("FSFB: Failed to grab current server id.")};

    function setHideMinionSize() {
        switch(getServerValue("serverType")){
            case "gigantic":
                hideMinionMaxSize = 120;
                break;
            case "supersonic":
                hideMinionMaxSize = 150;
                break;
            case "normal":
                hideMinionMaxSize = 80;
                break;
            default:
                hideMinionMaxSize = 80;
                break;
        }
    }
    setHideMinionSize();

    let ss = unsafeWindow.setserver;
    unsafeWindow.setserver = (sv, sn) => {
        playerAlive = false;
        setHideMinionSize();
        r1Portal.portal = null;
        r2Portal.portal = null;
        agmaioPortals.clear();
        svSwitch = true;
        ss(sv, sn);
        if(sn) currentServerId = sn.includes('AS | Instant') ? 43 : +sv.match(/(?<=s)\d+(?=\.agma\.io)/gm)?.[0];
    }

    function createCell(posX, posY, type, nSize){
        if(!cellProto) return null;

        let color,
            colorDimmed = "#FFFFFF",
            size = 0,
            imageId = 0,
            spikes = null;

        switch(type){
            case 0:
                color = "#622373";
                colorDimmed = "#4e1c5c";
                size = nSize ? nSize : 200;
                imageId = 1;
                break;
            case 1:
                color = "#ff0000";
                colorDimmed = "#cc0001";
                size = nSize ? nSize : 32;
                spikes = {x: posX, y: posY, s: size, p: size};
                imageId = 2;
                break;
            case 2:
                color = "#76ff54";
                colorDimmed = "#66b319";
                size = nSize ? nSize : 35;
                imageId = 3;
                break;
            case 3:
                color = "#ffd000";
                colorDimmed = "#ccb300";
                size = nSize ? nSize : 32;
                spikes = {x: posX, y: posY, s: size, p: size};
                imageId = 4;
                break;
            case 4:
                color = "#00a2e8";
                colorDimmed = "#0081b9";
                size = nSize ? nSize : 150;
                imageId = 5;
                break;
            default:
                color = "#FFFFFF";
                size = 500;
        };

        let cell = new cellProto.constructor();

        cell[prop[41]] = imageId;
        cell[prop[19]] = null;
        cell[prop[50]] = 0;
        cell[prop[40]] = spikes ? 1 : 0;
        cell[prop[26]] = null;
        cell[prop[52]] = false;
        cell[prop[53]] = false;
        cell[prop[39]] = [];
        cell[prop[57]] = 0;
        cell[prop[45]] = false;
        cell[prop[37]] = true;
        cell[prop[24]] = null; // name cache
        cell[prop[44]] = false;
        cell[prop[56]] = false;
        cell[prop[47]] = false;
        cell[prop[25]] = null;
        cell[prop[35]] = Date.now();
        cell[prop[51]] = 0;
        cell[prop[42]] = null;
        cell.clanCache = null;
        cell.clanPart = null;
        cell.color = color;
        cell[prop[46]] = 69;
        cell[prop[38]] = spikes;
        cell[prop[33]] = 1;
        cell[prop[36]] = 0;
        cell[prop[31]] = posX;
        cell[prop[32]] = posY;
        cell[prop[3]] = 0;
        cell.id = 1e9;
        cell[prop[21]] = null;
        cell[prop[20]] = null;
        cell.massCache = null;
        cell[prop[11]] = size;
        cell.nSize = size;
        cell.name = null;
        cell.namePart = null;
        cell.nameSize = 0;
        cell.oid = 0;
        cell.ox = posX;
        cell.oy = posY;
        cell[prop[58]] = 0;
        cell.rotation = 0;
        cell.shape = 0;
        cell.size = size;
        cell.skinId = 0;
        cell.strokeSize = size + 4;
        cell.textDrawn = null;
        cell.transform = null;
        cell[prop[18]] = true;
        cell[prop[2]] = colorDimmed ? colorDimmed : dimmColor(color);
        cell[prop[17]] = null;
        cell.x = posX;
        cell[prop[23]] = null;
        cell.y = posY;
        cell[prop[22]] = null;
        cell[prop[54]] = false;
        cell[prop[34]] = Date.now();
        cell[prop[55]] = true;
        return cell;
    }


    const nameColors = {}, nameStrokes = {};

    let nameToIdMap = {};
    let defaultColorsAmnt = 1;
    let colorIntComplete = false;
    let addedNameColors = false;
    let addedStrokeColors = false;

    let FSFB_PRIV_CUSTOM_ERROR = false;

    function contrastColor(hex){
        let r = parseInt(hex.substring(1, 3), 16) / 255;
        let g = parseInt(hex.substring(3, 5), 16) / 255;
        let b = parseInt(hex.substring(5, 7), 16) / 255;

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if(max == min){
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        let adjustedLum = 0.2126 * r + 0.7152 * g + 0.0722 * b; // 0 == darkest black; 1 == lightest white
        let lightChange = 0.5 - adjustedLum;

        l += lightChange >= 0 ? Math.max(lightChange, 0.3) : Math.min(lightChange, -0.4); // very subtle difference but makes extreme colors more visible

        return hslToHex(h * 360, s * 100, l * 100);
    }

    Object.defineProperty(Array.prototype, "fsfb_was_here", {
        get: function () {
            if(this[1] === "#FFD700"){
                defaultColorsAmnt = this.length;
                nameColors.get = () => this;
                nameColors.add = color => this.push(color);
                nameColors.set = (index, color) => void(this[index] = color);
                addedNameColors = true;
                nameColors?.get?.()?.length === defaultColorsAmnt && nameColors.add(settings.name_color[1].color);
                return "#FFFFFF";
            }
            if(this[1] === "#5C4D00"){
                nameStrokes.get = () => this;
                nameStrokes.add = stroke => this.push(stroke);
                nameStrokes.set = (index, color) => void(this[index] = color);
                addedStrokeColors = true;
                nameStrokes?.get?.()?.length === defaultColorsAmnt && nameStrokes.add(settings.name_color[2].active ? settings.name_color[2].color : contrastColor(settings.name_color[1].color));
                return "#000000";
            }
            return "#FFFFFF"; // ¯\_(ツ)_/¯
        }
    });
    function customize(c){
        // customize cell stuff
        cellProto = Object.getPrototypeOf(c);
        uisdoa && (unsafeWindow.__cellProto = cellProto);
        // this should stay independent unless sora changes the structure of cell class
        const methods = [];
        let a = c;
        while (a = Reflect.getPrototypeOf(a)) {
            const keys = Reflect.ownKeys(a);
            keys.forEach((k) => methods.push(k));
        }
        let dc_fn_name = methods[7];
        let dc = cellProto[dc_fn_name];
        Object.defineProperty(cellProto, '_drCl', { value: dc });
        Object.defineProperty(cellProto, dc_fn_name, { value: function(){
            if(!customCells && !customCellsChanged && !antilagCells) return dc.apply(this, arguments);

            let cell = this,
                cT = cell.c$,
                cellColor = cell.color;


            if (antilagCells && (cT === 0 || cT === 3) &&
                (settings.anti_lag[0].active && cell[prop[52]] && cell.nSize <= hideMinionMaxSize) ||
                (cT === 3 && (settings.anti_lag[2].active || (settings.anti_lag[3].active && !cell[prop[37]])) && cell.color !== "#000101")){
                return (cell.hidden = true);
            } else if(cell.hidden){
                cell.hidden = false;
            }

            if(cT === 0 && !('oType' in cell)){ // second makes sure that the type wasnt changed to playerCell (mothercell showmass)
                // * --- name color  --- *
                if(!addedNameColors || !addedStrokeColors){
                    cell.oNameColorId = cell[prop[51]];
                    cell[prop[51]] = "fsfb_was_here";
                } else if(!colorIntComplete && cell[prop[51]] === "fsfb_was_here"){
                    cell[prop[51]] = cell.oNameColorId;
                    colorIntComplete = true; // MIGHT be problematic w current implementation but can worry ab later
                }
                if(addedNameColors && addedStrokeColors && (pubNameSwitch || settings.name_color[0].active) && !cell[prop[52]] && / (?:\W{3}|\W{6}) /gmi.test(cell?.clanPart)){
                    let supposedColorId = nameToIdMap?.[cell.clanPart];
                    if(pubNameSwitch && decodeCustomNameColor(cell.clanPart, 0) != null){
                        // TODO: To get actual color check which box is active (getting by property is more complicated)
                        cell[prop[51]] = 0; //cell.oNameColorId; // ? atm reverts to 0
                    } else if(supposedColorId){
                        cell[prop[51]] = supposedColorId;
                    } else {
                        let color_id = decodeCustomNameColor(cell.clanPart, 0);
                        let stroke_id = decodeCustomNameColor(cell.clanPart, 1);
                        let brevName = cell.clanPart.length === 5;
                        if(color_id != null && (brevName || stroke_id != null)){
                            nameToIdMap = {...nameToIdMap, ...{[cell.clanPart]: nameColors.get().length}}

                            if(cell[prop[51]] < defaultColorsAmnt){
                                cell.oNameColorId = cell[prop[51]];
                            }

                            cell[prop[51]] = nameColors.get().length;

                            nameColors.add(getColorById(color_id));
                            nameStrokes.add(brevName ? contrastColor(getColorById(color_id)) : getColorById(stroke_id));
                        };
                    }
                }


                if(cell[prop[52]]){
                    if(settings.anti_lag[1].active){
                        cell[prop[18]] = false;
                    }
                }
                if(settings.theme_boxes[1].active){
                    if(!('oOwnCell' in cell)) cell.oOwnCell = cell[prop[45]];
                    cell[prop[45]] = true;
                }

                if(settings.theme_boxes[6].active){
                    if(!('oSpiked' in cell)) cell.oSpiked = cell[prop[56]];
                    cell[prop[56]] = settings.theme_boxes[6].active;
                } else if('oSpiked' in cell){
                    cell[prop[56]] = cell.oSpiked;
                }


                if(onlyCells || customCellsChanged){
                    if(!settings.name_color[0].active && (userPreferences.rainbowNameColor || settings.name_color[1].active) && addedNameColors && addedStrokeColors && (!("oOwnCell" in cell) ? cell[prop[45]] : cell.oOwnCell)){
                        if(nameColors.get().length > defaultColorsAmnt){
                            if(userPreferences.rainbowNameColor){
                                const color = hslToHex(Math.floor(Date.now() / userPreferences.rainbowNameSpeed + 180) % 360, 100, 50);
                                nameColors.set(defaultColorsAmnt, color);
                                nameStrokes.set(defaultColorsAmnt, dimmColor(color));
                            }
                            cell[prop[51]] = defaultColorsAmnt;
                        } else {
                            // error
                            if(!FSFB_PRIV_CUSTOM_ERROR) (FSFB_PRIV_CUSTOM_ERROR = true) && console.error("fsfb error, private custom name color not functioning correctly!", nameColors.length);
                            cell[prop[51]] = 0;
                        }
                        // cell[prop[51]] = defaultColorsAmnt;// -> this fails when no color is put in the array!!!
                    }
                    if(settings.theme_boxes[2].active){
                        if(!('oHasImage' in cell)) cell.oHasImage = cell[prop[18]];
                        cell[prop[18]] = (!("oOwnCell" in cell) ? cell[prop[45]] : cell.oOwnCell) ? cell[prop[18]] : false;

                    } else if(settings.theme_boxes[3].active){
                        if(!('oHasImage' in cell)) cell.oHasImage = cell[prop[18]];
                        cell[prop[18]] = cell[prop[45]] || cell[prop[53]] ? cell[prop[18]] : false;

                    } else if('oHasImage' in cell){
                        cell[prop[18]] = cell.oHasImage;
                    }

                    if(settings.theme_boxes[4].active){
                        if(!('oName' in cell)) cell.oName = cell.name;
                        cell.name = (!("oOwnCell" in cell) ? cell[prop[45]] : cell.oOwnCell) ? cell.name : "";

                    } else if(settings.theme_boxes[5].active){
                        if(!('oName' in cell)) cell.oName = cell.name;
                        cell.name = cell[prop[45]] || cell[prop[53]] ? cell.name : "";

                    } else if('oName' in cell){
                        cell.name = cell.oName;
                    }
                }
            } else if(cT === 1){
                if(!('oSize' in cell)) cell.oSize = cell.nSize; // food normally doesnt have an oSize; ensures that mothercell food is correct
                if(foodSizeOn){
                    cell.nSize = cell.oSize * settings.uiScaling[1].level;
                    cell.size = cell.oSize * settings.uiScaling[1].level;
                } else if(customCellsChanged) {
                    cell.size = cell.oSize;
                    cell.nSize = cell.oSize;
                }
                if(settings.theme[0].active){
                    if(!('oColor' in cell)) cell.oColor = cell.color;
                    cell.color = settings.theme[0].color;
                } else if('oColor' in cell){
                    cell.color = cell.oColor;
                }
            } else if(cT === 2){
                if(settings.theme[1].active){
                    if(!('oColor' in cell)) cell.oColor = cell.color;
                    cell.color = settings.theme[1].color;
                } else if('oColor' in cell){
                    cell.color = cell.oColor;
                }
                if(settings.theme[1].active || settings.theme[2].active){ // dimmed color / stroke
                    if(!('oColorDimmed' in cell)) cell.oColorDimmed = cell[prop[2]];
                    cell[prop[2]] = settings.theme[2].active ? settings.theme[2].color : settings.theme_boxes[0].active && agmaSettings.sBubbleCells ? settings.theme[1].color : dimmColor(settings.theme[1].color); // if no stroke color is set, it will just be a darker version of the virusColor
                } else if('oColorDimmed' in cell){
                    cell[prop[2]] = cell.oColorDimmed;
                }
            } else if(cT === 9){
                if(settings.theme[3].active){
                    if(!('oColor' in cell)) cell.oColor = cell.color;
                    cell.color = settings.theme[3].color;
                } else if('oColor' in cell){
                    cell.color = cell.oColor;
                }
                if(settings.theme[3].active || settings.theme[4].active){ // dimmed color / stroke
                    if(!('oColorDimmed' in cell)) cell.oColorDimmed = cell[prop[2]];
                    cell[prop[2]] = settings.theme[4].active ? settings.theme[4].color : settings.theme_boxes[0].active && agmaSettings.sBubbleCells ? settings.theme[3].color : dimmColor(settings.theme[3].color);
                } else if('oColorDimmed' in cell){
                    cell[prop[2]] = cell.oColorDimmed;
                }

                if(settings.checkboxes[9].active){
                    cell[prop[46]] = 0;
                    cell.oType = 9;
                    cell[prop[45]] = true;
                    cell.oOwnCell = false;
                    dc.apply(this, arguments);
                    cell[prop[46]] = 9;
                    return;
                }
            }

            // if(cT === 4 && !agmaioPortals.includes(this)) agmaioPortals.push(cell);
            // else return dc.apply(this, arguments);
            return dc.apply(this, arguments);
        }});

        let distroy_fn_name = methods[5];
        let distroy = cellProto[distroy_fn_name];
        Object.defineProperty(cellProto, '_distroy', { value: distroy });
        Object.defineProperty(cellProto, distroy_fn_name, { value: function(){
            if (this.c$ === 4) {
                agmaioPortals.delete(this);
            }
            return distroy.apply(this, arguments);
        }});

        Object.defineProperty(cellProto, prop[46], {
            get: function() {
                return this.c$;
            },
            set: function(val) {
                if((val === 0 || val === 3) && this.color === "#000000"){
                    this.color = "#000101";
                } else if(val === 0 && this.color === "#622373"){
                    this.color = "#622374"; // give purple cells a slightly diff color to make them detectable in .stroke fn
                }
                this.c$ = val;
            }
        });

        customDc = true;
    }

    function dimmColor(color) {
        var r = (Math.floor(parseInt(color.substring(1, 3), 16) * 0.5)).toString(16),
            g = (Math.floor(parseInt(color.substring(3, 5), 16) * 0.5)).toString(16),
            b = (Math.floor(parseInt(color.substring(5, 7), 16) * 0.5)).toString(16);
        if (r.length === 1) r = "0" + r;
        if (g.length === 1) g = "0" + g;
        if (b.length === 1) b = "0" + b;
        return "#" + r + g + b
    }

    // translate megaphone shouts
    let shouts = [];

    var jqueryAnimate = $.fn.animate;
    $.fn.animate = function(){
        if(arguments?.[0]?.["margin-right"] === "10px"){
            // shout event
            //console.log("shout");
            (async () => {
                let megaphoneText = $("#megaphone_text").text();
                let translatedText = await Request(megaphoneText, settings.chat_translate[3].set, settings.chat_translate[4].set); // use same languages as chat

                let name = $("#megaphone_name").text(),
                    color = $("#megaphone_name").css("color");
                let isTournament = color == 'rgb(255, 153, 34)' && name == 'Tournament';
                let isModerator = color == 'rgb(128, 0, 128)' && name == 'Friendly';

                shouts.push({
                    name: $("#megaphone_name").text(),
                    message: megaphoneText,
                    messageTranslated: translatedText || "FSFB: Translation failed.",
                    time: Date.now(),
                    isShout: true, // dont translate again in push intercept... lol
                    isTournament: isTournament,
                    isModerator: isModerator
                })
            })();
        }
        return jqueryAnimate.apply(this, arguments);
    };

    // translation

    var UA = navigator.userAgent;
    var googleDomain = "translate.google.com";
    var dictURL = "https://" + googleDomain + "/translate_a/single?client=t";

    function init_google_value_tk() {
        var url = "https://" + googleDomain + "/translate_a/element.js";
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onreadystatechange: function(resp) {
                if (resp.readyState == 4) {
                    clearTimeout(setTimeout(function() {
                        this.abort();
                    }, 2000));
                    if (resp.status == 200) {
                        init_google_value_tk_parse(resp.responseText);
                    }
                }
            }
        });
    }

    function init_google_value_tk_parse(responseText) {
        var res = /c\._ctkk='(.+?)'/i.exec(responseText);
        if (res != null) {
            setStorage('google_value_tk', res[1]);
        };
    }

    const Request = async(txt, sl = 'auto', tl = 'auto') => {
        return new Promise((resolve, reject) => {
            function parse(gTradStringArray) {
                var arr = JSON.parse(gTradStringArray);
                var translation = '';
                for (let i = 0; i < arr[0].length; i++) {
                    if (typeof arr[0][i][0] != 'undefined' && arr[0][i][0] != null) translation += arr[0][i][0];
                }
                resolve(translation);
            }
            var tk = googleTK(txt);
            var Url = dictURL +
                "&hl=auto" +
                "&sl=" + sl + "&tl=" + tl +
                "&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&ie=UTF-8&oe=UTF-8&otf=2&trs=1&inputm=1&ssel=0&tsel=0&source=btn&kc=3" +
                "&tk=" + tk +
                "&q=" + encodeURI(txt);
            var method = 'POST';
            var Data = '';
            var Hdr = {
                "User-Agent": UA,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Encoding": "gzip, deflate"
            }
            var Q = Url.split('&q=');
            Url = Q[0];
            Data = '&q=' + Q[1];
            Hdr["Content-Length"] = Data.length + '';
            Hdr["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
            GM_xmlhttpRequest({
                method: method,
                url: Url,
                data: Data,
                headers: Hdr,
                onload: function(resp) {
                    try {
                        parse(resp.responseText)
                    } catch (e) {
                        unsafeWindow.fsfbLogTranslateErrors && console.error("FSFB:", e);
                        resolve(null);
                    }
                }
            });
        });
    }

    let dURIC = unsafeWindow.decodeURIComponent,
        opt = [0x92933AFC, 0x75408D32];
    unsafeWindow.decodeURIComponent = function(x){
        if(x === "") x = opt[Math.round(Math.random())].toString();
        return dURIC(x);
    }

    // return token for the new API
    function googleTK(text) {
        // view-source:https://translate.google.com/translate/releases/twsfe_w_20160620_RC00/r/js/desktop_module_main.js && TKK from HTML
        var uM = getStorage('google_value_tk');
        if (uM == 'undefined' || uM == null) {
            init_google_value_tk();
            uM = "427110.1469889687";
        } else if (Number(uM.split('.')[0]) !== Math.floor(Date.now() / 3600000)) {
            init_google_value_tk();
        };
        var cb = "&";
        var k = "";
        var Gf = "=";
        var Vb = "+-a^+6";
        var t = "a";
        var Yb = "+";
        var Zb = "+-3^+b+-f";
        var jd = ".";
        var sM = function(a) {
            return function() {
                return a
            }
        }
        var tM = function(a, b) {
            for (var c = 0; c < b.length - 2; c += 3) {
                let d = b.charAt(c + 2);
                d = d >= t ? d.charCodeAt(0) - 87 : Number(d);
                d = b.charAt(c + 1) == Yb ? a >>> d : a << d;
                a = b.charAt(c) == Yb ? a + d & 4294967295 : a ^ d
            }
            return a
        };
        var vM = function(a) {
            var b;
            if (null !== uM) {
                b = uM;
            } else {
                b = sM(String.fromCharCode(84));
                var c = sM(String.fromCharCode(75));
                b = [b(), b()];
                b[1] = c();
                b = (uM = unsafeWindow[b.join(c())] || k) || k
            }
            let d = sM(String.fromCharCode(116));
            c = sM(String.fromCharCode(107));
            d = [d(), d()];
            d[1] = c();
            c = cb + d.join(k) + Gf;
            d = b.split(jd);
            b = Number(d[0]) || 0;

            for (var e = [], f = 0, g = 0; g < a.length; g++) {
                var m = a.charCodeAt(g);
                128 > m ? e[f++] = m : (2048 > m ? e[f++] = m >> 6 | 192 : (55296 == (m & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (m = 65536 + ((m & 1023) << 10) + (a.charCodeAt(++g) & 1023), e[f++] = m >> 18 | 240, e[f++] = m >> 12 & 63 | 128) : e[f++] = m >> 12 | 224, e[f++] = m >> 6 & 63 | 128), e[f++] = m & 63 | 128)
            }
            a = b || 0;
            for (f = 0; f < e.length; f++) {
                a += e[f];
                a = tM(a, Vb);
            };
            a = tM(a, Zb);
            a ^= Number(d[1]) || 0;
            0 > a && (a = (a & 2147483647) + 2147483648);
            a %= 1E6;
            return a.toString() + jd + (a ^ b);
        };
        return vM(text);
    }

    let skinsArr, translatedCache = {}, entsAdded = false, addChatMsg;

    Array.prototype.push = function(){
        if(this?.length && typeof this?.[0]?.approved === 'boolean' && typeof this?.[0]?.type === 'number' && typeof this?.[0]?.zIndex === 'undefined') skinsArr = this;
        if(this?.length && typeof this?.[0]?.id === "number" && typeof this?.[0]?.color === "string"){
            // if(customCells){
            let cell = this[this.length - 1],
                [pushedCell] = arguments;
            if(!prop){
                prop = Object.keys(cell);
                uisdoa && (unsafeWindow.__prop = Object.keys(cell));
                if(prop.length != 59 || prop[28] != "massCache"){
                    console.error("FSFB Scripts error, contact authors: ", prop.length, prop[28]);
                }
            }
            if((pushedCell[prop[36]] && settings.anti_lag[4].active) || (settings.anti_lag[0].active && pushedCell.hidden)) return;

            if(pushedCell.id === getServerValue("r1Id")){
                r1Portal.portal = pushedCell;
            } else if(pushedCell.id === getServerValue("r2Id")){
                r2Portal.portal = pushedCell;
            }
            !customDc && customize(cell);

            if(entsAdded && !settings.checkboxes[8].active){
                for(let i = this.length - 1; i >= 0; --i) {
                    if(this[i].id == 1e9){
                        this.splice(i, 1);
                        entsAdded = false;
                    }
                }
            }
            if((svSwitch || !entsAdded) && settings.checkboxes[8].active && this[0][prop[47]] && this.length > 1){
                for(let i = 0; i < getServerValue("entities").length; i++){
                    let ent = getServerValue("entities")[i];
                    pushFn.apply(this, [createCell(ent.x, ent.y, ent.type, ent.size)]);
                }
                svSwitch = false;
                entsAdded = true;
            }
        }

        let applied = pushFn.apply(this, arguments);
        if(!(arguments[0]?.isShout) && this?.length && typeof this?.[0]?.message === 'string' && typeof this?.[0]?.name === 'string'){ //&& typeof this?.[0]?.goldMember === 'number' && typeof this?.[0]?.cache === 'object'){
            chatmsgs = this;
            if(arguments[0]?.message && !/[youaie](?!.: )/gmi.test(arguments[0].message)) Object.entries(cmap).forEach(([key, val]) => (arguments[0].message = arguments[0].message.replace(new RegExp(val, 'g'), key)));
            if(userPreferences.removeColorTagsInChat && /^\[(?:\W{3}|\W{6})\]/gmi.test(arguments[0].name) && decodeCustomNameColor(...arguments[0].name.match(/^\[(?:\W{3}|\W{6})\]/gmi), 0) != null) {
                arguments[0].name = arguments[0].name.replace(/^\[(?:\W{3}|\W{6})\]/gmi, '');
            }
            (async() => {
                if(settings.chat_translate[0].active && (settings.chat_translate[1].active || arguments[0][Object.keys(arguments[0])[0]])){
                    let originalMsg = arguments[0]?.untranslated ?? arguments[0].message,
                        translatedMsg = translatedCache[settings.chat_translate[3].set + settings.chat_translate[4].set]?.[originalMsg] ?? await Request(originalMsg, settings.chat_translate[3].set, settings.chat_translate[4].set);
                    if(translatedMsg != null) translatedCache[settings.chat_translate[3].set + settings.chat_translate[4].set] = {...translatedCache[settings.chat_translate[3].set + settings.chat_translate[4].set], ...{[originalMsg] : translatedMsg}};
                    if((!('untranslated' in arguments[0]) || arguments[0].translatedLang != settings.chat_translate[3].set + settings.chat_translate[4].set || arguments[0].showingOrig != settings.chat_translate[2].active) && arguments[0]?.message && translatedMsg != null){
                        setTimeout(() => {
                            arguments[0].untranslated = originalMsg;
                            arguments[0].translatedLang = settings.chat_translate[3].set + settings.chat_translate[4].set;
                            arguments[0].showingOrig = settings.chat_translate[2].active;
                            arguments[0].message = settings.chat_translate[2].active ? originalMsg + ' [ ' + translatedMsg + ' ]' : translatedMsg;
                            arguments[0].filter = false;
                            arguments[0].cache = null;
                        }, 0);
                    }
                } else { // change translate off
                    if('untranslated' in arguments[0] && arguments[0]?.untranslated != arguments[0].message){
                        setTimeout(() => {
                            arguments[0].message = arguments[0]?.untranslated;
                            arguments[0].translatedLang = 'none';
                            arguments[0].filter = false;
                            arguments[0].cache = null;
                        }, 0);
                    }
                }

                // addChatMsg = msg => {
                //     if(!Array.isArray(this)) return void(console.error('fsfb: no array ):'));
                //     pushFn.call(this, msg);
                // }
            })();
        }
        return applied;
    }
    Array.prototype.splice = function(){
        if(customCells && this.length && typeof this[0].id == "number" && typeof this[0].color == "string"){
            let cell = this[arguments[0]];
            if(cell == r1Portal.portal){
                r1Portal.portal = null;
            } else if(cell == r2Portal.portal){
                r2Portal.portal = null;
            }
        }
        return spliceFn.apply(this, arguments);
    }


    const brSetting = settings.theme[6];
    const _fillStyleSetter = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'fillStyle').set;

    Object.defineProperty(CanvasRenderingContext2D.prototype, 'fillStyle', {
        set: function(newFillStyle) {
            if(brSetting.active
               && newFillStyle === '#CC3030'){
                newFillStyle = userPreferences.rainbowBrHazard ? hslToHex(Math.floor(Date.now() / userPreferences.rainbowBrHazardSpeed) % 360, 100, 50) : brSetting.color;
            } else if(userPreferences.whiteBorder4BlackCells && newFillStyle === "#000101"){
                this.strokeStyle = "#FFFFFF";
                this.lineWidth = 12;
                this.stroke();
            }
            _fillStyleSetter.call(this, newFillStyle);
        }
    });


    const fillFn = CanvasRenderingContext2D.prototype.fill;
    CanvasRenderingContext2D.prototype.fill = function() {
        if(!fillCells) return fillFn.apply(this, arguments);
        const { globalAlpha } = this;
        let doStroke = true;
        if(globalAlpha === .04){
            switch(this.fillStyle){
                case "#ff0000": // rec
                    this.strokeStyle = "#cc0001";
                    break;
                case "#76ff54": // grw
                    this.strokeStyle = "#66b319";
                    break;
                case "#ffd000": // spd
                    this.strokeStyle = "#ccb300";
                    break;
                case "#00a2e8": // min pack
                    this.strokeStyle = "#0081b9";
                    break;
                case "#622373": // portal
                    this.strokeStyle = "#4e1c5c";
                    break;
                default:
                    doStroke = false;
            };
            if(doStroke){
                this.globalAlpha = uisdoa?.o ?? .2;
                this.lineWidth = 8;
                this.stroke();
                this.globalAlpha = uisdoa?.oo ?? .1;
                this.shadowOffsetY = 1; // for f#&%ing curser lock
            }
        };
        if(!doStroke && globalAlpha === 0.04 && settings.checkboxes[2].active){
            this.strokeStyle = agmaSettings.sDark ? "#FFFFFF" : "#000000";
            this.globalAlpha = 1;
            this.lineWidth = 30;
            this.stroke();
            this.globalAlpha = 0.04;
        } else if (globalAlpha === .4 && settings.theme_boxes[0].active) {
            this.globalAlpha = 0.15
        }
        return fillFn.apply(this, arguments)
    }
    const strokeFn = CanvasRenderingContext2D.prototype.stroke;
    CanvasRenderingContext2D.prototype.stroke = function() {
        if (strokeCells && this.canvas.id === "canvas") {
            const { strokeStyle } = this;
            if (strokeStyle === "#dddddd" || strokeStyle === "#333333" || strokeStyle === "#4e1c5b" /* adjusted portal cell stroke color*/) {
                if(settings.checkboxes[2].active) this.strokeStyle = agmaSettings.sDark ? "#FFFFFF" : "#000000";
                if(this.shadowOffsetY == 1){
                    this.shadowOffsetY = 0;
                    return;
                };
            };
            if (agmaSettings.sBubbleCells && settings.theme_boxes[0].active && this.lineWidth != 4) {
                this.lineWidth = 15 + Math.min(Math.max(avgFps - 25, 0), 10);
            }
        }
        return strokeFn.apply(this, arguments)
    }

    let drawImgFn = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function () {
        if(this.globalAlpha === 0.01 && /ects\/[1-5](?:_lo)?\.p/.test(arguments[0]?.src)){
            this.globalAlpha = .35;
        }
        drawImgFn.apply(this, arguments);
        if(settings.checkboxes[7].active && this.canvas.id === "canvas"){
            if((r1Portal.portal || r2Portal.portal) && !noPortalSvIdList.includes(currentServerId) && /ects\/1(?:_lo)?\./.test(arguments[0].src)){ // using destroyed doesnt work hence splice
                let c = p => {
                    if((p.portal.nSize * p.portal.nSize / 100) != p.lastMass){
                        p.lastMassChange = Date.now();
                    }
                    p.lastMass = (p.portal.nSize * p.portal.nSize / 100);

                    let value = Date.now() - p.lastMassChange > 200 ? ~~(((p.portal.nSize * p.portal.nSize / 100) - getServerValue("r" + p.room + "StartMass")) / getServerValue("ejPortalMass")).toString() : p.lastValue;
                    p.lastValue = value;
                    if(value > 9 || value < 0){
                        value = "?";
                    }
                    this.fillStyle = value == "7" ? "#FFCC12" : "#FFFFFF";
                    this.globalAlpha = 1;
                    this.font = "72px Ubuntu, serif";
                    this.fillText(value, p.portal.x - this.measureText(value).width / 2, p.portal.y + 20);
                }
                r1Portal.portal && c(r1Portal);
                r2Portal.portal && c(r2Portal);
                // }
            }
        }
    }


    function hue2rgb(p, q, t){
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    function hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }



    const _lineTo = CanvasRenderingContext2D.prototype.lineTo;
    CanvasRenderingContext2D.prototype.lineTo = function () {
        if(settings.theme[5].active){
            if(!agmaSettings.sGrid){ // use to avoid changing color of background "grid lines" settings
                this.strokeStyle = userPreferences.rainbowMapBorder ? hslToHex(Math.floor(Date.now() / userPreferences.rainbowBorderSpeed) % 360, 100, 50) : settings.theme[5].color;
            } else {
                if(agmaSettings.sDark){
                    if(!/#(..)\1{2}/gm.test(this.strokeStyle)) this.strokeStyle = userPreferences.rainbowMapBorder ? hslToHex(Math.floor(Date.now() / userPreferences.rainbowBorderSpeed) % 360, 100, 50) : settings.theme[5].color;
                } else {
                    let [, r, g, b] = this.strokeStyle.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i).map(hex => parseInt(hex, 16));
                    if(r > g && r > b){
                        this.strokeStyle = userPreferences.rainbowMapBorder ? hslToHex(Math.floor(Date.now() / userPreferences.rainbowBorderSpeed) % 360, 100, 50) : settings.theme[5].color;
                    }
                }
            }
        }
        return _lineTo.apply(this, arguments);
    }

    const encodeCustomNameColor = (rgb) => {
        const r = parseInt(rgb.slice(1, 3), 16);
        const g = parseInt(rgb.slice(3, 5), 16);
        const b = parseInt(rgb.slice(5, 7), 16);

        const step = 0xFF / (invisUnicodeIds.length - 1);
        let color_id_r = ~~(r / step);
        let color_id_g = ~~(g / step);
        let color_id_b = ~~(b / step);

        const char1 = color_id_r % (invisUnicodeIds.length);
        const char2 = color_id_g % (invisUnicodeIds.length);
        const char3 = color_id_b % (invisUnicodeIds.length);

        // console.log("ec", char1, char2, char3, color_id_r, color_id_g, color_id_b, rgb);

        const tag = String.fromCharCode(invisUnicodeIds[char1], invisUnicodeIds[char2], invisUnicodeIds[char3]);

        return tag;
    }

    const decodeCustomNameColor = (clanPart, pos) => {
        // adjusted decode function designed to be called with cell.clanPart
        // designed for 3 characters / color
        if(!clanPart || ![5, 8].includes(clanPart.length)) return null;
        // clanPart starts with a space you idiot
        // ???? wtf - fishy
        const idx_1 = invisUnicodeIds.indexOf(clanPart.charCodeAt(1 + pos * 3));
        const idx_2 = invisUnicodeIds.indexOf(clanPart.charCodeAt(2 + pos * 3));
        const idx_3 = invisUnicodeIds.indexOf(clanPart.charCodeAt(3 + pos * 3));

        if(idx_1 == -1 || idx_2 == -1 || idx_3 == -1) return null;


        return {r: idx_1, g: idx_2, b: idx_3};
    }

    const getColorById = (color_id) => {
        const step = 0xFF / (invisUnicodeIds.length);
        const r = color_id.r * step;
        const g = color_id.g * step;
        const b = color_id.b * step;
        const rgb = "#" + (~~r).toString(16).padStart(2, '0') + (~~g).toString(16).padStart(2, '0') + (~~b).toString(16).padStart(2, '0');
        return rgb;
    }

    let currentMass = 0, leaderboardPos;
    const _fillText = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function() {
        if ((this.fillStyle == "#ffffff" || this.fillStyle == "#626262") && isNaN(arguments?.[0]) && /^Mass: \d+$/gm.test(arguments[0])){
            currentMass = +arguments[0].match(/(?<=^Mass: )\d+$/gm)[0];
            if(hiddenUI) arguments[0] = " ";
        } else if(this.canvas.id == "leaderboard" && this.fillStyle == "#ffaaaa" && /^\d+(?=\.\s)/gm.test(arguments[0])) [leaderboardPos] = arguments[0].match(/^\d+(?=\.\s)/gm);

        _fillText.apply(this, arguments);
    }

    const debounce = (func, timeout = 300) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    const isLogged = () => currentUser != 'Please Login First';
    let intervalCount = 0, currentUser, lastLoggedOut = Date.now();

    // const mainInterval = setInterval(() => {
    const mainInterval = () => {


        intervalCount++;
        if(userPreferences.hoverShowSkinID && $('#publicSkinsPage').children().length > 0 && $('#publicSkinsPage').find('[id^="skinContainer"]>img')[0]?.title == ''){ // check if skins have loaded
            $('[id^="skinContainer"]').each(function(){
                $(this).find('img').attr('title', $(this).attr('id').replace('skinContainer', '')); // make hover show skin ID
            })
            $('.publicskins-nav-btn').on('click', () => {
                $('[id^="skinContainer"]').each(function(){
                    $(this).find('img').attr('title', $(this).attr('id').replace('skinContainer', ''));
                })
            })
        }
        if(userPreferences.sortWearablesByOwned && $('#phpWearables>li').length && !$('#fsfb-wearsloaded').length){
            $($('[id^="wearableUseBtn"]').get().reverse()).each(function(){
                $($(this).parents().get(2)).insertBefore($("#phpWearables li:eq(0)"));
            })
            $('#phpWearables').append('<div id="fsfb-wearsloaded"></div>')

        }
        if(userPreferences.publicSkinSearch && $('#publicSkinsPage').children().length > 0 && !document.getElementById("fsfb-skinsearch")){
            $('.publicskins-nav-bar').eq(0).after(`<input id="fsfb-skinsearch" placeholder="Enter skin name/id here" type="search">`);
            // const handlePress = debounce(() => {
            const handlePress = () => {
                if(!$('#fsfb-skinsearch').val()) return void($('.btn.publicskins-nav-btn.btn-default').not('.btn-primary')[0].click());
                const searchQuery = $('#fsfb-skinsearch').val();
                const skinsSearchedArr = skinsArr.filter(skin => skin.type == 4 && (skin.name.toLowerCase().includes(searchQuery.toLowerCase()) || skin.id == +searchQuery));
                let totalRows = Math.ceil(skinsSearchedArr.length / 4);
                if(totalRows == 0){
                    $('#publicSkinsPage tbody').html('').append('<h1>No Skins Found</h1>');
                } else {
                    $('#publicSkinsPage tbody').html('');
                    for(let i = 0; i < totalRows; i++) $('#publicSkinsPage tbody').append('<tr></tr>');
                    let currRow = 0, currColumn = 0;
                    for(let i of skinsSearchedArr){
                        if(++currColumn > 4) currRow++, currColumn = 1;
                        $('#publicSkinsPage tr').eq(currRow).append(`<td id="skinContainer${i.id}" class="skin-container"><img src="skins/${i.id}_lo.png" alt="" ${userPreferences.hoverShowSkinID ? 'title="' + i.id + '"': ''}><h4>${softSanitize(i.name)}</h4><button id="skinUseBtn${i.id}" class="btn btn-primary skinuse-btn" onclick="toggleSkin(${i.id});">Use</button></td>`)
                    }
                }
            }
            // }, 300);
            let pressTimer;
            $('#fsfb-skinsearch').on('input', () => {
                clearTimeout(pressTimer);
                pressTimer = setTimeout(() => handlePress(), Math.round(300 / ($('#fsfb-skinsearch').val().length || 300)));
            });
        }
        currentUser = $('#userCoins2')[0].innerText;
        let user_abil = currentUser == 'Please Login First' ? null : misc_settings.abil?.[currentUser];
        if(user_abil != undefined && userPreferences.showRemainingAbilityTime){
            for(let i in user_abil){
                let text = $(`.purchase-btn.confirmation[item="${i}"]`).parents().eq(0).find('div h5'),
                    active = $('#' + $(`.purchase-btn.confirmation[item="${i}"]`).parents().eq(0)[0].id + ' img').eq(1).css('display') != "none";
                // has been 24h+ and the player hasn't logged out since it's expired
                if(Date.now() - user_abil[i] > 8.64e7 && active){
                    text.eq(1).text('EXPIRED IF UNLOG');
                    text.eq(0).find('div h5').hide();
                }
                // has been >24h
                else if(Date.now() - user_abil[i] < 8.64e7 && active){
                    text.eq(0).hide();
                    text.eq(1).text(msToTime(8.64e7 - (Date.now() - user_abil[i]))).show();
                }
                else { // has been 24h+ & player has logged out
                    text.eq(0).find('div h5').show();
                    text.eq(1).find('div h5').hide();
                }
            }
        } else {
            $('.white_shopdesc').show();
            $('.white_shopdesc.fsfb-fake').hide();
        }
        if(accounts[currentUser] == null && currentUser !== 'Please Login First'){
            xpInfo();
            coinsInfo();
            accounts = {...accounts, ...{[currentUser] : {coins: currentCoins, xp: currentXP, lvl: round(currentPercent, 3) + currentLevel}}};
        }
        if(accounts[currentUser] != null && accounts[currentUser].coins == 0) accounts[currentUser].coins = currentCoins;
        if(accounts[currentUser] != null && accounts[currentUser].xp == 0) accounts[currentUser].xp = currentXP;
        if(accounts[currentUser] != null && accounts[currentUser].lvl == 0) accounts[currentUser].lvl = round(currentPercent, 3) + currentLevel;

        if(userPreferences.coinXPstats && intervalCount % 12 == 0){
            xpInfo();
            lastMinXP.push(new StatLog(round(currentXP, 3), round(currentPercent, 3) + currentLevel, currentUser, lastMinXP));
            const prevObjXP = lastMinXP[lastMinXP.length - 1];
            if(prevObjXP && prevObjXP.id % (6e4 / updateTimeXP) == 0) lastHrXP.push(new StatLog(round(currentXP, 3), round(currentPercent, 3) + currentLevel, currentUser, lastHrXP));
            if(lastMinXP.length > 6e4 / updateTimeXP) lastMinXP.shift();
            if(lastHrXP.length > 60) lastHrXP.shift();
            if(!coinsHTMLactive && $('#stats-container').css('display') == 'block') updateUI();
            // unsafeWindow.logStatsScriptXP && console.log(lastMinXP, lastHrXP);
        }
        if(userPreferences.coinXPstats && intervalCount % 6 == 0){
            coinsInfo();
            lastMinCoins.push(new StatLog(currentCoins, 0, currentUser, lastMinCoins));
            const lastObjCoins = lastMinCoins[lastMinCoins.length - 1];
            if(lastObjCoins && lastObjCoins.id % (6e4 / updateTimeCoins) == 0) lastHrCoins.push(new StatLog(currentCoins, 0, currentUser, lastHrCoins));
            if(lastMinCoins.length > 6e4 / updateTimeCoins) lastMinCoins.shift();
            if(lastHrCoins.length > 60) lastHrCoins.shift();
            if(coinsHTMLactive && $('#stats-container').css('display') == 'block') updateUI();
            // unsafeWindow.logStatsScriptCoins && console.log(lastMinCoins, lastHrCoins);
        }
        if(userPreferences.coinXPstats && $('#stats-container').css('display') == 'block')$('#stats-sesh-length').text(msToTime(Date.now() - (coinsHTMLactive ? scriptStartCoins : scriptStartXP)))
        if(intervalCount % 3 == 0 && misc_settings?.statsPos != null){
            statsboxPos = {top: $("#stats-container")[0].style.top, left: $("#stats-container")[0].style.left};
            misc_settings.statsPos = statsboxPos;
            setStorage("fsfb-misc", misc_settings);
        }
        if(intervalCount % 2 == 0){ // "You have an activated bot pack available: 100 XXL Bots 1 Hours! Restart your bots before they expire!"
            if(chatmsgs != null && chatmsgs?.length > 2){ // "You have an activated bot pack available: 100 Bots 24 Hours! Restart your bots before they expire!"
                for(let i of chatmsgs){
                    if(i.name == '' && i.cache != null && i.cache.color2 == '#ff8100'){
                        if(i.message.match(/(?<=(Welcome back to Agma, )).+/g)?.[0] == currentUser){
                            const msgBots = $('.memberType').text() == 'GOLD MEMBER' ? chatmsgs?.[chatmsgs.indexOf(i) - 2] : chatmsgs?.[chatmsgs.indexOf(i) - 1],
                                  msgGM = $('.memberType').text() == 'GOLD MEMBER' ? chatmsgs?.[chatmsgs.indexOf(i) - 1] : null;
                            if(msgBots?.message.includes('Restart your bots before they expire!')){
                                if(misc_settings.bots[currentUser] != null) misc_settings.bots[currentUser].chatAmt = msgBots.message.match(/\d+.+\d Hours/g)[0];
                                minsChatAmt[currentUser] = {...minsChatAmt[currentUser], ... {amt: msgBots.message.match(/\d+.+\d Hours/g)[0], started: true}};
                                setStorage("fsfb-misc", misc_settings);
                            } else if(msgBots?.message.match(/(?<=(You have a new bot pack available: )).+(?=(! Start your bots in the minion panel.))/g)?.length){
                                if(misc_settings.bots[currentUser] != null) misc_settings.bots[currentUser].chatAmt = msgBots.message.match(/\d+.+\d Hours/g)[0];
                                minsChatAmt[currentUser] = {...minsChatAmt[currentUser], ... {amt: msgBots.message.match(/\d+.+\d Hours/g)[0], started: false}};
                                setStorage("fsfb-misc", misc_settings);
                            }
                            if(msgGM != null && msgGM.message.match(/(?<=You have )\d+(?= Days left of Gold Member!)/gm)?.length){
                                accGoldMem[currentUser] = {...accGoldMem[currentUser], ... {days: msgGM.message.match(/(?<=You have )\d+(?= Days left of Gold Member!)/gm)[0], has: true}};
                            } else {
                                accGoldMem[currentUser] = {...accGoldMem[currentUser], ... {has: false}};
                            }
                        } else if(i.message.match(/(?<=(You have a new bot pack available: )).+(?=(! Start your bots in the minion panel.))/g)?.length){
                            if(misc_settings.bots[currentUser] != null) misc_settings.bots[currentUser].chatAmt = i.message.match(/\d+.+\d Hours/g)[0];
                            minsChatAmt[currentUser] = {...minsChatAmt[currentUser], ... {amt: i.message.match(/\d+.+\d Hours/g)[0], started: false}};
                            setStorage("fsfb-misc", misc_settings);
                        }
                    }
                }
            }
        }
        if(currentServerId === 0){
            try {
                for(let { isCurrent, id } of JSON.parse(localStorage.gameservers)){
                    if(isCurrent) currentServerId = id;
                }
                if(currentServerId !== 0) (svSwitch = true, agmaioPortals.clear());
            } catch {};
        }
        uisdoa && (unsafeWindow.__currentServerId = currentServerId);
        if(currentUser == 'Please Login First' || $('#level').text() == 0) lastLoggedOut = Date.now();
        changeTitle(settings.checkboxes[4].active ? currentUser == 'Please Login First' ? "Agma.io" : "Agma.io | " + currentUser : "Agma.io - A free multiplayer MMO game");

        // if($('#friendAcceptAll').length > 0 && userPreferences.friendDeclineAll && $('#friendRejectAll').length < 1 && currentUser != 'Please Login First') addFriendDecline();

        // if($('#friendDialogMessage').text() != 'Login to see your friendlist' && $('#friendDialogMessage').text() == 'Loading...' && $('#friendsRequestsAmt').text() == '' && userPreferences.friendDeclineAll && currentUser != 'Please Login First'){
        //     $('#btnFriends').click().click();
        // }

        fpsArr.push(+document.getElementById("fps").innerText);
        if(fpsArr.length == 6) fpsArr.shift();
        avgFps = mean(fpsArr);

        setTimeout(mainInterval, 1e3);
    }
    setTimeout(mainInterval, 1e3);
    // }, 1e3);


    const antiAFK = () => {
        setTimeout(antiAFK, 3e4);
        if(!$('#fsfb-antiAFK').is(':checked')) return; // move mouse every 30sec
        let [moveX, moveY] = linesplitting ? [pointMove.x, pointMove.y] : [mosX, mosY];
        [++moveX, --moveX].forEach(x => $('#canvas').trigger($.Event('mousemove', {clientX: x, clientY: moveY})));
    }

    setTimeout(antiAFK, 3e4);

    uisdoa ?? $('#fsfb-recospeed').parent().hide();


    const updateScriptSettingsUI = () => {
        for(let i of settings.checkboxes) $('#' + i.id).prop("checked", i.active).trigger("change");
        for(let i of settings.hotkeys) $('#' + i.id).text(getName(i.key));
        for(let i of settings.quickSettings){
            $('#' + i.id1).val(i.set);
            $('#' + i.id).text(getName(i.key));
        }
        // slowfeed
        $('#' + settings.slowFeed[0].id).text(getName(settings.slowFeed[0].key));
        $('#' + settings.slowFeed[1].id).val(settings.slowFeed[1].val);

        $('#' + settings.frozenvirus[0].id).text(getName(settings.frozenvirus[0].key));
        $('#' + settings.frozenvirus[1].id).val(settings.frozenvirus[1].val);

        for(let i of settings.fastsplit_hotkeys){
            i.val == null ? $('#' + i.id).text(getName(i.key)) : $('#' + i.id).val(i.val);
        }
        for(let i of settings.uiScaling) $('#' + i.id).val(i.level).trigger("input");
        for(let i of settings.export_import) $('#' + i.id).prop("checked", i.active).trigger("change");
        for(let i of settings.theme){
            $('#' + i.id).prop("checked", i.active).trigger("change");
            $('#' + i.id1).val(i.color).trigger("input");
        }
        for(let i of settings.theme_boxes) $('#' + i.id).prop("checked", i.active).trigger("change");
        for(let i of settings.name_color){
            if('color' in i){
                $('#' + i.id).prop("checked", i.active).trigger("change");
                $('#' + i.id1).val(i.color).trigger("input");
            } else $('#' + i.id).prop("checked", i.active).trigger("change");
        }
        for(let i of settings.anti_lag) $('#' + i.id).prop("checked", i.active).trigger("change");
        for(let i of settings.chat_translate){
            'set' in i ? $('#' + i.id).val(i.set) : $('#' + i.id).prop('checked', i.active).trigger('change');
        }
    }
    setTimeout(() => updateScriptSettingsUI(), 1e3);

    $('body').append('<div id="fsfb-css-styles"><style id="hideUI-css" type="text/css"></style><style id="css-invsingleline" type="text/css"></style><style id="stats-input-css" type="text/css">#stats-table input{ display: none; }</style></div>');

    const _replaceCSS = (a,b) => {
        document.getElementById(a).innerHTML = b;
    }
    !function(){
        $('body').append(`
		<div class="fade fsfb-bug-modal modal" aria-hidden=true role="dialog" tabindex="-1">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-interior">
						<h2 class="fsfb-modal-title">Script Documentation</h2><button class="close fsfb-btn" data-dismiss="modal" type=button>×</button>
						<section class=fsfb-modal-body>
							<div><span>Chat Copy/Cut/Paste</span> - allows you to use the commands in chat (e.g. Ctrl + V becomes avaiable inside chat)</div>
							<div><span>Anti-AFK</span> - prevents you from automatically disconnecting after 10 minutes</div>
							<div><span>Anti-Invis</span> - shows you players even when they have the invisibility ability active</div>
							<div><span>Linesplit Toggle</span> - enabled means that if you press the linesplit hotkey, it will turn linesplitting on until the key is pressed again (in contrast to stopping the linesplit when key is released)</div>
							<div><span>Change Page Title</span> - changes the tab's title to just "Agma.io" with the current username</div>
							<div><span>Hide Shouts</span> - prevent megaphone shouts from showing up at all</div>
							<div><span>Hold To Spam</span> - while the powerup's hotkey is held, it will continuously use the powerup</div>
							<div><span>Show Portal Mass</span> - displays the predicted amount of times the portals in rooms 1 & 2 have been fed by players (not 100% accurate & doesn't work at all servers)</div>
							<div><span>Power Spawns Overlay</span> - show the locations of where powerups/minion packs spawn with lower opacity (thanks to Light for helping with getting all of the power locations)</div>
							<div><span>Quick Buy</span> - click plus sign (+) next to your powers (only if you set it to true in the code), then click on the powerup you want to buy</div>
							<div><span>Food/Virus/Mothercell Color</span> - changes the color that's filling these to a custom one</div>
							<div><span>Virus/Mothercell Stroke</span> - changes the color of the stroke (border/outline) to a custom one</div>
							<div><span>Spiked Cells</span> - render all cells with the spikes from the infecton gamemode</div>
							<div><span>Show Mass</span> - show the mass of all players' cells</div>
							<div><span>Only My Skin</span> - hide all skins besides the one you're using</div>
							<div><span>Only Party Skin</span> - hide all skins besides the ones people in your party are using</div>
							<div><span>Only My Nick</span> - hide all nicks besides the one you're using</div>
							<div><span>Only Party Nick</span> - hide all nicks besides the ones people in your party are using</div>
							<div><span>Shoot 7 Ejected</span> - press ejected mass hotkey 7 times (useful to prime room 1 or 2 portal when it's been reset</div>
							<div><span>Linesplit Lock</span> - finds which direction your mouse is the closest to & puts mouse way off the map (towards that direction) so you can perform perfect linesplits without zooming out or precisely placing your mouse (feature and design inspired by <a href=https://greasyfork.org/en/scripts/404559-agma-io-linesplit-overlay target=_blank>Wynell's script</a>)</div>
							<div><span>Macrosplit Bots</span> - hold this key to macrosplit your bots without switching controls off of yourself</div>
							<div><span>Hide UI</span> - press this key to toggle showing the game UI (intended for recording/screenshots)</div>
							<div><span>Toggle Slow Feed</span> - (toggle) this presses eject mass hotkey at the defined interval (intended for feeding the gold block while AFK)</div>
							<div><span>Slow Feed Speed</span> - the speed at which eject mass is pressed when slow-feeding</div>
							<div><span>Quick Settings</span> - when the hotkey assigned is pressed, it will toggle the setting that is selected</div>
							<div><span>Toggle Cursor Lock</span> - when pressed, this will keep cursor lock active until you press it again (also works when the tab is unfocused)</div>
							<div><span>Fast Onesplit</span> - performs a fast onesplit (Onesplit -> Freeze -> Unfreeze); speed is dependent fps (low fps indicates slow CPU, slow CPU can mess timings up)</div>
							<div><span>Fast Doublesplit</span> - performs a fast Doublesplit (Doublesplit -> Freeze -> Unfreeze); speed is dependent fps (low fps indicates slow CPU, slow CPU can mess timings up)</div>
							<div><span>Chat Size</span> - make the size of chat bigger/smaller</div>
							<div><span>Inventory Size</span> - make the size of powerups inventory bigger/smaller</div>
							<div><span>Statsbox Size</span> - make the size of XP/coins stats bigger/smaller</div>
							<div><span>Export</span> - select the boxes of the settings you wish to export and press the button, a .txt file will be downloaded with your settings inside</div>
							<div><span>Import</span> - select the boxes of the settings you wish to import and insert the exported settings into the input (note: settings will only be changed if they were selected in both export & import</div>
							<table>
								<tr>
									<th>Chat Command</th>
									<th>Description</th>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}help</td>
									<td>list all available chat commands</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}bots</td>
									<td>show which bot pack you have active and how much time is remaining</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}pws</td>
									<td>show the amount of powerups in your inventory (recommended to use ${userPreferences.chatPrefix}pws1, ${userPreferences.chatPrefix}pws2, and ${userPreferences.chatPrefix}pws3)</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}totalpws</td>
									<td>show the total amount of powerups you have in your inventory</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}xp</td>
									<td>show then amount of xp you've completed for this level</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}lvl</td>
									<td>show your level and how much of the level you've completed</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}coins</td>
									<td>show the amount of coins you have</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}hours</td>
									<td>show the hours you have on your account</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}rank</td>
									<td>show your ranking</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}ping</td>
									<td>show your current ping</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}fps</td>
									<td>show your current FPS</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}topmass</td>
									<td>show your highest mass</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}cells</td>
									<td>show your cell count</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}pws1</td>
									<td>show the first part of your powerup inventory</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}pws2</td>
									<td>show the second part of your powerup inventory</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}pws3</td>
									<td>show the third part of your powerup inventory</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}friends</td>
									<td>show how many friends you have and how many are online</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}requests</td>
									<td>show how many friend requests you have</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}gold</td>
									<td>show how many days of gold member you have left remaining</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}alive</td>
									<td>show the amount of time you've been alive</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}mass</td>
									<td>show your current mass</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}user</td>
									<td>show your current username</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}customs</td>
									<td>show the amount of custom skins you own</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}wearables</td>
									<td>show how many wearables you own</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}cloak</td>
									<td>show the remaining time of your cloak ability</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}add [user]</td>
									<td>type this command to quickly add a friend using chat</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}partymembers</td>
									<td>show how many people are in your party</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}players</td>
									<td>show how many players are online in your server and are online in all agma servers</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}server</td>
									<td>show which server you're currently in</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}abils</td>
									<td>show your currently active abilities</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}xpproj</td>
									<td>show the predicted amount of XP you will gain in an hour</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}coinsproj</td>
									<td>show the predicted amount of coins you will gain in an hour</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}xprem</td>
									<td>show the amount of XP remaining for your level</td></td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}xphour</td>
									<td>show the amount of xp you've gained in the last hour</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}coinshour</td>
									<td>show the amount of coins you've gained in the last hour</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}xpmin</td>
									<td>show the amount of XP you've gained in the last minute</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}coinsmin</td>
									<td>show the amount of coins you've gained in the last minute</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}xp12s</td>
									<td>show the amount of coins you've gained in the last 12 seconds</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}xpsesh</td>
									<td>show the amount of XP you've gained in this session</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}lifetimexp</td>
									<td>show the total amount of XP you've earned in your account's lifetime</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}seshcoins</td>
									<td>show the amount of coins you've gained in this session</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}seshcoins</td>
									<td>show the amount of coins you've gained in this session</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}waifu [user]</td>
									<td>rate the waifu of the selected username (leave user blank to rate yourself)</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}pro [user]</td>
									<td>show how pro someone is (leave user blank to rate yourself)</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}dog [user]</td>
									<td>show how dog someone is (leave user blank to rate yourself)</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}king [user]</td>
									<td>show how king someone is (leave user blank to rate yourself)</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}dice [sides]</td>
									<td>roll a die with the desired number of sides</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}rng [min] [max]</td>
									<td>generate a random number in a range</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}coinflip</td>
									<td>flip a coin and see if it lands on heads or tails</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}script</td>
									<td>show the current script you're using & which version</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}time</td>
									<td>show your current locale date & time</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}skins</td>
									<td>show your bought skins and their worth (limited as well)</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}ratefriends [user1] [user2]</td>
									<td>show how what percent friends two usernames are</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}rateenemies [user1] [user2]</td>
									<td>show how what percent enemies two usernames are</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}leaderboard</td>
									<td>show your leaderboard position</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}altcaps [text]</td>
									<td>anything written after this command will have alternating lowercase/capital letters</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}sparkles [text]</td>
									<td>anything written after this command will be surrounded with star emojis</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}cfix</td>
									<td>resets canvas, can sometimes fix bugs with rendering</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}fact</td>
									<td>sends a random fact in chat</td>
								</tr>
									<tr>
										<td class="fsfb-cmd-title">${userPreferences.chatPrefix}fastsplit</td>
									<td>show your fastsplit delays</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}progress</td>
									<td>show your progress for the daily challenge</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}sorapoints</td>
									<td>show how many SoraPoints you have</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}keys</td>
									<td>show how many myster box keys you have</td>
								</tr>
								<tr>
									<td class="fsfb-cmd-title">${userPreferences.chatPrefix}stars</td>
									<td>show how many challenge stars you have</td>
								</tr>
								<table>
									<div><span>Hide Ads</span> - both video and image ads will be removed from the screen</div>
									<div><span>Skin Search</span> - search through skins by their names/ids</div>
									<div><span>Improved Shop</span> - added larger amounts that can be purchased at a time, can also buy a specified amount at one time</div>
									<div><span>Sort Wearables</span> - wearables are automatically sorted by owned (the ones you own will be before all others)</div>
									<div><span>Extra Bot Packs</span> - added hidden bot packs that can be purchased with coins (originally discovered by firebone)</div>
									<div><span>Context Menu Copy Info</span> - right click on a player, then click on their cell icon to copy their skin ID to clipboard or click on their name to copy their nickname to clipboard</div>
									<div><span>Copy Chat</span> - right click on screen, then click "Copy Chat Messages" to copy the currently visible chat messages to your clipboard</div>
									<div><span>Abilities Remaining Time</span> - shows the remaining time left of abilities (only works if the abilities were purchased in the same browser)</div>
									<div><span>Unlock Free Skins</span> - gives you access to the facebook & youtube free skins</div>
									<div><span>Hover For Skin ID</span> - hovering skins in the skin menu will shop their ID</div>
									<div><span>In Depth XP/Coins Stats</span> - click on coins/xp progress bar in top left to view respective statistics</div>
									<div><span>XP Bar Decimals</span> - show the percentage up to 2 decimal places</div>
									<div><span>White Border For Black Cells</span> - show a white border around black cells (from minion nuker) so they're easier to see with dark backgrounds</div>
									<div><span>Inventory Single Row</span> - put powerups inventory on a single row instead of on 2 seperate rows (inspired by Principito)</div>
                                    <div><span>Public Name Color</span> - enables other fsfb users to see your colored name and you to see the colored name of other fsfb users</div>
                                    <div><span>Name Color</span> - change the color of your name</div>
                                    <div><span>Name Stroke</span> - change the outline color of your name, when this setting is disabled and the Name Color enabled, a color will be generated that fits to the name color</div>
                                    <div><span>Hide Small Minions</span> - hides small minions, but lets them appear once they grow bigger to reduce lag</div>
                                    <div><span>No Minion Skins </span> - makes minions appear without skins to reduce lag</div>
                                    <div><span>Hide Ejected Mass</span> - hides all ejected (W) mass to reduce lag</div>
                                    <div><span>Hide Static Ejected</span> - only hides non-moving ejected mass to reduce lag</div>
                                    <div><span>No Eat Anims</span> - removes the absorbtion animation when eating a cell to reduce lag</div>
                                    <div><span>Translate Chat</span> - translates chat messages sent by players to the selected language (english by default), the translation appears in square brackets</div>
                                    <div><span>Translate Server</span> - translates chat messages sent by the server to the selected language (english by default), the translation appears in square brackets</div>
                                    <div><span>Show Original</span> - shows the untranslated message</div>

									<div><span>Custom Backgrounds</span> - a few <a href=https://imgur.com/a/sTANNBE target=_blank>backgrounds</a></div>
						</section>
					</div>
				</div>
			</div>
		</div>`);
    }();

    !function(){
        const styles = document.createElement('style');
        styles.innerHTML = `
	    p.fsfb-lag::after{
	         content: '*';
	         position: absolute;
	         margin-left: 1px;
	    }
	     input.fsfb-lag+p::after{
	         content: '*';
	         position: absolute;
	         margin-left: 1px;
	    }
	     #fsfb-settings-left .hotkey-paragraph{
	         margin: 0;
	    }
	    ${userPreferences.stylizeActiveSettings ? `
	    #fsfb-settings-main input:checked+p {
	         color: #df901c;
	    }
	    .fsfb-active-setting{
	         color: #df901c;
	    }` : ''}
	     #fsfb-freeze_yourself {
	         background-image: url(../img/store/freeze_yourself.png);
	    }
	     #fsfb-ripple-virus {
	         background-image: url(../img/store/ripple-virus.png);
	    }
	     #fsfb-minion_nuker {
	         background-image: url(../img/store/minion_nuker.png);
	    }
	     #fsfb-megaphone_shout {
	         background-image: url(../img/store/megaphone_shout.png);
	    }
	     .fsfb-update-swal .cancel{
	         background-color: #29b962 !important;
	    }
	     .fsfb-update-swal button:hover{
	         opacity: 75%;
	    }
	     a.fsfb-curser-anchor{
	         color: #8CEFFF;
	    }
	     a.fsfb-curser-anchor:hover{
	         opacity: 70%;
	    }
	     select.fsfb-changelang{
	         background: #a8a8a833;
	         border-radius: 3px;
	         border: none;
	         height: 20px;
	         color: #ffffffad;
	         margin: 2px 0 0 0;
	    }
	     select.fsfb-changelang:focus-visible{
	         outline: none;
	    }
	     select.fsfb-changelang option{
	         background: #222;
	    }
	     #fsfb-wearsloaded{
	         display: none;
	         width: 0;
	         height: 0;
	    }
	     #fsfb-skinsearch{
	         border: 1px solid #2e6da4;
	         background-color: #222328;
	         font-size: 17px;
	         border-radius: 4px;
	         width: 100%;
	         padding: 4px 4px 4px 8px;
	         margin: 4px 0;
	         color: white;
	    }
	     #stats-table td{
	         font-size: 17px;
	    }
	     #stats-table label{
	         padding-right: 10px;
	         margin: 0 6px 0 2px;
	    }
	     #stats-table input{
	         transform: scale(1.8);
	         margin: 5px 8px 5px 5px;
	    }
	     #friendRejectAll{
	         color: #ff4000 !important;
	    }
	     div.fsfb-slider{
	         display: flex;
	         align-items: center;
	    }
	     input[type="range"].fsfb-slider{
	         width: 58px;
	         display: inline;
	         position: absolute;
	         right: 5px;
	    }
	     #fsfb-minion_nuker img{
	         margin-top: 2px;
	    }
	     .fsfb-shown{
	         display: block !important;
	    }
	     .fsfb-hidden{
	         display: none !important;
	    }
	     #fsfb-quickbuy{
	         background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 601 601"><path d="M1 301c0-31 23-54 49-54l198 1V50c0-26 23-49 53-49s53 23 53 49v198l197-1c26 0 49 23 49 54 0 30-23 53-49 53l-197-1v198c0 26-23 50-53 50s-53-24-53-50V354H50c-26 0-50-23-50-53"></path></svg>');
	         background-size: 80% 80%;
	    }
	     .fsfb-bug-modal>div>div{
	         -webkit-box-shadow: 0 5px 15px rgb(0 0 0 / 50%);
	         background: linear-gradient(to bottom,#3b414e 0,#302f33 100%);
	         border: 3px solid #232630;
	    }
	     .close.fsfb-btn{
	         position: absolute;
	         right: 10px;
	         top: 3px;
	         font-size: 60px;
	    }
	     .fsfb-modal-body>div{
	         color: ffffffb0;
	         margin: 10px 20px;
	    }
	     .fsfb-modal-body>table{
	         width: 90%;
	         margin: 10px 20px;
	    }
	     .fsfb-cmd-title{
	         color: white;
	         white-space: nowrap;
	         padding-right: 12px !important;
	    }
	     .fsfb-modal-body>table th{
	         color: white;
	    }
	     .fsfb-modal-body>table td{
	         padding: 4px 0;
	    }
	     .fsfb-modal-body>div>span{
	         color: white;
	    }
	     .fsfb-modal-body{
	         margin: 10px 10px;
	         font-size: 20px;
	         max-height: 600px;
	         overflow-y: auto;
	    }
	     .fsfb-modal-title{
	         text-align: center;
	         color: white;
	    }
	     .fsfb-hotkey{
	         background-color: #df901c;
	         color: #fff;
	         cursor: pointer;
	         text-align: center;
	         min-width: 40px;
	         max-width: 60px;
	         height: 18px;
	         line-height: 18px;
	         vertical-align: middle;
	         border-radius: 9px;
	         right: 5px;
	         position: absolute;
	         display: inline-block;
	         padding: 0 5px;
	         overflow: hidden;
	         opacity: 1;
	    }
	     .fsfb-modal-body::-webkit-scrollbar-thumb {
	         background-color: #57595b;
	         border: 1px solid black;
	         border-radius: 12px;
	    }
	     .fsfb-modal-body::-webkit-scrollbar {
	         border: 1px solid black;
	         background-color: #2523239e;
	         width: 15px;
	         border-radius: 12px;
	    }
	     .fsfb-modal-body::-webkit-scrollbar-track {
         -webkit-box-shadow: inset 0px 0px 2px 2px rgba(0, 0, 0, 0.75);
         box-shadow: inset 0px 0px 2px 2px rgba(0, 0, 0, 0.75);
         border-radius: 12px;
	    }
	     .fsfb-hotkey:hover {
	         background-color: #f1a02d;
	    }
	     .fsfb-hotkey.selected{
	         background-color: #ff4;
	         color: #444;
	    }
	     #fsfb-settings-main p{
	         margin: 0;
	         display: inline-block;
	         margin-left: 4px;
	    }
	     #fsfb-settings-main{
	         display: -ms-grid;
	         display: grid;
	         -ms-grid-columns: 50% 50%;
	         grid-template-columns: 50% 50%;
	    }
	     #settingPage4::-webkit-scrollbar-thumb {
	         background-color: #ff9800c2;
	         border-radius: 12px;
	         border: 1px #000000c2 solid;
	    }
	     #settingPage4::-webkit-scrollbar {
	         border: 1px solid #00000085;
	         background-color: #2523239e;
	         width: 9px;
	         border-radius: 12px;
	    }
	     #settingPage4{
	         display: none;
	         max-height: 660px;
	         overflow-x: hidden;
	    }
	     .padbot10{
	         padding-bottom: 10px;
	    }
	     #fsfb-slowfeedtime, #fsfb-dubsecdelay, #fsfb-dubfirstdelay, #fsfb-secdelay, #fsfb-fvsdelay, #fsfb-firstdelay, #fsfb-threesecdelay, #fsfb-threefirstdelay{
	         border: none;
	         width: 40px;
	    }
	     select.fsfb-quickchange{
	         background: none;
	         border: none;
	         height: 20px;
	    }
	     select.fsfb-quickchange:focus-visible{
	         outline: none;
	    }
	     select.fsfb-quickchange option{
	         background: #222;
	    }
	     .fsfb-sect-ch label{
	         display: flex;
	         align-items: center;
	    }
	     .fsfb-sect-ch label input{
	         margin: 0 2px 0 0;
	    }
	     .fsfb-colors div{
	         height: 18px;
	         aspect-ratio: 1;
	    }
	     .fsfb-colors input[type="color"]{
	         width: 100%;
	         height: 100%;
	         opacity: 0;
	         border: none;
	         background-color: white;
	         margin: 0;
	         cursor: pointer;
	    }
	     .fsfb-colors p{
	         min-width: 120px;
	         margin-left: 5px;
	    }
	     .fsfb-colors div{
	         border-radius: 4px;
	         border: 1px solid #ffffff29;
	    }
	     #fsfb-ximport-cont{
	         display: flex;
	         justify-content: space-around;
	         margin-top: 7px;
	    }
	     .fsfb-eximport{
	         background-color: #df901c;
	         color: white;
	         padding: 5px 17px;
	         border-radius: 25px;
	         cursor: pointer;
	    }
	     .hideMegaphone{
	         display: none !important;
	    }
	     .fsfb-fake{
	         padding: 0 0 0 43px;
	         color: #cbff4e !important;
	    }
	     #fsfb-extra-info{
	         margin: 10% 0 0 90%;
	         cursor: pointer;
	    }
	     #linesplit-markers div {
	         background-color: transparent;
	         height: 15px;
	         aspect-ratio: 1;
	         position: fixed;
	         z-index: 999;
	         border: 2px solid rgb(255 255 255 / 80%);
	         border-radius: 50%;
	         display: none;
	    }
	     #linesplit-top {
	         top: -7.5px;
	         transform: translateX(-50%);
	         left: 50%;
	    }
	     #stats-container{
 	        background: rgba(0,0,0,.5);
 	        top: 200px;
 	        position: absolute;
 	        border: 1px white solid;
 	        border-radius: 12px;
 	        color:white;
 	        left:30px;
 	   }
 	    #stats-main{
 	        padding: 10px;
 	   }
 	    #stats-extra-info{
 	        color: #00bbff;
 	        font-size: 15px;
 	        margin-bottom: 2px;
 	        display: block;
 	   }
 	    #stats-info div{
 	        display:flex;
 	   }
 	    #stats-info div p{
 	        margin: 0;
 	   }
 	    .stats-completed{
 	        margin: 9px 5px 0;
 	        font-size: 12px;
 	        bottom: 0;
 	        color: rgb(255, 255, 255, .8);
 	   }
 	    #stats-title{
	         display: flex;
	         align-items: center;
	         justify-content: space-between;
	    }
	     #stats-title>div{
	         font-size: 15px;
	         margin-left: 8px;
	         cursor: pointer;
	    }
	     #stats-title>div>div{
	         padding: 0 5px;
	    }
	     #linesplit-right {
	         right: -7.5px;
	         transform: translateY(-50%);
	         top: 50%;
	    }
	     #linesplit-bottom {
	         bottom: -7.5px;
	         transform: translateX(-50%);
	         left: 50%;
	    }
	     #linesplit-left {
	         left: -7.5px;
	         transform: translateY(-50%);
	         top: 50%;
	    }
	     .fsfb-removeAds{
	         transform: translateX(9999%) !important;
	    }`;
        document.querySelector('body').append(styles);
    }();

    if(userPreferences.level1kFix){
        $('.innerBoxDashboard2>div>div').css('max-width', '210px');
        $('#levelTopLeft').css({'min-width': '30%', 'max-width': '90px', width: 'unset'});
        $('#fpsBox').css('left', '220px');
    }
    if(!userPreferences.tripleFastSplitSetting){
        $('#fsfb-fsThree, #fsfb-threefirstdelay, #fsfb-threesecdelay').prevUntil('input').hide();
    }

    const scripts = document.createElement('script');
    scripts.innerHTML = `const onlyNumberKey = (e, key) => (key = e.which || e.keyCode, 48 <= key && key <= 57);`;

    let script_id = 446564; // main script
    let version_timestamp = 1707000000000;
    // @changelog    fsfb 40k install update! Custom name setting, hide mod messages setting in TM menu, bugfixes, and more
    if (+getStorage("lastUpdateCheck", "0") + 864e5 <= Date.now() && typeof GM_xmlhttpRequest == 'function' && userPreferences.notifyNewUpdates) {
        try {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://greasyfork.org/en/scripts/${script_id}/code?${Date.now()}`,
                headers: {
                    'Cache-Control': 'no-cache'
                },
                onload: function(xhrResponse) {
                    setStorage("lastUpdateCheck", String(Date.now()));
                    const rt = xhrResponse.responseText.replace(/&nbsp;?/gm, " ").replace(/&#x000A;/g, "\n").replace(/<li>/gm, "\n").replace(/<[^>]*>/gm, "");
                    if (+(rt?.match(/version_timestamp\s*=\s*([0-9]+)/)?.[1] ?? 0) > version_timestamp) {
                        let changelog = rt.match(/(?<=@changelog\s+)(?:\S).+$/gm)?.[0] ?? 'unable to find',
                            version = rt.match(/(?<=@version\s+)(?:\S).+$/gm)?.[0] ?? 'unable to find';
                        swal({
                            title: `<span style="color: #8CEFFF;">fsfb update!</span>`,
                            text: `<span style="color: #BBF6FF;">It appears there's a new update available for fsfb script (version: ${version})</br>Changelog: ${changelog}</span>`,
                            type: "info",
                            confirmButtonColor: "#2cb7f7",
                            confirmButtonText: 'Install fsfb Update',
                            html: true,
                            focusCancel: true,
                            // cancelButtonColor: "#29b962",
                            // cancelButtonText: 'Install Auto-Updating fsfb',
                            // showCancelButton: true,
                            customClass: 'fsfb-update-swal'
                        }, function(val) {
                            if(val){ // install new update
                                unsafeWindow.open(`https://greasyfork.org/scripts/${script_id}/`);
                            }
                        });
                    }
                }
            });
        } catch (err) {
            console.error("FSFB: An error occurred while checking for updates:\n" + err);
        }
    }

    document.querySelector('body').append(scripts);
    unsafeWindow.fsfbScriptsLoaded = true;
    // $('#gameSettingsTab a')[0].click(); // att
    // $('#settingTab4')[0].click();
};


if(unsafeWindow.fsfbScriptsLoaded || unsafeWindow.fsfbEvListenerAdded) alert('It appears fsfb scripts is already loaded. It\'s recommended to only use one instance of fsfb at a time.');
(document.readyState === "complete" ? setTimeout(afterLoaded, 1) : (document.addEventListener("DOMContentLoaded", afterLoaded), unsafeWindow.fsfbEvListenerAdded = true));