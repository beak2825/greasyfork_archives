// ==UserScript==
// @name         个性化、美化网页自定义鼠标样式
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  个性化、美化网页自定义鼠标样式！
// @author       戈小戈
// @match        https://*/*
// @match        http://*/*
// @icon         https://s3.bmp.ovh/imgs/2021/09/a01be58228a8ea44.jpg
// @license           AGPL
// @grant        none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/456660/%E4%B8%AA%E6%80%A7%E5%8C%96%E3%80%81%E7%BE%8E%E5%8C%96%E7%BD%91%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89%E9%BC%A0%E6%A0%87%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/456660/%E4%B8%AA%E6%80%A7%E5%8C%96%E3%80%81%E7%BE%8E%E5%8C%96%E7%BD%91%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89%E9%BC%A0%E6%A0%87%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(!document.querySelector('style[title="gxg_cursor_custom"]')){
        //Safari,Chrome下可行
        var style_others = document.createElement("style");
        style_others.type = "text/css";
        style_others.title='gxg_cursor_custom';
        style_others.textContent = "html, body {height: 100%;width: 100%;cursor: url(data:image/svg+xml;base64,IDxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBpZD0i5Zu+5bGCXzEiIGRhdGEtbmFtZT0i5Zu+5bGCIDEiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+DQogIDx0aXRsZT7mnKrmoIfpopgtMTwvdGl0bGU+DQogIDxyZWN0IHg9IjkuNDUiIHk9IjE2LjciIHdpZHRoPSIzLjcxIiBoZWlnaHQ9IjcuMSIgcng9IjEuNzIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05LjQxIDYuNjMpIHJvdGF0ZSgtMjYuNjMpIiBzdHlsZT0iZmlsbDojNTljNmZjO3N0cm9rZTojMDAwO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZCIvPg0KICA8Y2lyY2xlIGN4PSIxMC4yNiIgY3k9IjIwLjY3IiByPSIwLjUzIiBzdHlsZT0iZmlsbDojMDI1YzVjIi8+DQogIDxwYXRoIGQ9Ik0yLjA2LDIuNTQsMiwyMGExLjM2LDEuMzYsMCwwLDAsMiwxLjIxbDIuNC0yYTE3LjEsMTcuMSwwLDAsMSw0LjMyLTIuNjlsLjQ5LS4yLjY2LS4yMiw0Ljg4LTEuNDdhMS4yMSwxLjIxLDAsMCwwLC4yNS0yTDQuNDgsMS40NkExLjQ1LDEuNDUsMCwwLDAsMi4wNiwyLjU0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEuNTQgLTAuNTgpIiBzdHlsZT0iZmlsbDojZmZmO3N0cm9rZTojMDAwO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZCIvPg0KPC9zdmc+DQo=),default;}a{cursor: url(data:image/svg+xml;base64,IDxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBpZD0i5Zu+5bGCXzEiIGRhdGEtbmFtZT0i5Zu+5bGCIDEiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+DQogIDxyZWN0IHg9IjEuNTMiIHk9IjAuNSIgd2lkdGg9IjQuNzYiIGhlaWdodD0iMTIuMjMiIHJ4PSIyLjI1IiBzdHlsZT0iZmlsbDojZmZmO3N0cm9rZTojMDAwO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZCIvPg0KICA8Y2lyY2xlIGN4PSIzLjg0IiBjeT0iMy4wNCIgcj0iMS4wMyIvPg0KICA8cGF0aCBkPSJNMTQsOS42M2wxLjE5LjA5YTEuNjYsMS42NiwwLDAsMSwxLjUzLDEuNjRsMCwxLjdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMS4zNiAtMi40KSIgc3R5bGU9ImZpbGw6I2ZmZjtzdHJva2U6IzAwMDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjAuNXB4Ii8+DQogIDxwYXRoIGQ9Ik04LjI3LDguNTZsLjUzLS40NGEyLjg3LDIuODcsMCwwLDEsNCwuMzNsLjYzLjczYS42OC42OCwwLDAsMS0uNjEsMS4xMkw4LjYzLDkuNzhBLjcuNywwLDAsMSw4LjI3LDguNTZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMS4zNiAtMi40KSIgc3R5bGU9ImZpbGw6I2ZmZjtzdHJva2U6IzAwMDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6MC43NXB4Ii8+DQogIDxwYXRoIGQ9Ik00LjEsMTIuNDZjLjU2LS40NSwxLjE0LTEsMS42OS0xLjVhNyw3LDAsMCwxLDQuNDgtMS42OCw2LjkyLDYuOTIsMCwwLDEsMy45MiwxLjE0LDE1LjE3LDE1LjE3LDAsMCwxLDMsMy4zNCwxNC43LDE0LjcsMCwwLDEsMS4yNSwyLjM0LDcsNywwLDAsMS0uNjcsNS41aDBhNC45NCw0Ljk0LDAsMCwxLTQsMi4wNmwtNi41NywwYTUsNSwwLDAsMS00LjUyLTNsLS40LS45YTYuNzcsNi43NywwLDAsMS0uMzYtMi44NEE3LjI4LDcuMjgsMCwwLDEsNC4xLDEyLjQ2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEuMzYgLTIuNCkiIHN0eWxlPSJmaWxsOiM5MmQwZjc7c3Ryb2tlOiMwMDA7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kIi8+DQo8L3N2Zz4NCg==),default;}";
        document.getElementsByTagName("head").item(0).appendChild(style_others);
    }

    // Your code here...
})();