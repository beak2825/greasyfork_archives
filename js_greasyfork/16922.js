// ==UserScript==
// @name        Hide comment from torrent list
// @namespace   Sality
// @description hide torrent comment from torrent list.
// @include     *kat.cr/*
// @version     0.1 Beta
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16922/Hide%20comment%20from%20torrent%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/16922/Hide%20comment%20from%20torrent%20list.meta.js
// ==/UserScript==


    
try{
    
    
   var pathname = window.location.pathname;
    //Spam Testing script -----------------------------------------------------------------------------------------------------------------------------------------------
    
    if ((pathname.indexOf('\/user\/') != 0)&&(pathname.indexOf('\/community\/') != 0)&&(pathname.indexOf('\/messenger\/') != 0)){
    if ($('div.mainpart table.data').length) {
        
      $('table.data div.iaconbox  a.icommentjs').css({"display":"none"});
}
}

}//try end
    catch(ex){
        console.log("Hide comment :Error IN script /Page . Inform Sality");
        }