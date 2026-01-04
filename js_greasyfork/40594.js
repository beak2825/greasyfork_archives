// ==UserScript==
// @name         deezer download album art
// @version      0.1
// @match http://www.deezer.com/en/album/*
// @match https://www.deezer.com/en/album/*
// @description:en   Download Deezer art
//@run-at document-idle
// @namespace https://greasyfork.org/users/179845
// @description Download Deezer art
// @downloadURL https://update.greasyfork.org/scripts/40594/deezer%20download%20album%20art.user.js
// @updateURL https://update.greasyfork.org/scripts/40594/deezer%20download%20album%20art.meta.js
// ==/UserScript==

var i = setInterval(function ()
    {
        if (document.getElementById("page_loader").children[0].style.width=="0%")
        {
            clearInterval(i);
            document.getElementsByClassName("heading-1")[0].innerHTML="<a id='titlelink'>"+document.getElementsByClassName("heading-1")[0].innerHTML+"</a>";
            document.getElementById("titlelink").href='https://api.deezer.com/album/'+window.location.href.match(/\d{5,}/)[0]+'/image?size=xl';
            document.getElementById("titlelink").download=document.getElementById("titlelink").innerHTML+".jpg";
        }
    }, 100);