// ==UserScript==
// @name WebDAV Browser
// @name:ru WebDAV обозреватель
// @version 0.1
// @description Browse WebDAV share directly from a browser
// @description:ru Позволяет просмотреть WebDAV папку прямо из браузера
// @license 0BSD
// @author Sergey Ponomarev <stokito@gmail.com>
// @namespace https://gist.github.com/stokito/a7babfa3c04c92c6c4142581145fe33d
// @supportURL https://gist.github.com/stokito/a7babfa3c04c92c6c4142581145fe33d
// @match http://*/dav/*
// @match https://*/dav/*
// @match http://dav.*/*
// @match https://dav.*/*
// @match http://*/webdav/*
// @match https://*/webdav/*
// @match http://webdav.*/*
// @match https://webdav.*/*
// @match https://svn.code.sf.net/p/*/code/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/462505/WebDAV%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/462505/WebDAV%20Browser.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Clear existing body if any")
    document.body.innerHTML = ""

    var style = document.createElement("link")
    style.rel = "stylesheet"
    style.href = "https://cdn.jsdelivr.net/gh/dom111/webdav-js/assets/css/style-min.css"
    document.head.appendChild(style)

    var script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/gh/dom111/webdav-js/src/webdav-min.js"
    document.head.appendChild(script)
})();