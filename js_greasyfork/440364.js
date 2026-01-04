// ==UserScript==
// @name         YouTube float video
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Float YouTube videos on scroll
// @author       Gi11i4m
// @match        http://www.youtube.com/*
// @match        https://www.youtube.com/*
// @match        http://youtube.com/*
// @match        https://youtube.com/*
// @icon         data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjUwMCIgaGVpZ2h0PSIxMDQwIiB2aWV3Qm94PSIwIDAgNTAwLjYxMiAyMDguMzUyIj48cGF0aCBkPSJNODMuNzQzIDE2OC44NzZjLTQuMDA3LTEuMzc1LTYuNzQ2LTMuMjQtMTAuMDktNi44NjMtNy4wMjQtNy42MTEtNy40MS05Ljg4My03LjQxLTQzLjY4MiAwLTMyLjU2Ny41LTM1LjYzNCA3LjA0NC00My4yODEgOS4xNzUtMTAuNzE4IDMwLjM5LTEwLjQwMSAzOS40NS41ODkgNi4wMTcgNy4zIDYuNTA2IDEwLjU1IDYuNTA2IDQzLjE5MiAwIDI1LjgzNC0uMjI0IDMwLjE0LTEuOCAzNC42Ni0yLjQxNiA2LjkyMi05LjUzNSAxMy42MTktMTYuNzU4IDE1Ljc2NC02LjgxMiAyLjAyMy0xMC4xNjcgMS45NDktMTYuOTQyLS4zOHptMTIuNDU1LTE1LjY2NmM0LjA5LTEuNTcgNC41NDUtNS4wMDYgNC41NDUtMzQuMjgyIDAtMTguNjgyLS4zNzYtMjguODI4LTEuMTMtMzAuNDgyLTIuNTMtNS41NTQtMTEuMjEtNS41NTQtMTMuNzQgMC0uNzU0IDEuNjU0LTEuMTMgMTEuOC0xLjEzIDMwLjQ4MiAwIDMyLjY2NS40MTcgMzQuNTYgNy42NjggMzQuODI1IDEuMTkzLjA0MyAyLjg5Ny0uMjAyIDMuNzg3LS41NDN6bTQ0LjQyNyAxNS4xMThjLTEuNDQtLjc4Mi0zLjQ2Ni0zLjEyOC00LjUtNS4yMS0xLjc0NS0zLjUxMi0xLjkwMy03LjEwNC0yLjE3OS00OS41MzdsLS4yOTctNDUuNzVoMTkuMDk0djQxLjg3N2MwIDM1Ljg0My4yMTQgNDIuMDU3IDEuNDg3IDQzLjExMiAyLjIxNiAxLjgzOSA1LjgxNi40OTMgOS44ODctMy42OTdsMy42MjYtMy43MzNWNjcuODMyaDE5djEwMWgtMTl2LTEwLjE3bC00Ljc1IDQuMjE3Yy0yLjYxMiAyLjMxOS02LjE5OCA0LjgzMi03Ljk2OCA1LjU4NS00LjEyNiAxLjc1My0xMS4wNDMgMS42ODctMTQuNC0uMTM2ek0yNC43MyAxNDEuMDhsLS4wMTUtMjcuNzUtMTIuMzU3LTM5LjVMLjAwMSAzNC4zM2wxMC4wNC0uMjg3YzUuODc3LS4xNjggMTAuMjkzLjEyNCAxMC42NTEuNzA0LjMzNy41NDUgMy41MjQgMTIuMDM1IDcuMDgyIDI1LjUzMyAzLjU2IDEzLjQ5OCA2LjY5OCAyNC41NDQgNi45NzcgMjQuNTQ2LjI4LjAwMiAyLjkwMi05LjEwOCA1LjgyOC0yMC4yNDYgMi45MjctMTEuMTM3IDUuOTkyLTIyLjYxMiA2LjgxMy0yNS41bDEuNDkzLTUuMjVoMTAuNTM2YzguNTg0IDAgMTAuNDM4LjI1OCAxMC4wMDMgMS4zOS0uMjkzLjc2NC01Ljk2NyAxOC43NDUtMTIuNjA3IDM5Ljk1N2wtMTIuMDczIDM4LjU2N3Y1NS4wODZoLTIwbC0uMDE0LTI3Ljc1eiIgZmlsbD0iIzAxMDEwMSIvPjxwYXRoIGQ9Ik0yODQuODczIDIwNy43ODNjLTQ4Ljg1NS0xLjYzMS02Mi4wODQtNS4xMDgtNzEuMDc4LTE4LjY4OC0zLjYzNC01LjQ4Ni03LjcxMy0xNy43NjQtOS4wMTItMjcuMTI4LTQuNTYtMzIuODY2LTMuNDQtMTAxLjQgMi4wNDEtMTI1LjAyMSA0Ljk2NC0yMS4zOTEgMTYuNjM3LTMxLjg3IDM3LjkzMS0zNC4wNTNDMjY1LjY3My43NDggMzIwLjIwMy0uNDIgMzczLjI0My4xNGM1Ny4yNjIuNjA0IDg0LjIyMSAxLjgyOSA5My45NzUgNC4yNyAxOS4wOCA0Ljc3MyAyOC4zMzYgMTguODI4IDMxLjU2MyA0Ny45Mi42MSA1LjUgMS4zNiAyNC43MDIgMS42NjYgNDIuNjcgMS4yMzQgNzIuNTM1LTQuMjIzIDk1LjYxLTI1LjAyIDEwNS43OTktNy44NTMgMy44NDgtMTIuOTkgNC43MzItMzUuMTg1IDYuMDU3LTI0LjEwNiAxLjQzOC0xMjIuNDggMi4wMjUtMTU1LjM2OS45Mjd6bTI0LjAzNC0zOS41MzZjMS42ODYtLjg3MyA1LjAzOC0zLjQwNCA3LjQ1LTUuNjNsNC4zODYtNC4wNHYxMC4yNTRoMTl2LTEwMGgtMTlWMTQ1LjA5NWwtNC4zNjggNC4zNjdjLTQuNjg4IDQuNjg5LTYuNTg0IDUuMjc0LTkuMDYgMi43OTgtMS4zNzgtMS4zNzgtMS41NzItNi42MjYtMS41NzItNDIuNVY2OC44M2gtMTl2NDMuMzE5YzAgNDcuNzg3LjM5MyA1MS41NjggNS43NjggNTUuNTggMy40MDMgMi41MzkgMTEuOTY0IDIuODA5IDE2LjM5Ni41MTh6bTkxLjQ1LS4zMjNjMS43NDUtMS4wNjQgNC4xNjMtNC4wMyA1LjUtNi43NDYgMi4zNDYtNC43NjQgMi4zOTMtNS40MiAyLjcyMi0zNy44MjguMzYtMzUuNTMyLS4yMTItNDEuOTQ4LTQuMzg2LTQ5LjE1LTIuMzE5LTQuMDAyLTcuODQ5LTcuMzctMTIuMTA0LTcuMzctNC4wOTggMC05Ljk3IDIuNzU3LTE0LjQ0NyA2Ljc4MmwtNC44OTggNC40MDNWMzQuODNoLTE4djEzNGgxOHYtOS4yMzJsNC4xMDUgMy43MDljMi4yNTggMi4wMzkgNS41MjEgNC4zMjQgNy4yNSA1LjA3NiA0LjY0MyAyLjAyMiAxMi41NTcgMS43OTggMTYuMjU4LS40NnptLTIzLjg2NC0xNi4zMTJsLTMuNzUtMi4xNzR2LTYxLjMzbDQuNDM4LTIuMzU0YzMuNjAxLTEuOTEgNC45NjgtMi4xNjcgNy4yNS0xLjM2NiA0LjkzMSAxLjczMiA1LjQ2MiA1LjU1MiA1LjEyIDM2Ljc4bC0uMzA4IDI3LjgzOC0yLjgwNiAyLjQxMmMtMy40MzUgMi45NTQtNS4xMjMgMi45ODctOS45NDQuMTk0em04NC4yNSAxNi4xMzVjOS42NjQtNC4zODEgMTQuMDE2LTExLjc5IDE0Ljc3Ny0yNS4xNThsLjUtOC43NThoLTE5LjI3OHY1LjkzNmMwIDcuMjctMS4xMjcgMTAuNDQ2LTQuNDg3IDEyLjY0OC0zLjc4NyAyLjQ4LTguNDk0LjkwNC0xMC43Ni0zLjYwNS0xLjM2OS0yLjcyMS0xLjc1LTYuMDM3LTEuNzUtMTUuMjNsLS4wMDMtMTEuNzVoMzZ2LTE0LjY4M2MwLTE4LjQ4LTEuNDQ1LTI0LjM3LTcuNjc2LTMxLjMtNS41MDYtNi4xMjMtMTEuNDA1LTguNTYxLTIwLjMyNC04LjM5Ny03LjM5My4xMzUtMTIuMzMzIDEuOTc4LTE3LjUyMiA2LjUzNC04LjQ4IDcuNDQ3LTkuNzY2IDE0LjA4Mi05LjI1OSA0Ny44NDcuMzMgMjEuOTM5LjY5MyAyNy4yODQgMi4xMTcgMzEuMDU3IDIuNDMyIDYuNDQyIDYuODI1IDExLjM0NyAxMi44NTggMTQuMzU0IDYuOCAzLjM4NiAxNy45NSAzLjYxNCAyNC44MDcuNTA1em0tMjEtNjguNDVjMC0xMi40MzggMy4xOTEtMTYuNjgyIDExLjIyMS0xNC45MTggNC4wMzEuODg2IDUuNzggNS4zOTggNS43OCAxNC45MTl2Ny41MzJoLTE3di03LjUzMnptLTE3MiAxMi4wMzR2LTU3LjVoMjJ2LTE5aC02M3YxOWgyMXYxMTVoMjB2LTU3LjV6IiBmaWxsPSIjZDAyNzI2Ii8+Cgk8bWV0YWRhdGE+CgkJPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxuczpyZGZzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPgoJCQk8cmRmOkRlc2NyaXB0aW9uIGFib3V0PSJodHRwczovL2ljb25zY291dC5jb20vbGVnYWwjbGljZW5zZXMiIGRjOnRpdGxlPSJ5b3V0dWJlLTIiIGRjOmRlc2NyaXB0aW9uPSJ5b3V0dWJlLTIiIGRjOnB1Ymxpc2hlcj0iSWNvbnNjb3V0IiBkYzpkYXRlPSIyMDE3LTA2LTE3IiBkYzpmb3JtYXQ9ImltYWdlL3N2Zyt4bWwiIGRjOmxhbmd1YWdlPSJlbiI+CgkJCQk8ZGM6Y3JlYXRvcj4KCQkJCQk8cmRmOkJhZz4KCQkJCQkJPHJkZjpsaT5JY29uIE1hZmlhPC9yZGY6bGk+CgkJCQkJPC9yZGY6QmFnPgoJCQkJPC9kYzpjcmVhdG9yPgoJCQk8L3JkZjpEZXNjcmlwdGlvbj4KCQk8L3JkZjpSREY+CiAgICA8L21ldGFkYXRhPjwvc3ZnPgo=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440364/YouTube%20float%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/440364/YouTube%20float%20video.meta.js
// ==/UserScript==

const SCROLL_TRESHOLD = 10;
// const MAX_FLOATING_PLAYER_HEIGHT = window.innerHeight / 2;

function waitForIt(it) {
  return new Promise((resolve) => {
    const checkExistInterval = setInterval(() => {
      const itResult = it();
      if (itResult) {
        clearInterval(checkExistInterval);
        resolve(itResult);
      }
    }, 100);
  });
}

async function getPlayer() {
  return waitForIt(() => document.querySelector("ytd-player#ytd-player"));
}

function float(player) {
  const dimensions =
    // player.clientHeight > MAX_FLOATING_PLAYER_HEIGHT
    //   ? {
    //       height: MAX_FLOATING_PLAYER_HEIGHT,
    //       width:
    //         (player.clientWidth / player.clientHeight) *
    //         MAX_FLOATING_PLAYER_HEIGHT,
    //     } :
    { height: player.clientHeight, width: player.clientWidth };
  player.style.height = dimensions.height + "px";
  player.style.width = dimensions.width + "px";
  player.style.position = "fixed";
  player.style.zIndex = 301;
  player.style.marginTop =
    document.querySelector("ytd-masthead").clientHeight -
    player.getBoundingClientRect().top +
    "px";
}

function unfloat(player) {
  player.style.height = "100%";
  player.style.width = "100%";
  player.style.position = "relative";
  player.style.removeProperty("z-index");
  player.style.removeProperty("margin-top");
}

(async function () {
  "use strict";

  const player = await getPlayer();
  let isWindowScrolledDown = false;

  const evaluateFloat = () =>
    isWindowScrolledDown ? float(player) : unfloat(player);
  evaluateFloat();

  addEventListener("scroll", () => {
    const isWindowScrolledDownNow = window.scrollY > SCROLL_TRESHOLD;
    const didWindowScrolledDownChange =
      isWindowScrolledDown !== isWindowScrolledDownNow;
    isWindowScrolledDown = isWindowScrolledDownNow;

    if (!didWindowScrolledDownChange) {
      return;
    }

    evaluateFloat();
  });
})();
