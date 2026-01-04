// ==UserScript==
// @name         生财有术手册阅读专用
// @namespace    https://search01.shengcaiyoushu.com/docx/*
// @version      1.0
// @description  记住上一次阅读位置，优化阅读体验
// @author       Jexxx
// @match        https://search01.shengcaiyoushu.com/docx/*
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzYwcHgiIGhlaWdodD0iMzYwcHgiIHZpZXdCb3g9IjAgMCAzNjAgMzYwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA2MC4xICg4ODEzMykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+57yW57uEPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+CiAgICAgICAgPHBvbHlnb24gaWQ9InBhdGgtMSIgcG9pbnRzPSIxLjEzMzQwMjI0ZS0wNSAwIDM1OS45OTk4NjMgMCAzNTkuOTk5ODYzIDM2MCAxLjEzMzQwMjI0ZS0wNSAzNjAiPjwvcG9seWdvbj4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSIxLjEt5by556qXIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i57yW57uEIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8bWFzayBpZD0ibWFzay0yIiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgIDwvbWFzaz4KICAgICAgICAgICAgICAgIDxnIGlkPSJDbGlwLTIiPjwvZz4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xOTAuMTU5NCwzMzUuMDA1MiBDOTYuNTE4NCwzNDAuOTk2MiAxOS4wMDA0LDI2My40NzgyIDI0Ljk5MzQsMTY5LjgzODIgQzI5Ljk0NjQsOTIuNDQ2MiA5Mi40NjE0LDI5LjkzNjIgMTY5Ljg1MjQsMjQuOTkxMiBDMjYzLjQ4MjQsMTkuMDA5MiAzNDAuOTg3NCw5Ni41MTMyIDMzNS4wMDg0LDE5MC4xNDQyIEMzMzAuMDYzNCwyNjcuNTM3MiAyNjcuNTUzNCwzMzAuMDUzMiAxOTAuMTU5NCwzMzUuMDA1MiBNMTg4LjQ0ODQsMC4xOTQyIEM4Mi41NDE0LC00LjY3MzggLTQuNjczNiw4Mi41NDIyIDAuMTk0NCwxODguNDQ3MiBDNC40Mzg0LDI4MC43ODMyIDc5LjIxNjQsMzU1LjU2MTIgMTcxLjU1MjQsMzU5LjgwNjIgQzI3Ny40NTc0LDM2NC42NzQyIDM2NC42NzQ0LDI3Ny40NTkyIDM1OS44MDU0LDE3MS41NTIyIEMzNTUuNTU4NCw3OS4yMTYyIDI4MC43ODM0LDQuNDQxMiAxODguNDQ4NCwwLjE5NDIiIGlkPSJGaWxsLTEiIGZpbGw9IiMwQTVENEYiIG1hc2s9InVybCgjbWFzay0yKSI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNjYuMzQ5OCwyMDguOTY4MSBMMTY2LjM0OTgsMjIxLjc4OTEgTDE0OC43MjM4LDIyMS43ODkxIEMxNDguMDYxOCwyMjEuNzg5MSAxNDcuODA3OCwyMjAuOTI0MSAxNDguMzYzOCwyMjAuNTY0MSBMMTY2LjM0OTgsMjA4Ljk2ODEgWiBNMTkzLjY0ODgsMTYxLjQ5MTEgTDE5My42NDg4LDE0OS4wMTAxIEwyMTAuNTk4OCwxNDkuMDEwMSBDMjExLjMzNjgsMTQ5LjAxMDEgMjExLjYyMDgsMTQ5Ljk3NTEgMjEwLjk5NzgsMTUwLjM3MzEgTDE5My42NDg4LDE2MS40OTExIFogTTI0Ny40NjY4LDIyMS43ODkxIEwxOTMuODc3OCwyMjEuNzg5MSBMMTkzLjY1MDgsMjE5LjU5MjEgTDE5My42NDg4LDE5MS40NzkxIEwyNDguMTM1OCwxNTYuNzY4MSBDMjUzLjQ2MzgsMTUzLjM3MzEgMjU2Ljc0NTgsMTQ1LjM5ODEgMjU0LjIwMzgsMTM2Ljg1NTEgQzI1MS43ODI4LDEyOS4yNzIxIDI0NC43MzM4LDEyNC4xMjQxIDIzNi43NzI4LDEyNC4xMjQxIEwxOTMuNjQ4OCwxMjQuMTI0MSBMMTkzLjY0ODgsODcuOTcyMSBDMTkzLjY0ODgsODQuMTYzMSAxOTAuNTYwOCw4MS4wNzYxIDE4Ni43NTE4LDgxLjA3NjEgTDE3My4yNDI4LDgxLjA3NjEgQzE2OS40MzU4LDgxLjA3NjEgMTY2LjM0OTgsODQuMTYyMSAxNjYuMzQ5OCw4Ny45NjkxIEwxNjYuMzQ5OCwxMjQuMTI0MSBMMTEyLjc0NjgsMTI0LjEyNDEgQzEwNy45Nzk4LDEyNC4xMjQxIDEwNC4xMTI4LDEyNy45ODkxIDEwNC4xMTI4LDEzMi43NTkxIEwxMDQuMTEyOCwxNDAuMjA5MSBDMTA0LjExMjgsMTQ1LjA3MTEgMTA4LjA1MzgsMTQ5LjAxMDEgMTEyLjkxMjgsMTQ5LjAxMDEgTDE2Ni4zNDk4LDE0OS4wMTAxIEwxNjYuMzQ5OCwxNzkuMDEzMSBMMTEyLjczMjgsMjEzLjQxODEgQzEwNi44Njg4LDIxNy4xODgxIDEwMy4yMjM4LDIyNS44MTIxIDEwNS40OTQ4LDIzMy41NzIxIEMxMDcuODUwOCwyNDEuMjM5MSAxMTQuOTMzOCwyNDYuNDc0MSAxMjIuOTU2OCwyNDYuNDc0MSBMMTY2LjM0OTgsMjQ2LjQ3NDEgTDE2Ni4zNDk4LDI3NS41NDQxIEMxNjYuMzQ5OCwyNzkuMzU0MSAxNjkuNDM3OCwyODIuNDQwMSAxNzMuMjQ1OCwyODIuNDQwMSBMMTg2Ljc2MDgsMjgyLjQ0MDEgQzE5MC41NjQ4LDI4Mi40NDAxIDE5My42NDg4LDI3OS4zNTgxIDE5My42NDg4LDI3NS41NTMxIEwxOTMuNjQ4OCwyNDYuNDc0MSBMMjQ3LjU2MDgsMjQ2LjQ3NDEgQzI1Mi4xNTY4LDI0Ni40NzQxIDI1NS44ODM4LDI0Mi43NDYxIDI1NS44ODM4LDIzOC4xNTAxIEwyNTUuODgzOCwyMzAuMjA0MSBDMjU1Ljg4MzgsMjI1LjU1NzEgMjUyLjExNjgsMjIxLjc4OTEgMjQ3LjQ2NjgsMjIxLjc4OTEgTDI0Ny40NjY4LDIyMS43ODkxIFoiIGlkPSJGaWxsLTMiIGZpbGw9IiMwQTVENEYiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggZD0iTTIyOC45Mjg5LDEwNi42NjQ0IEwyNDEuMTM0OSwxMDYuNjY0NCBDMjQ1LjI0NTksMTA2LjY2NDQgMjQ4LjU3ODksMTAzLjMzMTQgMjQ4LjU3ODksOTkuMjIxNCBMMjQ4LjU3ODksODguNTIzNCBDMjQ4LjU3ODksODQuNDExNCAyNDUuMjQzOSw4MS4wNzY0IDI0MS4xMzE5LDgxLjA3NjQgTDIyOC45Mjg5LDgxLjA3NjQgQzIyNC44MTg5LDgxLjA3NjQgMjIxLjQ4NTksODQuNDA5NCAyMjEuNDg1OSw4OC41MTk0IEwyMjEuNDg1OSw5OS4yMjE0IEMyMjEuNDg1OSwxMDMuMzMxNCAyMjQuODE4OSwxMDYuNjY0NCAyMjguOTI4OSwxMDYuNjY0NCIgaWQ9IkZpbGwtNSIgZmlsbD0iIzBBNUQ0RiI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+
// @grant        none
// @license GPLv3
// @run-at document-end

// @downloadURL https://update.greasyfork.org/scripts/461180/%E7%94%9F%E8%B4%A2%E6%9C%89%E6%9C%AF%E6%89%8B%E5%86%8C%E9%98%85%E8%AF%BB%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/461180/%E7%94%9F%E8%B4%A2%E6%9C%89%E6%9C%AF%E6%89%8B%E5%86%8C%E9%98%85%E8%AF%BB%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==


let timeoutId;
const scrollPos = localStorage.getItem('scrollPos');

let isElementRendered = false;
let isElementCompleteRendered = false;
function checkElement() {
  if (isElementRendered) return;
  const element = document.querySelector('.docx-page');

  if (element && element.offsetHeight > 0) {
    isElementRendered = true;
    if (scrollPos !== null) {
      const maxScrollTop = element.scrollHeight - element.clientHeight;
      if (maxScrollTop < scrollPos) {
        const wrap = document.querySelector('.docx-page .wrap');
        wrap.style.padding = '300000px';
        element.scrollTo(0, scrollPos)
      } else {
        element.scrollTo(0, scrollPos)
      }
      element.addEventListener('scroll', function () {
        clearTimeout(timeoutId);
        const element = document.querySelector('.docx-page');
        const scrollTop = element.scrollTop;
        timeoutId = setTimeout(function () {
          localStorage.setItem('scrollPos', scrollTop);
        }, 66);
      });
    }
  }

  requestAnimationFrame(checkElement);
}

window.addEventListener('load', function () {
  requestAnimationFrame(checkElement);
});

window.addEventListener('beforeunload', function () {
  const element = document.querySelector('.docx-page');
  const scrollTop = element.scrollTop;
  localStorage.setItem('scrollPos', scrollTop);
});