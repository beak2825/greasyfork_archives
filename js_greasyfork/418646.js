// ==UserScript==
// @name         Google [DEC 2020] - Hide Ad results in google search
// @description  🔊 [DEC 2020] One line script to hide Ad tedious results in google search
// @author       dany-veneno
// @icon         https://www.google.com/favicon.ico
// @include      *://*.google*/search*
// @grant        none
// @create       2020-12-14
// @lastmodified 2020-12-15
// @version      0.5
// @compatible   firefox Tested with Tampermonkey
// @compatible   chrome Tested with Tampermonkey
// @compatible   opera Tested with Tampermonkey
// @compatible   safari Tested with Tampermonkey
// @copyright    2020, dany-veneno
// @run-at       document-end
// @namespace https://greasyfork.org/users/572366
// @downloadURL https://update.greasyfork.org/scripts/418646/Google%20%5BDEC%202020%5D%20-%20Hide%20Ad%20results%20in%20google%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/418646/Google%20%5BDEC%202020%5D%20-%20Hide%20Ad%20results%20in%20google%20search.meta.js
// ==/UserScript==

document.getElementById("tvcap").style.display = "none";