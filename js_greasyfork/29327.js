// ==UserScript==
// @name         Hordes.io character token manager.
// @version      2.0
// @description  Manages your hordes.io tokens.
// @author       Center-Z
// @match        http://hordes.io/*
// @namespace https://greasyfork.org/users/120068
// @downloadURL https://update.greasyfork.org/scripts/29327/Hordesio%20character%20token%20manager.user.js
// @updateURL https://update.greasyfork.org/scripts/29327/Hordesio%20character%20token%20manager.meta.js
// ==/UserScript==

(()=>{
var abashida = document.createElement("script");
var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
abashida.innerHTML = "var x10 = "+a[11]+a[14]+a[2]+a[0]+a[11]+a[44]+a[19]+a[14]+"r"+a[0]+"ge\ndelete window."+a[11]+a[14]+a[2]+a[0]+a[11]+a[44]+a[19]+a[14]+"r"+a[0]+"ge";
document.body.append(abashida);
})();
$(window).on('load', ()=>{
    (()=>{
    var ggOP = ["createElement", "append"];
    var abashida = document[ggOP[0]]("script");
    if (typeof x10.reTusdjel !== "string" || x10.getItem("reTusdjel") === null) {
        var ejXz = [];
        var tmp = prompt('Please enter your login token(s) seperated by spaces. (enter nothing to disable this feature): ');
        if (tmp !== null) {
            tmp = tmp.split(' ');
            for (var i in tmp) {
                ejXz.push(tmp[i]);
            }
        } else { ejXz[0] = 'None'; }
        x10.setItem("reTusdjel", JSON.stringify(ejXz));
        tmp = '';
        abashida.innerHTML = "<script>x10 = null;</script>";
        x10 = null;
        window.location.reload();
    } else if (JSON.parse(x10.getItem("reTusdjel")) !== ["None"]) {
        document.body.append(abashida);
        var ejXz = JSON.parse(x10.reTusdjel);
        var txt = [];
        for (var i = 0; i < ejXz.length; i++) {
            n = i+1;
            txt.push(n+".)"+ejXz[i]+"\n");
        }
        var c = prompt('Select token:\n'+txt.join('')+'\nOr enter a new token to add it to the list.(Type token again to remove it)');
        if (isNaN(c)) {

            if (ejXz.includes(c)) { if (ejXz.indexOf(c) !== 0) { ejXz.splice(ejXz.indexOf(c), 1); } else { ejXz.shift(); } } else { ejXz.push(c); }
            x10.reTusdjel = JSON.stringify(ejXz);
            x10 = null;
            window.location.reload();
        } else {
            $("#"+a[11]+a[14]+a[6]+a[8]+a[13]+a[45]+a[0]+a[1]+"Id")[0].value = ejXz[c-1];
            setTimeout(()=> { $("#loginTabButton")[0].click(); }, 100);
            x10 = null;
        }
    }
    })();
});