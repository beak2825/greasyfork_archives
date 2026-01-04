// ==UserScript==
// @name           Neopets - Pet Lookup / Quick Ref  Post-Flash Fix
// @version        0.1
// @namespace
// @include        *://www.neopets.com/quickref.phtml
// @include        *://www.neopets.com/petlookup*
// @description    Replaces that annoying end-of-Flash-support tombstone with the pet image
// @copyright    Lendri Mujina
// @grant        none
// @namespace https://greasyfork.org/users/394566
// @downloadURL https://update.greasyfork.org/scripts/428417/Neopets%20-%20Pet%20Lookup%20%20Quick%20Ref%20%20Post-Flash%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/428417/Neopets%20-%20Pet%20Lookup%20%20Quick%20Ref%20%20Post-Flash%20Fix.meta.js
// ==/UserScript==

//Known issues:
//  On Quick Ref, the script currently only works for the current active pet's module.

(function () {
  'use strict';
    var petAnchor;
    var petName;
    var imgpart = ["<img src=\"http://pets.neopets.com/cpn/","/1/7.png\" style=\"width:100%\;\">"];
    var imgURL;
    var currentURL=window.location.href;

    if(currentURL.indexOf("petlookup") == -1){
        petName = $(".contentModuleHeader")[0].firstChild.innerHTML;
        $(".flashRIP-content__2020").remove();
        petAnchor = $(".flashRIP__2020")[0];
        imgURL = imgpart[0] + petName + imgpart[1];
        petAnchor.innerHTML = imgURL;
    }
    else{
        $(".flashRIP__2020").remove();
         petAnchor = $(".medText")[4];
        var nameLocation = $('[style="font-weight: bold; font-size: 18px;"]')[0].textContent;
        var petThe = nameLocation.lastIndexOf(" the ");//There's a few very rare pets out there that may have the substring in their names; this accounts for that.
        petName = nameLocation.substr(0,petThe);
        console.log(petName);
        imgURL = imgpart[0] + petName + imgpart[1];
        var existingCode = petAnchor.innerHTML;
        petAnchor.innerHTML = imgURL + "<br><p>" + existingCode + "</p>";
        console.log(imgURL);
        console.log(existingCode);
    };

}
 )();