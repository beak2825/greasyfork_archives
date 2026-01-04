// ==UserScript==
// @name         igg-games.com ad skip
// @namespace    https://igg-games.com/
// @version      0.1
// @description  igg-games ad skipper
// @author       _Chelos_
// @match        bluemediafiles.com/creatinglinks*
// @match        megaup.net/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392208/igg-gamescom%20ad%20skip.user.js
// @updateURL https://update.greasyfork.org/scripts/392208/igg-gamescom%20ad%20skip.meta.js
// ==/UserScript==
switch(window.location.host){
    case "bluemediafiles.com":{
window.location = "http"+getParameterByName("xurl");
    break;
}
    case "megaup.net":{
        let checktick = setInterval(()=>{
            let el = document.querySelector("a.btn")
            if(el){
                clearInterval(checktick);
                window.open(
  el.href,
  '_blank' // <- This is what makes it open in a new window.
);
                window.open('','_self').close()
            }
        },100)
       break;
    }
}
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}