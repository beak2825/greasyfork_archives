// ==UserScript==
// @name         Hoteis baratos
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Hoteis baratos Dotz
// @author       Hader
// @match        https://www.dotz.com.br/viaja
// @icon         
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442824/Hoteis%20baratos.user.js
// @updateURL https://update.greasyfork.org/scripts/442824/Hoteis%20baratos.meta.js
// ==/UserScript==
 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const hidden = (element) => {
    $(element).css('display', 'none')
  }
   
  (async function() {
        
            
            hidden("header")
            hidden("div#content")
            hidden(".bannerPrincipal")
            hidden("footer")
            hidden(".finalFooter")
            hidden("._hj_feedback_container")
            
            
            hidden("ul.tabs")

            $(".searchEngineSel.hotel").click()

            while(! $(".content.hotel").css('display')){
                await sleep(10);
            }

            hidden(".searchEngineSel.hotel")
            hidden(".searchEngineSel.flight")

            $(".iframe-busca").css('hight', '50%')

            $(".iframe-busca").css('width', '50%')
            $(".iframe-busca").css('right', '0%')
            $(".iframe-busca").css('left', '25%')
            
            
       
            $(".content.hotel").css('width', '100%')
            $(".content.hotel").css('height', '100%')

  })();