// ==UserScript==
// @name         AnIppo
// @namespace    none
// @version      0.3
// @description  Internet positif is fuckin annoying
// @author       Chezt
// @connect      *
// @grant        none
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/18598/AnIppo.user.js
// @updateURL https://update.greasyfork.org/scripts/18598/AnIppo.meta.js
// ==/UserScript==

if(window.location.hostname == "internetpositif.uzone.id") {
    if(document.referrer !== null) {
        history.replaceState(null, null, "http://" + window.location.hostname + "#RealUrl=" + document.referrer);
        document.title = "Inet positip embe :/";

        var body = document.body;
        var text = "Inetpositip berulah, </br> gunain proxy gih </br> ini link aslinya </br> <h3> <a href='" + document.referrer +"'>" + document.referrer + "</a> </h3>";

        if(body === null) {
            document.createElement("body").innerHTML = text;
        } else {
            body.innerHTML = text;
        }
    }
}

(function() {
    'use strict';
    var _checkTryAnipoLimit = 10; // Limit Try
    var _checkTryAnipoSpeed = 500; // value / 1000 = detik
    var _checkTryAnipoA = 0;
    var _checkTryAnipoB = 0;
    var cfs_script;
     function inetPositifEmbe() {
         if(typeof cfs_closed === "undefined") {
             return;
         }
         var _instifBody = document.body;
         var _instifCfs = document.getElementById("cfs_top_div");
         var _asli = document.getElementById("cfs_div_2");
         if(_instifCfs !== null)
            _instifCfs.remove();
         if(_asli !== null)
            _instifBody.innerHTML = _asli.innerHTML;
         if(_instifCfs !== null && _asli !== null) {
             _instifCfs.remove();
             _instifBody.innerHTML = _asli.innerHTML;
             return;
         }


         return setTimeout(_checkVarInetPositif, _checkTryAnipoSpeed / 2);
     }
    document.onreadystatechange = function () {
        if(document.readyState === 'complete') {
            return setTimeout(_checkVarInetPositif, _checkTryAnipoSpeed, true);
        }
    };
    // cek jika asyc inetpositip udah kelar
    function _checkVarInetPositif(isReady) {
        isReady = typeof isReady !== 'undefined' ? isReady : false; // Gak bisa ES6 :(
        cfs_script = null;
        if(typeof cfs_closed !== "undefined") {
            cfs_script = null;
            cfs_script_r = null;
            cfs_closed = 0;
            inetPositifEmbe(); // Cek jika sudah terlanjur ke inject :<
            return;
        }
        if(!isReady) {
        _checkTryAnipoB++;
        if(_checkTryAnipoB > _checkTryAnipoLimit)
            return;
        } else{
        _checkTryAnipoA++;
        if(_checkTryAnipoA > _checkTryAnipoLimit)
            return;
        }
        return setTimeout(_checkVarInetPositif, _checkTryAnipoSpeed);
    }
    _checkVarInetPositif();
    // Coba cek cepet jika variable sudah ada maka override
    cfs_script = (function() {
        if(typeof cfs_closed !== "undefined")
            GM_log("ffs spidol stop inject ur fuckin ads");
    })();
})();