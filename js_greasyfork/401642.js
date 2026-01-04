// ==UserScript==
// @name         Save_Paken_AtCoder_Account
// @namespace    https://tkpaken.github.io/beginners/
// @version      0.1
// @description  If you try to participate on AtCoder in the shared account, this script stops you.
// @author       kaage
// @match        https://atcoder.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401642/Save_Paken_AtCoder_Account.user.js
// @updateURL https://update.greasyfork.org/scripts/401642/Save_Paken_AtCoder_Account.meta.js
// ==/UserScript==

(function() {
    var str = (document.getElementsByClassName('dropdown-toggle'))[1].innerHTML;
    if(str.match('.*pakenTK.*')){
        var button = (document.getElementsByClassName('btn btn-lg btn-primary mt-2'))[0];
        button.parentNode.removeChild(button);
    }
})();