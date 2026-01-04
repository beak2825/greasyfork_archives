// ==UserScript==
// @name        screenReaderCrimes
// @version     1.8
// @description show crime data for screen readers
// @author      Thartis [2640127]
// @license     GNU GPLv3
// @match       https://www.torn.com/loader.php?sid=crimes*
// @require     https://greasyfork.org/scripts/469186-network-call-listener/code/Network%20Call%20Listener.user.js
// @run-at       document-end
// @namespace https://greasyfork.org/users/1108403
// @downloadURL https://update.greasyfork.org/scripts/469187/screenReaderCrimes.user.js
// @updateURL https://update.greasyfork.org/scripts/469187/screenReaderCrimes.meta.js
// ==/UserScript==



//Fetch Interceptor
    window.addEventListener("hardy-fetch", (t) => {
        let detail = t.detail;
        let i = 0;
        if(detail.url.includes('crimesData&step=crimesList&typeID=1')){
            setTimeout(function() {
                for(i = 0 ; i < detail.response.DB.crimesByType.length; i++) {
                    Array.prototype.slice.call(document.querySelectorAll('div'))
                        .filter((el) => {
                        if(el.textContent == detail.response.DB.crimesByType[i].title){
                            el.textContent += ` Secrets Availble: ${detail.response.DB.crimesByType[i].secretsAvailable} `
                            el.textContent += `Success Percentage: ${detail.response.DB.crimesByType[i].additionalInfo.barValue}%`
                        }
                    })[0];
                }
            }, 100)

        }

        if(detail.url.includes('crimesData&step=crimesList&typeID=4')){
          setTimeout(function() {
              for(i = 0 ; i < detail.response.DB.crimesByType.length; i++) {
                  Array.prototype.slice.call(document.querySelectorAll('div'))
                      .filter((el) => {
                      if(el.textContent == detail.response.DB.crimesByType[i].title){
                          el.textContent += ` Secrets Availble: ${detail.response.DB.crimesByType[i].secretsAvailable} `
                          el.textContent += `Notoriety Percentage: ${detail.response.DB.crimesByType[i].additionalInfo.notoriety}%`
                          detail.response.DB.crimesByType[i].additionalInfo.statusEffects.map((effects) => {
                              el.textContent += ` ${effects.title} is disabled ${effects.disabled}`
                          })
                      }
                  })[0];
              }
            }, 100)

        }
    });

