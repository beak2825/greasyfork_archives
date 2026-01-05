// ==UserScript==
// @name        MDN 重定向到中文
// @description 重定向 MDN 文档到中文
// @namespace   http://huching.net
// @include     https://developer.mozilla.org/
// @match       *://developer.mozilla.org/*
// @match       https://developer.mozilla.org/*
// @version     1.007
// @grant       none
// @license     MIT License
// @supportURL  http://huching.net
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2Ni4xNDU4MzIgNjYuMTQ1ODM1IiBoZWlnaHQ9IjI1MCIgd2lkdGg9IjI1MCI+PGc+PHBhdGggZD0iTTMzLjE0OCA2Mi4zNjlsMTYuNTAzLTYuMzU5IDE2LjUwMyA2LjM1OXYtNTEuNzc5bC0xNi41MDMtNi41MXYtLjE1MS4xNTFsLS4xNTEtLjE1MXYuMTUxbC0xNi4zNTEgNi41MS0xNi42NTQtNi41MXYtLjMwMi4xNTEuMTUxbC0xNi41MDMgNi41MXY1MS43NzlsMTYuNTAzLTYuMzU5IDE2LjY1NCA2LjM1OXoiIGZpbGw9IiMyNTkzZDEiLz48cGF0aCBkPSJNNTYuNzY2IDM0LjIwOWMtLjYwNi0xLjY2NS0uNDU0LTQuNjkzLS43NTctNS4xNDgtMS45NjgtMi41NzQtOC45MzMtMy4xNzktMTIuMTEyLTYuNjYyLjYwNi0xLjY2NS0uNjA2LTMuMTc5LTEuNjY1LTQuMjM5LTEuNjY1LTEuMjExLTQuMDg4LS43NTctNi4wNTYtLjE1Mi0yLjEyLS40NTQtNC4wODgtMS4yMTEtNi4wNTYtMS44MTctNC41NDItLjQ1NC05LjA4NCAyLjcyNS05LjA4NCAyLjcyNS0zLjMzMSAyLjEyLTguMzI3IDYuMzU5LTEwLjkwMSA4LjkzMy42MDYgMCAxLjIxMS0uNDU0IDEuOTY4LS40NTRsNC42OTMtMS4yMTFjLTEuOTY4IDEuNjY1LTYuMDU2IDQuMzkxLTcuMjY3IDYuNjYyIDEuNTE0LS40NTQgNC41NDItMi4yNzEgNi4wNTYtMi4yNzEtMS4zNjMgMS4yMTEtNC4yMzkgMy4zMzEtNC45OTYgNC44NDUuMTUyIDAgMCAuMTUyIDAgLjMwMyAxLjIxMS0uNjA2IDMuOTM2LTIuMjcxIDUuMTQ4LTIuNDIyLTEuMzYzIDEuMzYzLTMuNzg1IDMuOTM2LTQuMjM5IDUuNzUzIDEuMjExLS43NTcgMy45MzYtMi4yNzEgNS4yOTktMi43MjUtLjMwMy43NTctLjkwOCAxLjIxMS0xLjM2MyAxLjk2OC0uNjA2LjkwOC0xLjk2OCAxLjk2OC0xLjk2OCAzLjE3OSAxLjA2LS45MDggMi4yNzEtMS42NjUgMy40ODItMi40MjItLjYwNiAxLjIxMS0xLjUxNCAyLjEyLTEuODE3IDMuNDgyLjc1Ny0uNzU3IDIuNDIyLTEuMjExIDMuMzMxLTEuNTE0aC0uMTUyYy0uMTUyIDAtMS4yMTEuOTA4LTIuMTIgMS44MTcuNzU3IDAgLjE1Mi0uMTUyIDEuMDYuMTUyaC40NTRsLS43NTcuNDU0LTEuMzYzLjc1N2MxLjk2OCAyLjQyMiA0LjM5MSA0LjU0MiA3LjExNiA1LjkwNSAzLjYzNCAxLjgxNyA3LjU3IDIuMjcxIDExLjUwNiAxLjk2OGwtLjE1Mi0uNzU3YzAtLjMwMy0uMTUyLS42MDYtLjMwMy0uNzU3IDEuMzYzLTIuNTc0LjYwNi02LjgxMyA0LjA4OC04LjQ3OCAyLjI3MS0xLjIxMSAyLjU3NC0xLjgxNyA1LjI5OS0xLjM2MyAxLjUxNC4zMDMgNC41NDIgMS4zNjMgNi4wNTYgMS4wNiAxLjM2My0uNzU3IDIuMTItMS4wNiAzLjMzMS0xLjk2OCAxLjUxNC4zMDMgMS45NjguMTUyIDIuNTc0LS42MDYtLjQ1NC43NTcuOTA4LTIuNzI1IDEuNTE0LTMuOTM2eiIgZmlsbD0iI2ZhZmFmYSIvPjxwYXRoIGQ9Ik0xNi40OTUgNTYuMDF2LTUyLjA4MmwtMTYuNTAzIDYuNjYydjUxLjc3OXoiIGZpbGwtb3BhY2l0eT0iLjA1OSIvPjxwYXRoIGQ9Ik00OS42NTEgNTYuMDF2LTUyLjA4MmwtMTYuNTAzIDYuNjYydjUxLjc3OXoiIGZpbGwtb3BhY2l0eT0iLjA1MSIvPjwvZz48L3N2Zz4=
// @downloadURL https://update.greasyfork.org/scripts/28412/MDN%20%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/28412/MDN%20%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==
'esversion: 6';

let winLoc = window.location.href;
if (winLoc.match('\/en-US\/|\/en\/') !== null) {
  window.location.href = winLoc.replace(/\/en-US\/|\/en\//i, '\/zh-CN\/');
}
let mdnLink = document.links;
for (let i = 0; i < mdnLink.length; i++) {
  if (mdnLink[i].href.match('\/en-US\/|\/en\/') !== null) {
    mdnLink[i].href = mdnLink[i].href.replace(/\/en-US\/|\/en\//i, '\/zh-CN\/');
  }
}
