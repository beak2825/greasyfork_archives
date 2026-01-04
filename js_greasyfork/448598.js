// ==UserScript==
// @name         Shellshock.io Remove Adblocker messages & respawn timer
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Remove the Adblock popup, as well as the respawn timer to avoid the extra wait in shell shockers
// @author       mewen25
// @match        *://shellshock.io/*
// @match        *://algebra.best/*
// @match        *://algebra.vip/*
// @match        *://biologyclass.club/*
// @match        *://deadlyegg.com/*
// @match        *://deathegg.world/*
// @match        *://eggcombat.com/*
// @match        *://egg.dance/*
// @match        *://eggfacts.fun/*
// @match        *://egghead.institute/*
// @match        *://eggisthenewblack.com/*
// @match        *://eggsarecool.com/*
// @match        *://geometry.best/*
// @match        *://geometry.monster/*
// @match        *://geometry.pw/*
// @match        *://geometry.report/*
// @match        *://hardboiled.life/*
// @match        *://hardshell.life/*
// @match        *://humanorganising.org/*
// @match        *://mathdrills.info/*
// @match        *://mathfun.rocks/*
// @match        *://mathgames.world/*
// @match        *://math.international/*
// @match        *://mathlete.fun/*
// @match        *://mathlete.pro/*
// @match        *://overeasy.club/*
// @match        *://scrambled.best/*
// @match        *://scrambled.tech/*
// @match        *://scrambled.today/*
// @match        *://scrambled.us/*
// @match        *://scrambled.world/*
// @match        *://shellshockers.club/*
// @match        *://shellshockers.site/*
// @match        *://shellshockers.us/*
// @match        *://shellshockers.world/*
// @match        *://softboiled.club/*
// @match        *://violentegg.club/*
// @match        *://violentegg.fun/*
// @match        *://yolk.best/*
// @match        *://yolk.life/*
// @match        *://yolk.rocks/*
// @match        *://yolk.tech/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/448598/Shellshockio%20Remove%20Adblocker%20messages%20%20respawn%20timer.user.js
// @updateURL https://update.greasyfork.org/scripts/448598/Shellshockio%20Remove%20Adblocker%20messages%20%20respawn%20timer.meta.js
// ==/UserScript==

var open_prototype = XMLHttpRequest.prototype.open, intercept_response = function(callback) {
    XMLHttpRequest.prototype.open = function(method, url) {
        if(url.indexOf("shellshock.js") > -1) this.isScript = true;
        this.addEventListener('readystatechange', function(event) {
            if ( this.readyState === 4 && this.isScript ) {
                var response = callback(event.target.responseText);
                Object.defineProperty(this, 'response', {writable: true});
                Object.defineProperty(this, 'responseText', {writable: true});
                this.response = this.responseText = response;
            }
        });
        return open_prototype.apply(this, arguments);
    };
};

intercept_response(function(response) {
    const [adLine, adVar1, adVar2] = /function (.{2})\(e.{2}\){.\?.+?(?=}f)}function (.{2})/.exec(response);
    const [timer, timerVar, timerVar2, timerVar3] = /function (.{2})\(e\){(.{2})=M.+?(?=1,)1,(.{17}).+?(?=var)/.exec(response);
    window.localStorage.setItem("lastPreRoll", Date.now());
    window.localStorage.setItem("showBigAd", Date.now()+432e5);
    if(!adLine || !adVar1 || !adVar2) {
        console.log('error doing anti adblock')
    } else {
        console.log("[INJECTING] - Adblock popup block");
        const replaceAd = `function ${adVar1}(e){console.log("[ADBLOCK]-blocked"),${adVar2}()}function ${adVar2}`
        response = response.replace(adLine, replaceAd);
    }
    if(!timer || !timerVar || !timerVar2 || !timerVar3) {
        console.log('error doing timer block');
    }
    else {
        console.log("[INJECTING] - Timer block");
        response = response.replace(timer, `function ${timerVar}(e){localStore.setItem("showBigAd",Date.now()+432e5),localStore.setItem("lastPreRoll",Date.now()),setTimeout(()=>{${timerVar2}=-1,${timerVar3}},3000)}`);
    }
    return response;
});



