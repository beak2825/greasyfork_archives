// sign2.js
// ==UserScript==
// @name          yunzhongsign
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  hello the great world
// @author       lin
// @match        http://124.70.85.20/getinfo.aspx
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449750/yunzhongsign.user.js
// @updateURL https://update.greasyfork.org/scripts/449750/yunzhongsign.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('txtbenhealth').value= "良好"
document.getElementById('txtjiatinghealth').value= "良好"
document.getElementById('txttiwen').value= "36.5"
document.getElementById('nowAddress').value= "填写你的住址"
document.getElementById('radwjc').click()
document.getElementById('nmj').click()
document.getElementById('ncmj').click()
document.getElementById('njzgl').click()
document.getElementById('sjjgl').click()
document.getElementById('btnSubmit').click()
})();
