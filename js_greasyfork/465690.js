// ==UserScript==
// @name         Speedway
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Speedways
// @author       You
// @match        https://www.torn.com/loader.php?sid=racing*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465690/Speedway.user.js
// @updateURL https://update.greasyfork.org/scripts/465690/Speedway.meta.js
// ==/UserScript==

function insert(){
    var a = `<a href="https://www.torn.com/loader.php?sid=racing&tab=customrace&section=getInRace&step=getInRace&id=&carID=634518&createRace=true&title=xp&minDrivers=2&maxDrivers=3&trackID=21&laps=100&minClass=5&carsTypeAllowed=1&carsAllowed=5&betAmount=0&waitTime=0&rfcv=undefined">Speedway</a>`;
    if ($('.content-title').length>0){
        $('.content-title > h4').append(a);
    }
    else{
        setTimeout(insert,1000);
    }

}
insert();