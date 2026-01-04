// ==UserScript==
// @name         getDynamiqueClassName
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  get permanant changed ClassName
// @author       MeGa
// @match        YourUrl*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        God
// @downloadURL https://update.greasyfork.org/scripts/441835/getDynamiqueClassName.user.js
// @updateURL https://update.greasyfork.org/scripts/441835/getDynamiqueClassName.meta.js
// ==/UserScript==

var innerHTML = document.body.innerHTML;
var targetFix = "";
var target = innerHTML.indexOf(targetFix);
var begin = target - 90; /*begin classeName aproximatif ---*/
var end = target - 65; /*end classeName approximatif +++*/

var cibleImage = innerHTML.substring(begin, end);

var appo = cibleImage.lastIndexOf('"');
if (appo !== -1) {
    var DecaleLeft = cibleImage.length - appo;
    var newCibleImage = innerHTML.substring(begin, end - DecaleLeft);
    var appoNCI = newCibleImage.indexOf('"');
    if (appoNCI !== -1) {
        var cutBeginToAppo = appoNCI + 1;
        var classImg = innerHTML.substring(begin + cutBeginToAppo, end - DecaleLeft);

    } else {
        var classImg = newCibleImage;
    }
} else {
    var classImg = cibleImage;
}

console.log(classImg);

/*exp:   
<span class="sign-out-link">[ <a rel="nofollow" data-method="delete" href="/fr/users/sign_out">Se déconnecter</a> ]</span>
here: targetFix = "Se déconnecter";
      begin = target -90; /*the differnece between the begining of the class name (taking a margin befor the beginin of 03 positions) 
      end = target -65; the differnece between the end of the class name (taking a margin after the beginin 03 positions).
*/