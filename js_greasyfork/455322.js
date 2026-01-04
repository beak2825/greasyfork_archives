// ==UserScript==
// @name         Nitro Type Player Rank
// @namespace    http://tampermonkey.net/
// @version      2.0.7.17
// @description    Changes nitros to display rank
// @author       Epic NT
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @grant        GM.xmlHttpRequest
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/455322/Nitro%20Type%20Player%20Rank.user.js
// @updateURL https://update.greasyfork.org/scripts/455322/Nitro%20Type%20Player%20Rank.meta.js
// ==/UserScript==

(function() {
    'use strict';
var avgspeed= parseInt(JSON.parse(JSON.parse(localStorage.getItem("persist:nt")).user).avgSpeed);
var avgacc= parseInt(JSON.parse(JSON.parse(localStorage.getItem("persist:nt")).user).avgAcc);
var a =document.querySelectorAll('.dash-copy');
var q =0
function ifs(){
    setTimeout(function(){
    if (a.length<1){
        a=document.querySelectorAll('.dash-copy')
        ifs();
    }
    else{

var token = window.localStorage["player_token"];
GM.xmlHttpRequest ( {
   url:  "https://www.nitrotype.com/api/v2/stats/data/lastdays?limit=7&token="+token.toString(),
   method:     "GET",
   onload:        function(response) {
    var races= (JSON.parse(response.responseText));
var race =0;
for (let i = 0; i <7; i++) {
  race += parseInt(races["results"]["logs"][i]["races"])
}
var points = (100+avgspeed/2)*(avgacc/100)
var point = (points*race)
console.log(point)
var rank=point/10000
rank=4800/rank
rank=Math.floor(rank-23)
console.log(rank)
setTimeout(function(){
var b = document.createElement('a');
b.setAttribute('href','https://nitrotype.com/racer/aaaaaaaklah');
b.innerHTML = 'Donate';
// apend the anchor to the body
// of course you can append it almost to any other dom element
document.querySelector("#raceContainer > div.racev3-ui > div.dash > div.dash-content > div:nth-child(3) > div > div.tsxxl.mbf.tlh-1").textContent=''
var a = document.createElement('a');
a.style.color= "white"
a.setAttribute("target","_blank")

a.setAttribute("rel","noopener noreferrer")

b.setAttribute("rel","noopener noreferrer")

b.style.color= "white"
a.style.fontSize= "large"
b.style.fontSize= "large"
b.setAttribute("target","_blank")
a.style.left="150px"
b.style.left="150px"
a.setAttribute('href','https://docs.google.com/spreadsheets/d/1M_5hmBgVos6MYrvFuNN-X8lnAgDEJNv2IMUq4ED8dbo/edit?usp=sharing');
a.innerHTML = 'Rank: '+rank.toString();
// apend the anchor to the body
// of course you can append it almost to any other dom element
document.querySelector("#raceContainer > div.racev3-ui > div.dash > div.dash-content > div:nth-child(3) > div > div.tsxxl.mbf.tlh-1").appendChild(a);
document.querySelector("#raceContainer > div.racev3-ui > div.dash > div.dash-content > div:nth-child(3) > div > div.tsxs.tc-ts.ttu").innerHTML='';
document.querySelector("#raceContainer > div.racev3-ui > div.dash > div.dash-content > div:nth-child(3) > div > div.tsxs.tc-ts.ttu").appendChild(b)
    },4000);
}
});
}
  },500);
}
ifs();
})();