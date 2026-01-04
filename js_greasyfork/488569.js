// ==UserScript==
// @name            cite university wifi auto login script
// @name:fr         Cité université wifi auto login script
// @namespace       seojihyuk@university
// @match           http://10.254.0.254:*/*
// @match           http://captive.apple.com/*
// @match           http://detectportal.firefox.com/canonical.html
// @match           http://www.msftconnecttest.com/redirect
// @match           http://www.gstatic.com/generate_204
// @match           http://edge-http.microsoft.com/captiveportal/generate_204
// @version         2.1.0
// @license         MIT
// @author          seojihyuk
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           window.close
// @description     This script allows you to skip the login process on the login page when you connect to Cité université wifi.
// @description:fr  Ce script vous permet de sauter le processus de connexion sur la page de connexion lorsque vous vous connectez au Cité université wifi.
// @downloadURL https://update.greasyfork.org/scripts/488569/cite%20university%20wifi%20auto%20login%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/488569/cite%20university%20wifi%20auto%20login%20script.meta.js
// ==/UserScript==
'use strict';
const CurrentTime = Date.now();
const lastLoginAttemptTime = GM_getValue("lastLoginAttemptTime");
//console.log(CurrentTime);
//console.log(lastLoginAttemptTime);
//console.log(CurrentTime - lastLoginAttemptTime);
//if((CurrentTime - lastLoginAttemptTime)>6*60*60*1000){
if(window.location.hostname=="10.254.0.254"){
    const username = GM_getValue("username");
    const password = GM_getValue("password");
    var usernameDom =
        document.querySelector("#ft_un");
    var passwordDom =
        document.querySelector("#ft_pd");
    var button =
        document.querySelector(".fer > input");
    if(username && password && ((CurrentTime - lastLoginAttemptTime)>10)){
        usernameDom.value = username;
        passwordDom.value = password;
        GM_setValue("lastLoginAttemptTime",CurrentTime);
        button.click();
    }else{
        button.addEventListener("click", function() {
            //console.log("save id and password");
            GM_setValue("username",usernameDom.value);
            GM_setValue("password",passwordDom.value);
            GM_setValue("lastLoginAttemptTime",CurrentTime);
        });
    }
}else{
(function() {
        var xhr = new XMLHttpRequest();
        var currentURL = window.location.href;
        console.log(window.location.href);
        xhr.open("GET", window.location.href, true);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.onreadystatechange = function() {
            if (xhr.status == 200) {
                if(xhr.readyState == 4){
                    const html = new DOMParser().parseFromString(xhr.response, "text/html");
                    if(html.title==="Success" && html.body.innerText.substring(0, 7)=="Success" && html.body.innerText.length<12){
                            //GM_setValue("lastLoginAttemptTime",CurrentTime);
                            window.close();
                    }else{
                        redirectToCaptivePortal();
                    }
                }
            }else{
                redirectToCaptivePortal();
                //location.reload();
            }
        }
        xhr.send();
    })();
}
//}

function redirectToCaptivePortal() {
    const captivePortalUrls = [
        "http://10.254.0.254",
        "http://captive.apple.com",
        "http://detectportal.firefox.com/canonical.html",
        "http://www.msftconnecttest.com/redirect",
        "http://www.gstatic.com/generate_204",
        "http://edge-http.microsoft.com/captiveportal/generate_204"
    ];

    const currentUrl = window.location.href;
    const isCaptivePortal = captivePortalUrls.some(url => currentUrl.includes(url));

    if (!isCaptivePortal) {
        console.log("redirect");
        setTimeout(function() {
            const newUrl = window.location.href;
            const isStillNotCaptivePortal = !captivePortalUrls.some(url => newUrl.includes(url));
            if (isStillNotCaptivePortal) {
                window.location.href = "http://captive.apple.com/hotspot-detect.html";
            }
        }, 3000); // wait for 3 seconds
    }
}