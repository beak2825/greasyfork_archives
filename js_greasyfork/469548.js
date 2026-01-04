// ==UserScript==
// @name         Gui Test
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Gui Test!
// @author       You
// @match        https://gkzy.eaagz.org.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eaagz.org.cn
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469548/Gui%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/469548/Gui%20Test.meta.js
// ==/UserScript==

(function() {
    'use strict';
    alert("访问人数较多，系统查询缓慢。")
    setInterval(()=>{
        document.body.firstChild.contentWindow.window.document.querySelector("#cont > tbody > tr > td:nth-child(2) > table.TableBlock > tbody > tr:nth-child(7) > td:nth-child(2)").innerText= 415
        document.body.firstChild.contentWindow.window.document.querySelector("#cont > tbody > tr > td:nth-child(2) > table.TableBlock > tbody > tr:nth-child(8) > td:nth-child(2)").innerText= 94
        document.body.firstChild.contentWindow.window.document.querySelector("#cont > tbody > tr > td:nth-child(2) > table.TableBlock > tbody > tr:nth-child(9) > td:nth-child(2)").innerText= 62
        document.body.firstChild.contentWindow.window.document.querySelector("#cont > tbody > tr > td:nth-child(2) > table.TableBlock > tbody > tr:nth-child(10) > td:nth-child(2)").innerText= 28
        document.body.firstChild.contentWindow.window.document.querySelector("#cont > tbody > tr > td:nth-child(2) > table.TableBlock > tbody > tr:nth-child(11) > td:nth-child(2)").innerText= 146
        document.body.firstChild.contentWindow.window.document.querySelector("#cont > tbody > tr > td:nth-child(2) > table.TableBlock > tbody > tr:nth-child(12) > td:nth-child(2)").innerText= 415
        document.body.firstChild.contentWindow.window.document.querySelector("#cont > tbody > tr > td:nth-child(2) > table.TableBlock > tbody > tr:nth-child(13) > td:nth-child(2)").innerText= 89221
        document.body.firstChild.contentWindow.window.document.querySelector("#cont > tbody > tr > td:nth-child(2) > table.TableBlock > tbody > tr:nth-child(14) > td:nth-child(2)").innerText= 28.5
        document.body.firstChild.contentWindow.window.document.querySelector("#cont > tbody > tr > td:nth-child(2) > table.TableBlock > tbody > tr:nth-child(15) > td:nth-child(2)").innerText= 28.5
    },16)
    // Your code here...
})();