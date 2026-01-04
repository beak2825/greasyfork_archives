// ==UserScript==
// @name         Roblox Quick Join Button Profile
// @namespace    http://tampermonkey.net/
// @version      2024-09-19
// @description  Adds a button to quickly join on the games page
// @author       You
// @match        https://www.roblox.com/users*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509224/Roblox%20Quick%20Join%20Button%20Profile.user.js
// @updateURL https://update.greasyfork.org/scripts/509224/Roblox%20Quick%20Join%20Button%20Profile.meta.js
// ==/UserScript==

(function() {
        'use strict';


    window.addEventListener('load', function () {
var GetUrl = 'roblox:/'+'/experiences/start?'+'Userid='+window.location.href.slice(29).split('/')[0];


const element = document.getElementsByClassName("details-actions desktop-action")[0];
const buttonOut = document.createElement('button');
buttonOut.innerHTML ='<button class="QuickJoinButtonProfile" onclick="window.location.replace('+"'"+GetUrl+"'"+')">'+'<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4NCiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQzLjIgKDM5MDY5KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4NCiAgICA8dGl0bGU+dHVyYm8tYm9sdC1pY29uPC90aXRsZT4NCiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4NCiAgICA8ZGVmcz48L2RlZnM+DQogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+DQogICAgICAgIDxnIGlkPSJ0dXJiby1ib2x0LWljb24iIHN0cm9rZT0iI2ZmZmZmZiIgZmlsbD0iI2ZmZmZmZiI+DQogICAgICAgICAgICA8cGF0aCBkPSJNNi4xOTE5MjY1LDkuOTcwNDEyNjcgQzYuMzk4MTc1NzgsMTAuNDgyNzk5MyA2Ljg0NTEyOTYsMTAuNTUxNTQxOCA3LjE5NDU2MDQ0LDEwLjExODU4MjUgTDcuNDYxNDQ0OCw5Ljc4NzkwMTY3IEM3LjgwODkzNDk2LDkuMzU3MzQ2OTQgOC40MzQyMjU2NCw5LjI4NTQ1NTE2IDguODczNDY2NjEsOS42Mzk3NDUyMSBMMTEuNjg2NTYsMTEuOTA4Nzc1NCBDMTIuMTE4OTA4LDEyLjI1NzUwNTUgMTIuMzAzMDg1OCwxMi4xMjY1OTAzIDEyLjA5NjI3MDUsMTEuNjEyMjM0MSBMOS43NDkyMTU3NSw1Ljc3NTAzNDUzIEM5LjU0MzE0NDYyLDUuMjYyNTI5MTIgOS4wOTU4NDQ3Miw1LjE5NDAxNzM4IDguNzQ1ODAxMiw1LjYyNzM4NTE1IEw4LjQ3ODQ0ODksNS45NTgzNzc5IEM4LjEzMDM0OTQ3LDYuMzg5MzM4ODEgNy41MDQ1NjQ4Niw2LjQ2MTU1OTg3IDcuMDY1MzIzODksNi4xMDcyNjk4MiBMNC4yNTIyMzA0OCwzLjgzODIzOTY3IEMzLjgxOTg4MjUyLDMuNDg5NTA5NDkgMy42MzU4NDg1MSwzLjYyMDMyODkxIDMuODQyODQyNjEsNC4xMzQ1NjU5MSBMNi4xOTE5MjY1LDkuOTcwNDEyNjcgWiIgaWQ9InR1cmJvLWJvbHQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcuOTY5Mzk1LCA3Ljg3MzUwOCkgcm90YXRlKDY5LjAwMDAwMCkgdHJhbnNsYXRlKC03Ljk2OTM5NSwgLTcuODczNTA4KSAiPjwvcGF0aD4NCiAgICAgICAgPC9nPg0KICAgIDwvZz4NCjwvc3ZnPg==" style="width: 20px; height: 20px;"></img>'+'</button>'

element.append(buttonOut)
buttonOut.outerHTML = buttonOut.innerHTML

$('head').append('<style> .QuickJoinButtonProfile { border: none; border-radius: 8px; color: white; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 0px 15px; cursor: pointer; background-color: #fc6c00; height: 35px; width: 50px;} </style>');
});
    })();