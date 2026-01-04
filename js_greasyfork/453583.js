// ==UserScript==
// @name             Automatic refresh
// @name:zh          自动刷新
// @name:en          Automatic refresh
// @namespace        https://github.com/issenn
// @version          0.1.2
// @author           issenn
// @description      Automatic refresh.
// @description:zh   自动刷新。
// @description:en   Automatic refresh.
// @defaulticon      data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzBweCIgaGVpZ2h0PSI3MHB4IiB2aWV3Qm94PSItMS4yNiAwIDcwIDcwIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxtZXRhZGF0YT4KICAgICAgICA8cmRmOlJERj4KICAgICAgICAgICAgPGNjOldvcms+CiAgICAgICAgICAgICAgICA8ZGM6c3ViamVjdD4KICAgICAgICAgICAgICAgICAgICBDb2RlCiAgICAgICAgICAgICAgICA8L2RjOnN1YmplY3Q+CiAgICAgICAgICAgICAgICA8ZGM6aWRlbnRpZmllcj4KICAgICAgICAgICAgICAgICAgICBzY3JpcHQtZmlsZQogICAgICAgICAgICAgICAgPC9kYzppZGVudGlmaWVyPgogICAgICAgICAgICAgICAgPGRjOnRpdGxlPgogICAgICAgICAgICAgICAgICAgIFNjcmlwdCBGaWxlCiAgICAgICAgICAgICAgICA8L2RjOnRpdGxlPgogICAgICAgICAgICAgICAgPGRjOmZvcm1hdD4KICAgICAgICAgICAgICAgICAgICBpbWFnZS9zdmcreG1sCiAgICAgICAgICAgICAgICA8L2RjOmZvcm1hdD4KICAgICAgICAgICAgICAgIDxkYzpwdWJsaXNoZXI+CiAgICAgICAgICAgICAgICAgICAgQW1pZG8gTGltaXRlZAogICAgICAgICAgICAgICAgPC9kYzpwdWJsaXNoZXI+CiAgICAgICAgICAgICAgICA8ZGM6Y3JlYXRvcj4KICAgICAgICAgICAgICAgICAgICBSaWNoYXJkIFNsYXRlcgogICAgICAgICAgICAgICAgPC9kYzpjcmVhdG9yPgogICAgICAgICAgICAgICAgPGRjOnR5cGUgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIvPgogICAgICAgICAgICA8L2NjOldvcms+CiAgICAgICAgPC9yZGY6UkRGPgogICAgPC9tZXRhZGF0YT4KICAgIDxwYXRoIGQ9Im0gLTEwNy4xNzU4OCw1MzIuNTk1NjEgYyAtMy4xNzI2LC0wLjgzMTI0IC01LjcyODQsLTMuMzM4MDkgLTYuNjQ1MywtNi41MTc5OCBsIC0wLjMxNjYsLTEuMDk4MiAwLC0yNy4wNDMwNSBjIDAsLTIyLjIwMjA5IDAuMDMzLC0yNy4xNzgyMSAwLjE4NDgsLTI3Ljc5ODA2IDAuMTAxNywtMC40MTUyNiAwLjQ2NDQsLTEuMzQxODYgMC44MDYyLC0yLjA1OTEyIDAuNTMxMiwtMS4xMTQ4MyAwLjc5MzIsLTEuNDczNzIgMS44MDU2LC0yLjQ3MjcyIDEuMzU0NywtMS4zMzY2NyAyLjU2LC0yLjAyNDQgNC4zMjkzLC0yLjQ3MDE1IDEuMDYzMSwtMC4yNjc4MiAxLjU1OTQsLTAuMjczNDYgMjMuNjc5Nzk5LC0wLjI2ODcyIGwgMjIuNTk0LDAuMDA1IDcuMDQyOCw2Ljk2MTg0IDcuMDQyOCw2Ljk2MTg0IC0wLjA0MiwyNC4yMjg5MyAtMC4wNDIsMjQuMjI4OTIgLTAuMzI0NSwwLjk2MDkyIGMgLTEuMTE4MiwzLjMxMTE1IC0zLjQ4NzksNS41Njc3NiAtNi43MTMxLDYuMzkyNjMgLTEuMDA3MSwwLjI1NzU2IC0xLjc3NDksMC4yNjQ5NiAtMjYuNzE5NSwwLjI1NzYzIC0yNC44MTgyOTksLTAuMDA3IC0yNS43MTYzOTksLTAuMDE2NCAtMjYuNjgyNjk5LC0wLjI2OTU1IHogbSA1Mi43MjczOTksLTUuODExOTMgYyAwLjkxMjgsLTAuNDQ4MjMgMS42MzYyLC0xLjMxNTU3IDEuODcwMiwtMi4yNDI1NCAwLjA5OSwtMC4zOTMwMiAwLjE0NTMsLTcuNTIyIDAuMTQ1MywtMjIuNDc3MTQgbCAwLC0yMS45MDE1OCAtNS41OTM5LC0wLjAzNTggLTUuNTkzOSwtMC4wMzU5IC0wLjAzNiwtNS43MzEyMSAtMC4wMzYsLTUuNzMxMiAtMjAuOTY3MiwxMGUtNCAtMjAuOTY3MDk5LDAuMDAxIC0wLjY4NjQsMC4zMjAzMSBjIC0wLjM3NzUsMC4xNzYxNiAtMC45MTQ1LDAuNTczNDEgLTEuMTkzNCwwLjg4Mjc2IC0xLjAwMjcsMS4xMTIzNSAtMC45MzQzLC0wLjkzOTc5IC0wLjkzNDMsMjguMDM2NzkgMCwyOC4xMjYyNSAtMC4wMzYsMjYuNzAzOTEgMC43MTA2LDI3LjgwODI4IDAuNDE4NCwwLjYxODcyIDEuMjA0MSwxLjE1NjcyIDIuMDA2MywxLjM3MzggMC41MTQxLDAuMTM5MSA1Ljc0Mzg5OSwwLjE2OTU2IDI1LjU2MTU5OSwwLjE0ODg5IGwgMjQuOTE1MywtMC4wMjYgMC43OTg2LC0wLjM5MjEzIHogbSAtMzMuNzI3NiwtMTEuMTgwMjUgYyAtMC4wNCwtMC4wNjQ3IDIuMDU1NiwtNy4zOTc1OCA0LjY1NjksLTE2LjI5NTM0IDIuNjAxMiwtOC44OTc3NSA0LjcyOTUsLTE2LjE5NzU4IDQuNzI5NSwtMTYuMjIxODUgMCwtMC4wMjQzIDAuODk1OCwtMC4wNDQxIDEuOTkwNSwtMC4wNDQxIDEuMDk0OCwwIDEuOTg5MiwwLjAxNTQgMS45ODc1LDAuMDM0MyAwLDAuMDE4OSAtMi4xNTIyLDcuMzU0NDcgLTQuNzc5MSwxNi4zMDEzMyBsIC00Ljc3NjMsMTYuMjY3MDEgLTEuODY4MSwwLjAzODEgYyAtMS4wMjc1LDAuMDIxIC0xLjkwMDksLTAuMDE0OCAtMS45NDA5LC0wLjA3OTUgeiBtIC05LjEzODksLTkuODUxNDkgYyAtMy40MzE2OTksLTIuMjI5MDQgLTYuMzE5NTk5LC00LjExOTM4IC02LjQxNzU5OSwtNC4yMDA3NCAtMC4xMjY3LC0wLjEwNTE1IC0wLjE3ODMsLTAuNTkxNjQgLTAuMTc4MywtMS42ODE5NyBsIDAsLTEuNTM0MDIgNi4zMjg0OTksLTQuMzE3NjUgYyAzLjQ4MDcsLTIuMzc0NyA2LjM4NDEsLTQuMzM4MjQgNi40NTE5LC00LjM2MzQgMC4wNywtMC4wMjU5IDAuMTIzNCwwLjk2MDAyIDAuMTIzNCwyLjI3NjA2IGwgMCwyLjMyMTgyIC00LjU5MjEsMi43OTgyNiBjIC0yLjUyNTYsMS41MzkwNCAtNC41Nzk1OTksMi44MTAwNCAtNC41NjQyOTksMi44MjQ0NCAwLjAxNSwwLjAxNDQgMi4wMzUyOTksMS4xNzg3IDQuNDg5MDk5LDIuNTg3MzIgMi40NTM4LDEuNDA4NjMgNC41MDkzLDIuNjA4MjMgNC41Njc4LDIuNjY1NzkgMC4wNTgsMC4wNTc2IDAuMDg5LDEuMTMzNDEgMC4wNjksMi4zOTA3NyBsIC0wLjAzOCwyLjI4NjEyIC02LjIzOTMsLTQuMDUyOCB6IG0gMjUuNjk0NywxLjQzMTE0IDAuMDM3LC0yLjM1Mjg4IDQuNTA4OCwtMi41NzYzNiA0LjUwODksLTIuNTc2MzcgLTAuNzMzOCwtMC40NjQ3MSBjIC0wLjQwMzYsLTAuMjU1NTkgLTIuNDQ4LC0xLjUwNzEzIC00LjU0MzEsLTIuNzgxMjEgbCAtMy44MDk0LC0yLjMxNjQ5IDAsLTIuMzEwNTMgYyAwLC0xLjI3MDc5IDAuMDMyLC0yLjMxMDUzIDAuMDcsLTIuMzEwNTMgMC4wMzgsMCAyLjkxMSwxLjkyNjEyIDYuMzgzMiw0LjI4MDI3IGwgNi4zMTMyLDQuMjgwMjYgMCwxLjU5NTA1IDAsMS41OTUwNiAtNS45OTc5LDMuOTA1NDggYyAtMy4yOTg5LDIuMTQ4MDEgLTYuMTcyOCw0LjAxMzU3IC02LjM4NjUsNC4xNDU2NyBsIC0wLjM4ODYsMC4yNDAxOCAwLjAzOCwtMi4zNTI4OSB6IiBmaWxsPSIjMDBiY2YyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMTQuMTM4IC00NjIuODY3KSIvPgo8L3N2Zz4K
// @homepage         https://www.issenn.ml/
// @homepageURL      https://github.com/issenn/userscript-novel-ai
// @website          https://greasyfork.org/scripts/453583
// @source           https://github.com/issenn/userscript-novel-ai.git
// @supportURL       https://github.com/issenn/userscript-novel-ai/issues
// @match            http://*.saraba1st.com/2b/*
// @match            https://*.saraba1st.com/2b/*
// @match            https://bbs4.2djgame.net/home/*
// @contributionURL  https://afdian.net/@issenn
// @downloadURL https://update.greasyfork.org/scripts/453583/Automatic%20refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/453583/Automatic%20refresh.meta.js
// ==/UserScript==

(function() {
  "use strict";
  function config(callback) {
    sessionStorage.issennRefreshTime = 300;
    let time;
    if (!sessionStorage.issennRefreshTime) {
      const input = prompt("Please set the interval (seconds) for automatic refresh:", "300");
      time = parseInt(input ? input : "300", 10);
      sessionStorage.issennRefreshTime = time;
    } else {
      time = parseInt(sessionStorage.issennRefreshTime);
    }
    callback(time);
  }
  function ready(seconds) {
    let title = document.title;
    setInterval(() => {
      document.title = "[" + formatTime(seconds, false) + "] " + title;
      if (seconds-- === 0) {
        location.reload();
      }
    }, 1e3);
  }
  const padTime = (n) => n.toString().padStart(2, "0");
  function formatTime(seconds, milliseconds) {
    if (milliseconds) {
      seconds = ~~(seconds / 1e3);
    }
    return padTime(~~(seconds / 3600)) + ":" + padTime(~~(seconds % 3600 / 60)) + ":" + padTime(~~(seconds % 60));
  }
  config(ready);
})();
