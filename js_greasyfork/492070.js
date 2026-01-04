// ==UserScript==
// @name         youtube + bilibili rec blocker
// @version      2024-04-9_3
// @license GNU GPLv3
// @description  youtube and bilibili recommendation blocker
// @author       RayRay
// @match        https://www.youtube.com/
// @match        https://www.bilibili.com/?*
// @match        https://www.bilibili.com/
// @run-at          document-body
// @grant           GM_info
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_xmlhttpRequest
// @grant           GM_registerMenuCommand
// @namespace https://greasyfork.org/users/1285841
// @downloadURL https://update.greasyfork.org/scripts/492070/youtube%20%2B%20bilibili%20rec%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/492070/youtube%20%2B%20bilibili%20rec%20blocker.meta.js
// ==/UserScript==

(function() {
      'use strict';
    
        console.log(location.href)
        if(location.href.includes('youtube.com')){
                    console.log("YT")

            document.addEventListener("DOMContentLoaded", function() {
                    console.log("DOM fully loaded and parsed");


    document.getElementsByClassName("style-scope ytd-two-column-browse-results-renderer")[0].style.display='none'
                window.addEventListener("load", (event) => {
  console.log("page is fully loaded");


document.getElementsByClassName("style-scope ytd-guide-entry-renderer")[10].style.display='none'
document.getElementsByClassName("style-scope ytd-guide-entry-renderer")[20].style.display='none'
document.getElementsByClassName("style-scope ytd-guide-renderer")[2].style.display='none'
});
});

        }
        if(location.href.includes('bilibili.com')){

            document.addEventListener("DOMContentLoaded", function() {
                    console.log("DOM fully loaded and parsed");
            document.getElementsByClassName("bili-feed4-layout")[0].style.display='none'
                            window.addEventListener("load", (event) => {

document.getElementsByClassName('header-channel-fixed')[0].style.display='none'
document.getElementsByClassName('bili-header__channel')[0].style.display='none'
document.getElementsByClassName("bili-header__bar")[0].getElementsByClassName('left-entry')[0].style.opacity='0'
//document.getElementsByClassName('nav-search-input')[0].placeholder=""
document.getElementsByClassName('palette-button-wrap')[0].style.opacity='0'
document.getElementsByClassName('nav-search-input')[0].style.opacity='0'

setTimeout(() => {
  document.getElementsByClassName('nav-search-input')[0].placeholder=""
    document.getElementsByClassName('nav-search-input')[0].style.opacity='1'

}
           ,
          800)
                            })

            })



            //palette-button-wrap
        }





    

})();