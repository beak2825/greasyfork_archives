// ==UserScript==
// @name         clearAds
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       EmRaH
// @match        http://*/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28989/clearAds.user.js
// @updateURL https://update.greasyfork.org/scripts/28989/clearAds.meta.js
// ==/UserScript==


setInterval(clearAds, 3000);
//clearAds();
function clearAds(){
    if(window.location.host!=="moonbit.co.in"){
        $("iframe").each(function(){
            var link =$(this).attr("src");
            if(link===undefined){
                $(this).remove();
            }else{
                if((link.indexOf("https://www.google.com/recaptcha/api2/")==-1))
                {
                    if(link.indexOf("//api.solvemedia.com/papi")==-1)
                        $(this).remove();
                }
            }
        });
    }
}