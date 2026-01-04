// ==UserScript==
// @name        SURVIV.IO HP
// @namespace    http://tampermonkey.net/
// @version      3
// @description  VEJA O HP!
// @author       FoX
// @match        http*://surviv.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390038/SURVIVIO%20HP.user.js
// @updateURL https://update.greasyfork.org/scripts/390038/SURVIVIO%20HP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var sound = new Audio("https://r1---sn-3pm7kn7e.googlevideo.com/videoplayback?c=WEB&gir=yes&key=cms1&sparams=clen,dur,ei,expire,gir,id,ip,ipbits,ipbypass,itag,keepalive,lmt,mime,mip,mm,mn,ms,mv,pl,requiressl,source&expire=1551375897&source=youtube&ei=ucl3XNzjMdq5kwapxp_gBQ&keepalive=yes&lmt=1507888664639779&ip=173.255.245.233&pl=40&dur=23.219&id=o-ADvg9dLkJrGXRY75C00K9P96xJInS-ylFrbg1SJlJq7N&signature=03D8458C810E694470CDA2E6244D062F3EA41E26.4E7A625DBA8B2F263314313A7D6247DE1CF425BF&requiressl=yes&clen=370238&fvip=6&itag=140&mime=audio%2Fmp4&ipbits=0&title=Factory+Alarm+Sound&redirect_counter=1&rm=sn-n4vll7e&req_id=5152a4a00695a3ee&cms_redirect=yes&ipbypass=yes&mip=2400:7800:8ab6:c900:e061:864d:a4d8:87e8&mm=31&mn=sn-3pm7kn7e&ms=au&mt=1551354182&mv=m");
    sound.loop = true;
    var o = document.createElement("a");
    o.setAttribute("id","my_Heart");
    o.style.color = "blue";
    o.style.fontSize = "25px";
    o.style.display = "block";
    document.getElementById("ui-boost-counter").parentNode.appendChild(o);
    var reference = document.getElementById('ui-boost-counter');
    reference.parentNode.insertBefore(o, reference);

    setInterval(function(){
        o.innerHTML ="Vida : " + Math.round(document.getElementById("ui-health-actual").style.width.slice(0,-1));
        if(document.getElementById("game-area-wrapper").style.display == "block"){
            if(o.innerHTML.slice(5,8) < 25){
                o.style.color = "red";
                sound.play();
            } else {
                if(o.innerHTML.slice(5,8) > 25){
                    o.style.color = "blue";
                    sound.pause();
                }
            }
        } else {
            sound.pause();
        }
    },500);
})();