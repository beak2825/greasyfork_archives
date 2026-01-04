// ==UserScript==
// @name         Prognocis Claims Hijack Print Button
// @namespace    prognocis.com
// @version      2025.01.24.0856
// @description  Redefine link on Print button in Activity popup to print in screen mode
// @author       mrkrag
// @match        *.prognocis.com/prognocis/scrPatAccountActivity.jsp*
// @icon         https://prognocis.com/wp-content/uploads/2020/07/cropped-Fav-192x192.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515239/Prognocis%20Claims%20Hijack%20Print%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/515239/Prognocis%20Claims%20Hijack%20Print%20Button.meta.js
// ==/UserScript==
// this entire script was found on the web, I only edited the url it applies to

    // Your code here...
    var scriptCode = new Array();// this is where we are going to build our new script

    // here's the build of the new script, one line at a time
    scriptCode.push('function printAction(){');
    scriptCode.push('url = \'scrPrint.jsp?mode=pataccactivity\'+');
    scriptCode.push('\'&aspatid=\'+gsPtid+');
    scriptCode.push('\'&poolname=\'+gPoolName+');
    scriptCode.push('\'&outputmode=SCREEN\'+');
    scriptCode.push('\'&printerselection=YES\';');
    scriptCode.push('printDirect(url);');
    scriptCode.push('}');

    // now, we put the script in a new script element in the DOM
    var script = document.createElement('script');// create the script element
    script.innerHTML = scriptCode.join('\n');// add the script code to it
    scriptCode.length = 0;// recover the memory we used to build the script

    // this is sort of hard to read, because it's doing 2 things:
    // 1. finds the first <head> tag on the page
    // 2. adds the new script just before the </head> tag
    document.getElementsByTagName('head')[0].appendChild(script);
