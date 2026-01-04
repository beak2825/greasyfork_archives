// ==UserScript==
// @name        Lumendatabase - Make links clickable
// @namespace   KD Script
// @match       https://lumendatabase.org/notices/*
// @grant       none
// @version     1.0
// @author      KD
// @description Make links on Lumendatabase clickable!
// @downloadURL https://update.greasyfork.org/scripts/469081/Lumendatabase%20-%20Make%20links%20clickable.user.js
// @updateURL https://update.greasyfork.org/scripts/469081/Lumendatabase%20-%20Make%20links%20clickable.meta.js
// ==/UserScript==



document.querySelectorAll(".infringing_url").forEach(i=>{
let data= i.textContent.split(" ");
let other= data.slice(1).join(" ");
let link= `<a href="http://${data[0]}">${data[0]}</a> `;
i.innerHTML= link; //+ other;
});


/* Uncomment "+ other;" in the last line to
see the amount of URLs on a specific domain.
I personally feel it's unnecessary information */

