// ==UserScript==
// @name         yunzhongsign1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  hello world
// @author       lin
// @match        http://124.70.85.20/getinfo.aspx
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449749/yunzhongsign1.user.js
// @updateURL https://update.greasyfork.org/scripts/449749/yunzhongsign1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('txtXh').value= "填写你的身份证号码"
    document.getElementById('btnQuery').click()
setTimeout("alert('helloworld')", 1000 )
})();;