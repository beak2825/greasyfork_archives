// ==UserScript==
// @name         AnimeTv link getter
// @namespace    http://tampermonkey.net/
// @version      2023-12-25
// @description  Pega do player direto dos site de anime
// @author       PolloLoco
// @match        https://animetvonline.cx/*
// @match        https://otakuanimess.com/episodio/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license PolloLoco
// @downloadURL https://update.greasyfork.org/scripts/483175/AnimeTv%20link%20getter.user.js
// @updateURL https://update.greasyfork.org/scripts/483175/AnimeTv%20link%20getter.meta.js
// ==/UserScript==


(function() {
    'use strict';
    let elem = $('a[target="_blank"]')
    if(elem && elem[0] && elem[0].href){
      let splited = elem[0].href.split('=');
        if(splited && splited[1]){
          let decodedData = atob(splited[1]);
           if(decodedData){
               console.log(decodedData)
              let gettedLink = decodedData.split('src="')
              if(gettedLink[1]){
               gettedLink = gettedLink[1].split('"')[0]
                  $('[id="Link"]')[0].innerHTML = ''
                  $('[id="Link"]').prepend('<input type="text" value="'+gettedLink.trim()+'" class="search-live" style="width: 100%;"></input>')
                  $('[id="Link"]').prepend('<iframe src="'+gettedLink.trim()+'" ></iframe>')
              }else{
                console.log("[K1] Decoded link dont have a src");
                  if(decodedData.includes('otakuanimess')){
                    $('[id="Link"]')[0].innerHTML = ''
                    $('[id="Link"]').prepend('<input type="text" value="'+decodedData.trim()+'" class="search-live" style="width: 100%;"></input>')
                    $('[id="Link"]').prepend('<iframe src="'+decodedData.trim()+'" ></iframe>')
                  }
              }
           }else{
            console.log("[K1] Cannot decod link");
           }
        }else{
         console.log("[K1] Element blank dont referer");
        }
    }else{
     console.log("[K1] Element blank doest exists");
    }
})();