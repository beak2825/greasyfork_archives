// ==UserScript==
// @name         NGA hidden message auto open
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  simple but useful
// @author       GitHub: isaacveg
// @match        *://*.nga.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421570/NGA%20hidden%20message%20auto%20open.user.js
// @updateURL https://update.greasyfork.org/scripts/421570/NGA%20hidden%20message%20auto%20open.meta.js
// ==/UserScript==

var pageURLCheckTimer = setInterval (
    function () {
        if (    this.lastPathStr  !== location.pathname
            ||  this.lastQueryStr !== location.search
            ||  this.lastPathStr   === null
            ||  this.lastQueryStr  === null
           ) {
            this.lastPathStr  = location.pathname;
            this.lastQueryStr = location.search;
            setTimeout(gmMain,500);
        }
    }
    , 100
);

function gmMain () {
    var x = document.getElementsByName("lessernukeblk");
    for(var i=0;i<x.length;i++)
    {x[i].style.display = ""}
    x = document.getElementsByClassName("lessernuke lessernuke2")
    while(x.length != 0)
    {
        x[0].className = "postcontent ubbcode"
    }
}