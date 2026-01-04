// ==UserScript==
// @name         Remove Round Limit
// @namespace    http://tampermonkey.net/
// @version      0.105
// @description  You need Excigma code injector.
// @author       Moving 1 (Rafael Melo)
// @license MIT
// @match        https://bonk.io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499006/Remove%20Round%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/499006/Remove%20Round%20Limit.meta.js
// ==/UserScript==

//Sorry for stole LEGENDBOSS123 bonk host edit

document.getElementById('newbonklobby_roundsinput').removeAttribute("maxlength");
patch(/[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]\[[0-9]{1,3}\]\[[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]\[[0-9]{1,3}\]\]=Math\[[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]\[[0-9]{1,3}\]\]\(Math\[[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]\[[0-9]{1,3}\]\]\(1,[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]\[[0-9]{1,3}\]\[[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]\[[0-9]{1,3}\]\]\),9\);/, '');
const roundVal = newStr.match(/[A-Za-z0-9\$_]{3}\[[0-9]{1,4}\]=parseInt\([A-Za-z0-9\$_]{3}(\[0\]){2}\[[A-Za-z0-9\$_]{3}(\[[0-9]{1,4}\]){2}\]\)\;/)[0];
const roundValVar = roundVal.split('=')[0];
patch(roundVal, `${roundValVar}=parseInt(document.getElementById('newbonklobby_roundsinput').value);if(isNaN(${roundValVar}) || ${roundValVar} <= 0){return;}`);
