// ==UserScript==
// @name         Redirect nCrave error page
// @version      2.2
// @description  Return to Sponsored/nCrave page to restart
// @author       Toni
// @match        https://adserver.entertainow.com/encrave_error.html?errorMsg=Unavailable*
// @grant        none
// @namespace https://greasyfork.org/users/249948
// @downloadURL https://update.greasyfork.org/scripts/382452/Redirect%20nCrave%20error%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/382452/Redirect%20nCrave%20error%20page.meta.js
// ==/UserScript==
// Comment out one of these
// H
const mpID = "56650122";
const sbID = "50698524";
// D
//const mpID = "56532272";
//const sbID = "50041208";


function doStuff() {
    if (window.location.href.includes("u="+sbID)) {
        window.location.href = "https://www.swagbucks.com/watch/sponsored"
    }
    else {
        //if (window.location.href.includes("u="+mpID)) {
            window.location.href = "https://www.mypoints.com/ncrave"
    //    }
    }
}

setTimeout(doStuff, 30000)