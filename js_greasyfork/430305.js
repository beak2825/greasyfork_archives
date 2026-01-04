// ==UserScript==
// @name        Hawk S eyes #RefreshPageUntilFinfTheTargetAndAlert
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Refresh Page Until Finf The Target And Alert
// @author       MegaBOuSsOl
// @match        Your url
// @icon         https://www.google.com/s2/favicons?domain=vfsglobal.dz
// @grant        God
// @downloadURL https://update.greasyfork.org/scripts/430305/Hawk%20S%20eyes%20RefreshPageUntilFinfTheTargetAndAlert.user.js
// @updateURL https://update.greasyfork.org/scripts/430305/Hawk%20S%20eyes%20RefreshPageUntilFinfTheTargetAndAlert.meta.js
// ==/UserScript==

var YourTarget = "obfusqués";
var RefreshTime = 60;
    if (document.body.innerHTML.indexOf(YourTarget) == -1) {setTimeout(function(){location.reload();}, (1000 * RefreshTime))

    } else { new Audio('https://www.soundjay.com/misc/sounds/dream-harp-02.mp3').play();} 
