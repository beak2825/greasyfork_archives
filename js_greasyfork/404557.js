// ==UserScript==
// @name         Krunker.io Hack KR
// @description  A Krunker.io Tampermonkey Script To Increase KR
// @version      1.0.0
// @author       Uploader
// @include      /^(https?:\/\/)?(www\.)?(.+)krunker\.io(|\/|\/\?.+)$/
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/351381
// @downloadURL https://update.greasyfork.org/scripts/404557/Krunkerio%20Hack%20KR.user.js
// @updateURL https://update.greasyfork.org/scripts/404557/Krunkerio%20Hack%20KR.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', _ => {
    var kr = document.getElementById('menuKRCount');
    var Lvl = document.getElementById('menuLevelText');
    var username = document.getElementById('menuAccountUsername');
setInterval(() => {
    var kr2 = document.getElementsByClassName('floatR')[5];
    var clan = document.getElementsByClassName("floatR")[1];
    var Lvl2 = document.getElementsByClassName("floatR")[2];
    var score = document.getElementsByClassName("floatR")[3];
    var kills = document.getElementsByClassName("floatR")[6];
    var deaths = document.getElementsByClassName("floatR")[7];
    var KDR = document.getElementsByClassName("floatR")[8];
    var Nukes = document.getElementsByClassName("floatR")[9];
    var Melee = document.getElementsByClassName("floatR")[10];
    var GP = document.getElementsByClassName("floatR")[11];
    var GW = document.getElementsByClassName("floatR")[12];
    var WL = document.getElementsByClassName("floatR")[13];
    var TP = document.getElementsByClassName("floatR")[14];
    var username2 = document.getElementsByClassName('floatR')[0];
    var FPS = document.getElementById("menuFPS");
    var num = Math.ceil(Math.random() * 100);
    var currentKr = parseInt(kr.innerText);
    var bigkr = currentKr + num;
    kr.innerText = bigkr;
    Lvl.innerText = "LVL " + bigkr;
    kr2.innerHTML = bigkr + "KR ";
    Nukes.innerHTML = bigkr;
    KDR.innerHTML = "9.69"
    deaths.innerHTML = bigkr;
    kills.innerHTML = bigkr;
    score.innerHTML = bigkr;
    Lvl2.innerHTML = bigkr;
    clan.innerHTML = "Omen";
    Melee.innerHTML = bigkr;
    GP.innerHTML = bigkr;
    GW.innerHTML = bigkr;
    WL.innerHTML = "1337.69";
    TP.innerHTML = bigkr + "h " + bigkr + "m";
    username.innerHTML = "PROTECTED";
    username2.innerHTML = "PROTECTED";
    FPS.innerHTML = bigkr;
});
    //var kr = document.getElementById("menuKRCount");
    //setInterval(() => kr.innerText++);
   // if(kr.innerText != "99999"){
  //    //setInterval(() => kr.innerText++);
   // }
}, false);
