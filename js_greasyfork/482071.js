// ==UserScript==
// @name         Skip HUP 5-second wait
// @namespace    https://greasyfork.org/zh-CN/scripts/482071-skip-hup-5-second-wait
// @version      1.0.1
// @description  Skip the 5-second wait on hinet.hiroshima-u.ac.jp, redirect to Hiroshima University Login Page directly
// @author       Mark Chen
// @match        http://hinet.hiroshima-u.ac.jp/login.html
// @icon         https://raw.githubusercontent.com/PalaisMermonia/FURINA/576fe9e12c286359b1794508d071e46e4f8cb17f/palais-mermonia/docs/public/image/icon/FURINA_logo_square.svg
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482071/Skip%20HUP%205-second%20wait.user.js
// @updateURL https://update.greasyfork.org/scripts/482071/Skip%20HUP%205-second%20wait.meta.js
// ==/UserScript==

window.location.replace("https://portal.hinet.hiroshima-u.ac.jp/")