// ==UserScript==
// @name         Simple Cookie Clicker Autoclick
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Autoclick the coockie
// @author       Sofus Würtz
// @match        https://orteil.dashnet.org/cookieclicker/
// @icon         https://www.google.com/s2/favicons?domain=dashnet.org
// @grant        none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/425037/Simple%20Cookie%20Clicker%20Autoclick.user.js
// @updateURL https://update.greasyfork.org/scripts/425037/Simple%20Cookie%20Clicker%20Autoclick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //****** OPTIONS *******
    let clicksPerSecondBC = 10; //How many times per second should the big cookie be clicked
    let durationBC = 20; //Duration to click big cookie in seconds. eg. 20 means will press it for 20 sec
    let secondsPerClickGC = 10 //How many seconds between clicking golden cookies
    let durationGC = 10; //Duration to click golden cookies in minutes. eg. 10 means will press all golden cookies for 10 min
    let clickWrathCookies = false //false = don't autoclick wrath cookies. true = click all cookies.
    //****** OPTIONS END *******
    console.log("mod 'Simple Cookie Clicker Autoclick' added")

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    let cok = document.getElementById("bigCookie")
    let GCok = document.getElementById("shimmers")

    //Autoclicks the big cookie
    async function StartClicking(){
        console.log("Autoclicking on big cookie " + clicksPerSecondBC + "/s next " + durationBC +" sec")
        let btn = document.getElementById("StartAutoClick")
        btn.style.color = "lightgreen"
        let n = clicksPerSecondBC * durationBC
        for(let i = 0; i<n; i++){
            cok.click()
            await sleep(1000/clicksPerSecondBC)
        }
        btn.style.color = ""
    }

    //Click golden cookies if they are not wrath cookies
    async function StartClickingCookies(){
        console.log("Autoclicking golden cookie every " + secondsPerClickGC + " sec for next " + durationGC + " min")
        let n = 60/secondsPerClickGC*durationGC
        let btn = document.getElementById("StartAutoClickCoockies")
        btn.style.color = "lightgreen"
        for(let i = 0; i<n; i++){
            if(GCok.children.length !== 0){
                for (let cookie of GCok.children) {
                    if(cookie.className === "shimmer" && (cookie.attributes.alt.value === "Golden cookie" || clickWrathCookies)){
                        cookie.click();
                    } else{
                    }
                }
            }
            await sleep(secondsPerClickGC*1000)
        }
        console.log("stopped clicking golden cookies")
        btn.style.color = ""
    }

    async function InsertBtn(func, innerHTML){
        await sleep(1200)
        let btnLocation = document.getElementsByClassName("productButtons")[0]
        let newBtn = document.createElement("a")
        newBtn.innerHTML = innerHTML
        newBtn.addEventListener ("click", func, false);
        btnLocation.appendChild(newBtn);
    }

    InsertBtn(StartClicking, '<a id="StartAutoClick" class="option">Autoclick</a>')
    InsertBtn(StartClickingCookies, '<a id="StartAutoClickCoockies" class="option">A.click Golden Cookies</a>')
})();