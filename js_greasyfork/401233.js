// ==UserScript==
// @name         Remover IP Auto
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remover seu ip de todos os logs
// @match        http://*.hackerwars.io/*
// @match        http://hackerwars.io/*
// @match        https://*.hackerwars.io/*
// @match        https://hackerwars.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/401233/Remover%20IP%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/401233/Remover%20IP%20Auto.meta.js
// ==/UserScript==
if (window.self !== window.top) return;

Array.prototype.contains = function(s) {
    return this.indexOf(s) !== -1;
};
String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
};
var g_IP = "";
function PegarIP()
{
    var IPTeste = document.getElementsByClassName("header-ip-show")[0].innerText.trim();
    if (IPTeste !== null && IPTeste !== undefined && IPTeste !== "" && IPTeste !== " " && IPTeste !== g_IP) {
        g_IP = IPTeste;
    }
}

function Editar()
{
    var Log = document.getElementsByClassName("logarea")[0];
    if( Log === null  || Log === undefined || Log === "" || Log === " ")
    {
        return;
    }
    if($(".logarea").text() === ""){
        return;
    }
    var Linhas = $( ".logarea" ).text().split("\n");
    var StrDepois = "";
    var MeuIP = g_IP;
    if($( ".logarea" ).text().contains(MeuIP) === false)
    {
        return;
    }
    for(var i = 0; i < Linhas.length; i++ )
    {
        if(Linhas[i].contains(MeuIP))
        {
            continue;            
        }else{
            if(i === Linhas.length - 1){
                StrDepois += Linhas[i];
            }else{
                StrDepois += Linhas[i] + "\n";
            }
            
        }
    }
    
    $( ".logarea" ).val( StrDepois );
    $( "form.log" ).submit();
}

setTimeout(function() {
    PegarIP();
    Editar();
}, 100);